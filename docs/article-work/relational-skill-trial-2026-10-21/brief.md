# Skill trial 2 · regenerate a00 and a03 · 21 October 2026

Purpose: test the skills as committed in c369af1 (staycurrent-revise and staycurrent-continuity added; every assignment goes to a fresh subagent) by regenerating the same two articles from their plans, then reviewing them with fresh reviewers in every round.

| Article | Live draft | Trial 1 (20 October) | Trial 2 |
| --- | --- | --- | --- |
| a00 Relational databases | /review/relational-next/ | /review/relational-trial/ | /review/relational-trial-2/ |
| a03 Making concurrent changes correct | /review/relational-next/transactions/ | /review/relational-trial/transactions/ | /review/relational-trial-2/transactions/ |

## Rules of the run

- Every writer, reviser and reviewer is a new subagent. No agent is continued into a later round.
- Writers work from the plan (`docs/coverage/relational-2026-10-19.yaml`, the registry in `src/lib/relational-next.ts`), the example record (`docs/coverage/relational-example.md`), the reference articles, finished child articles and shared components. They do not read the live a00 or a03, either trial-1 page or component folder, or any earlier work record for these two articles.
- Each review round is a full review: all four article perspectives, the whole of both pages, every check. Reviewers see no earlier version, report or decision. The coordinator matches findings across rounds.
- Repairs go to a fresh writer with staycurrent-revise. The coordinator does not edit article prose.
- Stop when every perspective passes both articles, or after three review rounds, whichever comes first.

## Differences from trial 1 to keep in mind

The example record now exists and was written from the trial-1 pages, so the writers start from a settled cast and rows rather than choosing their own. Trial 1's rechecks reused reviewers, so its pass counts are not comparable; its first-round (d01) counts are.

Files: `src/articles/relational-trial-2/`, `src/components/relational-trial-2/`, this folder. Nothing in the live collection or trial 1 changes.
