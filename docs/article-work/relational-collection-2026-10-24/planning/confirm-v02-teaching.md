# Teaching confirmation · tree · relational collection · plan-v02

Inputs read: frozen [manifest](v02/manifest.json), [commission](v02/commission.md), [tree](v02/tree.yaml), [example](v02/example.md) and [routes](v02/routes.md); [accepted problems](accepted-v01.md) and [repair record](repair-v02.md). Applied `staycurrent-review` and only its teaching perspective. Highest severity: **none** within this confirmation's scope.

This is a fresh **informed repair confirmation**, not a blind first reading or the required independent complete teaching reading. I judged the supplied repairs and their dependencies directly; the repairer's success statements were not evidence that a teaching check passed.

## Scope and calibration

Read all eleven changed owning nodes in full, excluding the nested descendants from their owners' own explanations: RL87, RL90, RL91, RL94, RL96, RL102, RL103, RL104, RL120, RL128 and RL129. Read their surrounding parent/route context and all the direct prerequisite consumers named in the repair record: RL83–RL85, RL92–RL93, RL95, RL105–RL107, RL112–RL113, RL116, RL119, RL121, RL126 and RL131. Widened to RL79, RL97–RL98, RL100, RL108–RL111, RL123 and RL124 to inspect tenant integrity, source authority, branch preparation, range entry and native transaction preparation. Read the root introduction's planning carriers and the complete repaired route file. This is substantial dependency coverage, not a claim to have reread all 58 destinations or the preserved introduction's finished source.

Focused fixed-reference calibration used relevant passages and rendered drawings, under the confirmation exception in the review skill:

- **Sequence diagrams:** source opening and booking/outbox definitions, then the reader-facing progression through waiting, asynchronous calls, outbox, scope and ordering (source lines 1–280). Rendered outbox section at `/review/examples/sequences/#background-workers-and-the-transactional-outbox`: inspected its five lifelines, evolving request/worker state and final step 11. This calibrates separating a database acknowledgement from the later worker obligation, and showing a protocol before extending its failure cases.
- **Indexes:** source lines 1–145, especially entries before tree descent, clustered-table detail after B-tree explanation, and selectivity's changed choice. Rendered selectivity section and Figure 6 at steps 1 and 3: eight matching rows distributed over six pages, with the three access costs visible. This calibrates local meanings before a branch decision and a worked state change supporting judgement rather than a list of mechanisms.
- **Storage and durability:** source opening/pages/buffers, old versions, dirty-page contrast and WAL (lines 1–210), with lines 121–159 recovered separately after an aggregate output clipped a small section; also lines 310–384 for loss choices, boundaries and deeper handoffs. Rendered row-version section and Figure 3 at the opening and post-commit step 3: R still reads 20.00 while Q reads 22.00. This calibrates distinguishing waiting from visibility and answering a high-level question before handing native detail onward.

The browser's automatic initial accessibility dumps were longer than needed and clipped; the relevant outbox, selectivity and row-version sections were subsequently returned as bounded extracts. I do not count clipped remainder as read. These were my own three temporary reference tabs; all were closed. No inventory, user tabs, viewport or theme was changed. One attempt to pass `visible:false` for the second tab was rejected as unsupported in the subagent; opening without that option used the browser's default background behaviour.

## Checks

| Check | Result | Applied judgement |
| --- | --- | --- |
| 1. Starting point | pass, scoped | Checkout's worker branch explicitly takes RL91 before RL94; RL91 already receives snapshots and constraints. RL103/RL102 enter from owned application work and basic transactions, and explicitly obtain the deeper mechanism before the intervention that needs it. RL120 locally introduces its native identifiers. RL128 distinguishes the security entry from the extra health/removal preparation. |
| 2. Order | pass, scoped | RL90 establishes snapshots/invariants before RL91 compares complete guard protocols and exposes stale evidence. RL103 observes missing time before choosing a causal branch and judging intervention. Recovery closes source history before final enumeration and holds that closure through final acceptance/handover. |
| 3. Examples | pass, scoped | S501/B201–B202 carries the empty-booking/guard problem; S502 remains a separate instructor invariant. Purchase 103 and its request/event identities connect checkout to RL94 without conflation. Recovery B203/S503 is a separate history with one capacity decrement; the boundary request makes the awkward case explicit. Shop 10/20 supplies allowed and denied tenant cases. |
| 4. Showing | pass at plan level | RL91 specifies a pinned two-session stale-snapshot counterexample and verified repair. RL103 specifies correlated timing/scope evidence and a traced chain; RL102 a load curve; RL120 an owned blocker reproduction with native evidence. RL128 requires allowed, denied and spoofed operations. RL129 tests a request at the fence boundary and repeats identity/capacity acceptance. These are demonstrable state transitions; no particular animation is required by the plan. |
| 5. Judgement | pass, scoped | Each repaired decision has a condition that can change the answer: snapshot/protocol choice, evidence-selected incident branch, actual authority/bypass boundary, or closed recovery set. Checkout's stop states exactly which purchase obligation is fulfilled and directs external effects to the prepared continuation. |
| 6. Gradual exposure | pass, scoped | General owners give the contract before native experiments. RL90 introduces guard alternatives while RL91 owns their mechanism/counterexample; RL96 owns recovery closure while RL116/RL129 execute it. RL103 can answer a supported lock-only incident without first teaching indexing, plans or full capacity. RL128's security section does not require its separate node-removal chapter preparation. |
| 7. Placement of additions | pass for every named changed owner/brief | The explicit placement table below covers every added/restructured brief and changed entry/route, including supporting changes beyond T001. Each belongs at the decision it qualifies or at its existing native owner; none requires a new destination or reads as a detached afterthought in the plan. |

## Accepted problem results

| Problem | Result | Independent teaching reason and inspected later use |
| --- | --- | --- |
| T001 · worker route without required locking | **confirmed repaired** | The main sequence RL90 → RL85 → RL84's conditional write → RL93 now stops at an atomic database purchase with request identity. The text immediately names external effects as another obligation and gives RL91 → RL94. RL94's entry and prerequisite list agree. Its first two headings can use transaction/request identity; its claim, lease and expired-authority headings now follow explicit lock preparation. The stop no longer promises the later worker result to an unprepared reader. |
| P001 · guard snapshot conditions | **teaching confirmation passes** | RL90 states which writers/snapshots participate at comparison time. RL91's first heading supplies a complete authority/isolation protocol; its second contrasts waiting with visibility using the old Repeatable Read snapshot. The empty set is explicit, so the reader does not have to invent a lock target. E2 carries the same conditional outcome. RL94's claims and RL119's DDL locking do not promise that waiting refreshes a transaction snapshot; RL107's current-capacity decision continues to reject historical evidence as authority. Native technical confirmation remains the practitioner assignment. |
| P002 · open recovery change set | **teaching confirmation passes** | RL96 puts fencing and uncertain requests before final enumeration, then keeps the source closed through acceptance. RL129 turns that contract into B203's identity/capacity replay plus a request racing the fence. Thus the learner must account for the set boundary, not merely recognise one named booking. E6 agrees; RL116's existing fence-before-reconcile order remains compatible, and RL131's prerequisite includes the revised native recovery owner. |
| P003 · reporting grants mistaken for tenant boundary | **teaching confirmation passes** | RL104 first traces trusted identity through pooled connections, then tests authority and denials. RL128's permission section uses that preparation for runtime reads/writes, cross-shop denial, context spoofing and bypass limits, while reporting grants are a separate check. The conceptual-to-native handoff is intact; RL79 continues to own reference integrity, and RL121 independently teaches pooled identity and policy bypass. RL131 takes the complete operations/recovery preparation when its task needs it. |
| V001 · diagnosis after unnecessary mechanisms | **teaching confirmation passes** | RL103's entrance can begin with a request and an owned transaction: it introduces the timing distinctions needed to select a branch locally. It sends the reader to RL91/RL102/RL86–RL87/RL92 before the relevant deeper intervention. RL102's pool-admission explanation likewise does not secretly depend on plans; its query, hot-row and retention interventions retain explicit preparation. RL120 starts from general triage, introduces native correlation identifiers, and adds locks/plans/vacuum at their selected branches. RL87's handoff now agrees with that direction. This supports an honest direct incident entrance even though RL103 remains nested under the plan owner; parentage is expressly not a compulsory syllabus. |

## Placement of every added/restructured brief and entry

All rows are **pass** for check 7. The table states both ownership and point in the argument; it does not prescribe final wording or artwork.

| Changed material | Why it improves the explanation and belongs at this point |
| --- | --- |
| RL87 · RL103 neighbour handoff | Initial cause selection belongs to the existing incident owner. The plan owner now receives established execution work rather than silently defining the entrance to all incidents. |
| RL90 · RL91 neighbour and “Serializable work” | Participation/snapshot conditions qualify the comparison exactly where a reader might otherwise choose an incomplete guard. Full implementation stays with RL91, so the parent still answers at high level. |
| RL91 · first outcome and “What a lock protects” | Authority and snapshot validity are parts of protection, so they belong in the opening lock decision, before contention tuning. The existing session guard gives the empty-booking case somewhere concrete to wait. |
| RL91 · “Waiting and rechecking” | The stale-snapshot counterexample follows the proposed protection and compares the evidence available after waiting. It earns its space at the hardest conceptual distinction and precedes the independent deadlock problem. |
| RL94 · entry | Lock preparation belongs at the worker article's entrance; claims/leases remain taught inside RL94. This matches the explicit route continuation rather than attaching a prerequisite after its use. |
| RL96 · second outcome and “Reconciliation after restore” | Closing source history belongs at the start of reconciliation, after isolated target verification and before enumerating/reapplying work. This adds an acceptance condition rather than diverting into a full failover mechanism lesson owned by RL98. |
| RL102 · entry/prerequisites/neighbours | Basic admission can start from application ownership; the deeper query/lock/version explanations remain named at their actual intervention boundaries. The revised entry therefore matches the page's easiest useful branch. |
| RL102 · “The limiting resource” | The local load curve first explains why more admitted work can worsen queues. Query/hot-row preparation then sits beside those cases, rather than burdening all pool-admission readers. |
| RL102 · “Headroom for failure” | Retention preparation belongs before changing history lifetimes. Recovery/rebuild headroom remains a capacity consequence rather than becoming an unintroduced cleanup recipe. |
| RL103 · article brief, entry/prerequisites/neighbours | The incident owner now promises and permits diagnosis from a request. Named deeper owners describe conditional preparation, consistent with its existing outcomes and final recovery/follow-up heading. |
| RL103 · “The request’s missing time” | Timing/scope evidence is the required first observation. The learner chooses what is happening before being asked to interpret a plan or capacity curve. |
| RL103 · “A chain of waits” | Local branch meanings sit between initial evidence and intervention; this supplies enough understanding to choose the next explanation without claiming to have taught each mechanism. |
| RL103 · “An intervention with a limit” | Preparation explicitly precedes judgement about cancellation, termination, admission or repair. The lock-only stop sits after supported diagnosis and before follow-up, so it is earned rather than a shortcut around understanding. |
| RL104 · RL128 neighbour and “Testing the denials” | Runtime authority is already this article's subject. Tenant selection/bypass checks follow the identity/pool explanation and become the native owner's acceptance task. |
| RL120 · entry/prerequisites/neighbours | The native incident owner can start from RL103 and a PostgreSQL connection, then introduce the identifiers it actually uses. Native plan/vacuum preparation remains required where used. |
| RL120 · “Where time is spent” | Local identifiers and observation limits are needed before interpreting native evidence; they belong at the first diagnostic step. |
| RL120 · “A blocked purchase” | Missing lock understanding is filled before interpreting blockers or intervening. The owned reproduction puts cancellation/termination and rollback in the context where the decision matters. |
| RL120 · “Spills and pressure” | Native plan/vacuum preparation sits at the execution/maintenance branch, before memory or horizon changes. It belongs here rather than as a prerequisite for every blocker investigation. |
| RL128 · first outcome, entry/prerequisites/neighbours | Security and node lifecycle are distinct useful entries into the same operations owner. The entry declares their different preparation without removing rebalancing from work that needs it. |
| RL128 · “Permission boundaries” | Runtime identity and trustworthy shop selection follow secure connections. Allowed/denied/spoofed tests are the evidence for the promised tenant boundary, with grants and bypass distinguished at that decision. |
| RL128 · “Range health under failure” | RL109 preparation is introduced before health/removal work starts. Its placement preserves a shorter security task while preparing the existing range-health and planned-removal sequence. |
| RL129 · second outcome, entry and RL96 neighbour | Closed-history reconciliation is named at entry and linked to its general owner. This prepares the reader for the later native handover instead of introducing its condition after acceptance. |
| RL129 · “Reconciliation and handover” | The boundary attempt and repeated final checks belong after isolated restore acceptance and before authority transfer. B203 remains a visible replay case; the boundary request prevents that one case being mistaken for the whole set. |
| E2 · guard protocol qualifications | These shared facts qualify the protected S501 result beside its starting state and outcomes. Mechanism teaching stays with RL90/RL91; they do not change the core mug race. |
| E6 · final reconciliation closure | Closure qualifies both alternative recovery histories beside their acceptance requirements. It does not create a new incident or alter either history's capacity/stock arithmetic. |
| Routes · “Implement safe checkout” | The narrower RL93 stop and immediately prepared RL91 → RL94 continuation put the obligation boundary where the reader chooses whether the task is done. |
| Routes · “Diagnose slow service” | Direct RL103 entry and evidence-selected branches belong in a task entrance; local branch preparation now agrees with each affected owner. |
| Routes · “Depend on recoverable data” | The natural stop now includes closed-history reconciliation and continuous fencing through acceptance. Native continuations inherit that contract. |
| Routes · “Secure shop boundaries” | Runtime tenant acceptance belongs at this task's stop. The RL128 security/health split identifies which part answers the task and which requires later preparation. |
| Routes · PostgreSQL “Explain and maintain a running server” | Architecture remains a useful maintenance path; a diagnosed incident has a separate RL103 → RL120 entrance. Plan/vacuum reading is named only for the selected intervention. |
| Routes · PostgreSQL “Repair query work” | Unknown cause goes to general triage; established expensive execution goes to native plans. This distinction precedes specialised work and prevents choosing the tool from the article title alone. |
| Routes · CockroachDB “Operate and recover” | Section-specific security/health entry and fenced recovery preparation are stated before the implementation route; readers can select the part their actual operation needs. |
| Routes · opening/status/preparation explanation | Entry understanding, conditional preparation and non-linear parentage belong before the route tables because they govern how every row is read. |

## Findings

No new teaching finding. `teaching-2` remains available for the next new teaching problem; no empty numbered finding is manufactured. T001 is repaired in this version. P001–P003 and V001 pass the teaching aspects above; this report does not replace their practitioner/value confirmations.

## Integrity and timing

SHA-256 values observed at **2026-10-23 23:12:46 UTC**. All four content inputs listed below that have manifest entries matched their frozen values.

| Input | SHA-256 |
| --- | --- |
| v02/manifest.json | `b22e25c828cb441ef76daabc864592fda7a2103808b81f428311de489223a010` |
| v02/commission.md | `ad5c6537dfa1677737fd23bae0c3c7d1ee9a360b59450db64b30a89a1803e3b8` |
| v02/tree.yaml | `43f11c61e42da496ad2680a234bca056650d63dd14fdbb9537a9dd0778b233fa` |
| v02/example.md | `1ccc633d95cb92b3850644f22f60c4a66f0c531a752d88cabb2e9c1ede5daa68` |
| v02/routes.md | `d505ec2c151b05caecaac8e2a2e8b90fe75ee69a98b6d18ff98382c08533bf0a` |
| accepted-v01.md | `4c085f9588342e323b3f17c5eb016daebbffdaa885d78076c42692e1f438832f` |
| repair-v02.md | `8db86504f842758fa474342f862c41bc0d9a080f636c74f57332e23b429d57a4` |
| sequences.astro calibration | `76271603ba4d560eac9c7398ea7c0a24e0d53f3cdaaa67bf0ec50c05654d95ba` |
| indexes.astro calibration | `16b4f695d15e0dc8ba505133421e75e7733d265196a78fa3c892c020cc4bf172` |
| storage.astro calibration | `92d7c366afc9ad0cb8fbcfd98fc12b87ed7a5674ea73b558e15b9052ae19a004` |

First clock observation was **2026-10-23 23:10:14 UTC**, after the skill read. Dependency/reference inspection and input hashing were complete at **23:12:46 UTC**. Report completion time is appended after saving and checking it. These are actual observations, not reconstructed start times; work before the first observation is unmeasured.

## Limits

This checks planned progression and proposed demonstration, not finished prose, completed figures or working native controls. I did not execute database schedules, verify native security/recovery protocols, browse external technical sources, inspect the capability-probe data, arrange reviewers, build, run a server, commit, push or publish. Primary-source/native technical accuracy remains with practitioner review and later writing verification. The implementation articles still owe actual pinned experiments and their written/rendered reviews.

I did not reload all three complete reference articles or run every reference control; the focused relevant exposure above is the permitted confirmation calibration. I did not reread unchanged specialist branches or establish the complete current learning journey from scratch. The separate fresh complete practitioner and blind complete teaching readings remain necessary. The accepted-problem and repair records were supplied, so this must not count as that blind complete teaching coverage.

Report saved and coverage/readability check completed at **2026-10-23 23:14:45 UTC** (24 October 01:14:45 CEST). The interval from the first clock observation is **4 minutes 31 seconds**; this excludes the unclocked initial skill reading.
