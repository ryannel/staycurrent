# Evidence for How a query runs

Checked 15 October 2026 against PostgreSQL 18 documentation. The implementation observations use PostgreSQL 18.3 through PGlite 0.5.8, default planner settings except the explicitly labelled merge and memory experiments. Node verifier: `node docs/article-work/query-execution/verify.mjs` from the repository root.

## Reproducible observations

`setup.sql` creates an isolated generated shop in an empty database, with 10,000 orders for 1,000 customers and three lines per order. Product IDs and quantities are 1, 2 and 3. Customer 42 owns ten orders, spaced 1,000 order IDs apart. Customers 1–100 are north; the others are south. Both table cardinalities are small enough that the default statistics sample encompasses the rows; fixture contents contain no randomness.

`verify.mjs` extracts executable snippets directly from the article and asserts the important results and observed plan properties. It writes the downloadable `experiments.sql` and full `observed.json`. Successful run on 15 October 2026 checked:

- Natural narrow plan: bitmap index/table access to ten orders, nested-loop join with inner index scan returning three rows over ten loops; 30 joined rows, sorted GroupAggregate, three sorted answers. Two Sort nodes.
- Natural broad plan: two sequential scans, hash join emitting 30,000 rows, hashed aggregate with three groups, three sorted answers.
- Diagnostic merge plan: competing hash and nested-loop join methods discouraged locally inside a transaction. Merge join scans both primary-key indexes and produces the same broad result. It retains hashed aggregation and final sorting. This is observed forced diagnosis, not the natural plan or an endorsement of the settings.
- Correlated filter: customer 42/north estimates one row but emits ten. Dependency statistics plus ANALYZE changes the table-scan estimate to ten without changing data or access route.
- Spill: a 30,000-line detail sort at local work_mem 64kB uses external merge, reports Disk 544kB in the observed build and nonzero temporary blocks. No latency claim or physical disk benchmark.
- Both displayed diagnostic transaction blocks execute, and ROLLBACK restores local settings.

Plan excerpts on the page are abridgments: costs/widths and most detail removed, remaining operations and rows preserved. The one full estimated/actual index-scan entry is copied from the observed output. The paired flow diagram is an explanatory redraw of these observed plans, not a separate simulation. The merge figure shows the first two fixture orders with all six lines, preserving the one-to-many matching multiplicity.

The fixture demonstrates particular choices at its size/distribution. It does not establish crossover thresholds, production-memory settings, engine-wide latency rankings, parallel-query behaviour or disk performance. The three-row result itself is intentionally too small to spill; the memory example clearly changes to a detailed listing.

## Primary sources

| Source | Supports / next reading | Scope |
| --- | --- | --- |
| [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) | Operation trees; output vs scanned rows; startup/total cost; repeated-operation average; actual versus estimated rows | PostgreSQL 18; beginner-to-intermediate plan reading |
| [Planner and optimizer](https://www.postgresql.org/docs/18/planner-optimizer.html) | Candidate scans and joins; indexed nested loop, hash join, merge join | PostgreSQL 18; broader engine account behind observed alternatives |
| [Executor](https://www.postgresql.org/docs/18/executor.html) | Requesting the next row through a tree; some operations require preparation | PostgreSQL 18; accessible internals bridge |
| [Combining multiple indexes](https://www.postgresql.org/docs/18/indexes-bitmap-scans.html) | Bitmap location collection; table visits in physical order; index order lost | PostgreSQL 18; access-path detail |
| [ANALYZE](https://www.postgresql.org/docs/18/sql-analyze.html) | Statistics collection, sampling, refresh; approximate distributions | PostgreSQL 18; interpreting evidence freshness |
| [Planner statistics](https://www.postgresql.org/docs/18/planner-stats.html) | Cardinality information and extended statistics; dependency limits | PostgreSQL 18; same-table equality dependency example only |
| [Row estimation examples](https://www.postgresql.org/docs/18/row-estimation-examples.html) | Translating frequencies/distributions into cardinality, independence assumptions | PostgreSQL 18; deeper arithmetic after this page |
| [Multivariate statistics examples](https://www.postgresql.org/docs/18/multivariate-statistics-examples.html) | Dependency statistics repair correlated filters; distinct-count statistics affect group estimates | PostgreSQL 18; source supports mechanism, article fixture independently reproduced |
| [Resource consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html#GUC-WORK-MEM) | Per-operation work_mem, hash multiplier, temporary storage, concurrency implications | PostgreSQL 18; no production tuning prescription |
| [EXPLAIN reference](https://www.postgresql.org/docs/18/sql-explain.html) | ANALYZE executes statement; timing and buffer options; sort memory/disk output | PostgreSQL 18; exact field definitions |

## Author verification and remaining review

The verifier passed against the displayed SQL. The page uses two static, theme-token-based HTML figures and established scrollable SQL/result components. No new interactive control or browser simulation was introduced. Root coordinator owns the final build, desktop/phone and light/dark browser inspection, and independent technical/editorial plus uncued sequential reading. Until those reviews and any repairs complete, this is an implemented draft awaiting review, not a ready or published article.

## Coordinated review

The [batch review and verification record](../access-and-persistence/review.md)
records the independent readings, repairs, browser checks and final draft status.
The author-handoff notes above describe the earlier state before those checks.
