# Independent review: relational, document and keyed stores

Reviewer perspective: practitioner and editor. Audience: an intelligent application engineer new to each subject, with basic programming and records. This is a planning review; it cannot establish article quality, executable lessons or publication readiness.

## First account, recorded before reading proposals

This account was persisted before opening any proposal or author ability list. It draws on subject knowledge, not the earlier field plan or inventories. The planned pages may make better boundaries than the ones I would choose; the abilities below are the test.

### Relational databases

A practitioner must represent facts with tables, keys and relationships; distinguish absent, unknown and duplicate values; and decide which invariants the database can enforce. They must predict join multiplicity, filtering and grouping, then express a useful query without silently changing its meaning. They need enough execution knowledge to distinguish reading fewer entries, fetching fewer rows and returning fewer rows, and to assess an index against its write and storage cost.

They must place a multi-step business operation inside the right transaction boundary, reason about interleavings and isolation, identify waits and deadlocks, and retry without repeating a business action. A timeout can leave the result unknown; a correctness lesson must finish at what the application does next. Constraint checks, retries and external effects need to fit one application story.

They must know what commit promises after process or machine loss, how logs and checkpoints support recovery, and how to prove that a backup restores the required state. Replication, failover, stale reads and restore targets affect what the application is allowed to conclude. Schema changes, backfills, maintenance and resource exhaustion need safe operating decisions, rather than a list of commands. Security should let them bound access for the application and the operator.

Transferable teaching should make relational mechanisms and design consequences intelligible across engines while identifying material differences. Selected product teaching must let the reader run, diagnose, change and recover that product. It need not teach an optimiser implementation, every index family, all SQL syntax or a general distributed-systems curriculum.

### Document databases

A practitioner must choose the document boundary from reads, changes, ownership and growth. They should compare embedding and references using an actual update that crosses the boundary, and handle missing fields, mixed versions, duplicate logical entities and unbounded arrays. Flexible representation does not remove the need for validation, compatibility or migration.

They must predict how filters, projections, array predicates, sorts and aggregation act on data, including surprising multiplicity. They need to choose and read indexes, recognise scans, bound result and memory costs, and understand where transaction guarantees stop. Retry, acknowledgement and read settings must become an application decision under failure, not slogans about consistency.

They must understand a selected implementation's storage, replica and partition model well enough to choose keys, avoid hot partitions, recognise placement effects, operate backups and restores, and distinguish safe change from repair. Security, observability and recovery need practical work proportionate to the promise. The collection should state when a relational model or another store would make the required invariants easier.

One representative product can carry deep operation, provided its mechanisms are marked as that product's and comparison demonstrates what does and does not transfer. An implementation encyclopaedia and every aggregation operator are outside the necessary scope.

### Key-value and wide-column stores

A practitioner must start from the allowed access paths: construct a key from a request, determine what an operation touches, and know which new question requires a scan, secondary structure or new copy. They must design composite keys and ordered ranges, reason about item and partition growth, and detect concentration of traffic as well as concentration of bytes. Wide-column storage needs an honest explanation of partition keys, clustering and query-shaped duplication; treating it as a larger dictionary would fail the reader.

They must distinguish single-key atomicity, conditional writes and multi-record operations; use retries and idempotency under unknown outcomes; and know when a read can be stale. TTL, eviction and durability differ: disappearance may be intended expiry, memory pressure, an acknowledged write lost after failure, or a modelling error. Caches need miss, stampede, invalidation and stale-value handling tied to authoritative data.

They must understand what replicas, quorum choices, repair, tombstones and compaction change for their selected implementation. A delete or expiry can remain physical work and reappear in a poorly understood recovery path. Capacity, hot partitions, latency tails, failure and restore need diagnosis and a practical response. Product lessons must expose the request, configuration, observation and resulting application behaviour, including cost or capacity where that shapes design.

The family title must not imply that memory caches, durable managed key-value services and wide-column engines share one operating contract. Each should either have a usable path to its stated decisions or be explicitly a comparison with limits. General distributed-systems theory, every command and every vendor are outside scope; these subjects' local failure cases are inside it.

## Proposal reading and findings

The proposals were read after the account above, with their ability lists checked where a teaching obligation or allocation was uncertain. This is an outline-and-commission review, not a factual verification of current products. I have not consulted the earlier inventories, other reviews or synthesis decisions. I supplied normal database and operations knowledge when interpreting the plans; the concerns below identify where that knowledge has no sufficiently definite teaching home.

### Judgement

These are substantial proposals worth discussing with the user. They preserve the difficult parts of the subject much better than a family overview followed by short product tours would. Concrete repairs are needed before turning them into article commissions: fix the native PostgreSQL concurrency obligation, separate CockroachDB's three change tasks, make the wide-column multi-copy failure executable, and resolve the Redis ownership seam. Several other boundaries need clear commissioning tests rather than an automatic new page.

This judgement establishes that the proposed destinations can support useful practitioner journeys, subject to those repairs. It establishes neither that the unwritten pages will deliver those journeys nor that their native environments are feasible. No article is ready as a draft through this review, and no publication is authorised.

### What should survive review

- Relational design, SQL result meaning, access paths and execution are separate outcomes. RL81's fan-out cases, RL87's first wrong estimate and RL88's concurrent measurement are particularly useful: they prevent a reader treating a fast wrong answer or a warm microbenchmark as success. Do not collapse these because they all involve queries.
- RL93 takes an application all the way past a missing commit reply. RL94 then follows durable intent into worker failure. That is an important completion of the correctness route, not incidental architecture material.
- Relational recovery distinguishes logs, a useful restore, freshness and promotion authority. RL96/RL116 explicitly reconcile a later valid order. Their application acceptance should survive any cost reduction.
- Documents are presented as mutation and growth boundaries, not merely JSON. DC54 compares embedding, references, buckets and subsets together. DC55's same-element match and DC64's repeated value within a unique multikey index are examples where application intuition otherwise gives a plausible wrong answer.
- DC67's surviving history and DC68's client observation have different questions. Keep both; acknowledgement, reading from a copy and connection waiting should not become a consistency acronym table.
- Keyed and wide-column paths have separate entrances. W01's concrete distinction from analytical column storage and its named Cassandra/Bigtable contrast prevent a false common physical model. Bigtable operation is honestly deferred.
- Cassandra repair coverage, compaction cost and safe tombstone removal have three different outcomes. C07–C09 earn their boundaries. The relationship between them should remain visible; joining them into one operations chapter would hide precisely the assumptions the operator must keep aligned.
- DynamoDB receives real service-contract depth: iterator completion, conditional mutation, isolation, metering, client retries and application recovery. D10 and D12 have different design outcomes. Their asymmetry with Redis and Cassandra is justified by the service contract rather than vendor prestige or matching counts.

### Consequential findings and smallest repairs

#### R1. Native PostgreSQL concurrency is not definitely allocated

**Reader outcome at risk:** the PostgreSQL user must choose and execute a transaction/isolation/locking/retry protocol for the actual server. Otherwise they can understand the generic histories yet implement a protection the chosen engine does not supply under those conditions.

**Homes checked:** RL90, RL91 and RL93; RL110–RL122; abilities RL25–RL29 and RL53–RL66. RL90 correctly says implementation behaviour must not be inferred from an isolation label. RL91 asks for native scheduling and absent-row protection. Neither names the selected implementation or allocates its required syntax, errors and exact histories. The PostgreSQL branch has excellent native storage, tuning, recovery and security homes, but no corresponding explicit native concurrency obligation. The CockroachDB branch does have RL124–RL125.

**Why owed:** the promise includes protecting invariants and operating the selected conventional server. This is core application work, not optional specialist administration. Mentioning InnoDB as a contrast cannot substitute for a usable PostgreSQL implementation.

**Smallest repair:** designate the PostgreSQL native reservation, absent-row/deadlock and unknown-commit exercises as the implementation work inside RL90/RL91/RL93. Give each one an actual server/driver version, statements, error-to-action branch and verified final state. Keep the generic histories separately labelled within those pages and use compact contrasts for other engines. A new PostgreSQL concurrency article is unnecessary unless that combined teaching demonstrably becomes costly. Recheck with a reader asked to implement the last-seat invariant and handle both a known abort and a vanished commit response.

#### R2. RL130 joins three independent change investigations

**Reader outcome at risk:** a reader with a blocked schema job, a cluster version change or a PostgreSQL migration needs to find a complete procedure with its own interruption and rollback states. A common heading about coexistence does not make those states interchangeable.

**Home checked:** RL130, “CockroachDB schema jobs, upgrades and SQL migration”, plus RL74. The described execution is one interrupted schema job and one migration rehearsal. No native staged-upgrade exercise is actually specified, although staged versions and upgrades are owned. The proposed changed case is a compatibility mismatch during migration, which cannot test the cluster-upgrade obligation.

**Why owed:** the branch promises operating and changing a distributed implementation. Schema-job progress, mixed cluster versions and transferring write authority are all necessary, but teach different state machines. The corresponding general homes are already distinct in RL100, RL101 and RL109.

**Smallest repair:** separate schema-job change from upgrade/migration in the allocation now. Keep client/schema compatibility beside the migration rehearsal. Give upgrades their own explicitly scoped native sequence, interruption and acceptance result; decide whether it belongs with RL128's cluster change or with the migration page after that sequence is drawn. This need not create three articles, but a single page should not silently absorb all three. The alternative is an honest initial branch that defers one task and narrows its operating promise; merely calling it a bounded page is insufficient.

#### R3. Wide-column duplication needs a native completion, not only the general repair argument

**Reader outcome at risk:** the engineer can design per-device history and an alert lookup but cannot implement recovery after only one of the two writes succeeds. They may assume a grouped Cassandra write gives the combined isolation and retry behaviour they wanted, or have no durable place from which to rebuild.

**Homes checked:** K04, W03, C05, C06, C16 and C17; KV09, KV12, KV50, KV52, KV62 and KV74. W03 gives the full general source/repair explanation. C05 teaches batch boundaries, C16 teaches indexes, and C17 teaches schema/upgrade compatibility. None explicitly owns executing the two-table write, interrupting it, and demonstrating the chosen reconciliation or rebuild protocol. The K04 row points to W03/C16 and native exercises, but C16's specified native task is index build/query evidence.

**Why owed:** query-shaped duplication is central to the selected wide-column design, and the branch's running material explicitly has a device ledger and an alert lookup. Knowing that batches are not a general isolated transaction leaves the main application design unfinished.

**Smallest repair:** attach a native Cassandra two-table failure-and-repair worksheet to W03, with the product-specific statements and results clearly labelled, or assign it explicitly as a practical section of C05. Keep K04 as the transferable source/race/completion argument. Specify which table or retained input is authoritative, how a repeated operation is identified, what verifies completeness, and how the view is rebuilt after its available catch-up history ends. No new explanatory article is required.

#### R4. Resolve the Redis ownership seam before promises become reader routes

**Reader outcome at risk:** a reader choosing Redis for authoritative state follows a caching entrance that permits discard, or loses persistence, failed promotion or historical recovery when duplicate pages are removed during coordination.

**Homes checked:** the keyed proposal's opening, R01–R09, ownership notes and authoritative Redis journey. The proposal itself correctly identifies provisional overlap, rather than claiming it is resolved. I have not read the separate caching derivation for this first review.

**Why owed:** the authoritative contract depends on R02/R03/R05/R06/R07/R08 together. Moving their homes is harmless; changing their scope into disposable-cache lessons is not. R04 is a different two-system coherence problem and should remain clearly optional for this path.

**Smallest repair:** make one ownership decision with the caching derivation and preserve two named reader journeys into the same native machinery. Record each full mechanism home and the local reminder at the other entrance. Require an authoritative-state acceptance case after the consolidation: accepted work survives only within the stated failure budget, expired authority does not regain validity after restore, and ambiguous retries do not repeat the action. Do not commission a second Redis product series.

#### R5. The Redis operating page has a larger burden than its rationale admits

**Reader outcome at risk:** a user arriving to diagnose latency must wade through setup and upgrade material, while a user changing versions receives only a checklist because diagnosis took the available room.

**Home checked:** R09, “Diagnosing and changing a running service”, KV26 and KV28. The plan promises three incident packets, a permissions exercise, TLS/credentials/exposure and release-specific upgrades. These are several practical outcomes. They do not share one changed case: slow clients, excessive privilege and broken discovery require different evidence and recovery actions.

**Why owed:** both diagnosis and safe operation are part of the selected Redis promise; neither can be reduced to a named checklist merely to preserve one page. This is also a direct incident entrance, so its navigation cost matters.

**Smallest repair:** move the baseline access setup into the reusable native environment attached to the branch entrance, with a direct access-test link. Keep R09's default route diagnostic. Draw the actual upgrade/discovery failure sequence and give it a named maintenance section or attached procedure with independent entry and acceptance. Split that maintenance task only if its mechanism and failure sequence displace diagnosis. This is a commissioning test, not a demand for another article now.

#### R6. Cassandra's multi-datacentre promise needs an execution or a narrower outcome

**Reader outcome at risk:** the reader treats a configuration/history model as evidence that their routing, degraded service and return-to-service procedure work. Client discovery and actual stale state can make that conclusion wrong even when the model is sound.

**Home checked:** C13, C10, C12 and the C01 lab; KV70. C13 promises defining degraded operation and return after a regional failure, but its native lab is optional. The authoring form for KV70 includes routing and failover/cutback procedure. The rest of the branch strongly distinguishes models from native operating evidence.

**Why owed:** “Owning Cassandra in production” includes multi-datacentre operation in the stated branch. A family-level selection lesson could stop at a documented history model; an operating promise needs a reader-accessible path to verify the actual client and topology.

**Smallest repair:** specify a bounded native two-datacentre routing/isolation/return exercise in the reusable environment, separating its modest local topology proof from real inter-region latency or scale claims. If that environment is infeasible, label C13 as design/assessment and explicitly defer verified multi-datacentre operation. A resource-heavy real cloud deployment is not inherently required.

### Boundaries to challenge during briefs, without adding pages by default

**RL94, durable work:** keeping outbox and database-backed jobs together can save the shared request-identity and worker-crash setup. Preserve that choice provisionally. The stale worker case must finish at the authority that rejects its effect; an explanation of lease expiry alone does not finish it. If the outbox's duplicate effect and the job's stale owner require different long investigations, split only after drawing both. A full scheduler remains outside scope.

**RL128, cluster operation and security:** node identity does belong beside secure joining. The small native access test can stay there. SQL privileges and rotation must nevertheless have a usable direct entrance and a tested denied action. They should not consume the space needed for relocation, quorum diagnosis and capacity. Unlike R09, native identity is causally involved in the operating task here; equal page treatment would be a mistake.

**DC61 and DC75:** DC61 reads as a production-admission contract across recovery, diagnosis, access and version change. Keep it as that explicitly bounded entrance, with links to the actual proof in DC73–DC75, rather than implying it fully teaches general database operation. DC75 can keep a small access test and a supported rolling procedure together if it remains usable. Its maintenance worksheet must include the stated lagging-member stop condition and feature-compatibility/rollback boundary; an external procedure link alone must not discharge those locally promised outcomes. These are brief acceptance conditions rather than grounds for an immediate split.

**DC62:** the proposed local update path connects BSON, pages, cache, history, journal and checkpoint coherently. It is deep, but I would retain the page instead of splitting memory and disk simply because there are many terms. The newcomer needs the complete path to distinguish local restart from replicated survival. The brief should limit each mechanism to the decisions actually named and resist a WiredTiger implementation tour.

**DC55:** selected documents, intermediate cardinality and pagination can use one small fixture, although they change the reader's model several times. Retain the boundary until its worked sequence exists. Give direct page/export entry to the final section and do not make index knowledge a prerequisite. The plan already owns the essential statement that a cursor does not freeze changing data. I do not find a missing full relational-style export curriculum in this document scope.

**C14/C15:** I would try a combined “Backup and restore” article at brief stage because the inventory's sufficiency is proved by restoration. A separately navigable restore section can still serve an incident reader. However, this is a real boundary disagreement, not a demonstrated omission: C14 has substantial file-set, supported archival and application-consistency work, while C15 has timestamp conflict and useful-state reconciliation. Retain two if the drawn explanations show that either would bury the other's investigation. Do not merge by deleting reconciliation or by claiming a successful file copy proves recovery.

**RL125:** retain follower/current-read direct entry provisionally. Reporting and current-invariant readers need not enter through write-coordination internals. The proposal's condition for merging with RL124 is sound. I do not recommend cutting this merely because its single native task may be shorter than the transaction task.

### Transfer, entrances and scope limits

The strongest transferable teaching is a concrete operation followed by a changed condition: result grain, an invariant crossing a boundary, a replica holding unapplied state, a backfill racing a new writer, a retained deletion marker. The plans generally distinguish that reasoning from product-specific commands and settings. Keep comparison cases consequential: InnoDB's clustered/undo path, Couchbase index visibility and Bigtable cell/GC semantics change a prediction. They should not become miniature product courses.

There is repeated full-looking general teaching across these three independent derivations: unknown outcomes (RL93/DC57/K03), maintained copies (RL99/DC58/K04), live backfill completion (RL100/DC59/K04), and useful restore acceptance (RL96/DC61 and native recovery pages). Local application is needed in every family and is not waste. At integration, give each transferable proof one definite full home and state what each family still owns. In particular, a link into a planned or unavailable collection cannot replace the local minimum needed to make the current decision. This first review cannot settle cross-field ownership because it deliberately has not read the coordinator's integration work.

Entrances are strong for selectors, wrong answers, slow queries and incidents. PostgreSQL and MongoDB still need explicit reusable execution resources tied to an accessible early native page: how to create the fixture, open independent clients, know which role is active and reset. This is an implementation requirement already implicit in their exercise promises, not a reason for a setup article or a further explanatory destination. Cassandra names that resource clearly; borrow that clarity without copying the shape of its cluster curriculum.

The chosen alternatives are honestly bounded. I would not require full MySQL, SQLite, Firestore, Couchbase, Bigtable or Valkey branches to make these initial paths legitimate. CockroachDB's multi-node feasibility gate is material: resolve it before commissioning native distributed lessons. Until then it is an unresolved representative-product choice, not an established runnable reader path. None of this calls for reviving the parked distributed-systems programme.

## Integration overlay

Not yet supplied. The first account and first proposal findings above must remain intact when later integration decisions are reviewed.

### Bounded recheck of the final allocation

18 October 2026. After recording the first findings, I read the revised relational,
document, keyed/wide-column and caching allocations, including their coordination
notes, and checked FD04–FD06 and the field ownership table where shared homes moved.
The first account and findings above remain unchanged. This recheck assesses the
actual allocations, not just the coordinator's description of their repairs.

**Judgement:** the substantive ability-chain repairs are present. The maps are ready
for user discussion after the small route and ownership contradictions below are
reconciled. They still do not establish executed lessons or article readiness.
CockroachDB's multi-node environment and the selected Redis/Valkey implementation
remain explicit decisions before native article commissioning.

**R1 is repaired in the relational coordination note.** RL90/RL91/RL93 now explicitly
own PostgreSQL reservation, absent-row/deadlock and unknown-commit execution. The
required statements, connection/role, error branch, stable request identity and
final state make this more than an implementation label. RL110 owns the reusable
fixture and independent clients. These requirements should be carried into each
brief; there is no need for a new PostgreSQL concurrency article.

**R2 is repaired in the actual page allocations.** RL130 owns live schema-job
progress and interruption; RL131 owns mixed binaries, supported staged upgrade,
interruption and finalisation; RL132 owns SQL/application compatibility, retry
changes and migration acceptance. Each has a different native failure and decision.
FD05 owns the general authority-cutover proof. The three outcomes now earn their
boundaries without leaning on the vague claim that all change is coexistence.

**R3 is repaired in the keyed map's final native completion.** W03 owns an actual
Cassandra two-table failure, stable event identity, identity/version audit and
rebuild after catch-up history expires. The device ledger is authoritative, and
the alert lookup is a view. C05's batch semantics and C16's indexing cannot replace
that worksheet. This preserves the full application consequence without adding an
explanatory page.

**R4 is substantively repaired.** The keyed map names one Redis implementation
branch in caching, reconciles the original units, and provides an authoritative
entrance that includes acceptance/loss reasoning, native operations, persistence,
failover or Cluster, and operation. CA-A13 now requires the important failure in
which the effect exists while its operation-ID evidence is absent. The resulting
route preserves the accepted-state promise rather than silently turning it into
disposable-cache teaching. The remaining inconsistent pointers are listed below.

**R5 is repaired as a bounded commissioning requirement.** CA-A17's default entrance
is diagnosis. CA-A11 owns the independently linked starting/access setup;
CA-A17 keeps a separately reachable native maintenance procedure with discovery,
interruption, acceptance and rollback/restore gates. That is a credible way to
retain one integrated page. The eventual written route must show that maintenance
does not bury the incident entrance; this map cannot prove that reading cost yet.

**R6 is repaired by an explicit requirement.** C13 must execute bounded native
two-datacentre routing, isolation and return in C01's environment, inspect actual
driver routes and returned/repaired state, and narrow its operating promise if
the environment cannot be supplied. The optional resource-heavy regional lab in
the original row can coexist with this mandatory local-topology test, but the
row should state that distinction directly.

**The other brief boundaries are preserved usefully.** RL94 must reach the authority
that rejects a stale worker. RL128 retains native node trust and denied-action
checks without absorbing cluster upgrades. DC62 now owns the reusable MongoDB
fixture, and DC75's maintenance worksheet must demonstrate its lagging-member stop
and feature/rollback gates. DC61 is explicitly a production-admission entrance.
My provisional preference to try a combined C14/C15 remains a boundary disagreement,
not an unresolved ability gap; their separate recoverable-history and useful-restore
investigations remain defensible.

### Remaining contradictions in the revised maps

1. **The relational change journey has not caught up with RL131/RL132.** Under
   “Paths and entrances”, “Live change” still directs work on installed versions
   or write authority to FD05/RL122. RL122 is PostgreSQL work. A CockroachDB
   operator following that entrance will miss the newly repaired native upgrade
   page. The distribution route also ends the native range at RL130. Smallest
   repair: route PostgreSQL upgrades/migration to RL122, CockroachDB cluster
   upgrades to RL131, and SQL application migration to RL132 with FD05's shared
   proof. Include those destinations where the implementation branch is listed.

2. **KV20 has two contradictory Redis homes.** The keyed “Unit coverage audit”
   still groups KV15/KV19/KV20 under CA-A13. Its final coordination correctly
   places the paused-owner boundary at CA-A06, while CA-A13 is native atomic
   work. Smallest repair: separate KV20 in the audit and use CA-A06 consistently.
   Preserve the short lesson that an expired lease cannot by itself prevent an
   old owner changing an external resource; no generic locking programme is owed.

3. **The keyed Redis journey and ownership prose retain superseded wording.**
   The earlier “Using Redis as authoritative structured state” path repeats
   CA-A13 and CA-A11 and omits the clearly structured CA-A05/CA-A06 → CA-A07
   beginning of the final authoritative entrance. Earlier paragraphs and audit
   rows still call the one chosen branch provisional or say reconciliation is
   future work. The final coordination note supersedes them, so this is not
   another missing branch. Smallest repair: replace the earlier journey with the
   final entrance and state the resolved shared ownership consistently. A later
   writer should not need to decide which of two route descriptions is current.

4. **Some ownership and execution rows still rely on appended qualifications.**
   DC58's first “Owns” line still includes all DC22 even though its coordinated
   scope and audit correctly give the generic protocol to FD04. C13's main row
   calls the real lab optional while the final note requires the bounded native
   test. These are repaired obligations in the full maps, not grounds to reject
   their depth. Smallest repair: amend those row-level descriptions to say local
   application of DC22 and mandatory local two-DC test with optional regional
   measurements, respectively. Commissioning often copies one row, so the local
   wording should carry the same promise as the final coordination.

FD04's copy protocol, FD05's authority transfer and FD06's workload evaluation are
coherent shared homes. Family-specific facts, array semantics, native stream
positions and actual migration acceptance remain in their respective branches.
This removes full duplicate derivations without asking a direct incident reader
to chase a shared prerequisite before seeing the local problem. The maps must
continue supplying those small local premises when the articles are commissioned.
