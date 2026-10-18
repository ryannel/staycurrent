# Indexes in relational databases: derived plan (planner A)

Derived on 17 October 2026 with the clean-room kit, from external evidence only. No
article, work note, skill or doc in this repository was opened.

**Result:** two articles, about 11,200 words, about 53 minutes of reading. A deep dive
on how indexes work, and a companion on choosing and maintaining them.

## 1. The expert's abilities

An expert practitioner with relational indexes can do eight things.

1. **Predict how an index serves a query.** Given the indexes and a query, they can say
   which conditions bound the scanned range and which only filter it, whether the index
   delivers the order the query asks for, whether the table must still be read, and
   roughly how many pages that costs.
2. **Explain why the planner did or didn't use an index.** They can tell "this index
   can't express the condition" apart from "the planner judged a scan cheaper", and know
   which one to fix.
3. **Account for where rows live.** PostgreSQL keeps rows in a heap and its indexes point
   at physical locations. InnoDB and (by default) SQL Server keep rows inside a
   primary-key B-tree, and SQLite keeps them in a B-tree keyed by rowid (or by the
   primary key in a WITHOUT ROWID table). Their secondary indexes carry that key. The
   expert predicts what this means for lookups, key width and updates.
4. **Design a small index set for a workload.** That means choosing columns and their
   order, deciding when partial, expression and covering indexes earn their place,
   indexing foreign keys, and merging overlapping indexes.
5. **Weigh what an index costs.** The costs are write work on every insert and many
   updates (which differs sharply between engines), space, memory, log and replication
   volume, where new keys land in the tree, and in InnoDB how many rows a statement
   locks.
6. **Verify with plans** in each engine's EXPLAIN, using realistic data and current
   statistics.
7. **Run the index set over time.** They find unused and redundant indexes without being
   fooled by statistics windows, add and drop indexes on a live system safely, and treat
   fragmentation and rebuilds as things to measure, not schedule.
8. **Know where the B-tree ends.** They recognise problems that need an inverted,
   spatial, block-range, vector or columnar structure.

**Evidence behind the list.** The engines' own index chapters agree on the core:
PostgreSQL 18 Chapter 11, MySQL 8.4's index and InnoDB chapters, SQLite's query planner
and optimizer overview, and Microsoft's SQL Server index design guide. Markus Winand's
*Use The Index, Luke* covers the same ground across engines from the practitioner's
side. His three-minute quiz (about 28,000 attempts) found only 40% of engineers answered
more than three of five questions correctly. The questions covered functions on indexed
columns, top-N via an index, column order, leading wildcards and losing an index-only
scan, which scored worst at about 39%. Those are the predictions in ability 1, so the
mechanism has to be taught, not just listed. GitLab's database guide shows the working
routine behind abilities 4 to 7: justify each index against plans, weigh write cost,
use partial indexes for status and soft-delete subsets, read usage statistics over
months, and drop only after checking replicas, rare jobs and column order. For ability
5, the 2016 Uber write-amplification dispute and the PostgreSQL HOT documentation show
that update cost depends on the engine's design, and MySQL's locking documentation shows
that a missing index makes InnoDB lock every row it scans. Microsoft's maintenance
guidance says not to rebuild on a schedule, because many rebuild "wins" come from the
statistics refresh.

## 2. Coverage map

A1 is "How indexes work". A2 is "Choosing and maintaining indexes". Word counts are
rough.

| Part | Home | Needs | Words |
| --- | --- | --- | --- |
| What an index is: a sorted copy of chosen columns with row pointers; the full scan it replaces; reads bought with writes and space | A1 §1 | Paragraphs and a figure (a table beside its index) | 350 |
| B-tree shape: pages, fanout, depth, linked leaves; why three or four levels reach a billion rows | A1 §2 | Mechanism, a figure, worked numbers | 500 |
| What a lookup costs: descending the tree, walking leaves, fetching rows; why many fetches lose to a sequential scan; physical correlation; small tables | A1 §3 | Mechanism and a figure (1 match against 10,000) | 550 |
| How the planner estimates selectivity and chooses | How a query runs | A sentence here and a link | — |
| Where rows live: PostgreSQL heap and row pointers; InnoDB clustered primary key; SQLite rowid and WITHOUT ROWID; SQL Server clustered or heap. A secondary lookup becomes two descents, and the primary key is copied into every secondary index | A1 §4 | Mechanism, a figure, an engine table | 700 |
| Reading only the index: index-only scans, INCLUDE against trailing key columns, InnoDB's free primary key; the visibility caveat (PostgreSQL visibility map, InnoDB page transaction id) | A1 §5 | Mechanism and examples | 450 |
| Visibility map, vacuum and how often index-only scans really skip the heap | Indexes in PostgreSQL | Link | — |
| Conditions that set the range and conditions that only filter it | A1 §6 | A figure (the scanned band of an (a, b) index) | 300 |
| Column order: the leftmost prefix, equality before range, order chosen by reuse across queries rather than "most selective first" | A1 §6 | Worked examples | 450 |
| Skip scan: PostgreSQL 18, MySQL 8.0.13 and later, SQLite only after ANALYZE; none in SQL Server | A1 §6 | Paragraph | 150 |
| Order from the index: ORDER BY, top-N with LIMIT, mixed ASC/DESC, MIN/MAX, GROUP BY | A1 §6 | Worked examples | 400 |
| Keyset pagination | Pagination and large results | Link | — |
| Combining indexes: bitmap AND/OR (PostgreSQL), index merge (MySQL), OR union (SQLite); the lost order; why a composite index usually wins | A1 §6 | Paragraph and an example | 300 |
| What stops an index being used: a function or arithmetic on the column, type or character-set mismatch (including an nvarchar parameter against a varchar column in SQL Server), collation and LIKE, a leading wildcard, OR across columns, negation, optional-filter "smart logic" | A1 §6 | A table of examples: the condition, why it fails, the fix | 700 |
| Indexes and join algorithms (the inner side of a nested loop; hash joins need none) | How a query runs | Two sentences here | — |
| Index variants: unique, partial or filtered, expression or functional, included columns, descending, MySQL prefix indexes; which engine supports which | A1 §7 | Definitions and a support table; use cases live in A2 | 550 |
| Uniqueness semantics and NULLs in unique indexes (SQL Server allows one NULL, the others many) | Constraints in depth | A sentence here | — |
| Write cost: every insert and delete touches every index. On update, PostgreSQL skips index work only for HOT updates (no indexed column changed, room on the page); InnoDB and clustered SQL Server touch only the indexes whose columns changed. Also space, buffer pool, WAL and replication volume | A1 §8 | Mechanism and a figure (one UPDATE in PostgreSQL against InnoDB) | 650 |
| Where new keys land: sequential against random keys, page splits, page density | A1 §8 | Paragraph | 200 |
| Choosing a key type (bigint, UUIDv4, UUIDv7) | Designing your data | Link | — |
| Locks follow index ranges: InnoDB locks every index record it scans; PostgreSQL serializable predicate locks get coarser under a sequential scan | Transactions and concurrency; Isolation and snapshots | Two sentences here | — |
| Other structures: hash, inverted, spatial, block-range, vector, columnstore | A1 §9 | A sentence each and links | 250 |
| A method that starts from the workload: find hot queries, list access patterns per table, make one index serve several queries, order columns as equality, then sort, then range, then payload, and know when not to index | A2 §1 | Short method and an example | 450 |
| Finding the expensive queries (pg_stat_statements, slow log, Query Store) | Understanding database performance | Link | — |
| Ten worked examples (listed below) | A2 §2 | Examples with SQL, the reasoning and engine notes | 2,100 |
| Checking the plan: how index access looks in each engine's EXPLAIN; rows read against rows returned; realistic data and fresh statistics | A2 §3 | One short plan per engine | 550 |
| "Why isn't my index used?": the order to check things in | A2 §3 | Checklist pointing into A1 | 200 |
| Unused and redundant indexes: pg_stat_user_indexes, MySQL sys views, sys.dm_db_index_usage_stats; caveats (reset statistics, per-replica counts, rare jobs, indexes that only back constraints) | A2 §4 | Examples and a caveat list | 400 |
| Building an index without blocking writes | Changing a schema while the application runs | A sentence here | — |
| Shipping and retiring indexes: deploy the index before the code relies on it; trial drops with MySQL invisible indexes or SQL Server disable (which needs a rebuild to undo); PostgreSQL has no built-in equivalent | A2 §5 | Paragraph and examples | 400 |
| Fragmentation, page density, bloat: measure, don't schedule; a statistics refresh explains many rebuild wins | A2 §6 | Paragraph | 350 |
| REINDEX CONCURRENTLY, bloat estimation, fillfactor for HOT | Indexes in PostgreSQL | Link | — |
| Watching index sizes grow | Watching storage in a running database | Link | — |
| Hints and advisors: MySQL and SQL Server hints, SQLite INDEXED BY, PostgreSQL none; missing-index suggestions as input, not prescription | A2 §7 | Paragraph | 250 |

**The ten worked examples in A2 §2.** Each takes about 200 words:

1. Child rows by foreign key, and the parent delete that scans the child table without
   that index. InnoDB creates the index; PostgreSQL, SQLite and SQL Server don't.
2. A tenant's newest items, where an index on `(tenant_id, created_at DESC)` serves the
   filter, the order and the LIMIT without a sort.
3. A work queue, using a partial index on pending rows. MySQL has no partial indexes, so
   there the answer is a composite index on `(status, created_at)`.
4. A unique email among live rows under soft delete. This takes a partial unique index in
   PostgreSQL and SQLite, a filtered unique index in SQL Server, and a generated column
   that is NULL for deleted rows in MySQL.
5. Case-insensitive email lookup. PostgreSQL and SQLite need an expression index, and the
   query must match the expression. The default collations in MySQL and SQL Server
   already compare without case.
6. A search form with optional filters: separate indexes against a composite one, why
   `(:p IS NULL OR col = :p)` defeats good plans, and building the SQL for each set of
   filters instead.
7. A boolean or low-cardinality column. It usually needs no index; a partial index helps
   when the value you want is rare.
8. Making a hot read path covering: INCLUDE in PostgreSQL and SQL Server, trailing key
   columns in MySQL and SQLite, and InnoDB's primary key at no extra cost.
9. A report over most of a table, where no B-tree helps. Scan it, summarise it, or move
   it (see Reporting on operational data).
10. Pruning overlap: an index on `(a)` is redundant beside `(a, b)` unless it is unique,
    backs an InnoDB foreign key, or is much narrower on a hot path.

## 3. Articles

**A1. How indexes work (deep dive).** This is the full explanation: the structure, what
a lookup costs, where rows live, which conditions and orders an index can serve, the
variants, and what an index costs to keep. PostgreSQL is the worked example, with engine
notes wherever a reader's prediction would change. About 6,500 words, six figures and
one support table. Reading time is about 26 minutes for the text plus 4 for figures and
tables, so **about 30 minutes**.

**A2. Choosing and maintaining indexes (companion).** This takes A1's model into
practice: a method that starts from the workload, ten worked examples, checking plans in
four engines, a "why isn't my index used?" checklist, finding unused indexes, shipping and
retiring indexes, upkeep, and hints. It assumes A1's §4 and §6. About 4,700 words. Reading
time is about 19 minutes for the text plus 4 for the SQL and plan excerpts, so **about
23 minutes**.

**Why two.** Practice is learned fastest from worked examples, and many readers arrive
asking "which index should I add?" or "can I drop this one?". One 11,000-word page would
bury both behind the mechanism. A third article, giving column order and the conditions
that defeat an index a page of their own, would break the chain from sorted order to
query shape and make the reader carry the B-tree model across pages. A lifecycle article
alone would be about 1,600 words, and its readers usually need the examples too.

## 4. Boundaries

The coverage map gives each sent part its home. The reasons:

- **How a query runs** owns cost estimation, statistics and join algorithms. A1 explains
  why selectivity matters; that article explains how the planner estimates it.
- **Indexes in PostgreSQL** owns GIN, GiST, SP-GiST, BRIN and hash, operator classes
  (including `text_pattern_ops` for LIKE under non-C collations), HOT and fillfactor
  tuning, the visibility map, deduplication and `REINDEX CONCURRENTLY`. These change only
  a PostgreSQL user's decisions. The JSON, full-text and vector articles own their
  specialised indexes; A1 §9 names each and the question it answers.
- **Constraints in depth** owns unique and foreign-key semantics. A1 teaches the index
  that enforces them; A2 owns the performance case for indexing child keys.
- **Changing a schema while the application runs** owns online index builds and their
  failure modes, because the same locking story applies to every schema change.
- **Designing your data** owns the choice of key type. A1 supplies why it matters for
  indexes.
- **Transactions and concurrency** and **Isolation and snapshots** own locking. A1 gives
  only the two sentences that change a reader's prediction about indexes.
- **Pagination**, **Partitioning**, **Reporting** and **Handling conflicts** each build on
  an index property (order, local indexes, columnstore, a unique index for upserts) inside
  their own subject.

## 5. Left out

- **B-tree algorithm internals.** Split and merge procedures, latch coupling, Lehman–Yao
  right-links, suffix truncation and prefix compression. The expert needs their
  consequences (page splits, density, depth), which A1 gives, not the algorithms.
- **LSM-tree engines** such as MyRocks. These are outside the four engines' default
  storage, and the comparison belongs to the storage field.
- **Oracle and Db2 specifics**: bitmap indexes, Oracle's unindexed all-NULL keys, and
  index-organised tables as an Oracle feature. These are outside the collection's engines.
- **InnoDB's change buffer and adaptive hash index.** Change buffering has been off by
  default since MySQL 8.4; the adaptive hash index is internal.
- **SQL Server memory-optimised hash indexes, XML indexes and indexed views**, and
  **index compression**. Niche or storage tuning; none changes index design for most
  readers.

## 6. Uncertainty

1. **Who owns heap and clustered storage.** I homed it in A1 because the MySQL and SQL
   Server docs teach it as index architecture, and predictions about lookups and updates
   depend on it. If Storage and durability already teaches it fully, A1 §4 shrinks to a
   250-word reminder and the total falls by about 450 words. Seeing that article's scope
   would settle it.
2. **A1's length.** At about 30 minutes, A1 is at the edge of one sitting. The tight link
   between sorted order and query shape argues for keeping it whole. Testing whether
   readers can still use the §2 to §4 model in §6, or a review pass on a draft, would
   show whether a break is cheaper.
3. **The number of worked examples.** Ten covers the patterns that recur in GitLab's
   and Microsoft's guidance. The low-cardinality column and the report query might
   shrink to a sentence each in A2 §1; draft review would settle it.
4. **Unconfirmed engine facts.** That SQL Server has no skip scan rests on my knowledge
   and a secondary source. Versions are moving: PostgreSQL 19 was at release candidate
   on this date, and MySQL's manual lists versions beyond 8.4. Fix a version baseline
   before drafting.
5. **How much locking to put in A1.** If the Transactions article doesn't say that
   InnoDB's locks follow index ranges, A1 needs a short section rather than two
   sentences.

## Sources that shaped the judgement

- PostgreSQL 18 docs: Chapter 11; HOT updates; routine reindexing; the PostgreSQL 18
  release announcement (skip scan, `uuidv7()`).
- MySQL 8.4 manual: clustered and secondary indexes; how MySQL uses indexes; range
  optimisation (skip scan); index condition pushdown; CREATE INDEX; foreign keys; locks
  set by statements; InnoDB multi-versioning.
- SQLite: optimizer overview; query planning; partial indexes; foreign keys.
- Microsoft Learn: index architecture and design guide; filtered indexes; missing-index
  suggestions; index maintenance.
- Markus Winand, *Use The Index, Luke*, its myth pages and the 2014 quiz results.
- GitLab development docs, "Adding database indexes".
- EDB, LWN and InfoQ coverage of Uber's 2016 move; Tomas Vondra, "Sequential UUID
  Generators".
