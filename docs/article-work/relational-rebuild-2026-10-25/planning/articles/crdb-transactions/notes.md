# CockroachDB transactions and retries: planning notes

## Inputs and reference exposure

Read all six assigned input files, the assignment, the current breakdown skill,
its write-reference procedure and the continuity skill. No old article body,
outline, feedback or other worker's notes was consulted. Read each bounded
reference part separately with `scripts/read-writing-reference.py`: sequences
1–6, indexes 1–7, storage 1–6. Every END marker was delivered.

Owned IAB tabs showed the finished references on port 4584. Studied Sequence
diagrams' outbox drawing and its separation of commit, reply and later external
work; Indexes' covering/visibility figure, where one changed input changes a
visible consequence; Storage and durability's recovery figure, separating durable
database evidence from what the application heard. Their useful teaching pattern
is one concrete change, a directed observation, then the consequence. The writer
should choose drawings and prose afresh; this outline only names what needs to
become visible.

Read the finished Inside CockroachDB, Retries and uncertain commit outcomes, and
Transactions across partitions drafts through the owned port-4606 preview. The
parent already establishes keys, per-range agreement, native v26.2.8 single-node
observations and the difference between that evidence and distributed models.
The generic recovery article already supplies the request schema, unique gate,
canonical payload, refusal handling, retention and external-work boundary.

## Versioned primary sources

Checked 26 October 2026. Target ordinary self-hosted v26.2, matching the parent's
v26.2.8 fixture. These are documentation checks, not native execution results.

- [Transaction layer](https://www.cockroachlabs.com/docs/v26.2/architecture/transaction-layer#transaction-records), especially transaction records, write intents, read refreshing and Parallel Commits: native state/evidence and deferred resolution. Record creation is lazy; do not draw a durable PENDING row as obligatory before the first write. A missing record is not immediate proof of abort. Avoid turning the overview's simplified phases into the exact order of every request. The Parallel Commits detail is the guide for STAGING.
- [Transactions](https://www.cockroachlabs.com/docs/v26.2/transactions#automatic-retries): automatic replay depends on batching and result buffering; returned interactive decisions prevent assuming that the server can replay the whole purchase. Use default Serializable as the worked scope, without claiming it is CockroachDB's only isolation level.
- [Transaction retry error reference](https://www.cockroachlabs.com/docs/v26.2/transaction-retry-error-reference): use structured 40001 handling and retain the reason for diagnosis. Recurrent errors may involve cluster state as well as conflicting application work. Keep transactions short and read sets focused; detailed hotspot/SQL-work diagnosis belongs to crdb-performance, and choosing weaker isolation belongs to crdb-reads.
- [Transaction retry error example](https://www.cockroachlabs.com/docs/v26.2/transaction-retry-error-example): complete application retry, backoff and controlled testing. Error injection is artificial evidence, not an observed contention schedule. With the documented session injection enabled, fresh-transaction retries continue failing until injection is disabled; the documented three-retry escape applies to the special retry-savepoint path. Do not promise a successful fresh-attempt demo merely by copying that setting.
- [Advanced client-side transaction retries](https://www.cockroachlabs.com/docs/v26.2/advanced-client-side-transaction-retries): the retry savepoint is outermost and precedes data work. Successful release commits; the following COMMIT clears the connection. Keep this alternate compact and make the main fresh-transaction handler unambiguous.
- [Common errors: result is ambiguous](https://www.cockroachlabs.com/docs/v26.2/common-errors#result-is-ambiguous): 40003 is statement_completion_unknown; ambiguity can arise at COMMIT, retry-savepoint RELEASE or an implicit transaction. A transport failure during commitment need not arrive as 40003. Do not classify arbitrary connection failures as known aborts.

## Example and evidence decisions

Use the supplied independent purchase replay throughout: order 103 and its lines
initially absent; P3/P7/P9 stock 12/1/4; success leaves 10/0/4. Line 1 is P7 × 1
at 20.00, line 2 P3 × 2 at 4.50; total 29.00, pending, no payment. Preserve
`purchase-103`, customer 1 and operation purchase across every native attempt and
later caller recovery. Native transaction identifiers can change; they are not
the request identity. No price-change experiment or new buyer is needed.

The supplied request table and protocol may be reused. Verify their native
Serializable duplicate branch rather than importing PostgreSQL Read Committed's
fresh-statement visibility explanation unchanged. Retain a refusal only after
undoing all partial stock work; an ordinary purchase-work savepoint has a
different purpose from cockroach_restart. Unexpected errors must never commit
an unfinished request row. Existing lines, stock and request result should be
checked together after success and duplicate recovery.

Root owns any later SQL evidence. A disposable single-node run can verify the
chosen statements, actual error fields, retry control and retained result. It
cannot establish distributed recovery, survival, Parallel Commits timing or a
specific physical range count. Native observations should be recorded separately
from illustrative intent/state walks. The plan does not require causing a real
40003; a lost-reply model plus verified idempotent recovery is sufficient when
labelled accurately.

## Continuity and ownership

Continuity pass complete on the outline: the native mechanism leads to the
application decision it explains; the same basket, request identity and pending
result survive all branches. Attempt replay, database outcome and caller knowledge
remain separate. Keep full generic invariant, recovery, external-worker and read
choice procedures with their accepted owners. Existing prerequisites provide the
necessary deeper reading. No child stub, shared-business change or ownership
change is proposed; there is no unresolved central boundary.
