# Live draft review integration

The normal build includes `/review/relational-next/` and every stable slug in
`registry.json`. These pages carry `noindex, nofollow`, remain outside the public
reading directory and search, and identify the collection as a new draft.

`src/lib/relational-next.ts` imports the canonical registry directly and detects
content with an eager `import.meta.glob` of `src/articles/relational-next/*.astro`.
Adding `aXX.astro` makes that article available on the next build. Availability
means a draft exists; the work records remain authoritative for review status.
Absent fragments produce explicit planned pages. Child reading lists show planned
entries as text and link only available drafts. The introduction's final reading
list includes the whole tree, including finished children of planned parents.

Authors supply an Astro content fragment: frontmatter for component imports,
opening prose, their contents navigation after that opening, h2/h3 sections and
Sources and further reading. Do not add a Base/layout, article element, h1,
TitleLine or bottom child directory. Use unique heading/figure IDs within the
fragment and avoid the wrapper's reserved `contextual-reading` ID. Component
imports from an article normally start `../../components/relational-next/aXX/`.
Native component scripts are preserved because the route renders each imported
Astro component directly; the wrapper does not serialise its slot into HTML.

The wrapper supplies the shared title, metadata, draft status, contextual parent
route and onward reading. Base supplies the standard Home/current breadcrumbs.
Stable links inside prose may use registry hrefs even before their target is
written: those routes resolve to clearly labelled planned pages.

Validation: `pnpm build` passed all 13 structural rules. An additional built-page
inspection checked all 38 registry routes for `noindex, nofollow`, one h1, absence
of a searchable article body, and valid collection links; the root listed all
37 descendants. Browser review on the existing port-4337 server confirmed the
shared dark-theme layout and planned labels before article fragments arrived.
