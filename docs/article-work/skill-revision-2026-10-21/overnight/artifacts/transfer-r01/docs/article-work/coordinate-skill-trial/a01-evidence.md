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
