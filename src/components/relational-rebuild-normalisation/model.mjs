export const lineRules = [
  [['order_id', 'line_no'], ['product_id', 'quantity', 'unit_price']],
  [['order_id'], ['customer_id']],
  [['customer_id'], ['customer_name']],
];
export const lineAttributes = ['order_id', 'line_no', 'product_id', 'quantity', 'unit_price', 'customer_id', 'customer_name'];
export const adviceAttributes = ['customer_id', 'tea_style', 'advisor_id'];
export const adviceRules = [[['advisor_id'], ['tea_style']], [['customer_id', 'tea_style'], ['advisor_id']]];
export const advice = [[1, 'green', 'A1'], [2, 'green', 'A2']];
export const offers = [['S1', 'P7', 'North'], ['S1', 'P3', 'South'], ['S2', 'P7', 'South']];
export const memberships = [['P7', 'gift', 'S1'], ['P7', 'gift', 'S2'], ['P7', 'ceramic', 'S1'], ['P7', 'ceramic', 'S2']];
export function closure(seed, rules) {
  const known = new Set(seed);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [left, right] of rules) if (left.every(a => known.has(a))) {
      for (const a of right) if (!known.has(a)) { known.add(a); changed = true; }
    }
  }
  return [...known];
}
export const project = (rows, columns) => [...new Map(rows.map(row => {
  const value = columns.map(i => row[i]);
  return [JSON.stringify(value), value];
})).values()];
export function pairwiseJoin(rows) {
  const sp = project(rows, [0, 1]), sr = project(rows, [0, 2]), pr = project(rows, [1, 2]);
  return sp.flatMap(([s, p]) => sr.filter(([s2]) => s2 === s).map(([, r]) => [s, p, r]))
    .filter(([, p, r]) => pr.some(([p2, r2]) => p2 === p && r2 === r));
}
