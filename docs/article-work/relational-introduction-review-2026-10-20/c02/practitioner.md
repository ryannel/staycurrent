# Practitioner review · article · a00 Relational databases · c02

Inputs read: the frozen piece at c02 (`c02/article.astro`, `c02/RelationalNext.astro`, and `c02/components/` DecisionFigure.astro, OrderFigure.astro, RaceFigure.astro, RowsFigure.astro, ShopTables.astro, models.mjs, player.mjs, queries.mjs, scenes.mjs, verify.mjs). The SHA-256 of all twelve files and of the rendered HTML (`scratchpad/c02-site/review/relational-next/index.html`) match `c02/manifest.json`. I also read the writer's work record, `relational-introduction-review-2026-10-20/writer.md`, as an evidence record to check, not as a verdict. Unchanged inputs from c01: the brief, headings and child plans (`relational-introduction-polish-2026-10-20/context.yaml`), both source and evidence records, and both commissions. My own c01 report was used to recheck its four findings. Withheld and not read: other perspectives' reports, repair or decision records, and earlier trial or writer notes.

Scope: this is a recheck. It covers the four c01 findings, all changed or new technical content (the shop tables, the Figure 3 race, the order 103 listing and its explanation, the Read Committed and MySQL clause, durability, payment closure, the pool and idle-transaction clause, Figures 4 to 7, the lock-queue and maintenance additions, the primary, replica, promotion, failover and WAL definitions, and the Sources note), and the evidence labels on all of it.

Primary sources checked: PostgreSQL 18 documentation pages Message flow (Termination), Transaction isolation (Read Committed), Asynchronous commit, EXPLAIN, ALTER TABLE, and Client connection defaults (`idle_in_transaction_session_timeout`, `lock_timeout`), all opened during this review on 20 October 2026. Also the MySQL 8.4 page on InnoDB isolation levels (default REPEATABLE READ). PostgreSQL 18 Routine vacuuming, Continuous archiving and PITR, and Log-shipping standby were checked against the claims cited; they are standard contracts and I did not reopen them for this recheck.

Native execution in this review: I ran a fresh, isolated PostgreSQL 18.6 (Homebrew, aarch64-apple-darwin25.6.0) cluster in the session scratchpad on 127.0.0.1:57431 with default settings, stopped afterwards.
- **verify.mjs:** an unmodified copy, run with `REL3_A00_PORT=57431 REL3_A00_DB=rel3_a00_run20 node verify.mjs`, passed every assertion:
  - The fixture rows equal the shop-table models.
  - Inner and left join results are `101, Mina, 36` and `102, Arun, NULL`; the empty-order counts are 1 and 0, and the NULL tests behave as described.
  - Separate commits, rollback and the commit of the order 103 listing (returns `0`) matched.
  - Read-then-write: both buyers read 1 and orders 103 and 104 were accepted with stock 0.
  - Conditional update: Mina got `0`, Arun got no row, only 103 was accepted and stock was 0.
- **Separate probes:** in database `rel3_a00_run21`, using the fixture from `queries.mjs`, I ran probes that `verify.mjs` does not cover:
  - Figure 6: `ADD COLUMN delivery_instruction text NOT NULL` failed with "contains null values". With the column optional, the old writer's order 105 was accepted with NULL. After filling the rows, `SET NOT NULL` succeeded, and the old writer's order 106 then failed with "null value in column … violates not-null constraint".
  - Figure 4, with `purchase_attempt text UNIQUE` added:
    - (a) After the first attempt committed, a retry with R103 under a new order id failed with a duplicate-key error. Only order 103 held R103, and stock stayed 0.
    - (b) While the first attempt was open, holding R103 and the mug row, a retry waited 1.2 s until that session was killed, then committed. One order held R103.
    - (c) While a first attempt was still running and then committed, a retry waited 0.9 s and then failed with a duplicate-key error.

Verdict: pass

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | finding | c01 findings 1 to 3 are fixed and correct. New content is right: Read Committed wait-and-recheck in Figure 3 and its prose, the RETURNING decision, synchronous and asynchronous commit and the WAL definition, no automatic index on a foreign-key column, the Figure 5 counts (customer 1's orders 101, 103 and 109 on pages 1 and 3; 4 pages and 12 rows scanned against 2 pages and 3 rows), the Figure 6 DDL outcomes, the Figure 4 retry outcomes including the overlapping retry, and the Figure 7 failover and PITR boundaries. The listing is introduced as order 103's transaction "in full", but it omits two writes that later sections put in the same transaction (practitioner-6). |
| Evidence | finding | Every figure is labelled illustrative, and the race caption and the Figure 4 and 6 captions name what was also run on 18.6. Every claim I re-ran held. The Figure 4 retry and the Figure 6 rejections are backed only by manual probes. Their statements are not recorded, and the canonical sources record still says Figure 5 (the old number for this figure) is "not an executed DDL trace" and that no new native run was done (practitioner-5). The race runs reproduce the stated outcomes, not the drawn interleaving: in the native read-then-write run, Arun's write waited for Mina's row lock before overwriting. The caption claims outcomes only, so this is accurate. |
| Coverage | pass | c01 findings 2 and 4 are fixed: there is a concrete engine contrast (InnoDB defaults to Repeatable Read), and maintenance is explained (VACUUM, statistics, open transactions holding cleanup back). The payment thread now closes with a decline that cancels the order and returns the stock, plus a lost-reply inquiry. All nine heading outcomes and the route table remain covered. |
| Depth, both ways | pass | c01 finding 3 is fixed: the lock-queue sentence names a short lock-wait limit and links the owner. The additions are compact. The race figure and the listing are the useful first case the transactions brief asks for, and the comparison of isolation levels is left to a03. Nothing is too deep. |
| Ownership | pass | New hand-offs go to Managing connections and transaction lifetimes, Changing schemas without breaking applications, and Maintaining and upgrading a relational service. All linked destinations exist in the c02 build. No child topic gets a second full treatment. |

## Findings

### practitioner-5 · optional · a00 Sources note and its evidence records (writer.md, relational-introduction-polish-2026-10-20/sources.md, verify.mjs)

Problem: The Sources note says the two rejections in Figure 6 and the retry under a unique purchase-attempt identifier in Figure 4 "were run and matched". The Figure 6 caption says they were checked "with these statements". Those runs exist only as manual probes summarised in writer.md, on database `rel3_a00_run11`, and their statements are not recorded. The figure itself abbreviates the DDL as `ADD COLUMN … NOT NULL`, and the fixture has no purchase-attempt column. `relational-introduction-polish-2026-10-20/sources.md` has not been updated for c02. It still says "Figure 5 is a compatibility model, not an executed DDL trace" (that figure is now Figure 6, and it was executed), that no new native run was performed, and it uses the c01 figure numbers. I reproduced all of these outcomes, so the reader-facing claims are true.
Effect: No reader is misled now. But the evidence record contradicts the published note, and the next recheck or a change to the fixture cannot rerun these claims. The project requires observed claims to keep their version and command.
Repair: Add the Figure 6 sequence and the Figure 4 retry cases (a) to (c) to `verify.mjs`, with a `purchase_attempt text UNIQUE` column added to a copy of the fixture, or at least record their exact statements. Then bring sources.md up to c02: the new figure numbers, the 18.6 runs with their database names, and the three added sources.

### practitioner-6 · optional · a00 "Transactions and competing buyers", the order 103 listing ("Here is order 103's transaction in full") and its relation to "From a request to a committed order"

Problem: The listing is presented as the transaction "in full". Two later passages say this same transaction also commits other writes. The payment paragraph says it commits "together with a stored request to take payment". The application section and the Figure 4 caption say the order row stores its purchase-attempt identifier under a unique constraint. The listing, the fixture and the shop tables contain neither.
Effect: A practitioner who copies the "full" listing gets a checkout without the uniqueness guarantee that Figure 4 depends on, and without a recorded payment intent. A careful reader will also notice that the Figure 4 caption describes a column the tables never showed.
Repair: Call the listing the order, item and reservation steps of order 103's transaction. Then add one sentence where R103 is introduced: the shop adds a `purchase_attempt` column with a unique constraint to `orders`, and the same transaction also inserts the payment request. Alternatively, show those two lines in the listing.

## Limits

- Figure controls, playback, focus, themes and widths were not exercised in a browser. Those belong to the visual perspective. Figure states were read in `scenes.mjs`, `models.mjs` and the components, and the shop-table and join models are asserted against native SQL by `verify.mjs`.
- The probes ran on a local cluster with default settings and short artificial timings. In probe (b), a killed client process stood in for an abandoned session. That closes the socket at once, so it does not reproduce the slower detection of a silent network failure that the Figure 4 text now describes; that detection was not tested.
- MySQL behaviour is from its documentation only.
- No crash, asynchronous-commit loss, failover, PITR restore, VACUUM effect, payment-provider behaviour or managed-service term was executed. The article presents none of these as observed.
- The lock-queue sentence was checked against my c01 native probe, which used the same 18.6 build, and against the ALTER TABLE documentation. It was not re-run for c02.
