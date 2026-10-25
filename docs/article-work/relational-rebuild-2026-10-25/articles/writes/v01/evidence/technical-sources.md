# Primary technical sources · checked25October2026

All external sources were opened through the web tool and consequential passages inspected. No search-result snippet was treated as execution evidence.

- https://www.postgresql.org/docs/18/sql-update.html — assignment/expressions, WHERE, count includes unchanged assignments, zero is success, trigger caveat, UPDATE FROM multiple matches.
- https://www.postgresql.org/docs/18/sql-delete.html — deletes every eligible row, no WHERE broadens scope, returned deleted rows.
- https://www.postgresql.org/docs/18/dml-returning.html — returned values from changed rows.
- https://www.postgresql.org/docs/18/ddl-constraints.html — check violations and foreign-key reference actions.
- https://www.postgresql.org/docs/18/sql-insert.html — EXCLUDED, specified conflict target, independent errors, atomic upsert outcome, duplicate-source cardinality failure.
- https://www.postgresql.org/docs/18/sql-merge.html and https://www.postgresql.org/docs/18/transaction-iso.html — source/target matching versus unique conflict handling; MERGE’s concurrent duplicate insert can raise uniqueness violation. This concurrency claim is documented, not observed in PGlite.
- https://www.postgresql.org/docs/18/tutorial-transactions.html — BEGIN/COMMIT/ROLLBACK and all-or-nothing boundary.
- https://www.postgresql.org/docs/18/queries-with.html#QUERIES-WITH-MODIFYING — data-modifying CTE’s RETURNING output used by outer insertion.
- https://www.postgresql.org/docs/18/functions-comparison.html — IS DISTINCT FROM supports NULL-aware comparisons.
- https://www.postgresql.org/docs/18/sql-copy.html — server filesystem versus STDIN, loader count, text/CSV conversion error ignore, optional REJECT_LIMIT, malformed field structure and constraint limits.
- https://www.postgresql.org/docs/18/app-psql.html — frontend \copy reads through client filesystem permissions.
- https://www.postgresql.org/docs/18/populate.html — COPY transport overhead and transaction batching cost.
- https://www.postgresql.org/docs/18/functions-info.html#FUNCTIONS-INFO-VALIDITY — pg_input_is_valid’s validity check and soft-error limitation. Only built-in numeric(8,2) is used and the concrete malformed/overflow/NaN/extra-scale cases were executed.

Execution: `node evidence/verify-sql.mjs` imports the supplied @electric-sql/pglite0.5.8 from workspace node_modules, creates independent owned in-memory instances and closes each in finally. Runtime reports PostgreSQL18.3 on wasm32-unknown-emscripten. Full actual results and exact source SHA256 values are in sql-results.json. The verifier writes then reads and executes the exact downloadable SQL. No native server, default database, client/server COPY or concurrency observation is claimed. No timing or throughput measurement is presented.
