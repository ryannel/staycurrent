# Visual review (narrow recheck) · article · a03 "Making concurrent changes correct" and a00's text fix (trial versions) · 5a49e8c, round d03

Inputs read:
- The rendered trial pages at `/review/relational-trial/transactions/` (a03) and `/review/relational-trial/` (a00), served by `STAYCURRENT_REFERENCE_PREVIEW=1 pnpm astro dev --port 4411` at 5a49e8c.
- `.agents/skills/staycurrent-figures/SKILL.md`.
- My own `d02/visual.md`.
- The file list of commit 5a49e8c, used only to see which components changed (`ScheduleFigure.astro` and the a03 model).

Not read: the writers' notes, the plan, the live drafts, and the other reports.

Verdict: a00 pass; a03 repairs required

## Status of d02 findings

| Finding | Piece | Status | Evidence |
| --- | --- | --- | --- |
| visual-15 | a00 | fixed | The paragraph now reads "The last row carries a second lesson…", which matches the transposed table. `visual-a00-page-counts-table.png` |
| visual-16 | a03 | partly fixed | The fix holds below 601 px but breaks the table on desktop. Details below. |
| visual-17 | a03 | fixed | Figure 5's options are now "Opposite lock orders" and "Both lock class 21 first". The prose says "Step through Opposite lock orders, then switch to Both lock class 21 first", and the boundary note and the paragraph after the figure use the same name. The hidden single-option example select has been removed: every select in Figures 2–5 is visible and has at least two options. `visual-a03-fig5-labels.png` |

visual-16 in detail:
- **Fixed below 601 px.** From 375 to 600 px the "Choosing a protection" table stacks into one card per protection. Each card has a heading and labelled fields ("Rule shape", "Relies on", "Every writer", "Loser sees") and fits the column with nothing hidden, in both themes. `visual-a03-protection-cards-375-dark.png`, `visual-a03-protection-cards-600-light.png`
- **Fixed for listings.** No listing overflows at 375 px or at 1280 px. The long comments now wrap onto continuation lines. `visual-a03-move-listing-375.png`, `visual-a03-failed-attempt-listing-375-dark.png`
- **New problem on desktop.** From 601 px upwards the table now overflows its column (see visual-18).

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | No new figure. The changed labels in Figures 3 and 5 read clearly. |
| 2. Form fits the content | pass | The protection names match between Figure 3's control and the table, as the table's caption says. The cards keep one kind of value per labelled field. |
| 3. Readable at a glance | finding | On desktop the protection table's last column is cut off (visual-18). |
| 4. Interaction | pass | Every option and every step of Figures 2, 3 and 5, whose shared component changed, was run by click and by keyboard. Enter and Space work on Next and Back, focus stays on the button at both ends, and Pause works. Each select changes by keyboard type-ahead and resets the stepper to step 1. Figure 5 holds each step 3.4–10.6 s. Step labels match the counter. Text alternatives state every outcome. |
| 5. Themes and phones | finding | No text fails 4.5:1 in either theme at 375 or 1280 px, including the card labels; only inactive Back and Next buttons fall below. The protection table overflows at 601–1920 px (visual-18). The check-result table still scrolls slightly at 375 px (visual-19). |

## First reading

No new figure in this round. Only the changed controls were seen again before their prose:
- **Figure 3's Protection select.** It now offers:
  - for the last-place example: "No protection", "One conditional statement" and "Run at Serializable";
  - for the double-click example: "Application check only" and "Unique constraint";
  - for the staffing example: "No protection", "Lock the rows you counted", "Lock the class row first (coordination row)" and "Run at Serializable".

  These labels are clear and are the names the protection table uses.
- **Figure 5's Lock order select.** It offers "Opposite lock orders" and "Both lock class 21 first". Both names say what differs between the runs.

## Findings

### visual-18 · required · a03, "Choosing a protection" table at 601 px and wider

Problem: Above the card breakpoint, the table is 687 px wide inside a 640 px column (at 601 px it is 687 inside 569). It scrolls sideways at every width from 601 to 1920 px. The fifth column, "What the losing request sees", is cut to "What t…", and its cells show only their first few characters ("Waits, …", "Error 2350…"). In round d02 the same table fitted at 768–1280 px. The longer header and the longer "Run at Serializable" text added in this repair pushed it over.
Effect: On the layouts most readers use, the column the prose calls out ("the choice of protection is also a choice of failure behaviour") is hidden behind a sideways scroll, with no sign that the table scrolls. This is the same kind of loss that d01 visual-9 had in Figure 1.
Repair: Make the table fit 640 px. Options:
- Use the card layout up to the full column width.
- Shorten the last header back to "What the loser sees".
- Move the `default_transaction_isolation` note out of the "What every writer must do" cell into a footnote under the table.
- Let the narrow "Rule shape" column wrap less by giving "What every writer must do" less width.

Then check that no column scrolls at 601, 768 and 1280 px. Screenshot: `visual-a03-protection-table-1280-clipped.png`.

### visual-19 · optional · a03, check-result table at 375 px

Problem: The result table under the final check query is 363 px wide in a 343 px column at 375 px. The last header reads "rule_hold…" and its values sit at the clipped edge. I did not report this in d02.
Effect: The column the query exists to show is partly cut on a phone. The values ("t") remain visible, so the loss is small.
Repair: Let the numeric columns narrow (they are one or two digits), or allow the header `rule_holds` to wrap at the underscore at narrow widths. Screenshot: `visual-a03-check-result-375.png`.

## Limits

- **Hidden pane.** The built-in browser pane was hidden, so rendering, interaction, keyboard, timing and contrast checks used headless Chromium over the DevTools protocol against the same dev server. Timing comes from the page's own timers at real speed.
- **Keyboard method.** Each control was focused programmatically and then driven with synthesised key events, without tabbing through the whole page. Arrow and End keys on a focused select open the native popup in headless macOS, so I confirmed select changes by type-ahead letters instead.
- **Contrast coverage.** Contrast was measured for all page text at 375 and 1280 px in both themes, with the figures at their opening step. Figure states first measured in d02 were not measured again, because their styles did not change in this commit.
- **Not checked.** Only a03 and a00's one changed sentence were rechecked, as the coordinator asked.
