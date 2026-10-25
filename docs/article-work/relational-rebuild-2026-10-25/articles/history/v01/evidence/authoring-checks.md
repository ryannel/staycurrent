# Authoring checks · first complete source

Completed the normal authoring reread and continuity pass after writing, including captions, controls and text alternatives. This is author verification, not independent review. No independent reader or delegation was requested in this isolated assignment.

## Writing and teaching

- Read all 19 reference parts and studied finished drawings before designing; exposure recorded separately.
- Reread the complete manuscript from the planned entry point: current/agreed price first, then one effective clock, then the late correction and recording clock. Figure 2 does not preannounce a correction in its option labels. The effective and recorded intervals remain visible together in Figure 3.
- Preserve order 103 at 20 October 10:15 UTC, agreed P7 price 20.00 and total 29.00 throughout. Do not infer purchase terms from the corrected catalogue. State recording coverage separately from an unbounded effective start.
- The purchase correction drawing gives alternative cases; it does not add unrecorded refunds or a mistaken agreement. The deletion is separate and conditional on policy. Its full scope stays pending for failed search removal and later backup expiry. No retention duration or legal conclusion is invented.
- Keep DML/import procedures and restore/reconciliation procedures with their owners. The only available neighbour linked in prose is modelling; planned backup reading is marked planned.
- Body fragment delegates ArticleBody/contents/source disclosure to root’s wrapper. Removed an initially duplicated ArticleBody wrapper after the neutral preview exposed two contents lists. Sources h2 is at the absolute bottom of the fragment.

## SQL and models

`node evidence/verify-sql.mjs` passed 18 checks, generated the SQL download from shared model facts and executed that exact download. The result identifies PGlite 0.5.8, PostgreSQL 18.3/WASM. The owned in-memory instance closed in finally. No native or existing database was accessed. `sql-results.json` records all values and rejection SQLSTATEs; `technical-sources.md` maps primary documentation to claims.

Verified all eight effective/recorded combinations against PostgreSQL and the figure model. Counterexamples expose overlapping assertions without exclusion, two inclusive prices at one boundary, a legal gap despite non-overlap, a future version selected by unbounded effective end, extra rows without recorded-time filtering, references still accepted to flagged rows, required-reference deletion/null rejection and conflicting restoration under live-row uniqueness. No concurrency schedule is presented as an observed execution.

## Rendered page and controls

Checked owned preview `http://127.0.0.1:4620/review/article/` using CUA under root’s browser lease. All five figures were visually inspected at 1280×720 and 375×720 in light and dark. Their labels, panels, captions and controls stayed legible; narrow panels stack. At 375 px the document scroll width was 375 and each figure’s width/scroll width was 343: no page or figure overflow. SQL regions use the supplied scrollable component.

Every option in Figure 2 and all eight option combinations in Figure 3 were exercised; their explanations and named matching assertions agreed with the verified SQL results. Keyboard ArrowDown/Enter changed the native select. Both price text alternatives opened, contained the full explanation and closed.

Figure 5: checked every manual state, Back, Next, Reset, Play/Pause and Replay. Let complete automatic playback reach 5/5 and Replay. Enter activated Next; focus remained visibly outlined, and end controls used aria-disabled. Opened and read the complete text alternative. Changing text is marked data-live; step explanation uses aria-live=polite. Reset and stopped before closing the tab. Browser warning/error log was empty.

Computed token colours were read in the page for both themes. Contrast calculation in `contrast.json`: text on figure surface 13.73:1 light / 10.89:1 dark; secondary text 6.05 / 6.15; accent 5.52 / 8.77; strong accent 8.07 / 10.82. Meaning also uses labels, borders and line style. The shared player disables its hold-bar animation when reduced motion matches, checked in source; reduced-motion emulation and a screen reader were not available in this CUA session, so neither is claimed as an observed check.

Saved representative screenshots in this directory: Figure 3 desktop light/dark and mobile light/dark; mobile dark deletion failure. Browser viewport restored to 1280×720 and theme System, all players stopped, all five owned tabs closed, lease released to root. User tabs preserved.

## Compilation and delivery

Root reported the first complete compilation passed. A final stable compilation was requested after removing the redundant wrapper and simplifying Figure 2 labels; root owns its result and integration. No local pnpm, dependency installation, server launch, infrastructure edit, commit or publication was performed by this writer.

`source-hashes.json` records exact commissioned inputs and delivered source/download hashes. Remaining independent review belongs to root after freezing this version. The model and SQL are illustrative scoped examples; production correction concurrency, external deletion execution, legal policy and backup restoration were not implemented or claimed.
