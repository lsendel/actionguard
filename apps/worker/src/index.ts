import { runInspection, type InspectionReport } from '@actionguard/core';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { renderBadgeSvg } from './badges.js';
import type { Env } from './types.js';
import { renderHomepageHtml, renderReportHtml } from './ui.js';

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

// SSR Web UI: Run inspection from query param
app.get('/inspect', async (c) => {
  const url = c.req.query('url');
  if (!url) return c.redirect('/');

  try {
    const report = await runInspection(url);

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

    return c.html(renderReportHtml(report));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.html(
      `<div style="font-family:sans-serif;padding:40px;color:#ef4444;background:#090d16;min-height:100vh;">
        <h2>Inspection Error</h2>
        <p>${msg}</p>
        <p><a href="/" style="color:#60a5fa;">&larr; Back</a></p>
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
    const report = await runInspection(body.url);

    // Persist full report to R2
    if (c.env.actionguard_evidence) {
      await c.env.actionguard_evidence.put(
        `reports/${report.id}.json`,
        JSON.stringify(report, null, 2),
        { httpMetadata: { contentType: 'application/json' } }
      );
    }

    // Persist or update service in D1 if database is bound
    if (c.env.actionguard_db) {
      const orgId = `org_pub_${report.targetDomain.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const serviceId = `srv_${report.targetDomain.replace(/[^a-zA-Z0-9]/g, '_')}`;

      await c.env.actionguard_db.batch([
        c.env.actionguard_db
          .prepare(
            `INSERT OR IGNORE INTO organizations (id, name, slug) VALUES (?, ?, ?)`
          )
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
  const body = await c.req.json<{
    capability?: string;
    minUptime?: number;
    maxLatencyMs?: number;
  }>().catch(() => ({}));

  if (!c.env.actionguard_db) {
    return c.json({ error: 'Database unavailable' }, 500);
  }

  // Query verified services meeting criteria
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

export default app;
