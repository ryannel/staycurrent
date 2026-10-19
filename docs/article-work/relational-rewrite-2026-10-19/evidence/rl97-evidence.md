# RL97 evidence

Checked 19 October 2026.

## Reader decision and observed result

Receive, durable receipt and apply → native lagged read → causal routing → policy contrasts → retained-log capacity.

Native paused standby receives through captured primary token but has not applied it and sees one marker. Replay barrier then fresh statement sees both.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl97-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Promotion authority RL98; distributed snapshot RL107; PostgreSQL physical replication RL117.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL log-shipping standby servers](https://www.postgresql.org/docs/18/warm-standby.html) defines physical replication and synchronous waits; [recovery functions](https://www.postgresql.org/docs/18/functions-admin.html) defines receive/replay positions and pause controls.
- [MySQL semisynchronous replication](https://dev.mysql.com/doc/refman/8.4/en/replication-semisync.html) specifies its acknowledgement point and timeout transition.
- [SQL Server availability modes](https://learn.microsoft.com/en-us/sql/database-engine/availability-groups/windows/availability-modes-always-on-availability-groups?view=sql-server-ver17) distinguishes hardening and redo under synchronous and asynchronous commit.
- [SQLite WAL](https://sqlite.org/wal.html) is local journalling, useful for distinguishing a local WAL reader from a network replica.
- [PostgreSQL physical replicas and promotion](/review/relational/rl117/) develops that implementation's native operation.
