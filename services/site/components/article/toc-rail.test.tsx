import { afterEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import type { TocEntry } from '@staycurrent/core';
import { TocRail } from './toc-rail';

const HEADINGS: TocEntry[] = [
  { depth: 1, text: 'Databases', id: 'databases' }, // the article's own <h1> — never listed
  { depth: 2, text: 'Overview', id: 'overview' },
  { depth: 3, text: 'A subsection', id: 'a-subsection' },
  { depth: 2, text: 'Choosing', id: 'choosing' },
];

function renderWithHeadingsInDom(entries: TocEntry[]) {
  // TocRail's scroll-spy effect looks up each entry's heading by id — render
  // matching elements so the effect has real targets, mirroring how the
  // headings actually sit in `.article-body` on the page.
  document.body.innerHTML = entries.map((e) => `<h${e.depth} id="${e.id}"></h${e.depth}>`).join('');
  const container = document.createElement('div');
  document.body.appendChild(container);
  return render(<TocRail entries={entries} />, { container });
}

/** Stubs `window.matchMedia` for a single query, returning a controller that
 * can flip `matches` and notify any `change` listener TocRail registered —
 * used to prove the >= 1280px forced-open / < 1280px default-collapsed
 * behaviour without a real viewport. */
function mockMatchMedia(initialMatches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mql = {
    matches: initialMatches,
    media: '(min-width: 1280px)',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: (_type: string, cb: (event: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_type: string, cb: (event: MediaQueryListEvent) => void) => listeners.delete(cb),
    dispatchEvent: () => false,
  };
  const original = window.matchMedia;
  window.matchMedia = (() => mql) as typeof window.matchMedia;
  return {
    restore: () => {
      window.matchMedia = original;
    },
    setMatches: (matches: boolean) => {
      mql.matches = matches;
      act(() => {
        listeners.forEach((cb) => cb({ matches } as MediaQueryListEvent));
      });
    },
  };
}

/** Captures the IntersectionObserver callback TocRail registers, so tests can
 * drive scroll-spy transitions directly without real scroll geometry. */
function mockIntersectionObserver() {
  let callback: IntersectionObserverCallback | null = null;
  class MockIntersectionObserver {
    constructor(cb: IntersectionObserverCallback) {
      callback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  const original = window.IntersectionObserver;
  // @ts-expect-error — partial stub, sufficient to capture the callback.
  window.IntersectionObserver = MockIntersectionObserver;
  return {
    restore: () => {
      window.IntersectionObserver = original;
    },
    fire: (entries: Array<{ id: string; isIntersecting: boolean }>) => {
      act(() => {
        callback?.(
          entries.map(
            (e) =>
              ({
                target: document.getElementById(e.id),
                isIntersecting: e.isIntersecting,
              }) as unknown as IntersectionObserverEntry
          ),
          {} as IntersectionObserver
        );
      });
    },
  };
}

describe('TocRail', () => {
  it('lists only h2/h3 headings, excluding the article h1', () => {
    renderWithHeadingsInDom(HEADINGS);
    expect(screen.queryByRole('link', { name: 'Databases' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'A subsection' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Choosing' })).toBeInTheDocument();
  });

  it('links each entry to its heading-anchor id', () => {
    renderWithHeadingsInDom(HEADINGS);
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '#overview');
  });

  it('renders nothing (no empty aside shell) when the article has no h2/h3 outline', () => {
    const { container } = renderWithHeadingsInDom([{ depth: 1, text: 'Only Title', id: 'only-title' }]);
    expect(container.querySelector('aside')).toBeNull();
  });

  it('marks no entry active before any heading has intersected the viewport', () => {
    renderWithHeadingsInDom(HEADINGS);
    expect(document.querySelector('.toc-link.is-active')).toBeNull();
    expect(document.querySelector("a[aria-current='location']")).toBeNull();
  });

  describe('responsive open/collapsed state', () => {
    afterEach(() => {
      // each test below installs its own matchMedia mock and must restore it
    });

    it('forces the outline open at >= 1280px regardless of the static default', () => {
      const mm = mockMatchMedia(true);
      try {
        renderWithHeadingsInDom(HEADINGS);
        const details = document.querySelector('details.toc-rail-details');
        expect(details?.hasAttribute('open')).toBe(true);
      } finally {
        mm.restore();
      }
    });

    it('defaults the outline collapsed below 1280px — the summary is still the click target to reopen it', () => {
      const mm = mockMatchMedia(false);
      try {
        renderWithHeadingsInDom(HEADINGS);
        const details = document.querySelector('details.toc-rail-details');
        expect(details?.hasAttribute('open')).toBe(false);
        expect(screen.getByText('On this page').tagName).toBe('SUMMARY');
      } finally {
        mm.restore();
      }
    });

    it('forces back open when a resize crosses back above 1280px (the unreachable-rail bug)', () => {
      const mm = mockMatchMedia(false);
      try {
        renderWithHeadingsInDom(HEADINGS);
        expect(document.querySelector('details.toc-rail-details')?.hasAttribute('open')).toBe(false);

        mm.setMatches(true);
        expect(document.querySelector('details.toc-rail-details')?.hasAttribute('open')).toBe(true);
      } finally {
        mm.restore();
      }
    });
  });

  describe('scroll-spy', () => {
    it('marks the deeper of two simultaneously-intersecting headings active', () => {
      const io = mockIntersectionObserver();
      try {
        renderWithHeadingsInDom(HEADINGS);
        io.fire([
          { id: 'overview', isIntersecting: true },
          { id: 'choosing', isIntersecting: true },
        ]);
        expect(document.querySelector("a[href='#choosing']")).toHaveAttribute('aria-current', 'location');
        expect(document.querySelector("a[href='#overview']")).not.toHaveAttribute('aria-current');
      } finally {
        io.restore();
      }
    });

    // Surviving-mutant kill: the pre-fix code unconditionally called
    // `setActiveId(active ? active.id : null)`, blanking the highlight the
    // moment the intersecting set went empty — true for any section taller
    // than the viewport, mid-scroll. The fix keeps the last heading that
    // passed active until a new one intersects.
    it('keeps the last-passed heading active when the intersecting set goes empty', () => {
      const io = mockIntersectionObserver();
      try {
        renderWithHeadingsInDom(HEADINGS);
        io.fire([{ id: 'choosing', isIntersecting: true }]);
        expect(document.querySelector("a[href='#choosing']")).toHaveAttribute('aria-current', 'location');

        io.fire([{ id: 'choosing', isIntersecting: false }]);
        expect(document.querySelector("a[href='#choosing']")).toHaveAttribute('aria-current', 'location');
      } finally {
        io.restore();
      }
    });
  });
});
