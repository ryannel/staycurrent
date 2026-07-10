# Slice 3.1 — core: Render Hardening

**Owner service:** core

**Surface:** core

**Complexity:** S

**Prerequisite:** none (Milestone 2 delivered)

## Scope

This slice hardens the two core seams Milestone 2's reviews proved open before the site goes public: `renderMarkdown` carries link protocols to the browser unfiltered (maturity G7 — a live XSS vector once `dangerouslySetInnerHTML` serves a public origin), and `validateTopicFrontmatter` accepts blank `title`/`stance` (maturity G8 — a blank stance builds green and renders a silently blank card). Milestone 3 deploys the site to GitHub Pages, so both close now, in core, where every surface inherits them.

**Required Capabilities:**
- `renderMarkdown` emits no `href` or `src` whose URL protocol is outside the allowlist {`http`, `https`, `mailto`} — relative paths and fragment anchors pass untouched. A markdown link or image carrying `javascript:`, `data:`, `vbscript:`, or any other scheme renders with the offending attribute removed (text content preserved), never carried into `RenderedDoc.html` — per the RenderedDoc contract in `03-api-design.md` and the fail-closed stance in the pitch. Falsifiable: `[click](javascript:alert(1))` in a body yields an `<a>` with no `href` (or plain text), while `[ok](https://example.com)`, `[rel](./sibling)`, and `[frag](#anchor)` survive byte-identical.
- The sanitization runs inside `renderMarkdown`'s pipeline itself — every caller (site pages, `loadChangelog`'s `bodyHtml`, future faces) inherits it with no per-caller opt-in, per the one-pipeline rule in `03-api-design.md`.
- `validateTopicFrontmatter` rejects empty or whitespace-only `title` and `stance` with a `ContentValidationError` naming the field — the same failure shape every other schema violation produces (`04-data-design.md`'s frontmatter schema). The sweep (`listTopics`) reports it as a `TopicError`; `loadTopic` throws it; the site build fails closed on it.
- The real `topics/databases/` tree passes the tightened validation unchanged — hardening breaks no shipped content.

## Design

Extends the `renderMarkdown` pipeline in `technical-design/03-api-design.md` (gray-matter → remark-gfm → heading anchors → mermaid-fence transform) with a protocol-allowlist rehype step, and tightens the frontmatter schema validation `04-data-design.md` commits. No API signature changes; no new exports required beyond what testing needs. Closes maturity ledger rows G7 and G8 (the ledger rows move to `closed (first-living-topic)` in this slice's commit), and the same commit records the matching amendment to `04-data-design.md`'s frontmatter field table — `title` and `stance` gain the non-blank constraint this slice enforces.

## Proof of work

**Proves:** Hostile link protocols cannot reach a reader's browser through any rendered body, and a topic that cannot state a non-blank title and stance cannot build.

**How we prove it:** Run the real pipeline end to end: a fixture body carrying a `javascript:` link, a `data:` image, an `https:` link, a relative link, and a fragment anchor goes through the real `renderMarkdown`, and the emitted HTML carries the safe URLs untouched with the hostile protocols stripped. Then render the fixture through the site's real build path (a fixture topic via `STAYCURRENT_REPO_ROOT`) and confirm the served article HTML carries no `javascript:` anywhere. For the schema half: a fixture topic with `stance: ""` fails `loadTopic` with a `ContentValidationError` naming `stance`, and the listTopics sweep reports it; the repository's own `topics/databases/` still loads, gates, and builds green.

**Test file:** `tests/bets/first-living-topic/test_slice_10_core_render-hardening.py` — generated red at Delivery start; traces to `renderMarkdown`'s RenderedDoc contract in `technical-design/03-api-design.md` and the frontmatter schema in `technical-design/04-data-design.md`.
