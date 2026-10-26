# Article 8 — Redis transactions and Lua scripts

27 October 2026. Sole-agent authorship and review, not independent review.

## Technical evidence

Primary transactions, scripting, Lua API, EVAL, programmability and distributed
locks documentation checked. Current EVAL reference's script eviction since 7.4
qualifies the older scripting-introduction wording about indefinite retention.
No 8.4-only compare-and-set or DELEX examples presented for the 8.2.2 baseline.

Native lab uses official Redis 8.2.2 locally built from source and node-redis 6.3.0.
It owns a disposable Unix-socket process with persistence disabled, no Redis TCP
listener and bounded runner lifetime. Separate clients and explicit await barriers
produce the lost update and WATCH conflict deterministically. INCR reply order is
not assumed across connections. The client asserts results, including:

- Plain GET/SET and MULTI around precomputed SET both finish at 11.
- WATCH rejects stale EXEC with WatchError; fresh read/retry finishes at 12.
- Two INCR operations preserve both increments.
- A queue-time arity error causes EXECABORT, including commands queued afterwards.
- MultiErrorReply identifies a runtime error; preceding and following SET survive.
- A Lua redis.call error leaves the preceding SET and prevents the following SET.
- Conditional fill rejects missing/mismatched generations and invalid TTL; accepts
  matching generation and verifies remaining expiry.
- SCRIPT FLUSH affects only this private instance; NOSCRIPT then reload verified.

Final evidence in evidence/atomicity.txt. Six-file zip integrity and byte identity
checked. No package dependencies or binaries in archive. Pinning and official
server build instructions included. Native tests establish outcomes, not latency
or a complete source-database invalidation protocol.

## Teaching review

Uses the reference articles' progression from a visible mechanism to a named
concept. Counter and two workers stay stable across protocols; the reader chooses
the interleaving, observes the lost change, then observes rejection and rereading.
The native experiment grounds the model rather than treating animation as evidence.

The error figure exposes surviving stored values, not just success/error badges.
Inspection frames explicitly cannot be observed by another client inside EXEC or
Lua. Its three modes distinguish pre-execution abort, transaction continuation and
unhandled Lua termination without suggesting rollback.

The source and Redis boxes give atomicity a spatial boundary. A legal Redis fill
can precede a source update and remain stale until invalidation. Occupancy bars then
turn a longer atomic operation into visible waiting for unrelated GETs. Four
experiments carry the main concepts; connected prose supplies connection ownership,
retry budgets, metadata lifetime, deployment and operational limits. Around ten
minutes of prose, two short code examples and a runnable lab.

Avoids treating leases as fencing, pipelines as transactions, successful scripts
as source-database consistency, and an error as proof that nothing changed. The
collection's replication/failover article will develop durability separately.

## Rendered and functional review

Desktop dark and light rendered; four figures inspected. Worker observation font
reduced from the shared large metric size after it wrapped awkwardly on desktop.
Dedicated 390×844 light preview inspected for every figure; content width equals
390 and all controls fit. Transaction operations stack vertically. Temporary
viewport overrides reset and temporary phone tab closed.

- Plain and MULTI shared schedules finish at 11.
- WATCH schedule rejects B; two more B advances commit 12.
- INCR keyboard Enter, B then A, finishes at 12.
- All error modes stepped to completion; disabled end controls and surviving values
  match the model/native outcomes.
- Guard rejects g1 after g2; alternate order displays source £15, cached £12 and g1
  before invalidation. Source box remains outside the Redis boundary.
- Script range Home: 1 ms execution, zero first-read wait. End: 100 ms execution,
  97 ms first-read wait. Phone geometry and labels remain legible.
- No browser console errors. All controls use native buttons/select/range; no
  automatic motion, so reduced-motion users retain the same interaction.

Final 39 collection tests pass, including six new atomicity model tests. Production
build after manifest and article-7 link update passes all 13 site-check rules.
Whitespace check passes. Publishing each completed article is authorised.
