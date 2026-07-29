// Milestone 1 (the catalogue contract answers) — front-door bet-progress
// test. Traces to the milestone's own Acceptance criteria and Proof of work
// (docs/bets/databases-catalogue/decomposition/01-catalogue-contract/index.md)
// and the `Catalogue`, `ReadingPosition`, and `CatalogueFreshness` contracts
// in 03-api-design.md. Slice 1.1's test_slice_1_core_additive_frontmatter.ts
// and Slice 1.2's test_slice_1_site_catalogue_accessors.ts already prove
// `validateTopicFrontmatter`'s extraction rules and the three accessors'
// full behavior over fixture sweeps (including every interim state — no
// areas, hub-only, hub+one-foundation, unannotated) in isolation; this file
// is the milestone's OWN front door, proving the demonstrable goal directly:
// the three accessors return correct catalogue state when driven over the
// REAL `topics/` tree this milestone's waves actually produced (one hub, one
// foundation), plus the one fixture-scoped case the milestone's amended AC
// keeps standing (`getCatalogues` returns `[]` pre-annotation) so this test
// never goes red by the mere passage of time or a future wave's cut.
//
// Unit-tests the real functions directly rather than driving a running
// surface: this bet's only surface is an embedded core with no HTTP boundary
// (03-api-design.md's header note — "capability behaviour is proven headless
// against the module API with no surface running").

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCatalogues, getReadingPosition, getTopic, getTopicCutDate } from '../../../services/site/lib/content';
import { isFresh, summarizeCatalogueFreshness, type CatalogueFreshnessInput } from '../../../services/site/lib/freshness';

describe('Milestone 1 — catalogue contract, driven over the real topics/ tree', () => {
  it('getCatalogues() groups the real tree into exactly one "databases" catalogue: hub standalone, one foundation in "Single Node"', () => {
    const catalogues = getCatalogues();
    expect(catalogues).toHaveLength(1);

    const [catalogue] = catalogues;
    expect(catalogue.area).toBe('databases');

    expect(catalogue.hub).not.toBeNull();
    expect(catalogue.hub?.slug).toBe('databases');
    expect(catalogue.hub?.register).toBe('hub');

    expect(catalogue.movements).toHaveLength(1);
    expect(catalogue.movements[0].name).toBe('Single Node');
    expect(catalogue.movements[0].entries).toHaveLength(1);
    expect(catalogue.movements[0].entries[0]).toMatchObject({
      slug: 'query-execution',
      register: 'foundation',
      movement: 'Single Node',
    });

    // No profiles have cut yet, and nothing lands in ungrouped — the real
    // tree at this point in the rollout carries exactly the hub and the one
    // annotated foundation, nothing malformed or unclaimed.
    expect(catalogue.profiles).toEqual([]);
    expect(catalogue.ungrouped).toEqual([]);
  });

  it("getReadingPosition() for query-execution's real frontmatter is \"1 of 1\", first (and only) in its own movement, with no next piece", () => {
    const { frontmatter } = getTopic('query-execution');
    const position = getReadingPosition(frontmatter);

    expect(position).not.toBeNull();
    expect(position?.movement).toBe('Single Node');
    expect(position?.indexInPath).toBe(1);
    expect(position?.totalInPath).toBe(1);
    expect(position?.indexInMovement).toBe(1);
    expect(position?.totalInMovement).toBe(1);
    // query-execution authors no prereqs yet — the first (and only) piece on
    // the path, per the same absence-is-resting-state convention the design
    // fixes for a piece with nothing to read first.
    expect(position?.prereqs).toEqual([]);
    // Catalogue-of-one: there is no second foundation to point to — the
    // Continue footer falls back to the hub, never a dangling next.
    expect(position?.next).toBeNull();
  });

  it('summarizeCatalogueFreshness() over the real entries lights exactly the count the isFresh oracle itself lights — never a hardcoded number', () => {
    const catalogue = getCatalogues().find((c) => c.area === 'databases');
    expect(catalogue).toBeDefined();

    const allEntries = [
      ...(catalogue!.hub ? [catalogue!.hub] : []),
      ...catalogue!.movements.flatMap((m) => m.entries),
      ...catalogue!.profiles,
      ...catalogue!.ungrouped,
    ];
    const inputs: CatalogueFreshnessInput[] = allEntries.map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      cutDate: getTopicCutDate(entry.slug, entry.version),
    }));

    // One clock, shared by the function under test and the expectation
    // below, so both ask `isFresh` the identical question over the identical
    // real cut dates — the assertion tracks whatever `isFresh` itself says
    // is true right now, rather than pinning today's answer (2 fresh) as a
    // literal that goes stale the day either cut ages past the 14-day
    // window.
    const now = new Date();
    const freshness = summarizeCatalogueFreshness(inputs, now);

    expect(freshness.totalCount).toBe(inputs.length);
    const expectedFreshCount = inputs.filter((entry) => isFresh(entry.cutDate, now)).length;
    expect(freshness.freshCount).toBe(expectedFreshCount);
    expect(freshness.mostRecentlyCut).not.toBeNull();
  });

  it('getCatalogues() returns [] over a fixture sweep with no area keys at all — the pre-annotation state the contract must always support', () => {
    // Fixture-scoped by design (03-api-design.md's own AC note): the real
    // tree's pre-annotation `[]` was only a point-in-time observation,
    // retired the moment the hub itself was annotated — this fixture keeps
    // that case standing so the milestone test never goes red for having
    // proven a state the tree has since moved past.
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'staycurrent-milestone-1-catalogue-contract-'));
    try {
      const topicDir = path.join(root, 'topics', 'unannotated');
      fs.mkdirSync(topicDir, { recursive: true });
      fs.writeFileSync(
        path.join(topicDir, 'article.md'),
        [
          '---',
          'topic: unannotated',
          'title: Unannotated',
          'stance: "A fixture topic carrying none of the seven additive keys."',
          'version: 1',
          'status: current',
          'cadence: 90d',
          'last_researched: 2026-01-15',
          '---',
          '',
          '# Unannotated',
          '',
          'Stance restated.',
          '',
        ].join('\n')
      );

      expect(getCatalogues(root)).toEqual([]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
