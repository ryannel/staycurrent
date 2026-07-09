import fs from 'node:fs';
import path from 'node:path';
import type { NoCutInput, ResearchLogEntry } from '../types.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { isIsoDate } from '../dates.js';
import { assertValidSlug } from '../slug.js';
import { prependLogSection, replaceFrontmatterField } from '../write.js';
import { loadLiveArticle } from './shared.js';

/**
 * The write side is no laxer than the read side: everything `recordNoCut` writes
 * must parse back out through `loadResearchLog`'s grammar and the frontmatter
 * schema, so the input is validated up front — an invalid date or a line that
 * would forge a `## ` heading is rejected before any file is touched.
 */
function validateNoCutInput(slug: string, input: NoCutInput): void {
  const issues: string[] = [];

  if (typeof input.lastResearched !== 'string' || !isIsoDate(input.lastResearched)) {
    issues.push(
      `lastResearched must be a valid ISO date (YYYY-MM-DD), got '${String(input.lastResearched)}'`
    );
  }

  if (!Array.isArray(input.researchLogLines) || input.researchLogLines.length === 0) {
    issues.push('researchLogLines must be a non-empty array of lines');
  } else {
    for (const line of input.researchLogLines) {
      if (typeof line !== 'string' || line.includes('\n') || line.includes('\r')) {
        issues.push(`researchLogLines entries must be single lines, got '${String(line)}'`);
      } else if (line.startsWith('## ')) {
        issues.push(`researchLogLines entry '${line}' would forge a log heading`);
      }
    }
  }

  if (issues.length > 0) {
    throw new ContentValidationError(slug, 'NoCutInput', issues);
  }
}

/**
 * Resolves a research run that found nothing warranting a cut: updates
 * `last_researched`, reverts `status` to `current`, appends the research-log entry
 * (03-api-design.md, `recordNoCut`). The no-cut counterpart to `executeCut` — no
 * staging directory, no five-artifact gate, because a no-cut touches only
 * `article.md`'s `last_researched`/`status` fields and one `research-log.md` entry.
 *
 * Every read and validation happens before the first write, so a failure —
 * invalid input, wrong status, missing research log — leaves the topic exactly
 * as it was: no partial resolution state.
 */
export function recordNoCut(root: string, slug: string, input: NoCutInput): ResearchLogEntry {
  assertValidSlug(slug);
  validateNoCutInput(slug, input);

  const article = loadLiveArticle(root, slug);
  if (article.frontmatter.status !== 'in-research') {
    throw new ContentValidationError(slug, article.relPath, [
      "status is not 'in-research' — a no-cut resolution presupposes a convened run",
    ]);
  }

  // Read the research log BEFORE writing anything: its absence must abort the
  // resolution with the article untouched (change-proposal-1 review patch). Every
  // topic carries a research-log.md from creation (domain/topic.md, Notes) — a
  // missing one is drift outside the action contract, not a fresh file to seed.
  const logPath = path.join(root, 'topics', slug, 'research-log.md');
  let rawLog: string;
  try {
    rawLog = fs.readFileSync(logPath, 'utf8');
  } catch {
    throw new ContentNotFoundError(slug, `topics/${slug}/research-log.md`);
  }

  let updated = replaceFrontmatterField(article.raw, 'status', 'current');
  updated = replaceFrontmatterField(updated, 'last_researched', input.lastResearched);
  fs.writeFileSync(article.articlePath, updated);

  const heading = `## ${input.lastResearched} — no-cut`;
  fs.writeFileSync(logPath, prependLogSection(rawLog, heading, input.researchLogLines));

  return { date: input.lastResearched, outcome: 'no-cut', lines: input.researchLogLines };
}
