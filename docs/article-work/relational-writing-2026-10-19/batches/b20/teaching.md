# b20 independent teaching, style and interaction review

**a20 — Managing connections and transaction lifetimes: PASS.** No required findings. Two optional usability improvements below.

Reviewed the complete frozen candidate at `http://127.0.0.1:4438/review/relational-next/connections/` under `.agents/skills/staycurrent-review/SKILL.md`, against the original relational-practice commission. Read the complete article, context, model, player, source record and writer handoff. Read the actual a04 parent in full and the supplied a21/a22/a23 sibling plans. No child plans exist. Retained the complete source and rendered-figure reading of Sequence diagrams, Indexes, and Storage and durability from the earlier teaching assignments. No practitioner reports were read or used.

## Scope, reference style and ownership

The article usefully extends the parent's complete normal borrow/transaction/release outline through resource failures. It does not reset the reader to an introduction to transactions or rederive request idempotency. The central question—who still owns this resource, and what must finish before it can be lent again—gives the article a coherent progression.

Concrete pg 8.23.1 / PostgreSQL 18.6 behaviour is separated from general ownership questions, illustrative request traces and documentation-only proxy compatibility. The prose distinguishes driver read timeout from server execution termination, cancellation dispatch from its observed outcome, transaction-idle status from completed outstanding work, and resource disposal from a business commit outcome. These distinctions are locally explained with consequences rather than left as cautions or link advertisements.

The seven figures follow the references' useful changing-condition method: begin with a small named owner/resource set, change one policy, expose the state that survives, then explain the consequence. Direct definitions and concrete C1/C2, request A/B/C, tenant 7/8 and row 101–105 identities keep the mechanisms inspectable. The article stops at reliable application use of relational connections, rather than becoming a driver or proxy catalogue.

## Important mechanisms

1. **Transaction ownership:** request, pool and database panels show BEGIN on C1, a possible later write on C2, and the row that survives rollback of C1. The quiet one-client test is explicitly insufficient evidence of affinity. The prose makes client propagation and library-context behaviour actionable, and distinguishes ordinary command queuing from safe shared transaction ownership.
2. **Cancellation and cleanup:** requesting cancellation, receiving the command error, failed transaction state, awaited rollback and terminal release/disposal are separate stages. Successful rollback, failed cleanup and early return have distinct next-borrower consequences. The lifecycle/action table supplies complete local decisions for no acquisition, completed commands with an open transaction, verified reuse and uncertain/broken cleanup. Original operation and cleanup errors retain separate meaning.
3. **Late acquisition:** the one-slot model distinguishes a queued promise from a leased client and makes the forgotten late client block C. The prose provides the actual repair—retain handlers/ownership through late success or rejection—and distinguishes it from the driver's verified configured acquisition timeout. Cleanup outlives the caller and has its own bounded termination in reuse or disposal.
4. **Session state:** local versus session SET is followed through commit, return and a new borrower. The tenant value is illustrative; native application_name evidence is named separately. A local setting is correctly not presented as authentication or enforcement. The proxy table distinguishes backend reassignment, protocol named statements, SQL PREPARE and cursor/temp-object lifetimes without pretending a proxy was run.
5. **Result lifetime:** two fetched rows leave a cursor, transaction and lease alive while SQL is idle. Early exit either closes/rolls back before return or leaks the old transaction to a new borrower. The complete SQL and prose distinguish SQL cursor batches from a materialised pg result or another streaming API, and do not claim each fetch bounds all physical work. Ordinary and held cursors have their stated owners.
6. **Aggregate demand:** supplied allowance and operational reserve stay visible while three processes become six. The arithmetic demonstrates 28 versus 52 connections under cap 8 and 28 during overlap under cap 4. Counts remain explicitly invented configured maxima, not recommended sizing or observed simultaneous demand. Admission, queue waiting, frontend proxy clients and backend sessions remain distinct.
7. **Diagnosis:** equal 40 ms acquisition wait and 460 ms lease time lead to different investigations after SQL/application-hold spans and owner evidence are exposed. A slow consumer, slow/blocked SQL, missing release and old idle transaction are distinguishable; occupancy alone does not choose the repair.

The mechanisms left to prose are useful and complete: failure during BEGIN, preservation of cleanup errors, stale last transaction status, removal/replacement of an idle failed backend, reset/cache compatibility, and the bounded shutdown sequence with an owner registry. The failure-check table says exactly what the native driver rehearsal observed and what an actual HTTP handler or shutdown coordinator must still establish. Neither an additional shutdown figure nor production-ready handler boilerplate is needed to make the lesson complete.

Boundary links match actual ownership. a04 retains values and authority; a21 retains abstraction/materialisation bounds; a22 retains deadlines, retry eligibility, durable operation identity and unknown-outcome reconciliation; a23 retains background claims and external work. Transaction correctness, retained-version mechanics, workload tuning and service connection allowances stay with their established owners. No extra child, article split, specialist branch or substantial cut is required.

## Interaction evidence

Read **all 62 rendered states across 17 choices and seven scenes**: ownership 2×4, cleanup 3×4, acquisition 2×4, state 2×4, cursor 2×4, demand 2×3 and diagnosis 4×3. Inspected title, every panel's label/state/detail, result and narration at each stage. Outcomes match the logical models and article explanations.

For every choice exercised slider Home/End and intermediate movement, keyboard activation of Back/Next at both endpoints, Play/Pause, slider interruption and Reset. Endpoint buttons retain focus and clamp state. Reset restores the scene's initial choice, first step and valid slider maximum. For every scene also exercised replay from the final state, manual Next stopping playback, and changing a selector during playback. Selection stops and restarts the scene at step 1. The default text-steps disclosure was opened, read and closed; it is explicitly labelled as the default path rather than implying it follows the current comparison setting.

The player budgets the entire changing scene—title, all panel names/states/details, result and narration—at 180 words/minute plus three seconds, minimum seven seconds. The dense cursor-pause state has **75 words / 28 seconds**. Actual playback was still at step 2 with Pause active after **26.228 seconds**, and had advanced to step 3 by **40.272 seconds**; it then paused normally. Source inspection confirms the final state receives its own hold before stopping. This shared final-hold mechanism was also observed through completion in the preceding locking review. Fixed labels, controls and the optional static default transcript are outside the changing-scene count and can be read before starting. No need to wait through every complete autoplay sequence.

## Phone, desktop and themes

Inspected **all seven scenes at 390×844 in both dark and light themes**, including transaction splitting, broken cleanup, forgotten acquisition, persistent context, open cursor, over-budget deployment and contrasting diagnosis. Owner names, C1/C2 identities, state distinctions and long explanation text remained readable. Stacked panels require ordinary vertical scrolling; moving down exposes the result and cards above the sticky dock. Nothing is permanently hidden. There is no page or figure horizontal overflow: 390 px page, 356 px figures.

Normal 1488 px desktop presentation fits the 638 px figures and keeps the three ownership columns useful together in both themes. Focus outlines and native controls are visible. No required presentation or interaction repair found.

## Required findings

None.

## Optional findings

- **T20-O1 — Preserve comparison stage on selection.** `LifetimeFigure.astro`, selector handler. Choices within each scene have equal stage counts. Keeping the current stage would let readers compare the failed/clean next borrower or final deployment total immediately. This would align the prose instruction to stop at cancellation error and compare policies more directly with the interaction. The present restart-to-first-step behaviour remains coherent and usable.
- **T20-O2 — Apply compact card rules to generated nodes.** `LifetimeFigure.astro`, dynamically created `.panel`, `.name`, `.state` and `.detail` elements and scoped CSS. Hydrated panels currently use the generous global paragraph presentation instead of the component's intended compact phone grid. Representative phone scenes were about 931–978 px tall. All content is readable/reachable; ensuring those intended rules apply would reduce scrolling and keep more of the comparison visible together. This is optional, not an overflow or control failure.

## Cleanup and limits

Restored System theme and normal viewport; owned Chrome tab closed. No browser download clicks or download-event waits were used. Root owns worksheet endpoint/byte checks; this report makes no browser-download-UI claim. No native execution, build, article/component mutation, Git operation or nested reviewer was used. Only this requested report was saved.
