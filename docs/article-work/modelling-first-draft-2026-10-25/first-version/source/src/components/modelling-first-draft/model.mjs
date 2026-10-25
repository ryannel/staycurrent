// One source for the illustrative shop state. No database execution is modelled.
export const customers = [[1, 'Mina Shah'], [2, 'Tariq Aziz'], [3, 'Edda Berg']];
export const products = [['P3', 'Green tea, 50 g', '4.50'], ['P7', 'Blue mug', '20.00'], ['P9', 'Teapot', '35.00']];
export const orders = [[101, 1, '12 Oct 09:30'], [102, 2, '14 Oct 16:05'], [103, 1, '20 Oct 10:15']];
export const lines = [[101, 1, 'P3', 1, '4.50'], [101, 2, 'P9', 1, '35.00'], [102, 1, 'P7', 2, '20.00'], [103, 1, 'P7', 1, '20.00'], [103, 2, 'P3', 2, '4.50']];
export const payments = [[501, 101, '30.00', 'card'], [502, 101, '9.50', 'gift card'], [503, 102, '40.00', 'card']];
export const suppliers = [['S1', 'North'], ['S2', 'Harbour']];
export const locations = [['L1', 'Town'], ['L2', 'Station']];
export const offers = [['S1', 'P3', 'L1'], ['S1', 'P7', 'L2'], ['S2', 'P3', 'L2']];
export const inventedOffer = ['S1', 'P3', 'L2'];
export const tags = ['gift', 'ceramic'];
export const laterMugPrice = '22.00';
export const pairSets = [[0, 1], [0, 2], [1, 2]].map(indices => [...new Set(offers.map(row => indices.map(i => row[i]).join('|')))].map(s => s.split('|')));
export function pairEvidence(triple) { return [[0, 1], [0, 2], [1, 2]].map((indices, i) => pairSets[i].some(pair => pair.every((v, j) => v === triple[indices[j]]))); }
export function isOffer(triple) { return offers.some(row => row.every((v, i) => v === triple[i])); }
const flat = lines.map(([order, line, product, quantity, price]) => {
  const [, customer, date] = orders.find(row => row[0] === order);
  return [order, line, date, customer, customers.find(row => row[0] === customer)[1], product, products.find(row => row[0] === product)[1], quantity, price];
});
const table = (name, key, columns, rows) => ({ name, key, columns, rows });
export const normalisationStages = [
  { explanation: 'One row per order line, carrying the order date, the customer’s current name and the product’s current name. Order 103’s date is written twice; Mina’s name four times.', tables: [table('Flattened order lines', 'Key: (order, line)', ['order', 'line', 'placed_at¹', 'customer', 'current name', 'product', 'product name', 'qty', 'unit_price'], flat)] },
  { explanation: 'Move order facts into orders. The date and customer ID now occur once per order. Each line keeps order_id, so its order can still be found.', tables: [table('orders', 'Key: order', ['order', 'customer', 'placed_at¹'], orders), table('Order lines with copied names', 'Key: (order, line)', ['order', 'line', 'current customer name', 'product', 'product name', 'qty', 'unit_price'], flat.map(r => [r[0], r[1], r[4], r[5], r[6], r[7], r[8]]))] },
  { explanation: 'Move the current customer name into customers. Orders retain customer_id; lines no longer need a customer name at all. Edda can now have a row without an order.', tables: [table('customers', 'Key: customer', ['customer', 'current name'], customers), table('orders', 'Key: order', ['order', 'customer', 'placed_at¹'], orders), table('Order lines with copied product names', 'Key: (order, line)', ['order', 'line', 'product', 'product name', 'qty', 'unit_price'], flat.map(r => [r[0], r[1], r[5], r[6], r[7], r[8]]))] },
  { explanation: 'Move the current product name into products. Each line keeps the product ID, quantity and agreed unit price. The references reconnect the facts without copying their current descriptions.', tables: [table('customers', 'Key: customer', ['customer', 'current name'], customers), table('orders', 'Key: order', ['order', 'customer', 'placed_at¹'], orders), table('products', 'Key: product', ['product', 'current name'], products.map(r => r.slice(0, 2))), table('order_items', 'Key: (order, line)', ['order', 'line', 'product', 'qty', 'unit_price'], lines)] }
];
