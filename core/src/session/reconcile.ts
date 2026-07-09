import fs from 'node:fs';
import path from 'node:path';
import type { ReconcileOptions, ReconcileReport } from '../types.js';
import { ContentNotFoundError } from '../errors.js';
import { assertValidSlug } from '../slug.js';
import { replaceFrontmatterField } from '../write.js';
import { loadLiveArticle } from './shared.js';

/**
 * Lists `topics/` subdirectory slugs, symlink-aware (mirrors `listTopics`'
 * enumeration — a symlinked topic must not be silently absent from a sweep).
 */
function listTopicSlugs(root: string): string[] {
  const topicsDir = path.join(root, 'topics');
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(topicsDir, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }

  return entries
    .filter((entry) => {
      if (entry.isDirectory()) return true;
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
}

/** Reverts `status: in-research` → `current` when `sessionExists` is false, in place. */
function revertIfOrphaned(root: string, slug: string, sessionExists: boolean, reverted: string[]): void {
  const article = loadLiveArticle(root, slug);
  if (article.frontmatter.status === 'in-research' && !sessionExists) {
    fs.writeFileSync(article.articlePath, replaceFrontmatterField(article.raw, 'status', 'current'));
    reverted.push(slug);
  }
}

/**
 * The filesystem-wins rule as a function: for every topic — or just `slug` when
 * given — whose stored `status` is `in-research` but whose session file does not
 * exist *as reported by the caller*, revert `status` to `current` in the working
 * tree (03-api-design.md, `reconcile`). Session-file existence arrives as an
 * argument, never a probe — core never reads `.staycurrent/sessions/`.
 *
 * Fail-safe default: a topic whose existence fact is absent from `opts.sessions`
 * (sweep form) or unset via `opts.sessionExists` (single-slug form) is treated as
 * session-present and left untouched — reverting published state on missing
 * information is the wrong default.
 */
export function reconcile(root: string, slug: string | undefined, opts: ReconcileOptions): ReconcileReport {
  const reverted: string[] = [];

  if (slug !== undefined) {
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

    revertIfOrphaned(root, slug, opts.sessionExists ?? true, reverted);
    return { reverted };
  }

  for (const s of listTopicSlugs(root)) {
    revertIfOrphaned(root, s, opts.sessions?.[s] ?? true, reverted);
  }

  return { reverted };
}
