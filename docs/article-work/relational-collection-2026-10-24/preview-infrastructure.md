# Fresh relational collection preview

Implemented 24 October 2026. This shell is separate from the published collection
and from the first-version experiment. It supplies navigation, availability and
source presentation; fragment presence does not establish editorial review.

## Files and conventions

- `src/lib/relational-draft-20261024.ts`: all 58 inventory destinations, in inventory
  order, with stable keys `r00` through `r57`. Titles, IDs, slugs and group membership
  match `input/inventory.json`; article descriptions use its scope statements.
  The inventory gives no introduction scope, so its description is shell metadata.
- `src/articles/relational-collection/r00.astro`: introduction fragment, supplied
  by the integration owner. Remaining fragments use the exact names `r01.astro`
  through `r57.astro`; their order follows the inventory, not numeric RL IDs.
- `src/components/relational-collection/rXX/`: reserved convention for each fresh
  article's supporting components. The shell does not require a component folder.
- `src/pages/review/relational-collection/[...slug].astro`: generates routes only
  when `RELATIONAL_COLLECTION_PREVIEW=1` and the corresponding fragment exists.
  There is no placeholder route for a missing introduction or another article.
- `src/layouts/RelationalCollectionDraft.astro`: shared article shell, title line,
  contents, source handling, available-draft pager and figure isolation.
- `src/components/editorial/RelationalDraftNavigation.astro`: compact breadcrumbs
  and grouped article switcher, with a current-page marker.
- `src/components/editorial/RelationalDraftMap.astro`: collapsed subject groups at
  the foot of each article, showing available drafts and plain-text planned items.

The introduction lives at `/review/relational-collection/`. Other article paths
use inventory slugs, including their PostgreSQL or CockroachDB prefix. Each
available fragment also has `/review/relational-collection/figures/rXX/`.
Figure isolation follows the first-version route's convention: article paragraphs,
headings, navigation and asides outside `figure` elements are hidden. Keep figure
explanation and controls inside the figure if they belong in this review mode.

Fragments receive `entry`, `entries` and `collection` props. `entries` contains all
58 destinations with `status: 'draft' | 'planned'`; `collection` contains group
IDs and titles. These states describe file availability only. Files outside the
inventory's exact `rXX.astro` names do not acquire routes.

## Links, sources and indexing

The layout renders the fragment before rewriting exact public collection article
links to available fresh draft destinations. It preserves query strings and
fragments. Public sandbox, practice, checkout and evidence URLs are outside the
inventory, so remain public. An unavailable inventory destination keeps its public
link and gains a title explaining that its draft is unavailable, unless the link
already has a title. Menus, maps and pagers never use old public article versions.
The pager skips planned entries and follows the inventory order.

Authors should finish the fragment with the same direct final
`<h2>Sources and further reading</h2>` section used by `SkillTrial`. The shell moves
that heading and everything after it into a collapsed source disclosure, after the
map and pager. It does not alter source text. A missing source section does not
prevent assembly, so source completeness remains an editorial check.

The shell passes `readingPath="/"` to `Base`: its existing breadcrumb helper
otherwise emits generic Home/current breadcrumbs even on unknown review paths.
The root path suppresses those shared breadcrumbs and the shared pager while the
dedicated draft equivalents render inside the shell. No shared files are changed.
Every generated page has `noindex, nofollow` metadata and wraps draft content in
`data-pagefind-ignore="all"`. Draft metadata is not added to published reading,
search or collection registries. Normal builds generate none of these routes.

## Checks and remaining integration work

Focused checks completed without a site build or server:

- Astro compiler accepted the four new `.astro` files with no syntax errors.
- Node assertions compared all 58 IDs, titles and slugs with the inventory and
  checked contiguous keys `r00`–`r57`.
- Assertions checked a missing introduction, available/planned state assignment,
  draft link remapping with query and fragment retention, planned public fallback,
  and preserved sandbox links.
- Serena reported no TypeScript diagnostics for the metadata/helper file.

The integration owner still owns normal and preview builds, generated-link checks,
rendered desktop/mobile and light/dark review, keyboard interaction, figure
controls and search-index exclusion. No build, server, commit, push or publication
was performed by this assignment. Initial assembly can begin with any subset of
fragments; the final collection audit must verify that all 58 exist and all source
sections use the expected final heading.

## Integration additions

Root carried the accepted introduction into r00 unchanged and retained its title, Relational databases. Initial preview build and page checks passed with one available draft. Normal pnpm build passed all13site-check rules. A carried-forward figure advanced in the new shell. Root added a gated text-download endpoint at evidence/[...file].ts: supporting text files under rXX/downloads/ are available only in preview builds, preserving ordinary article/tool links and excluding draft downloads from normal publication. Actual download verification awaits the first native article package.
