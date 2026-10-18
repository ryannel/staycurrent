# Analytics and time series: proposed coverage map

Revised field allocation, 18 October 2026. **Proposal for user discussion.**
The [independent derivation](../planning/databases-depth-2026-10-18/analytics-proposal.md)
and [ability breakdown](../planning/databases-depth-2026-10-18/analytics-abilities.md)
preserve the reasoning before coordination. The allocation here, including the
coordination notes, supersedes that first proposal. See the
[independent challenge](../planning/databases-depth-2026-10-18/review-retrieval-analysis.md)
and [decisions](../planning/databases-depth-2026-10-18/synthesis-decisions.md).
No article, route or publication status changes through this map.


Independent derivation, 18 October 2026. All destinations below are proposals. This commissions no articles, changes no routes and authorises no publication. The abilities in `analytics-abilities.md` were persisted first. No existing outline, inventory, coverage map, earlier field proposal or other derivation was opened to derive these pages.

I used the Stay Current planning and style skills and the authoring depth reference. The task needs several connected groups because scanning columns, keeping a shared file table correct, interpreting sampled time and maintaining a changing answer are different jobs. They share mechanisms without becoming one product category.

Article identifiers are **AN01–AN46**. Ability identifiers use **ANU** so that a unit cannot be mistaken for a destination. These are local planning identifiers, not route proposals or a required reading sequence.

## The scope decision

The collection teaches a practitioner to design meaningful analytical answers, choose the physical and execution work that serves them, keep copies current, and operate one representative serving engine. ClickHouse is the proposed full analytical product branch. DuckDB provides a smaller, real local-analysis branch. Open table formats have their own group, with a concrete Iceberg stack. Time-series work has its own entrance and a bounded Timescale implementation branch. Continuously maintained results have a general mechanism group and a selection article, rather than a claim that ClickHouse's insertion-triggered views teach every form of incremental computation.

ClickHouse is a consequential choice: it gives deep teaching for operational and user-facing analytics, including mutable inputs, but is not a proxy for administering a managed enterprise warehouse. Snowflake and BigQuery are credible comparisons for that job. Their service operation would require a further commission. Timescale is a PostgreSQL extension and must borrow established relational mechanisms rather than repeat a PostgreSQL textbook. Prometheus is a useful measurement-semantics and monitoring-boundary contrast, not another complete implementation branch. Iceberg is a table format; Spark, a catalogue and object storage make the exercise executable. This does not promise Spark operator expertise.

These product choices need discussion before production. They should not silently settle a site's long-term vendor commitments.

## Corrections after the primary-source challenge

The original ability derivation contains deliberately broad implementation candidates. The checks below sharpened the units before pages were assigned:

| Unit change | Resulting teaching unit |
| --- | --- |
| Add ANU69 | Explain ClickHouse lightweight SQL UPDATE through patch parts, its visibility and consolidation, restrictions and effects on other read optimisations. ReplacingMergeTree and heavyweight mutations alone would give an outdated choice. |
| Narrow ANU63; add ANU70 | ANU63 owns file-based local analysis and its actual reads. ANU70 owns DuckDB memory/spill, persistent process/file boundaries, safe restart and deployment choice. Current documentation distinguishes in-process mode, Quack and DuckLake; do not repeat an unconditional multiple-writer prohibition. |
| Narrow ANU65; add ANU71 and ANU72 | ANU65 owns a real Iceberg catalogue commit and conflict trace. ANU71 owns actual schema/partition evolution, row corrections and a second reader's compatibility. ANU72 owns maintenance, catalogue/data recovery and validation in the selected stack. |
| Narrow ANU66 and ANU67; add ANU73 | ANU66 owns the concrete hypertable/chunk and row/column storage path. ANU67 owns continuous aggregate invalidation, refresh, late corrections and retention. ANU73 owns policy observability, migrations and recovery of the extension's usable service. |
| Add ANU75 | Preserve or explicitly relax source transaction boundaries across analytical tables. A current order header and stale lines can produce a snapshot that never existed at the source; a consistent sink snapshot and a fresh source position are different guarantees. |
| Narrow ANU61; add ANU74 | ANU61 owns ClickHouse backup, restore and post-restore reconciliation. ANU74 owns steady operation, merge/replica backlog, pressure, upgrade and physical/schema change. Security remains ANU62. |

No experiment was run. Source checks establish that these distinctions matter to planning; article claims still need pinned versions, settings and direct evidence.

## Article groups and bounded pages

Each card names its full teaching homes. Other pages may give a sentence of context and link to that home. A dependency names understanding, not a requirement to read a whole page. Every direct entrance must reconstruct the few concepts its first case needs. General pages use multiple implementations where behaviour differs; commands, system tables, defaults and deployment-specific guarantees belong in implementation pages.

## Analytical answers

### AN01 — What does this analytical system have to answer?



- **Outcome and homes:** turn a reporting request into a testable service contract. ANU01: query grain, selectivity, volume, freshness, concurrency and error. ANU02: source database, local engine, serving store and lake roles. ANU04: authority and rebuild dependencies.
- **Entry:** basic records; define “projection” and “freshness” locally. No column-store prerequisite.
- **Teaching:** one answer moves from occasional finance report to tenant dashboard; draw the copies and their ownership. A small contract worksheet is more useful than a glossary or product survey.
- **Necessary change:** concurrency and freshness tighten while the source's history retention shrinks. The apparently rebuildable copy is no longer rebuildable.
- **Decision and boundary:** choose which architectural roles to investigate, what evidence to collect and what correctness cannot be delegated. Product selection belongs to AN46. This entrance earns a page because it prevents an expensive system decision before performance work begins.

**Newcomer entry:** records and programming are sufficient. First explain what
an analytical database does, its purpose and one actual answer before the
workload worksheet. Any SQL used in the first example is taught beside its
input records and exact result, not assumed as an earlier course.

### AN02 — Facts, changing dimensions and historical answers



- **Outcome and homes:** design an analytical fact with a stated grain and time meaning. ANU05: join multiplicity and fact grain; ANU07: effective, event, arrival and knowledge time; ANU08: current versus historical dimensions and missing joins.
- **Entry:** records; teach the short join locally; show a five-row table at the entrance for readers coming from wrong totals.
- **Teaching:** a worked order/refund ledger and two versions of the customer dimension. Trace “as known on Friday” and “Friday restated today”. Teach star-style fact/dimension modelling only as far as these choices require it.
- **Necessary change:** a second refund multiplies joined rows, then a late cancellation and renamed customer change different interpretations of the report.
- **Decision and boundary:** choose fact grain, dimension history and report time contract. Transactional normalisation has its full home at RL77. Keep grain and time together because the correct historical join depends on both; do not add a dimensional-modelling taxonomy page.

**Local notation:** show the tiny input tables, short join request and exact
intermediate/result rows together. Teach the join operation the example needs;
a link to relational query teaching is optional depth, not an entry requirement.

### AN03 — Which aggregates can you combine?



- **Outcome and homes:** derive a correct rollup and state what it discards. ANU06: additive totals, weighted ratios, average state, exact/approximate distinct and quantiles; ANU09: decimals, nulls, currencies and units at aggregation boundaries.
- **Entry:** records; teach the short grouping operation locally; remind readers of grain with one sentence.
- **Teaching:** combine two unequal populations, then ask a new question of the saved state. Show retained count/sum and a mergeable sketch rather than an implementation catalogue.
- **Necessary change:** the tenant mix shifts and an average of averages becomes wrong; a percentile cannot be recovered from saved averages. Exactness and numerical representation change the acceptable solution.
- **Decision and boundary:** choose raw data, sufficient aggregate state or an approximation with a named error need. Specialist statistics stays external. The independent page earns its cost because the wrong-answer failure survives a perfectly fast engine.

**Local notation:** give input, short grouping request and output together,
including the group/count/sum meanings used to build aggregate state. Do not
assume prior grouped SQL; broader syntax stays at its relational home.

## Column layout and execution

### AN04 — What a column store avoids reading



- **Outcome and homes:** predict the bytes and CPU a column scan requires. ANU10: column layout and row reconstruction; ANU11: dictionary/run/delta/bit-packed representation and general compression.
- **Entry:** records and columns; no relational storage implementation required.
- **Teaching:** an inspectable byte model changes one column's cardinality/order and one query's projected columns. Actual Parquet metadata can ground the model without making Parquet universal.
- **Necessary change:** a narrow aggregate becomes point retrieval of almost every column, or a well-compressing low-cardinality column becomes nearly unique.
- **Decision and boundary:** recognise useful columnar workloads and choose representations to test. Stop before pruning, execution operators or product codecs. Layout and encoding stay together because the query reads encoded column chunks, not an abstract row grid.

### AN05 — Sorting, pruning and a second layout



- **Outcome and homes:** choose layouts that reduce work for actual predicates. ANU12: metadata/statistics and pushdown; ANU13: sorting/clustering and sparse skipping structures; ANU16: redundant layouts and update cost.
- **Entry:** column chunks; supply a short local diagram for a direct “why is it scanning?” entrant.
- **Teaching:** arrange the same rows two ways, count candidate ranges and inspect one file-engine plan. Contrast min/max ranges, probabilistic skipping and exact lookup where the consequence changes.
- **Necessary change:** a wide distribution or transformed predicate defeats pruning; a second dominant predicate needs another order and increases ingest/storage work.
- **Decision and boundary:** choose sort order, predicate form and whether another physical representation pays. Product key syntax belongs in AN35; keep the alternative-layout decision here because it is the cost of the first layout's success.

### AN06 — Partitions, file sizes and compaction



- **Outcome and homes:** keep data pruning and lifecycle management affordable. ANU14: partition selection, skew and metadata; ANU15: batching, file/part size and compaction debt.
- **Entry:** basic immutable chunks, introduced locally. Do not require the execution group.
- **Teaching:** hold ingest rate constant and vary batch size, partition count and available merge work. Show files created, useful work and backlog rather than an invented throughput benchmark.
- **Necessary change:** a tenant hotspot or daily backfill turns helpful partitions into tiny files or an overloaded hot range; retention needs remove a different time boundary.
- **Decision and boundary:** choose partition granularity, batching and a maintenance budget. Partitioning and compaction share a page because separately reasonable choices can create an unsustainable combined file count.

### AN07 — Where a columnar query spends its work



- **Outcome and homes:** interpret a profile and design a fair investigation. ANU17: batches, selection and late materialisation; ANU20: scan/decode/operator/wait attribution; ANU03: correctness baseline, caches, concurrency and comparison validity.
- **Entry:** SELECT/filter/group; a pipeline sketch supplies local context.
- **Teaching:** one operator pipeline with an aligned profile, then a real DuckDB worksheet linked to AN44. Separate a mechanism trace from timing evidence.
- **Necessary change:** the same SQL gains a selective filter but spends more time decoding, or a warm solitary run hides a cold concurrent service cost.
- **Decision and boundary:** select the next measurement and avoid a false “faster engine” conclusion. This stays apart from memory and distributed stages because those are substantial investigations with different failure evidence.

### AN08 — Joins and groups that outgrow memory



- **Outcome and homes:** predict intermediate state and choose a bounded query design. ANU18: join build/probe, estimates and skew; ANU19: groups, distincts, sorting, windows and spill.
- **Entry:** joins/grouping; define build state and spill at the first trace.
- **Teaching:** a small result emerges from a large intermediate; vary group count and key skew independently of input bytes. Inspect real operator memory/temp work in a local engine alongside the model.
- **Necessary change:** a once-small dimension grows, or tenant cardinality explodes. A final LIMIT does not avoid the earlier global work.
- **Decision and boundary:** change query shape, representation, limits or resources; distinguish spill from a promise that every operator can always spill. Joins and aggregation stay together to teach the same state-size budget rather than repeat memory explanations.

### AN09 — Distributed analytical queries



- **Outcome and homes:** explain a query's stages, exchanged data and result correctness. ANU21: partial aggregation, repartition, broadcast, coordinator merge, placement and hot keys.
- **Entry:** a local group and join; recreate the three-stage model at entry.
- **Teaching:** movable rows and partial states across three shards, then a documented real distributed plan from a selected engine. The model is not a running network.
- **Necessary change:** a hot key overloads one stage, a supposedly small broadcast grows, or a per-shard result is mistaken for the global answer.
- **Decision and boundary:** choose useful data placement and identify network/coordinator limits before adding machines. General distributed-systems teaching remains parked. This page earns a home because scaling a scan does not establish scaling a join.

## Copies, corrections and a running service

### AN10 — Ingestion, acknowledgement and replay



- **Outcome and homes:** specify what a successful or retried load establishes. ANU23: bulk, batch, CDC/direct stream and visibility; ANU24: identity, source order, versions and replay; ANU75: source transaction boundaries, multi-table visibility and common publication/cutoff rules.
- **Entry:** source records and a derived copy; define source position locally.
- **Teaching:** a batch receipt/source-position ledger with ambiguous timeouts and overlapping replays. CDC is taught from the database projection boundary; broker internals are external.
- **Necessary change:** a timeout follows a successful sink write, then a retry changes batching and ordering. A source transaction changes order headers and lines but the sink exposes only half of it.
- **Decision and boundary:** choose load mode, an idempotency/version contract and the consistency scope readers can rely on. Identity, retry and acknowledgements stay together because a receipt alone does not prove the desired business record exists once.

### AN11 — Correcting records in an append-oriented store



- **Outcome and homes:** choose correction visibility and storage work. ANU25: replacement, rewrite, read-time reconciliation and tombstones; ANU26: evolving schemas, malformed data and replayable inputs.
- **Entry:** an event identity/version; explain immutable chunks locally.
- **Teaching:** inspect raw rows, logical records and compacted files while a cancellation and type change arrive. Distinguish correcting a business fact from repairing a parsing mistake.
- **Necessary change:** older versions arrive last, then a new producer sends a wider numeric value. The append succeeded but the answer is wrong.
- **Decision and boundary:** choose the correction representation and reject/quarantine policy. Product operations and guarantees belong to AN37–AN38 or the selected table-format branch. Keep schema change here because representation decides whether the correction is recoverable.

### AN12 — Backfills and proof that a copy is current



- **Outcome and homes:** perform a live backfill with a checkable completion condition. ANU27: shared snapshot/change-position handoff at FD04, applied locally; ANU28: lag, control totals, semantic reconciliation and lineage.
- **Entry:** source positions and replay identity; include a concise local recap.
- **Teaching:** a source writer crosses the snapshot boundary; step through the load and changes, then reconcile by key and amount. A progress model can expose interleavings; real database work needs a native worksheet.
- **Necessary change:** one source partition stalls while counts and dashboard response remain healthy; a transforming backfill overlaps live corrections.
- **Decision and boundary:** choose overlap, validation and cutover rules, or refuse cutover. A separate home is earned because “batch finished” and “answer is complete” have different evidence.

**Coordinated scope:** FD04 owns ANU27's generic snapshot/change-position
handoff. This page owns ANU28's analytical freshness, lineage and semantic
reconciliation: show which stalled source partition makes a plausible aggregate
incomplete, with identity/version/control-total checks. Applying the shared
protocol does not repeat its full derivation.

### AN13 — Capacity, concurrency and analytical cost



- **Outcome and homes:** defend a service budget and resource policy. ANU22: competing work, admission and limits; ANU29: scan/state/temp/merge capacity; ANU34: compute, scans, copies, requests, egress and operating effort.
- **Entry:** workload contract; give local scan/state/maintenance quantities instead of requiring all internals pages.
- **Teaching:** a workload worksheet and concurrency timeline: ingestion, backfill and tenant bursts share a finite budget. Compare provisioned resources, scan charging and managed capacity using current terms.
- **Necessary change:** query frequency rises while data stays fixed; a large backfill consumes temporary space and worsens tail latency.
- **Decision and boundary:** choose admission policy, capacity headroom, isolation and architecture cost tests. Live price figures require article-time verification. Keep capacity and cost together: the cheapest measured query can still require an unaffordable service policy.

### AN14 — Recovering analytical answers



- **Outcome and homes:** specify and validate useful recovery. ANU30: failure types, RPO/RTO, replicas versus backups, source replay, metadata/transformation state and post-restore reconciliation.
- **Entry:** the source/copy distinction, supplied in a short entrance diagram.
- **Teaching:** operator error propagates to replicas; restore the prior dataset and trace valid later arrivals and the bad transformation into reconciliation. A second failure loses the catalogue rather than object bytes.
- **Necessary change:** the raw source is expired or a later valid refund must survive the restore.
- **Decision and boundary:** choose backup/replay dependencies, recovery target and a drill that tests actual answers. Do not call a durable raw copy a complete recovery plan. Commands belong in AN22, AN29 or AN43.

### AN15 — Changing an analytical service while it runs



- **Outcome and homes:** choose a safe change and rollback path. ANU31: schema/layout/version change, shadow copies, resource budget, dual operation and atomic cutover.
- **Entry:** a live copy and a correctness contract; reconstruct them locally.
- **Teaching:** build a new layout from retained history while two application versions query; annotate resource use and validation gates.
- **Necessary change:** the new layout is faster but cannot finish within free disk; a rollback crosses a producer schema change.
- **Decision and boundary:** choose in-place change, shadow rebuild or a staged migration and state its reversible boundary. This is separate from initial backfill because compatibility, rollback and physical replacement are now the main task; AN12 owns the snapshot/change handoff.

### AN16 — Access, retention and erasure across analytical copies



- **Outcome and homes:** enforce a practical access and lifecycle boundary. ANU32: SQL/file access, tenant isolation, credentials and abuse; ANU33: retention/erasure through raw, derived, aggregate and backup copies.
- **Entry:** a copy diagram with owners; explain raw-file bypass at the entrance.
- **Teaching:** trace one tenant and one deleted subject through SQL, file paths, derived tables and backups. Use a policy matrix plus an erasure completion ledger.
- **Necessary change:** a caller bypasses a SQL row filter through files, or an aggregate still reveals removed input. A recovery copy restores deleted data unless reapplication is planned.
- **Decision and boundary:** choose enforceable access paths and an honest erasure completion definition. Legal interpretation and general identity architecture remain external. Access and deletion stay together around the same set of exposed copies; platform-specific syntax stays in product branches.

## Tables on object storage

### AN17 — How files become a transactional table



- **Outcome and homes:** identify the component responsible for a consistent table. ANU35: file/table/store/catalogue/engine roles; ANU36: metadata, snapshots, commit publication and conflicts.
- **Entry:** a set of columnar files; no object-store expertise required beyond atomic individual object operations.
- **Teaching:** draw the objects, snapshot tree and catalogue pointer, then race two writers. Contrast reading a directory with reading an identified snapshot.
- **Necessary change:** a writer dies after file creation or loses a commit race. Existing object bytes do not prove a table commit.
- **Decision and boundary:** decide whether the job needs a table format and catalogue and name their consistency responsibilities. Object storage's own request guarantees have their full object homes at OB-A05/OB-A08 and the S3 branch; teach the minimum locally.

### AN18 — Evolving and correcting a file table



- **Outcome and homes:** preserve correct interpretation while files differ. ANU37: field identity and schema/partition evolution; ANU38: rewrites, delete representations and engine/version support.
- **Entry:** an identified table snapshot; explain old versus new files locally.
- **Teaching:** rename a column, change partitioning and update one row while old files remain. Compare stable field identity and incompatible reader operations, using at least Iceberg and Delta documentation where mechanisms differ.
- **Necessary change:** a second engine can read the base files but mishandles the required correction representation.
- **Decision and boundary:** choose evolution/update strategy and required reader/writer support. Exact Iceberg commands belong to AN21. Keep evolution and deletion together because “files remain readable” is weaker than “the evolved table has the right rows”.

### AN19 — Maintaining and choosing a shared table stack



- **Outcome and homes:** choose and maintain a table/engine/catalogue combination as a system. ANU39: compaction, snapshot expiry and orphan cleanup; ANU40: interoperability, authorisation, recovery and operation support.
- **Entry:** snapshots and current pointers; give a local reference diagram.
- **Teaching:** a reference-lifetime model exposes what can be removed. A concrete selection matrix compares Iceberg, Delta and DuckLake for the stated engine/writer ecosystem, with an explicit list of operations to test.
- **Necessary change:** cleanup overlaps a slow writer or long reader; a new engine recognises the format but lacks a required write/delete/catalogue path.
- **Decision and boundary:** choose a stack and safe cleanup policy rather than a format logo. This grouping keeps interoperability tied to the actual operational obligations. Deep Hudi/Delta/DuckLake operator branches are uncommissioned alternatives, not missing chapters silently promised here.

### AN20 — Iceberg commits through a real catalogue



- **Outcome and homes:** create, write and inspect an actual table's commit path. ANU65, narrowed: one pinned Iceberg/Spark integration, a REST catalogue implementation and S3-compatible local storage, plus metadata tables and conflict evidence.
- **Entry:** AN17's component roles; repeat the roles and commands needed to start locally. Introduce only the Spark execution needed to operate this worksheet.
- **Teaching:** native multi-client worksheet with isolated catalogue state, file store and exact versions. Capture before/after metadata and arrange a conflicting write or fault around commit publication.
- **Necessary change:** a writer leaves objects behind, or a successful concurrent commit forces validation/retry. A browser simulation cannot establish real catalogue atomicity.
- **Decision and boundary:** explain what committed, what can retry and what must be reconciled. The catalogue implementation must be selected and its conditional-write/recovery behaviour verified before commissioning. No hosted account is required for the core lesson.

### AN21 — Iceberg evolution and row corrections



- **Outcome and homes:** carry out the evolution/correction promised by the chosen stack. ANU71: actual field IDs, partition specs, row deletes/rewrites and a second reader's compatibility test.
- **Entry:** an existing Iceberg table; provide fixture/reset instructions and snapshot recap for direct entrants.
- **Teaching:** executable alteration and MERGE/delete worksheet; inspect metadata and query identical snapshots from two pinned readers. Select the second engine from verified support, with Trino the first candidate.
- **Necessary change:** a format-version or correction-mode change exceeds one reader's capabilities; an apparently harmless field rename exposes name-based tooling.
- **Decision and boundary:** choose a compatible format version and correction path or postpone the migration. This merits its own page because AN20's successful append does not establish safe evolution. Format-v3 support is an investigation, not an assumed baseline.

### AN22 — Iceberg maintenance and recovery



- **Outcome and homes:** maintain and restore this executable stack without losing live data. ANU72: compaction, expiry, orphan cleanup, catalogue backup/restore, object dependencies and post-restore validation.
- **Entry:** the table's metadata/file graph; a direct incident entrant gets a compact graph and dependency checklist.
- **Teaching:** native worksheet with a slow/failed writer, dry-run cleanup where supported, retained snapshots, lost catalogue state and recovery validation. Distinguish reverting a table snapshot from recovering missing catalogue or objects.
- **Necessary change:** a too-short orphan interval targets in-flight files; restoring an old catalogue loses later valid commits or points to expired data.
- **Decision and boundary:** choose maintenance/retention limits and a tested recovery package for the whole table. It earns a page because cleanup and restore have destructive consequences absent from a query quickstart.

## Time-series meaning and implementation

### AN23 — Series, samples, counters and rates



- **Outcome and homes:** identify the measured quantity and derive an honest rate. ANU41: series identity, dimensions, sampling, quality and units; ANU42: counters/gauges, deltas, rates, resets and gaps; ANU47: storage/monitoring/event/forecasting boundaries.
- **Entry:** timestamped values; SQL is optional for the first worked trace.
- **Teaching:** a hand-checkable device trace with irregular intervals, then a reset. Show why sample average and time-weighted average answer different questions. Use Prometheus functions as a specific semantic contrast, without teaching its operation.
- **Necessary change:** add a per-request label and explode series cardinality; reset the counter inside a missing interval.
- **Decision and boundary:** choose series identity, correct measure and what cannot be inferred. Monitoring alert delivery and forecasting stay in their own fields. This gives time-series readers a direct entrance independent of an analytical engine.

### AN24 — Time windows, alignment and missing values



- **Outcome and homes:** make windowed answers unambiguous. ANU43: fixed/calendar buckets, zones, gap filling, interpolation and as-of alignment.
- **Entry:** samples and measurement kind; recap the needed distinctions in a few sentences.
- **Teaching:** an interactive timeline changes local zone, window boundary and alignment rule; distinguish observed points from filled values in every result.
- **Necessary change:** a local hour occurs twice or two devices report at different instants. Zero-fill and interpolation produce different, plausible totals.
- **Decision and boundary:** choose bucket/calendar and alignment assumptions and expose missingness. This deserves its own investigation because a correct rate can still become a misleading windowed result.

### AN25 — Late measurements, downsampling and retention



- **Outcome and homes:** set a policy that preserves the intended historical answers. ANU44: late/corrected data, duplicates and finality; ANU45: retained state, rollups and raw-data deletion.
- **Entry:** a time bucket and arrival/event-time distinction, supplied locally.
- **Teaching:** repair yesterday's sensor trace, then remove raw data and ask a different question of retained summaries. Link AN03 for full aggregate-state teaching rather than repeat it.
- **Necessary change:** late repair falls outside the accepted refresh horizon; a new threshold-duration/percentile question cannot be answered from the retained summary.
- **Decision and boundary:** choose lateness, retention and correction policies together, including when an answer must be marked provisional or unrecoverable. This is a semantic policy article, not Timescale or streaming syntax.

### AN26 — Physical design for time-series work



- **Outcome and homes:** choose storage structure from series/range access and lifecycle. ANU46: chunk interval, per-series access, hot/cold layout, retention and old-period writes.
- **Entry:** series identity and time-range questions; explain chunking locally.
- **Teaching:** compare device-nearby and time-nearby physical orders under latest-value, narrow-series and fleet aggregate queries. Include uneven series density and a late backfill.
- **Necessary change:** an old compressed period becomes writable, or a new high-cardinality dimension invalidates the physical assumptions.
- **Decision and boundary:** choose chunking, order and hot/cold policy tests; explain why an arbitrary timestamp column does not make all storage equivalent. General compaction and partition mechanisms stay in AN06; this article earns a home through the particular latest/range/retention conflict.

### AN27 — Timescale hypertables, chunks and column storage



- **Outcome and homes:** build and query a concrete series store and predict its physical work. ANU66, narrowed: chunk routing, indexes, partition-key/uniqueness constraints, row/column conversion, segment/order choices, late writes and actual plans.
- **Entry:** SQL plus the series identity; explain hypertable versus chunk at entry. Relational fundamentals are links, not an imposed full reading path.
- **Teaching:** a pinned self-hosted PostgreSQL/Timescale worksheet with real chunks, metadata and plans. Query recent, old and per-device data before and after conversion.
- **Necessary change:** write a correction to cold data or change series distribution and compare the actual access path and maintenance work.
- **Decision and boundary:** choose chunk/segment/order and conversion policies for a stated workload. Verify API names, release support and self-hosted/hosted differences at commission; do not imply a hosted-only facility exists locally.

### AN28 — Timescale aggregates, refresh and retained history



- **Outcome and homes:** configure a continuous aggregate whose freshness and repair boundary are explicit. ANU67, narrowed: materialisation/raw regions, invalidation, refresh schedule/window, late correction, initial backfill and retention interaction.
- **Entry:** buckets and a hypertable; give a short local diagram of raw and summarised time regions.
- **Teaching:** real aggregate metadata and query results while varying refresh/retention policies. Correct a point inside and outside the refresh horizon; inspect the expected answer by hand.
- **Necessary change:** raw history is dropped, then an overlapping refresh recomputes the missing history, or a late correction lies outside the automatic window.
- **Decision and boundary:** choose refresh, raw retention and manual repair policy; distinguish scheduled maintenance from immediate live relational maintenance. Keep lifecycle with the aggregate because the wrong policy can remove the very historical answers downsampling was meant to save.

### AN29 — Operating and recovering a Timescale service



- **Outcome and homes:** keep the extension's work and recovered answers usable. ANU73: background jobs/backlog, chunk/storage growth, extension/schema upgrades, extension-aware backup/restore and aggregate validation.
- **Entry:** PostgreSQL backup/log/replica mechanisms have their full relational homes at RL95/RL96 and RL115–RL118; provide their role locally, then teach extension-specific obligations fully.
- **Teaching:** a native worksheet stalls a policy job, restores the database with supported extension procedures and verifies raw rows, aggregate answers and job state. A migration case changes an extension version or storage policy.
- **Necessary change:** a restore starts serving raw data while jobs or summaries remain wrong; the extension version required by the backup is unavailable.
- **Decision and boundary:** choose recovery prerequisites, monitoring and a safe extension change path. PostgreSQL's WAL, failover and access implementation are linked, not re-taught; hosted restore guarantees need separate service evidence.

## Continuously maintained results

### AN30 — Maintaining an answer as inputs change



- **Outcome and homes:** choose a result-maintenance strategy and derive its updates. ANU48: cached/scheduled/incremental/live alternatives; ANU49: insertions/retractions through joins and aggregates, retained state and recomputation.
- **Entry:** grouped SQL and a changing input; show deltas as inserted/removed rows before naming maintenance terms.
- **Teaching:** remove a refund or change a dimension and propagate the resulting changes through one joined total, then through a minimum. Contrast an insertion-triggered transform with a maintained relation.
- **Necessary change:** the joined right-hand input changes without a new left-hand insertion, or removing a minimum requires historical state.
- **Decision and boundary:** choose when incremental work repays retained state and which maintenance semantics the result actually requires. Implementation commands belong to AN40 or a later product commission.

### AN31 — Time, progress and bounded maintenance state



- **Outcome and homes:** define when a changing answer is complete and what history must survive. ANU50: event-time windows, progress/watermarks, late arrivals, state retention and finality.
- **Entry:** a maintained result; explain event time versus input progress locally.
- **Teaching:** an inspectable two-input progress timeline. Advance one source while the other stalls, then expire a window and deliver a valid old correction.
- **Necessary change:** wall clock advances but source progress does not, or an old update arrives after relevant state was removed.
- **Decision and boundary:** choose provisional/final result promises and state bounds without treating all engines' progress notions as interchangeable. AN25 owns the business retention decision; this owns why an execution cannot honour arbitrary late changes after discarding state.

### AN32 — Restarting and replacing maintained results



- **Outcome and homes:** recover and change a maintained computation without duplicate/mixed answers. ANU51: source positions, state/checkpoints, output and guarantee boundaries; ANU52: historical recomputation, competing resources, view versions and cutover.
- **Entry:** changing rows and a named output; reconstruct the state/input/output graph locally.
- **Teaching:** a failure-state table around publication and progress acknowledgement, then a shadow computation correcting a historical business rule. Native execution only after a specific implementation is commissioned.
- **Necessary change:** crash after publishing output or deploy a new definition while inputs continue. A source replay without correct state/sink coordination changes the answer.
- **Decision and boundary:** choose recovery/cutover invariants and identify which component guarantees them. This database-boundary teaching does not commission broker or general stream-processor operation.

### AN33 — When a maintained SQL system earns another service



- **Outcome and homes:** shortlist a specialised maintained SQL implementation only when its semantics are required. ANU68: concrete Materialize maintained/indexed views, durable state, progress, hydration and cost boundaries as the initial contrast.
- **Entry:** a correction that must change a joined result promptly; a compact local delta trace supports direct entrants.
- **Teaching:** evidence-backed design cases compare ClickHouse incremental/refreshable views, Timescale continuous aggregates and Materialize, with RisingWave or Flink SQL used where their deployment/source assumptions change the shortlist. A documented trace can support selection; no invented cross-product benchmark.
- **Necessary change:** a dimension change must alter old results immediately, or a restart's state reconstruction exceeds the recovery budget.
- **Decision and boundary:** choose refresh, insertion-triggered or fully maintained relational semantics and specify a trial. Materialize product operation is explicitly deferred: selecting it would commission a separate source/state/serving/recovery branch, not enlarge this article into a quickstart that falsely promises operating competence.

## ClickHouse as a coherent serving branch

This is the initial full analytical product branch. Use a pinned self-managed MergeTree/ReplicatedMergeTree deployment for inspectable parts, files, coordination and failure practice. Identify ClickHouse Cloud/SharedMergeTree architecture where it changes predictions; do not imply self-managed commands establish hosted guarantees. Whether the first production branch should instead teach Cloud is a scope decision to resolve before writing. The following pieces are separately useful entrances, not ten instalments required before a reader can create a table.

### AN34 — MergeTree parts, granules and merges



- **Outcome and homes:** explain the physical states of an actual table. ANU53: parts, granules, sparse primary index and background merges.
- **Entry:** column chunks and a simple SELECT; a local part diagram supplies enough context.
- **Teaching:** inspect `system.parts` and index/read evidence before/after inserts and a merge, keeping raw/logical rows distinct. Real worksheet, with a separate step model for hidden states.
- **Necessary change:** many small immutable parts accumulate faster than consolidation. Explain why an index entry is not a uniqueness constraint or one-row pointer.
- **Decision and boundary:** predict read ranges and maintenance work; AN35 owns design and AN36 owns ingestion controls. Separate mechanism from choices so the design article need not carry a storage textbook.

### AN35 — Designing ClickHouse tables for the queries



- **Outcome and homes:** defend an actual table definition. ANU54: ORDER BY/PRIMARY KEY, partitioning, types/codecs, projections and skipping indexes selected from workload evidence.
- **Entry:** a sparse index/part, recapped locally; no full product sequence required.
- **Teaching:** run two rival workload shapes over two definitions and inspect read rows/bytes, storage and ingestion work. Optional physical accelerators appear only as the fix for an observed remaining workload.
- **Necessary change:** a tenant-first order hurts a fleet-wide query, or a projection wins reading but costs unacceptable ingestion/storage work.
- **Decision and boundary:** choose primary physical layout and the smallest justified second layout. AN05–AN06 teach the general mechanisms; do not re-teach them. A dictionary or new index type earns full treatment only if a real selected workload needs it.

### AN36 — ClickHouse inserts and part pressure



- **Outcome and homes:** make ingest both sustainable and checkable. ANU55: sync/batched/async inserts, buffers/flush, wait settings, acknowledgements and part/merge pressure.
- **Entry:** incoming events and immutable parts; give a short local diagram.
- **Teaching:** real ingest worksheet varies batch and async wait settings and observes log/system evidence. Separate documented acknowledgement from observed local timing.
- **Necessary change:** a sender times out, a buffer has not flushed, or tiny batches overload maintenance while row rate looks modest.
- **Decision and boundary:** choose an insert mode/batch and its receipt/retry contract. AN37 owns business-version correction; this page owns whether an insertion was accepted and made durable/visible under the selected settings.

### AN37 — Retries and replacement records in ClickHouse



- **Outcome and homes:** serve correct logical records despite replay and out-of-order versions. ANU56: block deduplication versus business identity, ReplacingMergeTree version/key semantics, query-time reconciliation/FINAL and retained delete markers.
- **Entry:** the business event identity and version; explain merge-time replacement locally.
- **Teaching:** a native worksheet inserts versions and retries in different blocks/orders, queries before consolidation and inspects the logical answer. State invariants such as unchanged identity columns explicitly.
- **Necessary change:** an older update arrives last, a retry changes block composition or cleanup removes a marker that was preventing resurrection.
- **Decision and boundary:** choose source version keys, query-time correctness and safe cleanup conditions. Explain alternatives such as arg-max aggregation only where they solve the case; no catalogue of engine families.

### AN38 — ClickHouse updates, deletes and physical change



- **Outcome and homes:** choose and observe the right correction/change path. ANU57: mutations, deletes, schema evolution and physical removal; ANU69: current lightweight UPDATE/patch parts, restrictions, visibility and consolidation.
- **Entry:** immutable parts and one logical record; the opening contrasts replacement records and direct correction without assuming AN37 was read.
- **Teaching:** a pinned worksheet updates a small set with patches, compares a broader rewrite, deletes records and inspects query visibility/physical state and plan consequences. Trace schema change only where it changes this work.
- **Necessary change:** frequent patches impair read optimisations or accumulate parts; a requested key change is unsupported by the lightweight path; a large deletion needs physical completion.
- **Decision and boundary:** choose patch, mutation, replacement or rebuild and verify completion. Current documentation makes a “ClickHouse cannot update efficiently” generalisation untenable; release support and workload limits need article-time evidence. The choices stay together because the useful task is choosing a correction mechanism under a cost and visibility contract.

### AN39 — Diagnosing a ClickHouse query



- **Outcome and homes:** locate and fix one bounded performance failure. ANU58: EXPLAIN/pipelines, query/system logs, join selection, memory/spill and query controls.
- **Entry:** a slow or failed SQL query; a local scan/operator/exchange diagram routes deeper needs to AN07–AN09.
- **Teaching:** a native incident worksheet begins with a correct query, gathers plan/runtime evidence and changes one candidate cause at a time. Include a bounded join/state investigation rather than a settings appendix.
- **Necessary change:** build-side growth, skew or concurrency causes failure with unchanged SQL; increased limits consume resources needed by ingest.
- **Decision and boundary:** change query/layout/limits or capacity for an evidenced reason. AN42 owns service-wide policy; this page owns the query diagnosis. Repeat version-sensitive optimizer assumptions only after verification.

### AN40 — ClickHouse views and aggregate-state tables



- **Outcome and homes:** build a faster result whose update semantics are correct. ANU59: incremental versus refreshable views, inserted-block execution, join triggers, state tables, chaining, replay and historical backfill.
- **Entry:** grouped SQL and a freshness contract; introduce aggregate-state merge locally and link AN03/AN30 for full general treatment.
- **Teaching:** create a view/target, insert source rows, then update the source and joined dimension separately. Inspect which target rows actually changed. Execute a safe historical backfill/cutover with fixtures.
- **Necessary change:** the right-hand dimension changes, replacement parts merge, or a replay repeats contributions. A source table's logical correction does not automatically establish a corrected derived target.
- **Decision and boundary:** choose incremental, periodic recomputation, an explicit retraction design or another maintained system. This cannot be a subsection of basic ClickHouse querying: the wrong answer can survive every merge and cache refresh.

### AN41 — ClickHouse shards, replicas and distributed paths



- **Outcome and homes:** place data and interpret acknowledged writes/reads in the chosen cluster. ANU60: Distributed table paths, sharding keys, ReplicatedMergeTree, Keeper coordination, quorum/visibility settings and distributed execution consequences.
- **Entry:** shards divide data, replicas copy it; state those distinctions at the entrance. Link AN09 for full query-stage teaching.
- **Teaching:** native isolated multi-node worksheet with a small topology, visible insert/query/replication queues and exact settings. Trace a write/read, lose a replica, then make an entire shard unavailable.
- **Necessary change:** a hot shard limits throughput, a Distributed insert is queued, or a surviving replica lags the expected read.
- **Decision and boundary:** choose routing, replication/acknowledgement policy and failure expectations. Keeper consensus internals remain parked; enough coordination mechanics are local to explain these database outcomes. Cloud architecture differences must be explicit.

### AN42 — Operating and changing a ClickHouse service



- **Outcome and homes:** protect a tenant service and resolve growing background debt. ANU74: merge/replica queues, disk/temp pressure, workload isolation, schema/layout change and upgrade; ANU62: accounts, row/access policy and resource limits in this deployment.
- **Entry:** an actual running service; local diagram identifies foreground, background and tenant work.
- **Teaching:** an operating worksheet sets a small service policy, introduces part/replica backlog, inspects cause and budgets a staged layout/version change. Test direct access as the tenant identity, not only the dashboard application.
- **Necessary change:** an unrestricted tenant or rebuild consumes disk/headroom, turning a read success into ingest or replication trouble.
- **Decision and boundary:** choose guardrails, alerts and a safe change window from actual resource evidence. This is one service-ownership problem; AN39 owns query diagnosis, AN43 recovery. If the selected version's access or upgrade procedure needs a substantial independent investigation, split this card before commissioning rather than hide it in a checklist.

**Bounded change execution:** steady diagnosis, tenant/resource controls and
maintenance remain the main investigation. Its named upgrade section rehearses
one supported pinned source/target release transition in the selected self-managed
or hosted architecture, with an interrupted/failed step, version/replica health,
application acceptance and last supported rollback gate. AN15 owns generic shadow
change; AN38 owns actual correction/layout changes; AN43 owns restore. A complete
major-version or cross-architecture migration is explicitly outside this section
and needs a separately derived brief. No checklist may claim that broader expertise.

### AN43 — Backing up, restoring and reconciling ClickHouse



- **Outcome and homes:** restore correct usable data and prove what survives. ANU61, narrowed: backup/restore, cluster metadata/coordination dependencies, replica rebuilding and post-restore replay/reconciliation under a stated RPO/RTO.
- **Entry:** source identity and chosen cluster topology; give a compact restore dependency graph for incident entrants.
- **Teaching:** native worksheet backs up tables and necessary metadata, simulates an operator error, restores in isolation and replays valid later data. Validate base and derived answers, accounts/settings and replica state as applicable to the selected backup method.
- **Necessary change:** the error has already replicated; the restore point omits a valid arrival; a materialised target and source need coordinated reconciliation.
- **Decision and boundary:** choose backup scope, recovery target and validation gates, and distinguish rebuilding a replica from recovering the correct business history. Do not imply native backup automatically captures every server file or produces an arbitrary point-in-time target; verify exact scope and consistency before writing.

## Local work and engine choice

### AN44 — Analysing files with DuckDB



- **Outcome and homes:** turn a file collection into a correct, inspectable local report. ANU63, narrowed: explicit types, Parquet read/projection/filter evidence, local joins/aggregation, profiles and repeatable inputs/outputs.
- **Entry:** records with the short SQL operation taught locally; define an embedded engine and give an immediate no-account local start.
- **Teaching:** a real DuckDB worksheet queries the delivery fixtures, inspects file metadata/plan and exports a reproducible answer. Browser execution may support small actual DuckDB queries if runtime/file support is verified; label such limits at entry.
- **Necessary change:** an extra file carries a different type/schema, or a predicate form defeats the expected read savings.
- **Decision and boundary:** choose direct file queries versus import and produce a reproducible report. General column/query mechanisms link to their homes; this page teaches real commands and evidence. AN45 owns service/resource limits.

**Local notation:** the first native request shows input records, the short
SELECT/filter/group operation and exact output. No earlier SQL course is required
to complete the local-analysis question; syntax beyond this task is optional.

### AN45 — DuckDB resources, persistence and deployment boundaries



- **Outcome and homes:** run a local/embedded analytical workload predictably and know when the architecture changes. ANU70: threads/memory/temp storage, spilling and non-spillable cases, native file/concurrency model, persistence/restart and the distinction from Quack/DuckLake.
- **Entry:** a working DuckDB query; reconstruct the process/file/temp diagram locally.
- **Teaching:** native resource worksheet changes state cardinality, memory budget and temp space, then tests documented access/locking behaviour and a safe persistent restart. Inspect actual spill/files and errors; do not infer process RSS from `memory_limit` alone.
- **Necessary change:** a job grows beyond the available temp disk or a second process needs to write; the architecture must be chosen rather than bypassing a file lock.
- **Decision and boundary:** choose resources, process ownership and whether a server/shared-table system is needed. Quack/DuckLake receive a current scoped selection treatment; neither is quietly taught as a fully operated service. This split avoids overpacking a useful local report with every persistence/deployment mechanism.

### AN46 — Choosing an analytical or time-series system



- **Outcome and homes:** make a defensible shortlist and trial. ANU64: concrete alternatives under the same contracts, including operating responsibility, correction/freshness, concurrency, file interoperability and cost.
- **Entry:** a stated reporting/serving need; recreate a compact workload contract so a comparison entrant need not read AN01.
- **Teaching:** a few worked decisions: local/batch work (DuckDB versus a service), frequent user-facing queries (ClickHouse versus a managed warehouse), ad-hoc shared enterprise analysis (Snowflake/BigQuery), and querying shared lake tables (Trino/Spark plus a selected table stack). Compare like-for-like work and name deployment/edition/version assumptions.
- **Necessary change:** occasional scans become frequent tenant requests, mutable business joins demand another freshness model, or staffing/region/data-location rules change the operational choice.
- **Decision and boundary:** select two credible candidates and the correctness, latency, recovery and cost evidence that would choose between them. AN19 owns table-format/stack selection; AN33 maintained SQL selection; AN23–AN29 own time-series meaning/operation, and this page owns their competing implementation choice. Do not promise a vendor directory, portable performance ranking or operating mastery of products that have no implementation branch.

**Time-series selection case owned here:** accept a direct entrant from AN23
or AN26. Compare the same measurement workload in an existing relational database,
Timescale and one credible specialised or analytical alternative selected from
the workload (for example QuestDB or ClickHouse). Vary series cardinality, late
corrections, historical joins, raw/rollup retention, freshness and operator work;
state the trial evidence that accepts or rejects each design. This is selection,
not an unearned operator branch or a fixed vendor list.

## Coverage audit: one full home per unit

The cards and refined unit audit are the coordinated proposed teaching homes for user discussion. The independent initial artifact remains preserved; no article is commissioned by this allocation.

| Units | Full teaching home |
| --- | --- |
| ANU01, ANU02, ANU04 | AN01 — workload contract, architectural roles, authority/rebuild dependencies |
| ANU05, ANU07, ANU08 | AN02 — grain, time meaning, changing dimensions |
| ANU06, ANU09 | AN03 — combinable aggregate state, numeric/missing/unit semantics |
| ANU10, ANU11 | AN04 — column layout and representation |
| ANU12, ANU13, ANU16 | AN05 — pushdown/pruning, ordering, second layouts |
| ANU14, ANU15 | AN06 — partitioning and file/merge lifecycle |
| ANU03, ANU17, ANU20 | AN07 — measurement validity, execution pipeline, profile |
| ANU18, ANU19 | AN08 — join/group/sort/window state and spill |
| ANU21 | AN09 — distributed query stages and placement |
| ANU23, ANU24, ANU75 | AN10 — ingest receipts, identities, replay, source transaction/publication boundary |
| ANU25, ANU26 | AN11 — corrections and evolving input representation |
| ANU27 | FD04 — shared snapshot/change-position handover and replay completeness |
| ANU28 | AN12 — analytical freshness, lineage and semantic validation |
| ANU22, ANU29, ANU34 | AN13 — admission, service capacity, complete cost |
| ANU30 | AN14 — answer recovery and reconciliation |
| ANU31 | AN15 — live service evolution |
| ANU32, ANU33 | AN16 — access and lifecycle across copies |
| ANU35, ANU36 | AN17 — table-stack roles and transactional publication |
| ANU37, ANU38 | AN18 — field/partition evolution and row correction mechanisms |
| ANU39, ANU40 | AN19 — maintenance safety and stack compatibility/choice |
| ANU65 | AN20 — actual Iceberg commit path and conflict |
| ANU71 | AN21 — actual Iceberg evolution/corrections/second reader |
| ANU72 | AN22 — actual stack maintenance and recovery |
| ANU41, ANU42, ANU47 | AN23 — series, samples, rates and field boundary |
| ANU43 | AN24 — windows, alignment and missingness |
| ANU44, ANU45 | AN25 — lateness, retained summaries and finality policy |
| ANU46 | AN26 — time-series physical design |
| ANU66 | AN27 — concrete Timescale chunks/storage/query path |
| ANU67 | AN28 — concrete refresh/invalidation/retention |
| ANU73 | AN29 — concrete Timescale jobs, change and recovery |
| ANU48, ANU49 | AN30 — maintenance choice and change propagation |
| ANU50 | AN31 — progress, retained state and execution finality |
| ANU51, ANU52 | AN32 — maintained-result restart and definition change |
| ANU68 | AN33 — maintained SQL implementation selection; full Materialize operations deferred |
| ANU53 | AN34 — MergeTree physical mechanism |
| ANU54 | AN35 — ClickHouse physical design |
| ANU55 | AN36 — ClickHouse ingestion and acknowledgement |
| ANU56 | AN37 — ClickHouse retries/replacement and query-time correctness |
| ANU57, ANU69 | AN38 — ClickHouse direct updates/deletes/schema and patch mechanism |
| ANU58 | AN39 — ClickHouse execution diagnosis |
| ANU59 | AN40 — ClickHouse derived target semantics and repair |
| ANU60 | AN41 — ClickHouse sharding/replication paths and guarantees |
| ANU62, ANU74 | AN42 — ClickHouse tenant/service policy, pressure and change |
| ANU61 | AN43 — ClickHouse backup/restore/reconciliation |
| ANU63 | AN44 — real DuckDB local file analysis |
| ANU70 | AN45 — DuckDB resource, persistence and deployment boundary |
| ANU64 | AN46 — engine selection and fair trial |

Every ANU01–ANU75 has one full home. Cross-links do not create second homes. Product-specific units are implementations of general abilities, not a transfer of general teaching into a product branch. The explicit boundaries below are part of the promise.

## Reader entrances and cost

There is no 46-page prerequisite chain. A newcomer first needs AN01 and then the mechanism needed for their task. A slow-query entrant can begin at AN07, AN08 or AN39 with local definitions. A wrong-total entrant can start at AN02/AN03; a late sensor at AN23–AN25; a catalogue incident at AN22; a stale materialised answer at AN30 or AN40.

Useful journeys are:

- **First analytical design:** AN01 → AN02/AN03 as needed → AN04/AN05 → AN10/AN12 → AN46, then the chosen implementation. Read AN13/AN14 before owning the service.
- **Working ClickHouse practitioner:** AN34–AN36 establish physical design and loading; AN37/AN38 choose correction mechanisms; AN39/AN40 answer query/view needs; AN41–AN43 establish the multi-node operating and recovery promise. A single-node local experiment does not establish the latter.
- **Shared file table:** AN17 → AN18/AN19 → AN20–AN22. Add AN09 only when distributed query work is the actual question.
- **Measured time series:** AN23 → AN24/AN25 → AN26 → AN27–AN29 if Timescale fits. This route need not pass through ClickHouse or enterprise warehouse comparisons.
- **Maintained results:** AN30 → AN31/AN32 as guarantees require → AN33. Choosing the semantics of another engine is the end of this bounded journey, not proof of operating it.
- **Local analysis:** AN44 immediately, AN45 for growth/persistence/deployment, then general mechanism or service selection only when the local job needs it.

Small prerequisites are reintroduced where needed, so the reader never has to open a separate textbook to understand a diagram. “Prerequisite” must not become a compulsory tour through all earlier pages.

The biggest page-cost risks are AN02 (grain plus time/dimensions), AN13 (resource/cost policy), AN19 (maintenance plus stack choice), AN38 (correction methods), AN40 (derived target correctness) and AN42 (operating policy plus change). Their common cases justify keeping them together now. Commissioning must follow the consequence chain rather than write a section for every feature named. If a card cannot deliver its decision in one coherent investigation, split that investigation or narrow the promise before drafting. Combining these into a generic “advanced analytics” page would hide independently sought tasks and make direct entrants pay for unrelated context.

## Primary-source scope checks

Sources were opened or returned in primary-source search on 18 October 2026. Links are planning evidence: they challenge boundaries and identify later verification work. They do not establish benchmark claims, release-wide suitability or execution evidence. Recheck exact releases, defaults, editions and deployment before a brief; moving `latest`/`current` pages are not version pins. No third-party performance ranking was used.

| Primary source | Planning consequence | What the article still must verify |
| --- | --- | --- |
| [Apache Parquet file format](https://parquet.apache.org/docs/file-format/) | File metadata and column chunks support a concrete layout investigation; a file format does not provide table commits. | Actual fixture encodings, statistics and reader pushdown behaviour. |
| [ClickHouse ReplacingMergeTree](https://clickhouse.com/docs/reference/engines/table-engines/mergetree-family/replacingmergetree) | Replacement needs a correct identity/version and explicit query-time correctness; consolidation is not a deadline. Keep AN37 separate from basic inserts. | Pinned release, partition/sort invariants, FINAL performance and cleanup support. |
| [ClickHouse UPDATE](https://clickhouse.com/docs/reference/statements/update) | Lightweight patch updates add a real choice beyond replacement and whole-column mutation. AN38 needs patch visibility, eventual incorporation and read-path consequences. | Feature availability/maturity in the chosen release, required settings, key restrictions, concurrent update behaviour and plan effects. Avoid turning a vendor latency description into a measured claim. |
| [ClickHouse incremental materialised views](https://clickhouse.com/docs/concepts/features/materialized-views/incremental-materialized-view) | Insert-block triggers and join-side dependencies cannot stand in for arbitrary maintained relations. AN40 and AN30 have distinct jobs. | Exact source/correction/replay behaviour, target-state merge correctness and a tested backfill sequence. |
| [ClickHouse Replicated engines](https://clickhouse.com/docs/reference/engines/table-engines/mergetree-family/replication) | Replica lag and acknowledgement choices make distribution its own practitioner task. | Keeper/topology configuration, selected quorum/read/Distributed settings, timeout and failure evidence. Do not repeat older sizing or RAID advice without fresh justification. |
| [ClickHouse backup/restore](https://clickhouse.com/docs/concepts/features/backup-restore/overview) | Native backup exists but the dependency/consistency scope must be taught separately from replication. | Supported destination, metadata/access coverage, multi-table consistency, cluster sequence, restore validation and valid post-backup replay. |
| [DuckDB current concurrency](https://www.duckdb.org/docs/current/connect/concurrency) and [Quack announcement](https://www.duckdb.org/2026/05/12/quack-remote-protocol) | In-process native-file access, a remote server protocol and shared-table catalogues differ. AN45 must state mode/release rather than claim DuckDB universally cannot support multiple client processes. | The documentation shown identifies 1.5 current and 2.0 dev preview; verify actual release and maturity at commission. Do not infer availability from the earlier announcement's future plans. |
| [DuckDB memory management](https://duckdb.org/2024/07/09/memory-management) and [environment guidance](https://www.duckdb.org/docs/lts/guides/performance/environment) | Spill and operator state make growth a second practical investigation, not an “in memory” footnote. | Selected release/operator spill limits, native versus browser differences, actual temp footprint and process memory. |
| [Iceberg reliability](https://iceberg.apache.org/docs/latest/reliability/) | Optimistic catalogue publication and retry validation require an actual writer/commit lesson. The source includes historical object-listing context; do not repeat that as current S3 consistency advice. | The selected catalogue's atomic publication/recovery and conflict semantics, exact engine operation and format version. |
| [Iceberg maintenance](https://iceberg.apache.org/docs/latest/maintenance/) | Cleanup safety depends on active operations and retained references. Maintenance/recovery earns AN22 instead of being buried in a table quickstart. | Default intervals, long-reader/writer boundaries, object path identity, supported procedures and retained recovery dependencies. |
| [Trino Iceberg connector](https://trino.io/docs/current/connector/iceberg.html), [Delta concurrency](https://docs.delta.io/concurrency-control/) and [DuckLake catalogue choice](https://ducklake.select/docs/stable/duckdb/usage/choosing_a_catalog_database) | Shared files and an open specification do not imply identical cross-engine writes or catalogue responsibilities. Make ecosystem/operation support part of the choice. | Exact cross-engine delete/evolution capabilities, format versions, catalogue/IAM path and a reproducible second-reader test. |
| [Timescale current refresh-policy source](https://github.com/timescale/docs/blob/latest/use-timescale/continuous-aggregates/refresh-policies.md) and [retention interaction](https://github.com/timescale/docs/blob/latest/use-timescale/data-retention/data-retention-with-continuous-aggregates.md) | Refresh scheduling, raw retention and old corrections must be one consequence chain. AN28 cannot stop at creating the aggregate. | Release defaults, materialised/raw query boundary, invalidation, late writes and exact policy order. Hosted documentation redirects were not fully readable in the browser; current primary repository docs supplied the planning check. |
| [Timescale column-storage source](https://github.com/timescale/docs/blob/latest/use-timescale/hypercore/real-time-analytics-in-hypercore.md), [query/chunk source](https://github.com/timescale/docs/blob/latest/use-timescale/hypertables/improve-query-performance.md), [restore/migration source](https://github.com/timescale/docs/blob/latest/self-hosted/migration/entire-database.md) | Chunk/row-column mechanisms, policy jobs and extension-aware restore justify three bounded implementation pages. | Actual release/API support, self-hosted availability, PostgreSQL/extension compatibility and supported backup/restore procedure. Marketing compression ratios are not evidence for the fixture. |
| [Prometheus query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/) | Counter resets and rate aggregation have concrete semantics; time-series meaning needs more than a storage-layout comparison. | The chosen functions' exact range/reset/extrapolation behaviour. Their semantics are one implementation, not a universal definition of rate. |
| [Materialize views](https://materialize.com/docs/fundamentals/concepts/views/), [materialised view command](https://materialize.com/docs/sql/create-materialized-view/), [durable subscriptions](https://materialize.com/docs/serve-results/durable-subscriptions/) and [PostgreSQL source consistency](https://materialize.com/docs/ingest-data/postgres/) | Durable maintained results, indexes, state reconstruction and resumable output are different layers. AN33 must compare semantics/restart consequences; AN10 must distinguish source transaction preservation from individual sink writes. | Sources, progress/consistency, state/resource sizing, recovery times and chosen output guarantee. Full operations remain uncommissioned. |
| [Snowflake multi-cluster warehouses](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) and [BigQuery slots](https://docs.cloud.google.com/bigquery/docs/slots) | Managed query concurrency/capacity is a credible alternative to operating shards. Compare actual workload and charged resources. | Editions, regions, isolation/queueing, quotas, mutable ingestion, current pricing and measured workload behaviour. No operator branch is implied. |

## Hard boundaries and unresolved decisions

- **General versus implementation:** AN04–AN09 cannot quietly make MergeTree universal, and AN17–AN19 cannot make Iceberg the definition of a lake table. Product commands and internals stay in their own groups. General examples must name differences that change decisions.
- **Source design:** transaction schemas, constraints, WAL and ordinary PostgreSQL recovery have their full relational homes at RL95/RL96 and RL115–RL118. Analytics owns the grain/history/projection and reconciliation consequences. Direct entrants get a local explanation of the needed boundary.
- **Object storage:** request semantics, bucket access and service-specific storage products have their full homes in the object map. The table group owns multi-file publication, catalogue recovery and cross-engine interpretation. An S3 Tables-specific lesson is not assumed necessary for generic Iceberg competence.
- **Time-series:** this collection owns sample meaning, query alignment, late repair and storage lifecycle. Monitoring ingestion/alerting and forecasting expertise remain external. AN46 now includes one credible competing time-series/analytical implementation against Timescale and an existing relational baseline. InfluxDB, QuestDB and Prometheus may supply workload-specific contrasts; their full operating branches remain deferred.
- **Continuously maintained results:** data changes/retractions, state, progress, restart and cutover are owned here at the database boundary. Kafka/Flink operations and a general streaming programme remain separate. Materialize/RisingWave production operation is deferred unless the product choice is commissioned.
- **Other omissions:** BI/dashboard design, orchestration frameworks, data catalogues as an organisation-wide governance product, machine-learning feature stores, graph/vector/search engines and a statistical analysis curriculum are outside the capability promise. SQL grouping/window mechanics get a concise local example or optional relational link, not another SQL course.
- **Primary representative:** choose self-managed ClickHouse versus ClickHouse Cloud before implementation briefs. Teaching both equally would add architecture and recovery work; a few contrast paragraphs do not supply both operating journeys.
- **Lake exercise:** catalogue choice remains unresolved. Select a supported, inspectable REST catalogue plus pinned Spark/Iceberg and a verified second reader. Recovery must include the catalogue's actual persistent store. A toy catalogue is acceptable only for a labelled mechanism model, not the operating worksheet.
- **Timescale release/terms:** verify the exact supported self-hosted extension, APIs and facility/licence boundaries. This can change whether AN27's local worksheet teaches the intended row/column work. Do not substitute hosted marketing for local execution.
- **Future maintained branch:** a reader who selects Materialize needs a coherent source/maintenance/serving/recovery branch before claiming practitioner depth there. That is a genuine deferred promise, not a section hidden inside AN33.

Independent reviewers should first derive missing expert tasks without seeing the page list, then challenge these boundaries, awkward cases, entrances and page cost. They should especially ask whether AN19 or AN42 needs a narrower split, whether the full ClickHouse branch fits the publication's intended analytical audience, and whether a managed warehouse rather than a specialised time-series branch should be the next product investment. That isolated derivation launched no reviewer. The subsequent independent challenge and allocation repairs are linked at the top of this final map.

## Derived size and delivery status

The resulting proposal has **46 article candidates**: analytical answers 3; column layout/execution 6; copies/corrections/service 7; shared file tables and Iceberg 6; time-series and Timescale 7; maintained results 4; ClickHouse 10; local DuckDB and engine choice 3. These counts were calculated from the derived cards; they are neither quotas nor a suggested batch size.

There are **68 originally derived units**, with **7 explicit additions after source challenge**, for **75 teachable units**, each assigned above. No article or route was created, no benchmark or failure experiment was run, and no publication state was changed. The original proposal and preceding abilities file remain in the derivation record; this map includes subsequent coordination and independent review repairs.
