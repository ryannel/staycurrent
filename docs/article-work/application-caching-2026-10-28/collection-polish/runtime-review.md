# Independent review: Redis adapter and operations

Reviewed the current complete `redis.astro`, `operating-caches.astro` and all five scenes in `stories/runtime.mjs` on 29 October 2026. Scope: reader progression, technical interpretation, prose, scene causality and illustrative arithmetic. Reviewed source files, not rendered figures; the coordinator owns layout, mobile, themes and controls. No article or runtime edits were made by this reviewer.

## Findings

**Medium — failover announces the returned value before it arrives.** In `runtime.mjs` lines 49 and 59, `read=t>=.9` displays £20 beside App and the footer changes to “returned £20” at the same point. The replica-to-server reply continues until .91, and the server-to-App reply runs .92–.98. This briefly breaks the causal sequence that the animation is meant to teach. Hold the App result and final returned-state label until the reply reaches the App. The replication example itself is correct.

**Low — “four calls” adds an unnecessary counting ambiguity.** `redis.astro` line 73 describes the introductory outline as four calls. The request makes GET, source.read and SET; `return` is not a call, while `encode` is a nested local function rather than the fourth remote step a reader might look for. The unnumbered description of the successful path is sufficient.

## Verdict and coverage

Apart from that bounded timing repair, the revised pair develops useful practitioner judgement and reads coherently. It introduces the successful path, interpretation, optional work, deadlines and updates before deployment concerns. The operations article distinguishes request outcomes, ratios, rates and freshness without treating Redis's own counters as application truth. Revised prose removes trace narration while retaining reasons and limits. The shorter table for reply/outcome decisions is appropriate: those branches do not need animation merely to be made visual.

Scene accounting checked: both latency bars total 30 ms; cold-v2 demand is 19 at 10% traffic and 55 at 50%; 30 is an admission allowance, not an assertion that 55 reads are executed. The deadline variants match the adapter's 20 ms optional-write cap and 5 ms return reserve, including skipping a fill after a source completion at 197 ms. All five scene renderers produced both layouts at eight time points and all exposed variants without undefined, NaN or Infinity.

The request animation keeps App, Server, Cache and Database roles and source ownership intact. The optional failed fill preserves the answer without inventing a background job. The failover animation correctly keeps the source at £22 while a surviving £20 copy reappears. The caption states the asynchronous failure order; this is not presented as an executed failover test.

## Evidence and limits

Rechecked primary documentation for the consequential illustrated claims:

- [Redis replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/): asynchronous propagation, acknowledged-write loss and empty-primary restart behaviour.
- [SLOWLOG GET](https://redis.io/docs/latest/commands/slowlog-get/): command execution timing excludes client communication.
- [INFO](https://redis.io/docs/latest/commands/info/): keyspace hit/miss counters count store lookups, not application acceptance; separate expiration and eviction counters.
- [SET](https://redis.io/docs/latest/commands/set/): an ordinary replacement discards the old TTL; EX supplies a new expiry with the value.

Read the retained `evidence/adapter.md` and the current adapter lookup, read and optional-write functions. Existing native execution results remain applicable because practice code is unchanged. No rerun or broader production-capacity claim is made. Fresh rendered review is still required for the changed figures and is assigned to the coordinator.

## Scoped confirmation

Confirmed the coordinator’s repairs: App/result completion now waits until .98 in the failover sequence, after the reply travels back; the introductory outline no longer claims four calls. Both findings are resolved in source. Rendered checks remain the coordinator’s scope.
