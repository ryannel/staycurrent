---
name: staycurrent-write
description: Write, rewrite or repair a Stay Current article and its figures. Use when drafting or substantially revising an article, repairing accepted review findings, or adding or changing an article's figures.
---

# Write an article

The target is set by the plan: after one reading, the reader can answer the article's
exit questions, at the least cost in time and effort. Work from the brief, the exit
questions, the neighbouring scopes and the example record. A standalone commission
without a plan writes its own short brief and exit questions first, using
[staycurrent-plan's guide](../staycurrent-plan/references/exit-questions.md).

## What a Stay Current article contains

- **The practitioner's world.** Use the names practitioners search for, introduced once
  the reader has seen the behaviour they name. Show the output a practitioner would
  read: plans, metrics, logs, error text. Put short code at decision points. Cover the
  failure patterns and incidents that the dossier assigns to this article.
- **Numbers.** Use real figures wherever a decision depends on magnitude, stated plainly
  with their source or measurement conditions. Use invented figures where the lesson is
  ordering or arithmetic. Say where the numbers come from once, in a closing section,
  rather than qualifying them paragraph by paragraph.
- **Confident statements.** Say what things are. Keep "not" for contrasts that prevent a
  real mistake. Mention running-example facts only where they change the lesson.
- **One implementation, general subject.** When one product illustrates a general
  subject, teach the subject's decisions. Explain the mechanism once, then gather where
  other implementations differ in ways that change a decision.
- **Parent and child.** Give a useful answer at this level, and leave the child's full
  treatment to the child. A pointer to the child is one sentence, not a substitute for
  an answer here.

Before drafting, read the [voice guide](references/voice.md).

## Prose stands alone

The prose carries the whole explanation. Removing every figure, including captions,
labels and controls, must leave a complete article with no further edits. Write about the
subject, not about the figure. A figure earns its place by making something felt that
prose can only state, such as timing, accumulation, contention or scale.

## Figures

Figures follow the house style in [Figure style: ink and tokens](../../../docs/figure-style.md).
For building, playback and checks, use the [figure guide](references/figures.md).

## The reference articles

Sequence diagrams, Indexes, and Storage and durability are preserved in
`src/reference-articles/`. They are the publication's models for concrete, confident
teaching prose: exact numbers, a mechanism put into words before it is named, and
provenance gathered at the end. Before drafting a new article, read in full the one
closest in shape to your subject, with `python3 scripts/read-writing-reference.py`.
Return to specific passages when an explanation proves hard. Their framed visual style is
not the house style.

## Accuracy

Check consequential claims against primary sources, and list them under "Sources and
further reading". Keep observed behaviour distinct from illustration. Claims about engine
behaviour that rest on execution need a run on an owned, disposable instance; see
[database verification](references/database-verification.md). Local builds, previews and
disposable databases are safe: run them, fix what your change breaks and rerun them
without asking.

## Continuity

A collection's example record (`docs/coverage/<collection>-example.md`) fixes the shared
facts. Develop scenarios from it, keep names, values and roles consistent, and propose any
extension to the orchestrator rather than inventing a conflicting fact. Familiar figures
should evolve as the explanation develops, keeping roles and visual meanings recognisable.

## Repairs

Treat each finding as a reader's problem, not wording to insert. Make the smallest change
that still reads as one piece: reword, reorder, cut or move material, and restructure when
the problem needs it. Reread the surrounding explanation and every later use of what
changed, and recheck any claim the repair touches.

## Done

- Reread the whole article from the reader's starting point, once with the figures
  omitted.
- Answer each exit question from the article alone. Close any gap you find.
- Build, then run `pnpm check -- --rule=dense-prose --page=<route>`. Reread each flagged
  sentence in place, and rewrite it if a reader would have to read it twice.
- Check new or changed figures against the defect list in the figure style, in both
  themes at desktop and 375 px.

Return the integrated article on its draft route, together with the check results. Note
any scope or example changes you propose, and any limits on the evidence. Publication is
a separate decision for the owner.
