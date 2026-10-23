# Repair v2 · mechanical receipt

23 October 2026. This records checks and their limits, separately from the repair/continuity judgement in `../repair-record-v2.md`.

## Source and preview

- Root owns builds and serving. The repaired draft was checked on r06 at `http://127.0.0.1:4362/review/relational-full-reference/`, then reloaded as r07 after the last two edits. Root reports that its direct check of the actual draft page against the existing structure rules has zero issues. This writer ran no site build, server or publication operation.
- r07 differs from r06 only in the new stock-column separator colour and the D3 sentence making the application the sender of parameter values. r06 control/layout observations remain applicable; r07's two affected areas were rechecked. Final source hashes are in `repair-v2-data-check.json`, recorded at 17:38:13 UTC.

## Rendered observations

- Dedicated Chrome tab; desktop default viewport measured 1488 × 917; temporary phone viewport 375 × 812. New first table and identifier path inspected in light and dark at both widths. The first table fits within the phone page; the order-line table retains local horizontal scrolling. Page-level horizontal overflow was false at both widths.
- At phone width, the line region measured 309 px wide with 382 px of content. Keyboard Right reached `scrollLeft = 73`, exposing `unit_price` and its two values. Native tables have captions and column headers. The outlined product row, named stock column, and written matching values also carry the explanation in text.
- All five states of both stock protocols were exercised. Next was operated with both clicks and Enter; Back and Reset were exercised with Enter. Protocol selection used the native select's automation API. The page reset to state 1/5 when switching protocols. The two full text histories were expanded and read; their labels remain paragraphs, outside the heading outline.
- Play changed to Pause; timed playback advanced from 1/5 to 2/5. Pause returned the Play state. At the final state Replay returned to 1/5 and began playing. The changed buyer labels and control label were inspected at phone and desktop widths, light and dark. No control implementation or timing changed.
- DOM check on the final page found zero heading elements inside figures. Figure captions/references now run 1–4. The commit drawing has only a numbering change; its displayed labels were checked.
- The final request paragraph and its following reading routes were inspected at desktop and phone widths. The entire final rendered article, including contents, captions, controls and Sources, was reread in two untruncated text slices totalling 32,181 characters after r07 loaded. The text history had also been read in full while expanded.
- Targeted final contrast samples: text at least 6.05:1 in light, 6.15:1 in dark across the sampled table text, table captions, figure notes, connection labels and buyer labels. Identifier outlines were 4.36:1 light and 8.16:1 dark against their panel background. The new stock-column separator was initially below 3:1, was repaired, and remeasured at 5.75:1 light and 5.49:1 dark. These are selected computed-colour measurements, not an exhaustive pixel audit.
- No warning/error entries were returned by the browser log check after loading r07.

## Data/evidence applicability

`repair-v2-data-check.json` compares the new derived opening stock display with the previously observed protected terminal state in `../native-check.json`: P3 10, P7 0, P9 4. It also compares all four displayed history rows with that file's observed history result. Both comparisons passed.

The base customers/products/orders/items exports, exact history and reserve SQL, race data/protocols and native verifier remain unchanged. `data.mjs` has one added derived display export, `productsAfter103`. Existing native query, fan-out, unsafe outcome, observed lock-wait/protected outcome and rollback evidence remains applicable to those unchanged claims. No new engine run is claimed. No database was started or contacted in this repair.

## Limits and restoration

No screen-reader session, zoom matrix, print check or reduced-motion emulation was performed. The full operating-system popup keyboard-selection path was attempted but not established; keyboard button activation and horizontal table scrolling were established. Screenshots were inspected through the browser tool and were not saved as separate files. Native evidence remains limited to its named query/concurrency outcomes; it establishes no performance, crash, network, replica or recovery-time behaviour. These mechanical observations establish no independent teaching/editorial judgement.

System theme was restored and its checked state confirmed. The viewport override was reset through the browser API; the resulting default measured 1488 × 917. The sole Chrome lease is released on return.
