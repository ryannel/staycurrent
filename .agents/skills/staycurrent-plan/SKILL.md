---
name: staycurrent-plan
description: Plan a Stay Current article or collection by researching what an expert knows, then outlining articles and their exit questions. Use before writing a new article or collection, or when replanning one.
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
record. Existing articles and earlier plans are material, not scope.

## 2. Article tree

Derive the articles from the dossier. Give every dossier item an owning article, or
record why it is omitted. Keep a subject as a section when a page of its own would not
save the reader effort. Depth follows what an expert needs, not the length of
neighbouring articles. The [tree format](references/tree.md) sets out the YAML and the
parent–child boundaries.

## 3. Exit questions

Give each article 6–10 questions that a senior practitioner would ask, which the article
must equip a reader to answer. They are the writer's target and the teach-back
reviewer's test. See [writing exit questions](references/exit-questions.md).

## 4. Running example

A collection shares one running example. Give it a realistic scale, so that real
magnitudes fit it: catalogue size, request rates, instance counts and data volumes.
Record its fixed facts in `docs/coverage/<collection>-example.md`. A standalone article
keeps its example facts with its own work.

## Result

Return the dossier, the tree with briefs, the exit questions and the example record,
along with any open questions about scope. The orchestrator reviews a collection plan
once, as a whole, before writing starts. A standalone plan goes straight to writing
unless the owner asked to see it first.
