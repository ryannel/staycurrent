# Planning notes · 25 October 2026

These are first planning outputs for coordinator integration and the commissioned
collection-route review. They are not accepted manuscripts or publication work.
The complete map has 59 provisional article owners covering all 58 existing
destinations. The count follows one consolidation and the candidate modelling
plan's two deeper children; the existing count was not used as a target.

## Inputs and reference exposure

Read only the supplied commission, scope inventory, shop example, modelling plan,
current breakdown/write/continuity skills and fixed references in this isolated
workspace. No main-repository article bodies, earlier prose, historical outlines,
reviews or feedback were consulted. The coordinator supplied two current boundary
decisions during planning: query results owns the compact per-order summary needed
for its complete still-due report, and it owns the compact set-operations
distinction. The coordinator provisionally accepted the generic storage/recovery
consolidation.

Read every bounded part separately through `scripts/read-writing-reference.py`:
Sequence diagrams 1–6; Indexes 1–7; Storage and durability 1–6. Each tool result
delivered its END marker, with no missing part. Manifest hashes were checked by
the helper. This was the complete prose, labels, captions and code exposure.

Used one owned background browser tab at the supplied reference server, with no
viewport or theme changes; closed it afterwards. Visually inspected Sequence
diagrams' waiting and ordering figures, Indexes' sequential scan and composite
index figures, and Storage and durability's row-version and WAL figures in their
rendered context. This is selective drawing study, not a complete interaction or
render audit. Some figures began playback when brought into view.

The transferable teaching decisions are concrete: keep returning to the same
named records; change one assumption or operation at a time; establish the
successful case before the failure; state what to watch before the drawing and
read the consequence after it; distinguish a deliberately small model from a
measurement. The introduction's central explanations should make related rows,
result multiplicity, a partial versus atomic purchase, two buyers and crash
survival visible. The plan specifies those explanatory needs without prescribing
the writer's diagram design.

## Learning route and ownership

The introduction gives a useful first understanding of related facts and safe
changes. Design and correct SQL results follow naturally; applications and
concurrency connect those ideas to requests. Work and storage support diagnosis;
recovery and operation support service responsibility; distributed SQL adds
placement and coordination. PostgreSQL and CockroachDB are practical routes with
their own native evidence and procedures. A reader who has a task can enter at
that task and fill missing concepts; parentage is never a reading prerequisite.

The modelling candidate fits without changing its scope. Normalisation and
decomposition owns precise definitions and methods, including higher normal
forms. Modelling hierarchies owns representation comparisons and traversal and
maintenance procedures, including recursive SQL. The parent remains a complete
practical design article.

Query results owns SELECT/JOIN, cardinality, result grain, absence and compact set
operations. It may teach the one per-order GROUP BY/SUM summary needed to finish
the still-due report; Aggregates and window functions owns general grouping,
HAVING/FILTER, empty/count distinctions, windows and ordered calculations.
Pagination owns continuation and export contracts. Writes owns DML, upserts and
imports. Application SQL owns driver/ORM/connection behaviour. Physical join
methods belong in query execution. These boundaries are deliberate overlaps at
the point of a complete useful example, not duplicate full treatments.

Storage and durability provisionally combines r15 and r18. One changing row links
pages, buffers, old versions, cleanup, write amplification, log ordering and
restart recovery. Restoring lost or unwanted history belongs in Backup, restore
and reconciliation. Native PostgreSQL architecture, vacuum and WAL retain distinct
outcomes and working procedures. Generic Indexes owns design and maintenance
judgement; live index rollout belongs with schema changes, and native PostgreSQL
build validity and safe maintenance belong in its schema-change article.

No synthetic overview article was added solely to hold a navigation group. Inside
PostgreSQL and Inside CockroachDB each have a concrete request-tracing outcome.
Their native children preserve the existing specialist scope. PostgreSQL text,
vector, JSON and extension capabilities are distinct task routes rather than a
single mandatory specialist sequence.

## Primary-source starting points

Opened on 25 October 2026. These support the plan's boundaries and give writers
starting points; they are not evidence that example executions were observed.

- [PostgreSQL 18: Concepts](https://www.postgresql.org/docs/18/tutorial-concepts.html)
  supports rows, columns, typed values and the absence of an inherent row order.
- [PostgreSQL 18: Joins](https://www.postgresql.org/docs/18/tutorial-join.html)
  explains matching row pairs and missing matches, explicitly distinguishing the
  conceptual pairing from efficient physical execution.
- [PostgreSQL 18: Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html)
  supplies native integrity rules and the limitation of CHECK for other rows.
- [PostgreSQL 18: Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html)
  supplies the atomic unit and transaction boundary.
- [PostgreSQL 18: Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html)
  supplies the guarded-update race assumptions: at Read Committed a conflicting
  writer can wait and re-evaluate its predicate on the updated row. It also
  distinguishes snapshot stability from serial outcomes. Do not generalise that
  execution to every isolation level or product.
- [PostgreSQL 18: WAL](https://www.postgresql.org/docs/18/wal-intro.html)
  supplies write-ahead ordering and the distinction between log durability and
  writing changed data pages.
- [CockroachDB architecture](https://docs.cockroachlabs.com/docs/stable/architecture/overview)
  and [Developer basics](https://www.cockroachlabs.com/docs/stable/developer-basics.html)
  support the native architecture/application split and the need for native
  transaction and retry reasoning. Pin the actual version when writing native
  claims or observing execution. Search also returned the project's older
  `docs/design.md`, which warns it may be out of date; do not use that as the
  current behaviour contract.

Formal normalisation, distributed commit/snapshots and specialist native work need
their own primary-source research when those outlines are commissioned. No claim
about a native latency, plan, crash result or region failure has been measured in
this planning assignment.

## Shared example and continuity pass

The supplied example mixes an explicit pre-103 stock snapshot with rows including
103. Make the scene boundary visible: a pre-purchase scene has orders 101/102 and
their lines/payments, P3 stock 12, P7 stock 1 and P9 stock 4. Committing 103 adds its
two lines, reduces P3 to 10 and P7 to 0, and leaves 103 pending with no payments.
Read examples using the committed scene must use that stock. A writer may show the
committed scene first and rewind explicitly; they must not silently treat both
states as one snapshot. Order 102's earlier two mugs do not consume the one mug in
the later stock snapshot.

Mina is customer 1 and wins the last-mug purchase with 103. Tariq is customer 2 and
his attempted 104 loses. An unsuccessful 104 must not appear as a committed order
unless a separate deliberate cancelled-order policy is introduced. Edda is
customer 3 and has no orders in the core scene. A row of `order_items` is an order
line. Amounts have no assigned currency. Order 103 totals 29.00 from 20.00 plus
2 × 4.50; no tax, shipping or implied payment is present. The reference's
`current_price` is not the shared schema's `products.price`.

The coordinator has also accepted two query scenarios: payment 504 adds 10.00 to
order 103, leaving 19.00 due and its status pending; optional equal-value numbered
mug lines on 102 challenge a SUM(DISTINCT) repair. These extend the starting scene
for that explanation; they do not replace its baseline. Native PostgreSQL 18.6 is
available to the query writer for owned disposable observations; this planner
has made no execution claims.

The introduction need not add schema or rows to make its core explanations.
Proposed extensions to agree centrally as deeper writing is prepared:

- Modelling's supplier–product–location offers, independent tags/suppliers,
  categories and tea/teaware subtypes need stable identities and separate small
  fixtures. Repeated product lines need an explicit business rule and a scenario
  record. Preserve the candidate plan's P7 20.00-to-22.00 price change after 103,
  keeping its agreed `unit_price` at 20.00.
- Tenant integrity/access needs two named shop tenants, composite identities and
  actual runtime/migration/support roles. Do not retrofit a tenant column into
  every introductory table before it serves an explanation.
- Multi-row capacity and the existing CockroachDB restore-booking outcome need a
  small class-booking extension: class identity, capacity, booking identity,
  customer identity, state and one recoverable request. The supplied record has
  no instructor or staff names; introduce distinct people centrally instead of
  silently making a customer an instructor.
- Requests/outbox/workers need a request identity, payload agreement, recorded
  result, outbox identity, claim expiry and fencing generation. These are a
  scenario extension, not fields assumed in the current core schema.
- Performance needs a separately labelled generated larger fixture, with its
  distribution and workload recorded. No reference page count can be presented
  as a measurement of the small core shop.
- Distributed cases need shop/location ownership and declared replicas/failure
  domains. Recovery cases need a closed source history, recovery target and later
  valid work, with external payment/delivery identity if relevant. Regional
  drawings remain models unless a disposable multi-region observation is owned.

Planning continuity was checked across introduction stubs, map ownership and
coverage: no child requires formal vocabulary before the parent introduces it;
technical prerequisite concepts are stated in the map; the stock and payment
states above agree; query results/aggregation and generic/native boundaries agree.
This is the coordinator-side planning pass, not the independent route review.

## Concrete decisions for integration

1. Confirm the provisional storage/recovery merge in the canonical tree and route
   naming. Existing destinations are coverage aliases, not automatic redirects or
   publication permissions.
2. Choose the unpublished route prefix and preview metadata centrally. The map's
   slugs are relative semantic proposals. The new introduction supersedes r00's
   stale “accepted introduction, preserved” inventory note.
3. Agree the first extensions only when needed, starting with the class-booking
   and request/outbox records before assigning their dependent articles.
4. In the first complete route review, check reader effort around the broad
   storage article and the introduction's implementation orientation. The writer
   may condense the orientation and entry routes, but each owned foundation must
   stay intelligible without its children. No child heading outlines beyond the
   commissioned introduction have been prescribed here.
