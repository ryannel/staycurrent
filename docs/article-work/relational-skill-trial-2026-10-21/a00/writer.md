# a00 Relational databases: writer record (skill trial 2, 21 October 2026)

Fresh writer, `staycurrent-write` with `staycurrent-figures` and `staycurrent-continuity`.
The orchestrator manages review; no review was arranged here. Nothing was committed.

## What was built

- Article: `src/articles/relational-trial-2/a00.astro`, rendered at `/review/relational-trial-2/`.
- Components in `src/components/relational-trial-2/a00/`:
  - `model.mjs`: the shop's schema and rows from `docs/coverage/relational-example.md`, plus every outcome the page states.
  - `scenes.mjs`: the frames of the four stepped figures and Figure 2's view, built from the model.
  - `render.mjs`: renders one frame as HTML. It runs on the server for the first frame and in the browser for later ones.
  - `ShopFigure.astro`: the stepped figures, built on `src/components/figures/stepper.mjs`.
  - `KeysFigure.astro`: Figure 2.
  - `RecoveryFigure.astro`: Figure 6.
  - `figures.css`: site tokens only.
  - `verify.mjs`: the verification script.

### Sections

All nine registry anchors are kept, in registry order. Polished headings:

1. One order changes several facts
2. Tables, keys and relationships
3. Ask for a result, then check what it means
4. Transactions and competing buyers
5. From a request to a committed order
6. Correct SQL still has to do physical work
7. Changing a database that is in use
8. Running and recovering the database
9. Choosing a database and a reading route

Other page structure:

- After the contents list there is a "task entrances" aside. It is styled as an aside, not as a heading, so the heading outline still matches the registry.
- Section 9 closes with a "database does / you still decide" table and the route table.
- A Sources section ends the page.

### Figures

1. **Figure 1, One order written as five separate changes.** Stepped, six steps.
   - It shows the products, orders and order_items tables, with three questions answered from the stored rows after each change.
   - Only the first and last states are consistent.
   - Illustrative model; every prefix state was checked on PostgreSQL.
2. **Figure 2, The shop's tables and the keys that connect them.** A schema drawing with PK and FK marks and foreign-key arrows.
   - The SVG has separate wide and narrow layouts.
   - All rows appear under their real column headings.
   - Choosing order 101, 102 or 103 marks the rows that order reaches through its keys.
3. **Figure 3, What is still due on each order?** Stepped, with two options: "Join everything, then sum" and "Sum each, then join".
   - The first option shows the 4-row fan-out of order 101 (79.00 against 39.50) and order 103 dropped by the inner join.
   - Both queries and their results were run.
4. **Figure 4, Two customers, one blue mug.** Stepped, with three options: Read, then write; Conditional update; Repeatable Read.
   - Mina's and Tariq's session lanes are shown beside the P7 stock and the mug lines.
   - Read, then write oversells: orders 103 and 104 both hold the one mug.
   - The conditional update leaves Tariq with UPDATE 0.
   - Repeatable Read gives Tariq 40001, and his retry reads 0.
   - Each schedule was run as two concurrent sessions.
5. **Figure 5, Where the connection breaks.** Stepped, with three options: Reply arrives; Breaks before COMMIT; Breaks after COMMIT.
   - The last step compares a blind retry ("sold out", although Mina bought the mug) with looking up order 103 first.
   - The database outcomes were observed by terminating the backend before and after COMMIT. The lost reply itself is modelled.
6. **Figure 6, Which recovery fits which failure?** Options only: server process crashes, machine lost, order 101 deleted by mistake.
   - Three mechanism cards: crash recovery, promote a replica, restore an earlier state.
   - Crash replay and restore to an earlier point were run. Replica promotion was not.
7. **Static tables and listings:**
   - the observed join output;
   - the constraint-rejection table (23514, 23503, 23505, 23514);
   - Mina's orders;
   - the wrong cancellation (UPDATE 2), with the corrected version;
   - Mina's order transaction;
   - an illustrative node-postgres parameter-binding listing, labelled as not run here;
   - EXPLAIN ANALYZE before and after the index;
   - the measured-work table;
   - the staged delivery_country table;
   - the requirement-to-evidence table;
   - the responsibility table;
   - the route table.

Every interactive figure has a "Read this figure as text" summary covering every option. Each caption says whether it is a model or observed, and a note under each figure says what it leaves out.

## Decisions

- **Plan sources.** `docs/coverage/relational-2026-10-19.yaml` is the older stopped-planning tree. Its root has eight headings and a "Find your next question" entrance. The registry and `relational-fanout-2026-10-19.yaml` have the reviewed nine sections.
  - I followed the registry and fanout for sections and briefs.
  - From the older root I took the task entrances (placed after the contents list) and the stopping condition: the reader can explain the database contract, separate application and operator responsibilities, and choose a next question.
  - The fanout route table is reproduced in section 9.
- **a03.** It is linked at `/review/relational-next/transactions/` with registry anchors only. Its content was not read.
  - To confirm the anchors resolve, the link check fetched that rendered page and tested only for the `id` attributes. I did not read its text.
- **Read, then write is shown inside a transaction.** This shows that a transaction boundary alone is not enough. The prose adds that the autocommit version oversold too (observed).
- **The constraint point.** The read-then-write protocol writes a calculated 0, so `CHECK (stock >= 0)` cannot catch the oversell. `stock = stock - 1` would have hit 23514, as the rejection table shows.
- **The lost reply.** Figure 5 lets the application choose order number 103 before sending. That is what makes the lookup possible. The record's `order_id` is supplied explicitly, so no schema change was needed.
- **Physical work** is reported as pages and log bytes, not timings. Parallel workers were turned off for the measurement so that page counts are complete, and the article says so.
- **`coalesce(p.paid, 0.00)`** is used so that psql prints `0.00`. With an integer 0 it prints `0`.

## Proposed example-record extensions (for the orchestrator to merge)

1. **Scaled copy for physical work.** Customers 1001–21000 (`'Customer ' || g`). Orders 1001–200000 for customer `1001 + (g*7919) % 20000`, placed from 2026-01-01 00:00 UTC plus g minutes, all paid. One line each: product cycles P3/P7/P9 with that product's price, quantity `1 + g % 2`. The core rows (including Mina's 101 and 103) are kept. The SQL is `scaledGenerator` in `model.mjs`.
2. **`orders.delivery_country text`.** Added in stages. Existing orders are backfilled with `'GB'`, on the stated assumption that the shop shipped only within the UK before. The old-application insert is order 105 for Edda Berg, placed 2026-10-21 08:00 UTC, pending, with no lines.
3. **Deletion timeline for recovery.** A clean-up script commits a DELETE of paid order 101 (with its lines and payments) at 10:10 on 20 October. Order 103 is placed at 10:15. The restore stops at 10:09. In verification, a named restore point stood in for the 10:09 time target.
4. **Tariq's order 104** (mug only, 20.00) is already in the record and was used as written.

### Continuity notes for neighbouring articles (not changed)

- a07 deletes order 101 at 09:10 and uses a later order 106 at 09:11. This article uses 10:10 and order 103 at 10:15. The orchestrator should pick one timeline.
- a01 uses bookings with "Mina Patel". a02 uses `order_lines` with different rows. a08 uses inventory and reservations with seven P7 mugs. a05 uses customer 42 and a 100,000-order fixture.
- This article does not claim that the children use identical rows.

## What ran

### PostgreSQL

- **Version:** `PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit`. Binaries are in `/opt/homebrew/bin`.
- **Command:** `node src/components/relational-trial-2/a00/verify.mjs`, with optional `A00_EVIDENCE=<path>` to write the observed values as JSON.
- **Final result:** `PASS: 214 checks on PostgreSQL 18.6 (Homebrew).`
- **Server lifecycle:** the script creates its own disposable cluster and removes it afterwards.
  - `initdb -D <tmp>/data -U postgres --auth=trust --locale=C --encoding=UTF8`, then `timezone = 'UTC'`.
  - Started with `LC_ALL=C pg_ctl -D <tmp>/data -l <tmp>/server.log -w -o "-h 127.0.0.1 -p 57611 -c unix_socket_directories= -c archive_mode=on -c archive_command='cp %p <tmp>/archive/%f' -c max_wal_senders=4" start`.
  - Each scenario runs in a fresh database made from a template.
  - On exit it stops every server it started and deletes the temporary directory.
- **Startup problems on macOS:** startup failed when the Unix socket path was too long. With `-k ''` it failed with "postmaster became multithreaded during startup" until `LC_ALL=C` was set.
- **Manual server:** an earlier hand-started server in the scratchpad (same port and options) was stopped with `pg_ctl -m fast stop` and its directory removed before the script was written.

What the script checks:

1. **Figure 1:** the stored stock, the existence of order 103 and its value after each prefix of the five changes. The consistent and contradictory pattern is checked as well.
2. **Figure 2:**
   - the join output;
   - which customer, lines and payments belong to each of 101, 102 and 103;
   - Edda's zero orders;
   - the four rejections, each by SQLSTATE and constraint name.
3. **Figure 3:**
   - both due reports, compared with the figure's final frames;
   - the 5 joined pairs;
   - order 103 missing from the inner-join version, and NULL due when the payments join is a left join;
   - the psql text `103|29.00|0.00|29.00`.
4. **Section 3 listings:** the wrong cancellation (UPDATE 2: 101 and 103), the corrected cancellation (exactly `103|cancelled`), and the verbatim psql output used in the article.
5. **Figure 4:** two real concurrent psql sessions per protocol, and the figure's final stock and mug lines compared with the database.
   - Tariq's write was observed to wait for Mina's lock.
   - **Read, then write in a transaction** ends with stock 0 and orders [103, 104]. This is the case that would fail if a protection were missing, with the stock chosen so that the oversell is visible.
   - **Read, then write in autocommit** ends with [103, 104].
   - **Conditional update:** Tariq gets UPDATE 0, and only [103] holds the mug.
   - **Repeatable Read:** Tariq gets 40001, and his retry reads 0.
6. **Figure 5:** for each break point, the state after COMMIT is acknowledged, after the backend is terminated before COMMIT, and after it is terminated after COMMIT.
   - A blind claim on the mug: UPDATE 0 when committed, UPDATE 1 when rolled back.
   - A lookup of order 103.
   - A re-insert of 103 (23505 when committed).
   - The figure's penultimate and final frames are compared with the database.
7. **Section 6, on the scaled copy (199,003 orders):**
   - Mina's lookup was a Seq Scan reading 1,268 table pages (1,271 including the sort), with 199,001 rows removed by the filter.
   - After `CREATE INDEX orders_customer_idx`, it became a Bitmap Index Scan with Bitmap Heap Scan, touching 6 pages.
   - The product report read 1,271 pages either way.
   - The index is 230 pages.
   - Write-ahead log for 10,000 inserts was 2,026,720 bytes without the index and 2,729,840 with it.
   - The text plans were captured verbatim.
8. **Section 7:**
   - the one-step `ADD COLUMN ... NOT NULL` fails with 23502;
   - expand succeeds;
   - the old insert works;
   - an early contract fails with 23502;
   - the backfill updates 4 rows;
   - contract succeeds;
   - an old insert afterwards fails with 23502.
9. **Figure 6:**
   - **After `pg_ctl stop -m immediate` and restart,** a committed row is present.
   - **Second crash test:**
     - after a base backup (`pg_basebackup -X stream`), the script created a named restore point;
     - it then deleted order 101 and inserted 103;
     - after an immediate stop, crash replay gave [102, 103].
   - **Restore test:**
     - the base backup was restored, with `restore_command`, `recovery_target_name` and promote;
     - this gave [101, 102], with order 101's two lines back.
10. **Every stepped scene:** every option has explanations, and no step repeats the one before.

### Rendering

- **Dev server:** `pnpm astro dev --port 4511`, stopped before returning. `pnpm build` was not run.
- **Browser:** the browser pane is hidden in subagents, so a headless Chromium (chrome-headless-shell 1234, from the Playwright cache) was driven over the DevTools protocol with Node 24's built-in WebSocket. Timing was checked from the page's own timers and the hold bar's transition, not by watching.
- **Site check:**
  - The site-check rules were run against the dev-rendered page placed in a one-page fake `dist`, plus the source rules for these files.
  - No issues except internal-links, which in a one-page dist reports every other page as missing.
  - I checked the article's own 59 internal links separately against the dev server. All resolve, including their anchors.
- **Stepped figures:**
  - Every stepped figure was played through every option by Next to the end and Back to the start.
  - At the end, Next stays focused with aria-disabled true, and Play reads Replay.
  - Switching options mid-figure clamps the step: Figure 4 went from 7/7 on Read, then write to 6/6 on Conditional update.
- **Keyboard:**
  - Enter and Space on the focused Next button advance the figure, and focus stays on Next at the end.
  - Tab then reaches Reset and the text summary.
  - The arrow keys move Figure 2's radio choice and update the marked rows.
- **Play:** the first hold was 8,760 ms, then 16,140 ms for the next step's changed text. The step advanced on the timer, and Pause stopped it.
- **Widths and themes:** 1280 px and 375 px, light and dark.
  - The page never scrolls sideways.
  - The narrow schema drawing replaces the wide one below 640 px.
  - At 375 px no figure table overflows. Key marks and row tags wrap under the column name rather than breaking it.
  - Code listings scroll inside their own boxes, as elsewhere on the site.
  - Screenshots of every figure in each combination were inspected.
- **Contrast:** a computed check over all figure text found nothing below 4.5:1 except the deliberately dimmed, aria-disabled end-of-sequence Next button (opacity 0.55).
- **Bug found by inspection:** Figure 5's final frame dropped order 103 from the orders table. This is fixed, and the verification script now checks the final frame too.

## Continuity pass

Each term is listed in reading order with where it is first used and where it is explained.

| Term | First use | Explanation | Result |
| --- | --- | --- | --- |
| relational database | opening P1 | opening P1 | ok |
| SQL | opening P1 ("a query language called SQL") | §3 P1 | glossed at first use; fixed |
| table, row, column, type | opening P1 (rows in tables) | §2 P1 | plain at first use, defined §2 |
| constraint | was §1 ("as a constraint"), reworded to "table definitions" | §2 before the rejection table | fixed |
| transaction | was §1 and Figure 1 note | §4 P1 | §1 and Figure 1 note reworded; §3 gives a forward gloss ("explained in the next section: nothing in it is kept until you say so") |
| primary key, foreign key (PK/FK) | Figure 2 marks | Figure 2 note and §2 P after figure | ok |
| join | §2 | §2, same sentence | ok |
| schema | §2 rejection paragraph | same sentence | was used before definition; fixed |
| SQLSTATE | rejection table | moved before the table | fixed |
| NULL | §2 | §2 | ok |
| logical schema / physical storage | §2 | §2 | ok |
| inner join | Figure 3 step 2 | same step | fixed (was undefined) |
| left join, coalesce | Figure 3 step 3 / §3 | same step | ok |
| BEGIN, RETURNING, ROLLBACK | §3 wrong change | same paragraph, forward link to §4 | fixed |
| session | §4 before Figure 4 | same sentence | ok |
| lock | Figure 4 steps | §4 paragraph before Figure 4 | fixed (was unexplained) |
| isolation, Read Committed | Figure 4 caption | §4 prose | caption reworded to avoid the term; option name Repeatable Read explained in its first step |
| serialization failure, 40001 | Figure 4 Repeatable Read step 6 | same step and §4 prose | ok |
| durability, write-ahead log | §4 contract paragraph | same paragraph | ok |
| driver, connection, pool | §5 P1 | same | ok |
| SQL injection, parameter binding | §5 | same | ok |
| page, plan, EXPLAIN ANALYZE, sequential scan, index | §6 | same paragraphs | ok |
| expand, deploy, backfill, contract | §7 table | table rows | ok |
| availability, recovery of correct data | §8 | same | ok |
| replica | Figure 6 cards | Figure 6 note and §8 | ok |
| base backup | §8 | same sentence | fixed (was undefined) |
| row versions | §8 maintenance | reworded to "space left by updated and deleted rows" | fixed |
| RTO, RPO | §8 | same | ok |

- **One name per thing:**
  - The protection names "Read, then write", "Conditional update" and "Repeatable Read" match between the controls and the prose.
  - "blind retry" and "look up order 103" are used consistently.
  - "order line" is the prose name for an `order_items` row.
  - The option labels in Figure 5 match the prose ("breaks before/after COMMIT").
- **The example:**
  - People, product names, prices, stock (12/1/4 before, 10/0/4 after), orders 101–103 with times and status, lines, and payments 501–503 all match `relational-example.md`.
  - Tariq's order 104 matches the record's race.
  - Outcomes agree across figures. Order 103 commits in Figures 1, 4 (all protections, Mina wins) and 5. Figure 6's deletion scenario keeps 103 in the live database and lacks it only in the restored copy.

## Could not check

- Replica promotion was not run. Figure 6 states this in its caption.
- The lost reply is modelled. Only the database state after ending the session before and after COMMIT was observed.
- The node-postgres listing was not executed here. It is labelled illustrative, and a04 runs the driver.
- Other engines' isolation defaults are cited from their documentation, not tested.
- No visible-window check was possible; the checks used headless Chromium only.
- The full `pnpm build` and site check were not run, as the assignment instructs.
