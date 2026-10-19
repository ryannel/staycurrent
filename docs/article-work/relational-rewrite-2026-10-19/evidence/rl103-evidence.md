# RL103 evidence

Checked 19 October 2026.

## Reader decision and observed result

Locate request wait boundary → native root blocker → cancel-versus-transaction distinction → controlled queue drain → plan/storage alternatives → verify service.

Native A idle in transaction, B active/Lock/transactionid blocked by A. pg_cancel_backend true leaves B unresolved; A rollback lets B finish. Queue-release overload is an explicit model, not generated native load.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl103-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Product commands RL120; plans RL87; capacity RL102; unknown commits RL93.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL monitoring statistics](https://www.postgresql.org/docs/18/monitoring-stats.html) distinguishes session states and wait categories; [administrative functions](https://www.postgresql.org/docs/18/functions-admin.html) defines cancellation and blocking helpers.
- [PostgreSQL Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) explains execution, actual counts and the cost of measurement.
- [InnoDB performance schema integration](https://dev.mysql.com/doc/refman/8.4/en/innodb-performance-schema.html), [SQL Server dynamic management views](https://learn.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/system-dynamic-management-views?view=sql-server-ver17) and [SQLite WAL](https://sqlite.org/wal.html) are implementation-specific continuations for waits and resource work.
