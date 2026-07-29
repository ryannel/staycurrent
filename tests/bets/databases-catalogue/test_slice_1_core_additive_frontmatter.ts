// Slice 1.1 (core: additive frontmatter extraction) — bet-progress test.
// Traces to the `validateTopicFrontmatter` extension contract in
// docs/bets/databases-catalogue/technical-design/03-api-design.md and the
// additive schema table in 04-data-design.md. Proves the slice's Required
// Capabilities: each of the seven additive keys is extracted when valid and
// absent when invalid or missing; `issues` is never populated by any of the
// seven; `register` is a closed-union exact match only; `axes` copies only
// recognized keys through.
//
// Unit-tests `validateTopicFrontmatter` directly rather than driving a running
// surface: this bet's only surface is an embedded core with no HTTP boundary
// (03-api-design.md's header note — "capability behaviour is proven headless
// against the module API with no surface running"), and the slice's own Proof
// of work names this exact shape ("Unit tests feed frontmatter with each key
// valid, invalid, and absent").

import { describe, expect, it } from 'vitest';
import { validateTopicFrontmatter } from '../../../core/src/frontmatter.js';

const REQUIRED_ONLY = {
  topic: 'transactions',
  title: 'Transactions',
  stance: 'Take the cheap guarantee everywhere except where an invariant spans rows and money rides on it.',
  version: 1,
  status: 'current',
  cadence: '180d',
  last_researched: '2026-08-01',
};

const ALL_ADDITIVE_VALID = {
  ...REQUIRED_ONLY,
  area: 'databases',
  register: 'foundation',
  movement: 'Single Node',
  reading_order: 5,
  prereqs: ['data-models', 'storage-engines', 'schema-design'],
  core: true,
  axes: {
    consistency_model: 'Linearizable by default',
    partition_strategy: 'Single-node first',
    query_language: 'SQL',
    scaling_axis: 'Read replicas, then vertical',
    latency_profile: 'Low-single-digit ms',
    durability_guarantee: 'WAL-fsynced before commit',
    transaction_support: 'Full multi-row ACID',
    operational_maturity: 'Decades-mature',
  },
};

describe('validateTopicFrontmatter — additive catalogue fields', () => {
  it('extracts all seven additive keys when every one is valid', () => {
    const result = validateTopicFrontmatter(ALL_ADDITIVE_VALID, 'transactions');
    expect(result.issues).toEqual([]);
    expect(result.value?.area).toBe('databases');
    expect(result.value?.register).toBe('foundation');
    expect(result.value?.movement).toBe('Single Node');
    expect(result.value?.reading_order).toBe(5);
    expect(result.value?.prereqs).toEqual(['data-models', 'storage-engines', 'schema-design']);
    expect(result.value?.core).toBe(true);
    expect(result.value?.axes).toEqual(ALL_ADDITIVE_VALID.axes);
  });

  it('leaves all seven additive keys absent when none are authored', () => {
    const result = validateTopicFrontmatter(REQUIRED_ONLY, 'transactions');
    expect(result.issues).toEqual([]);
    expect(result.value).toEqual(REQUIRED_ONLY);
    for (const key of ['area', 'register', 'movement', 'reading_order', 'prereqs', 'core', 'axes']) {
      expect(result.value).not.toHaveProperty(key);
    }
  });

  it('never populates issues from any of the seven additive keys, even when every one is malformed', () => {
    const result = validateTopicFrontmatter(
      {
        ...REQUIRED_ONLY,
        area: '   ',
        register: 'archived',
        movement: 42,
        reading_order: -3,
        prereqs: ['ok', 7],
        core: 'true',
        axes: 'not-an-object',
      },
      'transactions'
    );
    expect(result.issues).toEqual([]);
    expect(result.value).toEqual(REQUIRED_ONLY);
    for (const key of ['area', 'register', 'movement', 'reading_order', 'prereqs', 'core', 'axes']) {
      expect(result.value).not.toHaveProperty(key);
    }
  });

  it('a malformed additive key never blocks validation of an otherwise-invalid topic either — required-field issues stand alone', () => {
    const result = validateTopicFrontmatter(
      { ...REQUIRED_ONLY, status: 'archived', register: 'not-a-real-register' },
      'transactions'
    );
    expect(result.value).toBeUndefined();
    expect(result.issues.some((issue) => issue.includes("field 'status'"))).toBe(true);
    expect(result.issues.some((issue) => issue.toLowerCase().includes('register'))).toBe(false);
  });

  describe('area', () => {
    it('extracts a non-blank string verbatim, surrounding whitespace and all', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, area: '  databases  ' }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value?.area).toBe('  databases  ');
    });

    it('is absent for a blank or whitespace-only string', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, area: '   ' }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('area');
    });

    it('is absent for a non-string value', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, area: 123 }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('area');
    });
  });

  describe('register — closed-union exact match only', () => {
    it.each(['foundation', 'profile', 'hub'])('extracts %s, one of the three exact values', (value) => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, register: value }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value?.register).toBe(value);
    });

    it('is absent for a value outside the closed union', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, register: 'archived' }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('register');
    });

    it('is absent for a near-miss that differs only in case — the match is exact, not case-insensitive', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, register: 'Foundation' }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('register');
    });

    it('is absent for a non-string value', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, register: 1 }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('register');
    });
  });

  describe('movement', () => {
    it('extracts a non-blank string verbatim', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, movement: 'Single Node' }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value?.movement).toBe('Single Node');
    });

    it('is absent for a blank string', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, movement: '' }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('movement');
    });

    it('is absent for a non-string value', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, movement: ['Single Node'] }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('movement');
    });
  });

  describe('reading_order', () => {
    it('extracts a positive integer', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, reading_order: 5 }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value?.reading_order).toBe(5);
    });

    it.each([0, -1, 1.5, '5', undefined])('is absent for %p', (value) => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, reading_order: value }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('reading_order');
    });
  });

  describe('prereqs', () => {
    it('extracts an array of strings verbatim', () => {
      const result = validateTopicFrontmatter(
        { ...REQUIRED_ONLY, prereqs: ['data-models', 'storage-engines'] },
        'transactions'
      );
      expect(result.issues).toEqual([]);
      expect(result.value?.prereqs).toEqual(['data-models', 'storage-engines']);
    });

    it('extracts an empty array — vacuously every element is a string', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, prereqs: [] }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value?.prereqs).toEqual([]);
    });

    it('is absent when any element is not a string', () => {
      const result = validateTopicFrontmatter(
        { ...REQUIRED_ONLY, prereqs: ['data-models', 7] },
        'transactions'
      );
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('prereqs');
    });

    it('is absent for a non-array value', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, prereqs: 'data-models' }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('prereqs');
    });
  });

  describe('core', () => {
    it.each([true, false])('extracts a boolean (%p)', (value) => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, core: value }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value?.core).toBe(value);
    });

    it('is absent for a non-boolean value', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, core: 'true' }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('core');
    });
  });

  describe('axes — recognized-keys-only copy-through', () => {
    it('copies through all eight recognized keys when every value is a non-blank string', () => {
      const result = validateTopicFrontmatter(ALL_ADDITIVE_VALID, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value?.axes).toEqual(ALL_ADDITIVE_VALID.axes);
    });

    it('drops unrecognized keys silently while keeping the recognized ones', () => {
      const result = validateTopicFrontmatter(
        {
          ...REQUIRED_ONLY,
          axes: { consistency_model: 'Linearizable', not_a_real_axis: 'should be dropped' },
        },
        'transactions'
      );
      expect(result.issues).toEqual([]);
      expect(result.value?.axes).toEqual({ consistency_model: 'Linearizable' });
    });

    it('drops a recognized key whose value is not a string', () => {
      const result = validateTopicFrontmatter(
        {
          ...REQUIRED_ONLY,
          axes: { consistency_model: 'Linearizable', partition_strategy: 42 },
        },
        'transactions'
      );
      expect(result.issues).toEqual([]);
      expect(result.value?.axes).toEqual({ consistency_model: 'Linearizable' });
    });

    it('drops a recognized key whose value is a blank string', () => {
      const result = validateTopicFrontmatter(
        {
          ...REQUIRED_ONLY,
          axes: { consistency_model: 'Linearizable', partition_strategy: '   ' },
        },
        'transactions'
      );
      expect(result.issues).toEqual([]);
      expect(result.value?.axes).toEqual({ consistency_model: 'Linearizable' });
    });

    it('is absent when the raw value is not a plain object', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, axes: 'not-an-object' }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('axes');
    });

    it('is absent when the raw value is an array', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, axes: ['not', 'a', 'map'] }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('axes');
    });

    it('is absent when every key present is unrecognized — the copy ends up with zero keys', () => {
      const result = validateTopicFrontmatter(
        { ...REQUIRED_ONLY, axes: { made_up_axis: 'value' } },
        'transactions'
      );
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('axes');
    });

    it('is absent for an empty object', () => {
      const result = validateTopicFrontmatter({ ...REQUIRED_ONLY, axes: {} }, 'transactions');
      expect(result.issues).toEqual([]);
      expect(result.value).not.toHaveProperty('axes');
    });
  });
});
