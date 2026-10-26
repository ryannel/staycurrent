import { relationalPublishedEntries, relationalPublishedGroups } from './relational-publication';

/** Published reading, grouped by the work the reader needs to do. */
export interface RelationalArticle { id?: string; slug: string; title: string; description: string; scope: string; status?: 'draft' | 'published'; }
export interface RelationalGroup { id: string; title: string; overviewAnchor: string; main?: string; articles: RelationalArticle[]; }
export const relationalIntroduction = relationalPublishedEntries[0];
export const relationalCollection: RelationalGroup[] = relationalPublishedGroups.map(group => ({
  ...group,
  overviewAnchor: 'collection',
  articles: relationalPublishedEntries.filter(entry => entry.group === group.id).map(entry => ({
    ...entry,
    scope: entry.description,
    status: 'published',
  })),
}));
/** Retired article routes resolve to the revised explanation that owns the subject. */
const previousAliases: Record<string, string> = {
  "choosing-indexes": "indexes",
  "join-algorithms": "query-execution",
  "commit-and-recovery": "storage",
  "watching-storage": "crash-recovery",
  "diagnosing-waits": "slow-queries",
  "performance-testing": "slow-queries",
  "maintenance": "slow-queries",
  "embedded-databases": "",
  "access-and-lifecycle": "access-control",
  "normalisation": "modelling",
  "tables-and-documents": "postgresql/json",
  "concurrent-updates": "locks-and-deadlocks",
  "isolation": "transaction-boundaries",
  "indexing-queries": "indexes",
  "maintaining-indexes": "indexes",
  "buffer-pool": "storage",
  "checkpoints-and-the-log": "crash-recovery",
  "request-cost": "application-sql",
  "reporting": "aggregates-and-windows",
  "scaling": "partitioning-and-sharding",
  "replicas-and-failover": "failover",
  "product-comparison": "",
  "adding-another-system": "outboxes-and-jobs"
};
// Canonical new articles take precedence over former redirects (e.g. normalisation).
const currentSlugs = new Set(relationalPublishedEntries.map(entry => entry.slug));
export const relationalAliases: Record<string, string> = Object.fromEntries([
  ...Object.entries(previousAliases),
  ...relationalPublishedEntries.flatMap(entry => (entry.legacySlugs ?? []).map(slug => [slug, entry.slug])),
].filter(([slug]) => !currentSlugs.has(slug)));
for (const slug of Object.keys(relationalAliases)) {
  const seen = new Set([slug]);
  while (Object.hasOwn(relationalAliases, relationalAliases[slug]) && !seen.has(relationalAliases[slug])) {
    seen.add(relationalAliases[slug]);
    relationalAliases[slug] = relationalAliases[relationalAliases[slug]];
  }
}
export const relationalArticleHref = (slug: string) => `/learn/databases/relational/${slug ? `${slug}/` : ''}`;
export const relationalPublication: Record<string, string> = Object.fromEntries(
  relationalPublishedEntries.map(entry => [entry.id, entry.slug]),
);
