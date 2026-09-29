import Link from 'next/link';
import { formatDisplayDate } from '@/lib/format-date';
import type { CatalogueFreshness } from '@/lib/freshness';

export interface CatalogueFreshnessRollupProps {
  freshness: CatalogueFreshness;
}

/**
 * The Catalogue Freshness Rollup — the hub page's instance of the
 * Instrumentation Strip pattern (docs/design-system.md § App Shell). One
 * aggregate
 * line: total count, fresh count, and the most-recently-cut topic — true
 * live values from `summarizeCatalogueFreshness`, never a hardcoded number,
 * so the band reads correctly as topics are added to the area without a
 * code change.
 *
 * `app/[topic]/page.tsx` renders this only when the current topic's
 * `register === 'hub'` and its `area` resolves to a real `Catalogue` — this
 * component itself has no empty/degraded render path, because the sweep
 * behind it is all-or-nothing (`sweepOrThrow`); a zero-topic area still
 * produces a valid `{ totalCount: 0, ... }` summary, not an omission.
 */
export function CatalogueFreshnessRollup({ freshness }: CatalogueFreshnessRollupProps) {
  const { totalCount, freshCount, mostRecentlyCut } = freshness;
  const pieceWord = totalCount === 1 ? 'piece' : 'pieces';

  return (
    <div className="instrumentation-strip">
      <p className="nav-section-label">Across the catalogue</p>
      <p className="instrumentation-strip-body">
        {`${totalCount} ${pieceWord} · ${freshCount} fresh (≤14d)`}
        {mostRecentlyCut && (
          <>
            {' · most recently cut: '}
            <Link href={`/${mostRecentlyCut.slug}/`}>{mostRecentlyCut.title}</Link>
            {`, ${formatDisplayDate(mostRecentlyCut.cutDate)}`}
          </>
        )}
      </p>
    </div>
  );
}
