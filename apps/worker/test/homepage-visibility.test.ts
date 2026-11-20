import { describe, expect, it } from 'vitest';
import { renderHomepageHtml } from '../src/ui.js';
import { renderVerifyHtml } from '../src/verify.js';

describe('Homepage public samples', () => {
  it('uses a neutral verification placeholder', () => {
    const html = renderVerifyHtml();
    expect(html).not.toContain('analytics.where.care');
    expect(html).toContain('example.com');
  });
  it('does not advertise hidden owner fleet endpoints', () => {
    const html = renderHomepageHtml();
    for (const endpoint of [
      'analytics.where.care',
      'mcp.families.care',
      'mcp.llmrank.app',
      'actionguard-worker.luis-diaz-s.workers.dev',
    ]) {
      expect(html).not.toContain(endpoint);
      expect(html).not.toContain(encodeURIComponent(endpoint));
    }
    expect(html).not.toContain('Where.Care MCP');
    expect(html).toContain('GitHub MCP');
    expect(html).toContain('ActionGuard Live MCP');
  });
});
