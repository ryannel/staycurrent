# Analytical databases, column storage and time-series work: abilities

Independent derivation, 18 October 2026. Planning only. No existing outline, coverage map, page inventory or other derivation was used. The required publication direction and content-structure documents establish scope rules; their linked plans were not opened. This file was saved before assigning article homes. Article boundaries follow in `analytics-proposal.md`.

## Who needs to become capable

An application or data engineer can already read basic SQL and reason about records, but may only have operated a transactional database. They need to build a reporting or measurement system whose answers remain meaningful as volume, latency, corrections and operational responsibility change. Some arrive through a slow dashboard; others through an unbounded metrics bill, a lost data batch or a proposed lakehouse. They do not need to become compiler authors, statisticians, or operators of every analytical product.

An expert can explain which work the system avoids, which work it moves, and which answers it changes. They can build and run one concrete implementation, inspect its behaviour, and judge when another architecture earns its extra copies, machinery or reduced guarantees. They can restore useful answers, not merely restart a server.

## Running work

A delivery service has order and refund changes, package events, driver measurements and tenant dashboards. Events carry `tenant_id`, `event_id`, `source_version`, `event_time`, `received_at`, and payload. Orders and refunds carry money with currency and business-effective time. Device measurements carry device identity, units and quality flags. Keep events, business facts and sampled measurements distinguishable: they answer different questions even when all have timestamps.

Use one small hand-checkable fixture to expose wrong answers. Use separately sized data and an explicit machine description for real execution lessons. The fixture includes a duplicate delivery event, a later cancellation, a renamed customer, a sensor reset, a missing interval, an hour repeated at daylight-saving change, a late event and a tenant with most of the data. No performance or failure experiment has been run for this plan.

## Derivation from work to teachable units

Each row follows an expert task through the understanding it needs. The last column is a proposed teaching treatment, not an article assignment. One unit may need several connected observations. Implementation-specific units remain separate from the family mechanisms they instantiate.

### Decide what analytical system the job requires

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU01 | Turn “make reporting faster” into a workload: output grain, input volume, selectivity, freshness, concurrency, latency and acceptable answer error. A fast solitary scan does not establish dashboard capacity. | Two concrete workload contracts and a changed concurrency requirement. |
| ANU02 | Decide whether to use the existing database, an embedded analytical engine, a serving warehouse, or files plus a query engine. Separate row model, column layout, engine, deployment and operational role. | A few architectures applied to the same contract, including the cost of another copy. |
| ANU03 | Establish a trustworthy baseline: result correctness, scanned bytes, warm/cold state, concurrency, ingest/maintenance work and total operating cost. Recognise benchmark changes that invalidate a comparison. | Measurement worksheet; distinguish a useful local observation from a product ranking. |
| ANU04 | Separate the business record from the analytical projection and define ownership of each. “Rebuildable” depends on surviving source history, transformations and deletion policy. | Follow one source change into a dashboard, then remove the source history. |

### Make the answer mean what its reader thinks

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU05 | Define the grain of an event, order, order line and aggregate; prevent joins that multiply money or count entities twice. SQL syntax alone does not protect the grain. | Hand-counted joins and pre-aggregation, with a second refund per order. |
| ANU06 | Choose measures that combine correctly: additive totals, ratios from numerators and denominators, distinct counts, averages and percentiles. Explain when rollups lose information. | Combine two unequal-sized groups; compare exact and approximate distinct/quantile states and error needs. |
| ANU07 | Keep business time, event time, arrival time and query snapshot distinct. Decide between “what we knew then” and “what is true about then now”. | A cancellation arriving after the reporting cutoff, with both valid answers. |
| ANU08 | Join changing dimensions deliberately: current labels, historical versions, as-of joins and missing dimension records have different meanings. | A renamed customer and delayed dimension row; contrast restating history with preserving it. |
| ANU09 | Preserve numeric, null, unit and calendar semantics across systems. Currency conversion, decimal rounding and absent values can alter a result before the engine becomes relevant. | Small counterexamples and boundary tests; specialist accounting and statistics remain external. |

### Avoid reading and moving unnecessary data

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU10 | Explain why column layout helps a narrow scan and can penalise point reconstruction or frequent row changes. Separate layout from relational semantics and deployment. | Inspect bytes touched for one query, then widen it to most columns. |
| ANU11 | Choose encodings and types from distribution: dictionary, run length, delta, bit packing and general compression trade CPU, bytes and access granularity. | One column transformed as cardinality/order changes; no exhaustive codec catalogue. |
| ANU12 | Read file, row-group and page metadata to predict projection and predicate pushdown, statistics pruning and its failures. | A predicate eliminates groups, then an expression or wide min/max range defeats it. |
| ANU13 | Choose sort or clustering keys from repeated predicates, compression and grouping; distinguish sparse data-skipping structures from row lookup indexes. | Same rows in two orders, examined ranges and read work. |
| ANU14 | Choose partition boundaries and pruning rules without creating tiny files, hot partitions or expensive metadata. Event date is not always the right partition. | Alter retention and a tenant distribution; count useful and empty partition work. |
| ANU15 | Plan file/part size, ingestion batching and compaction together. Immutable chunks turn many tiny writes into metadata and merge work. | Keep arrival rate fixed while changing batch size and merge capacity. |
| ANU16 | Decide when redundant physical layouts, projections or indexes repay storage and update cost. No single clustering order serves every predicate. | Two competing dashboard workloads with storage and ingest budgets. |

### Explain why a query consumes its time and memory

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU17 | Explain columnar execution: batches, vectorised operators, selection and late materialisation; distinguish compression savings from execution throughput. | Trace rows and columns through a filter and aggregation; change filter selectivity. |
| ANU18 | Choose and diagnose joins: build/probe sides, cardinality estimates, skew and spill; explain why a small result can require a large intermediate. | One join changes from bounded build state to spilling after data growth. |
| ANU19 | Bound aggregation and sorting state: group cardinality, exact distinct, top-k, windows and external runs. A limit after a global operation may save no work. | Increase groups rather than just rows; inspect state and disk work. |
| ANU20 | Read an execution profile as evidence: scan, decode, CPU, memory, spill, exchange, coordination and waiting. Recognise cache effects and unstable measurements. | A profile investigation with one variable changed at a time. |
| ANU21 | Reason about distributed stages: local partial aggregation, repartition, broadcast, coordinator merge and data locality. Global correctness and network traffic depend on placement. | Trace one grouped join across shards, then introduce a hot key. |
| ANU22 | Control competing queries and ingest: admission, resource groups, per-query limits, cancellation, quotas and spill share resources. Throughput and tail latency can move in opposite directions. | A dashboard burst during backfill; choose a defensible service policy. |

### Keep analytical copies correct while data keeps changing

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU23 | Choose bulk load, recurring batch, CDC or direct event ingest from freshness and correctness needs; define acknowledgement and visibility boundaries. | One successful send and one ambiguous timeout, with inspectable source and sink positions. |
| ANU24 | Make retry and replay safe with stable identity, ordering/version rules and duplicate handling. Transport delivery guarantees do not prove a correct table. | Replay an overlapping batch and deliver versions out of order. |
| ANU25 | Apply updates, cancellations and deletes to append-oriented data: replacement, merge-on-read, rewrite and tombstones shift read/write work and visibility. | Query before and after consolidation; distinguish physical duplicates from business versions. |
| ANU26 | Change schemas and parsing while old/new producers coexist; keep bad records inspectable, prevent silent truncation and retain replayable inputs. | Type change and malformed batch; reason about quarantine and compatibility. |
| ANU27 | Backfill without a gap or double count: source snapshot plus change position, overlap rules, watermarks and cutover validation. | Concurrent writer crosses the snapshot boundary; reconcile source and sink. |
| ANU28 | Validate freshness and correctness independently: lag by partition, missing batches, count/control totals, semantic checks and durable lineage. A green process can serve stale answers. | Dashboard remains responsive while one source partition stops. |

### Operate a useful analytical service

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU29 | Forecast capacity from scan volume, cardinality, concurrency, replication, temporary space and merge debt. Separate storage capacity from sustainable ingest and query capacity. | A growth worksheet where the first limit changes under a new workload. |
| ANU30 | Recover after node, disk, region or operator loss. A replica can repeat a bad delete; a source replay can repeat a bad transform. Define RPO/RTO and prove a consistent restore. | Restore metadata and data, then reconcile valid arrivals after the restore point. |
| ANU31 | Evolve schemas, physical layouts and versions safely under ingestion and queries. Decide between in-place change, shadow copy, backfill and atomic cutover. | A new layout wins scans but cannot be built within available disk. |
| ANU32 | Limit tenant and staff access: row/column controls, raw-file bypass, service credentials and query resource abuse; test the scope of a policy. | Same identity reaches SQL and an object path; one tenant submits an expensive query. |
| ANU33 | Implement retention, erasure and audit requirements across raw files, derived tables, aggregates, caches and backups. Logical invisibility and physical removal have different completion points. | Remove one person's data and trace residual copies; legal interpretation stays external. |
| ANU34 | Model cost from scans, compute, idle/peak capacity, data copies, requests, egress, maintenance and people. Translate workload change into a bill and an operating burden. | Frequent short queries overturn the cheapest-scan architecture. |

### Share files as tables without confusing the layers

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU35 | Separate a columnar file format, a table format, an object store, a catalogue and a query engine. Each solves a different consistency, discovery or execution problem. | Follow a query and write through the layers; remove the catalogue. |
| ANU36 | Explain snapshot publication, manifests, optimistic commits and conflict checks. Atomic object writes alone do not create a multi-file transaction. | Two writers start from one snapshot; inspect conflict and retry paths. |
| ANU37 | Evolve partitioning and schemas without rewriting everything; understand field identity, file-level layouts and reader capabilities. | Rename a field and change partitioning while old files remain. |
| ANU38 | Read and write corrections across file rewrites, position/equality deletes or deletion vectors; capability differs by format version and engine. | One updated row changes read work and compatibility across two engines. |
| ANU39 | Run compaction, snapshot expiry and orphan cleanup without deleting live or recoverable data. Retention, concurrent readers and failed writers constrain cleanup. | A long reader or abandoned write overlaps cleanup. |
| ANU40 | Choose table/engine/catalogue interoperability from actual supported operations, not format recognition. Test commits, types, deletion, snapshots, authorisation and failure recovery end to end. | A second engine can SELECT but cannot safely perform the required update. |

### Preserve the meaning of time-series data

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU41 | Identify series and timestamps: dimensions/labels, measurement kind, units, irregular sampling and quality. More labels can create more series than more timestamps. | Add request ID to a device series and count the cardinality change. |
| ANU42 | Calculate rates, deltas and integrals correctly for counters and gauges; handle resets, wrapping, missing samples and unequal intervals. | Reset a counter during a gap and compare plausible but incompatible answers. |
| ANU43 | Form windows and align series deliberately: fixed/calendar buckets, time zones, gap filling, interpolation and as-of joins. A filled value is an assumption. | Repeated local hour and misaligned devices; mark observed versus inferred values. |
| ANU44 | Define late-data handling, deduplication and corrected samples against a finality/freshness contract. A time cutoff for one purpose need not apply to another. | A repaired sensor uploads yesterday's values after the dashboard was reported. |
| ANU45 | Design downsampling and retention so future questions remain answerable; min/max/count/sum and mergeable states preserve different information. | Delete raw samples, then request a percentile or threshold duration. |
| ANU46 | Choose chunk/time partitioning, series access paths and hot/cold storage from arrival, range queries, retention and backfill patterns. Cold data can become writable again. | Backfill changes an old compressed period and creates maintenance work. |
| ANU47 | Recognise the boundary between measurement storage, operational monitoring, event logs and forecasting. Alerts need delay/missing-data policies; a TSDB does not supply causal or predictive validity. | Route three timestamped datasets to the appropriate job; external monitoring/forecasting detail. |

### Serve results that are maintained as inputs change

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU48 | Choose repeated queries, cached answers, scheduled refresh, incremental maintenance or stream processing from result freshness and update cost. Distinguish a cached snapshot from a live relation. | One dashboard must incorporate a corrected refund in seconds. |
| ANU49 | Derive insertions and retractions through filters, joins and aggregates; know which states can be updated and which require retained history or recomputation. | Remove an input to a join and to a non-invertible minimum/distinct calculation. |
| ANU50 | Bound state and define finality under event-time windows, late arrivals, watermarks and retention. Dropping state can make old corrections impossible. | A watermark advances and a valid correction arrives afterwards. |
| ANU51 | Make a maintained-result deployment recoverable: durable input positions, state/checkpoints, sink writes and ambiguous restart outcomes. “Exactly once” needs a named boundary. | Crash between output publication and acknowledged input progress. |
| ANU52 | Backfill or change a view while inputs flow; reconcile versions, resource contention, cutover and historical recomputation. | Fix a tax rule affecting historical aggregates without serving mixed definitions. |

### Operate a concrete analytical engine: candidate ClickHouse branch

These units test whether one representative implementation can carry a coherent practitioner journey. Their inclusion is a candidate choice to challenge with current primary sources, not a claim that every analytical engine works this way.

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU53 | Explain MergeTree parts, granules, sparse primary indexes and background merges; predict the read and merge work of an actual table definition. | Real part metadata and read counts from two sort keys; implementation worksheet. |
| ANU54 | Choose ORDER BY, PRIMARY KEY, partitioning, types/codecs and optional projections/skipping indexes for a measured workload. Keep logical uniqueness separate from a primary-index name. | Competing range and entity queries; one added layout raises ingest cost. |
| ANU55 | Batch inserts, use async insert settings deliberately and inspect part/merge pressure. Explain what acknowledgement means for the selected settings. | Many small inserts versus batches; inspect the documented wait/flush boundary. |
| ANU56 | Implement retry, deduplication and business corrections with suitable keys/versions and engine semantics; use FINAL or query-time aggregation when needed. | Out-of-order replacements and retries whose block identity changes. |
| ANU57 | Plan mutations, lightweight deletes and schema evolution with their version-specific visibility and rewrite costs. Restore query access and physical erasure are separate jobs. | Delete a large fraction while merges compete for disk. |
| ANU58 | Diagnose ClickHouse plans, pipelines, query logs and memory; choose join algorithms, spill and query controls for a bounded incident. | Build-side growth or skew fails an otherwise unchanged query. |
| ANU59 | Build incremental or refreshable materialised views and aggregate-state tables with correct insertion, join, replay and backfill semantics. | A right-hand join table changes or a source part merges without a new inserted block. |
| ANU60 | Place data across shards and replicas, understand Distributed table query/insert paths, replication coordination and acknowledgement settings. Distinguish replication from distribution. | Lose a replica, then a shard, and account for what each read and acknowledged write means. |
| ANU61 | Operate and recover the chosen deployment: merge/replication backlog, disk pressure, metadata, backup/restore, upgrade and rebuilt node validation. | Restore a replicated dataset after an operator error while fresh events arrive. |
| ANU62 | Enforce ClickHouse access and workload policy, including tenant filters and resource limits, under the deployment actually taught. | A filtered dashboard user attempts direct access and an expensive query. |

### Give distinct alternatives enough concrete grounding to choose them

| Unit | Expert task and required understanding | Smallest useful teaching treatment |
| --- | --- | --- |
| ANU63 | Use DuckDB for local or embedded analysis: read Parquet selectively, inspect plans, control threads/memory/temp space, and know the process/file concurrency boundary. | A real local report then a larger join that spills; one multi-process writer requirement changes fit. |
| ANU64 | Choose an embedded engine, real-time analytical serving engine, managed warehouse or lake query engine using the same workload and operating constraints. Establish a credible competing implementation in each relevant case. | Evidence-backed comparison with testable shortlist criteria rather than feature counts. |
| ANU65 | Use an Iceberg implementation across catalogue, object store and query engine; inspect snapshots and execute commits, evolution and cleanup with pinned versions. | A real two-writer conflict plus recovery/expiry worksheet, separate from browser state models. |
| ANU66 | Use a time-series implementation such as Timescale for chunking, query semantics, late data and storage policies; distinguish extension mechanisms from general SQL and hosted service behaviour. | Actual hypertable fixture, late update and query plan under a pinned release. |
| ANU67 | Operate time-series aggregates and retention together in that implementation: refresh/invalidation scope, materialised/raw regions, old corrections, chunk lifecycle, recovery and migrations. | Raw history expires before a needed repair; inspect which answers can still be rebuilt. |
| ANU68 | Decide whether a continuously maintained SQL system such as Materialize adds necessary semantics over insertion-triggered views or batch refresh; inspect source progress and logical update behaviour. | Documented correction/join example and a scoped practical trace if commissioned. Full product operations need another explicit branch. |

## Limits of the capability promise

The novice can reach practitioner depth in a selected analytical deployment, and can choose whether local analysis, shared lake tables, time-series specialisation or maintained SQL deserves further investment. That does not make them an operator of every warehouse or streaming system. The proposal must make any representative branch complete enough for its promised tasks and label alternatives whose treatment stops at selection.

Database distribution appears through query stages, source positions, catalogue commits, shard placement and recovery. A general consensus, clocks or distributed-systems course remains parked. Source business schema and transaction design have provisional homes in the relational collection; include the few local sentences needed to understand an example. Object-store request semantics, IAM and general backup infrastructure keep their own homes. Streaming transport operations, observability, statistical modelling, feature stores, BI tooling and full data governance programmes remain outside this collection.

An implementation source check may reveal missing units, unrealistic experiments or an overlarge branch. Add or revise units explicitly in the proposal rather than quietly giving a product behaviour a general teaching home. Every unit above needs a full home or a stated boundary there.
