import { describe, expect, it } from 'vitest';
import { formatDisplayDate } from './format-date';

describe('formatDisplayDate', () => {
  it('formats an ISO date as "D Mon YYYY" (the trust-header wireframe example)', () => {
    expect(formatDisplayDate('2026-06-12')).toBe('12 Jun 2026');
  });

  it('does not zero-pad the day', () => {
    expect(formatDisplayDate('2026-07-01')).toBe('1 Jul 2026');
  });

  it('formats every month abbreviation correctly', () => {
    expect(formatDisplayDate('2026-01-05')).toBe('5 Jan 2026');
    expect(formatDisplayDate('2026-12-25')).toBe('25 Dec 2026');
  });

  it('is timezone-independent (UTC-anchored), unaffected by the runtime TZ', () => {
    const originalTz = process.env.TZ;
    try {
      process.env.TZ = 'Pacific/Kiritimati'; // UTC+14 — a date near midnight is
      // the case most likely to shift to the adjacent day under local-time
      // formatting instead of UTC.
      expect(formatDisplayDate('2026-06-12')).toBe('12 Jun 2026');
      process.env.TZ = 'Etc/GMT+12'; // UTC-12, the opposite extreme
      expect(formatDisplayDate('2026-06-12')).toBe('12 Jun 2026');
    } finally {
      process.env.TZ = originalTz;
    }
  });

  it('fails closed to the raw string for an unparsable date', () => {
    expect(formatDisplayDate('not-a-date')).toBe('not-a-date');
  });
});
