import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTopic } from './createTopic.js';
import { runPublishGate } from '../runPublishGate.js';
import { ContentValidationError } from '../errors.js';
import { makeTmpRoot } from '../loaders/fixtures.testutil.js';

describe('createTopic', () => {
  it('seeds a StagedCut at .staycurrent/staged/<slug>/, version 1', () => {
    const root = makeTmpRoot();

    const staged = createTopic(root, 'cost-engineering', { title: 'Cost Engineering' });

    expect(staged.topic).toBe('cost-engineering');
    expect(staged.version).toBe(1);
    expect(staged.dir).toBe(path.join(root, '.staycurrent', 'staged', 'cost-engineering'));
    expect(fs.statSync(staged.dir).isDirectory()).toBe(true);
  });

  it('seeds the complete gate-shaped artifact set', () => {
    const root = makeTmpRoot();
    const staged = createTopic(root, 'observability', { title: 'Observability' });

    for (const rel of [
      'article.md',
      'changelog.md',
      'research-log.md',
      'skill/SKILL.md',
      'versions/v1/article.md',
      'versions/v1/skill/SKILL.md',
      'versions/v1/provenance.md',
    ]) {
      expect(fs.existsSync(path.join(staged.dir, rel)), rel).toBe(true);
    }
  });

  it('fails the real gate on empty provenance alone — the founding TODO list, at minimum', () => {
    const root = makeTmpRoot();
    const staged = createTopic(root, 'edge-computing', { title: 'Edge Computing' });

    const gate = runPublishGate(staged.dir);

    expect(gate.ok).toBe(false);
    expect(gate.failures).toEqual([
      {
        check: 'provenance-non-empty',
        path: 'versions/v1/provenance.md',
        message: 'versions/v1/provenance.md has no entries in Sources or Synthesis',
      },
    ]);
  });

  it('seeds atomically: a stale temp dir from a simulated crash never blocks the retry', () => {
    const root = makeTmpRoot();

    // A crash mid-seed leaves only a dot-prefixed temp sibling, never a partial
    // .staycurrent/staged/<slug>/ — so the retry is not rejected as already-staged.
    const stagedParent = path.join(root, '.staycurrent', 'staged');
    fs.mkdirSync(path.join(stagedParent, '.tmp-databases-stale'), { recursive: true });
    fs.writeFileSync(path.join(stagedParent, '.tmp-databases-stale', 'article.md'), 'partial junk');

    const staged = createTopic(root, 'databases', { title: 'Databases' });

    expect(staged.dir).toBe(path.join(stagedParent, 'databases'));
    expect(fs.existsSync(path.join(staged.dir, 'versions', 'v1', 'provenance.md'))).toBe(true);
  });

  describe('rejects', () => {
    it('a slug that is not kebab-case', () => {
      const root = makeTmpRoot();
      expect(() => createTopic(root, 'Cost_Engineering', { title: 'x' })).toThrow(ContentValidationError);
    });

    it('a slug with more than 3 words', () => {
      const root = makeTmpRoot();
      expect(() => createTopic(root, 'a-b-c-d', { title: 'x' })).toThrow(ContentValidationError);
    });

    it('a reserved slug', () => {
      const root = makeTmpRoot();
      expect(() => createTopic(root, 'changelog', { title: 'x' })).toThrow(ContentValidationError);
    });

    it('a slug already published under topics/', () => {
      const root = makeTmpRoot();
      fs.mkdirSync(path.join(root, 'topics', 'databases'), { recursive: true });
      expect(() => createTopic(root, 'databases', { title: 'x' })).toThrow(ContentValidationError);
    });

    it('a slug that already has a staged tree', () => {
      const root = makeTmpRoot();
      createTopic(root, 'databases', { title: 'Databases' });
      expect(() => createTopic(root, 'databases', { title: 'Databases again' })).toThrow(
        ContentValidationError
      );
    });
  });
});
