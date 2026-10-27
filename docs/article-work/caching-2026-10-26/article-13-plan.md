# Operating Redis caches — article 13

27 October 2026. Article12 published/liveverified. Sole-agent work.

## Teaching design

Operations begins at a user-visible failure and asks which boundary changed.
Opening figure: three synthetic 100ms Redis round trips. Different decomposition
(network, execution, waiting behind another command). Shared 100ms scale; highlight
only own command execution counted by SLOWLOG. Same observed elapsed time does not
identify a cause; low own execution does not exclude Redis queueing. Distinguish
synthetic known schedule from inferred production attribution. Follow with evidence
and interventions: traces/clientqueues/network, commandmix/slowlog/latencyevents,
memory/evictions/sourcework. Correlation narrows hypotheses, not a magic diagnosis.

Second figure: counter sample window. Earlier900hits/100misses, later920/180.
Cumulative84% hides recent20%. Render100 recent lookup tiles (20hit80miss) and
show subtraction. Reset alternative counters5/5 sameprocess makes subtraction
invalid; no requests alternative unchanged means undefined hitrate, not0/100.
Identity changes also invalidate continuity. Aggregation weighted by lookupcount;
failedrequests andL1hits excluded; application success/freshness metrics separate.

Third figure: access gates for a catalog-only application identity. GETcatalog
passes command+key; GETorders failskey; CONFIG/FLUSHALL failcommand; arbitrary
catalogkey stillallowed (ACLnotenduserauthorisation). Not a fullACLinterpreter.
Use nativeobservations. Commands and keypatterns separate; selectors/cats advanced
outsideexample. Network/TLS/auth/authorisation separate. Client handshake actual
permissions tested. Existingauthenticatedconnections surviveoff/passwordremoval;
controlled reconnect vs emergencykillneedsfallbackbudget. Nativeexercise below.

Fourth figure: staged namespace rollout. Fixed1000requests/s, oldwarm95%hit,
newcohortinitiallycold0% or warmed90%. Newtrafficfraction0..100. Sourcebudget200/s.
Oldmiss50*(1-f), newmiss1000*f*(1-newHit). Cold20%=>240>200, cold10%=>145.
Show splittrafficpaths andcommon source-loadbar/budgetline. Sliderwarming is
an assumed observed cohort hitrate, not automatic warmup. Fixedtotal, independence,
no L1/coalescing/expiry churn explicit. Distinct from failurearticle capacity:
plannedchange duplicatesnamespace/memory/invalidation; rollback mayrevivestaleold
if invalidationsstopped. Versions/ACL/persistence/clientcapabilities test in staging.

Connected prose should conclude with usable incident/rollout runbook and practice.
Use precedingarticles rather than re-teaching Redis architecture. Keep telemetry
bounded and avoid realkeys/values/secrets inlabels/logs. Operationalcontent must
support diagnosis and safe action, not become a configencyclopaedia.

## Primary sources checked

https://redis.io/docs/latest/operate/oss_and_stack/management/security/
Trustedapplications/networks; avoidpublicexposure; AUTHnottransportencryption;
TLS supported client/replication/Clusterbus. ACLpreferredovercommandrenaming.
https://redis.io/docs/latest/operate/oss_and_stack/management/security/encryption/
TLS compileoption andportconfig; clientcertificateauthentication configurable;
verifycertificatechain/name and relevant links, not disableverification.
LabprivateUnixsocket/noTLS intentionally not a productionTLSconfiguration.
https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/
Command+keypermissions, explicitallowlist; SETUSERincremental unlessreset; off
preventsnewauthbutexistingconnectionsremain. Multiplepasswords supportoverlap.
Permissionchanges vscredentialrevocation notconflated. Persistpolicythroughactual
config/ACLfile/provider workflow. ACLnotratequota orappuserpermissionmodel.
https://redis.io/docs/latest/commands/acl-dryrun/
Permissioncheckwithoutactualcommandexecution. Doesnotproveclientstartup/reconnect
orapplicationsemantics. NativeSETdryrunleaves12unchanged.
https://redis.io/docs/latest/commands/info/
Counterskeyspacehits/misses are keylookupcounts; memory/clients/commandstats/errors,
runid/uptime/roleidentity. Fieldsvarybyversion, do notimport8.10fields into8.2.
https://redis.io/docs/latest/commands/config-resetstat/
Resetsstatisticsincludinghits/misses withoutrestart. Neverresetproductionmetrics
merelytogetawindow; computecounterdeltas and detectdiscontinuity.
https://redis.io/docs/latest/commands/slowlog-get/
Executiontime excludesI/O; boundedthreshold/retention, commandargumentscanappear.
Currentdocsseventhelement8.10excluded; native8.2records used. Slowlognotendtoendlatency.
https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency-monitor/
Serverevents/threshold; complementscommandlogandapplicationinstrumentation.
ACLLOGwebpagetimedouttwice; official8.2.2src/acl.c read reasonfields andRESPmap.
Installednode-redis6.3ACL_LOG.js inspectedRESP3map; rawreplyisobject notRESP2array.

## Native observations

examples/caching/operations-lab built fromprivateUnixsocketrunner, pins8.2.2+6.3.
InitialtestassumedRESP2ACLLOGarray; correctedexplicitRESP3 andobjectreasonfields.
Finalrunexit0, evidence/operations.txt. Temporaryrandomcredentialsneverprinted.
- Catalog GET/SET allowed; ordersGET, CONFIGGET, FLUSHALL, SLOWLOG deniedNOPERM;
  originalcatalog12remains. ACLLOGrecordskey+commandreasons.
- ACLDRYRUNSETallowedbutdoesnotwrite.
- Useroff: freshauthWRONGPASS, existingconnectionGET12.
- On/addnewsecret: newconnect; removeoldsecret: oldfreshauthfails, oldsessionworks.
- CLIENTKILLUSERcache-appkillsONLYtwoownedclients; newsecretcanreconnect.
- ThreeGETs produce delta2hit/1miss. RESETSTAT0/0same runid.
- Test-onlyslowlogthreshold0/maxlen8 retains8entries, includesGET/executionmicros.
No latencybenchmark, productionaccess, TLSproof orsilentnetworkfailure claim.
README/zip,models/figures/prose/review/build/publication remain.

Completed implementation and review: see article-13-review.md. README and download
complete, final native repeat allassertionspass, models/prose/figures verified.
