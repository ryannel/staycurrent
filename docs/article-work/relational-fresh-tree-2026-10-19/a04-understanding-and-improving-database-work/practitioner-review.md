# Independent practitioner review: breakdown

Reviewed: `breakdown.yaml` against `context.yaml` and `../commission.md`.
Perspective: correctness, mechanism depth, coverage and practical judgement for relational execution, storage and performance.
Decision: pass at this breakdown stage. No required repairs. No unresolved findings.

This is a review of one article and its child stubs, not approval of the later child breakdowns or written articles. I did not consult the existing relational articles, coverage maps or previous plans. Repository README and site direction were read for repository scope and publication boundaries only.

## Decisions by location

- **Article brief; “Start with the work the user is waiting for”; “Keep the improvement when the workload changes”: no finding.** The three examples span transactional reads, contention during writes and analytical interference. Workload mix, observation windows, latency distribution, throughput, failures and correctness make the success criterion operationally meaningful. The proposed stopping condition recognises that tuning cannot remove every architectural or workload limit.
- **“Follow a statement from arrival to completion”: no finding.** Queueing, server work, result transfer, commit acknowledgement and deferred work are distinguished. The application boundary is explicit. This supports diagnosing a slow request without assuming a cheap plan implies a healthy request or workload.
- **“Rows, memory and durable writes” and its storage child: no finding.** The child has sufficient scope for pages, layouts, buffers, versions, logging, checkpoints and crash recovery, and ties physical work to write amplification, reclamation and long transactions. Named implementations and redo/undo responsibilities prevent the illustrative storage model becoming a universal engine claim. Backup and service recovery procedures remain with operations.
- **“Find fewer rows without making every write too expensive” and its indexes child: no finding.** The proposed judgement includes selectivity, table fetches, locality, visibility, covering data, key order, ordering and write costs. Alternative access methods are demand-led. Build/removal and concurrent resource or locking effects are included without absorbing operational procedures.
- **“Turn a query into an executable flow of data” and its planning/execution child: no finding.** Estimates, actual rows and loops, statistics, skew, correlated values, parameters and plan caching support a useful account of plan choice. Join mechanisms, aggregation, external sort, materialisation, pipelining, vectorised/column-oriented execution and parallel work provide the intended execution depth. The warning against summing overlapping timings is appropriate.
- **“Diagnose a workload before choosing a fix” and its investigation child: no finding.** The method joins statement evidence with waits and resource evidence, includes frequent queries and outliers, and distinguishes unchanged plans from changed workload conditions. Warm/cold state, offered load, concurrency, repeated-run variation, instrumentation and failures make the benchmark brief credible. Execution-measuring plan tools are explicitly treated as potentially executing changes.
- **“Organise growing data around the work it must support” and its partitioning child: no finding.** Partitioning is justified by pruning and lifecycle/maintenance benefits rather than presumed query speed. Key choice, non-prunable queries, index/statistics effects, constraints, hot partitions, partition counts, validation and locking are covered. The comparison with an ordinary indexed table gives the choice a useful counterfactual. Local organisation remains separate from sharding.
- **Ownership across all child briefs: no finding.** Mechanism ownership is clear enough to permit depth without replanning SQL semantics, transaction correctness, migration protocols, operational objectives or multi-server coordination. The five children are plausible areas for independent expansion; this review does not establish that each must remain a single final article.

## Depth points to preserve during expansion

These are implementation details already encompassed by the briefs, not missing coverage or required additions to this breakdown:

- In the planning/execution child, make memory multiplicity concrete: concurrent operations and parallel workers can make a nominal per-operation allowance a much larger workload demand. Explain the trade-off between avoiding spills and increasing concurrency pressure. PostgreSQL's [resource-consumption documentation](https://www.postgresql.org/docs/current/runtime-config-resource.html) provides a named implementation, not a universal budgeting rule.
- In the indexes child, retain the distinction between an index containing all requested values and the engine actually avoiding table access. PostgreSQL's [index-only scan documentation](https://www.postgresql.org/docs/current/indexes-index-only-scans.html) ties that result to visibility information.
- In the planning/execution child, keep costs, node observations and application elapsed time separate. PostgreSQL's [EXPLAIN guidance](https://www.postgresql.org/docs/current/using-explain.html) supports the intended distinction and the execution effects of analysis tools.
- In the partitioning child, show constraints and pruning as named implementation behaviour. PostgreSQL's [partitioning documentation](https://www.postgresql.org/docs/current/ddl-partitioning.html) provides concrete limits and overheads; the current stub correctly leaves room for other engines.

## Unresolved findings

None. No repair recheck is needed unless this breakdown changes.

## Recheck of editorial repairs

Reviewed the final saved seven-heading `breakdown.yaml` and `repair-record.md` directly.
Decision: pass. No practitioner regression, required repairs or unresolved findings.

- **Early report-interference investigation:** the moved “Diagnose a workload before choosing a fix” now supplies the necessary useful first diagnosis before the internals sections. It retains competing blocking/resource hypotheses, discriminating evidence, a controlled concurrency intervention and verification against the same offered workload. Accounting for report queueing and completion prevents the checkout improvement from being credited simply by hiding delayed work. The unchanged-plan example still exposes the difference between plan quality and competing load. CPU demand is a coherent discriminator for this chosen case; the investigation child continues to cover storage, memory, temporary work, log pressure and caches for other saturation cases.
- **Verification and stopping judgement:** folding the final heading preserves correctness, resource demand, deferred maintenance, data scale, workload assumptions, repetition, reassessment and the stopping rule in the diagnosis section. No essential safety or success criterion was lost in consolidation.
- **Capacity and workload trade-offs:** the intervention explicitly charges its benefit against queued report work and completion time. The investigation child still owns measured headroom, marginal cost, throughput, latency, capacity, workload isolation and the decision to change admission, application design, hardware or architecture. Removing a repeated capacity comparison from the partitioning summary does not remove the commissioned capability.
- **Sibling mechanism depth:** storage, indexes, execution and investigation retain their first-review scope while clarifying explanation ownership. Execution now makes the operator/worker/query multiplication of memory explicit. Row/column layouts and compression remain with storage, and batching/vectorisation, scan skipping, parallel work, statistics and memory/spills remain with execution. These are reminders and applications across siblings, not gaps requiring extra articles.
- **Partitioning:** pruning in plan evidence and partition key/granularity/lifecycle judgement have separate explicit homes. The partitioning child still includes indexes, statistics, constraints, joins, partition counts, hot partitions, locks and measurements against an ordinary indexed table.

Remaining findings: none. The four expansion depth points above remain guidance for later planning/writing; memory multiplicity is now explicit in the repaired child brief.
