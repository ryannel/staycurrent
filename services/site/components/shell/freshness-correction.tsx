'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isFresh } from '@/lib/freshness';

/**
 * Client-side correction for every freshness dot on the page (docs/design-
 * system.md § Graphical UI, Badges). This is a STATIC export: there is no
 * request-time render, so the server/build-time `isFresh` computation the
 * sidebar (app/layout.tsx) and the trust header (app/[topic]/page.tsx) both
 * render is only ever as current as the last build — a build that sits
 * unrebuilt for weeks must not keep lying that a topic is fresh.
 *
 * Every freshness-dot element carries `data-cut-date` (the ISO date the
 * dot's own `isFresh` was computed from) regardless of whether the
 * build-time render showed or hid it — this effect recomputes `isFresh`
 * against the reader's actual clock and sets the native `hidden` attribute
 * to match. A reader with JavaScript disabled never runs this: they keep
 * exactly the build-time value (no-JS is not a regression here, per the
 * Required Capability — it's the documented fallback).
 *
 * Mounted once in the root layout (sidebar dots exist on every route, not
 * just `/[topic]/`) and re-run on every client-side navigation (`pathname`
 * dependency) — the layout itself persists across navigations, so a plain
 * mount-only effect would never see the newly-rendered trust-header dot on
 * the article the reader just navigated to.
 */
export function FreshnessCorrection() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-cut-date]');
    for (const node of nodes) {
      const cutDate = node.getAttribute('data-cut-date');
      if (!cutDate) continue;
      node.hidden = !isFresh(cutDate);
    }
  }, [pathname]);

  return null;
}
