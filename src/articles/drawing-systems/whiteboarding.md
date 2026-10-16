---
title: Drawing at the whiteboard
description: Turn a conversation into a shared drawing with a small set of shapes, a clear question and room to correct what you hear.
---

Drawing at a whiteboard is a way to think with other people. You listen to an account, give part of it a visible form, and ask whether that form says what the speaker meant. The drawing holds the group's current understanding where everyone can point to it. A correction is part of the work.

You need very little drawing vocabulary to begin: a labelled box for a thing, a line for a relationship, an arrow when direction matters, and an enclosure for a named boundary. The difficult part is choosing what those marks mean and placing them so another person can follow the account.

We will build one board about an invented repair service. Its browser submits requests to an API. The API stores them in a database, and a worker handles notifications through an external provider. The staged conversation below includes a mistaken arrow, an unanswered question and a proposal. By the end they will be visibly different kinds of information.

## The first five minutes

Use the first few minutes to establish a small drawing people can correct. The timing is a way to begin, not a speed test.

1. **Write the question and status.** “How does a repair request become a notification? Current design.” Ask what the group needs to decide. Leave a margin for questions that do not answer this one.
2. **Choose one case.** “A customer submits request R17.” Agree where to start and stop. We will stop when the notification provider accepts the request; whether an email reaches the customer is a further question.
3. **Place the first few things.** Write Browser UI, Repair API and Repair DB with generous gaps between them. Wrap a box around each label. Arrange them along a clear path, leaving room for another part to be discovered.
4. **Add and read one relationship at a time.** “The browser submits a repair request to the API.” Draw the arrow and write “submits request” beside it. Ask the speaker to correct the sentence before adding several more.
5. **Walk the case back.** Point to each item and explain what you think happens. Mark gaps with a question mark. Agree which gap needs attention next.

This produces a useful start even if you have only one working pen. The group can now correct an object, a connection or a label instead of debating an invisible picture in each person's head.

## Compose a small scene with plain shapes

Start with the words. A label tells you how much room its box needs. On a physical board, write two short lines rather than squeezing a long name into a narrow shape. Keep lettering large enough for the person furthest away to read. A box can have slightly uneven corners and still do its job.

Use a consistent gap between boxes. Leave more room where a relationship needs a long label or a branch may appear. Draw connections into an edge, not through the text. If a line must bend, give it one or two deliberate turns rather than weaving through the scene. Put the arrowhead at the receiving end so the direction is unambiguous.

<figure><img src="/images/drawing-systems/whiteboarding-compose.svg" alt="Three construction stages show the same scene: first write Browser UI and Repair API with space between; then enclose each label in a box; finally connect Browser UI to Repair API with an arrow labelled submits request." width="520" height="520"/><figcaption>Labels, enclosing shapes, then the relationship. These few marks already compose a readable scene.</figcaption></figure>

For a larger board, choose a main reading direction and preserve it. A left-to-right row works well across a wall. A top-to-bottom stack works well on a narrow shared screen or a page. The examples here use compact panels because shrinking a whole wall makes even good lettering unreadable on a phone.

A plain box can represent every software part for now. Different silhouettes become useful when they help recognition, but they are not prerequisites for explaining the system. The [shape vocabulary](/learn/drawing-systems/vocabulary/) develops people, devices, services and stores from these foundations. Personality can come from a consistent corner, an open gesture or a small detail; it need not add work to every mark.

## Hear the account, then choose the view

A coordinator begins:

> “The customer fills in a request. We triage it, the technician diagnoses the fault, and the customer approves the quote before the repair.”

There are people and activities here, so a process view would answer who does what. But our board's question concerns how software produces a notification. Ask the coordinator or engineer to describe that part. Do not silently convert “we triage it” into a software component called Triage.

The engineer adds:

> “The browser sends the request to the Repair API. The API saves the repair request and a notification job in Repair DB.”

Now we have the first three software parts and two relationships. Draw them. Say the relationships aloud: “Browser submits to API; API stores a request and a notification job in DB.” We are making an informal structure view, with arrows showing who initiates an operation. It is not yet a sequence or a complete architecture model.

<figure><img src="/images/drawing-systems/whiteboarding-first-board.svg" alt="A first board titled current design shows Browser UI submitting a request to Repair API, which stores a request and notification job in Repair DB. A question beneath asks who reads the notification job." width="520" height="520"/><figcaption>The board contains what the conversation has established. The question beneath the database leaves a specific space for the next fact.</figcaption></figure>

The phrase “saves a notification job” is worth preserving. Replacing it with a little envelope might make the board more attractive while hiding whether the message has been sent. Words are part of the drawing.

## Correct an arrow without losing the conversation

The engineer continues:

> “Then a worker picks the job up and sends the notification.”

You add a worker below the database and draw DB → Worker. It seems to follow the story: job, then worker. Ask, “Does the database push work to it?”

> “No. The worker checks the job table. It reads an eligible job, then calls our notification provider.”

Erase the arrow and replace it with Worker → DB, labelled “reads jobs”. Add the provider and Worker → Provider, labelled “requests email”. The group has changed the meaning of one connection, not merely its appearance.

<figure><img src="/images/drawing-systems/whiteboarding-correction.svg" alt="An initial crossed-out arrow from Repair DB to worker is labelled assumed push. The corrected view below points from worker to Repair DB and is labelled reads jobs. A note says to ask who initiates the operation." width="520" height="500"/><figcaption>The spoken order did not establish the caller. Checking that detail changes the arrow direction.</figcaption></figure>

This is why a live drawing needs short checks. After six more boxes, someone may hesitate to interrupt an apparently finished diagram. Read a new relationship as a sentence while it is still easy to change. If the answer is unknown, mark it unknown and give the question an owner.

There is no separate queue in the agreed account. A job table is enough to locate the stored work. If someone proposes adding a broker, keep that in the proposal area until the group chooses to explore that variation. Familiar infrastructure icons should not invent components on the speaker's behalf.

## Use colour to distinguish evidence and proposals

For this collection, we use five pens with a consistent convention:

| Pen | Role on this board | Meaning that survives without colour |
| --- | --- | --- |
| Black | Parts, boundaries and established relationships | Names, solid outlines and relationship labels |
| Blue | The current example being traced | Numbered steps: 1, 2, 3, 4 |
| Green | A proposed addition | The word **NEW** |
| Red | A problem the group has identified | **!** and a description of the problem |
| Purple | An unanswered question | **?** and the actual question |

These are our conventions, not universal meanings of the colours. Explain them when starting with a new group. If a red pen is missing, write the exclamation mark in black. Colour helps someone find the annotation; it must not be the only way to interpret it.

For the current trace, number the relationships in blue: 1 submits request, 2 stores request and job, 3 reads job, 4 requests email. The number 3 sits beside the upward worker-to-database arrow. The number identifies the part of this example we are discussing; the arrow still identifies who initiates the read.

Someone asks whether the provider could send two emails after a retry. We have not checked its contract, so add a purple “? Can retries send two emails?” Do not turn it into a red assertion that duplicate email is a known defect. Those annotations would make different claims.

Another person suggests displaying notification status in the browser. Write “NEW: show notification status” in green in a separate proposal area. It has not become part of the current software just because it was discussed beside that software. If approved later, the group can draw the additional reads and UI behaviour in a proposed view.

## Change views when the question changes

The coordinator asks, “Who owns the request while we wait for quote approval?” Neither the API nor the database box can answer that. Keep the system drawing and start a separate process strip: coordinator sends quote, customer considers it, coordinator receives the response. Write “owner while waiting: coordinator” beside the wait, assuming the group confirms it.

A small process sketch lets people discuss reminders and handoffs without turning software boxes into human roles. The [process article](/learn/drawing-systems/processes/) develops this view, including swimlanes and waiting. If someone instead asks whether the browser receipt comes before the provider call, use a [sequence diagram](/learn/drawing-systems/sequences/). A structure arrow does not answer the timing question.

When there is disagreement, preserve the competing statements precisely. “API sends email” and “Worker sends email” can be drawn as two small labelled alternatives. Ask what evidence would decide between them: a code path, a running trace or the person responsible for the service. Do not compromise by connecting both and allowing the picture to imply that both happen.

The question margin is useful here. A topic may deserve investigation while remaining outside this meeting's task. Record the question and its next action, then return to the agreed scope.

## Drawing from memory

When you are working alone, supply the account before reaching for shapes. Write the question and one case, then make a short list of remembered things and actions. For the repair service, that might be “browser submits”, “API stores”, “worker reads” and “provider accepts”. Keep the list small enough to inspect as a whole.

Separate what you recall from what you are inferring. You may remember that a notification job lives in the database but be unsure which component reads it. Write that as a question beside the store. Drawing the most familiar design would turn a gap in memory into an apparently established relationship.

Place the known parts, connect the known actions, then read the drawing aloud as if a colleague were listening. Where did you have to insert an unrecorded step? What would change if the provider were unavailable? This often reveals a missing participant, a word that conceals several operations, or a boundary you cannot yet justify.

Leave the unresolved marks visible when sharing the sketch. “I remember a worker reading jobs; I have not checked its retry behaviour” gives the next reader something specific to verify. Once you consult the implementation or its owner, revise the picture and its status. The drawing can organise an investigation before it becomes documentation.

## Finish with a board someone can read back

Here is the composed board after the correction. The first three parts form the submission path. The worker reads the stored jobs and calls the external provider. Its read points towards the database even though the job's data comes back in the response. Replies are omitted from this structure view.

<figure><img src="/images/drawing-systems/whiteboarding-agreed-board.svg" alt="Agreed current-design board. Step 1 Browser UI submits to Repair API. Step 2 Repair API stores the request and notification job in Repair DB. Step 3 Notification worker reads jobs from Repair DB. Step 4 worker requests email from the external Notification provider. A question asks whether retries can send two emails. A separate NEW note proposes showing notification status." width="520" height="900"/><figcaption>This board can be read without the conversation: named parts, labelled operations, an explicit external provider, a numbered trace, an unresolved question and a separate proposal.</figcaption></figure>

Ask someone other than the person holding the pen to explain it. Let them point with a finger or cursor. If they read DB → Worker despite the arrowhead, the layout or label may still be fighting the meaning. Repair the drawing before decorating it.

Then follow one changed case. “The provider is unavailable.” The board still locates the call, but it does not define the worker's retry policy. That is a useful limit to discover. Put the unanswered behaviour beside the provider and decide who will investigate it. A finished meeting does not require pretending that every question has been answered.

On a remote board, keep the active area close to one screen and zoom in before writing small details. Use a visible cursor while reading a path aloud. Invite others to move or relabel an item, and keep a text account of the agreed relationships for anyone who cannot reliably read the canvas. The shared artifact should not depend on colour vision, perfect eyesight or hearing every spoken correction.

Before stopping, preserve the question, current/proposed status, date, agreed relationships and open actions. Take a readable capture and record a short text account. A photograph of unexplained boxes is weak documentation; “worker reads jobs from Repair DB” preserves a relationship even when the photograph is poor.

## Practise from a new account

Ask a colleague to read this description aloud once: “A visitor submits a room booking. The booking service stores it. A scheduled worker reads confirmed bookings and sends door-access requests to an external access service.” Draw while listening, then ask two clarification questions.

A useful first drawing has a visitor-facing interface, booking service, booking store, worker and external access service. It labels the worker's read towards the store and the access request towards the external service. “Confirmed” deserves a question: who confirms a booking, and when does it become visible to the worker? The account does not establish those facts, so a question mark is more accurate than an invented approval component.

Try the exercise again using only boxes, words and black arrows. Then add one personal shape detail and the colour convention. The second pass should help someone read the same relationships. If it changes what the drawing claims, correct the meaning before keeping the flourish.

Continue with [Layout, labels and five colours](/learn/drawing-systems/layout/) to refine this board while preserving its topology, or practise the individual marks in [A whiteboard shape vocabulary](/learn/drawing-systems/vocabulary/).
