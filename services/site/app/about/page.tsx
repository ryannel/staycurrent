import type { Metadata } from 'next';

// A bare page title — the root layout's `title.template` ("%s — Stay
// Current") composes the full "About — Stay Current" from this. Do not
// hand-write the suffix here: Next applies the inherited template to a plain
// string title even when that string is already the full desired title,
// which would otherwise double it up.
export const metadata: Metadata = {
  title: 'About',
};

/**
 * `/about/` — About (01-ui-design.md). The one place a curious reader learns
 * how a living article works — static prose, no data dependency, identical
 * on every build (Onboarding spec: no tours or tooltips exist anywhere else).
 *
 * `<h1>` at the utility-page convention (`.page-title`, `--text-h2` per the
 * Static micro spec) — `--text-display` stays reserved to the article `<h1>`
 * and the home masthead. The body reuses `.article-body`'s typography
 * (same 72ch essay measure and rhythm as the article) since this page is
 * prose meant to be read, not chrome.
 */
export default function AboutPage() {
  return (
    <div className="doc-shell-content no-toc">
      <article className="reading-column">
        <h1 className="page-title">About Stay Current</h1>
        <div className="article-body">
          <h2 id="how-a-living-article-works">How a living article works</h2>
          <p>
            Most technical writing is a snapshot: accurate the day it was published, silently
            stale the day the field moved on. Stay Current inverts that. Each subject the product
            covers — a <strong>topic</strong> — has exactly one current essay, called its{' '}
            <strong>article</strong>. There is no separate &ldquo;latest&rdquo; and
            &ldquo;archive&rdquo; to reconcile: the article you land on is always the one the
            product stands behind today.
          </p>
          <p>
            An article states a <strong>stance</strong> — the one-sentence committed position it
            argues, restated at the top of the essay so a reader never has to infer where the
            product lands. When new research changes the picture enough to matter, the article is
            rewritten and its <strong>version</strong> increments: a plain integer, one higher
            than the last, with no separate numbering scheme to learn. Publishing a new version is
            called a <strong>cut</strong> — the moment research is judged to have moved the
            stance (or the facts beneath it) enough to warrant a new one. A topic without any
            recent finding worth publishing simply keeps its current version; nothing is cut for
            its own sake.
          </p>
          <p>
            Every cut leaves two trails. The <strong>changelog</strong> is the topic&apos;s
            append-only timeline: one entry per version, in plain language, stating what moved,
            what it means, and whether the stance held, bent, or reversed. The{' '}
            <strong>provenance</strong> is the evidence behind the current article — the sources
            consulted and the synthesis drawn from them — rendered at the essay&apos;s close so a
            reader can check the work without asking. Together, currency and provenance are meant
            to be visible without asking: the trust header above every article states its version
            and research date before a single word of the essay itself.
          </p>
          <p>
            The first research run on a new topic creates it; every run after that either cuts a
            new version or logs that nothing changed enough to warrant one. Either way, the record
            is kept — a living article is not just current, it can show its work for how it got
            there.
          </p>
        </div>
      </article>
    </div>
  );
}
