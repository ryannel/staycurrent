import { describe, expect, it } from 'vitest';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { loadChangelog } from './loadChangelog.js';
import { makeTmpRoot, writeFile } from './fixtures.testutil.js';

const HEADER = '# Databases — Changelog\n\n';

describe('loadChangelog', () => {
  it('parses newest-first entries, rendering bodyHtml and leaving the v1 founding entry\'s stance null', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/changelog.md',
      HEADER +
        '## v2 — 2026-06-12\n\nWhat moved: the pitch.\n\n**Stance:** bent — vector stores are now mainstream.\n\n' +
        '## v1 — 2026-01-01\n\nThe founding note.\n'
    );

    const entries = loadChangelog(root, 'databases');

    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({ version: 2, date: '2026-06-12', stance: 'bent' });
    expect(entries[0].bodyHtml).toContain('<p>');
    expect(entries[1]).toMatchObject({ version: 1, date: '2026-01-01', stance: null });

    // Body attribution: each entry's bodyMd holds its own section only.
    expect(entries[0].bodyMd).toContain('What moved: the pitch.');
    expect(entries[0].bodyMd).not.toContain('The founding note.');
    expect(entries[1].bodyMd).toContain('The founding note.');
    expect(entries[1].bodyMd).not.toContain('What moved: the pitch.');
  });

  it('namespaces each entry\'s generated heading ids with a v<N>- prefix so concatenated entries never collide', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/changelog.md',
      HEADER +
        '## v2 — 2026-06-12\n\n### Detail\n\nSecond cut.\n\n**Stance:** held — unchanged.\n\n' +
        '## v1 — 2026-01-01\n\n### Detail\n\nFounding note.\n'
    );

    const entries = loadChangelog(root, 'databases');

    expect(entries[0].bodyHtml).toContain('id="v2-detail"');
    expect(entries[1].bodyHtml).toContain('id="v1-detail"');
  });

  it('throws ContentNotFoundError when changelog.md is missing', () => {
    const root = makeTmpRoot();
    expect(() => loadChangelog(root, 'databases')).toThrow(ContentNotFoundError);
  });

  it('throws ContentValidationError when a heading does not match "## vN — YYYY-MM-DD"', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/changelog.md', HEADER + '## Version 2, June 2026\n\nBody.\n');
    expect(() => loadChangelog(root, 'databases')).toThrow(ContentValidationError);
  });

  it('throws ContentValidationError when entries are not strictly version-descending', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/changelog.md',
      HEADER +
        '## v3 — 2026-06-12\n\n**Stance:** held — still true.\n\n' +
        '## v1 — 2026-01-01\n\nFounding note.\n' // gap: v3 -> v1, skips v2
    );
    expect(() => loadChangelog(root, 'databases')).toThrow(ContentValidationError);
  });

  it('throws ContentValidationError when a non-v1 entry has no parseable Stance line', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/changelog.md',
      HEADER + '## v2 — 2026-06-12\n\nWhat moved without a stance line at all.\n\n## v1 — 2026-01-01\n\nFounding note.\n'
    );
    expect(() => loadChangelog(root, 'databases')).toThrow(ContentValidationError);
  });

  it('throws ContentValidationError when a Stance value is outside held | bent | reversed', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/changelog.md',
      HEADER + '## v2 — 2026-06-12\n\n**Stance:** maybe — unsure.\n\n## v1 — 2026-01-01\n\nFounding note.\n'
    );
    expect(() => loadChangelog(root, 'databases')).toThrow(ContentValidationError);
  });

  it('throws ContentValidationError when the v1 founding entry carries a Stance line', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/changelog.md',
      HEADER + '## v1 — 2026-01-01\n\n**Stance:** held — nothing to compare against yet.\n'
    );
    expect(() => loadChangelog(root, 'databases')).toThrow(ContentValidationError);
  });

  it('throws for a v1 Stance line with ANY value — detection is value-agnostic', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/changelog.md',
      HEADER + '## v1 — 2026-01-01\n\n**Stance:** maybe — not even a valid value.\n'
    );
    try {
      loadChangelog(root, 'databases');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      expect((err as ContentValidationError).issues[0]).toContain('founding entry');
    }
  });

  it('names the out-of-set value in the non-v1 stance error', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/changelog.md',
      HEADER + '## v2 — 2026-06-12\n\n**Stance:** wavered — sort of.\n\n## v1 — 2026-01-01\n\nFounding note.\n'
    );
    try {
      loadChangelog(root, 'databases');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      expect((err as ContentValidationError).issues[0]).toContain('outside held | bent | reversed');
    }
  });

  it('throws ContentValidationError for a v0 heading — versions are positive integers', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/changelog.md', HEADER + '## v0 — 2026-01-01\n\nBody.\n');
    expect(() => loadChangelog(root, 'databases')).toThrow(ContentValidationError);
  });

  it('throws ContentValidationError for a calendrically impossible heading date', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/changelog.md', HEADER + '## v1 — 2026-02-30\n\nFounding note.\n');
    try {
      loadChangelog(root, 'databases');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      expect((err as ContentValidationError).issues[0]).toContain('2026-02-30');
    }
  });
});
