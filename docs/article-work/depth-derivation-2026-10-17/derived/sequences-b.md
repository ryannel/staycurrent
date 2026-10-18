# Sequence diagrams: derived depth (planner B)

**Subject:** sequence diagrams, drawing and reading them for software systems.
**Collection:** drawing software systems and processes.
**Reader:** a software engineer who has seen sequence diagrams in design documents but
has not drawn many.
**Result:** two articles, a deep dive and one companion, about 6,550 words and 19
figures, roughly 36 minutes of reading in total.

## 1. The expert's abilities

An expert practitioner can do nine things. The evidence behind each follows it.

1. **Tell when a sequence diagram is the right picture.** It shows one scenario: a few
   participants and the order of the messages between them. The expert draws one when
   order across participants is the question. They draw something else when the
   question is who is responsible for which work (swimlanes), how one thing changes
   across many scenarios (a state machine), how the system is built (an architecture
   view) or exact logic (code or prose). *Evidence:* the RUP design guideline prefers
   sequence diagrams "when it is important to visualize the time ordering of messages".
   Course notes that follow *UML Distilled* say they suit several objects in one use
   case but are poor at defining behaviour precisely. The C4 model says dynamic diagrams
   "should be used sparingly", for recurring patterns and complicated interactions.
2. **Scope a diagram.** They choose one scenario, what triggers it and where it ends.
   They choose participants at a single level of abstraction, named as they are in the
   architecture view, and order them so that most arrows run left to right. *Evidence:*
   Ambler's guidelines ask for left-to-right ordering, consistent names, a focus on
   critical interactions and a prose description. Easterbrook's style guide says the
   same, and C4 scopes each dynamic diagram to one feature or story, using elements
   from the static model.
3. **Use a small vocabulary so that every mark means something.** That means
   lifelines, a synchronous call and its reply, an asynchronous message, a self-call,
   activation bars where they add information, notes, step numbers and labels that
   name the intent and the data that matters. Replies appear only when they carry
   information. *Evidence:* Bell's IBM introduction; Ambler's guidelines on return
   values; UML 2.5.1's message sorts (synchronous call, asynchronous call, asynchronous
   signal, reply, create, delete); the feature sets of Mermaid and PlantUML.
4. **Read order correctly.** Events on one lifeline happen in order from top to
   bottom, and a message is sent before it is received. Nothing else on the page is
   ordered. Two events on different lifelines with no chain of messages between them
   can happen either way round, and vertical distance says nothing about duration.
   Races hide in exactly this gap. *Evidence:* Stølen's lecture, built on Haugen's
   slides, gives causality and weak sequencing as the two rules and marks an "area of
   nondeterminism" on a three-lifeline example. Lamport's 1978 space-time diagrams make
   the same point. Micskei and Waeselynck's survey found that formal readings of UML
   sequence diagrams disagree, so the expert writes ordering and timing assumptions
   down rather than trusting subtle notation.
5. **Show variation without losing the reader.** They use `alt`, `opt` and `loop` with
   guards, `break` for an early exit, `par` for concurrency and `ref` to point at
   another diagram. They also know when to stop nesting frames and draw separate
   diagrams instead. *Evidence:* Bell names `alt`, `opt` and `loop` as the fragments
   most people will use. They descend from the inline expressions added to Message
   Sequence Charts (ITU-T Z.120) in 1996. Mermaid and PlantUML support roughly this
   subset.
6. **Draw the cases that distributed systems force on you.** These include messages
   through a broker, work that finishes later, timeouts and retries where the response
   was lost, two clients acting at once, failure part-way through a flow, and dropped
   or delayed messages. *Evidence:* protocol specifications are written this way: the
   TLS 1.3 message flow in RFC 8446, the SIP call flows in RFC 3665 and the OAuth flows
   in RFC 6749. Stripe's post on idempotency turns on the lost-response case.
   Space-time diagrams are the standard way to show delay and concurrency (Lamport; the
   University of Washington's CSE 452 notes).
7. **Judge a design from its diagram.** They can tell a fork-shaped diagram, where one
   controller makes every call, from a stair-shaped one, where each participant hands
   on to the next. They count round trips and chains of synchronous calls, spot a
   participant that every message passes through, and find the point where a stopped
   flow leaves state half-changed. *Evidence:* Jacobson's fork and stair shapes as
   carried into the RUP guideline; Fowler's centralised and distributed control
   example, reproduced in Easterbrook's lecture, which lists "comparing design options"
   and "assessing bottlenecks" as uses.
8. **Read other people's diagrams in any dialect.** These include UML, informal boxes
   and arrows in design documents, ASCII ladders in RFCs with their own legends (TLS
   marks optional messages with `*` and encrypted ones with braces), telecom call
   flows, C4's numbered collaboration style and tool dialects that differ from UML.
   Mermaid has no reply message type, and its `critical` block means "actions that
   must happen automatically with conditional handling", not UML's region that must
   not interleave. The expert asks what the diagram leaves out.
9. **Produce one quickly and keep it near the code.** They sketch the participants,
   then the main path, then the variants. They write it as text where the team keeps
   its documents, since a sequence's layout follows from its order. *Evidence:* GitHub
   has rendered Mermaid in Markdown since February 2022, and PlantUML is widely used.
   Petre's interviews with 50 practitioners found that 35 used no UML and 11 used it
   selectively, with sequence diagrams among the parts kept. Experts therefore draw
   partial, informal sequence diagrams far more often than full UML models.

## 2. Coverage map

A is the deep dive and B is the companion. Word counts include captions and exclude
figure artwork.

| Part | Home or status | Needs | Words |
| --- | --- | --- | --- |
| What a sequence diagram shows; a first read of a small checkout flow | A §1 | Worked example, 1 figure | 350 |
| When to draw one, and when to draw something else | A §2 | A short test, with one-line pointers; the full chooser stays in *Drawing systems and processes* | 200 |
| Scenario, trigger and end point | A §3 | Worked example | 500 for §3 |
| Participants: one level of abstraction, names from the architecture view, left-to-right order | A §3 | The same scenario at service level and inside one service, 2 figures | (in §3) |
| Lifelines and participant kinds (person, service, datastore, queue, external system) | A §4 | Annotated reference figure | 700 for §4 |
| Synchronous call and reply, asynchronous message, self-call | A §4 | Figure contrasting the arrows, with what each choice commits the system to | (in §4) |
| Activation bars | A §4 | A paragraph: optional, and worth drawing when a blocked thread or held lock matters | (in §4) |
| Message labels, data on arrows, when to show replies, step numbers, notes | A §4 | Short examples (intent label against protocol label) | (in §4) |
| Creation and destruction | A §4, a sentence | Rare at service level; useful for short-lived workers or sessions | (in §4) |
| Order on the page: per-lifeline order, send before receive, unordered events, vertical gap is not time | A §5 | Mechanism: one diagram with its two possible orders, 1 figure | 550 for §5 |
| Slanted arrows and time notes (timeouts, budgets, expiries) | A §5 | 1 figure | (in §5) |
| `alt`, `opt`, `loop` and guards | A §6 | Worked example: sign-in with an optional second factor and a paged fetch | 650 for §6 |
| `break` and `ref` | A §6 | Worked example: token refresh drawn once and referenced | (in §6) |
| `par` | A §6, a sentence; full treatment in B §5 | — | (in §6) |
| When to split into a main path and named variants | A §6 | Paragraph with an example; 2 figures for §6 | (in §6) |
| Fork and stair: centralised against delegated control | A §7 | The same scenario drawn both ways, 2 figures | 550 for §7 |
| Round trips, synchronous chains, bottlenecks, chatty loops | A §7 | A worked reading of one figure | (in §7) |
| Where a stopped flow leaves state half-changed | A §7, a sentence; full treatment in B §6 | — | (in §7) |
| Dialects: UML, informal, RFC ladders and their legends, telecom call flows, C4's numbered style | A §8 | Annotated RFC-style figure | 450 for §8 |
| Tool dialects (Mermaid's arrows, missing reply type, `critical`) | A §8 | Paragraph | (in §8) |
| Questions to ask of any sequence diagram | A §8 | Short list | (in §8) |
| Trace waterfalls as recorded sequences | A §8, a sentence | Link to an observability field if one is planned | (in §8) |
| Sketching order; writing one as text | A §9 | A ten-line Mermaid sample | 250 |
| Generated diagrams from code or traces | A §9, a sentence | They show every call; edit them down | (in §9) |
| Why the happy path hides the hard cases | B §1 | Paragraph | 200 |
| Messages through a broker: publish, delivery, fan-out, acknowledgement | B §2 | Worked example, broker drawn and then left out, 1 figure | 400 |
| Work that finishes later: polling against callbacks, correlation ids | B §3 | Worked example, 1 figure | 350 |
| Lost messages, timeouts, retries and the lost response | B §4 | Three-panel figure (request lost, server fails mid-work, response lost) and a delayed-message figure | 550 |
| Two clients at once: drawing a race, `par`, a lock as `critical` | B §5 | Worked example of a double booking, 2 figures | 450 |
| Failing part-way: `break` and `alt` for failure, compensating steps, splitting long flows with `ref` | B §6 | Worked example, 1 figure | 400 |
| Choosing a drawing tool, diagrams as code, keeping diagrams current | *Keeping diagrams useful* | Link | — |
| Whiteboard technique; general layout, labels and colour | *Drawing at the whiteboard*, *Layout, labels and five colours* | Link | — |
| Minimal sketch shapes for lifelines and arrows | *A whiteboard shape vocabulary* links here for meaning | Link | — |
| Responsibility for work and handoffs | *Processes and swimlanes* | Link | — |
| One object's life across scenarios | *States and lifecycles* | Link | — |
| Message payloads and their structure | *Domains and data relationships* | Link | — |
| Delivery guarantees, idempotency design, ordering guarantees, sagas | Messaging and event-driven systems field (planned) | Sentence where used; link when written | — |
| Happens-before and logical clocks | Distributed-systems theory, not planned here | Sentence in A §5 with Lamport as the external reference | — |

## 3. Articles

**Two articles.**

**A. Sequence diagrams: drawing and reading interactions in order** (deep dive).
The full explanation of the subject: when to draw one, how to scope it, the vocabulary,
how order works on the page, branches and references, judging a design, reading other
dialects and producing one quickly. About 4,200 words, 12 figures and one code sample.
Reading time: 17 minutes of text, about 6 for figures and 1 for the sample, so **about
23 minutes**.

**B. Sequence diagrams for distributed systems: asynchrony, failure and concurrency**
(companion). A set of worked examples for the cases where a happy-path diagram misleads:
brokers, work that finishes later, lost messages and responses, races and failure
part-way through. Each case is a figure with a short note on what to draw and why.
About 2,350 words and 7 figures. Reading time: 9 to 10 minutes of text and about 4 for
figures, so **about 13 minutes**.

**Total: about 6,550 words, 19 figures, about 36 minutes.**

The companion is a separate page because its cases form a catalogue that readers look
for directly ("how do I show a timeout in a sequence diagram"). Inside A they would push
the sections on judging and reading designs to the back of a 35-minute page. It relies
on A §5 for how order works, and the planned messaging field can link to it for drawing
technique.

## 4. Boundaries

- **Drawing systems and processes** owns the comparison of all diagram types. A §2
  keeps only the sequence-specific test and a one-line pointer to each alternative, so
  the choice is taught once.
- **Architecture diagrams** owns structure, C4 zoom levels and deployment. A §3 asks
  the reader to draw participants from one architecture level and reuse its names. C4's
  dynamic diagram in collaboration style gets a sentence in A §8 as a dialect. Its full
  treatment belongs with the C4 views if that article covers dynamic diagrams.
- **Processes and swimlanes** owns responsibility, activities and handoffs. A sentence
  in A §2 separates the two questions, and A §8 notes that some tools call sequence
  diagrams "swimlanes", which confuses the names.
- **States and lifecycles** owns one object's behaviour across scenarios; a sequence
  diagram is one scenario.
- **Domains and data relationships** owns what the payloads mean. Sequence diagrams
  name the data on an arrow and stop there.
- **Drawing at the whiteboard**, **A whiteboard shape vocabulary** and **Layout, labels
  and five colours** own general technique. This subject owns what sequence marks mean
  and the layout rules specific to sequences (participant order, numbering).
- **Keeping diagrams useful** owns tool choice and keeping diagrams trustworthy. A §9
  shows one text example without comparing tools.
- **Messaging and event-driven systems** (planned) owns why idempotency keys, delivery
  guarantees, ordering and sagas work. B shows how to draw them and links there, which
  keeps each case to a few hundred words.
- **Distributed-systems theory** (happens-before, logical clocks) is outside the
  collection. A §5 needs only the reading rule and cites Lamport.
- **Observability** owns trace waterfalls, which get a sentence in A §8.

## 5. Left out

- **UML operators `neg`, `assert`, `strict`, `seq`, `ignore` and `consider`, plus gates,
  state invariants, lifeline decomposition and interaction overview diagrams.** These
  belong to specification and test-generation work. Bell lists `alt`, `opt` and `loop`
  as the everyday set, the main text tools omit most of these operators, and Micskei and
  Waeselynck show that their formal meaning is disputed. A reader would rarely meet
  them and could misread them if they did.
- **Formal trace semantics (STAIRS, pomsets) and High-level MSCs.** The expert needs
  the reading rule in A §5, not its formalisation.
- **UML timing diagrams.** A time note or slanted arrow covers the cases software
  engineers draw. Signal-level timing belongs to hardware and embedded work.
- **Lost and found message notation beyond the cross for a dropped message.** The
  formal symbols are rare outside UML tools.
- **Object destruction**, apart from a sentence. Ambler advises against modelling it,
  and services rarely need it.
- **UML instance naming in detail (underlines, `name : Class`).** A sentence in A §4
  covers it for readers who meet it in older documents.
- **Generating code from sequence diagrams and round-trip modelling.** Petre found none
  of 50 practitioners used UML wholeheartedly and only 3 generated code from it.
- **A syntax reference for any tool.** The tools document themselves. A §9 shows one
  sample and links to the documentation.
- **History of MSC and UML** beyond a sentence. It explains why dialects differ but does
  not change how the reader draws.

## 6. Uncertainty

- **One article or two.** This was the least certain call. If B's cases draft shorter
  than about 1,500 words, they belong in A as a final section and A becomes about 30
  minutes. A draft-time word count would settle it, along with evidence of how often
  readers search for the distributed cases on their own.
- **How strictly to teach UML arrowheads.** If most diagrams readers meet are informal
  or Mermaid-drawn, A §4 should teach meaning (blocking or not, reply or not) and
  treat UML's filled and open arrowheads as one convention among several. A sample of
  public design documents, such as Kubernetes KEPs, Rust RFCs and Python PEPs, counted
  by notation would settle it.
- **Activation bars.** Bell draws them throughout; Ambler's guidelines barely mention
  them. I made them optional with a stated use. The same document sample would show how
  often they appear and whether readers rely on them.
- **Where C4's collaboration-style dynamic diagram lives.** That depends on how far
  *Architecture diagrams* covers dynamic views.
- **Race conditions.** I kept the drawing of a race here and sent its theory to the
  messaging field. If that field's articles draw their own races, B §5 could shrink to a
  pattern with a link.
- **Primary texts I could not open.** I could not read *UML Distilled*, and the UML
  2.5.1 PDF was too large to fetch. Claims attributed to them here come from course notes,
  Bell's article and tool documentation, and both texts should be checked before an
  article quotes them.

## Sources

- OMG, *Unified Modeling Language 2.5.1*, chapter 17, Interactions (message sorts, combined
  fragments). https://www.omg.org/spec/UML/2.5.1/
- D. Bell, "Explore the UML sequence diagram", IBM Developer (2004, reviewed 2023).
  https://developer.ibm.com/articles/the-sequence-diagram/
- S. Ambler, "UML 2 Sequence Diagrams: Diagramming Guidelines", Agile Modeling, and *The
  Elements of UML 2.0 Style*. https://agilemodeling.com/?p=2708
- IBM Rational Unified Process, "Guidelines: Sequence Diagram" (fork and stair shapes).
  https://files.defcon.no/RUP/process/modguide/md_seqdm.htm
- S. Easterbrook, CSC302 Lecture 5, "Modeling Software Behaviour", University of Toronto
  (2012), which draws on Fowler's *UML Distilled*.
  https://www.cs.toronto.edu/~sme/CSC302/notes/05-sequence-diagrams.pdf
- K. Stølen, "Modelling III: Sequence Diagrams", University of Oslo IN5130, after Ø. Haugen.
  https://www.uio.no/studier/emner/matnat/ifi/IN5130/h21/lectures/20200910-modelling-iii-sequencediagrams.pdf
- Z. Micskei and H. Waeselynck, "The many meanings of UML 2 Sequence Diagrams: a survey",
  *Software and Systems Modeling* 10(4), 2011. https://hal.laas.fr/hal-03601768
- M. Petre, "UML in Practice", ICSE 2013. https://www.ics.uci.edu/~andre/informatics223s2017/petre.pdf
- L. Lamport, "Time, Clocks, and the Ordering of Events in a Distributed System", CACM
  1978; University of Washington CSE 452 notes on space-time diagrams.
  https://courses.cs.washington.edu/courses/cse452/26sp/lectures/lec07-notes.html
- ITU-T Z.120, Message Sequence Chart, and its history.
  https://en.wikipedia.org/wiki/Message_sequence_chart
- C4 model, "Dynamic diagram". https://c4model.com/diagrams/dynamic
- Mermaid sequence diagram syntax. https://mermaid.js.org/syntax/sequenceDiagram.html
- PlantUML sequence diagrams. https://plantuml.com/sequence-diagram
- GitHub, "Include diagrams in your Markdown files with Mermaid" (14 February 2022).
  https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/
- RFC 8446 (TLS 1.3) §2, RFC 6749 (OAuth 2.0) §1.2 and §4.1, RFC 3665 (SIP call flows).
  https://www.rfc-editor.org/rfc/rfc8446, https://www.rfc-editor.org/rfc/rfc6749,
  https://www.rfc-editor.org/rfc/rfc3665
- Stripe, "Designing robust and predictable APIs with idempotency".
  https://stripe.com/blog/idempotency
