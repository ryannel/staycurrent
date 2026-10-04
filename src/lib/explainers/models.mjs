export const fields = ['Shop', 'Time', 'Country', 'Event', 'User', 'Payload'];

// The essay, both read models, and the query results share these page views.
const countries = ['UK', 'Sweden', 'Germany', 'UK', 'Sweden', 'UK', 'Sweden', 'Germany'];
const products = ['sweater', 'blue-mug', 'book', 'plant'];
export const records = Array.from({ length: 16 }, (_, id) => ({
  id, tenant: 'ABCD'[id % 4], country: countries[id % 8],
  values: ['ABCD'[id % 4], `09:41:${String(11 + id).padStart(2, '0')}`, countries[id % 8], 'Page view', `visitor_${41 + id}`, `/products/${products[id % 4]}`],
}));
export const featuredRecord = 1;
export function countryReport(rows = records, shop = 'all') {
  const counts = new Map();
  for (const row of rows.filter(r => shop === 'all' || r.tenant === shop)) {
    const key = `${row.tenant}:${row.country}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([key, views]) => {
    const [shop, country] = key.split(':');
    return { shop, country, views };
  });
}

// Equal-sized cells and eight-cell pages are deliberate teaching assumptions.
export function scanModel(layout, selected) {
  const cells = Array.from({ length: 96 }, (_, address) => {
    const field = layout === 'rows' ? address % 6 : Math.floor(address / 16);
    const row = layout === 'rows' ? Math.floor(address / 6) : address % 16;
    return { field, row, value: records[row].values[field], needed: selected.includes(field) };
  });
  const pages = Array.from({ length: 12 }, (_, i) => {
    const values = cells.slice(i * 8, i * 8 + 8);
    return { values, read: values.some((v) => v.needed) };
  });
  return { pages, read: pages.filter((p) => p.read).length, useful: cells.filter((c) => c.needed).length };
}

export function pruningModel(sorted, tenant) {
  const rows = [...records];
  if (sorted) rows.sort((a, b) => a.tenant.localeCompare(b.tenant) || a.id - b.id);
  const blocks = Array.from({ length: 4 }, (_, i) => {
    const values = rows.slice(i * 4, i * 4 + 4);
    const keys = values.map((r) => r.tenant).sort();
    const read = tenant === 'all' || (tenant >= keys[0] && tenant <= keys[3]);
    return { values, min: keys[0], max: keys[3], read };
  });
  return { blocks, read: blocks.filter((b) => b.read).length, matches: rows.filter((r) => tenant === 'all' || r.tenant === tenant).length };
}

export function insertBatch(parts, batch) { return [...parts, batch]; }
export function mergeSmallest(parts) {
  if (parts.length < 2) return { parts: [...parts], rewritten: 0 };
  const next = [...parts].sort((a, b) => a - b);
  const rewritten = next.shift() + next.shift();
  return { parts: [...next, rewritten], rewritten };
}

// Two data replicas, one write, and an idealised logical clock. No elections.
export function replicationModel(time, delay, waitForReplica, failedAt = null) {
  const copied = time >= delay && (failedAt === null || failedAt >= delay);
  const alive = failedAt === null || time < failedAt;
  const acknowledged = waitForReplica ? copied : true;
  return { copied, alive, acknowledged, lost: !alive && !copied, copies: Number(alive) + Number(copied) };
}
