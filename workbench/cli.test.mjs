// Permanent best-practice coverage for workbench/cli.mjs (bet first-living-topic,
// slice 1.4). Run with: `node --test workbench/cli.test.mjs`.
//
// This is a black-box, perimeter-level suite: it drives the real CLI process
// against a throwaway tmp git repo fixture, exactly as an operator (or the bet-
// progress test, tests/bets/first-living-topic/test_slice_4_workbench_workbench-cli.py)
// would — no stub of the CLI, no mock of core. Where the bet-progress test only
// exercises the read-only/quarantine-only commands against the real repository
// (create, gate, discard, status), this suite exercises the FULL seven-command
// lifecycle, including the two git-committing commands (cut, log) and the
// trickiest state-machine branches (converged re-entry, non-advancing version,
// gate failure at cut time) — the coverage this slice's Proof of work names but
// the bet-progress test deliberately avoids running against the real repo.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.join(__dirname, 'cli.mjs');
const SLUG = 'databases';

let repoDir;

function run(args) {
  const result = spawnSync('node', [CLI, ...args], { cwd: repoDir, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

function git(args) {
  return spawnSync('git', args, { cwd: repoDir, encoding: 'utf8' });
}

function gitLogMessages() {
  const result = git(['log', '--format=%s']);
  return result.stdout.trim().split('\n').filter(Boolean);
}

function readArticle(slug) {
  return fs.readFileSync(path.join(repoDir, 'topics', slug, 'article.md'), 'utf8');
}

function stagedDir(slug) {
  return path.join(repoDir, '.staycurrent', 'staged', slug);
}

function sessionFile(slug) {
  return path.join(repoDir, '.staycurrent', 'sessions', `${slug}.md`);
}

/** Fills in the one artifact the founding skeleton deliberately leaves empty
 * (provenance) so the staged v1 tree clears the publish gate. */
function authorMinimalV1(slug) {
  const provenancePath = path.join(stagedDir(slug), 'versions', 'v1', 'provenance.md');
  fs.writeFileSync(
    provenancePath,
    '## Sources\n\n' +
      '- [Example](https://example.com) — accessed 2026-01-01 — supports: the founding claim\n\n' +
      '## Synthesis\n\n'
  );
}

/** Authors a full vN bump into an already-seeded staged tree (stageCut/convene
 * copies the prior version forward) — article version, a changelog entry, a new
 * versions/vN/ snapshot, and a live skill/ byte-identical to versions/vN/skill/,
 * so the resulting staged tree clears every publish-gate check at N. */
function authorNextVersion(slug, n) {
  const dir = stagedDir(slug);
  const today = '2026-01-01';

  const articlePath = path.join(dir, 'article.md');
  fs.writeFileSync(articlePath, fs.readFileSync(articlePath, 'utf8').replace(/^version: \d+$/m, `version: ${n}`));

  const changelogPath = path.join(dir, 'changelog.md');
  const changelog = fs.readFileSync(changelogPath, 'utf8');
  const firstEol = changelog.indexOf('\n');
  const h1 = changelog.slice(0, firstEol);
  const rest = changelog.slice(firstEol + 1).replace(/^\n+/, '');
  const entry =
    `## v${n} — ${today}\n\n` +
    'What moved: routine research refresh.\n' +
    'What it means: no material change to the practice.\n' +
    'Stance: held — position unchanged.\n';
  fs.writeFileSync(changelogPath, `${h1}\n\n${entry}\n${rest}`);

  const vDir = path.join(dir, 'versions', `v${n}`);
  fs.mkdirSync(path.join(vDir, 'skill', 'references'), { recursive: true });
  fs.writeFileSync(path.join(vDir, 'article.md'), `---\nversion: ${n}\ncut: ${today}\n---\n\n# Databases\n\nContent authored for v${n}.\n`);
  fs.writeFileSync(
    path.join(vDir, 'provenance.md'),
    `## Sources\n\n- [Example](https://example.com) — accessed ${today} — supports: v${n} claim\n\n## Synthesis\n\n`
  );

  const skillMd =
    '---\n' +
    `name: ${slug}\n` +
    'description: >\n' +
    '  Use when evaluating this fixture topic for cli lifecycle testing.\n' +
    `article_version: ${n}\n` +
    '---\n\n' +
    `# ${slug} Skill\n\nStance callout mirrored from the article.\n`;
  fs.writeFileSync(path.join(vDir, 'skill', 'SKILL.md'), skillMd);
  fs.writeFileSync(path.join(dir, 'skill', 'SKILL.md'), skillMd); // live skill must stay byte-identical
}

before(() => {
  repoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-cli-test-'));
  git(['init', '-q']);
  git(['config', 'user.email', 'workbench-cli-test@example.com']);
  git(['config', 'user.name', 'Workbench CLI Test']);
  fs.mkdirSync(path.join(repoDir, 'topics'), { recursive: true });
});

after(() => {
  fs.rmSync(repoDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// Argument / usage errors — exit 2, stateless
// ---------------------------------------------------------------------------

test('unknown command exits 2', () => {
  const r = run(['frobnicate']);
  assert.equal(r.status, 2);
});

test('create with no slug or title exits 2', () => {
  const r = run(['create']);
  assert.equal(r.status, 2);
});

test('gate with no slug exits 2', () => {
  const r = run(['gate']);
  assert.equal(r.status, 2);
});

test('cut of a wholly unknown slug exits 2', () => {
  const r = run(['cut', 'never-heard-of-it']);
  assert.equal(r.status, 2);
});

test('log with no open session exits 2', () => {
  const r = run(['log', 'never-heard-of-it', '--line', 'x']);
  assert.equal(r.status, 2);
});

test('gate with nothing staged exits 2', () => {
  const r = run(['gate', 'never-heard-of-it']);
  assert.equal(r.status, 2);
});

// ---------------------------------------------------------------------------
// Full lifecycle — create -> gate (fails) -> author -> gate (passes) -> cut ->
// status -> idempotent re-cut -> convene -> log no-cut -> discard
// ---------------------------------------------------------------------------

test('status on an empty catalogue prints "No topics." and exits 0', () => {
  const r = run(['status']);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), 'No topics.');
});

test('create seeds the staged skeleton and the session file, exits 0', () => {
  const r = run(['create', SLUG, '--title', 'Databases']);
  assert.equal(r.status, 0);
  assert.equal(
    r.stdout.trim(),
    `Created staged topic ${SLUG} — draft at .staycurrent/staged/${SLUG}/. Session: .staycurrent/sessions/${SLUG}.md`
  );

  assert.ok(fs.existsSync(stagedDir(SLUG)), 'staged tree should exist on disk');
  assert.ok(fs.existsSync(sessionFile(SLUG)), 'session file should exist on disk');

  const session = fs.readFileSync(sessionFile(SLUG), 'utf8');
  assert.match(session, /^topic: databases$/m);
  assert.match(session, /^phase: researching$/m);
  assert.match(session, /^against_version: 0$/m); // founding run researches against nothing published

  // create never writes topics/ — creation is not a bootstrapped exception; the
  // founding v1 goes through the same cut gate as any later version.
  assert.ok(!fs.existsSync(path.join(repoDir, 'topics', SLUG)));
});

test('gate on the freshly seeded skeleton reports FAIL lines and exits 1', () => {
  const r = run(['gate', SLUG]);
  assert.equal(r.status, 1);
  const lines = r.stdout.trim().split('\n');
  assert.ok(lines.length > 0);
  for (const line of lines) assert.match(line, /^FAIL [a-z-]+: .+$/);
  // The founding skeleton's empty provenance is the one artifact create.ts
  // deliberately leaves unauthored (03-api-design.md, createTopic rationale).
  assert.ok(lines.some((l) => l.startsWith('FAIL provenance-non-empty:')));
});

test('gate passes once the minimal artifact is authored', () => {
  authorMinimalV1(SLUG);
  const r = run(['gate', SLUG]);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), `PASS ${SLUG} v1`);
});

test('cut lands v1, commits exactly once, and cleans up the quarantine', () => {
  const r = run(['cut', SLUG]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^Cut v1 — article, skill, changelog entry, provenance; RSS follows at site build\.$/m);
  assert.match(r.stdout, /^cut\(databases\): v1$/m);

  assert.deepEqual(gitLogMessages(), ['cut(databases): v1']);
  assert.ok(fs.existsSync(path.join(repoDir, 'topics', SLUG, 'article.md')), 'topics/ should hold the landed article');
  assert.ok(!fs.existsSync(stagedDir(SLUG)), 'staged tree should be gone after a successful cut');
  assert.ok(!fs.existsSync(sessionFile(SLUG)), 'session file should be gone after a successful cut');
  assert.match(readArticle(SLUG), /^status: current$/m); // landing always normalizes to current

  // Working tree is clean: the commit captured everything cut wrote.
  const status = git(['status', '--porcelain']);
  assert.equal(status.stdout.trim(), '');
});

test('status reports the v1 row as current', () => {
  const r = run(['status']);
  assert.equal(r.status, 0);
  const row = r.stdout.split('\n').find((l) => l.startsWith(SLUG));
  assert.ok(row, `expected a ${SLUG} row in status output:\n${r.stdout}`);
  assert.match(row, /\bv1\b/);
  assert.match(row, /current/);
});

test('re-cutting a complete topic is idempotent: "Nothing to cut", exit 0, no new commit', () => {
  const before = gitLogMessages();
  const r = run(['cut', SLUG]);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), 'Nothing to cut — v1 is complete.');
  assert.deepEqual(gitLogMessages(), before, 'idempotent re-run must not create a duplicate commit');
});

test('convene opens a research run against the live version', () => {
  const r = run(['convene', SLUG]);
  assert.equal(r.status, 0);
  assert.equal(
    r.stdout.trim(),
    `Convened ${SLUG} against v1 — in-research. Session: .staycurrent/sessions/${SLUG}.md`
  );
  assert.ok(fs.existsSync(stagedDir(SLUG)));
  assert.ok(fs.existsSync(sessionFile(SLUG)));
  assert.match(fs.readFileSync(sessionFile(SLUG), 'utf8'), /^against_version: 1$/m);
  assert.match(readArticle(SLUG), /^status: in-research$/m);
});

test('convening an already-open run exits 2 without disturbing the open session', () => {
  const r = run(['convene', SLUG]);
  assert.equal(r.status, 2);
  assert.ok(fs.existsSync(sessionFile(SLUG)), 'the original session file must survive the rejected re-convene');
});

test('status surfaces the in-research state for the open run', () => {
  const r = run(['status']);
  assert.equal(r.status, 0);
  const row = r.stdout.split('\n').find((l) => l.startsWith(SLUG));
  assert.match(row, /in-research/);
});

test('log resolves the run as no-cut, commits once more, and clears the quarantine', () => {
  const before = gitLogMessages();
  const r = run(['log', SLUG, '--line', '9 sources examined; nothing moved the stance.', '--line', 'Pricing shifts are vendor-level, not architectural.']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^Logged no-cut for databases — last_researched \d{4}-\d{2}-\d{2}\. Commit: log\(databases\): no-cut$/m);

  assert.deepEqual(gitLogMessages(), ['log(databases): no-cut', ...before]);
  assert.ok(!fs.existsSync(sessionFile(SLUG)));
  assert.ok(!fs.existsSync(stagedDir(SLUG)));
  assert.match(readArticle(SLUG), /^status: current$/m);

  const researchLog = fs.readFileSync(path.join(repoDir, 'topics', SLUG, 'research-log.md'), 'utf8');
  assert.match(researchLog, /## \d{4}-\d{2}-\d{2} — no-cut/);
  assert.match(researchLog, /9 sources examined; nothing moved the stance\./);
});

test('discarding with no open session and no in-research stamp exits 2', () => {
  const r = run(['discard', SLUG]);
  assert.equal(r.status, 2);
});

test('convene then discard leaves no trace and reverts status to current', () => {
  assert.equal(run(['convene', SLUG]).status, 0);
  assert.match(readArticle(SLUG), /^status: in-research$/m);

  const before = gitLogMessages();
  const r = run(['discard', SLUG]);
  assert.equal(r.status, 0);
  assert.equal(
    r.stdout.trim(),
    `Discarded session for ${SLUG} — status reverted to current. Nothing published changed.`
  );

  assert.ok(!fs.existsSync(sessionFile(SLUG)));
  assert.ok(!fs.existsSync(stagedDir(SLUG)));
  assert.match(readArticle(SLUG), /^status: current$/m);
  assert.deepEqual(gitLogMessages(), before, 'discard must never create a commit — nothing published changed');
});

// ---------------------------------------------------------------------------
// The trickier `cut` state-machine branches
// ---------------------------------------------------------------------------

test('cut halts with the gate-failure template when the staged tree fails its own gate, leaving state intact', () => {
  assert.equal(run(['convene', SLUG]).status, 0);
  authorNextVersion(SLUG, 2);
  // Break what was just authored: empty out v2's provenance.
  fs.writeFileSync(path.join(stagedDir(SLUG), 'versions', 'v2', 'provenance.md'), '## Sources\n\n## Synthesis\n\n');

  const beforeCommits = gitLogMessages();
  const r = run(['cut', SLUG]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /^Blocked: cut databases failed the publish gate\.$/m);
  assert.match(r.stdout, /^Cause:   provenance-non-empty: /m);
  assert.match(r.stdout, /^State:   staged set intact at \.staycurrent\/staged\/databases\/; topics\/ untouched$/m);
  assert.match(r.stdout, /^Action:  /m);

  assert.ok(fs.existsSync(stagedDir(SLUG)), 'a blocked cut must leave the staged tree intact');
  assert.ok(fs.existsSync(sessionFile(SLUG)), 'a blocked cut must leave the session intact');
  assert.deepEqual(gitLogMessages(), beforeCommits, 'a blocked cut must not commit');

  run(['discard', SLUG]); // clean slate for the next case
});

test('cut halts with the non-advancing-version template when nothing was authored', () => {
  assert.equal(run(['convene', SLUG]).status, 0); // staged tree seeded as an exact copy of the live v1

  const beforeCommits = gitLogMessages();
  const r = run(['cut', SLUG]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /^Blocked: cut databases would not advance the version\.$/m);
  assert.match(r.stdout, /^Cause:   staged version 1 does not exceed live version 1/m);
  assert.match(r.stdout, /^State:   staged set intact at \.staycurrent\/staged\/databases\/; topics\/ untouched$/m);

  assert.ok(fs.existsSync(stagedDir(SLUG)));
  assert.ok(fs.existsSync(sessionFile(SLUG)));
  assert.deepEqual(gitLogMessages(), beforeCommits);

  run(['discard', SLUG]); // clean slate for the next case
});

test('cut lands v2 after authoring, then converged re-entry recovers a lost commit', () => {
  assert.equal(run(['convene', SLUG]).status, 0);
  authorNextVersion(SLUG, 2);

  const r = run(['cut', SLUG]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^cut\(databases\): v2$/m);
  assert.deepEqual(gitLogMessages(), ['cut(databases): v2', 'log(databases): no-cut', 'cut(databases): v1']);
  assert.ok(!fs.existsSync(stagedDir(SLUG)));

  // Simulate the crash window `cut`'s converged re-entry exists for: the fs sync
  // landed (topics/databases already reads v2) but the git commit never happened.
  // Reconstruct that state by hand rather than actually crashing the process:
  // recreate the staged tree as a byte-identical copy of what's now committed,
  // then rewind HEAD without touching the index or working tree (git reset
  // --soft) so the v2 changes sit staged-but-uncommitted, same as a commit that
  // never completed.
  fs.cpSync(path.join(repoDir, 'topics', SLUG), stagedDir(SLUG), { recursive: true });
  const beforeReset = gitLogMessages();
  git(['reset', '--soft', 'HEAD^']);
  assert.deepEqual(gitLogMessages(), beforeReset.slice(1), 'the v2 commit should be "lost"');

  const r2 = run(['cut', SLUG]);
  assert.equal(r2.status, 0);
  assert.match(r2.stdout, /^Cut v2 — article, skill, changelog entry, provenance; RSS follows at site build\.$/m);
  assert.match(r2.stdout, /^cut\(databases\): v2$/m);
  assert.deepEqual(gitLogMessages(), beforeReset, 'converged re-entry must recover exactly the lost commit');
  assert.ok(!fs.existsSync(stagedDir(SLUG)), 'converged re-entry must still clean up the staged tree');

  const status = git(['status', '--porcelain']);
  assert.equal(status.stdout.trim(), '', 'converged re-entry must leave a clean working tree');
});

// ---------------------------------------------------------------------------
// --json
// ---------------------------------------------------------------------------

test('status --json prints the typed { reverted, topics, errors } value', () => {
  const r = run(['status', '--json']);
  assert.equal(r.status, 0);
  const parsed = JSON.parse(r.stdout);
  assert.ok(Array.isArray(parsed.reverted));
  assert.ok(Array.isArray(parsed.topics));
  assert.ok(Array.isArray(parsed.errors));
  assert.ok(parsed.topics.some((t) => t.topic === SLUG && t.version === 2));
});

test('gate --json prints GateResult verbatim on a pass', () => {
  assert.equal(run(['convene', SLUG]).status, 0);
  const r = run(['gate', SLUG, '--json']);
  assert.equal(r.status, 0);
  const parsed = JSON.parse(r.stdout);
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.failures, []);
  assert.ok(typeof parsed.dir === 'string' && parsed.dir.endsWith(`staged/${SLUG}`));
  run(['discard', SLUG]);
});

// ---------------------------------------------------------------------------
// Flag-parser strictness — no silent misparse can reach a core call or a commit
// ---------------------------------------------------------------------------

test('flag parser rejects missing values, flag-shaped values, and stray positionals with exit 2', () => {
  for (const args of [
    ['create', SLUG, '--title'], // flag value missing
    ['create', SLUG, '--title', '--json'], // flag value is itself a flag
    ['status', 'stray'], // stray positional
    ['gate', SLUG, 'stray'], // stray positional after the slug
    ['cut', SLUG, '--bogus-flag'], // unknown flag left over as a stray positional
    ['log', SLUG, '--line'], // repeatable flag value missing
  ]) {
    const r = run(args);
    assert.equal(r.status, 2, `expected exit 2 for ${JSON.stringify(args)}, got ${r.status}`);
    assert.ok(r.stderr.trim(), `expected a usage-error line on stderr for ${JSON.stringify(args)}`);
  }
});

// ---------------------------------------------------------------------------
// The remaining `cut`/`log` state-machine arms (amended contract)
// ---------------------------------------------------------------------------

test('cut halts when the committed topic fails its own gate and nothing is staged', () => {
  const provenancePath = path.join(repoDir, 'topics', SLUG, 'versions', 'v2', 'provenance.md');
  const original = fs.readFileSync(provenancePath);
  fs.writeFileSync(provenancePath, '## Sources\n\n## Synthesis\n\n'); // corrupt the landed artifact

  const beforeCommits = gitLogMessages();
  const r = run(['cut', SLUG]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /^Blocked: the committed topic databases fails its own publish gate\.$/m);
  assert.match(r.stdout, /^Cause:   provenance-non-empty: /m);
  assert.match(r.stdout, /^State:   no staged tree at \.staycurrent\/staged\/databases\/; topics\/databases\/ holds the broken tree$/m);
  assert.match(r.stdout, /^Action:  /m);
  assert.deepEqual(gitLogMessages(), beforeCommits, 'a broken committed topic must never produce a commit');

  fs.writeFileSync(provenancePath, original); // restore
  assert.equal(git(['status', '--porcelain']).stdout.trim(), '', 'restore must leave a clean tree');
});

test('log validation failure exits 1 and leaves the run fully intact', () => {
  assert.equal(run(['convene', SLUG]).status, 0);

  const beforeCommits = gitLogMessages();
  const r = run(['log', SLUG, '--date', 'not-a-date', '--line', 'a', '--line', 'b']);
  assert.equal(r.status, 1);
  assert.ok(r.stderr.trim(), 'the validation error goes to stderr in human mode');

  assert.ok(fs.existsSync(sessionFile(SLUG)), 'a failed log must leave the session intact');
  assert.ok(fs.existsSync(stagedDir(SLUG)), 'a failed log must leave the staged tree intact');
  assert.match(readArticle(SLUG), /^status: in-research$/m, 'a failed log must not resolve the run');
  assert.deepEqual(gitLogMessages(), beforeCommits, 'a failed log must not commit');
});

test('log converged re-entry recovers a resolution whose commit was lost', () => {
  // Continue from the open run the previous test left: resolve it for real.
  const logArgs = ['log', SLUG, '--line', 'first fact.', '--line', 'second fact.'];
  assert.equal(run(logArgs).status, 0);
  const committed = gitLogMessages();
  assert.equal(committed[0], 'log(databases): no-cut');

  // Simulate the crash window the amended 03 names: recordNoCut's fs writes
  // applied (status current, research-log entry present) but the commit lost —
  // reconstruct by rewinding HEAD while keeping the tree/index, and restoring
  // the session file the interrupted cleanup never deleted.
  git(['reset', '--soft', 'HEAD^']);
  assert.deepEqual(gitLogMessages(), committed.slice(1), 'the no-cut commit should be "lost"');
  fs.mkdirSync(path.dirname(sessionFile(SLUG)), { recursive: true });
  fs.writeFileSync(
    sessionFile(SLUG),
    `---\ntopic: ${SLUG}\nphase: deciding\nopened: 2026-01-01\nagainst_version: 2\n---\n`
  );

  const r = run(logArgs);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^Logged no-cut for databases — last_researched \d{4}-\d{2}-\d{2}\. Commit: log\(databases\): no-cut$/m);
  assert.deepEqual(gitLogMessages(), committed, 're-entry must recover exactly the lost commit');
  assert.ok(!fs.existsSync(sessionFile(SLUG)), 're-entry must complete the lost cleanup');
  assert.equal(git(['status', '--porcelain']).stdout.trim(), '', 're-entry must leave a clean tree');
});

test('cut sibling crash window: commit landed, cleanup lost — re-entry cleans up without a duplicate commit', () => {
  // Land a real v3 first.
  assert.equal(run(['convene', SLUG]).status, 0);
  authorNextVersion(SLUG, 3);
  assert.equal(run(['cut', SLUG]).status, 0);
  const committed = gitLogMessages();
  assert.equal(committed[0], 'cut(databases): v3');

  // Simulate the OTHER half of the crash window: the commit landed but the
  // cleanup (staged tree + session file deletion) was lost.
  fs.cpSync(path.join(repoDir, 'topics', SLUG), stagedDir(SLUG), { recursive: true });
  fs.writeFileSync(
    sessionFile(SLUG),
    `---\ntopic: ${SLUG}\nphase: deciding\nopened: 2026-01-01\nagainst_version: 2\n---\n`
  );

  const r = run(['cut', SLUG]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^Cut v3 — article, skill, changelog entry, provenance; RSS follows at site build\.$/m);
  assert.deepEqual(gitLogMessages(), committed, 'the re-entry must not create a duplicate commit');
  assert.ok(!fs.existsSync(stagedDir(SLUG)), 're-entry must complete the lost staged-tree cleanup');
  assert.ok(!fs.existsSync(sessionFile(SLUG)), 're-entry must complete the lost session cleanup');
  assert.equal(git(['status', '--porcelain']).stdout.trim(), '');
});

test('cut --json with nothing staged and a complete topic prints the degenerate CutReport', () => {
  const r = run(['cut', SLUG, '--json']);
  assert.equal(r.status, 0);
  assert.deepEqual(JSON.parse(r.stdout), { topic: SLUG, version: 3, paths: [], removed: [] });
});

// ---------------------------------------------------------------------------
// status perimeter — reconciliation and malformed-topic resilience
// ---------------------------------------------------------------------------

test('status reconciles an orphaned in-research stamp, and discard clears the leftovers truthfully', () => {
  assert.equal(run(['convene', SLUG]).status, 0);
  fs.rmSync(sessionFile(SLUG)); // orphan the stamp: in-research with no session file

  const r = run(['status']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^reconciled databases: in-research had no session file — status reverted to current$/m);
  const row = r.stdout.split('\n').find((l) => l.startsWith(SLUG));
  assert.match(row, /current/);
  assert.match(readArticle(SLUG), /^status: current$/m);

  // The staged tree convene seeded survives the reconcile — an orphaned staged
  // tree alone is now discardable (amended 03), and the success message must
  // not claim a status revert that never happened.
  assert.ok(fs.existsSync(stagedDir(SLUG)));
  const d = run(['discard', SLUG]);
  assert.equal(d.status, 0);
  assert.equal(d.stdout.trim(), `Discarded session for ${SLUG} — nothing published changed.`);
  assert.ok(!fs.existsSync(stagedDir(SLUG)));
});

test('status reports a malformed topic on exit 1 without blinding the catalogue', () => {
  const brokenDir = path.join(repoDir, 'topics', 'zzz-broken');
  fs.mkdirSync(brokenDir, { recursive: true });
  fs.writeFileSync(path.join(brokenDir, 'article.md'), 'not frontmatter at all\n');

  const r = run(['status']);
  assert.equal(r.status, 1);
  const row = r.stdout.split('\n').find((l) => l.startsWith(SLUG));
  assert.ok(row, 'the valid topic must still list alongside the broken one');
  assert.match(r.stdout, /^malformed zzz-broken: /m);

  fs.rmSync(brokenDir, { recursive: true, force: true });
  assert.equal(git(['status', '--porcelain']).stdout.trim(), '');
});
