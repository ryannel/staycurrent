---
title: Setup
description: The fresh-clone walkthrough for Stay Current — installing the site app and the test environment, then booting the stack.
type: getting-started
last_reviewed: 2026-09-29
---

# Setup

This walkthrough takes a fresh clone to a running site. It assumes Node 24+, pnpm 11+, and `uv` are already installed.

## 1. Clone the repository

```bash
git clone <repo-url> staycurrent
cd staycurrent
```

## 2. Build the content core and install the site app

```bash
cd core
pnpm install
pnpm build
cd ../services/site
pnpm install
cd ../..
```

`services/site` depends on `@staycurrent/core` as a `file:../../core` package, so the core has to be built before the site installs.

## 3. Set up the system-test environment

The system tests run from `tests/`, in their own Python virtual environment.

```bash
cd tests
uv venv
uv pip install -e .
uv run playwright install chromium
cd ..
```

`uv pip install -e .` reads `[project.dependencies]` from `tests/pyproject.toml` — pytest, `pytest-playwright`, `pytest-asyncio`, and the rest of the harness. `playwright install chromium` downloads the browser the `site` surface's tests drive.

## 4. Build and serve the site

```bash
cd services/site
pnpm start:static
```

This runs `next build` and serves the resulting `out/` export on port 4173 — the same artifact GitHub Pages deploys, and the one system tests prove. Allow the first build a minute. There is no database or container to wait on ([`docs/architecture/infrastructure.md`](../architecture/infrastructure.md)).

For hot-reload iteration while editing the site, run `pnpm dev` in `services/site` instead — it binds the same port 4173, so run one at a time.

## 5. Confirm it's running

```bash
open http://localhost:4173
```

## 6. Run the checks

```bash
cd core && pnpm test && cd ..
node scripts/publish-gate.mjs
cd services/site && pnpm lint && pnpm test && cd ../..
node --test workbench/cli.test.mjs workbench/lib/format.test.mjs scripts/prose-metrics.test.mjs
cd tests && STAYCURRENT_REQUIRE_SERVICES=1 uv run pytest system/
```

The system suite expects the static export to be serving on port 4173.
