# Teaching review · initial article coverage · batch 12 · v01

Inputs read: [exact frozen manifest](v01/manifest.json), version `batch12-v01`. Every URL below is derived from that manifest’s `preview` and `article_paths`. Complete rendered article prose, code, tables, captions, article-specific disclosures and text alternatives, final Sources outside the article element, and current figures were studied. Repeated collection-navigation templates were read once in full; version-specific descriptions, availability counts, current markers and pager differences were inspected.

**MEDIA COMPLETION PENDING — working report only until exclusive CUA views finish.**

Permitted context: the complete frozen commission, all assigned briefs, canonical shop example and extensions E1–E8. Own plans and the relevant complete parent, sibling, child, prerequisite and neighbour-owner plans were read in bounded deliveries: RL128–RL132; parent/sibling boundaries RL109, RL96/RL116, RL100/RL119 and RL85/RL84; relevant prerequisite/neighbour plans RL104, RL123, RL126, RL127, RL124, RL79, RL122, RL118 and RL93.

All context copies were byte-identical across the three manifests. The initial oversized tree display clipped; relevant context was recovered through 47 complete individual plan deliveries and explicit parent/sibling/child mapping. No earlier reports, decisions, author quality notes, source or mechanical records were consulted.

Reference calibration: all three fixed articles in full through exactly 19 separate helper results (Sequence diagrams 1–6, Indexes 1–7, Storage and durability 1–6), each with a 5000-token allowance and intact END marker. Root audited the public delivery. All 34 styled reference drawings were studied at `http://127.0.0.1:4350/review/examples/{sequences,indexes,storage}/` (13 + 11 + 10), with their complete explanations. A post-restoration Storage reload confirmed readable normal styling. No viewport or theme changes were made.

Highest severity: medium

## Exact pieces

| Piece | Frozen rendered URL |
| --- | --- |
| r49 | http://127.0.0.1:4534/review/relational-collection/cockroachdb/operations/ |
| r50 | http://127.0.0.1:4534/review/relational-collection/cockroachdb/backup-and-restore/ |
| r51 | http://127.0.0.1:4534/review/relational-collection/cockroachdb/schema-changes/ |
| r52 | http://127.0.0.1:4534/review/relational-collection/cockroachdb/upgrades/ |
| r53 | http://127.0.0.1:4534/review/relational-collection/cockroachdb/migration/ |

## r49 · Operating and securing a CockroachDB cluster

Whole-article judgement: The secure-identity and tenant-policy route teaches useful practical judgement. The health/removal route needs its physical-distribution preparation made available before it asks the security-entry reader to interpret leases and relocation.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | finding | the health/removal branch uses unexplained lease and movement concepts after an entry requiring only general access control (teaching-1). |
| 2. Order | pass | Within each branch, verified identity precedes permissions and range health precedes permanent removal. |
| 3. Examples | pass | The two P7 rows test allowed and forbidden scope; A/B/C→B/C/D carries the next-failure case. |
| 4. Showing | pass | The denial table and replacement-voter handover show why success alone does not establish the intended boundary. |
| 5. Judgement | pass | Identity tests, policy bypass limits, decommission preflight and post-move acceptance support concrete decisions once branch preparation is supplied. |
| 6. Gradual exposure | finding | the security route reaches the physical health branch without a preparation hand-off to the existing range/movement owners (teaching-1). |
| 7. Placement of additions | not applicable | This is a frozen first version with no coordinator-named additions. All actual explanation and figure order was assessed above. |

### teaching-1 · medium · r49, “Read health at the range”

Problem: the supplied entry requires general access/tenant authority (RL104), so the security route does not prepare the physical distribution concepts used by the next branch. “Compare intended replication and constraints with available voters, replica localities, leases and destination capacity” asks the reader to interpret leases without explaining their authority or directing the reader to the range article first. The text then proceeds into allocator placement, draining and decommission preflight without the movement preparation. Its local majority and under-replication definitions do useful work, but do not supply the missing lease/movement model.

Effect: a reader arriving for secure runtime access can follow the policy tests, then must supply an unfamiliar model to interpret the health evidence and judge the removal procedure. The voter replacement figure explains when a replacement counts; it does not explain lease authority or establish the physical preparation for that branch. This is an unprepared transition from the actual entry, rather than a finding merely because a planned link is absent.

Suggestion: introduce the operational branch before “Read health at the range” and provide its necessary preparation through the existing Keys, ranges and replication and Rebalancing and cluster change owners, with enough local orientation to choose that route. The security reading can still complete without requiring the whole distribution programme.

Evidence: the complete frozen r49 reading and figure; the first-use health paragraph quoted above; the actual supplied RL128 entry and RL104/RL123/RL109 owner boundaries. No peer review or author quality note informed this judgement.

## r50 · CockroachDB backup and recovery

Whole-article judgement: The restore is treated as the beginning of reconciliation, not its completion. The reader can prove the target and preserve the later booking and its single capacity effect under a closed history.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | The alternative S503 history, actual target timestamp, chain and scope are established before restore and reconciliation. |
| 2. Order | pass | Coverage and target acceptance lead to closing the source, enumerating accepted work, replay and authority transfer. |
| 3. Examples | pass | B203 carries absent-after-restore, first application, identical replay and conflicting fingerprint cases. |
| 4. Showing | pass | The history figure and 0/3→1/2→1/2 acceptance table expose the missing booking and double-decrement risk. |
| 5. Judgement | pass | The reader can distinguish file availability, restored correctness, full operation reconciliation and service acceptance. |
| 6. Gradual exposure | pass | The generic closed-history protocol is recapped and used; migration return and deployment identity retain their own deeper work. |
| 7. Placement of additions | not applicable | This is a frozen first version with no coordinator-named additions. All actual explanation and figure order was assessed above. |

Findings: none.

## r51 · CockroachDB schema jobs under load

Whole-article judgement: Database completion and application acceptance form two visible clocks. The chosen computed-column design remains explicit, including the boundary it does not cross into integer-only writing.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | The compatible caller protocol and fixed decimal domain precede the computed column, job states and acceptance. |
| 2. Order | pass | Design and authority precede jobs/resources, meaningful price checks, failed uniqueness and contraction. |
| 3. Examples | pass | The unchanged five order lines and a separate duplicate-key fixture carry success, failure and semantic acceptance. |
| 4. Showing | pass | The two-lane figure, job-state table and exact price pairs show different meanings of completion. |
| 5. Judgement | pass | The reader can recognise a running/reverting job, verify complete value meaning and require actual unique enforcement. |
| 6. Gradual exposure | pass | General live migration owns caller handover; binary/cluster compatibility is directed to upgrades. |
| 7. Placement of additions | not applicable | This is a frozen first version with no coordinator-named additions. All actual explanation and figure order was assessed above. |

Findings: none.

## r52 · Upgrading a CockroachDB cluster

Whole-article judgement: The return boundary is the organising idea, rather than a final warning. The reader can distinguish binary rollout, a retained compatibility state and the start of irreversible finalisation.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Binary and cluster versions, supported predecessors and the policy gate are explained before rollout. |
| 2. Order | pass | The supported route and return interval precede restart acceptance, rehearsal, finalisation and recovery history. |
| 3. Examples | pass | The pinned 25.3.7→25.4.17 rehearsal includes a real pre-finalisation binary return and unchanged receipt meaning. |
| 4. Showing | pass | The six-state player/text alternative separates mixed binaries, all-new binaries and finalised compatibility. |
| 5. Judgement | pass | The reader can earn each next restart, preserve the return interval and choose a different recovery path once finalisation starts. |
| 6. Gradual exposure | pass | Prepared operational health and backup reading are used; schema jobs and engine migration retain their own scopes. |
| 7. Placement of additions | not applicable | This is a frozen first version with no coordinator-named additions. All actual explanation and figure order was assessed above. |

Findings: none.

## r53 · Moving a SQL application to CockroachDB

Whole-article judgement: Compatibility and authority transfer remain one coherent migration argument. The target-only purchase makes the cost of a return visible and prevents a route change from masquerading as recovery.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | The explicit rewind, source authority, arithmetic/type contracts and request protocol precede copy and cutover. |
| 2. Order | pass | Semantic incompatibilities lead to a chosen protocol, closed copy, meaningful comparison, first handover and reconciled return. |
| 3. Examples | pass | The full purchase carries division differences, unsupported deferral, null-claim limits, unchanged-count corruption and repeated requests. |
| 4. Showing | pass | The six-state transfer figure and concrete P7/P3/103 outcomes show why the old copy is stale and what must be reconciled. |
| 5. Judgement | pass | The reader can choose a paused consistent copy, require equivalent facts and operation effects, and fence both handovers. |
| 6. Gradual exposure | pass | General SQL/migration/request identity are used; native upgrade, CDC and operational security are handed to their owners. |
| 7. Placement of additions | not applicable | This is a frozen first version with no coordinator-named additions. All actual explanation and figure order was assessed above. |

Findings: none.

## Limits

This is independent initial teaching coverage of the listed first versions only. It is not repair confirmation, a final complete reading, corpus coverage or publication approval. Technical truth, native reproduction, media mechanics, contrast, responsive layouts and performance were not certified by this perspective. Complete built-page textual alternatives supplied state explanations where they made the teaching fully available; controls were used only where needed for understanding. Sources were read as part of each complete article, not independently re-researched. No article edits, builds, commits, pushes or publication were performed.

Own temporary browser tab closed after the remaining media study.
