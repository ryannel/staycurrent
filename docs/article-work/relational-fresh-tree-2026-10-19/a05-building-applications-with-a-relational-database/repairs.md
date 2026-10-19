# Breakdown repair and direct recheck

Assignment: **Building applications with a relational database**. Planning only;
no article, canonical tree, public navigation or publication status was changed.
The plan was developed from this assignment's context and commission, without
consulting the existing relational corpus or old plans.

## Independent reviews and repair

- `practitioner-review.md`: one P2 finding. The bounded-call child needed to own
  pooled session state after successful use as well as after failures. Repaired
  the parent return-to-pool contract and the child brief with session
  initialisation/cleanup, request or tenant context, application versus external
  session/transaction pooling, selected driver/pooler compatibility for stateful
  features, and a real-engine connection-reuse test. The practitioner independently
  rechecked the saved repair and closed the finding.
- `adversarial-review.md`: no actionable findings. The reviewer challenged every
  parent section and child against a concrete cut, merge or fold and the useful
  understanding it would lose. Five children retained; no extra testing or
  database-resident-code article introduced. Final repair recheck recorded there.

## Worker direct recheck

The saved YAML parses with exactly the top-level topic, title, brief and heading
keys. It contains eight parent headings and five child stubs. Every child has
only topic, title and brief; no child has headings or expanded descendants.

The parent establishes an order-reservation contract before introducing resource,
replay, delivery, release and transfer protocols. Its final acceptance matrix
checks the whole product promise rather than introducing a separate testing
syllabus. Each child remains linked to a distinct completion condition: bounded
resource use; safe replay or reconciliation; external delivery; version
compatibility; or external-source acceptance. The database-resident placement
section keeps invocation, privileges, deployment and testing together without
repeating SQL semantics or integrity design.

Direct coverage check against the assignment: drivers, parameter binding and
mapping; transaction and connection lifetimes; pools, deadlines, cancellation and
overload; query and result budgets and generated SQL inspection; retries,
idempotency and ambiguous outcomes; durable work, outbox/inbox, change capture,
caches and read models; compatible migrations, concurrent backfills, release and
rollback; real-engine tests; database-resident behaviour; and staging, validation,
restartability and reconciliation for bulk movement are explicitly owned.
Schema backfills remain with compatible delivery, source-to-target acceptance
with bulk movement, concurrency correctness with the transaction neighbour,
engine diagnosis with execution, operational policy with operations and
replication mechanisms with distribution.

Primary-source spot checks support the plan's consequential boundary cautions:
[PostgreSQL message flow](https://www.postgresql.org/docs/current/protocol-flow.html)
describes cancellation as a request rather than proof of command failure;
[Debezium's outbox router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
provides event identifiers and keys for deduplication and ordering; and its
[PostgreSQL connector](https://debezium.io/documentation/reference/stable/connectors/postgresql.html)
documents snapshot, position and schema information that clients must account for.
The practitioner checked session state and pooler configuration separately.
These sources ground planned distinctions, not a claim that the unwritten
examples have executed.

No site build or rendered-figure check is applicable to this YAML-only planning
change. No unresolved findings remain.
