# a01 mechanical evidence

Kept separate from [work and continuity](a01-work.md). Canonical index owner: coordinator, [evidence.md](evidence.md).

## Executable model and simulated handler check

- Source: `src/components/coordinate-trial/a01/verify.mjs`.
- Executed 21 October 2026, 21:50:59 UTC: `node src/components/coordinate-trial/a01/verify.mjs`.
- Earlier first-draft result: pass, 45 assertions/check groups; [earlier receipt](a01-model-receipt.json), applicable to [earlier source hashes](a01-source-receipt.json).
- Current result, executed 21:57:58 UTC: pass, 54 checks; [current receipt](a01-model-receipt-r02.json), applicable to [final source hashes](a01-source-receipt-r02.json). Added multiple smaller moves versus one move, invalid ongoing cleanup and rejected final button-chord cleanup for both Card and Pan.
- Geometry: normal, half-size, turned and resize-between drags; wrong divide-by-zoom and stale inverse endpoints; pan; chosen-pivot rotation; anchored zoom; arbitrary grab; finite rejection and no drift at clamped zoom.
- Lifecycle adapter: both Card and Pan, button chord 1→3→2→2→0, idle move, mismatched ID, cancellation, capture loss, failed capture, missing/singular mapping and invalid final completion. Adapter inputs and mappings are deterministic simulations, not observed browser delivery.

## Primary sources checked

- [Pointer Events 3](https://www.w3.org/TR/pointerevents3/): sections 4.1.1, 4.2.4, 4.2.6; capture, cancellation and touch-action.
- [SVG 2 SVGGraphicsElement](https://svgwg.org/svg2-draft/types.html#InterfaceSVGGraphicsElement): current element-local mapping to document viewport and inclusion of the browser bridge.
- [Geometry Interfaces](https://drafts.csswg.org/geometry/#dom-dommatrix-inverse): DOMMatrix inverse and non-finite singular result.

## Browser/rendered receipt

[Browser receipt](a01-browser-receipt.json), completed 22:00:21 UTC against coordinator build r04. Actual viewports 960×929 and 375×812; both themes; all recorded Card/Pan options; keyboard controls, chosen pivot, bounded zoom, direct Card/Pan browser capture and current matrix readback. The receipt separates CUA browser-generated events from the deterministic adapter and from physical-device/cross-browser claims. Screenshots were inspected in tool output; no saved screenshot artifact is claimed.

## r02 repair receipts

- [Current source hashes](a01-source-receipt-r03.json).
- [133 model and simulated-handler checks](a01-model-receipt-r03.json), including the throwing SVGMatrix-shaped provider at start, move, pointerup and chord completion for Card/Pan, retained last valid state, capture release and unchanged state after completion. Existing non-finite inverse coverage remains separate. No actual browser singular-state or physical-device failure reproduction is claimed.
- [Eight standalone embedding/syntax checks](a01-standalone-receipt-r03.json). The HTML contains the current four source modules with only import/export syntax removed, has one script, and no unresolved imports or insertion marker. SHA-256 and input hashes are recorded; browser download/opening and controls require the rendered receipt.
- Primary contracts checked directly on 21 October 2026: [SVG1.1 SVGMatrix](https://www.w3.org/TR/SVG11/coords.html#InterfaceSVGMatrix) for a throwing singular inverse; [Geometry Interfaces](https://drafts.csswg.org/geometry/#dom-dommatrix-inverse) for the non-finite singular inverse. These contracts motivate both guard paths; the adapter does not establish how the current browser behaves under a singular SVG state.
- [Rendered r02 receipt](a01-browser-receipt-r03.json), using coordinator build-r02 at 4343: all twelve Card and four Pan comparisons; Pan's algorithm selector disabled; every distinct used token colour in all three expanded listings measured at actual 960×929 and 375×812, in light/dark. Detailed measurements and screenshots are in [a01-r02-browser](a01-r02-browser/). Minimum token contrast is 5.5227:1 light and 6.1478:1 dark. All three row-card captions measured 343 px wide at 375 px; lifecycle height 46.06 px. Document width remained 375.
- Ordinary current r02 Card and captured Pan beyond the SVG edge were observed separately by the coordinator in IAB using its documented `tab.drag` wrapper. The coordinator's mechanical logs/screenshots are in the main repository's `transfer/article-r02/coordinator-pointer/`; these observations are browser-driven input, not physical-device certification.
- The worker's download event-wait/click/path call stalled for 1079.7 seconds before interruption. It returned neither a completion nor a saved path. This driver call does not establish whether the download itself succeeded. Actual standalone opening and controls remain an explicit coordinator handoff; the embedding and syntax checks above establish only those named properties.
