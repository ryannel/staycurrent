export const condition = `o.status = 'paid'
  AND o.placed_at >= $1::timestamptz
  AND o.placed_at < $2::timestamptz
  AND ($3::integer IS NULL OR o.customer_id = $3)`;
export const baseline = `SELECT o.customer_id, SUM(v.order_value) AS line_value
FROM orders o
CROSS JOIN LATERAL (
  SELECT SUM(i.quantity * i.unit_price) AS order_value
  FROM order_items i
  WHERE i.order_id = o.order_id
  HAVING COUNT(*) > 0
) v
WHERE ${condition}
GROUP BY o.customer_id
ORDER BY line_value DESC, o.customer_id`;
export const repair = `SELECT o.customer_id, SUM(i.quantity * i.unit_price) AS line_value
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE ${condition}
GROUP BY o.customer_id
ORDER BY line_value DESC, o.customer_id`;
export const cases = [
 {name:'October',params:['2026-10-01 00:00+00','2026-11-01 00:00+00',null]},
 {name:'Full year',params:['2026-01-01 00:00+00','2027-01-01 00:00+00',null]},
 {name:'One day',params:['2026-10-12 00:00+00','2026-10-13 00:00+00',null]},
 {name:'Common customer',params:['2026-10-01 00:00+00','2026-11-01 00:00+00',1001]},
 {name:'Rare customer',params:['2026-10-01 00:00+00','2026-11-01 00:00+00',1002]}
];
