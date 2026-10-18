# Indexes restructure: technical review, 18 October 2026

Perspective: technical reviewer and figure tester for the restructured Indexes family
(`indexes/`, `indexing-queries/`, `maintaining-indexes/`) and the sections that received
moved material (`large-results/#page-cost`, `query-execution/#refresh`,
`postgresql/indexes/#like` and `#bloat`). I read the coverage map's Indexes section, the
writer's note, the six pages' source and rendered HTML, the sandbox lesson,
`experiment.sql`, `verify.mjs` and `observed.json`. I changed no file except this one.

## What I ran

- **`verify.mjs` and `build-experiment.mjs`**, on a copy in my scratchpad so
  `observed.json` stayed untouched. Both passed (10.7 s). The regenerated `experiment.sql`
  is byte-identical to the committed one. The only differences from the committed
  `observed.json` were planner estimates, correlations and the random-key index (222 pages
  this run, 235 committed), all expected to vary.
- **The random-key split check, 200 times** in one PGlite session (`setup.sql`, then the
  lesson's `random_keys` statement repeated). Results are below under Measurements.
- **`experiment.sql` on PostgreSQL 18.6**, in a scratch cluster I created with `initdb`
  (`en_US.UTF-8`, port 55432, TCP only). I left the Homebrew data directory alone. The
  script ran to the end with no errors. I stopped the server afterwards.
- **The patterns experiment** (`docs/article-work/indexing-queries/download.sql`) on the
  same server, to check the paging and LIKE numbers that moved to other pages. It stops at
  line 341 under `ON_ERROR_STOP`, because the soft-delete demonstration's third insert is
  meant to fail. Without that flag it ran to the end.
- **Two extra PostgreSQL runs** on the catch-all prepared statement in the default
  `plan_cache_mode`. Finding 1 is based on them.
- **Every figure** on the deep dive (Figures 1 to 11) and the companion (Figure 1,
  LeadingFigure), in headless Chromium from `playwright-core` 1.62.1. With reduced motion
  on, I stepped every parameter combination with the arrow keys (298 combinations in all)
  and recorded each frame's narration, counters and 60,000-order line. I measured
  overflow and took screenshots at 375 and 1280 px in light and dark. I also checked
  autoplay with motion allowed.
- **Every internal link and anchor** on the six pages (580 links), the external sources'
  status codes, and a grep of `src/` for links to the removed ids.
- **Primary documentation** for each new claim. I re-read the Microsoft pages directly
  (Disable indexes, Fill factor, Missing index suggestions, Filtered indexes, Unique
  constraints, Index design guide), along with MySQL 8.4's Locks set by different SQL
  statements and Persistent Optimizer Statistics, and SQLite's `PRAGMA optimize`. Other
  claims were checked against documentation I know well; the list says which.

## Findings, most consequential first

### 1. The catch-all's generic plan didn't appear in PostgreSQL's default mode

`indexing-queries/#optional-filters`:

> PostgreSQL keeps making custom plans while the generic one looks costlier, so the scan appears only sometimes, which makes it harder to find.

The measured pair is right: `force_custom_plan` gave a bitmap scan of 62 pages, and
`force_generic_plan` gave a sequential scan of 1,725. That is how `experiment.sql` and
`verify.mjs` take them. But in the default `auto` mode, on 18.6, the generic plan was
never chosen. Seven executions with values gave `custom_plans = 7, generic_plans = 0`.
Four executions with NULL and two with values gave 6 and 0. Five NULLs and then a value
also gave 6 and 0. A custom plan for NULL drops the condition entirely, so even the
custom scan is cheaper than the generic scan with its filter, and the generic plan never
looks cheaper on average.

So the page shows a PostgreSQL failure that our own runs couldn't trigger, and leaves out
what the catch-all actually costs there: a fresh plan on every execution. A reader on
PostgreSQL may rewrite a query that was behaving well, or miss the real risk, which is
`plan_cache_mode = force_generic_plan` or a filter mix where the generic estimate comes
out cheaper.

Repair: "A custom plan, made for the value 42, simplified the condition and read 62. In
the default mode PostgreSQL kept choosing custom plans in our runs, even after five
executions with NULL, because a custom plan is never costlier than the generic one here.
The catch-all then costs a new plan on every execution, and it scans for everyone if
`plan_cache_mode` is set to `force_generic_plan`." The SQL Server sentence after it
stands.

### 2. The status-last scan didn't read every entry since 1 February

`indexes/#fates`, a passage in the house reference:

> It still read every entry for customer 42 since 1 February; `status` decided only which of them to return.

Customer 42 has 15 orders since 1 February, and 12 of them are paid. With `LIMIT 10`, the
newest-first scan stops at the tenth paid entry. It read 12 entries, the same 12 the
covering index fetched rows for (`Rows Removed by Filter: 2`). The point being made, that
the status check doesn't narrow the scan, is right. The sentence states it as a fact
that isn't true.

Repair: "It still read the same entries as before, pending ones included; `status`
decided only which of them to return."

### 3. The InnoDB locking paragraph follows a sentence that rules out its case

`indexing-queries/#foreign-keys`:

> InnoDB requires such an index and creates one if none exists. … In InnoDB a missing index costs locks as well as pages.

The MySQL quote is accurate. The manual says a locking read, `UPDATE` or `DELETE`
generally sets record locks on every index record it scans, and that with no suitable
index "every row of the table becomes locked". But the foreign-key check can't lack its
index in InnoDB, as the paragraph before says. The reader is left wondering which index
is missing. The real case is an application `UPDATE` or `DELETE` whose own `WHERE` clause
has no fitting index.

Repair: "InnoDB always has the foreign key's index, but the same rule bites elsewhere. A
locking read, `UPDATE` or `DELETE` locks every index record it scans, so one whose `WHERE`
clause has no fitting index locks every row of the table, MySQL's manual warns, and blocks
other users' inserts until the transaction ends."

### 4. The filtered-index claim under parameters cites a page that doesn't make it

`indexing-queries/#parameters`, and the queue pattern after it:

> A filtered index isn't used for a condition on a parameter or local variable at all, because the value is unknown at compile time.

The behaviour is well established. But the cited source, Microsoft's Create filtered
indexes, no longer says anything about parameters, and neither does the Index design
guide. The writer's note names Tim Chapman's "The Pains of Filtered Indexes", but the
page's sources list doesn't include it. A reader who follows the link to check the claim
won't find it.

Repair: add Chapman's post, or Paul White's write-up of filtered indexes and
parameterisation, to the SQL Server line of the sources, next to Query hints.

### 5. Re-enabling a disabled unique index doesn't re-enable its foreign keys

`maintaining-indexes/#drop-safely` says correctly that disabling a unique index disables
the foreign keys that reference it. The trial-drop listing then says the undo is `ALTER
INDEX … REBUILD`. Microsoft's Disable indexes and constraints page adds that after the
rebuild, "all constraints must be manually enabled" with `ALTER TABLE … CHECK
CONSTRAINT`. A reader who rehearses a drop on a unique index and rebuilds it is left with
foreign keys silently off.

Repair: after "Disabling a unique index also disables the foreign keys that reference
it", add "and they stay off after the rebuild until you re-enable them with `ALTER TABLE
… WITH CHECK CHECK CONSTRAINT`".

### 6. `PRAGMA optimize` may skip a table after a bulk load

`query-execution/#refresh`: "Finish each one with `ANALYZE` … `PRAGMA optimize` in
SQLite." SQLite's documentation says `optimize` analyzes a table only if one of its
indexes has no statistics, or its row count has changed ten times over since the last
`ANALYZE`. A load that doubles an analyzed table is skipped. The same bullet's advice to
run it after creating an index is right, because a new index has no statistics.

Repair: "`ANALYZE` in SQLite, since `PRAGMA optimize` skips a table that has grown less
than tenfold".

### 7. Smaller accuracy points

- **`nvarchar` against `varchar`** (`indexing-queries/#types`). The scan happens with SQL
  Server's `SQL_` collations, which include the US-English install default. Under Windows
  collations SQL Server can still seek, through a computed range. The writer left this out
  on purpose. One clause, "under the common `SQL_` collations", would keep a Windows
  collation user from reading the claim as false.
- **Two links stop short of the moved section.** `indexing-queries/#stale` and
  `maintaining-indexes/#when-rebuild` both promise "when each engine refreshes its
  statistics", but link `query-execution/#estimates`, the parent section. Point them at
  `#refresh`.
- **The coverage map's `#types` row** still says "PostgreSQL table kept as reference".
  The writer cut that table, and the page sends readers to the PostgreSQL series instead.
  Update the row so the next writer doesn't restore it.

## Claims checked and sound

- **The three fates, and `Index Cond` against `Filter`.** These match PostgreSQL 18's
  Multicolumn Indexes page: leading equalities plus one inequality limit the scan, and
  later columns are "checked in the index". On 18.6, `status` appeared under `Filter` (12
  fetched, 2 removed, 15 pages). With status as the last key column it moved into `Index
  Cond`, in an index-only scan of 5 local pages. Natively that run reported `Heap Fetches:
  1`, left by the earlier update to order 19, so one of the 5 pages is a table page. The
  page never says zero, so the text stands. MySQL's `Using index condition` and SQL
  Server's `Seek Predicates` against `Predicate` are correct.
- **SQL Server.** A primary key creates a clustered index by default. Only one NULL is
  allowed per column in a unique index (Microsoft: "only one null value is allowed per
  column"), and a filtered unique index works around it. JDBC's
  `sendStringParametersAsUnicode` and .NET's `AddWithValue` send `nvarchar`.
  `OPTION (RECOMPILE)` is the fix for both parameter problems. `REORGANIZE` is always
  online and resumable, and `REBUILD` updates statistics. Density needs `SAMPLED` or
  `DETAILED`. Usage counters are emptied at restart, detach or shutdown. The
  missing-index limitations are quoted fairly: no column order, never unique or filtered,
  cleared at restart, "aren't prescriptions". Disabling deletes a nonclustered index's
  data, and a disabled clustered index makes the table unreadable. The fill-factor
  paraphrase is fair: Microsoft advises the default for most workloads and 70 to 95 only
  where page splits hurt.
- **The `ORDER BY` with `LIMIT` trap.** Reproduced on 18.6: 959 rows removed and 33
  pages, then 60,000 removed and 1,894 local pages (PGlite's 1,892, which the page labels
  as PGlite), then 4 and 4 with `(customer_id, placed_at)`. `prefer_ordering_index` is
  the right MySQL switch.
- **The catch-all under forced plan modes.** 62 pages custom, 1,725 generic, as quoted.
  Only the default-mode claim fails (finding 1).
- **The bare-column table.** 49, 1,725, 62, 1,725, 1,725, 1,725 and 62 local pages on
  18.6, which matches the PGlite numbers the page now uses.
- **Building indexes after a bulk load.** PostgreSQL 18 Populating a Database §14.4.3
  (create indexes after `COPY`) and §14.4.8 (run `ANALYZE` afterwards), and MySQL's
  Sorted Index Builds. The SQL Server `ONLINE = ON` edition caveat is right.
- **InnoDB locking**, quoted accurately (finding 3 is about placement only).
- **Statistics refresh in four engines.** PostgreSQL's 50 + 10% threshold, a later
  worker pass, and no automatic `ANALYZE` of partitioned parents, all correct for 18.
  InnoDB recalculates after 10% change and samples 20 pages. Automatic recalculation
  isn't replicated, and `ANALYZE TABLE` is: the manual says so in those words. SQL
  Server's shrinking threshold is right. SQLite's three `PRAGMA optimize` recommendations
  match its documentation (see finding 6 for the bulk-load case).
- **Paging costs** (`large-results/#page-cost`). Reproduced on 18.6 with the patterns
  experiment: 4, 654 and 1,956 pages for offset; 4 for keyset at page 1,000; 654 for the
  mixed-direction expanded form. The script's echo label says "offset 59980", but the SQL
  and the page both use 59,960.
- **LIKE** (`postgresql/indexes/#like`). Reproduced: 442, 16, 16, 16 with
  `lower(email) text_pattern_ops`, 442 for `ILIKE`, 442 for `'%ab1%'`, 135 with trigrams.
- **`postgresql/indexes/#bloat`.** Deduplication is off for `numeric`, floats and
  `INCLUDE` indexes. `pgstatindex` needs `pg_stat_scan_tables`. The `_ccnew` and `_ccold`
  advice matches the REINDEX page, and exclusion-constraint indexes can't be rebuilt
  concurrently. Plain `REINDEX` blocks planning through the index lock.
- **The InnoDB rebuild.** `OPTIMIZE TABLE` maps to `ALTER TABLE … FORCE`, and a table
  with a `FULLTEXT` index falls back to a copy. The `size` row of
  `mysql.innodb_index_stats` is the index's page count, confirmed in the manual.

## Measurements

### The random-key split range should widen

Across 200 runs the random-key primary key took 214 to 244 pages: mean 227.3, standard
deviation 6.4. Two runs in 200 (1%) fell below 215, both at 214, and none passed 250. So
the writer's failure at 214 is the expected tail, not a fault, and with the current
bounds `verify.mjs` fails about once in a hundred runs for no reason. The 250 ceiling has
margin; the 215 floor doesn't.

Repair: widen the assertion on line 312 to `>= 205 && <= 255`, which is about mean ± 3.5
standard deviations, and update the comment above it ("200 runs gave 214 to 244, mean
227"). The page's "about 225" and the lesson's "usually between 215 and 245" are both
fair descriptions and can stay.

### New numbers in the lesson and experiment

The lesson's steps didn't change. The new statements (`statusLast`, the bare-column
queries, `catchAll`, the `LIMIT` trap) were added only as exports that `experiment.sql`
and `verify.mjs` use. The deep dive says correctly that the status-last index is in the
download, not the lesson. Every new number in `experiment.sql` reproduced on 18.6, within
the native differences already noted (1,894 against 1,892).

## Figures

- **No console errors** on either page. The 11 interactive figures and the static
  Figure 5 render at 375 and 1280 px in light and dark, with no horizontal page overflow
  and no stage wider than its box.
- **Keyboard.** In all 298 parameter combinations, ArrowRight stepped to the last frame
  and ArrowLeft stepped back. Focus never left the figure, including when Next disabled
  at the end.
- **Reduced motion.** Every figure loads on its final frame and doesn't autoplay. With
  motion allowed, LeadingFigure starts playing when scrolled into view (step 2 of 40 after
  4 s).
- **LeadingFigure after the move.** It is Figure 1 on Indexing queries, the text refers to
  it as Figure 1, and the deep dive now numbers 1 to 11 with no gap. Its narration and
  counters agree in both settings: 8 of 9 index pages, 36 entries tested and 5 matches for
  `placed_at` only; 3 pages and 2 entries for customer 42. Its 60,000-order line now names
  customer 650's one order in the window. That fixes the earlier review's finding 2, and
  matches `observed.json`.
- **LeadingFigure overrides a built-in method.** The class defines `matches(mode, i)`
  (`LeadingFigure.astro` line 41), which replaces the browser's `Element.matches` on that
  element. Playwright's selector engine threw `Cannot read properties of undefined
  (reading 'day')` when it tested the element. Two site scripts call `.matches()` on
  arbitrary elements: `player.ts` line 68, on the keydown target, and `theme.js` line 34,
  on parsed nodes. Neither reaches the figure element in normal use today, but one
  delegated listener would. Rename the method, for example `isMatch`.
- **Counter plurals.** The fixed labels give "1 entries tested" (LeadingFigure, customer
  setting) and "1 entries returned" (Figure 4), beside a correct "1 match".
- **Figure 8 at 375 px.** The leaf-page dates run together ("21 Jan11 Jan"). This was
  there before the restructure and is cosmetic.

## Links and site wholeness

- None of the 580 internal links on the six pages is broken, and every anchor resolves.
  The links into moved sections work: `#page-cost`, `#like`, `#bloat`, `#refresh`,
  `#diagnosis`, `#bare-column`, `#plans` and `#fates`.
- `grep` of `src/` finds no link to any removed id (`#ignored*`, `#page-index`,
  `#offset-cost`, `#keyset-index`, `#keyset-traps`, `#conditions`, `#combining`, `#and`,
  `#reuse`, `#updates`, `#failed-rebuild`, `#build-time`, `#stats*`). `#tenants` survives
  as a paragraph id.
- No redirects were needed, since both slugs are kept. The collection entries in
  `relational-collection.ts` carry the new title and scope, and the companions stay
  marked draft.
- Every external source outside dev.mysql.com returned 200. All 26 MySQL links returned
  403 to curl, which is bot-blocking, not a dead link. The two I fetched through a browser
  agent loaded normally.

## Verdict

**Ready after the listed repairs.** The restructure holds together technically. Every
moved number I could rerun reproduced on PostgreSQL 18.6. The SQL Server additions match
Microsoft's documentation almost line for line. The links and anchors are whole, and the
moved figure works in every setting. The repairs are small, but four of them would
mislead a practitioner who acted on the page. Finding 1 describes a PostgreSQL failure
that didn't happen in our runs and hides the real cost. Finding 2 is a false sentence in
a house-reference passage. Finding 3 places a locking warning where it can't apply.
Finding 5 would leave foreign keys disabled after a rehearsal. Each is a sentence or a
source to change, along with widening the split assertion in `verify.mjs`. None needs
new measurement beyond what this note records.
