# RL96 evidence

Checked 19 October 2026.

## Reader decision and observed result

Recovery contract → copy types → log chain → target excludes later good work → isolated restore acceptance → r82 reconciliation.

Native verified base, named restore point, accidental delete and later good order. Empty archive leads unreachable-target FATAL; good archive pauses at target with o81 only. Promotion + identical r82 import twice leaves o81 and o82 once.

## Reproduction

Run from repository root:

```sh
node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs
```

The script is the exact command/fixture record; `rl96-native-observed.json` records queries and results or model states. The native harness uses PostgreSQL 18.6 from `/opt/homebrew/opt/postgresql@18/bin/` and the existing pg driver under `/private/tmp/staycurrent-pg-lab/node_modules/pg/`. It creates a unique `/private/tmp/rl90-104-*` directory and private sockets on ports 56641–56644 plus protocol proxy 56649. It stops and removes only its own clusters in finally. Native execution requires local shared-memory permission unavailable inside the default sandbox; authorised escalated runs supplied it. The models need only Node and have no database, real network, physical clock or measured latency.

## Scope and neighbouring homes

PostgreSQL restore RL116; stable request identity RL93; new authority RL98. External acceptance is a supplied fixture, not a payment API observation.

No InnoDB, SQL Server, SQLite, Spanner or cloud failure was executed by this author. Consequential contrasts were checked in their primary documentation. Native scripts do not establish power-loss protection; the effect-authority drill is an actual SQL effect, not an external-provider test.

## Primary documentation and onward reading
- [PostgreSQL 18 continuous archiving and PITR](https://www.postgresql.org/docs/18/continuous-archiving.html) specifies the base/log relationship, targets and timelines; [pg_verifybackup](https://www.postgresql.org/docs/18/app-pgverifybackup.html) explains manifest verification's scope.
- [MySQL point-in-time recovery](https://dev.mysql.com/doc/refman/8.4/en/point-in-time-recovery.html) explains backup plus binary-log replay.
- [SQL Server backup and restore](https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases?view=sql-server-ver17) introduces recovery models and backup chains.
- [SQLite online backup API](https://sqlite.org/backup.html) supplies an engine-supported live copy rather than an unsafe file-copy assumption.
- [PostgreSQL backup, restore and PITR](/review/relational/rl116/) develops that implementation's operation and acceptance checks.
