# RL102 evidence

Checked 19 October 2026.

## Reader decision and observed result

Occupied connection arithmetic → fleet pool budget → measured hot-record concurrency → bounded deadline queue → storage/replica/recovery headroom.

Native intentionally 10ms-held hot row at 1/4/12 clients. Functional workload with five transactions per client, not sizing benchmark. Deterministic queue and retention calculations labelled as assumptions.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl102-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Incident branching RL103; sharding hot key RL105; retention RL92/RL97.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL connection settings](https://www.postgresql.org/docs/18/runtime-config-connection.html) defines connection ceilings and reserved slots; [resource consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html) describes memory budgets beyond shared buffers.
- [PostgreSQL monitoring statistics](https://www.postgresql.org/docs/18/monitoring-stats.html) separates activity and waits needed to interpret active sessions.
- [InnoDB architecture](https://dev.mysql.com/doc/refman/8.4/en/innodb-architecture.html), [SQL Server thread and task architecture](https://learn.microsoft.com/en-us/sql/relational-databases/thread-and-task-architecture-guide?view=sql-server-ver17) and [SQLite isolation](https://sqlite.org/isolation.html) supply the different execution boundaries.
- [Diagnosing a database incident](/review/relational/rl103/) applies these distinctions when the budget is already exceeded.
