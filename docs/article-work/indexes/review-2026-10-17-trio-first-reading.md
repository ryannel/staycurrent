# First reading: Indexes, Indexing joins sorting and pagination, Maintaining indexes

Date: 17 October 2026.
Reader: uncued, playing a backend developer two years into the job. Writes SQL daily, knows an index "makes queries faster", has never read a plan closely or maintained a database. Goal: design, check and maintain indexes at work.

Material: rendered text extracted to `scratchpad/review-text/` (`indexes.txt`, `indexing-queries.txt`, `maintaining-indexes.txt`). This is a text extraction, not a browser reading. Figures arrive as their code, caption and summary text; interactive controls show only as button labels ("Play Back Next Step Reset"). I could not judge visual clarity or interaction behaviour. Sidebar noise ignored.

Delivery: I read the opening of Indexes alone and recorded it before going on. I then read each article in chunks of about 130 to 160 lines, noting questions before opening the next chunk. I also listed every heading before reading the bodies, so the heading-tree notes are partly an outline-first reading and say so where that matters.

Only the voice reference and the first-reading guidance were read besides the three texts.

---

## 1. The opening of Indexes, read alone

What I could explain after the five opening paragraphs, before the first section:

- An index is a sorted list of one or more columns' values, and each entry says where its row is stored. The back-of-book analogy carried this in one step: sorted terms you can find quickly, each listing its pages.
- It is for `WHERE col = x`, ranges, `ORDER BY`, uniqueness and joins on a key.
- It costs space and makes inserts and many updates slower.
- The work a query does is mostly the number of pages it reads. An index pays when it lets the database read fewer pages than a full scan. This was the most useful single idea in the opening, because it gave me a way to judge every later claim.
- When I'd reach for one: a query that filters on a column and returns a small part of a large table. The opening implies the "small part" condition ("helps when it lets the database read fewer pages") without saying it outright. Selectivity later makes it explicit.

What I did not yet know and expected the article to supply: how a sorted list is searched quickly (the B-tree is named as the subject), how to tell whether an index is used, and what "what keeping it costs" covers. The opening's last sentence of paragraph three lists exactly those three things, and the article delivers all three.

Small friction: "Other index types maps the rest" and "Where the numbers come from describes the measurements" read as broken sentences in extracted text until I realised they are section titles used as links. The same pattern recurs throughout all three articles ("Page splits shows what that costs", "Indexes shows the query"). In the browser the link styling probably carries it; in plain text it trips me once each time.

---

## 2. Heading trees as maps

### Indexes (deep dive, about 38 minutes)

```
# Indexes
## Sequential scan
## Index entries and row locations
   ### Tables stored as a heap
   ### Tables stored in key order
   ### Choosing the key of a key-ordered table
## B-tree
## Range scans
   ### Order without sorting
## Selectivity and the planner's choice of scan
## Composite (multicolumn) indexes
   ### Combining two indexes instead
## Covering indexes and index-only scans
## Partial, expression and unique indexes
   ### Partial indexes / Expression indexes / Unique indexes and foreign keys
## Other index types
## Index write costs
   ### Page splits / Deleted rows and index size / Building an index on a live table
   ### Finding unused indexes / Duplicate and invalid indexes
## Indexing for a query
## Checking an index with EXPLAIN
## When the database ignores an index
   ### The condition matches too much / The leading column has no condition
   ### The column is wrapped in an expression / Prefix patterns and collation
   ### One branch of an OR has no index / Statistics that no longer match the data
   ### Proving the index can be used
## Where the numbers come from
## Sources and further reading
```

Could I find my way back? Mostly yes. The first half reads as a build-up of the mechanism, and the headings name the mechanism. Three places I would look in the wrong spot:

- **Finding unused indexes** and **Duplicate and invalid indexes** sit under **Index write costs**. If I came back looking for "how do I find indexes to drop", I would not look under write costs. They are maintenance, and the third article has them again under a better heading.
- **Order without sorting** sits under **Range scans**, but its rule is the composite-index rule, which comes two sections later. Looking for "can an index give me ORDER BY for free", I'd guess Composite first.
- **Indexing for a query**, the practical method, comes *before* **Checking an index with EXPLAIN**, though its step 5 depends on reading a plan ("The conditions belong under Index Cond"). As a map it's fine; as a reading order it's backwards (see the log).

The ignore-section's subheadings are excellent as a map: each is the cause, phrased as what you'd see. The lookup table at the top of that section maps plan symptoms to those headings, and that is the most return-to-able part of the article.

### Indexing joins, sorting and pagination (companion, about 26 minutes)

```
# Indexing joins, sorting and pagination
## Filtering, sorting and limiting together
   ### When an index supplies the order / What stops the index supplying the order
   ### Grouping, distinct values and the latest row per group
## Joins and foreign keys
   ### Which column needs the index / The foreign key that makes a delete slow
## Paging through an ordered list
   ### The index for the first page and the next / What offset reads
   ### Keyset pages and the row comparison
   ### Mixed directions, NULL sort columns and the filter that scans
## Conditions an index cannot see through
   ### The column has to stand alone / Types, affinities and character sets have to agree
   ### Prefix searches with LIKE
## Combining conditions with OR and AND
   ### OR / AND across separate indexes
## Shapes that recur: queues, soft deletes and tenants
   ### A queue of work / Uniqueness among the live rows / Tenants and skewed data
## Where the numbers come from
## Sources and further reading
```

This is the easiest of the three to navigate. Each top heading is a query shape I'd recognise from my own code, and each subheading is a question I might ask. The one weak heading is "The foreign key that makes a delete slow" — good — sitting beside "Which column needs the index", also good. No complaints.

**Conditions an index cannot see through** overlaps almost completely with Indexes' **When the database ignores an index** subsections. Coming back later, I would not know which of the two to open for "LIKE isn't using my index".

### Maintaining indexes (companion, about 27 minutes)

```
# Maintaining indexes
## Why an index stays large after deletes
   ### Pages that empty and pages that thin out / When freed pages come back into use
   ### Updates leave debris too / InnoDB and SQLite
## Measuring size and bloat
   ### How large should it be? / PostgreSQL / InnoDB / SQLite
## Rebuilding an index
   ### When a rebuild is worth doing / PostgreSQL: REINDEX and what it locks
   ### When a concurrent rebuild or build fails / InnoDB: the table is rebuilt, not one index
   ### SQLite: REINDEX frees pages, VACUUM shrinks the file / The rebuild options side by side
## Building new indexes safely
   ### Time and memory / Replicas
## Keeping statistics current
   ### PostgreSQL: autovacuum analyzes, eventually / InnoDB: persistent statistics
   ### SQLite: PRAGMA optimize / Recognising stale statistics
## Finding indexes to remove
   ### Unused indexes / Duplicate and redundant indexes / Invalid indexes
   ### Dropping without making things worse
## Replacing an index in production
## Checking that an index is sound
## Sources and further reading
```

Good runbook map. The engine subheadings make it easy to jump to "PostgreSQL" and skip the rest. The headings that carry a claim ("REINDEX frees pages, VACUUM shrinks the file", "the table is rebuilt, not one index") are the ones I'd remember. There's no "Where the numbers come from" here, unlike the other two; the provenance is folded into Sources.

Small mismatch: "There are four kinds to look for" under **Finding indexes to remove**, but the subheadings name three kinds (unused, duplicate-and-redundant, invalid) plus a how-to. I worked out that duplicate and redundant are counted as two.

---

## 3. Question log, in reading order

Each entry: the trigger, what I understood at that point, and what happened later.

### Indexes

**Sequential scan.** Clear. "Its cost follows the size of the table, not the size of the answer" is the sentence I'd quote to a colleague. The jump from 36 rows to 1,725 pages and 59,940 discarded rows lands well.

**Tables stored as a heap.** TID explained in one go, with a concrete value (0,3). Figure 2's summary ("Customer 42's four entries end up next to each other and point to rows (0,3), (1,5), (3,3) and (5,6)") let me picture it without the animation. The 62-page count is explained right away (2 index + 60 table). Good pacing.

**Tables stored in key order.** Here the effort starts. I'm now holding two storage designs, and the section introduces "clustered index", rowid, INTEGER PRIMARY KEY, and the hidden-row-ID fallback in one paragraph. The point (each entry carries a key, so each match is a second descent) came through. The "Here is one conversion" paragraph is where I had to slow right down:

> "In a key-ordered table the 62-page lookup above becomes 2 index pages plus 60 descents of the table. Every descent starts from the same few upper pages, which the first descent has already read into memory, so what is left is about one bottom page per row plus a few shared ones. Read the later counts the same way, replacing each table page with a descent."

Question: so is it roughly the same 62 pages, or more? I think the answer is "about the same page reads, more searching", but the paragraph never gives the number, and then asks me to apply the conversion to every later count. I didn't; I just read on with PostgreSQL numbers. The parenthesis about WITHOUT ROWID and CLUSTER at the end adds two more things to hold.

**Choosing the key of a key-ordered table.** Useful to me — we argue about UUID primary keys at work. But it arrives before I know what a B-tree is or what a page split is ("as Page splits describes" sends me forward). It reads as a design aside placed in the mechanism build-up. I'd have taken it in more easily after Page splits.

**B-tree.** Clear. "Every search in this tree reads three index pages, whatever the key" plus the depth table (100k rows = 2 levels, 10M = 3) was the moment I understood why indexes stay fast at scale. "Posting list" arrives in the last sentence of a paragraph and is never used again in this article; I let it go.

**Range scans.** Clear. Then: "The next section follows the 360 rows from there, because PostgreSQL's plan did not return them in index order and sorted them again." Question: why would a range scan on a sorted index not return sorted rows? I held this question across **Order without sorting**. It was answered in **Selectivity** ("the bitmap scan returned customers 40 to 45 in page order"). "The next section" is not quite right: Order without sorting intervenes.

**Order without sorting.** This is where I felt an explanation came too early rather than too late. It says "The rule matches the one for composite indexes in the next section", but composite indexes are two sections away. Then four details (directions in a composite key, NULL placement, collation, LIMIT) assume I already think in composite keys. The LIMIT bullet says "as the history query does after ten rows" — I hadn't met the history query yet; it's introduced in Composite. I read the four bullets as a list of facts to come back to, not as understanding. On second encounter (in the second article) they made sense.

**Selectivity.** Strong. The three routes (index scan, bitmap heap scan, seq scan) are named simply, and Figure 6's summary ("By the third customer, 8 rows or 22% of the table, the matches already sit on all six pages") gave me the "aha" that an index stops helping when every page holds a match. The shuffled-table experiment (922 vs 1,715 pages, same switch point) is the kind of thing I'd never have thought to test. I'd want to try a variation here: change the table's physical order and see where the planner's choice flips.

"Selectivity belongs to the value, not the column" — very good sentence.

**Composite.** Strong. Figure 7's three-way comparison (4 entries + sort / 2 entries / 16 entries) and then the history-query table (1,725 / 62 / 57 / 13) together made the column-order rule stick. The "57 pages look cheap beside 62, yet ... 11,000 entries" paragraph is a good warning against reading only page counts. Here I'd want to change `LIMIT 2` to `LIMIT 20` or remove it and watch the date-first index.

Skip scan paragraph: fine as a "don't design around it".

**Combining two indexes instead.** Clear, and the closing rule ("AND that appear together → composite; OR or many combinations → separate") is a decision I can use.

**Covering indexes.** First half clear. The visibility paragraph assumes I know that databases keep old row versions for running transactions:

> "PostgreSQL and InnoDB keep old row versions for transactions that began earlier, so an entry may belong to a version the current transaction can't see."

I know vaguely about MVCC, but this is the first time any article in the trio mentions it, and it's doing a lot of work in one sentence. Then the visibility map, VACUUM and InnoDB's delete-marked records follow in the same paragraph. I came away with "index-only scans need a vacuumed table in PostgreSQL" — enough to act on, not enough to explain. The pointer to Storage and Indexes in PostgreSQL is there.

**Partial indexes.** "The planner uses a partial index only when the query's own conditions imply the index's WHERE clause." Question: what does "imply" mean in practice — would `status IN ('pending')` count? `status = $1`? Answered well in the second article's queue section (state <> 'done' fails, generic plans fail). Here it's a bare rule.

**Expression indexes.** The time-zone explanation of why `placed_at::date` can't be indexed is excellent — I'd have been stuck on that at work.

**Unique indexes and foreign keys.** Clear. The foreign key paragraph is short and later expanded in article 2.

**Other index types.** The table is a good map. "GIN is the closest to the book index from the opening" — nice callback.

**Index write costs.** Figure 8's summary gives concrete page counts (8 vs 2, 1 vs 5). HOT update explanation strained me:

> "In PostgreSQL, an update that changes no indexed column, and whose new row version fits on the same page, leaves every index alone, because the old entries still reach the row and the old version points on to the new one within the page."

I had to read "the old entries still reach the row and the old version points on to the new one" three times. It needs me to picture a chain inside a page, which I haven't been shown. The practical consequence (indexing a frequently updated column costs more than just that index) came through.

WAL numbers (3.3 MB vs 7.7 MB) — good.

**Page splits.** Clear. Here I'd now have understood **Choosing the key** better.

**Deleted rows and index size.** Clear and alarming in a useful way. This turns out to be a preview of article 3's first section (see repetition notes).

**Building an index on a live table / Finding unused indexes / Duplicate and invalid indexes.** All clear, but I'm now reading maintenance material under a "write costs" heading, and the article is getting long. The "Drop an index in the way that can be undone" paragraph and "Wait a full business cycle" are good practical advice — and appear again in article 3.

**Indexing for a query.** The best section for my goal. The six steps and the role table (Equality → first, range/sort → second, tie-breaker → third, LIMIT → nothing but why order pays, returned-only → INCLUDE) is what I'd print and pin up. But:

- Step 5 says "The conditions belong under Index Cond, the sort step should be gone". I haven't been taught Index Cond yet; that comes in the next section. I accepted it on trust.
- The table's last row, "status = 'paid' (the paid-only variant)", refers to a variant I haven't met. It's introduced in the EXPLAIN section that follows.
- "Stop when the plan shows no work you can point to: no rows fetched and thrown away, no entries read beyond the answer, and no sort." — very good stopping rule.

Consequence: the method is the payoff of the article, but it leans on the next section. Reading EXPLAIN first would have let me follow step 5 rather than trust it.

**Checking an index with EXPLAIN.** Clear and well sized. The four things to read (node type, Index Cond vs Filter, Heap Fetches, Buffers) is exactly what I needed. "Read it from the most indented line outwards" — good. The engine comparison table is useful.

One surprise: "A temporary table, like this one, reports them under local instead." Nothing told me `index_orders` was a temporary table. I'd been picturing an ordinary table. Small, but it made me wonder whether the measurements would differ on a real table.

"Here ANALYZE means run and measure; the separate ANALYZE command collects the planner's statistics." — thank you; I'd have confused them.

**When the database ignores an index.** The symptom-to-cause table is very good. The subsections are concrete. The `customer_id = 42.0` driver-sends-decimals example is the kind of thing that has probably bitten me without my knowing.

A different set of numbers appears here: "a variant of the generated table: 60,000 orders on 1,936 pages". I'm now tracking the 36-row table, the 1,725-page table, and the 1,936-page variant, plus 50,000/40,000-row tables for statistics. I stopped trying to reconcile counts and just read the ratios.

**Statistics that no longer match the data.** Clear rule ("A gap of ten times or more between estimated and actual rows is the sign"). The engines' refresh rules are given here and again, at greater length, in article 3.

**Proving the index can be used.** Good checklist ending.

**Where the numbers come from.** Clear. I noted that some measurements were PGlite 18.3 and some local 18.6.

### Indexing joins, sorting and pagination

**Opening.** Good recap, not a repeat. "each has a way of failing without an error: the query still returns the right rows, only through a scan of the whole table" — this is the reason I'd read on.

Count of tables to hold: orders, customers, accounts, job queue, event log. Introduced up front, which helped.

**When an index supplies the order.** Clear, but this is the third time I've seen the composite rule and a 62-vs-small table (Indexes' history query: 62 vs 13; here 62 vs 23). It's framed as "restated for sorting", which is honest. "a customer with 50,000 orders would cost the first index all 50,000 fetches and the second still only 20" — that sentence earns the section.

Question: the seq-scan figure is 1,728 here, 1,725 in Indexes, and later 1,732 for the join. Same table? I guessed these are whole-plan totals including a few extra pages, but it made me check whether this was a different table. A short note on which counts are "whole plan" would remove the wobble.

**What stops the index supplying the order.** The middle-column bullet (customer_id, status, placed_at → 63 pages and a sort; move status after → 26) was new to me and immediately useful. The mixed-directions and NULLs bullets repeat Indexes' **Order without sorting** with slightly different wording and engine detail. On this second pass they were understandable, which suggests they were premature in Indexes rather than wrong.

InnoDB's free tie-break from the primary key: nice.

**Grouping and latest row per group.** The LATERAL / LIMIT 1 pattern is new to me and exactly the kind of thing I'd use. "A LIMIT 1 inside a lateral subquery is how to ask an index for the top row of every group." — a clean takeaway. I'd want to try it with DISTINCT ON for comparison; the article doesn't mention DISTINCT ON, though the subheading says "distinct values".

**Joins and foreign keys.** Clear. "index the foreign-key column on the many side, which is the column that nothing creates for you in PostgreSQL" — the one-line rule I needed. "look for the inner side reporting an index search with loops equal to the outer row count" — `loops` wasn't explained in Indexes (it appeared only as `loops=1`). I could infer it.

**The foreign key that makes a delete slow.** Excellent. Concrete (3 pages vs 1,725 to delete a customer with no orders) and surprising. The point that a composite index starting with the FK column already serves it, so a separate single-column FK index may be redundant, ties back to Indexes neatly.

**Paging.** Relies on "Pagination and large results" for what keyset pagination *is*. I know offset vs keyset loosely, so I followed. The offset table is good. Question: "Offset of 59,960 | 1,956" — that's more than the 1,725 pages of the whole table. Why didn't the planner switch to a seq scan and sort? The article doesn't say. Not blocking, but I noticed it.

**Keyset and row comparison.** Clear. The MySQL caveat (write it expanded, check key length) is practical.

**Mixed directions.** The best passage in the article for me:

> "This is correct, and it was the slowest way to be correct: ... 654 pages, the same as an offset. The OR hides from the index the fact that every qualifying row has placed_at at or before the boundary. Add that fact as a plain range"

I would never have found this. The rewrite (`placed_at <= $1 AND (placed_at < $1 OR order_id > $2)`) and "put the loosest bound on the leading column as a range the index can use" is a reusable rule. I'd want to try it on three sort columns.

NULL sort columns: "a nullable sort key is usually a sign the list is really two lists" — good.

**Conditions an index cannot see through.** Opening line: "When the database ignores an index gives the checklist; this section is the catalogue of conditions behind its first item". In Indexes, the first item of that checklist is "The condition matches too much", not expressions. So "its first item" points at the wrong thing, or means a different list. I was briefly confused about which checklist was meant.

The table is good, and the negation explanation ("every value except 42 is two ranges at the two ends of the index") is new and clear. Question: `customer_id = 42::bigint` read 65 pages against 62 for the plain value. Why 3 more? Unexplained; I assumed it's noise.

"an unknown-typed literal" — jargon I don't have.

From here the section largely repeats Indexes' **The column is wrapped in an expression** and **Prefix patterns and collation**: the numeric cast, MySQL's '1' / ' 1' strings, utf8mb4 vs latin1, SQLite affinity, text_pattern_ops, COLLATE "C", ILIKE, pg_trgm, SQLite NOCASE and GLOB. It is more thorough here (the collation explanation of *why* a language collation breaks prefixes is better than in Indexes, and the LIKE table is good), but on a full-route reading I'd read most of the facts twice. I skimmed the second half of **Prefix searches with LIKE**.

**OR.** Repeats Indexes' OR subsection (BitmapOr, unindexed branch scans everything, MULTI-INDEX OR), then adds new things: a non-selective branch drags the plan (427 pages) and the UNION rewrite. Honest note that the rewrite didn't pay here (all ~66 pages).

**AND across separate indexes.** Clear trade-off. "A combined bitmap returns rows in table order, so an ORDER BY still needs a sort, and a LIMIT cannot stop early" — that sentence connects bitmaps back to ordering well.

**Queue.** Very good. The two conditions (literal `state = 'queued'`, not `<> 'done'`; not a generic-plan parameter) answered my question from Indexes' partial-index section. The generic-plan point is quick for me — "A prepared statement with state = $1 and a generic plan" — I know prepared statements from my ORM but not generic vs custom plans. The link is there; I'd need to follow it to understand when my ORM triggers this.

**Uniqueness among the live rows.** Clear, with a test I believe. The MySQL generated-column workaround is useful.

**Tenants and skewed data.** Good; "one query can have two plans depending on who asks" — I'd quote that. The interleaved-rows explanation of why the big tenant reads fewer pages took a second read but made sense.

**Where the numbers come from.** Note: this article's numbers are all PostgreSQL 18.6 on a laptop; Indexes' were mostly PGlite 18.3. Same orders table "from Indexes", but measured in a different engine build. That explains some count drift (1,725 vs 1,728) but the reader only learns it at the end.

### Maintaining indexes

**Opening.** The best opening of the three for my goal. The four on-call questions ("why is this index 200 MB for a table with 100,000 live rows ...") are questions I could actually be asked. It sets expectations about what measurements show ("how big things are and what blocks what, not how fast").

**Pages that empty and pages that thin out.** Strong. Random deletes vs oldest-first deletes with the four-row table, and the insight that the `total` index in the tidy-deleted table is as bad as the random ones "because its keys are unrelated to age". This is the section's teaching moment. "Which indexes on a table go sparse depends on how the key relates to whatever decides which rows are deleted" — a sentence I'll remember.

I had to hold the table in my head through the following paragraph (which row is which). It was manageable with the table above it. A variation I'd want: delete 50% instead of 90%, or delete by customer.

Repetition: Indexes' **Deleted rows and index size** already did "delete nine in ten, VACUUM, still same size, REINDEX shrinks it". Here it's deeper (oldest-first case, density, deleted pages), so the first was a preview. On a full-route reading the first one felt complete enough that this felt like a second telling, until the oldest-first case added something new.

**When freed pages come back into use.** Surprising and useful (needs a second VACUUM before pages are reused). "expect the file to settle at roughly the peak" — practical.

**Updates leave debris too.** Compressed. Bottom-up deletion and deduplication in two sentences; I took away "PostgreSQL handles update churn reasonably, not scattered deletes". Enough for me.

**InnoDB and SQLite.** Fine.

**How large should it be?** The bytes-per-live-row baseline (22 bytes per entry) is the single most practical tool in the article. I can do that at work tomorrow.

**PostgreSQL measuring.** The queries are copy-pasteable. The pgstatindex output with 19.19 density matched the earlier table — good continuity. Explanation of each column is right-sized.

**InnoDB / SQLite measuring.** Fine; I'd skip them as a PostgreSQL user, and the headings let me.

**When a rebuild is worth doing.** "Not on a calendar." Good lede. The reasons list (disk, backups, buffer pool) is concrete.

**REINDEX and what it locks.** Lock names (ShareLock, AccessExclusiveLock, ShareUpdateExclusiveLock) arrive without explanation, but each is immediately followed by what it blocks, so I didn't need the names. The surprising detail — EXPLAIN of an unrelated primary-key lookup also waited, because planning locks every index — is the kind of thing that would bite me in an outage.

"This is the mechanism of CREATE INDEX CONCURRENTLY, which Indexes in PostgreSQL explains" — none of the three articles explains how a concurrent build works; all three point to the same other article. The cost bullets here were enough for me to use it safely, so this is curiosity, not a blocker.

Question: "Rebuilding an 11 MB index wrote about 10 MB of write-ahead log". Which index was 11 MB? The table above has 21, 7.8 and 30 MB. I couldn't place it.

The pg_stat_activity query showing `virtualxid` is exactly what I'd want during an incident.

**When a concurrent rebuild or build fails.** Clear. indisvalid vs indisready distinction is new compared with Indexes and well explained. _ccnew / _ccold — useful.

**InnoDB rebuild / SQLite rebuild / side-by-side table.** Table is a good summary to return to.

**Building new indexes safely.** Repeats Indexes' **Building an index on a live table** bullet for bullet (PostgreSQL blocks / CONCURRENTLY; InnoDB in place; SQLite one writer), with more InnoDB detail. Then **Time and memory** and **Replicas** are new and useful. "their defaults were not checked for this article" — honest but reads like a note to the author more than to me.

**Keeping statistics current.** The before/after plan (rows=2301 vs 499,500, bitmap vs seq scan) is the clearest demonstration of stale statistics in the trio. "finish every bulk load, restore and large backfill with an ANALYZE" — actionable.

Repetition: Indexes' **Statistics that no longer match the data** gave the same trigger (10% + 50 rows), the InnoDB 10% rule and PRAGMA optimize. Here it's longer and better. Reading both, the first felt like a summary of this one.

**SQLite PRAGMA optimize.** "PRAGMA optimize=0x10002" — magic number with no explanation of what the bits mean. I'd copy it without understanding.

**Recognising stale statistics.** Short and right.

**Finding indexes to remove.** "Indexes shows the query" for unused indexes — I'm now asked to go back to article 1 for a three-line query, after this article has already shown a bigger query joining pg_stat_user_indexes in **Measuring size**. Fine, since that query has idx_scan too. The added detail on counter resets (unclean shutdown, PITR, stats_reset) is new and valuable.

**Duplicate and redundant indexes.** The redundancy rule is the same as Indexes'. The two catalog queries are dense; I'd copy them, not read them. The "check by eye" caveats (INCLUDE, descending column) are useful.

**Invalid indexes.** Two sentences, a pointer. Thin, but enough because the content was given earlier in this article.

**Dropping without making things worse.** Repeats Indexes' drop paragraph (DROP CONCURRENTLY, MySQL INVISIBLE, keep the definition), with more limits. On a full route, a third reading of "MySQL invisible index" counting the ignore-section mention.

**Replacing an index in production.** Clear five-step runbook. "Never drop first" — good. "Step 2 matters because a failed concurrent build looks like a completed command to a migration tool that ignores the error" — exactly the reasoning I need.

**Checking that an index is sound.** New, and the collation-library-change explanation is genuinely news to me. Clear commands for each engine.

**Sources.** "Measurements and the manual pages read are recorded in the repository under docs/article-work/maintaining-indexes/" — as a reader I don't have the repository. And "the replica and ddl-buffer remarks are general knowledge flagged where they appear" reads like an internal note.

---

## 4. Where I carried too much in memory

- **Indexes, Tables stored in key order through Choosing the key**: two storage designs, three engines' terms, the conversion rule, and a forward reference to page splits.
- **Indexes, Order without sorting**: four detailed rules that depend on composite indexes and the history query, both still ahead.
- **Indexes, Covering indexes, third paragraph**: row versions, transaction visibility, visibility map, VACUUM, InnoDB delete marks, all in one paragraph.
- **Across all three, the number of tables and page totals**: the 36-row table; the 60,000-row table at 1,725 pages (and 1,728, 1,732); the 1,936-page variant; 50,000/40,000-row stats tables; accounts at 442 pages; jobs; events at 1,091; the million-row tables at 21/7.8/30 MB. Each is labelled where it appears, but the near-identical totals for "the same" table across articles made me stop and check more than once.
- **Indexing joins, Mixed directions**: holding the original OR condition and the rewrite side by side. A tiny worked trace (one boundary value, which rows pass each part) would have let me check it rather than trust it.
- **Maintaining indexes, Pages that empty**: four table rows referenced by position in the paragraph that follows.

## 5. Where an explanation came too late or too early

- Indexes: "PostgreSQL's plan did not return them in index order" (Range scans) is explained two sections later in Selectivity. Holding it was OK but "the next section" is inaccurate.
- Indexes: Order without sorting relies on the composite rule and the history query, both later.
- Indexes: Indexing for a query relies on Index Cond / Filter and the "paid-only variant", both in the next section.
- Indexes: Choosing the key relies on page splits, much later.
- Indexes: the partial-index "imply" rule is explained in practice only in the second article's queue section.
- Indexes: "A temporary table, like this one" — a fact about the setup revealed late.
- Indexing joins: per-article provenance (PostgreSQL 18.6 vs PGlite 18.3) is at the end, after I'd already noticed count drift.

## 6. Repetition across the trio

On a complete-route reading these were the passages where I read substantially the same facts again:

| Topic | Indexes | Indexing joins | Maintaining |
|---|---|---|---|
| Composite rule for ORDER BY, mixed directions, NULL placement, collation | Order without sorting | When an index supplies / What stops | — |
| Expression on column, numeric cast, MySQL string vs number, utf8mb4/latin1, SQLite affinity | Column wrapped in an expression | Column has to stand alone; Types... have to agree | — |
| LIKE prefixes: text_pattern_ops, COLLATE "C", ILIKE, pg_trgm, SQLite NOCASE/GLOB, MySQL constant-prefix rule | Prefix patterns and collation | Prefix searches with LIKE | — |
| OR needs an index per branch; BitmapOr; MULTI-INDEX OR | Combining two indexes; One branch of an OR | OR | — |
| Deletes leave a sparse index; REINDEX shrinks it; InnoDB MERGE_THRESHOLD | Deleted rows and index size | — | Why an index stays large |
| Build on a live table, per engine | Building an index on a live table | — | Building new indexes safely |
| Unused indexes, replica counts, keep PK/unique | Finding unused indexes | — | Unused indexes |
| Redundant prefix index, duplicates, invalid index, DROP CONCURRENTLY, MySQL INVISIBLE | Duplicate and invalid indexes | — | Duplicate and redundant; Invalid; Dropping |
| Statistics refresh rules per engine | Statistics that no longer match | — | Keeping statistics current |
| FK on the many side; MySQL creates it | Unique indexes and foreign keys | Joins and foreign keys | — |

In each case the companion's version is fuller and, for me, clearer. The Indexes versions in **Index write costs** (the last four rows) read as previews of the maintenance article and made Indexes long. The expression/LIKE/OR repetitions between Indexes and Indexing joins are the heaviest: in the second article the opening line even calls itself "the catalogue" behind the first article's checklist, so the overlap is intended, but on a full route I skimmed.

The FK repetition is fine: the second telling adds the delete measurement.

## 7. Variations I wanted to try

- Figure 6: change the table's physical order and see where index vs bitmap vs seq scan flips.
- Figure 7: change LIMIT 2 to a larger value, or drop the date condition, and watch each index.
- Keyset with mixed directions: try three sort columns, and a tied boundary value, to check the rewrite.
- Partial index with a parameter: when does my ORM's prepared statement switch to a generic plan?
- Maintaining: delete 50% instead of 90%; delete by customer_id; insert after one VACUUM vs two.
- Tenants: vary how skewed the big tenant is and see where the plan switches.

The sandbox lesson promised in Indexes ("Count the pages an index saves") would cover some of these for article 1. The other two have scripts to download but no sandbox; I'd be most likely to try the maintenance experiments, because I can't run REINDEX at work to learn.

---

## 8. Judgements per article

### Indexes

**Comprehension.** I can now explain what an index is (sorted entries with row locations, organised as a B-tree), why lookups stay cheap as tables grow, why an index stops helping for broad conditions, how to order a composite key (equality, then range/sort, then tie-breaker), when INCLUDE is worth it, when partial and expression indexes fit, how to read the important parts of a PostgreSQL plan, and how to diagnose an ignored index from the plan. I can design an index for a single query using the six-step method.

I can't confidently explain HOT updates, the visibility map, or what a key-ordered table's page counts would be. Those were the passages I skimmed through. I could apply the rules on InnoDB but couldn't predict the page arithmetic, which the article says honestly.

**Writing.** Passages that work:

- "Its cost follows the size of the table, not the size of the answer." (Sequential scan) Sets up the whole measuring frame in one line.
- The B-tree depth table followed by "going from 1 million rows to 10 million added no level". Concrete and surprising.
- "Selectivity belongs to the value, not the column." Then the paid/pending example.
- The history-query table with the 57-vs-62 warning. It teaches me not to trust one number.
- The `placed_at::date` time-zone explanation in Expression indexes.
- The Indexing-for-a-query role table and "Stop when the plan shows no work you can point to".
- The symptom-to-cause table in When the database ignores an index.

Passages that strain:

- The key-ordered conversion paragraph (quoted above): asks me to apply an unquantified conversion to all later counts.
- The covering-index visibility paragraph: four concepts in one paragraph, one of them (row versions) never introduced in this article.
- The HOT sentence: "because the old entries still reach the row and the old version points on to the new one within the page" — a picture described in a subordinate clause.
- Order without sorting: four rules before their foundation.
- Section titles used as sentence subjects ("Other index types maps the rest") — fine as links, odd in plain text.

**Thin or rushed:** Covering indexes' visibility explanation, relative to how much it decides whether an index-only scan works. HOT updates, relative to its effect on which columns to index.

**Padded:** Not padded, but long. The maintenance subsections under Index write costs (Deleted rows, Building on a live table, Finding unused, Duplicate and invalid) duplicate the third article. Choosing the key of a key-ordered table is valuable but placed early.

### Indexing joins, sorting and pagination

**Comprehension.** I can now index the FK column on the many side and know why a parent delete is slow without it; design an index that serves a filtered, sorted, limited list; explain why offset pagination gets slower with depth and write a keyset continuation that uses the index, including the mixed-direction rewrite; write the LATERAL top-1-per-group query; recognise conditions that defeat an index (functions, casts, negation, leading wildcards, collation); choose between composite and combined single-column indexes; and use partial indexes for queues and soft-delete uniqueness, including the prepared-statement trap.

I can't yet say when my driver produces a generic plan, or exactly how the planner chooses nested loop vs hash join (both linked out).

**Writing.** Passages that work:

- The opening's "each has a way of failing without an error: the query still returns the right rows, only through a scan of the whole table."
- "a customer with 50,000 orders would cost the first index all 50,000 fetches and the second still only 20" — turns a small measured gap into a scaled consequence.
- The FK delete measurement: "With the foreign-key index the delete read 3 pages of it and none of the orders table. Without it, the delete read all 1,725 pages of orders, to find nothing."
- The mixed-direction keyset passage, especially "it was the slowest way to be correct" followed by the reason and the fix.
- "a nullable sort key is usually a sign the list is really two lists."
- Queue: `state <> 'done'` "says something close but not the same".
- "one query can have two plans depending on who asks."

Passages that strain:

- "this section is the catalogue of conditions behind its first item" — wrong pointer, or at least not the first item I read.
- "an unknown-typed literal" — unexplained term.
- The second half of Prefix searches with LIKE, where SQLite's rules (NOCASE, case_sensitive_like, digits and minus signs, text affinity, GLOB) pile into one paragraph after I'd already read most of them in Indexes.
- Small unexplained numbers (65 vs 62 for bigint; offset 59,960 reading more than the table).

**Thin or rushed:** "Grouping, distinct values" doesn't actually discuss DISTINCT or DISTINCT ON despite the heading. The generic-plan point in the queue section is important and quick.

**Padded:** Conditions an index cannot see through and the OR subsection, relative to a reader who has just read Indexes. For a reader entering directly, they're right-sized.

### Maintaining indexes

**Comprehension.** I can now measure an index's size and density in PostgreSQL, judge bloat against a bytes-per-row baseline, decide whether a rebuild is worth it, run REINDEX CONCURRENTLY knowing what it needs (disk, WAL, no long transactions, no transaction block), find and drop leftover invalid indexes, refresh statistics after a load and recognise stale ones from a plan, find unused and redundant indexes without being fooled by reset counters, replace an index in production in the right order, and check an index for corruption. That is most of what "maintain indexes at work" means to me.

I can't explain how a concurrent build works internally (linked out, not needed to use it) or what PRAGMA optimize's bitmask means.

**Writing.** Passages that work:

- The opening's on-call questions.
- "Which indexes on a table go sparse depends on how the key relates to whatever decides which rows are deleted." Earned by the four-row table.
- "If you delete a lot and then insert a lot, expect the file to settle at roughly the peak."
- The bytes-per-live-row baseline in How large should it be?
- "Not on a calendar." as the rebuild lede.
- The EXPLAIN-also-waits observation under plain REINDEX.
- "Step 2 matters because a failed concurrent build looks like a completed command to a migration tool that ignores the error."
- The collation-library explanation in Checking that an index is sound.

Passages that strain:

- "Rebuilding an 11 MB index wrote about 10 MB of write-ahead log" — an index I can't place.
- "their defaults were not checked for this article, so read them for your version before depending on any number" and the Sources note about "general knowledge flagged where they appear" and the repository path — these read as notes to the author.
- "PRAGMA optimize=0x10002" with no gloss.
- "There are four kinds to look for" against three subheadings of kinds.

**Thin or rushed:** Updates leave debris too (bottom-up deletion and deduplication in two sentences), though enough for my purpose. Invalid indexes is deliberately thin and fine.

**Padded:** Building new indexes safely's opening bullets and Dropping without making things worse repeat Indexes. Nothing else felt padded; this is the article I'd bookmark.

---

## 9. Observations kept separate: possible repairs, in reading order

Not prescriptions; for the repair pass to weigh.

1. Indexes, key-ordered conversion paragraph: give the converted count for the 62-page example, or drop the instruction to convert later counts. Recheck: can a reader say whether the InnoDB lookup reads about the same pages?
2. Indexes, Choosing the key: consider placing after Page splits, or shortening here and pointing forward. Recheck: does the UUID point land without a forward reference?
3. Indexes, Range scans: "The next section" → name Selectivity.
4. Indexes, Order without sorting: either move after Composite or trim to the one idea (an index can supply ORDER BY) and leave the four details to the companion, which already has them. Recheck: does a reader understand the LIMIT bullet without the history query?
5. Indexes, Covering: one sentence introducing row versions before relying on them, or a link placed at the start of the paragraph.
6. Indexes, HOT: a smaller picture-free sentence, or a figure.
7. Indexes, Indexing for a query vs EXPLAIN: swap order, or have step 5 point forward and introduce the paid-only variant before the table uses it.
8. Indexes, EXPLAIN: say earlier that index_orders is a temporary table, or why.
9. Indexes, Index write costs: decide how much maintenance material stays here now that Maintaining indexes exists; perhaps one short paragraph and a link.
10. Indexing joins: a note on why seq-scan totals differ (1,725 / 1,728 / 1,732) and that this article ran on 18.6, near the start.
11. Indexing joins: fix "its first item" pointer.
12. Indexing joins: reduce overlap with Indexes' ignore-section (or reduce the Indexes side and let this be the catalogue).
13. Indexing joins: either discuss DISTINCT / DISTINCT ON or drop "distinct values" from the heading.
14. Indexing joins: explain the 59,960-offset page count exceeding the table, or remove that row.
15. Maintaining: name the 11 MB index.
16. Maintaining: rewrite author-facing notes (defaults not checked, general knowledge, repository path) for the reader.
17. Maintaining: gloss PRAGMA optimize=0x10002.
18. Maintaining: "four kinds" vs three subheadings.
19. All three: the section-title-as-subject link pattern reads oddly in plain text; worth checking it is visibly a link in the browser.

Useful onward curiosity, not gaps: how concurrent builds work; generic vs custom plans in common drivers; MVCC and the visibility map; DISTINCT ON vs LATERAL.
