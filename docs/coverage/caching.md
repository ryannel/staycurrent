# Caches and in-memory stores: proposed coverage map

## Agreed framing, 28 October 2026

Teach caching as a general subject. Use Redis as the concrete implementation for
worked examples, presenting it as one of many choices rather than the default
or the definition of caching. Distinguish general principles from Redis-specific
commands, behaviour and guarantees, and explain relevant alternatives where they
change a reader's decision. Carry this framing into future briefs, drafts and
reviews. This note does not authorise publication or approve the proposed tree below.

Revised field allocation, 18 October 2026. **Proposal for user discussion.**
The [independent derivation](../planning/databases-depth-2026-10-18/caching-proposal.md)
and [ability breakdown](../planning/databases-depth-2026-10-18/caching-abilities.md)
preserve the reasoning before coordination. The allocation here, including the
coordination notes, supersedes that first proposal. See the
[independent challenge](../planning/databases-depth-2026-10-18/review-storage.md)
and [decisions](../planning/databases-depth-2026-10-18/synthesis-decisions.md).
No article, route or publication status changes through this map.


Independent planning proposal, 18 October 2026. Derived after saving [the practitioner abilities](../planning/databases-depth-2026-10-18/caching-abilities.md). Every destination below is proposed; this does not create routes, articles or publication permission. There is no target article count. The seven-page Redis branch follows the work needed to use that implementation coherently.

## The collection's promise

A reader should be able to add a cache without making the source or its answers less dependable, and use an in-memory data-structure store without inventing a guarantee it does not have. They can state what a lost key means, predict misses under failure, choose a valid atomic boundary and demonstrate recovery of the accepted state.

The running ticketing example and identifiers remain those in the abilities file. Each article restates only the part of that state it needs. A reader entering through an outage should not have to read the modelling journey to learn whether losing that key is permissible.

## Proposed groups and entrances

These are editorial groups, not a requirement for four navigation levels.

| Group | Articles | Reader job |
| --- | --- | --- |
| CA-G01 — Cache role, validity and capacity | CA-A01–CA-A04 | Decide whether to cache, then keep the answers and source safe. |
| CA-G02 — In-memory state and service reliability | CA-A05–CA-A09 | Model state, change it correctly, understand its loss boundary and recover useful service. |
| CA-G03 — Choose an implementation | CA-A10 | Compare credible approaches against one explicit workload and operating contract. |
| CA-G04 — Redis Open Source in practice | CA-A11–CA-A17 | Follow real commands through execution, clients, storage, replicas, sharding and operations. |

Suggested journeys:

- **Adding a result cache:** A01 → A02 → A03 → A04, then A10. Use A12 for the Redis integration; do not require the authoritative-state journey first.
- **Counter, membership or leaderboard:** A05 → A06 → A07 → A10. In Redis, A11 → A13, then A14/A15 for the selected loss contract. A16 is needed only if the design is clustered.
- **An outage or stale answers:** enter A02, A03 or A09 by symptom. A09 routes to the relevant mechanism before it suggests an action; A08 owns the recovery decision.
- **Selecting or operating Redis:** enter A10 or A11 directly. A11 gives local context for key ownership, atomic scope and memory role. The implementation branch can then be read sequentially, with A16 a clear cluster-specific branch rather than compulsory background for a single instance.
- **A restore or failover:** enter A08 for what state must return, A14 for actual persistence/restore work, A15 for promotion, or A16 for cluster maintenance. Each shows its own acknowledgement and loss boundary.

A newcomer can follow the general pages in order. An implementation chooser can enter the comparison without memorising algorithms: its opening supplies a short meaning of disposable versus accepted state, and the worked scenarios link to the full teaching home.

## CA-G01 — Cache role, validity and capacity

### CA-A01 — Caches and in-memory stores

**Outcome:** distinguish the jobs and decide whether another copy earns its cost.

**Owned sections:** “Which copy owns the fact?” — CA-U01; “Which work disappears on a hit?” — CA-U02; “Where the copy lives” — CA-U03.

**Entry needs:** follow a request and recognise a timeout; no cache terminology. Define a hit, miss, source and key in the first worked request.

**Teaching form:** three versions of the ticketing request, with an explicit source-write path and a small worked calculation of saved work. Show hit and miss latency separately before introducing an average. A topology control changes local/shared/layered placement and shows duplicate memory and cold starts.

**Necessary change:** a fleet rollout empties every process-local cache. The warm steady-state calculation must be reconsidered.

**Afterwards:** the reader can choose no cache, a local cache or a shared cache, state the freshness allowance and explain what loss would mean.

**Why this is a page:** readers need a recognisable entrance for the family and its two roles. Keep placement and benefit here because they determine whether the extra copy is justified. Do not turn the introduction into a compressed tour of every data structure, eviction policy or product.

### CA-A02 — Cache keys, freshness and invalidation

**Outcome:** specify a valid cached answer and defend the source/cache update path under concurrent fills.

**Owned sections:** “The identity of a result” — CA-U04; “How old is this answer?” — CA-U05; “A fill overtakes an invalidation” — CA-U06; “Where the write is accepted” — CA-U07; “Repair after missed changes” — CA-U08.

**Entry needs:** a key, a miss and a source write. Give direct entrants a two-sentence account of a disposable copy, then use the same event description and version throughout.

**Teaching form:** a key-design worksheet followed by a step-controlled trace with source value, cached value, version and operations in flight visible together. Let the reader pause the source read, update the source, invalidate, then release the old fill. Compare three concrete repair choices: accepting bounded staleness, checking a version, or using versioned result identities with a current-version lookup. Show what each choice still depends on. A short failure table compares update/invalidate/write-through/write-behind at their acknowledgement boundary.

**Necessary change:** a negative entry hides a newly created item; then a delayed old fill repopulates after deletion. A lost or reordered invalidation must have a recovery path rather than a claim that publishing an event solved coherence.

**Afterwards:** the reader can write a key/freshness contract and choose a consistency design whose remaining race and repair mechanism are explicit.

**Split/keep decision:** identity, age and update ordering stay together because each is a condition for returning the same valid answer. They are sections, not three entrances that repeatedly rebuild the two-store model. Product tracking commands belong in A12; they govern Redis-to-client copies and do not establish consistency with an external source. Change-stream/broker operation remains outside the page.

**Permission-change case:** keep the event bytes and correctly tenant-qualified
key unchanged, revoke one reader's access, then inspect the next hit. Compare a
current authorisation gate, an explicit policy/version dependency and any permitted
stale-authority interval. A missed permission-change signal has a stated failure
and repair outcome. Application access here is distinct from Redis engine ACLs.

### CA-A03 — Misses without source overload

**Outcome:** preserve a usable service when many requests need uncached work.

**Owned sections:** “A miss is source work” — CA-U09; “One refresh, bounded waiting” — CA-U10; “Fallback has a budget” — CA-U11; “Returning from cold” — CA-U12.

**Entry needs:** the distinction between a cached copy and its source. Restate the allowable stale answer locally; no dependency on A02's full race analysis.

**Teaching form:** an inspectable queue model and a workload sheet. Change miss fraction, source duration and concurrency separately. A trace compares uncoalesced work, a shared fill and a dead refresher; it includes losers' wait limits and the old winner completing after lease expiry. Model source protection explicitly rather than credit the cache with capacity it cannot provide.

**Necessary change:** shared cache failure turns a tolerable steady miss rate into a source overload; automatic retries make it worse. Return with a bounded warm-up rather than send a full-dataset scan through the source.

**Afterwards:** choose coalescing, refresh-ahead, jitter, stale serving and fallback limits for a stated contract; set an observable gate for cold traffic.

**Split/keep decision:** this earns a page because correctness of a returned value does not answer whether the source can produce it under load. Warming stays with misses: the same source budget determines both. Queueing theory and general service resilience get only the local reasoning this case requires.

### CA-A04 — Admission, eviction and memory budgets

**Outcome:** retain the entries that save useful work within a realistic byte budget.

**Owned sections:** “Account for memory” — CA-U13; “Which resident leaves?” — CA-U14; “Which miss earns a place?” — CA-U15; “Expiry, pressure and refused writes” — CA-U16.

**Entry needs:** hits, misses and the source work a result saves. The page defines working set, admission and eviction where the trace first needs them.

**Teaching form:** a trace replay model with payload size and saved work visible. Use a reused hot set, a one-time scan and a shifted hot set. Compare recency, frequency and an admission filter without claiming the model implements a production engine. A byte sheet adds keys, values, metadata, allocator loss and operating headroom.

**Necessary change:** a large one-use result displaces the hot working set; then the hot set changes. A non-evicting authoritative workload reaches capacity and refuses a write.

**Afterwards:** choose an initial policy and admission rule, size a usable memory budget and identify which traces would disprove the choice.

**Split/keep decision:** admission belongs beside eviction because rejecting an unhelpful arrival can be more valuable than choosing its victim. Expiry stays here only as validity versus retention and reclamation; A02 owns the stale-answer contract. Redis thresholds and sampled policy implementation belong in A11. Do not teach a catalogue of replacement algorithms.

## CA-G02 — In-memory state and service reliability

### CA-A05 — Model state around its operations

**Outcome:** choose a bounded representation for membership, counters and ranking, with a complete state lifecycle.

**Owned sections:** “Operations choose the structure” — CA-U17; “Growing values and maintained views” — CA-U18; “Ownership, expiry and deletion” — CA-U19.

**Entry needs:** basic key/value lookup. Explain that this may hold accepted state whose loss has a product consequence; do not assume every entry can be refilled.

**Teaching form:** worked viewers, limit and leaderboard records with exact IDs and operation/result examples. A growing member list reveals traversal cost. Add one secondary view and then delete its parent to expose maintenance and deletion responsibilities. Contrast an exact requirement with an approximate one briefly; approximate-structure internals are not required for these tasks.

**Necessary change:** a formerly small event accumulates enough viewers to make whole-value retrieval expensive, while tenant deletion must remove every derived view.

**Afterwards:** choose a structure and bounded operations, define expiry/deletion ownership, or justify a query-oriented store instead.

**Split/keep decision:** this page owns representation, not an inventory of commands. Atomic execution requires a new model of concurrent callers and earns A06. Keep key lifecycle here because expiry and deletion are part of the state design, not an operational afterthought.

### CA-A06 — Atomic changes and uncertain replies

**Outcome:** preserve a stated invariant under concurrent requests, command errors and retries.

**Owned sections:** “The invariant and its boundary” — CA-U20; “Grouped work and failed operations” — CA-U21; “The request ran; the reply was lost” — CA-U22; “What a lease permits” — CA-U23.

**Entry needs:** a record and an update. Introduce atomic execution, isolation and durability as separate promises through the first interleaving, with a link to A07 for survival.

**Teaching form:** paired client traces of a native increment, a check-then-change, a conditional update and a grouped operation. Insert a command error after an earlier change. Then lose the response and show why an operation ID must cover both deduplication and the state change at the required boundary. The lease example stays deliberately narrow: refreshing a cached event card.

**Necessary change:** a duplicate retry increments the limit twice; a paused refresh owner resumes after its lease expires. An operation-ID record expires before a delayed retry arrives.

**Afterwards:** choose a native operation, optimistic check or server-side program, specify retry retention and know when the invariant lies outside this store's boundary.

**Split/keep decision:** atomic execution and uncertain outcomes stay together because callers must decide whether to retry an operation they cannot observe. A separate generic locking article would pull the collection into shared systems teaching. External fencing and distributed lock algorithms are boundary CA-U54, not a hidden extension of this page. Redis transaction/error behaviour belongs in A13.

**Retry evidence:** the operation-ID record needs a survival contract as well
as a retention interval. If the effect survives eviction, restart or promotion
while its deduplication evidence does not, the previous retry proof is invalid.
CA-A13 executes this case using the selected native settings.

### CA-A07 — What an accepted update survives

**Outcome:** decide whether a store's persistence, replication and placement satisfy the loss requirement for a fact.

**Owned sections:** “Execution, disk and another node” — CA-U24; “Reads and promotion while copies lag” — CA-U25; “Placement changes the boundary” — CA-U26.

**Entry needs:** distinguish accepted state from a copy. Rebuild the acknowledgement point on a local timeline so a failover entrant does not need A06.

**Teaching form:** a labelled write timeline and failure matrix. Start with one node; add a log/snapshot and a replica only when each answers a specific failure. One placement diagram shows why a key can remain hot after adding shards and why an invariant spanning partitions needs an explicit boundary. Do not compress an engine's logging, election or resharding algorithms into this general article.

**Necessary change:** a primary acknowledges before the promoted replica has the update. A previously local multi-key operation becomes cross-partition after a design change.

**Afterwards:** state which acknowledged operations can be lost, choose a read target and reject an unsuitable authoritative use even when automatic failover is available.

**Split/keep decision:** these concepts share one question: which fact survives which failure at which boundary? Engine mechanics have separate pages below. Recovery of the required business state earns A08 because an old consistent dataset can still be the wrong recovered service.

### CA-A08 — Rebuild a cache or restore accepted state

**Outcome:** choose and rehearse recovery that returns the required state and can safely serve traffic.

**Owned sections:** “Restore and reconcile” — CA-U27; “Rebuild and reintroduce traffic” — CA-U28.

**Entry needs:** know whether the selected keys are reproducible. Define recovery point and recovery time locally through the timeline rather than requiring an operations vocabulary.

**Teaching form:** two recoveries from the same service outage. For copied descriptions, discard/rebuild with admission and traffic limits. For accepted changes, restore a known point, inspect invariants and reconcile later valid operations from an explicitly named evidence source. Show how a replica can faithfully contain the same accidental deletion. The exercise requires readers to identify missing evidence rather than assume a log exists elsewhere.

**Necessary change:** a backup precedes both a bad deletion and a valid later update. Restored cached results also have a representation version and source age to validate.

**Afterwards:** write a recovery procedure with validation, a source budget and a stated reconciliation limit; decide whether preserving the cache is worthwhile.

**Split/keep decision:** rebuilding and restoring belong together because the first recovery decision is which kind of state was lost. Detailed Redis artifact commands stay in A14. Restore and reconciliation deserve a page beyond A07's survival matrix; they involve a sequence of service decisions with their own failure case.

### CA-A09 — Diagnose and change a running cache or store

**Outcome:** choose the next useful measurement and make a controlled operational change.

**Owned sections:** “Find where the time and work went” — CA-U29; “Change with compatible clients and keys” — CA-U30; “Pay for useful capacity” — CA-U31.

**Entry needs:** the local opening identifies source, cache/client and engine measurements. A diagnostic entrant need not know the collection's algorithm terms.

**Teaching form:** three compact incident investigations: stable hit rate with rising tail latency, rising source work after a rollout, and refused writes under memory pressure. Evidence separates client queue, bytes, execution and source concurrency. A two-version deployment worksheet tracks schema/namespace compatibility and least privilege. Finish with one capacity calculation; no provider-price catalogue.

**Necessary change:** changing a key format improves one client but breaks rollback, or adding a replica leaves the primary hot key unchanged.

**Afterwards:** choose a measurement, a compatibility window and a capacity action whose success can be checked; identify when removing the cache is a valid improvement.

**Split/keep decision:** this is an incident/change entrance, not the full teaching home for every subsystem it diagnoses. Keep cost with capacity because extra copies, persistence and operating requirements determine the actual resource decision. A11–A17 own Redis evidence and command procedures.

## CA-G03 — Choose an implementation

### CA-A10 — Choose a cache or an in-memory store

**Outcome:** compare credible implementations for a particular workload, loss contract and operating arrangement.

**Owned section:** “Run the same workload through the choices” — CA-U32. Use three substantial cases: process-local repeated results; shared disposable catalogue results; and counters/membership requiring explicit accepted-state behaviour.

**Entry needs:** a short local definition of disposable copy, freshness allowance and accepted state. Ask for workload shape, object-size distribution, operation needs, source capacity and required failure survival before naming a favourite product.

**Teaching form:** a conditional comparison worksheet. Include Caffeine as the process-local example, Memcached as the deliberately ephemeral shared-cache example, and Redis Open Source and Valkey as data-structure-store candidates. Compare the same request path, memory/placement, primitives, persistence/topology obligations, client maturity and operating control. Managed deployments are an operating choice whose actual service contract must be checked separately from the engine name. An existing database or no added cache remains a credible baseline.

**Necessary change:** the workload changes from rebuildable description cards to unique accepted mutations. Shared protocol ancestry does not prove an equivalent execution, memory or recovery mechanism; require specific versions and settings for consequential comparisons.

**Afterwards:** make a conditional shortlist and identify the evidence still needed before deployment.

**Split/keep decision:** selection is a distinct reader entrance and should not be buried at the end of Redis teaching. One comparison suffices initially because these workloads expose the consequential differences. It does not commission parallel deep dives or a vendor directory.

**Scope decision requiring coordination:** Redis Open Source is proposed as the initial representative branch because it exposes all the selected tasks in one inspectable implementation, with primary material on persistence, client tracking, replication, transactions and cluster behaviour. Valkey is a serious alternative branch choice, not a footnote or a promised drop-in substitute. Choosing Valkey instead changes implementation evidence and worksheets, while most general pages remain. A managed service or a memory-first engine with a different durability architecture would change the practical scope more substantially. Pin the actual Redis release and client before authoring; live documentation is not a release pin.

## CA-G04 — Redis Open Source in practice

Every practical worksheet below requires real Redis processes and a recorded server/client release, configuration, input, output and inspected final state. Browser models may precede them but cannot certify server failure, disk or network behaviour. No worksheet has been executed for this proposal. Multi-node and crash work belongs in an isolated external environment with disposable fixtures and cleanup; it does not require a production account.

### CA-A11 — Redis execution and memory

**Outcome:** explain why the selected Redis command path consumes time and memory, and defend a dataset budget.

**Owned sections:** “From request to reply” — CA-U33; “The representation behind the command” — CA-U34; “Expiry and memory pressure” — CA-U35.

**Entry needs:** simple Redis GET/SET notation, introduced locally, plus whether the example keys are copies or accepted state. Reminder of general admission/replacement is sufficient; A04 remains its full home.

**Teaching form:** actual command and memory inspection for the example structures, before and after documented representation thresholds. A deliberately large operation and large response distinguish execution from delivery. A small memory limit makes policy, errors and expiry inspectable. Use source investigation where public documentation cannot explain an encoding; record the selected source tag rather than generalise from an unstable branch.

**Necessary change:** growing a value changes representation or operation cost; persistence/replication activity changes the headroom needed beyond the dataset budget.

**Afterwards:** choose bounded commands, representations, memory limits and separation of evictable from authoritative workloads.

**Split/keep decision:** execution and memory share the object a command works on. General algorithm theory stays in A04. Persistence, replication and client tracking are independent investigations; naming their buffers here does not teach them in full.

**Reusable starting worksheet owned here:** pin server/client and start an
isolated single-instance process with a disposable data directory, explicit memory,
persistence and access settings, sample keys, inspection, reset and cleanup.
CA-A12 adds its source/client fixture; CA-A15/CA-A16 separately extend the topology.
Do not inherit a managed-service or clustered contract from an unnamed setup.

### CA-A12 — Redis clients, cache fills and local copies

**Outcome:** integrate a real client without disguising partial execution or missed invalidation.

**Owned sections:** “Connections, pipelines and timeouts” — CA-U36; “Tracking a local copy” — CA-U37; “A source-backed fill across a rollout” — CA-U38.

**Entry needs:** an external source and Redis are separate stores; the opening redraws that boundary. Link to A02 for full coherence reasoning and A06 for general ambiguous outcomes, with brief local reminders.

**Teaching form:** one chosen client, actual source fixture and two application clients. Record a bounded pipeline and a lost connection with inspected final state. Enable tracking using the selected protocol/client path, modify a key and then interrupt its invalidation connection. Finish with one complete source/fill design and two representation versions.

**Necessary change:** some pipelined mutations have run when the connection disappears. Later, source data changes while an old fill is in flight and another client reconnects with cached state.

**Afterwards:** set client concurrency, batching, timeout/retry policy and local-copy discard behaviour; implement the chosen source coherence design with verified limits.

**Split/keep decision:** this page follows the application's boundary with Redis. It earns a page because correctness depends on client behaviour as well as engine commands. Keep the source fixture here rather than create a thin standalone quickstart. Server-side atomic programs belong in A13; the integration links to one when required.

### CA-A13 — Redis structures and atomic updates

**Outcome:** implement the selected state operations with a precise atomicity and retry contract.

**Owned sections:** “Bounded native operations” — CA-U39; “Transactions, conflicts and server-side programs” — CA-U40; “Operation IDs and replay” — CA-U41.

**Entry needs:** local introduction to the viewers, counter and leaderboard state. A05 and A06 are the general homes; direct entrants receive the invariant and the acknowledgement boundary in a short opening example.

**Teaching form:** actual two-client execution of native operations, WATCH conflicts, MULTI/EXEC command errors and one bounded function or Lua implementation. Inspect every partial/error result. Add an operation-ID record to the selected non-idempotent update and measure its bounded growth. State the standalone/same-slot boundary; cluster routing is A16.

**Necessary change:** a command error occurs after another transaction command changed state; a reply is lost; an operation ID expires before replay. A script that reads an unbounded collection must be replaced with bounded work.

**Afterwards:** choose the smallest valid primitive, implement retries and state exactly which invariant remains outside the operation.

**Split/keep decision:** command structures and atomic programs stay together because a programme's cost and safe boundary depend on the representation. Persistence does not enter as a second topic; A14/A15 determine what an accepted result survives. Streams and broker semantics remain out of scope even though Redis implements them.

**Native acceptance cases:** implement one bounded counter/rate-limit update
with atomic expiry and a visible window-boundary result; compare the result after
an ambiguous retry. Then create a supported failure/pressure state in which the
effect exists but its operation-ID evidence is absent. State retention, eviction,
persistence/replication fate and behaviour when evidence capacity is exhausted.
Co-locating keys or choosing a long TTL alone establishes no stronger survival.

### CA-A14 — Redis persistence and restore

**Outcome:** choose and verify Redis recovery artifacts under a stated loss, latency and memory budget.

**Owned sections:** “Snapshot and append-only histories” — CA-U42; “Restore, validate and reconcile” — CA-U43; “Loading and persistence failures” — CA-U44.

**Entry needs:** a local timeline of an accepted write, volatile state and durable media. A07/A08 own the general loss and reconciliation decisions; restate the chosen objective beside the exercise.

**Teaching form:** inspect real RDB/AOF artifacts and selected fsync/rewrite settings. Trigger controlled background persistence with a changing disposable dataset and inspect resource evidence; report observations, not a benchmark. Restore into another isolated instance and verify application state. Use copied artifacts for malformed/truncated-input exercises so recovery investigation preserves its original evidence.

**Necessary change:** writes continue during snapshot/rewrite, changing memory and latency; then a recovery point precedes an accidental deletion and a later valid update. A persistence error or load failure tests the stop/recover decision.

**Afterwards:** select persistence settings, headroom, a backup/restore procedure and the evidence needed for reconciliation.

**Split/keep decision:** save formats and restore belong together because a setting is useful only if its artifact can reconstruct the state. This is already a full investigation; replica catch-up and failover earn A15 rather than become another section.

### CA-A15 — Redis replicas and Sentinel failover

**Outcome:** explain catch-up and promotion, configure a suitable deployment/client path and state its accepted-write loss boundary.

**Owned sections:** “Histories, backlog and catch-up” — CA-U45; “Sentinel, promotion and discovery” — CA-U46; “Acknowledgements and their limits” — CA-U47.

**Entry needs:** one Redis process and a write/reply. Explain primary, replica and promotion in the first local trace; A14 supplies disk details when required.

**Teaching form:** multi-process replication, disconnect/reconnect and controlled failover with recorded offsets, roles and client observations. Force a disconnect beyond the configured backlog to expose full catch-up. Run WAIT/WAITAOF under the selected version and settings, separating received/processed data and persisted data. The exercise needs a failure hypothesis and inspected state rather than a successful command alone.

**Necessary change:** the promoted node lacks a recent acknowledged write, or an old primary returns with a different history. Demonstrate the danger of returning an empty restarted primary to a topology when persistence is disabled; define the safe recovery gate before running it on disposable state.

**Afterwards:** budget catch-up, choose read targets, client discovery and acknowledgement policy, and reject a stronger guarantee than the evidence supports.

**Split/keep decision:** catch-up and promotion form one story of another node becoming useful. The article does not teach a general consensus course. Cluster topology, routing and resharding require different machinery and earn A16.

### CA-A16 — Redis Cluster routing and resharding

**Outcome:** design keys and client behaviour for Redis Cluster and perform a bounded topology change.

**Owned sections:** “Slots, tags and redirects” — CA-U48; “Operations across the slot boundary” — CA-U49; “Reshard, replace and recover” — CA-U50.

**Entry needs:** a local diagram of primaries, replicas and key ownership. Readers can skip A15's Sentinel-specific procedure: Cluster has its own failure path and this article explains the required local mechanism.

**Teaching form:** a real disposable cluster with observed slot ownership and redirected requests, a working and failing multi-key operation, and a bounded migration while requests continue. One hot-key workload tests the limit of adding nodes. Inspect state and routing after an interrupted migration and after replacing a node.

**Necessary change:** keys needed by an atomic operation land in different slots; an in-flight request encounters migration; the hot key remains on one owner after capacity grows.

**Afterwards:** choose a cluster-aware client, hash tags, grouping and migration gates, or keep a simpler topology when clustering does not solve the problem.

**Split/keep decision:** routing, atomic placement and migration must remain together for one honest clustered application. They would bury A15's replica-loss argument. Multi-region active-active products and their conflict semantics are separate assessment work, not an implied feature of this branch.

### CA-A17 — Operate and change Redis with evidence

**Outcome:** diagnose the selected deployment and change it without losing its access or recovery contract.

**Owned sections:** “Join client and engine evidence” — CA-U51; “Access, transport and administration” — CA-U52; “Changes, compatibility and recovery gates” — CA-U53.

**Entry needs:** an explicit chosen topology and key role. A short request/memory diagram orients incident entrants. The relevant earlier Redis page owns each mechanism; this worksheet integrates its evidence into a practical decision.

**Teaching form:** INFO, latency/slow-command facilities, memory evidence and application traces from a controlled incident. Compare server execution and client-observed delay. Verify a restricted application identity against data and administrative operations. Rehearse one pinned-version upgrade/configuration change with two client versions and validated backups; identify whether the rollback target can read persisted state.

**Necessary change:** client latency rises with little server execution time; a data client attempts a forbidden operation; an upgrade makes an assumed rollback unsafe.

**Afterwards:** choose the next diagnostic action, deploy a limited identity and make a change with explicit validation and recovery conditions.

**Split/keep decision:** operations earns an integrated incident/change entrance after the mechanisms exist. It must not become the place where every earlier article leaves its unfinished practical work. Restore commands remain A14, failover A15 and resharding A16. A17 uses and verifies those procedures rather than repeating them.

**Direct entrances and bounded maintenance:** the default path is evidence-led
diagnosis. Baseline server/client/access setup is an independently linked worksheet
at CA-A11; A17 owns native least-privilege/denied-action checks where a running
service changes. Its named maintenance procedure includes supported versions,
client discovery, interruption, application acceptance and rollback/restore gates.
Do not substitute a release checklist for that outcome or let it bury incident
diagnosis. CA-A14 and CA-A15 supply recovery and replica mechanisms, not repeated
introductions. The two direct section entrances remain separately reachable.

## Coverage audit and boundaries

Each of the 53 teaching units has one full home. Article sections above are the teaching contracts; a mention or onward link elsewhere does not transfer ownership.

| Units | Full home |
| --- | --- |
| CA-U01–CA-U03 | CA-A01 |
| CA-U04–CA-U08 | CA-A02 |
| CA-U09–CA-U12 | CA-A03 |
| CA-U13–CA-U16 | CA-A04 |
| CA-U17–CA-U19 | CA-A05 |
| CA-U20–CA-U23 | CA-A06 |
| CA-U24–CA-U26 | CA-A07 |
| CA-U27–CA-U28 | CA-A08 |
| CA-U29–CA-U31 | CA-A09 |
| CA-U32 | CA-A10 |
| CA-U33–CA-U35 | CA-A11 |
| CA-U36–CA-U38 | CA-A12 |
| CA-U39–CA-U41 | CA-A13 |
| CA-U42–CA-U44 | CA-A14 |
| CA-U45–CA-U47 | CA-A15 |
| CA-U48–CA-U50 | CA-A16 |
| CA-U51–CA-U53 | CA-A17 |

| Boundary unit | Explicit status and local handling |
| --- | --- |
| CA-U54 | Shared coordination teaching stays parked. A06 owns the short expired-lease counterexample; neither that nor Redis failover activates general lock/fencing/consensus teaching. |
| CA-U55 | HTTP/CDN caching is outside this collection. A01/A02 give a sentence naming the second validity contract when layers meet; coordinate its eventual full home separately. |
| CA-U56 | Buffer pools and hardware/OS caches link to their appropriate homes. A01 explains why an already warm source might remove the expected payoff. No buffer-management chapter here. |
| CA-U57 | Messaging, search/vector and specialised time-series semantics stay with those fields. A02/A12 explain the particular invalidation gap locally. No Redis broker or search feature survey. |
| CA-U58 | Relational constraints/payments keep their own home; memory-first engines with different architectures are comparison boundaries. A05/A07 explicitly reject assuming that the ticket sale inherits the guarantees of an in-memory counter. |

Shared homes follow the coordinated field allocation; the proposal remains for user discussion. Another collection may teach key/value layout, expiry or replication generically; direct entrants here still need the small local model that makes the cache/source and accepted-write decisions intelligible. Coordination should remove duplicate full lessons, not remove these local premises.

## Primary evidence and limits of this proposal

Checked 18 October 2026. These are planning sources: they challenged scope and exposed necessary cases. They are not evidence that any proposed experiment ran. Future articles must pin an implementation release, client, deployment and settings and verify their consequential claims.

| Primary source | Consequence for this plan | Article verification still required |
| --- | --- | --- |
| [Redis client-side caching](https://redis.io/docs/latest/develop/reference/client-side-caching/) | Tracking deserves actual client/reconnect work in A12. It concerns copies held by Redis clients, not automatic coherence with a separate source. | Client/protocol support, disconnect handling, races and tracking-table behaviour in the chosen release. |
| [Memcached meta protocol](https://docs.memcached.org/protocols/meta/) | Refresh ownership and stale handling are credible mechanisms beyond Redis; A03 must teach the general task. | Exact protocol/client support, winner failure, CAS behaviour and expired ownership before making comparative claims. |
| [Memcached FAQ](https://docs.memcached.org/userguide/faq/) and [performance guide](https://docs.memcached.org/serverguide/performance/) | A disposable cache has meaningful memory/client behaviour without becoming an authoritative database branch. | Current allocator/slab behaviour and limits; some explanatory guide material may describe older versions. Warm restart or extstore must not be interpreted as a general durability guarantee. |
| [Caffeine efficiency](https://github.com/ben-manes/caffeine/wiki/Efficiency) and [TinyLFU paper](https://arxiv.org/abs/1512.00727) | Admission, replacement and process-local placement need distinct concepts in A04/A10. | Current library policy/version and the actual workload before any efficiency recommendation. Historical traces are not our benchmark. |
| [Redis eviction](https://redis.io/docs/latest/develop/reference/eviction/) | Dataset limit, replacement policy and process headroom are separate; Redis-specific behaviour belongs in A11. | Available policies, accounting, overshoot and memory observations on the pinned release; avoid projecting a newly documented policy backwards. |
| [Redis transactions](https://redis.io/docs/latest/develop/interact/transactions/) and [scripting](https://redis.io/docs/latest/develop/programmability/eval-intro/) | A13 must include command error, optimistic conflict and bounded server execution, not merely successful examples. | Exact errors, state after EXEC, function/Lua execution and chosen client behaviour. |
| [Redis persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/) | Artifact creation, resource cost and actual restore belong in one dedicated investigation, A14. | File layout, loading precedence, fsync/rewrite choices, failure handling and restore/reconciliation under the selected release. |
| [Redis replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/) and [Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/) | Synchronisation and promotion need their own A15. The documentation's empty-restart scenario is a required recovery case. | Concrete histories, offsets, backlog, client discovery, loss and deployment-specific failure settings. |
| [WAIT](https://redis.io/docs/latest/commands/wait/) and [WAITAOF](https://redis.io/docs/latest/commands/waitaof/) | Replica acknowledgement and persistence acknowledgement must remain distinct; neither should be presented through a loose “synchronous” label. | Return values, timeouts, connection scope, transaction restrictions and failure limits for the selected settings/version. |
| [Redis Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/) | Routing/migration and same-slot operations earn A16 rather than a generic scaling subsection. | Redirects, migration procedure, client retries and failover behaviour on the selected release; live docs can include later changes. |
| [Redis latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/) and [ACLs](https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/) | A17 needs actual engine/client evidence and least-privilege verification. | Supported diagnostic facilities, permission categories, transport configuration and their runtime costs. |
| [Valkey introduction](https://valkey.io/topics/introduction/), [FAQ](https://valkey.io/topics/faq/) and [memory changes](https://valkey.io/blog/valkey-memory-efficiency-8-0/) | Valkey is a credible implementation alternative whose memory/execution details warrant their own evidence. Shared commands do not settle architectural equivalence. | Current release, compatible operations, runtime/topology differences and measurements for the comparison's cases. |
| [Redis licence terms](https://redis.io/legal/licenses/) | Redis-versus-Valkey choice has a current deployment/licensing dimension; a historical blanket statement about “Redis licensing” is insufficient. | Exact selected version and terms when commissioning the comparison. Do not give legal advice or treat a marketing summary as a service contract. |

## Counts, deliberate limits and unresolved choices

The derivation yields **17 proposed articles in four identifiable groups**, covering **53 teaching units**, plus **five explicit boundary units**. Nine articles teach general mechanisms and practical decisions, one compares implementation choices and seven form the initial Redis Open Source branch. These counts are a result of the tasks, not a target or a parallel to another collection.

The hard limits are deliberate. A cache is never silently promoted into the ticket sale's authority. Refresh ownership stays a cache-local tool. Atomic execution is always separated from accepted-write survival. Redis's local copies, external-source copies, disk files and replicas have distinct update paths. No page promises Redis search, streams, active-active products or every protocol-compatible service merely because it shares a product name.

Three uncertainties need independent challenge:

1. **Representative branch:** Redis Open Source is a coherent default for this plan, but Valkey may be the better long-term teaching implementation for the intended deployment audience. Decide explicitly before commissioning product work; do not create two thin branches to avoid choosing.
2. **General-page cost:** A02's validity investigation and A06's concurrency/retry investigation are substantial. Their units share a running state and question, which currently makes sections cheaper than extra pages. Reviewers should challenge them using an actual reader trace. A17 must remain an integration worksheet rather than inherit missing subsystem teaching.
3. **Authoritative scope:** this branch teaches how to evaluate and operate selected accepted state under explicit loss limits. It does not establish Redis as suitable for every durable memory-first use. If the intended audience needs strict preservation of acknowledged state across failures beyond the selected engine's contract, add an explicit alternative-engine investigation or route that use elsewhere. Do not repair the gap by changing the meaning of “authoritative”.

Independent reviewers should test the unit chains and entrances before article work. They should attempt a stale-fill failure, a cold-cache source overload, a lost-reply retry and a failover/restore decision using only the relevant proposed article contracts. Missing decisions should change the plan; a shorter list alone is not evidence of lower reader cost.
