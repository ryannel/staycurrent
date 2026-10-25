# First complete version: authoring checks

25 October 2026. Writer owns this isolated workspace only. No delegation, independent review, commit or publication arranged. Coordinator will freeze and review the assembled opening batch.

## Inputs

- Plan SHA256: `266c036b4990fdeb03b540bb2382c5071ee0da2dd21dbf858aeb23ec5fccfed7`
- Neighbours SHA256: `8b4644030b5990251ba08f18b3b37b877dc1469088ec14cd291ed22a07902f2d`
- Commission SHA256: `9988560afa74905a1e76f397fe9de00b6a3c13252e76c75e0d402ae0f24db9b1`
- Assignment SHA256: `f0641b7d8086a24ca20bf03b7e966e4eec300d1606d3b5bd3877719f62b7c7c9`
- Write skill SHA256: `8686c15d453dfb0b98021e0e47290cc836b3f99160cb210a7e9e5e73d02b0dbe`
- Figures skill SHA256: `a2f5c4a99c54cfe761f2df2504d9a5e42d15e0d9ac3c06277f8e73cc874a94dc`
- Continuity skill SHA256: `8d145696054e160303d765497156e75433ce876fe199d7efccba57dee977cf0a`
- Reference hashes and complete bounded reading: `reference-exposure.md`.

## Authoring and continuity

Complete prose, SQL, figures, captions, alternatives and controls reread from the intended reader's starting point, then against the fixed references' explanatory pattern. Follows one report from order identity through one/many/missing matches to independent per-order summaries. The row meaning changes are explicit at each stage. Grain, aliases, correlated subquery, SUM/GROUP BY, WITH/CTE and COALESCE are introduced when used. SQL examples and figure facts agree. Partial and equal-line cases are clearly separate scenarios. No shared facts or scope extensions required. No earlier manuscripts or reviews consulted. No unfinished neighbouring article is promised as available.

## Result checks

Deterministic model checks passed for customer/line/payment row counts, the four combinations and doubled sums, all three report balances and partial payment.

Actual SQL checks passed in owned in-memory PGlite 0.5.8 / PostgreSQL 18.3. The exact reader download executes, then focused queries assert all row counts, existence outcomes, erroneous and repaired totals, UNION ALL/UNION/INTERSECT/EXCEPT, missing-COALESCE failure, equal-valued-line DISTINCT failure and partial payment. See technical-sources.md and retained JSON outputs. Native PostgreSQL 18.6 bootstrap was unavailable because of shared-memory allocation failure; no native run is claimed. Coordinator accepted the labelled PGlite evidence. No external databases used; disposable memory instance closed; failed native bootstrap directories removed.

## Rendered and control checks

Initial isolated compilation passed, coordinator reported stable hashes during compilation. Final compilation requested after local rendering corrections: full-width table display overriding the shared global block style, clearer wording of one NULL-test step, and article-local SQL syntax token mixing to meet text contrast. Shared infrastructure was not edited.

Inspected isolated preview with an owned IAB tab:
- Desktop 1280 × 720: all four figures in dark and light.
- Phone 375 × 812: all four figures in dark and light; full page width remains 375. Matrix and output table fit; summary headings wrap; longer code regions scroll internally (e.g. report content 435 px within 341 px region).
- Figure 1: both attachment options, all steps, Back/Next boundary states, Reset, Play/Pause, Replay state and text alternative. Enter operates playback and stepping; focus retained on end-state Next. Shared stepper supplies text-based holds and reduced-motion hold-bar handling; OS reduced-motion preference was not changed.
- Figure 2: all three conditions, matching visible outcomes; native keyboard Space/End/Enter selection commits Card in WHERE; expanded/closed text alternative.
- Sources: closed initially, expands and closes through heading/summary.
- Keyboard focus visible. Longer SQL region accepts keyboard scrolling.

Text and semantic indicator colours read from rendered UI. Light panel text rgb(36,33,26), secondary rgb(93,88,77) against rgb(240,237,229); dark panel text rgb(220,215,204), secondary rgb(168,162,148) against rgb(38,35,32). Semantic teal indicator rgb(39,122,115) light / rgb(138,199,187) dark; coral and teal never carry meaning alone. Text alternatives and semantic tables retained. Measured contrast ratios: primary/secondary text 13.73/6.05 in light and 10.89/6.15 in dark; teal semantic indicator 4.36/8.16; coral semantic indicator 3.91/5.92. A final narrow check of article-local SQL colour mixing confirmed light keyword/string/constant text ratios 5.53/5.04/4.85 and dark numeric constants 4.59 (other dark token colours already passed). This narrow confirmation used only the query origin theme and no viewport override while introduction held the viewport lease. Its owned tab was restored to System and closed. Representative screenshots: render-desktop-light.png and render-phone-dark.png; they show figure geometry before the SQL-only colour adjustment. This is authoring QA, not an independent rendered review or a screen-reader/device test.

After checks: playback stopped (Play label), source disclosure closed, System theme selected through UI, viewport override reset to original 1280 × 720. Owned reference and draft tabs closed. Browser lease released to coordinator.

Final owned source/asset hashes are recorded in source-hashes.txt. No further source edits planned before freeze.
