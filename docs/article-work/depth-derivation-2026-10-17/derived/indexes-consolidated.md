# Indexes in relational databases: consolidated plan

Consolidated on 18 October 2026 from planners A and B, checked against external evidence.
Written before any existing article was opened.

**Result:** two articles, about 10,100 words, about 48 minutes of reading. A deep dive,
*How indexes work* (about 29 minutes), takes the reader to the everyday decisions. A
companion, *Choosing and maintaining indexes* (about 19 minutes), covers the awkward
cases, diagnosis and the life of an index set. Both planners reached two articles and
about 50 minutes on their own. The consolidation moves parts between layers more than it
changes the total.

## 1. The expert's abilities

The two lists agree. Merged, an expert practitioner can:

1. **Picture what an index physically is.** A B+tree of fixed-size pages, sorted and
   linked at the leaves, a fanout in the hundreds and three or four levels for most
   tables.
2. **Predict how an index serves a query.** For each condition they can say whether it
   bounds the range scanned, is checked inside the index, or is checked only after the
   row is fetched. They can also say whether the index supplies the requested order and
   whether the table must still be read.
3. **Tell "can't" from "chose not to".** They separate an index that cannot express a
   condition from a planner that judged a scan cheaper, and know which to fix.
4. **Account for where rows live.** A heap with physical row pointers (PostgreSQL, SQL
   Server heaps) behaves differently from a table stored inside its primary-key B-tree
   (InnoDB, SQL Server's default, SQLite). The expert predicts lookup cost, key width and
   update cost from that.
5. **Design a small index set for a workload.** That covers column order, covering
   columns, and partial and expression indexes. It also means indexing foreign keys,
   extending an index before adding another, and knowing when not to index at all.
6. **Weigh what an index costs.** That means write work per engine, where new keys land,
   space, memory and log volume.
7. **Verify and diagnose.** They read the index lines of a plan in each engine and
   compare rows read with rows returned. They recognise the classic failures: a type
   mismatch, a parameterised predicate, an ORDER BY with LIMIT that walks the wrong index.
8. **Run the index set over time.** They find unused and redundant indexes without being
   fooled by statistics windows, add and retire indexes safely, and treat rebuilds as
   something to measure rather than schedule.
9. **Know where a B-tree stops.** They recognise when a problem needs an inverted,
   spatial, block-range, vector or columnar structure, or another system.

**Evidence.** PostgreSQL 18's index chapter gives the exact rule behind ability 2. With
equality on the leading columns plus one inequality, those conditions "limit the portion
of the index that is scanned". Conditions on later columns "are checked in the index",
saving table visits without narrowing the scan. MySQL's index condition pushdown and SQL
Server's residual predicates are the same idea. Winand's *Use The Index, Luke* covers
abilities 2, 3 and 5 across engines. His 2014 quiz, with about 28,000 attempts, found 60%
of developers failed it, and the questions are predictions of exactly this kind. GitLab's
index guide shows the working standard for abilities 5 to 8. Every index has to be
justified with `EXPLAIN ANALYZE` and weighed against write cost, with a cap of 15 indexes
per table. Zero scans count as a signal, not proof, and an index must be watched for six
months before it is dropped. Microsoft's index design guide and the InnoDB clustered-index
page cover ability 4. Microsoft's maintenance guidance covers ability 8: rebuilds often
get credit for a statistics refresh. Bug reports and pganalyze's write-up on ORDER BY with
LIMIT document the failure in ability 7.

## 2. Coverage map

D is the deep dive *How indexes work*. C is the companion *Choosing and maintaining
indexes*. Layers follow `consolidate.md`. "Ref" marks material readers look up rather
than read through.

| # | Part | Layer | Home | Needs | Words |
|---|---|---|---|---|---|
| 0 | The model: a sorted copy with a way back to each row; what it serves; what it costs; the planner decides | 1 | Collection intro (a paragraph), D opening | Prose | 150 |
| 1 | What an index is and the full scan it replaces | 1→2 | D §1 | Figure: a table beside its index | 300 |
| 2 | The B-tree: pages, separator keys, linked leaves, fanout, depth by table size | 2 | D §2 | Mechanism, figure, worked depth numbers | 450 |
| 3 | What sorted order makes cheap: equality, range, prefix match, `IN` lists as repeated descents, `ORDER BY` with `LIMIT`, `MIN`/`MAX` | 2 | D §3 | Five short queries | 350 |
| 4 | Composite indexes: leftmost prefix; the three fates of a condition (bounds the scan, checked in the index, checked at the row); equality before range; order by use, with selectivity only as a tie-break; order and mixed directions | 2 | D §4 | Interactive figure (pick a `WHERE`, see the leaf band), prediction table | 750 |
| 5 | Skip scan softens the leftmost-prefix rule: PostgreSQL 18; MySQL 8.0.13+ (single table, covering); SQLite only after `ANALYZE`; none documented in SQL Server | 3 | D §4, last paragraph | Paragraph; engine row in the Ref table | 150 |
| 6 | Conditions the index can't see: function or arithmetic on the column, date truncation (rewrite as a half-open range), implicit type conversion, collation mismatch, leading wildcard, negation | 2 | D §5 | Before-and-after rewrite table | 450 |
| 7 | `OR` across columns and separate single-column indexes: bitmap AND/OR, MySQL index merge, SQLite OR-union; the order is lost; a composite usually wins | 2 | D §5 | Paragraph, one plan | 200 |
| 8 | From index entry to row: heap and physical pointer against a table stored in its primary-key B-tree. A secondary lookup becomes a second descent; the key is copied into every secondary index; primary-key range scans are cheap | 2 | D §6 | Mechanism, figure (two lookup paths), engine table | 600 |
| 9 | When a scan beats the index: a page visit per matched row; the crossover moves with physical correlation and caching, so no fixed percentage; bitmap scans batch the fetches; the planner decides from estimates | 2 | D §7 | Mechanism, measured chart (two correlations) | 450 |
| 10 | Reading only the index: covering; `INCLUDE` (PostgreSQL, SQL Server) against trailing key columns (MySQL, SQLite); InnoDB's primary key comes free | 2 | D §8 | Paragraphs, plan excerpt | 350 |
| 11 | Visibility caveat: PostgreSQL may still visit the heap (visibility map); InnoDB may still visit the clustered row (page transaction id) | 3 | D §8, a sentence each | Sentences, link | 60 |
| 12 | Narrower indexes: unique (constraints are indexes), partial/filtered and the matching rule (the query must imply the predicate when the plan is made), descending, MySQL prefix indexes, key-size limits | 2 | D §9 | Definitions with one example each | 400 |
| 13 | Variant and skip-scan support by engine | Ref | D, end of §9 | Table | 150 |
| 14 | Designing an index for one query: equality columns, then one range or sort column, then payload; extend before adding; index the referencing columns of a foreign key (InnoDB creates it, the others don't) | 2 | D §10 | Short recipe, one worked query | 350 |
| 15 | What each index costs: inserts and deletes touch every index. On update, InnoDB and clustered SQL Server touch only indexes whose columns changed; PostgreSQL touches every index unless the update is HOT (a sentence and a link). Space, memory, log and replication volume | 2 | D §11 | Figure (one UPDATE in PostgreSQL and InnoDB), measured insert rate against index count | 500 |
| 16 | Where new keys land: ascending keys fill the right edge (a hot page under extreme concurrency); random keys split pages, lower density and widen the working set; UUIDv7 | 2 | D §11 | Figure | 250 |
| 17 | Bulk loads: build indexes after loading, not during | 3 | D §11 | Two sentences | 60 |
| 18 | Where a B-tree stops: substring and full text, containment, geometry, nearest neighbour, analytic scans | 2 | D §12 | A sentence each with links | 200 |
| 19 | Plan vocabulary: PostgreSQL scan types, MySQL `type`/`key`/`Extra`, SQL Server seek/scan/key lookup, SQLite `SEARCH`/`SCAN`/`COVERING INDEX` | Ref | C §1 | Table | 250 |
| 20 | Working from the workload: list a table's queries, make one index serve several, compare rows read with rows returned, use realistic data; when not to index (small tables, reports over most of a table) | 3 | C §1 | Short method | 350 |
| 21 | Eight worked examples (below) | 3 | C §2 | Query, index, plan before and after, why, engine notes | 1,750 |
| 22 | "Why isn't my index used?": can it (shape), would it (estimates, stale statistics), did it (plan); hints as a last resort (MySQL, SQL Server, SQLite `INDEXED BY`; none in core PostgreSQL) | 3 | C §3 | Ordered checklist pointing into D | 300 |
| 23 | How many indexes: prefix-redundant indexes and their exceptions (unique, backing an InnoDB foreign key, much narrower on a hot path), consolidation, size against memory | 3 | C §4 | Paragraphs, one example | 300 |
| 24 | Auditing: usage views per engine; caveats (resets, per-replica counts, rare jobs, constraint-backing indexes); missing-index suggestions as input, not prescription | 3 | C §5 | Per-engine queries, caveat list | 450 |
| 25 | Shipping and retiring: index before the code that needs it, drop after the code that stopped needing it; trial drops with MySQL invisible indexes or SQL Server disable (undone only by a rebuild); PostgreSQL has no built-in equivalent | 3 (engine detail 4) | C §6 | Paragraph, examples | 300 |
| 26 | Maintenance folklore: fragmentation against page density; rebuild "wins" from the statistics refresh; measure, don't schedule; density after mass deletes | 3 | C §7 | Paragraphs | 300 |
| — | Planner estimates and statistics; join algorithms | — | How a query runs | A sentence and link where used | — |
| — | Keyset pagination | — | Pagination and large results | Link from part 3 | — |
| — | Online index builds and their failure modes | — | Changing a schema while the application runs | Sentence in part 25 | — |
| — | Finding the expensive queries | — | Understanding database performance | Link from part 20 | — |
| — | Pages and the write path to durable storage | — | Storage and durability | Sentence of reminder in parts 2 and 15 | — |
| — | Caching index pages | — | The buffer pool | Link from parts 15 and 16 | — |
| — | InnoDB locks follow scanned index ranges | — | Transactions article, if one exists | Two sentences in example (b) | — |
| — | Visibility map, HOT and fillfactor, operator classes (`text_pattern_ops`), deduplication, `REINDEX CONCURRENTLY`, bloat, collation-version changes that corrupt indexes, GIN/GiST/BRIN/hash | 4 | Indexes in PostgreSQL | Links | — |

**The eight worked examples in C §2,** about 220 words each:

- **(a) A tenant's newest items.** An index on `(tenant_id, created_at DESC)` serves the
  filter, the order and the `LIMIT` without a sort, and the tenant column leads every
  index and unique key. Then the trap: with only an index on `created_at`, the planner can
  walk it in order and filter, which is fast for a common tenant and very slow for a rare
  one.
- **(b) Foreign keys.** A parent delete or key update scans the child table if the
  referencing column has no index. InnoDB creates that index; PostgreSQL, SQL Server and
  SQLite don't. In InnoDB a scan without a suitable index locks every row it reads.
- **(c) A work queue or status flag.** Use a partial index on the rare state, and a
  composite led by status in MySQL. A parameterised `status = ?` defeats a partial index
  in a generic plan (PostgreSQL) or any cached plan (SQL Server). Boolean and
  low-cardinality columns rarely need an index of their own.
- **(d) Unique among live rows under soft delete.** A partial unique index in PostgreSQL
  and SQLite, a filtered unique index in SQL Server, and in MySQL a unique index on a
  generated column that is NULL for deleted rows.
- **(e) Case-insensitive lookup.** An expression index on `lower(email)`, which the query
  must match exactly; MySQL's and SQL Server's usual collations compare without case
  already; refresh statistics after creating an expression index.
- **(f) A parameter type mismatch from application code.** An `nvarchar` parameter
  against a `varchar` column in SQL Server, or a string compared with a number in MySQL,
  turns a seek into a scan, and the plan shows the conversion.
- **(g) Covering a hot read.** `INCLUDE` against extra key columns, and when widening an
  index costs more than the heap visits it saves.
- **(h) A search screen with optional filters.** `(:p IS NULL OR col = :p)` defeats good
  plans. Build the SQL for each set of filters, serve the common combinations with
  composites, let the engine combine indexes for the rest, and know when a search system
  should take over.

## 3. Articles

**D. How indexes work** (deep dive). It runs from the structure through what an index can
serve, where rows live and when a scan wins, to variants, the one-query design recipe and
what an index costs. PostgreSQL is the worked example, with engine notes wherever a
prediction changes. It has about 5,900 words of prose plus a 150-word reference table,
five figures (one interactive) and two measured charts. Text takes about 24 minutes and
figures about 5, for **about 29 minutes**. A reader who stops here can predict index use,
reason about cost in each engine and make the everyday call.

**C. Choosing and maintaining indexes** (companion). It covers the workload method,
eight worked examples, diagnosis, how many indexes to keep, auditing, shipping and
retiring, and maintenance. It has about 3,850 words plus a 250-word plan-vocabulary
table. Text takes about 15 minutes and SQL and plan excerpts about 4, for **about 19
minutes**. Readers often arrive directly, asking "why isn't my index used?" or "can I
drop this one?".

**Why two, and why the split falls here.** One 10,000-word page would bury the mechanism
under a catalogue that readers consult case by case. A third page for auditing and
maintenance would be about 1,350 words, and its readers need the same judgement as
design: does the index set match the workload. Both planners homed the per-query design
recipe in the companion. It moves to D because it is an everyday decision, and a reader
who stops after layer 2 must be able to make it.

**Measurements worth making** (PostgreSQL 18 and MySQL 8.4): the scan-against-index
crossover at high and low correlation, and insert throughput against index count. Both
calibrate claims that otherwise rest on folklore, such as "an index helps under 5%". Plans
in every C example should come from real runs.

## 4. Boundaries

- **Storage and durability (the cross-subject call).** *Indexes* owns table organisation:
  heap against a table stored in its primary-key B-tree. It also owns the per-index cost
  of a write: how many structures a write changes, and where in them. Nearly every
  prediction table organisation drives is an index-access prediction: the second descent,
  primary-key width in every secondary index, covering, update cost. A primary-key-organised
  table is itself a B-tree, so it can only be explained once the B-tree has been. MySQL
  and SQL Server document it as index architecture. *Storage and durability* needs only
  one or two sentences: tables are stored either as a heap or inside their primary-key
  index, with a link here. It keeps what a write costs to make durable (log, flush,
  checkpoint), and *Indexes* reminds its reader of that in a sentence. Each index's page
  changes travel the same logged path as the table's.
- **How a query runs** owns cost estimation, statistics, plan reading in general and join
  algorithms. D says why selectivity matters; that article says how it is estimated.
- **Indexes in PostgreSQL** owns everything in the layer-4 row of the map. Those details
  change only a PostgreSQL user's decisions.
- **Pagination**, **Changing a schema**, **Understanding database performance** and **The
  buffer pool** each own their row of the map.
- **Constraints, transactions and key-type choice** belong to neighbours the brief doesn't
  list. If they don't exist, example (d) carries the uniqueness detail and example (b)
  the locking sentences, and part 16 says enough about key choice to decide.
- **JSON, full-text, vector, partitioning and reporting articles** own their specialised
  indexes. Part 18 names each one and the question it answers.

## 5. Left out

- **B-tree algorithms**: split and merge procedures, latch coupling, right-links, suffix
  truncation. Practitioners need the consequences (depth, density, splits), which parts 2
  and 16 give.
- **LSM engines** such as MyRocks. None of the four engines uses one by default.
- **Oracle and Db2 behaviour.** These are outside the collection's engines.
- **InnoDB's change buffer** (off by default since 8.4) and **adaptive hash index**
  (internal).
- **Index compression, fill-factor tuning, SQL Server memory-optimised and XML indexes,
  indexed views.** These are niche, and Microsoft advises the default fill factor except
  for split-heavy random keys, which part 16 notes in a sentence.
- **Hypothetical-index and adviser tools.** The tools change; the judgement they need is
  parts 14 and 20.

## 6. Uncertainty

1. **The Storage boundary** depends on the collection's reading order. If *Storage and
   durability* comes first and its own predictions need the primary-key-organised table,
   it could own a 200-word description. *Indexes* would then keep the lookup and
   write consequences. That article's draft would settle it.
2. **D's length.** At about 29 minutes, D sits at the edge of one sitting. Parts 4 and 8
   carry the weight. If the interactive figure does its work, part 4's prose can shrink.
   A draft review that times a prediction quiz would show it.
3. **Eight examples.** These cover the patterns that recur in GitLab's and Microsoft's
   guidance and in Winand's quiz. Examples (f) and (g) are the most likely to shrink to
   a paragraph.
4. **Versions.** PostgreSQL 19 reached release candidate on 15 October 2026, and the
   MySQL manual now lists 9.x releases beside 8.4 LTS. Fix the baseline before drafting.
5. **SQL Server skip scan.** It is undocumented, and both planners treated it as absent.
6. **The crossover chart** may vary so much with storage and caching that it should show
   a band, not a line. The experiment decides.

## Where the planners disagreed and how it was settled

- **The per-query design recipe.** Both planners put it in the companion. It moves to D
  §10, because the layer model requires a reader who stops after the deep dive to make
  the everyday decision.
- **Plan reading.** A wanted 550 words in the companion with one plan per engine. B
  wanted a 250-word vocabulary table in the deep dive. Settled: PostgreSQL plan lines
  appear in D as each access path is taught, and the cross-engine vocabulary is a
  reference table in C, where the examples show plans. *How a query runs* owns plan reading in
  general.
- **Variants.** A gave them a 550-word section with a support table; B spread them across
  examples. Settled: definitions and the matching rule go in D, because a reader who
  stops there must know partial and expression indexes exist and when the planner can use
  them. Use cases go in C's examples and support goes in a reference table. PostgreSQL's
  partial-index page sets the matching rule: it applies at planning time, so
  parameterised clauses don't match, and a pile of per-category partial indexes is worse
  than one composite.
- **Write-cost depth.** A wanted 650 words and a figure; B wanted 400 words with HOT
  linked out. Settled at about 500 with A's figure. The PostgreSQL-against-InnoDB update
  contrast changes predictions across engines. HOT's eligibility (no indexed column
  changed, except BRIN; room on the page) is PostgreSQL-only and gets a sentence.
- **Measurements.** B proposed three; A none. Two stay, as above. B's UUID insert
  measurement belongs with the key-type decision, if anywhere.
- **Column order.** B flagged a conflict: SQL Server's guide orders later columns "from
  the most distinct to the least distinct", while Winand calls that a myth. Settled: order by how
  queries use the index, equality before range, with distinctness as a tie-break. With
  equality on every column the leaf band is the same whatever the order, as PostgreSQL's
  exact rule implies. Winand traces the SQL Server advice to its histogram on the first
  column only.
- **Hints and advisers.** A wanted 250 words; B left them out. Settled at two sentences on
  hints in C §3, and missing-index suggestions in the audit section, because SQL Server
  and cloud consoles put them in front of readers.
- **Examples.** A's ten and B's eleven merge into eight. Text matching folds into D §5,
  and multi-tenant into example (a). Low cardinality joins (c), the report query becomes
  a sentence in C §1, and pruning overlap moves to C §4.
- **What both missed.** First, the middle fate of a condition, checked in the index
  without narrowing it. PostgreSQL documents it, and it predicts table visits. Second,
  the ORDER BY with LIMIT trap, documented in PostgreSQL bug reports and by pganalyze.
  Third, building indexes after a bulk load, from PostgreSQL's "Populating a Database".
  Finally, `IN` lists as repeated descents, and the warning against many partial indexes.

## What layer 1 must say

An index is a second, sorted copy of some of a table's columns, kept in a B-tree with a
way back to each row. Because it is sorted, the database can find one value or a range
by reading a few pages instead of the whole table, and can hand back rows already in
order. It helps only when the query's conditions and ordering line up with the index's
sort order from its first column, and when few enough rows match that fetching them one
by one beats reading the table. The planner makes that call from its estimates. Every
index is paid for: inserts and deletes change every index, updates change some or all of
them depending on the engine, and each one takes space and memory. The work is choosing
a small set of indexes that serves the queries that matter.

**Simplifications later layers refine:**

- "A way back to each row" is a physical location in a heap but the primary key in
  InnoDB, SQL Server's default and SQLite (part 8).
- "From its first column" softens under skip scan (part 5).
- "Index-only" reads can still touch the table (part 11).

None of these needs undoing, only refining. Layer 1 must not give a fixed percentage for
when a scan wins, or say every write touches every index.

## Sources

- PostgreSQL 18 docs: 11.3 multicolumn indexes (the exact range rule, skip scan); 11.8
  partial indexes (planning-time matching, parameterised clauses, the partition warning);
  65.7 heap-only tuples; 14.4 populating a database.
- MySQL 8.4 manual: range optimisation (skip scan conditions); foreign key constraints
  (index created on the referencing table); locks set by different statements ("every
  row of the table becomes locked" without a suitable index); change buffer (default
  `none`); invisible indexes (still maintained).
- SQLite: query optimizer overview (skip scan needs `ANALYZE` and about 18 duplicates; LIKE
  optimisation conditions; OR-by-union; covering indexes).
- Microsoft Learn: index architecture and design guide (column order, clustered by
  default, row locators); create filtered indexes; optimise index maintenance (statistics
  side effect, page density, no schedule).
- Winand, *Use The Index, Luke*: the "most selective first" myth; the 2014 quiz results.
- GitLab development docs, "Adding database indexes".
- pganalyze, "Postgres planner quirks: ORDER BY + LIMIT"; PostgreSQL bug reports #18423
  and #18834; posts on SQL Server filtered indexes and parameterisation (Tim Chapman, Hugo
  Kornelis).
