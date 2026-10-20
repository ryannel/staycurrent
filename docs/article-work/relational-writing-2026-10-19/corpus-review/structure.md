# Written relational corpus: structure, overlap and consolidation

Independent corpus perspective, 20 October 2026. Frozen input: c01, 38 articles, 183 source files. Apply `.agents/skills/staycurrent-review/SKILL.md` directly; no nested reviewers and no other corpus reports used.

## Decision

One required navigation repair, S01. No article deletion, merger or new child is justified by the finished collection. Two optional cuts, S02–S03, remove repeated exposition without reopening the approved curriculum. The article boundaries generally earn their cost: each parent gives a usable first case, and children add a particular decision, mechanism or executable procedure.

This is a structural decision, not a replacement for the retained individual technical, native-engine or interaction reviews. It does not authorise publication.

## What I read and checked

Read all 38 supplied full reading copies, including prose, code, tables, exercises, contextual links and sources, by families: a00; design a01/a09–a12; SQL a02/a13–a17; transactions a03/a18/a19; applications a04/a20–a23; performance a05/a24–a26/a28; change a06/a29–a31; operation a07/a35–a39; selection a08/a32/a34. The copies contain 145,555 whitespace-delimited words, including code and references; that is not a rendered reading-time estimate.

Also read the actual AGENTS.md, README, site direction, review skill and brief, commission, complete 3,574-line canonical tree and registry hierarchy. Kept per-article observations during reading in `structure-notes.md`. Recomputed all 183 frozen-file hashes: every file matched c01. No source drift was found.

Compared the actual Astro layout and finding-related article/source/component passages. In particular, the full executable comparison in a02 is collapsed in the real source, so its repetition is not counted as a required visible-reading cut. Inspected a04's actual recovery scene and a03's commit-boundary model, and a09/a13's text/time mechanism sources rather than treating the reading-copy cues as full figures.

Used the frozen preview at `http://127.0.0.1:4439` to inspect a01's rendered end and its continuation links. Existing native/UI checks were retained; no new cross-corpus concern required repeating their engine or endpoint tests. No download link was clicked. Closed the browser tab and released preview use. No article, component, source, build, Git or native-database changes were made.

## Required finding

### S01 — Continue the first-application working route at the end of a01 and a02

**Locations:** a00, “Choose a system by testing the contract you need”, first-application route; a01, closing paragraph at `src/articles/relational-next/a01.astro:155`; a02, closing paragraph at `src/articles/relational-next/a02.astro:188`; shared continuation at `src/layouts/RelationalNext.astro:40`.

**Written evidence:** a00 asks newcomers to finish a01 → a02 → a03 → a04 before selecting depth. The a01 ending offers no explicit next working-route step. The a02 ending instead directs a reader with a correct answer to performance. Both are then followed by the wrapper's “Continue into the detail” list and a return to the collection. The browser confirmed a01's end: types, constraints, normalisation and history are its only immediate article choices. Links to SQL and transactions earlier in the prose concern particular questions, not continuation of the promised first-application route. a03 already closes with an explicit application-integration continuation, so it needs no equivalent repair.

**Reader consequence:** the reader most likely to need the prescribed route must remember the introduction's table, return to it, and distinguish optional depth from the next foundation. Following the end-of-article invitation can take them into four design leaves or five SQL leaves before the concurrency and request boundaries that the introduction says should come first. This is avoidable navigation and reading cost, rather than a missing article.

**Smallest adequate repair:** add one closing sentence to a01: for the first-application route, continue to **Working with SQL**, and return to these design details when their question matters. Add the corresponding sentence in a02 pointing to **Making concurrent changes correct**. Preserve performance as the explicit alternative for an already correct but slow query. These can be prose links before Sources; no global linear sequence, new navigation system or tree change is needed. Keep the optional child list.

**Useful understanding lost:** none. The repair gives the existing route a continuation and does not remove task-specific entrances.

**Recheck:** follow the route from a00 through the ends of a01/a02/a03. Confirm each next main article is apparent before optional depth; confirm a02 still serves the correct-but-slow task.

## Optional improvements

### S02 — Remove a04's second demonstration of the missing-commit-reply distinction

**Locations:** a04, “Recover according to what the application knows”, `a04.astro:126–128`, Figure 4; `src/components/relational-next/a04/scenes.mjs`, `recovery`. Compare a03, “Losing the reply does not prove rollback” and Figure 3, and a04 Figure 1's database/driver/user completions. a22 later develops the actual claim/result protocol.

**Evidence and consequence:** on the prescribed main route, a03 has already compared commit state with caller knowledge, and a04 Figure 1 makes the extra HTTP response boundary visible. Figure 4 then replays “COMMIT never reaches server” versus “COMMIT reply is lost”, ending at the same lesson: no confirmation does not choose the database outcome. It adds another control sequence before a04's new material—stable operation identity, meaningful request equivalence and competing claims—without teaching another recovery action.

**Smallest adequate cut:** retain the section, its outcome classification, timeout/cancellation consequence, operation-identity paragraphs and a22 link. Replace Figure 4 and its viewing instruction with a short recall of a03's known-abort/unknown-outcome distinction. Keep a04 Figure 1 because it adds the API-to-user response boundary. Renumber the later figure and remove any resulting dead scene only if taking the cut.

**Useful understanding lost:** a second animated comparison of the two database histories. The distinction and its practical consequences remain in a03, a04's surrounding prose and the detailed a22 protocol. This is optional because a04 also serves direct entrants.

### S03 — Shorten a13's repeated local-time input-resolution detour

**Locations:** a13, “Calculate reporting boundaries in the intended clock”, `a13.astro:143–145` and the `transitions` code block. Compare a09, “Store the time the application actually means”, including the same London spring gap, repeated autumn 01:30, PostgreSQL resolution and explicit-offset policy.

**Evidence and consequence:** a13's new value is deriving two reporting midnights, understanding both `AT TIME ZONE` directions and distinguishing calendar movement from elapsed duration. After those boundaries have been calculated, three paragraphs/code revisit the appointment-input ambiguity policy already developed by a09. The two articles otherwise have sound different ownership: stored representation versus expression operations.

**Smallest adequate cut:** keep the reporting-day figure, boundary query, `AT TIME ZONE` explanation and calendar calculations. Reduce the gap/repeated-time recap to one sentence linking a09's time section; keep the executable transition observations in an optional detail or worksheet if needed. Do not remove a13's new day-boundary or interval examples, and do not make all of a09 a prerequisite for SQL.

**Useful understanding lost:** a second on-page worked appointment-input conversion and its repeated offset outputs. No reporting mechanism is lost; direct entrants retain a precise route to the input policy. Optional, not an ownership defect requiring repair.

## Consolidations considered and rejected

- **Fold design leaves into a01:** a09 supplies representation/driver loss; a10 conditional, deferred and interval enforcement; a11 reconstruction/enforceability/independent-set choices; a12 effective versus recorded history and lifecycle. The parent already supplies a complete small design. Folding these into it forces several different questions into that first route; deleting them loses useful judgement.
- **Merge SQL leaves:** values, pairing/grouping, scalar/membership/multiset composition, window frames and changes have different failure contracts and fixtures. a14 explicitly declares its customer-payment schema rather than pretending it is a02's order-settlement schema. a15's recursion is explicitly optional and not a prerequisite detour. Setup and collapsed complete statements support repeatability; cutting them indiscriminately would save little ordinary visible prose and make exercises harder to run.
- **Merge a18/a19 with a03:** a03 solves the guarded counter. a18 constructs the counted-set coordinator protocol, including its post-lock statement boundary and every writer. a19 supplies the ordinary/locking-read and dependency contracts needed to evaluate another engine/setting. Removing either loses a consequential alternative or the ability to read its guarantee. Their common staffing/capacity recaps are context, not three independently owned retry systems.
- **Merge a20/a22/a23:** safe connection reuse is different from a durable original-request claim, and both differ from worker takeover and an external receiver's outcome. Their cross-links preserve those limits. a21 separately controls actual generated work. A large integration omnibus would make a resource leak require navigating request deduplication and event capture.
- **Fold a26 into a05:** the statistics-refresh motif repeats, but a26 adds actual operator accounting, statistics interpretation, estimate origin, common/rare parameters and the real named-preparation path. The parent needs its complete ordinary diagnosis-to-workload comparison. Cutting that parent result would turn it into a gateway; cutting the child would lose practical plan fluency. No merge justified.
- **Remove a24 or fold a28 into a36:** a24 explains where physical work comes from; a28 diagnoses arrivals, queues, contention and useful completions. a36 consumes that evidence to budget growth, degraded headroom and alert intervention, without another load-test tutorial. Keep those questions distinct.
- **Merge live-change procedures:** a29 handles physical DDL/runner/catalogue state; a30 accounts for a finite changing source scope, atomic progress and semantic reconciliation; a31 proves a copy/stream boundary and transfer of write authority. Their links to a06's compatibility gates avoid three independent change frameworks. Each has a real procedure that would become harder to find in an omnibus.
- **Merge a31/a38/a39:** a31 is a planned move; a38 is ongoing acknowledgement/read/promotion/partition operation; a39 reconstructs a past acceptable state. Their common fencing, readiness and later-write cautions apply to different transition preconditions. Consolidating them loses the distinction that prevents using promotion to repair a committed deletion or treating a copied database as a completed move.
- **Split or fold a37/a38 further:** these are substantial pages, but the finished text uses linked mechanism owners and a bounded operating decision. There is no written evidence that another maintenance, upgrade, partition or sharding speciality is needed. Conversely, deleting their operational half loses ongoing duties the parent only introduces.
- **Remove candidate pages:** a32 identifies SQLite differences that can accept or disqualify a real embedded arrangement. a34 screens release/commercial/topology/compatibility requirements for an explicitly changed regional promise. They are conditional alternatives, not requirements before first SQL. Folding them into a08 burdens the ordinary server choice; deleting them loses concrete acceptance differences. No product sub-branches are warranted.

## Per-article coverage and ownership

All entries below mean full prose/code/table/exercise/link reading, not title or plan inspection. “Keep” records an adversarial consolidation decision, not a blanket technical approval.

| ID | Ownership and value against reading cost | Disposition |
| --- | --- | --- |
| a00 | Useful whole-system first case; explicit main task routes and optional depth | Keep; S01 implements its route |
| a01 | Complete tenant-scoped booking design, negative cases and remaining enforcement duties | Keep; S01 |
| a09 | Numeric/text/time/absence/structured-value contracts and round-trip loss | Keep |
| a10 | Scoped references, conditional uniqueness, check timing and interval enforcement | Keep |
| a11 | Dependencies, safe reconstruction, local enforceability and derived-copy contract | Keep; initial concurrency-cut hypothesis rejected |
| a12 | Required past answers, snapshots, versions, recorded time and removal meanings | Keep |
| a02 | Runnable first SQL report, result contract, paging, bounded change and checks | Keep; S01 |
| a13 | Expression truth/types/defaults, matching, reporting clock and calendar arithmetic | Keep; S03 optional |
| a14 | Pairing, preserved rows, grouping/completeness and independent-total repair | Keep |
| a15 | Scalar cardinality, correlation, membership, multisets, reusable view; optional recursion | Keep |
| a16 | Input/partition/order/frame/tie/filter decisions and a checked combined report | Keep |
| a17 | Set-based changes, ambiguous sources, insert conflicts, direct/dependent outcomes | Keep |
| a03 | Complete guarded reservation, multirow counterexample, protection choice and failure boundary | Keep |
| a18 | All-writers lock protocol, empty sets, post-wait view and multi-resource ordering | Keep |
| a19 | Exact read/change isolation contract, dependency reasoning and ordering limits | Keep |
| a04 | Full request/driver/authority/lease/response/external boundary | Keep; S02 optional |
| a20 | Lease ownership, cancellation/late acquisition, pooling state, streams and shutdown | Keep |
| a21 | Actual generated SQL and response construction, loading shape, bounds and automatic writes | Keep |
| a22 | Durable operation key/fingerprint/claim/result/retention and outcome resolution | Keep |
| a23 | Durable intent, claim generations, external repeats, event meaning and publication progress | Keep |
| a05 | Complete symptom→physical work→hypothesis→correct result→workload comparison | Keep |
| a24 | Width/locality/large values/retained versions/reuse and measured pruning | Keep |
| a25 | Workload-derived access routes, eligibility, coverage and write/constraint obligations | Keep |
| a26 | Operator/reporting fluency, estimate cause, statistics and prepared parameter diagnosis | Keep |
| a28 | Arrival/completion accounting, queues, resource contention and tested serial-section repair | Keep |
| a06 | Complete staged address conversion, recovery and retirement; first cutover answer | Keep |
| a29 | Physical DDL locks, migration-runner state, validation, build failure and dependency switch | Keep |
| a30 | Complete job scope/catch-up, guarded transformation, durable progress and reconciliation | Keep |
| a31 | Paused/captured move, compatible meaning, final boundary/fence and new-history return cost | Keep |
| a07 | Named service promises, owners and common incident decision/return gate | Keep |
| a35 | Effective authority, positive/negative access, TLS, credential/session retirement and audit limits | Keep |
| a36 | Deployable observation, capacity accounting, intervention lead time and owned alerts | Keep |
| a37 | Diagnosed upkeep, budget, exact upgrade route, preflight and post-write recovery limits | Keep |
| a38 | Replication acknowledgement/replay, routing, fenced promotion/rejoin and partition lifecycle | Keep |
| a39 | Copy/coverage choice, independent recovery access, full/target restore and readiness | Keep |
| a08 | Requirements/shortlist, compact PostgreSQL evidence and bounded adoption decision | Keep |
| a32 | Optional embedded runtime, write/snapshot/durability/data/backup acceptance differences | Keep |
| a34 | Optional distributed requirement and pinned documentation/acceptance/cost screen | Keep |

The smallest adequate change to the current corpus is therefore S01's two continuation sentences. S02 and S03 can save additional repeated exposition, but are not reasons to delay otherwise completed work or commission another review of unchanged articles.
