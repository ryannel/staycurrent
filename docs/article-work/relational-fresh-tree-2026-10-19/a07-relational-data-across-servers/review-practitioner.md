# Practitioner breakdown review

Status: **pass after recheck**. Both required clarifications below are resolved.

Reviewed `breakdown.yaml` against `context.yaml` and `../commission.md` using the practitioner perspective in `staycurrent-review`. No previous relational articles or plans were used. This is a review of the planned article and its immediate child stubs, not their future expanded breakdowns.

## Initial required repairs

1. **Make safe replica-membership changes explicit in “Coordinating distributed SQL”.** The stub names placement, rebalancing, quorum intersection and epochs, but does not explicitly require the correctness of adding, removing or replacing voting replicas. Add a bounded treatment of catching up a new replica before it counts towards the required voting set, preserving quorum safety across the old and new configurations, and checking the promised failure-domain availability during the transition. Require one interrupted membership-change history in the child's planned evidence. This belongs alongside placement and rebalancing; it needs neither a separate article nor a general consensus proof. An engine can have correct steady-state quorums and still lose its advertised availability during a replica move. Cockroach Labs' [joint-consensus explanation](https://www.cockroachlabs.com/blog/joint-consensus-raft/) demonstrates precisely that distinction, including a transient configuration that cannot survive the same regional failure as its initial and final configurations. The repair should describe the selected implementation's supported mechanism rather than prescribe one universal sequence.

2. **Scope authority to the ownership unit in “Test the promise, including the uncomfortable interval”.** Replace the unqualified acceptance check “one valid authority” with a requirement to identify the valid authority or coordinated writer set for each relevant shard/range/key and ownership epoch. A sharded system legitimately has several independent writers, and the proposed child explicitly includes coordinated and conflict-resolving multi-writer alternatives. The test must reject conflicting ownership or a violated write contract, rather than multiple writable servers as such. Retain “a sole writable authority” in the single-writer child, where that requirement is correctly scoped. The mechanism-level distinction is supported by the same [Cockroach Labs explanation](https://www.cockroachlabs.com/blog/joint-consensus-raft/), which describes independent consensus groups for different ranges.

## Coverage and depth otherwise pass

The parent establishes a useful decision contract before describing mechanisms. The three child boundaries provide working depth for replication and failover, application-managed ownership and movement, and integrated distribution. Together they cover the commissioned log positions, acknowledgement and visibility contracts, read routing, fencing, placement, hotspots, cross-shard invariants, query fan-out, commit decisions, regional latency, migration and failure testing.

The distinction between persistence and replay is technically important and correctly demanded here: PostgreSQL's [standby documentation](https://www.postgresql.org/docs/18/warm-standby.html#SYNCHRONOUS-REPLICATION) distinguishes acknowledgement after a remote operating-system write, durable flush and replay. Keep those implementation-dependent promises explicit when the children are expanded.

The boundaries with transactions, application engineering and operations are clear. In particular, the plan retains distribution's authority and routing mechanics while handing retry handling, external effects, delivery compatibility and complete recovery procedures to the appropriate neighbours. No additional child article is required by this practitioner review.

## Recheck

Rechecked the revised `breakdown.yaml` from the same practitioner perspective.

- The distributed SQL child now explicitly requires implementation-supported voting-membership changes, replica catch-up, safety across old and new configurations, transition failure-domain availability and an interrupted membership-change history. This resolves finding 1 without adding an unnecessary article.
- The acceptance worksheet now checks valid authority or a coordinated writer set for each ownership unit and epoch. The single-writer child's sole-authority requirement remains correctly scoped. This resolves finding 2.

No consequential scope or correctness problem was introduced. No required practitioner repairs remain.

### Final consolidation recheck

Verdict: **pass**. Read the final consolidated breakdown and checked that the shortened parent retains a clear owner for each promised practical outcome.

- The architecture comparison still owns target equivalence, constraint and identity preservation, reconciliation evidence, authority handover and rollback judgement. The sharding child now explicitly owns the initial move out of one writer as well as the complete snapshot/change-capture/cutover protocol. The shorter parent removes repetition without losing the commissioned migration coverage.
- The parent completes its acceptance worksheet for the opening failure, and each child explicitly completes the same method for its own relevant histories. Replica lag, promotion, stale routing, interrupted movement, quorum loss, membership changes and commit recovery still have named coverage. The original authority and membership repairs remain intact.
- The replication child's shorter multi-writer warning retains the conflict and constraint boundary and points to the distributed SQL child's substantive coordinated/conflict-resolving comparison. No practitioner depth is lost through this consolidation.

No required practitioner repairs remain after the final editorial changes.
