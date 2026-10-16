import { relationalCollection, relationalArticleHref } from './relational-collection';
import { objectArticles, objectHome } from './object-storage-collection';
import { drawingCollection, drawingHref } from './drawing-collection';

export const databaseGuide = '/learn/databases/choosing/';
export const relationalHome = '/learn/databases/relational/';
export const drawingHome = drawingHref('');
export interface ReadingEntry { href: string; title: string; description: string; group: string; keywords?: string; }
export const reading: ReadingEntry[] = [
  { href: databaseGuide, title: 'Databases and storage: a field guide', description: 'The main approaches to storing data, the problems they solve, and when to choose them.', group: 'Start here' },
  { href: relationalHome, title: 'Relational databases: an introduction', description: 'Tables, relationships, queries and reliable changes.', group: 'Start here' },
  { href: `${relationalHome}sandbox/`, title: 'SQL sandbox', description: 'Explore PostgreSQL in your browser, with guided lessons from first queries to migrations, indexes and recovery reasoning.', group: 'Practice', keywords: 'PostgreSQL interactive tutorial transactions rollback' },
  { href: `${relationalHome}practice/`, title: 'Start the SQL practice', description: 'Open PostgreSQL, load the shop records and choose the setup for each article.', group: 'Practice', keywords: 'PostgreSQL psql Docker exercises' },
  ...relationalCollection.flatMap(group => group.articles.filter(article => !!article.status).map(article => ({
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
  { href: objectHome, title: 'Object storage: an introduction', description: 'Objects, keys and requests, with a complete Amazon S3 learning collection.', group: 'Object storage' },
  ...objectArticles.map(article => ({ href: `${objectHome}${article.slug}/`, title: article.title, description: article.description, group: `Object storage · ${article.group}`, keywords: 'Amazon S3 objects bucket' })),
  { href: `${objectHome}sandbox/`, title: 'Object-storage sandbox', description: 'Guided local models for requests, uploads, versions and application protocols.', group: 'Practice', keywords: 'S3 objects bucket playground' },
  { href: `${objectHome}practice/`, title: 'Try the requests against S3', description: 'A real-service worksheet for conditional writes and version recovery.', group: 'Practice', keywords: 'Amazon AWS CLI' },
  ...drawingCollection.map(article => ({ href: drawingHref(article.slug), title: article.slug ? article.title : 'Drawing systems and processes: an introduction', description: article.description, group: 'Drawing systems and processes', keywords: 'diagrams whiteboard C4 UML BPMN' })),
  { href: '/assessments/postgres-vectors/', title: 'Can Postgres handle vector search for my application?', description: 'A dated assessment of pgvector, retrieval quality and operating costs.', group: 'Assessments', keywords: 'PostgreSQL embeddings' },
];

export function breadcrumbs(path: string, title: string) {
  const trail = [{ href: '/', title: 'Home' }];
  if (path === '/') return [];
  if (path.startsWith(drawingHome)) {
    trail.push({ href: drawingHome, title: 'Drawing systems and processes' });
    if (path === drawingHome) return trail;
  }
  if (path.startsWith('/learn/databases/') || path.startsWith('/assessments/')) {
    trail.push({ href: databaseGuide, title: 'Databases and storage' });
    if (path === databaseGuide) return trail;
    if (path.startsWith(objectHome)) {
      trail.push({ href: objectHome, title: 'Object storage' });
      if (path === objectHome) return trail;
    }
    if (path.startsWith(relationalHome)) {
      trail.push({ href: relationalHome, title: 'Relational databases' });
      if (path === relationalHome) return trail;
      const group = relationalCollection.find(group => group.articles.some(article => relationalArticleHref(article.slug) === path));
      const main = group?.articles.find(article => article.slug === group.main);
      if (main && relationalArticleHref(main.slug) !== path) trail.push({ href: relationalArticleHref(main.slug), title: main.title });
    }
  }
  trail.push({ href: path, title: title.replace(/ — planned article$/, '') });
  return trail;
}
