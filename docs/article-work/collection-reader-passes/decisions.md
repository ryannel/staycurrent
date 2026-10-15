# Relational collection: findings and revisions

Baseline `afbf6f7`, 15 October 2026. The [commission](commission.md) defines the
nine-page scope: the overview and all eight available articles. Planned articles
were not treated as finished reading.

## Four independent perspectives

- [Blind sequential reader](blind.md): preserved questions and predictions before
  seeing explanations or other findings.
- [Adversarial reader](adversarial.md): tried consequential counterexamples and
  compared the promises of complete and abridged examples.
- [Application practitioner](practitioner.md): followed the examples into decisions
  an application author would need to make.
- [Literary and structural editor](editor.md): examined progression, repetition,
  register, parent/child purposes and media in their reading context.

These are agent readings, not human novice sessions. The independent baseline
was frozen while repairs proceeded. Logs preserve sentence/code/result coverage,
actual figure inspection and interactive states; the reports disclose delivery
limitations and untested branches. The collection contains 36 static teaching
figures and nine interactive models, including a figure reused in two articles.
Figure and control captures are retained; redundant full-page captures were moved
to a temporary archive.

## Implemented decisions

| Finding | Revision |
| --- | --- |
| O14 appears in a result before its visible introduction | Introduced Ada’s empty order before the left join. |
| Pagination export silently returns to an earlier setup | Named the original five orders and required a reset after earlier mutations. |
| Composite foreign-key example clarifies its earlier state too late | Moved the state reset before the claim that O12 has only line 1. |
| Design SQL introduces unfamiliar comparison/cast syntax | Briefly explained `<>` and `::numeric` beside their use. |
| A shortened recovery condition recognises only connection failures | Classified unconfirmed outcomes after possible COMMIT, preserving phase and evidence of rejection. |
| Stock reservation and dependent insertion appear as one script | Split the commands around the handler’s returned-row decision; named new-claim and existing-order branches. |
| Existing-result cleanup differs between main and supporting article | Used ROLLBACK consistently for the attempt that makes no purchase changes, without undoing the committed original. |
| Supporting articles take too long to reveal their additional purpose | Constraints opens with competing checks; Isolation promises its two-connection investigation and cross-row conditional UPDATE. |
| Repeated implementation interrupts representation decisions | Made parent JSON setup optional; kept the child’s completed capacity policy and result visible while moving the exact conversion into a runnable disclosure. |
| Captions and nearby prose repeat qualifications | Trimmed redundant overview caption endings, the repeated control-row explanation, and repeated transaction agency/stock statements. |
| Separate product lines invite a useful cross-article test | Added an optional prediction about two differently priced lines drawing from the same limited stock. |

The new exercise was verified against PostgreSQL through PGlite. It is optional
transfer practice, not a repair for a claimed baseline failure.

## Judgements and retained alternatives

The editor proposed broader reductions to the main articles. We retained their
type reasoning, enforcement, transaction mechanisms and worked counterexamples:
the user commissioned substantial standalone deep dives. The narrower revisions
reduce repeated mechanics and make each child’s investigation more apparent.

The ON-versus-WHERE example stays visible. It explains a consequential change to
left-join meaning before aggregation relies on that meaning; its temporary setup
is already optional. The overlapping-candidate-key note remains optional rather
than gaining another formal example in the main path. An estimated-versus-actual
plan exercise remains a possible topic for the planned query-execution deep dive.

Successful explanations were preserved: historical prices versus current names,
lossless joins, multiplied report totals, guarded writes versus cross-row rules,
and identical missing replies hiding different commit outcomes. Readability did
not require replacing them with summaries or adding new pictures everywhere.

## Skills

Authoring now asks for an explicit execution setting, the starting facts before
their result, and a distinct investigation for a supporting article. Review now
traces response handling and checks that compressed implementations preserve
consequential outcomes. First-reading guidance excludes executable source from
the reader delivery and waits for lazy-loaded pictures before diagnosing them.
Style guidance distinguishes useful caption qualifications from repeated defence.
The [writing reference](../../writing-style.md) preserves concrete before/after
reasoning. Mirrored Claude skills carry the same changes. An independent bounded
skill review found no rigid template or unjustified new requirement.

## Verification

The repair record includes focused PostgreSQL checks, local browser rechecks,
responsive/theme sweeps, internal link checks and skill validation. These verify
specific behaviour and presentation; they do not establish human-level literary
quality. Full multi-session concurrency and transport fault injection were not
rerun: their documented scope remains explicit in the articles and reader reports.
