import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteChangelog } from './site-changelog';
import type { SiteChangelogEntry } from '@/lib/content';

const ENTRIES: SiteChangelogEntry[] = [
  {
    topicSlug: 'databases',
    topicTitle: 'Databases',
    version: 1,
    date: '2026-07-09',
    bodyHtml: '<p>The founding note.</p>',
  },
  {
    topicSlug: 'testing',
    topicTitle: 'Testing',
    version: 3,
    date: '2026-06-28',
    bodyHtml: '<p>What moved: coverage strategy.</p>',
  },
];

describe('SiteChangelog', () => {
  it('renders one card per entry, each labelled with its topic and linking into that topic\'s own changelog', () => {
    render(<SiteChangelog entries={ENTRIES} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Databases' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Testing' })).toBeInTheDocument();
    // Display-formatted, matching the trust header/topic changelog's "v1 —
    // 9 Jul 2026" convention — not the raw ISO date lib/content.ts carries.
    expect(screen.getByText(/databases · v1 · 9 Jul 2026/)).toBeInTheDocument();
    expect(screen.getByText('The founding note.')).toBeInTheDocument();

    // next/link outside a real Next.js router context (as here) doesn't apply
    // the app's `trailingSlash: true` config to the rendered href — see
    // topic-library.test.tsx's identical note; this only pins the target
    // topic + anchor.
    const readLinks = screen.getAllByRole('link', { name: /Read entry/ });
    expect(readLinks).toHaveLength(2);
    expect(readLinks[0].getAttribute('href')).toContain('/databases/changelog');
    expect(readLinks[0].getAttribute('href')).toContain('#v1');
    expect(readLinks[1].getAttribute('href')).toContain('/testing/changelog');
    expect(readLinks[1].getAttribute('href')).toContain('#v3');
  });

  it('preserves the entries newest-first order the caller supplies (no re-sorting in the component)', () => {
    render(<SiteChangelog entries={ENTRIES} />);
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(['Databases', 'Testing']);
  });

  it('renders the designed first-run empty state for zero entries', () => {
    render(<SiteChangelog entries={[]} />);

    expect(
      screen.getByText('No topics yet. The first research run creates one.', { exact: false })
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  // loadChangelog namespaces heading ids by version only (`v{N}-…`), unique
  // on one topic's own changelog page but not across topics splicing into
  // this single feed DOM — two topics sharing a version + heading slug would
  // otherwise emit duplicate ids (invalid HTML, an aria violation).
  it('strips heading ids out of each card body before splicing it into the shared feed DOM', () => {
    render(
      <SiteChangelog
        entries={[
          {
            topicSlug: 'databases',
            topicTitle: 'Databases',
            version: 2,
            date: '2026-06-12',
            bodyHtml: '<h3 id="v2-detail">Detail</h3><p>Body copy.</p>',
          },
        ]}
      />
    );

    expect(document.querySelector('#v2-detail')).toBeNull();
    expect(screen.getByText('Detail')).toBeInTheDocument();
  });

  // `-webkit-line-clamp` only hides overflow visually — a link past the
  // 4-line clamp stays keyboard-focusable unless neutralized. Fix: the whole
  // preview is no longer `inert` (that also pulled the surrounding prose out
  // of the accessibility tree) — only the interactive `<a>`s inside it are
  // unwrapped to plain, non-focusable `<span>`s.
  it('does not mark the clamped card body inert, keeping its prose exposed to assistive tech', () => {
    render(<SiteChangelog entries={ENTRIES} />);

    const bodies = document.querySelectorAll('.changelog-card-body');
    expect(bodies).toHaveLength(ENTRIES.length);
    bodies.forEach((body) => expect(body).not.toHaveAttribute('inert'));
  });

  it("neutralizes the preview's own links (unwrapped, no href, out of the tab order) while its prose stays in the DOM", () => {
    render(
      <SiteChangelog
        entries={[
          {
            topicSlug: 'databases',
            topicTitle: 'Databases',
            version: 2,
            date: '2026-06-12',
            bodyHtml: '<p>See <a href="https://example.com/detail">the detail</a> for more.</p>',
          },
        ]}
      />
    );

    const body = document.querySelector('.changelog-card-body') as HTMLElement;
    expect(body.querySelector('a')).toBeNull();
    expect(body.querySelector('span')).not.toBeNull();
    expect(body.textContent).toContain('the detail');
  });
});
