# Technical sources and execution

Primary PostgreSQL18 documentation checked externally on 26 October2026:
- https://www.postgresql.org/docs/18/textsearch-controls.html — constructors, weights/rank/headlines. Normalised phrase qualification and XSS warning checked specifically.
- https://www.postgresql.org/docs/18/textsearch-tables.html — explicit configuration in expression index, stored generated vector.
- https://www.postgresql.org/docs/18/textsearch-indexes.html — GIN lexeme keys/weight rechecks.
- https://www.postgresql.org/docs/18/datatype-textsearch.html — casts assume already prepared lexemes.
- https://www.postgresql.org/docs/18/functions-textsearch.html — operators and input-diagnostic functions.
- https://www.postgresql.org/docs/18/textsearch-features.html — positional concatenation, trailing stop-word caveat, stripped vectors, querytree T.
- https://www.postgresql.org/docs/18/textsearch-debugging.html — ts_debug and empty lexeme array.
- https://www.postgresql.org/docs/18/textsearch-dictionaries.html — stop words, mapping, file caching and ALTER dictionary reload.
- https://www.postgresql.org/docs/18/ddl-generated-columns.html — stored on writes, immutable/current-row restriction.
- https://www.postgresql.org/docs/18/pgtrgm.html — character similarity and pattern indexes.

Owned PGlite: @electric-sql/pglite0.5.8, actual PostgreSQL18.3/WASM. evidence/pglite-verifier.mjs imports supplied node_modules into a new disposable instance, executes native-verifier.sql, retains pglite-results.json and closes the instance in finally. No installation or default/user database connection. All assertions passed.

Owned native: coordinator created networking-none PostgreSQL18.6 disposable server, ran bounded script with explicit same-session identity guards and ON_ERROR_STOP, retained native-execution.json/native-fixture.json/native-executed-verifier.sql/native-results.txt and removed fixture. All assertions passed. Input image provenance is in input/native-runtime.json. Verifier hash dac59f42f5d55691ef29ecde44f1e64263b60ec3835bcf353ab5c2919f9ef3f1. Native settings expose GIN with enable_seqscan=off after a normal Seq Scan. No latency/throughput claims. Text preparation/ranking/normalisation/headline/maintenance outputs agree with PGlite.

Reader download is independent of the native fixture: public/relational-rebuild/pg-text/catalogue-search.sql creates only temporary rows, includes examples and an early-limit counterexample, then rolls back. Executed from exact reader file by download-verifier.mjs, results retained in download-results.json; table removal confirmed before closing PGlite instance. Download does not promise native planner choice or demonstrate live configuration migration.
