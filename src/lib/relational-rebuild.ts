import rawCollection from '../articles/relational-rebuild/collection.json';
import { articleTypes, type ArticleType } from './article-types';
export { splitRelationalRebuildSources } from './relational-rebuild-sources';

export const relationalRebuildHome = '/review/relational-rebuild/';
export type RelationalRebuildStatus = 'planned' | 'draft' | 'reviewed';
export interface RelationalRebuildEntry {
  key: string;
  slug: string;
  title: string;
  brief: string;
  parent: string | null;
  group: string;
  status: RelationalRebuildStatus;
  legacySlugs?: string[];
}
export interface RelationalRebuildCollection {
  title: string;
  description: string;
  entries: RelationalRebuildEntry[];
}
export interface RelationalRebuildState extends RelationalRebuildEntry {
  description: string;
  type: ArticleType;
  available: boolean;
}
export interface RelationalRebuildNode {
  entry: RelationalRebuildState;
  children: RelationalRebuildNode[];
}

const fail = (message: string): never => { throw new Error(`Relational rebuild: ${message}`); };
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string' && !!value.trim();
const safeKey = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const safeSlug = /^(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/;

/** Validate editorial data before it can create routes or a recursive tree. */
export function parseRelationalRebuildCollection(value: unknown): RelationalRebuildCollection {
  if (!record(value) || !text(value.title) || !text(value.description) || !Array.isArray(value.entries)) return fail('invalid collection header');
  const keys = new Set<string>();
  const slugs = new Set<string>();
  const entries = value.entries.map((item: unknown): RelationalRebuildEntry => {
    if (!record(item) || !text(item.key) || !safeKey.test(item.key) || typeof item.slug !== 'string' || !safeSlug.test(item.slug)
      || !text(item.title) || !text(item.brief) || !text(item.group)
      || !(item.parent === null || (text(item.parent) && safeKey.test(item.parent)))
      || !['planned', 'draft', 'reviewed'].includes(String(item.status))
      || (item.legacySlugs !== undefined && (!Array.isArray(item.legacySlugs) || !item.legacySlugs.every(slug => typeof slug === 'string' && safeSlug.test(slug))))) return fail('invalid registry entry');
    if (keys.has(item.key) || slugs.has(item.slug)) return fail(`duplicate key or slug for ${item.key}`);
    keys.add(item.key);
    slugs.add(item.slug);
    return { key: item.key, slug: item.slug, title: item.title.trim(), brief: item.brief.trim(), parent: item.parent,
      group: item.group.trim(), status: item.status as RelationalRebuildStatus,
      ...(Array.isArray(item.legacySlugs) ? { legacySlugs: [...new Set(item.legacySlugs as string[])] } : {}) };
  });
  const owners = new Map(entries.map(entry => [entry.slug, entry.key]));
  for (const entry of entries) for (const slug of entry.legacySlugs ?? []) {
    if (owners.has(slug) && owners.get(slug) !== entry.key) return fail(`ambiguous legacy slug ${slug}`);
    owners.set(slug, entry.key);
  }
  const roots = entries.filter(entry => entry.parent === null);
  if (roots.length !== 1 || roots[0].slug !== '') return fail('exactly one root with an empty slug is required');
  const byKey = new Map(entries.map(entry => [entry.key, entry]));
  for (const entry of entries) {
    const seen = new Set([entry.key]);
    let parent = entry.parent;
    while (parent !== null) {
      if (seen.has(parent)) return fail(`parent cycle at ${entry.key}`);
      seen.add(parent);
      const ancestor = byKey.get(parent);
      if (!ancestor) return fail(`unknown parent ${parent} for ${entry.key}`);
      parent = ancestor.parent;
    }
  }
  return { title: value.title.trim(), description: value.description.trim(), entries };
}

export const relationalRebuildCollection = parseRelationalRebuildCollection(rawCollection);

/** Filename-to-key mapping accepts only flat article/metadata files. */
export function relationalRebuildFileKey(path: string): string | undefined {
  return path.match(/\/relational-rebuild\/([a-z0-9]+(?:-[a-z0-9]+)*)\.(?:astro|meta\.json)$/)?.[1];
}

/** File presence and editorial state are separate; neither alone makes reading available. */
export function relationalRebuildStates(
  availableKeys: Iterable<string>,
  metadata: Record<string, unknown> = {},
  collection = relationalRebuildCollection,
): RelationalRebuildState[] {
  const files = new Set(availableKeys);
  return collection.entries.map(entry => {
    const meta = metadata[entry.key];
    if (meta !== undefined && (!record(meta) || !text(meta.title) || !text(meta.description)
      || (meta.type !== undefined && !articleTypes.includes(meta.type as ArticleType)))) return fail(`invalid metadata for ${entry.key}`);
    const authored = record(meta) ? meta : undefined;
    return { ...entry, title: authored ? String(authored.title).trim() : entry.title,
      description: authored ? String(authored.description).trim() : entry.brief,
      type: authored?.type as ArticleType ?? (entry.parent === null ? 'Introduction' : 'Deep dive'),
      available: entry.status !== 'planned' && files.has(entry.key) };
  });
}

/** A raw route builder; use hrefFor when creating links to reading. */
export function relationalRebuildHref(slug = ''): string {
  if (!safeSlug.test(slug)) return fail(`unsafe slug ${slug}`);
  return `${relationalRebuildHome}${slug ? `${slug}/` : ''}`;
}

/** Planned and missing articles deliberately have no reading URL. */
export function relationalRebuildHrefFor(key: string, entries: RelationalRebuildState[]): string | undefined {
  const entry = entries.find(item => item.key === key);
  return entry?.available ? relationalRebuildHref(entry.slug) : undefined;
}

export function relationalRebuildTree(entries: RelationalRebuildState[], parent: string | null = null): RelationalRebuildNode[] {
  return entries.filter(entry => entry.parent === parent).map(entry => ({ entry, children: relationalRebuildTree(entries, entry.key) }));
}

const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** Defence for handwritten links: leave in-page anchors intact, remove unavailable preview targets. */
export function relationalRebuildLinks(html: string, entries: RelationalRebuildState[]): string {
  return html.replace(/<a\b([^>]*?)\bhref\s*=\s*(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi, (match, before, quote, href, after, label) => {
    if (!href.startsWith('/') && !/^https?:\/\/staycurrent\.dev(?:\/|$)/i.test(href)) return match;
    const target = new URL(href.replaceAll('&amp;', '&'), 'https://staycurrent.dev');
    if (target.hostname !== 'staycurrent.dev') return match;
    const downloadHome = `${relationalRebuildHome}downloads/`;
    // Astro's directory-format dev router requires a slash even for this file endpoint.
    // Built static downloads retain their ordinary filenames.
    if (target.pathname.startsWith(downloadHome)) {
      if (!import.meta.env.DEV || target.pathname.endsWith('/')) return match;
      return `<a${before}href=${quote}${escapeHtml(`${target.pathname}/${target.search}${target.hash}`)}${quote}${after}>${label}</a>`;
    }
    const fixtureHome = '/relational-rebuild/';
    if (target.pathname.startsWith(fixtureHome)) {
      const file = target.pathname.slice(fixtureHome.length);
      const [key, ...parts] = file.split('/');
      if (!safeKey.test(key) || !parts.length || !parts.every(part => /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(part) && part !== '.' && part !== '..')) return match;
      return `<a${before}href=${quote}${escapeHtml(`${downloadHome}${file}${import.meta.env.DEV ? '/' : ''}${target.search}${target.hash}`)}${quote}${after}>${label}</a>`;
    }
    const publicHome = '/learn/databases/relational/';
    const preview = target.pathname.startsWith(relationalRebuildHome);
    const publicReading = target.pathname.startsWith(publicHome);
    if (!preview && !publicReading) return match;
    const slug = target.pathname.slice(preview ? relationalRebuildHome.length : publicHome.length).replace(/\/$/, '');
    const entry = entries.find(item => item.slug === slug || item.legacySlugs?.includes(slug));
    // Unknown public destinations may be unrelated retained reading; only known owners are rebased.
    if (!entry && !preview) return match;
    if (!entry?.available) return `<span class="relational-rebuild-unavailable">${label} <small>(${entry?.status === 'planned' || !entry ? 'planned' : 'not yet available'})</small></span>`;
    return `<a${before}href=${quote}${escapeHtml(`${relationalRebuildHref(entry.slug)}${target.search}${target.hash}`)}${quote}${after}>${label}</a>`;
  });
}
