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

### Repair and confirmation

A fresh agent repaired findings 1–12 in commit `e73bf54`. Reading text fell from about
7,400 to about 5,700 words, every exit question is still answered, and Figure 5 was
removed. The new evidence is under `evidence/`. That includes the connection limit
observed on PostgreSQL 16: an ordinary role is refused at the 98th connection with
"remaining connection slots are reserved for roles with the SUPERUSER attribute".

Two fresh checks followed:

- **Teach-back, rerun from scratch.** One agent answered from the repaired text alone and
  another marked the answers. All 10 questions were Supported (8 of 10 before repair),
  with the arithmetic rederived and the PostgreSQL and AWS figures checked against their
  documentation.
- **Informed confirmation.** One agent confirmed each finding against its fix and read the
  whole article for seams. All 12 accepted findings were confirmed, with no new critical
  or medium problems.

Review is therefore done, as the review skill defines it. These low findings stay open as
optional polish:

- **N1.** A leftover phrase, "recomputed for 30 instances", in the 20-instance pool
  scenario.
- **N2.** Soft and hard limits are defined a second time in the refresh section.
- **N3.** "66% plus 7%" is followed by "about 72%" (unrounded, 65.7% + 6.7%).
- **N4.** "Metastable failure" is used before its definition.
- **N5.** Figure 3's "2 computations" label sits beside the overlap rather than on it at
  desktop width.
- **Question wording.** Exit question 6 could say "with no local copies".
- **Code note.** A one-line note on the per-process caps for keys and waiters would help
  near the Go code.

## Comparison with the live article

The same two-step teach-back ran on the live article, which was written with the earlier
process. A fresh agent answered from its text alone, and a separate agent marked the
answers with the same rules.

| Mark | Live article | Pilot |
| --- | --- | --- |
| Supported | 2 (Q3, Q9) | 10 |
| Thin | 5 (Q1, Q2, Q4, Q6, Q7) | 0 |
| Unsupported | 3 (Q5, Q8, Q10) | 0 |

**Caveat.** The exit questions were written for the pilot's plan, and some of them use
its production-scale example, which the live article never introduces. That
disadvantages the live article on Q1, Q2 and Q6.

**The gaps the marker found are about content, not example facts:**

- no rule to estimate with (arrival rate × fill time, when a lease pays off, a retry
  budget);
- no code;
- no XFetch;
- no popularity model;
- no name for metastable failure;
- no guidance on where retries belong, which the live article's own cited Amazon source
  gives.

**Costs.** Reading text grew from about 3,100 words to about 5,700 (11 to 22 minutes).
Producing the pilot took one planner, one writer, four first-review agents, one repairer,
three confirming agents and two baseline agents. That is more agent work than the old
process used for an article.

## Publication

The owner authorised publication on 6 November 2026. The pilot replaced the live article
at `src/articles/application-caching/cache-misses.astro`. Its figures moved to
`src/components/application-caching/cache-misses/`, and the preview-only pilot route was
removed. The previous version remains in git history. The open low findings above are
unchanged.

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
- **Write, helped.** Reading the article with every figure removed, the dense-prose check on
  one page, and the voice guide's weak and strong pairs all helped. The writer produced
  real output, run code and six figures in the house style.
- **Write, unclear.**
  - The skill points to `AGENTS.md`, but Claude reads `CLAUDE.md`.
  - The figure-style colour tokens are not defined site-wide.
  - The shared drawing library still draws glossy tokens.
  - `MotionFigure` cannot load figures from new folders without a shared-code change.
  - Most of the figure work went on label collisions that an automatic overlap check
    would catch.
- **Write, length.** The first draft ran to 7,400 words. Nothing in the skill weighs the
  expert content it asks for against reader time, and only review caught it. Plan or
  write should set a length budget from the exit questions and neighbouring articles.
- **Repair, misled.** "Make the smallest change that still reads as one piece" does not fit
  a repair that must also cut 25%; it took three passes. The skill also gives no
  definition of "reading text" for word counts.
- **Voice and density pull against each other.** The voice guide's 27–28-word sentences
  conflict with the dense-prose check, which capped the rise at about one word a
  sentence. One of the two should give way.
- **Review, helped.** Two lenses independently caught each of the three biggest
  problems. The teach-back separated "reads well" from "teaches the answer": two questions
  failed on a fluent first draft. The practitioner lens's best-alternative question gave a
  clear verdict ("would send a new hire here instead") and surfaced negative caching.
- **Review, process.** The skill says findings are recorded, but the full lens reports are
  long. The coordinator kept a findings table here and put the detailed repair brief
  outside the repository.
