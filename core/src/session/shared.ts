import fs from 'node:fs';
import path from 'node:path';
import type { TopicFrontmatter } from '../types.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { validateTopicFrontmatter } from '../frontmatter.js';
import { readMatterFile } from '../loaders/shared.js';

export interface LoadedArticle {
  articlePath: string; // absolute path to topics/<slug>/article.md
  relPath: string; // topics/<slug>/article.md
  raw: string; // exact on-disk bytes, for byte-preserving stamps (write.ts's replaceFrontmatterField)
  frontmatter: TopicFrontmatter;
}

/**
 * Loads and validates a topic's live `article.md` — the existence + schema check
 * every Session mechanics function opens with (convene, recordNoCut,
 * discardSession, reconcile). Mirrors `loadTopic`'s throw contract exactly:
 * `ContentNotFoundError` for a missing `topics/<slug>/`, `ContentValidationError`
 * for anything wrong inside it.
 */
export function loadLiveArticle(root: string, slug: string): LoadedArticle {
  const topicDir = path.join(root, 'topics', slug);

  let stat: fs.Stats;
  try {
    stat = fs.statSync(topicDir);
  } catch {
    throw new ContentNotFoundError(slug, `topics/${slug}`);
  }
  if (!stat.isDirectory()) {
    throw new ContentNotFoundError(slug, `topics/${slug}`);
  }

  const articlePath = path.join(topicDir, 'article.md');
  const relPath = `topics/${slug}/article.md`;
  const parsed = readMatterFile(articlePath, slug, relPath);
  if (!parsed) {
    throw new ContentValidationError(slug, relPath, ['article.md is missing']);
  }
  const result = validateTopicFrontmatter(parsed.data, slug);
  if (result.issues.length > 0) {
    throw new ContentValidationError(slug, relPath, result.issues);
  }

  return {
    articlePath,
    relPath,
    raw: fs.readFileSync(articlePath, 'utf8'),
    frontmatter: result.value!,
  };
}
