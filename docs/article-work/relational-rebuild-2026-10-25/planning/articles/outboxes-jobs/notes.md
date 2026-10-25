# Outboxes and database-backed jobs — planning notes

Draft outline for coordinator integration; no child or ownership change proposed. The accepted article can own the complete applied protocol without sending the reader to another new page. The parent remains useful for application transaction ownership; request recovery, general locks and native CDC stay with their named neighbours.

## Reference exposure

Read all 19 bounded parts separately with the supplied helper and received every END marker: sequences 1–6, indexes 1–7, storage 1–6. Read the isolated breakdown, write and continuity skills and all six assigned context files. No main-repository or previous article/plan/review material was read.

Studied the finished Sequences figure 4, including its complete committed-job/claim/provider/completion path; Indexes figure 1 at initial and completed states; Storage figure 8 at the after-flush lost-reply outcome. Opened only owned IAB tabs at the assigned reference origin; no visibility presets, theme or viewport changes; all three tabs closed. Initial automatic approval rejected the preview request because it interpreted the workspace/no-servers boundary as forbidding it. One retry after the coordinator clarified the existing read-only authorisation succeeded. No exposure limit remains.

The reference teaching to retain is one concrete case changed one failure at a time, explicit durable state beside participant knowledge, a sufficient working path before its failure cases, and visible counts/state that support the explanation. The writer chooses drawings and paragraph development. Central facts needing visibility are the atomic order/intention boundary, the accepted-but-unrecorded duplicate window, and the old/new claim overlap.

## Scenario extensions agreed centrally

The coordinator approved these extensions and will add them to the shared record:

- Replay creation of order 103 from the supplied pre-purchase state. Commit stable work identity `order-103-ack` with the supplied pending order and two lines. Its meaning is “order received”, with value 29.00. No payment, paid status, new customer contact details or invoice is implied.
- Use Worker A and Worker B with illustrative claim generations 7 and 8. Lease durations and pauses are explanatory choices, not measured execution or recommended defaults.
- The main notification endpoint is hypothetical and explicitly supports deduplication of one work ID with one immutable payload. Acceptance is the demonstrated endpoint effect; email delivery is a separate outcome. Ordinary email has no assumed deduplication contract.
- If external fencing needs a concrete contrast, use a hypothetical acknowledgement PDF store which atomically rejects lower resource-scoped generations after accepting a higher one. This is an optional receiver-contract extension, not a claim about a real storage API. Database claim guards can carry most of the explanation without adding this artefact.

Continuity pass: order 103 remains pending and worth 29.00, with no payment; stock after purchase remains P3 10, P7 0, P9 4. All crash runs are alternative explorations of the same work. A stable work ID never becomes a fresh ID merely because another worker claims it. Resource generation, order version and idempotency identity serve different purposes.

## Primary-source checks

Checked 25 October 2026. These establish documented mechanisms; no database or external service execution was performed.

- [Chris Richardson, Transactional outbox](https://microservices.io/patterns/data/transactional-outbox.html): domain change and message in one transaction, separate relay, duplicate publication after a relay crash, ordering responsibility. Phrase the delivery guarantee with recovery/availability assumptions rather than copying an unconditional eventual-send claim.
- [Chris Richardson, Idempotent Consumer](https://microservices.io/patterns/communication-style/idempotent-consumer.html): processed identity and consumer effect in one database transaction. A consumer's remote call introduces another handover and needs its own protocol.
- [PostgreSQL 18 SELECT, locking clause](https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE): SKIP LOCKED skips contended rows and is suitable for queue consumers, with an inconsistent view; it does not remove table-lock waits. [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS) establishes transaction-end row-lock release. Any concrete claim SQL should be checked by the eventual implementation/evidence owner with two sessions.
- [PostgreSQL 18 date/time functions](https://www.postgresql.org/docs/18/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT): transaction, statement and actual wall-clock time differ. The writer must state the chosen expiry policy; database wall-clock use reduces worker-clock disagreement but does not make clocks monotonic or prevent pauses.
- [Martin Kleppmann, How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html): paused holders and delayed requests can outlive a lease; fencing needs monotonically increasing tokens checked by the resource. A highest-seen token rejects older writes after a newer token is observed, not necessarily at the instant the lease expires.
- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests): real contracts have scope, payload rules and retention. Current documentation distinguishes API v1 and v2; if a concrete example is used, pin that API. The generic shop endpoint should not inherit a Stripe retention period.
- [RabbitMQ confirms and acknowledgements](https://www.rabbitmq.com/docs/confirms): publisher confirms and consumer acknowledgements cover different handovers. Broker acceptance does not prove consumer completion.
- [Amazon Builders' Library, Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/): timeouts can leave effects applied; backoff, jitter and limits help avoid retry amplification.
- [PostgreSQL 18 asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html): external actions must not rely on a commit that can still be lost. This article states its durable-commit assumption; durability settings and failover guarantees remain with their existing owners.

## Boundaries for the writer

No prerequisite change is required: introduce claim/lease/fencing vocabulary here. Keep one complete applied claiming example, avoiding a portable SQL claim across all engines. Show normal failure recovery before the operational choices. Cover ordering as an explicit additional requirement without a broker survey, saga tutorial or event-sourcing diversion. No separate planning review was arranged under this orchestrator-managed assignment.
