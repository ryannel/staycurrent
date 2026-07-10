import { existsSync } from 'node:fs';
import path from 'node:path';
import { listTopics, loadTopic, loadVersion, type Topic } from '@staycurrent/core';

/**
 * Thin server-side data layer over `@staycurrent/core`'s Loading API
 * (technical-design/03-api-design.md). Every function here is build-time-only
 * (Node fs reads, `next build`/`generateStaticParams`/page render) and never
 * runs in the browser.
 *
 * Root resolution: `services/site`'s pnpm scripts (and vitest, invoked the
 * same way) always execute with `process.cwd()` set to `services/site/` —
 * two levels below the instance repo root that contains `topics/`. Set
 * `STAYCURRENT_REPO_ROOT` to override that default — this exists so a build
 * can be pointed at a fixture copy of the content tree (e.g. the fail-closed
 * half of a bet's proof, which must not touch the real `topics/`) and for CI
 * layouts where `process.cwd()` doesn't land two levels under the root.
 */
const REPO_ROOT = process.env.STAYCURRENT_REPO_ROOT
  ? path.resolve(process.env.STAYCURRENT_REPO_ROOT)
  : path.resolve(process.cwd(), '..', '..');

/**
 * Enumerates topic slugs for `generateStaticParams`.
 *
 * Fail-closed per 03-api-design.md: "the site's build treats a non-empty
 * `errors` from `listTopics` as build-fatal — the same fail-closed rule
 * `loadTopic` enforces per page". `listTopics` itself never throws for a
 * malformed topic (it collects `errors` instead) — this function is the one
 * place that turns that report into a build-fatal throw for the site.
 *
 * `listTopics` also never throws for a root with no `topics/` directory at
 * all — it reports that the same way as a `topics/` dir with nothing in it:
 * `{ topics: [], errors: [] }`. Left unchecked, a mis-resolved `REPO_ROOT`
 * (e.g. `STAYCURRENT_REPO_ROOT` pointed at the wrong path) would ship a green
 * empty export instead of failing the build. So this function distinguishes
 * the two after the sweep: no `topics/` directory at all is a fail-closed
 * throw naming the resolved root; an existing-but-empty `topics/` remains a
 * valid empty catalogue.
 */
export function getTopicSlugs(root: string = REPO_ROOT): string[] {
  const sweep = listTopics(root);
  if (sweep.errors.length > 0) {
    const detail = sweep.errors.map((e) => `${e.slug}: ${e.message}`).join('; ');
    throw new Error(`listTopics reported ${sweep.errors.length} invalid topic(s): ${detail}`);
  }
  if (!existsSync(path.join(root, 'topics'))) {
    throw new Error(
      `getTopicSlugs: no topics/ directory found under resolved repo root '${root}' — ` +
        'a mis-resolved root must not ship a green empty export (set STAYCURRENT_REPO_ROOT ' +
        'to point at the correct content tree)'
    );
  }
  return sweep.topics.map((t) => t.topic);
}

// The mermaid-fence transform's marker container, as emitted by
// `@staycurrent/core`'s rehypeMermaid (core/src/render/rehypeMermaid.ts):
// `<div class="mermaid-figure" data-mermaid="<source>">` with this exact
// property order. content-core deliberately carries no reserved-space
// behaviour — renderMarkdown's design rationale (03-api-design.md) names
// sizing/CLS as "the site's rendering concern, not a rendering option [in
// renderMarkdown]". This is that concern: inject an explicit min-height that
// absorbs the initial layout so the client mermaid render (Slice 2.2) never
// shifts *settled* text on arrival. A rendered figure may still extend taller
// than the reservation (change-proposal-3: diagram growth beyond 320px is
// accepted, not capped) — when it does, scroll anchoring is what preserves
// the reader's position, not a hard size cap.
//
// Anchored on the full open-tag prefix, not the class attribute alone: HTML
// serialization never escapes `"` inside a text node or attribute value, so
// the literal `class="mermaid-figure"` can appear verbatim in article prose
// (e.g. a sentence quoting that string) and a class-only match would corrupt
// it. An unescaped `<` cannot appear in a serialized text node or attribute
// value, though — only a real element's open tag produces one — so anchoring
// on `<div class="mermaid-figure" data-mermaid=` cannot collide with anything
// content authors write.
const MERMAID_FIGURE_OPEN = '<div class="mermaid-figure" data-mermaid=';
const MERMAID_FIGURE_OPEN_RESERVED =
  '<div class="mermaid-figure" style="min-height: 320px" data-mermaid=';

/** Exported for unit testing in isolation from a real rendered topic. */
export function reserveMermaidSpace(html: string): string {
  return html.split(MERMAID_FIGURE_OPEN).join(MERMAID_FIGURE_OPEN_RESERVED);
}

/**
 * Loads one topic's full live state for `/[topic]/`. `ContentNotFoundError`
 * and `ContentValidationError` propagate uncaught — per the "currency is
 * never guessed" rule (02-data-flows.md), a topic that cannot state its
 * `version`/`last_researched`, or otherwise fails schema validation, must
 * fail `next build` rather than render a partial page.
 */
export function getTopic(slug: string, root: string = REPO_ROOT): Topic {
  const topic = loadTopic(root, slug);
  return {
    ...topic,
    body: {
      ...topic.body,
      html: reserveMermaidSpace(topic.body.html),
    },
  };
}

/**
 * The CURRENT version's cut date — the date `versions/vN/article.md`'s
 * frontmatter (`VersionSnapshot.cut`) was written for `version === n`, via
 * `@staycurrent/core`'s public `loadVersion` (never a direct `topics/` read).
 *
 * Freshness keys on this, not `frontmatter.last_researched`: a no-cut
 * research run updates `last_researched` without producing a new version, so
 * the two fields diverge the first time a topic gets researched-but-not-cut.
 * Per docs/design-system.md § Graphical UI's freshness rule ("the current
 * version is ≤ 14 days old"), the dot must track the cut, not the research
 * run — this is that lookup, kept separate from `getTopic` so its existing
 * fail-closed contract (and its test suite's fixtures, none of which stage a
 * `versions/vN/` tree) are undisturbed by this addition.
 *
 * Throw contract mirrors `loadVersion`: a missing/invalid `versions/vN/` for
 * the live version propagates uncaught (`ContentNotFoundError` /
 * `ContentValidationError`) — every cut writes that snapshot as part of
 * landing, so its absence for the live version is itself a currency defect,
 * not a condition this data layer papers over.
 */
export function getTopicCutDate(slug: string, version: number, root: string = REPO_ROOT): string {
  return loadVersion(root, slug, version).meta.cut;
}
