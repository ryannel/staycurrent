# Article 7 — Redis clients, latency and pipelining

Design started26October2026 after article6. Not drafted or published.

## Teaching sequence

1. A page needs several independent cached fragments. Show command travel, server
   work and replies on fixed client/server lanes. Sequential wait vs bounded
   pipeline; adjustable RTT/batch count. Make the saved idle network intervals
   visible. Same work, fewer serial waits; server command execution not magically
   parallel. MGET may express multi-key reads; cluster slot restrictions deferred
   precisely to article11. Dependent GET-then-compute cannot simply pipeline the
   computed command; server-side atomic code is nextarticle's subject.
2. Batch limits: bytes and latency as well as command count. Responses arrive in
   protocol order on a connection; large prior response delays small later one.
   A bounded batch trades throughput against memory, tail latency and fairness.
   Separate server execution delay from connection byte transmission. Another
   connection can isolate stream blocking but not heavy shared server execution.
3. Client lifecycle: connection acquisition/reuse, ready/offline states, queued
   unsent command vs sent/unacknowledged vs reply received. A caller deadline is
   not proof of execution or nonexecution. Reconnect/offline queue semantics use
   one explicitly pinned realclient, not unsupported universal claims.
4. Observability: application latency includes client wait/network/parsing/event
   loop beyond command execution; SLOWLOG boundary. Probe latency differs from real
   payload. Measure same region/network/path, concurrency, response bytes and tails.

## Primary sources located/read (expand relevant sections before implementation)

- https://redis.io/docs/latest/develop/using-commands/pipelining/
  Read RTT example, pipeline batching/reply memory and socket syscall discussion.
  Do not copy benchmark numbers or the suggested10kbatch as a recommendation.
- https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/
  Read opening/measurement/baseline. Page contains dated EC2 examples and very broad
  latency claims; do not repeat them. Read network and slowlogsections next.
- https://github.com/redis/node-redis/blob/master/docs/client-configuration.md
  Read config table: commandsQueueMaxLength, disableOfflineQueue, connectTimeout,
  socketTimeout, commandOptions.timeout. MASTER IS NOT A VERSIONED CONTRACT.
- https://redis.io/docs/latest/develop/clients/nodejs/transpipe/
  Located; full execute-pipeline/reconnection details need reading.
- https://redis.io/docs/latest/develop/clients/pools-and-muxing/
  Located; relevant prose needs reading.
- https://redis.io/docs/latest/commands/slowlog/
  Located; read actual command documentation below navigation.

npm view on26October2026 returned redis6.3.0 and @redis/client6.3.0. This is newer
than familiar5.x APIs. Pin6.3.0 in the reproducible clientlab, inspect its versioned
source/types and actually execute examples. Redis docs production page has older
commandOptions imports: do not copy unverified snippets. Existing Node24 can run
lab. Keep lab dependencies separate from Astro productiondependencies.

## Native lab candidate

Use a disposable Redis8.2.2 container and pinned node-redis6.3.0 client. No public
ports; a Node24 container can share Redis's networknamespace, mounting a task-owned
labfolder read-only. Resolve dependencies locally first. Verify pipeline replies,
partial errors and subsequent command success; offline queue enabled/disabled;
short command deadline under CLIENT PAUSE; later execution/uncertain outcome if
observable. Avoid measuring Docker invocation overhead as Redislatency. A standalone
redis-cli --pipe worksheet can prove protocol pipelining but cannot substitute for
real client queue/deadline behaviour. Keep resource cleanup deterministic.

Gate: useful visual causality, primary claims, native evidence, invariants, prose,
phone/light/dark/keyboard/console, build, commit/push, deployment/live verification.

## Implemented outcome, 27 October

Three figures: fixed-scale pipeline timing; reply-stream vs execution waiting;
explicit queue/send/execute/reply lifecycle. Six model invariants. Complete prose.
The source-labelled queue timeout behaviour was verified against the installed
6.3.0 package and native Redis8.2.2. Sent SET outlives its40ms command timer; unsent
GET expires before readiness, and disableOfflineQueue refuses it immediately.
Queue bound8 includes pending replies; smaller2 bound failed during handshake.

Docker suffered a host disk-space failure. Reclaimed task-owned build output and
omitted unrelated docs from this temporary checkout with sparse-checkout. Restored
indexes/designing-data folders required by siteimports. No primary-checkout edits.
Docker remains unavailable; no destructive engine reset/prune was attempted.
Downloaded official Redis8.2.2 source and built it locally with modules/TLS off,
libc allocator. Private Unix-socket runner starts/removes a disposable process; no
Redis TCP listener. Controlled peer tests bind localhost only. See lab README.
Installed package6.3.0 gitHeadbfdd485b0bb24eab1a99aeb0de96b2285e4b26e1; published
package integrity is in lockfile. GitHub commit-page fetch unavailable, so article
links to the published package and executable evidence instead.
