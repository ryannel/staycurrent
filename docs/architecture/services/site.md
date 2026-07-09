---
title: site
description: The static reader surface for Stay Current — a Next.js App Router export with no server, no database, and no runtime configuration.
service: site
type: service
generation_mode: generated
source_of_truth:
  - services/site/
last_reviewed: 2026-07-09
---

# site

**Generator:** nextjs-app
**Language:** TypeScript
**Port:** 4173
**Base path:** `services/site/`

## Overview

site is the reader-facing surface of Stay Current: a Next.js App Router application that renders every article, changelog, and companion-skill page as a static export. `next build` produces the complete `out/` directory once, and a CDN serves those files unchanged — site runs no server process outside local development.

## The export constraint

`services/site/next.config.mjs` sets `output: 'export'`. Every route must be statically enumerable at build time: no route handlers, no dynamic server components, no image-optimizer service. `images.unoptimized: true` follows directly — there is no server to run Next.js's image pipeline. `trailingSlash: true` follows from the deploy target — GitHub Pages serves flat files and treats `/topic` and `/topic/` as distinct paths, so every route emits its `index.html` under a trailing-slash directory.

## Content

site consumes content through content-core's typed loading API at build time — it never parses `topics/` frontmatter or markdown directly ([architecture §4](../index.md)). content-core does not exist yet; it arrives with the first bet, and every route that reads article content is unbuilt until then.

## Dependencies

| Dependency | Type | Notes |
|---|---|---|
| content-core | In-process library | Typed content-loading API, called at build time — not yet built; arrives with the first bet |

site is a stateless frontend: it owns no database and reads no runtime environment variables.

## Commands

| Command | Runs | Purpose |
|---|---|---|
| `pnpm start:static` | `next build && serve out -l 4173 --no-clipboard` | Builds and serves the static export — what `./dev start` runs, and what system tests prove |
| `pnpm dev` | `next dev --port 4173` | Hot-reload dev server for manual iteration |
| `pnpm build` | `next build` | Static export to `out/` |
| `pnpm serve:static` | `serve out -l 4173 --no-clipboard` | Serves an already-built `out/` export without rebuilding |
| `pnpm test` | `vitest run` | Unit test suite (`pnpm test:watch` for watch mode) |
| `pnpm lint` / `pnpm lint:fix` | `eslint .` | Static analysis |

All commands run from `services/site/`. `./dev start` runs `pnpm start:static`: the runner serves the built export — the same artifact GitHub Pages deploys — so system tests and milestone proofs exercise production truth rather than a dev server (`next dev` injects a development-overlay portal into every page, which falsifies render assertions). `pnpm dev` remains the manual inner loop; both bind port 4173, so run one at a time (see `docs/architecture/infrastructure.md`).

## Environment variables

None. The static export has no server process to configure.

## Testing

`pnpm test` runs the Vitest unit suite inside `services/site/`. System-level proof runs from the repo root: the `site` surface is registered in `tests/` with Playwright against `http://localhost:4173`, driving the built static export the runner serves (`docs/architecture/infrastructure.md` — System tests).
