# Relational databases: proposed article tree

38 proposed articles: one introduction, eight main guides and 29 deeper articles. Both local review perspectives and all three whole-tree perspectives passed after repair. Planning only; no articles written.

The expertise target is practice in relational databases throughout. Each child is placed under the parent heading that introduces it. Its parent supplies the useful overview before linking to deeper reading.

The complete heading briefs remain in the [canonical YAML](../../coverage/relational-fanout-2026-10-19.yaml). This view shows the article briefs, section titles and contextual child placements.

## Article map

- [Relational databases](#a00)
  - [Designing relational data](#a01)
    - [Choosing types and representing missing values](#a09)
    - [Expressing rules with constraints](#a10)
    - [Normalisation and deliberate redundancy](#a11)
    - [Modelling history and data lifecycles](#a12)
  - [Working with SQL](#a02)
    - [Getting SQL values right](#a13)
    - [Joining and summarising data](#a14)
    - [Composing larger SQL queries](#a15)
    - [Calculating across related rows](#a16)
    - [Changing data with SQL](#a17)
  - [Making concurrent changes correct](#a03)
    - [Designing changes that coordinate with locks](#a18)
    - [Reading and testing isolation guarantees](#a19)
  - [Building applications around a relational database](#a04)
    - [Managing connections and transaction lifetimes](#a20)
    - [Controlling the queries your application performs](#a21)
    - [Recovering database requests safely](#a22)
    - [Connecting transactions to background work and events](#a23)
  - [Understanding and improving database performance](#a05)
    - [How stored rows become physical work](#a24)
    - [Choosing indexes for a workload](#a25)
    - [Diagnosing a query from its execution plan](#a26)
    - [Improving performance under concurrent load](#a28)
  - [Changing a live database](#a06)
    - [Changing schemas without breaking applications](#a29)
    - [Running reliable data changes](#a30)
    - [Moving databases with a controlled cutover](#a31)
  - [Running a relational service](#a07)
    - [Securing a relational service](#a35)
    - [Monitoring and sizing a relational service](#a36)
    - [Maintaining and upgrading a relational service](#a37)
    - [Operating replicas and partitioned data](#a38)
    - [Backing up and restoring relational data](#a39)
  - [Choosing a relational database](#a08)
    - [Checking an embedded choice with SQLite](#a32)
    - [Checking a distributed choice with CockroachDB](#a34)

<a id="a00"></a>
## a00 · Relational databases

Introduce relational databases through an ordinary application that must keep related facts correct while people read and change them. Establish the model, the work a database performs and the decisions its users remain responsible for. Give an intelligent engineer new to the subject a useful first working model and a route to expert practice in choosing, designing, querying, integrating, diagnosing, operating and recovering a relational service. Keep detailed mechanisms in the contextual articles where they change a practical decision. Make the parent-first reading contract explicit: the current article supplies a usable answer before its contextual children deepen a question. Newcomers finish the working-route parent articles before selecting that depth; readers entering for a particular task see any precise prerequisite section at the contextual entrance.

- One action changes several facts
- Tables describe facts and relationships
  ↳ Deeper article: [Designing relational data](#a01).
- Ask for a result, then check what it means
  ↳ Deeper article: [Working with SQL](#a02).
- A transaction protects a change within a stated contract
  ↳ Deeper article: [Making concurrent changes correct](#a03).
- The application is part of the database system
  ↳ Deeper article: [Building applications around a relational database](#a04).
- Correct SQL still has to do physical work
  ↳ Deeper article: [Understanding and improving database performance](#a05).
- Data and applications change at different speeds
  ↳ Deeper article: [Changing a live database](#a06).
- Operate for the failure you must recover from
  ↳ Deeper article: [Running a relational service](#a07).
- Choose a system by testing the contract you need
  ↳ Deeper article: [Choosing a relational database](#a08).

<a id="a01"></a>
## a01 · Designing relational data

Introduced by [a00](#a00), under **Tables describe facts and relationships**.

Teach an engineer to translate application facts, rules and access needs into a relational schema. Follow a booking application from ordinary requirements to tables, identities, relationships, value representations and enforceable rules, exposing the failures each decision prevents. Establish a practical account of normalisation and controlled redundancy, then account for history and deletion. Test the design with representative reads, changes and lifecycle scenarios. Develop specialised modelling only where it changes these relational decisions; leave query fluency, transaction protocols and live migration procedures to their neighbouring articles.

- Begin with facts and rules
- Give every row a clear meaning
  - Choose identity and scope deliberately
  - Represent optional relationships
- A value needs a meaning as well as a type
  ↳ Deeper article: [Choosing types and representing missing values](#a09).
- Make invalid facts difficult to store
  ↳ Deeper article: [Expressing rules with constraints](#a10).
- Store each fact where it belongs
  ↳ Deeper article: [Normalisation and deliberate redundancy](#a11).
- Decide what changes and what must be remembered
  ↳ Deeper article: [Modelling history and data lifecycles](#a12).
- Test the schema against the application's life

<a id="a09"></a>
## a09 · Choosing types and representing missing values

Introduced by [a01](#a01), under **A value needs a meaning as well as a type**.

Choose representations that preserve a value's meaning, allowed states and useful operations across the database and application boundary. Develop a booking schema through prices, identifiers, customer text, reservation times and optional details, using concrete failures to justify each choice. Distinguish exactness from precision, identity from presentation, instants from local schedules, and missing information from empty values. Compare scalar columns, arrays, JSON, binary values, related rows and external payloads through validation, query and ownership requirements. Use selected, documented engine differences only when they change a decision. Leave SQL expression behaviour, constraint design, historical modelling and live migration procedures to their owning articles.

- Start with what a value must preserve
- Choose numeric representations from the error you can accept
- Preserve identity and define text equality
- Store the time the application actually means
- Represent missing information without inventing facts
- Choose the boundary of a structured value
- Check representations at the application boundary

<a id="a10"></a>
## a10 · Expressing rules with constraints

Introduced by [a01](#a01), under **Make invalid facts difficult to store**.

Teach how to translate application invariants into database constraints and identify what remains outside their scope. Develop a booking schema through required values, candidate keys, tenant-scoped references, conditional uniqueness, mutually dependent rows and non-overlapping reservations. Make each example end with an enforcement decision and valid and invalid changes. Check the selected engine's null, timing and constraint capabilities; reshape the data where that makes a rule enforceable, and state the obligations of triggers or transaction protocols where it does not. Examine update and deletion actions and finish with an enforcement map and concurrency cases for the transactions branch. Leave value representation, transaction anomaly analysis and adding constraints to live data to their owning articles.

- State the rule before choosing its constraint
- Close the gaps in required values and identity
- Reference the whole relationship
- Enforce uniqueness only where the rule applies
- Decide when related changes must become valid
- Make reservation conflicts a stored rule where possible
- Choose what a referenced change is allowed to do
- Account for rules the schema cannot express

<a id="a11"></a>
## a11 · Normalisation and deliberate redundancy

Introduced by [a01](#a01), under **Store each fact where it belongs**.

Teach how to recognise facts with different dependencies, split their storage without losing meaning, and justify retaining a derived copy. Extend the booking design with candidate-key, partial-dependency, transitive-dependency and independent-set cases; introduce normal-form names only when they explain a consequential choice. Check both reconstruction and enforceability after a split. Compare repeated attributes, cached totals, summary tables and materialised results through their read benefit and maintenance contract. Finish with a defensible design and a falsifiable case for its redundancy, using the performance and transaction branches for detailed validation rather than expanding this into a theory or optimisation curriculum.

- State what determines each fact
- Split facts that depend on different keys
  - Follow indirect dependencies
  - Handle overlapping candidate keys when they matter
- Prove that the split preserves the relationships
  - Check what can still be enforced locally
- Separate independent sets without inventing combinations
  - Keep combinations that are themselves facts
- Decide which repeated results are worth storing
- Give every derived copy a maintenance contract
  - Choose atomic maintenance or explicit lag
  - Make drift detectable and rebuilding safe
- Defend the design with changes and counterexamples

<a id="a12"></a>
## a12 · Modelling history and data lifecycles

Introduced by [a01](#a01), under **Decide what changes and what must be remembered**.

Teach how to choose among current-state rows, immutable snapshots, change records and effective-dated versions for concrete relational requirements. Distinguish when a fact applied from when the database recorded it, introducing both dimensions only when late information and corrections require them. Design version identity, historical references, interval boundaries and overlap rules so point-in-time questions have a defined answer. Compare status changes, tombstones, archival and deletion through their effects on references, uniqueness, reporting, retention and erasure. Bound the evidence that history rows provide and the removal achieved by deleting live rows; refer operational procedures and live lifecycle changes to their owning branches.

- Start with the questions the past must answer
- Store the facts each question needs
  - Preserve an agreement with a snapshot
  - Record changes when the sequence matters
  - Use effective-dated versions for facts with a period of applicability
- Separate an entity from its versions
- Define time boundaries and correction rules
  - Make each instant resolve to a defined version
  - Add recorded time only when corrections require it
- Decide what leaving the active set means
  - Follow references, uniqueness and reports through removal
  - Specify retention and erasure beyond the row
- Test what the history can truthfully establish

<a id="a02"></a>
## a02 · Working with SQL

Introduced by [a00](#a00), under **Ask for a result, then check what it means**.

Build practical fluency in reading and writing SQL, from inspecting a disposable database to expressing and checking substantial application and analytical queries. Teach selection, joins, aggregation, subqueries, set operations, window calculations and recursion where they solve useful relational problems. Develop precise reasoning about duplicates, nulls, ordering, time, pagination and data changes. Teach how to establish expected results and test edge cases. Distinguish portable concepts from dialect behaviour without attempting an exhaustive syntax catalogue; leave execution-cost diagnosis to its own branch.

- Start with a database you can inspect and reset
- Decide what one result row means
- Select rows and calculate their columns
- Make values, missing facts and time explicit
  ↳ Deeper article: [Getting SQL values right](#a13).
- Combine related facts without changing the question
  ↳ Deeper article: [Joining and summarising data](#a14).
- Express a larger question in checkable stages
  ↳ Deeper article: [Composing larger SQL queries](#a15).
- Compare rows while keeping their detail
  ↳ Deeper article: [Calculating across related rows](#a16).
- Order and page a result deliberately
- Change the intended rows and inspect the outcome
  ↳ Deeper article: [Changing data with SQL](#a17).
- Check the answer before trusting the query

<a id="a13"></a>
## a13 · Getting SQL values right

Introduced by [a02](#a02), under **Make values, missing facts and time explicit**.

Teach practitioners to recognise and repair plausible wrong answers caused by SQL expression semantics. Extend the parent's basic null example through missing-value logic, deliberate defaults, arithmetic, text comparison, conversions and time calculations. Use a compact booking-and-charge report with hand-checked expected values, PostgreSQL as the named reference engine, and documented dialect differences only where they change the result or the repair. Keep representation choices in schema design, aggregate and join semantics in their sibling, membership traps in query composition and driver conversion in application integration. Stop at the depth needed to write and verify ordinary relational queries; no function catalogue or specialist calendar branch is needed.

- Start with the answer each expression must mean
- Follow unknown through a predicate
- Make defaults and conditional results express the business rule
- Check the arithmetic before trusting the amount
- Ask which text counts as equal or matching
- Make conversions visible at the expression boundary
- Calculate reporting boundaries in the intended clock
- Separate calendar movement from elapsed duration
- Keep a small regression fixture for value semantics

<a id="a14"></a>
## a14 · Joining and summarising data

Introduced by [a02](#a02), under **Combine related facts without changing the question**.

Build correct multi-table application queries and reports by keeping the meaning of one result row explicit. Develop join cardinality, outer-join filtering, grouping, counts, conditional totals and the repair of double-counting with a small connected set of checked examples. Follow the parent-first reading path. Before the first worked task, tell contextual entrants to read Working with SQL's section Express a larger question in checkable stages: its small staged query supplies the derived-table or CTE notation used here. Assume that section alongside the parent's first join and grouped query; concentrate on cases that produce plausible wrong answers. No composition tutorial or prerequisite visit to Composing larger SQL queries is needed. Identify the example engine and consequential dialect behaviour at first use. Keep detailed existence and membership semantics with Composing larger SQL queries, expression semantics with Getting SQL values right, and execution methods and costs with performance. This article supplies the depth needed for expert relational practice without a further reporting or join-specialist branch.

- State what one result row represents
- Follow the matches a join produces
- Preserve unmatched rows deliberately
- Group at the level the question asks for
- Make counts, missing values and conditional totals agree
- Combine independent totals without multiplying them
- Prove the report against awkward data

<a id="a15"></a>
## a15 · Composing larger SQL queries

Introduced by [a02](#a02), under **Express a larger question in checkable stages**.

Extend the parent's completed report and existence test with the correctness decisions needed when queries return scalar values, supply tables, compare memberships or combine results. Make cardinality, correlation, null policy, compatible types and duplicate policy explicit. Explain how a checked query becomes a reusable view without implying an execution strategy. Offer one optional hierarchy traversal with deliberate termination, cycle, multiplicity and ordering rules. Use a named engine and identify consequential dialect differences; leave execution costs, materialisation and plan diagnosis to performance, and view deployment to evolution.

- Choose what the inner query must return
- Make the dependency on the outer row visible
- Define what membership means when values can be missing
- Combine result sets with the intended multiplicity
- Give a checked query a reusable interface
- Follow a hierarchy only when the task requires traversal
  - Separate the starting rows from each expansion
  - Stop cycles and choose which repeats to retain
- Check the contracts introduced by composition

<a id="a16"></a>
## a16 · Calculating across related rows

Introduced by [a02](#a02), under **Compare rows while keeping their detail**.

Teach window calculations as a way to compare and summarise related rows while retaining the required detail. Develop latest rows per entity, top items per group, shares of totals, running and moving totals, and changes from an earlier event using two small, hand-checked datasets. Distinguish input rows, partitions, ordering, peers and frames, and make ties, missing periods and filtering choices observable in expected results. Use a named PostgreSQL version for runnable examples, check consequential behaviour against its primary documentation, and identify dialect differences only when they change a reader's query or result. Assume the parent's basic query and staging workflow; link value semantics, aggregation and execution-cost diagnosis to their existing owners. Stop at reliable application and reporting calculations rather than a function catalogue or analytical specialism.

- Decide what one result row represents
- Separate the input, partition and two kinds of order
- Choose one latest row or preserve tied winners
- Filter after the calculation when the question requires it
- Keep a whole-group denominator for shares
- Make running and moving frames explicit
- Compare with the previous event or previous period
- Check the calculation at its boundaries

<a id="a17"></a>
## a17 · Changing data with SQL

Introduced by [a02](#a02), under **Change the intended rows and inspect the outcome**.

Make INSERT, UPDATE and DELETE express a deliberate change to a known target set, then establish whether their results satisfy the intended postcondition. Extend the parent's first change workflow through set-based changes, insert-from-query, defaults and generated identifiers, constraint failures, ambiguous source matches and conflict-handling choices. Use a small order-and-stock fixture in a named PostgreSQL version, checking consequential behaviour against its primary documentation and recording actual results separately from illustrative examples. Keep conflict-handling inserts, upsert and MERGE together as an outcome decision; identify consequential dialect differences without building a syntax catalogue. Use bounded transactions for disposable exercises and link to transaction reasoning for concurrent correctness, application integration for retries and idempotency, and evolution for production corrections and backfills.

- State the change before writing the statement
- Insert the intended rows and keep their identities
- Make set-based updates unambiguous
- Delete rows and account for dependent changes
- Decide what should happen when an insert meets existing data
- Inspect what changed inside a bounded transaction
- Prove the change against awkward inputs

<a id="a03"></a>
## a03 · Making concurrent changes correct

Introduced by [a00](#a00), under **A transaction protects a change within a stated contract**.

Teach practitioners to state application invariants, choose transaction boundaries and preserve those invariants under concurrent execution and failures. Connect isolation anomalies to locking, versioned reads, conflict detection, constraints and serialisation, using labelled illustrative schedules and verified engine behaviour. Develop practical choices among atomic statements, conditional changes, locks and stronger isolation, including deadlocks, retries and uncertain commit outcomes. Explain the database's durability boundary and the limit of transactions across external effects; leave detailed client integration and service recovery procedures to their respective articles.

- Start with the fact that must remain true
  - Put the complete change inside a boundary
  - Let the database reject invalid states where it can
- Two correct-looking transactions can make an incorrect result
  - The protection must cover the decision as well as the write
  - A repeatable view does not by itself prove the rule
- Choose protection for the invariant you actually have
  - Express a change and its condition together
  - Coordinate decisions that span several rows
    ↳ Deeper article: [Designing changes that coordinate with locks](#a18).
- Understand the isolation contract behind the choice
  - Versions and locks answer different questions
  - Stronger isolation can reject a result instead of waiting
    ↳ Deeper article: [Reading and testing isolation guarantees](#a19).
- An aborted transaction must be reconsidered as a whole
  - Retrying one statement can preserve a stale decision
  - Losing the reply does not prove rollback
- Commit has a durability boundary and a system boundary
  - A database rollback cannot undo an external effect
- Check the argument with competing sessions and failures

<a id="a18"></a>
## a18 · Designing changes that coordinate with locks

Introduced by [a03](#a03), under **Coordinate decisions that span several rows**.

Teach practitioners to construct and assess explicit locking protocols for relational invariants that ordinary constraints or a conditional row change cannot express. Develop one reservation-capacity example using PostgreSQL at a stated isolation level, with primary-source checks and reproducible sessions required before presenting engine behaviour as established. Cover existing and missing rows, inserts, coordination rows, lock modes, acquisition order, waiting and deadlocks. Finish with an argument covering every writer and a two-session check. Link to isolation for interpreting engine contracts and to application integration for retry machinery; do not expand into a queue or lock catalogue.

- Identify the decision that needs protection
- Cover every change that could invalidate the decision
- Give the invariant a stable coordination row
- Choose the lock and keep it through the decision
- Acquire several resources in a consistent order
- Decide what waiting and skipping mean for the application
- Check the protocol with two sessions and an all-writers argument

<a id="a19"></a>
## a19 · Reading and testing isolation guarantees

Introduced by [a03](#a03), under **Stronger isolation can reject a result instead of waiting**.

Teach relational practitioners to turn an engine's documented isolation contract and reproducible concurrent sessions into a justified choice of protection and abort handling. Reuse a reservation invariant to trace snapshot visibility, locking reads and concurrent changes, then introduce a staffing invariant only to expose a distinct multirow dependency. Compare PostgreSQL and MySQL InnoDB only where a verified difference changes the application decision. Distinguish snapshot isolation, serialisability and real-time ordering. Label illustrative schedules separately from observed runs; record engine version, settings, observations and the limited conclusions each run supports. Link to the locking article for protocol construction and to application integration for retry machinery. Stop at the implementation depth needed to use relational transactions correctly.

- Turn an isolation name into a contract
- Establish when the transaction sees a change
- Read and update can consult different states
- A consistent snapshot can still permit an invalid combination
- Serialisability protects an outcome by ordering or rejection
- A serial order does not establish a real-time order
- Build a repeatable check and state what it proves

<a id="a04"></a>
## a04 · Building applications around a relational database

Introduced by [a00](#a00), under **The application is part of the database system**.

Follow an application request through its driver, connection, statements and transaction to the response and any external effects. Teach how to preserve values and authority at those boundaries, understand the SQL an abstraction performs, bound resource use and recover from failures with evidence about what completed. Build on the transaction article's correctness guarantees; deepen connection management, query composition, request recovery and external work only where their separate decisions need it.

- Follow one request across the boundaries
- Preserve values and authority when sending SQL
  - Bind values and check their round trip
  - Keep untrusted input out of SQL structure
  - Give each application action the authority it needs
- Borrow a connection for bounded work
  ↳ Deeper article: [Managing connections and transaction lifetimes](#a20).
- Make the abstraction's database work visible
  ↳ Deeper article: [Controlling the queries your application performs](#a21).
- Recover according to what the application knows
  ↳ Deeper article: [Recovering database requests safely](#a22).
- Make work beyond the transaction recoverable
  ↳ Deeper article: [Connecting transactions to background work and events](#a23).
- Test the complete application path

<a id="a20"></a>
## a20 · Managing connections and transaction lifetimes

Introduced by [a04](#a04), under **Borrow a connection for bounded work**.

Teach how to own a stateful database connection from acquisition to safe reuse or disposal, including exceptions, cancellation, streaming and shutdown. Separate application handles, pool leases, transactions and database sessions; verify their relationship against the chosen driver and any proxy. Diagnose occupied pools using acquisition wait, lease duration, active database work and connection counts, then bound admission and aggregate connection demand. Extend the parent's ordinary request example through resource failures rather than repeating it. Own cancellation and connection-reuse mechanics here; link to request recovery for deadlines, idempotency and decisions about uncertain operation outcomes, to transactions for correctness guarantees and to performance and operations for workload capacity and service budgets.

- Know what a borrowed handle owns
- Return only a connection that is ready for another borrower
  - Cancellation is a cleanup sequence
- Match session state to the pooling mode
- Keep result consumption inside the resource lifetime
- Bound demand before enlarging the pool
- Find where the lease time goes
- Prove cleanup across failures and shutdown

<a id="a21"></a>
## a21 · Controlling the queries your application performs

Introduced by [a04](#a04), under **Make the abstraction's database work visible**.

Make handwritten SQL, query builders and ORM operations accountable for the database work a request performs. Use one bounded order-list example to trace statements, round trips, returned rows and materialised objects; diagnose lazy loading, N+1 reads, joined collection multiplication and implicit writes. Choose projections, loading strategies and batch sizes that preserve the required result while bounding application work. Inspect pagination and streaming at the abstraction boundary, preserve binding and authorisation during composition, and test representative query and result bounds against the selected database and library. Build on the parent's ordinary request and security explanation; leave SQL semantics, physical execution tuning, connection cleanup and request recovery with their existing owners.

- Trace one request to its actual statements
- Find the reads hidden behind object access
- Choose a loading shape for the response
  - See what joined collections multiply
  - Bound separate loads and batches
- Keep pages and streams bounded through materialisation
- Inspect the writes and transactions an abstraction introduces
- Preserve binding and authority as queries are composed
- Test the generated work as part of the operation's contract

<a id="a22"></a>
## a22 · Recovering database requests safely

Introduced by [a04](#a04), under **Recover according to what the application knows**.

Design a bounded application request across pool acquisition, statements, transaction completion and response delivery. Decide what may be repeated from evidence about the database outcome, then give a logical operation a durable identity so overlapping attempts and lost responses can be resolved safely. Keep deadline budgets, retry eligibility, idempotency records and reconciliation within one operation contract. Build on the transaction branch's guarantees; link connection cleanup mechanics and external-effect recovery to their owners.

- Separate the request from the operation
- Spend one deadline across the whole request
  - Establish what each timeout actually limits
  - Keep retries inside the remaining budget
- Choose the next action from outcome evidence
  - Repeat the complete logical transaction when required
- Make the operation identity part of the data contract
  - Define the key and the request it identifies
  - Commit the claim, business change and result together
  - Return a retained result and define its lifetime
- Resolve an outcome that the caller did not receive
- Test the failure windows around commit

<a id="a23"></a>
## a23 · Connecting transactions to background work and events

Introduced by [a04](#a04), under **Make work beyond the transaction recoverable**.

Make work beyond a relational transaction discoverable and recoverable. Follow one committed order and its external fulfilment request through a transactional job or outbox record, worker ownership, repeated attempts and uncertain external outcomes. Compare direct calls and database change capture by their remaining failure windows. Bound event contracts, ordering, retention and replay to what is needed to account for committed intent; reuse transaction concurrency and request-idempotency mechanisms rather than deriving them again.

- Find the gap between committing and doing the work
- Commit the business change and the intent together
- Claim work without keeping a transaction open during the call
- Make repeated attempts refer to the same operation
- Give published records a meaning that survives delay
- Compare polling with database change capture
- Recover the unfinished order from retained evidence

<a id="a05"></a>
## a05 · Understanding and improving database performance

Introduced by [a00](#a00), under **Correct SQL still has to do physical work**.

Teach a repeatable method for diagnosing relational workloads and making measured improvements. Build the necessary understanding of row and index storage, buffering, version retention, access paths, join methods, sorting, aggregation, statistics and optimiser choices. Read estimated and observed plans without confusing their units or treating estimates as execution evidence. Connect query shape, indexes, physical layout, maintenance and resource contention to workload latency, throughput and capacity. Choose and validate changes with representative data and concurrency, including write and operational costs; deepen engine internals only where they explain a diagnosis or intervention. Give the parent a complete ordinary diagnosis-to-measured-improvement loop. Tell readers to finish this article, including its concluding comparison method, before selecting an optional contextual investigation by the question their evidence raises.

- Start with the work people need to finish
- Find where time and work accumulate
- Rows have a physical home and a lifetime
  ↳ Deeper article: [How stored rows become physical work](#a24).
- Give the query a useful route to its rows
  ↳ Deeper article: [Choosing indexes for a workload](#a25).
- Explain the work and test a plan hypothesis
  ↳ Deeper article: [Diagnosing a query from its execution plan](#a26).
- A faster query can still make the workload slower
  ↳ Deeper article: [Improving performance under concurrent load](#a28).
- Change one explanation into a measured improvement

<a id="a24"></a>
## a24 · How stored rows become physical work

Introduced by [a05](#a05), under **Rows have a physical home and a lifetime**.

Teach the physical model needed to explain page traffic, cache pressure and unreclaimed space in relational workloads. Follow one changing table through reads, wider rows, updates, retained versions and space reuse, connecting each mechanism to evidence and a possible intervention. Use selected PostgreSQL and InnoDB differences only when they change that diagnosis; verify the chosen version's behaviour against primary documentation. Keep row locators here only far enough to understand physical locality; the index article owns traversal, key order, coverage and the detailed secondary-index/base-row access path. Treat physical pruning as one measurable layout intervention. Link transaction semantics and operational reorganisation procedures to their owners, and use the parent's comparison method rather than teaching benchmarking again. Stop at the depth needed for relational engineering decisions, without a separate storage-engine or partitioning curriculum.

- A row request becomes page work
- Where a row lives determines locality
- The working set includes more than the returned columns
- Updates leave work behind them
- Decide whether layout and cleanup explain the cost
  - Reorganisation exchanges future work for immediate work
- Partitioning helps only when it removes relevant work
- Choose a physical change from its measured effect

<a id="a25"></a>
## a25 · Choosing indexes for a workload

Introduced by [a05](#a05), under **Give the query a useful route to its rows**.

At the opening, require completion of Understanding and improving database performance, including its concluding Change one explanation into a measured improvement as the common comparison method used here. Derive index candidates from the work a relational workload needs, explain how their keys limit and order access, and decide whether their read benefit earns their write, space and operating costs. Use one tenant order-history workload with equality filters, a date range, an ordered first page and a related-row lookup. Extend it only when another query exposes a consequential trade-off. Own B-tree traversal, composite key order, coverage, base-row access and index eligibility. Supply a compact local reporting legend before using observed index evidence; no sibling article is a prerequisite. Offer Diagnosing a query from its execution plan for deeper evidence reading and plan-choice diagnosis. Link physical storage and safe schema changes to their owners. Keep the depth at choosing and evaluating relational indexes, without an index-family catalogue or another benchmarking curriculum.

- Start with the queries the workload must serve
- Follow a B-tree from key to row
- Put composite keys in the order the query can use
  - Join lookups and several query shapes compete for key order
  - Ordering and grouping can change the useful route
- Decide which row visits are worth avoiding
- Check that the query is eligible to use the index
  - Index a subset or an expression when that removes real work
  - Change index family only for an access need B-trees do not meet
- Count the obligations created by each candidate
- Keep the candidate only if its benefit survives the workload

<a id="a26"></a>
## a26 · Diagnosing a query from its execution plan

Introduced by [a05](#a05), under **Explain the work and test a plan hypothesis**.

Complete one ordinary slow-query investigation in PostgreSQL: collect safe evidence, follow physical rows and repeated work, interpret reporting units, explain a consequential estimate error, test a targeted remedy and accept it against the workload. Use the same reporting query throughout, including common and rare prepared parameters, so statistics and plan choice resolve the original diagnosis rather than begin another tour. Record the concrete engine version and verify its behaviour against primary documentation. Distinguish captured evidence from illustrative arithmetic and explain what each observation cannot establish. Keep uncommon nodes, parallel variants and planner controls conditional and compact. Link index design, storage mechanisms, concurrent-load diagnosis and the parent's comparison method to their owners; do not expand into optimiser or storage-engine specialism. No further article is required to finish this task.

- Collect evidence for the slow report safely
- Follow where the report spends its work
- Interpret counts, costs and timings before blaming a node
- Locate the first error that could change the choice
- Check the statistics behind that prediction
- Check the application's common and rare parameters
- Verify the remedy and close the investigation

<a id="a28"></a>
## a28 · Improving performance under concurrent load

Introduced by [a05](#a05), under **A faster query can still make the workload slower**.

Diagnose why a relational workload slows as concurrent demand grows, and choose changes that improve useful completed work and tail latency. Distinguish the work of an individual execution from queuing and competition for resources. Use one mixed workload and selected engine evidence to connect demand, outstanding work, resource pressure and serial bottlenecks to an intervention. Reuse the parent's common comparison method and the storage, plan, transaction and application-integration explanations. Keep pool implementation, service budgets, provisioning procedures and recovery with their existing owners.

- Locate where the extra time appears
- Count arrivals, completions and outstanding work together
  - An average relationship needs a stable population
  - A waiting client can hide demand
- Find what the concurrent executions are competing for
  - CPU, memory and storage pressure
  - A hot row can limit a mostly idle database
  - Background work and old transactions change the competition
- Match the intervention to the limiting resource
  - Bound the work in progress
  - Reduce work and shorten serial sections
  - Reconsider parallel work and targeted resources
- Test the proposed limit without hiding the overload

<a id="a06"></a>
## a06 · Changing a live database

Introduced by [a00](#a00), under **Data and applications change at different speeds**.

Teach engineers to change schemas, stored data and database locations while applications continue to run. Use a change to an order system to connect application compatibility, physical database work, concurrent writes, verification and recovery. Give every change an explicit sequence, measurable completion conditions and a safe response to interruption. Introduce deeper procedures for schema changes, data jobs and database moves only where they enable reliable relational practice. Treat retention and deletion as changes to the guarantees readers and recovery procedures can rely on. Check concrete procedures against the selected engine, version and deployment.

- A change has more than one finish line
- Keep old and new applications compatible
- Find out what the database must do
  ↳ Deeper article: [Changing schemas without breaking applications](#a29).
- Move existing data while writes continue
  ↳ Deeper article: [Running reliable data changes](#a30).
- Switch traffic only when the destination is ready
  ↳ Deeper article: [Moving databases with a controlled cutover](#a31).
- Plan recovery before the first irreversible step
- Retire old data and prove the change is finished

<a id="a29"></a>
## a29 · Changing schemas without breaking applications

Introduced by [a06](#a06), under **Find out what the database must do**.

Turn an intended schema change into an executable, interruptible procedure with measured limits on production impact. Use PostgreSQL 18 as the worked engine, pinning the exact server and migration-tool versions before writing runnable examples. Reuse the parent's application-compatibility sequence and concentrate on locks, queued work, scans, rewrites, dependencies and deployment restrictions. Develop staged constraint validation and a large column-type change, then use a compact operation table to cover related column, index and table changes. Give every stage preconditions, transaction boundaries, completion evidence and a response to failure. Link the data-job and operations owners for their procedures; do not create a separate article for each DDL command or engine.

- Describe the physical change before scheduling it
- Keep a waiting schema change from stopping the workload
- Make the migration runner's boundaries visible
- Enforce new writes before validating old rows
- Build a required index through failure and completion
- Change a large representation in recoverable stages
- Rehearse the production impact and set stop conditions
- Close the change with evidence and deliberate cleanup

<a id="a30"></a>
## a30 · Running reliable data changes

Introduced by [a06](#a06), under **Move existing data while writes continue**.

Teach resumable, idempotent data jobs through one backfill that converts the order system's delivery address into a structured representation while orders continue to change. Develop an explicit input contract, complete work coverage, protection against stale writes, atomic progress and recovery after an uncertain batch outcome. Bound the effect on the live workload and reconcile meaning as well as row coverage. Contrast external imports and production corrections only where their input, duplicate or recovery contracts change the procedure. Reuse the parent's application compatibility argument and link transaction guarantees, request retries and operational diagnosis rather than teach them again. Verify executable procedures against the selected engine and version.

- Define what each changed row must mean
- Define a set of work that can actually be finished
- Stop the backfill from overwriting a newer address
- Commit the batch and its progress together
- Account for everything a row change can trigger
- Keep each batch inside the workload budget
- Adapt the input contract for imports and corrections
- Prove completion before removing the machinery

<a id="a31"></a>
## a31 · Moving databases with a controlled cutover

Introduced by [a06](#a06), under **Switch traffic only when the destination is ready**.

Teach one controlled move of an order database from a source to a destination, following the copy, intervening changes and transfer of write authority. Choose between a rehearsed write pause and a copy with change capture using the allowed outage and measured transfer time. Establish compatibility, a consistent starting state and an explicit final change boundary; prove that the destination meets them before admitting writes. Define abort conditions and explain how destination writes change the route back. Reuse the parent article's application compatibility method and the operations branch's replication and recovery evidence. Verify concrete commands and guarantees against the selected engine, version, deployment and migration tool; do not build an engine-pair migration catalogue.

- Choose the simplest move that fits the write pause
- Prove that the destination preserves the workload's meaning
- Join the starting copy to every later change
- Rehearse the destination and reconcile the copied state
- Fence writers and prove the final boundary has arrived
- Admit destination traffic with a defined way to stop
- Close the move with evidence

<a id="a07"></a>
## a07 · Running a relational service

Introduced by [a00](#a00), under **Operate for the failure you must recover from**.

Teach practitioners to secure, observe, maintain, scale and recover a relational service against explicit availability, data-loss and recovery requirements. Connect those requirements to access boundaries, service signals, capacity, maintenance, topology, backup and incident procedures. Give readers the working model needed to choose a safe next action, with contextual articles developing the procedures and implementation differences. Distinguish self-managed duties from managed service contracts. Keep query tuning, application retry logic and live schema changes in their neighbouring branches, and the separate distributed-systems programme outside this branch.

- Define what the service must survive
  - Assign every operating responsibility
- Limit who can reach and change the data
  ↳ Deeper article: [Securing a relational service](#a35).
- Observe the service before it reaches a limit
  ↳ Deeper article: [Monitoring and sizing a relational service](#a36).
- Make routine maintenance a controlled change
  ↳ Deeper article: [Maintaining and upgrading a relational service](#a37).
- Choose where reads and writes can safely run
  ↳ Deeper article: [Operating replicas and partitioned data](#a38).
- Prove that the data can be restored
  ↳ Deeper article: [Backing up and restoring relational data](#a39).
- Recover the incident without destroying the evidence

<a id="a35"></a>
## a35 · Securing a relational service

Introduced by [a07](#a07), under **Limit who can reach and change the data**.

Teach how to build and verify operational access boundaries around a relational database, using one service's application, migration, reporting, backup and emergency access tasks. Connect network reachability, identity, privileges, ownership, encryption and audit evidence to what each actor can actually do. Develop safe rotation, revocation and compromise response with selected-engine checks and explicit managed-service responsibilities. Keep application query safety and application authorisation in integration, restoration procedures in backups, and the common incident decision method in service operations. Follow the parent-first reading route through Running a relational service; readers entering here directly should read its section Recover the incident without destroying the evidence before this article's final compromise exercise. This article supplies the operational security depth needed for relational practice; it does not open a general security architecture branch.

- Turn access needs into testable boundaries
- Admit only the intended connections
- Give each job the authority it needs
- Protect connections, copies and the keys that unlock them
- Change credentials without losing control of access
- Prove permitted work succeeds and forbidden work fails
- Leave useful evidence and a controlled emergency route
- Revoke compromised access and verify the boundary again

<a id="a36"></a>
## a36 · Monitoring and sizing a relational service

Introduced by [a07](#a07), under **Observe the service before it reaches a limit**.

Teach practitioners to establish deployment visibility, maintain capacity and growth budgets, reserve normal and degraded headroom, and act on useful alerts before a service reaches a limit. Produce a dashboard, an evidence-routing table and capacity worksheets tied to service objectives and intervention lead times. Reuse the workload measurement and load evidence from Improving performance under concurrent load (a28), the sole owner of deep concurrent-workload diagnosis. Link to the owning maintenance, topology and restoration procedures for their operational evidence and actions.

- Build the dashboard the deployment can support
  - Apply the workload measures to one service view
- Route a changed signal with its evidence
- Forecast space and the time left to act
  - Include retained and temporary allocations
  - Compare growth with intervention lead time
- Reserve capacity for normal and degraded operation
  - Accept the budget against existing evidence
- Turn capacity and service alerts into owned action

<a id="a37"></a>
## a37 · Maintaining and upgrading a relational service

Introduced by [a07](#a07), under **Make routine maintenance a controlled change**.

Teach practitioners to keep a relational service healthy and change its engine version through controlled, observable work. Connect required upkeep to the workload and engine mechanisms that create it; distinguish automatic work, operator intervention and managed-service duties. Build a maintenance and upgrade procedure with explicit resource and interruption budgets, compatibility checks, recovery choices and validation. Use a worked service example and current primary engine documentation for concrete procedures. Link to performance for storage and query mechanisms, to operations neighbours for monitoring, topology and restoration, and to live database changes for schema migration or database moves. Keep this as one practical article.

- Identify the work the service keeps creating
- Diagnose upkeep before choosing a command
  - Clean up versions that are no longer needed
  - Keep planner statistics useful
  - Account for retained logs
  - Decide whether storage or indexes need intervention
- Fit maintenance within the service budget
- Establish an upgrade path before choosing a date
- Rehearse the upgrade and the way back
- Execute with explicit gates
- Prove completion and update the next run

<a id="a38"></a>
## a38 · Operating replicas and partitioned data

Introduced by [a07](#a07), under **Choose where reads and writes can safely run**.

Choose and operate a relational topology against explicit availability, data-loss, recovery and read-freshness requirements. Follow changes from the writer to a replica, distinguish acknowledgement from replay and usable reads, then practise safe promotion, exclusion of the former writer, reconnection and rejoining. Decide whether local table partitioning preserves the schema and earns its continuing lifecycle cost, then distinguish it from distributing database ownership and assess the routing, transaction, movement and recovery costs of the latter. Use selected-engine and managed-service contracts and bounded failure rehearsals to establish what the deployment can actually deliver. Keep consensus theory, query tuning, application retry mechanics and backup restoration with their owners.

- Turn service requirements into a placement decision
- Follow a committed change to a replica
  - Decide what an acknowledgement promises
  - Keep the stream able to catch up
- Send each read to a copy that can answer it
- Replace a writer without leaving two authorities
  - Reconnect clients and establish the result
  - Rejoin or replace the former member
- Choose between local partitions and distributed ownership
  - Choose a key and trace work across owners
  - Move ownership and retain a recovery path
- Check the actual hosting and distribution contract
- Rehearse the failures that determine the choice

<a id="a39"></a>
## a39 · Backing up and restoring relational data

Introduced by [a07](#a07), under **Prove that the data can be restored**.

Teach relational practitioners to choose recovery copies for named loss cases and prove that they can restore correct data within the required time and loss bounds. Follow one accidental-deletion case from backup selection through an isolated restoration and a controlled return to service, contrasting complete service loss where the procedure changes. Develop consistency, dependencies, retention, independent access, full and point-in-time restoration, selective recovery and measured validation. This is the shared restore procedure used by incidents, database moves and adoption checks; leave incident command, replica promotion, application reconciliation mechanics and migration design to their owners. Check executable procedures against the selected engine and service, and distinguish rehearsed results from intended recovery.

- Start with the loss you must recover from
- Choose the copy that can reconstruct the required state
  - Logical exports preserve a selected representation
  - Physical backups and snapshots need an engine contract
  - Point-in-time recovery needs a complete history
- Keep recovery possible after production fails
- Rehearse a full restore in isolation
- Recover to the last acceptable state
- Decide between replacing the database and repairing selected data
- Prove readiness before returning traffic

<a id="a08"></a>
## a08 · Choosing a relational database

Introduced by [a00](#a00), under **Choose a system by testing the contract you need**.

Teach how to select and validate a relational engine and deployment for a concrete application. Turn workload, correctness, latency, availability, locality, operational capacity and total cost into explicit requirements and rejection tests. Compare representative embedded, server and distributed relational choices through the mechanisms that change those tests, including managed service restrictions and responsibilities. Finish with a realistic evaluation and a documented adoption decision. Use neighbouring storage families only to establish suitability; use conditional implementation follow-ups to check a candidate's actual contract. SQLite and CockroachDB are alternative adoption routes, not a required sequence; common disposable PostgreSQL practice starts in Working with SQL before this selection evaluation is complete. Keep the PostgreSQL candidate record here.

- Begin with the application's promises
- Establish whether a relational system fits
- Choose the process and failure boundary
  - When the database lives with the application
    ↳ Deeper article: [Checking an embedded choice with SQLite](#a32).
  - When applications share a database service
  - When data and writes must span machines or regions
    ↳ Deeper article: [Checking a distributed choice with CockroachDB](#a34).
- Compare the deployment contract and its full cost
- Test the candidates against the same application
- Make the choice reversible enough to live with

<a id="a32"></a>
## a32 · Checking an embedded choice with SQLite

Introduced by [a08](#a08), under **When the database lives with the application**.

Decide whether SQLite can meet one application's relational requirements in its intended deployment. Trace file ownership, connections and transactions to writer contention, durability and recovery obligations; verify the actual library, driver and settings with small acceptance cases. Produce a defensible adoption decision and starting configuration. Reuse the common transaction, integration, performance and operations methods rather than teach them again; this is an optional candidate check, not a SQLite internals curriculum.

- Put the database file in the deployment diagram
  - Verify the library the application actually loads
  - Check the storage and access boundary
- Observe two connections competing for a write
  - Choose when a transaction asks to write
  - Keep reader and writer lifetimes visible
- Choose a journal and durability contract
  - State what a successful commit must survive
- Prove the application's data contract on SQLite
  - Check representations at the driver boundary
- Rehearse a recoverable deployment
  - Verify restarts, upgrades and interrupted work
- Make the adoption decision from acceptance evidence

<a id="a34"></a>
## a34 · Checking a distributed choice with CockroachDB

Introduced by [a08](#a08), under **When data and writes must span machines or regions**.

Decide whether a specific CockroachDB version and deployment meet an application's distributed relational requirements. Follow one regional order-reservation workload from its placement and transaction boundaries through compatibility, latency, contention and failure tests to a documented adoption or rejection. Establish a minimal topology and starting configuration, dated version and service-tier evidence, and the resource, network and operating cost of meeting the requirements. Reuse common transaction, application integration, evolution, performance and operations methods; explain distributed mechanisms only far enough to predict or interpret acceptance results. Illustrative traces explain hypotheses; only observed tests establish acceptance, and untested claims remain explicit gaps.

- Name the requirement that needs distribution
- Turn the requirements into a minimal topology
  - Place each transaction's data and work
- Check the application's actual SQL contract
- Make the client contract survive coordination failures
- Measure locality and contention with production-shaped work
- Prove the named failures and recovery path
- Decide whether the measured contract is worth its cost
