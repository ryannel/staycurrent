# Designing a production cache — capstone design notes

27 October 2026. Articles1–13 published/liveverified. No capstoneimplementationyet.
Continue alone. Do notmarkgoalcompleteuntil14publishedwithrunnableappandwholecollectionaudit.
This is a design proposal to refine while implementing; do not claim unrun outcomes.

## Coherent contract first

Use a catalogue API with SQLite as authoritative source and Redis8.2.2 as disposable
shared cache. Node24.16.0 / node-redis6.3.0. HTTP on owned127.0.0.1ephemeralport,
RedisprivateUnixsocket. Runner owns tempSQLitefile/Redisprocess/files/cleanup.
Provide npm start for persistent interactive API session plus npm test for actual
HTTP/native load/fault assertions. DownloadcompleteprojectREADME/package/lock/source/
runner/tests. Avoid merely another commandworksheet. No externalsystem required.

Two paths: display read accepts observation at most2secondsold (defaultteachingbudget,
notuniversalrecommendation); authoritativepricecheck bypassesRedis. Pricecheck is a
freshsourceobservation, not an entirecheckout/reservationtransaction. Pricechange
writes source first, then best-effort DELknownen/svkeys. Invalidationhelpsbutisnot
requiredtoenforcemaxage. A lateoldfill may survive DEL while withinoriginalbudget;
this is intentionally allowed and must be demonstrated rather than hidden behind
unprovedstrongconsistency. Currentwriteconcurrencyuseexpectedrevision conditional
UPDATE/transaction; no retry of ambiguousbusinesswrites.

Cached envelope: schema, tenant,id,locale,value,revision,observedAt,validUntil.
Observe timestamp atactualsourceSELECT (not whenlatefillcompletes). Keepdeadline
boundtovalue, rejectwrongcontext/schema/malformed/too-large/future/expiredpayloads.
SETonlyremaininglifetime(PX) and enforcepayloaddeadlineonread+beforeHTTPresponse.
A delayedSET may extend physicalRedisexpiry butcannotextendacceptedpayloadage.
Clocks: oneprocessdemo sharedDate.now; productionrequiresknownclockerror/monotonic
elapsedhandling. Stateassumption. Timestampnotproofsourcehasn'tchangedsince.
No L1, stale-if-error, distributedlease or Cluster bydefault: addonlyifworkloadneeds.
No negativecache unlessexplicitseparatecontract; returningmissing404directsource
is simpler. Boundedvalue/requestsize and inputvalidation. Tenantidentitycomesfrom
fixedDEMOtokenmapping (e.g.demo-alpha/demo-beta), notuntrustedtenantparameter. Bind
loopbackonly; publicdemocredentials are notproductionauthentication. APIs should
notallowcallerselectanothertenant withquery/body. en/svlocalesbounded/keyencodedtuple.

## Resource bounds

Cacheadapter: actualpinnedclient disableOfflineQueue:true, commandsQueueMaxLength
finite; peroperation externalwaitdeadline (e.g50/100ms). On timedout sentcommand,
destroyownedconnection/rejectpending andenterboundedcooldown; no automaticcommand
retry. Nexteligiblecacheprobe oneconnectionattempt guardedbysharedconnectingflag,
connecttimeout+externaldeadline; othersfailfasttofallback. Confirmthiswithnative
CLIENTPAUSE and actualkill/restart. Do not relyoncommandOptions.timeout/abortSignal:
article7 nativeproves sentcommandsoutlivethem in6.3.0. Promise.racealonewouldleave
resourcegrowth; boundandcleanupunderlyingconnection/pendingcommands. Distinguish
queuefull/loadshedding fromcachefailure. TimedoutSET/DELmayhaveexecuted; theirdata
contractmusttoleratethat, noautomaticretryofbusinessoperation.

Sourceadmission: max4active + tokenbucket20starts/s, burst4 (illustrativelocalbudget).
No unboundedqueue. Perkeycoalescing with max16waiters, globalHTTPactive64, bounded
keylength => mapboundedbyactivefills. Sharedsourceworkhasown boundeddeadline;
individualcallerwaitdeadlinecannotreleasepermitwhileworkstillruns. Releasepermit
onactualcompletion/cancellation, notmerely oncallerPromise.race. Coalescedfollowers
mustnotstartnewloadsjustbecauseonewaiterexpires. Allawaitersgetdefinederrorifsource
fails. Rate+concurrencybothmatter; initialburst/coldmanykeys andsamekeytests.

SQLite DatabaseSync pointqueries are synchronous; eventloopdeadlinecannotinterrupt
a blockedSQLitecall. Either use a worker forsourceaccess or accuratelybound
teachingqueryscope and explain timinglimits. Simulatedasyncsourcedelay is for
controlledconcurrency, notSQLperformance. ConfigureSQLitebusytimeout; boundactual
work/admission. Cancellationofasyncfaultdelay mustnotleakpermit. Do notclaimhard
realtimedeadlineunderOS/eventloopstalls. Preferclean,testableadapterboundaries.

## Proposed acceptance cases (actual HTTP + Redis + SQLite)

1 unauthenticated/invalidcontext failsbeforecache/source. Alpha42/beta42 and en/sv
  cannotshareanswers. Coldload thenwarmhit verifies sourcecountunchangedonhit.
2 wrongschema/context/corruptJSON/oversize/expiredpayload inRedis isrejected and
  boundedreload occurs. RediskeyremainingTTL doesnotoverridepayloaddeadline.
3 conditionalpricewrite commits theninvalidatesbothlocalevariants; pricecheck
  seescurrentrow; staleexpectedrevision409. SourcefailuredoesnotwriteRedis.
4 pauseafteroldsourceobservation; write15+DEL; releaseold12fill. Oldanswerallowed
  onlythroughoriginaldeadline, not a restarteddeadline. Authoritativepricecheck15.
  AfterdeadlineGETmust15/refuse, neverold12. Usebarrierhooksnotfragilesleeprace.
5 slowRedisviaownedCLIENTPAUSE; externalcachewaittimesout, boundedfallback; client
  outstandingstateclears. LaterRedisrecovery/probe/warmhitworks.
6 actualRedisprocessdown. Coldsamekeyburst40 withbarrier: oneoriginload, <=16
  waitersaccepted, excessrefused. Releaseafterrequestsarrived; noarbitrarytimingguess.
7 outage40distinctkeys: activeorigin<=4, ratebucketbounded, excess503/refused;
  honestoutcomecounters. No fallbackretryloop. Testsourcefailureandtimeoutpermitcleanup.
8 restartownedRedis, cooldownthenboundedprobe; firstfill/secondhit andnooldqueued
  workreplayed. Labtempdataonly; Redisdisposable, SQLiteauthorityremains.

Use deterministic barriers/countsand looseoveralltestguard rather thanasserting
millisecondperformance. Nativefaultintervalsnotbenchmarks. Exposeboundedmetrics
forrequests/hit/miss/reject/cacheerror/sourceadmit/sourceactive/peak/coalesced/refused.
No rawkeys/values/tokensintelemetrylabels. EnsurecleanupHTTPconnections,clients,
process,SQLitefileandtempdir onfailure/interruption. Verifyzipbytes/runnablefreshdir.

## Article and figures

Begin with the operation's guarantee beforeimplementation. A cachecontract is a
setofdecisionswhichmustsurvivetogether, noteveryRedisfeatureturnedon. Show a
productdisplaycopy and sourcepricecheck underupdate, lostinvalidation anddeadline.
Mainideasmustbereadablefromfigures beforeprose. Proposed3–4integratedfigures:
- Controlledsystemtimeline: oldobservation, committedchange, latefill, readwithin
  budget, deadline, sourceunavailable. Comparebounded-age display withauthoritative
  path, showing refusal whenrequiredsourcecannotbeobtained.
- Requestpath: key/contextvalidation, boundedRedislookup, envelopevalidation,
  coalesced/admittedsource, finaldeadlinecheck. Selectfaultandfollowactualpath;
  boundedrefusal visible, no infinitelyrepeatingretryarrow.
- Samekeyvsdistinctburst: identicalrequestcount, perkeywaiterlimit16, source4,
  cacheoutage; showworksharedandrefused. Assumptionfixedsimultaneousburst clear.
- Fleetadmission: processcount multiplieslocal4concurrency/20rate; fixedfleetbudget
  vsperprocessallowance. Show why autoscalingcannotassumeeachinstanceownsallspare
  sourcecapacity. Staticpartition or sharedadmission are alternatives, notfreeglobal
  guarantees. Couldmergewithburstfigure if that improvesreaderwork.

Use established headings; connect each mechanism to priorarticleandcontract.
Explain when simplerTTL/postcommitDELsuffices andwhen strongread-your-writes,
versions/durableinvalidation/authoritativepaths requireanotherdesign. Scalingchoices
L1/Cluster/persistence justifiedbymeasuredworkload, no blanketexpertchecklist.
Include usable APIcommands, acceptancecases and investigationsteps inREADME.
Endwithapplicationdecision notclaimthislocalteachingserverisproductiondeployment.

## Sources / implementation evidence already inspected

https://nodejs.org/docs/latest-v24.x/api/sqlite.html
ReadviaSQLitecurrentdocs24.xlink afterdirectopenfailed; DatabaseSync & StatementSync
available, synchronousAPIs, parameterbinding. Currentv24docsdescribe24.22.1;
installed24.16.0 is actualtestbaseline. Do notuseAPIaddedafterit. sqlite isrelease
candidate in24.15+, notclaimstableproductiondefault. CheckneededAPIs locally.
https://redis.io/docs/latest/develop/clients/nodejs/connect/
Connectionreadiness/connecttimeout/reconnect/options; actual6.3installedsourcewins
on version-specificbehaviour. https://redis.io/docs/latest/develop/clients/nodejs/produsage/
Currentdocs showoldcommandOptionssyntax; do notcopyunchecked.
https://redis.io/docs/latest/commands/set/
PXremainingTTL and overwritingsemantics. No8.4IFEQetc in8.2baseline.
Installed6.3commands-queue.js/index.d.ts inspected: offlinequeue, finitequeuelimit,
abort/timeoutlisteners. Priorclient-lab/client.mjs executes sentSEToutliving40ms
optionunderCLIENTPAUSE, laterapplies. Mustpreservethisfindingincapstone.

## Implemented and verified

Referenceapp complete with sourceworker, explicitconditionaltransaction, bounded
GETRANGE, admission/queue/waiter limits and nativeHTTPtests. Fourfigures andprose
complete; see article-14-review.md. Fresh11filearchive npmci/npmtest/npmstartpass.
PrimaryGETRANGE/SQLiteTransaction/RETURNINGdocs read toconfirmbyte andcommit semantics.
Initialproposal refinements: actualSQLiteinworker; explicitCOMMITbeforeworkerreply;
GETRANGEinsteadunboundedGET; pendingHTTPworkremainscountedaftercallerresponse;
sourcepermitremainsuntilworkerack/exit; declaredtokenrefillvsburst distinction.
