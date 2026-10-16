---
title: Architecture diagrams
description: Choose a useful C4 zoom, follow a system boundary from context to components, and distinguish logical structure from deployment.
---

An architecture diagram makes a claim about the parts of a system and the relationships between them. A box labelled “Repair service” might mean a business, a software system, an application or one running process. Until we settle which, adding more boxes can make the drawing harder to understand.

C4 gives us a way to change that level of detail deliberately. We can show a software system in its surroundings, open it to reveal applications and data stores, then open one application to show its internal responsibilities. A reader should be able to recognise the thing we opened and understand what remains outside it.

We will draw an invented repair-management system. Customers request repairs, a coordinator triages them, and technicians diagnose faults. The system records a quote, waits for customer approval, and records repair work. These are teaching designs, not a recommendation for how every repair business should build its software.

## Choose a question before a zoom

The four C4 levels are **context, container, component and code**. They move from the system's surroundings to its implementation. If someone asks for a “C3 diagram,” they may mean the third level, a component diagram, or may be remembering the name C4. Ask which question they need the drawing to answer; the number alone does not establish its scope. The [official C4 overview](https://c4model.com/diagrams) describes the levels and treats them as useful choices, rather than four compulsory deliverables.

| Question | Useful starting view |
| --- | --- |
| Who uses this system, and what else does it depend on? | System context |
| Which applications and data stores carry its responsibilities? | Container |
| Where inside this application does a particular responsibility live? | Component |
| Which classes, functions or other code elements implement that part? | Code |
| Where do its running instances live in this environment? | Deployment |

Deployment is a separate view. A deeper code zoom does not eventually reveal the production servers: it reveals implementation detail.

## Context: establish the system's surroundings

Start with the repair-management software as one box. Its users are customers, coordinators and technicians. It also calls a notification provider to deliver messages. The provider is outside this software system; the team integrates with it but does not implement its delivery service.

<figure>
  <img src="/images/drawing-systems/architecture-context.svg" alt="Context of the repair-management system. Customer, coordinator and technician roles use it to request, triage and record repairs. The system asks an external notification provider to deliver customer messages." width="500" height="650" />
  <figcaption>The context drawing identifies the software system and its neighbours. Its arrows describe uses and dependencies, not the order in which a repair happens.</figcaption>
</figure>

Follow one case: Mina requests a repair and later approves its quote. The customer relationship covers both actions. The technician's relationship covers recording the diagnosis and work. The provider relationship accounts for messages about the quote. We can discuss who needs access without discussing a database yet.

This is the scope of a [C4 system context diagram](https://c4model.com/diagrams/system-context): people and neighbouring software systems around the system of interest. The surrounding people are roles, so the picture does not imply one technician or one customer. Nor does an arrow to the provider establish that every message arrives.

The boundary matters when someone asks, “Does the repair system send email?” The answer here is that it decides which messages to request; an external provider delivers them. That distinction helps the team identify an integration to review. It does not show contracts, availability or how a delivery failure is handled.

## Containers: open the software system

Now ask where those responsibilities run. Our example uses a browser application for the three roles, a Repair API that accepts their operations, a Repair DB that stores requests and notification jobs, and a notification worker that reads pending jobs and calls the provider.

In C4, a **container** is an application or data store. The term does not require Docker. A browser application and a database can both be C4 containers even when nobody has packaged them in an operating-system container. The [C4 container definition](https://c4model.com/abstractions/container) explains this distinction.

<figure>
  <img src="/images/drawing-systems/architecture-containers.svg" alt="Inside the repair-management system are a browser UI, Repair API, Repair DB and notification worker. The UI calls the API over HTTPS. The API reads and writes repair records and notification jobs in PostgreSQL. The worker reads jobs and records outcomes there, and requests delivery from the external provider over HTTPS." width="500" height="1010" loading="lazy" />
  <figcaption>All four containers belong to the same software system, including the UI that runs on a user's device. The notification provider remains outside. Arrow direction follows the caller or user of a dependency.</figcaption>
</figure>

The API arrow to the database means the API reads and writes there. It is not a one-way claim about bytes: query results return along the connection. The labels make that interpretation explicit. The worker's arrow to the database similarly describes its use of stored jobs, rather than saying the database initiates a call to the worker.

Walk Mina's approval through this view. The browser sends an approval operation to the API. The API validates it and records the new request state, together with notification work. The worker can later find that work and ask the provider to send a message. Those sentences expose responsibilities that a line labelled “connects to” would conceal.

They also expose questions the picture cannot settle. Does recording the state and notification work happen together? What happens if delivery fails? This design needs answers, but the arrangement of boxes does not supply them. A [sequence diagram](/learn/drawing-systems/sequences/) can follow the messages in one such case.

The [C4 container view](https://c4model.com/diagrams/container) shows the applications, data stores, technologies and communication within one system. Keep a database's technology separate from its responsibility: “PostgreSQL” names the implementation; “repair records and notification jobs” explains why it is here. If the technology is undecided, say so rather than using a vendor icon to make a tentative choice look settled.

## Components: open one container

Suppose the review is about where to enforce “a cancelled request cannot start repair work.” More servers on the drawing will not answer that. Open the Repair API instead.

Our example divides it into an HTTP interface, request rules and a request repository. The interface receives operations, the rules decide whether a requested change is permitted, and the repository reads and saves request data. These are responsibilities implemented by TypeScript modules in the same application. They are not three independently running services.

<figure>
  <img src="/images/drawing-systems/architecture-components.svg" alt="A component view opens only the Repair API. The browser calls its HTTP interface, which invokes request rules, which use the request repository. The repository reads and saves records in the Repair DB outside the API boundary. The three internal components are TypeScript modules." width="500" height="850" loading="lazy" />
  <figcaption>The Repair API boundary contains its components. The browser and database remain neighbouring containers; opening the API has not moved them inside it.</figcaption>
</figure>

The [C4 component view](https://c4model.com/diagrams/component) takes one container as its scope. Here the drawing helps us assign a change: the cancellation rule belongs with request rules, while the repository must provide a way to apply the decision safely to current data. If the repository simply overwrites whatever it read earlier, the named “rules” component cannot prevent two concurrent operations from contradicting each other. The [lifecycle article](/learn/drawing-systems/states/) works through that case.

Notice what stayed consistent across the zoom. Repair API is still the application the browser calls. Repair DB is still outside that application. The notification worker is omitted because it does not call these components in our example. State that selection rather than moving it into the API to make the picture look complete.

A code view could open request rules to show a function, the request object and the transition table it uses. Draw that only when the implementation relationship is the question. The [C4 code guidance](https://c4model.com/diagrams/code) treats this as optional detail and suggests generating it where practical. A hand-maintained picture of every class can demand more upkeep than the explanation it provides.

## Deployment: place instances in an environment

Our logical design has one Repair API container. A particular deployment might run two instances of it. The next drawing shows a deliberately small staging environment: both API instances and one worker run on one virtual machine; the database runs in a separate managed service.

<figure>
  <img src="/images/drawing-systems/architecture-deployment.svg" alt="Invented staging deployment. The browser UI runs on a user device. One application virtual machine contains Repair API instances A and B and one notification worker. A separate database service hosts Repair DB. The external notification provider is shown separately. Communication links are omitted in this placement view." width="500" height="780" loading="lazy" />
  <figcaption>Two API instances are still instances of the same logical container. Because both share one host, counting two boxes does not establish resilience to that host failing.</figcaption>
</figure>

A [deployment diagram](https://c4model.com/diagrams/deployment) maps instances onto infrastructure in a named environment. Here its nested boundaries mean “runs on,” whereas the earlier system boundary meant “belongs to this software system.” Those are different claims. The browser UI can belong to our software while running on a customer's device.

If the question becomes “What happens when this host stops?”, add the relevant routing and failure details to this deployment view. A placement drawing with communication omitted cannot explain how a request reaches A or B. Keep its omissions in the caption, and use the container view for the logical relationships it already shows clearly.

## Make a drawing that another person can inspect

Give each view a title, a scope and a status such as current or proposed. Name what each boundary means. Use labels that let someone read a relationship as a sentence: “Browser UI submits approvals to Repair API over HTTPS.” The [C4 notation guidance](https://c4model.com/diagrams/notation) recommends explicit element types, responsibilities and labelled relationships; C4 does not require a particular colour scheme or drawing application.

Before adding detail, try the drawing on one ordinary case and one awkward one. Can you locate the part responsible for rejecting a late cancellation? Can you find the external dependency involved when a quote message is missing? An inability to answer can mean the drawing needs another view, rather than more small boxes on this one.

## Try a change of scope

Draw the repair system's context from memory. Then add a proposed mobile application. Which existing relationship changes, and at which zoom should the new box appear?

**Discussion.** If the same customers perform the same actions through the same software system, the context may remain unchanged. At container level, a separately running mobile application belongs alongside the browser UI and calls the Repair API. If the proposal also introduces a new external identity provider, that is a new neighbouring system and should appear at context level. A new screen does not automatically imply a new context box.

Now draw two Repair API instances inside one production host. Someone says, “We can lose either server without interruption.” What does the diagram support?

**Discussion.** It supports the claim that two application instances share a host. It does not show two independent servers, routing during failure, or enough remaining capacity. Correct the statement and clarify whether the intended design requires separate hosts. The mistake is consequential even if every box is beautifully aligned.

Continue with [sequence diagrams](/learn/drawing-systems/sequences/) when order and replies matter, or [domains and data relationships](/learn/drawing-systems/domains/) when the team disagrees about what a request actually represents. For a longer-lived architecture document, [keeping diagrams useful](/learn/drawing-systems/maintaining/) covers capture and review. The official [C4 diagram review checklist](https://c4model.com/diagrams/checklist) is a useful final pass for scope, labels and interpretation.
