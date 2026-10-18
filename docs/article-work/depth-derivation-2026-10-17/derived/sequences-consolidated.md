# Sequence diagrams: consolidated depth

Subject: drawing and reading sequence diagrams for software systems. Collection: drawing
software systems and processes. Reader: an engineer who has seen sequence diagrams in
design documents but hasn't drawn them.

**Result:** two articles, a deep dive (D) and a companion (C). About 6,950 words, 20
figures and one short code sample, roughly 39 minutes of reading in total.

Both planners reached two articles, the same broad parts and similar boundaries. They
differed on where the ordering rule lives, how much of the reading and dialect material
earns its space, which race example to use, and the companion's length. This plan
settles those differences and adds five small parts that both plans missed.

## 1. The expert's abilities

The expert is a senior engineer who uses sequence diagrams in design documents, reviews,
protocol specifications and incident write-ups. They aren't a UML specialist. They can:

1. **Tell when a sequence diagram is the right picture.** It shows one run of one
   scenario: who sends what to whom, in what order, and who waits for whom. When the
   question is structure, responsibility, an object's life across scenarios or exact
   logic, they draw something else.
2. **Frame one scenario.** They pick a trigger, an end point and a single level of
   abstraction, take participant names from the architecture view, order participants
   so arrows mostly run left to right, and leave out infrastructure that doesn't change
   the story.
3. **Use a small vocabulary so every mark means something.** Lifelines and participant
   kinds, synchronous call and reply, asynchronous send, self-call, activation where it
   adds information, labels that name intent and the data that matters, notes, step
   numbers, an arrow from the edge for the trigger, and boxes that group participants
   into a system or a trust zone. They recognise the rest of UML without using it.
4. **Read order correctly.** Events on one lifeline are ordered top to bottom and a
   message is sent before it's received. Nothing else is ordered, so a drawing shows one
   of several possible interleavings, and vertical distance says nothing about duration.
5. **Show variation without losing the reader.** `alt`, `opt`, `loop`, `break`, `par`
   and `ref` with guards, and the judgement to split a diagram rather than nest frames.
6. **Judge a design from its diagram.** Round trips on the critical path, chains of
   blocking calls, fork-shaped against stair-shaped control, chatty loops, a participant
   every message passes through, and what crosses a trust boundary.
7. **Read other people's diagrams in any dialect.** UML, informal boxes and arrows, RFC
   ladders with their own legends, numbered collaboration-style diagrams, and tool
   dialects whose keywords mean something different from UML's.
8. **Draw what goes wrong.** Work that finishes later, brokers and acknowledgements,
   timeouts and the lost response, retries and duplicates, races, and failure part-way
   through a flow. They walk each arrow and ask what happens if it is lost, late,
   doubled or reordered.
9. **Produce and check.** Sketch participants, then the main path, then the variants;
   write it as text beside the code; and check it against a recorded trace, ordering
   events by causal links rather than by timestamps from different machines.

**Evidence.**

- **Practice is partial and informal.** Petre (ICSE 2013) interviewed 50 practitioners:
  35 used no UML, 11 used it selectively and none wholeheartedly. Among the selective
  users, sequence diagrams were used by 6, second only to class diagrams at 7
  (confirmed in the Never Work in Theory review). This sets the notation bar: a core
  used precisely, the rest recognised.
- **The ordering rule.** The UML specification's interaction semantics say the order of
  occurrence specifications along a lifeline is significant and the absolute distances
  between them are irrelevant (quoted from the UML 2 text hosted by the University of
  Ottawa and in Sparx's guide). The Oslo IN5130 lecture after Haugen states the two
  rules, causality and weak sequencing, and shows that a two-message, three-lifeline
  diagram allows six traces. Lamport's 1978 space-time diagrams are the same picture.
- **Fork and stair.** The RUP guideline "Sequence Diagram" names fork-shaped
  (centralised) and stair-shaped (decentralised) control and says when each fits. It
  also prefers sequence diagrams "when it is important to visualize the time ordering
  of messages" over communication diagrams.
- **Dialects.** RFC 8446 §2's legend marks extensions with `+`, optional messages with
  `*`, and messages protected with handshake keys `{}` or application keys `[]`. The C4
  dynamic diagram allows sequence or collaboration style, says the two "show the same
  information in a different way", and says to use dynamic diagrams sparingly. Mermaid
  has no dedicated reply arrow, no arrow from the frame edge and no slanted arrows;
  PlantUML has edge arrows (`[->`), lost messages (`->x`), delays, participant kinds,
  `box` grouping and slant under its teoz engine. Both support activation, create and
  destroy, autonumbering and the `alt`/`opt`/`loop`/`par`/`break`/`critical` frames.
- **Queues.** The C4 "Queues and topics" page treats each queue or topic as its own
  data-store element, or as a name on the arrow for a strictly point-to-point link,
  rather than drawing one hub.
- **Real cases to borrow.** Nishtala et al., *Scaling Memcache at Facebook* (NSDI
  2013), documents the stale set: a slow reader writes an old value into the cache
  after a newer write invalidated it, fixed with leases. Stripe's idempotency post turns
  on the lost response. TLS 1.2's full handshake takes two round trips before
  application data, TLS 1.3's one.

## 2. Coverage map

D is the deep dive, C the companion. "Link" means a sentence of reminder where the idea
is used, plus a link to its home. Words include captions, not figure artwork.

| # | Part | Layer | Home | Needs | Words |
|---|---|---|---|---|---|
| 1 | What it shows: one run of one scenario; participants across, each lifeline read downward, arrows carry order between them; its cost (one path, weak at logic, shows no structure) | 1 | Collection intro paragraph, then D §1 | A first read of a small checkout flow, 1 figure | 350 |
| 2 | When to draw one and when to draw something else | 1 | D §1 | A one-line test with pointers; full chooser stays in *Drawing systems and processes* | 120 |
| 3 | Participants: roles not instances, kinds (person, service, store, queue, external), grouping boxes for a system or trust zone | 2 | D §2 | Annotated figure | 180 |
| 4 | Messages: sync call (the flow waits, whether or not a thread blocks), reply only when it carries something, async send, self-call; what each commits the system to | 2 | D §2 | Figure contrasting the arrows | 280 |
| 5 | Activation bars: busy or waiting; optional; draw them when blocking or a held resource matters | 2 | D §2 | Paragraph | 100 |
| 6 | Labels (intent against wire level, data that matters), notes, step numbers, an arrow from the edge as trigger, create and destroy in a sentence | 2 | D §2 | Short label examples | 180 |
| 7 | Marks and meanings: UML arrowheads, common informal conventions, Mermaid and PlantUML equivalents | Reference | D §2, end | Table | 100 |
| 8 | Framing: trigger, end point, one level of abstraction, names from the architecture view, left-to-right order, what to omit | 2 | D §3 | Worked example: a cluttered draft and its revision, 2 figures | 450 |
| 9 | Queues as a lifeline or a name on the arrow; separate lifelines for instances that behave differently (two clients, leader and follower) | 2 | D §3 | Two small examples | 180 |
| 10 | What order the page promises: per-lifeline order, send before receive, everything else unordered, one interleaving among several | 2 | D §4 | Mechanism: one diagram with its possible orders, 1 figure | 380 |
| 11 | Time: vertical gap isn't duration; durations and timeouts as notes; slanted arrows for transit, where tools allow | 2 | D §4 | 1 figure | 120 |
| 12 | `alt`, `opt`, `loop` with guards, `break`, `par`, `ref` | 2 | D §5 | Worked example: sign-in with optional second factor, paged fetch, token refresh referenced; 2 figures | 450 |
| 13 | Split rather than nest; many `alt`s mean a state view | 2 | D §5 | Paragraph with example | 120 |
| 14 | Rare UML operators (`critical`, `strict`, `seq`, `neg`, `assert`, `ignore`, `consider`), coregions, general ordering, state invariants | Reference | D §5 | One sentence naming them | 30 |
| 15 | Round trips and blocking chains, read from an RFC ladder and its legend (TLS 1.2 against 1.3) | 2 | D §6 | Worked reading, figure pair | 320 |
| 16 | Fork and stair: centralised against delegated control | 2 | D §6 | Same scenario both ways, 2 figures | 280 |
| 17 | Chatty interfaces and N+1 loops; a participant every message passes through | 2 | D §6 | Worked reading, 1 figure | 180 |
| 18 | Trust boundaries: what crosses which boundary (OAuth code through the browser, token over the back channel) | 3 | D §6 | Worked reading on a figure with boundary boxes | 180 |
| 19 | Other dialects: numbered collaboration style (C4), informal boxes and arrows, lettered steps in RFCs, tools that call these "swimlanes" | 3 | D §7 | Paragraph | 150 |
| 20 | Tool keywords that change meaning: Mermaid's `critical`, its missing reply and edge arrows; PlantUML teoz slant | 4 | D §7 | Sentences | 60 |
| 21 | Sketching order; writing one as text | 2 (sample is 4) | D §8 | A ten-line Mermaid sample; link to tool docs | 160 |
| 22 | Why the happy path misleads; which scenarios a feature needs | 3 | C §1 | Paragraph | 200 |
| 23 | Work that finishes later: 202 and polling, callbacks and webhooks, correlation ids, a stream as a loop of sends | 3 | C §2 | Worked example continuing the checkout, 2 figures | 450 |
| 24 | Fan-out through a broker; what an acknowledgement does and doesn't mean | 3 | C §2 | 1 figure | 200 |
| 25 | Timeouts and the three losses (request lost, server fails mid-work, response lost) that look the same to the caller | 3 | C §3 | Three-panel figure | 300 |
| 26 | Retries, duplicates, idempotency keys named (design sent to messaging) | 3 | C §3 | Worked example, 1 figure | 300 |
| 27 | Races: draw the bad interleaving as its own diagram (cache stale set); delayed and reordered messages | 3 | C §4 | Worked example, 2 figures | 530 |
| 28 | Failing part-way: dual write, compensation, `break` for the failure path | 3 | C §5 | Worked example, 1 figure | 350 |
| 29 | The arrow-by-arrow failure walk: lost, late, twice, out of order, receiver down | 3 | C §6 | Short method plus example | 180 |
| 30 | Drawing what happened: from traces and logs, ordering by causal links rather than cross-host timestamps; checking a design diagram against a trace; editing generated diagrams down | 3 | C §7 | Paragraph | 200 |
| – | Full which-diagram comparison | – | Link: *Drawing systems and processes* | Sentence | – |
| – | General shapes; layout, labels and colour; whiteboard technique | – | Links: *A whiteboard shape vocabulary*, *Layout, labels and five colours*, *Drawing at the whiteboard* | Sentence | – |
| – | Tool choice, diagrams as code, keeping diagrams current | – | Link: *Keeping diagrams useful* | Sentence | – |
| – | C4 levels and dynamic views as a C4 concept | – | Link: *Architecture diagrams* | Sentence in D §7 | – |
| – | Payload structure | – | Link: *Domains and data relationships* | Sentence | – |
| – | Delivery guarantees, idempotency design, ordering guarantees, sagas, outbox | – | Messaging field (planned); mention without link until written | Sentence where used | – |
| – | Transactions behind the dual write | – | Databases field | Link | – |
| – | Happens-before and logical clocks | – | Parked shared distributed-systems idea; cite Lamport | Sentence in D §4 | – |

**Layer notes.** Parts 1 and 2 are the model. Parts 3 to 17 and 21 are the working
mechanism: enough to draw, read and review an ordinary request flow, synchronous or
asynchronous. Part 18 and parts 19 to 30 are the expert's cases. Part 20 and the tool
sample in part 21 are product specifics, kept to sentences because they change a
reading only where a keyword means something different. Parts 7 and 14 are reference.

**Simplifications later layers qualify.**

- Layer 1 must say "read each lifeline downward", not "time runs down the page". The
  second is the wrong model that part 10 would have to undo.
- Layer 2 says a synchronous caller waits for the reply. Layer 3 adds that it waits
  only until a timeout, and that a drawn reply is the hoped-for case, not a guarantee.
- Layer 2 says an asynchronous send lets the sender carry on. Layer 3 adds that the
  message can be lost, delayed, delivered twice or reordered, and that an
  acknowledgement is itself a message.
- Layer 2 teaches UML's arrowheads as the convention. The reference table and part 19
  show that informal diagrams vary, so meaning should come from the legend or labels.

## 3. Articles

**D. Sequence diagrams: drawing and reading interactions in order** (deep dive). When
to draw one, the vocabulary, framing one scenario, the order the page promises, frames
and splitting, judging a design, other dialects, and producing one. One checkout flow
(client, API, order service, payment provider, database, an order-placed queue) carries
§§1 to 5; TLS and OAuth carry §6 because readers meet them in real specifications.
About 4,370 words, 12 figures and one code sample: 17.5 minutes of text, about 6 for
figures and 1 for the sample, so **about 24 minutes**. A reader who stops here can draw
and review an ordinary request flow and read the diagrams in a design document or RFC.

**C. When the reply doesn't come: asynchrony, failure and races in sequence diagrams**
(companion). A figure-led catalogue of the cases where a happy-path diagram misleads,
each with a short note on what to draw and why, ending with the failure walk and
drawing what actually happened. The checkout continues into the order-placed event, so
the reader doesn't enter a new context. About 2,710 words and 8 figures: 11 minutes of
text and about 4 for figures, so **about 15 minutes**.

**Why two.** One page would run to about 7,000 words and 39 minutes, and its failure
catalogue would bury the deep dive's argument about drawing and reading one scenario
clearly. Readers also search directly for "timeout" or "async" in sequence diagrams.
The companion relies on D §4 for order and doesn't re-teach it. A third article on
notation or tool syntax isn't needed: the notation is shallow and is learned faster
inside the worked examples, and the tools document their own syntax.

## 4. Boundaries

- **Drawing systems and processes** owns the comparison of all diagram types. D §1
  keeps only the sequence-specific test.
- **Architecture diagrams** owns structure, C4 levels and dynamic views as a C4
  concept. D §3 asks that participants come from one architecture level and reuse its
  names; D §7 gives collaboration style a sentence as a dialect.
- **Processes and swimlanes** owns responsibility and handoffs; **States and
  lifecycles** owns one object's behaviour across scenarios, linked from D §5 when
  `alt`s multiply.
- **Drawing at the whiteboard**, **A whiteboard shape vocabulary** and **Layout,
  labels and five colours** own general technique. This subject keeps only what
  sequence marks mean and sequence-specific layout.
- **Keeping diagrams useful** owns tool choice and keeping views current. D §8 shows
  one text sample without comparing tools.
- **Domains and data relationships** owns payload structure.
- **Messaging and event-driven systems** (planned) owns why idempotency keys, delivery
  guarantees, ordering and sagas work. C shows how to draw and find these problems and
  names each remedy in a sentence.
- **Databases** owns the transactions behind the dual write.
- **Distributed systems** (parked) owns happens-before and logical clocks. D §4 needs
  only the reading rule.

## 5. Left out

- **The remaining UML interaction machinery:** gates beyond the edge arrow, coregions,
  general orderings, state invariants, duration and time-constraint syntax, typed
  message signatures, instance naming in detail, boundary/control/entity stereotypes,
  lifeline decomposition, and lost and found symbols beyond a cross. These are absent
  from the diagrams in design documents and RFCs and mostly from the text tools;
  Micskei and Waeselynck show their formal meaning is disputed. Naming them covers the
  rare encounter.
- **Timing, interaction overview and communication diagrams in depth.** A time note or
  slanted arrow covers what software engineers draw; collaboration style gets a sentence.
- **MSC (Z.120), Live Sequence Charts, STAIRS and pomset semantics, formal
  verification.** Specification and research work. The expert needs the reading rule,
  not its formalisation.
- **Code generation, model-driven round trips and test generation.** Petre found 3 of
  50 generating code and none using UML wholeheartedly. The trace check covers the
  useful link between diagram and running system.
- **A syntax reference for any tool**, and **history of MSC and UML** beyond a sentence.
- **An interactive interleaving explorer.** Two static figures show the race; an
  explorer may help but is untested, so it isn't planned.

## 6. Uncertainty

- **Where work that finishes later lives.** Polling, callbacks and correlation are
  everyday in event-driven teams, which argues for the deep dive. I kept them in C
  because they turn on the reply not coming back on the same arrow, which is C's
  subject. Reader tests on D alone would show whether readers stall without them.
- **Deep-dive length.** At 24 minutes, D is near the limit for one sitting. If drafting
  runs long, part 18 (trust boundaries) and part 19 (dialects) are the first to move,
  to C or to a sentence each.
- **Activation bars and arrowhead strictness.** A count of notation in public design
  documents (Kubernetes KEPs, Rust RFCs, Python PEPs) would show how often activations
  and UML arrowheads appear and whether the plan's "meaning first, convention second"
  is right.
- **Figure time.** I allowed half a minute per figure. Dense figures, such as the
  three-panel loss figure, may take longer.
- **Primary texts.** The UML ordering rule comes through quoted copies of the spec,
  not the OMG PDF itself (too large to fetch). Fowler's *UML Distilled* claims came to
  both planners through course notes. An author should check both before quoting them.

## Where the planners disagreed and how it was settled

1. **Where the ordering rule lives.** A put it at the start of the companion; B in the
   deep dive. **Deep dive, at about 380 words.** The deep dive already teaches
   asynchronous sends and `par`, both of which depend on it, and a reader who stops
   after the deep dive without it holds a global-clock model that the companion would
   have to undo. The spec's own wording ("absolute distances … are irrelevant") and the
   Oslo lecture's six traces for one small diagram show the rule is short to state and
   needs one figure, not an article section of its own. The companion applies it to
   races without re-teaching.
2. **Activation bars.** A taught them as the way to show blocking; B made them
   optional. **Optional, with meaning taught.** UML treats them as optional notation,
   Mermaid and PlantUML both make them opt-in, and at service level the sync arrow and
   its reply already show who waits. They earn their place when a blocked thread or a
   held lock matters.
3. **Collaboration style.** A gave it two paragraphs and a figure in §1; B a sentence
   as a dialect. **B.** C4 says both styles carry the same information and recommends
   dynamic diagrams only sparingly, so the reader needs to recognise the style, not
   choose it.
4. **Dialects.** A gave RFC reading 120 words; B a 450-word section with its own
   figure. **About 210 words and no extra figure.** The TLS figure used for counting
   round trips is an RFC ladder, so its legend is taught there, and the rest is a
   paragraph.
5. **Trust boundaries.** Only A had them. **Kept, at 180 words, as layer 3.** What
   crosses the browser in OAuth is a real review question that a sequence diagram
   answers well, and it's the natural place to teach participant grouping boxes, which
   neither plan named.
6. **Queue placement.** Both put brokers in the companion. **Moved to the deep dive's
   framing section.** Whether a queue is a lifeline or a name on the arrow is a framing
   decision for any event-driven diagram, and C4's queues guidance settles it in a few
   sentences. Fan-out and acknowledgements stay in C.
7. **Race example.** A used the cache stale set; B a double booking with a lock drawn
   as `critical`. **The stale set.** It's documented (Nishtala et al.), the race
   appears without any `par` frame, which is the lesson, and its fix (a lease) isn't a
   lock. Drawing a lock as UML `critical` states an intent rather than a mechanism, and
   Mermaid's `critical` means something else. The double booking gets a sentence.
8. **Framing example length.** A 900 words; B 500. **About 450, plus 180 for queues
   and instances.** One draft and its revision teaches the rules; a longer example
   repeats them.
9. **Companion length.** A 3,600; B 2,350. **About 2,700**, figure-led as B proposed,
   keeping A's dual write and failure walk and adding the trace part.
10. **Checking against traces.** A put it in the deep dive; B gave it a sentence. **C
    §7, as layer 3**, with drawing an incident from traces and logs. Both missed that
    timestamps from different machines can't be trusted to order events, which is the
    order rule applied to diagnosis.
11. **Reading for design.** A gave three worked readings of about 300 words each; B
    one section of 550. **About 960 across four readings**, each short and figure-led.
12. **A tool sample and a reference table.** B included a Mermaid sample; neither
    included a table of marks. **Both, briefly:** the sample as layer 4, the table as
    reference, because reading other people's arrows needs a lookup more than prose.

**What both missed:** grouping boxes for systems and trust zones; separate lifelines
for instances that behave differently; that "synchronous" means the flow waits for the
reply, not that a thread blocks (code using async I/O still draws a sync arrow); a
stream drawn as a loop of sends; and clock skew when drawing from logs.

**What the plans included that the expert doesn't need:** A's collaboration figure and
interleaving explorer; B's separate "questions to ask any diagram" list, which repeats
the failure walk and the design readings; and `critical` as a lock.

## What layer 1 must say

A sequence diagram shows one run of one scenario. The participants sit across the top,
each with a lifeline running down. Arrows are messages: a solid arrow is a request, and
its filled head usually means the sender waits for the dashed reply; an open head means
the sender carries on. Read each lifeline from top to bottom, and follow the arrows for
order between participants. The diagram answers who talks to whom, in what order, and
who waits for whom, which makes it the picture for checking a flow, counting round
trips and finding where it can fail. Its cost is that it shows one path, not all the
behaviour: branches make it messy, it says nothing about how the system is built, and
the page doesn't show a shared clock, only the order its arrows force.

## Sources

- OMG, *UML 2* interaction semantics, as quoted in the University of Ottawa copy of the
  spec and Sparx Systems' Enterprise Architect guide (Lifeline).
- K. Stølen, "Modelling III: Sequence Diagrams", University of Oslo IN5130, after Ø.
  Haugen (causality, weak sequencing, six traces).
- IBM Rational Unified Process, "Guidelines: Sequence Diagram" (fork and stair).
- C4 model, "Dynamic diagram" and "Queues and topics".
- Mermaid sequence diagram syntax; PlantUML sequence diagram documentation.
- RFC 8446 §2 (TLS 1.3 handshake and legend); RFC 5246 (TLS 1.2); RFC 6749 §4.1.
- M. Petre, "UML in Practice", ICSE 2013, via the Never Work in Theory review.
- R. Nishtala et al., "Scaling Memcache at Facebook", NSDI 2013, via MIT 6.824 notes.
- Z. Micskei and H. Waeselynck, "The many meanings of UML 2 Sequence Diagrams", SoSyM 2011.
- L. Lamport, "Time, Clocks, and the Ordering of Events in a Distributed System", 1978.
- Stripe, "Designing robust and predictable APIs with idempotency".
