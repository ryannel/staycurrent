# Relational publication

19 October 2026. The user explicitly authorised pushing and publishing all articles
once the learning-tools repairs were complete: “Once all articles are ready with
these fixes, please push and publish I'll read them live”.

The 54 reviewed articles now publish from `src/articles/relational/`. Their bodies
retain the reviewed teaching and evidence; publication changes internal links and
status. `registry.json` retains each reviewed draft hash, its technical and media
review records, and the current published file, hash and URL. The shared
`RelationalArticle.astro` renderer serves the public articles and the optional
internal review wrapper. Normal production excludes review routes.

The introduction offers the reviewed task paths and a subject directory. All 54
articles join the reading directory, search, collection switcher and previous/next
navigation. Four existing PostgreSQL specialist articles remain available alongside
the checkout, sandbox and practice. Retired routes resolve to replacement articles;
active internal links use the replacement directly. Retained section aliases sit
beside their replacement passages. The practice entrance uses independent fixtures
rather than the previous collection's shop loader.

Public evidence endpoints expose the same worksheets, observations and lab source
files already linked by the reviewed articles. They exclude runtime files and
compiled Python caches. Native execution and review records remain in the original
handoff and [teaching-tools repair](media-repair/README.md); publication does not
relabel browser models as server execution.

The production build exposed a site-check defect: long captions were omitted when
counting figures, so a later short label appeared to start at Figure 2. The checker
now counts long figcaptions while retaining its short-label rule elsewhere. A
regression case covers long captions mixed with repeated short labels and a real
gap in numbering.

## Integration checks

- Production build: all 13 rules pass across 103 checked pages. All 54 article
  destinations are present; internal links and fragments resolve. Review routes
  are absent from the production build.
- Site-check tests: 16 pass, including the long-caption regression. Model tests:
  all 64 pass.
- A source comparison confirms all 54 reviewed bodies changed only in links and
  publication status. Published hashes match the registry.
- The [independent navigation review](review/publication-navigation.md) checked
  discovery, mapping, evidence paths and incoming references. Its practice repair
  was read independently by the coordinator and inspected in the browser. Final
  semantic links and metadata were repaired before the final build.
- Production-preview browser checks exercised booking commit, recovery
  reconciliation/reset, and range routing across a split boundary and another SQL
  gateway. Search returned the new CockroachDB articles and their section links.
  The native worksheet ZIP downloaded successfully through its public endpoint.

The release workflow deploys the publication commit. Its GitHub Actions result and
the live collection are checked after push before the delivery is reported complete.
