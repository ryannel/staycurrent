# Writer record · a00 Relational databases · c01 repairs

Writer: worker session, 20 October 2026. Files changed: `src/articles/relational-next/a00.astro` and `src/components/relational-next/a00/*`. New files are `ShopTables.astro`, `RaceFigure.astro`, `player.mjs` and `scenes.mjs`. Nothing is committed or pushed.

## Figure numbers

The shop tables are an unnumbered figure. The new race is Figure 3, so the review's Figures 3–6 are now Figures 4–7:

| Review number | Now | Figure |
| --- | --- | --- |
| 3 | 4 | Missing reply |
| 4 | 5 | Index lookup |
| 5 | 6 | Delivery instruction |
| 6 | 7 | Recovery |

## New heading

"Keeping the service and its data" is now **Running and recovering the database**. Its anchor, `operate-for-the-failure-you-must-recover-from`, is unchanged, as is every other anchor. The coordinator still needs to update the registry and coverage-map titles.

## Changes by finding

### visual-1: shop tables

The "Four kinds of fact" table is replaced by `ShopTables.astro`, which shows four connected tables:

- customers, orders, order_items and products, under real column headings.
- PK tags on primary-key columns, and FK tags that name their target table.
- Underlined foreign-key values.
- An arrow line between tables that names both ends, for example "orders.customer_id matches customers.customer_id".
- Exactly the rows used later: Mina, Arun, orders 101 and 102, both items of 101, and MUG and TEA stock.

The layout is one connected column at every width. A three-column desktop layout overflowed the article column.

### visual-2: Figure 5, index lookup

- Twelve invented orders arrive in mixed order, three per page, with customer 1 on pages 1 and 3.
- The scan reads 4 pages and 12 rows. The `customer_id` index reads 2 pages and 3 rows.
- Both routes return orders 101, 103 and 109.
- Pages are now laid out two by two, because four across overflowed.

### visual-3 and editorial-3: Figure 6, delivery instruction

- The early branch now shows the failed `ADD COLUMN … NOT NULL`, with the old version's order 105 accepted unchanged.
- It then shows a fill-and-require-at-once path, where the old version's order 106 is rejected.
- Stage labels follow each branch, and an orders mini-table shows the old version's next order.
- The caption and the prose both say existing rows are filled from courier records.

### teaching-1 and teaching-2: race and order 103 listing

- New `RaceFigure.astro` (Figure 3) is a four-step schedule with a switch between read-then-write and the conditional `UPDATE`.
  - Read-then-write: both buyers read 1 and both commit; orders 103 and 104 are accepted.
  - Conditional `UPDATE`: Arun waits, rechecks against 0, gets no row and rolls back.
- It is labelled as an illustrative schedule and cites the PostgreSQL 18.6 runs.
- The full order 103 transaction is shown as one `checkout` listing.
- The prose explains `SET`, `WHERE` and `RETURNING`.
- Isolation-level comparisons are left to Making concurrent changes correct.

### practitioner-1, teaching-4 and visual-5: Figure 4, missing reply

- The rollback text now says the server rolls back when it notices the session has ended, and that the transaction keeps its locks until then.
- The final step of each branch shows something new: R103 stored once, or the retry refused and order 103 returned.
- The driver section adds one clause on `idle_in_transaction_session_timeout`.

### visual-5 and editorial-2: Figure 7, recovery

- The last step marks the copy to recover from as chosen and the others as unusable. The final stage is labelled "Choose what to recover from".
- The prose defines primary (the server that accepts every change), replica, promotion and failover at first use.
- "Writer" is no longer used for any of these.

### visual-4: Figure 2, changed values

- Values that changed at a step are outlined, including stock 1 → 0.
- The inconsistent stock is marked, with a "Mismatch" line.
- The last two stage labels follow the chosen branch: "Request fails", then "ROLLBACK" or "Earlier commits stand", or "Reserve stock", then "COMMIT" or "All three committed".

### visual-7 (labels only): Figure 1

- `quantity` and `unit_price_gbp` are now separate columns.
- Step 2 marks rows as matched, kept or dropped.
- Captions read "1 grouped row" and "3 rows joined" correctly.
- The source tables keep their layout, as decided.

### visual-6: playback timing

- `player.mjs` times each hold from the characters that changed in the step's live text: 1.2 s plus 45 ms per character, held between 3.5 s and 24 s.
- In Figure 4, Play ran 6.6 s, 6.6 s, then 19 s for the long connection-failure step, where the earlier timing held each step for 34–42 s.
- Pause is still available. Keyboard focus stays on Back at the first step, and on Next or Replay at the last step.

### practitioner-2

One clause says that MySQL's InnoDB defaults to Repeatable Read and that defaults differ between engines.

### practitioner-3

One sentence says that a quick schema change still waits for a strong lock, that requests queue behind it, and that a short lock-wait limit helps. It links Changing schemas without breaking applications.

### practitioner-4

Two sentences cover `VACUUM`, planner statistics and long transactions that hold cleanup back. They link Maintaining and upgrading a relational service.

### teaching-3

Three sentences close the payment thread:

- Order 103 commits as `pending_payment` with a stored payment request.
- A background worker, defined at first use, asks the provider.
- A decline cancels the order and returns the mug in one transaction.
- If the provider's reply is lost, the worker asks the provider about that payment-request identifier before trying again.

### teaching-5 and editorial-6

- "Pages and indexes" in the tables section is glossed and linked to the work section.
- The article now uses one name each:
  - "reserving the mug", for the stock change.
  - "item", for an order_items row.
  - "constraints", defined at first use.
  - "backup", for the earlier copy.
  - "background worker", for the process that asks the payment provider.
- "Waiting for payment" is tied to `pending_payment`, and the draft status of order 102 is explained.

### editorial-1

Planning words are replaced in the introduction, the follow-up links and the closing paragraph. The coordinator changed the layout's "Read the collection" box.

### editorial-4, 5, 7, 8, 9, 10 and 12

These are plain-wording repairs:

- editorial-4: durability is rewritten around the write-ahead-log save and asynchronous commit.
- editorial-8: the `EXPLAIN` and slow-page wording is rewritten.
- editorial-9: the retry wording now covers an overlapping retry waiting under the unique constraint.
- editorial-10: the driver section opens with why the application matters.
- The remaining items get smaller wording fixes, including "encryption keys, credentials, configuration and capacity" and dropping "before its detailed procedures".

### editorial-13 and visual-8

- Every route-table row is now a job.
- Working with SQL appears once in a row: practice-database setup comes first, then the rest of the article in the reading order.

### Sources

- Three added sources, each fetched on 20 October 2026:
  - MySQL 8.4, InnoDB transaction isolation levels.
  - PostgreSQL 18, Client connection defaults.
  - PostgreSQL 18, Routine vacuuming.
- The sources note now names seven illustrative figures and lists which outcomes were also run natively.

### Size

The prose grew from about 3,440 to 4,170 words, counting text only, sources included. Most of the increase is the race explanation and listing, the four practitioner additions, the payment close and the definitions. Each addition is kept to the size the decisions file states.

## Checks run

### Native PostgreSQL

The checks ran on a fresh scratch PostgreSQL 18.6 cluster (Homebrew binaries, C locale, TCP on 127.0.0.1:57461), which was stopped afterwards.

`verify.mjs` was updated with the models and run on the final files, on database `rel3_a00_run12`. An earlier run on `rel3_a00_run10` also passed. It covers:

- The fixture rows equal the shop tables' models.
- The SQL results and the separate-commit and rollback models.
- A commit of the order 103 listing.
- A native two-session read-then-write race: both read 1, both commit, orders 103 and 104 accepted, stock 0.
- A native conditional race: Mina gets 0; Arun waits, gets no row and rolls back; only 103 is accepted.

Separate manual probes on `rel3_a00_run11` back Figure 6 and the Figure 4 prose. They are not part of `verify.mjs`:

- `ADD COLUMN … NOT NULL` failed with "contains null values".
- With the column optional, the old writer's insert of 105 was accepted with NULL.
- After filling the rows and adding `SET NOT NULL`, inserting 106 failed with a not-null violation.
- With a unique purchase-attempt column, a retry with R103 waited about 1.6 s for the open attempt to roll back, then succeeded. A second R103 was refused with a duplicate-key error.

### Browser

The checks ran in the dev server at `/review/relational-next/`.

- **Every figure, step and branch:** I stepped through every figure in every branch by script and read the explanation text at each step. I also took screenshots of the key steps:
  - Figure 2, the failed separate commits.
  - Figure 3, both schedules.
  - Figure 4, the lost reply.
  - Figure 5, the index route.
  - Figure 6, the early requirement.
  - Figure 7, the deletion.
- **Themes and widths:** light and dark at 1200 px, and light and dark at 375 px.
- **Overflow at 375 px:** with every figure state checked, there is no horizontal page overflow, and no figure box scrolls internally.
- **Fixes the browser checks prompted:**
  - The three-column shop layout became one column.
  - The class `wide` collided with a global breakout class and pushed Figure 6's table outside the figure; it was renamed.
  - Figure 1's step list used the class `flow`, which collides with a draft-wide style; it was renamed.
  - Figure 5's pages were laid out two by two.
  - The Figure 1 and shop-table headings were allowed to wrap on phones.
  - The long setting name was allowed to wrap; it had caused a 13 px page overflow.
- **Playback and focus:** Play advanced Figure 4 through all steps and ended on Replay with focus kept. Back at the first step keeps focus.
- **Build:** `pnpm build` completed and the site check passed all 13 rules.

## Not done or not verified

- No screen reader was used. Text alternatives and aria labels were checked by reading the DOM only.
- Reduced-motion playback was not exercised in the browser.
- The order 104 attempt in Figure 3 and order 104 in Figure 5's invented lookup data belong to different customers. Figure 5 says its orders are invented, but a careful reader may notice.

## c03 round

This round repairs the c02 optional findings that were accepted. Two coordinator edits made after c02 are kept: the box in `RelationalNext.astro`, and the synced heading. The coordinator's customer list in `scenes.mjs` was superseded by the renumbering under teaching-8 below. Nothing is committed or pushed, and every anchor is unchanged.

### Lock (teaching-6, editorial-1)

- The race text now defines a **lock** where the reader sees it: a claim that stops other transactions changing the row until Mina's transaction commits or rolls back.
- Figure 3's conditional rows name the locked row. Its first row now says "one row changed and returned, with available = 0".
- The schema-change sentence is split into three.

### Reading order (teaching-7)

The connections and maintenance links now come after their longer articles, each introduced as "Its follow-up, …".

### Order numbers and purchase attempts (teaching-8, practitioner-6)

- **Figure 5 orders:** the orders are now 101, 102, 103 (the earlier orders), then 105–113 (invented). There is no 104, and the caption says so: Figure 3's conditional `UPDATE` refused Arun's attempt. Customer 1's result is still orders 101, 103 and 109.
- **Figure 6 orders:** the old version's orders are now 114 and 115, so no number is reused or goes backwards.
- **Listing label:** the listing is now labelled as the order, item and reservation steps of order 103's transaction. It stops at `RETURNING`, and the prose gives the `COMMIT` and `ROLLBACK` branches (visual-2).
- **Purchase attempt:** section 5 now says the shop adds a `purchase_attempt` column to `orders` with a unique constraint, written in the same transaction as the order. Figure 4's caption says the same.
- **Payment request:** the payment paragraph now says the same transaction inserts the payment request.

### Wording (editorial-2 to editorial-7)

- **Figure 6 labels:** stages read "Old version places an order" and "Old version places another order". The staged option reads "Once every version sends it and rows are filled", and "writers" is gone from the figure and prose.
- **Figure 3 caption:** it is now a full sentence that points to the explanation below the figure.
- **Upkeep paragraph:** rewritten to cover old row versions, `VACUUM`, and `ANALYZE` statistics, with autovacuum running both. These are checked against Routine vacuuming.
- **Paragraph split:** the race paragraph is split into the lock, Read Committed, and engine defaults with the `CHECK` guard.
- **Sources and caption:** the sources sentence and the Figure 6 caption now say "reproduced on PostgreSQL 18.6".
- **Terms:** "session" is glossed at first use, and the checklist says "payment-request identifiers".

### Evidence (practitioner-5)

- **New checks in verify.mjs:**
  - Figure 4 retry cases (a) to (c), using a `purchase_attempt text UNIQUE` column.
  - Figure 6's early and staged sequences.
- **Fixed check:** the `checkout` check now appends `COMMIT;`, because the listing stops at `RETURNING`.
- **Run:** the script ran and passed on a disposable PostgreSQL 18.6 cluster (`rel3_a00_run13`), which was stopped afterwards.
- **Record:** the statements, versions and coverage are in `sources-c03.md`.
- **After the run:** later edits changed only figure text, not the SQL or the asserted outcomes.

### Visual (visual-1, visual-3, visual-4)

- **Headings (visual-1):** column names no longer break inside headings; the `<wbr>` tags are removed. At 375 px:
  - The shop tables fit after tightening the phone padding and tag size.
  - Figure 1's joined result scrolls inside its frame. That frame is now a focusable region with a focus outline.
- **Contrast (visual-3):** warning text in Figures 2, 6 and 7 now uses a component-local mix of `--coral` and `--color-text`. NULL and dropped-row text uses `--color-text-secondary`, and Figure 7's unusable cards lose their 0.8 opacity. No site token changed. Measured contrast:

| Text | Light | Dark |
| --- | --- | --- |
| Warning text | 5.88:1 | 7.65:1 |
| NULL | 6.61:1 | 6.83:1 |
| Dropped row | 6.05:1 | 6.15:1 |

- **Keys (visual-4):** the shop caption explains the dashed foreign-key underline. Figure 2's caption says "red outlines mark facts that disagree".
- **Controls:** labels on the figure controls no longer push the dropdowns past the figure edge at 375 px.

### Checks

- **Browser:** checked in the dev preview.
  - At 375 px, light and dark: every figure stepped through in every branch, with no page overflow and every dropdown inside its figure.
  - At 1200 px, light: Figure 5.
  - Screenshots: the listing, the shop tables, Figures 3 and 6, Figure 7 in dark, and Figure 5 at desktop width.
- **Contrast:** measured from computed colours in both themes, as in the table above.
- **Build:** `pnpm build` passed all 13 site-check rules. The dev server is stopped.

### Not done

- No screen reader was used.
- Reduced motion was not tried.
- The long `INSERT` column lists in the order 103 listing still scroll sideways at 375 px. The commit and rollback branches no longer depend on them.
