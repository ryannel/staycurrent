# Technical sources

Checked 25 October 2026 through the web tool, primary sources only:
- https://doi.org/10.1287/opre.9.3.383 — Little's original 1961 paper/abstract: finite stationary means and L = λW. Article uses stable completed throughput, consistent borrow episodes and mean elapsed hold. Does not infer sustainable demand from occupancy.
- https://www.postgresql.org/docs/18/runtime-config-connection.html — max_connections resources and role-based reserved connections. The model's ten operational slots are not asserted native reservations.
- https://www.postgresql.org/docs/18/runtime-config-resource.html — work_mem per operation, concurrent sessions, hash multiplier. No simple connections×work_mem memory claim.
- https://www.postgresql.org/docs/18/runtime-config-client.html — statement_timeout measured at server boundary, excluding upstream pool queue.
- https://www.postgresql.org/docs/18/explicit-locking.html — ACCESS SHARE ordinary read conflicts with ACCESS EXCLUSIVE; row locks do not block ordinary data querying. Figure 1's lock is explicitly table-wide; holder is outside its app pool.
- https://www.pgbouncer.org/features.html — session/transaction assignment; feature compatibility including session-level advisory locks and difference between protocol prepared statements and SQL PREPARE. No claim about a deployed PgBouncer configuration.
- https://sre.google/sre-book/handling-overload/ — unequal request resource costs, per-customer restrictions and reduced responses.
- https://sre.google/sre-book/addressing-cascading-failures/ — overload queues, expiry/deadlines, reduced-capacity service and retry amplification.
- https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ — attempt limits, backoff, jitter, one retry owner and recovery bursts. Redirects to AWS Builder Center; native article link kept.
- https://www.postgresql.org/docs/18/pgbench.html — scheduled --rate, schedule lag, skipped requests with latency limit; distinguishes generator scheduling from database-only execution.

The displayed query and its two-row result were executed by evidence/verify.mjs in one owned disposable in-memory PGlite 0.5.8 instance. Actual runtime: PostgreSQL 18.3 on wasm32-unknown-emscripten. Closed in finally on success/failure. Exact output and source hash: verification.json. No native server, timing, wait/concurrency experiment or workload-capacity measurement is claimed. No native fixture was needed for this read. Model arithmetic and every bounded/unbounded burst population were checked separately; the policies are conceptual schedules, not runnable production protection claims. There is no promised SQL download.
