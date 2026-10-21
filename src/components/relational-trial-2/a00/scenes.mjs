// The stepped figures in the relational introduction (trial 2). Each scene turns
// the rows and outcomes in model.mjs into frames that ShopFigure.astro draws.
// verify.mjs checks the final frames against a real PostgreSQL server.
//
// A frame: { label, explanation, history?, tables, checks?, outcome? }
//   history: { columns: [who], rows: [[entry | null, ...]] }, time running down
//            entry: { text, result?, state?, plain? }
//            state: 'new' | 'wait' | 'waited' | 'error'; plain: prose, not SQL
//   tables:  [{ name, note?, columns: [{ name, key? }], rows: [{ cells, state?, changed? }] }]
//            row state: 'new' | 'pending' | 'gone' | 'rolledback' | 'dropped';
//            changed: indexes of cells that changed
//   checks:  [{ label, value, ok }]

import * as m from './model.mjs';

const col = (table, names) => {
  const t = m.schemaTables.find(x => x.name === table);
  return names.map(name => ({ name, key: t.columns.find(c => c.name === name)?.key }));
};
const productCols = col('products', ['product_id', 'name', 'stock']);
const orderCols = col('orders', ['order_id', 'customer_id', 'status']);
const itemCols = col('order_items', ['order_id', 'line_no', 'product_id', 'quantity', 'unit_price']);
const paymentCols = col('payments', ['payment_id', 'order_id', 'amount']);

// ------------------------------------------------------------- Shared
const entry = (text, result, state) => ({ text, result, state });
const says = (text, result, state) => ({ text, result, state, plain: true });
/** Clears the 'new' marks from earlier rows, so only this step's additions stand out. */
const settle = rows => rows.map(row => row.map(e => (e && e.state === 'new' ? { ...e, state: undefined } : e)));

// ------------------------------------------------------------- Figure 1
function separateFrames() {
  const labels = ['Before Mina orders', ...m.order103Changes.map(c => c.short)];
  const notes = [
    'Mina has chosen one blue mug and two green teas. The shop has one blue mug and twelve teas, and order 103 does not exist yet. Every answer the stored rows give is true.',
    'The order row exists, so the shop now records that Mina has an order 103. It has no lines, so it is worth 0.00, and the last blue mug still shows as available to anyone else.',
    'The mug is now part of order 103, yet the products row still says one mug can be sold. A second customer could buy the mug Mina has just ordered.',
    'Both lines are in place and the order is worth 29.00. Stock has not moved: the shop would still sell the mug and count twelve teas.',
    'The mug has left stock. The teas have not, so a stock count still reports two teas that belong to Mina.',
    'All five changes are in. Every answer agrees with what Mina ordered again. Only the first and last states were ever true; the four in between were visible to every other reader, and a crash in any of them would have left them in place.',
  ];
  return labels.map((label, n) => {
    const s = m.partialOrder(n);
    const prev = n ? m.partialOrder(n - 1) : s;
    const items = m.orderItems.filter(i => i.order_id !== 103 || s.lines.includes(i));
    return {
      label,
      explanation: notes[n],
      history: { columns: ['Shop application'], rows: m.order103Changes.slice(0, n).map((c, i) => [entry(c.sql, undefined, i === n - 1 ? 'new' : undefined)]) },
      tables: [
        { name: 'products', columns: productCols, rows: m.productsBefore.map(p => {
          const stock = p.product_id === 'P7' ? s.p7 : p.product_id === 'P3' ? s.p3 : p.stock;
          const before = p.product_id === 'P7' ? prev.p7 : p.product_id === 'P3' ? prev.p3 : p.stock;
          return { cells: [p.product_id, p.name, String(stock)], changed: stock !== before ? [2] : undefined };
        }) },
        { name: 'orders', columns: orderCols, rows: m.orders.filter(o => o.order_id !== 103 || s.has103).map(o => ({ cells: [String(o.order_id), String(o.customer_id), o.status], state: o.order_id === 103 && n === 1 ? 'new' : undefined })) },
        { name: 'order_items', columns: itemCols, rows: items.map(i => ({ cells: [String(i.order_id), String(i.line_no), i.product_id, String(i.quantity), i.unit_price], state: i.order_id === 103 && i === s.lines.at(-1) && n === s.lines.length + 1 ? 'new' : undefined })) },
      ],
      checks: s.questions.map(q => ({ label: q.question, value: q.answer, ok: q.right })),
      outcome: s.consistent ? 'The stored facts agree with each other.' : 'The stored facts contradict each other.',
    };
  });
}

// ------------------------------------------------------------- Figure 3
const money = v => Number(v).toFixed(2);
function dueFrames(option) {
  const lines = m.orderItems.map(i => ({ cells: [String(i.order_id), String(i.line_no), money(i.quantity * Number(i.unit_price))] }));
  const pays = m.payments.map(p => ({ cells: [String(p.payment_id), String(p.order_id), p.amount] }));
  const source = [
    { name: 'order_items', note: 'value of each line', columns: [...col('order_items', ['order_id', 'line_no']), { name: 'quantity × unit_price' }], rows: lines },
    { name: 'payments', columns: paymentCols, rows: pays },
  ];
  const resultCols = [{ name: 'order_id' }, { name: 'value' }, { name: 'paid' }, { name: 'due' }];
  const start = {
    label: 'The question',
    explanation: 'The shop wants one row per order: what it is worth, what has been paid, and what is still due. Order 101 has two lines and two payments, 102 one of each, and 103 two lines and no payment yet.',
    tables: source,
  };
  if (option === 'together') {
    const pairs = m.joinedPairs();
    const joinedCols = [{ name: 'order_id' }, { name: 'line_no' }, { name: 'value' }, { name: 'payment_id' }, { name: 'amount' }];
    const kept = pairs.map(p => ({ cells: [String(p.order_id), String(p.line_no), p.line_value, String(p.payment_id), p.amount] }));
    const dropped = m.orderItems.filter(i => !m.payments.some(p => p.order_id === i.order_id))
      .map(i => ({ cells: [String(i.order_id), String(i.line_no), money(i.quantity * Number(i.unit_price)), 'none', 'none'], state: 'dropped' }));
    const joinNote = 'orders joined to their lines and payments';
    const result = { name: 'Result', columns: resultCols, rows: m.dueWrongResult.map(r => ({ cells: [String(r.order_id), r.value, r.paid, r.due], changed: r.order_id === 101 ? [1, 2] : undefined })) };
    return [start,
      { label: 'Join lines and payments to each order', explanation: 'Each line of order 101 matches both of its payments, so the join makes four rows from two lines and two payments. An ordinary join, called an inner join, keeps only rows that find a match. Order 103 has no payment, so both of its lines are dropped.', tables: [{ name: 'Joined rows', note: joinNote, columns: joinedCols, rows: [...kept, ...dropped] }] },
      { label: 'Group by order and sum', explanation: 'GROUP BY gathers the joined rows of each order, and sum adds them up. For order 101 that counts each line twice and each payment twice: 79.00 of value and 79.00 paid for an order worth 39.50. The two errors cancel, so the due column still looks right.', tables: [{ name: 'Joined rows', note: joinNote, columns: joinedCols, rows: kept }, result] },
      { label: 'Read the report', explanation: 'The report says nothing is due anywhere. Mina owes 29.00 on order 103, but the order is not in the result at all. Each statement ran without error; the question it answered was not the one the shop asked.', tables: [{ ...result, rows: result.rows.map(r => ({ cells: r.cells })) }], checks: [{ label: 'Orders in the result', value: '2 of 3', ok: false }, { label: 'Order 101 value', value: '79.00, should be 39.50', ok: false }, { label: 'Still due on order 103', value: 'missing, should be 29.00', ok: false }] },
    ];
  }
  const byId = id => m.dueRightResult.find(r => r.order_id === id);
  const values = { name: 'value', note: 'one row per order', columns: [{ name: 'order_id' }, { name: 'value' }], rows: [101, 102, 103].map(id => ({ cells: [String(id), byId(id).value] })) };
  const paid = { name: 'paid', note: 'one row per order', columns: [{ name: 'order_id' }, { name: 'paid' }], rows: [101, 102].map(id => ({ cells: [String(id), byId(id).paid] })) };
  const joined = { name: 'Joined totals', note: 'every order, with its totals where they exist', columns: [{ name: 'order_id' }, { name: 'value' }, { name: 'paid' }], rows: [101, 102, 103].map(id => ({ cells: [String(id), byId(id).value, id === 103 ? 'NULL' : byId(id).paid], changed: id === 103 ? [2] : undefined })) };
  const result = changed => ({ name: 'Result', columns: resultCols, rows: m.dueRightResult.map(r => ({ cells: [String(r.order_id), r.value, r.paid, r.due], changed: changed && r.order_id === 103 ? [2, 3] : undefined })) });
  return [start,
    { label: 'Sum each kind of fact on its own', explanation: 'The WITH clause at the top of the query names two intermediate results. value sums the lines of each order, and paid sums the payments of each order, before anything is joined. Each order now has at most one row in each, so nothing can be counted twice. Order 103 has no paid row at all.', tables: [values, paid] },
    { label: 'Join the totals to every order', explanation: 'A left join keeps every order, whether or not it finds a match. Order 103 finds a value row but no paid row, so its paid column is NULL, SQL’s mark for a missing value. Any arithmetic with NULL gives NULL, so the due column would be NULL too.', tables: [values, paid, joined] },
    { label: 'Turn missing totals into 0.00, then subtract', explanation: 'coalesce returns its first argument that is not NULL, so a missing total becomes 0.00. The subtraction then gives a real amount for every order: 29.00 still due on order 103.', tables: [joined, result(true)] },
    { label: 'Read the report', explanation: 'Every order appears once, with its true value. Orders 101 and 102 are settled, and Mina still owes 29.00 on order 103.', tables: [result(false)], checks: [{ label: 'Orders in the result', value: '3 of 3', ok: true }, { label: 'Order 101 value', value: '39.50', ok: true }, { label: 'Still due on order 103', value: '29.00', ok: true }] },
  ];
}

// ------------------------------------------------------------- Figure 4
const mug = stock => ({ name: 'products', columns: col('products', ['product_id', 'name', 'stock']), rows: [{ cells: ['P7', 'Blue mug', String(stock.value)], changed: stock.changed ? [2] : undefined }] });
const mugLines = rows => ({ name: 'order_items', note: 'blue-mug lines only', columns: col('order_items', ['order_id', 'line_no', 'product_id', 'quantity']), rows: rows.map(([order, state]) => ({ cells: [String(order), '1', 'P7', '1'], state })) });

function raceFrames(option) {
  const p = m.raceProtocols[option];
  const who = ['Mina, order 103', 'Tariq, order 104'];
  const frames = [{
    label: 'Both press Buy',
    explanation: 'One blue mug is left. Mina (order 103) and Tariq (order 104) press Buy at the same moment, and the shop runs one session for each of them: a connection to the database with its own transaction.',
    history: { columns: who, rows: [] },
    tables: [mug({ value: 1 }), mugLines([])],
  }];
  let rows = [];
  const step = (label, explanation, add, tables, extra = {}, replace) => {
    rows = settle(replace ? replace(rows) : rows);
    rows = [...rows, ...add];
    frames.push({ label, explanation, history: { columns: who, rows }, tables, ...extra });
  };
  const addOrder = n => says(n === 103 ? 'Add order 103 and its lines' : 'Add order 104 and its line', 'INSERT', 'new');
  // The waiting statement keeps its row and is marked as having waited once it can go on.
  const waited = rs => rs.map(row => row.map(e => (e && e.state === 'wait' ? { ...e, result: 'waited for Mina', state: 'waited' } : e)));
  if (option === 'conditional') {
    step('Mina’s update takes the mug', 'Mina’s session subtracts one only where at least one mug remains. The check and the change are one statement, and once the row is changed her transaction holds a lock on it until it ends. One row matches.',
      [[entry(`${p.begin}\n${p.write}`, 'UPDATE 1', 'new'), null]], [mug({ value: '0 (uncommitted)', changed: true }), mugLines([])]);
    step('Mina adds her order', 'Mina’s order and its lines are written, still inside her transaction. No other session can see them yet.',
      [[addOrder(103), null]], [mug({ value: '0 (uncommitted)' }), mugLines([[103, 'pending']])]);
    step('Tariq’s update waits', 'Tariq’s session runs the same conditional update. Mina’s transaction holds the mug’s row, so Tariq’s statement waits for her transaction to end.',
      [[null, entry(`${p.begin}\n${p.write}`, 'waits for Mina', 'wait')]], [mug({ value: '0 (uncommitted)' }), mugLines([[103, 'pending']])]);
    step('Mina commits; Tariq’s update finds no mug', 'When Mina commits, Tariq’s update goes on against her committed row. Stock is now 0, so its condition fails and it changes no rows.',
      [[entry('COMMIT;', 'COMMIT', 'new'), null], [null, says('His UPDATE goes on: stock is 0, so the condition fails', 'UPDATE 0', 'new')]], [mug({ value: 0, changed: true }), mugLines([[103, 'new']])], {}, waited);
    step('Tariq is told the mug has sold', 'Tariq’s application sees that no row changed, rolls back and tells him the mug has sold out. One mug, one order: the stock rule held.',
      [[null, entry('ROLLBACK;', 'sold out', 'new')]], [mug({ value: 0 }), mugLines([[103]])], { checks: [{ label: 'Mugs promised', value: '1 of 1', ok: true }] });
    return frames;
  }
  step('Mina reads the stock', 'Mina’s session starts a transaction and reads stock 1. Her application decides there is a mug to sell.',
    [[entry(`${p.begin}\n${p.read}`, '1', 'new'), null]], [mug({ value: 1 }), mugLines([])]);
  step('Tariq reads the stock', 'Tariq’s session reads stock 1 as well, which is true: Mina has not changed anything yet. Reading takes no lock, so both applications have now decided to sell the same mug.',
    [[null, entry(`${p.begin}\n${p.read}`, '1', 'new')]], [mug({ value: 1 }), mugLines([])]);
  step('Mina writes her decision', 'Mina’s application writes the stock it calculated, 0, and adds her order. Her transaction now holds the mug’s row; none of this is visible to Tariq yet.',
    [[entry(p.write, 'UPDATE 1', 'new'), null], [addOrder(103), null]], [mug({ value: '0 (uncommitted)', changed: true }), mugLines([[103, 'pending']])]);
  step('Tariq’s write waits', 'Tariq’s application writes its own calculated stock, also 0. The row is held by Mina’s transaction, so the statement waits for her to finish.',
    [[null, entry(p.write, 'waits for Mina', 'wait')]], [mug({ value: '0 (uncommitted)' }), mugLines([[103, 'pending']])]);
  step('Mina commits; Tariq’s write goes ahead', 'Mina commits. Tariq’s statement only says “set stock to 0”, and the row still exists, so it goes ahead and sets 0 again. Nothing connects this write to the 1 that Tariq’s application read earlier.',
    [[entry('COMMIT;', 'COMMIT', 'new'), null], [null, says('His UPDATE goes on and sets stock to 0', 'UPDATE 1', 'new')]], [mug({ value: 0, changed: true }), mugLines([[103, 'new']])], {}, waited);
  step('Tariq commits a second sale', 'Tariq’s order is added and committed. Two orders now hold the one mug the shop had, and the stock column says 0 as if all were well. No statement failed and no constraint was broken.',
    [[null, addOrder(104)], [null, entry('COMMIT;', 'COMMIT', 'new')]], [mug({ value: 0 }), mugLines([[103], [104, 'new']])], { checks: [{ label: 'Mugs promised', value: '2 of 1', ok: false }] });
  return frames;
}

// ------------------------------------------------------------- Figure 5
function lostFrames(option) {
  const who = ['Shop application', 'Mina sees'];
  const orders = state => ({ name: 'orders', columns: orderCols, rows: [
    { cells: ['101', '1', 'paid'] }, { cells: ['102', '2', 'paid'] },
    ...(state === 'none' ? [] : [{ cells: ['103', '1', 'pending'], state: state === 'kept' ? undefined : state }]),
  ] });
  const stock = (value, changed) => ({ name: 'products', columns: productCols, rows: [{ cells: ['P7', 'Blue mug', String(value)], changed: changed ? [2] : undefined }] });
  const frames = [];
  let rows = [];
  const step = (label, explanation, add, tables, extra = {}) => {
    rows = [...settle(rows), ...add];
    frames.push({ label, explanation, history: { columns: who, rows }, tables, ...extra });
  };
  const confirmed = { checks: [{ label: 'What Mina was told matches the database', value: 'yes', ok: true }] };
  step('Mina presses Place order', 'The shop application opens a transaction for order 103. It chose the number 103 itself before sending anything, so it can ask about this order later.',
    [[entry('BEGIN;', 'BEGIN', 'new'), says('Placing your order…', undefined, 'new')]], [stock(1), orders('none')]);
  step('The order’s statements run', 'The order row is inserted first, then the conditional update takes the mug, the teas are taken from stock and the lines are added. All of it is still uncommitted.',
    [[entry(m.placeOrder103[1], 'INSERT 0 1', 'new'), null], [entry(m.placeOrder103[2], 'UPDATE 1', 'new'), null], [says('Take the teas and add the two lines', 'done', 'new'), null]],
    [stock('0 (uncommitted)', true), orders('pending')]);
  if (option === 'replied') {
    step('COMMIT, and the reply arrives', 'The application sends COMMIT and receives the reply. It knows the order is stored, so it can tell Mina.',
      [[entry('COMMIT;', 'COMMIT', 'new'), null]], [stock(0, true), orders('new')]);
    step('Mina is told the truth', 'The confirmation matches the database: order 103 is committed and the mug is hers. Nothing needs recovering.',
      [[null, says('Order 103 confirmed', undefined, 'new')]], [stock(0), orders('kept')], confirmed);
    return frames;
  }
  if (option === 'beforeCommit') {
    step('The connection breaks before COMMIT', 'The network drops before COMMIT reaches the database. When the database finds the session gone, it rolls back everything in it: order 103 never becomes visible and the mug is back in stock. The application sees only a connection error.',
      [[entry('COMMIT;', 'could not be sent: connection lost', 'error'), null]], [stock(1, true), orders('rolledback')]);
    step('Look up order 103', 'On a new connection, the application asks whether order 103 exists. No row comes back, so order 103 has not committed, at least so far.',
      [[entry(m.lookup103, '0 rows', 'new'), null]], [stock(1), orders('none')]);
    step('Repeat the whole order, insert first', 'The application runs the whole transaction again. Its first statement inserts order 103, so if an earlier attempt were somehow still running, the insert would wait for it and fail with a duplicate key if it committed. Here nothing is in the way: the order commits and Mina is told.',
      [[says('Run the whole order transaction again', 'COMMIT', 'new'), null], [null, says('Order 103 confirmed', undefined, 'new')]], [stock(0, true), orders('new')], confirmed);
    return frames;
  }
  step('COMMIT succeeds; its reply is lost', 'The database commits order 103, then the connection breaks before the reply reaches the application. The application sees the same connection error as when the break came before COMMIT, but this time the order is stored.',
    [[entry('COMMIT;', 'no reply: connection lost', 'error'), null]], [stock(0, true), orders('new')]);
  step('Look up order 103, then confirm it', 'The lookup finds order 103 committed, so the application confirms it. Repeating blindly would have been worse: a repeat that claimed the mug before inserting the order would find no stock and tell Mina the mug had sold out, although she had bought it.',
    [[entry(m.lookup103, '103 | pending', 'new'), null], [null, says('Order 103 confirmed', undefined, 'new')]], [stock(0), orders('kept')], confirmed);
  return frames;
}

// ------------------------------------------------------------- Figure 2
/** The shop after order 103, with the rows a chosen order reaches through its keys marked. */
export function keysView(orderId) {
  const r = m.relatedRows(orderId);
  const hit = yes => (yes ? 'hit' : undefined);
  const tables = [
    { name: 'customers', columns: col('customers', ['customer_id', 'name']), rows: m.customers.map(c => ({ cells: [String(c.customer_id), c.name], state: hit(c.customer_id === r.customer.customer_id) })) },
    { name: 'orders', columns: col('orders', ['order_id', 'customer_id', 'placed_at', 'status']), rows: m.orders.map(o => ({ cells: [String(o.order_id), String(o.customer_id), o.placed_at, o.status], state: hit(o.order_id === orderId) })) },
    { name: 'payments', columns: col('payments', ['payment_id', 'order_id', 'amount', 'method']), rows: m.payments.map(p => ({ cells: [String(p.payment_id), String(p.order_id), p.amount, p.method], state: hit(p.order_id === orderId) })) },
    { name: 'order_items', columns: col('order_items', ['order_id', 'line_no', 'product_id', 'quantity', 'unit_price']), rows: m.orderItems.map(i => ({ cells: [String(i.order_id), String(i.line_no), i.product_id, String(i.quantity), i.unit_price], state: hit(i.order_id === orderId) })) },
    { name: 'products', columns: col('products', ['product_id', 'name', 'price', 'stock']), rows: m.productsAfter.map(p => ({ cells: [p.product_id, p.name, p.price, String(p.stock)], state: hit(r.products.includes(p.product_id)) })) },
  ];
  const names = r.items.map(i => `line ${i.line_no}, ${i.quantity} × ${m.productsAfter.find(p => p.product_id === i.product_id).name} (${i.product_id})`);
  const pays = r.payments.length ? `${r.payments.length === 1 ? 'payment' : 'payments'} ${r.payments.map(p => `${p.payment_id} (${p.amount})`).join(' and ')}` : 'no payment yet';
  const summary = `Order ${orderId} belongs to customer ${r.customer.customer_id}, ${r.customer.name}. It has ${names.join(' and ')}, and ${pays}.`;
  return { summary, tables };
}

export const scenes = {
  separate: {
    title: 'One order written as five separate changes',
    kind: 'Illustrative model. Every state was checked on PostgreSQL 18.6.',
    note: 'Shows products, orders and order_items only; customers and payments do not change. Each change is saved as soon as it is made.',
    optionLabel: '',
    options: [],
    frames: separateFrames,
  },
  due: {
    title: 'What is still due on each order?',
    kind: 'Illustrative model. Both queries and their results were run on PostgreSQL 18.6.',
    note: 'Line values are quantity × unit_price. Order 103 is pending with no payment.',
    optionLabel: 'Query shape',
    options: [{ value: 'together', label: 'Join everything, then sum' }, { value: 'separate', label: 'Sum each, then join' }],
    queries: { together: m.dueWrong, separate: m.dueRight },
    frames: dueFrames,
  },
  race: {
    title: 'Two customers, one blue mug',
    kind: 'Illustrative schedule. Both ways of selling were run as two concurrent sessions on PostgreSQL 18.6.',
    note: 'Only the blue mug’s stock and mug lines are shown; Mina’s tea line and its stock change are left out. Real sessions interleave by timing; this is the order that exposes the difference.',
    optionLabel: 'How the shop sells the mug',
    options: [{ value: 'read', label: 'Read, then write' }, { value: 'conditional', label: 'Conditional update' }],
    frames: raceFrames,
  },
  lost: {
    title: 'Where the connection breaks',
    kind: 'Illustrative model. The database outcomes were observed on PostgreSQL 18.6 by ending the session before and after COMMIT.',
    note: 'Shows orders 101 to 103 and the blue mug’s stock; the teas and order lines are left out. Drivers, connection pools and timeouts are left out too: Building applications around a relational database covers them.',
    optionLabel: 'What happens',
    options: [{ value: 'replied', label: 'Reply arrives' }, { value: 'beforeCommit', label: 'Breaks before COMMIT' }, { value: 'afterCommit', label: 'Breaks after COMMIT' }],
    frames: lostFrames,
  },
};
