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
