import fs from 'node:fs';
import path from 'node:path';
import type { CutReport, GateResult } from '../types.js';
import { ContentNotFoundError, ContentValidationError, GateNotPassedError } from '../errors.js';
import { readMatterFile } from '../loaders/shared.js';
import { scanVersions } from '../runPublishGate.js';
import { assertValidSlug } from '../slug.js';
import { replaceFrontmatterField } from '../write.js';

/**
 * Root-relative (to `dir`) POSIX paths of every regular file under `dir`, sorted.
 * Symlinked directories are followed with a visited-realpath cycle guard; every
 * other fs error propagates — a silently skipped file would land a partial copy
 * (change-proposal-1 review patches).
 */
function listFilesRecursive(dir: string): string[] {
  const results: string[] = [];
  const visited = new Set<string>();

  function walk(current: string, rel: string): void {
    const real = fs.realpathSync(current);
    if (visited.has(real)) return; // symlink cycle — this directory is already walked
    visited.add(real);

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
      const full = path.join(current, entry.name);
      // statSync follows symlinks; a broken link throws and propagates — never a
      // silent omission from the landed set.
      const stat = entry.isSymbolicLink() ? fs.statSync(full) : null;
      const isDir = stat ? stat.isDirectory() : entry.isDirectory();
      const isFile = stat ? stat.isFile() : entry.isFile();
      if (isDir) {
        walk(full, entryRel);
      } else if (isFile) {
        results.push(entryRel);
      }
    }
  }

  walk(dir, '');
  return results.sort();
}

/** Removes `dir` if (after recursing) it contains nothing; returns true when removed. */
function pruneEmptyDirs(dir: string): boolean {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return false; // already gone or unreadable — leave it to the next landing
  }
  let empty = true;
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.isSymbolicLink()) {
      if (pruneEmptyDirs(path.join(dir, entry.name))) continue;
    }
    empty = false;
  }
  if (empty) {
    fs.rmdirSync(dir);
    return true;
  }
  return false;
}

/**
 * The live topic's version as its `article.md` frontmatter states it — 0 when the
 * topic (or a parseable version field) does not exist. Read from the article, not
 * `scanVersions`, because `article.md` is the LAST artifact the landing writes: a
 * partially-landed tree still reads as the previous version, keeping the
 * crash-recovery re-run legal under the monotonicity check.
 */
function readLiveVersion(root: string, slug: string): number {
  try {
    const parsed = readMatterFile(
      path.join(root, 'topics', slug, 'article.md'),
      slug,
      `topics/${slug}/article.md`
    );
    const version = parsed?.data.version;
    return typeof version === 'number' && Number.isInteger(version) && version > 0 ? version : 0;
  } catch {
    return 0; // an unreadable live article never blocks landing a valid staged tree
  }
}

/** Path identity for the GateResult dir binding: realpath where possible, resolve as fallback. */
function canonicalPath(p: string): string {
  try {
    return fs.realpathSync(p);
  } catch {
    return path.resolve(p);
  }
}

/**
 * Lands the staged tree into `topics/<slug>/` via fs writes only — no git
 * (03-api-design.md, `executeCut`; landing semantics per change-proposal-1):
 *
 * - Refuses a non-passing GateResult (`GateNotPassedError`), and a GateResult
 *   produced for any directory other than the staged tree being landed.
 * - A missing staged tree is `ContentNotFoundError`, never a silent empty success.
 * - Monotonicity: the staged version must exceed the live topic's version —
 *   otherwise `ContentValidationError` (a zero-authoring cut is not a cut).
 * - Landing is a sync: `topics/<slug>/` exactly matches the staged tree afterward;
 *   files absent from staging are removed and reported in `CutReport.removed`.
 * - The landed live `article.md` is normalized to `status: current` — published
 *   state is always current — and lands LAST: it is the version-bearing file, so a
 *   partial landing still reads as the previous version and a completing re-run
 *   stays legal under the monotonicity check.
 */
export function executeCut(root: string, slug: string, gateResult: GateResult): CutReport {
  assertValidSlug(slug);

  if (gateResult.ok !== true) {
    throw new GateNotPassedError(gateResult.failures);
  }

  const stagedDir = path.join(root, '.staycurrent', 'staged', slug);
  const stagedRel = `.staycurrent/staged/${slug}`;
  let stagedStat: fs.Stats;
  try {
    stagedStat = fs.statSync(stagedDir);
  } catch {
    throw new ContentNotFoundError(slug, stagedRel);
  }
  if (!stagedStat.isDirectory()) {
    throw new ContentNotFoundError(slug, stagedRel);
  }

  if (canonicalPath(gateResult.dir) !== canonicalPath(stagedDir)) {
    throw new GateNotPassedError(
      gateResult.failures,
      `gate result was produced for '${gateResult.dir}', not the staged tree being landed ('${stagedRel}')`
    );
  }

  const { n } = scanVersions(stagedDir);
  const liveVersion = readLiveVersion(root, slug);
  if (n <= liveVersion) {
    throw new ContentValidationError(slug, stagedRel, [
      `staged version ${n} does not exceed live version ${liveVersion} — nothing new to cut`,
    ]);
  }

  const targetDir = path.join(root, 'topics', slug);
  const stagedFiles = listFilesRecursive(stagedDir);
  const stagedSet = new Set(stagedFiles);
  const liveFiles = fs.existsSync(targetDir) ? listFilesRecursive(targetDir) : [];

  const paths: string[] = [];
  const removed: string[] = [];

  const writeArtifact = (rel: string): void => {
    const relParts = rel.split('/');
    const srcPath = path.join(stagedDir, ...relParts);
    const destPath = path.join(targetDir, ...relParts);
    let bytes = fs.readFileSync(srcPath);

    if (rel === 'article.md') {
      // Normalize the landed live article to status: current — in-research never
      // lands as published truth (change-proposal-1, rule a). Tolerant of a staged
      // article without a status field: full schema validation is the loaders' job.
      try {
        bytes = Buffer.from(replaceFrontmatterField(bytes.toString('utf8'), 'status', 'current'));
      } catch {
        /* no frontmatter status to normalize — land the bytes as staged */
      }
    }

    let needsWrite = true;
    try {
      needsWrite = !bytes.equals(fs.readFileSync(destPath));
    } catch {
      needsWrite = true;
    }
    if (needsWrite) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, bytes);
    }
    paths.push(`topics/${slug}/${rel}`);
  };

  // 1. Land every artifact except the version-bearing article.md.
  for (const rel of stagedFiles) {
    if (rel !== 'article.md') writeArtifact(rel);
  }

  // 2. Sync removals: files the staged tree no longer carries leave the live tree,
  //    and directories left empty go with them.
  for (const rel of liveFiles) {
    if (!stagedSet.has(rel) && rel !== 'article.md') {
      fs.rmSync(path.join(targetDir, ...rel.split('/')));
      removed.push(`topics/${slug}/${rel}`);
    }
  }
  if (fs.existsSync(targetDir)) {
    for (const entry of fs.readdirSync(targetDir, { withFileTypes: true })) {
      if (entry.isDirectory() && !entry.isSymbolicLink()) {
        pruneEmptyDirs(path.join(targetDir, entry.name));
      }
    }
  }

  // 3. article.md lands last — the commit point of the landing.
  if (stagedSet.has('article.md')) {
    writeArtifact('article.md');
  }

  return { topic: slug, version: n, paths, removed };
}
