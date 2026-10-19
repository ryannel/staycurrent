# b19 independent teaching review

## Early narrow rechecks

**a17 — PASS.** Retain the b17 full teaching/style, boundary, 63-state, control, playback and phone/theme passes. Reviewed the changed conflict paragraph and source ledger. The paragraph now distinguishes an ignored conflicting receipt proposal from an inserted receipt: negative conflicting bank-1 fails CHECK 23514; missing-order 999 on ignored bank-1 returns nothing and leaves its existing link to 101; a new reference against 999 fails 23503. The following paragraph correctly says a skipped proposal establishes neither validity of every proposed value nor agreement with the existing row. The examples make the exception useful and concrete, without weakening the warning that DO NOTHING is not a general error handler. Rendered the changed passage at 390 px; it is readable. No new required finding; b17 optional improvements remain optional.

**a18 — PASS. T18-1 resolved.** Retain the b17 full prose, boundary, all 45 states, controls, playback and phone/theme passes. On the frozen 4439 candidate, Reservation rows step 2 now says “A runs its locking read” and “No rows locked”; step 3 also labels B “No rows locked”. The stable-class alternative retains A's acquired lock and B's wait. Inspected both branches at both stages and the phone presentation at 390 px: the labels now agree with details, counts and results, and remain readable. Source/repair record confirms only these three labels changed; no SQL, control or numeric-state change. No new required finding; b17 optional improvements remain optional.

These narrow checks used `b19/repair.md`, the assigned snapshots, changed source/ledger and actual frozen 4439 rendering. No practitioner reports were read. No browser download, native execution, build, article/component mutation, Git operation or nested team. Normal viewport restored and the narrow-review tab closed.

## a19 full initial review

**Reading and testing isolation guarantees — PASS.** No required findings. Optional interaction/presentation improvements below.

Read the complete article, context, model, player, source ledger and writer handoff. Retained the full source and rendered-figure reading of the three fixed reference articles. Actual a03 parent and a18 sibling were read in full in the preceding assignment and used here; a18's repaired labels were also rechecked above. There are no child plans. The review uses the frozen b19 4439 candidate, not a practitioner report.

### Scope, writing and mechanism teaching

The article extends the parent's useful transaction case with the specific contracts needed to use it. PostgreSQL 18.6 observations, MySQL 8.4 documentation-derived comparisons and the hypothetical ordering definition are clearly separated at first use, in figure labels and again in sources. The cross-engine material earns its space by changing the decision: a locking read can consult current data while an ordinary InnoDB consistent read still uses its old snapshot. This is neither presented as a measured MySQL run nor inferred from the isolation name.

The reference style is effective: concrete class/staff identities, a precise question before each figure, a changed setting, a visible consequence and a practical conclusion. The five comparisons teach distinct mechanisms:

- **Visibility:** committed state and A's answer are visible separately. The late-first-read choice makes BEGIN versus snapshot establishment observable, while own writes are explained as a bounded exception in prose.
- **Locking/current operations:** pending A, old committed state and waiting B remain distinct. The same conflict produces current zero, guarded-update zero rows or PostgreSQL Repeatable Read 40001. The InnoDB path adds the later old ordinary answer. The prose completes the reservation obligation by linking decrement success to ownership insertion, rather than allowing an earlier read to authorise it.
- **Staffing:** the dependencies explain both arrow directions in words. Changing different rows is visibly insufficient; the selected serialisable abort and complete reread preserve one instructor. The chosen victim/error point is qualified rather than universalised.
- **Predicate:** the explicitly counter-free design exposes a dependency on future matching rows, not a contradiction of the parent's guarded counter. Both insertions alter the other's earlier count without overwriting a read row.
- **Ordering:** completed-before-started W/R is compared with the serial explanation R→W. The stronger requirement is introduced with one small example, explicitly hypothetical, without claiming a PostgreSQL or InnoDB anomaly or expanding into distributed-ordering theory.

Mechanisms left to prose are sufficiently taught: snapshot isolation versus serialisability, PostgreSQL nonblocking dependency tracking, documented InnoDB shared-lock behaviour under the stated autocommit condition, and why a logically wrong own-person query still fails in sequential Serializable transactions. The worksheet gives schema, explicit settings, pause conditions, observations, reset and final invariants; a separate observer establishes real waits. The final expected/observed/decision table is useful synthesis. Passing schedules are correctly distinguished from a coverage argument.

a18 retains coordination rows, lock modes, missing rows and acquisition order. Recovery owns bounded retry machinery and unknown outcomes; physical storage owns retained-version costs; replica paths retain their separate owner. No extra figure, deeper child, specialist anomaly catalogue or substantial consolidation is required for the commissioned practitioner goal.

### Rendered interaction and phone evidence

Read **all 56 states across 13 settings**: visibility 3×4, locking 4×5, staffing 2×6, predicate 2×3 and ordering 2×3. For every setting exercised slider Home/End/intermediate movement, keyboard Back/Next at both endpoints with retained focus and bounded state, Play/Pause, slider interruption and Reset. Reset restores the default setting and first step. For each scene also exercised final-state replay, manual Next stopping playback and changing the selector while playing. Selection stops playback and resets the scene to step 1. No control malfunction found.

Inspected every comparison at **390×844 in dark and light themes**, including late snapshot, InnoDB mixed views, complete serialisable retry, predicate abort and both ordering definitions. All labels, counts, arrows and explanations were legible. Stacked cards require normal vertical scrolling; the sticky dock does not permanently hide their content. There is no page/figure horizontal overflow: 390 px page, 356 px figures. Normal desktop rendering at 1488 px fits all 638 px figures and presents the three columns readably in both themes.

The shared player budgets title, result, narration and every card name/state/detail at 180 words/minute plus three seconds. The densest dependency state is **70 words / 26.333 seconds**. Started real playback at staffing step 3 and observed advancement to step 4 about 26 seconds after the Play action (the post-call clock measurement excludes the initiating call's latency), with Pause still active; then paused normally. Source inspection confirms each state, including the final one, receives its own computed hold before stopping. The equivalent final-hold mechanic was also observed through completion in the preceding a18 review. Fixed figure/model/control labels can be read before playback and are outside the changing-scene count. No need to wait through every complete sequence.

### Required findings

None.

### Optional findings

- **T19-O1 — Preserve comparable stages on setting changes.** `IsolationFigure.astro`, selector handler. Choices within a scene have equal stage counts. Keeping the inspected stage would make old/fresh answers and commit/rejection outcomes quicker to compare; current reset behaviour is coherent and usable.
- **T19-O2 — Let compact card styling reach generated content.** `IsolationFigure.astro`, dynamic panels and scoped styles. Hydrated card text currently uses the generous global paragraph presentation rather than the compact two-column phone rules defined in the component. Inspected phone scenes were about 878–973 px tall. They remain readable/reachable; applying the intended styling would reduce scrolling and keep more of the comparison together. This is optional, not a clipping or control failure.

### Completion and limits

System theme and normal viewport restored; owned a19 tab closed. No browser download action/event wait, native SQL, build, article/component edit, Git operation or nested review team. Root owns asset byte checks. b19 is fully reviewed: a17, a18 and a19 all PASS from this perspective.
