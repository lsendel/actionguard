import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import type { InspectionReport } from '@actionguard/core';
import { describe, expect, it } from 'vitest';
import { persistInspectionReport } from '../src/index.js';
import {
  KNOWN_OWNER_DOMAINS,
  newServiceVisibility,
  validateOwnerMarker,
} from '../src/owner-visibility.js';
const root = join(__dirname, '..');
function fixture() {
  const db = new DatabaseSync(':memory:');
  for (const file of [
    '0001_initial.sql',
    '0004_service_visibility.sql',
    '0005_owner_registration_visibility.sql',
  ])
    db.exec(readFileSync(join(root, 'migrations', file), 'utf8'));
  db.exec(
    'CREATE TABLE probes (id TEXT PRIMARY KEY,endpoint_id TEXT,probed_at TEXT,status TEXT,latency_ms INTEGER,grade TEXT,findings_json TEXT)',
  );
  const prep = (sql: string, args: unknown[] = []) => ({
    sql,
    args,
    bind: (...args: unknown[]) => prep(sql, args),
    first: async () => db.prepare(sql).get(...(args as [])) ?? null,
  });
  const shim = {
    prepare: (sql: string) => prep(sql),
    batch: async (stmts: ReturnType<typeof prep>[]) => {
      db.exec('BEGIN');
      try {
        const out = stmts.map((s) => db.prepare(s.sql).run(...(s.args as [])));
        db.exec('COMMIT');
        return out;
      } catch (e) {
        db.exec('ROLLBACK');
        throw e;
      }
    },
  } as unknown as D1Database;
  const report = (domain: string) =>
    ({
      targetDomain: domain,
      targetUrl: `https://${domain}/mcp`,
      score: { grade: 'A' },
      findings: [],
      hashes: {},
    }) as InspectionReport;
  const row = (domain: string) =>
    db
      .prepare(
        'SELECT listed,owner_fleet,public_approval_ref FROM services WHERE canonical_domain=?',
      )
      .get(domain);
  return { db, shim, report, row };
}
describe('owner-only registration guard', () => {
  it('keeps SQL inventory identical to application inventory', () => {
    const f = fixture();
    const rows = f.db.prepare('SELECT domain FROM owner_fleet_domains ORDER BY domain').all();
    expect(rows.map((r) => r.domain)).toEqual([...KNOWN_OWNER_DOMAINS].sort());
    f.db.close();
  });

  it('defaults known owned domains hidden even when marker omitted', async () => {
    const f = fixture();
    for (const domain of KNOWN_OWNER_DOMAINS) {
      await persistInspectionReport(f.shim, f.report(domain));
      expect(f.row(domain)?.listed).toBe(0);
      expect(f.row(domain)?.owner_fleet).toBe(1);
    }
    f.db.close();
  });
  it('hides a new owner-marked endpoint and preserves it on later unmarked inspections', async () => {
    const f = fixture();
    await persistInspectionReport(f.shim, f.report('new-owned.example'), true);
    await persistInspectionReport(f.shim, f.report('new-owned.example'));
    expect(f.row('new-owned.example')?.listed).toBe(0);
    f.db.close();
  });
  it('retains public default for unrelated third-party inspection and catalog inserts', async () => {
    const f = fixture();
    await persistInspectionReport(f.shim, f.report('third-party.example'));
    expect(f.row('third-party.example')?.listed).toBe(1);
    f.db.exec(
      "INSERT INTO services(id,org_id,slug,display_name,canonical_domain) VALUES('catalog','org_pub_third_party_example','catalog','Catalog','catalog.example')",
    );
    expect(f.row('catalog.example')?.listed).toBe(1);
    f.db.close();
  });
  it('does not let untrusted owner marker hide an existing public record', async () => {
    const f = fixture();
    await persistInspectionReport(f.shim, f.report('third-party.example'));
    await expect(
      persistInspectionReport(f.shim, f.report('third-party.example'), true),
    ).rejects.toThrow('authenticated operator');
    expect(f.row('third-party.example')?.listed).toBe(1);
    f.db.close();
  });
  it('DB insert guard catches known-owner catalog paths and public exception requires operator source', async () => {
    const f = fixture();
    await persistInspectionReport(f.shim, f.report('third-party.example'));
    f.db.exec(
      "INSERT INTO services(id,org_id,slug,display_name,canonical_domain) VALUES('owned','org_pub_third_party_example','owned','Owned','mcp.families.care')",
    );
    expect(f.row('mcp.families.care')?.listed).toBe(0);
    expect(() => f.db.exec("UPDATE services SET listed=1 WHERE id='owned'")).toThrow(
      'approval reference',
    );
    f.db.exec(
      "UPDATE services SET public_approval_ref='operator-verified-owner-decision',listed=1 WHERE id='owned'",
    );
    expect(f.row('mcp.families.care')?.listed).toBe(1);
    expect(() => f.db.exec("UPDATE services SET owner_fleet=0 WHERE id='owned'")).toThrow(
      'operator migration',
    );
    f.db.close();
  });
  it('requires explicit unlisted marker value; never accepts public opt-in', () => {
    expect(validateOwnerMarker(undefined, undefined)).toBe(false);
    expect(validateOwnerMarker(true, 'unlisted')).toBe(true);
    expect(() => validateOwnerMarker(true, 'public')).toThrow();
    expect(() => validateOwnerMarker('true', 'unlisted')).toThrow();
    expect(() => validateOwnerMarker(true, undefined)).toThrow();
    expect(newServiceVisibility('notanalytics.where.care', false).listed).toBe(1);
    expect(newServiceVisibility('MCP.FAMILIES.CARE.', false).listed).toBe(0);
    expect(() => validateOwnerMarker(undefined, 'unlisted')).toThrow();
  });
});
