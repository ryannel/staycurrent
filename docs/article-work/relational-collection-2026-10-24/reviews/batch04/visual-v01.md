# Visual review · article mode · r14, r16, r17 · batch04-v01

Inputs read: [frozen manifest](v01/manifest.json); the complete rendered articles and their isolated examples at `127.0.0.1:4408/review/relational-collection/`; the current visual perspective and figures/render-check guidance; applicable frozen mechanical render and contrast records. Each article's final Sources disclosure was expanded and read, including material outside its article element. Source, plans, context, author notes, earlier versions and reviews were withheld and not consulted.

Highest severity: none.

This is a fresh initial visual perspective on these three complete articles, alongside a separate report for the two articles in batch05-v01. It is not corpus coverage.

## Reference calibration

Before judging the pieces, I studied the rendered reference explanations on port 4350: all 13 numbered Sequence diagrams figures, all 11 Indexes figures and all 10 Storage and durability figures, together with their teaching passages and comparison tables. This included the notation table, index depth/engine/query comparisons and storage/commit/authority comparisons. Tall or initially clipped views were recovered with ordinary viewport scrolling. The calibration covered named lifelines and messages; meaningful alternatives and counters; explicit page/key relationships; memory/disk and transaction boundaries; worked numbers distinguished from observations; and text alternatives beside players. Reference calibration was through rendered pages, not reference source.

## Checks

| Piece · check | Result | Observation |
| --- | --- | --- |
| r14 · 1. First reading alone | Pass | Both figures and all six SQL examples were read on the isolated route before article prose; all three guard protocols were used. |
| r14 · 2. Form fits content | Pass | Guard ownership, committed bookings and each buyer's permitted view are separate labelled areas. The deadlock drawing names both held and wanted products and both directed waits. These are states and dependencies rather than disguised relational tables. |
| r14 · 3. Readable at a glance | Pass | Capacity, booking IDs, counts, snapshot descriptions and final refusals/overbooking remain explicit. SQL preserves statement order and breaks the important acquire/count boundary into separate statements. |
| r14 · 4. Interaction | Pass | All 15 states across three options agreed with their explanations. Play, Pause, Back, Next, Reset, Replay, the native selector and expanded schedule alternative were used. Keyboard arrival at the first state retained Back focus; arrival at the last retained Next focus. Keyboard selection changed the protocol. |
| r14 · 5. Themes and phones | Pass | Actual 1280×720 and 375×812 views in light/dark. Cards stack and deadlock arrows change to vertical directions. The final summary and controls remain readable together. Document width stayed 375; both figures stayed within 343 px. Relevant text and arrows meet the contrast thresholds described below. |
| r16 · 1. First reading alone | Pass | Two figures, three SQL examples and the outcome/action table were read alone before prose. Both retry histories were stepped through. |
| r16 · 2. Form fits content | Pass | Parallel histories make the identical caller observation easy to compare. The player separates caller knowledge, committed database state and the request record; the final table maps results to decisions. |
| r16 · 3. Readable at a glance | Pass | The same request key and payload persist visibly. Committed stock stays distinct from uncommitted work, and the recorded order is connected to its key with an arrow. Short SQL excerpts have labelled purposes and a readable branch order in context. |
| r16 · 4. Interaction | Pass | All 10 states across two histories agreed with their explanations, including unchanged committed stock during the uncommitted retry. All player controls, Replay, selector and text alternative were used. Keyboard endpoints retained Back/Next focus. Playback progressed and Pause held a changed state. |
| r16 · 5. Themes and phones | Pass | Actual desktop/375 px, light/dark views checked. Histories and caller/database panels stack; the request record, explanation and controls remain understandable. The decision table wraps within 343 px. No document overflow; text contrast passes. |
| r17 · 1. First reading alone | Pass | Both static figures, the field table and all four SQL examples were inspected before prose. |
| r17 · 2. Form fits content | Pass | A bounded transaction group and later worker/receiver boxes show the commit boundary. The numbered lease schedule suits the one chosen failure history. Field meanings and SQL make the protocol's separate identities explicit. |
| r17 · 3. Readable at a glance | Pass | Event identity stays stable while claim generations change from 1 to 2. Acceptance, completion and end-user delivery are visibly distinguished. The claim and guarded completion SQL have clear ordering and labelled conditions. |
| r17 · 4. Interaction | Pass / static | These figures have no article-owned controls or automatic playback. Their captions, sequence and nearby explanations agree. There is no player or keyboard endpoint to test. |
| r17 · 5. Themes and phones | Pass | Actual desktop/375 px, light/dark views checked. The external-work arrow becomes downward; the five numbered rows remain readable in order. The field table and figures fit the phone. No document overflow; text, arrows and meaningful outlines pass contrast. |

## First reading

These are the meanings recorded from the isolated examples before the prose reading.

### r14 · Locks, contention and deadlocks

- **SQL: Read a product while reserving its turn.** A transaction locks P7, makes a stock decision, then commits. The comments mark deliberately omitted purchase work; the block alone does not implement it.
- **SQL: A locking query that cannot protect an empty class.** It locks matching booking rows for S501. The heading makes the empty-result limitation the intended question.
- **SQL: Count in a separate statement after acquiring the Read Committed guard.** Lock the session, count its bookings, refuse or insert B201, then commit. Separate statements make the order visible.
- **Figure 1: A turn at the guard, and a view of the bookings.** Two buyers share S501 with capacity 1. The committed booking set and Tariq's snapshot are separate. Read Committed ends at one booking and a refusal; lock-only Repeatable Read can end at two bookings; updating the guard produces an abort followed by a new attempt and refusal. It explicitly presents a chosen schedule, not live SQL. Before prose, the reason a lock can coexist with an old count was the question the comparison raised; the state labels themselves were clear.
- **SQL: Make Repeatable Read decisions conflict on a changed guard.** Increment a guard marker before the count and restart the entire operation on 40001. The marker's exact schema is supplied by the later contextual reading.
- **SQL: Choose operation-specific limits inside the transaction.** Two locally scoped time limits, one for locks and one for the statement; units are explicit.
- **Figure 2: Two waits close a cycle.** A holds P3 and wants P7; B holds P7 and wants P3. The two arrows name reciprocal dependencies, so a cycle rather than merely a long wait is apparent.
- **SQL: Find waiting sessions and their direct blockers.** A diagnostic listing of waiting sessions, their transaction starts and immediate blocker IDs; it is visibly a query rather than a diagram of inferred causation.

### r16 · Retries when a commit reply is missing

- **Figure 1: The caller sees the same thing.** The left history aborts and the right commits, but both end at “Caller: no success reply”. The database outcomes remain different underneath. No timing measurement is implied.
- **SQL: A request record whose outcome must reference an order.** A request key owns one payload and a required resulting order. The deferred reference suggests the referenced order may be inserted later in the same transaction; prose later explains why.
- **SQL: Try to own this logical purchase.** Insert the request identity and learn whether this attempt inserted it. The shown fragment intentionally begins rather than finishes the transaction.
- **SQL: Read the existing result and compare its payload.** Read the old outcome, accept matching input, reject changed input and avoid taking stock on the replay branch.
- **Figure 2: The same request finds either outcome safely.** The same key survives a missing reply. A committed first attempt returns its old order without a second deduction. An aborted first attempt permits uncommitted purchase work and then one combined commit. The stock vector changes only when a purchase commits. Reader knowledge of the chosen database history is explicitly wider than caller knowledge.
- **Table: What the application knows, and what it may do next.** A three-column decision guide. A known abort, application refusal and uncertain commit lead to different actions; the row labels are readable without decoding colour.

### r17 · Outboxes and database-backed jobs

- **Figure 1: What commits together, and what happens later.** Stock, order/lines and outbox intention share one transaction. Worker and receiver are outside it; “later” does not promise a delivery time or receipt by Mina.
- **SQL: Insert the intention before the purchase commits.** One event ID names order 103 inside its purchase transaction. The comments state the surrounding work rather than pretending this is the whole purchase.
- **Table: Fields used by this worker protocol.** Scheduling time, lease deadline, generation, attempt count and completion time have separate meanings.
- **SQL: Claim at most one eligible event in a short PostgreSQL transaction.** Select one available unfinished event under a lock, update its deadline and generation, return the claim and commit before external work.
- **SQL: Complete only the current, unexpired generation.** Completion is conditional on event ID, token, lease and unfinished status; it is not an unconditional done flag.
- **Figure 2: Expiry permits recovery; it does not stop A.** A's external effect can precede its pause; expiry lets B obtain token 2, while A can still resume. The generation protects local completion, whereas a stable external identity handles the repeat. All five stages and the limit on expiry are explicit.
- **SQL: A receipt and local change belong to one consumer transaction.** Insert the inbox receipt, perform a local effect only for a new receipt, compare a replay and commit together. The comments distinguish this protocol excerpt from complete application code.

## Findings

None. The complete contextual readings resolved the expected questions about guard snapshots, request ownership and omitted schema/purchase work without changing the apparent visual meaning.

## Evidence and limits

- Independent [manual state records](../visual-v01-evidence/states.json) cover all 15 r14 and 10 r16 states; the schedule and resolution text alternatives were expanded and read. Controls were exercised in the rendered browser, not inferred from a receipt.
- [Page-clock observations](../visual-v01-evidence/playback.json): r14 advanced from 1/5 to 4/5 in a bounded 25.6-second observation. A changed 2/5 explanation stayed present for 4.53 seconds; after Pause it stayed at 2/5 through a further 4.5-second observation. r16 progressed through 1, 2, 3 and 4; a changed 2/5 explanation held for 4.51 seconds and remained unchanged through another 4.5-second observation after Pause. Another paused r16 state held for 18.6 seconds. These observations support readable holds and working Pause; they do not measure every automatic interval in every option. Background panes can throttle animation. `performance` was unavailable in the read-only evaluator; browser `Date.now()` supplied the clock.
- Phone captures: [r14 overbooking](../visual-v01-evidence/r14-phone-dark.png), [r16 uncommitted resolution](../visual-v01-evidence/r16-phone-dark.png), [r17 transaction boundary](../visual-v01-evidence/r17-phone-dark.png). These are selected evidence, not a substitute for the other inspected states/themes.
- Rendered colour samples matched the frozen common palette. Main/secondary text on the surface is about 15.00:1/6.61:1 in light and 12.10:1/6.83:1 in dark. The applicable surface-alt minima are 13.73:1/6.05:1 and 10.89:1/6.15:1; accent outlines remain at least 5.52:1. This covers captions, snapshot text, warnings and meaningful arrows/outlines. See [direct style samples](../visual-v01-evidence/contrast-styles.json), [r14 frozen contrast values](v01/mechanical/r14/contrast.json) and the common stylesheet identities in the manifest. These mechanical values support contrast only, not teaching quality.
- All four current rendered download links for this batch returned HTTP 200 and byte hashes matching the frozen manifest: [bounded HTTP record](../visual-v01-evidence/download-http.json). Browser saving was not attempted or verified. Native SQL was not rerun for this visual perspective; the figures disclose their illustrative status and the article separately identifies its native experiments.
- Longer SQL scrolls locally on phones. The articles themselves remained 375 px wide. No source inspection, content editing, build, delegation or publication occurred.
- [Restoration record](../visual-v01-evidence/restored.json): actual 1280×720 restored, System selected on both frozen origins, viewport override reset and only the three reviewer-created temporary tabs closed. Global viewport lease released.
