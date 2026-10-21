---
name: staycurrent-continuity
description: "Keep what a reader carries through a collection consistent: the shared running example, and every term explained before it is used. Run the pass before returning any draft or repair."
---

A reader builds on two things from page to page: the example they already know, and the words they have already been taught. Both break quietly. A writer who knows the subject does not notice using "snapshot" or "row lock" before explaining it, and a writer working on one article cannot see that a neighbour named the same people differently. In the 2026-10-20 skill trial, nine terms were used before their explanation across two pages, three perspectives raised it, and repairs reintroduced it. The same trial's a03 switched its example from the shop's stock to class bookings to match its children, and a child already used the shop's customers as instructors. The figures skill's consistency rule caught this only after the fact, because it works within one article.

## The collection's running example

Each collection keeps one example record beside its tree, at `docs/coverage/<collection>-example.md`. It names the people and their roles, the tables with their keys and starting rows, and any extension a particular article adds, such as class bookings for the transactions article, with what each part stands for in the core example.

The orchestrator writes it with the root breakdown, before any child is planned, and gives it to every planner and writer. Briefs refer to parts of the record rather than inventing their own examples. When an article needs something the record lacks, the writer proposes an extension and keeps to it, and the orchestrator merges it like any other tree change. A standalone writer extends the record directly and says so.

Figures take their rows from the record. Where several articles' figures share rows, keep them in one module that each article's model file imports.

## The pass

Run this before returning a draft or a repair. It is a list rather than a reread, because a reread is exactly where an expert's own vocabulary goes unnoticed.

1. **Terms.** Go through the article in reading order, including figure captions, controls and step text, and list each technical term with the sentence where it first appears and the sentence that explains it. Fix every term used first and explained later, or never: explain it where it first appears, move the use after the explanation, or use plain words instead. A term an earlier article on the reader's route explains may be used with a short reminder and a link, but only if the article says it builds on that one.
2. **One name per thing.** Each term, protection, option and person has one name throughout, and control labels match the prose.
3. **The example.** Check every name, key, row and value against the example record, and every outcome against earlier figures. An order refused in one figure must not appear as accepted in a later one.

Maintain one term ledger per article in the work record, linked to the collection's example record. On repair, audit the complete reading order again, update changed entries and record the audit result rather than reproduce unchanged entries. When a definition, name or example moves or changes, check its downstream uses and affected articles and figures; send cross-article example changes to the orchestrator.
