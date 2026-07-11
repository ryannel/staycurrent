import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

/** The `.topic-disclosure` whose title text matches `title` exactly. */
function getTopicDisclosure(title: string): HTMLElement {
  const disclosures = Array.from(document.querySelectorAll<HTMLElement>('.topic-disclosure'));
  const match = disclosures.find((el) => el.querySelector('.topic-title')?.textContent === title);
  if (!match) throw new Error(`no topic disclosure found for "${title}"`);
  return match;
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

  it("marks the current page's Changelog face aria-current=page and auto-opens that topic's disclosure", () => {
    usePathnameMock.mockReturnValue('/databases/changelog/');
    renderSidebar(TOPICS);

    const active = getTopicDisclosure('Databases');
    expect(active).toHaveAttribute('open');
    const changelogLink = within(active).getByRole('link', { name: 'Changelog' });
    expect(changelogLink).toHaveAttribute('aria-current', 'page');
    // The other faces on the SAME topic stay unmarked.
    expect(within(active).getByRole('link', { name: 'Article' })).not.toHaveAttribute('aria-current');
    expect(within(active).getByRole('link', { name: 'History' })).not.toHaveAttribute('aria-current');
    expect(within(active).getByRole('link', { name: 'Skill' })).not.toHaveAttribute('aria-current');

    // The inactive topic's disclosure stays closed.
    expect(getTopicDisclosure('Testing')).not.toHaveAttribute('open');
  });

  it("marks the current page's History face aria-current=page and auto-opens that topic's disclosure", () => {
    usePathnameMock.mockReturnValue('/databases/history/');
    renderSidebar(TOPICS);

    const active = getTopicDisclosure('Databases');
    expect(active).toHaveAttribute('open');
    expect(within(active).getByRole('link', { name: 'History' })).toHaveAttribute('aria-current', 'page');
  });

  it("marks the current page's Skill face aria-current=page and auto-opens that topic's disclosure", () => {
    usePathnameMock.mockReturnValue('/databases/skill/');
    renderSidebar(TOPICS);

    const active = getTopicDisclosure('Databases');
    expect(active).toHaveAttribute('open');
    expect(within(active).getByRole('link', { name: 'Skill' })).toHaveAttribute('aria-current', 'page');
  });

  it('marks the site-wide Changelog page active and leaves About and every topic disclosure closed', () => {
    usePathnameMock.mockReturnValue('/changelog/');
    renderSidebar(TOPICS);

    // The site-pages "Changelog" link (site-wide) vs. each topic's own
    // per-topic "Changelog" face link — scope to `.site-pages` so this can
    // only match the former.
    const sitePages = document.querySelector('.site-pages') as HTMLElement;
    expect(within(sitePages).getByRole('link', { name: 'Changelog' })).toHaveAttribute('aria-current', 'page');
    expect(within(sitePages).getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');

    expect(getTopicDisclosure('Databases')).not.toHaveAttribute('open');
    expect(getTopicDisclosure('Testing')).not.toHaveAttribute('open');
  });

  it('marks the site-wide About page active', () => {
    usePathnameMock.mockReturnValue('/about/');
    renderSidebar(TOPICS);

    const sitePages = document.querySelector('.site-pages') as HTMLElement;
    expect(within(sitePages).getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
    expect(within(sitePages).getByRole('link', { name: 'Changelog' })).not.toHaveAttribute('aria-current');
  });

  it('leaves every topic disclosure closed on load when no face is active', () => {
    usePathnameMock.mockReturnValue('/');
    renderSidebar(TOPICS);

    expect(getTopicDisclosure('Databases')).not.toHaveAttribute('open');
    expect(getTopicDisclosure('Testing')).not.toHaveAttribute('open');
  });
});
