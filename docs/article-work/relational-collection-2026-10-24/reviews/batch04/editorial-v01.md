# Editorial review · article mode · r14, r16, r17 · batch04-v01

Fresh independent initial editorial assignment. Highest severity: **low**. No coordinator additions were supplied.

## Inputs and calibration

- Assignment: `reviews/batches03-04-editorial-assignment.txt`; current `staycurrent-review/SKILL.md` and only `perspectives/editorial.md`.
- Fixed identity: `reviews/batch04/v01/manifest.json`, version `batch04-v01`, frozen 24 October 2026 at 01:58:49 UTC; finished routes at **4408**. Used manifest identity metadata, not the contents of its listed source/context/mechanical files.
- Audience: `reviews/batch04/v01/audience.md`: intelligent engineers familiar with requests and stored data, with the starting knowledge stated per piece below.
- Complete common calibration for this single eight-piece assignment: all 19 separate bounded reference deliveries (sequences 1–6, indexes 1–7, storage 1–6), each with a 5,000-token output budget and END marker; all 34 rendered drawings with their explanations at **4350** (13 sequence, 11 index and 10 storage drawings). Incomplete screenshot clips were recovered. Completion was messaged to the coordinator. The same calibration serves `batch03/editorial-v01.md`.
- Read all three complete rendered articles, code, tables, figures, controls and every scripted-state text. Read final Sources disclosures separately outside the main article DOM. Rendered collection navigation was exposed; no linked plan, plan brief or other article was followed.
- Withheld: source, context/plans, mechanical records, writer notes, approvals, decisions, earlier versions, findings and repair history. Did not read live4368 or later source. No builds, source changes, downloads or publication.

## r14 · Locks, contention and deadlocks

Input: [frozen rendered article](http://localhost:4408/review/relational-collection/locks-and-deadlocks/). Starting knowledge: transaction snapshots and the class capacity rule. Read all five states of each of the three guard protocols, the schedule text alternative, static deadlock figure and final Sources disclosure.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Clear title; headings organise locking around authority, visibility and cycles rather than isolated syntax. |
| 2. Plain sentences | pass | The distinction between taking a turn and seeing prior work is precise and sustained. |
| 3. Terms | pass | Row locks, guard, lock modes, contention and deadlock are explained in the concrete booking/purchase setting. Error codes appear with their meanings. |
| 4. Openings | pass | The opening explains both why waiting helps and why locking the wrong authority or view remains unsafe. |
| 5. Reader-facing text only | pass | Schedules and evidence limits are relevant to interpreting the mechanisms; no editing history appears. |
| 6. Captions and labels | pass | Protocol choices name both the guard action and isolation. States separately label committed bookings and Tariq's view; deadlock arrows explicitly mean waiting. |
| 7. One piece | pass | The empty-row failure leads to a guard, then to snapshot conditions, queue scope and cycle handling. Each qualification changes the protocol at hand. |

### Whole-piece judgement

This meets the reference standard. “The protocol is ‘acquire, then count in a new statement, then decide’” is earned through the empty-booking counterexample and the two statements. The unchanged guard under Repeatable Read then exposes why coordination and visibility are different, rather than merely listing isolation anomalies. The subsequent guard-epoch alternative uses the same class and leads directly to a complete retry. Queue scope and deadlock ordering widen the practical judgement while retaining named authorities. The final blocker-reading section returns diagnosis to the transaction holding the resource, so the piece closes with a usable line of reasoning rather than a list of settings.

### Findings

None.

### Limits

I did not independently verify locking modes, isolation outcomes, timeout scope, observed schedules or diagnostic SQL. Reading all control states is not a visual, accessibility or mechanical certification.

## r16 · Retries when a commit reply is missing

Input: [frozen rendered article](http://localhost:4408/review/relational-collection/conflicts-and-retries/). Starting knowledge: transactions, unique keys and application connection ownership. Read both static missing-reply histories, all five states of both resolution histories, text alternative and final Sources disclosure.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title states the actual uncertain event; headings follow identity, commit, classification and lifetime. |
| 2. Plain sentences | pass | Request identity, attempt identity and stored order identity are distinguished in connected prose. |
| 3. Terms | pass | Normalised payload/fingerprint, deferred reference and SQLSTATE are introduced with their jobs and meanings. |
| 4. Openings | pass | Both possible server histories and the difference from an explicit failure are established before the retry protocol. |
| 5. Reader-facing text only | finding | “Explanation-owned” describes production of the article rather than a schema property; low finding editorial-1. |
| 6. Captions and labels | pass | Histories make the caller's identical observation explicit. Resolution captions distinguish what the reader sees from what the caller can know. |
| 7. One piece | pass | The missing mug after a successful but unheard commit creates the need for identity; concurrency, error classification and retention develop that need without interrupting it. |

### Whole-piece judgement

This can sit beside the references; the low wording issue does not compromise the argument. “Reporting ‘out of stock’ would lose Mina's successful purchase even if a primary key prevented a duplicate order” makes the problem much more concrete than a generic duplicate-request warning. The protocol then explains why a subsequent statement is needed after the possibly waiting insertion, and why a healthy connection or an earlier absence query cannot resolve ownership. The lifetime section extends the same identity across caller restart, server retention and recovery. The choice not to retain refusals is explicitly described as a contract, preserving the distinction between a failed attempt and a remembered terminal result.

### Findings

#### editorial-1 · low · r16 · Commit the identity with the purchase

Problem: “Add an explanation-owned purchase_requests relation” uses an editorial ownership label as though it were a reader-facing schema property.

Effect: The reader must infer whether this means a temporary demonstration table, a particular write authority or simply a table added for this example. The next sentence already gives the useful meaning of a row.

Suggestion: Name it as the example's additional relation, or state the actual ownership property if one is intended. Let the existing row-meaning sentence do the explanatory work.

Evidence: [Commit the identity with the purchase](http://localhost:4408/review/relational-collection/conflicts-and-retries/#commit-the-identity-with-the-purchase), immediately before the `purchase_requests` declaration.

### Limits

No independent checking of uniqueness waiting, deferred references, driver behaviour, acknowledgement fault injection, durability or native evidence. Every displayed state and final source note was read. This report does not certify implementation or visual behaviour.

## r17 · Outboxes and database-backed jobs

Input: [frozen rendered article](http://localhost:4408/review/relational-collection/outboxes-and-jobs/). Starting knowledge: transactions, uncertain outcomes and lock/claim reasoning before recoverable worker protocols. Read both complete static figures, all code and tables, and the final Sources disclosure. There are no scripted figure controls or additional figure-state disclosures on this piece.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title is clear; headings track the sequence from intention through claim, completion, receiver and recovery. |
| 2. Plain sentences | pass | Claim generation, effect identity and receiver authority are precise and kept distinct. |
| 3. Terms | pass | Outbox, lease, claim token, inbox and fence are each explained through the concrete failure they address. |
| 4. Openings | pass | The opening establishes which failure gap the atomic outbox closes and which repeated-effect gap remains. |
| 5. Reader-facing text only | finding | “Explanation-owned outbox schema” is a production-facing modifier with no defined database meaning; low finding editorial-1. |
| 6. Captions and labels | pass | The first caption names the transaction boundary; the second names one event's two claim generations and unchanged effect identity. |
| 7. One piece | pass | Paused A, expired lease and recovering B carry the argument into deduplication and fencing. Necessary scope limits occur where they affect the guarantee. |

### Whole-piece judgement

This meets the reference standard apart from optional local polish. The paused-worker schedule makes “expiry permits recovery; it does not stop A” intelligible before fencing is introduced. “A new claim token must not become a new effect identity” then follows directly from B recovering the same job. The inbox section develops atomic receipt/effect handling through both failure gaps, and the fencing section explicitly explains why an older-owner test does not itself deduplicate an effect. That distinction is substantial and presented economically. Retention, ordering and restore finish the same recoverability argument; they do not read as unrelated cautionary additions.

### Findings

#### editorial-1 · low · r17 · Claim work briefly

Problem: “Our explanation-owned outbox schema” names how the example was produced rather than a property readers can apply to its schema or ownership protocol.

Effect: The modifier briefly obscures the otherwise concrete introduction of the outbox's identity, reference and payload. The reader has to discard it or invent a meaning.

Suggestion: Introduce this as the example's outbox schema and retain the following concrete field descriptions.

Evidence: [Claim work briefly](http://localhost:4408/review/relational-collection/outboxes-and-jobs/#claim-work-briefly), immediately before the five-field protocol table.

### Limits

No independent technical verification of claim SQL, clock behaviour, lease resolution, fencing, inbox protocols, receiver stand-in or provider contracts. The article's own limits are explicit and were read; this review does not establish the underlying results or visual fitness.

## Assignment limits and delivery

No substantive editorial failure or article-wide failure was found in these three pieces. Both findings are optional local polish under reader-facing-text check 5. Their parallel wording is recorded separately because this assignment requires per-piece findings numbered from editorial-1. They may share a coordinator decision without losing those labels. No claim of practitioner, teaching or visual certification is made. Reports do not authorise publication. The sole temporary browser tab used for this eight-piece assignment was closed on completion; user tabs were untouched.
