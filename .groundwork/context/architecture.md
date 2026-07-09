# Architecture — Downstream Context

### Key Decisions

- Embedded capability core `content-core`: content contract, publish gate, cut mechanics, loading API, RSS.
- Contract format: typed module API + the `topics/` filesystem contract.
- Surfaces: `site` (Next.js static export) and `workbench` (Claude Code skills + scripts, manual scaffold).
- Store is git + filesystem; no database, no servers, no runtime components.
- Hosting GitHub Pages; CI GitHub Actions; pipeline = gate → RSS → next build → deploy.
- LLM: Anthropic Claude in the operator's Claude Code session; product ships no LLM integration.
- Mermaid renders client-side, house-themed, source visible without JS, reserved layout space.
- Skill distribution: browsable file tree + per-version zip at `/skills/<slug>/`; install one-liner.
- Workbench root instruction file: `STAYCURRENT.md` (≤150 lines), pointed to from `AGENTS.md`.
- Engine/instance in one repo; engine code never names the instance.

### Binding Constraints

- Fail closed on publish: gate blocks incomplete versions; failed CI leaves previous deploy live.
- Gate logic exists once; workbench and CI run the identical content-core code path.
- One cut = one git commit; only content-core mutates `topics/`.
- No runtime auth, no reader data, no analytics; scale-to-zero.
- Cut requires operator's explicit go; nothing publishes autonomously.
- Skill payloads: markdown and files only; `article_version` binding enforced by the gate.
- Reserved topic slugs: `skills`, `changelog`, `about`, `rss.xml`.
- External contracts (URLs, RSS shape, skill anatomy) evolve additively within a major version.

### Deferred Questions

- First topic set and seeding — resolved in MVP Planning.
- Framework extraction into a distributable package — post-MVP bet.
- Search capability — deferred until ~25 topics.

### Out of Scope

- Hosted research service, LLM API integration, databases, per-topic feeds, skill registry/installer.
