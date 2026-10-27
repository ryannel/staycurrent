# Redis recovery lab

Four observed recovery cases for the Stay Current article
https://staycurrent.dev/learn/databases/caching/replication-and-failover/.

Requires Node 24+, npm and a Redis 8.2.2 server binary on macOS or Linux. Dependencies
are pinned to node-redis 6.3.0. Use an isolated development machine with room for
several small Redis processes; this is not a production runbook.

```sh
npm ci
REDIS_SERVER=/absolute/path/to/redis-8.2.2/src/redis-server node run.mjs
```

If redis-server 8.2.2 is on PATH, `node run.mjs` is enough. The runner checks its
version. Obtain Redis from its official release source or your trusted package
manager; the article used the official 8.2.2 source on arm64 macOS, built with
`make BUILD_WITH_MODULES=no BUILD_TLS=no MALLOC=libc redis-server redis-cli`.
A different allocator does not change these asserted command results.

The runner creates a private temporary directory, Unix sockets for its own client
connections, and ephemeral TCP ports bound only to 127.0.0.1 for replication and
Sentinel. It never connects to an existing Redis service. Do not expose the lab
ports. No authentication/TLS configuration is intended as a deployment example.
Only processes started by this runner are killed; only its temporary directory is
removed. Cleanup runs on completion or failure and handles SIGINT/SIGTERM. A host
crash or SIGKILL of the runner itself cannot run cleanup.

## Experiments and assertions

1. Seed primary and replica with card:42 = 12; WAIT confirms one replica. Redirect
   that replica to a private non-responding TCP peer to stop delivery without
   discarding its data. DEL on the old primary returns 1, WAIT 1 200 returns 0,
   and GET on the old primary returns null. Kill the primary and manually promote
   the disconnected replica: GET returns 12. This is a controlled stale-copy
   promotion, not Sentinel's selection policy and not a real network partition.
2. Save an RDB containing 12 and an expiring key. Write 15, kill Redis, allow the
   short key's deadline to pass, then restart from that private directory. The
   saved 12 returns; the expired key does not. SAVE is intentionally blocking on
   this tiny disposable dataset, not a recommendation for production snapshots.
3. With AOF enabled and appendfsync always, write 12 then 15. WAITAOF 1 0 1000
   returns [1,0]. Kill the process and restart with the same AOF configuration;
   GET returns 15. This is a Redis-process crash while the host remains alive,
   not a power-loss or failed-storage test.
4. Start a fresh primary/replica pair and three local Sentinels with quorum2.
   Wait for replication and mutual Sentinel discovery, kill the primary, then
   observe the replica's role and each Sentinel's discovered endpoint. The new
   primary contains 15. The observer explicitly reconnects if Sentinel closes its
   normal client connection. No production client's automatic reconnect is tested.

The lab has a 75-second guard and bounded readiness checks. Short Sentinel timers
are solely for this exercise. All Sentinels share one machine: independent failure
domains, asymmetric partitions, storage loss, backlog exhaustion, sustained load,
application freshness and source overload require separate deployment-specific
exercises. Exact election times are neither asserted nor benchmarked.
