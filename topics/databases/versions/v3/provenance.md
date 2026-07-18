## Sources

- [PostgreSQL: Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) — accessed 2026-07-16 — supports: Read Committed as the Postgres default, Repeatable Read as snapshot isolation preventing phantoms, SSI's predicate-lock mechanics, and serialization failures (SQLSTATE 40001) requiring application retry.
- [Hermitage: testing transaction isolation levels](https://github.com/ept/hermitage) — accessed 2026-07-16 — supports: isolation-level names diverging across engines, Oracle's SERIALIZABLE behaving as snapshot isolation, and weak isolation defaults across major databases.
- [PostgreSQL: Log-Shipping Standby Servers](https://www.postgresql.org/docs/current/warm-standby.html) — accessed 2026-07-16 — supports: asynchronous streaming replication as the default with typically sub-second lag, synchronous commit waiting at least one network round trip, quorum commit forms, and the asynchronous data-loss window.
- [PostgreSQL 18 Release Notes](https://www.postgresql.org/docs/18/release-18.html) — accessed 2026-07-16 — supports: the asynchronous I/O subsystem, B-tree skip scan, and native UUIDv7 shipping in PostgreSQL 18 (September 2025).
- [Consistency Tradeoffs in Modern Distributed Database System Design — Daniel J. Abadi](https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf) — accessed 2026-07-16 — supports: the PACELC formulation, CAP constraining only behaviour under partitions, replication forcing a latency/consistency trade in normal operation, and the cited findings that an extra 100 ms of latency measurably drives customers away.
- [Please stop calling databases CP or AP — Martin Kleppmann](https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html) — accessed 2026-07-16 — supports: CAP's formal definitions being narrow enough that most real systems are neither CP nor AP.
- [What Goes Around Comes Around... And Around — Stonebraker & Pavlo, SIGMOD Record 2024](https://db.cs.cmu.edu/papers/2024/whatgoesaround-sigmodrec2024.pdf) — accessed 2026-07-16 — supports: the cyclical data-model history (IMS, CODASYL, relational, object, XML, NoSQL, vector), NoSQL's convergence back toward SQL and ACID, and vector databases being absorbed as an index type rather than replacing relational systems.
- [Designing Data-Intensive Applications, 2nd edition — Kleppmann & Riccomini](https://martin.kleppmann.com/2026/03/24/designing-data-intensive-applications-2e.html) — accessed 2026-07-16 — supports: the benchmark's current edition (2026) and its continued coverage of storage, replication, partitioning, and transactions.
- ["One Size Fits All": An Idea Whose Time Has Come and Gone — Stonebraker & Çetintemel](https://cs.brown.edu/~ugur/fits_all.pdf) — accessed 2026-07-09 — supports: the 2005 case for specialised engines that the convergence section argues has partially reversed.
- [PostgreSQL Documentation](https://www.postgresql.org/docs/current/index.html) — accessed 2026-07-09 — supports: JSONB document storage, tsvector full-text search, native partitioning, and the extension mechanism as in-core Postgres capabilities.
- [pgvector](https://github.com/pgvector/pgvector) — accessed 2026-07-09 — supports: vector similarity search shipping as a Postgres extension.
- [DB-Engines Ranking](https://db-engines.com/en/ranking) — accessed 2026-07-09 — supports: Postgres's standing among the most widely deployed databases.

## Synthesis

- The stance itself: start on a general-purpose relational database, which in 2026 means Postgres, and leave it only when a measured access pattern forces the move; specialised engines are escape hatches, not starting points.
- A database is a data structure you rent over a network: every engine is a storage layout, an index structure, and a query surface fixed for one family of access patterns.
- Access-patterns-first selection: the measured workload is the only durable selection criterion; the data's conceptual shape, anticipated scale, and fashion all mislead.
- The worked examples are illustrative constructions, not case studies: the social-feed fan-out, the lost-update counter, the two-moderators write skew, the lagging-replica comment, and the celebrity hot key.
- Index economics: every index is a redundant ordered structure that accelerates some read and taxes every write, which is why indexes are purchases rather than free lunches.
- ACID's consistency is the application's property, riding on atomicity, isolation, and durability; B-tree writes being two writes (WAL plus page) and Bloom filters keeping LSM misses cheap are standard storage-engine mechanics stated from field knowledge.
- MySQL InnoDB's default isolation level is its Repeatable Read.
- Failover mechanics — dead-versus-slow timeouts, split brain, lost acknowledged writes on promotion — as the operational risk concentration of single-leader replication.
- Partitioning mechanics: range versus hash trade-offs, hot keys defeating hashing, local versus global secondary indexes, cross-partition transactions requiring two-phase commit, and the partition key's effective irreversibility on a live system.
- The convergence reading: feature sets converge through multi-model creep, Postgres extensions and core work, HTAP engines, and disaggregated storage, while storage-layer physics (row versus column, B-tree versus LSM, memory versus disk, synchronous versus asynchronous) do not, so the underlying trade-offs outlive the feature checklists.
- The operational-bill argument: the true cost of a second engine is its backup regime, upgrade cadence, on-call rotation, and cross-store consistency, not its licence or feature gaps.
- The named breaking points of the Postgres-first stance: genuine global write scale, sub-millisecond p99 cache workloads, and billion-scale heavily filtered vector recall.
- Wide-column stores (Cassandra) and columnar analytics engines (ClickHouse) share a name but solve opposite problems; conflating them is a recurring selection error.
- pgvector serves corpora into the tens of millions of vectors; dedicated vector engines earn their keep at hundreds of millions, heavy filtering, or strict tenant isolation.
- Aurora DSQL and CockroachDB as the GA distributed-Postgres line, carried from the 2026-07-14 research run.
- Voice-only rewrite (v3) under the staycurrent-style skill: sentence rhythm re-edited toward the publication's measured anchors; every claim, number, diagram, and section carried from v2 unchanged — no new research inputs examined.
