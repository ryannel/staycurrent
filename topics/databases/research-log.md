# Databases — Research Log

## 2026-07-16 — cut v2

Operator-initiated editorial run against the Designing Data-Intensive Applications bar, not a cadence run.
Examined: PostgreSQL transaction-isolation and streaming-replication documentation, PostgreSQL 18 release notes, Kleppmann's Hermitage suite and CP/AP critique, Abadi's PACELC paper (re-read), Stonebraker and Pavlo's 2024 "What Goes Around Comes Around... And Around", and DDIA's second-edition publication record.
Added transactions/isolation, replication, partitioning, and the data-model pendulum; folded PG18 async I/O and skip scan into convergence — the 2026-07-14 carry-forward is closed.
Stance held at v2; audit trims were formula repetition, not sections.

## 2026-07-14 — no-cut

Reviewed PostgreSQL 18 (async I/O, skip scan), 2026 pgvector scaling benchmarks, and distributed-Postgres GA (Aurora DSQL, CockroachDB) — all confirm the Postgres-first stance and its named breaking points; none moves the position.
Carry-forward for the next substantive cut: fold PG18's async I/O into the convergence section as a concrete data point (the v1 article does not yet name PG18).

## 2026-07-09 — cut v1

Founding survey across the six engine families: relational, document, key-value, wide-column/columnar, vector, and graph.
Primary references examined: Kleppmann's Designing Data-Intensive Applications, Stonebraker and Çetintemel's "One Size Fits All" critique, Abadi's PACELC paper, the PostgreSQL documentation, and the DB-Engines ranking.
Convergence evidence gathered from multi-model feature releases and the Postgres extension ecosystem (pgvector, PostGIS, TimescaleDB, Citus).
Founded the topic at v1 with the Postgres-first stance; no prior version to hold against.
