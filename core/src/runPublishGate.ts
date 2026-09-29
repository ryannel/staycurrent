import fs from 'node:fs';
import path from 'node:path';
import type { GateFailure, GateResult, PublishGateOptions } from './types.js';
import { isIsoDate, normalizeDateValue } from './dates.js';
import { ContentValidationError } from './errors.js';
import { validateTopicFrontmatter } from './frontmatter.js';
import { parseProvenance } from './parseProvenance.js';
import { parseChangelogEntries } from './loaders/loadChangelog.js';
import { readMatterFile, readTextFile } from './loaders/shared.js';
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
 * `dir` — a numeric max, not a
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
 * as a `GateFailure`, not an exception.
 * Falls back to `{}` so downstream checks see absent fields rather than crashing.
 */
function safeReadFrontmatter(filePath: string, slug: string, relPath: string): Record<string, unknown> {
  try {
    return readMatterFile(filePath, slug, relPath)?.data ?? {};
  } catch {
    return {};
  }
}

function checkSnapshotComplete(dir: string, n: number, failures: GateFailure[]): void {
  for (let m = 1; m <= n; m++) {
    for (const artifact of ['article.md', 'provenance.md']) {
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
    } catch (err) {
      // The file exists but fails the bullet grammar: surface the parser's own
      // diagnostic — it names the offending bullet and the required grammar —
      // rather than the false "has no entries".
      // Still a GateFailure, never a throw.
      failures.push({
        check: 'provenance-non-empty',
        path: relPath,
        message:
          err instanceof ContentValidationError
            ? err.message
            : `${relPath} failed to parse: ${String(err)}`,
      });
      return;
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

/**
 * Check 9, `changelog-schema`: `dir/changelog.md` must parse through
 * `parseChangelogEntries` — the identical module-internal core `loadChangelog`
 * wraps for the read path, never a re-implementation of its heading grammar,
 * descending-contiguity, or stance-line rules. Re-covers check 2's top-heading
 * territory by design (one bad artifact may yield two failures — the same
 * aggregation check 8 applies against check 7). A missing file reports check 1's
 * shape rather than a parse error, since there is nothing to parse.
 */
function checkChangelogSchema(dir: string, slug: string, failures: GateFailure[]): void {
  const relPath = 'changelog.md';
  const raw = readTextFile(path.join(dir, relPath));
  if (raw === undefined) {
    failures.push({
      check: 'changelog-schema',
      path: relPath,
      message: `missing required artifact: ${relPath}`,
    });
    return;
  }

  try {
    parseChangelogEntries(raw, slug, relPath);
  } catch (err) {
    if (!(err instanceof ContentValidationError)) throw err;
    for (const issue of err.issues) {
      failures.push({
        check: 'changelog-schema',
        path: relPath,
        message: `${relPath}: ${issue}`,
      });
    }
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
 * Check 8, `frontmatter-schema`: the live `article.md` frontmatter must pass
 * `validateTopicFrontmatter` — the same module-internal validator
 * `loadTopic`/`listTopics` share, so a gate-passed cut can never land content the
 * loaders would then reject. Runs unconditionally, like checks 5-7, whatever N
 * resolved to. Deliberately not deduped against any other check's territory
 * (check 7's cadence/date shape, check 5's topic/slug match): one violated
 * field may surface as more than one `GateFailure`, and that double-reporting is
 * aggregation by design, not a bug to special-case away.
 */
function checkFrontmatterSchema(
  articleData: Record<string, unknown>,
  slug: string,
  failures: GateFailure[]
): void {
  const { issues } = validateTopicFrontmatter(articleData, slug);
  for (const issue of issues) {
    failures.push({
      check: 'frontmatter-schema',
      path: 'article.md',
      message: `article.md: ${issue}`,
    });
  }
}

/**
 * The one place gate logic exists (ADR 0003): validates that `dir`, treated as a
 * topic-shaped directory, is internally consistent across all nine `GateCheckId`
 * checks. Never
 * throws for a content violation — every violation becomes a `GateFailure`; only a
 * nonexistent (or non-directory) `dir` propagates a raw fs error, a usage error
 * rather than a content problem.
 */
export function runPublishGate(dir: string, opts: PublishGateOptions = {}): GateResult {
  // Probe `dir` itself: ENOENT/ENOTDIR propagate raw and uncaught — a raw fs
  // error if dir itself does not exist; never a manufactured Error.
  fs.readdirSync(dir);

  const slug = path.basename(dir);
  const now = opts.now ?? new Date();
  const todayUtcMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const { n, dirCount } = scanVersions(dir);
  const nImplausible = n - dirCount > N_PLAUSIBILITY_GAP;

  const articleData = safeReadFrontmatter(path.join(dir, 'article.md'), slug, 'article.md');

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
    checkChangelogSchema(dir, slug, failures);
    checkArticleVersionMatch(articleData, n, failures);
    checkProvenanceNonEmpty(dir, n, slug, failures);
  }

  // Topic-local checks — meaningful whatever N resolved to.
  checkSlugMatchesDirname(articleData, slug, failures);
  checkReservedSlug(articleData, failures);
  checkCadenceDateValid(dir, articleData, nImplausible ? 0 : n, slug, todayUtcMs, failures);
  checkFrontmatterSchema(articleData, slug, failures);

  // `dir` binds this result to the tree it validated: executeCut refuses a
  // GateResult produced for any other directory.
  return { ok: failures.length === 0, failures, dir };
}
