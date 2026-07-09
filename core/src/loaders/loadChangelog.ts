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

  return entries;
}
