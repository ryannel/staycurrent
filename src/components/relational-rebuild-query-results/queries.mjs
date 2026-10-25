export const customerJoin = `SELECT o.order_id, c.name
FROM orders AS o
INNER JOIN customers AS c
  ON c.customer_id = o.customer_id
ORDER BY o.order_id;`;
export const lineJoin = `SELECT o.order_id, i.line_no, i.product_id,
       i.quantity, i.unit_price
FROM orders AS o
INNER JOIN order_items AS i
  ON i.order_id = o.order_id
ORDER BY o.order_id, i.line_no;`;
export const leftJoin = `SELECT o.order_id, p.payment_id, p.amount, p.method
FROM orders AS o
LEFT JOIN payments AS p
  ON p.order_id = o.order_id
ORDER BY o.order_id, p.payment_id;`;
export const onCard = leftJoin.replace('ON p.order_id = o.order_id','ON p.order_id = o.order_id\n AND p.method = \'card\'');
export const whereCard = leftJoin.replace('ORDER BY',"WHERE p.method = 'card'\nORDER BY");
export const existsOrders = `SELECT c.customer_id, c.name
FROM customers AS c
WHERE EXISTS (
  SELECT 1 FROM orders AS o
  WHERE o.customer_id = c.customer_id
)
ORDER BY c.customer_id;`;
export const noOrders = existsOrders.replace('WHERE EXISTS','WHERE NOT EXISTS');
export const noPayments = `SELECT o.order_id
FROM orders AS o
WHERE NOT EXISTS (
  SELECT 1 FROM payments AS p
  WHERE p.order_id = o.order_id
)
ORDER BY o.order_id;`;
export const rawJoin = `SELECT o.order_id, i.line_no, p.payment_id,
       i.quantity * i.unit_price AS line_value,
       p.amount
FROM orders AS o
INNER JOIN order_items AS i ON i.order_id = o.order_id
INNER JOIN payments AS p ON p.order_id = o.order_id
WHERE o.order_id = 101
ORDER BY i.line_no, p.payment_id;`;
export const badTotals = `SELECT o.order_id,
       SUM(i.quantity * i.unit_price) AS line_total,
       SUM(p.amount) AS paid_total
FROM orders AS o
INNER JOIN order_items AS i ON i.order_id = o.order_id
LEFT JOIN payments AS p ON p.order_id = o.order_id
GROUP BY o.order_id
ORDER BY o.order_id;`;
export const lineTotals = `SELECT order_id,
       SUM(quantity * unit_price) AS line_total
FROM order_items
GROUP BY order_id
ORDER BY order_id;`;
export const report = `WITH line_totals AS (
  SELECT order_id,
         SUM(quantity * unit_price) AS line_total
  FROM order_items
  GROUP BY order_id
), payment_totals AS (
  SELECT order_id, SUM(amount) AS paid_total
  FROM payments
  GROUP BY order_id
), balances AS (
  SELECT o.order_id,
         COALESCE(l.line_total, 0) AS line_total,
         COALESCE(p.paid_total, 0) AS paid_total,
         COALESCE(l.line_total, 0)
           - COALESCE(p.paid_total, 0) AS due
  FROM orders AS o
  LEFT JOIN line_totals AS l ON l.order_id = o.order_id
  LEFT JOIN payment_totals AS p ON p.order_id = o.order_id
)
SELECT order_id, line_total, paid_total, due
FROM balances
WHERE due > 0
ORDER BY order_id;`;
export const allBalances = report.replace('WHERE due > 0\n','');
export const unionAll = `SELECT customer_id FROM orders WHERE status = 'paid'
UNION ALL
SELECT customer_id FROM orders WHERE status = 'pending'
ORDER BY customer_id;`;
export const union = unionAll.replace('UNION ALL','UNION');
export const intersect = unionAll.replace('UNION ALL','INTERSECT');
export const except = unionAll.replace('UNION ALL','EXCEPT');
