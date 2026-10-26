# Technical sources

Checked 26 October 2026 against primary PostgreSQL 18 documentation. No secondary source was used for consequential engine claims.

| Primary source | Checked claims |
| --- | --- |
| https://www.postgresql.org/docs/18/explicit-locking.html | Table-lock conflicts, ordinary row lock versus plain SELECT, lock duration; SHARE versus SHARE UPDATE EXCLUSIVE. |
| https://www.postgresql.org/docs/18/runtime-config-client.html | statement_timeout scope, separate acquisition lock_timeout, migration-specific settings. |
| https://www.postgresql.org/docs/18/sql-altertable.html | Strong-lock metadata changes, non-volatile defaults, rewrite/copy requirements, PG18 named not-null NOT VALID/VALIDATE, CHECK/FK locks, unique index attachment, drop-column storage. |
| https://www.postgresql.org/docs/18/ddl-alter.html | Add versus later default, per-row volatile defaults, column/type changes. |
| https://www.postgresql.org/docs/18/mvcc-caveats.html | Rewrite old-snapshot caveat and prerequisite that target table was not already accessed. |
| https://www.postgresql.org/docs/18/transaction-iso.html | Read Committed target-row recheck; stronger isolation can require retry. |
| https://www.postgresql.org/docs/18/sql-update.html | Current-row assignments, RETURNING and UPDATE FROM. |
| https://www.postgresql.org/docs/18/datatype-numeric.html | numeric scale/range, exact arithmetic, NaN semantics and integer range. |
| https://www.postgresql.org/docs/18/sql-createindex.html | Ordinary/concurrent scans and waits, first readiness versus final validity, unique failure enforcement, IF NOT EXISTS, one concurrent build/table, transaction/partition limitations; fastupdate off does not flush pending entries. |
| https://www.postgresql.org/docs/18/catalog-pg-index.html | indisready/indisvalid/indislive meanings, definition versus usable query route. |
| https://www.postgresql.org/docs/18/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING | Actual phase strings, current-phase counters, writer/snapshot/readers waits. |
| https://www.postgresql.org/docs/18/sql-reindex.html | Locking ordinary rebuilds including planning reads, concurrent replacement/cleanup stages, ccnew/ccold meanings/numerical suffixes, invalid-index recovery. |
| https://www.postgresql.org/docs/18/sql-dropindex.html | Concurrent drop waits, one name, no transaction block/CASCADE/partitioned parent/constraint-owned index removal. |
| https://www.postgresql.org/docs/18/routine-reindex.html | Persistent partly full B-tree pages and useful rebuilding. |
| https://www.postgresql.org/docs/18/pgstattuple.html | pgstatindex and pgstatginindex outputs, privilege and non-instantaneous scan qualifications. |
| https://www.postgresql.org/docs/18/gin.html | Pending entries included in searches, deferred merge and foreground cleanup cost. |
| https://www.postgresql.org/docs/18/brin.html | Unsummarised ranges, vacuum/autosummarisation, absent versus over-broad summary, resummarisation. |
| https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-INDEX | GIN cleanup and BRIN range maintenance signatures. |

## Execution evidence and limits

- evidence/sql-verifier.mjs extracts and runs the 12 actual Sql listings from the authoring source, with an in-memory disposable PGlite instance. Runtime is PGlite0.5.8 / PostgreSQL18.3 WASM; closed in finally. It checks conversion/range/NaN, unsafe stale values, displayed batch and reconciliation, named constraint installation/validation, rejection of missing/stale/out-of-range values, exact index flags, GIN/BRIN SQL, fast versus later defaults, and Figure2’s independently stale population. sql-results.json retains results. PGlite does not establish multi-session server behaviour.
- Root executed native-verifier.mjs unchanged (hash575948512f77fbff84e1b4998b57eaaacb5016206f9ef4d404ac55480f433e67). Native PostgreSQL18.6 official image digest edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6, localhost-only51828, DB sc_pg_schema_change, nonsuperuser DB-owner sc_pg_schema_change_client. Every one of three sessions guarded its own connection’s DB/user/cluster/version/data_directory/system_identifier before mutation. Expected system identifier7700769124252225585. Root owns provision/lifecycle/cleanup; no authentication copied into author evidence.
- Native observed queue: holder160 → waiting change161 → later reader162. Change55P03 then transaction25P02 until rollback; later read completed before holder ended. Ordinary row update allowed plain SELECT. Unsafe stale assignment yielded22.00/2000; guarded worker waited and returned0 rows, leaving22.00/2200. Reconciliation0/0, named not-null/CHECK validation, CIC and REINDEX CONCURRENTLY succeeded. A unique build failed23505 on pre-existing duplicate1 and left ready=false/valid=false/live=true, then its leftover was removed.
- Native execution/results/exact executed copy/server tail and cleanup retained. Root reports fixture removed and generated authentication deleted. No native benchmark, duration promise, repeated production workload, later unique-enforcement failure, induced ccnew/ccold, B-tree compaction saving or GIN/BRIN backlog rate is claimed. Those illustrations explain documented mechanisms.
