export const cachingHome = '/learn/databases/caching/';
export const cachingArticles = [
  { slug: '', title: 'Application caching with Redis', description: 'Follow requests through cache-aside, discover when reuse pays, and see why a cached answer can be out of date.', published: true },
  { slug: 'keys-and-values', title: 'Cache keys and cached values', description: 'Define which requests can safely share an answer, including tenants, permissions and negative results.', published: false },
  { slug: 'expiration-and-eviction', title: 'Cache expiration and eviction', description: 'Separate freshness from capacity and choose lifetimes and eviction policies from the workload.', published: false },
  { slug: 'invalidation', title: 'Cache invalidation and consistency', description: 'Follow concurrent reads and writes, stale refills and versioned invalidation.', published: false },
  { slug: 'stampedes', title: 'Cache stampedes', description: 'Control duplicate work with coalescing, jitter, leases and stale-while-revalidate.', published: false },
  { slug: 'failure-handling', title: 'Cache failures and graceful degradation', description: 'Bound fallback work, deadlines and retries when Redis is unavailable.', published: false },
  { slug: 'clients-and-latency', title: 'Redis clients, latency and pipelining', description: 'Account for round trips, client queues, batches and uncertain command outcomes.', published: false },
  { slug: 'atomicity', title: 'Redis transactions and Lua scripts', description: 'Compose atomic operations and understand the boundaries of transactions, scripts and leases.', published: false },
  { slug: 'memory-and-performance', title: 'Redis memory and performance', description: 'Size memory, find expensive commands and reserve headroom for Redis operations.', published: false },
  { slug: 'replication-and-failover', title: 'Redis replication, persistence and failover', description: 'Reason about replication lag, recovery, promotion and acknowledged-write loss.', published: false },
  { slug: 'redis-cluster', title: 'Redis Cluster and hot keys', description: 'Follow hash slots, redirects, resharding and the limits of adding shards.', published: false },
  { slug: 'client-side-caching', title: 'Client-side caching and cache hierarchies', description: 'Keep local and shared copies coherent across invalidation and disconnection.', published: false },
  { slug: 'operations', title: 'Operating Redis caches', description: 'Secure, observe, diagnose and change a cache service under real workload constraints.', published: false },
  { slug: 'system-design', title: 'Designing a production cache', description: 'Build and test a complete application cache contract under load, updates and failure.', published: false },
];
export const cachingHref = (slug: string) => `${cachingHome}${slug ? `${slug}/` : ''}`;
