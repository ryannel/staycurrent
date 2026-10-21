# Run ledger

Base repository version: `009a95a1e1d4f5f20f36e091de5da1d24d71b048`; working tree clean before setup. `git diff 005ab6f HEAD -- .agents/skills` is empty. No skill files changed for this trial.

The coordinator read trial 2's brief and results for setup/comparison. Fresh writers received no inherited conversation; their prompts explicitly prohibit previous a00/a03 articles, components and reviews. All workers are fresh per assignment.

Preview: `RELATIONAL_DRAFT_PREVIEW=1 STAYCURRENT_REFERENCE_PREVIEW=1 pnpm dev --host 127.0.0.1 --port 4333`. Initial sandbox bind failed with EPERM; escalated start succeeded. Coordinator owns this process and will stop it at completion.

Native PostgreSQL installed: `/opt/homebrew/opt/postgresql@18/bin/postgres --version` → PostgreSQL 18.6 (Homebrew). Writer-a00 port allocation starts 56130; writer-a03 starts 56140. Additional runs increment ports and use new clusters/databases.

## Measurement

Assignment records supply UTC start, end and elapsed time. Source word counts use `wc -w src/articles/relational-trial-3/{a00,a03}.astro`: this exactly reproduces trial 2's final 6,732 / 8,812 counts, including Astro markup but excluding component text. Counts describe a comparable source metric, not total rendered reading length. Round records include both input and repaired-output counts. Wall time uses the first recorded run timestamp, 19:07:45 UTC, and is explicitly a small underestimate of total setup time.

## Setup decisions

- This is the same two-article trial as trial 2, using article-mode review rather than reopening the whole collection's corpus review.
- a00 writer found a planned distribution child absent from the registry. The root will give its high-level explanation and point at existing operational depth; proposed tree changes stay in the work record, outside this controlled regeneration.
- Existing children disagree with the canonical example. Writers follow the authorised example record, summarise child mechanisms without copying their conflicting cast, and record differences.

## Trial 2 comparison baseline

Trial-2 results state it stopped at three rounds without a full pass. Source counts verified from its commits:

| State | a00 | a03 |
| --- | ---: | ---: |
| Initial draft `b5586b8` | 6,265 | 8,146 |
| After r01 repair `a6e6a33` | 6,579 | 8,536 |
| After r02 repair `6ca25b8` (r03 input/final) | 6,732 | 8,812 |

Trial 2's first draft commit is 2026-10-21 05:51:56 UTC and final review/results record `2a616a1` is 08:03:18 UTC: 2 h 11 m 22 s between them. That is **not** total run time: drafting preceded the first commit and no complete assignment timings were recorded. Its required/optional labels predate this trial's three severity levels; do not retroactively treat them as directly comparable severity counts.

## Baseline freeze and preflight

Initial coordinator build compiled but found two h3 figure titles in a00. Its original writer corrected them before independent review. Subsequent full builds passed all 13 rules. Baseline-build.log records coordinator build success.

The introduction writer declared freeze, then made final continuity edits while finishing its record. The draft01 SHA manifest detected the changed article (3,749 → 3,752 source words). Two just-dispatched review assignments were cancelled without using findings; replacement reviewers are fresh and see only the final committed draft02. Cancelled assignment time remains part of run cost. No coordinator prose edits.

Coordinator browser checks: all six a03 and both a00 option endpoints exercised by keyboard; focus remained Next at endpoints. a03 Play advanced 1/5→2/5 with holds 4,845ms and 6,780ms; Pause worked. At 375px, both pages have document scroll width375 in light/dark; wide real-column tables scroll within their own containers. The visibility capability returned false even after requesting a visible panel; screenshots and DOM/timer checks are recorded as hidden-pane checks, not observed foreground playback. Article context shell links remain the copied trial2 layout's links into the existing full draft collection; prose links connect both trial3 articles.

## Initial assignments

| Assignment | Fresh agent | Start UTC | End UTC | Elapsed |
| --- | --- | --- | --- | --- |
| Write a00 | write_a00 | 19:08:34 | 19:22:40 | 14m06s |
| Write a03 | write_a03 | 19:08:47 | 19:21:34 | 12m47s |
| Withdrawn practitioner review | r01_practitioner | 19:22:33 | 19:23:24 | 51s |
| Withdrawn teaching review | r01_teaching | 19:22:46 | 19:23:35 | 49s |

Withdrawn practitioner had read both articles and some plan/evidence inputs, but started no native servers/processes. Withdrawn teaching read a00 and part of a03/reference inputs; its hidden tab disappeared at interruption. Neither wrote a findings report. Neither is reused. The accepted r01 assignments are fresh `r01_practitioner_fixed`, `r01_teaching_fixed`, `r01_visual`, and a subsequently dispatched fresh editorial reviewer, on commit `80276a4`.

Review input isolation: practitioner receives pieces, plan/context, example and primary sources/evidence; teaching receives pieces, all three reference articles/figures and plan/context; editorial receives only rendered pieces, audience and all three references; visual receives only rendered pieces, rendered reference figures and figures skill. Each starts its own finding sequence at1. Their prompts prohibit any earlier version/report/decision and other perspectives' reports. All subagents start with no inherited conversation.


## Final outcome

Round 3 ended at the critical floor with no critical findings. No source changes followed round 2. Final decisions/results and all assignment timings are recorded. Preview stopped at 20:15:38 UTC; disposable native clusters removed. All delivery commits are local; no push.
