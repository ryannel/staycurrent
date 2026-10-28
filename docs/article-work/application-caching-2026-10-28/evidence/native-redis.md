# Native Redis verification

Executed 28 October 2026 on the owned local Redis 8.10.3 binary. The exact reader
script is `../practice/cache_lab.py`; its SHA-256 is recorded in
`native-redis.json`. Run from the repository root:

```sh
python3 docs/article-work/application-caching-2026-10-28/practice/cache_lab.py \
  --redis-server /opt/homebrew/bin/redis-server \
  --json docs/article-work/application-caching-2026-10-28/evidence/native-redis.json
```

All six exercises passed, along with cleanup after success and an injected
exception. The JSON record contains instance identity, launch arguments, complete
Redis command/reply trace, measured values and script provenance.

The verifier connects directly to its private Unix socket. It removes inherited
environment variables whose names begin with `REDIS`, supplies no external
configuration file, disables TCP and persistence, and checks the returned PID,
run ID and configured directory before its first data write. It closes the client,
terminates only the process it launched, waits for exit and removes that process's
temporary directory. Both successful and deliberately failed runs confirmed the
process had exited and its directory was gone.

Observed results:

| Exercise | Observation |
| --- | --- |
| Cache-aside basics | Initial miss; `SET EX 30`; subsequent hit at revision 1. |
| Expiry and replacement | Short-lived key became absent (`TTL -2`); plain `SET` removed expiry (`TTL -1`); `SET EX` restored expiry. |
| Commit then invalidate | The model changed to revision 2, `DEL` returned 1, and refill cached revision 2. |
| Stale fill | A saved revision-1 read filled after revision-2 commit and successful `DEL`; Redis held revision 1 with a fresh 30-second TTL. |
| Observation-age policy | A source snapshot waited over one second (exact elapsed time in JSON). Unchecked insertion gave it a 30-second TTL. The paired one-second application check rejected that snapshot and returned a newly read revision 2. |
| Cache write rejection | `noeviction` plus `maxmemory 1` produced `OOM` for the new cache write; the source result remained available. |

The source is an in-process Python dictionary, with an explicit assignment as the
model's commit. Redis operations are native observations. The sequence is
deterministically scheduled; it is not a measured production race frequency.
The age check is a local monotonic-time illustration, not a cross-process clock
protocol, strict latest-value guarantee or atomic update across source and cache.
No failover, replica lag, network timeout, throughput or eviction quality was tested.

Primary documentation checked on 28 October 2026: [SET](https://redis.io/docs/latest/commands/set/),
[GET](https://redis.io/docs/latest/commands/get/), [DEL](https://redis.io/docs/latest/commands/del/),
[TTL](https://redis.io/docs/latest/commands/ttl/), [EXPIRE](https://redis.io/docs/latest/commands/expire/),
[eviction](https://redis.io/docs/latest/develop/reference/eviction/),
[INFO](https://redis.io/docs/latest/commands/info/) and
[RESP](https://redis.io/docs/latest/develop/reference/protocol-spec/).
Documentation supports the command and memory-policy claims; the observed
sequence establishes the cache/source application counterexamples.
