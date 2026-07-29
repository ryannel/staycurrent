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

// One card's shape wherever it's rendered — a leftover (ungrouped) card and a
// catalogue entry converge on this same shape by the time they reach
// `TopicCardTile`, so the tile itself never needs to know which source it
// came from.
interface LibraryCardData {
  slug: string;
  title: string;
  stance: string;
  version: number;
  lastResearched: string;
  core?: boolean;
}

/**
 * One area's grouped shape for the library grid (databases-catalogue bet,
 * 01-ui-design.md "Topic Library and Sidebar — Databases-Area Grouping").
 * Built by `app/page.tsx` from `lib/content.ts`'s `getCatalogues` merged with
 * `listTopicCards`' `lastResearched` (the one field `CatalogueEntry` omits,
 * 03-api-design.md's own design rationale for why) — this component stays a
 * plain presentational consumer, same as `cards` below.
 *
 * `foundations` is already flattened across movements, in reading order —
 * "grid stays un-sub-grouped by movement" (resolved decision 1); movement
 * structure is a sidebar-only concern.
 */
export type LibraryCatalogueEntry = LibraryCardData;

export interface LibraryCatalogue {
  area: string;
  hub: LibraryCatalogueEntry | null;
  foundations: LibraryCatalogueEntry[];
  profiles: LibraryCatalogueEntry[];
}

export interface TopicLibraryProps {
  // Topics outside any catalogue — renders exactly as today, in the plain
  // un-headed grid (01-ui-design.md, Required Capabilities parity with the
  // sidebar's "topics outside any catalogue render exactly as today").
  cards: TopicCard[];
  // Grouped areas — defaults to `[]` so every existing caller/test that never
  // passes this prop keeps today's flat rendering unchanged.
  catalogues?: LibraryCatalogue[];
}

/**
 * "databases" -> "Databases"; "cost-engineering" -> "Cost Engineering" — the
 * library's area heading (01-ui-design.md: "the first heading this page has
 * ever carried"). Mirrors `lib/content.ts`'s own `humanizeSlug` transform
 * (kebab-case -> Title Case words); duplicated here rather than imported
 * because it is a presentational transform on an already-resolved string,
 * not catalogue-grouping logic, and `humanizeSlug` itself isn't exported.
 */
function humanizeArea(area: string): string {
  return area
    .split('-')
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

/** One card tile — the existing `.topic-card` recipe, now also carrying the optional `badge-core` marker (01-ui-design.md micro-polish: "deliberately not accent-colored"). */
function TopicCardTile({ card }: { card: LibraryCardData }) {
  return (
    <Link href={`/${card.slug}/`} className="topic-card">
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
        {card.core && <span className="badge badge-core">core</span>}
      </div>
    </Link>
  );
}

/**
 * `/` — Topic Library (01-ui-design.md). Presentational: `app/page.tsx`
 * (a Server Component) supplies the `TopicCard[]` sweep via
 * `lib/content.ts`'s `listTopicCards` — this component owns only the
 * populated-grid / first-run-empty-state rendering choice, kept here (rather
 * than inline in the page) so it is unit-testable the way `Sidebar` and
 * `TocRail` are.
 */
export function TopicLibrary({ cards, catalogues = [] }: TopicLibraryProps) {
  if (cards.length === 0 && catalogues.length === 0) {
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
    <div className="library-root">
      {catalogues.map((catalogue) => (
        <div key={catalogue.area} className="library-catalogue">
          {/* --text-h2, area heading — reuses `.page-title`'s exact recipe
              (identical to `.article-body h2`'s numbers), the same role
              article section headings already use. */}
          <h2 className="page-title">{humanizeArea(catalogue.area)}</h2>

          {/* The hub, standalone, ahead of both registers — its own
              `.topic-grid` instance (the RAM pattern run a third time,
              01-ui-design.md: "run three times (hub / foundations /
              profiles) instead of once"). */}
          {catalogue.hub && (
            <div className="topic-grid">
              <TopicCardTile card={catalogue.hub} />
            </div>
          )}

          {catalogue.foundations.length > 0 && (
            <div className="library-register-group">
              <p className="nav-section-label">Foundations</p>
              <div className="topic-grid">
                {catalogue.foundations.map((card) => (
                  <TopicCardTile key={card.slug} card={card} />
                ))}
              </div>
            </div>
          )}

          {catalogue.profiles.length > 0 && (
            <div className="library-register-group">
              <p className="nav-section-label">Profiles</p>
              <div className="topic-grid">
                {catalogue.profiles.map((card) => (
                  <TopicCardTile key={card.slug} card={card} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {cards.length > 0 && (
        <div className="topic-grid">
          {cards.map((card) => (
            <TopicCardTile key={card.slug} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
