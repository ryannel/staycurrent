# Review of the general Indexes rewrite: accuracy and generality (17 October 2026)

Scope: `src/pages/learn/databases/relational/indexes.astro`, `ClusteredFigure.astro`, and the new sections of `postgresql/indexes.astro`. Sources fetched 17 October 2026 from the MySQL 8.4 manual, sqlite.org and Microsoft Learn (SQL Server 2025 docs). No files other than this record were edited; no builds run. Figure 3 was looked at in the dev server (desktop, dark theme) only.

## Step 0: coverage expected before reading the article

Title "Indexes", reader a developer on some relational database, new to indexes. Outcome: predict what an index saves and costs in the engine they use, and know which worked-example detail is PostgreSQL's.

I expected: (1) what an index is and is for; (2) what an entry holds and how the row is found again, with the two table organisations (heap with pointers; table stored in key order with the key as locator) and what each does to cost; (3) the B-tree and why lookups are shallow; (4) range and ordered reads; (5) selectivity and why a planner may ignore an index; (6) composite column order; (7) covering indexes; (8) partial, expression, unique, and foreign-key indexes; (9) a short map of other types; (10) write costs, page splits, key choice, online builds, unused indexes; (11) reading a plan in each engine; (12) sources. Also expected: a sentence on how the "pages read" metric transfers to key-ordered tables, and a sentence on SQL Server where it differs (INCLUDE, filtered indexes, ONLINE).

The article covers all of these. The tree matches except for the transfer of the page-count metric (finding 3) and SQL Server details (findings 7, 9).

## Findings, ranked by consequence

### 1. Covering: "It needs two things" is stated for every engine, but the second is PostgreSQL's (and partly InnoDB's). Misleading for SQLite and SQL Server. (line 136-138)

The text says an index-only scan needs the columns plus "the database must be able to trust each entry... Each engine has to answer that". SQLite readers see a stable page snapshot, and SQL Server's covering is column coverage alone (Microsoft's index design guide describes row locators and included columns; no visibility condition). A SQLite or SQL Server user learns a constraint they do not have, and the worked "Heap Fetches" lesson does not apply to them.
Repair: say the second condition belongs to engines that keep old row versions outside the index: "In PostgreSQL, and in InnoDB with exceptions, the index must also be trustworthy..." and state that in SQLite and SQL Server a covering index is covered once the columns are. Also name SQL Server's `INCLUDE` in the sentence that says MySQL has none ("PostgreSQL and SQL Server have `INCLUDE`"), because the paragraph now suggests only PostgreSQL has it. Source: https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide (included columns, row locators).

### 2. "Pages on the same level are linked to their neighbours" is false for SQLite. (line 86; also "next leaf page's link" in Page splits, line 180, which is PostgreSQL-labelled)

SQLite file format: "A leaf b-tree page has no pointers"; only interior pages carry a right-most pointer; navigation is parent to child (https://www.sqlite.org/fileformat2.html). SQLite range scans climb through the cursor's parent stack rather than following sibling links. InnoDB (leaf pages are doubly linked) and SQL Server are fine. Confidence: sqlite.org says leaves have no pointers; the rest is my reading of that.
Repair: line 86 -> "In PostgreSQL, InnoDB and SQL Server, pages on the same level are linked to their neighbours, so a scan can step from one leaf page to the next. SQLite instead returns to the parent page for the next leaf. Either way, a range scan descends once." Keep Figure 5's lesson ("descended once").

### 3. The worked page counts are PostgreSQL's, and the article never says what they become in a key-ordered table. (lines 62, 85, 95, 130, example-note line 44)

The example note promises "Where InnoDB, SQLite or SQL Server do something differently, the text says so." After the clustered section the promise lapses: "2 index pages then the 60 table pages" (62), "3 in the index and 1 in the table" (85), "13 pages: 3 index pages and 10 table pages, one per row" (130). In InnoDB or SQLite each "table page" is a descent of the table's tree, so the same lookup reads more pages (upper levels are usually cached), and Figures 4 to 7 still draw index-to-heap arrows. A reader who has absorbed Figure 3 can derive this but is not told.
Repair: one sentence at the end of the clustered section or in the Range section: "In a key-ordered table each table-page read in the counts below is a descent of the table's tree, two or three pages on a table this size, though the upper pages are usually in memory. The shape of every comparison stays the same." Optionally add "(heap layout)" to the caption of Figures 2 and 4-7 where they draw a heap; at minimum say once, near Figure 4, that the figures draw a heap.

### 4. "PostgreSQL adds the bitmap scan" (line 100, framing "every database has two") is imprecise: MySQL has the same idea.

MySQL's Multi-Range Read collects keys from a secondary index range scan, sorts them by row ID (primary key for InnoDB), then reads rows in that order; on by default, shown as `Using MRR` in `Extra`, not used when the index covers (https://dev.mysql.com/doc/refman/8.4/en/mrr-optimization.html). SQL Server also sorts before lookups in some plans. An InnoDB reader who sees `Using MRR` will not map it.
Repair: "PostgreSQL's third route is the bitmap heap scan; MySQL's Multi-Range Read does the same job of sorting row locations before reading". Drop "Every database has two".

### 5. "Other index types": InnoDB sentence is wrong; SQLite sentence is imprecise. (line 157)

- "InnoDB's indexes are B-trees apart from its spatial R-trees" omits InnoDB FULLTEXT indexes, which "have an inverted index design" (https://dev.mysql.com/doc/refman/8.4/en/innodb-fulltext-index.html), the direct analogue of GIN used in the same section. Wrong as written (also omits the internal adaptive hash index, which users do not create).
- "SQLite adds R-tree and full-text indexes as built-in modules": both are virtual-table modules, and sqlite.org says R*Tree "may or may not be enabled by default" (SQLITE_ENABLE_RTREE) and FTS5 is a compile-time option, on in the amalgamation (https://www.sqlite.org/rtree.html, https://www.sqlite.org/fts5.html). The writer's unfetched claim was close; "built-in" is the overreach.
Repair: "InnoDB adds full-text indexes (an inverted index like GIN) and spatial R-trees. SQLite offers R-tree and full-text search as optional modules that appear as virtual tables." The section is still about 80 per cent PostgreSQL's menu; the table caption and lead-in say so honestly, which I judge acceptable.

### 6. Online builds: "MySQL's `CREATE INDEX` takes `ALGORITHM` and `LOCK` clauses that set the same trade-off" implies the wrong default. (line 184)

InnoDB builds a secondary index in place by default: the table "remains available for read and write operations while the index is being created" (https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl-operations.html, secondary index row: in place yes, concurrent DML yes, rebuild no). The clauses let you demand a level and get an error if it is unavailable; they are not PostgreSQL's choice between blocking and `CONCURRENTLY`. The manual's CREATE INDEX page does not state defaults, so the default comes from the online DDL page. Also, SQLite blocks writers for the duration, and SQL Server uses `ONLINE = ON` (edition-dependent), neither mentioned.
Repair: "PostgreSQL's plain `CREATE INDEX` blocks writes... MySQL's InnoDB builds a secondary index in place and keeps the table writable by default; `ALGORITHM` and `LOCK` let you require that. SQL Server offers `ONLINE = ON`." The SQL Server sentence needs an edition check before use; I did not verify it.

### 7. Partial and expression indexes: SQL Server omitted, SQLite's expression indexes omitted. (lines 145, 148)

"PostgreSQL and SQLite support them" reads as "SQL Server does not"; SQL Server has filtered indexes (Microsoft index design guide, "Filtered index design guidelines"). "MySQL calls its version functional key parts" leaves out that SQLite supports indexes on expressions (https://www.sqlite.org/expridx.html, referenced from optoverview) and that SQL Server uses indexed computed columns. Also the `placed_at::date` / time zone passage (148-150) is PostgreSQL-specific (timestamptz cast semantics, `::`, `AT TIME ZONE`) and unlabelled in a general article; the example note covers measurement but not syntax.
Repair: "PostgreSQL, SQLite and SQL Server (as filtered indexes)"; "MySQL calls them functional key parts, and SQL Server indexes computed columns". Lead the date example with "In PostgreSQL, a cast..." .

### 8. Write costs: InnoDB's update rule is presented as InnoDB's special behaviour. (line 176)

"InnoDB leaves a secondary index alone unless an indexed column changed" is correct and sourced (MVCC page: "When a secondary index column is updated, old secondary index records are delete-marked, new records are inserted"; the manual's glossary says modifying clustered index columns is expensive). But PostgreSQL's behaviour is the exception: SQLite and SQL Server also touch only affected indexes (my knowledge, not fetched). Read as is, the reader concludes it is an InnoDB peculiarity. "Changing the primary key rewrites its entry in every secondary index": correct, an inference from "each record contains the primary key columns", supported by the glossary line. The verb "InnoDB splits that differently" collides with page splits two paragraphs later.
Repair: "Most engines touch only the indexes whose columns changed; PostgreSQL does not, outside HOT. In InnoDB..." (verify the SQLite and SQL Server clause before keeping it, or limit to InnoDB: "In InnoDB, an update leaves...").

### 9. Plan table (line 210-216) and unused-index note.

- MySQL "was an index searched?" lists `ref` or `range`; a primary-key or unique-index lookup shows `const` or `eq_ref`, so `WHERE id = 5` would not match the table. Add `const`, `eq_ref`. A full index scan shows `type: index`; worth a note since "`index`" sounds good.
- "Every major database can show the plan ... EXPLAIN in PostgreSQL and MySQL, EXPLAIN QUERY PLAN in SQLite" leaves out SQL Server, the fourth engine named in the opening; and SQL Server has `SET STATISTICS IO` (logical reads), which does give page counts. Add one clause or drop "every major".
- "MySQL ... Not reported" for pages: correct for `EXPLAIN ANALYZE` per the manual (reports cost, rows, time, loops; no buffers). Session counters (`Handler_read_*`, buffer pool read requests) exist but are not per-plan. Fine.
- "Each engine keeps its own statistics on index use" (line 187): SQLite does not. Say "PostgreSQL, MySQL (the sys schema) and SQL Server do; SQLite does not".

### 10. Smaller accuracy points

- Skip scan (line 121): "as MySQL and SQLite can in some cases" is correct but hides how narrow. MySQL's skip scan applies to a single-table query that references only columns in the index, no GROUP BY/DISTINCT, and needs a range condition on the next column (https://dev.mysql.com/doc/refman/8.4/en/range-optimization.html; shows `Using index for skip scan`; the manual page does not state 8.0.13, so that version is the writer's knowledge, true to my recollection but unverified here). SQLite needs `ANALYZE` first and about 18 or more duplicates per left-most value (https://www.sqlite.org/optoverview.html). Consider "MySQL and SQLite do in narrow cases" so a reader does not rely on it.
- Clustered section: "primary key as its key" is right unless the InnoDB table has no primary key; then it uses the first non-null unique index or a hidden row ID (innodb-index-types page). One clause avoids a surprise in the kinds section ("In InnoDB the primary key is the table itself").
- Fill figures (line 181): correct and correctly attributed. The manual states 15/16 and 1/2 to 15/16 about inserts into the clustered index; applying it to a random primary key is a fair reading. Secondary indexes behave similarly, but the doc wording is about the clustered index.
- InnoDB "has no such map" (visibility, line 138): the manual describes the mechanism as delete-marked records or a secondary page updated by a newer transaction. The article says that. Fine.
- Title line and sources header: TitleLine says "InnoDB and SQLite comparisons", yet SQL Server is taught in the clustered section and cited. The Sources lead-in ("PostgreSQL 18, MySQL 8.4 and SQLite documentation") leaves out the SQL Server page it lists. Add SQL Server to both.
- "B-tree depth" table and 367 entries/page are PostgreSQL-labelled; fine. The "posting list" sentence (line 85) and "removes entries... merges duplicate keys into a posting list" (line 180) are PostgreSQL mechanisms in a general article. Labelled; consider moving the page-split first-aid sentence to the PostgreSQL article's `writes` section, which already describes splits.

### Correct claims checked

| Claim | Verdict | Source |
|---|---|---|
| InnoDB table is its clustered index; PK is the clustered index; 16 kB default pages | Correct | innodb-index-types, innodb-physical-structure |
| Secondary record contains the PK columns; InnoDB uses it to find the row | Correct (quoted) | https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html |
| Short primary key advised because secondaries are larger | Correct (quoted) | same |
| Rows move on page splits, so a key is stored, not a location | Inference, reasonable, not stated by MySQL. SQL Server's guide documents the same row-locator design. Add "so" wording that signals it as the design's reason, or "which is why" with attribution to the design | Microsoft design guide, lines on row locators |
| Changing a PK rewrites entries in every secondary index | Correct by implication (see 8) | glossary, innodb-multi-versioning |
| No secondary change when no indexed column changes | Correct | https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html |
| InnoDB falls back to the clustered record when secondary record delete-marked or page updated by newer transaction | Correct (quoted) | same |
| MySQL EXPLAIN ANALYZE has no page counts | Correct (manual lists cost, rows, time, loops only) | https://dev.mysql.com/doc/refman/8.4/en/explain.html |
| MySQL `EXPLAIN` `Using index`; type values | Correct, see 9 for gaps | explain-output |
| SQLite rowid tables; INTEGER PRIMARY KEY is the rowid; index entry holds rowid; two binary searches | Correct (quoted) | https://www.sqlite.org/queryplanner.html, https://www.sqlite.org/withoutrowid.html |
| SQLite WITHOUT ROWID: single B-tree, one search for key lookup; PostgreSQL no equivalent | Correct | withoutrowid.html |
| SQLite covering index; `USING COVERING INDEX` | Correct | queryplanner.html section on covering indexes |
| SQLite skip-scan | Correct, narrow (see 10) | optoverview.html |
| MySQL has no INCLUDE | Correct (not in CREATE INDEX syntax) | https://dev.mysql.com/doc/refman/8.4/en/create-index.html |
| MySQL functional key parts | Correct; restrictions: not in PKs, expressions in parentheses, and queries must repeat the expression | create-index |
| MySQL auto-creates index on FK referencing columns when none exists | Correct (quoted; may be silently dropped later) | https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html |
| SQL Server clustered table sorts rows by key; no clustered index = heap; row locator is the clustering key or an RID | Correct | https://learn.microsoft.com/en-us/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described |
| PostgreSQL `CLUSTER` is one-time | Correct per PostgreSQL docs (not re-fetched; consistent with sql-cluster page cited) | |

Change buffering: omitting it is fine. The MySQL 8.4 page says the default `innodb_change_buffering` is `none`, and it applies only to secondary index pages not in the buffer pool. Mention only if a later edit discusses 8.0 behaviour, where it was on by default for all operations (my recollection of the default change; not fetched).

## 2. Generality: what still misleads InnoDB and SQLite users

Reasonably handled: the opening, the clustered section and Figure 3, the covering rewrite in its first half, kinds, write costs, EXPLAIN table. PostgreSQL is presented as an example in the example note, the TitleLine, figure captions and the "Where the numbers come from" close, which is honest. Figure titles ("Sequential scan for customer 42", "B-tree search for one customer_id", "One insert, one update, up to four indexes") are neutral; only Figure 6's bar labels name PostgreSQL's routes, and the text introduces them.

Still misleading for them, in order: finding 1 (second covering condition), finding 3 (page counts and heap figures never reconciled), finding 2 (SQLite leaf links), finding 4 (bitmap as unique), the plan-table gaps in 9. Heap vocabulary leaks lightly: "the table pages they point to" (62), "Index scan follows each entry to its row" (selectivity bullets) both read right for either design only after Figure 3.

PostgreSQL-only detail left in the general article, with my judgement:
- Page-split first aid (bottom-up deletion, posting list merge), line 180: move or shorten.
- `ANALYZE` + `BUFFERS` explanation (line 194) and `Heap Fetches` / `local` buffers bullets: labelled as PostgreSQL's plan; acceptable because the section is the worked example.
- Write-ahead log 3.3 MB to 7.7 MB (line 177) is labelled and measured; the WAL concept is not explained for readers who see InnoDB's redo log. Add "the log of changes each database keeps for crash recovery (InnoDB's redo log)".
- Unused-index query: PostgreSQL view; fine, with finding 9 for the "each engine" claim.

## 3. Figure 3 (ClusteredFigure)

On its own it says: each of four index entries holds "42" plus an order number, and each arrow reads "search the table for N" into a leaf page of a tree keyed by `order_id`, with the other keys on the page shown. It does communicate that the entry carries a key, not a page-and-slot, and that four entries lead to four pages (same orders 3, 11, 21, 36 as Figure 2, which is good continuity). Rendering is clean on desktop and the language fits: same `ix-figure`, `ix-head` and number, paper surface, blue arrows, highlighted cells, `tabular-nums`, mobile reflow.

Weaknesses:
1. The cost the text emphasises, the second descent, is not drawn. The arrow's destination is the leaf page, so the picture looks like Figure 2 with a different arrow label. A reader skimming figures would not see "an extra search". Repair: draw two faint levels (a root and a branch) between the arrows and the leaf pages, or add a small "root, branch" strip labelled "levels the search passes" with each arrow starting at the root. If a full tree is too heavy for a static figure, label each arrow "descend the table's tree, then read page 0".
2. The index panel is not shown as sorted or as a tree: "Index on customer_id: four entries" is fine; it does not matter here.
3. The caption's final sentence ("The unmarked numbers are the other orders stored on each page") is a key and earns its place. "Here to four different leaf pages" is correct. "The same 36 orders" assumes the reader holds Figure 2; fine.
4. It is static where the other figures use a scrubber. The brief asked for static; acceptable, but it breaks the figure rhythm of the section; the surrounding text carries it ("Compare Figure 2").
5. Accessibility: the grid has `aria-hidden` arrows and no text equivalent for the destination; the labels "search the table for 3" are inside aria-hidden elements. A screen-reader user gets entries and pages without the relation. Move the arrow label out of the hidden wrapper or add a visually hidden sentence.

## 4. Heading tree

```
h1 Indexes
 h2 Sequential scan
 h2 Index entries and row locations
  h3 Tables stored in key order
 h2 B-tree
 h2 Range scans
 h2 Selectivity and the planner's choice of scan
 h2 Composite (multicolumn) indexes
 h2 Covering indexes and index-only scans
 h2 Partial, expression and unique indexes
 h2 Other index types
 h2 Index write costs
  h3 Page splits
  h3 Building an index on a live table
  h3 Finding unused indexes
 h2 Checking an index with EXPLAIN
 h2 Where the numbers come from
 h2 Sources and further reading
```

It reads as one argument and matches Step 0. Two notes:
- "Index entries and row locations" has an h3 for the clustered design but none for the heap design, which sits in the h2 body. The structure says "heap is the main case, key-ordered tables an aside", yet the brief and Figure 3 treat them as equal alternatives. Repair: either an h3 "Tables stored as a heap" for the TID material (so the two h3s are siblings), or keep one h3 and rename the h2 intro's last sentence. The first is clearer.
- Selectivity's heading "the planner's choice of scan" is fine, but "Sequential scan" as the first h2 is the baseline, not index content; unchanged from the approved version.
- "Index write costs" opens with Figure 8 (a PostgreSQL table, with four named indexes), then splits into three h3s; "Page splits" comes after the figure that already mentions page splits. Not new.

## 5. PostgreSQL article's new sections

1. Structural bug (consequence: high). Inserting `<h3 id="hot">` and `<h3 id="concurrently">` into the `writes` section puts the existing GIN pending-list paragraph, the BRIN maintenance paragraph and the closing "The decision is consequently more specific..." paragraph under "Building an index while writes continue". They read as part of the CONCURRENTLY section; the closing decision paragraph, which closes the whole article, is now a subsection of one build option. Repair: move `#hot` and `#concurrently` to directly after the opening writes paragraph and add an h3 for the GIN and BRIN paragraphs ("Maintenance in GIN and BRIN"), leaving the closing paragraph in a final h3 or the h2 intro. Alternative: put the two new h3s last, before the closing paragraph, and give the closing paragraph no h3 by ending the section with an h3-less paragraph is not possible after h3s, so use the first repair.
2. `#cost` sits as an h3 after the skip-scan paragraph and its `Sql` block, ending the "B-tree indexes and ordered scans" section with an unrelated topic (planner pricing). Its natural lead-in is two paragraphs earlier, "That is why an index route can be poor for a very broad request". Repair: place `#cost` after that paragraph, before the composite and skip-scan paragraphs.
3. Voice. `#cost` and `#index-only` read as explanations of settings and mechanisms ("two settings set the price...", "needs every column the query uses to be in the index, and it needs a way to trust each entry"), closer to the general article's register than to the article's "derive from information stored" paragraphs. `#index-only` is the better of them, because the bit-per-page is a derivation of what must be stored. `#hot` and `#concurrently` are procedural, as the writer says. Suggested approach for `#concurrently` rather than a rewrite: say what information the concurrent build must reconcile (rows written while it scans, which a second pass must pick up) so the reader derives why it takes longer and waits for old transactions, then the invalid-index consequence. For `#cost`, start from what information the planner has (estimated pages and rows) and derive why a jump should be priced above a sequential read. Present-tense, short, and accurate as written; this is an editing preference, not an error.
4. Duplication. The covering measurements and visibility-map explanation now appear twice almost verbatim: general lines 138-140 and PostgreSQL `#index-only` (Heap Fetches 10, 13 pages, 4 pages, 2.9 versus 2.3 MiB, "A covering index pays for a frequent query on a table that changes slowly"). The brief said to move them; the general article keeps a PostgreSQL measurement, labelled, and a one-sentence mechanism, which is defensible, but the closing sentence is identical in both. Repair: in the general article keep the numbers (the user approved them) but cut the repeated verdict sentence, or make the PostgreSQL article's version add what the general one lacks (VACUUM, autovacuum, the bit being cleared by writes).
5. CoveringFigure works there. It is PostgreSQL's mechanism, its fallback text names `INCLUDE` and the visibility map, and the PostgreSQL article's other figure is GIN-specific. Weak points: the surrounding text says "the history query in Indexes", and Figure 1's heap panel uses the 36 invented orders; the reader arrives cold from a link and the paragraph after the figure is two short sentences. Add a clause defining the history query (customer 42's newest orders) where it is first named, and one sentence reading the result of the figure, mirroring the paragraph that follows the GIN diagram. The numbering "Figure 1" is correct there. The user-approved figure moved out of the general article, leaving the general covering section without a visual; that is a user decision, flagged by the writer. I think the move is right, because the figure teaches the visibility map, but the general section would benefit from a one-line pointer placed directly after the claim it supports, which exists.
6. Measurement provenance. `#hot` says "On the generated table from Indexes", but the 600-update test uses an ordinary (not temporary) table with `fillfactor = 90`, verified in `docs/article-work/indexes/verify.mjs` and not in the sandbox lesson or the downloadable experiment script (neither contains "fillfactor"). The text states the fillfactor, which is honest, but the reader cannot repeat it. Repair: say "In a separate check on an ordinary table built like the generated one, with `fillfactor = 90`..." and keep the evidence note pointing at `verify.mjs`.
7. HOT rule: "If no indexed column changed" omits PostgreSQL 16+ behaviour where changes only to columns in summarizing indexes (BRIN) can stay HOT. Small, but this article is the PostgreSQL one, so add "(a BRIN index does not prevent one)" if checked against the HOT docs (https://www.postgresql.org/docs/18/storage-hot.html); I did not re-fetch it.
8. `#concurrently` facts check out (blocks writes, `CONCURRENTLY` takes longer, may leave an invalid index, `REINDEX INDEX CONCURRENTLY`). It omits that it cannot run inside a transaction block, which matters for migration tools.
9. The new opening pointer paragraph says the general article "teaches the B-tree, the TID" — it now teaches TIDs as PostgreSQL's name; fine.

## 6. Writing: what works, what strains

Works:
- Line 57: "An index entry pairs a key with a row location. The key is the indexed column's value. The row location is whatever the database needs to find the row again, and it depends on how the table is stored." Defines the shared mechanism before the split, as the brief asked.
- Line 69: "Compare Figure 2. There each entry led straight to a page. Here each entry starts another search, and on a large table that search has levels of its own, so sixty matching entries mean sixty descents of the table's tree." Concrete and carries the lesson.
- The three bullets at 71-73 each name a consequence the reader can predict. The third ("In a heap, a random key scatters only its own index") is the best sentence in the section.
- Line 216: "The rule still holds: an index search on the condition you care about, and a covering index where you expect one." A short, useful close for the EXPLAIN table.
- The opening (lines 40-44) kept the approved purpose-before-mechanism approach; the example note now says "every measurement comes from it", which is clear.

Strains:
- Line 66: three stacked attributions ("InnoDB's documentation says... SQLite's documentation describes...") in one paragraph that also gives the reason ("a row moves when its page splits"). The reason is an inference presented as fact; the attributions make it read as if sourced. Say "so" the design stores the key, cite after the quote, and put one source in the paragraph.
- Line 176: "InnoDB splits that differently." Vague and collides with page splits. Try: "InnoDB updates a row in place in the clustered index and leaves a secondary index alone unless an indexed column changed. If one did, it marks the old record deleted and inserts a new one."
- Line 138: one paragraph holds the version problem, PostgreSQL's map, InnoDB's fallback, and the pointer; "Each engine has to answer that without a table visit for every row" is abstract. Split into the PostgreSQL case and the InnoDB case, and say whose problem it is (finding 1).
- Line 100: "Every database can follow the index entry by entry, or ignore it and read every page. PostgreSQL has a third route between them" followed by three bullets that list all three; the sentence announces the list twice.
- Line 111-112 ("The planner's statistics don't describe that layout", "The planner may switch before or after...") are kept from the approved version, still dense; not part of this revision.
- Lines 184 and 175: the PostgreSQL pointers read as "see the other article" rather than carrying a thought ("`a link` explains why"). Fine as pointers, but line 175's "explains why" leaves the reader with an unexplained rule ("leaves every index alone") for the general article; finding 8's repair would add the one-line reason ("the old index entries still reach the row").

## Suggested order of repair

1. Finding 1 (covering second condition), 2 (SQLite leaf links), 5 (InnoDB FULLTEXT), 6 (online DDL defaults): factual.
2. PostgreSQL article heading structure (section 5, item 1).
3. Finding 3 (page-count transfer), 4 (MRR), 7-9 (SQL Server and SQLite gaps, plan table).
4. Figure 3 descent levels and accessibility.
5. Prose passes in section 6.

Evidence still unverified by me: SQL Server `ONLINE = ON` edition rules; SQLite and SQL Server "only affected indexes are updated"; MySQL 8.0.13 for skip scan; the 8.0 default for change buffering; PostgreSQL 18 HOT page re BRIN. None of the PostgreSQL measurements were re-run.
