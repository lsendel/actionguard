# ActionGuard.ai — Step-by-Step Implementation Plan

**Target Repository:** `/Users/lds/projects/actionguard.ai`  
**Target Stack:** Bun / pnpm Monorepo, TypeScript (Strict), Cloudflare Workers (Hono), Cloudflare D1 (Drizzle ORM / Raw SQL), Cloudflare R2, Vitest, Biome.

---

## Architecture & Monorepo Layout

```text
~/projects/actionguard.ai/
├── packages/
│   ├── core/                     # @actionguard/core — Protocol probes, dual-hash engine, compiler, linters
│   │   ├── src/
│   │   │   ├── hashing/          # Deterministic canonical JSON & dual-hash (schema_sha256 vs descriptions_sha256)
│   │   │   ├── probes/           # Stage 1-4 live probes (DNS-AID, A2A agent-card, MCP Streamable HTTP & OAuth)
│   │   │   ├── linter/           # JSON Schema strictness, token bloat estimator, prompt-injection scanner
│   │   │   ├── compiler/         # actionguard.json <-> MCP server.json, A2A agent-card.json, DNS-AID records
│   │   │   └── scoring/          # Grade calculator (A+ to F) and structured InspectionReport generator
│   │   └── test/
│   └── cli/                      # actionguard CLI (`npx actionguard inspect / compile / check`)
│       └── src/
├── apps/
│   └── worker/                   # Cloudflare Worker (API + Web Inspector UI + Scheduled Cron Probes + SVG Badges)
│       ├── migrations/           # D1 SQL migrations (0001_initial.sql)
│       ├── src/
│       │   ├── routes/
│       │   │   ├── inspect.ts    # POST /api/inspect & GET /api/reports/:id
│       │   │   ├── badges.ts     # GET /badge/:slug.svg (Edge-cached <50ms status & grade badges)
│       │   │   ├── routing.ts    # POST /v1/routing/resolve (Trust-Ranked Discovery API)
│       │   │   ├── watchlist.ts  # Watchlist CRUD & pinned digest management
│       │   │   └── ui.ts         # SSR "SSL Labs for Agents" Web Inspector & Report view
│       │   ├── cron/             # Scheduled continuous probing & drift detection dispatcher
│       │   └── alerts/           # Resend Email + Webhook / Slack drift notifications
│       └── wrangler.jsonc
└── docs/
    ├── REQUIREMENTS.md
    ├── SPECIFICATIONS.md
    ├── ARCHITECTURE.md
    └── IMPLEMENTATION_PLAN.md
```

---

## Phase 1: Workspace Foundation & `@actionguard/core` Engine (Days 1–3)

Build the deterministic, zero-dependency-on-Cloudflare core library so it can run identically inside Cloudflare Workers, the CLI, and GitHub Actions.

### 1.1 Monorepo & Tooling Setup
- Initialize workspace (`package.json`, `tsconfig.base.json`, `biome.json`, `vitest.config.ts`).
- Configure strict TypeScript with Web-standard APIs (`fetch`, `crypto.subtle`) so all code works natively in Cloudflare Workers and Node/Bun.

### 1.2 Dual-Hash Cryptographic Integrity Engine (`packages/core/src/hashing/`)
- **`computeSchemaHash(tools)`:** Canonicalizes tool names, input JSON schemas (`type`, `properties`, `required`, `enum`), and annotations (`readOnlyHint`, `destructiveHint`) with sorted keys, stripping all natural-language fields, and computes `schema_sha256`.
- **`computeDescriptionsHash(tools)`:** Extracts and normalizes all natural-language strings (`description`, parameter descriptions, A2A `examples`) and computes `descriptions_sha256`.
- **`diffSnapshots(prev, next)`:** Classifies changes into:
  - `BREAKING_SCHEMA_DRIFT` (removed tool, newly required field, narrowed type)
  - `SILENT_DESCRIPTION_MUTATION` (`schema_sha256` unchanged, `descriptions_sha256` mutated)
  - `NON_BREAKING_UPDATE` (new optional tool or property)

### 1.3 Security & Ergonomics Linter (`packages/core/src/linter/`)
- **Context Token Bloat Calculator:** Estimates token cost of `tools/list` / `skills[]` payload and warns when single-server overhead exceeds thresholds (`> 2,500 tokens` warn, `> 5,000 tokens` fail).
- **Prompt Injection & Tool Poisoning Scanner:** Scans descriptions for instruction-override patterns (`ignore previous`, `system prompt`, hidden zero-width characters, bidirectional Unicode overrides, markdown image exfiltration `![...](http...)`, cross-tool shadowing).
- **JSON Schema Strictness Linter:** Flags untyped parameters, missing `description` fields, missing `additionalProperties` constraints, and missing MCP tool annotations.

### 1.4 Universal Manifest Compiler (`packages/core/src/compiler/`)
- Validate `actionguard.json` using Zod.
- Compile `actionguard.json` into:
  1. Official MCP Registry `server.json` (`2025-12-11` schema)
  2. A2A v1.0 `/.well-known/agent-card.json`
  3. DNS-AID RFC 8552 zone records (`_agent._mcp._agents.<domain> IN SVCB / TXT`)
  4. GitHub Action workflow `.github/workflows/actionguard.yml`
- Reverse-import: synthesize a starter `actionguard.json` from a live probe result.

---

## Phase 2: The 5-Stage Live Probe Engine (Days 4–6)

Implement the runtime network prober (`packages/core/src/probes/`) with strict timeouts, SSRF protection, and safe unauthenticated inspection.

### 2.1 SSRF & Target Safety Guard
- Block private IPv4/IPv6 ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254`, `::1`, `fc00::/7`), localhost, and non-HTTPS schemes in production.
- Enforce per-stage timeouts (2,000ms per request, 6,000ms total inspection budget).

### 2.2 Stage 1: Identity & Discovery Probe
- **DNS-AID Probe:** Query DNS over HTTPS (`https://cloudflare-dns.com/dns-query`) for `_agents.<domain>` (`SVCB` and `TXT` records) and check `AD` (Authenticated Data / DNSSEC) flag.
- **A2A Well-Known Probe:** Fetch `https://<domain>/.well-known/agent-card.json` (and legacy `/.well-known/agent.json`), validate TLS, CORS headers, and schema conformance.
- **MCP Registry Probe:** Query `https://registry.modelcontextprotocol.io/v0/servers` for matching domain/namespace.

### 2.3 Stage 2: Transport & OAuth 2.1 Handshake Probe
- **MCP Streamable HTTP Probe:** Send JSON-RPC 2.0 `initialize` request (`protocolVersion: "2025-03-26"`), measure TTFB & total latency, inspect `Mcp-Session-Id` header, and if unauthenticated access is permitted, call `tools/list`.
- **OAuth 2.1 Discovery Audit:** If endpoint returns `401 Unauthorized`, validate `WWW-Authenticate` header and probe `/.well-known/oauth-protected-resource` (RFC 9470) and `/.well-known/oauth-authorization-server` (RFC 8414).

### 2.4 Scoring & Grade Engine (`packages/core/src/scoring/`)
- Combine results from Stages 1–4 into a weighted 0–100 score and letter grade (`A+` to `F`) with deterministic, actionable pass/warn/fail line items.

---

## Phase 3: Cloudflare Worker, D1 Database & R2 Evidence Store (Days 7–10)

Build `apps/worker` to serve the web inspector, public API, badges, and storage layer on `actionguard.ai`.

### 3.1 D1 Migrations & R2 Storage Adapter
- Create `apps/worker/migrations/0001_initial.sql` with tables: `organizations`, `services`, `service_endpoints`, `snapshots`, `drift_events`, `watchlist_items`.
- Build R2 content-addressed store:
  - `payloads/<endpoint_id>/<schema_sha256>.json` (deduplicated raw schema captures)
  - `reports/<report_id>.json` (immutable shareable inspection reports)

### 3.2 Core HTTP Routes (Hono on Cloudflare Workers)
- `POST /api/inspect`: Runs the 5-stage live inspector against a submitted URL/domain, persists snapshot to D1/R2, and returns the report JSON + permalink.
- `GET /api/reports/:id`: Returns the stored inspection report and generated artifacts.
- `GET /badge/:slug.svg`: Ultra-fast (<50ms edge-cached) dynamic SVG badge showing verification status and grade (e.g., `ActionGuard | A+` or `ActionGuard | ⭐ A+ • Domain Owner`).
- `GET /` & `GET /reports/:id`: Server-rendered "SSL Labs for Agents" web interface with live URL input, grade breakdown, drift diff viewer, and one-click copy for generated `agent-card.json`, `server.json`, and DNS-AID records.

---

## Phase 4: Continuous Monitoring, Watchlist Alerts & Routing API (Days 11–14)

Turn the diagnostic tool into a recurring SaaS and programmatic routing layer.

### 4.1 Scheduled Cron Prober & Drift Detector
- Configure Cloudflare Worker `scheduled()` handler (every 5 minutes).
- Select active `service_endpoints` due for probing, execute the probe suite, record latency/status in D1, and compare `schema_sha256` and `descriptions_sha256` against the previous snapshot.
- When drift or downtime occurs, insert a `drift_events` record and match against `watchlist_items` (including checking `pinned_schema_sha256`).

### 4.2 Alerting Engine (Resend + Slack/Webhooks)
- Dispatch instant notifications when an endpoint goes down, mutates its tool descriptions, or breaks its pinned schema hash.
- Support signed webhook payloads (`X-ActionGuard-Signature`) and transactional emails via Resend.

### 4.3 Trust-Aware Routing API (`/v1/routing/resolve`)
- Implement `POST /v1/routing/resolve` and `GET /v1/tools/search`.
- Filter registered services by capability tags, `verification_tier`, minimum 30-day uptime, maximum p95 latency, required MCP annotations (`readOnlyHint`), and clean drift status.
- Return primary endpoint + pinned `schema_sha256` + ranked fallback endpoints.

---

## Phase 5: CLI (`npx actionguard`) & Deployment Cutover (Days 15–16)

### 5.1 CLI Package (`packages/cli`)
- `actionguard inspect <url>`: Run the 5-stage audit from terminal.
- `actionguard compile`: Compile local `actionguard.json` into `.well-known/agent-card.json`, `server.json`, and DNS-AID records.
- `actionguard check <url> --pin-schema <sha256>`: CI/CD gate that exits non-zero if the remote endpoint's schema or descriptions drifted or if security lints fail.

### 5.2 Cloudflare Provisioning & Domain Cutover
- Provision D1 database (`actionguard-db`) and R2 bucket (`actionguard-evidence`).
- Deploy Worker and attach custom domain `actionguard.ai` (with `action-guard.com` 301 redirect).

---

## Verification & Testing Strategy

1. **Unit & Golden-Fixture Tests (`packages/core`):**
   - Test `computeSchemaHash` and `computeDescriptionsHash` invariance under key reordering and whitespace changes.
   - Test prompt-injection detector against known MCP tool poisoning payloads (hidden instructions, markdown exfiltration, homoglyphs).
   - Test compiler output against official MCP `server.schema.json` and A2A v1.0 Agent Card requirements.
2. **End-to-End Worker Tests (`apps/worker`):**
   - Test `POST /api/inspect` against mock MCP Streamable HTTP and A2A endpoints (healthy, 401 OAuth discovery, malformed schema, poisoned description).
   - Verify drift detection triggers when a mock server mutates a tool description without bumping `version`.
   - Verify `GET /badge/:slug.svg` renders valid SVG with proper cache headers.
