# Handling cache misses: draft record

Written 28 October 2026 from the approved `planning/misses.yaml` and canonical
`docs/coverage/application-caching-2026-10-28.yaml` node. Draft metadata only;
publication, commit and push are not part of this assignment.

## Preparation and reference use

Read staycurrent-write, staycurrent-figures, staycurrent-continuity, the stepper
guide and rendering guide. Read all 19 complete writing-reference parts separately
using `read-writing-reference.py`, with a 5,000-token output budget on every part:
sequences 1–6, indexes 1–7, storage 1–6. Every END marker was delivered.
Inspected the rendered Sequence diagrams figure 3 and Storage and durability
figure 2 from `/private/tmp/application-caching-references/`. Their separated
waiting/work states, visible slots and accumulated counters guide these figures.

The user’s animation nudge arrived during implementation. Figure 1 adds visible
caller paths converging into one loader and finite request movement on arrival.
Figure 5 moves the same product tokens into execution slots, queue places and
outcomes. Neither uses decorative perpetual motion. Reduced motion suppresses
the travelling packet and token transitions. Shared stepper supplies manual
controls and reading-time playback; each figure includes a text alternative.

## Source checks

Opened the following primary sources on 28 October 2026 and inspected the relevant
sections rather than relying on the planner’s check alone:

- Go `singleflight` documentation: Group scope, Do/DoChan result sharing and
  Forget permitting future work. No claim that the package supplies budgets.
- Memcached meta protocol: atomic stampede handling and early recache; one
  selected requester and CAS-guarded updates, an alternative to Redis.
- Redis distributed-lock documentation: single-instance expiring ownership,
  unique tokens, owner-checked release and asynchronous-failover limits.
  The article explicitly does not implement or analyse Redlock.
- Amazon Builders’ Library, Caching challenges and strategies: dependence on
  caches, cold starts and cache-disabled testing.
- Amazon Builders’ Library, Using load shedding to avoid overload: overload
  observations, useful completed work and quick-failure latency distortion.
- Amazon Builders’ Library, Timeouts, retries, and backoff with jitter: waiting
  resources, bounded attempts, correlated retries and end-to-end budgets.

Article source links are under Sources and further reading. All numerical
scenarios are invented models; no throughput or native Redis execution claim.

## Scenario facts and expected outcomes

P7 remains north’s public en-GB/GBP product card, revision 1, GBP 20.00. The full
key is shown before abbreviated figures. The complete key also identifies shared
work. Checkout remains authoritative and is not enabled by the display card.

- Burst: callers A–D arrive at 0/20/40/60 ms. A 100 ms independent read starts
  four loaders, ending at 100/120/140/160 ms. Coalescing starts one loader,
  answering all four at 100 ms. At 40 ms, independent/shared reads start two/one
  loaders; C and D hit the completed fill. Equal-time completion precedes arrival.
- Wait: separate two-caller trace. A leaves at 50 ms; B arrives at 20 ms and may
  wait to 140 ms. L1 has its own 120 ms work budget and settles at 100 ms. A’s
  timeout does not release L1’s source slot or stop B’s wait.
- Lease: A’s lease expires at 80 ms, its source read ends at 120 ms. B gets a
  new token at 90 ms and ends at 140 ms, with its lease still valid. Both source
  reads overlap for 30 ms. The old token is rejected at publication and release
  on the assumed unchanged coordinating store. This does not claim source
  freshness or source/cache atomicity.
- Refresh: the freshness policy has already established t=30 s as this old
  answer’s last serving boundary. It is explicitly not inferred from insertion
  TTL. Request-triggered refresh at 24 s fails at 26 s; requests at/after 30 s
  cannot keep using the old answer. Jitter chooses earlier refresh points,
  illustrated by 22–26 s, without extending the serving allowance.
- Admission: six distinct product IDs P7–P12 share the established shop/locale/
  currency context. Two source slots, two queue places, 150 ms caller budgets.
  No retries or old copies. At fixed 100 ms service time, two source answers
  complete and four callers are rejected; the queued callers lack enough time
  for another read. At 200 ms, no on-time answers result, the queue drains at
  150 ms, and running reads retain their slots until settlement at 200 ms.
  The model’s exact duration knowledge is labelled; real admission uses measured
  variable latency rather than assuming this is a throughput predictor.

## Checks and continuity

`node --test src/components/application-caching/misses/model.test.mjs`: five
tests pass. Checks cover the slower-fill overlap, saved duplicate work versus
retained waiters, work surviving the first independent fill, slot/queue bounds,
and source accounting after caller deadlines. `git diff --check` reported no
whitespace errors for the owned paths (files initially untracked).

Continuity reread completed across article, labels, captions, controls and final
failure table. The progression preserves one distinction at a time: callers
versus loaders; local versus shared ownership; refresh versus permission to
serve; per-key versus source-wide limits; cache failure versus absence; recovery
connectivity versus useful hits. Freshness owns permissible answers and
invalidation; versioned fills owns conditional publication; memory owns entry
admission; Redis owns concrete client configuration; operations owns rollout and
incident procedure. No unresolved shared-example change is required.

Coordinator owns build, dense-prose output and desktop/375 px light/dark control
checks. Those checks have been requested and are not claimed here. No review
worker, server, build, commit or publication was started by this writer.
