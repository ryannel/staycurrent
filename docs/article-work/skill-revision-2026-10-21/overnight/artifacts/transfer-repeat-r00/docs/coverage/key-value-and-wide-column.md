# Key-value and wide-column stores: proposed coverage map

Revised field allocation, 18 October 2026. **Proposal for user discussion.**
The [independent derivation](../planning/databases-depth-2026-10-18/keyed-proposal.md)
and [ability breakdown](../planning/databases-depth-2026-10-18/keyed-abilities.md)
preserve the reasoning before coordination. The allocation here, including the
coordination notes, supersedes that first proposal. See the
[independent challenge](../planning/databases-depth-2026-10-18/review-records.md)
and [decisions](../planning/databases-depth-2026-10-18/synthesis-decisions.md).
No article, route or publication status changes through this map.


Independent proposal, 18 October 2026. Planning only. Derived after saving [the abilities](../planning/databases-depth-2026-10-18/keyed-abilities.md), which contains KV01–KV80. Existing routes, articles and publication states are outside this work. Page codes below are planning identifiers, not proposed routes. They do not follow an existing collection's shape.

## Separate the entrances, share only what the work shares

Give key-value stores and wide-column stores distinct reader paths. A cache, a durable item service and an ordered partition store do not offer the same contract. Readers looking for one should not first work through the others. A small common layer teaches keys, bounded access, conditional changes and maintained views. Each product entrance supplies the short local context a direct entrant needs.

The proposed representative branches are DynamoDB for a managed durable item service, Redis Open Source for atomic in-memory data structures and their survival contract, and Cassandra for partitioned wide-column operation. These are three substantial product investigations. “DynamoDB” or “Cassandra” cannot be a single feature-tour page and still deliver the derived abilities.

Bigtable is a serious alternative, especially when the reader wants a managed ordered-row service. This proposal teaches enough of its different model and operating responsibility to assess that choice, then hands off to primary documentation. Operating Bigtable expertly requires its own derived branch. This is an explicit initial scope boundary, not a claim that Cassandra represents all wide-column implementations.

Redis has one full implementation home at CA-A11–CA-A17 in the in-memory map.
CA-A02/CA-A03 own source coherence and miss-load protection. The exact keyed
ability reconciliation and the two role-specific entrances are recorded below.
The independent first derivation is preserved as evidence, not a competing series.

## What gives a page its boundary

A page has one investigation and a changed case that can overturn the first design. Product mechanisms and execution stay in the product branch. General pages teach a transferable decision, not an invented lowest-common-denominator API. Brief local reminders elsewhere do not acquire a second full home.

Each page below specifies an outcome, owned sections/units, entry needs, teaching form, a required changed case and the decision that follows. Native exercises mean a pinned real implementation. A browser model may expose a state history but cannot prove durability, failover, IAM, cost or throughput. Cloud exercises must document account access, charged resources, permissions, reset and cleanup. All experiments are proposed; none has been run.

## Key-value decisions

These pages are short routes into decisions shared by the branches. They are not prerequisites to read in sequence before every product page.

### K01 — Key-value stores: operations and choices

**Outcome:** Turn a service requirement into a testable storage contract and shortlist.

**Owned sections:** Authoritative versus disposable state (KV01); values and aggregate boundaries (KV02); access-pattern ledger (KV03); lifecycle requirements (KV10); workload/SLO/cost ledger (KV11); exits to other systems (KV80).

**Entry and teaching:** Ordinary service code. First show a key identifying a value, a read and a conditional change, and why an application would choose that interface. Then use three worked requirement sheets: catalogue cache, order invariant and device history. Lifecycle and budget are requirement-level cases here; actual deletion, persistence and metering mechanisms live in the named product pages.

**Changed case and decision:** A discount-code store is reclassified from disposable cache to authoritative consumption state; a device workload acquires arbitrary historical joins. Reader can reject an inappropriate family and state the guarantees to test.

### K02 — Keys, distribution and bounded retrieval

**Outcome:** Design a key scheme and predict its lookup and fan-out cost.

**Owned sections:** Encoding and stable order (KV04); hot keys/ranges versus large values (KV05); bounded retrieval and continuation contracts (KV06).

**Entry and teaching:** K01's key/value idea, repeated in a small local layout. Use an encoding worksheet and a model that distributes writes then retrieves the latest ten entries.

**Changed case and decision:** Add a timestamp tie, a skewed tenant and random write shards; a page changes while new entries arrive. Reader can choose a key and bucket scheme, bound the merge work, and request the actual product's cursor contract.

### K03 — Conditional changes and invariants

**Outcome:** Locate the correctness boundary of a mutation.

**Owned sections:** Lost updates, conditions and unknown outcomes (KV07); aggregate/transaction boundary and limits (KV08).

**Entry and teaching:** Key/value and request/reply. Two-client state histories make a lost update visible before naming compare-and-set. Add durable request identities and then a two-key invariant.

**Changed case and decision:** The server applies the request but the reply disappears; two separately partitioned records must change together. Reader can choose a conditional operation, transaction or different design and identify what retries still need.


K01 keeps definitions and the decision ledger together because splitting “what must survive?” from “which service fits?” makes the choice harder. K02 keeps encoding and distribution together because a shard suffix changes the read key and merge. K03 earns a separate page for concurrency histories; adding them to key design would interrupt its spatial model. The general copy/replay/completeness investigation has one full home at FD04, and authority cutover at FD05. Native view changes still need their own execution below.

## The shared in-memory implementation branch

Redis has one full implementation home in the
[caches and in-memory map](caching.md#ca-g04--redis-open-source-in-practice).
The authoritative-state route enters that branch directly and does not first
complete source/cache coherence. The independent nine-page Redis allocation is
preserved in the derivation record; it is not a second proposed series.

## DynamoDB implementation

The model is an order service with a tenant-scoped identifier and an explicit request ledger. This branch teaches exposed service contracts and observed API behaviour. It does not reconstruct undocumented internals or make the original Dynamo paper stand in for today's DynamoDB.

### D01 — Items, keys and table design

**Outcome:** Choose a concrete item/table layout from access patterns.

**Owned sections:** Item representation, partition/sort key, expressions and size (KV29); single-table versus multi-table entities and adjacency (KV30).

**Entry and teaching:** Local key/value/access-pattern reminder. Compare two complete order-service layouts and issue native API operations.

**Changed case and decision:** A new lookup crosses tenants; an embedded list grows beyond the item budget; colocated entities need different retention. Reader can defend the table split and choose the operations that realise each query.

### D02 — Reading, filtering and continuation

**Outcome:** Fetch a correct bounded result under the selected read contract.

**Owned sections:** `Query`, `Scan`, filters, cursors, batch and unprocessed results (KV31); consistency by access path and absence of a multi-request snapshot (KV35).

**Entry and teaching:** D01 key layout, restated as a small table for direct entrants. SDK exercise shows raw response metadata before convenience pagination.

**Changed case and decision:** An empty filtered page has a continuation; a strong table read and GSI query disagree; writes occur between pages. Reader can build a correct iterator and choose consistency without inventing snapshot semantics.

### D03 — Secondary indexes and new access paths

**Outcome:** Build a lookup and account for its visibility and write cost.

**Owned sections:** GSI/LSI key and projection, sparse membership, constraints and asynchronous behaviour (KV32).

**Entry and teaching:** D01 and local visibility reminder from D02. Use a sparse unfulfilled-order index and follow one item through base and index state; cloud exercise inspects status and capacity.

**Changed case and decision:** A uniqueness check races index propagation; a heavily written index becomes the limiting resource. Reader can choose the index, projection and validation path. D11 owns a complete migration rather than repeating it here.

### D04 — Conditional mutations and request identity

**Outcome:** Make one-item operations safe under contention and ambiguous replies.

**Owned sections:** Conditions, optimistic versions, counters and durable idempotency records (KV33).

**Entry and teaching:** Local two-client history from K03, plus an item. Native clients race for the last unit and lose a reply.

**Changed case and decision:** The mutation succeeded but the caller retries; checking existence separately admits both contenders. Reader can choose an atomic condition and a replay-safe request design.

### D05 — Transactions and isolation

**Outcome:** Defend a multi-item invariant with the actual transaction/read contract.

**Owned sections:** Transaction scope, isolation, cancellation, contention and finite retry tokens (KV34).

**Entry and teaching:** D04's conditional operation, recapped locally. API histories compare a transactional read with ordinary multi-item reads; execute contention and cancellation cases.

**Changed case and decision:** A retry returns beyond its token lifetime; an observer uses a read API with weaker grouping; two Regions need the same invariant. Reader can select a transaction and identify remaining application obligations and Regional boundaries.

### D06 — Capacity, skew and throttling

**Outcome:** Explain cost and throttling from the work actually done.

**Owned sections:** Capacity metering, billing modes, rounding, consistency, indexes and transactions (KV36); hot partitions/items, adaptive behaviour and sharding (KV37).

**Entry and teaching:** D01 operations and D03 index basics, supplied locally in a small bill-of-work. A dated calculation worksheet and throttling evidence model precede any paid load exercise.

**Changed case and decision:** More table capacity leaves one hot item limited; small updates repeatedly write a large indexed item; random shards add merge reads. Reader can locate the bottleneck and choose a workload/key/capacity change.

### D07 — Reliable clients and bounded retries

**Outcome:** Keep failures and retries inside a caller's budget.

**Owned sections:** SDK deadlines, concurrency, unprocessed work, backoff and ambiguous mutations (KV45).

**Entry and teaching:** One API operation; local distinction between rejected and unknown-outcome writes. Fault-controlled SDK exercise records attempts, deadlines and residual work.

**Changed case and decision:** An automatically retried update applied twice or outlived its caller; a batch returned success with unprocessed entries. Reader can choose retry/concurrency settings and preserve an application deadline.

### D08 — Streams, expiry and derived consumers

**Outcome:** Keep an application view or expiry policy correct across delayed and repeated work.

**Owned sections:** Stream ordering, records, retention, checkpointing, rebuild and transaction records (KV38); request-time expiry and delayed TTL deletion (KV39).

**Entry and teaching:** D01 items plus FD04/FD05-level source/view reminder. Model a consumer ledger, then cloud exercise a duplicate and downtime. TTL enters as a lifecycle change with downstream records, not a generic scheduler.

**Changed case and decision:** A consumer exceeds retention; a record repeats; an expired session remains stored; the selected global mode lacks TTL. Reader can bound staleness, enforce access rules and choose catch-up versus rebuild.

### D09 — Backup, restore and cutover

**Outcome:** Recover an application, including changes beyond the restore target.

**Owned sections:** PITR/on-demand backup, new table, surrounding configuration, reconciliation and switching (KV40).

**Entry and teaching:** Item operations and an acknowledged request ledger; D08 is required only if using Streams in the recovery design. Real cloud restore with cleanup and an acceptance checklist.

**Changed case and decision:** Undoing an accidental delete also removes valid later orders; the restored table lacks required service configuration. Reader can choose a recovery point, reconcile valid work and prove the destination can serve traffic.

### D10 — DynamoDB global tables with multi-Region eventual consistency

**Outcome:** Design Regional writes, reads and return-to-service under asynchronous conflict resolution.

**Owned sections:** MREC conflict behaviour, Regional transaction scope, routing, evacuation and failback (KV41).

**Entry and teaching:** Local replica-delay and request-routing model; D04/D05 for any invariant the application claims. Regional history model with optional charged cloud exercise.

**Changed case and decision:** Two Regions update the same item; a transaction arrives elsewhere as individual changes; a previously failed Region returns. Reader can choose write ownership/conflict policy and define routing and reconciliation.

### D11 — Changing a live DynamoDB model

**Outcome:** Introduce a key or lookup without an unverified gap.

**Owned sections:** Product-specific online index/backfill, dual reader/writer, completeness and cutover (KV44).

**Entry and teaching:** D01/D03 and local FD04/FD05 migration state machine. Native SDK worksheet includes concurrent writers and an audit keyed by entity identity/version.

**Changed case and decision:** A backfill writes stale data over a new version; a matching item count hides omitted entities; writers continue using the old form. Reader can choose sequencing, validation and retirement conditions.

### D12 — DynamoDB global tables with multi-Region strong consistency

**Outcome:** Decide when the strong global contract fits and what it rules out.

**Owned sections:** MRSC replica/witness topology, cross-Region write coordination, strong-read conditions, conflict/availability behaviour and feature constraints (KV42).

**Entry and teaching:** Direct-entry comparison recaps eventual versus strong read and Regional endpoint. A documented topology/failure model; a cloud exercise is optional and must meet current Region/account requirements.

**Changed case and decision:** The application also needs transactions or TTL; a Region cannot contact another quorum participant; a strong read is replaced by an eventual one. Reader can accept/reject this mode, choose an allowed topology and state degraded operations.

### D13 — Permissions and service operation

**Outcome:** Launch with verifiable access boundaries and meaningful signals.

**Owned sections:** IAM, tenant isolation, indexes/streams/backups/export and encryption role (KV43); alarms, changed traffic, capacity/cost review and restore acceptance (KV46).

**Entry and teaching:** The relevant earlier mechanism page, linked from each incident. A minimal policy exercise checks both allowed and denied access paths; operational cases tie metrics to a next action.

**Changed case and decision:** An index/maintenance operation escapes the intended tenant boundary; aggregate traffic stays flat while skew increases; a restored table is operationally incomplete. Reader can audit the service contract and distinguish configuration, client and capacity problems.


D01 and D02 split because modelling an access route and correctly iterating API responses are different investigations and common entrances. D03 owns index representation and visibility; the temporal correctness proof of replacing a model earns D11. D04 and D05 split because one-item conditional correctness does not explain multi-item isolation, cancellation or retry scope. D06 keeps metering and skew together: a capacity purchase is only meaningful after locating the work. D07 earns a separate native client lesson rather than scattering timeout handling across every operation. D08 keeps TTL with a consumer lifecycle, but D12 states the mode restriction locally too. D09 is an application recovery investigation. D10 and D12 are separate global-mode investigations because their correctness and feature constraints lead to materially different designs. D13 assembles policies and operational evidence without re-teaching those mechanisms.

## Wide-column decisions

This path starts with a bounded ordered slice, not “NoSQL” or a list of vendor features. The term wide-column needs an immediate concrete distinction from analytical column storage. Cassandra mechanisms stay out of these general explanations except in explicitly named examples.

### W01 — Wide-column stores: partitions and ordered rows

**Outcome:** Read a wide-column key and predict which work a query can avoid.

**Owned sections:** Wide-column versus analytical column layout (KV47); partition/clustering or row-key query route, bounds, ties and continuation (KV48); product-specific sparse/version/family vocabulary (KV51); Bigtable's distinct row/cell contract (KV77).

**Entry and teaching:** Ordinary records and a timestamp; no relational or Cassandra prerequisite. Layout/query model uses device `d42`, then a small named Cassandra/Bigtable contrast.

**Changed case and decision:** Equal timestamps need a tie-breaker; a new predicate is outside the ordered key; row-level atomicity is misread as cross-row atomicity. Reader can design a bounded query and identify which contract requires product documentation.

### W02 — Buckets, late data and sustained ingestion

**Outcome:** Keep partitions and background work bounded as a workload grows.

**Owned sections:** Partition/bucket size, hot producers, late writes, retention and cross-bucket reads (KV49); ingestion/serving/background-work budget and overload (KV54).

**Entry and teaching:** W01's ordered partition, recapped locally. A parameter model changes event rate, bucket width, lateness and retention, displaying both write spread and read merge work.

**Changed case and decision:** One device outgrows its bucket; late data reopens old storage; sustained writes leave no maintenance budget. Reader can choose bucket and admission rules and reject a design that only works at average load.

### W03 — More than one query

**Outcome:** Choose a duplicate table, supported index or different store.

**Owned sections:** Query-table authority, interrupted duplicate writes, repair/rebuild (KV50); bounded key route versus index selectivity/distribution (KV52).

**Entry and teaching:** One W01 key design; FD04/FD05's source/view model is recapped in the worked case. Compare per-device history with an alert lookup; C16 owns actual SAI mechanics and commands.

**Changed case and decision:** One duplicate write fails; a supposedly selective predicate becomes common. Reader can choose an additional read model, require a repair process or move the query elsewhere.

### W04 — Choosing a wide-column service

**Outcome:** Decide which implementation's responsibilities and guarantees match the workload.

**Owned sections:** Cassandra, Bigtable, managed item and relational/analytical alternatives (KV53); Bigtable GC/read-filter distinction (KV78); managed placement, application profiles, replication/consistency, scaling and restore boundary (KV79).

**Entry and teaching:** W01's bounded query, supplied locally. Conditional selection cases use primary documentation and a responsibility/guarantee comparison, not a vendor ranking.

**Changed case and decision:** Data expires but Bigtable reads still need filters; an extra cluster changes read routing/consistency rather than supplying a backup; the team cannot own Cassandra repair. Reader can choose a branch and list evidence needed before production.


W01's named representation comparison prevents a false universal cell model without opening a product manual inside the introduction. W02 earns another page for the growth/retention investigation and its parameter model. W03 earns one when a second query changes the write contract. W04 is the direct selection entrance; it teaches comparison conditions, not several products' administration. Bigtable operation remains explicitly deferred.

## Cassandra implementation

The data is tenant/device history with bounded buckets and a distinct alert lookup. The version is selected before implementation; current documentation aliases are not a release pin. The native lab is attached to C01 and reused by later pages. Its multi-node scenarios are practical resources, not extra explanatory articles or browser emulations.

### C01 — CQL data models and a real cluster

**Outcome:** Express a bounded design in the actual product and establish a usable learning environment.

**Owned sections:** Partition/clustering/static values, collections, null/unset/counters and relevant restrictions (KV55); baseline authentication/authorisation, node/tool access and encryption configuration (KV75); attached multi-node lab, fault/reset/cleanup and application acceptance harness (KV76).

**Entry and teaching:** Local W01 reminder; no SQL prerequisite. Native CQL worksheet and one pinned multi-node environment. The lab's later scenario worksheets are owned here as an environment/harness, while the explanations stay with their mechanism pages.

**Changed case and decision:** A one-node example cannot establish quorum/repair behaviour; null updates create deletion work; unbounded collections grow. Reader can run the branch safely, inspect the key shape and identify the product limits of the design.

### C02 — Replica placement and consistency levels

**Outcome:** Predict where data lives and which replies an operation needs.

**Owned sections:** Tokens, replica placement, topology/racks/datacentres and coordinator role (KV56); replication factor, consistency levels, overlap and its limits (KV60).

**Entry and teaching:** Local key/replica/request reminder; C01 for native execution. Placement model and native changes to consistency level with unavailable replicas.

**Changed case and decision:** A rack fails; local quorums in two datacentres are mistaken for one shared quorum; concurrent writes defeat a simplistic overlap proof. Reader can choose replication and read/write settings without claiming serialisable transactions.

### C03 — The write path and restart

**Outcome:** Explain an acknowledgement and its local recovery consequences.

**Owned sections:** Commit log, configured sync, memtable, flush, SSTables and replay (KV57).

**Entry and teaching:** C02 replication acknowledgement recapped as separate from local recording. Inspectable write-path trace and disposable process restart with settings recorded.

**Changed case and decision:** Failure occurs before/after recording or flush; changing sync settings changes the claim. Reader can explain local survival and distinguish process restart evidence from host/power-loss guarantees.

### C04 — The read path and amplification

**Outcome:** Explain why a small result can take substantial work.

**Owned sections:** Memory and file lookup, filters/indexes, versions, tombstones and replica reconciliation (KV58).

**Entry and teaching:** C03 immutable files; direct entrants get a small local file layout. Merge model with native read/trace evidence.

**Changed case and decision:** One row's current value is spread across files while many deleted candidates are examined. Reader can distinguish data returned from data searched and choose the relevant compaction, deletion or key-design investigation.

### C05 — Timestamps, mutations and batches

**Outcome:** Predict the winning mutation and the atomic boundary of grouped work.

**Owned sections:** Timestamp reconciliation, clocks, ties, deletes and collection mutations (KV59); single-partition, logged/unlogged, counter and conditional batch distinctions (KV62).

**Entry and teaching:** C01 mutations plus a local C02 replica reminder. Native timestamp cases and batch visibility histories.

**Changed case and decision:** A skewed clock suppresses the intended newer change; a multi-partition batch is treated as a throughput shortcut or isolated transaction. Reader can choose mutation/batch form and state what observers or retries may see.

### C06 — Lightweight transactions

**Outcome:** Protect a supported conditional invariant and handle uncertainty.

**Owned sections:** LWT/Paxos, serial consistency, contention, timeout recovery and unsafe mixing with ordinary mutations (KV61).

**Entry and teaching:** C05 mutation semantics; local K03 conditional-write history. Protocol model and native two-client conditional insert with injected response loss where feasible.

**Changed case and decision:** The condition agreed but its reply vanished; an ordinary write bypasses the protocol. Reader can choose LWT, resolve an unknown result and recognise when the invariant needs another design.

### C07 — Catch-up and repair coverage

**Outcome:** Make replicas converge and prove the planned ranges were covered.

**Owned sections:** Hints, read repair and anti-entropy distinctions (KV63); full/incremental repair, range/datacentre coverage, budget, scheduling and evidence (KV66).

**Entry and teaching:** C02 placement and C05 versions, recapped in a three-replica timeline. Native repair procedure includes an intentionally missed range and evidence of completion.

**Changed case and decision:** A node misses the hint window; cold data is never read; a successful command repairs only part of the cluster. Reader can plan and verify convergence within the relevant safety margin.

### C08 — Compaction and maintenance debt

**Outcome:** Choose and observe a strategy for the workload.

**Owned sections:** Pinned-release UCS and alternatives, file grouping/merges, read/write/space amplification, TTL alignment and backlog (KV64).

**Entry and teaching:** C03/C04 file and merge model, repeated locally as a compact diagram. File model plus native statistics under controlled write shapes; no universal benchmark ranking.

**Changed case and decision:** A strategy change needs temporary disk; sustained writes outpace merges; mixed lifetimes prevent expected reclamation. Reader can choose a strategy and budget the work required to keep it healthy.

### C09 — Deletes, expiry and tombstone safety

**Outcome:** Remove data without returning deleted state later.

**Owned sections:** Tombstones, TTL, read work, grace, overlapping files and safe purge/resurrection conditions (KV65).

**Entry and teaching:** Local C05 timestamp and C07 missed-replica reminders; links deepen them. State/file model plus native expiry evidence; model any long absence not actually executed.

**Changed case and decision:** A replica returns after a deletion marker was purged; lowering grace removes a symptom while violating the repair assumption. Reader can set a defensible retention/repair/purge policy and diagnose tombstone cost.

### C10 — Drivers, paging and retry load

**Outcome:** Bound client work and route it correctly.

**Owned sections:** Token/DC-aware routing, prepared statements, paging, concurrency, retry, speculation and idempotence (KV67).

**Entry and teaching:** C01 keys and local C02 coordinator model. Native multi-client lab records routes and attempts under controlled errors.

**Changed case and decision:** A speculative retry duplicates or amplifies work during overload; paging resumes while writes continue. Reader can select client settings and separate a safe read retry from an ambiguous mutation.

### C11 — Diagnosing a running cluster

**Outcome:** Identify the constrained resource before changing capacity.

**Owned sections:** Partition skew, disk/heap, queues, dropped work, tombstone scans and compaction/repair debt (KV68).

**Entry and teaching:** Direct symptom entrance with short local mechanism reminders and links. Incident evidence packets correlate client latency, node signals, partition distribution and maintenance work.

**Changed case and decision:** Adding nodes leaves a single huge partition unchanged; a repair backlog competes with reads. Reader can distinguish an access-shape, client, replica or maintenance problem and choose a supported intervention.

### C12 — Topology changes and replacement

**Outcome:** Change replica ownership without assuming historical data moved itself.

**Owned sections:** Bootstrap, streaming, replace/remove/decommission, capacity, replication-factor changes, repair and cleanup (KV69).

**Entry and teaching:** C02 ownership and C07 coverage, locally recapped. State machine followed by disposable node-add/replacement exercise with verification.

**Changed case and decision:** A dead node is replaced with little disk headroom; replication factor rises but historical replicas are incomplete. Reader can sequence the change, prove ownership/data health and postpone cleanup until safe.

### C13 — Multi-datacentre operation

**Outcome:** Define local service, degraded operation and return after a Regional failure.

**Owned sections:** Datacentre placement/routing, local consistency choices, evacuation and cutback (KV70).

**Entry and teaching:** C02 and C07 with an explicit local recap; topology commands stay in C12. Multi-datacentre model and required bounded native local routing/isolation/return exercise; real-region latency/scale work is optional and separately labelled.

**Changed case and decision:** A datacentre is isolated then returns stale; local clients accidentally route across a high-latency link. Reader can choose routing and degraded operations and establish catch-up criteria before return.

### C14 — Backups and recoverable history

**Outcome:** Build a backup set whose recovery claims can be checked.

**Owned sections:** Snapshot/incremental file sets, retention, schema/topology metadata, supported commit-log archival/replay and consistency boundary (KV71).

**Entry and teaching:** C03 files/log and local acknowledgement model. Native backup inventory and verification worksheet. The archive/replay path is included only if verified for the chosen release and tooling.

**Changed case and decision:** Required files aged out; the snapshot is complete per node but not a coherent application checkpoint across tables. Reader can state the recovery window, inventory dependencies and avoid claiming unsupported point-in-time recovery.

### C15 — Restore and application reconciliation

**Outcome:** Recover into a supported topology and validate useful state.

**Owned sections:** Isolated restore, schema/topology compatibility, timestamps/deletes, accepted later writes and application acceptance (KV72).

**Entry and teaching:** C14's backup inventory and local C05 version-order reminder. Real restore and reconciliation worksheet uses the device event ledger and alert lookup.

**Changed case and decision:** Restoring an older value conflicts with a newer timestamp; an apparently healthy cluster lacks valid later events or a derived table. Reader can choose replay/reconciliation and defend the cutover criteria.

### C16 — Storage-attached indexes and query alternatives

**Outcome:** Choose an index from its read/write mechanism and measured query shape.

**Owned sections:** Pinned SAI lifecycle, supported predicates, distribution/selectivity, memory/file work and competing query-specific tables (KV73).

**Entry and teaching:** C04 read path and local W03 alternative-table reminder. Native index build and query evidence with selective/common values; investigate actual supported query plans/diagnostics.

**Changed case and decision:** A common indexed value fans out widely; adding indexed columns changes memory/flush work. Reader can choose SAI or another table and establish workload-specific acceptance tests.

### C17 — Schema change and rolling upgrades

**Outcome:** Evolve the service without leaving incompatible readers or an impossible rollback.

**Owned sections:** Live schema/value changes, mixed client/server versions, migration/upgrade checkpoints and rollback limits (KV74).

**Entry and teaching:** C01 model and local FD04/FD05 versioned cutover reminder; C12 for topology operations. One model migration and one pinned release-upgrade procedure, with external compatibility references.

**Changed case and decision:** Old clients keep writing an old value form; a binary/file-format boundary prevents a simple downgrade. Reader can sequence a compatible change and choose forward repair, rollback or restore deliberately.


C01 is an execution entrance with a reusable lab; the security section establishes the lab and node/tool boundary rather than starting a separate general security course. It must not become a command catalogue. If implementation reveals that the real security model cannot be taught within that focused setup, revisit KV75's boundary before drafting more prose.

C02 keeps placement and consistency together because a reply count is meaningless without the actual replica set. C03 and C04 split because restart survival and read amplification each need their own inspectable mechanism. C05 keeps timestamp semantics beside batch boundaries because grouped mutations still reconcile by those semantics. C06 earns a separate protocol and timeout investigation. C07 keeps catch-up mechanisms with the practical repair-coverage task; hints/read repair receive only the depth needed to show why the operator still needs repair. C08 and C09 split because merge cost and safe forgetting have different models and failure cases, even though they interact. C10 owns client decisions; C11 is a direct diagnostic entrance that uses existing mechanism explanations. C12 and C13 split routine ownership changes from service operation across an isolated datacentre. C14 and C15 split proving a recoverable history from restoring/reconciling application state. C16 is a real query investigation rather than “Cassandra has indexes”. C17 is a change procedure with compatibility consequences, not a complete release-management course.

## Unit coverage audit

Every ability has exactly one full proposed home or an explicit boundary. “Full” means the depth promised in the ability row, not unlimited coverage of that subject. Short reminders elsewhere remain reminders. Shared teaching homes follow the final field allocation.

| Units | Full home |
| --- | --- |
| KV01, KV02, KV03, KV10, KV11 | K01, at selection/requirements depth; product mechanisms follow in their named homes. |
| KV04, KV05, KV06 | K02. |
| KV07, KV08 | K03. |
| KV09 | FD04: source, replay and copy completeness. |
| KV12 | FD05: representation compatibility, authority cutover and retirement; native schema cases remain D11/C17. |
| KV13, KV14 | CA-A11/CA-A13. |
| KV15, KV19 | CA-A13: native atomic operations, counter/expiry and retry evidence. |
| KV20 | CA-A06: expired-owner counterexample and external-resource fencing boundary; no generic coordination branch. |
| KV16, KV17 | CA-A11, shared in-memory implementation home. |
| KV18/coherence | CA-A02: source/fill race. |
| KV18/misses | CA-A03: miss-load protection. |
| KV21 | CA-A14. |
| KV22, KV23 | CA-A15, shared in-memory implementation home. |
| KV24, KV25 | CA-A16, shared in-memory implementation home. |
| KV26, KV28 | CA-A17, shared in-memory implementation home. |
| KV27 | CA-A14. |
| KV29, KV30 | D01. |
| KV31, KV35 | D02. |
| KV32 | D03. |
| KV33 | D04. |
| KV34 | D05. |
| KV36, KV37 | D06. |
| KV38, KV39 | D08. |
| KV40 | D09. |
| KV41 | D10. |
| KV42 | D12. |
| KV43, KV46 | D13. |
| KV44 | D11. |
| KV45 | D07. |
| KV47, KV48, KV51 | W01. |
| KV49, KV54 | W02. |
| KV50, KV52 | W03. |
| KV53 | W04. |
| KV55, KV75 | C01, model and supported setup depth. |
| KV56, KV60 | C02. |
| KV57 | C03. |
| KV58 | C04. |
| KV59, KV62 | C05. |
| KV61 | C06. |
| KV63, KV66 | C07. |
| KV64 | C08. |
| KV65 | C09. |
| KV67 | C10. |
| KV68 | C11. |
| KV69 | C12. |
| KV70 | C13. |
| KV71 | C14. |
| KV72 | C15. |
| KV73 | C16. |
| KV74 | C17. |
| KV76 | C01's attached native lab environment and acceptance harness; scenario explanations belong to their mechanism pages. |
| KV77 | W01, representation/contract comparison only; full Bigtable product practice deferred. |
| KV78, KV79 | W04, consequential selection cases only; full Bigtable GC/replication/operations branch deferred. |
| KV80 | K01, conditional exits only; embedded engines, transactional KV internals, coordination algorithms, queue delivery and analytical execution excluded from this commission. |

## Reader journeys and page cost

- **Choosing a durable item service:** K01 → D01 → the query/index or mutation/transaction pages relevant to the ledger → D06/D07 → D09/D13. Add D10 or D12 only when global writes are a real requirement. A reader does not need Redis or Cassandra first.
- **Using Redis as authoritative structured state:** follow the definitive authoritative Redis entrance in Final coordination below; the source/cache coherence path is optional for that role.
- **Designing device history:** W01 → W02 → W03 when more than one query is needed → W04 to choose the implementation. The Cassandra route then starts at C01/C02; Bigtable exits to explicit primary references until a full branch is commissioned.
- **Owning Cassandra in production:** C01/C02 → write/read/timestamp mechanisms → LWT only if needed → repair/compaction/deletion → clients/diagnosis/topology → backup/restore/change. Readers can enter C09, C11 or C15 directly for a concrete incident; local models must prevent a prerequisite chase.
- **Changing a live schema or adding a read path:** FD04/FD05 → D03/D11 or W03/C16/C17. The transferable completeness argument has one home; native backfills and product constraints earn their branch-specific space.

The derived total is **37 explanatory pages here: 3 common, 13 DynamoDB, 4 wide-column and 17 Cassandra**; the shared Redis branch is counted once in the in-memory map, plus a reusable native Cassandra lab resource. This is a scope inventory, not a production quota or a fixed delivery batch. It covers 80 units of different scales. Redis homes are resolved in the final coordination below. The page count should change when a reviewer demonstrates that a boundary saves effort without losing an ability, or exposes a mechanism currently buried inside a page. It should not change to resemble another collection.

## Evidence, verification and unresolved scope

Primary sources below were used as planning evidence on 18 October 2026. They changed boundaries or exposed a consequential difference. They do not establish that a proposed experiment has run. Writers must build a claim ledger with version/API mode, settings, limits and access conditions before article production.

| Planning evidence | Consequence for this proposal; later verification |
| --- | --- |
| [DynamoDB read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) and [pagination](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.Pagination.html) | D02 must show access-path visibility and empty filtered pages with continuation. Recheck the exact SDK pagination/metadata behaviour; a strong read must not be drawn as a snapshot across requests. |
| [Transactions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html) and [partition-key design](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html) | D05 needs transaction-specific isolation/cancellation cases; D06 needs a hot-item limit despite managed capacity. Exact operation limits, retry-token windows and metering need fresh API documentation. |
| [Global-table behaviour](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/V2globaltables_HowItWorks.html) and [global-table design](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-global-table-design.html) | Global Tables version 2019.11.21/current documentation distinguishes MREC from MRSC. As accessed, MRSC lacks transaction operations and TTL and has mode/topology/Region-set constraints; its strong-read guarantee requires a strongly consistent request, not merely an MRSC table. D10 and D12 therefore remain separate. Exact availability, supported Regions/accounts, witnesses, LSIs, creation/migration restrictions and API errors must be rechecked for the selected account and Regions. This is planning evidence, not deployment advice. |
| [PITR overview](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Point-in-time-recovery.html) and [restore API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_RestoreTableToPointInTime.html) | D09 must restore into a new table and validate configuration and subsequent valid work. Recheck what is inherited from current source configuration and what must be re-established; do not draw restore as rewinding the live table in place. |
| [Redis transactions](https://redis.io/docs/latest/develop/using-commands/transactions/) and [locks](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/) | CA-A13 must expose actual errors, no assumed rollback and the stale lease-holder case. Verify commands/functions against the selected Redis release; lock claims require a stated external-resource model. |
| [Redis eviction](https://redis.io/docs/latest/develop/reference/eviction/) and [persistence](https://redis.io/docs/latest/management/persistence/) | CA-A11 memory limits and CA-A14 crash survival require separate mechanisms. Verify release-specific policies, buffering, fsync/rewrite configuration and observed process memory. |
| [Redis replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/), [Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/) and [Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/) | Replication receipt, promotion and sharded multi-key work need CA-A15/CA-A16. Verify the selected client's discovery/redirect/retry behaviour. Do not generalise to managed or active-active products. |
| [Cassandra architecture](https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html), [storage engine](https://cassandra.apache.org/doc/latest/cassandra/architecture/storage-engine.html) and [CQL](https://cassandra.apache.org/doc/latest/cassandra/developing/cql/cql_singlefile.html) | C02–C06 must distinguish local recording, replica replies, timestamp reconciliation, batch scope and LWT. Recheck protocol/driver defaults, command details and commit-log configuration against one supported release. |
| [Cassandra repair](https://cassandra.apache.org/doc/latest/cassandra/managing/operating/repair.html) and [compaction](https://cassandra.apache.org/doc/stable/cassandra/managing/operating/compaction/overview.html) | Hints are not complete repair; repair coverage and tombstone safety cannot be a paragraph under “operations”. C07/C08/C09 keep separate obligations. Verify defaults, repair modes, grace/purge conditions and chosen strategy in the pinned release. |
| [SAI overview](https://cassandra.apache.org/doc/stable/cassandra/developing/cql/indexing/sai/sai-overview.html) and [concepts](https://cassandra.apache.org/doc/stable/cassandra/developing/cql/indexing/sai/sai-concepts.html) | C16 is a real alternative to query-specific tables. Verify supported predicates and inspect actual workload-dependent work; marketing performance comparisons are not evidence for this workload. |
| [Cassandra bulk loading](https://cassandra.apache.org/doc/latest/cassandra/managing/operating/bulk_loading.html) | C14/C15 must establish supported file/restore tooling and topology constraints. Commit-log archival/replay feasibility, cutoff precision and application consistency remain a commissioning verification task; no turnkey PITR promise is made. |
| [Bigtable schema](https://docs.cloud.google.com/bigtable/docs/schema-design), [overview](https://docs.cloud.google.com/bigtable/docs/overview) and [GC](https://docs.cloud.google.com/bigtable/docs/garbage-collection) | W01/W04 must not transplant Cassandra's partition, version or repair semantics. Family-level planning can compare workload/routing/retention responsibilities, but cannot supply Bigtable operating expertise without another branch. |

The hardest open choice is product breadth. DynamoDB and Cassandra are coherent initial branches because their design and failure obligations differ sharply. Redis serves the atomic in-memory and survival cases through the single coordinated in-memory branch. Redis versus Valkey needs explicit discussion and a release/tooling decision; this proposal does not commission both. Bigtable's full branch would expand the scope and needs its own ability derivation rather than a few appended operations sections.

Shared distributed-systems foundations remain parked. These database pages explain local replica histories, quorums, leases and repair only as far as their database decision requires. They do not commission a CAP taxonomy, consensus survey or general coordination course. Time-series query languages, specialised retention/downsampling engines, stream processing, search ranking, queue delivery, embedded engine internals and arbitrary analytical execution remain separate subjects. Nothing in this plan authorises article writing or publication.

## Final coordination and required native completions

KV13's bounded structure operations are taught at CA-A13, with representation/
execution cost at CA-A11 (KV14). KV15/KV19 are CA-A13; KV16/KV17 are CA-A11;
KV21/KV27 are CA-A14; KV22/KV23 are CA-A15; KV24/KV25 are CA-A16; KV26/KV28
are CA-A17. The formerly broad KV18 is resolved into two named parts: the
source/fill race at CA-A02 and miss-load protection at CA-A03. KV20's paused-owner
counterexample is at CA-A06, ending at the external-resource fencing boundary;
it does not commission a generic locking programme. Each named part has one home.

**Authoritative Redis entrance:** CA-A05/CA-A06 → CA-A07 → CA-A11/CA-A13 →
CA-A14 → CA-A15 or CA-A16 → CA-A17. Test accepted state, expired authority after
restore and ambiguous retries. **Disposable cache entrance:** CA-A01–CA-A04 →
CA-A10/CA-A12, adding the same native machinery only when the loss contract needs it.

W03 owns a native Cassandra two-table failure-and-repair worksheet, labelled with
the selected product. The device ledger is authoritative; the alert lookup is a
derived view. Interrupt a write between them, identify repeats by event ID, audit
by identity/version rather than count, and rebuild after catch-up history expires.
C05 supplies the actual batch/visibility limitations and C17 the live shape-change
procedure; neither a successful batch nor an index build discharges the repair.

C13 requires a bounded native two-datacentre routing, isolation and return exercise
in C01's reusable environment. Inspect actual driver routes and returned/repaired
state. This is a local-topology execution result, not a claim about cloud regional
latency, scale or disaster recovery. If commissioning cannot supply that environment,
narrow the operating promise explicitly instead of substituting an unlabelled model.
