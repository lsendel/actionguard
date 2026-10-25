import {
  type InspectionReport,
  type McpToolDefinition,
  type UptimeStats,
  calculateUptimeStats,
  computeDualHash,
  diffToolCatalogs,
  diffToolSets,
  lintPromptInjection,
  runInspection,
} from '@actionguard/core';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { dispatchDriftAlerts, renderWelcomeEmailHtml, sendEmailViaResend } from './alerts.js';
import { type BadgeStyle, renderBadgeSvg, renderShieldsJson } from './badges.js';
import { syncCrawlerCatalog } from './crawler.js';
import { renderDiffPage } from './diff-ui.js';
import { GUIDES, renderGuideHtml } from './guides.js';
import { INDEXNOW_KEY, submitToIndexNow } from './indexnow.js';
import { createNewApiKey } from './keys.js';
import { renderOgCardSvg } from './og.js';
import { renderPlaygroundHtml } from './playground-ui.js';
import { renderPricingHtml } from './pricing-ui.js';
import { handleProxyRequest } from './proxy.js';
import { renderRobotsTxt, renderSitemapXml } from './seo.js';
import { renderServerProfileHtml } from './server-profile.js';
import { createCheckoutSession, handleStripeWebhook, renderPricingSuccessHtml } from './stripe.js';
import type { Env } from './types.js';
import { renderHomepageHtml, renderIndexHtml, renderReportHtml } from './ui.js';
import { renderVerifyHtml } from './verify.js';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// Canonical 301 Redirect for www and companion domains
app.use('*', async (c, next) => {
  const url = new URL(c.req.url);
  if (
    url.hostname === 'www.actionguard.ai' ||
    url.hostname === 'action-guard.com' ||
    url.hostname === 'www.action-guard.com'
  ) {
    url.hostname = 'actionguard.ai';
    return c.redirect(url.toString(), 301);
  }
  return next();
});

// SSR Web UI: Homepage
app.get('/', (c) => {
  return c.html(renderHomepageHtml());
});

// SSR Web UI: Public Reliability Index / Leaderboard
app.get('/index', async (c) => {
  let services: Array<{
    slug: string;
    display_name: string;
    canonical_domain: string;
    overall_grade: string;
    verification_tier: string;
    created_at: string;
    last_checked_at?: string;
  }> = [];
  let totalCount = 0;

  if (c.env.actionguard_db) {
    try {
      const countRes = await c.env.actionguard_db
        .prepare('SELECT COUNT(*) as total FROM services')
        .first<{ total: number }>();
      totalCount = countRes?.total || 0;

      const rows = await c.env.actionguard_db
        .prepare(
          `SELECT s.slug, s.display_name, s.canonical_domain, s.overall_grade, s.verification_tier, s.created_at,
                  e.last_checked_at, e.last_status
           FROM services s
           LEFT JOIN service_endpoints e ON s.id = e.service_id
           GROUP BY s.id
           ORDER BY 
             CASE s.overall_grade
               WHEN 'A+' THEN 1
               WHEN 'A' THEN 2
               WHEN 'B' THEN 3
               WHEN 'C' THEN 4
               WHEN 'D' THEN 5
               WHEN 'Pending' THEN 6
               WHEN 'Unreachable' THEN 7
               WHEN 'F' THEN 8
               ELSE 9
             END,
             s.created_at DESC
           LIMIT 100`,
        )
        .all<{
          slug: string;
          display_name: string;
          canonical_domain: string;
          overall_grade: string;
          verification_tier: string;
          created_at: string;
          last_checked_at?: string;
          last_status?: string;
        }>();

      services = (rows.results || []).map((row) => {
        let grade = row.overall_grade || 'Pending';
        if (row.last_status === 'down' || grade === 'F') {
          grade = 'Unreachable';
        }
        return {
          slug: row.slug,
          display_name: row.display_name,
          canonical_domain: row.canonical_domain,
          overall_grade: grade,
          verification_tier: row.verification_tier,
          created_at: row.created_at,
          last_checked_at: row.last_checked_at,
        };
      });
      if (totalCount === 0) totalCount = services.length;
    } catch {
      // Fallback if table is empty or error
    }
  }

  return c.html(renderIndexHtml(services, totalCount));
});

// Alias /leaderboard to /index
app.get('/leaderboard', (c) => c.redirect('/index', 301));

// Technical SEO: robots.txt
app.get('/robots.txt', (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8');
  c.header('Cache-Control', 'public, max-age=86400');
  return c.text(renderRobotsTxt());
});

// Technical SEO: dynamic sitemap.xml
app.get('/sitemap.xml', async (c) => {
  let services: Array<{ slug: string; created_at: string }> = [];
  if (c.env.actionguard_db) {
    try {
      const rows = await c.env.actionguard_db
        .prepare('SELECT slug, created_at FROM services LIMIT 500')
        .all<{ slug: string; created_at: string }>();
      services = rows.results || [];
    } catch {
      // Fallback
    }
  }
  c.header('Content-Type', 'application/xml; charset=utf-8');
  c.header('Cache-Control', 'public, max-age=3600');
  return c.body(renderSitemapXml(services));
});

// Programmatic SEO: Server Profile Page (/servers/:slug)
app.get('/servers/:slug', async (c) => {
  const slug = c.req.param('slug');
  if (!c.env.actionguard_db) {
    return c.text('Database unavailable', 500);
  }

  const service = await c.env.actionguard_db
    .prepare('SELECT * FROM services WHERE slug = ? OR canonical_domain = ? LIMIT 1')
    .bind(slug, slug)
    .first<{
      id: string;
      slug: string;
      display_name: string;
      canonical_domain: string;
      repository_url?: string;
      verification_tier: string;
      overall_grade: string;
      created_at: string;
    }>();

  if (!service) {
    return c.html(
      `<div style="font-family:sans-serif;padding:40px;color:#ef4444;background:#090d16;min-height:100vh;">
        <h2>Server Not Found</h2>
        <p>No verified profile found for "${slug}".</p>
        <p><a href="/" style="color:#60a5fa;">&larr; Inspect It Now</a></p>
      </div>`,
      404,
    );
  }

  // Canonical redirect if accessed via domain or alias instead of primary slug (One domain, one profile)
  if (service.slug !== slug) {
    return c.redirect(`/servers/${encodeURIComponent(service.slug)}`, 301);
  }

  const endpoints = await c.env.actionguard_db
    .prepare('SELECT * FROM service_endpoints WHERE service_id = ?')
    .bind(service.id)
    .all<{
      id: string;
      protocol: string;
      url: string;
      last_status: string;
      last_latency_ms: number;
      current_schema_sha256?: string;
      current_descriptions_sha256?: string;
      last_checked_at?: string;
    }>();

  const endpointList = endpoints.results || [];

  // Query probe history from probes table
  let uptimeStats: UptimeStats | undefined;
  if (endpointList.length > 0) {
    try {
      const probeRows = await c.env.actionguard_db
        .prepare(
          `SELECT probed_at, status, latency_ms, grade
           FROM probes
           WHERE endpoint_id IN (${endpointList.map(() => '?').join(',')})
           ORDER BY probed_at DESC
           LIMIT 100`,
        )
        .bind(...endpointList.map((e) => e.id))
        .all<{
          probed_at: string;
          status: 'up' | 'down' | 'degraded';
          latency_ms?: number;
          grade?: string;
        }>();

      if (probeRows.results && probeRows.results.length > 0) {
        uptimeStats = calculateUptimeStats(probeRows.results);
      }
    } catch {
      // probes table not yet populated or query error
    }
  }

  // If no probes exist yet, initialize uptimeStats with 0 probes
  if (!uptimeStats) {
    uptimeStats = calculateUptimeStats([], { now: new Date() });
  }

  return c.html(
    renderServerProfileHtml({
      ...service,
      endpoints: endpointList,
      uptimeStats,
    }),
  );
});

// Server Changelog & Historical Drift Snapshots API
app.get('/api/servers/:slug/changelog', async (c) => {
  const slug = c.req.param('slug');
  if (!c.env.actionguard_db) {
    return c.json({ error: 'Database unavailable' }, 500);
  }

  const service = await c.env.actionguard_db
    .prepare(
      'SELECT id, slug, display_name, overall_grade FROM services WHERE slug = ? OR canonical_domain = ? LIMIT 1',
    )
    .bind(slug, slug)
    .first<{ id: string; slug: string; display_name: string; overall_grade: string }>();

  if (!service) {
    return c.json({ error: 'Server not found' }, 404);
  }

  const endpoints = await c.env.actionguard_db
    .prepare(
      'SELECT id, url, current_schema_sha256, current_descriptions_sha256 FROM service_endpoints WHERE service_id = ?',
    )
    .bind(service.id)
    .all<{
      id: string;
      url: string;
      current_schema_sha256: string;
      current_descriptions_sha256: string;
    }>();

  const endpointIds = (endpoints.results || []).map((e) => e.id);
  if (endpointIds.length === 0) {
    return c.json({ service, snapshots: [], driftEvents: [] });
  }

  const snapshots = await c.env.actionguard_db
    .prepare(
      `SELECT id, endpoint_id, observed_at, schema_sha256, descriptions_sha256, tool_count, lint_score
       FROM snapshots
       WHERE endpoint_id IN (${endpointIds.map(() => '?').join(',')})
       ORDER BY observed_at DESC
       LIMIT 50`,
    )
    .bind(...endpointIds)
    .all();

  const driftEvents = await c.env.actionguard_db
    .prepare(
      `SELECT id, endpoint_id, severity, change_type, summary_json, detected_at
       FROM drift_events
       WHERE endpoint_id IN (${endpointIds.map(() => '?').join(',')})
       ORDER BY detected_at DESC
       LIMIT 50`,
    )
    .bind(...endpointIds)
    .all();

  return c.json({
    service,
    endpoints: endpoints.results,
    snapshots: snapshots.results || [],
    driftEvents: driftEvents.results || [],
  });
});

// High-Intent Developer Protocol Guides (/docs/:slug)
app.get('/docs/:slug', (c) => {
  const slug = c.req.param('slug');
  const guide = GUIDES[slug];
  if (!guide) {
    return c.redirect('/index', 301);
  }
  return c.html(renderGuideHtml(guide));
});

// Self-Serve Domain Verification UI
app.get('/verify', (c) => {
  return c.html(renderVerifyHtml(c.req.query('domain')));
});

// Transparent Pricing & Plans UI
app.get('/pricing', (c) => {
  return c.html(renderPricingHtml());
});

app.get('/pricing/success', (c) => {
  const tier = c.req.query('tier') || 'pro';
  const email = c.req.query('email') || '';
  return c.html(renderPricingSuccessHtml(tier, email));
});

// Self-Serve Stripe Checkout Session Creation
app.post('/api/stripe/checkout', async (c) => {
  try {
    const body = await c.req.json<{ plan: 'indie' | 'pro'; email: string }>();
    if (!body.email || !body.email.includes('@')) {
      return c.json({ error: 'Valid email address is required' }, 400);
    }
    const plan = body.plan === 'pro' ? 'pro' : 'indie';
    const origin = new URL(c.req.url).origin;
    const result = await createCheckoutSession(c.env, {
      plan,
      email: body.email,
      successUrl: `${origin}/pricing/success`,
      cancelUrl: `${origin}/pricing`,
    });
    return c.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.json({ error: `Failed to initiate checkout: ${msg}` }, 500);
  }
});

// Stripe Subscription Webhook Handler
app.post('/api/stripe/webhook', async (c) => {
  const result = await handleStripeWebhook(c.req.raw, c.env);
  return c.json(result);
});

// Interactive Schema Drift & Prompt Poisoning Simulator
app.get('/playground', (c) => {
  return c.html(renderPlaygroundHtml());
});

// API: Analyze MCP Tool Definition in Playground
app.post('/api/playground/analyze', async (c) => {
  const body = await c.req
    .json<{
      tool?: McpToolDefinition;
      baseline_schema_hash?: string;
      baseline_desc_hash?: string;
    }>()
    .catch(() => null);

  if (!body || !body.tool) {
    return c.json({ error: 'Valid tool definition required' }, 400);
  }

  const hashes = await computeDualHash([body.tool]);
  const scan = lintPromptInjection(body.tool.description || '');

  let classification = 'CLEAN_BASELINE';
  if (body.baseline_schema_hash && hashes.schema_sha256 !== body.baseline_schema_hash) {
    classification = 'BREAKING_SCHEMA_DRIFT';
  } else if (body.baseline_desc_hash && hashes.descriptions_sha256 !== body.baseline_desc_hash) {
    classification = 'SILENT_PROMPT_MUTATION';
  } else if (scan.hasInjection) {
    classification = 'SILENT_PROMPT_MUTATION';
  }

  return c.json({
    schema_sha256: hashes.schema_sha256,
    descriptions_sha256: hashes.descriptions_sha256,
    classification,
    is_poisoned: scan.hasInjection,
    findings: scan.findings,
  });
});

// API: Automated Ingestion Crawler Sync for Official MCP Servers
app.post('/api/catalog/sync', async (c) => {
  const result = await syncCrawlerCatalog(c.env);
  return c.json(result);
});

// Visual Schema & Prompt Diff Inspector Page
app.get('/diff', (c) => {
  return c.html(renderDiffPage());
});

// API: Detailed Schema & Prompt Diff Engine
app.post('/api/diff', async (c) => {
  const body = await c.req
    .json<{
      baseTools?: McpToolDefinition[];
      candTools?: McpToolDefinition[];
    }>()
    .catch(() => null);

  if (!body || !body.baseTools || !body.candTools) {
    return c.json({ error: 'Valid baseTools and candTools arrays required' }, 400);
  }

  const [baselineHashes, candidateHashes] = await Promise.all([
    computeDualHash(body.baseTools),
    computeDualHash(body.candTools),
  ]);

  const report = diffToolCatalogs(body.baseTools, body.candTools);

  return c.json({
    baselineHashes,
    candidateHashes,
    report,
  });
});

// Official MCP Registry Metadata (/server.json)
app.get('/server.json', (c) => {
  c.header('Access-Control-Allow-Origin', '*');
  return c.json({
    $schema: 'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json',
    name: 'io.github.lsendel/actionguard',
    title: 'ActionGuard Protocol Inspector Agent',
    description:
      'Diff and poisoning detection for MCP servers: catch schema drift and prompt poisoning.',
    version: '1.0.0',
    repository: {
      url: 'https://github.com/lsendel/actionguard',
      source: 'github',
    },
    remotes: [
      {
        type: 'streamable-http',
        url: 'https://actionguard.ai/mcp',
      },
    ],
  });
});

// A2A Protocol Agent Card (/.well-known/agent-card.json)
app.get('/.well-known/agent-card.json', (c) => {
  c.header('Access-Control-Allow-Origin', '*');
  return c.json({
    name: 'ActionGuard Protocol Inspector Agent',
    description:
      'Diff and poisoning detection for MCP servers: catch schema drift and prompt poisoning.',
    version: '1.0.0',
    documentationUrl: 'https://actionguard.ai/docs',
    provider: {
      organization: 'ActionGuard Protocol Inspector Agent',
      url: 'https://actionguard.ai',
    },
    supportedInterfaces: [
      {
        url: 'https://actionguard.ai/a2a/v1',
        protocolBinding: 'JSONRPC',
        protocolVersion: '1.0',
      },
    ],
    capabilities: {
      streaming: true,
      pushNotifications: false,
      extendedAgentCard: false,
    },
    defaultInputModes: ['application/json'],
    defaultOutputModes: ['application/json'],
    skills: [
      {
        id: 'inspect_agent',
        name: 'Inspect Agent Endpoint',
        description: 'Executes 5-stage protocol and security audit against target endpoint.',
        tags: ['general'],
        examples: ['Inspect https://example.com/mcp'],
      },
    ],
  });
});

// IndexNow Verification Key File (RFC IndexNow Protocol)
app.get(`/${INDEXNOW_KEY}.txt`, (c) => {
  return c.text(INDEXNOW_KEY, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=86400',
  });
});

// API: Trigger IndexNow Instant Search Engine Indexing
app.post('/api/seo/indexnow', async (c) => {
  const result = await submitToIndexNow(c.env);
  return c.json(result, result.success ? 200 : 500);
});

// API: Generate Developer API Key (Free Community or Pro)
app.post('/api/keys/create', async (c) => {
  const body = await c.req.json<{ email?: string; name?: string }>().catch(() => null);
  if (!body || !body.email || !body.email.includes('@')) {
    return c.json({ error: 'Valid developer email address is required' }, 400);
  }

  const result = await createNewApiKey(
    c.env,
    body.email.trim(),
    body.name || 'Developer Key',
    'free',
  );
  if (!result) {
    return c.json({ error: 'Database service unavailable' }, 500);
  }

  return c.json(result);
});

// Self-Serve Domain Verification API
app.post('/api/verify/check', async (c) => {
  const body = await c.req.json<{ domain?: string; token?: string }>().catch(() => null);
  if (!body || !body.domain || !body.token) {
    return c.json({ verified: false, message: 'Domain and token are required' }, 400);
  }

  const cleanDomain = body.domain
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .toLowerCase();
  const token = body.token.trim();
  let verified = false;

  // 1. Probe DNS TXT records via Cloudflare DoH (checking both _actionguard subdomain and root)
  try {
    for (const qName of [`_actionguard.${cleanDomain}`, cleanDomain]) {
      if (verified) break;
      const dohUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(qName)}&type=TXT`;
      const res = await fetch(dohUrl, {
        headers: { Accept: 'application/dns-json' },
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const data = (await res.json()) as { Answer?: Array<{ data: string }> };
        if (data.Answer) {
          for (const ans of data.Answer) {
            const raw = ans.data.replace(/^"|"$/g, '');
            if (raw.includes(`actionguard-verification=${token}`) || raw === token) {
              verified = true;
              break;
            }
          }
        }
      }
    }
  } catch {
    // DNS check failed
  }

  // 2. Fallback: check /.well-known/actionguard-verification.txt
  if (!verified) {
    try {
      const wellKnownUrl = `https://${cleanDomain}/.well-known/actionguard-verification.txt`;
      const wkRes = await fetch(wellKnownUrl, { signal: AbortSignal.timeout(3000) });
      if (wkRes.ok) {
        const text = await wkRes.text();
        if (text.trim() === token) {
          verified = true;
        }
      }
    } catch {
      // Well-known check failed
    }
  }

  if (verified && c.env.actionguard_db) {
    // Find or update the service in D1
    const service = await c.env.actionguard_db
      .prepare('SELECT id, slug FROM services WHERE canonical_domain = ? OR slug = ?')
      .bind(cleanDomain, cleanDomain)
      .first<{ id: string; slug: string }>();

    if (service) {
      await c.env.actionguard_db
        .prepare(`UPDATE services SET verification_tier = 'Domain Verified' WHERE id = ?`)
        .bind(service.id)
        .run();

      return c.json({
        verified: true,
        slug: service.slug,
        message: 'Domain ownership successfully verified via DNS/Well-Known challenge.',
      });
    }

    return c.json({
      verified: true,
      slug: cleanDomain,
      message: 'Domain ownership verified, but service was not yet indexed in database.',
    });
  }

  return c.json({
    verified: false,
    message: `Verification token not found on ${cleanDomain}. Ensure the TXT record "actionguard-verification=${token}" is published.`,
  });
});

// Watchlist Subscription API: Alert notifications for schema drift and downtime
app.post('/api/watchlist/subscribe', async (c) => {
  const body = await c.req
    .json<{ service_slug?: string; email?: string; webhook_url?: string }>()
    .catch(() => null);
  if (!body || !body.service_slug || !body.email) {
    return c.json(
      { error: 'Service slug and notification destination (email or webhook) are required' },
      400,
    );
  }

  const rawInput = body.email.trim();
  const isWebhook = rawInput.startsWith('http://') || rawInput.startsWith('https://');
  const email = !isWebhook && rawInput.includes('@') ? rawInput.toLowerCase() : null;
  const webhookUrl = isWebhook ? rawInput : body.webhook_url || null;

  if (!email && !webhookUrl) {
    return c.json(
      { error: 'Please enter a valid email address or webhook URL (Slack / Discord)' },
      400,
    );
  }

  if (!c.env.actionguard_db) {
    return c.json({ error: 'Database service unavailable' }, 500);
  }

  const service = await c.env.actionguard_db
    .prepare('SELECT id, display_name, canonical_domain, slug FROM services WHERE slug = ?')
    .bind(body.service_slug)
    .first<{ id: string; display_name: string; canonical_domain: string; slug: string }>();

  if (!service) {
    return c.json({ error: 'Service not found in ActionGuard catalog' }, 404);
  }

  // Find or create subscriber organization
  const subscriberOrgId = `org_${Math.random().toString(36).substring(2, 10)}`;
  const orgName = email || webhookUrl?.substring(0, 30) || 'Subscriber';
  await c.env.actionguard_db
    .prepare('INSERT OR IGNORE INTO organizations (id, name, slug) VALUES (?, ?, ?)')
    .bind(subscriberOrgId, orgName, orgName.replace(/[^a-z0-9]/g, '_'))
    .run();

  const watchlistId = `watch_${Math.random().toString(36).substring(2, 10)}`;

  // Find current schema hash
  const endpoint = await c.env.actionguard_db
    .prepare(
      'SELECT current_schema_sha256, current_descriptions_sha256 FROM service_endpoints WHERE service_id = ?',
    )
    .bind(service.id)
    .first<{ current_schema_sha256: string; current_descriptions_sha256: string }>();

  await c.env.actionguard_db
    .prepare(
      `INSERT INTO watchlist_items (id, subscriber_org_id, service_id, pinned_schema_sha256, pinned_descriptions_sha256, alert_webhook_url, notify_email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      watchlistId,
      subscriberOrgId,
      service.id,
      endpoint?.current_schema_sha256 || null,
      endpoint?.current_descriptions_sha256 || null,
      webhookUrl,
      email,
    )
    .run();

  // Send Welcome Confirmation Email if Resend API key is configured
  if (email && c.env.RESEND_API_KEY) {
    c.executionCtx.waitUntil(
      sendEmailViaResend({
        apiKey: c.env.RESEND_API_KEY,
        from: c.env.ALERT_FROM_EMAIL || 'ActionGuard Drift Monitor <alerts@where.care>',
        to: email,
        subject: `[ActionGuard] Active: Monitoring ${service.display_name}`,
        html: renderWelcomeEmailHtml({
          serviceName: service.display_name,
          domain: service.canonical_domain,
          slug: service.slug,
          pinnedHash: endpoint?.current_schema_sha256,
        }),
      }),
    );
  }

  const destinationDesc = isWebhook
    ? rawInput.includes('slack.com')
      ? 'Slack Channel'
      : rawInput.includes('discord.com')
        ? 'Discord Channel'
        : 'Webhook'
    : 'email';

  return c.json({
    success: true,
    message: `Active! Alerts for ${service.display_name} will be dispatched to your ${destinationDesc}.`,
  });
});

// Shared helper to enforce One domain, one profile and track real probe results
async function persistInspectionReport(
  db: D1Database,
  report: InspectionReport,
): Promise<{ serviceId: string; slug: string }> {
  const cleanDomain = report.targetDomain.toLowerCase();

  // Find existing service by canonical_domain or slug
  const existing = await db
    .prepare(
      'SELECT id, org_id, slug, verification_tier, overall_grade FROM services WHERE LOWER(canonical_domain) = ? OR slug = ? LIMIT 1',
    )
    .bind(cleanDomain, cleanDomain)
    .first<{
      id: string;
      org_id: string;
      slug: string;
      verification_tier: string;
      overall_grade: string;
    }>();

  const orgId = existing?.org_id || `org_pub_${cleanDomain.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const serviceId = existing?.id || `srv_${cleanDomain.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const slug = existing?.slug || cleanDomain;

  // Retrieve existing endpoint ID if present, to prevent creating duplicate endpoints
  const existingEp = existing
    ? await db
        .prepare('SELECT id FROM service_endpoints WHERE service_id = ? LIMIT 1')
        .bind(existing.id)
        .first<{ id: string }>()
    : null;
  const endpointId = existingEp?.id || `ep_${serviceId.replace(/^srv_/, '')}`;

  const isUp = report.score.grade !== 'F';
  const status = isUp ? 'up' : 'down';
  const gradeToStore = isUp ? report.score.grade : 'Unreachable';

  const latencyFinding = report.findings.find(
    (f) => f.id === 'transport_latency_fast' || f.id === 'transport_latency_standard',
  );
  const latencyMs = typeof latencyFinding?.details === 'number' ? latencyFinding.details : null;

  const schemaHash = report.hashes.schema_sha256 || null;
  const descriptionsHash = report.hashes.descriptions_sha256 || null;
  const probeId = `prb_${Math.random().toString(36).substring(2, 10)}`;

  if (!existing) {
    await db.batch([
      db
        .prepare('INSERT OR IGNORE INTO organizations (id, name, slug, tier) VALUES (?, ?, ?, ?)')
        .bind(orgId, report.targetDomain, slug, 'community'),
      db
        .prepare(
          `INSERT INTO services (id, org_id, slug, display_name, canonical_domain, overall_grade, verification_tier)
           VALUES (?, ?, ?, ?, ?, ?, 'Unverified (curated listing)')`,
        )
        .bind(serviceId, orgId, slug, report.targetDomain, cleanDomain, gradeToStore),
      db
        .prepare(
          `INSERT INTO service_endpoints (id, service_id, protocol, url, current_schema_sha256, current_descriptions_sha256, last_status, last_latency_ms, last_checked_at)
           VALUES (?, ?, 'mcp_streamable_http', ?, ?, ?, ?, ?, datetime('now'))
           ON CONFLICT(id) DO UPDATE SET
             current_schema_sha256 = excluded.current_schema_sha256,
             current_descriptions_sha256 = excluded.current_descriptions_sha256,
             last_status = excluded.last_status,
             last_latency_ms = excluded.last_latency_ms,
             last_checked_at = datetime('now')`,
        )
        .bind(
          endpointId,
          serviceId,
          report.targetUrl,
          schemaHash,
          descriptionsHash,
          status,
          latencyMs,
        ),
      db
        .prepare(
          `INSERT INTO probes (id, endpoint_id, probed_at, status, latency_ms, grade, findings_json)
           VALUES (?, ?, datetime('now'), ?, ?, ?, ?)`,
        )
        .bind(
          probeId,
          endpointId,
          status,
          latencyMs,
          gradeToStore,
          JSON.stringify(report.findings),
        ),
    ]);
  } else {
    // Preserve verification_tier; never raise or lower tier on inspection
    await db.batch([
      db
        .prepare('UPDATE services SET overall_grade = ? WHERE id = ?')
        .bind(gradeToStore, existing.id),
      db
        .prepare(
          `INSERT INTO service_endpoints (id, service_id, protocol, url, current_schema_sha256, current_descriptions_sha256, last_status, last_latency_ms, last_checked_at)
           VALUES (?, ?, 'mcp_streamable_http', ?, ?, ?, ?, ?, datetime('now'))
           ON CONFLICT(id) DO UPDATE SET
             current_schema_sha256 = excluded.current_schema_sha256,
             current_descriptions_sha256 = excluded.current_descriptions_sha256,
             last_status = excluded.last_status,
             last_latency_ms = excluded.last_latency_ms,
             last_checked_at = datetime('now')`,
        )
        .bind(
          endpointId,
          existing.id,
          report.targetUrl,
          schemaHash,
          descriptionsHash,
          status,
          latencyMs,
        ),
      db
        .prepare(
          `INSERT INTO probes (id, endpoint_id, probed_at, status, latency_ms, grade, findings_json)
           VALUES (?, ?, datetime('now'), ?, ?, ?, ?)`,
        )
        .bind(
          probeId,
          endpointId,
          status,
          latencyMs,
          gradeToStore,
          JSON.stringify(report.findings),
        ),
    ]);
  }

  return { serviceId, slug };
}

function createInternalFetcher(env: Env): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlStr =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    try {
      const parsed = new URL(urlStr);
      if (
        parsed.hostname === 'actionguard.ai' ||
        parsed.hostname === 'www.actionguard.ai' ||
        parsed.hostname === 'action-guard.com' ||
        parsed.hostname === 'www.action-guard.com'
      ) {
        return app.request(parsed.pathname + parsed.search, init, env);
      }
    } catch {
      // Fall through to global fetch
    }
    return fetch(input, init);
  };
}

// SSR Web UI: Run inspection from query param
app.get('/inspect', async (c) => {
  const url = c.req.query('url');
  if (!url) return c.redirect('/');

  try {
    const report = await runInspection(url, { fetchFn: createInternalFetcher(c.env) });

    // Save report to R2 asynchronously if bucket is bound
    if (c.env.actionguard_evidence) {
      c.executionCtx.waitUntil(
        c.env.actionguard_evidence.put(
          `reports/${report.id}.json`,
          JSON.stringify(report, null, 2),
          { httpMetadata: { contentType: 'application/json' } },
        ),
      );
    }

    // Persist to D1
    if (c.env.actionguard_db) {
      c.executionCtx.waitUntil(persistInspectionReport(c.env.actionguard_db, report));
    }

    return c.html(renderReportHtml(report));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.html(
      `<div style="font-family:sans-serif;padding:40px;color:#ef4444;background:#090d16;min-height:100vh;">
        <h2>Inspection Error</h2>
        <p>${msg}</p>
        <p><a href="/" style="color:#60a5fa;">&larr; Back to Inspector</a></p>
      </div>`,
      400,
    );
  }
});

// API: Run Live Inspection
app.post('/api/inspect', async (c) => {
  const body = await c.req.json<{ url: string }>().catch(() => null);
  if (!body || !body.url) {
    return c.json({ error: 'Missing required field: "url"' }, 400);
  }

  try {
    const report = await runInspection(body.url, { fetchFn: createInternalFetcher(c.env) });

    // Persist full report to R2
    if (c.env.actionguard_evidence) {
      await c.env.actionguard_evidence.put(
        `reports/${report.id}.json`,
        JSON.stringify(report, null, 2),
        { httpMetadata: { contentType: 'application/json' } },
      );
    }

    // Persist service & endpoint in D1
    if (c.env.actionguard_db) {
      await persistInspectionReport(c.env.actionguard_db, report);
    }

    return c.json(report);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.json({ error: msg }, 400);
  }
});

// API: Retrieve Stored Report by ID
app.get('/api/reports/:id', async (c) => {
  const id = c.req.param('id');
  if (!c.env.actionguard_evidence) {
    return c.json({ error: 'R2 storage not configured' }, 500);
  }

  const obj = await c.env.actionguard_evidence.get(`reports/${id}.json`);
  if (!obj) {
    return c.json({ error: 'Report not found' }, 404);
  }

  const data = await obj.json<InspectionReport>();
  return c.json(data);
});

// Dynamic SVG Status Badge (<50ms Edge Response)
app.get('/badge/:target', async (c) => {
  const rawTarget = c.req.param('target');
  const isJson = rawTarget.endsWith('.json');
  const slug = rawTarget.replace(/\.(svg|json)$/, '');
  const style = (c.req.query('style') as BadgeStyle) || 'flat';
  let grade = 'Pending';
  let tier = 'Unverified (curated listing)';
  const label = 'ActionGuard';
  let value = 'Pending';

  try {
    if (c.env.actionguard_db) {
      const row = await c.env.actionguard_db
        .prepare(
          `SELECT s.overall_grade, s.verification_tier, e.last_status
           FROM services s
           LEFT JOIN service_endpoints e ON s.id = e.service_id
           WHERE s.slug = ? OR LOWER(s.canonical_domain) = ?
           LIMIT 1`,
        )
        .bind(slug, slug.toLowerCase())
        .first<{ overall_grade: string; verification_tier: string; last_status?: string }>();

      if (row) {
        tier = row.verification_tier || 'Unverified (curated listing)';
        const isDown =
          row.last_status === 'down' ||
          row.overall_grade === 'Unreachable' ||
          row.overall_grade === 'F';
        if (isDown) {
          grade = 'Unreachable';
          value = 'Unreachable';
        } else if (row.overall_grade && row.overall_grade !== 'Pending') {
          grade = row.overall_grade;
          value = tier === 'Domain Verified' ? `${grade} • Domain Owner` : grade;
        } else {
          grade = 'Pending';
          value = 'Pending';
        }
      }
    }
  } catch {
    // Fallback gracefully
  }

  if (isJson) {
    const shieldsData = renderShieldsJson(label, value, grade, tier);
    return c.json(shieldsData, 200, {
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    });
  }

  const svg = renderBadgeSvg(label, value, grade, tier, style);
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  });
});

// Dynamic OpenGraph 1200x630 Social Card
app.get('/og/:target', async (c) => {
  const rawTarget = c.req.param('target');
  const slug = rawTarget.replace(/\.(svg|png)$/, '');

  let title = 'ActionGuard.ai';
  let domain = 'actionguard.ai';
  let grade = 'Pending';
  let tier = 'Unverified (curated listing)';
  let schemaHash: string | undefined = undefined;
  let latencyMs: number | null = null;
  let uptimeStr = 'Collecting data';

  try {
    if (c.env.actionguard_db) {
      const row = await c.env.actionguard_db
        .prepare(
          `SELECT s.id, s.display_name, s.canonical_domain, s.overall_grade, s.verification_tier,
                  e.id as ep_id, e.current_schema_sha256, e.last_latency_ms, e.last_status
           FROM services s
           LEFT JOIN service_endpoints e ON s.id = e.service_id
           WHERE s.slug = ? OR LOWER(s.canonical_domain) = ?
           LIMIT 1`,
        )
        .bind(slug, slug.toLowerCase())
        .first<{
          id: string;
          display_name: string;
          canonical_domain: string;
          overall_grade: string;
          verification_tier: string;
          ep_id?: string;
          current_schema_sha256?: string;
          last_latency_ms?: number;
          last_status?: string;
        }>();

      if (row) {
        title = row.display_name;
        domain = row.canonical_domain;
        tier = row.verification_tier || 'Unverified (curated listing)';

        const isDown =
          row.last_status === 'down' ||
          row.overall_grade === 'Unreachable' ||
          row.overall_grade === 'F';
        grade = isDown ? 'Unreachable' : row.overall_grade || 'Pending';

        if (row.current_schema_sha256) schemaHash = row.current_schema_sha256;
        if (row.last_latency_ms && row.last_latency_ms > 0) latencyMs = row.last_latency_ms;

        if (row.ep_id) {
          const probeRows = await c.env.actionguard_db
            .prepare(
              'SELECT probed_at, status, latency_ms FROM probes WHERE endpoint_id = ? ORDER BY probed_at DESC LIMIT 50',
            )
            .bind(row.ep_id)
            .all<{ probed_at: string; status: 'up' | 'down' | 'degraded'; latency_ms?: number }>();

          if (probeRows.results && probeRows.results.length > 0) {
            const stats = calculateUptimeStats(probeRows.results);
            uptimeStr = stats.displayUptime;
            if (stats.medianLatencyMs && latencyMs === null) latencyMs = stats.medianLatencyMs;
          }
        }
      }
    }
  } catch {
    // Fallback gracefully
  }

  const svg = renderOgCardSvg({
    title,
    domain,
    grade,
    tier,
    schemaHash,
    latencyMs,
    uptimeStr,
  });

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
});

// Trust-Aware Routing API (Model 3 & 5 Integration)
app.post('/v1/routing/resolve', async (c) => {
  if (!c.env.actionguard_db) {
    return c.json({ error: 'Database unavailable' }, 500);
  }

  const services = await c.env.actionguard_db
    .prepare(
      `SELECT s.id, s.slug, s.display_name, s.canonical_domain, s.overall_grade, e.url, e.current_schema_sha256, e.last_latency_ms
       FROM services s
       JOIN service_endpoints e ON s.id = e.service_id
       WHERE s.overall_grade IN ('A+', 'A')
       LIMIT 10`,
    )
    .all();

  return c.json({
    timestamp: new Date().toISOString(),
    matches: services.results || [],
  });
});

// Streamable HTTP / JSON-RPC 2.0 MCP Protocol Endpoint
app.all('/mcp', async (c) => {
  if (c.req.method === 'GET') {
    return c.json({
      protocolVersion: '2024-11-05',
      name: 'actionguard-inspector',
      status: 'ready',
      endpoints: {
        http: 'https://actionguard.ai/mcp',
      },
    });
  }

  const req = await c.req
    .json<{
      jsonrpc?: string;
      id?: number | string | null;
      method?: string;
      params?: {
        name?: string;
        arguments?: Record<string, unknown>;
      };
    }>()
    .catch(() => null);

  if (!req || req.jsonrpc !== '2.0') {
    return c.json(
      { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid Request' } },
      400,
    );
  }

  const { id, method, params } = req;

  if (method === 'initialize') {
    return c.json({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'actionguard-inspector',
          version: '0.1.0',
        },
      },
    });
  }

  if (method === 'notifications/initialized') {
    return new Response(null, { status: 204 });
  }

  if (method === 'ping') {
    return c.json({ jsonrpc: '2.0', id, result: {} });
  }

  if (method === 'tools/list') {
    return c.json({
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'actionguard_inspect',
            description:
              'Run a 5-stage continuous reliability, security, and schema audit of an MCP server or AI agent endpoint.',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The target MCP server or agent endpoint URL to audit',
                },
              },
              required: ['url'],
            },
            annotations: {
              readOnlyHint: true,
            },
          },
          {
            name: 'actionguard_check_drift',
            description:
              "Verify whether an MCP server's tools schema or descriptions have drifted from a pinned Dual-Hash.",
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The target MCP server endpoint URL',
                },
                pinnedSchemaHash: {
                  type: 'string',
                  description: 'Pinned 64-char hex SHA-256 schema hash',
                },
              },
              required: ['url', 'pinnedSchemaHash'],
            },
            annotations: {
              readOnlyHint: true,
            },
          },
        ],
      },
    });
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const toolArgs = params?.arguments || {};

    if (toolName === 'actionguard_inspect') {
      try {
        const report = await runInspection(toolArgs.url, {
          fetchFn: createInternalFetcher(c.env),
        });
        return c.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(report, null, 2),
              },
            ],
          },
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return c.json({
          jsonrpc: '2.0',
          id,
          error: { code: -32603, message: msg || 'Inspection failed' },
        });
      }
    }

    if (toolName === 'actionguard_check_drift') {
      try {
        const report = await runInspection(toolArgs.url, {
          fetchFn: createInternalFetcher(c.env),
        });
        const matches = report.hashes.schema_sha256 === toolArgs.pinnedSchemaHash;
        return c.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    matches,
                    targetUrl: toolArgs.url,
                    expectedHash: toolArgs.pinnedSchemaHash,
                    observedHash: report.hashes.schema_sha256,
                    drifted: !matches,
                    grade: report.score.grade,
                  },
                  null,
                  2,
                ),
              },
            ],
          },
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return c.json({
          jsonrpc: '2.0',
          id,
          error: { code: -32603, message: msg || 'Check failed' },
        });
      }
    }

    return c.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Tool not found: ${toolName}` },
    });
  }

  return c.json({
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  });
});

// AI Agent Zero-Trust Runtime Security Proxy ("Cloudflare for MCP")
app.all('/proxy', async (c) => handleProxyRequest(c.req.raw, c.env));
app.all('/proxy/:slug', async (c) =>
  handleProxyRequest(c.req.raw, c.env, undefined, undefined, c.req.param('slug')),
);
app.all('/v1/proxy', async (c) => handleProxyRequest(c.req.raw, c.env));
app.all('/v1/proxy/:slug', async (c) =>
  handleProxyRequest(c.req.raw, c.env, undefined, undefined, c.req.param('slug')),
);
app.all('/v1/routing/proxy', async (c) => handleProxyRequest(c.req.raw, c.env));

// Export default object with fetch and scheduled cron handler
export default {
  fetch: app.fetch,

  /**
   * Cloudflare Scheduled Cron Handler (Runs every 15 minutes)
   * Probes active endpoints, detects schema drift, and updates D1 status.
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    if (!env.actionguard_db) return;

    try {
      // Pick up to 5 endpoints due for probing
      const endpoints = await env.actionguard_db
        .prepare(
          `SELECT id, service_id, url, current_schema_sha256, current_descriptions_sha256
           FROM service_endpoints
           WHERE is_active = 1
           ORDER BY last_checked_at ASC NULLS FIRST
           LIMIT 5`,
        )
        .all<{
          id: string;
          service_id: string;
          url: string;
          current_schema_sha256: string;
          current_descriptions_sha256: string;
        }>();

      if (!endpoints.results || endpoints.results.length === 0) return;

      const internalFetcher = createInternalFetcher(env);

      for (const ep of endpoints.results) {
        ctx.waitUntil(
          (async () => {
            try {
              const report = await runInspection(ep.url, { fetchFn: internalFetcher });

              // Check for drift
              const schemaChanged = report.hashes.schema_sha256 !== ep.current_schema_sha256;
              const descriptionsChanged =
                report.hashes.descriptions_sha256 !== ep.current_descriptions_sha256;

              if (schemaChanged || descriptionsChanged) {
                const eventId = `drift_${Math.random().toString(36).substring(2, 9)}`;
                const severity = schemaChanged ? 'breaking' : 'security_warning';
                const changeType = schemaChanged ? 'schema_modified' : 'description_mutated';

                await env.actionguard_db
                  .prepare(
                    `INSERT INTO drift_events (id, endpoint_id, from_snapshot_id, to_snapshot_id, severity, change_type, summary_json)
                     VALUES (?, ?, 'prev', ?, ?, ?, ?)`,
                  )
                  .bind(
                    eventId,
                    ep.id,
                    report.id,
                    severity,
                    changeType,
                    JSON.stringify({
                      schemaChanged,
                      descriptionsChanged,
                      newSchemaHash: report.hashes.schema_sha256,
                      newDescHash: report.hashes.descriptions_sha256,
                    }),
                  )
                  .run();

                // Dispatch real-time alerts to watchlist subscribers via Resend and Webhooks
                const svc = await env.actionguard_db
                  .prepare('SELECT display_name, canonical_domain, slug FROM services WHERE id = ?')
                  .bind(ep.service_id)
                  .first<{ display_name: string; canonical_domain: string; slug: string }>();

                if (svc) {
                  ctx.waitUntil(
                    dispatchDriftAlerts(
                      env,
                      ep.service_id,
                      svc.display_name,
                      svc.canonical_domain,
                      svc.slug,
                      changeType,
                      severity,
                      ep.current_schema_sha256,
                      report.hashes.schema_sha256,
                      `https://actionguard.ai/servers/${svc.slug}`,
                    ),
                  );
                }
              }

              // Update endpoint record and record probe
              const isUnreachable = report.findings.some((f) => f.id === 'transport_unreachable');
              const status = isUnreachable ? 'down' : 'up';
              const gradeToStore = isUnreachable ? 'Unreachable' : report.score.grade;
              const latencyFinding = report.findings.find(
                (f) => f.id === 'transport_latency_fast' || f.id === 'transport_latency_standard',
              );
              const latencyMs =
                typeof latencyFinding?.details === 'number' ? latencyFinding.details : null;

              await env.actionguard_db.batch([
                env.actionguard_db
                  .prepare(
                    `UPDATE service_endpoints
                     SET current_schema_sha256 = ?,
                         current_descriptions_sha256 = ?,
                         last_status = ?,
                         last_latency_ms = ?,
                         last_checked_at = datetime('now')
                     WHERE id = ?`,
                  )
                  .bind(
                    report.hashes.schema_sha256 || null,
                    report.hashes.descriptions_sha256 || null,
                    status,
                    latencyMs,
                    ep.id,
                  ),
                env.actionguard_db
                  .prepare('UPDATE services SET overall_grade = ? WHERE id = ?')
                  .bind(gradeToStore, ep.service_id),
                env.actionguard_db
                  .prepare(
                    `INSERT INTO probes (id, endpoint_id, probed_at, status, latency_ms, grade, findings_json)
                     VALUES (?, ?, datetime('now'), ?, ?, ?, ?)`,
                  )
                  .bind(
                    `prb_${Math.random().toString(36).substring(2, 10)}`,
                    ep.id,
                    status,
                    latencyMs,
                    gradeToStore,
                    JSON.stringify(report.findings),
                  ),
              ]);
            } catch {
              // Mark unreachable on network error
              await env.actionguard_db.batch([
                env.actionguard_db
                  .prepare(
                    `UPDATE service_endpoints SET last_status = 'down', last_checked_at = datetime('now') WHERE id = ?`,
                  )
                  .bind(ep.id),
                env.actionguard_db
                  .prepare("UPDATE services SET overall_grade = 'Unreachable' WHERE id = ?")
                  .bind(ep.service_id),
                env.actionguard_db
                  .prepare(
                    `INSERT INTO probes (id, endpoint_id, probed_at, status, latency_ms, grade, findings_json)
                     VALUES (?, ?, datetime('now'), 'down', NULL, 'Unreachable', '[]')`,
                  )
                  .bind(`prb_${Math.random().toString(36).substring(2, 10)}`, ep.id),
              ]);
            }
          })(),
        );
      }
    } catch (err) {
      console.error('Scheduled probe failed:', err);
    }
  },
};
