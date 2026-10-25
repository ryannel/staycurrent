# Technical sources

Checked 25 October 2026, PostgreSQL 18 primary documentation, using the web tool. Consequential rules and their worked consequences:

- https://www.postgresql.org/docs/18/queries-table-expressions.html — inner join emits each matching pair; left join preserves missing left rows with null right columns; ON versus WHERE for outer joins; aliases and grouping.
- https://www.postgresql.org/docs/18/ddl-constraints.html — primary key unique/non-null, composite keys apply to the full combination, foreign key references do not make referencing columns unique.
- https://www.postgresql.org/docs/18/functions-subquery.html — correlated EXISTS produces presence/absence and does not multiply outer rows; SELECT 1 convention.
- https://www.postgresql.org/docs/18/functions-aggregate.html — SUM adds non-null input values. No general aggregation or count lesson claimed.
- https://www.postgresql.org/docs/18/functions-conditional.html — COALESCE returns first non-null argument. Missing payment summary versus null stored amount distinguished.
- https://www.postgresql.org/docs/18/queries-with.html — named query parts and possible folding; no claim that a CTE is necessarily materialised or executed first.
- https://www.postgresql.org/docs/18/sql-select.html — DISTINCT across selected row values, alias scope, WHERE truth and logical query interpretation.
- https://www.postgresql.org/docs/18/queries-union.html — union compatibility, ALL preserving duplicates, UNION/INTERSECT/EXCEPT membership semantics.
- https://www.postgresql.org/docs/18/queries-order.html — explicit ORDER BY required for dependable output order.

Figures use an invented, deterministic result model. They make no execution-plan, timing or physical-row-order claim.

Native verification script: `evidence/verify-native.py`; input `public/relational-rebuild/query-results/shop-queries.sql`; setup generated from shared figure model using `evidence/make-download.mjs`. A clean environment removes inherited PG settings; explicit socket, port, database/user and SHOW data_directory guard writes. The script stops and removes its owned cluster in finally.

Initial native attempts: installed initdb identifies itself as PostgreSQL 18.6 (Homebrew). Bootstrap failed before accepting connections because macOS exhausted shared-memory IDs (shmget 56 bytes). Explicit mmap settings did not avoid that bootstrap requirement. Failed clusters were removed by initdb; no default/user database used. Coordinator informed; native execution remains pending until the host limit is resolved or coordinator supplies an owned target.

Completed execution fallback: existing installed `@electric-sql/pglite` 0.5.8 supplied an owned, disposable in-memory PostgreSQL 18.3 instance. `evidence/verify-pglite.mjs` runs the exact downloadable file, then asserts results query by query from the same constants. `pglite-download-results.json` retains every exact-file result and actual version; `pglite-asserted-results.json` retains focused outcomes. Verified inner/line/outer/ON/WHERE row counts; EXISTS and NOT EXISTS; raw combinations and erroneous totals; correct all/filtered balances; all four set operations; equal-line counterexample; missing-COALESCE counterexample; partial-payment report and no-payments distinction. Passed. The in-memory database is closed in finally. Article names PGlite/PostgreSQL 18.3 honestly, rather than implying the unavailable native 18.6 run succeeded. No timings or plans claimed.
