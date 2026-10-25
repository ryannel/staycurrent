# Technical sources

Primary sources opened with web tools on 25 October 2026; article links point to the source pages.

- Danilo Sato, Parallel Change, https://martinfowler.com/bliki/ParallelChange.html : expand/migrate/contract and staged consumer changes.
- PostgreSQL 18 Transaction Isolation, https://www.postgresql.org/docs/18/transaction-iso.html : Read Committed update waiting and condition re-evaluation, and higher-level retry qualification.
- PostgreSQL 18 UPDATE, https://www.postgresql.org/docs/18/sql-update.html : source-row expressions, conditional updates and RETURNING.
- PostgreSQL 18 Numeric Types, https://www.postgresql.org/docs/18/datatype-numeric.html : exact numeric multiplication, numeric(8,2) range, integer range, NaN ordering and coercion.
- PostgreSQL 18 Comparison Functions and Operators, https://www.postgresql.org/docs/18/functions-comparison.html : IS DISTINCT FROM includes the one-null case.
- PostgreSQL 18 ALTER TABLE, https://www.postgresql.org/docs/18/sql-altertable.html : required-value changes, native constraint validation and physical-operation qualifications.
- PostgreSQL 18 CREATE INDEX, https://www.postgresql.org/docs/18/sql-createindex.html : concurrent-build invalid remnants and usability.
- CockroachDB Online Schema Changes, https://docs.cockroachlabs.com/docs/stable/online-schema-changes : background jobs, resource consumption and continuing work after SQL statement cancellation. No CockroachDB observations claimed.

The general convergence argument is derived from the explicit example protocol: all required rows agree at a snapshot and every admitted writer preserves the relation. No source is being treated as proof that arbitrary dual writes converge.

# Execution evidence

Run `node evidence/verify-sql.mjs` in the assigned workspace. One owned disposable PGlite instance, closed in finally. PostgreSQL version returned 18.3 (PGlite 0.5.8), wasm32-unknown-emscripten. Four literal displayed SQL snippets extracted from the final article source, with source hash in sql-results.json. Ten assertions cover protected/unprotected source ordering, repeated safe work, late bridge and prohibited old-only arrival, rollback coverage, finite conversion/range, NaN rejection and old NOT NULL insert preparation. Results are sequential committed SQL orderings, not native concurrent sessions, latency, lock waits or physical migration benchmarks.
