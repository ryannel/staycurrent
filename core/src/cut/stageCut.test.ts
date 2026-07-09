import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { stageCut } from './stageCut.js';
import { writeCompleteTopic } from './topicFixtures.testutil.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { makeTmpRoot, writeTopicFixture } from '../loaders/fixtures.testutil.js';

/** Every file under `dir`, as sorted dir-relative POSIX paths — the test's own walk. */
function listFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (current: string, rel: string): void => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(path.join(current, entry.name), entryRel);
      else out.push(entryRel);
    }
  };
  walk(dir, '');
  return out.sort();
}

describe('stageCut', () => {
  it('copies the committed tree forward byte-identically — the full tree, versions/ included — and targets live version + 1', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases', { version: 3, n: 3 });

    const staged = stageCut(root, 'databases');

    expect(staged.topic).toBe('databases');
    expect(staged.version).toBe(4); // live version (3) + 1
    expect(staged.dir).toBe(path.join(root, '.staycurrent', 'staged', 'databases'));

    // Recursive comparison: identical file sets, identical bytes throughout.
    const liveDir = path.join(root, 'topics', 'databases');
    const liveFiles = listFiles(liveDir);
    expect(listFiles(staged.dir)).toEqual(liveFiles);
    expect(liveFiles).toContain('versions/v3/provenance.md'); // the walk really reaches versions/
    for (const rel of liveFiles) {
      const live = fs.readFileSync(path.join(liveDir, rel));
      const copied = fs.readFileSync(path.join(staged.dir, rel));
      expect(copied.equals(live), rel).toBe(true);
    }
  });

  it('is an idempotent re-seed: a second call leaves an authored staged tree intact', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases');

    const first = stageCut(root, 'databases');
    fs.writeFileSync(path.join(first.dir, 'marker.txt'), 'authored draft — must survive re-seed');

    const second = stageCut(root, 'databases');

    expect(second.dir).toBe(first.dir);
    expect(second.version).toBe(first.version);
    expect(fs.readFileSync(path.join(second.dir, 'marker.txt'), 'utf8')).toBe(
      'authored draft — must survive re-seed'
    );
  });

  it('seeds atomically: a stale temp dir from a simulated crash never blocks the retry', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases');

    // A crash mid-seed leaves only a dot-prefixed temp sibling — simulate one.
    const stagedParent = path.join(root, '.staycurrent', 'staged');
    fs.mkdirSync(path.join(stagedParent, '.tmp-databases-stale'), { recursive: true });
    fs.writeFileSync(path.join(stagedParent, '.tmp-databases-stale', 'article.md'), 'partial junk');

    const staged = stageCut(root, 'databases');

    // The retry succeeded and the staged tree is the complete copy, not the junk.
    expect(staged.dir).toBe(path.join(stagedParent, 'databases'));
    expect(
      fs
        .readFileSync(path.join(staged.dir, 'article.md'))
        .equals(fs.readFileSync(path.join(root, 'topics', 'databases', 'article.md')))
    ).toBe(true);
  });

  it('throws ContentNotFoundError when the topic does not exist', () => {
    const root = makeTmpRoot();
    expect(() => stageCut(root, 'no-such-topic')).toThrow(ContentNotFoundError);
  });

  it('throws ContentValidationError when the live frontmatter fails schema validation', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'broken-topic', { status: 'bogus' as 'current' });
    expect(() => stageCut(root, 'broken-topic')).toThrow(ContentValidationError);
  });
});
