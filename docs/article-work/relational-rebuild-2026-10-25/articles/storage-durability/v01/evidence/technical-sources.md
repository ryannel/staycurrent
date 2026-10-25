# Technical sources checked25October2026

PostgreSQL18 primary manuals opened:
- storage-page-layout.html: page arrays, fixed usual8kB, headers, row pointers and page LSN.
- storage-toast.html: wide-value compression/out-of-line storage.
- storage-hot.html: new row versions; HOT conditions, ordinary-index exception for summarising indexes.
- runtime-config-resource.html: shared buffers, OS cache and background writer.
- mvcc-intro.html + transaction-iso.html: MVCC and first snapshot-taking statement at Repeatable Read.
- routine-vacuuming.html: required versions, reuse, trailing-page exception, VACUUM FULL rewrite/exclusive lock/space.
- wal-intro.html: write-ahead ordering, redo, page writes after commit and group flush.
- wal-internals.html: LSN as byte position and progress.
- wal-reliability.html: volatile OS/controller/drive caches and storage contract.
- wal-configuration.html + runtime-config-wal.html: checkpoint redo boundary, retained WAL, full-page protection and flush safeguards.
- wal-async-commit.html: recent acknowledged loss with consistency, dependent later transaction cannot survive missing prerequisite commit.
- continuous-archiving.html: base+WAL chain, target recovery.

MySQL8.4 innodb-index-types.html + innodb-multi-versioning.html: clustered table, secondary keys, undo reconstruction and purge. innodb-recovery.html: redo/rollback distinction.

CockroachDB stable architecture/storage-layer: immutable SST files and compaction. Only brief engine-family contrast used, no settings or native observations.

PostgreSQL source REL_18_STABLE heapam_xlog.c and xlogutils.c opened: redo's physical buffer work, page-LSN/progress tests. No direct quotations.

Exact public manual URLs are in article sources. A requested incremental-backup URL returned404; it supplies no claim and is not cited.

Observations: ordinary SQL only in PGlite0.5.8/PostgreSQL18.3WASM, exact version/result/script retained. No native server, concurrency, timing, filesystem or crash claim; all selected physical schedules are labelled models. No native fixture needed for these claims.
