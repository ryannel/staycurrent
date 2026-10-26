# Primary-source checks

Checked PostgreSQL18 official documentation on26October2026. Claim map:

- Physical copy, same major/architecture, standby.signal, sender/receiver/recovery and promotion using immediately available WAL: https://www.postgresql.org/docs/18/warm-standby.html
- Full cluster basebackup; -R/slot/streamed WAL; sender connection capacity: https://www.postgresql.org/docs/18/app-pgbasebackup.html
- Sender sent/write/flush/replay and lag meanings; receiver written_lsn/flushed_lsn; sampling caveats: https://www.postgresql.org/docs/18/monitoring-stats.html
- Receive function includes synced disk; frozen postrecovery positions; pause semantics; pg_promote waited completion: https://www.postgresql.org/docs/18/functions-admin.html
- Commit wait levels/local durability/empty synchronous list: https://www.postgresql.org/docs/18/runtime-config-wal.html
- application_name, FIRST/ANY, wal_keep_size, max_slot_wal_keep_size, idle invalidation, feedback controls: https://www.postgresql.org/docs/18/runtime-config-replication.html
- restart_lsn, wal_status, safe_wal_size and invalidation_reason: https://www.postgresql.org/docs/18/view-pg-replication-slots.html
- New snapshot after commit replay; early-cleanup conflict; recovery-delay budget; feedback cost and other conflicts: https://www.postgresql.org/docs/18/hot-standby.html
- Missing failure detection/fencing, recreated standby required after promotion: https://www.postgresql.org/docs/18/warm-standby-failover.html
- Promotion wait/timeout and explicit directory: https://www.postgresql.org/docs/18/app-pg-ctl.html
- Rewind source/target/common ancestor/WAL/checksum-or-hints/full_page_writes/configuration/recovery prerequisites and failure fallback: https://www.postgresql.org/docs/18/app-pgrewind.html
- IDENTIFY_SYSTEM and timeline ancestry: https://www.postgresql.org/docs/18/protocol-replication.html
- LSN represents64bit byte position, no embedded timeline identity: https://www.postgresql.org/docs/18/datatype-pg-lsn.html
- Unlogged contents not physically replicated: https://www.postgresql.org/docs/18/sql-createtable.html
- Synchronous wait cancellation does not roll back the already locally committed transaction: https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/replication/syncrep.c (SyncRepWaitForLSN cancellation comments/warnings).

The conservative postcommit insertion-LSN requirement is an application protocol derived from WAL insertion ordering and an acknowledged commit; it intentionally may wait for other transactions' later WAL and is not claimed to return the exact commit address. It must carry history qualification and be checked on the eventual read connection before the read's snapshot. Numeric ordering is not used across unqualified branches.

Execution evidence is separate: pglite-check.mjs/result.json for actual0.5.8 PostgreSQL18.3/WASM constructed rows, closed disposable instance; root-owned native phases/transcripts for actual PostgreSQL18.6 server behaviour. No timing/capacity, external fence, power-loss, storage-loss, rewind, conflict-cancellation or real-service observation is inferred from those runs.
