# Consequential claim checks

Primary documentation checked25October2026 with web opens, including the relevant sections. Article links point directly to these sources.

| Source | Consequential claim checked |
| --- | --- |
| https://www.postgresql.org/docs/18/explicit-locking.html | Row-mode conflicts, normal transaction lifetimes, ordinary snapshot reads unaffected by row locks, compatible shared locks, table modes, advisory scope/lifetime; cycle, victim unpredictability, order and upgrade prevention. |
| https://www.postgresql.org/docs/18/transaction-iso.html | RC new statement snapshots and guarded-update recheck; RR first-query snapshot and failure on a row actually updated since snapshot. |
| https://www.postgresql.org/docs/18/applevel-consistency.html | Explicit blocking and snapshot protocol are separate obligations; unchanged locking versus an actual guard-row update. |
| https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE | Lock returned rows, aggregation restrictions, CTE locking scope, NOWAIT/SKIP LOCKED semantics and row-only qualification; unordered result sets are not acquisition-order promises. |
| https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html | 40P01 and complete transaction retry, including the decision logic. |
| https://www.postgresql.org/docs/18/functions-info.html#FUNCTIONS-INFO-SESSION | pg_blocking_pids includes holders and conflicting requests ahead in queue. |
| https://www.postgresql.org/docs/18/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW | Transaction/query time, idle-in-transaction state and lock wait interpretation. |
| https://www.postgresql.org/docs/18/runtime-config-client.html | Per-acquisition lock_timeout, per-statement statement_timeout and idle transaction lifetime. |
| https://www.postgresql.org/docs/18/runtime-config-locks.html | deadlock_timeout delays deadlock checks; default1s; it does not bound a noncyclic wait. |

The shop's29.00 versus two20.00 attempts, authority choice, required participation of invalidating writers and the snapshot comparisons are worked reasoning, checked with the retained verifiers. Conceptual schedules are labelled as such and no wait duration is inferred.

PGlite: `verify-sql.mjs` extracts the seven displayed SQL blocks from the actual article source and executes them in their relevant sequence, with the decision block exercised for both A and B. PostgreSQL18.3 in @electric-sql/pglite0.5.8/WASM reports29.00/0 then29.00/20.00, first guarded stock0 and final payment20.00. Instance closed. Actual full version/results and source/verifier hashes: `sql-results.json`.

Native: `verify-native.mjs` targets only root's explicit disposable fixture and asserts host/port config plus current database/user/cluster_name/exact data_directory/version before writes. Restricted connection returned EPERM; root then ran the verifier in permitted context. Final `native-results.json` reports passed on PostgreSQL18.6/Debian/aarch64 with pg8.23.1, exact verified cluster/database/user/directory, six scenarios and all clients closed. Child-row locking committed40; later-statement RC read20 and refused another20; RR earlier snapshot read0 and committed40; materialised lock-first CTE at RC read0 and committed40; native deadlock returned40P01, with A the observed victim; both P3-before-P7 paths completed. Stock remained10/0/4 in lock-only scenarios. The drawing leaves the victim unspecified. Native fixture lifecycle/cleanup belongs to root.

The source paragraph was subsequently updated to state these actual runtimes; later normal-authoring prose, caption/link and presentation corrections also leave tested SQL, model schedules and the protected protocol unchanged. Final source hashes are recorded by authoring completion separately from the exact hashes captured by each verifier.

Limits: SQL syntax/sequential checks alone do not establish concurrency; selected native schedules do not prove all interleavings or external payment recovery; no timings or throughput claim. No other database engine is measured or described as equivalent.
