# Teaching review · article mode · r23, r24, r26, r27, r28, r29, r30 · batch07-v01

Inputs read: [fixed manifest](v01/manifest.json) and teaching restrictions; frozen briefs and bounded individual plans RL102, RL103, RL105, RL106, RL107, RL108 and RL109 in full, including child stubs and relevant owner boundaries. Commission hash matches the earlier read. Canonical example changes from batch06 were read (explicit optional catalogue attributes); all unchanged shared facts retain their prior read. Complete rendered pieces at http://127.0.0.1:4476/review/relational-collection/{connections-and-capacity,slow-queries,partitioning-and-sharding,distributed-transactions,distributed-reads,regional-placement,rebalancing}/, with explanatory disclosures and final Sources.

Highest severity: none

## Calibration


This coherent 25-piece assignment calibrated once against all three fixed references in full. The helper `scripts/read-writing-reference.py` delivered exactly 19 separate bounded text outputs: sequences 1–6, indexes 1–7, storage 1–6. Every individual call had a 5,000-token output budget and its END marker was read; none was clipped. Complete-text SHA256: sequences `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`; indexes `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`; storage `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Separate rendered study at http://127.0.0.1:4350/review/examples/ covered all 34 drawings and their explanations: sequences figures 1–13, indexes 1–11, storage 1–10. Actual changing/completed states were inspected. A mispositioned tall screenshot crop was recovered with bounded crops; the long crowded sequence drawing's lower portion was read separately. No global viewport or theme changes. Root received the complete calibration report for public-output audit. The comparison standard is explanatory progression through concrete changing state, controlled variations and awkward cases, and practical judgement supported by the mechanism, with illustrative/observed boundaries explicit.

## r23 · Connections, overload and capacity

Entry: Application pools and transaction boundaries; deeper mechanisms are branch preparation.

Whole article: The queue-location comparison gives a concrete reason not to equate connection count with capacity. It progresses from visible counts to deadline, resource, load-test and failure-headroom decisions.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Open, borrowed and running counts are separated locally, including active-but-waiting; specialised memory/proxy details are explained through their budget effect. |
| 2. Order | pass | Counts before fleet budget; budget before refusal/deadline; bottleneck evidence before load envelope and recovery headroom. |
| 3. Examples | pass | R1–R8 carry pool sizes, queue refusal and the awkward single-row case; request budget and service headroom arithmetic are explicit illustrative variants. |
| 4. Showing | pass | Burst figure and full schedule, deadline strip, bottleneck table and Little’s-law/headroom worked arithmetic show the changing queue and limits. |
| 5. Judgement | pass | Reader can budget all pools, bound queues and retries, choose causal investigation and design a workload/failure-state capacity test. |
| 6. Gradual exposure | pass | Pool admission stands on the stated entry; deeper plan, lock, retained-history and distribution interventions go to their owners once the cause is known. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r24 · Diagnosing a database incident

Entry: Request/connection/transaction ownership, with branch-specific deeper preparation.

Whole article: The same symptom is separated into causal branches before interventions. The concrete idle-holder case permits a complete lock investigation without making every incident require every optimisation article.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Pool versus owned-session intervals and active versus idle-in-transaction states are locally explained; diagnostic columns and signal meanings receive explanations. |
| 2. Order | pass | Observation → correlated record → blocker ownership → cancellation result → alternative branches → bounded intervention/recovery. The counterintuitive cancel/transaction distinction gets a worked sequence. |
| 3. Examples | pass | Equal-duration requests establish different causes; one P7 lock holder/waiter carries the native counterexample and recovery. |
| 4. Showing | pass | Common-scale request timelines, holder/waiter SQL and observed cancellation-state sequence show what changes and what remains. |
| 5. Judgement | pass | Reader can choose the investigation branch, distinguish signal delivery from completion, recheck a target and bound recovery/retry surge. |
| 6. Gradual exposure | pass | Initial triage is complete locally; deeper plans, locks, resource budgets and native tools are offered only for the selected branch. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r26 · Sharding and distributed SQL

Entry: Indexes, transactions, capacity and replication.

Whole article: The tenant boundary supports a coherent decision from bottleneck to placement, local work, skew, fan-out and invariant scope. It distinguishes conceptual co-location from actual product configuration.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Sharding, native partitions, replication, tenant keys, routing, co-location and fan-out are explained before conclusions depend on them. |
| 2. Order | pass | What moves → identity boundary → key/work mapping → hash/range costs → global work → coordination → testable choice. |
| 3. Examples | pass | Two different P7 products and order 103 carry local receipt and unscoped lookup; hot shop, hot single row and global quota expose boundary failures. |
| 4. Showing | pass | Pressure table, tenant keys, routing figure/full alternative, range/hash layouts and global top-ten arithmetic show local versus combined work. |
| 5. Judgement | pass | Reader can map queries/indexes/invariants to owners, identify skew/fan-out and test whether independent work pays distribution’s cost. |
| 6. Gradual exposure | pass | General design answer precedes PostgreSQL and CockroachDB implementation hand-offs; atomic commit and common snapshots keep separate owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r27 · Transactions across partitions

Entry: Transactions, crash records, sharding and write authority.

Whole article: Two local commits establish the atomicity gap before prepare and durable decision solve it. Coordinator-loss variants and the explicit participant/native limits sustain the argument through failure.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Participant, consensus scope, prepare, coordinator and unresolved state are explained through one purchase; identifiers are separated by their authority. |
| 2. Order | pass | Failure of local commits → two agreement scopes → durable promises → indistinguishable loss cases → fenced recovery → native building blocks and product hand-off. |
| 3. Examples | pass | Purchase 103 spans stock A and order/lines B; invalid quantity, missing coordinator and partial decision delivery supply awkward cases. |
| 4. Showing | pass | Replica/participant drawing, three complete protocol histories, prepare SQL and before/after native state show the all-or-nothing decision rather than simultaneous bit flips. |
| 5. Judgement | pass | Reader can distinguish local replication from transaction outcome, refuse timeout guesses and identify what a transaction manager must retain/recover. |
| 6. Gradual exposure | pass | Classic teaching protocol is labelled and complete at its level; PostgreSQL primitives and CockroachDB Parallel Commits remain distinguishable implementations. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r28 · Time, snapshots and distributed reads

Entry: Isolation, replicated progress and distributed commit.

Whole article: The fractured report leads to a common boundary and then to the evidence a replica needs to answer it. Clock examples support rather than replace the protocol argument, and current decisions stay separate from historical observations.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Common snapshot, version boundary, provisional state, logical/hybrid clocks, uncertainty and safe frontier are locally explained from the entry. |
| 2. Order | pass | Mixed view → common boundary → lagging participant → clock limits → certified past → freshness and retention contracts. The safe-at-T versus latest-available distinction gets direct help. |
| 3. Examples | pass | Order 103 and P7 carry before/after and lagging B; send-100/receive-95/counter-101 is a small worked clock counterexample; purchase permission exposes stale-view limits. |
| 4. Showing | pass | Before/after/mixed drawing and four-case timestamp/frontier model show both safe and withheld snapshots; freshness table makes operation choices comparable. |
| 5. Judgement | pass | Reader can choose coherent historical, bounded-stale and dependent-read contracts, check application timestamp scope and distinguish ahead-of-T from retained-at-T. |
| 6. Gradual exposure | pass | General clock/snapshot answer precedes native follower-read modes, export lifetime and placement costs. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r29 · Regional placement and survival

Entry: Replicas, authority, sharding and distributed commit.

Whole article: Failure-domain arithmetic earns the remote-vote cost and global-invariant discussion. It repeatedly connects abstract majority possibility to the additional dependencies required for a working service.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Failure domains, voting majority, communicating group, home and write authority are explained locally; witness/non-voter roles are explicitly qualified. |
| 2. Order | pass | Stated failure promise → surviving votes → required remote vote → home/read routing → global rule → whole-service acceptance. |
| 3. Examples | pass | 2–2–1 voters cover region loss and isolated running peers; shops and P7 establish home; 99-to-100 voucher race exposes the global last entitlement. |
| 4. Showing | pass | Failure controls/full case alternative, remote-majority path and unsafe/protected quota table show both ordinary and awkward states. |
| 5. Judgement | pass | Reader can derive quorum survival, retain communication assumptions, trace required remote coordination and inspect actual service/placement evidence. |
| 6. Gradual exposure | pass | Fixed general voting/locality model is answered first; native locality settings and topology transitions keep their own deeper owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r30 · Rebalancing and cluster change

Entry: Sharding, replicated authority and regional failure budgets.

Whole article: Copy, readiness, authority and membership are separated before resource and failure budgets. The transition is taught as supported protocol work, with enough joint-majority arithmetic to explain why manual list edits fail.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Movement types, snapshot/tail, learner, joint rule, drain/decommission and compatibility finalisation are explained through their responsibilities. |
| 2. Order | pass | Objective → live copy → catch-up/readiness → safe voting set → throughput surplus → remaining failure budget → operational/software transitions. |
| 3. Examples | pass | A–B–C to B–C–D carries purchase 103 and old/new majority counterexample; 600 MiB backlog arithmetic carries shrinking, growing and zero-surplus cases. |
| 4. Showing | pass | Six-stage alternative, membership-set arithmetic and common-scale catch-up bars expose the state and rate differences. |
| 5. Judgement | pass | Reader can distinguish bytes copied from readiness, budget surplus and failure domains, choose supported removal evidence and stop unsafe overlapping work. |
| 6. Gradual exposure | pass | General movement and upgrade concepts stand alone; product removal, upgrade finalisation and PostgreSQL shard cutover procedures go to their owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## Limits

Fresh independent initial teaching perspective only, for the exact first-return versions named above. This is not corpus, final complete or any other perspective coverage. Source, mechanical/native receipts, writer notes, earlier reports/decisions and later versions were withheld. No builds, article edits, downloads or publication. Complete rendered text, all explanatory disclosures and final Sources outside the article were read. No claim of independent native execution or production verification. No global viewport/theme changes.
