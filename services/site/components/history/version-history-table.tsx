import Link from 'next/link';
import { formatDisplayDate } from '@/lib/format-date';
import type { VersionHistoryEntry } from '@/lib/content';

export interface VersionHistoryTableProps {
  slug: string;
  currentVersion: number;
  rows: VersionHistoryEntry[];
}

/**
 * `/[topic]/history/` — Version History (01-ui-design.md). Presentational:
 * `app/[topic]/history/page.tsx` (a Server Component) supplies the
 * `VersionHistoryEntry[]` ledger via `lib/content.ts`'s `getVersionHistory` —
 * this component owns only the current-vs-superseded row rendering choice,
 * kept here (rather than inline in the page) so it is unit-testable the way
 * `TopicLibrary` is.
 *
 * The current row's chip still links to `/[topic]/v/[n]/` like every other
 * row (Key interactions, verbatim) — for the current version that route is
 * the redirect stub, which folds straight back to `/[topic]/`, so the click
 * is never a dead end.
 *
 * "Never colour alone" (the freshness dot's rule, applied here too): the
 * `.badge`/`.badge-superseded` accent distinction is paired with an explicit
 * `current`/`archived` text label, not left to colour to carry the state.
 *
 * "Click a version chip or its row → navigates" (Key interactions, verbatim):
 * `.version-history-row-link` is a stretched link — its `::after` (doc-shell.css)
 * is `position: absolute; inset: 0` against the row's own `position: relative`
 * (the base `tbody tr` rule), so the whole row is a mouse hit target while
 * staying a single real `<a>` for keyboard/screen-reader semantics (no extra
 * ARIA role, no click/keydown handler reimplementing what an anchor already
 * does). The skill/archived-payload links elsewhere in the row need to stay
 * independently clickable on top of that overlay — doc-shell.css lifts them
 * with `position: relative; z-index: 2` against the overlay's `z-index: 1`.
 */
export function VersionHistoryTable({ slug, currentVersion, rows }: VersionHistoryTableProps) {
  return (
    <table className="version-history-table">
      <thead>
        <tr>
          <th scope="col">Version</th>
          <th scope="col">Cut</th>
          <th scope="col">Stance</th>
          <th scope="col">Skill</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const isCurrent = row.version === currentVersion;
          const versionHref = `/${slug}/v/${row.version}/`;
          return (
            <tr key={row.version}>
              <td>
                <Link
                  href={versionHref}
                  className={isCurrent ? 'badge version-history-row-link' : 'badge badge-superseded version-history-row-link'}
                >
                  {`v${row.version}`}
                </Link>
                <span className="version-history-state">{isCurrent ? 'current' : 'archived'}</span>
              </td>
              <td className="version-history-cut">
                <time dateTime={row.cutDate}>{formatDisplayDate(row.cutDate)}</time>
              </td>
              <td>{row.stance ?? '—'}</td>
              <td>
                {isCurrent ? (
                  <Link href={`/${slug}/skill/`}>
                    skill →
                  </Link>
                ) : (
                  <span className="version-history-skill-note">
                    {`skill (renders v${row.version} — `}
                    <Link href={`/${slug}/skill/`}>
                      install current →
                    </Link>
                    {') '}
                    <a href={`/skills/${slug}/v/${row.version}/`}>archived payload</a>
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
