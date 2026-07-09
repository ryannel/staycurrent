import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { assertValidSlug } from './slug.js';
import { ContentValidationError } from './errors.js';
import { createTopic } from './cut/createTopic.js';
import { executeCut } from './cut/executeCut.js';
import { stageCut } from './cut/stageCut.js';
import { convene } from './session/convene.js';
import { discardSession } from './session/discardSession.js';
import { recordNoCut } from './session/recordNoCut.js';
import { reconcile } from './session/reconcile.js';
import { makeTmpRoot } from './loaders/fixtures.testutil.js';

describe('assertValidSlug', () => {
  it.each(['databases', 'cost-engineering', 'a-b-c', 'topic2'])('accepts %s', (slug) => {
    expect(() => assertValidSlug(slug)).not.toThrow();
  });

  it.each([
    ['uppercase', 'Databases'],
    ['snake_case', 'cost_engineering'],
    ['more than 3 words', 'a-b-c-d'],
    ['path traversal', '../../x'],
    ['path separator', 'a/b'],
    ['dot segment', '.'],
    ['empty', ''],
    ['leading hyphen', '-databases'],
    ['reserved: skills', 'skills'],
    ['reserved: changelog', 'changelog'],
    ['reserved: about', 'about'],
  ])('rejects %s (%s) with ContentValidationError', (_label, slug) => {
    expect(() => assertValidSlug(slug)).toThrow(ContentValidationError);
  });
});

describe('every write-side entry point rejects a traversal slug before touching the filesystem', () => {
  const TRAVERSAL = '../../escape';

  const calls: Array<[string, (root: string) => void]> = [
    ['createTopic', (root) => createTopic(root, TRAVERSAL, { title: 'x' })],
    ['stageCut', (root) => stageCut(root, TRAVERSAL)],
    [
      'executeCut',
      (root) => executeCut(root, TRAVERSAL, { ok: true, failures: [], dir: 'anywhere' }),
    ],
    ['convene', (root) => convene(root, TRAVERSAL)],
    [
      'recordNoCut',
      (root) =>
        recordNoCut(root, TRAVERSAL, { lastResearched: '2026-07-09', researchLogLines: ['x'] }),
    ],
    ['discardSession', (root) => discardSession(root, TRAVERSAL)],
    ['reconcile (single-slug)', (root) => reconcile(root, TRAVERSAL, { sessionExists: false })],
  ];

  it.each(calls)('%s', (_name, call) => {
    const root = makeTmpRoot();

    expect(() => call(root)).toThrow(ContentValidationError);

    // The guard fired before any filesystem effect: the root is still empty.
    expect(fs.readdirSync(root)).toEqual([]);
  });
});
