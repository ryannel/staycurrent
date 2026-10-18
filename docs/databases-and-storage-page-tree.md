# Databases and storage: revised page tree

18 October 2026. **Proposal for discussion.** Derived independently for every
collection, then challenged and coordinated. The [section plan](databases-and-storage-plan.md)
explains scope and decisions; each map supplies the ability-to-section allocation.

**313 proposed investigations** include family explanations, comparisons and
selected implementation branches. They are optional task paths, not one compulsory
course. Existing tools, aliases and retained references are separate. IDs are stable
discussion references, not reading order or newly created URLs.

## Field guide and shared decisions

Start with FD01; FD02 describes a workload, FD06 evaluates candidates, FD04/FD05 handle copied state and migration.

[Full coverage, worked cases and page boundaries](coverage/databases-and-storage.md)

### Field orientation and shared decisions

- **FD01** [Databases and storage](coverage/databases-and-storage.md#pages-derived-from-the-tasks)
- **FD02** [Describe the workload](coverage/databases-and-storage.md#pages-derived-from-the-tasks)
- **FD03** [Read and write promises](coverage/databases-and-storage.md#pages-derived-from-the-tasks)
- **FD04** [Keep a derived copy correct](coverage/databases-and-storage.md#pages-derived-from-the-tasks)
- **FD05** [Move between stores](coverage/databases-and-storage.md#pages-derived-from-the-tasks)
- **FD06** [Evaluate a storage design](coverage/databases-and-storage.md#pages-derived-from-the-tasks)
- **FD07** [Protect and retire data across stores](coverage/databases-and-storage.md#pages-derived-from-the-tasks)

## Relational databases

Start: RL76. Choose: RL76. Wrong rows: RL81/RL82. Slow query: RL87/RL103. Missing commit reply: RL93. Recover: RL96. Live change: RL100, then RL119/RL130; upgrades RL122/RL131; SQL migration RL132.

[Full coverage, worked cases and page boundaries](coverage/relational.md)

### Choose the service

- **RL76** [Relational databases: introduction and choices](coverage/relational.md#rl76--relational-databases-introduction-and-choices)
### Design facts and guarantees

- **RL77** [Relations, keys and normalisation](coverage/relational.md#rl77--relations-keys-and-normalisation)
- **RL78** [Values, missing data and equality](coverage/relational.md#rl78--values-missing-data-and-equality)
- **RL79** [Constraints and tenant boundaries](coverage/relational.md#rl79--constraints-and-tenant-boundaries)
- **RL80** [History, correction and deletion](coverage/relational.md#rl80--history-correction-and-deletion)
### Query and change the right rows

- **RL81** [Joins and the meaning of a result row](coverage/relational.md#rl81--joins-and-the-meaning-of-a-result-row)
- **RL82** [Aggregates, windows and ordered results](coverage/relational.md#rl82--aggregates-windows-and-ordered-results)
- **RL83** [Pagination and consistent exports](coverage/relational.md#rl83--pagination-and-consistent-exports)
- **RL84** [Updates, upserts and bulk imports](coverage/relational.md#rl84--updates-upserts-and-bulk-imports)
- **RL85** [SQL at the application boundary](coverage/relational.md#rl85--sql-at-the-application-boundary)
### Make query work affordable

- **RL86** [Indexes and access paths](coverage/relational.md#rl86--indexes-and-access-paths)
- **RL87** [Query execution and bad plans](coverage/relational.md#rl87--query-execution-and-bad-plans)
- **RL89** [Table partitioning and data lifecycle](coverage/relational.md#rl89--table-partitioning-and-data-lifecycle)
### Concurrency and durable application work

- **RL90** [Transactions and isolation](coverage/relational.md#rl90--transactions-and-isolation)
- **RL91** [Locks, contention and deadlocks](coverage/relational.md#rl91--locks-contention-and-deadlocks)
- **RL92** [Row versions, storage and cleanup](coverage/relational.md#rl92--row-versions-storage-and-cleanup)
- **RL93** [Retries when a commit reply is missing](coverage/relational.md#rl93--retries-when-a-commit-reply-is-missing)
- **RL94** [Outboxes and database-backed jobs](coverage/relational.md#rl94--outboxes-and-database-backed-jobs)
### Durability, copies and recovery

- **RL95** [Write-ahead logs and crash recovery](coverage/relational.md#rl95--write-ahead-logs-and-crash-recovery)
- **RL96** [Backup, restore and reconciliation](coverage/relational.md#rl96--backup-restore-and-reconciliation)
- **RL97** [Replicas, lag and read routing](coverage/relational.md#rl97--replicas-lag-and-read-routing)
- **RL98** [Failover and fencing](coverage/relational.md#rl98--failover-and-fencing)
### Change and operate the service

- **RL100** [Live schema changes and backfills](coverage/relational.md#rl100--live-schema-changes-and-backfills)
- **RL102** [Connections, overload and capacity](coverage/relational.md#rl102--connections-overload-and-capacity)
- **RL103** [Diagnosing a database incident](coverage/relational.md#rl103--diagnosing-a-database-incident)
- **RL104** [Database access and least privilege](coverage/relational.md#rl104--database-access-and-least-privilege)
### Distribute relational work

- **RL105** [Sharding and distributed SQL](coverage/relational.md#rl105--sharding-and-distributed-sql)
- **RL106** [Transactions across partitions](coverage/relational.md#rl106--transactions-across-partitions)
- **RL107** [Time, snapshots and distributed reads](coverage/relational.md#rl107--time-snapshots-and-distributed-reads)
- **RL108** [Regional placement and survival](coverage/relational.md#rl108--regional-placement-and-survival)
- **RL109** [Rebalancing and cluster change](coverage/relational.md#rl109--rebalancing-and-cluster-change)
### PostgreSQL implementation

- **RL110** [PostgreSQL processes, pages and row versions](coverage/relational.md#rl110--postgresql-processes-pages-and-row-versions)
- **RL111** [PostgreSQL vacuum and transaction age](coverage/relational.md#rl111--postgresql-vacuum-and-transaction-age)
- **RL112** [PostgreSQL index methods and operators](coverage/relational.md#rl112--postgresql-index-methods-and-operators)
- **RL113** [Reading and repairing PostgreSQL plans](coverage/relational.md#rl113--reading-and-repairing-postgresql-plans)
- **RL114** [PostgreSQL JSON and structured alternatives](coverage/relational.md#rl114--postgresql-json-and-structured-alternatives)
- **RL115** [PostgreSQL WAL, checkpoints and durability](coverage/relational.md#rl115--postgresql-wal-checkpoints-and-durability)
- **RL116** [Restoring PostgreSQL to a recovery target](coverage/relational.md#rl116--restoring-postgresql-to-a-recovery-target)
- **RL117** [PostgreSQL physical replicas and promotion](coverage/relational.md#rl117--postgresql-physical-replicas-and-promotion)
- **RL118** [PostgreSQL logical replication and change feeds](coverage/relational.md#rl118--postgresql-logical-replication-and-change-feeds)
- **RL119** [PostgreSQL schema changes under load](coverage/relational.md#rl119--postgresql-schema-changes-under-load)
- **RL120** [Operating and diagnosing PostgreSQL](coverage/relational.md#rl120--operating-and-diagnosing-postgresql)
- **RL121** [PostgreSQL roles, policies and privileged code](coverage/relational.md#rl121--postgresql-roles-policies-and-privileged-code)
- **RL122** [Upgrading and migrating PostgreSQL](coverage/relational.md#rl122--upgrading-and-migrating-postgresql)
### CockroachDB implementation

- **RL123** [CockroachDB keys, ranges and replication](coverage/relational.md#rl123--cockroachdb-keys-ranges-and-replication)
- **RL124** [CockroachDB transactions and retries](coverage/relational.md#rl124--cockroachdb-transactions-and-retries)
- **RL125** [CockroachDB isolation and follower reads](coverage/relational.md#rl125--cockroachdb-isolation-and-follower-reads)
- **RL126** [CockroachDB query work and hot ranges](coverage/relational.md#rl126--cockroachdb-query-work-and-hot-ranges)
- **RL127** [CockroachDB table locality and region survival](coverage/relational.md#rl127--cockroachdb-table-locality-and-region-survival)
- **RL128** [Operating and securing a CockroachDB cluster](coverage/relational.md#rl128--operating-and-securing-a-cockroachdb-cluster)
- **RL129** [CockroachDB backup and recovery](coverage/relational.md#rl129--cockroachdb-backup-and-recovery)
- **RL130** [CockroachDB schema jobs under load](coverage/relational.md#rl130--cockroachdb-schema-jobs-under-load)
- **RL131** [Upgrading a CockroachDB cluster](coverage/relational.md#rl131--upgrading-a-cockroachdb-cluster)
- **RL132** [Moving a SQL application to CockroachDB](coverage/relational.md#rl132--moving-a-sql-application-to-cockroachdb)

## Document databases

Start and choose: DC53. Wrong result: DC55. Slow query: DC56/DC74. A write reply never arrived: DC57, then DC66/DC68 for MongoDB. Recover: DC61 → DC73. Live shape/cluster change: DC59/DC60 → DC72/DC70.

[Full coverage, worked cases and page boundaries](coverage/documents.md)

### Family: choosing and modelling

- **DC53** [Document databases: introduction and choices](coverage/documents.md#dc53--document-databases-introduction-and-choices)
- **DC54** [Modelling document boundaries](coverage/documents.md#dc54--modelling-document-boundaries)
### Family: querying and correctness

- **DC55** [Querying nested and changing documents](coverage/documents.md#dc55--querying-nested-and-changing-documents)
- **DC56** [Indexing nested data](coverage/documents.md#dc56--indexing-nested-data)
- **DC57** [Preserving invariants across document writes](coverage/documents.md#dc57--preserving-invariants-across-document-writes)
- **DC58** [Keeping duplicated document data correct](coverage/documents.md#dc58--keeping-duplicated-document-data-correct)
### Family: changing and operating

- **DC59** [Evolving document schemas](coverage/documents.md#dc59--evolving-document-schemas)
- **DC60** [Distributing documents and tenants](coverage/documents.md#dc60--distributing-documents-and-tenants)
- **DC61** [Operating a document database](coverage/documents.md#dc61--operating-a-document-database)
### MongoDB implementation: local execution

- **DC62** [How MongoDB stores documents](coverage/documents.md#dc62--how-mongodb-stores-documents)
- **DC63** [Updating MongoDB documents safely](coverage/documents.md#dc63--updating-mongodb-documents-safely)
- **DC64** [MongoDB indexes and query plans](coverage/documents.md#dc64--mongodb-indexes-and-query-plans)
- **DC65** [MongoDB aggregation pipelines](coverage/documents.md#dc65--mongodb-aggregation-pipelines)
- **DC66** [MongoDB transactions and retries](coverage/documents.md#dc66--mongodb-transactions-and-retries)
### MongoDB implementation: failure and distribution

- **DC67** [MongoDB replica sets and surviving history](coverage/documents.md#dc67--mongodb-replica-sets-and-surviving-history)
- **DC68** [MongoDB clients, reads and write acknowledgement](coverage/documents.md#dc68--mongodb-clients-reads-and-write-acknowledgement)
- **DC69** [Choosing MongoDB shard keys](coverage/documents.md#dc69--choosing-mongodb-shard-keys)
- **DC70** [Changing a MongoDB sharded cluster](coverage/documents.md#dc70--changing-a-mongodb-sharded-cluster)
### MongoDB implementation: changes and operation

- **DC71** [MongoDB change streams and projection repair](coverage/documents.md#dc71--mongodb-change-streams-and-projection-repair)
- **DC72** [Migrating MongoDB document schemas](coverage/documents.md#dc72--migrating-mongodb-document-schemas)
- **DC73** [Backing up and restoring MongoDB](coverage/documents.md#dc73--backing-up-and-restoring-mongodb)
- **DC74** [Diagnosing MongoDB incidents](coverage/documents.md#dc74--diagnosing-mongodb-incidents)
- **DC75** [Securing and maintaining MongoDB](coverage/documents.md#dc75--securing-and-maintaining-mongodb)

## Key-value and wide-column stores

Key-value start and choice: K01. Wide-column start: W01; choose: W04. DynamoDB selection: K01 → D01/D06. Wrong result: D02 or C02/C05; slow request: D06 or C04/C11. Missing write reply: K03 → D04/D07 or C05/C06/C10. Recover: D09 or C14/C15. Change: D11 or C12/C17. Authoritative in-memory use enters the shared Redis path in the cache map.

[Full coverage, worked cases and page boundaries](coverage/key-value-and-wide-column.md)

### Key-value decisions

- **K01** [Key-value stores: operations and choices](coverage/key-value-and-wide-column.md#k01--key-value-stores-operations-and-choices)
- **K02** [Keys, distribution and bounded retrieval](coverage/key-value-and-wide-column.md#k02--keys-distribution-and-bounded-retrieval)
- **K03** [Conditional changes and invariants](coverage/key-value-and-wide-column.md#k03--conditional-changes-and-invariants)
### DynamoDB implementation

- **D01** [Items, keys and table design](coverage/key-value-and-wide-column.md#d01--items-keys-and-table-design)
- **D02** [Reading, filtering and continuation](coverage/key-value-and-wide-column.md#d02--reading-filtering-and-continuation)
- **D03** [Secondary indexes and new access paths](coverage/key-value-and-wide-column.md#d03--secondary-indexes-and-new-access-paths)
- **D04** [Conditional mutations and request identity](coverage/key-value-and-wide-column.md#d04--conditional-mutations-and-request-identity)
- **D05** [Transactions and isolation](coverage/key-value-and-wide-column.md#d05--transactions-and-isolation)
- **D06** [Capacity, skew and throttling](coverage/key-value-and-wide-column.md#d06--capacity-skew-and-throttling)
- **D07** [Reliable clients and bounded retries](coverage/key-value-and-wide-column.md#d07--reliable-clients-and-bounded-retries)
- **D08** [Streams, expiry and derived consumers](coverage/key-value-and-wide-column.md#d08--streams-expiry-and-derived-consumers)
- **D09** [Backup, restore and cutover](coverage/key-value-and-wide-column.md#d09--backup-restore-and-cutover)
- **D10** [DynamoDB global tables with multi-Region eventual consistency](coverage/key-value-and-wide-column.md#d10--dynamodb-global-tables-with-multi-region-eventual-consistency)
- **D11** [Changing a live DynamoDB model](coverage/key-value-and-wide-column.md#d11--changing-a-live-dynamodb-model)
- **D12** [DynamoDB global tables with multi-Region strong consistency](coverage/key-value-and-wide-column.md#d12--dynamodb-global-tables-with-multi-region-strong-consistency)
- **D13** [Permissions and service operation](coverage/key-value-and-wide-column.md#d13--permissions-and-service-operation)
### Wide-column decisions

- **W01** [Wide-column stores: partitions and ordered rows](coverage/key-value-and-wide-column.md#w01--wide-column-stores-partitions-and-ordered-rows)
- **W02** [Buckets, late data and sustained ingestion](coverage/key-value-and-wide-column.md#w02--buckets-late-data-and-sustained-ingestion)
- **W03** [More than one query](coverage/key-value-and-wide-column.md#w03--more-than-one-query)
- **W04** [Choosing a wide-column service](coverage/key-value-and-wide-column.md#w04--choosing-a-wide-column-service)
### Cassandra implementation

- **C01** [CQL data models and a real cluster](coverage/key-value-and-wide-column.md#c01--cql-data-models-and-a-real-cluster)
- **C02** [Replica placement and consistency levels](coverage/key-value-and-wide-column.md#c02--replica-placement-and-consistency-levels)
- **C03** [The write path and restart](coverage/key-value-and-wide-column.md#c03--the-write-path-and-restart)
- **C04** [The read path and amplification](coverage/key-value-and-wide-column.md#c04--the-read-path-and-amplification)
- **C05** [Timestamps, mutations and batches](coverage/key-value-and-wide-column.md#c05--timestamps-mutations-and-batches)
- **C06** [Lightweight transactions](coverage/key-value-and-wide-column.md#c06--lightweight-transactions)
- **C07** [Catch-up and repair coverage](coverage/key-value-and-wide-column.md#c07--catch-up-and-repair-coverage)
- **C08** [Compaction and maintenance debt](coverage/key-value-and-wide-column.md#c08--compaction-and-maintenance-debt)
- **C09** [Deletes, expiry and tombstone safety](coverage/key-value-and-wide-column.md#c09--deletes-expiry-and-tombstone-safety)
- **C10** [Drivers, paging and retry load](coverage/key-value-and-wide-column.md#c10--drivers-paging-and-retry-load)
- **C11** [Diagnosing a running cluster](coverage/key-value-and-wide-column.md#c11--diagnosing-a-running-cluster)
- **C12** [Topology changes and replacement](coverage/key-value-and-wide-column.md#c12--topology-changes-and-replacement)
- **C13** [Multi-datacentre operation](coverage/key-value-and-wide-column.md#c13--multi-datacentre-operation)
- **C14** [Backups and recoverable history](coverage/key-value-and-wide-column.md#c14--backups-and-recoverable-history)
- **C15** [Restore and application reconciliation](coverage/key-value-and-wide-column.md#c15--restore-and-application-reconciliation)
- **C16** [Storage-attached indexes and query alternatives](coverage/key-value-and-wide-column.md#c16--storage-attached-indexes-and-query-alternatives)
- **C17** [Schema change and rolling upgrades](coverage/key-value-and-wide-column.md#c17--schema-change-and-rolling-upgrades)

## Analytics and time series

Start: AN01. Choose an analytical or time-series system: AN46. Time-series start: AN23. Wrong answer: AN02/AN03/AN24. Slow query: AN07/AN08. Missing load reply: AN10, then AN37 for ClickHouse. Recover: AN14 and the selected native branch. Change: AN15/AN42.

[Full coverage, worked cases and page boundaries](coverage/analytics.md)

### Analytical answers

- **AN01** [What does this analytical system have to answer?](coverage/analytics.md#an01--what-does-this-analytical-system-have-to-answer)
- **AN02** [Facts, changing dimensions and historical answers](coverage/analytics.md#an02--facts-changing-dimensions-and-historical-answers)
- **AN03** [Which aggregates can you combine?](coverage/analytics.md#an03--which-aggregates-can-you-combine)
### Column layout and execution

- **AN04** [What a column store avoids reading](coverage/analytics.md#an04--what-a-column-store-avoids-reading)
- **AN05** [Sorting, pruning and a second layout](coverage/analytics.md#an05--sorting-pruning-and-a-second-layout)
- **AN06** [Partitions, file sizes and compaction](coverage/analytics.md#an06--partitions-file-sizes-and-compaction)
- **AN07** [Where a columnar query spends its work](coverage/analytics.md#an07--where-a-columnar-query-spends-its-work)
- **AN08** [Joins and groups that outgrow memory](coverage/analytics.md#an08--joins-and-groups-that-outgrow-memory)
- **AN09** [Distributed analytical queries](coverage/analytics.md#an09--distributed-analytical-queries)
### Copies, corrections and a running service

- **AN10** [Ingestion, acknowledgement and replay](coverage/analytics.md#an10--ingestion-acknowledgement-and-replay)
- **AN11** [Correcting records in an append-oriented store](coverage/analytics.md#an11--correcting-records-in-an-append-oriented-store)
- **AN12** [Backfills and proof that a copy is current](coverage/analytics.md#an12--backfills-and-proof-that-a-copy-is-current)
- **AN13** [Capacity, concurrency and analytical cost](coverage/analytics.md#an13--capacity-concurrency-and-analytical-cost)
- **AN14** [Recovering analytical answers](coverage/analytics.md#an14--recovering-analytical-answers)
- **AN15** [Changing an analytical service while it runs](coverage/analytics.md#an15--changing-an-analytical-service-while-it-runs)
- **AN16** [Access, retention and erasure across analytical copies](coverage/analytics.md#an16--access-retention-and-erasure-across-analytical-copies)
### Tables on object storage

- **AN17** [How files become a transactional table](coverage/analytics.md#an17--how-files-become-a-transactional-table)
- **AN18** [Evolving and correcting a file table](coverage/analytics.md#an18--evolving-and-correcting-a-file-table)
- **AN19** [Maintaining and choosing a shared table stack](coverage/analytics.md#an19--maintaining-and-choosing-a-shared-table-stack)
- **AN20** [Iceberg commits through a real catalogue](coverage/analytics.md#an20--iceberg-commits-through-a-real-catalogue)
- **AN21** [Iceberg evolution and row corrections](coverage/analytics.md#an21--iceberg-evolution-and-row-corrections)
- **AN22** [Iceberg maintenance and recovery](coverage/analytics.md#an22--iceberg-maintenance-and-recovery)
### Time-series meaning and implementation

- **AN23** [Series, samples, counters and rates](coverage/analytics.md#an23--series-samples-counters-and-rates)
- **AN24** [Time windows, alignment and missing values](coverage/analytics.md#an24--time-windows-alignment-and-missing-values)
- **AN25** [Late measurements, downsampling and retention](coverage/analytics.md#an25--late-measurements-downsampling-and-retention)
- **AN26** [Physical design for time-series work](coverage/analytics.md#an26--physical-design-for-time-series-work)
- **AN27** [Timescale hypertables, chunks and column storage](coverage/analytics.md#an27--timescale-hypertables-chunks-and-column-storage)
- **AN28** [Timescale aggregates, refresh and retained history](coverage/analytics.md#an28--timescale-aggregates-refresh-and-retained-history)
- **AN29** [Operating and recovering a Timescale service](coverage/analytics.md#an29--operating-and-recovering-a-timescale-service)
### Continuously maintained SQL results: updating answers as inputs change

- **AN30** [Maintaining an answer as inputs change](coverage/analytics.md#an30--maintaining-an-answer-as-inputs-change)
- **AN31** [Time, progress and bounded maintenance state](coverage/analytics.md#an31--time-progress-and-bounded-maintenance-state)
- **AN32** [Restarting and replacing maintained results](coverage/analytics.md#an32--restarting-and-replacing-maintained-results)
- **AN33** [When a maintained SQL system earns another service](coverage/analytics.md#an33--when-a-maintained-sql-system-earns-another-service)
### ClickHouse as a coherent serving branch

- **AN34** [MergeTree parts, granules and merges](coverage/analytics.md#an34--mergetree-parts-granules-and-merges)
- **AN35** [Designing ClickHouse tables for the queries](coverage/analytics.md#an35--designing-clickhouse-tables-for-the-queries)
- **AN36** [ClickHouse inserts and part pressure](coverage/analytics.md#an36--clickhouse-inserts-and-part-pressure)
- **AN37** [Retries and replacement records in ClickHouse](coverage/analytics.md#an37--retries-and-replacement-records-in-clickhouse)
- **AN38** [ClickHouse updates, deletes and physical change](coverage/analytics.md#an38--clickhouse-updates-deletes-and-physical-change)
- **AN39** [Diagnosing a ClickHouse query](coverage/analytics.md#an39--diagnosing-a-clickhouse-query)
- **AN40** [ClickHouse views and aggregate-state tables](coverage/analytics.md#an40--clickhouse-views-and-aggregate-state-tables)
- **AN41** [ClickHouse shards, replicas and distributed paths](coverage/analytics.md#an41--clickhouse-shards-replicas-and-distributed-paths)
- **AN42** [Operating and changing a ClickHouse service](coverage/analytics.md#an42--operating-and-changing-a-clickhouse-service)
- **AN43** [Backing up, restoring and reconciling ClickHouse](coverage/analytics.md#an43--backing-up-restoring-and-reconciling-clickhouse)
### Local work and engine choice

- **AN44** [Analysing files with DuckDB](coverage/analytics.md#an44--analysing-files-with-duckdb)
- **AN45** [DuckDB resources, persistence and deployment boundaries](coverage/analytics.md#an45--duckdb-resources-persistence-and-deployment-boundaries)
- **AN46** [Choosing an analytical or time-series system](coverage/analytics.md#an46--choosing-an-analytical-or-time-series-system)

## Search and vector retrieval

Start: SR01. Choose a search/vector system: SR02. Missing/poor hit: SR19. Slow search: SR27/SR37. Missing indexing reply: SR21/SR22, then SR31/SR32 for Elasticsearch. Recover: SR28/SR40. Live index/model change: SR23/SR39.

[Full coverage, worked cases and page boundaries](coverage/search.md)

### Search contracts and corpus design

- **SR01** [What a search result promises](coverage/search.md#sr01--what-a-search-result-promises)
- **SR02** [Choosing a search or vector retrieval system](coverage/search.md#sr02--choosing-a-search-or-vector-retrieval-system)
- **SR03** [Choose the records search will see](coverage/search.md#sr03--choose-the-records-search-will-see)
### Lexical retrieval

- **SR04** [How an inverted index finds the best matches](coverage/search.md#sr04--how-an-inverted-index-finds-the-best-matches)
- **SR05** [Turn text into searchable terms](coverage/search.md#sr05--turn-text-into-searchable-terms)
- **SR06** [Write lexical queries and explain their ranking](coverage/search.md#sr06--write-lexical-queries-and-explain-their-ranking)
- **SR07** [Search while the reader types](coverage/search.md#sr07--search-while-the-reader-types)
- **SR08** [Change query meaning with synonyms and rewrites](coverage/search.md#sr08--change-query-meaning-with-synonyms-and-rewrites)
### Vector representation and access paths

- **SR09** [What similarity vectors preserve](coverage/search.md#sr09--what-similarity-vectors-preserve)
- **SR10** [Exact neighbours and HNSW graph search](coverage/search.md#sr10--exact-neighbours-and-hnsw-graph-search)
- **SR11** [Search vector partitions with IVF](coverage/search.md#sr11--search-vector-partitions-with-ivf)
- **SR12** [Compress vectors without hiding the loss](coverage/search.md#sr12--compress-vectors-without-hiding-the-loss)
- **SR13** [Find neighbours inside a filter](coverage/search.md#sr13--find-neighbours-inside-a-filter)
### Retrieval pipelines and result semantics

- **SR14** [Combine lexical and vector candidates](coverage/search.md#sr14--combine-lexical-and-vector-candidates)
- **SR15** [Spend ranking work on the right candidates](coverage/search.md#sr15--spend-ranking-work-on-the-right-candidates)
- **SR16** [What facets and counts actually count](coverage/search.md#sr16--what-facets-and-counts-actually-count)
- **SR17** [Fetch, explain and page through results](coverage/search.md#sr17--fetch-explain-and-page-through-results)
### Quality and diagnosis

- **SR18** [Evaluate retrieval against what readers need](coverage/search.md#sr18--evaluate-retrieval-against-what-readers-need)
- **SR19** [Diagnose a search miss and validate the repair](coverage/search.md#sr19--diagnose-a-search-miss-and-validate-the-repair)
- **SR20** [Measure the retrieval tradeoff on your workload](coverage/search.md#sr20--measure-the-retrieval-tradeoff-on-your-workload)
### Projection lifecycle

- **SR21** [Keep source changes in order](coverage/search.md#sr21--keep-source-changes-in-order)
- **SR22** [When indexed changes become visible](coverage/search.md#sr22--when-indexed-changes-become-visible)
- **SR23** [Replace an index generation while writes continue](coverage/search.md#sr23--replace-an-index-generation-while-writes-continue)
### Permissions and application boundaries

- **SR24** [Make every retrieval stage respect access](coverage/search.md#sr24--make-every-retrieval-stage-respect-access)
- **SR25** [Isolate tenants and bound search requests](coverage/search.md#sr25--isolate-tenants-and-bound-search-requests)
### Distributed search and operation

- **SR26** [Search across shards and replicas](coverage/search.md#sr26--search-across-shards-and-replicas)
- **SR27** [Keep search inside its resource budget](coverage/search.md#sr27--keep-search-inside-its-resource-budget)
- **SR28** [Recover a search service and change its version](coverage/search.md#sr28--recover-a-search-service-and-change-its-version)
### Elasticsearch: corpus, ingestion and lexical retrieval

- **SR29** [Map and inspect an Elasticsearch corpus](coverage/search.md#sr29--map-and-inspect-an-elasticsearch-corpus)
- **SR30** [Diagnose Elasticsearch lexical queries](coverage/search.md#sr30--diagnose-elasticsearch-lexical-queries)
- **SR31** [Ingest source revisions into Elasticsearch](coverage/search.md#sr31--ingest-source-revisions-into-elasticsearch)
- **SR32** [Follow an Elasticsearch write through refresh and recovery](coverage/search.md#sr32--follow-an-elasticsearch-write-through-refresh-and-recovery)
### Elasticsearch: query execution and ranking

- **SR33** [Trace an Elasticsearch query across shards](coverage/search.md#sr33--trace-an-elasticsearch-query-across-shards)
- **SR34** [Build and tune filtered vector search in Elasticsearch](coverage/search.md#sr34--build-and-tune-filtered-vector-search-in-elasticsearch)
- **SR35** [Assemble an Elasticsearch hybrid ranking pipeline](coverage/search.md#sr35--assemble-an-elasticsearch-hybrid-ranking-pipeline)
### Elasticsearch: protection and diagnosis

- **SR36** [Enforce and test Elasticsearch access boundaries](coverage/search.md#sr36--enforce-and-test-elasticsearch-access-boundaries)
- **SR37** [Investigate a slow or incomplete Elasticsearch search](coverage/search.md#sr37--investigate-a-slow-or-incomplete-elasticsearch-search)
### Elasticsearch: deployment, evolution and recovery

- **SR38** [Place shards and recover from node loss in Elasticsearch](coverage/search.md#sr38--place-shards-and-recover-from-node-loss-in-elasticsearch)
- **SR39** [Replace an Elasticsearch index without losing changes](coverage/search.md#sr39--replace-an-elasticsearch-index-without-losing-changes)
- **SR40** [Restore and upgrade Elasticsearch as a usable system](coverage/search.md#sr40--restore-and-upgrade-elasticsearch-as-a-usable-system)

## Graph databases

Start and choose: GR-A01. Wrong paths: GR-A04/GR-A05; expensive query: GR-A07. Missing mutation reply: GR-A08 → GR-A22 or GR-A29. Recover: GR-A13 → GR-A25/GR-A32. Live model/import change: GR-A02/GR-A09 → GR-A21/GR-A29/GR-A32. RDF start: GR-A15.

[Full coverage, worked cases and page boundaries](coverage/graphs.md)

### General graph group

- **GR-A01** [Graph databases: introduction and choices](coverage/graphs.md#gr-a01--graph-databases-introduction-and-choices)
- **GR-A02** [Modelling entities and relationships](coverage/graphs.md#gr-a02--modelling-entities-and-relationships)
- **GR-A03** [Graph history and late information](coverage/graphs.md#gr-a03--graph-history-and-late-information)
- **GR-A04** [Patterns, paths and duplicate answers](coverage/graphs.md#gr-a04--patterns-paths-and-duplicate-answers)
- **GR-A05** [Shortest paths and bounded searches](coverage/graphs.md#gr-a05--shortest-paths-and-bounded-searches)
- **GR-A06** [How graph storage finds neighbours](coverage/graphs.md#gr-a06--how-graph-storage-finds-neighbours)
- **GR-A07** [Why a small graph query does so much work](coverage/graphs.md#gr-a07--why-a-small-graph-query-does-so-much-work)
- **GR-A08** [Correct graph mutations under concurrency](coverage/graphs.md#gr-a08--correct-graph-mutations-under-concurrency)
- **GR-A09** [Loading and synchronising a graph](coverage/graphs.md#gr-a09--loading-and-synchronising-a-graph)
- **GR-A10** [What graph algorithms tell you](coverage/graphs.md#gr-a10--what-graph-algorithms-tell-you)
- **GR-A11** [Building and running an analytical graph](coverage/graphs.md#gr-a11--building-and-running-an-analytical-graph)
- **GR-A12** [Replicating and partitioning connected data](coverage/graphs.md#gr-a12--replicating-and-partitioning-connected-data)
- **GR-A13** [Recovering a graph service](coverage/graphs.md#gr-a13--recovering-a-graph-service)
- **GR-A14** [Access, disclosure and deletion in graphs](coverage/graphs.md#gr-a14--access-disclosure-and-deletion-in-graphs)
### RDF group

- **GR-A15** [RDF identity, datasets and provenance](coverage/graphs.md#gr-a15--rdf-identity-datasets-and-provenance)
- **GR-A16** [Inference and validation in RDF](coverage/graphs.md#gr-a16--inference-and-validation-in-rdf)
- **GR-A17** [SPARQL answers and property paths](coverage/graphs.md#gr-a17--sparql-answers-and-property-paths)
- **GR-A18** [Querying across RDF endpoints](coverage/graphs.md#gr-a18--querying-across-rdf-endpoints)
### Neo4j group

- **GR-A19** [Neo4j stores, caches and resource pressure](coverage/graphs.md#gr-a19--neo4j-stores-caches-and-resource-pressure)
- **GR-A20** [Reading and improving Cypher plans](coverage/graphs.md#gr-a20--reading-and-improving-cypher-plans)
- **GR-A21** [Neo4j schema, import and cutover](coverage/graphs.md#gr-a21--neo4j-schema-import-and-cutover)
- **GR-A22** [Neo4j concurrent writes and driver requests](coverage/graphs.md#gr-a22--neo4j-concurrent-writes-and-driver-requests)
- **GR-A23** [Neo4j durable commits and restart](coverage/graphs.md#gr-a23--neo4j-durable-commits-and-restart)
- **GR-A24** [Neo4j clustering and scaling choices](coverage/graphs.md#gr-a24--neo4j-clustering-and-scaling-choices)
- **GR-A25** [Neo4j backup, restore and reconciliation](coverage/graphs.md#gr-a25--neo4j-backup-restore-and-reconciliation)
- **GR-A26** [Verifying Neo4j access controls](coverage/graphs.md#gr-a26--verifying-neo4j-access-controls)
- **GR-A27** [Neo4j Graph Data Science in practice](coverage/graphs.md#gr-a27--neo4j-graph-data-science-in-practice)
### Jena TDB2/Fuseki group

- **GR-A28** [TDB2 storage and SPARQL execution](coverage/graphs.md#gr-a28--tdb2-storage-and-sparql-execution)
- **GR-A29** [Transactions and updates in TDB2/Fuseki](coverage/graphs.md#gr-a29--transactions-and-updates-in-tdb2fuseki)
- **GR-A30** [Configuring inference and validation in Jena](coverage/graphs.md#gr-a30--configuring-inference-and-validation-in-jena)
- **GR-A31** [Serving RDF safely with Fuseki](coverage/graphs.md#gr-a31--serving-rdf-safely-with-fuseki)
- **GR-A32** [Maintaining and restoring TDB2/Fuseki](coverage/graphs.md#gr-a32--maintaining-and-restoring-tdb2fuseki)

## Caches and in-memory stores

Start: CA-A01. Choose: CA-A10. Stale or forbidden hit: CA-A02. Source overload: CA-A03. Missing mutation reply: CA-A06/CA-A13. Recover: CA-A08/CA-A14. Change/incident: CA-A09/CA-A17. Authoritative Redis path skips source-cache coherence unless it also caches.

[Full coverage, worked cases and page boundaries](coverage/caching.md)

### Cache role, validity and capacity

- **CA-A01** [Caches and in-memory stores](coverage/caching.md#ca-a01--caches-and-in-memory-stores)
- **CA-A02** [Cache keys, freshness and invalidation](coverage/caching.md#ca-a02--cache-keys-freshness-and-invalidation)
- **CA-A03** [Misses without source overload](coverage/caching.md#ca-a03--misses-without-source-overload)
- **CA-A04** [Admission, eviction and memory budgets](coverage/caching.md#ca-a04--admission-eviction-and-memory-budgets)
### In-memory state and service reliability

- **CA-A05** [Model state around its operations](coverage/caching.md#ca-a05--model-state-around-its-operations)
- **CA-A06** [Atomic changes and uncertain replies](coverage/caching.md#ca-a06--atomic-changes-and-uncertain-replies)
- **CA-A07** [What an accepted update survives](coverage/caching.md#ca-a07--what-an-accepted-update-survives)
- **CA-A08** [Rebuild a cache or restore accepted state](coverage/caching.md#ca-a08--rebuild-a-cache-or-restore-accepted-state)
- **CA-A09** [Diagnose and change a running cache or store](coverage/caching.md#ca-a09--diagnose-and-change-a-running-cache-or-store)
### Choose an implementation

- **CA-A10** [Choose a cache or an in-memory store](coverage/caching.md#ca-a10--choose-a-cache-or-an-in-memory-store)
### Redis Open Source in practice

- **CA-A11** [Redis execution and memory](coverage/caching.md#ca-a11--redis-execution-and-memory)
- **CA-A12** [Redis clients, cache fills and local copies](coverage/caching.md#ca-a12--redis-clients-cache-fills-and-local-copies)
- **CA-A13** [Redis structures and atomic updates](coverage/caching.md#ca-a13--redis-structures-and-atomic-updates)
- **CA-A14** [Redis persistence and restore](coverage/caching.md#ca-a14--redis-persistence-and-restore)
- **CA-A15** [Redis replicas and Sentinel failover](coverage/caching.md#ca-a15--redis-replicas-and-sentinel-failover)
- **CA-A16** [Redis Cluster routing and resharding](coverage/caching.md#ca-a16--redis-cluster-routing-and-resharding)
- **CA-A17** [Operate and change Redis with evidence](coverage/caching.md#ca-a17--operate-and-change-redis-with-evidence)

## Object storage

Start: OB-A01. Choose: OB-A15. Wrong bytes: OB-A04. Slow work: OB-A14. Missing request reply: OB-A05/OB-S03. Recover: OB-A13/OB-S09. Namespace migration: OB-A16.

[Full coverage, worked cases and page boundaries](coverage/object-storage.md)

### Names, bytes and requests

- **OB-A01** [What object storage gives an application](coverage/object-storage.md#ob-a01--what-object-storage-gives-an-application)
- **OB-A02** [Names, versions and metadata](coverage/object-storage.md#ob-a02--names-versions-and-metadata)
- **OB-A03** [Uploading and reading large objects](coverage/object-storage.md#ob-a03--uploading-and-reading-large-objects)
- **OB-A04** [Checking which bytes arrived](coverage/object-storage.md#ob-a04--checking-which-bytes-arrived)
- **OB-A05** [Concurrent writes and uncertain outcomes](coverage/object-storage.md#ob-a05--concurrent-writes-and-uncertain-outcomes)
### Application protocols

- **OB-A06** [Publishing a complete release](coverage/object-storage.md#ob-a06--publishing-a-complete-release)
- **OB-A07** [Accepting uploads into an application](coverage/object-storage.md#ob-a07--accepting-uploads-into-an-application)
- **OB-A08** [Access, delegation and encryption keys](coverage/object-storage.md#ob-a08--access-delegation-and-encryption-keys)
- **OB-A09** [Serving content through caches](coverage/object-storage.md#ob-a09--serving-content-through-caches)
- **OB-A10** [Processing changes and rebuilding derived state](coverage/object-storage.md#ob-a10--processing-changes-and-rebuilding-derived-state)
### Lifecycle, operation and selection

- **OB-A11** [Versions, preservation and deletion](coverage/object-storage.md#ob-a11--versions-preservation-and-deletion)
- **OB-A12** [Storage tiers and the cost of a workload](coverage/object-storage.md#ob-a12--storage-tiers-and-the-cost-of-a-workload)
- **OB-A13** [Recovery that restores an application](coverage/object-storage.md#ob-a13--recovery-that-restores-an-application)
- **OB-A14** [Diagnosing slow and expensive object work](coverage/object-storage.md#ob-a14--diagnosing-slow-and-expensive-object-work)
- **OB-A15** [Choosing and testing an object storage service](coverage/object-storage.md#ob-a15--choosing-and-testing-an-object-storage-service)
- **OB-A16** [Migrating a live object namespace](coverage/object-storage.md#ob-a16--migrating-a-live-object-namespace)
### Amazon S3 implementation

- **OB-S01** [Working with S3 general purpose buckets](coverage/object-storage.md#ob-s01--working-with-s3-general-purpose-buckets)
- **OB-S02** [S3 multipart transfers and checksums](coverage/object-storage.md#ob-s02--s3-multipart-transfers-and-checksums)
- **OB-S03** [Conditional operations in S3](coverage/object-storage.md#ob-s03--conditional-operations-in-s3)
- **OB-S04** [Direct uploads, S3 permissions and finalisation](coverage/object-storage.md#ob-s04--direct-uploads-s3-permissions-and-finalisation)
- **OB-S05** [Private S3 delivery through CloudFront](coverage/object-storage.md#ob-s05--private-s3-delivery-through-cloudfront)
- **OB-S06** [S3 notifications and reconciliation](coverage/object-storage.md#ob-s06--s3-notifications-and-reconciliation)
- **OB-S07** [S3 versions, expiry and Object Lock](coverage/object-storage.md#ob-s07--s3-versions-expiry-and-object-lock)
- **OB-S08** [Choosing S3 classes and restoring archives](coverage/object-storage.md#ob-s08--choosing-s3-classes-and-restoring-archives)
- **OB-S09** [S3 replication and application recovery](coverage/object-storage.md#ob-s09--s3-replication-and-application-recovery)
- **OB-S10** [Investigating an S3 workload](coverage/object-storage.md#ob-s10--investigating-an-s3-workload)
- **OB-S11** [When directory buckets change the object protocol](coverage/object-storage.md#ob-s11--when-directory-buckets-change-the-object-protocol)

## Filesystems and block storage

Start and choose local/shared files versus block/object interface: FS-G01; Linux filesystem choice: FS-C01. Slow I/O: FS-G13. Local short/error/flush outcome: FS-G03/FS-G04; uncertain remote-file reply: FS-G08/FS-N02. Recover: FS-G16. Change: FS-G09/FS-G18 and the selected native layer.

[Full coverage, worked cases and page boundaries](coverage/files-and-block-storage.md)

### Interfaces and application correctness

- **FS-G01** [Files, shared directories and block volumes](coverage/files-and-block-storage.md#fs-g01--files-shared-directories-and-block-volumes)
- **FS-G02** [Paths, opened files and changing names](coverage/files-and-block-storage.md#fs-g02--paths-opened-files-and-changing-names)
- **FS-G03** [Reading and writing bytes](coverage/files-and-block-storage.md#fs-g03--reading-and-writing-bytes)
- **FS-G04** [When a saved file survives a crash](coverage/files-and-block-storage.md#fs-g04--when-a-saved-file-survives-a-crash)
- **FS-G05** [How a filesystem recovers its structures](coverage/files-and-block-storage.md#fs-g05--how-a-filesystem-recovers-its-structures)
- **FS-G06** [Concurrent writers and coherent file generations](coverage/files-and-block-storage.md#fs-g06--concurrent-writers-and-coherent-file-generations)
- **FS-G07** [File access, path safety and encryption boundaries](coverage/files-and-block-storage.md#fs-g07--file-access-path-safety-and-encryption-boundaries)
- **FS-G08** [Sharing files across machines](coverage/files-and-block-storage.md#fs-g08--sharing-files-across-machines)
### Devices and volumes

- **FS-G09** [Provisioning and resizing a storage stack](coverage/files-and-block-storage.md#fs-g09--provisioning-and-resizing-a-storage-stack)
- **FS-G10** [The device beneath the block interface](coverage/files-and-block-storage.md#fs-g10--the-device-beneath-the-block-interface)
- **FS-G11** [Redundancy, failure and rebuilding arrays](coverage/files-and-block-storage.md#fs-g11--redundancy-failure-and-rebuilding-arrays)
### Capacity, evidence and recovery

- **FS-G12** [Why a volume is full](coverage/files-and-block-storage.md#fs-g12--why-a-volume-is-full)
- **FS-G13** [Finding storage latency](coverage/files-and-block-storage.md#fs-g13--finding-storage-latency)
- **FS-G14** [Measuring storage without changing the question](coverage/files-and-block-storage.md#fs-g14--measuring-storage-without-changing-the-question)
- **FS-G15** [Taking a recoverable snapshot](coverage/files-and-block-storage.md#fs-g15--taking-a-recoverable-snapshot)
- **FS-G16** [Restoring the application after storage failure](coverage/files-and-block-storage.md#fs-g16--restoring-the-application-after-storage-failure)
- **FS-G17** [Detecting damage and choosing repair or restore](coverage/files-and-block-storage.md#fs-g17--detecting-damage-and-choosing-repair-or-restore)
- **FS-G18** [Moving a live file tree](coverage/files-and-block-storage.md#fs-g18--moving-a-live-file-tree)
### Choosing an implementation

- **FS-C01** [Choosing ext4, XFS or OpenZFS for a Linux service](coverage/files-and-block-storage.md#fs-c01--choosing-ext4-xfs-or-openzfs-for-a-linux-service)
### The Linux implementation branch

- **FS-L01** [XFS allocation, extents and reflink copies](coverage/files-and-block-storage.md#fs-l01--xfs-allocation-extents-and-reflink-copies)
- **FS-L02** [The XFS write path and metadata log](coverage/files-and-block-storage.md#fs-l02--the-xfs-write-path-and-metadata-log)
- **FS-L03** [Creating, governing and resizing XFS](coverage/files-and-block-storage.md#fs-l03--creating-governing-and-resizing-xfs)
- **FS-L04** [XFS health, log recovery and repair](coverage/files-and-block-storage.md#fs-l04--xfs-health-log-recovery-and-repair)
- **FS-L05** [Building and changing LVM mappings](coverage/files-and-block-storage.md#fs-l05--building-and-changing-lvm-mappings)
- **FS-L06** [LVM thin pools and snapshots under load](coverage/files-and-block-storage.md#fs-l06--lvm-thin-pools-and-snapshots-under-load)
- **FS-L07** [Encrypted Linux volumes and key recovery](coverage/files-and-block-storage.md#fs-l07--encrypted-linux-volumes-and-key-recovery)
### Hosted block storage

- **FS-E01** [EBS volumes, performance and ownership](coverage/files-and-block-storage.md#fs-e01--ebs-volumes-performance-and-ownership)
- **FS-E02** [EBS snapshots and restored-volume readiness](coverage/files-and-block-storage.md#fs-e02--ebs-snapshots-and-restored-volume-readiness)
### Network filesystems

- **FS-N01** [A Linux NFSv4.1 share and its access boundary](coverage/files-and-block-storage.md#fs-n01--a-linux-nfsv41-share-and-its-access-boundary)
- **FS-N02** [NFS client state, outages and diagnosis](coverage/files-and-block-storage.md#fs-n02--nfs-client-state-outages-and-diagnosis)
