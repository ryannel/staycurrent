import type { Metadata } from 'next';
import Link from 'next/link';
import { listTopicCards } from '@/lib/content';

// A bare page title — the root layout's `title.template` composes the full
// "Page not found — Stay Current" from this (see app/layout.tsx's metadata).
export const metadata: Metadata = {
  title: 'Page not found',
};

/**
 * Root 404 — Not Found (01-ui-design.md). Rendered for any unmatched route
 * under the static export: `next build` emits this as `out/404.html` (or
 * `out/404/index.html`), so the "designed dead end" replaces the host
 * default for every miss — including the changelog/history/skill face links
 * whose routes arrive in Milestone 3 (the accepted mid-ladder state).
 *
 * "The dead end contains the map" (Error & honesty choreography): the topic
 * tree renders inline as page content, not just relying on the sidebar that
 * already carries it on every page. Reuses `listTopicCards` (no direct
 * `topics/` read) — no card-grid pattern here, this is wayfinding text, not
 * the library's browsing surface. Lists each topic by its slug (matching the
 * 404 wireframe's literal "→ databases" rows), not its display title — the
 * one place on the site a reader is oriented by URL-shaped wayfinding text
 * rather than editorial titling.
 *
 * This is a Server Component, so it renders at build time and is static for
 * every miss (the design's intent) — there is no per-request 404 render in a
 * static export.
 */
export default function NotFound() {
  const topics = listTopicCards();

  return (
    <div className="doc-shell-content no-toc">
      <article className="reading-column">
        <h1 className="not-found-title">This page doesn&apos;t exist.</h1>
        <p className="not-found-sentence">It may have moved when a topic was renamed.</p>
        {topics.length > 0 && (
          <>
            <p className="nav-section-label">Topics</p>
            <ul className="not-found-topics">
              {topics.map((topic) => (
                <li key={topic.slug}>
                  <Link href={`/${topic.slug}/`}>{topic.slug}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </article>
    </div>
  );
}
