import { getCatalogues, listTopicCards, type CatalogueEntry } from '@/lib/content';
import { TopicLibrary, type LibraryCatalogue, type LibraryCatalogueEntry } from '@/components/library/topic-library';

/**
 * Merges one `CatalogueEntry` (slug/title/stance/version/core — everything
 * `getCatalogues` sweep-cheaply carries) with `lastResearched` (the one field
 * it deliberately omits) looked up from the `listTopicCards` sweep already taken below —
 * both derive from the same `sweepOrThrow` pass over the same `topics/`
 * tree, so every catalogue entry's slug is guaranteed present in the map.
 */
function toLibraryEntry(entry: CatalogueEntry, lastResearchedBySlug: Map<string, string>): LibraryCatalogueEntry {
  return {
    slug: entry.slug,
    title: entry.title,
    stance: entry.stance,
    version: entry.version,
    lastResearched: lastResearchedBySlug.get(entry.slug)!,
    ...(entry.core !== undefined && { core: entry.core }),
  };
}

/**
 * `/` — Topic Library. The site's index: a card grid, one
 * tile per topic (title, stance one-liner, version badge, researched date —
 * `listTopics`' `TopicSummary` sweep via `lib/content.ts`'s `listTopicCards`),
 * or the designed first-run empty state when `topics/` is validly empty.
 *
 * Grouped by area via `getCatalogues`, one hub card standalone plus
 * register-labelled Foundations/Profiles grids, reading-order sorted. Every
 * topic `getCatalogues` groups is excluded from the leftover `cards` grid so
 * it renders exactly once; a topic with no `area` at all renders exactly as
 * today, in that same leftover grid.
 *
 * No TOC rail on this view (Shell zone rule) — `doc-shell-content.no-toc`
 * collapses the shell's content grid to a single column, freeing the full
 * width for the card grid instead of capping it to the 72ch essay measure
 * `.reading-column` uses on the article/about/404 views.
 */
export default function HomePage() {
  const cards = listTopicCards();
  const lastResearchedBySlug = new Map(cards.map((card) => [card.slug, card.lastResearched]));

  const groupedSlugs = new Set<string>();
  const catalogues: LibraryCatalogue[] = getCatalogues().map((catalogue) => {
    if (catalogue.hub) groupedSlugs.add(catalogue.hub.slug);
    const foundations = catalogue.movements.flatMap((movement) => movement.entries);
    foundations.forEach((entry) => groupedSlugs.add(entry.slug));
    catalogue.profiles.forEach((entry) => groupedSlugs.add(entry.slug));
    return {
      area: catalogue.area,
      hub: catalogue.hub ? toLibraryEntry(catalogue.hub, lastResearchedBySlug) : null,
      foundations: foundations.map((entry) => toLibraryEntry(entry, lastResearchedBySlug)),
      profiles: catalogue.profiles.map((entry) => toLibraryEntry(entry, lastResearchedBySlug)),
    };
  });

  const leftoverCards = cards.filter((card) => !groupedSlugs.has(card.slug));

  return (
    <div className="doc-shell-content no-toc">
      <TopicLibrary cards={leftoverCards} catalogues={catalogues} />
    </div>
  );
}
