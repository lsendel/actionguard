-- Owner/fleet scope only. Preserve third-party catalog and inspection defaults.
ALTER TABLE services ADD COLUMN owner_fleet INTEGER NOT NULL DEFAULT 0 CHECK (owner_fleet IN (0,1));
ALTER TABLE services ADD COLUMN public_approval_ref TEXT;
CREATE TABLE owner_fleet_domains (
  domain TEXT PRIMARY KEY,
  source_ref TEXT NOT NULL CHECK (length(trim(source_ref)) > 0)
);
INSERT INTO owner_fleet_domains (domain,source_ref) VALUES
 ('mcp.families.care','owner-removal-2026-11-20'),
 ('analytics.where.care','owner-removal-2026-11-20'),
 ('llmrank.app','owner-removal-2026-11-20'),
 ('mcp.llmrank.app','owner-removal-2026-11-20'),
 ('actionguard-worker.luis-diaz-s.workers.dev','owner-removal-2026-11-20');
UPDATE services SET owner_fleet=1,listed=0
 WHERE RTRIM(LOWER(canonical_domain),'.') IN (SELECT domain FROM owner_fleet_domains);

-- Applies even to catalog or future insert paths that omit the owner marker.
CREATE TRIGGER services_owner_insert AFTER INSERT ON services
 WHEN NEW.owner_fleet=1 OR EXISTS (SELECT 1 FROM owner_fleet_domains WHERE domain=RTRIM(LOWER(NEW.canonical_domain),'.'))
 BEGIN
  UPDATE services SET owner_fleet=1,
   listed=CASE WHEN length(trim(COALESCE(NEW.public_approval_ref,'')))>0 THEN NEW.listed ELSE 0 END
   WHERE id=NEW.id;
 END;
-- No public API writes public_approval_ref. It is an operator-only source
-- reference to actual owner approval, never an untrusted HTTP approval claim.
CREATE TRIGGER services_owner_public_guard BEFORE UPDATE OF listed,owner_fleet,canonical_domain,public_approval_ref ON services
 WHEN NEW.listed=1
  AND (OLD.owner_fleet=1 OR NEW.owner_fleet=1 OR EXISTS (SELECT 1 FROM owner_fleet_domains WHERE domain=RTRIM(LOWER(NEW.canonical_domain),'.')))
  AND length(trim(COALESCE(NEW.public_approval_ref,'')))=0
 BEGIN SELECT RAISE(ABORT,'owner public visibility requires approval reference'); END;
CREATE TRIGGER services_owner_sticky BEFORE UPDATE OF owner_fleet ON services
 WHEN OLD.owner_fleet=1 AND NEW.owner_fleet=0
 BEGIN SELECT RAISE(ABORT,'owner marker requires explicit operator migration to remove'); END;
