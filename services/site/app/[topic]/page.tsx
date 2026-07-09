import type { Metadata } from 'next';
import { getTopic, getTopicSlugs } from '@/lib/content';

type PageParams = { topic: string };
type PageProps = { params: Promise<PageParams> };

/**
 * Site Build Data Flow (02-data-flows.md): `listTopics` -> `generateStaticParams`
 * -> per-route `loadTopic`. A non-empty `errors` array from the sweep is
 * build-fatal (`getTopicSlugs` throws it) — the whole export refuses to build
 * rather than silently omitting a broken topic from the catalogue.
 */
export function generateStaticParams(): PageParams[] {
  return getTopicSlugs().map((topic) => ({ topic }));
}

// A slug outside generateStaticParams's list 404s instead of falling through
// to an on-demand loadTopic render (dev-server behaviour; prod is a static
// export, which has no server to render on demand anyway).
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: slug } = await params;
  const { frontmatter } = getTopic(slug);
  return { title: frontmatter.title };
}

/**
 * `/[topic]/` — the Living Article (01-ui-design.md). This slice renders the
 * content-bearing core only: the trust-header currency data as semantic
 * markup, and `loadTopic`'s rendered body — which already carries the stance
 * callout as its first blockquote, the article's own `<h1>`, and every
 * generated heading-anchor id from `RenderedDoc.toc`. The shell (sidebar, TOC
 * rail, tokens) is Slice 2.2's.
 *
 * `loadTopic` throws `ContentNotFoundError`/`ContentValidationError`
 * uncaught here — a topic missing `version`/`last_researched`, or otherwise
 * failing schema validation, fails `next build` rather than rendering a
 * partial page (02-data-flows.md, "currency is never guessed").
 */
export default async function TopicPage({ params }: PageProps) {
  const { topic: slug } = await params;
  const { frontmatter, body } = getTopic(slug);

  return (
    <article>
      <p className="trust-header">
        {/* A single interpolated string, not adjacent JSX children ("v"
            followed by {version}) — React's server renderer inserts a
            hydration comment marker between adjacent text children, which
            would split the literal "v1" the trust header must state. */}
        <span className="trust-header-version">{`v${frontmatter.version}`}</span>
        {' · researched '}
        <time className="trust-header-last-researched" dateTime={frontmatter.last_researched}>
          {frontmatter.last_researched}
        </time>
      </p>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: body.html }} />
    </article>
  );
}
