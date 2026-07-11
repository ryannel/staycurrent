import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ContentNotFoundError, ContentValidationError } from '@staycurrent/core';
import {
  getArchivedVersion,
  getSiteConfig,
  getTopic,
  getTopicChangelog,
  getTopicCutDate,
  getTopicSlugs,
  getTopicVersion,
  getVersionHistory,
  listSiteChangelog,
  listTopicCards,
  reserveMermaidSpace,
} from './content';

/**
 * `@staycurrent/core`'s own frontmatter-fixture helper
 * (core/src/loaders/fixtures.testutil.ts) is a `src`-only test util, not part
 * of the package's published `dist/` — this data layer's tests write the same
 * shape directly against a scratch root, mirroring core's own loadTopic/
 * listTopics test fixtures (04-data-design.md's frontmatter schema).
 */
const tmpRoots: string[] = [];

function makeTmpRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'staycurrent-site-content-test-'));
  tmpRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of tmpRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

interface FixtureOptions {
  topicField?: string;
  title?: string;
  stance?: string;
  // `null` omits the line entirely (fixture proves a topic that cannot state
  // it); `undefined` (the default) writes it with its normal default value.
  version?: number | null;
  status?: 'current' | 'in-research';
  cadence?: string;
  lastResearched?: string | null;
  bodyMd?: string;
}

function writeTopicFixture(root: string, slug: string, opts: FixtureOptions = {}): void {
  const topicDir = path.join(root, 'topics', slug);
  fs.mkdirSync(topicDir, { recursive: true });

  const lines = [
    '---',
    `topic: ${opts.topicField ?? slug}`,
    `title: ${opts.title ?? 'Fixture Topic'}`,
    `stance: "${opts.stance ?? 'A committed one-sentence position for testing purposes.'}"`,
  ];
  if (opts.version !== null) {
    lines.push(`version: ${opts.version ?? 1}`);
  }
  lines.push(`status: ${opts.status ?? 'current'}`, `cadence: ${opts.cadence ?? '90d'}`);
  if (opts.lastResearched !== null) {
    lines.push(`last_researched: ${opts.lastResearched ?? '2026-01-15'}`);
  }
  lines.push('---', '');
  const frontmatter = lines.join('\n');

  const body = opts.bodyMd ?? '# Fixture Topic\n\nStance restated.\n\n## Overview\n\nBody content.\n';
  fs.writeFileSync(path.join(topicDir, 'article.md'), frontmatter + body);
}

/** Shared by the changelog/history/archived-version describes below. */
function writeChangelogFixture(root: string, slug: string, markdown: string): void {
  const topicDir = path.join(root, 'topics', slug);
  fs.mkdirSync(topicDir, { recursive: true });
  fs.writeFileSync(path.join(topicDir, 'changelog.md'), markdown);
}

/** Shared by the getVersionHistory/getArchivedVersion describes below. */
function writeVersionSnapshotFixture(root: string, slug: string, n: number, cut: string): void {
  const versionDir = path.join(root, 'topics', slug, 'versions', `v${n}`);
  fs.mkdirSync(versionDir, { recursive: true });
  fs.writeFileSync(
    path.join(versionDir, 'article.md'),
    `---\nversion: ${n}\ncut: ${cut}\n---\n\n# Fixture Topic\n\nFrozen body.\n`
  );
  fs.writeFileSync(
    path.join(versionDir, 'provenance.md'),
    `## Sources\n\n- [Example Source](https://example.com/source) — accessed ${cut} — supports: the fixture claim.\n\n` +
      '## Synthesis\n\n- The fixture synthesis claim.\n'
  );
}

describe('getTopicSlugs', () => {
  it('returns every valid topic slug, sorted', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'testing', { title: 'Testing' });
    writeTopicFixture(root, 'databases', { title: 'Databases' });

    expect(getTopicSlugs(root)).toEqual(['databases', 'testing']);
  });

  // A mis-resolved root (e.g. STAYCURRENT_REPO_ROOT pointed at the wrong path)
  // must not ship a green empty export — getTopicSlugs distinguishes "no
  // topics/ at all" from "topics/ exists and is empty" (below).
  it('throws when the root has no topics/ directory at all', () => {
    const root = makeTmpRoot();

    let caught: unknown;
    try {
      getTopicSlugs(root);
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toContain(root);
    expect((caught as Error).message).toContain('topics/');
  });

  it('returns an empty array for a root with an existing but empty topics/ directory', () => {
    const root = makeTmpRoot();
    fs.mkdirSync(path.join(root, 'topics'), { recursive: true });
    expect(getTopicSlugs(root)).toEqual([]);
  });

  // "the site's build treats a non-empty `errors` from `listTopics` as
  // build-fatal" (03-api-design.md) — listTopics itself never throws for a
  // malformed topic (it collects `errors`); getTopicSlugs is the one place
  // that turns that report into the build-fatal throw generateStaticParams
  // relies on.
  it('throws when the listTopics sweep reports any invalid topic', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeTopicFixture(root, 'broken', { cadence: 'weekly' });

    expect(() => getTopicSlugs(root)).toThrow(/broken/);
    expect(() => getTopicSlugs(root)).toThrow(/cadence/);
  });
});

describe('listTopicCards', () => {
  it("returns each topic's card fields (title, stance, version, last_researched), sorted by slug", () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'testing', { title: 'Testing', stance: 'Test everything that can break.' });
    writeTopicFixture(root, 'databases', {
      title: 'Databases',
      stance: 'Relational is the default.',
      version: 3,
      lastResearched: '2026-06-12',
    });

    const cards = listTopicCards(root);

    expect(cards.map((c) => c.slug)).toEqual(['databases', 'testing']);
    const databases = cards.find((c) => c.slug === 'databases');
    expect(databases).toEqual({
      slug: 'databases',
      title: 'Databases',
      stance: 'Relational is the default.',
      version: 3,
      lastResearched: '2026-06-12',
    });
  });

  // The Topic Library's designed first-run empty state (01-ui-design.md)
  // renders for a validly-empty topics/ directory — never an error.
  it('returns an empty array for a root with an existing but empty topics/ directory', () => {
    const root = makeTmpRoot();
    fs.mkdirSync(path.join(root, 'topics'), { recursive: true });
    expect(listTopicCards(root)).toEqual([]);
  });

  // Mirrors getTopicSlugs: a mis-resolved root must not ship a green empty
  // library instead of failing the build.
  it('throws when the root has no topics/ directory at all', () => {
    const root = makeTmpRoot();
    expect(() => listTopicCards(root)).toThrow(/topics\//);
  });

  it('throws when the listTopics sweep reports any invalid topic', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeTopicFixture(root, 'broken', { cadence: 'weekly' });

    expect(() => listTopicCards(root)).toThrow(/broken/);
    expect(() => listTopicCards(root)).toThrow(/cadence/);
  });
});

describe('getTopic', () => {
  it('returns the frontmatter and rendered body for a valid topic', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', {
      title: 'Databases',
      version: 3,
      lastResearched: '2026-06-12',
      bodyMd: '# Databases\n\nStance restated.\n\n## Overview\n\nContent here.\n',
    });

    const topic = getTopic('databases', root);

    expect(topic.frontmatter.version).toBe(3);
    expect(topic.frontmatter.last_researched).toBe('2026-06-12');
    expect(topic.body.html).toContain('Content here.');
    expect(topic.body.toc.some((entry) => entry.text === 'Overview')).toBe(true);
  });

  // "currency is never guessed" (02-data-flows.md): a topic missing
  // version/last_researched, or otherwise failing schema validation, must
  // fail the build — proven here as real `loadTopic` throws propagating
  // uncaught through this data layer, not a scripted check standing in for it.
  it('propagates ContentValidationError when a topic cannot state its currency', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { cadence: 'not-a-cadence' });

    expect(() => getTopic('databases', root)).toThrow(ContentValidationError);

    let caught: unknown;
    try {
      getTopic('databases', root);
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ContentValidationError);
    expect((caught as ContentValidationError).issues.some((i) => i.includes("field 'cadence'"))).toBe(
      true
    );
  });

  // "currency is never guessed" also covers omitting the fields outright, not
  // just an invalid value for one of them (the case above) — both named in
  // the same ContentValidationError#issues report.
  it('propagates ContentValidationError naming both version and last_researched when a topic omits both', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { version: null, lastResearched: null });

    let caught: unknown;
    try {
      getTopic('databases', root);
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ContentValidationError);
    const issues = (caught as ContentValidationError).issues;
    expect(issues.some((i) => i.includes("field 'version'"))).toBe(true);
    expect(issues.some((i) => i.includes("field 'last_researched'"))).toBe(true);
  });

  it('propagates ContentNotFoundError for an unknown slug', () => {
    const root = makeTmpRoot();
    expect(() => getTopic('nope', root)).toThrow(ContentNotFoundError);
  });

  it('reserves layout space on every mermaid-figure container in the rendered body', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', {
      bodyMd:
        '# Databases\n\nStance restated.\n\n## Diagram\n\n```mermaid\ngraph TD\n  A --> B\n```\n',
    });

    const topic = getTopic('databases', root);
    expect(topic.body.html).toContain('class="mermaid-figure" style="min-height: 320px"');
  });
});

describe('getTopicCutDate', () => {
  function writeVersionFixture(root: string, slug: string, n: number, cut: string): void {
    const versionDir = path.join(root, 'topics', slug, 'versions', `v${n}`);
    fs.mkdirSync(versionDir, { recursive: true });
    fs.writeFileSync(
      path.join(versionDir, 'article.md'),
      `---\nversion: ${n}\ncut: ${cut}\n---\n\n# Fixture Topic\n\nStance restated.\n`
    );
    fs.writeFileSync(path.join(versionDir, 'provenance.md'), '## Sources\n\n## Synthesis\n\n- noted\n');
  }

  it("returns the versions/vN snapshot's cut date for the live version", () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { version: 1, lastResearched: '2026-07-09' });
    writeVersionFixture(root, 'databases', 1, '2026-07-01');

    expect(getTopicCutDate('databases', 1, root)).toBe('2026-07-01');
  });

  // The whole point of keying freshness on this instead of `last_researched`:
  // a no-cut research run updates the latter without touching the version
  // snapshot, so the two dates diverge and this function must keep reporting
  // the unchanged cut, not the newer research date.
  it('diverges from last_researched after a no-cut research run', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { version: 1, lastResearched: '2026-07-09' });
    writeVersionFixture(root, 'databases', 1, '2026-06-01');

    const topic = getTopic('databases', root);
    const cutDate = getTopicCutDate('databases', topic.frontmatter.version, root);

    expect(topic.frontmatter.last_researched).toBe('2026-07-09');
    expect(cutDate).toBe('2026-06-01');
    expect(cutDate).not.toBe(topic.frontmatter.last_researched);
  });

  it('propagates ContentNotFoundError when the live version has no versions/vN snapshot', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { version: 1 });

    expect(() => getTopicCutDate('databases', 1, root)).toThrow(ContentNotFoundError);
  });
});

describe('getTopicVersion', () => {
  function writeVersionFixture(root: string, slug: string, n: number, cut: string): void {
    const versionDir = path.join(root, 'topics', slug, 'versions', `v${n}`);
    fs.mkdirSync(versionDir, { recursive: true });
    fs.writeFileSync(
      path.join(versionDir, 'article.md'),
      `---\nversion: ${n}\ncut: ${cut}\n---\n\n# Fixture Topic\n\nStance restated.\n`
    );
    fs.writeFileSync(
      path.join(versionDir, 'provenance.md'),
      '## Sources\n\n' +
        '- [Example Source](https://example.com/source) — accessed 2026-07-01 — supports: the fixture claim.\n\n' +
        '## Synthesis\n\n' +
        '- The fixture synthesis claim.\n'
    );
  }

  // `/[topic]/` needs both the cut date (freshness) and the provenance record
  // (the essay-close Provenance section) for the SAME live version — this is
  // the one accessor that supplies both off a single `loadVersion` call
  // (lib/content.ts's doc comment); `getTopicCutDate` above proves the date
  // half already, so this proves the shape carries the parsed provenance too.
  it('returns both the cut date and the parsed provenance record for the live version', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { version: 1, lastResearched: '2026-07-09' });
    writeVersionFixture(root, 'databases', 1, '2026-07-01');

    const version = getTopicVersion('databases', 1, root);

    expect(version.cutDate).toBe('2026-07-01');
    expect(version.provenance.sources).toEqual([
      {
        title: 'Example Source',
        url: 'https://example.com/source',
        accessed: '2026-07-01',
        supports: 'the fixture claim.',
      },
    ]);
    expect(version.provenance.synthesis).toEqual(['The fixture synthesis claim.']);
  });

  it('propagates ContentNotFoundError when the live version has no versions/vN snapshot', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { version: 1 });

    expect(() => getTopicVersion('databases', 1, root)).toThrow(ContentNotFoundError);
  });
});

describe('getTopicChangelog', () => {
  it('returns newest-first entries with mermaid space reserved in bodyHtml', () => {
    const root = makeTmpRoot();
    writeChangelogFixture(
      root,
      'databases',
      '# Databases — Changelog\n\n' +
        '## v2 — 2026-06-12\n\n```mermaid\ngraph TD\n  A --> B\n```\n\n**Stance:** held — unchanged.\n\n' +
        '## v1 — 2026-01-01\n\nFounding note.\n'
    );

    const entries = getTopicChangelog('databases', root);

    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({ version: 2, stance: 'held' });
    expect(entries[0].bodyHtml).toContain('class="mermaid-figure" style="min-height: 320px"');
    expect(entries[1]).toMatchObject({ version: 1, stance: null });
  });

  it('propagates ContentNotFoundError when changelog.md is missing', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases');

    expect(() => getTopicChangelog('databases', root)).toThrow(ContentNotFoundError);
  });

  it('propagates ContentValidationError for a malformed entry heading', () => {
    const root = makeTmpRoot();
    writeChangelogFixture(root, 'databases', '# Databases — Changelog\n\n## Not a version heading\n\nBody.\n');

    expect(() => getTopicChangelog('databases', root)).toThrow(ContentValidationError);
  });

  // The core parser's Stance value regex accepts `held | bent | reversed` —
  // only `held`/`bent` had a passing test through this data layer's own
  // parser call before this; `reversed` is exercised here too.
  it("parses a 'reversed' stance-disposition entry through the real core parser", () => {
    const root = makeTmpRoot();
    writeChangelogFixture(
      root,
      'databases',
      '# Databases — Changelog\n\n' +
        '## v2 — 2026-06-12\n\n**Stance:** reversed — the pitch flipped entirely.\n\n' +
        '## v1 — 2026-01-01\n\nFounding note.\n'
    );

    const entries = getTopicChangelog('databases', root);

    expect(entries[0]).toMatchObject({ version: 2, stance: 'reversed' });
  });
});

describe('getVersionHistory', () => {
  it('returns newest-first rows carrying each version\'s cut date (loadVersion) and stance (the changelog entry)', () => {
    const root = makeTmpRoot();
    writeChangelogFixture(
      root,
      'databases',
      '# Databases — Changelog\n\n' +
        '## v2 — 2026-06-12\n\n**Stance:** bent — vector stores are now mainstream.\n\n' +
        '## v1 — 2026-01-01\n\nFounding note.\n'
    );
    writeVersionSnapshotFixture(root, 'databases', 1, '2026-01-01');
    writeVersionSnapshotFixture(root, 'databases', 2, '2026-06-12');

    expect(getVersionHistory('databases', 2, root)).toEqual([
      { version: 2, cutDate: '2026-06-12', stance: 'bent' },
      { version: 1, cutDate: '2026-01-01', stance: null },
    ]);
  });

  it('propagates ContentNotFoundError when a version in range has no versions/vN snapshot', () => {
    const root = makeTmpRoot();
    writeChangelogFixture(
      root,
      'databases',
      '# Databases — Changelog\n\n## v1 — 2026-01-01\n\nFounding note.\n'
    );
    writeVersionSnapshotFixture(root, 'databases', 1, '2026-01-01');
    // versions/v2/ deliberately absent even though currentVersion claims 2.

    expect(() => getVersionHistory('databases', 2, root)).toThrow(ContentNotFoundError);
  });
});

describe('getArchivedVersion', () => {
  it('returns the frozen article (mermaid space reserved) and provenance for a past snapshot', () => {
    const root = makeTmpRoot();
    const versionDir = path.join(root, 'topics', 'databases', 'versions', 'v1');
    fs.mkdirSync(versionDir, { recursive: true });
    fs.writeFileSync(
      path.join(versionDir, 'article.md'),
      '---\nversion: 1\ncut: 2026-01-01\n---\n\n# Databases\n\n```mermaid\ngraph TD\n  A --> B\n```\n'
    );
    fs.writeFileSync(
      path.join(versionDir, 'provenance.md'),
      '## Sources\n\n- [Docs](https://example.com) — accessed 2026-01-01 — supports: claim\n\n## Synthesis\n\n- A claim.\n'
    );

    const archived = getArchivedVersion('databases', 1, root);

    expect(archived.version).toBe(1);
    expect(archived.cutDate).toBe('2026-01-01');
    expect(archived.article.html).toContain('class="mermaid-figure" style="min-height: 320px"');
    expect(archived.provenance.sources).toHaveLength(1);
  });

  it('propagates ContentNotFoundError only when versions/vN/ itself does not exist', () => {
    const root = makeTmpRoot();
    expect(() => getArchivedVersion('databases', 9, root)).toThrow(ContentNotFoundError);
  });
});

describe('listSiteChangelog', () => {
  it("flattens every topic's entries, newest-first, labelled with topic slug and title", () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'testing', { title: 'Testing' });
    writeChangelogFixture(
      root,
      'testing',
      '# Testing — Changelog\n\n## v1 — 2026-05-01\n\nTesting founding note.\n'
    );
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeChangelogFixture(
      root,
      'databases',
      '# Databases — Changelog\n\n## v1 — 2026-06-12\n\nDatabases founding note.\n'
    );

    const entries = listSiteChangelog(root);

    expect(entries.map((e) => e.topicSlug)).toEqual(['databases', 'testing']);
    expect(entries[0]).toMatchObject({
      topicSlug: 'databases',
      topicTitle: 'Databases',
      version: 1,
      date: '2026-06-12',
    });
    expect(entries[0].bodyHtml).toContain('Databases founding note.');
  });

  it('throws when the listTopics sweep reports any invalid topic', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeChangelogFixture(root, 'databases', '# Databases — Changelog\n\n## v1 — 2026-06-12\n\nFounding note.\n');
    writeTopicFixture(root, 'broken', { cadence: 'weekly' });

    expect(() => listSiteChangelog(root)).toThrow(/broken/);
  });

  it('throws when the root has no topics/ directory at all', () => {
    const root = makeTmpRoot();
    expect(() => listSiteChangelog(root)).toThrow(/topics\//);
  });

  // Documented but previously unasserted (a surviving-mutant site): the
  // final `.sort` compares by date only, so two topics cutting on the same
  // day must keep the pre-sort slug-ascending order (`listTopics`' own
  // order, per `Array#sort`'s guaranteed stability) rather than an
  // unspecified tie order.
  it('keeps slug-ascending order for topics whose entries share the same date (sort stability)', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'testing', { title: 'Testing' });
    writeChangelogFixture(
      root,
      'testing',
      '# Testing — Changelog\n\n## v1 — 2026-06-12\n\nTesting founding note.\n'
    );
    writeTopicFixture(root, 'databases', { title: 'Databases' });
    writeChangelogFixture(
      root,
      'databases',
      '# Databases — Changelog\n\n## v1 — 2026-06-12\n\nDatabases founding note.\n'
    );

    const entries = listSiteChangelog(root);

    expect(entries.map((e) => e.topicSlug)).toEqual(['databases', 'testing']);
  });
});

describe('getSiteConfig', () => {
  it('reads name/url/description/author from site.config.json at the repo root', () => {
    const root = makeTmpRoot();
    fs.writeFileSync(
      path.join(root, 'site.config.json'),
      JSON.stringify({
        name: 'Fixture Site',
        url: 'https://fixture.example',
        description: 'A fixture description.',
        author: 'fixture author',
      })
    );

    expect(getSiteConfig(root)).toEqual({
      name: 'Fixture Site',
      url: 'https://fixture.example',
      description: 'A fixture description.',
      author: 'fixture author',
    });
  });

  // Fail-closed (RC1: "no instance value is hardcoded in services/site") —
  // every repo root a build runs against, real or fixture, must stage its
  // own site.config.json now that there is no default to degrade to.
  it('throws when site.config.json is absent', () => {
    const root = makeTmpRoot();
    expect(() => getSiteConfig(root)).toThrow(/site\.config\.json/);
  });

  it('throws when site.config.json exists but is missing a required field', () => {
    const root = makeTmpRoot();
    fs.writeFileSync(path.join(root, 'site.config.json'), JSON.stringify({ name: 'Fixture Site' }));

    expect(() => getSiteConfig(root)).toThrow(/site\.config\.json/);
  });
});

describe('reserveMermaidSpace', () => {
  it('injects an explicit min-height style onto a mermaid-figure container', () => {
    const html = '<div class="mermaid-figure" data-mermaid="graph TD">…</div>';
    expect(reserveMermaidSpace(html)).toBe(
      '<div class="mermaid-figure" style="min-height: 320px" data-mermaid="graph TD">…</div>'
    );
  });

  it('reserves space on every occurrence when a body has multiple diagrams', () => {
    const html =
      '<div class="mermaid-figure" data-mermaid="a">x</div>' +
      '<p>between</p>' +
      '<div class="mermaid-figure" data-mermaid="b">y</div>';
    const out = reserveMermaidSpace(html);
    expect(out.match(/style="min-height: 320px"/g)).toHaveLength(2);
  });

  it('leaves html with no mermaid container unchanged', () => {
    const html = '<p>No diagrams here.</p>';
    expect(reserveMermaidSpace(html)).toBe(html);
  });

  // The anchor is the full open-tag prefix, not the class attribute alone
  // (content.ts) — article prose that merely quotes the class literal, with
  // no real element open tag around it, must not be touched.
  it('leaves article text containing the bare class="mermaid-figure" literal (no full open-tag prefix) unchanged', () => {
    const html = '<p>Use class="mermaid-figure" in your markup.</p>';
    expect(reserveMermaidSpace(html)).toBe(html);
  });
});
