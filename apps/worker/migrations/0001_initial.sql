-- ActionGuard.ai Schema Migration 0001

-- Organizations / Accounts
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tier TEXT NOT NULL DEFAULT 'community',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Registered Services (Agents / MCP Servers)
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    canonical_domain TEXT NOT NULL,
    repository_url TEXT,
    verification_tier TEXT NOT NULL DEFAULT 'unverified',
    overall_grade TEXT NOT NULL DEFAULT 'PENDING',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Monitored Endpoints per Service
CREATE TABLE IF NOT EXISTS service_endpoints (
    id TEXT PRIMARY KEY,
    service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    protocol TEXT NOT NULL,
    url TEXT NOT NULL,
    auth_type TEXT NOT NULL DEFAULT 'none',
    current_schema_sha256 TEXT,
    current_descriptions_sha256 TEXT,
    last_status TEXT NOT NULL DEFAULT 'unknown',
    last_latency_ms INTEGER,
    last_checked_at TEXT,
    is_active INTEGER NOT NULL DEFAULT 1
);

-- Historical Telemetry & Drift Snapshots
CREATE TABLE IF NOT EXISTS snapshots (
    id TEXT PRIMARY KEY,
    endpoint_id TEXT NOT NULL REFERENCES service_endpoints(id) ON DELETE CASCADE,
    observed_at TEXT NOT NULL DEFAULT (datetime('now')),
    protocol_version TEXT,
    server_version TEXT,
    schema_sha256 TEXT NOT NULL,
    descriptions_sha256 TEXT NOT NULL,
    tool_count INTEGER NOT NULL DEFAULT 0,
    estimated_token_cost INTEGER NOT NULL DEFAULT 0,
    lint_score INTEGER NOT NULL DEFAULT 0,
    r2_payload_key TEXT NOT NULL
);

-- Detected Drift & Security Events
CREATE TABLE IF NOT EXISTS drift_events (
    id TEXT PRIMARY KEY,
    endpoint_id TEXT NOT NULL REFERENCES service_endpoints(id) ON DELETE CASCADE,
    from_snapshot_id TEXT NOT NULL REFERENCES snapshots(id),
    to_snapshot_id TEXT NOT NULL REFERENCES snapshots(id),
    severity TEXT NOT NULL,
    change_type TEXT NOT NULL,
    summary_json TEXT NOT NULL,
    detected_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Enterprise Consumer Watchlist
CREATE TABLE IF NOT EXISTS watchlist_items (
    id TEXT PRIMARY KEY,
    subscriber_org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    pinned_schema_sha256 TEXT,
    pinned_descriptions_sha256 TEXT,
    alert_webhook_url TEXT,
    notify_email TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_endpoints_service ON service_endpoints(service_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_endpoint ON snapshots(endpoint_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_drift_endpoint ON drift_events(endpoint_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_watchlist_subscriber ON watchlist_items(subscriber_org_id);
