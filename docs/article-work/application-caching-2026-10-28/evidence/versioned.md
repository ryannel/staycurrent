# Conditional fill experiment

Executed 28 October 2026 on Redis 8.10.3. Full identity, script/helper SHA-256,
commands, replies and scenario results are in `versioned.json`. The verifier is
the assertions in `../practice/versioned_lab.py`, using the unchanged
`cache_lab.OwnedRedis` helper. Python's source dictionary marks the source commit;
there is no native source database, measured replica or concurrent load test.

From the repository root:

```sh
python3 docs/article-work/application-caching-2026-10-28/practice/versioned_lab.py --json /tmp/versioned-results.json
```

Requirements: Python 3 without `-O`, local `redis-server` (or explicit
`--redis-server /path/to/redis-server`). Standard library only. The helper starts
its own instance with TCP and persistence disabled; verifies PID, run ID, port
and directory before writes; and removes its process and temporary directory on
success and exceptions. The environment initially refused Unix socket creation;
the same bounded command succeeded with the execution approval mechanism.

## Results and limits

- Unconditional fill after commit/deletion restored revision 1 beside source 2.
- Reserve before read; delete before Lua publish: publication returned 0, absent.
- Publish before delete: publication returned 1, then deletion removed the card.
- Real expiry via `PEXPIREAT` in the past removed A; A's publication failed.
- New B reservation and new revision 2 source read: A rejected, B accepted.
- Repeating B's completion: rejected, ready revision 2 unchanged.
- Delayed invalidation allowed revision 1 while source was 2. The later delete
  removed it. A repeated delete removed a newer revision 2 fill.
- Returning revision 1 from the source model after source 2 committed was
  accepted with a valid token. This is a replica-lag illustration, not a replica
  experiment.
- Reserving after reading and splitting check from write both restored the old
  card. These are intentional incorrect counterexamples.
- Deleting retained revision metadata then treating missing as zero accepted
  revision 1. Treating missing as unknown rejected it. Deletion models metadata
  loss; no Redis memory-pressure eviction was measured here.
- A fresh empty Redis instance rejected the token reserved on the earlier
  instance. No old state was restored and no replication failover was exercised.
- Success and injected-exception cleanup both passed.

The experiment does not automatically return source results to callers. A cache
publication result is not a verdict on the caller's freshness requirement. The
lab uses five seconds to clean up loading records and thirty seconds to clean up
ready cards; neither timer proves the age of a source observation.

## Primary sources checked

- https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf
  section 3.2.1: leases bound to keys; deletion invalidates fill tokens.
- https://engineering.fb.com/2022/06/08/core-infra/cache-made-consistent/
  source revision ordering and eviction of the knowledge used in comparisons.
- https://redis.io/docs/latest/develop/programmability/eval-intro/
  atomic script execution and explicit key parameters.
- https://redis.io/docs/latest/commands/set/
  NX and PX semantics. The implementation uses Lua, not newer SET IFEQ syntax.
- https://redis.io/docs/latest/operate/oss_and_stack/management/replication/
  asynchronous replication and write-loss limits even with WAIT.
- https://docs.memcached.org/protocols/meta/
  automatic item creation on a miss via N, W/Z ownership signals and CAS.
  The article names these as related primitives, not as a verified equivalent
  deployment or a drop-in Memcached implementation.
