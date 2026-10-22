# a01 repeat evidence index

Initial author QA completed on coordinator build-r06. Repair r02 was checked on coordinator build-r08; all 13 site rules pass according to the coordinator. This remains an isolated draft, not published reading.

## Executed model and policy checks

[Model receipt](receipts/model-check.json): actual `node src/components/coordinate-trial/a01/verify.mjs`, 78 passing assertions. These cover canonical drag/anchor/pan snapshots, wrong updates, stale inverse, off-origin grabs, one move versus ten, arbitrary angles, zoom bounds and invalid inputs. Exact quarter-turn expectations; arbitrary-angle/forward tolerance 1e-7 in the equation's destination units.

Injected lifecycle checks cover both Card and Pan: primary/secondary chord 1→3→2→2→0; completion at initiating-button loss; invalid final update still clears; no later movement; cancellation/capture loss keep last valid state; other pointer ignored; failed capture and invalid update clear. These are policy checks, not observed browser events. Runtime syntax exited 0 after the browser adapter repair. Author started no build/server.

## Actual CUA browser observations

Chrome at http://127.0.0.1:4344/review/skill-transfer/gestures/, exclusive coordinator lease. Ordinary CUA role locators and native tab.drag/coordinate wrappers only; no external browser transport, download API or arbitrary page mutation.

- [All 16 comparison states](receipts/browser-traces.json): four presets × Card/Pan × derived/wrong choice, visible results checked. Their model stayed unchanged through r06. Resize stale mapping separately displayed translation G (−40,80), grab C (220,170), target C (320,260).
- [Six live drags](receipts/browser-live-drags.json): Card/Pan under baseline, half width and turned-half view, grabbing the centre rather than canonical mark. Actual centre movement (40,20) CSS pixels within 1e-4; worst difference approximately 1.53e-5 pixels. Each wrapper delivered eight movement samples.
- [Capture beyond SVG](receipts/browser-outside-capture.json): both tools completed after dragging outside the editor. Recorded pointerdown, gotpointercapture, movement, pointerup and lostpointercapture; Card/Pan changed their distinct stored parameters.
- [Anchor controls](receipts/browser-anchors.json): actual keyboard entry reproduced baseline zoom pan (−70,−100), turned zoom (800,−170), marked-pivot turn (600,60), arbitrary 37° anchoring, wrong-rule misses, unchanged state at both zoom bounds and retention after a blank request. Pointer-chosen pivot reached V (480,300), then retained world (210,130) there through zoom.
- [Browser matrices](receipts/browser-matrices.json): actual raw return was SVGMatrix; DOMMatrix.fromMatrix normalisation worked. Baseline/half/turned-half coefficients agreed with the composed route, and the mark returned to O (10,10). A separate post-drag check differed by approximately 2.41e-6 in one coefficient. Browser observations are distinct from exact-model tolerances.
- [Size toggle](receipts/browser-size-toggle.json): root width 315→157.5 CSS pixels at phone width; following native drag completed using the current mapping.

The initial real drag was rejected because the guard assumed the raw matrix supplied is2D; this was repaired before passing observations. CUA's read-only DOM scope also does not expose SVG getScreenCTM methods. Actual matrices were inspected through the ordinary article diagnostic button, not by treating that scope error as an application result.

Supported input route for reviewers: Chrome tab.drag produced the recorded stream; role-based selectOption worked. Number controls worked with press('ControlOrMeta+A'), pressSequentially(value), then press('Tab'); ArrowUp also changed angle. The [locator-fill attempt](receipts/locator-fill-attempt.json) changed displayed inputs without committing a change; it is not counted as successful control testing.

## Rendered checks

- Actual 375×900 confirmed; document width remained 375, including expanded sources. Viewport reset restored original 960×929; original System theme choice restored.
- [Visual receipt](receipts/browser-visual.json): minimum source syntax contrast 6.15:1 dark, 5.52:1 light; light notes 6.05:1. Original dark comments measured 3.25:1 and were replaced with site-token colours. All source disclosures were opened/read.
- [Final structure](receipts/browser-final-structure.json): no figure headings or duplicate manual contents, summary-section margins 0. Hidden resize control confirmed absent at baseline.
- Phone figures, row-card tables and text alternatives inspected. Tiny phone SVG text replaced by an external shape legend. Captions, symbols, controls and numeric outcomes agree with the example.
- Screenshots: [dark trace](receipts/phone-trace-dark.png), [light trace](receipts/phone-trace-light.png), [dark editor](receipts/phone-editor-dark.png), [light editor](receipts/phone-editor-light.png), [dark source](receipts/phone-code-dark.png), [light source](receipts/phone-code-light.png), [compact summary](receipts/phone-text-summary-light.png). Earlier issue screenshots are named before or first-read.

## Limits

Exposed keyboard routes did not produce a changed native preset selection; keyboard preset success is not claimed. Native chorded-button release, cancellation, unexpected capture loss, capture/missing/singular-matrix fault injection and resize during one held drag could not be driven through the ordinary wrapper route. They have model/injected-policy coverage above, not native-browser coverage. Pre-resized and toggled-size actual drags ran. No physical touch/pen or cross-browser coverage is claimed.

## Sources and timing

Primary sources read 21 October UTC: [Pointer Events 3](https://www.w3.org/TR/pointerevents3/) button states, movement/up, cancellation, touch-action and capture; [SVGGraphicsElement](https://www.w3.org/TR/SVG2/types.html#InterfaceSVGGraphicsElement) current local-to-client mapping; [Geometry Interfaces](https://drafts.csswg.org/geometry/#dom-dommatrix-invertself) inverse failure values. Completion/keep-last-valid choices are editor policy, not API rollback.

[Clock receipts](receipts/timing.json) distinguish preparation, writing/checks, repairs, rendering and recording. Per user correction, the unseen-authorisation-prompt wait and associated queue are excluded from speed, process and quality assessment; raw receipts remain separately attributed. [Initial seal](receipts/first-draft-seal.json) predates supplied parent context and later QA; coordinator preserved that source unchanged.


## Repair r02: complete reader handoff and trace bounds

[Source and focused checks](receipts/repair-r02/source-and-checks.json) bind the final child/component/runtime/generator/verifier and unchanged shared data/geometry/model/policy. The 78 model/policy assertions were rerun successfully. The new verifier parses the actual delivered classic script, checks all five embedded module bodies and 32 named DOM bindings, and makes 160 point/outline containment checks including wrong/stale outcomes at one common comparison scale.

[Fresh browser receipt](receipts/repair-r02/browser-repair.json): exact built download href decoded through read-only CUA DOM inspection, 34,532 bytes, SHA256 `462fd00853be37bda00dbbce32c4d3308632420602c56b75fe524f0b03575957`. It equals the builder output byte for byte. The coordinator independently verified and served those identical bytes for QA. [Reader file](receipts/repair-r02/review-gesture-editor.html).

- [Thirteen reader comparison states](receipts/repair-r02/reader-observations.json): four presets × derived Card, wrong Card and Pan, plus stale resize. Every displayed outcome matches the canonical arithmetic and every outline remains inside the new bounds.
- [Native reader drags](receipts/repair-r02/reader-native.json): Card and Pan retain the arbitrary centre grab through a 40×20 CSS-pixel move. Largest observed error 0.00003052 CSS pixels; completed capture/event streams observed.
- [Reader controls](receipts/repair-r02/reader-controls.json): marked-point zoom pan (−70,−100), keyboard-entered 90° turn pan (600,60), size toggle and actual mapping round trip to O (10,10); zero maximum coefficient error in this bounded check. No console errors were returned.
- [Current article states and source widths](receipts/repair-r02/article-states.json): current turned wrong/stale resize results, 375px document with all source panels open; 343px source containers scroll internally.
- Actual375×812 current article inspected in both themes: [light full baseline trace](receipts/repair-r02/article-trace-light-phone.png), [dark full baseline trace](receipts/repair-r02/article-trace-dark-phone.png), [light handoff paragraph](receipts/repair-r02/handoff-light-phone.png), [dark handoff paragraph](receipts/repair-r02/handoff-dark-phone.png). Full outline, legend, target/result, common-scale statement and readouts agree. Keyboard Space toggled Reveal/Hide with visible focus.

Two viewport attempts which did not change the article width were excluded and reset before valid phone checks. A first clipped screenshot was superseded. Direct file navigation was blocked by browser URL policy, so file-protocol execution and the actual download-click/save flow remain unverified; the identical handoff was executed through the approved localhost HTTP surface. Static delivery inspection establishes absence of external runtime/style/module dependencies, separately from that observed execution.

The original native drags/anchor/lifecycle evidence remains applicable only to unchanged geometry, state-update and event-policy paths. The full runtime hash changed for the pure trace-bounds helper, its draw call and comparison prompt; no gesture/update/lifecycle logic changed. New handoff execution and bounds evidence above supersedes reliance on older evidence for those changed areas. Cross-browser, physical-device, native chord/cancel/fault-injection and held-drag-resize limits remain unchanged. Original palette/source-token contrast remains applicable: no site colour or syntax-theme changes were made. The standalone handoff uses its own embedded system-responsive palette and was visually checked in the resolved dark theme; standalone light-theme execution is not claimed.

[Restoration](receipts/repair-r02/restoration.json): 1488×917, width1488, System checked/resolved dark; owned tabs closed and exclusive lease released at 01:59:53 UTC. No source edit followed r08 readiness.
