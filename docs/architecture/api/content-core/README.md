# content-core — canonical contract

`content-core` (`@staycurrent/core`) deploys **embedded** — a TypeScript library
called in-process by the reader site and the operator workbench, never over a
network (architecture §"content-core deploys embedded"). Its contract is therefore
a **typed module API plus the `topics/` filesystem contract, not OpenAPI**. This
directory holds the machine-readable capture of that contract, the embedded-core
equivalent of a served `openapi.yaml`.

## Files

- **`module-api.d.ts`** — the complete public type surface, captured verbatim from
  `core/dist/*.d.ts` (the `tsc`-emitted declarations, the literal compiler-checked
  record `03-api-design.md` commits to). Captured from built code, never authored
  by hand: regenerate with `pnpm --filter @staycurrent/core build` and re-copy.

## What the contract covers

The Loading API (`loadTopic`, `listTopics`, `loadChangelog`, `loadVersion`,
`loadResearchLog`, `renderMarkdown`), the cut mechanics (`createTopic`, `stageCut`,
`executeCut`), the session mechanics (`convene`, `recordNoCut`, `discardSession`,
`reconcile`), the fail-closed publish gate (`runPublishGate`, eleven checks), the
feed generator (`buildRss`), and every exported type and error class — the shapes
every caller (site, workbench, CI) programs against in-process.

## The other surfaces

- **site** serves no HTTP API — it is a Next.js static export (`output: 'export'`,
  proven by the founding bet: no `api/` directory ships). Its "contract" is the set
  of static routes and the RSS/skill-payload artifacts the prebuild writes, all
  derived from `content-core` + `topics/` at build time.
- **workbench** is a `subprocess-cli` surface (`workbench/cli.mjs`) — its contract is
  the seven-command set (`status | create | convene | gate | cut | log | discard`),
  normative in `docs/design-system.md` § Agentic Protocol and the archived bet's
  `technical-design/03-api-design.md` § workbench/cli.mjs.
