import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { discardSession } from './discardSession.js';
import { writeCompleteTopic } from '../cut/topicFixtures.testutil.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { makeTmpRoot } from '../loaders/fixtures.testutil.js';

function stampInResearch(articlePath: string): void {
  fs.writeFileSync(
    articlePath,
    fs.readFileSync(articlePath, 'utf8').replace(/^status: current$/m, 'status: in-research')
  );
}

describe('discardSession', () => {
  it('reverts status to current and touches nothing else — no research-log entry, no last_researched change', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases', { lastResearched: '2026-05-01' });
    const articlePath = path.join(root, 'topics', 'databases', 'article.md');
    stampInResearch(articlePath);
    const stampedRaw = fs.readFileSync(articlePath, 'utf8');
    const logBefore = fs.readFileSync(path.join(root, 'topics', 'databases', 'research-log.md'), 'utf8');

    const result = discardSession(root, 'databases');

    expect(result).toBeUndefined();
    const after = fs.readFileSync(articlePath, 'utf8');
    expect(after).toBe(stampedRaw.replace(/^status: in-research$/m, 'status: current'));
    expect(after).toMatch(/^last_researched: 2026-05-01$/m); // untouched
    expect(fs.readFileSync(path.join(root, 'topics', 'databases', 'research-log.md'), 'utf8')).toBe(
      logBefore
    ); // untouched
  });

  it('throws ContentValidationError when status is not in-research — nothing to discard', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases'); // default status: current

    expect(() => discardSession(root, 'databases')).toThrow(ContentValidationError);
  });

  it('throws ContentNotFoundError when the topic does not exist', () => {
    const root = makeTmpRoot();
    expect(() => discardSession(root, 'no-such-topic')).toThrow(ContentNotFoundError);
  });
});
