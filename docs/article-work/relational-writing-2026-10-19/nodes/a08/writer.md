# a08 writer handoff

Status: ready for orchestrator promotion and independent review.

## Ready files

- `docs/article-work/relational-writing-2026-10-19/nodes/a08/article.astro`
  (staged content fragment; imports resolve from final src article location).
- `src/components/relational-next/a08/BoundaryFigure.astro`
- `src/components/relational-next/a08/CostFigure.astro`
- `src/components/relational-next/a08/GateFigure.astro`
- `src/components/relational-next/a08/verify.py`
- `src/components/relational-next/a08/observed.json`
- `docs/article-work/relational-writing-2026-10-19/nodes/a08/sources.md`

No shared edits, final src fragment, commits or nested reviewers. No build run;
fixed review output left untouched. No own server instance was started. The only
own databases were cleaned up; the shared PostgreSQL server remains unchanged.

## Teaching and scope

One shop reservation case gets a full requirements brief, relational-fit reasoning,
concrete process/failure boundary rejection, native PostgreSQL candidate record,
responsibility/cost comparison, acceptance observations and a dated decision with
stop criteria and owners. The outcome is deliberately evidence-limited: adopt the
observed prototype; reject its single-host topology for production; defer managed
production adoption until its exact config and hard gates are established.

Three figures: four-step boundary walk with embedded/server/distributed variants;
operator-time cost model; requirement changes that alter the shortlist. Boundary
comparison preserves the selected step, pauses playback, and keeps endpoint buttons
focusable using aria-disabled rather than disabling or moving focus. Playback waits
at least 8 s and otherwise narration word count at 170 wpm plus 3 s comparison
time. Phone comparisons stack; controls wrap with 44 px targets. All figure facts
also remain available as static text. No h2/h3/h4 inside figures.

Conditional child boundaries preserved. Embedded loaded-library/WAL checks and
distributed topology/tier/locality/retry deep evaluation remain with the actual
SQLite and CockroachDB plans. PostgreSQL selection evidence remains here, linked
to common SQL, transaction, application, performance, operations and evolution
owners. No tree changes proposed.

## Checks completed

- Read all three fixed example articles and their figure material; inspected live
  sequence, composite-index and WAL preview figures on dev4337.
- Native Python/psql bounded acceptance checks passed; see observed.json and sources.
- Astro compiler transform passed for staged article and all three Astro figures,
  no error diagnostics.
- All static relational-next links match registry destinations.
- Every planned a08 heading anchor is present.
- Cost arithmetic and break-even calculated directly; allowances labelled invented.
- Consequential product/deployment/licence statements checked against primary sources
  with dates/conditions; no current supplier prices or unperformed tests asserted.

## Central review requested

After promotion, root owns full build/site check and desktop/phone/light/dark browser
proof. Exercise the three boundary variants at first/last steps, keyboard endpoint
focus, long narration pacing and comparison reset; move the cost range; change all
three requirement cases. Confirm no overflow at 390 px, table scroll accessibility,
and review that the complete first decision is useful despite honest production
deferral. No observed production capacity or recovery is claimed.

## Root repair, 20 October 2026

Qualified the claim-statement outcome after b06 practitioner finding a08-P1. With stock exhausted, a repeated request gives the INSERT no input and returns `INSERT 0 0`, without a uniqueness check; a claimed row that collides does raise 23505 and rolls back its decrement. Existing-request argument/outcome resolution is required before response classification. The independent b06 report retains that additional native observation. SQL, models, retained acceptance JSON, evidence limits and adoption decision are unchanged.
