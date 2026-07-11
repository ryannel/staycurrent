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
 * Unwraps every `<a>` the entry's rendered prose carries into a plain
 * `<span>` — at the same cross-topic merge surface `stripHeadingIds` already
 * transforms. `-webkit-line-clamp` (the card body's 4-line clamp) only hides
 * overflow VISUALLY, so a link that falls past the clamp would otherwise
 * stay keyboard-focusable while invisible — the fix here is NOT marking the
 * whole preview `inert` (that pulled the entire prose, link or not, out of
 * the accessibility tree, when "Read entry →" below is this feed's only
 * DESIGNED interaction on a card): only the interactive affordance itself is
 * neutralized, so the surrounding prose stays exposed to assistive tech.
 */
function neutralizeLinks(html: string): string {
  return html.replace(/<a\b[^>]*>/gi, '<span>').replace(/<\/a>/gi, '</span>');
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
          {/* The clamped preview's own links are neutralized (see
              `neutralizeLinks` above), not the whole preview marked `inert` —
              "Read entry →" below is the sole DESIGNED navigation action for
              a card, but the prose itself must stay exposed to assistive
              tech, which a blanket `inert` would also have removed. */}
          <div
            className="changelog-card-body"
            dangerouslySetInnerHTML={{ __html: neutralizeLinks(stripHeadingIds(entry.bodyHtml)) }}
          />
          <Link href={`/${entry.topicSlug}/changelog/#v${entry.version}`} className="changelog-card-read-link">
            {'Read entry →'}
          </Link>
        </article>
      ))}
    </div>
  );
}
