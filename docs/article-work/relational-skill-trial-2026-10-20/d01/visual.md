# Visual review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" (trial versions) · 03f972f, round d01

Inputs read: the rendered trial pages at `/review/relational-trial/` (a00) and `/review/relational-trial/transactions/` (a03), served by `pnpm astro dev --port 4411` at 03f972f; the reference articles' rendered figures and tables at `/review/examples/sequences/`, `/review/examples/indexes/` and `/review/examples/storage/` (this route needs `STAYCURRENT_REFERENCE_PREVIEW=1`, so the server was restarted with that variable set); `.agents/skills/staycurrent-figures/SKILL.md`. Not read: the writers' notes, the plan, `brief.md`, the live drafts, earlier review folders and the other d01 reports.
Verdict: a00 repairs required; a03 repairs required

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | finding | Most items stand on their own. In a00, the first table disagrees with the prose that refers back to it (visual-1). In a03, the starting-rows figure hides the `remaining` column on desktop (visual-9). |
| 2. Form fits the content | finding | Rows sit under real headings in both pieces, and the a03 schedules are a good growing table. But a03 renames the a00 shop's customers (visual-8), and two a00 tables pack two values into one cell (visual-3, visual-4). |
| 3. Readable at a glance | finding | SQLSTATE codes in the a00 refusals table need decoding (visual-3). An a03 listing hides its key condition off the right edge (visual-12). The a03 Bookings cells cannot show who owns a booking (visual-13). |
| 4. Interaction | pass, with optional findings | Every option and step of all 7 interactive figures was run, by click and by keyboard. Back and Next keep focus at both ends (`aria-disabled`), Pause works, the hold bar stops under reduced motion, and each step is held 3.4–14 s in proportion to its new text. Minor mismatches are in visual-6 and visual-11. |
| 5. Themes and phones | finding | No page-level overflow at 375 px in either theme. Highlight fills in a00 fall below 3:1 (visual-2). Dimmed text in a03 Figure 4 falls below 4.5:1 (visual-10). Several tables and listings scroll sideways inside the column at 375 px (visual-7, visual-12). |

## First reading

Each figure, table and code example was looked at, and each interactive tool was used, before any prose was read. The record:

**a00**

- *Table "The work stops after / What is left behind / What is now wrong"* (3 rows: adding the order, adding the lines, reducing the stock). This seemed to show what a partial write leaves behind at each stopping point. It was clear. The third row ("Nothing, unless Tariq read the stock…") brings in concurrency without a row of its own, and I was not sure whether that was meant to be a separate case.
- *Table "The database does / You still decide"*. A division of responsibility, clear at a glance.
- *Figure 1, "Each fact is stored once; keys connect the facts"*. Five small tables with PK/FK marks under the headings, and a select listing the five item lines. Choosing a line highlights the rows its keys reach and prints the key path and the joined row. It read clearly as following keys. The highlight is faint in light theme. Keys are joined by highlight and a text path, not by drawn links. All five options worked, and each reached the right order, customer, product and payments (101 has two payments; 103 has none).
- *SQL listing (receipt join)* followed by a *result table* (103, Mina Shah, two lines). Clear. The numbers in the result are left-aligned, whereas Figure 1 right-aligns them.
- *Table of attempted changes, rule and outcome*. This seemed to show which bad changes the schema refuses. The outcomes are bare codes ("Refused, 23503"), which I could not read without knowing SQLSTATE. The last row's "Rule that applies" cell says "None declared: accepted", which is an outcome rather than a rule.
- *SQL listing and result (Mina's orders by `placed_at`)*. Clear. Timestamps show `+00`, unlike Figure 1.
- *Figure 2, "Three queries run without error; only one answers the question"*. Three radio options. Each shows its SQL, the "Result returned" beside a "Calculated by hand" table, and a verdict. Wrong cells are marked "(wrong)" in red, and a missing row reads "Row missing". The point was clear from the figure alone. All three options were tried.
- *Two UPDATE listings (cancel by customer / by order and status)*. With no prose, I could not tell what the comparison was. The prose supplies it, which is acceptable for a pair of listings.
- *Transaction listing (BEGIN … COMMIT with guarded stock updates)*. Clear. The comments carry the outcome.
- *Figure 3, "Two transactions want the last blue mug"*. Three options, six steps each, with panels for Mina's transaction, Tariq's transaction and the committed state. Read Committed ends with both orders holding one mug. Repeatable Read ends with Tariq's 40001 and a rollback. The guarded update ends with UPDATE 0 and a rollback. Every outcome was clear from the figure. The "changed at this step" highlight is very faint.
- *Table "What happened / What the application knows / A safe response"*. Clear.
- *Page-count table (1,000 / 100,000 / 1,000,000 orders)*. The page growth was clear. The cells "8 pages for 1 row" and "736 pages for 100 rows" join two quantities, and the with-index column gives no row count, so I had to work out that it returns the same rows. I could not tell whether the numbers were observed or modelled until the paragraph after the table.
- *Table of tax-column changes (change / observed outcome / consequence)*. Clear, apart from the bare 23502.
- *Figure 4, "A replica copies mistakes; a backup with archived log can go back before one"*. Two options, of 4 and 5 steps. Order chips for primary and replica, and a text cell for the backup. The cleanup option clearly shows "101 missing" on both copies, then the repair. I noticed order 104 never appears, and wondered whether a chip was missing. "Time: After" reads oddly beside clock times. In the last step the backup column turns from chips into a sentence.
- *Reading-route table*. Clear.

**a03**

- *Figure 1, "Classes, bookings and instructors"*. Four boxed tables with PK/FK badges and dashed FK values. On desktop the `classes` box is cut at "remaini…", so the counter the whole article turns on is hidden until the reader scrolls inside the box. Customer 2 is "Arun" and Tariq is an instructor. The introduction's shop had Mina Shah, Tariq Aziz and Edda Berg as customers 1–3, so I was unsure whether this is the same shop.
- *Listing of the failed booking (unique violation, 25P02, ROLLBACK)*. Clear. The replies are given as comments.
- *Savepoint table (three endings)* and *constraint-coverage table*. Clear, and captioned as observed or not.
- *Figure 2, "The same code, two schedules"*. Two selects (example × schedule) and a table that grows one row per step. The committed values that change are bold green, and the final verdict is a red "Rule broken: …" line. Very clear. The counter reads "7 / 7" while the last row is "Step 6".
- *Isolation-level table*. Clear.
- *Figure 3, "Matching the protection to the rule"*. Example select plus protection select (3, 2 and 4 options). Every combination was played. Outcomes were clear. In the double-click example, the Bookings cells list "R7, R10, R11" with no owners, so "Mina holds 2" can only be taken from the verdict line.
- *Listing (WITH taken AS … conditional booking)*. Clear.
- *Figure 4, "What B's statement sees while A's change is pending"*. A select of three statements, with row versions drawn as stacked boxes (committed solid, uncommitted dashed, old version struck through and dimmed). Clear and well chosen. The dimmed old-version caption is hard to read, and the statement is shown as one wrapped line.
- *Deadlock listing*. On desktop the line `… WHERE class_id = 22 AND remaining` is cut, and its `> 0;` is hidden off the right edge.
- *Lost-connection, durability and payment-design tables*. Clear and captioned.
- *Final check query*. Its result is not shown, so I could not see what a passing `rule_holds` looks like.

## Findings

### visual-1 · required · a00, the "work stops after" table in section 1, and section 4's reference to it

Problem: The table has three rows. Section 4 says the transaction "solves the first three rows of the table in section 1. It does not, by itself, solve the fourth: two complete, correct-looking transactions running at once." There is no fourth row. The concurrency case sits inside the third row's last cell ("Nothing, unless Tariq read the stock while these writes were in progress"), and section 1 itself calls that row "the harder problem".
Effect: A reader who scrolls back to find the fourth row finds three. The distinction the article builds on, between partial failure and concurrency, is not visible in the table that is meant to set it up.
Repair: Add a fourth row, for example "Two orders run at once / both read 1 mug / two orders hold one mug", and make the third row only "Reducing the stock / Everything Mina asked for / Nothing". Alternatively, change both prose references so they match a three-row table. Screenshot: `visual-a00-table-stops-after.png`.

### visual-2 · required · a00, Figure 1 key highlight and Figure 3 "changed at this step" highlight

Problem: These highlights are the cue each caption tells the reader to use ("Highlighted rows are the ones the chosen line's keys reach"; "A highlighted value changed at this step"). Measured against the ordinary row or panel background, the highlight fill is 1.23:1 in light and 1.84:1 in dark for Figure 1, and 1.13:1 in light and 1.66:1 in dark for Figure 3. Graphics must reach 3:1.
Effect: In light theme the reached rows and the changed values barely stand out (see `visual-a00-fig1-desktop-light.png`, `visual-a00-fig3-step5-highlight.png`). Readers with weaker contrast sensitivity lose the figure's main signal and have to rely on the text path below the tables.
Repair: Add a marker that reaches 3:1 against the row background, using site tokens: a solid left rule or outline on highlighted rows and changed values, or a stronger fill. The a03 figures already mark changes with bold accent text that passes, and that treatment would work here too.

### visual-3 · optional · a00, "Attempted change / Rule that applies / Outcome" table (section 2)

Problem: Outcomes are given as bare SQLSTATE codes ("Refused, 23503", "Refused, 23505", "Refused, 23514"). The last row's "Rule that applies" cell reads "None declared: accepted", which repeats the outcome in the rule column.
Effect: A newcomer has to decode 23503, 23505 and 23514 to see that each is a different kind of refusal. The rule column stops holding one kind of value.
Repair: Write the outcome as "Refused: foreign key (23503)", "Refused: unique key (23505)" and so on, and put "None declared" alone in the rule column. Screenshot: `visual-a00-refusals-table.png`.

### visual-4 · optional · a00, page-count table (section 6)

Problem: The "no index" cells pack two quantities ("736 pages for 100 rows"). The "with an index" column gives pages only, so the reader must infer that it returns the same rows. Numbers are left-aligned, so magnitudes do not line up. Whether the numbers are observed is said only in the paragraph after the table.
Effect: Comparing 7,353 with 1,004 pages and 4 pages takes more reading than it should. That comparison is the point of the table.
Repair: Add a "Rows returned" column (1 / 100 / 1,000), make the three cost columns pages only, right-align the numbers, and put "Observed with EXPLAIN (ANALYZE, BUFFERS) on PostgreSQL 18.6" in a caption above the table, as a03 does for its tables. Screenshot: `visual-a00-page-counts-table.png`.

### visual-5 · optional · a00, Figure 4 (replica against backup)

Problem: The order chips run 101, 102, 103, 105, 106. Order 104 is never mentioned (in Figure 3's first option it was committed). The time label reads "Time: After". In the final cleanup step the backup column changes from chips into a sentence ("Restored to 11:09:59 elsewhere: 101, 102, 103, 105; no 106").
Effect: An attentive reader stops to wonder whether 104 was lost, which is the very thing the figure is about. The restored copy cannot be compared chip-for-chip with the primary and replica.
Repair: Either include 104 or say in the boundary note that order 104 was refused in Figure 3. Label the last time "After repair". Show the restored copy as chips, with "106" marked as absent. Screenshot: `visual-a00-fig4-cleanup-after.png`.

### visual-6 · optional · a00, Figure 2 explanation and text alternative

Problem: The correct option's explanation says "Every value matches the hand calculation below the result". On desktop the hand calculation sits beside the result. It is below only at phone width.
Effect: A desktop reader looks below and finds the verdict panel.
Repair: Say "the hand calculation" without a direction, or "beside (on a phone, below)". Screenshot: `visual-a00-fig2-correct-option.png`.

### visual-7 · optional · a00, phone width (375 px)

Problem: At 375 px, Figure 1's `order_items` table scrolls inside the figure (344 px of content in 317 px), with `unit_price` cut off. The receipt result table (422 in 343 px), the Figure 2 SQL (435 in 315 px) and the transaction listing (550 in 341 px) also scroll sideways. In Figure 2 the hidden part includes `- sum(pay.amount) AS due`, the expression the figure is about.
Effect: On a phone the reader must find and use a sideways scroll to see the price in the highlighted row and the faulty arithmetic. There is no visual hint that more content is to the right.
Repair: Wrap the long SQL lines the way the a00 transaction listing already uses indentation. Let `order_items` drop to a smaller monospace size or stack its PK/FK labels at narrow widths. Screenshot: `visual-a00-fig1-375-light.png`.

### visual-8 · required · a03, Figure 1 and the running example throughout

Problem: The caption says "The shop from the introduction now runs short classes", but its customers differ from the introduction's. In a00, customer 1 is Mina Shah, 2 is Tariq Aziz and 3 is Edda Berg. In a03, customer 2 is "Arun", Tariq becomes an instructor, and the surnames are gone. Every a03 figure then has Mina competing with Arun, and Tariq appears on the instructors' side.
Effect: A reader arriving from the introduction meets a customer 2 with a different name. They have to decide whether the keys mean the same thing across articles, which the figures skill forbids ("the same rows, keys, names and values wherever they recur").
Repair: Keep the introduction's customers and add new ones with new keys. For example, make Tariq Aziz (2) Mina's competitor for the last place, or add Arun as customer 4. Give the instructors names that are not already customers. Keep full names in the customers table. If the a00 and a03 model files are separate, import the customers from one shared model so they cannot drift.

### visual-9 · required · a03, Figure 1 `classes` box on desktop and tablet

Problem: At 768, 1024 and 1280 px, the `classes` table (305 px) is wider than its box (293 px). The box scrolls sideways, so the last column header reads "remaini" and its values are partly hidden. The title "Tea tasting" also wraps into two lines. At 375 px, where the boxes stack, it fits.
Effect: On the layout most readers see, the starting figure hides `remaining`. That is the stored counter which the caption, the capacity rule and every later figure depend on.
Repair: Give `classes` the full row (put it on its own line, or above the other three boxes), or let the two-column grid start only when each box has room. Screenshot: `visual-a03-fig1-desktop-clipped.png`, compared with `visual-a03-fig1-375-light.png`.

### visual-10 · required · a03, Figure 4 old-version box (dimmed) and uncommitted outline

Problem: In the final step of each option, the old row version's caption "kept until no reader needs it" measures 3.69:1 in light and 4.42:1 in dark. It is dimmed body text and needs 4.5:1. The dashed outline that marks an uncommitted version measures 1.64:1 in light and 1.83:1 in dark, against 3:1 for graphics.
Effect: The note that explains why an old version lingers, which is the MVCC point of the figure, is the hardest text in the figure to read. The committed/uncommitted distinction rests mostly on the words, because the outline is faint.
Repair: Dim the old version with a muted text token that passes 4.5:1, instead of lowering opacity on the whole box. Draw the uncommitted outline with a border token that reaches 3:1. Screenshot: `visual-a03-fig4-old-version-dimmed.png`.

### visual-11 · optional · a03, Figures 2 and 3 step numbering

Problem: The table's first row is "Start" and later rows are "1", "2" and so on, but the counter counts Start as step 1. On the final step the counter reads "7 / 7" while the highlighted row says "Step 6" (or "8 / 8" against "7" in Figure 3).
Effect: A reader who matches the counter to the row label sees an off-by-one error and may think a step is missing.
Repair: Label the first row "0" or number the rows from 1 including Start, so that the counter and the row label agree. Screenshot: `visual-a03-fig2-step-numbering.png`.

### visual-12 · optional · a03, listings that overflow (deadlock listing, Figure 4 statement, phone width)

Problem: On desktop the deadlock listing's line `UPDATE classes SET remaining = remaining - 1 WHERE class_id = 22 AND remaining` runs past the column, hiding `> 0;` (688 px of content in 638 px). At 375 px all four listings scroll sideways (434–622 px in 341 px). Figure 4 shows its UPDATE statement as one wrapped line, not formatted like the other listings.
Effect: The guard condition, which is the part of the deadlock listing that makes the move safe, is invisible without a sideways scroll. The Figure 4 statement is harder to scan than the same SQL elsewhere.
Repair: Break the long UPDATE after `WHERE`, as the WITH listing does. Format the Figure 4 statements over several lines (UPDATE / SET / WHERE / RETURNING). Screenshot: `visual-a03-deadlock-listing-clipped.png`.

### visual-13 · optional · a03, Figure 3 "Mina clicks 'Book' twice"

Problem: The Bookings column lists request ids only ("R7, R10, R11"). The rule being tested is about ownership, but no cell shows who owns which booking. The broken state can only be read from the verdict line.
Effect: The reader has to remember that R7 is Arun's and that R10 and R11 are Mina's to see the rule break in the table itself.
Repair: Show the owner with each id in this example ("R7 Arun, R10 Mina, R11 Mina"), or add a "Mina's bookings" column, as the instructors example has "Available". Screenshot: `visual-a03-fig3-double-click.png`.

### visual-14 · optional · a03, the final rule-check query (section "Check the argument…")

Problem: The query that checks `rule_holds` for each class is shown without its result. Every other listing in a03 gives its replies.
Effect: The reader cannot see what a passing check looks like (for example, class 21: 1, 0, 1, t). They have to run it to learn which columns to look at.
Repair: Add the two-row result, as observed after the article's final run, under the listing.

## Limits

- The built-in browser pane was hidden for the whole session (reported by `tabs_context`), and its screenshots were stale. I opened both pages there as instructed. All visual inspection, screenshots, interaction, keyboard checks and timing were done in a visible-equivalent headless Chromium (Playwright's cached chrome-headless-shell, driven over the DevTools protocol) against the same dev server. Playback timing was measured from the page's own timers at real speed, not from a hidden pane.
- Keyboard use was tested with synthesised key events (Enter and Space on Back and Next, arrow keys on radio groups, Enter on Play and Pause) after focusing the control programmatically, not by tabbing through the whole page. The `<select>` controls opened their native popup on arrow keys in headless macOS, so option changes by keyboard on the selects were not confirmed beyond focus.
- Contrast was computed from computed styles, including opacity and alpha blending, for every text node in each figure state I set up (three states per page per theme). It was not computed for every possible step. Disabled Next and Back buttons fall below 4.5:1 but are exempt as inactive controls. Syntax highlighting is absent from the trial listings, so their contrast passes trivially. The reference articles' highlighted listings sit at 3.75–4.36:1, which is not a finding against these pieces.
- The reference route needs `STAYCURRENT_REFERENCE_PREVIEW=1`, so the dev server was restarted once with that variable. The trial routes were unaffected.
- I did not check figure data against PostgreSQL. Correctness of the observed outcomes belongs to the practitioner perspective.
