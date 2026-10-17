---
name: staycurrent-style
description: >
  The writing voice for Stay Current articles, captions, interactive models,
  project docs, and replies. Use when drafting or revising prose in this project.
---

# Develop a voice through examples

For a blind comprehension or isolated-media review, use
[the context-free voice reference](references/blind-review-voice.md) in place of
the article histories below. It supplies house context without revealing what the
reader is expected to understand.

For other writing, use `docs/writing-style.md` to choose relevant references.
Read original passages when developing the voice; Sam Who, Bartosz Ciechanowski
and Julia Evans offer different examples to draw on. A bounded edit may need only
one of them or a useful house passage, rather than another reading of the whole
catalogue. The document also follows revisions to our column-store and relational
articles. Their value is in seeing how an explanation develops, not extracting a
sentence pattern to reuse.

We want an intelligent reader to feel that someone understands the subject and is
helping them see it. Plain language can carry difficult reasoning. Give a thought
enough room to become clear, and let the next thought follow from it. Choose the
register and rhythm that fit the subject; there is no prose score, prescribed
sentence length or vocabulary list.

A teaching article welcomes someone who knows why the subject interests them but
may not yet know how to think about it. A useful opening gives that interest some
substance: the reader begins to understand the idea and why the next question
matters. An example can do much of this work when its details have a clear purpose.
The revised Indexes opening in `docs/writing-style.md` shows one approach. It
begins with what an index is for, finding rows without searching the whole table,
then says what it holds and how grouped entries locate scattered orders. The user
preferred that introduction to the earlier customer story, which made the task
concrete but left the subject largely unexplained. A later rebuild kept the
contents and lost the purpose: it opened by defining a B-tree index as "a separate,
sorted copy of one or more columns" and moved on to page counts. Nine reviewers
passed it. The user, on first reading, did not: it "doesn't open with anything on
what an index actually is or what they are for." Naming what a thing is made of
does not yet introduce it, and saying what a subject is for gives away nothing the
article sets out to show. Draw on the reasoning in the example; another subject may
need a different beginning.

Read headings, decks, captions and controls as part of the writing. Judge how they
help someone follow the piece, alongside the argument and the relationships between
its parts. A heading should help the reader anticipate the section's subject,
question or development from what they know at that point. Name the thought the
section actually develops; an instruction to the writer such as “start with” can
conceal that subject. When a heading refers to “the rule” or “the problem,” consider
whether the reader can identify the referent without reconstructing the author's
intention after reading. The test is meaning in context, not whether the same word
appears below. Plain topic labels, questions and explanatory headings can all work.
Where a section teaches an established technique, its familiar name can orient the
reader better than an instruction describing part of it. Heading levels should also
show which explanations belong together. Give a sequence of worked cases a clear
purpose and an introduction where the reader enters it; isolated scene labels do
not establish that relationship by themselves. Read the title and heading tree as
a promise of coverage too: clear labels cannot compensate for a missing explanation,
and a broad title should not imply depth that the article does not supply.
The worked passages in the writing reference offer context for those
decisions without prescribing how every section should be titled. A caption can
finish a thought rather than append another defence of it: retain qualifications
that change a plausible reading of the picture, and question those that merely
repeat its already clear scope. The caption revisions in the writing reference
show that distinction in context.

Consistency across the site helps readers recognise what kind of reading or action
comes next. Compare equivalent sections, collection entrances and onward links
with their neighbours. Use consistent names, heading levels and structural roles
where they serve the same purpose. A guide's choices should answer its framing
question, and each section should develop the choice the reader came to understand.
Different subjects can need different explanations without changing those roles.

The field guide exposed this when the relational link said “An introduction to
relational databases” while the equivalent object-storage link advertised “the
complete collection and sandbox”. The latter described the latest production work
rather than matching the reader's next step. “An introduction to object storage”
restores that relationship. Use the destination's actual role to choose its label;
an introduction, practical exercise and product comparison should remain
distinguishable. Keep useful uniformity without forcing identical paragraphs or
copying an existing pattern that misrepresents the content.

Read connected paragraphs as writing, even when their meaning is clear. Notice
when the prose repeatedly announces a lesson, replaces a concrete action with an
abstraction, stretches a metaphor, or ends each paragraph with a polished verdict.
Judge the cumulative effect in context; none of these is a banned construction.
A useful edit names what happens and lets the reasoning develop. It need not make
the sentences shorter, remove technical terms, or add a chatty voice.

Depth can stay easy to follow when the prose follows the consequences of a concrete
change. Explain what the reader needs to predict the next state, then let that state
raise the next question. The later relational review added the valid purchase lost
by an earlier restore target and the work needed to recover it. That continuation
taught more than another list of recovery features would have. Keep such reasoning
in the main path when the article's promise depends on it.

When a passage feels strained, try a direct alternative beside the original and
read both with their neighbours. Keep the version that carries the thought more
naturally while preserving the mechanism, example and necessary conditions.
`docs/writing-style.md` records the body-text revision that prompted this guidance;
its replacements remain candidates for the user's judgement.

Examples from the site remain revisable. Preserve the user's actual response and
the reason for a change; agent approval does not turn a passage into a permanent
house standard. Develop original prose informed by the human references, rather
than adopting an author's identity or reproducing their language.

For how writing and media work together, consult the relevant examples in
`docs/editorial-guide.md` and the visual conventions in
`docs/illustration-style.md`. `staycurrent-authoring` and `staycurrent-review`
carry production and review guidance; this skill is about writing judgement.
