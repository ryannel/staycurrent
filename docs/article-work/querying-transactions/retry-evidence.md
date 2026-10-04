# Handling waits, deadlocks, and retries · evidence

Research checked 4 October 2026, PostgreSQL 18. The article distinguishes waiting,
server-reported transactional rejection, and a lost reply after a possible commit.
Application retry, request identity and reconciliation are reasoned designs for
the teaching shop, rather than a claim about an unnamed driver or payment API.

## Primary sources and their jobs

- [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html):
  conflicting row locks, deadlock cycles, victim selection, consistent ordering,
  and the consequence of holding transactions open.
- [Serialization failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html):
  SQLSTATE 40001, whole-transaction retry including the decision logic, and other
  failures that may require different treatment. The pseudocode also retries
  40P01; it does not retry every uniqueness violation.
- [Error codes](https://www.postgresql.org/docs/18/errcodes-appendix.html):
  40001 serialization_failure and 40P01 deadlock_detected. Use stable codes rather
  than wording; network failures need context about whether commit was sent.
- [INSERT](https://www.postgresql.org/docs/18/sql-insert.html): conflict-target
  semantics and RETURNING only actually inserted or updated records.
- [Index uniqueness checks](https://www.postgresql.org/docs/18/index-unique-checks.html):
  conflicting insert waits for another transaction's commit or rollback. This
  provides a common decision point for the stable operation key.
- [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html):
  Read Committed DO NOTHING can detect a conflict not in that statement's view;
  the protocol therefore reads the existing result in a subsequent statement.
- [libpq connection status](https://www.postgresql.org/docs/18/libpq-status.html):
  concrete documentation of UNKNOWN transaction state on a bad connection. It
  supports the evidence distinction, not a universal driver API promise.

## Observed execution

`isolation-retry-verify.mjs` runs 21 shared checks in one PostgreSQL 18.3 PGlite
0.5.8 session. It extracts the published SQL literals so evidence follows edits.
Fresh K14 claims O14, reserves two of three mugs and stores an EUR 20 line.
A duplicate K14 proposing O15 inserts nothing, retrieves O14, and leaves stock
at one. A conflicting quantity does not match the stored request.
An insufficient-stock K15 attempt rolls back its provisional order/key. A
successful stock change followed by an invalid quantity CHECK rolls back the
stock change, order and key. An unrelated order primary-key collision reports
23505 instead of taking the ON CONFLICT operation-recovery branch. The ordered
locking query returns P7 then P8 and ends with rollback. Historical O12 remains
EUR 36.

Deadlock detection, waiting on an in-progress duplicate claim, lost replies, pool
cleanup and remote effects were not executed by this single-session verification.
Those are documented or illustrative cases and labelled as such. Application
control flow is explicit pseudocode. Random bounded delay and request identity
retention are design choices; no fixed retry budget, timing or exactly-once
external-effect guarantee is inferred from the SQL checks.

## Design assumptions worth preserving

Every retryable new checkout supplies a stable key. The column is nullable only
to accommodate the historical fixture. Keep the same key across incoming request
deliveries and process restarts; validate the complete meaningful request before
returning an existing result. Repeated claims, stock changes and lines remain one
transaction; application branches must check returned rows before continuing.
The example uses one product, one EUR price, and Read Committed. Larger carts and
offers require complete request comparison and their own validity rules.

Authoritative recovery requires available, trustworthy retained state. Absence is
not immediate proof of rollback, and exhausting a retry deadline cannot settle
an uncertain commit. Deleting order/key records would need a separate retention
and duplicate-protection policy. The article preserves this assumption rather
than claiming that key uniqueness can remember an erased operation.
