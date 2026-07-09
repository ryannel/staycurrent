---
title: Setup
description: The fresh-clone walkthrough for Stay Current — installing the site app and the test environment, then booting the stack.
type: getting-started
last_reviewed: 2026-07-09
---

# Setup

This walkthrough takes a fresh clone to a running site. It assumes Node 24+, pnpm 11+, and `uv` are already installed.

## 1. Clone the repository

```bash
git clone <repo-url> staycurrent
cd staycurrent
```

## 2. Install the site app

```bash
cd services/site
pnpm install
cd ../..
```

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

## 4. Start the stack

```bash
./dev start
```

This boots the `site` native runner: `pnpm start:static`, which runs `next build` and serves the resulting `out/` export on port 4173 — the same artifact GitHub Pages deploys, and the one system tests prove. The first response waits on a full production build, so allow the boot a minute. There is no Docker infrastructure to wait on — `docker-compose.yml` provisions nothing in this project ([`docs/architecture/infrastructure.md`](../architecture/infrastructure.md)).

For hot-reload iteration while editing the site, run `pnpm dev` in `services/site` instead — it binds the same port 4173, so stop the runner (`./dev stop`) first.

## 5. Confirm it's running

```bash
open http://localhost:4173
```

Or check process state without a browser:

```bash
./dev status
```

which reports the `site` runner as `running` once the build finishes and the static server is up.
