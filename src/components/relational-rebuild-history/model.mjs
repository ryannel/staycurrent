export const clocks = {
  recorded: '2026-10-21 12:00:00+00',
  corrected: '2026-10-24 09:00:00+00',
  originalBoundary: '2026-10-22 00:00:00+00',
  correctedBoundary: '2026-10-21 00:00:00+00',
};
export const assertions = [
  { id: 1, price: '20.00', effectiveFrom: null, effectiveTo: clocks.originalBoundary, recordedFrom: clocks.recorded, recordedTo: clocks.corrected },
  { id: 2, price: '22.00', effectiveFrom: clocks.originalBoundary, effectiveTo: null, recordedFrom: clocks.recorded, recordedTo: clocks.corrected },
  { id: 3, price: '20.00', effectiveFrom: null, effectiveTo: clocks.correctedBoundary, recordedFrom: clocks.corrected, recordedTo: null },
  { id: 4, price: '22.00', effectiveFrom: clocks.correctedBoundary, effectiveTo: null, recordedFrom: clocks.corrected, recordedTo: null },
];
export const instants = [
  { value: '2026-10-20 10:15:00+00', label: '20 Oct 10:15 · order 103', position: 14.24 },
  { value: '2026-10-21 00:00:00+00', label: '21 Oct 00:00 · corrected boundary', position: 33.333 },
  { value: '2026-10-21 12:00:00+00', label: '21 Oct 12:00', position: 50 },
  { value: '2026-10-22 00:00:00+00', label: '22 Oct 00:00 · original boundary', position: 66.667 },
];
export const records = [
  { value: '2026-10-23 12:00:00+00', label: '23 Oct 12:00 · before correction' },
  { value: clocks.corrected, label: '24 Oct 09:00 · correction recorded' },
];
const contains = (from, to, at) => (!from || Date.parse(from) <= Date.parse(at)) && (!to || Date.parse(at) < Date.parse(to));
export const answer = (effective, recorded) => assertions.filter(row => contains(row.effectiveFrom, row.effectiveTo, effective) && contains(row.recordedFrom, row.recordedTo, recorded));
const literal = value => value ? `'${value}'` : 'NULL';
export const schemaSql = `CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TEMP TABLE price_history (
  assertion_id integer PRIMARY KEY,
  product_id text NOT NULL,
  price numeric(8,2) NOT NULL CHECK (price >= 0),
  effective_during tstzrange NOT NULL,
  recorded_during tstzrange NOT NULL,
  CHECK (NOT isempty(effective_during)),
  CHECK (NOT isempty(recorded_during)),
  EXCLUDE USING gist (
    product_id WITH =,
    effective_during WITH &&,
    recorded_during WITH &&
  )
);`;
export const rowsSql = `INSERT INTO price_history VALUES\n` + assertions.map(row => `  (${row.id}, 'P7', ${row.price},\n   tstzrange(${literal(row.effectiveFrom)}, ${literal(row.effectiveTo)}, '[)'),\n   tstzrange(${literal(row.recordedFrom)}, ${literal(row.recordedTo)}, '[)'))`).join(',\n') + ';';
export const currentQuery = `SELECT assertion_id, price
FROM price_history
WHERE product_id = 'P7'
  AND effective_during @> timestamptz '2026-10-21 12:00+00'
  AND upper_inf(recorded_during);
-- assertion_id | price
--            4 | 22.00`;
export const earlierQuery = `SELECT assertion_id, price
FROM price_history
WHERE product_id = 'P7'
  AND effective_during @> timestamptz '2026-10-21 12:00+00'
  AND recorded_during @> timestamptz '2026-10-23 12:00+00';
-- assertion_id | price
--            1 | 20.00`;
export const deletionSteps = [
  { statuses: ['Scope agreed', 'In scope', 'In scope', 'In scope', 'Plan recorded'], explanation: 'Suppose an approved policy decision requires removal of customer 1’s profile, its earlier versions, an invoice PDF and a search copy. The backup action is recorded too. This drawing does not decide what the shop is entitled to retain.' },
  { statuses: ['Removed · verified', 'Removed · verified', 'Pending', 'Pending', 'Restricted · expiry pending'], explanation: 'The profile and its retained versions are removed in the database. Work to remove the PDF and search copy is durably recorded. Those external copies still exist: the request is pending.' },
  { statuses: ['Removed · verified', 'Removed · verified', 'Removed · verified', 'Failed · retry due', 'Restricted · expiry pending'], explanation: 'The PDF removal is verified, but the search service failed. Its copy still needs attention. A failed destination keeps the request open even though the database work succeeded.' },
  { statuses: ['Removed · verified', 'Removed · verified', 'Removed · verified', 'Removed · verified', 'Restricted · expiry pending'], explanation: 'A retry removes the search copy and verification confirms it. The online destinations in this scope are complete. The backup expiry is still outstanding, with controls preventing the data returning to ordinary use.' },
  { statuses: ['Removed · verified', 'Removed · verified', 'Removed · verified', 'Removed · verified', 'Expiry verified'], explanation: 'Later, expiry of the affected backup copies is verified under the agreed policy. The recorded scope can now close. Keep only the completion evidence and recovery safeguards that the policy permits, each with its own retention rule.' },
];
