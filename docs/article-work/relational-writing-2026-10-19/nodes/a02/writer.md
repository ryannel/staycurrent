# a02 writer handoff — B01 repair complete

**Ready for orchestrator-managed recheck.** The final draft remains staged at `docs/article-work/relational-writing-2026-10-19/nodes/a02/article.astro`; root should re-promote it after this handoff. Since the latest promotion, the article only changed its source paragraph from “two interactive figures” to “interactive figures” and added the primary type-resolution source. Component updates are already visible on the shared preview.

## Required teaching repairs

1. **Visible complete report:** new `ReportFigure.astro` and `reportModel` show five candidate order identities across four stages: their source line/receipt identities, independent named subtotals, balances/EXISTS with asymmetric defaults, and final filtering. Relevant SQL is visible at each stage. The original shows 101’s 30 − 15 = 15; absent payments for 102 become zero, while absent lines for 106 remain unknown. Faint excluded candidates are explicitly comparison rows, distinct from the final SQL answer. Four input choices change only one source fact: baseline, extra receipt for 101, settlement of 101 and first line for 106.

2. **Pagination mechanism:** the saved first page and timestamp/ID boundary stay visible as rows change. Persistent DOM nodes retain order identities. Original→current position labels expose movement; inserted/deleted first-page identities are identified; offset’s two skipped positions and keyset’s boundary are explicitly marked. All eight parameter combinations retain their checked results. Vertical rows remain legible on phones instead of wrapping an unmarked strip.

3. **Endpoint focus:** the owned `player.ts` transfers focus to enabled Play/Replay before disabling active Back/Next. Actual Enter tests passed at both endpoints for inner/left joins, offset/keyset pagination and the report sequence.

4. **Narration-aware playback:** all three figures use the shared owned player. Holds are `max(4200 ms, 1600 ms + 280 ms per narration word)`, allowing reading and comparison; manual Back/Next, pause and reset remain available. Controls and narration have a sticky in-figure dock on mobile. No spatial/fading animation or autoplay was introduced.

Optional practitioner **a02-O1** is also repaired: the prose now says pg_typeof checks original output types separately, while EXCEPT ALL compares values and multiplicities after compatible type resolution.

## Ready files and evidence

- Staged `article.astro`, `sources.md`, this `writer.md`.
- Owned `queries.mjs` unchanged; `model.mjs`, `SqlFigure.astro`, new `ReportFigure.astro`, new `player.ts`.
- Expanded `verify.mjs` and retained `native-evidence.json`.

Final native run: **PostgreSQL 18.6, rel3_a02_run21**, passed the full original verifier plus equality between all four report model inputs and executed SQL for both intermediate subtotals/balances/EXISTS and final answers. Native sessions closed; only own disposable databases remain. No server changes.

Browser QA on shared preview: report source identities, subtotals, defaults and filter; all report parameter results; all eight paging results; endpoint keyboard focus; Play/Pause; desktop and 390 × 844 phone layouts; both colour appearances; zero captured browser errors. Phone page width equals viewport width (390 px). Viewport restored afterwards. Astro transforms report zero diagnostics for the staged fragment and both figure components.

The original prose, scopes and reserved `#checkable-stages` prerequisite remain. No tree change, curriculum expansion, shared edits, final-src edits, commits or nested reviews. Root owns shared build and independent recheck.
