# Prose independence: completed review and repair

Completed 30 October 2026. All nine application-caching articles and all 59
relational articles were reviewed, revised and independently reread in full with
their diagrams and animations removed. No accepted substantive finding remains
open. The correction applies to the two existing published collections.

## What the review established

The user's concern was supported. The former writer instruction, “Let the
illustrations carry the article's central explanation”, encouraged the wrong
division of work. Some articles already contained complete explanations but
framed them as tours through controls or numbered figures. Others omitted
necessary request traces, costs, identities, input relations or outcomes because
the illustration supplied them. Replacing a figure reference alone would not
repair those omissions.

The new standard puts the complete explanation in the prose. Diagrams and
animations reinforce it. Removing them, including labels, captions and controls,
must require no changes to the article's explanation. Worked examples still
matter: the prose supplies the facts and reasoning needed to follow them without
transcribing every visual detail. SQL and ordinary textual tables remain useful
forms of technical explanation.

The writer, revision, continuity, figure and planning skills now follow that
standard. The review entrypoint and its teaching, editorial and visual
perspectives give reviewers the same removal test. `AGENTS.md` makes the shared
expectation explicit. The three preserved reference articles remain writing
examples; their use no longer overrides the complete-prose requirement.

## Coverage and repair records

| Scope | Initial full review | Repairs | Independent final full read |
| --- | --- | --- | --- |
| Nine caching + ten CockroachDB articles | [Baseline](reviews/baseline-caching-crdb.md) | [Repairs](repairs-caching-crdb.md) | [Confirmation](reviews/confirmation-caching-crdb.md) |
| Seventeen PostgreSQL articles | [Baseline](reviews/baseline-pg.md) | [Repairs](repairs-pg.md) | [Confirmation](reviews/confirmation-pg-core-eight.md) |
| Twenty-four general relational articles | [Baseline](reviews/baseline-core.md) | [Repairs](repairs-core.md) | [Confirmation](reviews/confirmation-core.md) |
| Eight further general relational articles | [Baseline](reviews/baseline-core-eight.md) | [Coordinator repairs](repairs-coordinator.md) | [Confirmation](reviews/confirmation-pg-core-eight.md) |

The confirmation readers switched assignments and did not confirm their own
repairs. They read the actual built article bodies with all 317 figure elements
and two additional standalone image containers omitted. Captions and controls
inside those containers disappeared too. The first extraction exposed the two
standalone images; their affected articles were checked with the stronger
removal boundary. Rendered code/SQL and ordinary tables were retained. Source
hashes, captured inputs and individual judgements are kept with the reports.

The largest worked-example repairs include caching costs, retention and misses;
relational decomposition and normalisation; values and time; application/query
work; and several distributed recovery protocols. Many other passages needed
subject-led transitions rather than a new technical treatment. Useful existing
explanations were retained throughout the complete reread.

Final independent reads found an undefined querying-server label in
`pg-distribution` and a customer-ID table labelled as order IDs in `query-results`.
Both were repaired and confirmed. A small ambiguity in the versioned-fill lab
summary was also clarified: the delayed reader holds revision 1 while replacement
B has reread revision 2. Those three changes were checked in their local
explanations after the final rebuild. Unaffected full reads were retained.

## Technical and rendering checks

- Targeted primary-source checks and exact example calculations are recorded in
  the repair reports. Model premises were recovered from their implementations;
  numerical outcomes were not retained over invented replacement inputs.
- The CockroachDB index-backfill check corrected the explanation of temporary
  capture and later merge. Its optional animation now labels its compressed
  one-index depiction in its caption and text alternative. This bounded change
  was independently confirmed against the primary source and checked rendered.
- An Astro-AST comparison over all 68 article sources confirms unchanged
  frontmatter/imports, component invocations, SQL listings, static figure blocks,
  scripts, styles and preformatted code. The separate animation-module change is
  limited to that caption/text alternative; its drawing function, timing,
  geometry and controls are unchanged.
- `pnpm build` passes: 139 pages built, with the required site check over 114
  pages and 14 rules. The 36 remaining dense-prose warnings are in 16 pages
  outside the two commissioned collections. A complete dense-prose check lists
  no page in either corrected collection.
- All seven skills validate with the installed skill validator. `git diff
  --check` and the changed animation module's JavaScript syntax check pass.
- Browser spot checks covered the revised normalisation prose at desktop width,
  phone width 375 px in dark theme, caching prose/comparison controls at phone
  width, and the clarified index caption at phone width in light theme. No page
  overflow was present in those checks. Selecting nineteen hits gave the stated
  3.15 ms mean and 2 ms p95. Index pause changed to Resume; keyboard Replay
  restarted it and retained focus. The temporary viewport override was reset.

The existing native database and lab evidence remains applicable where its code,
data and environment are unchanged. This commission did not rerun every native
experiment or independently operate every unchanged animation. New substantive
technical assertions received targeted source checking; conceptual schedules
remain conceptual. Prior unaffected mechanical and visual checks are retained.

## Reproducing the removal view

From the repository root, after a current build:

```sh
node docs/article-work/prose-independence-2026-10-30/export-rendered-prose.cjs
```

This writes the 68 readable text exports and their manifest to
`/tmp/staycurrent-rendered-prose/`. It is a review utility, not a site feature.
The [final manifest](final-manifest.json) records delivered source, built-page and
text hashes. Rebuilding after the three final corrections changed exactly their
three prose exports; the other 65 retained identical text. The caption change
remained inside the omitted visual and therefore changed no prose-only export.

The user's pre-existing modelling/discount wording and matching shared-example
fact were carried forward in this reviewed article work. The discount is still
an independent scenario, rather than an alteration of the starting shop records.
Other pre-existing work is outside this delivery. No routes, publication states,
article ownership, native downloads or running-example identities were changed.
