# Technical sources, checked25October2026

Primary PostgreSQL18 documentation read via web.open:

- https://www.postgresql.org/docs/18/executor.html — demand-pull operators and blocking full sort.
- https://www.postgresql.org/docs/18/planner-optimizer.html — scan paths, physical nested/hash/merge joins and join-order alternatives.
- https://www.postgresql.org/docs/18/using-explain.html — estimates versus output/scan work, loop units, partial consumption, inclusive costs/counters.
- https://www.postgresql.org/docs/18/sql-explain.html — actual execution/side effects, buffer and temporary-work counters, profiling overhead.
- https://www.postgresql.org/docs/18/planner-stats.html — approximate statistics, skew and correlation assumptions.
- https://www.postgresql.org/docs/18/ddl-partitioning.html — partition pieces/pruning without server distribution.
- https://www.postgresql.org/docs/18/indexes-ordering.html — sorted index access, broad scan tradeoff, ORDER BY/LIMIT.
- https://www.postgresql.org/docs/18/runtime-config-resource.html — work_mem per-operation allowance, hash/sort temporary work and concurrency multiplication.
- https://www.postgresql.org/docs/18/parallel-plans.html — parallel division, duplicated hash builds, partial/final aggregation.
- https://www.postgresql.org/docs/18/parallel-query.html — scope and limits of parallel execution.

Native measurements: root inspected and executed evidence/native-verify.mjs against its owned LinuxPostgreSQL18.6 official-container fixture. Client pg8.23.1; image digest supplied in input/native-verification.md sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6. Dynamic credential config never read/printed/copied by writer. Explicit targetconfig and database/user/version/cluster/data_directory checked; only successfully created schema dropped, clientclosed even if cleanupfails. Actualidentity/settings/plans retained in native-results.json; rootowns container lifecycle.

Ordinary comparison is6alternating runs/form after correctness+profile collection, warm local cache, no concurrent load. Client timings include rowtransfer; profiled executiontimes exclude clientpath and are a separate measurement. No forcedmethod/settings, no demonstratedspill, no production/disk/cluster/distributedperformance inference. Commoncustomerregression precludes blanketacceptance.

Core SQL/download verification independently uses PGlite0.5.8 actualPostgreSQL18.3/WASM, an owned in-memory instance closed in finally. Includes exact downloaded queryfile, coreexpectedresult, empty-orderedge and missingguardcounterexample. It supplies no native timingclaim.
