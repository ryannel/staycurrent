// The shop from docs/coverage/relational-example.md, as every figure in the
// relational introduction (trial 2) uses it. Figures import these rows and
// outcomes; verify.mjs runs the same SQL on a disposable PostgreSQL 18.6 server
// and checks that the database agrees with every outcome the page states.

/** The five tables as Figure 2 draws them: key marks and what each foreign key refers to. */
export const schemaTables = [
  { name: 'customers', columns: [{ name: 'customer_id', key: 'PK' }, { name: 'name' }] },
  { name: 'orders', columns: [{ name: 'order_id', key: 'PK' }, { name: 'customer_id', key: 'FK', ref: 'customers' }, { name: 'placed_at' }, { name: 'status' }] },
  { name: 'payments', columns: [{ name: 'payment_id', key: 'PK' }, { name: 'order_id', key: 'FK', ref: 'orders' }, { name: 'amount' }, { name: 'method' }] },
  { name: 'order_items', columns: [{ name: 'order_id', key: 'PK, FK', ref: 'orders' }, { name: 'line_no', key: 'PK' }, { name: 'product_id', key: 'FK', ref: 'products' }, { name: 'quantity' }, { name: 'unit_price' }] },
  { name: 'products', columns: [{ name: 'product_id', key: 'PK' }, { name: 'name' }, { name: 'price' }, { name: 'stock' }] },
];

export const schema = `CREATE TABLE customers (
  customer_id integer PRIMARY KEY,
  name        text NOT NULL
);
CREATE TABLE products (
  product_id text PRIMARY KEY,
  name       text NOT NULL,
  price      numeric(8,2) NOT NULL CHECK (price >= 0),
  stock      integer NOT NULL CHECK (stock >= 0)
);
CREATE TABLE orders (
  order_id    integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers,
  placed_at   timestamptz NOT NULL,
  status      text NOT NULL
              CHECK (status IN ('pending', 'paid', 'cancelled'))
);
CREATE TABLE order_items (
  order_id   integer REFERENCES orders,
  line_no    integer,
  product_id text NOT NULL REFERENCES products,
  quantity   integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(8,2) NOT NULL,
  PRIMARY KEY (order_id, line_no)
);
CREATE TABLE payments (
  payment_id integer PRIMARY KEY,
  order_id   integer NOT NULL REFERENCES orders,
  amount     numeric(8,2) NOT NULL CHECK (amount > 0),
  method     text NOT NULL
);`;

export const customers = [
  { customer_id: 1, name: 'Mina Shah' },
  { customer_id: 2, name: 'Tariq Aziz' },
  { customer_id: 3, name: 'Edda Berg' },
];

/** Stock before order 103. */
export const productsBefore = [
  { product_id: 'P3', name: 'Green tea, 50 g', price: '4.50', stock: 12 },
  { product_id: 'P7', name: 'Blue mug', price: '20.00', stock: 1 },
  { product_id: 'P9', name: 'Teapot', price: '35.00', stock: 4 },
];

export const orders = [
  { order_id: 101, customer_id: 1, placed_at: '2026-10-12 09:30', status: 'paid' },
  { order_id: 102, customer_id: 2, placed_at: '2026-10-14 16:05', status: 'paid' },
  { order_id: 103, customer_id: 1, placed_at: '2026-10-20 10:15', status: 'pending' },
];

export const orderItems = [
  { order_id: 101, line_no: 1, product_id: 'P3', quantity: 1, unit_price: '4.50' },
  { order_id: 101, line_no: 2, product_id: 'P9', quantity: 1, unit_price: '35.00' },
  { order_id: 102, line_no: 1, product_id: 'P7', quantity: 2, unit_price: '20.00' },
  { order_id: 103, line_no: 1, product_id: 'P7', quantity: 1, unit_price: '20.00' },
  { order_id: 103, line_no: 2, product_id: 'P3', quantity: 2, unit_price: '4.50' },
];

export const payments = [
  { payment_id: 501, order_id: 101, amount: '30.00', method: 'card' },
  { payment_id: 502, order_id: 101, amount: '9.50', method: 'gift card' },
  { payment_id: 503, order_id: 102, amount: '40.00', method: 'card' },
];

/** Stock after order 103 commits. */
export const productsAfter = [
  { ...productsBefore[0], stock: 10 },
  { ...productsBefore[1], stock: 0 },
  { ...productsBefore[2] },
];

const lit = value => (typeof value === 'number' ? String(value) : `'${String(value).replace(/'/g, "''")}'`);
const insert = (table, rows, columns) =>
  `INSERT INTO ${table} (${columns.join(', ')}) VALUES\n` +
  rows.map(row => `  (${columns.map(column => (column === 'placed_at' ? `'${row[column]}+00'` : lit(row[column]))).join(', ')})`).join(',\n') + ';';

/** Everything except order 103: the state just before Mina places it. */
export const seedBefore103 = [
  "SET TIME ZONE 'UTC';",
  insert('customers', customers, ['customer_id', 'name']),
  insert('products', productsBefore, ['product_id', 'name', 'price', 'stock']),
  insert('orders', orders.filter(o => o.order_id !== 103), ['order_id', 'customer_id', 'placed_at', 'status']),
  insert('order_items', orderItems.filter(i => i.order_id !== 103), ['order_id', 'line_no', 'product_id', 'quantity', 'unit_price']),
  insert('payments', payments, ['payment_id', 'order_id', 'amount', 'method']),
].join('\n');

/** The five changes that make up Mina's order 103, in the order Figure 1 applies them. */
export const order103Changes = [
  { sql: "INSERT INTO orders VALUES (103, 1, '2026-10-20 10:15+00', 'pending');", short: 'Add order 103 for Mina' },
  { sql: "INSERT INTO order_items VALUES (103, 1, 'P7', 1, 20.00);", short: 'Add line 1: one blue mug' },
  { sql: "INSERT INTO order_items VALUES (103, 2, 'P3', 2, 4.50);", short: 'Add line 2: two green teas' },
  { sql: "UPDATE products SET stock = stock - 1 WHERE product_id = 'P7';", short: 'Take the mug out of stock' },
  { sql: "UPDATE products SET stock = stock - 2 WHERE product_id = 'P3';", short: 'Take two teas out of stock' },
];

/** Full state after order 103, used by Figures 2 and 3. */
export const seedAfter103 = seedBefore103 + '\n' + order103Changes.map(change => change.sql).join('\n');

// ---------------------------------------------------------------- Figure 1
// The state after each prefix of the five changes, and three questions
// answered from that stored state alone.

export function partialOrder(applied) {
  const n = Math.max(0, Math.min(order103Changes.length, applied));
  const has103 = n >= 1;
  const lines = orderItems.filter(i => i.order_id === 103).slice(0, Math.max(0, n - 1));
  const p7 = n >= 4 ? 0 : 1;
  const p3 = n >= 5 ? 10 : 12;
  const value = lines.reduce((sum, l) => sum + l.quantity * Number(l.unit_price), 0);
  const questions = [
    { question: 'Blue mugs the shop can still sell', answer: String(p7), right: has103 ? p7 === 0 : true },
    { question: 'Green teas in stock', answer: String(p3), right: n >= 3 ? p3 === 10 : true },
    { question: 'What Mina owes for order 103', answer: has103 ? value.toFixed(2) : 'no order 103', right: !has103 || value === 29 },
  ];
  return { applied: n, has103, lines, p7, p3, questions, consistent: questions.every(q => q.right) };
}

// ---------------------------------------------------------------- Figure 2
// Which rows a chosen order connects to through its keys.

export function relatedRows(orderId) {
  const order = orders.find(o => o.order_id === orderId);
  const items = orderItems.filter(i => i.order_id === orderId);
  return {
    order,
    customer: customers.find(c => c.customer_id === order.customer_id),
    items,
    products: [...new Set(items.map(i => i.product_id))],
    payments: payments.filter(p => p.order_id === orderId),
  };
}

export const joinQuery = `SELECT o.order_id, c.name, i.line_no, p.name AS product, i.quantity
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
JOIN order_items AS i ON i.order_id = o.order_id
JOIN products AS p ON p.product_id = i.product_id
WHERE o.order_id = 103
ORDER BY i.line_no;`;

export const joinResult = [
  { order_id: 103, name: 'Mina Shah', line_no: 1, product: 'Blue mug', quantity: 1 },
  { order_id: 103, name: 'Mina Shah', line_no: 2, product: 'Green tea, 50 g', quantity: 2 },
];

/** Changes the schema refuses, with the SQLSTATE PostgreSQL returned. */
export const rejected = [
  { sql: "INSERT INTO order_items VALUES (103, 3, 'P9', 0, 35.00);", code: '23514', constraint: 'order_items_quantity_check', why: 'a quantity of zero' },
  { sql: "INSERT INTO orders VALUES (104, 9, '2026-10-20 10:16+00', 'pending');", code: '23503', constraint: 'orders_customer_id_fkey', why: 'customer 9 does not exist' },
  { sql: "INSERT INTO orders VALUES (103, 2, '2026-10-20 10:16+00', 'pending');", code: '23505', constraint: 'orders_pkey', why: 'order 103 already exists' },
  { sql: "UPDATE products SET stock = stock - 1 WHERE product_id = 'P7';", code: '23514', constraint: 'products_stock_check', why: 'the mug’s stock would fall below zero' },
];

// ---------------------------------------------------------------- Figure 3
// What is still due on each order: two plausible queries.

export const dueWrong = `SELECT o.order_id,
       sum(i.quantity * i.unit_price) AS value,
       sum(p.amount) AS paid,
       sum(i.quantity * i.unit_price) - sum(p.amount) AS due
FROM orders AS o
JOIN order_items AS i ON i.order_id = o.order_id
JOIN payments AS p ON p.order_id = o.order_id
GROUP BY o.order_id
ORDER BY o.order_id;`;

export const dueRight = `WITH value AS (
  SELECT order_id, sum(quantity * unit_price) AS value
  FROM order_items GROUP BY order_id
), paid AS (
  SELECT order_id, sum(amount) AS paid
  FROM payments GROUP BY order_id
)
SELECT o.order_id,
       coalesce(v.value, 0.00) AS value,
       coalesce(p.paid, 0.00) AS paid,
       coalesce(v.value, 0.00) - coalesce(p.paid, 0.00) AS due
FROM orders AS o
LEFT JOIN value AS v ON v.order_id = o.order_id
LEFT JOIN paid AS p ON p.order_id = o.order_id
ORDER BY o.order_id;`;

export const dueWrongResult = [
  { order_id: 101, value: '79.00', paid: '79.00', due: '0.00' },
  { order_id: 102, value: '40.00', paid: '40.00', due: '0.00' },
];
export const dueRightResult = [
  { order_id: 101, value: '39.50', paid: '39.50', due: '0.00' },
  { order_id: 102, value: '40.00', paid: '40.00', due: '0.00' },
  { order_id: 103, value: '29.00', paid: '0.00', due: '29.00' },
];

/** The joined rows the wrong query sums, before grouping: each line paired with each payment. */
export function joinedPairs() {
  const pairs = [];
  for (const o of orders) {
    for (const i of orderItems.filter(x => x.order_id === o.order_id)) {
      for (const p of payments.filter(x => x.order_id === o.order_id)) {
        pairs.push({ order_id: o.order_id, line_no: i.line_no, line_value: (i.quantity * Number(i.unit_price)).toFixed(2), payment_id: p.payment_id, amount: p.amount });
      }
    }
  }
  return pairs;
}

export const wrongChange = `BEGIN;
UPDATE orders SET status = 'cancelled'
WHERE customer_id = 1
RETURNING order_id, status;
ROLLBACK;`;
export const rightChange = `BEGIN;
UPDATE orders SET status = 'cancelled'
WHERE order_id = 103 AND status = 'pending'
RETURNING order_id, status;
-- 1 row: 103 | cancelled. Inspect it, then COMMIT or ROLLBACK.`;
export const wrongChangeResult = [
  { order_id: 101, status: 'cancelled' },
  { order_id: 103, status: 'cancelled' },
];

// ---------------------------------------------------------------- Figure 4
// The race for the last blue mug. Each protocol is a schedule of statements
// for Mina (order 103) and Tariq (order 104), starting from stock 1.

const mina103 = [
  "INSERT INTO orders VALUES (103, 1, '2026-10-20 10:15+00', 'pending');",
  "INSERT INTO order_items VALUES (103, 1, 'P7', 1, 20.00), (103, 2, 'P3', 2, 4.50);",
  "UPDATE products SET stock = stock - 2 WHERE product_id = 'P3';",
];
const tariq104 = [
  "INSERT INTO orders VALUES (104, 2, '2026-10-20 10:15+00', 'pending');",
  "INSERT INTO order_items VALUES (104, 1, 'P7', 1, 20.00);",
];

export const raceProtocols = {
  read: {
    label: 'Read, then write',
    begin: 'BEGIN;',
    read: "SELECT stock FROM products WHERE product_id = 'P7';",
    write: "UPDATE products SET stock = 0 WHERE product_id = 'P7';",
  },
  conditional: {
    label: 'Conditional update',
    begin: 'BEGIN;',
    write: "UPDATE products SET stock = stock - 1\nWHERE product_id = 'P7' AND stock >= 1;",
  },
  // Not drawn in Figure 4: the prose says in one sentence that this level
  // refuses Tariq's write, and verify.mjs checks that it does.
  repeatable: {
    label: 'Repeatable Read',
    begin: 'BEGIN ISOLATION LEVEL REPEATABLE READ;',
    read: "SELECT stock FROM products WHERE product_id = 'P7';",
    write: "UPDATE products SET stock = 0 WHERE product_id = 'P7';",
  },
};
export const raceOrderSql = { mina: mina103, tariq: tariq104 };

/** What each protocol leaves behind, as verify.mjs observed it. */
export const raceOutcome = {
  read: { p7: 0, ordersHoldingMug: [103, 104], tariq: 'committed', mugsSold: 2 },
  readAutocommit: { p7: 0, ordersHoldingMug: [103, 104], tariq: 'committed', mugsSold: 2 },
  conditional: { p7: 0, ordersHoldingMug: [103], tariq: 'UPDATE 0, rolled back', mugsSold: 1 },
  repeatable: { p7: 0, ordersHoldingMug: [103], tariq: 'serialization failure (40001), rolled back; retry reads 0', mugsSold: 1 },
};

// ---------------------------------------------------------------- Figure 5
// A lost reply. Where the connection breaks decides what the database holds;
// the application sees the same error in the last two cases.

export const breakPoints = {
  replied: { label: 'The reply arrives', committed: true, appSees: 'COMMIT' },
  beforeCommit: { label: 'Connection breaks before COMMIT', committed: false, appSees: 'a broken connection' },
  afterCommit: { label: 'Connection breaks after COMMIT', committed: true, appSees: 'a broken connection' },
};

/**
 * Mina's whole order as one transaction. The application chose the number 103
 * before sending anything, and the insert of order 103 comes first: a repeat
 * after a lost reply then meets any attempt still in flight at order 103's
 * primary key, rather than at the mug's stock.
 */
export const placeOrder103 = [
  'BEGIN;',
  "INSERT INTO orders VALUES (103, 1, '2026-10-20 10:15+00', 'pending');",
  "UPDATE products SET stock = stock - 1\n  WHERE product_id = 'P7' AND stock >= 1;",
  "UPDATE products SET stock = stock - 2\n  WHERE product_id = 'P3' AND stock >= 2;",
  "INSERT INTO order_items VALUES\n  (103, 1, 'P7', 1, 20.00), (103, 2, 'P3', 2, 4.50);",
  'COMMIT;',
];
/** The listing printed in the article: the same statements, with the application's check. */
export const placeOrderListing = [
  ...placeOrder103.slice(0, 4),
  '-- If either UPDATE changes 0 rows: ROLLBACK, "sold out".',
  ...placeOrder103.slice(4),
].join('\n');
/** The same order with the stock claimed before the order row: what a repeat must not do. */
export const placeOrderClaimFirst = [placeOrder103[0], placeOrder103[2], placeOrder103[3], placeOrder103[1], placeOrder103[4], placeOrder103[5]];
export const lookup103 = "SELECT order_id, status FROM orders WHERE order_id = 103;";

// ---------------------------------------------------------------- Section 6
// A scaled copy of the shop for counting physical work: the core rows plus
// generated customers 1001-21000 and orders 1001-200000 with one line each.

export const scaledGenerator = `INSERT INTO customers
SELECT g, 'Customer ' || g FROM generate_series(1001, 21000) AS g;
INSERT INTO orders
SELECT g, 1001 + (g * 7919) % 20000,
       timestamptz '2026-01-01 00:00+00' + (g * interval '1 minute'),
       'paid'
FROM generate_series(1001, 200000) AS g;
INSERT INTO order_items
SELECT g, 1, (ARRAY['P3','P7','P9'])[1 + g % 3], 1 + g % 2,
       (ARRAY[4.50, 20.00, 35.00])[1 + g % 3]
FROM generate_series(1001, 200000) AS g;
VACUUM ANALYZE;`;

export const minaLookup = `SELECT order_id, placed_at, status
FROM orders
WHERE customer_id = 1
ORDER BY placed_at;`;
export const productReport = `SELECT product_id, sum(quantity) AS sold
FROM order_items
GROUP BY product_id
ORDER BY product_id;`;
export const lookupIndex = 'CREATE INDEX orders_customer_idx ON orders (customer_id);';

/**
 * The two plans as the article prints them: EXPLAIN (ANALYZE, BUFFERS) output
 * with costs, widths, memory, the sort's buffer line and the planning summary
 * left out, the planner's row estimate labelled, and long lines wrapped.
 * verify.mjs checks every line against the real output.
 */
export const planBefore = `Sort (estimated rows=10) (actual rows=2.00 loops=1)
  Sort Key: placed_at
  ->  Seq Scan on orders (estimated rows=10) (actual rows=2.00 loops=1)
        Filter: (customer_id = 1)
        Rows Removed by Filter: 199001
        Buffers: shared hit=1268`;
export const planAfter = `Sort (estimated rows=10) (actual rows=2.00 loops=1)
  Sort Key: placed_at
  ->  Bitmap Heap Scan on orders
        (estimated rows=10) (actual rows=2.00 loops=1)
        Recheck Cond: (customer_id = 1)
        Buffers: shared hit=3
        ->  Bitmap Index Scan on orders_customer_idx
              (estimated rows=10) (actual rows=2.00 loops=1)
              Index Cond: (customer_id = 1)
              Buffers: shared hit=2`;

// ---------------------------------------------------------------- Section 7
export const liveChange = {
  oneStep: 'ALTER TABLE orders ADD COLUMN delivery_country text NOT NULL;',
  expand: 'ALTER TABLE orders ADD COLUMN delivery_country text;',
  oldInsert: "INSERT INTO orders (order_id, customer_id, placed_at, status)\nVALUES (105, 3, '2026-10-21 08:00+00', 'pending');",
  backfill: "UPDATE orders SET delivery_country = 'GB'\nWHERE delivery_country IS NULL;",
  contract: 'ALTER TABLE orders ALTER COLUMN delivery_country SET NOT NULL;',
  stepBack: 'ALTER TABLE orders ALTER COLUMN delivery_country DROP NOT NULL;',
};

// ---------------------------------------------------------------- Figure 6
// Three failures, three recovery mechanisms. Order 101 is deleted by mistake
// at 10:10 on 20 October; order 103 is placed at 10:15.

export const failures = {
  crash: {
    label: 'Server process crashes',
    happened: 'The database server process stops at 10:20. Its disks are intact.',
  },
  lost: {
    label: 'Database machine is lost',
    happened: 'The machine running the database, and its disk, are gone at 10:20.',
  },
  deletion: {
    label: 'Order 101 deleted by mistake',
    happened: 'At 10:10 a clean-up script commits DELETE for paid order 101. Order 103 is placed at 10:15. A restore would stop at 10:09, just before the delete.',
  },
};

export const mechanisms = {
  replay: { label: 'Crash recovery', how: 'Restart and replay the write-ahead log on the same disks.' },
  promote: { label: 'Promote a replica', how: 'Make a standby copy on another machine the new writer.' },
  restore: { label: 'Restore an earlier state', how: 'Rebuild a separate copy from a backup and the archived log, stopped at an earlier point.' },
};

/** For each failure and mechanism: what comes back, and whether it is the right tool. */
export const recoveryMatrix = {
  crash: {
    replay: { order101: 'present', order103: 'present', verdict: 'fits', note: 'Every committed change returns, including order 103. This is what the log is for.' },
    promote: { order101: 'present', order103: 'replica', verdict: 'possible', note: 'Keeps order 103 only if the replica had received it, and is unnecessary when the disks survive.' },
    restore: { order101: 'present', order103: 'lost', verdict: 'wrong', note: 'Stopped at an earlier point, such as 10:09, it loses good work since then, including order 103. Far more than this failure needs.' },
  },
  lost: {
    replay: { order101: 'gone', order103: 'gone', verdict: 'wrong', note: 'There is nothing to restart: the log was on the lost disk.' },
    promote: { order101: 'present', order103: 'replica', verdict: 'fits', note: 'Order 103 survives only if its commit waited for the replica, or the replica had already received it.' },
    restore: { order101: 'present', order103: 'archived', verdict: 'possible', note: 'Needs the backup and archived log to be stored elsewhere. Slower, and it loses whatever log had not yet been archived.' },
  },
  deletion: {
    replay: { order101: 'gone', order103: 'present', verdict: 'wrong', note: 'Recovery replays the committed DELETE faithfully. The mistake is a committed change.' },
    promote: { order101: 'gone', order103: 'present', verdict: 'wrong', note: 'The replica applied the same DELETE moments after the writer did.' },
    restore: { order101: 'present', order103: 'lost', verdict: 'fits', note: 'In a separate copy: order 101 returns, but order 103 is missing there and must be carried across from the live database.' },
  },
};
