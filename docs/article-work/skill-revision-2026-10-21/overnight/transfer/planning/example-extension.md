# Proposed child example extension

For central integration into the frozen archive's
`docs/coverage/coordinate-editor-example.md`. These values are proposals, pending
the coordinator's settlement. Reset to the canonical baseline before each named
case unless the case explicitly combines two existing extensions.

The child uses the same spaces, entities, column vectors and six-value ordering.
Parameterise the view as `v = z R(theta) w + t_V`; theta is zero initially.
The root's turned-view extension is theta 90 degrees, z 2, t_V `(660, -40)`.
This is its recorded `[0, 2, -2, 0, 660, -40]`, with no extra inversion.

## Additional snapshots

| Case | Initial/target | New stored state | Forward check |
| --- | --- | --- | --- |
| Zoom in the root's turned view | World anchor `(130, 140)` at V `(380, 220)`; z 2 to 3 | t_V `(800, -170)`; theta stays 90 degrees | `3 R(90) (130,140) + (800,-170) = (380,220)` |
| Turn about the marked point | Reset baseline; keep world `(130, 140)` at V `(320, 320)`; theta 0 to 90 degrees | t_V `(600, 60)`; z stays 2 | `2 R(90) (130,140) + (600,60) = (320,320)` |
| Pan a turned, half-size editor | Combine root extensions Turn the view and Half-size editor; move client `(310, 190)` to `(350, 210)` | t_V `(740, 0)`; z 2, theta 90 degrees | Marked point V `(460,260)`, C `(350,210)` |
| Drag in that turned, half-size editor | Reset combined state; grab p_O `(10,10)` at C `(310,190)`, move to C `(350,210)` | Card translation t_G `(-10, 0)`; group and view fixed | p_G `(0,10)`, p_W `(150,100)`, p_V `(460,260)`, p_C `(350,210)` |

The last two cases share a pointer path but change different stored parameters:
pan moves the board; card drag moves only Review within Review lane.

For the last drag, client displacement `(40,20)` becomes V `(80,40)`, W `(20,-40)`
and G `(-40,-20)`. Add that G displacement to the baseline card translation
`(30,20)`, obtaining `(-10,0)`. Independently, inverse-map target C to G `(0,10)`
and subtract retained p_O `(10,10)`. Both routes yield the same translation.

The deliberately wrong update adds client displacement divided by z to t_G.
It gives `(50,30)`; the grabbed point then travels through G `(60,40)`,
W `(120,160)`, V `(340,200)` to C `(290,180)`, missing target `(350,210)`.
Use this only as a labelled failed algorithm, never as a second interpretation
of the canonical geometry. Under unrotated full-size baseline the same wrong
rule already fails because Review lane is turned: it ends at C `(420,440)`
instead of `(480,420)`.

## Resize between events

Reset baseline, grab p_O `(10,10)` at C `(440,400)`, then change only the SVG's
CSS size to `400 by 300`, preserving its client origin `(120,80)` and viewBox.
Before a placement update the mark is now at C `(280,240)`. At the next pointer
sample C `(320,260)`, current inverse mapping gives G `(60,-10)`, so t_G becomes
`(50,-20)` and the retained point reaches C `(320,260)`. Holding the old full-size
inverse instead gives G `(-30,90)` and t_G `(-40,80)`; with the current rendering,
that stale candidate puts the mark at C `(220,170)`. The view/group are fixed.
The demonstration responds on the next update; it does not claim a resize itself
dispatches a pointermove or automatically preserves a stationary pointer anchor.

## Derivation and evidence

Anchored zoom and view rotation solve
`a_V = z' R(theta') a_W + t'_V` for t'_V. The actual bounded z' must be used.
For the translation-only card, solve `pointer_G = g_O + t'_G` for t'_G.
No separate matrix derivation is needed. If a fixed card linear part L is used,
its grab contribution is `L g_O`; any fixed pivot translation must be included
consistently in the stored placement convention.

All tabulated values were checked by scalar quarter-turn steps and forward
substitution during planning. They are mathematical snapshots, not observed
browser execution, and no code or browser was run in this assignment. Writers
must check executable calculations and browser behaviour separately, from one
centrally settled data module shared by both articles' models.
