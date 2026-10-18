# Historical relational article allocation, before the independent replan

Snapshot of the reviewed Indexes and Storage article allocation as at the start
of this commission. This preserves article-work provenance; it is not the new
collection outline or a constraint on its depth. Current articles and routes
remain intact. The independent practitioners did not consult this snapshot.

# Relational databases: coverage map

One map for the relational collection (`src/lib/relational-collection.ts`). Each part has
one home: an article and section, or an explicit status (a sentence where used, a link to
another field or series, parked, or left out for a stated reason). Layers follow
`docs/article-work/depth-derivation-2026-10-17/consolidate.md`: 1 model, 2 working
mechanism, 3 expert cases, 4 product specifics; lookup material is marked reference.

Running example: the repair shop's orders table (`orders`, customer 42, P7 at page 12),
as used across Indexes and Storage and durability.

This snapshot stops before the former whole-collection proposal. That proposal
is preserved at Git revision `1eac226`; the independently derived replacement is
[the revised relational map](../../coverage/relational.md). The detailed allocations
below record the earlier article work and need assessment against new briefs.

## Indexes

Written 18 October 2026 from `derived/indexes-consolidated.md`, corrected by
`derived/indexes-comparison.md` and the pages as they stood after the style pass. Work
note: `docs/article-work/indexes/restructure-2026-10-18.md`.

Running example: the 60,000-order table (`index_orders`, one order a minute from
1 January 2026, 1,000 customers in turn) and the history query, customer 42's ten newest
orders since 1 February. PostgreSQL 18 is the worked engine, measured in PGlite;
InnoDB (MySQL 8.4), SQL Server and SQLite are named where they change a prediction or
decision. Every measured number goes through `docs/article-work/indexes/verify.mjs`.

Articles (slug, type):

- **D** `indexes`, Indexes, deep dive. Structure, what an index serves, the three fates
  of a condition, where rows live, when a scan wins, covering, variants, write cost and
  key choice, reading a plan and the one-query design recipe. A reader who stops here
  can predict index use and make the everyday call.
- **Q** `indexing-queries`, Indexing queries: diagnosis and patterns, companion to D.
  Plan vocabulary across engines, "why isn't my index used?", and worked query shapes.
  Readers arrive with a slow query.
- **M** `maintaining-indexes`, Maintaining indexes, companion to D, short. The index
  set over time: measuring, rebuilding, building safely, dropping and rolling out.
  Readers arrive asking "can I drop this?" or "why is this index so big?".

The plan's single companion is kept as two: the diagnosis and the operations questions
come from different readers at different moments, and a merged page would bury the
diagnosis under operations (work note, Decisions).

| Part | Layer | Home | Needs |
|---|---|---|---|
| The model: a sorted copy with a way back to each row; it helps only when the conditions and order line up from its first column and few enough rows match; the planner decides from estimates; every index costs writes | 1 | D opening | Paragraphs |
| The full scan an index replaces; pages as the unit of work (reminder, Storage owns pages) | 1–2 | D `#scan` | Figure 1 |
| Index entries and row locations; heap and TID | 2 | D `#entries`, `#heap` | Figure 2 |
| Clustered tables in outline; SQL Server clusters by default | 2 | D `#key-order` | Paragraphs |
| B-tree pages, fanout and depth by table size | 2 | D `#btree` | Figure 3, measured depth table |
| Range scans, linked leaves, `IN`, order for free | 2 | D `#range` | Figure 4 |
| Second descent through a clustered table; key in every secondary entry; engine differences | 2 | D `#clustered` | Figure 5, engine table |
| Selectivity, the three routes, correlation, no fixed percentage, value not column | 2 | D `#selectivity` | Figure 6, measured results |
| Composite indexes, leftmost prefix, equality before range, skip scan | 2 | D `#composite` | Figure 7, history table |
| What a condition can do: narrow the scan, be checked in the index, be checked at the row; the bare-column rule in brief | 2 | D `#fates` | Paid-only query and its Filter line; link to Q's catalogue |
| Indexes and `ORDER BY`: direction, NULLs, collation, `LIMIT` | 2 | D `#order` | Bulleted rules |
| Combining indexes: bitmap AND/OR, MySQL index merge, SQLite | 2 | D `#combining` | Measured examples |
| Covering, `INCLUDE`, visibility map; InnoDB, SQLite and SQL Server differences; status as a trailing key column | 2 | D `#covering`, `#status-last` | Figure 8, engine table, measured pair (15 against 5 pages) |
| Partial, expression and unique indexes; SQL Server's one NULL; foreign key index (short); join use | 2 | D `#kinds` | Examples, engine table |
| Write cost, write-ahead log volume, HOT, InnoDB secondary updates | 2 | D `#writes` | Figure 9 |
| Page splits; index fill factor (Indexes owns it; table fill factor is Storage's) | 2 | D `#splits` | Figure 10 |
| Primary key choice for a clustered table; UUIDv7 | 2 | D `#key-choice` | List |
| Deleted rows and bloat, InnoDB merge threshold | 2 | D `#deleted-rows` | Figure 11 |
| Building after a bulk load; building without blocking writes; pruning, in brief | 2–3 | D `#upkeep` | Paragraph and links to M |
| Reading a plan for index use (PostgreSQL) | 2 | D `#check` | Plan excerpt; link to Q `#plans` |
| Designing an index for one query; extend before adding | 2 | D `#design` | Steps and table |
| Designing an index set for a workload: one composite serving several queries, a partial index for the odd one | 2 | D `#workload` | Four-query worked example |
| Where a B-tree stops; other index types | 2 | D `#types` | Short problem-first list linking each type's home; the PostgreSQL comparison table moved out |
| Plan vocabulary across PostgreSQL, MySQL, SQLite and SQL Server | Ref | Q `#plans` | Table |
| Why isn't my index used: symptom table | 3 | Q `#diagnosis` | Table |
| The column has to stand alone: functions, arithmetic, casts, negation, date truncation | 3 | Q `#bare-column` | Measured table |
| Types and collations: PostgreSQL numeric casts, MySQL string-number comparison, SQLite affinity, SQL Server `nvarchar` parameters, `LIKE` prefixes | 3 | Q `#types`, `#like` | Engine notes |
| The leading column has no condition | 3 | Q `#leading` | Figure (LeadingFigure), measured |
| An `OR` with an unindexed branch; `UNION` rewrite | 3 | Q `#or` | Paragraph |
| The condition matches too much; forcing a plan in each engine | 3 | Q `#too-much` | Measured, hints per engine |
| Statistics that no longer match the data | 3 | Q `#stale` | Measured pair of tables; schedules link to query-execution |
| Parameters: generic plans, partial and filtered indexes under parameters, the catch-all predicate | 3 | Q `#parameters` | Measured catch-all; SQL Server notes |
| Proving the index can be used | 3 | Q `#prove` | Ordered checklist |
| `ORDER BY` with `LIMIT`: the rule, what breaks it, the walk-the-wrong-index trap, latest row per group | 3 | Q `#order-limit` | Measured (33 against 1,892 pages, then 4) |
| Joins and foreign keys; InnoDB locks every scanned row without a fitting index | 3 | Q `#joins`, `#innodb-locks` | Measured delete; MySQL locking quote |
| Paging through an ordered list (pointer) | 3 | Q `#paging`, two paragraphs | Link; mechanics in Pagination |
| Work queues, soft delete, tenants, case-insensitive lookup, optional filters (MySQL prefix indexes cut) | 3 | Q `#shapes` | Worked examples with engine notes |
| Why indexes grow and stay grown; InnoDB and SQLite | 3 | M `#why` | Measured 1M-row table |
| Measuring size and density per engine | 3 | M `#measure` | Queries |
| When to rebuild: measure, don't schedule; rebuild gains often from statistics; options per engine | 3 | M `#rebuild` | Paragraphs, engine table |
| Building on a live table; replicas | 3 | M `#build` | Engine notes, SQL Server editions |
| Unused, duplicate and invalid indexes; usage-counter caveats; missing-index suggestions; trial drops (MySQL invisible, SQL Server disable) | 3 | M `#drop` | Queries, caveats |
| Rolling out an index change | 3 | M `#rollout` | Steps |
| Corrupt indexes and integrity checks | 3 | M `#integrity` | Short |
| Statistics refresh schedules per engine, `ANALYZE` after bulk loads | — | **How a query runs** `#refresh` | Received from M; Q `#stale` and M `#when-rebuild` link it |
| Paging mechanics: offset cost, keyset reaching the index, mixed directions, NULL sort keys | — | **Large results** `#page-cost` | Received from Q |
| `REINDEX CONCURRENTLY` locks and leftovers, bloat measurement with `pgstattuple`, free-space reuse timing, deduplication and bottom-up deletion, `text_pattern_ops`, `COLLATE "C"`, `pg_trgm` | 4 | **Indexes in PostgreSQL** | Received from M and Q |
| Page and row layout, row cost, large values, table fill factor and HOT free space | — | **Storage and durability** | Storage owns; D links `storage/#fill-factor` and `#pages` |
| Join algorithms, cost estimation, plan reading in general | — | **How a query runs** | Links |
| Online schema change procedure | — | **Changing a schema** | Link from M |
| GIN, GiST, BRIN, vector, full text | 4 | PostgreSQL series and their articles | Links from D `#types` |
| Shared distributed-systems idea | — | Parked | — |

## Storage and durability

Written 18 October 2026 from `derived/storage-consolidated.md`, corrected by
`derived/storage-comparison.md` and the pages as they stood after the style pass. Work
note: `docs/article-work/storage/restructure-2026-10-18.md`.

Running example: the shop's `products` table, P7 (a blue mug) on page 12 at `ctid`
(12,3), priced 20.00 and raised to 22.00 by one `UPDATE`. PostgreSQL 18 is the worked
engine; InnoDB (MySQL 8.4), SQL Server and SQLite are named where they change a
prediction or decision.

Articles (slug, type):

- **S** `storage`, Storage and durability, deep dive. Rows, pages, memory, versions,
  the log, the commit, recovery and the durability choice: the consolidated plan's
  articles 1 and 2 in one page, because *Indexes* holds table organisation and key
  choice, which was most of article 1's extra length.
- **C** `checkpoints-and-the-log`, Checkpoints, torn pages and the log, companion to S
  (was `watching-storage`). The operator's cases: checkpoint costs, torn pages, trusting
  the flush, the log as a resource, recovery time, incidents and a signals reference.
- **B** `buffer-pool`, The buffer pool, companion to S, slimmed. Working set, the two
  caches, sizing, warm-up after a restart or failover.

Layer: 1 model, 2 working mechanism, 3 expert cases, 4 product specifics, R reference.

### Storage and durability (S)

| Part | Layer | Home | Needs |
|---|---|---|---|
| The model: pages, memory, heap or clustered, versions kept, log first, flush per commit, replay from a checkpoint, written twice, storage must honour the flush, one machine only, loss against corruption | 1 | S opening | Paragraphs |
| Pages as the unit of storage and I/O; page sizes by engine; line pointers and row address | 2 | S `#pages` | Mechanism, Figure 1 (page fill) |
| Row cost across engines (PostgreSQL 24 + 4 bytes, InnoDB 5-byte header + 13 bytes of transaction fields, SQL Server 4-byte header + null bitmap + 2-byte slot, SQLite varint header + 2-byte cell pointer); estimating rows per page; measuring real size | 2 | S `#row-size` | Short mechanism, overhead table |
| Large values out of line (TOAST at about 2 kB; InnoDB DYNAMIC 20-byte pointer and the half-page row limit; SQL Server 8,060-byte row, row-overflow and LOB pages; SQLite overflow chains); cost of `SELECT *`; updates that leave the large value alone | 2 | S `#large-values` | Short mechanism, engine table |
| Heap or clustered table, at the level of "which one, and where Indexes explains it" | 2 | S `#pages`, one paragraph | Sentence and link |
| Table organisation by key, secondary indexes carrying the key, primary key choice, random against time-ordered keys | 2 | **Indexes** (`#heap`, `#key-order`, `#key-choice`) | Link from S |
| Which indexes an update writes, per engine | 2 | S `#pages` (summary); HOT itself in **Indexes** `#writes` | Paragraph |
| Buffer pool, hits, reads, eviction; crash empties it | 2 | S `#buffers` | Mechanism, Figure 2 |
| Working set, two caches (OS cache against bypass), sizing knee, memory budget, starting points per engine | 2–3 | B `#holds`, `#two-caches`, `#sizing` | Paragraphs, modelled sizing table |
| Scans pushing hot pages out; which bulk reads are fenced off | 3 | B `#scans` | Paragraph |
| Cold cache after restart or failover; saving and reloading the pool | 3 | B `#cold` | Paragraphs |
| Where old versions live (PostgreSQL table, InnoDB undo, SQL Server version store in tempdb or PVS, SQLite journal or WAL) and what a long transaction costs | 2 | S `#versions` | Mechanism, Figure 3, engine table |
| Why versions exist and who sees them | 2 | **Isolation and snapshots** | Reminder sentence in S |
| Space reused, rarely returned; table fill factor and the free space HOT uses; rewrites and their costs | 3 | S `#fill-factor` | Paragraphs |
| Index fill factor and page splits | 3 | **Indexes** `#splits` | Link from S |
| Dirty pages and why commit can't write pages | 2 | S `#dirty` | Figure 4 |
| Write-ahead rule, LSN, each engine's log; who writes dirty pages | 2 | S `#wal`, `#writers` | Figures 5, 6 |
| The flush and its price; group commit; batching | 2 | S `#commit-wait`, `#group-commit` | Measured table, Figure 7 |
| Binary log; SQLite rollback journal and WAL mode | 2 | S `#records`, `#sqlite-modes` | Paragraphs |
| Crash recovery: redo from a checkpoint, page LSN test; failures and what each keeps | 2 | S `#recovery` | Figure 8 |
| Checkpoints in brief: what they bound | 2 | S `#recovery` (paragraph) | Paragraph |
| Unfinished transactions: PostgreSQL invisible, InnoDB background undo, SQL Server undo proportional to the longest transaction unless ADR (always on in Azure SQL) | 2 | S `#unfinished` | Paragraphs |
| Recovery time: what the outage includes; measured replay | 2 | S `#recovery-time` (short); detail in C `#restart` | Paragraph |
| What recovery cannot repair | 2 | S `#cannot-repair` | List |
| The promise assumes the storage honours a flush | 2 | S `#flush` | Figure 9 (flush path), paragraph |
| Choosing how durable a commit is: settings across engines (PostgreSQL, InnoDB, SQLite, SQL Server delayed durability), loss against corruption, `sync_binlog`, kinds of data | 2 | S `#settings` | Figure 10, settings table, decision table |
| Corner cases of relaxed commits: visible before durable; planned SQL Server shutdown loses delayed-durable commits; immediate PostgreSQL shutdown counts as a crash | 3 | S `#relaxed-commits` | Short paragraphs |
| What can lose a committed change, gathered | 2 | S `#loss` | Table (reference) |
| Replicas, failover data loss | 2 | **Replication and failover** | Sentence in S `#loss` |
| A commit whose reply was lost | 2 | **Handling conflicts and uncertain outcomes** | Sentence in S `#loss` |
| Point-in-time recovery: a running copy as a crashed disk, archiving, replay and stopping early, timelines, MySQL and SQLite | 2 | **Backups and recovery** `#pitr` (moved whole from S, with its figure) | Paragraph and link in S `#loss` |

### Checkpoints, torn pages and the log (C)

| Part | Layer | Home | Needs |
|---|---|---|---|
| Reminder: three problems pages-written-later leave | 1–2 | C opening | Paragraph |
| Checkpoint costs: rounds against continuous; replay, page writes and full-page images | 3 | C `#checkpoints` | Mechanism, Figure 1 (checkpoints model) |
| Checkpoint calibration by engine (PostgreSQL 5 min / 1 GB / 0.9, InnoDB redo capacity, SQL Server 60-second indirect target, SQLite 1,000 pages) | 3 (4) | C `#checkpoint-settings` | Reference table |
| Sizing between checkpoints from a recovery-time target | 3 | C `#choosing-interval` | Method, measured cycle (Figure 2), 1 GB against 64 MB evidence |
| Checkpoint symptoms and what to change | 3 | C `#checkpoint-symptoms` | Reference table |
| Torn pages: guards per engine, SQL Server detects only | 3 | C `#torn-pages` | Figure 3, engine table |
| What one change writes, tallied | 3 | C `#write-cost` | Short worked tally |
| Checksums: detection, not repair | 3 | C `#checksums` | Paragraph |
| Trusting the flush: layers, power-loss protection, cloud volumes, fsync failure, network file systems, testing, flush time as the commit floor | 3 | C `#trust`, `#testing` | Layers table, paragraphs |
| The log as a resource: volume, what holds it per engine (incl. SQL Server log backups and `log_reuse_wait_desc`), a full log disk, the failing-archive experiment | 3 | C `#log-volume` | Retention table, recorded experiment |
| Recovery time and long transactions at restart, per engine | 3 | C `#restart` | Measured replay, paragraphs |
| Four incidents | 3 | C `#incidents` | Worked diagnoses |
| Signals by engine | R | C `#summary` | Reference table |

### Product series and other homes

| Part | Home |
|---|---|
| Clock sweep, buffer rings, `pg_buffercache` reading, usage counts as a working-set gauge, `pg_prewarm`, huge pages, `effective_cache_size` | PostgreSQL series: *Inside PostgreSQL* `#eviction` (with the four-policy figure) |
| Checkpoint log line, `pg_stat_checkpointer`, writers in `pg_stat_io`, `max_wal_size` trigger rule and worst-case replay figure | PostgreSQL series: *WAL, checkpoints, and recovery* `#reading-checkpoints`, `#max-wal-size` |
| WAL flush timing in `pg_stat_io`, wait events | PostgreSQL series: *WAL, checkpoints, and recovery* `#wal-flush-timing` |
| Reading a restart: startup lines and end-of-WAL messages | PostgreSQL series: *WAL, checkpoints, and recovery* `#reading-restart` |
| HOT, autovacuum, freezing, retained-snapshot diagnosis | PostgreSQL series: *Row versions, transactions, and vacuum* |
| Hit rate: where each engine counts it and how it misleads | *Understanding database performance* `#hit-rate` |
| Synchronous standby levels (the old Storage Figure 14) | *Replication and failover* `#acknowledgements` teaches the table; the figure's scene stays in the shared model, unused, until that page adopts it |
| Column storage | Column-stores essay |
| Compression, encryption at rest, LSM engines, eviction algorithms beyond a paragraph, allocation structures | Left out of this article. Proposed field homes: A03 for column compression, F08 for encryption policy, B08 for volume encryption, F04 for LSM. Other eviction/allocation internals remain reference material. |
