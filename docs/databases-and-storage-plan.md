# Databases and storage: proposed coverage and page structure

18 October 2026. Steps 1 and 2 of the user's commission: map the field and derive
the pages and reading journeys. **Proposal for discussion.** Independent planning
review, article commissions and publication follow later. No existing article's
publication or review status changes through inclusion in this plan.

## What the section should enable

An engineer should be able to turn an application's needs into a storage design,
explain the work that design performs, preserve the application's promises under
concurrency and failure, and change the design using evidence. Someone arriving
with one problem should be able to reach its explanation without reading the field
from the beginning.

That needs several kinds of understanding. Before assigning pages, the breakdown is:

| Ability | What the reader needs underneath it |
| --- | --- |
| Describe the work | Records and their relationships; read and write shapes; size and growth; skew; latency distributions; throughput; concurrency; freshness; loss and recovery targets; access boundaries. |
| Choose a representation | Identity; relationships; aggregate boundaries; nested and repeated values; types; missing values; units; time; history; constraints; duplication and ownership. |
| Predict the cost | Pages and caches; sorted access; log-structured writes; compression; scans; joins; aggregation; indexing; partition pruning; network crossings; maintenance work and amplification. |
| Preserve correctness | Atomic changes; conditional writes; isolation; concurrent readers and writers; ambiguous outcomes; retries; idempotency; replicated state; authority after a failure. |
| Find information | Exact lookup; ranges; structured queries; ranked text; approximate neighbours; paths through relationships; time windows; analytical summaries. |
| Place data and work | Embedded against server operation; one machine against several; partition ownership; replicas; locality; hot keys; rebalancing; shared compute and storage. |
| Run and recover the system | Limits and overload; useful signals; access and encryption; backup and restore; corruption; retention; deletion; maintenance; upgrades; tested failover and recovery. |
| Change the design | Live schema changes; backfills; change capture; reconciliation; migration; index rebuilds; model changes; cutover and rollback; compatibility between application versions. |
| Defend the choice | Compare credible alternatives against the same needs; include people, operating effort, money and another copy of the data; know when the current database is sufficient. |

These abilities apply to different stores in different ways. An object store needs
publication and lifecycle design; a search system needs judged retrieval quality;
a graph database needs bounded traversal. Giving each the relational table of
contents would conceal those differences.

## The proposed structure

The [field coverage map](coverage/databases-and-storage.md) owns the shared material
and routes into nine collections. Each collection has one map containing its
proposed pages, owned sections, prerequisites, teaching form and existing material.
The tables are the detailed page plan. They are not a claim that the current pages
already teach all the proposed material.

<!-- inventory-summary:start -->
| Reading entrance | Proposed articles | New destinations | Detailed page and section map |
| --- | ---: | ---: | --- |
| Field guide and shared decisions | 8 | 7 | [Coverage map](coverage/databases-and-storage.md) |
| Relational databases, distributed SQL and PostgreSQL | 49 | 8 | [Coverage map](coverage/relational.md#proposed-whole-collection-structure) |
| Document databases | 10 | 9 | [Coverage map](coverage/documents.md) |
| Key-value and wide-column stores | 11 | 10 | [Coverage map](coverage/key-value-and-wide-column.md) |
| Analytics and time series | 15 | 14 | [Coverage map](coverage/analytics.md) |
| Search and vector retrieval | 12 | 11 | [Coverage map](coverage/search.md) |
| Graph databases | 7 | 6 | [Coverage map](coverage/graphs.md) |
| Caches and in-memory stores | 8 | 7 | [Coverage map](coverage/caching.md) |
| Object storage | 15 | 1 | [Coverage map](coverage/object-storage.md) |
| Filesystems and block storage | 9 | 9 | [Coverage map](coverage/files-and-block-storage.md) |
| **Total** | **144** | **82** | **62 existing destinations to reassess** |

Four existing tool destinations sit alongside these articles: the SQL sandbox and
practice guide, and the object-storage sandbox and real-service worksheet.
The count includes introductions, comparisons and product depth; aliases and the
dated vector assessment are separate. New destinations often develop material
currently compressed into an existing introduction.

For the complete list of titles in a more readable tree, open the
[proposed page tree](databases-and-storage-page-tree.md).
<!-- inventory-summary:end -->

These are reading entrances, not mutually exclusive classes of product. A
relational database can hold documents, execute analytical queries and provide
search. Time-series work appears within analytics and links to keyed history
storage; distributed SQL is a relational branch. Files and volumes have their own
entrance because application file operations and the storage beneath a database
need treatment beyond a paragraph in the field guide.

### Field guide and shared decisions

Keep `/learn/databases/choosing/` as the front door. Introduce what the stores do,
how their approaches overlap and where to start. Give deeper shared questions their
own destinations: specifying workloads, understanding read and write guarantees,
log-structured storage, maintaining derived copies, migrating data, evaluating a
store, and protecting data through its lifetime.

Shared pages are optional destinations reached when needed. A newcomer should not
have to finish an abstract foundations course before learning what a database is.
Introductions supply the small explanations their own reader needs.

### Relational databases

Keep the strongest existing structure: representation and SQL, transactions,
indexes and storage, performance, capacity, operations, product choice and the
PostgreSQL branch. Add explicit homes for types and time, analytical SQL patterns,
routine maintenance, tenant isolation and embedded operation. Develop distributed
SQL as a branch of this collection, with a distinct entrance for readers who need
transactions across machines.

The existing Indexes and Storage maps remain the detailed authority for their
mechanisms. A proposed page elsewhere cannot silently take that teaching away.
PostgreSQL-specific counters, settings and storage structures remain in its branch.

### Documents

Follow the decision about what belongs in one document through querying nested
data, atomic changes, indexes, schema evolution, distribution and operation. Use
MongoDB as the initial implementation example and CouchDB as an instructive
contrast where replication and conflict handling change the design. Keep a clear
comparison with using JSON in an existing relational database.

### Key-value and wide-column stores

Begin with the difference between retrieving a value by key and querying an
ordered group of records. Follow the access-pattern design through hot keys,
secondary arrangements, conditional updates, replication, log-structured storage
and operation. DynamoDB and Cassandra/ScyllaDB need separate implementation pages:
their APIs and guarantees cannot be taught as one generic product.

### Analytics and time series

Give analytical modelling, column layout, compression, ordering, execution,
ingestion and corrections their own homes. Follow time-series work through event
time, series cardinality, rollups and retention. Teach table formats and query
engines over object storage here, while object storage owns the byte service and
atomic publication of an arbitrary dataset. Use ClickHouse for engine depth and
DuckDB for embedded and file-based analysis; compare other operating arrangements
only against actual workloads.

### Search and vector retrieval

Treat search as retrieval whose quality needs evaluation, alongside its latency
and freshness. Build from text analysis and inverted indexes through ranking,
structured filters, facets and stable result pages. Give embeddings, approximate
indexes and hybrid retrieval enough room to explain their distinct errors. Keep
generation, prompting and model training in the planned AI field; explain only
the source preparation and model choices needed to understand retrieval.

### Graphs

Concentrate on modelling relationships, expressing paths, understanding traversal
cost, choosing graph algorithms and operating the representation. A small
collection can teach substantial depth without expanding into a general graph
theory course. Contrast relational recursive queries and property-graph stores;
explain RDF's different job without commissioning a semantic-web collection.

### Caches and in-memory stores

Separate a cache that can be rebuilt from an authoritative in-memory database.
Teach staleness and invalidation races, admission and eviction, load during a
miss, recovery after losing the cache and the cost of replication. Include common
atomic counters and rate-limiting uses where they depend on the store; do not turn
this into the parked coordination programme or a messaging collection.

### Object storage

Reassess the existing collection against its own map rather than recreate its
whole structure. Preserve separate explanations for transfers, concurrency,
dataset publication, permissions, application lifecycle, delivery, events,
recovery and cost. Make generic object behaviour and Amazon S3 implementation
detail distinguishable. Let the analytics and search collections own the general
teaching currently repeated by S3 Tables and S3 Vectors.

### Filesystems and block storage

Teach file and directory operations, visibility and persistence, shared access,
volume layout, I/O performance, snapshots, capacity and recovery. A reader should
be able to choose between a file interface, an object interface and a volume,
and explain the assumptions a database makes about the storage underneath it.
Storage firmware development and filesystem implementation are outside the
practitioner's route proposed here.

## Reading journeys

Page IDs below resolve in the coverage maps. Arrows are recommended paths, not
prerequisite chains that every reader must finish.

| Reader arrives with | Route | What they should leave able to decide or do |
| --- | --- | --- |
| “I am new to databases.” | F01 → R01 → R02 → R06 → R09; then choose a branch | Explain records, queries and transactions, and recognise why a different store might be useful. |
| “Which store fits this application?” | F01 → F02 → F03 → one family introduction → that family's comparison → F07 | Write down needs, identify two credible designs and plan an evaluation that can reject one. |
| “This query became slow.” | R17 → R07; R12 or R13 for access paths; R18 for application work | Separate work, waiting and request multiplication; measure the actual cause. |
| “Two callers can change the same thing.” | F03 → R09 → R10 → R11, or D05/K05/O04 for the chosen interface | State the invariant, use the relevant atomic operation and reconcile a lost reply. |
| “Our SQL database needs to span regions.” | R20 → R34 → R35 → R36 → R37 | Place data and transactions deliberately; explain latency, failure and migration consequences. |
| “Reports are competing with checkouts.” | R19 → R26 → A01 → A02 → A06 → F05 | Choose what to copy, model report results, handle lag and corrections, and keep the copy repairable. |
| “We need device histories and dashboards.” | A09 → K02/K03 for keyed history; A10/A11 for aggregation | Bound series and partitions, reason about late data and choose which history and summaries to retain. |
| “Our search results are poor.” | S01 → S02 → S03 → S08; add S05–S07 where vectors help | Diagnose retrieval failures, compare approaches on judged questions and retain filters and permissions. |
| “We want to add a cache.” | C01 → C02 → C04 → C05 | Set a staleness policy, prevent fill races and withstand a cold or unavailable cache. |
| “We need to publish user uploads safely.” | O01 → O03 → O06 → O07 → O08 | Separate storage authority, validation, application ownership and delivery. |
| “Which data survives this outage?” | F03 → R15/R21/R23, O10 or B07 for the store in use | Distinguish acknowledgement, replication and recovery; perform a restore that proves the application can resume. |
| “We are changing stores.” | F06 → F05 → the source and destination's evolution/operation pages | Build, reconcile and cut over a replacement while preserving identity and deletions. |
| “The database's disk is the bottleneck.” | B01 → B05 → B06; R15/R16 or K07 for engine work | Relate I/O work to device and volume limits before buying capacity or tuning the engine. |

No route discharges a teaching obligation into an unwritten page. During later
production, a journey can become available only when all explanations it depends
on exist, or its local explanation is sufficient without the link.

## How the reference articles shape this plan

Sequence diagrams is the calibration for a subject learned through worked cases:
light connecting prose and examples that expose both common practice and traps.
Indexes is the calibration for connecting an access mechanism to measured work
and a design choice. Storage and durability is the calibration for a deeper chain
of mechanisms, including the failure cases that make the guarantee meaningful.

Those are choices about teaching, not three templates to fill. In the maps,
“trace”, “worked cases”, “measure” and “vary” describe what a reader needs to see.
They do not require an animation or a new playground for every page. Existing
reading times are useful checks on the cost of a proposed explanation; this plan
does not set word counts or promise that every row deserves a long article.

Each collection keeps a running dataset. The shop retains customer 42, blue mug
P7 and orders; the storage trace retains P7 on page 12. Device history uses device
D17. Search uses product P7 and versioned repair-manual passages. Graphs use the
repair service's dependencies. Collections share identities where useful without
forcing one story to explain every kind of work.

## Existing material and route decisions

Existing material is evidence and reusable work. Inclusion in a proposed page
does not mean it has passed a new depth or style review. `Existing` in the maps
means a file or registered route exists, not that the proposed explanation is done.
Publication status continues to come from the actual page and collection metadata.

- Retain the field guide and current family entrance URLs. A title or grouping can
  change without a route change.
- Keep the relational, PostgreSQL and object-storage destinations unless writing
  reveals a reason to merge. Preserve their old anchors where practical.
- Keep `/learn/databases/column-stores/` as the home of column-layout teaching,
  reached from the analytics introduction. Avoid a second competing column-store
  essay.
- Keep `/learn/databases/distributed-sql/` as the distributed-SQL entrance. Its
  additional proposed articles live in the relational reading family.
- Preserve the `normalisation` and `concurrent-updates` aliases and the aliases in
  `relational-collection.ts`; they are not additional proposed articles.
- Keep the relational checkout example as a synthesis and its SQL practice and
  sandbox as tools. Keep the object-storage sandbox and real-service practice as
  tools. The maps separate these from article counts.
- Keep the dated vector assessment as an assessment. Its recommendation needs a
  fresh evidence pass before reuse; it is not the general vector-search home.
- Do not create routes or change navigation for proposed pages during planning.

## What earns a page, and what stays within one

The maps split a topic when it has an independent reader question, a mechanism
that needs its own investigation, or enough worked cases to bury its parent's
argument. Otherwise a named section owns it. Examples: normalisation remains in
data modelling; conditional object writes remain in concurrency; HNSW and IVF
begin as sections of approximate retrieval; RDF begins as a contrast in the graph
introduction. A later brief can challenge those boundaries with a reader reason.

Product comparisons have their own bounded question. Product depth earns a page
where commands, settings or a product's particular machinery would break up the
general explanation. There is no commitment to give every named product a series
as large as PostgreSQL's. The implementation candidates in the maps require fresh
versioned evidence before they establish advice.

## Boundaries and questions for our discussion

The proposed core is using, designing and operating storage for applications and
analysis. It reaches the internals needed to predict behaviour; it does not aim
to train someone to implement every database engine.

1. **Breadth.** This includes files and volumes, time-series work, and the lifecycle
   of derived copies. They are needed to make “databases and storage” a complete
   promise, but they expand the work beyond rewriting the current articles.
2. **Product depth.** PostgreSQL and S3 retain the substantial existing investment.
   Other collections begin with selected implementation pages, rather than one
   full series per vendor. Comparisons include credible alternatives.
3. **Shared teaching.** Eight shared pages support the families. Introductions
   remain understandable on their own; common mechanisms have one full home.
4. **Specialist limits.** Spatial and temporal representation have practical homes;
   GIS, semantic-web engineering, scientific array stores and storage firmware
   have explicit boundaries in the field map. We can broaden those separately.
5. **Scale.** The count is an estimate of distinct investigations, not a production
   quota. Independent challenge and writing may merge or split pages. Reducing the
   count is useful only when the reader still reaches the promised understanding.

The next decision is whether these are the right coverage and boundaries. After
we look at them together, step 3 can challenge the plan independently, followed
by article briefs and connected writing batches. None of that work is performed
or authorised for publication by this planning handoff.
