# Storage and durability in relational databases: derived depth (planner B)

Subject: how a relational database stores its data and keeps committed changes safe.
Collection: general relational databases, PostgreSQL as the usual worked example, with
MySQL/InnoDB, SQLite and SQL Server where they change a prediction or a decision.

**Result: three articles, about 10,600 words, about 54 minutes of reading** (two deep
dives and one companion).

## 1. The expert's abilities

An expert practitioner here is an engineer who designs tables, chooses settings and
handles incidents, not someone who writes a storage engine. They can:

1. **Say where a row physically lives and what it costs.** Data sits in fixed-size pages
   (PostgreSQL 8 KB, InnoDB 16 KB, SQL Server 8 KB, SQLite 4 KB by default). They can
   estimate a table's size from its schema, because each row carries an overhead: 23 bytes
   of header and a 4-byte pointer in PostgreSQL, a 5-byte header and 13 bytes of hidden
   transaction fields in InnoDB.
2. **Predict the consequences of table organisation.** PostgreSQL keeps tables as heaps
   that indexes point into. InnoDB always stores the table inside its primary-key B-tree,
   SQL Server does so when a clustered index exists, and SQLite stores rowid tables in a
   B-tree keyed by rowid. The expert knows what this means for choosing a primary key,
   for secondary-index lookups, for random-key inserts and for the cost of updating
   indexed columns. Uber's 2016 move from Postgres to MySQL, and the responses to it,
   turned on exactly this difference.
3. **Predict what happens to large values.** These include TOAST, InnoDB off-page
   columns, SQL Server row-overflow storage and its 8,060-byte limit, and SQLite overflow
   pages. The expert also knows the "row size too large" class of errors.
4. **Predict where updates and deletes leave space.** They know where each engine keeps
   old row versions, what cleans them up, why one long transaction blocks that cleanup in
   every engine, and why files rarely shrink.
5. **Explain what COMMIT guarantees.** The log record reaches stable storage before
   success is reported, and data pages are written later. Recovery replays the log from
   a checkpoint. Some engines also undo incomplete work, which is why a large rollback
   can take a long time in InnoDB, and in SQL Server without Accelerated Database
   Recovery, but is instant in PostgreSQL.
6. **Estimate what a commit costs and choose durability settings knowingly.** One flush
   per commit, shared through group commit, sets a floor on latency and on the rate of
   serial commits. The expert can tell the settings that lose recent commits (PostgreSQL
   `synchronous_commit=off`, InnoDB `innodb_flush_log_at_trx_commit=0/2`, SQLite WAL with
   `synchronous=NORMAL`, SQL Server delayed durability) from the settings that can
   corrupt data (`fsync=off`, SQLite `synchronous=OFF`).
7. **Know what the hardware and OS must honour.** That covers write caches, power-loss
   protection, torn pages and their guards (full-page images, the doublewrite buffer),
   network filesystems under SQLite, fsync failure handling, and checksums.
8. **Treat the log as a resource.** The expert can diagnose a growing log. Causes include
   replication slots, failed archiving, SQL Server's full recovery model without log
   backups, long transactions and SQLite checkpoint starvation.
9. **Know where single-node durability ends.** It does not survive losing the machine
   (that needs replication), operator error (that needs backups) or, in managed services,
   a change in where the log lives.

**Evidence.**
- Standard texts agree on this split, but they teach it to implementers:
  - CMU 15-445 (Fall 2024) gives three lectures to storage, one to the buffer pool and
    one each to logging and recovery.
  - Petrov's *Database Internals*, Part I, covers file formats, B-trees, buffer
    management, recovery, steal/force and ARIES.
  - Hellerstein, Stonebraker and Hamilton's *Architecture of a Database System* (2007)
    covers storage and buffer management and the log manager.
  - Kleppmann's *DDIA* covers storage in chapter 3 and durability's limits in chapter 7.
- Abilities 5 to 8 rest on vendor documentation, which shows practitioners being asked
  to make these choices directly:
  - PostgreSQL: WAL reliability, asynchronous commit, WAL configuration and page layout.
  - MySQL 8.4: clustered indexes, row formats, `innodb_flush_log_at_trx_commit`, the
    doublewrite buffer, binlog two-phase commit and purge.
  - SQLite: file format, WAL and `PRAGMA synchronous`.
  - SQL Server: pages and extents, the transaction log guide, delayed durability and ADR.
- Two failure studies show that the hardware stack belongs inside the subject: the
  PostgreSQL wiki's "Fsync Errors" (fsyncgate, which made PostgreSQL PANIC on fsync
  failure, with similar changes in InnoDB) and Pillai et al., OSDI 2014.

## 2. Coverage map

A1 = *How a database stores rows*. A2 = *How a commit survives a crash*. A3 = *Choosing
how durable a commit is*. Word counts are rough.

| # | Part | Home | Needs | ~Words |
|---|---|---|---|---|
| 1 | Files and pages: the page as the unit of I/O and caching; page sizes per engine | A1 §1 | mechanism; slotted-page figure | 450 |
| 2 | Row format: header, null bitmap, slot pointer; per-engine overhead; how to measure real size | A1 §2 | short mechanism; overhead table | 300 |
| 3 | Estimating a table's size before it exists | A1 §2 | one worked example, PostgreSQL vs InnoDB | 350 |
| 4 | Heap vs clustered tables; row identifiers (TID, primary key, RID, rowid) | A1 §3 | mechanism; two-lookup figure | 600 |
| 5 | Consequences of clustering: short, increasing keys; wide keys copied into every secondary index; range scans by key; random keys (UUIDv4) vs time-ordered (UUIDv7) | A1 §3 | worked examples; page-split mechanism linked to *Indexes* | 450 |
| 6 | Cost of updating an indexed column under each organisation (the Uber case; HOT named, detail in the PostgreSQL series) | A1 §3 | worked example | 250 |
| 7 | SQL Server's choice of heap or clustered (forwarded records); SQLite rowid vs WITHOUT ROWID | A1 §3 | paragraph | 150 |
| 8 | Large values: TOAST, InnoDB off-page storage, SQL Server row-overflow and LOB storage, SQLite overflow pages; row-size errors; cost of `SELECT *` and of rewriting big values | A1 §4 | short mechanism; per-engine table | 500 |
| 9 | Where old row versions live: PostgreSQL heap; InnoDB undo; SQL Server tempdb or PVS (plus the 14-byte versioning tag); SQLite WAL frames | A1 §5 | mechanism; "one update, two engines" figure | 500 |
| 10 | Cleanup (vacuum, purge, version cleaner) and the long transaction that blocks it | A1 §5 | paragraph; symptom examples | 300 |
| 11 | Free space reused but rarely returned to the OS; rewriting to reclaim it; fill factor | A1 §5 | worked examples | 300 |
| 12 | Buffer pool and cache: working set, dirty pages; PostgreSQL also relies on the OS cache, while InnoDB uses O_DIRECT | A1 §6 | paragraph; bridges to A2 | 350 |
| 13 | Where the subject ends: column stores, LSM engines (MyRocks), compression | A1 §7 | sentences and links | 100 |
| 14 | Why pages are not written at commit: random I/O, many pages, no atomicity | A2 §1 | short argument | 300 |
| 15 | The write-ahead log: log before data; commit is a flushed commit record; lazy page writes | A2 §2 | mechanism; interactive "choose the crash point" model | 900 |
| 16 | Crash recovery: redo from the checkpoint; undo (InnoDB, SQL Server) vs no undo (PostgreSQL MVCC, SQL Server ADR); SQLite journal vs WAL | A2 §3 | mechanism; log-timeline figure | 500 |
| 17 | Long transactions: slow rollback and slow recovery where undo exists | A2 §3 | worked example | 150 |
| 18 | Checkpoints: they bound recovery time and log size, cause I/O bursts, and multiply full-page images | A2 §4 | mechanism; figure shared with 16 | 400 |
| 19 | Torn pages: full-page images, doublewrite, SQLite journal copies; SQL Server only detects them | A2 §5 | mechanism; torn-page figure | 400 |
| 20 | Trusting the stack: caches between COMMIT and the media, power-loss protection, SQLite on network filesystems, fsync failure becomes a crash, checksums (default in PostgreSQL 18), ECC, `pg_test_fsync` | A2 §6 | layered figure; paragraphs | 600 |
| 21 | The log as a resource: what holds its tail per engine; disk-full outcomes; log volume drives replication and backup cost | A2 §7 | figure; symptom examples | 650 |
| 22 | Where durability ends: machine loss, operator error, managed storage (Aurora's 4-of-6 write quorum) | A2 §8 | paragraph; links | 300 |
| 23 | Commit cost: one flush; latency by storage class; group commit; batching | A3 §1 | worked examples; small chart | 650 |
| 24 | Relaxed settings per engine: what each loses, loss vs corruption, scope (per transaction in PostgreSQL and SQL Server, global in InnoDB, per connection in SQLite), pairing with `sync_binlog` | A3 §2 | comparison table | 600 |
| 25 | Visible before durable: an email sent for a commit that a crash then erased | A3 §3 | corner-case example | 200 |
| 26 | Worked cases: telemetry, a restartable bulk load, a SQLite desktop app, a MySQL replica, payments (keep full durability) | A3 §4 | five short worked examples | 550 |

Totals: A1 ≈ 4,500, A2 ≈ 4,200, A3 ≈ 2,000 (including a 200-word reminder of the
mechanism).

## 3. Articles

| Article | Role | Words | Reading time |
|---|---|---|---|
| **How a database stores rows** | Deep dive: pages, rows, table organisation, large values, where updates and deletes leave space, the buffer pool | ~4,500 | ~22 min (18 min of text, plus 3 figures and a worked size estimate) |
| **How a commit survives a crash** | Deep dive: write-ahead logging, recovery, checkpoints, torn pages, trusting the stack, the log as a resource, durability's reach | ~4,200 | ~22 min (17 min of text, plus 4 figures and one interactive model) |
| **Choosing how durable a commit is** | Companion to the second: what a commit costs and when to relax it, by engine, through worked cases | ~2,000 | ~10 min (8 min of text, plus a table and worked examples) |

Reading order is A1, A2, A3. A2 opens with one paragraph on pages and dirty buffers, so
a reader who arrives with a durability question can start there.

**Why two deep dives rather than one.** Storage layout and durability answer different
questions. One is "why is my table this big, and what key should I use?". The other is
"what does COMMIT promise, and can I turn this setting off?". Readers arrive with each
question separately, and together they would make a 9,000-word page in which each
argument buries the other. The buffer pool is the only shared mechanism, and a paragraph
carries it across.

**Why a companion for durability settings.** Choosing a setting is a practice, and worked
cases teach it fastest. Those cases would double the length of the mechanism article's
final section. Many readers also search for these settings by name.

## 4. Boundaries

- **Indexes**: B-tree structure, page splits, covering and index-only scans. A1 owns
  table organisation and links there for how splits work.
- **Isolation and snapshots**: what a snapshot sees. A1 owns where old versions are
  stored and what cleaning them up costs, and each article gives the other a sentence.
- **Transactions and concurrency**: atomicity as the application sees it. A2 owns how
  the log implements it.
- **PostgreSQL series**:
  - *Row versions, transactions, and vacuum*: HOT, vacuum tuning, freezing and
    wraparound, the free space map and visibility map.
  - *WAL, checkpoints, and recovery*: WAL segments, `wal_level`, archiving, tuning
    full-page writes.
  - *Inside PostgreSQL*: the files on disk, `shared_buffers` and processes.
  - *Types and extensions in PostgreSQL*: alignment padding and column order.
- **Replication and failover**: synchronous replication as durability across machines,
  and data loss on failover. A2 §8 frames the gap.
- **Backups and recovery**: point-in-time recovery, log archives, log backups and the
  backup role of SQL Server's recovery models. A2 §7 covers only the log-retention
  effect.
- **Understanding database performance**: cache-hit and I/O diagnosis. A1 §6 gives only
  the mechanism.
- **Changing a schema while the application runs**: which `ALTER` statements rewrite
  storage.
- **Partitioning and sharding**: dropping a partition to delete rows cheaply.
  **Retention and deletion**: what to delete and when.
- **Tables and JSON**: what large documents cost. It links to A1 §4 for the mechanism.
- **Choosing a relational database**: uses the engine differences in A1 and A2 and does
  not repeat them.
- **Column stores essay**: column-oriented storage. **Operating systems and hardware**:
  filesystem and SSD internals, linked out.

## 5. Left out

- **ARIES in full** (compensation log records, LSN bookkeeping on pages, fuzzy-checkpoint
  protocol) and the steal/no-force taxonomy beyond one sentence. A practitioner needs
  "redo, and sometimes undo, from a checkpoint", not the proof.
- **Buffer replacement algorithms** (clock sweep, LRU variants). They change no
  practitioner decision, and tuning belongs to performance.
- **Allocation structures** (free space maps, GAM, SGAM, PFS and IAM pages, extents,
  tablespace internals) and page-header field layouts. These are engine internals with
  no decision attached.
- **Log record formats** and physical vs logical logging.
- **Compression features** (InnoDB compressed tables, SQL Server row and page
  compression, TOAST compression methods) beyond a sentence, and **encryption at rest**.
  Both are options rather than mechanisms the reader must reason through.
- **In-memory engines** (SQL Server In-Memory OLTP, MySQL MEMORY), RAID levels, raw
  devices, and PostgreSQL 18's asynchronous I/O. These are rare in the reader's work, or
  specific to one engine.

## 6. Uncertainty

- **Where old row versions are taught.** I placed their storage and cleanup in A1. If
  *Isolation and snapshots* already teaches the version store per engine, part 9 shrinks
  to a reminder and a link, and A1 loses about 400 words. Its outline would settle this.
- **Whether the companion should be a section instead.** If few readers look for
  durability settings by name, folding A3 into A2 saves a page change and about 200
  words. Search and Q&A volume for `synchronous_commit`, `innodb_flush_log_at_trx_commit`
  and SQLite `synchronous` would settle it.
- **How much SQL Server detail earns its place.** I kept the cases that change a decision:
  the full recovery model filling the log, slow rollback without ADR, detection-only
  torn-page protection and the 8,060-byte row limit. Data on how readers split across
  engines would settle it.
- **Calibration numbers for commit latency.** I lack measured fsync latency on common
  cloud volumes and local NVMe with power-loss protection. Running `pg_test_fsync` on two
  or three representative instances would fix the figures A3 relies on.
- **Whether the size estimate belongs in the article.** Practitioners often measure size
  instead of estimating it. I kept one worked estimate because capacity planning happens
  before the data exists, but measuring alone may be enough.
- **The interactive crash-point model.** I judged it cheaper for the reader than a
  sequence of static timelines. A static figure may teach the log-before-data rule
  equally well.

**Sources that shaped these judgements:**
- PostgreSQL documentation: WAL reliability, asynchronous commit, WAL configuration,
  page layout.
- MySQL 8.4 Reference Manual: InnoDB clustered and secondary indexes, row formats,
  startup options, redo log, purge, binary log.
- SQLite: database file format, WAL, `PRAGMA synchronous`.
- Microsoft Learn: page and extent architecture guide, transaction log architecture and
  management guide, controlling transaction durability, Accelerated Database Recovery.
- PostgreSQL wiki, "Fsync Errors".
- Pillai et al., "All File Systems Are Not Created Equal", OSDI 2014.
- Mohan et al., ARIES, 1992.
- Uber Engineering, "Why Uber Engineering Switched from Postgres to MySQL" (2016), with
  responses from LWN, EnterpriseDB and Markus Winand.
- Verbitski et al., "Amazon Aurora", SIGMOD 2017.
- CMU 15-445 (Fall 2024) schedule; Petrov, *Database Internals*; Hellerstein,
  Stonebraker and Hamilton, *Architecture of a Database System*; Kleppmann, *Designing
  Data-Intensive Applications*.
