# Practice onboarding: technical review

Checked 5 October 2026. Scope: the proposed local PostgreSQL 18 container route,
the existing schema and query downloads, and the Tables and JSON SQL. This pass
checks source behaviour and setup consequences. Docker Desktop's daemon was
already stopped; this reviewer did not start it or execute the container route.

## Consequential setup findings

The bounded container route fits these exercises. The official image currently
offers `postgres:18` and requires a nonempty `POSTGRES_PASSWORD` for ordinary
initialisation. Container-local socket connections use trust authentication, so
`docker exec … psql -U postgres` can connect without another password prompt.
Keep the chosen image major explicit. If adding a persistent volume, PostgreSQL
18's mount target is `/var/lib/postgresql`; older examples using the former data
path are unsuitable. This guide need not introduce a volume to teach queries.
The image starts a temporary socket-only server during initialisation. An
inference from that documented sequence is that a socket readiness probe can
succeed before startup has finished; `pg_isready -h localhost -U postgres`
checks TCP instead. [Official PostgreSQL image](https://hub.docker.com/_/postgres)

Wait for an accepting-connections result before creating practice databases.
`pg_isready` distinguishes startup rejection from no response; container creation
alone is not the reader's success signal.
[PostgreSQL 18 pg_isready](https://www.postgresql.org/docs/18/app-pg-isready.html)

Say which commands belong at the computer's shell prompt and which belong at the
`psql` prompt. `docker exec -it` suits an interactive session; `docker exec -i`
keeps input open for a redirected host file. A download on the host is not a file
inside the container. Use host redirection, or explicitly copy the file before
using an internal `-f` path.
[Docker exec](https://docs.docker.com/reference/cli/docker/container/exec/),
[Docker cp](https://docs.docker.com/reference/cli/docker/container/cp/)

Separate article databases are necessary here: both query extensions insert O14
with different timestamps, and several articles add tables or columns. Repeating
a successful setup in the same database produces duplicate-table or duplicate-key
errors. The useful recovery is a fresh named practice database with the base
schema loaded once, not repeatedly pasting setup into the existing one. The
instructions should also distinguish resuming a stopped named container with
`docker start` from creating another container with the same name.
[Docker start](https://docs.docker.com/reference/cli/docker/container/start/)

## Script and connection boundaries

Use file or standard-input script processing for the downloads. `psql -c` sends
its entire command string as one request; ordinary semicolon processing sends
commands individually. Do not add `--single-transaction` to the pagination file:
it already contains transaction boundaries. Stop on unexpected setup errors with
`ON_ERROR_STOP=1`; default interactive processing can continue after the expected
constraint errors. `-X` avoids startup-file changes to these defaults.
[PostgreSQL 18 psql](https://www.postgresql.org/docs/18/app-psql.html)

`query-results.sql` creates `filter_customers` and `filter_orders` as temporary
tables. They disappear when its connection ends. A reader who runs the download
and later opens interactive `psql` must rerun only the filter comparison's setup
in that new session. The existing article correctly says to keep setup and its
queries in the same session; the onboarding route must preserve that instruction.
[PostgreSQL 18 CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html)

The pagination cursor's `BEGIN`, `DECLARE`, `FETCH`, `CLOSE` and `COMMIT` must
remain on one connection. The existing downloaded script provides that route.
For expected failed writes inside an explicit transaction, explain `ROLLBACK`
before another attempt. Outside an explicit transaction, independently submitted
statements have their own transaction, so a rejected insert does not invalidate
the next one. This distinction matters to the constraints examples and the JSON
capacity migration.
[PostgreSQL 18 transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html)

## Recheck still needed

Review the final commands and exercise answers against the implemented guide.
Source review does not establish that Docker startup, host-file loading, or the
full novice path was executed. Tables and JSON must direct readers back to the
four-table setup after trying its alternative `mug_details` representation;
otherwise the later migration tries to create an existing table.
