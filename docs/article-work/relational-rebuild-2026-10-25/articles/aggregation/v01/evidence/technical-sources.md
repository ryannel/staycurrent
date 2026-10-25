# Technical evidence

Checked25 October2026 against primary PostgreSQL18 manuals:

- https://www.postgresql.org/docs/18/queries-table-expressions.html#QUERIES-GROUP — group grain, selected columns, primary-key functional dependency, WHERE/HAVING, scalar grouping.
- https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-AGGREGATES — FILTER’s one-aggregate input, aggregate availability.
- https://www.postgresql.org/docs/18/functions-aggregate.html — COUNT variants; SUM/AVG non-null input and empty-input NULL.
- https://www.postgresql.org/docs/18/tutorial-window.html — windows keep row identities; input after WHERE/GROUP/HAVING; separate calculation/display ordering; outer-query filtering.
- https://www.postgresql.org/docs/18/functions-window.html — row_number/rank/dense_rank, peers, last_value frame, lag/lead default and PostgreSQL RESPECT NULLS.
- https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS — default RANGE frame, ROWS/GROUPS/RANGE offsets, single-expression bounded RANGE, ends of partition.
- https://www.postgresql.org/docs/18/queries-order.html — no promised display order without ORDER BY; tie breakers.
- https://www.postgresql.org/docs/18/functions-math.html — integer division truncates.
- https://www.postgresql.org/docs/18/sql-createview.html — view names a query, not physically materialised.
- https://www.postgresql.org/docs/18/functions-conditional.html — COALESCE returns first non-null argument.

Owned disposable execution: `node evidence/verify.mjs` imports supplied node_modules/@electric-sql/pglite0.5.8, starts `new PGlite()` without external connection settings or persisted data, queries version, loads temporary teaching rows, runs queries from the exact shared source, asserts results, rolls back and closes in finally. Report is evidence/sql-results.json. Runtime identifies PostgreSQL18.3/WASM32 on Emscripten3.1.74. No native PostgreSQL, native initdb attempt, other database, timing, plan or concurrency observation claimed.

Counterexamples: ungrouped order_id rejected42803; window in WHERE rejected42P20; rank plus product ID breaks business tie; WHERE paid removes pending contributions; scalar/grouped empty differences; preserved Edda row; integer1/3 truncates; default peer frame differs from ordered ROWS; bounded rows/peer groups/time range differ; last_value default differs from partition last; LAG crosses CURRENT ROW frame and preserves previous NULL; dense-rank top2 returns3 rows while row-number top2 returns2.
