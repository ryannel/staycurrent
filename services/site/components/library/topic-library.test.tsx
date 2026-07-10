import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicLibrary } from './topic-library';
import type { TopicCard } from '@/lib/content';

const CARDS: TopicCard[] = [
  {
    slug: 'databases',
    title: 'Databases',
    stance: 'Relational is the default; reach for document/kv only when a named access pattern demands it.',
    version: 1,
    lastResearched: '2026-07-09',
  },
  {
    slug: 'testing',
    title: 'Testing',
    stance: 'Test the behaviour, not the implementation.',
    version: 5,
    lastResearched: '2026-06-01',
  },
];

describe('TopicLibrary', () => {
  it('renders one card per topic with title, stance, version badge, and researched date', () => {
    render(<TopicLibrary cards={CARDS} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Databases' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Testing' })).toBeInTheDocument();
    expect(screen.getByText(/Relational is the default/)).toBeInTheDocument();
    expect(screen.getByText('v1')).toBeInTheDocument();
    expect(screen.getByText('v5')).toBeInTheDocument();
    expect(screen.getByText('researched 9 Jul 2026')).toBeInTheDocument();
  });

  it("navigates each card to the topic's article route", () => {
    render(<TopicLibrary cards={CARDS} />);

    // next/link outside a real Next.js router context (as here) doesn't
    // apply the app's `trailingSlash: true` config to the rendered href —
    // see sidebar.test.tsx's identical note; this only pins the target topic.
    const databasesLink = screen.getByRole('link', { name: /Databases/ });
    expect(databasesLink.getAttribute('href')).toContain('/databases');
  });

  it('renders the designed first-run empty state — never a blank grid — for zero topics', () => {
    render(<TopicLibrary cards={[]} />);

    expect(
      screen.getByText('No topics yet. The first research run creates one.', { exact: false })
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Framework docs/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });
});
