# Article 3 — Cache expiration and eviction

Main decision: choose freshness and capacity policies separately. A TTL is neither
an automatic refresh nor a reservation of memory. Build from the same price copy.

Visual arguments:
1. Scrubbable fixed versus sliding expiry: source changes at t=1, reads every 3s,
   TTL 3/6/12s, 24s horizon. Visible copy age, deadline, source and returned values.
   Serial immediate authoritative reload; no concurrency or replica lag.
2. Exact LRU versus simple resident-count LFU, deterministic tie-breaking. Trace
   repeated hot keys, a scan, or a working set one item beyond capacity. Step/back
   and whole trace. Clearly not Redis's sampled LRU/probabilistic decaying LFU.
3. Byte capacity: three small frequently reused cards versus one large response;
   insert large value with/without size-based admission, observe displaced cards
   and subsequent reloads. Fixed toy sizes, no Redis overhead claimed.

Prose: TTL lifecycle and atomic SET EX; GET does not renew, GETEX can. TTL -1/-2;
fixed lifetime vs maximum source age (load time, stale reads, layered caches);
expiry cleanup vs refresh; TTL experiments use business tolerance then workload.
Eviction eligibility/policy, noeviction fill error, volatile keys and separation
from irreplaceable state. Working-set locality, scan pollution, byte costs,
headroom and observed eviction/expiry rates. Later article handles concurrency.

Primary sources checked 26 October: Redis EXPIRE, TTL, GETEX, SET; eviction
reference; pinned redis/redis 8.2.2 redis.conf memory and LFU sections. Latest docs
include LRM absent from the pinned 8.2 example: do not teach it for this baseline.
Native worksheet will exercise TTL transitions/GETEX, allkeys eviction,
noeviction and volatile-lru with no eligible keys; assert outcomes not victim
order because Redis's policy is approximate. Record all results.
