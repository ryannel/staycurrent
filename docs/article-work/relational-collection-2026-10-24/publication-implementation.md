# Relational publication source handoff — 24 October 2026

The normal public routes now render the completed `src/articles/relational-collection/r00`–`r57` Astro fragments. No article bodies, authored metadata files, article figure components, example data, native scripts or review evidence were changed by this implementation.

## Source changes

- `src/lib/relational-publication.ts` (new): explicit published adapter over the existing 58-entry commission inventory. Authored `.meta.json` titles/descriptions take precedence; inventory text supplies the fallback (including r00).
- `src/lib/relational-draft-20261024.ts`: allow the shared entry state to represent `published`; preview availability logic stays draft/planned.
- `src/lib/relational-collection.ts`: public collection, introduction and ID/slug publication mapping derive from the published adapter. All 23 existing retired-route aliases remain intact.
- `src/lib/reading.ts` and `src/lib/collection-order.ts`: introduction metadata follows the published adapter, as all deeper entries already follow the public collection.
- `src/components/editorial/RelationalPublishedArticle.astro` (new): shared public wrapper loading the exact completed fragment and published metadata.
- `src/pages/learn/databases/relational.astro`, `src/pages/learn/databases/relational/[...article].astro` and the four existing explicit PostgreSQL specialist routes (`sharding`, `full-text-search`, `vector-search`, `extensions`): route to the completed fragments, with no preview environment dependency. The catchall excludes the four explicit specialist routes to avoid collisions. Practice, checkout and sandbox routes remain available.
- `src/layouts/RelationalCollectionDraft.astro`: published mode uses normal public collection/evidence links, no robots noindex or wrapper Pagefind exclusion, published labels, and its existing compact navigation/pager/source disclosure. Sources remain collapsed at the absolute bottom. The existing `readingPath="/"` suppresses Base's older duplicate navigation/pager; compact navigation supplies the public breadcrumb. Base's Pagefind entry lookup still uses actual `Astro.url.pathname`.
- `src/components/editorial/RelationalDraftNavigation.astro` and `RelationalDraftMap.astro`: shared published mode, public breadcrumbs, links and labels; collapsed nested groups and existing current-position markers. Preview labels remain conditional on preview mode.
- `src/pages/learn/databases/relational/evidence/[...file].ts`: extends the existing public evidence endpoint with current article `downloads` directories. It reads the original bytes and preserves the prior legacy evidence/lab endpoints. Shared layout rewrites the authored review evidence hrefs without changing article text.

## Static observations

- 58 unique registry slugs and 58 corresponding article fragments.
- 23 existing aliases, no collisions with article slugs, and every alias resolves to a current article slug.
- Practice, checkout, sandbox and evidence routes do not collide with article slugs.
- All 50 unique evidence downloads linked by the 58 articles have source files, with no overlap with legacy evidence paths.
- Four specialist route files contain only the shared public article wrapper.
- The review article/figure and review evidence routes retain their existing `RELATIONAL_COLLECTION_PREVIEW` gate.
- Serena diagnostics for the public collection were clear. Its diagnostic service initially reported the old imported draft-state union for the new adapter despite the actual interface containing `published`; this appears to be language-service cache state. It also lacks Node built-in type declarations for the existing filesystem endpoint. Normal build remains the authoritative next check.

No builds, servers, Git operations, deployment, article reviews or native experiments were run by this implementation subagent. Root owns the normal build and public route/download/render checks.

## First-build compatibility repair

Root's first normal build compiled the public pages, then identified 14 links from older callers to renamed headings. Root explicitly authorised narrow caller URL repairs. Only href/articleHref strings changed in:

- `src/pages/learn/databases/relational/checkout.astro`
- `src/pages/learn/databases/relational/practice.astro`
- `src/pages/learn/drawing-systems/async-interactions.astro`
- `src/lib/sql-sandbox-tutorials.ts`
- `src/lib/sql-lessons/foundations.ts`
- `src/lib/sql-lessons/relational-depth-choices.ts`
- `src/lib/sql-lessons/postgresql-scaling.ts`

Twelve links now reach corresponding actual sections in the completed articles. Policy-composition practice now points to PostgreSQL access control; runtime partition pruning points to the partitioning article. Two practice-guide links describe the older multi-scenario PostgreSQL lab and CockroachDB worksheet bundle, so they now point directly to the retained original `/evidence/rl110-native.py` and `/evidence/cockroach-worksheet.zip` downloads. Their existing link text and descriptions therefore remain accurate. Both files exist. All current article-fragment links in the changed caller files were checked against actual authored IDs. The completed 58 article bodies remain unchanged. Root was notified that source is frozen again and ready for rebuild.
