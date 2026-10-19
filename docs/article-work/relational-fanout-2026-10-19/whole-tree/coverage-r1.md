# Whole-tree review: completeness and depth, round 1

**Perspective:** fresh independent relational practitioner, checking completeness and depth.

**Inputs:** the original `commission.md`, the round-1 manifest and the complete round-1 `tree.yaml`. No previous planning run, existing relational article or other review report was used. This is a review of the planned decisions, explanations and procedures; it does not establish the correctness or teaching quality of unwritten articles. No plans were changed.

**Verdict: repair one bounded coverage gap, then recheck.** The 39 active articles otherwise form a complete route to the commissioned relational-practitioner goal. The repair belongs within existing articles; it does not justify another partitioning article or a wider distributed-systems curriculum.

## Required repair

### R1 — Give local table partitioning a complete decision and lifecycle owner

**Locations:** a24, “Partitioning helps only when it removes relevant work”; a38, “Recognise when distributing ownership changes the problem”; the supporting a29 schema-change procedure and a06 “Retire old data and prove the change is finished”.

**Gap:** a24 supplies the useful physical model and a measurable pruning experiment, but explicitly sends “partition-key design rules” and “lifecycle procedures” to existing owners. a38 distinguishes local partitions from distributed ownership, then develops keys, movement and recovery for the latter. a29 inventories partitions when planning DDL; a06 covers bounded deletion and retirement generally. None currently owns the practical local-partition design and operating decision that a24 relies on.

The reader can consequently explain why a time-bounded query might touch fewer pages, yet has no assigned account of whether the proposed local layout preserves the schema's required keys and references, accepts the intended future writes, and can be maintained and retired safely. That is a relational design and operating obligation created by this tree's own proposed intervention, rather than a request for specialist partitioning depth.

**Repair:** give a38 a bounded local-partition decision before it moves to distributed ownership, or explicitly place the same material in an existing suitable heading elsewhere. Work one time-retained table through:

- Choosing the key and boundaries from both access and lifecycle requirements, including skew and work that spans partitions.
- Checking the selected engine's actual uniqueness, reference and index arrangements against the existing schema invariants; distinguish the intended logical rule from the objects the engine can enforce.
- Deciding what happens to future, late and corrected rows when a required partition is absent or a boundary changes.
- Assigning creation and retirement work, and establishing the continuation and completion gates for one removal or attachment change. Link the physical DDL, resource and recovery procedure to a29/a06 and operations rather than repeat it.
- Ending with an explicit retain-or-reject decision against an ordinary unpartitioned table, including the operating cost.

Update a24's handoff to name that owner. A compact worked decision and its lifecycle handoff are enough; do not add a partitioning catalogue or another child article.

**Recheck criterion:** the tree should let a reader trace the proposed local partitioning intervention from measured benefit through schema compatibility and continuing write coverage to a safe lifecycle procedure, with no unnamed owner.

## Coverage assessment of the rest of the tree

| Articles | Assessment against the original relational-practitioner goal |
| --- | --- |
| a00 | Establishes the model, related facts, correctness boundaries and the route through selection, design, queries, applications, diagnosis and recovery. Its orientation does not claim to replace the procedures beneath it. |
| a01, a09–a12 | Cover row meaning, identity and tenant scope, types and comparison, missing values, declarative enforcement and its limits, dependencies and deliberate redundancy, history, correction and removal. The normalisation and temporal depth is tied to decisions about preserved facts and enforcement, rather than an independent theory or temporal-database curriculum. |
| a02, a13–a17 | Cover ordinary SQL fluency and plausible wrong results: expression semantics, joins and cardinality, aggregate grain, scalar and membership queries, composition, windows, ordering and pagination, and deliberate changes. Fixtures and expected results are specified. Recursion is conditional rather than a prerequisite for ordinary relational practice. |
| a03, a18–a19 | Supply an invariant-based argument for choosing atomic changes, constraints, explicit coordination or serialisable execution. They cover missing/new rows, every writer, visibility after waiting, deadlocks, whole-transaction abort handling, durability and the external-effect boundary. Implementation differences are used to change the protocol or failure obligation. |
| a04, a20–a23 | Cover value and authority boundaries, SQL injection, ORM work, pooling and session state, stream and cancellation ownership, deadlines, confirmed versus unknown outcomes, atomic operation identities and retention, recoverable background work and external reconciliation. This closes the application's part of relational correctness without requiring a general messaging curriculum. |
| a05, a24–a28 | Cover storage and working sets, indexes and their write costs, execution evidence, estimates and statistics, parameter-sensitive plans and concurrent workload diagnosis. The local-partition handoff in R1 is the sole uncovered decision here. Otherwise the mechanisms culminate in interventions, representative comparison and explicit evidence limits. |
| a06, a29–a31 | Cover application/schema compatibility, physical DDL work, staged validation and index construction, runner boundaries, resumable data work with concurrent writers, import/correction distinctions, database moves, exclusive write authority, reconciliation, irreversible stages and retirement. They avoid presenting either migration history or matching row counts as completion evidence. |
| a07, a35–a39 | Cover operating responsibility, access and key boundaries, observability and capacity, upkeep and upgrades, acknowledgement/read/failover contracts, fenced promotion and rejoining, backups, complete recovery history, independent recovery dependencies, isolated restoration, selective repair and incident decisions. Add the bounded local-partition ownership from R1; the rest serves operating and recovering a relational service at the required depth. |
| a08, a32, a34 | Cover relational suitability, embedded/server/distributed boundaries, actual application and deployment acceptance gates, full cost, responsibility and exit. SQLite and CockroachDB checks are conditional evaluations. The server candidate is supported by a compact PostgreSQL record and the common articles, which is enough without a separate vendor curriculum. |

## Depth and boundary judgement

The tree consistently preserves the original expertise target. It supplies enough mechanism to explain a choice or diagnose a failure, then assigns concrete evidence, a decision or a procedure. In particular, it does not treat a transaction boundary as a complete concurrency argument, an ORM call as bounded database work, a plan estimate as measured execution, replication as recovery history, or a successful command as restored service.

I found no additional required branch for the commissioned goal. Specialist search, spatial/vector features, a complete stored-programming course, storage-engine internals, consensus theory and neighbouring database families are not missing obligations merely because they could use relational systems. The current conditional comparisons and handoffs suffice unless a worked requirement later depends on them.

**Optional advice:** no further coverage expansion is recommended in this round. Preserve the existing decision and evidence boundaries when writing; the article count alone is not evidence of either adequate depth or excessive specialisation. Reading cost and consolidation remain the other independent review perspective's judgement.

**Delivery:** planning review only. No publication, navigation or article changes are authorised or made by this report.
