export const cachingHome = '/learn/databases/caching/';
export const cachingArticles = [
  { slug: '', title: 'Keeping a copy of the answer', description: 'Follow requests through a cache, discover what reuse saves, and watch a copy fall out of date.', published: true },
  { slug: 'keys-and-values', title: 'Which answer belongs under this key?', description: 'Request identity, shared answers, serialisation and Redis data types.', published: false },
  { slug: 'freshness', title: 'How old is this answer?', description: 'Expiry, invalidation, concurrent fills and the promises a copy can make.', published: false },
  { slug: 'stampedes', title: 'When everyone misses together', description: 'Coalescing requests, refreshes and the limits of leases.', published: false },
  { slug: 'memory', title: 'Making room for useful answers', description: 'Working sets, admission, eviction and the memory Redis really needs.', published: false },
  { slug: 'the-redis-server', title: 'Inside a Redis request', description: 'Commands, data structures, execution queues and atomic operations.', published: false },
  { slug: 'clients-and-latency', title: 'The journey between application and Redis', description: 'Connections, pipelining, deadlines, retries and local copies.', published: false },
  { slug: 'failure-and-overload', title: 'When the fast path disappears', description: 'Origin capacity, load shedding and controlled recovery.', published: false },
  { slug: 'replication-and-failover', title: 'A second copy is not the same promise', description: 'Replication, Sentinel, stale reads and lost writes.', published: false },
  { slug: 'clustering', title: 'Dividing the keyspace', description: 'Slots, redirects, resharding, hot keys and cluster failure.', published: false },
  { slug: 'persistence-and-recovery', title: 'What should survive a restart?', description: 'Snapshots, logs, recovery and the freshness of restored data.', published: false },
  { slug: 'coordination', title: 'When Redis stops being just a cache', description: 'Counters, rate limits, sessions, queues and correctness boundaries.', published: false },
  { slug: 'operating-redis', title: 'Keeping Redis useful in production', description: 'Observation, security, upgrades, capacity and operational judgement.', published: false },
  { slug: 'designing-a-cache', title: 'Designing the whole path', description: 'Build, measure and break a complete application caching design.', published: false },
];
export const cachingHref = (slug: string) => cachingHome + (slug ? `${slug}/` : '');
