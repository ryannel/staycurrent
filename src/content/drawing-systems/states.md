---
title: States and lifecycles
description: Draw the allowed changes of one object, distinguish events from guards and effects, and test cancellation when two operations arrive together.
---

A repair request can have a quote without permission to begin the repair. It can also have permission without any repair work having started. If the system records both situations as “open,” the next person must reconstruct which actions are allowed from other facts.

A state diagram makes those distinctions explicit. Each state describes a condition of one thing; each transition describes an allowed change when something happens. We can then ask whether a proposed operation is valid here, rather than treating every operation as available at every moment.

Our object is one `RepairRequest` in an invented repair service. A coordinator triages it, a technician diagnoses the problem, and the customer receives a quote. Repair work requires approval. The customer may cancel before repair work starts. Diagnosis is preliminary work in this example; “work starts” in the cancellation rule means the start of the approved repair, not the earlier diagnosis. A real service must agree that distinction with its customers and staff.

## A state describes what is true now

Consider request R42 while Mina reads its quote. “Send quote” describes an activity. “Awaiting approval” describes the request's condition after the quote is issued and before an answer is accepted. That condition can last minutes or days. While it holds, approving the current quote can be valid and starting repair work is not.

Here is one ordinary route through the lifecycle:

<figure>
  <img src="/images/drawing-systems/states-route.svg" alt="Ordinary route for one RepairRequest. Creation enters Submitted. Accepting triage enters Diagnosing; issuing a quote enters Awaiting approval; accepting customer approval enters Approved; starting repair enters In repair; completing repair enters Completed. This panel omits cancellation and guards." width="500" height="900" />
  <figcaption>The boxes are conditions of the same request. The arrows name events that can change it. This panel follows the successful route; cancellation is added below.</figcaption>
</figure>

Submitted means the request exists but triage has not accepted it for diagnosis. Diagnosing means that preliminary assessment is underway. Awaiting approval means a current quote is available. Approved means that offer has been accepted, but repair has not started. In repair means the start has been authorised and recorded. Completed means the repair has been recorded as finished.

Those meanings should be strong enough to guide an operation. Approved and In repair deserve separate states because cancellation is allowed in one and refused in the other. “Technician opened the page” would not deserve a state in this model unless it changed some rule we need to express.

This is a deliberately limited lifecycle. It does not yet model an unrepairable appliance, a declined quote or a reopened case. Before using it for a real service, find out how those cases end or resume. A teaching diagram can set a boundary; an implementation cannot safely assume every missing case is impossible.

## Events, guards and effects

An **event** is something the model receives or observes: a customer asks to approve a quote, a technician requests permission to start, or a completion is recorded. An event can arrive without being accepted. A **guard** is a condition that must hold for the transition to be allowed. An **effect** is work performed when the transition is taken.

Use this label convention:

`event [guard] / effect`

The square brackets and slash separate the three meanings. If a guard or effect is omitted, the drawing must make clear whether there is none or whether this view has hidden detail. W3C's [state-machine introduction](https://www.w3.org/TR/scxml/#BasicStateMachineNotation) describes events, conditions and transition actions; this article uses a compact drawing notation rather than SCXML's executable XML syntax.

<figure>
  <img src="/images/drawing-systems/states-transition.svg" alt="An approval transition from Awaiting approval to Approved. Event: approve Q9. Guard: Q9 is the current quote. Effect: record acceptance of Q9. A separate note says an approval of an old quote leaves the request awaiting approval and returns a stale-quote result." width="500" height="520" loading="lazy" />
  <figcaption>The event supplies the offered quote's identity. The guard prevents an old approval from silently accepting a replacement offer.</figcaption>
</figure>

Suppose R42 has current quote Q10, but Mina's old browser page sends approval for Q9. The event arrives while the request is Awaiting approval. That source state alone is not enough: the guard fails because Q9 is no longer current. Our chosen response is to leave the state unchanged and tell Mina to review Q10.

Checking a guard should answer a question, not change the facts it is testing. Recording acceptance belongs in the effect after the transition is selected. The [Stately guard documentation](https://stately.ai/docs/guards) makes this distinction explicit for its state-machine implementation. The diagram uses the same separation to make a review understandable even without executable tooling.

## Put the decision in a state table

The picture gives a route. A table makes each allowed operation easier to inspect. For this example, assume the caller is authenticated and authorised for the requested operation; access rules must be enforced as well as lifecycle rules.

| Current state | Event and guard | New state and effect |
| --- | --- | --- |
| Submitted | Triage accepts the request | Diagnosing; record the triage decision |
| Diagnosing | Issue a quote | Awaiting approval; record the current offer |
| Awaiting approval | Approve a quote, if it is current | Approved; record which offer was accepted |
| Approved | Start repair, if acceptance is still valid | In repair; record who obtained permission to start |
| In repair | Complete repair | Completed; record completion |
| Any of the four states before In repair | Cancel request | Cancelled; record cancellation |

For this table, any event without an applicable row leaves the state unchanged and returns a reason. That is a design choice, not a universal behaviour of state-machine libraries. A repeated approval could instead return the previously recorded success when it names the same offer; choose and document such behaviour before callers rely on retries.

Try “start repair” in Awaiting approval. There is no matching row, so it fails. Try “complete repair” in Approved. It also fails: the start step was never accepted. Missing transitions now expose decisions that a row of status names alone would not show.

## Group states that share a rule

Drawing four cancellation arrows is manageable, but they repeat the same rule. We can place Submitted, Diagnosing, Awaiting approval and Approved inside a parent state called **Before repair**. A cancellation transition leaving that parent applies while any of its children is active in this model.

<figure>
  <img src="/images/drawing-systems/states-hierarchy.svg" alt="Before repair is a parent containing Submitted, Diagnosing, Awaiting approval and Approved, in that order. Its initial child is Submitted. Cancel leaves the parent for Cancelled. Start repair leaves Approved for In repair. There is no cancellation transition from In repair." width="500" height="800" loading="lazy" />
  <figcaption>Being in Approved also means being in Before repair. Leaving the parent by cancellation ends that active child state. The shared boundary expresses a lifecycle rule, not a team or server boundary.</figcaption>
</figure>

Hierarchy lets a reader see both the broad condition and the current detail. In a compound state of this kind, one child is active at a time; the initial marker says which child begins a fresh entry. [Stately's parent-state guide](https://stately.ai/docs/parent-states) explains nested states and how parent transitions can handle events left unhandled by their children.

Our drawing gives children no competing cancellation rules. If you add one, check the chosen notation or execution engine's precedence rules rather than assuming both transitions happen. The simpler repair is often to make the common rule genuinely common.

Do not put “Awaiting approval” and “Notification pending” into one exclusive list merely because both sound like statuses. A request can await approval while a message is pending, delivered or failed. If notification tracking needs its own lifecycle, give that object a separate diagram and name the events linking them. Otherwise every request state starts multiplying into combinations of unrelated facts.

## Cancellation and starting work can race

R42 is Approved. Mina asks to cancel at almost the same moment a technician asks to start. Both operations could read Approved before either writes its result. A drawing with the right arrows does not prevent both callers from announcing success.

The decision must use the current state at the moment the change is accepted. Treat “check that the transition is still allowed and record the new state” as one indivisible operation. A conditional update, a suitable transaction or a single serial owner can implement that idea; an earlier screen read cannot. The point here is the rule to enforce, not a choice of database mechanism.

<figure>
  <img src="/images/drawing-systems/states-race.svg" alt="Two possible serial decisions from Approved. In the first, cancellation is accepted and records Cancelled, then start is refused. In the second, start is accepted and records In repair, then cancellation is refused. In both cases the second operation checks the updated state." width="500" height="650" loading="lazy" />
  <figcaption>Either accepted order is consistent with this model. Both operations succeeding would contradict it. “First” means first accepted state change, not first click on either device.</figcaption>
</figure>

The technician must wait for successful permission before beginning the physical repair. If work starts first and the record is updated later, the software can accept cancellation during that gap and still disagree with reality. Naming the start transition forces the team to settle what the recorded state means operationally.

This example uses first-accepted transition as its policy. If the business wants customer cancellation to take precedence until a different physical milestone, it needs a different protocol and probably another state. That is a useful discovery from the drawing, not something arrow placement can resolve.

## Try the lifecycle against a sequence

Draw this history for R42: submit, accept triage, issue Q9, approve Q9, cancel, start repair. Write the state after each event before reading the discussion.

**Discussion.** The states are Submitted, Diagnosing, Awaiting approval, Approved and Cancelled. The final start attempt is refused and R42 stays Cancelled. If a sequence diagram shows the technician receiving successful permission after that cancellation, the two views disagree. Repair the interaction or the lifecycle rule; do not retain both as descriptions of the same design.

Now change the order to start, then cancel, after approval. Does the request end as Cancelled?

**Discussion.** It ends In repair, with cancellation refused. Returning a refusal should also guide the customer to whatever contact or dispute route the real service provides. The state diagram identifies the rejected operation; it does not design the entire customer response.

Finally, a colleague adds “Email sent” between Approved and In repair. Test a successful approval when the notification provider is unavailable.

**Discussion.** The added state makes successful message delivery a prerequisite for starting repair. That may be an intended policy, but it is a new one. If delivery is merely tracked alongside the request, remove it from this exclusive lifecycle and give notification work its own states. A status box can accidentally introduce a business rule.

Use [sequence diagrams](/learn/drawing-systems/sequences/) to examine the competing messages and replies. Use [domains and data relationships](/learn/drawing-systems/domains/) when the disagreement is about whether the thing being cancelled is a request, an appointment or a quote. For executable semantics beyond this drawing, the [SCXML recommendation](https://www.w3.org/TR/scxml/) specifies event processing, compound states and actions; its execution rules require more detail than a conversational lifecycle sketch.
