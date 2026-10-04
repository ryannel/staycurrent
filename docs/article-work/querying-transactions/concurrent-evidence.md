# Concurrent updates: evidence and media

Draft prepared 4 October 2026. Commission: make a one-row stock race understandable,
then show why a guarded update or a read made while holding a lock changes the
decision. Root owns independent review, browser verification and final build.

## Primary evidence

All sources checked on 4 October 2026, PostgreSQL 18:

- https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED — an
  ordinary SELECT’s view; waiting updater’s re-evaluation of WHERE; the updated row
  returned by a waiting SELECT FOR UPDATE. All schedules explicitly use this
  setting. These rules must not be transplanted unchanged to Repeatable Read or
  another engine.
- https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS — conflicts
  between row locks, ordinary readers not blocked by them, release at transaction
  end. Its deadlock section supports the short bridge about multiple stock rows.
- https://www.postgresql.org/docs/18/sql-update.html — current-row expressions,
  RETURNING and successful zero-row updates.
- https://www.postgresql.org/docs/18/dml-returning.html — modified-row results.

The two-buyers and two-bins scenarios are deductions from those behaviours. The
article and interaction identify them as invented models. No benchmark or actual
two-connection execution is claimed. Stronger isolation and cross-record conditions
are handed to the isolation article.

## Verification

`boundary-concurrent-verify.mjs` extracts source constants. Executed on PostgreSQL
18.3/PGlite 0.5.8 on 4 October 2026:

- A guarded update returns P7/0; its order and line commit with stock zero.
- A subsequent reservation on zero stock returns no rows.
- The positive locking-read branch returns 1 and then reserves and commits.
- Replaying two application-computed literal writes of zero permits two distinct
  orders and leaves stock zero. This demonstrates the missing stored invariant; it
  does not execute simultaneous sessions or test waiting.

The unsafeRead and unsafeWrite fragments are literal extracted SQL. The locking
fragment’s comment-labelled branches are application responsibilities; the verifier
executes only the positive branch, on a fixture that satisfies it.

## Media intentions

- `ConcurrentDecision.astro`: compares where the wait falls relative to the
  application’s decision. Both paths encounter a lock, so waiting alone cannot be
  mistaken for the fix. Read Committed context is in the caption.
- `ConcurrentSchedule.astro`: three methods, each with A committing or rolling back.
  The reader advances a fixed order of events with native buttons. The method and
  first outcome each reset the run. Committed availability and purchase counters
  are distinct from pending work in request panels. A live event paragraph explains
  the change without relying only on colour. Controls appear only after JavaScript
  connects; the server-rendered result is the completed unsafe case, accompanied
  by a no-JavaScript explanation of coordinated outcomes.

Expected endings:

| Method | A commits | A rolls back |
| --- | --- | --- |
| Ordinary read, application arithmetic, literal write | Two purchases, stock 0 | One purchase, stock 0 |
| Conditional update | One purchase, stock 0; B reserves nothing | One purchase, stock 0; B buys |
| Lock before reading and deciding | One purchase, stock 0; B sees 0 | One purchase, stock 0; B buys |

During step 3, A’s stock reduction and O14 are pending, so committed counters still
show availability 1 and purchases 0. Step 4 exposes A’s ending and B’s now-unblocked
decision. The model deliberately omits cleanup, crash recovery, lock timeouts,
deadlocks and scheduling randomness.
