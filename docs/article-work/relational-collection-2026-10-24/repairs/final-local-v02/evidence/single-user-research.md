# Local single-user fallback assessment

Checked official PostgreSQL 18 documentation and REL_18_STABLE source on 24 October 2026. No additional native process was started for this research.

The current branch's [single-user entry point](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/tcop/postgres.c#L3888) still invokes shared-memory initialisation. [ipci.c](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/storage/ipc/ipci.c#L199) calls PGSharedMemoryCreate without a private-memory argument; [sysv_shmem.c](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/port/sysv_shmem.c#L691) allocates the small SysV interlock even with mmap. The suggested `usePrivate` path is absent here. This is a source-based inference about the fallback, not an execution result for the installed binary.

[BootstrapModeMain](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/bootstrap/bootstrap.c#L318) also initialises shared memory. [initdb](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/bin/initdb/initdb.c#L2920) performs its configuration probe and then bootstrap. The [documented initdb options](https://www.postgresql.org/docs/18/app-initdb.html) provide no skip-memory-check/private-memory mode. No option probing or global setting change was attempted.

The [single-user documentation](https://www.postgresql.org/docs/18/app-postgres.html#APP-POSTGRES-SINGLE-USER) additionally specifies a distinct input terminator model, without psql's parsing. The reader download contains `\set` and `\echo`, so a translated single-user input would not establish that the exact psql file runs as delivered. Copying a clean stopped fixture would not resolve that requirement or the current branch's SysV dependency.

Root was informed that a fresh isolated hosted PostgreSQL 18/psql run of the exact committed draft download is the appropriate remaining option. No native success is claimed while that run is outstanding.
