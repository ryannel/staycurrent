import type { Tutorial } from '../sql-sandbox-tutorials';

export const scalingSql = {
 partitionSetup: `DROP TABLE IF EXISTS pg_scale_events CASCADE;
DEALLOCATE ALL;
CREATE TABLE pg_scale_events (
 occurred_on date NOT NULL, event_id integer NOT NULL, tenant_id integer NOT NULL,
 PRIMARY KEY (occurred_on, event_id)
) PARTITION BY RANGE (occurred_on);
CREATE TABLE pg_scale_oct PARTITION OF pg_scale_events
 FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE pg_scale_nov PARTITION OF pg_scale_events
 FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
INSERT INTO pg_scale_events (occurred_on,event_id,tenant_id) VALUES
 ('2026-10-10',1,7),('2026-10-20',2,8),('2026-11-10',3,7),('2026-11-20',4,8);
SET plan_cache_mode=force_generic_plan;
PREPARE pg_scale_month(date,date) AS
 SELECT event_id,tenant_id FROM pg_scale_events
 WHERE occurred_on >= $1 AND occurred_on < $2;
SELECT tableoid::regclass AS stored_in, * FROM pg_scale_events ORDER BY occurred_on;`,
 october: `EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
EXECUTE pg_scale_month('2026-10-01','2026-11-01');
EXECUTE pg_scale_month('2026-10-01','2026-11-01');`,
 november: `EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
EXECUTE pg_scale_month('2026-11-01','2026-12-01');
EXECUTE pg_scale_month('2026-11-01','2026-12-01');`,
 tenantPlan: `EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT event_id FROM pg_scale_events WHERE tenant_id=7;`,
 repeatedId: `INSERT INTO pg_scale_events (occurred_on,event_id,tenant_id)
VALUES ('2026-11-15',1,7);
SELECT occurred_on,event_id FROM pg_scale_events WHERE event_id=1 ORDER BY occurred_on;
DEALLOCATE pg_scale_month;
RESET plan_cache_mode;`,
 tenantSetup: `DROP TABLE IF EXISTS pg_scale_orders, pg_scale_customers;
CREATE TABLE pg_scale_customers (
 tenant_id integer NOT NULL, customer_id integer NOT NULL, name text NOT NULL,
 PRIMARY KEY (tenant_id,customer_id)
);
CREATE TABLE pg_scale_orders (
 tenant_id integer NOT NULL, order_id integer NOT NULL, customer_id integer NOT NULL,
 total integer NOT NULL,
 PRIMARY KEY (tenant_id,order_id),
 FOREIGN KEY (tenant_id,customer_id)
   REFERENCES pg_scale_customers (tenant_id,customer_id)
);
INSERT INTO pg_scale_customers (tenant_id,customer_id,name)
VALUES (7,1,'Ada'),(8,1,'Bo'),(8,9,'Cy');
INSERT INTO pg_scale_orders (tenant_id,order_id,customer_id,total)
VALUES (7,101,1,25),(8,102,1,40);
SELECT * FROM pg_scale_customers ORDER BY tenant_id,customer_id;`,
 wrongJoin: `SELECT o.tenant_id AS order_tenant,o.order_id,c.tenant_id AS customer_tenant,c.name
FROM pg_scale_orders o JOIN pg_scale_customers c
 ON c.customer_id=o.customer_id
ORDER BY o.order_id,c.tenant_id;`,
 rightJoin: `SELECT o.tenant_id,o.order_id,c.name,o.total
FROM pg_scale_orders o JOIN pg_scale_customers c
 ON c.tenant_id=o.tenant_id AND c.customer_id=o.customer_id
WHERE o.tenant_id=7 ORDER BY o.order_id;`,
 badCustomer: `INSERT INTO pg_scale_orders (tenant_id,order_id,customer_id,total)
VALUES (7,103,9,12);`,
 addCustomer: `INSERT INTO pg_scale_customers (tenant_id,customer_id,name) VALUES (7,9,'Di');
INSERT INTO pg_scale_orders (tenant_id,order_id,customer_id,total) VALUES (7,103,9,12);
SELECT o.tenant_id,o.order_id,c.name,o.total
FROM pg_scale_orders o JOIN pg_scale_customers c
 ON c.tenant_id=o.tenant_id AND c.customer_id=o.customer_id
ORDER BY o.tenant_id,o.order_id;`,
};

export const postgresqlScalingTutorials: Tutorial[] = [
 {id:'pg-runtime-pruning',title:'Prune partitions after a parameter arrives',description:'Reuse a generic prepared plan, change its dates and see execution-time pruning choose a different child.',articleHref:'/learn/databases/relational/postgresql/sharding/#partitions',steps:[
  {title:'Prepare a plan before choosing a month',instruction:'Run this independent setup first. It creates four events across October and November in one database. PREPARE names a query with two date parameters. force_generic_plan deliberately makes PostgreSQL retain a parameterized plan instead of planning for each supplied date. Reset and repeat setup to restore the fixture.',sql:scalingSql.partitionSetup,expected:'Events 1–2 are in pg_scale_oct; 3–4 are in pg_scale_nov. Every table is local. No other server or shard router exists in this lesson.'},
  {title:'Supply October at execution',instruction:'EXPLAIN ANALYZE executes the prepared read and shows its work. Predict whether the generic plan must scan November merely because its bounds were unknown when it was prepared. The following EXECUTE displays the actual answer.',sql:scalingSql.october,expected:'The checked plan reports Subplans Removed: 1 and scans pg_scale_oct, returning IDs 1 and 2. Runtime pruning uses the supplied dates. The generic plan can retain multiple alternatives without executing all of them.'},
  {title:'Reuse it for November',instruction:'Keep the same prepared statement and supply the next date range. Predict both the scanned relation and answer before running. Try October again afterwards: the same named plan still serves it.',sql:scalingSql.november,expected:'One subplan is removed; pg_scale_nov is scanned and IDs 3 and 4 return. Changing parameter values changes the child selected at execution.'},
  {title:'Remove the partition-key predicate',instruction:'Tenant 7 has events in both months. This query filters only the tenant. Predict whether either date partition can be discarded, and compare the child scans with the previous plan.',sql:scalingSql.tenantPlan,expected:'Both children are scanned under Append, each producing one row. Pruning requires a reason from the partition bounds. A tenant index could help inside a child without removing the need to consider both.'},
  {title:'Inspect the declared identity',instruction:'The primary key contains both date and event ID. Predict whether ID 1 can occur again in November, then run once. This step also removes the prepared statement and restores normal plan selection. To repeat the experiment, rerun setup.',sql:scalingSql.repeatedId,expected:'ID 1 appears on October 10 and November 15. Different complete keys are accepted. The schema promises uniqueness of the pair, not uniqueness of event_id across all dates. Changing to many machines would not repair this mismatch with a globally unique business ID.'},
 ]},
 {id:'pg-tenant-keys',title:'Keep a tenant in every relationship',description:'Expose a cross-tenant join, repair its equality and test a foreign key that rejects the wrong tenant.',articleHref:'/learn/databases/relational/postgresql/sharding/#tenant',steps:[
  {title:'Give two tenants their own customer 1',instruction:'Run setup first. Tenant 7 has Ada; tenant 8 has Bo and customer 9, Cy. Each tenant has one order for its own customer 1. Composite primary and foreign keys carry the tenant identity. These are real local PostgreSQL constraints; this lesson does not install or simulate Citus workers.',sql:scalingSql.tenantSetup,expected:'Three customers: (7,1,Ada), (8,1,Bo), (8,9,Cy). Orders 101 and 102 belong to tenants 7 and 8 respectively. Reset and rerun setup to undo changes.'},
  {title:'Join on the incomplete identity',instruction:'Predict how many customers match each order when the join compares only customer_id. A foreign key on the table does not add missing predicates to an arbitrary SELECT.',sql:scalingSql.wrongJoin,expected:'Four rows: each order matches both Ada and Bo. Two rows cross tenant boundaries. Valid stored relationships do not make an incomplete query correct.'},
  {title:'Carry the tenant through the join',instruction:'Compare both columns of the customer identity and ask for tenant 7. Predict who owns order 101. Remove the WHERE clause as a variation to see both correctly joined orders.',sql:scalingSql.rightJoin,expected:'One row: tenant 7, order 101, Ada, total 25. Without WHERE, order 102 joins only Bo. In a Citus deployment with these tables colocated by tenant, the explicit tenant equality also enables local join work; no distributed plan is being measured here.'},
  {title:'Try borrowing another tenant’s customer',instruction:'Customer 9 exists only for tenant 8. Try creating a tenant-7 order for customer 9. This intentional failure runs alone so later steps remain usable.',sql:scalingSql.badCustomer,expected:'SQLSTATE 23503: the foreign key rejects (7,9). The existence of (8,9) does not satisfy it. No order 103 is inserted.',expectedError:'23503'},
  {title:'Create the missing local relationship',instruction:'Create tenant 7’s own customer 9, Di, then retry order 103. Predict whether Cy or Di appears. Run once after the failed insert; rerun setup before repeating the sequence.',sql:scalingSql.addCustomer,expected:'Order 103 joins Di and has total 12; orders 101/Ada and 102/Bo remain. The complete key protects the intended relationship before any later choice of worker placement.'},
 ]},
];
