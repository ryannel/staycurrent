import type { Tutorial } from '../sql-sandbox-tutorials';

export const capacityTutorials: Tutorial[] = [
  {
    id: 'replica-freshness',
    title: 'A copied change is not always a visible change',
    description: 'Use an explicit SQL model to distinguish acknowledgement, a durable copy and an applied result.',
    articleHref: '/learn/databases/relational/replicas-and-failover/#acknowledgements',
    steps: [
      {
        title: 'Set up the model',
        instruction: 'This is a model in ordinary tables on one connection, not running replication. A is the writer; B is its copy. Numbered positions stand for completed changes, not real PostgreSQL WAL positions. Both start with P7 priced at 20 through position 1. Run setup first; reset and rerun it to start again.',
        sql: `DROP TABLE IF EXISTS cap_replica_progress, cap_replica_log, cap_replica_prices;
CREATE TABLE cap_replica_progress (node text PRIMARY KEY, durable_position integer NOT NULL, applied_position integer NOT NULL);
CREATE TABLE cap_replica_log (node text, position integer, product_id text NOT NULL, price integer NOT NULL, PRIMARY KEY (node, position));
CREATE TABLE cap_replica_prices (node text, product_id text, price integer NOT NULL, PRIMARY KEY (node, product_id));
INSERT INTO cap_replica_progress (node, durable_position, applied_position) VALUES ('A',1,1),('B',1,1);
INSERT INTO cap_replica_log (node, position, product_id, price) VALUES ('A',1,'P7',20),('B',1,'P7',20);
INSERT INTO cap_replica_prices (node, product_id, price) VALUES ('A','P7',20),('B','P7',20);
SELECT * FROM cap_replica_prices ORDER BY node;`,
        expected: 'Both modeled nodes show price 20. All three tables physically live in the same disposable browser database. Their different rows let us reason about stages without claiming network or durability measurements.',
      },
      {
        title: 'A commits before B receives the change',
        instruction: 'Model A changing the price to 25 at position 2, while B stays at 1. Predict each read. For this scenario the application has received an asynchronous acknowledgement from A; that fact does not update B.',
        sql: `INSERT INTO cap_replica_log (node, position, product_id, price) VALUES ('A',2,'P7',25);
UPDATE cap_replica_prices SET price = 25 WHERE node = 'A' AND product_id = 'P7';
UPDATE cap_replica_progress SET durable_position = 2, applied_position = 2 WHERE node = 'A';
SELECT p.node, p.price, r.durable_position, r.applied_position
FROM cap_replica_prices p JOIN cap_replica_progress r USING (node) ORDER BY node;`,
        expected: 'A shows 25 at position 2; B still shows 20 at position 1. If A and its storage were lost now, this modeled B has no record of the acknowledged change. The SQL has not crashed or destroyed any database.',
      },
      {
        title: 'Copy the log, without applying it yet',
        instruction: 'Model the position-2 record reaching B’s durable log, but leave B’s queryable price unchanged. Predict whether a synchronous policy waiting for a durable copy could now acknowledge, and whether a new read on B can show 25.',
        sql: `INSERT INTO cap_replica_log (node, position, product_id, price)
SELECT 'B', position, product_id, price FROM cap_replica_log WHERE node = 'A' AND position = 2;
UPDATE cap_replica_progress SET durable_position = 2 WHERE node = 'B';
SELECT p.price, r.durable_position >= 2 AS durable_copy_ready,
  r.applied_position >= 2 AS read_ready
FROM cap_replica_prices p JOIN cap_replica_progress r USING (node)
WHERE p.node = 'B';`,
        expected: 'durable_copy_ready is true, but read_ready is false and B’s price remains 20. A retained log record can support recovery without already being reflected in a query. Real storage guarantees depend on the configured acknowledgement and surviving storage.',
      },
      {
        title: 'Check a read-your-write requirement',
        instruction: 'The caller needs a new read that includes its change through position 2. Ask which node has applied at least that position. Predict why checking only durable_position would choose B too early.',
        sql: `SELECT node FROM cap_replica_progress
WHERE applied_position >= 2 ORDER BY node;`,
        expected: 'Only A qualifies. A real router must use an engine-supported progress token and the correct lineage, wait for a suitable copy or route to the writer. A fixed delay after a write cannot establish that requirement.',
      },
      {
        title: 'Apply the copied record',
        instruction: 'Apply position 2 on B, then take a new read. Predict its price and eligibility. The UPDATE here is our model’s explicit apply operation; it is not PostgreSQL replication code.',
        sql: `UPDATE cap_replica_prices AS p SET price = l.price
FROM cap_replica_log AS l
WHERE p.node = 'B' AND l.node = 'B' AND p.product_id = l.product_id AND l.position = 2;
UPDATE cap_replica_progress SET applied_position = 2 WHERE node = 'B';
SELECT p.node, p.price, r.applied_position >= 2 AS read_ready
FROM cap_replica_prices p JOIN cap_replica_progress r USING (node) ORDER BY node;`,
        expected: 'Both now show 25 and qualify for a new read through position 2. An already-open old snapshot on a real standby would be a separate visibility question. For a variation, reset and stop at step 2 or 3: explain which copy can recover position 2 and which can immediately serve its result.',
      },
    ],
  },
  {
    id: 'partition-pruning',
    title: 'Find which partitions a query needs',
    description: 'Create real PostgreSQL range partitions, inspect pruning, and test their boundaries and keys.',
    articleHref: '/learn/databases/relational/partitioning-and-sharding/#local-partitions',
    steps: [
      {
        title: 'Create two months of orders',
        instruction: 'This lesson uses real PostgreSQL partitioned tables inside one database. Run setup first. October has orders 1 and 2; November has order 3. A lower range boundary is included and its upper boundary is excluded. Reset and rerun this step to undo changes.',
        sql: `DROP TABLE IF EXISTS cap_partition_orders CASCADE;
CREATE TABLE cap_partition_orders (
  placed_on date NOT NULL, order_id integer NOT NULL,
  tenant_id integer NOT NULL, total numeric(12,2) NOT NULL,
  PRIMARY KEY (placed_on, order_id)
) PARTITION BY RANGE (placed_on);
CREATE TABLE cap_orders_oct PARTITION OF cap_partition_orders
FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE cap_orders_nov PARTITION OF cap_partition_orders
FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
INSERT INTO cap_partition_orders (placed_on, order_id, tenant_id, total)
VALUES ('2026-10-15',1,7,25),('2026-10-20',2,8,8),('2026-11-01',3,7,40);
SELECT tableoid::regclass AS stored_in, placed_on, order_id, tenant_id, total
FROM cap_partition_orders ORDER BY placed_on, order_id;`,
        expected: 'Orders 1 and 2 live in cap_orders_oct. Order 3 belongs to cap_orders_nov because November 1 is outside October’s upper boundary. tableoid identifies the actual relation holding each row; all remain inside this one database.',
      },
      {
        title: 'Filter on the partition key',
        instruction: 'Predict which child table can contain an October result. EXPLAIN ANALYZE executes the read and exposes the scanned relation; it does not measure a production performance improvement on these three rows.',
        sql: `EXPLAIN (ANALYZE, TIMING OFF)
SELECT order_id, total FROM cap_partition_orders
WHERE placed_on >= DATE '2026-10-01' AND placed_on < DATE '2026-11-01';`,
        expected: 'The plan reads cap_orders_oct and returns two rows. The November partition can be excluded from these bounds. Pruning chooses relevant partitions; the scan still has to find the matches inside them.',
      },
      {
        title: 'Ask a question without the date',
        instruction: 'Tenant 7 has one order in each month. Predict whether partitioning by date can discard either child when the only predicate is tenant_id = 7.',
        sql: `EXPLAIN (ANALYZE, TIMING OFF)
SELECT order_id, total FROM cap_partition_orders WHERE tenant_id = 7;`,
        expected: 'The plan includes both partitions, normally below an Append operation, and shows two matches. The underlying query selects orders 1 and 3; EXPLAIN displays the plan rather than those records. A useful tenant index could help inside each partition, but the date boundaries alone cannot rule either one out.',
      },
      {
        title: 'Try an uncovered date',
        instruction: 'Predict where a December order goes. There is no December or default partition. Run this INSERT alone so its intentional error does not interrupt later commands.',
        sql: `INSERT INTO cap_partition_orders (placed_on, order_id, tenant_id, total)
VALUES ('2026-12-01',4,7,12);`,
        expected: 'PostgreSQL rejects the row with SQLSTATE 23514: no partition accepts it. Partition management is part of keeping future writes available.',
        expectedError: '23514',
      },
      {
        title: 'Provide the missing range',
        instruction: 'Create December and retry the same row. Predict its destination. A production system would prepare the range before its first write and account for the locks required to attach or create partitions.',
        sql: `CREATE TABLE cap_orders_dec PARTITION OF cap_partition_orders
FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');
INSERT INTO cap_partition_orders (placed_on, order_id, tenant_id, total)
VALUES ('2026-12-01',4,7,12);
SELECT tableoid::regclass AS stored_in, order_id FROM cap_partition_orders WHERE order_id = 4;`,
        expected: 'Order 4 is stored in cap_orders_dec. The failed attempt did not leave a hidden order to duplicate.',
      },
      {
        title: 'Check what the key actually guarantees',
        instruction: 'Our declared key is (placed_on, order_id), not order_id alone. Predict whether order ID 1 can also appear in November. Run it, then decide whether the schema matches a business rule requiring globally unique order IDs.',
        sql: `INSERT INTO cap_partition_orders (placed_on, order_id, tenant_id, total)
VALUES ('2026-11-05',1,8,9);
SELECT placed_on, order_id, tenant_id FROM cap_partition_orders WHERE order_id = 1 ORDER BY placed_on;`,
        expected: 'Both rows are accepted because their complete keys differ. For a variation, try the identical pair (2026-10-15, 1): its primary-key check rejects it. PostgreSQL’s partitioned unique constraint must include the partition key; choosing a composite key changes the promise rather than proving uniqueness of order_id alone. Reset and rerun step 1.',
      },
    ],
  },
  {
    id: 'shard-cutover',
    title: 'Move a tenant without losing its last change',
    description: 'Model a live copy, detect a stale destination, apply changes and reject an old writer generation.',
    articleHref: '/learn/databases/relational/partitioning-and-sharding/#moving-data',
    steps: [
      {
        title: 'Create the source and ownership model',
        instruction: 'This is a one-connection SQL model, not a distributed migration. Tenant 7 belongs to A at generation 1; B is empty. Every modeled writer consults the owner gate in a single-connection schedule. A real deployment must coordinate admission with cutover and enforce authority despite stale routers and lost networks. Run setup first; reset and repeat it to start again.',
        sql: `DROP TABLE IF EXISTS cap_move_source, cap_move_destination, cap_move_log, cap_move_owner;
CREATE TABLE cap_move_source (tenant_id integer, order_id integer, amount integer NOT NULL, revision integer NOT NULL, PRIMARY KEY (tenant_id, order_id));
CREATE TABLE cap_move_destination (LIKE cap_move_source INCLUDING ALL);
CREATE TABLE cap_move_log (position integer PRIMARY KEY, tenant_id integer NOT NULL, order_id integer NOT NULL, operation text NOT NULL, amount integer, revision integer NOT NULL);
CREATE TABLE cap_move_owner (tenant_id integer PRIMARY KEY, writer text NOT NULL, generation integer NOT NULL, accepting_writes boolean NOT NULL);
INSERT INTO cap_move_owner (tenant_id, writer, generation, accepting_writes) VALUES (7,'A',1,true);
INSERT INTO cap_move_source (tenant_id, order_id, amount, revision) VALUES (7,1,25,1),(7,2,8,1);
SELECT * FROM cap_move_source ORDER BY order_id;`,
        expected: 'A starts with order 1 worth 25 and order 2 worth 8. B has no rows. The owner record distinguishes where requests go from the actual copies of their data.',
      },
      {
        title: 'Copy a snapshot, then accept a correction',
        instruction: 'Copy A’s initial rows to B. Then model one live source transaction correcting order 1 to 30 and recording its change at position 1. Predict whether B includes that later correction. WITH changed names the rows returned by the gated UPDATE; only those accepted changes are inserted into the log. The source change and its log entry succeed together.',
        sql: `INSERT INTO cap_move_destination SELECT * FROM cap_move_source;
WITH changed AS (
  UPDATE cap_move_source SET amount = 30, revision = 2
  WHERE tenant_id = 7 AND order_id = 1
  AND EXISTS (SELECT 1 FROM cap_move_owner WHERE tenant_id = 7 AND writer = 'A' AND generation = 1 AND accepting_writes)
  RETURNING tenant_id, order_id, amount, revision
)
INSERT INTO cap_move_log (position, tenant_id, order_id, operation, amount, revision)
SELECT 1, tenant_id, order_id, 'upsert', amount, revision FROM changed;
SELECT 'A' AS copy, order_id, amount FROM cap_move_source
UNION ALL SELECT 'B', order_id, amount FROM cap_move_destination ORDER BY order_id, copy;`,
        expected: 'A has 30 for order 1; B still has 25. Both copies contain two rows, so equal row counts would miss the error. In a real migration the snapshot and change-stream position must be coordinated so no change falls between them.',
      },
      {
        title: 'Include deletes as well as updates',
        instruction: 'Model the source deleting order 2 at position 2 and adding order 3 worth 12 at position 3. Each WITH clause passes accepted rows from its gated write into the log. B still holds the earlier snapshot. Predict the source’s IDs and why replaying only inserts could not repair B.',
        sql: `WITH removed AS (
  DELETE FROM cap_move_source WHERE tenant_id = 7 AND order_id = 2
  AND EXISTS (SELECT 1 FROM cap_move_owner WHERE tenant_id = 7 AND writer = 'A' AND generation = 1 AND accepting_writes)
  RETURNING tenant_id, order_id, revision
)
INSERT INTO cap_move_log (position, tenant_id, order_id, operation, amount, revision)
SELECT 2, tenant_id, order_id, 'delete', NULL, revision + 1 FROM removed;
WITH added AS (
  INSERT INTO cap_move_source (tenant_id, order_id, amount, revision)
  SELECT 7,3,12,1 WHERE EXISTS (
    SELECT 1 FROM cap_move_owner WHERE tenant_id = 7 AND writer = 'A' AND generation = 1 AND accepting_writes
  ) RETURNING tenant_id, order_id, amount, revision
)
INSERT INTO cap_move_log (position, tenant_id, order_id, operation, amount, revision)
SELECT 3, tenant_id, order_id, 'upsert', amount, revision FROM added;
SELECT * FROM cap_move_source ORDER BY order_id;`,
        expected: 'A contains IDs 1 and 3 with amounts 30 and 12. B still has IDs 1 and 2 with 25 and 8. Its row count is still equal to A’s. A deletion must travel as a change, not disappear from the copying protocol.',
      },
      {
        title: 'Pause admission and apply through the final position',
        instruction: 'The model now stops admitting A writes. No other session exists here, so there are no in-flight writers to drain. Position 3 is the final boundary. Apply these three recorded changes in order. A real mover needs durable progress, resumable replay and enforced draining before it can make the same claim.',
        sql: `UPDATE cap_move_owner SET accepting_writes = false WHERE tenant_id = 7 AND writer = 'A' AND generation = 1;
INSERT INTO cap_move_destination (tenant_id, order_id, amount, revision)
SELECT tenant_id, order_id, amount, revision FROM cap_move_log WHERE position = 1
ON CONFLICT (tenant_id, order_id) DO UPDATE SET amount = EXCLUDED.amount, revision = EXCLUDED.revision;
DELETE FROM cap_move_destination WHERE tenant_id = 7 AND order_id = 2;
INSERT INTO cap_move_destination (tenant_id, order_id, amount, revision)
SELECT tenant_id, order_id, amount, revision FROM cap_move_log WHERE position = 3
ON CONFLICT (tenant_id, order_id) DO UPDATE SET amount = EXCLUDED.amount, revision = EXCLUDED.revision;
SELECT * FROM cap_move_destination ORDER BY order_id;`,
        expected: 'B now contains the same complete rows as A: (1,30,2) and (3,12,1), showing ID, amount and revision. The gate remains closed. Repeating this exact bounded replay gives the same result, but it is not a general out-of-order change processor.',
      },
      {
        title: 'Verify before changing ownership',
        instruction: 'Compare complete rows in both directions. Predict zero differences. Only a matching destination permits this model’s conditional switch to B at generation 2. A failed comparison must keep writes paused for repair; do not blindly route to B because copying finished.',
        sql: `WITH differences AS (
  (SELECT * FROM cap_move_source EXCEPT SELECT * FROM cap_move_destination)
  UNION ALL
  (SELECT * FROM cap_move_destination EXCEPT SELECT * FROM cap_move_source)
)
SELECT count(*) AS differing_rows FROM differences;
UPDATE cap_move_owner SET writer = 'B', generation = 2, accepting_writes = true
WHERE tenant_id = 7 AND writer = 'A' AND generation = 1 AND accepting_writes = false
AND NOT EXISTS (
  (SELECT * FROM cap_move_source EXCEPT SELECT * FROM cap_move_destination)
  UNION ALL
  (SELECT * FROM cap_move_destination EXCEPT SELECT * FROM cap_move_source)
)
RETURNING *;`,
        expected: 'There are zero differences and ownership becomes B, generation 2. For a failure variation, reset, repeat through step 3, skip replay, close the gate and run this verification: it must refuse the switch. Resume only after resolving the differences.',
      },
      {
        title: 'Reject a request carrying the old generation',
        instruction: 'A delayed handler still thinks A at generation 1 owns the tenant. It tries to set order 1 to 99. Predict whether the gate allows it. The request must not report success when RETURNING is empty; a real caller refreshes routing and safely retries the same operation.',
        sql: `UPDATE cap_move_source AS s SET amount = 99
WHERE s.tenant_id = 7 AND s.order_id = 1
AND EXISTS (SELECT 1 FROM cap_move_owner WHERE tenant_id = 7 AND writer = 'A' AND generation = 1 AND accepting_writes)
RETURNING s.*;
SELECT amount FROM cap_move_source WHERE tenant_id = 7 AND order_id = 1;`,
        expected: 'The UPDATE returns no rows and A remains at 30. The conditional gate rejects the stale authority. This works because every writer in this model uses the same enforceable owner record; separate servers need an actual fencing mechanism.',
      },
      {
        title: 'Write through the new owner',
        instruction: 'The refreshed handler targets B, generation 2. Predict which copy changes. Once B accepts this new write, simply routing back to old A would lose it. Reset and rerun step 1 to repeat the movement.',
        sql: `UPDATE cap_move_destination AS d SET amount = 35, revision = revision + 1
WHERE d.tenant_id = 7 AND d.order_id = 1
AND EXISTS (SELECT 1 FROM cap_move_owner WHERE tenant_id = 7 AND writer = 'B' AND generation = 2 AND accepting_writes)
RETURNING d.*;
SELECT 'A' AS copy, amount FROM cap_move_source WHERE order_id = 1
UNION ALL SELECT 'B', amount FROM cap_move_destination WHERE order_id = 1 ORDER BY copy;`,
        expected: 'B changes to 35 at revision 3; A remains 30. Rollback of routing now requires copying or reconciling B’s new changes while preserving one writer. Retaining the old copy gives recovery options, not permission to make it authoritative again.',
      },
    ],
  },
];
