# Technical sources

Checked25October2026, official PostgreSQL18 documentation:

- https://www.postgresql.org/docs/18/tutorial-transactions.html — atomic block, own writes, visibility and implicit single-statement transactions.
- https://www.postgresql.org/docs/18/transaction-iso.html — RC snapshots/guard recheck, RR write conflicts and stable view, serial equivalence and SSI aborts; PostgreSQL RR prevents phantoms.
- https://www.postgresql.org/docs/18/sql-set-transaction.html — first query/data modification establishes transaction snapshot; isolation must be set before it.
- https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html —40001, retry complete reads/decision/writes; retries may fail again.
- https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS —row locks affect competing writers/lockers and ordinarily last through transaction end.
- https://www.postgresql.org/docs/18/applevel-consistency.html —all relevant writers participate; RR locks cannot refresh a prior snapshot.
- https://www.postgresql.org/docs/18/ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS —CHECK limited to checked row, cannot safely enforce changing cross-row total.

Illustrations synthesize these rules with the invented shared shop data; concurrent evidence is recorded separately by coordinator. No latency or universal winner claims.
