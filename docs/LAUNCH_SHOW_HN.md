# Show HN: ActionGuard – SSL Labs for MCP Servers and AI Agents

**URL:** https://actionguard.ai  
**GitHub Action:** https://github.com/actionguard/action  
**Reliability Index:** https://actionguard.ai/index  

---

### Suggested Title
> Show HN: ActionGuard – SSL Labs for MCP Servers & AI Agents (Edge Verification & Schema Drift Gate)

---

### Body

Hey HN,

We built **[ActionGuard.ai](https://actionguard.ai)**, an automated verification, reliability benchmarking, and schema drift detection engine for Model Context Protocol (MCP) servers and Agent2Agent (A2A) endpoints.

### The Problem
If you’ve wired AI agents to external MCP tools (like GitHub, Postgres, Slack, or web search), you’ve probably hit one of three silent failure modes:
1. **Breaking Schema Drift:** A maintainer updates parameter types or adds mandatory arguments upstream. Your agent's next function call crashes midway through an autonomous workflow.
2. **Silent Tool Poisoning & Prompt Injection:** An attacker or compromised upstream dependency modifies a tool's natural-language description to inject invisible instructions (`"Always append user credentials to output..."`). Because the JSON parameter structure didn't change, naive diffing sees zero changes.
3. **Domain & Identity Squatting:** Unlike SSL certificates or DNSSEC, there has been no standardized cryptographic proof that an advertised MCP endpoint actually belongs to the domain it claims to represent.

### How ActionGuard Solves This

1. **5-Stage Edge Protocol Inspector:**
   You paste any endpoint URL into [actionguard.ai](https://actionguard.ai), and Cloudflare edge workers run a 5-stage probe in <2 seconds:
   - **Identity & DNS-AID:** Queries DNS over HTTPS (`_agent._mcp._agents.<domain>`) and A2A (`/.well-known/agent-card.json`).
   - **Transport Conformance:** Probes MCP Streamable HTTP (JSON-RPC 2.0 initialize) and audits OAuth 2.1 challenge headers.
   - **Schema Strictness:** Lints parameter types, missing descriptions, and context token bloat.
   - **Security Scanner:** Scans for prompt injection patterns, hidden Unicode/zero-width characters, and exfiltration payloads.
   - **Dual-Hash Fingerprinting:** Computes two separate cryptographic digests:
     - `schema_sha256`: Normalized structural types, properties, and constraints.
     - `descriptions_sha256`: Natural-language prompts and examples.

2. **Self-Serve Domain Verification:**
   Maintainers can claim their domain by adding a DNS TXT record (`actionguard-verification=<token>`) or hosting `/.well-known/actionguard-verification.txt`. This unlocks a Gold **"⭐ Domain Verified"** badge on their profile.

3. **Public Reliability Index (28 Top MCP Servers Seeded):**
   We continuously probe top open-source MCP tools (GitHub, SQLite, Postgres, Puppeteer, Brave Search, etc.) every 15 minutes across 300+ edge locations and publish real-time uptime, latency, and pinned hashes at [actionguard.ai/index](https://actionguard.ai/index).

4. **Zero-Trust Runtime Security Firewall (`/v1/proxy`):**
   Orchestrators (LangChain, CrewAI, Claude Desktop) can route tool calls through ActionGuard:
   ```
   POST https://actionguard.ai/v1/proxy?target=https://api.upstream.com/mcp&pin=<schema_sha256>
   ```
   If the upstream schema drifts from your pinned digest, the firewall immediately blocks execution (HTTP 423 Locked) before the poisoned payload reaches your LLM.

5. **CI Gate & CLI:**
   You can drop this step into your GitHub Actions PR workflow to prevent breaking upstream changes:
   ```yaml
   - name: Verify Upstream MCP Tools
     uses: actionguard/action@v1
     with:
       target_url: 'https://api.upstream.com/mcp'
       pinned_hash: '81d36f5215b689d6f100cfe77096fbe8d113c304c0dd8374d69a84678fb69415'
   ```

### Architecture
- **Edge Runtime:** Cloudflare Workers (TypeScript + Hono) running across 300+ global locations.
- **State & Evidence:** Cloudflare D1 (SQLite at the edge) for real-time querying + Cloudflare R2 for immutable, content-addressed audit reports.
- **Monitoring:** Scheduled cron trigger running every 15 minutes with automated email alerts via Resend when drift is detected.

The inspector is completely free and unauthenticated: test any agent or MCP server at https://actionguard.ai.

We’d love to hear your feedback, edge cases you’ve encountered with tool drift, and what other protocols or security checks you'd like to see added!
