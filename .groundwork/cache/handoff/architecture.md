# Hand-off from architecture

> Post-commit context drop from the phase that just committed. The next phase reads this file once at init and deletes it on its own commit.

---

## Rejected Options

- Hosted SSR / any server runtime — rejected: cost and ops for a read-only publication (ADR 0001).
- `docs-site` generator (Fumadocs) as the product site — rejected: hard-wired to serve the project's own `docs/`, cannot express `/[topic]/v/[n]`, `/[topic]/skill`, changelog routes (ADR 0001).
- Any database — rejected: no query pattern needs one; a second source of truth beside `topics/` (ADR 0002).
- Build-time mermaid → SVG — rejected: drags a headless browser into every build; client rendering with reserved layout space holds the CLS budget instead.
- npm/registry skill packaging — rejected at MVP (ADR 0005).

## Deferred Decisions

- Framework extraction into a distributable package — the engine-never-names-the-instance rule (index §4) keeps it a packaging exercise — revisit when a second builder wants the engine without forking staycurrent content.
- Search — no interface at MVP — revisit at ~25 topics (design-system escalation trigger).

## User Instincts

- Zero-cost operations matter — the operator runs this on subscription + free tiers; scaffold choices should not introduce paid dependencies.

## Context Drop

- **Scaffold targets from `.groundwork/surfaces.json`:** `site` → `nextjs-app` generator; `workbench` → `manual` (skills + scripts, no generator run).
- **nextjs-app adaptations required:** flip `next.config` to `output: 'export'`; delete Dockerfile/proxy/instrumentation residue (or `groundwork-check` flags phantom drift); no auth, no API proxy, no websockets flags.
- **Mermaid client-transform to reuse:** `/Users/ryannel/Workspace/groundWork/src/generators/docs-site/files/source.config.ts` contains a remark transform rewriting ```mermaid fences into a client component — proven, no build-time browser.
- **content-core placement:** `core/` at repo root (architecture frontmatter `source_of_truth` expects `core/`, `site/`, `.agents/skills/`, `.github/workflows/`).
- **`STAYCURRENT.md`** (workbench root instruction file, ≤150 lines) is created by the first bet's workbench work, not by scaffold — but scaffold must add the one pointer line to `AGENTS.md`.
- **CI shape:** gate → RSS → next build → Pages deploy; failed step leaves previous deploy live.
- Brand tokens for theming: `.groundwork/config/brand-tokens.json` (`visual` block) — generator projects them into the app theme.
