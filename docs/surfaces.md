---
title: Surfaces
description: The capability core's deployment model and the surface registry adapting it — site and workbench.
type: index
last_reviewed: 2026-07-09
---

# Surfaces

## Capability Core

The capability core (`content-core`) deploys **embedded** — a TypeScript library
called in-process, never over a network. It owns the content contract (topic
frontmatter schema, changelog and provenance anatomies, the `topics/` layout),
the fail-closed publish gate, version-cut mechanics (stage → gate → commit),
the content loading API, and RSS generation. Its contract is a typed module
API plus the `topics/` filesystem contract, not OpenAPI — capability
behaviour is provable headless against the module API with no surface
running.

## Surface Registry

### site

| Field | Value |
|---|---|
| type | graphical-ui |
| platform | web |
| status | active |
| core access | in-process (build-time) |
| auth | none — anonymous static serving |
| scaffold | nextjs-app |
| test medium | playwright |
| design track | docs/design-system.md § Graphical UI |

### workbench

| Field | Value |
|---|---|
| type | agentic-protocol |
| platform | protocol |
| status | active |
| core access | in-process (scripts; writes land as git commits) |
| auth | operator's git credentials; no runtime auth |
| scaffold | manual |
| test medium | subprocess-cli |
| design track | docs/design-system.md § Agentic Protocol |

## Capability Ledger

One row per user-meaningful capability. States: `delivered (<bet>)`, `planned (<ref>)`,
`omitted — <rationale>`, `n/a` (no payload). Validation is the only writer.

| Capability | site | workbench |
|---|---|---|
| `first-living-topic/living-article` | delivered (`first-living-topic`) — the reader-facing living article with its full trust apparatus: currency header, stance callout, TOC, themed diagrams, provenance, changelog, history, archived versions, site-wide feed | n/a — the workbench is the operator's tool, not a reader surface; it has no read/browse path |
| `first-living-topic/research-loop` | n/a — the site is read-only (`output: 'export'`, no write path); it never convenes or cuts | delivered (`first-living-topic`) — the gated research loop: convene → ranked digest → cut/no-cut verdict → the fail-closed eleven-check gate → one commit, zero hand-edits |
| `first-living-topic/skill-distribution` | delivered (`first-living-topic`) — the distribution *mechanism*: the install page's canonical one-liner, the payload tree and per-version zips, honestly labelled where a reader meets it. Authored companion-skill *content* is deferred to a future skill-design bet (change-proposal-2), tracked in discovery notes | n/a — the workbench authors and cuts the payload into `topics/`; it is not itself a distribution surface a reader fetches from |
