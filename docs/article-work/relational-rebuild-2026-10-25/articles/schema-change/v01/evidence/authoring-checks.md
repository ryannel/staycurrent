# First stable authoring checks

25 October 2026. First complete source; independent review belongs to the coordinator's next stage.

## Prose and continuity

Reread complete article, SQL, captions, controls and text alternatives from the stated engineer starting point. The fixed references led the question → drawing → interpretation order. The plan supplied reader outcomes and ownership. The figure captions are ordinary captions, not document headings. Collection navigation and the final closed sources are supplied by the wrapper. Neighbour links use supplied canonical /learn/databases/relational/ destinations.

Three scenes establish the central understanding: compatible schema/caller states, current source versus stale local calculation, and a late row behind a finished scan. The prose supplies the convergence argument and later acceptance/return/contract consequences. The shared example and selected independent variations are recorded in example-facts.md. No additional scenario facts or ownership changes were required.

## SQL and model

Ten assertions passed with `node evidence/verify-sql.mjs`; exact displayed SQL is extracted from article.astro. sql-results.json records the actual runtime, literal statements, data outcomes and source hash. Runtime: PGlite 0.5.8, PostgreSQL 18.3/WASM, one owned disposable in-memory database closed afterwards. Protection has visible counterexamples: stale assignment leaves 22.00/2000; old-only late insert leaves P11 NULL; old required price refuses a new-only insert. Verified finite upper bound and NaN exception. No native concurrency, lock waits, migration timings or headroom observations claimed. No reader download supplied.

Illustrative figure traces were checked through the browser against the same values and outcomes. Figure 1 has six stages; figure 2 has four stages for each of three write rules; figure 3 has four stages for each of two insert rules. Current-row final wording accurately says that the displayed conditional statement leaves an already-correct 2200 alone. Text-key order is explicit; SQL evidence uses COLLATE C.

## Rendered and accessible controls

Owned IAB preview at http://127.0.0.1:4656/review/article/. Inspected all three figures at 1280×720 and 375×720 in light and dark. Checked mobile SQL, long field names, captions and controls. Repaired a mobile label/value collision, explicit option names, literal comparison signs, and the global table display:block interference. Final late-row table fills its panel at both sizes. Browser DOM measurement at 375: page width 375; all figure widths and scroll widths 343. No page/figure horizontal overflow. SQL retains its own scroll region.

Exercised every stage and option; Back, Next, Reset, Play/Pause and Replay; keyboard Enter on Next for all three figures; final-stage and initial-stage boundaries; text-alternative disclosure for all three. Actual timed playback advanced from step 1 to step 3 before being stopped. Native focus remained visible; end controls use aria-disabled while keeping focus. browser-results.json retains scenario/control observations. Final error/warning log inspection returned no entries.

Computed contrast from actual light/dark CSS tokens: main text, secondary text and accent against both surfaces all exceed 4.5:1; minimum 5.52:1. Meaningful phase/late-row outlines and button/box borders use those accent/secondary colours. Decorative rules are not the sole distinction. contrast-results.json retains all ratios. Text alternatives are present and were opened; no independent screen-reader session or reduced-motion emulation was performed. Shared player and local CSS honour the supplied reduced-motion guard.

Screenshots: desktop-light.png (guarded P7), desktop-light-rollout.png, desktop-dark-rollout.png, desktop-dark-race.png, desktop-light-cursor.png, desktop-dark-cursor.png; mobile-light/dark-rollout.png, mobile-light/dark-race.png, mobile-light/dark-cursor.png. Unaffected checks retained after the final local table repair; its mobile/light/dark and desktop rendering were rechecked.

## Build and cleanup

Coordinator owns compilation. Initial compilation passed. Final stable compilation requested after the last table repair; exact stable source hashes are in source-hashes.json. No package install, server launch, build, independent review, commit or publication performed by this writer.

Private preview restored to System theme and 1280×720; all figure playback stopped/reset; all seven owned reference/neighbour/preview tabs closed. Reference/main-origin theme settings left unchanged.
