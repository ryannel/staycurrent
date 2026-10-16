# Relational fundamentals review

Outline-first informed reading of the supplied built-text capture in `/private/tmp/staycurrent-heading-review/before/`, 16 October 2026. The captured opening of every assigned page was read before any heading tree or full body. The expectations below were saved at that point. This is not a visual or interaction audit. Optional disclosures are labelled in the capture; SVG, scripts and styles are excluded.

## Initial coverage expectations

### introduction

Tables, rows, keys and relationships; a worked query across tables; how changes and overlapping requests remain correct; enough orientation to choose the focused next reading. It owes an introduction, not each operational mechanism.

### modelling

Derive a schema from facts and dependencies; explain the first three normal forms, keys, relationships, types and rules; show when further separation or JSON is appropriate. The explicit normalisation promise needs mechanisms and counterexamples.

### constraints

Show what declared rules protect under concurrent writers, nullable and unique values, relationships and deletion, and immediate/deferred checks. Distinguish validation from a dependable database invariant and explain consequential exceptions.

### tables-and-documents

Compare typed columns, related rows and JSON using concrete query and integrity needs; explain nested-field access and missing/invalid values, with a workable design and limits. Full document-database comparison is outside this PostgreSQL article.

### query-results

Teach selecting/filtering, join multiplicity, grouping and result meaning; show how to recognise a wrong answer; then connect logical results to physical work and an execution plan. Expected NULL/outer-join treatment depends on examples, not a complete SQL catalogue.

### query-execution

Explain execution-plan operators and reading order, estimates versus actual work, repeat counts, joins and material data-volume changes; show a diagnostic action and its tradeoff. It should give enough plan interpretation to investigate a slow query.

### large-results

Explain ordering and tie-breakers, offset versus continuation, concurrent insert/update/delete effects, query/index consequences, and how a fixed export differs from a live list. Finish a safe continuation and fixed-snapshot approach.

### transaction-boundaries

Build a complete purchase and show commit/rollback in an application connection; handle competing stock requests, multi-record decisions, known aborts and uncertain commits. Atomicity and concurrency must have distinguishable mechanisms and outcomes.

### isolation

Trace snapshots across statements/connections and isolation levels, including a stable report and a cross-row write dependency; explain possible aborts and what must be retried. PostgreSQL-specific distinctions must remain explicit.

### conflicts-and-retries

Distinguish waiting, deadlock, known rollback and unknown commit; complete bounded whole-transaction retry and safe resolution using request identity; say how the application interprets responses and mismatched repeats.

### indexes

Explain the lookup structure, row references, composite order, selective versus broad queries, and read benefit versus storage/write cost; provide enough evidence to test a candidate. Specialist index types can remain onward reading.

### storage

Explain pages and memory, writes/row versions, WAL and commit durability, checkpoints/crash recovery, maintenance and failure/configuration limits. Distinguish a surviving committed transaction from backups and lost storage.

### checkout

A bounded optional worked tour should connect record lookup, one atomic purchase and two competing buyers through visible states and outcomes. Its simplified schema needs explicit orientation; it need not duplicate the full practical implementation.

### practice

A reader can install/start the stated database, connect, obtain the article schema/data and reset between examples; open concurrent connections when needed; distinguish browser sandbox and local exercises. Commands and expected state must suffice to begin.

## Captured heading maps

### introduction

- H1 Relational databases [article]
  - H2 Tables, rows, and columns [article]
    - H3 Products [figure]
  - H2 Relationships between tables [article]
    - H3 Separate records, connected by IDs [figure]
  - H2 Queries and joins [article]
    - H3 What’s in order O12? [figure]
  - H2 Indexes [article]
    - H3 Find C4’s orders and their totals [figure]
      - H4 Index on customer ID [figure]
      - H4 Orders table [figure]
  - H2 Constraints [article]
  - H2 Transactions [article]
  - H2 Concurrent access [article]
    - H3 The second buyer waits before checking [figure]
  - H2 Scaling a relational database [article]
  - H2 When to use a relational database [article]
  - H2 Where to go next [article]
  - H2 The relational database collection [article]
  - H2 Sources and further reading [article]

### modelling

- H1 Designing your data [article]
    - H3 The structure and the records it holds [figure]
      - H4 Schema [figure]
      - H4 Data [figure]
  - H2 What a normalised design looks like [article]
    - H3 Keep a customer’s name with the customer [figure]
      - H4 Customer details repeated in each order [figure]
        - H5 orders [figure]
      - H4 Customers and orders stored separately [figure]
        - H5 customers [figure]
        - H5 orders [figure]
  - H2 Choosing the records [article]
  - H2 Which facts belong together? [article]
  - H2 Normalising the schema [article]
    - H3 First normal form: rows for the repeated records [article]
    - H3 Give each order line a row [figure]
    - H3 Second normal form: the whole key [article]
    - H3 Move order facts onto the order [figure]
    - H3 Third normal form: facts about another record [article]
    - H3 Give product facts their own table [figure]
    - H3 Follow an order to its customer and products [figure]
      - H4 customers [figure]
      - H4 orders [figure]
      - H4 order_lines [figure]
      - H4 products [figure]
  - H2 Keeping the connections [article]
    - H3 Keep enough information to put the pieces back [figure]
      - H4 Keep order_id and line_no on both sides [figure]
      - H4 Keep only order_id on both sides [figure]
  - H2 Current facts and historical facts [article]
    - H3 Which facts should change together? [experiment]
      - H4 Names copied onto orders [experiment]
      - H4 Product P7 · current catalogue [experiment]
      - H4 O12, line 1 · agreed at purchase [experiment]
  - H2 How much separation? [article]
    - H3 One product’s details, together or apart [figure]
      - H4 Keep the product facts together [figure]
      - H4 Split the same facts across tables [figure]
  - H2 Choosing data types [article]
    - H3 The same digits, a different order [figure]
      - H4 Numbers · integer [figure]
      - H4 Strings · text [figure]
    - H3 Numbers, text and true-or-false values [article]
    - H3 Dates and times [article]
    - H3 Units and missing values [article]
  - H2 Making the design enforceable [article]
    - H3 Values, identities and references [article]
    - H3 Which design accepts this line? [experiment]
      - H4 Already stored [experiment]
      - H4 Proposed record [experiment]
    - H3 What happens when a referenced record disappears? [article]
    - H3 Where these rules stop [article]
  - H2 Columns, related rows and JSON [article]
    - H3 Which pieces need an independent life? [article]
  - H2 Trying the design [article]
    - H3 What survives a catalogue change? [exercise]
  - H2 Sources and further reading [article]

### constraints

- H1 Constraints in depth [article]
    - H3 Every writer meets the same reference rule [figure]
      - H4 Ways to write an order line [figure]
      - H4 Inside the database [figure]
  - H2 The shop’s rules [article]
  - H2 Required values and checks [article]
    - H3 Will this quantity be accepted? [experiment]
  - H2 Unique values and keys [article]
  - H2 Concurrent writes [article]
    - H3 Two requests try to claim CUP-GREEN [figure]
  - H2 References and deletion [article]
    - H3 Which records remain? [figure]
      - H4 Attempt 1: delete product P7 [figure]
      - H4 Attempt 2: delete order O12 [figure]
  - H2 The wider operation [article]
  - H2 Sources and further reading [article]

### tables-and-documents

- H1 Tables and JSON [article]
  - H2 Objects inside a table [article]
    - H3 One product row, with structure inside it [figure]
    - H3 Three arrangements for the same capacity [figure]
      - H4 Typed product column [figure]
      - H4 Embedded JSON [figure]
      - H4 Related details row [figure]
  - H2 Typed columns [article]
  - H2 Related records [article]
  - H2 A JSON attributes column [article]
  - H2 Missing keys, nulls, and types [article]
    - H3 What is stored at capacity_ml? [experiment]
      - H4 P7 · stored attributes [experiment]
  - H2 Queries and rules inside JSON [article]
    - H3 Finish the capacity rule [article]
  - H2 Reading and changing a product [article]
    - H3 The writes take turns, but the second object is stale [figure]
    - H3 Two offers inside one row, or one row each [figure]
      - H4 Offers embedded in the product [figure]
      - H4 Offers stored as related rows [figure]
  - H2 Changing the schema [article]
  - H2 A design for this shop [article]
  - H2 Sources and further reading [article]

### query-results

- H1 Querying your data [article]
  - H2 A query and its result [article]
    - H3 The same purchases, three answers [figure]
      - H4 Purchase lines [figure]
      - H4 Which lines? [figure]
      - H4 Which orders contain a mug? [figure]
      - H4 How much per order? [figure]
  - H2 Joins and matching rows [article]
  - H2 Missing matches [article]
  - H2 Grouping and totals [article]
  - H2 When a join inflates a total [article]
    - H3 Two lines × two shipments [figure]
      - H4 Lines belonging to O13 [figure]
      - H4 Shipments belonging to O13 [figure]
      - H4 Joined result · one row per line–shipment pair [figure]
    - H3 One summary from each collection [figure]
      - H4 Purchase amounts · line_totals [figure]
      - H4 Shipment counts · shipment_counts [figure]
      - H4 O13’s result · one amount and one count [figure]
    - H3 One more line, one more shipment [exercise]
  - H2 Checking whether a match exists [article]
  - H2 Checking an answer [article]
  - H2 From the answer to the work [article]
  - H2 Different ways to find the same rows [article]
    - H3 Finding the names on a receipt [article]
  - H2 Why the plan can change [article]
  - H2 Sources and further reading [article]

### query-execution

- H1 How a query runs [article]
  - H2 The example query [article]
  - H2 Nested-loop joins [article]
  - H2 Sorting and aggregation [article]
  - H2 Hash joins and aggregation [article]
    - H3 Customer 42 [figure]
    - H3 All 1,000 customers [figure]
  - H2 Merge joins [article]
    - H3 Orders [figure]
    - H3 Lines’ order IDs [figure]
  - H2 Planner estimates [article]
  - H2 Memory and temporary files [article]
  - H2 Reading an execution plan [article]
  - H2 Sources and further reading [article]

### large-results

- H1 Pagination and large results [article]
  - H2 Ordering the result [article]
  - H2 Counting past earlier rows [article]
  - H2 Continuing from a value [article]
    - H3 What comes after the first two orders? [experiment]
      - H4 Orders visible to the second read [experiment]
      - H4 Skip two current positions [experiment]
      - H4 Continue after O15’s key [experiment]
  - H2 Passing the continuation to a caller [article]
  - H2 The work behind a page [article]
  - H2 A live list is still changing [article]
  - H2 A fixed export [article]
    - H3 Continuing a live query or a fixed view [figure]
      - H4 New queries in Read Committed [figure]
      - H4 One read-only Repeatable Read transaction [figure]
  - H2 Reading batches that do work [article]
  - H2 Sources and further reading [article]

### transaction-boundaries

- H1 Transactions and concurrency [article]
  - H2 Commit and rollback [article]
  - H2 Choosing the transaction boundary [article]
    - H3 Commit and rollback outcomes [figure]
      - H4 Stock [figure]
      - H4 Order [figure]
      - H4 Order line [figure]
      - H4 Purchase recorded [figure]
      - H4 Purchase abandoned [figure]
  - H2 A checkout transaction in practice [article]
    - H3 The checkout handler [article]
    - H3 Recording the purchase [article]
    - H3 Rolling back a rejected purchase [article]
      - H4 Commands: add the stock record [optional]
      - H4 Commands: begin and reserve [optional]
      - H4 Commands: complete the successful branch [optional]
      - H4 Alternative attempt: provoke a failure [optional]
      - H4 Commands: inspect either completed attempt [optional]
  - H2 Concurrent purchases [article]
    - H3 Reading and updating separately [article]
    - H3 Conditional updates [article]
    - H3 Locking reads [article]
      - H4 Comparing ordinary and locking reads [figure]
        - H5 Unsafe: decide from an ordinary read [figure]
        - H5 Coordinated: lock before deciding [figure]
    - H3 Comparing stock reservation methods [experiment]
      - H4 Request A · O14 [experiment]
      - H4 Request B · O15 [experiment]
  - H2 Snapshots and isolation [article]
  - H2 Coordinating changes across rows [article]
    - H3 Reserving several order lines [article]
      - H4 Two order lines reserve the same product [exercise]
    - H3 A condition shared by different rows [article]
      - H4 Concurrent changes to the featured display [figure]
        - H5 Initial committed display [figure]
        - H5 Staff A [figure]
        - H5 Staff B [figure]
        - H5 Combined committed result [figure]
    - H3 Serializable isolation [article]
  - H2 Deadlocks and retries [article]
  - H2 Recovering an uncertain commit [article]
    - H3 One missing reply, two possible histories [experiment]
      - H4 Database reality [experiment]
      - H4 Application’s knowledge and action [experiment]
  - H2 Payments outside the transaction [article]
    - H3 An order awaiting payment [figure]
      - H4 1 · Database transaction [figure]
      - H4 2 · Payment provider [figure]
      - H4 3a · Payment confirmed [figure]
      - H4 3b · Payment declined [figure]
  - H2 Reviewing a transaction boundary [article]
  - H2 Sources and further reading [article]

### isolation

- H1 Isolation and snapshots [article]
  - H2 A view of committed data [article]
  - H2 Statement and transaction views [article]
    - H3 Read the price before and after a commit [experiment]
      - H4 Committed product row [experiment]
      - H4 Report · first ordinary SELECT [experiment]
      - H4 Report · second ordinary SELECT [experiment]
  - H2 The view does not freeze the database [article]
  - H2 A stable view can support conflicting decisions [article]
    - H3 Concurrent changes to the featured display [figure]
      - H4 Initial committed display [figure]
      - H4 Staff A [figure]
      - H4 Staff B [figure]
      - H4 Combined committed result [figure]
  - H2 Serializable and the rejected transaction [article]
    - H3 One shared lock puts the decisions in order [figure]
  - H2 Choose the view and the rule together [article]
  - H2 Sources and further reading [article]

### conflicts-and-retries

- H1 Handling conflicts and uncertain outcomes [article]
  - H2 A wait is still part of an attempt [article]
  - H2 When waits form a cycle [article]
    - H3 Neither checkout can reach commit [figure]
      - H4 Checkout A [figure]
      - H4 Checkout B [figure]
      - H4 PostgreSQL breaks the cycle [figure]
  - H2 Retry the decision, not the last statement [article]
  - H2 A missing commit reply leaves another question [article]
    - H3 The same silence can follow two endings [figure]
      - H4 History 1 · committed [figure]
      - H4 History 2 · not committed [figure]
      - H4 What the application knows [figure]
  - H2 Give the checkout an identity that survives attempts [article]
    - H3 Follow checkout K14 [figure]
      - H4 Before the first attempt [figure]
      - H4 First attempt commits [figure]
      - H4 Same request arrives again [figure]
    - H3 If the claim creates an order [article]
    - H3 If the key already has an order [article]
  - H2 Recover before creating another operation [article]
    - H3 An empty lookup can still lead back to O14 [figure]
      - H4 Repeat the claim using K14 [figure]
      - H4 If the first attempt commits [figure]
      - H4 If the first attempt rolls back [figure]
    - H3 An empty lookup after a lost reply [exercise]
  - H2 Choose the response from the evidence [article]
  - H2 Sources and further reading [article]

### indexes

- H1 Indexes [article]
  - H2 B-tree indexes [article]
    - H3 Finding customer 42’s orders [figure]
      - H4 Root page [figure]
      - H4 Leaf page A [figure]
      - H4 Leaf page B · selected [figure]
      - H4 Leaf page C [figure]
      - H4 Table page 1 [figure]
      - H4 Table page 2 [figure]
  - H2 Composite indexes [article]
    - H3 Ordering a composite index [figure]
      - H4 Customer 41 [figure]
      - H4 Customer 42 [figure]
      - H4 Customer 43 [figure]
  - H2 Filtering [article]
  - H2 Covering indexes [article]
  - H2 Storage and maintenance [article]
  - H2 Testing an index [article]
  - H2 Further reading [article]

### storage

- H1 Storage and durability [article]
  - H2 Rows and pages [article]
    - H3 Reading a table page [figure]
      - H4 Table file · page 12 [figure]
      - H4 Shared buffer · page 12 [figure]
  - H2 Updates and row versions [article]
  - H2 The write-ahead log [article]
    - H3 Acknowledging a commit [figure]
      - H4 Change the buffered page [figure]
      - H4 Flush the WAL through the commit record [figure]
      - H4 Reply to the application [figure]
      - H4 Write the changed table page later [figure]
  - H2 After a crash [article]
    - H3 Three crash scenarios [figure]
      - H4 A · Before a durable commit [figure]
      - H4 B · After the log flush [figure]
      - H4 C · Before the reply arrives [figure]
  - H2 Checkpoints [article]
  - H2 Vacuum and space reuse [article]
  - H2 Durability guarantees [article]
  - H2 Sources and further reading [article]

### checkout

- H1 The last blue mug [article]
  - H2 One fact, one place to change it [article]
    - H3 Orders · order_91 [figure]
    - H3 Products · mug_42 [figure]
  - H2 Finding the mug without visiting every product [article]
  - H2 Two changes, one commit [article]
    - H3 Two buyers, one blue mug [experiment]
  - H2 A reader can keep an earlier version [article]
  - H2 What survives a crash? [article]
  - H2 Where I'd start [article]
  - H2 Sources and model notes [article]

### practice

- H1 Start the SQL practice [article]
  - H2 Open a local database [article]
  - H2 Put the practice files where psql can read them [article]
  - H2 Load the shop and check the first answer [article]
  - H2 Start fresh when the article starts again [article]
  - H2 Continue with an independent lesson [article]
  - H2 Finish the practice [article]
  - H2 Setup references [article]

## Reading findings and resolutions

The opening expectations and captured maps above preceded the body reading. Bodies were then read in article order, including labelled disclosures, code, outputs and extracted media text. Long bodies arrived in successive chunks; truncated tool output was reread in bounded ranges. The observations below are informed outline-first judgments, not a blind novice test. Individual heading/body comparisons were made during reading but not saved as separate timestamped predictions. No claim about visual clarity or live controls follows from this text capture.

### Introduction

The map promises the relational model, queries, efficient access, integrity, atomicity, concurrency, scaling and choice. Each section supplies that orientation: O12's P7 reference becomes “Blue mug, 2”; the index locates C4's scattered orders; the lock timeline delays the second buyer's decision, rather than only its write. Current versus agreed price prevents the normalisation explanation implying that all duplicated-looking values should disappear. Further reading into modelling, queries, transactions and indexes was read directly and supports the advertised next step. The coordinator separately verified the scaling destination. No essential missing explanation or heading repair found. Full operations, product comparisons and specialist access methods are legitimate boundaries of an introduction.

### Designing your data

The main map is coherent: identity and functional dependency prepare the three normal forms; relationships, history and separation establish consequences before types and rules. Each normal-form heading has the expected explanation and an actual before/after consequence. Lossless decomposition is taught under “Keeping the connections,” including the wrong four-way price/product join, so it is not missing merely because the formal term is absent from the heading. The normal-form figures are supporting headings, not extra argument sections.

Coverage is substantial: candidate/composite keys, anomalies, all three normal forms, retained references, current and historical facts, denormalisation maintenance, types, units, nulls, constraints and JSON boundaries. The optional formal 3NF discussion is appropriate depth beyond the practical explanation. Linked Constraints and Tables and JSON finish their promised investigations. The contents label “A healthy design” concealed the specific normalisation subject named by its destination; changed it to “A normalised design.” Other shortened contents labels remain recognisable. No body expansion needed.

### Constraints in depth

The opening owes the reader how competing writes, optional values, deletion and check timing behave. Values/checks, keys and concurrent writes deliver concrete accepted/rejected outcomes. The composite reference example correctly requires the whole pair, and the final section distinguishes “each line has an order” from “each order has a line.” The linked transaction and checkout articles actually develop the wider operation; exclusion/temporal rules can remain beyond this shop-focused scope.

**Shallow coverage, with a navigation consequence:** timing had only a closing sentence in “References and deletion”: a transaction that temporarily breaks a reference “needs to consider check timing explicitly.” That named the choice but did not explain what deferring does or where failure moves. Added “When constraints are checked,” using a line inserted before its order to contrast immediate rejection with a deferred check at commit. It explains commit failure, the application’s obligation to handle it, initial modes, an explicit early check and the limits on deferral. The source-backed explanation is in the main path; existing downloadable exercises keep their immediate constraints. Renamed “The wider operation” to “What constraints leave to the transaction,” making its exact boundary findable. No unrelated constraint inventory added.

### Tables and JSON

The map develops three representations, then missing values, internal rules, reads/writes, migration and the final choice. The supplied body fulfils that sequence: JSON text extraction is distinguished from JSON type; the number check is shown to admit a fraction that breaks the first query; the main-path conversion policy rejects strings and fractions before a typed details row becomes authoritative. Exact conversion commands are optional, while the policy and outcomes remain visible. “Finish the capacity rule” has a clear referent in the immediately preceding failed number check and leads to an actual completed design; retained it rather than rejecting an imperative mechanically.

Row-lock contention and the stale whole-object replacement example explain why separate JSON keys are not independent records. Related rows' missing category guarantees are explicit. The existing PostgreSQL JSON destination, independently read by the coordinator, teaches array-member predicates, JSON_TABLE and index matching. No essential gap or structural repair found.

### Querying your data

The map correctly moves from row meaning to matching, grouping, correctness and physical work. The body teaches left joins, NULL, ON-versus-WHERE, aggregate null/count differences, multiplied joins, separate summaries and existence tests. These are worked explanations, not mentions. The two-lines/two-shipments example preserves the exact cause of the false €88 total and repairs it; DISTINCT is rejected for a reason. Parameter binding and explicit ordering are introduced where first used.

**Buried but complete explanation:** “Missing matches” held the long comparison between a matching condition and a later filter without a landmark. Renamed the parent “Left joins and missing matches” and added H3 “Filtering an outer join” at the start of the time-cutoff comparison. The existing opening already states the changed question and introduces Cara's separate example, so it needed no additional preface. **Contents mismatch:** “Checking an answer” existed as a substantive H2 but was absent from contents; added its link and aligned the existence label with its actual heading. The corrected tree retains logical result sections before the physical-plan sections. No technical rewrite needed.

### How a query runs

The tree gives familiar landmarks for nested loops, sorting/aggregation, hash joins, merge joins, estimates and memory. Sequential reading follows one narrow report, then explicitly broadens it before comparing plans. Both reports return three rows, while 30 versus 30,000 joined rows expose the actual work. Repeated inner scans, bitmap ordering, blocking sorts, dependency statistics and spill counters all receive mechanisms and observable consequences. Costs and PGlite observations have appropriate limits. The final plan-reading section turns those mechanisms into a diagnostic procedure. The PostgreSQL continuation was independently read by the coordinator and supports prepared-plan and concurrent-memory depth. No material gap or heading repair found.

### Pagination and large results

**Navigation repair:** “Counting past earlier rows” and “Continuing from a value” accurately describe their bodies, but omit the established names readers comparing pagination methods would look for. Changed them to “Offset pagination” and “Keyset pagination”; their openings explain the actions immediately. Existing IDs remain stable.

Coverage is complete for the promise: deterministic ordering and ties; insertion/deletion position shifts; strict pair comparison; opaque tokens and extra-row handling; index work; changed sort values; separate statement views; one-connection fixed export; and progress/effect coordination for jobs. The export explicitly says a lost connection loses this cursor and explains long-snapshot costs. Resumable worker ownership and external-effect recovery are bounded and connected to the fully read retry article. No additional SQL or cursor implementation is needed to explain this article's contract.

### Transactions and concurrency

The heading hierarchy already separates the complete purchase, competing purchase methods and cross-row rules. Its parent introductions state why those cases follow one another. The application connection, driver response and branch choice are explicit before interpreting SQL. Zero-row success, constraint rejection, connection cleanup and unknown commit outcomes are distinguished; the optional complete handler does not supply an essential missing branch from the main path.

The multi-line exercise is derivable from the earlier fact that a transaction sees its own updates. The display example then changes the dependency from same-row stock to cross-row reads, and Serializable is explained through impossible serial outcomes. Complete whole-attempt retry, retained request identity, matching request details, active original claims, authoritative lookup, payments and an outbox close the promised failure/recovery path. The shorter uncertain-commit protocol agrees with the retry article's full branches. No material heading or coverage issue found; preserve this complete explanation.

### Isolation and snapshots

The snapshots and writer behavior are well taught. Main-path code and the two-connection instructions establish when each view begins; write skew, Serializable failure and a complete retry have actual results. The existing shared-control-row alternative correctly requires a subsequent Read Committed query and shows why merely locking an unchanged row at Repeatable Read fails.

**Buried coverage and misleading containment:** the entire shared-lock alternative sat under “Serializable and the rejected transaction.” It is an alternative coordination protocol, not a type of Serializable execution. Split it into H2 “Coordinating decisions with a shared lock,” preserving all explanation and giving its opening an explicit connection to the display rule. Changed “Statement and transaction views” to “Read Committed and Repeatable Read,” and “A stable view can support conflicting decisions” to “Write skew across different rows.” These keep the mechanisms findable without changing their sequence. Added a brief explanation that PostgreSQL implements Read Uncommitted as Read Committed, completing the opening's isolation-level orientation. No generic four-level matrix or new concurrency algorithm needed.

### Handling conflicts and uncertain outcomes

The body supplies waiting/cancellation ambiguity, deadlock prevention and rejection, complete bounded retry, a stable operation claim, both insertion outcomes, request-detail validation, active original attempts, key retention and external effects. The repeated claim's subsequent Read Committed read is explicit, so “empty lookup” is not mistaken for a proven rollback. This is complete teaching of the stated local checkout protocol. Permissions, provider implementations and globally lost database state are recognised boundaries, not hidden promises.

**Navigation repair:** “When waits form a cycle” hid the expected Deadlocks landmark; “A missing commit reply leaves another question” did not name the unknown-outcome subject. Replaced them with “Deadlocks” and “Unknown commit outcomes.” Shortened the operation/recovery headings to “A stable identity for checkout retries” and “Recovering with the same operation key,” preserving the distinct establishment and recovery steps. Retained “Retry the decision, not the last statement”: it states the consequential distinction the section develops, rather than concealing its subject. No technical body repair needed.

### Indexes

The opening establishes index contents before the example. The tree's B-tree/composite/filtering/covering/maintenance/testing progression is accurate. Body reading confirms selectivity, heap visibility, stop-after-limit behavior, key order, residual filtering, partial indexes, skip scans, covering scans and maintenance costs. It explicitly distinguishes observed row-work improvements from production latency, then gives the required workload test. The section “Filtering” reasonably contains the added status condition and its alternative access paths; this is not a missing partial-index article. Specialist access methods are a legitimate onward investigation and the PostgreSQL index destination was independently verified by the coordinator. No repair needed.

### Storage and durability

The tree names the mechanisms and follows their dependency: pages, versions, WAL, restart, checkpoints, cleanup and guarantees. The body distinguishes a dirty page from a commit, redo from rerunning SQL, durable commit from acknowledgement, checkpoints from vacuum, and surviving storage from backup recovery. Crash cases state their settings and outcomes. Torn writes and full-page images are explained at the failure that motivates them. The final section fulfils its configuration/failure promise with asynchronous commit, fsync, unlogged tables and backup/archive requirements. The coordinator's operations review confirms recovery/scaling depth; the detailed operational destination remains a legitimate extension. No missing essential explanation or heading change found.

### The last blue mug

The optional tour announces its separate one-product schema and resets explicitly after the historical-price figure. Lookup, atomicity, a guarded same-row decision, snapshots and crash recovery are explained within that scope. Its SQL comments deliberately abbreviate the order branch, with a verified link to the complete transaction article; this tour does not claim to be a runnable application.

**Structural repair:** “Two changes, one commit” contained both the atomic purchase and the competing-buyer investigation. The opening distinguishes those demands, so the map should too. Added H2 “Competing for the last mug” before Bob arrives and explicitly carried forward that both purchases still use transactions. **Vague destination heading:** changed “Where I'd start” to “Choosing a database for the shop.” **Availability mismatch:** ordinary links to documents and distributed SQL led to pages explicitly marked “Working draft.” Direct inspection of their built pages confirmed that status. Labelled them as drafts and identified the document subject as planned coverage. No new claims of available publication or deep distributed-system coverage introduced.

### Start the SQL practice

The imperative headings fit a procedural guide: start the database, copy files, check an answer, reset, continue, finish. They name the task and sequence, not instructions to an article writer. The body distinguishes terminal from psql commands, explains files inside the container, gives expected output, separates statement execution from whole-script submission, resets article states and explains two connections to the same database. Temporary-table lifetime and completed-script versus article-beginning state are explicit. The sandbox and server paths are bounded honestly. No missing step identified by this textual review; no new Docker run or setup execution performed.

## Evidence and recheck

The new constraint-timing explanation was checked on 16 October 2026 against PostgreSQL 18 [SET CONSTRAINTS](https://www.postgresql.org/docs/18/sql-set-constraints.html), especially the initial modes, retroactive check and immediate-only constraint classes, and [foreign-key deletion actions](https://www.postgresql.org/docs/18/ddl-constraints.html#DDL-CONSTRAINTS-FK), including RESTRICT versus NO ACTION. The line-before-order comparison is an illustrative consequence of those documented rules, not a newly recorded engine run. The added isolation alias was checked against [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), table 13.1 and its following paragraph.

The existing technical teaching was assessed for completeness, with no claim to have rerun every historical experiment or revalidated every unchanged citation. The coordinator independently read the eleven PostgreSQL continuations and confirmed that JSON, indexes and query-execution support the links described above. Its operations reviewer reported the recovery/scaling bodies complete. Cross-links among all fourteen assigned destinations were checked against bodies read here. The two draft-family links were checked directly against built destination text.

After repairs, affected headings were reread with their openings and adjacent transitions. The new constraint section continues naturally from deletion semantics to check timing and then to the larger transaction boundary. The shared-lock section now presents an alternative to Serializable rather than nesting under it. The tour preserves its two distinct requirements. No change removed a mechanism, condition, result or example. No component, layout, manifest, download or skill was changed.

Seven article files changed: `modelling.astro`, `constraints.astro`, `query-results.astro`, `large-results.astro`, `isolation.astro`, `conflicts-and-retries.astro` and `checkout.astro`, all under `src/pages/learn/databases/relational/`. The introduction, Tables and JSON, How a query runs, Transactions and concurrency, Indexes, Storage and durability, and Practice were assessed and retained.

Status: repairs complete for coordinator review. The shared `pnpm build`, regenerated assembled heading tree, browser checks and independent recheck belong to the coordinator's final verification. Text extraction does not establish visual or interactive quality, and this pass does not rerun historical SQL experiments. No remaining essential coverage gap was identified within these fourteen articles' promises.

Coordinator recheck: the new constraint-timing prose was independently checked against PostgreSQL 18 documentation. The coordinator suggested “A stable identity for checkout retries” to avoid implying that different purchases share an identity; that refinement was applied. The coordinator completed the focused execution check in PostgreSQL 18.3 through PGlite 0.5.8; I inspected `constraint-timing-check.json`. The valid deferred reference survived commit, an unresolved reference failed commit with `23503` without retaining its row, and forcing the deferred check early also returned `23503`. This supports the added timing explanation within a local engine; it is not a hosted PostgreSQL or concurrency test. Shared build and browser verification remain with the coordinator.
