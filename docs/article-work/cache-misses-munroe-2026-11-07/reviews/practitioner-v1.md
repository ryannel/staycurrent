# Senior-practitioner review — v1

Reviewed 7 November 2026. Scope: the rendered article text, article and figure source where needed to audit claims, the cache-misses brief and exit questions, expert dossier and shared example. Source SHA-256 `41ec85b8224fca8d940dbd51e9a32198469205ffeedcfde12df438af139bc1bf`; extracted-prose SHA-256 `6488b90b1a5747201ee6994515e6b42f0eea682dd9fa276b9650746f4d2330c7`; both independently matched v1-build.json. No author notes or other reviews read.

## Findings

### P1 — Critical: the prewarm comparison assumes a popularity order the model does not specify

**Location:** article line 184, Figure 5; `src/components/application-caching/cache-misses/recovery.mjs` lines 25–27 and 53–54.

**Observation and reader effect:** “A catalogue-order warm-up in this model restored about 20% of requests after five seconds” presents a calculated line as a result from the stated Zipf workload. The figure sets hit share to `time / 25` and labels the comparison “Simulated, not measured”. Filling 20% of the keys does not imply serving 20% of requests under skewed popularity. A reader could reproduce this calculation to plan recovery and get a very different answer.

**Support:** the preserved `cold2.py` run executes demand mode only. The prewarm curve is the explicit linear expression in the figure, not that simulator's output. A fresh analytical check with Python 3.15.2 and the supplied 50,000-key Zipf exponent-1 distribution gives 85.88% request share for the first 10,000 most-popular keys and 1.96% for the least-popular 10,000. Twenty per cent is the expectation for a uniformly random catalogue order independent of popularity. That additional assumption and the analytical status are not stated. The 25-second whole-catalogue lower bound and the recorded demand curve remain sound.

**Understanding needed:** distinguish the recorded demand simulation from an illustrative prewarm expectation, and expose the assumption connecting catalogue order to popularity.

### P2 — Critical: a hypothetical stale response has become an observed line in the lease log

**Location:** article lines 43–47, 104 and 107–108; Figure 3's older-list lane.

**Observation and reader effect:** the trace introduced as the recorded run says B “serves the older list” at 11 ms. This makes the experiment appear to exercise the stale-serving branch as well as lease ownership.

**Support:** `evidence/go/lease-run.txt` records the annotation “(waits or serves stale)”. The underlying `evidence/go/main.go` deletes both the list and lease at line 213; at lines 259–262 B attempts `SET NX`, prints that annotation and sleeps. It neither retrieves nor serves an older list. The denied acquisition, overlapping queries, rejected late publication/release and B's final cached value are genuinely observed. The separate wrapper experiment does exercise a supplied stale-result callback, but it is not this lease run.

**Understanding needed:** keep the sensible hypothetical stale-serving policy visibly separate from what this native trace actually executed. Preserve the observed ownership and timeout outcomes.

### P3 — Medium: the reader cannot yet measure whether coalescing is doing the promised work

**Location:** article lines 68–71, 186 and 198–212; dossier T2–T4 and T8.

**Observation and reader effect:** the article gives an excellent source snapshot and asks for actual source-work counts, but omits the distinction between Redis lookup misses, application loads started, joined callers and source attempts. There is also no concrete indication of where to obtain the latter. A production reader can still compare a Redis miss counter with database calls and misdiagnose either duplicate fills or successful coalescing; recheck GETs alone make the populations differ.

**Support:** the preserved Go experiment deliberately counts loader starts separately from completed `pg_stat_statements` calls. Its raw wrapper outputs even report a started load with zero completed calls after cancellation. [AWS's caching account](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/) explicitly measures downstream requests as well as hits/misses. [Go singleflight](https://pkg.go.dev/golang.org/x/sync/singleflight) provides `Shared`, but that flags all recipients of a shared result, including the initiating caller; it is not by itself a count of avoided loads. The dossier's simplistic wording about counting shared results should not be copied back verbatim.

**Understanding needed:** identify the minimum distinct counters and a source-side check used to establish the claimed reduction, including queue delay/rejections and successful fills. A short diagnostic passage is enough; another metrics catalogue is unnecessary.

### P4 — Medium: two explicitly owned production alternatives are absent

**Location:** “Across application servers” and “When Redis is unavailable”; dossier D2/D6/T5 and D10/F9.

**Observation and reader effect:** Redis scripting is the only shared ownership implementation presented, and local copies or source admission are the only cache-loss alternatives. The dossier explicitly assigns this article the built-in memcached alternative and the failed-shard fallback choice. Their omission loses two useful decisions: checking whether the existing cache already supports coordinated recache before adding a separate lock protocol, and avoiding a hot-key cascade when failed-shard keys move to healthy nodes.

**Support:** [memcached's meta protocol](https://docs.memcached.org/protocols/meta/#atomic-stampeding-herd-handling) integrates miss ownership (`N`, `W`, `Z`), early recache (`R`) and conditional publication through CAS. [Scaling Memcache at Facebook, §3.3](https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf) explains the reserve Gutter pool and why rehashing onto survivors can move overload rather than remove it.

**Understanding needed:** a brief indication of these alternatives and their decision boundary, or an explicit coordinator decision to narrow/reassign this owned scope. Neither needs a full implementation or all the dossier's historical numbers.

## Passing checks and useful passages

The core mechanisms and arithmetic pass: rate × fill time; per-process versus fleet scope; detached shared-load lifetime; cache recheck; independent waiter deadlines; owner-checked publish/release; source-side timeout versus lease expiry; soft/hard serving limits; XFetch formula and residual duplicates; concurrency versus starts per second; mean-versus-median qualification; fleet-wide connection totals; retry multiplication; local-cache capacity charged to the same budget; controlled recovery and metastability. Preserve the 60/240-computation progression, the A/B/C deadline example, the slow-owner trace, the two-places-plus-one-waiter admission example and the explicit 12% useful-response outcome during outage.

The 61/241 query counts and 233-active snapshot, 20-group result, wrapper timings, 181 ms statement timeout, killed-client behaviour and 98th ordinary connection refusal match the supplied raw records. XFetch 2.77 mean/11 p99 and 0.701 s lead, outage 17,689 fills/s and 12.1% full replies, local-copy 72.4% usable replies, and cold-cache top-1,000 milestones match their supplied code/output. These are preserved experiments, not tests performed during this review. The idealised local-copy maintenance and expiry-free recovery run are disclosed.

No unnecessary full mechanism belongs on another page: identity and publication correctness are routed to their owners, while this page retains enough detail to explain load control. I would not restore every historical incident, default or vocabulary term solely to mirror the dossier. The gaps above concern decisions or validation the reader needs.

## Best existing alternative

For an operational introduction, [AWS's Caching challenges and strategies](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/) is the best compact alternative I know. It ties cache dependence, failure fallback, coalescing, TTLs and instrumentation to production practice. This draft is more useful for learning the actual concurrency, cancellation and admission decisions because it works through one service with numbers and executable evidence. After the evidence boundaries and minimal owned coverage are resolved, I would send a new hire here first, then to AWS. For the shared cache mechanisms themselves, the Facebook paper and memcached protocol are stronger primary references.

## Sources and limits

Primary sources checked directly: Go singleflight and `context.WithoutCancel`; Caffeine Population/Refresh; nginx `proxy_cache_lock_timeout`; Redis distributed-lock guidance and DELEX (8.4); PostgreSQL 16 statement timeout, connection checks and connection reservations; XFetch paper; Netflix concurrency-limits; Google SRE overload/queue/retry chapters; AWS caching account; Slack's 22 February 2022 incident; HotOS 2021 metastability paper; memcached meta protocol; Facebook NSDI 2013 paper. These substantiate the corresponding claims above; the retained bibliography's other items were not exhaustively audited.

No fresh PostgreSQL/Redis/Go run, performance benchmark or browser rendering check was performed. I inspected the raw experiment code and output rather than earlier approvals. The only newly executed numerical check was the Zipf/prewarm calculation described in P1, plus build-identity hashes. Figure source was checked for semantic evidence only; layout, animation and accessibility remain with the reader reviewer. No article files changed.
