# Storage depth pass: accuracy, generality and companion consistency, 17 October 2026

Scope: new and changed material in `relational/storage.astro` (about 9,100 words now),
read against the two companions `buffer-pool.astro` (about 6,100) and
`watching-storage.astro` (about 8,100), the writer's fifth-pass evidence note, and my
coverage map. Primary sources were fetched on 17 October 2026 (MySQL 8.4 Reference
Manual, sqlite.org, PostgreSQL 18 docs, pgsql-hackers archive). Nothing was run, so
measured numbers are checked only for internal consistency and labelling. No article
was edited.

## 1. The writer's unverified items, settled

| Item | Verdict | Source and wording |
| --- | --- | --- |
| InnoDB default row format is DYNAMIC | Correct | `innodb_default_row_format`: default `DYNAMIC` (innodb-parameters.html). The "long values off-page behind a 20-byte pointer" text is from innodb-row-format.html (per evidence). |
| `innodb_flush_log_at_trx_commit` is server-wide | Correct | Scope: Global, Dynamic: Yes, "SET_VAR Hint Applies: No" (innodb-parameters.html). Cannot be set per session or per statement. |
| SQLite `synchronous` is per connection | Standard behaviour, no explicit sentence found. pragma.html does not say; wal.html says only that `journal_mode=WAL` is persistent "unlike the other journaling modes". Safe wording: "applies to the connection that sets it and is not stored in the file". Record it as inference from design, not a quote. |
| `PRAGMA page_count` | Correct | "Return the total number of pages in the database file." (pragma.html) |
| InnoDB group commit | Redo log: correct. The glossary says group commit is "an InnoDB optimization that performs some low-level I/O operations (log write) once for a set of commit operations, rather than flushing and syncing separately for each commit." Binary log: `binlog_group_commit_sync_delay` ("how many microseconds the binary log commit waits before synchronizing the binary log file to disk", replication-options-binary-log.html) shows the binary log groups commits too. The 404 page was `binary-log-group-commit.html`; cite the glossary and that option instead. The manual's transaction-management page also says the storage device's I/O throughput "puts a cap on the number of potential operations per second" when each change is followed by a commit, which supports the commit-rate section directly. |
| "unexpected pageaddr" is a normal end-of-log marker | Correct, but not in the user documentation. It is one of xlogreader's standard end-of-WAL checks. Tom Lane said so on pgsql-hackers (2011, thread "unexpected pageaddr"), and a 2012 thread explains the cause: PostgreSQL recycles old WAL segment files, so the page after the real end carries an older page address. Cite the mailing-list threads or the source, not the manual. Storage's explanation ("the crash left the log ending in the middle of a segment") omits the recycled-segment cause; see finding 5. |

## 2. Findings, ranked by consequence

### 1. The sizing example in Checkpoints understates worst-case replay, and contradicts the companion (wrong)

Storage, "What you can set / Choosing an interval" and "Seeing a checkpoint": `distance`
is described as "what recovery would have to replay in the worst case" (320 MB), and
the sizing example says "At 516 MB, replay would take about 3 seconds", then "4 GB would
let about 2 GB accumulate ... a replay of about 12 seconds, still inside 30".

Watching storage says the opposite and is right: distance is "not quite what a crash
would replay: replay starts from the last completed checkpoint, so a crash while the
next one is writing replays nearly two intervals' worth", and the worst case is "close
to max_wal_size", derived as `max_wal_size / (1 + checkpoint_completion_target)`
(about 540 MB for 1 GB, matching the observed 516 MB and 560 MB).

Reasoning (checkpoints start at T, 2T; each finishes about 0.9T later): a crash just
before the checkpoint started at 2T completes replays from the redo point of the one
started at T, which is about 1.9 intervals of log. That also explains why checkpoints
"started at about half" of `max_wal_size`: 1/1.9. The formula is in the source
(`CalculateCheckpointSegments`, 9.5 onward; the old docs had "2 +"), not in the
PostgreSQL 18 documentation, and a 2020 hackers thread calls the documentation of
whether `max_wal_size` covers one or two intervals misleading. Mark it as
"from the source, matched by this run". The documentation does say that reducing
`checkpoint_timeout` or `max_wal_size` "allows faster after-crash recovery".

Consequences for the storage example: worst-case replay at the observed distance is
about 1 GB, so about 6 s at 170 MB/s, not 3 s; raising `max_wal_size` to 4 GB gives
a worst case of about 4 GB, so about 24 s at 170 MB/s, not 12 s, which leaves little
margin against a 30 s target once a cold cache is considered (finding 3).

Repair. Replace the "half of the setting" heuristic with the rule from the companion:
"replay speed times the time you can spend is the ceiling for `max_wal_size`, because a
crash late in a checkpoint replays close to that much." Keep the 20-second example but
recompute: checkpoints came every 20 s because the limit was reached at about 520 MB.
Change "distance ... is what recovery would have to replay in the worst case" to the
watching-storage wording. This is the article's central arithmetic, so it matters.

### 2. The replay speed (170 MB/s) is a favourable figure and is used as a sizing constant (imprecise)

The replay was measured right after a `CHECKPOINT` plus 20 s of update-heavy load, so
the log is dominated by full-page images (the companion measures 95% of bytes as
images in the 20 s after a checkpoint). Replaying an image is a page write; replaying a
small record needs the page read first. A steady-state log has a different mix. The
test also restarted the server process on a warm operating-system cache (`stop -m
immediate` is a process abort, not a reboot), so replay reads came from memory. The
article says "both numbers belong to that machine and that workload" and "measure on
a copy", which is honest, but then multiplies it into a 30-second target and a 4 GB
ceiling. Repair: say that 170 MB/s is a best case (image-heavy log, warm cache), that
a reboot or a failover to a cold standby can be several times slower, and give the
sizing rule in terms of a measured speed. No new number needed.

### 3. Contradictory advice on the dirty-page signal (storage vs watching)

Storage, "Who writes a dirty page": "The share of the pool that is dirty is the signal
to watch ... A pool that is mostly dirty is one where a burst of work will have to wait
for writes." Watching: "How many pages are dirty matters less than which process ends
up writing them" and "A high count on its own is not a fault: most of the pool was
dirty here while the sessions wrote almost nothing themselves." The companion has the
better position (supported by its measured run). Repair storage: "The signal to watch
is who does the writing (writes by query sessions, or `Innodb_buffer_pool_wait_free`
rising); the dirty share only matters when it stays high together with those."

### 4. Wording: "PostgreSQL does it in bursts ... so they don't arrive in one burst" (contradiction in one paragraph)

Storage Checkpoints: "PostgreSQL does it in bursts. Every 5 minutes ..., it picks a
position, writes every page dirtied before it ... spreading the writes over most of
the interval ... so they don't arrive in one burst." The heading is "Burst or
continuous" and the figure is "PostgreSQL's burst model". The checkpoint is
periodic and discrete; its writing is deliberately not a burst (the companion's own
figure shows steady writing through the interval). Repair: "in rounds" or "at
intervals" versus "continuously"; rename the heading "In rounds or continuously" and
the figure caption. This matters because a reader who takes "burst" literally reads
the checkpoint_completion_target discussion backwards.

### 5. Restart-log excerpt: correct as observed, inconsistent with the companion, and the explanation is incomplete

- The two articles show two different end-of-log lines from two different runs:
  storage "unexpected pageaddr ... LSN 0/7740A000", then "redo done"; watching
  "invalid record length at 0/6A1D6850: expected at least 24, got 0", then "redo done".
  Storage says `unexpected pageaddr` "is how PostgreSQL finds the end of the log"; the
  companion says `invalid record length` is how it finds the end, and adds that
  "other messages can mark the end the same way, such as an incorrect checksum or a
  bad prev-link". A reader who opens both thinks the two servers behaved differently.
  They differ because the segment after the end was recycled (stale page address) in
  one run and was fresh and zeroed in the other. Neither article says so.
- Hex check: 0x77409F98 minus 0x53D9DB50 is 593,937,480 bytes, which is 566.4
  MiB (594 MB). The storage article says "566 MB" and "about 170 MB a second"
  (566.4 MiB / 3.35 s = 169 MiB/s). The companion declares "1 MB is 1,024 kB"; storage
  does not. Add the same one-line declaration, or write MiB. Watching's 560 MB
  (560.3 MiB) and 2.8 s follow the declared convention.
- Two runs of "the" crash test appear (3.35 s / 566 MiB in storage, 2.80 s / 560 MiB in
  watching), with the same introduction ("the test above" / "the local server was
  stopped with pg_ctl stop -m immediate"). Label them as separate runs or use one.
- The excerpt trimming is honest ("timestamps and process numbers trimmed", "..."
  for elided fields). The excerpt's `wrote 16384 buffers (100.0%)` fits the 128 MB
  pool.
Repair: one article owns the line-by-line reading (watching storage), and storage keeps
one paragraph and a pointer. In the owner, add one sentence on why two end markers occur
(recycled segment versus unused space) and that both are normal only at the real end of
the log.

### 6. InnoDB message texts are not verified (unverified)

Watching storage quotes "Redo log is running out of free space, pausing user threads"
and lists "Still rolling back transaction ...; ... undo records rolled back out of ...
total", "Database was not shutdown normally!", "Starting crash recovery.", "Doing
recovery: scanned up to log sequence number ...", "Applying a batch of ... redo log
records ...", "Apply batch completed!", attributed to "the MySQL 8.4 error reference".
I read the first 400,000 characters of that page and found none of them; the page is
truncated by the fetch tool, so absence is not proof. A vendor article for 8.0.30 shows
"Out of space in the redo log" (MY-013059), a different message, and the 8.4 source
comments describe user threads being paused when the redo log passes a soft limit,
without the quoted wording. Repair: quote only messages found in the error reference
(with MY- codes), otherwise describe them ("the error log reports that user threads are
paused until the checkpoint advances") and record in the evidence note that the exact
text was not confirmed. `innodb_io_capacity` default 10000 is correct for 8.4
(innodb-parameters.html, default value 10000; `innodb_io_capacity_max` is 2x).

### 7. Measured numbers: labelled honestly, with three discrepancies

Labelling is good: PostgreSQL 18.6, one Apple-silicon laptop, internal SSD,
"an observation rather than a benchmark", model figures labelled "not a benchmark",
"no MySQL server was available, so nothing about InnoDB was measured". The sizing and
warm-up tables in the buffer-pool article are labelled "arithmetic from stated
assumptions".

Discrepancies:
- Storage's commit-rate table says "10,000 rows in one transaction: 8 to 10 ms in all";
  the evidence note records 8.2 to 12.2 ms. Change to "8 to 12 ms".
- The 566 MB and 560 MB figures are MiB (finding 5).
- Storage says macOS "gave about 25,000 commits a second" at the default
  `wal_sync_method` and the companion measures 0.12 ms per write in the 400 tps run.
  Both are plausible (different load, early acknowledgment either way) but they
  look inconsistent side by side. One sentence in the companion that the 400 tps run
  was `open_datasync` on the same laptop (it says so) and that the 0.04 ms vs
  0.12 ms difference reflects contention would do.
- The table of commit rates uses `fsync_writethrough` so that flush is real; that is
  explained. The `synchronous_commit = off` rows (72,000 and 170,000 commits/s) are
  bound by CPU and pgbench, not by storage; say so in a clause so they are not read as
  a storage limit.

Arithmetic presented as arithmetic, all verified:
- 1/5.1 ms = 196 commits/s; 16/10.2 ms = 1,569; 1,570/190 = 8.3, "eight times"; twice
  the latency. "Between one and two flushes", hence 10.2 ms, is a clean explanation.
- The group-commit model (16 clients, 5 ms flush, 1,600/s) matches the 1,570 observed
  and is labelled a model.
- 12,143/16,384 = 74.1%; 26.6 s / 30 s = 89%; 8,348/16,384 = 51%.
- Hit/miss and reads-per-second figures in the companions (40,196 reads / 120 s =
  335/s; 96.3%).
- Sizing table in buffer-pool: every row recomputed (24.8%, 49.5%, 74.3%, 99.0%, 99.1%,
  99.3%, 99.6%; reads 30,100 / 20,200 / 10,300 / 400 / 365 / 296 / 157) correct; "half the
  working set costs fifty times the reads" is 50.5 times. Warm-up 16 GB / 8 kB = 2.1
  million pages, at 5,000 reads/s about 7 minutes. work_mem and SQLite cache totals
  correct. InnoDB "9 GB with 16 instances gives 10 GB" is correct (chunk 128 MB x 16).
- Storage's "log 566 MB in 20 s = 28 MB/s", "516 MB distance every 20 s" correct; the
  derived replay times need the correction in finding 1.
- Watching: 442 MB / (400 tps x 120 s) = 9.4 kB per transaction; correct.

### 8. Replication and commit durability comparison (mostly correct; two small additions)

- PostgreSQL: `remote_write` = standby has written to its file system (survives a
  standby PostgreSQL crash, not an OS crash), `on` = flushed, `remote_apply` = also
  applied. Correct against runtime-config-wal. Add "when synchronous standbys are
  configured" is already there.
- MySQL semisynchronous: wait for at least one replica to acknowledge after writing and
  flushing the relay log; default wait point after the binary log sync and before
  InnoDB commit (AFTER_SYNC); falls back to asynchronous on timeout. Correct per the
  8.4 manual. Add that semisync is a plugin that must be installed and enabled; the
  default is plain asynchronous replication. Group Replication is not mentioned;
  acceptable as out of scope.
- "An ordinary asynchronous replica adds no guarantee at all" is too strong for the
  general reader: it adds a second copy of whatever was shipped, which is why it covers a
  lost disk. The sentence means "no guarantee for the commits not yet shipped". Reword.
- "SQLite has no replication of its own" correct.

### 9. Checkpoint, symptoms and settings tables

- Settings table: PostgreSQL defaults correct (5 min, 1 GB, 0.9, 80 MB min_wal_size,
  checkpoint_warning 30 s). InnoDB: `innodb_redo_log_capacity` 100 MiB default is right
  for 8.4 (104,857,600 bytes); `innodb_max_dirty_pages_pct` 90, `_lwm` 10,
  `innodb_adaptive_flushing` on, `innodb_io_capacity` 10,000 correct. SQLite
  `wal_autocheckpoint` 1,000 pages and the four manual modes correct.
- "InnoDB: nothing in particular starts a checkpoint": acceptable, now matched by the
  companion ("InnoDB has no checkpoint events to log").
- Symptom 2 (periodic latency, "spread the writes (checkpoint_completion_target)"):
  the target is already 0.9 and the documentation recommends no higher than 0.9, since
  1.0 "is quite likely to result in checkpoints not being completed on time". Replace
  the remedy with a longer `checkpoint_timeout` or more `max_wal_size` (fewer rounds,
  fewer full-page images), or more I/O capacity.
- Symptom 4 (SQLite): remedy "RESTART or TRUNCATE in a gap between readers" matches
  wal.html ("readers might block while the checkpoint is running"). Add the doc's
  point that automatic checkpoints are PASSIVE and may not finish with readers.
- Watching's PostgreSQL 1 GB vs 64 MB comparison table: internally consistent
  (num_done 3 and 12 explained), latency rise hedged as "an indication, not a
  measurement". Good.

### 10. Torn-page and flush tables

- Torn-page table correct. Details: PostgreSQL FPI "up to 8 kB per page per
  checkpoint"; InnoDB doublewrite "a second write of every page flushed, to a sequential
  area" (manual: "written in a large sequential chunk, with a single fsync()").
  SQLite WAL "log kept until the checkpoint is flushed" fine.
- "The manual notes the buffer is turned off automatically on Fusion-io devices that
  support atomic writes" is documented in the doublewrite page (including that the
  setting is global and applies only to Fusion-io NVMFS on Linux). Correct; it is a
  historic hardware example, so say "for example, Fusion-io NVMFS" and the reader
  can see how narrow it is. `innodb_checksum_algorithm` default crc32 correct.
  SQLite page checksums: not by default, correct (cksumvfs optional).
- "full_page_writes can be off on ZFS": the PostgreSQL reliability page names ZFS as an
  example of a file system that prevents partial page writes. Correct.
- Flush table: layers and mitigations are sound. "A failed fsync: PostgreSQL
  `data_sync_retry` off raises PANIC" correct for data files; the WAL fsync failure is
  always a PANIC, so "treats this as fatal" is right. The text does not say what
  InnoDB or SQLite do on a failed flush. Leave out or add "InnoDB also stops rather than
  continue" only if sourced; unverified, so do not add without the source.
- The 7,200 rpm arithmetic and its SSD caveat are now correct and clearly labelled
  arithmetic.
- "SQLite's own documentation says it must believe whatever the operating system and
  hardware report": the atomic-commit page says SQLite assumes flush works, cannot
  detect otherwise (section 9.2). Paraphrase accepted.

### 11. Other accuracy points in the new material

- WAL writes "once instead of twice": correct and documented (wal.html: "writing the
  content once (versus twice for rollback-journal transactions)"); the checkpoint
  copy later is the other write, and the article already tabulates it.
- "A commit in this mode needs several flushes: two for the journal and one for the
  database file": consistent with the atomic-commit page (journal flushed, header
  updated and flushed again, database flushed).
- "like every automatic one, does not wait for readers": correct (automatic checkpoints
  are PASSIVE).
- Plain `VACUUM` "doesn't return [space] to the operating system": add "usually" (it
  can truncate empty pages at the end of the table).
- InnoDB "rollback cannot be cancelled" (watching) is stronger than the manual, which
  gives an escape: restart with `innodb_force_recovery=3`. Reword to "restarting does
  not cancel it; the documented escape is `innodb_force_recovery=3`, at a cost".
- InnoDB `trx_rseg_history_len` "enabled by default" (watching): plausible, not
  re-fetched. `Innodb_redo_log_logical_size` exists in 8.0.30+. Fine.
- `SQLITE_DBSTATUS_CACHE_WRITE` described as pages written "to the WAL file": it counts
  dirty pages written to disk (database file or WAL, depending on mode). Say "to disk".
- Buffer-pool article: PostgreSQL 18 ring sizes ("starts at 256 kB, about 2.3 MB,
  capped at pool divided by process slots; 94 buffers at 128 MB") are derived from the
  source and observed in the run (94 at 128 MB, 32 per process in a 16 MB pool).
  Observed, internally consistent (16,384/174 = 94; 2,048/174 = 11), but not documented;
  the article says "about" and shows measurements, which is the right hedge. Consider
  trimming the cap derivation, which is source-level detail with little decision value.
- `pg_prewarm`: "two workers read them back after a restart" – the autoprewarm
  leader starts a worker per database, so the number depends on the databases; say
  "workers".
- `innodb_old_blocks_pct` 37, `innodb_old_blocks_time` 1,000 ms confirmed; the
  description ("how long a block ... must stay there after its first access") matches.
- `--innodb-dedicated-server` percentages (128 MB below 1 GB, half from 1 to 4 GB, 75%
  above) not re-fetched by me; the evidence note should record the source page.

### 12. Generality check

Storage remains general: engine names appear only where they change a prediction;
PostgreSQL-prefixed figure titles (Figure 2 now prefixed; all PostgreSQL-model figures
have the prefix; the group-commit and pool figures are labelled models). Remaining
PostgreSQL-shaped text in a general article:
- The checkpoint "burst model" naming (finding 4) frames PostgreSQL's design as the
  default.
- "Who writes a dirty page" lists three PostgreSQL writers before InnoDB's page cleaners
  and gives the PostgreSQL view first; acceptable since PostgreSQL is the worked example.
- The checkpoint warning excerpt, `pg_stat_checkpointer`, `pg_stat_wal` snippets are
  PostgreSQL-only and labelled.
- InnoDB gets no measured output anywhere (stated), so InnoDB readers rely on manual
  text. That is honest but means no restart log excerpt for the engine the audience
  includes. Do not fabricate one; consider asking for a captured excerpt from a real
  MySQL 8.4 restart when one is available.
- First person ("I measured this once", "I did not have a MySQL server") appears in
  storage; the companions use "the local run". Align to one voice.

## 3. Companion consistency and ownership

Overlap is large. Proposed single owners:

| Topic | Where it is explained now | Contradictions | Owner and action |
| --- | --- | --- | --- |
| Hit rate definition, ratio pitfalls | buffer-pool "Reading the hit rate" (5 pitfalls) and watching "Reads and the cache" (definition, "ratio hides what costs time", numbers) | Same point twice with different numbers (99% vs 100,000 req/s; 96% / 335 reads/s) | buffer-pool owns interpretation. Watching keeps the counters table, its one local reading and a link. |
| Who writes dirty pages | storage "Who writes a dirty page", buffer-pool "When evicting a page means writing it", watching "Dirty pages and who writes them" | Dirty share as the signal (storage) vs not the signal (watching); finding 3 | Watching owns observation. Storage keeps the mechanism in 4 sentences; buffer-pool keeps eviction-forces-a-write and points to watching. |
| Checkpoint log line | storage "Seeing a checkpoint" (12,143 buffers, 30 s timeout) and watching "The checkpoint log line" (8,348 buffers) | Two runs, same field-by-field walk-through; worst-case replay claim differs (finding 1) | Watching owns the line-by-line reading. Storage keeps the sizing decision and one short excerpt only if the arithmetic needs it. |
| Too-frequent checkpoints warning and max_wal_size | storage excerpt + sizing; watching excerpt + 1 GB vs 64 MB experiment | Storage's "about half" vs watching's formula | Watching owns the observation; storage owns the decision rule; both must use the (1 + completion target) relation. |
| Restart log reading | storage "Reading the restart log"; watching "Reading a restart" with six-point list | Different end-of-log marker (finding 5) | Watching owns it; storage links. |
| Log volume and retention | storage "How much log there is, and why it stays" (causes list) and watching "How fast the log grows, and why it stays" (rate queries, archive-failure and slot experiments) | None, but the same list is written twice | Watching owns the experiments and queries. Storage keeps one paragraph on what holds log back and a pointer. |
| Flush timing | storage "Seeing flush time" (short) and watching "Flush time and commit latency" | None | Fine as is; storage already points. |
| Old-version cost | storage table and watching "Old row versions" with SQLite WAL growth experiment | None | Fine; storage table is the summary. |
| Cold cache and warm-up | storage 4 sentences; buffer-pool full section | None | Fine. |

No outright contradictions in InnoDB or SQLite facts across the three articles.
Contradictions are the four in findings 1, 3, 4/5 and the worst-case replay
statement, all in storage. Watching storage is the more careful of the three in this
overlap.

## 4. Coverage map status

| Map item | Status | Note |
| --- | --- | --- |
| 1. Observability throughout | Met, partly overdone | Watching carries it well. Storage now repeats pieces (checkpoint line, restart log, log-keeping list). Trim storage to the one signal each decision needs. |
| 2. Checkpoints decision-grade | Met in coverage, flawed in the sizing arithmetic | Fix findings 1, 2, 4. |
| 3. Crash recovery as an operation | Met | Annotated PostgreSQL excerpt is good. InnoDB has no real excerpt (honestly stated). Fix duplicated and inconsistent end-of-log explanations. |
| 4. Commit path and log cost | Met, strong | Commit-rate table plus group-commit figure carry it; labelling honest. |
| 5. Buffer pool decisions | Met, delivered as a separate article | Well sourced. Storage's cache section is correctly a pointer. |
| 6. Durability-settings decision and replication | Met | Decision table and replication paragraph good; small rewording (finding 8). |
| 7. Storage hardware judgement | Thin | Layers table and fsync-failure paragraph are good, but nothing on storage classes beyond "orders of magnitude", no filesystem/mount aspects, and no other engine's fsync-failure behaviour. Acceptable as scoped; do not invent numbers. |
| 8. Old-version costs per engine | Met | The SQLite WAL growth experiment in watching is the standout. |
| 9. Pages and files | Met | Indexes-are-pages, free space, sizes, row format all present. |
| 10. Torn-page table and "when it can be off" | Met | Fusion-io example verified; narrow. |
| 11. What-can-lose table; PITR kept | Met | Table clear; PITR section unchanged in shape, with new MySQL stop-position and binlog retention details verified. |
| Missing-topic list (eviction, warm-up, retention incidents, recovery time, free space) | All now present | Recovery time is the one with an arithmetic flaw (finding 1). |
| Overdone | Storage length (about 9,100 words) and duplicated observation text | The observation text in storage is the first candidate to cut; the commit-rate and group-commit material is not. |

## 5. Ranked summary of what to fix

1. Checkpoint sizing arithmetic and the "distance is the worst case" sentence (wrong);
   adopt the companion's `max_wal_size / (1 + target)` rule and recompute.
2. State that 170 MB/s is a favourable replay speed (image-heavy log, warm cache) before
   it is used as a ceiling.
3. Dirty-page signal contradicts the companion; change storage's wording.
4. "Burst" wording contradicts the spreading described in the same paragraph.
5. Restart-log explanation: reconcile the two end-of-log markers, one owner,
   MiB units, two runs labelled.
6. InnoDB log message texts and "cannot be cancelled": quote only what is found; mention
   `innodb_force_recovery=3`.
7. Small numeric and wording items: "8 to 12 ms", "asynchronous replica adds no
   guarantee at all", semisync is a plugin, plain VACUUM, SQLITE_DBSTATUS_CACHE_WRITE,
   symptom-2 remedy, first-person voice.
8. De-duplicate storage against watching storage per the ownership table.
