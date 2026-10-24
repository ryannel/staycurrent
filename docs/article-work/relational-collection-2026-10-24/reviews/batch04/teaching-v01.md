# Teaching review · article · r14, r16, r17 · batch04-v01

Highest severity: none

This is fresh independent initial teaching coverage, performed as one eight-piece assignment with batch03-v01. Each piece below received all seven teaching checks and a coherent-learning judgement at its declared entry. Finding numbers would restart per piece. This is neither a repair confirmation nor a corpus route review.

## Inputs read

- Assignment: `reviews/batches03-04-teaching-assignment.txt` in this commission.
- Current `.agents/skills/staycurrent-review/SKILL.md` and only `perspectives/teaching.md`.
- Frozen [manifest](v01/manifest.json): `batch04-v01`, frozen `2026-10-24T01:58:49.123379+00:00`; identity, input-list and availability metadata. Assigned keys: r14, r16, r17.
- [Commission](v01/context/commission.md), [briefs](v01/context/briefs.json), [canonical example](v01/context/example.md), and relevant parent, prerequisite, sibling, child and neighbour planning in [tree](v01/context/tree.yaml). The commission, example and tree have the same manifest hashes as the batch03 context and were read once as identical common input. Relevant preparation/ownership includes RL76/RL79/RL85/RL90, the assigned RL91/RL93/RL94, and RL96/RL98/RL102/RL103/RL118/RL120/RL124. Contextual neighbours did not become compulsory page closure.
- Complete frozen rendered articles, including prose, SQL, tables, figures, every scripted step/choice and text alternative, experiment limitations and final Sources disclosures outside the article body: [r14](http://127.0.0.1:4408/review/relational-collection/locks-and-deadlocks/), [r16](http://127.0.0.1:4408/review/relational-collection/conflicts-and-retries/), [r17](http://127.0.0.1:4408/review/relational-collection/outboxes-and-jobs/). No substitute live preview or later repair was used.
- Identical full reference calibration for this one eight-piece assignment, completed once before article reading: all 19 separate bounded outputs from `scripts/read-writing-reference.py`, each requested with a 5,000-token output allowance and read through its END marker: sequences 1–6, indexes 1–7, storage 1–6. Complete-text hashes: sequences `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`; indexes `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`; storage `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.
- Separately inspected all 34 rendered reference drawings alongside their explanations: figures 1–13 at [Sequence diagrams](http://127.0.0.1:4350/review/examples/sequences/), 1–11 at [Indexes](http://127.0.0.1:4350/review/examples/indexes/), and 1–10 at [Storage and durability](http://127.0.0.1:4350/review/examples/storage/). This is the same calibration recorded in the batch03 report, not another independent calibration.

Withheld: article/component source, mechanical evidence, author notes, peer reports, earlier versions, decisions, repair history and broader task history. No builds, native execution, article edits, delegation or publication were performed. Availability was pinned to the frozen build.

## r14 · Locks, contention and deadlocks

Entry assessed: transaction snapshots and the class-capacity rule, with constraints.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Row-lock lifetime and ordinary readers precede the empty-booking counterexample; the session guard, declared schema and fresh-count requirement are introduced before reliance on them. |
| 2. Order | pass | Lock scope → missing lockable row → guard → fresh Read Committed count → stale Repeatable Read view → changed guard/retry puts the difficult snapshot distinction at the centre. |
| 3. Examples | pass | S501/B201/B202 carries success, overbooking and restart; a separately labelled P3/P7 schedule isolates deadlock from a long queue. |
| 4. Showing | pass | All fifteen guard-protocol state texts, complete schedule alternatives, worked SQL and the two-wait cycle show ownership and visible bookings separately. |
| 5. Judgement | pass | The reader can choose a shared authority and compatible snapshot protocol, identify why narrowing can break protection, distinguish contention from a cycle, and avoid applying SKIP LOCKED to a capacity proof. |
| 6. Gradual exposure | pass | Timeout scope, mode choice and blocker identities are explained locally; capacity budgeting, application connection ownership and live operational intervention retain their deeper owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial assignment. |

Coherent-learning judgement: coherent at its entry. The opening promises both a turn and a sound observation; the later stale-snapshot example fulfils that distinction directly. The guard is made useful before it is qualified, and the changed-guard repair states why a new complete transaction is necessary. Deadlock is introduced as a different shape of dependency, with a prevention schedule that accounts for the second writer's first lock.

Evidence read: “What a row lock stops”; empty selected-booking result; two-statement Read Committed protocol; all five states for each of `rc`, `rr`, `update`, and full “The schedules as text”; guard-epoch SQL and Serializable contrast; queue scope and timeout discussion; P3/P7 cycle and common order; blocking query and intervention boundaries; complete experiment and Sources disclosures.

Findings: none.

## r16 · Retries when a commit reply is missing

Entry assessed: transactions, unique keys and application connection ownership.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | The article rewinds the purchase explicitly, then distinguishes request key, transaction attempt, order ID and provider identity before presenting the request table. |
| 2. Order | pass | Two indistinguishable caller histories create the need for identity; payload meaning precedes the atomic protocol, then retry classification and retention qualify the result. |
| 3. Examples | pass | One mug and two teas carry both the misleading out-of-stock replay and safe resolution; conflicting payload and overlapping insertion are developed without inventing a second purchase. |
| 4. Showing | pass | The two-history drawing, deferred-reference SQL, subsequent lookup, all ten resolution states and the result/action table make the branching decision visible. |
| 5. Judgement | pass | The reader can distinguish known abort, business refusal and unknown commit; preserve identity; reject changed intent; and keep exhaustion unresolved rather than declaring failure. |
| 6. Gradual exposure | pass | Core uncertainty and identity are answered here before provider effects, restore reconciliation and product-specific retry mechanics are handed deeper. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial assignment. |

Coherent-learning judgement: coherent at its entry. The recorded request is justified as the missing evidence, not introduced as a generic retry pattern. The immediate unique claim and deferred order reference are explained in relation to the transaction's order. The separate-statement lookup has the needed snapshot explanation beside it. Retention, remembered refusals and restore limits clarify where the otherwise small protocol stops applying.

Evidence read: the complete two histories; the same-payload normalisation explanation; `purchase_requests` declaration, unique insert and fresh lookup; complete Resolution as text and all five states in both committed/aborted modes; all six error/action rows; retry budget, retained identity and terminal refusal policies; experiment's acknowledgement-withholding limitation and full Sources disclosure.

Findings: none.

## r17 · Outboxes and database-backed jobs

Entry assessed: transactions, uncertain outcomes and lock/claim reasoning from RL91 before recoverable workers.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | The explicit entry names retry and lock preparation; the article defines event/effect identity, ownership fields, lease, claim generation, inbox and fence before relying on each. |
| 2. Order | pass | Atomic intention → short claim → token-qualified finish → expired worker → receiver replay → inbox/fencing develops the obligations introduced by moving work outside the transaction. |
| 3. Examples | pass | Order 103 and its one event remain stable while A/B change claims. The unchanged effect identity makes duplicate recovery concrete; the local inbox counter isolates consumer atomicity. |
| 4. Showing | pass | The database/external boundary, ownership-field table, claim/completion SQL, five-step failure schedule and inbox transaction show both atomic and non-atomic transitions. No scripted state control is present in this piece. |
| 5. Judgement | pass | The reader can state exactly what commits together, distinguish claim completion from receiver deduplication, choose an enforceable fence scope, and recognise an unresolved external effect without a replay contract. |
| 6. Gradual exposure | pass | The worker protocol answers its own authority questions; primary failover fencing, change streams, capacity and external provider contracts remain distinct deeper subjects. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial assignment. |

Coherent-learning judgement: coherent at its entry. Moving the network call after the short claim is followed immediately by how to confirm or lose that claim. The A/B failure schedule then demonstrates why conditional completion does not itself prevent another external call, earning the receiver contract and fencing distinction. The inbox reuses the already-prepared unique-insert/fresh-lookup reasoning rather than requiring the reader to discover a second concurrency protocol.

Evidence read: atomic-intention drawing and event insertion; all worker ownership fields; claim SQL, uncertain-claim ownership paragraph and SKIP LOCKED interpretation; conditional completion; all five static failure stages; receiver contract and accepted-versus-delivered distinction; consumer receipt/effect counterexamples; scope and limits of fencing; recoverability, ordering and retention discussion; complete local receiver-stand-in limitations and Sources disclosure.

Findings: none.

## Limits

This is teaching assessment, not technical, native-execution, visual/accessibility or production-safety certification. Native observations and provider references were read as the article's disclosed evidence and scope; no source, mechanical receipt, external verification or native test was used. No rendered unassigned neighbour was required to pass an article whose local explanation supplies the relevant distinction.

All assigned rendered prose, SQL, tables, figures, scripted state text and final disclosures were read. The existing browser viewport and theme were unchanged. Drawings were inspected for their explanatory role, not across device/theme/control combinations as an independent visual review. Full reference calibration is shared across this single eight-piece assignment. No coordinator-named additions were supplied, so check 7 is explicitly inapplicable for each piece rather than waived.
