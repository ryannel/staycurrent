// Fresh draft metadata, transcribed from the 24 October 2026 commission inventory.
// Keep independent of published reading metadata: a fragment's presence is availability,
// not evidence of review or permission to publish.
export interface RelationalDraftEntry {
  key: string;
  id: string;
  slug: string;
  title: string;
  description: string;
  group: string;
}
export interface RelationalDraftState extends RelationalDraftEntry {
  status: 'draft' | 'planned' | 'published';
}
export interface RelationalDraftGroup { id: string; title: string }
export const relationalDraftHome = '/review/relational-collection/';

export const relationalDraftGroups: RelationalDraftGroup[] = [
  {
    "id": "design",
    "title": "Design facts and guarantees"
  },
  {
    "id": "queries",
    "title": "Query and change the right rows"
  },
  {
    "id": "performance",
    "title": "Make query work affordable"
  },
  {
    "id": "transactions",
    "title": "Concurrency and durable application work"
  },
  {
    "id": "recovery",
    "title": "Durability, copies and recovery"
  },
  {
    "id": "operations",
    "title": "Change and operate the service"
  },
  {
    "id": "distribution",
    "title": "Distribute relational work"
  },
  {
    "id": "postgresql",
    "title": "PostgreSQL implementation"
  },
  {
    "id": "cockroachdb",
    "title": "CockroachDB implementation"
  },
  {
    "id": "postgresql-specialists",
    "title": "Further PostgreSQL reading"
  }
];

export const relationalDraftEntries: RelationalDraftEntry[] = [
  {
    "key": "r00",
    "id": "RL76",
    "slug": "",
    "title": "Relational databases",
    "description": "Understand relational facts, queries and transactions, then choose the next subject to explore.",
    "group": "introduction"
  },
  {
    "key": "r01",
    "id": "RL77",
    "slug": "modelling",
    "title": "Relations, keys and normalisation",
    "description": "Choose what one row means, give it an identity, and separate facts that change independently without losing the price agreed on an order.",
    "group": "design"
  },
  {
    "key": "r02",
    "id": "RL78",
    "slug": "values",
    "title": "Values, missing data and equality",
    "description": "Make money, time, text and missing values compare as the application intends, then follow a NULL into a broken unpaid-orders query.",
    "group": "design"
  },
  {
    "key": "r03",
    "id": "RL79",
    "slug": "constraints",
    "title": "Constraints and tenant boundaries",
    "description": "Place each workshop rule in a row constraint, a reference, an access policy or a concurrency protocol, then try to break it from another writer.",
    "group": "design"
  },
  {
    "key": "r04",
    "id": "RL80",
    "slug": "data-lifecycle",
    "title": "History, correction and deletion",
    "description": "Preserve an agreement, distinguish when a fact applied from when it became known, and trace what a correction or deletion changes.",
    "group": "design"
  },
  {
    "key": "r05",
    "id": "RL81",
    "slug": "query-results",
    "title": "Joins and the meaning of a result row",
    "description": "Trace what each result row represents, then repair multiplied revenue, missing sessions and absence tests.",
    "group": "queries"
  },
  {
    "key": "r06",
    "id": "RL82",
    "slug": "aggregates-and-windows",
    "title": "Aggregates, windows and ordered results",
    "description": "Build grouped totals and per-order calculations, then follow tied timestamps through window frames and rankings.",
    "group": "queries"
  },
  {
    "key": "r07",
    "id": "RL83",
    "slug": "large-results",
    "title": "Pagination and consistent exports",
    "description": "Continue an ordered result without losing ties, then decide what a changing list and a fixed export each promise.",
    "group": "queries"
  },
  {
    "key": "r08",
    "id": "RL84",
    "slug": "updates-and-imports",
    "title": "Updates, upserts and bulk imports",
    "description": "Make each write's precondition and conflict rule explicit, then stage and reconcile a batch that contains duplicates, invalid rows and older versions.",
    "group": "queries"
  },
  {
    "key": "r09",
    "id": "RL85",
    "slug": "application-sql",
    "title": "SQL at the application boundary",
    "description": "Follow bound values, generated queries and connection ownership from one request through its final result or error.",
    "group": "queries"
  },
  {
    "key": "r10",
    "id": "RL86",
    "slug": "indexes",
    "title": "Indexes and access paths",
    "description": "Follow B-tree entries to rows, count how column order and selectivity change the work, and weigh the saving against writes and maintenance.",
    "group": "performance"
  },
  {
    "key": "r11",
    "id": "RL87",
    "slug": "query-execution",
    "title": "Query execution and bad plans",
    "description": "Follow rows through scans, joins and retained state, then locate the estimate that turned one lookup into forty thousand.",
    "group": "performance"
  },
  {
    "key": "r12",
    "id": "RL89",
    "slug": "partitioning",
    "title": "Table partitioning and data lifecycle",
    "description": "Split dated sessions into partitions, watch pruning narrow a query, and follow the enforcement and retention costs of that boundary.",
    "group": "performance"
  },
  {
    "key": "r13",
    "id": "RL90",
    "slug": "transaction-boundaries",
    "title": "Transactions and isolation",
    "description": "Follow two workshop bookings through commit, snapshots, lost updates and write skew, then choose protection for the capacity rule.",
    "group": "transactions"
  },
  {
    "key": "r14",
    "id": "RL91",
    "slug": "locks-and-deadlocks",
    "title": "Locks, contention and deadlocks",
    "description": "Choose what a booking must lock, inspect real waiting and deadlocks, and repair a protocol that tries to lock a missing row.",
    "group": "transactions"
  },
  {
    "key": "r15",
    "id": "RL92",
    "slug": "storage",
    "title": "Row versions, storage and cleanup",
    "description": "Follow a changed price through old snapshots, physical row layouts and cleanup, then explain why a small logical table can retain a large file.",
    "group": "transactions"
  },
  {
    "key": "r16",
    "id": "RL93",
    "slug": "conflicts-and-retries",
    "title": "Retries when a commit reply is missing",
    "description": "Recover one identified purchase after losing a real COMMIT reply, while distinguishing confirmed aborts, duplicate requests and conflicting payloads.",
    "group": "transactions"
  },
  {
    "key": "r17",
    "id": "RL94",
    "slug": "outboxes-and-jobs",
    "title": "Outboxes and database-backed jobs",
    "description": "Commit durable work with an order, recover after worker failures, and make the authority performing an effect reject an expired worker.",
    "group": "transactions"
  },
  {
    "key": "r18",
    "id": "RL95",
    "slug": "crash-recovery",
    "title": "Write-ahead logs and crash recovery",
    "description": "Follow a commit from dirty memory to durable log, crash at its ordering boundaries, and distinguish restart recovery from recovery after storage loss.",
    "group": "recovery"
  },
  {
    "key": "r19",
    "id": "RL96",
    "slug": "backup-and-restore",
    "title": "Backup, restore and reconciliation",
    "description": "Restore to a chosen history, test a broken log chain, then recover the later valid order that the earlier target also removed.",
    "group": "recovery"
  },
  {
    "key": "r20",
    "id": "RL97",
    "slug": "replicas-and-read-routing",
    "title": "Replicas, lag and read routing",
    "description": "Separate log receipt, durable storage and replay, then choose where a following request can read its own purchase.",
    "group": "recovery"
  },
  {
    "key": "r21",
    "id": "RL98",
    "slug": "failover",
    "title": "Failover and fencing",
    "description": "Separate failure detection from write authority, fence an old primary before promotion, and rejoin its divergent history safely.",
    "group": "recovery"
  },
  {
    "key": "r22",
    "id": "RL100",
    "slug": "schema-changes",
    "title": "Live schema changes and backfills",
    "description": "Migrate an order amount while old and new callers coexist, bound schema waits, and prove the copy complete despite late rows behind a backfill cursor.",
    "group": "operations"
  },
  {
    "key": "r23",
    "id": "RL102",
    "slug": "connections-and-capacity",
    "title": "Connections, overload and capacity",
    "description": "Budget active database work across application pools, measure a hot-row bottleneck, and retain enough storage and recovery headroom to survive overload.",
    "group": "operations"
  },
  {
    "key": "r24",
    "id": "RL103",
    "slug": "slow-queries",
    "title": "Diagnosing a database incident",
    "description": "Follow a blocked workshop booking from request symptoms to a wait chain, choose a bounded intervention, and avoid a second overload when queued work resumes.",
    "group": "operations"
  },
  {
    "key": "r25",
    "id": "RL104",
    "slug": "access-control",
    "title": "Database access and least privilege",
    "description": "Derive runtime and migration authority from their tasks, test denied operations and tenant access, and identify when a row policy trusts the wrong identity.",
    "group": "operations"
  },
  {
    "key": "r26",
    "id": "RL105",
    "slug": "partitioning-and-sharding",
    "title": "Sharding and distributed SQL",
    "description": "Route workshop records through alternative partition keys, count local and remote work, and decide whether more nodes address the actual bottleneck.",
    "group": "distribution"
  },
  {
    "key": "r27",
    "id": "RL106",
    "slug": "distributed-transactions",
    "title": "Transactions across partitions",
    "description": "Separate replica agreement from atomic commit, follow a two-partition purchase through coordinator loss, and resolve a durable decision without exposing half its effect.",
    "group": "distribution"
  },
  {
    "key": "r28",
    "id": "RL107",
    "slug": "distributed-reads",
    "title": "Time, snapshots and distributed reads",
    "description": "Read a two-partition purchase at one safe snapshot, distinguish a consistent past from current authority, and compare bounded clocks with logical timestamp mechanisms.",
    "group": "distribution"
  },
  {
    "key": "r29",
    "id": "RL108",
    "slug": "regional-placement",
    "title": "Regional placement and survival",
    "description": "Place voting replicas and workshop data against a failure budget, then expose the remote coordination added by a global quota.",
    "group": "distribution"
  },
  {
    "key": "r30",
    "id": "RL109",
    "slug": "rebalancing",
    "title": "Rebalancing and cluster change",
    "description": "Follow a live partition copy through concurrent writes, safe membership change and decommissioning, then budget the extra work of topology and version changes.",
    "group": "distribution"
  },
  {
    "key": "r31",
    "id": "RL110",
    "slug": "postgresql/architecture",
    "title": "PostgreSQL processes, pages and row versions",
    "description": "Follow one workshop order from a client connection to a buffered heap page, then watch an update change its tuple and index work.",
    "group": "postgresql"
  },
  {
    "key": "r32",
    "id": "RL111",
    "slug": "postgresql/row-versions",
    "title": "PostgreSQL vacuum and transaction age",
    "description": "Diagnose retained versions, reusable space, visibility and transaction-age safety before changing vacuum settings.",
    "group": "postgresql"
  },
  {
    "key": "r33",
    "id": "RL112",
    "slug": "postgresql/indexes",
    "title": "PostgreSQL index methods and operators",
    "description": "Choose B-tree, GIN, GiST or BRIN from what the query asks and what the index can actually rule out.",
    "group": "postgresql"
  },
  {
    "key": "r34",
    "id": "RL113",
    "slug": "postgresql/query-execution",
    "title": "Reading and repairing PostgreSQL plans",
    "description": "Follow a skewed tenant query through estimates, prepared plans and measured repairs, without confusing an improved estimate with faster execution.",
    "group": "postgresql"
  },
  {
    "key": "r35",
    "id": "RL114",
    "slug": "postgresql/json",
    "title": "PostgreSQL JSON and structured alternatives",
    "description": "Choose JSONB, columns and related rows by their facts, query operators, validation and update boundaries.",
    "group": "postgresql"
  },
  {
    "key": "r36",
    "id": "RL115",
    "slug": "postgresql/recovery",
    "title": "PostgreSQL WAL, checkpoints and durability",
    "description": "Separate buffered pages, WAL progress and committed visibility, then interpret an isolated crash-and-restart drill.",
    "group": "postgresql"
  },
  {
    "key": "r37",
    "id": "RL116",
    "slug": "postgresql/backup-and-restore",
    "title": "Restoring PostgreSQL to a recovery target",
    "description": "Execute a base-backup and archived-WAL restore, verify its target, then reconcile a valid order committed after the mistake.",
    "group": "postgresql"
  },
  {
    "key": "r38",
    "id": "RL117",
    "slug": "postgresql/replication",
    "title": "PostgreSQL physical replicas and promotion",
    "description": "Build a physical standby, separate received WAL from replayed rows, then fence the old writer before promoting the replacement.",
    "group": "postgresql"
  },
  {
    "key": "r39",
    "id": "RL118",
    "slug": "postgresql/logical-replication",
    "title": "PostgreSQL logical replication and change feeds",
    "description": "Execute a selective publication and subscriber, then expose the schema, identity and sequence work outside its row stream.",
    "group": "postgresql"
  },
  {
    "key": "r40",
    "id": "RL119",
    "slug": "postgresql/schema-changes",
    "title": "PostgreSQL schema changes under load",
    "description": "Bound live schema changes, measure and rebuild sparse indexes, remove access paths safely and prove a compatible backfill.",
    "group": "postgresql"
  },
  {
    "key": "r41",
    "id": "RL120",
    "slug": "postgresql/operations",
    "title": "Operating and diagnosing PostgreSQL",
    "description": "Locate a slow request across pool waiting, server waits and execution, then test a targeted intervention for locks, spills and connection pressure.",
    "group": "postgresql"
  },
  {
    "key": "r42",
    "id": "RL121",
    "slug": "postgresql/access-control",
    "title": "PostgreSQL roles, policies and privileged code",
    "description": "Test actual application privileges, tenant policies, owner bypass and SECURITY DEFINER name lookup using separate native roles.",
    "group": "postgresql"
  },
  {
    "key": "r43",
    "id": "RL122",
    "slug": "postgresql/upgrades",
    "title": "Upgrading and migrating PostgreSQL",
    "description": "Choose a native upgrade or migration route, rehearse a fenced dump/restore and validate the application before transferring write authority.",
    "group": "postgresql"
  },
  {
    "key": "r44",
    "id": "RL123",
    "slug": "cockroachdb/keys-and-ranges",
    "title": "CockroachDB keys, ranges and replication",
    "description": "Follow a SQL lookup through ordered keys, range ownership, a leaseholder and durable replicas, then split the data and locate the write hotspot that remains.",
    "group": "cockroachdb"
  },
  {
    "key": "r45",
    "id": "RL124",
    "slug": "cockroachdb/transactions",
    "title": "CockroachDB transactions and retries",
    "description": "Follow a distributed purchase through provisional writes, a commit decision and client retries without repeating its external effects.",
    "group": "cockroachdb"
  },
  {
    "key": "r46",
    "id": "RL125",
    "slug": "cockroachdb/follower-reads",
    "title": "CockroachDB isolation and follower reads",
    "description": "Choose current, statement-level and historical observations from the decision they must support, then test a report read against a current booking invariant.",
    "group": "cockroachdb"
  },
  {
    "key": "r47",
    "id": "RL126",
    "slug": "cockroachdb/query-performance",
    "title": "CockroachDB query work and hot ranges",
    "description": "Trace a secondary lookup through SQL and KV work, remove one round of lookups with a covering index, and weigh scattered writes against ordered reads.",
    "group": "cockroachdb"
  },
  {
    "key": "r48",
    "id": "RL127",
    "slug": "cockroachdb/locality",
    "title": "CockroachDB table locality and region survival",
    "description": "Choose where workshop rows are served, configure a region-survival goal, and separate the observed process-failure result from real regional performance.",
    "group": "cockroachdb"
  },
  {
    "key": "r49",
    "id": "RL128",
    "slug": "cockroachdb/operations",
    "title": "Operating and securing a CockroachDB cluster",
    "description": "Establish TLS and SQL identity, distinguish a permitted read from a denied write, and follow range health through node loss and planned removal.",
    "group": "cockroachdb"
  },
  {
    "key": "r50",
    "id": "RL129",
    "slug": "cockroachdb/backup-and-restore",
    "title": "CockroachDB backup and recovery",
    "description": "Preserve a full and incremental chain, restore a booking before a committed mistake, and reconcile its capacity change without consuming the place twice.",
    "group": "cockroachdb"
  },
  {
    "key": "r51",
    "id": "RL130",
    "slug": "cockroachdb/schema-changes",
    "title": "CockroachDB schema jobs under load",
    "description": "Follow a stored-column backfill and a failed unique index through their job states, caller compatibility and acceptance checks.",
    "group": "cockroachdb"
  },
  {
    "key": "r52",
    "id": "RL131",
    "slug": "cockroachdb/upgrades",
    "title": "Upgrading a CockroachDB cluster",
    "description": "Rehearse a rolling 25.3.7 to 25.4.17 upgrade, return one node before finalisation, and watch the old binary lose access after the compatibility boundary.",
    "group": "cockroachdb"
  },
  {
    "key": "r53",
    "id": "RL132",
    "slug": "cockroachdb/migration",
    "title": "Moving a SQL application to CockroachDB",
    "description": "Port an actual deferred-reference write, fence the PostgreSQL source, copy a consistent snapshot, and account for target-only work before attempting a return.",
    "group": "cockroachdb"
  },
  {
    "key": "r54",
    "id": "specialist-sharding",
    "slug": "postgresql/sharding",
    "title": "Where distributed PostgreSQL work runs",
    "description": "Compare native partitions, application sharding, Citus and foreign tables; derive co-location, constraint scope, skew and safe movement.",
    "group": "postgresql-specialists"
  },
  {
    "key": "r55",
    "id": "specialist-full-text-search",
    "slug": "postgresql/full-text-search",
    "title": "Full-text search in PostgreSQL",
    "description": "Develop configurations, positions, phrase matching, weighted ranking and filtered GIN retrieval with concrete search results.",
    "group": "postgresql-specialists"
  },
  {
    "key": "r56",
    "id": "specialist-vector-search",
    "slug": "postgresql/vector-search",
    "title": "Vector search in PostgreSQL",
    "description": "Separate embedding relevance from retrieval recall, examine pgvector index choices and derive filtered approximate-search tradeoffs.",
    "group": "postgresql-specialists"
  },
  {
    "key": "r57",
    "id": "specialist-extensions",
    "slug": "postgresql/extensions",
    "title": "Types and extensions in PostgreSQL",
    "description": "Connect ranges, exclusion constraints, specialised operators and index methods to extension installation, lifecycle and operational dependencies.",
    "group": "postgresql-specialists"
  }
];

export function relationalDraftHref(slug: string) {
  return `${relationalDraftHome}${slug ? `${slug}/` : ''}`;
}

export function relationalDraftStates(availableKeys: Iterable<string>): RelationalDraftState[] {
  const available = new Set(availableKeys);
  return relationalDraftEntries.map(entry => ({
    ...entry,
    status: available.has(entry.key) ? 'draft' : 'planned',
  }));
}

// Rewrite only exact inventory destinations. Sandbox, practice and evidence URLs
// keep their published routes, as do inventory targets without a fresh fragment.
export function relationalDraftLinks(html: string, entries: RelationalDraftState[]) {
  const publicHome = '/learn/databases/relational/';
  const targets = new Map(entries.map(entry => [
    `${publicHome}${entry.slug ? `${entry.slug}/` : ''}`,
    entry,
  ]));
  return html.replace(/<a\b[^>]*>/gi, tag => {
    let publishedTarget = false;
    const rewritten = tag.replace(/\bhref=(['"])([^'"]+)\1/i, (attribute, quote, href: string) => {
      const match = href.match(/^([^?#]*)([?#].*)?$/);
      if (!match) return attribute;
      const pathname = match[1].endsWith('/') ? match[1] : `${match[1]}/`;
      const target = targets.get(pathname);
      if (!target) return attribute;
      if (target.status !== 'draft') {
        publishedTarget = true;
        return attribute;
      }
      return `href=${quote}${relationalDraftHref(target.slug)}${match[2] ?? ''}${quote}`;
    });
    return publishedTarget && !/\btitle\s*=/.test(rewritten)
      ? rewritten.replace(/>$/, ' title="Published collection; this draft is not yet available">')
      : rewritten;
  });
}
