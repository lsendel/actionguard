import { describe, expect, it } from 'vitest';
import { probeTransport } from '../src/probes/transport.js';

describe('Bi-Directional SSE & WebSocket Protocol Support', () => {
  it('detects and parses Server-Sent Events (text/event-stream) streaming payloads', async () => {
    const mockSseFetch = async () => {
      return new Response(
        'event: message\ndata: {"result":{"protocolVersion":"2025-03-26","serverInfo":{"name":"Streaming-MCP","version":"2.1.0"}}}\n\n',
        {
          status: 200,
          headers: { 'Content-Type': 'text/event-stream' },
        },
      );
    };

    const result = await probeTransport(
      'https://stream.example.com/mcp',
      mockSseFetch as unknown as typeof fetch,
    );
    expect(result.isAlive).toBe(true);
    expect(result.protocolVersion).toBe('2025-03-26');
    expect(result.serverInfo?.name).toBe('Streaming-MCP');
    expect(result.findings.some((f) => f.id === 'transport_sse_streaming')).toBe(true);
  });

  it('detects WebSocket agent transports from wss:// endpoints', async () => {
    const result = await probeTransport('wss://agent.example.com/ws');
    expect(result.isAlive).toBe(true);
    expect(result.statusCode).toBe(101);
    expect(result.findings.some((f) => f.id === 'transport_websocket_detected')).toBe(true);
  });
});
