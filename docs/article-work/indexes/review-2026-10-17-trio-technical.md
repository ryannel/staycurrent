# Indexes trio: informed technical and coverage review, 17 October 2026

Reviewer: informed technical reviewer (agent). Articles: Indexes (deep dive),
Indexing for queries and Maintaining indexes (companions). Reader: a backend
engineer on PostgreSQL, MySQL/InnoDB or SQLite who designs, verifies and maintains
indexes.

## Expected topic tree, written before reading the outlines

Mechanisms (parent)
- What an index is for: find rows without reading the table; keep an order.
- B-tree shape: sorted leaf pages, internal pages, fanout, height, leaf links.
- Where rows live: PostgreSQL heap + TID; InnoDB clustered primary key, secondary
  entries carry the PK; SQLite rowid tables and WITHOUT ROWID.
- Access paths: index scan + table fetch, bitmap (PG), index-only/covering
  (PG visibility map), range scan, full scan.
- Multi-column keys: leftmost prefix, equality before range, ordering for ORDER BY.
- Uniqueness and constraints; NULL handling.
- Variants: expression, partial, INCLUDE/covering; other index types named.

Decisions (queries companion, with the core rules in the parent)
- Starting from the query: equality, range, sort, output columns.
- Column order; selectivity; covering vs width.
- Foreign keys; avoiding duplicates; when not to index.

Failure (split)
- Planner ignores an index: low selectivity, stale stats, function or cast on
  column, collation/LIKE, OR, small table, generic plans. (queries companion)
- Write amplification, bloat, page splits (maintenance companion; parent explains
  why writes cost).
- Locking during build (maintenance).

Observation (split)
- EXPLAIN / EXPLAIN ANALYZE / BUFFERS; MySQL EXPLAIN / EXPLAIN ANALYZE; SQLite
  EXPLAIN QUERY PLAN (queries companion).
- Usage statistics, unused and redundant indexes, size and bloat measurement,
  statistics refresh, rebuild (maintenance).

## How this compares with the articles

The trio covers almost all of the expected tree, and the mechanisms in the parent
are strong: entries and row locations, heap against key-ordered tables, B-tree
depth, range scans, selectivity, composite order, covering, write costs and page
splits each get an explanation a working engineer can use. Three things differ from
the expected split.

- The parent also teaches most of the failure and observation material that the
  companions own. It has a full "When the database ignores an index" with seven
  subsections, plus building, unused, duplicate, invalid and drop guidance. Much of
  it is repeated in a companion, sometimes with the same measurement. See
  Repetition.
- The queries companion is titled "Indexing joins, sorting and pagination", but
  about half of it is conditions an index can't use (casts, types, `LIKE`), `OR`
  and `AND`, and queues, soft deletes and tenants. The title doesn't promise those
  parts, and the parent's links call it a home for "the query shapes an index
  cannot serve".
- A few things an InnoDB or SQLite engineer needs have no place yet. They are
  listed under Coverage.

What was checked: the rendered text of all three articles, their source for links
and anchors, the evidence notes for the deleted-rows measurement, and MySQL 8.4
manual pages fetched on 17 October 2026 (Optimizer Statistics, sys
schema_unused_indexes, Persistent Optimizer Statistics, OPTIMIZE TABLE, Merge
Threshold, Sorted Index Builds and Row Constructor Expression Optimization). For the
other InnoDB claims I relied on knowledge of the 8.4 manual and did not fetch the
pages. MySQL was not run: the Docker daemon was not running, and installing MySQL
through Homebrew would have meant downloading without the user's permission.

## Accuracy

The engine claims are mostly right. Of the InnoDB claims the commission named, these
are supported: index merge `Extra` wording (`Using intersect(...)`, `Using
union(...)`, `Using sort_union(...)`), `LIKE` with a constant that doesn't start
with a wildcard counting as a range, the foreign-key index that InnoDB creates and
may silently drop later, DESC key parts and the rule that an index must have the
same mix of directions as the `ORDER BY`, NULLs sorting first in ascending order
with no `NULLS FIRST` syntax, no partial indexes, `OPTIMIZE TABLE` mapped to `ALTER
TABLE ... FORCE` (online, brief exclusive locks at prepare and commit, a table copy
with FULLTEXT, no ALGORITHM or LOCK clause in its syntax), MERGE_THRESHOLD (default
50, can only be lowered, a lower value leaves more empty space), invisible indexes
(still maintained, primary key excluded), persistent statistics (recalculated past
10% of rows changed, always when an index is added, 20 sample pages, automatic
recalculation not replicated, `ANALYZE TABLE` replicated), and the
`sys.schema_redundant_indexes` columns, including `sql_drop_index`. On the
PostgreSQL side: `last_idx_scan` arrived in version 16, statistics counters are
discarded after an unclean shutdown or point-in-time recovery, the `REINDEX` lock
behaviour and planner lock are as documented, `REINDEX TABLE CONCURRENTLY` needs
room for every new copy at once, deduplication is not used for numeric, floating
point or INCLUDE indexes, only B-trees can be unique, and SP-GiST accepts INCLUDE.
There are no UML-style diagrams. The parent's figures use their own notation, and
the companions have no figures.

Ranked findings:

1. **Maintaining, "InnoDB: persistent statistics", last paragraph: the histogram
   advice is misleading for indexed columns.** The passage says that for a skewed
   column `ANALYZE TABLE ... UPDATE HISTOGRAM` helps, because "the index statistics
   only count distinct key prefixes". The 8.4 Optimizer Statistics page says
   "Histogram statistics are useful primarily for nonindexed columns", that for
   indexed columns "index dives can yield better estimates", and that when the range
   optimizer applies "it does not use histogram statistics". For a constant
   compared with an indexed column, InnoDB measures skew by diving into the index,
   not from the cardinality statistics. Why it matters: a MySQL reader with a
   skewed indexed column would build a histogram that the optimizer ignores, and
   wouldn't look at the real causes: `eq_range_index_dive_limit` for long `IN`
   lists, and parameterised statements. Repair: say that MySQL estimates skew on an
   indexed column by searching the index for the constant, and that histograms
   serve unindexed columns. Or drop the paragraph.

2. **Maintaining, "Unused indexes": the MySQL counter reset is missing.** The
   section lists when PostgreSQL resets its counters, but not that
   `sys.schema_unused_indexes` reads performance_schema data held in memory, which
   starts empty at every server restart. The manual says the view "is most useful
   when the server has been up and processing long enough that its workload is
   representative." The parent says this, the companion that owns removal doesn't.
   Why it matters: after a routine MySQL restart, every index looks unused. Repair:
   one sentence saying that in MySQL the counts start again at every restart and
   cover only that server.

3. **Maintaining, "Measuring size and bloat → InnoDB": "These are estimates from
   sampling" is unsupported for `size` and `n_leaf_pages`.** The manual describes
   them as "the total number of pages in the index" and "the number of leaf pages".
   It doesn't say they are sampled. The sampling it describes applies to the
   cardinality estimates. The figures are page counts as of the last statistics
   update, and `size` counts allocated pages, so it doesn't fall after deletes.
   Repair: "These are page counts as of the last statistics update, refreshed when
   ..." and keep the rest.

4. **Maintaining, "InnoDB: the table is rebuilt": the one-index rebuild needs both
   changes in one statement.** "To rebuild just one index, drop and re-add it with
   ALTER TABLE." Run as two statements, this leaves a window with no index, which
   the same article's rollout section warns against ("Never drop first"). Repair:
   `ALTER TABLE orders DROP INDEX i, ADD INDEX i (...)` in one statement, or build
   under a new name, then `RENAME INDEX` and drop the old one.

5. **Queries, "Prefix searches with LIKE", MySQL sentence: "a leading wildcard is
   dropped from the range" says the wrong thing.** The manual's rule is that
   `LIKE '%x'` is not a range condition at all. Repair: "a pattern that starts with
   a wildcard is not a range, and the index is scanned or ignored."

6. **Maintaining, "Duplicate and redundant indexes": the exact-duplicate query
   groups a unique index with a non-unique twin.** `indisunique` is not in the
   `GROUP BY` and isn't shown. A reader who drops the first name in the array may
   drop the constraint's index. The prose that follows warns about INCLUDE and DESC
   for the second query, but not about this. Repair: add `indisunique` to the
   select list, or group by it, and say which of the two to keep.

7. **Maintaining, "Measuring size and bloat → How large should it be?": the 93%
   figure is the clustered index's.** The manual's `innodb_fill_factor` default of
   100 leaves 1/16 of clustered index pages free during a sorted build. Saying
   "rebuilt pages" makes it sound as if it applies to every index. Low
   consequence. Repair: "fills rebuilt clustered-index pages to about 15/16".

8. **Maintaining, "When freed pages come back into use": correct, but the mechanism
   could be one clause more exact.** A page deleted by VACUUM is stamped with the
   next transaction ID. It can be recycled only once every snapshot that might
   still hold a link to it has gone, meaning the transaction horizon has passed
   that ID. Since PostgreSQL 14, VACUUM puts such pages in the free space map at
   the end of the same run if they are already safe. On a quiet system nothing
   moves the horizon, so the next VACUUM does it. In the trial, the 900,000 inserts
   moved the horizon. Why it matters: a reader who runs two VACUUMs back to back on
   an idle copy will see nothing recycled and conclude the article is wrong.
   Repair: replace "a page emptied by one vacuum may only be recognised as free by
   a later one" with "one that runs after newer transactions have started and
   finished".

9. **The SQLite version differs between the articles.** The parent and queries
   companion cite 3.51 (the queries companion says 3.51.0). Maintaining cites 3.54.
   Homebrew's sqlite here is 3.54.0. This is fine if both versions were really
   used. Otherwise, make them match.

10. **Queries, "What stops the index supplying the order", the InnoDB convenience:
    a documentation-based claim presented as fact.** It is right: MySQL's index
    extensions cover sorting. But it isn't flagged as manual-only, as the article
    promises to do for MySQL statements, and it works only when the primary key's
    direction matches. Repair: "its manual says the optimizer uses this hidden
    suffix for sorting" and a clause about direction.

No InnoDB claim on the commission's list is wrong in a way that would mislead
except finding 1.

## Coverage and depth

Parent (Indexes):

1. **The EXPLAIN mapping table has no row for "Did the query sort?".** The
   procedure in "Indexing for a query" says "the sort step should be gone", and
   much of the article is about avoiding sorts. MySQL readers need `Using filesort`
   (and `Using temporary` for grouping), and SQLite readers need `USE TEMP B-TREE
   FOR ORDER BY`. The parent quotes the SQLite wording once in "Order without
   sorting", but the table doesn't have it. Repair: add one row: Sort / Incremental
   Sort | `Using filesort` in Extra | `USE TEMP B-TREE FOR ORDER BY`.

2. **"How many pages were read? Not reported" for MySQL is true but leaves the
   reader nothing to count.** `FLUSH STATUS`, then the query, then `SHOW SESSION
   STATUS LIKE 'Handler_read%'` gives index and row reads. That is the MySQL
   counterpart of the article's method. Repair: one sentence after the table.
   SQLite's `.scanstats on` is a smaller optional addition.

3. **"Unique indexes and foreign keys" is thin on uniqueness.** It doesn't say that
   NULLs don't conflict in a unique index by default in all three engines, or that
   PostgreSQL 15+ offers `NULLS NOT DISTINCT`. Both decide whether a unique index
   enforces what the engineer expects. The queries companion relies on this
   behaviour for its MySQL soft-delete workaround. Repair: two sentences.

4. **MySQL column-prefix indexes and key-length limits have no home.** An InnoDB
   engineer indexing `VARCHAR(255)` utf8mb4 columns meets `KEY (email(20))` and
   the 3072-byte limit. A prefix index can't cover a query or supply order.
   PostgreSQL's limit is about a third of a page per entry. The evidence file
   records "B6 prefix indexes" as deliberately not added. That is defensible for
   the parent, but then the queries companion's `LIKE` section is the natural
   place for a short paragraph. Repair: a short paragraph there.

5. **The "Index write costs" heading doesn't contain its children.** It holds
   "Building an index on a live table", "Finding unused indexes" and "Duplicate and
   invalid indexes", which are maintenance tasks, not write costs. Repair: see
   Repetition item 2. Once those subsections shrink to a paragraph, the heading
   fits.

6. Proportion, honestly: the mechanism sections are well judged. "When the database
   ignores an index" (about 1,600 words) and the maintenance subsections (about 700
   words) are the over-long parts, because they re-teach what the companions own.
   Nothing in the parent's mechanism half is under-served apart from item 3.

Queries companion:

1. **The title promises less than the article holds.** About half the article is
   conditions, `OR` and `AND`, and recurring shapes. Repair: a title such as
   "Indexing for real queries: order, joins, pages and conditions", or move the
   conditions catalogue as Repetition item 1 proposes. The parent's link text
   follows whichever is chosen.

2. **MySQL and SQLite plan wording for sorts and groups is missing here too.** For
   the same reason as parent item 1: "What stops the index supplying the order" can
   say what a MySQL reader sees when it fails (`Using filesort`). Grouping could
   name MySQL's loose index scan (`Using index for group-by`) in one clause.

3. Joins, foreign keys, paging, the keyset traps, queues, soft deletes and tenants
   are at the depth a working engineer needs, with measurements and an honest
   statement of scope. The keyset row-comparison section is the best treatment of
   MySQL in the trio. Preserve it.

Maintenance companion:

1. Under-served for MySQL: the unused-index counter reset (Accuracy 2) and a
   space-on-disk check (`information_schema.INNODB_TABLESPACES` file size, or
   `DATA_FREE` in `information_schema.TABLES`), which is how MySQL engineers usually
   see reclaimable space. One sentence in "Measuring size and bloat → InnoDB".

2. "Checking that an index is sound" could name PostgreSQL's collation version
   check (`pg_database.datcollversion` warnings, `ALTER DATABASE ... REFRESH
   COLLATION VERSION` after a reindex), because the section rests on the collation
   change case. This is an optional extension.

3. Rebuilds, failed concurrent builds, the rebuild comparison table, statistics in
   each engine and the rollout procedure are well judged. The deletes section with
   its two-pattern table is the clearest teaching in the trio. Preserve it.

## Repetition and ownership

Proposed ownership: the parent explains mechanisms and the diagnosis method, and
gives each failure one sentence with a link. The queries companion owns the measured
catalogue of conditions and the engine detail for them. The maintenance companion
owns statistics routines, measuring, rebuilding, building, finding and dropping.

1. **The parent's "When the database ignores an index" and the queries companion's
   "Conditions an index cannot see through" plus "OR" teach the same lessons
   twice.**
   - Wrapped column or cast: the parent's `lower(email)`, `customer_id = 42.0` and
     `::bigint` against the companion's table with `+ 0`, `::text`, `::numeric` and
     `::bigint`.
   - MySQL's string-against-number rule and its utf8mb4/latin1 rule appear in both,
     nearly word for word.
   - SQLite affinity appears in both.
   - `LIKE`: `text_pattern_ops`, `COLLATE "C"`, `pg_trgm`, `ILIKE`, MySQL's range
     rule and SQLite's NOCASE rule appear in both with different measurements.
   - `OR` with an unindexed branch appears in both, plus BitmapOr in the parent's
     "Combining two indexes instead".

   The expression lesson is taught three times: "Expression indexes",
   "#ignored-expression" and the companion's table. A reader of the trio meets the
   same advice two or three times with different numbers. Smallest repair: keep the
   parent's symptom table and diagnosis method ("The condition matches too much",
   "The leading column has no condition", "Statistics", "Proving the index can be
   used"). Reduce "The column is wrapped", "Prefix patterns and collation" and "One
   branch of an OR" to two or three sentences each, with the parent's own example
   and a link to `indexing-queries/#bare-column`, `#types`, `#like` and `#or`. Move
   no measurement the companion lacks; the companion already has equivalents.

   Also, the companion's "this section is the catalogue of conditions behind its
   first item" is wrong. The parent table's first item is "The condition matches
   too much". Repair: "behind the expression, LIKE and OR rows".

2. **The parent's maintenance subsections repeat the maintenance companion.**
   - "Finding unused indexes": the query and the replica and reset caveats.
   - "Duplicate and invalid indexes": the redundant-prefix rule, sys schema and
     `indisvalid`.
   - The drop paragraph: `DROP INDEX CONCURRENTLY`, INVISIBLE and "a full business
     cycle".
   - "Building an index on a live table".
   - In "#ignored-statistics", the second paragraph: autovacuum thresholds, InnoDB's
     10% and SQLite's `PRAGMA optimize`.

   Each also appears, more fully, in the maintenance companion. Smallest repair:
   replace the three subsections with one short paragraph under the write-costs
   section ("An index nobody reads still costs every write; Maintaining indexes
   shows how to find unused, duplicate and invalid indexes and drop them safely"),
   with deep links. Keep "Deleted rows and index size" and "Page splits", which are
   mechanisms. Cut the statistics paragraph to the symptom plus a link to
   `maintaining-indexes/#stats`. Retarget the symptom table's "invalid or invisible"
   row from `#redundant` to `maintaining-indexes/#drop-invalid` and
   `#drop-safely`. Removing these parts also repairs Coverage item 5 for the
   parent.

3. **The same status measurement is repeated within the parent.** Selectivity's
   last paragraph (80% paid: a sequential scan of 1,936 pages; 20% pending used the
   index) is repeated in "The condition matches too much". Repair: keep the
   measurement in Selectivity and let the ignored section add only the forced-plan
   comparison (about 1,600 pages against 1,936).

4. **Ordering detail is taught twice.** The parent's "Order without sorting" and
   the companion's "What stops the index supplying the order" both explain
   mixed directions and NULL placement per engine. Repair: the parent keeps the
   mechanism and its measured examples, and the companion keeps the middle-column
   and range cases and links back for direction and NULLs, or the other way round.
   Pick one owner for the per-engine NULL rules.

5. **Smaller overlaps.** BitmapAnd (parent "Combining two indexes instead" against
   companion "AND across separate indexes") and partial unique soft delete (a
   parent sentence against the companion's section) are both acceptable,
   because the parent gives the idea and the companion the decision. Add a link from
   the parent to `#and` and `#soft-delete`.

6. **The deleted-rows numbers are consistent, but the framing could mislead.** The
   parent's 234/166 pages (60,000 rows), unchanged after a scattered 90% delete and
   VACUUM, then 25/19 after REINDEX, matches the companion: about 22 bytes an entry
   before and after for the primary key (166 × 8192 / 60,000 ≈ 22.7; the
   companion's 21 MB / 1M ≈ 22), and no shrinkage after VACUUM. The evidence file
   also records that a contiguous 90% delete left 234/166 pages. File size can't
   tell the two cases apart; the companion's density table does. The parent's
   "deleting rows that were scattered through the table thins every page and frees
   almost none" implies a contiguous delete would shrink the file, and it doesn't.
   Repair: one sentence in the parent: "Deleting a contiguous range empties whole
   pages for reuse, but the file stays the same size either way; Maintaining
   indexes measures the difference". Link it to `maintaining-indexes/#empty-or-thin`.

7. Minor number drift: the queries companion's sequential scans read 1,725, 1,728
   and 1,732 pages for the same table (buffers counted for the whole plan). One
   clause in "Where the numbers come from" would stop a careful reader wondering
   whether the table changed.

## Links and anchors

Every anchor in the three articles resolves (checked against the source ids), and
each target section teaches what its link text names. For example, `#cost` in
Indexes in PostgreSQL covers `random_page_cost`, and Planner estimates covers
extended statistics. The problems are links without anchors:

- The parent's nine links to the companions all go to the top of the page,
  including "shows how to measure the size and bloat ... and how to rebuild"
  (should be `#measure` / `#rebuild`), "covers the full rollout" (`#rollout`),
  "covers keeping statistics fresh" (`#stats`), "keeps the longer list of query
  shapes" (`#conditions`) and "shows which indexes each join and foreign key needs"
  (`#joins`).
- Maintaining's five links to Indexes are also bare: "the HOT updates in Indexes"
  should go to `#writes`, "Indexes introduced the pages and splits" to `#splits`,
  and "Indexes shows the query" (unused indexes) to a new id on "Finding unused
  indexes". That subsection has no id, and neither does "Building an index on a
  live table". If Repetition item 2 is applied, retarget these links.
- In the queries companion, "Indexing for a query weighs against the write cost"
  lands on `#design`, whose cost step is one line ("Count what it costs"). It would
  be better aimed at `#writes`.

## Verdict

**Repair required.** No blocking factual error. Accuracy finding 1 (histograms)
should be fixed before the article is marked ready as a draft, and findings 2 to 6
are a sentence each. The larger repair is ownership: the parent re-teaches about
2,000 words of material its companions own, and the queries companion's title
doesn't describe half of its contents. Neither stops a reader learning, but a
reader of all three meets the same lesson two or three times with different numbers.
This review doesn't authorise publication.

Remaining uncertainty: whether MySQL's range optimizer turns a row comparison with
no leading equality, such as `(placed_at, order_id) < (?, ?)`, into a range. The
manual page covers only the case with a leading equality. The companion's advice to
write it out and check `key_len` is safe either way. A MySQL 8.4 run would settle
it, as well as the `Handler_read` suggestion.
