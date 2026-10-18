# Databases and storage: proposed page tree

18 October 2026. Steps 1 and 2 only: proposal for discussion, before independent
planning review, writing or publication. See the [section plan](databases-and-storage-plan.md)
for reasoning and reading journeys. The coverage maps define what each page owns.

**144 proposed articles: 62 existing destinations to reassess and 82 new
destinations. Four existing tool pages sit alongside them.** This is an estimate
of distinct investigations, not a page quota or a claim that existing prose is complete.

`Existing` includes published reading and working drafts; their actual status is
unchanged. `New` means a proposed destination, often developed from an existing
article. No proposed URL has been created.

## Field guide and shared decisions

[Detailed coverage and proposed destinations](coverage/databases-and-storage.md)

- **F01** Databases and storage · Existing
- **F02** Describing a storage workload · New
- **F03** What a read and a successful write promise · New
- **F04** Log-structured storage and compaction · New
- **F05** Keeping a derived copy correct · New
- **F06** Moving data between stores · New
- **F07** Evaluating a storage design · New
- **F08** Protecting data through its lifetime · New

## Relational databases, distributed SQL and PostgreSQL

[Detailed coverage and proposed destinations](coverage/relational.md#proposed-whole-collection-structure)

### Starting and designing

- **R01** Relational databases · Existing
- **R02** Designing your data · Existing
- **R03** Types, missing values and time · New
- **R04** Constraints in depth · Existing
- **R05** Tables and JSON · Existing

### Queries and transactions

- **R06** Querying your data · Existing
- **R07** How a query runs · Existing
- **R08** Pagination and large results · Existing
- **R09** Transactions and concurrency · Existing
- **R10** Isolation and snapshots · Existing
- **R11** Handling conflicts and uncertain outcomes · Existing
- **R30** SQL for histories and analytical questions · New

### Indexes, storage and performance

- **R12** Indexes · Existing
- **R13** Indexing queries: diagnosis and patterns · Existing
- **R14** Maintaining indexes · Existing
- **R15** Storage and durability · Existing
- **R16** The buffer pool · Existing
- **R17** Understanding database performance · Existing
- **R18** The database work behind an application request · Existing
- **R19** Reporting on operational data · Existing

### Capacity, operations and choice

- **R20** Scaling a relational database · Existing
- **R21** Replication and failover · Existing
- **R22** Partitioning and sharding · Existing
- **R23** Backups and recovery · Existing
- **R24** Changing a schema while the application runs · Existing
- **R25** Controlling access · Existing
- **R26** When should you add another system? · Existing
- **R27** Retention and deletion · Existing
- **R28** Checkpoints, torn pages and the log · Existing
- **R29** Sharing a database between tenants · New
- **R31** Choosing a relational database · Existing
- **R32** Running an embedded database · New
- **R33** The last blue mug · Existing
- **R38** Routine maintenance and safe upgrades · New

### Distributed SQL

- **R34** Distributed SQL · Existing
- **R35** Replicated ranges and distributed reads · New
- **R36** Transactions across machines · New
- **R37** Locality, capacity and operating distributed SQL · New

### PostgreSQL

- **PG01** Inside PostgreSQL · Existing
- **PG02** Planning and executing a PostgreSQL query · Existing
- **PG03** Indexes in PostgreSQL · Existing
- **PG04** Row versions, transactions and vacuum · Existing
- **PG05** WAL, checkpoints and recovery · Existing
- **PG06** Following a change to another PostgreSQL server · Existing
- **PG07** Where distributed PostgreSQL work runs · Existing
- **PG08** JSON queries in PostgreSQL · Existing
- **PG09** Full-text search in PostgreSQL · Existing
- **PG10** Vector search in PostgreSQL · Existing
- **PG11** Types and extensions in PostgreSQL · Existing

Tools: existing SQL sandbox and SQL practice/setup guide.

## Document databases

[Detailed coverage and proposed destinations](coverage/documents.md)

- **D01** Document databases · Existing
- **D02** What belongs in one document? · New
- **D03** Querying nested records · New
- **D04** Indexes for document queries · New
- **D05** Atomic document changes and transactions · New
- **D06** Evolving document structure · New
- **D07** Distributing and operating documents · New
- **D08** MongoDB's storage and request path · New
- **D09** Replicated documents and conflicts · New
- **D10** Choosing a document store · New

## Key-value and wide-column stores

[Detailed coverage and proposed destinations](coverage/key-value-and-wide-column.md)

- **K01** Key-value and wide-column stores · Existing
- **K02** Designing keys from access patterns · New
- **K03** Hot keys, buckets and changing partitions · New
- **K04** Secondary indexes and alternate layouts · New
- **K05** Conditional writes and atomic work · New
- **K06** Replication, quorum reads and conflicts · New
- **K07** Expiry, tombstones and operating partitioned data · New
- **K08** DynamoDB's request and capacity model · New
- **K09** Cassandra and ScyllaDB's partition path · New
- **K10** Building a keyed application · New
- **K11** Choosing a keyed store · New

## Analytics and time series

[Detailed coverage and proposed destinations](coverage/analytics.md)

- **A01** Analytical databases · New
- **A02** Modelling data for analysis · New
- **A03** Column storage, ordering and compression · Existing
- **A04** Executing analytical queries · New
- **A05** Sorted layouts and precomputed results · New
- **A06** Ingesting and correcting analytical data · New
- **A07** Columnar files and data layout · New
- **A08** Tables and query engines on object storage · New
- **A09** Time-series data and event time · New
- **A10** Querying and rolling up time series · New
- **A11** Cardinality, retention and time-series capacity · New
- **A12** Inside a ClickHouse table · New
- **A13** Analysis with DuckDB · New
- **A14** Choosing an analytical system · New
- **A15** Operating analytical workloads · New

## Search and vector retrieval

[Detailed coverage and proposed destinations](coverage/search.md)

- **S01** Search and vector retrieval · Existing
- **S02** Text analysis and inverted indexes · New
- **S03** Ranking lexical results · New
- **S04** Filters, facets and result pages · New
- **S05** Embeddings and nearest neighbours · New
- **S06** Approximate indexes and filtered retrieval · New
- **S07** Combining and reranking candidates · New
- **S08** Evaluating retrieval quality · New
- **S09** Updating and rebuilding a search index · New
- **S10** Serving search safely and reliably · New
- **S11** Inside an Elasticsearch search · New
- **S12** Choosing a search or vector store · New

## Graph databases

[Detailed coverage and proposed destinations](coverage/graphs.md)

- **G01** Graph databases · Existing
- **G02** Modelling relationships · New
- **G03** Paths, cycles and traversal cost · New
- **G04** Graph algorithms for application questions · New
- **G05** Changing and operating a graph · New
- **G06** Following a query through Neo4j · New
- **G07** Choosing a graph representation and store · New

## Caches and in-memory stores

[Detailed coverage and proposed destinations](coverage/caching.md)

- **C01** Caches and in-memory stores · Existing
- **C02** Freshness, invalidation and fill races · New
- **C03** Keys, admission and eviction · New
- **C04** Miss storms and overloaded sources · New
- **C05** Losing a cache and recovering in-memory state · New
- **C06** Redis and Valkey request paths · New
- **C07** Counters, rate limits and short-lived ownership · New
- **C08** Choosing a cache arrangement · New

## Object storage

[Detailed coverage and proposed destinations](coverage/object-storage.md)

- **O01** Object storage · Existing
- **O02** Keys, metadata and object layout · Existing
- **O03** Uploads, downloads and integrity · Existing
- **O04** Consistency and concurrent writers · Existing
- **O05** Publishing a dataset · Existing
- **O06** Access and private uploads · Existing
- **O07** Objects and database records · Existing
- **O08** Delivering and caching objects · Existing
- **O09** Events and object-processing workflows · Existing
- **O10** Versions, retention and recovery · Existing
- **O11** Performance, storage classes and cost · Existing
- **O12** Amazon S3 in practice · Existing
- **O13** S3 Tables · Existing
- **O14** S3 Vectors · Existing
- **O15** Choosing object, file or database storage · New

Tools: existing object-storage model sandbox and real-S3 practice worksheet.

## Filesystems and block storage

[Detailed coverage and proposed destinations](coverage/files-and-block-storage.md)

- **B01** Files, objects and volumes · New
- **B02** File writes, visibility and persistence · New
- **B03** Sharing files and concurrent changes · New
- **B04** Network and shared filesystems · New
- **B05** Storage devices, volumes and failure domains · New
- **B06** Measuring storage performance · New
- **B07** Snapshots, corruption and recovery · New
- **B08** Capacity, access and operating filesystems · New
- **B09** Choosing a file or volume arrangement · New

## What this tree leaves out

The [field map](coverage/databases-and-storage.md#deliberate-boundaries) records
the limits explicitly: the shared distributed-systems programme remains parked;
messaging, AI application engineering and observability keep their own planned
fields; specialist GIS, RDF/ontology and scientific-array work are bounded rather
than silently treated as complete. Existing route aliases are compatibility
destinations, and the dated vector assessment remains separate.
