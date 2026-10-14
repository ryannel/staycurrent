# Planning the relational collection

Working plan, revised 14 October 2026. This develops the
[coverage structure](content-structure.md) into reader journeys and bounded article
candidates. The design, querying and transaction sequences were subsequently
commissioned; the other branches remain planned coverage. Titles, groupings, and destinations can change
as the explanations develop.

## Revised article tree, 14 October 2026

This revision supersedes the flat 16-article proposal and the earlier 28-article
proposal. The reader clarified that a substantial deep dive can have subarticles.
The main article must deliver a coherent, useful understanding of its subject;
subarticles deepen a mechanism or develop a distinct task. They are optional next
reading, not missing chapters required to understand the main article.

The tree below contains **10 main deep dives, 13 subarticles and 4 operational
guides**. These are proposed article boundaries, not a production quota. Eight
destinations have existing draft material; nineteen are planned. All nine existing
draft leaves and twenty-five planned leaves have an explicit home. The first three main articles are now complete working drafts.

The site now implements this tree, including planned pages, parent–child navigation,
revised introduction links and redirects from combined topics. The first three
main deep dives have been expanded and independently reviewed. The labels below
preserve the commissioning decisions; completed work and its verification are
recorded in `docs/article-work/deep-dives-batch/` and the three article work folders.
The user authorised committing and pushing these stages to main on 14 October 2026.

### How to read this tree

- **Main — expand draft:** an existing article supplies the starting point, but the
  broader main explanation still needs to be written and reviewed.
- **Main — combine drafts:** existing articles supply material for a new connected
  explanation. Joining their text end to end would not complete the revision.
- **Subarticle — existing draft:** retain the article's useful purpose, then revise
  its introduction, overlap and onward links to fit beneath the main deep dive.
- **Planned:** no completed article exists for the proposed scope.

The first three main deep dives are the intended first writing batch. Subarticles
can be read directly by someone arriving with their particular question. Each has
one primary home, with cross-links wherever another journey needs it. Not every
main article needs children, and navigation groups need not become articles.

### 1. Designing your data

**Main — expand draft.** Build from `modelling` (Designing a relational schema).
Develop tables, identity, relationships, types, missing values, normalisation and
historical facts, then show how constraints protect that design and how columns,
related rows and JSON change it. The reader should be able to derive and defend a
healthy relational schema without first reading the children.

| Subarticle | Additional purpose | Existing material |
| --- | --- | --- |
| **Constraints in depth** | Work through enforcement behaviour, incomplete rules, cross-record limits and dependable alternatives in sustained examples | Existing `constraints` draft |
| **Tables and JSON** | Develop the representation choice through actual queries, validation and changes; finish the decision rather than merely enumerate advantages | Existing `tables-and-documents` draft |

Normalisation stays inside the main article. Do not recreate its former standalone
outline. The main article must actually teach constraints and representation
choices; the children earn their space through further depth and practice.

### 2. Querying your data

**Main — expand draft.** Build from `query-results` (Queries and joins). Develop
filters, joins, missing matches, aggregation and cardinality, then follow a concrete
answer through an execution plan. Explain enough scanning and join work to connect
what SQL asks for with how the engine could produce it.

| Subarticle | Additional purpose | Existing material |
| --- | --- | --- |
| **How a query runs** | Develop alternative scans and join strategies, sorting, aggregation, statistics and estimates through a traceable plan | Combine planned `query-execution` and `join-algorithms` |
| **Pagination and large results** | Choose ordering and continuation guarantees across requests while records change; compare offset, keyset and batching | Existing `large-results` draft |

The main explains both result meaning and a concrete execution. The execution
child teaches how strategies and estimates change the work. Pagination addresses
an application contract beyond producing a correct answer once.

### 3. Transactions and concurrency

**Main — combine drafts.** Rework `transaction-boundaries` and `concurrent-updates`
into one account of keeping related changes correct while requests overlap and
fail. Develop atomicity, transaction boundaries, conditional updates and locks;
explain snapshots and isolation well enough to distinguish visibility from protecting
a decision. Carry the example through rejection/retry and a possible lost commit
response, including the limits around external effects.

| Subarticle | Additional purpose | Existing material |
| --- | --- | --- |
| **Isolation and snapshots** | Work through visibility schedules, decisions spanning records and the guarantees different isolation choices provide | Existing `isolation` draft |
| **Handling conflicts and uncertain outcomes** | Develop recovery from waits, deadlocks, aborted attempts and unknown commit outcomes; operation identity, retry boundaries and outside effects | Existing `conflicts-and-retries` draft |

Failure handling is not postponed to the children. They provide more demanding
schedules and recovery scenarios after the main establishes the reasoning. The old
concurrent-updates article is absorbed into the main rather than retained as another
near-duplicate child.

### 4. Indexes

**Main — planned.** Combine `indexes` and `choosing-indexes`. Follow ordered search
structures through equality, ranges, composite keys, filtering, sorting and covering
access. Explain selectivity, table fetches, storage and write costs, index upkeep,
and checking a choice with a plan and representative workload.

No separate general index child is proposed. Mechanism, selection and verification
complete one subject. Specialised PostgreSQL methods have a deeper implementation
home under Inside PostgreSQL, linked from here.

### 5. Storage and durability

**Main — planned.** Combine `storage` and `commit-and-recovery`. Follow records
through physical arrangement, pages, buffers, changes, logging, persistence,
checkpoints and restart in an identified engine. Explain what the stated commit
promise survives and which failures require another copy. Include space growth
and upkeep where their physical causes become clear.

No additional general storage child is proposed. Link to the operational Backups
and recovery guide for establishing and testing a restore process, and to the
PostgreSQL implementation reading where product detail helps.

### 6. Understanding database performance

**Main — planned.** Combine `slow-queries` and `diagnosing-waits`, drawing on the
application-level questions in `request-cost` and the validation in
`performance-testing`. Follow one request through connection acquisition, generated
queries, round trips, engine work and waits before deciding where to intervene.
Carry a change through a meaningful comparison under representative conditions.

| Subarticle | Additional purpose | Existing material |
| --- | --- | --- |
| **The database work behind an application request** | Inspect and change ORM-generated work, repeated queries, batching, pooling, round trips and transaction scope; explore the tradeoffs in sustained application examples | Planned `request-cost` |
| **Reporting on operational data** | Serve reports while everyday work continues; develop precomputation, freshness and resource competition, and establish evidence for separating analytical work | Planned `reporting` |

The main investigation must let the reader discover excessive application work;
it cannot assume they already know their problem is one slow query. The application
child goes further into designing that work. The testing placeholder becomes a
substantial validation stage here and locally in indexes, reporting and scaling;
no standalone testing article is required by this tree.

### 7. Scaling a relational database

**Main — planned, new.** Begin with a measured capacity or availability need.
Develop reducing work, larger instances, caching, replicas and divided ownership as
concrete alternatives. Show where reads and writes go, what work remains shared,
what limits each arrangement and how failures change it. Explain clusters through
those node arrangements. Give table partitioning, sharding, freshness and regional
placement enough substance to reason about a choice.

| Subarticle | Additional purpose | Existing material |
| --- | --- | --- |
| **Replication and failover** | Follow copying, acknowledgements, read routing/freshness, writer promotion and authority, failure domains and regional failures through concrete scenarios | Expand planned `replicas-and-failover` |
| **Partitioning and sharding** | Develop partition/shard keys, pruning, co-location, routing, skew, hot tenants, cross-shard work and rules; work through safe data movement, verification and cutover | New planned subarticle |

The main develops the arrangements and their consequences rather than listing
names and delegating all explanation. The children address designing and operating
a chosen arrangement in more depth. Local table partitioning is not automatically
distributed ownership; application-managed shards differ from a distributed SQL
engine in where guarantees are enforced. Multi-writer and multi-region choices
must identify their communication and conflict behaviour. Use the existing
distributed-SQL essay for the fuller cross-machine transaction mechanism.

A product-specific failover or resharding runbook is beyond this general commission.
A concrete example must still reach a usable result; that boundary does not justify
leaving routing, concurrent changes or verification unexplained.

### 8. Choosing a relational database

**Main — planned.** Combine `product-comparison` and `embedded-databases`. Develop
embedded versus server deployment alongside consequential differences among
PostgreSQL, MySQL, SQL Server and SQLite for stated application needs. Explain
operating work and relevant edition/service limits through those needs.

No separate embedded-database child is necessary initially. The main must give
that decision sufficient space; direct section links can serve readers arriving
specifically for SQLite or embedded deployment. Product capabilities require fresh,
versioned research when this article is commissioned.

### 9. When should you add another system?

**Main — planned.** Develop `adding-another-system`, including the capability-choice
material in `postgresql/extensions`. Compare a capability within the current
database against another service through one sustained workload and brief contrasts.
Account for native features, extensions, specialised indexes, resource competition,
operating effort and keeping copies current. Link to reporting, search, documents,
caches, column stores and dated assessments for their fuller teaching.

No catalogue of capability children is proposed. Evaluating an extension belongs
with the capability and operating consequences being considered, rather than an
unmotivated tour of available extensions.

### 10. Inside PostgreSQL

**Main — planned.** Combine `postgresql/architecture` and
`postgresql/query-execution`, drawing ordinary index implementation from
`postgresql/indexes`. Follow a read and a committed change through processes,
buffers, heap/index access, planning, visibility, locks, logging, checkpoints,
restart and eventual cleanup. The main connects the implementation; it must not
stop at the point where the children begin.

| Subarticle | Additional purpose | Existing material |
| --- | --- | --- |
| **Indexes in PostgreSQL** | Develop a bounded comparison of access methods and specialised index choices for concrete workloads, extending the general Indexes article | Planned `postgresql/indexes` |
| **Row versions, transactions and vacuum** | Trace visibility, retained versions, long-running transactions and cleanup; explain the operational consequences | Planned `postgresql/row-versions` |
| **WAL, checkpoints and recovery** | Follow PostgreSQL's persistence and recovery behaviour in greater implementation/configuration detail | Planned `postgresql/recovery` |

The main teaches the causal connection among these components through its read/write
journey. The children develop implementation detail and consequences that deserve
more room. An access-method comparison is not an exhaustive catalogue; its workload
and useful outcome should be fixed in the commission. Extensions remain part of a
capability decision above unless a distinct implementation task earns further work.

### Operational guides

**Operating and evolving the database** is a navigation group, not an extra main
article. These guides remain directly accessible for their distinct tasks. They
can also be linked as further reading from the relevant deep dives, without
creating duplicate article homes.

| Article | Purpose and connections | Existing material |
| --- | --- | --- |
| **Changing a schema while the application runs** | Carry out a compatible migration while versions coexist: backfill, indexes, locking, verification and rollout recovery. Link from Designing your data and Indexes | Planned `schema-changes` |
| **Backups and recovery** | Establish recovery requirements and test a restore, including time and data-loss requirements and point-in-time recovery where supported. Link from Storage and durability and Replication and failover | Planned `backup-and-restore` |
| **Controlling access** | Establish identities, roles, privileges, least privilege and useful audit boundaries. Link from Designing your data | Access portion of `access-and-lifecycle` |
| **Retention and deletion** | Follow removal through related data, history, replicas, exports and backups, including partition expiry. Link from Designing your data, Partitioning and sharding, and Backups and recovery | Lifecycle portion of `access-and-lifecycle` |

### Introduction, practice and shared field reading

The introduction remains `/learn/databases/relational/`. Each major subject points
to its main deep dive; constraints and relationships can point to suitable sections
of Designing your data. Main pages show optional subarticles where their questions
arise and in a compact further-reading section. The full map should visibly nest
children beneath their main article, with working-draft/planned status per page.
The operational group is labelled as such and creates no empty overview route.

Keep **Start the SQL practice** (`practice`) as optional setup and **The last blue
mug** (`checkout`) as an optional worked synthesis with its distinct simpler shop.
The existing `normalisation` redirect remains an anchor into design. Preserve
working draft routes while main replacements are developed; redirect only once a
reviewed destination contains the material the old link promised. Old placeholder
routes can lead to their revised main or child destination when the tree is
implemented. A planned main must not hide an already-readable child draft.

Shared reading keeps its current field-level home:

- `/learn/databases/distributed-sql/`: cross-machine transactions and regional
  placement, linked from transactions and scaling.
- `/learn/databases/partitioned/`: comparative query-led keys and hot buckets,
  linked from partitioning/sharding.
- `/learn/databases/caching/`: cache behaviour, linked from scaling and performance.
- `/learn/databases/column-stores/`: analytical storage, linked from reporting,
  storage and the decision to add another system.
- Documents, search, graphs, object storage and the dated Postgres vector assessment:
  relevant representation and capability reading, rather than duplicate relational
  children. The shared distributed-systems programme remains parked.

### Every current leaf accounted for

The slugs below identify existing entries in `src/lib/relational-collection.ts`.
They are provenance, not evidence that a planned or expanded article is complete.

| Current leaf | Revised home |
| --- | --- |
| `modelling` (draft) | Main: Designing your data, expanded |
| `constraints` (draft) | Design child: Constraints in depth; core reasoning also taught in main |
| `tables-and-documents` (draft) | Design child: Tables and JSON; representation choice also taught in main |
| `query-results` (draft) | Main: Querying your data, expanded |
| `large-results` (draft) | Query child: Pagination and large results |
| `transaction-boundaries` (draft) | Main: Transactions and concurrency, reworked with concurrent updates |
| `concurrent-updates` (draft) | Main: Transactions and concurrency |
| `isolation` (draft) | Transaction child: Isolation and snapshots; necessary isolation reasoning also taught in main |
| `conflicts-and-retries` (draft) | Transaction child: Handling conflicts and uncertain outcomes; necessary failure reasoning also taught in main |
| `storage` | Main: Storage and durability |
| `indexes` | Main: Indexes |
| `join-algorithms` | Query child: How a query runs; concrete execution also taught in main |
| `query-execution` | Query child: How a query runs |
| `commit-and-recovery` | Main: Storage and durability |
| `slow-queries` | Main: Understanding database performance |
| `choosing-indexes` | Main: Indexes |
| `request-cost` | Performance child: The database work behind an application request; application-level investigation also taught in main |
| `diagnosing-waits` | Main: Understanding database performance |
| `reporting` | Performance child: Reporting on operational data |
| `performance-testing` | Validation within the performance main and locally in indexes, application work, reporting and scaling |
| `access-and-lifecycle` | Operational guides: Controlling access; Retention and deletion |
| `backup-and-restore` | Operational guide: Backups and recovery |
| `schema-changes` | Operational guide: Changing a schema while the application runs |
| `maintenance` | Space growth/upkeep in Storage and durability; index upkeep in Indexes; statistics/estimates in How a query runs; observations/regressions in performance; version cleanup in PostgreSQL/vacuum reading |
| `replicas-and-failover` | Scaling child: Replication and failover; arrangements and failure consequences also taught in main |
| `embedded-databases` | Main: Choosing a relational database |
| `product-comparison` | Main: Choosing a relational database |
| `adding-another-system` | Main: When should you add another system? |
| `postgresql/architecture` | Main: Inside PostgreSQL |
| `postgresql/query-execution` | Main: Inside PostgreSQL |
| `postgresql/indexes` | PostgreSQL child: Indexes in PostgreSQL; ordinary index implementation also taught in main |
| `postgresql/row-versions` | PostgreSQL child: Row versions, transactions and vacuum; visibility/cleanup also taught in main |
| `postgresql/recovery` | PostgreSQL child: WAL, checkpoints and recovery; persistence/restart also taught in main |
| `postgresql/extensions` | Main: When should you add another system?, through a concrete capability decision |

### First batch and independent planning review

The requested first writing batch is **Designing your data**, **Querying your data**
and **Transactions and concurrency**. Expand the first two existing drafts and
combine the transaction-boundary/concurrent-update drafts into the third. Reconcile
the child drafts and shared practice setup as needed; retaining a child does not
mean commissioning an unrelated rewrite of its whole subject.

Two independent planning perspectives examined the nested structure. Both supported
self-contained main explanations, retaining useful draft children, combining index
mechanics/selection, concrete replication and sharding children, and operational
guides with independent entrances. This plan retains application-work and specialised
PostgreSQL-index children because those develop distinct practical choices. It
absorbs embedded deployment into product selection, and distributes testing and
maintenance into the explanations where their purpose is visible. A symmetric
number of children is not a goal.

Author and review the main articles as explanations first. A review should ask what
the reader can now understand or decide without following a child link. Then review
the children for additional value, readable direct entrances, repetition and missing
bridges. Some local recap is useful; repeating the main explanation wholesale is
not. The first three main articles need a sequential fresh reading as well as
independent technical and editorial review under the authoring/review skills.

The site map and placeholders should reflect this nesting when implemented. No
main page is marked written merely because its component drafts exist. Planning,
drafting and reviewing do not authorise publication.

### Earlier plan and production history

The remaining sections preserve earlier commissions and decisions. Their counts,
boundaries and production orders are historical. Use the nested proposal above
for subsequent site and article work; the current site map still records available
routes and drafts.

## Querying and transactions: commissioned sequence

The next commission covers the two querying articles and four transaction articles.
An independent review retained their order and boundaries: query results, pagination,
transaction boundaries, competing updates, isolation, and conflict handling. Each
answers a different question. Pagination needs a local account of changing data
before linking forward to the fuller snapshot explanation.

The [production brief](article-work/querying-transactions/brief.md) records the
shared shop records, responsibilities and review approach. These are working
drafts as they are completed, not publication entries. Query meaning stays separate
from query execution and performance; the transaction sequence teaches application
reasoning before engine internals.

## Designing your data: commissioned sequence

The user found the boundary between turning data into tables and normalisation
artificial. Normalisation is part of deciding where facts belong, so those two
leaves now form **Designing a relational schema**, followed by **Constraints** and
**Tables and JSON**. The agreed distinction is a reading journey through connected
decisions, not a separate article for every nameable concept.

The first article owns identity, relationships, normalisation, types and historical
facts; the second owns enforcing those decisions and the limits of declarative
rules; the third owns the tradeoffs of embedding varying product attributes inside
otherwise relational records. Historical purchase prices are distinct facts, not
merely a performance-oriented duplicate. Deliberate precomputation for faster
queries belongs later in performance teaching.

The [production brief](article-work/designing-data/brief.md) defines the shared
shop schema, article boundaries and review approach. These three routes are
working drafts, not published entries. The former `normalisation` outline redirects
to the schema article's normalisation section. The eight groups remain, with
34 article leaves in the current map; the 35-leaf description below is historical.

The subsequently proposed full article tree and its four independent reviews are
preserved in [the review record](reviews/relational-tree-2026-10-04/synthesis.md).
Its recommended refinements remain distinct from agreed article commissions.
The introduction brief below incorporates the user's later correction on 4 October:
establish what a relational database is before developing worked examples. That
decision supersedes the review's proposed order/query/update walkthrough as the
introduction's organising structure.

## Navigable plan, 4 October 2026

The operator subsequently requested all article placeholders so the intended links
and boundaries could be inspected on the site. This explicitly supersedes the
no-placeholder route restriction below for this collection. The current map retains
eight groups and all 35 leaves from the reviewed tree. `src/lib/relational-collection.ts`
owns their titles, routes, scope, and descriptions; `/learn/databases/relational/`
contains section-level planned links and the full expandable map. Each placeholder
states that it is unwritten, gives its intended scope, and links back. None is a
publication or evidence of completed coverage. The two formerly ambiguous waiting
articles are labelled “Handling waits, deadlocks, and retries” and “Diagnosing
database waits.” Broad leaves retain commissioning caveats rather than silently
creating more articles.

The introduction now occupies the original relational route. The existing checkout
essay is preserved at `/learn/databases/relational/checkout/` as a related working
draft. It does not count as completing several future articles. The historical
planning passages below describe the earlier state.

## Suggested reading order

The operator asked for the visible collection to work from top to bottom. It now
runs: designing data → querying data → transactions and concurrent work → engine
internals → performance → operations → product choices → PostgreSQL internals.
The introduction supplies the initial picture; the first branches make tables and
operations familiar before discussing how an engine implements them.

Querying now owns result meaning and working through large results. Index selection
and reporting move to performance, after index mechanics and execution plans have
been introduced. The performance sequence moves from investigating a query to
choosing an index, inspecting application work, diagnosing waits, handling reports,
and validating changes. Operations starts with access and recoverability before
live schema changes, maintenance, and replicas. Product choices first distinguish
embedded deployment from a server, then compare products and consider another
system. PostgreSQL's query and index articles now sit together before versions and
recovery. All 35 article routes and the eight group IDs are retained.

This is a useful default route, not a prerequisite course. The map gives readers
choosing a product a direct comparison shortcut. Focused articles still establish
the concepts needed to arrive directly at their question.

## From the field guide

The relational section introduces tables, relationships, constraints, transactions,
and broad fit. Its current next link leads to `/learn/databases/relational/`, whose
draft, “The last blue mug,” moves through modelling, indexes, concurrent checkout,
row versions, and crash recovery. It contains candidate material, but that inventory
does not establish a coherent introduction or completed coverage.

The proposed next destination is **Relational databases**, an introduction with a
reading map attached. It should reward the click with an explanation, not another
directory or a comprehensive internals tour. Keep the map compact and link only to
available reading. Readers who arrive with a specific question should also be able
to enter a focused article or comparison directly.

## The first article: what the relational approach gives you

Reader: an engineer who may never have encountered a relational database. The
article must also work without the field guide. Its outcome is a connected picture
of what a relational database is, how it lays out and connects data, why that is
useful, and what problems its main capabilities solve.

Develop that orientation through these questions; they describe the commission,
rather than compulsory published headings:

- What is a relational database, and what work does it do for an application?
- How do tables, rows, columns, identifiers, and relationships represent data?
  Explain the visible organisation without equating a logical table with a particular
  physical disk layout. Small labelled records can make the explanation tangible.
- Why is that representation useful? Explain how shared facts can be maintained
  and related data queried in different combinations. Show enough of a result to
  make that capability clear; SQL syntax can remain supporting material.
- What problems arise when applications store, retrieve, and change shared data?
  Explain the roles of constraints, transactions, concurrency control, locks, and
  indexes. Give each an intelligible purpose: keeping rules true, grouping related
  changes, managing overlapping work, coordinating conflicting access, and finding
  data without inspecting everything. Introduce the consequential limits, including
  that a transaction alone does not settle every concurrency problem and locks are
  one part of coordination rather than a universal description of every read.
- Where does the approach fit, and which choices remain open? Distinguish its data
  model from storage layout, deployment, and product behaviour. Give deeper questions
  useful onward destinations without making them required reading.

Examples support these explanations. A few related tables, a query and result, or
a small overlapping-change example may each help; following one order from creation
through checkout is not the article's required narrative. Choose the examples and
media after the introductory explanation is clear. An interaction is optional.

Stop before index implementation, a SQL tutorial, query-planning algorithms,
product rankings, isolation-level surveys, or recovery internals. Those limits leave
room to explain what the main mechanisms are for; they do not exclude indexes,
transactions, or concurrency from the introduction.

## Questions that deserve their own articles

The groups below organise this working plan. They need not become separate navigation
pages. Each row names a candidate question, its useful stopping point, and the knowledge
it relies on. Prerequisites mean concepts to introduce or link, not compulsory lessons.

| Candidate question | What the reader should leave able to do | Starting knowledge |
| --- | --- | --- |
| How should these facts become tables? | Model identity and relationships, distinguish shared facts from historical snapshots, and reason about duplication | The introductory records example |
| Which rules can the database enforce? | Choose constraints for concrete invariants and recognise rules needing further coordination | Tables, keys, simple changes |
| How does a query combine these tables? | Trace matches, missing matches, and aggregation; explain an unexpectedly multiplied result | Tables and relationships; introduce SQL locally |
| How does an index change the work of a query? | Trace lookup and maintenance, then predict when an extra access path helps less | A simple filter and its expected result |
| Which index fits this query? | Relate predicates and ordering to index choices, then check a proposed choice against a plan | Basic index mechanism and simple queries |
| What happens when two requests change the same data? | Explain a concrete race, the chosen transaction behaviour, and the application's response to conflicts | Updates, constraints, and transaction purpose |
| Where does a query spend its time? | Investigate with plans and observations; distinguish excessive work from waiting | Queries and indexes; teach plan notation in the article |
| How much database work does one request create? | Trace application queries, round trips, connection use, and transaction scope | A working query and application request |
| What must survive a crash? | Distinguish a transaction's result, recovery mechanisms, and the stated durability promise | Basic transactions; implementation boundaries researched explicitly |
| How do we change a schema while the application runs? | Plan one concrete compatibility-preserving change and recognise locking/backfill concerns | Schema, indexes, and application use |
| How do we know we can recover the service? | Reason about a tested restore scenario and distinguish backup, replica, and failover roles | Durability and the service's recovery needs |
| Who can read or change this data? | Design a bounded access scenario and account for retention/deletion obligations | Schema and application roles |
| When should some work move to another system? | Investigate a workload pressure, including improvements within the existing engine, before adding another system | The relevant mechanism; recap locally |

Some questions may need splitting once examples and evidence expose their size.
For example, a selective lookup, a join, and lock contention need not be compressed
into one performance tutorial. Avoid the opposite failure of producing tiny articles
that require several other tabs to understand a single argument.

## Products and PostgreSQL

**PostgreSQL, MySQL, and Microsoft SQL Server: how to choose** is a parallel route
for a practitioner evaluating products. Compare consequential differences in stated
situations, including deployment and operating constraints; research the current
claims before writing. Include SQLite when the embedded/server distinction helps
that reader. Readers should not need to complete internals articles first.

**Inside PostgreSQL** is the first implementation-specific collection. Begin with a
concrete read or write and follow only the subsystems necessary to explain it. Likely
focused pieces concern query execution, row versions and cleanup, and commit/recovery.
Product-specific practical work can follow when it serves a commissioned question.
These are proposals for scoped pieces, not a promise of a single definitive article.

Use PostgreSQL as an explicitly identified example in family explanations when it
helps. The PostgreSQL collection should extend that teaching with implementation
detail, not repeat it. General index principles belong with indexes; version-specific
maintenance behaviour belongs with the implementation. Documents, vectors, search,
and analytics are workload questions that can lead back to the same product. Avoid
exclusive product categories and keep changing suitability claims in maintained
comparisons or dated assessments.

## Reader journeys and the first production slice

- Curious newcomer: introduction → modelling or a query explanation → whichever
  mechanism their next question needs.
- Practitioner choosing a system: product comparison → relevant evidence and
  mechanism explanations, with no required introductory sequence.
- Engineer diagnosing a problem: focused diagnosis article → missing background
  explained locally and linked where further depth helps.
- Reader learning an engine: PostgreSQL overview → focused implementation pieces,
  with links to the family ideas they implement.

Proposed first slice: the introduction, one bounded index explanation, and one
transaction/concurrency explanation. This tests orientation, spatial/mechanical
teaching, and interaction without commissioning the entire collection. The product
comparison is the next distinct reading need to serve; it can be entered independently.
Review the existing mug draft for reusable passages and models against those briefs.
Do not silently promote it to the new introduction or treat reuse as acceptance.

Only change routes and visible reading links when useful reviewed drafts exist.
Decide then whether to reuse the current relational URL for the introduction and
give the focused checkout material a specific destination. Preserve existing useful
links if a route moves. No route change is part of this planning pass.

## What this teaches the planning skill

Start from the reader's next question at the current entry point. Give a broad family
a coherent introduction and several independent ways to proceed. Separate coverage
outcomes from article boundaries, and separate learning dependencies from navigation.
Validate those choices on actual examples before using the same shape for another
field. The distributed-systems teaching programme remains parked.
