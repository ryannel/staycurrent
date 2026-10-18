# Evidence for Indexes

Checked 15 October 2026. All external technical sources are the PostgreSQL 18
manual. The page is a working draft with noindex. Publication is not authorised.

## Primary sources and consequential claims

| Source | Used for | Boundary |
| --- | --- | --- |
| https://www.postgresql.org/docs/18/btree.html#BTREE-STRUCTURE | Root/internal/leaf pages, row references, page splits | Simplified figure is an invented eight-row tree, not a physical page dump |
| https://www.postgresql.org/docs/18/btree.html#BTREE-IMPLEMENTATION | Splits, version churn and cleanup | Does not claim every update rewrites every index or that every delete removes its entry immediately |
| https://www.postgresql.org/docs/18/indexes-intro.html | An additional access path and its maintenance costs | No claim that indexing changes logical query semantics |
| https://www.postgresql.org/docs/18/indexes-multicolumn.html | Leading equality/range access, later key checks, PostgreSQL 18 skip scan | Avoids the false absolute rule that an index is unusable without its first key |
| https://www.postgresql.org/docs/18/indexes-ordering.html | Ordered scan, backward direction, mixed directions, early LIMIT | SQL retains explicit ORDER BY, including order ID for ties |
| https://www.postgresql.org/docs/18/indexes-index-only-scans.html | Separate heap, covering INCLUDE, visibility map and heap fetches | Index Only Scan node does not promise zero heap accesses |
| https://www.postgresql.org/docs/18/indexes-bitmap-scans.html | Bitmap location collection and loss of index order; multiple-index combination | Does not imply every single-key lookup becomes a bitmap scan |
| https://www.postgresql.org/docs/18/indexes-partial.html | Subset indexes and planner predicate implication | No recommendation to build a partial paid index for this general screen; flags prepared-plan implication |
| https://www.postgresql.org/docs/18/routine-vacuuming.html | Upkeep, removed versions and visibility map | No production maintenance tuning prescription |
| https://www.postgresql.org/docs/18/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY | Ordinary live index build blocks writes, concurrent build has tradeoffs | Article DDL operates only on a temporary practice table |
| https://www.postgresql.org/docs/18/using-explain.html | Actual rows, loops, EXPLAIN ANALYZE execution, TIMING OFF, BUFFERS | Counters and timings are distinct; no fabricated plan costs |

These are reusable reference candidates for readers familiar with SQL. The B-tree
chapter is internals detail; the chapter 11 pages give more approachable design
rules. The plan manual is suitable after the article's local plan explanation.

## Executed evidence

Run from repository root:

```sh
node docs/article-work/indexes/build-experiment.mjs
node docs/article-work/indexes/verify.mjs
```

Installed package: `@electric-sql/pglite` 0.5.8. Engine reports PostgreSQL 18.3
on wasm32. In-memory PGlite, temporary table, UTC timezone, ordinary planner
settings, no planner methods disabled. `observed.json` stores complete JSON plans,
result rows, relation sizes and engine identification. Engine timings in the raw
plans are incidental observations, not publishable comparisons or benchmarks.

The verifier asserts the same ten order IDs through five states: primary key only,
customer index, composite index, covering before vacuum and covering after vacuum.
It checks baseline 59,985 rejected / 15 passing rows; customer bitmap's 60 candidate
rows and 45 rejected dates; removal of sort and ten output rows for the composite;
two pending candidates rejected for the paid-only variation; heap fetches 10 before
vacuum and 0 afterwards; and an index-only scan emitting 54,000 rows for the broad
sum. These are actual plan observations, not diagrams presented as benchmarks.

The covering-index table had 14,131,200 bytes, its additional covering index
2,998,272 bytes in this runtime. The primary-key index is separate and excluded.
The page rounds these values to 13.5 and 2.9 MiB and gives the setting.

The verifier executes the displayed write workload: 1,000 inserts, 200 amount
updates and 100 deletes. It asserts 60,900 remaining rows, the 200 corrected
amounts, and the newest history order 60041. It also runs the downloadable script
in a fresh PGlite session, separating VACUUM from implicit multi-statement
transactions. The download includes matching SQL assertions. Use `psql -f` or
individual statements with autocommit; VACUUM cannot run inside a transaction.

Temporary tables and PGlite do not establish physical storage latency, logging
cost, network latency, concurrent production write performance, or autovacuum
behaviour. The article explicitly tells the reader to test durable ordinary tables
and their actual prepared application queries for a deployment decision. The
benchmark outcome is intentionally not invented. The regular distribution also
does not demonstrate skew; representative large and small customers are part of
the proposed real workload validation.

## Media checks to complete

Author inspected the source values and mappings. Root/leaf example has eight index
entries and exactly the same eight table references. D/E/F occur on two table
pages. Composite excerpt dates follow the generator for customers 41, 42 and 43;
only customer 42 is highlighted. Both use theme-aware tokens and existing sketch
surfaces. The phone layout stacks child pages and retains readable labels instead
of shrinking the three-column illustration.

Parent batch owns independent first reading, technical/media review and rendered
light/dark desktop/phone inspection. Carry findings into a review record before
promoting the draft's editorial status.

## Coordinated review

The [batch review and verification record](../access-and-persistence/review.md)
records the independent readings, repairs, browser checks and final draft status.
The author-handoff notes above describe the earlier state before those checks.

## General rewrite, 17 October 2026

Commission: `general-rewrite-2026-10-17.md`. Primary documentation read on the day;
quotations paraphrased in the article. PostgreSQL measurements are unchanged and
still come from the sandbox lesson and `verify.mjs`; nothing was measured in
InnoDB, SQLite or SQL Server.

| Claim in the article | Source | Boundary |
| --- | --- | --- |
| InnoDB's table is its clustered index, usually the primary key; with no primary key it uses the first NOT NULL UNIQUE index, else a hidden row ID | MySQL 8.4, https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html | Hidden-ID case not taught in the article |
| Each secondary index record holds the primary key columns, used to search the clustered index; a long primary key enlarges secondary indexes | Same page | |
| Rows move on page splits, so a key rather than a page and slot is stored | Inference from the design; not stated in the manual | Stated in the article as the reason, not as a quotation |
| SQLite rowid tables are B-trees keyed by rowid; INTEGER PRIMARY KEY is the rowid; an index lookup is two binary searches; WITHOUT ROWID is a single B-tree keyed by the primary key | SQLite, https://www.sqlite.org/withoutrowid.html | |
| SQLite covers a query by adding columns to the index; covering index avoids the table search | https://www.sqlite.org/queryplanner.html, https://www.sqlite.org/optoverview.html (section 9) | The page says nothing on INCLUDE; the article says only that SQLite's documented example appends the column to the key |
| SQLite EXPLAIN QUERY PLAN wording: SCAN, SEARCH ... USING INDEX, USING COVERING INDEX | https://www.sqlite.org/eqp.html | Format may change between releases, as the page warns |
| MySQL EXPLAIN: type ALL, index, ref, range; Extra "Using index" for a covering index | MySQL 8.4 EXPLAIN Output Format | |
| MySQL EXPLAIN ANALYZE reports cost, rows, times and loops, and no page or buffer counts | MySQL 8.4 EXPLAIN page | "Not reported" in the table rests on the page not listing them |
| InnoDB updates clustered records in place; a changed secondary-index column delete-marks the old record and inserts a new one; a delete-marked record or a page changed by a newer transaction forces a clustered-index lookup instead of a covering answer | MySQL 8.4 InnoDB Multi-Versioning | An update that changes no indexed column leaving secondary indexes alone is an inference from "when a secondary index column is updated" |
| Changing a primary key rewrites its entry in every secondary index | Inference: each entry carries the key | Not quoted from the manual; the reviewer may prefer to cut it |
| InnoDB pages default to 16 KB; sequential inserts leave pages about 15/16 full, random inserts 1/2 to 15/16; non-spatial indexes are B-trees, spatial are R-trees | MySQL 8.4 Physical Structure of an InnoDB Index | The page ties the fill figures to the clustered index; the article applies them to a random primary key |
| MySQL skip scan range access exists, enabled by default, with restrictions; SQLite skip-scan needs ANALYZE and many duplicates in the leading columns | MySQL 8.4 Range Optimization; SQLite Query Optimizer Overview section 6 | Article says only "in some cases" |
| MySQL CREATE INDEX has no INCLUDE clause; ASC/DESC and functional key parts are supported; ALGORITHM and LOCK clauses set concurrency | MySQL 8.4 CREATE INDEX | |
| MySQL creates an index on a foreign key's referencing columns if none exists | MySQL 8.4 FOREIGN KEY Constraints | |
| SQLite supports partial indexes (since 3.8.0) | https://www.sqlite.org/partialindex.html | |
| SQL Server: clustered index stores rows in key order; no clustered index means a heap; a nonclustered row locator is a row pointer for a heap and the clustering key for a clustered table | Microsoft Learn, Clustered and Nonclustered Indexes (SQL Server 2025 view) | |
| PostgreSQL CLUSTER is one-time; later changes are not kept in order | PostgreSQL 18 CLUSTER | |
| Index entries hold no visibility information; the visibility map has one bit per heap page | PostgreSQL 18 Index-Only Scans and Covering Indexes | Unchanged from earlier evidence |

Not verified in a primary source: SQLite R-tree and full-text indexes being built-in
modules (stated in "Other index types" from knowledge; sqlite.org/rtree.html and
fts5.html would confirm); InnoDB FULLTEXT indexes are not mentioned in the article.
The change-buffer behaviour of InnoDB was read and deliberately left out: the
manual's default for `innodb_change_buffering` read ambiguously in the fetched text.

## Repairs after review, 17 October 2026

Sources fetched the same day.

| Claim added or changed | Source | Boundary |
| --- | --- | --- |
| MySQL Multi-Range Read collects keys from a secondary-index range scan, sorts them by row ID, then reads rows in that order; `Using MRR` in `Extra`; not used when the index covers | MySQL 8.4 Multi-Range Read Optimization | Applies to InnoDB and MyISAM |
| MySQL skip scan conditions: one table, index columns only, no GROUP BY or DISTINCT, equality on leading parts, a range on the next column | MySQL 8.4 Range Optimization | Article does not give the version |
| SQLite skip-scan needs ANALYZE; profitable at about 18 or more duplicates per leftmost value | sqlite.org/optoverview.html | |
| SQLite leaf pages have no pointers; interior pages hold the right-most pointer | sqlite.org/fileformat2.html | That SQLite returns to the parent for the next leaf is the accuracy reviewer's reading, not stated |
| SQL Server index pages on each level are linked in a doubly linked list | Microsoft index architecture and design guide | |
| InnoDB leaf pages are linked | Not found in the MySQL 8.4 manual (glossary searched); accuracy review asserted it from the page format | Unverified in primary docs; the article states it |
| SQL Server filtered indexes; computed columns can be index keys | Microsoft Create Filtered Indexes | "Indexes a computed column" paraphrases "reference a computed column in the key or includes" |
| SQLite indexes on expressions; the planner needs the same expression ("does not do algebra") | sqlite.org/expridx.html | |
| SQLite partial indexes | sqlite.org/partialindex.html | MySQL having no partial indexes rests on its CREATE INDEX syntax having no WHERE clause |
| SQLite allows one writer at a time (RESERVED lock) | sqlite.org/lockingv3.html | "A build holds up other writers" is the consequence for CREATE INDEX, not quoted |
| InnoDB secondary index creation is in place, allows concurrent DML, no rebuild | MySQL 8.4 InnoDB Online DDL Operations | Behaviour of LOCK=NONE when impossible not verified; article says only the clauses "let you require" it |
| `sys.schema_unused_indexes` lists indexes with no events; meaningful only after representative uptime | MySQL 8.4 sys schema documentation | "SQLite keeps no usage statistics" is an absence in its docs, not a quotation |
| MySQL EXPLAIN: `const`, `eq_ref`; `Using where`; `Using index condition` | MySQL 8.4 EXPLAIN Output Format | "Using index condition ... tests on index entries before reading rows" paraphrases the doc |
| SQL Server `SET STATISTICS IO` reports logical and physical reads and scan count | Microsoft SET STATISTICS IO | |
| SQL Server `INCLUDE` for nonkey columns | Microsoft Clustered and Nonclustered Indexes | |
| InnoDB FULLTEXT is an inverted index; SQLite R-tree and FTS are optional virtual-table modules | Accuracy review citing MySQL InnoDB full-text and sqlite.org rtree and fts5 | Not fetched by the writer |
| SQLite and SQL Server need no visibility condition for covering | Accuracy review; SQLite queryplanner says the table is never consulted once columns are in the index | SQL Server and SQLite MVCC behaviour not read directly |
| PostgreSQL CREATE INDEX CONCURRENTLY: two table scans, waits for transactions, invalid index on failure, cannot run in a transaction block | PostgreSQL 18 CREATE INDEX | "Needs a second scan to catch up" paraphrases the two scans |
| HOT: columns of summarizing indexes (BRIN) do not count; from PostgreSQL 16 | PostgreSQL 18 Heap-Only Tuples; 16.0 release notes ("Allow HOT updates if only BRIN-indexed columns are updated") | |
| 600-update HOT result came from a separate ordinary table with fillfactor 90, checked in `verify.mjs`, not the sandbox lesson | `verify.mjs` per accuracy review | I did not re-run it |
| Planner estimate 2,475 sequential against bitmap just under or over it at 500 and 550 | Unchanged earlier evidence | Moved to the PostgreSQL article |

### Flow pass, 17 October 2026
Nothing newly fetched. Reasoned, not sourced, and worth a reviewer's eye: (a) the worked conversion of the 62-page lookup (2 index pages plus 60 descents, upper pages shared and already in memory after the first) is an argument from the design; (b) "SQLite keeps the path it came down, so moving to the next leaf is not a new search" follows the accuracy review's reading of the file format; (c) "a SQLite reader never sees index and table at different versions" is a reason supplied in review, not read in the SQLite docs. A MySQL EXPLAIN sample was not added: no MySQL is available here and the Extra values could not be checked.

## Parent deepening: ignored indexes, design procedure, ordering, 17 October 2026

Measured on a local PostgreSQL 18.6 (Homebrew) server, database in `en_US.UTF-8` (libc), session time zone UTC, 60,000-row `orders` table (1,936 heap pages; the sandbox's `index_orders` plus `email` and nullable `shipped_at`). Scripts: `ignored-experiment.sql` (PostgreSQL) and `ignored-experiment-sqlite.sql` (SQLite 3.51.0). Not run in PGlite; the sandbox lesson does not repeat these. No MySQL server was available; every MySQL statement rests on the 8.4 manual pages below.

| Claim | Evidence | Boundary |
| --- | --- | --- |
| `status='paid'` (80%) is a Seq Scan, 1,936 buffers, 12,000 rows removed; `'pending'` (20%) is a Bitmap Heap Scan, 399 heap blocks plus 12 index pages; forced (seqscan and bitmapscan off) index scan read 1,562 hit + 40 read | q1 | Plain `enable_seqscan=off` alone was not tested |
| Index `(customer_id, placed_at)` only, query on a 30-minute `placed_at` window: Index Scan, `Index Searches: 1`, 242 buffers (10 hit, 232 read); index on `placed_at`: 5; seq scan: 1,936; the composite index is 234 pages | q1, extra run | PG 18 did not skip-scan here |
| `lower(email)=` Seq Scan 1,936; with index on `lower(email)` 2 index + 60 heap pages | q1 | |
| `customer_id = 42.0` plans `(customer_id)::numeric = 42.0` Filter, Seq Scan; `42::bigint` and `varchar` constant use the index; `text = integer` is an error | q1 | |
| `LIKE 'User42@%'`: Seq Scan with default opclass in en_US; `text_pattern_ops` Index Scan with `~>=~`/`~<~`, 62 buffers; `COLLATE "C"` index works; `%@…` and `ILIKE` Seq Scan; explicit `>=`/`<` range uses default index | q2; PG 18 opclass docs | pg_trgm indexing ILIKE and leading wildcards is from knowledge, not tested |
| OR: same column folds to one scan; two indexed columns BitmapOr; unindexed branch Seq Scan; AND of customer and status BitmapAnd (2 + 12 index pages) | q2 | |
| Ordering: backward scan serves DESC; `DESC NULLS LAST` on plain index sorts; index `(shipped_at DESC NULLS LAST)` serves it; `ORDER BY customer_id, placed_at DESC` over `(customer_id, placed_at)` used Incremental Sort on the customer index; no LIMIT planned Seq Scan + Sort; `COLLATE "C"` ordering sorts; first value differs between C and en_US | q3; PG 18 indexes-ordering | |
| Stale statistics: `rows=1` estimated, 40,000 actual (index scan 723 buffers vs seq scan 1,552); after ANALYZE rows=39,687 | q4, q6 | Plan did not flip; stated honestly |
| Failed `CREATE UNIQUE INDEX CONCURRENTLY` leaves `indisvalid=f`, shown `INVALID` in `\d`; `DROP INDEX CONCURRENTLY` removes it | q6; PG 18 CREATE INDEX (invalid index still costs update overhead, ignored for queries) | |
| Delete 90% scattered: index 234 and pkey 166 pages unchanged after DELETE and after VACUUM; REINDEX gives 25 and 19; heap stays 1,984 (the copy used for this test) | q7 | A contiguous 90% delete followed by VACUUM also left 234/166 |
| PostgreSQL deletes a B-tree page only when completely empty; does not merge partly full pages | nbtree README (REL_18_STABLE) | Source, not manual |
| InnoDB merges a page with a neighbour below MERGE_THRESHOLD (default 50) | MySQL 8.4 index-page-merge-threshold | |
| `uuidv7()` exists; `autovacuum_analyze_scale_factor` 0.1, threshold 50 | `psql` on 18.6 | |
| SQLite: LIKE on a BINARY column SCAN, GLOB SEARCH, NOCASE index SEARCH; text column `= 42` SEARCH; `lower(email)` SCAN vs expression index SEARCH; OR with indexes MULTI-INDEX OR, with unindexed branch SCAN; AND of two indexes uses one; `ORDER BY a, b DESC` over `(a,b)` USE TEMP B-TREE FOR LAST TERM OF ORDER BY; NOCASE order on BINARY index temp b-tree; partial unique index allows reuse after soft delete | sqlite3 3.51.0 EXPLAIN QUERY PLAN; sqlite.org optoverview | `INDEXED BY` with an index not usable for the query did not error (it scanned the named index); NULLS FIRST on DESC not asserted |
| MySQL: string column vs number cannot use index; utf8mb4 vs latin1 columns preclude index; LIKE constant without leading wildcard is a range condition; index merge Using intersect/union/sort_union; invisible index syntax and `use_invisible_indexes`; FORCE INDEX semantics and deprecation note; ORDER BY index needs same homogeneity of directions; NULLs first in ASC, last in DESC; `sys.schema_redundant_indexes` with `sql_drop_index`; persistent stats on by default, auto recalc after >10% rows, `ANALYZE TABLE` | MySQL 8.4 manual: type-conversion, mysql-indexes, range-optimization, index-merge-optimization, invisible-indexes, index-hints, order-by-optimization, working-with-null, sys-schema-redundant-indexes, innodb-persistent-stats | Fetched through a summarising tool; not run on a server |
| SQLite `PRAGMA optimize` runs ANALYZE where useful; advised before closing short connections and after CREATE INDEX | sqlite.org/pragma.html | |

Not verified: MySQL 8.4 mixed-direction DESC index behaviour on a server; the `schema_redundant_indexes` rules; the "UUID 36 bytes as text, 16 as binary" sizes (arithmetic).

## Style pass, 18 October 2026

Every number on the generated table now comes from one table (`setup.sql`: 60,000 orders, 1,725 pages, with `email` and a shorter `note`), measured in PGlite 0.5.8 by `verify.mjs` on 18 October and recorded in `observed.json`. The 18.6 server figures above (1,936 pages) are replaced in the article by the PGlite figures on the unified table, except the `LIKE` and collation results, which need `en_US`.

| Claim | Evidence | Boundary |
| --- | --- | --- |
| `status='paid'` Seq Scan 1,725; `'pending'` Bitmap Heap Scan 365 table + 12 index pages; forced index scan 1,426 | `verify.mjs` status block | |
| `customer_id = 42 AND status = 'pending'` BitmapAnd, 2 + 12 index pages, 12,000 status entries, 12 rows; `customer_id = 42 OR order_id = 7` BitmapOr; OR with unindexed `total` Seq Scan 1,725 | `verify.mjs` combining block | |
| After VACUUM, updating order 59040 (customer 41, same heap page as one of customer 42's ten rows) gives the history query `Heap Fetches: 1`, 5 pages | `verify.mjs` neighbour update | |
| Primary key inserted in order: 166 pages (164 leaves, avg 366.9 entries); inserted `ORDER BY random()`: 219 to 244 pages over nine runs, most near 225 | `verify.mjs` splits; scratch `rand.mjs` | Random count varies by run; the article says "about 225" |
| InnoDB leaves 1/16 of a page free; sequential inserts leave pages about 15/16 full, random ones 1/2 to 15/16 | MySQL 8.4 innodb-physical-structure | Figure 10 uses these fill levels on invented keys |
| PostgreSQL B-tree fillfactor defaults to 90, applied on initial builds and when extending the index at the right | PostgreSQL 18 CREATE INDEX | |
| Deleting two rows in three (scattered): 20,000 rows left, primary key 166 pages after VACUUM, 0 deleted pages, 57 after REINDEX. Deleting the oldest 40,000: 109 of 164 leaves deleted, file 166, 57 after REINDEX | `verify.mjs` deleted block, pageinspect | |
| Superseded. `(customer_id, placed_at)` only, 30-minute window: Index Scan, `Index Searches: 1`, 234 local pages (the whole index) for 30 rows; index on `placed_at` 5 pages; with `customer_id = 42` added, 3 pages | `verify.mjs` leading block | PGlite 18.3 did not skip-scan here either. Replaced by the customer 650 row and the leaf-page row under the repairs below: customer 42 has no order in the window, and the 234 pages are not the whole index |
| `email = 'Shopper0042@Example.com'` 62 pages; `lower(email) = …` Seq Scan 1,725 | `verify.mjs` wrapped block | |
| WAL for 10,000 inserts: 3.3 MB (primary key only), 4.2, 5.6, 6.7 MB (four indexes) | `verify.mjs` WAL block | Rounded to 0.1 MB |
| Covering index grows from 2.3 to 2.9 MiB with `INCLUDE (total)` | `verify.mjs` sizes | |
| SQL Server: a primary key creates a clustered index by default when none exists; a foreign key does not create an index; a unique constraint allows one NULL per column; filters apply to unique indexes but not to unique constraints; expression indexes go through computed columns | learn.microsoft.com primary-and-foreign-key-constraints, unique-constraints-and-check-constraints, create-filtered-indexes ("can be applied to indexes with the UNIQUE property"), indexes-on-computed-columns | "A filtered unique index with `WHERE email IS NOT NULL` allows any number" follows from rows outside the filter not being in the index, so they cannot conflict; the technical review of 18 October confirmed the reading |
| InnoDB secondary index creation is in place and permits concurrent DML | MySQL 8.4 innodb-online-ddl-operations | |
| MySQL creates an index on the referencing columns of a foreign key if none exists | MySQL 8.4 create-table-foreign-keys | |
| SQLite does not require child-key indexes and advises creating them | sqlite.org/foreignkeys.html | |

### Repairs after the 18 October reviews

All PGlite rows were checked by `verify.mjs` on 2026-10-18 and are in `observed.json`.

| Claim | Evidence | Boundary |
| --- | --- | --- |
| Page counts are local buffers only. The reversed index read 54 local pages; its plan also shows 3 shared catalog hits, which earlier counts included (57) | `verify.mjs` (`pages = local`); PGlite and the reviewer's 18.6 run agree on 54 + 3 | The depth table uses ordinary tables and counts shared pages |
| Forced index scan for `status = 'paid'`: 1,426 pages, of which 1,384 are distinct table pages; the rows come back in nondecreasing page order, first page 29; estimated cost 5,644 to 5,699 against the sequential scan's fixed 2,475; `status` correlation 0.635 | `verify.mjs` status block; reviewer's 18.6 run (first ctids (29,14), (29,15), (29,16)) | Estimates move with ANALYZE's sample; the article says "more than twice" and "about 0.6" |
| B-tree logical duplicates are sorted in heap TID order | nbtree README (REL_18_STABLE): "Logical duplicates are sorted in heap TID order." | The README does not give the version; the reviewer dates it to PostgreSQL 12 |
| `order_id = 7 AND status = 'pending'`, with the status index present: Index Scan on `index_orders_pkey`, status under Filter, 1 row, 3 pages | `verify.mjs` combining block; lesson step 7 | |
| The 30-minute window holds orders 44,640 to 44,669, customers 641 to 670. Customer 650 with the window, through `(customer_id, placed_at)`: Index Scan, 1 row, 4 pages. Customer 42 returns nothing there | `verify.mjs` leading block; lesson step 21 | |
| Shuffled copy: 1,715 pages; bitmap scan at 500 read all 1,715 (`Heap Blocks: exact=1715`); still a sequential scan at 550. Correlation of `customer_id`: 0.003 in the copy, under 0.1 in absolute value in the original | `verify.mjs` shuffled block; reviewer's PGlite and 18.6 runs | Extra run, not in the lesson or the download; named under "Where the numbers come from" |
| Stale statistics, on temporary tables: `kind = 'new'` estimated `rows=1`, actual 40,000, Index Scan 723 pages, forced sequential scan 1,552. Join to `deliveries` (90,000 rows, 842 pages): Nested Loop with 40,000 inner index searches, 120,723 pages. After `ANALYZE events`: estimate 39,867 to 40,104; the single-table plan unchanged at 723; Hash Join, 1,565 pages | `verify.mjs` stale block; lesson steps 24 and 25; `experiment.sql` | Replaces the 18.6 server test of 17 October, which gave the same 723 and 1,552. Autovacuum never processes temporary tables, so the download reproduces it on a server |
| Mixed-direction order over `(customer_id, placed_at)`: Incremental Sort over that index; no `LIMIT`: Seq Scan and Sort | `verify.mjs` leading block; lesson step 22 | Now in the lesson as well as the download |
| Numbers still outside the lesson: oldest-40,000 delete (109 of 164 leaves deleted, file 166, 57 after REINDEX); WAL for two and three indexes (4.2 and 5.6 MB); shuffled copy; depth table | `verify.mjs` deleted, WAL, shuffled and depth blocks | Named in "Where the numbers come from" |
| `en_US.UTF-8` re-measurement on the unified table: `LIKE 'Shopper0042@%'` Seq Scan of 1,725 pages; with `text_pattern_ops`, 62; `ORDER BY email LIMIT 10` uses the index; `COLLATE "C"` adds a Sort; `'Zoe'` sorts before `'adam'` under `"C"` and after it under `en_US` | My 18.6 server run during the style pass; the technical review's independent 18.6 run on 18 October | Server only; PGlite's database uses the C collation |
| SQLite covering index: once the columns are in the index, the table is never consulted | sqlite.org/queryplanner.html, section 1.7 ("SQLite never needs to consult the original table") | Documented, not inferred, as the earlier row (accuracy review) recorded |
| MySQL covering example `(customer_id, placed_at, order_id, total)`: InnoDB appends the primary key after the declared columns, so `(customer_id, placed_at, total)` would order ties by `total` and not serve `ORDER BY placed_at DESC, order_id DESC` without a sort | MySQL 8.4 innodb-index-types; technical review | |
| The 234 pages of the 30-minute window are 232 index pages (the root, one of two branch pages and all 230 leaf pages) and 2 table pages, 1282 and 1283. The index file is also 234 pages, counting its metapage, so the article says "every leaf page of the index, 234 pages in all" | Scratch `leafcount.mjs` with pageinspect (`bt_metap` level 2; `bt_page_stats`: 230 leaf, 2 internal, 1 root); technical recheck of 18 October | |
| Hash join after `ANALYZE`: 1,565 pages = 842 for the `deliveries` table, read once, plus 723 for the new events read once through the `kind` index | `verify.mjs` stale block (`deliveriesPages` 842, single-table 723, `joinAfter` 1,565); technical recheck | |
