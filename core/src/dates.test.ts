import { describe, expect, it } from 'vitest';
import { computeDue, isIsoDate, normalizeDateValue } from './dates.js';

describe('normalizeDateValue', () => {
  it('passes through a plain ISO string unchanged', () => {
    expect(normalizeDateValue('2026-06-12')).toBe('2026-06-12');
  });

  it('normalizes a JS Date to its ISO date form (defensive guard — the CORE_SCHEMA parser never produces one)', () => {
    // The frontmatter parser uses js-yaml CORE_SCHEMA, so dates arrive as
    // strings; this branch guards any other caller handing a Date directly.
    const coerced = new Date('2026-06-12T00:00:00.000Z');
    expect(normalizeDateValue(coerced)).toBe('2026-06-12');
  });

  it('returns undefined for an Invalid Date rather than throwing on toISOString', () => {
    expect(normalizeDateValue(new Date('not a real date'))).toBeUndefined();
  });

  it('returns undefined for a value that is neither a string nor a Date', () => {
    expect(normalizeDateValue(42)).toBeUndefined();
    expect(normalizeDateValue(undefined)).toBeUndefined();
    expect(normalizeDateValue(null)).toBeUndefined();
  });
});

describe('isIsoDate', () => {
  it('accepts a well-formed calendar date', () => {
    expect(isIsoDate('2026-06-12')).toBe(true);
  });

  it('rejects a syntactically wrong shape', () => {
    expect(isIsoDate('06/12/2026')).toBe(false);
    expect(isIsoDate('2026-6-12')).toBe(false);
    expect(isIsoDate('not-a-date')).toBe(false);
  });

  it('rejects a calendrically impossible date even if the shape matches', () => {
    expect(isIsoDate('2026-02-30')).toBe(false);
    expect(isIsoDate('2026-13-01')).toBe(false);
  });
});

describe('computeDue', () => {
  it('is true once last_researched + cadence has passed', () => {
    expect(computeDue('2020-01-01', '90d')).toBe(true);
  });

  it('is false when the cadence window has not yet elapsed', () => {
    const tomorrow = new Date(Date.now() + 86_400_000);
    const isoToday = tomorrow.toISOString().slice(0, 10);
    expect(computeDue(isoToday, '3650d')).toBe(false);
  });

  it('is independent of status — it only reads last_researched and cadence', () => {
    // computeDue takes no status argument at all; this pins that its signature
    // and behavior stay that way (03-api-design.md: "computed independent of `status`").
    expect(computeDue.length).toBe(2);
  });
});
