# Slice 2.1 — site: Content Pipeline

**Owner service:** site

**Surface:** site

**Complexity:** M

**Prerequisite:** none (Milestone 1 delivered — `topics/databases/` exists at v1)

## Scope

This slice wires `services/site` onto `@staycurrent/core` as a build-time data layer and gets the real databases article — the one Milestone 1 cut, not a fixture — rendering at `/databases/` on the static export. It is the milestone's plumbing rung: no design system yet, but real content through the real loading API, with the build failing closed exactly where the design says it must. Every later slice styles and surrounds what this slice proves the pipeline can produce.

**Required Capabilities:**
- `services/site` depends on `@staycurrent/core` via a `file:../../core` dependency and imports the loading API from the package's built `dist/` — the package shape `03-api-design.md`'s Versioning & Compatibility section commits.
- `generateStaticParams` enumerates topic routes from `listTopics(root)`, and a non-empty `errors` array from that sweep is build-fatal — the site's fail-closed rule per `03-api-design.md` (site "treats a non-empty `errors` from `listTopics` as build-fatal").
- `/[topic]/` renders `loadTopic`'s returned `Topic` — the `body.html` in the page and the `body.toc` entries as working heading anchors whose generated ids appear in the rendered HTML, per `renderMarkdown`'s `RenderedDoc { html, toc }` contract in `03-api-design.md`.
- A ` ```mermaid ` fence in the article body arrives in the static HTML as the mermaid-fence transform's marker container — carrying the diagram source (readable as-is, so nothing is lost without JavaScript) and explicit reserved layout space — the static half of the diagram behaviour `02-data-flows.md`'s Site Build Data Flow specifies. The in-browser client render of that container is Slice 2.2's capability and is observed by 2.2's proof.
- The build exits non-zero when a topic cannot state `version` and `last_researched` — `loadTopic`'s `ContentValidationError` propagates out of `next build`, per the "currency is never guessed" failure mode in `02-data-flows.md`.
- The build is a static export only — `output: 'export'` with trailing slashes, producing an `out/` directory in which the databases article lives at `out/databases/index.html`.

## Design

Implements the Site Build Data Flow in `technical-design/02-data-flows.md` — `prebuild` aside (RSS and skill payloads are Milestone 3 scope), the `listTopics` → `generateStaticParams` → per-route `loadTopic` → `renderMarkdown` chain — over the Loading API in `technical-design/03-api-design.md`, reading the `topics/databases/` tree `technical-design/04-data-design.md` specifies. Realizes the content-bearing core of the `/[topic]/` view in `technical-design/01-ui-design.md`: the rendered essay body, heading anchors, and the reserved-space mermaid figure; the shell, tokens, and trust chrome around it land in Slice 2.2.

## Proof of work

**Proves:** The site build turns the real, gate-cut `topics/databases/` content into a static export a browser can serve — and refuses to build at all when a topic cannot state its currency.

**How we prove it:** Run `pnpm build` in `services/site` against the real repository and observe `out/databases/index.html` exist and contain the databases article's real rendered content — recognizable article prose from the v1 cut, the generated heading-anchor ids, and the mermaid figure containers with their fenced source present. Then copy the topic tree to a temporary location, deliberately break the fixture copy's frontmatter so it cannot state `version` and `last_researched`, point a build at the copy, and observe the build exit non-zero — the real `loadTopic` throw propagating, not a scripted check. The repository's own `topics/` is never touched; the broken fixture exists only to prove the real pipeline fails closed.

**Test file:** `tests/bets/first-living-topic/test_slice_7_site_content_pipeline.py` — generated red at Delivery start; traces to `listTopics`/`loadTopic`/`renderMarkdown` in `technical-design/03-api-design.md` and the Site Build Data Flow in `technical-design/02-data-flows.md`.
