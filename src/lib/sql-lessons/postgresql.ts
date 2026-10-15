import type { Tutorial } from '../sql-sandbox-tutorials';

export const postgresqlTutorials: Tutorial[] = [
 {
  id:'pg-read-write', title:'Follow an indexed read and a committed change',
  description:'Inspect PostgreSQL’s access path, update a stock row, and separate its identity from its row location.',
  articleHref:'/learn/databases/relational/postgresql/architecture/',
  steps:[
   {title:'Prepare a stocked catalogue',instruction:'Run this independent setup first. It creates 10,000 products, each with three available units. You act as an application caller on one connection. The primary key creates a B-tree index. Restart the lesson or rerun setup to restore all stock and remove variations.',
    sql:`DROP TABLE IF EXISTS pg_path_products;
CREATE TABLE pg_path_products (product_id integer PRIMARY KEY, name text NOT NULL, available integer NOT NULL CHECK (available >= 0));
INSERT INTO pg_path_products (product_id,name,available)
SELECT n, 'Product ' || n, 3 FROM generate_series(1,10000) AS g(n);
ANALYZE pg_path_products;
SELECT product_id, name, available, ctid::text AS location FROM pg_path_products WHERE product_id=7;`,expected:'Product 7 has three available units. Its ctid is a physical row-version location such as (0,7); exact locations are not promised or stable application IDs.'},
   {title:'Inspect the read’s path',instruction:'Predict whether finding one product needs to inspect all 10,000 rows. Read the plan from its scan and compare emitted rows with the query’s one-row answer. BUFFERS counts page accesses, not distinct physical disk reads.',
    sql:`EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT product_id,name,available FROM pg_path_products WHERE product_id=7;`,expected:'The verified run uses the primary-key index and returns one row. An ordinary Index Scan finds a candidate through the index and fetches its heap version. Buffer counts reflect this embedded runtime, not a server storage benchmark.'},
   {title:'Commit a conditional reservation',instruction:'The application attempts to reserve two units. Run once and inspect RETURNING. In a real handler, continue to record the purchase only after one row is returned; this bounded exercise commits only the stock change to inspect its storage behaviour.',
    sql:`BEGIN;
UPDATE pg_path_products SET available=available-2
WHERE product_id=7 AND available>=2
RETURNING product_id,available,ctid::text AS location;
COMMIT;`,expected:'Product 7 returns available 1 at a new row-version location, then commits. Its logical product ID stays 7. The browser confirms SQL behaviour, not that a networked server flushed physical media.'},
   {title:'Read the committed row and try the guard again',instruction:'Read product 7, then attempt the same two-unit reservation again. Predict whether the second UPDATE returns a row. As a variation, change its requested quantity and guard from 2 to 1; one remaining unit can then be reserved. Reset setup afterwards.',
    sql:`SELECT product_id,name,available,ctid::text AS location FROM pg_path_products WHERE product_id=7;
UPDATE pg_path_products SET available=available-2
WHERE product_id=7 AND available>=2
RETURNING product_id,available;`,expected:'The read shows available 1. The UPDATE returns no row because 1 is below 2. It does not reserve anything. With the one-unit variation the row returns 0.'},
  ],
 },
 {
  id:'pg-access-methods', title:'Match an index to what the query asks',
  description:'Compare ordered B-tree access, JSON containment with GIN and page-range elimination with BRIN.',
  articleHref:'/learn/databases/relational/postgresql/indexes/',
  steps:[
   {title:'Prepare ordered events with occasional priority tags',instruction:'Run setup first. It creates 20,000 events one second apart, inserted in timestamp order, with priority on every thousandth event. The note makes records wider than the index keys. The only initial index is the event-ID primary key. Reset this setup to repeat any index creation.',
    sql:`DROP TABLE IF EXISTS pg_method_events;
CREATE TABLE pg_method_events (event_id integer PRIMARY KEY, occurred_at timestamp NOT NULL, attributes jsonb NOT NULL, note text NOT NULL);
INSERT INTO pg_method_events (event_id,occurred_at,attributes,note)
SELECT n, timestamp '2026-01-01' + n * interval '1 second',
 jsonb_build_object('tag',CASE WHEN n % 1000=0 THEN 'priority' ELSE 'normal' END,'source','web'),
 repeat('event detail ',12)
FROM generate_series(1,20000) AS g(n);
ANALYZE pg_method_events;
SELECT count(*) AS events, count(*) FILTER (WHERE attributes @> '{"tag":"priority"}') AS priority FROM pg_method_events;`,expected:'20,000 events, including 20 priority events. The timestamp range begins at 00:00:01 and ends at 05:33:20 on 1 January.'},
   {title:'Read the newest events through an ordered index',instruction:'Create a timestamp B-tree, then inspect the newest-five query. Predict which IDs appear and whether the plan needs a separate sort. Run this whole step once; later rerun only its queries.',
    sql:`CREATE INDEX pg_method_recent ON pg_method_events (occurred_at DESC, event_id DESC);
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT event_id,occurred_at FROM pg_method_events ORDER BY occurred_at DESC,event_id DESC LIMIT 5;
SELECT event_id FROM pg_method_events ORDER BY occurred_at DESC,event_id DESC LIMIT 5;`,expected:'IDs 20000 through 19996 appear. The verified plan uses the B-tree ordering and stops after five rows without a separate sort.'},
   {title:'Find a value inside JSON with GIN',instruction:'GIN extracts searchable information from each JSON value. jsonb_path_ops supports this containment operator, @>. Predict how many events match. Inspect Index Cond, recheck and actual rows rather than only the index name.',
    sql:`CREATE INDEX pg_method_attributes ON pg_method_events USING gin (attributes jsonb_path_ops);
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT event_id FROM pg_method_events WHERE attributes @> '{"tag":"priority"}';
SELECT count(*) AS matches FROM pg_method_events WHERE attributes @> '{"tag":"priority"}';`,expected:'20 events match. The verified plan uses a bitmap index scan through GIN and visits candidate heap rows. GIN does not supply newest-first timestamp ordering.'},
   {title:'Ask a different expression about the same field',instruction:'This query returns the same IDs for our data, but it compares extracted text with equality rather than using JSON containment. Predict whether the existing GIN index provides the same access path. Do not change planner settings to force it.',
    sql:`EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT event_id FROM pg_method_events WHERE attributes ->> 'tag' = 'priority';
SELECT count(*) AS matches FROM pg_method_events WHERE attributes ->> 'tag' = 'priority';`,expected:'The answer remains 20. The verified plan scans the table because that text expression does not match the whole-document GIN containment access. A B-tree expression index on the extracted tag would be a different candidate.'},
   {title:'Summarise timestamp ranges with BRIN',instruction:'Remove the timestamp B-tree so it does not mask this alternative. BRIN stores summaries of groups of table pages. Our rows are physically correlated with time, so many page ranges can be excluded for one minute. pages_per_range=4 makes the small teaching table show this effect; it is not a production recommendation.',
    sql:`DROP INDEX pg_method_recent;
CREATE INDEX pg_method_time_ranges ON pg_method_events USING brin (occurred_at) WITH (pages_per_range=4);
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT count(*) FROM pg_method_events
WHERE occurred_at >= timestamp '2026-01-01 00:30:00'
  AND occurred_at < timestamp '2026-01-01 00:31:00';
SELECT count(*) AS matches FROM pg_method_events
WHERE occurred_at >= timestamp '2026-01-01 00:30:00'
  AND occurred_at < timestamp '2026-01-01 00:31:00';`,expected:'60 events match: seconds 1800 through 1859. The verified BRIN bitmap path identifies candidate page ranges and rechecks their rows. Lossy heap blocks are expected: the summary selects pages, not an exact list of matching event rows.'},
   {title:'Change the requested minute',instruction:'Predict the count for this earlier minute, then inspect it. Compare its page work with the previous range; exact numbers depend on layout. A wider interval needs more ranges. Reset setup to restore the original index set.',
    sql:`EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT count(*) FROM pg_method_events
WHERE occurred_at >= timestamp '2026-01-01 00:10:00'
  AND occurred_at < timestamp '2026-01-01 00:11:00';
SELECT min(event_id),max(event_id),count(*) FROM pg_method_events
WHERE occurred_at >= timestamp '2026-01-01 00:10:00'
  AND occurred_at < timestamp '2026-01-01 00:11:00';`,expected:'IDs 600 through 659, 60 events. Try a full-day range afterwards: it matches all 20,000 records, so BRIN has no irrelevant time ranges to exclude.'},
  ],
 },
 {
  id:'pg-visibility', title:'Watch an update change index-only access',
  description:'Compare row-version identity and heap fetches before an update, after it, and after vacuum.',
  articleHref:'/learn/databases/relational/postgresql/row-versions/',
  steps:[
   {title:'Prepare a covering index',instruction:'Run this independent setup. There are 2,000 products, each available=3. A covering index carries the fields of our first-five-products query. We inspect ordinary SQL visibility and plan counters; this lesson has only one connection and cannot hold an independent old reader.',
    sql:`DROP TABLE IF EXISTS pg_visibility_products;
CREATE TABLE pg_visibility_products (product_id integer PRIMARY KEY, available integer NOT NULL, note text NOT NULL);
INSERT INTO pg_visibility_products (product_id,available,note)
SELECT n,3,repeat('stock note ',12) FROM generate_series(1,2000) AS g(n);
CREATE INDEX pg_visibility_cover ON pg_visibility_products (product_id) INCLUDE (available);
ANALYZE pg_visibility_products;
SELECT product_id,available,ctid::text AS location,xmin::text AS created_by FROM pg_visibility_products WHERE product_id=1;`,expected:'Product 1 has available 3 and a row-version location and creator transaction ID. Those internal identifiers are observations, not application keys. Restart or rerun setup to reset.'},
   {title:'Let vacuum establish page visibility',instruction:'Run VACUUM by itself, outside a transaction block. With no older reader retaining versions, eligible pages can be marked all-visible. Loading the next step does not execute it.',
    sql:'VACUUM (ANALYZE) pg_visibility_products;',expected:'VACUUM succeeds. It can update visibility information and reclaim eligible dead versions; it does not change the five product values we will read.'},
   {title:'Read entirely from the covering index where possible',instruction:'Predict the five amounts and inspect Heap Fetches in the plan. The index contains the fields, and the visibility map can allow the executor to avoid the heap.',
    sql:`EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT product_id,available FROM pg_visibility_products WHERE product_id<=5 ORDER BY product_id;`,expected:'The verified plan is an Index Only Scan with Heap Fetches: 0 and five rows. If your edited setup changes the plan, interpret its actual access path rather than assuming this name.'},
   {title:'Update one indexed value',instruction:'Change product 1 to one available unit. Predict whether its logical ID, physical version location and creator ID all stay the same. The covering index includes available, so this update also changes data stored in that index.',
    sql:`UPDATE pg_visibility_products SET available=1 WHERE product_id=1;
SELECT product_id,available,ctid::text AS location,xmin::text AS created_by FROM pg_visibility_products WHERE product_id=1;`,expected:'Logical ID 1 remains; its visible row version has a new location and creator ID. The SELECT in this submitted batch sees its own update. The batch commits when this run completes.'},
   {title:'Inspect the committed update’s access path',instruction:'This new run begins after the update batch committed. Predict whether every relevant heap page can still be treated as all-visible, then inspect Heap Fetches.',
    sql:`EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT product_id,available FROM pg_visibility_products WHERE product_id<=5 ORDER BY product_id;`,expected:'The verified Index Only Scan now performs heap fetches because affected pages cannot simply be assumed all-visible. It still returns the correct committed values. This observation is separate from the preceding update transaction.'},
   {title:'Vacuum after the change',instruction:'Run this separately after the update committed. Predict whether vacuum should restore available to 3 or merely change access and cleanup state.',
    sql:'VACUUM (ANALYZE) pg_visibility_products;',expected:'Vacuum does not undo the committed update. With no old reader here, it can clean eligible versions and restore applicable visibility-map bits.'},
   {title:'Read the same values with fewer heap visits',instruction:'Inspect the plan again and then the values. As a variation, update product 2 to 2 and repeat the previous two steps, keeping VACUUM in its own run. Restart setup to restore every value.',
    sql:`EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT product_id,available FROM pg_visibility_products WHERE product_id<=5 ORDER BY product_id;
SELECT product_id,available FROM pg_visibility_products WHERE product_id<=5 ORDER BY product_id;`,expected:'The verified plan returns to Heap Fetches: 0. Values are 1,3,3,3,3. Vacuum changes eligibility for avoiding heap access, not the application’s stock history.'},
  ],
 },
 {
  id:'pg-wal-records',title:'WAL can describe work that never commits',
  description:'Observe WAL generation for an update, roll it back, and compare the logical result with a committed update.',
  articleHref:'/learn/databases/relational/postgresql/recovery/',
  steps:[
   {title:'Prepare one logged record',instruction:'Run this independent setup first. The ordinary pg_wal_example table is WAL-logged; a temporary marker records a position without adding table WAL for that marker. This browser runtime can expose WAL counters but cannot demonstrate physical disk flushing or crash recovery. Restart setup to reset the record.',
    sql:`DROP TABLE IF EXISTS pg_wal_example, pg_wal_marker;
CREATE TABLE pg_wal_example (id integer PRIMARY KEY, available integer NOT NULL);
INSERT INTO pg_wal_example (id,available) VALUES (1,3);
CREATE TEMP TABLE pg_wal_marker (position pg_lsn NOT NULL);
INSERT INTO pg_wal_marker (position) VALUES (pg_current_wal_insert_lsn());
SELECT id,available FROM pg_wal_example;`,expected:'One row: id 1, available 3. The marker captures an insertion position in the WAL stream, not evidence that this position is flushed to durable media.'},
   {title:'Perform an update and leave it uncommitted',instruction:'BEGIN keeps this transaction open on the current connection. EXPLAIN ANALYZE executes the UPDATE, and WAL asks it to report generated log records and bytes. Predict what this connection reads before rollback.',
    sql:`BEGIN;
EXPLAIN (ANALYZE, WAL, BUFFERS, TIMING OFF)
UPDATE pg_wal_example SET available=1 WHERE id=1;
SELECT id,available FROM pg_wal_example;`,expected:'This connection reads available 1. The plan reports WAL generation even though no COMMIT was sent. Exact byte and record counts depend on state. The transaction remains open.'},
   {title:'Roll back and inspect the logical state',instruction:'Predict whether rollback makes the inserted WAL bytes disappear. End the transaction, then compare the current WAL insertion position with the earlier marker.',
    sql:`ROLLBACK;
SELECT id,available FROM pg_wal_example;
SELECT pg_wal_lsn_diff(pg_current_wal_insert_lsn(),position)>0 AS wal_advanced FROM pg_wal_marker;`,expected:'available returns to 3, while wal_advanced is true in the verified run. WAL records describe physical work, including work from transactions that later abort. Rollback does not erase the stream.'},
   {title:'Commit the same logical change',instruction:'Now run and commit the update. Compare the visible state with the rollback case. A real application waits for COMMIT’s response before reporting this transaction successful, while still handling a lost response as an uncertain outcome.',
    sql:`BEGIN;
UPDATE pg_wal_example SET available=1 WHERE id=1;
COMMIT;
SELECT id,available FROM pg_wal_example;`,expected:'available is now 1 in a later statement. A subsequent ROLLBACK cannot undo it. This verifies SQL commit behaviour in PGlite, not a server’s power-loss durability.'},
   {title:'Change the experiment’s quantity',instruction:'Reset setup, then edit step 2 to set available to 2 instead. Predict both the read before rollback and the final value after rollback. You may also inspect the configuration below, but do not infer a production durability promise from an embedded runtime’s settings.',
    sql:`SELECT current_setting('synchronous_commit') AS synchronous_commit,
       current_setting('fsync') AS fsync;`,expected:'These are this runtime’s settings. On a real server, commit durability also depends on the configured flush/replication policy and storage honouring it. In the suggested variation, the uncommitted read is 2 and rollback restores 3.'},
  ],
 },
];
