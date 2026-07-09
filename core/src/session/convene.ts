import fs from 'node:fs';
import type { ConveneResult } from '../types.js';
import { ContentValidationError } from '../errors.js';
import { assertValidSlug } from '../slug.js';
import { replaceFrontmatterField } from '../write.js';
import { stageCut } from '../cut/stageCut.js';
import { loadLiveArticle } from './shared.js';

/**
 * Opens a research run in one core call: seeds the staged baseline by calling
 * `stageCut` internally — the one sanctioned core-calls-core composition — and THEN
 * stamps `status: in-research` in the live `article.md` frontmatter (working tree
 * only, no commit). Seed-before-stamp is change-proposal-1's ordering: the staged
 * baseline always reads `status: current`, so the tree that later lands as
 * published truth never carries the in-research stamp.
 */
export function convene(root: string, slug: string): ConveneResult {
  assertValidSlug(slug);
  const article = loadLiveArticle(root, slug);

  if (article.frontmatter.status === 'in-research') {
    throw new ContentValidationError(slug, article.relPath, [
      "status is already 'in-research' — resume or discard the open run first",
    ]);
  }

  const staged = stageCut(root, slug);

  fs.writeFileSync(article.articlePath, replaceFrontmatterField(article.raw, 'status', 'in-research'));

  return { topic: slug, againstVersion: article.frontmatter.version, stagedDir: staged.dir };
}
