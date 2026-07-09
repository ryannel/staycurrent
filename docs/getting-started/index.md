---
title: Getting Started
description: The on-ramp for a fresh clone of Stay Current — what the project is and the three-command quickstart.
type: getting-started
last_reviewed: 2026-07-09
---

# Getting Started

Stay Current is a self-researching publication system: each topic it covers produces a living article and a companion AI skill, kept current together by a research loop the operator runs inside Claude Code, and served as a fully static site with no servers. This section gets a fresh clone running; [`docs/product-brief.md`](../product-brief.md) explains why the product is shaped this way.

## Quickstart

```bash
pnpm --dir services/site install
./dev start
open http://localhost:4173
```

## Where to go next

- [`setup.md`](setup.md) — the full fresh-clone walkthrough, including the system-test environment.
- [`dev-cli-reference.md`](dev-cli-reference.md) — every `./dev` command and which ones actually matter in this project.
