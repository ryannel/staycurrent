# Teaching review · corpus · coordinate-editor root and gestures · D-ARTICLE-r02

Inputs read: the supplied [frozen manifest](article-r02/manifest.json), transfer commission, complete `docs/coverage/coordinate-editor.yaml` and canonical `coordinate-editor-example.md`; both current rendered articles at port 4343, including implementation disclosures and figure text; relevant current figure/implementation source. Calibration retained all three fixed reference articles in full (Sequence diagrams, Indexes, Storage and durability), including their figure components' instructional content, scripted steps/alternatives, controls, tables and code listings. Local review skill and teaching perspective only. No earlier findings, decisions, approvals, repair history, writer's notes, evidence index or other trial material was consulted.

Binding: checked once against the supplied manifest; all 43 listed source hashes match D-ARTICLE-r02. This report assesses the assembled root → child route, not an isolated article or a plan alone.

Highest severity: low

UTC intervals: 2026-10-22 01:51:55–01:55:36 for input binding, reference calibration, source and rendered reading; 01:55:36–01:56:12 for report writing and saved-file confirmation.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| T1 · Starting point | pass | Root derives space, point/displacement, rotation, six coefficients, multiplication and inverse before the child depends on them. Child declares the root prerequisite and recalls the spaces with useful return links. |
| T2 · Order | pass | Scalar placements precede matrix notation; forward composition precedes inversion; lost information precedes interaction policy. Child progresses from pan to anchored view changes, card drag, current DOM mappings and event lifetime. |
| T3 · Examples | pass | Review and Review lane carry the whole route. Normal, half-size, turned, resized-between-events and collapsed cases change named parts of the same state rather than introduce a fresh example. |
| T4 · Showing | finding (low) | The root's ladder, point/step table, pivot comparison, order comparison and reverse trace show the difficult transitions. Child supplies a shared success/failure comparison and lifecycle table. The reset comparison could identify its two anchor roles more clearly; see teaching-2. |
| T5 · Judgement | pass | Readers can choose the space and element for an update, check order/pivot, distinguish invalid inverse from reflection, retain valid state, and separate geometry faults from event-delivery faults. Zoom limits and cancellation behaviour are explicitly example policies. |
| T6 · Gradual exposure | pass | Root answers the implementation question and derives the interaction invariants before handing off. Child earns its page through current-mapping updates, awkward gesture cases, capture/completion/cancellation and a connected implementation; it does not repeat the matrix course. |
| T7 · Placement of additions | pass | No additions inventory or history was supplied. Assessed all current placement: browser bridge and guards sit beside inverse use; collapse follows the failed inverse; root invariants prepare the hand-off; child's resize explanation sits beside element selection, and lifecycle detail follows geometry. Code disclosures support the implementation section without interrupting the derivation. |

## Assembled learning route

The root owns coordinate mathematics and the SVG/client bridge. Its opening gives the practical approach immediately, then the worked route makes each conversion accountable to a named space. The concluding anchor section gives a usable geometric core and a precise reason to continue into the child.

The child keeps that foundation, reuses the same view mapping in parameter form, and turns one retained-point equation into the different stored changes. Its element-role table closes the main implementation hand-off: card for the initial local grab, parent for card updates, world for the pan anchor and root SVG for view coordinates. The HTML connection and shared calculations join the helpers to actual DOM roles rather than leave the reader to design that connection.

The overlap is purposeful: the root establishes what must stay true; the child applies it repeatedly under changing view/bridge state and a finite event stream. No substantive missing owner, prerequisite cycle, gap between the two pages, or unnecessary third destination emerged. The collection supports the commissioned nested placement, pan/zoom/rotation, pointer mapping and diagnosis decisions.

## Findings

### teaching-2 · low · gestures, initial Gesture comparison drawing

Problem: the initial/reset figure names a recorded model pointer at C (440, 400), corresponding to the familiar card mark O (10, 10), while the large filled retained-point marker and target cross are initially the SVG-centre zoom pivot. The latter maps to O (0, −30), outside the card. The generic legend calls it the retained point; the more specific pivot explanation is in the collapsed pointer-controls disclosure. The recorded reveal subsequently uses O (10, 10).

Effect: a reader trying the requested prediction must briefly distinguish two points in the shared initial scene: the card's small mark for the recorded drag and the large marker for centre-anchored zoom. The surrounding prose and reveal explain the underlying arithmetic, so this is optional clarity polish rather than a missing prerequisite or wrong algorithm.

Suggestion: name the default centre marker as the zoom/rotation pivot, and identify the small card mark as the recorded movement's starting grab; alternatively make the initial recorded state display its own retained marker explicitly.

Evidence: current rendered baseline caption/readout/legend and Current browser mapping disclosure (`Retained O (0, -30)`), inspected without changing the demonstration. `src/components/coordinate-trial/a01/GestureFigure.astro` lines 18–27 and 42–47 supply the labels; reset selects the centre-derived retained point at line 95 while line 99 reports `example.p`; recorded reveal switches retained point to `example.p` at line 107.

## Limits

This is a teaching assessment. Read scripted figure states and implementation source; did not replay demonstrations, drag, alter controls, theme or viewport, dispatch pointer events, run native checks, rebuild or serve. Browser use was confined to an independent Chrome tab, reading, following the root's hand-off and opening semantic disclosures. No fresh claim of mechanical correctness, browser compatibility, physical-device coverage or full visual/theme QA follows from this review. No article or shared source was edited.
