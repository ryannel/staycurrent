# Isolation and snapshots · evidence

Research checked 4 October 2026, PostgreSQL 18 documentation. The article uses the
four-table practice shop and explicitly introduces a featured display with two
boolean flags. Prices describe EUR catalogue offers, not revised purchase history.

## Documented behaviour

- [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html):
  ordinary Read Committed queries take statement views; Repeatable Read retains
  the view established by the first query or modification. Own prior writes
  remain visible. Conflicting writes and locking reads differ from ordinary
  reads. Repeatable Read can reject changed-row updates while still permitting
  nonserial outcomes involving different written rows.
- [SET TRANSACTION](https://www.postgresql.org/docs/18/sql-set-transaction.html):
  setting timing, READ ONLY, and Serializable's committed-outcome guarantee.
  Isolation is selected before the first query. The article does not teach all
  isolation levels or imply portable behaviour from a level's name alone.
- [BEGIN](https://www.postgresql.org/docs/18/sql-begin.html): the shown transaction
  mode syntax and explicit BEGIN/COMMIT boundary.
- [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html):
  FOR UPDATE conflicts, waiting, and restrictions at Repeatable Read. The
  alternative display protocol names Read Committed and places its flag read in
  a subsequent statement after acquiring the common lock. An unchanged control
  row lock would not refresh an existing Repeatable Read snapshot.
- [Serialization failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html):
  the failed attempt must be retried with its reads and decision logic.

## Observed execution and limits

`isolation-retry-verify.mjs` imports the actual article SQL literals and starts
one PGlite PostgreSQL 18.3 session. `isolation-retry-results.json` records results.
The read-only Repeatable Read report returns EUR 20 twice without an intervening
writer; the writer statement changes P7 to 22; the own-write transaction returns
21 twice and rollback restores 20. Sequential display decisions at both
Repeatable Read and Serializable leave P8 enabled after A hides P7.

This confirms command syntax and those sequential decisions. It does not execute
two overlapping PostgreSQL sessions. The statement/transaction-view schedule,
Repeatable Read write skew, and Serializable rejection are inferences from the
documented rules applied to the illustrated interleaving. The footer makes this
scope explicit. The browser experiment is a schematic model, not an SQL engine.

## Editorial checks

Original human reference consulted: [Sam Who, Load Balancing](https://samwho.dev/load-balancing/).
The relevant method is to retain a visible situation and explain what changed
before moving to a broader choice; no wording or asset is reproduced.
The authoring and style skills, latest house guidance, and article brief were read.
An early independent technical finding tightened the display-control lock
alternative; a reader finding added a local explanation of boolean `AND enabled`.
Root owns final browser acceptance and independent review records.
