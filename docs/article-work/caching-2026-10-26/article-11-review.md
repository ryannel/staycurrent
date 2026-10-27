# Article 11 completion review

27 October 2026. Sole-agent review; no independent reviewer.

## Teaching against the reference standard

Gears and Load Balancing were already read and interacted with (plan.md). This
article begins with a failed familiar MGET and derives the new placement boundary.
The routing figure compares actual byte-derived slots, including same-primary /
different-slot keys. Migration preserves identities of keys a/b, owner and client
map, making ASK's temporary route different from MOVED's changed ownership.
The shared-scale load figure holds total work fixed while adding nodes, exposing
why aggregate spare capacity cannot divide one hot key. The topology figure then
separates copies, primary majority and coverage. Connected prose draws each
conclusion from those changes before discussing production trade-offs.

Established titles/headings. No benchmark capacity numbers masquerade as Redis
measurements. No claims that hash tags provide cross-shard transactions, that
adding nodes automatically reshares data, or that local six-process tests prove
zone or partition survival. Figures are explicitly models; slot calculation is
real and tested against Redis. Classic8.2 migration scope explicit.

## Evidence and tests

Native final repeat completed exit0. Six private local nodes; actual CROSSSLOT,
MOVED, ASK, TRYAGAIN, key migration, new ownership and automatic replica promotion
with cluster-client recovery. Output evidence/cluster.txt. Reconnection-disabled
initial failure informed the article and final bounded reconnect configuration;
not hidden behind a successful server promotion claim.

51 collection tests pass. Four new tests cover native UTF8/brace slot results,
migration ownership/routing invariants, total offered-work conservation and hot
key indivisibility, and separate coverage/majority/surviving-copy conditions.
Public zip contains README/package/lock/run only; byte comparison with all source
files and zip integrity both pass. README records cleanup, timers and limits.

## Browser

Desktop1280x1000light/dark; phone390x844light. All four figures inspected; actual
phone width=scrollWidth=390. Heading/prose fit. No consoleerrors.
- Sharedtag -> both8000/B. card:42 and café -> sameB, different slots, CROSSSLOT.
- Two Next steps -> split keys / ASK; keyboardEnter -> ASKING retry, map stillB.
  Later ownerC/mapB -> MOVED; final step mapC. Previous/reset controls present.
- Six primaries at50% ->140/20/20/20/20/20, excess40; Home/End controls work,
  all-hot ->240onA/0others. Fixed sharedscale and budgetmarker legible.
- FailA, coverageoff -> healthyC serves; coverageon+promote ->3/3serving.
  FailA+replica -> no promotion, fullcoverageblocksC; coverageoffpermitsC.
  FailA+B -> majorityabsent and C unavailable evenwithcoverageoff.
- Clarified broken replication-link label rather than leaving a live-looking
  copy arrow below an offline primary. Dark/final topology rechecked.
- Only short slot-marker transition; existing reduced-motion rule disables it.

## Delivery

Final build141pages,116checked,all13rulespass. git diff --check clean. Manifest11
available and article10directnextlink included. Exact commit/push/deploy and live
control verification next; remainingarticles12–14andreferenceapplication pending.
