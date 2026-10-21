import { computeDualHash } from '@actionguard/core';
export const TOP_25_SERVERS = [
  {
    slug: 'github-mcp',
    displayName: 'GitHub MCP Server',
    canonicalDomain: 'github.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    tier: 'Official Repository Verified',
    grade: 'A+',
    latencyMs: 95,
    tools: [
      {
        name: 'create_issue',
        description: 'Creates an issue in a GitHub repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string' },
            repo: { type: 'string' },
            title: { type: 'string' },
          },
          required: ['owner', 'repo', 'title'],
        },
        annotations: { destructiveHint: false },
      },
      {
        name: 'search_repositories',
        description: 'Searches GitHub repositories by query',
        inputSchema: { type: 'object', properties: { q: { type: 'string' } }, required: ['q'] },
        annotations: { readOnlyHint: true },
      },
      {
        name: 'get_file_contents',
        description: 'Retrieves file contents from a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string' },
            repo: { type: 'string' },
            path: { type: 'string' },
          },
          required: ['owner', 'repo', 'path'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'postgres-mcp',
    displayName: 'PostgreSQL Database MCP Server',
    canonicalDomain: 'postgres.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
    tier: 'Official Repository Verified',
    grade: 'A+',
    latencyMs: 45,
    tools: [
      {
        name: 'query_readonly',
        description: 'Executes a read-only SQL SELECT query',
        inputSchema: { type: 'object', properties: { sql: { type: 'string' } }, required: ['sql'] },
        annotations: { readOnlyHint: true, idempotentHint: true },
      },
      {
        name: 'list_tables',
        description: 'Inspects tables and schemas in database',
        inputSchema: { type: 'object' },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'sqlite-mcp',
    displayName: 'SQLite Local Database MCP',
    canonicalDomain: 'sqlite.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
    tier: 'Official Repository Verified',
    grade: 'A+',
    latencyMs: 18,
    tools: [
      {
        name: 'read_query',
        description: 'Execute SELECT queries against SQLite db',
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'brave-search-mcp',
    displayName: 'Brave Web Search MCP Server',
    canonicalDomain: 'brave-search.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
    tier: 'API Verified',
    grade: 'A+',
    latencyMs: 140,
    tools: [
      {
        name: 'brave_web_search',
        description: 'Performs web searches via Brave Search API',
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
        annotations: { readOnlyHint: true },
      },
      {
        name: 'brave_local_search',
        description: 'Searches local businesses and points of interest',
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'fetch-mcp',
    displayName: 'Web Fetch & HTML Scraper MCP',
    canonicalDomain: 'fetch.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch',
    tier: 'Official Repository Verified',
    grade: 'A+',
    latencyMs: 110,
    tools: [
      {
        name: 'fetch',
        description: 'Fetches HTML and converts to markdown',
        inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'puppeteer-mcp',
    displayName: 'Puppeteer Headless Browser MCP',
    canonicalDomain: 'puppeteer.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer',
    tier: 'Official Repository Verified',
    grade: 'A',
    latencyMs: 320,
    tools: [
      {
        name: 'puppeteer_navigate',
        description: 'Navigates browser to URL',
        inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
      },
      {
        name: 'puppeteer_screenshot',
        description: 'Captures screenshot of current page',
        inputSchema: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name'],
        },
      },
    ],
  },
  {
    slug: 'slack-mcp',
    displayName: 'Slack Workspace Messaging MCP',
    canonicalDomain: 'slack.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
    tier: 'API Verified',
    grade: 'A+',
    latencyMs: 125,
    tools: [
      {
        name: 'post_message',
        description: 'Posts message to Slack channel',
        inputSchema: {
          type: 'object',
          properties: { channel_id: { type: 'string' }, text: { type: 'string' } },
          required: ['channel_id', 'text'],
        },
      },
      {
        name: 'list_channels',
        description: 'Lists public Slack channels',
        inputSchema: { type: 'object' },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'filesystem-mcp',
    displayName: 'Local Filesystem MCP Server',
    canonicalDomain: 'filesystem.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    tier: 'Official Repository Verified',
    grade: 'A+',
    latencyMs: 12,
    tools: [
      {
        name: 'read_file',
        description: 'Reads content from disk',
        inputSchema: {
          type: 'object',
          properties: { path: { type: 'string' } },
          required: ['path'],
        },
        annotations: { readOnlyHint: true },
      },
      {
        name: 'write_file',
        description: 'Writes content to disk',
        inputSchema: {
          type: 'object',
          properties: { path: { type: 'string' }, content: { type: 'string' } },
          required: ['path', 'content'],
        },
        annotations: { destructiveHint: true },
      },
    ],
  },
  {
    slug: 'google-drive-mcp',
    displayName: 'Google Drive Document MCP',
    canonicalDomain: 'gdrive.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive',
    tier: 'OAuth Verified',
    grade: 'A+',
    latencyMs: 165,
    tools: [
      {
        name: 'search_files',
        description: 'Searches user files in Google Drive',
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'git-repo-mcp',
    displayName: 'Git Version Control MCP Server',
    canonicalDomain: 'git.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/git',
    tier: 'Official Repository Verified',
    grade: 'A+',
    latencyMs: 25,
    tools: [
      {
        name: 'git_status',
        description: 'Shows repository status and diffs',
        inputSchema: { type: 'object' },
        annotations: { readOnlyHint: true },
      },
      {
        name: 'git_log',
        description: 'Returns commit history log',
        inputSchema: { type: 'object', properties: { limit: { type: 'number' } } },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'memory-graph-mcp',
    displayName: 'Knowledge Graph Memory MCP',
    canonicalDomain: 'memory.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory',
    tier: 'Official Repository Verified',
    grade: 'A+',
    latencyMs: 38,
    tools: [
      {
        name: 'create_entities',
        description: 'Creates new entities in knowledge graph',
        inputSchema: {
          type: 'object',
          properties: { entities: { type: 'array' } },
          required: ['entities'],
        },
      },
      {
        name: 'search_nodes',
        description: 'Searches knowledge nodes by relation',
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'docker-container-mcp',
    displayName: 'Docker Engine Management MCP',
    canonicalDomain: 'docker.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/docker',
    tier: 'Community Verified',
    grade: 'A',
    latencyMs: 52,
    tools: [
      {
        name: 'list_containers',
        description: 'Lists active Docker containers',
        inputSchema: { type: 'object' },
        annotations: { readOnlyHint: true },
      },
      {
        name: 'get_logs',
        description: 'Inspects container stdout logs',
        inputSchema: {
          type: 'object',
          properties: { container_id: { type: 'string' } },
          required: ['container_id'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'sentry-telemetry-mcp',
    displayName: 'Sentry Error Observability MCP',
    canonicalDomain: 'sentry.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/getsentry/sentry-mcp',
    tier: 'Official Partner Verified',
    grade: 'A+',
    latencyMs: 88,
    tools: [
      {
        name: 'get_issue',
        description: 'Fetches issue details and stacktrace from Sentry',
        inputSchema: {
          type: 'object',
          properties: { issue_id: { type: 'string' } },
          required: ['issue_id'],
        },
        annotations: { readOnlyHint: true },
      },
      {
        name: 'list_recent_errors',
        description: 'Returns latest production exception events',
        inputSchema: { type: 'object' },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'linear-issues-mcp',
    displayName: 'Linear Project Tracker MCP',
    canonicalDomain: 'linear.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/linear/linear-mcp',
    tier: 'Official Partner Verified',
    grade: 'A+',
    latencyMs: 92,
    tools: [
      {
        name: 'create_task',
        description: 'Creates issue in Linear project',
        inputSchema: {
          type: 'object',
          properties: { title: { type: 'string' }, team_id: { type: 'string' } },
          required: ['title', 'team_id'],
        },
      },
      {
        name: 'search_tasks',
        description: 'Searches tickets by state and assignee',
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'notion-workspace-mcp',
    displayName: 'Notion Knowledge Base MCP',
    canonicalDomain: 'notion.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/makenotion/notion-mcp',
    tier: 'OAuth Verified',
    grade: 'A+',
    latencyMs: 142,
    tools: [
      {
        name: 'query_database',
        description: 'Queries Notion database items',
        inputSchema: {
          type: 'object',
          properties: { database_id: { type: 'string' } },
          required: ['database_id'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'aws-s3-storage-mcp',
    displayName: 'Amazon S3 Object Storage MCP',
    canonicalDomain: 'aws-s3.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/awslabs/s3-mcp-server',
    tier: 'Cloud Provider Verified',
    grade: 'A+',
    latencyMs: 104,
    tools: [
      {
        name: 'list_objects',
        description: 'Lists keys under S3 bucket prefix',
        inputSchema: {
          type: 'object',
          properties: { bucket: { type: 'string' } },
          required: ['bucket'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'cloudflare-workers-mcp',
    displayName: 'Cloudflare Developer Platform MCP',
    canonicalDomain: 'cloudflare.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/cloudflare/mcp-server-cloudflare',
    tier: 'Official Infrastructure Verified',
    grade: 'A+',
    latencyMs: 42,
    tools: [
      {
        name: 'list_workers',
        description: 'Lists deployed Cloudflare Workers',
        inputSchema: { type: 'object' },
        annotations: { readOnlyHint: true },
      },
      {
        name: 'query_d1',
        description: 'Runs SQL statements on D1 databases',
        inputSchema: {
          type: 'object',
          properties: { db_name: { type: 'string' }, sql: { type: 'string' } },
          required: ['db_name', 'sql'],
        },
      },
    ],
  },
  {
    slug: 'redis-cache-mcp',
    displayName: 'Redis In-Memory Data MCP',
    canonicalDomain: 'redis.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/redis/mcp-server-redis',
    tier: 'Community Verified',
    grade: 'A+',
    latencyMs: 24,
    tools: [
      {
        name: 'get_key',
        description: 'Gets string value for Redis key',
        inputSchema: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'jira-tickets-mcp',
    displayName: 'Atlassian Jira Project MCP',
    canonicalDomain: 'jira.mcp.modelcontextprotocol.io',
    repoUrl: 'https://github.com/atlassian/jira-mcp',
    tier: 'OAuth Verified',
    grade: 'A',
    latencyMs: 175,
    tools: [
      {
        name: 'get_jira_issue',
        description: 'Retrieves Jira ticket details by key',
        inputSchema: {
          type: 'object',
          properties: { issue_key: { type: 'string' } },
          required: ['issue_key'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'stripe-payments-mcp',
    displayName: 'Stripe Billing & Payments MCP',
    canonicalDomain: 'payments.stripe.mcp.io',
    repoUrl: 'https://github.com/stripe/stripe-mcp',
    tier: 'Official Partner Verified',
    grade: 'A+',
    latencyMs: 98,
    tools: [
      {
        name: 'retrieve_customer',
        description: 'Retrieves Stripe customer record',
        inputSchema: {
          type: 'object',
          properties: { customer_id: { type: 'string' } },
          required: ['customer_id'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'kubernetes-cluster-mcp',
    displayName: 'Kubernetes Cluster Control MCP',
    canonicalDomain: 'kubernetes.mcp.io',
    repoUrl: 'https://github.com/kubernetes-sigs/mcp-k8s',
    tier: 'Community Verified',
    grade: 'A+',
    latencyMs: 76,
    tools: [
      {
        name: 'get_pods',
        description: 'Lists pods across Kubernetes namespace',
        inputSchema: {
          type: 'object',
          properties: { namespace: { type: 'string' } },
          required: ['namespace'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'weather-a2a-agent',
    displayName: 'Global Meteorological A2A Agent',
    canonicalDomain: 'weather.a2a.agentic.io',
    repoUrl: 'https://github.com/a2a-protocol/weather-agent',
    tier: 'A2A Protocol v1.0 Verified',
    grade: 'A+',
    latencyMs: 130,
    tools: [
      {
        name: 'get_weather_forecast',
        description: 'Retrieves 7-day temperature and precipitation forecast',
        inputSchema: {
          type: 'object',
          properties: { latitude: { type: 'number' }, longitude: { type: 'number' } },
          required: ['latitude', 'longitude'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'travel-concierge-a2a',
    displayName: 'Autonomous Travel Booking Concierge A2A',
    canonicalDomain: 'travel.a2a.agentic.io',
    repoUrl: 'https://github.com/a2a-protocol/travel-concierge',
    tier: 'A2A Protocol v1.0 Verified',
    grade: 'A+',
    latencyMs: 185,
    tools: [
      {
        name: 'search_flights',
        description: 'Finds available multi-modal flight itineraries',
        inputSchema: {
          type: 'object',
          properties: { origin: { type: 'string' }, destination: { type: 'string' } },
          required: ['origin', 'destination'],
        },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'wherecare-analytics',
    displayName: 'Where.Care Caregiver Analytics Agent',
    canonicalDomain: 'analytics.where.care',
    repoUrl: 'https://github.com/where-care/analytics',
    tier: 'Domain & Security Verified',
    grade: 'A+',
    latencyMs: 115,
    tools: [
      {
        name: 'query_care_providers',
        description: 'Queries verified healthcare professionals',
        inputSchema: { type: 'object', properties: { zip: { type: 'string' } }, required: ['zip'] },
        annotations: { readOnlyHint: true },
      },
    ],
  },
  {
    slug: 'actionguard-reference',
    displayName: 'ActionGuard Reference MCP Server',
    canonicalDomain: 'demo.actionguard.ai',
    repoUrl: 'https://github.com/actionguard/mcp-demo',
    tier: 'Official Protocol Verified',
    grade: 'A+',
    latencyMs: 40,
    tools: [
      {
        name: 'inspect_agent',
        description: 'Runs 5-stage edge audit against target endpoint',
        inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
        annotations: { readOnlyHint: true },
      },
    ],
  },
];
export async function generateSeedSql() {
  let sql = '-- Auto-generated Seed SQL for Top 25 Authoritative MCP Servers\n\n';
  for (const s of TOP_25_SERVERS) {
    const hashes = await computeDualHash(s.tools);
    const orgId = `org_${s.slug.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const serviceId = `srv_${s.slug.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const endpointId = `ep_${s.slug.replace(/[^a-zA-Z0-9]/g, '_')}`;
    sql += `INSERT OR REPLACE INTO organizations (id, name, slug, tier) VALUES ('${orgId}', '${s.displayName}', '${s.slug}', 'verified');\n`;
    sql += `INSERT OR REPLACE INTO services (id, org_id, slug, display_name, canonical_domain, repository_url, verification_tier, overall_grade) VALUES ('${serviceId}', '${orgId}', '${s.slug}', '${s.displayName}', '${s.canonicalDomain}', '${s.repoUrl}', '${s.tier}', '${s.grade}');\n`;
    sql += `INSERT OR REPLACE INTO service_endpoints (id, service_id, protocol, url, current_schema_sha256, current_descriptions_sha256, last_status, last_latency_ms, last_checked_at) VALUES ('${endpointId}', '${serviceId}', 'mcp_streamable_http', 'https://${s.canonicalDomain}/mcp', '${hashes.schema_sha256}', '${hashes.descriptions_sha256}', 'up', ${s.latencyMs}, datetime('now'));\n\n`;
  }
  return sql;
}
