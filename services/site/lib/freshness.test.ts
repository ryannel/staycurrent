import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { FRESHNESS_WINDOW_DAYS, isFresh } from './freshness';

const DAY_MS = 24 * 60 * 60 * 1000;
// Midnight UTC, matching how a bare ISO date string ("2026-07-09") parses —
// `last_researched` is always date-only, so anchoring `now` at midnight too
// keeps the 14-day boundary exact instead of off by the time-of-day skew a
// noon `now` would introduce against a midnight-parsed date.
const NOW = new Date('2026-07-09T00:00:00.000Z');

describe('isFresh', () => {
  it('is fresh the day a version is cut', () => {
    expect(isFresh('2026-07-09', NOW)).toBe(true);
  });

  it('is fresh at exactly the 14-day boundary', () => {
    expect(isFresh('2026-06-25', NOW)).toBe(true);
  });

  it('is not fresh one day past the 14-day boundary', () => {
    expect(isFresh('2026-06-24', NOW)).toBe(false);
  });

  it('is not fresh for a date long in the past', () => {
    expect(isFresh('2020-01-01', NOW)).toBe(false);
  });

  it('is not fresh for an unparsable date (fails closed, never throws)', () => {
    expect(isFresh('not-a-date', NOW)).toBe(false);
    expect(isFresh('', NOW)).toBe(false);
  });

  it('is not fresh for a far future-dated cut', () => {
    expect(isFresh('2026-08-01', NOW)).toBe(false);
  });

  // UTC/build-clock skew tolerance: a cut date up to 48h "in the future" of
  // `now` is ordinary skew around a same-day cut on a static build, not a
  // bogus date — see isFresh's doc comment.
  it('is fresh for a cut date within the 48h future-skew tolerance', () => {
    const skewed = new Date(NOW.getTime() + 47 * 60 * 60 * 1000).toISOString();
    expect(isFresh(skewed, NOW)).toBe(true);
  });

  it('is fresh for a cut date exactly at the 48h future-skew boundary', () => {
    const boundary = new Date(NOW.getTime() + 48 * 60 * 60 * 1000).toISOString();
    expect(isFresh(boundary, NOW)).toBe(true);
  });

  it('is not fresh for a cut date just past the 48h future-skew boundary', () => {
    const pastBoundary = new Date(NOW.getTime() + 48 * 60 * 60 * 1000 + 1).toISOString();
    expect(isFresh(pastBoundary, NOW)).toBe(false);
  });

  // Property: isFresh only ever depends on the boundary distance, never
  // throws, and is always false for anything strictly older than the window
  // — an invariant that holds for every representable day offset, not just
  // the handful of examples above.
  it('is never fresh for any date more than the window in the past', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 365 * 10 }), (extraDays) => {
        const staleMs = NOW.getTime() - (FRESHNESS_WINDOW_DAYS + extraDays) * DAY_MS;
        const stale = new Date(staleMs).toISOString().slice(0, 10);
        expect(isFresh(stale, NOW)).toBe(false);
      })
    );
  });

  it('is always fresh for any date within the window in the past', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: FRESHNESS_WINDOW_DAYS }), (withinDays) => {
        const freshMs = NOW.getTime() - withinDays * DAY_MS;
        const fresh = new Date(freshMs).toISOString().slice(0, 10);
        expect(isFresh(fresh, NOW)).toBe(true);
      })
    );
  });
});
