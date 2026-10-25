# Technical sources and execution

Primary-source verification (PostgreSQL18 documentation, accessed during this25Oct2026 commission):
- https://www.postgresql.org/docs/18/indexes-types.html — six methods, operator/type-dependent capabilities.
- https://www.postgresql.org/docs/18/indexes-opclass.html — per-column classes, families/cross-type operators, pattern comparison and C locale.
- https://www.postgresql.org/docs/18/indexes-ordering.html — ordered B-tree output and LIMIT.
- https://www.postgresql.org/docs/18/hash-index.html —32-bit stored hashes, equality rechecks, one column/no uniqueness, bucket growth and overflow.
- https://www.postgresql.org/docs/18/gin.html — key/posting representation, array_ops operators, pending-list work and cleanup.
- https://raw.githubusercontent.com/postgres/postgres/REL_18_STABLE/src/backend/access/gin/ginarrayproc.c — containment/overlap can be exact, equality/contained-by require original arrays.
- https://www.postgresql.org/docs/18/functions-array.html — array equality, containment and overlap semantics.
- https://www.postgresql.org/docs/18/gist.html and https://www.postgresql.org/docs/18/spgist.html — frameworks, pruning and built-in point/range/distance operator support.
- https://www.postgresql.org/docs/18/rangetypes.html — half-open bounds, range indexing versus exclusion integrity.
- https://www.postgresql.org/docs/18/brin.html and https://raw.githubusercontent.com/postgres/postgres/REL_18_STABLE/src/backend/access/brin/README — summaries, bitmap pages, physical correlation, pages_per_range, unsummarised ranges and upkeep.
- https://www.postgresql.org/docs/18/using-explain.html and https://www.postgresql.org/docs/18/indexes-bitmap-scans.html — node output, rechecks/filters/bitmap work, ordering and counters.
- https://raw.githubusercontent.com/postgres/postgres/REL_18_STABLE/src/backend/nodes/tidbitmap.c — independent exact-location/recheck flag versus lossy page locations under memory limits.
- https://www.postgresql.org/docs/18/indexes-index-only-scans.html — methods/classes retaining original values and separate visibility requirement.
- https://www.postgresql.org/docs/18/storage-hot.html — referenced columns and same-page space, BRIN summary exception.
- https://www.postgresql.org/docs/18/sql-createindex.html — method/class syntax and immutable expressions.

Initial attempted subsection URLs for some18manual chapters returned404; used actual consolidated chapter URLs above. No claims rely on404s or secondary sources.

PGlite: evidence/pglite-check.mjs uses installed @electric-sql/pglite0.5.8, observed PostgreSQL18.3/WASM, new in-memory disposable instance closed in finally. Tag containment/equality and half-open range results asserted; exact output in pglite-results.json. This is SQL semantic evidence, not native server evidence.

Native: coordinator executed exact guarded native-verifier.sql and native-bitmap-verifier.sql, observed Linux/aarch64 PostgreSQL18.6 official image digest as recorded in native*-fixture.json. Each script asserts database/user/cluster/version/data_directory/empty listen_addresses before DDL, creates a unique owned sc_ schema in a single transaction, and rolls back. Coordinator additionally guards the exact owned container/socket and removes it/authentication material. Actual commands/hashes/resources/cleanup are in native*-execution.json. No existing/default DB was contacted.

Attempt01 failed safely before schema creation due PostgreSQL's reserved pg_ prefix. Exact failed script/output retained under native-attempt-01. Corrected successful script uses sc_indexes_probe. No later observation is attributed to the failed attempt.

Observed limits: narrow-row B-tree bitmap remained765exact/0lossy at both64kB and4MB. Focused constant512-byte padded copy produced811exact/7761lossy at64kB,8572exact/0lossy at4MB; both70360same IDs. Default Btree/hash history ordered-result equivalence explicitly true in focused check. BRIN sorted/mixed329IDs equivalent. Mechanical tiny-table and BRIN routes discourage sequential scans; history and ICU prefix use normal scan settings. No performance timings/production ranking claimed. Initial GIN write tests do not include pending-list cleanup.

Article/public files quote only selected counters; full JSON rows, exact SQL including generated fixture/settings/guards are supplied in public/relational-rebuild/pg-indexes. Those are recorded verifiers with strict named-fixture guards, not an app DB recipe. Exact verifier/public byte identity and hashes checked at delivery.
