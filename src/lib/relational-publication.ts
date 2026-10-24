import { relationalDraftEntries, relationalDraftGroups, type RelationalDraftState } from './relational-draft-20261024';

/** The completed collection, using each article's authored display metadata. */
const metadata = import.meta.glob('../articles/relational-collection/*.meta.json', {
  eager: true,
  import: 'default',
}) as Record<string, { title?: string; description?: string }>;

export const relationalPublishedEntries: RelationalDraftState[] = relationalDraftEntries.map(entry => {
  const authored = metadata[`../articles/relational-collection/${entry.key}.meta.json`];
  return {
    ...entry,
    title: authored?.title?.trim() || entry.title,
    description: authored?.description?.trim() || entry.description,
    status: 'published',
  };
});

export const relationalPublishedGroups = relationalDraftGroups;
