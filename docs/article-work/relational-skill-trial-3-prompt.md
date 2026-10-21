Run skill trial 3: regenerate a00 "Relational databases" and a03 "Making concurrent changes correct" from their plans with the skills as committed in 005ab6f, then review and repair them until review ends. Act as the orchestrator in `staycurrent-orchestrate` and follow `staycurrent-review` as written, including its severity levels and the floor that rises each round.

Set up the run like trial 2 (`docs/article-work/relational-skill-trial-2026-10-21/brief.md`), with new paths:

- Articles in `src/articles/relational-trial-3/`, components in `src/components/relational-trial-3/`, a review route at `/review/relational-trial-3/` copied from the trial-2 route, and records in `docs/article-work/relational-skill-trial-3/`. Write a short `brief.md` there first.
- Writers work from the plan (`docs/coverage/relational-2026-10-19.yaml` and the registry), the example record (`docs/coverage/relational-example.md`), the three reference articles, finished child articles and shared components. They must not read the live a00 or a03, either earlier trial's pages, components or records, or any earlier review of these articles.
- Every writer, reviser and reviewer is a fresh subagent. Never continue an agent into a later round. If an agent is interrupted mid-assignment, it may be resumed for that same assignment only.
- Reviewers see no earlier version, report or decision. Give each its starting finding number. You match findings across rounds, set each finding's severity, and record every decision, including findings left below the round's floor.
- Repairs go to fresh writers with `staycurrent-revise`. Do not edit article prose yourself.
- Each native verification run uses its own disposable PostgreSQL 18.6 database and port. Stop everything you start.

Record the time each assignment takes and the word count of each article after every round, and at the end write `results.md`: findings by severity and round, what each round repaired, how long the run took, length, and a comparison with trial 2 (`docs/article-work/relational-skill-trial-2026-10-21/results.md`). Then show me both pages and give me your honest view of their quality.

Commit the records and pages at the end of each round. Do not push: pushing to `main` deploys the site.
