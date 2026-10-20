# Practitioner review · article · a00 Relational databases · c03

Inputs read: the frozen piece at c03 (`c03/article.astro` and `c03/components/` DecisionFigure.astro, OrderFigure.astro, RaceFigure.astro, RowsFigure.astro, ShopTables.astro, models.mjs, player.mjs, queries.mjs, scenes.mjs, verify.mjs). The SHA-256 of all eleven frozen files and of the rendered HTML (`scratchpad/c03-site/review/relational-next/index.html`) match `c03/manifest.json`. The layout `RelationalNext.astro` is not in the c03 folder; its manifest hash is identical to c02's, so it is unchanged. I also read the new evidence record `relational-introduction-review-2026-10-20/sources-c03.md`, as evidence to check, and my c02 report for its two findings. I diffed c03 against c02 to find what this round touched. Unchanged inputs from earlier rounds: the brief, child plans and commissions. Withheld and not read: other perspectives' reports and repair or decision records.

Scope: a narrow recheck of c02 findings practitioner-5 and practitioner-6, and of this round's technical changes:
- the upkeep paragraph (`VACUUM`, `ANALYZE`, autovacuum);
- the definitions of lock and session, and the restructured Read Committed paragraphs;
- the schema-change lock sentence;
- the listing label and the COMMIT/ROLLBACK prose;
- the `purchase_attempt` and payment-request sentences;
- the Figure 3 schedule text;
- Figure 5's order numbering and Figure 6's order numbers;
- the Figure 4 and Figure 6 captions and the Sources note.

Primary sources checked:
- PostgreSQL 18, Explicit locking: opened during this review on 20 October 2026. It confirms that ACCESS EXCLUSIVE conflicts with every mode and is taken by "many forms" of ALTER TABLE. SHARE UPDATE EXCLUSIVE is taken by `CREATE INDEX CONCURRENTLY` and "certain" ALTER TABLE variants, and SHARE is taken by plain `CREATE INDEX`. Row-level locks "block only writers and lockers to the same row".
- PostgreSQL 18, ALTER TABLE: checked in the earlier rounds. `VALIDATE CONSTRAINT` takes SHARE UPDATE EXCLUSIVE.
- PostgreSQL 18, Routine vacuuming and Client connection defaults: checked against the cited claims.

Native execution in this review: I ran a fresh, isolated PostgreSQL 18.6 (Homebrew, aarch64-apple-darwin25.6.0) cluster in the session scratchpad on 127.0.0.1:57441 with default settings, stopped afterwards. An unmodified copy of c03 `verify.mjs`, run with `REL3_A00_PORT=57441 REL3_A00_DB=rel3_a00_run30 node verify.mjs`, passed every assertion:
- the fixture rows and the SQL results;
- separate commits, rollback, and the listing followed by `COMMIT` (returns 0);
- the read-then-write race (orders 103 and 104 accepted, stock 0) and the conditional race (only 103 accepted);
- Figure 4: (a) a retry after commit was refused with `orders_purchase_attempt_key`; (b) a retry while the first attempt was open waited 1,023 ms, then committed once; (c) a retry overlapping an attempt that then committed waited 719 ms, then was refused;
- Figure 6: `ADD COLUMN … NOT NULL` failed with "contains null values"; the old version's order 115 was rejected after the value was required; the staged path completed.

Verdict: pass

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | finding | practitioner-6 is fixed: the listing is labelled as the order, item and reservation steps, the prose says when the application sends COMMIT or ROLLBACK, and the `purchase_attempt` column and the payment-request insert are placed in the same transaction. The lock and session definitions are right. The upkeep paragraph is right: old row versions are kept for running transactions, VACUUM reclaims them, ANALYZE refreshes statistics, autovacuum runs both, and an open transaction holds cleanup back. Figure 5's renumbering is consistent: there is no 104 under the conditional outcome, customer 1's rows are still 101, 103 and 109 on pages 1 and 3, and the work counts are unchanged. Figure 6's 114 and 115 match the script. The rewritten schema-change sentence now overstates the lock (practitioner-7). |
| Evidence | pass | practitioner-5 is fixed. `verify.mjs` now scripts Figure 4 cases (a) to (c) and both Figure 6 paths, and `sources-c03.md` records the version, cluster, connection, database, exact command and per-claim coverage. It separates the documentation-only claims (lock queue, timeouts, VACUUM and ANALYZE, asynchronous commit, failover, PITR, MySQL) from executed ones. The Sources note and the captions claim only what the script asserts, and a fresh rerun reproduced every result. One nuance: case (b) retries under the same order id, 103, so its wait could come from the order_id primary key or the mug row lock as well as from R103. Case (c), which uses order 150, isolates the purchase-attempt constraint. The article's claim is supported by the two cases together. |
| Coverage | not applicable | This round removed and added no outcomes beyond those above. |
| Depth, both ways | pass | The additions are definitions and clarifications at introduction depth. The maintenance link moved to the operations hand-off, and the connections link moved to the applications hand-off; both still exist. |
| Ownership | pass | Lock design stays with the transaction and locking articles, upkeep with Maintaining and upgrading, and schema-change locking with Changing schemas without breaking applications. |

## Findings

### practitioner-7 · optional · a00 "Changing a live database", paragraph beginning "The database has physical work to do as well"

Problem: c02's accurate "must wait for a strong lock" became "Even a quick schema change needs a lock that blocks all other use of the table". That is ACCESS EXCLUSIVE, and PostgreSQL 18 takes it for "many forms" of ALTER TABLE, including the nullable `ADD COLUMN` and `SET NOT NULL` in this section. It is not universal. `CREATE INDEX CONCURRENTLY` and `VALIDATE CONSTRAINT` take SHARE UPDATE EXCLUSIVE, which does not block reads or writes. Plain `CREATE INDEX` takes SHARE, which blocks writes but not reads.
Effect: The advice the reader acts on, a short lock-wait limit and retry, is still right. But the reader learns that every schema change must stop all use of the table. That hides the lower-lock forms a practitioner reaches for first, which the linked child teaches.
Repair: Qualify the sentence, for example: "Even a quick change, such as adding a column, usually needs a lock that blocks all other use of the table." Optionally add that some operations have lower-lock forms, covered in Changing schemas without breaking applications.

## Limits

- This was a narrow recheck. I did not re-review content unchanged since c02, beyond confirming that it still matches the script.
- No browser check of figure states, themes or widths was made. That belongs to the visual perspective.
- Case (b) ends the first session with `pg_terminate_backend`. As the evidence record says, slow detection of a silent network failure is not tested.
- VACUUM and ANALYZE behaviour, the lock-queue effect and the timeouts rest on the PostgreSQL 18 documentation. My lock-queue observation from c01 used the same 18.6 build but was not repeated here.
