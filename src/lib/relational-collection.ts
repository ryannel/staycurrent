/** Main deep dives and their further reading. Omitted status means planned. */
export interface RelationalArticle { slug: string; title: string; description: string; scope: string; status?: 'draft'; }
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
        "status": "draft"
      },
      {
        "slug": "constraints",
        "title": "Constraints in depth",
        "description": "Make the database enforce your schema's rules, and recognise where those rules stop.",
        "scope": "Work through required values, uniqueness, checks, and foreign keys, including rules that require coordination across records.",
        "status": "draft"
      },
      {
        "slug": "tables-and-documents",
        "title": "Tables and JSON",
        "description": "Choose what belongs in columns, related rows, and a document inside a record.",
        "scope": "Compare structured columns, related tables, and embedded attributes for the same application. Keep data modelling separate from choosing another service.",
        "status": "draft"
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
        "status": "draft"
      },
      {
        "slug": "query-execution",
        "title": "How a query runs",
        "description": "Compare execution strategies that produce the same answer.",
        "scope": "Follow scans, join algorithms, sorting and aggregation through plans, statistics and estimates. Explain when a different strategy changes the work.",
        "status": "draft"
      },
      {
        "slug": "large-results",
        "title": "Pagination and large results",
        "description": "Compare ways to continue through a result when records can change between pages.",
        "scope": "Compare ordering, pagination, and batching while records change. Explain the application’s required guarantees before choosing a method.",
        "status": "draft"
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
        "status": "draft"
      },
      {
        "slug": "isolation",
        "title": "Isolation and snapshots",
        "description": "See which changes a transaction can read, and why a stable view does not prevent every race.",
        "scope": "Use a small schedule to explain isolation and snapshots, identifying which behaviour depends on the engine.",
        "status": "draft"
      },
      {
        "slug": "conflicts-and-retries",
        "title": "Handling conflicts and uncertain outcomes",
        "description": "Respond correctly when a transaction cannot proceed or its outcome is unknown.",
        "scope": "Separate waiting, a rejected transaction, and a lost response after a possible commit. Cover retry boundaries and outside effects; diagnosing a slow service belongs in the performance branch.",
        "status": "draft"
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
        "scope": "Develop ordered lookups, ranges, composite keys, filtering, sorting, covering access and selectivity. Weigh table fetches, storage and writes, then verify an index choice.",
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
        "description": "Follow records through memory, persistent storage and recovery after a crash.",
        "scope": "Connect record placement, pages and buffers to changes, logging, checkpoints and restart in an identified engine. Explain the durability promise and which failures require another copy.",
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
        "status": "draft"
      },
      {
        "slug": "request-cost",
        "title": "The database work behind an application request",
        "description": "Trace the queries, connections, and round trips created by an application request.",
        "scope": "Inspect ORM-generated work, repeated queries, batching, and transaction scope. Keep application request cost distinct from one query’s execution plan.",
        "status": "draft"
      },
      {
        "slug": "reporting",
        "title": "Reporting on operational data",
        "description": "Understand when reports interfere with everyday requests.",
        "scope": "Compare aggregation and precomputed results within an existing database. Use measured workload pressure to motivate a separate analytical system.",
        "status": "draft"
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
        "scope": "Develop work reduction, larger instances, caching, replicas, clusters, partitioning and sharding. Trace where reads and writes go, what remains shared, and what happens when a node or region fails."
      },
      {
        "slug": "replicas-and-failover",
        "title": "Replication and failover",
        "description": "Understand what another copy of the database can and cannot provide.",
        "scope": "Follow copying, acknowledgements, read routing and freshness, writer promotion and authority, failure domains and regional failures through concrete scenarios."
      },
      {
        "slug": "partitioning-and-sharding",
        "title": "Partitioning and sharding",
        "description": "Develop the choices behind dividing tables and distributing data ownership.",
        "scope": "Work through keys, pruning, co-location, routing, hot tenants, cross-shard queries and rules. Follow safe data movement, verification and cutover while writes continue; distinguish local partitions from distributed ownership."
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
        "scope": "Work through compatibility, migration, backfill, and locking concerns for one schema change."
      },
      {
        "slug": "backup-and-restore",
        "title": "Backups and recovery",
        "description": "Establish whether a backup can restore the service you need.",
        "scope": "Work through a tested restore and its time and data-loss requirements. Distinguish having backup files from a verified recovery procedure."
      },
      {
        "slug": "access-control",
        "title": "Controlling access",
        "description": "Decide which people and applications may read or change the data.",
        "scope": "Work through identities, roles, privileges, least privilege and useful audit boundaries in a concrete application."
      },
      {
        "slug": "data-lifecycle",
        "title": "Retention and deletion",
        "description": "Follow data through its useful life and its removal.",
        "scope": "Trace related records, history, replicas, exports and backups, including partition expiry. Explain what the process removes immediately and what remains in retained copies."
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
        "scope": "Develop embedded versus server deployment alongside PostgreSQL, MySQL, SQL Server and SQLite. Compare consequential behaviour, operating work and relevant edition or service limits using current evidence."
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
        "scope": "Develop one workload to compare native capabilities, extensions and specialised access methods with a separate service. Account for resource competition, operating effort and keeping copies current; link to the relevant family explanations."
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
        "scope": "Connect processes, buffers, heap and index access, planning, visibility, locks, logging, checkpoints, restart and eventual cleanup through an actual read/write journey."
      },
      {
        "slug": "postgresql/indexes",
        "title": "Indexes in PostgreSQL",
        "description": "Understand PostgreSQL’s access methods and the workloads they support.",
        "scope": "Choose a bounded comparison of index implementations and specialised methods. General lookup principles remain in the family index article."
      },
      {
        "slug": "postgresql/row-versions",
        "title": "Row versions, transactions, and vacuum",
        "description": "Understand visibility, cleanup, and the effects of long-running work.",
        "scope": "Follow record versions through transactions and cleanup in PostgreSQL, making the operational consequence of retained versions visible."
      },
      {
        "slug": "postgresql/recovery",
        "title": "WAL, checkpoints, and recovery",
        "description": "Follow a committed change through PostgreSQL’s recovery machinery.",
        "scope": "Connect the shared durability explanation to PostgreSQL’s log, checkpoints, and recovery, with explicit version and configuration boundaries."
      }
    ]
  }
];
/** Former outlines point to the article that now owns their explanation. */
export const relationalAliases: Record<string, string> = {
  "choosing-indexes": "indexes",
  "join-algorithms": "query-execution",
  "commit-and-recovery": "storage",
  "diagnosing-waits": "slow-queries",
  "performance-testing": "slow-queries",
  "maintenance": "slow-queries",
  "embedded-databases": "product-comparison",
  "access-and-lifecycle": "access-control",
  "postgresql/query-execution": "postgresql/architecture",
  "postgresql/extensions": "adding-another-system"
};
export const relationalArticleHref = (slug: string) => `/learn/databases/relational/${slug}/`;
