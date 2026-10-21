# Practitioner review · breakdown · Coordinates in a zoomable editor and contextual child stub · transfer-root-plan-v1

Started UTC: 2026-10-21 21:20:07
Ended UTC: 2026-10-21 21:21:16

Inputs read: the installed D-02 `staycurrent-review/SKILL.md` and practitioner perspective; [fixed manifest](root-manifest.json); the manifest's complete `docs/coverage/coordinate-editor.yaml` and `coordinate-editor-example.md` under `/private/tmp/staycurrent-skills-night-d`; [raw commission](../../transfer-commission.md). Both source-file SHA-256 values match the manifest. No previous versions, other reviews, planner records, candidate commentary or published article scopes were read.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Stated column-vector, browser coefficient and clockwise/downward-axis conventions agree; baseline, order swap, pivot, view rotation, resizing, collapse, zoom and drag arithmetic check out. Primary API checks below support the proposed implementation route. |
| Evidence | pass | Exact arithmetic is identified as a mathematical model; browser layout, rendering, controls and gesture behaviour remain future checks. No unrun implementation is presented as observed. |
| Coverage | pass | Root covers local geometry, nested placement, pan/zoom/rotation, client-to-local hit testing, order mistakes and lost or unstable inverses. It includes a complete small SVG/DOMMatrix route before referral. |
| Depth, both ways | pass | Scalar operations, turned unit steps, coefficient composition and inverse equations supply the mathematics this newcomer needs. Perspective, general linear algebra, rendering engines and gesture recogniser complexity are bounded out. |
| Ownership | pass | Root owns the conversions, implementation route and interaction invariants; the single child earns its page through gesture updates, rotated/resized cases, capture, cancellation and stale-state diagnosis. Its contextual stub is sufficient for commissioning its own plan. |

## Findings

None. No practitioner finding identifiers allocated.

## Checked mathematics and primary sources

Independent scalar recomputation gives `x_W = 140 - y_O`, `y_W = 130 + x_O`, hence `x_C = 460 - 2y_O`, `y_C = 380 + 2x_O`. This confirms the marked and second points, their displacement, composed determinant 4, inverse and card corners. The swapped view order gives `(380, 360)`. The centre remains G `(70, 40)` under its pivot construction. Turning the view gives `(380, 220)` and coefficients `[0, 2, -2, 0, 660, -40]`. Half-size rendering gives C `(280, 240)`; collapse maps both diagnostic points to C `(440, 320)`. Anchored zoom gives pan `(-70, -100)`; the two drag snapshots give G translations `(40, 0)` and `(50, -20)`. These are mathematical checks, not execution evidence.

- [CSS Transforms 1, rendering model and mathematical descriptions](https://www.w3.org/TR/css-transforms-1/#transform-rendering): confirms cumulative local-to-parent mappings, multiplication order, pivot translation and the stated rotation/coefficient layout. Its [transform-list rules](https://www.w3.org/TR/css-transforms-1/#transform-function-lists) also support keeping the singular-collapse teaching trace separate from native painting.
- [Geometry Interfaces 1](https://www.w3.org/TR/geometry-1/), sections 2.1 and 6.3–6.6: confirms column-vector point transformation, six-element constructor order, post-multiplication, degree-based rotation and NaN output for a non-invertible inverse. The planned finite checks are therefore material, rather than a substitute exception-only guard.
- [SVG 2, SVGGraphicsElement](https://www.w3.org/TR/SVG2/types.html#InterfaceSVGGraphicsElement): confirms that `getScreenCTM()` includes the element's transforms, viewBox fitting and the bridge to the document viewport, and can return null. Inverting that complete map once is the appropriate planned client-to-card route.
- [SVG 2, viewport transformation](https://www.w3.org/TR/SVG2/coords.html#ComputingAViewportsTransform): its viewBox fitting algorithm confirms the half-size bridge at matching aspect ratios.
- [CSSOM View, MouseEvent coordinates](https://www.w3.org/TR/cssom-view-1/#extensions-to-the-mouseevent-interface): confirms viewport-relative client coordinates; the plan correctly avoids adding page scroll or device-pixel scaling to that conversion.

## Limits

This is approval of practitioner scope and technical direction at breakdown stage. There is no commissioned article prose, executable browser example or rendered control to verify. No code, build, server, browser or native API execution was performed. The future writer must still verify executable calculations, arbitrary-angle tolerances, current browser matrices and rendered controls separately. Pointer-event API details belong to the uncommissioned child's planning; the stub explicitly requires primary-source checks then. I have not required a complete child outline now.
