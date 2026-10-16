---
title: Processes and swimlanes
description: Discover the work, show who performs it, and distinguish choices, parallel work and waiting in a process diagram.
---

A process diagram describes how work moves towards an outcome. Activities name the work, connections show what can follow it, and decisions explain why one case takes a different route from another. Adding swimlanes lets us see who performs each activity. That makes a handoff visible: the case continues, but responsibility passes to someone else.

This is useful when a service crosses people's desks, software and organisational boundaries. A list of steps might say “diagnose, quote, repair”. The useful questions sit between those words. Who sends the quote? What happens while the customer considers it? Can someone begin the repair before an answer arrives?

We will draw an invented repair service. A customer requests a repair, a coordinator triages it, and a technician diagnoses the fault. The customer must approve a quote before repair begins. Cancellation is possible before repair starts. These are the example's agreed rules; other services will need different ones.

## Discover the work before routing every case

Begin by agreeing where this process starts and ends. “From receiving a repair request to starting an approved repair” is small enough to investigate. Delivery, invoicing and warranty claims may matter later, but they need not occupy this first map.

Ask a person who does the work to describe one recent case. Write activities with a verb and an object: “Triage request”, “Diagnose fault”, “Send quote”. A noun such as “Diagnosis” might mean an activity, its result, or a department. The verb gives the drawing a more definite subject.

Group the activities into meaningful phases. IBM Blueworks Live calls these **milestones**. Its Discovery Map view provides a way to organise milestones and activities during interviews, before adding the detailed routing of a process diagram. The discovery map below is our own drawing of that approach, not a screenshot or an exported Blueworks model. [IBM's discovery-map guide](https://www.ibm.com/docs/en/blueworks-live?topic=process-discovery-maps) describes the product workflow.

<figure><img src="/images/drawing-systems/processes-discovery.svg" alt="Three discovery-map columns. Intake contains receive request and triage request. Diagnosis contains diagnose fault and prepare quote. Decision contains send quote and record response. No conditional routing is shown." width="520" height="400"/><figcaption>Milestones group work into phases. This first inventory does not yet explain which response permits repair or what happens when nobody replies.</figcaption></figure>

Now check what the map hides. Does every request reach diagnosis? Does the coordinator prepare a quote from the technician's findings? Is “Record response” something a person does, or does software do it? Leave a question beside a disputed activity rather than giving it a confident owner.

In Blueworks, a process blueprint includes the discovery map, a process diagram and documentation. The first conversion to a process diagram derives a starting arrangement from the discovery map. Later discovery edits are not necessarily reflected in the diagram, so check the relationship after changing either view. That is a product behaviour, not a general property of process maps. [IBM explains the conversion](https://www.ibm.com/docs/en/blueworks-live?topic=process-diagrams).

## Add responsibility with swimlanes

A swimlane groups work by a role, team or other agreed category. In the Blueworks process view, participant lanes are rows and milestone phases are columns. Moving an activity between participant lanes changes who is recorded as performing it. [IBM's lane and milestone reference](https://www.ibm.com/docs/en/blueworks-live?topic=diagrams-swimlanes-milestones) makes that distinction explicit.

For our case, place “Triage request” in the coordinator lane and “Diagnose fault” in the technician lane. Connect them because successful triage makes diagnosis the next activity. The crossing tells us about a transfer of work. It does not tell us whether the coordinator sends a message, adds an item to a shared list or walks across the workshop. Ask that separately when the handoff matters.

<figure><img src="/images/drawing-systems/processes-handoffs.svg" alt="A customer pool sends a dashed request message to Triage request in the coordinator lane of the Repair service pool. A solid sequence arrow crosses into the technician lane and reaches Diagnose fault." width="520" height="490"/><figcaption>The dashed request crosses between participants. The solid sequence flow crosses between roles within the repair service. This is an opening fragment; quote preparation follows diagnosis.</figcaption></figure>

**BPMN**, Business Process Model and Notation, gives these connections defined meanings. A **pool** represents a participant in a collaboration; it can contain a process with lanes. A solid sequence flow orders work inside that process and may cross its lanes. It cannot cross into another pool. A dashed message flow connects separate participants. Here the customer is a separate pool, while coordinator and technician are lanes inside the repair service. The customer's internal work is hidden. These are the distinctions specified in [BPMN 2.0.2, sections 9.3–9.4](https://www.omg.org/spec/BPMN/2.0.2/PDF).

An informal workshop sketch can use simpler conventions if everyone understands the legend. When calling the drawing BPMN, preserve BPMN's meanings. Putting each employee in a separate pool merely to get an attractive row changes what the connections mean.

## Choices and the conditions that select them

After the quote response has arrived, the service can choose what to do. An exclusive gateway, drawn here as a diamond containing X, selects one outgoing path. Label the outgoing paths with the conditions that distinguish them. “Approved” and “Declined” tell us more than two unlabeled arrows leaving “Decision”.

<figure><img src="/images/drawing-systems/processes-choice.svg" alt="After recording a quote response, an exclusive X gateway sends an approved response to Ready for repair and a declined response to Close request. The two conditions are written beside their paths." width="520" height="390"/><figcaption>This gateway examines a response already received. An unanswered quote has not reached it.</figcaption></figure>

That final sentence matters. “Not approved” could mean declined, still waiting, malformed or withdrawn. If we send every such case to “Close request”, we have made a business decision the team may never have intended. Write the actual possible values, then give missing or unexpected information a route to clarification. Blueworks supports exclusive, parallel and inclusive gateways; our small examples use only the first two. [IBM's gateway reference](https://www.ibm.com/docs/en/SS2MKC/pdf/blueworks-live-documentation.pdf) describes their roles.

A gateway also has a merging use. After alternative routes, an exclusive merge lets whichever selected route arrives continue. It does not wait for every alternative: they were never all started. Draw a merge when it makes the return to common work clearer, rather than joining several lines wherever space happens to remain.

When a decision has several inputs, move its conditions into a table. Suppose the coordinator checks service area and whether the appliance is supported. This deliberately small policy applies before diagnosis:

| In service area? | Supported appliance? | Triage result |
| --- | --- | --- |
| Yes | Yes | Continue to diagnosis |
| No | Any value | Decline this request |
| Yes | No | Decline this request |
| Yes | Unknown | Ask for appliance details |
| Unknown | Any value | Ask for location details |

Read the rows as mutually exclusive cases. “Any value” includes unknown, so a known out-of-area address can be declined without first identifying the appliance. That is an explicit choice in this invented policy. If the service wants to collect information for referrals instead, revise the table. The process can retain one “Assess eligibility” activity and route by its result, without a thicket of diamonds.

## Parallel work and the join that waits

Two activities can become eligible together without a required order between them. Suppose that, after approval, one person checks the necessary parts while another prepares a workbench. We will make these two checks prerequisites for beginning the repair.

A parallel gateway, marked with +, starts both paths. A matching parallel join waits for an arrival on each incoming path before continuing. The notation says that the work may proceed independently; it does not promise simultaneous starts, separate staff or any measured speed improvement. [Camunda's parallel-gateway explanation](https://docs.camunda.io/docs/8.8/components/modeler/bpmn/parallel-gateways/) provides a concrete account of this split and join.

<figure><img src="/images/drawing-systems/processes-parallel.svg" alt="A plus gateway splits into Check parts and Prepare bench. Both paths lead into another plus gateway, followed by Begin repair. A note says both must complete." width="520" height="450"/><figcaption>If the bench is ready but the parts check is still open, the lower gateway waits. Both paths were started, so both completions are required here.</figcaption></figure>

Try replacing the upper + with an exclusive X while leaving the lower + unchanged. Now only one path begins, but the join expects both. This small edit can leave the case waiting for work that was never started. Conversely, replacing the join with an exclusive merge would allow each independently completed branch to continue, rather than synchronising them. The symbols encode different obligations; they are not alternative decorations for a fork.

Keep branches that belong together visually close. If one branch becomes a large investigation, put its detail in a subprocess or a separate explanation and retain its entry and completion conditions in the main view.

## Waiting, reminders and cancellation

Waiting is easy to erase from a diagram because nobody appears to be doing anything. Draw “Await quote response” explicitly between sending the quote and evaluating it. Explain who owns a case while it waits and what counts as a response. A blank stretch of line does not communicate either fact.

BPMN can represent a wait for a message with an appropriate receiving event or receive task. A timer can give an elapsed-time event its own route. A **boundary event** is attached to an activity and applies while that activity is active. An interrupting boundary event ends that activity; a non-interrupting one starts additional work while it continues. [IBM's event reference](https://www.ibm.com/docs/en/blueworks-live?topic=diagrams-events) explains these distinctions and the available event types.

<figure><img src="/images/drawing-systems/processes-boundary-events.svg" alt="Two boundary-event fragments. Above, a dashed double-circle timer attached to Await quote response starts Send reminder while the wait continues. Below, a solid double-circle message event attached to a Pre-repair work subprocess leads to Record cancellation and interrupts that subprocess." width="520" height="700"/><figcaption>The event sits on the boundary of the work it can affect. Dashed rings leave that work running; solid rings interrupt it. The lower subprocess includes the wait and subsequent preparation before repair begins.</figcaption></figure>

In the upper fragment, the little clock identifies a timer and the dashed rings identify non-interruption. In the lower fragment, the envelope identifies a received message and the solid rings identify interruption. The small + inside the pre-repair box means that this subprocess contains further detail; it is a different use of + from the gateway diamond.

For example, a reminder after two days should not silently discard the original wait if the customer may still approve. Model the reminder as additional work while the wait remains active. A policy that expires the quote instead needs a different outcome: stop waiting, record expiry, then tell the customer what to do next. The duration and policy belong beside the model; a little clock alone cannot supply them.

Cancellation has a wider scope than the quote wait in our example. It is allowed before repair begins, including after approval while preparations are underway. Attaching “Cancel” only to “Await quote response” would miss that later interval. In a detailed BPMN model, the pre-repair work can be enclosed in a subprocess with an interrupting message event for cancellation. The diagram must also show the cleanup that follows, such as releasing a reserved bench. Do not use BPMN's specialised Cancel event merely because the business calls this cancellation; that event has a specific transaction meaning.

If cancellation and starting repair happen together, the process drawing alone cannot decide which wins. Record the rule and take that question into the [lifecycle](/learn/drawing-systems/states/) or implementation discussion. A diagram should expose the missing decision rather than making an arrow look like an enforcement mechanism.

## When the customer's experience is the question

A service blueprint aligns customer actions with visible service, backstage work and supporting systems. Its line of visibility separates what the customer can see from what happens out of sight. This organising question differs from the participant lanes we used above. [Nielsen Norman Group's blueprint guide](https://www.nngroup.com/articles/service-blueprints-definition/) explains the elements.

Here is a compact slice of our service, read from left to right:

| Layer | Submit request | Consider quote |
| --- | --- | --- |
| Customer action | Describes the fault | Reads price and approves |
| Visible service | Shows request receipt | Shows quote and response receipt |
| **Line of visibility** | **Below this line is backstage** | **Below this line is backstage** |
| Backstage work | Coordinator triages | Technician's diagnosis supports quote |
| Supporting system | Stores repair request | Records approval for the workshop |

If the screen says “Repair booked” immediately after submission, this blueprint exposes a mismatch: diagnosis and approval are still ahead. A more accurate receipt can say that the request was received and explain the next step. The process map helps discover the sequence; the blueprint helps check what the customer is being told about it.

## Practise by walking a different case

Sketch a library's equipment-loan process. A librarian checks a request, a technician checks the equipment, and the borrower accepts the collection terms. Equipment preparation and preparing the collection paperwork may proceed independently after acceptance. Collection needs both. A borrower can withdraw before collection.

Start with a discovery map, then add roles and flow. Where would you put an exclusive choice? What must a parallel join wait for? Does your withdrawal path apply only while waiting for acceptance, or throughout the allowed interval?

One reasonable drawing puts the eligibility decision after the librarian's check, with accepted and rejected routes. It uses a + split for preparation and paperwork, then a + join before collection. It treats the borrower as a separate participant if drawing BPMN message exchanges. Withdrawal needs a scope that includes both preparation branches. Different layouts can express those same facts. Compare meanings, then ask someone to trace a rejected request and a withdrawal through your drawing.

Continue with [Sequence diagrams](/learn/drawing-systems/sequences/) when the question moves from work and ownership to the messages exchanged during one interaction.
