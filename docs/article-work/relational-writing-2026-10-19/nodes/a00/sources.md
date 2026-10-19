# a00 source and execution record

Checked 19 October 2026. Article: **Relational databases**.

## Reference teaching

Read Sequence diagrams, Indexes and Storage and durability in full from
`src/reference-articles/`. Read every rendered figure’s complete textual
narrative, states, assumptions and controls in the reference preview at
`http://127.0.0.1:4337/review/examples/`; inspected rendered reference layout.
The draft uses a running case, defines terms as they become useful, asks readers
to predict a result, then explains what changed and why. Its two figures change
an assumption rather than merely reveal more text.

## Primary technical sources

All links below were opened directly during writing. PostgreSQL documentation is
pinned to major version 18. These support documented contracts, not a claim that
an unperformed production test passed.

| Source | Claims used |
| --- | --- |
| [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) | Primary/composite keys, NOT NULL, CHECK; the shop's required foreign keys. |
| [Foreign keys tutorial](https://www.postgresql.org/docs/18/tutorial-fk.html) | Referencing a missing parent is refused; references express relational integrity. |
| [Numeric types](https://www.postgresql.org/docs/18/datatype-numeric.html) | Exact decimal representation and `numeric(10,2)` compared with inexact floating point. |
| [Table expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html) | Matching pairs, inner/left joins, grouping. |
| [Aggregate functions](https://www.postgresql.org/docs/18/functions-aggregate.html) | SUM ignores null inputs and has a null result with no non-null inputs; COUNT(*) versus COUNT(expression). |
| [Comparison functions](https://www.postgresql.org/docs/18/functions-comparison.html) | Ordinary comparisons involving NULL are unknown; IS NULL tests absence. |
| [Sorting rows](https://www.postgresql.org/docs/18/queries-order.html) | Output ordering requires ORDER BY. |
| [Transactions tutorial](https://www.postgresql.org/docs/18/tutorial-transactions.html) | Grouping changes, commit, rollback and visibility of incomplete writes. |
| [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html) | PostgreSQL default Read Committed; a conflicting updater waits and rechecks the WHERE condition on the committed row. |
| [Asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html) | Acknowledgement may precede durable log flush; a crash can lose recent commits. |
| [Command execution](https://www.postgresql.org/docs/18/libpq-exec.html) | PQexecParams separates values from statement text; driver binding preserves the value/syntax boundary. |
| [Connection status](https://www.postgresql.org/docs/18/libpq-status.html) | PQtransactionStatus returns PQTRANS_UNKNOWN for a bad connection. Broken-commit outcome reasoning is stated separately from an explicit rejection. |
| [Introduction to indexes](https://www.postgresql.org/docs/18/indexes-intro.html) | Scan versus search, planner choice and index maintenance costs. |
| [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) | Estimated plan versus execution with ANALYZE, rows and buffers; ANALYZE really executes changes. |
| [Continuous archiving and PITR](https://www.postgresql.org/docs/18/continuous-archiving.html) | Base backup plus retained WAL supports recovery to an earlier point; requirements for retained recovery input. |
| [Log-shipping standby servers](https://www.postgresql.org/docs/18/warm-standby.html) | Replica/failover freshness and potential committed-data loss depend on replication/acknowledgement progress. |
| [SQLite is serverless](https://www.sqlite.org/serverless.html) | SQLite executes within its application's process rather than using a separate database server. |

Schema-evolution sequence, request ownership, retry budgeting, recoverability
checks and candidate gates are practical design reasoning at orientation depth.
They are not executable rollout, payment or recovery procedures. Detailed owners
are linked in the article. No managed-service terms, remote payment behaviour,
benchmark result or production readiness claim is asserted.

## Native PostgreSQL execution

Runtime from `runtime.md`: PostgreSQL 18.6 (Homebrew), aarch64 Apple Darwin,
Apple clang 21.0.0, role `staycurrent`, loopback `127.0.0.1:57319`.
Used only the fresh article database **rel3_a00_run1**. No session settings,
server settings, shared server lifecycle or other article databases were changed.
All psql sessions ended. Data remain disposable with the orchestrator's cluster.

Executable fixture and article SQL are owned in:

- `src/components/relational-next/a00/queries.mjs`
- `src/components/relational-next/a00/models.mjs`
- `src/components/relational-next/a00/verify.mjs`

Observed command: `node src/components/relational-next/a00/verify.mjs`.
It creates a fresh database, so a second run must use a new suffix, for example
`REL3_A00_DB=rel3_a00_run2 node src/components/relational-next/a00/verify.mjs`.
Native commands require the same approved elevated execution as the shared
runtime because the restricted shell blocks its loopback/shared-memory access.

Assertions passed:

- Mina's filtered result: `101, paid`.
- Inner join: two matching item rows, then one grouped result:
  `101, Mina, 36`.
- Left join: three joined rows, then `101, Mina, 36` and
  `102, Arun, NULL`.
- The model's inner/outer joined rows and summaries match native SQL exactly.
- Empty draft 102: `COUNT(*) = 1`, `COUNT(i.product_id) = 0`.
- `shipped_at = NULL` matches zero rows; `IS NULL` matches both fixture orders.
- Committing order and item in separate statements retains both after the
  hypothetical request interruption, with stock 1.
- Explicit transaction rollback removes both; commit publishes both and stock 0.
- Two concurrent native psql sessions attempt the conditional stock decrement.
  Buyer A holds the row while executing `pg_sleep(1)` before commit. Buyer B is
  launched after 200 ms. A returns `0`; B returns no row; final stock is `0`.
  This verifies the narrowly stated one-row reservation outcome, not a complete
  concurrent checkout protocol or a performance claim.

The UI figures are labelled illustrative models. They do not contact a server.
The transaction model has one buyer, normal fresh reads at each step and an
explicit rollback on failure. It does not simulate locks, snapshots spanning
several reads, a connection drop during commit, crash durability or payment.
No crash, failover, restore, real payment or production load test was performed.

## Targeted rendering and compilation

Astro compiler 2.13.1 transformed the staged article and both component files
without diagnostics. Root promoted the staged fragment to its reserved source
path for review. The article rendered successfully at
`http://127.0.0.1:4337/review/relational-next/`.

Browser checks exercised query Next/grouping and the LEFT JOIN assumption;
transaction intermediate visibility, rollback and successful commit; Reset;
and Play. Inspected figure layouts in light and dark themes. Controls expose
native button/select semantics; current step, unavailable Back/Next states and
updated narrative are represented; no animation starts automatically. Both
figures provide a complete static text alternative. Narrow layouts have a
single-column breakpoint; a narrow-viewport screenshot remains part of the
orchestrator-managed independent browser review.

The worker did not run the shared full build; the orchestrator owns that check.
