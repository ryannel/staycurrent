import path from 'node:path';
import type { ChangelogEntry } from '../types.js';
import { isIsoDate } from '../dates.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { renderMarkdown } from '../render/renderMarkdown.js';
import { readTextFile } from './shared.js';

const HEADING_RE = /^##\s*v(\d+)\s*—\s*(\d{4}-\d{2}-\d{2})\s*$/;
// Detect any Stance line value-agnostically first, then validate the value —
// so a v1 entry with ANY stance line and a non-v1 entry with an out-of-set
// value each get the precise error, not a generic "no parseable line".
const STANCE_LINE_RE = /^\*\*Stance:\*\*\s*(.*)$/m;
const STANCE_VALUE_RE = /^(held|bent|reversed)\b/;

interface Section {
  headingLine: string;
  bodyLines: string[];
}

function splitSections(raw: string): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;
  for (const line of raw.split('\n')) {
    if (line.startsWith('## ')) {
      current = { headingLine: line.trimEnd(), bodyLines: [] };
      sections.push(current);
    } else if (current) {
      current.bodyLines.push(line);
    }
  }
  return sections;
}

/**
 * Parses `changelog.md` into structured, rendered entries, newest first
 * (03-api-design.md, `loadChangelog`).
 */
export function loadChangelog(root: string, slug: string): ChangelogEntry[] {
  const relPath = `topics/${slug}/changelog.md`;
  const raw = readTextFile(path.join(root, 'topics', slug, 'changelog.md'));
  if (raw === undefined) {
    throw new ContentNotFoundError(slug, relPath);
  }

  const entries: ChangelogEntry[] = [];
  let prevVersion: number | null = null;

  for (const section of splitSections(raw)) {
    const match = HEADING_RE.exec(section.headingLine);
    if (!match) {
      throw new ContentValidationError(slug, relPath, [
        `heading '${section.headingLine}' does not match '## vN — YYYY-MM-DD'`,
      ]);
    }

    const version = Number(match[1]);
    const date = match[2];

    if (version < 1) {
      throw new ContentValidationError(slug, relPath, [
        `heading '${section.headingLine}' version must be a positive integer`,
      ]);
    }

    if (!isIsoDate(date)) {
      throw new ContentValidationError(slug, relPath, [
        `heading '${section.headingLine}' carries an invalid date '${date}'`,
      ]);
    }

    if (prevVersion !== null && version !== prevVersion - 1) {
      throw new ContentValidationError(slug, relPath, [
        `entries are not strictly version-descending: '## v${prevVersion}' is followed by '## v${version}', expected v${prevVersion - 1}`,
      ]);
    }
    prevVersion = version;

    const bodyMd = section.bodyLines.join('\n').trim();
    const stanceLineMatch = STANCE_LINE_RE.exec(bodyMd);
    let stance: 'held' | 'bent' | 'reversed' | null = null;

    if (version === 1) {
      if (stanceLineMatch) {
        throw new ContentValidationError(slug, relPath, [
          "'## v1' founding entry must not carry a '**Stance:**' line",
        ]);
      }
    } else {
      if (!stanceLineMatch) {
        throw new ContentValidationError(slug, relPath, [
          `'## v${version}' entry has no parseable '**Stance:**' line (must be held | bent | reversed)`,
        ]);
      }
      const valueMatch = STANCE_VALUE_RE.exec(stanceLineMatch[1].trim());
      if (!valueMatch) {
        throw new ContentValidationError(slug, relPath, [
          `'## v${version}' entry's Stance value '${stanceLineMatch[1].trim()}' is outside held | bent | reversed`,
        ]);
      }
      stance = valueMatch[1] as 'held' | 'bent' | 'reversed';
    }

    entries.push({
      version,
      date,
      bodyMd,
      // Namespace each entry's generated heading ids by its version so a
      // changelog page concatenating several rendered entries never collides
      // on one DOM (03-api-design.md, renderMarkdown Design rationale).
      bodyHtml: renderMarkdown(bodyMd, { headingIdPrefix: `v${version}-` }).html,
      stance,
    });
  }

  // Fail-closed completeness, extending the strict-descending check above:
  // every topic's founding cut writes a '## v1' entry (createTopic's
  // writeFoundingSkeleton), so a changelog that parses to zero entries, or
  // whose earliest parsed entry isn't v1, was edited outside the action
  // contract — a gap left above v1 (e.g. an operator deleted the founding
  // entry) or a v1 entry SWALLOWED by a typo'd heading (e.g. '##v1 — ...'
  // with no space, which `splitSections` never recognises as a section at
  // all, silently dropping it into the previous entry's body or off the
  // front of the file) both surface here as "the earliest entry present
  // isn't v1" — one check catches both, no need to tell them apart.
  // `lib/content.ts`'s `getVersionHistory` doc comment ("null only for v1")
  // depends on this: without it, a v1-less changelog would let a NON-v1 row
  // read as the founding entry.
  if (entries.length === 0) {
    throw new ContentValidationError(slug, relPath, [
      "changelog has no parseable version entries — expected at least the founding '## v1' entry",
    ]);
  }
  const earliestVersion = entries[entries.length - 1].version;
  if (earliestVersion !== 1) {
    throw new ContentValidationError(slug, relPath, [
      `entries do not run contiguously down to the founding '## v1' entry — the earliest entry present is '## v${earliestVersion}'`,
    ]);
  }

  return entries;
}
