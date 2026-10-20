// Small teaching models. These do not run a database or model concurrent buyers.
export const orders = [
  { order_id: 101, customer: 'Mina', status: 'paid' },
  { order_id: 102, customer: 'Arun', status: 'draft' },
];
export const items = [
  { order_id: 101, product_id: 'MUG', quantity: 1, unit_price_gbp: 20 },
  { order_id: 101, product_id: 'TEA', quantity: 2, unit_price_gbp: 8 },
];
export function joinedRows(keepEmpty = false) {
  return orders.flatMap(order => {
    const matches = items.filter(item => item.order_id === order.order_id);
    return matches.length ? matches.map(item => ({ ...order, ...item })) :
      keepEmpty ? [{ ...order, product_id: null, quantity: null, unit_price_gbp: null }] : [];
  });
}
export function summaries(keepEmpty = false) {
  const rows = joinedRows(keepEmpty);
  return orders.filter(order => rows.some(row => row.order_id === order.order_id)).map(order => {
    const matches = rows.filter(row => row.order_id === order.order_id);
    return { order_id: order.order_id, customer: order.customer,
      total: matches[0].product_id === null ? null : matches.reduce((sum, row) => sum + row.quantity * row.unit_price_gbp, 0),
      joined_count: matches.length, item_count: matches.filter(row => row.product_id !== null).length };
  });
}
export function orderState(step, together = false, fail = true) {
  const before = { order: false, item: false, stock: 1 };
  const interrupted = fail && step >= 3;
  const working = interrupted && together ? { ...before } : {
    order: step >= 1, item: step >= 2, stock: !fail && step >= 3 ? 0 : 1,
  };
  const visible = together && step < 4 ? { ...before } : { ...working };
  const message = [
    'One mug is available. The new order, 103, does not exist.',
    together ? 'The application inserts order 103. Its own transaction can see it; a new reader cannot.' : 'The first statement commits order 103. A new reader can already see it.',
    together ? 'The application inserts its MUG item. Both new rows are still uncommitted.' : 'The second statement commits the item. The available-stock count is still 1.',
    fail ? (together ? 'The request fails before reserving stock. Its transaction is rolled back.' : 'The request fails before reserving stock. Earlier statements have already committed.') :
      together ? 'The application reserves the mug: stock becomes 0 inside this transaction.' : 'The third statement commits the stock change. The three facts now agree.',
    fail ? (together ? 'Nothing from this attempt remains. The mug is still available.' : 'Order and item remain, but no mug was reserved. The application must repair the partial attempt.') :
      together ? 'COMMIT publishes the order, item and stock change together.' : 'All three separate commits succeeded on this run. Failure between them was still possible.',
  ][step];
  return { working, visible, message, interrupted };
}
