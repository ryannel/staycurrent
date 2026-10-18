# Choose support for a particular thought

The text, illustration and experiment should help the reader follow the same idea.
When the article explains a mechanism, the prose carries a complete explanation; when
it teaches a practice through worked examples, the examples carry the lesson and the
prose says what each one shows. Supporting media can make a relationship
visible, let someone inspect a sequence, or give them a way to test their intuition.
Choose the form from that opportunity, not from a target number of illustrations.

## Three different needs in one introduction

The relational introduction became heavily verbal after its first relationship
drawing. Adding more decorative artwork would have changed the rhythm without
necessarily improving understanding. We looked at what the reader had to imagine.

The **join example** needed an answer. Following P7 to “Blue mug, 2” made the prose
concrete; a small SQL query beside that result then showed how the request could be
expressed. Its own setup named the input records, so the example could also be read
alone. Here code earned its space through syntax and result. In the earlier
dictionary-encoding explanation, monospaced lists had concealed a spatial mapping;
a diagram had been the better choice.

The **index drawing** needed two arrangements of the same records. Adjacent C4
entries in the index led to separate order rows, where the totals lived. Exact
tables, labels and arrows suited that relationship. The first version asked only
for IDs that were already in the index, making the trip to the table unnecessary.
Changing the question repaired the lesson. Visual polish alone would not have done
so. The caption distinguished a logical destination from a physical engine locator.

The **locking timeline** needed order in time. Two buyer lanes and a continuous
waiting span made it visible that buyer two had not checked stock before buyer one
committed. Nothing needed to move for the reader to inspect that ordering. The
separate checkout article remained the place to experiment with competing updates.

The source examples are
`src/components/explainers/RelationalJoinExample.astro`,
`RelationalIndexLookup.astro` and `RelationalLockTimeline.astro`; read them beside
`src/pages/learn/databases/relational.astro`. They illustrate these choices, not a
set of components every introduction should contain.

## When changing something helps

In the column-store essay, choosing two fields instead of six reveals how data
layout changes the work of a scan. The controls let the reader explore a consequence
that would be tedious to enumerate in pictures. An experiment earns its complexity
when that exploration helps understanding.

A reader encountering it alone needs enough context to know the question, what can
change and how to interpret the result. “Here are those same 16 records” once relied
on distant prose for that context. Keeping the model's setup with the model, while
explaining the conclusion in the article, made both work better.

## Animations that anchor the text

In the pieces that inspired the house style (listed in the style skill), the animations
carry much of the explanation. Sam Who's are small simulations with play, pause, a time
or speed control and a reset, one every two or three paragraphs, and most reuse the same
model with one thing changed. Ciechanowski's give one slider to one quantity, and the
paths they trace make a relationship visible before any equation. Each has a single job.
The prose before it says what to watch, the reader watches requests drop or blocks
fragment, and the prose after it says what they saw and names the term. Colour carries
state, such as a request darkening while it waits. Their figures keep arriving to the
end, because each new idea is a change to the model. When our three reference articles
were compared with them in October 2026, ours had a figure every 600 to 950 words of
prose against their 110 to 150, and the gap was widest in the later sections on cases
and operations. Indexes had one figure in its last 3,400 words, although page splits,
index bloat and the visibility map are all states that change. Those later sections are
often where a reader most needs to see the change.

Use the same pattern here. Reuse one model across the page where you can, keep the
controls few (play and pause, stepping or a time scrubber, reset, and a parameter only
when changing it teaches), and make the motion smooth and the labels readable. Someone
reading only the prose should still learn the point. Respect `prefers-reduced-motion` by
starting paused or stepping instead of animating, make every control work from the
keyboard, give each figure a text alternative, and don't rely on colour alone. Build them
as Astro components with inline SVG and plain TypeScript, following
`src/components/explainers/`, in the site's light and dark tokens and legible at phone
width.

## Meaning in the finished page

Use `docs/illustration-style.md` for the house rendering and interaction conventions.
Exact code-native figures and generated artwork should belong to the same visual
world. Meaning depends on labels, geometry and placement as well as drawing style.

Our paper-like static figures had once resembled buttons. Separate control and
result treatments made interaction recognisable. Likewise, matching dark artwork
without restoring its labels lost the explanation. On a phone, preserving a diagram's
desktop geometry at any cost can make all its labels too small; the index figure
instead stacks labelled tables while keeping the order IDs that carry the mapping.

Read each aid independently through `staycurrent-review`, then return it to the
article. Does it arrive when its idea matters? Does it agree with the nearby records
and terminology? Where is the reader still doing mental work a picture could help
with? Where does a picture merely repeat an easy sentence? Let the answers guide
addition, removal and revision.

Equivalent text, semantic tables and controls, keyboard access, and meaning that
survives without colour or motion all contribute to the explanation's reach.
A source inspection or successful agent interpretation does not establish that
the finished page is readable and usable.
