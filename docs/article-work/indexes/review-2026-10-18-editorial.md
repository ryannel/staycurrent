# Indexes: editorial review, 18 October 2026

Perspective: editor. The question is whether this page can be the reference future
writers copy for style and tone.

How I read it: the rendered page at `/learn/databases/relational/indexes/`, top to
bottom, with headless screenshots of the header and the first four figures. The browser
pane's tab limit was full, so I couldn't step through the figures by hand. I read each
figure's component instead (`src/components/explainers/indexes/`), including every
frame's narration, counter and "At 60,000 orders" line. I read the reading pack and the
style skill first. I didn't open the writer's notes in this folder until this reading
was written down.

## Summary

The sentence-level work is done. Paragraphs average 46 words and sentences 16.5, which
is right on the Sam Who and Ciechanowski calibration. Only three sentences run past 30
words. Eleven of the twelve figures follow the house pattern cleanly: the prose says what
to watch, the reader watches, and the next paragraph says what happened and names the
term. The opening informs, as it should.

What keeps it from being a reference is structure across the page, not individual
sentences. The 60,000-order table enters before it is introduced and goes by three names.
In one place the toy figure and the measurement point opposite ways and nothing
reconciles them. A section on key-ordered tables uses tree descents before the B-tree
section explains them. The same point about clustered primary keys appears four times.
Three examples contradict the rule printed beside them. About ten sentences record where
a fact came from instead of stating it. Each of these has a small repair.

## What works, and should be pointed to

**The opening.** In three paragraphs a newcomer learns what an index is ("lets a database
find rows by their value without reading the whole table"), what it is like (the book
index), when to reach for one (filter, range, sort, uniqueness, joins) and what it costs
(space, and every insert and many updates). Pages then come in as the unit of work, and
the fifth paragraph sets the yardstick the article uses throughout. No housekeeping comes
before the subject. The invented table, the measured table and EXPLAIN all wait until the
first section.

**Exemplar 1: column order in a composite index** (`#composite`, around Figure 7). The
setup asks for one thing: "Switch between the three indexes and count the entries each
one reads." The paragraph after it gives the three results in three parallel sentences,
each with its reason: "With the date first, every customer's entries were interleaved by
date, and the scan read 16 to find two." The reader sees the rule happen before it is
stated. This is the clearest watch-then-say passage on the page.

**Exemplar 2: the visibility map** (`#covering`, from "Holding the columns is not always
enough" through the paragraph after Figure 8). It runs break, fix, new cost. Covering
the columns isn't enough, here is why (old row versions), here is the bit that fixes it,
and here is the update that clears it again. The term arrives as the name for what was
seen: "Each `Heap Fetches` is one such visit." The scale paragraph then gives 13 pages to
4 and 2.3 to 2.9 MiB, and closes on a plain verdict with its condition attached: "A
covering index pays for a frequent query on a table that changes slowly, where most pages
stay all-visible between vacuums."

**Exemplar 3: the HOT update** (`#writes`, "The update wrote 1 page until an index held
`total`, then 5" through the next paragraph). It gives the observation, then the
mechanism in one concrete sentence, then the name, then the condition, then the cost:
"Any other update adds an entry to every index on the table, including indexes on columns
it didn't change."

Close behind are the Figure 2 passage (Build), the leading-column passage ("The giveaway
is the page count, not the plan's wording.") and the two paragraphs after Figure 10.

## Findings, most consequential first

### 1. The 60,000-order table arrives early, sits in the wrong place in the prose, and goes by three names

- Figure 1 shows "At 60,000 orders: 1,725 pages read to return 60 rows" under its
  counters before the reader has heard of any 60,000-order table. The introduction comes
  in the paragraph after the figure.
- That paragraph says "Under each figure is the same measurement". The line actually sits
  inside the figure, between the counters and the drawing. A reader who looks under the
  figure finds the caption.
- The prose calls it "the generated table" 15 times. Once it is "a larger table". The
  figures say "At 60,000 orders" and the hidden fallbacks say "the 60,000-order table".
  "Generated" says how the table was made, not which table it is. That is a provenance
  word doing a naming job, and it doesn't connect to the label the reader sees in every
  figure.
- Figures 7 and 8 label the line "History query at 60,000 orders:". The history query is
  defined five paragraphs after Figure 7.

What happens to the reader: in the first figure they meet two tables at once and don't
know which one the counters describe. Later, "On the generated table" doesn't bring the
figure line to mind.

Smallest repair: move the 60,000-order table's two-sentence introduction before Figure 1,
and say where the line is ("Each figure also shows, under its counters, the same
measurement on…"). Replace every "the generated table" with "the 60,000-order table".
Either introduce the history query before Figure 7 or label Figure 7's line by its
content ("Customer 42's ten newest orders, at 60,000 orders").

The scale number helps most where the prose reconciles it with the toy straight away.
Figure 2 shows 62 pages against 1,725, and the next paragraph explains the 2 + 60. Figure
4's counters reach 3 index pages while its line says 2, and the next paragraph explains
why ("The generated customer index has only two levels"). Keep that pattern. Findings 2
and 3 are the places that break it.

### 2. Selectivity: the figure and the measurement disagree, and the reader can't see why

Figure 6 teaches that matches cover every page by 22% of the table: "From there the
index can only add work." The 60,000-order line in the same figure, and the prose after
it, say that at half the table PostgreSQL's bitmap scan read 922 of 1,725 pages, about
half. Then a copy "with the same rows in random order" read 1,715. So the measured table
behaves the opposite way to the figure, and the shuffled copy behaves like it. The page
never says why. The only hint is "its estimates don't see where rows physically sit".
Earlier the 60,000-order table was described as "spread evenly through the table", which
a reader will take to mean every page holds every kind of customer.

This is also the longest stretch of reasoning on the page with no figure. After Figure 6,
six paragraphs follow: page costs, estimates against counts, the random copy, the skewed
`status` value, statistics, and other engines. Throughout, the reader has to picture two
physical orders of the same rows.

Smallest repair: one or two sentences after the 922 figure saying how the 60,000-order
table lays out its rows (which customer numbers share a page) and that the toy table, like
the shuffled copy, scatters them. If the figure can take it, a second control ("table
order: as inserted / shuffled") would show the point directly and make the random-copy
paragraph a description of what the reader just saw.

The range-scan section has a smaller version of this problem. Figure 5's counter says
"sort needed: no", and then the measured range "sorted the 360 rows again… The next
section explains why." The hook is deliberate and pays off. Even so, one clause naming
the cause (a bitmap scan, which reads table pages in page order) would stop the
measurement from undoing the figure for a section.

### 3. "Tables stored in key order" comes before the B-tree it depends on

This subsection, the second section's second half, describes rows that move "when its
page fills up and divides in two" (a split). It describes searches that go "down the
table" and "sixty descents of the table". Figure 3 draws "upper levels" boxes. Each
descent "starts from the same few upper pages, which the first one has already brought
into memory". All of this asks the reader to picture a tree descent, and the B-tree
section that shows one comes next. The B-tree section then opens "So far, nothing says
how a search finds the first 42", which reaches back past the whole subsection to Figure
2. That is the sign it interrupted.

The subsection also opens with an engine roll call before the mechanism. Its first two
paragraphs cover InnoDB's fallback when a table has no primary key, SQLite's
`INTEGER PRIMARY KEY` rule and SQL Server's default. Only the third paragraph says why
the design exists ("Rows in such a table have no fixed page and slot to point at"). Two
paragraphs then make the same point twice: "reads about the same number of pages but
does more searching", followed by "So the total is still about 62 pages, reached by 60
searches instead of 60 direct jumps." After Figure 3, "sixty matching entries" switches
from the four entries on screen to the 60,000-order table without saying so. It also
spells out "sixty" where the rest of the page writes "60".

Smallest repair: keep a short version under "Index entries and row locations". Say the
other design stores the row's key in every index entry instead of a page location, and
that finding a row is then two searches. Move the full treatment, with Figure 3 and the
62-page comparison, to just after the B-tree or range-scan section, where "descent" and
"upper levels" are already known. Lead with the mechanism, and gather the engine facts in
one sentence or a short table. Merge the two "about the same pages" paragraphs.

### 4. One point about clustered primary keys appears four times

That a random key in a key-ordered table splits table pages, while in a heap only the
index pays, appears:

1. in the third bullet under "Tables stored in key order" ("In a heap, a random key
   scatters only its own index");
2. at the end of "Page splits" ("In a heap, only the index pays");
3. in the "Insert pattern" bullet of "Choosing the primary key of a clustered table";
4. in that subsection's last paragraph ("width and randomness cost only that index and
   not all of them").

Key width appears twice (the "InnoDB's documentation advises a short primary key" bullet,
then the "Width" bullet). Key stability also appears twice (the InnoDB paragraph in
"Write cost", then the "Stability" bullet). One more line, "In InnoDB the primary key is
the table itself, so a primary key costs no separate index", sits alone after the engine
table in `#kinds` and repeats the clustered section.

Read in sequence, this is where the page most feels like a reference assembled from
parts. Smallest repair: "Choosing the primary key of a clustered table" is the
decision-shaped version, so keep it as the one full statement. Cut the clustered
section's three bullets to one sentence pointing to it. Drop the closing sentence of
"Page splits" and the stray line after the `#kinds` table.

### 5. Three examples contradict the rule beside them

- **"The condition matches too much"** (`#ignored-selectivity`): "nothing is wrong with
  that plan. To prove it, turn off the routes the planner preferred and compare." The
  forced index scan then read 1,426 pages against 1,725. On the yardstick the article has
  used since its opening ("An index helps when it lets the database read fewer pages"),
  the proof shows the opposite of its claim. The real argument, that jumping reads cost
  more than sequential ones, can't be settled by page counts, and the page says none of
  its numbers are timings. Repair: say exactly that. "The forced plan read a sixth fewer
  pages, but in jumps. Whether that is faster depends on your storage, which is what
  `random_page_cost` describes, so compare times on your own server."
- **Combining indexes** (`#combining`): "When one condition is selective on its own, the
  planner uses only that index and checks the rest on the fetched rows." Two paragraphs
  earlier, `customer_id = 42` (60 rows in 60,000) still produced a `BitmapAnd` with the
  `status` index. Repair: give the condition under which the planner skips the second
  index, or drop the sentence. An accuracy reviewer should confirm which it is.
- **Stale statistics** (`#ignored-statistics`): the example plan "happened to be the
  cheaper route anyway". The section warns about a failure the example doesn't show.
  "A simple version fails, a fix follows" needs the failure. Repair: use a case where the
  stale estimate picks the slower plan, or cut the example down to the rule ("a gap of
  ten times or more… is the sign") and the `ANALYZE` advice.

### 6. Engine differences: the tables work, some prose asides still interrupt

The model to copy is the engine table that comes after a mechanism and is framed as
questions: "When does a covered query still visit the table?" and "Was an index
searched?" The covering, variant-support and EXPLAIN tables all do this, and the reader
can skip them. Engine paragraphs that change a decision also earn their place: SQLite's
one index per table (so `AND` wants the composite index), MySQL sorting NULLs first,
InnoDB updating rows in place, and the differences in what blocks writes during an index
build.

The asides that still interrupt:

- **Range scans:** "SQLite's leaf pages hold no such links. At the end of a leaf it moves
  up to the parent page and down to the next leaf, along the path it came down, so that
  is not a new search from the root." This is the longest sentence on the page (35
  words). It sits between the figure's lesson and its measurement, and it changes no
  decision. Cut it or move it to the companion.
- **Tables stored in key order:** the roll call described in finding 3.
- **Composite:** "MySQL and SQLite can in narrow cases." This is a half-sentence about
  other engines inside an explanation the reader is told not to design around.
- **Selectivity's last paragraph:** "InnoDB and SQLite also choose between an index and a
  full scan by estimate, and an index stops paying in them too once it matches enough
  rows." This tells the reader nothing new. Keep the MRR sentence if it's wanted, and
  drop the rest.
- **"The condition matches too much":** "Its manual expects the index hints to be
  deprecated in favour of optimizer hints." See finding 7.

### 7. Sentences that record where a fact came from

The style skill names this residue from Storage, where there were eight. This page has
about as many:

- "PostgreSQL's multicolumn index documentation states the rule precisely: …" Just state
  the rule.
- "InnoDB's documentation advises a short primary key for this reason, because …" The
  reason is enough.
- "The fill levels in the figure are InnoDB's documented ones" (after Figure 10). Figure
  10's caption already says this.
- "Its manual expects the index hints to be deprecated in favour of optimizer hints such
  as `INDEX`." Say "Prefer the optimizer hint `INDEX`; MySQL plans to deprecate index
  hints", or drop it.
- "Costs, timings, a type cast and one detail line are left out, and long lines are
  wrapped." "Costs and timings are left out" covers it.
- "On those engines the measurements here show what to expect, not what you will see."
  The sentence before it has already made the point.
- "which the generated table doesn't have" (the NULLs bullet). Drop it, since the example
  stands without it.
- "such as the site's sandbox" (the LIKE paragraph). This belongs in "Where the numbers
  come from".
- "so read the later counts with that in mind" (the clustered section). The next
  paragraph does the reading for them, so cut this.
- "Here the index scan happened to be the cheaper route anyway". See finding 5.

Keep the ones that teach a term the reader will meet in documentation ("its documentation
calls the table the clustered index", "PostgreSQL's documentation calls them internal
pages").

### 8. Headings and terms

- **Term drift for the second storage design.** It appears as "tables stored in key
  order" (heading), "key-ordered table" (four times), "clustered index" (five) and
  "clustered table" (heading of `#key-choice`). The field's term is "clustered index" (or
  "index-organized table"). The h3 avoids it, so a reader looking for "clustered index"
  doesn't find it in a heading. Repair: "Tables stored in key order (clustered indexes)",
  then use one name in the prose.
- **Joins are promised in the opening and hidden in the body.** They get one paragraph
  under "Unique indexes and foreign keys". Repair: "Unique indexes, foreign keys and
  joins".
- **The OR case sits under the wrong heading.** The diagnosis table links "An OR with an
  unindexed branch" to a paragraph under "The column is wrapped, converted or compared by
  pattern". Give it its own h3, or name it in that heading.
- **"Other index types" interrupts the B-tree sequence.** It sits between the
  partial/expression section and "Write cost and upkeep", which goes back to B-tree pages
  and splits. As a map of other types, it would fit at the end, before "Where the numbers
  come from".
- **Terms used without being defined or named.** `text_pattern_ops` is never explained.
  One clause would do: it compares strings character by character and ignores the
  collation. Skip scan is described ("once for each distinct value of that column") but
  never named, though the sources list uses the name. "Heap" is defined twice, in the
  sequential-scan section and again in "Tables stored as a heap".
- **"Covering" collides.** Right after the covering-index section, the partial index is
  compared with "an index on `placed_at` covering every row". Say "a full index on
  `placed_at`".

### 9. Smaller figure and transition notes

- **Figure 9 has two jobs and two controls,** but the prose names only one: "Change the
  number of indexes and count the pages each statement writes." Add "then switch to
  UPDATE" so the HOT lesson isn't left to the caption.
- **Figure 10 is the only figure modelled on InnoDB,** although the page earlier says "The
  rest of this article counts PostgreSQL's pages". The caption says so, which is enough.
  The prose after the figure needs only PostgreSQL's 90% and the 166/225 measurement.
- **The range-scan links between leaf pages are never named.** "Followed the link to the
  next" is fine for this reader. Name them only if a later page relies on the term.
- **The `#selectivity` setup paragraph does two jobs.** It closes the range-scan hook and
  sets up Figure 6. Split it so "Figure 6 widens a range…" starts its own paragraph.
- **"Designing an index for a query" opens on a summary of the page:** "The sections above
  explain what an index does, and the plan of the previous section shows whether it did."
  Start at "Choosing an index starts from a query." Its last paragraph ends on two
  polished lines. "Pages left over are the rows you asked for" is cryptic, and "replacing
  is cheaper than adding" refers to a replacement the reader never saw ("The history index
  replaced the plain `customer_id` index").
- **Defined after use.** "The write-ahead log is the record of changes…" comes in the
  sentence after the WAL measurement. Swap the order.
- **Captions end with an instruction that repeats the prose** ("Play it and watch the
  bottom row split"), and the caption sits below the controls, after the reader has
  watched. This is harmless for skimmers. Captions that finish a thought ("Both choices
  delete 24 rows") do more than captions that repeat the setup.
- **Captions write "figure 2" and "figure 4" in lower case;** the prose writes "Figure 2".

## Verdict: ready after the listed repairs

Sentence by sentence, this is already the voice the owner asked for. It uses ordinary
words, keeps sentences short, defines terms in place, opens with substance and runs
figures on the Sam Who pattern. The composite, covering and HOT passages can be pointed to
now. It shouldn't become the reference yet, because a writer copying it would also copy
four habits the house is trying to lose. Those are a second running table introduced late
and under a provenance name, a section placed before the mechanism it relies on, one
point made in four places, and examples that don't support their rule. Findings 1 to 5
fix those, and each is a move, a merge or a sentence. Findings 6 to 8 are trims of the
kind the style pass already did well elsewhere. None of the repairs needs a new figure.
The optional table-order control in finding 2 would be the one addition worth making.

## Checked after the reading

Once the reading above was written, I read `setup.sql` to confirm finding 2. The
60,000-order table sets `customer_id = 1 + n % 1000`, so neighbouring rows have
neighbouring customer numbers. A page of about 35 rows holds about 35 consecutive
customers, and `customer_id <= 500` falls on roughly half the pages. That is the 922.

`status` is laid out the same way: `'pending'` comes in runs of 1,000 consecutive rows.
So the paragraph that begins "Selectivity belongs to the value, not the column" depends
on layout as well. Pending orders are a fifth of the table, and by Figure 6's logic a
fifth of the table already covers every page. They used the index only because they sit
together, on 365 pages. Whatever sentence explains the customer layout should explain
this too, or the example should say the pending rows arrived in blocks.

## Re-read after repairs

I re-read the assembled page from top to bottom: headings, captions, figure titles,
controls, counters and the "At 60,000 orders" lines. I rendered it in headless Chromium
with reduced motion and stepped Figure 6 through both table orders. I also read the 25
lesson steps the page links to. The account I checked against is "Repairs" in
`style-pass-2026-10-18.md`.

### Findings resolved

1. **The 60,000-order table** is introduced before Figure 1, with an accurate location
   ("Most figures also show, under their counters…"). "Generated table" no longer
   appears anywhere. The history query is defined before Figure 7, and Figure 7 is set up
   as "a small version of it", which binds the toy to the measurement. Resolved.
2. **Selectivity.** The "Table order" control does what the prose needed. In "By
   customer" the matches fill one page before reaching the next, and the 60,000-order
   table's layout is explained ("Its customers take turns"). The `status` example now
   says why the pending orders used the index. The pattern holds: the reader watches,
   then the prose names correlation as the planner's one measure of physical order.
   Resolved.
3. **Clustered tables.** The short version now leads with the mechanism and waits for
   the B-tree before the full treatment. The engine roll call has become a table framed
   as questions. Resolved, with one new strain below (the range-scan hook).
4. **Primary-key repetition.** Width, insert pattern and stability now live only in
   "Choosing the primary key of a clustered table". `#clustered` points to it in one
   sentence. Resolved.
5. **Examples against their rule.**
   - The forced scan no longer claims proof and sends the reader to time it.
   - The combining rule now gives its condition and a measured case
     (`order_id = 7 AND status = 'pending'`).
   - Stale statistics now shows the failure: 120,723 pages against 1,565.

   Resolved.
6. **Engine asides.** The SQLite leaf-link sentence is gone. Resolved.
7. **Source sentences.** The listed sentences now state the fact directly. Provenance has
   moved into "Where the numbers come from", which is where it belongs. Resolved.
8. **Headings and terms.**
   - "Clustered table" is used consistently.
   - Joins are named in their h3.
   - The OR case has its own heading.
   - "Other index types" sits before the provenance section.
   - Skip scan is named and `text_pattern_ops` is explained.
   - "Heap" is defined once, and "a full index" replaces "covering every row".

   Resolved.
9. **Smaller notes.**
   - Figure 9's setup names the UPDATE switch.
   - The write-ahead log is defined before its numbers.
   - The design section opens on the query.
   - "What remains is a few index pages and about one table page per row returned" is
     concrete where the old line was cryptic.

   Resolved.

### New strains, with the smallest repair

**The range-scan explanation now appears three times.** Range scans gives the cause in
full: "It had fetched them with a bitmap heap scan, which reads table pages in page order
and loses the index order, as the section after next explains." The bitmap bullet in
Selectivity says it again ("returns rows in page order, not index order"). Then a
standalone paragraph says it a third time: "The lost order explains the sort in the
range-scan example…" The move also put "Searching a clustered table" between the hook and
its payoff, so "the section after next" is a signpost the reader has to count. Repair:
delete the Selectivity callback paragraph, and end the Range paragraph at "loses the
index order", or link "Selectivity" by name. (Another option is to move "Searching a
clustered table" up to follow "B-tree", since it needs only the descent. The deletion is
smaller.)

**Selectivity carries the two longest paragraphs on the page.**
- The `status` paragraph is 84 words. It holds the value-not-column rule, both results,
  the block layout and the counterfactual. Split it after "while the pending orders used
  the index", and start a new paragraph at "Their layout helped".
- The shuffled-copy paragraph is 79 words, with a 35-word sentence defining correlation.
  Split it after "The planner still switched at the same point", so correlation gets a
  paragraph of its own.

Two sentences in that section also make the reader work:
- "With the rows scattered, by the third step, with 8 rows or 22% of the table matched,
  every page held a match" stacks three openers. Try "With the rows scattered, every page
  held a match by the third step, when 8 rows (22% of the table) matched."
- "The 60,000-order table is laid out like the second" makes the reader look back. Try
  "like the 'By customer' order".

The MRR sentence now trails a paragraph about statistics. Attach it to the bitmap heap
scan bullet, or drop it.

**"The condition matches too much" grew from two paragraphs to four.** The accuracy fix
is right, but two 73-word paragraphs (forward reads, then tie order, then correlation 0.6,
then a per-entry charge) are a lot of mechanism inside a diagnosis section. One paragraph
can carry it: "The forced index scan read 1,426 pages, a sixth fewer than the scan's 1,725,
and read them in table order. The planner still priced it at more than twice the cost: it
judges order by the correlation of `status` with the table, only about 0.6 here, so it
expected many reads to land at random. Whether the forced plan is faster depends on your
storage…" The B-tree tie-ordering detail can go to the notes, or into one clause.

**One provenance sentence runs to 42 words.** "Three figure lines come from extra runs…"
is in the right section, but make it a three-item list.

**Smaller:**
- The two clustered sections open with near-identical definitions. "In a clustered
  table, the table itself is a B-tree ordered by the primary key" restates the h3's
  "The table is stored as a B-tree". The re-entry could start from what the reader now
  knows: "With the B-tree in hand, a clustered table is easy to picture: its rows sit on
  the leaf pages."
- "The same measurement on the 60,000-order table, measured in PostgreSQL 18" could read
  "taken in PostgreSQL 18".
- Figure 1's caption still says the invented table is "used in every figure", but
  Figures 9 and 10 don't use it.
- Lesson step 22, "Ask the index for an order", reads as "ask for an orders row" on a
  table of orders. Try "Let the index supply the sort order".

Net effect: the repairs added about 320 words of paragraph text. Reading time rose from 37
to 39 minutes, and sentences over 30 words rose from 3 to 10. Most of the growth is in the
accuracy material in Selectivity and "The condition matches too much", and the splits
above recover most of it. Averages are unchanged at 46 words a paragraph and 17 a
sentence.

### Heading tree

Read as a map, the tree now teaches in an order a future writer could copy:
- mechanism (scan, entries, B-tree, range, clustered search);
- the planner (selectivity);
- shapes of index (composite, covering, partial and expression);
- cost (writes, splits, key choice, bloat, upkeep);
- practice (EXPLAIN, designing);
- diagnosis (when the database ignores an index);
- a map of other types;
- provenance.

Every h2 is a field term, or a question a reader would search for. Two small things
remain, and neither blocks the verdict:
- The contents list shows only h2s, so joins (promised in the opening) are still
  invisible there.
- "Choosing the primary key of a clustered table" is a design decision filed under
  "Write cost and upkeep". The pointer from `#clustered` carries a reader to it, so this
  can stay.

### Example passages

All three survived intact:
- **Column order around Figure 7.** The setup is better than before.
- **The visibility map through Figure 8.** Unchanged. The new state labels ("Not
  vacuumed", "Vacuumed", "Then updated") match the prose's "change the state of the
  table".
- **The HOT update paragraphs.** Unchanged. The write-ahead-log definition now sits just
  before them, so the WAL measurement no longer interrupts the insert-to-update thread.

The new Figure 6 passage, from "Then switch the table order" through "Where the matching
rows sit matters as much as how many there are", is a fourth example of break, change one
thing, then name what changed. It can join the list once its two long paragraphs are
split.

### Updated verdict: ready after the listed repairs

The structural problems are fixed. The table, the heading tree, the order of sections and
the examples now support the voice instead of working against it. What remains is
sentence and paragraph work that the repairs themselves created:
- one explanation given three times;
- two paragraphs over 75 words in Selectivity;
- a diagnosis subsection that turned into a mechanism lesson.

These are the habits the reference is meant to teach writers to avoid, so they should go
before writers are pointed here. The edits are a paragraph deletion, three splits and one
merge, plus the optional small items. None changes a figure or the structure. After them,
I'd call it ready as a reference.
