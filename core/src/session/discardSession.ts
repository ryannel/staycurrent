import fs from 'node:fs';
import { ContentValidationError } from '../errors.js';
import { assertValidSlug } from '../slug.js';
import { replaceFrontmatterField } from '../write.js';
import { loadLiveArticle } from './shared.js';

/**
 * Abandons an unresolved run's `topics/` footprint: reverts `status` to `current`
 * in the working tree — zero other `topics/` writes, no research-log entry, no
 * `last_researched` change; abandonment is not a resolution (03-api-design.md,
 * `discardSession`). No commit follows — the `in-research` stamp only ever existed
 * in the working tree, so the revert restores the committed state exactly.
 */
export function discardSession(root: string, slug: string): void {
  assertValidSlug(slug);
  const article = loadLiveArticle(root, slug);

  if (article.frontmatter.status !== 'in-research') {
    throw new ContentValidationError(slug, article.relPath, [
      "status is not 'in-research' — nothing to discard",
    ]);
  }

  fs.writeFileSync(article.articlePath, replaceFrontmatterField(article.raw, 'status', 'current'));
}
