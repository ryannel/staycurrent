import fs from 'node:fs';
import path from 'node:path';
import type { TopicError, TopicSummary, TopicSweep } from '../types.js';
import { computeDue } from '../dates.js';
import { ContentValidationError } from '../errors.js';
import { validateTopicFrontmatter } from '../frontmatter.js';
import { readMatterFile } from './shared.js';

/**
 * The frontmatter sweep (03-api-design.md, `listTopics`): every catalogue
 * question answers from this one call. Never throws for a malformed topic or a
 * zero-topic root — both are reported, not exceptional.
 */
export function listTopics(root: string): TopicSweep {
  const topicsDir = path.join(root, 'topics');

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(topicsDir, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return { topics: [], errors: [] };
    }
    throw err;
  }

  const slugs = entries
    .filter((entry) => {
      if (entry.isDirectory()) return true;
      // Dirent.isDirectory() is false for a symlink even when it points at a
      // directory — stat (which follows links) so a symlinked topic is never
      // silently absent from the sweep. A broken link is simply not a topic.
      if (entry.isSymbolicLink()) {
        try {
          return fs.statSync(path.join(topicsDir, entry.name)).isDirectory();
        } catch {
          return false;
        }
      }
      return false;
    })
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const topics: TopicSummary[] = [];
  const errors: TopicError[] = [];

  for (const slug of slugs) {
    const relPath = `topics/${slug}/article.md`;

    let parsed;
    try {
      parsed = readMatterFile(path.join(topicsDir, slug, 'article.md'), slug, relPath);
    } catch (err) {
      // A YAML/frontmatter parse failure is a per-topic validation error the
      // sweep reports, never a throw that hides the rest of the catalogue.
      if (err instanceof ContentValidationError) {
        errors.push({ slug, message: err.message });
        continue;
      }
      throw err;
    }

    if (!parsed) {
      errors.push({ slug, message: `${relPath}: missing article.md` });
      continue;
    }

    const result = validateTopicFrontmatter(parsed.data, slug);
    if (result.issues.length > 0) {
      errors.push({ slug, message: `${relPath}: ${result.issues.join('; ')}` });
      continue;
    }

    const fm = result.value!;
    topics.push({ ...fm, due: computeDue(fm.last_researched, fm.cadence) });
  }

  topics.sort((a, b) => a.topic.localeCompare(b.topic));
  return { topics, errors };
}
