# Practitioner review · article · Keep a diagram under the pointer · D-REPEAT-ARTICLE-r01

Inputs read: frozen [manifest](manifest.json), [mechanical-only packet](mechanical-inputs.json), the complete current child source and rendered page at `http://127.0.0.1:4344/review/skill-transfer/gestures/`; its complete `GestureComparison.astro`, `gesture.mjs`, `model.mjs`, `runtime.mjs`, `verify.mjs`, shared `geometry.mjs` and `example.mjs`; commission; canonical accepted parent/child plans and example record in `docs/coverage/coordinate-editor{,-child}.yaml` and `coordinate-editor-example.md`. The complete current parent article source was read as prerequisite context, including its implementation listings and the relevant downloadable editor source. Repository AGENTS, README, site direction, local review skill and practitioner perspective were read. The parent is not a review target. No other perspective, work record, evidence index, author narrative, previous finding, other trial output, agent inventory or history was read. Only the ten listed mechanical JSON records were used.

Highest severity: medium

## UTC and input binding

First explicit clock sample: **2026-10-22 01:29:52 UTC**. Initial assignment/setup and file reads preceded that sample and were not separately clocked. Explicitly clocked review interval: **01:29:52–01:32:40 UTC**, followed by report preparation through **01:33:34 UTC**. No waiting for authorisation is included as verification work.

- `manifest.json` SHA-256: `d9e2ef7b9698f4b8cfa3fa553bdabe2a89b5495eb9d8629220b5922d0749fb75`.
- `mechanical-inputs.json` SHA-256: `28f06dde2e248246a5e801769d5cc7e54cecd801b606fa2b6acc1452ba31d569`.
- All **51 source/context entries** and **10 mechanical records** matched their frozen hashes on inspection and again at 01:32:40 UTC. This report binds to those complete maps, rather than an inferred branch state.
- Child article hash: `d47aee1fa495930ebd22e3fc0a0e7ff8172f640459d92a606585f6da2e103365`.
- Runtime hash: `ebf06572836098e2d5cbec4326b88f185d0b1f311894f9014a3663076227c227`; gesture hash: `0c244d0b3cdd95706fb0331d7ed60305f467603dc424a2dabb668270c674eda0`.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Consequential Pointer Events, SVG and DOMMatrix claims agree with primary specifications; the named-space equations, snapshots and source were checked. |
| 2. Evidence | pass, with limits below | Mathematical snapshots, injected event-policy checks and native browser observations remain distinct. Fresh model rerun and fresh rendered-control/matrix checks corroborate the current implementation. |
| 3. Coverage | finding | The promised practical implementation route lacks a reader-accessible complete source/markup handoff; practitioner-1. The required geometric decisions and lifecycle cases are otherwise covered. |
| 4. Depth, both ways | finding | The missing implementation handoff creates avoidable reconstruction work; practitioner-1. No further mathematical depth, extra gesture recognition or framework treatment is needed for this brief. |
| 5. Ownership | pass | The child owns event lifetime and fuller retained-point implementation. It reminds readers of the parent's spaces and inverse rather than rederiving matrix multiplication, rotation or inversion. There is no earned further child. |

## Findings

### practitioner-1 · medium · Check the promise before storing the update: expandable implementation sources

Problem: The child offers its source as a connected implementation route, but only exposes `gesture.mjs`, `model.mjs` and `runtime.mjs`. The latter two import `../example.mjs` and `../geometry.mjs`, which the article neither includes nor links. `mount(container)` also expects the figure's particular `data-*` SVG/controls/readout structure, while that structure and the call which mounts it are absent from the presented sources. The parent supplies a different standalone editor, with different element roles and no child gesture bindings; it does not close this handoff.

Effect: A capable engineer can understand the derivation and use this page's working demo, but cannot reproduce the supplied small gesture implementation from the presented route without discovering repository files and reconstructing its markup/bootstrap. That is material extra work at the point where the brief promises a complete small implementation, and makes it harder to make and check the reader's own changes.

Suggestion: Supply one directly accessible complete child example or source bundle, including the shared data/geometry modules, markup, bootstrap and any necessary serving instruction. Alternatively expose and name all those pieces in a short connected implementation recipe. This need not add another mathematical explanation or duplicate the parent article.

Evidence: In the frozen child source, lines 92, 97–99 introduce the complete policy and connected source route; the two displayed modules begin with the missing imports. `runtime.mjs` lines 23 onward queries many `data-*` roles, and `GestureComparison.astro` owns the omitted structure and `document.querySelectorAll('[data-gesture-comparison]').forEach(mount)` bootstrap. Fresh rendered inspection expanded the two source disclosures and enumerated article links: there is no child example download or shared-module/markup link. This is a source-completeness observation, not a claim that the live page fails.

## Verification and primary sources

Primary documents checked on 22 October 2026:

- [Pointer Events 3](https://www.w3.org/TR/pointerevents3/), §§4.1.1, 4.2.4, 4.2.6–7, 8.1–3 and 9: button flags/chords, completion versus cancellation, capture retargeting, release and touch-action policy. The five-event chord is consistent with the API; finishing at loss of the initiating flag and keeping the last valid placement are clearly identified editor policies.
- [SVG 2, SVGGraphicsElement](https://www.w3.org/TR/SVG2/types.html#InterfaceSVGGraphicsElement): `getScreenCTM()` includes the element/ancestor transforms, viewBox fitting and mapping to the document viewport; invert once for the stated destination space.
- [Geometry Interfaces, invertSelf](https://drafts.csswg.org/geometry/#dom-dommatrix-invertself): failed inversion sets non-finite attributes. The implementation checks raw matrix, inverse and result as well as handling exceptions.

Fresh local reproduction, source root `/private/tmp/staycurrent-skills-night-repeat`: `node --version` returned **v24.16.0**; `node src/components/coordinate-trial/a01/verify.mjs` returned **78 checks, pass**, with its stated exact quarter-turn / `1e-7` arbitrary-angle boundary. I read that verifier rather than treating its count as coverage by itself. It checks all canonical card snapshots, bad-axis/stale-inverse examples, pan and anchor calculations, zoom bounds, off-mark grabs, one versus ten card moves, invalid values, singular geometry and injected lifecycle cases for both tools. This is not native event evidence.

Fresh rendered use in my own Chrome tab `315244267`, with no viewport/theme changes:

| Action | Current rendered result |
| --- | --- |
| Turned preset, Card, derived, Reveal | Card G `(-10, 0)`; grab and target C `(350, 210)`; arrows C `(40,20)`, V `(80,40)`, W `(20,-40)`, G `(-40,-20)`. |
| Same preset, divide-by-zoom rule | Card G `(50,30)`; grab C `(290,180)` misses target `(350,210)`. |
| Same preset, Pan | Pan V `(740,0)`; grab reaches `(350,210)`. |
| Resize preset, Card, current mapping | Card G `(50,-20)`; grab reaches `(320,260)`. |
| Resize preset, stale mapping | Card G `(-40,80)`; grab C `(220,170)` misses target `(320,260)`. |
| Baseline, marked point as pivot, Zoom ×1.5 | Zoom 3, pan `(-70,-100)`; world `(130,140)` remains V `(320,320)`. |
| Repeated Zoom ×1.5 through upper bound | Zoom clamps to 4; pan `(-200,-240)` and target `(320,320)` remain fixed on the further request. |
| Check current mapping at zoom 4 | Maximum composed/browser coefficient difference `2.84e-14`; mark returns to O `(10,10)`. |

The figure was also inspected as rendered, including the mapping readout and distinction between mathematical trace and event log. The log correctly said no native pointer events since Reset during these semantic-control checks.

I reused the frozen mechanical packet only for unchanged mechanics: it records native Card/Pan drags in baseline/half/turned layouts, outside-card capture, anchors, matrices, size toggle and rendered states. Its final-source receipt matches this article and all five child component/module hashes. I treat those records as bounded observations of their recorded implementation, not as new native observations by this reviewer. Their displayed numeric outcomes agree with the current model and fresh controls.

## Limits

IAB creation was unavailable in this reviewer's environment. The coordinator authorised a separate Chrome tab and semantic locator control use while another reviewer held the native input lease. I did not change shared viewport/theme, send a native drag/chord/cancellation, or make a browser compatibility/device claim. The packet does not establish physical-device, cross-browser, native chord/cancel/fault-injection, keyboard preset selection or resize-during-held-drag coverage, and this review adds none of those claims. The injected lifecycle verifier is the evidence for those policy branches, together with source/specification inspection.

A semantic fill of the view-angle number field did not commit an angle update during the attempted check; I have not treated that driver-level attempt as proof of a broken control. The current unchanged rotation arithmetic and recorded anchor observations were checked through the model/source and permitted mechanical packet. No native angle-control claim is made here. The initial exact-label selector attempt also failed to match; the subsequent role-based Starting state selection worked. Neither tool limitation is a finding against the article.

The mechanical JSON receipts contain limited browser-environment/driver provenance, so reuse is bounded to their recorded outcomes and matching source hashes; fresh current rendered/matrix checks provide the independent current-browser corroboration above. Build ownership remained with the coordinator. No build, server, content/source edit, team, commit, push or publication was performed.
