# Client-side caching and cache hierarchies — article 12

27 October 2026. Article12 completed and reviewed; see article-12-review.md.
Primary research and native evidence below record the design work.
Publication and live verification are recorded in publication.md.

## Teaching spine

A Redis hit still crosses a process/network boundary. A local L1 copy can avoid
that path but creates another correctness and memory boundary. Redis L2 itself
is already a copy of the application database. Tracking observes Redis changes,
not arbitrary database changes. Avoid suggesting client-side caching makes an
otherwise stale L2 authoritative or gives instantaneous cross-process coherence.

Four proposed illustrations (refine for clarity):

1. Three-layer copy flow: source / sharedRedis / processA+L1 / processB+L1.
   ReadA/B warm independently; repeatread useslocalcopy. Changesource12->15 does
   not touch Redis or localcopies. DeleteRedis creates pending invalidations;
   deliver independently to A/B, showing one local stalehit while the other
   refills. Reader controls ordering rather than timing numbers. If modelling
   a refill directly intoL1, explicitly represent cache-aside sourcefill+SET+
   trackedread, not falsely claim BasicClientSideCache caches SET results.
   Could simplify to a fixed step sequence with optional invalidation delivery
   to avoid too many buttons. Important visual: databasechangealone triggers
   noRedisTrackinginvalidation; delivery is another event from writeexecution.
2. Pending-read race across TWO connections (or equivalent asynchronous custom
   cache installation). Shared steps GETpending, oldreplyinflight, write15,
   invalidationarrivesfirst, lateoldreply. Compare naivefill vs pendingtoken /
   generationguard. Invalidating pending entry prevents late result being stored.
   Existinginflightrequestcanstillreceiveold12; don't promise freshresponse.
   Explicitly not a reordering possible on one RESP3 wire; singleconnection
   preserves reply/push order. Pinned built-in client handles pending entries.
3. Layered lifetime: originalsourceobservation0, freshnessdeadline60; L1 receives
   oldL2copyat55 andstartsnew30slocalTTL =>naiveexpiry85. At75thiscanextendolddata
   beyond originalcontract. Toggle carrying/enforcing originalvalidUntil to cap
   L1deadlineat60. Common0..120scale with offsetL1bar. Freshnessmetadata must be
   bound to the value; separate GET/PTTL can race. Redis keyTTL and clientTTL
   are different mechanisms. Tracking delivery/detection delay isn't a hard
   freshness guarantee. Preserve observedAt/validUntil; do not restart age.
4. Reuse vs fan-out: Nprocesses eachreadsamehotkey Rtimes betweenupdates. Model
   eachcycleoneupdate, oneL1missperprocess thenR-1hits; allprocessesrefresh before
   nextupdate. BaselineN*RRedisreads vs NRedisreads + Ninvalidationdeliveries.
   R=1 saves no reads and adds invalidations. Vary N and R, not independent
   arbitrary hitrate/update rates that contradict invalidation behaviour.
   Show duplicatedlocalmemory (explicit assumed per-process allocation, not
   Redis MEMORY USAGE) and messagecounts separately; don't sum unlike costs as
   equivalent latency. Defaulttracking clears associations on invalidation, so
   the per-update fan-out premise requires reads/re-registration eachcycle.

Close with choice: read-heavy/repeated/expensiveroundtrip data benefits; rapidly
changing/one-offdata maynot. Per-processbyte/entrybounds, GC and multi-process
multiplication; multi-tiermetrics must name denominators. Use maintained client,
track invalidation health/disconnect clearing, boundedfallback, authoritative
freshnesschecks for strictdata. Article13 operations next; capstone14 afterwards.

## Primary sources read

https://redis.io/docs/latest/commands/client-tracking/
Defaulttracksreadkeys; RESP3pushsameconnection or REDIRECT. BCASTPREFIX sends
matchingchangeswithoutpriorread. OPTIN/OPTOUT andNOLOOP are protocoloptions;
NOLOOP suppressesownconnectionchanges, not a generally safe switch. Currentdocs
can describe newer CLIENTUNTRACKING; do not import post8.2 features accidentally.

https://redis.io/docs/latest/develop/clients/client-side-caching/
Localhits saveRedisrequests; invalidations evictcopies. Read recommendations with
judgement: do NOT assume server MEMORYUSAGE equals client runtime heap usage.
They have different representations, allocation, decoding and cloning costs.

https://redis.io/docs/latest/develop/reference/client-side-caching/
Read detailed mode/connection/race/disconnect sections. Invalidationtable has
bounded bookkeeping; tableeviction can invalidateunchangedkey. BCAST avoids
per-read-keytable butstillusesprefix/clientmetadata andfan-outwork: don'trepeat
literalclaimzeroRedis memory. Defaultservertracks read-only command dependencies,
notjustGET. nullpushforglobalflush. Twochannelrace with lateGETreply; placeholder
preventsreinstallation. Singleconnectionordering prevents that wire race.
Disconnect requiresflush; detectsilentbreak using boundedhealthchecks; a detected
close is not a networkblackhole. LocalTTL and memorybounds remain useful.

https://redis.io/docs/latest/develop/clients/nodejs/connect/
CSC needs RESP3; BasicClientSideCache config ttl, maxEntries, evictPolicy; stats,
invalidate/clear methods. Defaults ttl0=noexpiry andmaxEntries0=unbounded: use
explicit bounds. Docs sayintegratednodeclientdoesnotsupportBCAST/optmodes; raw
CLIENTTRACKING experiment mustbedistinguishedfromintegratedCSCconfiguration.
Use baselineRedis8.2.2/node-redis6.3.0, notlatest-versionclaims.

Installed6.3.0 source inspected:
examples/caching/tracking-lab/node_modules/@redis/client/dist/lib/client/index.js
and cache.js (samefiles initially read undercluster-lab). CSC handshake enables
TRACKING, handleskey/nullpush; onError/onClose clearscache. Inflightpromiseentry
isvalidatedbeforeinstallingcompletedresult; invalidate removesallcachedcommand
resultsdependingonkey. Raw emitInvalidate:true also enablestracking and emits
pushkeys butdoesnotitselfimplementanapplicationlocalcache. Cannotcombineitwith
clientSideCache on sameclient.

## Native lab already passed

examples/caching/tracking-lab: package/lock/run/client; README+zipnotyet.
CopiedprivateUnixsocketrunnerfrommemorylab. NoTCP. PinnedRedis8.2.2officialbuild,
node-redis6.3.0, Node24.16.0. Run with REDIS_SERVER=/private/tmp/redis-8.2.2/src/redis-server
node examples/caching/tracking-lab/run.mjs. First runsession20100completedexit0.
Output evidence/tracking.txt.

Observed/asserted:
- BasicClientSideCache ttl60000ms/maxEntries2/LRU, RESP3reader. TwoGETs12,12;
  INFOcommandstats on separatewriter confirmsRedisGETcountdelta1, cache stats
  miss1/hit1. Notjusta clientmetricassertion.
- SeparatewriterSET15 -> key-onlyinvalidateevent, cacheempty, nextGET15.
- CachedGETandSTRLEN occupy2results; oneSET100 invalidatesboth; nextGET100 and
  STRLEN3. EntrycountisnotnecessarilydistinctRediskeycount or bytebound.
- GETmissingnull cached; writercreateskey; invalidation; GETcreated.
- Thirdcachedresult retains2entries underconfiguredmaxEntries.
- Writer CLIENTKILL targets ONLY ownedreaderID onprivateinstance. Detectedclose
  clearscache; writervalue21; explicitreaderconnect; GET21. Notautoreconnector
  silentblackholetest. Cacheevents/statresetbehavior differs from stale-use.
- ServerkeyPX1000 expires while localTTL60000; force/checkexpirywithwriterGET,
  observedinvalidation, readerGETnull. Noexactdelivery-timeguarantee.
- Separate rawRESP3emitInvalidate client switchesTRACKINGOFF thenONBCASTPREFIX
  card:; writerchangescard:never-read; rawobserverreceiveskeywithoutreadingit.
  Thisisprotocolproof, not built-inCSC'sBCASTconfiguration support.

Improve copiedrunner interruptioncleanup ifneeded, README clearlyscoped,
repeatfinalsource andpackage. Modelsneedinvariantsmatchingrealboundaries, not
merelyconstant-outputtests. Prose+figures thenfullteachingreview againstreferences,
desktoplight/dark+phone+keyboard, nativeartifactintegrity, build, publication.

Implementation complete: connected prose, four interactive figures, model invariants,
README and verified five-file download. Final native repeat passed all cases.
