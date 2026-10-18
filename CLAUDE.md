# Stay Current

Understand engineering choices and follow the changes that matter. A static Astro publication. Read `README.md` for the layout and `docs/site-direction.md` for the agreed content plan. The website covers engineering fields, with a site-wide overview. Databases and storage is the first field, with its guide and linked articles; other fields remain planned coverage. The column-store essay now lives under `/learn/databases/column-stores/` and remains a teaching reference alongside the relational collection.

## House voice

Every word written here, from articles and changelog entries to commit messages and chat replies, follows the `staycurrent-style` skill in `.claude/skills/staycurrent-style/`. Load it before drafting anything longer than a sentence.

## Research runs

`.claude/skills/staycurrent-research/` guides research and assessments. The site currently has no updates feed. Researching and drafting do not imply permission to publish. Keep planned coverage distinct from available reading.

## Article production

Read `docs/content-structure.md` when planning coverage. Use
`.claude/skills/staycurrent-planning/` for collections and reader journeys,
`.claude/skills/staycurrent-authoring/` for substantive article creation and
`.claude/skills/staycurrent-review/` for independent review and repair. These skills
explicitly call for reviewer subagents. Each collection keeps one coverage map in `docs/coverage/`;
briefs point into it and handoffs report changes to it. Keep family coverage
distinct from the scope of one article, and keep the shared distributed-systems
idea parked.
Agent review can complete a draft without routine human editing; it does not
authorise publication.

## Checks

```bash
pnpm install
pnpm build          # builds every page, then runs the site check
pnpm check          # the site check in full: every issue, by rule
pnpm test           # the site check's own tests
pnpm dev            # http://localhost:4321
```

The site check (`scripts/check-site/`) tests shared structure, not prose: the
title line, contents placement, sources section, figure labels, links and
theme-safe CSS. Rules at `error` fail the build and block the deploy.
