# Research dossier E: replication, persistence, failover, Cluster and hot keys

Scope: coverage-map articles 9 (`replication-and-persistence`) and 10 (`cluster-and-hot-keys`) of the application caching collection. Written for article writers; no article prose.

Prepared 2026-10-27 against Redis 8.10.3 (released 2026-10-26 per the GitHub releases API; the installed build is `8.10.3`, libc malloc, macOS arm64, kqueue). Raw commands and output: `docs/article-work/caching-2026-10-27/evidence/research-E.txt` (cited as `E#`).

## How to read this file

Every fact has an ID (`R9.nn` for article 9, `R10.nn` for article 10) and one status:

- **CONFIRMED**: stated by the cited primary source.
- **OBSERVED**: reproduced on the local server (evidence section given). Observed on one macOS build; see the caveat list below.
- **DERIVED**: arithmetic from confirmed or observed facts; the working is shown.
- **UNCONFIRMED**: could not be verified; do not state as fact.

Source keys (full URLs; `src/…` files are at tag `8.10.3`):

| Key | URL |
| --- | --- |
| PERSIST | https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/ |
| REPL | https://redis.io/docs/latest/operate/oss_and_stack/management/replication/ |
| SENT | https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/ |
| SENTCLI | https://redis.io/docs/latest/develop/reference/sentinel-clients/ |
| CLSPEC | https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/ |
| SCALE | https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/ |
| CSC | https://redis.io/docs/latest/develop/reference/client-side-caching/ |
| CSCINTRO | https://redis.io/docs/latest/develop/clients/client-side-caching/ |
| TRACK | https://redis.io/docs/latest/commands/client-tracking/ |
| WAIT / WAITAOF / FAILOVER | https://redis.io/docs/latest/commands/wait/ , /commands/waitaof/ , /commands/failover/ |
| HOTKEYS / SLOTSTATS / CLMIG | https://redis.io/docs/latest/commands/hotkeys/ , /commands/cluster-slot-stats/ , /commands/cluster-migration/ |
| CLI | https://redis.io/docs/latest/develop/tools/cli/ |
| LAT | https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/ |
| MONITOR | https://redis.io/docs/latest/commands/monitor/ |
| ASM | https://redis.io/blog/atomic-slot-migration/ |
| CONF | https://github.com/redis/redis/blob/8.10.3/redis.conf |
| CONFC | https://github.com/redis/redis/blob/8.10.3/src/config.c |
| SENTC / SENTCONF | https://github.com/redis/redis/blob/8.10.3/src/sentinel.c , /sentinel.conf |
| AOFC | https://github.com/redis/redis/blob/8.10.3/src/aof.c |
| CLH | https://github.com/redis/redis/blob/8.10.3/src/cluster_legacy.h |
| SRVC | https://github.com/redis/redis/blob/8.10.3/src/server.c |
| ISSUE2576 | https://github.com/redis/redis/issues/2576 |
| NISHTALA | Nishtala et al., "Scaling Memcache at Facebook", NSDI 2013, https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf |
| VALKEY8 | https://valkey.io/blog/valkey-8-0-0-rc1/ |
| ELASTICACHE | https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/AutoFailover.html |

Terminology note for writers: Redis documentation still says "master" and "replica" in these pages; commands are `REPLICAOF` (alias `SLAVEOF`), and `INFO` fields keep `slave*` names. Say "primary" or "master" consistently with the article's choice, and introduce the field names as they appear (`connected_slaves`, `slave_repl_offset`).

### Caveats on the local observations

- macOS build with libc malloc, not jemalloc. Memory and fork figures (E7) are not typical of Linux production servers.
- `kill -9` (E8) simulates a process crash. The operating system survives, so data already passed to `write()` is not lost. It does **not** simulate a power cut or kernel crash, which is what `appendfsync` policies defend against. The AOF results are therefore best case; never present them as "AOF loses nothing".
- Only one server could be run (port 7205), so no real replica, Sentinel quorum or multi-node Cluster was observed. Replication was observed by playing a replica with a raw socket (E4–E6). Multi-node behaviour (MOVED, ASK, failover timings) is CONFIRMED from documentation only.
- Cluster-mode runs also open the derived bus port 17205 (data port + 10000); no other port was used.

---

## Article 9: `replication-and-persistence`

Suggested title shape: "Redis replication, persistence and failover" (searchable terms: "Redis persistence", "RDB vs AOF", "Redis replication", "Redis Sentinel failover").

### 9A. Does a cache need persistence at all?

- **R9.01 CONFIRMED.** "No persistence" is a documented option and "is sometimes used when caching". Src: PERSIST (opening list).
- **R9.02 OBSERVED (E1, E8 case A).** With `--save '' --appendonly no`, 1,000 `INCR counter` writes followed by `kill -9` and restart leave `GET counter` nil and `DBSIZE` 0. An empty restart means an empty cache.
- **R9.03 CONFIRMED.** Default snapshots are on and appendonly is off: `save 3600 1 300 100 60 10000` (after 1 h if at least 1 change; 5 min if at least 100; 60 s if at least 10,000) and `appendonly no`. Src: CONF lines 489–506, 1491. OBSERVED on a bare server (E1): `CONFIG GET save` returns `3600 1 300 100 60 10000`.
- **R9.04 DERIVED.** What a restart costs the database: an empty cache sends every request to the database. If the normal hit ratio is h, the database normally sees (1−h) of requests; cold it sees all of them, a multiplier of 1/(1−h): 20× at 95%, 100× at 99%. (Same arithmetic as article 1; article 11 owns the metastable-failure treatment.)
- **R9.05 OBSERVED (E19, illustrative).** Loading a 75.9 MB RDB with 632,285 keys of 100-byte values took 0.331 s ("DB loaded from disk: 0.331 seconds"), about 1.9 million keys per second on this Mac. Warm restart from RDB is fast when the file is local; time scales with key count and size. Not a Linux production figure.
- **R9.06 CONFIRMED.** Docs recommend RDB alone if "a few minutes of data loss" is acceptable; RDB+AOF for PostgreSQL-like safety; they "discourage" AOF alone. These recommendations are for a database use of Redis; for a cache the question is whether a warm restart is worth the fork and disk cost. Src: PERSIST ("Ok, so what should I use?").
- **R9.07 CONFIRMED.** If both AOF and RDB are enabled, on restart "the AOF file will be used to reconstruct the original dataset since it is guaranteed to be the most complete". Src: PERSIST ("Interactions between AOF and RDB").
- **R9.08 CONFIRMED (important pitfall).** Replication plus a primary with persistence off and automatic restart is dangerous: the primary restarts empty and its replicas copy the empty dataset, so the data is wiped everywhere. With Sentinel the primary can restart "fast enough for Sentinel to not detect a failure". For a cache this wipes the warm copy that failover was meant to protect. Src: REPL ("Safety of replication when master has persistence turned off").

### 9B. RDB snapshots

- **R9.10 CONFIRMED.** RDB is a point-in-time, compact single-file snapshot (`dump.rdb`). Redis forks; the child writes a temporary file and replaces the old one when finished; the parent "will never perform disk I/O" for it. Src: PERSIST ("RDB advantages", "Snapshotting: How it works").
- **R9.11 CONFIRMED.** Trade-off stated in the docs: RDB is poor for minimising data loss ("prepared to lose the latest minutes of data") and `fork()` "can be time consuming if the dataset is big", stalling clients "for some milliseconds or even for one second" on a big dataset and slow CPU. Src: PERSIST ("RDB disadvantages").
- **R9.12 CONFIRMED.** Page-table arithmetic from the latency docs: Linux/AMD64 uses 4 kB pages, 8 bytes of page table per page, so "a large 24 GB Redis instance requires a page table of 24 GB / 4 kB * 8 = 48 MB" to copy at fork. Src: LAT ("Latency generated by fork"). DERIVED check: 24×2^30 / 4096 × 8 = 50.3 MB (≈48 MiB).
- **R9.13 CONFIRMED.** Documented fork times (via `latest_fork_usec` after `BGSAVE`): 6.0 GB RSS in 77 ms (12.8 ms/GB) on a VMware VM; 6.9 GB in 62 ms (9 ms/GB) on physical Xeon; old EC2 Xen 6.1 GB in 1,460 ms (239 ms/GB); 1 GB on newer EC2 Xen in 10 ms. These are dated hardware; present as "milliseconds per gigabyte on good hardware, tenfold or more on poor virtualisation". Src: LAT ("Fork time in different systems").
- **R9.14 OBSERVED (E7, illustrative).** 632,285 keys / 113 MiB `used_memory` / 128 MiB RSS: `BGSAVE` fork took `latest_fork_usec:1962` (about 15 ms/GB, consistent with the documented range). The 75.9 MB file was written in about 1 s (`rdb_last_bgsave_time_sec:1`); with `rdb-key-save-delay 20` (a debug setting, µs per key) the child took 19 s while `redis-benchmark` writes continued at 129,870 ops/s versus 146,263 ops/s without a child (single runs, not a benchmark).
- **R9.15 OBSERVED / limitation.** `current_cow_size` and `rdb_last_cow_size` read 0 on this macOS build throughout (E7), so copy-on-write growth could not be measured locally. Docs describe it; do not claim a measured COW figure. Mechanism (CONFIRMED, PERSIST/LAT): after fork, parent and child share memory pages; a page the parent writes to is copied, so worst-case extra memory approaches the size of the data written during the save. UNCONFIRMED: any specific COW percentage.
- **R9.16 CONFIRMED.** Transparent huge pages make COW dramatically worse (a write copies 2 MB instead of 4 kB); the docs say to disable THP; Redis 8.10 has `disable-thp yes` by default. Src: LAT ("Latency induced by transparent huge pages"); CONF `disable-thp yes` (line ~1475).
- **R9.17 CONFIRMED.** `stop-writes-on-bgsave-error yes` (default): with at least one save point and a failed last background save, Redis refuses writes until a save succeeds. Src: CONF line 521; E1.
- **R9.18 CONFIRMED.** Never modified once produced; written under a temporary name and renamed atomically, so copying `dump.rdb` while running is safe. Src: PERSIST ("Backing up Redis data").
- **R9.19 OBSERVED (E8 case B).** Default config; 600 `INCR`, explicit `BGSAVE`, 400 more `INCR`, `kill -9`: after restart `counter` is 600. `INFO persistence` showed `rdb_changes_since_last_save:400` just before the crash. The "changes since last save" counter is the direct measure of what a crash would lose.
- **R9.20 CONFIRMED.** Redis 8.10.0 added the `BACKUP START/LIST/SEAL/CLEANUP/STATUS/ABORT` command family, producing a restorable BASE + INCR + manifest set without stopping writes, so a control plane can stagger forks across cluster nodes. Restore with startup-only `preload-file aof:<manifest>`. Src: PERSIST ("Online backups"). Mention at most in one sentence; not essential to caching.

### 9C. Append-only file (AOF)

- **R9.30 CONFIRMED.** AOF logs every write command in the Redis protocol format and replays it at startup. Since 7.0.0 it is "multi part": at most one base file (RDB or AOF format) plus incremental files, in a directory (`appenddirname`, default `appendonlydir`) tracked by a manifest. Src: PERSIST ("Append-only file"); CONF lines 1518–1524.
- **R9.31 OBSERVED (E8 case C, E16).** After 1,000 `INCR counter`: `appendonly.aof.1.base.rdb` (89 bytes), `appendonly.aof.1.incr.aof` (27,023 bytes), `appendonly.aof.manifest` (`file … seq 1 type b` / `file … seq 1 type i startoffset 0`). `BGREWRITEAOF` after 2,000 writes produced `appendonly.aof.2.base.rdb` (106 bytes) and a fresh empty `…2.incr.aof` with `startoffset 2000`; five more writes grew the new incr file to 50 bytes. The base file begins `REDIS0015`+`redis-ver 8.10.3`, i.e. it is RDB-format (`aof-use-rdb-preamble yes`, CONF line 1640).
- **R9.32 DERIVED / OBSERVED.** An AOF record is the command in RESP, so `INCR counter` is 27 bytes: `*2\r\n` 4 + `$4\r\n` 4 + `INCR\r\n` 6 + `$7\r\n` 4 + `counter\r\n` 9. 1,000 of them = 27,000; observed 27,023 (the extra 23 bytes are the `SELECT 0` that precedes the first write: `*2\r\n$6\r\nSELECT\r\n$1\r\n0\r\n` = 23). Good small model for "why rewriting shrinks the file": 100 increments of one counter are 100 log entries but one key.
- **R9.33 CONFIRMED.** Three `appendfsync` policies: `always` (fsync after each batch of commands before replying; "very very slow, very safe", supports group commit so parallel writes share one fsync), `everysec` (default; "you may lose 1 second of data"), `no` (never fsync; Linux "normally" flushes about every 30 seconds, kernel dependent). Src: PERSIST ("How durable is the append only file?"); default OBSERVED E1.
- **R9.34 CONFIRMED (source).** Subtlety behind "one second": with `everysec`, if a background fsync is still running, Redis may postpone the `write()` for up to 2,000 ms before forcing it, counting `aof_delayed_fsync`. So under a slow disk the real exposure can exceed one second. Src: AOFC lines 1443–1455 (`mstime - aof_flush_postponed_start < 2000`). Docs claim "only lose one second worth of writes" (PERSIST); state both.
- **R9.35 OBSERVED (E8 cases C, D).** `appendfsync everysec` and `always` both recovered all writes after `kill -9` (1,000 and 300). Remember the caveat: this is a process crash only. `WAITAOF 1 0 1000` returned `1` and `0` (local fsynced = 1, replicas = 0).
- **R9.36 CONFIRMED.** `WAITAOF numlocal numreplicas timeout` (since Redis 7.2.0) blocks until previous writes by this connection are fsynced to the local AOF and/or to the given number of replicas' AOFs; returns two integers (local, replicas); cannot be used on replicas; `numlocal` must be 0 if AOF is off. OBSERVED: `ERR WAITAOF cannot be used when numlocal is set but appendonly is disabled.` (E3). Src: WAITAOF.
- **R9.37 OBSERVED (E8 case E).** Truncated AOF: cutting 7 bytes off the incr file (a half-written last command) and restarting loaded 999 of 1,000 increments, logging `Truncating the AOF appendonly.aof.1.incr.aof at offset 26996` and `loaded anyway because aof-load-truncated is enabled`. Matches the documented default (`aof-load-truncated yes`). Src: PERSIST ("What should I do if my AOF gets truncated?"); CONF line 1616.
- **R9.38 CONFIRMED.** Automatic rewrite defaults: `auto-aof-rewrite-percentage 100`, `auto-aof-rewrite-min-size 64mb` (observed 67108864, E1). `no-appendfsync-on-rewrite no`. Redis never runs an RDB save and an AOF rewrite at the same time (a requested rewrite waits). Src: CONF lines 1572–1592; PERSIST.
- **R9.39 CONFIRMED.** Before Redis 7.0 a rewrite buffered new writes in memory and wrote them twice; 7.0+ opens a new incremental file instead. Switching from RDB to AOF by editing config and restarting "can result in data loss": enable with `CONFIG SET appendonly yes` first. Src: PERSIST.
- **R9.40 UNCONFIRMED.** Whether any fork-latency or throughput penalty of AOF `always` can be given as a number for this article. Docs only say "very slow". Do not give a figure unless the writer runs `redis-benchmark` on Linux hardware.

### 9D. Asynchronous replication

- **R9.50 CONFIRMED.** Three mechanisms: (1) a connected replica receives a stream of the commands that change the dataset (client writes, keys expired or evicted, other changes); (2) on a broken link it reconnects and tries a partial resynchronisation; (3) if that is impossible it requests a full resynchronisation (snapshot, then stream). Replication is asynchronous by default; replicas acknowledge the amount of data processed asynchronously. Src: REPL.
- **R9.51 CONFIRMED.** Replication is non-blocking on the master; a replica can serve the old dataset during initial sync if `replica-serve-stale-data yes` (default, OBSERVED E1) but "will block incoming connections" for the window when it discards the old dataset and loads the new one, "as long as many seconds for very large datasets". Src: REPL ("Important facts about Redis replication").
- **R9.52 CONFIRMED / OBSERVED.** Replication ID and offset: every master has a replid ("a large pseudo random string that marks a given history of the dataset") and an offset that "increments for every byte of replication stream"; the pair identifies an exact dataset version. A promoted replica generates a new replid and keeps the old one as `master_replid2` / `second_repl_offset` so the old master's replicas can partially resync. Src: REPL ("How Redis replication works", "Replication ID explained"). OBSERVED INFO fields (E2): `master_replid`, `master_replid2:000…`, `master_repl_offset`, `second_repl_offset:-1`, `repl_backlog_active`, `repl_backlog_size`, `repl_backlog_first_byte_offset`, `repl_backlog_histlen`.
- **R9.53 OBSERVED (E4).** What the stream looks like (a raw-socket replica after `PSYNC ? -1`): `+FULLRESYNC <replid> <offset>`, an RDB payload (175 bytes for a near-empty dataset), then commands. The replication stream rewrites relative times to absolute: `SET user:1 alice EX 100` arrives as `SET user:1 alice PXAT 1793133633192`; `SET … PX` likewise; `EXPIRE user:3 50` arrives as `PEXPIREAT user:3 <ms>`; `SETEX short 1 x` as `SET short x PXAT <ms>`. `GETEX … PERSIST` arrives as `PERSIST`. When `short` expired on the master the stream carried `DEL short` (E4, last line). This is why replicas do not need synchronised clocks to agree on TTLs.
- **R9.54 CONFIRMED.** Replicas do not expire keys themselves: the master sends `DEL` when it expires or evicts a key. Because the `DEL` can be late, a replica uses its own clock only to hide logically-expired keys from **read** commands. Once promoted, a replica expires keys independently. Lua scripts see a frozen time. Src: REPL ("How Redis replication deals with expires on keys"). (Article 4 mentions this briefly; article 9 owns it.)
- **R9.55 CONFIRMED.** Replicas ignore `maxmemory` by default (`replica-ignore-maxmemory yes`, OBSERVED E1) and evict nothing: eviction on the master is propagated as `DEL`. So a replica can use more memory than `maxmemory` (extra buffers) and must be provisioned with headroom. Src: REPL ("Maxmemory on replicas").
- **R9.56 CONFIRMED.** `replica-read-only yes` by default (OBSERVED E1) since 2.6; a replica rejects writes, but admin commands remain enabled, so it is not safe to expose. Src: REPL.
- **R9.57 CONFIRMED.** Replicas can replicate from other replicas (cascading); since Redis 4.0 all sub-replicas get the same stream. Src: REPL.
- **R9.58 CONFIRMED.** Full resync, disk-based: master runs `BGSAVE`, buffers new writes, sends the RDB, then the buffered commands; several replicas arriving together share one background save. Diskless (since 2.8.18): the child writes the RDB straight to replica sockets. Defaults in 8.10.3: `repl-diskless-sync yes`, `repl-diskless-sync-delay 5` (seconds, waits for more replicas to arrive), `repl-diskless-sync-max-replicas 0`, `repl-diskless-load disabled`. OBSERVED E1. Src: REPL; CONF lines 679–732.
- **R9.59 CONFIRMED (version-specific).** Redis 8.0 introduced a new replication mechanism that sends the RDB and the replication stream on two connections in parallel ("RDB channel"); the replica buffers the stream during the fullsync, bounded by `replica-full-sync-buffer-limit` (0 = inherit the replica output buffer hard limit). In 8.10.3 the hidden config `repl-rdb-channel` defaults to yes. Redis claims 18% faster replication and 35% memory savings on replicas in 8.0 (vendor figures). Src: CONF lines ~790–810; CONFC line 3417 (`repl-rdb-channel … 1`); https://redis.io/docs/latest/develop/whats-new/8-0/ . UNCONFIRMED: exactly when the master chooses this path rather than the old one ("may decide", CONF).
- **R9.60 CONFIRMED.** Valkey 8.0 has the equivalent "dual-channel replication": RDB and replica backlog transferred simultaneously; vendor claims sync time cut by up to 50% with heavy read load, lower primary memory pressure. Src: VALKEY8. Mention only if the article names Valkey.

### 9E. Partial resynchronisation, the backlog and replica staleness

- **R9.65 CONFIRMED.** The master keeps a replication backlog, a circular buffer of recent stream bytes. `repl-backlog-size` default 1 MB (OBSERVED 1048576, E1); allocated only while a replica is connected (`repl-backlog-active`); freed after `repl-backlog-ttl 3600` s with no replicas. Replicas never free it (they may be promoted). Src: CONF lines 779–792.
- **R9.66 OBSERVED (E5).** `PSYNC <replid> <offset>`, where the offset is the next byte the replica wants (replica_offset + 1): the master answered `+CONTINUE` and replayed exactly the missing commands (`PEXPIREAT user:3 …` through `DEL short`), then a `ping`. A replica presenting an unknown replid (`000…0`) received `+FULLRESYNC` and a new RDB.
- **R9.67 OBSERVED (E6).** After shrinking the backlog to 16,384 bytes (the smallest `CONFIG SET` accepted that I tried; UNCONFIRMED as a documented minimum) and writing ~200 KB, `repl_backlog_first_byte_offset` moved past the old offset and the same `PSYNC` produced `+FULLRESYNC` (6,362-byte RDB). A backlog smaller than (write rate × disconnect time) forces a full resync.
- **R9.68 DERIVED (illustrative).** Backlog sizing: bytes per second of replication stream × longest outage you want to survive without a full sync. Example: 5,000 writes/s × about 60 bytes per command (E4 shows 25–66 bytes per command) = 300 KB/s, so the default 1 MB backlog covers about 3 s; for a 60 s network blip you need about 18 MB. Label as illustrative.
- **R9.69 CONFIRMED.** Replication timeouts: `repl-ping-replica-period 10` s, `repl-timeout 60` s (observed E1). Replicas send `REPLCONF ACK` every second; the master tracks each replica's last ack (`lag=` in `INFO replication`: OBSERVED `slave0:ip=127.0.0.1,port=0,state=online,offset=0,lag=24` for my fake replica that never acked). Src: REPL ("Allow writes only with N attached replicas"); E4.
- **R9.70 CONFIRMED.** Fields to monitor, all present in 8.10.3 `INFO`: master: `connected_slaves`, `slaveN:…offset=…,lag=…`, `master_repl_offset`, `repl_backlog_*`, `min_slaves_good_slaves`, `sync_full`, `sync_partial_ok`, `sync_partial_err`; replica: `master_link_status`, `master_last_io_seconds_ago`, `master_sync_in_progress`, `slave_repl_offset`, `slave_read_repl_offset`, `master_link_down_since_seconds`, `slave_priority`. Lag in bytes = `master_repl_offset − slave_repl_offset`. Src: SRVC lines ~6867–6965 (field names); memory: `mem_replication_backlog`, `mem_clients_slaves`.
- **R9.71 CONFIRMED.** Reading from replicas serves possibly stale data: replication is asynchronous and the master "does not wait every time for a command to be processed by the replicas". For a cache, replica reads add another staleness source on top of TTL and invalidation delay. Src: REPL.
- **R9.72 CONFIRMED.** A restarted replica can partially resync if it was shut down with `SHUTDOWN` (it stores replication info in the RDB); not possible after an AOF-only restart. Since 4.0 a promoted replica can partially resync with the old master's replicas. Src: REPL ("Partial sync after restarts and failovers").
- **R9.73 CONFIRMED.** `shutdown-timeout 10` (OBSERVED E1): on SIGINT/SIGTERM a master with replicas waits up to this many seconds for lagging replicas to catch up before exiting (`shutdown-on-sigterm default`; `now` skips the wait). Src: CONF lines ~1700–1730.

### 9F. WAIT, `min-replicas-to-write` and what they do not give

- **R9.80 CONFIRMED.** `WAIT numreplicas timeout` (since 3.0.0, O(1)) blocks until all previous writes of this connection are acknowledged by at least `numreplicas` replicas or the timeout (ms; 0 = forever); returns the number of replicas that acknowledged, in both success and timeout cases, so the client must compare the result with what it required. Inside `MULTI` or scripts it does not block. Src: WAIT.
- **R9.81 CONFIRMED.** `WAIT` does not make Redis strongly consistent: "acknowledged writes can still be lost during a failover". It only makes it more likely the promoted replica has the write. Src: WAIT ("Consistency and WAIT"), REPL.
- **R9.82 OBSERVED (E3).** With no replicas: `WAIT 1 200` returned `0` after the timeout; `WAIT 0 0` returned `0` immediately.
- **R9.83 CONFIRMED / OBSERVED.** `min-replicas-to-write N` plus `min-replicas-max-lag S` (defaults 0 and 10): a master refuses writes unless at least N replicas have acked within S seconds. OBSERVED with N=1 and no replica: `NOREPLICAS Not enough good replicas to write.` (E3). Docs call it a best-effort bound on the loss window, not a guarantee, and it trades availability for safety (all replicas down means the master refuses writes). Src: REPL; SENT.
- **R9.84 CONFIRMED.** In the partitioned-old-master scenario, clients that stay connected to the old master keep writing and "this data will be lost forever" once it is demoted; `min-replicas-to-write 1` + `min-replicas-max-lag 10` makes the old master unavailable after 10 s. The Sentinel documentation says that for a **cache**, continuing to accept those writes "could be handy", for a store it is not good. Src: SENT ("Consistency under partitions").

### 9G. Redis Sentinel

- **R9.90 CONFIRMED.** Sentinel monitors masters and replicas, detects failure, promotes a replica, reconfigures the others, and tells clients the new address. It is distributed; it needs "at least three Sentinel instances for a robust deployment", on machines that fail independently. Default port 26379. Src: SENT.
- **R9.91 CONFIRMED.** Config: `sentinel monitor <name> <ip> <port> <quorum>`. Quorum is the number of Sentinels that must agree the master is unreachable to flag it ODOWN; it is used only for detection. To actually fail over, one Sentinel must be elected leader with votes from a **majority of all Sentinels** (or more than the majority if quorum is larger). Example in the docs: 5 Sentinels, quorum 2: two agreeing start the process, three authorise it. Src: SENT ("Quorum" section).
- **R9.92 CONFIRMED / OBSERVED.** Defaults: `down-after-milliseconds` 30000, `failover-timeout` 180000 (3 min), `parallel-syncs` 1. OBSERVED in `SENTINEL MASTER` (E17): `down-after-milliseconds 30000`, `failover-timeout 180000`, `parallel-syncs 1`. Src: SENTCONF lines 125–233; SENTC `sentinel_default_down_after = 30000`, `sentinel_default_failover_timeout = 60*3*1000`.
- **R9.93 OBSERVED (E17).** A lone Sentinel (quorum 2) watching a non-existent master logged `+monitor` at 21:44:10.257 and `+sdown` at 21:44:40.321, 30.06 s later, matching `down-after-milliseconds`. It never reached ODOWN (`SENTINEL CKQUORUM` → `NOQUORUM 1 usable Sentinels…`), `SENTINEL GET-MASTER-ADDR-BY-NAME` still returned the dead address, and `SENTINEL FAILOVER` → `NOGOODSLAVE No suitable replica to promote`.
- **R9.94 CONFIRMED.** SDOWN (subjectively down): one Sentinel has had no valid reply to PING for the whole `down-after-milliseconds`. Valid replies are `+PONG`, `-LOADING`, `-MASTERDOWN`. ODOWN (objectively down): at least `quorum` Sentinels report SDOWN (weak agreement via `SENTINEL is-master-down-by-addr`); applies to masters only. A master that advertises itself as a replica is treated as down. Src: SENT ("SDOWN and ODOWN").
- **R9.95 CONFIRMED.** Each failover takes a unique configuration epoch obtained by majority authorisation; the highest epoch wins when configurations are broadcast over the `__sentinel__:hello` Pub/Sub channel. A Sentinel that voted for another will not try to fail over the same master for `2 × failover-timeout`. Src: SENT ("Configuration epochs", "Configuration propagation").
- **R9.96 CONFIRMED.** Replica selection: skip replicas disconnected from the master for more than `down-after-milliseconds × 10 + time since the master entered SDOWN`; then sort by lowest `replica-priority` (default 100; 0 = never promote), then highest replication offset, then lexicographically smaller run ID. Src: SENT ("Replica selection and priority").
- **R9.97 CONFIRMED (source).** Failover has a random start delay up to `SENTINEL_MAX_DESYNC` = 1000 ms; election timeout 10 s; replica reconfiguration timeout 10 s. Src: SENTC lines 63–75, 4812, 5000.
- **R9.98 DERIVED.** Time to a new master with defaults: about 30 s detection + 0–1 s start delay + election/promotion round trips (sub-second on a healthy LAN; election timeout is 10 s if votes are lost) + client rediscovery. So "tens of seconds" by default; lowering `down-after-milliseconds` shortens it at the cost of false failovers during pauses (GC, `fork`, slow commands). The 30 s part is OBSERVED (R9.93); the rest is derived from constants above, not measured.
- **R9.99 CONFIRMED.** Client discovery: the client asks any Sentinel `SENTINEL get-master-addr-by-name <name>`, connects, **verifies with `ROLE`**, and re-resolves on every reconnect. When Sentinel reconfigures an instance it sends `CLIENT KILL type normal` so connected clients are forced to re-resolve. Clients may use `SENTINEL replicas <name>` to find replicas for reads. Src: SENTCLI.
- **R9.100 CONFIRMED.** Sentinel does not give write safety: "there is always the risk of losing some writes because a given acknowledged write may not be able to reach the replica which is promoted". Two Sentinels (no third box) is a broken layout: no majority on one side, risk of permanent split brain. Src: SENT (Examples 1–2).
- **R9.101 CONFIRMED.** Coordinated failover without Sentinel: `FAILOVER` (since 6.2.0) pauses writes (`CLIENT PAUSE WRITE`), waits for a replica to catch up, demotes the master, sends `PSYNC FAILOVER` to the target, resumes; `TIMEOUT`, `TO host port`, `FORCE` options; "typically less than a second"; track via `master_failover_state`. Useful for planned maintenance with zero lost writes. Src: FAILOVER.

### 9H. Managed services and Valkey (brief)

- **R9.110 CONFIRMED.** Amazon ElastiCache with Multi-AZ promotes "the replica with the least replication lag", then writes "can resume within seconds"; clients using the primary endpoint see the DNS name updated, so the application needs no change; replication is asynchronous so "a small amount of data might be lost"; a customer-initiated reboot of a primary does not trigger failover, and a rebooted primary comes back empty and clears its replicas ("causes data loss"), which echoes R9.08. Src: ELASTICACHE (Scenarios, Limitations). DNS-based endpoints mean clients must not cache the resolved IP indefinitely (DERIVED, standard practice; not stated in this page).
- **R9.111 CONFIRMED.** ElastiCache for Valkey 9.0+ offers an optional "durability" mode with a Multi-AZ transactional log: synchronous writes survive failover, asynchronous writes "may lose up to 10 seconds". Vendor feature, not Redis. Src: ELASTICACHE (Note). Mention only if the article discusses managed durability.
- **R9.112 UNCONFIRMED.** Failover durations for Azure Cache for Redis, Google Memorystore, Redis Cloud (not researched). Say "seconds to a minute, check your provider" or omit.

### 9I. Models and arithmetic the article can derive

1. **Data-loss window by mode.** No persistence: everything. RDB: up to the longest save interval at the observed write rate. With defaults and, say, 50 writes in 5 minutes (under the 100-change threshold) the first trigger is the one-hour/1-change rule, so a crash can lose up to about an hour of writes (DERIVED from the three defaults, R9.03). AOF everysec: about 1 s, up to about 2 s when an fsync is slow (R9.34). AOF always: the last un-acknowledged command. Power loss versus process crash matters (caveat above).
2. **Replication offset lag.** Lag in bytes = `master_repl_offset − slave_repl_offset`; lag in seconds ≈ bytes ÷ stream rate. Backlog sizing per R9.68.
3. **Cold-start amplification** 1/(1−h) (R9.04).
4. **Fork pause.** Page-table copy 8 bytes per 4 kB page: seconds of fork = (GB × 2^30 ÷ 4096 × 8 bytes) ÷ copy rate; the observed range 9–15 ms/GB (good hardware, R9.13–14) gives about 90–150 ms for a 10 GB instance, ten times worse on bad virtualisation. The sort of number a figure can show as a stall on the request timeline.
5. **Sentinel majority.** majority = ⌊n/2⌋ + 1: 3→2, 5→3. Two Sentinels tolerate zero failures for failover purposes.

### 9J. Running examples and number status

Realistic scenarios:

1. **Product-catalogue cache on one primary plus one replica** (matches the collection's article-12 example). Events: replica added; primary host reboots for a kernel patch; a deploy restarts Redis. Contrast "restart empty" with "restart from RDB", and "failover to replica" with "failover with one second of lost writes".
2. **Session or rate-limit data that is *not* disposable**, to show the boundary: a login-session cache where loss logs users out (cost of loss is visible) versus a page-fragment cache where loss only costs database load. Lets the article argue persistence per data class.
3. **A nightly deploy that restarts a 40 GB cache** (illustrative size): cold start sends 100% of requests to a database sized for 5% (R9.04), versus RDB warm restart whose load time scales with size (R9.05: 0.33 s for 76 MB here, so seconds to minutes for tens of GB; not measured).

Which numbers may be measured (in a figure's caption) and which must be illustrative:

- **Measured on this Mac, may be quoted as "observed on a local Redis 8.10.3 (macOS)":** crash-recovery results by mode (E8), AOF file sizes and manifest (E8, E16), command rewriting in the stream (E4), PSYNC `+CONTINUE` and `+FULLRESYNC` behaviour and backlog loss (E5, E6), `NOREPLICAS` and `WAIT` return values (E3), Sentinel +sdown after 30.06 s (E17), fork 1,962 µs for 128 MiB RSS (E7), RDB load 0.331 s (E19).
- **Illustrative only:** data-loss minutes, hit ratios, database capacity, cache size in GB, write rates, failover durations beyond the 30 s SDOWN, any "requests failed during failover" curve, managed-service durations.
- **Do not present as typical:** fork times from macOS, memory/fragmentation, anything about copy-on-write growth.

### 9K. Pitfalls checklist (all CONFIRMED unless marked)

- Persistence off + auto-restart + replicas = replicas wiped (R9.08).
- Enabling AOF by editing the config and restarting can lose data; use `CONFIG SET` first (R9.39).
- Replicas ignore `maxmemory`; provision headroom (R9.55).
- `WAIT` returns a count, not an error, on timeout (R9.80).
- A master that fails `min-replicas-to-write` returns `-NOREPLICAS`; a cache client must treat that as "bypass the cache", not crash (R9.83; DERIVED handling advice).
- Sentinel needs three boxes; quorum is not the failover majority (R9.91, R9.100).
- Sentinel default detection is 30 s (R9.92–93).
- Clients must re-resolve through Sentinel and check `ROLE`; a fixed IP breaks at failover (R9.99).
- `redis-cli --rdb` and a replica's `SYNC` both trigger a fork on the master (CONFIRMED REPL/CLI); frequent full syncs mean repeated forks.
- THP on makes fork/COW stalls worse (R9.16).
- `current_cow_size` is not reliable on macOS (R9.15).

---

## Article 10: `cluster-and-hot-keys`

Suggested title shape: "Redis Cluster, sharding and hot keys" (searchable: "Redis Cluster hash slots", "hot key Redis", "client-side caching Redis").

### 10A. Why shard, and the alternatives

- **R10.01 CONFIRMED.** Redis Cluster goals in order: high performance and linear scalability to 1000 nodes (no proxies, asynchronous replication, no value merging); acceptable write safety; availability when the majority of masters are reachable and each unreachable master has at least one reachable replica. Src: CLSPEC ("Redis Cluster goals").
- **R10.02 CONFIRMED.** "Redis Cluster does not use consistent hashing"; it uses fixed hash slots. Src: SCALE ("Redis Cluster data sharding"). So client-side consistent hashing (ketama-style rings used with memcached and in older Redis client-side sharding) is a different design; article 10 needs one brief paragraph. UNCONFIRMED: no primary source was fetched for the consistent-hashing algorithm itself; cite Karger et al. 1997 only if the writer retrieves it.
- **R10.03 CONFIRMED.** Normal operation matches a single instance, multiplied by N masters: "the same performance as a single Redis instance multiplied by N as the design scales linearly", a request is usually one round trip because clients keep persistent connections to each node. Src: CLSPEC ("Performance").
- **R10.04 CONFIRMED.** Cluster supports only database 0: `SELECT` errors. OBSERVED (E10): `ERR SELECT is not allowed in cluster mode`. Valkey 9.0 added multiple databases in cluster mode (CONFIRMED by the 9.0 release coverage, vendor press; see R10.49). Impacts anyone using `SELECT 1` to separate a cache from other data.
- **R10.05 DERIVED.** When to shard: a single primary is limited by RAM of one host, one main thread for commands (article 7), and network/CPU at the key level (R10.40 on hot keys). Replicas add read throughput and safety but not write throughput or memory; sharding adds both. A cache that fits in one host's RAM and below one core's throughput does not need Cluster.

### 10B. Hash slots

- **R10.10 CONFIRMED.** 16,384 slots; `HASH_SLOT = CRC16(key) mod 16384`. CRC16 is the XMODEM variant (poly 0x1021, init 0, no reflection, no final xor; check value `"123456789"` → `0x31C3`); "14 out of 16 CRC16 output bits are used". OBSERVED (E11): Python implementation gives `0x31c3` for `123456789`, and every key I tested matched `CLUSTER KEYSLOT` (e.g. `foo` → 12182, `bar` → 5061, `123456789` → 12739).
- **R10.11 CONFIRMED (primary-source reasoning).** Why 16,384, from the author: heartbeat packets carry the node's slot bitmap; 16k slots = 2 kB, 65k = 8 kB; he judged more than about 1000 masters unlikely, so 16k slots leaves enough per master. Compressing the bitmap does not help in small clusters. Src: ISSUE2576 (antirez's comment). DERIVED: 16,384 slots over 1,000 masters ≈ 16 slots each.
- **R10.12 CONFIRMED.** Suggested maximum about 1000 nodes; hard limit 16,384 masters. Each node serves a subset of slots; the example split is A 0–5500, B 5501–11000, C 11001–16383. Src: CLSPEC, SCALE.
- **R10.13 CONFIRMED / OBSERVED.** Hash tags: if a key contains `{` with a `}` to its right and at least one character between the **first** `{` and the **first** following `}`, only that substring is hashed. Docs examples reproduced in E10/E11: `{user1000}.following` and `{user1000}.followers` both → slot 3443 (same as the bare `user1000`); `foo{}{bar}` hashes whole (8363); `foo{{bar}}zap` hashes `{bar` (4015); `foo{bar}{zap}` hashes `bar` (5061, same as `bar`); `user:{123}:profile` and `user:{123}:account` → 5970. Src: CLSPEC ("Hash tags"); SCALE.
- **R10.14 OBSERVED / DERIVED.** Cache-key design consequence: hash tags force related keys onto one slot (needed for multi-key commands) but also concentrate their traffic on one shard (see R10.43). Put a tag only where you need atomic multi-key operations. Slot 0 happened to hold `product:1`, a reminder that a slot is just a bucket of keys.
- **R10.15 CONFIRMED / OBSERVED.** Multi-key commands (`MGET`, `MSET`, transactions, Lua scripts) work only if all keys share a slot. OBSERVED: `MSET a 1 b 2` → `CROSSSLOT Keys in request don't hash to the same slot`; `MSET {u}a 1 {u}b 2` → OK. Consequence for cache reads: a client library must split `MGET` by slot and send one request per node (pipelining across nodes). Src: SCALE; CLSPEC ("Multi-keys operations"). During resharding, a multi-key operation on keys split between source and target gets `-TRYAGAIN`.
- **R10.16 CONFIRMED.** `SCAN 0 MATCH {abc}*` is slot-aware; patterns like `*{abc}` are not. Src: CLSPEC.
- **R10.17 OBSERVED.** A single-node cluster must have its slots assigned before it serves anything: before `CLUSTER ADDSLOTSRANGE 0 16383`, `SET foo bar` → `CLUSTERDOWN Hash slot not served` and `cluster_state:fail`; after, `cluster_state:ok`, `cluster_slots_assigned:16384`. `CLUSTER NODES` shows `… myself,master - … connected 0-16383`. (E10)

### 10C. Redirections, the slot map and clients

- **R10.20 CONFIRMED.** `-MOVED <slot> <host>:<port>` means the slot lives permanently at that node; the client should update its slot map and retry. `-ASK` means "for this one query, ask the target node", sent while the slot is being migrated and the key is not on the source; the client sends `ASKING` then the query to the target and keeps using the old node for later queries. A node with a slot IMPORTING accepts queries only after `ASKING`. Src: CLSPEC ("MOVED Redirection", "ASK redirection"). Not observable on a single node.
- **R10.21 CONFIRMED.** Clients keep a slot-to-node table and should refresh the **whole** table on MOVED rather than one slot, and initialise it with `CLUSTER SHARDS` / `CLUSTER SLOTS` at start. A node reply of `-MOVED` is a normal event, not an error to alarm on, but a storm of them during a reshard or failover is visible latency. Src: CLSPEC ("Client connections and redirection handling").
- **R10.22 CONFIRMED.** A replica redirects reads to its master unless the connection sent `READONLY`, after which it serves reads for its master's slots and redirects otherwise; `READWRITE` clears it. Reads may be stale (async replication). Src: CLSPEC ("Scaling reads using replica nodes").
- **R10.23 CONFIRMED.** Each node uses two ports: the data port and a cluster bus port, by default data port + 10,000 (`cluster-port` overrides). The bus must be reachable between nodes and never from clients; it has no authentication of its own (redis.conf warns). OBSERVED (E10): listeners on `127.0.0.1:7205` and `127.0.0.1:17205`. Src: SCALE; CONF line ~1770. Docker/NAT needs host networking or announce settings.
- **R10.24 CONFIRMED.** Minimum for a real Cluster: "at least three master nodes"; recommended six (three masters, three replicas). Created with `redis-cli --cluster create host:port … --cluster-replicas 1`. Src: SCALE.
- **R10.25 CONFIRMED.** Cluster state controls: `cluster-require-full-coverage yes` (default) — the node stops accepting queries if any slot is uncovered; `no` keeps serving the covered slots. `cluster-allow-reads-when-down no` (default) — `yes` lets a node serve reads while the cluster is down (CONF comments name caches as the use case) but still refuses writes. OBSERVED (E12b) with 8,192 of 16,384 slots assigned: default → `CLUSTERDOWN The cluster is down` for all keys; `allow-reads-when-down yes` → `GET bar` returned the value and `SET` returned `CLUSTERDOWN The cluster is down and only accepts read commands`; `require-full-coverage no` → covered slots read/write OK and uncovered keys `CLUSTERDOWN Hash slot not served`. Src: CONF lines 1872–1912; SCALE. Note: cluster state is recomputed asynchronously, so changes show after a delay (my first attempt, E12, was timing-sensitive; E12b waited 3 s).

### 10D. Failover and write safety in Cluster

- **R10.30 CONFIRMED.** Cluster uses asynchronous replication, so acknowledged writes can be lost: the master replies to the client at about the same time it sends the write to replicas, and if it dies first and a replica without the write is promoted, the write is lost. "Last failover wins"; no merge. `WAIT` helps but does not make it strongly consistent. Src: CLSPEC ("Write safety"), SCALE.
- **R10.31 CONFIRMED.** Failure detection: a node flags another PFAIL after no pong for `NODE_TIMEOUT` (`cluster-node-timeout`, **default 15000 ms** in 8.10.3: OBSERVED E1, CONFC line 3574; the SCALE tutorial uses 5000); PFAIL becomes FAIL when a majority of masters report PFAIL/FAIL within `NODE_TIMEOUT × 2`; FAIL is then broadcast. Nodes reconnect after half the timeout without a reply. Src: CLSPEC ("Failure detection"); CLH `CLUSTER_FAIL_REPORT_VALIDITY_MULT 2`.
- **R10.32 CONFIRMED.** Replica election: delay = 500 ms + random 0–500 ms + `REPLICA_RANK × 1000` ms (rank 0 = most up-to-date replica by offset); candidate asks masters for votes with a new `currentEpoch`; needs a majority of masters; waits up to `2 × NODE_TIMEOUT` (at least 2 s) for replies; masters will not vote again for replicas of the same master for `NODE_TIMEOUT × 2`. Winner takes a new `configEpoch` and slots. Src: CLSPEC ("Replica election and promotion", "Replica rank").
- **R10.33 DERIVED.** Minimum time from master death to a writable replacement with defaults: 15 s (PFAIL) + gossip to FAIL (a few hundred ms) + 0.5–1 s (election delay for rank 0) + vote round trip ≈ 16–17 s. Order of magnitude only; never measured here (no multi-node cluster). The SCALE tutorial's own failover test lost "578 reads and 577 writes" during failover with a 5 s timeout (SCALE; vendor tutorial, not a benchmark).
- **R10.34 CONFIRMED.** A replica will not fail over if disconnected from its master longer than `node-timeout × cluster-replica-validity-factor + repl-ping-replica-period` (factor default 10). Zero means always try. Src: CONF lines 1815–1840; OBSERVED default 10 (E1).
- **R10.35 CONFIRMED.** A minority partition cannot serve; the majority side becomes available again after `NODE_TIMEOUT` plus a few seconds, if every unreachable master has a reachable replica. With N masters each with one replica, losing two random nodes leaves the cluster unavailable with probability 1/(2N−1) (5 masters: 11.11%). Src: CLSPEC ("Availability"). Replica migration moves spare replicas to orphaned masters (`cluster-migration-barrier 1`).
- **R10.36 CONFIRMED.** Manual: `CLUSTER FAILOVER` (on a replica) performs a coordinated switch; `redis-cli --cluster reshard|rebalance` move slots. Src: SCALE; command docs.

### 10E. Resharding and slot migration

- **R10.45 CONFIRMED.** Legacy migration (Redis before 8.4, still available): set `IMPORTING` on the target and `MIGRATING` on the source, move keys in batches with `CLUSTER GETKEYSINSLOT` + `MIGRATE`, then `CLUSTER SETSLOT <slot> NODE <target>`. `MIGRATE` serialises a key, sends it, deletes it, atomically per key. Queries to a migrating slot get `-ASK` for keys already moved. Src: CLSPEC ("Live reconfiguration"); ASM blog.
- **R10.46 CONFIRMED.** Problems of key-by-key migration (vendor list): redirects and broken naive pipelines; `TRYAGAIN` on multi-key commands; half-moved slots after failure (e.g. target out of memory); replicas not knowing a slot is migrating; slow per-key overhead; `MIGRATE` of a huge key can time out and spike latency. Src: ASM.
- **R10.47 CONFIRMED (version-specific).** Redis 8.4.0 added **atomic slot migration**: `CLUSTER MIGRATION IMPORT start end [start end …]` run on the destination master, `STATUS`, `CANCEL`. The whole slot is snapshotted (a fork on the source) and streamed over a dedicated connection while live writes are forwarded, followed by a single ownership handoff; the source briefly pauses writes at handoff. Defaults: `cluster-slot-migration-handoff-max-lag-bytes` 1 MB, `cluster-slot-migration-write-pause-timeout` 10 s. After handoff the source trims the slot, in the background when possible. Src: CLMIG; ASM.
- **R10.48 CONFIRMED (vendor benchmark, cite as such).** Redis's own test (8.4, 10 M keys, 512-byte values ≈ 5 GB, 3→4 shards): migration of a third of the slots took 6.4 s in total; legacy 192–219 s; 2.1 `MOVED`/s versus up to 241.6; maximum latency spikes under 70 ms versus up to 127 ms. Src: ASM. Present as "Redis reports", not as a general result.
- **R10.49 CONFIRMED.** Valkey 9.0 (GA 21 October 2025) also ships atomic slot migration, plus hash-field expiration and multiple databases in cluster mode; its design is snapshot-based with a single handoff. Src: https://www.linuxfoundation.org/press/valkey-9.0-delivers-performance-and-resiliency-for-real-time-workloads and https://thenewstack.io/valkey-9-0-debuts-multidatabase-clustering-for-massive-scale-workloads/ (vendor/press; the official 9.0 release notes were not retrieved, so fine details are UNCONFIRMED).
- **R10.50 DERIVED.** What resharding does to a *cache*: moved slots arrive with their data, so no cold start. If you instead just add a node and let the client re-hash (client-side sharding with modulo or ring hashing), a large share of keys change owner and miss. With simple `hash mod N`, going from N to N+1 changes owner for roughly N/(N+1) of keys (4→5 shards: 80%); with fixed slots moved explicitly, only the moved slots (about 1/(N+1) of keys for an even rebalance) change owner. Arithmetic is exact for uniform hashing; label as a model.

### 10F. Finding hot keys and hot slots

- **R10.55 CONFIRMED / OBSERVED.** `redis-cli --hotkeys` scans with `SCAN` and reads each key's LFU counter. It works only when `maxmemory-policy` is an LFU policy. OBSERVED (E14): under `noeviction` it exits 1 with `Error: ERR An LFU maxmemory policy is not selected, access frequency not tracked. Please note that when switching between policies at runtime LRU and LFU data will take some time to adjust.` Under `allkeys-lfu` it printed a summary of hot keys with their counters. Src: CLI (`--hotkeys` usage line); E14.
- **R10.56 OBSERVED (surprise worth a figure).** The LFU counter is logarithmic and saturates, so it ranks keys but does not give request counts. With a Zipf (exponent 1) workload of 50,000 reads over 1,000 keys, the true counts were item:0 6,721 (13.4%), item:1 3,370, item:2 2,266, item:3 1,636, item:4 1,361; `--hotkeys` reported counters item:0 40, item:1 31, item:4 25, item:2 24, item:6 20 (rank is approximately right; the 6,721-versus-40 gap shows the log scale; item:4 outranked item:2 and item:3, so ranks inside the top few are noisy). `OBJECT FREQ` gave 40, 31, 19, 7, 6 for item:0, 1, 10, 500, 999. Defaults `lfu-log-factor 10`, `lfu-decay-time 1` (minute) (E1). Mechanism owned by article 4; cite it.
- **R10.57 CONFIRMED.** Cost: `--hotkeys` (like `--bigkeys`) uses `SCAN`, so it is non-blocking per call but touches the whole keyspace; `-i 0.01` throttles it. `MONITOR` "can reduce throughput by more than 50%"; more `MONITOR` clients reduce it further. Src: CLI; MONITOR.
- **R10.58 CONFIRMED / OBSERVED (Redis 8.6.0+).** The `HOTKEYS` command family (`START METRICS count [CPU] [NET] [COUNT k] [DURATION s] [SAMPLE ratio] [SLOTS n slot…]`, `GET`, `STOP`, `RESET`) tracks hot keys over a time window by CPU time share and network-bytes share in a probabilistic structure; one session at a time; `SAMPLE ratio` samples each key with probability 1/ratio to reduce overhead; `COUNT` is the top-K size (the Rust client documents a 1–64 range; the server limit itself is UNCONFIRMED); `SLOTS` only in cluster mode. `redis-py` and `go-redis` cluster clients do not support it; connect to a single node. OBSERVED (E13): 10,200 commands, 9,000 of them `GET product:1`: `by-cpu-time-us` product:1 403 of 556 µs total; `by-net-bytes` product:1 207,023 of 238,078 bytes. Unlike `--hotkeys` it needs no LFU policy and measures cost, not recency of use. Src: HOTKEYS, hotkeys-start, hotkeys-get docs; E13.
- **R10.59 CONFIRMED / OBSERVED (Redis 8.2.0+).** `CLUSTER SLOT-STATS SLOTSRANGE a b | ORDERBY metric [LIMIT n] [ASC|DESC]` returns per-slot `key-count`, `cpu-usec`, `network-bytes-in`, `network-bytes-out` (and `memory-bytes`, from 8.4); all but `key-count` need `cluster-slot-stats-enabled yes`, which in 8.10.3 **must be set at start-up** (`CONFIG SET` fails with `memory tracking cannot be enabled at runtime`: OBSERVED E13). Complexity O(N) slots, O(N log N) with `ORDERBY`. OBSERVED (E13): slot 0 (holding `product:1`) cpu-usec 377 with 135,018 bytes in / 72,005 bytes out; the next slots 16 and 9 µs. Src: SLOTSTATS; ASM blog; E13. This is the cluster-native way to find a hot **shard** and decide which slots to move.
- **R10.60 CONFIRMED.** Hash tags can pin hot keys together; `INFO` per node (`instantaneous_ops_per_sec`, `instantaneous_input_kbps`, `used_memory`) shows which shard is hot before you look at keys. DERIVED advice: compare per-node CPU and ops, not just cluster totals.

### 10G. Hot-key arithmetic

- **R10.65 DERIVED / computed (E18).** Zipf share arithmetic. With request probability ∝ 1/rank^s over N keys, the top key's share is 1/H_N for s=1 (H_N the N-th harmonic number). N=100,000: H_N = 12.090, so the top key takes 8.27% of all requests; at 1,000,000 ops/s that is 82,712 ops/s on one key, near what one core can do for simple commands (illustrative; per-command cost varies). Top-key share for s=0.8 is 2.19%, for s=1.2 it is 19.64% (N=100,000).
- **R10.66 DERIVED / computed (E18, model, not Redis).** Hot shard model: N=100,000 keys `item:1…` with real CRC16 slots, S shards owning equal contiguous slot ranges. Hottest shard divided by fair share (1/S), and the usable fraction of cluster capacity before the hottest shard saturates (fair ÷ hottest):

| s | S=3 | S=6 | S=12 | S=24 |
| --- | --- | --- | --- | --- |
| 0.8 | 1.03 (97%) | 1.09 (92%) | 1.29 (77%) | 1.75 (57%) |
| 1.0 | 1.07 (93%) | 1.36 (73%) | 2.05 (49%) | 3.52 (28%) |
| 1.2 | 1.20 (83%) | 1.90 (53%) | 3.39 (29%) | 6.48 (15%) |

  Lesson: with a skewed workload, adding shards helps less and less; the hottest key's own load does not shrink when you add shards. Exact values depend on which slot the hottest keys fall into (one hash placement), so treat as one realisation of the model.
- **R10.67 DERIVED / computed (E18).** Key splitting: store the hot item as r copies `item:k#0…#r-1`, read a random copy, write all copies (s=1.0, S=12): no splitting 49% usable capacity; top 1 key into 4 copies 67%; top 10 keys into 4 copies 80%; top 10 into 16 copies 89%; top 100 into 16 copies 93%. Cost: r× the memory for those keys and r× invalidation/write fan-out, and copies can be briefly inconsistent (article 5).
- **R10.68 CONFIRMED (primary paper).** Facebook's memcache paper, section 3.2.3: a category of keys is replicated across servers when (1) the application routinely fetches many keys at once, (2) the whole data set fits in one or two servers, and (3) the request rate is much higher than one server can handle. Worked example: a server holding 100 items handling 500k requests/s, each request asking for 100 keys; splitting the key space across two servers still leaves each doing 1M requests/s, while replicating all 100 keys lets a request go to any replica and halves the per-server load to 500k/s. Clients choose replicas by their own IP. "This approach requires delivering invalidations to all replicas." Src: NISHTALA §3.2.3. Also §3.2.1: leases, token returned at most once per 10 s per key by default (stampede control; owned by article 6) and §3.3 Gutter pool (~1% of servers) to absorb failed servers (relevant to article 11).
- **R10.69 UNCONFIRMED.** Breslau et al. (1999) Zipf-like exponent range (I recall 0.64–0.83 across traces; not verified: the Wisconsin pages say only that the exponent "vary from trace to trace"). Use "Zipf-like with an exponent below or near 1" only if cited from the paper itself; the 80/20 power-law pattern used by `redis-cli --lru-test` is documented in CLI.

### 10H. Mitigating hot keys

- **R10.75 DERIVED.** The mitigation menu, ordered by cost: (1) near cache / client-side caching (R10.80–95) for read-mostly hot keys; (2) replicate the key under several names (R10.67) or serve it from replicas; (3) read from replicas with `READONLY` (cluster) or replica endpoints (R10.22, staleness R9.71), which helps a hot shard but not one key beyond one replica's capacity; (4) move other slots off the hot node (`CLUSTER SLOT-STATS` + `CLUSTER MIGRATION`) so the hot key has the machine to itself; (5) change the data model (shard a counter into N counters and sum on read).
- **R10.76 CONFIRMED (technique, general).** Split counters: write to one of N sub-keys, read all N with `MGET` (same slot by hash tag if you need atomic reads; different slots spread load). Not from a single primary source; present as standard practice.

### 10I. Client-side caching (near cache) with `CLIENT TRACKING`

- **R10.80 CONFIRMED.** Redis 6.0.0 added server-assisted client-side caching ("tracking"). Supported by clients from: `redis-py` 5.1.0, `Jedis` 5.2.0, `node-redis` 5.1.0, `go-redis` 9.22.0; other clients may expose `CLIENT TRACKING` without implementing the cache. Src: TRACK ("since 6.0.0"); CSCINTRO.
- **R10.81 CONFIRMED / OBSERVED.** Default mode: the server remembers which keys the connection read; when any client modifies, deletes or expires/evicts one, it sends an invalidation. With RESP3 the message arrives on the same connection as a push (`>2 invalidate [foo]`); with RESP2 it is redirected to another connection subscribed to `__redis__:invalidate`. OBSERVED (E15): A reads `foo`, B `SET foo` → A receives `['invalidate', ['foo']]`; RESP2 `REDIRECT` form delivered `['message', '__redis__:invalidate', ['foo']]` to the subscriber. Src: CSC.
- **R10.82 OBSERVED.** After an invalidation the key is **forgotten**: B changed `foo` twice; only the first change sent a push because A had not re-read it. A key A never read is never announced. (E15 sections 2–3) Consequence: the client must re-read (and re-register) after each invalidation. Src: CSC; E15.
- **R10.83 OBSERVED.** Setting a TTL is a modification: `PEXPIRE foo 500` made the server push an invalidation immediately; the later expiry sent nothing (the key was already forgotten). `DEL` pushes; `FLUSHALL` pushes a null invalidation (`['invalidate', None]`), meaning "drop everything". (E15)
- **R10.84 CONFIRMED / OBSERVED.** Broadcast mode (`BCAST`, optional `PREFIX`): the server stores no per-key state (only a prefix table), and sends an invalidation for **any** matching key change whether or not the client read it; costs CPU proportional to registered prefixes; overlapping prefixes (`foo` and `foob`) are not allowed; no prefix means every key. OBSERVED: with `PREFIX user:` the client received invalidations for `user:1` and `user:2` but not `order:1`, without having read anything; `tracking_total_prefixes:1` in `INFO stats`. Src: CSC; TRACK; E15.
- **R10.85 CONFIRMED / OBSERVED.** `OPTIN` tracks only reads preceded by `CLIENT CACHING YES`; `OPTOUT` tracks all but those preceded by `CLIENT CACHING NO`. OBSERVED: with `OPTIN`, A read `a` (not tracked) and `b` after `CACHING YES`; changes to both sent one push, for `b`. Src: TRACK; E15.
- **R10.86 CONFIRMED / OBSERVED.** `NOLOOP`: no invalidation for the client's own writes, but the key is still removed from the tracking table after that write; to be told about later changes by others the client must read it again. OBSERVED: A with NOLOOP wrote `n`; B then changed `n`; A received nothing until A re-read it. Src: TRACK; E15.
- **R10.87 CONFIRMED / OBSERVED.** The server's invalidation table is bounded by `tracking-table-max-keys` (default 1,000,000, OBSERVED E1). When full, Redis evicts an entry by sending a spurious invalidation. OBSERVED with the limit set to 3 and six distinct keys read: pushes arrived for `t4`, `t1`, `t6` even though nobody wrote them, and `tracking_total_keys` stayed at 3. So the client may lose cached entries at any time and must treat an invalidation as "maybe changed". Memory in default mode grows with (keys tracked × clients). Src: CSC; E15.
- **R10.88 CONFIRMED.** The tracking table has one namespace across database numbers, so a write to `foo` in DB 3 invalidates a client caching `foo` from DB 2. Src: CSC.
- **R10.89 CONFIRMED.** Race with two connections: if an invalidation overtakes the reply of the read it concerns, the client caches stale data. Fix: put a placeholder in the local cache before sending the read; drop the reply if the placeholder is gone. Impossible with a single RESP3 connection (ordering is known). Src: CSC ("Avoiding race conditions").
- **R10.90 CONFIRMED.** Connection loss: if the invalidation connection breaks, flush the local cache; ping the invalidation channel periodically and flush if no reply. Also cap every locally cached key with a maximum TTL "even if it has no TTL" as a safety net, bound local memory, and cache keys that are read often and change moderately (not a hot counter). Src: CSC ("What to do when losing connection", "What to cache", "Other hints").
- **R10.91 CONFIRMED.** Tracking is per connection, so with a connection pool all connections must be tracked or redirected to one invalidation connection; `REDIRECT` allows many data connections to share one. If the redirect target dies in RESP3, a `tracking-redir-broken` push is sent. Src: CSC; TRACK.
- **R10.92 CONFIRMED.** Delivery limits (use these as "the limits" the coverage map asks for): invalidations are best effort on one TCP connection, lost on disconnect (flush on reconnect, R10.90); the table can drop entries (R10.87); invalidation does not reach a client that is down; there is a gap between the write and the push (milliseconds) during which the near cache is stale; `FLUSHALL`/`FLUSHDB` send a null; replica or failover changes need the client to reconnect. Redis gives no staleness bound, only the TTL cap. Combines CSC statements; the millisecond gap is DERIVED from network delay.
- **R10.93 CONFIRMED.** Command coverage: every `@read` ACL command uses cached data except probabilistic/time-series types, non-deterministic commands (`HRANDFIELD`, `HSCAN`, `ZRANDMEMBER`) and search `FT.*`. Src: CSCINTRO.
- **R10.94 CONFIRMED.** Tracking in Cluster: slot migration with `CLIENT TRACKING` enabled falls back to active trimming on the main thread (ASM blog), a small operational interaction; tracking state is per node connection, so a cluster-aware client has to track on every node. Src: ASM (Under the hood, step 7). UNCONFIRMED: detailed semantics of invalidations at slot migration handoff.
- **R10.95 DERIVED.** Near-cache arithmetic for the article: if a fraction p of reads is served by the in-process cache, average read latency = p·t_local + (1−p)·t_redis, and Redis's request load falls to (1−p) of reads. With the hit-ratio derivations of article 1: a 90% near-cache hit rate cuts load on the hot shard tenfold for those keys. Per-request costs (t_local ≈ sub-microsecond, t_redis ≈ round trip plus execution) are illustrative; no local measurement of client libraries was made.
- **R10.96 CONFIRMED.** Pub/Sub-based invalidation (the pre-6.0 pattern) costs bandwidth to every client and CPU for `PUBLISH`; tracking was added to avoid this. Src: CSC (intro).

### 10J. Managed services, Valkey, versions

- **R10.100 CONFIRMED.** `CLUSTER SLOT-STATS` (8.2.0) and `HOTKEYS` (8.6.0) and `CLUSTER MIGRATION` (8.4.0) are Redis Open Source features; the docs table marks `CLUSTER SLOT-STATS` and `CLUSTER MIGRATION` as not supported on Redis Software/Cloud, so a managed service may not expose them. Src: SLOTSTATS, CLMIG compatibility tables. UNCONFIRMED: availability on Valkey (do not claim it has `HOTKEYS` or `SLOT-STATS`).
- **R10.101 CONFIRMED.** Client-side caching with `CLIENT TRACKING` is a Redis 6.0 feature and a stable part of the protocol Valkey inherited (Valkey forked from Redis 7.2.4); Valkey equivalents were not verified. UNCONFIRMED.
- **R10.102 CONFIRMED.** On ElastiCache with cluster mode enabled, Multi-AZ/automatic failover is always on; planned replacements complete while the cluster serves writes. Src: ELASTICACHE.

### 10K. Running examples and number status

Realistic scenarios:

1. **Flash-sale product page.** One product key is read by most visitors (a Zipf head). Show a six-shard cache where one shard saturates while the others idle; then copies, replica reads and a near cache. (Uses R10.65–67, R10.58–59.)
2. **Feature flags and site configuration read on every request.** Tiny, read-mostly, shared by all users: the ideal near-cache candidate, with invalidation on change (R10.81–90). Staleness window is the point to discuss.
3. **Scaling a 300 GB session/product cache from three to four shards before peak season.** Show slot ownership, `MOVED` during reshard, atomic slot migration in 8.4+, and what it does to the hit ratio (none if slots move with data; large if the client re-hashes, R10.50).

Number status:

- **May be called measured (local Redis 8.10.3, macOS, tiny datasets):** hash slots of named keys, hash-tag behaviour, `CROSSSLOT` (E10–E11); cluster state with partial slots (E12b); `HOTKEYS` and `SLOT-STATS` outputs (E13); `--hotkeys` behaviour and LFU counters (E14); tracking message behaviour (E15). These are behaviours (what is sent and when), not performance.
- **Computed from a stated model (call it a model, not a measurement):** every number in R10.65–67 (E18) and R10.50, R10.95.
- **Vendor-reported (attribute):** R10.48 (atomic slot migration benchmark), Valkey 9.0 claims.
- **Illustrative:** traffic rates, hit ratios, per-op latencies, shard counts in the scenarios, failover durations (R10.33).
- **No multi-node measurement exists in this dossier.** MOVED/ASK sequences, failover timings and resharding are documentation-derived. A writer who wants measured redirections should extend a local multi-port test only if given permission for extra ports.

---

## Gaps and overlaps in the coverage map

1. **Overlap, expiry on replicas:** article 4 lists "Replicas and expiry briefly (replication owned by 9)". The mechanism (replicas do not expire; DEL propagation; logical expiry on reads; absolute times in the stream: R9.53–54) belongs in 9. Article 4 should link, not teach it.
2. **Overlap, fork:** article 7 lists "fork for persistence" among latency sources; article 9 lists RDB fork and copy-on-write. Suggest 7 states the symptom and links; 9 owns the fork mechanism and page-table arithmetic (R9.12–16).
3. **Gap, `WAITAOF`** (Redis 7.2) is not in the map; it belongs beside `WAIT` in article 9 (R9.36).
4. **Gap, the "should a cache have replicas at all" decision** (warm failover versus cold restart versus Cluster-with-replicas) is implicit; it is the decision the article exists to support. Suggest listing it explicitly in 9 and linking from 12.
5. **Gap, cluster restrictions leaking into earlier articles:** `MGET`/`MSET`/transactions/Lua need same-slot keys (CROSSSLOT, R10.15) and only DB 0 exists (R10.04). Article 3 (key design, hash tags) and article 8 (pipelining, `MGET`, `MULTI`, scripts) should carry a one-sentence pointer to 10; also cluster-aware clients split batches per node.
6. **Gap, atomic slot migration (8.4) and `CLUSTER SLOT-STATS` (8.2) and `HOTKEYS` (8.6)** are new and not in the map's wording; the map's "slot migration" and "detection (`redis-cli --hotkeys` with LFU, monitoring)" should name them (R10.47, R10.58–59).
7. **Boundary, near caches:** article 5 delegates "invalidating near caches" to 10; article 6 may also touch near-cache stampedes. 10 should own `CLIENT TRACKING` correctness (race, flush on disconnect, table limit); 5 and 6 only link.
8. **Boundary, 9 and 11:** replication lag, failover and persistence metrics (R9.70) overlap with article 11's monitoring list; suggest 9 introduces the fields and 11 sets alert thresholds. Sentinel/Cluster security (bus port exposure, R10.23) overlaps article 11's security section.
9. **Hot-key mitigation versus article 6:** "steady load concentrated on one key or shard" is assigned to 10; stampede (burst of rebuilds) stays in 6. The boundary is clear, but the leases material in Nishtala (R10.68) is cited by 5 and 6 as well; only the replication-within-pools passage is 10's.
10. **Consistent hashing is mentioned (10: "client-side sharding and consistent hashing briefly")** but no primary source is gathered here (R10.02); the writer should either cite the original paper or keep it to one sentence.

## UNCONFIRMED items that matter

- Copy-on-write size on Linux (no local measurement; `*_cow_size` reads 0 on this macOS build) — R9.15.
- Whether 16,384 bytes is a documented minimum for `repl-backlog-size` — R9.67.
- Exactly when the Redis 8 "RDB channel" replication path is used, versus the older path — R9.59.
- Breslau et al. Zipf exponent range — R10.69.
- Valkey support for `HOTKEYS`, `SLOT-STATS`, and Valkey 9.0 atomic-slot-migration details from the official release notes — R10.49, R10.100–101.
- Non-AWS managed-service failover durations — R9.112.
- Consistent-hashing primary source — R10.02.
- Any measured multi-node Cluster behaviour (MOVED/ASK, failover duration, reshard impact) — only documentation-derived (R10.20, R10.33).
- Any performance figure for AOF `always` — R9.40.
