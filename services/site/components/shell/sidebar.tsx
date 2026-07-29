'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronRight, Menu, Rss, X } from 'lucide-react';
import { ICON_STROKE_WIDTH } from '@/lib/icons';
import { ThemeToggle } from './theme-toggle';

// The site-wide (not per-topic) pages the `.site-pages` list links — kept as
// named constants rather than repeating the literal strings at both the
// `href` and the `pathname` comparison site, so the two can never drift.
const CHANGELOG_PAGE_HREF = '/changelog/';
const ABOUT_PAGE_HREF = '/about/';

// The GitHub repository behind this site — the sidebar footer's third
// cluster item (Footer cluster spec, docs/design-system.md § Graphical UI).
const FRAMEWORK_REPO_URL = 'https://github.com/ryannel/staycurrent';

export interface TopicNavEntry {
  slug: string;
  title: string;
  isFresh: boolean;
  cutDate: string;
  // Present only for a Profiles-register catalogue entry, true for the
  // featured (★) trio — renders the `badge-core` marker (databases-catalogue
  // bet, 01-ui-design.md "Topic Library and Sidebar" view).
  core?: boolean;
}

/** One movement's bucket of foundations inside a catalogue's sidebar tree — `getCatalogues`' `CatalogueMovement`, trimmed to what the tree needs. */
export interface SidebarMovement {
  name: string;
  entries: TopicNavEntry[];
}

/**
 * One area's grouped shape for the sidebar tree (databases-catalogue bet,
 * 01-ui-design.md "Topic Library and Sidebar — Databases-Area Grouping").
 * Built by `app/layout.tsx` from `lib/content.ts`'s `getCatalogues` plus a
 * per-topic freshness lookup — this component stays a plain presentational
 * consumer, same as `TopicNavEntry` above.
 */
export interface SidebarCatalogue {
  area: string;
  hub: TopicNavEntry | null;
  movements: SidebarMovement[];
  profiles: TopicNavEntry[];
}

interface SidebarProps {
  // Topics outside any catalogue (no `area` at all) — renders exactly as
  // today, under the plain "Topics" label (01-ui-design.md, Required
  // Capabilities: "topics outside any catalogue render exactly as today").
  topics: TopicNavEntry[];
  // Grouped areas — defaults to `[]` so every existing caller/test that never
  // passes this prop keeps today's flat rendering unchanged.
  catalogues?: SidebarCatalogue[];
}

// Matches doc-shell.css's own drawer breakpoint (`@media (max-width: 899px)`).
const DRAWER_QUERY = '(max-width: 899px)';

/** Whether any of a topic's four faces is the current page — the same test `renderTopicDisclosure` computes per-face, collapsed to one boolean for a register group's own active-membership check below. */
function topicIsActive(slug: string, pathname: string | null): boolean {
  return (
    pathname === `/${slug}/` ||
    pathname === `/${slug}/changelog/` ||
    pathname === `/${slug}/history/` ||
    pathname === `/${slug}/skill/`
  );
}

/** Whether the currently active page belongs to any topic in this register group — drives `RegisterGroupDisclosure`'s force-reopen-on-navigate behavior below. */
function groupContainsActive(entries: TopicNavEntry[], pathname: string | null): boolean {
  return entries.some((entry) => topicIsActive(entry.slug, pathname));
}

interface RegisterGroupDisclosureProps {
  label: string;
  count: number;
  containsActive: boolean;
  children: React.ReactNode;
}

/**
 * Register-Group Disclosure (docs/design-system.md § App Shell): open by
 * default on first load (resolved decision 4 — "recognition over recall"),
 * and — independently — re-asserted open whenever it starts containing the
 * active page (Key interactions: "that group is force-open on load
 * regardless of its last toggled state"). Otherwise a reader's own manual
 * collapse stands untouched, the same rule the per-topic disclosures follow.
 *
 * This needs real component state (not the plain per-render boolean
 * `renderTopicDisclosure` uses for per-topic disclosures) because "open by
 * default" and "force back open on a later, specific transition" can't both
 * be expressed as a single pure function of `pathname` alone — the first
 * mount has no prior `containsActive` value to compare against. `onToggle`
 * mirrors the reader's own native collapse/expand back into state, so the
 * `containsActive` transition detected in the effect below is a real
 * false→true change React will actually apply to the DOM, not a no-op.
 */
function RegisterGroupDisclosure({ label, count, containsActive, children }: RegisterGroupDisclosureProps) {
  const [open, setOpen] = useState(true);
  const wasContainsActiveRef = useRef(containsActive);

  useEffect(() => {
    if (containsActive && !wasContainsActiveRef.current) {
      setOpen(true);
    }
    wasContainsActiveRef.current = containsActive;
  }, [containsActive]);

  return (
    <details
      className="topic-disclosure register-group-disclosure"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        <ChevronRight
          size={16}
          strokeWidth={ICON_STROKE_WIDTH}
          aria-hidden="true"
          className="topic-disclosure-chevron"
        />
        <span className="topic-title">{label}</span>
        <span className="register-group-count">{`(${count})`}</span>
      </summary>
      <ul className="register-group-topics">{children}</ul>
    </details>
  );
}

/**
 * The App Shell's sidebar (docs/design-system.md § Graphical UI): wordmark,
 * site pages, `Topics` label, topic tree, footer cluster with the theme
 * toggle. Sticky at >= 900px; an overlay drawer below it (Shell zone rule,
 * 01-ui-design.md).
 *
 * Every topic-face link (`changelog`/`history`/`skill`) and the site-wide
 * `/changelog/` page are real routes as of Slice 3.3 and prefetch normally,
 * same as `/about/` — Slice 3.2 kept the (then not-yet-built) `skill` face
 * at `prefetch={false}` so Next's viewport prefetcher never issued a
 * background request for a route the export didn't generate yet (which
 * would otherwise surface as a failed-request in the render-smoke gate);
 * that carve-out is gone now that the route lands.
 */
export function Sidebar({ topics, catalogues = [] }: SidebarProps) {
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

  /**
   * One topic's disclosure row (title, freshness dot, `[core]` badge, four
   * faces) — the existing per-topic markup, factored out so the flat
   * "Topics" list, a catalogue's hub entry, its Foundations group, and its
   * Profiles group all render the identical, unchanged recipe at whatever
   * DOM depth they sit (01-ui-design.md micro-polish: "only its DOM depth
   * changes").
   */
  function renderTopicDisclosure(topic: TopicNavEntry) {
    const articleHref = `/${topic.slug}/`;
    const changelogHref = `/${topic.slug}/changelog/`;
    const historyHref = `/${topic.slug}/history/`;
    const skillHref = `/${topic.slug}/skill/`;
    const isArticleActive = pathname === articleHref;
    const isChangelogActive = pathname === changelogHref;
    const isHistoryActive = pathname === historyHref;
    const isSkillActive = pathname === skillHref;
    // See the field-level comment this logic replaced: `open` is passed once
    // per render, computed from `pathname`, never tracked in its own state —
    // React only touches the DOM `open` attribute when this computed value
    // itself changes, so a reader's own manual toggle of an inactive
    // disclosure survives a route change untouched.
    const isTopicActive = isArticleActive || isChangelogActive || isHistoryActive || isSkillActive;
    return (
      <details className="topic-disclosure" open={isTopicActive}>
        <summary>
          <ChevronRight
            size={16}
            strokeWidth={ICON_STROKE_WIDTH}
            aria-hidden="true"
            className="topic-disclosure-chevron"
          />
          <span className="topic-title">{topic.title}</span>
          {topic.core && <span className="badge badge-core">core</span>}
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
            <Link href={articleHref} aria-current={isArticleActive ? 'page' : undefined} onClick={close}>
              Article
            </Link>
          </li>
          <li>
            <Link href={changelogHref} aria-current={isChangelogActive ? 'page' : undefined} onClick={close}>
              Changelog
            </Link>
          </li>
          <li>
            <Link href={historyHref} aria-current={isHistoryActive ? 'page' : undefined} onClick={close}>
              History
            </Link>
          </li>
          <li>
            <Link href={skillHref} aria-current={isSkillActive ? 'page' : undefined} onClick={close}>
              Skill
            </Link>
          </li>
        </ul>
      </details>
    );
  }

  // Whether the plain "Topics" section should render at all — its own
  // "empty state" (the literal "No topics yet." message) is only the true
  // first-run state; once catalogues exist, a merely-empty leftover list is
  // the resting state (absence, not an error) and renders nothing
  // (01-ui-design.md, "Empty (interim, per register)").
  const showFlatTopicsSection = catalogues.length === 0 || topics.length > 0;

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
          {isOpen ? (
            <X size={16} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />
          ) : (
            <Menu size={16} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />
          )}
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
            <Link
              href={CHANGELOG_PAGE_HREF}
              aria-current={pathname === CHANGELOG_PAGE_HREF ? 'page' : undefined}
              onClick={close}
            >
              Changelog
            </Link>
          </li>
          <li>
            <Link href={ABOUT_PAGE_HREF} aria-current={pathname === ABOUT_PAGE_HREF ? 'page' : undefined} onClick={close}>
              About
            </Link>
          </li>
        </ul>

        {catalogues.map((catalogue) => {
          const foundationCount = catalogue.movements.reduce((sum, m) => sum + m.entries.length, 0);
          return (
            <Fragment key={catalogue.area}>
              {/* The area label — "was 'Topics'; the area label, now named
                  for its one area" (01-ui-design.md sidebar wireframe).
                  Uppercased by `.nav-section-label`'s own CSS, same as every
                  other section label — the text content stays the area's
                  own case. */}
              <p className="nav-section-label">{catalogue.area}</p>
              <ul className="topic-tree">
                {catalogue.hub && <li key={catalogue.hub.slug}>{renderTopicDisclosure(catalogue.hub)}</li>}
                {foundationCount > 0 && (
                  <li>
                    <RegisterGroupDisclosure
                      label="Foundations"
                      count={foundationCount}
                      containsActive={groupContainsActive(
                        catalogue.movements.flatMap((m) => m.entries),
                        pathname
                      )}
                    >
                      {catalogue.movements.map((movement) => (
                        <Fragment key={movement.name}>
                          {/* Movement Divider (docs/design-system.md § App
                              Shell): `.nav-section-label`'s exact recipe,
                              non-interactive (never focusable, no hover
                              state) but NOT hidden from assistive tech — the
                              movements are the reading path's own spine, so
                              they belong in the accessibility tree exactly
                              like every other `.nav-section-label` on the
                              site. */}
                          <li className="nav-section-label movement-divider">{movement.name}</li>
                          {movement.entries.map((entry) => (
                            <li key={entry.slug}>{renderTopicDisclosure(entry)}</li>
                          ))}
                        </Fragment>
                      ))}
                    </RegisterGroupDisclosure>
                  </li>
                )}
                {catalogue.profiles.length > 0 && (
                  <li>
                    <RegisterGroupDisclosure
                      label="Profiles"
                      count={catalogue.profiles.length}
                      containsActive={groupContainsActive(catalogue.profiles, pathname)}
                    >
                      {catalogue.profiles.map((entry) => (
                        <li key={entry.slug}>{renderTopicDisclosure(entry)}</li>
                      ))}
                    </RegisterGroupDisclosure>
                  </li>
                )}
              </ul>
            </Fragment>
          );
        })}

        {showFlatTopicsSection && (
          <>
            <p className="nav-section-label">Topics</p>
            <ul className="topic-tree">
              {topics.length === 0 && <li className="topic-tree-empty">No topics yet.</li>}
              {topics.map((topic) => (
                <li key={topic.slug}>{renderTopicDisclosure(topic)}</li>
              ))}
            </ul>
          </>
        )}

        <div className="sidebar-footer">
          <ThemeToggle />
          {/* Footer cluster's RSS glyph link (docs/design-system.md § Graphical UI:
              "theme toggle, RSS glyph link, framework repo link"), the item deferred
              from Milestone 2 until /rss.xml existed to feed it (Slice 3.3's
              prebuild). Points straight at the static feed artifact, not a Next
              route — a plain anchor, matching the framework repo link beside it. */}
          <a href="/rss.xml" className="btn-ghost" aria-label="RSS feed">
            <Rss size={16} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />
          </a>
          {/* Footer cluster's framework repo link. */}
          <a
            href={FRAMEWORK_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            aria-label="Framework repository on GitHub"
          >
            <ArrowUpRight size={16} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />
          </a>
        </div>
      </nav>
    </>
  );
}
