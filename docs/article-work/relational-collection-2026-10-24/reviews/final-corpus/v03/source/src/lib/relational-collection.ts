/** Published reading, grouped by the work the reader needs to do. */
export interface RelationalArticle { id?: string; slug: string; title: string; description: string; scope: string; status?: 'draft' | 'published'; }
export interface RelationalGroup { id: string; title: string; overviewAnchor: string; main?: string; articles: RelationalArticle[]; }
export const relationalIntroduction = {"id": "RL76", "slug": "", "title": "Relational databases: introduction and choices"};
export const relationalCollection: RelationalGroup[] = [
  {
    "id": "design",
    "title": "Design facts and guarantees",
    "overviewAnchor": "collection",
    "articles": [
      {
        "id": "RL77",
        "slug": "modelling",
        "title": "Relations, keys and normalisation",
        "description": "Choose what one row means, give it an identity, and separate facts that change independently without losing the price agreed on an order.",
        "scope": "Choose what one row means, give it an identity, and separate facts that change independently without losing the price agreed on an order.",
        "status": "published"
      },
      {
        "id": "RL78",
        "slug": "values",
        "title": "Values, missing data and equality",
        "description": "Make money, time, text and missing values compare as the application intends, then follow a NULL into a broken unpaid-orders query.",
        "scope": "Make money, time, text and missing values compare as the application intends, then follow a NULL into a broken unpaid-orders query.",
        "status": "published"
      },
      {
        "id": "RL79",
        "slug": "constraints",
        "title": "Constraints and tenant boundaries",
        "description": "Place each workshop rule in a row constraint, a reference, an access policy or a concurrency protocol, then try to break it from another writer.",
        "scope": "Place each workshop rule in a row constraint, a reference, an access policy or a concurrency protocol, then try to break it from another writer.",
        "status": "published"
      },
      {
        "id": "RL80",
        "slug": "data-lifecycle",
        "title": "History, correction and deletion",
        "description": "Preserve an agreement, distinguish when a fact applied from when it became known, and trace what a correction or deletion changes.",
        "scope": "Preserve an agreement, distinguish when a fact applied from when it became known, and trace what a correction or deletion changes.",
        "status": "published"
      }
    ]
  },
  {
    "id": "queries",
    "title": "Query and change the right rows",
    "overviewAnchor": "collection",
    "articles": [
      {
        "id": "RL81",
        "slug": "query-results",
        "title": "Joins and the meaning of a result row",
        "description": "Trace what each result row represents, then repair multiplied revenue, missing sessions and absence tests.",
        "scope": "Trace what each result row represents, then repair multiplied revenue, missing sessions and absence tests.",
        "status": "published"
      },
      {
        "id": "RL82",
        "slug": "aggregates-and-windows",
        "title": "Aggregates, windows and ordered results",
        "description": "Build grouped totals and per-order calculations, then follow tied timestamps through window frames and rankings.",
        "scope": "Build grouped totals and per-order calculations, then follow tied timestamps through window frames and rankings.",
        "status": "published"
      },
      {
        "id": "RL83",
        "slug": "large-results",
        "title": "Pagination and consistent exports",
        "description": "Continue an ordered result without losing ties, then decide what a changing list and a fixed export each promise.",
        "scope": "Continue an ordered result without losing ties, then decide what a changing list and a fixed export each promise.",
        "status": "published"
      },
      {
        "id": "RL84",
        "slug": "updates-and-imports",
        "title": "Updates, upserts and bulk imports",
        "description": "Make each write's precondition and conflict rule explicit, then stage and reconcile a batch that contains duplicates, invalid rows and older versions.",
        "scope": "Make each write's precondition and conflict rule explicit, then stage and reconcile a batch that contains duplicates, invalid rows and older versions.",
        "status": "published"
      },
      {
        "id": "RL85",
        "slug": "application-sql",
        "title": "SQL at the application boundary",
        "description": "Follow bound values, generated queries and connection ownership from one request through its final result or error.",
        "scope": "Follow bound values, generated queries and connection ownership from one request through its final result or error.",
        "status": "published"
      }
    ]
  },
  {
    "id": "performance",
    "title": "Make query work affordable",
    "overviewAnchor": "collection",
    "articles": [
      {
        "id": "RL86",
        "slug": "indexes",
        "title": "Indexes and access paths",
        "description": "Follow B-tree entries to rows, count how column order and selectivity change the work, and weigh the saving against writes and maintenance.",
        "scope": "Follow B-tree entries to rows, count how column order and selectivity change the work, and weigh the saving against writes and maintenance.",
        "status": "published"
      },
      {
        "id": "RL87",
        "slug": "query-execution",
        "title": "Query execution and bad plans",
        "description": "Follow rows through scans, joins and retained state, then locate the estimate that turned one lookup into forty thousand.",
        "scope": "Follow rows through scans, joins and retained state, then locate the estimate that turned one lookup into forty thousand.",
        "status": "published"
      },
      {
        "id": "RL89",
        "slug": "partitioning",
        "title": "Table partitioning and data lifecycle",
        "description": "Split dated sessions into partitions, watch pruning narrow a query, and follow the enforcement and retention costs of that boundary.",
        "scope": "Split dated sessions into partitions, watch pruning narrow a query, and follow the enforcement and retention costs of that boundary.",
        "status": "published"
      }
    ]
  },
  {
    "id": "transactions",
    "title": "Concurrency and durable application work",
    "overviewAnchor": "collection",
    "articles": [
      {
        "id": "RL90",
        "slug": "transaction-boundaries",
        "title": "Transactions and isolation",
        "description": "Follow two workshop bookings through commit, snapshots, lost updates and write skew, then choose protection for the capacity rule.",
        "scope": "Follow two workshop bookings through commit, snapshots, lost updates and write skew, then choose protection for the capacity rule.",
        "status": "published"
      },
      {
        "id": "RL91",
        "slug": "locks-and-deadlocks",
        "title": "Locks, contention and deadlocks",
        "description": "Choose what a booking must lock, inspect real waiting and deadlocks, and repair a protocol that tries to lock a missing row.",
        "scope": "Choose what a booking must lock, inspect real waiting and deadlocks, and repair a protocol that tries to lock a missing row.",
        "status": "published"
      },
      {
        "id": "RL92",
        "slug": "storage",
        "title": "Row versions, storage and cleanup",
        "description": "Follow a changed price through old snapshots, physical row layouts and cleanup, then explain why a small logical table can retain a large file.",
        "scope": "Follow a changed price through old snapshots, physical row layouts and cleanup, then explain why a small logical table can retain a large file.",
        "status": "published"
      },
      {
        "id": "RL93",
        "slug": "conflicts-and-retries",
        "title": "Retries when a commit reply is missing",
        "description": "Recover one identified purchase after losing a real COMMIT reply, while distinguishing confirmed aborts, duplicate requests and conflicting payloads.",
        "scope": "Recover one identified purchase after losing a real COMMIT reply, while distinguishing confirmed aborts, duplicate requests and conflicting payloads.",
        "status": "published"
      },
      {
        "id": "RL94",
        "slug": "outboxes-and-jobs",
        "title": "Outboxes and database-backed jobs",
        "description": "Commit durable work with an order, recover after worker failures, and make the authority performing an effect reject an expired worker.",
        "scope": "Commit durable work with an order, recover after worker failures, and make the authority performing an effect reject an expired worker.",
        "status": "published"
      }
    ]
  },
  {
    "id": "recovery",
    "title": "Durability, copies and recovery",
    "overviewAnchor": "collection",
    "articles": [
      {
        "id": "RL95",
        "slug": "crash-recovery",
        "title": "Write-ahead logs and crash recovery",
        "description": "Follow a commit from dirty memory to durable log, crash at its ordering boundaries, and distinguish restart recovery from recovery after storage loss.",
        "scope": "Follow a commit from dirty memory to durable log, crash at its ordering boundaries, and distinguish restart recovery from recovery after storage loss.",
        "status": "published"
      },
      {
        "id": "RL96",
        "slug": "backup-and-restore",
        "title": "Backup, restore and reconciliation",
        "description": "Restore to a chosen history, test a broken log chain, then recover the later valid order that the earlier target also removed.",
        "scope": "Restore to a chosen history, test a broken log chain, then recover the later valid order that the earlier target also removed.",
        "status": "published"
      },
      {
        "id": "RL97",
        "slug": "replicas-and-read-routing",
        "title": "Replicas, lag and read routing",
        "description": "Separate log receipt, durable storage and replay, then choose where a following request can read its own purchase.",
        "scope": "Separate log receipt, durable storage and replay, then choose where a following request can read its own purchase.",
        "status": "published"
      },
      {
        "id": "RL98",
        "slug": "failover",
        "title": "Failover and fencing",
        "description": "Separate failure detection from write authority, fence an old primary before promotion, and rejoin its divergent history safely.",
        "scope": "Separate failure detection from write authority, fence an old primary before promotion, and rejoin its divergent history safely.",
        "status": "published"
      }
    ]
  },
  {
    "id": "operations",
    "title": "Change and operate the service",
    "overviewAnchor": "collection",
    "articles": [
      {
        "id": "RL100",
        "slug": "schema-changes",
        "title": "Live schema changes and backfills",
        "description": "Migrate an order amount while old and new callers coexist, bound schema waits, and prove the copy complete despite late rows behind a backfill cursor.",
        "scope": "Migrate an order amount while old and new callers coexist, bound schema waits, and prove the copy complete despite late rows behind a backfill cursor.",
        "status": "published"
      },
      {
        "id": "RL102",
        "slug": "connections-and-capacity",
        "title": "Connections, overload and capacity",
        "description": "Budget active database work across application pools, measure a hot-row bottleneck, and retain enough storage and recovery headroom to survive overload.",
        "scope": "Budget active database work across application pools, measure a hot-row bottleneck, and retain enough storage and recovery headroom to survive overload.",
        "status": "published"
      },
      {
        "id": "RL103",
        "slug": "slow-queries",
        "title": "Diagnosing a database incident",
        "description": "Follow a blocked workshop booking from request symptoms to a wait chain, choose a bounded intervention, and avoid a second overload when queued work resumes.",
        "scope": "Follow a blocked workshop booking from request symptoms to a wait chain, choose a bounded intervention, and avoid a second overload when queued work resumes.",
        "status": "published"
      },
      {
        "id": "RL104",
        "slug": "access-control",
        "title": "Database access and least privilege",
        "description": "Derive runtime and migration authority from their tasks, test denied operations and tenant access, and identify when a row policy trusts the wrong identity.",
        "scope": "Derive runtime and migration authority from their tasks, test denied operations and tenant access, and identify when a row policy trusts the wrong identity.",
        "status": "published"
      }
    ]
  },
  {
    "id": "distribution",
    "title": "Distribute relational work",
    "overviewAnchor": "collection",
    "articles": [
      {
        "id": "RL105",
        "slug": "partitioning-and-sharding",
        "title": "Sharding and distributed SQL",
        "description": "Route workshop records through alternative partition keys, count local and remote work, and decide whether more nodes address the actual bottleneck.",
        "scope": "Route workshop records through alternative partition keys, count local and remote work, and decide whether more nodes address the actual bottleneck.",
        "status": "published"
      },
      {
        "id": "RL106",
        "slug": "distributed-transactions",
        "title": "Transactions across partitions",
        "description": "Separate replica agreement from atomic commit, follow a two-partition purchase through coordinator loss, and resolve a durable decision without exposing half its effect.",
        "scope": "Separate replica agreement from atomic commit, follow a two-partition purchase through coordinator loss, and resolve a durable decision without exposing half its effect.",
        "status": "published"
      },
      {
        "id": "RL107",
        "slug": "distributed-reads",
        "title": "Time, snapshots and distributed reads",
        "description": "Read a two-partition purchase at one safe snapshot, distinguish a consistent past from current authority, and compare bounded clocks with logical timestamp mechanisms.",
        "scope": "Read a two-partition purchase at one safe snapshot, distinguish a consistent past from current authority, and compare bounded clocks with logical timestamp mechanisms.",
        "status": "published"
      },
      {
        "id": "RL108",
        "slug": "regional-placement",
        "title": "Regional placement and survival",
        "description": "Place voting replicas and workshop data against a failure budget, then expose the remote coordination added by a global quota.",
        "scope": "Place voting replicas and workshop data against a failure budget, then expose the remote coordination added by a global quota.",
        "status": "published"
      },
      {
        "id": "RL109",
        "slug": "rebalancing",
        "title": "Rebalancing and cluster change",
        "description": "Follow a live partition copy through concurrent writes, safe membership change and decommissioning, then budget the extra work of topology and version changes.",
        "scope": "Follow a live partition copy through concurrent writes, safe membership change and decommissioning, then budget the extra work of topology and version changes.",
        "status": "published"
      }
    ]
  },
  {
    "id": "postgresql",
    "title": "PostgreSQL implementation",
    "overviewAnchor": "collection",
    "articles": [
      {
        "id": "RL110",
        "slug": "postgresql/architecture",
        "title": "PostgreSQL processes, pages and row versions",
        "description": "Follow one workshop order from a client connection to a buffered heap page, then watch an update change its tuple and index work.",
        "scope": "Follow one workshop order from a client connection to a buffered heap page, then watch an update change its tuple and index work.",
        "status": "published"
      },
      {
        "id": "RL111",
        "slug": "postgresql/row-versions",
        "title": "PostgreSQL vacuum and transaction age",
        "description": "Diagnose retained versions, reusable space, visibility and transaction-age safety before changing vacuum settings.",
        "scope": "Diagnose retained versions, reusable space, visibility and transaction-age safety before changing vacuum settings.",
        "status": "published"
      },
      {
        "id": "RL112",
        "slug": "postgresql/indexes",
        "title": "PostgreSQL index methods and operators",
        "description": "Choose B-tree, GIN, GiST or BRIN from what the query asks and what the index can actually rule out.",
        "scope": "Choose B-tree, GIN, GiST or BRIN from what the query asks and what the index can actually rule out.",
        "status": "published"
      },
      {
        "id": "RL113",
        "slug": "postgresql/query-execution",
        "title": "Reading and repairing PostgreSQL plans",
        "description": "Follow a skewed tenant query through estimates, prepared plans and measured repairs, without confusing an improved estimate with faster execution.",
        "scope": "Follow a skewed tenant query through estimates, prepared plans and measured repairs, without confusing an improved estimate with faster execution.",
        "status": "published"
      },
      {
        "id": "RL114",
        "slug": "postgresql/json",
        "title": "PostgreSQL JSON and structured alternatives",
        "description": "Choose JSONB, columns and related rows by their facts, query operators, validation and update boundaries.",
        "scope": "Choose JSONB, columns and related rows by their facts, query operators, validation and update boundaries.",
        "status": "published"
      },
      {
        "id": "RL115",
        "slug": "postgresql/recovery",
        "title": "PostgreSQL WAL, checkpoints and durability",
        "description": "Separate buffered pages, WAL progress and committed visibility, then interpret an isolated crash-and-restart drill.",
        "scope": "Separate buffered pages, WAL progress and committed visibility, then interpret an isolated crash-and-restart drill.",
        "status": "published"
      },
      {
        "id": "RL116",
        "slug": "postgresql/backup-and-restore",
        "title": "Restoring PostgreSQL to a recovery target",
        "description": "Execute a base-backup and archived-WAL restore, verify its target, then reconcile a valid order committed after the mistake.",
        "scope": "Execute a base-backup and archived-WAL restore, verify its target, then reconcile a valid order committed after the mistake.",
        "status": "published"
      },
      {
        "id": "RL117",
        "slug": "postgresql/replication",
        "title": "PostgreSQL physical replicas and promotion",
        "description": "Build a physical standby, separate received WAL from replayed rows, then fence the old writer before promoting the replacement.",
        "scope": "Build a physical standby, separate received WAL from replayed rows, then fence the old writer before promoting the replacement.",
        "status": "published"
      },
      {
        "id": "RL118",
        "slug": "postgresql/logical-replication",
        "title": "PostgreSQL logical replication and change feeds",
        "description": "Execute a selective publication and subscriber, then expose the schema, identity and sequence work outside its row stream.",
        "scope": "Execute a selective publication and subscriber, then expose the schema, identity and sequence work outside its row stream.",
        "status": "published"
      },
      {
        "id": "RL119",
        "slug": "postgresql/schema-changes",
        "title": "PostgreSQL schema changes under load",
        "description": "Bound live schema changes, measure and rebuild sparse indexes, remove access paths safely and prove a compatible backfill.",
        "scope": "Bound live schema changes, measure and rebuild sparse indexes, remove access paths safely and prove a compatible backfill.",
        "status": "published"
      },
      {
        "id": "RL120",
        "slug": "postgresql/operations",
        "title": "Operating and diagnosing PostgreSQL",
        "description": "Locate a slow request across pool waiting, server waits and execution, then test a targeted intervention for locks, spills and connection pressure.",
        "scope": "Locate a slow request across pool waiting, server waits and execution, then test a targeted intervention for locks, spills and connection pressure.",
        "status": "published"
      },
      {
        "id": "RL121",
        "slug": "postgresql/access-control",
        "title": "PostgreSQL roles, policies and privileged code",
        "description": "Test actual application privileges, tenant policies, owner bypass and SECURITY DEFINER name lookup using separate native roles.",
        "scope": "Test actual application privileges, tenant policies, owner bypass and SECURITY DEFINER name lookup using separate native roles.",
        "status": "published"
      },
      {
        "id": "RL122",
        "slug": "postgresql/upgrades",
        "title": "Upgrading and migrating PostgreSQL",
        "description": "Choose a native upgrade or migration route, rehearse a fenced dump/restore and validate the application before transferring write authority.",
        "scope": "Choose a native upgrade or migration route, rehearse a fenced dump/restore and validate the application before transferring write authority.",
        "status": "published"
      }
    ]
  },
  {
    "id": "cockroachdb",
    "title": "CockroachDB implementation",
    "overviewAnchor": "collection",
    "articles": [
      {
        "id": "RL123",
        "slug": "cockroachdb/keys-and-ranges",
        "title": "CockroachDB keys, ranges and replication",
        "description": "Follow a SQL lookup through ordered keys, range ownership, a leaseholder and durable replicas, then split the data and locate the write hotspot that remains.",
        "scope": "Follow a SQL lookup through ordered keys, range ownership, a leaseholder and durable replicas, then split the data and locate the write hotspot that remains.",
        "status": "published"
      },
      {
        "id": "RL124",
        "slug": "cockroachdb/transactions",
        "title": "CockroachDB transactions and retries",
        "description": "Follow a distributed purchase through provisional writes, a commit decision and client retries without repeating its external effects.",
        "scope": "Follow a distributed purchase through provisional writes, a commit decision and client retries without repeating its external effects.",
        "status": "published"
      },
      {
        "id": "RL125",
        "slug": "cockroachdb/follower-reads",
        "title": "CockroachDB isolation and follower reads",
        "description": "Choose current, statement-level and historical observations from the decision they must support, then test a report read against a current booking invariant.",
        "scope": "Choose current, statement-level and historical observations from the decision they must support, then test a report read against a current booking invariant.",
        "status": "published"
      },
      {
        "id": "RL126",
        "slug": "cockroachdb/query-performance",
        "title": "CockroachDB query work and hot ranges",
        "description": "Trace a secondary lookup through SQL and KV work, remove one round of lookups with a covering index, and weigh scattered writes against ordered reads.",
        "scope": "Trace a secondary lookup through SQL and KV work, remove one round of lookups with a covering index, and weigh scattered writes against ordered reads.",
        "status": "published"
      },
      {
        "id": "RL127",
        "slug": "cockroachdb/locality",
        "title": "CockroachDB table locality and region survival",
        "description": "Choose where workshop rows are served, configure a region-survival goal, and separate the observed process-failure result from real regional performance.",
        "scope": "Choose where workshop rows are served, configure a region-survival goal, and separate the observed process-failure result from real regional performance.",
        "status": "published"
      },
      {
        "id": "RL128",
        "slug": "cockroachdb/operations",
        "title": "Operating and securing a CockroachDB cluster",
        "description": "Establish TLS and SQL identity, distinguish a permitted read from a denied write, and follow range health through node loss and planned removal.",
        "scope": "Establish TLS and SQL identity, distinguish a permitted read from a denied write, and follow range health through node loss and planned removal.",
        "status": "published"
      },
      {
        "id": "RL129",
        "slug": "cockroachdb/backup-and-restore",
        "title": "CockroachDB backup and recovery",
        "description": "Preserve a full and incremental chain, restore a booking before a committed mistake, and reconcile its capacity change without consuming the place twice.",
        "scope": "Preserve a full and incremental chain, restore a booking before a committed mistake, and reconcile its capacity change without consuming the place twice.",
        "status": "published"
      },
      {
        "id": "RL130",
        "slug": "cockroachdb/schema-changes",
        "title": "CockroachDB schema jobs under load",
        "description": "Follow a stored-column backfill and a failed unique index through their job states, caller compatibility and acceptance checks.",
        "scope": "Follow a stored-column backfill and a failed unique index through their job states, caller compatibility and acceptance checks.",
        "status": "published"
      },
      {
        "id": "RL131",
        "slug": "cockroachdb/upgrades",
        "title": "Upgrading a CockroachDB cluster",
        "description": "Rehearse a rolling 25.3.7 to 25.4.17 upgrade, return one node before finalisation, and watch the old binary lose access after the compatibility boundary.",
        "scope": "Rehearse a rolling 25.3.7 to 25.4.17 upgrade, return one node before finalisation, and watch the old binary lose access after the compatibility boundary.",
        "status": "published"
      },
      {
        "id": "RL132",
        "slug": "cockroachdb/migration",
        "title": "Moving a SQL application to CockroachDB",
        "description": "Port an actual deferred-reference write, fence the PostgreSQL source, copy a consistent snapshot, and account for target-only work before attempting a return.",
        "scope": "Port an actual deferred-reference write, fence the PostgreSQL source, copy a consistent snapshot, and account for target-only work before attempting a return.",
        "status": "published"
      }
    ]
  },
  {
    "id": "postgresql-specialists",
    "title": "Further PostgreSQL reading",
    "overviewAnchor": "collection",
    "articles": [
      {
        "slug": "postgresql/sharding",
        "title": "Where distributed PostgreSQL work runs",
        "description": "Choose data ownership and query boundaries before distributing writes.",
        "scope": "Compare native partitions, application sharding, Citus and foreign tables; derive co-location, constraint scope, skew and safe movement.",
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
/** Retired article routes resolve to the revised explanation that owns the subject. */
export const relationalAliases: Record<string, string> = {
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
export const relationalArticleHref = (slug: string) => `/learn/databases/relational/${slug ? `${slug}/` : ''}`;
export const relationalPublication = {
  "RL76": "",
  "RL77": "modelling",
  "RL78": "values",
  "RL79": "constraints",
  "RL80": "data-lifecycle",
  "RL81": "query-results",
  "RL82": "aggregates-and-windows",
  "RL83": "large-results",
  "RL84": "updates-and-imports",
  "RL85": "application-sql",
  "RL86": "indexes",
  "RL87": "query-execution",
  "RL89": "partitioning",
  "RL90": "transaction-boundaries",
  "RL91": "locks-and-deadlocks",
  "RL92": "storage",
  "RL93": "conflicts-and-retries",
  "RL94": "outboxes-and-jobs",
  "RL95": "crash-recovery",
  "RL96": "backup-and-restore",
  "RL97": "replicas-and-read-routing",
  "RL98": "failover",
  "RL100": "schema-changes",
  "RL102": "connections-and-capacity",
  "RL103": "slow-queries",
  "RL104": "access-control",
  "RL105": "partitioning-and-sharding",
  "RL106": "distributed-transactions",
  "RL107": "distributed-reads",
  "RL108": "regional-placement",
  "RL109": "rebalancing",
  "RL110": "postgresql/architecture",
  "RL111": "postgresql/row-versions",
  "RL112": "postgresql/indexes",
  "RL113": "postgresql/query-execution",
  "RL114": "postgresql/json",
  "RL115": "postgresql/recovery",
  "RL116": "postgresql/backup-and-restore",
  "RL117": "postgresql/replication",
  "RL118": "postgresql/logical-replication",
  "RL119": "postgresql/schema-changes",
  "RL120": "postgresql/operations",
  "RL121": "postgresql/access-control",
  "RL122": "postgresql/upgrades",
  "RL123": "cockroachdb/keys-and-ranges",
  "RL124": "cockroachdb/transactions",
  "RL125": "cockroachdb/follower-reads",
  "RL126": "cockroachdb/query-performance",
  "RL127": "cockroachdb/locality",
  "RL128": "cockroachdb/operations",
  "RL129": "cockroachdb/backup-and-restore",
  "RL130": "cockroachdb/schema-changes",
  "RL131": "cockroachdb/upgrades",
  "RL132": "cockroachdb/migration"
};
