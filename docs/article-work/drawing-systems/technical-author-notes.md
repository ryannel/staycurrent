# Architecture, domains and lifecycle drafts

Status: complete author drafts, awaiting the coordinator's independent review and collection build. Sources checked 16 October 2026. No publication action was taken.

## Files and scope

- `src/articles/drawing-systems/architecture.md`: about 1,800 words; C4 zoom choice, a consistent context/container/component progression, deployment contrast, two discussed exercises.
- `src/articles/drawing-systems/domains.md`: about 1,825 words; a conceptual model centred on Request versus Appointment, identity, multiplicity, quote history, a storage contrast and a bounded information-flow contrast; two discussed exercises.
- `src/articles/drawing-systems/states.md`: about 1,710 words; one RepairRequest lifecycle, event/guard/effect, a state table, hierarchy, atomic acceptance of cancellation versus start, and three discussed exercises.
- Four original SVGs per article under `public/images/drawing-systems/`, using the corresponding article prefix. Each has a 500-unit viewBox width, 20–24 px text, title and description, embedded light/dark tokens, HTML alt text and a caption.

The word estimates include headings and source-link labels but exclude HTML tags and alt text. The coordinator moved the Markdown into `src/articles/drawing-systems/` during integration to avoid creating an implicit Astro content collection; this author did not change the shared content configuration, layout or routes.

## Decisions the collection should preserve

The repair service is invented. Architecture uses a browser UI, Repair API, Repair DB and notification worker within one logical software-system boundary. The worker reads notification jobs from the database and calls an external provider. No queue is required for this example. The component drawing opens only the API; the deployment example places two API instances and a worker on one VM to expose the difference between counting instances and surviving a host failure. Deployment deliberately omits communications and says so.

Request R42 continues across changes to its appointment. This example retains a superseded appointment A7 and a replacement A8, while acknowledging that another business could retain one appointment identity with a revision history. Cancelling a visit does not automatically cancel the repair request. Several historical quotes may belong to one request, with at most one current offer; approval names a specific quote.

The lifecycle has Submitted, Diagnosing, Awaiting approval, Approved, In repair, Completed and Cancelled. Cancellation remains available through Approved. Diagnosis is preliminary assessment; repair work starts only after the technician receives successful permission from the accepted transition. This distinction is explicit in the opening. The model uses first-accepted state change for concurrent cancellation/start, not first click. It refuses unhandled events with a reason; that is an example policy, not a claim about every state-machine library. Unrepairable cases, declined quotes and reopening are deliberate boundaries stated before the detailed rules.

The repeated walkthrough exposes a specific cross-view contradiction: a successful start after accepted cancellation cannot agree with this lifecycle. The domain model provides the identity of the thing being cancelled; the architecture identifies where the rule and persistence responsibility live.

## Evidence

All article text and drawings are original paraphrase or invented teaching examples. Sources support notation and documented concepts, not the example's business policies. No vendor example diagram was reproduced.

| Primary source | Supports / useful next reading |
| --- | --- |
| [C4 diagram overview](https://c4model.com/diagrams) | Four abstraction levels; selection rather than a requirement to produce every diagram. Beginner orientation. |
| [C4 system context](https://c4model.com/diagrams/system-context) | People and neighbouring systems around one software system. |
| [C4 container definition](https://c4model.com/abstractions/container) | Application/data-store meaning, distinct from Docker; client-side application as a container. |
| [C4 container diagram](https://c4model.com/diagrams/container) | Logical responsibilities, technologies and communication; deployment treated separately. |
| [C4 component diagram](https://c4model.com/diagrams/component) | Scope is one container; other containers remain supporting neighbours. |
| [C4 code diagram](https://c4model.com/diagrams/code) | Optional implementation detail and usefulness of generated views. |
| [C4 deployment](https://c4model.com/diagrams/deployment) | Environment-specific placement of instances within infrastructure nodes. |
| [C4 notation](https://c4model.com/diagrams/notation) and [review checklist](https://c4model.com/diagrams/checklist) | Explicit type, scope, responsibilities and directional relationship labels; no mandatory visual notation. |
| [Microsoft domain analysis](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis) | Shared vocabulary and explicit domain scope. Source's wider microservices programme is not imported into this collection. |
| [Microsoft tactical domain modelling](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/tactical-domain-driven-design) | Identity-bearing entities versus values. Useful follow-on for developers after the conceptual drawing. |
| [IBM model-element properties](https://www.ibm.com/docs/en/dma?topic=elements-model-element-properties) | Meaning of UML multiplicity ranges, including zero, one and an unbounded upper limit. |
| [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) | Primary keys, foreign keys and not-null constraints. Documentation resolved to PostgreSQL 18 during research; only basic constraint semantics are used. |
| [OWASP threat-modelling process](https://community.owasp.org/Threat_Modeling_Process) | Information flows and trust boundaries. Historical guidance used for stable diagram concepts, not a claim that this small figure is a complete threat model. |
| [W3C SCXML Recommendation](https://www.w3.org/TR/scxml/) | State/event/transition concepts, conditions, actions and compound states. Version 1.0 Recommendation, 1 September 2015. Precise follow-on for readers seeking executable semantics. |
| [Stately guards](https://stately.ai/docs/guards) | Guards test conditions; effects are distinct. No library API code is presented. |
| [Stately parent states](https://stately.ai/docs/parent-states) | Nested active states, initial children and parent transition handling. Documentation currently advertises XState v6 alpha; the article uses only the general concept and does not promise version compatibility. |

The attempted OMG UML PDF fetch failed because the document exceeded the web tool's size limit. An attempted older IBM URL was unavailable. Neither inaccessible source is cited as inspected evidence. The working IBM documentation supplied the needed multiplicity definitions.

## Author checks and remaining integration checks

All twelve SVG files parse as XML. Each image path in these articles exists. The drawings were checked against the prose for identity, containment, arrow direction and counts. A domain walkthrough was repaired to explicitly return to the time before the visit before cancelling that appointment.

Chrome rendered all twelve direct SVG URLs; a DOM bounds check found no text outside the 500-unit canvas and no overlapping text boxes. The assembled domain article was inspected at a 390 × 844 viewport: content width was 358 px, document width remained 390 px, and the identity figure was readable without zoom. Dark-mode context and nested-state figures were visually inspected at native size. Light-mode copies of all twelve figures were rendered with their light palette resolved and inspected as contact sheets. These temporary raster copies are in `/tmp`, not repository assets. Direct Sharp rendering cannot resolve the SVG custom properties here, so its unmodified black output was discarded as a rendering-tool limitation; Chrome rendered the actual files correctly.

The source SVGs keep their own `prefers-color-scheme` media rules. Full assembled-page light/dark coverage and the required `pnpm build` remain with the coordinator's collection integration pass. A final browser viewport reset timed out while other browser work was active; the coordinator should check/reset any remaining 390 px override before finishing its browser review. This author did not run a competing collection build or change another author's files.
