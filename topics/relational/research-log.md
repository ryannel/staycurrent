# PostgreSQL and MySQL — Research Log

## 2026-09-29 — cut v1

Founding run, cut the same day as the databases map. The brief was a single Postgres deep dive; mid-run the operator widened it to the relational family, so MySQL was added as a paragraph per section and SQLite as its own section.

Sources examined: the PostgreSQL 18 and 19 documentation and release notes read from the SGML sources in the postgres GitHub repository (`REL_18_STABLE` and `REL_19_STABLE`), the `postgresql.conf.sample` defaults, and the `proc.h`, `transam.h`, and `htup_details.h` headers; the PgBouncer, pgvector, Patroni, pgBackRest, Citus, wal2json, Debezium, gh-ost, XtraBackup, Litestream, libSQL, and Turso repositories; the Neon and Supabase documentation from their website repositories; the Vitess website repository's concept and reference pages; the MySQL server source tree on trunk (version file, `univ.i`, `sys_vars.cc`, `ha_innodb.cc`, `lock0lock.h`, `trx0purge.h`, `buf0dblwr.h`, the semisync, clone, and XCom sources); the SQLite source mirror (`VERSION`, `LICENSE.md`, `wal.c`, `main.c`, `pager.c`, `sqliteLimit.h`); and the archived awsdocs GitHub mirrors of the RDS and Aurora user guides.

Blocked in this environment and confirmed from indexed content instead: postgresql.org (all pages; the SGML sources were used in their place), dev.mysql.com, blogs.oracle.com, mariadb.org, sqlite.org, neon.com, supabase.com, planetscale.com, debezium.io, pgbackrest.org, docs.aws.amazon.com, aws.amazon.com, docs.cloud.google.com, and vitess.io. The web search budget ran out partway through the run, so the MySQL 9.7 date, the MariaDB 12.3 date, the SQLite 3.53.4 and 3.54.0 dates, the PlanetScale GA date, and the "up to 3x" claim rest on the notes gathered for the databases map earlier the same day.

Not sourced and said so in the text: node throughput figures for either engine; managed-tier prices; MySQL's `sync_binlog`, `gtid_mode`, and `innodb_doublewrite` defaults; InnoDB's column and secondary-index limits (from memory, flagged). The AWS mirrors are archived in 2023, so the Aurora figures quoted from them (15 replicas, the failover and Global Database wording, the `max_connections` formula) may lag the live documentation.

No lab measurements were run for this version.
