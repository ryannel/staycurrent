# b11 independent writing and teaching review

Reviewed 20 October 2026 against the original relational-practice commission and
the `staycurrent-review` teaching perspective. Practitioner review was not read.
No article, component, shared file, build or Git state was changed by this review.

## Verdict

| Article | Verdict | Required finding |
| --- | --- | --- |
| a12 — Modelling history and data lifecycles | Changes required | T12-1: show the effective assertions belonging to the selected recorded account in Figure 4 |
| a34 — Checking a distributed choice with CockroachDB | Pass | None |

The required repair is local to an existing figure. It does not call for more
articles, more figures, a temporal-specialist curriculum or executing CockroachDB.

## Basis and checks

Read the three fixed references in full from `src/reference-articles/`, including
their figure explanations, and inspected their rendered figures at the reference
preview on port 4337. Their useful standard is a concrete case, one changed
assumption at a time, observable consequences, and prose that explains why those
consequences matter. It is not a quota of illustrations or a requirement to copy
their particular drawing format.

Read both complete b11 article snapshots, their complete models and players,
commission and context plans, source and writer records, the actual a01 and a08
parents, and actual a09/a10/a11 siblings. The review used the immutable b11
preview on port 4438, at the exact article URLs in the manifest.

Browser checks in an independent Chrome tab included:

- All 56 a12 choice/step states, with same-step comparisons and Home/End/arrow
  operation of the step sliders.
- All 52 distinct a34 UI-reachable states: every comparison and every step,
  including all six hot/dispersed × RTT combinations. The author's 108-state
  model sweep additionally repeats RTT inputs for scenes without an RTT control;
  those repetitions do not create different visible comparisons.
- Keyboard Back/Next at both endpoints: focus remains on the button and the
  position stays bounded. For a12 this was verified through native Tab/Return
  input, including its focusable `aria-disabled` buttons.
- Play, pause, manual interruption, reset and comparison changes. A12's
  requests-only frame remained at 2/4 after about 10 seconds; a separate timed
  run advanced to 3/4 after its 17,834 ms allowance. The subsequent frame was
  allotted 20,167 ms. A34's dense budget frame contained 165 visible words and
  received a 55,000 ms allowance; it advanced from 3/4 to 4/4 in the timed check
  and still held the final frame afterwards. Source inspection confirms the
  final frame receives its own reading allowance in both players.
- Desktop and 390 × 844 phone inspection, including both themes, the historical
  account comparison, lifecycle cards, voting map, lost-reply comparison and
  fixed-scale deadline meter. No page-level horizontal overflow at 390 px;
  labels, selected controls and focus indicators remain legible. Long a34
  figures require vertical scrolling, as discussed in the optional finding.

Restored the System theme and normal viewport and closed the review tab.

## a12 — Modelling history and data lifecycles

### Required — T12-1: make the selected historical account visible

Location: Figure 4, “One past date, two accounts of what was known”, final step
“Query 11 Nov again”; `src/components/relational-next/a12/model.mjs:67–69`.

Reproduction: advance Figure 4 to 4/4 and select **Known on 11 Nov**. The result
correctly says €20 for effective date 11 November. However, the **Effective time**
card shows only the replacement account: €20 applies before 10 November and €22
from 10 November onwards. The **Recorded account** card lists supersession times
but never displays the old assertion's effective coverage, €20 from 1 November
onwards. Switching to **Known after correction** changes the answer and narration
while both cards remain identical.

The learner therefore sees an answer apparently contradicted by the displayed
effective periods. This is the article's central new mechanism: selecting a
recorded account first changes which effective assertions answer the fixed past
date. The prose and following three-row table are sound, but the interactive
comparison currently asks the reader to supply that missing selection themselves.

Repair the existing board so the old €20-onwards assertion and the replacement
pair remain distinguishable, and the chosen recording cutoff visibly selects
the appropriate account. Alternatively show the selected account's complete
effective periods at the query step, with a clear label. Keep the effective
date fixed at 11 November and make the matching assertion visible beside its
€20/€22 result. A second figure or an elaborate two-dimensional chart is not
required. Recheck both choices at the same final step on desktop and phone.

### Teaching, completeness and ownership

Otherwise this is a useful, complete local explanation. The progression from
current state through agreement capture, committed changes, applicability and
late information earns the additional concepts gradually. It uses the parent's
actual B11 agreement rather than repeating the parent's schema lesson. It makes
snapshot capture a transaction boundary, explains why revision order is scoped,
distinguishes at-most-one coverage from continuous coverage, and follows ordinary
references and uniqueness through departure. Removal beyond live rows and the
limits of history as evidence are concrete requirements with appropriate owners.

Types, enforcement, dependency reasoning, concurrency and operational procedures
stay with their siblings or owning branches. The three SQL explanations and
their caveats are understandable locally. Five focused interactions are enough;
their largely textual cards are adequate for the small state comparisons once
T12-1 is repaired. No additional required prose or coverage finding.

## a34 — Checking a distributed choice with CockroachDB

### Required findings

None. Pass for the teaching perspective.

### Teaching, completeness and ownership

The changed region-loss requirement is explicit and preserves the parent's
decision to postpone distributed SQL under its original brief. This is a
conditional candidate evaluation with a concrete output: reject arrangements
that contradict the new gate and defer this exact candidate until the missing
evidence exists. It does not pretend a documentation screen is production
acceptance.

The exact release, self-hosted Enterprise arrangement, support lifetime,
commercial conditions, nine-host starting choice and outstanding licence quote
are identifiable. Proposed SQL is labelled throughout. No instance, driver,
regional failure, performance, restore or price result is implied to have run.
The absence of CockroachDB execution is therefore a bounded result, not a
teaching failure to be repaired by inventing evidence.

The figures carry useful causal distinctions: voters versus stored copies,
gateway versus row home, client knowledge versus database truth, and a shared
deadline spent on queueing, coordination and retry. The budget uses a stable
800 ms scale and visibly crosses the 300 ms marker as inputs change. The lost
reply cases preserve identical client evidence while exposing different model
truth. Scope stays at the relational decision: retry implementation, consensus,
workload method, restore and cutover procedures remain with their owners. The
article provides enough local explanation to interpret those handoffs.

### Optional — T34-O1: shorten repeated phone figure content

At 390 px, topology, locality and budget figures are roughly 1,170–1,200 px tall
in the inspected states; the outcome figure is about 943 px. Comparison selectors
are at the top and playback controls are near the bottom. They work and do not
clip, but repeatedly comparing a top map or meter with the result requires
scrolling.

Consider collapsing repeated explanatory panel material when the map or meter
already expresses it. For example, topology repeats voter identities in the map
and three full panels. Keep essential phase-specific facts, majority result,
scope and accessible text, while moving repeated detail into a disclosure or
compact alternative. This would reduce navigation effort without losing useful
understanding. It is an optional refinement, not a pass blocker or a request for
additional figures.
