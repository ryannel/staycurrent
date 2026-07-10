/**
 * Freshness window shared by the sidebar topic tree and the article trust
 * header (docs/design-system.md § Graphical UI, Badges: "The freshness dot
 * ... rendered only while the current version is ≤ 14 days old"). Pure date
 * math — no `@staycurrent/core` call, computed from the CURRENT VERSION'S
 * CUT DATE (see `lib/content.ts`'s `getTopicCutDate`), never from
 * `last_researched` — a no-cut research run updates the latter without
 * cutting, and must not light the dot on its own.
 */
export const FRESHNESS_WINDOW_DAYS = 14;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// A cut date is a bare calendar day (no time component); the instant it was
// actually written could be anywhere in that UTC day, and a static build can
// run in any timezone. Tolerate up to 48h of apparent "future" skew around a
// same-day cut before treating a date as bogus — beyond that it fails closed.
const FUTURE_SKEW_TOLERANCE_MS = 48 * 60 * 60 * 1000;

/**
 * True when `cutDate` (an ISO 8601 date, e.g. "2026-07-09" — the current
 * version's cut, not `last_researched`) is within the freshness window of
 * "now".
 *
 * An unparsable date is never fresh (fails closed rather than throwing —
 * currency validation already happened upstream in `loadTopic`/`loadVersion`;
 * this is a presentational read, not a second validation pass). A date more
 * than `FUTURE_SKEW_TOLERANCE_MS` ahead of `now` is rejected as bogus rather
 * than ordinary clock/timezone skew around a same-day cut.
 */
export function isFresh(cutDate: string, now: Date = new Date()): boolean {
  const cutMs = Date.parse(cutDate);
  if (!Number.isFinite(cutMs)) return false;
  const ageMs = now.getTime() - cutMs;
  if (ageMs < -FUTURE_SKEW_TOLERANCE_MS) return false;
  return ageMs <= FRESHNESS_WINDOW_DAYS * MS_PER_DAY;
}
