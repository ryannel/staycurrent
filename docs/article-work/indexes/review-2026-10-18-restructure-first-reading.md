# Indexes: first reading after the restructure, 18 October 2026

**Reader:** an engineer with two years' experience who writes SQL through an application. I have heard "add an index" when a query is slow, but I didn't know what an index is or how it works.

**Artifact:** the rendered page at `http://localhost:4321/learn/databases/relational/indexes/`, served by the dev server from the working tree on branch `voice-reference-articles`, last commit `75b3649`, with uncommitted changes. I read it in headless Chromium at 1280 px wide. I read the text in page order and stepped through every figure with Next, in every option the controls offer. I took screenshots at several steps. I didn't open the source, `docs/` or any review notes. This was a sequential reading, not an outline-first one. The contents list near the top did show me the headings in advance.

**Before reading.** From the title and the "Deep dive, about 34 minutes" label, I expected to learn what an index is, why it makes a query fast, and how to tell which index a slow query needs. I expected an expert to be able to look at a query and its plan and say what index to add, or why one isn't used.

---

## 1. The opening, before reading on

**What I can now explain.**
- An index is a sorted copy of one or more columns' values, and each entry records where its row is stored. It works like the index at the back of a book. This came from paragraphs 1 and 2, and the book comparison did most of the work.
- It's for finding rows by value without reading the whole table: filters, ranges, sorts, joins on a key, and enforcing uniqueness.
- It costs space and write work.
- The work a query does is mostly the number of pages it reads. That came from the pages paragraph, and it was new to me.

**When I would add one:** when a slow query filters on a column and few rows match.

**Questions I carried out of the opening:**
- "line up with the index's columns, starting from the first": I don't yet know what an index on several columns looks like. This was answered in Composite indexes, about 40% of the way down. That's a long time to carry it, but I could carry it.
- "few enough rows have to match": how few? This was partly answered in Selectivity. The answer is "it depends where the rows sit, and the planner decides", which is honest but gives me no threshold.
- "planner" and "query plan" are used before they're defined. The planner is defined in Selectivity. Query plans are explained in Checking an index with EXPLAIN, near the end. I understood both terms well enough from context.

The opening has five dense paragraphs. Each one is clear, and I followed them all. It ends with "Counting pages is how you choose an index", which works as a promise for the rest of the page.

## 2. Section by section

### Sequential scan
- I expected "what happens without an index" and got it. Defining "heap" here was fine.
- Two tables arrive at once, the invented 36-row table and the 60,000-row table. Keeping both in mind was manageable.
- **Figure 1** has 37 steps, one per row. After about eight steps I had the idea, and stepping through the other 28 rows taught me nothing more. The Play button helps. The counters are good.
- The sentence that landed: "Its cost follows the size of the table, not the size of the answer."

### Index entries and row locations
- The TID example, order 3 at (0,3), was concrete. I wanted to try `SELECT ctid, *` myself.
- **Figure 2** helped. Watching the entries sort and customer 42's four entries end up side by side made the book comparison literal.
- Repetition: the 1,725 → 62 comparison appears in the caption under the figure title, in the counter strip, and again in the paragraph after the figure. I noticed it the third time.
- I asked "why 60 table pages for 60 rows?" and the next sentence answered it ("sit on 60 different pages"). Good timing.
- **Clustered tables** is where I first wobbled. "The table is stored as a B-tree, the structure the next section describes" points to something I don't know yet. "A row moves when its page fills up and divides in two" I took on faith. I did follow "other indexes store the primary key instead, so a lookup takes two searches". If I'm on MySQL, this matters to me, and I'm told the details come later.

### B-tree
- **Figure 3** is one of the most useful figures. Root, branch and leaf, plus the narration "Three index pages read, one per level, out of nine", made page counting concrete.
- **Confusion in the narration:** "Root page: 42 is 42 or above, so the search follows the lower pointer to a branch page." The word "above" refers to the value and "lower" refers to the position on screen, in the same sentence. I had to look at the drawing to work it out. Figure 4 does the same thing: "20 is below 42, so follow the upper pointer." The caption also says "the lower branch page (42 and above)".
- The narration says "Leaf page 4", but the leaf pages aren't numbered in the drawing. I counted rows to find it.
- The depth table (100k rows → 2 levels, 10M rows → 3) convinced me. "367 entries per leaf" explains why.

### Range scans
- **Figure 4** is clear: one descent, follow the links between leaf pages, stop at 42, and the "sort needed" counter stays at none. The "From" picker let me try other starting points, which was the variation I wanted.
- **Stalled here:** right after the figure showed that no sort was needed, the text says "PostgreSQL then sorted the 360 rows again. It had fetched them with a bitmap heap scan". "Bitmap heap scan" isn't defined until two sections later. Until then this read as a contradiction of what I'd just watched.

### Searching a clustered table
- **Figure 5**, the static one, helped. Four arrows, each passing through "upper levels", showed "a second descent per entry" at a glance.
- I was lost on "each descent also re-reads the table's upper pages from memory, and a count of every page visit, such as Buffers, would include those too". Buffers hasn't been explained yet, and I couldn't tell the bottom line: is a clustered table slower for this lookup or not?
- The four-engine comparison table is dense. I skimmed it. Rows 2 and 3 cost me time and gave me nothing I could use on a slow query.

### Selectivity and the planner's choice of scan
- Selectivity is defined clearly. The planner is finally defined here, though the opening used the word. The list of three routes is clear. The bitmap heap scan definition here would have saved me the stall two sections earlier.
- **Figure 6**: the "pages holding a match" counter is the key idea, and the figure makes "every page has a match by the third step" visible. The "By customer" toggle was exactly the variation I wanted to try. From step 4 to step 16 the narration is the same sentence with new numbers, and I stopped reading it.
- **Repetition:** the 60,000-row numbers (922 of 1,725 pages, the switch at 550, 1,715 pages on the shuffled copy) appear in the long caption under the figure title, in the counter strip, and in two paragraphs after the figure. I read 922/1,725 three times.
- **Holding too much:** the setup said "each customer's 60 orders are spread through the table". Now I'm told the 60,000-row table "is laid out like the By customer order". Both are true: one customer's rows are spread out, while a range of consecutive customers is bunched together. But I had to stop and work that out. The page doesn't reconcile the two.
- Seq vs random page cost: fine, but I would never change those settings. It felt like a side door.
- **The most useful line in this section:** "Selectivity belongs to the value, not the column", with the paid and pending example. It made me think straight away of status columns in my own app.

### Composite (multicolumn) indexes
- I expected an answer to the opening's "starting from the first", and got it: entries sort by the first column, then by the second.
- The history query uses real SQL, which helped. The table name changes from `orders` to `index_orders`. I noticed the change and assumed it's the same 60,000-row table.
- **Figure 7 is the best figure for me.** Switching between customer, (customer, date) and (date, customer) showed three outcomes: fetch four rows and sort, read two entries and stop, or skip 16 entries. I saw the column-order rule before the prose stated it. The 16 "skip it" steps in the date-first run are the right length, because the tedium is the point.
- The rule "columns compared with = first, then the range or sort column" is something I can apply tomorrow.
- **My yardstick wobbled:** "Pages dominate the work, but not all of it". The 54-page index is worse than the 62-page one because it read 11,000 entries. The opening told me to count pages. Now I don't know whether to count pages or entries when I compare two indexes.
- The "three fates" list is a good mental model. But the paid-only example relies on "the covering index from the next section", INCLUDE (total) and "an index-only scan of 5 pages" before either idea has been explained. I took those numbers on trust.
- **Link names used as sentence subjects** tripped me up. Examples: "The column has to stand alone measures each case", "Uniqueness among the live rows works it through", "The foreign key that makes a delete slow measures the difference" and "What stops the index supplying the order works through the cases". I read the first one twice before I realised it was an article title. I also can't tell from the text whether these articles exist yet.
- Indexes and ORDER BY: direction and LIMIT matter to me. NULL placement and collation felt like detours in this article. The LIMIT point ("the index pays when the query stops early") is the important one, and it comes fourth of four.
- Combining indexes: practical, and it ends with a rule I can use: conditions joined by AND go in one composite index, while OR or many different combinations suit separate indexes.
- **Overall:** this one heading covers four topics: column order, what happens to each condition, ORDER BY, and combining indexes. It was the longest stretch of the article for me, and the heading didn't warn me that ORDER BY and combining were coming. By the end of it I was holding a lot.

### Covering indexes and index-only scans
- The two requirements are set up cleanly. The one sentence about old row versions ("keeps the old version while a transaction that began earlier might still need it") was just enough for me.
- **Figure 8:** "Then updated" is the moment I'll remember. An update to customer 60's order sends customer 42's lookup back to the table, because the two orders share page 3. The figure earns its place. With INCLUDE selected, the default state is the same as "Not vacuumed". I clicked both, wondering what differed.
- The closing advice, "frequent query on a table that changes slowly", is useful.
- I skimmed the engine table. The SQLite "Never" cell made me curious, but I didn't need it.

### Partial, expression and unique indexes
- Partial indexes: I have both the queue pattern and the soft-delete pattern in my own app. Good.
- Expression indexes: the time-zone explanation of why `placed_at::date` can't be indexed was more than I needed. The takeaway was great: write the query exactly like the index expression, and it reads 47 pages instead of 1,725.
- Foreign key index: practical and new to me (PostgreSQL doesn't create one for you).
- Joins: "nested-loop join" isn't explained, but the link out was fine.
- This is the fourth engine table, and by now I skip them.

### Write cost and upkeep
- **Figure 9:** the INSERT vs UPDATE and 1 to 4 index controls work well. The update story was clear: a HOT update while no index holds total, then 5 pages once one does. Before this figure I didn't know that indexing one extra column could make every update write more.
- **Counting mismatch:** at the end of the insert, the counter says 8 pages written, 7 of them index pages. I counted the highlighted boxes and got 1 + 1 + 1 + 3 + 1 = 7 in total. The branch page that the orders_history split updates isn't drawn, so the boxes don't add up to the counter.
- **Possible inconsistency:** on first load, before I touched any control, step 3's narration read "orders_pkey: 1 page." After I clicked INSERT it read "37 is the largest order_id, so its entry goes at the end of the last leaf page." Figure 11 behaves the same way: the first-load VACUUM step read "VACUUM: six pages, each a third full." and the later one was the full sentence. My script waited only 120 ms between steps, so this could be timing. It's worth a look.
- **Figure 10:** the visual contrast (5 full pages vs 7 ragged ones) works at a glance. 75 steps is a lot, and Play is the only sensible way through. Some steps drop one row's narration. Step 3 says only "Key 2 of 75." Step 27 describes only the bottom row, and step 32 only the top row. The figure follows InnoDB's fill levels (15/16) while the prose next to it gives PostgreSQL's 90%. The caption says so, but I had to switch engines in my head.
- Choosing the primary key of a clustered table: width, insert pattern and stability is a clear checklist. The "integer key, plus the public UUID in a unique index" compromise is directly useful to me.
- **Figure 11:** clear. Scattered deletes thin every page, while block deletes empty pages but keep the file the same size. Only REINDEX shrinks it.
- Building, finding and dropping indexes: practical (load data first, then build indexes; use CONCURRENTLY). It points out to a companion article for the checks.

### Checking an index with EXPLAIN
- This is the section I needed earlier. It's the first time I see what a plan actually looks like, and the first figure caption pointed here 30 minutes ago.
- "Read from the most indented line outwards" and the four things to look for are clear.
- **The best practical check in the article:** pages read should be about the tree's depth plus one table page per row returned, with Heap Fetches near zero.
- The note that ANALYZE means two different things was helpful. `rows=10.00` with decimals made me curious, but it isn't explained.

### Designing an index for a query
- This is the payoff I came for: a numbered procedure plus a table mapping each part of the query to a key position. I could follow it with my own query.
- The partial-index exception for a fixed-value condition is a good twist.
- "Stop when the plan shows no work you can point to" is a clear stopping rule.
- It arrives about 30 minutes in. For a reader with a slow query, everything above it is the explanation. I wouldn't move it, but a pointer from the opening ("jump to Designing an index if you have a query in hand") would have helped me.

### Other index types / Where the numbers come from / Sources
- Other index types is a good map, with one line each, and it was fast to read.
- Where the numbers come from: I'd like to run the sandbox lesson. That's exactly the variation I wanted throughout ("what if I index status first?").

---

## 3. Where figures helped and where they repeated
- **Helped most:** Figure 7 (column order), Figure 3 (B-tree page count), Figure 8 ("Then updated"), Figure 6 with its "By customer" toggle, Figure 5 (the static clustered lookup) and Figure 2 (the sort).
- **Repeated an easy sentence:** Figure 1 after the first page of rows, and Figure 6 steps 4 to 16. In nearly every figure, the long caption under the figure title also states the result before I've stepped through it, and the paragraphs after the figure state it again. For figures 2, 6 and 9, I read the 60,000-row numbers three times each.
- **Where I wanted to try a variation:** `SELECT ctid` on my own table; another customer in Figure 3 (the dropdown is there); the "By customer" order (there); status before placed_at in the paid-only query (prose only); my own query in the sandbox.

## 4. At the end: given a slow query, what would I now do?
1. Run `EXPLAIN (ANALYZE, BUFFERS)`. Look for Seq Scan, Filter with many Rows Removed, a Sort node, and the buffer counts.
2. Sort the query's columns into roles: equality, range or sort, returned only. Build a composite index with the equality columns first, then the range or sort column, then a tie-breaker.
3. Check that the equality columns cut the table to a small fraction. If they don't, an index won't help much, unless a partial index fits.
4. Re-run the plan. Conditions should be under Index Cond, the Sort node should be gone, and pages should be about the tree's depth plus one per row.
5. Consider INCLUDE only for a hot query on a table that rarely changes, and check that VACUUM runs.
6. Check whether the new index makes an old one redundant, and remember that each index adds write cost.

**What I'd still get wrong:**
- I'd probably wrap a column in a function or cast (`lower(email)`, `::date`) and wonder why the index isn't used. The article covers this, but only in one paragraph and a link.
- I'd misjudge when the planner prefers a sequential scan. I know it depends on where the rows sit, but I can't predict it, and the article says the planner can't fully see it either.
- I'd compare two candidate indexes by page count alone, and miss the "11,000 entries read" warning sign.
- On MySQL, I'd forget that every secondary index carries the primary key, and that a covered query can still visit the table.
- I'd likely add an index without thinking about HOT updates on a column that changes often.
- I don't know how to run the plan safely on production, because ANALYZE actually runs the query. For a write query, that matters.

## 5. Handoff: observations, causes and smallest repairs

**Blocks following the argument**
1. *"Bitmap heap scan" is used in Range scans before it's defined in Selectivity.* Consequence: it reads as a contradiction of Figure 4's "no sort needed". Smallest change: define it in one clause where it first appears, or move the 60,000-row sort remark into Selectivity. Recheck: does a new reader still report a contradiction after Figure 4?
2. *The paid-only example in Composite relies on INCLUDE and index-only scans from the next section.* Consequence: the example's numbers are taken on trust. Smallest change: move the paid-only example after Covering indexes, or drop the covering detail from it. Recheck: can the reader say why that query read 15 pages and then 5?

**Slows reading down**
3. *"Above" and "lower" mixed in one sentence* in the Figure 3 and Figure 4 narration and caption. Smallest change: name the pointer by its label ("follows the ≥ 42 pointer") rather than its position on screen.
4. *The 60,000-row table described as "spread" and later as "By customer".* Smallest change: one sentence in the setup or in Selectivity saying that one customer's rows are spread out while a range of consecutive customers is bunched together.
5. *Pages vs entries as the yardstick.* The opening says to count pages, and Composite says pages aren't everything. Smallest change: one sentence in the opening or in EXPLAIN saying that entries read matter too, and how to see them.
6. *The Composite heading holds four topics.* Smallest change: give ORDER BY and Combining indexes their own top-level headings, or rename the section.
7. *Link names read as sentence subjects.* Smallest change: rephrase as "see X" or put the link in a clause.
8. *"Buffers" mentioned in Searching a clustered table before it's explained, with no bottom line.* Smallest change: one plain sentence on whether a clustered lookup costs more, and either defer the Buffers remark or drop it.
9. *Figure 9's boxes don't add up to its counter* (the branch page isn't drawn). *Figure 10's narration drops halves at some steps.* *The first-load narration may differ from the narration after a control is clicked* (Figures 9 and 11, unconfirmed).

**Costs time without return**
10. The 60,000-row numbers are stated three times around figures 2, 6 and 9 (caption under the title, counter strip, paragraph after).
11. Figure 1 steps every row. Figure 6's narration repeats from step 4 on.
12. Four engine-comparison tables. For this reader they were reference material, not reading. Collation and NULL placement in the ORDER BY section, and the time-zone reasoning for expression indexes, ran longer than their takeaway needed.

**Useful curiosity for later**
- Running EXPLAIN ANALYZE safely on write queries.
- What `rows=10.00` with decimals means.
- Why a SQLite covered query "never" visits the table.

**Keep these:** the book comparison in the opening; "cost follows the size of the table, not the size of the answer"; Figure 7; Figure 3's "one per level, out of nine"; "Selectivity belongs to the value, not the column"; Figure 8's "Then updated"; the depth-plus-one-per-row check; the Designing an index procedure and its role table.
