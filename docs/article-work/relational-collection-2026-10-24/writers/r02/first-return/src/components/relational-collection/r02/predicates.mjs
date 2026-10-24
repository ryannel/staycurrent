// A small model of scalar SQL predicates, not a database execution engine.
export const choices = [
  { id: 'equals', label: "note = ''", sql: "delivery_note = ''", explain: 'The empty string equals empty text. With NULL, equality is unknown, so order 103 does not pass WHERE.' },
  { id: 'different', label: "note <> ''", sql: "delivery_note <> ''", explain: 'Order 101 has known non-empty text. Order 103 is still unknown: <> does not turn missing text into non-empty text.' },
  { id: 'not', label: "NOT (note = '')", sql: "NOT (delivery_note = '')", explain: 'NOT changes true to false and false to true. Unknown stays unknown, so this selects the same row as <>.' },
  { id: 'missing', label: 'note IS NULL', sql: 'delivery_note IS NULL', explain: 'IS NULL tests for the missing-value marker itself. Only order 103 passes; empty text on order 102 is a value.' },
  { id: 'include', label: "note <> '' OR note IS NULL", sql: "delivery_note <> '' OR delivery_note IS NULL", explain: 'For order 103, unknown OR true is true. This policy includes missing notes alongside known non-empty ones.' },
  { id: 'distinct', label: "note IS DISTINCT FROM ''", sql: "delivery_note IS DISTINCT FROM ''", explain: 'IS DISTINCT FROM treats NULL as comparable for this test. NULL differs from empty text, so orders 101 and 103 pass.' },
];
const eqEmpty = value => value === null ? null : value === '';
const not = value => value === null ? null : !value;
export function evaluate(id, value) {
  if (id === 'equals') return eqEmpty(value);
  if (id === 'different' || id === 'not') return not(eqEmpty(value));
  if (id === 'missing') return value === null;
  if (id === 'include' || id === 'distinct') return value === null || value !== '';
  throw new Error(`Unknown predicate: ${id}`);
}
export const truthLabel = value => value === null ? 'unknown' : value ? 'true' : 'false';
