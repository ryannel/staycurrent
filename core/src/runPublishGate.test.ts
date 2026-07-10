import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { runPublishGate } from './runPublishGate.js';
import { makeTmpRoot } from './loaders/fixtures.testutil.js';
import { writeGateFixture } from './runPublishGate.testutil.js';

// A fixed reference date, independent of the real system clock, for the
// cadence-date-valid tests below (03-api-design.md: "opts.now makes check 9
// deterministic under test without mocking the system clock").
const FIXED_NOW = new Date('2026-07-09T00:00:00Z');
const FIXED_CUT = '2026-06-09'; // 30 days before FIXED_NOW
const FIXED_LAST_RESEARCHED = '2026-06-29'; // 10 days before FIXED_NOW

function fixtureDir(root: string, slug = 'fixture-topic'): string {
  return path.join(root, slug);
}

describe('runPublishGate', () => {
  it('returns ok:true with no failures for a complete, internally consistent fixture', () => {
    const dir = fixtureDir(makeTmpRoot());
    writeGateFixture(dir, 'fixture-topic');

    const result = runPublishGate(dir);

    expect(result.ok).toBe(true);
    expect(result.failures).toEqual([]);
  });

  describe('never throws for content problems', () => {
    it('reports failures — not a throw — when the live article.md is missing entirely', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic');
      fs.rmSync(path.join(dir, 'article.md'));

      const result = runPublishGate(dir);

      expect(result.ok).toBe(false);
      expect(result.failures.length).toBeGreaterThan(0);
      expect(result.failures.some((f) => f.check === 'slug-matches-dirname')).toBe(true);
    });

    it('reports failures — not a throw — when article.md frontmatter is garbage YAML', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic');
      fs.writeFileSync(path.join(dir, 'article.md'), '---\n{{{ not yaml: [\n---\n\nBody.\n');

      const result = runPublishGate(dir);

      expect(result.ok).toBe(false);
      expect(result.failures.length).toBeGreaterThan(0);
      expect(result.failures.some((f) => f.check === 'article-version-match')).toBe(true);
    });

    it('propagates a raw fs error when dir itself does not exist — a usage error, not a content violation', () => {
      const missing = path.join(makeTmpRoot(), 'no-such-topic');

      try {
        runPublishGate(missing);
        expect.unreachable();
      } catch (err) {
        expect((err as NodeJS.ErrnoException).code).toBe('ENOENT');
      }
    });
  });

  describe('snapshot-complete', () => {
    it('fails with exactly one failure when versions/vN/article.md is missing', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { omitVersionArtifact: 'article' });

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'snapshot-complete',
          path: 'versions/v1/article.md',
          message: 'missing required artifact: versions/v1/article.md',
        },
      ]);
    });

    it('fails when versions/vN/skill/SKILL.md is missing — co-firing with skill-byte-identical', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { omitVersionArtifact: 'skill' });

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'snapshot-complete',
          path: 'versions/v1/skill/SKILL.md',
          message: 'missing required artifact: versions/v1/skill/SKILL.md',
        },
        {
          check: 'skill-byte-identical',
          path: 'skill/SKILL.md',
          message: 'skill/SKILL.md differs from versions/v1/skill/SKILL.md',
        },
      ]);
    });

    it('fails when versions/vN/provenance.md is missing — co-firing with provenance-non-empty', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { omitVersionArtifact: 'provenance' });

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'snapshot-complete',
          path: 'versions/v1/provenance.md',
          message: 'missing required artifact: versions/v1/provenance.md',
        },
        {
          check: 'provenance-non-empty',
          path: 'versions/v1/provenance.md',
          message: 'versions/v1/provenance.md has no entries in Sources or Synthesis',
        },
      ]);
    });
  });

  describe('changelog-top-entry', () => {
    it('fails when the top heading names a version other than N', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { changelogHeading: '## v2 — {date}' });

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'changelog-top-entry',
          path: 'changelog.md',
          message: "changelog.md top entry is '## v2', expected '## v1'",
        },
      ]);
    });

    it("reports '<malformed>' when the top heading is not '## vN — date' shaped", () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { changelogHeading: '## Founding Note' });

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'changelog-top-entry',
          path: 'changelog.md',
          message: "changelog.md top entry is '## v<malformed>', expected '## v1'",
        },
      ]);
    });

    it("reports '<none>' when changelog.md carries no heading at all", () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic');
      fs.writeFileSync(path.join(dir, 'changelog.md'), '');

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'changelog-top-entry',
          path: 'changelog.md',
          message: "changelog.md top entry is '## v<none>', expected '## v1'",
        },
      ]);
    });
  });

  it('fails article-version-match — and only it — when the live article.md version does not equal N', () => {
    const dir = fixtureDir(makeTmpRoot());
    writeGateFixture(dir, 'fixture-topic', { version: 2 });

    const result = runPublishGate(dir);

    expect(result.failures).toEqual([
      {
        check: 'article-version-match',
        path: 'article.md',
        message: 'article.md frontmatter version is 2, expected 1',
      },
    ]);
  });

  it('fails skill-version-match — and only it — when the live skill/SKILL.md article_version does not equal N', () => {
    const dir = fixtureDir(makeTmpRoot());
    // frozenSkillArticleVersion follows skillArticleVersion in the fixture, so
    // byte-identity holds and this isolates the integer-field check.
    writeGateFixture(dir, 'fixture-topic', { skillArticleVersion: 2 });

    const result = runPublishGate(dir);

    expect(result.failures).toEqual([
      {
        check: 'skill-version-match',
        path: 'skill/SKILL.md',
        message: 'skill/SKILL.md frontmatter article_version is 2, expected 1',
      },
    ]);
  });

  describe('skill-byte-identical', () => {
    it('fails when the live skill/SKILL.md differs from versions/vN/skill/SKILL.md', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', {
        liveSkillExtraLine: 'Extra live-only line for a deliberate byte mismatch.',
      });

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'skill-byte-identical',
          path: 'skill/SKILL.md',
          message: 'skill/SKILL.md differs from versions/v1/skill/SKILL.md',
        },
      ]);
    });

    it('fails for a file present only in the live skill/ tree', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic');
      fs.mkdirSync(path.join(dir, 'skill', 'references'), { recursive: true });
      fs.writeFileSync(path.join(dir, 'skill', 'references', 'extra.md'), 'live-only depth file\n');

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'skill-byte-identical',
          path: 'skill/references/extra.md',
          message: 'skill/references/extra.md differs from versions/v1/skill/references/extra.md',
        },
      ]);
    });

    it('fails for a file present only in the frozen versions/vN/skill/ tree', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic');
      const frozenRefs = path.join(dir, 'versions', 'v1', 'skill', 'references');
      fs.mkdirSync(frozenRefs, { recursive: true });
      fs.writeFileSync(path.join(frozenRefs, 'frozen-only.md'), 'frozen-only depth file\n');

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'skill-byte-identical',
          path: 'skill/references/frozen-only.md',
          message: 'skill/references/frozen-only.md differs from versions/v1/skill/references/frozen-only.md',
        },
      ]);
    });

    it('recurses into references/ and fails on a nested file whose bytes differ', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic');
      fs.mkdirSync(path.join(dir, 'skill', 'references'), { recursive: true });
      fs.mkdirSync(path.join(dir, 'versions', 'v1', 'skill', 'references'), { recursive: true });
      fs.writeFileSync(path.join(dir, 'skill', 'references', 'depth.md'), 'live content\n');
      fs.writeFileSync(
        path.join(dir, 'versions', 'v1', 'skill', 'references', 'depth.md'),
        'frozen content\n'
      );

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'skill-byte-identical',
          path: 'skill/references/depth.md',
          message: 'skill/references/depth.md differs from versions/v1/skill/references/depth.md',
        },
      ]);
    });
  });

  it('fails provenance-non-empty — and only it — when versions/vN/provenance.md has no bullets', () => {
    const dir = fixtureDir(makeTmpRoot());
    writeGateFixture(dir, 'fixture-topic', { emptyProvenance: true });

    const result = runPublishGate(dir);

    expect(result.failures).toEqual([
      {
        check: 'provenance-non-empty',
        path: 'versions/v1/provenance.md',
        message: 'versions/v1/provenance.md has no entries in Sources or Synthesis',
      },
    ]);
  });

  it('fails provenance-non-empty with the parser diagnostic — naming the bullet grammar — when provenance.md exists but does not parse', () => {
    const dir = fixtureDir(makeTmpRoot());
    writeGateFixture(dir, 'fixture-topic');
    // Prose-form provenance: the file exists and has content, but the Sources
    // line is not a bullet in the fixed grammar — the FAIL message must carry
    // the parser's own diagnostic, never the false "has no entries".
    fs.writeFileSync(
      path.join(dir, 'versions', 'v1', 'provenance.md'),
      '## Sources\n\nI read the vendor docs and a few blog posts.\n\n## Synthesis\n\n'
    );

    const result = runPublishGate(dir);

    expect(result.failures).toHaveLength(1);
    const failure = result.failures[0];
    expect(failure.check).toBe('provenance-non-empty');
    expect(failure.path).toBe('versions/v1/provenance.md');
    expect(failure.message).toContain(
      "does not match '- [<title>](<url>) — accessed <YYYY-MM-DD> — supports: <claim>'"
    );
    expect(failure.message).not.toContain('has no entries');
  });

  it('fails slug-matches-dirname, aggregated with frontmatter-schema — the schema shares the topic/slug check (check-10 overlap)', () => {
    const dir = fixtureDir(makeTmpRoot());
    writeGateFixture(dir, 'fixture-topic', { topicField: 'other-topic' });

    const result = runPublishGate(dir);

    expect(result.failures).toEqual([
      {
        check: 'slug-matches-dirname',
        path: 'article.md',
        message: "article.md frontmatter topic 'other-topic' does not match directory 'fixture-topic'",
      },
      {
        check: 'frontmatter-schema',
        path: 'article.md',
        message: "article.md: field 'topic' ('other-topic') does not match directory name ('fixture-topic')",
      },
    ]);
  });

  it('fails reserved-slug — and only it — when the topic slug collides with a reserved root path', () => {
    // dirname === topic === 'skills' so slug-matches-dirname stays green — isolates
    // this check from check 7.
    const dir = fixtureDir(makeTmpRoot(), 'skills');
    writeGateFixture(dir, 'skills');

    const result = runPublishGate(dir);

    expect(result.failures).toEqual([
      {
        check: 'reserved-slug',
        path: 'article.md',
        message: "article.md: topic slug 'skills' collides with a reserved root path",
      },
    ]);
  });

  describe('cadence-date-valid', () => {
    it('fails when cadence does not match <int>d — aggregated with frontmatter-schema, never deduped (change-proposal-6)', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { cadence: '90days' });

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'cadence-date-valid',
          path: 'article.md',
          message: "article.md: cadence '90days' does not match <int>d",
        },
        {
          check: 'frontmatter-schema',
          path: 'article.md',
          message:
            "article.md: field 'cadence' must match the pattern <int>d with at least 1 day, got '90days'",
        },
      ]);
    });

    it('fails when article.md last_researched is after opts.now', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { cutDate: FIXED_CUT, lastResearched: '2026-07-15' });

      const result = runPublishGate(dir, { now: FIXED_NOW });

      expect(result.failures).toEqual([
        {
          check: 'cadence-date-valid',
          path: 'article.md',
          message: "article.md: last_researched '2026-07-15' is not a valid date on or before today",
        },
      ]);
    });

    it('fails when last_researched is not date-shaped at all — aggregated with frontmatter-schema (shared date-shape territory)', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { cutDate: FIXED_CUT, lastResearched: 'sometime' });

      const result = runPublishGate(dir, { now: FIXED_NOW });

      expect(result.failures).toEqual([
        {
          check: 'cadence-date-valid',
          path: 'article.md',
          message: "article.md: last_researched 'sometime' is not a valid date on or before today",
        },
        {
          check: 'frontmatter-schema',
          path: 'article.md',
          message: "article.md: field 'last_researched' must be an ISO date (YYYY-MM-DD), got 'sometime'",
        },
      ]);
    });

    it('fails when last_researched is absent from the frontmatter — aggregated with frontmatter-schema', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { cutDate: FIXED_CUT, omitLastResearched: true });

      const result = runPublishGate(dir, { now: FIXED_NOW });

      expect(result.failures).toEqual([
        {
          check: 'cadence-date-valid',
          path: 'article.md',
          message: "article.md: last_researched 'undefined' is not a valid date on or before today",
        },
        {
          check: 'frontmatter-schema',
          path: 'article.md',
          message: "article.md: field 'last_researched' must be an ISO date (YYYY-MM-DD), got 'undefined'",
        },
      ]);
    });

    it('fails when a versions/vN/article.md cut date is after opts.now', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', {
        cutDate: '2026-07-20',
        lastResearched: FIXED_LAST_RESEARCHED,
      });

      const result = runPublishGate(dir, { now: FIXED_NOW });

      expect(result.failures).toEqual([
        {
          check: 'cadence-date-valid',
          path: 'versions/v1/article.md',
          message: "versions/v1/article.md: cut '2026-07-20' is not a valid date on or before today",
        },
      ]);
    });

    it('accepts a cut date and last_researched exactly equal to opts.now (inclusive boundary)', () => {
      const dir = fixtureDir(makeTmpRoot());
      const today = '2026-07-09';
      writeGateFixture(dir, 'fixture-topic', { cutDate: today, lastResearched: today });

      const result = runPublishGate(dir, { now: FIXED_NOW });

      expect(result.failures).toEqual([]);
    });
  });

  describe('frontmatter-schema', () => {
    it('fails naming the issue — and only frontmatter-schema — when the live stance is blank', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { stance: '   ' });

      const result = runPublishGate(dir);

      expect(result.failures).toEqual([
        {
          check: 'frontmatter-schema',
          path: 'article.md',
          message: "article.md: field 'stance' must not be empty or whitespace-only",
        },
      ]);
    });

    it('adds no check-10 failures for an otherwise complete, schema-valid tree', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic');

      const result = runPublishGate(dir);

      expect(result.ok).toBe(true);
      expect(result.failures.some((f) => f.check === 'frontmatter-schema')).toBe(false);
    });
  });

  describe('N derivation', () => {
    it('fails — with exactly one failure — when no versions/vN/ exists at all (N=0 is not a pass)', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic');
      fs.rmSync(path.join(dir, 'versions'), { recursive: true });

      const result = runPublishGate(dir);

      expect(result.ok).toBe(false);
      expect(result.failures).toEqual([
        {
          check: 'snapshot-complete',
          path: 'versions/',
          message: 'no version snapshot exists — a topic carries at least versions/v1/',
        },
      ]);
    });

    it('N=0 with matching version:0 frontmatter still fails — the fail-open hole is closed', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic', { version: 0, skillArticleVersion: 0 });
      fs.rmSync(path.join(dir, 'versions'), { recursive: true });

      const result = runPublishGate(dir);

      expect(result.ok).toBe(false);
      // The N-derivation failure blocks alone among the N-relative checks — no
      // "expected v0" guidance is emitted — but frontmatter-schema (check 10) is
      // N-independent and still fires on its own: `version: 0` fails
      // validateTopicFrontmatter's positive-integer rule regardless of N.
      expect(result.failures).toEqual([
        {
          check: 'snapshot-complete',
          path: 'versions/',
          message: 'no version snapshot exists — a topic carries at least versions/v1/',
        },
        {
          check: 'frontmatter-schema',
          path: 'article.md',
          message: "article.md: field 'version' must be a positive integer",
        },
      ]);
    });

    it('reports an implausible N (a versions/v2026/ typo) as one failure instead of looping to it', () => {
      const dir = fixtureDir(makeTmpRoot());
      writeGateFixture(dir, 'fixture-topic'); // complete, consistent v1
      fs.mkdirSync(path.join(dir, 'versions', 'v2026'), { recursive: true });

      const result = runPublishGate(dir);

      expect(result.ok).toBe(false);
      expect(result.failures).toEqual([
        {
          check: 'snapshot-complete',
          path: 'versions/v2026',
          message: 'version v2026 exceeds plausible history — check versions/ for mis-named directories',
        },
      ]);
    });

    it('derives N as the numeric-highest versions/vN/ directory, with the exact expected failure set', () => {
      const dir = fixtureDir(makeTmpRoot());
      // v10 is fully seeded and consistent with a live version of 10. v9 and v2 exist
      // as bare (incomplete) directories — present, but deliberately not the highest.
      // 'v9' > 'v10' and 'v2' > 'v10' under a naive string comparison, so this only
      // passes if N is derived as the numeric max (10).
      writeGateFixture(dir, 'fixture-topic', {
        n: 10,
        version: 10,
        skillArticleVersion: 10,
        changelogHeading: '## v10 — {date}',
      });
      fs.mkdirSync(path.join(dir, 'versions', 'v9'), { recursive: true });
      fs.mkdirSync(path.join(dir, 'versions', 'v2'), { recursive: true });

      const result = runPublishGate(dir);

      // Exactly the snapshot-complete failures for every artifact of M=1..9 — v10 is
      // complete, nothing past N is inspected, and no version-match check misfires.
      const expected = [];
      for (let m = 1; m <= 9; m++) {
        for (const artifact of ['article.md', 'skill/SKILL.md', 'provenance.md']) {
          expected.push({
            check: 'snapshot-complete',
            path: `versions/v${m}/${artifact}`,
            message: `missing required artifact: versions/v${m}/${artifact}`,
          });
        }
      }
      expect(result.failures).toEqual(expected);
    });
  });

  it('collects every violated check in one pass rather than failing fast', () => {
    const dir = fixtureDir(makeTmpRoot());
    writeGateFixture(dir, 'fixture-topic', { emptyProvenance: true, version: 2 });

    const result = runPublishGate(dir);

    expect(result.ok).toBe(false);
    const checkIds = result.failures.map((f) => f.check).sort();
    expect(checkIds).toEqual(['article-version-match', 'provenance-non-empty']);
  });
});
