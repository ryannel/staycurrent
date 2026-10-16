---
title: Drawing systems and processes
description: Which diagram answers which question, from C4 and sequence diagrams to BPMN, ER models and state machines, and how to draw them with other people.
---

Each kind of system diagram answers one kind of question. An architecture diagram shows which parts exist and what depends on what. A sequence diagram shows the messages in one interaction, in order. A process map shows who does which work and where it goes next. A state diagram shows how one thing is allowed to change. Pick the diagram from the question, and a line between two boxes has one clear meaning.

This page maps the common diagram types to the questions they answer, explains how they relate to notations such as UML, BPMN and C4 and to tools such as Mermaid, and links to the articles in this collection. The examples come from a small invented repair service: customers request repairs in a browser, an API stores the requests, and a background worker sends notification emails.

## Which diagram answers which question

| Question | Diagram | What a line means |
| --- | --- | --- |
| What are the parts, and what depends on what? | [Architecture diagram](/learn/drawing-systems/architecture/) (C4 context, container, component) | Uses, calls, reads or publishes, with the relationship named |
| Who does what, and where does work go next? | [Process map with swimlanes](/learn/drawing-systems/processes/) (BPMN) | The order of work, and the condition that picks a branch |
| Who sends which message, in what order? What if a reply never arrives? | [Sequence diagram](/learn/drawing-systems/sequences/) | A request, reply or event at one point in the interaction |
| What do our terms mean, and how many of one thing relate to another? | [Domain model or ER diagram](/learn/drawing-systems/domains/) | An association with a count at each end |
| When is a change, such as cancellation, allowed? | [State diagram](/learn/drawing-systems/states/) | A transition, labelled with its event and condition |
| Where does information come from and where does it go? | [Data-flow diagram](#data-flow-diagram) | The information being moved |
| What does the customer see, and what happens behind it? | [Service blueprint](#service-blueprint) | Customer actions against front-stage and backstage work |

<figure><img src="/images/drawing-systems/overview-views.svg" alt="Three views of a repair request: structure connects browser to API and database; process passes work from coordinator to technician; lifecycle changes a request from awaiting approval to ready for repair." width="520" height="650"/><figcaption>The same repair request in three diagrams. In the structure view a line is a dependency between programs; in the process view it is work passing between people; in the lifecycle it is a change of state.</figcaption></figure>

Some questions need two diagrams. If the API accepts a request and a worker sends the email later, the architecture diagram shows where the worker sits, and the sequence diagram shows whether the browser gets its response before the email is sent.

## Architecture diagrams and C4

An architecture diagram shows a system's parts and the dependencies between them. The **C4 model** organises these diagrams by zoom level: a **context** diagram shows the system among its users and the external systems it talks to, a **container** diagram opens the system to show its applications and data stores, a **component** diagram opens one container, and a **code** diagram opens one component. Most teams only need the first two or three. People sometimes call the component level "C3", but C4 is the name of the whole approach.

Deployment, which instances run where, is a separate diagram. Zooming further into the code never reaches the servers. The [architecture article](/learn/drawing-systems/architecture/) covers choosing a zoom level, naming relationships, and keeping structure and deployment apart. The [C4 introduction](https://c4model.com/introduction) is the original description.

## Process maps, swimlanes and BPMN

A process map shows the activities in a piece of work, the decisions between them and who does each one. **Swimlanes** give each role a row, so a line that crosses lanes is a handoff: the repair request leaves the coordinator and reaches the technician.

**BPMN** (Business Process Model and Notation) gives these marks defined meanings. A **pool** is a participant, and **lanes** divide it into roles. Solid **sequence flows** order the work inside a pool, dashed **message flows** run between pools, and **gateways** split or join paths: exclusive for one branch, parallel for several. A workshop sketch can use simpler conventions, but if you call the drawing BPMN, keep BPMN's meanings. The [process article](/learn/drawing-systems/processes/) builds a swimlane diagram from a discovery map, then adds choices, parallel work, waiting and cancellation.

## Sequence diagrams

A sequence diagram shows the messages exchanged during one interaction, in order. Each participant has a vertical **lifeline**, time runs downwards, and each arrow is a request, reply or event. Framed **fragments** mark alternatives (`alt`), optional steps (`opt`), repetition (`loop`) and work that happens in parallel (`par`).

Sequence diagrams answer ordering questions that architecture diagrams can't. For example, does the browser receive its receipt before the notification job runs? What does the API know if the database never replies? The [sequence article](/learn/drawing-systems/sequences/) writes each example in Mermaid and includes a lost reply that leaves two possible histories.

## Domain models and ER diagrams

A **domain model** (or conceptual model) names the things a business talks about and how they relate: a customer has repair requests, a repair request has appointments and quotes. An **entity-relationship (ER) diagram** draws the same kind of relationships, often closer to a database design.

The key detail is **cardinality**: how many of one thing can relate to another. It is written at each end of the line, as `1`, `0..1`, `0..*` or `1..*`, or in crow's-foot notation. A domain model isn't a schema. It says one request can have many appointments, and leaves the keys and tables to a later design. The [domains article](/learn/drawing-systems/domains/) covers names, identity, cardinality and the step to a schema.

## State diagrams

A state diagram, or **state machine**, shows the states one thing can be in and the transitions allowed between them. A repair request might move from Submitted to Diagnosing, Awaiting approval, Approved, In repair and Completed. Each transition is labelled `event [guard] / effect`: what happened, the condition that must hold, and the work done when the transition is taken.

State diagrams answer rule questions, such as whether a customer can cancel after approving a quote, or what happens when a cancellation and the start of repair work arrive together. The [states article](/learn/drawing-systems/states/) also puts the same rules in a **state table**, where a missing combination of state and event is easier to spot.

## Data-flow diagram

A data-flow diagram (DFD) follows information between **external entities**, **processes** and **data stores**. Its arrows are labelled with the data that moves, such as "contact details" or "appointment notice". They show information moving, not steps in time.

Threat modelling uses DFDs with **trust boundaries** drawn on them, so you can inspect every flow that crosses one. For the repair service, the recipient address and message text cross from the notification worker to an external email provider. The [domains article](/learn/drawing-systems/domains/#change-views-when-the-question-changes) contrasts a small DFD with the domain model. Microsoft's [threat modelling guidance](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats) describes the elements used in security analysis.

## Service blueprint

A service blueprint lines up what the customer does against the **front-stage** actions they can see, the **backstage** work they can't, and the **support processes** underneath. The **line of visibility** separates what the customer sees from the rest.

Use one when the question is about the customer's experience across channels. For example, the customer sees "We will contact you soon" while the request waits in an unassigned queue. The [process article](/learn/drawing-systems/processes/#when-the-customers-experience-is-the-question) includes a compact blueprint.

## Decision tables, timelines and causal-loop diagrams

A **decision table** replaces a tangle of branches when an outcome depends on several conditions at once. Each condition gets a column, such as warranty status, appliance type or location, and each meaningful combination gets a row with its outcome. Add an explicit row for unknown values. The [process article](/learn/drawing-systems/processes/) compares a small decision drawn as a gateway with the same decision as a table.

A **timeline** places events on a time axis. Use real timestamps for incident reviews, and mark estimated times as estimates. A sequence diagram's vertical spacing doesn't measure elapsed time, so a request that waited overnight needs a timeline.

A **causal-loop diagram** shows how quantities influence each other, with **reinforcing** and **balancing** loops. A growing repair backlog increases pressure to rush diagnosis, rushed diagnosis causes rework, and rework grows the backlog. Each arrow is a proposed influence, so treat the loop as a hypothesis to test.

## Notations, diagram types and tools

These terms often get mixed up:

- A **diagram type** decides what the drawing is organised around: structure, messages over time, work, or the life of one thing.
- A **notation** gives marks defined meanings. **UML** covers several diagram types, including class, sequence, state machine and activity diagrams. **BPMN** covers process diagrams. **C4** is a set of architecture zoom levels that can be drawn in any box-and-line notation.
- A **tool** makes and maintains the drawing. **Mermaid**, **PlantUML** and **Structurizr** generate diagrams from text that can live in a repository and be reviewed like code. draw.io and Excalidraw are freehand editors, and IBM Blueworks Live supports process discovery and modelling.

So "Mermaid or sequence diagram?" isn't a real choice: Mermaid draws sequence diagrams, flowcharts, state diagrams and more ([syntax reference](https://mermaid.js.org/intro/syntax-reference.html)). Choose the diagram type from the question, the notation from who will read it, and the tool from how the drawing will be maintained. The [maintenance article](/learn/drawing-systems/maintaining/) covers choosing a tool.

## Drawing at a whiteboard

Live drawing uses the same diagram types, made quickly with other people. Write the question at the top of the board, such as "What happens after a customer requests a repair?", and mark whether you're drawing the current system or a proposal. Use plain labelled boxes for every software part until you need more, and name each line as you draw it, so people can correct a wrong arrow while it's still cheap to change.

Three articles cover the practice. [Drawing at the whiteboard](/learn/drawing-systems/whiteboarding/) covers running the board during a conversation. [A whiteboard shape vocabulary](/learn/drawing-systems/vocabulary/) gives quick shapes for users, services, stores and queues, and comes with a [printable reference](/images/drawing-systems/whiteboard-reference.html). [Layout, labels and five colours](/learn/drawing-systems/layout/) covers arrangement and a colour scheme that still works in a black-and-white photo.

## The collection

Every article can be read on its own. In order:

1. [Architecture diagrams](/learn/drawing-systems/architecture/): C4 zoom levels, relationships and deployment.
2. [Processes and swimlanes](/learn/drawing-systems/processes/): activities, handoffs, BPMN gateways, waiting and cancellation.
3. [Sequence diagrams](/learn/drawing-systems/sequences/): calls, replies, fragments and lost messages, in Mermaid.
4. [Domains and data relationships](/learn/drawing-systems/domains/): terms, identity, cardinality and the step to a schema.
5. [States and lifecycles](/learn/drawing-systems/states/): states, events, guards, effects and state tables.
6. [Drawing at the whiteboard](/learn/drawing-systems/whiteboarding/): building a shared drawing during a conversation.
7. [A whiteboard shape vocabulary](/learn/drawing-systems/vocabulary/): quick shapes and a consistent drawing style.
8. [Layout, labels and five colours](/learn/drawing-systems/layout/): arrangement, labels and colour that survives a photograph.
9. [Keeping diagrams useful](/learn/drawing-systems/maintaining/): tools, decision records and when to update a diagram.
