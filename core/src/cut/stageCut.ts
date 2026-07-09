import fs from 'node:fs';
import path from 'node:path';
import type { StagedCut } from '../types.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { validateTopicFrontmatter } from '../frontmatter.js';
import { readMatterFile } from '../loaders/shared.js';
import { assertValidSlug } from '../slug.js';
import { buildDirAtomically } from '../write.js';

/**
 * Seeds the staged baseline for an existing topic's research run: copies the
 * complete committed `topics/<slug>/` tree into `.staycurrent/staged/<slug>/`,
 * touching nothing under `topics/` (03-api-design.md, `stageCut`). Action-contract
 * step 1.
 *
 * Idempotent re-seed: when the staged tree already exists, leaves it intact and
 * returns it — re-entering an interrupted run never destroys authored drafts.
 * Seeding is atomic (temp sibling + rename), so a crash mid-copy never leaves a
 * partial staged tree masquerading as an authored draft.
 */
export function stageCut(root: string, slug: string): StagedCut {
  assertValidSlug(slug);
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

  const relPath = `topics/${slug}/article.md`;
  const parsed = readMatterFile(path.join(topicDir, 'article.md'), slug, relPath);
  if (!parsed) {
    throw new ContentValidationError(slug, relPath, ['article.md is missing']);
  }
  const result = validateTopicFrontmatter(parsed.data, slug);
  if (result.issues.length > 0) {
    throw new ContentValidationError(slug, relPath, result.issues);
  }

  const stagedDir = path.join(root, '.staycurrent', 'staged', slug);
  if (!fs.existsSync(stagedDir)) {
    // A lost rename race (buildDirAtomically returning false) means the staged
    // tree appeared meanwhile — exactly the idempotent-re-seed case: leave it.
    buildDirAtomically(stagedDir, (tmpDir) => fs.cpSync(topicDir, tmpDir, { recursive: true }));
  }

  return { dir: stagedDir, topic: slug, version: result.value!.version + 1 };
}
