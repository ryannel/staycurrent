# Practitioner verification evidence · a00 and a03 · 80276a4

The assigned fixed source commit was confirmed as `80276a46749c6c617f96bb0097a088417f5a1a41`. The review covered both articles from beginning to end, their article-specific component sources and models, and the current downloadable worksheet. The worksheet archive's `example.mjs`, `a03/model.mjs` and `a03/verify.py` match the corresponding working source byte for byte.

## Native verification

All runs used a fresh disposable cluster and database, with `/opt/homebrew/opt/postgresql@18/bin` tools. No existing application database was contacted. Each invocation used a different port:

- `python3 src/components/relational-trial-3/a03/verify.py 56220 > docs/article-work/relational-skill-trial-3/r01/practitioner-a03-native-56220.json`: sandbox prevented shared-memory creation during initdb; no server started, and the temporary directory was removed.
- `node docs/article-work/relational-skill-trial-3/r01/practitioner-a00-verify.mjs 56221`: same sandbox failure before server start; evidence confirms shutdown status and removal.
- `python3 src/components/relational-trial-3/a03/verify.py 56222 > docs/article-work/relational-skill-trial-3/r01/practitioner-a03-native-56222.json`: successful run outside the sandbox's shared-memory restriction, 235 transcript entries, all counterexample and repair assertions passed. The recorded native engine was PostgreSQL 18.6 (Homebrew). Read Committed, fsync, synchronous_commit and full_page_writes were recorded. Stale assignments accepted two bookings; the guarded statement waited and rejected the second; duplicate and forced-error rollback cases behaved as described; Repeatable Read allowed both instructor departures and Serializable rejected one; the fresh restart counted one; returned reservation-row locks did not exclude distinct insertions; the stable class lock followed by a fresh count did; the forced deadlock produced 40P01 and the failed victim produced 25P02. Twenty clients produced one acceptance and nineteen refusals. The final pg_ctl stop succeeded, and the temporary directory was independently checked absent.
- `node docs/article-work/relational-skill-trial-3/r01/practitioner-a00-verify.mjs 56223`: successful PostgreSQL 18.6 run; 22 checks passed. The root harness was copied with only its model import and evidence destination adjusted so every review write stays in this review's directory. The article and model were unchanged. Schema rejections, order 103 total 29.00, inflated join 79.00/79.00, repaired totals 39.50/39.50, an unequal-payment counterexample, two competing buyers, refusal after a real lock wait, and rollback after insufficient tea passed. Server stop succeeded, and the temporary directory was independently checked absent.

The article's existing evidence was also inspected: a00 native-56130 failed at initdb and native-56131 passed; a03 native.json failed at initdb, while native-56141 and native-56142 passed with shutdown records. Failed initial attempts are not treated as observations of database behaviour.

## Primary sources checked

- https://www.postgresql.org/docs/18/ddl-constraints.html — NOT NULL, CHECK, primary and foreign keys, unique claims, and the unsupported cross-row CHECK assumption.
- https://www.postgresql.org/docs/18/queries-table-expressions.html — join multiplicity and grouping.
- https://www.postgresql.org/docs/18/tutorial-transactions.html — transaction boundaries, implicit statement transactions and savepoints.
- https://www.postgresql.org/docs/18/transaction-iso.html — statement snapshots, own writes, waiting update rechecks, Repeatable Read conflicts and write skew, Serializable dependency checks and sequence exceptions.
- https://www.postgresql.org/docs/18/explicit-locking.html — row-lock conflict scope, lock lifetime and deadlock handling.
- https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html — SQLSTATE 40001/40P01, complete decision retries and persistent uniqueness failures.
- https://www.postgresql.org/docs/18/storage-page-layout.html — normal 8 KiB pages.
- https://www.postgresql.org/docs/18/using-explain.html — chosen plans and observed execution under ANALYZE.
- https://www.postgresql.org/docs/18/wal-intro.html — log-before-data ordering and replay.
- https://www.postgresql.org/docs/18/wal-async-commit.html — acknowledgement and crash-loss boundary.
- https://www.postgresql.org/docs/18/continuous-archiving.html — base backup plus retained log history and point-in-time recovery.
- https://www.postgresql.org/docs/18/warm-standby.html — copied changes, asynchronous loss windows and standby operation.
- https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html — ordinary snapshot reads, current locking reads and index-dependent gap/range coverage.
- https://www.sqlite.org/isolation.html — separate-connection defaults, the single writer, journal/WAL modes, stale-snapshot upgrade failure and BEGIN IMMEDIATE.
- https://www.sqlite.org/wal.html — same-host access requirement.

The system shortlist is explicitly conditional on an illustrative workload. It is not presented as a measured product acceptance or cost comparison.

## Rendered-page boundary

Both assigned local URLs returned HTTP 200; article text was captured in `practitioner-pages.json`. Local HTTP initially required the same sandbox exception as the verifier runs. Browser panes were kept hidden as instructed. No visual layout or interactive-control execution was assessed; figure claims were checked through their complete model states, source wiring, text alternatives and native outcomes.
