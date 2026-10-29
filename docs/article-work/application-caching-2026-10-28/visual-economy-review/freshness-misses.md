# Visual teaching-economy review: freshness, versioned fills and misses

Reviewed 29 October 2026. Fixed article revision: `09f2f8f3`; updated review/visual instructions supplied by the coordinator. Audience: intelligent newcomer progressing towards practitioner judgement. Review only; no article or component edits.

## Scope and evidence

Inspected all thirteen figures, seven tables and four code blocks in the rendered `freshness`, `versioned-fills` and `cache-misses` articles, including their surrounding explanations. Used CUA browser screenshots and rendered DOM text at `127.0.0.1:4327`, then the coordinator's explicitly labelled rendered snapshots at `127.0.0.1:4329`. Those snapshots retain the article prose, captions and styles and show actual scene renderings at selected fractions; their added review navigation is not assessed as product UI.

Read the rendered Storage and durability reference at `127.0.0.1:4328/review/examples/storage/`, especially Figure 5's update and final states with its surrounding explanation. Its extra structure earns its place by keeping the changed page, surviving log and acknowledged commit simultaneously inspectable. This is the relevant standard: visual complexity should expose the condition explaining the result.

The hidden review tab did not advance these articles' automatic animations, even after Replay and page-timer waits. Initial controls and alternative selection worked. Intermediate and final states were therefore inspected through the coordinator's snapshots, rather than claimed as live playback. Misses alternatives inspected: shared fill, faster source, successful refresh, and slower source. Freshness alternatives inspected: longer fill and lagging replica endpoints (70 s and 65 s answer ages against the unchanged 30 s insertion TTL). Motion/pacing findings require the coordinator's live confirmation. Phone and theme changes were reserved to the coordinator; this pass inspected the provided desktop dark rendering without changing either setting. No source-code inspection was used to infer visual success.

## Findings

### Medium — cache-misses Figure 5, “Different answers share one source budget”

The drawing spends its upper half on App–Server–Database, then places an unconnected queue and two execution slots below. The relevant teaching change is whether a read can finish before the caller's deadline, but no elapsed-time or deadline boundary is visible in those elements. At the fast final state, the queue disappears and the sentence announces that queued work cannot finish; at the slow 75% state, two slot dots remain while the sentence announces that callers timed out. The 150 ms allowance is in the caption, and the crucial 50 ms remaining versus 100 ms needed calculation is supplied only by the following paragraph. A reader has to leave the drawing and reconstruct why its outcome follows.

Simplify around admission and time: remove the generic network route, connect the bounded queue directly to the two execution places, and give the execution/queue comparison a shared 150 ms boundary. Show the fast case's remaining 50 ms beside its required 100 ms; show the slow reads extending past the caller boundary while still occupying their slots. A compact pair of execution timelines could do this without adding more actors. Retain the moving occupancy and separate source-work/useful-answer counts: those teach the actual distinction.

Evidence: default 25%, 50% and 100% snapshots; `slow-75.html` and `slow-100.html`; surrounding “Limit source work across all keys” prose. This is a representational finding, not a claim that the implementation's accounting is wrong.

### Low — cache-misses Figure 4, “Refreshing leaves the old deadline intact”

The full App–Server–Cache–Database network repeats machinery already understood by this point. Most of the changing conclusion is carried by the separate 20/24/26/30 s track, “old copy” versus “new copy”, and the final usable/unusable state. The failed and successful 50%/100% snapshots make the network a large amount of extra reading for a time-boundary lesson.

Consider replacing it with aligned “old answer may be served” and “refresh attempt” tracks: refresh begins at 24, fails or yields a replacement at 26, and the old answer still ends at 30. Keep the alternative control and meaningful movement. This is optional economy polish; the existing surrounding explanation is understandable. The coordinator should retain any live request/response movement that materially helps explain serving during refresh.

### Low — versioned-fills Figure 1, “Remembering a revision only works while it survives”

The retained/lost comparison duplicates a complete Server→Cache line, server icon, server label and waiting-result sentence. On the inspected desktop rendering the two-case comparison occupies about a viewport, with large gaps between the common candidate and the differing cache outcomes. At 50%, the actual difference is simply `≥ 2` versus unknown; at the end, it is refused versus accepted under the explicitly unsafe rule.

Tighten the two cases under one shared “delayed revision 1; source revision 2” setup, retaining distinct cache knowledge and acceptance outcomes. Reduce repeated server labels and empty line length. Preserve arrival/refusal motion and the lower case's explicit unsafe-rule warning. A table is not required: the paired visual comparison is useful, but its repeated scaffolding can be smaller.

## Forms that earn their complexity

- **Freshness:** Figure 1's aligned age/TTL clocks expose two different starting points; its variants ask useful questions about pre-insertion delay and prior replica age. Figure 2 needs the old result visibly held outside the cache while commit/deletion proceed. Figure 3's two dependency branches distinguish stale value from stale list membership; its few unchanged list members establish what a list answer is. Figure 4's transaction boundary and pending record make failed delivery recoverable in a way a bare arrow would not. Figure 5 makes the authoritative lookup precede selection of one of two keys. Keep these mechanisms and their causal movement.
- **Versioned fills:** Figures 2 and 3 reuse the parent's race actors to change one publication condition. Seeing a reserved token disappear in one case and survive a delayed delete in the other earns the repeated scene: it separates processed invalidation from an unseen source change. The state-transition table, implementation snippets and observed-schedule table have different jobs and need not be collapsed into the animations.
- **Misses:** Figure 1's variants keep arrivals fixed while source-work counts change, making both coalescing and source speed meaningful. Figures 2 and 3 use aligned duration tracks economically: a caller or lease ends while source work continues. Their distinct ending events are the lesson, so motion should remain. Figure 5's bounded queue, source slots and useful-answer count should also remain, with its cause made more visible as above.
- **Tables and code:** The seven tables organise parallel promises, transitions, choices, outcomes and failure observations. They are compact and readable at the inspected width. The four code blocks keep execution order explicit, particularly reserve-before-read and obtaining payload plus revision together. No further simplification finding from this pass.

No critical finding. One substantive representation issue and two optional simplifications; this report does not reopen previously retained functional checks or authorise publication.
