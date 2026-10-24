-- CockroachDB 25.4.17. Run only in a new disposable database.
-- A tenant-scoped projection of the three core orders. No purchase is executed.
CREATE TABLE range_orders (
  shop_id INT NOT NULL,
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  status STRING NOT NULL,
  PRIMARY KEY (shop_id, order_id)
);
INSERT INTO range_orders VALUES
 (10,101,1,'paid'), (10,102,2,'paid'), (10,103,1,'pending');
CREATE INDEX range_orders_customer ON range_orders (shop_id, customer_id);
SHOW INDEXES FROM range_orders;
SHOW RANGES FROM INDEX range_orders@range_orders_pkey WITH DETAILS;
ALTER TABLE range_orders SPLIT AT VALUES (10,103);
SHOW RANGES FROM INDEX range_orders@range_orders_pkey WITH DETAILS;
SHOW RANGE FROM TABLE range_orders FOR ROW (10,103);
SHOW RANGES FROM INDEX range_orders@range_orders_customer WITH DETAILS;
SELECT * FROM range_orders ORDER BY shop_id, order_id;
