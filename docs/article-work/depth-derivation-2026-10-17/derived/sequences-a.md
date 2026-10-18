# Sequence diagrams: derived depth (planner A)

Subject: drawing and reading sequence diagrams for software systems. Collection: drawing
software systems and processes. Reader: an engineer who has seen sequence diagrams in
design documents but has not drawn them.

## 1. The expert's abilities

The expert here is a senior engineer who uses sequence diagrams in design documents,
design reviews, protocol specifications and incident write-ups. They are not a UML
specialist. They can:

1. **Choose the diagram.** They know the question it answers: the order of messages
   between participants in one scenario, and who waits for whom. They know it shows one
   run of the system, not all of its behaviour, so when alternatives pile up they move
   to a state or activity view.
2. **Frame a scenario.** They pick the trigger and the end point, and one level of
   abstraction. Participants sit at a single granularity that matches the architecture
   view, ordered left to right. Infrastructure that doesn't change the story stays out,
   and each message is labelled with what actually crosses the wire.
3. **Use the core notation precisely and the rest by recognition.** That means
   synchronous calls, asynchronous sends, returns, activations, self-calls, notes,
   numbering and arrows from the frame edge, plus the alt, opt, loop, par, break and
   ref frames. They recognise the other UML operators without using them.
4. **Split rather than nest.** They know when a diagram should become two.
5. **Read the time axis correctly.** Vertical order binds only along one lifeline.
   Across lifelines, only messages order events, so a drawing is one interleaving among
   several that are possible.
6. **Draw asynchrony.** Brokers and queues, fan-out, callbacks, polling and correlated
   replies, including where a caller stops waiting.
7. **Draw and find failure.** Timeouts, lost replies, retries, duplicates and
   compensation. They walk every arrow and ask what happens if it fails, arrives late,
   arrives twice or arrives out of order.
8. **Read for system properties.** Round trips on the critical path, blocking chains,
   chatty interfaces, control style and trust boundaries. They can also read the call
   flows in protocol specifications.
9. **Produce and verify.** They move from a whiteboard sketch to a text-defined
   diagram, know where the tools fall short, and check a drawing against a real trace.

**Evidence.**

- **Practice is selective and informal.** Petre (ICSE 2013) interviewed 50
  practitioners: 35 used no UML, 11 used it selectively and none used it wholeheartedly.
  Sequence diagrams were among the most borrowed parts. Baltes and Diehl (FSE 2014)
  surveyed 394 practitioners. Most diagrams contained some UML but were informal, and
  people drew them mainly for designing, explaining and understanding. This sets the
  notation bar: the core precisely, the rest by recognition.
- **Tools implement the same core.** Mermaid and PlantUML support lifelines with shaped
  heads, sync/async/return arrows, activations, notes, autonumbering, and the
  alt/opt/loop/par/critical/break frames. Neither renders the rarer UML operators.
  Messages that cross in transit are effectively unsupported in both (PlantUML's teoz
  engine slants arrows but cannot place later messages while one is in flight).
- **The reading depth comes from the ordering semantics.** In UML 2.5.1 (clause 17,
  Interactions, as quoted in Sparx's guide and confirmed on the Eclipse/Papyrus forum),
  events are ordered along each lifeline. Events on different lifelines are ordered only
  by messages or an explicit general ordering, and vertical distance means nothing.
  ITU-T Z.120 message sequence charts use the same partial order, and both descend from
  Lamport's space-time diagrams (1978).
- **What the diagram is good and bad at.** Fowler (*UML Distilled*, ch. 4) says sequence
  diagrams make calls between participants clear but are weak at loops and conditional
  logic. He contrasts centralised and distributed control as two shapes the same
  diagram reveals. The SEI note *Documenting Behavior* (Bachmann et al., 2002) classes
  sequence diagrams and MSCs as trace-oriented, against comprehensive state-based
  models.
- **Protocol specifications depend on them.** RFC 3665 (SIP call flows) and RFC 8446 §2
  (the TLS 1.3 handshake) are built on sequence-style call flows. RFC 6749 §4.1 uses
  lettered steps on a box diagram, the collaboration style. Hohpe and Woolf's
  *Enterprise Integration Patterns* uses sequence diagrams to contrast sequential and
  concurrent requests, and its Request-Reply and Correlation Identifier patterns set
  what an async reply needs.
- **Placing queues.** The C4 model's dynamic-diagram page allows sequence or
  collaboration style. Its queues-and-topics page advises treating each queue as its
  own element, or as a label on the arrow for point-to-point links, never as one hub.
- **Real examples to borrow.** The cache race is documented in Nishtala et al., *Scaling
  Memcache at Facebook* (NSDI 2013), which describes stale sets. Traces rebuild call
  order and duration from span parent IDs (Honeycomb docs), which makes them the
  check on a drawn diagram.

## 2. Coverage map

A1 is the deep dive and A2 the companion. "Link" means a sentence of reminder where the
idea is used, plus a link to its home.

| Part | Home | Needs | Words |
|---|---|---|---|
| The question it answers; trace vs. comprehensive; sequence vs. collaboration style (C4 dynamic) | A1 §1 | Two paragraphs, one figure (same flow drawn both ways) | 350 |
| Full which-diagram comparison | Link: *Drawing systems and processes* | Sentence | – |
| Lifelines and participant heads (roles, not instances; actor/database/queue heads) | A1 §2 | Annotated figure | 250 |
| Messages: sync call, return, async send; arrowheads; writing labels | A1 §2 | Catalogue, figure, label examples | 400 |
| Activations (who is busy or blocked), self-calls | A1 §2 | Paragraph, detail in figure | 150 |
| Notes, numbering, arrows from the frame edge, create/destroy | A1 §2 | Sentences | 150 |
| Framing a scenario: trigger, end, abstraction level, granularity, participant order, what to omit | A1 §3 | Worked example: a cluttered draft and its revision | 900 |
| alt, opt, loop, par, break, guards, ref | A1 §4 | Catalogue with one combined figure | 450 |
| Split vs. nest; many alts means a state or activity view | A1 §4 | Worked example, paragraph | 250 |
| Rare operators (critical, strict, seq, neg, assert, ignore, consider), coregions, general ordering, state invariants | A1 §4 | One sentence naming them | 40 |
| Reading: who blocks, round trips on the critical path (TLS 1.2 two round trips vs. 1.3 one) | A1 §5 | Worked reading, figure pair | 350 |
| Reading: chatty calls and N+1 loops; centralised vs. distributed control | A1 §5 | Worked reading, figure pair | 350 |
| Reading: trust boundaries and what data crosses them (OAuth code flow through the browser) | A1 §5 | Worked reading, figure | 300 |
| Reading protocol call flows (RFC conventions, numbered and lettered steps) | A1 §5 | Paragraph | 120 |
| Checking a diagram against a trace | A1 §6 | Paragraph | 150 |
| Tools and their limits; whiteboard order (heads first, leave room) | A1 §6 | Sentences, links to *Keeping diagrams useful* and *Drawing at the whiteboard* | 150 |
| What vertical position means: order per lifeline, causality via messages, one trace among many | A2 §1 | Mechanism, two figures | 500 |
| Sync vs. async as who waits; transit time; slanted arrows | A2 §1 | Figure | 250 |
| Brokers and queues as lifelines or arrow labels | A2 §2 | Worked examples | 300 |
| Fan-out, callbacks and webhooks, polling, request-reply with correlation ID | A2 §2 | Worked examples, two figures | 500 |
| Races: crossing messages, drawing the bad interleaving as its own diagram | A2 §3 | Worked example (cache stale set), figure; optional interleaving explorer | 600 |
| Timeouts, durations, delays | A2 §4 | Annotated figure | 200 |
| Lost replies, ambiguous outcomes, retries, duplicates, idempotency keys | A2 §4 | Worked example | 400 |
| Dual writes; the two shapes of a saga's compensation | A2 §4 | Worked example pair | 300 |
| The arrow-by-arrow failure walk | A2 §4 | Short method plus an example | 200 |
| Which scenarios a feature needs (happy path plus the failures that change the design) | A2 §5 | Paragraph | 200 |
| Shapes for actors, stores and queues | Link: *A whiteboard shape vocabulary* | Sentence | – |
| Colour and label style in general | Link: *Layout, labels and five colours* | Sentence | – |
| Delivery guarantees, idempotency design, saga and outbox mechanics | Messaging field (planned) | Sentence where used | – |
| Transactions behind the dual-write example | Databases field | Link | – |
| Happens-before and logical clocks as formalism | Parked shared distributed-systems idea | Sentence | – |

## 3. Articles

Two articles, about 40 minutes in total.

**A1. Sequence diagrams** (deep dive), about 4,500 words with about ten figures: **about
22 minutes.** This covers choosing the diagram, the notation, framing one scenario,
frames and splitting, reading for blocking, round trips, chattiness, control style and
trust boundaries, and producing and checking a diagram. One running example (a checkout
request through an API, order service, payment provider and database) carries the
notation and framing sections. TLS and OAuth carry the reading section, because readers
will meet them in real specifications. A reader who stops here can draw and review an
ordinary request flow.

**A2. Asynchrony, races and failure in sequence diagrams** (companion), about 3,600 words
with about seven figures: **about 18 minutes.** It opens with what the time axis
promises, then covers asynchronous messaging, races, timeouts and partial failure, and
choosing the set of scenarios to draw. The checkout example continues into an
order-placed event, so the reader doesn't enter a new context.

**Why two, not one or three.** A single article would run to about 8,000 words. Its
second half rests on the ordering semantics, a separate investigation that would bury
the deep dive's argument about drawing one scenario clearly. Readers also search
directly for "async" and "events" in sequence diagrams. A third article on notation
alone was rejected, because the notation is shallow and is learned faster inside a
worked example than as a reference.

## 4. Boundaries

- **Drawing systems and processes** owns the comparison across all diagram types. A1
  keeps only the local test: is the question about message order in one scenario?
- **Architecture diagrams** owns C4 levels and dynamic views as a C4 concept. A1 owns
  the choice between sequence and collaboration style, because that is a way of drawing
  an interaction, and asks that participants match architecture elements.
- **Processes and swimlanes** owns activity flow with responsibility and handoffs. A1
  gives a sentence: some tools (swimlanes.io, for example) call sequence diagrams
  "swimlanes", but the question differs.
- **States and lifecycles** owns comprehensive behaviour. A1 links there when alt frames
  multiply.
- **Drawing at the whiteboard**, **A whiteboard shape vocabulary** and **Layout, labels
  and five colours** own general technique, shapes and style. Only sequence-specific
  layout (participant order, left-to-right flow) stays in A1.
- **Keeping diagrams useful** owns tool choice and keeping views current. A1 keeps the
  sequence-specific tool limits and the trace check.
- **Messaging and event-driven systems** (planned) owns delivery guarantees, idempotency
  design, sagas and the outbox. A2 shows how to draw and find these problems, not how to
  solve them, and names the remedy in a sentence. Until that field is written, A2 should
  mention it without linking.
- **Databases** owns transactions, which the dual-write example only points to.
- **Distributed systems** (parked) owns happens-before and clocks. A2 needs only the
  practical rule that messages carry order across lifelines.

## 5. Left out

- **UML's remaining interaction machinery:** gates beyond "an arrow from the edge",
  coregions, general orderings, state invariants, duration and time-constraint syntax,
  message signatures with types, and boundary/control/entity stereotypes. They are
  absent from the tools practitioners use and from the diagrams in design documents and
  RFCs. Recognising the names covers the rare encounter.
- **Timing diagrams, interaction overview diagrams and communication diagrams in
  depth.** They are rarely used, and collaboration style gets a paragraph.
- **MSC/Z.120 and Live Sequence Charts as languages, and formal verification.** These
  are for specification and research, not team practice.
- **Code generation, model-based testing and reverse-engineering from code.** This is
  model-driven practice the evidence shows few teams follow. Checking against traces
  covers the useful part.

## 6. Uncertainty

- **One article or two.** This is the least certain call. Evidence that would settle it:
  how often readers who reach A1 also need async and failure (search queries, or reader
  tests on a combined draft), and whether a combined 8,000-word draft holds attention.
- **A2's length.** It depends on how much remedy a reader needs before the messaging
  field exists. If drafting shows readers stalled without delivery semantics, A2 grows
  by about 400 words, or that field should be written first.
- **Activation bars.** Fowler values them. Many service-level diagrams omit them, and
  Mermaid makes them optional. I teach them as the way to show blocking. A sample of
  real design documents would show whether that matches practice.
- **The interleaving explorer.** Whether it teaches the race faster than two static
  figures is untested.
- **Primary sources.** Usage figures rest on Petre's 50 interviews (read through a
  secondary review) and on Baltes and Diehl. The UML ordering rules come through Sparx's
  quotation of the spec rather than the OMG text itself. Before drafting, the author
  should check clause 17 of UML 2.5.1 and Lamport's figure conventions directly.
