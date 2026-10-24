# Complete-corpus practitioner review · final v01

Fresh independent review completed on 24 October 2026. **58/58 complete pieces and all five ordered practitioner checks per piece (290/290) completed**, together with the cross-article ownership and depth check. **One medium finding; no critical correctness finding established.** This is a practitioner verdict on this frozen input, not publication authorisation or a verdict for the other perspectives.

## Exact inputs and reading coverage

- Assignment: `practitioner-assignment-v01.txt`, READY release confirmed by root.
- Frozen manifest: `v01/manifest.json`, SHA256 `feacba81d85e69771eda4966a8ebebbc9d5296331c2a993fbfec1ad7b8c7cf97`. I independently hashed all **653** listed files against the manifest; **zero mismatches**, including a final repeat before delivery. This identity operation did not read prohibited perspectives as prose.
- Current pieces: immutable built output `/private/tmp/staycurrent-relational-r49-opening-v03`, corresponding to `http://127.0.0.1:4554/review/relational-collection/` and the 57 manifest child URLs. I read complete local built HTML, including final Sources outside article DOM, every article caption, table, code block, explanatory disclosure and initial figure text. Identical navigation/collection catalogue was read once; current-piece differences were inspected. No article argument was waived.
- Non-default explanatory state copy: read from frozen source components/models. Own extracts are `practitioner-notes/state-copy.json` and `state-copy-recovery.json`; the recovery file repairs a lexical extraction gap caused by an apostrophe in a comment. This was a text/mechanism review, not a visual-control approval.
- Context: commission, all 58 briefs/intended outcomes, all 58 parent/sibling/child plans, example record and shared tree ownership/prerequisite structure. The tree has 58 unique destination keys. Provisional plan headings were not mechanically treated as a mandatory syllabus.
- Verification: frozen `source/` and permitted `mechanical/`, including applicability, current hashes, provenance mapping, native output, runtime/fixture/verifier records and exact-run/retained applicability qualifications. These are author/root observations, not peer quality verdicts. I challenged the current argument using the primary sources linked in the individual notes and `practitioner-notes/primary-source-index.json`.
- Instructions: current `staycurrent-review/SKILL.md` and only `perspectives/practitioner.md`. No earlier versions, reviews, decisions, approvals or author teaching notes were consulted. No delegation, source edits, build, commit or publication was performed.

Every clipped reading output was recovered with bounded follow-ups. For bulky native command logs, I read all substantive SQL/results and relevant identity/environment fields; identical polling, repeated SQL/results and zero-valued plan counters were compacted without treating them as additional observations. Own bounded article extracts and 58 completed per-piece notes are in `practitioner-notes/`.

## Finding

### practitioner-1 · Medium · Result-set combination has no foundational owner before r54 requires it

**Pieces/checks:** r05 *Joins and the meaning of a result row* — coverage, depth, ownership; r54 *Where distributed PostgreSQL work runs* — missing prerequisite and ownership handoff. This is one cross-article defect, not six separate defects.

**Location:** frozen `source/src/articles/relational-collection/r05.astro`, especially its result-construction scope at lines7–11 and duplicate discussion at lines52–60; `source/src/articles/relational-collection/r54.astro:59` (“Now expose both catalogues through a UNION ALL view…”). The r05 plan's “Sets and reusable queries” heading proposes UNION versus UNION ALL, subqueries, CTEs and views. The current article teaches the latter result-grain reasoning well but never explains combining compatible row results. A search of all current article prose finds `UNION ALL` only in r54's paragraph. The lower-case incidental “a later union” in r05:144 does not teach it.

**Reader effect:** a newcomer can now reason correctly about join multiplication and DISTINCT, but must supply the difference between adding columns through matching pairs and appending rows from compatible queries. They must also already know whether `UNION` removes duplicate projected rows and why `ALL` preserves them to understand the distributed `Append` example. The r54 paragraph describes what the coordinator did, but the collection supplies no prior operation/result-meaning explanation or owner to follow. This matters especially when two tenants share product ID P7: projecting only product_id versus retaining shop_id changes whether duplicate elimination collapses distinct source observations.

**Proportionate repair:** keep r05 as the foundational owner and add a small worked row-result combination using the established shop context: compatible columns/types, append with `UNION ALL`, and projected-row duplicate elimination with `UNION`. Explain the resulting grain and retain identities where separate observations matter. A short local recap/link in r54 can then connect SQL result construction to the observed `Append`. A full catalogue of set operators or SQL syntax is unnecessary; this finding is about a concrete downstream dependency, not insisting on every old plan heading.

**Primary support:** [PostgreSQL18 Combining Queries](https://www.postgresql.org/docs/18/queries-union.html) distinguishes combination of compatible results from duplicate elimination and `ALL`. No native rerun is necessary to establish this omission.

## Per-piece completion matrix

C = correctness against primary sources; E = evidence/model/native qualification; V = brief coverage and practical cases; D = depth in both directions; O = parent answer and deeper ownership. **Checked** means the check was completed and no substantive defect established. **Qualified** means evidence was checked within the explicit reuse/identity limits below, not freshly rerun. **P1** refers to practitioner-1. Each piece links to its bounded note with individual reasoning for all five checks and precise source links.

| Piece | C | E | V | D | O |
| --- | --- | --- | --- | --- | --- |
| [r00 · Relational databases](practitioner-notes/r00.md) | Checked | Qualified | Checked | Checked | Checked |
| [r01 · Relations, keys and normalisation](practitioner-notes/r01.md) | Checked | Qualified | Checked | Checked | Checked |
| [r02 · Values, missing data and equality](practitioner-notes/r02.md) | Checked | Qualified | Checked | Checked | Checked |
| [r03 · Constraints and tenant boundaries](practitioner-notes/r03.md) | Checked | Qualified | Checked | Checked | Checked |
| [r04 · History, correction and deletion](practitioner-notes/r04.md) | Checked | Qualified | Checked | Checked | Checked |
| [r05 · Joins and the meaning of a result row](practitioner-notes/r05.md) | Checked | Qualified | P1 | P1 | P1 |
| [r06 · Aggregates, windows and ordered results](practitioner-notes/r06.md) | Checked | Qualified | Checked | Checked | Checked |
| [r07 · Pagination and consistent exports](practitioner-notes/r07.md) | Checked | Qualified | Checked | Checked | Checked |
| [r08 · Updates, upserts and bulk imports](practitioner-notes/r08.md) | Checked | Qualified | Checked | Checked | Checked |
| [r09 · SQL at the application boundary](practitioner-notes/r09.md) | Checked | Qualified | Checked | Checked | Checked |
| [r10 · Indexes and access paths](practitioner-notes/r10.md) | Checked | Qualified | Checked | Checked | Checked |
| [r11 · Query execution and bad plans](practitioner-notes/r11.md) | Checked | Qualified | Checked | Checked | Checked |
| [r12 · Table partitioning and data lifecycle](practitioner-notes/r12.md) | Checked | Qualified | Checked | Checked | Checked |
| [r13 · Transactions and isolation](practitioner-notes/r13.md) | Checked | Qualified | Checked | Checked | Checked |
| [r14 · Locks, contention and deadlocks](practitioner-notes/r14.md) | Checked | Qualified | Checked | Checked | Checked |
| [r15 · Row versions, storage and cleanup](practitioner-notes/r15.md) | Checked | Qualified | Checked | Checked | Checked |
| [r16 · Retries when a commit reply is missing](practitioner-notes/r16.md) | Checked | Qualified | Checked | Checked | Checked |
| [r17 · Outboxes and database-backed jobs](practitioner-notes/r17.md) | Checked | Qualified | Checked | Checked | Checked |
| [r18 · Write-ahead logs and crash recovery](practitioner-notes/r18.md) | Checked | Qualified | Checked | Checked | Checked |
| [r19 · Backup, restore and reconciliation](practitioner-notes/r19.md) | Checked | Qualified | Checked | Checked | Checked |
| [r20 · Replicas, lag and read routing](practitioner-notes/r20.md) | Checked | Qualified | Checked | Checked | Checked |
| [r21 · Failover and fencing](practitioner-notes/r21.md) | Checked | Qualified | Checked | Checked | Checked |
| [r22 · Live schema changes and backfills](practitioner-notes/r22.md) | Checked | Qualified | Checked | Checked | Checked |
| [r23 · Connections, overload and capacity](practitioner-notes/r23.md) | Checked | Qualified | Checked | Checked | Checked |
| [r24 · Diagnosing a database incident](practitioner-notes/r24.md) | Checked | Qualified | Checked | Checked | Checked |
| [r25 · Database access and least privilege](practitioner-notes/r25.md) | Checked | Qualified | Checked | Checked | Checked |
| [r26 · Sharding and distributed SQL](practitioner-notes/r26.md) | Checked | Qualified | Checked | Checked | Checked |
| [r27 · Transactions across partitions](practitioner-notes/r27.md) | Checked | Qualified | Checked | Checked | Checked |
| [r28 · Time, snapshots and distributed reads](practitioner-notes/r28.md) | Checked | Qualified | Checked | Checked | Checked |
| [r29 · Regional placement and survival](practitioner-notes/r29.md) | Checked | Qualified | Checked | Checked | Checked |
| [r30 · Rebalancing and cluster change](practitioner-notes/r30.md) | Checked | Qualified | Checked | Checked | Checked |
| [r31 · PostgreSQL processes, pages and row versions](practitioner-notes/r31.md) | Checked | Qualified | Checked | Checked | Checked |
| [r32 · PostgreSQL vacuum and transaction age](practitioner-notes/r32.md) | Checked | Qualified | Checked | Checked | Checked |
| [r33 · PostgreSQL index methods and operators](practitioner-notes/r33.md) | Checked | Qualified | Checked | Checked | Checked |
| [r34 · Reading and repairing PostgreSQL plans](practitioner-notes/r34.md) | Checked | Qualified | Checked | Checked | Checked |
| [r35 · PostgreSQL JSON and structured alternatives](practitioner-notes/r35.md) | Checked | Qualified | Checked | Checked | Checked |
| [r36 · PostgreSQL WAL, checkpoints and durability](practitioner-notes/r36.md) | Checked | Qualified | Checked | Checked | Checked |
| [r37 · Restoring PostgreSQL to a recovery target](practitioner-notes/r37.md) | Checked | Qualified | Checked | Checked | Checked |
| [r38 · PostgreSQL physical replicas and promotion](practitioner-notes/r38.md) | Checked | Qualified | Checked | Checked | Checked |
| [r39 · PostgreSQL logical replication and change feeds](practitioner-notes/r39.md) | Checked | Qualified | Checked | Checked | Checked |
| [r40 · PostgreSQL schema changes under load](practitioner-notes/r40.md) | Checked | Qualified | Checked | Checked | Checked |
| [r41 · Operating and diagnosing PostgreSQL](practitioner-notes/r41.md) | Checked | Qualified | Checked | Checked | Checked |
| [r42 · PostgreSQL roles, policies and privileged code](practitioner-notes/r42.md) | Checked | Qualified | Checked | Checked | Checked |
| [r43 · Upgrading and migrating PostgreSQL](practitioner-notes/r43.md) | Checked | Qualified | Checked | Checked | Checked |
| [r44 · CockroachDB keys, ranges and replication](practitioner-notes/r44.md) | Checked | Qualified | Checked | Checked | Checked |
| [r45 · CockroachDB transactions and retries](practitioner-notes/r45.md) | Checked | Qualified | Checked | Checked | Checked |
| [r46 · CockroachDB isolation and follower reads](practitioner-notes/r46.md) | Checked | Qualified | Checked | Checked | Checked |
| [r47 · CockroachDB query work and hot ranges](practitioner-notes/r47.md) | Checked | Qualified | Checked | Checked | Checked |
| [r48 · CockroachDB table locality and region survival](practitioner-notes/r48.md) | Checked | Qualified | Checked | Checked | Checked |
| [r49 · Operating and securing a CockroachDB cluster](practitioner-notes/r49.md) | Checked | Qualified | Checked | Checked | Checked |
| [r50 · CockroachDB backup and recovery](practitioner-notes/r50.md) | Checked | Qualified | Checked | Checked | Checked |
| [r51 · CockroachDB schema jobs under load](practitioner-notes/r51.md) | Checked | Qualified | Checked | Checked | Checked |
| [r52 · Upgrading a CockroachDB cluster](practitioner-notes/r52.md) | Checked | Qualified | Checked | Checked | Checked |
| [r53 · Moving a SQL application to CockroachDB](practitioner-notes/r53.md) | Checked | Qualified | Checked | Checked | Checked |
| [r54 · Where distributed PostgreSQL work runs](practitioner-notes/r54.md) | Checked | Qualified | P1 | P1 | P1 |
| [r55 · Full-text search in PostgreSQL](practitioner-notes/r55.md) | Checked | Qualified | Checked | Checked | Checked |
| [r56 · Vector search in PostgreSQL](practitioner-notes/r56.md) | Checked | Qualified | Checked | Checked | Checked |
| [r57 · Types and extensions in PostgreSQL](practitioner-notes/r57.md) | Checked | Qualified | Checked | Checked | Checked |

All 290 checks are finished. There are no unread pieces, deferred article checks or sampling substitutions. `completed-checks.json` is the machine-readable record of these individual conclusions, not a mechanical test substituting for reading.

## Cross-article ownership and depth

The collection gives a practical parent answer before deeper implementation detail. I checked these boundaries across the complete current set, rather than assuming that a link implies adequate ownership:

| Subject family | Owner and deeper boundary examined | Corpus judgement |
| --- | --- | --- |
| Facts, values and history | r01 identities/dependencies; r02 value meaning; r03 invariants; r04 effective/recorded history; r25 authorisation | Integrity and authority are separated. Agreed line price is not mistaken for copied current price. No duplicate full treatment or missing practical decision found. |
| Result construction | r05 grain/matches; r06 calculations/frames; r07 continuation/export | Join and calculation depth is useful; the row-set combination bridge required by r54 is unowned: P1. |
| Application changes | r08 source versions/import receipts; r09 driver/transaction ownership; r16 missing commit reply; r17 external delivery and worker authority | Retry scope, request identity, import version and receiver/effect identity stay distinct. No “exactly once” shortcut or untaught necessary race remained in this review. |
| Query cost | r10 access work; r11 operators; r12 lifecycle partitioning; r33 methods; r34 PostgreSQL plans; r47 Cockroach SQL/KV | Parent mechanisms precede product evidence. Partition pruning, sharding, KV work and storage buffers are not conflated. Native fixtures carry their own row counts/versions rather than implying shared physical execution. |
| Isolation and physical versions | r13 invariants/isolation; r14 guard locks; r15 generic retained versions; r31 physical architecture; r32 vacuum/freeze | Guard admission versus absent-row locks, post-wait snapshots, HOT/page space and XID age each have an owner. The more detailed implementation articles add decisions instead of repeating the full parent. |
| Durability, recovery and authority | r18 crash mechanism; r19 closed-history restore; r20 freshness; r21 fencing; r36 WAL controls; r37 PITR; r38 physical promotion; r39 logical row stream; r50 Cockroach restore | Flush/replay/snapshot, backup/promotion, row-stream replication and external business reconciliation remain separate. Later valid work is reconciled by operation after closing admission; restoring old state never silently erases that obligation. |
| Change and operations | r22 compatibility/backfill; r23 admission/capacity; r24 incident causality; r40 PostgreSQL DDL; r41 diagnostics; r43 upgrade; r49 Cockroach operations; r51 jobs; r52 versions; r53 migration | Operational detail is substantial because the failure cases change safe practice. Parent answers are useful before commands. Long recovery/migration/job pieces have distinct tasks and justified acceptance work; no substantive excess-depth request is raised. |
| Distributed mechanisms | r26 distribution choice; r27 atomic outcome; r28 safe common history; r29 placement; r30 movement; r44 keys/ranges; r45 transactions; r46 historical/follower reads; r48 locality; r54 distributed PostgreSQL | Co-location, consensus, atomicity, safe timestamps, voting membership and authority have separate owners. A common time is not a fresh sale authorisation; a copy is not a voter/writer. The only missing bridge found is P1. |
| Security and specialist representations | r25 least privilege; r42 PostgreSQL code/policies; r49 certificate/runtime boundaries; r35 JSON; r55 lexical retrieval; r56 approximate vector retrieval; r57 type/extension lifecycle | Composite references are not access control, JSON null is not SQL NULL, lexical rank is not semantic probability, and ANN recall is not returned row count. Specialist depth is supported by prerequisites and operational lifecycle ownership. |

**Example continuity checked for practitioner meaning:** the three core orders, line/payment identities and39.50/40/29 totals remain coherent; purchase103 consumes two P3 and one P7, leaving10/0/4. Tenant20's P7 is a distinct Copper mug, not an extra core sale. S501 guard capacity, S502 staff write skew and R1 room exclusion are separate invariants. Price effective/recorded corrections are not overwritten into earlier agreements. The independent107 and B203 recovery exercises are not one combined history. Toy vectors, synthetic performance rows, chosen voter memberships, local region labels and the diagnostic stock branches remain labelled extensions/models rather than invented shared purchase history.

Outside P1, the current set assigns each required practitioner subject a useful owner and sends detailed mechanisms to the appropriate child. I found no additional substantive missing depth or unnecessary full treatment. This is not a claim that the corpus is an exhaustive reference for every SQL feature.

## Qualified reuse of mechanical evidence

I used native evidence as observations supplied with this exact assignment, then checked its applicability to the current claim. I did **not** treat all current prose as if it had been rerun whenever a presentation file changed.

- **Identity closure:** all653 input identities match the frozen manifest. A separate audit of186 path/hash pairs recorded in mechanical JSON finds165 current matches and21 differences. Those21 are article prose or explanatory presentation components, not an executable download mismatch within that audited map. `practitioner-notes/identity-audit.json` retains the exact pairs. This is not proof that every historical run recorded every relevant verifier hash.
- **Fixture and meaning:** the core/E1–E8 example facts were checked against current prose and native results. Generated60k/100k/50k/30k fixtures, anonymous full-page rows, local Cartesian spatial points and independent recovery drills were kept separate. Toy vectors support distance arithmetic only. Plan metrics are consumed according to the actual node/loops/early-stop scope; a parent buffer count is not summed again with its children.
- **Native environment:** PostgreSQL cases pin18.6, with17.6→18.6 for the copy upgrade; Cockroach cases pin25.4.17, with25.3.7→25.4.17 for binary/version rollout. Driver and client-library versions are retained where supplied and not assumed equal to the server (notably libpq17.6 versus server18.6). Extension claims pin btree_gist1.8, postgres_fdw1.2, pgvector0.8.7 and PostGIS3.6.4 with its recorded libraries. Native records identify private directories/sockets or unique owned clusters/markers and cleanup within their recorded scope. Only the exact-run/provenance packets that actually establish cleared process environments are treated as doing so; no blanket new-process check is claimed by this reviewer.
- **Exact current executions with stronger provenance:** the r04/r08/r09 packet records all six current-script executions, including actual inherited-read-only environment cases, ownership and cleanup. r17's current v03 verifier/script/core provenance covers acknowledged-claim retirement and post-lock expiry checks, including uncertain/aborted token cases. r37's exact-current verifier SHA `f1d8a0f8ce1a63f2b23fa59bd92879a1e4b220256cef7d6e8409f149804dd822`, current fixture/core and results support the present recovery acceptance story.
- **Explicit retained exceptions:** r36's retained executed verifier predates a leading directory-creation line; the body/fixture/mechanism is unchanged and the record says `exact_final_download_run: false`. I reuse its process-crash result only, not claim exact final-download execution. r39's REPLICA IDENTITY FULL discussion is checked against primary documentation and is not called an executed FULL case. r51 has a current verifier hash and corresponding SQL/results but no historical verifier hash: the retained record supports the observed fixture/job outcome, not independently established byte-for-byte historical verifier identity. r01/r05/r06 also have less complete historical exact-download/verifier provenance than the dedicated exact-run packets; result correspondence is supported, exact-final execution is not asserted. These are stated limits, not evidence of an observed false result.
- **Presentation changes:** applicability files qualify retained r10/r11, r23/r24, r26, r32, r40–r43 and r44/r48/r49/r51/r52/r56 mechanisms separately from new prose/labels. I checked the present claim rather than importing a previous quality verdict. r48's actual converged range membership is2–1–2 across the three labels; no automatic reuse of a conceptual2–2–1 figure as native placement evidence.
- **What was not observed:** process crashes are not power/storage loss; localhost processes are not independent machines, regions or networks. Single-node historical timestamps do not establish follower routing. Licence-key-empty grace runs do not establish production entitlement or a successful post-finalisation downgrade. r45/r53 missing replies are deliberate caller-boundary withholding, not observed native40003. r29/r30 chosen schedules/arithmetic are not distributed fault tests or protocol model checking. Exact HTTP bytes, where provided, establish the actual linked asset response only; no browser-save success is claimed.

The unresolved historic-verifier identity in r51 does not warrant a ceremonial rerun: the current article's consequential job/visibility claims are independently supported by primary documentation and the bounded SQL/results, and no contradictory or genuinely unresolved behaviour emerged. Likewise, no other claim required a new native experiment. I therefore did not start any native process or use shared memory, stores or active endpoints.

## Independent technical challenge and limits

The per-piece notes name precise primary sources for every article's argument. In total the index contains63 primary resources/records. Particularly consequential challenges included: NULL versus CHECK acceptance; candidate/prime-key normalisation definitions; exact numeric rounding; RC target recheck versus snapshot write skew; common-guard protocols; index span/visibility/consumption; claim acknowledgement and post-lock lease time; WAL acknowledgement versus power loss; replay before snapshot; closed-history fencing and reconciliation; classic2PC versus replicated agreement; safe common read horizons versus current authority; Raft joint majorities; PostgreSQL18 statistics/checksum/upgrade changes; logical missing-row conflicts; Cockroach STAGING commit condition, bounded-staleness eligibility, RLS stream/backup bypass, GLOBAL strong reads, licence/finalisation boundaries; and filtered ANN exact-baseline recall. Their concrete current text and fixture results survive those challenges, apart from the P1 missing explanation.

Original-source access was not uniform: Codd's1971 paper was available as a primary facsimile; Fagin's1977 publication abstract/definition-facing search material was available but a full paper fetch was not established. I do not claim to have reread the complete Fagin proof. Current official product documentation was checked at pinned major-version URLs; the licensing FAQ is explicitly a current stable source rather than a fictitiously pinned25.4 native licence grant. Documentation-backed unexecuted controls remain documentation-backed.

No browser tab, browser download/save wait, UI resize or theme change was used. Complete immutable HTML and frozen state copy supplied the permitted reading surface. No visual/interaction-quality approval is implied. No processes or UI defaults need restoring; no resources were left running. No source, build, commit, publication or work beyond this report and its own notes was performed.

**Return:** full requested practitioner and corpus coverage completed on the exact ready v01. One medium coverage/ownership finding, zero established critical defects, and the explicit reuse/source/environment/verifier limits above. End of assignment.
