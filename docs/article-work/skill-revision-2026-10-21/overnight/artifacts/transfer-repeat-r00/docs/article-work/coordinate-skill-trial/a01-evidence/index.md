# a01 repeat evidence index

## Mechanical checks

- [Timing receipt](receipts/timing.json): clock boundaries, with preparation, draft work, focused checking, waiting and rendering tracked separately.
- [Model receipt](receipts/model-check.json): actual `node src/components/coordinate-trial/a01/verify.mjs` execution, 78 passing assertions. Exact quarter-turn expectations; arbitrary-angle/forward tolerance 1e-7. Includes injected lifecycle checks for both tools. This is not browser evidence.
- `node --check src/components/coordinate-trial/a01/runtime.mjs`: exited 0 at 2026-10-21 22:37:27 UTC. Syntax only.
- First-draft source hashes recorded in the seal receipt. Builds and preview are coordinator-owned.

## Primary-source checking

Read 21 October 2026 UTC through the web tool:

- [Pointer Events 3](https://www.w3.org/TR/pointerevents3/), §4.1.1, §4.2.4 and §4.2.6 for button flags and chorded transitions; §4.2.7, §8 and §9 for cancellation, touch-action and capture. This establishes the API distinctions; the decision to finish on initiating-button loss and retain the last valid placement is this editor's policy.
- [SVG 2 SVGGraphicsElement](https://www.w3.org/TR/SVG2/types.html#InterfaceSVGGraphicsElement), especially getScreenCTM steps 1–4: current element-to-client mapping includes ancestor SVG transforms, fitting and CSS layout.
- [Geometry Interfaces](https://drafts.csswg.org/geometry/#dom-dommatrix-invertself): inverse delegates to invertSelf; a noninvertible matrix gets NaN components.

## Browser and rendered checks

Pending the coordinator's preview URL and exclusive viewport/theme lease. No browser execution, device coverage or rendered success is claimed by the initial draft receipt.

## Boundary

The canonical coordinate snapshots are mathematical models. The SVG uses real browser mappings and events, but its later observed results must be recorded here separately. No physical-device or cross-browser coverage is planned by this single local preview assignment.
