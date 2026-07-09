import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { convene } from './convene.js';
import { writeCompleteTopic } from '../cut/topicFixtures.testutil.js';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { makeTmpRoot, writeTopicFixture } from '../loaders/fixtures.testutil.js';

describe('convene', () => {
  it('stamps the live article in-research and seeds the staged tree in one call', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases', { version: 2, n: 2 });

    const result = convene(root, 'databases');

    expect(result.topic).toBe('databases');
    expect(result.againstVersion).toBe(2);
    expect(result.stagedDir).toBe(path.join(root, '.staycurrent', 'staged', 'databases'));

    const liveRaw = fs.readFileSync(path.join(root, 'topics', 'databases', 'article.md'), 'utf8');
    expect(liveRaw).toMatch(/^status: in-research$/m);

    expect(fs.existsSync(path.join(result.stagedDir, 'article.md'))).toBe(true);
  });

  it('seeds before stamping — the staged baseline always reads status: current', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases');

    const result = convene(root, 'databases');

    // change-proposal-1: the tree that may later land as published truth never
    // carries the in-research stamp.
    const stagedRaw = fs.readFileSync(path.join(result.stagedDir, 'article.md'), 'utf8');
    expect(stagedRaw).toMatch(/^status: current$/m);
    expect(stagedRaw).not.toMatch(/in-research/);
  });

  it('touches only the status line — every other frontmatter field and the body survive byte-for-byte', () => {
    const root = makeTmpRoot();
    writeCompleteTopic(root, 'databases');
    const before = fs.readFileSync(path.join(root, 'topics', 'databases', 'article.md'), 'utf8');

    convene(root, 'databases');

    const after = fs.readFileSync(path.join(root, 'topics', 'databases', 'article.md'), 'utf8');
    expect(after).toBe(before.replace(/^status: current$/m, 'status: in-research'));
  });

  it('throws ContentValidationError when status is already in-research', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'in-flight', { status: 'in-research' });

    expect(() => convene(root, 'in-flight')).toThrow(ContentValidationError);
  });

  it('throws ContentNotFoundError when the topic does not exist', () => {
    const root = makeTmpRoot();
    expect(() => convene(root, 'no-such-topic')).toThrow(ContentNotFoundError);
  });
});
