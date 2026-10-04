# Sequential first-reading notes: Isolation, then waits and retries

Audience: intelligent developer familiar with tables, basic SQL, commit/rollback, conditional updates and row locks, learning isolation and recovery. Only the two supplied reading/voice references and numbered displayed sections inform this reading. No rendered inspection so far: medium observations based on extracted text remain provisional.

## Isolation 00 — opening (recorded before 01)

Working well: “what happens when the writer commits while a reader is still working?” gives isolation a concrete unanswered job after atomic commit. Summary and details disagreeing establishes why repeated reads matter without requiring terminology. The final paragraph promises a sensible progression from reading to decisions plus writes. PostgreSQL scope is explicit.

Question carried forward: which instant determines the query’s view if a writer commits during that query? The opening raises this naturally and has not yet needed the answer. I already know snapshot machinery; I will look for the explanation rather than supply it silently. No repair indicated yet.

## Isolation 01 — A view of committed data (before 02)

Opening question resolved: “If the writer commits after a query begins, the query can finish using its earlier view” supplies the boundary at the moment I need it. “Visibility information,” followed by “not an exported copy,” prevents a misleading mental model of physically copying a table. Retained old versions provide sufficient mechanism for the claim.

Effort: I picture the old committed record remaining available beside the replacement and a reader choosing one version. This is modest and the prose supports it; no evidence yet that a separate illustration is needed. Curiosity for later reading: how are old versions eventually reclaimed, and can a long report delay that? This is outside the present isolation choice, not missing prerequisite explanation.

The ordinary SELECT scope is useful because the audience knows row locks. I now expect the promised return to locking reads; no confusion from deferring it here.

## Isolation 02 — Statement and transaction views (before 03)

Working well: “Both answers describe committed data. What changed was the moment being described” answers the likely objection that a changed answer somehow violates commit. The two isolation levels, prices, and writer commit stay in one example. The existing experiment arrives where I am picturing the event order; its “committed product row” versus “returned to the report” distinction targets the actual conceptual work. Preserve this aid rather than add a duplicate timeline. No browser verification of its layout or behaviour was performed.

Effort: executing the SQL requires returning from the first report block to the separate writer block, then back to the second SELECT in the first block. The comments and final execution paragraph fully explain this, but I still have to retain the paused point while scanning. The existing event model is relevant support, not proof this is a serious problem. Possible small repair, if observed in use: align the two connection blocks with the same three event numbers as the experiment. Not a need for a second interaction.

Questions I would test: what if the writer commits after BEGIN but before the report’s first SELECT; what if it commits before the first read or after the second? The “first query ... not at BEGIN” answer is stated and sufficient, but the fixed schedule cannot test that particular misconception. This is an extension opportunity for the existing model, not a comprehension blocker or automatic request for a new tool.

Minor first reaction: O12/EUR 18 in “What this model shows” initially feels unrelated to understanding two price reads. It is explicitly declared unrelated and the practice schema paragraph later says historical orders are loaded too. This resolves the reference enough; it is still an optional distraction for a direct entrant and could be omitted from the model scope note if unused here.

The single-SELECT/join paragraph does useful boundary work: it answers whether every report needs Repeatable Read. “READ ONLY prevents ... changing ordinary application tables” explains the added code clause promptly. No unresolved fundamental gap.

## Isolation 03 — The view does not freeze the database (before 04)

Working well: “stable against later changes committed by other transactions” gives a precise correction to the intuitive but overbroad “frozen database” picture. The 20→21 own-write SQL is short and has both expected results plus rollback. “Selected by its unchanged product ID” keeps the later rejection example focused on row version change rather than a changing predicate. The locking-read promise from 01 is now fulfilled with an explicit Read Committed/Repeatable Read contrast.

Effort/opportunity: at “Suppose a Repeatable Read transaction has seen P7 at 20, then another transaction changes P7 and commits,” I mentally reuse the preceding experiment, insert an UPDATE by the report after event three, and branch from seeing 20 to receiving failure. The text supplies all causal steps, so this is not a missing explanation. It is a useful extension question for the existing aid: why can I still SELECT 20 but fail to UPDATE that very row? A compact comparison using the existing sequence could make the connection visible. Do not add a parallel aid simply to repeat the own-write example, which already has sufficient support.

Question carried forward: “serialization failure” names an error before “serializable” isolation has been introduced. I can infer that the whole attempt fails, and restart instruction is clear, but a learner might equate this error exclusively with an isolation level. Watch whether later explanation resolves this naming collision. No need for a terminology digression yet.

## Isolation 04 — A stable view can support conflicting decisions (before 05)

Working well: the display rule is explicitly separated from inventory so I do not have to reinterpret “hide” as delete or decrement. The A/B paragraph and existing aid explain the cross-row relationship exactly where I begin mentally pairing “reads P8 / writes P7” and “reads P7 / writes P8.” The aid’s serial-order counterfactual makes “both disabled” wrong for a reason beyond the declared business rule. Preserve that reasoning and aid. Text-only inspection cannot establish whether its visual arrows/grouping make the pairing effortless.

Effort: the SQL adds EXISTS syntax and swaps IDs in the second transaction, but the immediate explanation handles EXISTS and boolean shorthand. The final same-row versus other-row distinction answers my main question: why doesn’t the guarded UPDATE technique already learned solve this too? This is well placed after the code shows the apparent solution.

Interactive curiosity: if B begins early but first queries only after A commits, does the bad result disappear; if only one transaction uses Serializable, is the rule safe? The former tests snapshot timing already taught; the latter anticipates whether stronger isolation must be shared by every writer. These are not missing prerequisites to understand the shown failure. Existing diagram already explains the basic outcome, so a new interaction requires a useful variable such as read timing or isolation choice, not simply an “advance” version of the drawing.

Carry forward: the aid introduces Serializable as rejecting one transaction, before the next heading likely explains it. That is natural anticipation. The earlier “serialization failure” naming question remains pending.

## Isolation 05 — Serializable and the rejected transaction (before 06)

Working well: “some one-at-a-time order” plus “need not literally run ... in sequence” gives the guarantee without implying a global queue. Reusing the display decision means only the isolation level changes. Most valuable sentence pair: “That is a successful evaluation of the rule, even though B did not get its original wish” and the warning against retrying only “set P8 disabled.” It makes rerunning reasoning concrete rather than a generic retry slogan.

Resolution of participation question: “With both transactions using Serializable” and “Every path ... must participate” answer it. The unconditional writer counterexample also establishes that the database cannot invent missing application logic.

Meaningful effort opportunity: the final paragraph introduces a third, absent “display-control record,” a common lock, the timing of the subsequent flag read, and a contrast with Repeatable Read in one pass. I supply from expertise that both different-row decisions now contend on a shared row, and that the lock’s serial order is useful only if B then reads A’s committed flag change. The paragraph states those steps, but I must reconstruct the sequence and new row alongside the previous cross-row picture. This is the strongest local support opportunity so far: either integrate a short common-control-row variant into the existing display illustration, or give a brief step sequence with B waiting then reading the remaining flag. A separate substantial article could answer “How do I choose a shared lock record for a rule spread across rows, including every writer?” The essential fresh-read-after-lock reasoning must remain here if this option remains.

Earlier naming curiosity partly remains: Repeatable Read and Serializable can both produce a “serialization failure,” while the latter has a stronger guarantee. Their behaviours are separately explained, so this is not a blocker. A short reminder later could prevent tying the error name to only one level.

## Isolation 06 — Choose the view and the rule together (before 07)

Working well: the two decision questions (must reads agree; what could invalidate the write) compress the article without introducing another taxonomy. The summary preserves the distinction between a reliable read and coordinated changes. The next article’s possible endings are motivated by the rejected-attempt discussion rather than dropped in as navigation.

No fresh confusion. Whole-transaction retry now has enough concrete explanation to follow the next article. Common-lock option remains understandable but comparatively compressed; the choice paragraph repeats it without relieving the mental reconstruction noted in 05.

## Isolation 07 — Sources and further reading (before next article)

Working well: validation provenance distinguishes single-session execution from overlapping outcomes derived from documented rules. “Explicit locking” is a relevant external destination for the coordination curiosity; it does not itself supply the missing visualization of the common-control-row variant.

First-reading assessment so far: no fundamental explanation gap. The main useful repair candidate is support for the common-lock alternative; the main existing-interaction extension is testing the first-query/BEGIN boundary or a later write against the preserved read view. These are distinct opportunities and do not establish a need to implement all of them. Snapshot cleanup is optional deeper-reading curiosity. Serialization-failure naming is a minor unresolved terminology observation.

## Waits 00 — opening (before 01)

Working well: the contrast between repeated reads and repeated purchases gives a concrete cost to an otherwise abstract error classification. “Still running / rolled back / may already have committed” is a useful set of questions I can hold while reading. The shop reminder says what one purchase contains, enough for an entrant without reopening an earlier article.

Question carried forward: from the client’s error or timeout, how can I actually tell these cases apart? The opening explicitly promises this distinction, so this is expected curiosity, not a gap yet.

## Waits 01 — A wait is still part of an attempt (before 02)

Working well: buying two when only one remains turns “no row updated” into a business result, echoing the isolation article’s successful evaluation without desired change. The distinction between sending cancellation and server confirmation supplies an essential step I would otherwise import from expertise. The following paragraph ties confirmed cancellation to ROLLBACK and broken connection to discard; it does not leave the programmer at an abstract warning.

Opening diagnostic question partly answered: a deadline by itself supplies no outcome, while confirmed server cancellation gives actionable information. Unknown COMMIT explicitly points forward. No gap yet.

Effort: I mentally track a request deadline, cancellation in transit, and command completion racing one another. The prose is clear, but the distinction can be counterintuitive because “my request timed out” sounds final. Potential exploration question: what changes when cancellation reaches the server just before versus just after completion, and what does the client actually know in each case? Hold this observation until seeing the promised recovery section; a later existing aid may already serve it. No immediate medium prescription.

## Waits 02 — When waits form a cycle (before 03)

Working well: “release only when it can finish” explains why patience cannot solve this wait. The existing dependency illustration arrives at the correct point for holding A/P7 and B/P8 in mind. Its note that the victim is unpredictable prevents reading layout as scheduler policy. The sorted-order paragraph supplies the missing causal step in the prevention advice: B waits before it can claim P8. That is sufficient without inventing a second diagram.

Question I'd explore: switching B’s acquisition order from P8→P7 to P7→P8, which exact wait edge never forms? The text already answers it, so an optional alternate state in the existing aid could help compare; it is not necessary to follow the argument. More substantial later-reading question: how do I find inconsistent lock orders spread over multiple tables/code paths? The article explicitly limits its two-row demonstration, keeping this as appropriate further investigation.

The code is an inspection example and explicitly rolls back; the prose says what a real purchase must add. This avoids mistaken copy/paste purchase logic. No consequential unresolved question at this point.

## Waits 03 — Retry the decision, not the last statement (before 04)

Resolved earlier Isolation 03/05 terminology question: the first paragraph explicitly says both Repeatable Read and Serializable can produce 40001 and distinguishes the reasons. No repair now needed beyond potentially a small reminder in the earlier article for readers who stop there.

Working well: reserving mugs before failure on bowls makes whole-transaction retry concrete: the prior mug reservation no longer exists. “Another evaluation of the same intent” provides the broader reason without implying the old answer must recur. Cleanup, codes, bounded attempts, and delaying outside the transaction are all tied to purposes.

First reaction to code: operation_id/original_request.checkout_token and persistence across process restarts arrive before their mechanism has been taught. I know this will identify duplicate attempts, but the intended reader has only the opening warning about duplicate purchases. recover_same_operation is likewise a forward placeholder. This is not yet a blocker because the control-flow purpose is clear and the next sections promise unknown commit recovery; record whether the later material makes this pseudocode understandable without excessive backtracking.

Effort: I now hold three branches (retryable database rejection, unknown commit, other failures) plus cleanup policy. The compact pseudocode is useful support for those distinctions; duplicating it in a flowchart might add more navigation rather than clarity. Diagnostic curiosity from 00 is substantially answered for 40001/40P01.

## Waits 04 — A missing commit reply leaves another question (before 05)

Working well: the two alternative histories plus identical client knowledge are exactly the relationship I need to picture. The existing aid addresses the broader racing-events concern noted in 01, although it is specifically about commit rather than cancellation. It makes silence insufficient evidence without suggesting the user should guess. “A new key would describe another operation” connects identity to duplicate effects before implementation arrives.

Pending code question advances: K14 shows what operation_id means; now I want to know where the key is saved, what it must be unique among, and how it survives the very rollback it is supposed to distinguish. Those are expected next-section questions. The phrase “stable key and database uniqueness” describes the mechanism only at headline level so far.

No additional diagram indicated from this reading. A useful exploration would hide the true database outcome and ask which action remains safe under either history; however, the existing two-history illustration already teaches the key point. Any interaction should expose a new recovery decision rather than animate the lost reply for its own sake.

## Waits 05 — Give the checkout an identity that survives attempts (before 06)

Resolved earlier operation_id questions: the first two paragraphs distinguish K14 from O14/O15 and place persistence with the caller/pending-work store; uniqueness lives on orders.operation_id. “A rollback removes all four consequences” explains that the database identity record is deliberately transactional, while the caller’s key persists independently. This is conceptually strong and the text supplies it; I did need to combine the opening persistence paragraph with the later atomic-commit paragraph to see both lifetimes.

Working well: each SQL fragment is followed by the meaning of returned/no-returned row. The “must not ... commit” instruction is earned by the provisional-order explanation. The final pseudocode assembles the scattered branches and checks. The key-binding paragraph prevents the seductive but wrong belief that matching a random token proves matching intent. Reject/renegotiate agreed price also resolves the tension between fresh reads and preserving the same customer intention.

Meaningful effort opportunity: by the lookup I am tracking K14 (durable intent), proposed O14/O15 (attempt choice), available stock 3→1, insertion/no-insertion branches, and whether the row is provisional or committed. I have to reconstruct that a duplicate returns the already stored O14 even if a new attempt proposed O15 and never reserves again. The final pseudocode resolves the sequence, but it arrives after several SQL blocks. Possible repair: move an abbreviated branch overview before the fragments, or add a compact result trace for first attempt versus repeated K14. It should show the key, actual order, stock and return value; another network diagram would miss the burden. The existing two-history aid could point to this trace, but it is solving a different relationship.

Question carried forward: what if the old transaction is still in progress when I try the INSERT or lookup? “No returned row means that key already has an order” presently sounds committed/existing, but I know uniqueness may wait on an uncommitted insertion. The next recovery section is expected to answer it. I also wonder whether an empty lookup proves it is safe to issue a new purchase; this is the core missing outcome question, not optional deeper curiosity.

Potential useful deeper article: how to define and retain operation identity for larger carts and changing offers, including what comparison remains valid when records change or keys expire. The current one-product example does not need that design expanded here; it already flags complete-intent matching.

## Waits 06 — Recover before creating another operation (before 07)

Resolved important question from 05: absence is not conclusive while the first transaction may be finishing; repeat the claim using K14, let uniqueness wait, then either read the committed order using a fresh statement view or proceed after rollback. The answer is present and causally complete. “A subsequent Read Committed SELECT” also pays off the isolation article’s statement-view teaching. This is good sequence across the two articles.

Strongest exploration opportunity in this article: the paragraph beginning “Not finding it yet is not conclusive” compresses three timings (old attempt pending, commits, rolls back) and two observations (initial lookup empty, claim returns/no row). I mentally run a small state machine to verify that zero orders observed can still lead to reuse of an old order without duplicate stock reduction. The current missing-answer aid has two completed histories; it does not show the still-finishing branch or the claim waiting. A useful extension could let me select the original attempt’s eventual outcome and follow lookup→same-key claim→fresh read/record, showing order count and stock. This observation supports improving/extending the existing recovery aid rather than automatically adding another. A short static three-case table could be sufficient. Essential textual reasoning is already here.

Working well: “keep the outcome pending” gives a truthful application state under unavailable evidence, and “retry budget ... does not establish ... failed” closes a common logical gap. External payment and durable work record paragraphs state the boundary without pretending that an operation key produces cross-service atomicity.

Deeper-reading question: how does a worker record delivery progress and a receiver suppress duplicates when order commit succeeds but the external action’s acknowledgement is lost? This merits a separate worked mechanism if planned; expanding it here would distract from local recovery. The link to transaction boundaries explains the boundary, not necessarily that later operational design.

## Waits 07 — Sources and further reading

The provenance note keeps demonstrated local SQL separate from illustrative concurrent/lost-reply schedules. Sources are attached to the distinct implementation questions. No unresolved comprehension blocker after the sequential reading.

# Synthesis: observations separate from possible repairs

This reading used the supplied extracted displayed sections only. I did not inspect rendered pages, layout, animation or control behaviour. All medium observations are provisional. I have not read histories, briefs, other reviewers or external sources, and have not edited the repository.

## Most meaningful opportunities

1. **Recovery while the original attempt is still finishing.** Trigger: Waits 06, “Not finding it yet is not conclusive,” through the fresh SELECT/rollback alternatives. The reader must combine an empty lookup with a potentially pending insert and predict the consequence of attempting the same key. The prose answers the question, but there is meaningful state-tracking effort. The existing missing-reply illustration shows two finished histories; it could be extended or followed by a small outcome trace for pending→commit versus pending→rollback, showing order and stock consequences. A static table may suffice; if interactive, the worthwhile input is the original attempt’s eventual outcome, not merely time advancing. This is the highest-value exploration question I encountered.

2. **Lifetime of identity and the inserted/duplicate branches.** Trigger: Waits 05 from “distinct from an order ID” through “A repeated attempt at K14 returns this order.” I track persistent K14, attempted O14/O15, transactional order/key/stock/line changes, and eventual returned order. The full pseudocode eventually assembles the steps well. Consider an earlier abbreviated branch overview or a compact trace (first checkout creates O14 and stock 1; same K14 returns O14 and leaves stock 1; rollback retains caller key but no committed order). This is support for the existing complete text, not evidence of missing correctness. It may combine naturally with opportunity 1; do not build duplicate aids for them.

3. **Common-control-row lock as an alternative to Serializable.** Trigger: Isolation 05’s final paragraph beginning “Explicit coordination is another option.” The reader must introduce a third row and reconstruct A locks→changes flags→commits, B waits→gets lock→fresh read, plus why an old Repeatable Read snapshot changes the conclusion. A small variant of the existing display illustration or an explicit short sequence would reduce the work. The substantial follow-on question is how to design and enforce a common-lock protocol across all paths. Keep the local fresh-read reason here even if further coverage is planned.

## Lower-priority possibilities and genuine curiosity

- Isolation’s existing price experiment could test writer commit after BEGIN but before first SELECT, or a later update against the old snapshot. Both test distinctions already explained. They are optional extensions of one useful aid, not missing teaching or a mandate for more controls.
- The deadlock illustration already supports the cycle. Comparing the sorted-order case could help, but the paragraph explaining B waits before taking P8 already does that work clearly.
- A deeper article on old-version reclamation would answer whether long reports impose costs. This is curiosity arising from Isolation 01, not a prerequisite missing from this article.
- A deeper article on operation identity for changing/larger requests, key retention, and worker/receiver duplicate handling would answer real questions raised by Waits 05–06. Do not expand local retry teaching to include the full design merely because it is related.

## Preserve

- Committed data can describe different moments; single-statement Read Committed already has one view.
- Existing price and write-skew aids at the point where event/row relationships matter.
- The two serial-order counterfactuals and retry as a successful re-evaluation that may decline the desired change.
- Cancellation request versus confirmed cancellation; a deadline is no evidence of rollback.
- Mugs rolled back before bowls retry, and the explicit purpose of retrying all reads/decisions.
- Two histories yielding identical missing replies, complete-intent matching for a key, and keeping unknown outcomes pending.

## Resolved first reactions

The serialization-failure name crossing two isolation levels was explicitly resolved in Waits 03. operation_id in retry pseudocode was a forward reference, resolved by Waits 04–05; no fundamental omission remains. The uniqueness wait and empty-lookup ambiguity were fully resolved in Waits 06. Optional O12/EUR 18 material in the price experiment was an unrelated aside, not a substantial issue. None of these should be reported as an unanswered blocker.
