## Sources

- [Designing Data-Intensive Applications — Martin Kleppmann](https://dataintensive.net/) — accessed 2026-07-09 — supports: the B-tree versus LSM-tree storage-engine trade-off, the OLTP/OLAP workload split, and row versus column storage layouts.
- ["One Size Fits All": An Idea Whose Time Has Come and Gone — Stonebraker & Çetintemel](https://cs.brown.edu/~ugur/fits_all.pdf) — accessed 2026-07-09 — supports: the 2005 case for specialised engines that the convergence section argues has partially reversed.
- [Consistency Tradeoffs in Modern Distributed Database System Design — Daniel J. Abadi](https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf) — accessed 2026-07-09 — supports: the PACELC formulation and the claim that the latency/consistency trade governs normal operation while CAP binds only under partition.
- [PostgreSQL Documentation](https://www.postgresql.org/docs/current/index.html) — accessed 2026-07-09 — supports: JSONB document storage, tsvector full-text search, native partitioning, and the extension mechanism as in-core Postgres capabilities.
- [pgvector](https://github.com/pgvector/pgvector) — accessed 2026-07-09 — supports: vector similarity search shipping as a Postgres extension.
- [DB-Engines Ranking](https://db-engines.com/en/ranking) — accessed 2026-07-09 — supports: Postgres's standing among the most widely deployed databases.

## Synthesis

- The stance itself: start on a general-purpose relational database, which in 2026 means Postgres, and leave it only when a measured access pattern forces the move; specialised engines are escape hatches, not starting points.
- A database is a data structure you rent over a network: every engine is a storage layout, an index structure, and a query surface fixed for one family of access patterns.
- Access-patterns-first selection: the measured workload is the only durable selection criterion; the data's conceptual shape, anticipated scale, and fashion all mislead.
- The convergence reading: feature sets converge through multi-model creep, Postgres extensions, HTAP engines, and disaggregated storage, while storage-layer physics (row versus column, B-tree versus LSM, memory versus disk) do not, so the underlying trade-offs outlive the feature checklists.
- The operational-bill argument: the true cost of a second engine is its backup regime, upgrade cadence, on-call rotation, and cross-store consistency, not its licence or feature gaps.
- CAP/PACELC in practice: most consistency incidents in ordinary systems come from stale asynchronous replicas rather than partitions, and a single-region Postgres with one synchronous standby is a strongly consistent default.
- The named breaking points of the Postgres-first stance: genuine global write scale, sub-millisecond p99 cache workloads, and billion-scale heavily filtered vector recall.
- Wide-column stores (Cassandra) and columnar analytics engines (ClickHouse) share a name but solve opposite problems; conflating them is a recurring selection error.
- pgvector serves corpora into the tens of millions of vectors; dedicated vector engines earn their keep at hundreds of millions, heavy filtering, or strict tenant isolation.
