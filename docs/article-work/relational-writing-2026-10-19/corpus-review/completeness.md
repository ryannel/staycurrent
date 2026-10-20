# Corpus completeness and depth review — c01

## Decision

The complete 38-article collection supplies the commissioned route to relational database practice. It gives readers usable parent-level answers and sufficient contextual depth in design, queries, concurrency, application integration, diagnosis, live change, operation, recovery and selection. I found one required prerequisite repair at the first practical entrance. I found no evidence requiring another article, a new specialist branch or a replan of the approved curriculum.

The strongest feature is the continuity of obligations: the articles distinguish stored-state checks, all-writer protocols, application outcome evidence and service recovery. Later owners actually develop the hand-offs introduced earlier. Missing production acceptance measurements remain explicitly untested requirements; they are not presented as demonstrations of the invented shop's production readiness.

## Required change

### C-D1 · a02, with incoming promises in a00 and a08 — complete the first exercise's environment prerequisite

**Location:** a02, “Start with a database you can inspect and reset”, immediately before `createdb sql_working` and `psql --no-psqlrc -d sql_working`. Authoritative source: `src/articles/relational-next/a02.astro:53–55`. Incoming promises: a00's SQL introduction and first-application route; a08's opening link to the disposable PostgreSQL database.

**Evidence:** a00 says a02 “supplies a disposable starting database” and tells a first-application reader to obtain that setup before continuing through a01–a04. a08 repeats that entrance. The a02 section starts with a database on “a server you can access” and “your own connection options if the server is elsewhere”. It supplies a good schema/reset fixture once connected, but does not tell a reader without PostgreSQL how to obtain/start a disposable server and its clients, or give an explicit prerequisite link and connection bridge. The rendered frozen 4439 page confirms the same instructions; this is not missing reading-copy content. The remaining articles assume or link back to this environment, rather than completing its initial provisioning.

**Reader consequence:** an intelligent engineer new to databases cannot follow the promised first working route from a machine without an accessible PostgreSQL installation. They meet an unstated practical prerequisite before the first query and must choose an installation/deployment path and connection parameters independently. Later runnable exercises inherit the gap.

**Smallest adequate repair:** add a compact “Before these commands” block to this section. Name the required PostgreSQL server/client tools and database-creation authority; provide one supported, disposable local starting path or a precise link to an existing verified setup guide; show how that path's host, port and role reach both commands, with a simple successful connection/version check. Then join the existing schema/reset exercise and its existing database cleanup. Keep this in a02; neither a server-installation survey nor another curriculum destination is needed. If an existing browser practice environment is offered instead, verify that this exact fixture and exercise semantics work there and distinguish its runtime from the native examples.

**Recheck:** follow the added entrance from the stated clean starting condition through connection, fixture reset, one expected SELECT and cleanup. Confirm a00/a08's links land on that usable start. No concurrency or other unchanged native tests need repeating.

## Optional improvements

None required for coverage or depth. In particular, this review does not request full PostgreSQL administration, every SQL function, a general security/messaging/distributed-systems curriculum, or production-scale measurements for every illustrative fixture. The articles teach how to obtain and judge those deployment-specific measurements where needed.

## Cross-article contracts checked

- **Design → concurrency:** a01/a10 state that capacity/count/minimum-child rules are not automatically enforced by ordinary row constraints. a03/a18/a19 supply the conditional-row, stable-coordination-row and serialisable alternatives, including visibility after lock acquisition, empty predicates and all-writer coverage.
- **Design → lifecycle → operations:** a12 distinguishes history, retained identity and actual removal. a06, a30 and a39 carry those decisions through guarded retirement, downstream copies and applying current deletion rules before restored data returns to service.
- **SQL → application:** result grain, nulls, exact values, ordering and pagination are established before application loading, driver conversion and streaming. a21's separate fixture is identified; it does not silently substitute customer-level receipts for the parent's order-settlement model.
- **Transactions → request/background recovery:** known abort, unknown commit and external acceptance remain different. a22's atomic claim uses stable scope/input/result identity; a23's lease protects local transitions without pretending to stop an old external caller. Receiver deduplication and evidence retention remain explicit premises.
- **Performance → operations/change:** a05 completes its ordinary diagnosis and measured comparison before optional depth. a24–a28 develop distinct decisions. a29/a37 add physical execution, locks, runner boundaries and resource/recovery gates. a36 consumes, rather than overclaims, the bounded workload and recovery evidence.
- **Copies → authority → restoration:** a31/a38 distinguish catching up from fencing the old writer; a38 distinguishes durable standby receipt from readable replay; a39 distinguishes engine readiness, target attainment and business acceptance. New destination writes consistently close a route-back that would discard them.
- **Selection:** a08's production adoption is deferred against its explicit gaps. a32 changes to a single-host candidate openly; a34 changes the regional requirement openly and presents a documentation screen with no CockroachDB execution claim. These conditional alternatives do not become compulsory prerequisites for ordinary relational practice.

## Per-article coverage

Every row below represents a complete reading of the finished prose, code, tables, exercises, source notes and contextual links in the supplied reading copy. Figure cues were read in context; they were not treated as substitutes for full interaction/native evidence.

| ID | Coverage and depth assessment |
| --- | --- |
| a00 | Complete relational orientation: table facts/keys/grain, transaction and external boundaries, client uncertainty, physical work, change, recovery and conditional task routes. Usable first model. Incoming setup promise contributes to C-D1. |
| a01 | Requirements to row meanings, candidate/surrogate/composite identity, tenant-complete references, values, constraints, capacity obligations, normalisation, history/deletion and expected schema reads/changes. Sufficient first design. |
| a09 | Numeric range/rounding and input contract; text equality; instants versus schedules/DST; missing states; JSON/rows/binary/external boundaries; actual round-trip losses. Sufficient representation depth. |
| a10 | Required/check/null distinctions, complete/optional composite references, conditional uniqueness, deferred lead rule, exclusion intervals, referential actions and enforcement map. No hidden capacity guarantee. |
| a11 | Dependencies and all candidate keys, 2NF/3NF/BCNF where useful, lossless versus enforceable splits, independent sets, derived-copy freshness/concurrency/rebuild contracts. Theory earns practical decisions. |
| a12 | Current/snapshot/change/effective/bitemporal needs, entity/version references, gaps/overlaps/corrections, inactive/tombstone/archive/delete and per-copy removal/audit limits. Later owners complete procedures. |
| a02 | Substantial checked SQL route: inspect/reset, result contract, predicates, independent totals/CTEs, windows, stable order/pagination limits, changes/rollback and expected-result comparison. C-D1 is its environment entrance. |
| a13 | Three-valued expressions, deliberate defaults, CASE/type/evaluation caveats, arithmetic/rounding/overflow, collations/pattern escaping, parsing, reporting boundaries and calendar/reference clocks. Sufficient ordinary expression fluency. |
| a14 | Matching multiplicity/full keys/self roles, ON versus WHERE, grouping/counts/completeness, conditional totals and independent detail aggregation. Awkward fixtures verify full results. |
| a15 | Scalar/table/existence interfaces, cardinality/correlation, nullable and empty membership, bag/set operations, views and optional cycle/depth-bounded traversal. No missing composition prerequisite. |
| a16 | Grain/partition/display versus calculation order, latest/rank ties, input filters, denominators, frames/peers/missing dates, LAG absence versus null and combined report. Sufficient calculation depth. |
| a17 | Complete predicates and target evidence, defaults/identities, source-driven updates, cascades/direct counts, conflict/merge semantics, failed transactions and sequence gaps. Correctly hands concurrent/replay/live-job work onward. |
| a03 | Precise invariant/all-writer inventory, atomic complete booking, stale/disjoint-row decisions, coordination alternative, MVCC/SSI, deadlock/whole retry, unknown commit, durability and outbox. Complete parent-level correctness argument. |
| a18 | Counted-set protocol: stable row/lifetime, fresh post-lock command, empty/absent cases, mode coverage, explicit acquisition order and move recheck, honest wait/skip outcomes and reproducible sessions. |
| a19 | Snapshot timing, ordinary versus locking/current changes, RC recheck versus RR abort, write skew/predicates, SSI and invalid-logic counterexample, full retry and serial versus real-time definition. Bounded MySQL comparison. |
| a04 | Driver values/binding/SQL structure/authority, owning client/cleanup, generated work, response/commit uncertainty and durable external intent. Complete request responsibilities with concrete acceptance cases. |
| a20 | Lease/session/transaction ownership, cancellation/read-timeout/late acquisition, safe return/disposal, pool/proxy state, cursor consumption, deployment pool accounting, traces and bounded shutdown. |
| a21 | Actual ORM work through serialisation, lazy/identity-map behaviour, projections/joined/select-IN tradeoffs, collection products/batches, response consistency, page/stream materialisation, flush/version/raw state and authority. |
| a22 | Request/operation/attempt identity, shared deadline and timeout scopes, retry owner/cap/classification, atomic fingerprinted claims and fresh lookup, result lifetime/tombstones, unresolved outcomes and actual lost-reply cases. |
| a23 | Atomic intent, short claim/call/completion, leases/obsolete worker/cap sweep, receiver replay contract, event/job/pointer meaning, sequencing/compatibility, CDC boundary/progress/retention and owned recovery. |
| a05 | Full symptom→evidence→hypothesis→remedy→unchanged result→mixed workload loop, with plan units, physical/access work and honest measurement boundaries. Does not depend on a child to complete its first diagnosis. |
| a24 | Pages/locality/heap versus clustered locator, working set/TOAST, versions/undo/HOT/cleanup/reuse, diagnostic cost, reorganisation tradeoff and measured pruning. Operational partition decision remains with a38. |
| a25 | Workload-shaped B-tree/composite/order/prefix choices, related probes/bitmap alternatives, visibility coverage, partial/expression/prepared eligibility, one justified family contrast, write/constraint and retirement costs. |
| a26 | Safe plan evidence, tree/loops/timing/buffer units, first consequential estimate error, statistics summaries/limits, actual custom/generic path and a complete measured remedy. No optimiser-specialist gap. |
| a28 | Arrival/completion/outstanding/drainage boundary, Little's law and closed-loop limits, sampled blocking owner, concurrent resources, independent preparation versus protected work, active-limit sweep and per-class outcome. |
| a06 | Representation compatibility and finish gates, all-writer bridge/strict pre-switch contract, physical/runner work, guarded finite backfill, cutover authority, repair versus rollback and lifecycle retirement including restored data. |
| a29 | Exact DDL work/locks, waiting DDL queue, runner/session/history boundaries, enforcement versus validation, concurrent-index failure states/ownership, staged widening/dependencies, production budget and cleanup. |
| a30 | Input/meaning contract, durable finite worklist/snapshot/catch-up, stale-write guards, atomic dispositions/progress, lost-reply replay, side effects, batch controls, imports/corrections/purges and two-direction semantic reconciliation. |
| a31 | Paused versus capture move, full compatibility manifest, initial sync/eligibility/omissions, comparable exact reconciliation, complete source fence/final marker premises, separate allocator gate, destination authority/return/recovery handoff. |
| a07 | Failure-specific RPO/RTO and dependency/ownership map, access, actionable signals, maintenance, replica acknowledgement/freshness, isolated restore and evidence-led incident/return gates. Complete ordinary operating model. |
| a35 | Reachability/authentication/authority/copies, real task/denial tests, ownership/default/public/membership/search-path/routine risks, TLS identity, rotation versus live sessions, audit/emergency/compromise scope and recovery gates. |
| a36 | Service objectives, collector visibility/permissions, local metric legend/evidence routing, allocation reconciliation and adverse growth lead time, normal/degraded reserves, explicit acceptance gaps and owned/missing-data alerts. |
| a37 | Upkeep backlog/impediment/reuse, snapshot/slot/feedback and freeze duties, stats/archive/index work, peak maintenance budgets, major/minor/mode-specific upgrade return, actual copy rehearsal and renewed service/recovery acceptance. |
| a38 | Physical/logical topology and coverage, participant/stage acknowledgement versus replay, retention/catch-up/read barriers, fencing/promotion/rejoin, local partition invariants/lifecycle decision and cross-owner operation/recovery costs. |
| a39 | Loss-specific inputs, logical/physical/snapshot/PITR/retention, independent access, isolated full then targeted recovery, target proof versus connection readiness, later valid work/selective repair, integrity versus business readiness/removal rules. |
| a08 | Testable hard/forecast/preference gates, relational suitability, process/topology/hosting choices, compact PostgreSQL evidence, full cost/responsibility, honest prototype/deferred production choice and practical exit/adoption gates. Setup entrance contributes to C-D1. |
| a32 | Explicit single-host alternative, loaded library/driver/files, writer/busy/snapshot/checkpoint behaviour, sync platform assumptions/settings, statement-error cleanup, values, online backup/restart/error checks and bounded adoption. |
| a34 | Explicit region-loss alternative, dated candidate/support/commercial screen, topology/votes/locality/residency, compatibility/retry/ambiguity checks, four locality/hot-key workloads, named failures/recovery/cost and justified deferral. |

## Scope, method and limits

Read the actual `AGENTS.md`, review skill and assigned corpus brief; `README.md` and current site direction; commission; the complete 3,574-line canonical tree; and the registry's complete ID/parent/child/destination map. Read all 38 reading copies in parent-first families, recording coverage incrementally in `completeness-notes.md`. Matched them to c01's complete manifest and checked all 183 frozen file hashes: no differences.

For C-D1, inspected a02's authoritative Astro source and the actual frozen SQL page at `http://127.0.0.1:4439/review/relational-next/sql/`. No other corpus review report was read. The three fixed examples were not read for this assigned practitioner perspective, as the review skill reserves that comparison for teaching/style.

Retained the completed individual correctness/native/UI checks as instructed. This report does not claim a new full interaction, keyboard, phone or native execution audit. No new uncertain engine fact required a primary-source lookup. No articles, components, shared sources, builds, Git or databases were changed; only this independent report and its coverage notes were written. No downloads were clicked or executed. The temporary review browser tab was closed; the shared frozen preview server was left untouched and is released for other reviewers.
