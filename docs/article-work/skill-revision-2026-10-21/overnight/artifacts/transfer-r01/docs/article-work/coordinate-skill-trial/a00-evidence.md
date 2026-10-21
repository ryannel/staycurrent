# a00 mechanical evidence

This receipt records execution; teaching/continuity decisions live in
[a00-work.md](a00-work.md). The coordinator maintains [evidence.md](evidence.md).

## Time

- Assignment start clock: 2026-10-21 21:44:07 UTC.
- Preparation, references, commission/tree/example and shared interface:
  21:44:07–21:45:52 UTC (1m45s). Shared modules first ready 21:44:45 UTC.
- First draft, figures and recipe: 21:45:52–21:51:21 UTC (5m29s).
- Model check and code-ready notification: 21:51:21 UTC; explicit assertion
  execution is separate from browser verification.
- Post-draft coordination interval: 21:51:21–22:00:21 UTC. This included finished-child
  reading, records, build-compliance fixes, the diagnostic addition and waiting for
  the shared browser lease. Active work and waiting were interleaved, so no exact
  pure-wait total is claimed.
- Browser lease granted 22:00:21 UTC; first root browser tab opened about 22:00:50.
  Browser verification and finishing ran until 22:09:26 UTC, including the r04
  failure, guard/phone repairs, and waiting for r05/r06. This is an 8m36s browser
  and finishing interval, not extra first-draft time.
- Lease explicitly released 22:09:26 UTC. Receipt/source packaging followed.
- Durable source/receipt packaging completed 22:11:10 UTC; this is the author return end time.
- No independent review or review-directed repair was performed by this author.

## Model execution

Executed `node src/components/coordinate-trial/a00/verify.mjs` in the isolated
archive, exit 0, 190 checks. [JSON receipt](a00-receipts/model-check.json).
Checks compare stepwise and composed baselines, second point, displacements,
card corners, inverse recovery, pivot choice, swapped order, centre-turned view,
half-size bridge, collapse, reflection, anchored zoom and arbitrary-angle round
trips at zoom .25,1,2,4. Tolerance is 1e-9 for floating-point calculations.
These checks establish model arithmetic only.

Executed `node src/components/coordinate-trial/a00/make-download.mjs`, exit 0,
at 21:51:21 UTC. It generated `editor.html` from the same live markup,
browser implementation and centrally imported example. No remote dependency.

## Primary-source checks

Read via web tool on 21 October 2026:

- [SVG 2 coordinate systems](https://www.w3.org/TR/SVG2/coords.html): SVG
  user spaces, viewBox fitting and their distinction from CSS viewport units.
- [SVGGraphicsElement](https://www.w3.org/TR/SVG2/types.html#InterfaceSVGGraphicsElement),
  getScreenCTM algorithm: element-to-document-viewport mapping, including
  ancestors, root viewBox, preserveAspectRatio and CSS layout boxes.
- [Geometry Interfaces](https://www.w3.org/TR/geometry-1/): column-major
  six-value order, DOMMatrix postmultiplication, degrees and inversion failure.
- [CSSOM View](https://www.w3.org/TR/cssom-view-1/#extensions-to-the-mouseevent-interface):
  clientX/clientY relative to viewport; page coordinates include scroll offsets.
- [CSS Transforms, transform function lists](https://www.w3.org/TR/css-transforms-1/#transform-function-lists):
  non-invertible current transformations are not displayed. This supports keeping
  the collapse figure as a mathematical trace rather than claiming SVG painting.

## Browser execution

Used visible Chrome through CUA on the coordinator's static port 4343. The loaded
root was checked at actual 960×873 initially, 960×900, and 375×900 CSS viewport
dimensions. Light and Dark themes were checked; final 375×900 Dark confirmation
used the coordinator's r06 build. The temporary viewport override was reset at
release, returning to actual 960×873; Dark was retained as inherited.

- All ten figures inspected; all ten text disclosures opened and closed with Enter.
  Reference figure states and outcome summaries were also inspected through the
  enabled Sequence diagrams, Indexes and Storage and durability previews.
- [Order options](a00-receipts/order-options-r04.json): all six allowed zoom values
  and both emphasised orders exercised with keyboard/select input. After the r05
  layout change, both selectors, reset and the maximum-zoom swapped result were
  checked again. Example repaired layouts: [phone light](a00-receipts/figure-6-phone-light-r05.jpg),
  [phone dark](a00-receipts/order-phone-dark-r05.jpg), [desktop dark](a00-receipts/order-desktop-dark-r05.jpg).
- [Browser matrices](a00-receipts/browser-matrices-r05.json): full/half page width,
  centre-turned view, baseline zoom 2 → 3, turned zoom 2 → 3, clamping at 4, repeated
  request at 4, reset and arbitrary 15° / zoom 1.25 / pan (80, 50). Recorded current bridge
  was composed with stored matrices and compared with the card's getScreenCTM;
  all recovered O (10,10), within floating-point error. Raw return type was
  SVGMatrix, is2D absent. Quarter-turn coefficient comparisons were exact.
  The arbitrary-angle maximum coefficient difference was 0.0000032466997055280444;
  this browser observation is separate from the mathematical verifier's 1e-9
  tolerance. No browser precision guarantee is inferred from it.
- [Pointer and invalid-state receipt](a00-receipts/pointer-and-invalid-r05.json):
  locator-triggered card-centre click recovered O (40, 20), outside click reported
  outside, numeric controls and keyboard increments worked, rejected zoom 0 kept
  the previous state. No physical mouse, touch or pen delivery coverage is claimed.
- [Theme receipt](a00-receipts/theme-contrast-r05.json): figure text/background token
  pairs measured 13.73:1 Light and 10.89:1 Dark; Dark panel pair 12.10:1. SVG strokes
  use the same foreground. Article scrollWidth equalled 375 at phone width and 960
  at the desktop check. This is a token-pair measurement, not an exhaustive page
  accessibility audit.
- Standalone served asset `/_astro/editor.qIdBwy6S.html` opened in a visible tab;
  mapping, card-centre hit and anchored zoom worked, with no console errors.
  [Browser receipt](a00-receipts/download-browser-r05.json),
  [screenshot](a00-receipts/download-r05.jpg). Its baseline coefficient difference
  was about 5.7e-14 at that tab's actual layout. The
  [freshness verifier](a00-receipts/verify-download.mjs) passed 4 checks tying the
  exact current browser implementation, canonical example and markup to both
  standalone source and served artifact: [receipt](a00-receipts/download-applicability.json).
- [Final r06 receipt](a00-receipts/final-browser-r06.json) confirms current
  card-centre caption, actual 375×900 Dark mapping and local hit;
  [final screenshot](a00-receipts/editor-phone-dark-r06.jpg).
  No console errors were reported in the successful r05/r06/standalone checks.

The earlier r04 unavailable-mapping screenshot and compact phone screenshots are
retained as pre-fix receipts; they are not passing current-source evidence.
[Final source hashes](a00-receipts/source-version.json) identify applicability to
r06. The coordinator owns build/site-check receipts in [evidence.md](evidence.md).
No build, server, commit or push was run by this author.
