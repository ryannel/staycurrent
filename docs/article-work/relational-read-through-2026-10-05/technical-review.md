# Relational sequence: technical and teaching review

Reviewed 5 October 2026 at commit `985e5f71da2e346faf322bf48765a3124c740cbf`.
Audience: an application engineer who programs but is new to SQL and schema
design. This is an informed technical reading, not a simulated novice test or a
blind review. The review/style skills supplied article case histories before the
reading. I recorded the actual explanation before consulting the existing
article evidence; agreement with an older finding does not constitute another
uncued reader.

The main concepts and consequential PostgreSQL behaviours are sound. The
sequence gives a particularly useful account of result cardinality, protected
decisions, zero-row outcomes and recovery of an identified operation. Repair is
still warranted for the promised newcomer journey: early SQL examples need a
small syntax bridge, and the JSON article leaves one practical validation/query
choice unfinished. These are teaching gaps, not evidence that the whole
relational collection needs to become a SQL course.

## What was read

I read the actual pages in this order: introduction, modelling, constraints,
tables and JSON, query results, large results, transaction boundaries,
concurrent updates, isolation, conflicts and retries, then the supplemental
checkout essay. The `normalisation.astro` page is a redirect into modelling, not
another lesson. The dynamic route generates explicitly labelled planned
outlines; those do not count as completed teaching.

For each page I followed its prose, SQL constants, results, captions, instructions
and content-bearing imported components where they occur. This included the
introduction's five aids; all schema, normalisation, type, constraint and JSON
aids; both join-fanout states; pagination and export comparisons; all boundary,
concurrency, isolation and retry aids; and the supplemental checkout interaction
and its `rd-models.mjs` transitions. Shared sheet/arrow wrappers and result/code
renderers supply presentation rather than another explanation. The reading map
and further-reading components were checked against the collection metadata.

This was source inspection of the assembled content, including model logic. It
does not establish rendered legibility, keyboard behaviour, or live two-session
execution. I did not edit articles or skills, run the repository's existing
verification scripts, or treat a JavaScript teaching model as a database test.

## The outcomes the explanation supports

### Introduction

The reader can distinguish a table's logical organisation from the engine's
physical arrangement; connect an order to a customer and product by IDs; explain
why a query can combine those facts; and identify the separate jobs of indexes,
constraints, transactions and concurrency control.

The reasoning is supplied, not just named. The join returns “Blue mug, 2” from
one matching product and line. The index diagram needs totals from the table,
which makes the extra route useful. The missing-product example motivates the
foreign key, the incomplete order motivates a transaction, and the lock timeline
puts the second buyer's check after the first commit. Current price versus agreed
price is established before the deeper schema lesson.

The reader should not yet be able to select a production index, operate recovery,
or choose among SQL Server, MySQL and PostgreSQL. Those are correctly separate
jobs. The prose's final claim that the collection “gives these their own articles”
slightly overstates present availability, although the map immediately identifies
planned outlines. This is a navigation/copy precision issue, not a missing
mechanism in the introduction.

### Designing a relational schema

The reader can choose what one row means, identify candidate/composite keys,
reason from dependencies rather than repeated-looking values, explain the first
three normalisation steps, preserve purchase history, avoid unhelpful separation,
and choose basic representations, units and missing-value meanings.

The quantity and agreed price require the whole line key; customer and placement
time require only the order; current customer/product facts belong to the
referenced records. The drawings expose the columns that move, while explicitly
keeping omitted line prices and quantities on the lines. `RejoinRecords` makes
the otherwise demanding lossless-decomposition claim concrete: retaining only
O13 invents four product/price combinations instead of the original two. This
example is difficult in a productive way, and the aid provides the missing
pairs rather than merely drawing more tables.

The types section now supports choices beyond recognising type names: numeric
versus text ordering, leading zeroes, exact versus approximate amounts,
precision/scale, boolean versus several named states, instant versus local time,
and unit/currency conventions. The formal overlapping-key 3NF detail can
reasonably remain optional.

I supplied SQL expertise at the closing receipt query: table aliases, qualified
column references and a named expression have not all been taught at this point.
The preceding ID/result examples still make the schema argument intelligible,
so this is a small local explanation need, not a failed normalisation lesson.

### Constraints

The reader can select presence, value, identity and reference rules; predict
accepted/rejected writes; choose the scope of a composite key; distinguish an
optional unique SKU from a primary key; follow deletion actions; and explain why
an application pre-check cannot replace database uniqueness.

The prose distinguishes CHECK's unknown result from a positive quantity, and
the interaction separates expression truth, CHECK acceptance and NOT NULL. The
deletion figure shows that deleting an order cascades to its lines, while deleting
a purchased product is refused. The unique-write timeline distinguishes seeing
no SKU from reserving that SKU. The closing incomplete-order/stock examples
explain which wider operations those local rules cannot establish.

I nevertheless supplied a prerequisite to interpret several writes: the
left-to-right mapping from positional VALUES to the table's declared column
order. The results table explains the outcomes, but cannot show a reader how to
read or change the example. The article also names a multi-field check without
working one through. That second point is an optional extension; the direct
quantity/reference rules already fulfil most of its bounded job.

### Tables and JSON

The reader can distinguish JSON nesting from rows, choose between a column,
related details row and product document, interpret missing keys/JSON null/SQL
NULL, and recognise access, validation, migration and write-boundary costs.

The reconciliation with normalisation is explicit: copied supplier addresses
remain repeated shared facts, whereas one product's descriptive bundle need not
be duplicated. Supplier offers have identities, references and independent
changes that justify rows. `ProductAttributesMap` makes those row boundaries
visible. The null/type result table and probe establish exactly which distinctions
text extraction discards. The migration section correctly returns to authority
when old/new field copies coexist.

Two choices require expertise to finish. The number-type CHECK permits a capacity
that the shown integer query and expression index reject; the article accurately
warns of this, then leaves the reader to design a compatible path. The safer
`jsonb_set` recommendation also requires the reader to supply why row locks do
not prevent an old full object from overwriting a previous writer's edit. These
are detailed in the repair candidates below.

### Queries and joins

The reader can write/read a basic SELECT, name the grain of a result, predict
inner/left join cardinality, interpret missing matches, choose ON versus WHERE
filters, group at the right level, distinguish row count from present-value count,
avoid totals multiplied by joined collections, and use existence when only a
yes/no qualification is required.

This article consistently works from inputs to an answer. The foreign-key and
primary-key guarantees explain one result per purchase line. Ben's missing order
is distinguished from a real empty header. Cara's early order makes the ON/WHERE
distinction more demanding and more useful: filtering the matched row does not
manufacture a replacement null row. O14 exposes COUNT(*) versus COUNT(line_no),
and the fanout aid exposes every €20/€24 pairing before aggregation conceals it.
The separately grouped repair then displays its intermediate tables and final
€44/two-shipment answer.

The SQL is advanced by the end, but clause/alias/EXISTS/WITH explanations and
worked results supply the reasoning. I found no consequential hidden SQL step
in the core argument after the basic SELECT introduction. Fully general SQL,
execution plans and join algorithms are outside this article's promise.

### Pagination and large results

The reader can choose a total ordering, calculate the effect of changing offset
positions, form a continuation boundary including ties, understand a token's
filter/order contract, distinguish a live traversal from a fixed export, and
recognise that a progress checkpoint must agree with a job's effects.

The need for a sequence precedes ORDER BY. O14 shares the boundary timestamp,
so the full pair earns its place; the time-only comparison visibly misses it.
The experiment connects insertions, deletions and moved ordering values to the
second page. The article then separates a saved range of keys from a snapshot,
and an API token from a database cursor. The oldest-first switch in the export
example is explicitly announced. It also says that LIMIT limits transfer rather
than all engine work, and warns that paging line results does not page orders.

The two-step “select order identities, then retrieve lines” recommendation is
understandable from the grain lesson, but leaves an optional worked query to the
reader. Likewise, a real cursor driver/pool API is not taught. Neither omission
prevents reaching the bounded ordering/continuation/export decisions here.

### What belongs in one transaction?

The reader can derive a transaction boundary from the completed state, distinguish
autocommit from explicit grouping, interpret the reservation outcome before
inserting a purchase, undo a failed attempt, keep a pooled sequence on one
connection, and identify the outside-service boundary.

The wrong partial states are explained before the mechanism. Returned rows create
an explicit decision point, including the successful command that changed no
rows. The failure example and after-state table explain what rollback removes;
savepoints are not presented as permission to omit required work. The pending
payment workflow gives the intermediate state a meaning and says repeated
cancellation must not release stock twice. The row-lock definition now explains
the cost of waiting for payment locally.

The wider payment workflow is honestly beyond the runnable schema. Its recovery
details may remain onward reading; implementing a complete provider workflow is
not this article's promised outcome. The column/value SQL mapping is well taught
here, but arrives after the design articles needed it.

### When two requests change the same data

The reader can construct the stale-read race, explain why sequential writes alone
do not protect a decision, use a one-row guarded update, interpret affected rows,
choose a locking read for an application decision, and recognise a rule that
extends beyond one row.

The unsafe schedule preserves both early reads, the pending lock and the stale
literal write after waiting. The conditional example makes the updated-row WHERE
recheck explicit at Read Committed. Both commit and rollback outcomes are worked
through. Partial fulfilment supplies a real reason to inspect a protected count
in application code; the ordinary one-mug SQL remains a fair timing comparison,
not a claim that locking is inherently necessary for partial fulfilment.

The bin sequence makes the boundary of the one-row solution visible. I did not
have to invent another concurrency mechanism to follow it. A multi-product cart
adds lock ordering and retries as new concerns, with available onward reading.

### Isolation and snapshots

The reader can predict ordinary Read Committed/Repeatable Read price reads,
distinguish a view from an exported copy or a reservation, include own writes,
understand a changed-row failure, demonstrate write skew across different rows,
and reason why Serializable or a suitable shared lock can preserve the display
rule.

The report experiment keeps committed catalogue state separate from returned
report values. The transaction-view timing is located at the first query, not
BEGIN. The write-skew figure contrasts the overlapping result with both serial
orders. Retrying the complete guarded decision produces a valid no-change answer,
rather than forcing the original wish through. The alternative control-row
sequence explicitly makes the subsequent Read Committed statement supply the
fresh flag view; locking an unchanged record does not refresh Repeatable Read.

These are correctness arguments within the stated engine and schedules. A
taxonomy of every isolation anomaly or another engine's similarly named level
is useful future depth, not a prerequisite this article fails to supply.

### Handling waits, deadlocks, and retries

The reader can separate an active wait, a known rejected attempt and an unknown
commit; retry the whole decision for known retryable errors; preserve one intent
across retries/restarts; and recover through uniqueness without reserving twice.

Deadlock dependencies are visible before consistent ordering is proposed. The
retry pseudocode uses SQLSTATE, cleanup, bounded attempts and delay outside the
transaction. The lost-reply aid preserves both possible histories. K14 remains
distinct from proposed O14/O15 IDs, and the claim/reserve/line/lookup fragments
are finally joined by explicit branching pseudocode. The recovery sequence
explains why an empty early lookup is insufficient and why a later Read
Committed lookup follows the waiting unique claim.

Request matching, authenticated ownership, retention, available authoritative
state and external effects are all identified as necessary boundaries. I found
no missing step in the local one-product recovery argument that would justify
expanding it into an entire outbox/payment implementation. A real driver exercise
would be useful practice, but it is an additional artifact, not missing conceptual
support for the stated outcome.

### Supplemental checkout

The reader can revisit the last-item rule while seeing index pages, row versions
and logging in one small narrative. The interaction allows event orders rather
than only selecting a finished schedule; its guarded policy uses current stock
after waiting, while its unsafe policy uses the saved read. Its scope notes say
exactly which behaviours are modelled.

There is a sequence reconciliation burden: `mug_42` replaces P7, Alice/Bob replace
Ada/A/B, stock moves into products, and each one-product order directly names a
product instead of using an order line. The last section then adds several
products without naming the required order-line representation. None of that
makes the one-product scenario factually wrong, but after the main series the
reader has to infer that it is a simplified independent schema. One sentence
announcing that simplification and one reminder when the cart grows would make
its relationship to the main sequence much clearer.

## Questions preserved at the point of use

| First trigger | Understanding available then | Later resolution or remaining consequence |
| --- | --- | --- |
| Modelling's closing receipt query, lines 164–169 | IDs reconnect line/product facts and the agreed amount must stay €36. | Alias/qualified-column/AS syntax is explained in Query results, lines 128–139. The model lesson works; the practical query needs a short local reading guide. |
| Constraints' positional line writes, lines 60–66 and rendered around 135 | The pair identifies a line, P99 is invalid, and quantity must be present/positive. | Which literal fills which column has to be supplied from the hidden schema's order. Named-list mapping is only explicitly taught in Large results line 82 and Transaction boundaries line 86. |
| JSON conditional checks, line 98 | A positive capacity does not require every mug to have one. | No worked required-by-kind rule arrives. This is optional practice, since the article is choosing boundaries rather than promising a complete subtype schema. |
| JSON capacity check, lines 149–150 | JSON number is a narrower rule than arbitrary contents, and 350.5 still fails the query's integer cast. | The reader is told to add validation or choose a typed field; the final hybrid design still relies on conventions. A complete compatible example is missing. |
| JSON update explanation, line 163 | All edits target the product row and lock it; jsonb_set retains other entries. | The stale-full-object sequence is not shown here. Concurrent updates later supplies the general old-decision race, but the reader must transfer it back to whole-object replacement. |
| Query results' four shipment/line pairs | The amount can repeat because the join asks for combinations. | The grouped intermediate results fully resolve the issue. No repair needed. |
| Pagination's export switches direction and customer coverage | Live list used newest-first C4 orders. | The new oldest-first/all-customer query is explicitly introduced, then its fetches are worked. No gap. |
| Isolation's stable view with writes | A report can keep the old price without blocking the writer. | Own-write visibility and changed-row failures arrive as the argument moves to writers, before write-skew decisions. Appropriate pacing. |
| Recovery's no-returned-row claim | A new unique operation identity controls who may reserve. | A later section explains the in-progress invisible winner and subsequent fresh SELECT. The identity trace first shows the completed duplicate; the recovery trace completes the overlap case. |

## Prioritised repair candidates

No P1 factual or concurrency-guarantee error was found. The following priorities
reflect the intended newcomer journey, not a count of objectionable passages.

1. **P2 — Make early SQL examples interpretable where the reader needs them.**
   In `constraints.astro`, use named columns for the fixture, line and SKU writes,
   and briefly connect their names to VALUES before asking the reader to compare
   outcomes. Explain that CREATE TABLE declares a table and that each declaration
   couples a column name, type and rules; this does not require teaching every
   clause. In modelling's receipt, identify l/p as temporary table names and
   `AS line_total` as the output label. The existing later explanations show that
   these are small repairs. Correct SQL execution and an accurate outcomes table
   do not establish that a beginner can interpret the command they are given.

2. **P2 — Finish one compatible capacity path.**
   `tables-and-documents.astro:149–150` is a correct warning with an unfinished
   design consequence. A writer can obey the shown CHECK and store 350.5, after
   which the article's query fails; maintaining its integer expression index also
   fails for that write. Either finish a JSON validation/query contract, or make
   a concrete choice to use the already introduced typed mug-details field and
   work the ceramic/capacity query through that representation. If fractions are
   valid, changing to a numeric query/index should be an explicit meaning choice.
   Include representative absent, null, invalid, fractional and valid values for
   the selected contract, with outcomes. Do not rely on AND predicates being
   evaluated in written order to guard unsafe casts. This is a missing worked
   choice, not a false claim that the existing weak CHECK protects the query.

3. **P2 — Show how a stale object loses an unrelated edit despite row locking.**
   Near `tables-and-documents.astro:163`, two short lanes would reduce the causal
   work. Both requests read capacity 350/material ceramic. A replaces capacity
   with 375 and commits. B's old complete object changes material to porcelain
   while sending capacity 350 back; its subsequent write is serialised but
   reinstates 350. Contrast that with a SET expression applying jsonb_set to the
   stored attributes. Name Read Committed for the overlapping-expression case,
   or use a fully sequential post-commit update for the simpler contrast. The
   existing JSON write-boundary aid concerns contention on two supplier offers;
   it does not demonstrate this lost-edit cause. A small code/result sequence
   would also work; an interactive simulator is unnecessary.

4. **P3 — Reconcile the supplemental checkout's simpler schema.**
   In `checkout.astro` around the first records, say that this standalone example
   has one product per order and keeps stock on the product; the main sequence
   separates stock and order lines. When the last paragraph introduces a cart,
   connect it to one order header and several lines. This avoids treating the
   two representations as unexplained exceptions to the design lesson.

5. **P3 — Offer one optional combined-rule exercise if the design articles are
   meant to be immediately practised.** A delivery state/date or product-kind/
   capacity rule could show a valid pair, a missing required value and an
   incompatible pair. The required reasoning is combining presence with a
   condition under SQL's unknown truth value. This would make the existing
   sentence about conditional checks useful to a newcomer. It is less urgent
   than the incomplete JSON capacity path and should not turn into a survey of
   subtype enforcement, triggers or every state machine.

Other potentially useful support is genuinely optional: a worked two-query page
of order headers plus all their lines, or a small real-driver checkout using the
already supplied pseudocode. The current figures already relieve the difficult
pair-counting, page-boundary and concurrent-event memory burdens. Adding another
relationship map or a generic “SQL pipeline” would not address the identified
gaps.

## Evidence checked for consequential engine claims

Primary references were accessed on 5 October 2026; versioned PostgreSQL 18
documentation was used. These checks confirm stated behaviour, not workload
performance or observed multi-session execution.

| Claim checked | Evidence and judgement |
| --- | --- |
| Default ordinary-read view, updated-row recheck, Repeatable Read changed-row failure, write-skew/Serializable distinction, fresh read after conflict claim | [PostgreSQL 18 transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html), §§13.2.1–13.2.3. The articles make the necessary ordinary/locking-read distinction. The control-row conclusion is an inference combining fresh-statement visibility with row locking; its subsequent statement is essential and is supplied. |
| CHECK true/unknown acceptance, required values, optional unique nulls, deletion rules | [PostgreSQL 18 constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), §§5.5.1–5.5.5. The example rules and rejected writes agree. RESTRICT cannot defer its deletion check; NO ACTION can when configured. |
| NaN and decimal scale | [PostgreSQL 18 numeric types](https://www.postgresql.org/docs/18/datatype-numeric.html), §8.1.2. NaN exceeds ordinary numbers under PostgreSQL comparison, justifying its explicit exclusion. Declared scale rounds; constrained precision excludes infinity. These are accurate implementation qualifications, not unnecessary corrections. |
| Instant storage/session display | [PostgreSQL 18 date/time types](https://www.postgresql.org/docs/18/datatype-datetime.html), §8.5.1.3. UTC conversion and loss of original offset/zone are accurately described; local future appointments need an additional zone convention. |
| JSON representation, GIN support and row-lock boundary | [PostgreSQL 18 JSON types](https://www.postgresql.org/docs/18/datatype-json.html), §§8.14.1–8.14.4. The outer object does not establish an internal field contract; GIN containment is distinct from numeric range ordering. Whole-row update coordination is correctly scoped to PostgreSQL. |
| Extraction, missing values and jsonb_set | [PostgreSQL 18 JSON functions](https://www.postgresql.org/docs/18/functions-json.html), Tables 9.47–9.51. The operators/results agree. jsonb_set returns a changed value rather than creating a separately stored record; the shown single-level path avoids missing intermediate-path complications. |
| Positional INSERT mapping and operation-key claim | [PostgreSQL 18 INSERT](https://www.postgresql.org/docs/18/sql-insert.html), Description and ON CONFLICT. The code is correct; the missing column mapping is a teaching issue. The operation conflict target and RETURNING branch are appropriate. |
| Wait on unfinished duplicate | [PostgreSQL 18 uniqueness checks](https://www.postgresql.org/docs/18/index-unique-checks.html), §63.5. Commit/rollback outcome checks support the described claim wait; the later separate SELECT supplies a fresh view. |
| Whole retry and cancellation uncertainty | [Serialization failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html) and [query cancellation](https://www.postgresql.org/docs/18/libpq-cancel.html). Repeating decisions and writes is required for the failed attempt; cancellation dispatch does not prove execution stopped. The bounded pseudocode supplies the appropriate distinctions. |
| Sorted stock locks | [PostgreSQL 18 SELECT](https://www.postgresql.org/docs/18/sql-select.html), locking-clause caution. Sorting occurs before lock acquisition, supporting the two stable product-ID example. Updated sort keys can produce out-of-order returned rows at Read Committed; this does not invalidate the stated schedule with stable IDs. A local “stable product IDs” phrase would sharpen the assumption if this becomes a general recipe. |
| Normalisation and lossless split | [Berkeley CS186 database design](https://cs186berkeley.net/notes/note13/) and [RPI normalisation](https://www.cs.rpi.edu/~sibel/csci4380/fall2026/lecture_notes/lecture5.html). The dependency/key reasoning and selected 3NF cases agree. The article preserves the formal prime-attribute exception rather than claiming every non-key determinant is forbidden. |
| Supplemental engine comparisons | [MySQL 8.4 clustered/secondary indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html) and [SQLite isolation](https://www.sqlite.org/isolation.html). InnoDB's normally primary-key clustered rows and SQLite's one-writer/WAL-reader distinction are accurate contrasts within the family. |

After the first reading I consulted `designing-data/evidence.md`,
`designing-data/article-sql-results.json`, `querying-transactions/isolation-evidence.md`
and `querying-transactions/retry-evidence.md`. They preserve the executed
single-session scope. The recorded fractional JSON probe accepts 350.5 under the
type check, then reports `22P02` for the integer query and indexed write. That is
existing execution evidence, not a fresh test I performed. It corroborates the
article's warning and the unfinished compatible-design finding. The overlapping
schedules remain supported by official rules rather than an executed server
trace. No new build is needed to establish this documentation-only review.

## What the read-through skill should learn

The useful unit of review is a consequential decision and the reasoning that
allows this audience to reach it. “Types appear”, “code runs”, “the warning is
accurate” and “the aid looks appropriate” are weaker claims. In this run, types
became useful through comparison/rounding examples; a valid INSERT still required
unintroduced interpretation; and a correct capacity warning still stopped before
a usable choice.

Follow prerequisites across page boundaries at their first use. Keep a question
when a later page answers it, then distinguish good pacing from an answer that
arrives after the reader needed to interpret a command. Reading in order does
not justify borrowing SQL lessons from a later page. Conversely, do not demand
another local explanation when an earlier lesson supplies the reasoning and the
present page actually connects to it.

Record the exact work expertise contributes: positional field mapping,
target-row expression evaluation after waiting, or reconciling a simplified
schema. Do not claim that an expert agent forgot this knowledge or that a blind
assignment makes it a novice. An informed reader can identify a hidden step
without providing fresh-reader evidence.

Test the closure of worked examples against their own accepted inputs. If a
validation example admits a value its query cannot process, recognising that
limit is only part of the teaching job. Decide whether the article owes a
compatible path, a deliberate failure exercise, or a narrowly stated stop.
Avoid automatically adding every related mechanism.

Distinguish a contention aid from a lost-edit aid, a join route from the matching
pairs, and a token boundary from a fixed view. A figure that correctly depicts
one relationship cannot be assumed to support a neighbouring causal claim.
Suggest support from the actual memory/reconstruction burden; a short worked
result can do more than another interactive control.

Keep review verdicts scoped. The missing driver implementation, full SQL course,
isolation taxonomy, payment state machine and operations guide are not defects
in these bounded articles. The unfinished practical JSON choice and early SQL
prerequisites are. A technically defensible sequence can still need those repairs
before being considered ready for its intended newcomer reading.

## Addendum: plan review and conversion evidence

After the original reading, I reviewed `improvement-plan.md` and the independent
reader's still-in-progress `first-reader.md`. The plan is bounded and all its
named article anchors exist. Three corrections were returned: make input
conversion checks explicit; preserve the reviewers' different judgements; and
label the SQL bridges, compatible capacity path and lost-edit explanation P2,
while keeping the retry reference optional support.

The first reader currently finds the constraint outcomes sufficient to follow
the rule, the weak JSON check accurately explained, and the current-value update
understandable without an expert step. My findings concern adapting the INSERT,
finishing a usable validation/query contract, and demonstrating why an old object
can lose an unrelated edit. These are different judgements to preserve, not a
requirement to make the readers agree. This addendum does not revise the original
reading evidence.

One fresh conversion probe ran on 5 October 2026 in a new in-memory PGlite
instance, loaded through Node from
`/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js`.
The installed package is PGlite **0.5.8**. Existing execution evidence from this
installation records **PostgreSQL 18.3 on wasm32-unknown-emscripten**; the fresh
probe did not issue `SELECT version()` again.

Exact statement executed:

```sql
SELECT 350.5::integer AS numeric_to_integer;
```

Observed output:

```text
rows: [{ numeric_to_integer: 351 }]
command: SELECT
rowCount: 1
```

That numeric-literal conversion is different from the article's extraction:

```sql
(attributes ->> 'capacity_ml')::integer
```

For a JSON number 350.5, `->>` supplies the text `350.5`, which the integer text
input rejects. The existing `designing-data/article-sql-results.json` records
`22P02` with `invalid input syntax for type integer: "350.5"` for that query and
the indexed write. Those JSON outcomes were consulted, not freshly reproduced
during the plan review.

The fresh check establishes only the explicit numeric-to-integer cast above. It
did not test a table insert, a migration, another ingestion expression, or
concurrency. A proposed typed-column repair must test its actual ingestion path
and explain whether fractional input is rejected, rounded or renegotiated; a
stored integer type alone does not establish an input-rejection policy. A JSON
repair must not depend on written AND/OR order to guard unsafe casts. Moving
capacity should also leave one authoritative value, rather than two independently
editable copies.
