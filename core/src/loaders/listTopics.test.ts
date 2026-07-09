import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { listTopics } from './listTopics.js';
import { makeTmpRoot, writeFile, writeTopicFixture } from './fixtures.testutil.js';

describe('listTopics', () => {
  it('returns { topics: [], errors: [] } — not a throw — when topics/ does not exist yet', () => {
    const root = makeTmpRoot();
    expect(listTopics(root)).toEqual({ topics: [], errors: [] });
  });

  it('returns { topics: [], errors: [] } when topics/ exists but is empty', () => {
    const root = makeTmpRoot();
    fs.mkdirSync(path.join(root, 'topics'), { recursive: true });
    expect(listTopics(root)).toEqual({ topics: [], errors: [] });
  });

  it('sorts valid topics by slug ascending', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'zebra');
    writeTopicFixture(root, 'apple');
    writeTopicFixture(root, 'mango');

    const { topics } = listTopics(root);
    expect(topics.map((t) => t.topic)).toEqual(['apple', 'mango', 'zebra']);
  });

  it('derives due values per topic: true for stale, false for fresh', () => {
    const root = makeTmpRoot();
    const today = new Date().toISOString().slice(0, 10);
    writeTopicFixture(root, 'stale-topic', { lastResearched: '2020-01-01', cadence: '90d' });
    writeTopicFixture(root, 'fresh-topic', { lastResearched: today, cadence: '3650d' });

    const { topics } = listTopics(root);
    const bySlug = Object.fromEntries(topics.map((t) => [t.topic, t]));
    expect(bySlug['stale-topic'].due).toBe(true);
    expect(bySlug['fresh-topic'].due).toBe(false);
  });

  it('reports a malformed topic in errors by slug and keeps the rest of the sweep intact', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'good-topic');
    writeTopicFixture(root, 'broken-topic', { status: 'archived' as never });

    const { topics, errors } = listTopics(root);
    expect(topics.map((t) => t.topic)).toEqual(['good-topic']);
    expect(errors).toHaveLength(1);
    expect(errors[0].slug).toBe('broken-topic');
    expect(errors[0].message).toContain('article.md');
    expect(errors[0].message).toContain('status');
  });

  it('reports a topic whose frontmatter.topic does not match its directory name', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'dir-name', { topicField: 'different-name' });

    const { errors } = listTopics(root);
    expect(errors[0].slug).toBe('dir-name');
    expect(errors[0].message).toContain('different-name');
  });

  it('reports an empty topic directory (no article.md) as an error naming the file', () => {
    const root = makeTmpRoot();
    fs.mkdirSync(path.join(root, 'topics', 'empty-topic'), { recursive: true });

    const { topics, errors } = listTopics(root);
    expect(topics).toEqual([]);
    expect(errors).toEqual([
      { slug: 'empty-topic', message: 'topics/empty-topic/article.md: missing article.md' },
    ]);
  });

  it('reports a YAML parse failure as an errors entry, never a bare throw', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'good-topic');
    writeFile(root, 'topics/yaml-broken/article.md', '---\ntopic: [unclosed\n---\n\nBody.\n');

    const { topics, errors } = listTopics(root);
    expect(topics.map((t) => t.topic)).toEqual(['good-topic']);
    expect(errors).toHaveLength(1);
    expect(errors[0].slug).toBe('yaml-broken');
    expect(errors[0].message).toContain('topics/yaml-broken/article.md');
    expect(errors[0].message).toContain('frontmatter failed to parse');
  });

  it('includes a symlinked topic directory in the sweep', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'real-topic');
    // Move the real directory outside topics/ and symlink it back in under a
    // slug matching its frontmatter — Dirent.isDirectory() is false for the link.
    const outside = path.join(root, 'elsewhere');
    fs.mkdirSync(outside, { recursive: true });
    fs.renameSync(path.join(root, 'topics', 'real-topic'), path.join(outside, 'real-topic'));
    fs.symlinkSync(path.join(outside, 'real-topic'), path.join(root, 'topics', 'real-topic'));

    const { topics, errors } = listTopics(root);
    expect(errors).toEqual([]);
    expect(topics.map((t) => t.topic)).toEqual(['real-topic']);
  });
});
