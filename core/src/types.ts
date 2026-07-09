// Exported contract types — copied verbatim (field names and shapes) from
// technical-design/03-api-design.md "Exported types" and "Additional supporting
// types". Implementation bodies live elsewhere; this module is the compiled,
// type-checked record of the shapes every caller programs against.

export interface TopicFrontmatter {
  topic: string; // kebab-case slug; must equal the parent directory name
  title: string;
  stance: string; // one-sentence committed position
  version: number; // positive integer, monotonic — increments only at a cut
  status: 'current' | 'in-research'; // the only two stored values, ever — `due` is never stored
  cadence: `${number}d`; // research interval, e.g. '90d'
  last_researched: string; // ISO 8601 date, YYYY-MM-DD
}

export interface TopicSummary extends TopicFrontmatter {
  due: boolean; // derived: last_researched + cadence(days) < today; independent of `status`
}

export interface VersionSnapshot {
  version: number; // matches the versions/vN/ directory number
  cut: string; // ISO 8601 date the snapshot was written
}

export interface ChangelogEntry {
  version: number;
  date: string; // ISO 8601 date, parsed from '## vN — YYYY-MM-DD'
  bodyMd: string; // the entry body, heading line stripped
  bodyHtml: string; // bodyMd rendered through renderMarkdown()
  stance: 'held' | 'bent' | 'reversed' | null; // null only for the v1 founding entry
}

export interface ProvenanceRecord {
  sources: Source[];
  synthesis: string[]; // one entry per '## Synthesis' bullet, stated plainly
}

export interface Source {
  title: string;
  url: string;
  accessed: string; // ISO 8601 date
  supports: string; // free text: which claim(s) this source backs
}

export interface ResearchLogEntry {
  date: string; // ISO 8601 date
  outcome: 'cut' | 'no-cut';
  version?: number; // present only when outcome === 'cut' — the version produced
  lines: string[]; // 2-4 factual lines, one array entry per line
}

export interface TocEntry {
  depth: number; // 1-6, the heading's level
  text: string;
  id: string; // the generated heading-anchor id
}

export interface RenderedDoc {
  html: string;
  toc: TocEntry[];
}

export type GateCheckId =
  | 'snapshot-complete'
  | 'changelog-top-entry'
  | 'article-version-match'
  | 'skill-version-match'
  | 'skill-byte-identical'
  | 'provenance-non-empty'
  | 'slug-matches-dirname'
  | 'reserved-slug'
  | 'cadence-date-valid';

export interface GateFailure {
  check: GateCheckId;
  path: string; // dir-relative path of the offending artifact
  message: string; // human-readable
}

export interface GateResult {
  ok: boolean;
  failures: GateFailure[]; // empty iff ok === true
}

// --- Additional supporting types needed to give this slice's functions
// complete, typeable signatures (03-api-design.md, "Additional supporting types") ---

export interface RenderMarkdownOptions {
  mermaid?: boolean; // default true — rewrite ```mermaid fences into the client-rendered diagram marker
  headingIdPrefix?: string; // default '' — namespaces generated heading-anchor ids
}

export interface PublishGateOptions {
  now?: Date; // injectable clock for the cadence-date-valid check; defaults to the current date
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
  skillDir: string; // root-relative fs path to versions/vN/skill/
  provenance: ProvenanceRecord;
}

export interface TopicError {
  slug: string;
  message: string; // what failed schema validation, naming the file and field
}

export interface TopicSweep {
  topics: TopicSummary[]; // every topic that parsed and validated
  errors: TopicError[]; // every topic that did not — the sweep never fails fast
}
