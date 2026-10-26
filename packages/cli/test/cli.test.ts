import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const CLI_PATH = path.resolve(__dirname, '../dist/index.js');

describe('ActionGuard CLI', () => {
  it('displays help when invoked with help or no arguments', () => {
    const output = execSync(`node ${CLI_PATH} help`, { encoding: 'utf8' });
    expect(output).toContain('ActionGuard.ai CLI');
    expect(output).toContain('USAGE:');
    expect(output).toContain('actionguard inspect <url>');
    expect(output).toContain('actionguard compile');
    expect(output).toContain('actionguard check');
    expect(output).toContain('actionguard mcp');
  });

  it('compiles an actionguard manifest into registry files', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-cli-test-'));
    const manifestPath = path.join(tempDir, 'actionguard.json');
    const manifestData = {
      name: 'com.test/agent',
      domain: 'test-agent.example.com',
      title: 'Test CLI Agent',
      description: 'Test agent manifest for CLI compile verification',
      version: '1.0.0',
      endpoints: [
        {
          protocol: 'mcp',
          transport: 'streamable-http',
          url: 'https://test-agent.example.com/mcp',
        },
      ],
      capabilities: {
        tools: [
          {
            id: 'test_tool',
            name: 'Test Tool',
            description: 'A test tool description',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
      },
      dnsAid: {
        enabled: true,
        agentPrefix: 'test',
        zone: 'test-agent.example.com',
      },
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));

    const output = execSync(`node ${CLI_PATH} compile ${manifestPath}`, {
      cwd: tempDir,
      encoding: 'utf8',
    });

    expect(output).toContain('server.json');
    expect(output).toContain('.well-known/agent-card.json');
    expect(output).toContain('dns-aid.zone');
    expect(output).toContain('All manifests compiled successfully');

    expect(fs.existsSync(path.join(tempDir, 'server.json'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.well-known/agent-card.json'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'dns-aid.zone'))).toBe(true);

    // Verify generated DNS-AID zone has no governance claims
    const zoneContent = fs.readFileSync(path.join(tempDir, 'dns-aid.zone'), 'utf8');
    expect(zoneContent).not.toContain('Linux Foundation');
    expect(zoneContent).not.toContain('governed under');

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('handles MCP stdio protocol commands properly', () => {
    const input = `${[
      JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }),
      JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }),
      JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'ping' }),
    ].join('\n')}\n`;

    const output = execSync(`node ${CLI_PATH} mcp`, {
      input,
      encoding: 'utf8',
    });

    const lines = output.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(3);

    const initRes = JSON.parse(lines[0]) as {
      id: number;
      result: { serverInfo: { name: string } };
    };
    expect(initRes.id).toBe(1);
    expect(initRes.result.serverInfo.name).toBe('actionguard-inspector');

    const toolsRes = JSON.parse(lines[1]) as {
      id: number;
      result: { tools: Array<{ name: string }> };
    };
    expect(toolsRes.id).toBe(2);
    expect(toolsRes.result.tools.some((t) => t.name === 'actionguard_inspect')).toBe(true);
    expect(toolsRes.result.tools.some((t) => t.name === 'actionguard_check_drift')).toBe(true);

    const pingRes = JSON.parse(lines[2]) as { id: number; result: Record<string, unknown> };
    expect(pingRes.id).toBe(3);
    expect(pingRes.result).toEqual({});
  });

  it('fails with exit code 1 when inspect is called without URL', () => {
    expect(() => {
      execSync(`node ${CLI_PATH} inspect`, { stdio: 'pipe' });
    }).toThrow();
  });

  it('fails with exit code 1 when check is called without pin', () => {
    expect(() => {
      execSync(`node ${CLI_PATH} check https://example.com/mcp`, { stdio: 'pipe' });
    }).toThrow();
  });

  it('initializes a project with manifests and CI workflow on actionguard init', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-init-test-'));
    const output = execSync(`node ${CLI_PATH} init --name test-project`, {
      cwd: tempDir,
      encoding: 'utf8',
    });

    expect(output).toContain('Initializing ActionGuard');
    expect(output).toContain('actionguard.json');
    expect(output).toContain('server.json');
    expect(output).toContain('verify-mcp.yml');

    expect(fs.existsSync(path.join(tempDir, 'actionguard.json'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'server.json'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.github/workflows/verify-mcp.yml'))).toBe(true);

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('writes step outputs to GITHUB_OUTPUT when running in CI environment', () => {
    const tempOutputFile = path.join(os.tmpdir(), `ag-gh-out-${Date.now()}.txt`);
    try {
      execSync(`node ${CLI_PATH} inspect https://actionguard.ai/mcp`, {
        env: {
          ...process.env,
          GITHUB_OUTPUT: tempOutputFile,
        },
        encoding: 'utf8',
      });

      expect(fs.existsSync(tempOutputFile)).toBe(true);
      const content = fs.readFileSync(tempOutputFile, 'utf8');
      expect(content).toContain('schema_hash=');
      expect(content).toContain('descriptions_hash=');
      expect(content).toContain('grade=');
      expect(content).toContain('score=');
    } finally {
      if (fs.existsSync(tempOutputFile)) {
        fs.unlinkSync(tempOutputFile);
      }
    }
  });
});
