# Databases — Research Log

## 2026-07-24 — cut v4

Operator-initiated evidence run, not a cadence run: the question was whether claims currently argued from published sources change character when measured.
Experiments run for this cut on PostgreSQL 16.14 (postgres:16-alpine) in Docker on an arm64 Mac — a replication lab (one primary, two streaming standbys), a partitioning lab (2,400,000-row range-partitioned table beside an unpartitioned twin), and a re-run of the round-3 isolation harness against a fresh container.
Harness published with the article at topics/databases/evidence/ — drivers, immutable raw logs, environment records, and per-lab fact-notes naming what each lab does not establish.
Findings: the synchronous_commit ladder separates at two rungs not four (two disk flushes, on a topology with no real network); DETACH PARTITION 1.884-2.312 ms against DELETE 104.757-124.934 ms for identical row counts, with 208 MB unreturned after VACUUM against 157 MB freed by detach; and a vacuumed unpartitioned twin beating the partitioned table on a pruned one-month count, 564 buffers against 1,699.
Two mistakes caught and recorded rather than smoothed over: a first synchronous-replication benchmark measured nothing because ALTER SYSTEM silently failed inside an implicit transaction (preserved at evidence/r4-replication/raw/04a-sync-ladder-INVALID.log), and an unvacuumed twin initially flattered partitioning by roughly 119x on buffers.
Withdrawn: "a healthy follower typically under a second behind" — untestable in this lab and not left standing beside induced measurements.
Stance held at v4; what moved is the grounding, and the one surprising result argues for the existing verdict rather than against it.

## 2026-07-17 — cut v3

Operator-initiated voice run under the staycurrent-style skill (repo commit 9cd0d53), not a cadence run; no new field sources examined.
Inputs: the skill's three-iteration eval record and a per-section rhythm audit of the v2 article against the anchor measurements.
Re-edited sentences only: whole-article average fell 22 to 19 words per sentence, over-thirty share 20 to 11 percent, em-dash density 1.23 to 0.36 per hundred words; claims, numbers, diagrams, and structure unchanged.
Stance held at v3 by construction.

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
