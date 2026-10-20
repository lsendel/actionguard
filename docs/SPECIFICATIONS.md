# Protocol Specifications & Universal Manifest Mapping

**Document:** Protocol Reference & Interoperability Mapping  
**Project:** ActionGuard.ai  

---

## 1. Supported Discovery & Identity Protocols

ActionGuard.ai normalizes and bridges three core open specifications:

1. **Model Context Protocol (MCP) Registry Specification** (`server.json`)
2. **Agent-to-Agent Protocol v1.0** (`/.well-known/agent-card.json`)
3. **DNS-based Agent Identification and Discovery (DNS-AID)** (`draft-mozleywilliams-dnsop-dnsaid`)

---

## 2. Protocol Comparison Matrix

| Property | MCP Registry (`server.json`) | A2A Protocol (`agent-card.json`) | DNS-AID (RFC 8552 / RFC 9460) | ActionGuard Universal (`actionguard.json`) |
|---|---|---|---|---|
| **Primary Location** | Centralized Registry Repository | `/.well-known/agent-card.json` | DNS Zone (`_{name}._{proto}._agents`) | Project Root (`./actionguard.json`) |
| **Identifier Scheme** | Reverse-DNS: `com.example/server` | Domain / URI: `https://agent.example.com` | FQDN: `_chatbot._mcp._agents.example.com` | Reverse-DNS or Domain |
| **Transport Types** | `stdio`, `streamable-http`, `sse` | `JSONRPC`, `HTTP+JSON`, `GRPC` | Mapped via `SVCB` / `TXT` | All supported |
| **Granular Units** | Tools, Resources, Prompts | Skills (with examples) | Protocol endpoints | Unified Capabilities (Tools & Skills) |
| **Security / Auth** | OAuth 2.1 (RFC 8414 / RFC 9470) | Provider OAuth / Bearer / Mutual TLS | DNSSEC + DANE (TLSA) | Unified Auth Declaration |
| **Integrity Proof** | Package hash / Registry token | None (HTTPS only) | DNSSEC Signature | Dual-Hash (`schema_sha256` + `descriptions_sha256`) |

---

## 3. The Canonical Universal Manifest: `actionguard.json`

The `actionguard.json` file serves as the single source of truth for agent builders. ActionGuard compiles this single file into all target formats.

```jsonc
{
  "$schema": "https://actionguard.ai/schemas/v1/manifest.schema.json",
  "name": "com.where.care/provider-matcher",
  "title": "Care Provider Matching Agent",
  "description": "Discovers and verifies licensed care providers based on location, clinical specialties, and immediate availability.",
  "version": "1.2.0",
  "domain": "matcher.where.care",
  "repository": {
    "url": "https://github.com/where-care/provider-matcher",
    "source": "github"
  },
  "provider": {
    "organization": "Where Care Inc.",
    "url": "https://where.care",
    "contact": "security@where.care"
  },
  "endpoints": [
    {
      "protocol": "mcp",
      "transport": "streamable-http",
      "url": "https://matcher.where.care/mcp",
      "auth": {
        "type": "oauth2",
        "authorizationServer": "https://auth.where.care",
        "scopes": ["providers:read"]
      }
    },
    {
      "protocol": "a2a",
      "binding": "JSONRPC",
      "url": "https://matcher.where.care/a2a/v1"
    }
  ],
  "capabilities": {
    "tools": [
      {
        "id": "search_providers",
        "name": "Search Licensed Providers",
        "description": "Finds active healthcare and caregiving professionals by postal code and role.",
        "annotations": {
          "readOnlyHint": true,
          "destructiveHint": false,
          "idempotentHint": true
        },
        "inputSchema": {
          "type": "object",
          "properties": {
            "postal_code": {
              "type": "string",
              "description": "5-digit US ZIP code or UK postcode"
            },
            "role": {
              "type": "string",
              "enum": ["registered_nurse", "caregiver", "physiotherapist"]
            }
          },
          "required": ["postal_code"]
        },
        "compliance": ["hipaa_eligible", "zero_retention"],
        "examples": [
          "Find available registered nurses in 94107",
          "Locate caregivers near London SW1A"
        ]
      }
    ]
  },
  "dnsAid": {
    "enabled": true,
    "agentPrefix": "matcher",
    "zone": "where.care"
  }
}
```

---

## 4. Compilation Mappings

### 4.1 Export to MCP Registry `server.json`
When compiled by `actionguard compile --target mcp`, ActionGuard produces:

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "com.where.care/provider-matcher",
  "title": "Care Provider Matching Agent",
  "description": "Discovers and verifies licensed care providers based on location, clinical specialties, and immediate availability.",
  "version": "1.2.0",
  "repository": {
    "url": "https://github.com/where-care/provider-matcher",
    "source": "github"
  },
  "remotes": [
    {
      "type": "streamable-http",
      "url": "https://matcher.where.care/mcp"
    }
  ]
}
```

### 4.2 Export to A2A v1.0 `/.well-known/agent-card.json`
When compiled by `actionguard compile --target a2a`, ActionGuard produces:

```json
{
  "name": "Care Provider Matching Agent",
  "description": "Discovers and verifies licensed care providers based on location, clinical specialties, and immediate availability.",
  "version": "1.2.0",
  "documentationUrl": "https://where.care/docs/api",
  "provider": {
    "organization": "Where Care Inc.",
    "url": "https://where.care"
  },
  "supportedInterfaces": [
    {
      "url": "https://matcher.where.care/a2a/v1",
      "protocolBinding": "JSONRPC",
      "protocolVersion": "1.0"
    }
  ],
  "capabilities": {
    "streaming": true,
    "pushNotifications": false,
    "extendedAgentCard": false
  },
  "defaultInputModes": ["application/json"],
  "defaultOutputModes": ["application/json"],
  "skills": [
    {
      "id": "search_providers",
      "name": "Search Licensed Providers",
      "description": "Finds active healthcare and caregiving professionals by postal code and role.",
      "tags": ["healthcare", "caregivers", "verification"],
      "examples": [
        "Find available registered nurses in 94107",
        "Locate caregivers near London SW1A"
      ]
    }
  ]
}
```

### 4.3 Export to DNS-AID Zone Records (IETF Draft)
When compiled by `actionguard compile --target dns-aid`, ActionGuard generates the RFC 8552 underscored DNS records:

```text
; DNS-AID Records for matcher.where.care
_matcher._mcp._agents.where.care.     IN  SVCB  1 matcher.where.care. (
                                            alpn="h2"
                                            port=443
                                            key65300="path=/mcp"
                                        )
_matcher._a2a._agents.where.care.     IN  SVCB  1 matcher.where.care. (
                                            alpn="h2"
                                            port=443
                                            key65300="path=/a2a/v1"
                                        )
_matcher._meta._agents.where.care.    IN  TXT   "v=aid1;ver=1.2.0;org=WhereCare;digest=sha256:e3b0c442..."
```

---

## 5. Dual-Hash Cryptographic Integrity Specification

To defeat silent prompt injection and unauthorized schema mutations, ActionGuard computes and publishes two independent SHA-256 hashes for every monitored endpoint:

### 1. `schema_sha256` (Structural Contract Hash)
* **Input Elements:** Normalized list of tool identifiers + sorted JSON Schema parameter names, types, enum constraints, and required fields.
* **Excluded:** Descriptions, markdown text, docstrings, examples.
* **Sensitivity:** Any change indicates a **Breaking Code Change**.

### 2. `descriptions_sha256` (Prompt & Language Hash)
* **Input Elements:** Normalized, concatenated natural language strings across tool `description`, parameter `description`, and skill `examples`.
* **Sensitivity:** Any change while `schema_sha256` remains constant indicates a **Silent Description Mutation** (requires security audit for prompt-injection or tool-poisoning risks).
