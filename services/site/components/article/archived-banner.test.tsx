import { describe, expect, it, afterEach } from 'vitest';
import { act, render, screen, cleanup } from '@testing-library/react';
import { ArchivedBanner } from './archived-banner';

const DEFAULT_INNER_HEIGHT = window.innerHeight;

afterEach(() => {
  cleanup();
  window.scrollY = 0;
  window.innerHeight = DEFAULT_INNER_HEIGHT;
});

describe('ArchivedBanner', () => {
  it('renders the expanded honesty sentence naming the archived and current versions, with a Read current link', () => {
    render(
      <ArchivedBanner
        version={3}
        cutDate="2026-01-14"
        currentVersion={5}
        currentCutDate="2026-06-12"
        articleHref="/databases/"
      />
    );

    expect(screen.getByText(/You're reading/)).toBeInTheDocument();
    expect(screen.getByText('v3')).toBeInTheDocument();
    expect(screen.getByText('v5')).toBeInTheDocument();
    // next/link outside a real Next.js router context doesn't apply the
    // app's `trailingSlash: true` config to the rendered href — see
    // topic-library.test.tsx's identical note.
    const link = screen.getByRole('link', { name: /Read current/ });
    expect(link.getAttribute('href')).toContain('/databases');
  });

  it('condenses to a single-line link once the reader scrolls past the first viewport', () => {
    render(
      <ArchivedBanner
        version={3}
        cutDate="2026-01-14"
        currentVersion={5}
        currentCutDate="2026-06-12"
        articleHref="/databases/"
      />
    );

    expect(screen.getByText(/You're reading/)).toBeInTheDocument();

    act(() => {
      window.scrollY = window.innerHeight + 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.queryByText(/You're reading/)).not.toBeInTheDocument();
    const condensedLink = screen.getByRole('link', { name: /v3 · current is v5/ });
    expect(condensedLink.getAttribute('href')).toContain('/databases');
  });

  // The threshold compares scrollY against innerHeight — a resize can flip
  // that comparison on its own, with no scroll event firing (e.g. the
  // reader's viewport shrinking while already scrolled down).
  it('condenses on a resize alone, with no new scroll event', () => {
    window.scrollY = 900;
    window.innerHeight = 1000; // starts expanded: scrollY (900) <= innerHeight (1000)
    render(
      <ArchivedBanner
        version={3}
        cutDate="2026-01-14"
        currentVersion={5}
        currentCutDate="2026-06-12"
        articleHref="/databases/"
      />
    );
    expect(screen.getByText(/You're reading/)).toBeInTheDocument();

    act(() => {
      window.innerHeight = 800; // shrinks below the unchanged scrollY (900)
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.queryByText(/You're reading/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /v3 · current is v5/ })).toBeInTheDocument();
  });
});
