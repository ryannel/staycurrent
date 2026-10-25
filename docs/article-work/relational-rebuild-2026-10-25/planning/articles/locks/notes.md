# Locks planning notes

Draft outline under the accepted ownership tree. No child or ownership change is
proposed. The article owns the complete lock protocol and its repair, including
the visibility requirement after waiting. It does not rederive the parent's
isolation taxonomy, prescribe an incident-wide investigation, implement a retry
framework or supply a PostgreSQL operations runbook.

## Reference exposure

Read all 19 bounded text parts separately using the supplied reader: sequences
1–6, indexes 1–7 and storage 1–6. Every END marker was delivered. Studied the
finished previews in three owned temporary IAB tabs, without visibility, viewport
or theme changes, and closed them afterwards.

Comparable teaching: Sequence diagrams figure 2 makes a nested wait visible with
participant states and changing time; Indexes figure 7 keeps the same query and
rows while changing one index choice; Storage figure 3 places the two readers'
values beside the retained versions. Follow these explanatory moves when making
the payment handover, stale snapshot and deadlock cycle visible. The outline
leaves drawing form, controls and paragraph development to the fresh writer.

## Example decisions and proposed central additions

- Keep the core product facts, order 103 total 29.00 and lack of payments. The
  existing payment-limit scenario supplies the two attempted 20.00 records.
- Coordinator-approved detail: use `orders` row 103 as the common
  authority, acquired before a separate aggregate read and retained through the
  decision, payment insert and commit. All paths changing recorded payments or
  order-line value must participate. A foreign-key reference alone does not
  establish this protocol. An alternative that freezes line values or maintains a
  balance changes the business/schema assumptions and needs central agreement.
- For the successful PostgreSQL Read Committed schedule, the second lock request
  waits; its subsequent, separate total query sees the committed 20.00 and rejects
  another 20.00. A single command that locks and calculates can keep a snapshot
  from before waiting. Do not promise that a CTE makes this a later snapshot.
- For the contrasting Repeatable Read schedule, freeze the second transaction's
  snapshot before the first payment commits, leave the guard row unchanged and
  show why lock ownership alone fails to refresh the total. Do not prescribe
  taking `SELECT FOR UPDATE` as the first statement as a universal fix: that
  statement can establish its snapshot before it waits. Sound alternatives include
  the explicit Read Committed protocol, an actual guard-row update that makes
  conflicting Repeatable Read transactions abort and restart, or a complete
  Serializable protocol. The eventual writer should choose how much comparison
  the explanation needs and verify any executable alternative.
- Deadlock is an independent lock-only P3/P7 schedule; it adds no order or payment,
  chooses no victim and does not revise Mina's fixed win of the last-mug race.
  Sorted stable product identifiers can supply a common order; an `IN` list alone
  does not promise acquisition order.
- No runtime work was done. Any native observed transcripts must come from the
  eventual writer's owned PostgreSQL 18.6 fixtures. Flag both payment schedules,
  particularly the unchanged guard with an established Repeatable Read snapshot,
  for native verification. Drawings without that evidence are labelled
  illustrative schedules of documented behaviour.

## Primary sources checked on 25 October 2026

- [PostgreSQL 18: Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html):
  row/table conflict modes, transaction lock lifetime, implicit-lock deadlocks,
  consistent resource order and upgrades; advisory locks are cooperative, with
  different session and transaction lifetimes. Keep engine-specific claims named.
- [Application-level consistency](https://www.postgresql.org/docs/18/applevel-consistency.html#NON-SERIALIZABLE-CONSISTENCY):
  explicit exclusion and snapshot freshness must both be considered. Section
  13.4.2 explicitly warns that a Repeatable Read snapshot can predate lock
  acquisition. The unchanged-parent payment schedule is an application of this
  documented rule, not an observed run.
- [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html):
  statement versus transaction snapshots; a locking read can wait, and an actual
  concurrent row update has different Repeatable Read conflict behaviour from a
  lock-only handover. Serializable still needs complete transaction retries.
- [SELECT: locking clause](https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE):
  returned-row scope, `OF` targeting, aggregation restriction, and the selection
  semantics of `NOWAIT` and `SKIP LOCKED`. Skipping suits some queue consumers;
  it supplies an incomplete view for an invariant decision.
- [pg_locks](https://www.postgresql.org/docs/18/view-pg-locks.html) and
  [session information functions](https://www.postgresql.org/docs/18/functions-info.html#FUNCTIONS-INFO-SESSION):
  row waits commonly appear as transaction-ID waits; use `pg_blocking_pids()`
  rather than deriving a blocker by a naïve self-join. A blocker can be a conflicting
  holder or a preceding incompatible waiter. These support a bounded example,
  while the native diagnostic procedure remains with PostgreSQL operations.
- [Client connection defaults](https://www.postgresql.org/docs/18/runtime-config-client.html):
  `lock_timeout` applies separately per acquisition; `statement_timeout` spans the
  command, and idle-transaction expiry addresses a different condition. A timeout
  does not prove a business rule is satisfied.
- [Lock management](https://www.postgresql.org/docs/18/runtime-config-locks.html):
  `deadlock_timeout` delays the deadlock check and also affects lock-wait logging;
  it does not cap ordinary lock waiting.

## Continuity and unresolved dependencies

The outline advances from an existing transaction and snapshot model to authority,
handover, scope, cycles, evidence and bounded failure. Payment and deadlock cases
remain separate explorations. There is no newly commissioned child. The
coordinator approved the independent payment protocol and lock-only deadlock
details during planning; its values and existing scenario are supplied facts.
The coordinator should give the writer the
finished transaction article when available so only the necessary isolation
reasoning is repeated. No separate planning review was commissioned or performed.
