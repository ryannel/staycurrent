# Storage and durability: coverage map and depth plan, 17 October 2026

A plan, not prose. Read against `relational/storage.astro` as it stands after the
general rewrite and the later edits (13 h2 sections, about 4,700 words; the PITR
section is 856 words with five h3s and one figure and is the model).

Reader: a working backend engineer on MySQL/InnoDB, PostgreSQL or SQLite who must
configure durability, size a buffer pool, read a checkpoint or recovery incident,
choose commit settings, judge storage hardware and plan recovery.

Names of views, status variables and log lines below are from memory of the
manuals and must be checked against PostgreSQL 18, MySQL 8.4 and current SQLite
before any is written into the article (marked V).

## 0. What makes the PITR section the model (apply this to the others)

- One concrete story with times (the shop's day), so every claim has a consequence.
- Opens by saying what the section reuses from earlier ("crash recovery started
  from an older copy, fed a saved log, stopped early"), so it adds one idea.
- Five h3s, each a single question the reader would ask next: copy while running;
  keep the log; replay and stop; what stopping costs; other engines.
- A figure only where the timeline is the point; the costs (lost 14:02 commit,
  timelines, restore time, archive_timeout) are stated as decisions, not features.
- Engines contrasted last, in a short paragraph, after the mechanism is clear.

Use that shape: scenario, one mechanism per h3, the cost or failure it implies, how
to see it in a running system, then the other engines.

## 1. Collection check: what already exists elsewhere

Checked by grep and heading lists across `relational/*.astro` and `postgresql/*.astro`.

| Topic | Covered elsewhere? | Consequence |
| --- | --- | --- |
| Isolation, snapshots, write skew | `isolation.astro` (7 h2s) | link only |
| Retry, unknown commit outcome, idempotency keys | `conflicts-and-retries.astro` (deep) | keep the 145-word section as a bridge |
| Backup design, restore drills, incomplete WAL chain, validating a restore | `backup-and-restore.astro` (PostgreSQL-centred; no MySQL or SQLite content) | the storage article's PITR section stays the general mechanism; MySQL binlog and SQLite recovery have no other home, so the 5th h3 here is their only coverage |
| PostgreSQL sync/async replication levels, read freshness, failover, slots | `replicas-and-failover.astro`, `postgresql/replication.astro` (PostgreSQL only; no MySQL semi-sync or Group Replication, no SQLite) | storage article can add a short engine comparison of what a replica adds to commit durability and link; do not re-teach levels |
| WAL positions (insert/write/flush LSN), redo with page LSNs, full-page images, async commit, fsync=off, unlogged, flush path | `postgresql/recovery.astro` | the PostgreSQL depth lives there; do not copy |
| Page layout, TOAST, row header | `postgresql/architecture.astro` | link |
| Vacuum, HOT, retained snapshots, `idle in transaction` | `postgresql/row-versions.astro` | link |
| Heap vs clustered, secondary index cost | `indexes.astro` | link; verify it states the InnoDB secondary-lookup cost |
| Per-query `EXPLAIN (ANALYZE, BUFFERS)` | `slow-queries.astro`, `postgresql/query-execution.astro` | per-query only |
| Buffer cache hit rate, checkpoint frequency, log volume, dirty pages, fsync latency as system metrics | nowhere (no `pg_stat_*`, `SHOW ENGINE INNODB STATUS` or status-variable coverage anywhere in the collection; `pg_stat_activity` appears only for sessions) | essential gap; this article is the right home |
| Any MySQL or SQLite operational view | only `checkout`, `indexes`, `product-comparison` mention them in passing | this article is the only place a MySQL or SQLite reader learns to look |

## 2. Per-section plan

Legend. Verdict per subtopic: OK = covered well; THIN = covered but thin (what is
missing); ABSENT-E = absent and essential; ELSEWHERE = belongs elsewhere (destination
checked); OUT = deliberately out of scope. Depth: keep, moderate, substantial, split.

### 2.1 Opening (no h2)
Needs: what durability promises, the question that drives the page, and a map of
decisions the page equips (reader is a decision-maker).
- Durability defined by failures survived: OK.
- P7 running example, PostgreSQL 18 labelled: OK.
- A short statement of the decisions the article supports (commit setting, buffer
  pool size, checkpoint/redo size, hardware check, recovery plan): ABSENT; add three
  sentences. Not a list of contents; frame the reader's problems.
Depth: keep, +60 words.

### 2.2 Rows live in pages (202 words, 1 figure)
Needs: page as the I/O and cache unit; page size and its consequences; how pages form
a table (heap vs clustered B-tree vs rowid B-tree) and what follows (row address, cost
of secondary lookups, insert pattern, page splits/fill, fragmentation); wide values;
free space and why files do not shrink; indexes are pages and are logged like tables;
how to see sizes.
- Page size per engine, no spanning: OK.
- Table organisation: THIN. States the three layouts, not the practical difference
  (an InnoDB secondary lookup does two B-tree descents; a heap lookup one plus visibility
  check; random primary keys split pages in a clustered table). ELSEWHERE for the full
  story (`indexes.astro`; verify); keep two sentences of consequence.
- Wide values / overflow: THIN (one clause). Add engine names (TOAST, InnoDB off-page
  columns, SQLite overflow pages) and the read-cost effect in one sentence;
  ELSEWHERE `postgresql/architecture.astro` for TOAST (covered).
- Free space and file growth (deleted rows do not shrink files; reuse inside pages;
  VACUUM FULL / OPTIMIZE TABLE / SQLite VACUUM rewrite): ABSENT-E. A professional is
  asked "why did the disk not shrink after the delete". ELSEWHERE partly
  (`row-versions.astro` for PostgreSQL; verify) but not the general rule. Add 80 words.
- Indexes are pages too, changed and logged by the same machinery, and one row change
  touches table and index pages: ABSENT-E (this is why one commit dirties many pages and
  why index count drives log volume). Add a paragraph; ties to Section 2.5 and 2.7.
- Observe: table/index size (`pg_relation_size`, `information_schema.TABLES`,
  SQLite `dbstat`/`PRAGMA page_count`): ABSENT, add one line (V).
Depth: moderate (to ~450 words). h3s not needed; two paragraphs added. Figure 1 stays;
add no new figure.

### 2.3 A cache of pages in memory (256 words, 1 figure)
Needs: hit/miss cost; eviction policy; scan behaviour; the OS cache and double
buffering; sizing; warm-up after restart/failover; reading the hit rate honestly;
failure modes (cold cache, scan flush, swapping); where the engine's memory goes besides
the pool; observing.
- Pool, hit, read, evict: OK.
- OS cache and sizing (25% / 80%): THIN. States the numbers and the O_DIRECT reason;
  missing: why more is not better (OS cache, per-connection memory, `work_mem`-style
  allocations in `query-execution.astro` ELSEWHERE for the PostgreSQL case), working set
  versus database size, how to tell if the pool is too small.
- Eviction policies (PostgreSQL clock sweep with usage counts; InnoDB LRU split into
  young/old sublists so a scan cannot flush hot pages; SQLite simple LRU): ABSENT-E in
  one paragraph; the "one big report evicted the working set" incident follows.
- Warm-up (InnoDB buffer pool dump/restore at shutdown/startup, `pg_prewarm`, cold
  replica after failover): ABSENT-E; explains the post-restart latency a reader
  will meet in production. ELSEWHERE for failover timing (`replicas-and-failover.astro`
  does not discuss cache temperature; verify) so keep here.
- Hit rate: ABSENT-E. Teach: ratio = hits / (hits + reads); what a good number looks like
  depends on workload; in PostgreSQL a "read" may still be an OS-cache hit (so the ratio
  flatters the disk); a 99% ratio can still mean slow queries if the 1% are large scans.
- Observing: ABSENT-E. PostgreSQL: `pg_stat_database` blks_hit/blks_read, `pg_statio_*`,
  `pg_stat_io` (V: columns and version), `track_io_timing`, per-query BUFFERS (already in
  slow-queries), `pg_buffercache` extension to see what is cached. InnoDB:
  `Innodb_buffer_pool_read_requests` vs `Innodb_buffer_pool_reads`,
  `Innodb_buffer_pool_wait_free`, `Innodb_buffer_pool_pages_dirty/total`, and the
  BUFFER POOL AND MEMORY block of `SHOW ENGINE INNODB STATUS` (V). SQLite: cache is per
  connection; `PRAGMA cache_size`, `sqlite3_db_status` cache hit/miss (V).
Depth: split into two sections or substantial deepening, to ~900 words with h3s:
  - h3 "Hits, reads and evictions" (existing)
  - h3 "Two caches" (OS cache; double buffering; O_DIRECT)
  - h3 "Sizing the pool" (working set, the 25%/80% rules as starting points, what else
    needs memory)
  - h3 "A cold cache" (restart, failover, warm-up, a scan evicting the working set)
  - h3 "Reading the hit rate" (how to compute, how to be misled; engine signals)
Figure/worked example: a second interactive figure where the reader changes the pool
size against a fixed working set and watches the hit rate and reads per second change
(the knee), plus a "one scan flushes the pool" toggle (clock sweep vs old-sublist).
Prose cannot show the knee. Label as a model, not a benchmark.

### 2.4 Updating a row without overwriting it (260 words)
Needs: why old versions exist (snapshot reads, rollback); three designs; cost model of
each; the long-transaction failure mode across engines; cleanup; observing.
- Three designs in a paragraph each: OK. Keeps the PostgreSQL-only xmin walk-through out.
- Long transaction as the cross-engine failure mode: THIN. PostgreSQL growth and
  InnoDB undo growth are named; missing the SQLite case (a long reader stops WAL
  checkpoints from completing past its snapshot, so the -wal file grows) and what a
  rollback costs (InnoDB rollback of a big transaction is slow; the manual says it can
  take three or four times as long as the transaction ran; PostgreSQL abort is cheap).
- Cleanup mechanics (vacuum/autovacuum; purge threads and history list; SQLite
  checkpoint): PostgreSQL ELSEWHERE (`row-versions.astro`, covered); InnoDB and SQLite
  half-covered here: add purge lag (`innodb_max_purge_lag`) in one sentence.
- Observing: ABSENT-E. PostgreSQL oldest snapshot (`backend_xmin` in `pg_stat_activity`),
  `n_dead_tup`/`pg_stat_user_tables` (V); InnoDB history list length (SHOW ENGINE INNODB
  STATUS, `information_schema.INNODB_METRICS` trx_rseg_history_len) (V); SQLite `-wal`
  file size and `PRAGMA wal_checkpoint` result. A one-row-per-engine table ("where old
  versions live / what a long transaction costs / what to look at") carries this better
  than prose.
- Isolation levels and which snapshot a query takes: ELSEWHERE (`isolation.astro`).
Depth: moderate (to ~420 words), one table. h3s not needed. No new figure (Figure 3 was
cut on purpose; keep it cut).

### 2.5 Changed pages wait in memory (183 words, 1 figure)
Needs: dirty page definition; steal/no-force trade; who writes dirty pages and when
(checkpointer, background writer/page cleaner, the query itself when no clean slot);
dirty-page ratio as a signal.
- Dirty page, the unsafe design, figure: OK.
- Who writes dirty pages: THIN, scattered and PostgreSQL-only in the old checkpoint
  text, now gone. Three writers and why a read can wait on a write (a backend finding no
  clean buffer) is the usual cause of unexplained latency spikes. Add 120 words.
  InnoDB: page cleaner threads, `innodb_io_capacity`, `innodb_max_dirty_pages_pct`;
  PostgreSQL: bgwriter and backend writes (V: `pg_stat_io` shows writes by backend type).
- The names steal/no-force: OUT (not needed to decide anything).
Depth: moderate, +120 words, one h3 "Who writes a dirty page". Keep Figure 3.

### 2.6 The log is written before the pages (369 words, 1 figure)
Needs: the ordering rule; what a record contains; the commit protocol step by step
(append to log buffer, write to OS, flush, acknowledge); group commit and why commit
latency equals flush latency; log buffer and file sizing; what other logs exist
(InnoDB undo, binary log, PostgreSQL logical decoding) and how they differ from redo;
log volume and what drives it; retention (why the log cannot always be recycled);
SQLite's two modes; observing.
- Ordering rule, LSN, redo log, journal vs WAL in SQLite: OK. Covered well but dense
  (the SQLite paragraph is the heaviest).
- Commit protocol and where the latency comes from: THIN. The "COMMIT waited for one thing"
  line is right but a professional needs the arithmetic: commits per second per client
  are bounded by flush latency; group commit lifts the ceiling with concurrency; a
  single client doing autocommit inserts is the classic slow load. Worked example:
  "10,000 single-row inserts, autocommit vs one transaction" with flush latency
  stated as an assumed number, labelled arithmetic not benchmark.
- What a record holds and why redo is physical/physiological while a binary log is
  logical: THIN/ABSENT. One short paragraph prevents the common confusion between
  the InnoDB redo log and the MySQL binary log, which `backup-and-restore` and the
  settings bullet now rely on.
- Log volume and what drives it (index count, full-page images after a checkpoint, wide
  rows, bulk updates): ABSENT-E. It sets disk, replication bandwidth and archive cost.
  Observing it: PostgreSQL `pg_stat_wal` (wal_records, wal_fpi, wal_bytes) and LSN
  difference over time via `pg_wal_lsn_diff` (`recovery.astro` shows the LSN functions;
  it does not teach rate) (V); InnoDB `Innodb_redo_log_current_lsn` sampled over time or
  `Innodb_os_log_written` (V); SQLite -wal size.
- Retention: why the log cannot be recycled (checkpoint not done, archive command
  failing, replication slot or lagging replica, binlog expiry): ABSENT-E. "The log
  directory filled the disk" is a standard incident. ELSEWHERE for the PostgreSQL slot
  case (`postgresql/replication.astro` has `pg_replication_slots`, covered); the general
  statement of what holds the log back belongs here.
- Log placement on separate storage, log buffer size, `wal_buffers`/`innodb_log_buffer_size`:
  OUT or one sentence; tuning detail with little decision value beyond "log latency is
  the commit latency floor".
Depth: substantial; split into two sections:
  - "The log is written before the pages" (ordering, record, protocol, group commit,
    SQLite modes) ~550 words with h3s "What COMMIT waits for", "Group commit",
    "SQLite's two ways".
  - New "Log volume and how long the log is kept" ~350 words: what makes the log grow,
    what holds it back, how to see the rate.
Figure/worked example: a group-commit figure (N sessions arriving during one flush;
the reader moves flush time and concurrency, sees commits/s) is the single best carrier
for the latency arithmetic. Prose cannot let the reader feel the ceiling.

### 2.7 Crash recovery (228 words, 1 figure)
Needs: phases; what is replayed and from where; unfinished transactions per engine; how
long it takes and what the operator sees; availability during recovery; what recovery
does not fix; reading the recovery log; clean vs immediate shutdown; kill -9 vs OS
crash vs power loss.
- Replay from the checkpoint, LSN comparison, commit record defines committed: OK.
- Unfinished transactions per engine: OK (the InnoDB background rollback paragraph is
  a good consequence).
- Recovery time: ABSENT-E. A professional is asked "how long will it be down after a
  crash". Teach: bounded by the log since the last checkpoint and replay speed (so
  checkpoint settings set recovery time, linking forward to 2.8), plus the InnoDB rollback
  duration for big in-flight transactions, plus buffer-pool warm-up afterward.
  Method: measure on a copy (crash a test instance under load); do not quote durations.
- Reading a recovery incident: ABSENT-E. Worked example: an annotated startup log
  from each engine (PostgreSQL "database system was not properly shut down; automatic
  recovery in progress", "redo starts at", "redo done at"; InnoDB "Starting crash
  recovery", "Applying a batch of N redo log records", "Rolling back trx"; SQLite hot
  journal restore on the next open) (V: exact lines per version). Callouts: where the
  restart began, how much was replayed, whether anything was rolled back, when connections
  were accepted. ELSEWHERE: `postgresql/recovery.astro` shows a PostgreSQL experiment;
  it does not annotate startup log lines (verify before finalising); keep PostgreSQL's
  excerpt short and link.
- The torn tail of the log (recovery stops at the first invalid record; commits whose
  record was not fully flushed are absent): ABSENT-E in one sentence; links to the
  "commit not flushed" cases in 2.11.
- What recovery cannot repair (silent corruption, a lying drive, wrong files restored
  from backup, a missing log file): ABSENT-E; a short list that leads to Backups.
- Immediate shutdown / kill -9 / OS crash / power loss differences: THIN. Figure 8's
  caption covers the flush layers; add the mapping once.
Depth: substantial (to ~700 words), h3s: "What recovery replays", "Unfinished
transactions" (existing content), "How long it takes", "Reading the restart log",
"What recovery cannot repair". Keep Figure 5. Worked example (log excerpt with callouts)
is better than a new figure.

### 2.8 Checkpoints bound the replay (245 words, 1 figure)
Needs: purpose; the three-way trade (recovery time, write amplification, full-page-image
volume); engine models (burst vs fuzzy; SQLite autocheckpoint); the knobs; symptoms of
mis-sizing; how to measure; how to estimate recovery time from settings.
- Definition, PostgreSQL timer/size triggers, InnoDB fuzzy model and the stall: OK in
  outline; THIN for use.
- Knobs by engine: THIN. PostgreSQL `checkpoint_timeout`, `max_wal_size`,
  `checkpoint_completion_target` (named only partly). InnoDB `innodb_redo_log_capacity`,
  `innodb_io_capacity`, `innodb_max_dirty_pages_pct` (not named). SQLite
  `wal_autocheckpoint`, the PASSIVE/RESTART/TRUNCATE modes (not named).
- Symptoms: ABSENT-E. A symptoms table (symptom / likely cause / what to change):
  periodic I/O bursts and latency sawtooth (checkpoint spreading, requested checkpoints
  too frequent); log warning "checkpoints are occurring too frequently" (PostgreSQL
  `max_wal_size` too low); stalls when the InnoDB redo log nearly fills (capacity or I/O
  capacity too low); a growing SQLite WAL (long reader or autocheckpoint blocked).
- Choosing a value: ABSENT-E. A worked example: a recovery-time target of N seconds, an
  observed log rate of R MB/s (from 2.6), replay speed measured on the test copy, so
  checkpoint interval and maximum log bounded by arithmetic; and the cost side (more
  frequent checkpoints, more full-page images, see 2.9). Keep numbers as assumptions.
- Observing: ABSENT-E. PostgreSQL `log_checkpoints` output (number of buffers written,
  write/sync times, distance) and `pg_stat_checkpointer` timed vs requested
  (V: view name and columns in 17/18), `pg_control_checkpoint()`; InnoDB checkpoint age
  from the LSN and checkpoint LSN (`Innodb_redo_log_current_lsn`,
  `Innodb_redo_log_checkpoint_lsn`) as a share of capacity, `SHOW ENGINE INNODB STATUS`
  LOG block (V); SQLite `PRAGMA wal_checkpoint(PASSIVE)` returns busy, log frames,
  checkpointed frames.
- Full-page images as the second cost: moved to 2.9 in the rewrite; the stat "35 vs 12
  images" in the earlier text was dropped. Restore it in the figure stats, not in prose.
Depth: substantial (to ~700 words). h3s: "Burst or continuous", "What you can set"
(small per-engine table), "Choosing an interval" (worked example), "Seeing a checkpoint".
Figure: extend Figure 6 (stats for log images, recovery length; optional toggle for
the InnoDB continuous model so the figure no longer shows only the burst model). A
second figure is not needed.

### 2.9 Pages torn by a crash (378 words, 1 figure)
Needs: why pages tear; the three repairs; their costs; detection (checksums) versus
repair; when the protection can be off; observing.
- Why, FPW, doublewrite, SQLite: OK. Densest section but each engine gets one paragraph.
- Detection vs repair (page checksums: PostgreSQL 18 default for new clusters, InnoDB
  CRC32 default `innodb_checksum_algorithm` (V), SQLite none by default except WAL frame
  checksums; what a checksum failure looks like): THIN. ELSEWHERE partly
  (`postgresql/recovery.astro` covers the PostgreSQL checksum behaviour in torn-page
  context; verify scope); keep one comparison here.
- Cost comparison: THIN. A three-row table (where the clean copy lives; when it is
  written; extra cost) is clearer than paragraphs.
- When the protection can be disabled (filesystems or devices with atomic page-size
  writes; PostgreSQL docs name ZFS for `full_page_writes`; MySQL allows doublewrite off
  or detect-only) and the risk of getting this wrong: ABSENT-E as a decision; one
  paragraph; hardware claims need V.
- Torn page vs silent corruption/bit rot: ABSENT; one sentence so a reader does not
  think FPW protects against bad media. Belongs with 2.7 "What recovery cannot repair".
- Observing: PostgreSQL `pg_stat_database.checksum_failures`, `pg_checksums` (V);
  InnoDB error-log corruption messages, `Innodb_dblwr_writes` vs pages written (V).
Depth: moderate (keep ~400 words, add a table and one decision paragraph). h3s not
needed. Keep Figure 7.

### 2.10 Whether a flush reaches the disk (374 words, 1 figure)
Needs: what a flush asks; layers (database buffer, OS cache, filesystem, controller, drive);
sync methods; the ways the promise breaks (volatile drive cache, controller cache without
battery, virtual and network volumes, fsync errors, filesystem behaviour); how to verify;
latency as the commit floor; observing.
- Layers, lying drives, PLP, 120/s arithmetic and its limit, managed services: OK.
- The commit floor: THIN. The point that fsync latency on your volume is the minimum
  commit latency, and differs by orders of magnitude between local NVMe with PLP,
  network-attached volumes and rotating disks, is the hardware decision; link to 2.6
  group commit. Numbers: state as approximate classes only, with sources or none.
- Virtual and cloud storage: ABSENT-E. Which layer the VM, hypervisor and network volume
  add, whether a cloud volume's flush is durable (provider-documented, differs by
  product), instance-local storage lost on stop. Provider guarantees need citations (V);
  keep generic and say "read your provider's documentation of what an acknowledged
  write means".
- fsync failure handling (a failed fsync may drop dirty pages; PostgreSQL treats a
  failed WAL fsync as fatal since 2018 (V); retrying and continuing can lose data): ABSENT-E,
  a 100-word failure-mode paragraph. Source: PostgreSQL release notes / fsync-gate
  discussions; V.
- Sync methods (`wal_sync_method`, `innodb_flush_method`, SQLite `fullfsync` on macOS):
  THIN/ELSEWHERE (`postgresql/recovery.astro` has `fdatasync` and `wal_sync_method`
  context); one sentence here.
- Verification: THIN. diskchecker.pl and the power-pull test named; add: `pg_test_fsync`
  as a timing tool (not a proof), `fio` with `--fsync`/`--fdatasync` for any engine (V).
- Observing: ABSENT-E. PostgreSQL wait events `WALSync`/`WALWrite`, `track_io_timing`
  and fsync timings in `pg_stat_io` (V); InnoDB `Innodb_os_log_fsyncs`, performance_schema
  file I/O summary for the redo log (V); OS `iostat` await; commit latency percentiles
  at the application.
Depth: substantial (to ~650 words). h3s: "What a flush asks for", "Where the promise
breaks" (drive cache; controller; virtual and cloud volumes; failed fsync), "Checking your
own storage", "Seeing flush time in production". Keep Figure 8; a second figure is not
needed. A small table "layer / what loses data there / what protects it" is better than
prose for the breaking points.

### 2.11 Trading durability for speed (395 words, 1 figure)
Needs: decision framework; engine settings with loss windows; scope (global vs session
vs transaction); the binary log and sync_binlog; interaction with replication; what the
application sees; legitimate uses of the dangerous options (CI, bulk load, scratch);
measuring the gain; the unlogged/temporary alternatives.
- Three-engine settings: OK, with a good InnoDB bullet (binary log pairing).
- Decision framework: ABSENT-E. How to choose: what is the cost of losing N ms of
  commits for this data; is the window short enough to repair by replay from upstream
  (queue, event source) or reconcile; per-transaction setting for mixed workloads;
  never for money or acknowledgements a user sees as final (cross-link
  `conflicts-and-retries`). Present as a table: data kind / tolerable loss / setting.
- Replication and commit durability: ABSENT-E in this article, ELSEWHERE for PostgreSQL
  (`replicas-and-failover.astro` + `postgresql/replication.astro`, covered), absent for
  MySQL (semi-sync `rpl_semi_sync_*`, Group Replication) and SQLite (none). Add a short
  comparison here: a durable remote copy can substitute for a local flush; an async
  replica does not; a failover to an async replica loses acknowledged commits. Link; do
  not re-teach.
- What the application sees: ABSENT; one sentence (no error, no signal).
- Bulk load and test uses (`fsync=off`, `innodb_flush_log_at_trx_commit=2`, unlogged,
  `wal_level=minimal` for load): the unlogged and fsync=off warnings are in 2.12; legit
  uses belong in one line here. Full bulk-load recipes OUT.
- Measuring the gain: worked example (autocommit inserts, three settings) with measured
  commit rates would be strong but must be a labelled local observation; run it (only
  after a real run, never invented). Without a run, show the group-commit arithmetic
  from 2.6 and say it is arithmetic.
Depth: moderate to substantial (to ~650 words). h3s: "The three settings" (existing),
"Choosing what may be lost" (table), "With replicas" (short), "What this does not
change". Keep Figure 9.

### 2.12 What can lose a committed change (188 words)
Needs: complete list, each with window, scope, consistency afterwards, engine, detection.
- The five causes: OK and very useful as a map.
- Convert to a table (cause / how much / engines / database consistent afterwards /
  how you would notice). Add: failover to an asynchronous replica; a failed fsync
  continuing; restoring an old backup; the application's lost reply is 2.13.
Depth: keep, lightly deepen (to ~280 words); a table replaces the list.

### 2.13 What the application knows after COMMIT (145 words)
- Dropped connection, unknown outcome, retry safety: OK as a bridge; covered at length
  in `conflicts-and-retries.astro` (ELSEWHERE, covered).
- One addition: where in the commit protocol (2.6) the acknowledgement is sent, and that
  a server crash is a second route to the same uncertainty. Already stated.
Depth: keep as is.

### 2.14 Backups and point-in-time recovery (856 words, 5 h3s, 1 figure)
The model. Judgement: keep as is structurally.
- Backup of a running database, archive, stop early, cost, other engines: OK.
- THIN only on observing and operating: archive health (`pg_stat_archiver`, V),
  binlog retention (`binlog_expire_logs_seconds`, V) and how far behind the archive is
  (the "commits at risk" quantity). One sentence each, and the restore-rehearsal in
  `backup-and-restore.astro` (ELSEWHERE, covered).
- MySQL and SQLite paragraph: sole home for those engines (see Section 1); consider two
  more sentences each (binlog position vs GTID for the stop point, `mysqlbinlog`;
  SQLite file copy while open is unsafe except via the backup API).
Depth: keep, +60 words at most.

### 2.15 Sources and further reading
- Add the MySQL and SQLite pages used by new subtopics (checkpoints, buffer pool
  flushing, binary-log PITR, status variables, `pragma wal_checkpoint`), PostgreSQL
  monitoring statistics, checksums and release-note entries. Keep it last.

## 3. Topics missing from the article entirely

| Missing topic | Home | Why it matters to the reader |
| --- | --- | --- |
| Observing the system: cache hit rate, dirty pages, checkpoint frequency and duration, log volume, flush time, version history size | per-section "how to see it" h3 or sentence (2.3, 2.4, 2.6, 2.8, 2.10), plus one closing table "What to watch" (engine x signal x what a bad value suggests) | nowhere else in the collection; makes the article usable on call |
| Reading a recovery or checkpoint incident (log lines) | 2.7, 2.8 worked examples | the user's stated task: "read a checkpoint or recovery incident" |
| Replication and commit durability, with MySQL and SQLite equivalents | 2.11 short comparison, linking `replicas-and-failover` | the usual answer to "is one fsync enough", absent for two of three engines |
| Eviction, scan resistance, warm-up | 2.3 | explains post-restart and after-report latency |
| Log volume and retention incidents (disk full from log) | new section after 2.6 | one of the commonest storage incidents |
| Recovery time and its dependence on checkpoint settings | 2.7 and 2.8 | RTO conversation |
| Cloud and virtual storage semantics; failed fsync | 2.10 | hardware judgement named in the brief |
| Free space, file growth and shrinking | 2.2 | "why did the disk not shrink" |
| Indexes are pages and are logged | 2.2, 2.6 | explains log volume and write amplification |

Deliberately out of scope (state so in the article's opening or sources): LSM-tree
engines and other non-B-tree storage; filesystem internals beyond the flush promise;
encryption at rest; compression; SSD wear; kernel I/O tuning (io_uring, schedulers);
bulk-load recipes; distributed consensus durability.

## 4. Depth summary

| Section | Words now | Verdict | Target words | New h3s | New figure or worked example |
| --- | --- | --- | --- | --- | --- |
| Opening | 120 | keep (+3 sentences) | 180 | no | no |
| Rows live in pages | 202 | moderate | 450 | no | no |
| A cache of pages in memory | 256 | split or substantial | 900 | yes (5) | yes: pool-size / hit-rate figure |
| Updating a row | 260 | moderate | 420 | no | table (engine x cost x signal) |
| Changed pages wait | 183 | moderate | 300 | 1 | no |
| The log is written first | 369 | substantial, split in two | 550 + 350 | yes (3) | yes: group-commit figure; autocommit arithmetic |
| Crash recovery | 228 | substantial | 700 | yes (5) | yes: annotated log excerpts |
| Checkpoints | 245 | substantial | 700 | yes (4) | extend Figure 6; worked sizing example; symptoms table |
| Pages torn | 378 | moderate | 400 | no | table |
| Whether a flush reaches the disk | 374 | substantial | 650 | yes (4) | layer table |
| Trading durability | 395 | moderate to substantial | 650 | yes (4) | decision table; run a local measurement if included |
| What can lose a committed change | 188 | keep, convert to table | 280 | no | table |
| What the application knows | 145 | keep | 145 | no | no |
| Backups and PITR | 856 | keep (model) | 900 | existing 5 | existing |
| Sources | 235 | update | 300 | no | no |

Total about 4,700 now; about 7,500 to 8,000 words after. The earlier brief said to keep
the article about its length at the time; the user's instruction supersedes it, but
the plan can be applied in the order below and stopped at any point.

## 5. Ranked by improvement to a professional reader

1. Observability throughout (cache, checkpoint, log volume, flush time, version
   history): the article currently stops at mechanism; no other page covers it.
2. Checkpoints made decision-grade (knobs per engine, symptoms table, sizing example,
   InnoDB continuous model, how to read the output).
3. Crash recovery as an operational event (how long, what the log says, what it cannot
   repair), with annotated startup excerpts.
4. The commit path and the log as a cost (commit latency = flush latency, group commit,
   log volume, retention incidents): split into two sections with a group-commit figure.
5. Buffer pool decisions (eviction, scan resistance, warm-up, sizing, reading the hit
   rate) with the pool-size figure.
6. The durability-settings decision (table by data kind; replication tie-in for MySQL
   and SQLite; what the application sees).
7. Storage hardware judgement (virtual and cloud volumes, failed fsync, latency floor,
   verification tools).
8. Old-version costs per engine (SQLite WAL growth, InnoDB rollback duration, table of
   signals).
9. Pages and files (indexes are pages, free space and shrinking, clustered/heap
   consequence).
10. Torn-page comparison table and the "when it can be off" decision.
11. Convert "What can lose a committed change" to a table; keep PITR and the
    application-knows section.

## 6. Checks before drafting

- Verify every view, status variable, and log line marked V against PostgreSQL 18,
  MySQL 8.4 and SQLite documentation; record in `evidence.md` with the date.
- Any measured number (commit rates, recovery times) requires a real local run on a named
  setup and must be labelled as observation; otherwise present arithmetic only.
- Respect the collection boundaries in Section 1: link to `backup-and-restore`,
  `replicas-and-failover`, `conflicts-and-retries`, `isolation`, `indexes` and the
  PostgreSQL series; PostgreSQL-only operational depth (pg_stat_* tuning specifics,
  autovacuum, pg_wal retention with slots) goes to `postgresql/recovery.astro` and
  `row-versions.astro` after checking they do not already say it.
- Figures: new ones follow the existing `StepFigure` model and the "PostgreSQL:" title
  prefix for engine-specific drawings; general ones (group commit, pool-size knee) are
  labelled models.
- Run the independent review the authoring skill requires after any redraft.
