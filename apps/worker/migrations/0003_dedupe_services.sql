-- Migration 0003: Deduplicate services by canonical domain, track probes, and reset unearned verification tiers

-- 1. Create probes table for historical uptime, latency, and status measurements
CREATE TABLE IF NOT EXISTS probes (
    id TEXT PRIMARY KEY,
    endpoint_id TEXT NOT NULL REFERENCES service_endpoints(id) ON DELETE CASCADE,
    probed_at TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL, -- 'up', 'down', 'degraded'
    latency_ms INTEGER,
    grade TEXT,
    findings_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_probes_endpoint_time ON probes(endpoint_id, probed_at DESC);

-- 2. Repoint service_endpoints from duplicate services to the canonical service row
UPDATE service_endpoints
SET service_id = (
    SELECT s1.id
    FROM services s1
    WHERE LOWER(s1.canonical_domain) = (
        SELECT LOWER(s2.canonical_domain)
        FROM services s2
        WHERE s2.id = service_endpoints.service_id
    )
    ORDER BY 
      (SELECT COUNT(*) FROM service_endpoints ep JOIN snapshots sn ON sn.endpoint_id = ep.id WHERE ep.service_id = s1.id) DESC,
      CASE WHEN s1.slug NOT LIKE '%.%' THEN 0 ELSE 1 END,
      s1.created_at ASC
    LIMIT 1
)
WHERE service_id NOT IN (
    SELECT s_keep.id
    FROM services s_keep
    WHERE s_keep.id = (
        SELECT s_sub.id
        FROM services s_sub
        WHERE LOWER(s_sub.canonical_domain) = LOWER(s_keep.canonical_domain)
        ORDER BY
          (SELECT COUNT(*) FROM service_endpoints ep JOIN snapshots sn ON sn.endpoint_id = ep.id WHERE ep.service_id = s_sub.id) DESC,
          CASE WHEN s_sub.slug NOT LIKE '%.%' THEN 0 ELSE 1 END,
          s_sub.created_at ASC
        LIMIT 1
    )
);

-- 3. Repoint watchlist_items from duplicate services
UPDATE watchlist_items
SET service_id = (
    SELECT s1.id
    FROM services s1
    WHERE LOWER(s1.canonical_domain) = (
        SELECT LOWER(s2.canonical_domain)
        FROM services s2
        WHERE s2.id = watchlist_items.service_id
    )
    ORDER BY 
      (SELECT COUNT(*) FROM service_endpoints ep JOIN snapshots sn ON sn.endpoint_id = ep.id WHERE ep.service_id = s1.id) DESC,
      CASE WHEN s1.slug NOT LIKE '%.%' THEN 0 ELSE 1 END,
      s1.created_at ASC
    LIMIT 1
)
WHERE service_id NOT IN (
    SELECT s_keep.id
    FROM services s_keep
    WHERE s_keep.id = (
        SELECT s_sub.id
        FROM services s_sub
        WHERE LOWER(s_sub.canonical_domain) = LOWER(s_keep.canonical_domain)
        ORDER BY
          (SELECT COUNT(*) FROM service_endpoints ep JOIN snapshots sn ON sn.endpoint_id = ep.id WHERE ep.service_id = s_sub.id) DESC,
          CASE WHEN s_sub.slug NOT LIKE '%.%' THEN 0 ELSE 1 END,
          s_sub.created_at ASC
        LIMIT 1
    )
);

-- 4. Remove duplicate endpoints pointing to the same service and URL
DELETE FROM service_endpoints
WHERE id NOT IN (
    SELECT MIN(id)
    FROM service_endpoints
    GROUP BY service_id, url
);

-- 5. Delete duplicate services, keeping the single canonical survivor per domain
DELETE FROM services
WHERE id NOT IN (
    SELECT id FROM (
        SELECT s_sub.id,
               ROW_NUMBER() OVER (
                   PARTITION BY LOWER(s_sub.canonical_domain)
                   ORDER BY 
                     (SELECT COUNT(*) FROM service_endpoints ep JOIN snapshots sn ON sn.endpoint_id = ep.id WHERE ep.service_id = s_sub.id) DESC,
                     CASE WHEN s_sub.slug NOT LIKE '%.%' THEN 0 ELSE 1 END,
                     s_sub.created_at ASC
               ) as rn
        FROM services s_sub
    ) WHERE rn = 1
);

-- 6. Reset tiers that were never claimed through DNS TXT / .well-known challenges
-- Only 'Domain Verified' is retained for proven ownership.
UPDATE services
SET verification_tier = 'Unverified (curated listing)'
WHERE verification_tier != 'Domain Verified';
