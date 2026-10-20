# Visual review · article · a00 Relational databases · c02

Inputs read: the rendered page at http://localhost:4442/review/relational-next/ (build c02) in the built-in browser, at 800 × 600, the 375 × 812 mobile preset, and light and dark colour schemes; my first-reading record of the new and changed items, `visual-first-reading.md`, written before the prose around them was read (one slip is noted there); the reference articles on the same server, at the paths used for c01; my c01 report and the coordinator's list of accepted findings. Not read: the article source, plan, context files, writer notes and other reports.
Verdict: pass

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | The shop tables, new Figure 3 and every changed figure stood alone on first reading. The only uncertainties were small (visual-2, visual-4). |
| 2. Form fits the content | pass | c01 visual-1, -2 and -3 are fixed: four tables with keys and links; Figure 5 finds customer 1's orders among unordered rows; Figure 6 shows orders as rows and the next order's outcome. Figure 3 suits a schedule well. |
| 3. Readable at a glance | finding | c01 visual-7 (labels) and visual-8 are fixed. Column headings break at underscores (visual-1). The new transaction listing's branch is only in comments, which are cut off on a phone (visual-2). |
| 4. Interaction | pass | c01 visual-4, -5 and -6 are fixed. Changes are outlined, last steps show the retry or recovery choice, playback runs at 4–10 s a step and ends on Replay with focus kept, and step labels follow the branch. |
| 5. Themes and phones | finding | Nothing overflows at 375 px. Light-theme warning text is 4.28:1, and the muted NULL and struck-through cells fall lower (visual-3). |

## Findings

### visual-1 · optional · Table column headings in the shop tables and Figure 1

Problem: Column-name headings wrap at their underscores. At desktop width the order_items heading reads "unit_price_" / "gbp". At 375 px the shop tables show "shipped_" / "at" and "unit_price_" / "gbp", and Figure 1's joined result shows "order_" / "id", "product_" / "id" and "unit_" / "price_" / "gbp".
Effect: An identifier the reader must type exactly looks like two or three words. The SQL beside it uses the unbroken name, so the reader has to join the pieces in their head.
Repair: Keep identifiers in headings unbroken (no wrapping inside a column name). Let a narrow table scroll sideways inside its existing wrapper instead.

### visual-2 · optional · Order 103's transaction listing (Transactions and competing buyers)

Problem: The listing always ends in `COMMIT;`. Whether to commit or roll back is stated only in two comment lines above it ("One row back … commits", "No row back … sends ROLLBACK instead"). At 375 px those comments are cut off at the scroll edge ("so the ap…", "sends ROL…"), so the branch cannot be read without scrolling sideways.
Effect: Read or pasted top to bottom, the listing commits the order and item even when no mug was reserved: the partial state Figure 2 warns against. On a phone, the line that prevents that is hidden.
Repair: Make the ending visibly conditional, for example two short labelled endings (`-- one row returned:` `COMMIT;` / `-- no row returned:` `ROLLBACK;`), or end the listing at `RETURNING available;` and put the two endings in the sentence after it. Keep comment lines short enough to fit a phone.

### visual-3 · optional · Light-theme contrast of warning and muted text (Figures 1, 2, 6, 7 and the shop tables)

Problem: In the light theme, the warning colour measures 4.28:1 on small text: Figure 2's mismatched "1" values, Figure 6's "Order 106 rejected: null value violates the not-null constraint" and "NULL · rejected", and Figure 7's "Lost". The italic NULL in the shop tables measures 3.44:1 (3.94:1 in dark). Figure 1's struck-through or unmatched order 102 row measures 3.15:1 (3.54:1 in dark), and that row carries the LEFT JOIN branch's point.
Effect: All of it is readable on a good screen. But these are exactly the values each figure's outcome turns on, and they are the faintest text in it.
Repair: Darken the light-theme warning colour enough to clear 4.5:1. Raise the muted NULL and unmatched-row colour, and keep the italic or strike-through as the distinguishing mark rather than low contrast.

### visual-4 · optional · Marks without a key (shop tables, Figure 2)

Problem: Foreign-key values in the shop tables (1, 2, 101, MUG, TEA) have a dashed accent underline that looks like a link but does nothing, and the caption does not mention it. Figure 2's caption says "Outlined values changed at that step", but at the last step of the failure branch the red outline marks a mismatch: stock stays 1.
Effect: Readers may click the underlined values, or wonder what they mean. The red outline contradicts its key, though the banner below explains it.
Repair: Add the dashed underline to the shop caption ("underlined values are foreign keys"), or drop it, since the FK badges already mark the columns. Extend Figure 2's key: "red outlines mark facts that disagree".

## Limits

- The Browser pane was again hidden, so animation could not be judged. Playback hold times (Figure 2: 3.8–5.9 s; Figure 6: 6.7–10.4 s) were measured with page timers that ran on time; Figures 1, 4, 5 and 7 were stepped but not timed.
- My first reading of the first query's result table was not fully isolated: one screenshot also showed the sentence between the code and the table.
- Contrast was computed from computed colours and the nearest opaque background. It does not account for anti-aliasing, and the disabled-button opacity was excluded, as it was at c01.
- Keyboard checks covered Tab, Space and Enter on step buttons, with focus kept on aria-disabled Next at the last step and on Replay after playback. Select values were changed programmatically. No screen reader was used, and reduced motion was not tested.
- Technical claims in the new Figure 3 and the transaction listing were judged only for agreement with the surrounding prose; primary-source checking belongs to the practitioner perspective.
