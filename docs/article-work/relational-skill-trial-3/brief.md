# Skill trial 3 · a00 and a03 · 21 October 2026

Purpose: regenerate **Relational databases** (a00) and **Making concurrent changes correct** (a03) from their plans using the seven skills at `005ab6f`, then review and repair until the review skill ends the run. Working skills match that commit. First recorded run timestamp: 2026-10-21 19:07:45 UTC (setup was already underway; assignment times recorded separately).

## Inputs and isolation

Writers use `docs/coverage/relational-2026-10-19.yaml`, the registry through `src/lib/relational-next.ts`, `docs/coverage/relational-example.md`, all three fixed reference articles, finished children and shared components. They must not read live a00/a03, earlier trial articles/components/records, or earlier reviews of these articles. References to those files inside the authorised example record are context, not permission to open them. Existing example discrepancies are handled against the canonical record.

Every writer, reviser and reviewer is a fresh subagent. An interrupted agent may resume only the same assignment. Workers do not arrange review teams. The coordinator never edits article prose.

Reviewers receive only the inputs listed by their perspective, a fixed version and their starting finding number. They see no earlier version, report or decision. The coordinator matches recurring findings, assigns final severity and records every decision, including findings below the floor.

## Review and delivery

Article mode: practitioner and teaching every full round; editorial and visual in round 1 and again on the candidate ending version. Round 1 repairs critical, medium and low; round 2 critical and medium; round 3 and later critical. Round 3 is the last full round. Subsequent critical repairs receive fresh checks by the perspective that found them, reading repaired passages and their surrounding sections in the whole piece, until they pass. No arbitrary three-round stop. The commissioned two-article batch is an article trial, not a new whole-corpus commission.

Each native verification run has its own disposable PostgreSQL 18.6 cluster/database and unique port. Its owner stops it, including on failure. Record versions, commands and counterexamples. Stop all preview processes started for the run at completion, after showing the pages.

Record assignment start/end/duration and each article's source word count (`wc -w`, matching trial 2) for the initial draft and after each round. Commit pages and records at each round end. Do not push or publish.

## Locations

- Articles: `src/articles/relational-trial-3/{a00,a03}.astro`
- Components: `src/components/relational-trial-3/`
- Review route copied from trial 2: `/review/relational-trial-3/` and `/review/relational-trial-3/transactions/`
- Work, evidence, separate reports and decisions: this directory.
- Final `results.md`: severities by round, repairs, elapsed time, lengths, comparison with trial 2, and quality assessment.
