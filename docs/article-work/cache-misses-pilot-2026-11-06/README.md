# Pilot: Handling cache misses, rewritten with the November skills

Commissioned 6 November 2026 by the owner, to test the restructured skills
(`staycurrent-plan`, `staycurrent-write`, `staycurrent-review`) on one real article
before using them more widely. The background is in the
[5 November process review](../../reviews/process-review-2026-11-05/README.md).

## Commission

- Rewrite **Handling cache misses** to the publication's expert-practitioner standard,
  following the skills as written. Its scope and neighbours are unchanged: see the
  `cache-misses` node in `docs/coverage/application-caching-2026-10-28.yaml`.
- The live article and its figures stay exactly as they are. The pilot article is
  `src/articles/application-caching-pilot/cache-misses.astro`, and new or changed
  figures go in `src/components/application-caching/misses-pilot/`. Preview it with
  `APPLICATION_CACHING_DRAFT_PREVIEW=1 pnpm dev` at
  `/review/application-caching/pilot/cache-misses/`. Normal builds exclude it.
- Figures follow `docs/figure-style.md`.
- Publication is not authorised.
- Coordinator: the main session. Planning, writing, each review lens, each repair and
  each confirmation go to a fresh agent, which reads the skills cold.

## Done

The pilot is done when the plan is complete, the article passes its teach-back check,
accepted critical and medium findings are repaired and confirmed, the preview build
passes, and the owner has the live and pilot versions to compare.

## Findings

| Finding | Decision | Fixed in | Confirmed by |
| --- | --- | --- | --- |

## Observations on the skills

Notes on where the skills helped, misled or were ignored, for the owner's decision on
adopting them.
