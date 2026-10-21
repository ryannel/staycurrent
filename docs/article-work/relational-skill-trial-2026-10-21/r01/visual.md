# Visual review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" · b5586b8

Inputs read: the rendered pages /review/relational-trial-2/ (a00) and /review/relational-trial-2/transactions/ (a03), served by `STAYCURRENT_REFERENCE_PREVIEW=1 pnpm astro dev --port 4524` at b5586b8 and stopped afterwards; the reference articles' rendered figures at /review/examples/sequences/, /review/examples/indexes/ and /review/examples/storage/; `.agents/skills/staycurrent-figures/SKILL.md`; `docs/coverage/relational-example.md`. Component markup was inspected in the DOM only to measure a fault already seen (the a03 history list's scroll position and the committed-rows tables' width). Withheld and not opened: the plans, writers' work records, everything else under `docs/article-work/` (including the other r01 reports beside this one), `src/articles/relational-next/`, `src/articles/relational-trial/`, `src/components/relational-trial/` and any other review report.

Verdict: repairs required for both articles. a00: one required finding (visual-1). a03: five required findings (visual-6, visual-7, visual-8, visual-10, visual-12; visual-12 is in a shared component and goes to the coordinator).

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | finding | a00 Figures 1, 2, 3, 5 and 6 stand on their own. a00 Figure 4 hides its order of events (visual-1). a03 Figures 2 and 3 hide the reads they depend on and draw outcomes above the commits that caused them (visual-6, visual-7). |
| 2. Form fits the content | finding | Rows sit under real headings, one table per relation, keys are marked and Figure 2's diagram draws the keys. The running example matches the record in both articles: rows, keys, names, request numbers and values. The a00 race is drawn as two unaligned cards rather than a time grid (visual-1). The a03 anomaly table is a five-column prose table (visual-8). Smaller form issues are in visual-2, visual-3, visual-5, visual-11 and visual-13. |
| 3. Readable at a glance | finding | Listings overflow the article column at 1280 px and hide their ends. In a03 the hidden ends are the explanatory comments (visual-10); in a00 they are values and an error's last words (visual-4). Table and listing numbers disagree in a00's performance section (visual-5). |
| 4. Interaction | finding | Every control changes the figure. Keyboard use works in all ten figures: radio groups respond to arrow keys, option buttons to Enter, and Next and Back keep focus at the last and first step through `aria-disabled`. Pause stops playback. Holds are long enough. The text alternatives state every option's outcome. a03's history list scrolls its first rows out of sight (visual-6) and puts results above their cause (visual-7). In a00 Figure 5 the explanation and the drawing disagree (visual-2). |
| 5. Themes and phones | finding | Both themes render cleanly, and focus rings are visible in both. In a03, the anomaly table loses its Serializable column at 375 px (visual-8). The committed-rows tables run past the figure card at 768 px and wider (visual-9). The Prediction summary is 3.76:1 in the light theme (visual-12). All other text in figures and tables passes 4.5:1 in both themes. The only other failures are disabled buttons, which are exempt. |

## First reading

Recorded before reading the surrounding prose. The figures' own step explanations were read as part of each figure.

**a00 Figure 1, "One order written as five separate changes."** A six-step replay of Mina's order 103 written as five auto-committed statements. The statements pile up in a "Shop application" panel, with the newest marked "new". The products, orders and order_items tables update beneath it. Three Right/Wrong checks show which of the shop's answers are true after each statement. I understood it at once. The only uncertainty is whether "new" marks the statement or the row; it marks both, which works.

**a00 Figure 2, "The shop's tables and the keys that connect them."** A schema diagram with PK and FK labels and arrows from each foreign key to its key, then the five tables in full. Choosing Order 101, 102 or 103 highlights the rows that the order reaches through its keys, marked "linked". At 375 px the diagram stacks vertically and stays legible. Clear. One small doubt: the payments and order_items arrows share one trunk into orders.order_id, so for a moment the line seemed to start at payments only.

**a00 Figure 3, "What is still due on each order?"** A comparison of two query shapes. "Join everything, then sum" multiplies order 101's rows to four, totals 79.00 against 79.00, and drops order 103, ending on three Wrong checks. "Sum each, then join" builds a value table and a paid table and then a result in which 103 owes 29.00. Clear. Unsure: the `orders ⋈ order_items ⋈ payments` label (I would not expect a newcomer to read ⋈); where 103's lines went at step 2 (they simply vanish); and the NULL that coalesce replaces, which is never shown.

**a00 Figure 4, "Two customers, one blue mug."** Three protections, each replayed in two side-by-side cards for Mina and Tariq above the P7 stock and the mug's order lines. Read-then-write ends with two orders for one mug; the other two end with one. While stepping, the "new" and "waiting" badges show what just happened. At the final step I could not tell in what order the two sessions ran, because each card is a separate list. At 375 px the cards stack, and Tariq's whole session comes after Mina's.

**a00 Figure 5, "Where the connection breaks."** Three cases: reply arrives, breaks before COMMIT, breaks after COMMIT. An application panel and a "Mina sees" panel sit above P7 stock and the orders table. In the after-COMMIT case a blind retry and a lookup are drawn side by side with Right/Wrong checks. The outcome is clear. Unsure: in "Breaks before COMMIT" the panel shows `COMMIT; → connection lost`, which reads as though COMMIT was sent. Order 103 appears struck through as "removed" although it was never committed. `UPDATE teas, INSERT order 103 and its lines` looks like SQL but is not.

**a00 Figure 6, "Which recovery fits which failure?"** Three failures against three recovery tools in a card grid. Each card says whether orders 101 and 103 survive and gives a verdict, and the right tool is outlined. Clear at a glance. In the crash and lost-machine cases the restore card still stops at 10:09, a time that belongs to the deletion case. I was briefly unsure why.

**a00 listings and tables.** The join, the result tables, the constraint-error table, the cancellation listings, the application code, the EXPLAIN plans, the index table, the schema-change table and three choosing/reading tables. They read as real psql output and real errors. Long lines run past the column edge at 1280 px (visual-4).

**a03 opening tables.** classes, reservations and instructors, each with a few rows, matching the record. On instructors, class_id is marked FK, but the pair (class_id, person) is not marked as the key.

**a03 Figure 1, "Mina's double click in class 22."** A history list for one browser session, the committed classes and reservations, and two rule cards with ✓ or ✕. Each statement on its own ends with "rule broken" (0 remaining + 2 booked = 2 against capacity 3). One transaction per booking ends with the rule holding. Clear. The committed-rows table pokes out of the figure card on the right.

**a03 Figure 2, "Mina and Tariq book class 21's last place."** Four options shown as a two-lane time grid, one row per event, beside the committed rows and rule cards. This is the right form for a race. At the outcome step of the longer options, though, the first rows are cut off at the top of the lanes (visual-6). The waiting update's result ("after the wait: 1 row updated", or "refused: could not serialize") appears in the row above Mina's COMMIT, with "still waiting" below. Reading downwards as time, the refusal seems to happen before she commits, and I had to reread the explanation to sort out the order (visual-7).

**a03 Figure 3, "Lena and Ravi both ask to stop teaching class 21."** Write skew over the instructors table in four options. The two Serializable options differ only in what the retry does. Clear at first, but at the last step of the Serializable options Lena's count of two has scrolled out of view, and at 375 px both counts have. Those counts are the whole point. In "Lock class 21 first", "after the wait: locked" sits above the two "still waiting" rows.

**a03 Figure 4, "Mina's booking when the reply to COMMIT is lost."** Three options: committed and booked again, committed and looked up, never committed and looked up. A single history list sits beside the committed rows. Clear. The outcome rows and the "Mina is told…" ending are unambiguous.

**a03 listings and tables.** The schema listing, the "shape of the rule" table, the conditional-update and recheck listings, the lock listing, the anomaly table, the versions-and-locks table, the outcomes table, the move listing and the email table. The comment lines in three listings run past the right edge at 1280 px (visual-10). The anomaly table needed a horizontal scroll on a phone, and I did not find its Serializable column at first (visual-8).

## Findings

### visual-1 · required · a00 Figure 4 "Two customers, one blue mug"

Problem: The figure is a schedule, and its result depends on the order of the sessions' statements. But Mina's and Tariq's statements are drawn as two independent lists side by side, so a row's height says nothing about when it ran. At the last step of "Read, then write", Tariq's UPDATE sits level with Mina's UPDATE although it ran after her INSERT and finished after her COMMIT; the "waiting" mark from step 5 has gone. At 375 px the cards stack, and all of Mina's session comes before all of Tariq's (screenshots `visual-a00-fig4-lanes-1280.png`, `visual-a00-fig4-lanes-375.png`). On a phone, each Next changes a card that may be off screen below the explanation.
Effect: Once the figure reaches its outcome, the reader cannot see the interleaving that caused it: both reads before either write, and the wait. They have to hold the order in their head from the step texts, which is the work the figure exists to do. a03 and the reference sequence diagrams draw time downwards across aligned lanes, so a reader who meets both articles sees the same race drawn two ways.
Suggestion: Put one event per row on a shared time axis, with a column per session, as a03's schedule figures do (fixing visual-6 and visual-7 there). Keep the wait as its own row that ends where Mina's COMMIT releases it. On phones keep both columns narrow rather than stacking whole sessions.

### visual-2 · optional · a00 Figure 5 "Where the connection breaks"

Problem: In "Breaks before COMMIT", the explanation says "The network drops before COMMIT is sent", but the panel shows `COMMIT; → connection lost` as the statement that failed (`visual-a00-fig5-before-commit.png`). The note says the figure shows "the committed rows", yet it shows uncommitted rows (labelled), and then strikes through order 103 as "removed" although 103 never existed in committed data. The orders table leaves out order 101 without saying so. `UPDATE teas, INSERT order 103 and its lines` is set in code type but is a description, not SQL. Figure 4's `INSERT order 103 and its two lines` does the same.
Effect: The reader has to work out whether COMMIT reached the server, which is the distinction the figure teaches. They may also read "removed" as the database deleting a committed order.
Suggestion: Show the attempted COMMIT as "not sent: connection already gone", or make the explanation match the drawing. Either drop the strike-through or reword the note so it does not claim the tables hold committed rows only. Set the descriptive steps in prose type, or show the real statements.

### visual-3 · optional · a00 Figure 3 "What is still due on each order?"

Problem: At step 2 of "Join everything, then sum", order 103's two lines simply vanish from the joined rows; the drop is stated but not shown. Order 101's four joined rows keep their "new" markers into step 3, where nothing about them is new (`visual-a00-fig3-join-step.png`). In "Sum each, then join", the missing paid total that coalesce replaces is never shown before it becomes 0.00. The joined-rows label uses `⋈`, which a newcomer will not know.
Effect: The two mechanisms the figure names, the inner join dropping 103 and coalesce filling a missing total, are both told rather than seen.
Suggestion: Show 103's lines dimmed or struck as "no match" at step 2, show the paid cell as NULL for one step before coalesce, clear "new" markers after their step, and replace `⋈` with words such as "joined on order_id".

### visual-4 · optional · a00 code listings and the constraint table

Problem: At 1280 px several listings are wider than the column and hide their ends behind a horizontal scroll, which macOS shows only while scrolling. The application code hides `>= $1` at the end of the claim (`AND stock >= $1`). The transaction listing hides the second order line's values (`(103, 2, 'P3', 2, 4.50)`), and the ALTER TABLE error stops at "contains null val" (`visual-a00-listing-clipped-1280.png`). At 375 px most listings scroll, and the constraint-error table clips `order_items_quantity_check`.
Effect: The reader sees truncated statements without knowing that they are truncated. Here the lost text is recoverable from nearby prose, so the cost is effort rather than understanding.
Suggestion: Break long statements across lines inside the column at desktop width; let the error message wrap.

### visual-5 · optional · a00 "Correct SQL still has to do physical work" table against its listings

Problem: The table says "Index scan, 6 pages" for finding Mina's orders, but the listing just above shows a Bitmap Index Scan feeding a Bitmap Heap Scan. The table's "Sequential scan, 1,271 pages" matches the Sort's buffer total, while the Seq Scan line and the prose say 1,268.
Effect: A reader comparing the table with the plan sees two different scan types and two page counts, and must decide which to trust.
Suggestion: Name the scan as the plan does (bitmap index scan), and use one page count, stating what it includes.

### visual-6 · required · a03 Figures 2 and 3, the history lanes

Problem: Each figure's history is a fixed-height list that scrolls itself to the latest row, with no visible scrollbar. At the outcome step of the longer options, the first rows are cut off or hidden.
- At 1280 px: 114 px are hidden in Figure 2 "Read, then write, at Repeatable Read" and 63 px in both Serializable options of Figure 3. In Figure 3, Lena's `BEGIN; count available 2` has gone, and in Figure 2 "Read, then write" the first row is half cut (`visual-a03-fig2-history-clipped-1280.png`).
- At 375 px: up to 192 px are hidden. Both of Figure 3's counts of two are gone in the Serializable options (`visual-a03-fig3-history-clipped-375.png`). Both reads and Mina's write are gone in Figure 2's Repeatable Read option (`visual-a03-fig2-history-clipped-375.png`).
Effect: The outcome step should show the whole schedule. Instead it hides the reads that each decision rests on. Write skew cannot be seen without the two counts, and the reader is unlikely to guess that the lane scrolls.
Suggestion: Let the history list grow to its full height, which is at most ten rows. If it must be capped, show the whole list at the final step and give the scroll a visible cue.

### visual-7 · required · a03 Figures 2 and 3, where a waited statement's result is drawn

Problem: When a statement waits, its eventual result is drawn in the row where it started: "after the wait: 1 row updated", "after the wait: refused: could not serialize (40001)", "after the wait: locked". That row sits above the rows for the other session's COMMIT, which still say "still waiting" (`visual-a03-fig2-refusal-above-commit.png`, `visual-a03-fig3-lock-after-wait.png`). At the step where the refusal or the lock happens, the highlighted current row jumps back up, above the commit that caused it.
Effect: The grid reads downwards as time, and the article teaches that the order of events decides the outcome. Here the drawing shows Tariq refused before Mina commits, and Ravi locked before Lena commits, contradicting the step text. A newcomer has to reconcile the two at the very step the figure is about.
Suggestion: Keep the starting row as "waiting for Mina/Lena", and give the result its own row after the releasing COMMIT.

### visual-8 · required · a03 "Understand the isolation contract" anomaly table, and the versions-and-locks table, at phone width

Problem: The anomaly table has five columns, two of them prose. At 375 px it is 503 px wide in a 343 px column. Repeatable Read is cut, and Serializable, the column the section builds towards, is entirely off screen (`visual-a03-anomaly-table-375.png`). The four-column "Tariq's statement" table also cuts its last column ("Still returns…"), and breaks `SELECT … FOR UPDATE` over three lines (`visual-a03-versions-locks-table-375.png`).
Effect: A phone reader sees no Serializable answers unless they discover the sideways scroll. The figures skill states that prose tables with more than about three columns become labelled cards at every width.
Suggestion: Give each anomaly a card listing its three levels, or keep the levels as columns and move "What happens" into the row heading. Treat the versions-and-locks table the same way.

### visual-9 · optional · a03 Figures 1, 2 and 4, the committed-rows tables

Problem: At every width from 768 px up, the classes and reservations tables extend 48 px past the right edge of the figure card and the article column (`visual-a03-fig2-table-spill-1280.png`). In isolated figure screenshots, the remaining column, which carries each figure's result, is cut at "ren".
Effect: Nothing is lost in a full-page view, but the figure looks broken, and the skill's rule that nothing overflows the article column is not met.
Suggestion: Narrow the lanes, abbreviate the title column, or stack the committed rows under the lanes below about 1000 px.

### visual-10 · required · a03 code listings at desktop width

Problem: At 1280 px three listings are wider than the column, and what they hide are the comments that carry the reasoning. In the conditional-update listing, the comment "No row: ROLLBACK and say the class is full" is cut after "is ful". The recheck listing is 160 px too wide, and all three of its comment lines are cut: the earlier SELECT, "writes only if the value it read is still there", and "something changed; read again" (`visual-a03-listing-clipped-1280.png`). The lock listing's comment "sees every commit made before the l…" is also cut. At 375 px every listing scrolls.
Effect: The listings teach through these comments: what the application does when no row comes back, and what the earlier read was. Without scrolling, which macOS hides, the reader gets half-sentences.
Suggestion: Wrap the comments onto their own shorter lines so that each listing fits the column at desktop width.

### visual-11 · optional · a03 opening tables and Figure 3, key markers on instructors

Problem: The opening instructors table marks class_id as FK but does not mark the key (class_id, person), which the schema listing declares. Figure 3's instructors table marks neither (`visual-a03-instructors-keys.png`). Every other table in both articles marks its PK and FK.
Effect: A small inconsistency. The reader cannot see from the table that one instructor appears once per class.
Suggestion: Mark class_id "PK, FK" and person "PK" in both, as a00 does for order_items.

### visual-12 · required · a03 "Compare your reasoning" disclosure (shared Prediction component)

Problem: In the light theme the summary text and border of the Prediction disclosure measure 3.76:1 against its background, below the 4.5:1 required for body-size text (`visual-a03-prediction-contrast.png`). The dark theme passes.
Effect: The control that reveals the answer to the article's prediction exercise is hard to read for low-vision readers in the light theme.
Suggestion: Darken the light-theme colour token used by `src/components/editorial/Prediction.astro`. This is a shared component, so the coordinator should repair it.

### visual-13 · optional · a00 and a03, the two figure languages

Problem: The two articles draw the same ideas in different visual languages:
- a00 uses serif type, radio-button options, Right/Wrong chips, and "new" and "uncommitted" badges.
- a03 uses sans-serif type, blue toggle buttons, ✓/✕ rule cards, coloured bars and an "Uncommitted:" header line.
The two-session race is drawn as side-by-side cards in a00 and as a time grid in a03.
Effect: A reader moving from the introduction to the transactions article has to learn a second way to read a schedule and its result.
Suggestion: Choose one schedule form and one way of marking changes and outcomes for the collection. a03's time grid, with visual-6 and visual-7 fixed, is the better schedule form.

## Limits

- **Browser.** Browser panes in subagents are hidden, so all viewing was done in headless Chromium driven by Playwright 1.62.1 (loaded from another local workspace's `node_modules`), not in a visible window. The screenshots are element and viewport captures from that browser, with the Astro dev toolbar hidden.
- **Playback timing.** Timing was measured from the page's own timers while autoplay ran. In a00 Figure 1 the holds were 8.8–16.1 s for 21–45 words of changed explanation. In a03 Figure 2 (Repeatable Read) they were 4.3–9.6 s for 2–17 words plus changed cells. Pause stopped playback in both articles. I judged these holds sufficient, but a visible window was not used to confirm how they feel.
- **Scrollbars.** The claim that overflow scrollbars are invisible until scrolling (visual-4, visual-6, visual-10) is macOS default behaviour, inferred rather than observed in a visible window. On systems with classic scrollbars a bar would show, but the content would still be cut at first view.
- **Contrast.** Text contrast was computed from computed colours, opacity and blended backgrounds, for every text node in every step of every option, in both themes. It does not account for anti-aliasing or for text over images. Non-text contrast was spot-checked for state borders in a00 Figure 4 and a03 Figure 2. Those borders are not the only carriers of state, because each also has a text label.
- **Not checked.** Reduced-motion behaviour, screen-reader announcements of the `aria-live` explanations, and the rendered page at widths other than 375, 700, 768, 800, 900, 1024, 1280 and 1440 px.
- **Figure routes and data.** No isolated figure routes were provided. I did not run the verification scripts or check any figure's data against a database. Consistency with the running example was checked against `docs/coverage/relational-example.md` only.
