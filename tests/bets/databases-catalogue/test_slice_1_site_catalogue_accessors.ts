// Slice 1.2 (site: catalogue accessors and freshness rollup) — bet-progress
// test. Traces to the `getCatalogues`, `getReadingPosition`, and
// `summarizeCatalogueFreshness` contracts in
// docs/bets/databases-catalogue/technical-design/03-api-design.md and flows
// (a), (b), (c) in 02-data-flows.md. Proves the slice's Required
// Capabilities: grouping, position, and freshness are derived correctly and
// totally from live frontmatter — including the catalogue-of-one and
// hub-less interim states Milestone 2 actually ships through.
//
// Unit-tests the three accessors directly against a scratch content tree,
// mirroring services/site/lib/content.test.ts's own fixture idiom (this
// bet's only surface is an embedded core with no HTTP boundary —
// 03-api-design.md's header note).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getCatalogues, getReadingPosition } from '../../../services/site/lib/content';
import { summarizeCatalogueFreshness } from '../../../services/site/lib/freshness';
import type { TopicFrontmatter } from '../../../core/src/types';

const tmpRoots: string[] = [];

function makeTmpRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'staycurrent-catalogue-accessors-test-'));
  tmpRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of tmpRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

interface FixtureOptions {
  title?: string;
  stance?: string;
  version?: number;
  lastResearched?: string;
  area?: string;
  register?: 'foundation' | 'profile' | 'hub';
  movement?: string;
  readingOrder?: number;
  prereqs?: string[];
  core?: boolean;
}

/**
 * Writes one `topics/<slug>/article.md` fixture carrying the seven required
 * frontmatter fields plus whichever additive display fields (04-data-design.md)
 * the case under test needs — mirroring content.test.ts's own
 * `writeTopicFixture`, extended with the databases-catalogue bet's additive
 * keys this slice's accessors read.
 */
function writeTopicFixture(root: string, slug: string, opts: FixtureOptions = {}): void {
  const topicDir = path.join(root, 'topics', slug);
  fs.mkdirSync(topicDir, { recursive: true });

  const lines = [
    '---',
    `topic: ${slug}`,
    `title: ${opts.title ?? 'Fixture Topic'}`,
    `stance: "${opts.stance ?? 'A committed one-sentence position for testing purposes.'}"`,
    `version: ${opts.version ?? 1}`,
    'status: current',
    'cadence: 90d',
    `last_researched: ${opts.lastResearched ?? '2026-01-15'}`,
  ];
  if (opts.area !== undefined) lines.push(`area: ${opts.area}`);
  if (opts.register !== undefined) lines.push(`register: ${opts.register}`);
  if (opts.movement !== undefined) lines.push(`movement: ${opts.movement}`);
  if (opts.readingOrder !== undefined) lines.push(`reading_order: ${opts.readingOrder}`);
  if (opts.prereqs !== undefined) {
    lines.push(`prereqs: [${opts.prereqs.map((p) => `"${p}"`).join(', ')}]`);
  }
  if (opts.core !== undefined) lines.push(`core: ${opts.core}`);
  lines.push('---', '');

  fs.writeFileSync(
    path.join(topicDir, 'article.md'),
    lines.join('\n') + '# Fixture Topic\n\nStance restated.\n'
  );
}

const BASE_FRONTMATTER: TopicFrontmatter = {
  topic: 'placeholder',
  title: 'Placeholder',
  stance: 'A committed one-sentence position for testing purposes.',
  version: 1,
  status: 'current',
  cadence: '90d',
  last_researched: '2026-01-15',
};

describe('getCatalogues', () => {
  it('returns [] when no topic in the tree carries an area at all', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'testing', {});

    expect(getCatalogues(root)).toEqual([]);
  });

  it('groups a hub-only area — no movements, no profiles, no ungrouped', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });

    const catalogues = getCatalogues(root);
    expect(catalogues).toHaveLength(1);
    expect(catalogues[0].area).toBe('databases');
    expect(catalogues[0].hub).toMatchObject({ slug: 'databases', title: 'Fixture Topic', register: 'hub' });
    expect(catalogues[0].hub).not.toHaveProperty('movement');
    expect(catalogues[0].hub).not.toHaveProperty('readingOrder');
    expect(catalogues[0].hub).not.toHaveProperty('core');
    expect(catalogues[0].movements).toEqual([]);
    expect(catalogues[0].profiles).toEqual([]);
    expect(catalogues[0].ungrouped).toEqual([]);
  });

  // The pilot state Milestone 2 actually ships through: one hub, one
  // foundation in its own movement.
  it('places a hub plus one foundation into a single one-entry movement', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'single-node', {
      area: 'databases',
      register: 'foundation',
      movement: 'Single Node',
      readingOrder: 1,
    });

    const catalogue = getCatalogues(root)[0];
    expect(catalogue.hub?.slug).toBe('databases');
    expect(catalogue.movements).toEqual([
      {
        name: 'Single Node',
        entries: [
          expect.objectContaining({ slug: 'single-node', register: 'foundation', readingOrder: 1 }),
        ],
      },
    ]);
    expect(catalogue.movements[0].entries[0]).not.toHaveProperty('core');
  });

  it('resolves a duplicate hub claim by slug-alphabetical first-wins; the rest land in ungrouped', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'zeta-hub', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'alpha-hub', { area: 'databases', register: 'hub' });

    const catalogue = getCatalogues(root)[0];
    expect(catalogue.hub?.slug).toBe('alpha-hub');
    expect(catalogue.ungrouped.map((e) => e.slug)).toEqual(['zeta-hub']);
  });

  it('routes a foundation missing movement to ungrouped — off the reading path, never silently dropped', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'orphan-foundation', {
      area: 'databases',
      register: 'foundation',
      readingOrder: 1,
      // movement intentionally omitted — an unannotated foundation.
    });

    const catalogue = getCatalogues(root)[0];
    expect(catalogue.movements).toEqual([]);
    expect(catalogue.ungrouped.map((e) => e.slug)).toEqual(['orphan-foundation']);
    expect(getReadingPosition({ ...BASE_FRONTMATTER, topic: 'orphan-foundation', area: 'databases', register: 'foundation', reading_order: 1 }, root)).toBeNull();
  });

  // Register missing entirely (not just an unrecognized value) is the other
  // ungrouped case 02-data-flows.md's routing table names.
  it('routes a topic with area set but no register at all to ungrouped', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'unregistered', { area: 'databases' });

    const catalogue = getCatalogues(root)[0];
    expect(catalogue.ungrouped.map((e) => e.slug)).toEqual(['unregistered']);
    expect(catalogue.ungrouped[0]).not.toHaveProperty('register');
  });

  it('orders movements by the lowest readingOrder any of their members carries — a property of the data, never authored', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'distributed-a', {
      area: 'databases',
      register: 'foundation',
      movement: 'Distributed',
      readingOrder: 10,
    });
    writeTopicFixture(root, 'single-node-b', {
      area: 'databases',
      register: 'foundation',
      movement: 'Single Node',
      readingOrder: 2,
    });
    writeTopicFixture(root, 'single-node-a', {
      area: 'databases',
      register: 'foundation',
      movement: 'Single Node',
      readingOrder: 1,
    });

    const catalogue = getCatalogues(root)[0];
    // "Distributed"'s lowest member is 10; "Single Node"'s lowest is 1 — it
    // must sort first even though "Distributed" alphabetically precedes it.
    expect(catalogue.movements.map((m) => m.name)).toEqual(['Single Node', 'Distributed']);
    // Within "Single Node", entries order by their own readingOrder ascending.
    expect(catalogue.movements[0].entries.map((e) => e.slug)).toEqual(['single-node-a', 'single-node-b']);
  });

  it('orders profiles by readingOrder ascending', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'profile-b', { area: 'databases', register: 'profile', readingOrder: 2, core: false });
    writeTopicFixture(root, 'profile-a', { area: 'databases', register: 'profile', readingOrder: 1, core: true });

    const catalogue = getCatalogues(root)[0];
    expect(catalogue.profiles.map((e) => e.slug)).toEqual(['profile-a', 'profile-b']);
    expect(catalogue.profiles[0].core).toBe(true);
    expect(catalogue.profiles[0]).not.toHaveProperty('movement');
  });

  it('returns one Catalogue per distinct area, sorted by area ascending', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'testing-hub', { area: 'testing', register: 'hub' });
    writeTopicFixture(root, 'databases-hub', { area: 'databases', register: 'hub' });

    expect(getCatalogues(root).map((c) => c.area)).toEqual(['databases', 'testing']);
  });

  it('fails closed on a malformed sweep, exactly as sweepOrThrow does today', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    // A directly-written malformed article.md — invalid cadence — reproduces
    // sweepOrThrow's existing fail-closed path without duplicating it.
    const brokenDir = path.join(root, 'topics', 'broken');
    fs.mkdirSync(brokenDir, { recursive: true });
    fs.writeFileSync(
      path.join(brokenDir, 'article.md'),
      '---\ntopic: broken\ntitle: Broken\nstance: "x"\nversion: 1\nstatus: current\ncadence: weekly\nlast_researched: 2026-01-15\n---\n\nBody.\n'
    );

    expect(() => getCatalogues(root)).toThrow(/broken/);
    expect(() => getCatalogues(root)).toThrow(/cadence/);
  });
});

describe('getReadingPosition', () => {
  it('is "1 of 1" with a null next for the pilot state — one hub, one foundation', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'single-node', {
      area: 'databases',
      register: 'foundation',
      movement: 'Single Node',
      readingOrder: 1,
    });

    const position = getReadingPosition(
      { ...BASE_FRONTMATTER, topic: 'single-node', area: 'databases', register: 'foundation', reading_order: 1 },
      root
    );

    expect(position).not.toBeNull();
    expect(position?.movement).toBe('Single Node');
    expect(position?.indexInPath).toBe(1);
    expect(position?.totalInPath).toBe(1);
    expect(position?.indexInMovement).toBe(1);
    expect(position?.totalInMovement).toBe(1);
    expect(position?.prereqs).toEqual([]);
    // Continue-to-hub case: null next means the caller falls back to a hub link.
    expect(position?.next).toBeNull();
  });

  it('derives indexInPath/totalInPath across movements and indexInMovement/totalInMovement within just one movement', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'single-node-a', {
      area: 'databases',
      register: 'foundation',
      movement: 'Single Node',
      readingOrder: 1,
    });
    writeTopicFixture(root, 'single-node-b', {
      area: 'databases',
      register: 'foundation',
      movement: 'Single Node',
      readingOrder: 2,
    });
    writeTopicFixture(root, 'distributed-a', {
      area: 'databases',
      register: 'foundation',
      movement: 'Distributed',
      readingOrder: 3,
      prereqs: ['single-node-b', 'not-yet-cut'],
    });

    const position = getReadingPosition(
      {
        ...BASE_FRONTMATTER,
        topic: 'distributed-a',
        area: 'databases',
        register: 'foundation',
        reading_order: 3,
        prereqs: ['single-node-b', 'not-yet-cut'],
      },
      root
    );

    expect(position?.indexInPath).toBe(3);
    expect(position?.totalInPath).toBe(3);
    expect(position?.indexInMovement).toBe(1);
    expect(position?.totalInMovement).toBe(1);
    expect(position?.next).toBeNull();
    // A resolved prereq gets its real title; an as-yet-uncut slug falls back
    // to a humanized form of the slug rather than a raw slug or blank text.
    expect(position?.prereqs).toEqual([
      { slug: 'single-node-b', title: 'Fixture Topic' },
      { slug: 'not-yet-cut', title: 'Not Yet Cut' },
    ]);
  });

  // A blank/whitespace-only prereqs entry passes core's extractPrereqs
  // (every element just needs to be a string) and would otherwise resolve to
  // a blank-text link with an empty href — the design (02-data-flows.md,
  // flow b, step 3) requires the rail "never shows a raw slug or blank
  // text". A prereq naming nothing links to nothing, so it is dropped.
  it('drops blank/whitespace-only prereqs entries rather than rendering a blank-text link', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'single-node', {
      area: 'databases',
      register: 'foundation',
      movement: 'Single Node',
      readingOrder: 1,
    });

    const allBlank = getReadingPosition(
      {
        ...BASE_FRONTMATTER,
        topic: 'single-node',
        area: 'databases',
        register: 'foundation',
        reading_order: 1,
        prereqs: ['', '  '],
      },
      root
    );
    expect(allBlank?.prereqs).toEqual([]);

    const mixed = getReadingPosition(
      {
        ...BASE_FRONTMATTER,
        topic: 'single-node',
        area: 'databases',
        register: 'foundation',
        reading_order: 1,
        prereqs: ['storage-engines', ''],
      },
      root
    );
    expect(mixed?.prereqs).toEqual([{ slug: 'storage-engines', title: 'Storage Engines' }]);
  });

  it('derives next from the live sweep — the following path member, never a free-text field', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'single-node-a', {
      area: 'databases',
      register: 'foundation',
      movement: 'Single Node',
      readingOrder: 1,
      title: 'Single Node A',
    });
    writeTopicFixture(root, 'single-node-b', {
      area: 'databases',
      register: 'foundation',
      movement: 'Single Node',
      readingOrder: 2,
      title: 'Single Node B',
    });

    const position = getReadingPosition(
      {
        ...BASE_FRONTMATTER,
        topic: 'single-node-a',
        area: 'databases',
        register: 'foundation',
        reading_order: 1,
      },
      root
    );

    expect(position?.next).toEqual({ slug: 'single-node-b', title: 'Single Node B' });
  });

  it('is null for a non-foundation register (profile, hub, and undefined)', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });

    for (const register of ['profile', 'hub', undefined] as const) {
      const fm: TopicFrontmatter = {
        ...BASE_FRONTMATTER,
        topic: 'databases',
        area: 'databases',
        reading_order: 1,
        ...(register !== undefined && { register }),
      };
      expect(getReadingPosition(fm, root)).toBeNull();
    }
  });

  it('is null for a blank area — reading_order/movement are unvalidated, so this must fail soft, not throw', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });

    const fm: TopicFrontmatter = {
      ...BASE_FRONTMATTER,
      topic: 'databases',
      register: 'foundation',
      area: '   ',
      reading_order: 1,
    };
    expect(getReadingPosition(fm, root)).toBeNull();
  });

  it('is null for an area that is entirely absent', () => {
    const fm: TopicFrontmatter = { ...BASE_FRONTMATTER, register: 'foundation', reading_order: 1 };
    expect(getReadingPosition(fm, makeTmpRoot())).toBeNull();
  });

  it.each([0, -1, 1.5])('is null for an invalid reading_order (%p)', (readingOrder) => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });

    const fm: TopicFrontmatter = {
      ...BASE_FRONTMATTER,
      topic: 'databases',
      register: 'foundation',
      area: 'databases',
      reading_order: readingOrder,
    };
    expect(getReadingPosition(fm, root)).toBeNull();
  });

  it('is null when reading_order is entirely absent', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });

    const fm: TopicFrontmatter = { ...BASE_FRONTMATTER, topic: 'databases', register: 'foundation', area: 'databases' };
    expect(getReadingPosition(fm, root)).toBeNull();
  });

  // Defensive totality: a well-formed-looking foundation whose own slug is
  // not actually present among its area's resolved foundations (e.g. an
  // authored area that does not match anything live) resolves to null rather
  // than throwing.
  it('is null when the topic itself is not found among its area\'s resolved foundations', () => {
    const root = makeTmpRoot();
    writeTopicFixture(root, 'databases', { area: 'databases', register: 'hub' });
    writeTopicFixture(root, 'single-node', {
      area: 'databases',
      register: 'foundation',
      movement: 'Single Node',
      readingOrder: 1,
    });

    const fm: TopicFrontmatter = {
      ...BASE_FRONTMATTER,
      topic: 'ghost',
      register: 'foundation',
      area: 'databases',
      reading_order: 99,
    };
    expect(getReadingPosition(fm, root)).toBeNull();
  });
});

describe('summarizeCatalogueFreshness', () => {
  const NOW = new Date('2026-07-28T00:00:00.000Z');

  it('returns the null/zero rollup for an empty entries list rather than throwing', () => {
    expect(summarizeCatalogueFreshness([], NOW)).toEqual({
      totalCount: 0,
      freshCount: 0,
      mostRecentlyCut: null,
    });
  });

  it('counts totalCount and freshCount against the fixed clock, via isFresh\'s 14-day window', () => {
    const result = summarizeCatalogueFreshness(
      [
        { slug: 'databases', title: 'Databases', cutDate: '2026-07-28' }, // fresh: cut today
        { slug: 'transactions', title: 'Transactions', cutDate: '2026-07-01' }, // stale: 27 days old
        { slug: 'indexing', title: 'Indexing', cutDate: '2026-07-20' }, // fresh: 8 days old
      ],
      NOW
    );

    expect(result.totalCount).toBe(3);
    expect(result.freshCount).toBe(2);
  });

  // The rule this rollup exists to honor (freshness.ts's own docstring, and
  // this slice's Proof of work): a no-cut research run must not light the
  // count. CatalogueFreshnessInput carries only cutDate — never
  // last_researched — so an old cut stays stale regardless of how recently
  // the topic was merely re-researched.
  it('keys freshness on cutDate alone — a stale cut is never fresh, no matter how recent research was', () => {
    const result = summarizeCatalogueFreshness(
      [{ slug: 'databases', title: 'Databases', cutDate: '2025-01-01' }],
      NOW
    );
    expect(result.freshCount).toBe(0);
    expect(result.totalCount).toBe(1);
  });

  it('picks the entry with the latest cutDate as mostRecentlyCut', () => {
    const result = summarizeCatalogueFreshness(
      [
        { slug: 'databases', title: 'Databases', cutDate: '2026-07-01' },
        { slug: 'transactions', title: 'Transactions', cutDate: '2026-07-20' },
        { slug: 'indexing', title: 'Indexing', cutDate: '2026-07-10' },
      ],
      NOW
    );
    expect(result.mostRecentlyCut).toEqual({
      slug: 'transactions',
      title: 'Transactions',
      cutDate: '2026-07-20',
    });
  });

  it('breaks a same-day-cut tie in mostRecentlyCut by slug ascending', () => {
    const result = summarizeCatalogueFreshness(
      [
        { slug: 'zeta', title: 'Zeta', cutDate: '2026-07-20' },
        { slug: 'alpha', title: 'Alpha', cutDate: '2026-07-20' },
      ],
      NOW
    );
    expect(result.mostRecentlyCut?.slug).toBe('alpha');
  });
});
