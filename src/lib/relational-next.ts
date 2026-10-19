import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import registry from '../../docs/article-work/relational-writing-2026-10-19/registry.json';

export interface RelationalNextArticle {
  id: string;
  slug: string;
  title: string;
  brief: string;
  parent: string | null;
  href: string;
  children: string[];
  sections: { title: string; anchor: string; level: number }[];
}

// The writing registry is the single source of titles, relationships and URLs.
export const relationalNextArticles: RelationalNextArticle[] = registry;
export const relationalNextHome = '/review/relational-next/';
const fragments = import.meta.glob<AstroComponentFactory>(
  '../articles/relational-next/*.astro',
  { eager: true, import: 'default' },
);

export function relationalNextContent(id: string) {
  return fragments[`../articles/relational-next/${id}.astro`];
}

export function relationalNextAvailable(id: string) {
  return Boolean(relationalNextContent(id));
}

export function relationalNextChildren(article: RelationalNextArticle) {
  return article.children.map(id => {
    const child = relationalNextArticles.find(entry => entry.id === id);
    if (!child) throw new Error(`Missing relational writing registry entry: ${id}`);
    return child;
  });
}

export function relationalNextAncestors(article: RelationalNextArticle) {
  const ancestors: RelationalNextArticle[] = [];
  let parent = article.parent;
  while (parent) {
    const entry = relationalNextArticles.find(candidate => candidate.id === parent);
    if (!entry) throw new Error(`Missing relational writing registry parent: ${parent}`);
    if (ancestors.includes(entry)) throw new Error(`Circular relational writing ancestry: ${parent}`);
    ancestors.unshift(entry);
    parent = entry.parent;
  }
  return ancestors;
}
