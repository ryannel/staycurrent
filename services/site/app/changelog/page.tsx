import type { Metadata } from 'next';
import { listSiteChangelog } from '@/lib/content';
import { SiteChangelog } from '@/components/changelog/site-changelog';
import { ArticleEnhancements } from '@/components/article/enhancements';

export const metadata: Metadata = {
  title: 'Changelog',
};

/**
 * `/changelog/` — Site-Wide Changelog (01-ui-design.md). Every topic's
 * changelog entries merged newest-first via `lib/content.ts`'s
 * `listSiteChangelog` — a cross-topic feed mirroring `rss.xml`'s item set
 * (the RSS feed itself is Milestone 3's distribution work, not this slice).
 *
 * No TOC rail (Shell zone rule) — `no-toc` frees the full reading-column
 * width, matching `/` and `/about/`.
 *
 * `ArticleEnhancements` is mounted here too: each card's `bodyHtml` is the
 * same `renderMarkdown` output an entry gets on its own topic's changelog, so
 * a mermaid fence in a merged entry still renders in-theme here.
 */
export default function SiteChangelogPage() {
  const entries = listSiteChangelog();

  return (
    <div className="doc-shell-content no-toc">
      <article className="reading-column">
        <h1 className="page-title">Changelog</h1>
        <SiteChangelog entries={entries} />
      </article>
      <ArticleEnhancements />
    </div>
  );
}
