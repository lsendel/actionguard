# ActionGuard.ai

> **Verification, Reliability Monitoring, and Schema Drift Detection for the Agentic Web.**
> *"The SSL Labs + Datadog + Snyk for AI Agents & MCP Servers."*

---

## Overview

**ActionGuard.ai** is an evidence-first verification, observability, and routing platform for Model Context Protocol (MCP) servers, Agent2Agent (A2A) endpoints, and DNS-AID services. 

As autonomous agents transition from experimental demos to production workflows, orchestrators face critical runtime vulnerabilities:
1. **Unannounced Schema Drift:** Upstream tools silently change required parameters or return types, breaking downstream agent pipelines.
2. **Tool Poisoning & Prompt Injection:** Malicious or compromised endpoints alter natural language tool descriptions without changing code versions.
3. **Protocol Fragmentation:** Fragmented discovery formats (MCP `server.json`, A2A `agent-card.json`, DNS-AID RFC 8552 records) require tedious manual maintenance.
4. **Zero Health Telemetry:** Existing directories and registries only provide static URLs with zero insight into current uptime, p95 latency, or auth status.

ActionGuard provides continuous edge probing, cryptographic tool-digest verification, multi-protocol manifest compilation, and trust-ranked routing for both tool builders and enterprise consumers.

---

## Core Product Pillars

1. **The 5-Stage Live Inspector ("SSL Labs for Agents"):** Zero-signup diagnostic tool running live edge probes against MCP and A2A endpoints, returning an A+ to F scorecard and instant copy-paste fixes.
2. **Universal Manifest Compiler (`actionguard.json`):** Single source of truth that compiles down to official MCP Registry `server.json`, A2A `agent-card.json`, and DNS-AID DNS records.
3. **Dual-Hash Integrity Engine:** Distinct cryptographic fingerprints for JSON Schemas (`schema_sha256`) versus tool descriptions (`descriptions_sha256`) to catch silent prompt mutations.
4. **Enterprise Dependency Watchlist:** Automated monitoring for platform teams consuming external agents, triggering instant alerts (Slack/Discord/Email/Webhooks) and PR gating before breaking changes deploy.
5. **Trust-Aware Routing API:** Programmatic resolution endpoint for orchestrators needing verified, low-latency, drift-free agents with automatic fallback routing.

---

## Infrastructure

Built entirely on the Cloudflare edge stack for global low-latency probing:
- **Cloudflare Workers:** Edge probing engine, public API, and badge generation.
- **Cloudflare D1:** High-performance relational index for accounts, services, subscriptions, and scores.
- **Cloudflare R2:** Content-addressed, immutable storage for historical snapshot payloads, raw schemas, and audit logs.
- **ActionGuard CLI (`npx actionguard`):** Local linting and CI/CD verification action.

---

## Documentation

- [Product Requirements Document (PRD)](./docs/REQUIREMENTS.md)
- [Protocol Specifications & Mappings](./docs/SPECIFICATIONS.md)
- [System Architecture & Data Model](./docs/ARCHITECTURE.md)
- [Step-by-Step Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)
