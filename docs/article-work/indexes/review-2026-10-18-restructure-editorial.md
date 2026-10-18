# Indexes family after the restructure: editorial review, 18 October 2026

Perspective: editor, informed. Scope: the deep dive `indexes/`, the companions
`indexing-queries/` ("Indexing queries: diagnosis and patterns") and
`maintaining-indexes/`, and the sections that received moved material:
`large-results/#page-cost`, `query-execution/#refresh`, `postgresql/indexes/#like` and
`#bloat`.

How I read it. I read the review brief, the review and style skills, the Sam Who memory
allocation text and the house-reference brief first. Then I wrote down what an expert
can do (below) before I opened the map. After that I read the Indexes section of
`docs/coverage/relational.md`, the writer's note, and the derived plan and comparison.
I read every page from the dev server in headless Chromium: the full rendered text,
including figure narration, the "At 60,000 orders" lines, captions and controls. I
extracted the heading trees. I counted words per section with figures removed, the way
`src/lib/reading-time.ts` does, and checked every internal link and anchor from the six
pages. I also checked for horizontal overflow at 375 px; there is none. I changed no file
except this one.

## What an expert practitioner can do (written before opening the map)

1. Say what an index is (a sorted copy of some columns, with a way back to each row) and
   why it helps: a short descent plus an ordered range read, in place of a full scan.
2. Picture the B-tree: pages, fanout, a depth of three or four for most tables, linked
   leaves, splits.
3. Predict which conditions an index can use: equality, range, prefix `LIKE`. Know which
   it can't: a function or cast on the column, an implicit conversion, a leading
   wildcard, `OR` with an unindexed branch. Know the fixes for each.
4. Order composite columns: leftmost prefix, equality before range, sort satisfied by
   index order, mixed directions, skip scan where an engine has one.
5. Use covering indexes and `INCLUDE`, and know when a covered query still visits the
   table (the visibility map, InnoDB's page check).
6. Account for heap against clustered tables: the secondary entry carries the key, and
   that drives primary-key choice (sequential against random keys).
7. Tell a planner that chose not to use an index from an index that can't serve the
   query. Understand selectivity, statistics and correlation, read `EXPLAIN` for index
   use, and compare estimated rows with actual rows.
8. Use partial, expression and unique indexes, and know the other index types
   (full-text, GIN, GiST, BRIN, vector) and when each applies.
9. Weigh write cost: every index on every insert, HOT, log volume, fewer and wider
   indexes.
10. Maintain an index set: bloat and density, fill factor, rebuilding without blocking,
    refreshing statistics, building on a live table, finding unused and duplicate
    indexes.
11. Diagnose from a slow query to an index decision, then verify it on realistic data.
12. Know the recurring patterns: keyset against offset paging, the `ORDER BY ... LIMIT`
    trap, catch-all filters, the tenant column first, foreign-key indexes, bulk loads.
13. Design a small index set for a table's whole workload, not one query at a time.
14. Know the product differences (PostgreSQL, InnoDB, SQL Server, SQLite) at the points
    where they change a decision.

**Against the map.** The map's Indexes section covers items 1 to 12 and 14, each with a
named home. Two things are thinner than the list:

- **Item 13, designing for a workload, has no row.** The consolidated plan had it as part
  20, and the comparison called it "Thinner". The map reduced it to "extend before
  adding" in D `#design`. On the pages, no passage takes several of a table's queries
  and shows them settling into two or three indexes. The pieces are scattered. `#design`
  says the composite can replace the plain `customer_id` index. The companion's
  `#foreign-keys` says the order-list index also serves the foreign-key check. An expert
  does this routinely, and GitLab's index guide treats it as the standard.
- **Item 11 starts one step late.** The companion assumes the reader already has the slow
  query. One linked sentence pointing to finding slow queries would close the gap, since
  `slow-queries/` exists and the companion already links its `#verification`.

Everything else the map assigns is taught where the map says, not just mentioned. The
one part taught in the wrong order is `#fates` (finding 1).

## Heading trees

**Indexes** (deep dive, "About 34 minutes", 11 figures)

```
Sequential scan
Index entries and row locations
  Tables stored as a heap
  Clustered tables
B-tree
Range scans
Searching a clustered table
Selectivity and the planner’s choice of scan
Composite (multicolumn) indexes
  What an index does with each condition      (#fates, new)
  Indexes and ORDER BY
  Combining indexes
Covering indexes and index-only scans
Partial, expression and unique indexes
  Partial indexes / Expression indexes / Unique indexes, foreign keys and joins /
  Support in other engines                     (no ids of their own; all land on #kinds)
Write cost and upkeep
  Page splits
  Choosing the primary key of a clustered table
  Deleted rows and index bloat
  Building, finding and dropping indexes
Checking an index with EXPLAIN
Designing an index for a query
Other index types
Where the numbers come from
Sources and further reading
```

**Indexing queries: diagnosis and patterns** ("About 20 minutes", 1 figure)

```
Reading a plan in four engines
Why an index goes unused
  The column has to stand alone / Types and collations have to agree /
  Prefix searches with LIKE / The leading column has no condition /
  An OR with an unindexed branch / The condition matches too much /
  Statistics that no longer match the data / Plans made for parameters /
  Proving the index can be used
A sorted list with a limit
  When an index supplies the order / What stops the index supplying the order /
  When the planner walks the wrong index / The latest row per group
Joins and foreign keys
  Which column needs the index / The foreign key that makes a delete slow
Paging through an ordered list
Shapes that recur
  A queue of work / Uniqueness among the live rows / Case-insensitive lookup /
  A search screen with optional filters / Long text keys and MySQL prefix indexes
Where the numbers come from
Sources and further reading
```

**Maintaining indexes** ("About 16 minutes", no figures)

```
Why an index stays large after deletes
  Pages that empty and pages that thin out / InnoDB, SQL Server and SQLite
Measuring size and bloat
  How large should it be? / PostgreSQL / InnoDB / SQL Server / SQLite
Rebuilding an index
  When a rebuild is worth doing / PostgreSQL: REINDEX / InnoDB: the table is rebuilt,
  not one index / SQL Server: reorganize or rebuild / SQLite: REINDEX frees pages,
  VACUUM shrinks the file / The rebuild options side by side
Building new indexes safely
  Replicas
Finding indexes to remove
  Unused indexes / Duplicate and redundant indexes / Invalid indexes /
  Dropping without making things worse
Replacing an index in production
Checking that an index is sound
Sources and further reading
```

All three trees read as maps. In the companion, a reader with a slow query can find
their symptom from the headings alone. Maintaining's headings are the questions an
operator asks. Judged as a promise of coverage, the deep dive's tree is the strongest:
it runs from structure to use to cost to checking.

## What works, and should be kept as it is

- **The deep dive's opening still does its job.** The added sentences carry the
  layer-1 model the comparison found missing: "The query’s conditions and sort order have
  to line up with the index’s columns, starting from the first, and few enough rows have
  to match." Splitting the last paragraph left the closing line on its own: "Counting
  pages is how you choose an index, and how you check in a query plan that the database
  used it." A reader who stops after the opening no longer thinks any index on a column
  helps any query on it.
- **The three exemplar passages are untouched.** `#composite` around Figure 7,
  `#covering` around Figure 8 and the HOT paragraph in `#writes` read as they did after
  the style pass. The one clause added to HOT (the link to Storage's fill factor) fits.
- **The companion's diagnosis section, merged from two sources, reads as one piece.** The
  symptom table leads, as the comparison asked. Every row links to an h3, and each h3
  opens by naming its case. The order follows the stated questions: can the index serve
  the condition (bare column to `OR`), would the planner choose it (too much, stale), did
  it with real parameters. I couldn't find a seam where the deep dive's old `#ignored`
  meets the companion's old "Conditions an index cannot see through". The bare-column
  table carries seven measured rows in one place, and "The cure is to move the work to
  the other side" is a plain verdict of the house kind.
- **The `LIMIT` trap (`#limit-trap`) is the best new passage in the family.** It runs
  break, fix, new cost on measured numbers. Customer 42 is found after 959 discarded
  rows (33 pages). Customer 1001 takes the same plan and reads 1,892 pages, more than a
  full scan. The composite reads 4 for both. The planner's error is stated in one
  sentence: "it can’t know they sit at the far end." The tenant paragraph that follows
  turns the trap into a design rule with its own numbers (3 against 210, then 24).
- **The catch-all (`#optional-filters`) teaches by reduction.** It cuts the
  three-filter query down to one prepared filter and shows the generic plan (1,725
  pages) against the custom one (62). Building the SQL per filter set is given as the
  durable fix in every engine. This is the plan's example (h), done better than the plan
  asked.
- **The SQL Server notes change decisions, not just vocabulary.** Each is a sentence or
  two, placed where a SQL Server reader would otherwise be misled:
  - clustered by default (`#key-order`);
  - one NULL in a unique index, fixed by a filtered unique index (`#kinds`);
  - `nvarchar` parameters, `CONVERT_IMPLICIT`, and the JDBC and `AddWithValue` defaults
    (`#types`);
  - filtered indexes ignored under parameters, fixed by `OPTION (RECOMPILE)`
    (`#parameters`);
  - density before fragmentation, `REORGANIZE` against `REBUILD`, and disabling as a
    trial drop that deletes the index's data (Maintaining).

  The `nvarchar` paragraph ends on two actions the reader can take today.
- **Maintaining is now an operator's page.** Its opening asks the on-call questions
  ("Why is this index 200 MB for a table with 100,000 live rows?"). "Not on a calendar."
  is the house's plain verdict. The point that a rebuild's speed-up often comes from the
  statistics refresh is the expert's piece of folklore-correction, and it is sourced to
  Microsoft.
- **The site stays whole.** No page was retired, so no redirect is needed. Every
  internal link from the six pages resolves, and every anchor exists. Nothing in `src/`
  links to a removed id. The collection entries carry the new title and scopes. The
  pager runs Indexes, Indexing queries, Maintaining, Storage.

## Findings, most consequential first

### 1. `#fates` teaches the rule before the example, and its example needs the next section

**Where.** Deep dive, `#composite` > "What an index does with each condition".

**What happens to the reader.** The section opens with a taxonomy: "Each condition in a
query meets one of three fates, and the plan tells you which". Three bullets follow, then
the measured pair. The pair is the right evidence, but the reader can't interpret it yet:

- "With the covering index from the next section, which has no `status`, PostgreSQL
  fetched 12 rows … 15 pages." The covering index, `INCLUDE`, index-only scans and heap
  fetches all arrive in `#covering`, after this.
- "The same query became an index-only scan of 5 pages, with no row fetched only to be
  discarded." Most of the drop from 15 to 5 comes from the scan becoming index-only (no
  table visits at all), not from the two rejected rows. A reader at this point can't
  separate the two effects, and may conclude that moving a check into the index
  saves two-thirds of the pages.
- "It still read every entry for customer 42 since 1 February". With `LIMIT 10`, the
  scan reads newest-first and stops at ten paid rows: about 12 entries, not all 15 since
  1 February. The point the sentence carries is right (the condition doesn't narrow
  where the scan starts or stops), but the wording overstates it.
- In bullet 1, "plus one range or sort on the next" says a sort column narrows the scan.
  It doesn't. A sort saves the sort step; only a range sets where the scan starts and
  stops.
- "Fates" is the derivation's own label, and it reaches the reader four times: "the
  third fate at best", "the first two fates", and twice more. The heading avoids it, and
  so should the prose.
- The design table in `#design` says `status` goes "After placed_at". The measured index
  puts it fourth, after `order_id DESC`.

This is the one section of the reference article that inverts the house pattern. The
reader is told the rule, then shown it, and the showing depends on later material.

**Smallest repair.** Keep the three bullets and the plan-vocabulary paragraph in
`#composite`. Lead into them from the paid-only query and its `Filter` line (12 fetched,
2 thrown away), so the reader sees a condition checked at the table before it is named.
Move the status-last measurement (15 to 5 pages, index-only) to the end of `#covering`,
after the engine table, where "index-only" and "heap fetches" already mean something.
Then make these wording changes:

- bullet 1: "plus one range on the next";
- "It still read the same entries; `status` decided only which of them to return";
- "a condition can do one of three things" in place of "fates";
- design table: "After the sort columns".

### 2. Large results: the moved h3 swallowed the host's own paragraphs

**Where.** `large-results/#work`. The new h3 "What a page costs" was inserted above
"Keep the unit being paged clear too…" and its "Try a page of two orders with all their
lines" `<details>`. Both are host material about joins and the unit of paging, and they
now sit under a heading about page cost.

**What happens to the reader.** After the `NULL` sort-key paragraph, the page changes
subject to order lines, still under "What a page costs". A reader scanning the headings
for the join-unit advice won't find it. Two other joins rub:

- The host's `#keyset` section still says "Mixed directions or nullable ordering fields
  require a continuation condition that follows those exact ordering rules; our two
  fields are non-missing…". That is exactly what `#page-cost` now teaches, with no link
  between them.
- "The last row read more pages than the table holds" means the last row of the results
  table, and reads at first as a database row.

**Smallest repair.** Move the h3 and its content below the join-unit paragraph and its
`<details>`, so the host's `#work` text stays together. Add "What a page costs shows both
cases" to the `#keyset` sentence above. Change "The last row" to "The last line of the
table".

### 3. The bulk-load advice in the deep dive drops the condition Maintaining keeps

**Where.** Deep dive `#upkeep`: "Loading a lot of data into an indexed table updates
every index row by row. PostgreSQL’s documentation advises loading first and creating
the indexes afterwards…"

**What happens to the reader.** "An indexed table" invites a reader to drop the indexes
on a live table before a large import. That removes them from running queries and
suspends uniqueness checks. Maintaining has the missing condition ("When you are loading
a table, rather than changing a live one, create the indexes after the load"), but a
reader who stops at the deep dive, as the map intends, never sees it. The paragraph order
also strains. The subsection's first sentence is about pruning ("needs pruning as well
as growing"), then two paragraphs cover building, and pruning returns in the fourth.

**Smallest repair.** Change "into an indexed table" to "into a new or empty table". Move
the pruning sentence to open the paragraph that starts "To find indexes worth removing".

### 4. Designing an index set for a workload is named, not taught

**Where.** Deep dive `#design`; the map has no row for it (see the expert list above).

**What happens to the reader.** The reader can design one index for the history query
and prune a redundant one. They are never shown four queries on `orders` becoming two
indexes. The family already measures those four queries: the history query, the order
list, the foreign-key check and the pending dashboard.

**Smallest repair.** Add about 120 words to the end of `#design`. List the four queries,
show that `(customer_id, placed_at DESC, order_id DESC)` serves the first three and the
partial index the fourth, and point to the write cost saved. Add the row to the map.

### 5. `postgresql/indexes/#bloat` is appended after the page's conclusion

**Where.** `postgresql/indexes`. The `#writes` section ends with "Choosing among access
methods", which reads as the page's closing synthesis ("The decision is consequently more
specific than choosing a favourite access method…"). `#bloat` comes after it.

**What happens to the reader.** The page concludes, then starts again. Inside `#bloat`:

- `pgstatindex('o_rand_customer_idx')`, `o_rand` and "this randomly thinned one" refer to
  a table built only on Maintaining. Nothing on this page introduces it.
- `#reindex` repeats `#concurrently`'s point that a failed concurrent build leaves an
  invalid index.

**Smallest repair.** Move "Choosing among access methods" to the end of the page, or
place `#bloat` before it. In `#pgstatindex`, add a clause: "on Maintaining's million-row
table after 90% of its rows were deleted at random (`o_rand`)". Cut the repeated
invalid-index sentence down to the `_ccnew` and `_ccold` names, which are new.

### 6. Links that land short of what they promise

These are small, but each one sends the reader to the wrong place:

- Companion `#stale` and Maintaining `#when-rebuild` link "Planner estimates" to
  `query-execution/#estimates` for refresh schedules. The schedules are in `#refresh`,
  about 550 words further down. Retarget both links to `#refresh`.
- Maintaining's link text "Bloat and rebuilds in PostgreSQL" appears three times. The
  section is titled "Bloat, page reuse and REINDEX". Use the real title.
- The four h3s under `#kinds` have no ids. So the companion's "as Expression indexes
  shows" and "partial index" links land on the h2, up to 300 words above the passage.
  Add `#partial`, `#expression` and `#unique`, and retarget.
- The deep dive's sources entry "Large results: keyset pagination over an index" points
  to `#keyset`. The index part now lives at `#page-cost`.
- In `#deleted-rows`, "Rebuilding an index shows how to measure the bloat" points to
  `#rebuild`, but the measuring is in `#measure`. Either reword or link both.
- `postgresql/indexes/#like` says "measured … with the experiment from Indexing queries",
  which links to the companion's top. Link `indexing-queries/#run` instead.
- The deep dive's sources still annotate Operator Classes as covering "text_pattern_ops
  for LIKE", which the deep dive no longer teaches. Drop the clause.

### 7. Small joins inside the companion

- **Figure 1's caption** opens "The tree from the range scan, now an index on
  (customer_id, placed_at)". On this page "the range scan" refers to nothing. The prose
  before it names Indexes, but a reader who skims straight to the figure can't place it.
  Repair: "The small index from Indexes' range-scan figure, given a second column".
- **Two process passages overlap.** The `#diagnosis` intro gives three questions (can,
  would, did). `#prove` then gives a four-step checklist in a slightly different order.
  Since `#prove` is the one a reader will act on, cut the intro's second paragraph to its
  first sentence and a link to `#prove` (saves about 40 words).
- **Two different "events" tables** appear (`#stale` and the tenant paragraph). The
  displayed SQL also switches between `orders` and `index_orders` for what the reader
  takes as one table. "Where the numbers come from" explains why, but only at the end.
  Repair: one clause in the opening ("shown as `index_orders` where the number came from
  the Indexes experiment"), and call the tenant table "a tenants' events table".
- **`#queue`:** "The condition also has to be a literal…; in SQL Server that applies to
  every query against a filtered index." This is hard to parse. Try: "in SQL Server a
  parameter rules out the filtered index on every execution, not only once the plan goes
  generic".

### 8. SQL Server notes: two consistency gaps

- The deep dive's covering table ("PostgreSQL, MySQL’s InnoDB and SQLite") has no SQL
  Server column, while the heap and variants tables beside it have one. SQL Server is the
  one engine whose covering story (Key Lookup, `INCLUDE`, the clustered key carried in
  every nonclustered entry) a reader most often meets. The first cell's "as in SQL
  Server" hints at it. Repair: add the column, three short cells.
- Maintaining's "Unused indexes" shows only the SQL Server usage query, with an
  unlabelled comment. The PostgreSQL query sits back in `#measure-pg`. Repair: label it
  `-- SQL Server:`, and add "the PostgreSQL query is in Measuring size" to the prose.

There is also a cumulative effect worth watching rather than repairing. Many sections
now end on an engine roll-call ("MySQL calls…, SQLite…, SQL Server…"). Each is short and
earns its place, but read in sequence they give the deep dive's second half a repeated
cadence. Where a table already carries the facts, as `#plans` does for the `#fates`
vocabulary, the prose can stay one sentence. It already is one sentence, so this is a
note for future writers copying the page, not a repair.

### 9. Smaller wording notes

- `#splits`: "That 90% is the index’s fill factor, set with `WITH (fillfactor = 70)`…"
  reads as a contradiction. Split it: "That 90% is the index’s fill factor. `WITH
  (fillfactor = 70)` on `CREATE INDEX` leaves more room…"
- `#limit-trap`: "The tenant column belongs first in every index of such a table" is
  stronger than the evidence, since a lookup by a globally unique id doesn't need it.
  Use "almost every index".
- `#prefix-indexes` (93 words) serves no part on the map, and the comparison listed MySQL
  prefix limits as depth beyond need. Fold one sentence into the deep dive's variants
  table, or cut it.

## Time spent

The family shows 34 + 20 + 16 = 70 minutes, against the derived plan's 48 and the
comparison's 60 to 70. The counter reads every word outside a `<figure>`, including
sources lists and SQL listings, and adds 12 seconds a figure. Measured that way:

| | Deep dive | Indexing queries | Maintaining | Family |
|---|---|---|---|---|
| Shown | 34 | 20 | 16 | 70 |
| Sources and "where the numbers come from" | 829 words, 3.1 min | 399, 1.5 | 214, 0.8 | 5.4 min |
| SQL listings (copied, not read through) | about 160 words, 0.6 | about 240, 0.9 | about 700, 2.6 | 4.1 min |
| Prose, tables and figures | about 30 | about 18 | about 13 | **about 61** |

On that basis, the deep dive is on the plan's 29 minutes. The overrun is in the
companions: about 31 minutes of reading against the plan's 19 for one companion. These
parts make up that gap, and they earn it:

- **SQL Server, about 1,000 words across the family (about 4 min).** The plan had none,
  and the collection's brief names SQL Server. Each note changes a decision (finding list
  above).
- **Four-engine measurement queries in Maintaining (about 400 words of prose beside the
  code).** An operator copies these, and the plan's single-paragraph budget for auditing
  undercounted them.
- **The cases the comparison told the plan to adopt (about 400 words).** These are the
  invalid index after a failed build, collation drift in `#integrity`, NULL placement and
  collation in `#order`, `LATERAL` for the latest row per group, and expression
  statistics. All are present and all are layer 3.
- **Measured numbers on nearly every claim (roughly 30 to 60 words each).** The
  comparison noted that the plan assumed fewer of them. They are what makes the `LIMIT`
  trap and the catch-all convincing, and the house style asks for exact numbers.
- **Two openings and two sources lists (about 400 words)** are the price of keeping two
  companions (see below).

What doesn't earn its time comes to about 575 words, a little over 2 minutes:

| Passage | Words saved | Why |
|---|---|---|
| Companion `#rule`: the 62-against-23 table and its paragraph | ~100 | It repeats the deep dive's history-query table (62 against 13). Keep two sentences and the `CREATE INDEX` that sets up the trap. |
| Companion `#prefix-indexes` | ~70 | No map part; finding 9. |
| Catch-all's last paragraph (customers 40 to 59, BitmapAnd 20 against 96, 53 and 23) | ~60 | The deep dive's `#combining` already measures a BitmapAnd. One sentence on "a composite wins only for its own combination" is enough. |
| Deep dive `#selectivity`, the three paragraphs after Figure 6 | ~60 | 922 of 1,725 and the shuffled 1,715 each appear three times (figure line and two paragraphs). Merge into one paragraph. |
| Maintaining `#reindex` (one 120-word paragraph) | ~60 | `postgresql/indexes/#reindex` now owns the locks and costs. Keep the verdict, the 72 MB to 8 MB result and the link. |
| Deep dive `#upkeep`, the four-engine build-lock paragraph | ~45 | Maintaining `#build` is the home. Keep one sentence: plain builds block writes in PostgreSQL and SQLite, other forms don't. |
| Maintaining `#empty-or-thin`, the first result paragraph | ~50 | It restates Figure 11. Lead with what's new: the `total` index went sparse even under the age-ordered delete. |
| Deep dive `#clustered`, "Stored as a clustered table, the 60,000-order table’s…" | ~40 | A counting caveat that changes no decision. |
| Companion `#or` and `#leading`, the sentences repeating `#combining` and the skip-scan paragraph | ~40 | They say again what the deep dive says. |
| Companion `#diagnosis`, the intro's second paragraph | ~40 | Finding 7. |

These trims would bring the family to about 68 minutes as shown, or about 59 of
reading. I wouldn't cut further. Below that, the next candidates are the SQL Server
notes, the engine measurement queries and the measured numbers. Those are exactly what
the comparison found missing, or what the house style asks for.

## Does the deep dive still work as a style reference?

Yes, with one exception. The passages the style skill names (the opening, `#composite`,
`#covering`, `#writes`) are intact or improved. The page's averages, 42 words a paragraph
and 16.3 a sentence, sit on the Sam Who calibration. One running model carries the page:
the 36-order toy, the 60,000-order table and the history query. Figures still come every
few paragraphs, and each one is set up, watched and then named.

The exception is `#fates`. It is the only new teaching section, and future writers will
copy it as the pattern for "add a missing concept". As it stands, it gives the rule
before the example, uses a coined label, and depends on the next section. Repaired as in
finding 1, it would match the exemplars around it. Until then, the style skill shouldn't
name it alongside them.

## Two companions or one?

Keep two. The evidence on the pages supports the writer's decision:

- The two companions share no part on the map.
- They link to each other once in body text (the companion's symptom table points to
  Maintaining's "Invalid indexes") and otherwise only in sources.
- They open on different readers' questions: a slow query in hand, against an index set
  over time.

A merged page of about 36 minutes would put a reader with a slow query behind rebuild
and drop procedures they didn't come for. It would also bury Maintaining's reference
queries in the middle of a long page.

The cost of two pages is about 400 words of duplicated framing. That is cheaper than the
navigation cost of one page.

The map calls Maintaining "short". At 16 minutes it isn't, but most of the difference
from the comparison's 12 is four engines' SQL, which readers copy rather than read.

## Do the moved sections sit well in their new homes?

- **`postgresql/indexes/#like`: yes.** It sits under "Operator classes", which is what
  `text_pattern_ops` is, and it is the best-written section on that page. The house voice
  meets the host page's older register ("The index method supplies a structure; the
  operator class supplies the relevant meaning"). The seam is audible but harmless. Only
  the experiment link needs retargeting (finding 6).
- **`query-execution/#refresh`: yes.** It follows directly from the host's sentence
  "If the data has changed since it was last analysed, refreshing the existing statistics
  may be enough", which is a natural lead-in. It is a four-engine list on a page that
  otherwise uses PostgreSQL alone, but the h3 states its scope. Its inbound links should
  target it (finding 6).
- **`large-results/#page-cost`: the content belongs, the placement doesn't.** It is the
  measured index half of the page's keyset argument, and it fills a gap the host page
  admitted ("Mixed directions or nullable ordering fields require…"). But it was dropped
  in above host material, and it brings its own dataset (a 60,000-order feed) into a page
  whose running example is C4 and O15. Finding 2 fixes the placement. One clause tying
  the feed to the host's orders table ("the same orders, at scale") would ease the
  switch.
- **`postgresql/indexes/#bloat`: the right home, in the wrong place on the page** (finding
  5).

## Verdict: ready after the listed repairs

The restructure did what the comparison asked:

- layer 3 left the deep dive;
- each part has one home;
- neighbours received their material;
- the gaps are filled: the three fates, SQL Server, the `LIMIT` trap, the catch-all, bulk
  loads and InnoDB's locks.

The site stays whole. The diagnosis section reads as one piece, and the `LIMIT` trap and
catch-all are among the clearest passages in the family.

What keeps this from "ready" is a short list of consequential repairs:

- `#fates`, the reference article's only new teaching section, depends on the section
  after it and misattributes its own measurement (finding 1).
- In Large results, host paragraphs are stranded under the moved heading (finding 2).
- The deep dive's bulk-load advice lacks the condition that would stop a reader
  dropping indexes on a live table (finding 3).

Each repair is a move or a sentence. The workload-design gap (finding 4) and the
`#bloat` placement (finding 5) should go in the same pass. The links and wording notes
can follow.

The time is mostly earned. About 61 of the 70 minutes are reading, and about 2 minutes
can go without losing a condition the reader needs.

## Re-read after repairs

I re-read the three family pages from top to bottom, then the moved sections in Large
results, How a query runs and Indexes in PostgreSQL. I worked from the rendered pages and
the page sources, after the writer's "Review repairs" list in
`restructure-2026-10-18.md`. I also pulled every in-body link with its sentence to check
the wording.

### What the repairs did

- **`#fates` is now sound.** It opens from the paid-only query's `Filter` line ("fetched 12
  rows and threw away 2 pending ones to return 10. Its plan listed `status` under
  `Filter`"). It then names that outcome as "one of three things a condition can do".
  Bullet 1 now says "plus one range on the next". Bullet 3 ends "This is where `status`
  was", which ties the list back to the example. "Fates" has gone from the reader's text.
  The 15-to-5 measurement points forward to `#status-last` instead of borrowing it.
- **One forward reference is left in `#fates`, and it is now harmless.** "With the
  covering index from the next section, which has no `status`" asks the reader to know
  only that the index lacks `status`. Optional repair: "With an index that lacks `status`
  (the covering index of the next section)".
- **`p#status-last` is right.** It says what my first review asked for: "Most of that drop
  came from skipping the table, not from the check itself. The scan still read the same
  entries as before, pending ones included." It sits after Figure 8 and the engine table,
  where "index-only" and "heap fetches" already mean something. The design table now says
  "After the sort columns".
- **`#workload` discharges the missing part.** Four queries (history, order list,
  foreign-key check, pending dashboard) settle into one composite and one partial index.
  The reason is stated: "each fixes `customer_id` and needs at most the columns that follow
  it, in that order". It ties back to Figure 9's write cost. At about 120 words it is the
  right size. Add the row to the map if the writer hasn't already.
- **The covering table's SQL Server column helps.** It carries `INCLUDE`, the clustered
  key in every nonclustered entry, and "Never" for a still-visited table. The last cell,
  "Never; a query the index doesn't cover shows a Key Lookup for each row", answers a
  different question from its row. That is a small oddity, not a fault. Optional repair:
  keep "Never", and move the Key Lookup clause into the sentence before the table.
- **`#upkeep` reads in order.** Bulk loads are now scoped "into a new or empty table". One
  sentence on live builds links to Building new indexes safely. Pruning has its own
  paragraph, and the sentence that opens it now belongs there.
- **Other deep-dive cuts:**
  - `#selectivity`'s three paragraphs merged into one, and 922 of 1,725 now appears once
    in the prose.
  - The clustered 62-page caveat is gone.
  - The bitmap heap scan is glossed where it first appears, in `#range`.

  None of these lost a condition the reader needs.
- **The cuts in Indexing queries are clean.** `#rule` keeps its point in one sentence ("23
  pages, against 62"). `#prefix-indexes`, the BitmapAnd numbers and the duplicate skip-scan
  and `OR` sentences are gone without leaving dangling references. The `#diagnosis` intro
  now points to `#prove` for the ordered checks.
- **The catch-all paragraph is now honest about PostgreSQL's default mode.** Custom plans
  continue, which costs a fresh plan per execution, and the scan appears under
  `force_generic_plan`. It is a little longer, and "in our runs" is the one provenance
  clause it needs.
- **The first-reader fixes are in place:**
  - the opening links Slow queries and explains the `index_orders` name;
  - Figure 1's prose now says "the small index from Indexes’ range-scan figure";
  - the second events table is "a tenants’ events table";
  - the `#queue` SQL Server sentence parses.
- **One InnoDB paragraph now sits under the wrong heading.** It opens "InnoDB always has
  the foreign key’s index, but the same rule bites elsewhere", and is about locking reads
  without a fitting index. It is accurate but no longer about the foreign key named in the
  heading. Optional repair: move it to the end of `#join-side`, or cut it to one sentence.
- **Maintaining's repairs work.** `#empty-or-thin` leads with the sparse `total` index.
  `#reindex` is down to its verdict, the 72 MB to 8 MB result and the link. The SQL Server
  disable passage gains `WITH CHECK CHECK CONSTRAINT`, a condition a reader would
  otherwise miss.
- **All four receiver fixes landed:**
  - In Large results, `#page-cost` now follows the unit-of-paging `<details>`, and
    `#keyset`'s mixed-direction sentence links to it.
  - In How a query runs, `#refresh` ends SQLite bulk loads with plain `ANALYZE`, with the
    reason given.
  - In Indexes in PostgreSQL, `#bloat` comes before a new closing `#choosing` section, so
    the page concludes once. `o_rand` is introduced where `pgstatindex` uses it.

### Link wording

Indexes didn't repeat Storage's overcorrection. Every in-body link names its
destination, and every link text matches the heading it lands on: I checked each anchor
against its target. No sentence reads like "is a question for indexes".

The repair did produce a different repeated formula: the article title as subject, then
the heading tacked on with "in". There are about a dozen of these:

- Deep dive: "Indexing queries measures each case in The column has to stand alone."
  Five more like it point into the companion.
- Companion: "Indexes gives the rules for direction, NULLs and collation in Indexes and
  ORDER BY."
- Maintaining: "Indexes in PostgreSQL shows how to read it, in Bloat, page reuse and
  REINDEX." This form appears three times on that page.

Each sentence is clear on its own. Read in sequence, the capitalised heading in mid-
sentence reads like a typo and the cadence repeats. It also costs words: the heading
restates what the sentence already says.

Smallest repair: put the link on the article name, pointing at the section, and drop the
", in <Heading>" tail. For example, "[Indexing queries](…#bare-column) measures each
case." The link still names its destination and still lands on the right passage. Keep
the heading as link text only where it is the sentence's natural object, as in "as
Expression indexes shows". This is polish, not a blocker, but it is worth doing before
other writers copy the deep dive.

### Time

The pages show 35 + 19 + 16 = 70 minutes. By my count with figures removed it is 34.4 +
18.1 + 14.2; the title line rounds. About 400 words were cut, and about the same amount
was added in `#workload`, `#status-last`, the SQL Server column and the clearer catch-all.
The deep dive gained a minute and the companion lost one.

The breakdown from my first review still holds:

- about 5 minutes are sources sections;
- about 4 minutes are SQL listings readers copy rather than read;
- the deep dive's reading is on the plan's 29 minutes;
- the companions' overrun is SQL Server coverage, Maintaining's four-engine queries and
  measured numbers.

The 70 minutes are earned. The only trims left are the link-formula tails, a few words
each.

### Style reference

- **The opening, `#composite`, `#covering` and `#writes`:** the style skill can keep
  naming all four. They are unchanged apart from three small edits:
  - `#covering` gained `#status-last` at its end, which follows the same break, fix, cost
    pattern ("Most of that drop came from skipping the table");
  - the HOT clause now links "Free space and fill factor";
  - the composite section has one clarified paragraph, "page counts alone can mislead".
- **`#fates`: not yet.** It is now correct and follows the house order: the reader sees
  the `Filter` line, then the term names it. But it is a prose taxonomy with no figure,
  and it still leans one clause on the next section. The four named passages each show
  something a future writer can't get elsewhere. `#fates` would teach them less than
  `#composite` already does. Leave it unnamed. Revisit if a fresh reader picks it out, or
  if a figure ever carries the three outcomes.

### Updated verdict: ready as a draft

The consequential findings from my first review are resolved:

- `#fates` no longer depends on the next section for its evidence or misattributes the
  15-to-5 drop;
- Large results' host paragraphs are back under their own heading;
- the bulk-load advice carries its condition;
- the workload gap has a home;
- the PostgreSQL page concludes once;
- the links land where they promise.

The family reads as one piece with its neighbours, and the 70 minutes are earned. Three
optional repairs remain, none of which changes what a reader learns:

- the "…, in <Heading>" link formula;
- the Key Lookup clause in the covering table;
- the InnoDB locking paragraph under the foreign-key heading.

Passing this review doesn't authorise publication.
