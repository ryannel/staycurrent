import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  listTopics,
  loadChangelog,
  loadTopic,
  loadVersion,
  type ChangelogEntry,
  type ProvenanceRecord,
  type RenderedDoc,
  type SiteConfig,
  type Topic,
  type TopicFrontmatter,
  type TopicRegister,
  type TopicSummary,
} from '@staycurrent/core';

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
 * Reads `site.config.json` from the repo root (03-api-design.md, `buildRss`:
 * "read by the site's prebuild script from site.config.json at the repo root
 * and passed in") — the one place `services/site` resolves this instance's
 * identity, so no page hardcodes `config.url` itself. Fails closed for BOTH
 * an outright-missing file and a malformed one (bad JSON, a field with the
 * wrong type) — no instance value is hardcoded in `services/site` (RC1), so
 * there is no default left to degrade to. Every real deploy of this
 * repository ships a `site.config.json` at its root (see `/site.config.json`)
 * and every fixture root a build runs against must now stage its own (bet-
 * progress fixture harnesses under `tests/` were updated alongside this
 * change). `services/site/scripts/prebuild.mjs` mirrors this exact
 * validation shape (it cannot import this module — see that file's own
 * comment).
 */
export function getSiteConfig(root: string = REPO_ROOT): SiteConfig {
  const configPath = path.join(root, 'site.config.json');
  if (!existsSync(configPath)) {
    throw new Error(
      `${configPath}: site.config.json not found — no instance value is hardcoded in ` +
        'services/site, so every repo root a build runs against must stage its own'
    );
  }
  const raw: unknown = JSON.parse(readFileSync(configPath, 'utf-8'));
  if (
    typeof raw !== 'object' ||
    raw === null ||
    typeof (raw as Partial<SiteConfig>).name !== 'string' ||
    typeof (raw as Partial<SiteConfig>).url !== 'string' ||
    typeof (raw as Partial<SiteConfig>).description !== 'string' ||
    typeof (raw as Partial<SiteConfig>).author !== 'string'
  ) {
    throw new Error(
      `${configPath}: must be a JSON object with string fields name, url, description, author`
    );
  }
  return raw as SiteConfig;
}

/**
 * Sweeps `topics/` and fails closed per 03-api-design.md: "the site's build
 * treats a non-empty `errors` from `listTopics` as build-fatal — the same
 * fail-closed rule `loadTopic` enforces per page". `listTopics` itself never
 * throws for a malformed topic (it collects `errors` instead) — this is the
 * one place that turns that report into a build-fatal throw for the site.
 *
 * `listTopics` also never throws for a root with no `topics/` directory at
 * all — it reports that the same way as a `topics/` dir with nothing in it:
 * `{ topics: [], errors: [] }`. Left unchecked, a mis-resolved `REPO_ROOT`
 * (e.g. `STAYCURRENT_REPO_ROOT` pointed at the wrong path) would ship a green
 * empty export instead of failing the build. So this function distinguishes
 * the two after the sweep: no `topics/` directory at all is a fail-closed
 * throw naming the resolved root; an existing-but-empty `topics/` remains a
 * valid empty catalogue (the first-run empty state).
 *
 * Shared by every accessor below that must ship or fail the whole catalogue
 * atomically, never a partial one — `getTopicSlugs` (static params) and
 * `listTopicCards` (the Topic Library's card grid) both fail the same way
 * for the same reasons, so the check lives once.
 */
function sweepOrThrow(root: string): TopicSummary[] {
  const sweep = listTopics(root);
  if (sweep.errors.length > 0) {
    const detail = sweep.errors.map((e) => `${e.slug}: ${e.message}`).join('; ');
    throw new Error(`listTopics reported ${sweep.errors.length} invalid topic(s): ${detail}`);
  }
  if (!existsSync(path.join(root, 'topics'))) {
    throw new Error(
      `no topics/ directory found under resolved repo root '${root}' — a mis-resolved root ` +
        'must not ship a green empty export (set STAYCURRENT_REPO_ROOT to point at the ' +
        'correct content tree)'
    );
  }
  return sweep.topics;
}

/** Enumerates topic slugs for `generateStaticParams`. See `sweepOrThrow`. */
export function getTopicSlugs(root: string = REPO_ROOT): string[] {
  return sweepOrThrow(root).map((t) => t.topic);
}

/**
 * The Topic Library card grid's per-card shape (01-ui-design.md, `/` — Topic
 * Library): title, stance, version, and last-researched date, straight off
 * `listTopics`' `TopicSummary` sweep (03-api-design.md) — no direct `topics/`
 * reads from components, no new core API surface beyond the committed
 * Loading API. Sorted by slug ascending (`listTopics`' own order).
 */
export interface TopicCard {
  slug: string;
  title: string;
  stance: string;
  version: number;
  lastResearched: string;
}

/**
 * Sweeps every topic for the Topic Library (`/`). Returns `[]` for a
 * validly-empty `topics/` directory — the first-run empty state
 * (01-ui-design.md's "/ — Topic Library" First-run empty state) — and fails
 * closed exactly as `getTopicSlugs` does for a malformed catalogue or a
 * mis-resolved root (`sweepOrThrow`).
 */
export function listTopicCards(root: string = REPO_ROOT): TopicCard[] {
  return sweepOrThrow(root).map((t) => ({
    slug: t.topic,
    title: t.title,
    stance: t.stance,
    version: t.version,
    lastResearched: t.last_researched,
  }));
}

/**
 * One topic as it appears inside a `Catalogue` (03-api-design.md,
 * `getCatalogues`). `movement`/`readingOrder`/`core` are present only when
 * `register` makes them meaningful — see the field comments below — matching
 * the "present iff" contract the design fixes.
 *
 * `register` is optional, not `TopicRegister`, to represent one real state
 * the design's own routing table names but its type table's prose omits: a
 * topic whose `area` is set but whose `register` is missing or not one of the
 * three known values still lands in `Catalogue.ungrouped` (02-data-flows.md,
 * flow (a), step 3) — and such a topic has no real register value to report.
 * Every entry actually reachable through `hub`, `movements`, or `profiles`
 * still carries a real, defined `register`.
 */
export interface CatalogueEntry {
  slug: string;
  title: string;
  stance: string;
  version: number;
  register?: TopicRegister;
  movement?: string; // present iff register === 'foundation'
  readingOrder?: number; // present iff register === 'foundation' | 'profile'
  core?: boolean; // present iff register === 'profile'
}

export interface CatalogueMovement {
  name: string; // verbatim movement label, e.g. "Single Node"
  entries: CatalogueEntry[]; // ordered by readingOrder ascending
}

export interface Catalogue {
  area: string;
  hub: CatalogueEntry | null;
  movements: CatalogueMovement[]; // ordered by the lowest readingOrder any member carries
  profiles: CatalogueEntry[]; // ordered by readingOrder ascending
  ungrouped: CatalogueEntry[]; // register missing/unrecognized, or 'foundation' without movement
}

function toCatalogueEntry(t: TopicSummary): CatalogueEntry {
  return {
    slug: t.topic,
    title: t.title,
    stance: t.stance,
    version: t.version,
    ...(t.register !== undefined && { register: t.register }),
    ...(t.register === 'foundation' && t.movement !== undefined && { movement: t.movement }),
    ...((t.register === 'foundation' || t.register === 'profile') &&
      t.reading_order !== undefined && { readingOrder: t.reading_order }),
    ...(t.register === 'profile' && t.core !== undefined && { core: t.core }),
  };
}

/** An entry missing `readingOrder` sorts last rather than throwing — `reading_order` is unvalidated, optional display data (03-api-design.md). */
function readingOrderOf(entry: CatalogueEntry): number {
  return entry.readingOrder ?? Number.POSITIVE_INFINITY;
}

function lowestReadingOrder(entries: CatalogueEntry[]): number {
  return Math.min(...entries.map(readingOrderOf));
}

/**
 * The single grouping accessor behind both the Topic Library grid and the
 * root layout's sidebar tree (03-api-design.md, `getCatalogues`). Sweeps
 * every topic through the same fail-closed path every other whole-catalogue
 * accessor uses (`sweepOrThrow`), then buckets by `area` and, within an area,
 * by `register` — realizing flow (a) in 02-data-flows.md.
 *
 * Takes no area argument and assumes no single area exists: `getCatalogues`
 * returns one `Catalogue` per distinct `area` value the sweep actually finds,
 * sorted by `area` ascending, and `[]` when no topic carries an `area` at
 * all — `services/site` "never names the instance" (docs/architecture/index.md
 * §4).
 */
export function getCatalogues(root: string = REPO_ROOT): Catalogue[] {
  const topics = sweepOrThrow(root);

  // `topics` is already slug-ascending (listTopics' own sort order); grouping
  // by area preserves that order within each group, which is what makes the
  // duplicate-hub tie-break below ("slug-alphabetical first wins") correct
  // without a second sort.
  const byArea = new Map<string, TopicSummary[]>();
  for (const t of topics) {
    if (t.area === undefined) continue;
    const members = byArea.get(t.area);
    if (members) {
      members.push(t);
    } else {
      byArea.set(t.area, [t]);
    }
  }

  const areas = [...byArea.keys()].sort((a, b) => a.localeCompare(b));

  return areas.map((area) => {
    const members = byArea.get(area)!;

    let hub: CatalogueEntry | null = null;
    const profiles: CatalogueEntry[] = [];
    const ungrouped: CatalogueEntry[] = [];
    const movementBuckets = new Map<string, CatalogueEntry[]>();

    for (const t of members) {
      if (t.register === 'hub') {
        if (hub === null) {
          hub = toCatalogueEntry(t);
        } else {
          // A second (or later) topic claiming register: 'hub' in the same
          // area is an authoring defect the build tolerates rather than
          // fails on — the slug-alphabetical first hub wins (members is
          // already slug-ascending); every later claimant lands in
          // `ungrouped` instead of silently overwriting the first.
          ungrouped.push(toCatalogueEntry(t));
        }
        continue;
      }
      if (t.register === 'profile') {
        profiles.push(toCatalogueEntry(t));
        continue;
      }
      if (t.register === 'foundation' && t.movement !== undefined) {
        const bucket = movementBuckets.get(t.movement);
        if (bucket) {
          bucket.push(toCatalogueEntry(t));
        } else {
          movementBuckets.set(t.movement, [toCatalogueEntry(t)]);
        }
        continue;
      }
      // register missing/unrecognized, or 'foundation' without movement.
      ungrouped.push(toCatalogueEntry(t));
    }

    profiles.sort((a, b) => readingOrderOf(a) - readingOrderOf(b));
    for (const bucket of movementBuckets.values()) {
      bucket.sort((a, b) => readingOrderOf(a) - readingOrderOf(b));
    }

    // Movement order is a property of the data — the lowest readingOrder any
    // member carries — never separately authored (02-data-flows.md, flow a).
    const movements: CatalogueMovement[] = [...movementBuckets.entries()]
      .map(([name, entries]) => ({ name, entries }))
      .sort((a, b) => lowestReadingOrder(a.entries) - lowestReadingOrder(b.entries));

    return { area, hub, movements, profiles, ungrouped };
  });
}

/** `slug` humanized for a dangling `ReadingPathLink` fallback: `distributed-transactions` → "Distributed Transactions" (02-data-flows.md, flow b, step 3). */
function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export interface ReadingPathLink {
  slug: string;
  title: string; // the linked topic's real title if it exists in the sweep; otherwise its slug humanized
}

export interface ReadingPosition {
  movement: string;
  indexInPath: number; // 1-based position among this area's path members
  totalInPath: number;
  indexInMovement: number; // 1-based position within just this movement
  totalInMovement: number;
  prereqs: ReadingPathLink[]; // [] when the topic authored none
  next: ReadingPathLink | null; // the following foundation in reading order; null on the last piece
}

/**
 * Resolves a foundation's position in its area's reading path — its index
 * and count within the path and within its own movement, its prereqs
 * resolved to real (or best-effort) titles, and the next piece to read
 * (03-api-design.md, `getReadingPosition`; 02-data-flows.md, flow b).
 *
 * `frontmatter` is the topic's own, already-loaded frontmatter — the caller
 * already holds it from `getTopic(slug)` for the page's other needs — matching
 * `getTopicVersion`'s "read once, pass in" precedent.
 *
 * A total function: never throws. Returns `null` when `register` is not
 * `'foundation'`, `area` is blank, `reading_order` is not a valid positive
 * integer, or — defensively — this topic's own slug is not found among its
 * area's resolved foundations once those checks pass. `reading_order` and
 * `movement` are unvalidated additive fields (04-data-design.md): a
 * foundation missing them renders normally, without a rail, rather than
 * failing the build.
 */
export function getReadingPosition(
  frontmatter: TopicFrontmatter,
  root: string = REPO_ROOT
): ReadingPosition | null {
  if (frontmatter.register !== 'foundation') return null;
  if (frontmatter.area === undefined || frontmatter.area.trim() === '') return null;
  if (
    typeof frontmatter.reading_order !== 'number' ||
    !Number.isInteger(frontmatter.reading_order) ||
    frontmatter.reading_order <= 0
  ) {
    return null;
  }

  const catalogue = getCatalogues(root).find((c) => c.area === frontmatter.area);
  if (!catalogue) return null;

  // The flattened movements list IS the reading path (02-data-flows.md, flow
  // b, step 2) — movements are a presentational partition of it, not a
  // second ordering.
  const path = catalogue.movements.flatMap((m) => m.entries);
  const ownIndex = path.findIndex((e) => e.slug === frontmatter.topic);
  if (ownIndex === -1) return null;

  const ownEntry = path[ownIndex];
  const movement = catalogue.movements.find((m) => m.name === ownEntry.movement)!;
  const indexInMovement = movement.entries.findIndex((e) => e.slug === frontmatter.topic) + 1;

  // A blank/whitespace-only prereqs entry (`prereqs: [""]` passes core's
  // extractPrereqs — every element just needs to be a string) would otherwise
  // resolve to a blank slug and a blank humanizeSlug fallback: a blank-text
  // link to an empty href. `prereqs` names pieces to read first; an entry
  // that names nothing links to nothing, so it is dropped rather than
  // rendered — the same absence-is-resting-state degrade the rest of this
  // rail already applies, and it keeps the design's "never shows a raw slug
  // or blank text" (02-data-flows.md, flow b, step 3) true by construction.
  const prereqs: ReadingPathLink[] = (frontmatter.prereqs ?? [])
    .filter((slug) => slug.trim() !== '')
    .map((slug) => {
      const found = path.find((e) => e.slug === slug);
      return { slug, title: found ? found.title : humanizeSlug(slug) };
    });

  const nextEntry = path[ownIndex + 1] ?? null;

  return {
    movement: movement.name,
    indexInPath: ownIndex + 1,
    totalInPath: path.length,
    indexInMovement,
    totalInMovement: movement.entries.length,
    prereqs,
    next: nextEntry ? { slug: nextEntry.slug, title: nextEntry.title } : null,
  };
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
 * The CURRENT version's cut date plus its provenance record — both read off
 * `versions/vN/article.md` / `versions/vN/provenance.md` via
 * `@staycurrent/core`'s public `loadVersion` (never a direct `topics/`
 * read), fetched with a SINGLE `loadVersion` call.
 *
 * `/[topic]/` needs both facts for the same live version (the trust header's
 * freshness dot and the essay-close Provenance section, 01-ui-design.md's
 * micro-polish spec) — this accessor exists so that page loads the version
 * once rather than twice. `getTopicCutDate` below stays the entry point for
 * callers that only need the date (the root layout's sidebar sweep, which
 * loops every topic and never touches its provenance) and now delegates here
 * rather than duplicating the read.
 *
 * Throw contract mirrors `loadVersion`: a missing/invalid `versions/vN/` for
 * the live version propagates uncaught (`ContentNotFoundError` /
 * `ContentValidationError`) — every cut writes that snapshot as part of
 * landing, so its absence for the live version is itself a currency defect,
 * not a condition this data layer papers over.
 */
export interface TopicVersion {
  cutDate: string;
  provenance: ProvenanceRecord;
}

export function getTopicVersion(slug: string, version: number, root: string = REPO_ROOT): TopicVersion {
  const v = loadVersion(root, slug, version);
  return { cutDate: v.meta.cut, provenance: v.provenance };
}

/**
 * The CURRENT version's cut date alone — see `getTopicVersion` above for the
 * full rationale (freshness keys on the cut, not `frontmatter.last_researched`,
 * per docs/design-system.md § Graphical UI's freshness rule). Kept separate
 * from `getTopic` so its existing fail-closed contract (and its test suite's
 * fixtures, none of which stage a `versions/vN/` tree) are undisturbed.
 */
export function getTopicCutDate(slug: string, version: number, root: string = REPO_ROOT): string {
  return getTopicVersion(slug, version, root).cutDate;
}

/**
 * The topic's changelog entries for `/[topic]/changelog/` and `/changelog/`
 * (03-api-design.md, `loadChangelog`) — newest first, exactly as the loader
 * returns them. `bodyHtml` gets the same mermaid-space reservation `getTopic`
 * applies to the article body (`reserveMermaidSpace`): a changelog entry's
 * prose goes through the identical `renderMarkdown` pipeline as the article
 * (Slice 3.1's hardened pipeline included), so it can carry a mermaid fence
 * too, and the CLS-reservation concern applies equally there.
 *
 * Throw contract mirrors `loadChangelog`: `ContentNotFoundError` when
 * `changelog.md` is missing, `ContentValidationError` for a malformed entry —
 * both propagate uncaught, exactly like every other loader this data layer
 * wraps ("currency is never guessed" extends to the changelog: an
 * author-corrupted changelog must fail the build, not render a partial
 * timeline).
 */
export function getTopicChangelog(slug: string, root: string = REPO_ROOT): ChangelogEntry[] {
  return loadChangelog(root, slug).map((entry) => ({
    ...entry,
    bodyHtml: reserveMermaidSpace(entry.bodyHtml),
  }));
}

/**
 * One row of the Version History ledger (01-ui-design.md, `/[topic]/history/`):
 * the version number, its snapshot's cut date (`loadVersion`'s
 * `VersionSnapshot.cut` — the same currency key the trust header's freshness
 * dot uses, never `last_researched`), and the stance disposition the
 * changelog entry AT THAT VERSION recorded (`held`/`bent`/`reversed`, `null`
 * only for v1 — the founding entry has no predecessor to hold against).
 * Newest first, matching the view's row order.
 */
export interface VersionHistoryEntry {
  version: number;
  cutDate: string;
  stance: 'held' | 'bent' | 'reversed' | null;
}

/**
 * `currentVersion` is supplied by the caller (already holding
 * `getTopic(slug).frontmatter.version` at render time) rather than
 * re-derived here — the same "read once, pass in" shape `getTopicVersion`'s
 * doc comment explains — so this function only needs to know how far to walk
 * `versions/vN/`, not re-load the live topic itself.
 */
export function getVersionHistory(
  slug: string,
  currentVersion: number,
  root: string = REPO_ROOT
): VersionHistoryEntry[] {
  const stanceByVersion = new Map(
    getTopicChangelog(slug, root).map((entry) => [entry.version, entry.stance])
  );
  const rows: VersionHistoryEntry[] = [];
  for (let n = currentVersion; n >= 1; n--) {
    const { meta } = loadVersion(root, slug, n);
    rows.push({ version: n, cutDate: meta.cut, stance: stanceByVersion.get(n) ?? null });
  }
  return rows;
}

/**
 * One immutable snapshot's rendered form for `/[topic]/v/[n]/`'s archived
 * state (`n` < the live version) — `loadVersion`'s `meta`/`article`/
 * `provenance`, minus `articleMd` (no caller here needs the raw text) and
 * `skillDir` (a filesystem path with no reader on this page — the archived
 * skill payload's PUBLIC url, `/skills/<slug>/v/<n>/`, is a fixed string
 * template the page builds directly, per the Skill payload distribution
 * contract in 03-api-design.md, not a value this loader returns).
 *
 * `superseded`/`current` is deliberately NOT computed or returned here —
 * `loadVersion`'s own design rationale says that label is always a
 * comparison against the live article's version, which the caller already
 * holds (`getTopic(slug).frontmatter.version`); this function reads exactly
 * one version directory, same as `loadVersion` itself.
 */
export interface ArchivedVersion {
  version: number;
  cutDate: string;
  article: RenderedDoc;
  provenance: ProvenanceRecord;
}

export function getArchivedVersion(slug: string, n: number, root: string = REPO_ROOT): ArchivedVersion {
  const version = loadVersion(root, slug, n);
  return {
    version: version.meta.version,
    cutDate: version.meta.cut,
    article: { html: reserveMermaidSpace(version.article.html), toc: version.article.toc },
    provenance: version.provenance,
  };
}

/**
 * Every topic's changelog entries, flattened and merged newest-first, for
 * `/changelog/` — the Site-Wide Changelog (01-ui-design.md). Fails closed via
 * `sweepOrThrow` exactly like `listTopicCards`: a malformed topic or a
 * mis-resolved root must not ship a partial or silently-empty feed page.
 * Sorted by `date` descending — ties (same-day cuts across topics) keep
 * `listTopics`' slug-ascending order, `Array#sort`'s documented stability.
 */
export interface SiteChangelogEntry {
  topicSlug: string;
  topicTitle: string;
  version: number;
  date: string;
  bodyHtml: string;
}

export function listSiteChangelog(root: string = REPO_ROOT): SiteChangelogEntry[] {
  return sweepOrThrow(root)
    .flatMap((topic) =>
      getTopicChangelog(topic.topic, root).map((entry) => ({
        topicSlug: topic.topic,
        topicTitle: topic.title,
        version: entry.version,
        date: entry.date,
        bodyHtml: entry.bodyHtml,
      }))
    )
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
