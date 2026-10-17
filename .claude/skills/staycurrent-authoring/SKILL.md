---
name: staycurrent-authoring
description: Commission, research, write, and implement Stay Current articles or article batches, including their supporting media and independent review. Use for substantive article creation or revision, not ordinary brainstorming or a small copy edit.
---

# Help the reader understand something they can use

Take responsibility for the finished explanation. The reader should come away able
to reason about the subject, with enough understanding to recognise a similar
problem elsewhere. Choose the argument, examples, media and working process that
serve that outcome. These references give context for your judgement; they are not
an article template or a sequence to reproduce.

Choose references for the decisions in front of you. The linked material offers
context when useful; it is not a reading assignment to repeat for every article.

## Find the article's job

Use `docs/site-direction.md` and `docs/content-structure.md` to locate the work in
the publication. A brief should make the reader, central question and useful stopping
point clear. [Commission examples](references/commission.md) show how much context
can help another agent without deciding the explanation for it. Keep a concise
record in `docs/article-work/<slug>/` or an existing equivalent; expand it where
the work warrants it.

When extending an existing guide or collection, inspect comparable published
sections and the pages that link into them. Carry forward useful conventions for
section roles, heading hierarchy, collection names and onward-link wording so the
addition fits the surrounding site. The style skill's field-guide example shows
why a newly completed collection should not acquire a different kind of entrance
label merely because it now includes more material. Let differences in reader
purpose or actual content justify departures, and make consequential departures
clear in the brief. This comparison should inform the new work, not expand it into
an unrelated site-wide rewrite.

The brief gives the author a reader to write for: what brought this person here,
what they already understand, and what understanding would make the article useful.
This matters at the opening as much as at the end. A supporting article may be
someone's first encounter with its subject. Give the author room to find a beginning
that establishes the idea and makes the example worth following.

In the Indexes revision recorded in `docs/writing-style.md`, a customer looking up
orders was a clear situation, but it did little to introduce indexing. Explaining
the stored entries and their references to rows gave the same example a purpose:
the reader could see how grouped entries help find scattered orders. The useful
outcome was that understanding, rather than a particular opening scene or paragraph
structure. A brief can name the understanding sought while leaving the writer free
to discover how to convey it.

For a main deep dive with supporting articles, identify what new investigation
each child offers. A direct entrant needs orientation; a continuing reader needs
a reason to proceed. Preserve the main article’s promised explanation, but
question repeated setup and implementation that obscure the child’s distinct job.
The collection revisions in `docs/writing-style.md` show both choices.

That distinction still leaves room for depth. Saying that a join connects tables
does little until the reader can see what answer the connection produces. The
revised introduction follows a product ID to “Blue mug, 2”. Seek the explanatory
step that makes the idea useful, rather than adding more topics to sound complete.

The design series exposed another distinction: a subject can appear in the brief
and the prose without being taught. We chose integer, decimal and timestamp columns,
then relied on the reader understanding types in the next article. The missing
explanation was what those choices meant and how to make them. When an argument
depends on earlier learning, read the actual predecessor passage. A planned page
or a familiar term is not that learning. Work backwards from the decisions the
reader should be able to make, and supply the understanding those decisions need;
this often calls for a small bridge rather than another article.

Before drafting, ask what explanations this audience would reasonably expect from
the subject, title and promised outcome. Derive those expectations before adapting
them to the proposed outline; otherwise the outline can make its own omissions
invisible. Consider the mechanisms, decisions and consequential limits the reader
needs, including failure and recovery where those affect the article's promise.
These are questions about this subject, not mandatory sections for every article.
Keep a concise account of essential coverage and deliberate boundaries in the brief.
A narrow brief does not excuse a title or introduction that promises more.

## Develop the argument and its support

Use `staycurrent-style` and read the original writing references alongside the
draft. `docs/writing-style.md` records passages and revisions worth considering.
Give the thought room to develop, including in headings, captions and supporting
copy. A polished summary of a mechanism is not necessarily an explanation of it.
Revisit working headings against the finished sections: drafting prompts can survive
after the argument changes. Use the style skill's heading guidance to name what the
reader is about to learn, then read the heading into its opening paragraph.
Build the heading tree from the assembled draft, including supporting components,
and compare it with the article's actual argument and contents navigation. Group
related examples where that makes their purpose clear, and introduce the change
from explaining a concept to following its worked cases. A list of locally accurate
headings can still leave the reader without a useful map of the article.
Compare that map with the expected coverage from the brief: given the subject,
are there explanations a reader would expect that have no clear home? Check the
body before diagnosing a gap. A topic may be well taught under a broader heading,
buried where readers cannot find it, merely named, or genuinely absent. Repair the
appropriate problem: the label or grouping, the explanation, or an overbroad promise.
Necessary understanding belongs in this article; a substantial further investigation
may belong in a linked article. Verify that any such destination exists and answers
the question, and keep planned coverage visibly distinct from available teaching.

The pagination draft defined its subject, then began teaching ordering without
explaining why pages need a sequence. The user still felt dropped into the middle
of the topic. A definition had not supplied the reason for the next decision.
Consider what question the reader is ready to ask at each transition, and whether
the next explanation answers it. Sometimes the missing step is motivation;
sometimes it is how to derive an answer or why an earlier lesson still applies.
More opening prose alone will not repair gaps later in the argument.

Consider what the reader needs to interpret an example as well as its main lesson.
Our constraints examples used valid SQL, but positional INSERT values left readers
to guess which number belonged to which column. An explicit column list and a short
explanation could remove that obstacle without becoming a SQL tutorial. Give the
reader the records and starting state needed to derive a result before showing it;
setup hidden in an optional disclosure cannot supply facts the main path needs.
Make a reset explicit when later examples return to an earlier state. Likewise,
showing why an attempted design fails is useful, but a practical lesson should give
the reader a way to finish the decision. Our JSON example explained why its check
still allowed values that broke its query; it needed a dependable alternative to
complete that thought. Choose the amount of resolution that fits the article's job.

Place the reader inside the example's running system. Before a sequence of commands,
establish who sends them, where they run, what state persists between them, and who
uses each response to decide what happens next. A query returning no rows, a rejected
statement and a lost reply can require different application branches even when
all three prevent the happy path. Show the branch that matters to the lesson;
comments and a later complete script cannot supply an execution setting the reader
needed earlier. Application code, a query editor and an interactive terminal can all
be useful viewpoints. Choose one deliberately and explain a switch when it occurs.
The transaction revision in `docs/writing-style.md` records why this mattered.

For a collection with practical lessons, read the
[depth and experiments reference](references/depth-and-experiments.md). It follows
the PostgreSQL rebuild and the later relational review: a capability the deep dive
promises to teach needs an explained mechanism and a consequential decision;
a runnable example needs an observable outcome. It also helps choose between a real engine, a local model and
a worksheet for a service that cannot run inside this website.

Use `staycurrent-research` for the evidence behind consequential claims. Keep the
difference between a family principle, a particular implementation, and an invented
teaching example intelligible. Further reading should offer a useful next step,
with a short explanation of what a source contributes.

Choose media where it reduces work the reader would otherwise do in their head.
The [teaching-aid examples](references/teaching-aids.md) explain why the relational
introduction gained a small SQL result, an index route and a locking timeline, while
its interactive checkout remained a separate article. Other subjects may need a
different balance. The prose should remain a complete explanation, and an experiment
should make sense to someone encountering it on its own.

Follow `docs/illustration-style.md` for the established visual language: restrained
technical sketches, readable labels, matching light and dark views, and a clear
distinction between pictures and controls. Choose generated artwork or code-native
drawing according to what must be shown accurately. Use the imagegen skill when
generating artwork. Review the assembled figure, not just its unlabeled asset.

## Learn from the finished page

For substantial work, use independent subagents through `staycurrent-review`.
Choose perspectives that can challenge the explanation, and preserve an uncued
first reading. Have that reader record questions while moving through the assembled
article, before judging it as a whole; the review skill's
[first-reading guidance](../staycurrent-review/references/first-reading.md) explains
the intended evidence. Use those observations to repair the learning sequence,
including questions that were answered only after the reader needed the answer.
The same reading can reveal where the reader is carrying too much in memory,
wants to test a variation, or is ready for a deeper investigation. Use those signals
to choose supporting media and useful onward reading. Keep necessary explanation
in the current article; take substantial new article ideas through planning rather
than treating every interesting question as another page to produce.
Reviewers should expose consequential weaknesses, not generate work
by asking for every related subject. Resolve their findings with evidence and your
own editorial judgement; choose another explanation or medium when the current
one keeps failing to communicate.

Integrate review repairs into the author's explanation. A useful qualification can
become awkward when appended as another warning or summary; put it where the reader
needs it and reconnect the surrounding paragraphs. Before the final editorial
reading, read the revised piece continuously, including its headings and captions.
Keep concrete reasoning that already works rather than rewriting every sentence
to demonstrate that a style pass happened.

For website work, inspect the rendered result in light and dark, at desktop and
phone widths. Exercise the controls that matter and verify examples appropriately.
Run the repository's `pnpm build`. These checks answer different questions from
editorial review: an accurate illustration can still have unreadable phone labels,
and a successful build says nothing about the argument.

The page shell is shared so articles look alike without anyone keeping them in
step. `TitleLine` writes the line under the title and calculates the reading time
from the finished page. `ArticleBody` places the contents list after the opening
and builds it from the `<h2>`s. The site check in `scripts/check-site/` reports
where a page departs from that shape; its README explains each rule and why it
exists.

Carry authorised work through repair and verification without requiring routine
human sign-off. Leave a useful handoff: what changed, what was checked, and any real
uncertainty. The brief, evidence and review notes should let a later agent understand
important decisions without recreating the whole investigation. Keep records
proportionate to the work. Distinguish a ready draft from publication; review alone
does not authorise a commit, deployment or feed entry.
