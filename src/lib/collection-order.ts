// Each collection's reading order, for the previous and next links at the foot
// of its pages. The order matches the collection switcher at the top: the
// introduction, then each deep dive followed by its companions.
import { drawingCollection, drawingHref } from './drawing-collection';
import { relationalCollection, relationalArticleHref } from './relational-collection';
import { objectArticles, objectHome } from './object-storage-collection';
import { relationalHome } from './reading';

export interface PagerEntry { href: string; title: string }

const relational: PagerEntry[] = [
  { href: relationalHome, title: 'Relational databases: an introduction' },
  ...relationalCollection.flatMap((group) => {
    const available = group.articles.filter((a) => !!a.status);
    const main = available.filter((a) => a.slug === group.main);
    return [...main, ...available.filter((a) => a.slug !== group.main)];
  }).map((a) => ({ href: relationalArticleHref(a.slug), title: a.title })),
];

const drawing: PagerEntry[] = drawingCollection.map((a) => ({ href: drawingHref(a.slug), title: a.slug ? a.title : 'Drawing systems: an introduction' }));

const objectStorage: PagerEntry[] = [
  { href: objectHome, title: 'Object storage: an introduction' },
  ...objectArticles.map((a) => ({ href: `${objectHome}${a.slug}/`, title: a.title })),
];

export const collections = [relational, drawing, objectStorage];

/** The pages either side of this one in its collection, or nothing if it isn't in one. */
export function neighbours(path: string): { previous?: PagerEntry; next?: PagerEntry } | undefined {
  for (const order of collections) {
    const i = order.findIndex((entry) => entry.href === path);
    if (i >= 0) return { previous: order[i - 1], next: order[i + 1] };
  }
  return undefined;
}
