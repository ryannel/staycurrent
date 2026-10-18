# Relational databases: coverage map

One map for the relational collection (`src/lib/relational-collection.ts`). Each part has
one home: an article and section, or an explicit status (a sentence where used, a link to
another field or series, parked, or left out for a stated reason). Layers follow
`docs/article-work/depth-derivation-2026-10-17/consolidate.md`: 1 model, 2 working
mechanism, 3 expert cases, 4 product specifics; lookup material is marked reference.

Running example: the repair shop's orders table (`orders`, customer 42, P7 at page 12),
as used across Indexes and Storage and durability.

The [proposed whole-collection structure](#proposed-whole-collection-structure),
added on 18 October 2026, maps the remaining families for discussion. Its new
coverage is proposed, not an assertion that the existing pages already teach it.
The detailed Indexes and Storage maps below retain authority over their parts.

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

## Proposed whole-collection structure

18 October 2026. Part of the [field proposal](../databases-and-storage-plan.md).
See the [field map conventions](databases-and-storage.md#map-conventions).
This is a page and section plan for discussion, before independent planning review
or article commissions. The detailed maps above remain the mechanism breakdown for
R12–R16 and R28, with PostgreSQL recovery material at PG05.

Reader outcomes: model facts and enforce invariants; construct correct queries;
predict concurrency and index behaviour; diagnose work and waits; choose capacity
and distribution; evolve, protect and recover the data; compare implementations.
The general explanations use PostgreSQL as a worked engine and distinguish
consequential InnoDB, SQL Server and SQLite differences. Product machinery belongs
in the eleven-page PostgreSQL branch.

Running example: the shop's orders, customer 42 and blue mug P7; P7 is on page 12
for the storage trace. Preserve `index_orders` and its 60,000-row history-query
dataset for the measured index explanations. Do not force that synthetic table
into schema-design or analytical examples when it hides their actual problem.

Base: `/learn/databases/relational/`. Prerequisites below are conceptual; each
direct entrant gets a brief orientation rather than a compulsory reading list.

| ID | Proposed page and role | Owned sections and reader outcome | Teaching form | Entry needs; onward homes | Existing material / destination |
| --- | --- | --- | --- | --- | --- |
| R01 | Relational databases — introduction | Tables and records; identity and references; queries and constraints; transactions; engine and deployment; useful workloads and limits. Understand what the system is for before tracing an operation. | Small related tables and one read/change, with visible results. | No SQL assumed. R02/R06/R09; R31 for selection. | Existing collection entrance `/learn/databases/relational/`. |
| R02 | Designing your data — deep dive | Facts and identity; keys and relationships; cardinality; normalisation; intentional copies and history; ownership; design changes. Represent the shop without inconsistent shared facts. | Work a schema through duplication, an update anomaly and a deliberate snapshot. | R01-level model. R03/R04/R05. | Existing `modelling/`; `normalisation/` remains an alias. |
| R03 | Types, missing values and time — practical guide | Integer/decimal/float and units; text and collation; NULL and absent facts; identifiers; timestamps, zones and intervals; business history and temporal constraints. Choose representations that preserve meaning. | Wrong total, missing value and daylight-saving cases; engine contrasts after each mechanism. | Basic rows. R04 owns constraints; PG11 owns range/PostGIS implementation. | New `types-and-time/`. |
| R04 | Constraints in depth — deep dive | NOT NULL, checks and uniqueness; references and delete/update actions; NULL behaviour; deferred enforcement; race-free invariants and limits of cross-row rules. Place rules at the enforceable boundary. | Two clients violate an application-only check; constraints resolve or expose the remaining decision. | R02; brief transaction reminder. R09–R11 own isolation and retries. | Existing `constraints/`. |
| R05 | Tables and JSON — deep dive | Stable relational facts and varying attributes; nested updates; query/index boundaries; validation; write contention; when a document store earns another system. Choose a mixed representation. | P7 variants queried and updated in two designs. | R02/R03; D02 for document aggregates; PG08 for syntax/index machinery. | Existing `tables-and-documents/`. |
| R06 | Querying your data — deep dive | SELECT/filter/order; joins and row multiplication; grouping and HAVING; subqueries/EXISTS; set operations; NULL/three-valued logic. Predict the result before optimising it. | Tiny input tables beside exact query outputs, including empty and duplicate cases. | R01; SQL notation taught locally. R07/R08/R30. | Existing `query-results/`. |
| R07 | How a query runs — deep dive | Parse/plan/execute; scan/join/aggregate/sort operators; estimates and actual rows; statistics, correlations and refresh; memory/spill and parallelism. Read a plan as work rather than as a score. | Follow one query through operators; change skew and statistics; real plan measurements. | R06; R12 owns index structure, PG02 owns PostgreSQL planner details. | Existing `query-execution/`; keep `#refresh`. |
| R08 | Pagination and large results — practical guide | Total order and ties; offset work; keyset cursors and mixed/null keys; concurrent changes; stable exports; streaming and transaction lifetime. Return a bounded, usable result. | Next-page traces and a concurrent insertion; inspect the plan and connection lifetime. | R06; R12/R13 for index access. | Existing `large-results/`; keep `#page-cost`. |
| R09 | Transactions and concurrency — deep dive | Atomic work and commit; application transaction boundaries; locks and waiting; conditional updates; multi-statement invariants; avoid external I/O while holding resources. Make one purchase correct. | Two buyers, one remaining mug; connection-labelled statements and responses. | R01/R04; R10/R11 for anomalies and outcomes. | Existing `transaction-boundaries/`; `concurrent-updates/` remains an alias. |
| R10 | Isolation and snapshots — deep dive | Statement/transaction views; row versions; lost updates; write skew; phantoms; serialisation; locking reads; choosing an isolation level. Predict the anomaly that remains. | Histories on two connections, with actual engine results and contrasts. | R09; R15 owns physical version storage, PG04 owns vacuum. | Existing `isolation/`. |
| R11 | Handling conflicts and uncertain outcomes — practical guide | Deadlocks and serialization failures; retry whole units; backoff and deadlines; lost commit replies; operation identity and deduplication; external effects and the database outbox boundary. Finish the decision after failure. | Commit succeeds but reply is lost; retry with a stable purchase ID; inspect resulting state. | R09/R10; F05 owns transporting a copy, messaging mechanisms remain elsewhere. | Existing `conflicts-and-retries/`. |
| R12 | Indexes — deep dive | Owns the detailed Indexes map above: ordered copies, page lookup, selectivity, composite order, covering, write cost and index-set design. | Preserve measured history query and progressive figures; verify numbers again when changing examples. | Basic query; short page reminder. R13/R14; PG03 for implementation. | Existing `indexes/`; reference article, still revisable. |
| R13 | Indexing queries: diagnosis and patterns — companion to R12 | Owns Q in the detailed map: plan vocabulary, unusable conditions, estimates, parameters and worked query shapes. Distinguish a bad access path from a cheap scan. | Measured query/result/plan pairs and a changed condition. | R12 or a local reminder; R08 owns pagination mechanics, R07 statistics schedules. | Existing `indexing-queries/`. |
| R14 | Maintaining indexes — companion to R12 | Owns M in the detailed map: size/density, rebuild decisions, safe builds, unused indexes and rollout. Improve an index set without interrupting the application. | Before/after measurement and an operational change case. | R12; R24 owns general live-change procedure; PG03 owns product details. | Existing `maintaining-indexes/`. |
| R15 | Storage and durability — deep dive | Owns S in the detailed map: page/row cost, buffers, versions, dirty pages, WAL, commit/group commit, crash recovery and durability choices. | Preserve P7/page 12 trace, failure states and recorded measurements. | R01 and a short transaction reminder. R16/R28 for depth; PG05 for product procedures; R23 owns PITR. | Existing `storage/`; reference article, still revisable. |
| R16 | The buffer pool — companion to R15 | Owns B above: working set, OS cache, scan interference, memory budget and cold restart/failover. Choose and diagnose cache capacity. | Vary working-set size; distinguish modelled work from server measurement. | R15; R17 owns misleading hit-rate diagnosis, PG01 owns clock sweep. | Existing `buffer-pool/`. |
| R17 | Understanding database performance — practical guide | Establish symptom and interval; workload baselines; query work against waits; CPU, I/O, locks, logs and spills; plans, skew and statistics; hit-rate traps; verify the repair under load. Find the limiting work. | One incident with measurements that rule out competing explanations. | R07-level operators supplied locally; R13/R16/R18 and B06 for deeper diagnosis. | Existing `slow-queries/`. |
| R18 | The database work behind an application request — practical guide | Connection establishment/pools and budgets; ORM SQL; N+1; batching; prepared statements; timeouts and cancellation; overload and transaction leaks. Count and bound request work. | Trace one endpoint to SQL statements, waits and connection occupancy. | R06/R09; R11 owns ambiguous effects; F07 whole-system load tests. | Existing `request-cost/`. |
| R19 | Reporting on operational data — deep dive | Report grain and correct totals; workload interference; read replicas and stale reports; summary tables/materialised results; refresh and invalidation; deciding when to separate analysis. | Same report with multiplied rows, a summary and a lagged replica. | R06; R30 owns SQL patterns, A02 analytical models, F05 copy protocols. | Existing `reporting/`. |
| R20 | Scaling a relational database — deep dive | Evidence for a limit; reduce work; capacity and headroom; larger server, replicas, partitions and shards; bottlenecks that move; workload/cost comparison. Choose the next capacity move. | Compare designs under one measured workload with skew and a failed node. | R17; R21/R22/R34 own mechanisms; B05 hardware limits. | Existing `scaling/`. |
| R21 | Replication and failover — deep dive | Physical/logical copies in outline; send/flush/replay; synchronous acknowledgement; lag and read routing; promotion and fencing; RPO/RTO; split writers and tests. Explain which accepted work survives promotion. | One change through replicas and a partition; include the retained acknowledgement figure. | R15; PG06 commands/positions; R35 owns consensus ranges. | Existing `replicas-and-failover/`; retain `#acknowledgements`. |
| R22 | Partitioning and sharding — deep dive | Local pruning and maintenance; distribution keys and co-location; hot shards; cross-shard constraints/queries; ID allocation; online movement and routing. Distinguish table partitions from separate writers. | Shop tenants placed and moved; inspect query fan-out and a skewed tenant. | R07/R20; PG07 implementations; R36 distributed commit. | Existing `partitioning-and-sharding/`. |
| R23 | Backups and recovery — practical guide | Logical/physical/base backups; log chain and PITR; restore target; application reconciliation; corruption and validation; off-site/isolated copies; restore time and drills. Prove a usable recovery. | Restore before a bad delete, then recover a later valid purchase; record actual drills separately from models. | R15; B07 snapshots; F08 recovery access and deletion policy. | Existing `backup-and-restore/`; retain moved PITR explanation and anchors. |
| R24 | Changing a schema while the application runs — practical guide | Locks and online DDL; expand/contract compatibility; batched backfills and completion; indexes and constraints; deploy order; rollback and replicas. Migrate without a hidden mixed-version gap. | Two app versions, an interrupted backfill and a final validation query. | R02/R09; R14 index procedure, F06 cross-store migration. | Existing `schema-changes/`. |
| R25 | Controlling access — practical guide | Roles, grants and ownership; application identities; row/column policies; tenant escape cases; auditing; secrets and transport; testing privileged paths. Express the boundary in the engine. | Role/action tests with a tenant leak and a backup operator. | F08's policy is summarised locally; R29 tenant architecture. | Existing `access-control/`. |
| R26 | When should you add another system? — comparison | Search, documents, analytics, cache and specialised retrieval demands; credible existing-engine baseline; duplication, freshness and operations. Decide when an additional store earns its cost. | Several shop pressures, each compared with staying in the relational engine. | R01-level understanding. F02/F07 evaluate, F05 maintains copies; family introductions explain alternatives. | Existing `adding-another-system/`. |
| R27 | Retention and deletion — practical guide | Row lifecycle, history/archive and partition retirement; deletion work and tombstones; references and derivatives; erasure during restore; retention verification. Remove the right data without breaking recovery. | One customer removed across live rows, reports and a restored backup. | R02/R23; F08 policy, F05 propagation, R28 cleanup mechanics. | Existing `data-lifecycle/`. |
| R28 | Checkpoints, torn pages and the log — companion to R15 | Owns C above: checkpoint/restart tradeoff, torn pages, checksums, flush path, log retention and incidents. Diagnose the work deferred by commit. | Recorded checkpoint/log incidents and a signals table, linked to actual engine evidence. | R15; R14 index maintenance, PG04 version cleanup; B07 lower-layer protection. | Existing `checkpoints-and-the-log/`. |
| R29 | Sharing a database between tenants — practical guide | Shared table/schema/database choices; tenant keys and constraints; identity propagation; row isolation and privileged paths; noisy neighbours; per-tenant export/restore/movement. Defend a tenancy boundary. | Two tenants with a join leak, a hot tenant and a restore request. | R02/R25; R22 movement, F08 policy. | New `tenants/`. |
| R30 | SQL for histories and analytical questions — practical guide | Window partitions/frames; ranking and running totals; latest row per group; recursive queries and termination; interval overlap and gaps; exact result checks. Choose a query shape and predict its result. | Small input/output cases with ties and missing periods; plans where work changes the choice. | R06. R19 owns report architecture, A09 time-series modelling, G03 path semantics. | New `analytical-queries/`; reuse existing scattered SQL where sound. |
| R31 | Choosing a relational database — comparison | SQL Server, MySQL, PostgreSQL and SQLite for contrasting workloads; transactions, deployment, recovery, extensions and operating effort; editions/services and licensing evidence. Choose candidates, not a universal winner. | Same workload and failure requirements across alternatives, with dated evidence. | R01/F02; R32 embedded, R34 distributed, PG01 implementation depth. | Existing `product-comparison/`. |
| R32 | Running an embedded database — deep dive | In-process engine and file ownership; SQLite concurrency/journal modes; local durability and backup; multiple processes; application rollout; when a server is needed. Distinguish SQLite operational choices from server defaults. | Two writers and a reader; safe backup and deployment on an actual local engine. | R01; R15 owns general recovery, B02/B03 file semantics. | New `embedded/`; existing `embedded-databases` alias still points to R31 until route work is separately commissioned. |
| R33 | The last blue mug — worked example | Synthesis only: schema/invariants, query/index, purchase transaction, lost reply and post-restore reconciliation. Apply the mechanisms without becoming another full explanation of them. | One coherent purchase through normal and failed outcomes; link to the precise teaching homes. | R02/R09/R11/R12; enough context for a direct reader to choose the deeper link. | Existing `checkout/`. |
| R34 | Distributed SQL — introduction | Why distribute a relational engine; ranges and replicas; SQL execution across locations; atomic changes; latency, availability and placement; alternatives to distributing writes. Choose whether the branch is needed. | One purchase whose records begin together and then span regions. | R01; R35/R36/R37. | Existing `/learn/databases/distributed-sql/`; preserve entrance. |
| R35 | Replicated ranges and distributed reads — deep dive | Partition/range ownership; replicated log and quorum; leader/lease authority; read timestamps and safe stale reads; quorum loss; moving/splitting ranges. Predict a read during delay or failure. | Small range state machine, message trace and failed leader; contrast actual CockroachDB/Spanner contracts. | R34; F03 vocabulary supplied locally. Shared distributed-systems programme stays parked. | New `distributed-sql/replication/`. |
| R36 | Transactions across machines — deep dive | Participants and coordination; atomic commitment separate from replication; contention and distributed deadlocks; isolation/retries; lost coordinator; uncertainty and outcome recovery. Trace a cross-range invariant. | Transfer with durable participant states, crash points and eventual outcome; measured native behaviour where feasible. | R09/R10/R35. R11 retry identity is reminded, not re-taught. | New `distributed-sql/transactions/`. |
| R37 | Locality, capacity and operating distributed SQL — practical guide and comparison | Placement and multi-region promises; cross-region query cost; hot ranges; index locality; schema/backfill work; surviving a region; recovery and cost; choosing CockroachDB/Spanner against single-writer alternatives. | Same workload with different placement and failure requirements; current engine/service boundaries. | R34–R36 as needed. R31 for general engine choice, F07 evaluation. | New `distributed-sql/locality-and-operations/`. |
| R38 | Routine maintenance and safe upgrades — practical guide | Space/version cleanup; statistics and integrity checks; headroom; scheduling work without exhausting capacity; minor/major engine changes; extension/replica compatibility; rollback and rehearsal. Build an operating routine from observed needs. | Maintenance backlog during a busy interval, then an upgrade rehearsal with application validation. | R14/R23/R28; PG04/PG05/PG11 own PostgreSQL procedures. Avoid a universal tuning schedule. | New `maintenance-and-upgrades/`; preserve the existing `maintenance` alias until route work is commissioned. |
| PG01 | Inside PostgreSQL — product deep dive | Processes, connections, shared/private memory; relation files; clock sweep and rings; buffer inspection and sizing controls. Relate resource usage to architecture. | Inspect a real server and follow the shared P7 trace; retain cache-policy figure. | R15/R16; PG02/PG04/PG05. | Existing `postgresql/architecture/`. |
| PG02 | Planning and executing a PostgreSQL query — product deep dive | PostgreSQL statistics and estimates; joins/sort/hash/spill; prepared generic/custom plans; parallelism; EXPLAIN observations. Diagnose implementation-specific execution. | Versioned plans under changed skew and memory; verify actual execution. | R07/R13; do not duplicate general operator teaching. | Existing `postgresql/query-execution/`. |
| PG03 | Indexes in PostgreSQL — product deep dive | B-tree implementation and maintenance; concurrent builds/leftovers; GIN/GiST/BRIN and operator classes; collation/patterns; extension index boundary. Match method and operator to work. | Real plans, build failures and usage/size observations. | R12–R14; PG09/PG10 own full-text and vectors. | Existing `postgresql/indexes/`. |
| PG04 | Row versions, transactions and vacuum — product deep dive | Tuple visibility; HOT; snapshots and retained versions; vacuum/autovacuum; freezing/wraparound; bloat measurement; long-reader incidents. Explain and repair retained work. | Inspect version lifecycle and a blocked-cleanup experiment on a real server. | R10/R15; PG06 slots may retain work but owns replication. | Existing `postgresql/row-versions/`. |
| PG05 | WAL, checkpoints and recovery — product deep dive | WAL locations and records; writers/checkpointer; checkpoint logs/statistics and size triggers; flush timing; startup logs; policy/backup commands. Diagnose the server's durability machinery. | Actual logs and statistics; preserve measured records and validate version boundaries. | R15/R28; PG06 owns synchronous standby behaviour. | Existing `postgresql/recovery/`. |
| PG06 | Following a change to another PostgreSQL server — product deep dive | Physical/logical replication; send/write/flush/replay positions; sync modes; slots/retention; promotion/fencing; schema and subscription limits. Operate an actual replication path. | Multi-server trace and lost-acknowledgement/failover cases; model labels remain explicit. | R21; F05 owns general derived-copy protocol. | Existing `postgresql/replication/`. |
| PG07 | Where distributed PostgreSQL work runs — product deep dive | Native partitions; application shards; Citus/FDW boundaries; co-location, pushdown, constraints and movement; operating dependencies. Distinguish implementation choices. | Query and transaction placement with versioned extension/service evidence. | R22; R34 is the different distributed-SQL design. | Existing `postgresql/sharding/`. |
| PG08 | JSON queries in PostgreSQL — product deep dive | json/jsonb representation; correlated array predicates; SQL/JSON row production; GIN and expression matching; update costs. Query what the model actually means. | P7 variants with wrong and correct correlated predicates and plans. | R05/D03; do not re-teach aggregate design. | Existing `postgresql/json/`. |
| PG09 | Full-text search in PostgreSQL — product deep dive | Configurations/lexemes/positions; queries and phrases; weighted ranking; indexed filtered retrieval; update path and limits. Use the built-in facilities deliberately. | Real text/vector output, relevance cases and plans. | S02/S03 vocabulary supplied locally; S08 owns evaluation method. | Existing `postgresql/full-text-search/`. |
| PG10 | Vector search in PostgreSQL — product deep dive | pgvector data and distances; exact/HNSW/IVF implementation; filtered candidate behaviour; iterative scans; build/update costs and memory. Test implementation recall and access controls. | Exact baseline and filtered native comparisons with pinned extension version. | S05/S06; R25 permissions; dated assessment remains separate. | Existing `postgresql/vector-search/`. |
| PG11 | Types and extensions in PostgreSQL — product deep dive | Extension privileges/lifecycle/upgrade; ranges and exclusion; PostGIS geometry/geography and spatial indexes; operator/type dependencies. Choose and operate an extension with its consequences. | Temporal conflict and spatial query examples executed in the correct extension environment. | R03/R04; full GIS and extension development remain outside scope. | Existing `postgresql/extensions/`. |

### Tools and existing aliases

The existing SQL sandbox (`sandbox/`) and setup/practice page (`practice/`) remain
two tool destinations outside the article count. Map each useful lesson to the
owning article and distinguish PGlite, local server, extension and multi-server
execution. A new page does not automatically need a new sandbox lesson.

The aliases in `src/lib/relational-collection.ts`, plus `normalisation/` and
`concurrent-updates/`, remain compatibility routes, not additional articles.
Historical counts in earlier plans are not this proposal's inventory.

### Boundaries and changes to discuss

R38 owns the operating routine and upgrade rehearsal; R28 keeps its checkpoint/log
argument. The proposed types, SQL patterns, tenancy, maintenance and embedded pages
have independent reader questions; their boundaries should be challenged before
commissioning.

Existing generic pages need cross-engine checks. PostgreSQL's worked examples
must not silently define relational databases. Product comparisons require fresh
version/edition/service evidence; this plan establishes no product ranking.
