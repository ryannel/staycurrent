import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { prependLogSection, replaceFrontmatterField, todayIso, writeMatterFile } from './write.js';
import { readMatterFile } from './loaders/shared.js';
import { makeTmpRoot } from './loaders/fixtures.testutil.js';

describe('replaceFrontmatterField', () => {
  const raw = ['---', 'topic: databases', 'status: current', 'version: 1', '---', '', '# Body', ''].join(
    '\n'
  );

  it('replaces only the target field line, leaving every other byte untouched', () => {
    const result = replaceFrontmatterField(raw, 'status', 'in-research');
    expect(result).toBe(raw.replace('status: current', 'status: in-research'));
  });

  it('never touches the body even when the body contains a line shaped like the field', () => {
    const withDecoy = raw + '\nstatus: current (decoy, in the body)\n';
    const result = replaceFrontmatterField(withDecoy, 'status', 'in-research');
    expect(result).toContain('status: current (decoy, in the body)');
    expect(result.split('\n')[2]).toBe('status: in-research');
  });

  it('throws when the file has no opening frontmatter delimiter', () => {
    expect(() => replaceFrontmatterField('# no frontmatter here', 'status', 'x')).toThrow();
  });

  it('throws when the field is not present in the frontmatter block', () => {
    expect(() => replaceFrontmatterField(raw, 'no_such_field', 'x')).toThrow();
  });

  it('handles a CRLF file — the read path (gray-matter) accepts it, so the stamp must too', () => {
    const crlfRaw = raw.split('\n').join('\r\n');

    const result = replaceFrontmatterField(crlfRaw, 'status', 'in-research');

    // The stamped line keeps its CR; every other byte survives untouched.
    expect(result).toBe(crlfRaw.replace('status: current\r\n', 'status: in-research\r\n'));
    expect(result.split('\n')[2]).toBe('status: in-research\r');
  });
});

describe('prependLogSection', () => {
  it('inserts a new section immediately after the H1 in an empty log', () => {
    const raw = '# Databases — Research Log\n\n';
    const result = prependLogSection(raw, '## 2026-07-09 — no-cut', ['Line one.', 'Line two.']);
    expect(result).toBe('# Databases — Research Log\n\n## 2026-07-09 — no-cut\n\nLine one.\nLine two.\n\n');
  });

  it('inserts the new section above an existing one — newest first', () => {
    const withOne = '# Databases — Research Log\n\n## 2026-06-01 — no-cut\n\nOlder line.\n\n';
    const result = prependLogSection(withOne, '## 2026-07-09 — no-cut', ['Newer line.']);
    const sections = result.split('\n## ');
    expect(sections[1]).toMatch(/^2026-07-09/);
    expect(sections[2]).toMatch(/^2026-06-01/);
  });

  it('tolerates a log whose first line is already a ## heading — inserts above, never reattributing the old body', () => {
    const headless = '## 2026-06-01 — no-cut\n\nOld line.\n';
    const result = prependLogSection(headless, '## 2026-07-09 — no-cut', ['New line.']);

    expect(result.startsWith('## 2026-07-09 — no-cut\n\nNew line.\n')).toBe(true);
    expect(result).toContain('## 2026-06-01 — no-cut\n\nOld line.\n');
    // The new body sits under the new heading, not appended to the old entry.
    expect(result.indexOf('New line.')).toBeLessThan(result.indexOf('## 2026-06-01'));
  });
});

describe('writeMatterFile', () => {
  it('round-trips through readMatterFile with CORE_SCHEMA — dates stay strings, values survive', () => {
    const root = makeTmpRoot();
    const filePath = path.join(root, 'article.md');

    writeMatterFile(
      filePath,
      {
        topic: 'databases',
        title: 'Databases: A Field Guide', // colon in value — exercises YAML quoting
        stance: 'Pick the store that matches the access pattern.',
        version: 1,
        status: 'current',
        cadence: '90d',
        last_researched: '2026-07-09',
      },
      '# Databases\n\nBody text.\n'
    );

    const parsed = readMatterFile(filePath, 'databases', 'article.md')!;
    expect(parsed.data.title).toBe('Databases: A Field Guide');
    expect(parsed.data.last_researched).toBe('2026-07-09'); // string, not Date-coerced
    expect(parsed.data.version).toBe(1);
    expect(parsed.content.trim()).toBe('# Databases\n\nBody text.'.trim());
  });
});

describe('todayIso', () => {
  it('returns a YYYY-MM-DD string', () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
