# Practitioner review · tree · coordinate editor collection · transfer-tree-v2

Candidate: D-02. Started: 2026-10-21 21:41:27 UTC. Ended: 2026-10-21 21:43:15 UTC.

Inputs read: `tree-r02-manifest.json`; the complete immutable `snapshots/tree-v2/docs/coverage/coordinate-editor.yaml` integrated tree; canonical `coordinate-editor-child.yaml`; `coordinate-editor-example.md`; `snapshots/tree-v2/docs/article-work/coordinate-skill-trial/registry.json`; and `overnight/transfer-commission.md`. Read the assigned review skill and only its practitioner perspective. All four snapshot SHA-256 values match the manifest. Parsing the YAML confirms the integrated child equals the canonical child. No earlier report, finding, repair record, planner note or coordinator opinion was consulted. No prescribed input was omitted.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Model arithmetic, matrix conventions, SVG/client bridge, inverse rejection and the proposed pointer lifecycle agree with independent calculations and the primary specifications below. |
| 2. Evidence | pass | Quarter-turn numbers are explicitly mathematical snapshots; browser observations, executable checks and rendered controls remain future writing obligations. No planned check is credited as an observed result. |
| 3. Coverage | pass | The collection owns nested placement, point/displacement distinctions, composition, pivots, inverse hit testing, anchored gestures and the awkward stale-layout, singular-state, cancellation, capture-loss and button-chord cases. |
| 4. Depth, both ways | pass | Scalar derivation supplies the maths prerequisites; the child adds implementation judgement without repeating the matrix course. No consequential gap or unnecessary specialist branch found against this commission. |
| 5. Ownership | pass | The root owns the complete geometric answer and browser recipe; the sole child owns the connected gesture implementation and event lifecycle. The registry contains these two pages only. |

## Correctness and evidence examined

The six-value ordering, point/displacement homogeneous coordinates, degree-based rotation and non-invertible-matrix NaN behaviour agree with [Geometry Interfaces, sections 2 and 6](https://www.w3.org/TR/geometry-1/). Guarding finite inverse/result values is therefore necessary; exception handling alone is insufficient.

The intended element-local-to-client conversion includes the browser bridge: [SVG 2, SVGGraphicsElement](https://www.w3.org/TR/SVG2/types.html#InterfaceSVGGraphicsElement) specifies the document-viewport mapping, including ancestor transforms and viewBox fitting. The distinction between root SVG user coordinates and its rendered viewport agrees with [SVG 2, coordinate systems](https://www.w3.org/TR/SVG2/coords.html). Client coordinates use CSS pixels relative to the viewport under [CSSOM View, sections 2.1 and 10](https://www.w3.org/TR/cssom-view/#extensions-to-the-mouseevent-interface). The plan correctly avoids adding page scroll or device-pixel scaling to that conversion.

[Pointer Events 3](https://www.w3.org/TR/pointerevents3/) sections 4.1.1, 4.2.4 and 4.2.6 support the proposed chord trace: buttons 1, 3, 2, 2, 0; pointerdown, pointermove, pointermove, pointermove, pointerup. Ending this editor's gesture at the loss of flag 1 is correctly identified as application policy. Sections 4.2.7, 8 and 9 support separate cancellation, predeclared touch-action, capture handling and capture-loss cleanup. None establishes an observed device event trace.

The collapse illustration is appropriately separated from SVG painting: [CSS Transforms, section 10](https://www.w3.org/TR/css-transforms-1/#transform-function-lists) excludes display under a non-invertible current transform. A mathematical collapsed line must not be offered as observed SVG output.

I independently evaluated scalar translation/quarter-turn/scale routes and six-coefficient composition in disposable JavaScript via `functions.exec`; no browser API was invoked. The composed O-to-W, O-to-V and O-to-C values are respectively `[0,1,-1,0,140,130]`, `[0,2,-2,0,340,300]` and `[0,2,-2,0,460,380]`. The last has determinant 4; its computed inverse composes to identity and recovers O `(10,10)` from C `(440,400)`.

Forward checks agree for both diagnostic points, the order swap, card-centre position, turned view, half-size bridge and collapse. They also agree for normal/resized/turned-and-resized card drags, turned-and-resized pan, both anchored zooms, rotation about the marked point, and the deliberately wrong and stale-inverse candidates. In particular the combined drag reaches C `(350,210)` with card translation `(-10,0)`; the wrong rule reaches `(290,180)`, and the stale resize candidate reaches `(220,170)`.

## Coverage, depth and ownership judgement

The root gives an actionable answer before its child link: retain local geometry, compose named mappings, invert the current browser mapping, and validate before using the result. It derives rotation, affine coefficients, multiplication and inversion from the same object rather than assuming linear algebra. Failure analysis includes transform order, mistaken units/axes, nonunique inverses, reflected orientation and amplification near collapse.

The child earns its page through retained anchors, absolute parent-space updates, resize between events and a complete single-pointer lifecycle. Off-origin grabs, actual clamped zoom, rotated views, capture failures and completion with an invalid final conversion have explicit owners and proposed checks. The fixed-linear-part reminder is sufficient for the root's optional card rotation without creating another treatment. Wheel normalisation, multi-touch recognition, inertia and a rendering framework are reasonable exclusions from the commissioned coordinate-space lesson. The root's small gesture derivations supply practical understanding; the child owns their fuller handler route and diagnosis, so this is purposeful reinforcement rather than two full implementations of the same lesson.

## Findings

None. No finding number allocated; the supplied next number remains `practitioner-2`.

## Limits

This is a fresh complete plan/tree review, not approval of unwritten articles or an implementation. No source files were edited, built, served, committed or pushed; only this report was saved. I did not inspect or exercise rendered controls, DOMMatrix/getScreenCTM behaviour, real event delivery, keyboard operation, themes, physical devices or cross-browser compatibility. Those remain explicit future obligations. Arbitrary-angle floating-point tolerances and conditioning policy require validation in the eventual implementation; exact quarter-turn arithmetic does not establish them. This report's executable arithmetic checks establish model consistency only.
