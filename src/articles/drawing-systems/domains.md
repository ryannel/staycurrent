---
title: Domains and data relationships
description: Draw shared concepts, distinguish identity from changing attributes, and use relationship counts to uncover rules before choosing a database schema.
---

A customer calls to move a repair from Tuesday to Thursday. The coordinator says, “I changed the booking.” The technician says, “The request is still open.” Both may be describing the same situation correctly. The trouble begins when the software treats *booking* and *request* as interchangeable names for one thing.

A domain model gives the team a picture of the concepts it needs to distinguish. Its boxes represent things such as a RepairRequest, an Appointment and a Quote. Its lines say how those things relate. Unlike an architecture drawing, it need not tell us which application holds them. Unlike a process drawing, it need not tell us which activity happens next.

We will build a small conceptual model for an invented repair service. The useful outcome is a set of terms and relationships that can survive a concrete example, including a reschedule and a cancellation. Choosing database columns comes later.

## Find the distinction behind the names

Start by asking people to describe actual cases. A customer reports a broken washing machine; a coordinator triages the request; a technician diagnoses it; the service offers a quote. The customer can approve the repair or cancel before repair work starts. An appointment may be needed for diagnosis, repair or both.

From that account, try these meanings:

| Term | Meaning in this example |
| --- | --- |
| Customer | The person requesting the service |
| RepairRequest | The continuing case for resolving one reported problem |
| Appointment | One arranged visit associated with a request |
| Quote | One offered scope and price for that request |

These definitions are a proposal to test with the people doing the work. They are not universal meanings for every repair business. Shared language is useful because “cancel the appointment” and “cancel the request” can now prompt different actions. Microsoft's [domain-analysis guidance](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis) describes building that language with domain experts and keeping its meaning within an explicit area of the business.

If the coordinator calls both things a booking, keep that word visible while discussing the distinction. A model that silently replaces everyone's language may look tidy while leaving the original disagreement unresolved.

## Keep identity while facts change

Mina's washing-machine case is request R42. It first has appointment A7 on Tuesday. For this teaching example, rescheduling retains A7 as superseded and creates A8 for Thursday. R42 continues to refer to the same reported problem.

<figure>
  <img src="/images/drawing-systems/domains-identities.svg" alt="Repair request R42 concerns Mina's washing machine. It is linked to appointment A7, Tuesday, now superseded, and appointment A8, Thursday, booked. The request identity stays R42 while the arranged visit changes." width="500" height="530" />
  <figcaption>One continuing request can have several appointment records. Retaining the old booking is an explicit choice in this example, not a rule imposed by the notation.</figcaption>
</figure>

The identifier lets us say “the same request” while its appointment, diagnosis or description changes. A spelling correction to Mina's name should not create a new customer; two people with the same name should not become one customer. Identity answers which thing this is. Attributes describe what we currently know about it. The distinction between identity-bearing entities and descriptive values is developed in Microsoft's [tactical domain-modelling guide](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/tactical-domain-driven-design).

Do not turn every value into another entity. The appointment's start time can be a value attached to that appointment. A separately managed visit with its own history deserves an identity because people refer to it and change its status independently. Ask what would count as the same thing after a change, rather than giving every noun a box.

Our rescheduling rule is one possible answer. Another service might keep appointment A7 and record a history of changed times. Both could preserve useful history. The conceptual question is whether people need to distinguish the abandoned arrangement from its replacement; the persistence design must then preserve whatever distinction the team agrees on.

## Put counts at both ends of a relationship

Now draw the types of things rather than Mina's particular records. We use a small part of UML-style relationship notation: a plain line for an association, with a count beside each end. `1` means exactly one, `0..1` zero or one, `0..*` zero or more, and `1..*` one or more. IBM's [multiplicity reference](https://www.ibm.com/docs/en/dma?topic=elements-model-element-properties) explains these values.

<figure>
  <img src="/images/drawing-systems/domains-relationships.svg" alt="Conceptual model with three associations. Each RepairRequest has exactly one Customer; each Customer may have zero or more requests. Each Appointment belongs to exactly one request; each request may have zero or more appointments. Each Quote belongs to exactly one request; each request may have zero or more quotes. A separate note limits a request to at most one current quote." width="500" height="800" loading="lazy" />
  <figcaption>Read the number near an end as the number of things at that end for one thing at the opposite end. These lines express associations, not calls or movement.</figcaption>
</figure>

Take one RepairRequest. The `1` beside Customer says it has exactly one customer. Take one Customer instead. The `0..*` beside RepairRequest says that customer can have no requests or several. Reading both directions prevents “one-to-many” from remaining a vague label.

The zero matters. A newly submitted R42 has no appointment yet, so a minimum of one appointment would reject a normal early stage of the case. Later it can have A7 and A8 without becoming two requests. The drawing does not say appointments are simultaneous, only that several can be associated with the request.

The same reasoning allows quote history. Suppose quote Q9 is replaced by Q10 after the technician discovers a different fault. Both belong to R42; at most one is the *current* offer. The relationship count `0..*` allows the records, but does not express which offer is current. Write that additional rule next to the drawing: **a request has at most one current quote, and approval names the particular quote being accepted**.

This is where a practical model often improves: the line exposes a question, and a sentence supplies the rule it cannot carry. No extra arrowhead will establish whether accepting Q9 after Q10 was issued should succeed.

## Walk a case through the model

Lay out four cards for R42: submitted, appointment booked, quote issued, quote approved. These are observations at different times, not four requests. At submission, R42 links to Mina and has no appointment or quote. After booking, it links to A7. After rescheduling it also links to A8, with A7 marked superseded. After diagnosis, it links to Q9.

Return to the moment just after rescheduling, before the visit and diagnosis. Now cancel A8. Does R42 disappear? Our definitions say it need not: a visit was cancelled, while the problem may still need attention. If the team intends every cancelled appointment to close its request, that is an additional business rule. The relationship alone does not require it.

Then try a different cancellation: Mina cancels R42 before repair work starts. We keep the historical appointments and quote associated with it, but no longer treat them as permission to proceed. This raises a lifecycle question about which operations remain allowed. The [states article](/learn/drawing-systems/states/) gives that question its own drawing. The domain model has done its job by making clear which object is changing.

For a real discovery session, ask for a case that does not fit. Can one request concern two appliances? Can a company have several authorised contacts? Can one visit address two requests? Those questions could change the model substantially. Do not add every possibility in advance; record the answer or uncertainty for the business being modelled.

## A conceptual model is not a database schema

The four concepts do not require exactly four tables. A relational implementation might store customers, requests and appointments in separate tables, with a request reference on each appointment. Another implementation might store a request and its small appointment history in one document. Both still need an answer to which request an appointment belongs to.

<figure>
  <img src="/images/drawing-systems/domains-schema.svg" alt="Two levels of description. The conceptual relationship is RepairRequest has Appointments. A possible relational representation uses requests with request_id R42 and appointments with appointment_id A7 and A8, each containing request_id R42. The schema adds explicit keys and references." width="500" height="610" loading="lazy" />
  <figcaption>The schema makes a storage choice explicit. The repeated R42 values implement the relationship; they do not create new requests.</figcaption>
</figure>

In that relational design, a primary key identifies a stored row and a foreign key can require each appointment's non-null request reference to identify an existing request. A not-null constraint makes the reference mandatory. Those mechanisms are described in [PostgreSQL's constraints documentation](https://www.postgresql.org/docs/current/ddl-constraints.html).

They still do not settle every rule in the conceptual model. An ordinary foreign key does not stop two appointments overlapping, require a technician to be qualified, or forbid a repair after cancellation. Those need separately chosen enforcement. Keep the domain rules visible while designing storage, then explain where each rule is enforced. A line in a diagram is a statement of intent until the system implements it.

## Change views when the question changes

The line between Customer and RepairRequest says that they are associated. It does not show which customer details leave the system. If the review is about a notification provider receiving personal information, use a small data-flow view instead.

<figure>
  <img src="/images/drawing-systems/domains-flow.svg" alt="A data-flow contrast. Inside the repair team boundary, the notification worker sends recipient address and message text across a provider trust boundary to the external notification provider. This diagram labels transferred information rather than entity counts." width="500" height="490" loading="lazy" />
  <figcaption>The arrow now names information crossing a trust boundary. It does not mean the provider owns a Customer entity or stores the entire RepairRequest.</figcaption>
</figure>

That boundary marks a change in whose controls and assumptions apply. It is a reason to investigate the transfer, not proof that the transfer is secure. OWASP's [threat-modelling process](https://community.owasp.org/Threat_Modeling_Process) uses data flows and trust boundaries to make those questions visible. This small contrast is enough to recognise when our relationship model cannot answer the review's question; a full threat model needs more detail.

Similarly, discovering what happened and what triggered it may call for an event timeline. Understanding the customer's visible experience alongside backstage work may call for a service blueprint. Keep those as different views of the situation instead of loading every meaning onto the associations.

## Try repairing the model

A colleague proposes one box called `RepairBooking`, containing the customer's problem, an appointment time and a quote. There is one booking per customer. Test it with Mina's reschedule and with a second, unrelated repair for the same customer.

**Discussion.** “One per customer” prevents the second case unless it overwrites or merges the first. One appointment time also cannot express both the abandoned Tuesday arrangement and the Thursday replacement if that history matters. Separate the continuing RepairRequest from appointments, then give Customer zero or more requests. Keeping a quote inside a request may be a reasonable storage choice; the conceptual model must still identify which offer the customer accepted.

Next, change the model so one appointment can address several requests. Which count changes, and what new question appears?

**Discussion.** The `1` beside RepairRequest on the appointment association must become a suitable many-valued range, perhaps `1..*` if a visit always concerns at least one request. Decide whether cancelling one request cancels the whole visit. The new count makes sharing possible, but the cancellation rule needs an explicit answer.

Use [processes and swimlanes](/learn/drawing-systems/processes/) to discover who creates and changes these objects, and [states and lifecycles](/learn/drawing-systems/states/) to follow one request over time. Return to the [drawing-systems introduction](/learn/drawing-systems/) when choosing among those questions.
