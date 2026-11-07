---
name: staycurrent-write
description: Write, rewrite or repair a Stay Current article and its figures. Use when drafting or substantially revising an article, repairing accepted review findings, or adding or changing an article's figures.
---

# Write an article

The target is set by the plan: after one reading, the reader can answer the article's
exit questions, at the least cost in time and effort. Work from the brief, the exit
questions, the neighbouring scopes and the example record. A standalone article without
a plan starts with [staycurrent-plan](../staycurrent-plan/SKILL.md) in its short form. An
existing article without exit questions gets them first, as that skill describes.

## Voice and writing references

Before drafting, read the [voice guide](references/voice.md) and its four Randall Munroe
essays. That guide owns the shared prose voice, reference-reading instructions and
guidance for local repairs. It is separate from the house figure style.

## What a Stay Current article contains

- **The practitioner's world.** Use the names practitioners search for, introduced once
  the reader has seen the behaviour they name. Show the output a practitioner would
  read: plans, metrics, logs, error text. Put short code at decision points. Cover the
  failure patterns and incidents that the dossier assigns to this article.
- **Numbers.** Use real figures wherever a decision depends on magnitude, stated plainly
  with their source or measurement conditions. Use invented figures where the lesson is
  ordering or arithmetic. Gather detailed provenance in a closing section rather than
  repeating it paragraph by paragraph. State assumptions where a reader needs them to
  follow the calculation; never present an illustrative value as a measurement.
- **Confident statements.** Say what things are. Keep "not" for contrasts that prevent a
  real mistake. Mention running-example facts only where they change the lesson.
- **One implementation, general subject.** When one product illustrates a general
  subject, teach the subject's decisions. Explain the mechanism once, then gather where
  other implementations differ in ways that change a decision.
- **Parent and child.** Give a useful answer at this level, and leave the child's full
  treatment to the child. A pointer to the child is one sentence, not a substitute for
  an answer here.

## Prose stands alone

The prose carries the whole explanation. Removing every figure, including captions,
labels and controls, must leave a complete article with no further edits. Write about the
subject, not about the figure. A figure earns its place by making something felt that
prose can only state, such as timing, accumulation, contention or scale.

## Figures

Figures follow the house style in [Figure style: ink and tokens](../../../docs/figure-style.md).
For building, playback and checks, use the [figure guide](references/figures.md).

## Accuracy

Check consequential claims against primary sources, and list them under "Sources and
further reading". Keep observed behaviour distinct from illustration. Claims about engine
behaviour that rest on execution need a run on an owned, disposable instance; see
[database verification](references/database-verification.md). Local builds, previews and
disposable databases are safe: run them, fix what your change breaks and rerun them
without asking.

## Continuity

A collection's example record in `docs/coverage/` fixes the shared facts; for caching it
is `application-caching-2026-10-28-example.md`. Develop scenarios from it, keep names, values and roles consistent, and propose any
extension to the orchestrator rather than inventing a conflicting fact. Familiar figures
should evolve as the explanation develops, keeping roles and visual meanings recognisable.

## Repairs

Treat each finding as a reader's problem, not wording to insert. Make the smallest change
that still reads as one piece: reword, reorder, cut or move material, and restructure when
the problem needs it. Reread the surrounding explanation and every later use of what
changed, and recheck any claim the repair touches. A repair fixes what its findings name;
it does not start a wider restyling.

After substantive prose repairs, reread the whole article in order. Several local fixes
can introduce repetition, defensive asides or a broken transition. This is the repairer's
coherence check; it does not start another independent review round. A bounded factual
or typographical correction needs its affected explanation and later uses checked.

## Done

- For a new or substantially rewritten article, reread the whole piece from the reader's
  starting point, once with the figures omitted. Answer each exit question from the
  article alone and close any gap. A bounded repair checks the affected reasoning and
  exit questions, retaining checks the change does not invalidate.
- For an integrated article, build, then run
  `pnpm check -- --rule=dense-prose --page=<route>`. Reread each flagged sentence in
  place, and rewrite it if a reader would have to read it twice. The counts show where
  to look, not whether the writing works. For a prose-only draft, check by reading and
  record rendered checks as pending; do not integrate solely to obtain them.
- Check new or changed figures against the defect list in the figure style, in both
  themes at desktop and 375 px.

Return an integrated article on its branch, previewed as `AGENTS.md` describes under Delivery,
together with the check results. Note any scope or example changes you propose, and any
limits on the evidence. In a collection, the coordinator arranges review. A standalone
article goes on to the three lenses in [staycurrent-review](../staycurrent-review/SKILL.md),
unless the owner asked for an unreviewed draft. Publication is a separate decision for
the owner.
