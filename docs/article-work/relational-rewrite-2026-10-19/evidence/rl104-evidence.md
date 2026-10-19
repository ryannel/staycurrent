# RL104 evidence

Checked 19 October 2026.

## Reader decision and observed result

Task-derived identities → exact statement grants → trusted tenant context → native denied operations → privileged-code/transport/backup scope.

Separate LOGIN runtime connection sees t4 only under local t4 policy. Cross-tenant INSERT, ALTER, TRUNCATE and SET ROLE migrator all 42501. Administrator sees both. Trust auth on isolated socket tests privilege only.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl104-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

PostgreSQL policy/privileged code RL121; tenant-key constraint home RL79. Session setting freely changeable by arbitrary SQL is explicitly not a hostile-app tenant boundary.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL privileges](https://www.postgresql.org/docs/18/ddl-priv.html), [role membership](https://www.postgresql.org/docs/18/role-membership.html) and [row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) define the native example's boundaries and bypasses.
- [MySQL roles](https://dev.mysql.com/doc/refman/8.4/en/roles.html) and [stored-object access control](https://dev.mysql.com/doc/refman/8.4/en/stored-objects-security.html) describe its different grant and execution contexts.
- [SQL Server row-level security](https://learn.microsoft.com/en-us/sql/relational-databases/security/row-level-security?view=sql-server-ver17) supplies its policy model and security considerations.
- [SQLite security](https://sqlite.org/security.html) explains the embedded application's responsibilities and defensive controls.
