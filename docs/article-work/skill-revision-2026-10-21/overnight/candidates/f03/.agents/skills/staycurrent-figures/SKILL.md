---
name: staycurrent-figures
description: Design and build the figures, tables, code listings and interactive tools in an article, and check them on the rendered page before returning.
---

Show the state, relationships or outcomes the reader would otherwise hold in their head. Use the figures in [Sequence diagrams](../../../src/reference-articles/sequences.astro), [Indexes](../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../src/reference-articles/storage.astro) as the standard.

Choose from the reader's question: static tables/listings for data/code, steps for sequences, options for comparisons. Use interaction only when it teaches more than a static example. For a promised runnable implementation, supply or link its setup and dependencies; verify it from the files the reader receives.

Use the [example record](../staycurrent-continuity/SKILL.md). Put shared figure data/state and executable outcomes in an article model file; a standalone static table or listing needs no artificial model. Keep recurring entities, values and notation consistent and caption-named features present. For relational examples, show data under real column headings, one table per relation and one kind of value per column; do not pack columns into `name = value` cells. Mark primary/foreign keys and draw relationships.

For Play/Back/Next figures, use the shared stepper and read [stepped figures](references/stepper.md). Each step adds information, marks changed values and follows the chosen option's labels; end on the outcome without a repeated final step.

Check at 375 px and in light/dark themes: stack comparisons, keep headings unbroken within names and prevent article-column overflow. Use labelled row cards or another form when a prose table's wrapping, density or width makes comparison hard to read. Keep controls and their changing state or summary understandable together at phone width. Use site colour tokens. Body text—including warnings, NULL markers and dimmed rows—needs 4.5:1 contrast; large text/graphics need 3:1. Give interactive figures a “Read this figure as text” outcome summary.

Label illustrative models versus observed system results in captions and boundary notes stating omissions; never present unrun commands as observed. For database behaviour, read [database verification](references/database-verification.md). Keep evidence in one index with receipt links, reusing it only while relevant source, data, environment and verifier remain applicable.

Use the designated preview/build owner and fixed preview; standalone workers own both. Open the built page in a visible browser. Hidden panes may animate at about one frame per second with stale screenshots; if hidden, check timing from page timers and report that limit. Before reading prose, inspect each figure and record what it seems to show; fix items that do not stand alone. Play every option, check keyboard stepping, both themes and 375 px, and compare every caption/label with its displayed content.
