import { describe, expect, it } from 'vitest';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { loadResearchLog } from './loadResearchLog.js';
import { makeTmpRoot, writeFile } from './fixtures.testutil.js';

const HEADER = '# Databases — Research Log\n\n';

describe('loadResearchLog', () => {
  it('parses cut and no-cut entries newest first', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/research-log.md',
      HEADER +
        '## 2026-06-12 — cut v2\n\nLine one.\nLine two.\n\n' +
        '## 2026-03-01 — no-cut\n\nNothing warranted a cut.\n'
    );

    const entries = loadResearchLog(root, 'databases');

    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({ date: '2026-06-12', outcome: 'cut', version: 2 });
    expect(entries[0].lines).toEqual(['Line one.', 'Line two.']);
    expect(entries[1]).toMatchObject({ date: '2026-03-01', outcome: 'no-cut' });
    expect(entries[1].version).toBeUndefined();
  });

  it('throws ContentNotFoundError when research-log.md is missing', () => {
    const root = makeTmpRoot();
    expect(() => loadResearchLog(root, 'databases')).toThrow(ContentNotFoundError);
  });

  it('throws ContentValidationError for a heading matching neither cut nor no-cut shape', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/research-log.md', HEADER + '## June 12 2026\n\nSomething happened.\n');
    expect(() => loadResearchLog(root, 'databases')).toThrow(ContentValidationError);
  });

  it('throws ContentValidationError for a calendrically impossible heading date', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/research-log.md', HEADER + '## 2026-02-30 — no-cut\n\nExamined.\n');
    try {
      loadResearchLog(root, 'databases');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      expect((err as ContentValidationError).issues[0]).toContain('2026-02-30');
    }
  });

  it('throws ContentValidationError for a v0 cut heading — versions are positive integers', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/research-log.md', HEADER + '## 2026-06-12 — cut v0\n\nExamined.\n');
    expect(() => loadResearchLog(root, 'databases')).toThrow(ContentValidationError);
  });
});
