import { ContentValidationError } from './errors.js';
import { isIsoDate } from './dates.js';
import type { ProvenanceRecord, Source } from './types.js';

// 03-api-design.md, loadVersion Design rationale: the bullet grammar fixed here is
// the parseable contract every provenance record must follow.
const SOURCE_BULLET_RE =
  /^-\s*\[(.+?)\]\((.+?)\)\s*—\s*accessed\s*(\d{4}-\d{2}-\d{2})\s*—\s*supports:\s*(.+)$/;
const SYNTHESIS_BULLET_RE = /^-\s*(.+)$/;
const H2_RE = /^##\s+(.+?)\s*$/;

/**
 * Parses `versions/vN/provenance.md`'s `## Sources` / `## Synthesis` bullet
 * grammar. Throws `ContentValidationError` naming the offending line on a bullet
 * that doesn't match its section's grammar, and on any `## ` heading other than
 * the two the anatomy defines — a bullet must never be silently dropped or
 * misattributed to the wrong section.
 */
export function parseProvenance(raw: string, slug: string, file: string): ProvenanceRecord {
  const sources: Source[] = [];
  const synthesis: string[] = [];
  let section: 'sources' | 'synthesis' | null = null;

  for (const rawLine of raw.split('\n')) {
    const line = rawLine.trim();

    const headingMatch = H2_RE.exec(line);
    if (headingMatch) {
      const name = headingMatch[1];
      if (name === 'Sources') {
        section = 'sources';
      } else if (name === 'Synthesis') {
        section = 'synthesis';
      } else {
        throw new ContentValidationError(slug, file, [
          `unexpected heading '## ${name}' — provenance carries only ## Sources and ## Synthesis`,
        ]);
      }
      continue;
    }

    if (line === '' || (line.startsWith('# ') && !line.startsWith('## '))) continue;

    if (section === 'sources') {
      const match = SOURCE_BULLET_RE.exec(line);
      if (!match) {
        throw new ContentValidationError(slug, file, [
          `Sources bullet '${line}' does not match '- [<title>](<url>) — accessed <YYYY-MM-DD> — supports: <claim>'`,
        ]);
      }
      if (!isIsoDate(match[3])) {
        throw new ContentValidationError(slug, file, [
          `Sources bullet '${line}' has an invalid accessed date '${match[3]}'`,
        ]);
      }
      sources.push({ title: match[1], url: match[2], accessed: match[3], supports: match[4] });
    } else if (section === 'synthesis') {
      const match = SYNTHESIS_BULLET_RE.exec(line);
      if (!match) {
        throw new ContentValidationError(slug, file, [
          `Synthesis bullet '${line}' does not match '- <claim>'`,
        ]);
      }
      synthesis.push(match[1]);
    }
    // Non-heading lines before the first recognized section (e.g. stray prose
    // under the H1) are ignored; every `## ` heading is checked above.
  }

  return { sources, synthesis };
}
