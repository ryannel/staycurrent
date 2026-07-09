import fs from 'node:fs';
import path from 'node:path';
import type { GateFailure, GateResult, PublishGateOptions } from './types.js';
import { isIsoDate, normalizeDateValue } from './dates.js';
import { parseProvenance } from './parseProvenance.js';
import { readMatterFile } from './loaders/shared.js';
import { RESERVED_SLUGS } from './slug.js';

const CADENCE_RE = /^\d+d$/;

// A mis-named directory (versions/v2026/ for a v2 topic) must neither drive the 1..N
// loops for thousands of iterations nor dump thousands of failures: when the highest
// vN outruns the count of vN directories actually present by more than this gap, the
// gate reports the suspicious directory instead of looping to N.
const N_PLAUSIBILITY_GAP = 100;

/** True iff `p` exists (file or directory) — read-only probe, no TOCTOU concern here. */
function pathExists(p: string): boolean {
  try {
    fs.statSync(p);
    return true;
  } catch {
    return false;
  }
}

export interface VersionScan {
  n: number; // the highest version number present as a versions/vN/ subdirectory
  dirCount: number; // how many vN-named directories exist — the plausibility denominator
}

/**
 * N is the highest version number present as a `versions/vN/` subdirectory inside
 * `dir` (03-api-design.md, Publish gate, "How N is derived") — a numeric max, not a
 * lexicographic one ('v9' must not beat 'v10' by string comparison). Exported so
 * `executeCut` (Cut mechanics) derives the same N from the staged tree instead of
 * re-implementing the scan.
 */
export function scanVersions(dir: string): VersionScan {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(path.join(dir, 'versions'), { withFileTypes: true });
  } catch {
    return { n: 0, dirCount: 0 };
  }

  let max = 0;
  let dirCount = 0;
  for (const entry of entries) {
    let isDir = entry.isDirectory();
    if (!isDir && entry.isSymbolicLink()) {
      try {
        isDir = fs.statSync(path.join(dir, 'versions', entry.name)).isDirectory();
      } catch {
        isDir = false;
      }
    }
    if (!isDir) continue;

    const match = /^v(\d+)$/.exec(entry.name);
    if (!match) continue;
    const n = Number(match[1]);
    dirCount += 1;
    if (n > max) max = n;
  }
  return { n: max, dirCount };
}

/**
 * Reads a frontmatter file's `data` for gate inspection, never throwing: a missing
 * or unparseable artifact is itself the kind of content violation the gate reports
 * as a `GateFailure`, not an exception (03-api-design.md, `runPublishGate` Errors).
 * Falls back to `{}` so downstream checks see absent fields rather than crashing.
 */
function safeReadFrontmatter(filePath: string, slug: string, relPath: string): Record<string, unknown> {
  try {
    return readMatterFile(filePath, slug, relPath)?.data ?? {};
  } catch {
    return {};
  }
}

// 'file' is byte-comparable regular content (directly or through a resolved
// symlink); 'irregular' (FIFO, socket, device, broken symlink) can never be
// byte-identical to anything — it fails closed as differing, never read.
type FileKind = 'file' | 'irregular';

/**
 * Recursively maps entries under `root` as `root`-relative POSIX paths. Symlinks
 * are resolved via statSync — the same treatment `scanVersions` gives directory
 * links — so a symlinked skill file participates in the byte comparison.
 */
function listFilesRecursive(root: string): Map<string, FileKind> {
  const result = new Map<string, FileKind>();
  function walk(current: string, relBase: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
      const full = path.join(current, entry.name);
      let isDir = entry.isDirectory();
      let isFile = entry.isFile();
      if (entry.isSymbolicLink()) {
        try {
          const stat = fs.statSync(full);
          isDir = stat.isDirectory();
          isFile = stat.isFile();
        } catch {
          result.set(rel, 'irregular'); // broken link — fails closed as differing
          continue;
        }
      }
      if (isDir) {
        walk(full, rel);
      } else if (isFile) {
        result.set(rel, 'file');
      } else {
        result.set(rel, 'irregular'); // FIFO, socket, device — never byte-comparable
      }
    }
  }
  walk(root, '');
  return result;
}

function checkSnapshotComplete(dir: string, n: number, failures: GateFailure[]): void {
  for (let m = 1; m <= n; m++) {
    for (const artifact of ['article.md', 'skill/SKILL.md', 'provenance.md']) {
      const rel = `versions/v${m}/${artifact}`;
      if (!pathExists(path.join(dir, rel))) {
        failures.push({
          check: 'snapshot-complete',
          path: rel,
          message: `missing required artifact: ${rel}`,
        });
      }
    }
  }
}

function checkChangelogTopEntry(dir: string, n: number, failures: GateFailure[]): void {
  const relPath = 'changelog.md';
  let raw: string;
  try {
    raw = fs.readFileSync(path.join(dir, relPath), 'utf8');
  } catch {
    raw = '';
  }

  const topLine = raw.split('\n').find((line) => /^##\s/.test(line.trim()))?.trim();

  let found: string;
  if (raw.trim() === '' || topLine === undefined) {
    found = '<none>';
  } else {
    const match = /^##\s*v(\d+)\s*—\s*\d{4}-\d{2}-\d{2}\s*$/.exec(topLine);
    found = match ? match[1] : '<malformed>';
  }

  if (found !== String(n)) {
    failures.push({
      check: 'changelog-top-entry',
      path: relPath,
      message: `changelog.md top entry is '## v${found}', expected '## v${n}'`,
    });
  }
}

function checkArticleVersionMatch(
  articleData: Record<string, unknown>,
  n: number,
  failures: GateFailure[]
): void {
  const actual = articleData.version;
  if (actual !== n) {
    failures.push({
      check: 'article-version-match',
      path: 'article.md',
      message: `article.md frontmatter version is ${String(actual)}, expected ${n}`,
    });
  }
}

function checkSkillVersionMatch(
  skillData: Record<string, unknown>,
  n: number,
  failures: GateFailure[]
): void {
  const actual = skillData.article_version;
  if (actual !== n) {
    failures.push({
      check: 'skill-version-match',
      path: 'skill/SKILL.md',
      message: `skill/SKILL.md frontmatter article_version is ${String(actual)}, expected ${n}`,
    });
  }
}

function checkSkillByteIdentical(dir: string, n: number, failures: GateFailure[]): void {
  if (n === 0) return; // nothing frozen to compare the live skill against

  const liveSkillDir = path.join(dir, 'skill');
  const frozenSkillDir = path.join(dir, 'versions', `v${n}`, 'skill');
  const liveFiles = listFilesRecursive(liveSkillDir);
  const frozenFiles = listFilesRecursive(frozenSkillDir);
  const allRel = new Set([...liveFiles.keys(), ...frozenFiles.keys()]);

  for (const rel of Array.from(allRel).sort()) {
    let differs = false;
    let note = '';
    if (liveFiles.get(rel) !== 'file' || frozenFiles.get(rel) !== 'file') {
      // Missing on one side, or non-regular content — fails closed as differing.
      differs = true;
    } else {
      try {
        const liveBytes = fs.readFileSync(path.join(liveSkillDir, rel));
        const frozenBytes = fs.readFileSync(path.join(frozenSkillDir, rel));
        differs = !liveBytes.equals(frozenBytes);
      } catch {
        differs = true; // unreadable — fails closed rather than escaping as a raw throw
        note = ' (unreadable)';
      }
    }
    if (differs) {
      failures.push({
        check: 'skill-byte-identical',
        path: `skill/${rel}`,
        message: `skill/${rel} differs from versions/v${n}/skill/${rel}${note}`,
      });
    }
  }
}

function checkProvenanceNonEmpty(dir: string, n: number, slug: string, failures: GateFailure[]): void {
  if (n === 0) return; // nothing frozen to inspect

  const relPath = `versions/v${n}/provenance.md`;
  let raw: string | undefined;
  try {
    raw = fs.readFileSync(path.join(dir, relPath), 'utf8');
  } catch {
    raw = undefined;
  }

  let entryCount = 0;
  if (raw !== undefined) {
    try {
      const record = parseProvenance(raw, slug, relPath);
      entryCount = record.sources.length + record.synthesis.length;
    } catch {
      entryCount = 0; // unparseable provenance reads as having no entries — never a throw
    }
  }

  if (entryCount === 0) {
    failures.push({
      check: 'provenance-non-empty',
      path: relPath,
      message: `${relPath} has no entries in Sources or Synthesis`,
    });
  }
}

function checkSlugMatchesDirname(
  articleData: Record<string, unknown>,
  dirname: string,
  failures: GateFailure[]
): void {
  const actual = articleData.topic;
  if (actual !== dirname) {
    failures.push({
      check: 'slug-matches-dirname',
      path: 'article.md',
      message: `article.md frontmatter topic '${String(actual)}' does not match directory '${dirname}'`,
    });
  }
}

function checkReservedSlug(articleData: Record<string, unknown>, failures: GateFailure[]): void {
  const topic = articleData.topic;
  if (typeof topic === 'string' && RESERVED_SLUGS.has(topic)) {
    failures.push({
      check: 'reserved-slug',
      path: 'article.md',
      message: `article.md: topic slug '${topic}' collides with a reserved root path`,
    });
  }
}

function pushInvalidDate(failures: GateFailure[], file: string, field: string, value: unknown): void {
  failures.push({
    check: 'cadence-date-valid',
    path: file,
    message: `${file}: ${field} '${String(value)}' is not a valid date on or before today`,
  });
}

function isOnOrBeforeToday(value: string, todayUtcMs: number): boolean {
  if (!isIsoDate(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  return Date.UTC(year, month - 1, day) <= todayUtcMs;
}

function checkCadenceDateValid(
  dir: string,
  articleData: Record<string, unknown>,
  loopN: number,
  slug: string,
  todayUtcMs: number,
  failures: GateFailure[]
): void {
  const cadence = articleData.cadence;
  if (typeof cadence !== 'string' || !CADENCE_RE.test(cadence)) {
    failures.push({
      check: 'cadence-date-valid',
      path: 'article.md',
      message: `article.md: cadence '${String(cadence)}' does not match <int>d`,
    });
  }

  const lastResearchedRaw = normalizeDateValue(articleData.last_researched);
  const lastResearchedDisplay = lastResearchedRaw ?? articleData.last_researched;
  if (lastResearchedRaw === undefined || !isOnOrBeforeToday(lastResearchedRaw, todayUtcMs)) {
    pushInvalidDate(failures, 'article.md', 'last_researched', lastResearchedDisplay);
  }

  for (let m = 1; m <= loopN; m++) {
    const relPath = `versions/v${m}/article.md`;
    if (!pathExists(path.join(dir, relPath))) continue; // caught by snapshot-complete

    const versionData = safeReadFrontmatter(path.join(dir, relPath), slug, relPath);
    const cutRaw = normalizeDateValue(versionData.cut);
    const cutDisplay = cutRaw ?? versionData.cut;
    if (cutRaw === undefined || !isOnOrBeforeToday(cutRaw, todayUtcMs)) {
      pushInvalidDate(failures, relPath, 'cut', cutDisplay);
    }
  }
}

/**
 * The one place gate logic exists (ADR 0003): validates that `dir`, treated as a
 * topic-shaped directory, is internally consistent across all nine `GateCheckId`
 * checks (03-api-design.md, Publish gate). Never throws for a content violation —
 * every violation becomes a `GateFailure`; only a nonexistent (or non-directory)
 * `dir` propagates a raw fs error, a usage error rather than a content problem.
 */
export function runPublishGate(dir: string, opts: PublishGateOptions = {}): GateResult {
  // Probe `dir` itself: ENOENT/ENOTDIR propagate raw and uncaught — 03's "may
  // propagate a raw fs error if dir itself does not exist"; never a manufactured Error.
  fs.readdirSync(dir);

  const slug = path.basename(dir);
  const now = opts.now ?? new Date();
  const todayUtcMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const { n, dirCount } = scanVersions(dir);
  const nImplausible = n - dirCount > N_PLAUSIBILITY_GAP;

  const articleData = safeReadFrontmatter(path.join(dir, 'article.md'), slug, 'article.md');
  const skillData = safeReadFrontmatter(path.join(dir, 'skill', 'SKILL.md'), slug, 'skill/SKILL.md');

  const failures: GateFailure[] = [];

  if (nImplausible) {
    // One failure names the suspect directory; the N-relative checks are skipped —
    // looping to a typo'd N or advising "expected v2026" would compound the mistake.
    failures.push({
      check: 'snapshot-complete',
      path: `versions/v${n}`,
      message: `version v${n} exceeds plausible history — check versions/ for mis-named directories`,
    });
  } else if (n === 0) {
    // No versions/vN/ at all is itself a gate failure (a topic carries at least
    // versions/v1/ from creation), and it blocks alone: the N-relative checks are
    // skipped because "expected v0" guidance is nonsense.
    failures.push({
      check: 'snapshot-complete',
      path: 'versions/',
      message: 'no version snapshot exists — a topic carries at least versions/v1/',
    });
  } else {
    checkSnapshotComplete(dir, n, failures);
    checkChangelogTopEntry(dir, n, failures);
    checkArticleVersionMatch(articleData, n, failures);
    checkSkillVersionMatch(skillData, n, failures);
    checkSkillByteIdentical(dir, n, failures);
    checkProvenanceNonEmpty(dir, n, slug, failures);
  }

  // Topic-local checks — meaningful whatever N resolved to.
  checkSlugMatchesDirname(articleData, slug, failures);
  checkReservedSlug(articleData, failures);
  checkCadenceDateValid(dir, articleData, nImplausible ? 0 : n, slug, todayUtcMs, failures);

  // `dir` binds this result to the tree it validated: executeCut refuses a
  // GateResult produced for any other directory (change-proposal-1, rule d).
  return { ok: failures.length === 0, failures, dir };
}
