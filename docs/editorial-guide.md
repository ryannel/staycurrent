# How Stay Current teaches a field

An overview gives the reader a map of the major approaches. A family collection
develops understanding and practical judgement through focused explanations,
comparisons, and selected product deep dives. A single article answers a bounded
question; it need not teach an entire family. See [the coverage structure](content-structure.md)
for the agreed scope and the first relational collection.

## The overview

The 3 October field-guide revision clarified the scope: help a reader understand
what databases and file stores solve, recognise the major technology groups,
and know roughly when to consider each. The earlier guide tried to teach reads,
writes, invariants, coordination, and evaluation in one article. Those are
learning outcomes for the collection. The guide gives enough design reasoning
to orient the reader, then links to the explanations that develop it. Its groups
are useful routes into the field, with overlaps made explicit.

Organise a field around the problems its major families solve. For each
family, explain the workload, the central design decision, what it makes
cheap, and what becomes difficult. Link to a focused explanation where the reader
can follow the machinery in detail.

Choose representative products because they reveal a design or a meaningful
alternative. An overview does not need every vendor or every market category.
New products earn space when they change the reader's understanding or choice.

Keep different dimensions distinct. A data model, a storage layout, a
replication protocol, and a hosting model answer different questions. A
database can be relational, column-oriented, distributed, and managed at once.
The families are useful routes through the field, with overlaps explained.

Give a conditional starting recommendation and the conditions that change it.
The recommendation should follow from the workload and guarantees just taught.
Avoid fixed size thresholds unless evidence establishes them for a stated
workload. Version numbers, pricing, and acquisition news belong only where
they materially affect the decision.

## Focused explanations and product deep dives

### A family introduction has a different job

The first relational introduction followed an order through tables, a join, and a
transaction. It was a coherent worked example, but the operator pointed out that
someone new to the technology first needs to understand what the database is,
how it organises data, why that arrangement is useful, and the jobs of its main
mechanisms. The revision introduces those ideas directly and uses small examples
to support them. Keep this distinction when commissioning introductions: the
example-led method below suits focused teaching, not every article's opening.

### Following a mechanism

A useful approach for a mechanism explanation is to start with a concrete task and the simplest model that can perform it. Follow
an operation through that model. Then introduce the pressure that calls for
the next mechanism: more data, concurrent writers, a slow disk, a failed
machine, an uneven workload, or a reader that needs a fresher answer.

That causal order can make a mechanism easier to understand: the reader sees
why it is needed, what it does and where its costs come from. These are questions
for the author, not labels to repeat in every section. Choose headings that help
the reader recognise the thought being developed.

Use a running example where it helps the reader keep their bearings. Choose the
operations that establish the commissioned outcome. A durability explanation may
need a write, acknowledgement, crash, and recovery; an indexing explanation may
need a query and the work of maintaining its index. Introduce maintenance or failure
when it explains the subject, rather than requiring every article to cover both.
Broad construction, use, and operational outcomes belong to the collection.

Introduce the representative implementation at the point where it makes the
model precise. Say which details belong to that product and which generalise.
A simplified model is an explanation of a choice, not a claim about the
product's development history. Show important alternatives and why they made
a different choice where it affects the question. Make clear what the reader can
carry over to another engine and what must be checked again.

Let the reader connect suitability to the mechanisms they have understood.
Contrasting workloads can make a tradeoff tangible. A new situation can reveal
whether the reasoning transfers, either in the article or during reader review;
it need not become a standard ending. Interview preparation can be a consequence
of understanding the system without setting the article's structure.

History, release notes, configuration defaults, and capacity figures earn
space when they help explain a decision. Move useful reference details after
the teaching narrative, or link to their maintained documentation. Preserve
technical depth by explaining behaviour and boundaries, rather than by
counting settings or subsystems covered.

## Text, illustrations, and experiments

The text carries the explanation and can be read on its own. Illustrations
and experiments support it by making the same example easier to see and
explore. Develop them together around the subject of each passage.

In the column-store essay, the opening describes shops sending page-view
records, so its illustration shows those shops and records. The page-read
experiment comes later, after the prose explains how the shop and country
fields are stored. A diagram of anonymous rows and columns did not explain
the shops in the opening, even though it was about column stores.

The prose also describes what happens when records are sorted, batches are
merged, or a replica fails. Readers can then try those changes themselves;
they don't have to operate a control to receive a missing part of the
explanation.

Use Sam Who's controlled experiments and Ciechanowski's progressively built
models as the principal format references. Learn from their pacing, generous
space for the models, focused controls, and visible consequences. Julia Evans
is the reference for concrete scenes and direct explanations. Make original
assets and examples rather than copying their published work.

Build a diagram as the explanation grows. Reuse the same rows, keys, requests,
and component names so the reader can follow what changed. A complete
architecture diagram is useful after its parts have been introduced.

Every visual needs a question it answers. Show which bytes a query reads,
which messages a write waits for, or which rows survive a failure. A caption
states what to notice and any simplification that matters.

Use interaction when changing an input reveals behaviour: changing a filter
can reveal skipped blocks, delaying a replica can reveal stale reads, and
changing a key distribution can reveal a hot partition. State what the
model omits. Synthetic counts and timings must be labelled as illustrative,
never presented as measurements from a real engine. A sequence of static
diagrams is sufficient when it teaches the same point clearly. Interactive
pieces must also explain their result in readable text.

Use imagegen for beautiful explanatory cutaways, spatial illustrations, and
other raster artwork where it adds understanding. Inspect generated geometry,
counts, and labels for accuracy; save the chosen asset and its prompt in the
project. Render exact data, changing state, labels, and interactive controls
with code. Illustration and simulation should share the same visual language.
Follow the [house illustration style](illustration-style.md) for the palette,
materials, annotations, and checks.

Verify the controls in a browser, including keyboard use and narrow screens.
Provide reset or replay where state accumulates, respect reduced motion, and
make assumptions readable beside the model. The observable behaviour is part
of the article's technical claim and needs the same care as its prose.

## Drafting and review

### Lessons from the column-store essay

These examples record decisions made with the operator, rather than a fixed
article template. Read them alongside the current page when choosing how to
explain something similar.

**Let the article explain; give each experiment its own context.** The sentence
“Here are those same 16 records in two layouts” lived in the article, separated
from the model it pointed to. “Shop and country are selected” also described
controls the reader hadn't reached. We moved the model's dataset, simplified
units, highlights, and instructions inside its card. The surrounding prose
now explains the mechanism and tradeoff before the experiment. Reading only
the article paragraphs should still make sense: “both runs” and “reset and
advance time” needed rewriting when they appeared outside the model.

**Choose the medium for the missing understanding.** Our SQL example belongs
in a code block because its exact expressions are useful to read and reuse;
its answer belongs in a table. The compression example used monospace text
to show “Sweden · UK” beside “0 · 1”, but readers had to imagine the mapping,
the shared dictionary, and what stayed the same. The replacement diagram
aligns the original country column with its codes, draws the dictionary as a
separate object, and traces one familiar record back to its country. A diagram
can use HTML or SVG: generating it with code does not make it a code example.

**Let the example demonstrate its claim.** Four names plus a dictionary did
not make a convincing case for saving space. The diagram now uses the same
16 records as the reading models, shows the extra dictionary, and explains
why reuse matters. Its box widths are schematic; they do not establish a byte
count or a compression ratio. If varying the number of distinct names becomes
part of the lesson, an interaction could expose that tradeoff. A control is
not needed merely to reveal the basic lookup.

**Keep the reader's objects recognisable.** Introducing a blue-mug visit and
then replacing it with anonymous field initials lost a useful connection.
The visit is now identifiable through storage layout, sorting, and encoding.
The query results and reading models use one dataset. The result stays the
same when storage changes; only the work changes. A visual explanation should
make that invariant easy to see, not merely assert that the models agree.

**Review what the combined page implies.** A corrected-record example followed
our ReplacingMergeTree explanation, but the replica model immediately showed
the latest version as the read result. Together they implied that copying
also reconciles versions, despite the warning in the text. Using a newly
inserted event made the durability lesson precise. A caveat cannot repair a
visual that repeatedly demonstrates a different guarantee.

**Make it clear what can be operated.** Our static dictionary, sparse-index,
and merge diagrams looked like the experiment's buttons and selectable
records. A labelled figure could still look clickable. The revised
[interaction conventions](illustration-style.md#make-interaction-recognisable)
give controls, changing results, static figures, and SQL examples distinct
treatments. This is a convention for reader affordances, not a rule about how
sentences should sound. Review adjacent components together, including their
dark-mode appearance.

The blind reviewer understood each model separately but could not connect
column layouts to sorting. That was more useful than another review of the
author's intentions. For a broad independent review, a reader given only the
page and intended audience can expose gaps that reviewers with the working
history already know how to fill. Review writing, visual meaning, and model
behaviour together; another illustration is useful only if it closes a
specific gap. These lessons do not impose a quota of diagrams or experiments.

### Lessons from the wider database field

The document explanation initially gave a convincing reason to keep a product's
nested details together, but that didn't establish a reason to add a document
database. The blind reader needed to see the same product in a relational table
with a JSON field. Comparing the same job against the system an application
already has makes the cost of adding another service much easier to judge.

The partition model initially offered a direct lookup or a search of every
group. Its prose also described a third route: use Birch's known device list to
open B1 and B2. Leaving that route out of the experiment made a new index appear
necessary. An experiment's available choices teach a claim of their own.

Small labels changed the meaning of several results. “Refresh” had to distinguish
receiving a catalogue update from making an already received update searchable.
The quorum slider needed a visible clock origin so its 141 ms reply time could
be reconciled with 211 ms of total client latency. The graph model needed to say
whether it had exhausted the frontier or merely reached the chosen hop bound.
“Finished” concealed an important difference in what the answer established.
These are examples to reason from, not a mandatory sequence for future models.

### Reviewing a draft

A useful brief makes the reader's starting point and the article's question clear.
An example or chain of mechanisms can help the author see a possible argument;
leave room to discover a better one while writing. For an existing article,
preserve valuable evidence and reconsider the material in light of its purpose.

The independent production workflow is defined in `staycurrent-authoring` and
`staycurrent-review`. Begin with whether the commissioned outcome is achieved.
Use the following questions where they apply to that outcome:

- Can a reader explain why each major mechanism exists before learning its
  configuration or implementation vocabulary?
- Can they follow the operation or behaviour this piece sets out to explain?
- Do the strengths and weaknesses follow from the mechanism just explained?
- Can they say what carries over to related products and what does not?
- Does each visual reveal something that the surrounding prose uses?
- Could a reader solve a slightly different problem using what they learned?

Consider structure and voice together. Clear sentences cannot repair an
explanation that introduces its ideas in the wrong order; a useful structure
also needs prose that carries the thought between its parts.
The [writing references](writing-style.md) collect the author passages and
draft excerpts we're using to develop the voice.
Sources and publication authorisation remain governed by the research skill.
Routine drafting, agent review, and repair do not require a human read-through.
Unresolved material issues stay visible in the article record; a build or an
agent approval does not establish that the explanation is correct.

## References for the approach

These inform the teaching method; they are not sources for database claims.
Read on 2026-10-02.

- [Sam Who: Load Balancing](https://samwho.dev/load-balancing/) starts with one
  server, varies the workload, and develops algorithms in response to the
  behaviour visible in the simulations.
- [Bartosz Ciechanowski: Gears](https://ciechanow.ski/gears/) develops its
  explanation through small models the reader can inspect and manipulate.
- [Julia Evans: How to teach technical concepts with cartoons](https://jvns.ca/teach-tech-with-cartoons/)
  discusses concrete scenes and focused drawings as tools for explanation.
