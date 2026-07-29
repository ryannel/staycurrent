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

/**
 * One topic's cut date, as `summarizeCatalogueFreshness` needs it
 * (03-api-design.md). `cutDate` is always the CURRENT version's cut — from
 * `lib/content.ts`'s `getTopicCutDate` — never `last_researched`, for the
 * same reason `isFresh` above keys on it.
 */
export interface CatalogueFreshnessInput {
  slug: string;
  title: string;
  cutDate: string;
}

export interface CatalogueFreshness {
  totalCount: number;
  freshCount: number; // entries where isFresh(cutDate, now) is true
  mostRecentlyCut: { slug: string; title: string; cutDate: string } | null; // null iff entries is []
}

/**
 * Turns a list of per-topic cut dates into the Catalogue Freshness Rollup's
 * three numbers (03-api-design.md, `summarizeCatalogueFreshness`) — total
 * count, how many are inside the freshness window, and which one cut most
 * recently. Pure date math, no `@staycurrent/core` call, consistent with
 * every other function in this module.
 *
 * A total function: `entries: []` returns
 * `{ totalCount: 0, freshCount: 0, mostRecentlyCut: null }` rather than
 * throwing — a caller only ever passes an empty list for an area with zero
 * topics, a valid, if inert, state. Ties in `mostRecentlyCut` (two topics cut
 * the same day) break by `slug` ascending — the same rule `listSiteChangelog`
 * already documents for the same situation.
 */
export function summarizeCatalogueFreshness(
  entries: CatalogueFreshnessInput[],
  now: Date = new Date()
): CatalogueFreshness {
  if (entries.length === 0) {
    return { totalCount: 0, freshCount: 0, mostRecentlyCut: null };
  }

  const freshCount = entries.filter((entry) => isFresh(entry.cutDate, now)).length;

  const mostRecentlyCut = entries.reduce((latest, entry) => {
    if (entry.cutDate > latest.cutDate) return entry;
    if (entry.cutDate === latest.cutDate && entry.slug < latest.slug) return entry;
    return latest;
  });

  return {
    totalCount: entries.length,
    freshCount,
    mostRecentlyCut: {
      slug: mostRecentlyCut.slug,
      title: mostRecentlyCut.title,
      cutDate: mostRecentlyCut.cutDate,
    },
  };
}
