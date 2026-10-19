---
name: staycurrent-planning
description: Plan Stay Current collections. Break a subject into a coverage map, decide its articles and reader journeys, commission bounded articles against the map and merge writers' changes back into it. Use when deciding what a field or technology family should cover, before authoring individual articles.
---

# Plan the shortest route to expertise

Stay Current helps engineers understand the choices in their field. Each collection
should take an intelligent reader who is new to its subject to the understanding of
an expert practitioner, at the least cost in reading time and effort. Planning is
the optimisation of that route. Leave out something an expert relies on, and the
reader will make the mistakes an expert avoids. Include something an expert doesn't
need, or teach it in a slower form than it needs, and the reader spends time that
buys them nothing. The best plan is the shortest route that actually arrives.

An expert practitioner handles the subject's tasks and decisions well, including the
awkward cases. They understand the inner workings wherever the work depends on them,
and they know where the subject ends. That bar sets each subject's depth. An expert in
relational storage reasons about the log, checkpoints and recovery, so that collection
needs several articles of mechanism. An expert in sequence diagrams can draw most
scenarios clearly and knows the corner cases that mislead, which one article built
around drawn examples can teach. A shallow subject simply runs out sooner. Stay inside
the subject, too: an expert at drawing a message broker need not know how brokers
deliver messages, because that belongs to its own field.

The cost is more than word count. A reader also pays for holding several things in
mind at once, for rereading an unclear passage, and for leaving the page to learn a
prerequisite; a small prerequisite taught where it's needed is often cheaper than a
link. Readers also arrive with different needs. A newcomer wants orientation, someone
choosing between options wants a comparison, and someone with a problem may enter
through a diagnosis. Good entrances let each of them skip what they already have,
while the collection still reads sensibly from top to bottom.

`docs/site-direction.md` and `docs/content-structure.md` describe the publication.
`docs/relational-collection-plan.md` is a worked plan whose reasoning is worth
borrowing; its shape belongs to its own subject.

## Break the subject into one coverage map

Break the subject down once, for the whole collection. Start from what an expert can
do, then ask what each of those abilities needs, until every part is something a
sentence, a section or an article can teach. Give each part exactly one home: an
article and section, or an explicit status such as a sentence where it's used, a link
to another field, parked, or left out for a stated reason. Note roughly what each part
needs, such as a mechanism with figures, a set of worked examples or a sentence, so a
writer can see the intended scale and challenge it. Name the collection's running
example, with its data and identifiers, so articles can share it. The reading time shown under each
existing article gives a sense of what that scale costs. Keep the map in
`docs/coverage/<collection>.md`. A subject inside an existing collection adds rows to
that collection's map rather than starting its own. If a collection has no map yet,
build one from what exists, its list in `src/lib/` and its planning document, before
placing anything new.

One home means one place that teaches the part fully. Another article can still give
its reader the sentence of reminder they need at that point and link to the home. When
a part belongs to a field the site has only planned or parked, record that as its
status and give the reader what they need in a sentence for now. When a general subject
is taught through one product, detail that only applies to that product belongs in the
product's own series; `docs/content-structure.md` records that rule.

The map is what lets separately written articles fit together without overlaps or
holes. In October 2026 an Indexes article re-taught what its two new companions owned,
and three sequence-diagram articles disagreed about what their shared notation meant.
Who owned what had lived only in the coordinator's instructions to writers working in
parallel, so nobody could see the problem until review.

The map also draws the article boundaries, and the same optimisation decides them.
Another article costs readers a page to find and a new context to enter, so give a part
its own article when that serves them better than a section would: it needs an
investigation of its own, many readers would come looking for it directly, or it would
bury its parent's argument. Otherwise it stays in the article that needs it. Plan
practical lessons alongside the decisions they support; the
[depth and experiments reference](../staycurrent-authoring/references/depth-and-experiments.md)
describes what can run on this site and when a lesson needs a model or an outside
environment.

## Commission against the map and keep it current

Plan the teaching form alongside coverage. For the mechanisms and decisions that
carry an article, name what the reader needs to see, compare or vary, rather than
merely requesting an interactive demo. Check that the commission permits the
components or experiments those jobs need. Existing templates are implementation
choices, not limits on the explanation. This is a judgement about reading effort,
not an illustration quota; preserve simple static examples where they suffice.

A brief names the parts the writer owns and the neighbouring parts they should link to
rather than teach; the authoring skill's
[commission reference](../staycurrent-authoring/references/commission.md) shows what
else helps. Writing will reveal where the plan was wrong, so each handoff reports its
changes to the map: parts added, moved, cut, deferred or found to belong elsewhere.
Merge those before the next commission, so later writers build on what earlier ones
found rather than on the original guess.

When the collection is drafted, audit the map in both directions. Does every part have
a home that teaches it, rather than merely mentioning it? Does every section serve a
part, or is it overlap and drift? Then ask someone who hasn't seen the map to list what
an expert practitioner can do, and compare. That catches the parts the original
breakdown never imagined.

## Test the plan before writing

For a new collection or a major replan, ask independent reviewers to challenge the
proposal: an editor, a practitioner, a learning designer, a fresh reader, or whichever
mix fits the uncertainty. Get each first impression before explaining the reasoning,
and decide by consequences rather than votes. A reviewer may have found a missing
journey, a confusing promise or simply a different preference. The
[planning-review reference](references/section-planning-review.md) shows how this
shaped the relational plan, including an introduction that missed its intended reader
despite careful review.

## What a plan authorises

A plan is not a commission to write everything in it. Keep planned coverage visibly
distinct from available reading, and keep parked ideas, such as the shared
distributed-systems programme, parked. Record longer reasoning in a planning document
under `docs/` when it would help a later agent. Use `staycurrent-authoring` once
writing is commissioned.
