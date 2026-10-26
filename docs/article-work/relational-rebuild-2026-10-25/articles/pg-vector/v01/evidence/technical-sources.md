# Primary-source check · 26 October 2026

Version-pinned pgvector0.8.7:
- https://github.com/pgvector/pgvector/blob/v0.8.7/README.md — operators/classes, NULL/zero omissions, ANN dimensionality limits, iterative scans, relaxed materialised-CTE outer ORDER BY distance+0, settings and maintenance. Also read raw text and relevant lines475–717 via web.
- https://raw.githubusercontent.com/pgvector/pgvector/v0.8.7/src/vector.c — CheckDims/CheckExpectedDim/CheckElement, float storage and L2/cosine/negative inner-product arithmetic.
- https://raw.githubusercontent.com/pgvector/pgvector/v0.8.7/src/hnsw.c — ef_search user setting; iterative off/strict/relaxed; max_scan_tuples approximate, excludes initial scan; scan memory multiplier.
- https://raw.githubusercontent.com/pgvector/pgvector/v0.8.7/src/hnswscan.c — sparse upper-layer search then ground-layer candidate-list exploration; discarded candidates support iterative continuation; strict ordering does not establish exact recall.
- https://raw.githubusercontent.com/pgvector/pgvector/v0.8.7/src/hnswbuild.c — memory and on-disk graph build phases, maintenance_work_mem.
- https://raw.githubusercontent.com/pgvector/pgvector/v0.8.7/src/ivfflat.c — lists/probes settings, relaxed-only iteration, max_probes.
- https://raw.githubusercontent.com/pgvector/pgvector/v0.8.7/src/ivfbuild.c — sample population, clustering/assignment.
- https://raw.githubusercontent.com/pgvector/pgvector/v0.8.7/src/ivfscan.c — compare centres, visit probe lists, point distances.
- https://arxiv.org/abs/1603.09320 — original HNSW paper, nested graph layers and candidate exploration. Abstract read; scan implementation supplies concrete mechanics, drawing is our deliberately chosen graph, not reproduced experimental paper data.

PostgreSQL18:
- https://www.postgresql.org/docs/18/indexes-partial.html — planning-time implication and many partial indexes.
- https://www.postgresql.org/docs/18/using-explain.html — actual execution, instrumentation overhead and buffers.
- https://www.postgresql.org/docs/18/queries-with.html — MATERIALIZED boundary.

Fixture observations and script are separate evidence. No source says these invented coordinates are learned embeddings or useful product rankings. No application service/embedding model was measured. Live schema changes and extension installation/restore remain neighbouring ownership. SQL example parameter values illustrate syntax; three products do not warrant an ANN index.
