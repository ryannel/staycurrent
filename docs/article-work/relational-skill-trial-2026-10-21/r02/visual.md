# Visual review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" · a6e6a33

Inputs read: the rendered pages `/review/relational-trial-2/` (a00) and `/review/relational-trial-2/transactions/` (a03), served by `STAYCURRENT_REFERENCE_PREVIEW=1 pnpm astro dev --port 4544` at a6e6a33 (server stopped afterwards); the reference articles' rendered figures at `/review/examples/sequences/`, `/review/examples/indexes/` and `/review/examples/storage/`; `.agents/skills/staycurrent-review/SKILL.md` and `perspectives/visual.md`; `.agents/skills/staycurrent-figures/SKILL.md`; `docs/coverage/relational-example.md`; `src/components/figures/stepper.mjs` (timing rule) and, to diagnose what I had seen, the import lines of `src/components/relational-trial-2/` and one line of `src/articles/relational-trial-2/a00.astro` (the hand-written index table). Withheld and not opened: the plans, the writers' work records, everything else under `docs/article-work/` (including the other r02 reports in this folder and r01), git history, `src/articles/relational-next/`, `src/articles/relational-trial/`, `src/components/relational-trial/`.

Method: headless Chromium driven over the DevTools protocol. Every top-level figure, table, listing and card list was captured at 1280 px and 375 px (375 with mobile emulation), in light and dark themes; every option of every stepped figure was stepped to its last step at 1280 light, 1280 dark, 375 light and 375 dark (162 captures per pass). Text contrast was computed for every visible text node in every figure state (every option, every step), every table, listing, card list and aside, in four theme modes: system light, system dark, `data-theme="dark"` under a light system, and `data-theme="light"` under a dark system. Keyboard use was driven with key events. Playback timing was read from the page's own `performance.now()` while playing. The Astro dev toolbar was hidden in captures.

Verdict: a00 repairs required; a03 pass (optional findings only)

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass | Every item stood on its own; see First reading. The two problems found there (visual-14, visual-15) are reported under their own checks. |
| 2. Form fits the content | a00 finding; a03 finding (optional) | a00: rows sit under real headings, keys are drawn (Figure 2), one table per relation; Figure 4's "blue-mug lines only" table omits order 102's blue-mug line (visual-15). a03: the anomaly and visibility card lists hold a 5 × 3 and a 3 × 3 matrix of short values that a table shows more directly (visual-16); the opening tables describe rather than draw their keys (visual-20). Running example otherwise matches the record: people, customer numbers, products, orders 101–104, payments 501–503, the 10:09/10:10/10:15 timeline, classes 21 and 22, R7–R11, Lena and Ravi, the swap. |
| 3. Readable at a glance | finding (optional, a00) | Listings are short, formatted and run in the order shown. At 375 px the refused-changes table breaks identifiers inside names (visual-17). Lane statements in a00 Figures 4 and 5 also wrap mid-expression ("stock >= / 1;") but stay legible. |
| 4. Interaction | a00 finding (required); a03 finding (optional) | Every control changes something; Back/Next keep focus with `aria-disabled` at both ends; options work by keyboard (arrow keys in a00's radio groups, Space in a03's pressed buttons) and keep focus; Play/Pause works by keyboard and pause holds. Playback holds measured 3.5–20.7 s per step, never under about 50 ms per character of the changed explanation. a00 Figures 1, 4 and 5 put the explanation a screen or more above the controls (visual-14). a03 Figure 5's fourth step shows nothing new (visual-19). |
| 5. Themes and phones | pass, with one optional note | No text below 4.5:1 (or 3:1 for large text) in any state in any of the four theme modes, including struck "dropped" rows, NULL markers, "(Tariq)" glosses, "waiting" and "uncommitted" markers. Arrows in a00 Figure 2 are 8.1:1 (light) and 10.8:1 (dark). No item overflows the article column at 375 px in any step; side-by-side tables and the Figure 2 diagram stack; listings scroll horizontally inside their own box, as in the references. Explicit `data-theme` overrides render the same as the system themes. |

## First reading

Recorded before reading the surrounding prose, from the figure alone and by operating it.

**a00 · Figure 1, "One order written as five separate changes".** A single-lane "Shop application" log above products, orders and order_items, with three Right/Wrong answers and a verdict sentence underneath. Stepping adds one statement per step (INSERT order, two INSERT lines, two stock UPDATEs) and flips the answers: steps 2–5 say "The stored facts contradict each other", step 6 agrees again. Clear on its own: the in-between states are wrong. Unsure: on reaching the controls I could not see the sentence that says what the step means; it sits at the top of a figure 1,083 px tall at step 6 (visual-14).

**a00 · Figure 2, "The shop's tables and the keys that connect them".** An entity diagram with PK/FK marks and arrows from each foreign key to its key, then the five tables with every row. Choosing Order 101/102/103 marks the linked rows with a bar and a "linked" chip. Stands on its own. Unsure only where payments.order_id and order_items.order_id share one trunk into orders.order_id; the T-junction reads correctly once noticed.

**a00 · Join listing and its psql output.** Order 103 joined to Mina's name and the product names; two rows. Clear.

**a00 · Refused-changes table.** Change, rule, PostgreSQL error code and constraint name. Clear at 1280 px; at 375 px identifiers break mid-word (visual-17).

**a00 · Mina's orders listing and output; the cancel-by-customer listing and its two-row output; the corrected cancel listing.** Clear; the second output shows the over-wide cancel (101 and 103).

**a00 · Figure 3, "What is still due on each order?".** Two query shapes. "Join everything, then sum" builds the joined rows (101 four times, 103 struck through as dropped) and ends on three Wrong lines: 2 of 3 orders, 79.00 for an order worth 39.50, 103 missing. "Sum each, then join" shows the two per-order totals, the left join with a NULL marker, coalesce, and three Right lines. Very clear; the best figure on the page.

**a00 · Figure 4, "Two customers, one blue mug".** A two-lane schedule for Mina (103) and Tariq (104) over the P7 stock row and an "order_items · blue-mug lines only" table. Read-then-write ends "Wrong · Mugs promised: 2 of 1"; the conditional update ends "Right · 1 of 1" with Tariq's UPDATE 0 and ROLLBACK. The waiting statement is marked "waited" with a dashed edge. Unsure: the "blue-mug lines only" table starts with "no rows", yet Figure 2 shows order 102 holding two blue mugs (visual-15); and again the explanation is far above the controls (visual-14).

**a00 · Parameter-binding listing (Node.js) and the full order transaction listing.** Short and clear; the first is labelled illustrative in its own comment.

**a00 · Figure 5, "Where the connection breaks".** Shop application and "Mina sees" lanes over P7 stock and orders. Three outcomes: reply arrives; break before COMMIT (rolled back, look up finds 0 rows, the whole transaction runs again); break after COMMIT (committed, look-up finds 103, confirm). Each ends with "Right · What Mina was told matches the database". Clear. Same explanation-placement problem (visual-14).

**a00 · Two EXPLAIN outputs, the CREATE INDEX listing and the with/without-index table.** Sequential scan of 1,268 pages against a bitmap scan of 3 pages; the report reads order_items either way; WAL 2.03 MB against 2.73 MB; index 230 pages. Clear. I was unsure whether order_items really occupies the same 1,268 pages as orders; a back-of-envelope row width (about 52 bytes with its line pointer, about 157 rows a page, about 199,000 rows) gives 1,268 for both, so it is plausible. Accuracy is the practitioner reviewer's.

**a00 · The failed ALTER and the five-stage expand/contract table.** Clear; the stage numbers carry the order.

**a00 · Figure 6, "Which recovery fits which failure?".** Three failures, three recovery cards, each with order 101/103 present or missing and a right/wrong/at-a-cost verdict; the fitting card is outlined. Clear at both widths and in both themes.

**a00 · Requirement/evidence, database-does/you-decide and reading-route tables.** Two-column prose tables; clear.

**a03 · Opening tables (classes, reservations, instructors).** Three small tables with PK/FK marks; R7 belongs to "2 (Tariq)". Clear, though the keys are only marked, not drawn, and customers are not shown (visual-20).

**a03 · Schema listing.** Four CREATE TABLEs; clear.

**a03 · Figure 1, "Mina's double click in class 22".** One lane, the committed classes and reservations, and two rule lines (✓/✗ with "rule holds/broken"). Separate statements end with class 22 at 0 remaining and 2 booked against 3; one transaction ends with COMMIT reported as ROLLBACK and the rule holding. Clear; the caption gives the outcome too.

**a03 · Figure 2, "Mina and Tariq book class 21's last place".** Four options, two lanes, committed rows and rule lines. Read-then-write commits R9 too (rule broken); subtract-one fails with 23514; the conditional update returns no row; Repeatable Read refuses with 40001 and the retry reads 0. Clear; the changed row is bold with an underline.

**a03 · "Compare your reasoning" prediction box.** Clear.

**a03 · Figure 3, "Lena and Ravi both ask to stop teaching class 21".** Repeatable Read lets both leave (0 available, broken); lock class 21 first declines Ravi; Serializable with whole retry declines; Serializable repeating only the write leaves nobody. Clear.

**a03 · Shape-of-rule table.** Three columns, short prose; clear.

**a03 · Complete booking listing, version-check listing, guard-row listing.** Short, commented, in run order; clear.

**a03 · Anomaly cards (Isolation levels).** Five cards, each listing Read Committed/Repeatable Read/Serializable with Yes/No/Refused. Readable, but I had to read across five cards to answer "what does Repeatable Read prevent?" (visual-16).

**a03 · Visibility cards (Snapshots).** Three statements × three moments; same shape, same effort (visual-16).

**a03 · Engine cards (How engines differ).** Seven cards with three sentence fields and an evidence line each. Cards suit this content.

**a03 · Outcomes table (Aborts and deadlocks).** Eight outcomes × three prose columns; long at 375 px but readable.

**a03 · Figure 4, "Mina and Tariq swap classes".** Lane headers say which class rows each move holds. Opposite order deadlocks (40P01, Tariq aborted), then Mina's move commits; ascending order serialises both moves and both rules hold. Clear.

**a03 · Move listing.** Clear.

**a03 · Figure 5, "Mina's booking when the reply to COMMIT is lost".** Four options. Book again and Look up R8 first both end "tells Mina: class full" while R8 is committed; Record R8 first ends with 23505 and "booked"; attempt lost ends with R8 committed once. Clear. Step 4 in every option changes only the sentence (visual-19).

**a03 · Email/outbox table.** Clear.

Read in place, every caption and boundary note agrees with what its figure shows, except a00 Figure 4's caption, which says the figure shows "mug lines" (visual-15). The prose instructions ("Step through Figure 1…", "Play it with Each statement on its own, then switch…", "Switch Figure 3 to…") name controls that exist with those labels.

## Findings

### visual-14 · required · a00 · Figures 1, 4 and 5: the step explanation sits a screen or more above the controls

Problem: In a00's stepped figures the sentence that says what the step shows, and the step's title, sit at the top of the figure, above the growing lane and the tables; Play, Back and Next sit at the bottom. Measured from the top of the explanation to the bottom of Next: at 375 × 812, up to 1,211 px (Figure 1, all 6 steps over one screen), 1,227 px (Figure 4, 6 of 13 steps over) and 1,259 px (Figure 5, 10 of 13 steps over); at 1280 × 900, up to 1,083 px (Figure 1, 4 of 6 steps over), 1,111 px (Figure 4, 3 of 13) and 964 px (Figure 5, 1 of 13). On a phone, Figure 4's final step puts the explanation 1.5 screens above the Replay button. a03's figures and the reference figures put the explanation directly above the controls (at most 173 px apart at 375 px), and a00's own Figure 3 stays under 600 px.
Effect: A reader pressing Next sees a statement appear in the lane but not the sentence explaining it, and must scroll up and back down at every step; with Play, the text that changes is off screen while the timer runs. The figures were built to be read step by step, and the explanation is what makes each step teach.
Suggestion: Move the explanation, with the step title, to sit immediately above the controls, below the frame, as in the reference figures and a03. Keep the Right/Wrong lines next to it.
Evidence: `visual-a00-figure4-explanation-far-375.png`, `visual-a00-figure1-explanation-far-375.png` (the red bar on the left edge is one 812 px phone screen).

### visual-15 · required · a00 · Figure 4: "blue-mug lines only" leaves out order 102's blue-mug line

Problem: Figure 4's order_items table is labelled "blue-mug lines only" and its caption says "Only the blue mug's stock and mug lines are shown", but it starts with "no rows" and ends with only 103 and 104. Figures 1 and 2, and the collection's example record, give order 102 (Tariq's) a line of 2 × P7. The final verdict "Mugs promised: 2 of 1" also counts only the two new orders.
Effect: A reader who has just followed the keys in Figure 2 meets a table that contradicts it, and has to work out that "blue-mug lines" means "lines added in this race". The skill requires the same rows wherever they recur.
Suggestion: Label the table and caption for what it shows ("lines for orders 103 and 104"), or show 102's line as an earlier, settled sale and word the verdict as "orders holding the last mug: 2".
Evidence: `visual-a00-figure4-mug-lines-vs-figure2.png` (Figure 4's last step beside Figure 2).

### visual-16 · optional · a03 · Isolation levels and Snapshots: matrix content shown as cards

Problem: The anomaly cards hold five anomalies × three levels, almost every cell "Yes", "No" or "Refused with 40001". The visibility cards hold three statements × three moments with equally short cells. As cards, the level values are repeated as labels inside each card, so comparing one level across anomalies means reading a label in each of five cards.
Effect: The section's question is "what does each level allow?", which a reader answers by scanning a column. Cards make that a search, and the familiar shape of an isolation table is lost.
Suggestion: Show each as a table: anomalies as rows with a one-line definition, levels as columns; move the Phantom/Repeatable Read sentence to a note under the table. Four short columns fit at 375 px. The engine cards should stay cards.
Evidence: `visual-a03-anomaly-cards-1280.png`, `visual-a03-visibility-cards-1280.png`.

### visual-17 · optional · a00 · Refused-changes table at 375 px breaks identifiers inside their names

Problem: At phone width the code cells break mid-word: "customer / s", "order_items_quantit / y_check", "orders_customer_id_ / fkey", "products_stock_chec / k".
Effect: The reader has to reassemble table and constraint names, which are the point of the column.
Suggestion: Let the names break only after underscores (for example with `<wbr>` after each underscore), or move the constraint name onto its own line in the error column.
Evidence: `visual-a00-refused-table-375.png`.

### visual-18 · optional · a00 and a03 · Two notations for the same things in one collection

Problem: The introduction and the transactions article draw the same ideas differently. Keys: boxed "PK, FK" chips (a00) against small "PK FK" text (a03). Options: radio rows (a00) against pressed buttons (a03). A waiting statement: "→ waited for Mina" with a "waited" chip and a grey dashed edge (a00) against an orange dashed bar and "waited for Mina" (a03). A changed value: a boxed cell and "new" chip (a00) against bold text with an underline (a03). Lanes: a ruled table headed "Time runs down the table" (a00) against stacked cards (a03). a03 follows the reference figures; a00 does not. The a03 model also keeps its own copy of the customers rather than importing the shared rows, though the values agree.
Effect: A reader who learns the notation in the introduction has to learn it again in the next article, and a03 says it builds on a00's race figure.
Suggestion: Bring a00's stepped figures onto the conventions a03 and the references use; doing so would also settle visual-14.
Evidence: `visual-collection-figure-conventions-1280.png` (a00 Figure 4, a03 Figure 2, reference Sequences Figure 2).

### visual-19 · optional · a03 · Figure 5: the fourth step shows nothing new

Problem: In all four options, step 4 ("Whatever happened, the service sees the same thing: a broken connection and no answer") changes only the sentence and moves the highlight off the COMMIT row; the service's lane stays empty.
Effect: The reader presses Next and sees no change in the figure. The point of the step, that both outcomes look identical to the service, is stated rather than shown.
Suggestion: Show the service's side at that step (for example, an entry in the repeat lane reading "connection error: outcome unknown"), or fold the sentence into step 3.
Evidence: `visual-a03-figure5-step3-4-1280.png`.

### visual-20 · optional · a03 · Opening tables mark keys but do not connect them

Problem: The three starting tables mark PK and FK, but nothing connects reservations.class_id and instructors.class_id to classes, and owner_id points to a customers table that is not shown; "2 (Tariq)" glosses the value instead.
Effect: Minor. The reader relies on the prose and the schema listing to see how the tables relate, whereas a00 drew its keys.
Suggestion: Add a three-row customers table and a line or arrow from each foreign key to its key, or a one-line key note under the tables in a00's Figure 2 style.
Evidence: `visual-a03-opening-tables-1280.png`.

## Limits

- The browser pane is hidden in subagents, so all checks ran in headless Chromium (chrome-headless-shell 1234) at a device scale factor of 1. Playback timing was read from the page's own timers (`performance.now()` around each step change during Play), not watched. Phone checks used viewport and mobile emulation, not a real device or touch input.
- Contrast was computed from computed styles, compositing backgrounds and ancestor opacity. Text over gradients or images would not be measured correctly; I saw none. Disabled controls were excluded, as WCAG allows. Graphic contrast was measured for the Figure 2 arrows and the stepped-figure marker borders only; the diagram box outlines (about 1.5:1) are separated by their fill, and a03's grey "done" lane border (about 1.5:1) repeats information given in text.
- Keyboard checks covered option changes, Back/Next at both ends, Tab order through the controls and Play/Pause. I did not test a screen reader, the `aria-live` announcements or reduced-motion rendering.
- I did not check figure values against a database. Where a number looked odd (order_items at 1,268 pages), I only checked its plausibility.
