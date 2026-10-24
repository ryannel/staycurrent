import type { Tutorial } from '../sql-sandbox-tutorials';

export const relationalDepthChoicesTutorials: Tutorial[] = [
  {
    id: 'policy-composition',
    title: 'See how two row policies combine',
    description: 'Add a policy that unexpectedly widens a worker’s view, then repair the combination and test it.',
    articleHref: '/learn/databases/relational/postgresql/access-control/#combine-command-rights-with-row-rights',
    steps: [
      {
        title: 'Prepare a tenant worker and three orders',
        instruction: 'This independent fixture uses depth_access and a nonowner role, depth_shipping. Two orders belong to tenant 1: one ready and one packed. Tenant 2 has a ready order. The worker can read IDs and status only. RESET ROLE lets setup work after role switching. Restart or rerun setup to restore the beginning.',
        sql: `RESET ROLE;
DROP SCHEMA IF EXISTS depth_access CASCADE;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'depth_shipping') THEN
   CREATE ROLE depth_shipping NOLOGIN;
 END IF;
END $$;
CREATE SCHEMA depth_access;
CREATE TABLE depth_access.orders (
 order_id integer PRIMARY KEY, tenant_id integer NOT NULL,
 status text NOT NULL, email text NOT NULL
);
INSERT INTO depth_access.orders (order_id, tenant_id, status, email) VALUES
 (1, 1, 'ready', 'ada@example.invalid'),
 (2, 2, 'ready', 'lin@example.invalid'),
 (3, 1, 'packed', 'sam@example.invalid');
GRANT USAGE ON SCHEMA depth_access TO depth_shipping;
GRANT SELECT (order_id, status) ON depth_access.orders TO depth_shipping;
ALTER TABLE depth_access.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON depth_access.orders FOR SELECT TO depth_shipping
USING (tenant_id = 1);
SET ROLE depth_shipping;
SELECT order_id, status FROM depth_access.orders ORDER BY order_id;`,
        expected: 'Orders 1/ready and 3/packed are visible. The tenant policy permits both statuses for tenant 1. Order 2 belongs to tenant 2 and is absent.',
      },
      {
        title: 'Add a seemingly narrower policy',
        instruction: 'The operator wants only ready orders to be visible and adds another policy. Before running, decide whether two default policies mean tenant 1 AND ready or tenant 1 OR ready. Policy changes run as administrator; the final query runs as the worker.',
        sql: `RESET ROLE;
CREATE POLICY ready_orders ON depth_access.orders FOR SELECT TO depth_shipping
USING (status = 'ready');
SET ROLE depth_shipping;
SELECT order_id, status FROM depth_access.orders ORDER BY order_id;`,
        expected: 'All three orders appear. Default policies are permissive and combine with OR: 1 satisfies both, 2 satisfies ready, and 3 satisfies tenant 1. Adding the second policy widened the view rather than narrowing it.',
      },
      {
        title: 'Make readiness an additional requirement',
        instruction: 'Replace the readiness policy with a restrictive policy. The tenant policy still permits tenant 1; the restrictive rule must also pass. Predict which one of the three rows survives.',
        sql: `RESET ROLE;
DROP POLICY ready_orders ON depth_access.orders;
CREATE POLICY ready_orders ON depth_access.orders AS RESTRICTIVE
FOR SELECT TO depth_shipping USING (status = 'ready');
SET ROLE depth_shipping;
SELECT order_id, status FROM depth_access.orders ORDER BY order_id;`,
        expected: 'Only order 1/ready appears. Tenant 2 fails the permissive tenant condition; order 3 fails the restrictive readiness condition. For this policy set the rule is tenant 1 AND ready.',
      },
      {
        title: 'Check that a visible row does not grant every column',
        instruction: 'The worker can now see order 1. Predict whether that permits reading its email. Run this deliberately denied statement outside an explicit transaction.',
        sql: 'SELECT order_id, email FROM depth_access.orders;',
        expected: 'SQLSTATE 42501: column access is still denied. Row policies filter an already permitted operation; they do not grant missing column privileges.',
        expectedError: '42501',
      },
      {
        title: 'Remove the permission to see any rows',
        instruction: 'Keep the restrictive readiness rule but remove the permissive tenant policy. Predict whether a restrictive policy can grant access by itself.',
        sql: `RESET ROLE;
DROP POLICY tenant_scope ON depth_access.orders;
SET ROLE depth_shipping;
SELECT order_id, status FROM depth_access.orders ORDER BY order_id;`,
        expected: 'No rows appear. At least one applicable permissive policy must allow a row before restrictive policies can narrow that permission.',
      },
      {
        title: 'Restore the intended policy and release the role',
        instruction: 'Restore the permissive tenant rule and verify the allowed result. Then return to the administrator so later work does not inherit this role. To explore another condition, reset and change the restrictive readiness test to packed: predict that only order 3 will appear.',
        sql: `RESET ROLE;
CREATE POLICY tenant_scope ON depth_access.orders FOR SELECT TO depth_shipping
USING (tenant_id = 1);
SET ROLE depth_shipping;
SELECT order_id, status FROM depth_access.orders ORDER BY order_id;
RESET ROLE;`,
        expected: 'The worker again sees only order 1/ready. The packed variation would permit only order 3. The original column grants remain unchanged throughout.',
      },
    ],
  },
  {
    id: 'outbox-delivery',
    title: 'Keep a committed change and its delivery obligation together',
    description: 'Commit source state and an outbox event, model a lost delivery acknowledgement, and replay without undoing newer state.',
    articleHref: '/learn/databases/relational/outboxes-and-jobs/',
    steps: [
      {
        title: 'Prepare the catalogue, pending events and destination model',
        instruction: 'These three tables live in ONE browser database. They model a catalogue, its outbox and an independently updated search destination; there is no network or second server. You act first as the application, then as one delivery worker. Product 1 starts active at version 1. Restart or rerun setup to reset.',
        sql: `DROP TABLE IF EXISTS depth_outbox, depth_search, depth_catalogue;
CREATE TABLE depth_catalogue (
 product_id integer PRIMARY KEY, version integer NOT NULL,
 title text NOT NULL, active boolean NOT NULL
);
CREATE TABLE depth_outbox (
 product_id integer NOT NULL, version integer NOT NULL,
 title text NOT NULL, active boolean NOT NULL,
 delivered_at timestamptz, PRIMARY KEY (product_id, version)
);
CREATE TABLE depth_search (LIKE depth_catalogue INCLUDING ALL);
INSERT INTO depth_catalogue (product_id, version, title, active)
VALUES (1, 1, 'Blue mug', true);
INSERT INTO depth_search SELECT * FROM depth_catalogue;
SELECT * FROM depth_catalogue;`,
        expected: 'Catalogue and destination both contain product 1/version 1/active true. The outbox is empty. Its compound key identifies one product version, not a global event order.',
      },
      {
        title: 'Roll back a source change and its event',
        instruction: 'The application changes the product and inserts the complete resulting state into its outbox in one transaction. Here it deliberately rolls back. Predict both the catalogue version and pending-event count afterwards. WITH changed passes the UPDATE’s returned row directly into the INSERT.',
        sql: `BEGIN;
WITH changed AS (
 UPDATE depth_catalogue SET active = false, version = version + 1
 WHERE product_id = 1 RETURNING product_id, version, title, active
)
INSERT INTO depth_outbox (product_id, version, title, active)
SELECT product_id, version, title, active FROM changed;
ROLLBACK;
SELECT version, active FROM depth_catalogue WHERE product_id = 1;
SELECT count(*) AS pending FROM depth_outbox WHERE delivered_at IS NULL;`,
        expected: 'Version 1 remains active and pending = 0. Neither the catalogue change nor its publish obligation survived the rollback.',
      },
      {
        title: 'Commit the same operation',
        instruction: 'Now commit the withdrawal and its event. The UPDATE increments the version on the row it changes; the event receives that exact returned state. Predict what remains even if the application process stops immediately after this commit.',
        sql: `BEGIN;
WITH changed AS (
 UPDATE depth_catalogue SET active = false, version = version + 1
 WHERE product_id = 1 RETURNING product_id, version, title, active
)
INSERT INTO depth_outbox (product_id, version, title, active)
SELECT product_id, version, title, active FROM changed;
COMMIT;
SELECT * FROM depth_outbox ORDER BY product_id, version;`,
        expected: 'The source is inactive at version 2, and a pending version-2 event contains Blue mug/active false. A later worker can discover it without the application remembering to make another call. The destination still has version 1.',
      },
      {
        title: 'Let the worker discover committed work',
        instruction: 'One worker reads an undelivered event from the source database, then sends its complete payload to the destination. This query is discovery only; it does not mark delivery. Predict the pending event and the stale search result.',
        sql: `SELECT product_id, version, title, active FROM depth_outbox
WHERE delivered_at IS NULL ORDER BY product_id, version LIMIT 1;
SELECT product_id, title FROM depth_search WHERE active;`,
        expected: 'The worker finds version 2/inactive, but search still offers Blue mug. This lesson has one sequential worker; it does not implement concurrent worker claims or leases.',
      },
      {
        title: 'Apply the event but lose the acknowledgement',
        instruction: 'Act as the destination receiving version 2. Its conditional upsert applies only newer complete state. Let this run finish so the destination change commits, but deliberately leave delivered_at null. That remaining pending event models the worker stopping or losing the reply before recording delivery at the source.',
        sql: `INSERT INTO depth_search (product_id, version, title, active)
VALUES (1, 2, 'Blue mug', false)
ON CONFLICT (product_id) DO UPDATE
SET version = EXCLUDED.version, title = EXCLUDED.title, active = EXCLUDED.active
WHERE EXCLUDED.version > depth_search.version
RETURNING product_id, version, active;
SELECT count(*) AS pending FROM depth_outbox WHERE delivered_at IS NULL;`,
        expected: 'The destination returns product 1/version 2/active false, while pending remains 1. Two separate real systems could have exactly this state; the model creates it deliberately without a network failure.',
      },
      {
        title: 'Redeliver, then record the successful acknowledgement',
        instruction: 'The restarted worker sends the same immutable payload again. Predict whether the destination changes a row. In this protocol, a successful same-version application or no-op is acknowledged; a transport failure is not. After that acknowledgement the worker marks this exact event delivered on its source connection.',
        sql: `INSERT INTO depth_search (product_id, version, title, active)
VALUES (1, 2, 'Blue mug', false)
ON CONFLICT (product_id) DO UPDATE
SET version = EXCLUDED.version, title = EXCLUDED.title, active = EXCLUDED.active
WHERE EXCLUDED.version > depth_search.version
RETURNING product_id, version, active;
UPDATE depth_outbox SET delivered_at = clock_timestamp()
WHERE product_id = 1 AND version = 2 AND delivered_at IS NULL;
SELECT (SELECT version FROM depth_search WHERE product_id = 1) AS applied_version,
       (SELECT count(*) FROM depth_outbox WHERE delivered_at IS NULL) AS pending;`,
        expected: 'The INSERT returns no changed row: version 2 already exists. The final result is applied_version = 2 and pending = 0. For the real worker these are separate destination and source calls; an error or missing destination reply must leave the event pending.',
      },
      {
        title: 'Deliver an obsolete active version',
        instruction: 'A delayed version-1 payload arrives after withdrawal. Predict whether it can make the product active. The retained version protects this complete-state model; it would not make skipping counter increments safe. Reset to experiment with marking delivery before destination application and explain why a stopped worker would then lose the obligation.',
        sql: `INSERT INTO depth_search (product_id, version, title, active)
VALUES (1, 1, 'Blue mug', true)
ON CONFLICT (product_id) DO UPDATE
SET version = EXCLUDED.version, title = EXCLUDED.title, active = EXCLUDED.active
WHERE EXCLUDED.version > depth_search.version;
SELECT * FROM depth_search;
SELECT product_id, title FROM depth_search WHERE active;`,
        expected: 'The retained version 2 remains inactive; the active search returns no rows. Delivery may repeat, but an old or duplicate complete state cannot undo a newer one. No exactly-once transport was established.',
      },
    ],
  },
];
