# a39 — sources and executed evidence

Checked 20 October 2026. Scope: PostgreSQL 18 restore procedure and an Amazon RDS contract example. Native runtime: PostgreSQL 18.6 Homebrew, aarch64-apple-darwin25.6.0, Apple clang 21.0.0; binaries `/opt/homebrew/Cellar/postgresql@18/18.6_1/bin`.

## Primary-source checks

| Source | Claims checked |
| --- | --- |
| [pg_dump](https://www.postgresql.org/docs/18/app-pgdump.html), [pg_dumpall](https://www.postgresql.org/docs/18/app-pg-dumpall.html), [pg_restore](https://www.postgresql.org/docs/18/app-pgrestore.html) | Consistent single-database export, cluster globals, selective loading and compatibility/dependency limits. No logical restore executed here. |
| [Filesystem backup](https://www.postgresql.org/docs/18/backup-file.html) | Offline/consistent snapshot requirements; coordinated multiple-volume capture; arbitrary live file copy is insufficient. |
| [pg_basebackup](https://www.postgresql.org/docs/18/app-pgbasebackup.html), [continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html) | Physical whole-cluster backup, streamed base WAL versus ongoing archive, full/incremental dependencies, recovery.signal, restore_command and timeline history. |
| [Recovery targets](https://www.postgresql.org/docs/18/runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET) | Named/time/XID/LSN targets, inclusion rules, one-target constraint, pause/hot_standby, timeline selection and fatal error when target is not reached. |
| [pg_verifybackup](https://www.postgresql.org/docs/18/app-pgverifybackup.html) | Manifest/file/base-WAL checks and explicit requirement for actual test restores; later extra WAL not automatically verified. |
| [pg_checksums](https://www.postgresql.org/docs/18/app-pgchecksums.html) | Page checksums on cleanly stopped cluster; scope distinct from business integrity. |
| [Amazon RDS PITR](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) | New destination without modifying source, earliest/latest restorable time, parameter/option groups and background block loading. No cloud action performed. Region/account restrictions deliberately presented as deployment questions. |

## Native rehearsal

The downloadable `src/components/relational-next/a39/rehearse.py` is the retained executable harness. Run with Python 3, Unix cp, the selected PostgreSQL 18 binary directory and a new evidence path. It starts only its own new temporary cluster and restore copies on unused loopback ports. Local trust authentication and tiny limits are a disposable test arrangement. Shared port 57319 and other workers' clusters were never contacted, reconfigured, restarted, restored or stopped.

Successful final invocation:

```sh
python3 src/components/relational-next/a39/rehearse.py \
  --pg-bin /opt/homebrew/Cellar/postgresql@18/18.6_1/bin \
  --evidence /private/tmp/rel3_a39_checked_evidence.json
```

Full base verification passed. Full replay waited for `NOT pg_is_in_recovery()` and produced orders 102,103,104 with three item lines. Named recovery paused and produced orders 101,102,103, four item lines, order 101's two lines and quantity three, and zero orphan items. Removing required segment 000000010000000000000003 from a separate archive copy produced the expected fatal target-not-reached error. This failed startup briefly accepted read-only connections before failing: connection readiness is not target success. The stopped targeted copy had zero bad checksums across 3,884 blocks / 1,254 files.

The initial debugging run put the restore marker inside the same implicit transaction as order 103's insert; it correctly excluded that not-yet-committed order. The final harness commits the good transaction before a separate marker call. Another initial validation called a recovery-only function after full replay had completed; the final harness guards that call. Neither failed validation is reported as final recovery evidence.

Timings below measure only local copy start through database validation of a tiny fixture, with warm local files and no external recovery prerequisites. They exclude remote retrieval, provisioning, decryption, actual identities, extensions, workload, application reconnection and domain acceptance. They establish no production RTO or hosted-service result. All four article figures are deterministic explanatory models; the 49/69-minute budgets and retention schedules are invented.

## Full retained command, result and server-log evidence

Only the final successful run is retained below. Each command is a structured argument list, so its quoting is not a shell transcript. Newlines in captured output remain explicit JSON escapes. All own servers were stopped; the recorded temporary root was confirmed absent after cleanup.

```json
{
  "runtime": "/opt/homebrew/Cellar/postgresql@18/18.6_1/bin",
  "root": "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i",
  "records": [
    {
      "command": [
        "initdb",
        "-D",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/source",
        "--username=drill",
        "--locale=C",
        "--encoding=UTF8",
        "--auth-local=trust",
        "--auth-host=trust"
      ],
      "seconds": 0.375,
      "returncode": 0,
      "stdout": "The files belonging to this database system will be owned by user \"ryannel\".\nThis user must also own the server process.\n\nThe database cluster will be initialized with locale \"C\".\nThe default text search configuration will be set to \"english\".\n\nData page checksums are enabled.\n\ncreating directory /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/source ... ok\ncreating subdirectories ... ok\nselecting dynamic shared memory implementation ... posix\nselecting default \"max_connections\" ... 100\nselecting default \"shared_buffers\" ... 128MB\nselecting default time zone ... Europe/Stockholm\ncreating configuration files ... ok\nrunning bootstrap script ... ok\nperforming post-bootstrap initialization ... ok\nsyncing data to disk ... ok\n\nSuccess. You can now start the database server using:\n\n    '/opt/homebrew/Cellar/postgresql@18/18.6_1/bin/pg_ctl' -D /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/source -l logfile start\n\n",
      "stderr": ""
    },
    {
      "command": [
        "pg_ctl",
        "-D",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/source",
        "-l",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/source.log",
        "-w",
        "-t",
        "15",
        "start"
      ],
      "seconds": 0.119,
      "returncode": 0,
      "stdout": "waiting for server to start.... done\nserver started\n",
      "stderr": ""
    },
    {
      "command": [
        "createdb",
        "-h",
        "127.0.0.1",
        "-p",
        "52294",
        "-U",
        "drill",
        "shop"
      ],
      "seconds": 0.074,
      "returncode": 0,
      "stdout": "",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52294",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "CREATE TABLE orders(id int PRIMARY KEY, status text NOT NULL); CREATE TABLE items(order_id int REFERENCES orders ON DELETE CASCADE, line int, quantity int CHECK(quantity>0), PRIMARY KEY(order_id,line)); INSERT INTO orders VALUES(101,'paid'),(102,'paid'); INSERT INTO items VALUES(101,1,2),(101,2,1),(102,1,1);"
      ],
      "seconds": 0.026,
      "returncode": 0,
      "stdout": "CREATE TABLE\nCREATE TABLE\nINSERT 0 2\nINSERT 0 3\n",
      "stderr": ""
    },
    {
      "command": [
        "pg_basebackup",
        "-h",
        "127.0.0.1",
        "-p",
        "52294",
        "-U",
        "drill",
        "-D",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/base",
        "-Fp",
        "-X",
        "stream",
        "--checkpoint=fast",
        "--label=a39-rehearsal"
      ],
      "seconds": 0.323,
      "returncode": 0,
      "stdout": "",
      "stderr": ""
    },
    {
      "command": [
        "pg_verifybackup",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/base"
      ],
      "seconds": 0.053,
      "returncode": 0,
      "stdout": "backup successfully verified\n",
      "stderr": ""
    },
    {
      "base_file_bytes": 48854471
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52294",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "INSERT INTO orders VALUES(103,'paid'); INSERT INTO items VALUES(103,1,1);"
      ],
      "seconds": 0.018,
      "returncode": 0,
      "stdout": "INSERT 0 1\nINSERT 0 1\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52294",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "SELECT pg_create_restore_point('before_bad_delete');"
      ],
      "seconds": 0.016,
      "returncode": 0,
      "stdout": "0/300A6C0\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52294",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "BEGIN; DELETE FROM orders WHERE id=101; COMMIT; INSERT INTO orders VALUES(104,'paid'); INSERT INTO items VALUES(104,1,1);"
      ],
      "seconds": 0.016,
      "returncode": 0,
      "stdout": "BEGIN\nDELETE 1\nCOMMIT\nINSERT 0 1\nINSERT 0 1\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52294",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "SELECT pg_walfile_name(pg_current_wal_lsn());"
      ],
      "seconds": 0.015,
      "returncode": 0,
      "stdout": "000000010000000000000003\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52294",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "SELECT pg_switch_wal();"
      ],
      "seconds": 0.053,
      "returncode": 0,
      "stdout": "0/300A910\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52294",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "SELECT string_agg(id::text,',' ORDER BY id) FROM orders;"
      ],
      "seconds": 0.023,
      "returncode": 0,
      "stdout": "102,103,104\n",
      "stderr": ""
    },
    {
      "archive_files": [
        "000000010000000000000001",
        "000000010000000000000002",
        "000000010000000000000002.00000028.backup",
        "000000010000000000000003"
      ],
      "last_required_segment": "000000010000000000000003",
      "source": "102,103,104"
    },
    {
      "command": [
        "pg_ctl",
        "-D",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/full",
        "-l",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/full.log",
        "-w",
        "-t",
        "15",
        "start"
      ],
      "seconds": 0.235,
      "returncode": 0,
      "stdout": "waiting for server to start.... done\nserver started\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52307",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "SELECT NOT pg_is_in_recovery();"
      ],
      "seconds": 0.02,
      "returncode": 0,
      "stdout": "t\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52307",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "SELECT 'orders='||string_agg(id::text,',' ORDER BY id) FROM orders; SELECT 'items='||count(*) FROM items; SELECT 'recovery='||pg_is_in_recovery()::text; SELECT 'paused='||CASE WHEN pg_is_in_recovery() THEN pg_is_wal_replay_paused()::text ELSE 'not in recovery' END;"
      ],
      "seconds": 0.017,
      "returncode": 0,
      "stdout": "orders=102,103,104\nitems=3\nrecovery=false\npaused=not in recovery\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52307",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "SELECT count(*) AS orphan_items FROM items i LEFT JOIN orders o ON o.id=i.order_id WHERE o.id IS NULL; SELECT order_id,count(*),sum(quantity) FROM items GROUP BY order_id ORDER BY order_id;"
      ],
      "seconds": 0.016,
      "returncode": 0,
      "stdout": "0\n102|1|1\n103|1|1\n104|1|1\n",
      "stderr": ""
    },
    {
      "result": "full",
      "elapsed_copy_start_to_queries_seconds": 0.476,
      "observed": "orders=102,103,104\nitems=3\nrecovery=false\npaused=not in recovery"
    },
    {
      "command": [
        "pg_ctl",
        "-D",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/full",
        "-m",
        "fast",
        "-w",
        "-t",
        "15",
        "stop"
      ],
      "seconds": 0.107,
      "returncode": 0,
      "stdout": "waiting for server to shut down.... done\nserver stopped\n",
      "stderr": ""
    },
    {
      "command": [
        "pg_ctl",
        "-D",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/target",
        "-l",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/target.log",
        "-w",
        "-t",
        "15",
        "start"
      ],
      "seconds": 0.123,
      "returncode": 0,
      "stdout": "waiting for server to start.... done\nserver started\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52312",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "SELECT CASE WHEN pg_is_in_recovery() THEN pg_is_wal_replay_paused() ELSE false END;"
      ],
      "seconds": 0.018,
      "returncode": 0,
      "stdout": "t\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52312",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "SELECT 'orders='||string_agg(id::text,',' ORDER BY id) FROM orders; SELECT 'items='||count(*) FROM items; SELECT 'recovery='||pg_is_in_recovery()::text; SELECT 'paused='||CASE WHEN pg_is_in_recovery() THEN pg_is_wal_replay_paused()::text ELSE 'not in recovery' END;"
      ],
      "seconds": 0.016,
      "returncode": 0,
      "stdout": "orders=101,102,103\nitems=4\nrecovery=true\npaused=true\n",
      "stderr": ""
    },
    {
      "command": [
        "psql",
        "-X",
        "-h",
        "127.0.0.1",
        "-p",
        "52312",
        "-U",
        "drill",
        "-d",
        "shop",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
        "-c",
        "SELECT count(*) AS orphan_items FROM items i LEFT JOIN orders o ON o.id=i.order_id WHERE o.id IS NULL; SELECT order_id,count(*),sum(quantity) FROM items GROUP BY order_id ORDER BY order_id;"
      ],
      "seconds": 0.015,
      "returncode": 0,
      "stdout": "0\n101|2|3\n102|1|1\n103|1|1\n",
      "stderr": ""
    },
    {
      "result": "target",
      "elapsed_copy_start_to_queries_seconds": 0.356,
      "observed": "orders=101,102,103\nitems=4\nrecovery=true\npaused=true"
    },
    {
      "command": [
        "pg_ctl",
        "-D",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/target",
        "-m",
        "fast",
        "-w",
        "-t",
        "15",
        "stop"
      ],
      "seconds": 0.98,
      "returncode": 0,
      "stdout": "waiting for server to shut down.... done\nserver stopped\n",
      "stderr": ""
    },
    {
      "command": [
        "pg_checksums",
        "--check",
        "-D",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/target"
      ],
      "seconds": 0.045,
      "returncode": 0,
      "stdout": "Checksum operation completed\nFiles scanned:   1254\nBlocks scanned:  3884\nBad checksums:  0\nData checksum version: 1\n",
      "stderr": ""
    },
    {
      "command": [
        "pg_ctl",
        "-D",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/gap",
        "-l",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/gap.log",
        "-w",
        "-t",
        "15",
        "start"
      ],
      "seconds": 0.12,
      "returncode": 1,
      "stdout": "waiting for server to start.... stopped waiting\n",
      "stderr": "pg_ctl: could not start server\nExamine the log output.\n"
    },
    {
      "gap_expected_failure": "2026-10-20 00:13:55.722 CEST [56548] LOG:  starting PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit\n2026-10-20 00:13:55.722 CEST [56548] LOG:  listening on IPv4 address \"127.0.0.1\", port 52316\n2026-10-20 00:13:55.723 CEST [56548] LOG:  listening on Unix socket \"/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/.s.PGSQL.52316\"\n2026-10-20 00:13:55.726 CEST [56554] LOG:  database system was interrupted; last known up at 2026-10-20 00:13:52 CEST\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/gap-archive/00000002.history: No such file or directory\n2026-10-20 00:13:55.763 CEST [56554] LOG:  starting backup recovery with redo LSN 0/2000028, checkpoint LSN 0/2000080, on timeline ID 1\n2026-10-20 00:13:55.771 CEST [56554] LOG:  restored log file \"000000010000000000000002\" from archive\n2026-10-20 00:13:55.774 CEST [56554] LOG:  starting point-in-time recovery to \"before_bad_delete\"\n2026-10-20 00:13:55.774 CEST [56554] LOG:  redo starts at 0/2000028\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/gap-archive/000000010000000000000003: No such file or directory\n2026-10-20 00:13:55.778 CEST [56554] LOG:  completed backup recovery with redo LSN 0/2000028 and end LSN 0/2000120\n2026-10-20 00:13:55.778 CEST [56554] LOG:  consistent recovery state reached at 0/2000120\n2026-10-20 00:13:55.778 CEST [56548] LOG:  database system is ready to accept read-only connections\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/gap-archive/000000010000000000000003: No such file or directory\n2026-10-20 00:13:55.781 CEST [56554] LOG:  redo done at 0/2000120 system usage: CPU: user: 0.00 s, system: 0.00 s, elapsed: 0.00 s\n2026-10-20 00:13:55.781 CEST [56554] FATAL:  recovery ended before configured recovery target was reached\n2026-10-20 00:13:55.782 CEST [56548] LOG:  startup process (PID 56554) exited with exit code 1\n2026-10-20 00:13:55.782 CEST [56548] LOG:  terminating any other active server processes\n2026-10-20 00:13:55.782 CEST [56548] LOG:  shutting down due to startup process failure\n2026-10-20 00:13:55.782 CEST [56548] LOG:  database system is shut down\n"
    },
    {
      "command": [
        "pg_ctl",
        "-D",
        "/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/source",
        "-m",
        "fast",
        "-w",
        "-t",
        "15",
        "stop"
      ],
      "seconds": 0.115,
      "returncode": 0,
      "stdout": "waiting for server to shut down.... done\nserver stopped\n",
      "stderr": ""
    }
  ],
  "logs": {
    "source.log": "2026-10-20 00:13:52.651 CEST [56444] LOG:  starting PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit\n2026-10-20 00:13:52.651 CEST [56444] LOG:  listening on IPv4 address \"127.0.0.1\", port 52294\n2026-10-20 00:13:52.651 CEST [56444] LOG:  listening on Unix socket \"/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/.s.PGSQL.52294\"\n2026-10-20 00:13:52.655 CEST [56450] LOG:  database system was shut down at 2026-10-20 00:13:52 CEST\n2026-10-20 00:13:52.655 CEST [56444] LOG:  database system is ready to accept connections\n2026-10-20 00:13:52.866 CEST [56448] LOG:  checkpoint starting: immediate force wait\n2026-10-20 00:13:52.985 CEST [56448] LOG:  checkpoint complete: wrote 966 buffers (23.6%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.109 s, sync=0.007 s, total=0.119 s; sync files=309, longest=0.001 s, average=0.001 s; distance=8652 kB, estimate=8652 kB; lsn=0/2000080, redo lsn=0/2000028\n2026-10-20 00:13:53.259 CEST [56475] LOG:  restore point \"before_bad_delete\" created at 0/300A6C0\n2026-10-20 00:13:53.259 CEST [56475] STATEMENT:  SELECT pg_create_restore_point('before_bad_delete');\n2026-10-20 00:13:55.821 CEST [56444] LOG:  received fast shutdown request\n2026-10-20 00:13:55.821 CEST [56444] LOG:  aborting any active transactions\n2026-10-20 00:13:55.822 CEST [56444] LOG:  background worker \"logical replication launcher\" (PID 56454) exited with exit code 1\n2026-10-20 00:13:55.822 CEST [56448] LOG:  shutting down\n2026-10-20 00:13:55.822 CEST [56448] LOG:  checkpoint starting: shutdown immediate\n2026-10-20 00:13:55.826 CEST [56448] LOG:  checkpoint complete: wrote 12 buffers (0.3%), wrote 1 SLRU buffers; 0 WAL file(s) added, 0 removed, 2 recycled; write=0.001 s, sync=0.001 s, total=0.005 s; sync files=10, longest=0.001 s, average=0.001 s; distance=32768 kB, estimate=32768 kB; lsn=0/4000028, redo lsn=0/4000028\n2026-10-20 00:13:55.828 CEST [56444] LOG:  database system is shut down\n",
    "full.log": "2026-10-20 00:13:53.692 CEST [56488] LOG:  starting PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit\n2026-10-20 00:13:53.693 CEST [56488] LOG:  listening on IPv4 address \"127.0.0.1\", port 52307\n2026-10-20 00:13:53.693 CEST [56488] LOG:  listening on Unix socket \"/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/.s.PGSQL.52307\"\n2026-10-20 00:13:53.696 CEST [56494] LOG:  database system was interrupted; last known up at 2026-10-20 00:13:52 CEST\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/archive/00000002.history: No such file or directory\n2026-10-20 00:13:53.734 CEST [56494] LOG:  starting backup recovery with redo LSN 0/2000028, checkpoint LSN 0/2000080, on timeline ID 1\n2026-10-20 00:13:53.759 CEST [56494] LOG:  restored log file \"000000010000000000000002\" from archive\n2026-10-20 00:13:53.760 CEST [56494] LOG:  starting archive recovery\n2026-10-20 00:13:53.760 CEST [56494] LOG:  redo starts at 0/2000028\n2026-10-20 00:13:53.784 CEST [56494] LOG:  restored log file \"000000010000000000000003\" from archive\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/archive/000000010000000000000004: No such file or directory\n2026-10-20 00:13:53.791 CEST [56494] LOG:  completed backup recovery with redo LSN 0/2000028 and end LSN 0/2000120\n2026-10-20 00:13:53.791 CEST [56494] LOG:  consistent recovery state reached at 0/2000120\n2026-10-20 00:13:53.791 CEST [56488] LOG:  database system is ready to accept read-only connections\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/archive/000000010000000000000004: No such file or directory\n2026-10-20 00:13:53.794 CEST [56494] LOG:  redo done at 0/300A8F8 system usage: CPU: user: 0.00 s, system: 0.00 s, elapsed: 0.03 s\n2026-10-20 00:13:53.794 CEST [56494] LOG:  last completed transaction was at log time 2026-10-19 22:13:53.275853+00\n2026-10-20 00:13:53.816 CEST [56494] LOG:  restored log file \"000000010000000000000003\" from archive\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/archive/00000002.history: No such file or directory\n2026-10-20 00:13:53.822 CEST [56494] LOG:  selected new timeline ID: 2\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/archive/00000001.history: No such file or directory\n2026-10-20 00:13:53.829 CEST [56494] LOG:  archive recovery complete\n2026-10-20 00:13:53.829 CEST [56492] LOG:  checkpoint starting: end-of-recovery immediate wait\n2026-10-20 00:13:53.830 CEST [56492] LOG:  checkpoint complete: wrote 12 buffers (0.3%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 2 recycled; write=0.001 s, sync=0.001 s, total=0.002 s; sync files=11, longest=0.001 s, average=0.001 s; distance=32768 kB, estimate=32768 kB; lsn=0/4000028, redo lsn=0/4000028\n2026-10-20 00:13:53.831 CEST [56488] LOG:  database system is ready to accept connections\n2026-10-20 00:13:53.958 CEST [56488] LOG:  received fast shutdown request\n2026-10-20 00:13:53.958 CEST [56488] LOG:  aborting any active transactions\n2026-10-20 00:13:53.959 CEST [56488] LOG:  background worker \"logical replication launcher\" (PID 56505) exited with exit code 1\n2026-10-20 00:13:53.959 CEST [56492] LOG:  shutting down\n2026-10-20 00:13:53.959 CEST [56492] LOG:  checkpoint starting: shutdown immediate\n2026-10-20 00:13:53.960 CEST [56492] LOG:  checkpoint complete: wrote 10 buffers (0.2%), wrote 0 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.001 s, sync=0.001 s, total=0.002 s; sync files=8, longest=0.001 s, average=0.001 s; distance=33 kB, estimate=29494 kB; lsn=0/40085E8, redo lsn=0/40085E8\n2026-10-20 00:13:53.962 CEST [56488] LOG:  database system is shut down\n",
    "gap.log": "2026-10-20 00:13:55.722 CEST [56548] LOG:  starting PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit\n2026-10-20 00:13:55.722 CEST [56548] LOG:  listening on IPv4 address \"127.0.0.1\", port 52316\n2026-10-20 00:13:55.723 CEST [56548] LOG:  listening on Unix socket \"/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/.s.PGSQL.52316\"\n2026-10-20 00:13:55.726 CEST [56554] LOG:  database system was interrupted; last known up at 2026-10-20 00:13:52 CEST\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/gap-archive/00000002.history: No such file or directory\n2026-10-20 00:13:55.763 CEST [56554] LOG:  starting backup recovery with redo LSN 0/2000028, checkpoint LSN 0/2000080, on timeline ID 1\n2026-10-20 00:13:55.771 CEST [56554] LOG:  restored log file \"000000010000000000000002\" from archive\n2026-10-20 00:13:55.774 CEST [56554] LOG:  starting point-in-time recovery to \"before_bad_delete\"\n2026-10-20 00:13:55.774 CEST [56554] LOG:  redo starts at 0/2000028\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/gap-archive/000000010000000000000003: No such file or directory\n2026-10-20 00:13:55.778 CEST [56554] LOG:  completed backup recovery with redo LSN 0/2000028 and end LSN 0/2000120\n2026-10-20 00:13:55.778 CEST [56554] LOG:  consistent recovery state reached at 0/2000120\n2026-10-20 00:13:55.778 CEST [56548] LOG:  database system is ready to accept read-only connections\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/gap-archive/000000010000000000000003: No such file or directory\n2026-10-20 00:13:55.781 CEST [56554] LOG:  redo done at 0/2000120 system usage: CPU: user: 0.00 s, system: 0.00 s, elapsed: 0.00 s\n2026-10-20 00:13:55.781 CEST [56554] FATAL:  recovery ended before configured recovery target was reached\n2026-10-20 00:13:55.782 CEST [56548] LOG:  startup process (PID 56554) exited with exit code 1\n2026-10-20 00:13:55.782 CEST [56548] LOG:  terminating any other active server processes\n2026-10-20 00:13:55.782 CEST [56548] LOG:  shutting down due to startup process failure\n2026-10-20 00:13:55.782 CEST [56548] LOG:  database system is shut down\n",
    "target.log": "2026-10-20 00:13:54.270 CEST [56518] LOG:  starting PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit\n2026-10-20 00:13:54.270 CEST [56518] LOG:  listening on IPv4 address \"127.0.0.1\", port 52312\n2026-10-20 00:13:54.271 CEST [56518] LOG:  listening on Unix socket \"/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/.s.PGSQL.52312\"\n2026-10-20 00:13:54.274 CEST [56524] LOG:  database system was interrupted; last known up at 2026-10-20 00:13:52 CEST\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/archive/00000002.history: No such file or directory\n2026-10-20 00:13:54.311 CEST [56524] LOG:  starting backup recovery with redo LSN 0/2000028, checkpoint LSN 0/2000080, on timeline ID 1\n2026-10-20 00:13:54.333 CEST [56524] LOG:  restored log file \"000000010000000000000002\" from archive\n2026-10-20 00:13:54.334 CEST [56524] LOG:  starting point-in-time recovery to \"before_bad_delete\"\n2026-10-20 00:13:54.335 CEST [56524] LOG:  redo starts at 0/2000028\n2026-10-20 00:13:54.356 CEST [56524] LOG:  restored log file \"000000010000000000000003\" from archive\ncp: /var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-a39-7lu2hu3i/archive/000000010000000000000004: No such file or directory\n2026-10-20 00:13:54.361 CEST [56524] LOG:  completed backup recovery with redo LSN 0/2000028 and end LSN 0/2000120\n2026-10-20 00:13:54.361 CEST [56524] LOG:  consistent recovery state reached at 0/2000120\n2026-10-20 00:13:54.361 CEST [56518] LOG:  database system is ready to accept read-only connections\n2026-10-20 00:13:54.362 CEST [56524] LOG:  recovery stopping at restore point \"before_bad_delete\", time 2026-10-19 22:13:53.259497+00\n2026-10-20 00:13:54.362 CEST [56524] LOG:  pausing at the end of recovery\n2026-10-20 00:13:54.362 CEST [56524] HINT:  Execute pg_wal_replay_resume() to promote.\n2026-10-20 00:13:54.420 CEST [56518] LOG:  received fast shutdown request\n2026-10-20 00:13:54.420 CEST [56518] LOG:  aborting any active transactions\n2026-10-20 00:13:55.367 CEST [56522] LOG:  shutting down\n2026-10-20 00:13:55.376 CEST [56518] LOG:  database system is shut down\n"
  },
  "cleanup": "all own servers stopped; data directory removed after evidence capture"
}
```

## Root model narration repair, 20 October 2026

History notes now branch at the named marker, deletion and final stages when target WAL is missing. That path consistently says no earlier target state was accepted; it no longer claims that order 101 was recovered. Complete-history narration, visible row states, article prose, player and native rehearsal are unchanged. B10 teaching checkpoint lists remaining controls/playback/phone/theme checks; a browser download-event wait stalled and is not evidence of a broken asset.
