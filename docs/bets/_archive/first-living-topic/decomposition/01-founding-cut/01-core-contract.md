# Slice 1.1 — core: Core Contract

**Owner service:** core

**Surface:** core

**Complexity:** M

**Prerequisite:** none

## Scope

This slice stands up `@staycurrent/core` as a real package — TypeScript, ESM, built to `dist/` via `tsc` — and gives it a read side: the exported contract types and the content loading API. Every later slice in this milestone, and both surfaces beyond it, program against this API rather than parsing `topics/` themselves; nothing downstream can be verified until a real loading API exists to read back what the gate and the cut mechanics write.

**Required Capabilities:**
- `listTopics(root)` returns a `TopicSweep { topics: TopicSummary[], errors: TopicError[] }`, sorted by slug ascending, and returns `{ topics: [], errors: [] }` — not a throw — for a root with zero topics.
- `loadTopic(root, slug)` returns a `Topic { frontmatter, due, body, bodyMd }` for a valid topic; throws `ContentNotFoundError` when no `topics/<slug>/` directory exists, and `ContentValidationError` when the frontmatter fails schema validation or `frontmatter.topic !== slug`.
- `loadChangelog(root, slug)` returns `ChangelogEntry[]` newest-first, throwing `ContentValidationError` when a heading is not `## vN — YYYY-MM-DD`, entries are not strictly version-descending, or a non-v1 entry's `**Stance:**` line is missing or outside `held | bent | reversed`.
- `loadVersion(root, slug, n)` returns a `Version { meta, article, articleMd, skillDir, provenance }`, throwing `ContentNotFoundError` when `versions/vN/` does not exist and `ContentValidationError` when the frontmatter or the `provenance.md` bullet grammar (`## Sources` / `## Synthesis`) does not parse.
- `loadResearchLog(root, slug)` returns `ResearchLogEntry[]` newest-first, throwing `ContentValidationError` when a heading is not `## YYYY-MM-DD — cut vN` or `## YYYY-MM-DD — no-cut`.
- `renderMarkdown(md, opts?)` returns a `RenderedDoc { html, toc }` with GFM tables, generated heading-anchor ids (namespaced by `opts.headingIdPrefix` when given), and ` ```mermaid ` fences rewritten into the client-rendered diagram marker unless `opts.mermaid === false`.

## Design

Implements the "Loading API" section of `technical-design/03-api-design.md` in full — `listTopics`, `loadTopic`, `loadChangelog`, `loadVersion`, `loadResearchLog`, and `renderMarkdown` — together with the exported types that section and its "Exported types" subsection name (`TopicFrontmatter`, `TopicSummary`, `TopicSweep`, `VersionSnapshot`, `ChangelogEntry`, `ProvenanceRecord`, `Source`, `ResearchLogEntry`, `RenderedDoc`, `GateResult`/`GateFailure`/`GateCheckId`), against the on-disk frontmatter and document-anatomy schemas `technical-design/04-data-design.md` fixes for `article.md`, `versions/vN/article.md`, `changelog.md`, `versions/vN/provenance.md`, and `research-log.md`. This slice is read-only — no gate, no writes — matching `03-api-design.md`'s package-shape note that `@staycurrent/core` lives at `core/`, TypeScript, ESM, built via `tsc` to `dist/`.

## Proof of work

**Proves:** `@staycurrent/core`'s loading API turns a real `topics/` tree on disk into the typed shapes every later slice and both surfaces depend on, and it names the exact problem when that tree is malformed rather than failing silently or crashing uninformatively.

**How we prove it:** Call `listTopics` and `loadTopic` against a fixture topic tree shaped per the on-disk schemas in `04-data-design.md`, and observe a `TopicSweep`/`Topic` whose frontmatter fields and rendered `body.html`/`body.toc` reflect the fixture's real content — the parser and renderer actually running against real files, not a hand-typed stand-in for their output. Then point the same calls, plus `loadChangelog`/`loadVersion`/`loadResearchLog`, at fixtures each carrying one deliberately broken file — a `status` value outside the closed set, a malformed changelog heading, a `provenance.md` bullet that doesn't match the grammar — and observe `listTopics` report the broken topic by name in `errors` while the per-topic loaders throw `ContentValidationError`/`ContentNotFoundError` naming the offending file and field.

**Test file:** `tests/bets/first-living-topic/test_slice_1_core_core_contract.py` — generated red at Delivery start; traces to the Loading API in `technical-design/03-api-design.md`.
