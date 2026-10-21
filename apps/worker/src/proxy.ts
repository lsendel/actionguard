import { validateAndTrackKey } from './keys.js';
import type { Env } from './types.js';

export async function handleProxyRequest(
  req: Request,
  env: Env,
  targetUrlParam?: string,
  pinnedHashParam?: string,
): Promise<Response> {
  const targetUrl =
    targetUrlParam ||
    req.headers.get('x-actionguard-target') ||
    new URL(req.url).searchParams.get('target');

  const rawPin =
    pinnedHashParam ??
    req.headers.get('x-actionguard-pin') ??
    new URL(req.url).searchParams.get('pin');

  // Refuse empty pin or empty-string SHA-256 fallback
  const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  if (rawPin !== null && rawPin !== undefined) {
    const trimmed = rawPin.trim();
    if (!trimmed || trimmed === EMPTY_SHA256) {
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32602,
            message:
              'ActionGuard Proxy: Cryptographic pin rejected. An empty pin or empty-string SHA-256 cannot be used.',
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
  }
  const pinnedHash = rawPin ? rawPin.trim() : null;

  const serviceSlug =
    req.headers.get('x-actionguard-service') || new URL(req.url).searchParams.get('service');

  // 0. API Key Authentication & Quota Enforcement
  const authHeader = req.headers.get('authorization');
  const apiKey =
    req.headers.get('x-actionguard-key') ||
    (authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : undefined);

  let clientTier = 'community';
  let quotaRemaining: number | undefined;

  if (apiKey) {
    const keyCheck = await validateAndTrackKey(env, apiKey);
    if (!keyCheck.valid) {
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: `ActionGuard Auth: ${keyCheck.error}`,
          },
        }),
        {
          status: keyCheck.error?.includes('quota') ? 429 : 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
    clientTier = keyCheck.tier || 'free';
    quotaRemaining = keyCheck.quotaRemaining;
  }

  if (!targetUrl) {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32602,
          message:
            'ActionGuard Proxy: Missing upstream target URL. Provide ?target=https://... or header X-ActionGuard-Target.',
        },
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // 1. SSRF & URL Validation
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Unsupported protocol');
    }
    const host = parsedUrl.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('172.16.') ||
      host === '169.254.169.254'
    ) {
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: 'ActionGuard SSRF Filter: Access to private and loopback networks is blocked.',
          },
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      );
    }
  } catch {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32602,
          message: 'ActionGuard Proxy: Invalid target URL provided.',
        },
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // 2. Cryptographic Pin Enforcement Check
  if (pinnedHash && env.actionguard_db) {
    const cleanDomain = parsedUrl.hostname.toLowerCase();
    const endpoint = await env.actionguard_db
      .prepare(
        `SELECT e.current_schema_sha256, e.last_status, s.display_name, s.slug
         FROM service_endpoints e
         JOIN services s ON e.service_id = s.id
         WHERE e.url = ? OR s.canonical_domain = ? OR s.slug = ? OR ? LIKE '%' || s.canonical_domain || '%'
         LIMIT 1`,
      )
      .bind(targetUrl, cleanDomain, serviceSlug || '', targetUrl)
      .first<{
        current_schema_sha256?: string;
        last_status?: string;
        display_name?: string;
        slug?: string;
      }>();

    if (endpoint?.current_schema_sha256 && endpoint.current_schema_sha256 !== pinnedHash) {
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: `ActionGuard Firewall: Execution blocked. Tool schema for ${endpoint.display_name || cleanDomain} has drifted from your pinned digest.`,
            data: {
              expected_pin: pinnedHash,
              current_recorded_hash: endpoint.current_schema_sha256,
              status: 'BLOCKED_SCHEMA_DRIFT',
              report_url: `https://actionguard.ai/servers/${endpoint.slug || cleanDomain}`,
            },
          },
        }),
        {
          status: 423, // 423 Locked
          headers: {
            'Content-Type': 'application/json',
            'X-ActionGuard-Status': 'BLOCKED_DRIFT',
            'X-ActionGuard-Pin': pinnedHash,
          },
        },
      );
    }
  }

  // 3. Transparent Low-Latency Edge Proxy Execution
  const startTime = Date.now();
  const forwardHeaders = new Headers(req.headers);
  forwardHeaders.delete('host');
  forwardHeaders.delete('x-actionguard-target');
  forwardHeaders.delete('x-actionguard-pin');
  forwardHeaders.set('User-Agent', 'ActionGuard-Security-Proxy/1.0 (+https://actionguard.ai)');

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      signal: AbortSignal.timeout(10000),
    });

    const latencyMs = Date.now() - startTime;
    const responseHeaders = new Headers(upstreamRes.headers);
    responseHeaders.set('X-ActionGuard-Proxy', 'active');
    responseHeaders.set('X-ActionGuard-Latency-Ms', latencyMs.toString());
    responseHeaders.set('X-ActionGuard-Integrity', 'verified');
    responseHeaders.set('X-ActionGuard-Tier', clientTier);
    if (quotaRemaining !== undefined) {
      responseHeaders.set('X-ActionGuard-Quota-Remaining', quotaRemaining.toString());
    }

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32000,
          message: `ActionGuard Proxy Upstream Error: ${msg}`,
        },
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
