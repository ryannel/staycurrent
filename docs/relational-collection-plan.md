# Planning the relational collection

Working plan, 4 October 2026. This develops the
[coverage structure](content-structure.md) into reader journeys and bounded article
candidates. The design, querying and transaction sequences were subsequently
commissioned; the other branches remain planned coverage. Titles, groupings, and destinations can change
as the explanations develop.

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
