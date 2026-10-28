# Operating a cache — draft record

Written 28 October 2026 from `planning/operations.yaml`. Draft only; publication
is not authorised. The coordinator owns build, dense-prose, rendered checks,
independent review and delivery. No build, preview server, topology exercise,
review delegation or commit was run by this writer.

## Inputs and reference preparation

- Read the writing, figures and continuity skills, the stepper and render-check
  guides, README, site direction, commission, plan and canonical example.
- Read all 19 bounded parts using `scripts/read-writing-reference.py`, each in a
  separate call with a 4,500-token output allowance. All END markers arrived:
  sequences 1–6, indexes 1–7, storage 1–6.
- Inspected rendered `sequences-figure-3.png`, `indexes-figure-3.png` and
  `storage-figure-5.png` in `/private/tmp/application-caching-references`.
- Read the complete relevant Redis integration, misses, memory and freshness
  explanations, recovering output where combined reads clipped it.
- Adapted the references' method: locate the wait or copy in visible parts of the
  system, change one condition, then explain the different operating decision.

## Draft and figures

Body: `src/articles/application-caching/operating-caches.astro`, approximately
2,900 source-file words including labels and sources. Metadata: parent `index`,
order 70, Deep dive, draft.

1. Static application-outcome map distinguishes valid hits, missing keys,
   unusable found values and cache failures. The source gate stays visible.
2. `operations/Latency.astro`: two thirty-millisecond lookups, with different
   execution and client waits. Bands resize and a finite moving cursor follows
   the counted work. Communication is explicitly an accounting band combining
   outward and return travel, not a literal chronological network trace.
3. `operations/Failover.astro`: the source commits revision 2; the old primary
   acknowledges DEL; the replica misses DEL; promotion exposes revision 1.
   A finite card movement sends the found answer towards the reader. The
   reader requiring revision 2 rejects it. This is documented possible order,
   not native execution evidence.
4. `operations/Rollout.astro`: twenty dots representing one hundred requests
   move between old and new readers. Entry blocks and space/source meters
   change with the rollout. Select whether old-format invalidation continues.
   The broken path preserves old bytes but refuses to trust them on rollback.

All players use shared `stepper.mjs`, `data-live` text, polite explanations,
Back/Next/Play/Reset and text alternatives. Motion is finite and reduced-motion
media handling removes both WAAPI and CSS transitions. Shared appearance is in
`operations/operations.css`, using site tokens. No headings inside figures.

## Arithmetic and stated assumptions

- Counter window: 8,900 − 8,000 = 900 server hits; 2,100 − 2,000 = 100 misses.
  Fifty unusable found entries leave 850 valid hits per 1,000 requests.
  One lookup per request and no unrelated traffic are explicit assumptions.
- Latency traces: 2 + 4 + 22 + 2 = 30 ms, and 24 + 3 + 1 + 2 = 30 ms.
  Neither is a measured service trace. The adapter's pool rejects when full;
  the article distinguishes that from clients that queue.
- Rollout: 100 requests per invented interval; warm requests have 90% hits.
  Ten cold v2 requests plus nine v1 misses require nineteen source reads.
  Fifty cold v2 requests plus five v1 misses would require fifty-five reads.
  Prepared 50% stage instead uses ten demand reads and five warm-up reads.
- Source allowance is thirty starts per interval, with sixteen illustrative
  space units. These are separate from every other article's example limits.
  Space blocks represent groups of useful entries, not exact byte allocations.
- At the broken rollback, untrusted old entries are bypassed. One hundred
  requests want reads; thirty are admitted and seventy refused. This is a
  deliberately simplified independent-read interval, not a coalescing or
  timing model. Safe rollback still depends on entries remaining useful;
  prose explains expiry during the rollback window can make it cold too.

## Continuity pass

- P7 remains north/en-GB/GBP, GBP 20.00 revision 1 → GBP 22.00 revision 2.
  Representation v1/v2 is explicitly separate from source revision 1/2.
- The full v1 and v2 keys are present. Shortened figure keys are explained.
- Source owns product changes; Redis never reads the source itself. Checkout
  retains its authoritative transaction and stock checks.
- A found key is not automatically usable. Observation-age rules, revision
  requirements, current access and complete affected representations remain
  application concerns. A later comparison is not proof of earlier violation.
- Thirty seconds remains insertion TTL unless an observation-age contract is
  explicitly discussed. Promotion, persistence and moving formats grant no
  fresh age allowance.
- Cache and source failures stay distinct. All fallback, warm-up and recovery
  work share source admission and the request's remaining deadline. Rejected
  work is not counted as successfully saved work.
- General cache operating principles lead; Redis-specific counters, Sentinel,
  Cluster, persistence and ACL behaviour are named as such. No new general
  distributed-systems course or extra child is introduced.
- Invalidation retained for both formats is a necessary rollback condition,
  not a proof that basic invalidation eliminates stale-fill races. Links return
  readers to freshness and versioned fills for those protocols.
- The rollback and workload scenarios are local illustrative extensions;
  they do not alter canonical product facts or other articles' capacities.

## Primary-source checks

Checked with current official documentation on 28 October 2026:

- [INFO](https://redis.io/docs/latest/commands/info/): `keyspace_hits` and
  `keyspace_misses` are successful/failed dictionary lookups; `expired_keys`,
  `evicted_keys`, commandstats `rejected_calls` and `failed_calls` support the
  server-side observations. They do not classify application validity.
- [SLOWLOG GET](https://redis.io/docs/latest/commands/slowlog-get/): execution
  timing excludes client communication; threshold and retained length limit
  the log's evidence.
- [Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/):
  separate command cost, networking, environment and persistence effects.
- [Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/):
  normal asynchronous delivery and acknowledged-write loss; documented empty
  restarted primary synchronising replicas to empty state. Figure 3 is an
  application-level consequence of losing a deletion, with expiry still open.
- [Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/):
  automatic promotion and current-primary discovery for compatible clients.
- [Persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/):
  RDB snapshots, AOF replay and optional persistence for caches. No measured
  recovery-time or storage guarantee is added.
- [Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/):
  slot ownership, MOVED/ASK, hash tags and multi-key boundaries. No cluster
  has been provisioned or measured for this draft.
- [Security](https://redis.io/docs/latest/operate/oss_and_stack/management/security/)
  and [ACL](https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/):
  trusted network access, authentication, TLS and separate command/key rules.
  In particular, key patterns do not constrain whole-keyspace commands such
  as FLUSHALL. Verification advice is prospective, not an executed ACL test.
- [AWS caching challenges and strategies](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/):
  source overload during cache loss and cold starts, testing with caching
  disabled, and format compatibility. The canonical URL currently redirects
  to Builder Center; its full text was read there.

## Checks still owned by the coordinator

Run the focused dense-prose rule against a built preview and provide any findings
for repair. Inspect the page and all controls at desktop and 375 px, both themes,
including keyboard and reduced motion. The writer has not claimed those checks.

Useful expected control states:

- Latency final step: durations remain 30 ms total in both cases; Next does not
  advance past step 5; switching case redraws the same step.
- Failover step 3: source revision 2, primary empty, replica revision 1. Step 4:
  primary unavailable, replica promoted. Step 5: App A rejects revision 1 for
  its revision-2 read.
- Rollout steps 1–7: source starts 10, 19, 10, 15, 10, 20, 10 under safe mode.
  Space units 6, 7, 8, 12, 12, 12, 12. Broken final step changes source to
  100 wanted/30 admitted and 70 refused; 14 of 20 dots become outlined squares.
- All motion ends; reduced motion retains the final meaningful state.

Independent article reviews remain pending. No publication or claim of complete
rendered verification is implied by this draft record.
