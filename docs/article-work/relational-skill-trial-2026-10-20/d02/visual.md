# Visual review (recheck) · article · a00 "Relational databases" and a03 "Making concurrent changes correct" (trial versions) · f786105, round d02

Inputs read:
- The rendered trial pages at `/review/relational-trial/` (a00) and `/review/relational-trial/transactions/` (a03), served by `STAYCURRENT_REFERENCE_PREVIEW=1 pnpm astro dev --port 4411` at f786105.
- The reference articles' routes, available but not re-read beyond round d01.
- `.agents/skills/staycurrent-figures/SKILL.md`.
- `d01/repair-decisions.md`, for the scope of each accepted repair.
- My own `d01/visual.md`.

Not read: the writers' notes, the plan, the live drafts, and the other d01 and d02 reports.

Verdict: a00 pass; a03 pass

## Status of d01 findings

| Finding | Piece | Status | Evidence |
| --- | --- | --- | --- |
| visual-1 | a00 | fixed | The table now has four rows, the last one "Mina's and Tariq's orders are written at the same time". The prose says the transaction solves "the first two rows" and "does not … solve the last row". `visual-a00-table-what-happens.png` |
| visual-2 | a00 | fixed | Reached rows and changed values now get a 2 px outline, a 5 px left bar on the first cell, and bold text. Outline against the row or panel background: 6.03:1 light and 9.74:1 dark (Figures 1, 3 and 4). The old fill is kept, inside the outline. `visual-a00-fig1-outline-light.png`, `visual-a00-fig3-step5-dark.png` |
| visual-3 | a00 | fixed | Outcomes read "Refused: foreign key violation (23503)" and so on. The rule column now says only "None declared". `visual-a00-refusals-table.png` |
| visual-4 | a00 | fixed | The table is transposed: one value per cell, a "Rows for one customer" row, right-aligned numbers, and an observed-on caption above. `visual-a00-page-counts-table.png`. The prose that points into it is in visual-15. |
| visual-5 | a00 | fixed | The boundary note explains why order 104 is absent. The time labels are "After failover" and "After repair". The restored copy is drawn as chips, with "106 absent". `visual-a00-fig4-after-repair.png` |
| visual-6 | a00 | fixed | The explanation and the text alternative now say "matches the hand calculation", with no direction. |
| visual-7 | a00 | fixed | At 375 px nothing in a00 scrolls sideways, in either theme. This covers Figure 1's tables, the receipt result and all listings. `visual-a00-fig1-375-dark.png` |
| visual-8 | a03 | fixed | Figure 1's customers are 1 Mina Shah, 2 Tariq Aziz and 3 Edda Berg, matching a00 Figure 1. Tariq (customer 2) holds R7. The instructors are now Lena and Ravi. "Arun" appears nowhere on the page. All schedules use Mina and Tariq as the competing customers. The figure is no longer called "the shop from the introduction". `visual-a03-fig1-1280.png` |
| visual-9 | a03 | fixed | `classes` now spans the full row. No table is wider than its box at 375, 600, 768, 900, 1024 or 1280 px, and every header reads in full. `visual-a03-fig1-768.png`, `visual-a03-fig1-1280.png` |
| visual-10 | a03 | fixed | No text in Figure 4 now falls below 4.5:1 in either theme, at the uncommitted step or the final step. The uncommitted-version dashed outline measures 6.61:1 light and 6.83:1 dark. |
| visual-11 | a03 | fixed | Row labels start at 1, so the counter and the highlighted row agree on every step of Figures 2, 3 and 5. For example, 7 / 7 is row 7. |
| visual-12 | a03 | fixed (accepted scope) | On desktop the move listing is formatted one clause per line, and every guard (`AND class_id = 21`, `AND remaining > 0`) is visible without scrolling. Figure 4's statements are unchanged. At 375 px only comment lines are clipped (see visual-16). `visual-a03-move-listing.png` |
| visual-13 | a03 | fixed | Bookings show their owners: "R7 Tariq, R10 Mina, R11 Mina". |
| visual-14 | a03 | fixed | The check query is followed by its observed result (21: 1, 1, 0, t; 22: 3, 2, 1, t). `visual-a03-check-result.png` |

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | The new a03 Figure 5 stands on its own: the deadlock, the abort, the 25P02 error, the retry and the queued run can all be read from the table. |
| 2. Form fits the content | pass | Names, keys and rows now agree across a00 and a03. Figure 5 reuses the growing step table, with committed state in the last three columns. |
| 3. Readable at a glance | finding (optional) | One a00 sentence still points at a "last column" after the table was transposed (visual-15). Figure 5's first option is named differently in the prose (visual-17). |
| 4. Interaction | pass | Every option and step of Figure 5 was run by click and by keyboard, and the other figures were rechecked by keyboard. Back and Next keep focus at both ends, Pause works, and the select changes by keyboard. Figure 5 holds each step 3.5–10 s. |
| 5. Themes and phones | finding (optional) | All repaired contrasts pass. At 375 px, a03's new "Choosing a protection" table hides its last column off the right edge, and listing comments are clipped (visual-16). |

## First reading

**a03 Figure 5, "The same two moves, two lock orders"**, read before its prose.

- **Layout.** A "Lock order" select with two options: "Each locks its own source class first" and "Both lock class 21 first". Above the table sits a rule line, "class 21: left + booked = 1; class 22: left + booked = 3". The table has columns Step, A · Mina moves R8 to 22, B · Tariq moves R7 to 21, 21 left, 22 left, and Bookings. The figure opens on the starting rows: 0 left in 21, 2 left in 22, R7 in 22 and R8 in 21. `visual-a03-fig5-first-reading.png`
- **First option (12 steps).** Each move locks its own class, then asks for the other. Rows 4 and 5 show the two waits in italics, "waits for B" and "waits for A", which makes the cycle visible without a drawing. Row 6 shows Mina's "Error 40P01: deadlock detected" in red. Tariq gets class 21, and Mina's next statement fails with 25P02 before she rolls back. Tariq's move then finds 21 full ("UPDATE 0") and rolls back. Mina reruns her whole move, which commits. The final state reads 21: 1 left; 22: 1 left; R7 in 22, R8 in 22, and the verdict line says "Rule holds". `visual-a03-fig5-opposite-order-end.png`
- **Second option (10 steps).** Tariq waits on class 21 before holding anything. Mina locks 22, moves and commits, then Tariq locks both rows and moves. Both commit, ending at 21: 0 left; 22: 2 left; R7 in 21, R8 in 22. `visual-a03-fig5-same-order-end.png`
- **Clarity.** Both outcomes were clear, and the committed values that changed are marked in bold.
- **Where I was unsure.**
  - Both options end with "Rule holds". The difference in what each customer got (Tariq refused in the first, both moved in the second) is visible only in the cells and the last explanation, not in the verdict.
  - The step-12 row compresses a whole rerun transaction into one cell.

  Neither needs repair: the table shows both.
- **Phone and theme.** At 375 px in dark theme, the table becomes one stacked card per step and reads correctly. `visual-a03-fig5-375-dark.png`
- **Text alternative.** "Read this figure as text" states both final states.

Read in place, the prose says "Step through the opposite-order run, then switch to Both lock class 21 first". The second name matches its option label; the first does not (visual-17). Everything else in the prose agrees with the figure: Mina as victim, 25P02, Tariq's business rejection, and Mina's rerun committing.

## Findings

### visual-15 · optional · a00, the paragraph after the page-count table ("The work behind a query")

Problem: The table is now transposed, so the with-index results are its last row. The prose still begins "The last column carries a second lesson. With an index on customer_id…". The last column is now the 1,000,000-orders column.
Effect: The reader looks down the 1,000,000 column for the index lesson and has to work out that the sentence means the bottom row. They can recover, because the 1,004 figure is in that column too, but it costs a pause.
Repair: Change it to "The last row carries a second lesson", or name the row: "The with-index row…". Screenshot: `visual-a00-page-counts-table.png`.

### visual-16 · optional · a03, "Choosing a protection" table and listing comments at 375 px

Problem: At 375 px the new five-column "Choosing a protection" table is 432 px wide inside a 343 px column. Its last column, "What the loser sees", is entirely off-screen, with no sign that the table scrolls. The four listings still scroll at this width. Only comments and long `INSERT … (request_id, class_id, owner_id)` lines are clipped; no guard is hidden.
Effect: A phone reader of the selection table misses the failure behaviour of each protection, which the prose says is part of the choice ("the choice of protection is also a choice of failure behaviour").
Repair: At narrow widths, stack each protection as a small card with labelled fields (the same pattern the Figure 2 and Figure 5 tables already use at 375 px), or drop the "Rule shape" column into the row heading. Wrap the long comment lines in the listings. Screenshot: `visual-a03-choosing-table-375.png`.

### visual-17 · optional · a03, Figure 5 option label and the prose

Problem: The prose asks the reader to "Step through the opposite-order run". The option is labelled "Each locks its own source class first", and nothing on the figure says "opposite order".
Effect: The reader has to map one name to the other before starting. The mapping is easy, but the second option shows that matching names work: the prose and its label both say "Both lock class 21 first".
Repair: Label the option "Opposite orders: each locks its own source class first", or use the option's label in the prose.

## Limits

- **Hidden pane.** The built-in browser pane was hidden again, so all rendering, interaction, keyboard, timing and contrast checks used headless Chromium over the DevTools protocol against the same dev server. Timing comes from the page's own timers at real speed.
- **Keyboard method.** Each control was focused programmatically and then driven with synthesised key events. I did not tab through the whole page.
- **Contrast coverage.** Contrast was measured for the repaired highlights and outlines, and for all text in:
  - a00: Figure 3 at step 5 and Figure 4 at the final cleanup step.
  - a03: Figure 4 at steps 3 and 5.
  - a03: Figure 5 at steps 6 and 12 (first option) and step 10 (second option).

  Both themes were measured. Other steps were not measured individually. Disabled Back and Next buttons are below 4.5:1 but are exempt as inactive controls.
- **Not checked.** Only figures, tables and listings were rechecked. The correctness of the new move listing and the observed outcomes belongs to the practitioner perspective.
