import fs from 'node:fs';
import path from 'node:path';
import fc from 'fast-check';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { describe, expect, it } from 'vitest';
import { buildRss } from './buildRss.js';
import { ContentValidationError } from './errors.js';
import type { SiteConfig } from './types.js';
import { makeTmpRoot, writeFile, writeTopicFixture } from './loaders/fixtures.testutil.js';

const CONFIG = {
  name: 'Stay Current',
  url: 'https://staycurrent.dev',
  description: 'A living article that states its version and last-researched date without being asked.',
  author: 'the operator',
};

describe('buildRss', () => {
  it('builds a valid RSS 2.0 document with the channel fields from config', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeFile(
      root,
      'topics/databases/changelog.md',
      '# Databases — Changelog\n\n## v1 — 2026-01-01\n\nFounding note.\n'
    );

    const xml = buildRss(root, CONFIG);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain('<title>Stay Current</title>');
    expect(xml).toContain('<link>https://staycurrent.dev</link>');
    expect(xml).toContain(
      '<description>A living article that states its version and last-researched date without being asked.</description>'
    );
  });

  it("renders one item per changelog entry, title '<Topic title> v<N>', newest first across topics", () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeFile(
      root,
      'topics/databases/changelog.md',
      '# Databases — Changelog\n\n' +
        '## v2 — 2026-06-12\n\nWhat moved.\n\n**Stance:** held — unchanged.\n\n' +
        '## v1 — 2026-01-01\n\nFounding note.\n'
    );
    writeTopicFixture(root, 'testing', { title: 'Testing' });
    writeFile(root, 'topics/testing/changelog.md', '# Testing — Changelog\n\n## v1 — 2026-03-01\n\nFounding note.\n');

    const xml = buildRss(root, CONFIG);

    const titleOrder = ['Databases v2', 'Testing v1', 'Databases v1'];
    let cursor = 0;
    for (const title of titleOrder) {
      const index = xml.indexOf(`<title>${title}</title>`, cursor);
      expect(index).toBeGreaterThan(-1);
      cursor = index;
    }
  });

  it("sets link/guid to '<url>/<slug>/changelog/#v<N>', isPermaLink false, and description as bodyHtml verbatim via CDATA", () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeFile(
      root,
      'topics/databases/changelog.md',
      '# Databases — Changelog\n\n## v1 — 2026-01-01\n\nFounding note with **emphasis**.\n'
    );

    const xml = buildRss(root, CONFIG);

    expect(xml).toContain('<link>https://staycurrent.dev/databases/changelog/#v1</link>');
    expect(xml).toContain('<guid isPermaLink="false">https://staycurrent.dev/databases/changelog/#v1</guid>');
    expect(xml).toContain('<description><![CDATA[<p>Founding note with <strong>emphasis</strong>.</p>');
  });

  it('formats pubDate as RFC-822 UTC midnight, deterministic regardless of local timezone', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeFile(root, 'topics/databases/changelog.md', '# Databases — Changelog\n\n## v1 — 2026-06-12\n\nNote.\n');

    const xml = buildRss(root, CONFIG);

    expect(xml).toContain('<pubDate>Fri, 12 Jun 2026 00:00:00 GMT</pubDate>');
  });

  it('sets <author> to config.author on every item', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeFile(
      root,
      'topics/databases/changelog.md',
      '# Databases — Changelog\n\n' +
        '## v2 — 2026-06-12\n\nNote.\n\n**Stance:** held — unchanged.\n\n' +
        '## v1 — 2026-01-01\n\nFounding note.\n'
    );

    const xml = buildRss(root, CONFIG);
    const authorCount = xml.split('<author>the operator</author>').length - 1;
    expect(authorCount).toBe(2);
  });

  it('caps the feed at the 50 most recent entries site-wide, dropping the oldest', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });

    // v60 (newest) down to v1 (oldest, the founding entry) — one calendar day
    // apart, oldest-to-newest matching version-ascending, so "newest 50" and
    // "highest-numbered 50" are the same 50 entries and the assertions below
    // aren't accidentally right for the wrong reason.
    const lines = ['# Databases — Changelog', ''];
    for (let v = 60; v >= 1; v--) {
      const date = new Date(Date.UTC(2026, 0, 1));
      date.setUTCDate(date.getUTCDate() + (v - 1));
      const iso = date.toISOString().slice(0, 10);
      lines.push(`## v${v} — ${iso}`, '');
      if (v === 1) {
        lines.push('Founding note.', '');
      } else {
        lines.push('Note.', '', '**Stance:** held — unchanged.', '');
      }
    }
    writeFile(root, 'topics/databases/changelog.md', lines.join('\n'));

    const xml = buildRss(root, CONFIG);
    const itemCount = xml.split('<item>').length - 1;
    expect(itemCount).toBe(50);
    // The 50 newest are v60..v11; v10..v1 (the oldest 10) must be dropped.
    expect(xml).toContain('<title>Databases v60</title>');
    expect(xml).toContain('<title>Databases v11</title>');
    expect(xml).not.toContain('<title>Databases v10</title>');
    expect(xml).not.toContain('<title>Databases v1</title>');
  });

  it('throws ContentValidationError when the listTopics sweep reports any invalid topic', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeFile(
      root,
      'topics/databases/changelog.md',
      '# Databases — Changelog\n\n## v1 — 2026-01-01\n\nFounding note.\n'
    );
    writeTopicFixture(root, 'broken', { cadence: 'weekly' });

    expect(() => buildRss(root, CONFIG)).toThrow(ContentValidationError);
    expect(() => buildRss(root, CONFIG)).toThrow(/broken/);
  });

  it('returns a well-formed, item-less channel for a validly-empty topics/ directory', () => {
    const root = makeTmpRoot();
    // No topics/ subdirectories written — a validly-empty catalogue (the
    // sweep's own designed "first run, zero topics" state), not an error.
    const xml = buildRss(root, CONFIG);
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).not.toContain('<item>');
  });

  // CONFIRMED defect (fixed above): a CDATA section ends at its first
  // literal `]]>`, wherever it falls in `bodyHtml`. A code span like
  // `a[b[i]]> 0` carries that exact sequence — unescaped, it would close the
  // section early and corrupt every byte after it while `pnpm build` still
  // exits 0. This proves the escape holds through the real renderMarkdown
  // pipeline (not a hand-built string): the feed parses clean AND the
  // description's character data — the two adjacent CDATA sections a
  // compliant parser concatenates — round-trips back to the exact bodyHtml
  // renderMarkdown produced, `]]>` included.
  it('escapes a ]]> sequence in bodyHtml so the feed stays well-formed XML and the body text round-trips', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeFile(
      root,
      'topics/databases/changelog.md',
      '# Databases — Changelog\n\n## v1 — 2026-01-01\n\nInline code: `a[b[i]]> 0` end.\n'
    );

    const xml = buildRss(root, CONFIG);

    expect(XMLValidator.validate(xml)).toBe(true);

    const parsed = new XMLParser().parse(xml) as {
      rss: { channel: { item: { description: string } } };
    };
    const description = parsed.rss.channel.item.description;
    expect(description).toContain(']]>');
    expect(description).toBe('<p>Inline code: <code>a[b[i]]> 0</code> end.</p>');
  });

  // Today, deleting every `escapeXml(...)` call in buildRss.ts survives the
  // suite above unnoticed — every fixture used only benign titles/config. A
  // hostile value carrying all five predefined-entity characters makes the
  // deletion visible two ways: the feed stops parsing as XML at all, and the
  // escaped form is simply absent from the output.
  it('escapes XML special characters in a hostile topic title and site config, keeping the feed well-formed', () => {
    const root = makeTmpRoot();
    const hostile = 'Q&A <db> "quoted"';
    writeTopicFixture(root, 'databases', { title: hostile });
    writeFile(
      root,
      'topics/databases/changelog.md',
      '# Databases — Changelog\n\n## v1 — 2026-01-01\n\nNote.\n'
    );

    const hostileConfig: SiteConfig = {
      name: hostile,
      url: 'https://example.com/a&b',
      description: hostile,
      author: hostile,
    };

    const xml = buildRss(root, hostileConfig);

    expect(XMLValidator.validate(xml)).toBe(true);

    const escaped = 'Q&amp;A &lt;db&gt; &quot;quoted&quot;';
    expect(xml).toContain(`<title>${escaped}</title>`); // channel title, config.name
    expect(xml).toContain(`<title>${escaped} v1</title>`); // item title, topic title
    expect(xml).toContain(`<description>${escaped}</description>`); // channel description
    expect(xml).toContain(`<author>${escaped}</author>`); // item author
    expect(xml).toContain('https://example.com/a&amp;b'); // config.url, in channel + item link/guid
  });

  // Documented but previously unasserted (a surviving-mutant site, mirroring
  // services/site/lib/content.ts's listSiteChangelog tie-break test): the
  // final `.sort` compares by date only, so two topics cutting on the same
  // day must keep the pre-sort slug-ascending order (`listTopics`' own
  // order, per `Array#sort`'s guaranteed stability) rather than an
  // unspecified tie order.
  it('keeps slug-ascending order for topics whose entries share the same date (sort stability)', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'testing', { title: 'Testing' });
    writeFile(
      root,
      'topics/testing/changelog.md',
      '# Testing — Changelog\n\n## v1 — 2026-06-12\n\nTesting founding note.\n'
    );
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeFile(
      root,
      'topics/databases/changelog.md',
      '# Databases — Changelog\n\n## v1 — 2026-06-12\n\nDatabases founding note.\n'
    );

    const xml = buildRss(root, CONFIG);

    const databasesIndex = xml.indexOf('<title>Databases v1</title>');
    const testingIndex = xml.indexOf('<title>Testing v1</title>');
    expect(databasesIndex).toBeGreaterThan(-1);
    expect(testingIndex).toBeGreaterThan(-1);
    expect(databasesIndex).toBeLessThan(testingIndex);
  });

  // Property: for ANY printable topic title, site config field, or changelog
  // body renderMarkdown can render, buildRss's output always parses as
  // well-formed XML. fc.string()'s default unit is the full printable ASCII
  // range (0x20-0x7E) — every predefined-entity character (& < > " ') and
  // every CDATA-hostile byte is in scope on every run, so this is the
  // suite's broadest guard against a future escaping regression in any single
  // field, not just the ones the fixed examples above happen to cover.
  //
  // The topic title is written into YAML frontmatter via JSON.stringify
  // (a double-quoted YAML flow scalar accepts the same escapes JSON does for
  // this character range) rather than the shared fixture helper's naked
  // interpolation, so an arbitrary generated title can never itself break
  // frontmatter parsing — the property under test is buildRss's XML
  // escaping, not the YAML loader's.
  it('produces well-formed XML for arbitrary printable titles, config fields, and changelog bodies', () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 25 }),
        fc.string({ maxLength: 25 }),
        fc.string({ maxLength: 25 }),
        fc.string({ maxLength: 25 }),
        fc.string({ maxLength: 25 }),
        (title, name, description, author, body) => {
          const safeTitle = title.trim() ? title : 'x';
          const safeBody = body.trim() ? body : 'x';

          const root = makeTmpRoot();
          const topicDir = path.join(root, 'topics', 'databases');
          fs.mkdirSync(topicDir, { recursive: true });
          fs.writeFileSync(
            path.join(topicDir, 'article.md'),
            '---\n' +
              'topic: databases\n' +
              `title: ${JSON.stringify(safeTitle)}\n` +
              'stance: "A committed one-sentence position for testing purposes."\n' +
              'version: 1\n' +
              'status: current\n' +
              'cadence: 90d\n' +
              'last_researched: 2026-01-15\n' +
              '---\n\n# Fixture\n\nBody.\n'
          );
          fs.writeFileSync(
            path.join(topicDir, 'changelog.md'),
            `# Databases — Changelog\n\n## v1 — 2026-01-01\n\n${safeBody}\n`
          );

          const fuzzConfig: SiteConfig = {
            name: name.trim() ? name : 'x',
            url: 'https://example.com',
            description: description.trim() ? description : 'x',
            author: author.trim() ? author : 'x',
          };

          const xml = buildRss(root, fuzzConfig);
          return XMLValidator.validate(xml) === true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
