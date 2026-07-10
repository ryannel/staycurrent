'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronRight, Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

// The GitHub repository behind this site — the sidebar footer's third
// cluster item (Footer cluster spec, docs/design-system.md § Graphical UI).
// The RSS glyph link is the fourth and lands in Milestone 3, once /changelog/
// exists to feed it.
const FRAMEWORK_REPO_URL = 'https://github.com/ryannel/staycurrent';

export interface TopicNavEntry {
  slug: string;
  title: string;
  isFresh: boolean;
  cutDate: string;
}

interface SidebarProps {
  topics: TopicNavEntry[];
}

// Matches doc-shell.css's own drawer breakpoint (`@media (max-width: 899px)`).
const DRAWER_QUERY = '(max-width: 899px)';

/**
 * The App Shell's sidebar (docs/design-system.md § Graphical UI): wordmark,
 * site pages, `Topics` label, topic tree, footer cluster with the theme
 * toggle. Sticky at >= 900px; an overlay drawer below it (Shell zone rule,
 * 01-ui-design.md).
 *
 * `changelog`/`history`/`skill` face links and the site-wide `/changelog/`
 * page don't exist as routes yet (Milestone 3) — `prefetch={false}` on all
 * of them so Next's viewport prefetcher never issues a background request
 * for a route this export doesn't generate (which would otherwise surface as
 * a failed-request in the render-smoke gate). `/about/` is a real route as
 * of this slice, so its link prefetches normally.
 */
export function Sidebar({ topics }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Whether the sidebar is currently rendered as the overlay drawer (< 900px)
  // rather than the sticky always-visible rail — the closed drawer must be
  // `inert` so it drops out of the tab order; the sticky rail must never be.
  const [isDrawerMode, setIsDrawerMode] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const mql = window.matchMedia(DRAWER_QUERY);
    const sync = (e: MediaQueryList | MediaQueryListEvent) => setIsDrawerMode(e.matches);
    sync(mql);
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      // Focus trap: Tab/Shift+Tab cycle within the drawer's own focusable
      // elements while it's open, rather than escaping into the (visually
      // covered, backdrop-obscured) page behind it.
      if (event.key !== 'Tab' || !navRef.current) return;
      const focusable = navRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <div className="mobile-topbar">
        <button
          type="button"
          className="btn-ghost"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
        </button>
        <Link href="/" className="wordmark">
          Stay Current
        </Link>
      </div>

      {isOpen && <div className="drawer-backdrop" onClick={close} />}

      <nav
        ref={navRef}
        className={`sidebar${isOpen ? ' is-open' : ''}`}
        aria-label="Primary"
        // Never inert in sticky (non-drawer) mode; inert only while the
        // overlay drawer is present but closed (CONFIRMED: without this, a
        // 4th Tab press lands on the off-screen drawer's own links).
        inert={isDrawerMode && !isOpen}
      >
        <Link href="/" className="wordmark" onClick={close}>
          Stay Current
        </Link>

        <ul className="site-pages">
          <li>
            <Link href="/changelog/" prefetch={false} onClick={close}>
              Changelog
            </Link>
          </li>
          <li>
            <Link href="/about/" onClick={close}>
              About
            </Link>
          </li>
        </ul>

        <p className="nav-section-label">Topics</p>
        <ul className="topic-tree">
          {topics.length === 0 && <li className="topic-tree-empty">No topics yet.</li>}
          {topics.map((topic) => {
            const articleHref = `/${topic.slug}/`;
            const isActive = pathname === articleHref;
            return (
              <li key={topic.slug}>
                <details className="topic-disclosure">
                  <summary>
                    {/* Committed Lucide `chevron-right` (Iconography spec: 16px,
                        stroke 1.5) replacing the former Unicode `▸` marker —
                        every glyph in the product is Lucide, never a text
                        glyph. Rotation on open is a CSS transform keyed off
                        this class (see doc-shell.css), unchanged from the
                        marker it replaces. */}
                    <ChevronRight
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="topic-disclosure-chevron"
                    />
                    <span className="topic-title">{topic.title}</span>
                    <span
                      className="freshness-dot"
                      data-cut-date={topic.cutDate}
                      hidden={!topic.isFresh}
                      role="img"
                      aria-label="fresh"
                    >
                      fresh
                    </span>
                  </summary>
                  <ul className="topic-faces">
                    <li>
                      <Link href={articleHref} aria-current={isActive ? 'page' : undefined} onClick={close}>
                        Article
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${topic.slug}/changelog/`} prefetch={false} onClick={close}>
                        Changelog
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${topic.slug}/history/`} prefetch={false} onClick={close}>
                        History
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${topic.slug}/skill/`} prefetch={false} onClick={close}>
                        Skill
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer">
          <ThemeToggle />
          {/* Footer cluster's framework repo link (docs/design-system.md § Graphical
              UI: "theme toggle, RSS glyph link, framework repo link"). The RSS glyph
              link is the remaining item and lands in Milestone 3, once /changelog/
              exists to feed it — deliberately not added here. */}
          <a
            href={FRAMEWORK_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            aria-label="Framework repository on GitHub"
          >
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </nav>
    </>
  );
}
