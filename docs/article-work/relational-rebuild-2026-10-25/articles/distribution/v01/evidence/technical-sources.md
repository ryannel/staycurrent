# Technical sources · checked 25 October 2026

- https://raft.github.io/raft.pdf — extended Raft paper, sections2,5.2–5.4 and8. Checked leader order, durable majority, application/reply, crash/non-Byzantine assumptions, log/election restrictions, older-term commitment and current-read authority. The article uses a conceptual fixed-membership schedule; no Raft implementation was run.
- https://etcd.io/docs/v3.6/faq/ — majority/failure tolerance and network/region consequences. Did not copy its overbroad claim that odd counts always leave an available majority under arbitrary partitions; our cases specify the connected voters and qualify progress.
- https://etcd.io/docs/v3.6/learning/api_guarantees/ — durable completed operations and current versus permitted stale reads; etcd explicitly identified as key-value, not portable SQL behaviour.
- https://docs.citusdata.com/en/stable/sharding/data_modeling.html — common distribution key and compatible co-location, skew, distributed partial aggregation, joins crossing placement. General reasoning derived through the shop; no Citus-specific SQL advertised.
- https://www.cockroachlabs.com/docs/stable/architecture/distribution-layer — ranges, routing and index/table locations.
- https://www.cockroachlabs.com/docs/stable/architecture/replication-layer — per-range replicated agreement, catch-up, leader/follower roles and placement; native leases remain implementation-owned.
- https://www.cockroachlabs.com/docs/stable/architecture/transaction-layer — separate cross-range atomic transaction machinery and safe history reads. No native setting, timing or outcome claimed.

SQL evidence: verify.mjs extracts the exact displayed UPDATE from current article source. Owned in-memory PGlite0.5.8/PostgreSQL18.3 WASM, closed in finally; no default/existing database target, native server or installation. Minimal projection fixture checks price/stock and line-value arithmetic, a generated-count expression, and the composite-key counterexample with23505 on an exact duplicate. It is not a distributed engine, Raft test, or recreation of the full generated report workload. Results and source hashes: sql-results.json.
