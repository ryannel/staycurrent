export const lines = [
  { order: 101, line: 1, product: 'P3', name: 'Tea', quantity: 1, cents: 450, day: 12, stamp: '12 Oct · 09:30', status: 'paid' },
  { order: 101, line: 2, product: 'P9', name: 'Teapot', quantity: 1, cents: 3500, day: 12, stamp: '12 Oct · 09:30', status: 'paid' },
  { order: 102, line: 1, product: 'P7', name: 'Mug', quantity: 2, cents: 4000, day: 14, stamp: '14 Oct · 16:05', status: 'paid' },
  { order: 103, line: 1, product: 'P7', name: 'Mug', quantity: 1, cents: 2000, day: 20, stamp: '20 Oct · 10:15', status: 'pending' },
  { order: 103, line: 2, product: 'P3', name: 'Tea', quantity: 2, cents: 900, day: 20, stamp: '20 Oct · 10:15', status: 'pending' },
];
export const products = ['P3', 'P7', 'P9'];
export const money = cents => (cents / 100).toFixed(2);
export const groups = split => {
  const result = new Map();
  for (const row of lines) {
    const key = split ? `${row.product} · ${row.status}` : row.product;
    if (!result.has(key)) result.set(key, { key, product: row.product, rows: [], units: 0 });
    const group = result.get(key); group.rows.push(row); group.units += row.quantity;
  }
  return [...result.values()].sort((a, b) => a.key.localeCompare(b.key));
};
export const frameIndices = (mode, current) => lines.flatMap((row, i) => {
  const included = mode === 'whole' || (mode === 'rows' ? i <= current : row.day <= lines[current].day);
  return included ? [i] : [];
});
