---
title: Maturity Roadmap
description: The project's assessment against the GroundWork maturity model and the tracked roadmap of open gaps.
service: "cross-cutting"
type: "index"
last_reviewed: 2026-07-09
---

# Maturity Roadmap

This document tracks the project against the GroundWork maturity model — the nine dimensions of the target state defined in `.groundwork/skills/maturity-model.md`. The assessment says where the project stands; the roadmap says what closing the distance is worth and what it costs. Gaps are proposals, not obligations: `accepted` is a legitimate terminal status.

## Current Assessment

| Dimension | State | Evidence |
|---|---|---|
| D1. Documented truth | ✅ | `docs/product-brief.md`, `docs/design-system.md`, `docs/architecture/index.md`, `docs/architecture/infrastructure.md` all exist as clean published docs with frontmatter and `last_reviewed` dates. `npx groundwork-method check` exits 0: 3 current, 0 stale, 3 unassessed — the three domain docs carry no `source_of_truth` drift frontmatter, so the deterministic checker cannot assess them; the domain-entity template omits it by design, and the `groundwork-check` skill's doc-type judgement covers them instead. |
| D2. Machine-readable contracts | 🟡 | `.groundwork/surfaces.json`, `.groundwork/capability-ports.json`, and `.groundwork/config/brand-tokens.json` are machine-readable and current. The content contract itself — the typed module API architecture §4 commits content-core to (`TopicFrontmatter`, `ChangelogEntry`, `VersionSnapshot`, `ProvenanceRecord`, `GateResult`) — has no code; `core/` does not exist. See G1. |
| D3. One-command operations | ✅ | `./dev` exists at the repo root; `./dev start` brings the `site` runner to healthy, confirmed via `./dev status --json` and `http://localhost:4173` serving `200`. No database or Docker infrastructure to gate on. |
| D4. System-level proof | 🟡 | `tests/system/` holds 10 collected tests (a11y, layout, render, token/contract conformance, visual regression, general system). The suite runs for real against the booted stack: 4 passed, 6 skipped (`pytest system/ -rs`) — the skips are the opt-in visual-regression test (`GROUNDWORK_VISUAL_REGRESSION=1`), four service-parametrized tests with empty `svc` sets (compose declares no services), and the "real CRUD lands in Phase 4" placeholder. Partial because no workbench tests exist yet, proof covers only the `site` surface, and `tests/bets/` holds no suites; bet-progress tests arrive with the first bet. |
| D5. Code intelligence | 🟡 | `.mcp.json` registers Serena. `.groundwork/cache/repo-map.json` does not exist — `npx groundwork-method repo-map --check` reports "No code map yet." See G3. |
| D6. Doc currency automation | 🔴 | No `.github/workflows/` directory exists; no CI configuration invokes `groundwork check`. The `groundwork-check` skill is available on demand but not wired to any gate. See G4. |
| D7. Delivery discipline | 🔴 | `docs/bets/` does not exist; no bet has been decomposed or delivered yet. See G5. |
| D8. Surface parity discipline | ✅ | `docs/surfaces.md` and `.groundwork/surfaces.json` agree: `site` and `workbench`, both `active`. `./dev surface status` reports zero twin drift. The capability ledger is empty by design — no capability has shipped, so nothing has diverged and no `planned` cell exists to go stale. |
| D9. Contract compatibility | n/a | Precondition unmet: architecture §7 states both surfaces "deploy from one repository in one push — there is no independent-deploy versioning problem between them." The additive-evolution stance is pre-recorded in §7 for when a second independently-deployed surface registers. |

**Assessed:** 2026-07-09 by groundwork-scaffold

## Roadmap

One row per gap. Severity/recommendation/status definitions: `.groundwork/skills/maturity-model.md`. Status moves `open` → `in-bet (<slug>)` → `closed (<slug>)`, or to `accepted` when the user decides the gap stays.

| # | Gap | Dimension | Severity | Recommendation | Status | Evidence / Notes |
|---|---|---|---|---|---|---|
| G1 | content-core does not exist — no code implements the content contract (`TopicFrontmatter`, `ChangelogEntry`, `VersionSnapshot`, `ProvenanceRecord`, `GateResult`) architecture §4 commits to | D2 | blocks-delivery | blocks-delivery | open | `core/` is absent from the repo; the site's content-loading path and the publish gate both depend on this contract. This is the first bet. |
| G2 | Every system test skipped instead of running: the shared `cluster` fixture (`tests/conftest.py`) health-gated on the Jaeger query API unconditionally, and this project provisions no Jaeger, so the gate timed out after 300s and every test fell through to `pytest.skip`. | D4 | blocks-delivery | fix-now | closed (scaffold) | Fixed 2026-07-09 in `tests/conftest.py`: the fixture probes Jaeger only when `docker-compose.yml` declares a `jaeger` service, and health-gates every URL-reach surface (the site at `http://localhost:4173`) instead. Verified: `pytest system/ -rs` reports 4 passed, 6 skipped — the skips are the opt-in visual-regression test, four empty `svc` parameter sets (compose declares no services), and the Phase-4 CRUD placeholder; none are gate-blocked. Closed as scaffold repair — no bet slug exists. |
| G3 | `.groundwork/cache/repo-map.json` does not exist; the deterministic code-intelligence map was never generated at scaffold. | D5 | standard-divergence | fix-now | open | `npx groundwork-method repo-map --check` reports "No code map yet." Cost: `groundwork-check` has no reference-graph reach, `groundwork-doc-sync` has no deterministic impact analysis, and bet worktree bootstrap starts without a code map — structural questions fall back to LLM inference. Serena's live symbol index (`.mcp.json`) partially mitigates. Fix is one command: `npx groundwork-method repo-map`. |
| G4 | No CI configuration exists — `.github/workflows/` is absent, so nothing invokes `groundwork check` on pull requests and the publish pipeline (gate → RSS → `next build` → Pages deploy) has no workflow file. | D6 | standard-divergence | defer | open | Doc drift is currently caught manually (`npx groundwork-method check`, this writing pass). The workflow file lands with the first bet's M2 publish-pipeline slice — wiring the `groundwork-check` gate into that same file is the natural point to close this. |
| G5 | No bet has been decomposed or delivered — `docs/bets/` does not exist. | D7 | standard-divergence | defer | open | Expected zero-state for a project that has only completed product-brief, design-system, and architecture. Closes as a side effect of running the first bet, not by a separate remediation task. |
| G6 | `status`'s cold-start reconciliation reverts `in-research → current` in `topics/*/article.md` without its own commit — the mutation rides silently into the next unrelated `cut`/`log` commit, in tension with "the repo is the audit trail" and the two-commits-only rule. | D7 | standard-divergence | defer | open | Surfaced by the M1 experience audit (first-living-topic). Options: a dedicated `reconcile(<slug>): revert` commit, or reporting-without-mutating until the operator resolves. Architecture-level call — route through a future patch/bet, not an inline fix. |
| G7 | `renderMarkdown`'s pipeline (core) applies no URL-protocol sanitization — a markdown link like `[x](javascript:…)` survives into `RenderedDoc.html` and reaches the browser through the site's `dangerouslySetInnerHTML`, a live XSS vector on the published page. | D2 | blocks-delivery | fix-now | closed (first-living-topic) | Surfaced by the slice 2.1 edge-case review (first-living-topic); verified empirically against built `core/dist` — raw HTML blocks are dropped and attributes escaped, so href protocol is the one surviving script vector. Content is repo-authored and gate-reviewed today, but the research loop ingests external sources, so a hostile or sloppily-copied link is a plausible carrier. Fix belongs in core's render pipeline (protocol allowlist) and/or a publish-gate check — a core contract change, not a site patch; must land before the loop opens to external input (M4). |
| G8 | Core's frontmatter validation accepts empty or whitespace-only `title` and `stance` (`typeof === 'string'` only), and the publish gate never inspects stance content — a blank stance builds green and renders a silently blank card line on `/`, the first surface that shows `stance` raw. | D2 | standard-divergence | defer | closed (first-living-topic) | Surfaced by the slice 2.3 edge-case review (first-living-topic). Violates "every tile states its stance" without tripping any fail-closed rule; an empty `title` also degrades the card link's accessible name. Fix is core-owned (tighten `validateTopicFrontmatter` to non-blank `title`/`stance`) — natural home is M4's loop work or a patch-lane fix; not reachable from repo-authored content today. |

## History

<!-- Append-only log: one line per assessment or status change. -->
- 2026-07-10 — G7 and G8 closed (first-living-topic slice 3.1): renderMarkdown protocol allowlist (obfuscation-resistant, property-tested), non-blank title/stance validation (zero-width-aware), and gate check 10 frontmatter-schema (change-proposal-6) so a gate-passed cut can never land loader-rejected content.
- 2026-07-10 — G8 opened (blank title/stance passes core validation and the gate; slice 2.3 review, deferred as pre-existing core concern).
- 2026-07-09 — G7 opened (unsanitized link protocols in renderMarkdown → site XSS vector; slice 2.1 review, deferred as pre-existing core concern).
- 2026-07-09 — G6 opened (reconciliation audit-trail tension, M1 experience audit).
- 2026-07-09 — initial assessment by groundwork-scaffold; G1–G5 opened.
- 2026-07-09 — G2 closed: `cluster` fixture fixed to probe Jaeger only when compose declares it and to health-gate URL-reach surfaces; suite verified running (4 passed, 6 skipped). D4 evidence updated.
