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

## Application-led revision, 15 October 2026

Read official node-postgres transactions, queries and pool API documentation:
https://node-postgres.com/features/transactions
https://node-postgres.com/features/queries
https://node-postgres.com/apis/pool
They support the checked-out client throughout a transaction, parameterised queries,
promise results and release(true) discarding a connection. The explanatory function
is imported as raw text so the page and exercised lifecycle have one source.

`verify-application.mjs` executes checkout-attempt.mjs against PGlite with a small
client adapter and injected faults. Passed: successful purchase, unavailable stock
without inserts, quantity rejection skips COMMIT and rolls back, rollback failure
discards the connection, confirmed 40001/40P01 rejection cleanup, unknown server
codes 08007/40003, and connection loss before/after COMMIT takes effect. Both unknown
server codes are classified as unknown, not evidence of rollback. Releasing happens
once on every acquired-client path tested. The commit-after-loss fixture preserves
the actual committed records, demonstrating why subsequent rollback is not recovery.

The adapter's isKnownTransactionRejection contract is deliberately narrow and
application-owned. It must establish the attempt did not commit, not merely recognise
any server response. It is not advertised as a complete production error-classifier
implementation. Fault injection checks application branching; it does not establish
real network or multi-session semantics. Existing verify.mjs also passes after the
guarded SQL is presented as a statement inside an already-open handler transaction.

Final review disposition: ready as a draft after independent technical and sequential
fresh-reader review (application-technical-review.md and application-fresh-reader.md).
The fresh reader could follow the handler, driver and database without supplying an
interactive-console setting. Local repairs explicitly connect the featured-product
count to the diagram's dependency, end/release an existing-order replay attempt
before returning its result, and define a lagging replica at first use. The original
reader observations remain in the review record.

Rendered verification: application-browser.json and application-screenshots/ cover
light/dark at 390px/1280px. The coordinator visually inspected checkout, failed-query
and optional psql presentation. The optional practice disclosure starts closed,
opens with keyboard input, and the page has no horizontal overflow or uncaught JS
errors. Wide code remains internally scrollable. The final site build passes and
the built-link audit reports 1,131 internal links/fragments with no failures.

The user requested discussion of a browser SQL playground. No playground was added.
PGlite's documented browser engine and REPL make a single-connection exercise
feasible; it cannot supply independent concurrent sessions for lock demonstrations.
Those remain the role of the labelled existing simulations.
Sources checked 15 October 2026: https://pglite.dev/docs/repl and
https://pglite.dev/docs/multi-tab-worker.
