import type { Metadata } from 'next';
import type { TocEntry } from '@staycurrent/core';
import { getTopic, getTopicChangelog, getTopicSlugs } from '@/lib/content';
import { formatDisplayDate } from '@/lib/format-date';
import { TocRail } from '@/components/article/toc-rail';
import { ArticleEnhancements } from '@/components/article/enhancements';

type PageParams = { topic: string };
type PageProps = { params: Promise<PageParams> };

/**
 * Site Build Data Flow (02-data-flows.md): one `/[topic]/changelog/` route per
 * topic, alongside the article route's own enumeration — same fail-closed
 * `getTopicSlugs` sweep, same `dynamicParams = false` convention.
 */
export function generateStaticParams(): PageParams[] {
  return getTopicSlugs().map((topic) => ({ topic }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: slug } = await params;
  const { frontmatter } = getTopic(slug);
  return { title: `${frontmatter.title} — Changelog` };
}

/**
 * `/[topic]/changelog/` — Changelog (01-ui-design.md). The topic's
 * append-only timeline: `loadChangelog`'s entries (via
 * `lib/content.ts`'s `getTopicChangelog`), newest first, each a
 * self-contained mini-essay rendered through the same `article-body`
 * typography the live article uses — Slice 3.1's hardened `renderMarkdown`
 * pipeline included, since `bodyHtml` comes from the identical renderer.
 *
 * `**Stance:**`/`**What moved**`/`**What it means**` render as ordinary
 * `--text-body-em` prose inside `bodyMd` itself (Document Architecture's
 * anatomy) — there is no separate stance-badge affordance on this view, per
 * the Static micro spec.
 *
 * Each entry's `<h2 id="vN">` IS the `#vN` permalink anchor the proof names;
 * the TOC rail lists the same set (version + date) so a reader can jump
 * straight to an entry without scrolling — built here from the
 * `ChangelogEntry[]` directly (not from a single `RenderedDoc.toc`, since
 * this page concatenates several rendered docs into one DOM).
 *
 * `ArticleEnhancements` is mounted here exactly as it is on `/[topic]/` and
 * `/[topic]/v/[n]/`: an entry's `bodyMd` goes through the identical
 * `renderMarkdown` pipeline as the live article, so it can carry the same
 * mermaid fences (`lib/content.ts`'s `getTopicChangelog` reserves the same
 * layout space for them) and the same overflowing tables/code blocks that
 * need the scrollable-region a11y fix and the copy affordance.
 */
export default async function TopicChangelogPage({ params }: PageProps) {
  const { topic: slug } = await params;
  const { frontmatter } = getTopic(slug);
  const entries = getTopicChangelog(slug);

  const toc: TocEntry[] = entries.map((entry) => ({
    depth: 2,
    text: `v${entry.version} — ${formatDisplayDate(entry.date)}`,
    id: `v${entry.version}`,
  }));

  return (
    <div className="doc-shell-content">
      <article className="reading-column">
        <h1 className="page-title">{`${frontmatter.title} — Changelog`}</h1>
        <div className="article-body">
          {entries.map((entry) => (
            <section key={entry.version} aria-labelledby={`v${entry.version}`}>
              <h2 id={`v${entry.version}`}>{`v${entry.version} — ${formatDisplayDate(entry.date)}`}</h2>
              <div dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} />
            </section>
          ))}
        </div>
      </article>
      <TocRail entries={toc} />
      <ArticleEnhancements />
    </div>
  );
}
