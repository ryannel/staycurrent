// The commission's shop facts. Money is kept in minor units in this drawing.
export const customers = [
  { id: 1, name: 'Mina Shah' },
  { id: 2, name: 'Tariq Aziz' },
  { id: 3, name: 'Edda Berg' },
];
export const orders = [
  { id: 101, customer: 1, status: 'paid' },
  { id: 102, customer: 2, status: 'paid' },
  { id: 103, customer: 1, status: 'pending' },
];
export const products = [
  { id: 'P3', name: 'Green tea, 50 g', price: 450, stock: 12 },
  { id: 'P7', name: 'Blue mug', price: 2000, stock: 1 },
  { id: 'P9', name: 'Teapot', price: 3500, stock: 4 },
];
export const lines = [
  { order: 101, line: 1, product: 'P3', quantity: 1, unitPrice: 450 },
  { order: 101, line: 2, product: 'P9', quantity: 1, unitPrice: 3500 },
  { order: 102, line: 1, product: 'P7', quantity: 2, unitPrice: 2000 },
  { order: 103, line: 1, product: 'P7', quantity: 1, unitPrice: 2000 },
  { order: 103, line: 2, product: 'P3', quantity: 2, unitPrice: 450 },
];
export const payments = [
  { id: 501, order: 101, amount: 3000 },
  { id: 502, order: 101, amount: 950 },
  { id: 503, order: 102, amount: 4000 },
];
export const money = value => (value / 100).toFixed(2);
export const receipt = id => lines.filter(l => l.order === id).map(l => ({
  ...l, name: products.find(p => p.id === l.product).name,
  total: l.quantity * l.unitPrice,
}));
export const total = id => receipt(id).reduce((sum, l) => sum + l.total, 0);

// A chosen schedule illustrating the documented PostgreSQL Read Committed rule.
// This is not a SQL engine, a timing simulation or a trace from a database.
export function raceSteps(guarded) {
  const start = { stock: 1, committed: 'neither', who: 'Start', action: 'P7 has one mug left.', effect: 'Orders 103 and 104 have not committed.' };
  if (!guarded) return [start,
    { stock: 1, committed: 'neither', who: 'Mina', action: 'Reads stock: 1.', effect: 'Her application calculates 1 − 1 = 0.' },
    { stock: 1, committed: 'neither', who: 'Tariq', action: 'Reads stock: 1.', effect: 'His application also calculates 1 − 1 = 0.' },
    { stock: 0, committed: '103', who: 'Mina', action: 'Writes stock = 0; records order 103; commits.', effect: 'One mug sold. Stock is 0.' },
    { stock: 0, committed: '103 and 104', who: 'Tariq', action: 'Writes his saved value, stock = 0; records order 104; commits.', effect: 'Two mugs sold from one. Stock is still 0, so stock ≥ 0 has not been broken.' },
  ];
  return [start,
    { stock: 1, committed: 'neither', who: 'Mina', action: 'Runs the conditional UPDATE. It changes one row.', effect: 'Her transaction holds the P7 row lock. Its new stock is 0, still uncommitted.' },
    { stock: 1, committed: 'neither', who: 'Tariq', action: 'Runs the same conditional UPDATE.', effect: 'He waits for Mina’s transaction to finish.' },
    { stock: 0, committed: '103', who: 'Mina', action: 'Records order 103 and its lines; commits.', effect: 'Her stock changes and order become visible together; the P7 row lock is released.' },
    { stock: 0, committed: '103', who: 'Tariq', action: 'His UPDATE checks stock > 0 again, against the updated row.', effect: 'Stock is 0. No row matches; the UPDATE returns no row.' },
    { stock: 0, committed: '103', who: 'Tariq', action: 'The application rolls back his transaction.', effect: 'Order 104 does not commit. Only Mina bought the last mug.' },
  ];
}

export function transactionState(step, commit) {
  const before = { mug: 1, tea: 12, order: 'absent', lines: 0 };
  const changed = { mug: 0, tea: 10, order: '103 · pending', lines: 2 };
  const last = step === 4;
  return {
    visible: last && commit ? changed : before,
    working: last ? null : step >= 3 ? changed : step >= 2 ? { ...before, mug: 0, tea: 10 } : before,
    phase: last ? commit ? 'Committed' : 'Rolled back' : step ? 'Inside the transaction' : 'Before BEGIN',
  };
}
