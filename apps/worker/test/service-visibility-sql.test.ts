import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';

const root = join(__dirname, '..');
const source = readFileSync(join(root, 'src/index.ts'), 'utf8');
const indexnow = readFileSync(join(root, 'src/indexnow.ts'), 'utf8');
function fixture() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(join(root, 'migrations/0001_initial.sql'), 'utf8'));
  db.exec("INSERT INTO organizations (id,name,slug) VALUES ('owner','Owner','owner')");
  const services = [
    ['families-care-mcp', 'mcp.families.care'],
    ['wherecare-analytics', 'analytics.where.care'],
    ['llm-boost', 'llmrank.app'],
    ['actionguard-worker.luis-diaz-s.workers.dev', 'actionguard-worker.luis-diaz-s.workers.dev'],
    ['public-mcp', 'public.example'],
  ];
  for (const [id, domain] of services) {
    db.prepare(
      'INSERT INTO services (id,org_id,slug,display_name,canonical_domain,overall_grade) VALUES (?, ?, ?, ?, ?, ?)',
    ).run(id, 'owner', id, id, domain, 'A');
    db.prepare(
      'INSERT INTO service_endpoints (id,service_id,protocol,url) VALUES (?, ?, ?, ?)',
    ).run(id, id, 'mcp', `https://${domain}/mcp`);
    db.prepare(
      'INSERT INTO snapshots (id,endpoint_id,schema_sha256,descriptions_sha256,r2_payload_key) VALUES (?, ?, ?, ?, ?)',
    ).run(id, id, 'schema', 'description', 'evidence');
  }
  db.exec(readFileSync(join(root, 'migrations/0004_service_visibility.sql'), 'utf8'));
  return db;
}

describe('actual migrated visibility SQL', () => {
  it('hides four fixtures without deleting services,endpoints or snapshots; defaults new services public', () => {
    const db = fixture();
    expect(db.prepare('SELECT slug FROM services WHERE listed=0 ORDER BY slug').all()).toHaveLength(
      4,
    );
    for (const table of ['services', 'service_endpoints', 'snapshots'])
      expect(db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get()?.n).toBe(5);
    db.exec(
      "INSERT INTO services (id,org_id,slug,display_name,canonical_domain) VALUES ('new','owner','new','New','new.example')",
    );
    expect(db.prepare("SELECT listed FROM services WHERE id='new'").get()?.listed).toBe(1);
    db.close();
  });
  it('executes the real index,status,feed,sitemap,routing and IndexNow queries', () => {
    const db = fixture();
    const statements = [...source.matchAll(/`(SELECT[^`]+)`|'(SELECT[^']+)'/g)]
      .map((m) => m[1] || m[2])
      .filter((s) => s.includes('listed = 1'));
    statements.push(...[...indexnow.matchAll(/'(SELECT[^']+listed = 1[^']*)'/g)].map((m) => m[1]));
    expect(statements).toHaveLength(7);
    for (const sql of statements) {
      const rows = db.prepare(sql).all();
      expect(rows).toHaveLength(1);
      if ('total' in rows[0]) expect(rows[0].total).toBe(1);
      else expect(rows[0].slug).toBe('public-mcp');
    }
    db.close();
  });
  it('preserves direct detail lookup and allows explicit re-listing', () => {
    const db = fixture();
    expect(
      db.prepare('SELECT slug FROM services WHERE slug=?').get('families-care-mcp')?.slug,
    ).toBe('families-care-mcp');
    db.exec("UPDATE services SET listed=1 WHERE slug='families-care-mcp'");
    expect(db.prepare('SELECT COUNT(*) AS n FROM services WHERE listed=1').get()?.n).toBe(2);
    db.close();
  });
});
