---
name: staycurrent-plan
description: Plan a Stay Current collection or standalone article by researching what an expert knows, then outlining articles and their exit questions. Use before writing new articles, or when replanning or adding exit questions to existing ones.
---

# Plan the shortest route to expertise

An expert practitioner handles the subject's everyday decisions and its awkward cases.
They know the inner workings wherever the work depends on them, and the magnitudes that
decide things. They know the tools and what their output looks like, the failures that
happen in production, and where the subject ends. The plan is the shortest route that
takes a newcomer there. Leave something out, and the reader makes the mistakes an expert
avoids. Include something an expert does not need, and the reader spends time for
nothing.

## 1. Expert dossier

Research the subject before outlining it. Use primary sources: official documentation,
specifications, source code and papers, plus recognised practitioner writing such as
engineering blogs and postmortems. Write the result with the [dossier guide](references/dossier.md),
to `docs/coverage/<collection>-dossier.md` or, for a standalone article, beside its work
record in `docs/article-work/<slug>/`. A standalone article needs only a short dossier,
covering the items it owns. Existing articles and earlier plans are material, not scope.
Stop researching when every section answers what the articles need, not when the subject
is exhausted.

## 2. Article tree

Before outlining a new explanation, read the [voice guide and its writing references](../staycurrent-write/references/voice.md).
Plan a question the reader can follow from beginning to end. For each section, be able
to say what useful understanding would be lost if it were cut. Adding exit questions to
an existing article need not repeat this reference preparation.

Derive the articles from the dossier. Give every dossier item an owning article, or
record why it is omitted. Keep a subject as a section when a page of its own would not
save the reader effort. Depth follows what an expert needs, not the length of
neighbouring articles. Write the tree to `docs/coverage/<collection>.yaml`. The
[tree format](references/tree.md) sets out the YAML and the parent–child boundaries.

## 3. Exit questions

Give each article 6–10 questions that a senior practitioner would ask, which the article
must equip a reader to answer. They are the writer's target and the teach-back
reviewer's test. See [writing exit questions](references/exit-questions.md).

## 4. Running example

A collection shares one running example. Give it a realistic scale, so that real
magnitudes fit it: catalogue size, request rates, instance counts and data volumes.
Record its fixed facts in `docs/coverage/<collection>-example.md`. A standalone article
keeps its example facts with its own work.

Articles written before November 2026 have no exit questions. Before repairing or
reviewing one, write its questions from its brief and record them in the collection's
tree.

## 5. Visual coverage

Plan the visual explanation alongside the written one, using the brief and exit
questions. Follow the [figure guide's learning target](../staycurrent-write/references/figures.md).
Keep a short map with the article's work record: the main mechanisms, consequential
failures and practical choices, and the figures that will explain them. Several lessons
may share one evolving example; another may need several views. Choose the number from
the understanding needed.
Identify detail left to prose and any unresolved gap. A missing major lesson is a gap
to solve, not an automatic exception because it is difficult to draw. The writer may
revise this map as the explanation develops.

## Done

The plan is done when every dossier item has an owner or a recorded omission, every
article has a brief, 6–10 exit questions and visual coverage, and the example record is
written. Return these with any open questions about scope. The orchestrator reviews a
collection plan once, as a whole, before writing starts. A standalone plan goes straight
to writing unless the owner asked to see it first.
