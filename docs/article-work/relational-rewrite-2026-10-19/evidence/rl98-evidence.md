# RL98 evidence

Checked 19 October 2026.

## Reader decision and observed result

Partition detection uncertainty → exclusion and history selection → native process fence → promotion → divergent old node rewind → client recovery.

Native stopped standby misses acknowledged old_primary_only. Confirmed primary stop prevents cached COMMIT. Promoted node lacks old-only history, accepts new_primary; pg_rewind rejoin reports recovery and refuses INSERT 25006.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl98-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

Replica stages RL97; identities RL93; PostgreSQL promotion RL117. No automatic controller or network-partition test claimed.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL failover](https://www.postgresql.org/docs/18/warm-standby-failover.html) explicitly discusses avoiding two primaries and external failure handling; [pg_rewind](https://www.postgresql.org/docs/18/app-pgrewind.html) specifies rejoin prerequisites and limitations.
- [MySQL Group Replication](https://dev.mysql.com/doc/refman/8.4/en/group-replication.html) is a different authority mechanism from manually promoted asynchronous replication.
- [SQL Server availability modes](https://learn.microsoft.com/en-us/sql/database-engine/availability-groups/windows/availability-modes-always-on-availability-groups?view=sql-server-ver17) explains synchronised and potentially lossy failover conditions.
- [PostgreSQL physical replicas and promotion](/review/relational/rl117/) provides the implementation continuation.
