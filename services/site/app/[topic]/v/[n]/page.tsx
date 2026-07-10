import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getArchivedVersion, getTopic, getTopicCutDate, getTopicSlugs } from '@/lib/content';
import { formatDisplayDate } from '@/lib/format-date';
import { TocRail } from '@/components/article/toc-rail';
import { ArchivedBanner } from '@/components/article/archived-banner';
import { ArticleEnhancements } from '@/components/article/enhancements';

type PageParams = { topic: string; n: string };
type PageProps = { params: Promise<PageParams> };

/**
 * Site Build Data Flow (02-data-flows.md): topics x versions — one route per
 * version snapshot `1..current`, for every topic. The route for `n ===
 * current` is real (not skipped): it is the build-time redirect stub, per
 * the flow's "the redirect target is fully known at build time" rule —
 * omitting it would 404 instead of redirecting.
 */
export function generateStaticParams(): PageParams[] {
  return getTopicSlugs().flatMap((topic) => {
    const { frontmatter } = getTopic(topic);
    return Array.from({ length: frontmatter.version }, (_, i) => ({ topic, n: String(i + 1) }));
  });
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: slug, n } = await params;
  const version = Number(n);
  const { frontmatter } = getTopic(slug);
  if (version === frontmatter.version) {
    // The canonical link tells a crawler/reader where the content actually
    // lives, via the sanctioned Metadata API — the meta-refresh redirect
    // itself is rendered directly in the page body below (see that comment
    // for why it works regardless of whether Next hoists it into <head>).
    return { title: frontmatter.title, alternates: { canonical: `/${slug}/` } };
  }
  return { title: `${frontmatter.title} — v${version} (archived)` };
}

/**
 * `/[topic]/v/[n]/` — Archived Version (01-ui-design.md). Two materially
 * different states on the same route, both decided at build time:
 *
 * - `n === current`: NOT a reading surface. **Design decision (01-ui-design.md,
 *   verbatim):** static export (ADR 0001) permits no server-side redirect,
 *   so this is a real static HTML page containing a 0-delay
 *   `<meta http-equiv="refresh">` plus `<link rel="canonical">` (via
 *   `generateMetadata`'s `alternates.canonical` above) plus the visible
 *   "Read current →" link as real page content, not a hidden fallback — the
 *   redirect works with JavaScript disabled, and a reader never sees a
 *   duplicate of the live article at a version URL. A 0-second meta-refresh
 *   carries no WCAG 2.2.1 timing-adjustable obligation (nothing to read
 *   before it fires). `superseded` is therefore never true here.
 * - `n < current`: the frozen snapshot (`getArchivedVersion`), an archived
 *   banner replacing the trust header, the same essay typography as the
 *   live article, and the superseded-skill pointer below it.
 *
 * `superseded` is computed here — snapshot `n` vs the live
 * `frontmatter.version` — never stored (Site Build Data Flow, verbatim).
 */
export default async function ArchivedVersionPage({ params }: PageProps) {
  const { topic: slug, n } = await params;
  const version = Number(n);
  const { frontmatter } = getTopic(slug);
  const articleHref = `/${slug}/`;

  if (version === frontmatter.version) {
    return (
      <div className="doc-shell-content no-toc">
        {/* WHATWG HTML explicitly permits a `http-equiv="refresh"` <meta>
            inside <body> (unlike most other http-equiv pragma directives),
            so this fires correctly wherever React places it in the DOM —
            no reliance on Next hoisting it into <head>. */}
        <meta httpEquiv="refresh" content={`0; url=${articleHref}`} />
        <div className="version-redirect-stub">
          <p>{`v${version} is the current version of this stance.`}</p>
          <Link href={articleHref}>Read current →</Link>
        </div>
      </div>
    );
  }

  const currentCutDate = getTopicCutDate(slug, frontmatter.version);
  const archived = getArchivedVersion(slug, version);

  return (
    <div className="doc-shell-content">
      <article className="reading-column">
        <ArchivedBanner
          version={archived.version}
          cutDate={archived.cutDate}
          currentVersion={frontmatter.version}
          currentCutDate={currentCutDate}
          articleHref={articleHref}
        />
        <div className="article-body" dangerouslySetInnerHTML={{ __html: archived.article.html }} />
        {/* Same essay-close Provenance anatomy as the live article
            (app/[topic]/page.tsx) — the archived snapshot's OWN provenance,
            frozen at that cut, never the live article's. */}
        <section className="provenance" aria-labelledby="provenance-heading">
          <h3 id="provenance-heading" className="provenance-heading">
            Provenance
          </h3>
          <p className="provenance-section-label">Sources</p>
          <ul className="provenance-list provenance-sources">
            {archived.provenance.sources.map((source) => (
              <li key={source.url}>
                <span className="badge badge-sourced">Sourced</span>
                <a className="provenance-source-link" href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
                <span className="provenance-meta">
                  {' — accessed '}
                  <time dateTime={source.accessed}>{formatDisplayDate(source.accessed)}</time>
                  {` — supports: ${source.supports}`}
                </span>
              </li>
            ))}
          </ul>
          <p className="provenance-section-label">Synthesis</p>
          <ul className="provenance-list provenance-synthesis">
            {archived.provenance.synthesis.map((claim) => (
              <li key={claim}>
                <span className="badge badge-synthesis">Synthesis</span>
                <span className="provenance-claim">{claim}</span>
              </li>
            ))}
          </ul>
        </section>
        {/* Superseded-skill pointer — the honesty state's second committed
            location alongside the History row's link text
            (01-ui-design.md's Design decision on `/[topic]/history/`). */}
        <div className="superseded-skill-pointer">
          <p className="superseded-skill-text">
            {'This skill renders '}
            <strong>{`v${archived.version}`}</strong>
            {' of the stance. '}
            <Link href={`/${slug}/skill/`} prefetch={false} className="superseded-skill-link">
              Install the current version instead →
            </Link>
          </p>
          <a href={`/skills/${slug}/v/${archived.version}/`} className="superseded-skill-archive-link">
            {`Archived payload: /skills/${slug}/v/${archived.version}/`}
          </a>
        </div>
      </article>
      <TocRail entries={archived.article.toc} />
      <ArticleEnhancements />
    </div>
  );
}
