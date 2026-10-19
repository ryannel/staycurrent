# RL93 evidence

Checked 19 October 2026.

## Reader decision and observed result

Error evidence classification → real lost COMMIT completion → stable identity claim → payload-bound recovery and retention.

Native proxy intercepts and drops CommandComplete(COMMIT), caller disconnects, observer finds o81. Matching replay returns result; changed payload runs rejection branch.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl93-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Outbox and external effect RL94; restore/dedup history loss RL96.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL: Serialization failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html) gives the whole-transaction retry requirement for confirmed failures.
- [PostgreSQL INSERT](https://www.postgresql.org/docs/18/sql-insert.html) and [transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html) define the uniqueness claim and subsequent Read Committed lookup used here.
- [libpq connection and transaction status](https://www.postgresql.org/docs/18/libpq-status.html) gives a concrete driver contract for unknown transaction state.
- [InnoDB isolation levels](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html), [SQLite isolation](https://sqlite.org/isolation.html) and [SQL Server's concurrency guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide?view=sql-server-ver17) are the starting points for adapting the claim and lookup rather than assuming identical snapshots.
