# RL100 evidence

Checked 19 October 2026.

## Reader decision and observed result

Compatible expansion → bounded schema wait → conditional batches → smaller late key and skipped-lock trap → maintained writes and validated complete population → rollback boundary.

Native ALTER 55P03 behind reader, then succeeds. Cursor >20 misses late ID5. Locked missing row makes SKIP LOCKED empty; next batch repairs it. Trigger maintains later edit/ID3; zero disagreements and validated CHECK.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl100-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Exact PostgreSQL DDL RL119; privileges RL104; resource budgets RL102.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html) specifies locks, rewrites and separate constraint validation.
- [InnoDB online DDL operations](https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl-operations.html) lists algorithm and concurrency differences by operation.
- [SQL Server online index operations](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/perform-index-operations-online?view=sql-server-ver17) gives their limits and locking considerations.
- [SQLite ALTER TABLE](https://sqlite.org/lang_altertable.html) includes the supported direct changes and generalised rebuild procedure.
