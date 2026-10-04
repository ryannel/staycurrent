# Choose support for a particular thought

The text, illustration and experiment should help the reader follow the same idea.
The prose carries a complete explanation. Supporting media can make a relationship
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
