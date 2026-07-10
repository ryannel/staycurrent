import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { Sidebar, type TopicNavEntry } from './sidebar';

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(() => '/'),
}));

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}));

const TOPICS: TopicNavEntry[] = [
  { slug: 'databases', title: 'Databases', isFresh: true, cutDate: '2026-07-01' },
  { slug: 'testing', title: 'Testing', isFresh: false, cutDate: '2020-01-01' },
];

function renderSidebar(topics: TopicNavEntry[]) {
  return render(
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="theme">
      <Sidebar topics={topics} />
    </ThemeProvider>
  );
}

beforeEach(() => {
  usePathnameMock.mockReturnValue('/');
});

describe('Sidebar', () => {
  it('renders a topic-tree entry per topic, each disclosing its four faces', () => {
    renderSidebar(TOPICS);
    expect(screen.getByText('Databases')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();

    const articleLinks = screen.getAllByRole('link', { name: 'Article' });
    expect(articleLinks).toHaveLength(2);
    // next/link outside a real Next.js router context (as here) doesn't apply
    // the app's `trailingSlash: true` config to the rendered href — the exact
    // trailing-slash form is verified against the real served app by the
    // Playwright interface test instead; this only pins the target topic.
    expect(articleLinks[0].getAttribute('href')).toContain('/databases');
  });

  it('shows the freshness dot only for a topic within the freshness window', () => {
    renderSidebar(TOPICS);
    const dots = screen.getAllByRole('img', { name: 'fresh' });
    expect(dots).toHaveLength(1);
  });

  it('renders the designed empty state (no dead nav) when there are zero topics', () => {
    renderSidebar([]);
    expect(screen.getByText('No topics yet.')).toBeInTheDocument();
  });

  it('renders exactly one primary nav landmark', () => {
    renderSidebar(TOPICS);
    expect(screen.getAllByRole('navigation', { name: 'Primary' })).toHaveLength(1);
  });

  it('the mobile menu toggle starts closed with an accessible expanded state', () => {
    renderSidebar(TOPICS);
    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the drawer (expanded state + backdrop) when the toggle is clicked', () => {
    renderSidebar(TOPICS);
    const toggle = screen.getByRole('button', { name: /open menu/i });

    fireEvent.click(toggle);

    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
    expect(document.querySelector('.drawer-backdrop')).not.toBeNull();
    expect(document.querySelector('nav.sidebar.is-open')).not.toBeNull();
  });

  it('closes the drawer on Escape', () => {
    renderSidebar(TOPICS);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    expect(document.querySelector('nav.sidebar.is-open')).not.toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(document.querySelector('nav.sidebar.is-open')).toBeNull();
    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the drawer on a backdrop click', () => {
    renderSidebar(TOPICS);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    const backdrop = document.querySelector('.drawer-backdrop');
    expect(backdrop).not.toBeNull();

    fireEvent.click(backdrop as Element);

    expect(document.querySelector('nav.sidebar.is-open')).toBeNull();
    expect(document.querySelector('.drawer-backdrop')).toBeNull();
  });

  it("marks the current page's Article entry aria-current=page and no other entry", () => {
    usePathnameMock.mockReturnValue('/databases/');
    renderSidebar(TOPICS);

    const articleLinks = screen.getAllByRole('link', { name: 'Article' });
    const current = articleLinks.filter((link) => link.getAttribute('aria-current') === 'page');
    expect(current).toHaveLength(1);
    expect(current[0].getAttribute('href')).toContain('/databases');
  });

  it('marks no entry active when the current path matches no topic', () => {
    usePathnameMock.mockReturnValue('/');
    renderSidebar(TOPICS);

    const articleLinks = screen.getAllByRole('link', { name: 'Article' });
    expect(articleLinks.every((link) => link.getAttribute('aria-current') !== 'page')).toBe(true);
  });
});
