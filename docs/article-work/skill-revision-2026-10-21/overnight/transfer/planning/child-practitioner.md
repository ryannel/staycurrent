# Practitioner review · breakdown · Keep a diagram under the pointer · transfer-child-plan-v1

Inputs read: the manifest `child-manifest.json`; the three manifest-matched files under `/private/tmp/staycurrent-skills-night-d/docs/coverage/` (`coordinate-editor-child.yaml`, parent `coordinate-editor.yaml`, shared `coordinate-editor-example.md`); the raw `transfer-commission.md`; the installed source root's `staycurrent-review/SKILL.md` and practitioner perspective. All three SHA-256 hashes matched the manifest. The workspace-installed review skill/perspective were also initially read; the frozen source-root installation governs this review. No sibling or further child is proposed. Planner records, previous reports, coordinator opinions, candidate/history files and other overnight work were withheld. The plan's reference to `child-record.md` was not followed; API claims were checked independently.

Highest severity: none

Start UTC: 2026-10-21 21:29:51
End UTC: 2026-10-21 21:30:31

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Independently substituted all gesture snapshots and the stale-map counterexample; browser mapping, inverse and lifecycle proposals agree with the primary sources below. |
| Evidence | pass | Shared numbers are explicitly mathematical snapshots; the plan requires separate executable arithmetic, actual event observations and rendered-control checks, without claiming any has happened. |
| Coverage | pass | Pan, anchored zoom, chosen-pivot rotation, arbitrary grabs, parent-space drag, resizing, current mappings, bounds, invalid conversions, capture failure, completion and cancellation all have assigned treatment. |
| Depth, both ways | pass | No missing understanding identified at breakdown level; no unnecessary depth identified. Matrix derivation remains prerequisite material, and optional fixed card rotation is a bounded reminder. |
| Ownership | pass | Root owns spaces, affine composition/inversion and a useful baseline editor answer; child owns retained-point updates, connected handlers, lifecycle and failure diagnosis. Shared zoom arithmetic is purposeful recap, not a second matrix course. |

## Findings

None. No practitioner finding number consumed; the assigned starting label was practitioner-1.

## Independent arithmetic checks

These are this reviewer's scalar substitutions, not accepted planner verdicts or observed browser execution. With the quarter-turn group, `W = (160 - G_y, 100 + G_x)`; the turned view is `V = (660 - 2W_y, -40 + 2W_x)`; the half-size bridge is `C = (120 + V_x/2, 80 + V_y/2)`.

| Snapshot | Independent result |
| --- | --- |
| Normal drag | Target C `(480,420)` inverses to G `(50,10)`; subtract grab `(10,10)` to obtain translation `(40,0)`. |
| Resized drag | Target C `(320,260)` gives V `(400,360)`, W `(170,160)`, G `(60,-10)` and translation `(50,-20)`. |
| Turned, resized drag | Target C `(350,210)` gives V `(460,260)`, W `(150,100)`, G `(0,10)` and translation `(-10,0)`. Forward substitution returns the target. |
| Wrong drag rule | Translation `(50,30)` sends the grab through G `(60,40)`, W `(120,160)`, V `(340,200)` to C `(290,180)`. The baseline wrong-rule endpoint is C `(420,440)`. |
| Turned, resized pan | Retained W `(130,140)` maps to V `(460,260)` with new pan `(740,0)`, then C `(350,210)`. |
| Anchored zoom | Baseline: `(320,320) - 3(130,140) = (-70,-100)`. Turned: `(380,220) - 3(-140,130) = (800,-170)`. |
| Chosen-pivot rotation | `(320,320) - 2(-140,130) = (600,60)`, distinct from the root's centre-turn pan `(660,-40)`. |
| Resize between events | The current inverse gives translation `(50,-20)`; the old inverse gives G `(-30,90)` and translation `(-40,80)`, whose current forward image is C `(220,170)`. |

The absolute equations retain the original grab/anchor rather than accumulated event deltas. The clamped zoom must enter the compensating-pan equation; when the accepted zoom is unchanged, substitution returns the old pan mathematically. Floating-point tolerance and executable checks remain writing work.

## Primary sources checked

- [SVG 2, SVGGraphicsElement methods](https://w3c.github.io/svgwg/svg2-draft/types.html#InterfaceSVGGraphicsElement): `getScreenCTM()` includes the element transform, ancestor transforms, viewBox fitting and the document-viewport bridge; it can return null. This supports selecting a known card/parent/root element, inverting once, and avoiding a second model chain.
- [SVG 2, viewport transform calculation](https://w3c.github.io/svgwg/svg2-draft/coords.html#ComputingAViewportsTransform): an 800 by 600 viewBox fitted into 400 by 300 has scale 0.5 on both axes in this stated layout.
- [Geometry Interfaces, inverse and mutable transformations](https://www.w3.org/TR/geometry-1/#dom-dommatrixreadonly-inverse): `inverse()` copies and invokes inversion; noninvertible matrices produce NaN attributes. The planned finite checks are necessary; exception handling alone is insufficient.
- [Pointer Events 3, capture](https://www.w3.org/TR/pointerevents3/#setting-pointer-capture): capture retargets delivery and can fail; pointer-up/cancel implicitly release it. Idempotent cleanup and the plan's explicit failed-capture handling are appropriate. [Touch-action](https://www.w3.org/TR/pointerevents3/#the-touch-action-css-property) governs browser manipulation separately and must be set before interaction. Keeping the last placement on cancellation is correctly labelled editor policy.

## Limits

This is a complete five-check breakdown review, not implementation acceptance. No article, executable geometry implementation, browser, build, server, event injection or rendered controls were run. The mathematical checks establish consistency of the proposed values and equations only. Browser matrix timing, silent capture-failure handling, exact handler wiring, arbitrary-angle numerical behaviour, accessibility and light/dark rendering must still be verified in the commissioned isolated implementation. No claim of device or cross-browser coverage follows from these sources.
