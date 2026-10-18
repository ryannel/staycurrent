# Storage and durability in relational databases: derived plan (planner A)

Derived on 17 October 2026 from `kit.md` and external evidence only. No other file in the
repository was opened.

**Result:** four articles, two deep dives and two companions, about 11,850 words and
63 minutes of reading in all.

| # | Article | Role | Words | Reading time |
|---|---|---|---|---|
| 1 | How a relational database stores your data | Deep dive | 3,950 | ~21 min |
| 2 | Updates, deletes and where the space goes | Companion to 1 | 2,050 | ~11 min |
| 3 | How a commit survives a crash | Deep dive | 3,650 | ~19 min |
| 4 | Checkpoints, torn pages and crash recovery | Companion to 3 | 2,200 | ~12 min |

## 1. The expert's abilities

The expert here is a practitioner who designs tables, sets up and runs databases, and
diagnoses problems. They are not someone who implements a storage engine. Such an expert can:

1. **Say what a crash can take.** They follow a committed change from memory to the log to
   the data file, and for each failure (process crash, OS crash, power loss, lost device)
   say what survives. The engines' own documentation frames durability in these terms.
2. **Choose how durable each commit is.** They know which settings risk losing the most
   recent commits, which risk corrupting the database, and when the first is acceptable.
   Every engine draws this line: PostgreSQL's asynchronous commit against `fsync = off`,
   InnoDB's `innodb_flush_log_at_trx_commit`, SQLite's `synchronous=NORMAL` in WAL mode
   ("always consistent" but not durable) and SQL Server's delayed durability.
3. **Check that storage honours a flush.** Durability rests on the drive, controller,
   file system and OS reporting each flush honestly. PostgreSQL and SQLite both warn of
   hardware that reports flushes it has not done; the 2018 fsync problem showed a failed
   fsync followed by a false success; Pillai et al. (OSDI 2014) found file systems differ
   in the guarantees crash-safe software relies on.
4. **Estimate how much space a table takes.** They know row and page overhead
   (PostgreSQL's 23-byte tuple header, 4-byte line pointer and alignment; InnoDB's
   13 bytes of transaction fields per row; SQL Server's 8,060-byte row limit) and when
   values move out of line.
5. **Choose a primary key knowing how the table is organised.** They know whether the
   engine stores the table as a heap or as a clustered index on the primary key. They can
   predict what that means for secondary index size, range reads and insert cost. The
   MySQL manual advises short primary keys because every secondary index carries a copy.
   Percona measured random UUID inserts turning I/O-bound once a table outgrew the buffer
   pool. EDB measured about 2 GB of WAL with a bigserial key against more than 40 GB with
   a UUID key over an hour of inserts.
6. **Predict what updates and deletes cost and why tables grow.** They know where old
   row versions live in each engine, what cleans them up, and that a long-running
   transaction holds back cleanup in every MVCC engine (PostgreSQL vacuum, InnoDB purge,
   SQL Server's version store). Uber's 2016 move from PostgreSQL to MySQL turned on this
   difference.
7. **Reason about memory.** They know what the buffer pool and OS cache hold, and why
   performance falls sharply once the working set no longer fits. PostgreSQL suggests 25%
   of RAM for `shared_buffers` because it also relies on the OS cache; InnoDB commonly
   takes up to 80%.
8. **Predict restart time and background write load.** They know what checkpoints trade
   and how engines differ in recovering from a long transaction. SQL Server warns that
   "long-running, uncommitted transactions increase recovery time".
9. **Know where one server's protection ends.** Replication, backups and managed storage
   each add something. Aurora, for example, sends log records to six copies across three
   availability zones and waits for four.

CMU 15-445 (Fall 2025) gives six of 25 lectures to storage, memory, logging and recovery.
It is written for implementers, so it marks the ceiling; the plan teaches those ideas only
as far as abilities 1 to 9 depend on them.

## 2. Coverage map

"Mechanism" means explanation, a figure and the consequences. Word counts are rough.

### Article 1: How a relational database stores your data

| Part | Needs | Words |
|---|---|---|
| Pages as the unit of storage, I/O and caching; page sizes (PostgreSQL 8 KB, InnoDB 16 KB, SQL Server 8 KB, SQLite 4 KB by default) | Mechanism, figure | 400 |
| Inside a page and the cost of a row: slotted page, per-row overhead in each engine, NULLs | Mechanism, figure, worked example (estimate a 10-million-row table, then measure it) | 650 |
| Large values out of line: TOAST (2 KB threshold, compression, 1 GB limit), InnoDB off-page columns, SQL Server row-overflow and LOB pages, SQLite overflow pages; effects on `SELECT *`, wide JSON and updates that leave the large value alone | Mechanism at paragraph scale, small engine table | 450 |
| Table organisation: heap or clustered on the primary key (PostgreSQL heap; InnoDB always clustered; SQL Server either; SQLite rowid or WITHOUT ROWID); how secondary indexes reach a row, by physical address or by primary key; effects on key width, range reads and secondary lookups | Mechanism, figure, engine table | 850 |
| Key order and where inserts land: sequential and random keys, page splits, half-full pages, cache misses, extra log volume; UUIDv7 | Worked example with measurements (bigint, UUIDv4 and UUIDv7: pages, fill and WAL) | 600 |
| Memory: buffer pool and OS cache, hits and misses, dirty pages written later, working set and the cliff, scans pushing hot pages out; sizing figures as calibration | Mechanism, figure | 600 |
| Updates in brief: new version or in place with undo; link to article 2 | Paragraph | 150 |
| Compression in a paragraph; column storage as a link | Paragraph, link | 150 |
| Opening, closing, neighbour links, including one sentence on why some schema changes rewrite every row | Sentences | 100 |

### Article 2: Updates, deletes and where the space goes

| Part | Needs | Words |
|---|---|---|
| Reminder of article 1's model; why tables grow and rarely shrink | Paragraph | 150 |
| Where old versions live: in the table (PostgreSQL); in place with undo (InnoDB); in place, with versions in tempdb or the persistent version store when row versioning or ADR is on (SQL Server); previous pages in the journal or WAL (SQLite) | Mechanism, figure, engine table | 600 |
| What an update writes to indexes: PostgreSQL adds an entry in every index unless the update is HOT; fillfactor; InnoDB changes only indexes on changed columns and delete-marks the old entries; the Uber case and its limits | Mechanism, example | 450 |
| Cleanup and what holds it back: vacuum, purge, version cleanup; long-running and idle transactions block cleanup in every engine; symptoms such as the history list length and dead rows that cannot be removed | Mechanism, examples | 400 |
| Reusing space versus returning it: freed space is reused, files rarely shrink; rewrite tools in each engine and their lock and space costs | Worked experiment (update every row, delete half, vacuum, rewrite, then repeat with a transaction left open) | 400 |
| Pointers to mass deletion, partition drops and PostgreSQL freezing | Sentences, links | 50 |

### Article 3: How a commit survives a crash

| Part | Needs | Words |
|---|---|---|
| What a commit promises: table of failures and what covers each | Table, paragraph | 350 |
| The log and the write-ahead rule: why pages aren't written at commit; the commit record; each engine's log (WAL; InnoDB redo log and binlog; SQL Server transaction log; SQLite rollback journal or WAL); pages written later from the buffer pool | Mechanism, figure (one commit's path) | 700 |
| The flush and its price: fsync and its variants; flush latency as the floor on one connection's commit rate; group commit; batching rows into one transaction | Worked example with measurements (`pg_test_fsync` on two kinds of storage; one client against many; batched inserts) | 600 |
| When storage breaks the promise: volatile caches, power-loss protection, fsync error reporting since 2018, file system differences, network file systems and SQLite, cloud volumes, how to check | Mechanism, figure (layers of the storage stack) | 550 |
| Choosing how durable a commit is: settings table across engines; bounded loss against corruption; per-transaction use; good and bad cases (external side effects after commit); MySQL's two logs and `sync_binlog`; unlogged and temporary tables; bulk loads | Decision table, worked examples, experiment (asynchronous commit plus an immediate shutdown loses the last commits and nothing else) | 900 |
| Where one server's durability ends: replication, backups and point-in-time recovery from the archived log, managed and disaggregated storage, commits whose outcome is unknown | Paragraph, links | 350 |
| Opening and closing | Sentences | 200 |

### Article 4: Checkpoints, torn pages and crash recovery

| Part | Needs | Words |
|---|---|---|
| Reminder: pages are written later, which leaves three problems (log growth, restart time, half-written pages) | Paragraph | 150 |
| Checkpoints: what they guarantee and what triggers them. Calibration: PostgreSQL 5 min or 1 GB, spread over 90% of the interval; InnoDB continuous flushing bounded by redo capacity; SQL Server indirect checkpoints with a 1-minute target since 2016; SQLite at 1,000 WAL pages, and starved by constant readers. Restart time against write load; I/O bursts | Mechanism, figure | 550 |
| Torn pages: page writes against sector writes; PostgreSQL full-page images; InnoDB doublewrite; SQL Server detects them with checksums and repairs from a backup or replica; SQLite's journal; why turning protection off is rarely safe | Mechanism | 400 |
| What one write costs, tallied: WAL for the same update just after a checkpoint and later; random keys multiply full-page images | Worked example with measurements | 350 |
| Crash recovery: redo from the checkpoint; unfinished transactions in each engine (PostgreSQL has nothing to undo; InnoDB rolls back from undo in the background; SQL Server's undo phase grows with the longest transaction unless ADR is on; SQLite's hot journal or ignored WAL frames); predicting restart time | Mechanism, figure, experiment (kill the server during a load and read the recovery log) | 550 |
| Detecting damage: page checksums (on by default from PostgreSQL 18; InnoDB; SQL Server `PAGE_VERIFY CHECKSUM`), log record CRCs; they detect damage but do not repair it | Paragraph | 200 |

### Parts given another home

| Part | Home |
|---|---|
| Snapshot visibility rules, and why versions exist | Isolation and snapshots (article 2 gives a reminder sentence) |
| B-tree structure, index lookups, covering and index-only scans | Indexes (article 1 owns how the table is organised and how an index reaches a row) |
| Measuring cache hit rates, I/O waits and slow queries | Understanding database performance |
| Synchronous replicas, failover data loss | Replication and failover |
| Base backups, WAL archiving, point-in-time recovery | Backups and recovery |
| A commit whose acknowledgement was lost | Handling conflicts and uncertain outcomes |
| Commit and rollback from the application's side | Transactions and concurrency |
| Batch deletes, partition drops as retention | Retention and deletion; Partitioning and sharding |
| Schema changes that rewrite tables | Changing a schema while the application runs |
| Type choice and sizes | Designing your data |
| JSON storage choices | Tables and JSON |
| Files, processes, forks, 1 GB segments, column alignment padding | Inside PostgreSQL |
| HOT monitoring, autovacuum tuning, freezing and wraparound | Row versions, transactions, and vacuum |
| `wal_level`, `wal_sync_method`, checkpoint tuning, `wal_compression`, `pg_waldump` | WAL, checkpoints, and recovery |
| Column storage | The column-stores essay in the databases field |
| Encryption at rest | Controlling access |

## 3. Articles

Reading times are words at 250 a minute plus about 45 seconds a figure and a minute or
two for each worked example.

1. **How a relational database stores your data** (deep dive, ~21 min). How rows sit on
   disk and in memory, and what that does to space, key choice and memory needs. Four
   figures, two measured worked examples.
2. **Updates, deletes and where the space goes** (companion to 1, ~11 min). What changing
   a row leaves behind in each engine, what blocks cleanup and how to get space back.
   Readers often arrive with this question alone ("why didn't my table shrink?"), and as
   the end of article 1 it would push that article towards half an hour.
3. **How a commit survives a crash** (deep dive, ~19 min). The log, the flush, the storage
   stack's part, and how durable each commit should be. The argument builds to the
   settings choice, the question many readers arrive with. Two figures, a cross-engine
   settings table, two experiments.
4. **Checkpoints, torn pages and crash recovery** (companion to 3, ~12 min). The
   background half: how pages written later are kept safe, what that costs in write
   volume, and how long a restart takes. These are operations and performance tasks, not
   part of the durability decision. Two figures, two measured examples.

Reading order: 1, then 3; take the companions when the matching problem comes up. Within
the collection, article 1 fits before Indexes and article 3 after Transactions and
concurrency.

## 4. Boundaries

The table at the end of section 2 lists every part sent elsewhere. The reasons:

- **Engine-specific depth goes to the PostgreSQL series.** The general articles use
  PostgreSQL to show each mechanism; its tuning parameters, monitoring views and file
  layout go to the series. Other engines appear only where they change a prediction or a
  decision: clustered tables, undo-based versions, undo during recovery, torn-page
  handling and durability settings.
- **Indexes:** article 1 owns table organisation and insert locality, because in a
  clustered engine the table is the index. Indexes owns the B-tree and links back.
- **Isolation and snapshots** owns why versions exist and who sees them; article 2 owns
  what they cost in storage.
- **Replication, backups and uncertain outcomes** own everything beyond one server.
  Article 3 says where its promise stops. Managed and disaggregated storage gets a
  paragraph there, because it changes where the flush happens.

## 5. Left out

- **ARIES internals** (compensation records, the dirty-page table, per-page LSNs). The
  expert needs redo, undo and checkpoints, not the proof that they work.
- **Buffer replacement algorithms.** Their one practical consequence, that large scans
  push hot pages out, takes a sentence.
- **Byte-level formats** beyond overhead totals, and allocation maps (GAM, PFS, free
  space map).
- **LSM-tree engines.** None of the four main engines uses one by default; Choosing a
  relational database can name them.
- **Kernel and file system internals, RAID, tablespace placement.** They don't change the
  durability or design decisions, and most readers run on managed storage.
- **InnoDB change buffer and adaptive hash index, SQL Server In-Memory OLTP.** No reader
  decision here depends on them.

## 6. Uncertainty

- **Four articles or three.** I was least sure whether article 4 should be the second half
  of article 3 (about 25 minutes combined). The split assumes readers arrive with
  checkpoint and restart questions separately from the durability-setting question.
  Search or site analytics on those queries would settle it.
- **How many readers run their own storage.** Article 3's storage-stack section and
  article 4's tuning calibration matter less on managed services. A survey of reader
  deployments (self-hosted, RDS or Cloud SQL, Aurora or Neon) would set their depth.
- **Overlap with the PostgreSQL series.** If Row versions, transactions, and vacuum ends
  up teaching the cross-engine model, article 2 could shrink to a section of article 1.
- **The home of the random-key lesson.** It sits in article 1 because of clustered
  tables, but Indexes might claim it. Seeing that article's scope would decide it.
- **Facts to verify before writing:** SQL Server's reliance on storage to prevent torn
  writes (check its I/O reliability requirements); exact row overheads for InnoDB and
  SQL Server (measure them rather than add up documented fields); whether PostgreSQL 19
  has shipped by publication and changed any default cited here.

## Sources that shaped the judgement

- PostgreSQL 18 documentation: Reliability (28.1), Asynchronous Commit, WAL Configuration,
  Database Page Layout, TOAST, Heap-Only Tuples, Routine Vacuuming, Resource Consumption
  (`shared_buffers`); PostgreSQL 18 release announcement (`uuidv7()`, checksums by
  default, asynchronous I/O).
- PostgreSQL wiki, "Fsync Errors" (the 2018 fsync problem and the PANIC change).
- MySQL 8.4 Reference Manual: Clustered and Secondary Indexes, InnoDB Multi-Versioning,
  Buffer Pool, Doublewrite Buffer, `innodb_flush_log_at_trx_commit`.
- SQLite: Atomic Commit in SQLite, Write-Ahead Logging, Database File Format, PRAGMA
  `synchronous` and `page_size`.
- Microsoft Learn (SQL Server): Page and Extent Architecture Guide, Control Transaction
  Durability, Accelerated Database Recovery, Database Checkpoints.
- Verbitski et al., "Amazon Aurora: Design Considerations for High Throughput
  Cloud-Native Relational Databases", SIGMOD 2017.
- Pillai et al., "All File Systems Are Not Created Equal", OSDI 2014.
- Percona, "UUIDs are Popular, but Bad for Performance" (2019) and the 2015 InnoDB
  primary-key fragmentation study; EDB, "On the impact of full-page writes".
- Uber Engineering, "Why Uber Engineering Switched from Postgres to MySQL" (2016).
- CMU 15-445/645 Fall 2025 schedule, as the implementer-level ceiling.
