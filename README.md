# ActionGuard.ai

[![ActionGuard Verified](https://actionguard.ai/badge/actionguard-mcp.svg)](https://actionguard.ai/servers/actionguard-mcp)
[![Glama Quality Score](https://glama.ai/mcp/servers/lsendel/actionguard/badges/score.svg)](https://glama.ai/mcp/servers/lsendel/actionguard)
[![Smithery](https://smithery.ai/badge/lsendel/actionguard)](https://smithery.ai/server/lsendel/actionguard)
[![CI Tests](https://github.com/lsendel/actionguard/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/lsendel/actionguard/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Edge: Cloudflare](https://img.shields.io/badge/Edge-Cloudflare%20Workers-orange.svg)](https://workers.cloudflare.com)

> **Verification, Reliability Monitoring, and Schema Drift Detection for the Agentic Web.**  
> *"The SSL Labs + Datadog + Snyk for AI Agents & MCP Servers."*

---

## Live Production Services

* 🌐 **Web Inspector & Diagnostic Engine:** [**`https://actionguard.ai/`**](https://actionguard.ai/)
* 📊 **Public Reliability Index (36 Top Servers):** [**`https://actionguard.ai/index`**](https://actionguard.ai/index)
* 🎮 **Interactive Drift & Prompt Poisoning Simulator:** [**`https://actionguard.ai/playground`**](https://actionguard.ai/playground)
* ⭐ **Self-Serve Domain Ownership Portal:** [**`https://actionguard.ai/verify`**](https://actionguard.ai/verify)
* 💳 **Developer API Keys & Pricing:** [**`https://actionguard.ai/pricing`**](https://actionguard.ai/pricing)
* 📖 **Protocol Guides & Specs:** [**`https://actionguard.ai/docs/mcp-schema-drift`**](https://actionguard.ai/docs/mcp-schema-drift)

---

## Quickstart

### 1. GitHub Actions CI Gate
Block breaking changes and unannounced schema mutations before they hit production:

```yaml
name: CI
on: [pull_request]

jobs:
  verify-agent-tools:
    runs-on: ubuntu-latest
    steps:
      - name: Verify Upstream MCP Tools
        uses: lsendel/actionguard@v1
        with:
          target_url: 'https://github.mcp.modelcontextprotocol.io/mcp'
          pinned_hash: '81d36f5215b689d6f100cfe77096fbe8d113c304c0dd8374d69a84678fb69415'
```

---

### 2. Zero-Trust Runtime Gateway Proxy ("Cloudflare for MCP")
Route agent tool calls through ActionGuard's edge firewall to terminate drifted tools with `HTTP 423 Locked`:

#### Claude Desktop & Cursor (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "github": {
      "url": "https://actionguard.ai/v1/proxy?target=https://github.mcp.modelcontextprotocol.io/mcp&pin=81d36f5215b689d6f100cfe77096fbe8d113c304c0dd8374d69a84678fb69415"
    }
  }
}
```

#### Python (LangChain / CrewAI / httpx)
```python
import httpx

GATEWAY = "https://actionguard.ai/v1/proxy"
TARGET = "https://github.mcp.modelcontextprotocol.io/mcp"
PIN = "81d36f5215b689d6f100cfe77096fbe8d113c304c0dd8374d69a84678fb69415"

# Requests fail with 423 Locked if upstream schema drifts or tool is poisoned
client = httpx.Client(base_url=f"{GATEWAY}?target={TARGET}&pin={PIN}")
```

---

### 3. Run as an MCP Server (Claude Desktop, Cursor, Glama)

You can run ActionGuard natively as a tool inside any MCP client:

#### Stdio Mode (Claude Desktop `claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "actionguard": {
      "command": "npx",
      "args": ["-y", "@actionguard/cli", "mcp"]
    }
  }
}
```

#### Streamable HTTP Mode
```json
{
  "mcpServers": {
    "actionguard": {
      "url": "https://actionguard.ai/mcp"
    }
  }
}
```

---

### 4. CLI Quick Run
```bash
# Run 5-stage live protocol audit against any MCP or A2A endpoint
npx @actionguard/cli inspect https://api.myservice.com/mcp

# Compile single actionguard.json to MCP server.json, A2A agent-card.json, and DNS-AID records
npx @actionguard/cli compile ./actionguard.json

# Local CI check
npx @actionguard/cli check https://api.myservice.com/mcp --pin <hash>
```

---

## Core Product Pillars

1. **The 5-Stage Live Inspector ("SSL Labs for Agents"):** Zero-signup diagnostic tool running live edge probes against MCP and A2A endpoints, returning an A+ to F scorecard and instant copy-paste fixes.
2. **Dual-Hash Integrity Engine:** Distinct cryptographic fingerprints for JSON Schemas (`schema_sha256`) versus tool descriptions (`descriptions_sha256`) to catch silent prompt mutations.
3. **Enterprise Dependency Watchlist:** Automated 15-minute edge monitoring with instant multi-channel alerts (Slack Block Kit, Discord Embeds, Email via Resend, and signed Webhooks).
4. **Self-Serve Domain Proof (DNS-AID):** Cryptographic domain verification via DNS TXT records or well-known challenge files to earn the Gold "⭐ Domain Verified" badge.
5. **Zero-Trust Runtime Firewall:** Low-latency proxy (<15ms) that blocks execution before poisoned or drifted payloads reach your LLM.

---

## Infrastructure Architecture

Built entirely on the Cloudflare edge stack for global sub-50ms latency:
* **Cloudflare Workers:** Edge probing engine, public API, zero-trust proxy, and dynamic SVG badges.
* **Cloudflare D1:** High-performance relational edge database for accounts, catalog, subscriptions, and API keys.
* **Cloudflare R2:** Content-addressed, immutable storage for historical snapshot payloads, raw schemas, and audit logs.
* **Continuous Monitoring:** 15-minute cron trigger with automatic drift detection and Resend email / Slack dispatch.

---

## Monorepo Packages

```text
├── packages/
│   ├── core/         # @actionguard/core — Dual-hash, linter, compiler, and probes
│   └── cli/          # @actionguard/cli — actionguard command line tool
└── apps/
    └── worker/       # Cloudflare Worker — Web Inspector, API, proxy, and D1/R2 storage
```

---

## Documentation

* [Product Requirements Document (PRD)](./docs/REQUIREMENTS.md)
* [Protocol Specifications & Mappings](./docs/SPECIFICATIONS.md)
* [System Architecture & Data Model](./docs/ARCHITECTURE.md)
* [Step-by-Step Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)
* [Hacker News Show HN Submission](./docs/LAUNCH_SHOW_HN.md)
* [Product Hunt & Twitter Launch Kit](./docs/LAUNCH_PRODUCT_HUNT_AND_TWITTER.md)

---

## License

MIT © [ActionGuard.ai](https://actionguard.ai)
