export const selectOrders = `SELECT order_id, status
FROM orders
WHERE customer_id = 1
ORDER BY order_id;`;
export const summary = `SELECT o.order_id, c.name,
       SUM(i.quantity * i.unit_price_gbp) AS item_total_gbp
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
JOIN order_items AS i ON i.order_id = o.order_id
GROUP BY o.order_id, c.name
ORDER BY o.order_id;`;
export const insertOrder = `INSERT INTO orders (order_id, customer_id, status)
VALUES (103, 1, 'pending_payment');`;
export const insertItem = `INSERT INTO order_items (order_id, product_id, quantity, unit_price_gbp)
VALUES (103, 'MUG', 1, 20.00);`;
export const reserve = `UPDATE products
SET available = available - 1
WHERE product_id = 'MUG' AND available >= 1
RETURNING available;`;
export const checkout = `BEGIN;
${insertOrder}
${insertItem}
${reserve}
-- One row back: a mug was reserved, so the application commits.
-- No row back: none was left, so it sends ROLLBACK instead.
COMMIT;`;
export const fixture = `CREATE TABLE customers (
  customer_id integer PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE products (
  product_id text PRIMARY KEY,
  available integer NOT NULL CHECK (available >= 0)
);
CREATE TABLE orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers,
  status text NOT NULL CHECK (status IN ('draft', 'pending_payment', 'paid', 'cancelled')),
  shipped_at timestamptz
);
CREATE TABLE order_items (
  order_id integer NOT NULL REFERENCES orders,
  product_id text NOT NULL REFERENCES products,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_gbp numeric(10,2) NOT NULL CHECK (unit_price_gbp >= 0),
  PRIMARY KEY (order_id, product_id)
);
INSERT INTO customers VALUES (1, 'Mina'), (2, 'Arun');
INSERT INTO products VALUES ('MUG', 1), ('TEA', 4);
INSERT INTO orders VALUES (101, 1, 'paid', NULL), (102, 2, 'draft', NULL);
INSERT INTO order_items VALUES (101, 'MUG', 1, 20), (101, 'TEA', 2, 8);`;
