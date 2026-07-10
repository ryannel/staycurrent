import type { Metadata } from 'next';
import { getTopic, getTopicSlugs, getVersionHistory } from '@/lib/content';
import { VersionHistoryTable } from '@/components/history/version-history-table';

type PageParams = { topic: string };
type PageProps = { params: Promise<PageParams> };

export function generateStaticParams(): PageParams[] {
  return getTopicSlugs().map((topic) => ({ topic }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: slug } = await params;
  const { frontmatter } = getTopic(slug);
  return { title: `${frontmatter.title} — History` };
}

/**
 * `/[topic]/history/` — Version History (01-ui-design.md). The full version
 * ledger, one row per cut, newest first — `getVersionHistory` joins each
 * version's snapshot cut date (`loadVersion`) with the stance disposition
 * the SAME version's changelog entry recorded (`loadChangelog`).
 *
 * No TOC rail (Shell zone rule: "a table has no h2/h3 outline") — `no-toc`
 * frees the full reading-column width for the table, matching `/` and
 * `/about/`.
 */
export default async function TopicHistoryPage({ params }: PageProps) {
  const { topic: slug } = await params;
  const { frontmatter } = getTopic(slug);
  const rows = getVersionHistory(slug, frontmatter.version);

  return (
    <div className="doc-shell-content no-toc">
      <article className="reading-column">
        <h1 className="page-title">{`${frontmatter.title} — History`}</h1>
        <VersionHistoryTable slug={slug} currentVersion={frontmatter.version} rows={rows} />
      </article>
    </div>
  );
}
