# Sources checked 24 October 2026

- https://www.postgresql.org/docs/18/transaction-iso.html — Read Committed snapshots/update recheck, Repeatable Read snapshot establishment and concurrent update error, write-skew/serializable distinction, names versus standard minimums, SSI and retry. Relevant text inspected through web tool, with bounded line reads.
- https://www.postgresql.org/docs/18/tutorial-transactions.html — atomicity, uncommitted visibility, explicit/implicit transaction blocks, savepoint and failed-transaction boundary.
- https://www.postgresql.org/docs/18/sql-begin.html — explicit isolation syntax, autocommit and connection transaction boundary.
- https://www.postgresql.org/docs/18/mvcc-intro.html — row-version snapshot view and ordinary readers versus writers.
- https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS — same-row writer coordination, row locks, snapshot interactions.
- https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html — SQLSTATE40001, full transaction/decision retry, potential multiple retries.
- https://www.postgresql.org/docs/18/ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS — row CHECK scope, limits on referring to other rows.

The native transcript supplies observed outcomes rather than inferring a specific victim or failure statement from documentation alone. No text is quoted verbatim in the article.
