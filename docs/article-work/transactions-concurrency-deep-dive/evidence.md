# Evidence and verification

Checked 14 October 2026. SQL and concurrency claims target PostgreSQL 18. Shop
records, interleavings and payment workflow are invented teaching examples.

Primary sources read:
- https://www.postgresql.org/docs/18/tutorial-transactions.html and
  https://www.postgresql.org/docs/18/sql-savepoint.html: commit, rollback, failed
  transaction and savepoint behaviour.
- https://www.postgresql.org/docs/18/transaction-iso.html: Read Committed ordinary
  statement snapshots; waits/rechecks for changed rows; locking-read updated value;
  Repeatable Read snapshot timing and concurrent-update rejection; Serializable
  prevents incompatible committed outcomes but requires complete retries.
- https://www.postgresql.org/docs/18/explicit-locking.html: row-lock conflicts,
  ordinary-reader coexistence, transaction lifetime and deadlock handling.
- https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html:
  SQLSTATE 40001/40P01 and full decision retry, not only the final statement.
- https://www.postgresql.org/docs/18/sql-insert.html and
  https://www.postgresql.org/docs/18/index-unique-checks.html: unique claim,
  RETURNING and waiting for an overlapping unique insertion. A subsequent Read
  Committed statement supplies a new view for recovery.
- https://www.postgresql.org/docs/18/libpq-status.html: unknown transaction status
  on a bad connection; losing an answer does not establish rollback.

Design inferences: the operation key must bind the complete authenticated intent,
be retained throughout the accepted retry window, and commit with all local effects.
Outside payments require a provider recovery contract. Durable work in the local
transaction preserves an intent to deliver, but delivery can repeat. These are
application responsibilities, not guarantees from PostgreSQL alone.

Verification: `node docs/article-work/transactions-concurrency-deep-dive/verify.mjs`
uses PGlite 0.5.8 / PostgreSQL 18.3 from the temporary local dependency location.
It extracts displayed SQL directly from the article. Passed: complete checkout;
quantity check failure and explicit rollback; successful zero-row reservation;
guarded reservation; sequential serializable featured-product decision; operation
claim and duplicate recovery. Recovery model checked all 24 combinations of six
steps, two original outcomes and two key choices, including conservation of stock,
committed-record visibility, indistinguishable missing replies and no duplicate
reservation when recovering a committed key. `pnpm build` passed during assembly.

Limits: PGlite is a serial embedded instance. These runs do not observe concurrent
snapshot changes, lock waits, SSI rejection or deadlock detection. The article's
schedules and controls are documentation-based teaching models; none is described
as a live database or benchmark. A psql binary was unavailable. Docker's presence
alone was not treated as an existing PostgreSQL server.
