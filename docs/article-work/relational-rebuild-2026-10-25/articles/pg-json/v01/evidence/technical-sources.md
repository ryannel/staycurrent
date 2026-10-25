# Technical sources · checked 26 October 2026

Primary PostgreSQL 18 documentation read through the web tool:

- https://www.postgresql.org/docs/18/datatype-json.html — representation,
  design, containment/existence, index classes, subscripting and representation
  limits. Explicitly checked jsonb_path_ops' missing empty-structure entries,
  equality-clause extraction and expression-index examples.
- https://www.postgresql.org/docs/18/functions-json.html — native operators,
  extraction NULL behaviour, construction/expansion, JSONPath forms and strict/
  lax structural adaptation, error suppression and jsonb_set's prior-path rule.
- https://www.postgresql.org/docs/18/ddl-constraints.html — true/unknown acceptance,
  NOT NULL and ordinary reference responsibilities.
- https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-EXPRESS-EVAL —
  evaluation order is not an unsafe-cast guard; aggregate ordering.
- https://www.postgresql.org/docs/18/functions-conditional.html — CASE branch
  evaluation. The guard here depends on each row's JSON type; it does not contain
  a constant failing expression subject to planning-time evaluation.
- https://www.postgresql.org/docs/18/arrays.html and
  https://www.postgresql.org/docs/18/rowtypes.html — homogeneous arrays, length
  declarations not enforced, composite field types without embedded constraints.
- https://www.postgresql.org/docs/18/indexes-expressional.html and
  https://www.postgresql.org/docs/18/indexes-types.html — expression matching,
  B-tree scalar range/order capability.
- https://www.postgresql.org/docs/18/storage-hot.html — index-referenced column
  and same-page space conditions; logical field edits do not imply narrow
  physical writes.
- https://www.postgresql.org/docs/18/explicit-locking.html — row locks remain
  the write boundary, rather than independent JSON-key locks.

Article citations are in its bottom source section. Recommendations about the
home of facts are reasoned from the shop contract and the supplied modelling
ownership, not benchmark conclusions.

Execution: `node evidence/verify-json.mjs`, owned in-memory PGlite imported from
the supplied node_modules. Actual result: PostgreSQL 18.3 (PGlite 0.5.8),
wasm32-unknown-emscripten. All 13 exact SQL panels execute; 61 recorded checks
include additional inputs, weak/strong constraint counterexamples, reference/
identity failures, predicate answers, JSONPath adaptation, expansion, conversion,
path creation, shallow concatenation and sequential replacement/member edits.
The instance closes in finally; source hashes and runtime/results are retained
in sql-results.json. An initial verifier assumption expected false for a strict
missing-member match; execution returned SQL NULL. Corrected the expectation;
the article promises suppression, not a false result. This is not native server,
concurrency, planner or performance evidence. No native fixture was needed.
