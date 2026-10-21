# Practitioner evidence · r03 · 26811e2

Started: 2026-10-21 20:05:36 UTC (first recorded clock). Ended: 2026-10-21 20:08:40 UTC, including source checking, report writing, saved-file verification and cleanup.

## Version and method

`HEAD` was `26811e2492010b4e35ccdb8c4fc2a165fa3fa5ac`. Every SHA-256 entry in `versions/r02-output.json` matched the current files. Review skill and practitioner perspective matched their `005ab6f` versions byte for byte. Read both complete article sources, their rendered previews, all explanatory figure data and rendering components, shared example data, and the current a03 worksheet implementation. Compared the download's `example.mjs`, `a03/model.mjs` and `a03/verify.py` with current source: all identical. No new native run, build or article change.

## Native evidence cross-check

- `r02/a00-repair-evidence/native-56511.json`: PostgreSQL 18.6; Read Committed, fsync, synchronous_commit and full_page_writes on. Recorded command `node src/components/relational-trial-3/a00/verify.mjs 56511`. Quantity, identity and reference rejections; order 103 complete path yielding P3=10/P7=0; summary £29; fanout £79/£79 versus independent £39.50/£39.50; two-session stale overwrite accepting two versus guarded subtraction accepting one; real observed lock wait; insufficient tea followed by rollback restoring the mug. Claims agree with raw statements/results. The record reports successful server stop.
- `r02/a03-repair-native-56520.json`: PostgreSQL 18.6, same durable settings and default Read Committed. Raw command arrays record cluster creation, local server/database and shutdown. Checked both read snapshots, stale/conditional race, split/atomic duplicate failure, failed transaction state, concurrent uniqueness wait, optimistic comparison, Repeatable Read instructor write skew, Serializable 40001 at Ravi's commit and restart counting one, reservation-row lock counterexample, class-row coordination, combined-command count 1 after an observed lock wait followed by fresh-command count 2, deadlock 40P01 and 25P02, and twenty clients yielding one returned identity plus final `0|1|t`. These are selected observed schedules; neither article claims universal proof or a crash test.

## Primary documentation checked on 21 October 2026

| Primary source | Claims checked |
| --- | --- |
| [PostgreSQL 18 constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) | Keys, uniqueness, references, null/quantity checks and inability of a row CHECK to maintain other-table counts. |
| [Table expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html), [aggregates](https://www.postgresql.org/docs/18/functions-aggregate.html) | One output row per matching pair, grouping and sums; the displayed fanout and inner-join limitation follow. |
| [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html), [sequences](https://www.postgresql.org/docs/18/functions-sequence.html) | Explicit and implicit transactions, rollback/savepoints, sequence consumption exception. |
| [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html) | Per-command versus transaction snapshots, own writes, conflicting-update condition recheck, write skew, serialisable dependency tracking and required restarts. |
| [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html), [failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html) | Row-lock scope/lifetime, ordinary readers, deadlocks, complete decision retries and lack of guaranteed progress. |
| [INSERT](https://www.postgresql.org/docs/18/sql-insert.html), [RETURNING](https://www.postgresql.org/docs/18/dml-returning.html) | Column mapping and results of actual modifications; current listings match the native fixture. |
| [Page layout](https://www.postgresql.org/docs/18/storage-page-layout.html), [EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) | Usual 8 KiB pages, access work and ANALYZE executing the statement. |
| [WAL](https://www.postgresql.org/docs/18/wal-intro.html), [asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html), [WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html) | Recoverable log before data pages, normal durable acknowledgement and acknowledged loss with synchronous_commit off. |
| [PITR](https://www.postgresql.org/docs/18/continuous-archiving.html), [standby servers](https://www.postgresql.org/docs/18/warm-standby.html) | Base copy plus continuous log history, earlier recovery target, replica application and freshness/acknowledgement boundaries. |
| [MySQL 8.4 InnoDB isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html) | Snapshot consistent reads versus current locking statements, index/query-dependent range and gap protection. |
| [SQLite isolation](https://www.sqlite.org/isolation.html), [WAL](https://www.sqlite.org/wal.html), [appropriate uses](https://www.sqlite.org/whentouse.html) | One writer, reader/writer modes, stale-snapshot upgrade restart, IMMEDIATE and same-host WAL access. |

## Coverage and ownership reasoning

The canonical shop and class fixture, rather than the coverage tree's illustrative two-depot names, supplies the same fixed-set multirow dependency and serialisable repair. The root provides the complete reservation walkthrough and high-level design/query/execution/application/recovery/distribution/selection answers. a03 adds sufficient choices to justify one-row, uniqueness and multirow protection, with whole-operation failure handling and deterministic testing. The awkward cases are taught: an empty lock target, stale count despite acquiring a lock, successful non-negative overselling, duplicate booking, failed transaction, bounded retry and unknown commit outcome. No required outcome is missing. No unnecessary specialist mechanism was identified: lock-mode catalogues, complete changing-set protocols, physical recovery and application replay/outbox machinery remain with their planned owners. Those conclusions use plans and registry, without reading neighbouring article bodies.

## Browser and cleanup

Read the rendered accessibility trees at both supplied preview URLs in one hidden IAB tab; initial figures rendered with canonical committed values and model labels. No screenshot-based layout audit or exhaustive control playback was performed: this is a practitioner review, and all scripted states were read in the current model sources. Closed the temporary tab before report completion. Created no PostgreSQL cluster, sessions, server, worktree or other process; no native cleanup was needed. Existing reviewer/author processes were left alone.
