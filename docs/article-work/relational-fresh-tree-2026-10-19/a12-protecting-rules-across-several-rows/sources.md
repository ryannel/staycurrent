# Planning sources

Checked 19 October 2026. This is a breakdown, not a claim of native execution.
The article writer must execute and record its proposed SQL histories.

- [PostgreSQL 18 transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html): statement and transaction snapshots, locking-read behaviour, serialisable dependency detection and whole-transaction restart.
- [PostgreSQL 18 explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html): row-lock scope, transaction lock lifetime, deadlock order and advisory-lock participation.
- [PostgreSQL 18 constraints](https://www.postgresql.org/docs/18/ddl-constraints.html): local CHECK scope, non-null requirements, foreign keys and uniqueness. A cross-table aggregate equality requires a maintained protocol, not a local CHECK assertion.

The lower-bound example needs care: positive insertion alone cannot violate a non-negative reserve sum. The breakdown therefore uses reservation versus deletion for the new anomaly, and insertion for membership participation and counter maintenance. It does not claim all-contributor locking is generically impossible for this monotone rule.
