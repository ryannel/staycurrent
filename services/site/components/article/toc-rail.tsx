'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@staycurrent/core';

interface TocRailProps {
  entries: TocEntry[];
}

// Matches doc-shell.css's own breakpoint for the sticky rail vs. the in-page
// <details> outline (`@media (max-width: 1279px)`).
const DESKTOP_QUERY = '(min-width: 1280px)';

/**
 * `/[topic]/`'s TOC rail (01-ui-design.md): h2/h3 outline only, sticky at
 * >= 1280px, an in-page <details>/<summary> outline below that (Shell zone
 * rule). The <details>/<summary> markup is used at every width — CSS alone
 * decides whether it renders as the sticky rail or the collapsed outline —
 * so the list of links is always static, real markup: fully readable and
 * navigable with JavaScript disabled (the `open` attribute's static default
 * is that no-JS fallback). Once mounted, JS takes over `open`: forced open
 * at >= 1280px (the sticky rail has no collapse affordance — its <summary>
 * is display:none there, so a closed `<details>` would be unreachable),
 * default collapsed below that.
 */
export function TocRail({ entries }: TocRailProps) {
  const headings = entries.filter((entry) => entry.depth === 2 || entry.depth === 3);
  const [activeId, setActiveId] = useState<string | null>(null);
  // Mirrors the static `open` no-JS/SSR fallback until the first effect
  // corrects it for the actual viewport.
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const sync = (e: MediaQueryList | MediaQueryListEvent) => setIsOpen(e.matches);
    sync(mql);
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const targets = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const intersecting = new Set<string>();
    const observer = new IntersectionObserver(
      (observedEntries) => {
        for (const observed of observedEntries) {
          const id = (observed.target as HTMLElement).id;
          if (observed.isIntersecting) intersecting.add(id);
          else intersecting.delete(id);
        }
        // The deepest (furthest down the page) heading currently visible
        // wins — e.g. two headings intersecting at once (a short section)
        // means the reader is at the later one. An EMPTY intersecting set
        // does NOT clear the highlight: it means every heading has scrolled
        // out of view (a section taller than the viewport, mid-scroll) — the
        // last heading that passed stays active (last-passed tracking) until
        // the next one arrives, rather than going blank.
        const active = [...headings].reverse().find((heading) => intersecting.has(heading.id));
        if (active) setActiveId(active.id);
      },
      { threshold: 0 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // headings is derived fresh from `entries` every render; re-observing on
    // every entries identity change (not on every render) is the intent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  if (headings.length === 0) return null;

  return (
    <aside className="toc-rail" aria-label="Table of contents">
      <details
        className="toc-rail-details"
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <summary className="toc-rail-summary">On this page</summary>
        <nav>
          <ul className="toc-rail-list">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              return (
                <li key={heading.id} className={heading.depth === 3 ? 'toc-rail-sub' : undefined}>
                  <a
                    href={`#${heading.id}`}
                    className={isActive ? 'toc-link is-active' : 'toc-link'}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </details>
    </aside>
  );
}
