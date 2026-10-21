# Child planning repair r02

Started UTC: 2026-10-21 21:39:13  
Finished UTC: 2026-10-21 21:40:30

Frozen candidate: D-02. Scope: accepted required medium finding `practitioner-1` only. Read the frozen breakdown and continuity skills, complete integrated tree and child plan, canonical [Review board example](/private/tmp/staycurrent-skills-night-d/docs/coverage/coordinate-editor-example.md), raw [commission](../../transfer-commission.md), repository README/site direction, and the assigned practitioner report. No other review reports were read.

The complete proposal is [child-r02.yaml](child-r02.yaml). Only the lifecycle brief and its verification brief change. A matching move checks the initiating button/contact flag before deciding whether to continue. Loss of that flag completes through the same path as a matching pointer-up: attempt one guarded final update, retain the last valid placement if it fails, clear active state, and release capture if held. Clearing active state first and repeat-safe cleanup prevent later capture loss or the last button's release from finishing twice. Idle movement cannot restart the gesture. The same policy covers Card and Pan.

## Primary-source check

Checked [Pointer Events 3, button states](https://www.w3.org/TR/pointerevents3/#button-states), [pointermove](https://www.w3.org/TR/pointerevents3/#the-pointermove-event), [pointerup](https://www.w3.org/TR/pointerevents3/#the-pointerup-event), and [capture release](https://www.w3.org/TR/pointerevents3/#releasing-pointer-capture). Button changes within a mouse chord use pointermove; pointerup follows the last release. The primary/contact flag is 1 and the secondary flag is 2. [Capture loss](https://www.w3.org/TR/pointerevents3/#the-lostpointercapture-event) follows release. These establish event semantics; the completion and invalid-final-update choices above are editor policy.

Proposed lifecycle extension for central integration: primary down → secondary down → primary release → movement → secondary release, with buttons 1 → 3 → 2 → 2 → 0. Finish at primary release; later movement must leave placement unchanged. No geometric starting state, coordinates, transforms, names or numerical expectations change. The extension adds input-state expectations only, so it needs no new board snapshot or shared geometry data.

## Continuity and checks

Audited the entire planned reading order against the integrated root and example record, including named figures/tables, controls and step sequences. Root dependencies remain explicit: space names and browser bridge are recalled and linked before the child uses them; retained anchors, transform conventions and all worked snapshots remain unchanged. In the repaired section, button and buttons are distinguished locally; combined flags and the flag-1 test are explained before the lifecycle sequence uses them. The new sequence uses primary/secondary button names consistently, retains the existing Card/Pan labels and Gesture lifecycle table, and distinguishes completion from cancellation. No downstream geometry or figure changes are required; the coordinator should incorporate the input sequence with this child plan.

The YAML parses and retains the six top-level headings and existing nested heading. A structural comparison confirms all other headings and briefs are unchanged. This is a plan repair; no article, executable gesture, browser/device observation, build, server, review round, commit or push was produced. The added observed-event and successful/rejected completion checks remain writer obligations.
