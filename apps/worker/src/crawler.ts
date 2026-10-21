import {
  type McpToolDefinition,
  calculateScore,
  computeDualHash,
  lintPromptInjection,
  lintSchemaStrictness,
  lintTokenBloat,
} from '@actionguard/core';
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
  {
    slug: 'github-mcp',
    name: 'GitHub Official MCP Server',
    domain: 'github.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    tools: [
      {
        name: 'create_or_update_file',
        description: 'Creates or updates a single file in a GitHub repository.',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Repository owner' },
            repo: { type: 'string', description: 'Repository name' },
            path: { type: 'string', description: 'Path to file' },
            content: { type: 'string', description: 'File content' },
            message: { type: 'string', description: 'Commit message' },
            branch: { type: 'string', description: 'Target branch' },
          },
          required: ['owner', 'repo', 'path', 'content', 'message'],
        },
      },
      {
        name: 'search_repositories',
        description: 'Searches for GitHub repositories by query string.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search keywords' },
            page: { type: 'number', default: 1 },
            perPage: { type: 'number', default: 30 },
          },
          required: ['query'],
        },
      },
      {
        name: 'create_issue',
        description: 'Creates a new issue in a GitHub repository.',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string' },
            repo: { type: 'string' },
            title: { type: 'string' },
            body: { type: 'string' },
          },
          required: ['owner', 'repo', 'title'],
        },
      },
      {
        name: 'create_pull_request',
        description: 'Creates a new pull request in a GitHub repository.',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string' },
            repo: { type: 'string' },
            title: { type: 'string' },
            head: { type: 'string' },
            base: { type: 'string' },
            body: { type: 'string' },
          },
          required: ['owner', 'repo', 'title', 'head', 'base'],
        },
      },
    ],
  },
  {
    slug: 'filesystem-mcp',
    name: 'Secure Filesystem MCP Server',
    domain: 'filesystem.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    tools: [
      {
        name: 'read_file',
        description: 'Reads complete contents of a file within allowed directory roots.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Absolute file path' },
          },
          required: ['path'],
        },
      },
      {
        name: 'write_file',
        description: 'Creates or completely overwrites an existing file.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string' },
            content: { type: 'string' },
          },
          required: ['path', 'content'],
        },
      },
      {
        name: 'list_directory',
        description: 'Lists all files and subdirectories within a target path.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string' },
          },
          required: ['path'],
        },
      },
    ],
  },
  {
    slug: 'postgres-mcp',
    name: 'PostgreSQL Database MCP Server',
    domain: 'postgres.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
    tools: [
      {
        name: 'query',
        description: 'Executes a read-only SQL query against PostgreSQL database.',
        inputSchema: {
          type: 'object',
          properties: {
            sql: { type: 'string', description: 'Read-only SQL query' },
          },
          required: ['sql'],
        },
      },
      {
        name: 'list_tables',
        description: 'Returns all schemas and tables present in database.',
        inputSchema: {
          type: 'object',
          properties: {
            schema: { type: 'string', default: 'public' },
          },
        },
      },
    ],
  },
  {
    slug: 'sqlite-mcp',
    name: 'SQLite Database MCP Server',
    domain: 'sqlite.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
    tools: [
      {
        name: 'read_query',
        description: 'Executes a SELECT query against an embedded SQLite database file.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'SELECT statement' },
          },
          required: ['query'],
        },
      },
      {
        name: 'describe_table',
        description: 'Inspects SQLite table schema columns and foreign keys.',
        inputSchema: {
          type: 'object',
          properties: {
            table_name: { type: 'string' },
          },
          required: ['table_name'],
        },
      },
    ],
  },
  {
    slug: 'memory-mcp',
    name: 'Knowledge Graph Persistent Memory MCP',
    domain: 'memory.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory',
    tools: [
      {
        name: 'create_entities',
        description: 'Creates multiple knowledge graph entity nodes with observations.',
        inputSchema: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  entityType: { type: 'string' },
                  observations: { type: 'array', items: { type: 'string' } },
                },
                required: ['name', 'entityType'],
              },
            },
          },
          required: ['entities'],
        },
      },
      {
        name: 'read_graph',
        description: 'Reads the entire knowledge graph of entities and relations.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  },
  {
    slug: 'sequentialthinking-mcp',
    name: 'Sequential Thinking Dynamic Reasoning MCP',
    domain: 'thinking.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking',
    tools: [
      {
        name: 'sequentialthinking',
        description:
          'A detailed tool for dynamic and reflective problem-solving through thought sequences.',
        inputSchema: {
          type: 'object',
          properties: {
            thought: { type: 'string', description: 'The current thinking step' },
            thoughtNumber: { type: 'number', description: 'Current thought index' },
            totalThoughts: { type: 'number', description: 'Estimated thoughts needed' },
            nextThoughtNeeded: { type: 'boolean', description: 'Whether more thoughts are required' },
          },
          required: ['thought', 'thoughtNumber', 'totalThoughts', 'nextThoughtNeeded'],
        },
      },
    ],
  },
  {
    slug: 'brave-search-mcp',
    name: 'Brave Search Web & Local MCP',
    domain: 'brave.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
    tools: [
      {
        name: 'brave_web_search',
        description: 'Performs web search queries using the Brave Search API.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search keywords' },
            count: { type: 'number', default: 10 },
          },
          required: ['query'],
        },
      },
      {
        name: 'brave_local_search',
        description: 'Searches local businesses and geographical points of interest.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
      },
    ],
  },
  {
    slug: 'fetch-mcp',
    name: 'Web Content Fetch & Markdown MCP',
    domain: 'fetch.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch',
    tools: [
      {
        name: 'fetch',
        description: 'Fetches URL content and transforms HTML into clean Markdown for LLMs.',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'Target URL to fetch' },
            max_length: { type: 'number', default: 5000 },
          },
          required: ['url'],
        },
      },
    ],
  },
  {
    slug: 'puppeteer-mcp',
    name: 'Puppeteer Browser Automation MCP',
    domain: 'puppeteer.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer',
    tools: [
      {
        name: 'navigate',
        description: 'Navigates browser to target URL.',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string' },
          },
          required: ['url'],
        },
      },
      {
        name: 'screenshot',
        description: 'Takes a full-page or element screenshot in PNG format.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            selector: { type: 'string' },
          },
          required: ['name'],
        },
      },
    ],
  },
  {
    slug: 'slack-mcp',
    name: 'Slack Workspace Team Messaging MCP',
    domain: 'slack.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
    tools: [
      {
        name: 'post_message',
        description: 'Posts a formatted message to a Slack channel.',
        inputSchema: {
          type: 'object',
          properties: {
            channel_id: { type: 'string' },
            text: { type: 'string' },
          },
          required: ['channel_id', 'text'],
        },
      },
      {
        name: 'list_channels',
        description: 'Lists public channels in the Slack workspace.',
        inputSchema: {
          type: 'object',
          properties: {
            types: { type: 'string', default: 'public_channel' },
          },
        },
      },
    ],
  },
  {
    slug: 'sentry-mcp',
    name: 'Sentry Error Tracking & APM MCP',
    domain: 'sentry.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sentry',
    tools: [
      {
        name: 'list_issues',
        description: 'Lists recent production exception issues from Sentry project.',
        inputSchema: {
          type: 'object',
          properties: {
            organization_slug: { type: 'string' },
            project_slug: { type: 'string' },
            query: { type: 'string', default: 'is:unresolved' },
          },
          required: ['organization_slug', 'project_slug'],
        },
      },
    ],
  },
  {
    slug: 'notion-mcp',
    name: 'Notion Knowledge Base & Wiki MCP',
    domain: 'notion.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/notion',
    tools: [
      {
        name: 'search_notion',
        description: 'Searches pages and databases across connected Notion workspace.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
      },
    ],
  },
  {
    slug: 'cloudflare-workers-mcp',
    name: 'Cloudflare Developer Platform MCP',
    domain: 'cloudflare.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/cloudflare/mcp-server-cloudflare',
    tools: [
      {
        name: 'list_workers',
        description: 'Lists deployed Cloudflare Workers scripts and custom domains.',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'string' },
          },
          required: ['account_id'],
        },
      },
    ],
  },
  {
    slug: 'aws-s3-storage-mcp',
    name: 'Amazon S3 Object Storage MCP',
    domain: 'aws-s3.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/aws-s3',
    tools: [
      {
        name: 'list_buckets',
        description: 'Lists all S3 buckets owned by authenticated AWS principal.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_object',
        description: 'Downloads and retrieves metadata for object in an S3 bucket.',
        inputSchema: {
          type: 'object',
          properties: {
            bucket: { type: 'string' },
            key: { type: 'string' },
          },
          required: ['bucket', 'key'],
        },
      },
    ],
  },
  {
    slug: 'redis-cache-mcp',
    name: 'Redis In-Memory Data MCP',
    domain: 'redis.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/redis',
    tools: [
      {
        name: 'get',
        description: 'Retrieves value stored at Redis key.',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string' },
          },
          required: ['key'],
        },
      },
      {
        name: 'set',
        description: 'Sets string value with optional TTL expiry.',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            value: { type: 'string' },
            ttl_seconds: { type: 'number' },
          },
          required: ['key', 'value'],
        },
      },
    ],
  },
  {
    slug: 'jira-tickets-mcp',
    name: 'Atlassian Jira Project MCP',
    domain: 'jira.mcp.modelcontextprotocol.io',
    repo: 'https://github.com/modelcontextprotocol/servers/tree/main/src/jira',
    tools: [
      {
        name: 'search_issues_jql',
        description: 'Searches Jira project issues using JQL syntax.',
        inputSchema: {
          type: 'object',
          properties: {
            jql: { type: 'string' },
            maxResults: { type: 'number', default: 20 },
          },
          required: ['jql'],
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
    const findings = [
      ...lintSchemaStrictness(s.tools),
      lintTokenBloat(s.tools),
      ...lintPromptInjection(s.tools),
    ];
    const score = calculateScore(findings);
    const grade = score.grade || 'A';

    const serviceId = `srv_${s.slug.replace(/[^a-z0-9]/g, '_')}`;
    const endpointId = `ep_${s.slug.replace(/[^a-z0-9]/g, '_')}`;
    const url = `https://${s.domain}/mcp`;

    await env.actionguard_db.batch([
      env.actionguard_db
        .prepare(
          `INSERT INTO services (id, org_id, slug, display_name, canonical_domain, repository_url, overall_grade, verification_tier)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'Unverified (curated listing)')
           ON CONFLICT(slug) DO UPDATE SET
             display_name = excluded.display_name,
             canonical_domain = excluded.canonical_domain,
             repository_url = excluded.repository_url,
             overall_grade = excluded.overall_grade`,
        )
        .bind(serviceId, orgId, s.slug, s.name, s.domain, s.repo, grade),
      env.actionguard_db
        .prepare(
          `INSERT INTO service_endpoints (id, service_id, protocol, url, current_schema_sha256, current_descriptions_sha256, last_status, last_latency_ms, last_checked_at)
           VALUES (?, ?, 'mcp_streamable_http', ?, ?, ?, 'up', 45, datetime('now'))
           ON CONFLICT(id) DO UPDATE SET
             current_schema_sha256 = excluded.current_schema_sha256,
             current_descriptions_sha256 = excluded.current_descriptions_sha256,
             last_status = excluded.last_status,
             last_checked_at = excluded.last_checked_at`,
        )
        .bind(endpointId, serviceId, url, hashes.schema_sha256, hashes.descriptions_sha256),
    ]);

    newSlugs.push(s.slug);
  }

  const countRow = await env.actionguard_db
    .prepare('SELECT COUNT(*) as count FROM services')
    .first<{ count: number }>();

  return {
    synced: CRAWLED_SERVERS.length,
    total: countRow?.count ?? CRAWLED_SERVERS.length,
    newSlugs,
  };
}
