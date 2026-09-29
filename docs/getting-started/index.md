---
title: Getting Started
description: The on-ramp for a fresh clone of Stay Current — what the project is and the quickstart.
type: getting-started
last_reviewed: 2026-09-29
---

# Getting Started

Stay Current is a self-researching publication system: each topic it covers is a living article with a stance, kept current by a research loop the operator runs inside Claude Code, and served as a fully static site with no servers. This section gets a fresh clone running; [`docs/product-brief.md`](../product-brief.md) explains why the product is shaped this way.

## Quickstart

```bash
pnpm --dir core install && pnpm --dir core build
pnpm --dir services/site install && pnpm --dir services/site start:static
open http://localhost:4173
```

## Where to go next

- [`setup.md`](setup.md) — the full fresh-clone walkthrough, including the system-test environment.
