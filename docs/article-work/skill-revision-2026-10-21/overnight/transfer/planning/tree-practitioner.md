# Practitioner review · tree · coordinate-editor a00–a01 · transfer-tree-v1

Started UTC: 2026-10-21 21:34:17
Finished UTC: 2026-10-21 21:35:32

Inputs read: the installed D-02 `staycurrent-review/SKILL.md` and its practitioner perspective; the complete root and child in `/private/tmp/staycurrent-skills-night-d/docs/coverage/coordinate-editor.yaml`; the adjacent canonical `coordinate-editor-example.md`; `docs/article-work/coordinate-skill-trial/registry.json`; the raw [commission](../../transfer-commission.md); and [tree manifest](tree-manifest.json). All three fixed source-file SHA-256 values match the manifest. No earlier reports, planner records, coordinator opinions or other candidates were read. The manifest's status is metadata, not review evidence.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | The complete mathematical chain, canonical extensions and gesture equations agree; the consequential browser claims match the primary sources below. |
| Evidence | pass | Mathematical snapshots, future executable checks, browser observations and rendered-control checks are explicitly distinguished. No browser execution is claimed. |
| Coverage | finding | Both articles address the commissioned geometry and practical failures; the child's primary-button lifecycle leaves one ordinary mouse case unspecified (practitioner-1). |
| Depth, both ways | pass | The root derives the necessary algebra through the example; the child earns its page through absolute gesture updates, current mappings and lifecycle. No further mathematical survey or framework machinery is needed. |
| Ownership | pass | The root owns spaces, affine construction/composition, pivots, inversion and the browser bridge. The child owns connected gesture handlers and lifecycle, reusing those foundations. The root supplies a usable geometry/implementation route and anchor explanation before referring onwards. |

## Findings

### practitioner-1 · medium · a01, “Give the gesture a beginning and an end” and its verification list

Problem: The plan accepts a primary-button start, then specifies completion on `pointerup`, but neither defines nor tests what happens when the primary button is released while another mouse button remains held. This remains a single-pointer interaction. Pointer Events report such button changes through `pointermove`; `pointerup` occurs only when the pointer leaves the active-buttons state.

Effect: A straightforward implementation of the prescribed lifecycle can keep moving the card or board after the user releases the button that started the drag. The reader must discover the event distinction and supply the missing completion policy themselves, despite the child's promise of a complete small gesture implementation.

Suggestion: Choose a small explicit policy for loss of the initiating primary button, inspect the matching pointer's `buttons` state during moves, and end/clean up according to that policy. Add the sequence primary down → secondary down → primary release → movement → secondary release to the lifecycle checks. This needs only a local explanation, not a broader input framework.

Evidence: [Pointer Events 3, chorded button interactions](https://www.w3.org/TR/pointerevents3/#chorded-button-interactions), [button-state table](https://www.w3.org/TR/pointerevents3/#the-buttons-property) and [pointerup](https://www.w3.org/TR/pointerevents3/#the-pointerup-event) establish the different delivery path. The finding concerns missing planned behaviour, not observed broken code.

## Technical evidence checked

- [Geometry Interfaces Level 1](https://www.w3.org/TR/geometry-1/), §§2.1, 6.3 and 6.5–6.6: column-vector transformation, six-value matrix initialisation, multiplication, rotation units and non-invertible `inverse()`/`invertSelf()` results support the planned conventions and finite-value guard.
- [CSS Transforms Level 1](https://www.w3.org/TR/css-transforms-1/), §§3, 9–10 and 14: transform composition, pivot construction, clockwise positive rotation in the stated axes, matrix coefficients and suppression of painting for non-invertible CTMs support the plan. The collapse trace correctly remains a mathematical model.
- [SVG 2 coordinate systems](https://www.w3.org/TR/SVG/coords.html), §§8.1–8.2, and [SVGGraphicsElement.getScreenCTM](https://w3c.github.io/svgwg/svg2-draft/types.html#__svg__SVGGraphicsElement__getScreenCTM): root user space, viewBox fitting, layout bridge and a current element-to-document-viewport matrix support the intended half-size and inverse-mapping examples.
- [CSSOM View](https://www.w3.org/TR/cssom-view/#extensions-to-the-mouseevent-interface) supports viewport-relative client coordinates; no extra page-scroll or device-pixel-ratio correction belongs in that client-space conversion.
- [Pointer Events 3](https://www.w3.org/TR/pointerevents3/), §§4.2, 8–9: capture, cancellation, predeclared `touch-action`, failed capture and implicit release/capture-loss justify the rest of the proposed lifecycle.

Independent scalar substitution checked the baseline point/step, composed coefficients and inverse; swapped order; centre pivot; turned view; half-size bridge; collapsed group; both zoom compensations; marked-point rotation; ordinary/resized/turned drags; turned-view pan; and resize-between-events counterexample. For example, in the turned half-size state the G-to-C map simplifies to `C = (350 − x_G, 220 − y_G)`: target `(350,210)` requires G `(0,10)` and card translation `(-10,0)`, while the labelled wrong translation `(50,30)` puts the grab at C `(290,180)`. In the resized unturned state, `C = (310 − y_G, 200 + x_G)` confirms both the valid `(320,260)` result and stale candidate's `(220,170)` result. These are review arithmetic, not browser observations.

## Limits

This is a complete practitioner assessment of the two-article plan against the commission, not article or visual approval. No source edits, implementation, executable mathematical verification, build, server, browser inspection, device testing or compatibility testing were performed. Rendered controls, actual CTMs and event delivery remain writing-stage verification obligations. The referenced `child-record.md` was withheld under the fixed-input assignment; the API claims were instead checked directly against the primary specifications. No non-practitioner perspectives were applied.
