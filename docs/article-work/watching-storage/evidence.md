# Watching storage in a running database: evidence

Checked 17 October 2026. Documentation pinned to PostgreSQL 18, MySQL 8.4 and the
current sqlite.org pages. PostgreSQL observations come from local runs on PostgreSQL
18.6 (Homebrew, macOS, Apple silicon laptop). SQLite observations come from Python's
bundled SQLite 3.54.0. No MySQL server was available (none installed; pulling a
container image was not authorised), so every InnoDB statement rests on the manual
and error reference only, and the article shows no InnoDB output.

## Local runs (PostgreSQL 18.6)

Scratch cluster created with `initdb`, settings added to `postgresql.conf`:
`log_checkpoints = on` (already the default), `track_io_timing = on`,
`track_wal_io_timing = on`, `checkpoint_timeout = 30s` (the minimum; the article says
so), `log_line_prefix = '%m [%p] '`. Shared buffers default 128 MB (16,384 pages),
data checksums on (18 default), `wal_sync_method = open_datasync` (the macOS default).
`pgbench -i -s 20` (pgbench_accounts 33,436 pages).

| Run | What | Key outputs used in the article |
| --- | --- | --- |
| run1 | `pgbench -c 4 -j 2 -R 400 -T 120`, `max_wal_size = 1GB`; stats reset just before (`pg_stat_reset_shared` for checkpointer, bgwriter, wal, io) after a manual `CHECKPOINT`; sampler once a second (LSN diff, `pg_buffercache_summary().buffers_dirty`, checkpointer, bgwriter, `pg_stat_io`, `pg_stat_wal`) | 47,882 transactions, latency avg 1.902 ms. `pg_stat_checkpointer`: num_timed 4, num_requested 0, num_done 3, buffers_written 34,165. `pg_stat_bgwriter` buffers_clean 8,140. `pg_stat_io` relation writes: checkpointer 34,165, background writer 8,140, client backend 19, autovacuum 3+2. Client backend relation hits 1,048,459, reads 40,196. `pg_stat_wal`: wal_records 329,288, wal_fpi 55,653, wal_bytes 463,393,209 (442 MB in PostgreSQL units), wal_buffers_full 0. `pg_stat_io` wal rows, client backend: writes 47,076, write_time 5,689.683 ms, fsyncs 0. Dirty buffers peak 14,921 at ~29 s. Checkpoint pairs at 17:25:52/17:26:19, 17:26:22/17:26:49, 17:26:52/17:27:19 (each ~27 s write). The quoted checkpoint line is the 17:26:22 pair verbatim, wrapped. Figure 1 is this series (113 samples, 1.1–118.6 s). |
| run2 | same, `max_wal_size = 64MB` | 47,686 transactions, latency avg 2.620 ms. num_timed 0, num_requested 13, num_done 12, buffers_written 47,262; bgwriter 33; client backend relation writes 0. wal_bytes 441,599,124 (421 MB), wal_fpi 52,475. 13 "checkpoints are occurring too frequently" warnings, 6 to 10 s apart (server.log "N seconds apart"); each checkpoint `wal`-triggered, ~32 MB distance, ~8 s write. The quoted warning is verbatim from this run. |
| FPI share | `CHECKPOINT`, then 20 s of the run1 workload, then `pg_waldump --stats` over that LSN range | FPI bytes 61,842,188 of 65,150,576 total = 94.92%. The article says 95% and that this is straight after a checkpoint. |
| crash | `checkpoint_timeout = 300s`, `max_wal_size = 1GB`, manual `CHECKPOINT` at 17:31:27, unthrottled `pgbench -c 8 -j 4` for ~40 s, then `pg_ctl stop -m immediate`, restart | Startup log quoted verbatim apart from removing date/PID and shortening two lines. Redo 0/47181CB8 → 0/6A1D6808 = 560 MB; elapsed 2.80 s; end-of-recovery checkpoint wrote 16,362 buffers; ready 2.99 s after "starting PostgreSQL". `pg_control_checkpoint()` before the crash gave redo_lsn 0/47181CB8, matching "redo starts at". A `wal` checkpoint had started at 17:32:06 and not completed. |
| archive | restart with `archive_mode = on`, `archive_command = 'false'`, `max_wal_size = 256MB`; 25 s unthrottled pgbench; then `archive_command = 'true'` + reload; wait 20 s; `CHECKPOINT` | pg_wal 36 segments / 576 MB → 130 / 2,080 MB with 129 `.ready` and failed_count 37 → after repair 0 ready, 2,096 MB, failed_count 42 → after CHECKPOINT 16 segments / 256 MB. Log lines quoted verbatim (one per second, then the "failed too many times" WARNING). |
| slot | `pg_create_physical_replication_slot('forgotten_standby', true)`, 15 s unthrottled pgbench, CHECKPOINT; then `max_slot_wal_keep_size = 512MB`, reload, CHECKPOINT | Before cap: active f, wal_status `extended`, safe_wal_size NULL, 706 MB behind, pg_wal 736 MB. After: wal_status `lost`, invalidation_reason `wal_removed`, pg_wal 256 MB. |

Raw files (session scratchpad, not committed): `ws-watching/run1-samples.csv`,
`run2-samples.csv`, `run*-stats.txt`, `run*-pgbench.log`, `server.log`, `sq.py`.
The article's PostgreSQL queries were each executed against this server and parse.

## Local run (SQLite 3.54.0, Python `sqlite3`)

`sq.py`: WAL mode, default `wal_autocheckpoint` 1000, page size 4096; 50 transactions
of 100 inserts of a 200-byte value per step. Results: no reader → WAL 1,701,592 bytes,
`wal_checkpoint(PASSIVE)` (0, 413, 413). Second connection `BEGIN; SELECT count(*)`
held open; three more steps → (0, 412, 0) at 1,701,592 bytes, (0, 825, 0) at
3,399,032, (0, 1248, 0) at 5,141,792. `wal_checkpoint(TRUNCATE)` with reader open →
(1, 1248, 0). Reader committed → PASSIVE (0, 1248, 1248), file still 5,141,792
bytes. TRUNCATE → (0, 0, 0), file 0 bytes. The article converts bytes with 1 MB =
1,048,576 bytes, matching the PostgreSQL unit note.

## PostgreSQL 18 claims and sources

| Claim | Source | Note |
| --- | --- | --- |
| Column lists of `pg_stat_checkpointer` (num_timed, num_requested, num_done, write_time, sync_time, buffers_written, slru_written), `pg_stat_bgwriter` (buffers_clean, maxwritten_clean, buffers_alloc), `pg_stat_wal` (wal_records, wal_fpi, wal_bytes, wal_buffers_full), `pg_stat_io` (incl. object `wal`, read/write bytes, fsyncs, fsync_time) | `information_schema.columns` on 18.6; https://www.postgresql.org/docs/18/monitoring-stats.html | 18's `pg_stat_wal` no longer has wal_write/wal_sync/time columns; WAL I/O is in `pg_stat_io`. |
| blks_hit counts only PostgreSQL buffer hits, not OS cache; pg_stat_io doesn't distinguish disk from kernel cache | monitoring-stats.html | Quoted in paraphrase. |
| "Large numbers of writes by client backends could indicate a misconfiguration of shared buffers or of the checkpointer." | monitoring-stats.html, pg_stat_io | Quoted verbatim. |
| fsyncs only in context normal; fsync_time needs track_io_timing (relation) or track_wal_io_timing (wal) | monitoring-stats.html | |
| With `open_datasync`/`open_sync`, `issue_xlog_fsync` returns before timing/counting, so WAL fsyncs stay 0 and the sync is inside the write; wait event `WalSync` only for fsync/fdatasync methods | https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/transam/xlog.c (`issue_xlog_fsync`) and the observed 0 fsyncs | Source read 17 Oct 2026. `WalWrite` for the write wait is the IO wait event in `pg_wait_events`. |
| `wal_sync_method` default: first supported in list, fdatasync on Linux/FreeBSD | runtime-config-wal.html | macOS run showed open_datasync. |
| Statistics kept across clean shutdown, all reset after unclean shutdown/crash recovery; values cached until end of transaction | monitoring-stats.html | |
| Checkpoint triggers (5 min / 1 GB), completion target 0.9, accumulation with failing archive or slot, "never a hard limit", wal_keep_size | https://www.postgresql.org/docs/18/wal-configuration.html | |
| checkpoint_timeout range 30 s – 1 day; checkpoint_warning (30 s) applies to checkpoints caused by WAL filling; wal_compression off; wal_buffers | https://www.postgresql.org/docs/18/runtime-config-wal.html | |
| Background writer purpose; bgwriter_delay 200 ms; bgwriter_lru_maxpages 100 | https://www.postgresql.org/docs/18/runtime-config-resource.html | Article paraphrases the purpose sentence. |
| Defaults: log_checkpoints on, checkpoint_warning 30 s, max_wal_size 1 GB, min_wal_size 80 MB, track_io_timing off, track_wal_io_timing off, wal_keep_size 0, max_slot_wal_keep_size -1, log_startup_progress_interval 10 s | `pg_settings.boot_val` on 18.6 | |
| Message texts: "checkpoints are occurring too frequently", "archive command failed with exit code", "archiving write-ahead log file … failed too many times, will try again later", "database system was not properly shut down; automatic recovery in progress", "redo in progress, elapsed time: %ld.%02d s, current LSN: %X/%X" | observed in server.log; `strings` on the 18.6 `postgres` binary | The progress line was not observed (replay finished in < 10 s); its format comes from the binary. |
| `wal_status` values reserved/extended/unreserved/lost; safe_wal_size NULL when cap is -1; invalidation_reason wal_removed | https://www.postgresql.org/docs/18/view-pg-replication-slots.html | Matches observation. |
| max_slot_wal_keep_size default -1 (unlimited); idle_replication_slot_timeout default 0 | https://www.postgresql.org/docs/18/runtime-config-replication.html | |
| "last known up at" is the control file time (last checkpoint or state change) | Inference from observed values (17:31:27 = manual CHECKPOINT; crash at 17:32:07) and `pg_control_checkpoint()` | Not quoted from docs. |
| "invalid record length … got 0" just before "redo done" marks end of WAL | Observation; standard end-of-WAL behaviour in xlogreader | Article states it as normal when seen once at the end. |
| Long transaction does not retain physical WAL; logical slot restart_lsn can be held back by the oldest running transaction | Knowledge of slot/WAL retention rules (wal-configuration.html lists retention causes; none is "open transaction") | The logical-slot clause is an inference from how logical decoding restart points work; reviewers asked to check. |

## Additions after review (17 Oct 2026)

| Claim | Source |
| --- | --- |
| LWLock `WALWrite` "Waiting for WAL buffers to be written to disk"; IPC `SyncRep` "Waiting for confirmation from a remote server during synchronous replication"; IO `WalSync`, `WalWrite` | `pg_wait_events` on 18.6 |
| run1 `maxwritten_clean` 9; `num_done` 3 vs `num_timed` 4 (last checkpoint still writing) | run1-stats.txt |
| pgbench `--rate` schedule lag avg 0.915 ms (run1) and 1.619 ms (run2), included in the latency average | run1/run2-pgbench.log |
| A size-triggered checkpoint starts after about max_wal_size / (1 + checkpoint_completion_target) of log, ≈ 540 MB at 1 GB / 0.9; matches the 560 MB replayed; worst-case replay is close to max_wal_size | wal-configuration.html (max_wal_size is a target for log between checkpoints; spread write) and the observed crash; arithmetic is the reviewer's and the author's inference |
| Replay ends at the first invalid record; messages such as incorrect checksum or bad prev-link can mark a normal end after a torn final write | xlogreader behaviour; technical reviewer, consistent with source |
| During the archive failure every checkpoint line read `0 removed, 0 recycled`, some with files added | server.log |
| `innodb_undo_log_truncate` default ON; truncation once an undo tablespace exceeds innodb_max_undo_log_size (1 GiB) | https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html, innodb-undo-tablespaces.html (technical reviewer) |
| Adaptive flushing starts at innodb_max_dirty_pages_pct_lwm (10) and with redo age; LOG section of SHOW ENGINE INNODB STATUS shows "Log sequence number" and "Last checkpoint at" | innodb-buffer-pool-flushing.html; innodb-standard-monitor.html |
| "Redo log is running out of free space…" is MY-013868 (symbol ER_IB_MSG_LOG_WRITER_ENTERED_EXTRA_MARGIN); the article links by symbol anchor | 8.4 error reference (technical reviewer). The earlier note above says MY-013867; the reviewer's number is likely right. |
| SQLite run: 10 more write batches came between the reader-closed PASSIVE checkpoint and the final TRUNCATE | sq.py |

## MySQL 8.4 claims and sources

Checked by a research subagent against the 8.4 manual and server error reference on
17 Oct 2026 (pages downloaded and searched); spot-checked by the author.

| Claim | Source |
| --- | --- |
| Status variables Innodb_buffer_pool_read_requests, _reads, _wait_free ("should be small"), _pages_dirty, _pages_total, Innodb_os_log_written, Innodb_os_log_fsyncs, Innodb_log_waits, Innodb_redo_log_current_lsn, _checkpoint_lsn, _logical_size, _flushed_to_disk_lsn exist with the meanings used | https://dev.mysql.com/doc/refman/8.4/en/server-status-variables.html |
| No Innodb_history_list_length status variable; history list via `trx_rseg_history_len` (enabled by default) and "History list length" in SHOW ENGINE INNODB STATUS TRANSACTIONS | server-status-variables.html; innodb-information-schema-metrics-table.html; innodb-purge-configuration.html |
| INNODB_METRICS: only some counters enabled by default; log_lsn_checkpoint_age disabled by default | innodb-information-schema-metrics-table.html |
| SHOW ENGINE INNODB STATUS labels ("Modified db pages", LOG section lines) | https://dev.mysql.com/doc/refman/8.4/en/innodb-standard-monitor.html |
| innodb_redo_log_capacity default 100 MiB; 32 files in `#innodb_redo` | innodb-parameters.html; innodb-redo-log.html |
| innodb_io_capacity default 10000 in 8.4; innodb_max_dirty_pages_pct 90; innodb_max_purge_lag 0; innodb_purge_threads | innodb-parameters.html; mysql-nutshell.html (8.4 default changes) |
| Sharp checkpoint when log full → "temporary reduction in throughput"; aggressive flushing as redo fills | innodb-buffer-pool-flushing.html; innodb-redo-log.html |
| MY-013867 "Redo log is running out of free space, pausing user threads... Consider increasing innodb_redo_log_capacity." | https://dev.mysql.com/doc/mysql-errors/8.4/en/server-error-reference.html |
| Recovery messages MY-012551 "Database was not shutdown normally!", MY-012552 "Starting crash recovery.", MY-012550 "Doing recovery: scanned up to log sequence number %llu", MY-012532 "Applying a batch of %llu redo log records ...", MY-012535 "Apply batch completed!", MY-015126 "Still rolling back transaction %llu; %llu undo records rolled back out of %llu total (%lu%% complete)." | error reference (8.4) |
| Rollback of an interrupted transaction "can be three or four times" as long; cannot be cancelled; runs in background with connections accepted | https://dev.mysql.com/doc/refman/8.4/en/innodb-recovery.html |
| binlog_expire_logs_seconds default 2592000 (30 days); PURGE BINARY LOGS won't delete a file a connected replica is reading; an offline replica can lose files it needs | replication-options-binary-log.html; purge-binary-logs.html |
| Undo tablespaces undo_001/undo_002; truncation needs innodb_undo_log_truncate; innodb_max_undo_log_size 1 GiB | https://dev.mysql.com/doc/refman/8.4/en/innodb-undo-tablespaces.html |
| INNODB_TRX columns trx_started, trx_state, trx_mysql_thread_id, trx_rows_modified; PROCESS privilege | https://dev.mysql.com/doc/refman/8.4/en/information-schema-innodb-trx-table.html |
| Performance Schema instrument wait/io/file/innodb/innodb_log_file exists, enabled/timed in the manual's example | https://dev.mysql.com/doc/refman/8.4/en/innodb-performance-schema.html |

Not confirmed: a manual sentence saying every `wait/io/file/innodb/*` instrument is
enabled by default (only the example output shows YES/YES); the article does not
claim it.

## SQLite claims and sources

| Claim | Source |
| --- | --- |
| wal_checkpoint modes and the three result columns; NOOP mode | https://www.sqlite.org/pragma.html#pragma_wal_checkpoint |
| wal_autocheckpoint default 1000; automatic checkpoints are PASSIVE | pragma.html; https://www.sqlite.org/wal.html §3.1 |
| Checkpoint starvation; checkpoint cannot pass a reader's end mark; WAL not truncated after checkpoint unless journal_size_limit; WAL grows without bound with overlapping readers or autocheckpoint off | wal.html §2.2, §6 |
| First connection after a crash runs recovery holding an exclusive lock; others get SQLITE_BUSY | wal.html §9 |
| SQLITE_DBSTATUS_CACHE_HIT/MISS/WRITE/SPILL meanings | https://www.sqlite.org/c3ref/c_dbstatus_options.html |
| SQLITE_NOTICE_RECOVER_WAL / _ROLLBACK passed to sqlite3_log() callback | https://www.sqlite.org/rescode.html |
| cache_size default -2000 (about 2 MB) | pragma.html |

"Rebuilds the WAL index from the WAL file" is the standard description of WAL
recovery; wal.html does not spell it out in those words.

## Verification boundaries

- One run per setting on one laptop. The article labels every number as observed in
  that run and draws no general performance conclusion from the run1/run2 latency
  difference.
- macOS uses `open_datasync`; the Linux `fdatasync` behaviour of `pg_stat_io` WAL
  fsyncs is from source, not observed.
- The startup progress line ("redo in progress…") was not observed.
- InnoDB and SQLite recovery messages are documented, not observed.

## What would warrant revisiting

PostgreSQL 19 moving statistics columns again (as 17 and 18 did); a MySQL 8.4.x
release changing the redo-log error messages (MY-013865 was already replaced in
8.4.8); SQLite changing checkpoint result semantics.

## Joint-review repairs (17 Oct 2026, later)

| Claim | Source |
| --- | --- |
| InnoDB messages quoted ("Redo log is running out of free space, pausing user threads... Consider increasing innodb_redo_log_capacity." ER_IB_MSG_LOG_WRITER_ENTERED_EXTRA_MARGIN; "Database was not shutdown normally!" ER_IB_MSG_726; "Starting crash recovery." ER_IB_MSG_727; "Doing recovery: scanned up to log sequence number %llu" ER_IB_MSG_725; "Applying a batch of %llu redo log records ..." ER_IB_MSG_707; "Apply batch completed!" ER_IB_MSG_710; "Still rolling back transaction %llu; %llu undo records rolled back out of %llu total (%lu%% complete)." ER_IB_LONG_ROLLBACK) | https://raw.githubusercontent.com/mysql/mysql-server/8.4/share/messages_to_error_log.txt, fetched 17 Oct 2026, all found verbatim. The dev.mysql.com error reference returned a "Technical Difficulties" page to curl, and a reviewer could not find them in a truncated fetch, so the article now cites the source file. The MY- numbers recorded above are unconfirmed and no longer appear in the article. |
| Rollback after a crash: restart does not cancel it; innodb_force_recovery=3 skips it | innodb-recovery.html / forcing-innodb-recovery.html (journey depth review); replaces "cannot be cancelled" |
| Checkpoint trigger at max_wal_size / (1 + checkpoint_completion_target) | REL_18_STABLE xlog.c `CalculateCheckpointSegments` (lines ~2170–2192, fetched 17 Oct 2026); not stated in the manual |
| "unexpected pageaddr" is a standard end-of-WAL test | Tom Lane, pgsql-admin, 2 Feb 2011, https://www.postgresql.org/message-id/5031.1296689542%40sss.pgh.pa.us (the coordinator said pgsql-hackers; the 2011 message is on pgsql-admin). Recycled-segment cause: Tom Lane, pgsql-hackers, Aug 2009, https://postgresql.org/message-id/5710.1249594560%40sss.pgh.pa.us (from search summary; not re-read in full) |
| Zeroed versus recycled next segment explains "invalid record length … got 0" here versus "unexpected pageaddr" in the Storage run | Inference from the two observed logs and the messages above |
| 0.12 ms open_datasync writes are early-acknowledged; Storage measured ~0.04 ms unloaded on the same laptop | storage.astro commit-rate section; contention as the reason for the difference is an inference |
