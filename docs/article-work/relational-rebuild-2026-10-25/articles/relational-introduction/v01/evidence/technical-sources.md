# Technical sources · introduction · checked 25 October 2026

Primary pages were opened through the web tool, not inferred from search snippets:

| Claims | Primary source |
| --- | --- |
| Named tables, rows, column types, no inherent row order, relation terminology | https://www.postgresql.org/docs/18/tutorial-concepts.html |
| Primary/foreign keys, checks, rejected states and check limits | https://www.postgresql.org/docs/18/ddl-constraints.html |
| SELECT, filters, projection and ordering | https://www.postgresql.org/docs/18/tutorial-select.html |
| JOIN pairs and result columns | https://www.postgresql.org/docs/18/tutorial-join.html |
| Transaction atomicity, visibility, BEGIN/COMMIT/ROLLBACK | https://www.postgresql.org/docs/18/tutorial-transactions.html |
| UPDATE conditions, current-value expressions and changed rows | https://www.postgresql.org/docs/18/sql-update.html |
| Read Committed readers, writer waiting and condition recheck | https://www.postgresql.org/docs/18/transaction-iso.html |
| Separate parameters and result/error handling | https://www.postgresql.org/docs/18/libpq-exec.html |
| Connections, processes and client/server boundary | https://www.postgresql.org/docs/18/tutorial-arch.html |
| Index maintenance and planner choice | https://www.postgresql.org/docs/18/indexes-intro.html |
| Plans, scans, joins, estimates versus result rows | https://www.postgresql.org/docs/18/using-explain.html |
| Recovery log, durable ordering, later data file writes | https://www.postgresql.org/docs/18/wal-intro.html |
| Replicas and acknowledged progress | https://www.postgresql.org/docs/18/warm-standby.html |
| Recoverable earlier copies | https://www.postgresql.org/docs/18/backup.html and https://www.postgresql.org/docs/18/continuous-archiving.html |
| Independent read/write/delete privileges | https://www.postgresql.org/docs/18/ddl-priv.html |
| SQL, nodes, ranges, routed operations and replicated data | https://www.cockroachlabs.com/docs/stable/architecture/overview |
| Cross-range and cross-table atomic transactions; conflicts | https://www.cockroachlabs.com/docs/stable/architecture/transaction-layer |

All figures are authored illustrations. Observed SQL results are recorded in database-results.json and reproduced by verify.mjs with setup.sql: PGlite 0.5.8, actual PostgreSQL 18.3/WASM. Passed the displayed SELECT/JOIN, line total 29.00, absent payment, stocks 10/0/4, duplicate identity / missing reference / negative stock rejection, unconstrained counterexamples, rollback versus autocommit, and sequential guarded updates affecting 1 then 0 rows versus unguarded writes affecting 1 then 1. The in-memory instance was closed.

Limits: PGlite did not supply independent concurrent sessions. The race's waiting and interleaving remain an explicitly labelled illustrative schedule of the primary PostgreSQL Read Committed contract, not an observed run. No crash, replica, distributed execution or native PostgreSQL 18.6 run is claimed. Earlier owned native initdb attempts failed at host shared-memory segment allocation, including elevated and mmap attempts; initdb removed failed data directories and the script removed its socket directory. No existing server or host setting was touched. The abandoned verify.py records that attempted native method; verify.mjs is the successful verification.
