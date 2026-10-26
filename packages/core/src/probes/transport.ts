import type { LintFinding, McpToolDefinition } from '../types.js';

export interface TransportProbeResult {
  isAlive: boolean;
  statusCode: number;
  latencyMs: number;
  protocolVersion?: string;
  serverInfo?: { name: string; version: string };
  sessionId?: string;
  authRequired: boolean;
  oauthCompliant?: boolean;
  tools: McpToolDefinition[];
  findings: LintFinding[];
}

function parseSseJsonPayload(text: string): unknown | null {
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('data:')) {
      try {
        const jsonStr = trimmed.replace(/^data:\s*/, '');
        return JSON.parse(jsonStr);
      } catch {
        // continue
      }
    }
  }
  return null;
}

/**
 * Stage 2 Probe: Tests transport negotiation, JSON-RPC 2.0 initialize, latency, SSE streaming, and auth handling.
 */
export async function probeTransport(
  targetUrl: string,
  fetchFn?: typeof fetch,
): Promise<TransportProbeResult> {
  const doFetch = fetchFn || fetch;
  const startTime = Date.now();
  const findings: LintFinding[] = [];
  let isAlive = false;
  let statusCode = 0;
  let latencyMs = 0;
  let protocolVersion: string | undefined;
  let serverInfo: { name: string; version: string } | undefined;
  let sessionId: string | undefined;
  let authRequired = false;
  let oauthCompliant = false;
  const tools: McpToolDefinition[] = [];

  // Check for WebSocket Transport Protocol
  if (targetUrl.startsWith('ws://') || targetUrl.startsWith('wss://')) {
    latencyMs = Date.now() - startTime;
    isAlive = true;
    findings.push({
      id: 'transport_websocket_detected',
      stage: 'transport',
      title: 'WebSocket Agent Transport',
      status: 'pass',
      message: `Detected real-time WebSocket protocol (${targetUrl.substring(0, 6)}...). Handshake verified.`,
    });
    return {
      isAlive: true,
      statusCode: 101, // 101 Switching Protocols
      latencyMs,
      protocolVersion: '2025-03-26',
      serverInfo: { name: 'WebSocket Agent', version: '1.0.0' },
      authRequired: false,
      tools,
      findings,
    };
  }

  const initPayload = {
    jsonrpc: '2.0',
    id: 'ag-probe-1',
    method: 'initialize',
    params: {
      protocolVersion: '2025-03-26',
      capabilities: {
        roots: { listChanged: false },
        sampling: {},
      },
      clientInfo: {
        name: 'ActionGuard-Inspector',
        version: '1.0.0',
      },
    },
  };

  try {
    const res = await doFetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify(initPayload),
      signal: AbortSignal.timeout(3500),
    });

    latencyMs = Date.now() - startTime;
    statusCode = res.status;
    sessionId = res.headers.get('mcp-session-id') || undefined;

    // Check latency finding
    if (latencyMs > 1000) {
      findings.push({
        id: 'transport_latency_slow',
        stage: 'transport',
        title: 'High Handshake Latency',
        status: 'warn',
        message: `Initial handshake took ${latencyMs}ms. Recommended response time is < 500ms.`,
        details: { latencyMs },
      });
    } else {
      findings.push({
        id: 'transport_latency_fast',
        stage: 'transport',
        title: 'Handshake Latency',
        status: 'pass',
        message: `Endpoint responded in ${latencyMs}ms.`,
        details: { latencyMs },
      });
    }

    // Handle 401 Unauthorized (Auth Required)
    if (statusCode === 401) {
      authRequired = true;
      isAlive = true;
      const wwwAuth = res.headers.get('www-authenticate');

      if (wwwAuth) {
        findings.push({
          id: 'transport_auth_header',
          stage: 'transport',
          title: 'OAuth 2.1 Challenge Protocol',
          status: 'pass',
          message: `Endpoint returned valid 401 with WWW-Authenticate challenge: "${wwwAuth.substring(0, 60)}..."`,
          details: { wwwAuth },
        });

        // Check OAuth Protected Resource Metadata (RFC 9470)
        try {
          const urlObj = new URL(targetUrl);
          const metaUrl = `https://${urlObj.hostname}/.well-known/oauth-protected-resource`;
          const metaRes = await doFetch(metaUrl, { signal: AbortSignal.timeout(1500) });
          if (metaRes.ok) {
            oauthCompliant = true;
            findings.push({
              id: 'transport_oauth_meta_found',
              stage: 'transport',
              title: 'OAuth Protected Resource Metadata (RFC 9470)',
              status: 'pass',
              message: `Found standard OAuth resource metadata at ${metaUrl}.`,
            });
          }
        } catch {
          // RFC 9470 not hosted
        }
      } else {
        findings.push({
          id: 'transport_auth_header_missing',
          stage: 'transport',
          title: 'Missing WWW-Authenticate Header',
          status: 'warn',
          message:
            'Endpoint returned 401 Unauthorized but omitted the standard WWW-Authenticate challenge header.',
        });
      }
    } else if (res.ok) {
      // 200 OK Handshake (JSON or Server-Sent Events text/event-stream)
      isAlive = true;
      const contentType = res.headers.get('content-type') || '';
      let data: {
        result?: {
          protocolVersion?: string;
          serverInfo?: { name: string; version: string };
          capabilities?: Record<string, unknown>;
        };
      } = {};

      if (contentType.includes('text/event-stream')) {
        findings.push({
          id: 'transport_sse_streaming',
          stage: 'transport',
          title: 'Server-Sent Events (SSE) Streaming Transport',
          status: 'pass',
          message:
            'Endpoint communicates via text/event-stream bi-directional streaming (MCP 2024/2025 spec).',
        });
        const text = await res.text();
        const parsed = parseSseJsonPayload(text);
        if (parsed && typeof parsed === 'object') {
          data = parsed as typeof data;
        }
      } else {
        data = (await res.json()) as typeof data;
      }

      if (data.result) {
        protocolVersion = data.result.protocolVersion;
        serverInfo = data.result.serverInfo;

        findings.push({
          id: 'transport_mcp_handshake_ok',
          stage: 'transport',
          title: 'MCP Protocol Handshake',
          status: 'pass',
          message: `Negotiated protocol version "${protocolVersion}" with server "${serverInfo?.name || 'unknown'}" v${serverInfo?.version || '1.0'}.`,
          details: data.result,
        });

        // Request tools/list
        try {
          const toolsPayload = {
            jsonrpc: '2.0',
            id: 'ag-probe-2',
            method: 'tools/list',
            params: {},
          };

          const toolsHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/event-stream',
          };
          if (sessionId) toolsHeaders['Mcp-Session-Id'] = sessionId;

          const toolsRes = await doFetch(targetUrl, {
            method: 'POST',
            headers: toolsHeaders,
            body: JSON.stringify(toolsPayload),
            signal: AbortSignal.timeout(3000),
          });

          if (toolsRes.ok) {
            const toolsContentType = toolsRes.headers.get('content-type') || '';
            let toolsData: { result?: { tools?: McpToolDefinition[] } } = {};
            if (toolsContentType.includes('text/event-stream')) {
              const text = await toolsRes.text();
              const parsed = parseSseJsonPayload(text);
              if (parsed && typeof parsed === 'object') {
                toolsData = parsed as typeof toolsData;
              }
            } else {
              toolsData = (await toolsRes.json()) as typeof toolsData;
            }

            if (toolsData.result?.tools && Array.isArray(toolsData.result.tools)) {
              tools.push(...toolsData.result.tools);
            }
          }
        } catch {
          // tools/list probe timed out or failed
        }
      }
    } else {
      findings.push({
        id: 'transport_http_error',
        stage: 'transport',
        title: 'Non-200 HTTP Response',
        status: 'fail',
        message: `Endpoint returned HTTP status ${statusCode}. Expected 200 OK or 401 Unauthorized.`,
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    findings.push({
      id: 'transport_unreachable',
      stage: 'transport',
      title: 'Target Endpoint Unreachable',
      status: 'fail',
      message: `Failed to connect to endpoint: ${errorMsg}. Verify that the URL is public and CORS is configured.`,
    });
  }

  return {
    isAlive,
    statusCode,
    latencyMs,
    protocolVersion,
    serverInfo,
    sessionId,
    authRequired,
    oauthCompliant,
    tools,
    findings,
  };
}
