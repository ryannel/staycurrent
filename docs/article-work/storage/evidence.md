# Storage and durability: evidence

Checked 15 October 2026. Documentation URLs are pinned to PostgreSQL 18. Source
references use REL_18_STABLE. Product rows and page 12 are invented teaching data.
No database crash, power loss or storage-loss test was performed.

## Claims and sources

| Claim used | Primary source | Scope and interpretation |
| --- | --- | --- |
| Ordinary heap pages usually occupy 8 kB; headers, row locations and row versions consume space | https://www.postgresql.org/docs/18/storage-page-layout.html | Page size can differ at compile time. Three drawn rows are illustrative, not a capacity estimate. |
| Table and index physical storage are separate | https://www.postgresql.org/docs/18/storage-file-layout.html | Ordinary heap and index files, not every possible table access method. |
| Large field values can be compressed or stored out of line | https://www.postgresql.org/docs/18/storage-toast.html | Avoid suggesting every logical row's complete values occupy one page. |
| Shared buffers coexist with OS caching | https://www.postgresql.org/docs/18/runtime-config-resource.html#GUC-SHARED-BUFFERS | Buffer miss is not proof of drive I/O. The particular page-12 read is an illustration. |
| Updates use row versions; ordinary reads use snapshots | https://www.postgresql.org/docs/18/mvcc-intro.html and https://www.postgresql.org/docs/18/transaction-iso.html | No claim that an ordinary Read Committed transaction keeps one snapshot across its statements. |
| A same-page update with eligible columns can avoid new normal index entries | https://www.postgresql.org/docs/18/storage-hot.html | Bounded HOT mention; not an assertion that this particular update will use HOT. |
| WAL precedes data-file writeback and permits deferred data writes at commit | https://www.postgresql.org/docs/18/wal-intro.html | Local ordinary logged-table commit; no claim all changed data must still be unwritten at reply time. |
| Buffered changes can precede WAL flush; page log position enforces write ordering and assists redo | https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/transam/README | “Write-Ahead Log Coding”; in-memory operation order differs from durable write ordering. |
| Recovery restores physical changes without treating their mere existence as visibility | https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/heap/heapam_xlog.c and https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/heap/heapam_visibility.c | `heap_xlog_update` replays the record's row-version operations; visibility routines check transaction status. The three histories are inferences from redo, visibility and synchronous commit. They are not observed failures. |
| Transactions have all-or-nothing effects for readers; committed changes survive ordinary crashes | https://www.postgresql.org/docs/18/tutorial-transactions.html | No assertion that uncommitted bytes are physically erased during recovery. Ordinary transactions, no prepared transactions. |
| Reliable OS/device flush behaviour is required; volatile device caches can break it | https://www.postgresql.org/docs/18/wal-reliability.html | Persistent storage must survive. A server's acknowledgement does not certify its hardware. |
| Full-page WAL images protect recovery from partially written pages | https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-FULL-PAGE-WRITES | First modification after a checkpoint with full_page_writes enabled. Not protection against loss of the device. |
| Checkpoints advance a recovery starting point while writes continue; frequent checkpoints create I/O/FPI tradeoffs | https://www.postgresql.org/docs/18/wal-configuration.html | A completed checkpoint's recorded redo position is precise; avoid calling checkpoint completion an instantaneous frozen database. |
| Vacuum and pruning reclaim obsolete versions; long snapshots can retain needed versions | https://www.postgresql.org/docs/18/routine-vacuuming.html and https://www.postgresql.org/docs/18/storage-hot.html | Reusable space is distinct from file shrinkage. VACUUM FULL requires rewrite capacity and exclusive locking. |
| Free-space map directs future space searches | https://www.postgresql.org/docs/18/storage-fsm.html | Supporting mechanism, not a promise that every insert avoids extending the table. |
| Async commit permits recent acknowledged loss without the corruption exposure of fsync off | https://www.postgresql.org/docs/18/wal-async-commit.html | Stated fsync/full_page_writes assumptions retained. No specific loss-window timing claimed. |
| Unlogged tables reset after crash/unclean shutdown | https://www.postgresql.org/docs/18/sql-createtable.html#SQL-CREATETABLE-UNLOGGED | Applies to unlogged table contents despite COMMIT spelling. |
| PITR needs base backup and continuous archived WAL; local current WAL is insufficient backup | https://www.postgresql.org/docs/18/continuous-archiving.html | Accidental deletion is itself durable; restoration can stop before it if the required backup/log range exists. |

## Verification boundaries

`examples.mjs` uses the installed PGlite engine to verify SQL shape, price results,
creation of a different visible row version after UPDATE, and a ROLLBACK result.
It deliberately does not claim durability, crash recovery, physical page placement,
multi-session visibility, vacuum file shrinkage or performance verification.

The example script's output records its engine version. PG18 sources support the
article's native-server implementation claims regardless of the embedded engine's
version. Figures represent permitted histories, so there are no simulated timing
measurements or model-output claims to validate.

Executed successfully on 15 October 2026 with Node 26.8.2: PostgreSQL 18.3,
PGlite 0.5.8. Before: 20.00, CTID `(0,2)`; after commit: 22.00, CTID `(0,4)`;
after the deliberate 24.00 update and rollback: 22.00. The article never assigns
these observed physical locations to its illustrative page-12 drawing.

Independent review and desktop/phone light/dark rendering are the coordinator's
remaining checks. Follow those review records before calling the draft ready.

## Reusable reading

Page Layout suits a reader ready for internal byte structures. WAL Introduction
and Reliability suit someone reasoning about commit guarantees. Routine Vacuuming
is the next practical source for version maintenance. Continuous Archiving is
the next source for an operator designing recoverable backups; it requires a
running-server understanding beyond this article's mechanism explanation.

## Coordinated review

The [batch review and verification record](../access-and-persistence/review.md)
records the independent readings, repairs, browser checks and final draft status.
The author-handoff notes above describe the earlier state before those checks.

## 17 October 2026: general rewrite (InnoDB and SQLite comparisons)

Checked against primary documentation on 17 October 2026. No engine was run; the
claims are documentation claims.

| Claim used | Source | Notes |
| --- | --- | --- |
| InnoDB page size is 64, 32, 16 (default), 8 or 4 KB, set when the instance is initialised | MySQL 8.4 `innodb-init-startup-configuration.html` | |
| InnoDB buffer pool default is 128 MB; on dedicated servers up to 80% of memory is often assigned | MySQL 8.4 `innodb-parameters.html`, `innodb-buffer-pool.html` | |
| `innodb_flush_method` default on Unix is O_DIRECT if supported, else fsync | MySQL 8.4 `innodb-parameters.html` | That O_DIRECT bypasses the OS cache is general knowledge, not quoted on the fetched pages. |
| SQLite default page size 4096 since 3.12.0, range 512 to 65536; default cache -2000 (about 2 MB) | sqlite.org `pragma.html` | Cache is per connection (library design), not quoted. |
| InnoDB clustered index holds the rows; secondary index records hold the primary key | MySQL 8.4 `innodb-index-types.html` | |
| SQLite rowid tables are table B-trees keyed by a 64-bit rowid | sqlite.org `fileformat2.html` | |
| InnoDB keeps old versions in undo logs for consistent reads; purge removes them once no read view needs them; history list length shows purge lag | MySQL 8.4 `innodb-undo-logs.html`, `innodb-purge-configuration.html` | |
| SQLite rollback mode: writer sets PENDING, waits for readers, then commits; WAL mode: readers use an end mark, one writer, readers and writer concurrent | sqlite.org `lockingv3.html`, `wal.html` | |
| InnoDB redo log has an increasing LSN; recovery starts at latest checkpoint LSN; flushing grows more aggressive as `innodb_redo_log_capacity` fills | MySQL 8.4 `innodb-redo-log.html` | "No timer" in the article is my inference from the absence of any interval setting there; wording is "keeps no timer". |
| InnoDB recovery: redo roll-forward before connections, then background rollback of uncommitted transactions, connections may meet locks meanwhile | MySQL 8.4 `innodb-recovery.html` | |
| Doublewrite buffer: pages written there before the data files; recovery finds a good copy; enabled by default | MySQL 8.4 `innodb-doublewrite-buffer.html`, `innodb-init-startup-configuration.html` | |
| `innodb_flush_log_at_trx_commit` 1/0/2 semantics | MySQL 8.4 `innodb-parameters.html` | The page does not distinguish server-process crash from OS crash for value 2; it says "lost in a crash". My statement that a server-process crash loses nothing at 2 is the widely documented behaviour but is not quoted on the page. Review. |
| SQLite rollback journal: originals saved first, journal deletion is the commit, hot journal triggers rollback; flush assumptions; fsync "do not work as advertised on many systems" | sqlite.org `atomiccommit.html` | |
| SQLite WAL: commit is a frame marked as commit; frames checksummed, invalid ones ignored; first connection after crash runs recovery | sqlite.org `wal.html`, `fileformat2.html` | |
| SQLite `synchronous`: FULL default in rollback mode; WAL + NORMAL consistent but may lose durability; OFF may corrupt | sqlite.org `pragma.html#pragma_synchronous` | Overall default (FULL) in WAL mode is not stated; the article says FULL is the default only for rollback-journal mode. |
| MySQL point-in-time recovery restores a full backup then replays the binary log | MySQL 8.4 `point-in-time-recovery.html` | Only the page title and sub-page names were confirmed; the binary-log subpage was not read. |
| PostgreSQL items carried over (page layout, WAL, full_page_writes, async commit, 600 ms, reliability, pg_test_fsync, checksums default in 18) | PostgreSQL 18 docs as cited in the earlier headings above | Not re-fetched. |

## 17 October 2026 (later): repairs after review

Sources read on 17 October 2026 for this pass, in addition to the pages above.

| Claim used | Source | Notes |
| --- | --- | --- |
| `innodb_flush_log_at_trx_commit = 2`: log handed to the OS at each commit, flushed about once a second; a MySQL process crash loses nothing, an OS crash or power loss loses about a second | MySQL 8.4 `innodb-parameters.html` | **Reasoning from the mechanism ("written" versus "flushed"), not a manual sentence.** The manual says only that unflushed transactions "can be lost in a crash", and that process exit can erase up to N seconds under `innodb_flush_log_at_timeout`. Value 0 is stated only as "written and flushed once per second"; the process-crash difference between 0 and 2 is not claimed. |
| `innodb_flush_method` default O_DIRECT where supported opens the data files directly; the log is flushed with fsync | MySQL 8.4 `innodb-parameters.html` (per the accuracy review) | Redo log stays buffered by the OS. |
| Fuzzy checkpointing, page cleaners, adaptive flushing driven by redo generation, `innodb_max_dirty_pages_pct`, sharp checkpoint when the log is full | MySQL 8.4 `innodb-checkpoints.html`, `innodb-buffer-pool-flushing.html` (per the accuracy review; I did not re-fetch them) | "InnoDB keeps no timer" removed. |
| `sync_binlog` default 1; at 1 the binary log is synchronised before commit; manual recommends `sync_binlog=1` with `innodb_flush_log_at_trx_commit=1` | MySQL 8.4 `replication-options-binary-log.html` | Fetched. |
| Binary logging is on by default in 8.4; PITR replays the binary log generated after the full backup | MySQL 8.4 `point-in-time-recovery-binlog.html` | Fetched. |
| SQLite online backup API gives a consistent snapshot of a live database; `.backup` in the shell; `VACUUM INTO` writes a consistent compacted copy; no built-in PITR | sqlite.org `backup.html`, `lang_vacuum.html`, `cli.html` | "No built-in PITR" is the absence of any such feature in the pages read, not a quoted sentence. |
| SQLite default `journal_mode = DELETE` | sqlite.org journal_mode pragma | **Not fetched this session**; stated from the documented default. Review. |
| SQLite rollback mode: writer prepares changes while readers read; waits for readers before the final write; new readers wait | sqlite.org `lockingv3.html` | Fetched. |
| Exact SQLite wording "neither of these interfaces works as advertised on many systems" | sqlite.org `atomiccommit.html` (per the accuracy review) | Quoted as a fragment: “works as advertised on many systems”. |
| diskchecker.pl as the PostgreSQL docs' suggested honesty test; sectors "commonly 512 bytes"; ZFS named as preventing partial page writes | PostgreSQL 18 `wal-reliability.html` | Fetched. 4 KiB sectors are not in that page; the article's remark that larger sectors tear less often is my reasoning. |
| 600 ms = three times `wal_writer_delay` (200 ms default) | PostgreSQL 18 `wal-async-commit.html` (per the accuracy review) | |
| Figure 6 totals: full-page images are one per distinct page per interval; 35, 24 and 12 for intervals 5, 10 and 20 | Computed from the figure's 40 changes | |
| Unlogged tables are not replicated to standbys | PostgreSQL 18 `sql-createtable.html` (per the accuracy review) | |

## 17 October 2026 (third pass): reader-driven edits

| Claim used | Source | Notes |
| --- | --- | --- |
| The binary log records changes for replication and for re-executing after a restored backup; in 8.4 it is on by default and InnoDB's two-phase commit with it is always enabled; after a crash the server completes InnoDB prepared transactions that reached the binary log and truncates the rest | MySQL 8.4 `binary-log.html`, `point-in-time-recovery-binlog.html` | Fetched. "Flushes both logs when both settings are 1" follows from `sync_binlog=1` (sync before commit) and `innodb_flush_log_at_trx_commit=1`. |
| InnoDB group commit batches log writes so one I/O serves several commits; the binary log has group commit logic too | MySQL 8.4 glossary and `replication-options-binary-log.html` (via search summary) | The dedicated `innodb-performance-group-commit` page returned 404; wording is general ("does the same for its redo log and its binary log"). Review. |
| SQLite WAL: the WAL is synced before content moves to the database, and the database is synced before the WAL is reset | sqlite.org `wal.html` | The article's "a checkpoint torn by a crash is redone from the log" is an inference from that order; the page does not discuss torn pages. |
| No commit record means PostgreSQL treats the transaction as aborted | PostgreSQL transaction status semantics (clog) | Not re-fetched; consistent with `recovery.astro`. |

## 17 October 2026 (fourth pass): point-in-time recovery section

| Claim used | Source | Notes |
| --- | --- | --- |
| A running-database copy is inconsistent and "will be corrected by log replay", like crash recovery; online backups start at a checkpoint; `full_page_writes` is effectively forced on during backup | PostgreSQL 18 `continuous-archiving.html` | Fetched. |
| `archive_command` copies each completed segment; the server recycles it only after a zero exit status | same | Fetched. |
| Recovery targets: time, named restore point (`pg_create_restore_point()`), transaction ID, LSN (and `immediate`); only one may be set | PostgreSQL 18 `runtime-config-wal.html` | Fetched. |
| A new timeline is created when archive recovery completes; the ID is part of WAL file names so the new history doesn't overwrite the old; recovery can target an earlier timeline | PostgreSQL 18 `continuous-archiving.html#BACKUP-TIMELINES` | Fetched. |
| Restore replays all WAL since the base backup, so it takes longer the older the base; archive lag raises potential loss; `archive_timeout` bounds it ("a minute or so") | same | Fetched. |
| XtraBackup records the LSN at start, copies data files, copies redo changes concurrently, then applies them in prepare | Percona XtraBackup 8.4 "How XtraBackup works" | Fetched. MySQL Enterprise Backup's mechanism was not found in the manual and is not described. |
| MySQL PITR replays binary log events after a restored backup | MySQL 8.4 `point-in-time-recovery-binlog.html`, `binary-log.html` | Fetched earlier. The article does not say "row changes". |
| Litestream continuously copies WAL pages to a replica and supports point-in-time restore | litestream.io "How it works" | Fetched; restore granularity depends on retention. |
| Figure 10 times and the P8 price change | Invented teaching data | Labelled in the caption. |

## 17 October 2026 (fifth pass): decision-grade depth

### Local observations (PostgreSQL 18.6 only; no MySQL server was available)
Setup: PostgreSQL 18.6 (Homebrew), macOS on an Apple-silicon laptop's internal SSD, one throwaway cluster, `LC_ALL=en_US.UTF-8`, socket in `/tmp/pgs` because the default path exceeded the socket-path limit. SQLite 3.51.0 from `/usr/bin/sqlite3` for defaults.

| Observation | How obtained | Used in |
| --- | --- | --- |
| Default `wal_sync_method` here is `open_datasync`; single-client one-row-per-transaction commits ran at about 25,400 per second (0.039 ms) | `pgbench -n -f ins.sql -c 1 -T 8` | Commit-rate paragraph (stated as the reason for the next setting) |
| With `wal_sync_method = fsync_writethrough`: 1 client 189, 196 and 191 commits/s (5.1 to 5.3 ms); 16 clients 1,598, 1,571 and 1,571 commits/s (10.0 to 10.2 ms); 4 clients 396 commits/s (10.1 ms) | pgbench, 6 to 8 s runs, repeated | Table of commit rates, group-commit caption |
| `synchronous_commit = off`: 1 client about 72,000 commits/s, 16 clients about 170,000 | pgbench, one 8 s run each | Table |
| 10,000 rows in one transaction: 8.2 to 12.2 ms in all | `psql \timing`, four runs | Table |
| After `CHECKPOINT`, 20 s of update-heavy `pgbench` (scale 20, 8 clients, about 34,000 tps with async commit) wrote 566 MB of WAL since the redo point | `pg_control_checkpoint()` and LSN difference | Recovery time, sizing, log volume |
| `pg_ctl stop -m immediate` then start: `redo starts at 0/53D9DB50`, `unexpected pageaddr ... LSN 0/7740A000`, `redo done at 0/77409F98 ... elapsed: 3.35 s`, end-of-recovery checkpoint `total=0.561 s`, then `ready to accept connections` | The server log | Restart-log excerpt; about 170 MB/s replay |
| `checkpoint starting: time` and `checkpoint complete: wrote 12143 buffers (74.1%) ... write=26.633 s ... distance=319861 kB ... redo lsn=...` with `checkpoint_timeout = 30s` | Server log, `log_checkpoints = on` | Checkpoint log excerpt |
| `max_wal_size = 1GB`, 45 s of the same load: `checkpoint starting: wal`, `distance=528459 kB` (about half of 1 GB), and `LOG: checkpoints are occurring too frequently (20 seconds apart)` with `HINT: Consider increasing the configuration parameter "max_wal_size".` | Server log | Sizing example; symptom table |
| `pg_stat_wal` columns in 18: `wal_records, wal_fpi, wal_bytes, wal_buffers_full, stats_reset`; write and sync timings moved to `pg_stat_io` (object `wal`, columns `writes, fsyncs, write_time, fsync_time`, needing `track_wal_io_timing`) | Queried `information_schema.columns` and the views | Log-volume and flush-time sections |
| `pg_stat_checkpointer` columns: `num_timed, num_requested, num_done, restartpoints_*, write_time, sync_time, buffers_written, slru_written` | Queried | Checkpoint section |
| `pg_stat_io` backend types seen for relation writes: `background writer`, `checkpointer`, `startup` (and `client backend` rows exist) | Queried | Who writes a dirty page |
| Wait events `WalSync`, `WalWrite` exist (type IO) | `pg_wait_events` | Flush-time section |
| `pg_stat_archiver` columns `archived_count, last_archived_wal, last_archived_time, failed_count, last_failed_wal, last_failed_time`; `pg_stat_database.checksum_failures` exists; `data_checksums = on` for the new cluster | Queried | Backups, torn pages |
| Defaults: `checkpoint_warning` 30s, `checkpoint_completion_target` 0.9, `min_wal_size` 80MB, `max_wal_size` 1GB, `wal_keep_size` 0, `max_slot_wal_keep_size` -1, `data_sync_retry` off, `wal_writer_delay` 200ms | `SHOW` | Settings table, text |
| SQLite 3.51.0 defaults: `journal_mode` delete, `synchronous` 2 (FULL), `page_size` 4096, `wal_autocheckpoint` 1000; `PRAGMA wal_checkpoint(PASSIVE)` returns `0|1|1` after one insert in WAL mode | `sqlite3` | Settings, checkpoint example |

### Documentation claims fetched this pass
| Claim | Source |
| --- | --- |
| InnoDB status variables exist with these meanings: `Innodb_redo_log_current_lsn` (last written position in the redo log buffer), `Innodb_redo_log_checkpoint_lsn`, `Innodb_redo_log_flushed_to_disk_lsn`, `Innodb_os_log_fsyncs`, `Innodb_os_log_written`, `Innodb_buffer_pool_pages_dirty`, `Innodb_log_waits` | MySQL 8.4 `server-status-variables.html` |
| Page cleaners; `innodb_max_dirty_pages_pct` 90, `_lwm` 10; adaptive flushing on by default; sharp checkpoint when log files fill causes a temporary throughput drop; asynchronous flushing starts at 75% redo utilisation | MySQL 8.4 `innodb-buffer-pool-flushing.html` |
| `innodb_redo_log_capacity` default 104857600; `innodb_max_purge_lag` default 0 (no delay); `innodb_checksum_algorithm` default `crc32` | MySQL 8.4 `innodb-parameters.html` |
| Sequential inserts leave pages about 15/16 full; random leave 1/2 to 15/16 | MySQL 8.4 `innodb-physical-structure.html` |
| DYNAMIC row format stores long values off-page with a 20-byte pointer | MySQL 8.4 `innodb-row-format.html` |
| Random deletes fragment; rebuild with `ALTER TABLE ... FORCE` | MySQL 8.4 `innodb-file-defragmenting.html` |
| A big rollback can take several times as long as the change; killing the process does not help because rollback restarts at startup | MySQL 8.4 `optimizing-innodb-transaction-management.html` |
| `DATA_LENGTH` and `INDEX_LENGTH` for InnoDB | MySQL 8.4 `information-schema-tables-table.html` |
| Semisynchronous replication: commit waits for at least one replica to acknowledge after relay-log write and flush; default wait point after binary-log sync and before storage-engine commit; timeout falls back to asynchronous; an asynchronous source can lose committed transactions at failover | MySQL 8.4 `replication-semisync.html` |
| `binlog_expire_logs_seconds` default 2592000 (30 days); `mysqlbinlog --stop-datetime` and `--stop-position` (events at or after the stop position excluded) | MySQL 8.4 `replication-options-binary-log.html`, `mysqlbinlog.html` |
| `synchronous_commit` values and what each waits for with synchronous standbys; `wal_sync_method` options (`fsync_writethrough` forces write-through of any disk write cache); `data_sync_retry` default off raises PANIC on data-file flush failure | PostgreSQL 18 `runtime-config-wal.html`, `runtime-config-error-handling.html` |
| `checkpoint_warning` message text; archive failure lets WAL accumulate; `max_slot_wal_keep_size` -1 means slots may retain unlimited WAL | PostgreSQL 18 `wal-configuration.html`, `runtime-config-replication.html` |
| Checkpoint starvation: a reader that is always open stops the WAL being reset and the file grows without bound; automatic checkpoints are PASSIVE; `wal_checkpoint` modes and three result columns | sqlite.org `wal.html`, `pragma.html#pragma_wal_checkpoint` |
| Free pages are reused and the file doesn't shrink; `VACUUM` repacks and can need up to twice the file size in free space; copying a file during a transaction can corrupt the copy; hot journal must stay with its database; the checksum VFS is optional, off by default | sqlite.org `lang_vacuum.html`, `howtocorrupt.html`, `cksumvfs.html` |

### Stated but not verified against a primary source (review these)
- `PRAGMA page_count` and `pg_total_relation_size` as size signals (the latter ran locally; the former is standard but not fetched).
- InnoDB's default row format is DYNAMIC (the manual page names DYNAMIC behaviour; the default itself was not fetched).
- `innodb_flush_log_at_trx_commit` is server-wide and SQLite's `synchronous` is per connection.
- Group commit for InnoDB's redo log and binary log rests on the glossary and binary-log options text via a search summary; the dedicated page returned 404.
- A cloud instance's local storage "may disappear when an instance stops" is general knowledge, hedged in the text.
- That `unexpected pageaddr` marks the end of valid log and is normal after a crash is from the observed run, not from a documentation sentence.
- The "checkpoint starting: wal" reason string was observed; the other reason strings were not listed.
- No InnoDB restart log, InnoDB commit rate or InnoDB recovery time was measured: the article says so.

## 17 October 2026 (sixth pass): repair from two reviews

Ownership split with Watching storage and The buffer pool applied; no new local runs.

### Changed claims
| Claim | Basis |
| --- | --- |
| PostgreSQL starts a requested checkpoint at `max_wal_size / (1 + checkpoint_completion_target)` (about 540 MB at defaults); worst-case replay is close to `max_wal_size` | Reviewer's reading of `CalculateCheckpointSegments` in `xlog.c`; agrees with Watching's 540 MB. Not in the manual; the text says so. Worst case is arithmetic: trigger distance plus log written while the checkpoint runs. |
| About 6 s (1 GB) and about 24 s (4 GB) at 169 MiB/s; about 48 s at half that rate; 4 GB trigger about 2.1 GB, a checkpoint every 75 s at 28 MB/s | Arithmetic from the local run, labelled as such |
| 169 MiB/s is a best case (log mostly full-page images, warm OS cache); reboot or cold standby can be slower | Reviewer's note; not measured here |
| 566 MiB (594 MB) of log, 3.35 s, 0.56 s end-of-recovery checkpoint; a run separate from Watching's | Unit corrected from the earlier "MB"; same local run |
| 8 to 12 ms for 10,000 rows in one transaction | Local run range 8.2 to 12.2 ms |
| 72,000 and 170,000 commits/s are processor-bound | Local run; reviewer's note |
| `innodb_flush_log_at_trx_commit` 0 and 2 write/flush once a second; "any unexpected mysqld process exit can erase up to N seconds of transactions" with `innodb_flush_log_at_timeout`; once-a-second flush not guaranteed on time | MySQL 8.4 `innodb-parameters.html`, fetched this pass. So 0 loses up to a second on a process crash. |
| `innodb_redo_log_capacity`: below-capacity flushes less aggressively, above-capacity more aggressively; resizable while running; monitoring variables | MySQL 8.4 `innodb-redo-log.html`, fetched |
| Sizing capacity from a write rate (sample `Innodb_redo_log_current_lsn` twice) | Inference from the mechanism; the manual gives no formula. Text says so. |
| `sync_binlog = 0` leaves binary log flushing to the OS, so replicas and PITR lack what is missing; a replica that read lost events diverges | The first part is the manual's `sync_binlog` text read in an earlier pass; the replica consequence is inference. |
| MySQL semisync is a plugin that must be installed and enabled | Reviewer's note; consistent with the 8.4 manual |
| Plain `VACUUM` can truncate trailing empty pages | Reviewer's note |
| SQLite `synchronous` is per connection | Still inference; the text now says so |
| No citable flush-time figures for PLP NVMe or network volumes | One search found only blogs and a saved chat; the article gives no numbers and names `pg_test_fsync` and `fio --fsync=1` |

### Not re-checked
Everything unlisted in the fifth-pass section stands as recorded there.
