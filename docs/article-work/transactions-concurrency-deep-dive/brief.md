# Transactions and concurrency

Reader: an engineer who understands tables and simple SQL but needs to reason about
shared changes. This is the third main relational deep dive. It must stand alone
without delegating isolation or failed attempts to its children.

The argument begins with a complete purchase, adds another buyer to expose the
read/decide/write gap, introduces coordinated decisions, and then distinguishes a
stable view from protection of a rule spanning rows. It ends by following rejected
attempts, unknown commit outcomes and the separate payment boundary.

Useful stopping point: choose a boundary and compatible concurrency mechanism for
a concrete rule; distinguish business refusal, retryable rejection and uncertain
commit; understand why outside effects need their own recovery. The isolation and
conflict/retry children provide deeper schedules and a complete SQL recovery protocol.

Material reused and reshaped: transaction-boundaries.astro and concurrent-updates.astro;
isolation and retry drafts informed the new local explanations. Main title is
Transactions and concurrency; existing transaction-boundaries route remains canonical.
concurrent-updates can redirect to #concurrent-work after review.

Writing references: docs/writing-style.md; Sam Who's Load Balancing opening through
When round robin doesn't cut it (read 14 October 2026); existing transaction,
concurrency, isolation and recovery pages. The reference supplies continuity between
observations and changed conditions, not borrowed prose or a mandatory narrative.

Media purposes:
- BoundaryOutcomes: show which three records change together and compare endings.
- ConcurrentDecision: locate B's decision relative to the wait.
- ConcurrentSchedule: compare stale literal, guarded update and locking read, with
  both A commit and A rollback. Committed counters and pending work are distinct.
- IsolationWriteSkew: make each decision's dependency on the other row visible.
- TransactionRecoveryLab (new): compare hidden commit/rollback histories that
  produce the same missing reply, then vary stable/new identity. Five initial mugs
  make a duplicate visible without stock exhaustion masking it. State is separate
  from application knowledge at every step.
- BoundaryPayment: distinguish a local pending order from a provider outcome.

Independent reviews and browser verification are owned by the integrating agent;
this author has not supplied its own review as independent acceptance.

## Application-led revision, 15 October 2026

The reader repeatedly lost track of who sends SQL, where BEGIN lives, what a
comment means, and why ROLLBACK is sent after an error. Extra SQL headings did not
supply the missing execution context. The revised main path follows a checkout
handler: browser request, server code, borrowed client, awaited query, result rows,
JavaScript branch, inserts, commit, thrown error, catch and connection cleanup.
Await pauses this handler while the server can serve another handler on another
connection. A compact exchange table keeps application and database roles visible.

The original psql walkthrough is retained in an optional disclosure, with commands
and expected results distinct. The complete application lifecycle is also optional,
with an explicit teaching-adapter contract for confirmed transaction rejection.
Later A/B examples retain the handler context; unsafe and locking branches are
JavaScript, the guarded SQL is explicitly the command inside the awaited call,
report and featured-product terminal reproductions are optional. Retry flow now
uses JavaScript consistently. No playground is built as part of this revision.
