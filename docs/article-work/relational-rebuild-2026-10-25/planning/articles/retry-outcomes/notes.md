# Planning record

Read only the assigned inputs, supplied current skills and fixed references. Read all 19 bounded text parts separately and received every END marker: sequences 1–6, indexes 1–7, storage 1–6. In one owned IAB tab, studied Sequence diagrams figure 2, Storage and durability figure 8 through its recovered/lost-reply state, and Indexes figure 7's alternative column order. Closed the tab; made no viewport/theme changes. Their useful teaching precedents are one changed fact per comparison, visible caller knowledge beside actual state, and an explanation that follows the drawing. Figure design remains the writer's work.

## Example and continuity

The coordinator approved the central extension: `purchase-103`, scoped to customer 1 and operation `purchase`, identifies the application purchase replay. The canonical relevant payload includes P7 × 1 at agreed 20.00 and P3 × 2 at agreed 4.50. The durable terminal result identifies order 103. Success leaves P3 10, P7 0, P9 4, total 29.00, pending, no payment; other rows stay unchanged. A repeated payload returns that result; changed quantities are rejected. The request key is distinct from the order key. Concurrent attempts, aborted attempts and lost database/application replies are independent illustrative schedules, not observed execution or added core rows. No further shared extension or ownership change is proposed.

Continuity pass: develop missing-reply ambiguity before request identity, atomic recording before duplicate races, and both before recovery/retry judgement. No child is necessary for these inseparable outcomes. Keep outbox delivery, driver disposal and native CockroachDB paths with their accepted owners.

## Primary-source checks, 25 October 2026

- [PostgreSQL 18: Serialization Failure Handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html): retry the entire transaction and its decisions; distinguish serialization/deadlock failures from potentially persistent constraint errors.
- [PostgreSQL 18: Index Uniqueness Checks](https://www.postgresql.org/docs/18/index-unique-checks.html): a competing insertion waits for an uncommitted conflicting row; commit and rollback lead to different continuations. A separate absence check cannot provide this arbitration.
- [PostgreSQL 18: Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html): a Read Committed `ON CONFLICT DO NOTHING` can decline insertion for a row outside that statement's snapshot. A same-statement fallback SELECT is insufficient; a subsequent current observation or suitable transaction restart is needed.
- [PostgreSQL 18: Message Flow, cancellation and termination](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-CANCELING-REQUESTS): cancellation may arrive too late and has no direct success acknowledgement. Disconnection is not evidence that already executed work was undone.
- [Amazon Builders' Library: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/): caller identity, payload mismatch validation, atomic token/effect recording, equivalent recovery results and late-request retention are supporting design precedents.
- [Amazon Builders' Library: Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/): bound retries and spread them out to avoid amplifying overload; a timeout cannot rule out effects.

## Writer boundaries

Use a request row provisionally inside the purchase transaction and expose only a committed terminal result. A separately committed `processing` marker creates crash recovery/lease obligations that this simple protocol does not need. Any concrete SQL must state its isolation and visibility assumptions and be verified by the preview/integration owner if presented as observed. Do not treat an empty lookup as authority to bypass the unique-key protocol. Choose and state a terminal-refusal policy without inventing retention days or claiming an unlimited guarantee. Keep receipt retention stable during the illustrated race; storage loss, restored history and replica failover guarantees belong to their existing articles. The result receipt records the original decision, not a promise that an order can never change later.
