# Visual first reading · a00 Relational databases · c02

Recorded before reading the prose around the new and changed items. Each item
was looked at on its own (cropped screenshots, scoped DOM reads) at an
800 × 600 viewport in the dark theme, and every control, branch and step was
operated. One slip: a screenshot of the first query's new result table also
showed the paragraph between the code and the table. That item is otherwise
unchanged apart from the result.

## Shop tables (unnumbered figure, "The shop's four tables")

Seems to show: customers (1 Mina, 2 Arun), orders (101/1/paid, 102/2/draft,
shipped_at NULL), order_items (101 MUG 1 20.00, 101 TEA 2 8.00) and products
(MUG 1, TEA 4). Each table sits under its real column headings and is captioned
with what one row represents. PK and FK badges mark the keys. Between the
tables, arrow lines name each match ("orders.customer_id matches
customers.customer_id"). Foreign-key values have a dashed accent underline.

Unsure / noticed:
- The arrows are lines between whole tables, labelled in text, not drawn from
  column to column. The labels make the link unambiguous.
- The dashed underline on foreign-key values looks like a link but does
  nothing, and the caption does not explain it.
- At 640 px the `unit_price_gbp` heading breaks after its underscore
  ("unit_price_" / "gbp").

## First query's result table ("Result")

Seems to show: `order_id 101, status paid`, the one row the query above
returns. Clear.

## Figure 1 "One order can become several result rows" (changed)

Seems to show: as before, now with the item columns split into `quantity` and
`unit_price_gbp`. At step 2 the matched rows are outlined in the source tables
and order 102 is struck through for JOIN. Step 3 reads "1 grouped row". The
end of a run shows "Replay". Both branches work at every step.

## Figure 2 "Which facts survive a failed request?" (changed)

Seems to show: as before, now with step labels that follow the branch
("Request fails / Earlier commits stand", "Request fails / ROLLBACK",
"Reserve stock / COMMIT", "Reserve stock / All three committed"). Changed
values are outlined in green, so stock 1 → 0 is outlined when it changes. The
separate-commits failure ends with red outlines on stock and a "Mismatch: 1 mug
available · its item exists · nothing reserved" banner. A progress line sits
beside the step counter. Play ran at about 4–6 s a step (3.8, 5.9, 4.8, 5.7 s)
and ended on "Replay", with focus kept on it.

Unsure / noticed:
- The caption's key says "Outlined values changed at that step", but at the
  last step of the failure branch the red outline marks a mismatch, not a
  change (stock stays 1). The colour and banner make the difference clear
  enough.

## Code: the purchase transaction (new)

Seems to show: BEGIN; insert order 103; insert its MUG item; conditional stock
UPDATE … RETURNING; two comments ("One row back … commits", "No row back … it
sends ROLLBACK instead"); COMMIT.

Unsure / noticed:
- Read or run top to bottom, it always ends in COMMIT. The no-stock path is
  only described in a comment, so pasting it into psql when no mug is left
  would commit the order and item without a reservation: the partial state
  Figure 2 warns about.

## Figure 3 "Two buyers, one mug" (new)

Seems to show: a step-by-step schedule table with columns Step, Mina's
transaction (order 103), Arun's transaction (order 104) and committed MUG
stock. One select switches between "Reads stock, then writes what it
computed" (both read 1, both write 0 and commit; red note: two orders accepted
for one mug) and "Sends one conditional UPDATE" (Arun's update waits, rechecks
against 0, returns no row, rolls back; green note: one order accepted). The
caption states Read Committed and that both schedules were run on PostgreSQL
18.6.

Unsure / noticed:
- Clear and well suited to a schedule. Column widths shift a little between
  the two options. Arun's wait shows only as italic text; nothing draws it
  spanning steps 2–3, but "(still waiting)" covers it.

## Figure 4 "The same missing reply, two possible outcomes" (changed)

Seems to show: database and application panels through Write order 103 → Send
COMMIT → Lose connection → Retry with R103. The database panel now shows
"103 · R103 · …". At step 3 the application sees "Connection lost: outcome
unknown · The same error on both paths". At step 4, after COMMIT, the retry is
refused because R103 is already stored, so the application returns order 103.
Before COMMIT, the retry commits and order 103 is stored once.

Unsure / noticed:
- In the before-COMMIT branch, step 3 says the abandoned transaction keeps its
  locks until the server notices the session ended. Step 4 then shows the
  retry committing straight away, without saying whether the old transaction
  had been rolled back by then. A reader who has just read about held locks may
  wonder whether the retry waits on the unique R103 or the mug row.

## Figure 5 "The same orders, with two routes to find them" (changed)

Seems to show: twelve orders (101–112) on four pages in arrival order, with
order_id and customer_id columns; customer 1's orders (101, 103, 109) are
scattered. The scan reads all four pages and tests twelve rows. The index
entry for customer 1 points to pages 1 and 3, so two pages are read and three
rows fetched. Matching rows are bold and underlined only once they are read.
Both give orders 101, 103 and 109.

## Figure 6 "A required delivery instruction meets the old application" (changed)

Seems to show: an `orders` table with a delivery_instruction column, plus
Column rule and Old application version cards, over five steps.
- Early branch: ADD COLUMN … NOT NULL is rejected because order 101 has no
  value, and the column is not added. The old version's order 105 is accepted
  unchanged. Then, as a second attempt ("Suppose the shop instead…"), the rows
  are filled and the value required at once, and the old version's order 106
  is rejected with a not-null error, shown as a red "NULL · rejected" row.
- Staged branch: the column is added as optional (101 NULL), the old version's
  105 is accepted with NULL, writers are replaced and rows converted, then the
  value is required.

Unsure / noticed:
- Only the caption says that step 4 of the early branch is a separate second
  attempt; the cards just switch to a NOT NULL rule. It is understandable once
  the caption is read.

## Figure 7 "A current copy and an earlier copy answer different failures" (changed)

Seems to show: Primary, Replica and Backup cards. At the last step the chosen
source is outlined in green and labelled ("Recover from this: promote it", or
"Recover order 101 from this"). The unusable copies are dashed and labelled
("Has the deletion", "Not needed: it lacks later orders").

## "Where to continue" table (changed)

The first row now reads as one sequence and names Working with SQL once as a
link, with the setup step described in words. All nine links are distinct.
