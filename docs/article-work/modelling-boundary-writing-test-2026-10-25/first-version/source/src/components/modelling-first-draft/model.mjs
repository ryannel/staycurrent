// Illustrative relational facts, not an engine trace or a new shop snapshot.
export const customers = [
  { id: 1, name: 'Mina Shah' }, { id: 2, name: 'Tariq Aziz' }, { id: 3, name: 'Edda Berg' },
];
export const products = [
  { id: 'P3', name: 'Green tea, 50 g', price: 4.5 },
  { id: 'P7', name: 'Blue mug', price: 20 },
  { id: 'P9', name: 'Teapot', price: 35 },
];
export const orders = [
  { id: 101, customer: 1, placed: '12 Oct 09:30', status: 'paid' },
  { id: 102, customer: 2, placed: '14 Oct 16:05', status: 'paid' },
  { id: 103, customer: 1, placed: '20 Oct 10:15', status: 'pending' },
];
export const lines = [
  { order: 101, line: 1, product: 'P3', quantity: 1, price: 4.5 },
  { order: 101, line: 2, product: 'P9', quantity: 1, price: 35 },
  { order: 102, line: 1, product: 'P7', quantity: 2, price: 20 },
  { order: 103, line: 1, product: 'P7', quantity: 1, price: 20 },
  { order: 103, line: 2, product: 'P3', quantity: 2, price: 4.5 },
];
export const payments = [
  { id: 501, order: 101, amount: 30, method: 'card' },
  { id: 502, order: 101, amount: 9.5, method: 'gift card' },
  { id: 503, order: 102, amount: 40, method: 'card' },
];
export const offers = [['S1', 'P7', 'South'], ['S1', 'P3', 'North'], ['S2', 'P7', 'North']];
export const tags = ['blue', 'gift'];
export const suppliers = ['S1', 'S2'];
export const laterMugPrice = 22;
export const money = n => n.toFixed(2);
export const total = order => lines.filter(l => l.order === order).reduce((sum, l) => sum + l.quantity * l.price, 0);
export const pairs = (rows, a, b) => [...new Map(rows.map(r => [JSON.stringify([r[a], r[b]]), [r[a], r[b]]])).values()];
export function reconstructedOffers() {
  const sp = pairs(offers, 0, 1), sl = pairs(offers, 0, 2), pl = pairs(offers, 1, 2);
  return sp.flatMap(([s, p]) => sl.filter(([s2]) => s2 === s).filter(([, l]) => pl.some(([p2, l2]) => p === p2 && l === l2)).map(([, l]) => [s, p, l]));
}

export const explanations = {
  normalise: [
    'Four order lines, each carrying order, customer and current product facts. The two rows of each order repeat its date; all four repeat Mina’s name.',
    'Move facts determined by order_id to orders. The lines keep order_id as their reference. Mina’s name is still copied into both order rows.',
    'Move the current name to customers, keyed by customer_id. Each order keeps the customer reference, so either order leads to the same name.',
    'Move current product names and catalogue prices to products. Each line keeps its product reference, quantity and agreed unit_price. The associations still belong to the numbered lines.',
  ],
  offers: [
    'Three complete offers. S1 offers P7 to South; it does not offer P7 to North. Each row states all three participants together.',
    'Project the offers into three lists of pairs. Each pair is true somewhere in the original offers, but the lists no longer say which three belong together.',
    'Try S1, P7, North. S1–P7 appears in the first list, S1–North in the second, and P7–North in the third. Every pair passes, although the complete offer was never present.',
    'Putting the pairs together recovers the three original offers and invents a fourth. Keeping the three keys together preserves the missing distinction.',
  ],
};

export const paymentTotal = order => payments.filter(p => p.order === order).reduce((sum, p) => sum + p.amount, 0);
export const linePaymentRows = order => lines.filter(l => l.order === order).flatMap(line => payments.filter(p => p.order === order).map(payment => ({ line, payment })));
export const wrongJoinedTotals = order => linePaymentRows(order).reduce((sum, r) => ({ lines: sum.lines + r.line.quantity * r.line.price, payments: sum.payments + r.payment.amount }), { lines: 0, payments: 0 });
export const repricedTotal = order => lines.filter(l => l.order === order).reduce((sum, l) => sum + l.quantity * (l.product === 'P7' ? laterMugPrice : products.find(p => p.id === l.product).price), 0);
