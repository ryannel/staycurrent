import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { closure, project } from '../src/components/relational-rebuild-normalisation/model.mjs';

const attributes = ['order_id', 'line_no', 'customer_id', 'customer_name'];
const rules = [[['order_id'], ['customer_id']], [['customer_id'], ['customer_name']]];
const components = [['order_id', 'line_no', 'customer_id'], ['order_id', 'customer_name']];
const subsets = xs => Array.from({length:2 ** xs.length}, (_, n) => xs.filter((_, i) => n & (1 << i)));
const localRules = components.map(part => subsets(part).flatMap(left =>
  closure(left, rules).filter(a => part.includes(a) && !left.includes(a)).map(a => [left, [a]])
));
const unionRules = localRules.flat();
const intersection = components[0].filter(a => components[1].includes(a));
const intersectionClosure = closure(intersection, rules);
assert.deepEqual([...new Set(components.flat())].sort(), [...attributes].sort());
assert(components[1].every(a => intersectionClosure.includes(a)));
const customerLocalClosure = closure(['customer_id'], unionRules);
assert(!customerLocalClosure.includes('customer_name'));
assert(closure(['customer_id'], rules).includes('customer_name'));

const satisfies = (rows, columns, dependencies) => dependencies.every(([left, right]) =>
  rows.every(a => rows.every(b => !left.every(x => a[columns.indexOf(x)] === b[columns.indexOf(x)]) ||
    right.every(x => a[columns.indexOf(x)] === b[columns.indexOf(x)])))
);
const join = (left, right) => left.flatMap(([order, line, customer]) =>
  right.filter(([otherOrder]) => otherOrder === order).map(([, name]) => [order, line, customer, name])
);
const canonical = rows => rows.map(r => JSON.stringify(r)).sort();
// Both line numbers survive a round trip from a legal original relation.
const original = [[101, 1, 1, 'Mina Shah'], [103, 1, 1, 'Mina Shah'], [103, 2, 1, 'Mina Shah']];
assert(satisfies(original, attributes, rules));
const projections = [project(original, [0, 1, 2]), project(original, [0, 3])];
const reconstructed = join(...projections);
assert.deepEqual(canonical(reconstructed), canonical(original));
assert.deepEqual(reconstructed.filter(r => r[0] === 103).map(r => r[1]), [1, 2]);

// A hypothetical inconsistent correction passes every projected local FD.
// This is an invalid proposed state, not a new shop fact.
const locallyValid = [projections[0], [[101, 'Mina Shah'], [103, 'Mina Patel']]];
locallyValid.forEach((rows, i) => assert(satisfies(rows, components[i], localRules[i])));
const invalidJoin = join(...locallyValid);
assert(satisfies(invalidJoin, attributes, [rules[0]]));
assert(!satisfies(invalidJoin, attributes, [rules[1]]));
const result = {
  status: 'passed',
  kind: 'Focused set-based relational witness, not an engine observation or exhaustive proof',
  attributes, rules, components, localRules,
  proof: {coverage: true, intersection, intersectionClosure, secondComponentDetermined: true},
  nonPreservation: {customerLocalClosure, customerNameNotReached: true},
  legalRoundTrip: {original, projections, reconstructed},
  nonPreservationWitness: {locallyValid, invalidJoin, localDependenciesPass: true, customerNameDependencyPasses: false},
};
await writeFile(new URL('./repair-lossless-alternative-results.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({status: result.status, components, intersectionClosure, customerLocalClosure, retainedLines: [1, 2]}));
