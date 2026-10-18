# Databases and storage: field coverage map

18 October 2026. Proposed teaching homes for discussion, from steps 1 and 2 of
the [section plan](../databases-and-storage-plan.md). This map owns field-wide
teaching and boundaries; each linked collection map owns its internal breakdown.
The proposal has not had independent planning review. No new page is commissioned
or published by appearing here.

## Map conventions

IDs are stable references for discussion, not a reading sequence. Each table row
is one proposed article; the named sections in its coverage cell divide its
teaching responsibility. Titles and section names are provisional. `New` means
there is no equivalent destination; `existing` identifies material to assess and
revise, not a passed depth review. An existing draft remains a draft. Article
roles follow reader needs; they are not mandatory page lengths.

Each collection states its running example and the tasks its reader should be
able to perform. The forms column says what must be visible or reproducible:
traces expose state changes; worked cases expose decisions; measurements need a
real implementation and recorded conditions; variations may use a bounded model.
An implementation page owns product-specific commands, settings and exceptions.

Paths in backticks are proposed destinations, not available-reading links.
Unqualified slugs append to the collection's base. A row with an absolute path
preserves an existing route outside that base. The entry pages and product pages
are included in article counts; tools and historical aliases are listed apart.

## Shared understanding and decisions

Running example: a repair shop sells blue mug P7 to customer 42, stores photographs,
keeps device D17's readings, and builds reports and searchable manuals. These are
different demands the guide can compare, not a requirement to deploy every store.

Reader outcome: specify those demands, interpret a store's promises, choose what
to investigate, and evaluate a change without losing ownership of the data.

Base for new destinations: `/learn/databases/`.

| ID | Proposed page and role | Owned sections and reader outcome | Teaching form | Entry needs; onward homes | Existing material / destination |
| --- | --- | --- | --- | --- | --- |
| F01 | Databases and storage — field guide | What storage does; records, bytes and queries; transactional, analytical and retrieval work; overlapping approaches; starting designs and reasons to reconsider. Recognise a useful family entrance. | Small records and contrasting operations; one system assembled only as needs arise. | No database knowledge. Onward to F02 or any collection entrance. | Existing `choosing/`; retain route. |
| F02 | Describing a storage workload — practical guide | Access-pattern inventory; data size and growth; distribution and hot items; concurrency; latency percentiles and throughput; freshness; recovery targets; operating constraints. Produce a workload brief with uncertainties. | Three worked briefs: checkout, device history and analytical report; small unit and capacity calculations. | F01-level vocabulary, supplied locally. F03, F07 and family comparisons. | New `workloads/`. |
| F03 | What a read and a successful write promise — deep dive | Atomicity, isolation and durability as separate questions; one-copy and replicated observations; stale and read-your-writes reads; consistency scope; missing replies and retry identity; failure and recovery targets. Interpret a concrete API contract without deriving every protocol. | Trace one record through two clients, a delayed copy and a lost reply; contrast guarantees on the same history. | Understand read and write. R09–R11 own transaction mechanisms, R21 leader failover, K06 quorum conflict cases, O04 object requests. | New `read-and-write-guarantees/`. |
| F04 | Log-structured storage and compaction — deep dive | Buffer and log; sorted immutable runs; read and range lookup; Bloom filters; flush; merge policies; version reconciliation and tombstones; read, write and space amplification; backpressure. Predict which work accumulates and what a policy trades. | Follow P7 updates through runs; vary overwrite rate and merge policy; count work in a labelled model. | A short reminder of ordered access supplied here; R12 is the B-tree contrast. K07 and S09 own store-specific maintenance. | New `log-structured-storage/`. |
| F05 | Keeping a derived copy correct — deep dive | Source of truth; snapshot plus change stream; capture position and retention; identity and ordering; retries and deletion; backfill/live overlap; lag and reconciliation; rebuilding and schema compatibility. Design a repairable copy. | P7 revision 7/8, a late update, a missed delete and a resumed backfill; source/target checkpoints. | Basic read/write vocabulary. F06 owns cutover; R26 owns whether to add a system; A06/S09/O09 apply this to their stores. | New `derived-copies/`; existing outbox and copy material informs it. |
| F06 | Moving data between stores — practical guide | Compatibility inventory; type and identifier mapping; copy and catch-up; validation; traffic shadowing; authority cutover; rollback window and divergent writes; retiring old copies. Plan a migration that can prove completion. | One shop migration with count, value and invariant checks; failed cutover and repair. | F05's copy model; explain briefly for direct entrants. R24 owns live schema changes within a database. | New `data-migrations/`. |
| F07 | Evaluating a storage design — practical guide | Credible baseline; representative distributions and queries; load generation; latency and errors under saturation; warm/cold behaviour; maintenance and failure tests; cost and operating effort; decision record. Design a fair test and say what it cannot establish. | Compare two designs for one workload; spot a misleading benchmark; cost the full path. | F02. Family comparisons provide candidates, B06 owns volume measurements, S08 owns relevance judgements. | New `evaluating-storage/`. |
| F08 | Protecting data through its lifetime — practical guide | Ownership and least privilege; tenant boundaries; encryption and key lifecycle; audit records; retention; deletion across replicas, derivatives and backups; recovery access; testing the controls. Turn policy into verifiable storage behaviour. | Track one customer's record through four copies and a restore; role/action matrix. | No security specialism assumed. R25/R27, O06/O10 and B08 own interface-specific controls; F05 owns propagation. | New `data-protection/`; does not provide legal or compliance advice. |

## Collection entrances and complete maps

| Reader's job | Coverage home | Why it is a collection |
| --- | --- | --- |
| Keep related records correct and query them flexibly | [Relational databases](relational.md#proposed-whole-collection-structure) | Representation, execution and correctness require several connected mechanisms and operational practices. |
| Store and evolve records with nested, varying structure | [Document databases](documents.md) | Aggregate boundaries shape reads, updates, indexes and distribution. |
| Serve known keys and ordered groups at scale | [Key-value and wide-column stores](key-value-and-wide-column.md) | Access paths, distribution, write promises and maintenance must be designed together. |
| Analyse large histories, events and time series | [Analytics and time series](analytics.md) | Layout, execution, ingestion and correction determine both results and cost. |
| Retrieve and rank useful candidates | [Search and vector retrieval](search.md) | Retrieval quality and filtering need distinct evaluation alongside storage behaviour. |
| Query paths through connected records | [Graph databases](graphs.md) | Path semantics and expansion costs differ from simply storing references. |
| Reuse answers or use an in-memory data structure | [Caches and in-memory stores](caching.md) | Freshness, memory pressure, misses and recovery are the design. |
| Store, publish and deliver named bytes | [Object storage](object-storage.md) | Request semantics and application lifecycle replace assumptions about files and transactions. |
| Work through files or supply a database's volume | [Filesystems and block storage](files-and-block-storage.md) | File semantics and volume persistence have their own guarantees and failure cases. |

Distributed SQL belongs to the relational map. Time-series work belongs to the
analytics map; keyed histories belong to the key-value map. Product examples can
appear in more than one collection, but substantial shared teaching has one home.

## Ownership at the joins

| Part | Full teaching home | Other pages supply only what their own reader needs |
| --- | --- | --- |
| Pages, dirty buffers, write-ahead log and local crash recovery | R15; R16 owns buffer sizing and PG05 owns PostgreSQL recovery procedures | F04 introduces its own buffer/log context; B02 owns filesystem persistence rather than re-teaching database recovery. |
| B-tree structure, clustered/heap lookup, covering and write cost | R12; preserved detailed Indexes map | D04 and PG03 teach product-specific access paths; K04 teaches an alternate keyed arrangement. |
| LSM, sorted runs, Bloom filters and compaction | F04 | K07, A12 and S09 explain their actual engine's maintenance and consequences. |
| Common copy/rebuild protocol and source ownership | F05 | Family ingestion and replication pages explain their contracts and local failure cases. A replica and a derived index remain distinct. |
| Transactions, snapshots and relational concurrency | R09–R11 | F03 orients; D05, K05 and O04 show the actual unit and API of their own atomic operation. |
| Single-leader relational replication and promotion | R21 | R35 teaches consensus over ranges; K06 teaches its own consistency and conflict model. |
| Immutable dataset generation and manifest publication | O05 | A08 owns table snapshots, catalog commits and table maintenance, not an arbitrary application manifest. |
| Column layout and encoding | A03 at the existing column-stores route | R19 introduces analytical pressure; A12 owns ClickHouse's implementation. |
| Analytical admission, resource isolation and workload recovery | A15 | A12/A13 supply implementation procedures; F07 owns general evaluation, A14 compares responsibility and cost. |
| Time windows, series identity, event time and downsampling | A09–A11 | K02/K03 own the placement of device history; observability signal collection is outside this field. |
| Lexical retrieval, vectors, filtered ANN and quality evaluation | S02–S08 | PG09/PG10 and O14 own PostgreSQL and S3 implementations; the dated assessment is separate. |
| Object authority, signed requests and validation | O06 | F08 frames policy; S10 owns search-result permission enforcement. |
| Spatial and temporal values | R03 for representation; PG11 for PostgreSQL ranges/PostGIS; S04 for geo filtering; A09 for event time | Introductions link when needed. No general GIS course is implied. |
| Database connections, pooling, ORMs and application query work | R18 | Family implementation pages teach their clients' distinctive semantics; API design is outside this field. |
| Storage throughput, latency, queue depth and physical failure domains | B05–B07 | F07 owns the whole-system evaluation; R15 owns what a database asks a flush to do. |
| Cross-store retention and access policy | F08 | Family operation pages own actual enforcement; R27 owns relational retention mechanics. |

## Deliberate boundaries

| Area | Status and local treatment |
| --- | --- |
| Shared distributed-systems programme | Parked. Teach the database mechanisms needed for R21/R35/R36/K06; do not commission a general clocks, consensus or coordination series. |
| Messaging and stream processing | Planned other field. F05/A06/O09 explain enough ordering, replay and idempotency for a storage pipeline; broker internals, delivery protocols and general stream processors remain there. |
| AI application engineering | Planned other field. S05/S08 teach embedding compatibility, source preparation and retrieval evaluation. Model training, prompting, generation and full RAG applications remain there. |
| Observability | Planned other field. A09–A11 own storage and querying of time series. Instrumentation, tracing systems and alert design remain elsewhere. |
| SQL reference and administration reference | Link to versioned manuals. Teach worked query shapes and diagnostic procedures; do not reproduce every statement, setting, system view or error code. |
| RDF and knowledge graphs | G01 contrasts property graphs, triples and reasoning; G07 compares when the distinction changes the job. A full ontology, SPARQL and inference series is deferred until a reader journey justifies it. |
| Spatial databases | Practical representation, indexes and queries in R03/PG11/S04. Full GIS, raster processing and coordinate-system engineering deferred. |
| Scientific arrays, media-specific databases and HPC storage | Mention at F01's boundary where appropriate; defer specialist query models and parallel I/O. They serve a different practitioner scope from the core application and analytical workloads here. |
| Database implementation and formal proofs | Mechanisms needed to predict behaviour are included. Writing an engine, proving consensus and implementing query optimisers are outside the route. |
| Offline synchronisation and local-first applications | D09 owns revision conflicts, replication and deletion for a document store; R32 owns embedded operation. A full CRDT/synchronisation programme is deferred, with necessary conflict cases taught locally. |
| Storage hardware and distributed filesystem internals | B05/B07 own device, volume and fault-domain choices. Firmware, flash translation layers, erasure-coding implementation and a full Ceph/ZFS internals series are reference links unless a concrete decision needs a short explanation. |
| Licensing, prices, service limits and capability changes | Evidence to check in each comparison or implementation commission, with dates and conditions. No fixed ranking or current recommendation is established by this map. |
| Dated assessments | Separate from durable teaching. Retain the Postgres vector assessment and revisit its evidence when commissioned; do not invent an updates feed. |

## Evidence used to check the scope

The outcome breakdown sets the scope. These primary sources were inspected on
18 October 2026 to challenge the proposed
topic boundaries. They are starting points for later article research, not
verification of every proposed explanation or current product advice.

- [PostgreSQL manual contents](https://www.postgresql.org/docs/current/index.html): query, concurrency, operations and internals coverage.
- [MongoDB embedding](https://www.mongodb.com/docs/manual/data-modeling/embedding/): aggregate boundaries and atomic document work.
- [DynamoDB modelling building blocks](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/data-modeling-blocks.html): keyed groups, tenancy, sparse indexes, expiry and write distribution.
- [ClickHouse materialised views and projections](https://github.com/ClickHouse/clickhouse-docs/blob/main/docs/data-modeling/projections/2_materialized-views-versus-projections.md): alternative layouts and maintained results need distinct treatment.
- [Elasticsearch search documentation](https://www.elastic.co/docs/solutions/search): ingestion, retrieval approaches, ranking and application paths.
- [Neo4j getting started](https://neo4j.com/docs/getting-started/): graph representation and query entry points.
- [Apache Iceberg specification](https://iceberg.apache.org/spec/): table metadata, snapshots and evolution as a layer above objects.
- [CockroachDB architecture](https://docs.cockroachlabs.com/docs/stable/architecture/overview): separate distributed execution, transaction and storage questions.
- [Amazon S3 overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html): byte-storage operations and the distinction between S3 resource types.
- [Linux VFS overview](https://cdn.kernel.org/doc/html/latest/filesystems/vfs.html): file operations, namespaces and persistence hooks.

The existing reading inventories, article-work records and the three house
reference articles supply local context. Proposed product pages still require
versioned primary evidence and appropriate execution before they can be ready
drafts. No full technical or independent planning review has been performed here.
