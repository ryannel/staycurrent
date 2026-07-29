// Slice 2.1 (site: grouped navigation, hub rollup band, reading-order rail) —
// bet-progress test. Traces to the three views in
// docs/bets/databases-catalogue/technical-design/01-ui-design.md ("Topic
// Library and Sidebar — Databases-Area Grouping", "The /databases Hub —
// Chooser and Map", "Foundation Reading-Order and Prereqs"). Proves the
// slice's Required Capabilities: the grouped sidebar/library DOM (including
// the ungrouped-topic passthrough and empty-register absence), and both
// instruments' render conditions — component tests against hand-built props,
// mirroring sidebar.test.tsx/topic-library.test.tsx's own idiom (this bet's
// only surface has no HTTP boundary — 03-api-design.md's header note). The
// accessors these views render from (`getCatalogues`, `getReadingPosition`,
// `summarizeCatalogueFreshness`) are already proven in isolation by Slice
// 1.2's test_slice_1_site_catalogue_accessors.ts — this file proves only
// what THIS slice adds: the rendering.

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import {
  Sidebar,
  type SidebarCatalogue,
  type TopicNavEntry,
} from '../../../services/site/components/shell/sidebar';
import {
  TopicLibrary,
  type LibraryCatalogue,
} from '../../../services/site/components/library/topic-library';
import { CatalogueFreshnessRollup } from '../../../services/site/components/article/catalogue-freshness-rollup';
import {
  ReadingOrderRailFooter,
  ReadingOrderRailHeader,
} from '../../../services/site/components/article/reading-order-rail';
import type { CatalogueFreshness } from '../../../services/site/lib/freshness';
import type { ReadingPosition } from '../../../services/site/lib/content';

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(() => '/'),
}));

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}));

beforeEach(() => {
  usePathnameMock.mockReturnValue('/');
});

function renderSidebar(topics: TopicNavEntry[], catalogues?: SidebarCatalogue[]) {
  return render(
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="theme">
      <Sidebar topics={topics} catalogues={catalogues} />
    </ThemeProvider>
  );
}

const SIDEBAR_CATALOGUE: SidebarCatalogue = {
  area: 'databases',
  hub: { slug: 'databases', title: 'Databases', isFresh: true, cutDate: '2026-07-20' },
  movements: [
    {
      name: 'Single Node',
      entries: [
        { slug: 'data-models', title: 'Data Models', isFresh: false, cutDate: '2026-01-01' },
        { slug: 'storage-engines', title: 'Storage Engines', isFresh: false, cutDate: '2026-01-01' },
      ],
    },
    {
      name: 'Distributed',
      entries: [{ slug: 'replication', title: 'Replication', isFresh: true, cutDate: '2026-07-25' }],
    },
  ],
  profiles: [
    { slug: 'relational', title: 'Relational', isFresh: false, cutDate: '2026-01-01', core: true },
    { slug: 'document', title: 'Document', isFresh: false, cutDate: '2026-01-01' },
  ],
};

describe('Sidebar — grouped catalogue tree', () => {
  it('renders the area label, hub entry, register groups (trailing counts), movement dividers, and core badges', () => {
    renderSidebar([], [SIDEBAR_CATALOGUE]);

    // The area label — the catalogue's own `area` string, not a hardcoded
    // "Topics" (01-ui-design.md: "was 'Topics'; the area label").
    expect(screen.getByText('databases')).toBeInTheDocument();

    // The hub, an ordinary topic-tree entry.
    expect(screen.getByText('Databases')).toBeInTheDocument();

    // Register-Group Disclosures with trailing mono counts.
    expect(screen.getByText('Foundations')).toBeInTheDocument();
    expect(screen.getByText('(3)')).toBeInTheDocument(); // 2 Single Node + 1 Distributed
    expect(screen.getByText('Profiles')).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();

    // Movement dividers, sidebar-only — non-interactive (no separate assertion
    // needed for that: they're plain <li> text, not a link/button), but NOT
    // hidden from assistive tech. `getByText` alone wouldn't catch a stray
    // `aria-hidden="true"` (it matches text content regardless of ARIA), so
    // assert its absence explicitly.
    const singleNodeDivider = screen.getByText('Single Node');
    expect(singleNodeDivider).toBeInTheDocument();
    expect(singleNodeDivider).not.toHaveAttribute('aria-hidden');
    const distributedDivider = screen.getByText('Distributed');
    expect(distributedDivider).toBeInTheDocument();
    expect(distributedDivider).not.toHaveAttribute('aria-hidden');

    // Every foundation/profile entry itself still renders as a real topic
    // disclosure.
    expect(screen.getByText('Data Models')).toBeInTheDocument();
    expect(screen.getByText('Storage Engines')).toBeInTheDocument();
    expect(screen.getByText('Replication')).toBeInTheDocument();
    expect(screen.getByText('Relational')).toBeInTheDocument();
    expect(screen.getByText('Document')).toBeInTheDocument();

    // `[core]` marks only the featured profile, never a bare glyph.
    const coreBadges = screen.getAllByText('core');
    expect(coreBadges).toHaveLength(1);

    // The plain "Topics" label doesn't render when nothing is left over.
    expect(screen.queryByText('Topics')).not.toBeInTheDocument();
  });

  it('renders topics outside any catalogue exactly as today, alongside a catalogue', () => {
    const leftover: TopicNavEntry[] = [{ slug: 'testing', title: 'Testing', isFresh: false, cutDate: '2020-01-01' }];
    renderSidebar(leftover, [SIDEBAR_CATALOGUE]);

    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
    // The leftover topic still gets its own four-face disclosure — unchanged.
    const testingLinks = within(screen.getByText('Testing').closest('details') as HTMLElement).getAllByRole('link');
    expect(testingLinks.map((l) => l.textContent)).toEqual(['Article', 'Changelog', 'History', 'Skill']);
  });

  it('an empty register group renders nothing — no "Profiles (0)" placeholder', () => {
    const noProfiles: SidebarCatalogue = { ...SIDEBAR_CATALOGUE, profiles: [] };
    renderSidebar([], [noProfiles]);

    expect(screen.getByText('Foundations')).toBeInTheDocument();
    expect(screen.queryByText('Profiles')).not.toBeInTheDocument();
  });

  it('a catalogue with only a hub renders the hub alone, no register groups', () => {
    const hubOnly: SidebarCatalogue = { area: 'databases', hub: SIDEBAR_CATALOGUE.hub, movements: [], profiles: [] };
    renderSidebar([], [hubOnly]);

    expect(screen.getByText('Databases')).toBeInTheDocument();
    expect(screen.queryByText('Foundations')).not.toBeInTheDocument();
    expect(screen.queryByText('Profiles')).not.toBeInTheDocument();
    expect(document.querySelector('.register-group-disclosure')).toBeNull();
  });

  it('falls back to the flat, unchanged rendering when no catalogues are supplied (default prop)', () => {
    const flat: TopicNavEntry[] = [{ slug: 'databases', title: 'Databases', isFresh: true, cutDate: '2026-07-01' }];
    renderSidebar(flat);

    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Databases')).toBeInTheDocument();
    expect(document.querySelector('.register-group-disclosure')).toBeNull();
  });

  it('re-asserts a collapsed register group open when the reader navigates to a page inside it', () => {
    const { rerender } = renderSidebar([], [SIDEBAR_CATALOGUE]);

    const foundationsDetails = screen.getByText('Foundations').closest('details') as HTMLDetailsElement;
    expect(foundationsDetails).toHaveAttribute('open'); // open by default, first load

    // The reader manually collapses the group (native <details> toggle —
    // simulated by flipping the DOM property and firing the non-bubbling
    // `toggle` event our `onToggle` handler listens for, exactly as the
    // browser would on a real click).
    foundationsDetails.open = false;
    fireEvent(foundationsDetails, new Event('toggle', { bubbles: true }));
    expect(foundationsDetails).not.toHaveAttribute('open');

    // The reader navigates to a page inside the now-collapsed Foundations
    // group — it must force back open, not leave the topic auto-opening
    // invisibly inside a collapsed group (Key interactions: "that group is
    // force-open on load regardless of its last toggled state").
    usePathnameMock.mockReturnValue('/data-models/');
    rerender(
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="theme">
        <Sidebar topics={[]} catalogues={[SIDEBAR_CATALOGUE]} />
      </ThemeProvider>
    );

    expect(foundationsDetails).toHaveAttribute('open');
  });

  it('leaves an inactive collapsed register group collapsed across an unrelated navigation', () => {
    const { rerender } = renderSidebar([], [SIDEBAR_CATALOGUE]);

    const profilesDetails = screen.getByText('Profiles').closest('details') as HTMLDetailsElement;
    profilesDetails.open = false;
    fireEvent(profilesDetails, new Event('toggle', { bubbles: true }));
    expect(profilesDetails).not.toHaveAttribute('open');

    // Navigating to a page OUTSIDE this group (Foundations, not Profiles)
    // must not force Profiles back open — only a navigation INTO the
    // specific group re-asserts it.
    usePathnameMock.mockReturnValue('/data-models/');
    rerender(
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="theme">
        <Sidebar topics={[]} catalogues={[SIDEBAR_CATALOGUE]} />
      </ThemeProvider>
    );

    expect(profilesDetails).not.toHaveAttribute('open');
  });
});

const LIBRARY_CATALOGUE: LibraryCatalogue = {
  area: 'databases',
  hub: { slug: 'databases', title: 'Databases', stance: 'Name your access pattern.', version: 6, lastResearched: '2026-07-14' },
  foundations: [
    { slug: 'capacity-planning', title: 'Capacity Planning', stance: 'Stance A.', version: 2, lastResearched: '2026-07-10' },
    { slug: 'data-models', title: 'Data Models', stance: 'Stance B.', version: 1, lastResearched: '2026-07-09' },
  ],
  profiles: [
    { slug: 'relational', title: 'Relational', stance: 'Stance C.', version: 1, lastResearched: '2026-07-11', core: true },
    { slug: 'document', title: 'Document', stance: 'Stance D.', version: 1, lastResearched: '2026-07-12' },
  ],
};

describe('TopicLibrary — grouped catalogue grid', () => {
  it('renders the area heading, a standalone hub card, register-labelled grids in reading order, and core badges', () => {
    render(<TopicLibrary cards={[]} catalogues={[LIBRARY_CATALOGUE]} />);

    // --text-h2 area heading — the page's first-ever heading.
    expect(screen.getByRole('heading', { level: 2, name: 'Databases' })).toBeInTheDocument();

    // The hub renders as its own standalone card (h3, same as any card).
    expect(screen.getByRole('heading', { level: 3, name: 'Databases' })).toBeInTheDocument();

    // Register labels.
    expect(screen.getByText('Foundations')).toBeInTheDocument();
    expect(screen.getByText('Profiles')).toBeInTheDocument();

    // Foundations render in reading order — un-sub-grouped by movement (no
    // movement-name text anywhere in this grid).
    const h3s = screen.getAllByRole('heading', { level: 3 });
    const titles = h3s.map((h) => h.textContent);
    expect(titles.indexOf('Capacity Planning')).toBeLessThan(titles.indexOf('Data Models'));
    expect(screen.queryByText('Single Node')).not.toBeInTheDocument();

    // Core badge marks only the featured profile.
    expect(screen.getAllByText('core')).toHaveLength(1);
  });

  it('renders leftover ungrouped cards below the catalogues, in the plain unheaded grid', () => {
    const leftover = [{ slug: 'testing', title: 'Testing', stance: 'x', version: 1, lastResearched: '2026-01-01' }];
    render(<TopicLibrary cards={leftover} catalogues={[LIBRARY_CATALOGUE]} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Testing' })).toBeInTheDocument();
  });

  it('an empty register group renders no grid section — no empty "Foundations" block', () => {
    const noFoundations: LibraryCatalogue = { ...LIBRARY_CATALOGUE, foundations: [] };
    render(<TopicLibrary cards={[]} catalogues={[noFoundations]} />);

    expect(screen.queryByText('Foundations')).not.toBeInTheDocument();
    expect(screen.getByText('Profiles')).toBeInTheDocument();
  });

  it('does not fall back to the first-run empty state when catalogues carry content but cards is empty', () => {
    render(<TopicLibrary cards={[]} catalogues={[LIBRARY_CATALOGUE]} />);
    expect(screen.queryByText('No topics yet.', { exact: false })).not.toBeInTheDocument();
  });

  it('stays the true first-run empty state when both cards and catalogues are empty', () => {
    render(<TopicLibrary cards={[]} catalogues={[]} />);
    expect(screen.getByText('No topics yet.', { exact: false })).toBeInTheDocument();
  });
});

describe('CatalogueFreshnessRollup — hub instrumentation strip', () => {
  it('renders the live aggregate line and a link to the most-recently-cut topic', () => {
    const freshness: CatalogueFreshness = {
      totalCount: 25,
      freshCount: 6,
      mostRecentlyCut: { slug: 'partitioning', title: 'Partitioning', cutDate: '2026-07-16' },
    };
    render(<CatalogueFreshnessRollup freshness={freshness} />);

    expect(screen.getByText(/25 pieces/)).toBeInTheDocument();
    expect(screen.getByText(/6 fresh/)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Partitioning' });
    expect(link.getAttribute('href')).toContain('/partitioning');
  });

  it('states the true live count with no dangling "most recently cut" link when the area is empty', () => {
    const freshness: CatalogueFreshness = { totalCount: 0, freshCount: 0, mostRecentlyCut: null };
    render(<CatalogueFreshnessRollup freshness={freshness} />);

    expect(screen.getByText(/0 pieces/)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

describe('ReadingOrderRailHeader — foundation position + prereqs', () => {
  const MID_SEQUENCE_POSITION: ReadingPosition = {
    movement: 'Single Node',
    indexInPath: 5,
    totalInPath: 17,
    indexInMovement: 4,
    totalInMovement: 5,
    prereqs: [
      { slug: 'data-models', title: 'Data Models' },
      { slug: 'storage-engines', title: 'Storage Engines' },
    ],
    next: { slug: 'query-execution', title: 'Query Execution' },
  };

  it('renders the movement/position line and a "Read first" line naming every prereq as a real link', () => {
    render(<ReadingOrderRailHeader position={MID_SEQUENCE_POSITION} />);

    expect(screen.getByRole('navigation', { name: 'Reading path position' })).toBeInTheDocument();
    expect(screen.getByText(/Single Node/)).toBeInTheDocument();
    expect(screen.getByText(/piece 5 of 17/)).toBeInTheDocument();
    expect(screen.getByText(/4th of 5 in this movement/)).toBeInTheDocument();

    const dataModelsLink = screen.getByRole('link', { name: 'Data Models' });
    expect(dataModelsLink.getAttribute('href')).toContain('/data-models');
    const storageLink = screen.getByRole('link', { name: 'Storage Engines' });
    expect(storageLink.getAttribute('href')).toContain('/storage-engines');
  });

  it('omits the "Read first" line entirely on the first piece — never a "no prerequisites" placeholder', () => {
    const firstPiece: ReadingPosition = {
      movement: 'Capacity',
      indexInPath: 1,
      totalInPath: 17,
      indexInMovement: 1,
      totalInMovement: 1,
      prereqs: [],
      next: { slug: 'data-models', title: 'Data Models' },
    };
    render(<ReadingOrderRailHeader position={firstPiece} />);

    expect(screen.getByText(/piece 1 of 17/)).toBeInTheDocument();
    expect(screen.queryByText(/Read first/)).not.toBeInTheDocument();
  });
});

describe('ReadingOrderRailFooter — the Continue pointer', () => {
  it('is its own "Continue reading" landmark, distinct from the header\'s "Reading path position"', () => {
    render(<ReadingOrderRailFooter next={{ slug: 'query-execution', title: 'Query Execution' }} hubHref="/databases/" />);

    expect(screen.getByRole('navigation', { name: 'Continue reading' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Reading path position' })).not.toBeInTheDocument();
  });

  it('points at the next piece in reading order, mid-sequence', () => {
    render(<ReadingOrderRailFooter next={{ slug: 'query-execution', title: 'Query Execution' }} hubHref="/databases/" />);

    const link = screen.getByRole('link', { name: /Continue: Query Execution/ });
    expect(link.getAttribute('href')).toContain('/query-execution');
  });

  it('redirects to the hub rather than disappearing on the last piece (next is null)', () => {
    render(<ReadingOrderRailFooter next={null} hubHref="/databases/" />);

    const link = screen.getByRole('link', { name: /back to the chooser and map/ });
    expect(link.getAttribute('href')).toContain('/databases');
  });
});
