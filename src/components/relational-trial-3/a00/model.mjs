// Canonical shop rows: docs/coverage/relational-example.md.
import { customers, products } from '../example.mjs';
export { customers, products };
export const orders = [[101, 1, '2026-10-12 09:30+00', 'paid'], [102, 2, '2026-10-14 16:05+00', 'paid'], [103, 1, '2026-10-20 10:15+00', 'pending']];
export const items = [[101, 1, 'P3', 1, '4.50'], [101, 2, 'P9', 1, '35.00'], [102, 1, 'P7', 2, '20.00'], [103, 1, 'P7', 1, '20.00'], [103, 2, 'P3', 2, '4.50']];
export const payments = [[501, 101, '30.00', 'card'], [502, 101, '9.50', 'gift card'], [503, 102, '40.00', 'card']];
export const multiplied = items.filter(r => r[0] === 101).flatMap(i => payments.filter(p => p[1] === 101).map(p => [i[1], (i[3] * Number(i[4])).toFixed(2), p[0], p[2]]));
export const schema = `CREATE TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE products (product_id text PRIMARY KEY, name text NOT NULL,
 price numeric(8,2) NOT NULL CHECK (price >= 0), stock integer NOT NULL CHECK (stock >= 0));
CREATE TABLE orders (order_id integer PRIMARY KEY,
 customer_id integer NOT NULL REFERENCES customers, placed_at timestamptz NOT NULL,
 status text NOT NULL CHECK (status IN ('pending','paid','cancelled')));
CREATE TABLE order_items (order_id integer REFERENCES orders, line_no integer,
 product_id text NOT NULL REFERENCES products,
 quantity integer NOT NULL CHECK (quantity > 0), unit_price numeric(8,2) NOT NULL,
 PRIMARY KEY (order_id,line_no));
CREATE TABLE payments (payment_id integer PRIMARY KEY,
 order_id integer NOT NULL REFERENCES orders, amount numeric(8,2) NOT NULL CHECK (amount > 0), method text NOT NULL);`;
const literals = rows => rows.map(row => `(${row.map(v => typeof v === 'number' ? v : `'${v.replaceAll("'", "''")}'`).join(',')})`).join(',');
export const setup = `${schema}
INSERT INTO customers VALUES ${literals(customers)};
INSERT INTO products VALUES ${literals(products)};
INSERT INTO orders VALUES ${literals(orders.filter(r => r[0] !== 103))};
INSERT INTO order_items VALUES ${literals(items.filter(r => r[0] !== 103))};
INSERT INTO payments VALUES ${literals(payments)};`;
export const insert103 = `INSERT INTO orders VALUES (103,1,'2026-10-20 10:15+00','pending');
INSERT INTO order_items VALUES (103,1,'P7',1,20.00),(103,2,'P3',2,4.50);`;
export const summary = `SELECT o.order_id, c.name,
       SUM(i.quantity * i.unit_price) AS order_value
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
JOIN order_items AS i ON i.order_id = o.order_id
WHERE o.order_id = 103
GROUP BY o.order_id, c.name;`;
export const wrong = `SELECT SUM(i.quantity * i.unit_price) AS order_value,
       SUM(p.amount) AS paid
FROM order_items AS i
JOIN payments AS p ON p.order_id = i.order_id
WHERE i.order_id = 101;`;
export const correct = `SELECT l.order_value, p.paid
FROM (
  SELECT order_id, SUM(quantity * unit_price) AS order_value
  FROM order_items GROUP BY order_id
) AS l
JOIN (
  SELECT order_id, SUM(amount) AS paid
  FROM payments GROUP BY order_id
) AS p ON p.order_id = l.order_id
WHERE l.order_id = 101;`;
export const guarded = `UPDATE products SET stock = stock - 1
WHERE product_id = 'P7' AND stock >= 1 RETURNING stock;`;
export const reserve = `BEGIN;
UPDATE products SET stock = stock - 1
WHERE product_id = 'P7' AND stock >= 1 RETURNING stock;
-- Application: require one returned row, otherwise ROLLBACK.
UPDATE products SET stock = stock - 2
WHERE product_id = 'P3' AND stock >= 2 RETURNING stock;
-- Application: require one returned row, otherwise ROLLBACK.
INSERT INTO orders VALUES (103, 1, '2026-10-20 10:15+00', 'pending');
INSERT INTO order_items VALUES
  (103, 1, 'P7', 1, 20.00), (103, 2, 'P3', 2, 4.50);
COMMIT;
-- Application: ROLLBACK on any error; confirm only after COMMIT succeeds.`;
export const race = {
 stale: [
  ['One mug', 'Neither customer has an accepted new order.', 'Not started', 'Not started', 1, 'None'],
  ['Both read', 'Mina and Tariq each read stock 1 and calculate a new value of 0.', 'Read 1; calculate 0', 'Read 1; calculate 0', 1, 'None'],
  ['Mina writes', 'Mina writes her calculated 0 and prepares order 103. Tariq still holds his earlier decision.', 'Write 0; prepare 103', 'Earlier decision: write 0', 1, 'None'],
  ['Mina commits', 'Order 103 commits with its mug and tea. Tariq can now write his stale 0.', '103 accepted', 'Write 0; prepare 104', 0, '103'],
  ['Tariq commits', 'Order 104 commits too. Two new mug lines were accepted from one available mug; stock still says 0.', '103 accepted', '104 accepted', 0, '103 and 104 — oversold']
 ],
 guarded: [
  ['One mug', 'Neither customer has an accepted new order.', 'Not started', 'Not started', 1, 'None'],
  ['Mina claims', 'Mina conditionally subtracts one mug. Her uncommitted change keeps another updater waiting.', 'Claim 1; prepare 103', 'Not started', 1, 'None'],
  ['Tariq waits', 'Tariq attempts the same conditional change and waits for Mina’s transaction.', 'Claim held; prepare 103', 'Waiting to change P7', 1, 'None'],
  ['Mina commits', 'Order 103 commits with the mug and two teas. Tariq checks stock against the now-committed 0.', '103 accepted', 'Recheck: 0 is insufficient', 0, '103'],
  ['Tariq refuses', 'Tariq changes zero rows and rolls back. No order 104 is accepted.', '103 accepted', '104 refused; rolled back', 0, '103 only']
 ]
};
