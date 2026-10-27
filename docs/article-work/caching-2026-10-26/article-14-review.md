# Article 14 completion review

27 October 2026. Sole-agent writing, implementation and review.

## Teaching against the reference standard

Gears and Load Balancing were read and interacted with earlier; plan.md records
those observations. The capstone starts with two concrete operations on the same
product and derives their different guarantees. The first figure retains source,
copy and observation identities through a controlled late fill and expired answer.
The request-path figure exposes accepted answers and bounded refusals; there is
no infinite retry arrow. The forty-request grid makes shared work and refusals
countable before the prose introduces the resource limits. The fleet figure then
shows why local correctness does not establish a global capacity guarantee.

Each figure carries a main idea. Prose connects those consequences to the actual
reference application, prior articles and deployment decisions. Existing industry
terms used in headings. No claim that the local demo is a ready-made production
service, that an accepted age means latest state, that a price read implements a
purchase transaction, or that all Redis mechanisms should be enabled together.
The native tests use the same chosen contract, including its permitted stale fill.

## Runnable application and execution evidence

Official Redis8.2.2 / Node24.16.0 / node-redis6.3.0 / bundledSQLite. SQLite work in
separateworker; explicittransactioncommitsconditionalUPDATEbeforeinvalidating.
OwnloopbackHTTP/privateRedisUnixsocket/tempfilesonly. Allnativeacceptanceassertions
pass, including cold/warm sourcecount, auth/context/locale, corrupt/wrongtenant/
schema/overage/oversizevalues, conditionalrevisionconflict, stale refill boundedby
originaldeadline, expiredsource replynotcached, CLIENTPAUSE/externaldeadline,
actualRedisstop/restart, 40samekey1read16success24refusal, 40distinct4read36refusal,
sourcefailure/cancellation, blockedworkerpermitretention and unfinishedHTTPcount.

Source code formatted for reader inspection. Cache GETRANGE bounds payload before
decoding. Queues/offline replay bounded, externalwait destroysownedconnection on
timeout, no perrequestretryloop. Sourcepermits releasedonworkerreply/exit, notcaller
timeout. Sourcebucketboundsrefillplusburst; fleet scope explicitlylimited. Demo
credentials/publicloopback limitations, clock assumptions, cancellation/ambiguous
writes andcleanup boundaries documented. Metrics have boundedaggregatefields.

The 11-file zip passes integrity and exactsourcebytecomparison. Extracted into
/private/tmp/sc-reader-lx48u320/redis-reference-app, ran npmci then npmtest: all
assertions pass. Fresh npmstart accepted documented HTTP requests: coldsource,
Redis hit, conditionalwrite revision2, authoritative1500 andmetrics hit1. Ctrl-C
exited0. These are runtime checks, not just syntax or model tests.

## Models and browser

62collectiontests pass, including deadlineboundaryrefusal, burstconservation/
completionaccounting and fleetallocationswithinallthreebudgets at1..8processes.
Phone390x844light: allfourfigures inspected, actualwidth=scrollWidth390. Title,
controls,source/copyandanswerpanels readable. Nextx3 ->display1200/source1500;
keyboardEnter ->both503beyonddeadline. Sourcefull/overagepaths503. Burststatslayout
initiallyusedwrongclass; correctedsharedstatrow, rechecked4/0/4/36 andone-source
singulargrammar. Fleet8partition ->8permits/56refill/8burst; onepermitlabelfixed.
Desktop1280x1000dark/light: fourfigures inspected, actualwidth=scrollWidth1280.
Wrongcontextpathrejects/loads, samekeycompletion1source/16success/24refusal,
fleet4partition12permits/60refill/12burst. Home/End/checkbox/buttons work; no
consoleerrors. No automaticmotion; labels and numericoutcomes accompany colour.

## Publication gate

Initial144pagebuild/119checked/all13rulespass. Finalmanifest14true, article13direct
nextlink and collectionintrocompleted wording included. Finalbuild/model/sitecheck
checks and exactcommit/deploy/liveverification recorded atdelivery. Fullcollection
completionaudit stillrequired before markinggoalcomplete.

Final gate: 62modeltests,23sitechecktests,144builtpages/119checked/all13rulespass;
gitdiffcheckclean. Nativefreshdownloadtest and manualstartuprequests passed.
