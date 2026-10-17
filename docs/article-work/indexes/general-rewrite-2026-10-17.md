# Indexes: from a PostgreSQL article to a general one

Commissioned 17 October 2026 after the user observed that the general relational
Indexes deep dive "in some ways has the same problem" as Storage: it teaches
PostgreSQL's design as if it were how relational databases index data.

## What the reader came for
The reader knows tables and simple filters and may meet indexes here for the first
time. They use some relational database: PostgreSQL, MySQL, SQLite, SQL Server.
They should finish able to predict what an index saves and costs in whichever one
they use, and recognise which details of the worked example are PostgreSQL's.

## What the user has already approved (keep)
The opening's approach (what an index is and what it is for, before mechanism),
the figures and their scrubber, the "Other index types" overview, the sandbox
lesson `indexes` (src/lib/sql-lessons/indexes.ts, the single source of the
article's SQL) and its measured numbers, the contents and ending shape. Change these
only where they state PostgreSQL behaviour as universal.

## The problem
One PostgreSQL design assumption runs through the article: the table is a separate,
unordered heap, and each index entry points into it with a TID (page and slot).
In InnoDB, and in SQLite's ordinary rowid tables, the table itself is a B-tree
ordered by its key; a secondary index entry carries that key, and finding the row
is a second descent. This changes the explanation of row location, the cost of
scattered fetches, covering indexes (InnoDB secondary entries always carry the
primary key; PostgreSQL index-only scans depend on the visibility map) and write
costs (PostgreSQL's HOT; InnoDB leaves secondary indexes untouched when no indexed
column changes). EXPLAIN exists everywhere with different output.

## The job
- Name the shared mechanism in general terms. "Row location" or "row reference",
  not "TID", in headings and the main thread; TID can appear as PostgreSQL's name.
- Teach both table organisations where they change the reader's prediction: a heap
  with row pointers (PostgreSQL; SQL Server heaps) and a table clustered on its key
  (InnoDB; SQLite rowid tables; SQL Server clustered indexes). Add one small,
  static code-native figure for the clustered case beside the existing heap figure,
  following docs/illustration-style.md and the existing indexes figure components.
- Keep PostgreSQL 18 as the worked example and measurement engine, and say so where
  the reader first meets measured numbers.
- Move PostgreSQL-only detail to `src/pages/learn/databases/relational/postgresql/indexes.astro`
  (Indexes in PostgreSQL), with a one-line pointer from the general article:
  planner cost settings (random_page_cost, seq_page_cost), the visibility map's role
  in index-only scans, HOT's effect on index maintenance, CREATE INDEX CONCURRENTLY,
  and any operator-class or access-method depth. Add these to the PostgreSQL article
  as real explanation in its voice and structure, not a pasted appendix. Keep the
  PostgreSQL article's own argument intact.
- Keep Sources and further reading last; add primary sources for InnoDB and SQLite.

## Evidence
Use primary documentation, with versions: MySQL 8.4 Reference Manual (InnoDB
clustered and secondary indexes, covering, change buffering if relevant, EXPLAIN),
SQLite documentation (rowid tables, WITHOUT ROWID, query planner, covering indexes,
EXPLAIN QUERY PLAN), PostgreSQL 18. Record claims and sources in
docs/article-work/indexes/evidence.md under a dated heading.

## Boundaries
Not a product comparison article; not every engine's every variant. Mention SQL
Server or Oracle only where they make a distinction clearer. Do not add new sections
for their own sake; the heading tree should still read as one argument.

## Handoff (writer, 17 October 2026)

### What changed in the general article
- Opening, page-count paragraph and example note no longer say "PostgreSQL" as if it were the only engine; the example note says PostgreSQL 18 is the worked example and every measurement comes from it. TitleLine version is now "PostgreSQL 18, with InnoDB and SQLite comparisons". Description updated.
- "Index entries and TIDs" is now "Index entries and row locations". It teaches the heap and TID design first (Figure 2 unchanged), then a new h3 "Tables stored in key order" (InnoDB clustered index, SQLite rowid and WITHOUT ROWID, SQL Server clustered tables), with new static Figure 3 (`ClusteredFigure.astro`): customer 42's four entries each starting a second search of the table's tree. It lists three consequences (single search by own key, key copied into every other index, random keys split table pages) and notes PostgreSQL's CLUSTER is one-time. The old InnoDB aside is gone.
- Figures renumbered 1 to 8 in page order (covering figure removed, clustered added).
- Selectivity: the three routes are framed as "every database has two, PostgreSQL adds the bitmap scan"; the random_page_cost paragraph is cut to one sentence plus a link.
- Composite: skip scan mentions MySQL and SQLite.
- Covering: rewritten around columns and trust; names the plan wording in all three engines; no INCLUDE in MySQL; key-ordered tables already carry the primary key; InnoDB falls back to the clustered record; PostgreSQL's visibility map is one sentence plus a link. Measured numbers (13 to 4 pages, 2.9 against 2.3 MiB) kept, labelled PostgreSQL.
- Kinds: partial (PostgreSQL, SQLite), expression (MySQL functional key parts), InnoDB's primary key is the table, MySQL auto-indexes foreign keys.
- Other index types: one sentence on what other engines offer; the clustered-index paragraph removed (taught earlier).
- Write costs: InnoDB update behaviour added; page-split section gains the sequential against random key point; HOT section replaced by a pointer; CONCURRENTLY becomes "Building an index on a live table" with a pointer and MySQL's ALGORITHM/LOCK; unused-indexes note says each engine has its own statistics.
- EXPLAIN section: states the commands in the three engines and adds a table of equivalent terms (route, covering, pages read).
- Sources: added InnoDB, SQLite, SQL Server and CLUSTER; removed HOT, CREATE INDEX and Query Planning entries that moved.

### What moved to the PostgreSQL article
In `postgresql/indexes.astro`: h3 "What the planner charges for a page read" (`#cost`, seq_page_cost and random_page_cost); new h2 "Index-only scans and the visibility map" (`#index-only`) with the existing CoveringFigure (now Figure 1 there) and the measurements; h3 "Heap-only tuple updates" (`#hot`) with the 600-update measurement; h3 "Building an index while writes continue" (`#concurrently`). A pointer paragraph to the general article was added to its opening. Operator-class and access-method depth was already there; nothing moved.

### Uncertain claims (see evidence.md)
- Rows moving on page splits as the reason a key is stored, and "changing a primary key rewrites every secondary entry", are inferences, not manual quotations.
- "MySQL EXPLAIN ANALYZE reports no page counts" rests on the manual page not listing them.
- SQLite R-tree and full-text modules, stated from knowledge, not fetched.
- The InnoDB 15/16 fill figures are the manual's wording about the clustered index; the article applies them to a random primary key.
- I did not run the sandbox lesson or `verify.mjs`; PostgreSQL numbers are untouched.

### Left for review
- Decision to move the covering/visibility-map figure out of the general article. It followed the brief's instruction to move the visibility map, but the user approved that figure; reverse by restoring it to the covering section if preferred.
- Whether the PostgreSQL article's new sections suit its "derive from information stored" voice; they are shorter and more procedural than its GIN and BRIN sections.
- Selectivity and write-cost prose still use PostgreSQL measurement language ("bitmap heap scan", "write-ahead log") as the labelled example.
- I did not run `pnpm build` or `pnpm check`; `pnpm test` passes. Checked the new figure in the dev server at desktop and 375px, dark theme (paper stays light, as in the other figures); figure labels run 1 to 8 in the rendered HTML. Light theme, the PostgreSQL article's Figure 1 rendering and the site check are unchecked.

## Handoff: review repairs (writer, 17 October 2026)

`pnpm build` passes with the site check clean. I looked at Figure 3 in the built site.

Done, by coordinator item:
1. Entries section: new h3 "Tables stored as a heap" beside "Tables stored in key order"; page split defined where it first appears.
2. Page-count note after the key-order material: the counts are PostgreSQL's, Figures 4 to 7 draw a heap, and each table page becomes a descent in a key-ordered table. The example note says MySQL and SQLite do not report pages. I did not add "(heap layout)" to figure captions.
3. Covering split by engine; version problem in one concrete step before the visibility map; SQL Server INCLUDE named; the second condition attributed to PostgreSQL and, with exceptions, InnoDB.
4. Selectivity: MRR named as the bitmap scan's counterpart; InnoDB and SQLite choose by estimate; last paragraphs reduced to the claim, the advice and the one piece of evidence (the shuffled copy). Cost-unit detail now in the PostgreSQL `#cost`.
5. Range: leaf links by engine (SQLite goes through the parent); MRR as the counterpart of the re-sort.
6. Composite: leftmost-prefix rule first, then skip scan with real conditions, no "in some cases"; the 57-page comment.
7. Kinds: h3s; SQL Server filtered indexes; MySQL has no partial indexes; SQLite and SQL Server expression equivalents; plain-words time-zone reason; reasons for unique and foreign-key indexes.
8. Other index types corrected.
9. Write costs: InnoDB wording, redo log, first aid moved to the PostgreSQL article, one-line reason beside the HOT pointer. I added no SQLite update claim (unverified).
10. Live builds: InnoDB in place by default; SQLite one writer; SQL Server left out.
11. Unused indexes: sys.schema_unused_indexes and the uptime caveat; SQLite keeps none.
12. EXPLAIN: const and eq_ref, a Using where and Using index condition row, SQLite's parenthesised terms, SET STATISTICS IO in a clause; dropped "every major database".
13. TitleLine and sources lead-in mention SQL Server; InnoDB no-primary-key case; line 66 cited once; opening wording fixed.
Figure 3 now draws root and branch chips on each arrow and has a visually hidden sentence per row.
PostgreSQL article (14 to 19): restructured writes (HOT, GIN and BRIN maintenance, concurrently, closing h3); `#cost` follows the broad-request paragraph with a derivation; concurrently derived, with the transaction-block limit; covering measurements live only there (plus autovacuum and writes clearing bits) and the general article keeps a pointer; history query defined and the figure's result read; HOT provenance and BRIN-since-16 added.

Declined or doubtful:
- InnoDB leaf-page links are asserted by the accuracy review but I could not find them in the MySQL 8.4 manual; the article states them.
- The "SQLite and SQL Server need only the columns to cover" claim and the InnoDB FULLTEXT and SQLite module wording rest on the accuracy review, not my own fetch.
- I removed the generated-table covering numbers from the general article as asked, which also drops the 13 to 4 pages result the user had approved there.
- A static `python3 -m http.server 4999` over `dist/` is still running from my check; I did not stop it.
