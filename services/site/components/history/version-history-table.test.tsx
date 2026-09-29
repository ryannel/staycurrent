import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VersionHistoryTable } from './version-history-table';
import type { VersionHistoryEntry } from '@/lib/content';

const MULTI_VERSION_ROWS: VersionHistoryEntry[] = [
  { version: 2, cutDate: '2026-06-12', stance: 'bent' },
  { version: 1, cutDate: '2026-01-01', stance: null },
];

describe('VersionHistoryTable', () => {
  it("renders the current row's chip as .badge, labelled current, linking to /[topic]/v/[n]/", () => {
    render(<VersionHistoryTable slug="databases" currentVersion={2} rows={MULTI_VERSION_ROWS} />);

    const currentChip = screen.getByRole('link', { name: 'v2' });
    expect(currentChip).toHaveClass('badge');
    expect(currentChip).not.toHaveClass('badge-superseded');
    expect(currentChip.getAttribute('href')).toContain('/databases/v/2');

    const row = currentChip.closest('tr')!;
    expect(row.textContent).toContain('current');
  });

  it('renders a superseded row as .badge-superseded, labelled archived, linking to its /[topic]/v/[n]/ snapshot', () => {
    render(<VersionHistoryTable slug="databases" currentVersion={2} rows={MULTI_VERSION_ROWS} />);

    const supersededChip = screen.getByRole('link', { name: 'v1' });
    expect(supersededChip).toHaveClass('badge-superseded');
    expect(supersededChip.getAttribute('href')).toContain('/databases/v/1');

    const row = supersededChip.closest('tr')!;
    expect(row.textContent).toContain('archived');
  });

  it('renders exactly three columns — Version, Cut, Stance — and one link per row (the version chip)', () => {
    render(<VersionHistoryTable slug="databases" currentVersion={2} rows={MULTI_VERSION_ROWS} />);

    const headers = screen.getAllByRole('columnheader').map((th) => th.textContent);
    expect(headers).toEqual(['Version', 'Cut', 'Stance']);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('renders the stance value for a bent/held/reversed row and a dash for the founding v1 row (no predecessor)', () => {
    render(<VersionHistoryTable slug="databases" currentVersion={2} rows={MULTI_VERSION_ROWS} />);

    const rows = screen.getAllByRole('row').slice(1); // drop the header row
    expect(rows[0].textContent).toContain('bent');
    expect(rows[1].textContent).toContain('—');
  });

  it('renders every row\'s chip as a stretched row-link (design: "click a version chip or its row -> navigates")', () => {
    render(<VersionHistoryTable slug="databases" currentVersion={2} rows={MULTI_VERSION_ROWS} />);

    // doc-shell.css's `.version-history-row-link::after` is what actually
    // stretches the hit target across the row (position: absolute against
    // the row's own position: relative) — this pins the hook the CSS keys
    // off, on both the current and superseded chip.
    expect(screen.getByRole('link', { name: 'v2' })).toHaveClass('version-history-row-link');
    expect(screen.getByRole('link', { name: 'v1' })).toHaveClass('version-history-row-link');
  });

  it('wraps the table in a horizontally-scrollable, keyboard-focusable region (Tables spec, mobile overflow)', () => {
    render(<VersionHistoryTable slug="databases" currentVersion={2} rows={MULTI_VERSION_ROWS} />);

    const scrollRegion = document.querySelector('.version-history-scroll') as HTMLElement;
    expect(scrollRegion).not.toBeNull();
    expect(scrollRegion).toHaveAttribute('tabindex', '0');
    expect(scrollRegion).toHaveAttribute('role', 'region');
    expect(scrollRegion).toHaveAttribute('aria-label');
    expect(scrollRegion.querySelector('table.version-history-table')).not.toBeNull();
  });

  it('renders a single row for a single-version topic, marked current with a dash stance', () => {
    render(
      <VersionHistoryTable
        slug="databases"
        currentVersion={1}
        rows={[{ version: 1, cutDate: '2026-07-09', stance: null }]}
      />
    );

    expect(screen.getAllByRole('row')).toHaveLength(2); // header + one data row
    const chip = screen.getByRole('link', { name: 'v1' });
    expect(chip).toHaveClass('badge');
    expect(chip.closest('tr')!.textContent).toContain('—');
  });
});
