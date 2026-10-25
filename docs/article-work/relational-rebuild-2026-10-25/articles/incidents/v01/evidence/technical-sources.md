# Technical source checks · 25 October 2026

Primary sources opened and checked for the consequential claims:

| Source | Relevant claims |
| --- | --- |
| https://node-postgres.com/apis/pool | Checked-out clients, idle/waiting counts and release obligation; pool evidence describes one application pool. |
| https://www.postgresql.org/docs/18/explicit-locking.html | ACCESS SHARE/ACCESS EXCLUSIVE conflict; ordinary SELECT vs row locks; locks normally survive statement end until transaction ends; deadlock cycle distinction. |
| https://www.postgresql.org/docs/18/monitoring-stats.html | Active state independent of wait event; current vs cumulative measurements; refresh lag/reset scope; cached reads cannot identify drive reads without OS evidence. |
| https://www.postgresql.org/docs/18/pgstatstatements.html | Calls and per-statement planning/execution/resource totals have cumulative scope. |
| https://www.postgresql.org/docs/18/using-explain.html | EXPLAIN ANALYZE executes the actual statement; plan work, temporary operations, measurement boundaries and overhead. |
| https://www.postgresql.org/docs/18/diskusage.html | Space/quotas and full WAL volume possibly causing panic/shutdown. Initial attempt at legacy disk-full.html returned404; current page was found and checked. |
| https://www.postgresql.org/docs/18/routine-vacuuming.html | Row-version reclamation, reuse vs filesystem return; VACUUM FULL writes a new copy and needs ACCESS EXCLUSIVE plus extra space. |
| https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL | Cancelling query vs terminating session; successful signal is not necessarily completion. |
| https://dev.mysql.com/doc/refman/8.4/en/innodb-recovery.html | Incomplete-transaction rollback after crash may take substantial time and may conflict with new work. |

Also opened PostgreSQL resource settings and MySQL InnoDB parameter reference as context; no numerical default or tuning claim borrowed. Engine-independent diagnosis is an inference from matching request boundaries/dependencies/resources, not an assertion that native counters mean the same thing everywhere.

PGlite exact source SQL and arithmetic verification: evidence/verify-sql.mjs and sql-results.json. Owned in-memory instance closed in finally. Runtime reports PostgreSQL18.3, WASM32, PGlite0.5.8. No real client connection, concurrent session, pool, storage latency or filesystem failure was measured there.

Root's native support check completed on an owned disposable Linux PostgreSQL18.6 container. Read retained native-lock/scope.md, fixture.json and results.json: explicit ACCESS EXCLUSIVE holder idle in transaction; exact ordinary history SELECT active/Lock/relation, pg_blocking_pids identifies H, AccessShareLock not granted; H rollback releases exact result; FOR UPDATE contrast permits same ordinary read while holder remains open. Rows unchanged, fixture schema dropped, clients closed, fixture stopped/removed and generated credentials deleted. Actual fixture used generated authentication and an explicitly selected127.0.0.1-only port for real clients, within input/native-verification.md's permitted host-client route. Root retains launcher in coordinator runtime/native-fixture.py; article evidence retains verifier and results. No native pool count, latency or storage observation is claimed. The reader's diagrams remain conceptual schedules.
