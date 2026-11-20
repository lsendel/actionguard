# Owned MCP registration visibility (draft)

Scope: Luis/fleet endpoints only. Third-party inspections and curated catalog
entries keep their existing public defaults.

## New owned endpoint

The caller must make the unlisted choice explicit:

```
POST /api/inspect
Content-Type: application/json

{"url":"https://owned.example/mcp","owner_fleet":true,"visibility":"unlisted"}
```

For the GET inspector, use `owner_fleet=1&visibility=unlisted`. The marker
restricts a new registration only. It is not proof of identity/ownership and
cannot authorize public visibility or hide an existing public third-party
record. Existing public records require authenticated operator review.

Known owned domains from today's explicit removal decision are also guarded
when callers omit the marker. Migration0005 catches SQL/catalog insertion
paths, preserves ordinary third-party defaults, marks the current four as
owner/fleet and keeps them unlisted. The exact inventory is intentionally
small; add a new domain only from grounded owner evidence and test JS/SQL
inventory parity. Do not infer ownership from names or arbitrary subdomains.

## Public exception

Only an authenticated operator, with Luis's endpoint-specific original
approval, may set `public_approval_ref` and `listed=1` together. No HTTP route
accepts or writes that reference. A claimed approval in request JSON is not
consent. The DB rejects owner re-listing without a nonempty reference and
prevents clearing a sticky owner marker as a bypass. The reference records
where verified approval can be recovered; it is not an authentication token.

## Completion gate

After registration, verify the actual D1 row and run the owner-only process in
fleet-ops `docs/runbooks/owned-mcp-registration-visibility.md` plus its one-shot
checker. Require absence from index/status/sitemap/feed/routing and internal
samples, and noindex on reachable detail/connect/badge/OG responses. Preserve
rows/history. Noindex is not access control and search engines must recrawl.

## Rollout and rollback

Draft PR only. No migration or deployment is authorized by this document.
Review source and SQL together, run full tests/build/lint and exact-head CI.
Apply0005before deploying the code after separate approval. For rollback,
roll back application code first; keep owned rows unlisted and decision
references. Do not clear owner markers or re-list rows as an automatic rollback.
A later schema rollback needs its own reviewed migration;do not drop tables
or history. Existing direct-page noindex from the prior deployment remains.
