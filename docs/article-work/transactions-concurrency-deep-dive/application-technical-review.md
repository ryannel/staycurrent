# Application-centred technical review

Reviewed 15 October 2026. Scope: the application-centred revision of
`transaction-boundaries.astro` and its displayed `checkout-attempt.mjs`, including
connection lifecycle, driver results, parameter mapping, failure classification,
and the relationship between application excerpts and optional terminal exercises.
No article edits by this reviewer. Rechecked the settled article, complete attempt,
retry sketch and author verification evidence after the author finished.

**Verdict: technically ready as a draft.** No unresolved material technical finding
remains. The revision now explains the execution environment and application
choices rather than relying on the reader to infer them from SQL. Independent
fresh-reader and browser inspection remain separate evidence.

## Findings and repairs

The first complete-attempt version asked an injected `isDatabaseRejection` adapter
to recognise a PostgreSQL error response. That contract was insufficient at COMMIT:
a code can describe unknown completion or transaction resolution, rather than
confirming that the attempt failed. The author changed the name and contract to
`isKnownTransactionRejection`, which must establish that this attempt did not
commit. Everything else after a sent COMMIT takes the unknown-outcome path and
discards the client. Checked the repaired function and accompanying explanation.
This resolves the material finding without pretending that a general classifier
has been supplied.

The psql exercise originally described SQLSTATE 23514 as expected visible output.
Default psql verbosity can omit it. The author now distinguishes the error message
from its associated code. Checked the repair.

The first revision retained Python-shaped retry pseudocode after teaching a
JavaScript driver. The author replaced it with a JavaScript-shaped loop around
`checkoutAttempt`. Its unknown branch precedes the known-retry classifier, and
the prose explains that the attempt has already released or discarded its client.
This resolves the continuity concern. Both injected classifier contracts and the
pending/recovery responsibility are explicit; none is represented as a built-in
node-postgres function or implemented recovery protocol.

## Technical reading

The checkout now has an identifiable caller and execution environment: a browser
sends a purchase request; a server handler borrows a driver client; awaited queries
produce values or throw; application branches decide the next command. The two
normal-path excerpts explicitly belong to one handler and one open transaction.
They do not imply a second BEGIN before the inserts.

Parameter mappings agree across the displayed excerpts and complete function:
reservation quantity and product; order ID, customer and placement time; line
order ID, product, quantity and agreed price. The fixed line number is SQL literal
1. The example says input and authority checks precede these values. A unit price
string preserves the decimal representation for PostgreSQL's numeric input.

The zero-row branch rolls back and returns unavailable without inserting an order.
An awaited line rejection prevents COMMIT from being reached. The complete
function attempts rollback on errors before commit or on a confirmed rejection;
it only marks the client reusable after confirmed commit or rollback. Failed
cleanup leaves it marked for destruction. `finally` releases exactly once after
a client has been acquired. A failed `pool.connect()` has no borrowed client to
release. A missing commit answer takes the unknown path without trying to undo a
possibly completed purchase or silently retrying it.

The function is expressly a teaching attempt with an injected rejection adapter,
not a drop-in HTTP checkout implementation. Validation, authentication, deadlines,
recovery identity and durable reconciliation remain named responsibilities. This
boundary matters: a reader should not mistake the earlier non-idempotent attempt
for the later stable-key recovery protocol.

The later stock examples now describe alternative reservation behaviour inside
the same kind of server handler. Each concurrent handler owns a client and a
transaction; awaiting a row lock does not prevent the other handler from running.
The locking-read branch waits for its result before inspecting availability.
Report and staff exercises explicitly identify when a terminal reader is taking
the place of a handler. The operation-identity extension explains who awaits and
inspects the claim result before deciding whether to reserve stock.

## Primary documentation checked

- [node-postgres transactions](https://node-postgres.com/features/transactions):
  explicit SQL transaction commands and one acquired client for the whole attempt.
- [Pool API](https://node-postgres.com/apis/pool): `connect`, one eventual release,
  and `release(true)` destroying rather than returning the client.
- [Client API](https://node-postgres.com/apis/client),
  [queries](https://node-postgres.com/features/queries), and
  [result objects](https://node-postgres.com/apis/result): query promises,
  parameter arrays, returned row objects and empty result arrays.
- [PostgreSQL 18 error codes](https://www.postgresql.org/docs/18/errcodes-appendix.html):
  CHECK rejection 23514, serialization failure 40001, deadlock 40P01, and explicitly
  unknown outcomes 08007/40003. Having a code alone does not establish rejection.
- [psql reference](https://www.postgresql.org/docs/18/app-psql.html): error verbosity,
  SQLSTATE and the optional `\errverbose` command.

This is an independent source and control-flow review. The author owns execution
of the new application tests; their results will be recorded separately rather
than represented here as independent live node-postgres or network-fault testing.


## Final verification evidence reviewed

Inspected `verify-application.mjs` and the author's evidence record after both
verification programs were reported passing. The application test imports the
same raw function displayed by the article. It executes its SQL in PGlite and
checks purchase success, unavailable stock without inserts, CHECK failure skipping
COMMIT, rollback cleanup failure, known commit rejections, server-coded unknown
outcomes, and connection loss both before and after commit. It checks the release
argument and confirms that unknown commit branches do not send rollback.

The simulated server-rejection classifier requires a fixture marker plus the
known codes, so the tests do not quietly imply that an arbitrary object's `code`
proves a server response. The marker is explicitly fixture machinery. The test
releases only a fake client and injects faults around PGlite calls; these checks
verify control flow, not real node-postgres pool internals or network timing.
Those API claims were checked against the primary driver documentation above.
I did not duplicate the author's execution runs.

The new retry sketch returns purchased or unavailable results, routes unknown
outcomes into pending recovery, and only repeats confirmed serialization/deadlock
rejections. Its helper names are explained as application responsibilities. It
keeps the original purchase intent while rerunning the database decision. The
later key-based extension is explicitly separate from the earlier attempt and
explains that recovery must claim the original identity before making a further
reservation.
