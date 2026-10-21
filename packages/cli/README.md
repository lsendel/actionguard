# @actionguard/cli

> **Verification, Reliability Monitoring, and Schema Drift Detection for AI Agents & MCP Servers.**

Official command-line tool for [ActionGuard.ai](https://actionguard.ai).

---

## Installation & Quick Run

You can run ActionGuard directly via `npx` with zero installation:

```bash
# Run 5-stage live protocol audit against any MCP or A2A endpoint
npx @actionguard/cli inspect https://example.com/mcp

# Compile single actionguard.json into MCP server.json, A2A agent-card.json, and DNS-AID records
npx @actionguard/cli compile ./actionguard.json

# CI Gate: block PRs if remote endpoint schema drifts from pinned digest
npx @actionguard/cli check https://api.myservice.com/mcp --pin 81d36f5215b689d6f100cfe77096fbe8d113c304c0dd8374d69a84678fb69415
```

Or install globally:

```bash
npm install -g @actionguard/cli
actionguard help
```

---

## GitHub Actions CI Integration

To prevent unexpected upstream changes from breaking your AI applications, add this step to your GitHub Actions workflow:

```yaml
name: CI
on: [pull_request]

jobs:
  verify-agents:
    runs-on: ubuntu-latest
    steps:
      - name: Verify Upstream MCP Tools
        uses: lsendel/actionguard@v1
        with:
          target_url: 'https://api.where.care/mcp'
          pinned_hash: '81d36f5215b689d6f100cfe77096fbe8d113c304c0dd8374d69a84678fb69415'
```

---

## Commands

### `actionguard inspect <url>`
Executes the live 5-stage protocol inspection:
1. **Identity & Discovery:** Resolves DNS-AID (`_agents.<domain>`) and A2A (`/.well-known/agent-card.json`).
2. **Transport & Handshake:** Tests Streamable HTTP and OAuth 2.1 challenges.
3. **Schema Strictness:** Lints parameter types, missing descriptions, and context token bloat.
4. **Security Audit:** Scans for prompt injection, hidden Unicode characters, and computes Dual-Hash fingerprints (`schema_sha256` vs `descriptions_sha256`).
5. **Artifact Generator:** Outputs ready-to-use manifests.

### `actionguard compile [manifest.json]`
Validates your `actionguard.json` and compiles:
- `server.json` (Official MCP Registry)
- `.well-known/agent-card.json` (A2A Protocol v1.0)
- `dns-aid.zone` (RFC 8552 / RFC 9460)

### `actionguard check <url> --pin <hash>`
Runs verification and exits with code `1` if:
- The endpoint is unreachable or degraded.
- The structural schema has drifted from the pinned hash.
- Prompt injection or critical security warnings are found.
