import fs from 'node:fs';
import path from 'node:path';
import { computeDualHash } from '../../../packages/core/dist/index.js';
import { TOP_25_SERVERS } from './seed-top-25-servers.js';

async function main() {
  let sql = '-- Auto-generated Seed SQL for Top 25 Authoritative MCP Servers\n\n';

  for (const s of TOP_25_SERVERS) {
    const hashes = await computeDualHash(s.tools);
    const orgId = `org_${s.slug.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const serviceId = `srv_${s.slug.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const endpointId = `ep_${s.slug.replace(/[^a-zA-Z0-9]/g, '_')}`;

    sql += `INSERT OR REPLACE INTO organizations (id, name, slug, tier) VALUES ('${orgId}', '${s.displayName.replace(/'/g, "''")}', '${s.slug}', 'verified');\n`;
    sql += `INSERT OR REPLACE INTO services (id, org_id, slug, display_name, canonical_domain, repository_url, verification_tier, overall_grade) VALUES ('${serviceId}', '${orgId}', '${s.slug}', '${s.displayName.replace(/'/g, "''")}', '${s.canonicalDomain}', '${s.repoUrl}', '${s.tier}', '${s.grade}');\n`;
    sql += `INSERT OR REPLACE INTO service_endpoints (id, service_id, protocol, url, current_schema_sha256, current_descriptions_sha256, last_status, last_latency_ms, last_checked_at) VALUES ('${endpointId}', '${serviceId}', 'mcp_streamable_http', 'https://${s.canonicalDomain}/mcp', '${hashes.schema_sha256}', '${hashes.descriptions_sha256}', 'up', ${s.latencyMs}, datetime('now'));\n\n`;
  }

  const outPath = path.resolve('seed.sql');
  fs.writeFileSync(outPath, sql);
  console.log(`Generated ${TOP_25_SERVERS.length} servers in ${outPath}`);
}

main().catch(console.error);
