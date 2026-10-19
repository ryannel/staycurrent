# Teaching reference preparation

Prepared on 19 October 2026 for the independent writing/teaching review of the
relational pilot. Read the commission and the three fixed reference articles in
full, including the implementations of their figures. This records what those
examples do; it does not add mandatory style rules or judge an unwritten pilot.
This preparation was a source reading, not a rendered interaction check.

## Prose and gradual exposure

All three open with the useful question and an intelligible answer, then develop
the mechanism. They define unfamiliar terms at the point where a concrete object
needs a name. Sentences state who acts, what changes and what follows. Technical
precision comes through qualifications attached to the relevant claim, rather
than an opening catalogue of caveats.

- **Sequence diagrams** follows Mina's repair booking from four messages to
  waiting, email, a worker and ordering. Each section changes a recognisable part
  of the same interaction. The failed choices motivate the next design: waiting
  for email delays Mina; ignoring its reply loses errors; the outbox moves the
  work to a worker. Later sections use the notation to make design judgements.
  Mermaid source stays in closed disclosures while the explanation proceeds.
- **Indexes** repeatedly follows customer 42 in the same 36 orders. It first
  establishes the full scan, then entries and locations, then how the tree finds
  them. A clustered-table lookup waits until the reader understands the tree.
  The history query accumulates column order, early stopping, covering and
  visibility. Practical index design comes after those costs are visible.
- **Storage and durability** follows P7's price from 20.00 to 22.00 through pages,
  memory, row versions and a log. A hypothetical commit without a log fails
  visibly before WAL supplies the solution. Later figures reuse the same lanes
  to expose crash timing and relaxed durability. Engine comparisons follow the
  worked mechanism; companion links name the further question they answer.

The articles are substantial, but their sections earn depth by answering the
question left by the preceding explanation. They do not require every reader to
open every companion before the local argument makes sense.

## What the figures actually teach

The surrounding prose gives a specific observation: watch the browser's waiting
bar, count pages, follow the first matching entry, or compare what the application
heard with what survives. Afterwards it interprets the observed difference and
states the useful judgement.

The implementations change mechanisms, not just explanatory labels:

- Sequence players move messages and activation bars, darken waits, count loop
  passes and leave untaken branches faded. Changing poll timing slides the same
  messages past one another, making preserved causal order visible.
- Index figures retain row identities while copying and sorting entries, draw
  pointers back to heap locations, follow tree and leaf routes, and count actual
  model work. Changing table layout, index columns or visibility bits changes
  the visits needed. Deletion and rebuilding visibly differ in file size.
- Storage figures move the same page or record between labelled places. Row size
  changes page capacity; engine choice changes where the old version waits;
  crash timing changes retained state; background writing changes who waits.

Playback exposes intermediate states with readable narration. Back, Next,
scrubbing and replay let readers inspect them. Persistent SVG objects make
movement legible. The implementations include responsive layouts, reduced-motion
behaviour and text equivalents. Some figures are deliberately still when the
whole relationship is the lesson: motion is purposeful, not universal.

Invented rows, timings and simplified mechanisms are identified as models;
measured results are labelled with their engine, dataset and limits. Indexes
places the small model beside a separate measured scale. Storage explains where
its observations came from. A later pilot review can therefore ask what the
reader can now explain, predict or decide, and whether the actual figure makes
that understanding easier to obtain.
