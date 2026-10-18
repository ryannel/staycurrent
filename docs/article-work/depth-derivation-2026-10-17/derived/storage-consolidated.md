# Storage and durability in relational databases: consolidated plan

Consolidated on 18 October 2026 from `kit.md`, planner A (`storage-a.md`), planner B
(`storage-b.md`) and external evidence. No existing article, skill or work note was
opened before this file was saved.

**Result: three articles, two deep dives and one companion, about 10,600 words and
about 57 minutes of reading in all.**

| # | Article | Role | Words | Reading time |
|---|---|---|---|---|
| 1 | How a relational database stores your data | Deep dive | ~4,300 | ~23 min |
| 2 | How a commit survives a crash | Deep dive | ~3,700 | ~20 min |
| 3 | Checkpoints, torn pages and the log on disk | Companion to 2 | ~2,600 | ~14 min |

## 1. The expert's abilities

The expert is a practitioner who designs tables, chooses settings and handles incidents,
not someone who writes a storage engine. Both planners agreed on this bar, and the
evidence supports it: the vendor manuals put these choices to operators directly, while
CMU 15-445, Petrov's *Database Internals* and ARIES mark the implementer's ceiling.

1. **Say where a row lives and what it costs.** Pages (PostgreSQL 8 KB, InnoDB 16 KB,
   SQL Server 8 KB, SQLite 4 KB by default), row overhead (PostgreSQL's 23-byte header
   and 4-byte line pointer; InnoDB's 5-byte header plus 6-byte `DB_TRX_ID` and 7-byte
   `DB_ROLL_PTR`, confirmed in the MySQL 8.4 row-format page), and when large values move
   out of line (TOAST at about 2 KB; InnoDB DYNAMIC leaves a 20-byte pointer; SQL Server's
   8,060-byte row limit; InnoDB's "Row size too large" at about half a page).
2. **Choose a primary key knowing how the table is organised.** Heap with indexes
   pointing at a physical address, or a table stored inside its primary-key B-tree with
   secondary indexes carrying the key. Predict secondary-index size, range reads and the
   cost of random keys. Tomas Vondra's EDB measurement (one hour, 5,000 inserts a
   second): about 2 GB of WAL with a bigserial key against more than 40 GB with a random
   UUID, mostly full-page images in the primary-key index. PostgreSQL 18 adds `uuidv7()`.
3. **Predict what updates and deletes leave behind.** Where old versions live in each
   engine, what cleans them up, that one long transaction holds back cleanup everywhere,
   and why files rarely shrink.
4. **Reason about memory.** Working set against buffer pool, dirty pages written later,
   double caching in PostgreSQL against InnoDB's `O_DIRECT` (the MySQL 8.4 default on
   Linux where supported), and the warm-up after a restart or failover (InnoDB dumps and
   reloads its buffer pool list by default for this reason).
5. **Explain what COMMIT promises, against each kind of failure.** Process crash, OS
   crash, power loss, lost machine. The log record is on stable storage before success is
   reported; pages follow later; recovery replays the log from a checkpoint.
6. **Predict rollback and restart time.** PostgreSQL rolls back instantly. InnoDB rolls
   back unfinished work in a background thread after accepting connections; the manual
   says this "can be three or four times" as long as the transaction ran and cannot be
   cancelled. SQL Server's recovery is "roughly proportional to the size of the longest
   active transaction" unless Accelerated Database Recovery is on, which it always is in
   Azure SQL.
7. **Price a commit and choose how durable it is.** One flush per commit, shared through
   group commit, sets a floor on latency and on one connection's commit rate. Tell the
   settings that lose recent commits (PostgreSQL `synchronous_commit = off`, whose window
   is "three times `wal_writer_delay`"; InnoDB `innodb_flush_log_at_trx_commit = 0/2`;
   SQLite WAL with `synchronous = NORMAL`, "always consistent" but not durable; SQL Server
   delayed durability) from those that risk corruption (`fsync = off`, SQLite
   `synchronous = OFF`).
8. **Know what the storage stack must honour.** Volatile caches, power-loss protection,
   torn pages and their guards, fsync failure handling since 2018, SQLite on network file
   systems (WAL "does not work over a network filesystem"), checksums.
9. **Treat the log as a resource.** Diagnose a growing log: replication slots, failed
   archiving, SQL Server's full recovery model without log backups, long transactions
   (SQL Server's ADR page: the log "can grow very large"), SQLite checkpoint starvation
   ("the WAL file will grow without bound").
10. **Know where one server's durability ends.** Machine loss needs replication, operator
    error needs backups, and managed storage moves the flush (Aurora's 4-of-6 write
    quorum across three zones).

## 2. Coverage map

Layer: 1 model, 2 working mechanism, 3 expert's cases, 4 product specifics, R reference.
"Mechanism" means explanation, a figure and its consequences.

### Article 1: How a relational database stores your data

| # | Part | Layer | Needs | ~Words |
|---|---|---|---|---|
| 1.0 | Opening: the model of pages, memory, organisation and versions (see "What layer 1 must say") | 1 | Paragraphs | 250 |
| 1.1 | Pages as the unit of storage, I/O and caching; page sizes by engine | 2 | Mechanism, slotted-page figure | 350 |
| 1.2 | Row cost: header, null bitmap, slot pointer, per-engine overhead; how to measure real size | 2 | Short mechanism, overhead table | 300 |
| 1.3 | Estimating a table before it exists, then measuring it (PostgreSQL against InnoDB) | 2 | One worked example | 300 |
| 1.4 | Large values out of line by engine; row-size errors; cost of `SELECT *` and of updates that leave the large value alone | 2 | Short mechanism, engine table | 400 |
| 1.5 | Table organisation: heap or clustered; how a secondary index reaches a row (address or key); SQL Server's choice, SQLite rowid and WITHOUT ROWID | 2 | Mechanism, two-lookup figure | 600 |
| 1.6 | Consequences for key choice: short keys copied into every secondary index; range reads by key; random against time-ordered keys, including that in PostgreSQL the damage lands on the primary-key index, not the heap | 2 | Worked example with measurements (bigint, UUIDv4, UUIDv7: size and log volume); split mechanics linked to Indexes | 450 |
| 1.7 | Memory: buffer pool and OS cache, hits and misses, dirty pages written later, the working-set cliff, scans that would push hot pages out; cold cache after restart or failover; sizing figures as calibration | 2 (warm-up 3) | Mechanism, figure | 450 |
| 1.8 | Where old versions live: in the table (PostgreSQL); in place with undo (InnoDB); in place with tempdb or the persistent version store (SQL Server); page copies in journal or WAL (SQLite, one writer) | 2 | Mechanism, "one update, two engines" figure | 450 |
| 1.9 | What an update writes to indexes under each organisation (the Uber case and its limits; HOT named, detail in the PostgreSQL series) | 2 | Worked example | 250 |
| 1.10 | Cleanup and what blocks it: vacuum, purge, version cleaner; the long or idle transaction; one symptom per engine | 2 | Paragraphs, symptom examples | 300 |
| 1.11 | Space reused but rarely returned; fill factor; rewrite tools and their lock and space costs | 3 | Worked experiment (update all, delete half, clean, rewrite; repeat with a transaction left open) | 400 |
| 1.12 | Edges: compression in a sentence, column stores and LSM engines as links | 2 | Sentences, links | 100 |

### Article 2: How a commit survives a crash

| # | Part | Layer | Needs | ~Words |
|---|---|---|---|---|
| 2.0 | Opening: the model of log, flush, later page writes and replay, and the cost | 1 | Paragraphs | 200 |
| 2.1 | What a commit promises: failures (process, OS, power, machine) and what covers each | 2 | Table, paragraph | 300 |
| 2.2 | Why pages aren't written at commit; the write-ahead rule; the commit record; pages written later; each engine's log (WAL, redo log plus binlog, transaction log, rollback journal or WAL) | 2 | Mechanism; stepped figure of one commit with crash points and what survives each | 700 |
| 2.3 | The flush and its price: flush latency as the floor for one connection; group commit; batching rows into one transaction; calibration by storage class | 2 | Worked measurement (`pg_test_fsync`, one client against many, batched inserts) | 550 |
| 2.4 | Checkpoints in brief: what they bound (log to replay, log kept) | 2 | Paragraph, figure shared with 2.5 | 200 |
| 2.5 | Crash recovery: redo from the checkpoint; undo where it exists; why PostgreSQL rolls back instantly, InnoDB in the background and slowly, SQL Server in proportion to the longest transaction unless ADR is on | 2 | Mechanism, log-timeline figure | 500 |
| 2.6 | Choosing how durable a commit is: loss against corruption; settings table across engines with scope (per transaction in PostgreSQL and SQL Server, global in InnoDB, per connection in SQLite); `sync_binlog`; unlogged tables; three short cases (telemetry, restartable bulk load, payments) | 2 | Decision table, worked cases; experiment (asynchronous commit plus immediate shutdown loses the last commits and nothing else) | 800 |
| 2.7 | Corner cases of relaxed commits: visible before durable (another session or an email acted on a commit a crash erased); a planned SQL Server shutdown loses delayed-durable commits like a crash | 3 | Two short examples | 200 |
| 2.8 | The promise assumes the storage honours a flush (one paragraph; full treatment in article 3) | 2 | Paragraph | 120 |
| 2.9 | Where one server's durability ends: replication, backups, managed storage, an acknowledgement lost in transit | 2 | Paragraph, links | 250 |

### Article 3: Checkpoints, torn pages and the log on disk

| # | Part | Layer | Needs | ~Words |
|---|---|---|---|---|
| 3.0 | Reminder of article 2; the three problems pages-written-later leave | 1–2 | Paragraph | 150 |
| 3.1 | Checkpoint costs: restart time against write load, I/O bursts; calibration (PostgreSQL 5 min or 1 GB spread over 90%; InnoDB bounded by redo capacity; SQL Server 1-minute indirect target; SQLite at 1,000 pages) | 3 (calibration 4) | Mechanism, figure | 450 |
| 3.2 | Torn pages: page against sector writes; full-page images, doublewrite, SQLite's journal; SQL Server detects with checksums and repairs from backup or replica; why turning guards off is rarely safe | 3 | Mechanism, torn-page figure | 400 |
| 3.3 | What one write costs, tallied: log, full-page image after a checkpoint, page, doublewrite; random keys multiply the images | 3 | Worked example with measurements | 300 |
| 3.4 | Trusting the stack: volatile caches, power-loss protection, the 2018 fsync failure and the PANIC change, file-system differences, SQLite on network file systems, cloud volumes, how to test | 3 | Layered figure, paragraphs | 550 |
| 3.5 | Detecting damage: page checksums (default from PostgreSQL 18), log CRCs; detection, not repair | 3 | Paragraph | 150 |
| 3.6 | The log as a resource: what holds its tail in each engine; what a full log disk does; log volume as replication and backup cost | 3 | Figure, symptom examples | 550 |
| 3.7 | Long transactions at recovery: restart time and rollback that cannot be cancelled | 3 | Worked example | 150 |

### Parts given another home

| Part | Home |
|---|---|
| Why versions exist; who sees them | Isolation and snapshots (1.8 gives a reminder sentence) |
| B-tree structure, page splits, covering and index-only scans | Indexes (1.5–1.6 own table organisation and key choice) |
| Cache-hit, I/O-wait and slow-query diagnosis | Understanding database performance |
| Synchronous replicas, failover data loss | Replication and failover |
| Base backups, log archiving, point-in-time recovery, SQL Server recovery models as backup policy | Backups and recovery (3.6 covers only log retention) |
| A commit whose acknowledgement was lost | Handling conflicts and uncertain outcomes |
| Schema changes that rewrite tables | Changing a schema while the application runs |
| Batch deletes and partition drops | Retention and deletion; Partitioning and sharding |
| JSON size choices | Tables and JSON (links to 1.4) |
| HOT, autovacuum tuning, freezing and wraparound | Row versions, transactions, and vacuum (PostgreSQL series) |
| `wal_level`, `wal_sync_method`, `full_page_writes` tuning, `pg_waldump` | WAL, checkpoints, and recovery (PostgreSQL series) |
| Files, processes, 1 GB segments, alignment padding | PostgreSQL series |
| Column storage | Column-stores essay |
| Encryption at rest | Controlling access |

Totals: article 1 about 4,300 words; article 2 about 3,700; article 3 about 2,600.
Layer 4 appears only as engine notes inside tables and calibration lines; the settings
tables in 2.6 and the calibration list in 3.1 are **reference** inside their sections.

## 3. Articles

Reading times are words at 250 a minute, plus about 45 seconds a figure and a minute or
two for each worked example.

1. **How a relational database stores your data** (deep dive, ~23 min: 17 min of text,
   five figures, three worked examples). Rows, pages, organisation, key choice, memory
   and what updates leave behind. Its argument runs from "where a row lives" to "why the
   table is bigger than you thought", and space reclamation closes it as layer 3.
2. **How a commit survives a crash** (deep dive, ~20 min: 15 min of text, three figures,
   two worked examples). The log, the flush and its price, recovery, and the settings
   choice the mechanism builds to. Readers who arrive with the settings question should
   find it here, after the four paragraphs that make it decidable.
3. **Checkpoints, torn pages and the log on disk** (companion to 2, ~14 min: 10 min of
   text, three figures, two worked examples). The operator's cases: what keeps
   pages-written-later safe, what that costs, whether the storage can be trusted, and
   why the log grows.

Reading order: 1, then 2; 3 when the matching problem comes up. Article 2 opens with a
paragraph on pages and dirty buffers so a reader can start there.

## 4. Boundaries

- **The PostgreSQL series** takes parameters, monitoring views and file layout. The
  general articles name other engines only where they change a prediction or decision:
  clustered tables, where old versions live, rollback and recovery time, torn-page
  handling and durability settings.
- **Indexes** owns the B-tree and how splits work. Article 1 owns key choice because in
  a clustered engine the table is the index.
- **Isolation and snapshots** owns visibility; article 1 owns what versions cost on disk.
- **Replication, backups and uncertain outcomes** own everything beyond one server;
  2.9 marks the line, and 3.6 says only why those features hold the log.
- **Understanding database performance** owns diagnosis; article 1 gives the mechanism
  a diagnosis depends on.

## 5. Left out

- **ARIES internals and the steal/no-force vocabulary.** The expert needs "redo, and
  sometimes undo, from a checkpoint", and why PostgreSQL needs no undo, not the proof.
- **Buffer replacement algorithms.** Their one consequence, scans pushing hot pages out,
  takes a sentence.
- **Allocation structures and byte formats** (free space map, GAM, PFS, IAM, page
  headers, log record formats). No decision depends on them.
- **Compression and in-memory engines** beyond a sentence; **RAID, raw devices,
  tablespace placement**; PostgreSQL 18 asynchronous I/O; InnoDB change buffer and
  adaptive hash index. Options or internals with no reader decision attached here.
- **LSM engines.** None of the four engines uses one by default.

## 6. Uncertainty

- **Whether old versions and space reclamation deserve a companion.** I folded them into
  article 1 (about 1,400 words across 1.8–1.11). If Row versions, transactions, and
  vacuum is thin on the cross-engine model, or readers arrive mainly with "why didn't my
  table shrink?", a companion would serve better. Search data would settle it.
- **Home of the random-key lesson.** Article 1 or Indexes. The secondary-index and
  clustered consequences tie it to organisation, but the full-page-image effect is an
  index effect. Seeing Indexes' scope would decide.
- **How many readers run their own storage.** 3.4 matters less on managed services.
- **Commit-latency calibration.** Public figures vary: a ClickHouse benchmark reported
  about 11 ms per WAL flush on a 3,000-IOPS gp3 volume against 1.5 ms on local NVMe under
  load. Measured `pg_test_fsync` runs on representative instances should replace them.
- **Facts to verify when writing:** exact InnoDB and SQL Server per-row overhead
  (measure, don't add fields up); whether PostgreSQL 19 has changed any default cited.

## Where the planners disagreed and how it was settled

| Question | A | B | Settled | Why |
|---|---|---|---|---|
| Article count | 4 (two deep dives, two companions) | 3 (two deep dives, settings companion) | 3: A's deep dives, one companion | Two deep dives answer two questions readers bring separately; both planners agreed. The other splits were tested below. |
| Updates, deletes and space | Own companion (2,050 words) | Section of article 1 | Article 1 (layers 2 and 3) | Where versions live and what blocks cleanup is everyday prediction, so it belongs in the deep dive body. What remains at layer 3 is about 400 words, too little for a page, and PostgreSQL detail goes to the series. |
| Durability settings | Climax of the commit deep dive | Companion with commit cost and five cases | Deep dive (2.3, 2.6) | Commit cost is the main cost of the whole mechanism and must sit at layer 2. Every engine defaults to full durability (MySQL `innodb_flush_log_at_trx_commit = 1`, SQL Server `DELAYED_DURABILITY = DISABLED`, SQLite FULL for rollback journals, PostgreSQL `synchronous_commit = on`), so the decision is a table and three cases, not a practice that needs a page. |
| Checkpoints, torn pages, stack | Companion | Inside the commit deep dive | Companion, with the basic checkpoint and recovery model kept in the deep dive | Torn-page guards and stack honesty don't change an everyday decision except "leave the guards on"; recovery time does, so redo and undo stay at layer 2. |
| The log as a resource | Absent | 650 words | Article 3, 550 words | A real incident class in every engine: SQLite's "grow without bound", SQL Server's untruncatable log, PostgreSQL slots and archiving. A missed it. |
| Buffer pool | 600 words, figure | 350-word paragraph | 450 words, figure, plus warm-up | It carries the bridge to durability (dirty pages written later) and the working-set cliff; diagnosis stays with performance. |
| Random keys | Measured worked example | Shorter, linked to Indexes | Measured example, splits linked | Vondra's measurement gives a twentyfold log difference; numbers teach this faster than prose. |
| Interactive crash-point model | — | Interactive model | A stepped figure | Each crash point has one outcome; a stepped sequence teaches it and interactivity is optional. |
| Worked durability cases | Within 900 words | Five cases, 550 words | Three cases in 2.6, two corner cases in 2.7 | The cases differ in only two variables (can the loss be redone, did anything outside see the commit). |

**What both missed.** Warm-up after a restart or failover (1.7). That InnoDB's
post-crash rollback runs in the background, takes three or four times as long as the
transaction ran and cannot be cancelled (2.5, 3.7). That a planned SQL Server shutdown
loses delayed-durable commits like a crash, and a PostgreSQL immediate shutdown counts as
a crash for asynchronous commits (2.6–2.7). That in PostgreSQL random keys damage the
primary-key index rather than the heap (1.6). That ADR is always on in Azure SQL, which
changes the recovery prediction for many SQL Server readers (2.5).

## What layer 1 must say

A relational database keeps each table in files divided into fixed-size pages, works on
copies of those pages in memory, and writes changed pages back later. Rows sit either in
a heap that indexes point into or inside the primary-key index itself, which is why key
choice affects size and insert speed. A change never simply erases the old row: the old
version is kept somewhere until no transaction needs it, so tables grow and rarely
shrink. To make a commit safe without writing every changed page, the database first
records the change in a log and forces that log to stable storage; COMMIT returns once
the record is there, and after a crash the database replays the log from its last
checkpoint. The costs are a flush on every commit, which concurrent commits share, and
every change written at least twice. The promise holds only if the storage honours the
flush, and only for that one machine. Relaxing the flush risks losing the last few
commits; turning off the safeguards risks corruption.

Simplifications a later layer must undo: "records the change in a log" fits WAL engines;
SQLite's default rollback journal records the old page instead and writes the database
file at commit (2.2). "COMMIT returns once the record is there" holds for the defaults
only (2.6). "The old version is kept somewhere" covers both versions in the table and
in-place updates with undo (1.8).

## Sources

- PostgreSQL 18 docs: WAL reliability, asynchronous commit, release notes (checksums by
  default, `uuidv7()`), page layout, TOAST.
- MySQL 8.4 Reference Manual: InnoDB row formats, startup options
  (`innodb_flush_method`, `innodb_flush_log_at_trx_commit`), InnoDB recovery, buffer pool
  save and restore.
- SQLite: `PRAGMA synchronous`, Write-Ahead Logging.
- Microsoft Learn: Control Transaction Durability, Accelerated Database Recovery, KB 230785
  on torn-page detection.
- T. Vondra, "On the impact of full-page writes" (EDB).
- ClickHouse, "Postgres isn't slow, your storage is" (commit latency on gp3 and NVMe).
- Both planners' sources: Pillai et al. (OSDI 2014), PostgreSQL wiki "Fsync Errors",
  Verbitski et al. (SIGMOD 2017), Uber Engineering (2016), CMU 15-445.
