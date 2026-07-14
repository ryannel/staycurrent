// Canonical contract for @staycurrent/core — CAPTURED from built code, not authored.
// Source of truth: core/dist/*.d.ts (tsc-emitted from core/src). Regenerate: pnpm --filter @staycurrent/core build, then re-copy.
// Captured at bet close: first-living-topic. The embedded-core equivalent of a served openapi.yaml —
// architecture/index.md: content-core's contract is 'a typed module API plus the topics/ filesystem contract, not OpenAPI'.

// ======================================================================
// core/dist/index.d.ts
// ======================================================================
export * from './types.js';
export * from './errors.js';
export { renderMarkdown } from './render/renderMarkdown.js';
export { listTopics } from './loaders/listTopics.js';
export { loadTopic } from './loaders/loadTopic.js';
export { loadChangelog } from './loaders/loadChangelog.js';
export { loadVersion } from './loaders/loadVersion.js';
export { loadResearchLog } from './loaders/loadResearchLog.js';
export { buildRss } from './buildRss.js';
export { runPublishGate } from './runPublishGate.js';
export { createTopic } from './cut/createTopic.js';
export { stageCut } from './cut/stageCut.js';
export { executeCut } from './cut/executeCut.js';
export { convene } from './session/convene.js';
export { recordNoCut } from './session/recordNoCut.js';
export { discardSession } from './session/discardSession.js';
export { reconcile } from './session/reconcile.js';
//# sourceMappingURL=index.d.ts.map
// ======================================================================
// core/dist/types.d.ts
// ======================================================================
export interface TopicFrontmatter {
    topic: string;
    title: string;
    stance: string;
    version: number;
    status: 'current' | 'in-research';
    cadence: `${number}d`;
    last_researched: string;
}
export interface TopicSummary extends TopicFrontmatter {
    due: boolean;
}
export interface VersionSnapshot {
    version: number;
    cut: string;
}
export interface ChangelogEntry {
    version: number;
    date: string;
    bodyMd: string;
    bodyHtml: string;
    stance: 'held' | 'bent' | 'reversed' | null;
}
export interface ProvenanceRecord {
    sources: Source[];
    synthesis: string[];
}
export interface Source {
    title: string;
    url: string;
    accessed: string;
    supports: string;
}
export interface ResearchLogEntry {
    date: string;
    outcome: 'cut' | 'no-cut';
    version?: number;
    lines: string[];
}
export interface TocEntry {
    depth: number;
    text: string;
    id: string;
}
export interface RenderedDoc {
    html: string;
    toc: TocEntry[];
}
export type GateCheckId = 'snapshot-complete' | 'changelog-top-entry' | 'article-version-match' | 'skill-version-match' | 'skill-byte-identical' | 'provenance-non-empty' | 'slug-matches-dirname' | 'reserved-slug' | 'cadence-date-valid' | 'frontmatter-schema' | 'changelog-schema';
export interface GateFailure {
    check: GateCheckId;
    path: string;
    message: string;
}
export interface GateResult {
    ok: boolean;
    failures: GateFailure[];
    dir: string;
}
export interface RenderMarkdownOptions {
    mermaid?: boolean;
    headingIdPrefix?: string;
}
export interface PublishGateOptions {
    now?: Date;
}
export interface Topic {
    frontmatter: TopicFrontmatter;
    due: boolean;
    body: RenderedDoc;
    bodyMd: string;
}
export interface Version {
    meta: VersionSnapshot;
    article: RenderedDoc;
    articleMd: string;
    skillDir: string;
    provenance: ProvenanceRecord;
}
export interface TopicError {
    slug: string;
    message: string;
}
export interface TopicSweep {
    topics: TopicSummary[];
    errors: TopicError[];
}
export interface StagedCut {
    dir: string;
    topic: string;
    version: number;
}
export interface CreateTopicOptions {
    title: string;
}
export interface CutReport {
    topic: string;
    version: number;
    paths: string[];
    removed: string[];
}
export interface NoCutInput {
    lastResearched: string;
    researchLogLines: string[];
}
export interface ConveneResult {
    topic: string;
    againstVersion: number;
    stagedDir: string;
}
export interface ReconcileOptions {
    sessionExists?: boolean;
    sessions?: Record<string, boolean>;
}
export interface ReconcileReport {
    reverted: string[];
}
export interface SiteConfig {
    name: string;
    url: string;
    description: string;
    author: string;
}
//# sourceMappingURL=types.d.ts.map
// ======================================================================
// core/dist/errors.d.ts
// ======================================================================
import type { GateFailure } from './types.js';
export declare class ContentValidationError extends Error {
    readonly topic: string;
    readonly file: string;
    readonly issues: string[];
    constructor(topic: string, file: string, issues: string[]);
}
export declare class ContentNotFoundError extends Error {
    readonly topic: string;
    readonly path: string;
    constructor(topic: string, path: string);
}
export declare class GateNotPassedError extends Error {
    readonly failures: GateFailure[];
    constructor(failures: GateFailure[], message?: string);
}
//# sourceMappingURL=errors.d.ts.map
// ======================================================================
// core/dist/frontmatter.d.ts
// ======================================================================
import type { TopicFrontmatter, VersionSnapshot } from './types.js';
export interface FieldValidation<T> {
    value?: T;
    issues: string[];
}
/**
 * True iff `value` carries no visible content once zero-width/format
 * characters are removed — the blank check every `title`/`stance` field
 * shares (validator here, `createTopic`'s pre-write guard elsewhere).
 */
export declare function isBlankField(value: string): boolean;
/**
 * Validates a topic's live `article.md` frontmatter against the schema
 * `04-data-design.md` fixes for `topics/<slug>/article.md`, and the `topic ===
 * slug` reconciliation check `03-api-design.md`'s `loadTopic` names.
 */
export declare function validateTopicFrontmatter(data: Record<string, unknown>, slug: string): FieldValidation<TopicFrontmatter>;
/**
 * Validates a frozen `versions/vN/article.md` frontmatter: exactly `version` and
 * `cut` — any other key (`status` included) is rejected (`03-api-design.md`'s
 * `loadVersion` Errors; `04-data-design.md`'s Version Snapshot Frontmatter).
 */
export declare function validateVersionFrontmatter(data: Record<string, unknown>): FieldValidation<VersionSnapshot>;
//# sourceMappingURL=frontmatter.d.ts.map
// ======================================================================
// core/dist/runPublishGate.d.ts
// ======================================================================
import type { GateResult, PublishGateOptions } from './types.js';
export interface VersionScan {
    n: number;
    dirCount: number;
}
/**
 * N is the highest version number present as a `versions/vN/` subdirectory inside
 * `dir` (03-api-design.md, Publish gate, "How N is derived") — a numeric max, not a
 * lexicographic one ('v9' must not beat 'v10' by string comparison). Exported so
 * `executeCut` (Cut mechanics) derives the same N from the staged tree instead of
 * re-implementing the scan.
 */
export declare function scanVersions(dir: string): VersionScan;
/**
 * The one place gate logic exists (ADR 0003): validates that `dir`, treated as a
 * topic-shaped directory, is internally consistent across all eleven `GateCheckId`
 * checks (03-api-design.md, Publish gate; change-proposal-7 added check 11). Never
 * throws for a content violation — every violation becomes a `GateFailure`; only a
 * nonexistent (or non-directory) `dir` propagates a raw fs error, a usage error
 * rather than a content problem.
 */
export declare function runPublishGate(dir: string, opts?: PublishGateOptions): GateResult;
//# sourceMappingURL=runPublishGate.d.ts.map
// ======================================================================
// core/dist/buildRss.d.ts
// ======================================================================
import type { SiteConfig } from './types.js';
/**
 * Builds the site-wide `rss.xml` feed body (03-api-design.md, `buildRss`):
 * every `ChangelogEntry` across every topic, newest first, capped at the 50
 * most recent — "the RSS item is the entry, verbatim" (design system). Sole
 * caller: `services/site`'s `prebuild` script, which reads `site.config.json`
 * and writes the returned string to `public/rss.xml` — this function stays
 * pure (no fs write of its own) so it is testable without a real build.
 *
 * Fails closed exactly like the site's own `sweepOrThrow` (`lib/content.ts`):
 * a non-empty `errors` from the internal `listTopics` sweep means the feed
 * never builds from a partially valid catalogue, so `ContentValidationError`
 * propagates and the site's prebuild — and with it `next build` — fails.
 */
export declare function buildRss(root: string, config: SiteConfig): string;
//# sourceMappingURL=buildRss.d.ts.map
// ======================================================================
// core/dist/parseProvenance.d.ts
// ======================================================================
import type { ProvenanceRecord } from './types.js';
/**
 * Parses `versions/vN/provenance.md`'s `## Sources` / `## Synthesis` bullet
 * grammar. Throws `ContentValidationError` naming the offending line on a bullet
 * that doesn't match its section's grammar, and on any `## ` heading other than
 * the two the anatomy defines — a bullet must never be silently dropped or
 * misattributed to the wrong section.
 */
export declare function parseProvenance(raw: string, slug: string, file: string): ProvenanceRecord;
//# sourceMappingURL=parseProvenance.d.ts.map
// ======================================================================
// core/dist/dates.d.ts
// ======================================================================
/** Normalize a raw frontmatter value that should be an ISO date into its string form. */
export declare function normalizeDateValue(value: unknown): string | undefined;
/** True iff `value` is a syntactically and calendrically valid YYYY-MM-DD date. */
export declare function isIsoDate(value: string): boolean;
/** due = last_researched + cadence(days) < today (UTC calendar day comparison). */
export declare function computeDue(lastResearched: string, cadence: string): boolean;
//# sourceMappingURL=dates.d.ts.map
// ======================================================================
// core/dist/slug.d.ts
// ======================================================================
export declare const RESERVED_SLUGS: Set<string>;
export declare const SLUG_RE: RegExp;
/** Throws ContentValidationError unless `slug` is kebab-case, ≤3 words, unreserved. */
export declare function assertValidSlug(slug: string): void;
//# sourceMappingURL=slug.d.ts.map
// ======================================================================
// core/dist/write.d.ts
// ======================================================================
/** Today's date as an ISO YYYY-MM-DD string (UTC calendar day). */
export declare function todayIso(): string;
/**
 * Writes a frontmatter + body markdown file, serializing `data` through js-yaml's
 * CORE_SCHEMA dumper — the write-side mirror of `loaders/shared.ts`'s CORE_SCHEMA
 * parser, so a value this module writes reads back byte-for-byte the same shape it
 * was given (no timestamp coercion in either direction). `lineWidth: -1` disables
 * folding so a long `stance`/`title` string stays a single plain scalar line rather
 * than wrapping into a YAML block style.
 */
export declare function writeMatterFile(filePath: string, data: Record<string, unknown>, body: string): void;
/**
 * Replaces one top-level `field: value` line inside `raw`'s frontmatter block,
 * leaving every other byte of the file — the rest of the frontmatter, and the
 * entire body — untouched. Used for the single-field stamps Cut/Session mechanics
 * make (`status`, `last_researched`) so a stamp never risks reformatting content a
 * loader or a human authored (03-api-design.md: convene/recordNoCut/discardSession/
 * reconcile all stamp the working tree, never rewrite it wholesale).
 *
 * Callers only ever invoke this after validating the file's frontmatter schema, so
 * `field` is guaranteed present; the two throws below guard a structural bug in that
 * assumption rather than a documented content-validation case.
 */
export declare function replaceFrontmatterField(raw: string, field: string, value: string): string;
/**
 * Inserts one `## <heading>` section at the top of the log — the newest-first,
 * append-only-at-top shape `research-log.md` and `changelog.md` share
 * (04-data-design.md). `bodyLines` become the section's body, one array entry per
 * line, matching the grammar `loadResearchLog`/`loadChangelog` parse back out.
 *
 * Normally the entry lands immediately after the H1 line; a log whose first line is
 * already a `## ` heading (no H1) gets the entry inserted above it — never after,
 * which would silently reattribute the new body to the old entry.
 */
export declare function prependLogSection(raw: string, heading: string, bodyLines: string[]): string;
/**
 * Builds a directory's contents in a hidden temp sibling, then renames it into
 * place — the atomic-seed rule from change-proposal-1's review: a crash mid-seed
 * leaves only a dot-prefixed temp directory that no slug-addressed path ever
 * resolves to, never a partial `<slug>/` tree that blocks retries or masquerades
 * as an authored draft.
 *
 * Returns true when `finalDir` was created by this call; false when the rename
 * found `finalDir` already present (lost a race — the caller decides whether that
 * is an idempotent success or a conflict). Build errors clean up the temp
 * directory and propagate.
 */
export declare function buildDirAtomically(finalDir: string, build: (tmpDir: string) => void): boolean;
//# sourceMappingURL=write.d.ts.map
