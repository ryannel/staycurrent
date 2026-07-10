import { listTopicCards } from '@/lib/content';
import { TopicLibrary } from '@/components/library/topic-library';

/**
 * `/` — Topic Library (01-ui-design.md). The site's index: a card grid, one
 * tile per topic (title, stance one-liner, version badge, researched date —
 * `listTopics`' `TopicSummary` sweep via `lib/content.ts`'s `listTopicCards`),
 * or the designed first-run empty state when `topics/` is validly empty.
 *
 * No TOC rail on this view (Shell zone rule) — `doc-shell-content.no-toc`
 * collapses the shell's content grid to a single column, freeing the full
 * width for the card grid instead of capping it to the 72ch essay measure
 * `.reading-column` uses on the article/about/404 views.
 */
export default function HomePage() {
  const cards = listTopicCards();

  return (
    <div className="doc-shell-content no-toc">
      <TopicLibrary cards={cards} />
    </div>
  );
}
