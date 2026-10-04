# Stay Current

Understand engineering choices and follow the changes that matter. A static Astro publication. Read `README.md` for the layout and `docs/site-direction.md` for the agreed content plan. The website covers engineering fields, with a site-wide overview. Databases and storage is the first field, with its guide and linked articles; other fields remain planned coverage. The column-store essay now lives under `/learn/databases/column-stores/` and remains a teaching reference alongside the relational collection.

## House voice

Every word written here, from articles and changelog entries to commit messages and chat replies, follows the `staycurrent-style` skill in `.agents/skills/staycurrent-style/`. Load it before drafting anything longer than a sentence.

## Research runs

`.agents/skills/staycurrent-research/` guides research and assessments. The site currently has no updates feed. Researching and drafting do not imply permission to publish. Keep planned coverage distinct from available reading.

## Article production

Read `docs/content-structure.md` when planning coverage. Use
`.agents/skills/staycurrent-planning/` for collections and reader journeys,
`.agents/skills/staycurrent-authoring/` for substantive article creation and
`.agents/skills/staycurrent-review/` for independent review and repair. These skills
explicitly call for reviewer subagents. Keep family coverage distinct from the
scope of one article, and keep the shared distributed-systems idea parked.
Agent review can complete a draft without routine human editing; it does not
authorise publication.

## Checks

```bash
pnpm install
pnpm build          # the only check: every page must build
pnpm dev            # http://localhost:4321
```
