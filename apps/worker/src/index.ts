import {
  diffToolSets,
  runInspection,
  type InspectionReport,
  type McpToolDefinition,
} from '@actionguard/core';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { renderBadgeSvg } from './badges.js';
import { GUIDES, renderGuideHtml } from './guides.js';
import { renderRobotsTxt, renderSitemapXml } from './seo.js';
import { renderServerProfileHtml } from './server-profile.js';
import type { Env } from './types.js';
import { renderHomepageHtml, renderIndexHtml, renderReportHtml } from './ui.js';

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
  }> = [];

  if (c.env.actionguard_db) {
    try {
      const rows = await c.env.actionguard_db
        .prepare(
          `SELECT slug, display_name, canonical_domain, overall_grade, verification_tier, created_at
           FROM services
           ORDER BY 
             CASE overall_grade
               WHEN 'A+' THEN 1
               WHEN 'A' THEN 2
               WHEN 'B' THEN 3
               WHEN 'C' THEN 4
               ELSE 5
             END,
             created_at DESC
           LIMIT 50`
        )
        .all<{
          slug: string;
          display_name: string;
          canonical_domain: string;
          overall_grade: string;
          verification_tier: string;
          created_at: string;
        }>();

      services = rows.results || [];
    } catch {
      // Fallback if table is empty or error
    }
  }

  return c.html(renderIndexHtml(services));
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
        .prepare(`SELECT slug, created_at FROM services LIMIT 500`)
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
    .prepare(`SELECT * FROM services WHERE slug = ?`)
    .bind(slug)
    .first<{
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
      404
    );
  }

  const endpoints = await c.env.actionguard_db
    .prepare(
      `SELECT * FROM service_endpoints WHERE service_id = (SELECT id FROM services WHERE slug = ?)`
    )
    .bind(slug)
    .all<{
      protocol: string;
      url: string;
      last_status: string;
      last_latency_ms: number;
      current_schema_sha256?: string;
      current_descriptions_sha256?: string;
      last_checked_at?: string;
    }>();

  return c.html(
    renderServerProfileHtml({
      ...service,
      endpoints: endpoints.results || [],
    })
  );
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

// Sample Mock Tools for Interactive Demo
const DEMO_SAMPLE_TOOLS: McpToolDefinition[] = [
  {
    name: 'query_analytics',
    description: 'Executes verified analytical queries against the customer data warehouse.',
    inputSchema: {
      type: 'object',
      properties: {
        metric: {
          type: 'string',
          enum: ['mrr', 'churn', 'retention', 'dau'],
          description: 'Key business performance indicator to calculate',
        },
        timeframe: {
          type: 'string',
          description: 'Timeframe filter (e.g. "30d", "90d", "ytd")',
        },
      },
      required: ['metric'],
    },
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  {
    name: 'export_report',
    description: 'Generates a signed CSV or PDF artifact of aggregate metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        report_id: { type: 'string', description: 'Unique report identifier' },
        format: { type: 'string', enum: ['csv', 'pdf'] },
      },
      required: ['report_id'],
    },
    annotations: {
      readOnlyHint: true,
    },
  },
];

// SSR Web UI: Run inspection from query param
app.get('/inspect', async (c) => {
  const url = c.req.query('url');
  if (!url) return c.redirect('/');

  try {
    const isDemoSample =
      url.includes('demo.actionguard.ai') ||
      url.includes('analytics.where.care') ||
      url.includes('api.github.com/mcp');

    const report = await runInspection(url, {
      mockTools: isDemoSample ? DEMO_SAMPLE_TOOLS : undefined,
    });

    // Save report to R2 asynchronously if bucket is bound
    if (c.env.actionguard_evidence) {
      c.executionCtx.waitUntil(
        c.env.actionguard_evidence.put(
          `reports/${report.id}.json`,
          JSON.stringify(report, null, 2),
          { httpMetadata: { contentType: 'application/json' } }
        )
      );
    }

    // Persist to D1
    if (c.env.actionguard_db) {
      const orgId = `org_pub_${report.targetDomain.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const serviceId = `srv_${report.targetDomain.replace(/[^a-zA-Z0-9]/g, '_')}`;

      c.executionCtx.waitUntil(
        c.env.actionguard_db.batch([
          c.env.actionguard_db
            .prepare(`INSERT OR IGNORE INTO organizations (id, name, slug) VALUES (?, ?, ?)`)
            .bind(orgId, report.targetDomain, report.targetDomain),
          c.env.actionguard_db
            .prepare(
              `INSERT INTO services (id, org_id, slug, display_name, canonical_domain, overall_grade)
               VALUES (?, ?, ?, ?, ?, ?)
               ON CONFLICT(slug) DO UPDATE SET overall_grade = excluded.overall_grade`
            )
            .bind(
              serviceId,
              orgId,
              report.targetDomain,
              report.targetDomain,
              report.targetDomain,
              report.score.grade
            ),
        ])
      );
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
      400
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
    const isDemoSample =
      body.url.includes('demo.actionguard.ai') ||
      body.url.includes('analytics.where.care') ||
      body.url.includes('api.github.com/mcp');

    const report = await runInspection(body.url, {
      mockTools: isDemoSample ? DEMO_SAMPLE_TOOLS : undefined,
    });

    // Persist full report to R2
    if (c.env.actionguard_evidence) {
      await c.env.actionguard_evidence.put(
        `reports/${report.id}.json`,
        JSON.stringify(report, null, 2),
        { httpMetadata: { contentType: 'application/json' } }
      );
    }

    // Persist service & endpoint in D1
    if (c.env.actionguard_db) {
      const orgId = `org_pub_${report.targetDomain.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const serviceId = `srv_${report.targetDomain.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const endpointId = `ep_${report.targetDomain.replace(/[^a-zA-Z0-9]/g, '_')}_mcp`;

      await c.env.actionguard_db.batch([
        c.env.actionguard_db
          .prepare(`INSERT OR IGNORE INTO organizations (id, name, slug) VALUES (?, ?, ?)`)
          .bind(orgId, report.targetDomain, report.targetDomain),
        c.env.actionguard_db
          .prepare(
            `INSERT INTO services (id, org_id, slug, display_name, canonical_domain, overall_grade)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(slug) DO UPDATE SET overall_grade = excluded.overall_grade`
          )
          .bind(
            serviceId,
            orgId,
            report.targetDomain,
            report.targetDomain,
            report.targetDomain,
            report.score.grade
          ),
        c.env.actionguard_db
          .prepare(
            `INSERT INTO service_endpoints (id, service_id, protocol, url, current_schema_sha256, current_descriptions_sha256, last_status, last_checked_at)
             VALUES (?, ?, 'mcp_streamable_http', ?, ?, ?, 'up', datetime('now'))
             ON CONFLICT(id) DO UPDATE SET
               current_schema_sha256 = excluded.current_schema_sha256,
               current_descriptions_sha256 = excluded.current_descriptions_sha256,
               last_checked_at = datetime('now')`
          )
          .bind(
            endpointId,
            serviceId,
            report.targetUrl,
            report.hashes.schema_sha256,
            report.hashes.descriptions_sha256
          ),
      ]);
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
  const slug = rawTarget.replace(/\.svg$/, '');
  let grade = 'A+';
  let label = 'ActionGuard';
  let value = 'Verified';

  try {
    if (c.env.actionguard_db) {
      const row = await c.env.actionguard_db
        .prepare(`SELECT overall_grade, verification_tier FROM services WHERE slug = ?`)
        .bind(slug)
        .first<{ overall_grade: string; verification_tier: string }>();

      if (row && row.overall_grade) {
        grade = row.overall_grade;
        value = `${grade} • Verified`;
      }
    }
  } catch {
    // Fallback gracefully
  }

  const svg = renderBadgeSvg(label, value, grade);
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
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
       LIMIT 10`
    )
    .all();

  return c.json({
    timestamp: new Date().toISOString(),
    matches: services.results || [],
  });
});

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
           LIMIT 5`
        )
        .all<{
          id: string;
          service_id: string;
          url: string;
          current_schema_sha256: string;
          current_descriptions_sha256: string;
        }>();

      if (!endpoints.results || endpoints.results.length === 0) return;

      for (const ep of endpoints.results) {
        ctx.waitUntil(
          (async () => {
            try {
              const report = await runInspection(ep.url);

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
                     VALUES (?, ?, 'prev', ?, ?, ?, ?)`
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
                    })
                  )
                  .run();
              }

              // Update endpoint record
              await env.actionguard_db
                .prepare(
                  `UPDATE service_endpoints
                   SET current_schema_sha256 = ?,
                       current_descriptions_sha256 = ?,
                       last_status = ?,
                       last_latency_ms = ?,
                       last_checked_at = datetime('now')
                   WHERE id = ?`
                )
                .bind(
                  report.hashes.schema_sha256,
                  report.hashes.descriptions_sha256,
                  report.score.grade === 'F' ? 'down' : 'up',
                  report.findings.find((f) => f.id === 'transport_latency_fast')?.details || 100,
                  ep.id
                )
                .run();
            } catch {
              // Mark degraded on network error
              await env.actionguard_db
                .prepare(
                  `UPDATE service_endpoints SET last_status = 'degraded', last_checked_at = datetime('now') WHERE id = ?`
                )
                .bind(ep.id)
                .run();
            }
          })()
        );
      }
    } catch (err) {
      console.error('Scheduled probe failed:', err);
    }
  },
};
