# Practitioner review · article batch · a00 and a01 · D-ARTICLE-r01

Started: 2026-10-21 22:13:40 UTC. Completed: 2026-10-21 22:16:18 UTC.

Inputs read: [fixed manifest](manifest.json), [mechanical evidence whitelist](mechanical-inputs.json), complete `index.astro` and `gestures.astro` under `/private/tmp/staycurrent-skills-night-d/src/pages/review/skill-transfer/`, the held-out commission, complete canonical `docs/coverage/coordinate-editor.yaml` tree/briefs and `coordinate-editor-example.md`. Read shared example/geometry, both model modules, a00 browser implementation and all four specialised figures, a01 complete handlers and GestureFigure, both native verifiers and the download applicability verifier. All frozen source and whitelisted evidence hashes matched. No author narrative, previous review, repair history or quality verdict was consulted. The theme-contrast receipt was not read; viewport/theme judgement belongs to visual review.

Highest severity: critical

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | finding | Core maths, browser mapping recipe and gesture lifecycle agree with independent arithmetic and the primary specifications; practitioner-2 concerns the child figure's unqualified caption. |
| Evidence | pass | Worked routes and comparisons are labelled models; browser measurements and simulated lifecycle evidence are distinguished from physical-device or compatibility results. Applicable receipts were checked against this frozen source. |
| Coverage | pass | Root covers local geometry, named spaces, pivots, multiplication order, guarded inverse/hit test and singularity; child covers pan, bounded anchored zoom/turn, actual grabs, current mappings, resize, capture, chords and termination. |
| Depth, both ways | pass | Necessary notation is derived from scalar operations. Near-singular error amplification and determinant limitations are useful practitioner judgement. Wheel normalisation, multi-touch recognition and framework machinery need no treatment within this commission. |
| Ownership | pass | Root supplies a usable geometric implementation before the child link. Child owns the connected gesture/lifecycle route and recalls the root's maths without repeating a full derivation. |

## Findings

### practitioner-2 · critical · a01, Gesture comparison caption

Problem: `src/components/coordinate-trial/a01/GestureFigure.astro:11` says “the shortcut misses” without specifying the algorithm or the state in which failure occurs. The same figure offers **Reuse pointer-down inverse** alongside the derived and divide-by-zoom updates. Reusing that inverse correctly reaches the target in Baseline, Half-size SVG and Turned view + half-size SVG, because those presets do not change their mapping between samples. It fails in Resize between moves. The figure's calculations are correct; the caption's general prediction is not. In Pan, the Card update selector is inapplicable and every selection takes the derived pan route, also reaching the target.

Effect: The reader sees an apparent exception to the caption and must decide whether a matching outcome is a broken demonstration. More consequentially, they can miss the practical distinction the surrounding text teaches: a cached inverse becomes stale when the mapping changes, rather than being intrinsically wrong. Severity follows the skill's explicit rule that a figure note false in some states is critical; the implementation does not require replacement.

Suggestion: Name the divide-by-zoom card shortcut explicitly and qualify the cached-inverse failure by its resize-between-samples condition. Alternatively make the caption follow the selected operation, algorithm and preset. Preserve the valid fixed-mapping outcomes.

Evidence: Independent execution with Node v24.16.0 of `comparison(preset, 'stale', 'Card')` returned actual C equal to target C for baseline `(480,420)`, resized `(320,260)` and turned `(350,210)`. `comparison('turned', 'divide', 'Pan')` also returned `(350,210)` for both. The unchanged `comparison()` source selects the old inverse only for the stale card algorithm and handles Pan before consulting the algorithm. These are model observations, not a new browser-event claim. The applicable whitelisted a01 browser receipt separately records operation of all twelve Card combinations and four Pan presets.

## Verification and source coverage

Fresh read-only execution in `/private/tmp/staycurrent-skills-night-d`, Node v24.16.0:

- `node src/components/coordinate-trial/a00/verify.mjs`: 190 passing model checks; tolerance `1e-9`; forward/inverse routes, composed coefficients, corners, point/displacement, order, pivots, collapse/reflection, half-size bridge and arbitrary-angle round trips.
- `node src/components/coordinate-trial/a01/verify.mjs`: 54 passing model and deterministic adapter checks; tolerance `1e-8`; canonical gestures, actual grab, bounds, stale mapping, segmented versus single movement, Card/Pan chord completion, invalid final conversion, cancellation, capture loss/failure, other IDs and missing/singular mappings. Adapter inputs are explicitly simulated.
- `node docs/article-work/coordinate-skill-trial/a00-receipts/verify-download.mjs`: four passing freshness/applicability checks; served asset equals the frozen standalone download, which embeds the current canonical example, browser implementation and figure markup.
- Independent disposable scalar calculation reproduced p and q's outward routes without the shared affine helpers. Independent trigonometric forward substitution checked 24 anchored-view updates across six angles and four initial zooms, requesting a clamped zoom of 6 and a changed angle, tolerance `1e-8`; all retained their targets. Separately ran the four caption counterexamples recorded above. No source or preview was modified.

Primary sources opened and checked on 21 October 2026:

- [SVG 2 coordinate systems, §§8.1–8.7](https://www.w3.org/TR/SVG2/coords.html): initial axes, user space, viewBox fitting and aspect-ratio margins.
- [SVGGraphicsElement.getScreenCTM](https://svgwg.org/svg2-draft/types.html#__svg__SVGGraphicsElement__getScreenCTM): current element-to-client mapping, ancestor transforms, viewport fitting, layout and nullable return.
- [Geometry Interfaces, §§2 and 6](https://www.w3.org/TR/geometry-1/): point transformation, six-value constructor/aliases, immutable versus mutable methods, post-multiplication, rotation degrees and singular inverse's NaN/is2D result.
- [CSSOM View, §10](https://www.w3.org/TR/cssom-view-1/#extensions-to-the-mouseevent-interface): client versus page coordinates.
- [Pointer Events 3, §§4.1.1, 4.2.3–4.2.7, 8–9](https://www.w3.org/TR/pointerevents3/): button masks, chorded pointermove, final pointerup, cancellation, pre-existing touch-action and capture delivery/release.

Reused only whitelisted mechanical records: a00 source-version, model-check, browser-matrices-r05, pointer-and-invalid-r05, order-options-r04, final-browser-r06, download-browser-r05, download-applicability and verify-download; a01 source-receipt-r02, model-receipt-r02 and browser-receipt. Their provenance and current hashes agree with the manifest. Root receipt coverage includes full/half rendering, turn, ordinary and turned anchored zoom, clamp/no drift, an arbitrary angle, local round trips, hit/miss and invalid-state retention. Its recorded arbitrary-angle coefficient difference is about `3.25e-6`, while local round-trip error is about `6e-14`; prose promises only small floating-point differences. Child receipt covers recorded combinations, zoom/angle keys, chosen pivot, bounded zoom and browser-generated trusted Card/Pan capture/completion, including Pan beyond the SVG edge. Caption-only root r06 change does not invalidate r05 mechanics; child mechanics/source hashes remain unchanged.

## Limits

This was a source, mathematical and mechanical-evidence practitioner review. I did not operate the current rendered controls or change a browser tab, viewport or theme; the visual reviewer owns that work. Existing native/browser evidence is reused only for unchanged applicable mechanics. No physical mouse/pen/touch validation, cross-browser compatibility result, exhaustive accessibility certification or general arbitrary-affine stability guarantee follows from it. Chords, forced cancellation/capture loss, failed capture and invalid samples have deterministic adapter coverage, not newly induced browser/device coverage. No build, server, source edit, commit or push was performed.
