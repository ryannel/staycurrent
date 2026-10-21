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

## Added in the r01 repairs (21 October 2026)

| Claim | Source | Status |
| --- | --- | --- |
| InnoDB's Repeatable Read snapshot applies to reads, not necessarily to UPDATE and DELETE, which can change rows committed after the snapshot; so Figure 4's read-then-write sale oversells there without an error | https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html | Fetched; the oversell on InnoDB is inferred from the documented rule, not run |
| ALTER TABLE takes ACCESS EXCLUSIVE unless a form says otherwise; SET NOT NULL scans the table unless a valid CHECK proves no NULL | https://www.postgresql.org/docs/18/sql-altertable.html | Fetched; observed: AccessExclusiveLock held by both the expand and contract statements inside a transaction, and a plain SELECT on orders waited until COMMIT |
| Only ACCESS EXCLUSIVE blocks a plain SELECT; row locks block only writers of the same row | https://www.postgresql.org/docs/18/explicit-locking.html | Fetched |
| Under synchronous replication a commit waits for the standby, and its transaction locks are held until then | https://www.postgresql.org/docs/18/warm-standby.html | Fetched; used only as a test device. Observed: a COMMIT held by a standby that never connects (wait event SyncRep) is invisible to a lookup; terminating it reports that the transaction was already committed locally |
| An insert-first repeat waits for an attempt in flight and fails with 23505 once it commits; a claim-first repeat waits and gets UPDATE 0 | — | Observed, three concurrent psql sessions |
| A lost reply after COMMIT: a lookup finds 103, an insert-first repeat gets 23505; before COMMIT: lookup 0 rows, the full repeat commits | — | Observed |
| The waiting `stock = stock - 1` update meets CHECK (stock >= 0) and is refused with 23514 | — | Observed, two concurrent sessions |
| The left-join query keeps an order with no lines (order 105) with 0.00; inner joins drop it; before coalesce, order 103's paid and due are NULL | https://www.postgresql.org/docs/18/queries-table-expressions.html, https://www.postgresql.org/docs/18/functions-conditional.html | Observed |
| Plan lines, estimates, bitmap index and heap scans, buffer counts that include child nodes | https://www.postgresql.org/docs/18/using-explain.html, https://www.postgresql.org/docs/18/planner-stats.html | Observed: every printed plan line matched the real EXPLAIN (ANALYZE, BUFFERS) output after normalising costs and widths; heap scan 3 pages = index 2 + table 1 |

## Added in the r02 repairs (21 October 2026)

| Claim | Source | Status |
| --- | --- | --- |
| Serializable guarantees the same effect as running the transactions one at a time in some order | https://www.postgresql.org/docs/18/transaction-iso.html | Fetched 21 Oct 2026 |
| Repeatable Read sees a snapshot taken at the first non-transaction-control statement, and refuses a write to a row changed after it (40001, retry the whole transaction) | same page | Fetched; the 40001 refusal observed in r01's Repeatable Read case, still run by verify |
| A statement wanting ACCESS EXCLUSIVE on `orders` waits for an open transaction that has read `orders`, and a later plain lookup of order 103 queues behind it | https://www.postgresql.org/docs/18/explicit-locking.html, https://www.postgresql.org/docs/18/sql-altertable.html | Observed: report session `BEGIN; SELECT … FROM orders` left open; the expand and a later lookup both showed wait event `Lock/relation` in `pg_stat_activity`; both completed when the report committed |
| `lock_timeout` aborts a statement that waits longer than the limit to acquire a lock | https://www.postgresql.org/docs/18/runtime-config-client.html | Fetched; observed: with the report open again and `SET lock_timeout = '1s'`, the contract failed with `55P03: canceling statement due to lock timeout`, the queued lookup then succeeded while the report stayed idle in transaction, and a retry after the report committed succeeded |
| `DROP NOT NULL` after the contract stage lets old code's inserts work again | https://www.postgresql.org/docs/18/sql-altertable.html | Observed: old-style insert of order 107 succeeded after `ALTER TABLE orders ALTER COLUMN delivery_country DROP NOT NULL` |
| Figure 4: order 102's two blue mugs are shown, and after the read-then-write race orders 103 and 104 both hold the last mug | — | Observed: verify compares every P7 order line in the database, including (102, 2), with the lines the figure shows, and the verdict with the orders holding the last mug |
| CockroachDB: a write commits once a majority of replicas agree (Raft) | https://docs.cockroachlabs.com/docs/stable/architecture/replication-layer | Fetched 21 Oct 2026 |
| CockroachDB: surviving the loss of a region adds write latency of at least the round trip to the nearest other region | https://docs.cockroachlabs.com/docs/stable/multiregion-survival-goals | Fetched 21 Oct 2026; the article says only that cross-region agreement slows writes |
