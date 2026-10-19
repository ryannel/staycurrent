# b15 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
Full initial a38 review against the original relational-practice goal, actual a07
parent and a39 sibling, supplied neighbour plans and relevant existing
transaction/application/live-change/constraint/performance boundaries. Read the
complete snapshot, renderer, models, verifier, native harness, source ledger and
authoritative `native-evidence-2.json`. No other perspective's report,
teaching-reference articles or old relational corpus was read.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a38 | Repair, narrow model state alignment | a38-P1 | None |

## Required repair

### a38-P1 — Keep promotion result/outcome text at the displayed boundary

Location: `src/components/relational-next/a38/model.mjs`, promotion branch,
particularly the result ternary and line 33 outcome condition. Confirmed in the
immutable 4438 browser, not only inferred from source.

- **Enforced exclusion, step 3/6, Exclude old writer:** A's card says stopped,
  restart prevented and exclusion confirmed; narration says A has been stopped
  and restart prevented. The prominent result still says exclusion is required.
  Distinguish the earlier unmet gate from this now-passed gate, with promotion
  still pending.
- **Still accepts writes, step 5/6, Refresh route:** A's card contains accepted
  104; B's card contains only 101 and 103. Narration describes the old connection
  writing 104. The outcome already claims B has 105, although B accepts it only
  at the next Prove the result step. Keep that specific accepted order out of the
  current outcome until its acceptance is displayed, or change all affected
  panels consistently if intentionally moving that operation earlier.

This is a small correctness repair to the central authority timeline. The
required distinctions are whether exclusion is established and which writes
have actually been accepted at the current boundary. Add direct assertions for
both intermediate states, since the present verifier checks only final promotion
outcomes. No prose, SQL or native-harness change is required. Retain the native
pass below; a narrow source/rendered model recheck is sufficient.

## Technical and practical assessment otherwise passes

Acknowledgement is correctly separated into local flush, remote OS write, remote
flush and replay, with participants made explicit. Empty synchronous membership
and deliberate local acknowledgement are qualified. A synchronous timeout or
broken client connection does not prove local rollback. Flush alone does not
establish standby visibility, and replay does not freshen an old snapshot or a
different replica. These boundaries agree with PostgreSQL's
[WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT).

Physical versus logical copying, omissions and promotion eligibility are
accurately qualified. Retention caps apply at checkpoints; position distance is
not allocated WAL size. Backlog stages, idle elapsed lag, catch-up feasibility,
reinitialisation and standby feedback trade-offs support useful operating
judgement without duplicating query diagnosis. Checked the
[replication settings](https://www.postgresql.org/docs/18/runtime-config-replication.html),
[logical restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html)
and [hot standby](https://www.postgresql.org/docs/18/hot-standby.html) contracts.

The promotion prose has the correct gates: recoverable required history,
exclusion across writer paths, promotion, new connections and application-level
validation. A failed health check is not fencing. Planned and unplanned changes
have different available evidence. The local controlled stop is not advertised
as a production restart-proof fence. Returning history is preserved until a
supported rejoin/replacement choice; rewind's prerequisites and discarded branch
changes are explicit. PostgreSQL's [failover](https://www.postgresql.org/docs/18/warm-standby-failover.html)
and [rewind](https://www.postgresql.org/docs/18/app-pgrewind.html) documentation
support those boundaries. The independent rehearsal confirms the actual selected
replacement path rather than claiming a rewind.

Local partitioning preserves one authority. Half-open dates, missing/late
coverage, row movement, mutable composite references and global identity are
handled explicitly. The admitted duplicate ID proves why (day,id) does not
preserve globally unique id. Attach/detach gates cover data, dependencies,
continuing writes, retained access and lifecycle ownership. A tiny pruned plan
is explicitly insufficient to justify adoption: retaining the ordinary table is
a useful conclusion. This agrees with PostgreSQL's
[partition contract](https://www.postgresql.org/docs/18/ddl-partitioning.html).

The tenant owner model separates local work, unkeyed reports and cross-owner
transactions. Per-shard uniqueness is not global uniqueness; independent
connections are not an atomic transaction or shared snapshot. Hot tenants,
shared stock, cutover authority, new accepted history and coordinated recovery
are treated as costs of the placement decision. The article does not turn this
into consensus or resharding specialism.

The exact RDS Multi-AZ **DB instance** comparison correctly excludes standby read
traffic and distinguishes DB clusters/read replicas. Its endpoint/session
boundary matches the [deployment](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html)
and [reboot/failover](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RebootInstance.html)
documentation. CockroachDB v25.4's documented
[isolation choices](https://www.cockroachlabs.com/docs/v25.4/architecture/transaction-layer)
and [survival/locality distinction](https://www.cockroachlabs.com/docs/v25.4/multiregion-overview)
are accurately limited to a service comparison, with no cloud execution claimed.

The actual parent supplies a useful topology and incident first case. a38 adds
procedural gates and bounded proof; a39 retains restoration, a04/application
children retain reconciliation and connections, live-change owners retain DDL
and movement execution, and monitoring/performance retain budgets/diagnosis.
No scope repair or new child is needed.

## Independent native and working-model checks

After inspecting the complete harness, ran it against fresh own PostgreSQL 18.6
clusters using its self-contained temporary directories and unused local ports.
It made no connection to shared 57319. Reviewer output:
`/private/tmp/rel3-prac-a38-evidence-1792452101.json`.
All eight named result records and 78 tool commands completed with the expected
controlled failures; the harness cleaned all four clusters and removed its own
root, independently confirmed absent afterwards.

Observed remote flush 0/3007200 with replay still 0/3000000: A held 101/103 while
B held 101. remote_apply waited at SyncRep and completed after replay resumed.
Disconnected B lacked local-acknowledged 105 while synchronous 106 waited;
reconnection released that wait and caught up through the final boundary.
The slot distance was 168 bytes, reserved, without exhaustion claims.

A was stopped and status checked before B's promotion. B retained
101/103/104/105/106 and accepted 107; the old endpoint refused a connection.
Fresh replacement A replayed new 109, reported recovery and rejected an insert.
The independent asynchronous-loss pair lost acknowledged 201 after promotion,
correctly failing the zero-loss requirement. Own local transition observations
were 0.303 seconds for stop-to-new-write and 0.261 seconds for start-to-promotion;
these are not production availability measurements.

Native partition checks reproduced missing September/December rejection,
UNIQUE(id) rejection, accepted duplicate ID on separate dates, October-to-November
movement, November-only plan, checked December attachment, continuing rows and
one separately retained detached October row. No geography, provider failover,
logical replication, pg_rewind or distributed transaction was executed.

The owned verifier passes all 73 model states across twelve choices and its
native-evidence assertions. In an own Chrome tab on fixed 4438, exercised every
choice to its final state and compared the flush/replay boundary at the same
step. Choices preserve position. Also inspected the two intermediate promotion
states in a38-P1. Partition and owner outcomes otherwise agree with their stated
models and native/prose boundaries. The native and model order IDs are kept as
separate illustrative sequences rather than asserted as one execution trace.

## Handoff

The snapshot equals its rendered source and all four manifest hashes remain
unchanged. No article/component edits, shared build, Git action, retained-output
overwrite or shared-server change was made. No download UI was used; root owns
the recorded byte check. The own tab is closed and preview 4438 is released.
Retain all unaffected checks after the narrow a38-P1 repair.
