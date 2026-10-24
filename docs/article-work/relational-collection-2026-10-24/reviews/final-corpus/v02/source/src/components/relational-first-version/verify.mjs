// Checks the illustration's data and states. This does not execute PostgreSQL.
import assert from 'node:assert/strict';
import { customers, orders, products, lines, payments, receipt, total, transactionState, raceSteps } from './shop.mjs';

assert.equal(new Set(customers.map(c => c.id)).size, customers.length);
assert.equal(new Set(products.map(p => p.id)).size, products.length);
assert.equal(new Set(lines.map(l => `${l.order}/${l.line}`)).size, lines.length);
assert.ok(orders.every(o => customers.some(c => c.id === o.customer)));
assert.ok(lines.every(l => orders.some(o => o.id === l.order) && products.some(p => p.id === l.product)));
assert.deepEqual(orders.map(o => total(o.id)), [3950, 4000, 2900]);
assert.deepEqual(receipt(103).map(l => [l.name, l.quantity, l.unitPrice, l.total]), [
 ['Blue mug', 1, 2000, 2000], ['Green tea, 50 g', 2, 450, 900],
]);
assert.deepEqual(orders.map(o => total(o.id) - payments.filter(p => p.order === o.id).reduce((s,p) => s + p.amount, 0)), [0, 0, 2900]);
const before = { mug: 1, tea: 12, order: 'absent', lines: 0 };
const after = { mug: 0, tea: 10, order: '103 · pending', lines: 2 };
for (const commit of [false, true]) {
 for (let step = 0; step < 4; step++) assert.deepEqual(transactionState(step, commit).visible, before);
 assert.deepEqual(transactionState(4, commit).visible, commit ? after : before);
 assert.equal(transactionState(4, commit).working, null);
}
assert.deepEqual([raceSteps(false).at(-1).stock, raceSteps(false).at(-1).committed], [0, '103 and 104']);
assert.deepEqual([raceSteps(true).at(-1).stock, raceSteps(true).at(-1).committed], [0, '103']);
assert.ok(raceSteps(false).every(s => s.stock >= 0)); // The failed business rule does not make stock negative.
console.log('Illustration checks passed: shop relationships, receipt, totals, both transaction endings and both chosen race schedules. No database engine was executed.');
