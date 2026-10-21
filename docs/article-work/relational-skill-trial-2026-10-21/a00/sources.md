# a00 sources (skill trial 2, 21 October 2026)

Each claim below was checked against the listed primary source, either on 21 October 2026 or by an observed run of `verify.mjs`.

| Claim in the article | Source | How checked |
| --- | --- | --- |
| Read Committed: each statement sees data committed before it began; it is PostgreSQL's default | https://www.postgresql.org/docs/18/transaction-iso.html | Fetched 21 Oct 2026; also observed (Tariq read 1 while Mina's change was uncommitted) |
| A concurrent UPDATE waits for the first updater, then re-evaluates its WHERE clause against the updated row | same page | Fetched; observed (conditional update returned UPDATE 0 after Mina committed) |
| Repeatable Read raises "could not serialize access due to concurrent update"; the application should retry the whole transaction | same page | Fetched; observed (SQLSTATE 40001, retry read 0) |
| Read-then-write oversells under Read Committed, inside BEGIN and in autocommit | — | Observed, two concurrent psql sessions |
| MySQL InnoDB defaults to Repeatable Read | https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html | Fetched |
| SQL Server defaults to Read Committed, which uses locks unless READ_COMMITTED_SNAPSHOT is on (on by default in Azure SQL Database) | https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql | Fetched |
| SQLite transactions are serializable, with one writer at a time | https://www.sqlite.org/isolation.html | Fetched |
| Constraint errors and their SQLSTATEs (23514, 23503, 23505, 23502) | https://www.postgresql.org/docs/18/ddl-constraints.html, https://www.postgresql.org/docs/18/errcodes-appendix.html | Observed: messages and codes copied from runs |
| Row order is unspecified without ORDER BY | https://www.postgresql.org/docs/18/queries-order.html | Documentation |
| Join fan-out, inner join drops unmatched rows, left join keeps them, coalesce | https://www.postgresql.org/docs/18/queries-table-expressions.html, https://www.postgresql.org/docs/18/functions-conditional.html, https://www.postgresql.org/docs/18/functions-aggregate.html | Observed outputs |
| UPDATE ... RETURNING lists the changed rows | https://www.postgresql.org/docs/18/sql-update.html | Observed (UPDATE 2: 101 and 103) |
| A commit returns after its WAL record is flushed, under the default synchronous_commit; crash recovery replays the log | https://www.postgresql.org/docs/18/wal-intro.html, https://www.postgresql.org/docs/18/runtime-config-wal.html | Documentation; crash replay observed (immediate stop, restart) |
| Parameter values are sent separately from the command text | https://www.postgresql.org/docs/18/libpq-exec.html, https://node-postgres.com/features/queries | Documentation; the listing is illustrative |
| 8 kB pages, sequential scan against index scan, EXPLAIN ANALYZE output | https://www.postgresql.org/docs/18/storage-page-layout.html, https://www.postgresql.org/docs/18/using-explain.html, https://www.postgresql.org/docs/18/indexes-intro.html | Observed plans and page counts (scaled copy) |
| An index adds write-ahead log to inserts | — | Observed: 2,026,720 bytes against 2,729,840 bytes for 10,000 inserts |
| ADD COLUMN ... NOT NULL fails when existing rows have no value; SET NOT NULL checks existing rows | https://www.postgresql.org/docs/18/sql-altertable.html | Observed 23502 in each case |
| A restore from a base backup plus archived WAL to a target point brings back deleted rows and omits later ones | https://www.postgresql.org/docs/18/continuous-archiving.html | Observed with pg_basebackup, archive_command, restore_command and recovery_target_name |
| A replica applies the same committed changes as the writer | https://www.postgresql.org/docs/18/warm-standby.html | Documentation only; promotion not run |
| Roles limit what each connection may change | https://www.postgresql.org/docs/18/user-manag.html | Documentation |
| Origin of the relational model | Codd 1970, https://doi.org/10.1145/362384.362685 | Bibliographic |

The version observed was PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0. Commands are listed in `writer.md`.
