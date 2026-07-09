import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTopic } from './createTopic.js';
import { executeCut } from './executeCut.js';
import { runPublishGate } from '../runPublishGate.js';
import { convene } from '../session/convene.js';
import { ContentValidationError } from '../errors.js';
import { loadTopic } from '../loaders/loadTopic.js';
import { loadVersion } from '../loaders/loadVersion.js';
import { isoDaysAgo } from '../runPublishGate.testutil.js';
import { makeTmpRoot } from '../loaders/fixtures.testutil.js';

// The v2 update-cut, real producers end to end: founding cut → convene → author v2
// into the staged tree → gate PASS → executeCut. Covers change-proposal-1's landing
// contract where it differs from the founding path: status normalization on a live
// article stamped in-research, deletion-sync with CutReport.removed, the v1
// snapshot surviving intact, and monotonicity rejecting a zero-authoring cut.

/** Lands the founding v1 through the real pipeline; returns the live topic dir. */
function landFoundingV1(root: string, slug: string, title: string): string {
  const staged = createTopic(root, slug, { title });
  fs.writeFileSync(
    path.join(staged.dir, 'versions', 'v1', 'provenance.md'),
    '## Sources\n\n' +
      `- [Founding Source](https://example.com/founding) — accessed ${isoDaysAgo(5)} — supports: the founding stance\n\n` +
      '## Synthesis\n\n- The founding synthesis claim.\n'
  );
  const gate = runPublishGate(staged.dir);
  if (!gate.ok) throw new Error(`fixture bug: founding gate failed: ${JSON.stringify(gate.failures)}`);
  executeCut(root, slug, gate);
  fs.rmSync(staged.dir, { recursive: true, force: true }); // the CLI's post-cut cleanup
  return path.join(root, 'topics', slug);
}

/** Authors a v2 into the convened staged tree the way the writer skill would. */
function authorV2(stagedDir: string): void {
  const cutDate = isoDaysAgo(1);

  // article.md: bump the version (status stays current — the staged baseline was
  // seeded before the in-research stamp).
  const articlePath = path.join(stagedDir, 'article.md');
  fs.writeFileSync(
    articlePath,
    fs.readFileSync(articlePath, 'utf8').replace(/^version: 1$/m, 'version: 2')
  );

  // changelog.md: the new ## v2 entry lands on top.
  const changelogPath = path.join(stagedDir, 'changelog.md');
  const changelog = fs.readFileSync(changelogPath, 'utf8');
  const firstEntryIdx = changelog.indexOf('## v1');
  fs.writeFileSync(
    changelogPath,
    changelog.slice(0, firstEntryIdx) +
      `## v2 — ${cutDate}\n\nWhat moved: the field moved.\n\nWhat it means: practice adjusts.\n\n**Stance:** held — position maintained.\n\n` +
      changelog.slice(firstEntryIdx)
  );

  // skill: bump article_version, keep live and frozen v2 byte-identical.
  const skillPath = path.join(stagedDir, 'skill', 'SKILL.md');
  fs.writeFileSync(
    skillPath,
    fs.readFileSync(skillPath, 'utf8').replace(/^article_version: 1$/m, 'article_version: 2')
  );
  const skillMd = fs.readFileSync(skillPath);

  // versions/v2/: snapshot article, byte-identical skill, non-empty provenance.
  const v2Dir = path.join(stagedDir, 'versions', 'v2');
  fs.mkdirSync(path.join(v2Dir, 'skill'), { recursive: true });
  fs.writeFileSync(
    path.join(v2Dir, 'article.md'),
    `---\nversion: 2\ncut: ${cutDate}\n---\n\n# Frozen v2\n\nFrozen body.\n`
  );
  fs.writeFileSync(path.join(v2Dir, 'skill', 'SKILL.md'), skillMd);
  fs.writeFileSync(
    path.join(v2Dir, 'provenance.md'),
    '## Sources\n\n' +
      `- [Update Source](https://example.com/update) — accessed ${cutDate} — supports: the v2 claim\n\n` +
      '## Synthesis\n\n- The v2 synthesis claim.\n'
  );
}

describe('the v2 update cut (real producers end to end)', () => {
  it('lands v2 with status normalized to current, the v1 snapshot intact, and deletions synced', () => {
    const root = makeTmpRoot();
    const slug = 'databases';
    const liveDir = landFoundingV1(root, slug, 'Databases');

    // A stray file in the live tree — the deletion-sync target.
    fs.writeFileSync(path.join(liveDir, 'scratch.md'), 'stray working note\n');
    const v1SnapshotBytes = fs.readFileSync(path.join(liveDir, 'versions', 'v1', 'article.md'));

    const result = convene(root, slug);

    // Seed-before-stamp: the staged baseline reads current, the live article in-research.
    expect(fs.readFileSync(path.join(result.stagedDir, 'article.md'), 'utf8')).toMatch(
      /^status: current$/m
    );
    expect(fs.readFileSync(path.join(liveDir, 'article.md'), 'utf8')).toMatch(
      /^status: in-research$/m
    );

    authorV2(result.stagedDir);
    fs.rmSync(path.join(result.stagedDir, 'scratch.md')); // the run deletes the stray file

    const gate = runPublishGate(result.stagedDir);
    expect(gate.ok, JSON.stringify(gate.failures)).toBe(true);

    const report = executeCut(root, slug, gate);

    expect(report.version).toBe(2);
    expect(report.removed).toEqual([`topics/${slug}/scratch.md`]);
    expect(fs.existsSync(path.join(liveDir, 'scratch.md'))).toBe(false);

    // The landed live article: v2, normalized to current (the live copy was
    // stamped in-research when the run convened).
    const landedArticle = fs.readFileSync(path.join(liveDir, 'article.md'), 'utf8');
    expect(landedArticle).toMatch(/^version: 2$/m);
    expect(landedArticle).toMatch(/^status: current$/m);

    // The v1 snapshot survives byte-identically.
    expect(
      fs.readFileSync(path.join(liveDir, 'versions', 'v1', 'article.md')).equals(v1SnapshotBytes)
    ).toBe(true);

    // The real loaders read the update-cut result back.
    const topic = loadTopic(root, slug);
    expect(topic.frontmatter.version).toBe(2);
    expect(topic.frontmatter.status).toBe('current');
    expect(loadVersion(root, slug, 1).meta.version).toBe(1);
    expect(loadVersion(root, slug, 2).meta.version).toBe(2);
  });

  it('rejects a zero-authoring cut: staged N == live N throws ContentValidationError, nothing landed', () => {
    const root = makeTmpRoot();
    const slug = 'observability';
    const liveDir = landFoundingV1(root, slug, 'Observability');

    const result = convene(root, slug); // seeds the v1 copy; nothing authored
    const liveArticleAfterConvene = fs.readFileSync(path.join(liveDir, 'article.md'));

    const gate = runPublishGate(result.stagedDir);
    expect(gate.ok).toBe(true); // a faithful copy of a complete v1 passes the gate

    expect(() => executeCut(root, slug, gate)).toThrow(ContentValidationError);

    // Nothing landed: the live article — convene stamp included — is untouched.
    expect(
      fs.readFileSync(path.join(liveDir, 'article.md')).equals(liveArticleAfterConvene)
    ).toBe(true);
  });
});
