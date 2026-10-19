---
name: staycurrent-authoring
description: Write or substantially revise a Stay Current article against its brief and the collection's coverage map, including its examples, media, evidence, verification and independent review. Use for substantive article creation or revision, not brainstorming or a small copy edit.
---

# Teach an expert's understanding at the least cost to the reader

You are responsible for a finished explanation: one an intelligent reader, new to its
subject, can follow from start to finish and come away able to use. Each article is
one stretch of a collection's route (see `staycurrent-planning`) and shares its aim.
Take the reader as close to an expert practitioner's understanding of the parts you
own as the subject allows, at the least cost in reading time and effort. Spend the
reader's time where they would otherwise get something wrong or be unable to decide,
and nowhere else.

Quick is not the same as compressed. A clear explanation read once costs less than a
terse one read twice, and a missing step costs more than the sentence that would have
supplied it. What the reader can do afterwards is the measure; length and section
counts are not.

The brief tells you who the reader is, why they came, which parts of the coverage map
you own, and which neighbouring parts to link to rather than teach. How to explain them
is yours to decide. If there's no brief, write one in `docs/article-work/<slug>/` first;
the [commission examples](references/commission.md) show what helps.

## Work out what the expert needs

Before reading this article's existing outline or draft, if it has one, ask what an expert practitioner in this
subject can do, then what each of those abilities needs. Keep going until every part is
something a sentence, a section or a set of examples can teach; "a sentence" and "leave
it out" are ordinary answers. Do this before you see an outline, or the outline will
define what counts as complete.

The subject sets the depth, not the article type or the length of its neighbours. A
mechanism usually needs explanation, a figure and its consequences: the Storage article
needed the log, checkpoints, torn pages and point-in-time recovery, because an expert
predicts and decides with them. A practice is usually learned fastest from worked
examples, the common cases and the corner cases, each with a short note on why. In
October 2026 the sequence-diagram articles explained in prose what an expert knows from
having seen it drawn, and grew to four articles where light writing and a set of
examples would have done. The reading time shown under each existing article gives a
sense of what a given scale costs the reader.

Attention should be even across the article; length shouldn't. When one section is much
fuller than its neighbours, ask which side is wrong before evening them out. Cutting the
Storage article's full point-in-time recovery section to match thinner neighbours was
the wrong repair; the neighbours needed the same attention.

Stay inside the subject. The asynchronous sequence-diagram article drifted into how
brokers deliver messages, which an expert at drawing them doesn't need. When a general
article uses one product as its worked example, say where other major products differ in
ways that change the reader's prediction or decision. The first general Storage article
described PostgreSQL's heap and VACUUM as if every relational database worked that way;
`docs/content-structure.md` records the rule that came from it. Where you place those
differences matters as much as naming them. When the rewrite added one per paragraph,
each mechanism was told in a stop-start rhythm. Explain the mechanism once, then gather
the differences that change a decision in a short paragraph or a small table, as
Storage's table of where old row versions live does.

If the work shows the map was wrong, with a part missing, misplaced, or deeper or
shallower than planned, make the sensible decision and report it in your handoff as a map
change. That report is how separately written articles stay complete together.

## Build the explanation in the order the reader needs it

Start where the reader is. The opening should tell a newcomer what the thing is, what
it's for and when they'd reach for it, then make the first example worth following. In
October 2026 an Indexes opening defined the index by its contents and moved straight to
page counts. It never said what an index is for, and nine reviews passed it. A companion
may be someone's first encounter with its subject, so give a direct entrant enough
orientation without re-teaching what its parent owns.

At each transition, ask what question the reader is now ready to ask, and answer that
one. A pagination draft defined its subject, then taught ordering without saying why
pages need an order, and the reader felt dropped into the middle. When an argument relies
on an earlier article, read the actual passage: a planned page or a familiar term is not
understanding the reader has.

Show what an idea produces. Following a product ID through a join to "Blue mug, 2"
taught more than saying that joins connect tables. Where the map names the collection's
running example, reuse it with its names and identifiers. Give each example what the reader
needs to interpret it: the starting records, which value goes in which column, who sends
each statement and who acts on its reply. Where a lesson shows a design failing, give the
reader a way to finish the decision. `docs/writing-style.md` records the revisions behind
these, and the [depth and experiments reference](references/depth-and-experiments.md)
shows how a correct example can stop one consequence too soon.

Headings name what the reader is about to learn; the style skill covers them. Build the
heading tree from the assembled page, read it as a map of the argument, and compare it
with your breakdown. A part may be taught under a broader heading, buried, merely named
or missing, and each needs a different repair.

Use media where it saves the reader work they would otherwise do in their head: a figure
for a relationship or an order in time, code and a result for exact instructions, an
experiment when varying an input teaches more than describing it. For a mechanism, the
prose carries the explanation and the figure lets the reader see it. For a practice,
the worked examples carry the lesson and the prose says briefly what each one shows and
why. Either way, a reader who can't see a figure should still be able to follow the
text. See the [teaching-aid examples](references/teaching-aids.md) and
`docs/illustration-style.md`.

Before settling the page's form, identify what the reader must keep in mind or
predict: records matching, state changing, concurrent actors, a boundary moving,
or work accumulating. Choose how they will see and, where useful, vary it. Make
this decision across the whole argument, including later failure and operating
cases. Record the consequential choices briefly in the brief or handoff; do not
turn every paragraph into a media inventory. Read the [teaching-aid guidance](references/teaching-aids.md)
when making these choices. A prose-first draft followed by a few decorative aids
is not an adequate substitute for designing the explanation.

An interactive aid must make its represented relationship or state inspectable.
When changing a choice is the lesson, expose that choice and derive the changed
outcome. Keep the earlier facts needed for comparison visible. Previous/Next
buttons around replacement paragraphs provide pacing; they do not by themselves
show a mechanism. A native worksheet verifies real behaviour but does not remove
the need for a visible explanation on the page. Reuse suitable components or build
new ones; a convenient template or renderer must not set the teaching standard.
Static examples remain right when they show the idea more directly. There is no
minimum figure count or requirement for a control on every page.

Use `staycurrent-research` for the evidence behind consequential claims, and keep a
general principle, a particular implementation and an invented teaching example
distinguishable. Write in the house voice of `staycurrent-style`.

## Check the finished page

For substantive work, have independent subagents review it through `staycurrent-review`,
including an uncued first reading. Scale the review to the work: a light, example-led
article may need only a fresh reader and a technical check, while a new deep dive needs
more. Resolve their findings with evidence and your own
judgement. A first reading also shows where the reader held too much in memory or wanted
to try a variation, which may call for a figure or an experiment, and where curiosity
points to onward reading. Take a substantial new article idea back to the map rather
than writing it. Fold each repair in where the reader needs it rather than appending
another warning, and read the revised piece continuously before the final editorial
reading.

For a new or changed causal model, check a consequential variation against its
stated rules and evidence, not just whether its buttons respond. Have an
independent reader operate the aid before seeing its intended lesson, then review
it with the surrounding explanation. Unresolved mental reconstruction of a central
mechanism is a repair finding even when the prose is accurate.

Inspect the rendered page in light and dark, at desktop and phone widths, exercise the
controls that matter, and run `pnpm build`. These checks answer different questions from
review: an accurate figure can still have unreadable phone labels, and a passing build
says nothing about the argument.

The page shell keeps articles alike without anyone keeping them in step. `TitleLine`
writes the line under the title and the reading time; its type is one of the five in
`src/lib/article-types.ts`, and a Companion names the deep dive it extends. The type
names the article's role, not its size: a short article that fully teaches its subject
is still a deep dive. `ArticleBody`
places the contents list after the opening and builds it from the `<h2>`s. Every article
ends with "Sources and further reading", each entry saying why to read it. The site check
in `scripts/check-site/` reports departures, and its README explains each rule. Match
neighbouring pages' section roles, names and link wording unless the content gives a
reason to differ.

## Hand off

Carry authorised work through repair and verification without waiting for routine human
sign-off. The handoff says what changed, what was checked, any changes to the coverage map
and any real uncertainty. Keep the brief, evidence and review notes in
`docs/article-work/<slug>/`, in proportion to the work, so a later agent can follow the
important decisions. A ready draft is not publication: review doesn't authorise a commit,
deployment or feed entry.
