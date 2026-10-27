# Redis Cluster and hot keys — article 11

27 October 2026. In progress: primary research and native lab. No article/models/
figures yet. Manifest remains planned. Article10 already published and verified.

## Teaching design

Cluster divides keys across primaries; replication copies a shard. Begin with
card:42 and stock:42 taking different routes, then use a deliberately scoped hash
tag to co-locate them. Preserve 16,384 slots as the intermediate address space:
key -> CRC16/XMODEM modulo16384 -> current slot owner. Adding nodes does not change
key's slot and does not automatically redistribute ownership/data. Shard != key
nor replica. Balance work/bytes rather than only slots/key counts.

Proposed figures:
1. Slot routing. Editable key (UTF8 bytes), explicit hashed substring and slot,
   route to three stable owners: A0..5460/B5461..10922/C10923..16383 (native ranges).
   Example pair untagged card:42/stock:42 vs card:{42}:a/card:{42}:b. Same-slot
   multi-key constraint distinct from accidentally same-node. First open brace
   and following close brace with nonempty contents; foo{}{bar} hasheswholekey.
   Native examples below should test the CRC implementation, including Unicode.
2. Classic migration, one slot8000 from B to C; keys a and b share {42}. Steps:
   stableB; prepare CIMPORTING/BMIGRATING; movea (Ba absent,Ca present,Bb present);
   ASK retry (ASKING+GET onC, cachedmapB unchanged); moveb; setownerC destination
   first then source+others (cachedmapstillB); MOVED updatescachedmapC. Display key
   locations, officialowner, clientmap and route separately. During splitkeys,
   same-slot MGETcanTRYAGAIN. Clarify live single-key routing vs retry cost.
   Shortmanualsteps/previous/reset; no pretend network timing.
3. Hot key load. Offered240requests/s; one key receives adjustable0..100%; rest
   ideally evenly spread over3or6primaries. Onehotkey staysononeprimary.
   Illustrative budget100workunits/sperprimary, eachrequest1unit. At50%hot:
   3nodes ->160/40/40; 6nodes ->140/20/20/20/20/20. Totalofferedconserved,
   aggregatecapacityincreasesbuthotnodeoverbudgetstill. Barsshared0..240scale,
   hotvscoldsegments and100marker. NotmeasuredRedisthroughputorqueueprediction.
   Discuss reduceworkperrequest, localcoalescing/L1/readreplicas withfreshness,
   redesignsplittabledata; onehotwritekeynotfixedbyaddingreplicas/shards.
4. Cluster availability (if fourth visual adds teaching value): threeprimary+
   replica groups, scenarioshealthy/Aprimarylost/Aanditsreplicalost/A+Bprimaries
   lost. Assumefaultdetectionelapsed; replicaseligible. Showmajorityofslot-owning
   primaries separately fromcoverage. Optional promoteA onlywhenB+Ccanvoteand
   replicaAexists; defaultrequirefullcoverageyesblocksnormalqueriesuntilcovered.
   Togglefullcoverageno: coveredB/Cmayserveifmajorityreachable; cannotserve
   missingAorgrantminorityfailover. Explicitcluster-allow-reads-when-down=no;
   actualtimers/electionphasesnotmodelled. No claimallnetworkpartitionssymmetric.

Prose must connect routing to client connection/address/TLS configuration, every
nodeadvertisedreachablefromapplication, cross-slotoperationlimits includingLua/
transactions, migrationoperationalheadroom, per-shardmemory/eviction/load, hotkey
skew, failover/asyncwrite-loss limitations fromarticle10, and boundedfallback.
Do not imply cache clustering creates distributed transactions or a uniform
capacity pool. Redis8.2.2 baseline: classic MIGRATE/SETSLOT, not newer atomic
slot-migration features in current8.10 docs. ClusterusesDB0only.

## Primary research read

- https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/
  16384slots, CRC16/XMODEM polynomial0x1021 init0, reference123456789 ->0x31c3;
  firstnonemptybrace-rule (emptyfirstpair means wholekey). Clientsare redirected,
  notproxied. Majorityprimaryavailability and a survivingreplicaforeachlost
  primary. Read more detailed failure semantics before finalfigure4prose.
- https://redis.io/docs/latest/commands/cluster-setslot/
  Prepare destinationIMPORTING first, sourceMIGRATING second. Existingkeysource
  executes; missingkeyASK; allmultikeyexistsexecutes/noneASK/someTRYAGAIN.
  ImportingtargetwithoutASKINGreturnsMOVED; ASKINGthencommandexecutes. Finalowner
  destinationfirst then source thenotherprimaries; sourcecan'tgiveupslotwithkeys.
- https://redis.io/docs/latest/commands/asking/
  ASKINGonrecipientconnection followedbyredirectedcommand. Clientnormallyhandles.
- https://github.com/redis/node-redis/blob/master/docs/clustering.md
  createCluster rootNodesdiscovery, defaultsforallnodeconnections, maxredirections,
  nodeAddressMap, useReplicasdefaultfalse. CurrentdocsnotpinnedAPIproof; labuses
  installed6.3.0 andactualcommands. Admincommandsmusttargetnode. Generalclient
  primarydocalso https://redis.io/docs/latest/develop/clients/nodejs/connect/.
- /private/tmp/redis-8.2.2/redis.conf around1694..1740 read directly:
  cluster-require-full-coverageyes default, noallowspartialcoveredqueries;
  cluster-allow-reads-when-downno default; ifyescanallowlocalreadswithoutglobal
  clusterOK butdoesnotgrantprimarymajorityorautomaticpromotion. Avoidimplying
  partialcoverageflagaloneallowsminoritywrites.
- Installed node-redis6.3.0 cluster-reconnection-tracker.js and cluster-slots.js
  read: topology refresh is driven by reconnect attempts (default5s delay).
  With reconnectStrategy:false, ourserverpromotedbutclientkeptstalerouting;
  retryingGETalonefailed. Final lab now enables boundedreconnect100attempts200ms,
  offlinecommandsdisabled andglobal75sguard. Record outcomeafterfinalrun.

## Native lab in progress

examples/caching/cluster-lab has package/lock/run; README+zip+reviewstillneeded.
Run REDIS_SERVER=/private/tmp/redis-8.2.2/src/redis-server node
examples/caching/cluster-lab/run.mjs. PrivateUnixsocketadmin, sixownedloopbacknodes
withseparateephemeralclusterbusports, tempdirs, noexistingRedis; cleanupandguard.
Initialpassverifiedallroutingandmigrationcases butclientfailoverreadtimedoutwith
reconnectdisabled. Repeatwithboundedreconnectsession95716completedexit0; allassertionspassed,
includingautomaticpromotionandclusterGET15. Outputcopiedtoevidence/cluster.txt.

Observed hashes (first run):
card:42=9762; stock:42=2594; card:{42}:a=8000; card:{42}:b=8000;
foo{}{bar}=8363; café=5735. Cross-slotMGETrejected; same-tagMGET[12,stock].
WrongprimaryGETMOVED; clusterGET12. Partiallymigratedslot: sourceGETASK,
sourceMGETTRYAGAIN, targetGETwithoutASKINGMOVED, ASKING+GET12, clusterGET12.
FinalownerC: oldsourceMOVED, clusterMGET[12,stock]. Nativefailoverlastcase writes
anchor15onA, WAIT1, killsA, observesreplicaAprimary thenclusterGET15.
Noactualloadtest, networkpartition, hostfailureorindependentfaultdomains.

Final native repeat completed successfully. Client topology recovery now observed
with the stated bounded reconnect configuration; no claim about all clients.

## Completion

Article and four figures implemented. Native lab repeated, download packaged,
51modeltests and all13site rules pass. Final browser/teaching review recorded in
article-11-review.md. Publication underway.
