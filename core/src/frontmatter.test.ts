import { describe, expect, it } from 'vitest';
import { validateTopicFrontmatter, validateVersionFrontmatter } from './frontmatter.js';

const VALID_TOPIC = {
  topic: 'databases',
  title: 'Databases',
  stance: 'Pick storage by workload shape, not vendor framing.',
  version: 1,
  status: 'current',
  cadence: '90d',
  last_researched: '2026-01-15',
};

describe('validateTopicFrontmatter', () => {
  it('accepts a well-formed frontmatter object and returns the typed value', () => {
    const result = validateTopicFrontmatter(VALID_TOPIC, 'databases');
    expect(result.issues).toEqual([]);
    expect(result.value).toEqual(VALID_TOPIC);
  });

  it('normalizes a gray-matter-coerced Date in last_researched to an ISO string', () => {
    const result = validateTopicFrontmatter(
      { ...VALID_TOPIC, last_researched: new Date('2026-01-15T00:00:00.000Z') },
      'databases'
    );
    expect(result.issues).toEqual([]);
    expect(result.value?.last_researched).toBe('2026-01-15');
  });

  it('flags topic !== slug as an issue naming both values', () => {
    const result = validateTopicFrontmatter({ ...VALID_TOPIC, topic: 'not-databases' }, 'databases');
    expect(result.value).toBeUndefined();
    expect(result.issues.some((issue) => issue.includes('not-databases') && issue.includes('databases'))).toBe(
      true
    );
  });

  it('rejects a status value outside the closed set', () => {
    const result = validateTopicFrontmatter({ ...VALID_TOPIC, status: 'archived' }, 'databases');
    expect(result.issues.some((issue) => issue.includes("field 'status'"))).toBe(true);
  });

  it('rejects a cadence that does not match <int>d', () => {
    const result = validateTopicFrontmatter({ ...VALID_TOPIC, cadence: '90 days' }, 'databases');
    expect(result.issues.some((issue) => issue.includes("field 'cadence'"))).toBe(true);
  });

  it('rejects a 0d cadence — the interval must be at least 1 day', () => {
    const result = validateTopicFrontmatter({ ...VALID_TOPIC, cadence: '0d' }, 'databases');
    expect(result.issues.some((issue) => issue.includes("field 'cadence'"))).toBe(true);
  });

  it('rejects a full timestamp in last_researched — the schema fixes YYYY-MM-DD', () => {
    const result = validateTopicFrontmatter(
      { ...VALID_TOPIC, last_researched: '2026-01-15T10:00:00Z' },
      'databases'
    );
    expect(result.issues.some((issue) => issue.includes("field 'last_researched'"))).toBe(true);
  });

  it('rejects a non-positive-integer version', () => {
    expect(
      validateTopicFrontmatter({ ...VALID_TOPIC, version: 0 }, 'databases').issues.some((i) =>
        i.includes("field 'version'")
      )
    ).toBe(true);
    expect(
      validateTopicFrontmatter({ ...VALID_TOPIC, version: 1.5 }, 'databases').issues.some((i) =>
        i.includes("field 'version'")
      )
    ).toBe(true);
  });

  it('rejects a malformed last_researched date', () => {
    const result = validateTopicFrontmatter({ ...VALID_TOPIC, last_researched: '2026-99-99' }, 'databases');
    expect(result.issues.some((issue) => issue.includes("field 'last_researched'"))).toBe(true);
  });

  it('collects every violated field in one pass rather than stopping at the first', () => {
    const result = validateTopicFrontmatter(
      { topic: 'wrong-slug', status: 'archived', cadence: 'weekly' },
      'databases'
    );
    expect(result.issues.length).toBeGreaterThanOrEqual(4); // topic mismatch, title, stance, version, status, cadence, last_researched
  });
});

describe('validateVersionFrontmatter', () => {
  it('accepts exactly { version, cut }', () => {
    const result = validateVersionFrontmatter({ version: 5, cut: '2026-06-12' });
    expect(result.issues).toEqual([]);
    expect(result.value).toEqual({ version: 5, cut: '2026-06-12' });
  });

  it('normalizes a gray-matter-coerced Date in cut', () => {
    const result = validateVersionFrontmatter({ version: 5, cut: new Date('2026-06-12T00:00:00.000Z') });
    expect(result.value?.cut).toBe('2026-06-12');
  });

  it('rejects a status field on a frozen snapshot — a version snapshot never carries one', () => {
    const result = validateVersionFrontmatter({ version: 5, cut: '2026-06-12', status: 'current' });
    expect(result.issues.some((issue) => issue.includes("field 'status'"))).toBe(true);
  });

  it('rejects a missing or non-integer version', () => {
    expect(validateVersionFrontmatter({ cut: '2026-06-12' }).issues.length).toBeGreaterThan(0);
    expect(validateVersionFrontmatter({ version: 'five', cut: '2026-06-12' }).issues.length).toBeGreaterThan(0);
  });

  it('rejects any unknown key — the snapshot schema is exactly version and cut', () => {
    const result = validateVersionFrontmatter({ version: 5, cut: '2026-06-12', notes: 'stray' });
    expect(result.value).toBeUndefined();
    expect(result.issues.some((issue) => issue.includes("unexpected field 'notes'"))).toBe(true);
  });
});
