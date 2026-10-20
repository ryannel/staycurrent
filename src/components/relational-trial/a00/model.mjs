// The shop that every figure, table and listing in "Relational databases" uses.
// Figures import their rows and outcomes from here, and verify.mjs checks the
// observed ones against a disposable PostgreSQL 18.6 server, so they cannot drift.

export const customers = [
  { customer_id: 1, name: 'Mina Shah' },
  { customer_id: 2, name: 'Tariq Aziz' },
  { customer_id: 3, name: 'Edda Berg' },
];

// Stock before Mina's order 103. Order 103 takes the last mug and two packets of tea.
export const productsBefore = [
  { product_id: 'P3', name: 'Green tea, 50 g', price: '4.50', stock: 12 },
  { product_id: 'P7', name: 'Blue mug', price: '20.00', stock: 1 },
  { product_id: 'P9', name: 'Teapot', price: '35.00', stock: 4 },
];

export const ordersBefore = [
  { order_id: 101, customer_id: 1, placed_at: '2026-10-12 09:30', status: 'paid' },
  { order_id: 102, customer_id: 2, placed_at: '2026-10-14 16:05', status: 'paid' },
];

export const itemsBefore = [
  { order_id: 101, line_no: 1, product_id: 'P3', quantity: 1, unit_price: '4.50' },
  { order_id: 101, line_no: 2, product_id: 'P9', quantity: 1, unit_price: '35.00' },
  { order_id: 102, line_no: 1, product_id: 'P7', quantity: 2, unit_price: '20.00' },
];

export const payments = [
  { payment_id: 501, order_id: 101, amount: '30.00', method: 'card' },
  { payment_id: 502, order_id: 101, amount: '9.50', method: 'gift card' },
  { payment_id: 503, order_id: 102, amount: '40.00', method: 'card' },
];

// Mina's order 103: one blue mug and two packets of tea, not yet paid.
export const order103 = { order_id: 103, customer_id: 1, placed_at: '2026-10-20 10:15', status: 'pending' };
export const items103 = [
  { order_id: 103, line_no: 1, product_id: 'P7', quantity: 1, unit_price: '20.00' },
  { order_id: 103, line_no: 2, product_id: 'P3', quantity: 2, unit_price: '4.50' },
];

// The database once order 103 has committed: the state Figures 1 and 2 show.
export const products = productsBefore.map(p => ({
  ...p,
  stock: p.stock - items103.filter(i => i.product_id === p.product_id).reduce((n, i) => n + i.quantity, 0),
}));
export const orders = [...ordersBefore, order103];
export const items = [...itemsBefore, ...items103];

const lit = v => (typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const insert = (table, rows) => `INSERT INTO ${table} (${Object.keys(rows[0]).join(', ')}) VALUES\n${rows
  .map(r => `  (${Object.values(r).map(lit).join(', ')})`).join(',\n')};`;

export const schemaSql = `CREATE TABLE customers (
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
  status      text NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled'))
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

const utc = rows => rows.map(r => (r.placed_at ? { ...r, placed_at: `${r.placed_at}+00` } : r));

/** The shop before order 103 (for the race) or after it (for Figures 1 and 2). */
export const fixtureSql = ({ with103 }) => [
  'SET TIME ZONE \'UTC\';',
  'DROP TABLE IF EXISTS payments, order_items, orders, products, customers;',
  schemaSql,
  insert('customers', customers),
  insert('products', with103 ? products : productsBefore),
  insert('orders', utc(with103 ? orders : ordersBefore)),
  insert('order_items', with103 ? items : itemsBefore),
  insert('payments', payments),
].join('\n');

// Section 2: a join puts the separately stored facts back together.
export const receiptSql = `SELECT o.order_id, c.name AS customer, i.line_no,
       p.name AS product, i.quantity, i.unit_price
FROM order_items AS i
JOIN orders    AS o ON o.order_id = i.order_id
JOIN customers AS c ON c.customer_id = o.customer_id
JOIN products  AS p ON p.product_id = i.product_id
WHERE o.order_id = 103
ORDER BY i.line_no;`;
export const receiptRows = [
  ['103', 'Mina Shah', '1', 'Blue mug', '1', '20.00'],
  ['103', 'Mina Shah', '2', 'Green tea, 50 g', '2', '4.50'],
];

// Section 2: changes the declared rules refuse, and one they cannot know about.
export const rejections = [
  { sql: "INSERT INTO order_items VALUES (103, 3, 'P5', 1, 8.00);", sqlstate: '23503', what: 'An item for product P5, which does not exist', rule: 'Foreign key to products' },
  { sql: "INSERT INTO order_items VALUES (103, 1, 'P9', 1, 35.00);", sqlstate: '23505', what: 'A second line 1 on order 103', rule: 'Primary key (order_id, line_no)' },
  { sql: "INSERT INTO order_items VALUES (103, 3, 'P9', 0, 35.00);", sqlstate: '23514', what: 'A quantity of zero', rule: 'CHECK (quantity > 0)' },
  { sql: "UPDATE products SET stock = -1 WHERE product_id = 'P7';", sqlstate: '23514', what: 'Negative stock for the blue mug', rule: 'CHECK (stock >= 0)' },
  { sql: 'DELETE FROM customers WHERE customer_id = 1;', sqlstate: '23503', what: 'Deleting Mina while her orders refer to her', rule: 'Foreign key from orders' },
  { sql: "UPDATE order_items SET quantity = 5 WHERE order_id = 101 AND line_no = 2;", sqlstate: null, what: 'Changing the items of paid order 101', rule: 'None declared: accepted' },
];

// Section 3: a first selection, and a change that succeeds while doing the wrong thing.
export const selectSql = `SELECT order_id, placed_at, status
FROM orders
WHERE customer_id = 1
ORDER BY placed_at;`;
export const selectRows = [
  ['101', '2026-10-12 09:30:00+00', 'paid'],
  ['103', '2026-10-20 10:15:00+00', 'pending'],
];
export const broadUpdateSql = `UPDATE orders SET status = 'cancelled'
WHERE customer_id = 1;`;
export const broadUpdateResult = 'UPDATE 2';
export const narrowUpdateSql = `UPDATE orders SET status = 'cancelled'
WHERE order_id = 103 AND status = 'pending';`;
export const narrowUpdateResult = 'UPDATE 1';

// Section 3, Figure 2: one question, three queries. Values are as PostgreSQL returned them.
export const summaryQuestion = 'For each order: its value, what has been paid and what is still due.';
export const expectedSummary = [
  ['101', '39.50', '39.50', '0.00'],
  ['102', '40.00', '40.00', '0.00'],
  ['103', '29.00', '0.00', '29.00'],
];
export const summaryQueries = [
  {
    key: 'joined',
    label: 'Join items and payments, then sum',
    sql: `SELECT o.order_id,
       sum(i.quantity * i.unit_price) AS value,
       sum(pay.amount) AS paid,
       sum(i.quantity * i.unit_price) - sum(pay.amount) AS due
FROM orders AS o
JOIN order_items AS i  ON i.order_id = o.order_id
JOIN payments    AS pay ON pay.order_id = o.order_id
GROUP BY o.order_id
ORDER BY o.order_id;`,
    rows: [
      ['101', '79.00', '79.00', '0.00'],
      ['102', '40.00', '40.00', '0.00'],
    ],
    verdict: 'Wrong, and plausible. Order 101 has two items and two payments, so the join made four rows and doubled both sums. Order 103 has no payment, so the join dropped it: the unpaid order is missing from a report about what is due.',
  },
  {
    key: 'left',
    label: 'Keep orders without payments',
    sql: `SELECT o.order_id,
       sum(i.quantity * i.unit_price) AS value,
       sum(pay.amount) AS paid,
       sum(i.quantity * i.unit_price) - sum(pay.amount) AS due
FROM orders AS o
JOIN order_items AS i ON i.order_id = o.order_id
LEFT JOIN payments AS pay ON pay.order_id = o.order_id
GROUP BY o.order_id
ORDER BY o.order_id;`,
    rows: [
      ['101', '79.00', '79.00', '0.00'],
      ['102', '40.00', '40.00', '0.00'],
      ['103', '29.00', 'NULL', 'NULL'],
    ],
    verdict: 'Still wrong. The left join keeps order 103, but with no payment its paid sum is NULL, and any arithmetic with NULL is NULL, so nothing appears to be due. Order 101 is still doubled.',
  },
  {
    key: 'separate',
    label: 'Sum each side, then join',
    sql: `WITH value AS (
  SELECT order_id, sum(quantity * unit_price) AS value
  FROM order_items GROUP BY order_id
), paid AS (
  SELECT order_id, sum(amount) AS paid
  FROM payments GROUP BY order_id
)
SELECT o.order_id, v.value,
       coalesce(p.paid, 0.00) AS paid,
       v.value - coalesce(p.paid, 0.00) AS due
FROM orders AS o
JOIN value AS v ON v.order_id = o.order_id
LEFT JOIN paid AS p ON p.order_id = o.order_id
ORDER BY o.order_id;`,
    rows: expectedSummary,
    verdict: 'Correct. Each sum is taken over one kind of row, so nothing is counted twice, and a missing payment total is turned into zero on purpose. Every value matches the hand calculation below the result.',
  },
];

// Section 4, Figure 3: Mina and Tariq both want the last blue mug.
// Each option runs the same six steps; verify.mjs replays them in two sessions.
export const raceOptions = [
  { key: 'overwrite', label: 'Read the count, then write it (Read Committed)', isolation: 'READ COMMITTED' },
  { key: 'repeatable', label: 'Read the count, then write it (Repeatable Read)', isolation: 'REPEATABLE READ' },
  { key: 'guarded', label: 'Take one only while stock remains (Read Committed)', isolation: 'READ COMMITTED' },
];
const write = key => (key === 'guarded'
  ? "UPDATE products SET stock = stock - 1\n  WHERE product_id = 'P7' AND stock >= 1;"
  : "UPDATE products SET stock = 0\n  WHERE product_id = 'P7';");

/** Steps for one option: who acts, what they send, what they get back, and the state after. */
export function raceSteps(key) {
  const iso = raceOptions.find(o => o.key === key).isolation;
  const begin = `BEGIN ISOLATION LEVEL ${iso};\nSELECT stock FROM products\n  WHERE product_id = 'P7';`;
  const tariqLate = { overwrite: 'UPDATE 1', repeatable: 'ERROR 40001: could not serialize access due to concurrent update', guarded: 'UPDATE 0' }[key];
  const ending = {
    overwrite: { actor: 'Tariq', sql: 'COMMIT;', result: 'COMMIT', mina: 'Finished', tariq: 'Committed order 104', committed: { stock: 0, holders: ['103', '104'] },
      text: 'Tariq commits. Both orders now hold the one blue mug, yet stock reads 0, as if one had been sold. Each transaction was atomic; neither protected its decision.' },
    repeatable: { actor: 'Tariq', sql: 'ROLLBACK;', result: 'ROLLBACK', mina: 'Finished', tariq: 'Order 104 discarded; retry reads 0', committed: { stock: 0, holders: ['103'] },
      text: 'Tariq’s transaction cannot continue, so the application rolls it back, and order 104 disappears with it. Retrying the whole transaction reads 0 and refuses. Only order 103 holds the mug.' },
    guarded: { actor: 'Tariq', sql: 'ROLLBACK;', result: 'ROLLBACK', mina: 'Finished', tariq: 'Order 104 discarded: sold out', committed: { stock: 0, holders: ['103'] },
      text: 'The application sees that no unit was taken, rolls back, and tells Tariq the mug has sold out. Rollback removes the order 104 he had inserted. Only order 103 holds the mug.' },
  }[key];
  const fifth = {
    overwrite: 'Mina commits, so order 103 and stock 0 become visible to everyone. Tariq’s update now proceeds. It sets stock to 0, the number his application calculated from the 1 it read at step 2.',
    repeatable: 'Mina commits. At Repeatable Read, PostgreSQL will not let Tariq overwrite a row that changed after his snapshot, so his update fails with a serialisation error.',
    guarded: 'Mina commits. PostgreSQL rechecks Tariq’s condition against the committed row. Stock is now 0, so stock >= 1 is false and his update changes no rows.',
  }[key];
  return [
    { actor: 'Mina', sql: begin, result: '1', mina: 'Sees 1 mug', tariq: 'Not started', committed: { stock: 1, holders: [] },
      text: 'Mina’s transaction starts and reads the mug’s stock: 1. Her basket can be confirmed.' },
    { actor: 'Tariq', sql: begin, result: '1', mina: 'Sees 1 mug', tariq: 'Sees 1 mug', committed: { stock: 1, holders: [] },
      text: 'Tariq’s transaction starts a moment later. Nothing has changed yet, so he also reads 1.' },
    { actor: 'Mina', sql: `INSERT INTO orders … 103;\n${write(key)}`, result: 'UPDATE 1', mina: 'Order 103; sees stock 0', tariq: 'Sees 1 mug', committed: { stock: 1, holders: [] },
      text: 'Mina inserts order 103 and changes the stock. Her own transaction sees 0, but nothing is committed, so everyone else still sees 1 and no order.' },
    { actor: 'Tariq', sql: `INSERT INTO orders … 104;\n${write(key)}`, result: 'Waiting for Mina’s row lock', mina: 'Order 103; sees stock 0', tariq: 'Order 104; waiting', committed: { stock: 1, holders: [] },
      text: 'Tariq inserts order 104 and tries to change the same stock row. Mina’s uncommitted update holds that row, so his statement waits.' },
    { actor: 'Mina', sql: 'COMMIT;', result: `COMMIT. Tariq’s update: ${tariqLate}`, mina: 'Committed order 103', tariq: { overwrite: 'Order 104; set stock 0', repeatable: 'Transaction failed', guarded: 'Order 104; took no unit' }[key], committed: { stock: 0, holders: ['103'] },
      text: fifth },
    ending,
  ];
}

// Section 4: Mina's order as one transaction, using the guarded change from Figure 3.
export const orderTransactionSql = `BEGIN;
INSERT INTO orders VALUES (103, 1, '2026-10-20 10:15+00', 'pending');
INSERT INTO order_items VALUES
  (103, 1, 'P7', 1, 20.00),
  (103, 2, 'P3', 2, 4.50);
UPDATE products SET stock = stock - 1
  WHERE product_id = 'P7' AND stock >= 1;   -- UPDATE 1, or 0 if sold out
UPDATE products SET stock = stock - 2
  WHERE product_id = 'P3' AND stock >= 2;
COMMIT;   -- or ROLLBACK if either update changed no row`;

// Section 4: the same race with an unguarded decrement. The CHECK constraint
// refuses Tariq's change instead of the application noticing.
export const unguardedResult = '23514';

// Section 6: pages read to find rows, observed with EXPLAIN (ANALYZE, BUFFERS)
// on a table of orders with 1,000 customers. Hits plus reads, for the scan node.
export const scanSizes = [1000, 100000, 1000000];
export const scanObserved = [
  { rows: 1000, tablePages: 8, customerRows: 1, idNode: 'Index Scan using big_orders_pkey on big_orders', idPages: 3, scanNode: 'Seq Scan on big_orders', scanPages: 8, indexNode: 'Index Scan using big_orders_customer_id_idx on big_orders', indexPages: 3 },
  { rows: 100000, tablePages: 736, customerRows: 100, idNode: 'Index Scan using big_orders_pkey on big_orders', idPages: 3, scanNode: 'Seq Scan on big_orders', scanPages: 736, indexNode: 'Bitmap Heap Scan on big_orders', indexPages: 102 },
  { rows: 1000000, tablePages: 7353, customerRows: 1000, idNode: 'Index Scan using big_orders_pkey on big_orders', idPages: 4, scanNode: 'Seq Scan on big_orders', scanPages: 7353, indexNode: 'Bitmap Heap Scan on big_orders', indexPages: 1004 },
];

// Section 8, Figure 4: an illustrative model, not an executed failover or restore.
export const recoveryOptions = [
  { key: 'host', label: 'The primary server is lost' },
  { key: 'mistake', label: 'A cleanup job deletes order 101' },
];
export function recoverySteps(key) {
  const mistake = key === 'mistake';
  // Order 104 was rolled back in Figure 3, so it never exists here.
  const live = mistake ? ['102', '103', '105'] : ['101', '102', '103', '105'];
  return [
    { time: '11:05', primary: ['101', '102', '103', '105'], replica: ['101', '102', '103', '105'], backup: 'Copy from 02:00, log to 11:05',
      text: 'Order 105 has just committed. The replica replays the primary’s log continuously, and every log segment is also archived next to last night’s base copy.' },
    { time: '11:10', primary: live, replica: live, backup: 'Copy from 02:00, log to 11:10', changed: mistake,
      text: mistake
        ? 'A cleanup job with a wrong condition deletes order 101 and its rows, and commits. The replica replays the deletion within moments, exactly as it should.'
        : '' },
    { time: '11:11', primary: [...live, '106'], replica: [...live, '106'], backup: 'Copy from 02:00, log to 11:11',
      text: 'Edda places order 106, a valid order that any recovery must keep.' },
    { time: '11:12', primary: mistake ? [...live, '106'] : null, replica: [...live, '106'], backup: 'Copy from 02:00, log to 11:11',
      text: mistake
        ? 'Mina reports that paid order 101 has vanished. The primary is healthy and so is the replica: both faithfully lack order 101.'
        : 'The primary’s host fails. The replica holds every order up to 106, provided it had received them; an asynchronous replica can be a few commits behind.' },
    { time: 'After', primary: mistake ? ['101', '102', '103', '105', '106'] : null, replica: mistake ? ['101', '102', '103', '105', '106'] : [...live, '106'], promoted: !mistake, backup: mistake ? 'Restored to 11:09:59 elsewhere: 101, 102, 103, 105; no 106' : 'Not needed', restored: mistake,
      text: mistake
        ? 'Promoting the replica would change nothing. The team restores the copy and log to 11:09:59 on a separate server, then copies order 101 and its rows back into the live service, and the replica replays the repair. Rewinding the live service instead would lose order 106.'
        : 'The team fences the failed primary so it cannot accept writes, promotes the replica and reconnects the application. Service returns within minutes, with no backup involved.' },
  ].filter(step => mistake || step.time !== '11:10');
}
