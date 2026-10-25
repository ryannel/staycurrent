# First stable authoring checks

Completed the normal full article reread and continuity pass, including captions, alternatives and control wording. Compared the central explanations with the fixed reference teaching: one schedule, observable change, directed reader attention, then its operational consequence. Ownership remains copied-history progress and single-copy read routing.

## Execution and model

- `node evidence/verify-sql.mjs`: passed. Owned in-memory PGlite 0.5.8, actual PostgreSQL 18.3/WASM version retained in `sql-result.json`; instance closed in `finally`. The fixture uses the relevant projection of shared tables, not a purported replica. Extracted the actual displayed SQL from article source. Confirmed P7 price22.00, unchanged stocks and P3/P9 prices, pending order 103, no payments, agreed mug 20.00 and total 29.00.
- `node evidence/verify-model.mjs`: results in `model-result.json`. Checks ordered prefixes, commit-replay visibility boundary, durable-but-unreadable counterexample, qualified successful targets, explicit unavailable failure and A→B regression versus retained C. Arithmetic rates use consistent MiB units. These checks exercise the authored model, not a real replicated cluster.
- No native fixture was required or claimed. No main-repository files, default database, native initdb or personal service was used. No install, server, build, commit or publication was performed by this writer.

## Rendered and control checks

Owned preview tab at `http://127.0.0.1:4652/review/article/` under the coordinator's browser lease. All four figures visually inspected at 375 × 720 and 1280 × 720, in Light and Dark. Figures 1–3 use the supplied shared stepper. All six progress states, all three routing paths and both three-state session alternatives were followed. Next, Back, Reset, Play, Pause and Replay were exercised; observed timed playback advance 1/6 → 2/6. Enter/Space operation of buttons and Enter operation of a text-alternative disclosure were checked. Native select alternatives were exercised with the supplied labels. Back/Next expose aria-disabled boundaries; changing explanations are polite live regions. All changing text is marked data-live.

No document or figure horizontal overflow at 375 px (document scroll width 375; each figure 343) or 1280 px (document scroll width 1280). No duplicate IDs. Sources disclosure initially closed. No warning/error console entries. Figure labels remain text rather than section headings. Text alternatives carry each model path.

Author fixes found in these checks: routing primary status had been bound to the wrong output name; unavailable path now visibly says primary unavailable. Added explicit Before U / Through U / Through C labels and a solid/dashed legend, avoiding colour-only progress. Meaningful rate edges now have solid accent strokes; a pale tint alone does not carry the rate length. Initial session explanation now says Before the first read. Local confirmations retained unaffected checks.

Contrast checked from rendered theme colours: Light body 36/33/26 and secondary 93/88/77 against 240/237/229; Dark body 220/215/204 and secondary 168/162/148 against 38/35/32. Meaningful progress strokes use secondary text; accent strokes use theme teal/coral. Ratios are recorded in `contrast-result.json`. Decorative panel boundaries are not used as the sole carrier of state.

Screenshots retained: desktop-light-progress.png, mobile-light-progress.png and corrected mobile-light-routing.png. Screenshot selections are evidence of layout, not a comprehensive visual regression suite. No screen-reader session, OS-level reduced-motion toggle or real replication execution was performed. Shared player owns reduced-motion hold-bar behaviour.

After UI work: stopped playback, restored System theme and default 1280 × 720 viewport, closed all owned tabs and released the lease. Root reported the initial compilation passed; sources changed during authoring, so the final stable compilation is requested from root. Exact inputs and authored-source hashes are in `source-hashes.json`.

Ready for the coordinator to freeze the first version and commission its independent review. No independent review has yet been claimed.
