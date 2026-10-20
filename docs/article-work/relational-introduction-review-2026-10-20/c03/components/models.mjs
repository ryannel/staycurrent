// Small teaching models of the shop. They do not run a database. verify.mjs
// checks the rows, query results and transaction outcomes they describe
// against native PostgreSQL.
export const customers = [
  { customer_id: 1, name: 'Mina' },
  { customer_id: 2, name: 'Arun' },
];
export const orders = [
  { order_id: 101, customer_id: 1, status: 'paid', shipped_at: null },
  { order_id: 102, customer_id: 2, status: 'draft', shipped_at: null },
];
export const items = [
  { order_id: 101, product_id: 'MUG', quantity: 1, unit_price_gbp: 20 },
  { order_id: 101, product_id: 'TEA', quantity: 2, unit_price_gbp: 8 },
];
export const products = [
  { product_id: 'MUG', available: 1 },
  { product_id: 'TEA', available: 4 },
];
const nameOf = id => customers.find(customer => customer.customer_id === id).name;

export function joinedRows(keepEmpty = false) {
  return orders.flatMap(order => {
    const base = { order_id: order.order_id, customer: nameOf(order.customer_id), status: order.status };
    const matches = items.filter(item => item.order_id === order.order_id);
    return matches.length ? matches.map(item => ({ ...base, ...item })) :
      keepEmpty ? [{ ...base, product_id: null, quantity: null, unit_price_gbp: null }] : [];
  });
}
export function summaries(keepEmpty = false) {
  const rows = joinedRows(keepEmpty);
  return orders.filter(order => rows.some(row => row.order_id === order.order_id)).map(order => {
    const matches = rows.filter(row => row.order_id === order.order_id);
    return { order_id: order.order_id, customer: nameOf(order.customer_id),
      total: matches[0].product_id === null ? null : matches.reduce((sum, row) => sum + row.quantity * row.unit_price_gbp, 0),
      joined_count: matches.length, item_count: matches.filter(row => row.product_id !== null).length };
  });
}

// Figure 2: one buyer's order 103, saved by separate commits or one transaction.
export function orderStages(together = false, fail = true) {
  return ['Start', 'Insert order', 'Insert item', fail ? 'Request fails' : 'Reserve stock',
    fail ? (together ? 'ROLLBACK' : 'Earlier commits stand') : (together ? 'COMMIT' : 'All three committed')];
}
function orderFacts(step, together, fail) {
  const before = { order: false, item: false, stock: 1 };
  const interrupted = fail && step >= 3;
  const working = interrupted && together ? { ...before } : {
    order: step >= 1, item: step >= 2, stock: !fail && step >= 3 ? 0 : 1,
  };
  const visible = together && step < 4 ? { ...before } : { ...working };
  return { working, visible };
}
const changes = (now, then) => Object.keys(now).filter(key => now[key] !== then[key]);
export function orderState(step, together = false, fail = true) {
  const { working, visible } = orderFacts(step, together, fail);
  const previous = step === 0 ? { working, visible } : orderFacts(step - 1, together, fail);
  const message = [
    'One mug is available. The new order, 103, does not exist.',
    together ? 'The application inserts order 103. Its own transaction can see it; another session cannot.' : 'The first statement commits order 103. Another session can already see it.',
    together ? 'The application inserts its MUG item. Both new rows are still uncommitted.' : 'The second statement commits the item. Mugs available is still 1.',
    fail ? (together ? 'The request fails before reserving the mug. Its transaction is rolled back, so the order and item disappear from its own view too.' : 'The request fails before reserving the mug. The order and item were already committed, so they stay.') :
      together ? 'The application reserves the mug: available becomes 0 inside this transaction. Another session still sees 1.' : 'The third statement commits the reservation. Available falls to 0, and the three facts now agree.',
    fail ? (together ? 'Nothing from this attempt remains. The mug is still available to the next buyer.' : 'Order 103 and its item remain, but no mug was reserved: one mug is available and also promised to order 103. The application must repair the partial attempt.') :
      together ? 'COMMIT makes the order, item and reservation visible to every session at once.' : 'All three separate commits succeeded on this run. A failure between any two of them was still possible.',
  ][step];
  const inconsistent = !together && fail && step === 4;
  return { working, visible, message, inconsistent,
    changed: { working: changes(working, previous.working), visible: changes(visible, previous.visible) } };
}

// Figure 3: two buyers and the last mug, at PostgreSQL's default Read Committed level.
// Each row is one moment: what Mina's and Arun's transactions do, and the committed stock.
export function race(conditional = false) {
  const rows = conditional ? [
    { mina: 'UPDATE … WHERE available >= 1: one row changed and returned, with available = 0; not committed, and the row is now locked', arun: '', stock: '1' },
    { mina: '', arun: 'Same UPDATE reaches the locked MUG row and waits for Mina’s transaction to end', stock: '1' },
    { mina: 'COMMIT: order 103 accepted', arun: '(still waiting)', stock: '0' },
    { mina: '', arun: 'Rechecks available >= 1 against 0: no row changed, none returned. ROLLBACK: order 104 refused', stock: '0' },
  ] : [
    { mina: 'SELECT available: reads 1', arun: '', stock: '1' },
    { mina: '', arun: 'SELECT available: reads 1', stock: '1' },
    { mina: 'Computes 1 − 1 = 0. UPDATE … SET available = 0, then COMMIT: order 103 accepted', arun: '', stock: '0' },
    { mina: '', arun: 'Computes 1 − 1 = 0. UPDATE … SET available = 0, then COMMIT: order 104 accepted', stock: '0' },
  ];
  return { rows, accepted: conditional ? [103] : [103, 104], available: 0 };
}
