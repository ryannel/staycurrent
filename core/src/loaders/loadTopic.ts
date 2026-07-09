import fs from 'node:fs';
import path from 'node:path';
import type { Topic } from '../types.js';
import { computeDue } from '../dates.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { validateTopicFrontmatter } from '../frontmatter.js';
import { renderMarkdown } from '../render/renderMarkdown.js';
import { readMatterFile } from './shared.js';

/**
 * Loads one topic's full live state (03-api-design.md, `loadTopic`).
 *
 * Throw contract: `ContentNotFoundError` is reserved strictly for a missing
 * `topics/<slug>/` directory. A directory that exists but has no `article.md`,
 * or whose frontmatter fails schema validation or `frontmatter.topic !== slug`,
 * throws `ContentValidationError` — mirroring `loadVersion` and the sweep,
 * which reports the same condition as a per-topic validation error.
 */
export function loadTopic(root: string, slug: string): Topic {
  const topicDir = path.join(root, 'topics', slug);

  // Single statSync instead of existsSync+statSync — no TOCTOU window.
  let stat: fs.Stats;
  try {
    stat = fs.statSync(topicDir);
  } catch {
    throw new ContentNotFoundError(slug, `topics/${slug}`);
  }
  if (!stat.isDirectory()) {
    throw new ContentNotFoundError(slug, `topics/${slug}`);
  }

  const relPath = `topics/${slug}/article.md`;
  const parsed = readMatterFile(path.join(topicDir, 'article.md'), slug, relPath);
  if (!parsed) {
    throw new ContentValidationError(slug, relPath, ['article.md is missing']);
  }

  const result = validateTopicFrontmatter(parsed.data, slug);
  if (result.issues.length > 0) {
    throw new ContentValidationError(slug, relPath, result.issues);
  }

  const fm = result.value!;
  return {
    frontmatter: fm,
    due: computeDue(fm.last_researched, fm.cadence),
    body: renderMarkdown(parsed.content),
    bodyMd: parsed.content,
  };
}
