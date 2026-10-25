import fs from 'node:fs';
import {customers,orders,items,payments} from '../src/components/relational-rebuild-query-results/model.mjs';
import * as queries from '../src/components/relational-rebuild-query-results/queries.mjs';
const quote = s => `'${s.replaceAll("'","''")}'`;
const setup = `-- PostgreSQL 18. Temporary shop tables for this session only.
-- Changes, including the scenario changes, are rolled back at the end.
BEGIN;
CREATE TEMP TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TEMP TABLE products (product_id text PRIMARY KEY, name text NOT NULL,
 price numeric(8,2) NOT NULL CHECK (price >= 0), stock integer NOT NULL CHECK (stock >= 0));
CREATE TEMP TABLE orders (order_id integer PRIMARY KEY,
 customer_id integer NOT NULL REFERENCES customers,
 placed_at timestamptz NOT NULL,
 status text NOT NULL CHECK (status IN ('pending','paid','cancelled')));
CREATE TEMP TABLE order_items (order_id integer REFERENCES orders, line_no integer,
 product_id text NOT NULL REFERENCES products,
 quantity integer NOT NULL CHECK (quantity > 0), unit_price numeric(8,2) NOT NULL,
 PRIMARY KEY (order_id,line_no));
CREATE TEMP TABLE payments (payment_id integer PRIMARY KEY,
 order_id integer NOT NULL REFERENCES orders,
 amount numeric(8,2) NOT NULL CHECK (amount > 0), method text NOT NULL);
INSERT INTO customers VALUES ${customers.map(c => `(${c.id},${quote(c.name)})`).join(',')};
INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
INSERT INTO orders VALUES ${orders.map((o,n) => `(${o.id},${o.customer},'${['2026-10-12 09:30+00','2026-10-14 16:05+00','2026-10-20 10:15+00'][n]}',${quote(o.status)})`).join(',')};
INSERT INTO order_items VALUES ${items.map(i => `(${i.order},${i.line},${quote(i.product)},${i.quantity},${(i.price/100).toFixed(2)})`).join(',')};
INSERT INTO payments VALUES ${payments.map(p => `(${p.id},${p.order},${(p.amount/100).toFixed(2)},${quote(p.method)})`).join(',')};
`;
let output = setup;
for (const [name,sql] of Object.entries(queries)) output += `\n-- ${name}\n${sql}\n`;
output += `
-- Equal-valued lines scenario: the two occurrences still total 40.00.
SAVEPOINT equal_lines;
UPDATE order_items SET quantity = 1 WHERE order_id = 102 AND line_no = 1;
INSERT INTO order_items VALUES (102,2,'P7',1,20.00);
SELECT order_id, SUM(quantity * unit_price) AS correct_total,
 SUM(DISTINCT quantity * unit_price) AS wrong_distinct_total
FROM order_items WHERE order_id = 102 GROUP BY order_id;
ROLLBACK TO equal_lines;
-- Partial payment scenario: noPayments now returns no rows; report returns 19.00 due.
SAVEPOINT partial_payment;
INSERT INTO payments VALUES (504,103,10.00,'card');
${queries.noPayments}
${queries.report}
ROLLBACK TO partial_payment;
ROLLBACK;
`;
fs.writeFileSync('public/relational-rebuild/query-results/shop-queries.sql', output);
fs.writeFileSync('evidence/setup.sql',setup);
