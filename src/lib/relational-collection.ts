/** Main deep dives and their further reading. Omitted status means planned. */
export interface RelationalArticle { slug: string; title: string; description: string; scope: string; status?: 'draft' | 'published'; }
export interface RelationalGroup { id: string; title: string; overviewAnchor: string; main?: string; articles: RelationalArticle[]; }
export const relationalCollection: RelationalGroup[] = [
  {
    "id": "design",
    "title": "Designing your data",
    "overviewAnchor": "relationships",
    "main": "modelling",
    "articles": [
      {
        "slug": "modelling",
        "title": "Designing your data",
        "description": "Derive a relational schema, protect its rules, and choose how to represent its facts.",
        "scope": "Connect identity, types, relationships, normalisation and history with constraints and the choice between related rows and JSON.",
        "status": "published"
      },
      {
        "slug": "constraints",
        "title": "Constraints in depth",
        "description": "Make the database enforce your schema's rules, and recognise where those rules stop.",
        "scope": "Work through required values, uniqueness, checks, and foreign keys, including rules that require coordination across records.",
        "status": "published"
      },
      {
        "slug": "tables-and-documents",
        "title": "Tables and JSON",
        "description": "Choose what belongs in columns, related rows, and a document inside a record.",
        "scope": "Compare structured columns, related tables, and embedded attributes for the same application. Keep data modelling separate from choosing another service.",
        "status": "published"
      }
    ]
  },
  {
    "id": "queries",
    "title": "Querying your data",
    "overviewAnchor": "queries",
    "main": "query-results",
    "articles": [
      {
        "slug": "query-results",
        "title": "Querying your data",
        "description": "Express a question, check its answer, and follow the work that produces it.",
        "scope": "Develop filters, joins, missing matches, grouping and cardinality, then trace a concrete execution plan.",
        "status": "published"
      },
      {
        "slug": "query-execution",
        "title": "How a query runs",
        "description": "Compare execution strategies that produce the same answer.",
        "scope": "Follow scans, join algorithms, sorting and aggregation through plans, statistics and estimates. Explain when a different strategy changes the work.",
        "status": "published"
      },
      {
        "slug": "large-results",
        "title": "Pagination and large results",
        "description": "Compare ways to continue through a result when records can change between pages.",
        "scope": "Compare ordering, pagination, and batching while records change. Explain the application’s required guarantees before choosing a method.",
        "status": "published"
      }
    ]
  },
  {
    "id": "transactions",
    "title": "Transactions and concurrency",
    "overviewAnchor": "transactions",
    "main": "transaction-boundaries",
    "articles": [
      {
        "slug": "transaction-boundaries",
        "title": "Transactions and concurrency",
        "description": "Keep related changes correct while requests overlap and fail.",
        "scope": "Connect atomicity and boundaries to conditional updates, locks, snapshots, isolation, retries and uncertain commit outcomes.",
        "status": "published"
      },
      {
        "slug": "isolation",
        "title": "Isolation and snapshots",
        "description": "See which changes a transaction can read, and why a stable view does not prevent every race.",
        "scope": "Use a small schedule to explain isolation and snapshots, identifying which behaviour depends on the engine.",
        "status": "published"
      },
      {
        "slug": "conflicts-and-retries",
        "title": "Handling conflicts and uncertain outcomes",
        "description": "Respond correctly when a transaction cannot proceed or its outcome is unknown.",
        "scope": "Separate waiting, a rejected transaction, and a lost response after a possible commit. Cover retry boundaries and outside effects; diagnosing a slow service belongs in the performance branch.",
        "status": "published"
      }
    ]
  },
  {
    "id": "indexes",
    "title": "Indexes",
    "overviewAnchor": "indexes",
    "main": "indexes",
    "articles": [
      {
        "slug": "indexes",
        "title": "Indexes",
        "description": "Connect an index's structure to the queries it helps and the work it adds.",
        "scope": "Develop ordered lookups, ranges, heaps and clustered tables, composite keys and what an index does with each condition, sorting, covering access and selectivity. Weigh table fetches, storage, writes and key choice, then design and verify an index for a query.",
        "status": "published"
      },
      {
        "slug": "indexing-queries",
        "title": "Indexing queries: diagnosis and patterns",
        "description": "Find out why a query ignores an index you expected it to use, and choose the index for the query shapes that recur in every application.",
        "scope": "Read index use in four engines' plans, then diagnose wrapped columns, type mismatches, LIKE, the missing leading column, OR, broad conditions, stale statistics and parameters. Work through sorted lists with a limit, the latest row per group, joins and foreign keys, queues, soft deletes, case-insensitive lookups and optional filters.",
        "status": "draft"
      },
      {
        "slug": "maintaining-indexes",
        "title": "Maintaining indexes",
        "description": "Keep indexes the right size, rebuild and build them safely, and remove the ones that cost more than they save.",
        "scope": "Measure index size and density in four engines, decide when a rebuild is worth it and what each engine's rebuild locks, build on a live table, find unused, duplicate and invalid indexes, rehearse a drop and replace an index in production.",
        "status": "draft"
      }
    ]
  },
  {
    "id": "storage",
    "title": "Storage and durability",
    "overviewAnchor": "tables",
    "main": "storage",
    "articles": [
      {
        "slug": "storage",
        "title": "Storage and durability",
        "description": "Follow a row through pages, memory, the log and crash recovery, and choose what a crash may take away.",
        "scope": "Explain pages, what a row and a large value cost, the buffer pool, where old versions live, the write-ahead log and group commit, crash recovery, the trust placed in a flush and the durability settings, in PostgreSQL with InnoDB, SQL Server and SQLite compared.",
        "status": "published"
      },
      {
        "slug": "buffer-pool",
        "title": "The buffer pool",
        "description": "Size the page cache against the working set and memory, and get it warm again after a restart.",
        "scope": "Explain what the pool should hold, the two caches, sizing against memory, scans that push hot pages out and warm-up after a restart or failover, in PostgreSQL, InnoDB, SQL Server and SQLite.",
        "status": "draft"
      },
      {
        "slug": "checkpoints-and-the-log",
        "title": "Checkpoints, torn pages and the log",
        "description": "Choose how often to checkpoint, survive torn pages, decide whether a flush can be trusted and keep the log from filling the disk.",
        "scope": "Size checkpoints from a recovery-time target, compare torn-page protection, test a volume's flush, find what holds the log and estimate restart time, then read four incidents, in PostgreSQL, InnoDB, SQL Server and SQLite.",
        "status": "draft"
      }
    ]
  },
  {
    "id": "performance",
    "title": "Understanding database performance",
    "overviewAnchor": "indexes",
    "main": "slow-queries",
    "articles": [
      {
        "slug": "slow-queries",
        "title": "Understanding database performance",
        "description": "Trace a request through application work, query execution and waits, then verify an improvement.",
        "scope": "Begin with connections, generated queries and round trips; use plans and observations to distinguish work from waiting. Account for changing statistics and upkeep, and validate changes under representative conditions.",
        "status": "published"
      },
      {
        "slug": "request-cost",
        "title": "The database work behind an application request",
        "description": "Trace the queries, connections, and round trips created by an application request.",
        "scope": "Inspect ORM-generated work, repeated queries, batching, and transaction scope. Keep application request cost distinct from one query’s execution plan.",
        "status": "published"
      },
      {
        "slug": "reporting",
        "title": "Reporting on operational data",
        "description": "Understand when reports interfere with everyday requests.",
        "scope": "Compare aggregation and precomputed results within an existing database. Use measured workload pressure to motivate a separate analytical system.",
        "status": "published"
      }
    ]
  },
  {
    "id": "scaling",
    "title": "Scaling a relational database",
    "overviewAnchor": "scaling",
    "main": "scaling",
    "articles": [
      {
        "slug": "scaling",
        "title": "Scaling a relational database",
        "description": "Find the limit and understand the arrangements that could meet it.",
        "scope": "Develop work reduction, larger instances, caching, replicas, clusters, partitioning and sharding. Trace where reads and writes go, what remains shared, and what happens when a node or region fails.",
        "status": "published"
      },
      {
        "slug": "replicas-and-failover",
        "title": "Replication and failover",
        "description": "Understand what another copy of the database can and cannot provide.",
        "scope": "Follow copying, acknowledgements, read routing and freshness, writer promotion and authority, failure domains and regional failures through concrete scenarios.",
        "status": "published"
      },
      {
        "slug": "partitioning-and-sharding",
        "title": "Partitioning and sharding",
        "description": "Develop the choices behind dividing tables and distributing data ownership.",
        "scope": "Work through keys, pruning, co-location, routing, hot tenants, cross-shard queries and rules. Follow safe data movement, verification and cutover while writes continue; distinguish local partitions from distributed ownership.",
        "status": "published"
      }
    ]
  },
  {
    "id": "operations",
    "title": "Operating and evolving the database",
    "overviewAnchor": "choice",
    "articles": [
      {
        "slug": "schema-changes",
        "title": "Changing a schema while the application runs",
        "description": "Plan a change while old and new application versions coexist.",
        "scope": "Work through compatibility, migration, backfill, and locking concerns for one schema change.",
        "status": "published"
      },
      {
        "slug": "backup-and-restore",
        "title": "Backups and recovery",
        "description": "Establish whether a backup can restore the service you need.",
        "scope": "Work through a tested restore and its time and data-loss requirements. Distinguish having backup files from a verified recovery procedure.",
        "status": "published"
      },
      {
        "slug": "access-control",
        "title": "Controlling access",
        "description": "Decide which people and applications may read or change the data.",
        "scope": "Work through identities, roles, privileges, least privilege and useful audit boundaries in a concrete application.",
        "status": "published"
      },
      {
        "slug": "data-lifecycle",
        "title": "Retention and deletion",
        "description": "Follow data through its useful life and its removal.",
        "scope": "Trace related records, history, replicas, exports and backups, including partition expiry. Explain what the process removes immediately and what remains in retained copies.",
        "status": "published"
      }
    ]
  },
  {
    "id": "products",
    "title": "Choosing a relational database",
    "overviewAnchor": "choice",
    "main": "product-comparison",
    "articles": [
      {
        "slug": "product-comparison",
        "title": "Choosing a relational database",
        "description": "Compare relational products and deployment choices for stated application needs.",
        "scope": "Develop embedded versus server deployment alongside PostgreSQL, MySQL, SQL Server and SQLite. Compare consequential behaviour, operating work and relevant edition or service limits using current evidence.",
        "status": "published"
      }
    ]
  },
  {
    "id": "additional-systems",
    "title": "When should you add another system?",
    "overviewAnchor": "choice",
    "main": "adding-another-system",
    "articles": [
      {
        "slug": "adding-another-system",
        "title": "When should you add another system?",
        "description": "Weigh another service against capabilities in the existing database.",
        "scope": "Develop one workload to compare native capabilities, extensions and specialised access methods with a separate service. Account for resource competition, operating effort and keeping copies current; link to the relevant family explanations.",
        "status": "published"
      }
    ]
  },
  {
    "id": "postgresql",
    "title": "Inside PostgreSQL",
    "overviewAnchor": "choice",
    "main": "postgresql/architecture",
    "articles": [
      {
        "slug": "postgresql/architecture",
        "title": "Inside PostgreSQL",
        "description": "Follow a read and a committed change through PostgreSQL's implementation.",
        "scope": "Connect processes, buffers, heap and index access, planning, visibility, locks, logging, checkpoints, restart and eventual cleanup through an actual read/write journey.",
        "status": "published"
      },
      {
        "slug": "postgresql/query-execution",
        "title": "Planning and executing a PostgreSQL query",
        "description": "Follow parameters, estimates and execution through a PostgreSQL plan.",
        "scope": "Derive custom and generic prepared-plan choices, executor work and resource consequences from observed PostgreSQL plans.",
        "status": "published"
      },
      {
        "slug": "postgresql/indexes",
        "title": "Indexes in PostgreSQL",
        "description": "Understand PostgreSQL’s access methods and the workloads they support.",
        "scope": "Choose a bounded comparison of index implementations and specialised methods. General lookup principles remain in the family index article.",
        "status": "published"
      },
      {
        "slug": "postgresql/row-versions",
        "title": "Row versions, transactions, and vacuum",
        "description": "Understand visibility, cleanup, and the effects of long-running work.",
        "scope": "Follow record versions through transactions and cleanup in PostgreSQL, making the operational consequence of retained versions visible.",
        "status": "published"
      },
      {
        "slug": "postgresql/recovery",
        "title": "WAL, checkpoints, and recovery",
        "description": "Follow a committed change through PostgreSQL’s recovery machinery.",
        "scope": "Connect the shared durability explanation to PostgreSQL’s log, checkpoints, and recovery, with explicit version and configuration boundaries.",
        "status": "published"
      },
      {
        "slug": "postgresql/replication",
        "title": "Following a change to another PostgreSQL server",
        "description": "Follow WAL across servers and design for lag, promotion and lost acknowledgements.",
        "scope": "Distinguish send, flush and replay positions; derive physical and logical replication guarantees, retention, read routing and safe writer authority.",
        "status": "published"
      },
      {
        "slug": "postgresql/sharding",
        "title": "Where distributed PostgreSQL work runs",
        "description": "Choose data ownership and query boundaries before distributing writes.",
        "scope": "Compare native partitions, application sharding, Citus and foreign tables; derive co-location, constraint scope, skew and safe movement.",
        "status": "published"
      },
      {
        "slug": "postgresql/json",
        "title": "JSON queries in PostgreSQL",
        "description": "Preserve document relationships and match indexes to the expressions you query.",
        "scope": "Derive correlated array predicates, SQL/JSON rows, GIN expression matching, guarded numeric indexes and document write costs.",
        "status": "published"
      },
      {
        "slug": "postgresql/full-text-search",
        "title": "Full-text search in PostgreSQL",
        "description": "Follow documents through lexemes, matching, ranking and indexed retrieval.",
        "scope": "Develop configurations, positions, phrase matching, weighted ranking and filtered GIN retrieval with concrete search results.",
        "status": "published"
      },
      {
        "slug": "postgresql/vector-search",
        "title": "Vector search in PostgreSQL",
        "description": "Compare exact and approximate neighbours while preserving eligibility filters.",
        "scope": "Separate embedding relevance from retrieval recall, examine pgvector index choices and derive filtered approximate-search tradeoffs.",
        "status": "published"
      },
      {
        "slug": "postgresql/extensions",
        "title": "Types and extensions in PostgreSQL",
        "description": "Use temporal and spatial examples to understand PostgreSQL’s extensibility.",
        "scope": "Connect ranges, exclusion constraints, specialised operators and index methods to extension installation, lifecycle and operational dependencies.",
        "status": "published"
      }
    ]
  }
];
/** Former outlines point to the article that now owns their explanation. */
export const relationalAliases: Record<string, string> = {
  "choosing-indexes": "indexes",
  "join-algorithms": "query-execution",
  "commit-and-recovery": "storage",
  "watching-storage": "checkpoints-and-the-log",
  "diagnosing-waits": "slow-queries",
  "performance-testing": "slow-queries",
  "maintenance": "slow-queries",
  "embedded-databases": "product-comparison",
  "access-and-lifecycle": "access-control"
};
export const relationalArticleHref = (slug: string) => `/learn/databases/relational/${slug}/`;
