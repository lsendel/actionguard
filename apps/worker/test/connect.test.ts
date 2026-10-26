import { describe, expect, it } from 'vitest';
import { generateIdeConfig, renderConnectHtml } from '../src/connect-ui.js';

describe('Multi-IDE One-Click Config Generator', () => {
  const service = {
    slug: 'filesystem-mcp',
    name: 'Secure Filesystem MCP',
    url: 'https://filesystem.example.com/mcp',
    pinnedHash: 'b4a8c9e123456789abcdef0123456789abcdef0123456789abcdef0123456789',
  };

  it('generates Claude Desktop config with proxy and pinned hash header', () => {
    const jsonStr = generateIdeConfig('claude', service, true);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.mcpServers['filesystem-mcp']).toBeDefined();
    expect(parsed.mcpServers['filesystem-mcp'].url).toBe(
      'https://actionguard.ai/proxy/filesystem-mcp',
    );
    expect(parsed.mcpServers['filesystem-mcp'].headers['x-actionguard-pin']).toBe(
      service.pinnedHash,
    );
  });

  it('generates Cursor config with direct URL when proxy is disabled', () => {
    const jsonStr = generateIdeConfig('cursor', service, false);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.mcpServers['filesystem-mcp']).toBeDefined();
    expect(parsed.mcpServers['filesystem-mcp'].url).toBe('https://filesystem.example.com/mcp');
    expect(parsed.mcpServers['filesystem-mcp'].headers).toBeUndefined();
  });

  it('generates VS Code settings format with mcp.servers', () => {
    const jsonStr = generateIdeConfig('vscode', service, true);
    const parsed = JSON.parse(jsonStr);

    expect(parsed['mcp.servers']['filesystem-mcp']).toBeDefined();
    expect(parsed['mcp.servers']['filesystem-mcp'].url).toContain('/proxy/');
  });

  it('generates Zed settings format with context_servers and endpoint key', () => {
    const jsonStr = generateIdeConfig('zed', service, true);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.context_servers['filesystem-mcp']).toBeDefined();
    expect(parsed.context_servers['filesystem-mcp'].endpoint).toContain('/proxy/');
  });

  it('renders connect HTML page with IDE selector tabs', () => {
    const html = renderConnectHtml(service);
    expect(html).toContain('1-Click Agent Client Configurator');
    expect(html).toContain('Claude Desktop');
    expect(html).toContain('Cursor');
    expect(html).toContain('VS Code');
    expect(html).toContain('filesystem-mcp');
  });
});
