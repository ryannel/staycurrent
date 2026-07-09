---
title: Dev CLI Reference
description: The ./dev commands that operate Stay Current day to day, and an honest account of which ones do meaningful work in a database-free, container-free workspace.
type: getting-started
last_reviewed: 2026-07-09
---

# Dev CLI Reference

`./dev` is the one-command entry point for local development ([`docs/architecture/infrastructure.md`](../architecture/infrastructure.md)). Stay Current provisions no database and no Docker services, so several commands in the generic catalogue are no-ops or reduced here — this page states what each command actually does in this project, not what it does in general.

## Commands that matter here

| Command | Does |
|---|---|
| `./dev start` | Starts the `site` native runner: `pnpm start:static` — `next build` then serve the `out/` export on port 4173. This is the deployed artifact, the one tests prove. No Docker infrastructure boots — there is none. No hot reload: after a code change, restart the runner, or use `pnpm dev` (below). |
| `./dev stop` | Gracefully kills the `site` process. |
| `./dev status` / `./dev status --json` | Reports the `site` runner's live state. Use `--json` for scripted checks — `{"native": [{"service": "site", "status": "running", "pid": ...}]}` — never guess the port. |
| `./dev logs` / `./dev logs site` | Prints the recent tail of `site`'s log. `--follow` streams and requires a TTY — never run it from a script or tool call. |
| `./dev test` | Runs `tests/system/` against the already-running stack. The suite health-gates on the site being reachable at `http://localhost:4173` (and on any service `docker-compose.yml` declares — none here, by design), so run `./dev start` first. |
| `./dev health` | Polls health endpoints. In this project it currently reports no useful signal for `site` — see the warning below. |

For hot-reload iteration, run `pnpm dev` in `services/site` — the Next.js dev server on the same port 4173. It is the manual inner loop only: the dev server injects a development overlay that system tests must not see, which is why the runner serves the built export instead. Both bind 4173, so stop the runner before starting `pnpm dev`.

## One command that needs a caveat

> [!WARNING]
> **`./dev health` has no signal for `site`.** It polls services under `services/` that are *not* already registered as native runners, plus the Jaeger query API. `site` is registered as a runner in `.dev/dev.config.json`, so `./dev health` excludes it from its "App Services" check outright — and this project has no Jaeger, so that row always reads `down`. The command exits `1` in this project regardless of whether `site` is actually healthy. To check `site`, use `./dev status` or request `http://localhost:4173` directly.

## Lifecycle commands that are no-ops here

| Command | In this project |
|---|---|
| `./dev migrate` | No-op. Stay Current has no database — the command prints "No database in this workspace; nothing to migrate." and exits 0. |
| `./dev reset` | Runs a real stop → clean → start cycle for the `site` runner, but its `migrate` step is the no-op above. Use it to recover from a stuck native process; it buys nothing a plain `./dev stop && ./dev start` doesn't. |
| `./dev clean` / `./dev clean --hard` | Wipes `.dev/pids` and `.dev/logs`, then runs `docker compose down` against an empty compose file. The Docker step has nothing to remove. |

## The full catalogue

Derived from `./dev --help`. Commands not covered above work as documented but aren't part of the everyday inner loop for this project:

| Group | Command | Summary |
|---|---|---|
| Lifecycle | `start` | Boot infrastructure (Docker) + app services (native) |
| Lifecycle | `stop` | Gracefully tear down all services |
| Lifecycle | `reset` | Stop, wipe volumes, start & migrate (full recycle) |
| Lifecycle | `migrate` | Create service databases & apply schemas |
| Lifecycle | `status` | Show running services (`--watch` for a live dashboard) |
| Lifecycle | `logs` | Print recent logs (`logs <service>` to filter; `--follow` to stream) |
| Lifecycle | `health` | Poll every app service + Jaeger health endpoint |
| Lifecycle | `clean` | Tear down & wipe state (`--hard` wipes volumes) |
| Quality | `doctor` | Verify the local environment |
| Quality | `test` | Run tests (`integration` \| `bet <slug>`) |
| Quality | `lint` | Run static analysis across services |
| Bet workflow | `new` | Scaffold a bet / milestone / slice (red test stubs) |
| Bet workflow | `archive` | Archive a delivered bet's progress suite |
| Bet workflow | `bet` | Bet progress board (`status [<slug>]`) |
| Bet workflow | `surface` | Surface registry & capability ledger (`status`) |
| Meta | `completion` | Print a shell completion script (`bash`\|`zsh`\|`fish`) |

The bet-workflow commands (`new`, `archive`, `bet`, `surface`) matter once delivery starts; the full mechanics and flags are in the `workspace-cli` skill (`.agents/skills/workspace-cli/SKILL.md`), not repeated here.
