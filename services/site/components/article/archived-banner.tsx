'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDisplayDate } from '@/lib/format-date';

export interface ArchivedBannerProps {
  version: number;
  cutDate: string;
  currentVersion: number;
  currentCutDate: string;
  articleHref: string;
}

/**
 * `/[topic]/v/[n]/`'s archived banner (01-ui-design.md, Archived Version;
 * design-system.md's Error & honesty choreography) — replaces the trust
 * header, sticky for the whole page, condensing after the first viewport to
 * a slim single line ("history must never masquerade as current, however
 * deep the reader scrolls").
 *
 * The condense threshold is a client-only scroll/resize listener because it
 * keys on the *reader's* viewport height (`window.innerHeight`), which has no
 * build-time value — the server-rendered (SSR/no-JS) markup always starts
 * in the expanded form, matching the page's static-export default; a no-JS
 * reader simply never sees the condensed state, which is a fine no-JS
 * fallback for a state that's a scroll-position convenience, not content.
 * Re-evaluated on resize too, not just scroll: `window.innerHeight` itself
 * changes on resize (e.g. rotating a tablet, or the reader's own window
 * shrinking) without any scroll event firing, so a resize-only threshold
 * change would otherwise leave the banner showing a stale condensed state
 * until the reader's next scroll.
 */
export function ArchivedBanner({ version, cutDate, currentVersion, currentCutDate, articleHref }: ArchivedBannerProps) {
  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsCondensed(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <p className={isCondensed ? 'archived-banner is-condensed' : 'archived-banner'}>
      {isCondensed ? (
        <Link href={articleHref} className="archived-banner-condensed-link">
          {`v${version} · current is v${currentVersion} →`}
        </Link>
      ) : (
        <>
          <span className="archived-banner-text">
            {"You're reading "}
            <strong>{`v${version}`}</strong>
            {`, cut ${formatDisplayDate(cutDate)}. The current version is `}
            <strong>{`v${currentVersion}`}</strong>
            {`, updated ${formatDisplayDate(currentCutDate)}.`}
          </span>
          <Link href={articleHref} className="archived-banner-link">
            Read current →
          </Link>
        </>
      )}
    </p>
  );
}
