// The stepped figures in the relational introduction (trial 2). Each scene turns
// the rows and outcomes in model.mjs into frames that ShopFigure.astro draws.
// verify.mjs checks the final frames against a real PostgreSQL server.
//
// A frame: { label, explanation, lanes?, tables, checks?, outcome? }
//   lanes:  [{ who, lines: [{ text, result?, state? }] }]   state: 'new' | 'wait' | 'error'
//   tables: [{ name, note?, columns: [{ name, key? }], rows: [{ cells, state?, changed? }] }]
//           row state: 'new' | 'pending' | 'gone'; changed: indexes of cells that changed
//   checks: [{ label, value, ok }]

import * as m from './model.mjs';

const col = (table, names) => {
  const t = m.schemaTables.find(x => x.name === table);
  return names.map(name => ({ name, key: t.columns.find(c => c.name === name)?.key }));
};
const productCols = col('products', ['product_id', 'name', 'stock']);
const orderCols = col('orders', ['order_id', 'customer_id', 'status']);
const itemCols = col('order_items', ['order_id', 'line_no', 'product_id', 'quantity', 'unit_price']);
const paymentCols = col('payments', ['payment_id', 'order_id', 'amount']);

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
      lanes: [{ who: 'Shop application', lines: m.order103Changes.slice(0, n).map((c, i) => ({ text: c.sql, state: i === n - 1 ? 'new' : undefined })) }],
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
    const joined = { name: 'Joined rows', note: 'orders ⋈ order_items ⋈ payments', columns: [{ name: 'order_id' }, { name: 'line_no' }, { name: 'line value' }, { name: 'payment_id' }, { name: 'amount' }], rows: pairs.map(p => ({ cells: [String(p.order_id), String(p.line_no), p.line_value, String(p.payment_id), p.amount], state: p.order_id === 101 ? 'new' : undefined })) };
    const result = { name: 'Result', columns: resultCols, rows: m.dueWrongResult.map(r => ({ cells: [String(r.order_id), r.value, r.paid, r.due], changed: r.order_id === 101 ? [1, 2] : undefined })) };
    return [start,
      { label: 'Join lines and payments to each order', explanation: 'Each line of order 101 matches both of its payments, so the join makes four rows from two lines and two payments. An ordinary join, called an inner join, keeps only rows that find a match. Order 103 has no payment, so both of its lines are dropped.', tables: [joined] },
      { label: 'Group by order and sum', explanation: 'Summing the four rows counts each line twice and each payment twice: 79.00 of value and 79.00 paid for an order worth 39.50. The two errors cancel, so the due column still looks right.', tables: [joined, result] },
      { label: 'Read the report', explanation: 'The report says nothing is due anywhere. Mina owes 29.00 on order 103, but the order is not in the result at all. Each statement ran without error; the question it answered was not the one the shop asked.', tables: [result], checks: [{ label: 'Orders in the result', value: '2 of 3', ok: false }, { label: 'Order 101 value', value: '79.00, should be 39.50', ok: false }, { label: 'Still due on order 103', value: 'missing, should be 29.00', ok: false }] },
    ];
  }
  const values = { name: 'value', note: 'one row per order', columns: [{ name: 'order_id' }, { name: 'value' }], rows: [101, 102, 103].map(id => ({ cells: [String(id), m.dueRightResult.find(r => r.order_id === id).value] })) };
  const paid = { name: 'paid', note: 'one row per order', columns: [{ name: 'order_id' }, { name: 'paid' }], rows: [101, 102].map(id => ({ cells: [String(id), m.dueRightResult.find(r => r.order_id === id).paid] })) };
  const result = { name: 'Result', columns: resultCols, rows: m.dueRightResult.map(r => ({ cells: [String(r.order_id), r.value, r.paid, r.due], changed: r.order_id === 103 ? [2, 3] : undefined })) };
  return [start,
    { label: 'Sum each kind of fact on its own', explanation: 'The lines are summed per order, and so are the payments, before anything is joined. Each order now has one value row and at most one paid row, so nothing can be counted twice.', tables: [values, paid] },
    { label: 'Join the totals, keeping unpaid orders', explanation: 'A left join keeps every order that has a value, even with no payment row. Order 103 gets no paid row, so its paid total is missing; coalesce turns that missing total into 0.00.', tables: [values, paid, result] },
    { label: 'Read the report', explanation: 'Every order appears once, with its true value. Orders 101 and 102 are settled, and Mina still owes 29.00 on order 103.', tables: [result], checks: [{ label: 'Orders in the result', value: '3 of 3', ok: true }, { label: 'Order 101 value', value: '39.50', ok: true }, { label: 'Still due on order 103', value: '29.00', ok: true }] },
  ];
}

// ------------------------------------------------------------- Figure 4
const mug = stock => ({ name: 'products', columns: col('products', ['product_id', 'name', 'stock']), rows: [{ cells: ['P7', 'Blue mug', String(stock.value)], changed: stock.changed ? [2] : undefined }] });
const mugLines = rows => ({ name: 'order_items', note: 'blue-mug lines only', columns: col('order_items', ['order_id', 'line_no', 'product_id', 'quantity']), rows: rows.map(([order, state]) => ({ cells: [String(order), '1', 'P7', '1'], state })) });
const line = (text, result, state) => ({ text, result, state });
const says = (text, state) => ({ text, state, plain: true });

function raceFrames(option) {
  const p = m.raceProtocols[option];
  const minaOrder = 'INSERT order 103 and its two lines';
  const tariqOrder = 'INSERT order 104 and its line';
  const start = {
    label: 'Both press Buy',
    explanation: 'One blue mug is left. Mina (order 103) and Tariq (order 104) press Buy at the same moment, and the shop runs one session for each of them.',
    lanes: [{ who: 'Mina, order 103', lines: [] }, { who: 'Tariq, order 104', lines: [] }],
    tables: [mug({ value: 1 }), mugLines([])],
  };
  if (option === 'conditional') {
    const m1 = [line(p.begin), line(p.write, 'UPDATE 1', 'new')];
    const m2 = [...m1.map(l => ({ ...l, state: undefined })), line(minaOrder, 'INSERT', 'new')];
    const m2s = m2.map(l => ({ ...l, state: undefined }));
    const t1 = [line(p.begin), line(p.write, 'waiting for Mina', 'wait')];
    return [start,
      { label: 'Mina’s update takes the mug', explanation: 'Mina’s session subtracts one only where at least one mug remains. The check and the change are one statement, and the row stays locked by her transaction once it is changed. One row matches.', lanes: [{ who: 'Mina, order 103', lines: m1 }, { who: 'Tariq, order 104', lines: [] }], tables: [mug({ value: '0 (uncommitted)', changed: true }), mugLines([])] },
      { label: 'Mina adds her order', explanation: 'Mina’s order and its lines are written, still inside her transaction. No other session can see them yet.', lanes: [{ who: 'Mina, order 103', lines: m2 }, { who: 'Tariq, order 104', lines: [] }], tables: [mug({ value: '0 (uncommitted)' }), mugLines([[103, 'pending']])] },
      { label: 'Tariq’s update waits', explanation: 'Tariq’s session runs the same conditional update. Mina’s transaction holds the mug’s row, so Tariq’s statement waits rather than reading a stock level that is about to change.', lanes: [{ who: 'Mina, order 103', lines: m2s }, { who: 'Tariq, order 104', lines: t1 }], tables: [mug({ value: '0 (uncommitted)' }), mugLines([[103, 'pending']])] },
      { label: 'Mina commits; Tariq’s update rechecks', explanation: 'When Mina commits, PostgreSQL rechecks Tariq’s condition against the committed row. Stock is now 0, so the condition fails and his update changes no rows.', lanes: [{ who: 'Mina, order 103', lines: [...m2s, line('COMMIT;', 'COMMIT', 'new')] }, { who: 'Tariq, order 104', lines: [line(p.begin), line(p.write, 'UPDATE 0', 'new')] }], tables: [mug({ value: 0, changed: true }), mugLines([[103, 'new']])] },
      { label: 'Tariq is told the mug has sold', explanation: 'Tariq’s application sees that no row changed, rolls back and tells him the mug has sold out. One mug, one order: the stock rule held.', lanes: [{ who: 'Mina, order 103', lines: [...m2s, line('COMMIT;', 'COMMIT')] }, { who: 'Tariq, order 104', lines: [line(p.begin), line(p.write, 'UPDATE 0'), line('ROLLBACK;', 'sold out', 'new')] }], tables: [mug({ value: 0 }), mugLines([[103]])], checks: [{ label: 'Mugs promised', value: '1 of 1', ok: true }] },
    ];
  }
  const rr = option === 'repeatable';
  const mRead = [line(p.begin), line(p.read, '1', 'new')];
  const tRead = [line(p.begin), line(p.read, '1', 'new')];
  const done = ls => ls.map(l => ({ ...l, state: undefined }));
  const mWrite = [...done(mRead), line(p.write, 'UPDATE 1', 'new'), line(minaOrder, 'INSERT', 'new')];
  const tWait = [...done(tRead), line(p.write, 'waiting for Mina', 'wait')];
  const frames = [start,
    { label: 'Mina reads the stock', explanation: rr ? 'Mina’s session starts a Repeatable Read transaction and reads stock 1. From now on it reads the database as it was at this moment.' : 'Mina’s session starts a transaction and reads stock 1. The application decides there is a mug to sell.', lanes: [{ who: 'Mina, order 103', lines: mRead }, { who: 'Tariq, order 104', lines: [] }], tables: [mug({ value: 1 }), mugLines([])] },
    { label: 'Tariq reads the stock', explanation: 'Tariq’s session reads stock 1 as well. Reading takes no lock, so both applications have now decided to sell the same mug.', lanes: [{ who: 'Mina, order 103', lines: done(mRead) }, { who: 'Tariq, order 104', lines: tRead }], tables: [mug({ value: 1 }), mugLines([])] },
    { label: 'Mina writes her decision', explanation: 'Mina’s application writes the stock it calculated, 0, and adds her order. Her transaction now holds the mug’s row; none of this is visible to Tariq yet.', lanes: [{ who: 'Mina, order 103', lines: mWrite }, { who: 'Tariq, order 104', lines: done(tRead) }], tables: [mug({ value: '0 (uncommitted)', changed: true }), mugLines([[103, 'pending']])] },
    { label: 'Tariq’s write waits', explanation: 'Tariq’s application writes its own calculated stock, also 0. The row is held by Mina’s transaction, so the statement waits for her to finish.', lanes: [{ who: 'Mina, order 103', lines: done(mWrite) }, { who: 'Tariq, order 104', lines: tWait }], tables: [mug({ value: '0 (uncommitted)' }), mugLines([[103, 'pending']])] },
  ];
  const mDone = [...done(mWrite), line('COMMIT;', 'COMMIT', 'new')];
  if (!rr) {
    const tGo = [...done(tRead), line(p.write, 'UPDATE 1', 'new')];
    frames.push(
      { label: 'Mina commits; Tariq’s write goes ahead', explanation: 'Mina commits. Tariq’s statement only says “set stock to 0”, and the row still exists, so it goes ahead and sets 0 again. Nothing rechecks the 1 that Tariq’s application read earlier.', lanes: [{ who: 'Mina, order 103', lines: mDone }, { who: 'Tariq, order 104', lines: tGo }], tables: [mug({ value: 0, changed: true }), mugLines([[103, 'new']])] },
      { label: 'Tariq commits a second sale', explanation: 'Tariq’s order is added and committed. Two orders now hold the one mug the shop had, and the stock column says 0 as if all were well. No statement failed and no constraint was broken.', lanes: [{ who: 'Mina, order 103', lines: done(mDone) }, { who: 'Tariq, order 104', lines: [...done(tGo), line(tariqOrder, 'INSERT', 'new'), line('COMMIT;', 'COMMIT', 'new')] }], tables: [mug({ value: 0 }), mugLines([[103], [104, 'new']])], checks: [{ label: 'Mugs promised', value: '2 of 1', ok: false }] },
    );
  } else {
    const tErr = [...done(tRead), line(p.write, 'ERROR 40001: could not serialize access due to concurrent update', 'error')];
    frames.push(
      { label: 'Mina commits; Tariq’s write is refused', explanation: 'Mina commits. Tariq’s transaction is still reading the database as it was before her change, so PostgreSQL refuses to let it overwrite a row that changed since: a serialization failure.', lanes: [{ who: 'Mina, order 103', lines: mDone }, { who: 'Tariq, order 104', lines: tErr }], tables: [mug({ value: 0, changed: true }), mugLines([[103, 'new']])] },
      { label: 'Tariq’s application retries from the start', explanation: 'The application rolls back and runs the whole transaction again. The fresh transaction reads stock 0, so this time it tells Tariq the mug has sold out. One mug, one order.', lanes: [{ who: 'Mina, order 103', lines: done(mDone) }, { who: 'Tariq, order 104', lines: [...done(tErr), line('ROLLBACK;'), line(p.begin), line(p.read, '0', 'new'), line('ROLLBACK;', 'sold out', 'new')] }], tables: [mug({ value: 0 }), mugLines([[103]])], checks: [{ label: 'Mugs promised', value: '1 of 1', ok: true }] },
    );
  }
  return frames;
}

// ------------------------------------------------------------- Figure 5
function lostFrames(option) {
  const before = {
    orders: state => ({ name: 'orders', columns: orderCols, rows: [{ cells: ['102', '2', 'paid'] }, ...(state === 'none' ? [] : [{ cells: ['103', '1', 'pending'], state: state === 'kept' ? undefined : state }])] }),
  };
  const stock = (value, changed) => ({ name: 'products', columns: productCols, rows: [{ cells: ['P7', 'Blue mug', String(value)], changed: changed ? [2] : undefined }] });
  const sent = [line('BEGIN;'), line(m.placeOrder103[1], 'UPDATE 1'), line('UPDATE teas, INSERT order 103 and its lines', 'done')];
  const done = ls => ls.map(l => ({ ...l, state: undefined }));
  const frames = [
    { label: 'Mina presses Place order', explanation: 'The shop application opens a transaction for order 103. It chose the number 103 itself before sending anything, so it can ask about this order later.', lanes: [{ who: 'Shop application', lines: [line('BEGIN;', 'BEGIN', 'new')] }, { who: 'Mina sees', lines: [says('Placing your order…')] }], tables: [stock(1), before.orders('none')] },
    { label: 'The order’s statements run', explanation: 'The conditional update takes the mug, the teas are taken from stock and the order and its lines are inserted. All of it is still uncommitted.', lanes: [{ who: 'Shop application', lines: sent.map((l, i) => ({ ...l, state: i ? 'new' : undefined })) }, { who: 'Mina sees', lines: [says('Placing your order…')] }], tables: [stock('0 (uncommitted)', true), before.orders('pending')] },
  ];
  if (option === 'replied') {
    frames.push(
      { label: 'COMMIT, and the reply arrives', explanation: 'The application sends COMMIT and receives the reply. It knows the order is stored, so it can tell Mina.', lanes: [{ who: 'Shop application', lines: [...done(sent), line('COMMIT;', 'COMMIT', 'new')] }, { who: 'Mina sees', lines: [says('Placing your order…')] }], tables: [stock(0, true), before.orders('new')] },
      { label: 'Mina is told the truth', explanation: 'The confirmation matches the database: order 103 is committed and the mug is hers. Nothing needs recovering.', lanes: [{ who: 'Shop application', lines: [...done(sent), line('COMMIT;', 'COMMIT')] }, { who: 'Mina sees', lines: [says('Order 103 confirmed', 'new')] }], tables: [stock(0), before.orders('kept')], checks: [{ label: 'What Mina was told matches the database', value: 'yes', ok: true }] },
    );
    return frames;
  }
  if (option === 'beforeCommit') {
    frames.push(
      { label: 'The connection breaks before COMMIT', explanation: 'The network drops before COMMIT is sent. The database ends the session and rolls back everything in it: no order 103, and the mug is back in stock. The application sees only a connection error.', lanes: [{ who: 'Shop application', lines: [...done(sent), line('COMMIT;', 'connection lost', 'error')] }, { who: 'Mina sees', lines: [says('Placing your order…')] }], tables: [stock(1, true), before.orders('gone')] },
      { label: 'Ask before acting again', explanation: 'The application looks up order 103 on a new connection. It is not there, so nothing happened and running the whole transaction again is safe. The retry places the order.', lanes: [{ who: 'Shop application', lines: [line(m.lookup103, '0 rows', 'new'), { text: 'Run the whole order transaction again', result: 'COMMIT', state: 'new', plain: true }] }, { who: 'Mina sees', lines: [says('Order 103 confirmed', 'new')] }], tables: [stock(0, true), before.orders('new')], checks: [{ label: 'What Mina was told matches the database', value: 'yes', ok: true }] },
    );
    return frames;
  }
  frames.push(
    { label: 'COMMIT succeeds; its reply is lost', explanation: 'The database commits order 103, then the connection breaks before the reply reaches the application. The application sees exactly the same connection error as when the break came before COMMIT, but this time the order is stored.', lanes: [{ who: 'Shop application', lines: [...done(sent), line('COMMIT;', 'connection lost', 'error')] }, { who: 'Mina sees', lines: [says('Placing your order…')] }], tables: [stock(0, true), before.orders('new')] },
    { label: 'Retry blindly, or ask first', explanation: 'Run blindly again, the order fails: the conditional update finds no mug left and the application tells Mina it has sold out, although she bought it. Looking up order 103 first finds it committed, so the application can confirm it instead.', lanes: [{ who: 'Blind retry', lines: [line(m.placeOrder103[1], 'UPDATE 0: “sold out”', 'error')] }, { who: 'Look up order 103 first', lines: [line(m.lookup103, '103 | pending', 'new'), says('Tell Mina: order 103 confirmed', 'new')] }], tables: [stock(0), before.orders('kept')], checks: [{ label: 'Blind retry tells Mina the truth', value: 'no', ok: false }, { label: 'Lookup tells Mina the truth', value: 'yes', ok: true }] },
  );
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
    frames: dueFrames,
  },
  race: {
    title: 'Two customers, one blue mug',
    kind: 'Illustrative schedule. Each protection was run as two concurrent sessions on PostgreSQL 18.6.',
    note: 'Only the blue mug’s stock and mug lines are shown; Mina’s tea line and its stock change are left out. Real sessions interleave by timing; this is the order that exposes the difference.',
    optionLabel: 'Protection',
    options: [{ value: 'read', label: 'Read, then write' }, { value: 'conditional', label: 'Conditional update' }, { value: 'repeatable', label: 'Repeatable Read' }],
    frames: raceFrames,
  },
  lost: {
    title: 'Where the connection breaks',
    kind: 'Illustrative model. The database outcomes were observed on PostgreSQL 18.6 by ending the session before and after COMMIT.',
    note: 'The figure shows the application’s view and the committed rows. It leaves out drivers, pools and timeouts, which the applications article covers.',
    optionLabel: 'What happens',
    options: [{ value: 'replied', label: 'Reply arrives' }, { value: 'beforeCommit', label: 'Breaks before COMMIT' }, { value: 'afterCommit', label: 'Breaks after COMMIT' }],
    frames: lostFrames,
  },
};
