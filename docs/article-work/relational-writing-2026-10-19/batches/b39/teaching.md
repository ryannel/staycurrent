# B39 — independent teaching review

## a36 — Monitoring and sizing a relational service

**Verdict: repair two local model claims, then ready.** The complete article, family progression and visual approach pass. No skill revision or additional figure is required. Review used the frozen B39 preview on port 4439 in an owned browser tab; the three fixed references and their figure implementations remain the teaching standard.

### Required

- **P2 — Figure 4, “Collector stops arriving”, final step:** the deadline says “Restore order-taking within its 10 min incident budget”, although this branch has established missing collection and an unknown service state, not failed order-taking. Give this branch a collection/independent-check completion and escalation deadline, with service restoration conditional on observed service impact. Keep the actual harmful-workload branch's incident budget. The existing final completion (“Samples resume; independent probe agrees”) and surrounding prose already teach the right distinction. Root has accepted this repair.
- **P2 — Figure 1, retained-history branch, intermediate narration:** “The application still meets its objective” overstates what the displayed p95 and completion rate establish about the 99.9% within-500-ms, 30-day objective. Qualify this as the displayed application measures remaining steady, without certifying the full objective. This issue was separately reported to me by root from the parallel practitioner review; I confirmed the affected rendered narration, rather than treating it as an independent technical discovery. Root has accepted the qualification.

### Writing, progression and teaching — pass

The page turns monitoring into explicit operating decisions: define useful work and its promise, retain enough observation context, route a changed symptom, forecast time to reserve, test a degraded service policy, and verify an alert's useful outcome. The persistent order-service case connects the quantities rather than presenting a detached list of dashboards. Examples precede generalisations; numerical assumptions, units, ownership and evidence boundaries remain close to each conclusion.

It consumes a28's diagnosis measurements without repeating workload diagnosis. The native activity/counter examples teach interpretation and visibility limits; the capacity worksheet then clearly introduces invented reservations. The article does not silently promote short local recovery/promotion timings into whole-service recovery evidence. A07 supplies the requirements; a37/a38/a39 own the maintenance, promotion and restoration procedures. The page provides a useful complete first operating case while leaving those deeper procedures to their owners.

The four figures sustain causal teaching across the article. The dashboard separates admission/queue delay from engine exchanges and contrasts healthy-looking application measures with stalled recovery history. The forecast keeps ordinary and adverse growth together while elapsed time and intervention lead change the decision. The degraded envelope accumulates inherited work and catch-up, then makes the reporting-deferral policy's resource effect inspectable. The alert comparison follows evidence through routing, acknowledgement, escalation and completion. These mechanisms reduce the arithmetic and comparison work the reader would otherwise perform mentally. SQL visibility/counter interpretation, collection inventory and provider limits are sufficiently concrete in prose/tables; another animation would not materially improve those passages.

### Interaction and layout — pass

- Operated all eight variants and all 34 displayed states, inspecting both panels, narration and assumptions. Same-step comparisons preserve the causal contrast; controls update the text alternatives with the displayed state.
- Checked all 16 keyboard arrivals at the start/end through Back and Next. Focus remained on the activating control; clamped `aria-disabled` endpoints did not strand focus. All four players' Play/Pause, final-step replay and Reset worked. Reset returns to the first step of the selected branch. These players offer step buttons rather than a scrubber or End control.
- At 390 × 844, checked every branch's comparison in both Light and Dark, including dense dashboard, forecast and degraded-envelope states. No page/panel/value overflow appeared. Inherited panel margins compute to zero in both themes. The figures are tall (approximately 1,081–1,410 px), but ordinary scrolling exposes complete paired comparisons: the envelope's two resource panels fit together from about y=16 to y=838, with all resource labels, units and over-budget states visible. Text, borders and contrast remain usable after redraws.
- Playback budgets count rendered whole-figure `innerText`, including both panels, labels, controls and any expanded transcript, at 180 words/minute plus 1.2 seconds, minimum 6.5 seconds, with no maximum. Opening the transcript re-arms the budget. Expanded transcripts contain substantial text (840–1,440 words), and are included rather than treated as short narration. A dense 161-word envelope step has a calculated 54.87-second dwell. It was still holding at 45.06 seconds and had advanced to the final rejection/stopped at Play by 56.31 seconds, consistent with that budget. The figure's bounds stayed approximately −862 to +537 px: a tall, partially visible figure continues playing. These observations bound the actual transition rather than measuring its precise instant. No short fixed cap is present.
- Source has no animated geometric transition requiring a reduced-motion override. Manual stepping supplies the same causal states. This is a browser/keyboard/layout review, not an operating-system reduced-motion or screen-reader certification.

### Optional

Figure 4's harmful-workload narration says “The two windows reduce responses to a single blip.” “Using both windows reduces pages caused by one brief blip” would express the intended filtering more clearly.

No native worksheet was executed and no download was clicked or awaited. Native correctness and asset bytes remain the independent practitioner/root checks. All other full-review passes can be retained for a narrow recheck of the two model-text repairs.
