# Indexes in relational databases: derived depth (planner B)

Derived on 17 October 2026 from the clean-room kit and external evidence only. No
repository article, work note, skill or doc was opened.

**Result:** two articles, about 10,300 words, about 50 minutes of reading. A deep dive
teaches how an index works and how to predict what it will do. A companion applies that
to the query shapes applications run, and to keeping a database's indexes right over
time.

## 1. The expert's abilities

An expert practitioner can:

1. **Explain what an index physically is.** A B+tree of fixed-size pages with sorted,
   linked leaves, a fanout in the hundreds and a depth of three or four. A lookup
   descends the tree, then walks the leaves.
2. **Predict whether and how a query uses an index.** They know which conditions narrow
   the scanned range and which only filter it. That covers the leftmost prefix, equality
   before range, sorting and `LIMIT` served by index order, predicates that hide the
   column, and which engines can skip-scan.
3. **Estimate cost.** Each matching row can cost its own page visit, so past a modest
   fraction of the table a full scan wins. Physical row order moves that point, and an
   index-only read removes the table visit altogether.
4. **Reason about table organisation per engine.** Heap tables with row pointers
   (PostgreSQL, SQL Server heaps) behave differently from tables stored inside their
   primary-key index (InnoDB, SQL Server clustered, SQLite). Primary-key width and order
   matter because of it.
5. **Design a set of indexes for a workload.** That means composite order, covering
   columns, and partial and expression indexes. They extend an existing index before
   adding one, and can name the queries each index serves.
6. **Account for write cost.** Every insert and delete touches every index. Random keys
   scatter inserts and split pages.
7. **Use the indexes behind rules.** Unique constraints are indexes, and foreign keys
   need one on the referencing columns. Engines differ on which they create.
8. **Verify and audit.** Read a plan's index lines in each engine, find unused, redundant
   and missing indexes, remove one safely, and ignore maintenance folklore.
9. **Know where a B-tree stops.** Substring search, containment, geometry,
   nearest-neighbour and analytic scans need other index types or other systems.

**Evidence.** The PostgreSQL 18 manual's index chapter covers these mechanisms:
multicolumn use including the new skip scan, ordering, combining indexes, and unique,
expression, partial and index-only access. Winand's *Use The Index, Luke* organises
developer indexing around the same abilities. In his three-minute test of the five
commonest indexing mistakes, only 40% of 28,000 respondents passed. Prediction is the gap,
and it is learnable from rules. GitLab's guide to adding database indexes shows what
working engineers are held to. They must:

- justify an index with a plan;
- weigh its write cost;
- use partial indexes for flags and soft deletes;
- cap the number of indexes per table;
- treat zero scans as a signal, not proof;
- remember that a composite index can't replace one led by its second column.

The SQL Server design guide, the InnoDB clustered-index page and SQLite's query planning
notes set out how table organisation and covering columns change cost. Microsoft's
maintenance guidance supports the audit judgement. *Designing Data-Intensive Applications*
(chapter 3) and *Database Internals* (part I) mark how far into B-tree internals a
practitioner goes.

## 2. Coverage map

A is the deep dive *How indexes work*. B is the companion *Choosing indexes for your
queries*.

| # | Part | Home | Needs | Words |
|---|---|---|---|---|
| 1 | What an index is: a second, sorted structure pointing at rows, and the scan it avoids | A §1 | Mechanism, figure (scan vs seek) | 350 |
| 2 | The B-tree: pages, separator keys, linked leaves, fanout, depth by table size | A §2 | Mechanism, figure, depth-vs-rows table | 650 |
| 3 | What sorted order makes cheap: equality, ranges, prefix match, `ORDER BY` with `LIMIT`, min/max | A §3 | Four short queries | 300 |
| 4 | Composite indexes: leftmost prefix, equality before range, conditions that narrow the range vs conditions that only filter it. Order columns by use, not selectivity. | A §4 | Mechanism, interactive figure (choose a `WHERE`, see the leaf range), six-query prediction table | 750 |
| 5 | Skip scan: PostgreSQL 18; MySQL 8.0.13+ (covering, single table); SQLite after `ANALYZE`; none documented in SQL Server | A §4 | Paragraph, engine table | 200 |
| 6 | Predicates the index can't see: function or arithmetic on the column, date truncation rewritten as a half-open range, `OR` across columns | A §5 | Four before-and-after rewrites | 500 |
| 7 | From index entry to row: heap and pointer vs table inside its primary-key index. Secondary lookups, primary-key width copied into every secondary, primary-key range scans. | A §6 | Mechanism, figure (two lookup paths), engine table | 700 |
| 8 | When a scan beats the index: page visits per row, crossover fraction, physical correlation, batched row fetches (bitmap scans) | A §7 | Mechanism, measured chart | 500 |
| 9 | Index-only reads: InnoDB secondaries carry the primary key; `INCLUDE` in PostgreSQL and SQL Server only. PostgreSQL's visibility-map condition gets a sentence. | A §8 | Paragraphs, plan excerpt | 400 |
| 10 | Write cost per index. PostgreSQL updates add entries to every index unless they stay on the page: one paragraph, linked out. | A §9 | Paragraphs, measured insert rate vs index count | 400 |
| 11 | Where inserts land: sequential keys at the right edge (a hot page at extreme concurrency); UUIDv4 splits pages and widens the working set; UUIDv7 | A §10 | Mechanism, figure, measured comparison | 350 |
| 12 | Plan vocabulary across engines: PostgreSQL scan types, MySQL `type`/`key`/`Using index`, SQL Server seek/scan/key lookup, SQLite `SEARCH`/`SCAN` | A §11 | Table, paragraph | 250 |
| 13 | What a B-tree can't do, and where each case goes | A §12 | Paragraph with links | 250 |
| 14 | Method: start from the queries that matter. Equality columns, then one range or sort column, then covered columns. Extend before adding. | B §1 | Short recipe | 350 |
| 15 | Worked: a customer's recent orders (equality, sort, `LIMIT`, mixed directions) | B §2 | Example, plans before and after | 300 |
| 16 | Worked: multi-tenant tables, with the tenant column leading every index and unique key | B §3 | Example | 250 |
| 17 | Worked: work queue or status flag. Partial index on the rare state. MySQL has none, so use a composite led by status. Parameterised predicates can defeat a partial index. | B §4 | Example across engines | 350 |
| 18 | Low-cardinality and boolean columns | B §4 | Two sentences in part 17 | 100 |
| 19 | Worked: soft-deleted rows, with a partial index on live rows | B §5 | Short example | 200 |
| 20 | Worked: case-insensitive lookup. Use `lower(email)` in PostgreSQL and SQLite. MySQL and typical SQL Server collations are case-insensitive already. A collation mismatch defeats the index. | B §6 | Example, engine table | 350 |
| 21 | Worked: parameter type mismatch from application code (`nvarchar` against `varchar`, a string column against a number) and how it shows in a plan | B §7 | Example | 300 |
| 22 | Worked: text matching. A prefix works and a leading wildcard can't. Values over the key-size limit can be indexed through a hash expression for equality. | B §8 | Example, links | 250 |
| 23 | Worked: joins and foreign keys. Index the referencing columns: InnoDB creates that index, PostgreSQL, SQL Server and SQLite don't. Parent deletes scan the child, and hash joins need no index. | B §9 | Example | 350 |
| 24 | Worked: covering a hot query. `INCLUDE` vs extra key columns, and when widening isn't worth it. | B §10 | Example | 300 |
| 25 | Worked: a search screen with many optional filters. Serve the common combinations, let the engine combine indexes for the rest, and know when a search system should take over. | B §11 | Example | 350 |
| 26 | How many indexes: prefix-redundant indexes, consolidation, measured write cost, size against memory | B §12 | Paragraphs | 350 |
| 27 | Auditing: unused indexes (usage views are per server and reset; rare jobs; constraint-backing indexes), redundant ones and missing-index suggestions. Safe removal with MySQL invisible indexes or SQL Server disable. | B §13 | Per-engine queries | 650 |
| 28 | Maintenance: rebuilds get credit for what the statistics refresh did; page density after mass deletes | B §14 | Paragraphs | 300 |
| 29–36 | Pages; plan reading and statistics; keyset pagination; online index builds; primary-key type; unique semantics; InnoDB range locks; PostgreSQL-only detail | Neighbours (section 4) | A sentence and link where used | — |

## 3. Articles

**A. How indexes work** (deep dive). About 5,600 words, five figures (one interactive)
and two engine tables. Text is about 22 minutes, and figures and measured charts add
about 5, for **about 27 minutes**. It gives the full explanation. A reader who stops here
can predict index use, reason about cost in each engine and make the core design call:
equality, then range or sort, then covering.

**B. Choosing indexes for your queries** (companion). About 4,650 words and ten worked
examples, each giving the query, the index, the plan before and after, and why. Text is
about 19 minutes and the examples add about 4, for **about 23 minutes**. Readers also
arrive here directly, asking "why isn't my index used?" or "which indexes can I drop?"

**Why two.** One 10,000-word page would bury the mechanism under a catalogue that readers
consult by case. The deep dive comes first because every example leans on parts 2, 4 and
7. A third article on auditing would be about 950 words. That isn't worth a new page,
and auditing uses the same judgement as design: matching the index set to the workload.

**Experiments needed,** on PostgreSQL 18 and MySQL 8.4, plus SQL Server where a claim is
about it:

- the scan-versus-index crossover at two correlations;
- inserts with bigint, UUIDv4 and UUIDv7 keys;
- insert rate against index count;
- every worked example in B, with plans captured from real runs.

## 4. Boundaries

- **How a query runs** owns plan reading, the planner, statistics and joins. Teaching
  them here would teach the planner twice. **Planning and executing a PostgreSQL query**
  owns cost constants and bitmap scan internals.
- **Indexes in PostgreSQL** owns:
  - GIN, GiST, SP-GiST, BRIN and hash indexes;
  - operator classes, including `text_pattern_ops` for prefix `LIKE`;
  - deduplication;
  - the visibility map;
  - `REINDEX CONCURRENTLY` and bloat;
  - `citext` and nondeterministic collations.

  **Row versions, transactions, and vacuum** owns heap-only tuple updates. These change
  PostgreSQL predictions only.
- **Storage and durability** owns pages, and **The buffer pool** owns caching index pages.
- **Designing your data** owns the primary-key type decision. This subject owns the
  insert-locality mechanism behind it.
- **Constraints in depth** owns uniqueness semantics, conditional uniqueness and NULL
  handling. SQL Server allows one NULL in a unique index. The others allow many unless
  PostgreSQL's `NULLS NOT DISTINCT` is set. Foreign-key indexes stay here because they
  are an indexing cost decision.
- **Pagination and large results** owns keyset pagination.
- **Changing a schema while the application runs** owns online index builds in each
  engine.
- **Transactions and concurrency** owns InnoDB's index-range locking. MySQL warns that a
  statement with no suitable index locks every row it scans.
- **Understanding database performance** owns finding the queries that matter, and
  **Watching storage** owns index growth.
- **Partitioning and sharding** owns partitioned indexes, and **Replication and failover**
  owns builds on replicas.
- **Reporting on operational data** owns columnstore and summary indexes.
- The JSON, full-text and vector articles own those index types. **When should you add
  another system?** owns faceted search.

## 5. Left out

- **B-tree algorithms** such as split procedures, latch coupling and key truncation.
  Practitioners need the consequences, not the algorithms.
- **LSM storage** such as MyRocks. None of the four engines uses it by default.
- **Oracle behaviour**, which falls outside the collection's engines.
- **Index compression and fill-factor tuning.** These are rare, engine-specific decisions,
  and Microsoft advises keeping the default fill factor except for split-heavy random
  keys. That gets one sentence in part 11.
- **Index advisers and hypothetical-index tools.** The tools change, while the judgement
  they need is the one taught in parts 14 and 27.

## 6. Uncertainty

1. **Table organisation's home.** I placed heap versus clustered storage here because
   nearly every cost prediction depends on it. *Storage and durability* may already
   claim it, and its coverage map would settle this.
2. **The deep dive's length.** At 27 minutes it is long. The interactive figure may
   replace much of A §4's prose. Timing readers on a prediction quiz before and after a
   draft would show which sections pay.
3. **Column order.** Sources disagree. SQL Server's guide orders further columns by
   distinctness, while Winand calls "most selective first" a myth and orders by use. I
   followed use. Measuring equality-only lookups under both orders, on two engines,
   would settle the wording.
4. **Skip scan's weight.** PostgreSQL 18 softens the leftmost-prefix rule when the leading
   column has few values. I gave it a paragraph. Benchmarks at realistic cardinalities
   would show whether it changes design advice.
5. **Crossover numbers.** Correlation, caching and storage move the crossover, and
   Microsoft notes that random and sequential reads cost about the same on Azure storage.
   Only the measured experiment should supply a number.
6. **SQL Server skip scan.** I found no documentation of one and treated it as absent.
7. **Foreign-key indexes and conditional uniqueness** could sit in *Constraints in
   depth*. I split them by question: "what does it cost and speed up?" belongs here,
   "what rule does it enforce?" belongs there.

## Sources

- PostgreSQL 18 docs, chapter 11 (11.3 multicolumn and skip scan, 11.8 partial, 11.9
  index-only and covering); PostgreSQL 18 release announcement.
- MySQL 8.4 manual: InnoDB clustered and secondary indexes; `CREATE INDEX` (no `WHERE` or
  `INCLUDE`); foreign key constraints; range optimisation (skip scan); type conversion;
  InnoDB locks by statement.
- Microsoft Learn: SQL Server index architecture and design guide; Create filtered
  indexes; Optimize index maintenance.
- SQLite: Query Planning; The SQLite Query Optimizer Overview.
- Markus Winand, *Use The Index, Luke*: contents, three-minute test, the "most selective
  first" myth.
- GitLab development docs, "Adding database indexes".
- Kleppmann, *Designing Data-Intensive Applications* ch. 3; Petrov, *Database Internals*
  part I (from prior reading, not re-fetched).
