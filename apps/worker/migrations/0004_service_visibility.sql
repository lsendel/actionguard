-- Migration 0004: per-service public visibility (hide-not-delete).
--
-- listed=1 is the default, so every existing and future service stays public
-- unless explicitly hidden. listed=0 removes a service from public discovery
-- surfaces (homepage index, status page, sitemap, IndexNow pings, routing
-- resolve) while keeping its rows, endpoints, probes and detail pages intact
-- so a service can be re-listed later (per-service opt-in re-add).

ALTER TABLE services ADD COLUMN listed INTEGER NOT NULL DEFAULT 1;
CREATE INDEX IF NOT EXISTS idx_services_listed ON services(listed);

-- Hide the owner's four fleet endpoints from the public index. Rows are NOT
-- deleted; re-listing is `UPDATE services SET listed = 1 WHERE slug = ...`.
UPDATE services
SET listed = 0
WHERE LOWER(canonical_domain) IN (
    'mcp.families.care',
    'llmrank.app',
    'mcp.llmrank.app',
    'analytics.where.care',
    'actionguard-worker.luis-diaz-s.workers.dev'
  )
  OR slug IN (
    'families-care-mcp',
    'wherecare-analytics',
    'llm-boost',
    'actionguard-worker.luis-diaz-s.workers.dev'
  );
