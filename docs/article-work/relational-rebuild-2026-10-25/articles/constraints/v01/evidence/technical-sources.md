# Technical sources and execution

Primary sources checked25 October2026, all PostgreSQL18 documentation:

- https://www.postgresql.org/docs/18/ddl-constraints.html — CHECK false/unknown, non-null and primary keys, foreign keys/MATCH, reference actions, cross-row CHECK limitation and exclusion.
- https://www.postgresql.org/docs/18/sql-createtable.html — exact declaration grammar, composite target uniqueness, referential actions and deferral qualifications.
- https://www.postgresql.org/docs/18/indexes-unique.html — default distinct NULLs and NULLS NOT DISTINCT.
- https://www.postgresql.org/docs/18/indexes-partial.html — selected-row uniqueness.
- https://www.postgresql.org/docs/18/ddl-identity-columns.html — sequence generation does not itself enforce uniqueness.
- https://www.postgresql.org/docs/18/rangetypes.html — range construction, bounds, overlap/exclusion.
- https://www.postgresql.org/docs/18/btree-gist.html — GiST equality for text alongside range exclusion.
- https://www.postgresql.org/docs/18/sql-set-constraints.html — deferred/immediate timing, eligible constraint kinds, NOT NULL/CHECK and non-deferrable uniqueness timing.
- https://www.postgresql.org/docs/18/trigger-definition.html — trigger execution and row old/new behaviour.
- https://www.postgresql.org/docs/18/transaction-iso.html — ordinary Read Committed snapshots and serializable execution/retries.
- https://www.postgresql.org/docs/18/explicit-locking.html — conflicting row-lock coordination. The payment example is an inference from these visibility and locking rules, not a measured schedule.
- https://www.postgresql.org/docs/18/sql-altertable.html — NOT VALID new-write enforcement and existing-data validation.
- https://www.postgresql.org/docs/18/errcodes-appendix.html — structured SQLSTATE/object details versus message text.

`verify-sql.mjs` imports the supplied installed @electric-sql/pglite0.5.8 and btree_gist. Each run creates a fresh owned in-memory instance, records SELECT version(), extracts literal article SQL blocks where executable, records SQL/state/error names and closes the instance in finally. `sql-results.json` retains54 records including runtime and article-source hash. All expected accepts/rejections passed. The initial verifier attempt encountered old partial-NULL rows when switching MATCH FULL; the verifier was corrected to truncate that independent comparison table before adding the new constraint. This was a verification setup issue, consistent with the rule being illustrated.

Runtime: PostgreSQL18.3 (PGlite0.5.8) on wasm32-unknown-emscripten. No existing/default/native database, inherited client connection or native initdb was used. No native concurrency test was attempted. No timings or performance measurements are claimed. No reader download is promised.

`verify-model.mjs` checks37 interactive model states, their outcomes and the final40.00>29.00 counterexample; output is `model-results.txt`. Engine tests include protections plus visible missing-protection counterexamples (no NOT NULL, no CHECK, no key with generated IDs, no reference, separate tenant references, no exclusion), positive and invalid quantity updates, optional NULL uniqueness, deferred success/failure, referential actions and NOT VALID validation.
