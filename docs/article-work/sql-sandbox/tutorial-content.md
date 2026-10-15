# Guided SQL tutorials

Written 15 October 2026 for the shared relational sandbox. The content module is
`src/lib/sql-sandbox-tutorials.ts`; IDs are `queries`, `constraints`, `checkout`,
and `rollback`. Each tutorial starts with a fresh copy of the existing designing-data
practice schema plus one stock record: P7, available 3. Tutorial navigation loads
editable SQL but never executes it. Expected outcomes are explanatory hints for the
default route through the steps, not runtime correctness gates.

The reader is explicitly the person sending the application handler's commands in
the transaction tutorials. One connection retains BEGIN across step changes. Returned
rows, successful commands and errors have different meanings. A deliberate error
ends its step; no failure query is batched with the rollback needed afterwards.
Repeated or edited stock reservations can return no row, and instructions explain
that the reader must then roll back instead of following the purchase branch.

- Queries follows product IDs from a catalogue through order O13's lines and a JOIN,
  then calculates the EUR 44 total. An optional variation uses O12's historical
  purchase price to produce EUR 36.
- Constraints accepts quantity 3 on a practice record, rejects 0, then observes 3
  still present. The standalone statements autocommit; this is deliberately distinct
  from the next tutorial's failed explicit transaction. It does not claim that an
  isolated order-line edit is a complete stock adjustment workflow.
- Checkout starts at 3/0/0, explicitly begins, reserves two, inserts the purchase,
  commits, then verifies 1/1/1.
- Rollback begins from the same fresh state, reserves two, creates O14, gets a CHECK
  error for quantity 0, observes failed-state error 25P02, rolls back and verifies
  3/0/0. Historical purchases remain unchanged.

Voice references remain the authoring/style skill and existing relational articles;
the prior application-led transaction revision is the immediate execution-context
reference. The content is kept short enough to read beside an editable query and
its result, while explaining why the next step follows.

## Executed evidence

`node docs/article-work/sql-sandbox/verify-tutorials.mjs` ran all 21 default steps
against PostgreSQL 18.3 through PGlite 0.5.8 with a fresh database per tutorial.
Checks confirmed exact named products, join cardinality, totals 44/36, retained
quantity 3 after the rejected standalone edit, checkout 1/1/1, rollback 3/0/0 and
expected SQLSTATE 23514 (twice) and 25P02 (once). SQL is imported from the actual
content module, rather than copied into an independent set of examples.

The verifier uses the existing seed file plus the agreed stock definition. Browser
runtime seeding and execution lifecycle are owned by the integrating agent; these
checks do not verify UI behaviour. PGlite here has one connection: there is no claim
of testing independent concurrent transactions, network failure or real row-lock
waits. The sandbox should not describe itself as reproducing those mechanisms.
