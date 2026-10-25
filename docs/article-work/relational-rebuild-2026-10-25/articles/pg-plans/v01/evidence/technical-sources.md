# Primary-source verification

Checked25 October2026 using web tool; article lists linked sources. PostgreSQL18 docs:

- using-explain.html: rows emitted, cost units/startup/full run, actual averages, inclusive timings, early stopping, Index Searches total, rejection/recheck fields and non-distinct buffer accesses.
- sql-explain.html: ANALYZE effects, TIMING OFF, SETTINGS scope, default18 buffers, shared/local/temp definitions, dirty/write counters, I/O timing, SERIALIZE conversion/network boundary.
- sql-analyze.html, planner-stats.html, view-pg-stats.html: sampling, column targets, common values/histograms/n_distinct, dependency equality restriction (not ranges).
- sql-createstatistics.html and multivariate-statistics-examples.html: MCV/dependencies/ndistinct meaning, collection after creation, no current join-selectivity application.
- indexes-multicolumn.html and indexes-index-only-scans.html: bounding versus trailing index conditions, heap visibility and covering values.
- runtime-config-query.html: Memoize/Materialize, planner switches discourage methods, generic/custom plan setting.
- runtime-config-resource.html: work_mem per operation, hash_mem_multiplier, concurrent/parallel demand.
- how-parallel-query-works.html and parallel-plans.html: leader participation, launched versus planned workers, partial/final aggregation, ordinary vs parallel hash build, duplicated merge inner input.
- sql-prepare.html and view-pg-prepared-statements.html: session lifetime/counters, first-five custom and estimated-cost heuristic, generic parameter symbols, invalidation.
- PostgreSQL REL_18_STABLE src/backend/commands/explain.c, verified via primary raw source: IndexOnlyScan Heap Fetches prints ntuples2 without loop division; show_instrumentation_count divides nfiltered by nloops. This supports their different units.

Native observed evidence: native-verifier.sql, native-results.txt, native-execution.json and native-fixture.json. Root inspected and ran latest script on owned networknone PostgreSQL18.6 with strict same-session ownership/runtime guard, bounded execution and rollback; fixture removed. Exact execution hash retained by root. Defaults otherwise inherited from official isolated fixture; node timing disabled and parallelism0/jitoff for serial cases; sorting64kB/32MB; parallel demonstration explicitly lowers thresholds/setup and tuple costs. No ordinary performance repetitions or concurrent workload test claimed.

WASM ordinary SQL evidence: pglite-verifier.mjs and pglite-results.json; @electric-sql/pglite0.5.8, actual PostgreSQL18.3/WASM. Disposable in-memory instance, private schema, closed in finally. Core counts/totals and semantic guard/equal-value counterexamples asserted. Not substituted for native plans.
