# PGschema45 v01 — independent reader and rendered review

## Version and scope

Reviewed the fixed first version at `http://127.0.0.1:4606/review/relational-rebuild/postgresql/schema-changes/`, against `review-source.json`. Current source hashes matched all three manifest entries (article `7ed9c389…`, metadata `d15984bf…`, Scenes `607c6d9d…`). No article edits, delegation, commits or publication.

Followed rendered figures, labels, captions and controls before judging the body. Saved `initial-notes.md` before consulting the v01 brief/plan, incoming ownership and example-fact record. Did not consult the technical report, author quality verdicts, earlier versions or earlier reviews. After saving the blind notes, checked intended coverage and ownership without another full reading.

## Findings

No substantive teaching, editorial or rendered finding identified.

**Low / optional — section names could name the native operation more directly.** At article lines 94 and 157, “Enforce the rule, then prove the old rows” and “Recover the state a failed build left behind” require the reader to enter the section to identify constraint validation and failed concurrent index builds. The references' “Write cost and upkeep”, “Replies and activation bars” and “Asynchronous commit” more directly name their subject. Both current headings make sense in context and their sections supply the missing names immediately, so this is navigation/searchability polish rather than a reader stall or delivery blocker.

## Teaching and writing judgement

The article sustains the opening distinction between permission to touch a table, physical work and an established usable result. It could sit beside the references in explanatory development: it gives a concrete counterexample before the correction, retains entities through state changes and attaches qualifications to the decision they alter.

- Figure 1 makes the waiting migration's effect on later reads explicit, including the surprising timeout result while A remains open. Its persistent A/B/C cards and changing arrow sentence do the work that the Sequences waiting diagram does with lifelines; it does not imply a duration scale.
- Figure 2 earns the separate missing/different checks: 22.00/2000 has no null but remains wrong, not-null validation succeeds while agreement fails, repair changes the value, and a later validation establishes the rule. This is a useful explanation rather than a list of states requiring the reader to invent their connection.
- Figure 3 separates definition, write readiness and query validity, then adds the old-snapshot wait. The surrounding phase-counter paragraph applies the distinction to an operational judgement without treating a scan ratio as whole-command completion.
- Figures 4 and 5 carry different decisions visually: which index copy retains the working role, and whether upkeep should pack surviving B-tree keys, merge GIN pending entries or create a BRIN summary. Names, captions and pictured values agree.

The current-row backfill passage gives the stale 2000 failure before its SQL, then explains Read Committed rechecking, batch commit boundaries and full-population reconciliation. The rewrite table separates lock strength from copying work. The ending's acceptance conditions follow from these explanations. The operational qualifications generally earn their place: rollback after an explicit-transaction error, an invalid unique index still affecting writers, and a suffix not proving a safe deletion target all change an action.

The v01 plan's lock/wait, rewrite, backfill agreement, constraint, concurrent-build, recovery, upkeep and retirement decisions are covered. The brief recap of bridge writers and return boundaries supports this article without reproducing the general compatibility lesson; access-method choice and vacuum horizons remain linked to their owners. P7, P3/P9, late P11, the non-unique history key and the expressly abstract maintenance examples agree with the supplied example facts.

Reference calibration used bounded rendered passages and drawings: Sequences “Replies and activation bars” / “Who is waiting”; Indexes opening, scan/index-entry explanations and “Write cost and upkeep” / page-cost figure; Storage opening, “Pages” and the page-filling figure. Those comparisons support the judgement above; this was not another complete reference review.

## Rendered coverage

At desktop 1280×720, followed both Figure 1 endings, all five Figure 2 states and all four Figure 3 states; inspected the complete static failure/maintenance drawings and their captions. At a fresh owned phone tab, verified actual 375×812 dimensions and 375-pixel document width, then inspected the changed lock, constraint and index states, static drawings, operation table and text alternative. The phone's label/state rows retain their relation, and changing explanations remain directly above the controls. No clipping or page-wide overflow observed. The table wraps readably.

Inspected representative light and dark renderings. Computed visible leaf-text contrast in the three interactive scenes gave minima 6.05:1 in light and 6.15:1 in dark, with no sampled text below 4.5:1. Static figures were visually inspected; this was not an exhaustive contrast audit of every article element or a repeat of a full mechanical matrix.

Operated the branch options, Next, Back, Play/Pause, Reset and an “All stages, as text” disclosure. Keyboard Enter stepping kept visible focus on Next at the last step and Back at the first; the boundary controls use `aria-disabled` while retaining focus. Playback visibly advanced from stage 1 to stage 2, Pause held that state, and Reset restored initial states. The text alternative exposes the lifecycle progression without playback.

## Limits and cleanup

This review does not independently certify PostgreSQL behaviour or execution receipts; that is the separate practitioner assignment. It checked the reader-facing distinction between illustrative models and the specifically bounded observed claims.

The IAB ran in the background. A timed page-observation attempt hit the browser evaluator's 3-second ceiling, so exact wall-clock dwell and a complete uninterrupted playback run were not certified. Manual stepping, play/advance/pause/reset operation and the shared stepper's configured text-dependent timing were inspected; source timing is not treated as an observed timing measurement. No assistive-technology session or exhaustive device matrix was run.

Before releasing the main/reference-origin theme lease, reset all reviewed players, restored System on both origins, reset the temporary viewport and verified 1280×720, and closed every owned tab. No preview/server or article source changes were made.
