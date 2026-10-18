# Indexes restructure, 18 October 2026

Carried out the verdict in `docs/article-work/depth-derivation-2026-10-17/derived/indexes-comparison.md`
against the pages as they stood after the 18 October style pass. The plan being executed is the
`## Indexes` section of `docs/coverage/relational.md`, written first.

## Reading times

| Article | Before | After |
|---|---|---|
| `indexes` (deep dive) | 39 min | 34 min |
| `indexing-queries` (companion) | 29 min | 20 min |
| `maintaining-indexes` (companion) | 28 min | 16 min |
| Family | 96 min | 70 min |

Measured from the dev server's TitleLine (265 words a minute plus 12 s a figure). The consolidated
plan was about 48 min and the comparison expected 60 to 70 after repair. The family lands at the top
of that range: the plan had no SQL Server coverage, and the companions keep runnable SQL, which the
counter reads as prose. Sources lists account for about 3.5 min across the three.

## Decisions

- **Two companions, not one.** The plan merged diagnosis and operations into one companion.
  Kept separate because the readers arrive with different questions at different moments ("why
  isn't my index used?" with a slow query in hand; "can I drop this?" or "why is this index so
  big?" during operations work). A merged page of about 36 min would bury the diagnosis under
  rebuild and drop procedures. Maintaining became a short companion; Indexing queries took the
  diagnosis.
- **Indexing queries retitled** "Indexing queries: diagnosis and patterns" (slug kept), because the
  page now leads with the question readers arrive with.
- **Layer 3 left the deep dive.** "When the database ignores an index" (`#ignored` and its six
  h3s) moved whole into the companion's `#diagnosis`, merged with the companion's old "Conditions
  an index cannot see through". LeadingFigure moved with it (now Figure 1 there; the deep dive's
  figures are 1 to 11).
- **The three fates got a home in the deep dive** (`#fates`, inside `#composite`), with the
  paid-only query moved there from `#check` and a measured fix. This is the plan's ability 2 and
  the comparison's top gap.
- **One home per part.** Combining indexes stays in the deep dive (`#combining`); the companion's
  `#and` folded into the optional-filters pattern as one measured comparison. The wrapped column,
  LIKE, statistics and foreign keys each have one teaching home now (companion `#bare-column`,
  `#like`, `#stale`, `#foreign-keys`), with a sentence and link in the deep dive. Deleted-row size
  is taught in the deep dive `#deleted-rows`; Maintaining opens with a reminder and link.

## What moved where

| From | To |
|---|---|
| `indexes#ignored` (symptom table, selectivity, leading column with Figure 12, wrapped column, LIKE, OR, stale statistics, proving) | `indexing-queries#diagnosis` and its h3s |
| `indexes#check` cross-engine EXPLAIN table, MySQL handler counters | `indexing-queries#plans` (now four engines with SQL Server) |
| `indexes#check` paid-only residual paragraph | `indexes#fates` |
| `indexing-queries#page-index`, `#offset-cost`, `#keyset-index`, `#keyset-traps` (offset cost table, row comparison per engine, mixed directions, NULL sort column) | `large-results#page-cost` (new h3 in `#work`); a two-paragraph `#paging` stays in the companion |
| `indexing-queries#like` PostgreSQL detail (442/16 table, `text_pattern_ops`, `COLLATE "C"`, `pg_trgm`) | `postgresql/indexes#like` (new h3 in `#operators`); a cross-engine paragraph stays |
| `maintaining-indexes#stats` (all four h3s) | `query-execution#refresh` (new h3 in `#estimates`); the stale-statistics example stays in the companion `#stale` |
| `maintaining-indexes#reuse`, `#updates`, `pgstatindex` detail, `#reindex` lock bullets, waiting query, `_ccnew`/`_ccold`, `VACUUM FULL`/`pg_repack`, build settings | `postgresql/indexes#bloat` (new section: `#reuse`, `#churn`, `#pgstatindex`, `#reindex`) |
| `indexing-queries#tenants` | Folded into `#limit-trap` (a paragraph keeps the id) |

## What was cut and why

- The deep dive's PostgreSQL access-method table: `#types` is now problem-first across engines,
  with links to the PostgreSQL series, which owns GIN, GiST, BRIN and extensions.
- The companion's grouping and `DISTINCT` discussion beyond the latest-row-per-group pattern, the
  `IN`-list measurement and the long MySQL loose-index-scan paragraph: reference detail that
  changed no decision.
- Maintaining's SQLite `REINDEX` locking test and the InnoDB `MERGE_THRESHOLD` trade paragraph:
  shortened to a sentence each.
- Repeated build-locking prose: the deep dive's `#upkeep` keeps one short paragraph per engine;
  Maintaining `#build` has the operational detail.

## What was added, with sources

- Deep dive opening: two layer-1 sentences (conditions and order line up from the first column,
  few enough rows match, the planner decides from estimates). Opening exemplar changed by one
  paragraph split into two.
- `#key-order`: SQLite and SQL Server cluster too; SQL Server's primary key creates a clustered
  index by default (Microsoft, Primary and foreign key constraints).
- `#fates`: the three fates with the measured pair below; PostgreSQL docs, Multicolumn Indexes
  ("limit the portion of the index that is scanned" / "checked in the index"); MySQL Index
  Condition Pushdown; SQL Server Seek Predicates and Predicate.
- `#kinds`: SQL Server allows one NULL in a unique index, and a filtered unique index allows the
  rest (Microsoft, Unique constraints; Create filtered indexes). InnoDB creates the foreign-key
  index; the others don't.
- `#writes` and `#splits`: link to Storage `#fill-factor`; index fill factor (PostgreSQL
  CREATE INDEX `fillfactor`, B-tree default 90; SQL Server FILLFACTOR and InnoDB
  `innodb_fill_factor` apply at build or rebuild; Microsoft advises the default except for
  split-heavy random keys).
- `#upkeep`: build indexes after a bulk load, then ANALYZE (PostgreSQL 18 Populating a Database
  §14.4.3, §14.4.8; MySQL Sorted Index Builds); SQL Server `ONLINE = ON` by edition (Microsoft,
  Perform index operations online).
- Companion `#plans`: SQL Server column (Index Seek/Scan, Key Lookup/RID Lookup, Seek Predicates
  against Predicate, SET STATISTICS IO).
- Companion `#types`: SQL Server `nvarchar` parameter against a `varchar` column converts the
  column by data type precedence, plan shows `CONVERT_IMPLICIT` and a scan (Microsoft, Data type
  precedence; MSSQLTips and SQLServerCentral write-ups). JDBC `sendStringParametersAsUnicode`
  (Microsoft, JDBC connection properties) and .NET `AddWithValue` inference.
- Companion `#parameters`: PostgreSQL custom plans for five executions then generic if not
  costlier (PREPARE); SQL Server parameter sniffing; filtered index not used with a parameter or
  local variable, fixed by `OPTION (RECOMPILE)` (Tim Chapman, "The Pains of Filtered Indexes";
  Microsoft, Query hints).
- Companion `#limit-trap`: ORDER BY with LIMIT walking the wrong index, measured below; MySQL's
  `prefer_ordering_index` switch (Switchable optimizations).
- Companion `#foreign-keys`: InnoDB locks every scanned row when no index fits (MySQL 8.4,
  Locks set by different SQL statements: "every row of the table becomes locked").
- Companion `#optional-filters`: the catch-all predicate, measured below; remedies per
  Sommarskog, "Dynamic search conditions in T-SQL".
- Companion `#soft-delete`, `#case`, `#queue`: SQL Server filtered unique index, case-insensitive
  default collations, `READPAST`; PostgreSQL gathers expression statistics only on ANALYZE.
- Maintaining: SQL Server throughout. `sys.dm_db_index_physical_stats` density; REORGANIZE
  against REBUILD, online by edition; rebuild gains often come from the statistics refresh, look
  at density before fragmentation (Microsoft, Optimize index maintenance);
  `sys.dm_db_index_usage_stats` emptied at restart and on detach (Microsoft); missing-index
  suggestions are not prescriptions, give no column order, never suggest unique or filtered,
  cleared on restart (Microsoft, Tune nonclustered indexes with missing index suggestions);
  disabling deletes the data, rebuild re-enables, unique disables referencing foreign keys,
  clustered makes the table inaccessible (Microsoft, Disable indexes and constraints).
- `query-execution#refresh`: PostgreSQL 50 + 10% threshold and partitioned parents (Routine
  Vacuuming); InnoDB 10% and 20 pages, automatic not replicated (Persistent Optimizer
  Statistics); SQL Server automatic update on a shrinking threshold (Statistics); SQLite
  `PRAGMA optimize`.

## Evidence: new measured numbers

All through `docs/article-work/indexes/verify.mjs` (PGlite 0.5.8, PostgreSQL 18.3), recorded in
`observed.json`, SQL in `src/lib/sql-lessons/indexes.ts` and added to `experiment.sql` by
`build-experiment.mjs`:

- Residual (paid-only history) with the covering index: Filter on status, 12 fetched, 2 removed,
  15 pages. With `(customer_id, placed_at DESC, order_id DESC, status) INCLUDE (total)`: Index
  Only Scan, status under Index Cond, no Filter, 5 pages (`observed.statusLast`).
- Bare column (customer and placed_at indexes only): day range 49; `date_trunc` 1,725; `= 42`
  62; `+ 0`, `::text`, `= 42::numeric` 1,725; `= 42::bigint` 62 (the native 18.6 run had 65;
  the companion now uses the PGlite numbers).
- Catch-all `($1 IS NULL OR customer_id = $1)`: custom plan 62 pages (bitmap), generic plan Seq
  Scan 1,725.
- ORDER BY placed_at DESC LIMIT 1: customer 42 walks `index_orders_placed`, removes 959, 33
  pages; customer 1001 (60 orders dated December 2025) same plan, removes 60,000, 1,892 pages;
  with `(customer_id, placed_at)` both read 4.

Numbers carried from the native PostgreSQL 18.6 runs (`docs/article-work/indexing-queries/`,
`docs/article-work/maintaining-indexes/evidence.md`) are labelled as such on each page, including
the paging table now in `large-results` and the LIKE table now in `postgresql/indexes`.

## Redirects and anchors

- No redirects: no page was retired, and both companion slugs are kept.
- Removed ids in `indexes`: `#ignored`, `#ignored-selectivity`, `#ignored-leading`,
  `#ignored-expression`, `#ignored-like`, `#ignored-or`, `#ignored-statistics`,
  `#ignored-check`. Added `#fates`. Every other id survives, including the exemplar ids
  (`#composite`, `#covering`, `#writes`) and those Storage links (`#heap`, `#key-order`,
  `#key-choice`, `#writes`, `#splits`).
- Removed ids in `indexing-queries`: `#page-index`, `#offset-cost`, `#keyset-index`,
  `#keyset-traps`, `#conditions`, `#combining`, `#and`. Added `#plans`, `#diagnosis`,
  `#leading`, `#too-much`, `#stale`, `#parameters`, `#prove`, `#limit-trap`, `#case`,
  `#optional-filters`.
- Removed ids in `maintaining-indexes`: `#reuse`, `#updates`, `#failed-rebuild`, `#build-time`,
  `#stats` and its h3s. Added `#measure-sqlserver`, `#rebuild-sqlserver`.
- Nothing outside the family linked to a removed id (grepped `src/`). Links inside the family
  were retargeted.

## Exemplar passages

- Opening: the last paragraph split in two, adding the layer-1 sentences. The other four
  paragraphs are unchanged.
- `#composite`: its paragraphs are unchanged; the new `#fates` h3 follows the history table.
- `#covering`: unchanged.
- `#writes` (HOT): one clause added to the HOT paragraph linking Storage's fill factor.

## Unsure

- The family is at 70 min, the top of the comparison's range. Further cuts would come from the
  companions' SQL listings (the PostgreSQL duplicate-index queries in Maintaining are about 150
  words) or the deep dive's sources.
- SQL Server and InnoDB claims are from documentation only; no server was run.
- The `nvarchar` claim relies on Microsoft's precedence rules plus community write-ups; the
  collation-specific exception (some Windows collations still seek) is deliberately left out.
- `verify.mjs`'s random-key page-split assertion (215 to 250 pages) failed once at 214 during this
  work and passed on rerun. It predates this restructure; consider widening it.

## Review repairs, 18 October

Made after the editorial, technical and first-reading reviews of the restructure.

- **Deep dive.** `#fates` now starts from the paid-only query and its Filter line, and talks about what a condition can do rather than its "fates". The status-last measurement (15 to 5 pages) moved to the end of `#covering` as `p#status-last`, which says most of the drop comes from going index-only. The covering table gained a SQL Server column. `#kinds` h3s have ids `#partial`, `#expression`, `#unique` and `#kinds-engines`. `#upkeep` is now three short paragraphs: bulk loads into a new or empty table, one sentence on building without blocking writes (linking Maintaining `#build`), and pruning. A new h3, `#workload`, shows one composite and one partial index serving four queries. Cuts: the clustered 62-page paragraph, three `#selectivity` paragraphs merged into one, and repeated figure numbers. The bitmap heap scan is glossed in `#range`. The Storage link now uses the heading "Free space and fill factor".
- **Indexing queries.** The catch-all text now matches 18.6 default-mode behaviour (custom plans throughout). InnoDB locking is reframed: InnoDB always has the foreign key's index. The nvarchar claim is limited to the `SQL_` collations, and Chapman's filtered-index post is cited. `#stale` links to `query-execution/#refresh`. Cuts: the `#rule` table (one sentence keeps 23 against 62), `#prefix-indexes`, the catch-all BitmapAnd numbers, the duplicate skip-scan and OR sentences, and the second paragraph of the `#diagnosis` intro. Links in the opening now point to Slow queries, and the opening explains the `index_orders` name.
- **Maintaining.** Disabled unique indexes: the referencing foreign keys need `WITH CHECK CHECK CONSTRAINT` after the rebuild (text and trial-drop listing). `#empty-or-thin` now leads with the sparse `total` index, and `#reindex` is trimmed. Links use the real title "Bloat, page reuse and REINDEX", and `#when-rebuild` links `query-execution/#refresh`.
- **Receivers.** In `postgresql/indexes`, `#bloat` now comes before a new closing `section#choosing`, `o_rand` is introduced, and the `#like` link points to `indexing-queries/#run`. In `large-results`, `#page-cost` now sits after the unit-of-paging `<details>`, and `#keyset` links to it. In `query-execution#refresh`, SQLite bulk loads now end with plain `ANALYZE`.
- **Figures.** LeadingFigure's `matches` method is renamed `isMatch`. Counters are singular when the count is 1. Root-page narration and the Descent fallback name branch pages by key range, not screen position. In the narrow layout, Covering dates use the smaller date size. Write narration and caption now count the undrawn branch page. Splits narration always describes both rows. The short lines seen on first load come from autoplay, not a bug.
- **Evidence.** verify.mjs: the random-key range is widened to 205–255 (200 runs gave 214 to 244). Verify passes.
- Reading times after repair: 35 + 19 + 16 = 70 min.
- **Polish after the editorial re-read.** Cross-article links now sit on the article name and point at the section, with no trailing heading ("<a>Indexing queries</a> measures each case"). This applies to all three pages. The Key Lookup clause moved out of the covering table's "Never" cell into the sentence before the table. The InnoDB locking paragraph has its own h3, `indexing-queries#innodb-locks`, and the map row is updated. The `#fates` forward reference now reads "an index that lacks `status` (the covering index of the next section)".
