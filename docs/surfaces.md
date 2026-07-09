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

No capability rows yet — bet validation writes rows here as capabilities ship.
