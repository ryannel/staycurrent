# Visual review · article · a00 Relational databases · c01

Inputs read: the rendered page at http://localhost:4441/review/relational-next/ (build c01) in the built-in browser, at 800 × 600 and 1280 × 900 desktop widths, the 375 × 812 mobile preset, and light and dark colour schemes; my first-reading record, `visual-first-reading.md`, written before any prose was read; the rendered figures and tables of the Indexes, Storage and durability, and Sequence diagrams reference articles on the same server. Not read: the article source, plan, context files, earlier reviews and writer notes.
Verdict: repairs required

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | finding | The figures and code mostly stand alone. The opening table did not: its keys did not connect and its rows were not the ones used later. Figure 5's early branch contradicted itself (visual-1, visual-3). |
| 2. Form fits the content | finding | The opening table packs each relation into `name = value` cells (visual-1). Figure 4 looks up a primary key by scanning rows stored in key order (visual-2). Figure 5 shows rows and rules as word labels (visual-3). |
| 3. Readable at a glance | finding | The packed cells wrap mid-pair on a phone (visual-1). There are small labelling issues in Figure 1 and the route table (visual-7, visual-8). The three code examples are short, formatted and in run order. |
| 4. Interaction | finding | Every control works. Keyboard focus stays on Back and Next at the ends, with a visible ring. But two figures end on steps that change nothing (visual-5), one branch shows a hypothetical as fact (visual-3), the emphasis marks presence rather than change (visual-4), and autoplay is very slow (visual-6). |
| 5. Themes and phones | pass | No contrast failures in light or dark, and nothing overflows the page at 375 px. Figure 1 is taller than a phone screen (noted in visual-7). |

## Findings

### visual-1 · required · "Four kinds of fact in the shop" table (Tables, keys and relationships)

Problem: Each relation's example row is packed into one cell as a list of `name = value` pairs, so the reader never sees a row under its column headings. The third column holds four different shapes of value. Keys do not visibly connect. `customer_id = 1` has to be matched inside two strings. The order_items example is TEA while the products example is MUG, so the product key links nothing. The rows the next section relies on are missing: Arun, his draft order 102 and the MUG line on order 101 first appear in prose and in Figure 1. The prose names the primary key `(order_id, product_id)`, `NOT NULL`, `CHECK (quantity > 0)` and `numeric(10,2)`, but nothing on the page shows them on a table. At 375 px the packed cells wrap inside pairs ("product_id =" / "'TEA'", "unit_price_gbp" / "= 8.00").
Effect: The table is the reader's first picture of what relational data looks like, and it shows the wrong one. The reader has to rebuild four tables in their head and carry rows forward from prose. The first query's stated result ("one row: 101, paid") cannot be checked against anything shown.
Repair: Replace it with four small tables (customers, orders, order_items, products), each captioned with what one row represents. Give each its real column headings and the rows the article uses: customers 1 Mina, 2 Arun; orders 101/1/paid and 102/2/draft; order_items 101/MUG/1/20.00 and 101/TEA/2/8.00; products MUG and TEA with stock. Mark primary-key columns and draw the foreign keys (orders.customer_id → customers, order_items.order_id → orders, order_items.product_id → products). The reference articles show a table's rows as a grid under real column names in the same way. Optionally, show the first query's one-row result beneath its code.

### visual-2 · required · Figure 4, "The same order, with two routes to find it" (The work behind a query)

Problem: The figure finds order 9 by `order_id`, and its scan branch reads every page. The paragraph just before says "A primary key commonly supplies" an index, and names `orders.customer_id` as the index that may help. The figure therefore shows a primary-key lookup by full scan, the case the prose has just set aside. The twelve rows are also stored in id order (1–4, 5–8, 9–12), so the reader can see order 9 is on page 3 and has no reason to see why a scan must read pages 1 and 2. "Candidate location: Page 3, found by scanning" adds to the confusion.
Effect: A newcomer may take away that looking up a row by its key scans the table. The real point, that without an index nothing says where the matching rows are, is weakened by a layout that does say where they are.
Repair: Use the lookup the prose names: find customer 1's orders by `customer_id`, with rows in arrival order and customer ids scattered across pages. The scan then tests every row on every page, while the index entry for customer 1 points to the two pages holding matches. The Indexes reference article's Figure 1 shows this form: "Sequential scan for customer 42" over an unordered heap, with pages-read and rows-checked counters. Keep the existing counters and caption.

### visual-3 · required · Figure 5, "A required delivery instruction meets an old writer", early branch (Changing a live database)

Problem: In the "As soon as the column is added" branch, step 2 says "Required rule blocked". Step 3 ("Old writer submits") then says the old writer "Cannot satisfy new rule", a rule step 2 has just said was never applied. The caption explains that this is a hypothetical ("Even if existing rows were filled…"), but the card shows it as current state. Step 4 is labelled "Complete the transition", yet nothing changes from step 3 and this branch has no transition. The prose before the figure asks the reader to "Follow what happens to the old application's next order", but no order from the old writer ever appears. In both branches every state is a word label ("Delivery instruction missing", "Replaced; old work drained"), not a row.
Effect: The reader cannot tell whether the early change failed or took effect, so the figure's lesson is blurred: the change is blocked by old rows and, separately, would break the old writer. They also cannot do what the prose asks.
Repair: Show an `orders` table with a `delivery_instruction` column (NULL for 101) and the old writer's next INSERT as a row with its outcome. Early branch: the change is rejected because of row 101, so the column is not added and the old writer's order is accepted unchanged. Then, as a clearly separate step or a second failure, if 101 were backfilled, the old writer's INSERT is rejected for the missing value. Staged branch: the column is added as nullable, the old writer's row is accepted with NULL, compatible writers supply the value, 101 is converted, then the rule is required. Use step labels that fit each branch, or end the early branch at its last real step.

### visual-4 · optional · Figure 2, "Which facts survive a failed request?" (Transactions and competing buyers)

Problem: The green emphasis marks facts that are present (order 103, its MUG item), not facts that changed at that step. The stock change from 1 to 0 is never emphasised. Neither is the inconsistent stock of 1 left behind after separate commits fail, yet the prose asks the reader to "watch when the new reader sees the stock fall". The step labels are fixed across branches: "Reserve stock / fail" and "Finish" never say which of failure, ROLLBACK or COMMIT happened.
Effect: The reader's eye goes to the green order and item rather than to the value that shows the outcome. They have to compare digits in two panels across steps to find the moment the figure is built around.
Repair: Mark the cells that changed at each step, including stock going to 0. Flag the leftover state in the separate-commits failure (for example "stock 1 · item exists · not reserved"). Make the last two step labels follow the branch: "Reserve stock" or "Request fails", then "COMMIT" or "ROLLBACK", or "Separate commits stand".

### visual-5 · optional · Figure 3, "The same missing reply…", and Figure 6, "A current copy and an earlier copy…", final steps

Problem: Figure 3's last step, "Inspect stored state", leaves both panels exactly as at step 3; what the inspection found appears only in the caption. The application panel still says "No commit confirmation · Connection lost" after the inspection. Figure 6's last step, "Choose the recovery input", likewise changes nothing: no copy is marked as the recovery source in either branch, and the choice lives only in the caption. Figure 3's database panel never shows R103 stored with the order, although the prose depends on that.
Effect: The step that delivers each figure's conclusion shows nothing new, so the reader must read the caption to learn the outcome. Both figures look as if they ended a step early.
Repair: In Figure 3, add an inspection line to the application panel ("Lookup by R103: order 103 found" or "none found"), and show R103 beside order 103 in the database panel. In Figure 6, at the last step, mark the chosen copy (accent border and a "recover from this" label) and mark the unusable one ("has the deletion too").

### visual-6 · optional · Playback in Figures 1–6

Problem: Autoplay holds each step for about 34–42 s (measured: Figure 1 at 33.6 s and 40.8 s; Figure 2 at 40.2 s and about 41.6 s). Figure 2's full run therefore takes over three minutes. The panel gives no sign of progress while it waits, although the Play button does change to Pause. The prose tells the reader to "Play Figure 2". Under the same conditions, the Indexes reference's Figure 1 plays all six pages in 23.6 s and ends on a "Replay" control. At the end of a run, these figures show "Play" again.
Effect: A reader who presses Play as told will probably decide the figure has stalled and switch to Next, or wait minutes for a short sequence.
Repair: Scale each step's hold to the text that changed (a few seconds per short caption), and show a progress cue during the hold. Consider "Replay" at the end, as the reference figures do. Re-measure in a visible window first (see Limits).

### visual-7 · optional · Figure 1, "One order can become several result rows" (Asking questions with SQL)

Problem: The `qty × price` column packs two values into each cell. Step 3 with the ordinary JOIN says "1 grouped rows". Step 2 does not mark which source rows matched, so the reader compares the tables by eye. At 375 px the figure is 1,133 px tall and the selector is 856 px above Play, so the source tables, the result and the controls never fit on one screen.
Effect: These are small decoding costs, and on a phone some scrolling back and forth while stepping.
Repair: Split the column into `quantity` and `unit_price_gbp`, matching the schema the prose describes. Write "1 grouped row". Highlight the matched source rows at step 2. On narrow screens, consider putting the two source tables side by side in a compact form, or collapsing them once the reader has stepped past step 1.

### visual-8 · optional · "Where to continue" table, first row

Problem: "Working with SQL" appears twice in one cell ("Get the setup from Working with SQL, then read Designing relational data → Working with SQL → …").
Effect: The reader reads the route twice to work out whether they are being sent to the same article twice.
Repair: For example: "Designing relational data → Working with SQL (start with its setup) → Making concurrent changes correct → Building applications around a relational database."

## Limits

- The Browser pane was hidden for the whole session and could not be shown, because the session was not open in a window. Pages there run with `requestAnimationFrame` at about one frame per second. Ordinary timers fired on time, and the reference figure was measured under the same conditions, but the playback durations in visual-6 should be confirmed in a visible window. Animation smoothness and transitions could not be judged.
- Screenshots sometimes showed a stale frame immediately after a change. Every state reported here was confirmed from the DOM or a repeated screenshot.
- Keyboard use was checked with Tab, Shift+Tab, Enter and Space on the step buttons. Select values were changed through form input rather than arrow keys, because native selects open a system menu. No screen reader was used. Live regions (`aria-live="polite"`) were found on the step captions but not listened to.
- Reduced-motion behaviour was not checked.
- Technical correctness of the figures' content (for example PostgreSQL's ADD COLUMN behaviour in visual-3) was judged only as far as the figure contradicts itself or the adjacent prose. Primary-source checking belongs to the practitioner perspective.
- The child articles linked from the route table were checked only to confirm that they resolve (all ten links return 200).
