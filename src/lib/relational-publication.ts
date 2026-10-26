import { relationalRebuildCollection, relationalRebuildFileKey, relationalRebuildStates } from './relational-rebuild';

/** Publication authorised on 26 October 2026 for the complete reviewed collection. */
export const relationalPublishedHome = '/learn/databases/relational/';
const fragments = import.meta.glob('../articles/relational-rebuild/*.astro');
const metadataFiles = import.meta.glob('../articles/relational-rebuild/*.meta.json', { eager: true, import: 'default' });
const keys = Object.keys(fragments).map(relationalRebuildFileKey).filter((key): key is string => !!key);
const metadata = Object.fromEntries(Object.entries(metadataFiles).map(([path, meta]) => [relationalRebuildFileKey(path)!, meta]));
export const relationalPublishedStates = relationalRebuildStates(keys, metadata);
if (relationalPublishedStates.length !== 59 || relationalPublishedStates.some(entry => !entry.available || entry.status !== 'reviewed')) {
  throw new Error('The authorised relational publication requires all 59 reviewed articles.');
}
export const relationalPublishedEntries = relationalPublishedStates.map(entry => ({ ...entry, id: entry.key, status: 'published' as const }));
export const relationalPublishedGroups = [...new Set(relationalPublishedStates.filter(entry => entry.parent !== null).map(entry => entry.group))]
  .map(title => ({ id: title, title }));
export const relationalPublishedCollection = relationalRebuildCollection;
