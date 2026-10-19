# RL95 evidence

Checked 19 October 2026.

## Reader decision and observed result

Dirty memory fails → log ordering and durable acknowledgement → lost reply → group commit → checkpoints/torn pages → durability domain.

Native fsync on/synchronous_commit on, immediate process shutdown, recovery log and surviving acknowledged row. Reuses actual house storage media through preview slots.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl95-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

PostgreSQL WAL RL115; recovery RL96; replica acknowledgement RL97.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL WAL](https://www.postgresql.org/docs/18/wal-intro.html), [reliability](https://www.postgresql.org/docs/18/wal-reliability.html) and [asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html) define the ordering and acknowledgement contract.
- [InnoDB redo log](https://dev.mysql.com/doc/refman/8.4/en/innodb-redo-log.html) and [InnoDB recovery](https://dev.mysql.com/doc/refman/8.4/en/innodb-recovery.html) explain redo and undo; [binary logging options](https://dev.mysql.com/doc/refman/8.4/en/replication-options-binary-log.html) covers the additional log.
- [SQL Server transaction durability](https://learn.microsoft.com/en-us/sql/relational-databases/logs/control-transaction-durability?view=sql-server-ver17) explains delayed acknowledgement guarantees.
- [SQLite atomic commit](https://www.sqlite.org/atomiccommit.html) and [WAL](https://sqlite.org/wal.html) explain its two write paths and storage assumptions.
- [PostgreSQL WAL, checkpoints and recovery](/review/relational/rl115/) develops that engine's settings, observations and recovery budget.
