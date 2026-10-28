import { articleTypes, type ArticleType } from './article-types';

export const applicationCachingHome = '/review/application-caching/';

export interface ApplicationCachingMetadata {
  title: string;
  description: string;
  parent: string | null;
  order: number;
  type: ArticleType;
  status: 'draft' | 'reviewed';
}

export interface ApplicationCachingEntry extends ApplicationCachingMetadata {
  key: string;
  href: string;
}

export function applicationCachingFileKey(path: string): string {
  return path.split('/').at(-1)!.replace(/(?:\.meta\.json|\.astro)$/, '');
}

export function applicationCachingHref(key: string): string {
  return key === 'index' ? applicationCachingHome : `${applicationCachingHome}${key}/`;
}

// Only completed file pairs become reading destinations. A brief on its own
// never produces an apparently available article.
export function applicationCachingEntries(keys: string[], metadata: Record<string, unknown>): ApplicationCachingEntry[] {
  return keys.filter(key => metadata[key]).map(key => {
    const meta = metadata[key] as ApplicationCachingMetadata;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)
      || typeof meta.title !== 'string' || !meta.title.trim()
      || typeof meta.description !== 'string' || !meta.description.trim()
      || !(meta.parent === null || typeof meta.parent === 'string')
      || !Number.isFinite(meta.order)
      || !articleTypes.includes(meta.type)
      || !['draft', 'reviewed'].includes(meta.status)) {
      throw new Error(`Invalid application caching article metadata: ${key}`);
    }
    return { ...meta, key, href: applicationCachingHref(key) };
  }).sort((a, b) => (a.key === 'index' ? -1 : b.key === 'index' ? 1 : a.order - b.order || a.key.localeCompare(b.key)));
}

export function applicationCachingNeighbours(entry: ApplicationCachingEntry, entries: ApplicationCachingEntry[]) {
  const parent = entries.find(item => item.key === entry.parent);
  const children = entries.filter(item => item.parent === entry.key);
  const siblings = entries.filter(item => item.parent === entry.parent);
  const index = siblings.findIndex(item => item.key === entry.key);
  return {
    parent,
    children,
    previous: index > 0 ? siblings[index - 1] : undefined,
    next: entry.key === 'index' ? children[0] : siblings[index + 1],
  };
}
