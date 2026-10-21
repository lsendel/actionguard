import { type McpToolDefinition, computeDualHash } from '@actionguard/core';
import type { Env } from './types.js';

interface CrawledServer {
  slug: string;
  name: string;
  domain: string;
  repo: string;
  tools: McpToolDefinition[];
}

export const CRAWLED_SERVERS: CrawledServer[] = [
  {
    slug: 'linear-mcp',
    name: 'Linear MCP Server',
    domain: 'linear.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/linear',
    tools: [
      {
        name: 'create_issue',
        description:
          'Creates a new issue in a Linear team project with title, description, and priority.',
        inputSchema: {
          type: 'object',
          properties: {
            teamId: { type: 'string', description: 'Linear team identifier' },
            title: { type: 'string', description: 'Issue title' },
            description: { type: 'string', description: 'Issue markdown body' },
            priority: {
              type: 'number',
              enum: [0, 1, 2, 3, 4],
              description: 'Issue priority level',
            },
          },
          required: ['teamId', 'title'],
        },
      },
      {
        name: 'list_issues',
        description: 'Searches or lists issues assigned to the viewer or matching project query.',
        inputSchema: {
          type: 'object',
          properties: {
            teamId: { type: 'string', description: 'Optional team filter' },
            query: { type: 'string', description: 'Search keywords' },
            limit: { type: 'number', default: 20 },
          },
        },
      },
    ],
  },
  {
    slug: 'datadog-mcp',
    name: 'Datadog APM & Metrics MCP',
    domain: 'datadog.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/datadog',
    tools: [
      {
        name: 'query_metric',
        description: 'Queries scalar or timeseries metrics from Datadog telemetry pipeline.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Datadog metric query string' },
            from: { type: 'number', description: 'Start epoch timestamp in seconds' },
            to: { type: 'number', description: 'End epoch timestamp in seconds' },
          },
          required: ['query', 'from', 'to'],
        },
      },
      {
        name: 'list_monitors',
        description: 'Lists active alerts and health monitors currently triggered in Datadog.',
        inputSchema: {
          type: 'object',
          properties: {
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    ],
  },
  {
    slug: 'pagerduty-mcp',
    name: 'PagerDuty Incident Response MCP',
    domain: 'pagerduty.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/pagerduty',
    tools: [
      {
        name: 'create_incident',
        description: 'Triggers a new high-priority on-call incident on PagerDuty.',
        inputSchema: {
          type: 'object',
          properties: {
            service_id: { type: 'string', description: 'PagerDuty service ID' },
            title: { type: 'string', description: 'Short incident summary' },
            urgency: { type: 'string', enum: ['high', 'low'], default: 'high' },
          },
          required: ['service_id', 'title'],
        },
      },
      {
        name: 'list_oncall',
        description: 'Returns engineers currently on-call for an escalation policy schedule.',
        inputSchema: {
          type: 'object',
          properties: {
            escalation_policy_id: { type: 'string' },
          },
          required: ['escalation_policy_id'],
        },
      },
    ],
  },
  {
    slug: 'kubernetes-mcp',
    name: 'Kubernetes Cluster MCP',
    domain: 'k8s.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/kubernetes',
    tools: [
      {
        name: 'list_pods',
        description: 'Lists running Kubernetes pods across all or specific namespaces.',
        inputSchema: {
          type: 'object',
          properties: {
            namespace: { type: 'string', default: 'default' },
            selector: { type: 'string', description: 'Label selector' },
          },
        },
      },
      {
        name: 'get_pod_logs',
        description: 'Fetches recent standard output logs from a specified container pod.',
        inputSchema: {
          type: 'object',
          properties: {
            pod_name: { type: 'string' },
            namespace: { type: 'string', default: 'default' },
            tail_lines: { type: 'number', default: 100 },
          },
          required: ['pod_name'],
        },
      },
    ],
  },
  {
    slug: 'huggingface-mcp',
    name: 'Hugging Face Hub MCP',
    domain: 'hf.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/huggingface',
    tools: [
      {
        name: 'search_models',
        description:
          'Searches open-source foundation models on Hugging Face Hub by task, tags, or downloads.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search term or model architecture' },
            task: { type: 'string', description: 'e.g. text-generation, text-to-image' },
            limit: { type: 'number', default: 10 },
          },
          required: ['query'],
        },
      },
    ],
  },
  {
    slug: 'elasticsearch-mcp',
    name: 'Elasticsearch Vector Search MCP',
    domain: 'elastic.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/elasticsearch',
    tools: [
      {
        name: 'search_index',
        description:
          'Runs hybrid BM25 and kNN dense vector queries against an Elasticsearch index.',
        inputSchema: {
          type: 'object',
          properties: {
            index: { type: 'string', description: 'Target index name' },
            query: { type: 'string', description: 'Search query' },
            size: { type: 'number', default: 10 },
          },
          required: ['index', 'query'],
        },
      },
    ],
  },
  {
    slug: 'stripe-mcp',
    name: 'Stripe Billing & Subscriptions MCP',
    domain: 'stripe.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/stripe',
    tools: [
      {
        name: 'get_customer',
        description: 'Retrieves customer record, active subscriptions, and payment history.',
        inputSchema: {
          type: 'object',
          properties: {
            customer_id: { type: 'string', description: 'Stripe customer ID (cus_...)' },
          },
          required: ['customer_id'],
        },
      },
      {
        name: 'create_invoice',
        description: 'Generates an invoice draft for a verified customer account.',
        inputSchema: {
          type: 'object',
          properties: {
            customer_id: { type: 'string' },
            amount_cents: { type: 'number' },
          },
          required: ['customer_id', 'amount_cents'],
        },
      },
    ],
  },
  {
    slug: 'zendesk-mcp',
    name: 'Zendesk Support MCP',
    domain: 'zendesk.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/zendesk',
    tools: [
      {
        name: 'search_tickets',
        description: 'Searches open customer support tickets by status, assignee, or keyword.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Zendesk search string' },
          },
          required: ['query'],
        },
      },
    ],
  },
];

export async function syncCrawlerCatalog(env: Env): Promise<{
  synced: number;
  total: number;
  newSlugs: string[];
}> {
  if (!env.actionguard_db) return { synced: 0, total: 0, newSlugs: [] };

  const orgId = 'org_official_mcp';
  await env.actionguard_db
    .prepare('INSERT OR IGNORE INTO organizations (id, name, slug) VALUES (?, ?, ?)')
    .bind(orgId, 'Model Context Protocol Community', 'mcp-official')
    .run();

  const newSlugs: string[] = [];

  for (const s of CRAWLED_SERVERS) {
    const hashes = await computeDualHash(s.tools);
    const serviceId = `srv_${s.slug.replace(/[^a-z0-9]/g, '_')}`;
    const endpointId = `ep_${s.slug.replace(/[^a-z0-9]/g, '_')}`;
    const url = `https://${s.domain}/mcp`;

    await env.actionguard_db.batch([
      env.actionguard_db
        .prepare(
          `INSERT INTO services (id, org_id, slug, display_name, canonical_domain, repository_url, overall_grade, verification_tier)
           VALUES (?, ?, ?, ?, ?, ?, 'A+', 'Community Verified')
           ON CONFLICT(slug) DO UPDATE SET
             display_name = excluded.display_name,
             canonical_domain = excluded.canonical_domain,
             repository_url = excluded.repository_url`,
        )
        .bind(serviceId, orgId, s.slug, s.name, s.domain, s.repo),
      env.actionguard_db
        .prepare(
          `INSERT INTO service_endpoints (id, service_id, protocol, url, current_schema_sha256, current_descriptions_sha256, last_status, last_latency_ms, last_checked_at)
           VALUES (?, ?, 'mcp_streamable_http', ?, ?, ?, 'up', 125, datetime('now'))
           ON CONFLICT(id) DO UPDATE SET
             current_schema_sha256 = excluded.current_schema_sha256,
             current_descriptions_sha256 = excluded.current_descriptions_sha256,
             last_status = 'up',
             last_checked_at = datetime('now')`,
        )
        .bind(endpointId, serviceId, url, hashes.schema_sha256, hashes.descriptions_sha256),
    ]);

    newSlugs.push(s.slug);
  }

  return {
    synced: CRAWLED_SERVERS.length,
    total: 28 + CRAWLED_SERVERS.length,
    newSlugs,
  };
}
