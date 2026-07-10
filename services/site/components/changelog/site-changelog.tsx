import Link from 'next/link';
import { formatDisplayDate } from '@/lib/format-date';
import type { SiteChangelogEntry } from '@/lib/content';

export interface SiteChangelogProps {
  entries: SiteChangelogEntry[];
}

/**
 * `loadChangelog` namespaces each entry's generated heading ids by VERSION
 * only (`v{N}-…`), which is unique on a single topic's own changelog page but
 * not across topics: this feed splices every topic's `bodyHtml` into ONE DOM,
 * so two topics that happen to share both a version number and a heading
 * slug (e.g. both ship a "## Detail" under their own `v2`) would otherwise
 * emit duplicate ids — invalid HTML and an aria-* violation for whichever
 * attribute references the id. Stripped here, at the cross-topic merge
 * surface, rather than in `lib/content.ts` or the per-topic changelog page:
 * the per-topic page's ids are genuinely unique there and remain the `#vN`
 * permalink target; this card's only navigation is "Read entry →" below,
 * which never needs an in-page anchor.
 */
function stripHeadingIds(html: string): string {
  return html.replace(/\sid="[^"]*"/g, '');
}

/**
 * `/changelog/` — Site-Wide Changelog (01-ui-design.md). Presentational:
 * `app/changelog/page.tsx` (a Server Component) supplies the merged,
 * newest-first `SiteChangelogEntry[]` via `lib/content.ts`'s
 * `listSiteChangelog` — this component owns only the populated-list /
 * first-run-empty-state rendering choice, kept here (rather than inline in
 * the page) so it is unit-testable the way `TopicLibrary` is.
 *
 * The first-run empty state mirrors `/`'s (Empty and loading states spec) —
 * unreachable while any topic exists (every topic ships a v1 founding
 * changelog entry), but rendered defensively rather than assumed away.
 */
export function SiteChangelog({ entries }: SiteChangelogProps) {
  if (entries.length === 0) {
    return <p className="empty-state">No topics yet. The first research run creates one.</p>;
  }

  return (
    <div className="changelog-page-list">
      {entries.map((entry) => (
        <article key={`${entry.topicSlug}-v${entry.version}`} className="changelog-card">
          <p className="changelog-card-topic-label">{`${entry.topicSlug} · v${entry.version} · ${formatDisplayDate(entry.date)}`}</p>
          <h2 className="changelog-card-heading">{entry.topicTitle}</h2>
          {/* `inert` (React boolean prop, React 19) pulls the whole clamped
              preview out of the tab order: `-webkit-line-clamp` only hides
              overflow visually, so without this a link past the 4-line clamp
              stays keyboard-focusable while invisible. The card's own prose
              links were never this feed's designed interaction anyway — "Read
              entry →" below is the sole navigation action for a card. */}
          <div
            className="changelog-card-body"
            inert
            dangerouslySetInnerHTML={{ __html: stripHeadingIds(entry.bodyHtml) }}
          />
          <Link
            href={`/${entry.topicSlug}/changelog/#v${entry.version}`}
            prefetch={false}
            className="changelog-card-read-link"
          >
            {'Read entry →'}
          </Link>
        </article>
      ))}
    </div>
  );
}
