import { describe, expect, it } from 'vitest';
import { renderRssFeedXml } from '../src/feed.js';
import { renderStatusHtml } from '../src/status-ui.js';

describe('Public Ecosystem Status & Global Feed', () => {
  it('renders status dashboard with metrics and service items', () => {
    const html = renderStatusHtml({
      services: [
        {
          id: 'srv_1',
          slug: 'github-mcp',
          display_name: 'GitHub MCP Server',
          canonical_domain: 'api.github.com',
          overall_grade: 'A+',
          verification_tier: 'Domain Verified',
          url: 'https://api.github.com/mcp',
          last_status: 'up',
          last_latency_ms: 38,
          current_schema_sha256: 'a1b2c3d4e5f6',
        },
      ],
      totalServers: 1,
      onlineCount: 1,
      averageLatencyMs: 38,
      recentDrifts: [],
    });

    expect(html).toContain('MCP Ecosystem Health &amp; Global Status');
    expect(html).toContain('All Systems Operational');
    expect(html).toContain('100.0%');
    expect(html).toContain('GitHub MCP Server');
    expect(html).toContain('38ms');
    expect(html).toContain('https://actionguard.ai/feed.xml');
  });

  it('renders valid RSS 2.0 XML feed with channel metadata', () => {
    const xml = renderRssFeedXml([
      {
        title: 'Schema Baseline: Filesystem MCP',
        link: 'https://actionguard.ai/servers/filesystem-mcp',
        description: 'Point-in-time schema fingerprint recorded.',
        pubDate: new Date().toUTCString(),
        guid: 'snap_123',
      },
    ]);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain(
      '<title>ActionGuard &bull; MCP Ecosystem Schema Drift &amp; Integrity Feed</title>',
    );
    expect(xml).toContain('Schema Baseline: Filesystem MCP');
    expect(xml).toContain('<guid isPermaLink="false">snap_123</guid>');
  });
});
