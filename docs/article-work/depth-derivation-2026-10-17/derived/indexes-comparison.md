# Indexes: the existing articles against the consolidated plan

Compared on 18 October 2026, after `indexes-consolidated.md` was saved. I read the
extracted text of the three articles, checked their page sources for the figure
components, and grepped four neighbouring pages to test boundary claims: Storage,
Pagination, Changing a schema and Understanding performance.

## The sizes

| | Existing | Plan |
|---|---|---|
| Articles | 3: *Indexes* (deep dive), *Indexing common query patterns*, *Maintaining indexes* | 2: deep dive and one companion |
| Prose words, excluding sources and "where the numbers come from" | about 9,100 + 6,700 + 6,400 = **22,200** | about **10,100** |
| Figures | 8 interactive figures in the deep dive; the companions have SQL and tables only | 5 figures and 2 measured charts |
| Reading time shown | 35 + 29 + 28 = **92 minutes** | about 29 + 19 = **48 minutes** |

The existing set is about 2.2 times the plan. The difference isn't spread evenly. The
deep dive's core is close to the plan, and most of the extra sits in three places:
material taught twice across the three pages, material a neighbour owns, and
PostgreSQL-only operational detail.

## Layer 1

My plan's layer 1 says five things. An index is a sorted copy with a way back to each
row. It finds a value or a range in a few pages and returns rows in order. It helps only
when the query lines up with its order from the first column, and when few enough rows
match. The planner makes that call from estimates. Every index costs writes, space and
memory.

The deep dive's opening gives the first, second and fifth well. The book-index analogy
and "each index takes space, and inserts and many updates have to change it" are
accurate, and the paragraph saying the work is the pages read is a good layer-1 idea the
plan didn't state. Two points are missing from the opening. The leftmost-column
condition first appears in *Composite indexes*, roughly 3,000 words in. That an index
stops paying when many rows match, and the planner decides, first appears in
*Selectivity*. A reader who stops after the opening believes an index on a column helps
any query on that column. Two sentences would fix it.

The opening's fifth paragraph covers the 36-row invented table, the 60,000-row generated
table, PGlite and why plans say "local". That is method, arriving before the model, and
belongs in *Where the numbers come from*. That is about 120 words.

The companions' openings are sound. *Indexing common query patterns* restates the
sorted-order model in one paragraph and names the shapes it covers. *Maintaining indexes*
names its three kinds of drift.

**One ordering problem.** *Index entries and row locations* (975 words) comes before
*B-tree*. Its key-ordered half asks the reader to follow "descents of the table's tree"
through "upper levels" before the article has shown what a tree descent is. The heap
half can stay early. The key-ordered half, Figure 3 included, reads better after the
B-tree section, which is where the plan puts it.

## Part by part

"Plan" gives the consolidated plan's part number and layer.

| Plan part | Existing location | Depth against need | Notes |
|---|---|---|---|
| 0–1 Model, the scan replaced (L1) | Opening, *Sequential scan* | About right | See Layer 1. Figure 1 earns its place. |
| 2 B-tree (L2) | *B-tree* (491) | About right | Measured depth table is good calibration. The SQLite leaf-link and posting-list asides are layer-4 detail (about 60 words). |
| 3 What sorted order serves (L2) | *Range scans* (273) | About right | MIN/MAX missing; trivial. |
| 4 Composite: leftmost prefix, three fates of a condition, equality before range, order by use (L2) | *Composite* (1,211, including *Order without sorting* and *Combining*) | Thinner on one point, deeper elsewhere | Figure 7 and the four-index history table teach column order well. The middle fate, a condition checked inside the index without narrowing the scan, is never stated as a model. It appears only in passing in the companion, where `(customer_id, placed_at DESC, status)` "still lets the filter be checked from the index entry". The EXPLAIN section then teaches a two-way Index Cond/Filter reading that this gap makes misleading (see Accuracy). |
| 5 Skip scan (L3) | One paragraph in *Composite* | Right depth and weight | "Don't design an index around it" is the right advice. SQL Server's lack of one isn't said. |
| 6 Conditions the index can't see (L2) | Deep dive *When the database ignores an index* (1,161) and companion *Conditions an index cannot see through* (1,624) | Deeper than needed, and taught twice | Wrapped columns, LIKE under a language collation and OR with an unindexed branch are each measured in both articles. The companion's LIKE section (about 620 words: `text_pattern_ops`, `COLLATE "C"`, pg_trgm) and MySQL prefix-index section (about 280) go to layer 4. The plan needs about 250 words for collation and LIKE across engines. |
| 7 Combining indexes for OR and AND (L2) | Deep dive *Combining two indexes instead* (about 330) and companion *Combining conditions with OR and AND* (729) | Taught twice | BitmapAnd/BitmapOr, index merge and MULTI-INDEX OR are explained in both. One home of about 300 words, plus the UNION rewrite as a companion note, covers it. |
| 8 Entry to row: heap against primary-key B-tree (L2) | *Index entries and row locations* (975), *Choosing the key of a key-ordered table* (about 300) | About right for PostgreSQL, InnoDB and SQLite; thin on SQL Server | The body never says a SQL Server table with a primary key is clustered by default, or that it can also be a heap. The collection's brief names SQL Server as a compared engine. The key-choice subsection drifts into choosing an identifier scheme; about 150 words could go to the key-type decision. |
| 9 When a scan beats the index (L2) | *Selectivity and the planner's choice of scan* (633), Figure 6 | About right, and better than the plan asked | The shuffled-table run, where the same condition touched 1,715 pages instead of 922 and the planner switched at the same point, is exactly the correlation experiment the plan wanted. |
| 10–11 Index-only reads and the visibility caveat (L2/L3) | *Covering indexes* (430) | About right | Visibility gets about 150 words where the plan gave 60, but they are accurate and cross-engine. |
| 12 Partial, expression, unique (L2) | *Partial, expression and unique indexes* (612) | About right; some taught twice | The matching rule is stated. The queue and soft-delete previews repeat in the companion (about 120 words). Unique-NULL behaviour ignores SQL Server. The time-zone expression example is PostgreSQL-specific but teaches the exact-match rule well. |
| 13 Variant support reference | Spread through the prose | Missing as reference | A small engine table would replace scattered "X supports, Y calls it" sentences. |
| 14 Designing an index for one query (L2) | *Indexing for a query* (536) | About right, in the right place | It matches the plan's decision to keep the recipe in the deep dive. One step overstates; see Accuracy. |
| 15 Write cost per index (L2) | *What an index costs to keep* (Figure 8, HOT, InnoDB, WAL measurement) | About right | The WAL measurement (3.3 MB against 7.7 MB) is good calibration. HOT gets a paragraph where a sentence would do; acceptable. |
| 16 Where new keys land (L2) | *Page splits*, plus key choice | About right | Accurate use of InnoDB's 15/16 figure. |
| 17 Bulk loads: build indexes afterwards (L3) | Absent | Missing | Only "run ANALYZE after a bulk load" appears. PostgreSQL's *Populating a Database* gives the build-after rule. |
| 18 Where a B-tree stops (L2) | *Other index types* (367) | Deeper than needed, and framed as PostgreSQL's menu | A problem-first list of about 200 words, linking to the PostgreSQL series for access methods, would serve the general reader better. |
| 19 Plan vocabulary reference | *Checking an index with EXPLAIN* (730) | About right | The cross-engine table is good. SQL Server gets one sentence (STATISTICS IO); seek, scan and key lookup are missing. |
| 20 Working from the workload (L3) | Parts of *Indexing for a query* | Thinner | Widen before adding is there. Listing a table's queries so one index serves several is not. |
| 21a Newest items per tenant, and the LIMIT trap (L3) | Companion *Filtering, sorting and limiting* (1,482), *Tenants and skewed data* | Main case deeper than needed; trap thin | The tenant section measures what an index on `created_at` alone would cost a small tenant (210 pages). It doesn't say the planner can choose that plan by itself on a wrong estimate, which is the expert's failure mode. The grouping, `DISTINCT`, loose-index-scan and `DISTINCT ON` material (about 550 words) is beyond need. Latest row per group through `LATERAL ... LIMIT 1` is a real index technique the plan missed, worth about 200 words. |
| 21b Foreign keys (L3) | Deep dive (about 200) and companion *Joins and foreign keys* (803) | Deeper than needed; taught twice | The FK-delete measurement and the InnoDB auto-index detail are excellent. The join-method explanation (about 200 words) belongs to *How a query runs*. Missing: InnoDB locks every row a scan reads when no index fits. |
| 21c Work queue (L3) | *A queue of work* (about 330) | About right | The generic-plan failure is measured. The SQL Server parameterisation case is absent. |
| 21d Unique among live rows (L3) | *Uniqueness among the live rows* | About right | MySQL's generated-column workaround is given. SQL Server's filtered unique index is not. |
| 21e Case-insensitive lookup (L3) | Spread across the deep-dive diagnosis and the companion's LIKE section | Partial | The `lower(email)` expression index is taught. That MySQL's and SQL Server's usual collations already ignore case isn't said, and that changes the decision in those engines. |
| 21f Parameter type mismatch (L3) | *Types, affinities and character sets* (about 330) | About right for three engines | It is strong on MySQL (string against number, mismatched character sets in joins). SQL Server's `nvarchar` against `varchar`, the most common production case of this failure, is absent. |
| 21g Covering a hot read (L3) | Deep-dive covering section | About right | |
| 21h Optional filters (L3) | *AND across separate indexes* touches ad-hoc filter screens | Thin | The catch-all `(:p IS NULL OR col = :p)` predicate and building SQL per filter set are missing. |
| 22 "Why isn't my index used?" (L3) | Deep dive *When the database ignores an index* (1,161) | Right content, wrong layer and place | Layer-3 diagnosis takes up about 13% of the deep dive and repeats the companion's catalogue. Its symptom-to-cause table is the best part and should lead the companion's version. Forcing a plan only as an experiment is good advice. |
| 23–24 Redundant and unused indexes, auditing (L3) | *Finding indexes to remove* (774) | About right | Caveats are thorough: resets, replicas, rare jobs, constraint indexes. SQL Server's usage view and missing-index suggestions are absent. |
| 25 Shipping and retiring (L3/L4) | *Dropping without making things worse*, *Replacing an index in production* | About right | Build, check, then drop is well taught. SQL Server's disable-then-rebuild is absent. |
| 26 Maintenance folklore (L3) | *Rebuilding an index* (1,811), *Why an index stays large* (1,081), *Measuring size and bloat* (765) | Much deeper than needed | "Not on a calendar" and the scattered-against-contiguous delete result are the expert's core and are well measured. Several parts are PostgreSQL internals (layer 4) placed in a general article: the free-space-map timing, the nbtree README, bottom-up deletion and deduplication, the five REINDEX CONCURRENTLY bullets, the `_ccnew`/`_ccold` leftovers and pgstatindex columns. |
| Planner statistics (neighbour) | Deep dive *Statistics that no longer match the data* (about 230) and companion *Keeping statistics current* (900) | Re-teaches neighbours | *How a query runs* and *Understanding database performance* both teach estimates, stale statistics and `ANALYZE`. Per-engine refresh schedules (autovacuum thresholds, InnoDB persistent statistics, `PRAGMA optimize`) are planner material, not index material. |
| Keyset pagination (neighbour) | Companion *Paging through an ordered list* (1,111) | Re-teaches a neighbour | The Pagination page already has a keyset section with row comparisons. About 200 words here, on which index serves a keyset page and how its condition reaches Index Cond, would cover the index's part. |
| Online index builds (plan sent to *Changing a schema*) | *Building new indexes safely* (391) | Justified on this site | That page has no index-build material (no `CONCURRENTLY`), so this section is the only general home. My plan's boundary assumption doesn't hold here. Keep it. |

**What the existing articles have that the plan should adopt.** A failed concurrent build
leaves an invalid index that writes still maintain. A changed collation can silently
corrupt a text index, and the existing treatment covers this across engines. Order
service depends on NULL placement and collation as well as direction. Latest row per
group through `LATERAL`. Creating an expression index also creates statistics for the
expression. Together that is about 400 words. They are layer-3 cases an expert relies
on, and the consolidated companion should take them.

## Material that serves no part of the plan

| Material | Where | Words |
|---|---|---|
| Taught twice across the set: OR/AND combining, the wrapped column, LIKE, statistics, the queue/soft-delete and FK previews, deleted-row size | Deep dive and both companions | about 1,500 |
| Owned by neighbours: pagination mechanics (about 900), statistics schedules (about 750), join methods (about 200) | Both companions | about 1,850 |
| Layer-4 PostgreSQL detail in general articles: reindex locking and leftovers, free-space timing, dedup and bottom-up deletion, pgstatindex, pg_trgm and operator classes, the PostgreSQL access-method menu | All three | about 2,200 |
| Depth beyond need: grouping, DISTINCT and loose index scan; MySQL prefix limits; key-scheme advice; index soundness tooling | Companions, deep dive | about 900 |
| Method before model in the opening | Deep dive | about 120 |
| **Total** | | **about 6,500** |

That is about 30% of the set's prose. Removing it leaves about 15,700 words. The rest of
the gap to the plan's 10,100 comes from measurement narrative. Most claims in the
existing set carry their own measured page count, which makes them concrete and
trustworthy but costs about 30 to 60 words each. Some of that is worth keeping. The plan
assumed fewer measurements.

## Reading time

The plan estimates 48 minutes and the existing set shows 92. After the cuts above,
adding the gaps (about 900 words) and adopting the existing cases the plan missed (about
400), the set would be roughly 17,000 words. With figures, that reads in **about 70
minutes**. Tightening the measurement narrative could bring it toward 60. The deep dive
alone would fall from 35 to about 28 minutes once diagnosis and repeated material move
out, which is close to the plan's 29.

## Accuracy

These are things I noticed, not a full check. The facts I spot-checked against primary
sources held up: InnoDB's 15/16 page fill, its foreign-key index that "might be silently
dropped later", `MERGE_THRESHOLD`, REINDEX's locks, PostgreSQL 18's EXPLAIN buffers,
MySQL's string-against-number and mixed-character-set rules, SQLite's LIKE conditions,
and statistics resets after a crash.

1. **"Conditions under Index Cond were used in the index search", and "an index is doing
   its job when the plan shows your condition under Index Cond, not Filter".**
   Overstated. PostgreSQL 18's multicolumn page says conditions on columns after the
   first range "are checked in the index… but they do not necessarily reduce the portion
   of the index that has to be scanned". The article's own *The leading column has no
   condition* shows an Index Cond that walked 242 pages. Teaching the three fates of a
   condition would fix both sentences.
2. **"In all three engines a unique index treats NULLs as distinct by default."** This is
   true of PostgreSQL, MySQL and SQLite. SQL Server, a compared engine, allows one NULL in a
   unique index, which changes the soft-delete and optional-column designs.
3. **"Databases store tables in one of two ways"**, illustrated with PostgreSQL against
   InnoDB and SQLite. It omits that SQL Server tables are clustered by default when given
   a primary key, and can be heaps. The design guide is in the article's own sources.
4. **Recipe step: "The first column should cut the table to a small fraction."** This
   leans toward "most selective first", which PostgreSQL's rule and Winand's myth page
   argue against. Order follows how queries use the columns, equality before range. The
   article's own partial-index alternative for `status` shows it knows this. Reword
   rather than correct.
5. **HOT "possible when an update changes no indexed column"** is a simplification.
   Since PostgreSQL 16, changes to BRIN-indexed columns don't prevent HOT. This is minor
   and layer 4.
6. **Engine coverage.** The deep dive's title line promises SQL Server comparisons, and
   it makes seven brief mentions. Neither companion mentions SQL Server. That is a
   coverage gap against the collection's brief rather than an error, but it leaves out
   the SQL Server failures readers most often meet: `nvarchar` conversion, filtered
   indexes under parameterisation, and disabling an index (undone only by a rebuild).

## Boundaries

- **Storage and durability.** The site already matches the call made in phase 1.
  Storage's page has one paragraph naming the heap and the primary-key B-tree and saying
  "How these layouts fill, split and age is the subject of Indexes". *Indexes* owns the
  rest. No change needed.
- **Pagination and large results.** The Pagination page has a keyset section with row
  comparisons, so the companion's 1,111-word paging section re-teaches it. Keep the
  index's part.
- **How a query runs / Understanding database performance.** Both teach estimates and
  `ANALYZE`, so the index articles' statistics sections repeat them.
- **Changing a schema.** It doesn't cover index builds, so *Building new indexes safely*
  rightly stays.

## Verdict

**Restructure, with targeted cuts and additions. Don't rewrite.**

The deep dive's spine is sound and mostly at the right layer. It runs from scan to entry,
tree, range, selectivity, composite, covering, variants, cost, EXPLAIN and recipe. Its
figures and measurements are better evidence than the plan specified, and its claims
check out. The problems are structural:

1. **Move layer 3 out of the deep dive.** *When the database ignores an index* becomes the
   companion's diagnosis section, merged with *Conditions an index cannot see through*.
   Move the key-ordered half of *Index entries and row locations* after *B-tree*. Add the
   two missing layer-1 sentences, and move the method paragraph to the end.
2. **Give each part one home.** Combining indexes, the wrapped column, LIKE, statistics,
   foreign keys and deleted-row size are each taught twice.
3. **Hand material to its owners.** Paging mechanics go to Pagination and statistics
   schedules to the planner articles. PostgreSQL reindex, bloat and operator-class
   internals go to *Indexes in PostgreSQL*.
4. **Fill the gaps.** Teach the three fates of a condition and correct the Index Cond
   claim. Add SQL Server where it changes a decision: clustered by default, one NULL in a
   unique index, `nvarchar`, filtered indexes under parameters, disable. Add the LIMIT
   trap as a planner failure, the catch-all optional-filter predicate, building indexes
   after a bulk load, and InnoDB's locks without an index.

Done this way, the set falls from 92 to about 60 to 70 minutes. The two companions could
then merge into one, as the plan proposes. Keeping *Maintaining indexes* as a short
companion of about 12 minutes is also defensible, because readers arrive asking "can I
drop this?" and "why is this index so big?". The ruling should follow what remains after
the cuts, not the current page boundaries.
