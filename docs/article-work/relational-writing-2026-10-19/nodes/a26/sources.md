# a26 source and evidence ledger

Checked 20 October 2026. Assigned expertise target: relational engineering practice, not planner implementation. Read the three original reference articles in full, including their figure descriptions and source listings, and the actual a05, a24 and a25 family articles. The five figures use native Astro; no shared components or routes were edited.

## Primary contracts

- PostgreSQL 18 [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html): physical dependency tree, consumer demand, scan and join methods, repeated-node averages, sort/hash diagnostics, inclusive reporting and early termination. Version 18 examples show decimal actual-row averages. Row-removal averages retain whole-number rounding. No parallel node occurs in the captures, so worker conventions are not extrapolated.
- PostgreSQL 18 [EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html): ANALYZE executes; buffer reporting defaults on with ANALYZE in 18; TIMING OFF retains overall execution time; instrumentation overhead; EXPLAIN does not transmit result rows, and ordinary output does not measure application or network latency. Shared read does not establish physical device I/O; dirtied/written and temp block categories kept separate. Optional I/O timing is discussed, not enabled or measured.
- PostgreSQL 18 [Planner statistics](https://www.postgresql.org/docs/18/planner-stats.html): approximate relation estimates, scaling against physical size, per-column summaries, statistics-target trade-offs, supported constant equality/IN dependency forms and their limits. [pg_stats](https://www.postgresql.org/docs/18/view-pg-stats.html): null_frac, sign of n_distinct, common values/frequencies, histogram of non-common values and value/physical-order correlation.
- PostgreSQL 18 [ANALYZE](https://www.postgresql.org/docs/18/sql-analyze.html): targeted collection, sampling and costs. [CREATE STATISTICS](https://www.postgresql.org/docs/18/sql-createstatistics.html): defining interest is separate from collecting data; dependencies/MCV can address appropriate same-table combinations; no cross-table join-selectivity correction in this version. No CREATE STATISTICS remedy was measured or prescribed for this report.
- PostgreSQL 18 [PREPARE](https://www.postgresql.org/docs/18/sql-prepare.html) and [plan_cache_mode](https://www.postgresql.org/docs/18/runtime-config-query.html#GUC-PLAN-CACHE-MODE): first five custom executions, cost-based generic comparison afterwards, session lifetime and invalidation/replanning triggers. Forced modes are diagnostic comparisons only and reset. No fixed sixth-execution switch is claimed.
- [node-postgres queries](https://node-postgres.com/features/queries#prepared-statements): named query objects prepare per connection. The actual worksheet uses pg 8.23.1 Client.query({name,text,values}) on retained physical connections and observes pg_prepared_statements counters.

## Reproduction and capture

`evidence/verify.mjs` is portable: Node >=22, `npm install --ignore-scripts pg@8.23.1`, PG_URL with CREATEDB on a disposable server. Optional PG_DRIVER accepts an installed pg module URL. It creates a unique database, retains raw-results.json beside itself, closes sessions and drops only that database. The article imports it with `?url&no-inline` and describes its dependencies and defaults explicitly.

Observed run: `rel3_a26_run1792454190401`, native PostgreSQL 18.6 Homebrew, aarch64, role staycurrent, 127.0.0.1:57319. `raw-results.json` reports verified=true and cleaned=true. There was no shared restart, configuration change, global statistics reset, checkpoint or cache flush. Execution used the separately installed pinned pg driver. Analysis, benchmark, correctness and cleanup all completed.

Server/capture settings: block size8192; shared_buffers32MB; work_mem4MB; default_statistics_target100; UTC; max_parallel_workers_per_gather0; jitoff; track_io_timingoff; session statement_timeout15s, lock_timeout2s. Automatic vacuum/analysis disabled only on the three owned fixture tables, which were removed with the database. No global planner control was retained.

Main fixture: 10,000 customers, ten orders/customer, three lines/order. Nullable text region/country; integer identities; date order boundary; quantity integer non-null; unit_price numeric(10,2), nullable. Existing customer PK, order PK and customer index, line composite PK(order_id,line_no). Region initially north10/island10/south9980. Statistics collected; customers11–8000 then changed to north/countryN without recollection. The before statistics report north0.001, reltuples10000, relpages55; current data north8000/island10/south1990. Updated physical heap98 pages. After targeted ANALYZE, north0.8, reltuples10000, relpages98.

Raw captures use EXPLAIN ANALYZE/BUFFERS/SETTINGS JSON with per-node timing off, plus separate before_timed and after_timed with timing on. Named SQL PREPARE/EXECUTE used for explicit mode comparisons, plus the actual pg named-query path in auto mode.

| Observation | Before north | After north |
|---|---:|---:|
| Customer estimate / actual |18 /8000|8000 /8000|
| Order probe loops |8000|none (hash route)|
| Line probe loops |80000|none (hash route)|
| Qualifying joined lines |240000|240000|
| Groups |8000|8000|
| Timed top shared hits / reads |576098 /0|2550 /0|
| Timed temp read/written |0 /0|0 /0|
| Initial timing-off execution ms |144.217|96.493|
| Timed execution ms |146.311|94.374|

Initial untimed before capture had575839 shared hits plus259 reads, the same total576098 accesses. Cache state matters; use warm timed captures for like buffer category comparison. Do not treat their elapsed durations as stable ratios. Before HashAggregate one batch, peak3369kB, disk0; final top-N25kB. After hashes one batch, order hash4931kB and customer hash346kB; aggregate3345kB, no disk. The 4MB work_mem setting is not a total query-memory limit; default hash_mem_multiplier applies.

Actual before inner line node: estimated rows3 width13, startup/total cost0.42/0.60, actual startup/total0.001/0.001ms, rows3 loops80000, searches80000, shared hits480000. Containing join total119.164ms includes order subtree29.764ms. Rounded timings must not be presented as exact exclusive CPU work.

Rare island after custom: ten customers, ten order probes,100 line probes,300 contributions,10 groups,818 shared hits; execution0.512ms/planning0.167ms. Generic island: customer estimate3333, actual10, scans and hashes,2550hits; execution16.225/planning0.106ms. Common generic execution66.287/planning0.171ms; common custom96.493/planning0.185ms. The differing join orders and isolated timing cannot establish a stable generic/common advantage.

Actual named application path after collection: eight alternating north/island executions, all custom; final counters custom8/generic0. Every mixed-workload connection in all phases recorded custom10/generic0. Generic regression is a tested possibility, not the supported symptom cause. No cache-mode workaround remains.

Separate bounded same-table equality observation after fresh stats: regionisland AND countryI estimates1 and emits10. Each marginal frequency0.001. Model multiplication0.01 does not claim PostgreSQL reports fractional output below its floor. This demonstrates dependency distinct from stale statistics; it is not another full investigation.

Correctness fixture: multiple orders, duplicate-valued lines with separate line numbers, ignored null contribution and all-null group, null region, no order, earlier date and excluded end boundary, ties. Result exactly [{customer_id:1,spent:'20.00'},{customer_id:2,spent:'20.00'},{customer_id:3,spent:null}]. Large common/rare ordered results equal before/after and across forced modes. No rewrite performed.

## Acceptance boundary

Three before and three after trials, each two concurrent closed-loop clients with60operations each:16north,4island,80lookups,20revisionupdates. Same sequence, named preparation and SQL/indexes; no errors; all120completed each run. Client includes protocol/driver/decoding, not HTTP or pool wait. North per-trial p95 is its sample maximum (16samples); four rare samples cannot establish a tail. No sustained demand/capacity, CPU, device-I/O, WAL-rate or maintenance-cycle comparison.

Before north p95 ms167.449–185.866; after80.807–82.583. Before lookup p95 .272–.303; after .236–.277. Before change p95 .630–.700; after .596–.715. Island maxima before1.738–4.062, after1.692–2.194. Completedops/s before86.99–93.65; after184.79–189.36. Analysis client time3.314ms on10k rows. Improvement accepted for the bounded fixture; production deployment remains subject to a05's representative acceptance method.

## Models and review

Five figures simplify captured dependencies, counts, plan choices and trial ranges. Figure2 early-stopped input is explicitly illustrative (1000possible rows vs10requested); selectivity multiplication in prose is explicitly not the PostgreSQL estimator. Each plotted pair has matching units. Back/Next are focus-preserving aria-disabled clamped controls; timer uses every visible word in the figure at190wpm plus700ms, minimum8s. Pause occurs when entirely offscreen or document hidden. Tall partially visible figures continue. Closed disclosure text is available as a complete transcript; opening it recalculates the hold. Dynamic row and bar styles use :global within the component's scoped root.

Only own compiler/model/link/whitespace checks run. Independent rendered desktop/phone and interaction review belongs to the orchestrator's snapshot; no shared build or final route was written by this worker.
