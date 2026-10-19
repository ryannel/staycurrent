# Practitioner review — b00, round 1

Perspective: independent practitioner coverage and depth.

Inputs: the original commission, the round-1 batch manifest and its assigned `a00.yaml`. No other review report or earlier relational coverage map was used. This is a planning review: it assesses the decisions and boundaries promised by the plan, not unwritten explanations or figures.

## a00 — Relational databases

**Verdict: pass. No required repair at this level.**

The root provides a coherent first working model and delegates the depth required by the original relational-practice goal. Its eight contextual branches account for designing data; querying and changing it; correctness under concurrency and failure; application integration; execution and performance; live evolution; operations and recovery; and selecting an engine and deployment. Each branch identifies practical decisions rather than making specialist knowledge an end in itself.

The order-taking example supports the important connections between these responsibilities. The root introduces relationships before joins, SQL meaning before execution cost, concurrency before retry behaviour, and service recovery separately from a single transaction's durability contract. Those are useful dependencies for a newcomer, without requiring the introductory article to teach every mechanism.

The strongest scope choices are explicit: a transaction does not settle all concurrency questions; payment sits outside the local transaction; plans require measured evidence; schema and application deployments form one compatibility problem; and availability does not establish recovery of correct data. These promises support expert judgement across the original commission.

### Coverage conditions to preserve during recursive breakdown

These are checks on the existing promises, not additional articles or required changes to this root:

- **“Making concurrent changes correct” and “Building applications around a relational database”:** preserve a clear division between choosing an invariant-preserving database operation and deciding whether a failed application request may be repeated. The briefs already include uncertain outcomes, retries, idempotency and reconciliation. Their descendants should connect these decisions through a complete failure case rather than each assuming the other branch completes it.
- **“Understanding and improving database performance” and “Running a relational service”:** retain workload-level evidence, contention and headroom alongside individual-query optimisation. This is already promised through representative concurrency, capacity and resource contention. A practitioner must be able to distinguish a query intervention from a workload or service intervention.
- **“Changing a live database” and “Running a relational service”:** keep verification and usable recovery procedures in scope. Reversing a deployment, restoring a service and repairing the logical contents of data solve different problems. The current root establishes those distinctions and leaves room for concrete procedures in the descendants.
- **“Choosing a relational database”:** fulfil the promised implementation knowledge through representative mechanisms and evaluated contracts distributed through the tree. The current plan correctly avoids a preset vendor curriculum; later plans must still give readers enough concrete engine and deployment behaviour to execute a choice and validate it.

No new branch is necessary to meet the commissioned goal. Depth can be assessed meaningfully when these broad contextual stubs acquire their own headings and child boundaries.
