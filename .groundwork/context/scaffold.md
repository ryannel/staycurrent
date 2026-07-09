# Scaffold — Downstream Context

### Key Decisions

- Repo layout: `services/site` (Next.js 16 App Router, static export, port 4173), `core/` and `workbench/` reserved for the first bet.
- Toolchain: Node 24 + pnpm 11 (site), uv/Python 3.11 (tests), minimal nx wrapper at root.
- `./dev start` runs the site runner `pnpm start:static` — build then serve the real export; `pnpm dev` is the manual inner loop.
- System tests: pytest + playwright in `tests/`, surfaces fixture site→`http://localhost:4173`, workbench→`node workbench/cli.mjs`.
- Cluster health gate probes URL-reach surfaces and only compose-declared services; no Jaeger provisioned by design.
- Brand tokens projected into `services/site/app/brand.css` and the `./dev` CLI identity.
- No docker services; docker-compose.yml intentionally empty of services.

### Binding Constraints

- The static export (`out/`) is the artifact tests and milestone proofs run against.
- `services/site/app/api/` must stay absent — route handlers are impossible under `output: 'export'`.
- No OpenTelemetry, no analytics, no server dependencies in the site.
- Workbench test fixture is live: the first workbench test fails red until `workbench/cli.mjs` exists.

### Deferred Questions

- GitHub Actions workflow (gate → RSS → build → Pages deploy) — built in the first bet's publish milestone.
- `STAYCURRENT.md` root instruction file + AGENTS.md pointer — created with the workbench in the first bet.
- Custom-domain DNS (staycurrent.dev → Pages) — operator action when the workflow lands.

### Out of Scope

- Databases, message brokers, telemetry backends, containers — permanently absent per ADRs 0001/0002.
