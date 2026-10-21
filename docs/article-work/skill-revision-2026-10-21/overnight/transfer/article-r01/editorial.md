# Editorial review · article batch · Coordinates in a zoomable editor / Keep a diagram under the pointer · D-ARTICLE-r01

Started: 2026-10-21 22:16:51 UTC. Completed: 2026-10-21 22:18:52 UTC.

Inputs read: provenance manifest only; both complete rendered articles at [root](http://127.0.0.1:4343/review/skill-transfer/) and [gestures](http://127.0.0.1:4343/review/skill-transfer/gestures/); complete rendered [Sequence diagrams](http://127.0.0.1:4343/review/examples/sequences/), [Indexes](http://127.0.0.1:4343/review/examples/indexes/) and [Storage and durability](http://127.0.0.1:4343/review/examples/storage/). Intended audience supplied in assignment: capable engineers with ordinary arithmetic/basic programming, new to graphics maths. Read only the review skill and editorial perspective. No implementation source, plans, commissions, mechanical records, earlier reports, approvals, repair history or author records read.

Highest severity: critical

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Both titles and section headings name the reader's task or the operation being explained. |
| 2. Plain sentences | pass | Derivations remain connected to the card example; technical detail generally earns its place. |
| 3. Terms | finding | editorial-2: the root introduces “bridge” as an established label without naming its conversion. Other mathematical terms are explained in useful order. |
| 4. Openings | pass | The root establishes the mismatched-coordinate problem; the child establishes the wrong-direction drag and links its prerequisite. |
| 5. Reader-facing text only | finding | editorial-3: one sentence explains how the publication maintains shared example data. |
| 6. Captions and labels | finding | editorial-1: the gesture caption claims the shortcut misses in a state where the selected saved-inverse shortcut succeeds. Other captions distinguish model snapshots and browser coordinates clearly. |
| 7. One piece | pass | The argument runs coherently from spaces to mapping to input, then anchors and event lifetime. Qualifications about translation-only cards, zoom bounds, resize timing and cancellation belong with the operations they change. No substantive degraded or patch-like voice found. |

## Findings

### editorial-1 · critical · gestures, Gesture comparison caption

Problem: The fixed caption says “The derived update keeps the filled anchor on the cross; the shortcut misses.” Select **Baseline**, **Reuse pointer-down inverse**, then **Reveal movement**: the displayed result is “Card G (40, 0). Grab C (480, 420); target C (480, 420).” This selectable shortcut succeeds when the parent mapping has not changed. The caption still asserts a miss.

Effect: The caption contradicts the visible result and obscures the useful distinction the following prose makes: a saved inverse becomes invalid when the relevant mapping changes, rather than simply because it was saved.

Suggestion: Make the caption explain the conditional comparison, or update it with the selected case, so success in an unchanged mapping and failure after resize are both described accurately.

Evidence: Independently observed in the current rendered [gesture comparison](http://127.0.0.1:4343/review/skill-transfer/gestures/#card-drag); selected Baseline + Reuse pointer-down inverse and revealed the movement in the reviewer's own IAB tab. The prose under “Ask the right element for the mapping” correctly explains the resize case.

### editorial-2 · low · root, Figure 5 caption and subsequent inverse section

Problem: Figure 5 first calls its model the “fixed full-size bridge snapshot”. “Remove the browser bridge” then appears in the inverse explanation. The earlier space ladder describes fitting and positioning the SVG, but never gives that V-to-C conversion this name.

Effect: A newcomer must infer whether “bridge” means that final conversion or the entire browser-provided mapping, an avoidable small pause before the input route.

Suggestion: Name V → C as the browser bridge when introducing fitting and placement, and retain that name thereafter.

Evidence: Complete rendered root reading, from “One card, several sets of coordinates” through Figure 5 and “Follow the pointer back to the card”.

### editorial-3 · low · gestures, paragraph introducing the DOM connection listing

Problem: “The shared model imports the collection’s canonical example and geometry functions, so changing a value does not leave a second figure working from old data” shifts from implementing the reader's editor to maintaining the publication's figures.

Effect: The reader has to distinguish article-production architecture from the DOM roles the paragraph is explaining; “collection's canonical example” adds an internal term with little practical return here.

Suggestion: Keep the paragraph centred on the code's state and rendering contract. If shared constants matter to the implementation, explain their role in that editor directly.

Evidence: Rendered child, “Check the promise before storing the update”, between the expanded handler listing and the connection listing.

## Coverage and limits

Read both articles from title through sources, including captions, tables, all available option text, status/readout wording and reader-facing code. Expanded all ten root figure-text alternatives. Expanded the child's pointer controls, figure text, event log, current-mapping readout, complete handlers and shared-calculation listing. Read the complete references, including Sequence diagrams' expanded text alternatives and Mermaid listings; Indexes and Storage exposed no summary disclosures. Reference calibration included full prose and the default displayed figure/control text; it did not enumerate every animation step or every alternative reference setting.

This is an editorial review, not a primary-source technical verification or visual/mechanical acceptance. I exercised the one comparison state needed to establish editorial-1; I did not test physical mouse/touch delivery, exhaustive controls, browser portability, viewport sizes or themes. Used a separate background IAB tab and did not change viewport/theme. No article/source edits, builds, server changes or publication actions performed.
