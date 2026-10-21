# Coordinate editor example: Review board

Settled by the coordinator for the D-02 transfer trial. This is the canonical
collection example beside its tree; propose changes centrally. Article plans
remain drafts pending independent review.

## Scenario and entities

An engineer is building a zoomable diagram editor. A group named Review lane holds
one rectangular card named Review. The card's marked grab point must remain the
same point when the group turns, the view zooms or the pointer moves. No domain
meaning beyond those labels is needed. A group frame can make its local axes and
extent visible, but does not introduce clipping or hit-test priority.

| Space | Name and origin | Units and role |
| --- | --- | --- |
| O | Card space; origin at the card's untransformed upper-left corner | Card geometry units; rectangle and grab point are stored here |
| G | Group space; origin of Review lane | Group geometry units; the card's placement is stored here |
| W | World space; stable board origin | Board units; the group's placement is stored here |
| V | Editor view space; root SVG user-space origin | Root SVG user units; view translation is measured here |
| C | Browser client space; browser viewport origin | CSS pixels; the pointer supplies coordinates here |

Initial axes point right and down. Positive rotation is clockwise in that initial
frame. A transformed local frame follows its transformed axes; do not describe
every local positive y direction as down the page. Degrees are the human-facing
angle unit and DOMMatrix rotation input. Convert explicitly to radians if using
JavaScript trigonometric functions. There is no perspective or 3D transform.

## Notation and operations

- `p_O` is a point expressed in O; `d_O` is a displacement expressed in O.
- `M_A_from_B` converts B coordinates into A coordinates. Compose only when the
  adjacent spaces match: `M_C_from_O = M_C_from_V M_V_from_W M_W_from_G M_G_from_O`.
- Use column vectors. In a product, the rightmost factor acts on the point first.
- A six-value transform `[a, b, c, d, e, f]` means the matrix with rows
  `(a, c, e)`, `(b, d, f)`, `(0, 0, 1)`. Its point equations are
  `x' = ax + cy + e`, `y' = bx + dy + f`.
- Homogeneous point coordinate is 1; displacement coordinate is 0. Translation
  therefore cancels for displacements. Introduce this after the scalar example.
- `T(tx, ty)` translates, `S(sx, sy)` scales, and `R(theta)` turns clockwise in
  the stated initial frame. Derive these names in the article before use.
  `R(theta)` has linear rows `(cos theta, -sin theta)`, `(sin theta, cos theta)`.
- To rotate around a pivot c expressed in the same working space, subtract c,
  rotate, then add c. In matrix notation this is `T(c) R(theta) T(-c)`.
- A view mapping converts world to view. It is not a camera pose requiring an
  additional inversion before rendering. Keep that distinction explicit.

## Baseline state

Reset every independent demonstration to this state unless its change is labelled.

| Item | Baseline |
| --- | --- |
| Card geometry | Filled rectangle `0 <= x_O <= 80`, `0 <= y_O <= 40`; no stroke hit-test requirement |
| Marked grab point | `p_O = (10, 10)` |
| Second diagnostic point | `q_O = (20, 10)` |
| Card centre/pivot | `c_O = (40, 20)` |
| Card placement | `M_G_from_O = T(30, 20) = [1, 0, 0, 1, 30, 20]` |
| Group frame, if drawn | Local rectangle from `(0, 0)` to `(140, 90)` |
| Group placement | `M_W_from_G = T(160, 100) R(90 degrees) = [0, 1, -1, 0, 160, 100]` |
| View | Zoom `z = 2`, pan in V `t_V = (60, 40)`; `M_V_from_W = T(60, 40) S(2, 2) = [2, 0, 0, 2, 60, 40]` |
| SVG | Root user rectangle/viewBox `(0, 0, 800, 600)`, rendered at `800 by 600` CSS pixels, no border or padding, no extra CSS transform |
| Browser bridge snapshot | SVG upper-left in client space `(120, 80)`; `M_C_from_V = [1, 0, 0, 1, 120, 80]` |

The bridge offset is a reproducible worked snapshot, not a fixed assumption about
the eventual page layout. The browser supplies the current bridge, including
viewBox fitting, layout and relevant ancestor transforms. Never silently equate V
and C or equate CSS pixels and hardware pixels.

## Expected arithmetic

| Quantity | O | G | W | V | C |
| --- | --- | --- | --- | --- | --- |
| Marked point | `(10, 10)` | `(40, 30)` | `(130, 140)` | `(320, 320)` | `(440, 400)` |
| Second point | `(20, 10)` | `(50, 30)` | `(130, 150)` | `(320, 340)` | `(440, 420)` |
| Displacement q minus p | `(10, 0)` | `(10, 0)` | `(0, 10)` | `(0, 20)` | `(0, 20)` |

Composed coefficients provide a separate check of the stepwise route:

- `M_W_from_O = [0, 1, -1, 0, 140, 130]`.
- `M_V_from_O = [0, 2, -2, 0, 340, 300]`.
- `M_C_from_O = [0, 2, -2, 0, 460, 380]`, determinant 4.
- Thus `x_C = 460 - 2y_O` and `y_C = 380 + 2x_O`. Reversing gives
  `x_O = (y_C - 380) / 2`, `y_O = (460 - x_C) / 2`; client `(440, 400)` recovers `(10, 10)`.
- Card corners in V are `(340, 300)`, `(340, 460)`, `(260, 460)`, `(260, 300)`.

These are exact quarter-turn model values, independently checked through scalar
steps and expanded composed coefficients. Executable examples must also test them;
this planning pass has not established browser execution.

## Root extensions

Each extension changes only the labelled baseline fields and resets afterwards.

1. **Order comparison.** Swap only view `T(60, 40) S(2, 2)` for
   `S(2, 2) T(60, 40)`. The marked world point now maps to V `(380, 360)`;
   pan has been scaled. The card and group data stay fixed.
2. **Chosen pivot.** Rotate the card about `c_O = (40, 20)` before its recorded
   placement in G. The centre stays fixed in G at `(70, 40)`. Its baseline
   world/view position is `(120, 170)` / `(300, 380)`.
3. **Turn the view.** Post-process the baseline V result with a clockwise
   90-degree turn about V centre `(400, 300)`. The marked point moves from
   `(320, 320)` to `(380, 220)`. The resulting world-to-view coefficients are
   `[0, 2, -2, 0, 660, -40]`. This demonstrates that view rotation uses the same
   pivot construction; it does not rotate stored board geometry.
4. **Half-size editor.** Retain the viewBox but render the root SVG at
   `400 by 300` CSS pixels, at client `(120, 80)`. Matching aspect ratios give
   `M_C_from_V = [0.5, 0, 0, 0.5, 120, 80]`. The marked client point is now
   `(280, 240)` while its V coordinates stay `(320, 320)`.
5. **Collapse.** Replace the group mapping with
   `T(160, 100) R(90 degrees) S(0, 1)`. Both p and q map to W `(130, 100)`,
   V `(320, 240)`, C `(440, 320)`. The composed determinant is zero. This is
   a mathematical collapse illustration; SVG may suppress painting under a
   singular transform, so a teaching trace must not claim to be observed SVG
   rendering. The production gesture path rejects such state.

## Proposed gesture-article extensions

These are concrete shared-state proposals, not child headings or a settled child plan.

- **Anchored zoom.** At the baseline marked pointer, change z from 2 to 3 while
  retaining world anchor `(130, 140)` at V `(320, 320)`. New view pan is
  `(-70, -100)`. For this unrotated view, derive `t'_V = a_V - z' a_W`; the
  world anchor comes from the old inverse, not from client coordinates directly.
- **Card drag.** Grab p at baseline client `(440, 400)`, then move the pointer
  to `(480, 420)`. Client and V displacement `(40, 20)` becomes W `(20, 10)`
  and G `(10, -20)`. New card translation in G is `(40, 0)`. Its retained local
  grab point then lands at the new pointer. Group and view remain fixed.
- **Resized drag.** Reset, apply the half-size editor extension, grab at client
  `(280, 240)` and move to `(320, 260)`. The same client displacement becomes
  V `(80, 40)`, W `(40, 20)`, G `(20, -40)`. New card translation is `(50, -20)`.
- **Rotated-view interaction.** Reuse the root's turned-view extension rather
  than invent a new board. Child planning should derive its own anchor/drag
  snapshots and send any additional state to the orchestrator for settlement.
- **Invalid update.** A non-finite coordinate or failed inverse leaves the last
  valid state intact and reports that the gesture cannot be mapped. Normal zoom
  controls may use the explicit illustrative range `0.25 <= z <= 4`; the
  collapse demonstration is separate. This range is product policy for the
  example, not a general numerical guarantee.

## Shared implementation and evidence conventions

When commissioned, put the settled values in one data module imported by model
files. Keep geometry, placements and derived matrices separate; do not copy
constant values into multiple figures. A browser implementation may use the
element's `getScreenCTM()` to obtain the complete current O-to-C mapping and its
inverse to map a client pointer. It must not apply the explicit model chain again
after that conversion. Check a missing matrix and finite inverse/result values.

Model comparisons use exact expectations where possible and documented tolerances
for floating-point arbitrary angles. Numerical stability is not established by an
unexplained absolute determinant threshold. Keep model checks, browser API checks
and rendered interaction checks distinct. No browser behaviour, gesture lifecycle
or compatibility result is claimed by this proposal.
