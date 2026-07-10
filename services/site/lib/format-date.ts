const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * Formats an ISO 8601 date (e.g. "2026-06-12") as the trust header's
 * human-readable display form ("12 Jun 2026") — docs/design-system.md's
 * trust-header wireframe.
 *
 * Parsed and rendered in UTC explicitly, never via `toLocaleDateString()` or
 * `Intl.DateTimeFormat` without a pinned `timeZone`: those resolve against
 * the running machine's local timezone, which would make the exact same
 * `last_researched` value build to different display text depending on the
 * build machine/CI's local timezone — this must be a pure function of the
 * date string alone for a reproducible static export.
 *
 * An unparsable date fails closed to the raw input string rather than
 * throwing — currency validation already happened upstream in `loadTopic`;
 * this is a presentational read, not a second validation pass.
 */
export function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}
