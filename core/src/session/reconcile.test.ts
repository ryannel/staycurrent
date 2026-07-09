import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { reconcile } from './reconcile.js';
import { writeCompleteTopic } from '../cut/topicFixtures.testutil.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { makeTmpRoot, writeTopicFixture } from '../loaders/fixtures.testutil.js';

function stampInResearch(root: string, slug: string): void {
  const articlePath = path.join(root, 'topics', slug, 'article.md');
  fs.writeFileSync(
    articlePath,
    fs.readFileSync(articlePath, 'utf8').replace(/^status: current$/m, 'status: in-research')
  );
}

function statusOf(root: string, slug: string): string {
  const raw = fs.readFileSync(path.join(root, 'topics', slug, 'article.md'), 'utf8');
  return /^status: (.+)$/m.exec(raw)![1];
}

describe('reconcile', () => {
  describe('single-slug form', () => {
    it('reverts in-research to current when sessionExists is false', () => {
      const root = makeTmpRoot();
      writeCompleteTopic(root, 'databases');
      stampInResearch(root, 'databases');

      const report = reconcile(root, 'databases', { sessionExists: false });

      expect(report.reverted).toEqual(['databases']);
      expect(statusOf(root, 'databases')).toBe('current');
    });

    it('leaves in-research untouched when sessionExists is true — a resumable run, not drift', () => {
      const root = makeTmpRoot();
      writeCompleteTopic(root, 'databases');
      stampInResearch(root, 'databases');

      const report = reconcile(root, 'databases', { sessionExists: true });

      expect(report.reverted).toEqual([]);
      expect(statusOf(root, 'databases')).toBe('in-research');
    });

    it('fail-safe default: an unset sessionExists is treated as session-present and left untouched', () => {
      const root = makeTmpRoot();
      writeCompleteTopic(root, 'databases');
      stampInResearch(root, 'databases');

      const report = reconcile(root, 'databases', {});

      expect(report.reverted).toEqual([]);
      expect(statusOf(root, 'databases')).toBe('in-research');
    });

    it('leaves a current topic untouched regardless of sessionExists', () => {
      const root = makeTmpRoot();
      writeCompleteTopic(root, 'databases'); // status: current

      const report = reconcile(root, 'databases', { sessionExists: false });

      expect(report.reverted).toEqual([]);
      expect(statusOf(root, 'databases')).toBe('current');
    });

    it('throws ContentNotFoundError when slug is given but no such topic exists', () => {
      const root = makeTmpRoot();
      expect(() => reconcile(root, 'no-such-topic', {})).toThrow(ContentNotFoundError);
    });
  });

  describe('sweep form (slug undefined)', () => {
    it('reverts only topics whose slug is reported false in the sessions map, defaulting absent slugs to present', () => {
      const root = makeTmpRoot();
      writeCompleteTopic(root, 'orphaned');
      writeCompleteTopic(root, 'resumable');
      writeCompleteTopic(root, 'not-reported'); // absent from `sessions` — fail-safe default
      stampInResearch(root, 'orphaned');
      stampInResearch(root, 'resumable');
      stampInResearch(root, 'not-reported');

      const report = reconcile(root, undefined, {
        sessions: { orphaned: false, resumable: true },
      });

      expect(report.reverted).toEqual(['orphaned']);
      expect(statusOf(root, 'orphaned')).toBe('current');
      expect(statusOf(root, 'resumable')).toBe('in-research');
      expect(statusOf(root, 'not-reported')).toBe('in-research');
    });

    it('returns an empty report when nothing needs reconciling', () => {
      const root = makeTmpRoot();
      writeCompleteTopic(root, 'databases'); // status: current

      const report = reconcile(root, undefined, { sessions: {} });

      expect(report.reverted).toEqual([]);
    });

    it('returns an empty report for a zero-topics root — first run, not an error', () => {
      const root = makeTmpRoot();
      const report = reconcile(root, undefined, {});
      expect(report.reverted).toEqual([]);
    });

    it('throws ContentValidationError on a malformed topic instead of skipping it — reconcile fails fast, unlike listTopics', () => {
      const root = makeTmpRoot();
      writeTopicFixture(root, 'broken', { status: 'bogus' as 'current' });
      expect(() => reconcile(root, undefined, {})).toThrow(ContentValidationError);
    });
  });
});
