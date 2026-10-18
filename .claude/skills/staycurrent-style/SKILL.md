---
name: staycurrent-style
description: >
  The writing voice for Stay Current articles, captions, interactive models,
  project docs, and replies. Use when drafting or revising prose in this project.
---

# Write so the reader's effort goes into the idea

**For a blind comprehension or isolated-media review**, use
[the context-free voice reference](references/blind-review-voice.md) instead of this
skill. The examples below describe past articles and would give away what you're there
to test.

We want an intelligent reader to feel that someone who understands the subject is
helping them see it. Plain language can carry difficult reasoning, and it keeps the
reader's effort on the idea rather than on the prose; at the level of sentences, that is
most of what keeping their reading cost low means. Give a thought enough room to become
clear, and let the next thought follow from it. Clear is not the same as short: a step
left out costs the reader more than the sentence that would have supplied it. There is
no prose score, prescribed sentence length or vocabulary list. Choose the register and
rhythm that fit the subject.

## Where the voice comes from

We are building a house style in our own articles. Its reference articles are Sequence
diagrams (`src/pages/learn/drawing-systems/sequences.astro`), and Indexes and Storage and
durability (`src/pages/learn/databases/relational/`). The user chose them as the pages to
copy for structure, tone and figures, and in October 2026 they had a style pass against
the pieces below and independent review. Reviewers named these passages as the clearest
examples:

- Sequence diagrams: the opening; the two paragraphs after Figure 6 in "Ordering and
  gaps", where two timings the reader has watched become the rule that a diagram
  promises order, not time; the end of "Synchronous and asynchronous messages", where
  short sentences carry a chain of consequences; and "Trust boundaries", which follows
  what crosses into the user's device. Its companion, on failure and asynchrony, opens
  with the three losses: three cases the reader watches become one drawing rule.
- Indexes: the opening; column order in a composite index (`#composite`), where the
  reader counts entries before the rule is stated; the visibility map (`#covering`),
  which runs break, fix, new cost; and the HOT update (`#writes`).
- Storage and durability: from Figure 4 to the naming of the write-ahead log; the row
  versions opening and the table after Figure 3; and group commit (`#commit-wait` into
  `#group-commit`), which goes from measured numbers to the mechanism in words to the
  term as the name for what the reader saw. The opening of "How point-in-time recovery
  works" (`backup-and-restore#pitr`) builds a new subject from mechanisms the reader
  already has; the rest of that page is older prose and not itself a reference.

They stay revisable. Where one drifts from the pieces below, the pieces win.
`docs/writing-style.md` records passages and revisions from our own work.

The style is anchored in a few pieces of writing that inspired it. Read them in full when
developing the voice, or when our own articles seem to have drifted from it:

- Sam Who, [Memory Allocation](https://samwho.dev/memory-allocation/). One running model,
  a small grid of memory, carries the whole piece. Every few paragraphs a simulation lets
  the reader watch something happen, and the next paragraph names what they saw.
- Bartosz Ciechanowski, [Gears](https://ciechanow.ski/gears/), from "Disc" through
  "Strings Attached". A small observation gets room to become an explanation, then the
  model changes one thing, and each transition continues the thought.
- Sam Who, [Load Balancing](https://samwho.dev/load-balancing/) and
  [Queueing](https://encore.dev/blog/queueing), for more of the same approach: each
  technique arrives as the answer to behaviour the reader has just watched fail.

The user loved Sam Who's animated explanations and wants that here. They liked
Ciechanowski's explanations but not his introductions. They didn't like Julia Evans's
style, and found Ilya Grigorik's long sentences hard to read.

Learn the structure from these pieces, not their sentences. One running model carries the
page, and each section changes one thing in it. The reader watches the behaviour first,
and the term arrives as the name for what they saw. A simple version fails, a fix
follows, and then the fix's own cost. Numbers are exact and systems are real. Verdicts are
plain. A mechanism is put in words, then a formula if it needs one, then what the formula
means. A section ends when its point is made, and the next opens from where the reader
now is. Sentences and paragraphs are short: Sam Who's sentences average about 15 words
and Ciechanowski's about 20, and both average 40 to 45 words a paragraph. These are
calibration, not targets. In October 2026 paragraph length was the larger gap: Storage's
paragraphs averaged 90 words, each carrying several steps of reasoning that the reader had
to separate. Animations are frequent and anchor the text rather than decorate it; the
[teaching-aid examples](../staycurrent-authoring/references/teaching-aids.md) describe how
they work.

Don't copy their wording, personas, dialogue characters, exclamation marks or metaphors,
and don't adopt an author's identity. Our reader also skims, which these tutorials don't
plan for, so headings use the field's own terms and each section's first sentence names
its subject or follows from the last. Examples from this site stay revisable: record the
user's actual response and the reason for a change, because an agent's approval doesn't
make a passage a house standard.

## Give the opening substance

A teaching article welcomes someone who knows why the subject interests them but may not
yet know how to think about it. A useful opening gives that interest substance: the
reader learns what the thing is and what it's for, and sees why the next question
matters. The revised Indexes opening moves from what an index contains to how grouped
entries find scattered orders, then to the choices that arrangement creates. The user
preferred it to an earlier customer story, which made the task concrete but left the
subject unexplained. Another subject may need a different beginning.

## Let one thought lead to the next

Depth stays easy to follow when the prose follows the consequences of a concrete change.
Explain what the reader needs to predict the next state, then let that state raise the
next question. The relational review followed a valid purchase lost by an earlier restore
target into the work of recovering it, which taught more than another list of recovery
features would have.

Read connected paragraphs as writing, even when their meaning is clear. Notice when the
prose keeps announcing a lesson, swaps a concrete action for an abstraction, stretches a
metaphor or ends every paragraph on a polished verdict. None of these is banned; judge
the cumulative effect. When a passage strains, write a direct alternative beside it and
read both with their neighbours. Keep the one that carries the thought more naturally
while keeping the mechanism, the example and any condition the reader needs.

Accuracy review leaves a particular residue: sentences that record where a fact came from
or how sure we are. Each is added for a good reason, but by October 2026 Storage carried
eight of them ("in the source, not in the manual", "an observation, not a benchmark",
"inferred from how the documentation presents it"), and together they read as hedging.
Keep a qualification that changes what the reader would do, say it once in a clause where
it matters, and put the rest in the sources section or the article's notes.

## Treat headings, captions and controls as writing

A heading should let the reader anticipate the section's subject from what they know at
that point. Name the thought the section develops. A note to the writer, such as "start
with", or a referent like "the rule" that only makes sense afterwards, hides it, while a
familiar technical name often orients best. Heading levels show which explanations
belong together, and a run of worked cases needs a stated purpose where the reader
enters it. Read the title and heading tree as a promise of coverage, too. A caption can
finish a thought: keep a qualification that changes a plausible reading of the picture,
and drop one that only repeats its scope.

## Keep equivalent things consistent across the site

Readers recognise what kind of reading comes next from consistent names, heading levels
and section roles, so compare equivalent sections, collection entrances and onward links
with their neighbours. Label a destination by its actual role: the field guide once
offered "An introduction to relational databases" beside "the complete collection and
sandbox" for object storage, describing recent production work rather than the reader's
next step. Let different subjects keep the differences they need. The site writes in
British spelling with sentence-case headings.

`docs/editorial-guide.md` and `docs/illustration-style.md` cover how writing and media
work together. `staycurrent-authoring` and `staycurrent-review` carry production and
review; this skill is about writing judgement.
