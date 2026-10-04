---
name: staycurrent-planning
description: Plan Stay Current topic collections, reader journeys, and bounded article commissions. Use when deciding what a field or technology family should cover and how readers move through it, before authoring individual articles.
---

# Give the reader somewhere useful to go

Plan around what people want to understand or do. A newcomer needs orientation;
someone making a choice may want a comparison; a practitioner with a problem may
enter through a diagnosis. A good collection accommodates these different entrances
while offering a sensible path for someone reading from top to bottom.

Use `staycurrent-style`, `docs/site-direction.md` and `docs/content-structure.md`
for the publication's direction. Inspect the actual entry point and available
reading. The task is to develop the collection's purpose and shape, not to fill a
standard hierarchy.

## Work from outcomes towards a tree

Describe what readers should understand after the introduction, then explore the
questions that deserve room of their own. A proposed article tree makes gaps,
overlap and boundaries discussable. Group labels need not become pages, and a
complete map is not a commission to write everything in it.

In the relational collection, an introduction explains what tables represent and
why the database provides queries, indexes and transactions. It gives these ideas
enough substance to be recognisable. Separate articles can then teach schema design,
query behaviour, internals, diagnosis and operation. Product comparisons and a
selective PostgreSQL deep dive connect that understanding to actual choices.

Ask what orientation the new subject needs before transplanting these branches or
the relational order example. The planning-review reference preserves how the
first introduction missed its intended reader despite a thoughtful tree.

Treat dependencies and reading order as related judgements. Our eventual relational
path moved from designing and querying data through concurrent work into internals,
performance and operation. Product-choice readers also got a direct entrance.
Another subject may be clearer with a mechanism first. A small prerequisite can
often be taught locally without sending the reader away to finish another article.

## Test the proposal against real reading needs

For a substantial new collection or major replan, commission independent subagent
perspectives. An editor, practitioner, learning designer and fresh reader were useful
for the relational tree; choose the mix that will challenge the present proposal.
[Planning-review examples](references/section-planning-review.md) show how differing
readings informed boundaries without turning reviewer suggestions into assignments.

Preserve an independent first impression before supplying the rationale. Consider
whether a reviewer found a real missing journey, a confusing promise, or simply a
different preference. Decide the plan from those consequences, not a vote.

Record the tree, important boundaries and a useful first commission in an existing
planning document under `docs/`. Keep unresolved choices visible. Planned coverage
should be distinguishable from available reading. The user requested navigable
outlines for the relational collection; those made the introduction's boundaries
inspectable. That is a useful option when requested, not a reason to create empty
routes for every proposal.

Use `staycurrent-authoring` when writing is commissioned. Preserve scope: a proposed
next slice is not automatically authorised production, and parked ideas such as
the shared distributed-systems programme stay parked. The worked relational plan
is `docs/relational-collection-plan.md`; borrow its reasoning where useful, not its
shape.
