import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VersionHistoryTable } from './version-history-table';
import type { VersionHistoryEntry } from '@/lib/content';

const MULTI_VERSION_ROWS: VersionHistoryEntry[] = [
  { version: 2, cutDate: '2026-06-12', stance: 'bent' },
  { version: 1, cutDate: '2026-01-01', stance: null },
];

describe('VersionHistoryTable', () => {
  it("renders the current row's chip as .badge, labelled current, linking skill straight to /[topic]/skill/", () => {
    render(<VersionHistoryTable slug="databases" currentVersion={2} rows={MULTI_VERSION_ROWS} />);

    const currentChip = screen.getByRole('link', { name: 'v2' });
    expect(currentChip).toHaveClass('badge');
    expect(currentChip).not.toHaveClass('badge-superseded');
    expect(currentChip.getAttribute('href')).toContain('/databases/v/2');

    const row = currentChip.closest('tr')!;
    expect(row.textContent).toContain('current');

    const skillLink = screen.getByRole('link', { name: 'skill →' });
    expect(skillLink.getAttribute('href')).toContain('/databases/skill');
  });

  it('renders a superseded row as .badge-superseded, labelled archived, with the honesty-copy skill link and the archived-payload link', () => {
    render(<VersionHistoryTable slug="databases" currentVersion={2} rows={MULTI_VERSION_ROWS} />);

    const supersededChip = screen.getByRole('link', { name: 'v1' });
    expect(supersededChip).toHaveClass('badge-superseded');

    const row = supersededChip.closest('tr')!;
    expect(row.textContent).toContain('archived');
    expect(row.textContent).toContain('renders v1');
    expect(row.textContent).toContain('install current');

    const archivedLink = screen.getByRole('link', { name: /archived payload/ });
    expect(archivedLink.getAttribute('href')).toBe('/skills/databases/v/1/');
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
