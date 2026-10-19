# Native harness development and final state

19 October 2026. The canonical final successful execution is
`rl110-native-all-observed.json`. Per-page JSON extracts retain its event indexes.
The Python runner is `rl110-native.py`; run modes sequentially because they share
ports 56810–56815 while using unique data and socket directories.

The first sandboxed initdb attempt could not allocate PostgreSQL shared memory.
The authorised isolated-server command then ran with the required local process
permissions. No default PostgreSQL service was stopped or reconfigured.

Harness repairs made before the final captured execution:

- psql returns status 3 for a script error under ON_ERROR_STOP. The cancellation
  assertion initially expected status 1; it now checks the actual client error.
- The missing-WAL copy reported “could not locate required checkpoint record”.
  An early assertion expected a different spelling. The actual fatal log is now
  preserved and checked.
- pg_basebackup -R wrote primary_conninfo into postgresql.auto.conf. That
  overrode a later postgresql.conf value and supplied the wrong application name
  for the named synchronous-standby policy. The harness now sets the effective
  standby connection name explicitly in postgresql.auto.conf.
- The definer substitution test grants its temporary table readable rights to the
  function owner, so the unsafe case demonstrates actual value substitution,
  rather than stopping at a permission error.
- Promotion timeline inspection now follows CHECKPOINT, so the control-file
  checkpoint reports the new timeline rather than the preceding checkpoint.
- The final crash drill compares the table file’s hashes and checks the flushed
  position covers the unfinished update. It makes physical redo and committed
  visibility separately observable.
- Expected SQL rejections must return a nonzero status. The broken restore’s
  failed pg_ctl startup is separately checked against its fatal log.

The final combined run passed and stopped every owned server. It removed its own
unique temporary directory. Four earlier failed-attempt directories had no
postmaster.pid files when inspected and were removed after the final transcript
was sealed. Earlier mode-specific transcripts were superseded by the final
combined record, which includes every final case, its expected errors and logs.

The retained figures are teaching models. The pool-replacement and checkpoint
sizing models were assessed against the house references and their source; no
new cache-replacement benchmark or sustained recovery throughput is claimed.
