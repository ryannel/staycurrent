# Practitioner review · ARTICLE · a00 Relational databases; a03 Making concurrent changes correct · 14e4f89

Inputs read: the complete current `src/articles/relational-trial-3/a00.astro` and `a03.astro`; their current `model.mjs`, `Shop.astro`, `Race.astro` and `TransactionFigure.astro` components; a03's current `verify.py` and the corresponding files inside its downloadable `worksheet.zip`; the root and a03 briefs, outcomes and surrounding plans in `docs/coverage/relational-2026-10-19.yaml`, with parent, sibling and child briefs and section ownership in `docs/article-work/relational-writing-2026-10-19/registry.json`; `docs/coverage/relational-example.md`; the raw commands and results in `r01/a00-repair-evidence/native-56310.json` and `r01/a03-repair-bundle-native-56322.json`; the linked primary documentation listed below; rendered accessibility text at both commissioned preview URLs. Applied the review skill and practitioner perspective supplied for this assignment. Earlier article versions, previous review reports and decisions, writing and repair narratives, other perspectives and historical files referenced by the canonical example were withheld and not opened. The coordinator supplied the fixed version and working-copy correspondence; no history comparison was performed.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Checked the consequential SQL, constraint, snapshot, update-recheck, locking, serialisation, retry, WAL, recovery, replica and engine-comparison claims against primary documentation and the supplied native command/results records; no incorrect consequential claim found in either whole article. |
| Evidence | pass | Both pieces distinguish illustrative figures from observed PostgreSQL 18.6 outcomes; observed totals and histories agree with the supplied records, and neither piece claims a crash, restore, replica or production-throughput test. |
| Coverage | pass | a00 supplies the relational model, complete conditional order reservation, application and operator boundaries, recovery distinction, task entrances and provisional shortlist; a03 covers boundaries, single-row and unique claims, cross-row decisions, engine contracts, waits, aborts, retries, uncertain outcomes, external effects and deterministic checks. |
| Depth, both ways | pass | No necessary practical decision is missing at the commissioned parent depth, and no unnecessary deep treatment was identified; production request recovery, full changing-set locking protocols, physical tuning and operating procedures remain with their owners. |
| Ownership | pass | a00 gives a useful first order-reservation answer and a03 deepens concurrency; a03 gives a complete fixed-set Serializable repair while leaving complete counted-reservation protocols and detailed engine histories to a18/a19. Neither piece duplicates a child's full treatment. |

The evidence pass compared a00's £29.00 order, £79.00 multiplied totals, £39.50 repaired totals, stock changes and rollback/refusal outcomes with the recorded SQL and outputs. For a03 it checked the split and combined booking boundaries, conditional-update lock wait and refusal, competing uniqueness check, statement versus transaction snapshots, Repeatable Read write skew, `40001` rejection and fresh restart, reservation-row counterexample, coordination-row count, same-command stale count versus next-command count, `40P01`/`25P02` behaviour and the twenty-client final state. The recorded observer queries establish actual server lock waits where claimed. The script and model inside the downloadable worksheet match the current component files byte for byte. I did not run another database instance.

The awkward cases are present: zero rows are distinct from successful booking; a constraint can reject a duplicate while stock remains available; a stable view does not reserve capacity; locking existing reservations does not protect future rows; a lock wait does not refresh an ordinary count in that same command; every invariant-changing writer must participate; retrying an old write is insufficient; a missing commit reply is not an abort; and an outbox still needs repeated-delivery handling. The overview also avoids treating a replica as a backup or an earlier restore as a complete repair of later valid work.

Primary sources checked, with their purposes:

- [PostgreSQL 18 Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html): primary and foreign keys, non-null and quantity checks, uniqueness, and the limits of cross-row `CHECK` constraints.
- [Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html) and [Aggregate Functions](https://www.postgresql.org/docs/18/functions-aggregate.html): join multiplicity, grouping, sums and retained versus omitted rows.
- [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html), [INSERT](https://www.postgresql.org/docs/18/sql-insert.html) and [Returning Data from Modified Rows](https://www.postgresql.org/docs/18/dml-returning.html): transaction boundaries, implicit statement transactions, column mapping and returned rows.
- [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html): Read Committed snapshots and update rechecks, own writes, Repeatable Read snapshots, sequence exceptions, serialisation anomalies and Serializable dependency checking.
- [Explicit Locking](https://www.postgresql.org/docs/18/explicit-locking.html) and [Serialisation Failure Handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html): row-lock scope and lifetime, deadlocks, error interpretation and complete transaction retries.
- [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) and [Database Page Layout](https://www.postgresql.org/docs/18/storage-page-layout.html): plans versus execution observations and the usual page size.
- [Write-Ahead Logging](https://www.postgresql.org/docs/18/wal-intro.html), [commit settings](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT) and [Asynchronous Commit](https://www.postgresql.org/docs/18/wal-async-commit.html): WAL-before-data ordering, acknowledged durability and asynchronous crash loss.
- [Continuous Archiving and Point-in-Time Recovery](https://www.postgresql.org/docs/18/continuous-archiving.html) and [Log-Shipping Standby Servers](https://www.postgresql.org/docs/18/warm-standby.html): recovery inputs, replay, replica freshness and acknowledgement boundaries.
- [MySQL 8.4 InnoDB Isolation Levels](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html): consistent versus locking reads and index-dependent range protection.
- [SQLite Isolation](https://www.sqlite.org/isolation.html), [Write-Ahead Logging](https://www.sqlite.org/wal.html) and [Appropriate Uses](https://www.sqlite.org/whentouse.html): separate-connection behaviour, one writer, journal-mode differences, snapshot upgrade failure, `BEGIN IMMEDIATE`, same-host WAL access and deployment suitability.

## Findings

None. No critical, medium or low practitioner finding identified. Finding numbering remains available from practitioner-1.

## Limits

This is an independent practitioner review of the two commissioned articles, not an acceptance test of the rest of the collection or a production deployment. Child and sibling articles were assessed through their allowed plans, not their drafts. Shared navigation exposes destinations outside the controlled trial; those destinations were not opened. Both preview pages returned substantive rendered accessibility text, including their initial figure states. I assessed the remaining figure states from their current model and component sources; I did not perform a visual review, prove screenshot appearance or exercise every control. A hidden browser pane does not establish visual correctness.

The supplied native records were checked as evidence, not independently reproduced. They support selected schedules on PostgreSQL 18.6, not all executions, operating-system or storage failure survival, production throughput, or universal writer participation. No new database server or database client was started, so no database cleanup was required. No build, article edit, commit or push was performed.

Timing: started **2026-10-21 19:45:09 UTC**; ended **2026-10-21 19:48:16 UTC**; duration **187 seconds**, including report preparation.
