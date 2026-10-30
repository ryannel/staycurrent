# Prose independent of diagrams and animations

Commissioned 30 October 2026. Review the writing in all nine application-caching
articles and all 59 relational articles, update writer and reviewer skills, then
repair the articles through a full reread and substantial rewriting where needed.

The prose must explain the subject without its diagrams or animations. Removing
them, including their labels, captions and controls, must leave a coherent and
complete article without further prose edits. Illustrations reinforce the
explanation. This is a reader test, not a ban on worked examples or a requirement
to transcribe every visual detail. Code and ordinary textual tables remain useful
forms of technical explanation.

## Scope and ownership

Baseline source hashes and the starting commit are in `baseline.json`. Review
records name every article read and give concrete findings. First review coverage:

- Caching/CockroachDB reader: nine caching articles, ten CockroachDB articles, plus
  an independent read of eight general relational articles owned by the coordinator.
- PostgreSQL reader: all seventeen PostgreSQL articles.
- Core reader: the other twenty-four general relational articles.
- Coordinator: accepts findings, updates skills, repairs the eight general articles,
  integrates work, owns the build and rendered checks, and follows collection routes.

The eight coordinator-owned articles are relational-introduction, data-modelling,
normalisation, hierarchies, history, constraints, values and query-results.

The user had already edited `data-modelling.astro` and its shared example record.
Preserve those changes. A copy of the original diff is retained locally at
`/tmp/staycurrent-prose-independence-user-edits.patch`. Other pre-existing work is
outside this commission. Article files outside the two current published
collections, archived references, routes and publication status are not changed
merely to support this review.

## Repair and completion

Read each complete article; keyword scans only supplement that reading. Replace
scene directions with the subject's reasoning. Introduce every fact needed for
an example, explain cause and outcome, and retain conditions that affect the
reader's decisions. Preserve technical scope and the shared shop facts. Verify
materially expanded technical claims against primary sources; retain applicable
native evidence for unchanged mechanisms and downloads.

After repairs, different readers check the complete prose with diagrams and
animations omitted. Check substantial rewritten arguments and the affected
technical claims, rather than treating a removed figure reference as proof of
completion. Reuse unaffected mechanical evidence. Inspect affected pages with
figures present to confirm prose and media agree, and run the required build and
dense-prose checks. Record article coverage, accepted findings, confirmations and
material limits. Fixing existing published articles is the requested work; the
commission does not create new article destinations or change availability.
