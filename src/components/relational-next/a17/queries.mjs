export const setup = `CREATE TEMP TABLE change_orders (
 tenant_id integer NOT NULL,
 order_id integer NOT NULL,
 status text NOT NULL DEFAULT 'open'
   CHECK (status IN ('open', 'cancelled')),
 note text,
 PRIMARY KEY (tenant_id, order_id)
);
CREATE TEMP TABLE stock (
 tenant_id integer NOT NULL,
 sku text NOT NULL,
 available integer NOT NULL CHECK (available >= 0),
 PRIMARY KEY (tenant_id, sku)
);
CREATE TEMP TABLE receipts (
 receipt_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 tenant_id integer NOT NULL,
 order_id integer NOT NULL,
 external_ref text NOT NULL,
 amount numeric(10,2) NOT NULL CHECK (amount > 0),
 UNIQUE (tenant_id, external_ref),
 FOREIGN KEY (tenant_id, order_id)
   REFERENCES change_orders (tenant_id, order_id)
);
CREATE TEMP TABLE change_lines (
 tenant_id integer NOT NULL,
 order_id integer NOT NULL,
 line_no integer NOT NULL,
 PRIMARY KEY (tenant_id, order_id, line_no),
 FOREIGN KEY (tenant_id, order_id)
   REFERENCES change_orders (tenant_id, order_id) ON DELETE CASCADE
);
CREATE TEMP TABLE deliveries (
 tenant_id integer NOT NULL, sku text NOT NULL,
 units integer NOT NULL CHECK (units > 0)
);
INSERT INTO change_orders (tenant_id, order_id, status, note) VALUES
 (1,101,'open',NULL), (1,102,'open','fragile'),
 (1,105,'cancelled',NULL), (2,101,'open',NULL);
INSERT INTO stock VALUES (1,'P7',5), (1,'P8',2), (2,'P7',9);
INSERT INTO receipts (tenant_id, order_id, external_ref, amount)
 VALUES (1,101,'bank-1',15);
INSERT INTO change_lines VALUES (1,101,1), (1,101,2), (1,105,1);
INSERT INTO deliveries VALUES (1,'P7',2), (1,'P7',3), (1,'P9',4);`;
export const target = `BEGIN;
SELECT tenant_id, order_id, status
FROM change_orders
WHERE tenant_id = 1 AND order_id = 101 AND status = 'open';
UPDATE change_orders SET status = 'cancelled'
WHERE tenant_id = 1 AND order_id = 101 AND status = 'open'
RETURNING tenant_id, order_id, status;
-- (1, 101, cancelled); UPDATE 1
ROLLBACK;`;
export const inserts = `BEGIN;
INSERT INTO change_orders (tenant_id, order_id)
VALUES (1,107), (1,108)
RETURNING tenant_id, order_id, status, note;
-- Two rows: open, NULL.
INSERT INTO receipts (tenant_id, order_id, external_ref, amount)
VALUES (1,107,'bank-2',12), (1,108,'bank-3',8)
RETURNING receipt_id, tenant_id, external_ref, amount;
ROLLBACK;`;
export const fromQuery = `BEGIN;
INSERT INTO stock (tenant_id, sku, available)
SELECT tenant_id, sku, SUM(units)::integer
FROM deliveries
GROUP BY tenant_id, sku
ON CONFLICT (tenant_id, sku) DO UPDATE
 SET available = stock.available + EXCLUDED.available
RETURNING tenant_id, sku, available;
-- P7: 10; P9: 4. P8 remains 2; tenant 2's P7 remains 9.
ROLLBACK;`;
export const decrement = `BEGIN;
UPDATE stock SET available = available - 3
WHERE tenant_id = 1 AND sku = 'P7' AND available >= 3
RETURNING tenant_id, sku, available;
-- (1, P7, 2); UPDATE 1
UPDATE stock SET available = available - 3
WHERE tenant_id = 1 AND sku = 'P7' AND available >= 3
RETURNING tenant_id, sku, available;
-- No rows; UPDATE 0.
ROLLBACK;`;
export const ambiguous = `BEGIN;
-- Wrong source contract: P7 matches two delivery rows.
UPDATE stock AS s SET available = s.available + d.units
FROM deliveries AS d
WHERE s.tenant_id = d.tenant_id AND s.sku = d.sku
RETURNING s.tenant_id, s.sku, s.available;
-- Our run returned 7 for P7, not the required 10.
ROLLBACK;`;
export const sourceUpdate = `BEGIN;
SELECT tenant_id, sku, COUNT(*) AS source_rows
FROM deliveries GROUP BY tenant_id, sku HAVING COUNT(*) > 1;
-- (1, P7, 2).
WITH incoming AS (
 SELECT tenant_id, sku, SUM(units)::integer AS units
 FROM deliveries GROUP BY tenant_id, sku
)
UPDATE stock AS s SET available = s.available + i.units
FROM incoming AS i
WHERE s.tenant_id = i.tenant_id AND s.sku = i.sku
RETURNING s.tenant_id, s.sku, s.available;
-- (1, P7, 10). P9 has no target, so UPDATE does not insert it.
ROLLBACK;`;
export const deletion = `BEGIN;
DELETE FROM change_orders AS o
WHERE o.tenant_id = 1 AND o.status = 'cancelled'
  AND EXISTS (
    SELECT 1 FROM change_lines AS l
    WHERE l.tenant_id = o.tenant_id AND l.order_id = o.order_id
  )
RETURNING o.tenant_id, o.order_id;
-- (1, 105); DELETE 1.
SELECT COUNT(*) FROM change_lines
WHERE tenant_id = 1 AND order_id = 105;
-- 0: the declared cascade deleted its line too.
ROLLBACK;`;
export const conflict = `BEGIN;
INSERT INTO stock (tenant_id, sku, available) VALUES (1,'P7',5)
ON CONFLICT (tenant_id, sku) DO UPDATE
 SET available = stock.available + EXCLUDED.available
RETURNING tenant_id, sku, available;
-- (1, P7, 10).
ROLLBACK;
BEGIN;
INSERT INTO stock (tenant_id, sku, available) VALUES (1,'P7',5)
ON CONFLICT (tenant_id, sku) DO UPDATE
 SET available = EXCLUDED.available
RETURNING tenant_id, sku, available;
-- (1, P7, 5): replacement, not addition.
ROLLBACK;`;
export const merge = `BEGIN;
MERGE INTO stock AS s
USING (VALUES (1,'P7',8,false), (1,'P8',0,true), (1,'P9',4,false))
 AS incoming(tenant_id, sku, counted, retire)
ON s.tenant_id = incoming.tenant_id AND s.sku = incoming.sku
WHEN MATCHED AND incoming.retire THEN DELETE
WHEN MATCHED THEN UPDATE SET available = incoming.counted
WHEN NOT MATCHED AND NOT incoming.retire THEN
 INSERT (tenant_id, sku, available)
 VALUES (incoming.tenant_id, incoming.sku, incoming.counted)
RETURNING merge_action(), s.tenant_id, s.sku, s.available;
-- UPDATE P7 to 8; DELETE P8; INSERT P9 with 4; MERGE 3.
ROLLBACK;`;
export const failure = `BEGIN;
UPDATE stock SET available = available - 6
WHERE tenant_id = 1 AND sku = 'P7';
-- ERROR: check constraint violation, SQLSTATE 23514.
SELECT available FROM stock;
-- ERROR: current transaction is aborted, SQLSTATE 25P02.
ROLLBACK;
SELECT available FROM stock WHERE tenant_id = 1 AND sku = 'P7';
-- 5: the session is usable again.`;
