# Native PostgreSQL verification runtime

Observed on 19 October 2026: **PostgreSQL 18.6 (Homebrew)**,
`server_version_num = 180006`, aarch64-apple-darwin25.6.0, Apple clang 21.0.0,
64-bit. The installed `postgres`, `initdb`, `pg_ctl` and `psql` all report 18.6;
their pinned binary directory is
`/opt/homebrew/Cellar/postgresql@18/18.6_1/bin`. Docker is installed but was not
used. This matches the browser PGlite 18.3 major version; record the actual
runtime and minor version for each observation rather than conflating the two.

The server is **running** in a newly initialised, disposable cluster:

- Cluster: `/private/tmp/staycurrent-relational-20261019.goQaIi/data`.
- TCP: `127.0.0.1:57319`, role `staycurrent`, no password.
- Unix socket: `/private/tmp/staycurrent-relational-20261019.goQaIi`.
- Smoke-test database: `rel3_runtime_check`.
- Server PID at handoff: `99513` (confirmed by elevated `pg_ctl status`).
- Connection: `postgresql://staycurrent@127.0.0.1:57319/rel3_runtime_check`.
- Log: `/private/tmp/staycurrent-relational-20261019.goQaIi/server.log`.

No existing cluster, database or container was changed. The cluster directory is
owned by the current OS user, `ryannel`, with mode 0700. It listens only on IPv4
loopback; local trust authentication is for this disposable environment. The
writing-run orchestrator owns stopping and removing this cluster when the run
ends. Article workers close their own sessions and use separate databases named
`rel3_aXX_runN`; never use another article's database as a fixture. Do not restart,
reconfigure or stop this shared verification server. For restore, failover or
configuration exercises needing server changes, create a separate disposable
instance with its own directory and port, and remove it after retaining evidence.
Use uniquely named roles for privilege exercises and remove only those roles.
Record any session overrides in the article's evidence.

## Start, verify and stop

Use these task-specific variables in each shell:

```sh
REL3_PG_BIN=/opt/homebrew/Cellar/postgresql@18/18.6_1/bin
REL3_PG_DIR=/private/tmp/staycurrent-relational-20261019.goQaIi
```

Inspect before starting; the server is already running at handoff:

```sh
"$REL3_PG_BIN/pg_ctl" -D "$REL3_PG_DIR/data" status
# Run only if the cluster is stopped:
"$REL3_PG_BIN/pg_ctl" -D "$REL3_PG_DIR/data" -l "$REL3_PG_DIR/server.log" -w -t 15 start
```

Create a fresh article database, choosing a new run suffix if it already exists:

```sh
"$REL3_PG_BIN/createdb" -h 127.0.0.1 -p 57319 -U staycurrent rel3_a14_run1
"$REL3_PG_BIN/psql" --no-psqlrc 'postgresql://staycurrent@127.0.0.1:57319/rel3_a14_run1' -v ON_ERROR_STOP=1
```

The following verification ran successfully in `rel3_runtime_check`; repeat it
there or in an article's own disposable database:

```sh
"$REL3_PG_BIN/psql" --no-psqlrc 'postgresql://staycurrent@127.0.0.1:57319/rel3_runtime_check' -v ON_ERROR_STOP=1 <<'SQL'
SELECT version();
SELECT current_database(), current_user, inet_server_addr(), inet_server_port();
SHOW data_directory;
SHOW fsync;
SHOW synchronous_commit;
SHOW full_page_writes;
SHOW default_transaction_isolation;
BEGIN;
CREATE TEMP TABLE verification (id integer PRIMARY KEY, quantity integer NOT NULL CHECK (quantity >= 0));
INSERT INTO verification VALUES (1, 3), (2, 5);
UPDATE verification SET quantity = quantity - 1 WHERE id = 1;
SELECT count(*) AS verified_rows, sum(quantity) AS verified_quantity FROM verification;
ROLLBACK;
SQL
```

Observed: correct cluster path and loopback port; `fsync`, `synchronous_commit`
and `full_page_writes` all `on`; default isolation `read committed`; final result
two rows and quantity seven. This proves basic native SQL operation, not any
unperformed concurrency, failure, recovery or performance claim.

Stop this cluster only, with a bounded wait:

```sh
"$REL3_PG_BIN/pg_ctl" -D "$REL3_PG_DIR/data" -m fast -w -t 15 stop
"$REL3_PG_BIN/pg_ctl" -D "$REL3_PG_DIR/data" status
```

After confirming it is stopped and retaining any needed evidence, the orchestrator
may remove `/private/tmp/staycurrent-relational-20261019.goQaIi`. That directory
contains only this run's disposable cluster and logs.

## Runtime limits and execution context

Initialisation used `initdb --username=staycurrent --locale=C --encoding=UTF8
--auth-local=trust --auth-host=trust` against the fresh data directory. Server
configuration sets 12 connections, 32 MB shared buffers, 4 MB work memory, 32 MB
maintenance memory, 128 MB temporary-file limit, two worker processes and no
parallel workers. Time zone is UTC. Statements time out after 30 seconds, lock
waits after five seconds, idle transactions after 60 seconds, and idle sessions
after 30 minutes. Record any session override in the article's evidence. This is
a bounded verification instance, not a production performance configuration.

The restricted Codex shell blocked PostgreSQL's required shared-memory call and
loopback connections. Initialisation, server start and the successful smoke test
ran with approved elevated tool execution. Use the same execution permission for
native PostgreSQL commands if the restricted shell reports `Operation not
permitted`; this is separate from a database error. Restricted `pg_ctl status`
also incorrectly reported no server while the server was running: perform status
and stop commands with the same elevated permission rather than starting another
instance. No container fallback or extra service was started.

## Isolated JavaScript driver

Application worksheets may import the pinned `pg` 8.23.1 driver from
`/private/tmp/rel3-pg-driver-20261020/node_modules/pg/esm/index.mjs`. Root installed
it with lifecycle scripts disabled, without changing repository dependencies,
and verified the package version and Client/Pool exports. This is an available
test dependency, not evidence that an article's database scenarios have run.
The orchestrator owns removing this disposable directory after all native checks.

The older `/private/tmp/staycurrent-pg-lab` import recorded in the a04 evidence
is incomplete now; do not rely on it for new runs. Retained observations from the
completed a04 run remain historical evidence.

## Independent review snapshots

Later review batches build to their own disposable output directory with `astro build --outDir`, run the unchanged site-check APIs against that exact output, then serve it on a separate loopback port. A batch’s files remain immutable through its review, so building the next batch does not reset an active player. Original b10 used4437 and is now released/stopped. B11 used4438 from `/private/tmp/rel3-b11-dist`; its server stopped after review. Current snapshot directories, ports and root-owned sessions are tracked in state.json. Root owns server/snapshot cleanup. These are local review copies, not additional publications.

## Completed native verification

After all article native reviews and the corpus setup-bridge rehearsal, root verified this shared disposable server as PID 99513 at the recorded data directory, stopped it with a waited fast shutdown, independently confirmed pg_ctl status 3 and absence of postmaster.pid, then removed only `/private/tmp/staycurrent-relational-20261019.goQaIi`. The running-state instructions above are retained as the historical verification record; this instance is now stopped and removed.

The newly installed isolated pg 8.23.1 driver directory was also removed after native work. All root-owned development and immutable-review servers have stopped after reviewer release; their disposable snapshot directories and the regenerable reading export have been removed. No listener remains on the run’s ports 4337, 4438, 4439, 4440 and 57319. Historical commands and paths above describe the completed run, not available services.
