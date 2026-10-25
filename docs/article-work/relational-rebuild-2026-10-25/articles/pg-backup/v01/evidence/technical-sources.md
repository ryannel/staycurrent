# Technical sources · 26 October 2026

Primary PostgreSQL18 manual checked through web tools:
- https://www.postgresql.org/docs/18/continuous-archiving.html — archive command success/retry/overwrite contract; setup before base; whole-cluster scope; backup-end minimum; timeline history and tablespace replay caveat.
- https://www.postgresql.org/docs/18/app-pgbasebackup.html — replication connection, sender count, plain format and tablespace mapping, streamed WAL, incremental manifest.
- https://www.postgresql.org/docs/18/app-pgverifybackup.html — manifest/files/checksums/consistency-WAL checks, ignored files and later-WAL/test-restore limits, matching-major WAL parser.
- https://www.postgresql.org/docs/18/runtime-config-wal.html — restart-required archive settings, completed-segment delay/timeout, signal precedence, retrieval, all target forms, inclusive bounds, timeline current/latest, pause, later retry, resume finishes recovery, explicit unreached target fatal, WAL summaries.
- https://www.postgresql.org/docs/18/app-pgcombinebackup.html — oldest-first dependency chain and individual-backup integrity limit.
- https://www.postgresql.org/docs/18/functions-admin.html — source identity, named restore point, switch and pause/recovery functions.
- https://www.postgresql.org/docs/18/monitoring-stats.html — pg_stat_archiver progress/counters, limits supplemented by continuous-archiving failure notes.
- https://www.postgresql.org/docs/18/backup-dump.html — logical consistent view; fresh template0 DB; role/grant prerequisites; physical compatibility boundary.
- https://www.postgresql.org/docs/18/app-pgdump.html — single database/global distinction, custom archives.
- https://www.postgresql.org/docs/18/app-pgrestore.html — explicit DB destination; stop on error; single transaction vs parallel jobs; list/inspect.

Additional utility pages: https://www.postgresql.org/docs/18/app-pg-ctl.html (explicit target start/log/options) and https://www.postgresql.org/docs/18/app-pg-dumpall.html (globals-only). Some guessed separate target/incremental/pg_dumpall page URLs returned404; none retained as source. Target and incremental claims were checked on the above native WAL/continuous-archiving and utility pages. No secondary technical source is used.

Observed evidence separated: PGlite0.5.8 actual PostgreSQL18.3/WASM for seed/query/repair; native PG18.6 backup/archive/target/gap/logical restore only after coordinator execution. No real provider, production recovery rate, power-loss test or independent failure-domain archive test claimed.
