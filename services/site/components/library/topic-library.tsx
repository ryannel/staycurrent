import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatDisplayDate } from '@/lib/format-date';
import { ICON_STROKE_WIDTH } from '@/lib/icons';
import type { TopicCard } from '@/lib/content';

// "The framework" the empty state points at is Stay Current itself — the
// living-topic machinery a future instance operator would install, whose
// docs the framework-extraction bet will mint. No canonical docs URL exists
// yet (01-ui-design.md names the link but pins no destination), so this
// points at the product's repository as the honest placeholder — never at
// groundwork-method, which is this repo's development methodology, not the
// product's framework.
const FRAMEWORK_DOCS_URL = 'https://github.com/ryannel/staycurrent';

export interface TopicLibraryProps {
  cards: TopicCard[];
}

/**
 * `/` — Topic Library (01-ui-design.md). Presentational: `app/page.tsx`
 * (a Server Component) supplies the `TopicCard[]` sweep via
 * `lib/content.ts`'s `listTopicCards` — this component owns only the
 * populated-grid / first-run-empty-state rendering choice, kept here (rather
 * than inline in the page) so it is unit-testable the way `Sidebar` and
 * `TocRail` are.
 */
export function TopicLibrary({ cards }: TopicLibraryProps) {
  if (cards.length === 0) {
    // First-run empty state (Empty States pattern, verbatim sentence) — never
    // a blank grid.
    return (
      <p className="empty-state">
        No topics yet. The first research run creates one.{' '}
        <a href={FRAMEWORK_DOCS_URL} target="_blank" rel="noreferrer">
          Framework docs
          <ArrowUpRight size={14} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />
        </a>
      </p>
    );
  }

  return (
    <div className="topic-grid">
      {cards.map((card) => (
        <Link key={card.slug} href={`/${card.slug}/`} className="topic-card">
          <h3 className="topic-card-title">{card.title}</h3>
          <p className="topic-card-stance">{card.stance}</p>
          <div className="topic-card-meta">
            {/* A single interpolated string, not adjacent JSX children — see
                app/[topic]/page.tsx's trust header for why (a hydration
                comment marker would split the literal "v1"). The "researched"
                label matches that same trust header's vocabulary
                (01-ui-design.md's card wireframe: "[v5] researched 12 Jun
                2026") — it is part of the meta row, not implied by the date
                alone. */}
            <span className="badge">{`v${card.version}`}</span>
            <span>{`researched ${formatDisplayDate(card.lastResearched)}`}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
