# Consolidating and comparing

Two planners derived the depth of one subject independently, each following `kit.md`
without seeing the site's existing articles. Your job has two phases, and their order
matters. Finish and save phase 1 before opening anything in phase 2, so the existing
articles can't shape the consolidated plan.

## Phase 1: one plan, checked against evidence

Read `kit.md` and both planners' files. Then review the two plans as an expert
practitioner in the subject would, in both directions:

- What does an expert need that both plans missed?
- What did either plan include that an expert doesn't need, or teach in a slower form
  than the part needs (prose where worked examples would teach faster, or the reverse)?
- Where the plans disagree on parts, depth, article count or boundaries, which is right?
  Settle it with evidence: primary documentation, standard texts, how the systems
  actually behave. Use web search and fetch where a judgement depends on a fact.

Then give every part a **layer**. The aim is progressive depth: a reader gets the broad
model first and can drill down as far as they need, and every layer is a sound place to
stop.

| Layer | What the reader gets | Where it usually lives |
|---|---|---|
| 1. The model | What the thing is, what it's for, the picture to hold in mind, its main cost or trade-off | A paragraph in the collection introduction, then the article's opening |
| 2. The working mechanism | Enough to predict behaviour and make the everyday decisions | The deep dive's body |
| 3. The expert's cases | Corner cases, failure modes, operations, diagnosis | Later sections or companions |
| 4. Product specifics | How one engine or tool does it differently | The product series, or a short note where it changes a decision |

A reader who stops after any layer should hold a simplified model, not a wrong one;
note any simplification that a later layer would have to undo. Each layer builds on the
one above it rather than re-telling it. Mark lookup material, such as a syntax table,
as **reference** rather than a layer: readers consult it rather than read through it.
A shallow subject may have only two or three layers.

Write the consolidated plan to `derived/<subject>-consolidated.md`, in the shape `kit.md`
asks for, with the coverage map carrying a layer column. Add two sections:
**Where the planners disagreed and how it was settled**, and **What layer 1 must say**,
a short statement of the model a reader should hold if they stop after the opening.

## Phase 2: compare with the existing articles

Only now open the existing articles. The text extracted from each built page is in
`existing/`; the reading times the site shows are given in your instructions. Figures
are drawn by components and mostly don't appear in the extracted text, so read the page
source and its components where you need to know what a figure shows.

Compare part by part with the consolidated plan:

- **For each part:** is it taught at about the depth it needs, deeper than it needs (say
  what could go), thinner, missing, or in a slower form than necessary? Is it at the
  right layer and in the right place, or does detail arrive before the model it depends
  on?
- **Layer 1:** does each article's opening give the model your plan says layer 1 must
  say, before the detail?
- **Material that serves no part of the plan:** outside the subject, re-teaching a
  neighbour, or depth beyond need. Estimate the words involved.
- **Reading time:** the existing articles against your plan.
- **Accuracy:** claims you notice that look wrong or overstated, checked against primary
  sources. Note them; this is not a full fact check.
- **Verdict:** keep as it is, targeted cuts and additions, restructure, or rewrite, and why.

Write this to `derived/<subject>-comparison.md`. Don't edit the articles or anything
outside `derived/`.
