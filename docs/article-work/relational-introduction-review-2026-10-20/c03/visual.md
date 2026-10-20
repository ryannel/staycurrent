# Visual review · article · a00 Relational databases · c03

Inputs read: the rendered page at http://localhost:4443/review/relational-next/ (build c03) in the built-in browser, at 800 × 600 and the 375 × 812 mobile preset, in light and dark colour schemes; my c02 report and the coordinator's list of accepted findings and other changes. Not read: the article source, plan, context files, writer notes and other reports, including the editorial, practitioner and teaching reports already in this folder. This is a narrow recheck: only the items this round changed were examined, and no new first-reading record was made, because no item is new.
Verdict: pass

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | not applicable | No new items; the changed figures were re-read in place. |
| 2. Form fits the content | pass | The order numbers are now consistent. Figure 5 holds 101–103 and 105–113, with 104 absent because Arun's attempt was refused; its customer 1 rows are still 101, 103 and 109 on pages 1 and 3. Figure 6 uses 114 and 115, which clash with nothing. |
| 3. Readable at a glance | pass | c02 visual-1 and visual-2 are fixed. Column headings no longer wrap at underscores at 800 or 375 px; narrow result tables scroll inside their wrapper. The order 103 listing ends at `RETURNING available;`, and the COMMIT or ROLLBACK choice is stated in the sentence after it. |
| 4. Interaction | pass | c02 visual-4 is fixed. Figure 2's key now says that accent outlines mark changes and red outlines mark facts that disagree. The shop caption explains the dashed underline on foreign-key values. Figure 6's longer step labels ("Old version places an order", "… another order") follow the branch, and every step still agrees with its caption. |
| 5. Themes and phones | pass | c02 visual-3 is fixed. The light-theme warning text measures 5.88:1 (7.68:1 in dark), the NULL in the shop tables 6.61:1 (6.83:1), and Figure 1's struck-through order 102 row now passes 4.5:1 in both themes. No text in any figure falls below 4.5:1 in either theme. Nothing overflows the page at 375 px, and Figure 3's longer row text wraps legibly. |

## Findings

None.

## Limits

- Narrow scope: I examined the shop tables, the order 103 listing, Figures 1, 2, 3, 5 and 6, and the captions of Figures 2, 4, 5 and 6. Figures 4 and 7 were checked only for their captions and contrast; their interaction was not re-run.
- Contrast was computed from computed colours and the nearest opaque background. A first pass mis-read `color(srgb …)` values; the figures above come from a corrected pass. Anti-aliasing is not accounted for.
- The Browser pane was hidden, so playback timing and animation were not re-checked this round.
- The order 103 listing still scrolls sideways at 375 px because of its long INSERT lines, as other code examples do. With the branching comments gone, nothing essential is hidden past the edge.
