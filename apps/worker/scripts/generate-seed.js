import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOP_25_SERVERS, generateSeedSql } from './seed-top-25-servers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const sql = await generateSeedSql();
  const outPath = path.resolve(__dirname, '../seed.sql');
  fs.writeFileSync(outPath, sql);
  console.log(`Generated ${TOP_25_SERVERS.length} servers in ${outPath}`);
}

main().catch(console.error);
