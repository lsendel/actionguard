import { describe, expect, it } from 'vitest';
import {
  compileToA2AAgentCard,
  compileToDnsAidRecords,
  compileToGitHubAction,
  compileToMcpRegistry,
  generateArtifacts,
  generateStarterManifest,
  validateManifest,
  type ActionGuardManifest,
  type McpToolDefinition,
} from '../src/index.js';

describe('Universal Manifest Compiler', () => {
  const sampleManifest: ActionGuardManifest = {
    $schema: 'https://actionguard.ai/schemas/v1/manifest.schema.json',
    name: 'com.example/analytics',
    title: 'Acme Analytics Agent',
    description: 'Provides real-time business intelligence metrics.',
    version: '1.2.0',
    domain: 'analytics.example.com',
    repository: {
      url: 'https://github.com/acme/analytics-agent',
      source: 'github',
    },
    provider: {
      organization: 'Acme Corp',
      url: 'https://example.com',
    },
    endpoints: [
      {
        protocol: 'mcp',
        transport: 'streamable-http',
        url: 'https://analytics.example.com/mcp',
      },
      {
        protocol: 'a2a',
        binding: 'JSONRPC',
        url: 'https://analytics.example.com/a2a/v1',
      },
    ],
    capabilities: {
      tools: [
        {
          id: 'get_revenue',
          name: 'Get Monthly Revenue',
          description: 'Calculates monthly recurring revenue by geography.',
          inputSchema: {
            type: 'object',
            properties: {
              region: { type: 'string', enum: ['US', 'EU', 'APAC'] },
            },
            required: ['region'],
          },
          annotations: { readOnlyHint: true },
          compliance: ['soc2_compliant'],
          examples: ['Calculate revenue for US in Q3'],
        },
      ],
    },
    dnsAid: {
      enabled: true,
      agentPrefix: 'analytics',
      zone: 'example.com',
    },
  };

  it('validates a schema-compliant actionguard.json', () => {
    const validated = validateManifest(sampleManifest);
    expect(validated.name).toBe('com.example/analytics');
    expect(validated.version).toBe('1.2.0');
  });

  it('compiles to valid official MCP Registry server.json', () => {
    const mcpJsonStr = compileToMcpRegistry(sampleManifest);
    const parsed = JSON.parse(mcpJsonStr);
    expect(parsed.$schema).toContain('server.schema.json');
    expect(parsed.name).toBe('com.example/analytics');
    expect(parsed.remotes[0].type).toBe('streamable-http');
    expect(parsed.remotes[0].url).toBe('https://analytics.example.com/mcp');
  });

  it('compiles to valid A2A v1.0 agent-card.json', () => {
    const a2aJsonStr = compileToA2AAgentCard(sampleManifest);
    const parsed = JSON.parse(a2aJsonStr);
    expect(parsed.name).toBe('Acme Analytics Agent');
    expect(parsed.skills[0].id).toBe('get_revenue');
    expect(parsed.supportedInterfaces[0].protocolBinding).toBe('JSONRPC');
  });

  it('compiles to valid DNS-AID RFC 8552 zone records', () => {
    const dnsRecords = compileToDnsAidRecords(sampleManifest);
    expect(dnsRecords).toContain('_analytics._mcp._agents.example.com.');
    expect(dnsRecords).toContain('_analytics._a2a._agents.example.com.');
    expect(dnsRecords).toContain('SVCB');
    expect(dnsRecords).toContain('v=aid1;');
  });

  it('generates all 5 standard artifacts from a starter manifest', () => {
    const sampleTools: McpToolDefinition[] = [
      {
        name: 'test_tool',
        description: 'A test tool',
        inputSchema: { type: 'object' },
      },
    ];

    const starter = generateStarterManifest('test.com', 'https://test.com/mcp', sampleTools);
    const artifacts = generateArtifacts(starter);

    expect(artifacts.actionguardJson).toContain('test_tool');
    expect(artifacts.mcpServerJson).toContain('com.test_com/agent');
    expect(artifacts.a2aAgentCardJson).toContain('skills');
    expect(artifacts.dnsAidRecords).toContain('SVCB');
    expect(artifacts.githubActionWorkflow).toContain('ActionGuard Protocol CI');
  });
});
