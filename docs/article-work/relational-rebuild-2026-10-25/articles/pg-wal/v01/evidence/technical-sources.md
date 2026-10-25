# Primary technical sources

Checked 26 October 2026 against versioned PostgreSQL 18 manuals via web tools.

- https://www.postgresql.org/docs/18/functions-admin.html — three progress functions and their moving scope, pg_wal_lsn_diff, pg_ls_waldir/control inspection.
- https://www.postgresql.org/docs/18/datatype-pg-lsn.html — byte position, hexadecimal rendering, subtraction.
- https://www.postgresql.org/docs/18/runtime-config-wal.html — synchronous_commit commit-time scope, local/remote waits, fsync and full_page_writes, defaults/pacing.
- https://www.postgresql.org/docs/18/wal-async-commit.html — bounded writer window, dependent database transactions, external effects, immediate shutdown and consistency distinction.
- https://www.postgresql.org/docs/18/wal-configuration.html — checkpoint redo point, page writes/images, pacing, recycling, archives/slots/keep/summarisation retention, max_wal_size soft limit.
- https://www.postgresql.org/docs/18/monitoring-stats.html — PG18 num_done vs request/timed/skipped counters, WAL generated counters, pg_stat_io WAL rows and timing, bgwriter fields, lag/caching/reset after crash.
- https://www.postgresql.org/docs/18/app-pg-ctl.html — immediate vs fast shutdown and recovery.
- https://www.postgresql.org/docs/18/wal-reliability.html — cache layers, honest flush, torn-page protection and test limits.
- https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/transam/xlogrecovery.c — redo-done message uses xlogreader->ReadRecPtr; https://github.com/postgres/postgres/blob/REL_18_STABLE/src/include/access/xlogreader.h defines it as start of the last record read, distinct from EndRecPtr. Checked after actual drill logs arrived.

No native timing or power-loss claim is borrowed from the fixed references. Actual own SQL and native results are retained separately. The article's illustrative schedules are a synthesis of documented ordering rules, not observed execution.
