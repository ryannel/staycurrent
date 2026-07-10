import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ContentNotFoundError, ContentValidationError } from '@staycurrent/core';
import { getTopic, getTopicCutDate, getTopicSlugs, listTopicCards, reserveMermaidSpace } from './content';

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
