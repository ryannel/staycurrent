import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getTopic, getTopicSlugs, getTopicVersion } from '@/lib/content';
import { isFresh } from '@/lib/freshness';
import { formatDisplayDate } from '@/lib/format-date';
import { TocRail } from '@/components/article/toc-rail';
import { ArticleEnhancements } from '@/components/article/enhancements';

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
  // A bare title — the root layout's `title.template` ("%s — Stay Current")
  // composes the full "<Title> — Stay Current" from this plain string (see
  // app/layout.tsx's metadata), unifying every topic page onto the same
  // "<Page> — Stay Current" pattern the 404 route and /about/ also follow.
  return { title: frontmatter.title };
}

/**
 * `/[topic]/` — the Living Article (01-ui-design.md). Slice 2.1 rendered the
 * content-bearing core (currency data, `loadTopic`'s body — stance callout as
 * its first blockquote, the article's own `<h1>`, every heading-anchor id).
 * This slice (2.2) dresses it in the shell's reading-column + TOC-rail zone,
 * the styled trust header, and the client-side mermaid render / code-copy
 * affordance (`ArticleEnhancements`) — the shared sidebar and design tokens
 * live in the root layout.
 *
 * `loadTopic` throws `ContentNotFoundError`/`ContentValidationError`
 * uncaught here — a topic missing `version`/`last_researched`, or otherwise
 * failing schema validation, fails `next build` rather than rendering a
 * partial page (02-data-flows.md, "currency is never guessed").
 */
export default async function TopicPage({ params }: PageProps) {
  const { topic: slug } = await params;
  const { frontmatter, body } = getTopic(slug);
  // Freshness keys on the CURRENT VERSION'S CUT DATE (loadVersion), not
  // `last_researched` — a no-cut research run updates the latter without
  // lighting the dot (docs/design-system.md § Graphical UI, Badges).
  // One `loadVersion` call (via `getTopicVersion`) supplies both the cut
  // date and the provenance record the essay-close section below renders —
  // see lib/content.ts's doc comment for why this is a single accessor.
  const { cutDate, provenance } = getTopicVersion(slug, frontmatter.version);
  const fresh = isFresh(cutDate);

  return (
    <div className="doc-shell-content">
      <article className="reading-column">
        <p className="trust-header">
          {/* A single interpolated string, not adjacent JSX children ("v"
              followed by {version}) — React's server renderer inserts a
              hydration comment marker between adjacent text children, which
              would split the literal "v1" the trust header must state. */}
          <span className="badge trust-header-version">{`v${frontmatter.version}`}</span>
          <span aria-hidden="true">·</span>
          <span>
            {'researched '}
            {/* Human-formatted for display ("12 Jun 2026"); the ISO value
                stays on the `datetime` attribute for machine-readability. The
                display formatting is deterministic and UTC-based (see
                lib/format-date.ts) so the same content always builds the
                same trust-header text regardless of the build machine's
                local timezone. */}
            <time className="trust-header-last-researched" dateTime={frontmatter.last_researched}>
              {formatDisplayDate(frontmatter.last_researched)}
            </time>
          </span>
          <span aria-hidden="true">·</span>
          <Link href={`/${slug}/changelog/`}>
            changelog
          </Link>
          <span aria-hidden="true">·</span>
          <Link href={`/${slug}/history/`}>
            history
          </Link>
          <span aria-hidden="true">·</span>
          {/* skill lands in Slice 3.3 — prefetch={false} keeps Next's
              viewport prefetcher from issuing a background request for a
              route this export doesn't generate yet (see sidebar.tsx). */}
          <Link href={`/${slug}/skill/`} prefetch={false}>
            skill
          </Link>
          {/* Always rendered (never conditionally omitted) so the client-side
              freshness correction (components/shell/freshness-correction.tsx)
              can show/hide it against the reader's actual clock — a static
              export's build-time `fresh` value only reflects freshness as of
              the last build. `hidden` carries the build-time/no-JS value. */}
          <span className="freshness-dot" data-cut-date={cutDate} hidden={!fresh} role="img" aria-label="fresh">
            fresh
          </span>
        </p>
        <div className="article-body" dangerouslySetInnerHTML={{ __html: body.html }} />
        {/* Provenance, rendered inline at the essay's close (01-ui-design.md's
            micro-polish spec, design decision): the design system pins
            provenance.md's two-section anatomy (## Sources / ## Synthesis)
            to the sourced/synthesis badge tokens, not to a dedicated route
            or component. Deliberately does NOT register in the TOC rail
            (that list is generated from the parsed article's own headings,
            never DOM-scanned) — expected, not a bug to hack around.
            Heading is an <h3>, not <h2>: the shell's scroll-spied TOC rail
            (components/article/toc-rail.tsx) and its test coverage key off
            "the last <h2> in the article", a convention this section must
            not disturb by introducing a later, TOC-less <h2> of its own. */}
        <section className="provenance" aria-labelledby="provenance-heading">
          <h3 id="provenance-heading" className="provenance-heading">
            Provenance
          </h3>
          <p className="provenance-section-label">Sources</p>
          <ul className="provenance-list provenance-sources">
            {provenance.sources.map((source) => (
              <li key={source.url}>
                <span className="badge badge-sourced">Sourced</span>
                <a
                  className="provenance-source-link"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
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
            {provenance.synthesis.map((claim) => (
              <li key={claim}>
                <span className="badge badge-synthesis">Synthesis</span>
                <span className="provenance-claim">{claim}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>
      <TocRail entries={body.toc} />
      <ArticleEnhancements />
    </div>
  );
}
