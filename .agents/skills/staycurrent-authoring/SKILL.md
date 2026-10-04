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

The relational collection taught us that completeness belongs to the collection.
An introduction needs enough substance to orient someone who has never met the
technology. A detailed checkout walkthrough was coherent but began too far inside
the subject. The better introduction established tables and relationships, then
showed what queries, constraints and transactions contribute. Its small examples
answered local questions; deeper workings had their own destinations.

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

## Develop the argument and its support

Use `staycurrent-style` and read the original writing references alongside the
draft. `docs/writing-style.md` records passages and revisions worth considering.
Give the thought room to develop, including in headings, captions and supporting
copy. A polished summary of a mechanism is not necessarily an explanation of it.

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
explanation could remove that obstacle without becoming a SQL tutorial. Likewise,
showing why an attempted design fails is useful, but a practical lesson should give
the reader a way to finish the decision. Our JSON example explained why its check
still allowed values that broke its query; it needed a dependable alternative to
complete that thought. Choose the amount of resolution that fits the article's job.

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

For website work, inspect the rendered result in light and dark, at desktop and
phone widths. Exercise the controls that matter and verify examples appropriately.
Run the repository's `pnpm build`. These checks answer different questions from
editorial review: an accurate illustration can still have unreadable phone labels,
and a successful build says nothing about the argument.

Carry authorised work through repair and verification without requiring routine
human sign-off. Leave a useful handoff: what changed, what was checked, and any real
uncertainty. The brief, evidence and review notes should let a later agent understand
important decisions without recreating the whole investigation. Keep records
proportionate to the work. Distinguish a ready draft from publication; review alone
does not authorise a commit, deployment or feed entry.
