# Practitioner review — b02, round 1

Perspective: independent practitioner coverage and depth under `staycurrent-review`.

Inputs: the original relational-practice commission; the b02 round-1 manifest; the assigned a04 and a05 plans and contexts. No other review report or earlier relational coverage map was read. This is a review of planned scope, decisions and boundaries; neither unwritten prose nor unimplemented demonstrations have been assessed.

## a04 — Building applications around a relational database

**Verdict: pass. No required repair.**

The plan supplies the application competence required by the original commission. It follows ownership and evidence across the driver, connection, transaction, response and external-work boundaries, instead of treating successful SQL as a complete application operation. The progression ties exact values, authority, bounded resource use and failure recovery to one request path.

The parent retains the essential everyday integration work: binding values, preserving type meaning, keeping untrusted input out of SQL structure, checking tenant and action authority, and making generated database work visible. These belong in the relational corpus and do not depend on specialist security or ORM curricula.

Each child stub has a distinct practitioner decision:

- Connection management determines which stateful resource owns the transaction and how it is returned safely, with pool budgets tied to aggregate application demand.
- Query composition determines the actual statements, multiplicity, round trips and memory an apparently simple operation produces.
- Request recovery determines what may still be running, what is safe to repeat and how a logical operation obtains a durable identity and result.
- Background work determines how committed intent becomes an external effect with discoverable unfinished work and an explicit duplicate/reconciliation contract.

The plan uses the transaction branch's guarantees rather than deriving isolation and abort semantics again. It leaves physical query execution to performance and service credentials, monitoring and incident response to operations. Its real-database-and-driver acceptance exercise and explicit model labels provide the right evidence boundary.

**Conditions to preserve during recursive breakdown, not required repairs:** the request-recovery child must retain concurrent idempotency claims, key scope, fingerprint, atomic business change, retained result and expiry as one contract; the external-work child must retain abandoned claims and unknown external outcomes alongside successful delivery. Both are already explicit. Keep CDC depth limited to the publication and recovery obligations of relational applications, as the stub promises.

## a05 — Understanding and improving database performance

**Verdict: pass. No required repair.**

The plan contributes diagnosis and intervention skills to the original relational-practice goal. It begins with work people need completed, establishes representative workload evidence and only then introduces physical explanations and remedies. Its closing acceptance process preserves result correctness and includes write cost, maintenance and end-to-end latency, rather than equating a faster isolated query with an improved service.

The five child stubs have justified boundaries. Physical storage explains working sets, retained versions and measurable layout costs; indexes explain useful access and its write obligations; plans explain observed work and reporting conventions; optimiser decisions explain why a plan was selected and how parameters or data drift can change it; concurrency explains queuing and shared-resource limits. The parent provides the diagnosis sequence connecting them. This is sufficient depth for sound relational interventions without making storage-engine or optimiser implementation a separate expertise target.

Consequential practical distinctions are already planned: estimated versus observed work; result rows versus work performed; cache and row-fetch effects; query-local versus workload effects; inaccurate estimates versus costly physical choices; offered load versus completed throughput; and safe versus effectful plan collection. Selected implementation differences are tied to a diagnosis or changed decision, which is appropriate to the commission.

The interfaces are clear: integration owns application round trips and connection waits; transactions own concurrency guarantees and transaction protocols; evolution owns safely deploying layout and index changes; operations owns provisioning, service monitoring and recovery. Physical partitioning and pruning are bounded by measured execution effects, with distributed partitioning left outside this branch.

**Conditions to preserve during recursive breakdown, not required repairs:** the workload child must continue to distinguish offered load, completed work and queued work; plan examples must retain engine reporting conventions, instrumentation limits and model-versus-capture labels; and every remedy must preserve SQL results before its performance is compared. All three requirements are already present in the plan. No additional engine-internals branch is necessary.

## Batch assessment

Both plans make necessary, distinct contributions to expert relational practice. They connect application demand to database work while keeping correctness, workload diagnosis and service operation responsibilities explicit. There is no coverage gap or scope error requiring repair before the next breakdown level.
