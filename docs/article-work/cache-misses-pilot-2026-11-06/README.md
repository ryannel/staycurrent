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

## Plan decisions

The plan was written by a fresh agent with `staycurrent-plan`. It comprises the
[dossier](../../coverage/application-caching-2026-10-28-dossier.md), ten exit questions on
the `cache-misses` node of the tree, and a production-scale section in the example record.
The coordinator spot-checked the Redis 8.4 `DELEX … IFEQ` claim against redis.io. The
planner's open questions were decided as follows:

1. **Batching distinct misses** into one source query: a short section in this article,
   because it is a miss-handling decision.
2. **Lookup fan-out** (40 sequential GETs against MGET): out of scope for this article. It
   belongs to Caching with Redis, so it is not added here.
3. **Naming:** the backend processes are `Server A`/`Server B`, as in the example record,
   not the tree's older "App A".
4. **Exit questions on the index stub:** out of scope for the pilot.
5. **Production-scale example facts:** agreed for the pilot only, as marked in the record.
6. **"Fail at Scale"** is cited through the SRE book, because the original could not be
   reached.

## Findings

| Finding | Decision | Fixed in | Confirmed by |
| --- | --- | --- | --- |

## Observations on the skills

Notes on where the skills helped, misled or were ignored, for the owner's decision on
adopting them.

- **Plan, helped.** The dossier sections led the planner, unprompted, to almost every gap the
  5 November review had found: XFetch, Facebook's leases and gutter pool, metastable
  failure, real incidents, real output and code. It also found items the review had
  missed: retry amplification, the 1/(1 − hit ratio) loss multiplier and Redis 8.4's
  owner-checked commands. "Material, not scope" stopped the live text anchoring it.
- **Plan, misled.** The worked exit questions in the skill are about this very article,
  so they anchored the planner. Two assume a topology that this collection does not
  have. Fix: use another subject for the worked example.
- **Plan, unclear.** The skill gives no label for real runs with modelled durations, no
  length for a one-article dossier, no step for when a brief is narrower than expert
  practice, and nothing on how "realistic scale" fits an existing toy example.
- **Tools.** The fetch tool failed for several hosts that the shell's proxy reached. The
  skills could note that agents may fetch sources with `curl` through the proxy.
