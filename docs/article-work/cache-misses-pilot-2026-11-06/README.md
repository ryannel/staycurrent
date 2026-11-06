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

First review of commit 186769d, by four fresh agents:

- teach-back, step 1 (answer) and step 2 (mark): 8 of 10 questions Supported, 2 Thin;
- senior practitioner: no critical findings, 5 medium;
- reader and visual: no critical findings, 4 medium.

The writer's code, run output and simulations are kept in [`evidence/`](evidence/). The
compiled binary is left out.

| # | Finding (lens) | Sev. | Decision |
| --- | --- | --- | --- |
| 1 | Pool scenario misstates what callers see: the database connection limit is reached before any pool wait, and the PostgreSQL 16 refusal for a non-superuser differs from the quoted message (teach-back Q9, practitioner M1) | Medium | Accept. Rework the passage; verify the limit and message on local PostgreSQL 16. |
| 2 | Outage share of full cards: 12% is not reconciled with 2,000 ÷ 20,000 = 10%; two different "12%" figures; no share given once local copies are in place (teach-back Q6) | Medium | Accept. |
| 3 | Stale copies served before the soft/hard expiry split is introduced, with no word on where they live; Figure 4's allowance restarts at store time instead of read time (practitioner M2, reader 2) | Medium | Accept. Introduce the split where stale serving first appears; fix Figure 4. |
| 4 | Lease and timeout sizes fail under the article's own slowdown; no guidance on sizing from tail latency (practitioner M3) | Medium | Accept. |
| 5 | AWS SDK retry quota: 14 tokens per transient retry, not 5 (practitioner M4; noted in teach-back marking) | Medium | Accept. |
| 6 | Two "observed" results are missing from the saved evidence; "all about the same age" is wrong; idle rows omitted silently (practitioner M5) | Medium | Accept. Rerun and save both; correct the text. |
| 7 | Reading effort: about 7,400 words against 3,300–3,500 for neighbours; repeated timelines, arithmetic and advice; tangential asides (reader 1, practitioner length) | Medium | Accept. Cut the named repetitions and asides; aim for about 5,000–5,500 words of reading text without losing any exit-question answer. |
| 8 | Fallback answers for refused callers appear two sections after refusal is introduced (reader 3) | Medium | Accept. Move them to where refusal is introduced. |
| 9 | Rhythm: average sentence about 16 words, timelines read as a march of short declaratives (reader 4) | Medium | Accept. Join steps while cutting. |
| 10 | Lows: deferral phrasing; Figure 3 chips and lease bar; Figure 2 contradiction; XFetch result shown before XFetch; process leaks; Bronson introduced late and cited with the wrong ratio (90%); unit for the allowance; `Card` type; "Exercise" heading level; XFetch "pair with coalescing" claim; Little's law needs a mean; 30 s echo after a cold restart; CROSSSLOT note; rate-advice contradiction; terms (shop north, GBP) | Low | Accept. All are cheap. |
| 11 | Figure 5 shows no cause; its lesson is arithmetic already in the text; heavy controls at 375 px (reader 9) | Low | Accept. Remove Figure 5. |
| 12 | Negative caching of failed fills, from the best-alternative comparison (practitioner) | Low | Accept as one sentence. |
| 13 | Missing counters and adaptive throttling (practitioner) | Low | Decline. Length matters more; Operating a cache owns the counters. |

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
