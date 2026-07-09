import fs from 'node:fs';
import path from 'node:path';
import type { Version } from '../types.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { validateVersionFrontmatter } from '../frontmatter.js';
import { parseProvenance } from '../parseProvenance.js';
import { renderMarkdown } from '../render/renderMarkdown.js';
import { readMatterFile, readTextFile } from './shared.js';

/**
 * Loads one immutable snapshot (03-api-design.md, `loadVersion`).
 *
 * Throw contract: `ContentNotFoundError` is reserved strictly for a missing
 * `versions/vN/` directory. Any missing or malformed artifact *inside* an
 * existing vN — article.md, provenance.md, bad frontmatter, a frontmatter
 * `version` that does not match the directory number — is a
 * `ContentValidationError`: the snapshot exists but is not valid.
 */
export function loadVersion(root: string, slug: string, n: number): Version {
  const versionDir = path.join(root, 'topics', slug, 'versions', `v${n}`);
  const versionRelDir = `topics/${slug}/versions/v${n}`;

  // Single statSync instead of existsSync+statSync — no TOCTOU window; any
  // failure to stat a directory here means the version is not addressable.
  let stat: fs.Stats;
  try {
    stat = fs.statSync(versionDir);
  } catch {
    throw new ContentNotFoundError(slug, versionRelDir);
  }
  if (!stat.isDirectory()) {
    throw new ContentNotFoundError(slug, versionRelDir);
  }

  const articleRel = `${versionRelDir}/article.md`;
  const parsedArticle = readMatterFile(path.join(versionDir, 'article.md'), slug, articleRel);
  if (!parsedArticle) {
    throw new ContentValidationError(slug, articleRel, ['article.md is missing']);
  }

  const fmResult = validateVersionFrontmatter(parsedArticle.data);
  if (fmResult.issues.length > 0) {
    throw new ContentValidationError(slug, articleRel, fmResult.issues);
  }

  const meta = fmResult.value!;
  if (meta.version !== n) {
    throw new ContentValidationError(slug, articleRel, [
      `frontmatter version ${meta.version} does not match directory 'v${n}'`,
    ]);
  }

  const provenanceRel = `${versionRelDir}/provenance.md`;
  const provenanceRaw = readTextFile(path.join(versionDir, 'provenance.md'));
  if (provenanceRaw === undefined) {
    throw new ContentValidationError(slug, provenanceRel, ['provenance.md is missing']);
  }

  return {
    meta,
    article: renderMarkdown(parsedArticle.content),
    articleMd: parsedArticle.content,
    skillDir: `${versionRelDir}/skill`,
    provenance: parseProvenance(provenanceRaw, slug, provenanceRel),
  };
}
