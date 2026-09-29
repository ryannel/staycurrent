import { Fragment } from 'react';
import Link from 'next/link';
import type { ReadingPathLink, ReadingPosition } from '@/lib/content';

/** "1st"/"2nd"/"3rd"/"4th"/... — the rail's position-within-movement figure ("4th of 5 in this movement"). */
function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export interface ReadingOrderRailHeaderProps {
  position: ReadingPosition;
}

/**
 * The Reading-Order Rail's header — the second instance of the
 * Instrumentation Strip pattern: movement, position in the full path, position within the
 * movement, and a "Read first" line naming every prereq — absent entirely
 * (not "no prerequisites") when the topic authored none, the same
 * absence-is-resting-state convention the freshness dot already uses.
 *
 * `app/[topic]/page.tsx` renders this only when `getReadingPosition` returns
 * non-null — a foundation not yet annotated with `movement`/`reading_order`
 * renders with no rail at all, per that accessor's fail-soft contract.
 */
export function ReadingOrderRailHeader({ position }: ReadingOrderRailHeaderProps) {
  return (
    <nav aria-label="Reading path position" className="instrumentation-strip reading-rail-header">
      <p className="reading-rail-meta">
        {position.movement}
        <span aria-hidden="true">·</span>
        {`piece ${position.indexInPath} of ${position.totalInPath}`}
        <span aria-hidden="true">·</span>
        {`${ordinal(position.indexInMovement)} of ${position.totalInMovement} in this movement`}
      </p>
      {position.prereqs.length > 0 && (
        <p className="reading-rail-meta">
          <span>Read first:</span>
          {position.prereqs.map((prereq, index) => (
            <Fragment key={prereq.slug}>
              {index > 0 && <span aria-hidden="true">·</span>}
              <Link href={`/${prereq.slug}/`}>{prereq.title}</Link>
            </Fragment>
          ))}
        </p>
      )}
    </nav>
  );
}

export interface ReadingOrderRailFooterProps {
  next: ReadingPathLink | null;
  hubHref: string;
}

/**
 * The Reading-Order Rail's footer — "Continue" pointer (rendered
 * unconditionally alongside the header). `next` is derived by
 * `getReadingPosition` from the live sweep, so it can only ever name a piece
 * that exists — it structurally cannot dangle. On the last piece (`next` is
 * `null`) the pointer redirects to the area's hub instead of disappearing.
 *
 * Reuses the plain "→" text arrow the changelog cards already use for "Read
 * entry →" — not the reserved `arrow-up-right` glyph, which means "leaves
 * the site" everywhere else it appears and would misstate an internal link.
 *
 * Its own `aria-label`, "Continue reading" — distinct from the header's
 * "Reading path position" — because the two are separate `<nav>` landmarks
 * (the article body sits between them in the DOM) naming two different
 * things: the header states where the reader IS, the footer offers where to
 * go NEXT. Two landmarks sharing one name would announce as indistinguishable
 * "Reading path position" regions to a screen-reader's landmark list.
 */
export function ReadingOrderRailFooter({ next, hubHref }: ReadingOrderRailFooterProps) {
  return (
    <nav aria-label="Continue reading" className="reading-rail-footer">
      {next ? (
        <Link href={`/${next.slug}/`} className="reading-rail-footer-link">
          {`Continue: ${next.title} →`}
        </Link>
      ) : (
        <Link href={hubHref} className="reading-rail-footer-link">
          Continue: back to the chooser and map →
        </Link>
      )}
    </nav>
  );
}
