// Filesystem probes cli.mjs needs that core does not expose: existence checks, a
// flat recursive file listing, a byte-identical tree comparison (the `cut`
// converged-re-entry probe, 03-api-design.md), symlink-aware topic-directory
// enumeration (mirrors core's listTopics/reconcile enumerators), and frontmatter/
// research-log field reads off already-validated trees so report lines can name
// values without reaching into core internals.

import fs from 'node:fs';
import path from 'node:path';

export function dirExists(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

export function fileExists(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

/**
 * `topics/` subdirectory slugs, symlink-aware — a symlinked topic directory must
 * not be silently absent from the `status` command's session probe (mirrors the
 * stat-follow enumeration in core's `listTopics` and `reconcile`).
 */
export function listTopicDirSlugs(root) {
  const topicsDir = path.join(root, 'topics');
  let entries;
  try {
    entries = fs.readdirSync(topicsDir, { withFileTypes: true });
  } catch {
    return [];
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
    .sort();
}

/**
 * Root-relative POSIX file paths under `dir`, sorted. Plain files/directories
 * only — no symlink handling. This is a CLI-level convergence probe, not the
 * authoritative landing: core's `executeCut` (symlink-aware) is what actually
 * lands `topics/`.
 */
export function listFilesRel(dir) {
  const out = [];
  function walk(cur, rel) {
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) walk(full, entryRel);
      else if (entry.isFile()) out.push(entryRel);
    }
  }
  walk(dir, '');
  return out.sort();
}

/**
 * True iff `a` and `b` hold exactly the same set of relative files, byte-for-byte
 * — the "topics/<slug>/ already byte-identical to staged" test `cut`'s converged
 * re-entry branch needs (03-api-design.md, Cut mechanics / `cut` Behaviour).
 * Fails closed: any listing or read error (a tree missing, a file vanishing
 * mid-compare) returns false — "not identical" routes `cut` to executeCut's own
 * guarded landing, never to a skipped one.
 */
export function treesByteIdentical(a, b) {
  let filesA;
  let filesB;
  try {
    filesA = listFilesRel(a);
    filesB = listFilesRel(b);
  } catch {
    return false;
  }
  if (filesA.length !== filesB.length) return false;
  for (let i = 0; i < filesA.length; i++) {
    if (filesA[i] !== filesB[i]) return false;
  }
  for (const rel of filesA) {
    try {
      const bytesA = fs.readFileSync(path.join(a, rel));
      const bytesB = fs.readFileSync(path.join(b, rel));
      if (!bytesA.equals(bytesB)) return false;
    } catch {
      return false; // vanished or unreadable mid-compare — not identical
    }
  }
  return true;
}

/** The raw string value of one top-level `field:` line inside `file`'s
 * frontmatter block (never the body), or undefined. */
export function readFrontmatterField(file, field) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch {
    return undefined;
  }
  const fence = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!fence) return undefined;
  const match = fence[1].match(new RegExp(`^${field}:\\s*(.+?)\\s*$`, 'm'));
  return match ? match[1] : undefined;
}

/**
 * Reads the `version:` integer straight off an article.md's frontmatter block. A
 * gate-passing tree already guarantees this equals N (check 3,
 * article-version-match), so report lines that need to name N read it directly
 * rather than re-deriving core's internal `scanVersions`.
 */
export function readArticleVersion(articleMdPath) {
  const value = readFrontmatterField(articleMdPath, 'version');
  return value !== undefined && /^\d+$/.test(value) ? Number(value) : undefined;
}

/**
 * Parses the newest (top) entry of a `research-log.md` into the ResearchLogEntry
 * shape — used by `log`'s converged re-entry to print the already-applied
 * resolution verbatim under `--json` (the entry recordNoCut wrote before the
 * commit was lost). Returns undefined when no entry heading parses.
 */
export function parseTopResearchLogEntry(researchLogPath) {
  let raw;
  try {
    raw = fs.readFileSync(researchLogPath, 'utf8');
  } catch {
    return undefined;
  }
  const lines = raw.split('\n');
  const headingRe = /^## (\d{4}-\d{2}-\d{2}) — (?:no-cut|cut v(\d+))\s*$/;
  const idx = lines.findIndex((l) => headingRe.test(l));
  if (idx === -1) return undefined;

  const m = headingRe.exec(lines[idx]);
  const entry = { date: m[1], outcome: m[2] ? 'cut' : 'no-cut', lines: [] };
  if (m[2]) entry.version = Number(m[2]);
  for (let j = idx + 1; j < lines.length; j++) {
    if (/^##\s/.test(lines[j])) break;
    if (lines[j].trim() !== '') entry.lines.push(lines[j]);
  }
  return entry;
}
