/** Reading map with available drafts and explicitly requested planned outlines.
 * An omitted status means planned; a draft is reading, not an authorised publication.
 */
export interface RelationalArticle { slug: string; title: string; description: string; scope: string; status?: 'draft'; }
export interface RelationalGroup { id: string; title: string; overviewAnchor: string; articles: RelationalArticle[]; }
export const relationalCollection: RelationalGroup[] = [
  {
    "id": "design",
    "title": "Designing your data",
    "overviewAnchor": "relationships",
    "articles": [
      {
        "slug": "modelling",
        "title": "Designing a relational schema",
        "description": "Work from an application's facts to tables, relationships, and a design that survives change.",
        "scope": "Choose identities, types and units; use normalisation to separate shared facts, and preserve purchase history as facts of its own.",
        "status": "draft"
      },
      {
        "slug": "constraints",
        "title": "Constraints",
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
    "articles": [
      {
        "slug": "query-results",
        "title": "Queries and joins",
        "description": "Follow records through filters, joins and totals, and see where extra result rows come from.",
        "scope": "Introduce SQL result meaning and syntax, then work through matching, missing values, aggregation, multiplied rows and existence tests.",
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
    "title": "Transactions and concurrent work",
    "overviewAnchor": "transactions",
    "articles": [
      {
        "slug": "transaction-boundaries",
        "title": "What belongs in one transaction?",
        "description": "Choose which changes need to succeed or fail together.",
        "scope": "Work from a concrete business rule to a transaction boundary. Explain what happens when payment or another outside service is involved.",
        "status": "draft"
      },
      {
        "slug": "concurrent-updates",
        "title": "When two requests change the same data",
        "description": "Explain how overlapping requests can break an application rule.",
        "scope": "Compare a stale read and write with conditional updates and locking reads. Explain affected rows and protecting the decision, with broader isolation and retry handling in their own articles.",
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
        "title": "Handling waits, deadlocks, and retries",
        "description": "Respond correctly when a transaction cannot proceed or its outcome is unknown.",
        "scope": "Separate waiting, a rejected transaction, and a lost response after a possible commit. Cover retry boundaries and outside effects; diagnosing a slow service belongs in the performance branch.",
        "status": "draft"
      }
    ]
  },
  {
    "id": "internals",
    "title": "How the database works",
    "overviewAnchor": "tables",
    "articles": [
      {
        "slug": "storage",
        "title": "How records are stored and retrieved",
        "description": "Follow records through pages, memory, and storage.",
        "scope": "Use an explicitly identified row-oriented engine to explain the cost of accessing data. A relational interface does not require this physical layout."
      },
      {
        "slug": "indexes",
        "title": "How indexes work",
        "description": "See how an index locates records and what it costs to maintain.",
        "scope": "Trace a lookup and a change through a search structure. Practical index selection has its own article."
      },
      {
        "slug": "join-algorithms",
        "title": "How joins work",
        "description": "Compare ways to find matching records in separate tables.",
        "scope": "Start with an understood join result, then compare execution strategies and their costs. Query meaning belongs in the query-writing article."
      },
      {
        "slug": "query-execution",
        "title": "From SQL to an execution plan",
        "description": "Understand how the database turns a request into work.",
        "scope": "Follow parsing, planning, and execution for a small query. Explain alternative strategies without becoming a performance investigation guide."
      },
      {
        "slug": "commit-and-recovery",
        "title": "What happens when a write commits?",
        "description": "Understand how a database makes changes recoverable.",
        "scope": "Follow changes in memory, logging, persistence, and recovery through one failure. Identify the engine and durability settings used in the explanation."
      }
    ]
  },
  {
    "id": "performance",
    "title": "Understanding and improving performance",
    "overviewAnchor": "indexes",
    "articles": [
      {
        "slug": "slow-queries",
        "title": "Investigating a slow query",
        "description": "Find where a query spends its time using plans and measurements.",
        "scope": "Compare estimated and observed work in one investigation. Explain plan notation locally and distinguish excess work from waiting."
      },
      {
        "slug": "choosing-indexes",
        "title": "Choosing indexes for your queries",
        "description": "Choose an access path for a particular query and workload.",
        "scope": "Relate filters, ordering, column order, and coverage to index choices. Check the proposed benefit against an execution plan and the cost of writes."
      },
      {
        "slug": "request-cost",
        "title": "Understanding the database work behind a request",
        "description": "Trace the queries, connections, and round trips created by an application request.",
        "scope": "Inspect ORM-generated work, repeated queries, batching, and transaction scope. Keep application request cost distinct from one query’s execution plan."
      },
      {
        "slug": "diagnosing-waits",
        "title": "Diagnosing database waits",
        "description": "Distinguish connection, lock, storage, and resource waits.",
        "scope": "Investigate a stalled request using observations. Link to transaction handling when the diagnosis calls for changing how the application responds."
      },
      {
        "slug": "reporting",
        "title": "Reporting on operational data",
        "description": "Understand when reports interfere with everyday requests.",
        "scope": "Compare aggregation and precomputed results within an existing database. Use measured workload pressure to motivate a separate analytical system."
      },
      {
        "slug": "performance-testing",
        "title": "Testing a change before trusting it",
        "description": "Check whether a proposed improvement survives a representative workload.",
        "scope": "Choose data, measurements, and comparisons that expose regressions as well as gains. Avoid treating a small synthetic speedup as production evidence."
      }
    ]
  },
  {
    "id": "operations",
    "title": "Running and evolving the database",
    "overviewAnchor": "choice",
    "articles": [
      {
        "slug": "access-and-lifecycle",
        "title": "Controlling access and managing the data lifecycle",
        "description": "Decide who can use data and what must happen when it is removed.",
        "scope": "Keep access-control and retention/deletion outcomes distinct in the commission. This broad candidate may become two articles once the examples are developed."
      },
      {
        "slug": "backup-and-restore",
        "title": "Backups you can actually recover from",
        "description": "Establish whether a backup can restore the service you need.",
        "scope": "Work through a tested restore and its time and data-loss requirements. Distinguish having backup files from a verified recovery procedure."
      },
      {
        "slug": "schema-changes",
        "title": "Changing a schema while the application runs",
        "description": "Plan a change while old and new application versions coexist.",
        "scope": "Work through compatibility, migration, backfill, and locking concerns for one schema change."
      },
      {
        "slug": "maintenance",
        "title": "Keeping a database healthy over time",
        "description": "Recognise how accumulated work and changing data affect an engine.",
        "scope": "Use a concrete growth or maintenance problem to explain statistics, upkeep, and useful observations. Engine-specific cleanup belongs in the PostgreSQL collection."
      },
      {
        "slug": "replicas-and-failover",
        "title": "Replicas and failover",
        "description": "Understand what another copy of the database can and cannot provide.",
        "scope": "Separate read capacity, replication lag, failover, and recovery limits in a bounded database scenario."
      }
    ]
  },
  {
    "id": "products",
    "title": "Choosing products and recognising limits",
    "overviewAnchor": "choice",
    "articles": [
      {
        "slug": "embedded-databases",
        "title": "When an embedded database fits",
        "description": "Decide whether the engine should run inside the application.",
        "scope": "Use SQLite to examine the embedded/server choice, including deployment and concurrent use. Readers can enter this comparison without an internals course."
      },
      {
        "slug": "product-comparison",
        "title": "PostgreSQL, MySQL, and SQL Server",
        "description": "Compare consequential product differences for stated application needs.",
        "scope": "Research deployment, behaviour, operating work, and relevant edition or service limits. This placeholder establishes no ranking or current suitability claim."
      },
      {
        "slug": "adding-another-system",
        "title": "When should you add another system?",
        "description": "Weigh another service against capabilities in the existing database.",
        "scope": "Compare documents, search, vectors, or analytics for a concrete workload, including resource competition and the cost of keeping copies current."
      }
    ]
  },
  {
    "id": "postgresql",
    "title": "Inside PostgreSQL",
    "overviewAnchor": "choice",
    "articles": [
      {
        "slug": "postgresql/architecture",
        "title": "PostgreSQL architecture — an overview",
        "description": "Connect PostgreSQL’s major components to their roles in a read and a write.",
        "scope": "Establish the implementation’s shape without repeating the relational introduction. Reassess overlap with the query tour when commissioning."
      },
      {
        "slug": "postgresql/query-execution",
        "title": "Following a query through PostgreSQL",
        "description": "Follow PostgreSQL’s implementation of planning and execution.",
        "scope": "Trace buffers and access paths for one query, extending the family explanation with implementation detail rather than teaching SQL again."
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
      },
      {
        "slug": "postgresql/extensions",
        "title": "Extending PostgreSQL",
        "description": "Evaluate an extension as part of a running database.",
        "scope": "Distinguish core features from extensions through one concrete capability and its operating consequences. This is not a catalogue or a claim of production readiness."
      }
    ]
  }
];
export const relationalArticleHref = (slug: string) => `/learn/databases/relational/${slug}/`;
