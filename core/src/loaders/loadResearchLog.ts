import path from 'node:path';
import type { ResearchLogEntry } from '../types.js';
import { isIsoDate } from '../dates.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { readTextFile } from './shared.js';

const CUT_HEADING_RE = /^##\s*(\d{4}-\d{2}-\d{2})\s*—\s*cut\s*v(\d+)\s*$/;
const NO_CUT_HEADING_RE = /^##\s*(\d{4}-\d{2}-\d{2})\s*—\s*no-cut\s*$/;

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
 * Parses `research-log.md` into structured entries, newest first
 * (03-api-design.md, `loadResearchLog`).
 */
export function loadResearchLog(root: string, slug: string): ResearchLogEntry[] {
  const relPath = `topics/${slug}/research-log.md`;
  const raw = readTextFile(path.join(root, 'topics', slug, 'research-log.md'));
  if (raw === undefined) {
    throw new ContentNotFoundError(slug, relPath);
  }

  return splitSections(raw).map((section) => {
    const cutMatch = CUT_HEADING_RE.exec(section.headingLine);
    const noCutMatch = NO_CUT_HEADING_RE.exec(section.headingLine);

    if (!cutMatch && !noCutMatch) {
      throw new ContentValidationError(slug, relPath, [
        `heading '${section.headingLine}' does not match '## YYYY-MM-DD — cut vN' or '## YYYY-MM-DD — no-cut'`,
      ]);
    }

    const date = (cutMatch ?? noCutMatch)![1];
    if (!isIsoDate(date)) {
      throw new ContentValidationError(slug, relPath, [
        `heading '${section.headingLine}' carries an invalid date '${date}'`,
      ]);
    }

    const lines = section.bodyLines.map((line) => line.trim()).filter((line) => line.length > 0);

    if (cutMatch) {
      const version = Number(cutMatch[2]);
      if (!Number.isInteger(version) || version <= 0) {
        throw new ContentValidationError(slug, relPath, [
          `heading '${section.headingLine}' carries no parseable version number`,
        ]);
      }
      return { date, outcome: 'cut' as const, version, lines };
    }

    return { date, outcome: 'no-cut' as const, lines };
  });
}
