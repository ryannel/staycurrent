# Field-wide abilities, before allocating shared pages

18 October 2026. Coordinator's derivation. The coordinator knows the previous
proposal; the collection practitioners are working without its outlines or
inventories. This record concerns the joins between collections. It does not
reserve mechanisms or a fixed number of shared pages ahead of those derivations.

## Audience and outcome

An engineer can describe the application's storage needs, choose a small set of
credible designs, evaluate their promises and cost, and keep ownership of data
while adding, replacing or removing stores. A newcomer also needs an entrance
that says what these systems are before asking them to choose one.

## From abilities to teachable units

| Task | Required understanding, down to units | Form needed | Awkward case that the understanding must resolve |
| --- | --- | --- | --- |
| Recognise the kind of problem | Records/relationships, bytes/file operations, exact retrieval, ranked discovery, paths, histories and summaries; the difference between representation, layout, deployment and application role | Short examples of requested input and actual output, followed by an orientation | One product spans several categories; a family label cannot establish its guarantees or suitability. |
| State needs precisely | Access shapes; invariant; atomic scope; key and query distribution; size/growth/retention; work per operation; read/write mix; concurrency; latency distribution and acceptable overload; freshness, loss and recovery target; location, access and operator constraints | Worked workload briefs and simple calculations with units | A few hot tenants dominate the tail; average request size and a throughput total hide the actual bottleneck. |
| Interpret a contract | Successful request versus known state; durability versus visibility; one-record versus multi-record change; ordinary versus conditional read/write; replicas and failure domain; freshness/causal needs; missing reply and identity for retry | One record across two callers and a failed response; contrast actual observable histories | A retry duplicates a valid change, or a successful replicated write does not survive the failure the application assumed it did. |
| Decide whether another store is worth adding | Existing-engine baseline; query/operating demands it cannot meet; data ownership; derived versus authoritative copy; write/read paths; freshness; people, cost and failure responsibilities | Contrasting design decisions for the same workload | The added index is cheap to query but expensive to keep correct and rebuild. |
| Keep a derived copy repairable | Stable source identity/revision; initial snapshot and stream position; copy/live overlap; order and duplicate handling; deletes; capture retention; checkpoints, reconciliation and reproducible rebuild; change of schema or representation | Trace an old update arriving after a new one, a missed delete and an interrupted backfill | A target is almost complete by count but permanently lacks a revised record; capture retention expires before catch-up. |
| Replace a storage design | Compatibility of IDs/types/ordering/permissions; snapshot/catch-up; result validation; authority cutover; application-version compatibility; rollback window; divergence after new writes; retirement and deletion | An actual sequence of migration states with acceptance checks | Switching reads back after new writes is not rollback unless those writes can be reconciled. |
| Evaluate the full design | Representative data/skew and queries; actual correctness/quality baseline; load generation; warm/cold and sustained conditions; error/latency distributions; overload/maintenance/recovery; cost at the full boundary; reproducibility and decision uncertainty | Two contrasting evaluation records, including misleading measurements | An isolated fast query produces worse end-to-end service under ingestion or recovery. |
| Protect and retire data across systems | Ownership and privilege; tenant boundary; sensitive derived content; encryption/key recovery; audit; retention; deletion propagation; old copies/backups and restored state | Track one person's data and authority through live, derived and recovered copies | A deletion is undone by a restore or an obsolete search result reveals protected content. |

## Page boundaries still to derive

Orientation must remain a useful entrance without a prerequisite course. A
workload brief and an evaluation answer different moments in an engineer's work.
Contract vocabulary needs enough concrete behaviour to support reading product
documentation; it must not become the parked distributed-systems programme.

Copying a representation and switching authority are related but different
investigations. Whether they need separate pages depends on the concrete worked
explanations and what the collection plans already own. Cross-store lifecycle
policy needs one home, while each interface must teach how it is enforced.

Mechanisms such as sorted indexes, write-ahead logging, compaction and snapshots
will be assigned only after the independent collection derivations identify what
they need. The coordinator must not remove a collection's necessary explanation
by pointing at an unwritten generic destination. Each direct entrant needs enough
local context to follow its own mechanism.

## Explicit limits

Do not derive a vendor directory, a universal ranking, a pricing reference, legal
compliance instruction or an engine-implementation curriculum. Teach necessary
database distribution mechanisms without activating the parked shared programme.
Broker internals, instrumentation, model training and generation remain in their
respective planned fields. Specialist spatial, scientific-array and semantic-web
depth needs a stated scope decision rather than an unexamined exclusion.
