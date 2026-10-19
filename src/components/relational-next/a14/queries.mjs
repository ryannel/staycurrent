export const setup = `CREATE TEMP TABLE customers (
  customer_id integer PRIMARY KEY,
  name text NOT NULL
);
CREATE TEMP TABLE orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers,
  placed_on date NOT NULL,
  status text NOT NULL CHECK (status IN ('paid', 'unpaid'))
);
CREATE TEMP TABLE order_lines (
  order_id integer REFERENCES orders,
  line_no integer,
  amount numeric(10,2),
  PRIMARY KEY (order_id, line_no)
);
CREATE TEMP TABLE payments (
  payment_id integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers,
  paid_on date NOT NULL,
  amount numeric(10,2) NOT NULL
);
INSERT INTO customers VALUES
  (1, 'Mina'), (2, 'Tariq'), (3, 'Mina'), (4, 'Edda'), (5, 'Sol');
INSERT INTO orders VALUES
  (101, 1, '2026-01-10', 'paid'),
  (102, 1, '2026-01-20', 'unpaid'),
  (103, 2, '2025-12-20', 'paid'),
  (104, 3, '2026-01-15', 'paid'),
  (105, 5, '2026-01-18', 'paid');
INSERT INTO order_lines VALUES
  (101, 1, 20), (101, 2, 10), (102, 1, 20),
  (103, 1, 90), (104, 1, 40), (105, 1, NULL);
INSERT INTO payments VALUES
  (201, 1, '2026-01-12', 15), (202, 1, '2026-01-13', 15),
  (203, 3, '2026-01-16', 10), (204, 5, '2026-01-19', 5),
  (205, 2, '2025-12-21', 90);`;

export const period = `o.placed_on >= DATE '2026-01-01'
  AND o.placed_on < DATE '2026-02-01'`;
export const paymentPeriod = `p.paid_on >= DATE '2026-01-01'
  AND p.paid_on < DATE '2026-02-01'`;
export const orderValues = `SELECT o.order_id, o.customer_id, o.status,
       CASE WHEN COUNT(l.line_no) = 0
                  OR COUNT(l.amount) <> COUNT(l.line_no)
            THEN NULL ELSE SUM(l.amount) END AS order_value
FROM orders AS o
LEFT JOIN order_lines AS l ON l.order_id = o.order_id
WHERE ${period}
GROUP BY o.order_id, o.customer_id, o.status`;
export const orderTotals = `SELECT customer_id, COUNT(*) AS order_count,
       CASE WHEN COUNT(order_value) = COUNT(*)
            THEN SUM(order_value) END AS order_value
FROM order_values
GROUP BY customer_id`;
export const paymentTotals = `SELECT p.customer_id, SUM(p.amount) AS payment_value
FROM payments AS p
WHERE ${paymentPeriod}
GROUP BY p.customer_id`;
export const stages = `WITH order_values AS (
${orderValues.split('\n').map(s => '  '+s).join('\n')}
), order_totals AS (
${orderTotals.split('\n').map(s => '  '+s).join('\n')}
), payment_totals AS (
${paymentTotals.split('\n').map(s => '  '+s).join('\n')}
)`;
export const finalSelect = `SELECT c.customer_id, c.name,
       COALESCE(o.order_count, 0) AS order_count,
       CASE WHEN o.customer_id IS NULL THEN 0
            ELSE o.order_value END AS order_value,
       COALESCE(p.payment_value, 0) AS payment_value
FROM customers AS c
LEFT JOIN order_totals AS o ON o.customer_id = c.customer_id
LEFT JOIN payment_totals AS p ON p.customer_id = c.customer_id
ORDER BY c.customer_id`;
export const queries = {
  pairs: `SELECT c.customer_id, c.name, o.order_id
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.customer_id
WHERE ${period}
ORDER BY c.customer_id, o.order_id;`,
  presence: `SELECT c.customer_id, c.name
FROM customers AS c
WHERE EXISTS (
  SELECT 1 FROM orders AS o
  WHERE o.customer_id = c.customer_id AND ${period}
)
ORDER BY c.customer_id;`,
  outerOn: `SELECT c.customer_id, o.order_id
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.customer_id
  AND ${period}
ORDER BY c.customer_id, o.order_id;`,
  outerWhere: `SELECT c.customer_id, o.order_id
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.customer_id
WHERE ${period}
ORDER BY c.customer_id, o.order_id;`,
  groups: `SELECT c.customer_id, c.name, COUNT(o.order_id) AS order_count
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.customer_id AND ${period}
GROUP BY c.customer_id, c.name
HAVING COUNT(o.order_id) >= 2
ORDER BY c.customer_id;`,
  counts: `SELECT c.customer_id,
       COUNT(*) AS joined_rows,
       COUNT(l.line_no) AS lines,
       COUNT(l.amount) AS known_amounts,
       COUNT(DISTINCT l.amount) AS different_amounts
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.customer_id AND ${period}
LEFT JOIN order_lines AS l ON l.order_id = o.order_id
GROUP BY c.customer_id
ORDER BY c.customer_id;`,
  conditional: `WITH order_values AS (
${orderValues.split('\n').map(s => '  '+s).join('\n')}
)
SELECT customer_id,
       CASE WHEN COUNT(CASE WHEN status = 'paid' THEN 1 END)
                   = COUNT(CASE WHEN status = 'paid' THEN order_value END)
            THEN SUM(CASE WHEN status = 'paid' THEN order_value ELSE 0 END)
       END AS paid_value,
       CASE WHEN COUNT(CASE WHEN status = 'unpaid' THEN 1 END)
                   = COUNT(CASE WHEN status = 'unpaid' THEN order_value END)
            THEN SUM(CASE WHEN status = 'unpaid' THEN order_value ELSE 0 END)
       END AS unpaid_value
FROM order_values
GROUP BY customer_id
ORDER BY customer_id;`,
  wrong: `WITH order_values AS (
${orderValues.split('\n').map(s => '  '+s).join('\n')}
)
SELECT c.customer_id,
       SUM(o.order_value) AS order_value,
       SUM(p.amount) AS payment_value
FROM customers AS c
LEFT JOIN order_values AS o ON o.customer_id = c.customer_id
LEFT JOIN payments AS p
  ON p.customer_id = c.customer_id AND ${paymentPeriod}
GROUP BY c.customer_id
ORDER BY c.customer_id;`,
  report: `${stages}\n${finalSelect};`,
  empty: `SELECT COUNT(*) AS n, SUM(amount) AS total
FROM payments WHERE paid_on < DATE '1900-01-01';`,
  noGroups: `SELECT customer_id, COUNT(*) AS n
FROM payments WHERE paid_on < DATE '1900-01-01'
GROUP BY customer_id;`,
  self: `WITH employees(employee_id, name, manager_id) AS (
  VALUES (1, 'Mina', NULL::integer), (2, 'Tariq', 1)
)
SELECT e.name AS employee, m.name AS manager
FROM employees AS e
LEFT JOIN employees AS m ON m.employee_id = e.manager_id
ORDER BY e.employee_id;`,
  composite: `WITH source_orders(tenant_id, order_no) AS (
  VALUES (1, 7), (2, 7)
), source_lines(tenant_id, order_no, line_no) AS (
  VALUES (1, 7, 1), (2, 7, 1)
)
SELECT o.tenant_id, o.order_no, l.tenant_id AS line_tenant
FROM source_orders AS o
JOIN source_lines AS l
  ON l.tenant_id = o.tenant_id AND l.order_no = o.order_no
ORDER BY o.tenant_id;`
};

export const expectedReport = [
  {customer_id:1,name:'Mina',order_count:2,order_value:'50.00',payment_value:'30.00'},
  {customer_id:2,name:'Tariq',order_count:0,order_value:'0',payment_value:'0'},
  {customer_id:3,name:'Mina',order_count:1,order_value:'40.00',payment_value:'10.00'},
  {customer_id:4,name:'Edda',order_count:0,order_value:'0',payment_value:'0'},
  {customer_id:5,name:'Sol',order_count:1,order_value:null,payment_value:'5.00'}
];
