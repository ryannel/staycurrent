# Visual first reading · a00 Relational databases · c01

Recorded before reading any paragraph of the article. Each item was looked at on
its own (cropped screenshots, scoped DOM reads) at an 800 × 600 viewport, dark
theme, and every control and branch was operated. Item numbers follow page order.

## T1 · Table "Four kinds of fact in the shop"

Seems to show: the four tables of the shop (customers, orders, order_items,
products), what one row of each represents, and one example row each.

Unsure / noticed:
- The example row is packed into one cell as a `name = value, name = value`
  list, so the reader never sees a row under its column headings. The four
  relations share one table whose third column holds four different shapes.
- Keys do not visibly connect. Order 101 and customer 1 connect only if the
  reader matches `customer_id = 1` inside two strings; the order_items example
  is TEA while the products example is MUG, so the product key does not link
  across examples.
- I cannot tell which columns are keys from this table.

## C1 · Code: `SELECT order_id, status FROM orders WHERE customer_id = 1 ORDER BY order_id;`

Seems to show: the orders of customer 1. Short, formatted, plain. No result
rows shown next to it, so I cannot tell what it returns without the prose.

## C2 · Code: join of orders, customers and order_items with SUM and GROUP BY

Seems to show: one total per order with the customer's name. Short and
formatted. Again no result shown beside it; Figure 1 below appears to model it.

## F1 · Figure 1 "One order can become several result rows" (3 steps, JOIN / LEFT JOIN)

Seems to show: two source tables (orders + customers already joined; order_items),
then the joined rows (101 appears twice; 102 dropped by JOIN or kept with NULLs
by LEFT JOIN), then the grouped totals (101 = £36; 102 omitted, or NULL).

Operated: Next, Back, Reset, both select options at steps 2 and 3, Play
(advanced about every 34–41 s; ended on 3 / 3 with the button reading Play and
focus on it), keyboard Enter on Next, the "Read the model without animation"
disclosure. Next at the last step is aria-disabled and keeps focus.

Unsure / noticed:
- "orders + customers" is shown already joined, so the first join the reader
  meets is done off-stage, while the figure is about what joins do.
- The `qty × price` column packs two values into one cell.
- Step 2 does not mark which source rows matched; the reader compares by eye.
- Step 3 heading says "1 grouped rows" with the ordinary JOIN.
- With LEFT JOIN the total for 102 is NULL, not 0; the figure says why, but a
  reader may want to know how to get 0.
- The results area keeps a large empty gap below the caption at step 1, and
  the controls move a little between steps.

## F2 · Figure 2 "Which facts survive a failed request?" (5 steps × 2 save modes × 2 outcomes)

Seems to show: the request's own view and a new reader's view of three facts
(order 103, its MUG item, mugs available) as a request inserts an order, inserts
an item and reserves stock, either with each statement committing or in one
transaction, and either failing before the reservation or completing.

Operated: all four combinations through all five steps, Back, Reset, Play
(about 40 s per step), the text alternative.

Unsure / noticed:
- Clear outcome: separate commits leave an order and item with stock still 1;
  the transaction leaves nothing, or publishes all three together.
- The green emphasis marks facts that are present (order, item), not what
  changed. The stock change 1 → 0, and the inconsistent stock of 1 after a
  partial failure, are never emphasised.
- Step labels are fixed: "Reserve stock / fail" and "Finish" do not say
  COMMIT or ROLLBACK, or which branch happened.
- No SQL (BEGIN / COMMIT) is shown in or beside the figure.

## C3 · Code: `UPDATE products SET available = available - 1 WHERE product_id = 'MUG' AND available >= 1 RETURNING available;`

Seems to show: a guarded stock decrement that only succeeds if a mug is
available. Unsure what the reader sees when no mug is left (zero rows
returned?), and `RETURNING` is not portable to every engine; no dialect is named.

## F3 · Figure 3 "The same missing reply, two possible outcomes" (4 steps, 2 branches)

Seems to show: the database's state of order 103 and what the application
knows, when the connection breaks before or after COMMIT. In both branches the
application ends with "No commit confirmation · Connection lost"; the database
is either "Absent after rollback" or "Committed".

Operated: both branches through all steps, Back, Reset, text alternative.

Unsure / noticed:
- The title promises two outcomes, but only one is visible at a time; the key
  point (identical application view, different database state) needs the
  reader to remember the other branch.
- The last step, "Inspect stored state", changes nothing in either panel. The
  inspection's result appears only in the caption, so the application panel
  never shows what the inspection learned.
- The panels are mostly empty boxes with one bold line each.

## F4 · Figure 4 "The same order, with two routes to find it" (4 steps, scan / index)

Seems to show: twelve orders on three pages; a scan reads all three pages and
tests twelve rows; an index lookup goes straight to page 3. Work counts are
shown; the index itself is not drawn.

Operated: both routes through all steps, Back, Reset, text alternative.

Unsure / noticed:
- Orders 1–12 sit in id order across pages, so a reader can see 9 is on page 3
  and may wonder why a scan reads pages 1 and 2. Heap order is not id order,
  and order_id would normally be a primary key with its own index.
- "Candidate location: Page 3, found by scanning" reads oddly for a scan.
- The ring on 9 appears before "Result" says it is returned.

## F5 · Figure 5 "A required delivery instruction meets an old writer" (4 steps, 2 timings)

Seems to show: adding a required delivery-instruction column at once (blocked,
old writer cannot comply) versus adding it optional, replacing writers,
converting old rows, then requiring it.

Operated: both branches through all steps, Back, Reset, text alternative.

Unsure / noticed:
- All state is words in cards ("Required rule blocked", "Delivery instruction
  missing", "Cannot satisfy new rule"). No orders table with the new column,
  no NULL cell for order 101, no DDL. I had to read every card to follow it.
- In the early branch, step 3 says the old writer "Cannot satisfy new rule"
  although step 2 said the rule was blocked and so never applied.
- In the early branch, step 4 is labelled "Complete the transition" but nothing
  changes from step 3; the branch has no transition.

## F6 · Figure 6 "A current copy and an earlier copy answer different failures" (4 steps, 2 failures)

Seems to show: writer, current replica and retained earlier state; on writer
loss the replica still has order 101; on a mistaken deletion the replica also
loses it and only the retained earlier state has it.

Operated: both branches through all steps, Back, Reset, text alternative.

Unsure / noticed:
- The last step, "Choose the recovery input", changes nothing in the panels;
  which copy is chosen is only in the caption. No card is marked as the
  recovery source in either branch.
- Replication between writer and replica is not drawn; the cards sit in a
  grid with the retained copy wrapped beneath.

## T2 · Table "Where to continue"

Seems to show: a reading route per job, with links to ten child articles (all
resolve). "Working with SQL" appears twice in the first row ("Get the setup
from … then read … → Working with SQL → …"), which I had to read twice.
