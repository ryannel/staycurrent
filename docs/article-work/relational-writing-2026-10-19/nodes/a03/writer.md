# a03 writer handoff

Status: **ready for orchestrator-managed independent review**. Drafting only; no publication, commit or shared registry edits performed.

- Staged fragment: [article.astro](/Users/ryannel/Workspace/staycurrent/docs/article-work/relational-writing-2026-10-19/nodes/a03/article.astro). Imports resolve relative to the assigned final `src/articles/relational-next/a03.astro` path.
- Owned components, executable checks, setup and native transcript: [a03 directory](/Users/ryannel/Workspace/staycurrent/src/components/relational-next/a03).
- Research and execution detail: [sources.md](/Users/ryannel/Workspace/staycurrent/docs/article-work/relational-writing-2026-10-19/nodes/a03/sources.md).

The article keeps remaining + reservations = capacity visible from the invariant through a lost-update counterexample to the guarded single-statement reservation. It then uses the distinct staffing invariant to explain why a stable snapshot and nonconflicting row writes need not protect a multirow decision. Lock design and isolation follow-ups deepen that first useful answer. Later sections carry the same operation through known abort, uncertain commit, durable acknowledgement and an independent payment effect.

Reread and applied the writer skill's new teaching sentence during drafting. Adjusted the staffing illustration into a stepper with an isolation comparison and abort/reconsideration outcome; added a failure-point comparison for database/log/application/provider boundaries. The reservation stepper also has paced, pausable playback. Comparison selectors sit beside outcomes and step controls, and endpoint buttons use `aria-disabled` plus guarded actions so reaching the last step does not discard keyboard focus. Figures contain no h2/h3/h4 elements. Styling uses shared semantic theme variables; phone media rules keep the two-transaction comparison compact.

Validation completed:

- Original native PostgreSQL 18.6 controlled suite passed, including exact displayed reservation SQL and invariant query, rollback, unguarded and guarded contention, stable-row wait/fresh count, concurrent uniqueness, read visibility, Repeatable Read and Serializable staffing, deadlock, and a completed COMMIT reply deliberately withheld. After a03-P1, the repaired uniqueness scenario passed a narrow native rerun; the retained composite transcript identifies this provenance. Unchanged cases were not rerun.
- All four owned/staged Astro files transform successfully with the repository's installed `@astrojs/compiler` 2.13.1. Root owns shared build and site checks.
- Root promoted the ready fragment for desktop route checks. Interactive browser checks and any limitations are recorded below. Root will refresh the final staged fragment before independent reviews.

No tree changes proposed. All supplied section IDs are retained. Contextual links and the closing reading paragraph connect a18/a19; shared route wrapper owns the bottom child list. The native server remains running and unchanged for the orchestrator; this worker closes only its own sessions.

## Required practitioner repair a03-P1

Repaired the worksheet and executable scenario by keeping both competing attempts inside the complete reservation protocol. Both transactions begin at Read Committed and see the request identity absent. A takes one place from class 21 and B takes one from class 22; each guarded update must change exactly one row. A inserts the shared identity and commits. B's competing insert waits, fails with 23505, then B rolls back its whole attempt. The final query asserts both exact rows: `21|1|0|1|t` and `22|1|1|0|t` (place, capacity, remaining, reservations, agrees).

Verified only this changed scenario on native PostgreSQL 18.6 in fresh `rel3_a03_p1_run1` through `verify.py … --only-uniqueness`. The full-suite path calls that same repaired function. Raw evidence is `src/components/relational-next/a03/uniqueness-repair-observed.txt`; `observed.txt` now contains the new uniqueness section with an explicit composite-record banner, retaining unaffected original observations. Sources and worksheet expectations are aligned. All sessions closed. No server configuration, figure component, shared integration file, final-src fragment or publication state was changed. Return for narrow practitioner recheck; no new figure, lesson or tree change is proposed.

## Browser record

Desktop IAB at 1280×720: route renders; overselling endpoint shows 0+2=2 against capacity 1; protected endpoint shows 0+1=1, B declined. Focus stays on the final step button. Figure comparison and reset/previous/next controls work. Paced play advanced from the initial state through A’s read and write while other figure controls were inspected; Pause stopped it at step 4/7. Staffing reached the broken two-departure endpoint at Repeatable Read, then changing isolation at that same step showed Tariq available and B’s new read → 1; stay. Failure-point changes showed the completed-commit/unknown-reply state and the provider-accepted/delivery-uncertain state. Rendered outcomes and dashed external boundary were inspected in both dark and light themes. Comparison selectors were placed directly beside their outcomes. No screenshots are retained as files; the CUA transcript includes the inspected rendered views.

IAB CUA exposes no viewport capability in this session. Root confirmed the independent teaching reviewer has a separate supported 390×844 Chrome viewport and owns the mobile check; no separate server or workaround was started here.
