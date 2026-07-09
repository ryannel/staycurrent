import { describe, expect, it } from 'vitest';
import { ContentNotFoundError, ContentValidationError } from '../errors.js';
import { loadVersion } from './loadVersion.js';
import { makeTmpRoot, writeFile } from './fixtures.testutil.js';

function writeValidVersion(root: string, slug: string, n: number): void {
  writeFile(
    root,
    `topics/${slug}/versions/v${n}/article.md`,
    `---\nversion: ${n}\ncut: 2026-06-12\n---\n\n# ${slug}\n\nFrozen body.\n`
  );
  writeFile(
    root,
    `topics/${slug}/versions/v${n}/provenance.md`,
    '## Sources\n\n- [Docs](https://example.com) — accessed 2026-06-01 — supports: claim\n\n## Synthesis\n'
  );
}

describe('loadVersion', () => {
  it('returns meta, rendered article, articleMd, skillDir, and provenance for a valid snapshot', () => {
    const root = makeTmpRoot();
    writeValidVersion(root, 'databases', 5);

    const version = loadVersion(root, 'databases', 5);

    expect(version.meta).toEqual({ version: 5, cut: '2026-06-12' });
    expect(version.article.html).toContain('Frozen body.');
    expect(version.articleMd).toContain('Frozen body.');
    expect(version.skillDir).toBe('topics/databases/versions/v5/skill');
    expect(version.provenance.sources).toHaveLength(1);
  });

  it('throws ContentNotFoundError only when versions/vN/ itself does not exist', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/article.md', '---\ntopic: databases\n---\n\nx\n');
    try {
      loadVersion(root, 'databases', 9);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentNotFoundError);
      expect((err as ContentNotFoundError).path).toBe('topics/databases/versions/v9');
    }
  });

  it('throws ContentValidationError — not NotFound — when article.md is missing inside an existing vN', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/versions/v5/provenance.md',
      '## Sources\n\n## Synthesis\n\n- claim\n'
    );

    try {
      loadVersion(root, 'databases', 5);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const e = err as ContentValidationError;
      expect(e.file).toBe('topics/databases/versions/v5/article.md');
      expect(e.issues).toEqual(['article.md is missing']);
    }
  });

  it('throws ContentValidationError — not NotFound — when provenance.md is missing inside an existing vN', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/versions/v5/article.md', '---\nversion: 5\ncut: 2026-06-12\n---\n\nBody.\n');

    try {
      loadVersion(root, 'databases', 5);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const e = err as ContentValidationError;
      expect(e.file).toBe('topics/databases/versions/v5/provenance.md');
      expect(e.file.endsWith('provenance.md')).toBe(true);
      expect(e.issues).toEqual(['provenance.md is missing']);
    }
  });

  it('throws ContentValidationError when the snapshot frontmatter carries a status field', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/versions/v5/article.md',
      '---\nversion: 5\ncut: 2026-06-12\nstatus: current\n---\n\nBody.\n'
    );
    writeFile(root, 'topics/databases/versions/v5/provenance.md', '## Sources\n\n## Synthesis\n\n- claim\n');

    try {
      loadVersion(root, 'databases', 5);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      expect((err as ContentValidationError).issues.some((i) => i.includes("field 'status'"))).toBe(true);
    }
  });

  it('throws ContentValidationError for any unknown frontmatter key — snapshot is exactly version + cut', () => {
    const root = makeTmpRoot();
    writeFile(
      root,
      'topics/databases/versions/v5/article.md',
      '---\nversion: 5\ncut: 2026-06-12\nextra: stray\n---\n\nBody.\n'
    );
    writeFile(root, 'topics/databases/versions/v5/provenance.md', '## Sources\n\n## Synthesis\n\n- claim\n');

    try {
      loadVersion(root, 'databases', 5);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      expect((err as ContentValidationError).issues.some((i) => i.includes("unexpected field 'extra'"))).toBe(
        true
      );
    }
  });

  it('throws ContentValidationError when the frontmatter version does not match the directory number', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/versions/v5/article.md', '---\nversion: 4\ncut: 2026-06-12\n---\n\nBody.\n');
    writeFile(root, 'topics/databases/versions/v5/provenance.md', '## Sources\n\n## Synthesis\n\n- claim\n');

    try {
      loadVersion(root, 'databases', 5);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const e = err as ContentValidationError;
      expect(e.issues[0]).toContain('version 4');
      expect(e.issues[0]).toContain("'v5'");
    }
  });

  it('throws ContentValidationError when provenance.md does not parse under the bullet grammar', () => {
    const root = makeTmpRoot();
    writeFile(root, 'topics/databases/versions/v5/article.md', '---\nversion: 5\ncut: 2026-06-12\n---\n\nBody.\n');
    writeFile(root, 'topics/databases/versions/v5/provenance.md', '## Sources\n\n- not a valid bullet shape\n');

    expect(() => loadVersion(root, 'databases', 5)).toThrow(ContentValidationError);
  });
});
