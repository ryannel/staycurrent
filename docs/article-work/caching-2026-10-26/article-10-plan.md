# Redis replication, persistence and failover — article 10

27 October 2026. Sole-agent work. Article 9 live; this article in final review.

## Teaching argument

Begin with a successful deletion becoming a stale hit after promotion. Preserve
source / primary / replica identity, then change only whether DEL arrives. This
makes asynchronous history and acknowledged-write loss concrete before naming
replication. Separate replication acknowledgement, fsync, authority to promote,
and freshness of recovered application data. None implies all the others.

Four models:
1. Manual lost-invalidation schedule, repeat with delivery. Replica retains exact
   received state; authority remains source15. Explicitly no Sentinel selection.
2. Ordered write prefix 12 ->15 ->DEL ->18, with two explicit fsync boundaries.
   Compare RDB, periodic fsync and always. Hypothetical host failure discards all
   unflushed bytes; no claim that a Redis-only process kill has that effect.
3. Five or three Sentinels, quorum2, reachable agreeing group. Show reports vs
   majority authorisation vs separate eligible replica. No timing/election model.
4. Restore-time slider on common scale; saved expiry90 vs application observed-age
   limit60. At70 key12 exists with20TTL, but age check rejects it. Stable clocks.
   Within age bound is not equality with current source15.

Progression closes with operational choices: backlog/catch-up cost, replica reads,
WAIT and WAITAOF, persistence settings, failover discovery, partition exposure,
empty-primary restart hazard, repair/invalidation-consumer position and bounded
warm-up. Cluster next; no attempt to teach Redis as authoritative storage.

## Evidence

Primary docs read on 27 October 2026:
- Redis replication: async stream, replication ID+byte offset, partial/full sync,
  persistence-disabled primary restart can empty following replicas.
- WAIT: preceding writes on SAME connection, timeout returns achieved count,
  no rollback and no strong-consistency guarantee; native no-rollback confirmed.
- WAITAOF: since7.2, local/replica fsync counts, timeout and same-connection scope.
- Persistence: snapshots, AOF policies, completed fsync vs write buffer, multipart
  since7.0. Avoid old pre7 rewrite details and absolute claims about power loss.
- Redis8.2.2 redis.conf read locally: backlog size/TTL, min-replicas settings are
  not per-write acks, no-appendfsync-on-rewrite can suspend durability boundary.
- Sentinel: quorum vs majority (or higher configured quorum), independent domains,
  eligible selection and isolated old primary accepting lost writes.
- Sentinel client spec: discovery service name+addresses, verify ROLE, reconnect.
- EXPIRE: persisted absolute timestamps, downtime counts, stable-clock assumption.
- AWS Well-Architected recovery-objective definitions: RTO and RPO time windows.
URLs are in article sources; version-pinned config links to8.2.2 on GitHub.

## Native lab

examples/caching/recovery-lab/run.mjs. Official Redis8.2.2 source build, Node24.16,
node-redis6.3.0, arm64macOS. Private dirs+Unix sockets; owned loopback ephemeral
TCP peers only. Final README details guard/cleanup and process-vs-host limits.
Native results in evidence/recovery.txt:
- Seed12+WAIT1, disconnectreplica, DEL1/WAIT0, primaryGETnull, killprimary,
  manually promote stale replica ->12.
- SAVE12 thenSET15, processkill/restart ->12; savedexpiredkeyabsent.
- AOFalways SET12/15 WAITAOF[1,0], processkill/restart ->15.
- Three local Sentinels quorum2 discovereachother; primarykilled; replicapromoted;
  allthree discovery addresses converge; GET15. Observer reconnects explicitly
  because Sentinel can close normal clients during promotion.
Initial corrections: node-redis SAVE uses sendCommand; observer reconnect after
Sentinel's connection closure. No observed result is inferred from model output.

## Gate

Four semantic tests added (47collection total), browser desktop light/dark and
390px phone controls; native final repeat and archive check; final build. Then
manifest+priorlink, commit/push exactmain deployment and live-control verification.
