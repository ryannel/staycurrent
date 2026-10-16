---
title: Drawing systems and processes
description: Choose the right diagram, draw it with other people, and build a visual vocabulary you can use at a whiteboard.
---

A box joined to another box makes a surprisingly strong claim. Put “Website” in the first and “Repairs” in the second, and someone may read the line as an API call. Someone else may read it as a customer moving between two stages of a service. Both readings fit the marks. They describe different things.

Drawing a system means deciding which relationships to make visible. A map of the software helps us find responsibilities. A sequence shows messages during one interaction. A process diagram follows work through activities and decisions. A lifecycle follows the possible changes of one thing. Each view leaves something out so that another part becomes easier to see.

This collection teaches how to choose those views, construct them, and use them with other people. It also teaches the physical work of drawing: a small vocabulary of shapes, ways to arrange a board, and a colour scheme that survives an imperfect set of pens. You do not need to draw beautifully to begin. You need to make marks whose meaning people can check.

## If you have a meeting in ten minutes

Go directly to [Drawing at the whiteboard](/learn/drawing-systems/whiteboarding/). Its first-five-minutes method begins with a question, a few labelled shapes and a concrete example. Keep the [shape vocabulary](/learn/drawing-systems/vocabulary/) beside you as a reference. You can use plain boxes for every software part until the other shapes become familiar.

At the top of your board, write the question you are trying to answer. “What happens after a customer requests a repair?” gives the drawing a job. “The repair system” leaves almost anything in scope. Mark whether you are drawing what happens today or proposing a change. Those two small pieces of writing save a great deal of later explanation.

For a longer practice session, follow the whiteboard article with [Layout, labels and five colours](/learn/drawing-systems/layout/). For a design review, begin with [Architecture diagrams](/learn/drawing-systems/architecture/) and choose another view when a question needs it. You can enter any article directly; the collection order is a reading path, not a prerequisite chain.

## Choose the question before the notation

Imagine a repair service. A customer reports a broken appliance. A coordinator checks the request, a technician diagnoses the fault, and the customer approves a quote before repair work begins. The software records the request and sends notifications. This is an invented example we will use to investigate drawing choices; it is not a specification of how repair businesses must operate.

Even that short account contains several questions. Who does the triage? Which program stores the request? Does the browser wait for the email? Can the customer cancel after approving the quote? Putting all their answers on one drawing would mix responsibilities, software structure, message order and business rules. We can keep the same names across several drawings while choosing a different organising principle for each.

<figure><img src="/images/drawing-systems/overview-views.svg" alt="Three views of a repair request: structure connects browser to API and database; process passes work from coordinator to technician; lifecycle changes a request from awaiting approval to ready for repair." width="520" height="650"/><figcaption>The subject stays the same. The meaning of the line changes with the question. Read its label and the view title before tracing it.</figcaption></figure>

| The question in the room | A useful first drawing | What to put on the connections |
| --- | --- | --- |
| What are the parts, and what depends on what? | Architecture or context diagram | Uses, calls, reads, publishes; name the relationship |
| Who does what, and where does work go next? | Process map with swimlanes | Order of work and the conditions that choose a branch |
| Who sends which message, and what happens if a reply never arrives? | Sequence diagram | Requests, responses and events, in the scenario's order |
| What does “request” mean, and how does it relate to an appointment? | Conceptual domain model | Named relationships with cardinality and optionality |
| When is cancellation allowed? | State diagram | Events and conditions that permit a transition |
| Where does this information come from and go? | Data-flow diagram | The information being transferred |
| Which work can a customer see? | Service blueprint | Customer actions, visible service, backstage work and dependencies |

The first five have full worked articles here. The final two are introduced below and contrasted with the neighbouring views. They are useful choices to recognise even when a meeting does not need their full notation.

A single question may need two views. Suppose the API accepts a repair request and a worker sends an email later. The architecture diagram locates the worker. The sequence diagram tells us whether the response precedes the email. Drawing a line from API to worker cannot establish that ordering by itself.

## Diagram, notation, tool and style

A **diagram family** gives you a way to organise the subject: sequence, process, structure or lifecycle. A **notation** gives marks defined meanings. In a sequence diagram, a vertical lifeline represents a participant through the interaction. In BPMN, particular events and gateways have specified behaviour. Once you use formal notation, those meanings matter.

A **tool** helps you make and maintain the drawing. Mermaid describes diagrams in text. IBM Blueworks Live supports process discovery and modelling. A pen, a manual diagram editor and a modelling repository offer different ways to work. Choosing Mermaid does not decide whether you need a flowchart or a sequence diagram; it supports both. Its [diagram syntax reference](https://mermaid.js.org/intro/syntax-reference.html) shows the range.

A **visual style** controls how the drawing looks: corners, lettering, colour, line weight and the few identifying details you repeat. You can draw an informal system view with sharp boxes or soft corners and keep the same relationships. You cannot change a BPMN gateway into a decorative star and expect people familiar with BPMN to retain its meaning.

C4 is a way of organising software architecture views around levels of abstraction. Its core views are context, container, component and code. The component view is sometimes referred to as C3 or level 3; the overall approach is C4. The [architecture article](/learn/drawing-systems/architecture/) explains how to choose the useful level rather than drawing all four by habit. See the [C4 introduction](https://c4model.com/introduction) for its original framing.

Blueworks-style process work and Mermaid sequences are therefore complementary examples, not competing diagram types. One helps a group discover activities and responsibilities; the other can record an interaction in a reviewable text file. We will use each where it makes the learning concrete.

## Walk a case through the drawing

A drawing becomes useful when someone can use it to explain what happens. Take one request, R17, for a broken washing machine. Ask the coordinator to point to where it enters, who checks it, and how the technician receives it. If the drawing shows a direct handoff but the coordinator describes a shared inbox that someone checks twice a day, draw the inbox and the wait. That missing detail may explain the delay the meeting was called to investigate.

Then change one fact. The customer declines the quote. Where does R17 go? If every arrow leads to “Repair”, the happy path has silently become a claim that every request is approved. Add the declined outcome, or clearly label the picture as the approved scenario and draw the alternative separately.

Finally, read across views. If the process allows cancellation before work begins, the lifecycle needs to account for it. If the sequence sends an email through a provider absent from the architecture drawing, decide whether that omission fits the architecture's stated scope. Agreement between views makes them more coherent; it does not prove that the real service behaves that way. A person who does the work, or evidence from the running system, still has to check the account.

This is the recurring practice in the collection: select a question, draw the relevant relationships, follow a particular case, then introduce a consequential change. The result is easier to challenge than a wall of boxes everyone vaguely recognises.

## Other views worth recognising

A **data-flow diagram** follows information between external actors, processes and stores. For the repair service, it might show contact details entering the request service, being stored, and leaving for a notification provider. Label the arrows “contact details” or “appointment notice”. Their purpose is to name information movement, not to number business steps. If the question concerns exposure, mark trust boundaries and inspect what crosses them. The [domains article](/learn/drawing-systems/domains/) gives a bounded contrast; Microsoft's [threat modelling guidance](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats) describes data-flow elements used for security analysis.

A **service blueprint** places customer actions alongside visible service actions, backstage work and supporting processes. Suppose the customer sees “We will contact you soon” while the request sits in an unassigned queue. A process map can expose the queue; a blueprint also makes the mismatch between the customer's experience and the backstage work visible. Our process article shows a compact example. It is the right direction when the question is about the experience across channels, including people and physical work.

A **decision table** is often clearer than a branching forest. If eligibility depends on warranty status, appliance type and location, make those conditions columns, then describe each meaningful combination and its outcome. Include an explicit unknown case when facts may be missing. The [process article](/learn/drawing-systems/processes/) compares a small decision with its tabular version.

A **timeline** places events on an axis. Use actual timestamps when investigating an incident, and distinguish them from estimated times or an unscaled story. If a request waited overnight, a sequence diagram's vertical spacing does not measure that delay unless you explicitly give it a time scale. A timeline makes elapsed time the organising idea.

A **causal-loop diagram** proposes how quantities influence one another. A longer repair backlog might increase pressure to rush diagnosis; more mistakes might create rework and increase the backlog. Such a loop is a hypothesis about influence, including delays, not a message path or evidence that the cause has been established. Do not reuse API arrows and assume they express this relationship.

Choose these when the question calls for them. A drawing is allowed to stop at the boundary of what it explains.

## The collection

The view articles teach how to construct and read a diagram. The whiteboard articles teach how to produce one while thinking and listening. The final article carries the result into shared documentation.

1. [Architecture diagrams](/learn/drawing-systems/architecture/) — choose a scale, name responsibilities and distinguish software structure from deployment.
2. [Processes and swimlanes](/learn/drawing-systems/processes/) — discover activities, handoffs, decisions, waiting and exceptions.
3. [Sequence diagrams](/learn/drawing-systems/sequences/) — follow calls, replies and events, including an uncertain outcome.
4. [Domains and data relationships](/learn/drawing-systems/domains/) — agree on terms, identities and how many things can be related.
5. [States and lifecycles](/learn/drawing-systems/states/) — draw the changes one thing is allowed to make.
6. [Drawing at the whiteboard](/learn/drawing-systems/whiteboarding/) — build and revise a shared picture during a conversation.
7. [A whiteboard shape vocabulary](/learn/drawing-systems/vocabulary/) — practise quick recognisable shapes and choose a consistent character.
8. [Layout, labels and five colours](/learn/drawing-systems/layout/) — guide the eye and make meaning survive a photograph or a single working pen.
9. [Keeping diagrams useful](/learn/drawing-systems/maintaining/) — select tools, preserve decisions and review a drawing when the system changes.

For a first exercise, take “Why do customers receive two appointment emails?” Choose your opening view before drawing. A sequence is a useful start because the question concerns repeated messages during an interaction. Add the request, notification and retry participants you can identify; mark the rest as unknown. A process view may become useful if two people independently send the email. The choice depends on what the investigation reveals, and changing views is part of the work.
