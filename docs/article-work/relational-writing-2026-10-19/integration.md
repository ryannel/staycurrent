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

## Writing and review integration

The a14 pilot passed independent practitioner and teaching rechecks in p01 and
was pushed in `bc248b4`. A deployed browser smoke check confirmed the final
multiplied 100/60 figure state. The teaching review found the approach ready to
scale without a skill rewrite.

`audit.mjs` checks reserved section destinations and contextual child links in
each available fragment; `--complete` also requires every planned article. The
normal site check remains responsible for actual built links and anchors.

The root owns the shared reference/article preview on `127.0.0.1:4337`; a preview
started by a returning worker can end with its execution session. Workers may
start private previews only when needed and stop those at handoff.

Independent review moves to the built preview on `127.0.0.1:4437` from batch b02.
Root rebuilds between review batches, never during their playback checks. This
keeps unrelated writing and development reloads from resetting review state.
Authors use the development preview on 4337 for their own targeted checks and
return any HMR limitation explicitly. They do not run the shared full build.

Built-page script inspection confirmed that the dynamic route emits each rendered
article’s figure scripts rather than every figure script from the eager registry.
The introduction and SQL page had their own distinct external player entries;
small application/performance players were inlined. Search remains shared.

## Immutable browser review copies

Review builds now use isolated output directories served on loopback4438/4439, so another build cannot reset an active reviewer. Initial b11/b12 used `astro build --outDir` plus the unchanged checker APIs against that exact output. Once b10 released original dist, later batches use ordinary `pnpm build` then copy its complete output to a fresh temporary directory before serving it. Released servers stop before reusing their port; retained snapshot directories remain until final cleanup. The original4437 preview is stopped. Root owns all these servers and deletes only its own snapshot directories after review.

## 20 October · 28 published review drafts

A24 passed both independent article reviews and was pushed in88faf42. The live root review page was refreshed in a real browser and reported28 of38 available, with the completed physical-storage destination linked and the remaining work explicitly planned. A25 is frozen inB27 for independent review. The commission-only rendered audit additionally checked all29 locally assembled drafts for opening/contents order, final own sources section, planned anchors, contextual child links, bottom child placement and review/search exclusion: zero findings. The full build passed all13 rules.

## 20 October · 35 reviewed articles pushed

Individual reviews and required repairs are complete through the database-move article, leaving SQLite, security and monitoring/capacity. The assembled source and rendered audits cover 36 local fragments with zero integration findings. Every completed article has its own commit and push. Repaired model states retain complete before copies and comparisons; affected reviews explicitly retain unchanged native evidence. The final written-corpus review brief is ready. Readable exports preserve prose, tables, code, expandable article exercises and contextual links while using cues for figures; actual source and interactive pages remain authoritative.

## 20 October · all38 reviewed articles pushed

Security and monitoring/capacity passed both article perspectives after branch-specific model narration repairs. All38articles now have separate commits and pushes. The complete source and rendered audits pass with zero findings; all13 full-build rules pass. Three fresh reviewers are reading the finished corpus for completeness/depth, structure/consolidation and teaching/flow against the three reference articles. The c01 immutable manifest covers all38articles and their components; corpus review is still in progress.

## Complete corpus review

All38writtenarticles passed independent article reviews and three fresh whole-corpus perspectives. Required setup/continuation repairs in a01/a02passed focused rechecks; all other181frozen source/component/tree files are unchanged. Complete source and rendered audits pass38/38, the full build passes all13rules, and all97Pagefind fragments exclude review routes. The canonical38article tree remains intact. Native fixtures and the new isolated driver are stopped/removed; final deployment and preview cleanup follow.
