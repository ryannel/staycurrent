# Relational databases: reviewed plan

**38 articles: one introduction, eight main guides and 29 deeper articles.**
The complete tree passed both local perspectives and all three whole-tree
perspectives after repair. No stubs or fourth article level remain. Article
writing has not started; the next step is discussion with the user.

Read the [outline](outline.md) for article briefs, section titles and contextual
child placements, or the [canonical YAML](../../coverage/relational-fanout-2026-10-19.yaml)
for every heading brief. The [commission](commission.md) is the curriculum input;
previous articles and the stopped proposal were not structural inputs.

| Branch, including its guide | Articles |
| --- | ---: |
| Designing relational data | 5 |
| Working with SQL | 6 |
| Making concurrent changes correct | 3 |
| Building applications around a relational database | 5 |
| Understanding and improving database performance | 5 |
| Changing a live database | 4 |
| Running a relational service | 6 |
| Choosing a relational database | 3 |

The introduction adds one article to these branch totals. These are destinations,
not a compulsory sequence through every child. The root gives a parent-first
working route, problem-driven routes and conditional adoption routes. Each parent
supplies a usable answer before introducing its deeper articles in context.

## Skills and fan-out

The expertise target remains relational databases at every level. Descendants
contribute only the depth needed for that original goal. There is no imposed page
count or article-depth cap; the section-level stopping points are the result of
planning and review.

Builders return drafts and free their slots. The orchestrator fills available
slots with ready builders and independent batch reviewers, keeping the two local
perspectives separate and reusing those reviewer roles. Every article receives
both checks; repairs are returned to builders and rechecked. Three fresh reviewers
then assess the complete tree. No worker starts a nested review team in this run.

Three subagent slots were available. At 20:19 UTC, 30 plans were drafted and 24 had
passed both local checks. The final whole-tree sign-off was at 20:37 UTC, roughly
40 minutes after the tracked root checkpoint at 19:58 UTC. Skill-edit time is
outside that interval. There is no controlled earlier-run timing or reliable
speedup ratio.

## Whole-tree decisions

- Fold incident selection into the operations parent and the PostgreSQL candidate
  record into the chooser. Their distinguishing procedures already have owners.
- Merge plan reading and optimiser diagnosis into one completed slow-query
  investigation. Local reviews had retained two task entrances; the fresh
  whole-tree review identified the cost of interrupting the ordinary diagnosis.
  The merged article preserves statistics and prepared-parameter reasoning in
  seven coherent headings, with uncommon variants conditional.
- Shorten monitoring and sizing to visibility, forecasts, degraded headroom and
  owned alerts. Concurrent-workload diagnosis has one deeper owner.
- Assign local-partition design and lifecycle decisions to the existing topology
  article, with pruning evidence in performance and named live-change procedures.
- Make the newcomer spine, task routes and conditional candidates explicit. Name
  short prerequisites for joins, index evaluation and security response; supply
  local measurement legends without introducing sibling reading loops.

The optional SQLite fold was not adopted: its bounded real-driver/file-ownership,
writer-coordination and recovery checks serve a different deployment question.
The normalisation counterexample remains compact and decision-led. Shared-fixture
and visual suggestions remain available in the initial structure/teaching reports
for the writing stage; they are not unresolved planning requirements or quotas.

## Independent review outcomes

| Perspective | Initial findings | Final recheck |
| --- | --- | --- |
| Completeness and depth | [One ownership gap](whole-tree/coverage-r1.md) | [Pass](whole-tree/coverage-r2.md) |
| Structure, overlap and consolidation | [Three required repairs](whole-tree/structure-r1.md) | [Pass](whole-tree/structure-r2.md) |
| Teaching and flow against the examples | [Two required repairs](whole-tree/teaching-r1.md) | [Pass](whole-tree/teaching-r2.md) |

All required findings are closed. The teaching reviewer read all three fixed
examples and their figures. These are planning passes; article prose, figures and
executed procedures remain part of the later writing commission.

`run-state.json` records queue, batch, folded-node and review status. `nodes/`
preserves assignments and builder results. `batches/` holds immutable review inputs,
findings and repairs. `whole-tree/round-1/` preserves the 39-article complete-tree
snapshot; `round-2/` preserves the reviewed 38-article tree. The former a27 and a33
drafts remain recorded as folded, not active destinations.

## Validation

The tree schema and article paths validate: 38 expanded articles, 352 headings,
three article levels and no stubs. Every active article has paired local-review
records, followed by the three passing whole-tree rechecks. `pnpm build` passed,
including all 13 site rules over 103 pages; public article sources and publication
status were not changed by this planning commission.
