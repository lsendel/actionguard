# ActionGuard.ai — Community Submissions, Registry PRs & Seeding Playbook

Ready-to-submit pull requests, community posts, and registry listings to execute Week 3 and Week 4 of the launch sequence.

---

## 1. Pull Request for `punkpeye/awesome-mcp-servers`

**Target Repository:** `https://github.com/punkpeye/awesome-mcp-servers`  
**Target File:** `README.md`  
**Section:** `Testing & Conformance` or `Frameworks & Utilities`

### PR Title
```text
Add ActionGuard: Diff & poisoning detection for MCP servers
```

### Proposed Addition
```markdown
- [ActionGuard](https://actionguard.ai) - Diff and poisoning detection for MCP servers. Uses dual-hash fingerprinting (`schema_sha256` and `descriptions_sha256`) to catch silent schema drift and poisoned tool descriptions before agents run them. Includes live edge protocol audits, dynamic telemetry, and a zero-dependency composite GitHub Action CI gate (`lsendel/actionguard@v1`).
```

---

## 2. Pull Request for Official Model Context Protocol Repository

**Target Repository:** `https://github.com/modelcontextprotocol/servers`  
**Section:** `Community Tools & Implementations`

### Entry
```markdown
### Verification, Drift & Poisoning Detection
- **[ActionGuard.ai](https://actionguard.ai)** ([GitHub](https://github.com/lsendel/actionguard)): Automated MCP protocol conformance auditor and CI schema gate. Separates structural parameter types (`schema_sha256`) from natural-language prompts (`descriptions_sha256`) to catch silent tool poisoning and breaking downstream changes.
```

---

## 3. Glama.ai & Smithery.ai Tool Listing Request

**Target:** `https://glama.ai/mcp` & `https://smithery.ai`

```markdown
**Name:** ActionGuard Protocol Gate
**Homepage:** https://actionguard.ai
**GitHub:** https://github.com/lsendel/actionguard
**Description:** Diff and poisoning detection for MCP servers. Dual-hash fingerprinting catches silent schema drift and poisoned tool descriptions before agents run them.
**Manifest:** https://actionguard.ai/server.json
**Tags:** `mcp`, `schema-drift`, `poisoning-detection`, `dual-hash`, `verification`, `ci-gate`
**License:** MIT
```

---

## 4. Week 3: Community Seeding Copy

### A. r/mcp (Reddit)
**Title:** Catching silent schema drift and poisoned tool descriptions in MCP servers before your agents call them

**Body:**
> Hey everyone,
>
> If you run agents connected to remote or evolving MCP servers, you probably worry about two things:
> 1. An upstream schema update silently breaks your agent's tool call parameters.
> 2. An upstream tool description gets subtly modified or poisoned (changing how LLMs decide to route calls).
>
> Standard uptime monitors only answer "is the server returning 200 OK?". They don't detect when the schema actually changes under the hood.
>
> We built **[ActionGuard](https://actionguard.ai)** to detect drift and poisoning:
> - **Dual-hash fingerprinting:** Every inspection computes two distinct SHA-256 hashes—one strictly for input JSON Schema structures (`schema_sha256`), and one strictly for natural-language descriptions (`descriptions_sha256`).
> - **Zero-dependency GitHub Action:** You can pin your schema in CI (`uses: lsendel/actionguard@v1`) with `--pin <hash>` to block breaking upstream changes on PRs.
> - **Public Conformance Index:** Live letter grades (A+ through F) testing JSON-RPC 2.0 initialize, OAuth 2.1 challenges, DNS-AID discovery records, and context token bloat.
>
> If you maintain an MCP server, check your grade at https://actionguard.ai or claim your domain with a DNS TXT record. If you maintain one of the top 20 indexed servers, DM me and I'll upgrade your domain to Pro free forever.
>
> Open source action: https://github.com/lsendel/actionguard  
> Directory: https://actionguard.ai/servers

---

### B. MCP Discord (`#showcase` / `#tools`)
> **ActionGuard — Diff and poisoning detection for MCP servers**
> https://actionguard.ai (GitHub: https://github.com/lsendel/actionguard)
>
> We just shipped ActionGuard to solve silent MCP tool drift and prompt poisoning. Rather than just checking if an HTTP endpoint returns 200, it computes a dual-hash fingerprint separating schema types from natural-language descriptions.
>
> Maintainers get dynamic telemetry, SVG status badges for READMEs, and a turnkey GitHub Action (`uses: lsendel/actionguard@v1`) to pin schemas in CI.
>
> If you run a public MCP server, test your endpoint at https://actionguard.ai/docs or test your server in CI.

---

## 5. Week 4: Show HN Draft

**Title:** Show HN: ActionGuard – Diff and poisoning detection for MCP servers

**URL:** https://actionguard.ai

**First Comment:**
> Hi HN,
>
> Uptime monitoring for MCP servers tells you if an endpoint is reachable, but it doesn't tell you if what the server actually *does* has changed.
>
> When an agent calls an MCP server, two subtle changes can break production:
> 1. **Schema drift:** A required parameter is added, renamed, or types shift, causing structured generation or tool calls to fail.
> 2. **Description poisoning:** An upstream maintainer (or compromised dependency) changes a tool's English description, subtly redirecting agent decision-making or exfiltrating prompts.
>
> We built ActionGuard (https://actionguard.ai) as an evidence-first verification engine:
>
> - **Dual-Hash Fingerprints:** We canonicalize and hash tools into two separate SHA-256 digests: `schema_sha256` for parameter schemas and `descriptions_sha256` for semantic descriptions. If a description changes without a schema change, you know immediately.
> - **CI Schema Gate:** A composite GitHub Action (`lsendel/actionguard@v1`) lets downstream agent developers pin their upstream MCP servers in CI. If the remote schema or descriptions drift, the CI gate fails with the exact diff.
> - **Public Index & Telemetry:** We run live edge inspections from Cloudflare Workers checking protocol handshakes, OAuth 2.1 RFC 9470 compliance, context token footprints, and emerging DNS-AID discovery drafts.
>
> We're dogfooding this across our own production MCP endpoints (including LLM Boost's `@llmrank.app/mcp`).
>
> Would love your feedback on the dual-hash approach and what checks you'd like to see in agent CI pipelines.

