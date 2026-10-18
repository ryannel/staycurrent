# Indexes: technical and figure review, 18 October 2026

Perspective: technical reviewer and figure tester. I read the rendered page, its source, the twelve figure components, the sandbox lesson, `experiment.sql`, `verify.mjs`, `observed.json`, `evidence.md` and the style-pass note. I changed no file except this one.

## What I ran

- **`verify.mjs`**, on a copy in my scratchpad so `observed.json` stayed untouched. It passed in 7.5 seconds. The only differences from the committed `observed.json` were planner estimates, correlations and the random-key count (226 pages this run). All three are expected to vary.
- **`build-experiment.mjs`**, on the same copy. The regenerated `experiment.sql` is byte-identical to the committed one.
- **`experiment.sql` on the local PostgreSQL 18.6 server** with `psql -f`, in an `en_US.UTF-8` database. It ran to the end with no errors. Every count I compared matched the article: 1,725, 62, 70 + 3, 922, 365 + 12, 1,426, 12 rows from the BitmapAnd, 62 / 57 / 13, 13 → 4 → 5, 2 heap-filter rejects, 4, 47, 166, 57, 234 and 5. The random-key count was 222. I started the server for this and stopped it afterwards.
- **The `en_US` results on the unified table**, which `evidence.md` doesn't record. A `LIKE 'Shopper0042@%'` was a Seq Scan of 1,725 pages. With `text_pattern_ops` it read 62. `ORDER BY email LIMIT 10` used the index, and `COLLATE "C"` added a Sort. `'Zoe'` sorts before `'adam'` under `"C"` and after it under `en_US`. The article's numbers stand.
- **The shuffled copy and the leading-column window**, in PGlite (three runs) and on the server. Both problems below come from these runs.
- **SQLite 3.51.0**, for the mixed-direction wording. `USE TEMP B-TREE FOR LAST TERM OF ORDER BY` is correct.
- **The figures**, in a private headless Chromium. I stepped every parameter combination of Figures 8, 10, 11 and 12 with the keyboard and recorded each frame's narration, counters and 60,000-order line. I took screenshots at 1280 and 375 px in light and dark, with `prefers-reduced-motion: reduce`. I also walked Figure 1 on `/learn/databases/relational/postgresql/indexes/`. I re-simulated Figure 10's shuffle in Node.

## Findings, most consequential first

### 1. The shuffled-copy comparison mixes two tables

> On a copy with the same rows in random order, the bitmap scan at 500 touched 1,715 of the 1,725 pages instead of 922.

The shuffled copy is not 1,725 pages. It is 1,715 pages in PGlite (three runs out of three) and on the 18.6 server. The bitmap scan read every one of them: `Heap Blocks: exact=1715`. So the sentence takes a count from one table and a total from another. The real result is stronger: the scan touched the whole table.

Repair: "touched all 1,715 pages of the copy, against 922 of the original's 1,725." In `verify.mjs`, record the copy's own size and assert that `tablePages` equals it, not just `> 1700` (line 354).

### 2. Figure 12's customer line measures a query that returns nothing

In the "customer_id and placed_at" setting, the line under the counters reads:

> At 60,000 orders, a 30-minute window: 3 pages with customer_id = 42 as well

The window, 1 February 00:00 to 00:30, holds customers 641 to 670. Customer 42 has no order in it, and `observed.json` records `leading.withCustomer.rows: 0`. A reader beside a figure that finds customer 42's order will assume this one did too. `verify.mjs` records this case (line 306) but asserts nothing about it.

Repair: pick a customer who is in the window, such as 650, and assert one row. Or write "3 pages, and customer 42 has no order in that window". The first is better.

### 3. The forced index scan didn't jump around the table

> The forced index scan read 1,426 pages against the scan's 1,725. It saved about a sixth of the pages, but its reads jump around the table, so the planner priced it higher.

That's not what happened. Since PostgreSQL 12, a B-tree sorts equal keys by heap TID, and deduplicated posting lists are in TID order too. So an index scan over all the `'paid'` entries reads the table forwards, page by page, and skips the pending blocks. The server run confirms it: the first `ctid`s returned were (29,14), (29,15), (29,16). `Buffers: local read=1426` means each page was read once.

The planner priced the index scan at 5,663 to 5,699 against the scan's 2,475 for two reasons:

- The `status` correlation is only 0.64, so the cost model charged many of those pages at `random_page_cost`.
- It added a cost for each of the 48,000 entries.

So the reads were never random. The planner just expected some of them to be. A reader who takes the sentence at face value learns the wrong thing about how B-trees store duplicates.

Repair: "It saved about a sixth of the pages, but the planner expected many of those reads to land at random and charged for each of the 48,000 entries, so it priced the index scan at more than twice the scan."

Also align the lesson. Step 6 still says 1,426 pages is "barely fewer than the scan" (`indexes.ts` line 194), while the article now says "about a sixth".

### 4. "Still about 62 pages" changes the unit

> Each descent starts from the same few upper pages, which the first one has already brought into memory. So the total is still about 62 pages, reached by 60 searches instead of 60 direct jumps.

The article's unit is PostgreSQL's `Buffers`, which counts every page visit, including hits in memory. On that count, a key-ordered table would show about three visits per row: 60 descents times the depth of the table's tree, roughly 180 or more. The figure of 62 counts different pages. The 17 October text kept that distinction with "about one bottom page per row plus a few shared ones". This pass dropped it.

Repair: "So it reads about 62 different pages, but each descent also re-reads the upper pages from memory, which a counter like `Buffers` would count."

### 5. The two inferred engine cells are right; tighten one, and re-file the evidence

- **SQLite, "Never" in the covering table.** This is documented, not inferred. "The SQLite Query Planner", §1.7, says that with a covering index "SQLite never needs to consult the original table". The reason the cell gives (no reader sees index and table at different versions) is sound. Move the `evidence.md` row from inferred to documented, citing §1.7.
- **SQL Server, "a filtered index with WHERE email IS NOT NULL allows more".** The inference holds. "Create Filtered Indexes" says filters "can be applied to indexes with the UNIQUE property", and rows outside the filter are not in the index, so they can't conflict. Two words would make the cell exact: "One; a filtered *unique* index with `WHERE email IS NOT NULL` allows *any number*". Add the filtered-index sentence to the evidence row.

### 6. The collation example needs its LIMIT

> In a database using en_US.UTF-8, ORDER BY email used the index and ORDER BY email COLLATE "C" sorted.

Without a `LIMIT`, `ORDER BY email` is a Seq Scan and Sort under any collation. The next bullet says exactly that. The measured query had `LIMIT 10`. A reader who tries the bare `ORDER BY email` will see a Sort and blame the collation.

Repair: write `ORDER BY email LIMIT 10` in the bullet.

### 7. Indexing common query patterns: the numbers agree, the wording doesn't

The companion's orders table (`docs/article-work/indexing-queries/setup.sql`) has no `email`, uses `repeat('delivery note ', 12)`, and is a permanent table with a foreign key. Indexes now has `email` and `repeat('leave at the door ', 8)`. The tuples are still the same width: 24 + 145 bytes of text against 169. So the row placement and every count the companion shares with Indexes still agree: 1,725 table pages, 62 for customer 42, and 52 for the customer index. Three repairs, all on the companion page or the link into it:

- Line 92 says "The tables are the same". Change it to "The orders rows and their pages are the same; Indexes' copy also has an `email` column."
- Three links still use old Indexes headings as their link text:
  - "Combining two indexes instead" (line 243) is now "Combining indexes";
  - "Indexing for a query" (line 181) is now "Designing an index for a query";
  - "The column is wrapped in an expression" (line 186) is now "The column is wrapped, converted or compared by pattern".
- Indexes says `#bare-column` "measures each case in PostgreSQL, MySQL and SQLite" (`indexes.astro` line 369). The companion measured PostgreSQL and SQLite but takes MySQL from its manual. Say "measures each case in PostgreSQL and SQLite, with MySQL's rules from its manual."

### 8. Some quoted numbers can't be reproduced from the lesson or the download

"Where the numbers come from" says the lesson "repeats the measurements, with the number to expect at every step". Five quoted numbers exist only in `verify.mjs`:

- the oldest-40,000 delete (109 of 164 leaf pages), in Figure 11's line and fallback;
- the shuffled copy, in Selectivity;
- the customer-plus-window lookup, in Figure 12's line;
- the 4.2 and 5.6 MB write-ahead log figures, in Figure 9's line;
- the Incremental Sort and no-`LIMIT` order plans, which the download has but the lesson doesn't.

Repair: add them to the download, at least, or name them in "Where the numbers come from" beside the depth and stale-statistics tables. Also add an `evidence.md` row for the `en_US` re-measurement on the unified table. My server run above can serve as that record.

### 9. Smaller points

- **Counting convention.** The reversed index's 57 pages include 3 shared catalog-buffer hits: 54 local plus 3 shared, in PGlite and on the server. The leading-column count deliberately excludes shared hits. This doesn't change any conclusion, but a reference should count one way. Either report 54, or count shared hits everywhere.
- **MySQL cell in the covering table.** `(customer_id, placed_at, total)` puts `total` before the primary key that InnoDB appends. Ties on `placed_at` would then sort by `total`, so this index would not serve the history query's `ORDER BY placed_at DESC, order_id DESC` without a sort. `(customer_id, placed_at, order_id, total)` keeps the example honest.
- **Figure narration.**
  - Figure 12, root step: "42 is 42 or above, so follow the lower pointer" reads like a slip. Try "42 is not below 42, so follow the ≥ 42 pointer."
  - Figure 11, delete step: "The rows are gone" isn't true in PostgreSQL. The rows are dead but still on the table pages until `VACUUM`. Try "The rows are deleted, but their index entries stay…"
  - The counters print "1 matches" (Figure 12) and "1 heap fetches" (Figure 8).
- **375 px.** In Figure 8, the three-option "Table" control wraps "After an update" onto a row of its own. The 60,000-order line also leaves "1" alone on its last line. Both are cosmetic.
- **Shared player, not new.** When stepping with Enter on Next, the last frame disables the focused button, and focus drops to the page body. Moving focus to Replay or Back when Next disables would fix it for every figure.

## What works and should be kept

- **The unified table is well made.** The shorter note exactly offsets the new `email` column, so the row placement and the 1,725-page table survive. The article, lesson and download all derive from one file of SQL constants. `verify.mjs` asserts nearly every quoted number, and the download reproduces them on a native server. This is the method future articles should copy.
- **Figure 8's third state is an accurate teaching choice.** Order 59040 (customer 41) shares a page with customer 42's newest order. One update gives `Heap Fetches: 1` and 5 pages, and the figure mirrors it exactly with orders 19 and 21 on page 3. The narration ("although order 21 itself did not change"), the counters, the 60,000-order line and the text alternative agree at all six settings. The PostgreSQL companion page is unchanged apart from "ticked when set", which its prose already says. It shows no 60,000-order line, as intended.
- **Figure 10 does what its text says.** Re-simulated, the ordered row ends as 5 pages of 15/16. The shuffled row ends as 7 pages (12, 10, 8, 12, 15, 10, 8 entries) after 6 splits, 67% full against 94%, as the narration and fallback state. The InnoDB fill levels match the MySQL 8.4 manual.
- **Figure 11 matches PostgreSQL's rules.** Scattered deletes leave six third-full pages. Contiguous deletes leave four empty, reusable pages and a six-page file. Both match the nbtree README (only empty pages are removed; partly full pages are never merged) and the measured 166 → 57, with 109 of 164 leaves deleted.
- **Figure 12's model is right in both settings.** The five matches are customers 16, 27, 42, 64 and 79. "8 of 9" pages are read without the customer and 3 of 9 with it, and the text alternative says the same.
- **The 17 October fixes are intact.** The Index Cond bullet now says a later-column condition can be checked entry by entry, and links to the leading-column case. The SQL Server NULL row is in the engine table.
- **No reader-facing condition was lost when engine asides were gathered.** I compared every removed engine sentence with the new text. InnoDB's fallback without a primary key, InnoDB's covering-index fallback, SQLite's unlinked leaves and the absence of SQLite usage counters are all present. The unused-index cautions now live in Maintaining indexes, `#drop-unused`, which carries all of them: replicas, counter resets, rare jobs and constraint indexes. The only detail dropped is InnoDB's `ALGORITHM`/`LOCK` clauses, which the reader doesn't need here.
- **Claims I checked and found correct:**
  - InnoDB: 15/16 and 1/2–15/16 page fill, `MERGE_THRESHOLD` 50, online secondary index builds, the automatic foreign-key index, index merge `Extra` values, `Using MRR`, MySQL's NULLs-first ordering and the index-hint deprecation note.
  - PostgreSQL: fillfactor 90 when extending at the right, `NULLS NOT DISTINCT` from 15, `uuidv7()` in 18, `INCLUDE` on B-tree/GiST/SP-GiST, uniqueness only on B-tree, multicolumn GIN/GiST/BRIN, and `BUFFERS` included by default in 18.
  - SQLite: one index per table, `MULTI-INDEX OR`, leaf pages without links, the expression matching rule and child-key advice.
  - SQL Server: a primary key clustered by default, no automatic foreign-key index, computed-column indexes, usage counters and `SET STATISTICS IO`.
- **Light, dark, 375 px and reduced motion all hold up.** No page-level horizontal scroll at 375 px. Labels stay legible: the smallest, Figure 12's dates, render at about 8 px, and the faded ones are deliberately dim. With reduced motion, every figure loads on its last frame and doesn't autoplay. Keyboard: segmented buttons respond to Enter, the figure responds to the arrow keys, and the scrubber responds to Home and the arrows. Focus rings are visible. No console errors.

## What I couldn't check

- No MySQL or SQL Server instance was available. Those claims rest on their documentation.
- I didn't use a screen reader. I checked only the markup: the status line is `role="status"`, and each SVG's `aria-describedby` points to the fallback text.
- Dark mode was tested through `prefers-color-scheme` only, as the brief asked. The `data-theme` override path wasn't exercised.
- I didn't test on real touch devices, and I didn't run `pnpm build` or the site check.
- I didn't re-run the depth measurement (`--depth`) or the stale-statistics table. Both are carried over from earlier runs.

## Verdict: ready after the listed repairs

The measurement base is now what a reference article should have. There is one table, one source of SQL, an automatic check, and a download that reproduces the numbers on a real server. The four new or changed figures teach what their prose and captions say, at every setting, in both themes and on a phone. Three repairs are needed before writers are told to copy the page, because each one teaches something untrue or compares the wrong things:

- the shuffled-copy sentence quotes a total from a different table;
- Figure 12's customer line measures a query that found nothing;
- the forced-scan sentence explains the planner's cost with a mechanism that didn't happen.

The 62-page conversion and the collation `LIMIT` are one-line fixes of the same kind. Everything else on the list is small, and none of it changes what the reader learns.

## Recheck after repairs

The writer's account is under "Repairs" in `style-pass-2026-10-18.md`. I rechecked every earlier finding and the new material against the current files. I changed no file except this one.

### What I ran

- **`verify.mjs`**, on a fresh scratch copy. It passes in 8.4 seconds. Against the committed `observed.json`, only planner estimates, correlations and the random-key count changed (220 pages this run).
- **`build-experiment.mjs`**. The regenerated `experiment.sql` is byte-identical to the committed one.
- **All 25 lesson steps in the real sandbox page**, in headless Chromium, one run per step as a reader would press Run. Every expected value matched. The random-key step gave 234 pages, inside the stated 215 to 245.
- **`experiment.sql` on the local PostgreSQL 18.6 server.** It ran to the end with no errors, and the new parts reproduce:
  - order 7 with `status = 'pending'`: 3 pages;
  - customer 650 in the window: 4 pages;
  - stale statistics: 723, then 120,723 for the nested loop and 1,565 for the hash join;
  - the forced scan: 1,426 pages, estimated cost 5,676.

  I started the server for this and stopped it afterwards.
- **PGlite probes** of the unique index's layout, the bitmap scan's cost estimate and the stale-statistics plans.
- **The figures.**
  - I stepped all eleven animated figures by keyboard at 1280 px in light mode, recording every frame.
  - I screenshotted every setting of every figure at 375 px in light and dark, with reduced motion, and Figures 6, 8 and 12 at 1280 px in dark.
  - I walked Figure 1 on `/learn/databases/relational/postgresql/indexes/` at 375 px in dark.
  - I tested focus at the first and last frames on three figures across both pages.
- **Links.** Every in-page and cross-page anchor the article uses resolves on the dev server.

### Earlier findings

All nine are repaired.

1. **Shuffled copy.** The sentence now compares 1,715 pages of the copy with 922 of the original's 1,725. `verify.mjs` records the copy's size and asserts the scan read every page.
2. **Figure 12's customer line.** It now names customer 650, whose one order falls in the window: 4 pages. The value is asserted, it is in lesson step 21, and the sandbox and server both show 4.
3. **Forced index scan.** The text now matches the plan and the cost model. I rebuilt the estimate from PostgreSQL's formula, and it comes out at about 5,660:
   - about 4,650 for reading the table, because a correlation of 0.64 leaves most of the page reads priced as random;
   - about 840 for checking the 48,000 entries and rows;
   - about 170 for the index's own pages.
4. **The clustered conversion** now says "about 62 different pages", and that `Buffers` would also count the re-read upper pages.
5. **Engine cells.** The SQL Server cell now says a filtered unique index allows any number of NULLs. The `evidence.md` row for SQLite now cites the query planner's §1.7 as documented.
6. **Collation.** The bullet has `LIMIT 10`.
7. **Indexing common query patterns.** Indexes now says the companion measured PostgreSQL and SQLite. The companion's three link texts match the current headings, and its sentence about the tables now names the `email` column.
8. **Reproducibility.** The lesson now covers the selective `AND`, customer 650, the two ordering cases and stale statistics. "Where the numbers come from" names the runs that remain outside it, and `evidence.md` has a row for each, plus the `en_US` re-measurement.
9. **Smaller points.**
  - Pages are now counted one way: local buffers only. The reversed index is 54 in the article, Figure 7, the lesson and `verify.mjs`, and lesson step 9 says "local".
  - The MySQL covering cell is `(customer_id, placed_at, order_id, total)`.
  - The narration slips are fixed: "1 heap fetch", "1 match", "42 is not below 42", and rows that are "deleted", not "gone".
  - Figure 8's three table states fit on one row at 375 px, and its 60,000-order line no longer strands a "1".
  - The focus fix works:
    - Pressing Next on the last frame moves focus to Replay.
    - Pressing Back on the first frame moves it to Next.
    - Enter on Replay restarts the figure.

    It behaves the same on both pages that use these figures.

### New material

- **Figure 6's "Table order" control.** Every number checks out against the model.
  - Scattered: the third step matches 8 rows (22%) on all six pages.
  - By customer: 22 rows sit on 4 pages, and the matches reach all six only at 32 rows (89%).

  The narration, counters, text alternative and both 60,000-order lines agree.
- **The 60,000-order table's layout claims** follow from `setup.sql`:
  - `customer_id = 1 + n % 1000`, at about 34.8 rows a page, so a page holds about 35 consecutive customers;
  - the `customer_id` correlation is 0.016 to 0.018;
  - the pending orders are those where `(n / 1000) % 5 = 0`: 999 in the first block, eleven blocks of 1,000 and order 60,000, so exactly 12,000 rows on 365 pages.
- **"Searching a clustered table" and its engine table.** Every cell matches the InnoDB, SQLite and SQL Server documentation. That includes InnoDB's fallback to the first unique non-null index, then a hidden row ID, and SQL Server's heap when no clustered index exists. Figure 5 is static and draws customer 42's four entries (orders 3, 11, 21 and 36) going to bottom pages 0, 1, 3 and 5, as the text says.
- **The combining rule.** `order_id = 7 AND status = 'pending'` is an Index Scan on the primary key with `status` under `Filter`, 3 pages, in PGlite, the sandbox and on the server.
- **Stale statistics.** I saw the same plan shapes and counts in all three places. Temporary tables are a sound choice here, because autovacuum never touches them.
- **Lesson steps.** All 25 run in the sandbox and match their expected text.
- **Wording that changed.** The skip scan paragraph is right about PostgreSQL 18 and fair to MySQL's and SQLite's narrower versions. The `text_pattern_ops` gloss matches the operator-class documentation. The forced-scan paragraph cites the nbtree README for equal keys in table order, which is the right source.
- **Light, dark, 375 px, reduced motion.**
  - There is no page-level horizontal scroll at 375 px. The new engine table scrolls inside its own region, like the other tables.
  - With reduced motion, every figure loads on its last frame and doesn't autoplay.
  - There were no console errors.
  - Figure 1 on the PostgreSQL page still has Before and After only, and no 60,000-order line.

### New findings

None of these teaches something untrue. The first two are worth fixing in the same pass, because each is one sentence and each makes a mechanism exact.

1. **Why the planner treated the shuffled copy the same (line 127).**

   > The planner still switched at the same point. Its one measure of physical order is the correlation between a column’s values and the order of the rows, and customer numbers that restart every 1,000 rows score close to 0, as shuffled ones do.

   This suggests the planner checked the correlation and found the two tables alike. In fact, PostgreSQL's bitmap scan estimate doesn't use the correlation at all. It treats the matching rows as spread at random. The sandbox's plan at 500 shows `cost=334.95..2431.99`, and that splits exactly into three parts:
   - 334.95 to build the bitmap;
   - 1,725 for reading every table page at sequential cost;
   - 372.04 for checking the 29,763 estimated rows.

   So the planner expected the bitmap scan to read every page of either table. It chose that scan only because it checks fewer rows than a full scan.

   Repair: "The planner still switched at the same point, because it can't see the difference. Its bitmap estimate treats the matches as spread at random, so at 500 it expected to read every page of either table."
2. **The hash join's 1,565 pages (line 369).** "The planner chose a hash join, which read each table once: 1,565 pages". That is the 842-page deliveries table plus 723 pages for the new events through the `kind` index. A reader who has just seen that a full scan of the events table costs 1,552 pages can't make 1,565 from "each table once". Repair: "which read the deliveries table once and the new events once through the index: 842 + 723 = 1,565 pages."
3. **"234 pages: the whole index" (line 354, Figure 12's line and text alternative, and the evidence row).**
   - The 234 pages are 232 index pages (the root, one branch page and all 230 leaf pages) plus the 2 table pages that hold the 30 rows.
   - The index file also happens to be 234 pages: a metapage, the root, two branch pages and 230 leaves.

   The point stands, but "every leaf page of the index" is exact where "the whole index" is only close.
4. **SQLite in the clustered-table table (line 107).** The row asks what orders a table without a primary key. SQLite's cell answers "The rowid, which a column declared `INTEGER PRIMARY KEY` becomes", which is about tables that have one. The fact a reader needs is that SQLite orders a rowid table by rowid even when it declares a different primary key. Repair: "The `rowid`, even when another primary key is declared".
5. **Figure 6, small things.**
   - In "By customer", step 15 says "Both index routes read only those pages" when the matches already cover all six. From that point, the scattered wording fits: "a bitmap heap scan or a sequential scan reads 6 pages".
   - The "Table page visits" label sits flush against the bottom row of the table drawing at both widths. That is cosmetic.
6. **Housekeeping.**
   - `evidence.md` still has the superseded row in the style-pass table that reads "with `customer_id = 42` added, 3 pages". The repairs table replaces it, so mark it superseded.
   - The download leaves out the write-ahead log test. That is a sound choice, because it creates permanent tables and runs `CHECKPOINT`. But "Where the numbers come from" says the script runs the lesson's measurements, so a clause naming the exception would close the gap.

### Still not checked

- I had no MySQL or SQL Server instance and used no screen reader.
- I didn't exercise the `data-theme` override path or test on touch devices.
- I didn't run `pnpm build` or the site check.
- The depth table is carried over from an earlier run, because `verify.mjs` ran without `--depth`.

### Updated verdict: ready as a reference

The three errors that made the first verdict conditional are gone. Each now matches the plan output, and `verify.mjs` checks each one.

- The method holds end to end: the article's numbers come from one table, and `verify.mjs`, the sandbox lesson and the download on a native server all reproduce them.
- The new section, figure control and examples are accurate.
- The figures pass on keyboard, in both themes, at 375 px and with reduced motion.

What remains is precision, not error. The bitmap-estimate and hash-join sentences are worth fixing before writers copy those passages, and the rest is small.
