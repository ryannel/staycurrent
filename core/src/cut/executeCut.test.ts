import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { executeCut } from './executeCut.js';
import { createTopic } from './createTopic.js';
import { ContentNotFoundError, ContentValidationError, GateNotPassedError } from '../errors.js';
import { runPublishGate } from '../runPublishGate.js';
import { makeTmpRoot } from '../loaders/fixtures.testutil.js';

/** Authors the minimal content a founding `createTopic` skeleton needs to pass the gate. */
function authorMinimalContent(stagedDir: string): void {
  fs.writeFileSync(
    path.join(stagedDir, 'versions', 'v1', 'provenance.md'),
    '## Sources\n\n' +
      '- [Example Source](https://example.com/fixture) — accessed 2026-01-01 — supports: the claim\n\n' +
      '## Synthesis\n\n- A synthesized claim stated plainly.\n'
  );
}

// The founding skeleton's complete artifact set — the independent oracle the
// passing-cut test holds report.paths against (review requirement: not derived
// from the implementation's own walk).
const EXPECTED_FOUNDING_PATHS = (slug: string): string[] =>
  [
    `topics/${slug}/article.md`,
    `topics/${slug}/changelog.md`,
    `topics/${slug}/research-log.md`,
    `topics/${slug}/skill/SKILL.md`,
    `topics/${slug}/versions/v1/article.md`,
    `topics/${slug}/versions/v1/provenance.md`,
    `topics/${slug}/versions/v1/skill/SKILL.md`,
  ].sort();

describe('executeCut', () => {
  it('throws GateNotPassedError before touching topics/ when gateResult.ok is false', () => {
    const root = makeTmpRoot();
    const failures = [{ check: 'provenance-non-empty' as const, path: 'x', message: 'y' }];

    expect(() => executeCut(root, 'fixture-refused', { ok: false, failures, dir: '' })).toThrow(
      GateNotPassedError
    );
    expect(fs.existsSync(path.join(root, 'topics', 'fixture-refused'))).toBe(false);
  });

  it('carries GateResult.failures onto the thrown error, whether freshly failing or a stale cached result', () => {
    const root = makeTmpRoot();
    const staleFailures = [
      { check: 'provenance-non-empty' as const, path: 'versions/v1/provenance.md', message: 'stale' },
    ];

    try {
      executeCut(root, 'fixture-refused', { ok: false, failures: staleFailures, dir: '' });
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(GateNotPassedError);
      expect((err as InstanceType<typeof GateNotPassedError>).failures).toEqual(staleFailures);
    }
  });

  it('throws ContentNotFoundError when no staged tree exists — never a silent empty success', () => {
    const root = makeTmpRoot();

    expect(() =>
      executeCut(root, 'fixture-missing', { ok: true, failures: [], dir: 'anywhere' })
    ).toThrow(ContentNotFoundError);
  });

  it('refuses a GateResult produced for a different directory — GateNotPassedError, nothing landed', () => {
    const root = makeTmpRoot();
    const stagedA = createTopic(root, 'alpha-topic', { title: 'Alpha' });
    createTopic(root, 'beta-topic', { title: 'Beta' });
    authorMinimalContent(stagedA.dir);
    const gateA = runPublishGate(stagedA.dir); // validates alpha's tree
    expect(gateA.ok).toBe(true);

    expect(() => executeCut(root, 'beta-topic', gateA)).toThrow(GateNotPassedError);
    expect(fs.existsSync(path.join(root, 'topics', 'beta-topic'))).toBe(false);
  });

  it('throws ContentValidationError for an empty staged tree (N=0) — monotonicity fails even under a forged passing gate', () => {
    const root = makeTmpRoot();
    const stagedDir = path.join(root, '.staycurrent', 'staged', 'fixture-empty');
    fs.mkdirSync(stagedDir, { recursive: true });

    expect(() =>
      executeCut(root, 'fixture-empty', { ok: true, failures: [], dir: stagedDir })
    ).toThrow(ContentValidationError);
    expect(fs.existsSync(path.join(root, 'topics', 'fixture-empty'))).toBe(false);
  });

  it('lands a passing staged set into topics/<slug>/ byte-identically, paths matching the independent oracle', () => {
    const root = makeTmpRoot();
    const staged = createTopic(root, 'databases', { title: 'Databases' });
    authorMinimalContent(staged.dir);

    const gate = runPublishGate(staged.dir);
    expect(gate.ok).toBe(true);

    const report = executeCut(root, 'databases', gate);

    expect(report.topic).toBe('databases');
    expect(report.version).toBe(1);
    expect(report.paths.slice().sort()).toEqual(EXPECTED_FOUNDING_PATHS('databases'));
    expect(report.removed).toEqual([]);

    for (const rel of report.paths) {
      const stagedRel = rel.replace('topics/databases/', '');
      const stagedBytes = fs.readFileSync(path.join(staged.dir, stagedRel));
      const liveBytes = fs.readFileSync(path.join(root, rel));
      expect(liveBytes.equals(stagedBytes), rel).toBe(true);
    }
  });

  it('crash recovery: a partial landing (all files except article.md) completes cleanly on re-run', () => {
    const root = makeTmpRoot();
    const staged = createTopic(root, 'observability', { title: 'Observability' });
    authorMinimalContent(staged.dir);
    const gate = runPublishGate(staged.dir);
    expect(gate.ok).toBe(true);

    // Simulate the crash the landing order is designed around: every artifact
    // landed except the version-bearing article.md (which lands LAST).
    const targetDir = path.join(root, 'topics', 'observability');
    fs.cpSync(staged.dir, targetDir, { recursive: true });
    fs.rmSync(path.join(targetDir, 'article.md'));

    // The partial tree reads as version 0 (no live article), so monotonicity
    // admits the completing re-run.
    const report = executeCut(root, 'observability', gate);

    expect(report.paths.slice().sort()).toEqual(EXPECTED_FOUNDING_PATHS('observability'));
    const landed = fs.readFileSync(path.join(targetDir, 'article.md'), 'utf8');
    expect(landed).toMatch(/^version: 1$/m);
    expect(landed).toMatch(/^status: current$/m);
  });
});
