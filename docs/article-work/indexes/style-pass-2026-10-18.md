# Style pass, 18 October 2026

What changed in the Indexes reference article, and why. The page is `src/pages/learn/databases/relational/indexes.astro`.

## One table for every measurement

Before this pass, the article quoted two generated tables. One was the sandbox's 60,000-order table, with 1,725 pages. The other, on the 18.6 server, added `email` and `shipped_at` and had 1,936 pages. So the status, leading-column and wrapped-email numbers didn't compare with the rest.

Now `setup.sql` builds one table with `email` from the start, and a shorter delivery note keeps it at 1,725 pages with the same row placement. Every comparison on it was measured again in PGlite. Three files moved together:

- the article;
- the sandbox lesson, `src/lib/sql-lessons/indexes.ts`, which now has 22 steps;
- the download, `experiment.sql`, which `build-experiment.mjs` regenerated.

`verify.mjs` checks every quoted number and passes. Its output is in `observed.json`, checked on 2026-10-18.

Two other tables stay, each introduced once in plain words:

- the depth table: separate integer tables of 100,000, 1 million and 10 million rows, in PGlite;
- the stale-statistics table, on the 18.6 server.

The `LIKE` and `COLLATE` results need an `en_US` database. They were measured on the server with the unified table, which also has 1,725 pages there.

Each figure now shows the large-table number on a line under its counters (`scale()` in `player.ts`, `.ix-scale` in `indexes.css`). The prose keeps at most one large-table number per section.

## Figures

The page has twelve figures, numbered in page order.

| No. | Component | Job |
| --- | --- | --- |
| 1 | ScanFigure | A sequential scan reads every page for four rows |
| 2 | BuildFigure | Sorting entries puts one key's rows side by side |
| 3 | ClusteredFigure | In a key-ordered table, each secondary entry starts a second search |
| 4 | DescentFigure | Every search reads one page per level |
| 5 | RangeFigure | One descent, then along the linked leaves |
| 6 | SelectivityFigure | Matches spread over every page before a fifth of the rows match |
| 7 | CompositeFigure | Column order decides how many entries a query reads |
| 8 | CoveringFigure (`update scale`) | An index-only scan still visits the table where the visibility bit is clear. New third state: an update to another customer's row clears page 3's bit and costs one heap fetch |
| 9 | WriteFigure | Each index adds pages to an insert; HOT keeps an update to one page |
| 10 | SplitsFigure (new) | The same 75 keys in order fill 5 pages at 15/16; shuffled, they split into 7 pages between 1/2 and 15/16 |
| 11 | DeletedFigure (new) | Scattered deletes thin every page; contiguous deletes empty pages that the file keeps; REINDEX compacts |
| 12 | LeadingFigure (new) | With no condition on the leading column, the search walks every leaf; with one, it reads one leaf |

Figure 10 reuses the write-cost figure's mini pages and their fill shading (Figure 8 before this pass, Figure 9 now). Its fill levels are InnoDB's documented ones, and the caption says so and labels the keys as invented.

Every new figure has the following:

- play, step, back, reset and a scrubber, from the shared player;
- a parameter only where it teaches: the delete pattern, or the condition columns;
- a text fallback with the large-table numbers;
- tick and cross marks, so states don't rely on colour alone;
- reduced motion, which jumps to the last frame.

The new figures were checked at 375 px and in both themes. At 375 px, the date labels in Figure 12 overlapped, and so did the tree headings ("ROOT", "BRANCH") in Figures 4, 5 and 12. A compact-only CSS rule now shrinks both, and Figure 12 shortens its heading on narrow screens.

DeletedFigure's parameter was renamed from `mode` to `deletion`, because the segmented control's id clashed with CompositeFigure's on the same page.

## Prose changes

- **Opening.** The preview sentences are gone, and the long sentence about pages is now two paragraphs. The housekeeping paragraph moved to where each point is first needed. The invented 36-order table is introduced beside Figure 1, and the generated table straight after it. `local` is explained in the EXPLAIN section's Buffers item.
- **Engine asides.** These are gathered after each mechanism:
  - Order without sorting: a paragraph on SQLite's temp B-tree, MySQL's DESC key parts and MySQL's NULLs first.
  - Combining: MySQL index merge, and SQLite's one index per table with MULTI-INDEX OR.
  - Covering: a table comparing PostgreSQL, InnoDB and SQLite.
  - Partial, expression and unique indexes: a table across four engines.
  - Building: one paragraph.
  - Selectivity: InnoDB, SQLite and MySQL's Multi-Range Read, in one closing paragraph.
- **Headings.** The new names use field terms, and every id is kept:
  - Indexes and ORDER BY (`#order`);
  - Combining indexes (`#combining`);
  - Write cost and upkeep (`#writes`);
  - Choosing the primary key of a clustered table (`#key-choice`);
  - Deleted rows and index bloat (`#deleted-rows`);
  - Building, finding and dropping indexes (`#upkeep`).
- **Long sentences.** Every sentence over 35 words is split, including the wrapped-columns one (55 words) and the finding-indexes one (46 words, now a list). Paragraphs average about 41 words. A few still run to 60 to 80 words, where splitting would separate a claim from its number.
- **Provenance.** Sentences such as "InnoDB's documentation says" and "the sources give each engine's conditions" moved to the sources list.
- **Moved and dropped asides.** The posting-list aside was cut from the B-tree section; the B-tree docs entry in the sources still covers posting lists. The SQLite leaf-link sentence moved to Range scans, after the figure that shows the links.
- **Design procedure, step 3.** It now asks whether the equality columns narrow the table, replacing "most selective first", which the composite rule contradicts.
- **Forced scan.** The explanation now says the index saved about a sixth of the pages, but its reads jump around the table. It used to say the index "could win by only a little".

## Claims checked

The new claims are logged with sources in `evidence.md`, under "Style pass, 18 October 2026". They are:

- InnoDB's 15/16 and 1/2 to 15/16 fill figures;
- PostgreSQL's fillfactor 90 when extending at the right;
- the nbtree rule that only empty pages are deleted and partly full pages are never merged;
- InnoDB's MERGE_THRESHOLD of 50;
- SQL Server's clustered primary key by default, foreign keys without an index, one NULL per unique constraint, and computed-column indexes;
- InnoDB's online secondary index builds;
- MySQL's automatic foreign-key index;
- SQLite's advice to index child keys.

The 17 October accuracy fixes are kept. Three had been lost in the first draft of this pass and were put back:

- InnoDB's fallback when a table has no primary key;
- SQLite's unlinked leaf pages, now in Range scans after Figure 5, so the leaf links are no longer stated for every engine;
- the note that SQLite keeps no index usage counters.

## Uncertain or worth a look

- The random-key page count varies by run, from 219 to 244 across nine runs. The article, the lesson and Figure 10 say "about 225", and `verify.mjs` accepts 215 to 250.
- The SQLite covering row says a covered query never visits the table. It is inferred from SQLite's snapshot reads, not quoted from its docs.
- The SQL Server NULL row says a filtered unique index allows more NULLs. That is inferred from the filter excluding NULL rows.
- `indexing-queries` says it uses "the orders table from Indexes". The layout is the same, but the table now has an `email` column and a shorter note. Its numbers weren't checked in this pass.
- CoveringFigure is shared with `postgresql/indexes`, where it is Figure 1. The update state and the scale line are behind props that are off by default, so that page is unchanged apart from the caption, which now says the bit is "ticked when set".
- The site check was run against a copy of `dist/` with this page taken from the dev server. The only failure was the dev server's `experiment.sql?no-inline` link, which a real build rewrites. `pnpm build` was not run.

## Repairs

Two reviews followed this pass, `review-2026-10-18-technical.md` and `review-2026-10-18-editorial.md`. Their findings were accepted, and these repairs answer them. `verify.mjs` was re-run afterwards and passes. `build-experiment.mjs` regenerated `experiment.sql`, and every lesson step was run as the sandbox runs it, one query string per step.

### Accuracy

- **Shuffled copy.** The copy is 1,715 pages, and the bitmap scan read all of them. The sentence now compares 1,715 of the copy with 922 of the original's 1,725. `verify.mjs` records the copy's size and asserts the scan read every page.
- **Figure 12's customer line.** The window holds customers 641 to 670, so the line now uses customer 650: one order, 4 pages. The lesson asks for it (step 21), and `verify.mjs` asserts it.
- **Forced index scan.** The scan read forwards, because a B-tree sorts equal keys in table order. The planner priced it higher because the correlation of `status` is only about 0.6 and it charges for each of the 48,000 entries. The text says so, the lesson's step 6 points to the two cost figures, and `verify.mjs` checks the costs, the forward reads and the 1,384 distinct table pages. The nbtree README is cited for the ordering.
- **One counting convention.** Pages are local buffers only. The reversed index's 57 became 54, in the article, Figure 7, the lesson and `verify.mjs`.
- **One-line fixes.**
  - The clustered lookup now says "about 62 different pages", and notes that `Buffers` would also count the re-read upper pages.
  - The collation bullet has `LIMIT 10`.
  - The SQL Server cell reads "a filtered unique index ... allows any number".
  - The MySQL covering cell is `(customer_id, placed_at, order_id, total)`.
- **Numbers the lesson couldn't reproduce.** The lesson now has 25 steps:
  - the selective `AND` in step 7;
  - customer 650 in step 21;
  - a new step 22 for the mixed-direction and no-`LIMIT` orders;
  - new steps 24 and 25 for stale statistics.

  "Where the numbers come from" names the runs still outside it: the shuffled copy, the oldest-rows delete, the two- and three-index write-ahead log figures and the depth table. `evidence.md` has a row for each, plus the `en_US` re-measurement.
- **Figure nits.**
  - Figure 8 counts "1 heap fetch".
  - Figure 12 counts "1 match" and its root note reads "42 is not below 42".
  - Figure 11 says the rows are deleted, not gone.
  - Figure 8's table states are now "Not vacuumed", "Vacuumed" and "Then updated", which fit on one row at 375 px. Its scale value no longer breaks inside "Heap Fetches: 1".
- **Focus.** In `player.ts`, when Next disables on the last frame while it has focus, focus moves to Replay. Back on the first frame hands focus to Next. The fix covers every figure, including Figure 1 on `postgresql/indexes`.
- **Indexing common query patterns.** Indexes now says that page measured PostgreSQL and SQLite and took MySQL's rules from its manual. On the companion, three link texts match the current headings, and the "tables are the same" sentence names the `email` column.

### Structure and wording

- **The 60,000-order table** is introduced before Figure 1 and goes by that name throughout. The text says its line sits under the counters of most figures, because Figure 5 is static and has none.
- **The history query** is defined before Figure 7, so Figures 7 and 8 keep their "History query at 60,000 orders" label.
- **Selectivity.**
  - Figure 6 has a "Table order" control. "Scattered" is the old table. "By customer" stores the same 36 rows in customer order, and the matches reach every page only at 89%.
  - The prose explains the 60,000-order table's layout: customers take turns, so a page holds about 35 consecutive customers. It also explains why the planner didn't tell the two tables apart: both have a `customer_id` correlation near 0.
  - The `status` paragraph says the pending orders arrived in blocks of 1,000.
- **Clustered tables.** A short subsection stays under "Index entries and row locations", mechanism first. The full treatment moved to a new section, "Searching a clustered table" (`#clustered`), after Range scans. It holds Figure 3 (now Figure 5) and an engine table framed as questions. The short subsection's id is `#key-order`. No other page links to `#clustered`.

  The figures were renumbered: B-tree search is now 3, Range scan 4 and the clustered figure 5. RangeFigure's caption now says "Figure 3".
- **One home for the primary-key points.** Random keys splitting table pages, key width and key stability now live only in "Choosing the primary key of a clustered table". The duplicates in Page splits, Write cost and the `#kinds` section are gone.
- **Examples that contradicted their rule.**
  - The forced scan no longer claims to prove the planner right. It reports pages, direction and cost, and sends the reader to time it on their own storage.
  - The combining rule now says when a second index is skipped, with `order_id = 7 AND status = 'pending'` as the measured case.
  - Stale statistics now shows the estimate going wrong, then a join where it changes the plan: 120,723 pages against 1,565.
- **Terms and headings.**
  - "Clustered table" is used throughout, and InnoDB's "clustered index" appears once.
  - "Unique indexes, foreign keys and joins" is the new heading.
  - The OR case has its own heading, `#ignored-or`.
  - Other index types moved to just before "Where the numbers come from".
  - Skip scan is named, and `text_pattern_ops` is explained.
  - Heap is defined once, in Sequential scan, where Figure 1's label first uses it.
  - "Covering every row" is now "a full index".
  - Figure 9's setup names the UPDATE switch.
  - The write-ahead log is defined before its numbers.
  - The design section opens on the query.
- **Source sentences.** These now state the fact directly: the multicolumn rule, the MySQL index hints, the plan note, the NULLs bullet and the sandbox's collation, which moved to "Where the numbers come from". The InnoDB fill levels after Figure 10 were dropped, because the caption gives them. The SQLite leaf-link sentence was cut from Range scans, and the leaf links are now stated as PostgreSQL's and InnoDB's.
- **Two fixes beyond the reviews.**
  - Figure 6's narration used to say a sequential scan reads 4 pages at the second step. It now says all 6.
  - At 375 px, the "36 visits" bar label ran off the drawing. Phones now get shorter bars.

The three exemplar passages are unchanged: column order around Figure 7, the visibility map through Figure 8, and the HOT update paragraphs.

**Final round, after both rechecks.** The shuffled copy now gives the right reason the planner switched at the same point: its bitmap estimate treats the matches as spread at random, so correlation plays no part. The earlier "correlation near 0" explanation was wrong, and correlation is now defined in the forced-scan paragraph, where it does matter. "The whole index" became "every leaf page of the index": the 234 pages are 232 index pages and 2 table pages, which pageinspect confirmed. The hash join line shows 842 + 723. The rest are the editorial splits, merges and wording changes, plus a Figure 6 note for the "By customer" step whose matches cover all six pages. No number changed, and `verify.mjs` still passes.

### Decided against

- **Moving the heap definition into "Tables stored as a heap".** Figure 1 already labels the table "(heap)", so the definition stays at that first use, and the later section no longer repeats it.
- **Relabelling Figures 7 and 8.** Defining the history query earlier fixed both labels. The content labels would have been long on a phone.
- **A cycling "By customer" layout in Figure 6.** It would have mirrored the 60,000-order table more literally. With 16 customers on 6 pages, though, one cycle covers under three pages, and the effect disappears. The fully sorted layout shows it, and the prose describes the real table's cycles.
- **Putting the remaining extra runs in the lesson.** The shuffled copy, the oldest-rows delete and the two- and three-index write-ahead log runs each need a separate copy or a long setup. The lesson is already 25 steps, so these are named in "Where the numbers come from" instead.
- **A single-table stale-statistics failure.** New rows scattered through the table, or a rare value, gave bitmap scans that still beat a full scan, so no single-table version showed a bad plan. The join is the honest case, and the single-table plan is kept to show a wrong estimate that does no harm.
- **Moving the SQLite leaf-link sentence to the companion.** This repair could change only the companion's link texts, so the sentence was cut. Its evidence row stays.
- **Naming the leaf links, and rewriting captions that repeat the setup.** The editor rated both optional, and no later page relies on the name.
