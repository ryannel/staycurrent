# Skill workflow verification, 19 October 2026

The active workflow is orchestrate → breakdown → review → write → review.
This change replaces the previous skills; their canonical sources are archived
under `docs/history/skills-before-2026-10-19/`.

## References

The three reference articles are preserved from `edde22d`. A source comparison
confirmed that only provenance comments, import paths and internal link targets
changed. Their existing figure components and models also match that revision.
The preview build passed the site check. Browser checks confirmed that all three
pages render, the Indexes scan advances, and changing Storage's row size updates
the page capacity and drawing.

## Repository checks

- All four skills pass the skill validator.
- The `.agents` and `.claude` skill directories match; their links resolve.
- The normal build passes all 13 site rules on 103 pages and excludes reference
  preview routes. The preview build passes on 106 pages.
- All 16 site-check tests pass.
- Existing public article, component and model sources are unchanged.

## Workflow trial

A fresh orchestrator was given a partial Transactions tree with one unresolved
recovery child, and commissioned for planning only in a temporary directory.
This tests recursion, independent worker reviews, repair and whole-tree review.
It does not test the writer or establish the quality of a finished article.

Each article was planned by a separate worker and passed practitioner and
reader/editor reviews after repair. The root returned its child without headings;
the next worker supplied them. The assembled YAML uses singular `heading` and
`nested_article`, placing the expanded child under its introducing heading.
Teaching reviews improved concrete state comparisons, made the unsafe
counterexample clear, specified useful controls for the recovery schedule and
made the practice exercise easier to find.

The final tree has two articles, 17 headings and no unresolved stubs. All three
whole-tree perspectives passed without required repairs. Non-blocking writing
notes concern avoiding a duplicated procedure, making whole-procedure practice
easy to find, and qualifying intent comparisons against retained records.

The orchestrator used its judgement to review an already-partially-planned root
before expanding the child; resuming such a tree is not explicitly prescribed.
No blocking workflow ambiguity arose. The trial outputs remain at
`/private/tmp/staycurrent-skill-trial/` for inspection during this session.
