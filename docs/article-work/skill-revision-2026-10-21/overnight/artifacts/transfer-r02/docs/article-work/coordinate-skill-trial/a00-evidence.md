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


## Repair r02 mechanical record

- First explicit repair clock: 2026-10-21 22:23:31 UTC. Setup and initial reads
  began before that clock; no exact assignment-start time is claimed.
- Observable preparation/read/palette interval: 22:23:31–22:24:53 UTC.
- Editing/coordination: 22:24:53–22:25:16 UTC. Only root index source changed.
- Complete post-edit reread, reference calibration and continuity check:
  22:25:16–22:25:50 UTC, with receipt writing interleaved (the
  component/example preparation read preceded this).
- Code-ready notification: 22:25:16 UTC. Render wait starts there, with records
  and the final source reread interleaved until browser checking is granted.
- [Projected palette and source hash](a00-receipts/repair-r02/pre-render.json)
  is calculation evidence only; actual rendered tokens remain unchecked here.
- Serena's Astro overview was unsupported and its edit rejected the isolated
  root as outside its active project. Direct file patching was used afterwards.
- No build, server, commit or push performed. Original r01 receipts untouched.


### Rendered r02 completion

- First explicit browser clock: 22:26:58 UTC. The browser opened before this
  receipt, following the coordinator's build-r01 PASS and lease grant. The wait
  from 22:25:16 includes final reread/record writing and browser setup, so no pure
  waiting total is claimed.
- Observable rendered-check/cache-repair interval: 22:26:58–22:29:34 UTC, including
  the second build wait. At 22:27:51 the four Code calls received explicit
  `theme="css-variables"` fallback props; palette registrations still come from
  `themes`. Astro's cache key loses nested theme properties and reused the older
  JavaScript highlighter without this distinct fallback.
- [Build-r01 failed measurements](a00-receipts/repair-r02/build-r01-failed-token-measurement.json)
  retain the actual 3.2458:1 dark comments from that first repair build. They are
  not passing current-source evidence.
- Reloaded the coordinator's second consolidated build at the same 4343 URL.
  [Build-r02 measurements](a00-receipts/repair-r02/build-r02-token-measurements.json)
  cover every non-empty leaf token span in all four listings, including comments,
  parameters, punctuation and default text, at actual 960×929 and 375×812, both
  Light and Dark. Four foreground colours occur; minimum contrasts are 5.5227:1
  Light and 6.1478:1 Dark, at 13.12px, on actual rgb(240,237,229) and rgb(38,35,32).
- Actual phone document scrollWidth 375; four code panel widths 343 and local
  scrollWidths 459,632,538,585. Keyboard ArrowRight on the final listing produced
  local scrollLeft 40. No document overflow observed.
- Inspected the four listing appearances and surrounding browser explanation,
  plus the bridge introduction/adjacent space-ladder caption on desktop and phone
  in both themes. Representative images: [desktop](a00-receipts/repair-r02/build-r02-desktop-light-js.jpg),
  [phone Dark](a00-receipts/repair-r02/build-r02-phone-dark-input.jpg),
  [bridge Light](a00-receipts/repair-r02/build-r02-bridge-phone-light.jpg),
  [bridge Dark](a00-receipts/repair-r02/build-r02-bridge-phone-dark.jpg).
- In-app visible browsing is unavailable to this subagent; used a temporary Chrome
  tab. No new timed playback or geometry check was required by these page-only
  repairs. The mathematical/browser implementation and standalone download hashes
  match the original record: [applicability](a00-receipts/repair-r02/final-applicability.json).
- Lease explicitly released 22:29:34 UTC. Restored inherited Dark and reset viewport
  to actual 960×929; closed only the temporary repair tab. [Restored receipt](a00-receipts/repair-r02/browser-restored.json).
- Complete final article source reread and continuity audit after cache repair
  completed 22:29:46 UTC. Final evidence/report packaging followed.
