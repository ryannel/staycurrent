# Stay Current

One place developers look to stay current on the major topics and fields of their work. Each topic is a living article with a stance, rewritten when the field moves, with version history, a changelog, and honest provenance. The site is [staycurrent.dev](https://staycurrent.dev).

- [`docs/product-brief.md`](docs/product-brief.md) says what the site is for and who it serves.
- [`docs/getting-started/`](docs/getting-started/index.md) gets a fresh clone building.
- [`docs/architecture/`](docs/architecture/index.md) describes how the pieces fit.
- [`STAYCURRENT.md`](STAYCURRENT.md) is the operator contract for running research runs.

## Layout

| Path | What it is |
|---|---|
| `topics/` | The content: one directory per topic |
| `core/` | The content contract, publish gate, and loaders (`@staycurrent/core`) |
| `services/site/` | The reader-facing site, a Next.js static export |
| `workbench/` | The operator CLI that stages, gates, and commits cuts |
| `scripts/` | The full-tree publish gate and the prose-metrics tool |
| `tests/` | The system test suite, run against the built site |
| `.claude/skills/` | The writing skills the research loop runs on |
