import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { loadTopic } from './loadTopic.js';
import { makeTmpRoot, writeFile, writeTopicFixture } from './fixtures.testutil.js';

describe('loadTopic', () => {
  it('returns frontmatter, derived due, and a rendered body for a valid topic', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', {
      bodyMd: '# Databases\n\nStance restated.\n\n## Overview\n\nContent here.\n',
    });

    const topic = loadTopic(root, 'databases');

    expect(topic.frontmatter.topic).toBe('databases');
    expect(topic.frontmatter.status).toBe('current');
    expect(topic.frontmatter.last_researched).toBe('2026-01-15');
    expect(topic.body.html).toContain('Content here.');
    expect(topic.bodyMd).toContain('Content here.');
  });

  it('derives due: true for a stale topic (last_researched + cadence long past)', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'stale-topic', { lastResearched: '2020-01-01', cadence: '90d' });
    expect(loadTopic(root, 'stale-topic').due).toBe(true);
  });

  it('derives due: false for a fresh topic (cadence window not yet elapsed)', () => {
    const root = makeTmpRoot();
    const today = new Date().toISOString().slice(0, 10);
    writeTopicFixture(root, 'fresh-topic', { lastResearched: today, cadence: '3650d' });
    expect(loadTopic(root, 'fresh-topic').due).toBe(false);
  });

  it('throws ContentNotFoundError when no topics/<slug>/ directory exists', () => {
    const root = makeTmpRoot();
    expect(() => loadTopic(root, 'nope')).toThrow(ContentNotFoundError);
    try {
      loadTopic(root, 'nope');
      expect.unreachable();
    } catch (err) {
      expect((err as ContentNotFoundError).topic).toBe('nope');
      expect((err as ContentNotFoundError).path).toBe('topics/nope');
    }
  });

  it('throws ContentValidationError — not NotFound — for an empty topic dir with no article.md', () => {
    const root = makeTmpRoot();
    fs.mkdirSync(path.join(root, 'topics', 'empty-topic'), { recursive: true });

    try {
      loadTopic(root, 'empty-topic');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const e = err as ContentValidationError;
      expect(e.file).toBe('topics/empty-topic/article.md');
      expect(e.issues).toEqual(['article.md is missing']);
    }
  });

  it('throws ContentValidationError with the file and issue payload when frontmatter.topic !== slug', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { topicField: 'wrong-slug' });

    try {
      loadTopic(root, 'databases');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const e = err as ContentValidationError;
      expect(e.topic).toBe('databases');
      expect(e.file).toBe('topics/databases/article.md');
      expect(e.issues.some((i) => i.includes('wrong-slug') && i.includes('databases'))).toBe(true);
    }
  });

  it('throws ContentValidationError naming the field when schema validation fails', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { cadence: 'weekly' });

    try {
      loadTopic(root, 'databases');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const e = err as ContentValidationError;
      expect(e.file).toBe('topics/databases/article.md');
      expect(e.issues.some((i) => i.includes("field 'cadence'"))).toBe(true);
    }
  });

  it('throws ContentValidationError naming the field for a whitespace-only stance — G8', () => {
    const root = makeTmpRoot();
    // writeTopicFixture quotes stance in the raw YAML, so '   ' survives as a
    // genuine whitespace string rather than collapsing to null.
    writeTopicFixture(root, 'databases', { stance: '   ' });

    try {
      loadTopic(root, 'databases');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const e = err as ContentValidationError;
      expect(e.file).toBe('topics/databases/article.md');
      // Discriminating on the new branch's exact message, not just
      // `includes("field 'stance'")` — the old 'must be a string' branch also
      // contains that substring, so a loosely-worded assertion would still
      // pass if the new blank-value tightening regressed.
      expect(e.issues).toContain("field 'stance' must not be empty or whitespace-only");
    }
  });

  it('throws ContentValidationError naming the field for a whitespace-only title — G8', () => {
    // writeTopicFixture interpolates title unquoted, so a whitespace-only value
    // must be quoted in the raw YAML to survive as a string rather than
    // collapsing to null (which would instead hit the pre-existing
    // 'must be a string' branch, not the new blank-value tightening).
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/article.md',
      [
        '---',
        'topic: databases',
        'title: "   "',
        'stance: "A valid stance for this fixture."',
        'version: 1',
        'status: current',
        'cadence: 90d',
        'last_researched: 2026-01-15',
        '---',
        '',
        '# Databases',
        '',
        'Body.',
        '',
      ].join('\n')
    );

    try {
      loadTopic(root, 'databases');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const e = err as ContentValidationError;
      // Discriminating on the new branch's exact message — see the stance
      // test above for why a bare `includes("field 'title'")` is not enough.
      expect(e.issues).toContain("field 'title' must not be empty or whitespace-only");
    }
  });

  it('converts a YAML parse exception into ContentValidationError, never a bare throw', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/article.md', '---\ntopic: [unclosed\n---\n\nBody.\n');

    try {
      loadTopic(root, 'databases');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const e = err as ContentValidationError;
      expect(e.file).toBe('topics/databases/article.md');
      expect(e.issues[0]).toContain('frontmatter failed to parse');
    }
  });

  it('rejects an unquoted calendrically impossible date instead of rolling it forward', () => {
    // Under js-yaml's default schema 2026-02-30 would coerce to a Date and roll
    // to 2026-03-02; with CORE_SCHEMA it stays a string and isIsoDate rejects it.
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { lastResearched: '2026-02-30' });

    try {
      loadTopic(root, 'databases');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const e = err as ContentValidationError;
      expect(e.issues.some((i) => i.includes("field 'last_researched'") && i.includes('2026-02-30'))).toBe(
        true
      );
    }
  });
});
