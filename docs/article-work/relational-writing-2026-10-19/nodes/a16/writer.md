# a16 writer handoff

Status: draft ready for orchestrator review and central browser proof.

## Deliverables

- Staged article: `nodes/a16/article.astro`.
- Components: `src/components/relational-next/a16/WindowFigure.astro`,
  `model.mjs`, `queries.mjs`, and downloadable `experiment.sql`.
- Evidence: `sources.md`, `verify.mjs`, `native-results.txt`, `verification.txt`,
  `compile.txt` and `whitespace.txt` in this node directory.

The article keeps all eight commissioned section anchors, uses the registry URLs
for its parent/siblings/performance links, and imports components relative to its
eventual final article location. It does not write the final src article path.
No child articles or tree changes are proposed.

## Teaching and scope

Two hand-calculated datasets support latest events, fixed-count and tied top
items, shares, running/moving values and predecessor comparisons. Seven figures
let the reader inspect partitions while changing final order; compare rank
definitions at cutoffs one/two; move amount filtering; change the share
denominator; inspect peer-inclusive versus event frames; compare record-count
and date-distance frames; and distinguish an absent predecessor from a present
null. Each figure keeps its rule, contributing rows, result and explanation
visible together. The final exercise composes ranking/shares/history without
turning the article into a function catalogue.

The parent owns basic windows and staging; this article assumes those sections.
Joins/grouping, expression/time meanings, general composition and performance
mechanisms stay with the actual existing owners and are linked in context.

## Verification

- Native PostgreSQL 18.6: 17 result sets checked against explicit expected values;
  every set repeated after reverse insertion order. Test database removed.
- Native/model agreement and all 78 figure states passed.
- Both Astro files compile with zero diagnostics through the installed compiler.
- Whitespace checked on every owned file, including untracked output logs.
- No full build was run; immutable review previews remained unchanged.
- No shared source files, Git index, commits or pushes were changed.

Two verification harness issues were corrected before the successful run:
PostgreSQL 18 locale was read from pg_database.datcollate rather than an obsolete
lc_collate setting, and JSONB aggregation avoided multiline JSON result records.
These were harness errors, not failed article query outcomes. Each attempt's
database was removed by the finally block.

## Central browser proof points

After root copies the staged article to `src/articles/relational-next/a16.astro`:

1. Check all seven figures on phone and desktop in light/dark themes. Comparisons
   are stacked rows in one table; there are no article-section margins inside.
2. For partition, reverse final order after inspecting event 6: totals stay 25/7.
3. For rank, compare Two rows / Rank ≤ 2 / Dense rank ≤ 2, then One row / Rank = 1.
4. For filter, use step 3: after keeps event 6, before keeps 3 and 6.
5. For share, inspect A: whole denominator 110 versus ordered denominator 40.
6. For frame, stop at event 2: ROWS total 10 versus peer total 30; event 3 is
   included under the latter despite being the next displayed row.
7. For moving, step 4: three rows 110 versus three dates 90; at step 3 the Jan 2
   boundary is included in the 60 interval total.
8. For LAG, compare default at event 1, then event 3: present NULL remains NULL.
9. Keyboard Back/Next at both endpoints should retain focus; scrub/select should
   pause playback and retain the chosen inspection step.
10. Record the worksheet link's generated URL and check its bytes externally.
    Do not click/download it through browser automation: the parent warned that
    a download event can stall proof. The asset import is `experiment.sql?url&no-inline`
    and the requested download filename is `related-rows.sql`.

Writer releases this assignment for orchestrator-managed review; no nested team
or independent review was started.
