import { validateAndTrackKey } from './keys.js';
import type { Env } from './types.js';

// Suspicious patterns that indicate runtime prompt injection or data exfiltration
const RUNTIME_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(all\s+)?(instructions|rules|context)/i,
  /system\s+prompt\s*:/i,
  /output\s+(the\s+)?(full\s+)?system\s+(prompt|instructions)/i,
  /reveal\s+(the\s+)?(system|internal)\s+(prompt|instructions)/i,
  /you\s+are\s+now\s+(in\s+)?developer\s+mode/i,
  /bypass\s+(all\s+)?security\s+protocols/i,
  /!\[.*?\]\(https?:\/\/[^\s\)]+\)/i, // Markdown image exfiltration
  /<script[\s>]/i,
  /javascript:/i,
];

function scanArgumentsForAdversarialPayload(obj: unknown): string | null {
  if (typeof obj === 'string') {
    for (const pattern of RUNTIME_INJECTION_PATTERNS) {
      if (pattern.test(obj)) {
        return `Adversarial pattern matched: ${pattern.toString()}`;
      }
    }
    return null;
  }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const match = scanArgumentsForAdversarialPayload(item);
      if (match) return match;
    }
    return null;
  }
  if (obj && typeof obj === 'object') {
    for (const val of Object.values(obj)) {
      const match = scanArgumentsForAdversarialPayload(val);
      if (match) return match;
    }
  }
  return null;
}

export async function handleProxyRequest(
  req: Request,
  env: Env,
  targetUrlParam?: string,
  pinnedHashParam?: string,
  slugParam?: string,
): Promise<Response> {
  const serviceSlug =
    slugParam ||
    req.headers.get('x-actionguard-service') ||
    new URL(req.url).searchParams.get('service');

  let targetUrl =
    targetUrlParam ||
    req.headers.get('x-actionguard-target') ||
    new URL(req.url).searchParams.get('target');

  // Automatic slug-to-target resolution from D1 catalog if target is not directly provided
  if (!targetUrl && serviceSlug && env.actionguard_db) {
    const resolved = await env.actionguard_db
      .prepare(
        `SELECT e.url, e.current_schema_sha256, s.display_name, s.slug
         FROM services s
         JOIN service_endpoints e ON s.id = e.service_id
         WHERE s.slug = ? OR LOWER(s.canonical_domain) = ?
         LIMIT 1`,
      )
      .bind(serviceSlug, serviceSlug.toLowerCase())
      .first<{
        url: string;
        current_schema_sha256: string;
        display_name: string;
        slug: string;
      }>();
    if (resolved?.url) {
      targetUrl = resolved.url;
    }
  }

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
            'ActionGuard Proxy: Missing upstream target URL or unresolvable service slug. Provide /proxy/:slug or ?target=https://...',
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

  // 3. Runtime Zero-Trust Inspection for JSON-RPC tools/call
  let requestBodyText: string | null = null;
  if (req.method === 'POST') {
    try {
      requestBodyText = await req.text();
      const parsedBody = JSON.parse(requestBodyText) as {
        id?: unknown;
        method?: string;
        params?: {
          name?: string;
          arguments?: Record<string, unknown>;
        };
      };

      if (parsedBody && (parsedBody.method === 'tools/call' || parsedBody.method === 'call_tool')) {
        const toolName = parsedBody.params?.name || 'unknown_tool';
        const toolArgs = parsedBody.params?.arguments;

        // Scan arguments for adversarial prompt injection or exfiltration payloads
        if (toolArgs) {
          const violation = scanArgumentsForAdversarialPayload(toolArgs);
          if (violation) {
            return new Response(
              JSON.stringify({
                jsonrpc: '2.0',
                id: parsedBody.id ?? null,
                error: {
                  code: -32602,
                  message:
                    'ActionGuard Zero-Trust Firewall: Execution blocked. Adversarial prompt injection or data exfiltration pattern detected in tool arguments.',
                  data: {
                    status: 'BLOCKED_PROMPT_INJECTION',
                    tool: toolName,
                    violation,
                  },
                },
              }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'X-ActionGuard-Firewall': 'blocked-injection',
                  'X-ActionGuard-Status': 'BLOCKED_SECURITY_VIOLATION',
                },
              },
            );
          }
        }
      }
    } catch {
      // If body is not JSON, proceed transparently
    }
  }

  // 4. Transparent Low-Latency Edge Proxy Execution
  const startTime = Date.now();
  const forwardHeaders = new Headers(req.headers);
  forwardHeaders.delete('host');
  forwardHeaders.delete('x-actionguard-target');
  forwardHeaders.delete('x-actionguard-pin');
  forwardHeaders.delete('x-actionguard-service');
  forwardHeaders.set('User-Agent', 'ActionGuard-Security-Proxy/1.0 (+https://actionguard.ai)');

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body:
        req.method !== 'GET' && req.method !== 'HEAD'
          ? requestBodyText !== null
            ? requestBodyText
            : req.body
          : undefined,
      signal: AbortSignal.timeout(10000),
    });

    const latencyMs = Date.now() - startTime;
    const responseHeaders = new Headers(upstreamRes.headers);
    responseHeaders.set('X-ActionGuard-Proxy', 'active');
    responseHeaders.set('X-ActionGuard-Firewall', 'inspected');
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
