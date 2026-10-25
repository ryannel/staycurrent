# Primary sources and execution evidence

Checked25October2026. All technical sources are primary documentation; illustrative SQL/results are also independently calculated from supplied shop facts.

| Claim | Source |
| --- | --- |
| node-postgres parameters, SQL identifiers, arrays, named statements | https://node-postgres.com/features/queries |
| Prepared statement/session lifetime and possible custom/generic plans | https://www.postgresql.org/docs/18/sql-prepare.html |
| Default parsers, Date/time precision | https://node-postgres.com/features/types |
| Rows, column names and affected count differ | https://node-postgres.com/apis/result |
| Transaction uses one client | https://node-postgres.com/features/transactions |
| Pool checkout/wait, release, destroy, end, idle errors | https://node-postgres.com/apis/pool |
| SELECT ordering, parent-first CTE and LIMIT over result rows | https://www.postgresql.org/docs/18/sql-select.html |
| Read Committed uses statement snapshots | https://www.postgresql.org/docs/18/transaction-iso.html |
| SET versus SET LOCAL | https://www.postgresql.org/docs/18/sql-set.html |
| Server statement timeout | https://www.postgresql.org/docs/18/runtime-config-client.html |
| Implicit per-statement transaction; full rollback or savepoint recovery | https://www.postgresql.org/docs/18/tutorial-transactions.html |
| SQLSTATE and separate constraint identity;25P02 | https://www.postgresql.org/docs/18/errcodes-appendix.html |
| Cancellation can arrive late; query reply must be read; termination/open transaction | https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-CANCELING-REQUESTS |
| ORM flush/commit, automatic flush, per-task/thread unit of work | https://docs.sqlalchemy.org/en/20/orm/session_basics.html |
| Lazy, joined and select-in loading | https://docs.sqlalchemy.org/en/20/orm/queryguide/relationships.html |
| Durable intention with domain change; repeated delivery remains possible | https://microservices.io/patterns/data/transactional-outbox.html |

## Observed checks

`node evidence/verify.mjs --native` passed. Verifier extracts actual article frontmatter snippets and checks the main queries/write helper. PGlite ordinary SQL phase runs in an owned memory instance closed in finally; runtime0.5.8/PostgreSQL18.3WASM. Results at pglite-results.json.

Native phase uses node-postgres8.23.1 and the coordinator-owned disposable LinuxPostgreSQL18.6 fixture on127.0.0.1:65429. Before DDL it verifies current_database=sc_app,current_user=sc_app_writer,cluster_name=staycurrent-app-sql-20261025,data_directory=/var/lib/postgresql/18/docker. Its own schema sc_application_sql is removed afterwards; every client and pool closes. No default database target, existing/user rows or credentials in evidence. Connection password read only from task-owned connection.json and never printed or copied. Coordinator retains pinned image/runtime provenance centrally.

Results at native-results.json include native version, client version, ordinary mapping, injection counterexample (unsafe3rows versus bound22P02), valid sort alternatives, batched lines, integrity error23514/constraint name, failed state25P02 and successful reuse after rollback, purchase stock, affected/returned count difference, guard rollback, split connections, retained SET versus local restoration, server timeout57014 followed by cleanup.

## Limits

No timings, byte counts, realistic load/capacity, actual ORM run, concurrent mutation/snapshot run, network loss during COMMIT, or client cancellation race were observed. Figures are conceptual illustrations checked against docs. Native split session test fixes the two client choices; it does not claim pool.query selects any deterministic sequence. PGlite output conversion is not used as evidence for pg driver conversions. No runnable download is promised. The displayed success-only transaction listing is explicitly incomplete; the lifecycle supplies required completion/error ownership, not a library-ready transaction wrapper.
