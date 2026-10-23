# Rendered mechanical receipt

This is the author's rendered/mechanical check, separate from author-teaching-notes.md and from the coordinator's independent review.

## Preview and environment

Checked the complete article at http://127.0.0.1:4360/review/relational-full-reference/ in a dedicated Chrome tab. r02 was first inspected; r03 verified table/contrast repairs; r04 verified the final local SQL scroll repair and current source. Reloaded each refreshed build before checking. The coordinator built and served the previews; the writer did not build or serve the site. The coordinator reported that the normal build and all 13 site-check rules pass.

Desktop viewport: 1488 × 973. Phone viewport: 375 × 812. Explicit light and dark themes were checked. At completion the viewport override was reset, returning to 1488 × 973, and the System radio was selected; the current system renders dark. The browser's data-theme attribute is dark when System resolves to dark, so the checked System radio, rather than absence of that attribute, confirms restoration. The original reference-research tab had expired; a fresh dedicated author-check tab was used.

## Results

- Complete body: rendered headings/contents and all nine teaching sections plus sources are present. The preview remains marked as a draft for review. Every internal relational link in the article (29 occurrences, 24 unique) matches a supplied child-reading metadata destination.
- Figure 1: all four tables, identifiers, highlighting, relationship labels and before-order-103 stock caption inspected on desktop and phone, light and dark. Customers/orders stack on the phone. The wider order-line table remains inside the 343 px reading width and scrolls to its final column.
- Figure 2: all five states for each of the two options checked in the rendered DOM, including stock and order outcomes, accumulated event trace, narrative and boundary button states. Unsafe ends with stock 0 and orders 103/104; protected ends with stock 0 and only 103. Switching protocol resets to the start. Next, Back and Reset work; Back/Next retain focus with aria-disabled at the ends. Play changes to Pause; Pause stops playback; Replay resets to the initial state. A timed run advanced from 1 / 5 to 2 / 5 after ten seconds. The native select was exercised through both options; Enter activation, Tab focus order and focus visibility were checked on buttons. Both histories as text expands and collapses, and includes the complete histories.
- Figure 3: memory, persistent log, success boundary, lost-reply qualification and later pages inspected on desktop and phone, light and dark. Its rows stack at phone width without clipping.
- SQL/results: the exact query/result and conditional UPDATE render; the phone SQL listing scrolls horizontally at its labelled focusable region. Final wrapper client width 343 px, content width 427 px, with actual keyboard-induced horizontal movement and visible focus. The result/recovery/choice tables use the same labelled wrapper pattern, with phone client width 343 px and table content width 544 px. The phone document width remains 375 px; desktop document width remains 1488 px.
- Contrast: computed foreground/background sampling after the light-theme repair gave a minimum 5.46:1 among sampled dark text and 6.05:1 among sampled light text. Samples included table text, captions, relationship labels, race labels, counters, Play/select controls and commit labels/qualification. The repaired lost-reply text is 12.10:1 dark and 15.00:1 light. This is a targeted check of figure text, not a whole-site contrast certification.
- Console: no warnings/errors were returned for the author-check tab.

## Repairs discovered by the author check

The inherited table and SQL styles originally made their inner content scroll while keyboard focus belonged to the outer labelled wrapper. Owned styles now move horizontal overflow to the focusable wrapper; no shared file changed. The lost-reply qualification originally used a light-theme accent colour that needed stronger contrast; it now uses the normal text token at weight 600. These repairs changed no SQL, fixture facts or protocol outcomes.

## Limits

Screenshots were visually inspected through the browser tool; there are no separately saved image files. No screen-reader session, browser zoom matrix or print check was run. The system's reduced-motion preference was false; the shared stepper's documented reduced-motion hold-bar path was retained but not emulated in this browser. Protocol choices were tested through the native select automation; the full operating-system popup keyboard-selection path was not established, although focus and keyboard button/scroll use were checked. Native database evidence covers the stated query and purchase protocols only, as detailed in writer-record.md and native-check.json.

Final source is ready for the coordinator's fresh commissioned review. No further source changes or preview rebuild are pending. Source hashes are in final-source-hashes.json.
