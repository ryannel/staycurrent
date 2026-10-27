// Reading order and publication state for the application caching collection.
// Only `published` entries reach normal builds, reading, search and navigation.
// Planned entries render only under CACHING_DRAFT_PREVIEW=1 (see the route in
// src/pages/learn/databases/caching/[...slug].astro). The plan, with each
// article's coverage, is docs/article-work/caching-2026-10-27/plan.md.
import type { ArticleType } from './article-types';

export const cachingHome = '/learn/databases/caching/';
export const cachingTitle = 'Application caching with Redis';

export type CachingStatus = 'planned' | 'published';
export interface CachingEntry {
  /** '' is the introduction, served at cachingHome. Fixed once published. */
  slug: string;
  title: string;
  description: string;
  status: CachingStatus;
  type: ArticleType;
}

export const cachingCollection: CachingEntry[] = [
  { slug: '', title: 'Application caching with Redis', type: 'Introduction', status: 'published',
    description: 'Why applications cache, how hit ratio sets latency and database load, and where Redis fits.' },
  { slug: 'caching-patterns', title: 'Caching patterns: cache-aside, read-through, write-through and write-behind', type: 'Deep dive', status: 'published',
    description: 'How each caching pattern reads and writes, how it fails, and how to choose one for a workload.' },
  { slug: 'keys-and-values', title: 'Cache keys and cached values', type: 'Deep dive', status: 'published',
    description: 'What to cache, how to name it, and how to store values so they stay small, correct and reusable.' },
  { slug: 'expiration-and-eviction', title: 'Cache expiration and eviction', type: 'Deep dive', status: 'published',
    description: 'How time to live bounds staleness, how Redis expires keys, and how its eviction policies choose what to remove.' },
  { slug: 'invalidation', title: 'Cache invalidation and consistency', type: 'Deep dive', status: 'published',
    description: 'Keeping cached values close to the database, the races that leave stale data behind, and how to prevent them.' },
  { slug: 'stampedes', title: 'Cache stampedes and the thundering herd', type: 'Deep dive', status: 'published',
    description: 'Why many simultaneous misses overload a database, and the locking, coalescing and early-refresh techniques that prevent it.' },
  { slug: 'how-redis-works', title: 'How Redis works: the event loop, data structures and memory', type: 'Deep dive', status: 'published',
    description: 'How one Redis process executes commands, stores data and spends memory, and what makes a command slow.' },
  { slug: 'clients-and-pipelining', title: 'Redis clients: round trips, pipelining and atomic operations', type: 'Deep dive', status: 'planned',
    description: 'What a request to Redis costs, how pipelining and batching reduce it, and how to make changes atomic.' },
  { slug: 'replication-and-persistence', title: 'Redis replication, persistence and failover', type: 'Deep dive', status: 'planned',
    description: 'What snapshots, the append-only file and replicas protect, what each can lose, and how Sentinel fails over.' },
  { slug: 'cluster-and-hot-keys', title: 'Redis Cluster, sharding and hot keys', type: 'Deep dive', status: 'planned',
    description: 'How Redis Cluster spreads keys across shards, and how to find and relieve keys that concentrate load.' },
  { slug: 'operating-a-cache', title: 'Operating a cache: monitoring, capacity and failure', type: 'Deep dive', status: 'planned',
    description: 'Running a cache as a load-bearing dependency: what to measure, how to size it, and how to survive its failure.' },
  { slug: 'designing-a-cache', title: 'Designing a cache: a worked example', type: 'Worked example', status: 'planned',
    description: 'One application taken from requirements to a complete cache design, applying every earlier decision.' },
];

export const cachingHref = (slug: string) => (slug ? `${cachingHome}${slug}/` : cachingHome);

/** Entries available to readers, in reading order. */
export const publishedCaching = () => cachingCollection.filter(entry => entry.status === 'published');

/** The introduction's title as it reads in lists outside the collection. */
export const cachingListTitle = (entry: CachingEntry) => (entry.slug ? entry.title : `${cachingTitle}: an introduction`);

