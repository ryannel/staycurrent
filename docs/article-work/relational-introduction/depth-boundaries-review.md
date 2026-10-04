# Relational introduction: depth and onward reading

4 October 2026. Independent learning-design and practitioner review of
`src/pages/learn/databases/relational.astro`, its two teaching components, the
collection plan, and the full proposed tree and synthesis dated 4 October. I also
read the available checkout draft and inspected the page inventory. I did not read
the other current introduction reviews. This is a source-level boundary review,
not a rendered-page, factual-source, or publication acceptance check.

The introduction has the right broad scope. It should teach enough that a reader
can explain what each capability contributes to one application, then stop before
teaching implementation or operational technique. Its strongest passages already
make those connections: shared records change the work of correcting information;
the price paid belongs to a purchase; atomicity does not settle competing purchases.
The missing query result and the compressed onward map make those connections less
complete than they should be. Adding all 35 proposed destinations does not require
35 new explanations in the introduction.

## What the introduction must finish

| Location | Understanding the introduction owns | Where deeper teaching starts |
| --- | --- | --- |
| Opening | The database is software an application uses to keep, retrieve, and change shared records; tables describe those records. | Connection pools, drivers, request tracing, deployment setup. |
| Tables, rows, and columns | Read a small table; distinguish a record from its fields; understand schema, value types, and stable identity. Know that the visible table is not a drawing of its disk layout. | Modelling choices, precision and time examples, pages and buffers, particular storage designs. |
| Relationships | Follow a reference from an order to its customer or product; see why shared facts need only one correction; distinguish shared current facts from purchase history. | Cardinality design, normal forms, deliberate duplication, embedded values. |
| Queries and joins | State a question, match the relevant IDs, and recognise the resulting rows. Understand that a query describes the answer while a plan describes the work. | SQL fluency, missing matches, duplicate rows, aggregation, planning decisions and join algorithms. |
| Indexes | Understand that an additional arrangement can avoid reading unrelated records, that its usefulness depends on the question, and that maintaining it costs writes and space. | Tree mechanics, composite order, covering indexes, interpreting a plan and measuring a candidate. |
| Constraints | Explain one rejected invalid write and why every writer meets the same declared rule. Distinguish a reference from an enforced reference. | Constraint design, missing-value behaviour, deletion actions, cross-row invariants and product exceptions. |
| Transactions | Explain why related changes must all succeed or all be discarded, and identify the database boundary. Introduce the need for committed data to survive the stated failure conditions. | Choosing transaction scope, log ordering, recovery algorithms, configuration promises. |
| Concurrent access | Explain why two individually sensible requests can conflict; distinguish grouping changes from coordinating overlapping decisions; recognise waiting, row versions, and rejected work as different responses. | Safe statements, isolation cases, deadlocks, retries, ambiguous outcomes and external effects. |
| Fit and remaining choices | Connect related records, flexible questions, and correctness needs to useful workloads. Recognise storage, deployment, engine, and operating work as further choices. | Product evaluation, migration practice, diagnostics, access design, restoration, specialised workloads. |

The first paragraph can include a short application-to-database exchange: the
application sends a request, and the engine performs the read or change and returns
an answer. That grounds the later terms “caller”, “request”, and “connection” without
requiring a client/server architecture lesson; SQLite remains compatible with it.

## Findings and repairs

| ID | Location | Consequence and evidence | Severity | Repair and verification |
| --- | --- | --- | --- | --- |
| D1 | Queries and joins, current lines 40–42 | The prose says IDs match but never shows the result. Neither imported component supplies a query result. A newcomer must infer how separate stored records become a useful answer. The collection brief explicitly asks to show enough of a result. | Material comprehension gap | Use the existing O12/P7/Blue mug/quantity 2 records to state the question and show its one-row result. Explain the matching and selected fields in prose. SQL is optional. Ask a fresh reader which name would appear after changing the product name and why. |
| D2 | Concurrent access, current lines 69–72 | A stale-read race is followed by a write lock that makes another writer wait. Without a connecting limit, a reader could infer that waiting before the final write repairs a decision made from an earlier read. The checkout draft explicitly demonstrates that it does not. | Material comprehension risk | Add one short consequence: waiting to write does not itself refresh a decision already made; the check and change must be coordinated. The deeper article owns the guarded-update and locking implementations. Verify that a reader distinguishes “waited” from “checked again”. |
| D3 | Where to go next, current lines 83–87 | The map names six broad subjects and hides constraints, query meaning, transaction scope, recovery, retries, lifecycle, and many other intended destinations. It cannot expose the boundaries the user has asked to inspect. | Material to this request | Show all eight groups and 35 leaves, each with an outcome and an explicit planned status. Keep available drafts separately recognisable. Use section links into that map so the relationship between introductory teaching and planned depth is visible. |
| D4 | Transactions and fit, current lines 60–80 | Commit is explained as accepting changes together; no passage explains the basic persistence expectation or distinguishes it from recovery after losing storage. This leaves commit/recovery and backup destinations disconnected from the account of what the database does. | Important depth repair | Add two or three sentences about retaining committed work through the failures covered by the chosen setup, with a link to commit/recovery. State briefly that restoration after larger losses needs recovery planning. Leave WAL, checkpoints, replica protocols and restore procedure to their owners. |
| D5 | Tables line 26; constraints line 56 | Pages, caching, and two SQLite declaration exceptions receive space before a query answer has been demonstrated. Their detail makes the generic introduction uneven. | Optional flow improvement | Keep the logical/physical distinction in the main flow. Move pages/caching to the storage destination note if space is needed. Keep a concise warning that enforcement must be checked, with the exact SQLite exceptions in a note or further reading. Preserve technical qualifications when relocating them. |
| D6 | Fit line 78 and onward map | Schema evolution, reporting, and contention are named, but routine operation, recovery, access, and retention have no entry context. Teaching each would overfill the introduction; omitting them from the map hides part of using a database. | Important navigation repair | Add one short passage that keeping a database in service includes managing access, changes, maintenance and recovery. Link to the operating group. The map can carry the separate questions without new tutorial sections. |

Keep the existing sequence: explanation of the family, visible data, relationships,
query meaning, access work, correctness, overlapping work, fit. The later correction
to the brief supersedes an order-lifecycle narrative as the organising structure.
Reusing a few records across small examples helps continuity without turning the
whole page back into a checkout walkthrough.

## Full destination map

The proposed fragment names below are for a complete reading map on the introduction,
not claims that these article routes already exist. They give section-level links a
working destination while the articles remain planned. The full original tree is
retained; descriptions apply the synthesis's narrower outcomes. Where a leaf remains
too broad, the note identifies the split in its commission rather than inventing
additional articles.

| Group and proposed destination | Link from | What that destination owns beyond the introduction |
| --- | --- | --- |
| **Designing your data** | Tables and relationships | |
| Turning application data into tables — `#planned-data-tables` | Tables; relationships | Choose identities and relationships for a concrete application, including cardinality and the meaning of values: types, precision, units, and time. |
| Normalisation and deliberate duplication — `#planned-normalisation` | Relationships | Trace an update problem, separate a shared fact from a historical snapshot, and justify a deliberate copy. |
| Keeping invalid data out — `#planned-constraints` | Constraints | Translate actual rules into declarations, handle missing values, and show which rules need coordination or application logic. |
| Tables, documents, or both? — `#planned-tables-documents` | Relationships; fit | Choose an embedded or referenced boundary for a particular record and its update/query patterns. |
| **How the database works** | Logical/physical distinction; query plan; transactions | |
| How records are stored and retrieved — `#planned-storage` | Tables | Trace a read through an explicitly identified row layout, pages and memory; expose the access work. |
| How indexes work — `#planned-index-mechanism` | Indexes | Follow a lookup and the corresponding maintenance through a concrete search structure. |
| From SQL to an execution plan — `#planned-query-plan` | Queries | Explain why one correct query can have several execution strategies and how an engine chooses and executes one. |
| How joins work — `#planned-join-mechanisms` | Queries | Compare ways to produce an already-understood join result and the work each needs. |
| What happens when a write commits? — `#planned-commit` | Transactions | Follow changes in memory, logging and durable storage through an identified crash promise; separate an accepted change from acknowledgement received. |
| **Querying and indexing** | Queries and indexes | |
| Writing queries whose results you understand — `#planned-query-results` | Queries | Work through a concrete surprising result, including matches, duplicates, missing values and relevant aggregation. This is query meaning, not an algorithm survey. |
| Choosing indexes for your queries — `#planned-index-choice` | Indexes | Select access paths for predicates and ordering, explain column order and coverage where needed, then check the tradeoff. |
| Working through large result sets — `#planned-large-results` | Queries | Establish ordering and pagination/batching behaviour while the underlying data changes. |
| Reporting on operational data — `#planned-reporting` | Queries; fit | Compare direct aggregation and precomputed answers, including freshness and competition with everyday requests. |
| **Transactions and concurrent work** | Transactions and concurrent access | |
| What belongs in one transaction? — `#planned-transaction-boundaries` | Transactions | Choose a boundary around an invariant and show which effects it covers; connect separately managed effects to retry design. |
| When two requests change the same data — `#planned-concurrent-changes` | Concurrent access | Trace a race and repair it with a stated coordination strategy; show what the application must check. |
| What can a transaction see? — `#planned-isolation` | Concurrent access | Predict observations under concrete isolation behaviour, separating a stable view from reserving data. |
| Waiting, deadlocks, and retries — `#planned-transaction-outcomes` | Concurrent access; transaction boundary | Handle blocked or rejected transactions and uncertain completion. Explicitly include retrying the whole decision, avoiding repeated effects, and external-service consequences. |
| **Understanding performance** | Query plan; indexes; concurrent access; fit | |
| Investigating a slow query — `#planned-slow-query` | Queries; indexes | Use an actual plan and measurements to separate estimates from work and locate why a query became slow. |
| Understanding the database work behind a request — `#planned-request-work` | Opening; queries | Trace ORM-generated statements, repeated reads, round trips, batching, connection use and transaction scope. |
| When the database is waiting — `#planned-diagnosing-waits` | Concurrent access; fit | Diagnose where time is spent waiting for connections, locks, storage or another resource. Hand off transaction response design to the outcomes article. |
| Testing a change before trusting it — `#planned-testing-changes` | Indexes; fit | Compare a proposed change under representative data and concurrent work, with meaningful measurements and regression checks. |
| **Running and evolving the database** | Fit; schema; transactions | |
| Changing a schema while the application runs — `#planned-schema-changes` | Tables; fit | Plan one change across coexisting application versions, data backfills and locking/index-creation concerns. |
| Keeping a database healthy over time — `#planned-maintenance` | Fit | Follow one concrete growth or maintenance problem through statistics, observations and intervention. Avoid an unbounded administrator handbook. |
| Backups you can actually recover from — `#planned-backups` | Transactions; operating passage | Test restoration against a stated loss and recovery objective. This is service recovery, beyond an engine's crash-recovery mechanism. |
| Replicas and failover — `#planned-replicas` | Fit; operating passage | Explain the distinct roles of another live copy, lag, promotion and recovery limits for a concrete service. |
| Controlling access and managing the data lifecycle — `#planned-access-lifecycle` | Fit; operating passage | Preserve two explicit outcomes: who may read/change which data; and how retention/deletion applies to copies. Separate their briefs before production if one article cannot answer both. |
| **Choosing products and recognising limits** | Fit | |
| PostgreSQL, MySQL, and SQL Server — `#planned-product-comparison` | Fit | Compare the same application needs, deployment and operating constraints using current, scoped evidence. This remains a direct entry for experienced readers. |
| When an embedded database fits — `#planned-embedded` | Fit | Decide where the engine should run and what that means for the application's deployment and concurrent work, using SQLite. |
| When should you add another system? — `#planned-another-system` | Fit | Compare improving the existing system against separating a concrete search, vector, document or analytical workload, including the cost of keeping copies current. |
| **Inside PostgreSQL** | Fit; optional implementation links | |
| PostgreSQL architecture — an overview — `#planned-postgres-architecture` | Fit | Give a coherent component map through a bounded read and write, with a payoff distinct from the query tour. |
| Following a query through PostgreSQL — `#planned-postgres-query` | Query plan | Inspect PostgreSQL's planner, executor, buffers and access paths. Merge or defer if it only repeats the architecture overview. |
| Row versions, transactions, and vacuum — `#planned-postgres-versions` | Concurrent access | Connect PostgreSQL visibility to old versions and their cleanup, including the consequence of long-running work. |
| Indexes in PostgreSQL — `#planned-postgres-indexes` | Indexes | Explain implementation-specific access methods and a concrete choice they enable; recap general principles briefly. |
| WAL, checkpoints, and recovery — `#planned-postgres-recovery` | Commit/recovery | Follow a PostgreSQL committed change through log persistence, checkpointing and crash recovery under stated settings. |
| Extending PostgreSQL — `#planned-postgres-extensions` | Fit | Evaluate one bounded capability, separating core, extension and service features and their operating consequences. |

## What currently exists

The only page nested under `src/pages/learn/databases/relational/` is
`checkout.astro`. Its available route is `/learn/databases/relational/checkout/`.
It is useful related reading for concurrent changes, but it also contains tables,
indexes, isolation, row versions and recovery. It is not evidence that those planned
articles are complete. Keep its current title and working-draft status visible;
link it as an available example beside the concurrent-changes destination rather
than marking that entire leaf finished.

`/explore/column-stores/` is available related reading for storage and reporting.
`/learn/databases/documents/` is related to tables versus embedded documents.
`/learn/databases/distributed-sql/` discusses a deployment/coordination direction.
Other database family drafts cover partitioning, caching, search, graphs and object
storage. None of those existing routes is a substitute for the planned relational
product comparison, operational guidance or PostgreSQL collection.

The user has specifically requested the full placeholder link structure, which
supersedes the plan's earlier restriction to available-reading links for this
reviewable draft. Make placeholders behave intentionally. A link to the proposed
on-page plan entry exposes a boundary without pretending an unwritten article is
available. If separate placeholder pages are chosen instead, each needs its own
title, planned status, bounded outcome and return path; do not create links that
silently return 404s or go to `#`.

Show three short routes before the full tree: learn the approach; choose a product;
investigate a problem. Keep the full tree visible or readily expandable below them.
Its hierarchy organises questions and must not imply that storage mechanics are a
prerequisite for writing a first query. Section endings should point to one or two
most relevant planned entries; the full map carries the remaining destinations.

## Boundaries to preserve in commissioning

Query results explain which rows belong in the answer. Join mechanics explain the
work used to produce those rows. Query planning explains how those operations are
selected and arranged. Slow-query diagnosis uses evidence from one execution to
find a problem. These can share a small example without sharing their main argument.

Index mechanics explain how read work is avoided and maintenance is introduced.
Index choice makes a workload-specific decision. PostgreSQL indexing adds facts
about that implementation. Keep all three destinations visible; decide whether the
first two need separate pages when their examples exist.

Transaction boundaries group related changes. Concurrent-change teaching repairs
an interaction. Isolation predicts observations. Transaction outcomes explain the
application's response. Wait diagnosis finds the resource causing a stall. Keeping
those outcomes explicit resolves the two ambiguous waiting titles in the old tree.

Commit recovery explains one engine's persistence promise. Backups establish a
restorable service after a stated loss. Replication and failover establish what a
live copy can do and what it cannot repair. The introduction needs the distinctions,
not the procedures. No part of this review activates the parked shared
distributed-systems programme.

Status: repair required for the requested depth-and-link pass. No article source
was changed. No build or browser check was run because this review only adds this
editorial record. The final page still needs review after repairs and navigation
implementation.

## Technical and boundary recheck after revision

4 October 2026. Rechecked the revised introduction, the complete collection
manifest, the reading-map and section-link components, and the planned-route
template. Used the Stay Current research skill for the primary-source checks below.
No other current review reports were read. No article source was edited.

The revised introduction resolves D1–D6 at source level. The O12/P7 example now
produces “Blue mug, 2” in the prose; an additional result table is not needed to
complete this small explanation. The lock passage protects the stock check and
explicitly rejects the inference that delaying a stale write repairs it. Durability
and operating responsibilities have concise introductions and clear onward homes.
Physical layout is separated from the visible tables, and SQLite exceptions have
moved out of the constraints explanation.

The map contains all 35 leaves in the original eight groups: 4 design, 5 internals,
4 querying/indexing, 4 transactions, 4 performance, 5 operations, 3 product-choice,
and 6 PostgreSQL entries. I checked every description and scope against the proposed
tree and its synthesis. No intended leaf has disappeared or been claimed as
finished. The two waiting titles now make their different outcomes clearer. The
access/lifecycle split and the possible PostgreSQL overview/query overlap remain
explicit commissioning decisions. Query results, join mechanisms, query execution,
and diagnosis have distinguishable jobs.

A read-only manifest check found 35 unique slugs, no missing title/description/scope
fields, no unresolved section-reading slugs, and no missing introduction anchors
used by the placeholder return links. The route template derives its paths from
that same manifest, including the six nested PostgreSQL slugs. The placeholder
notice plainly states that the article has not been written; the checkout draft is
identified as earlier candidate material. Actual built routes and browser navigation
were not exercised in this recheck.

### Changed claims and source conditions

All primary documentation below was opened on 4 October 2026 and refers to
PostgreSQL 18. These are documentation checks of prose illustrations, not executed
SQL examples or observed engine runs.

| Claim checked | Primary evidence and conditions | Result |
| --- | --- | --- |
| Locking the stock row before checking it can make the second buyer wait and then inspect the updated stock. | [Row-level locks, `FOR UPDATE`](https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS) describes blocking another locker/writer, holding the lock through transaction end, and returning the updated row after waiting. [Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED) establishes the default isolation level and updated-row behaviour. | Supported for the stated same-row purchase. Both buyers use a conflicting locking read in their transaction; the first updates the retained row and commits. The text appropriately identifies PostgreSQL's default behaviour instead of generalising across all engines or isolation levels. |
| Merely waiting before a write does not repair a decision already made from an earlier value. | [Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED) explains the wait and re-evaluation performed by the database command. It does not re-run preceding application decisions. | Supported inference. The distinction between a locking check and an earlier ordinary read is now explicit. The introduction need not add SQL or enumerate lock modes to teach this difference. |
| A rollback cancels the purchase's inserted rows and stock changes; a commit accepts the grouped changes. | [Transaction tutorial](https://www.postgresql.org/docs/18/tutorial-transactions.html), all-or-nothing explanation and `ROLLBACK` example. | Supported as the logical effect of the described table changes. “Removed” and “undone” describe the result, not a physical deletion or log algorithm. The scope does not claim reversal of sequence counters or separately executed external effects. |
| Durability concerns retention of committed work, with guarantees dependent on setup rather than protection from every loss. | [WAL introduction](https://www.postgresql.org/docs/18/wal-intro.html) explains recovery from persisted log records. [`synchronous_commit` and `fsync`](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT) show how configuration changes acknowledgement and failure behaviour. | Supported and appropriately qualified. The introduction does not promise that all engine settings preserve every acknowledged transaction. Recovery internals remain with the planned commit and PostgreSQL recovery articles. |
| An orders-by-customer index can find C4's orders without examining every unrelated order; index maintenance adds work, and a scan can still be preferable. | [Index introduction](https://www.postgresql.org/docs/18/indexes-intro.html), locating matching rows, planner choice, and maintenance overhead. | Supported. The prose distinguishes the indexed orders column from the customer table's primary key and does not claim automatic index creation from a foreign key. The yesterday-report contrast makes the access-pattern boundary clear. |

There are no remaining material technical or scope findings in the rechecked
revision. Two optional refinements can wait: name Read Committed alongside
“default transaction behaviour” if that helps readers follow the source; and add
short product-choice/diagnosis entry links before the map if navigation inspection
shows that the expandable group titles are insufficient. Neither is needed to
make the current explanation or the 35-leaf structure complete.

### Reviewed source hashes

SHA-256 at recheck:

```text
bf40789ffafedc38a603aae2ca74238e752f5f2f52c587203cd56fe71cccdd49  src/pages/learn/databases/relational.astro
88173ed3965a195cf39dbccca82d3eed894feb2c73ead380e29fa3935f2d56aa  src/lib/relational-collection.ts
7ffde1ce2c8086b7d60faa8885a60c91f3e4dd64b8c0e8943dbb8fd5fb180d2b  src/components/editorial/RelationalReadingMap.astro
b44e9a316e7bda0e0b9cbc942acece9256eeff1cfcb853a8ff99fe3526fb4d06  src/components/editorial/RelationalFurtherReading.astro
0bbd07b46d672e5ada601823dffde0d7b9debc3cdb51639378f91f478cf051af  src/pages/learn/databases/relational/[...article].astro
```

Disposition: the previous repair-required finding is resolved for this bounded
technical and coverage review. This is not whole-article acceptance: build, rendered
behaviour, and the independent comprehension review remain the coordinator's checks.
