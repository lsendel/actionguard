import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Migration 0004 introduces services.listed (hide-not-delete). These tests
// guard the contract: the migration defaults everything public, hides exactly
// the four owner fleet services, and every public listing surface filters on
// listed = 1 while direct detail lookups stay unfiltered.

const workerDir = join(__dirname, '..');
const migration = readFileSync(join(workerDir, 'migrations/0004_service_visibility.sql'), 'utf8');
const indexSrc = readFileSync(join(workerDir, 'src/index.ts'), 'utf8');
const indexNowSrc = readFileSync(join(workerDir, 'src/indexnow.ts'), 'utf8');

describe('Service visibility (listed flag, migration 0004)', () => {
  it('adds services.listed defaulting to public', () => {
    expect(migration).toMatch(/ALTER TABLE services ADD COLUMN listed INTEGER NOT NULL DEFAULT 1/);
    expect(migration).toMatch(/CREATE INDEX IF NOT EXISTS idx_services_listed/);
  });

  it('hides exactly the four owner fleet services, by domain or slug, without deleting rows', () => {
    expect(migration).not.toMatch(/DELETE FROM services/i);
    for (const domain of [
      'mcp.families.care',
      'llmrank.app',
      'analytics.where.care',
      'actionguard-worker.luis-diaz-s.workers.dev',
    ]) {
      expect(migration).toContain(domain);
    }
    for (const slug of ['families-care-mcp', 'wherecare-analytics', 'llm-boost']) {
      expect(migration).toContain(slug);
    }
    expect(migration).toMatch(/UPDATE services\s+SET listed = 0/i);
  });

  it('filters the homepage index count and list by listed = 1', () => {
    expect(indexSrc).toContain('SELECT COUNT(*) as total FROM services WHERE listed = 1');
    expect(indexSrc).toMatch(
      /LEFT JOIN service_endpoints e ON s\.id = e\.service_id\s+WHERE s\.listed = 1\s+GROUP BY s\.id/,
    );
  });

  it('filters the status page by listed = 1', () => {
    expect(indexSrc).toMatch(
      /LEFT JOIN service_endpoints e ON s\.id = e\.service_id\s+WHERE s\.listed = 1\s+ORDER BY s\.display_name ASC/,
    );
  });

  it('filters the sitemap and IndexNow pings by listed = 1', () => {
    expect(indexSrc).toContain('SELECT slug, created_at FROM services WHERE listed = 1 LIMIT 500');
    expect(indexNowSrc).toContain('SELECT slug FROM services WHERE listed = 1 LIMIT 100');
  });

  it('filters routing resolve by listed = 1', () => {
    expect(indexSrc).toContain("WHERE s.overall_grade IN ('A+', 'A') AND s.listed = 1");
  });

  it('keeps direct detail lookups unfiltered (hide-not-delete: deep links still work)', () => {
    // /servers/:slug, /connect/:slug and badges resolve a single service by
    // slug or domain and must keep working for hidden services.
    const detailLookups =
      indexSrc.match(/WHERE s\.slug = \? OR LOWER\(s\.canonical_domain\) = \?/g) || [];
    expect(detailLookups.length).toBeGreaterThanOrEqual(2);
  });

  it('mirror: a listing query over mixed services returns only listed ones', () => {
    interface ServiceRow {
      slug: string;
      listed: number;
    }
    const rows: ServiceRow[] = [
      { slug: 'github-mcp', listed: 1 },
      { slug: 'families-care-mcp', listed: 0 },
      { slug: 'stripe-mcp', listed: 1 },
    ];
    // Mirrors the WHERE s.listed = 1 predicate applied by the public surfaces.
    const publicRows = rows.filter((r) => r.listed === 1);
    expect(publicRows.map((r) => r.slug)).toEqual(['github-mcp', 'stripe-mcp']);
  });
});
