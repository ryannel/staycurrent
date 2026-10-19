# Planning evidence

Checked primary documentation on 19 October 2026. This is a breakdown, not an executed engine experiment. Drawings and numerical work ledgers are to be labelled illustrative; writing must verify version-specific commands and counters against the chosen build.

- [PostgreSQL 18 page layout](https://www.postgresql.org/docs/18/storage-page-layout.html): fixed-size heap pages, slots, record headers and table-access-method caveat support the bounded page model.
- [PostgreSQL 18 TOAST](https://www.postgresql.org/docs/18/storage-toast.html): compression and out-of-line chunks; unchanged out-of-line values can be preserved by updates. Avoid claiming all updates rewrite large values.
- [PostgreSQL 18 routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html): retained versions, reuse versus file shrink, visibility map, freeze and wraparound duties. Statistics maintenance and visibility-map upkeep must not be conflated with physical removal.
- [PostgreSQL 18 WAL](https://www.postgresql.org/docs/18/wal-intro.html): durable log-before-data ordering and redo.
- [PostgreSQL 18 bulk population](https://www.postgresql.org/docs/18/populate.html): COPY, transaction and index choices and tightly bounded WAL-reduction conditions, including consequences for recovery and replication.
- [InnoDB 8.4 multiversioning](https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html): retained undo information, rollback and consistent-read needs, purge.
- [InnoDB 8.4 undo logs](https://dev.mysql.com/doc/refman/8.4/en/innodb-undo-logs.html): rollback and reconstruction of previous versions; temporary-table undo has different logging responsibilities.
- [InnoDB 8.4 purge](https://dev.mysql.com/doc/refman/8.4/en/innodb-purge-configuration.html): physical removal after retained information is no longer needed, background processing.
- [InnoDB 8.4 buffer pool](https://dev.mysql.com/doc/refman/8.4/en/innodb-buffer-pool.html): cached pages, read-ahead, dirty-page flushing and monitoring.
- [SQL Server index architecture](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide?view=sql-server-ver17): heap and clustered rowstore contrast; compressed column segments, delta rowgroups and deferred maintenance. Used for physical contrast only; not an index-design tutorial.

## Boundaries and economy

Keep this as one article with seven main headings. The single update-to-cleanup-to-recovery thread supplies coherence; additional vendor tutorials would increase navigation without a separate reader decision. The columnstore contrast needs sufficient physical explanation here because execution consumes it; batching, vectorisation and skipping remain with execution. No child stubs are proposed until reviews establish an independent learning need.
