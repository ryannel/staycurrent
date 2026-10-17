# Indexes: coverage map and depth plan, 17 October 2026

A plan, not prose. Read against `relational/indexes.astro` as committed in `1507e13` (about 250 lines, 13 h2 sections with h3s in three of them, 8 figures, the history-query table). The tree in section 1 was built from the subject and reader before I opened the article's outline; section 3 compares the two. Names of views, settings, functions and plan wording marked V come from memory of the manuals and must be checked against PostgreSQL 18, MySQL 8.4 and current SQLite before they enter the article.

Reader: a working backend engineer on PostgreSQL, MySQL or SQLite who must design, verify and maintain indexes for real workloads: choose columns and order, judge selectivity, read plans, manage write costs, diagnose an index that is not used, maintain indexes (bloat, rebuilds, statistics), and index for joins, sorting, pagination and constraints.

Verdict legend: OK covered well; THIN covered, with what is missing; ABSENT-E absent and essential; ABSENT-N absent, useful but not essential; ELSEWHERE belongs in another article (destination checked); OUT out of scope on purpose.

## 1. The topic tree (derived from the subject, before reading the outline)

What a professional needs from "indexes": mechanisms they can predict, decisions the mechanisms inform, how it fails, how to see it in a running system.

**A. The model.** What an index saves (pages not read) and costs (space, write work, planner choices, maintenance).
- A1 what an index is; A2 why pages are the unit of cost; A3 the trade as a ledger the reader can apply to their own table.

**B. Structure: what is stored and where the row is.**
- B1 entry = key + row locator; B2 table organisation (heap with pointer; key-ordered with key as locator; SQL Server both) and what it changes (second descent, key copied into every index, insert pattern); B3 B-tree: leaves, branches, root, depth and fan-out; B4 leaf links and range reading; B5 duplicates and NULLs in keys; B6 key size limits and prefix indexes (MySQL prefix lengths; text keys in general); B7 ordering of keys: collation, DESC, NULL ordering.

**C. What a B-tree can answer (access patterns).** Each subtopic is one question the reader has about their SQL.
- C1 equality and IN lists; C2 ranges and BETWEEN; C3 ordered output and `ORDER BY ... LIMIT` (top-N without sort); C4 leading-column rule for composites; C5 prefix `LIKE 'abc%'`, collation and operator class requirements; C6 conditions that defeat an index (function on the column, implicit cast, mismatched types, leading wildcard, `OR` across columns, negation); C7 combining indexes (bitmap AND/OR, MySQL index merge, none in SQLite) versus one composite; C8 NULL handling (`IS NULL` served, uniqueness with NULLs); C9 joins: index on the inner side of a nested loop, join-key and foreign-key indexes, when hash/merge joins make an index irrelevant; C10 aggregates and `DISTINCT`/`GROUP BY` served by order (loose or streaming); C11 pagination: why `OFFSET` costs, keyset with a tie-broken composite index; C12 skip scan.

**D. Choosing indexes (design).**
- D1 from queries to candidates (frequency, latency target, table size); D2 selectivity, cardinality and skew (a tenant with half the table); D3 composite design: equality columns, then sort, then range; ties and stable ordering; D4 redundancy: `(a)` is covered by `(a,b)`; consolidating; D5 covering and included columns, and what they cost; D6 partial indexes (hot subsets, soft delete, queue states); D7 expression indexes; D8 unique and primary key choice (width, random versus sequential, the key is copied into every secondary index in key-ordered tables); D9 how many indexes a table can afford (write-heavy versus read-heavy); D10 multi-tenant and time-series shapes; D11 partitioned tables (local indexes, unique must include the partition key).

**E. The planner's decision.**
- E1 statistics: row counts, distinct counts, common values, histograms, correlation; how they go stale; extended statistics for correlated columns; E2 cost model and its knobs (page costs, effective cache size V); E3 why it can pick a scan over a good index (not selective, stale stats, skew, small table, type mismatch, parameter plans); E4 how to steer: tests with `enable_*` switches V, MySQL index hints and invisible indexes V, SQLite `INDEXED BY` and `PRAGMA optimize`/`ANALYZE` V; E5 generic versus custom plans.

**F. Verifying.**
- F1 read a plan (route, `Index Cond` versus `Filter`, rows removed, buffers/pages, heap fetches); F2 compare estimate and actual rows; F3 test on production-shaped data (size, skew, cache state); F4 the checklist for "why isn't my index used"; F5 per-engine plan vocabulary; F6 try before you create (invisible indexes in MySQL V, hypothetical indexes with the HypoPG extension V, or create in a copy); F7 measure after: scans, latency, write cost.

**G. Writes and running indexes in production.**
- G1 write amplification: entries per insert/update/delete; which updates touch which indexes (HOT, InnoDB delete-mark and insert, change buffering and why it is off by default in 8.4); G2 page splits, fill, sequential versus random keys; G3 deletes and bloat: why an index does not shrink, empty and sparse leaf pages, deduplication/bottom-up deletion in PostgreSQL, purge in InnoDB; G4 how to see index size and bloat (`pg_relation_size`, pgstattuple/`pgstatindex` V, `amcheck` V, InnoDB `information_schema`/`innodb_index_stats` V, SQLite `dbstat` V, `sqlite3_analyzer`); G5 rebuilds: `REINDEX [CONCURRENTLY]`, `ALTER TABLE ... FORCE`/`OPTIMIZE TABLE` V, SQLite `REINDEX`/`VACUUM`; what each locks; G6 building new indexes safely: lock levels, `CONCURRENTLY` and invalid leftovers, InnoDB online DDL, SQLite single writer, build time and memory (`maintenance_work_mem` V, `innodb_sort_buffer_size` V), replicas; G7 statistics maintenance: autovacuum/analyze thresholds V, `ANALYZE` after bulk loads, InnoDB persistent statistics V, SQLite `PRAGMA optimize` V; G8 finding unused, duplicate and invalid indexes, and dropping them safely (`DROP INDEX CONCURRENTLY`, MySQL invisible then drop); G9 rolling a change out: create, verify, switch queries, drop old; G10 index corruption and checks (`amcheck`, `CHECK TABLE` V, SQLite `PRAGMA integrity_check`).

**H. Constraints.**
- H1 unique and primary key as indexes; H2 uniqueness and NULLs, partial unique indexes (one active row per key); H3 foreign keys and their indexes; H4 exclusion constraints (PostgreSQL); H5 uniqueness under concurrency (index lock and wait).

**I. Other index structures.**
- I1 hash, GIN, GiST/SP-GiST, BRIN, bloom, vector; I2 InnoDB full-text, spatial, multi-valued; SQLite R-tree, FTS; SQL Server columnstore/filtered/included; I3 how to decide when a B-tree is not enough.

**J. Edges.**
- J1 index-organised storage and WITHOUT ROWID; J2 columnar and LSM engines (out of scope); J3 cache effects on index versus scan; J4 SSD versus disk and random page cost.

## 2. What the neighbours already teach (checked by heading lists and grep)

| Neighbour | Covers about indexes | Does not cover |
| --- | --- | --- |
| `slow-queries.astro` (h2s: request, waiting, plans and changing data, maintenance, testing) | One worked statistics case: stale stats, `ANALYZE`, an index on a skewed `state` column; vacuum/ANALYZE as separate jobs; `VACUUM FULL` caution; `pg_stat_statements`; test an improvement on production-shaped data | Index bloat, rebuilds, index usage stats, "why isn't my index used", index design |
| `query-execution.astro` (nested loop, sort/aggregate, hash, merge, estimates, memory) | Join algorithms; index lookups on the inner side; primary-key indexes enabling merge join; statistics and `CREATE STATISTICS` (dependencies) | Choosing join/foreign-key indexes, covering joins, pagination |
| `postgresql/query-execution.astro` | Custom versus generic plans; `ORDER BY ... LIMIT` with an index and top-N sort; ordered route early stop; external sort | MySQL/SQLite; index design |
| `large-results.astro` | Offset versus keyset pagination; one composite index candidate; "test a later page" | Index design for pagination beyond one example; ties and nullable sort columns; engine row-value syntax |
| `query-results.astro` | Plan reading basics, nested-loop with primary-key lookup, estimates versus actual | Index choice |
| `constraints.astro` | PRIMARY KEY, UNIQUE, NULLs distinct, `NULLS NOT DISTINCT`, uniqueness under concurrent inserts | That each is an index, the cost of it, partial unique indexes (soft delete); FK referencing-column index appears only in `indexes.astro` |
| `schema-changes.astro` | Lock timeouts, backfills, a partial index for finding unbackfilled rows (one sentence) | Rolling out an index: concurrently, invalid index, drop |
| `partitioning-and-sharding.astro` | Pruning; a local index inside a partition; the primary key must include the partition key; local unique cannot be global | Per-partition index maintenance and rebuild cost |
| `postgresql/row-versions.astro` | HOT, visibility map, covering index and heap fetches, `pg_stat_user_tables` for dead tuples and HOT proportion, `pageinspect` | Index bloat and rebuild; per-index stats |
| `postgresql/indexes.astro` | B-tree ordered scans, skip scan with a server measurement, planner page costs, index-only and visibility map with a figure, operator classes, GIN, BRIN, HOT, `CONCURRENTLY`, GIN pending list | `REINDEX`, bloat measurement, deletion/deduplication, amcheck, hash/GiST depth, multi-index bitmap combining, sorting collation, LIKE |
| `storage.astro` | Pages, fill, checkpoints, torn pages; indexes logged like tables | Index size monitoring |
| Anywhere in the collection | `grep` finds no `bloat`, `pgstattuple`, `amcheck`, `LIKE 'x%'` index use, `text_pattern_ops`, `BitmapOr`, MySQL index merge, `OR` conditions and indexes, `EXPLAIN` in MySQL beyond the parent's table | These are essential gaps with no other home |

## 3. Compare the tree with the article

| Part | Verdict | Where, and what |
| --- | --- | --- |
| A1-A3 model | OK | Opening is the user's approved shape. The cost ledger exists in Write costs; add nothing. |
| B1 entry and locator | OK | Entries section, two h3s, Figures 2 and 3. |
| B2 table organisation | OK, one hole | Heap and key-order both taught, with a conversion paragraph. Missing: SQL Server clustered key is not necessarily the primary key (a clause), InnoDB's `PRIMARY KEY` choice as a design decision (see D8). |
| B3 B-tree and depth | OK | Figure 4 and the depth table. Fan-out for InnoDB (16 kB pages) and SQLite absent but the principle transfers. |
| B4 leaf links | OK | Corrected for SQLite. |
| B5 duplicates and NULLs in keys | THIN | Posting list named (PostgreSQL); how NULLs sort and whether `IS NULL` uses an index is a single word in the range list. |
| B6 key size and prefix indexes | ABSENT-N | MySQL prefix lengths, long text keys, key size limits. One paragraph in kinds or a sentence in D8; nothing more. |
| B7 collation, DESC, NULL order | ABSENT-E (for ordering and LIKE) | `DESC` appears only in examples; no statement that collation decides sort order, that a text index serves `ORDER BY` only under matching collation, or `NULLS FIRST/LAST`. Belongs with C3/C5. |
| C1 equality and IN | THIN | Range list names IN; no worked IN-list or `= ANY` case. A sentence is enough. |
| C2 ranges | OK | Range scans section and Figure 5. |
| C3 ORDER BY ... LIMIT | THIN | Composite section shows it, with Figure 7 and the 13-page table, but never states the rule: an index supplies order when its leading equality columns are fixed and the sort columns follow; mixed ASC/DESC; `LIMIT` is what makes early stopping pay. ELSEWHERE partly: `postgresql/query-execution.astro` teaches top-N versus ordered route for PostgreSQL only. Needs a short h3 here. |
| C4 leading-column rule | OK | Composite section, with the `(a, b)` paragraph and skip-scan caveat. |
| C5 LIKE, collation, opclass | ABSENT-E | Prefix `LIKE` is the commonest "my index isn't used" case after casts. Needs a paragraph and a PostgreSQL-labelled example; PostgreSQL's operator-class mention in `postgresql/indexes.astro` is JSON-only. |
| C6 conditions that defeat an index | ABSENT-E | Only the expression-matching paragraph (`placed_at::date`). Missing: function on the column, implicit cast (`varchar` column compared with a number; MySQL charset/collation mismatch on joins), leading wildcard, `OR`, negation. Highest-value single gap. |
| C7 combining indexes | THIN | Bitmap scan covers combining only as a fetch strategy; BitmapAnd/BitmapOr and MySQL index merge are not described, so "should I make a composite or rely on two indexes?" is unanswered. |
| C8 NULLs | THIN | See B5; plus partial unique and `NULLS NOT DISTINCT` live in `constraints.astro` (checked: covers distinct NULLs, not the index). |
| C9 joins | ABSENT-E | The opening says indexes "speed up joins on a key"; no section shows it. `query-execution.astro` shows nested-loop inner lookups incidentally, with an index already in place, and nothing about choosing the join-column index or foreign-key index beyond one paragraph here. Companion article territory (section 6, B1). |
| C10 order-served GROUP BY/DISTINCT | ABSENT-N | One sentence under C3. |
| C11 pagination | ELSEWHERE | `large-results.astro` teaches offset versus keyset and one candidate index. It lacks row-value comparison per engine, ties and nullable sort columns, and deep-page measurement. The parent should link in C3 and not teach it. Companion may expand (section 6, B1). |
| C12 skip scan | OK | Narrow, sourced, labelled. |
| D1 queries to candidates | ABSENT-E | The article teaches mechanisms; nothing says how to go from a slow query or a workload to a short list. A procedure in six steps (write the predicate/order/projection; pick equality columns; add sort/range; check selectivity; test; measure writes) is the missing keystone. Parent h2 "Designing an index for a query" (moderate). |
| D2 selectivity and skew | THIN | Selectivity section teaches fraction and the switch point on uniform data. Skew (one tenant with half the table) is the real-world case; `postgresql/query-execution.astro` has the tenant demonstration and `slow-queries.astro` the stale-stats one, so link and add one sentence; no new figure. |
| D3 composite design | OK, short | Figure 7 and table. Add the "equality, sort, range" rule as a stated sentence (it is there: "put columns compared with = first") and the ties note exists. |
| D4 redundancy | ABSENT-E | No statement that `(customer_id)` is made redundant by `(customer_id, placed_at)` (and when it is not: size, unique, covering). Needed alongside the unused-index section; two paragraphs. |
| D5 covering | OK | Rewritten this morning; engine-specific. |
| D6 partial | OK | Add the queue-state and soft-delete cases in a sentence each. |
| D7 expression | OK | |
| D8 primary key choice | THIN | Clustered section says short keys; no advice on UUID versus sequential key choice for key-ordered tables beyond the bullet, and no mention that a partitioned or sharded key shapes it. A short h3 "Choosing the primary key" or fold into entries section. |
| D9 how many indexes | THIN | Figure 8 shows costs; no guidance beyond "an index no query reads costs every write". One paragraph with the ledger framing in Write costs. |
| D10 shapes (tenant, time-series) | ELSEWHERE / ABSENT-N | Tenant skew in `postgresql/query-execution.astro`; time-series is BRIN in `postgresql/indexes.astro`. A pair of worked patterns belongs in the design companion. |
| D11 partitioned tables | ELSEWHERE | `partitioning-and-sharding.astro` covers local index and the key rule. Link only. |
| E1 statistics | ELSEWHERE, thin there | `slow-queries.astro` and `query-execution.astro` teach staleness and extended stats for PostgreSQL. The parent says "statistics collected by ANALYZE" once. Add to G7 below; link. MySQL/SQLite statistics (`ANALYZE TABLE`, `innodb_stats_persistent` V, `PRAGMA optimize` V) have no home. |
| E2 cost model | ELSEWHERE | One sentence plus pointer to `postgresql/indexes.astro#cost`; checked, it exists and works. |
| E3 why a scan beat the index | THIN | Selectivity section teaches switch point; the reader's diagnostic question needs a checklist (section 4, h2 "When the database ignores an index"). |
| E4 steering and experiments | ABSENT-E | `SET enable_seqscan = off` as a test, MySQL `USE INDEX`/`FORCE INDEX`/invisible indexes V, SQLite `INDEXED BY`. Not for production steering; for proving the index can win. Belongs in the diagnostic h2. |
| E5 generic plans | ELSEWHERE | `postgresql/query-execution.astro` (Custom and generic plans). Link in the checklist. |
| F1 reading a plan | OK | EXPLAIN section with a four-point list and a table. |
| F2 estimate versus actual | THIN | The EXPLAIN section does not show estimated versus actual rows; `query-execution.astro` and `query-results.astro` do. Link and add one bullet. |
| F3 production-shaped test | ELSEWHERE | `slow-queries.astro` Testing an improvement. Link. |
| F4 "why isn't my index used" | ABSENT-E | See E3, C6. Essential. |
| F5 per-engine vocabulary | OK | Table added this morning. MySQL `EXPLAIN ANALYZE` iterator names, `EXPLAIN FORMAT=TREE`, and SQLite's `SEARCH`/`SCAN` are present at table level. |
| F6 try before you create | ABSENT-N | Invisible index V and HypoPG V are mentions in the diagnostic h2, not sections. |
| F7 measure after | THIN | Index-usage counters appear in the unused-indexes h3 only. |
| G1 write amplification | OK | Figure 8 and InnoDB paragraph. Change buffering omitted deliberately (default `none` in 8.4). |
| G2 page splits | OK | Short h3. |
| G3 deletes and bloat | ABSENT-E | No explanation that deleted rows leave sparse index pages, why an index does not shrink, why `REINDEX` helps, what bottom-up deletion and deduplication do (PostgreSQL), or how InnoDB purge frees space. grep finds `bloat` nowhere on the site. Companion territory (section 6, B2). |
| G4 seeing size and bloat | ABSENT-E | `pg_relation_size`, `pgstatindex` V (pgstattuple extension), `pg_stat_user_indexes`, InnoDB `mysql.innodb_index_stats` V, SQLite `dbstat` V. |
| G5 rebuilds | ABSENT-E | `REINDEX [CONCURRENTLY]` appears in `postgresql/indexes.astro` only as a repair for an invalid concurrent build. MySQL `OPTIMIZE TABLE`/`ALTER TABLE ... FORCE` V and SQLite `REINDEX` V absent. |
| G6 building safely | THIN | One h3 here, one in `postgresql/indexes.astro#concurrently`. Missing: invalid leftovers handling (in PG article), build time and memory, replica lag during builds, `lock_timeout` (in `schema-changes.astro` for columns; link). |
| G7 statistics maintenance | THIN / ELSEWHERE | See E1. After bulk loads, run `ANALYZE`; autovacuum analyze thresholds V; MySQL and SQLite equivalents absent. |
| G8 unused and duplicate indexes | THIN | Unused covered (PostgreSQL view, MySQL sys view V, SQLite none). Duplicates (D4), invalid indexes (`pg_index.indisvalid` V), and safe dropping (`DROP INDEX CONCURRENTLY`; MySQL invisible then drop V) absent. |
| G9 rolling out a change | ABSENT-E | Create, verify, switch, drop. A short procedure; ties G6, G8, F7 together. |
| G10 corruption checks | ABSENT-N | `amcheck` V, `CHECK TABLE` V, `PRAGMA integrity_check`. A paragraph in the maintenance companion. |
| H1 unique and primary as indexes | OK | Unique indexes h3 explains why a constraint is an index. `constraints.astro` does not mention this (checked), so the parent is the only home. |
| H2 partial unique / soft delete | ABSENT-N | One worked sentence under partial or unique; belongs in design companion as a pattern. |
| H3 foreign-key index | OK | One paragraph; enough here, and `constraints.astro` "References and deletion" could link to it (a link edit in that article, not here). |
| H4 exclusion constraints | OUT | PostgreSQL GiST depth; `postgresql/indexes.astro` could cover; not the parent. |
| H5 uniqueness under concurrency | ELSEWHERE | `constraints.astro` "Concurrent writes". Link. |
| I1-I3 other structures | OK for a map | Table is PostgreSQL's; InnoDB and SQLite sentences repaired. Missing: SQL Server types, MySQL multi-valued index (JSON arrays) V. The "when is a B-tree not enough" decision is implicit in the table's "Built for" column; fine. |
| J1 index-organised storage | OK | Entries section. |
| J2 columnar and LSM | OUT | Other families (`column-stores.astro` exists). |
| J3, J4 cache and SSD | THIN | Selectivity states sequential versus random; SSD and cache effects live in the PostgreSQL cost h3. Fine. |

## 4. Per-section depth verdicts for the parent

Plan: keep the argument "pages, row locations, structure, access, choice, cost, verification". Add two h2s and enlarge three. Word counts are estimates relative to today's 4,000-odd body words.

| Section | Verdict | Change |
| --- | --- | --- |
| Opening | keep | Add one sentence naming the decisions it equips (which columns, in which order, whether the database uses them, what they cost). |
| Sequential scan | keep | |
| Index entries and row locations | keep, +1 short h3 | Add h3 "Choosing the key of a key-ordered table" (D8): width, sequential versus random, the key is copied into every other index; link to the maintenance companion for fill and splits. About 150 words. |
| B-tree | keep | Add one clause on InnoDB 16 kB and SQLite page sizes for fan-out. |
| Range scans | keep, +h3 | h3 "Order without sorting": when an index supplies `ORDER BY`, with `LIMIT` (C3), collation and NULL order (B7). Move the existing Figure 7 discussion forward only by link. About 250 words. Check against `postgresql/query-execution.astro` to avoid retelling top-N; one sentence link. |
| Selectivity and the planner's choice of scan | keep, +1 paragraph | Add skew and stale statistics (D2, E1): link `postgresql/query-execution.astro` and `slow-queries.astro`; state the MySQL and SQLite statistics commands. |
| Composite indexes | keep, +h3 | h3 "Combining two indexes instead" (C7): BitmapAnd/Or, MySQL index merge, SQLite one index per table per query (V; SQLite can use multiple indexes for OR via the OR optimization, verify). Short. |
| Covering | keep | |
| Partial, expression and unique | keep, +2 short paragraphs | Add soft-delete partial unique and queue-state partial (one sentence each); add redundant-index paragraph (D4) at the end of "Unique indexes and foreign keys" or as the first paragraph of the unused-indexes h3. |
| **New h2: Indexing for a query** (after Covering or after the partial group) | essential, substantial | The design procedure (D1) with the history query as the worked case, reusing Figure 7's logic: write the query's three parts (equality, order, range, projection); candidate; check selectivity; test; check write cost. About 400 words, one table ("what the query asks" to "where it goes in the key"). This is the section a reader keeps. Joins and pagination here as two short subsections with links to the companion (C9, C11). |
| Other index types | keep, tune | Add SQL Server and MySQL multi-valued; tighten. |
| Index write costs | keep, h3s | Add h3 "Deleted rows and index size" (G3, about 200 words) as a bridge to the companion: deletes leave sparse pages, an index does not shrink by itself, a rebuild is the remedy, link. Keep "Page splits", "Building an index on a live table", "Finding unused indexes" (add duplicates and invalid, link to companion). |
| **New h2: When the database ignores an index** (before Checking with EXPLAIN, or after it) | essential, moderate | The diagnostic checklist (E3, E4, F4): not selective, leading column missing, expression/cast/collation/LIKE mismatch, stale statistics, small table, parameter-dependent plan, index invalid or invisible; per-engine test to prove the index could win (`enable_seqscan`, `FORCE INDEX` V, `INDEXED BY` V). Each item links to the section that teaches it. About 450 words; no figure. |
| Checking an index with EXPLAIN | keep, +1 bullet | Add estimate versus actual rows (F2) and an h3 split ("Reading a plan", "MySQL and SQLite") would help the contents. |
| Where the numbers come from | keep | |
| Sources | keep | Add maintenance references when the companion exists. |

Net growth: roughly 1,300 words, two h2s, three h3s, no new figure required.

Figures and worked examples that would carry a part better than prose:
- "Indexing for a query": a table, not a figure.
- "Deleted rows and index size": a small static figure of a leaf page with deleted entries before and after rebuild would carry the idea (illustration-style: same ix-figure frame); only if the companion is not built, otherwise put the figure in the companion. V requires a measurement from the sandbox: size of an index after deleting 90 per cent of rows, and after `REINDEX`.
- "Combining two indexes instead": no figure; one plan excerpt.
- The diagnostic checklist: no figure.

## 5. Out of scope on purpose

Index internals beyond what predicts cost (page layout, split algorithm, item pointers, WAL records for indexes); LSM trees and columnar engines; hash-index internals; GIN/GiST/BRIN depth (kept in `postgresql/indexes.astro`); vendor-specific tuning (SQL Server fill factor, Oracle bitmap indexes); cloud-service behaviours; automatic index advisors (name once, not teach); cost-setting tuning (kept in the PostgreSQL article).

## 6. Where to break out into their own articles

Reasons to break out (from the brief): its own investigation, readers who would arrive for it directly, or it would swamp the parent. Two are strong; two more are possible; one is a rejection.

### B1. "Indexing joins, sorting and pagination" (recommended)

- Parts: C3, C6, C7, C9, C10, C11, plus D1's worked patterns D10 (tenant, time-series), H2 (soft-delete unique), D6 (queue states), and the query-to-index procedure's longer examples.
- Why a separate article: the parent explains how a lookup works; this applies it to the four query shapes that account for most real index decisions. Readers arrive with a query ("index for order list with filter and sort", "keyset pagination index", "foreign key slow delete"), not with a structural question. In the parent it would double its length and bury the mechanism argument.
- What it adds that nothing else teaches: choosing join and foreign-key indexes and seeing them in nested-loop plans (`query-execution.astro` shows an already-indexed loop; `query-results.astro` mentions it in passing); tie-broken composite for keyset with nullable sort columns and row-value comparison per engine (`large-results.astro` gives one index and says "inspect the plan"); multi-condition and `OR` queries; the sargability list.
- Overlap risk: `large-results.astro` owns pagination semantics (offset skips, live changes, exports). The companion owns the index that serves the page and the plan evidence; each links the other. `query-execution.astro` owns join algorithms; the companion owns join-column indexes.
- Evidence it would need: a sandbox lesson with measured pages for a join with and without the foreign-key index, an `ORDER BY ... LIMIT` with the composite index (reuse the 60,000-order table), a keyset page at depth, and the `LIKE` prefix with and without a pattern operator class (PostgreSQL, V `text_pattern_ops`) and with a non-C collation.

### B2. "Maintaining indexes: size, rebuilds and statistics" (recommended)

- Parts: G3, G4, G5, G6 (build time, memory, replicas), G7, G8 (duplicates, invalid, drop), G9, G10.
- Why a separate article: it is an operational reference an on-call engineer opens directly ("index twice the size it should be", "can I rebuild without locking", "stats stale after a bulk load"). It needs its own investigation: insert, delete 90 per cent, vacuum, measure the index; rebuild and measure; per engine (PostgreSQL `REINDEX CONCURRENTLY`, MySQL `OPTIMIZE TABLE`/`ALTER TABLE ... FORCE` V, SQLite `REINDEX`/`VACUUM` V). Parent coverage would swell the write-costs section past the argument. The site has no coverage of index bloat anywhere (`grep` finds none); `slow-queries.astro` Maintenance handles table bloat and `VACUUM FULL` only.
- Overlap: `postgresql/row-versions.astro` explains why old versions linger and how vacuum reuses table space; this article takes the index side and links back. `postgresql/indexes.astro#concurrently` stays for the PostgreSQL build mechanics; the companion generalises across engines.
- Parent keeps: the "Deleted rows and index size" h3 (bridge) and the existing build and unused sections, shortened to link.
- Evidence it would need: a measured bloat experiment in the sandbox (PGlite may not ship pgstattuple; `pg_relation_size` before and after is enough), and a manual check of each engine's rebuild locks.

### B3. "Why the database ignores an index" (not recommended as a separate article)

Strong direct-arrival topic, but every item in it is a pointer into an existing parent section (selectivity, leading column, expression match, statistics) plus planner links. A standalone article would repeat the parent. Keep it as the parent's new h2 and make it the first link in the companion list. If the h2 grows past about 800 words because the sargability catalogue (C6) is needed, move C6 into B1 and keep the checklist in the parent.

### B4. "Index types in PostgreSQL" (already exists)

`postgresql/indexes.astro` covers B-tree, GIN and BRIN; hash, GiST and SP-GiST have only the parent's table row and links to the manual, and exclusion constraints and GiST ranges have no investigation. A GiST/SP-GiST/hash chapter could be proposed to the planning skill, but it belongs to the PostgreSQL group, not to a Companion to Indexes. Out of this commission.

### B5. "Statistics and the planner" (not proposed here)

`query-execution.astro` ("Planner estimates"), `slow-queries.astro` and `postgresql/query-execution.astro` already carry it from different sides; a fourth article would duplicate. If the user wants one place, a statistics article belongs to the performance group. The parent's job is to say statistics decide the choice, show the stale and skewed cases, and link.

## 7. Ranked by improvement to a professional reader

1. **C6 and F4/E3/E4: "When the database ignores an index"** (new parent h2). Every working engineer meets it weekly; the article currently teaches the mechanism but never connects "my index isn't used" to causes. Needs the C6 sargability catalogue (functions, casts, `LIKE`, `OR`) and engine-specific proofs.
2. **D1: "Indexing for a query"** (new parent h2). The design procedure is the article's keystone and it is absent. It turns Figures 7 and the history table into a method.
3. **G3-G5: index bloat and rebuilds.** Absent site-wide; high on-call value. Parent bridge h3 now; B2 companion.
4. **C9 and C11: indexing joins, foreign keys and pagination.** The opening promises joins and no section delivers; B1 companion, with a parent paragraph and links now.
5. **C3/B7: order without sorting; collation, DESC, NULL order** (h3 under Range scans).
6. **D4 and G8: redundant, duplicate and invalid indexes, and safe dropping.** Prevents the most common index sprawl.
7. **C5: `LIKE` prefix, collation and operator classes.** Part of B1 if built; a paragraph in the parent otherwise.
8. **E1/G7: statistics maintenance in all three engines.** Link plus a short paragraph.
9. **C7: combining indexes** (bitmap AND/OR, MySQL index merge).
10. **D8: key choice for key-ordered tables.**
11. **G6/G9/F6: rollout procedure, invisible and hypothetical indexes.**
12. B5, B6, G10, H2, I2 additions: sentence-level.

## 8. Proposed breakouts, listed separately

| Proposed companion | Parts | Direct readers | Needs |
| --- | --- | --- | --- |
| Indexing joins, sorting and pagination (B1) | C3, C6, C7, C9, C10, C11, D6, D10, H2 | Engineers writing a specific query | New sandbox lesson on the 60,000-order table; engine row-value syntax; `LIKE` operator class evidence; links to `large-results.astro` and `query-execution.astro` |
| Maintaining indexes: size, rebuilds and statistics (B2) | G3-G10, E1/G7 | On-call and platform engineers | Bloat experiment; rebuild locks per engine checked against manuals; links to `postgresql/row-versions.astro`, `slow-queries.astro`, `schema-changes.astro` |

Not proposed: a standalone "index not used" article (B3, kept as parent h2), a statistics article (B5, other group).

## 9. Evidence to collect before writing (all V until checked)

PostgreSQL 18: `REINDEX CONCURRENTLY` locks; `pgstatindex` and `pg_relation_size`; `pg_index.indisvalid`; `DROP INDEX CONCURRENTLY`; `text_pattern_ops`; BitmapAnd/BitmapOr plan names; `enable_seqscan`; autovacuum analyze scale factor; `maintenance_work_mem`; `amcheck`; HypoPG (extension). MySQL 8.4: invisible indexes (`ALTER TABLE ... ALTER INDEX ... INVISIBLE`); index merge `Extra` wording; `FORCE INDEX`; `OPTIMIZE TABLE` online behaviour for InnoDB; `innodb_stats_persistent`; `mysql.innodb_index_stats`; `sys.schema_redundant_indexes`; `CHECK TABLE`; prefix index limits (checked in `create-index` today: prefixes allowed; 3,072 bytes for DYNAMIC rows). SQLite: `INDEXED BY` and `NOT INDEXED`; `PRAGMA optimize`; the OR optimization (multi-index OR); `dbstat`; `REINDEX`; `PRAGMA integrity_check`. SQL Server: only if a clause is added; otherwise leave as is.
