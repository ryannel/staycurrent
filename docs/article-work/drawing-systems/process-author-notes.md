# Process, sequence and whiteboard author notes

Written and checked 16 October 2026. This author supplied `processes.md`, `sequences.md` and `whiteboarding.md`, initially under `src/articles/drawing-systems/`. The coordinator is moving the collection into `src/articles/drawing-systems/`. Public image paths are unchanged. This note records author work and validation; independent review and the integrated build belong to the coordinator's collection record.

## What the articles teach

Processes begins with a discovery inventory and develops responsibility, formal flow semantics, choices, parallel work, waiting and cancellation. Its decision table and compact service blueprint change the organising question rather than adding another overloaded process wall. The final unfamiliar practice case has a discussed answer.

Sequences introduces lifelines and a bounded interaction before Mermaid syntax. Six complete sources cover a successful submission, worker interaction, validation alternatives, two possible lost-message histories, a proposed polling loop and proposed independent UI requests. Calls and reply labels distinguish request storage, provider acceptance and actual email delivery. No email-delivery event is shown or claimed. Provider deduplication remains unknown.

Whiteboarding starts with composition using labelled boxes and arrows, then follows a staged conversation. An assumed database push is corrected to a worker-initiated read. The board carries a current trace, an unanswered provider question and a separate proposal. It also teaches drawing from memory, changing views, checking disagreements, remote participation and capturing an agreed result. Shape vocabulary and layout continue the same topology.

These articles fulfil the practical scope without claiming that a diagram executes a workflow, proves a storage transaction, establishes a retry guarantee or tests a real repair service. The repair service, eligibility policy, two-day reminder and practice cases are invented teaching examples. The polling and help-fetch examples are explicitly proposed variations.

## Agreed topology for the continuing layout lesson

Final asset: `public/images/drawing-systems/whiteboarding-agreed-board.svg` (520 × 900).

- Browser UI → Repair API: submits a repair request.
- Repair API → Repair DB: stores the request and notification job.
- Notification worker → Repair DB: reads eligible notification jobs.
- Notification worker → external Notification provider: requests email.

The arrows describe the initiator of each operation. Responses are omitted from this structure view. The worker read points upwards in the narrow layout; it must not be reversed when rearranging the board.

Black marks carry structure. Blue numbered labels trace the selected operations. The purple open question is “? Can retries send two emails?” The green proposal is “NEW: show notification status”, separated below the current system. The provider is enclosed in a labelled external boundary. There is no separate broker or queue in this agreed software model.

Important ordering: commit makes the notification job available. The worker may run before or after the browser receives its receipt. The first two sequence panels deliberately do not establish an ordering between those independent events. The browser response does not wait for notification, but receipt-first is not guaranteed by this design.

## Source record

Access date for the sources below: 16 October 2026. Product documentation is current web documentation unless a version is named. No authenticated Blueworks session or hosted notification service was used.

| Source | Used for | Boundary |
| --- | --- | --- |
| [IBM: Creating discovery maps](https://www.ibm.com/docs/en/blueworks-live?topic=process-discovery-maps) | Milestone/activity discovery and interviewing workflow | Our diagram is a recreated teaching example, not a product screenshot or export. |
| [IBM: Creating process blueprints](https://www.ibm.com/docs/en/blueworks-live?topic=documenting-creating-process-blueprints) | Blueprint includes discovery map, process diagram and documentation | Does not establish automatic synchronisation between views. |
| [IBM: Creating process diagrams](https://www.ibm.com/docs/en/blueworks-live?topic=process-diagrams) | Initial conversion from discovery; later edits may need manual propagation | Product-specific behaviour is identified as such. |
| [IBM: Swimlanes and milestones](https://www.ibm.com/docs/en/blueworks-live?topic=diagrams-swimlanes-milestones) | Participant rows, phase columns and activity ownership | Informal diagrams elsewhere may orient lanes differently. |
| [IBM Blueworks Live documentation PDF](https://www.ibm.com/docs/en/SS2MKC/pdf/blueworks-live-documentation.pdf) | Exclusive, parallel and inclusive gateway roles | Direct gateway webpage returned HTTP 403; the official indexed PDF supplied the descriptions. |
| [OMG BPMN 2.0.2](https://www.omg.org/spec/BPMN/2.0.2/PDF) | Pool/lane distinction, sequence/message flow, gateway meaning and specialised event semantics | Consulted sections 9.3–9.4 and 10.6; the diagrams are explanatory fragments, not executable BPMN files. |
| [Camunda: Parallel gateway, version 8.8](https://docs.camunda.io/docs/8.8/components/modeler/bpmn/parallel-gateways/) | All outgoing paths start; join waits for incoming paths | The article does not claim physical thread parallelism. |
| [IBM: Events](https://www.ibm.com/docs/en/blueworks-live?topic=diagrams-events) | Timer/message events and interrupting/non-interrupting boundary events | The cancellation example scopes the whole pre-repair interval; no unspecified race policy is assumed. |
| [Nielsen Norman Group: Service Blueprints](https://www.nngroup.com/articles/service-blueprints-definition/) | Customer/frontstage/backstage distinction and visibility line | The small repair-service table is original and deliberately bounded. |
| [Mermaid: Sequence diagrams](https://mermaid.js.org/syntax/sequenceDiagram.html) | Participants, aliases, message forms, notes, activations, alternatives, loops and parallel frames | Actual local rendering, described below, establishes syntax acceptance; the site’s SVGs are manually composed interpretations. |
| [Julia Evans: How to teach technical concepts with cartoons](https://jvns.ca/teach-tech-with-cartoons/) | Original writing/teaching reference requested by the style skill | No passages reproduced; figures and examples are original. |

## Media and source validation

Fifteen editable SVGs were written, all with a 520-wide viewBox, internal light/dark colour variables, meaningful titles and labels at 18 px or larger. Figures use small scenes rather than a complete workshop wall. Every article figure has informative alternative text and a caption.

- Processes: `processes-discovery.svg`, `processes-handoffs.svg`, `processes-choice.svg`, `processes-parallel.svg`, `processes-boundary-events.svg`.
- Sequences: `sequences-request.svg`, `sequences-notification.svg`, `sequences-alternatives.svg`, `sequences-uncertainty.svg`, `sequences-loop.svg`, `sequences-parallel.svg`.
- Whiteboarding: `whiteboarding-compose.svg`, `whiteboarding-first-board.svg`, `whiteboarding-correction.svg`, `whiteboarding-agreed-board.svg`.

All fifteen XML documents parsed, and every image referenced by the three articles exists. All fifteen figures were rendered in an actual Chromium browser at native size in light and dark. All light figures and representative dark contrast were visually inspected. The shared dark palette changes colours without changing geometry. Author screenshots are under `/private/tmp/drawing-review/`, with final screenshots named `<asset>.v3.light.png` and `<asset>.v3.dark.png` and contact sheets named `contact-v3-*.png`.

An initial Sharp raster check did not support the SVG colour variables correctly, so it was replaced with browser rendering. An initial Chrome capture also produced repeated lower tiles when resizing; captures were repeated with GPU disabled, a fresh page per figure and a brief paint wait. The final evidence uses those corrected captures.

All **six** Mermaid code blocks were rendered successfully using **Mermaid 12.2.0**, installed only in `/private/tmp/staycurrent-mermaid-check/`. The project dependency files were not changed. Playwright drove the installed Google Chrome in headless mode. Rendered SVG, source and screenshot artifacts are `/private/tmp/drawing-review/mermaid-{1..6}.{svg,mmd,png}`. The renderer caught a literal semicolon in the timeout note; changing it to a comma fixed the parse error before the successful run.

Rendered message lists and frame labels were compared with the source and hand SVGs. The hand figures abbreviate long labels while preserving sender, receiver, order and branch meaning. The uncertainty source places the two possible histories in an alternative frame; its hand figure puts them in separate stacked panels, explicitly labelled A and B. Neither represents the worker as knowing which history occurred. The loop and parallel examples remain explicitly proposed variations, and their conditions are retained in the hand figures.

Review repairs integrated during authoring: show the actual boundary-event marks rather than merely naming them; distinguish worker availability after commit from receipt-first ordering; give drawing from memory its own explanation; clarify the unresolved duplicate-email question; move multiline message labels above their arrows; move the first request message clear of participant headers; keep the final parallel reply inside a roomy frame; move decision labels clear of vertical arrows.

The coordinator will perform the complete Astro build and assembled-page inspection. This author has not tested physical pen speed, a real Blueworks conversion, notification-provider behaviour, or a production repair implementation. Those are not claimed outcomes of the lesson.
