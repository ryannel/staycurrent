import { relationalCollection, relationalArticleHref } from './relational-collection';

export const databaseGuide = '/learn/databases/choosing/';
export const relationalHome = '/learn/databases/relational/';
export interface ReadingEntry { href: string; title: string; description: string; group: string; keywords?: string; }
export const reading: ReadingEntry[] = [
  { href: databaseGuide, title: 'Databases and storage: a field guide', description: 'The main approaches to storing data, the problems they solve, and when to choose them.', group: 'Start here' },
  { href: relationalHome, title: 'Relational databases: an introduction', description: 'Tables, relationships, queries and reliable changes.', group: 'Start here' },
  ...relationalCollection.flatMap(group => group.articles.filter(article => article.status === 'draft').map(article => ({
    href: relationalArticleHref(article.slug), title: article.title, description: article.description,
    group: group.title, keywords: article.scope,
  }))),
  { href: `${relationalHome}checkout/`, title: 'How a relational database keeps an order together', description: 'A worked checkout, from related records to concurrent purchases and recovery.', group: 'A worked example' },
  { href: '/learn/databases/column-stores/', title: 'How a column store works', description: 'Column layouts, sorting, writes and replication, with four experiments.', group: 'Other database and storage approaches', keywords: 'analytics ClickHouse compression' },
  { href: '/learn/databases/documents/', title: 'How document boundaries shape a database', description: 'Nested records, shared details and the consequences of choosing a document boundary.', group: 'Other database and storage approaches' },
  { href: '/learn/databases/partitioned/', title: 'Choosing keys for partitioned data', description: 'Partition keys, sort order and the cost of another access pattern.', group: 'Other database and storage approaches' },
  { href: '/learn/databases/distributed-sql/', title: 'Keeping a transaction together across machines', description: 'Partitions, replicas and coordination in a distributed SQL database.', group: 'Other database and storage approaches' },
  { href: '/learn/databases/caching/', title: 'Keeping a copy of the answer', description: 'Cache hits, invalidation, expiry and eviction.', group: 'Other database and storage approaches' },
  { href: '/learn/databases/search/', title: 'Finding the blue mug', description: 'Search indexes, tokenisation, ranking and vector filtering.', group: 'Other database and storage approaches' },
  { href: '/learn/databases/graphs/', title: 'How a graph database follows relationships', description: 'Traversing connections, handling cycles and updating a graph.', group: 'Other database and storage approaches' },
  { href: '/learn/databases/object-storage/', title: 'What object storage gives you', description: 'Object keys, photographs and publishing a complete export.', group: 'Other database and storage approaches' },
  { href: '/assessments/postgres-vectors/', title: 'Can Postgres handle vector search for my application?', description: 'A dated assessment of pgvector, retrieval quality and operating costs.', group: 'Assessments', keywords: 'PostgreSQL embeddings' },
];

export function breadcrumbs(path: string, title: string) {
  const trail = [{ href: '/', title: 'Home' }];
  if (path === '/') return [];
  if (path.startsWith('/learn/databases/') || path.startsWith('/assessments/')) {
    trail.push({ href: databaseGuide, title: 'Databases and storage' });
    if (path === databaseGuide) return trail;
    if (path.startsWith(relationalHome)) {
      trail.push({ href: relationalHome, title: 'Relational databases' });
      if (path === relationalHome) return trail;
    }
  }
  trail.push({ href: path, title: title.replace(/ — planned article$/, '') });
  return trail;
}
