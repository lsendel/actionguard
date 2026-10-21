import { describe, expect, it } from 'vitest';
import { type McpToolDefinition, isSafeTargetUrl, runInspection } from '../src/index.js';

describe('Probes & Live Inspector', () => {
  it('enforces SSRF protection against private IPs and loopbacks', () => {
    expect(isSafeTargetUrl('http://localhost:8080/mcp').isSafe).toBe(false);
    expect(isSafeTargetUrl('http://127.0.0.1:3000').isSafe).toBe(false);
    expect(isSafeTargetUrl('http://10.0.0.5/api').isSafe).toBe(false);
    expect(isSafeTargetUrl('http://192.168.1.1').isSafe).toBe(false);
    expect(isSafeTargetUrl('http://169.254.169.254/latest/meta-data').isSafe).toBe(false);
    expect(isSafeTargetUrl('ftp://example.com').isSafe).toBe(false);

    expect(isSafeTargetUrl('https://example.com/mcp').isSafe).toBe(true);
    expect(isSafeTargetUrl('https://api.github.com').isSafe).toBe(true);
  });

  it('orchestrates 5-stage inspection and produces structured report', async () => {
    const mockTools: McpToolDefinition[] = [
      {
        name: 'fetch_stock_quote',
        description: 'Returns real-time price quotes for equity tickers.',
        inputSchema: {
          type: 'object',
          properties: {
            ticker: { type: 'string', description: 'Stock symbol like AAPL' },
          },
          required: ['ticker'],
        },
        annotations: { readOnlyHint: true },
      },
    ];

    const report = await runInspection('https://example.com/mcp', {
      mockTools,
    });

    expect(report.id).toMatch(/^rep_/);
    expect(report.targetDomain).toBe('example.com');
    expect(report.score.numericalScore).toBeGreaterThanOrEqual(0);
    expect(report.hashes.schema_sha256).toBeDefined();
    expect(report.hashes.descriptions_sha256).toBeDefined();
    expect(report.findings.length).toBeGreaterThan(0);
    expect(report.tools.length).toBe(1);
    expect(report.generatedArtifacts.mcpServerJson).toContain('server.schema.json');
    expect(report.generatedArtifacts.a2aAgentCardJson).toContain('fetch_stock_quote');
  });
});
