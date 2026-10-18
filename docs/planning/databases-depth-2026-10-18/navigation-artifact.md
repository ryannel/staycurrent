# Proposed reading entrances and article titles

Audience: an intelligent application engineer new to each subject, with programming
and records. Titles and groupings below describe proposed reading. They are not a
required sequence; the implementation branches are optional paths for their users.

## Field guide and shared decisions

### Field orientation and shared decisions

- FD01 — Databases and storage
- FD02 — Describe the workload
- FD03 — Read and write promises
- FD04 — Keep a derived copy correct
- FD05 — Move between stores
- FD06 — Evaluate a storage design
- FD07 — Protect and retire data across stores

## Relational databases

### Choose the service

- RL76 — Choosing a relational database
### Design facts and guarantees

- RL77 — Relations, keys and normalisation
- RL78 — Values, missing data and equality
- RL79 — Constraints and tenant boundaries
- RL80 — History, correction and deletion
### Query and change the right rows

- RL81 — Joins and the meaning of a result row
- RL82 — Aggregates, windows and ordered results
- RL83 — Pagination and consistent exports
- RL84 — Updates, upserts and bulk imports
- RL85 — SQL at the application boundary
### Make query work affordable

- RL86 — Indexes and access paths
- RL87 — Query execution and bad plans
- RL89 — Table partitioning and data lifecycle
### Concurrency and durable application work

- RL90 — Transactions and isolation
- RL91 — Locks, contention and deadlocks
- RL92 — Row versions, storage and cleanup
- RL93 — Retries and unknown commit outcomes
- RL94 — Outboxes and database-backed jobs
### Durability, copies and recovery

- RL95 — Write-ahead logs and crash recovery
- RL96 — Backup, restore and reconciliation
- RL97 — Replicas, lag and read routing
- RL98 — Failover and fencing
### Change and operate the service

- RL100 — Live schema changes and backfills
- RL102 — Connections, overload and capacity
- RL103 — Diagnosing a database incident
- RL104 — Database access and least privilege
### Distribute relational work

- RL105 — Sharding and distributed SQL
- RL106 — Transactions across partitions
- RL107 — Time, snapshots and distributed reads
- RL108 — Regional placement and survival
- RL109 — Rebalancing and cluster change
### PostgreSQL implementation

- RL110 — PostgreSQL processes, pages and row versions
- RL111 — PostgreSQL vacuum and transaction age
- RL112 — PostgreSQL index methods and operators
- RL113 — Reading and repairing PostgreSQL plans
- RL114 — PostgreSQL JSON and structured alternatives
- RL115 — PostgreSQL WAL, checkpoints and durability
- RL116 — Restoring PostgreSQL to a recovery target
- RL117 — PostgreSQL physical replicas and promotion
- RL118 — PostgreSQL logical replication and change feeds
- RL119 — PostgreSQL schema changes under load
- RL120 — Operating and diagnosing PostgreSQL
- RL121 — PostgreSQL roles, policies and privileged code
- RL122 — Upgrading and migrating PostgreSQL
### CockroachDB implementation

- RL123 — CockroachDB keys, ranges and replication
- RL124 — CockroachDB transactions and retries
- RL125 — CockroachDB isolation and follower reads
- RL126 — CockroachDB query work and hot ranges
- RL127 — CockroachDB table locality and region survival
- RL128 — Operating and securing a CockroachDB cluster
- RL129 — CockroachDB backup and recovery
- RL130 — CockroachDB schema jobs under load
- RL131 — Upgrading a CockroachDB cluster
- RL132 — Moving a SQL application to CockroachDB

## Document databases

### General route: choosing and modelling

- DC53 — Choosing a document database
- DC54 — Modelling document boundaries
### General route: querying and correctness

- DC55 — Querying nested and changing documents
- DC56 — Indexing nested data
- DC57 — Preserving invariants across document writes
- DC58 — Keeping duplicated document data correct
### General route: changing and operating

- DC59 — Evolving document schemas
- DC60 — Distributing documents and tenants
- DC61 — Operating a document database
### MongoDB route: local execution

- DC62 — How MongoDB stores documents
- DC63 — Updating MongoDB documents safely
- DC64 — MongoDB indexes and query plans
- DC65 — MongoDB aggregation pipelines
- DC66 — MongoDB transactions and retries
### MongoDB route: failure and distribution

- DC67 — MongoDB replica sets and surviving history
- DC68 — MongoDB clients, reads and write acknowledgement
- DC69 — Choosing MongoDB shard keys
- DC70 — Changing a MongoDB sharded cluster
### MongoDB route: changes and operation

- DC71 — MongoDB change streams and projection repair
- DC72 — Migrating MongoDB document schemas
- DC73 — Backing up and restoring MongoDB
- DC74 — Diagnosing MongoDB incidents
- DC75 — Securing and maintaining MongoDB

## Key-value and wide-column stores

### Common key-value reasoning: three pages

- K01 — Choosing a keyed data contract.
- K02 — Keys, distribution and bounded retrieval.
- K03 — Conditional changes and invariants.
### DynamoDB: thirteen pages

- D01 — Items, keys and table design.
- D02 — Reading, filtering and continuation.
- D03 — Secondary indexes and new access paths.
- D04 — Conditional mutations and request identity.
- D05 — Transactions and isolation.
- D06 — Capacity, skew and throttling.
- D07 — Reliable clients and bounded retries.
- D08 — Streams, expiry and derived consumers.
- D09 — Backup, restore and cutover.
- D10 — MREC global tables.
- D11 — Changing a live DynamoDB model.
- D12 — MRSC global tables.
- D13 — Permissions and service operation.
### Wide-column reasoning: four pages

- W01 — Partitions and ordered rows.
- W02 — Buckets, late data and sustained ingestion.
- W03 — More than one query.
- W04 — Choosing a wide-column service.
### Cassandra: seventeen pages and one reusable lab environment

- C01 — CQL data models and a real cluster.
- C02 — Replica placement and consistency levels.
- C03 — The write path and restart.
- C04 — The read path and amplification.
- C05 — Timestamps, mutations and batches.
- C06 — Lightweight transactions.
- C07 — Catch-up and repair coverage.
- C08 — Compaction and maintenance debt.
- C09 — Deletes, expiry and tombstone safety.
- C10 — Drivers, paging and retry load.
- C11 — Diagnosing a running cluster.
- C12 — Topology changes and replacement.
- C13 — Multi-datacentre operation.
- C14 — Backups and recoverable history.
- C15 — Restore and application reconciliation.
- C16 — Storage-attached indexes and query alternatives.
- C17 — Schema change and rolling upgrades.

## Analytics and time series

### A. Analytical answers

- AN01 — What does this analytical system have to answer?
- AN02 — Facts, changing dimensions and historical answers
- AN03 — Which aggregates can you combine?
### B. Column layout and execution

- AN04 — What a column store avoids reading
- AN05 — Sorting, pruning and a second layout
- AN06 — Partitions, file sizes and compaction
- AN07 — Where a columnar query spends its work
- AN08 — Joins and groups that outgrow memory
- AN09 — Distributed analytical queries
### C. Copies, corrections and a running service

- AN10 — Ingestion, acknowledgement and replay
- AN11 — Correcting records in an append-oriented store
- AN12 — Backfills and proof that a copy is current
- AN13 — Capacity, concurrency and analytical cost
- AN14 — Recovering analytical answers
- AN15 — Changing an analytical service while it runs
- AN16 — Access, retention and erasure across analytical copies
### D. Tables on object storage

- AN17 — How files become a transactional table
- AN18 — Evolving and correcting a file table
- AN19 — Maintaining and choosing a shared table stack
- AN20 — Iceberg commits through a real catalogue
- AN21 — Iceberg evolution and row corrections
- AN22 — Iceberg maintenance and recovery
### E. Time-series meaning and implementation

- AN23 — Series, samples, counters and rates
- AN24 — Time windows, alignment and missing values
- AN25 — Late measurements, downsampling and retention
- AN26 — Physical design for time-series work
- AN27 — Timescale hypertables, chunks and column storage
- AN28 — Timescale aggregates, refresh and retained history
- AN29 — Operating and recovering a Timescale service
### F. Continuously maintained results

- AN30 — Maintaining an answer as inputs change
- AN31 — Time, progress and bounded maintenance state
- AN32 — Restarting and replacing maintained results
- AN33 — When a maintained SQL system earns another service
### G. ClickHouse as a coherent serving branch

- AN34 — MergeTree parts, granules and merges
- AN35 — Designing ClickHouse tables for the queries
- AN36 — ClickHouse inserts and part pressure
- AN37 — Retries and replacement records in ClickHouse
- AN38 — ClickHouse updates, deletes and physical change
- AN39 — Diagnosing a ClickHouse query
- AN40 — ClickHouse views and aggregate-state tables
- AN41 — ClickHouse shards, replicas and distributed paths
- AN42 — Operating and changing a ClickHouse service
- AN43 — Backing up, restoring and reconciling ClickHouse
### H. Local work and engine choice

- AN44 — Analysing files with DuckDB
- AN45 — DuckDB resources, persistence and deployment boundaries
- AN46 — Choosing an analytical engine for the workload

## Search and vector retrieval

### Search contracts and corpus design

- SR01 — What a search result promises.
- SR02 — When to add a search service.
- SR03 — Choose the records search will see.
### Lexical retrieval

- SR04 — How an inverted index finds the best matches.
- SR05 — Turn text into searchable terms.
- SR06 — Write lexical queries and explain their ranking.
- SR07 — Search while the reader types.
- SR08 — Change query meaning with synonyms and rewrites.
### Vector representation and access paths

- SR09 — What similarity vectors preserve.
- SR10 — Exact neighbours and HNSW graph search.
- SR11 — Search vector partitions with IVF.
- SR12 — Compress vectors without hiding the loss.
- SR13 — Find neighbours inside a filter.
### Retrieval pipelines and result semantics

- SR14 — Combine lexical and vector candidates.
- SR15 — Spend ranking work on the right candidates.
- SR16 — What facets and counts actually count.
- SR17 — Fetch, explain and page through results.
### Quality and diagnosis

- SR18 — Evaluate retrieval against what readers need.
- SR19 — Diagnose a search miss and validate the repair.
- SR20 — Measure the retrieval tradeoff on your workload.
### Projection lifecycle

- SR21 — Keep source changes in order.
- SR22 — When indexed changes become visible.
- SR23 — Replace an index generation while writes continue.
### Permissions and application boundaries

- SR24 — Make every retrieval stage respect access.
- SR25 — Isolate tenants and bound search requests.
### Distributed search and operation

- SR26 — Search across shards and replicas.
- SR27 — Keep search inside its resource budget.
- SR28 — Recover a search service and change its version.
### Elasticsearch: corpus, ingestion and lexical retrieval

- SR29 — Map and inspect an Elasticsearch corpus.
- SR30 — Diagnose Elasticsearch lexical queries.
- SR31 — Ingest source revisions into Elasticsearch.
- SR32 — Follow an Elasticsearch write through refresh and recovery.
### Elasticsearch: query execution and ranking

- SR33 — Trace an Elasticsearch query across shards.
- SR34 — Build and tune filtered vector search in Elasticsearch.
- SR35 — Assemble an Elasticsearch hybrid ranking pipeline.
### Elasticsearch: protection and diagnosis

- SR36 — Enforce and test Elasticsearch access boundaries.
- SR37 — Investigate a slow or incomplete Elasticsearch search.
### Elasticsearch: deployment, evolution and recovery

- SR38 — Place shards and recover from node loss in Elasticsearch.
- SR39 — Replace an Elasticsearch index without losing changes.
- SR40 — Restore and upgrade Elasticsearch as a usable system.

## Graph databases

### General graph group

- GR-A01 — Choosing a graph database
- GR-A02 — Modelling entities and relationships
- GR-A03 — Graph history and late information
- GR-A04 — Patterns, paths and duplicate answers
- GR-A05 — Shortest paths and bounded searches
- GR-A06 — How graph storage finds neighbours
- GR-A07 — Why a small graph query does so much work
- GR-A08 — Correct graph mutations under concurrency
- GR-A09 — Loading and synchronising a graph
- GR-A10 — What graph algorithms tell you
- GR-A11 — Building and running an analytical graph
- GR-A12 — Replicating and partitioning connected data
- GR-A13 — Recovering a graph service
- GR-A14 — Access, disclosure and deletion in graphs
### RDF group

- GR-A15 — RDF identity, datasets and provenance
- GR-A16 — Inference and validation in RDF
- GR-A17 — SPARQL answers and property paths
- GR-A18 — Querying across RDF endpoints
### Neo4j group

- GR-A19 — Neo4j stores, caches and resource pressure
- GR-A20 — Reading and improving Cypher plans
- GR-A21 — Neo4j schema, import and cutover
- GR-A22 — Neo4j concurrent writes and driver requests
- GR-A23 — Neo4j durable commits and restart
- GR-A24 — Neo4j clustering and scaling choices
- GR-A25 — Neo4j backup, restore and reconciliation
- GR-A26 — Verifying Neo4j access controls
- GR-A27 — Neo4j Graph Data Science in practice
### Jena TDB2/Fuseki group

- GR-A28 — TDB2 storage and SPARQL execution
- GR-A29 — Transactions and updates in TDB2/Fuseki
- GR-A30 — Configuring inference and validation in Jena
- GR-A31 — Serving RDF safely with Fuseki
- GR-A32 — Maintaining and restoring TDB2/Fuseki

## Caches and in-memory stores

### CA-G01 — Cache role, validity and capacity

- CA-A01 — Caches and in-memory stores
- CA-A02 — Cache keys, freshness and invalidation
- CA-A03 — Misses without source overload
- CA-A04 — Admission, eviction and memory budgets
### CA-G02 — In-memory state and service reliability

- CA-A05 — Model state around its operations
- CA-A06 — Atomic changes and uncertain replies
- CA-A07 — What an accepted update survives
- CA-A08 — Rebuild a cache or restore accepted state
- CA-A09 — Diagnose and change a running cache or store
### CA-G03 — Choose an implementation

- CA-A10 — Choose a cache or an in-memory store
### CA-G04 — Redis Open Source in practice

- CA-A11 — Redis execution and memory
- CA-A12 — Redis clients, cache fills and local copies
- CA-A13 — Redis structures and atomic updates
- CA-A14 — Redis persistence and restore
- CA-A15 — Redis replicas and Sentinel failover
- CA-A16 — Redis Cluster routing and resharding
- CA-A17 — Operate and change Redis with evidence

## Object storage

### General teaching homes

- OB-A01 — What object storage gives an application
- OB-A02 — Names, versions and metadata
- OB-A03 — Uploading and reading large objects
- OB-A04 — Checking which bytes arrived
- OB-A05 — Concurrent writes and uncertain outcomes
- OB-A06 — Publishing a complete release
- OB-A07 — Accepting uploads into an application
- OB-A08 — Access, delegation and encryption keys
- OB-A09 — Serving content through caches
- OB-A10 — Processing changes and rebuilding derived state
- OB-A11 — Versions, preservation and deletion
- OB-A12 — Storage tiers and the cost of a workload
- OB-A13 — Recovery that restores an application
- OB-A14 — Diagnosing slow and expensive object work
- OB-A15 — Choosing and testing an object endpoint
- OB-A16 — Migrating a live object namespace
### The S3 implementation branch

- OB-S01 — Working with S3 general purpose buckets
- OB-S02 — S3 multipart transfers and checksums
- OB-S03 — Conditional operations in S3
- OB-S04 — Direct uploads, S3 permissions and finalisation
- OB-S05 — Private S3 delivery through CloudFront
- OB-S06 — S3 notifications and reconciliation
- OB-S07 — S3 versions, expiry and Object Lock
- OB-S08 — Choosing S3 classes and restoring archives
- OB-S09 — S3 replication and application recovery
- OB-S10 — Investigating an S3 workload
- OB-S11 — When directory buckets change the object protocol

## Filesystems and block storage

### Interfaces and application correctness

- FS-G01 — Files, shared directories and block volumes
- FS-G02 — Paths, opened files and changing names
- FS-G03 — Reading and writing bytes
- FS-G04 — When a saved file survives a crash
- FS-G05 — How a filesystem recovers its structures
- FS-G06 — Concurrent writers and coherent file generations
- FS-G07 — File access, path safety and encryption boundaries
- FS-G08 — Sharing files across machines
### Devices and volumes

- FS-G09 — Provisioning and resizing a storage stack
- FS-G10 — The device beneath the block interface
- FS-G11 — Redundancy, failure and rebuilding arrays
### Capacity, evidence and recovery

- FS-G12 — Why a volume is full
- FS-G13 — Finding storage latency
- FS-G14 — Measuring storage without changing the question
- FS-G15 — Taking a recoverable snapshot
- FS-G16 — Restoring the application after storage failure
- FS-G17 — Detecting damage and choosing repair or restore
- FS-G18 — Moving a live file tree
### Choosing an implementation

- FS-C01 — Choosing ext4, XFS or OpenZFS for a Linux service
### The Linux implementation branch

- FS-L01 — XFS allocation, extents and reflink copies
- FS-L02 — The XFS write path and metadata log
- FS-L03 — Creating, governing and resizing XFS
- FS-L04 — XFS health, log recovery and repair
- FS-L05 — Building and changing LVM mappings
- FS-L06 — LVM thin pools and snapshots under load
- FS-L07 — Encrypted Linux volumes and key recovery
### Hosted block storage

- FS-E01 — EBS volumes, performance and ownership
- FS-E02 — EBS snapshots and restored-volume readiness
### Network filesystems

- FS-N01 — A Linux NFSv4.1 share and its access boundary
- FS-N02 — NFS client state, outages and diagnosis
