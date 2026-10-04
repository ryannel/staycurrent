export const cachingProducts = [
  { id: 'mug', name: 'Blue ceramic mug', price: 18, stock: 4, version: 1 },
  { id: 'bowl', name: 'Blue cereal bowl', price: 24, stock: 3, version: 1 },
  { id: 'plate', name: 'White dinner plate', price: 16, stock: 8, version: 1 },
];
export function createCachingState() {
  return { time: 0, ttl: 5, capacity: 2, invalidate: true, available: true, source: structuredClone(cachingProducts), entries: [], reads: 0, hits: 0, last: null, message: 'The cache is empty. Read a product to create its first copy.' };
}
export function cachingStep(previous, action) {
  const s = structuredClone(previous);
  if (action.type === 'tick') s.time += 1;
  s.entries = s.entries.filter(e => e.expires > s.time);
  if (action.type === 'ttl') s.ttl = Number(action.value);
  if (action.type === 'invalidation') s.invalidate = action.value;
  if (action.type === 'read') {
    const product = s.source.find(p => p.id === action.id);
    const entry = s.available && s.entries.find(e => e.id === action.id);
    if (entry) {
      s.hits += 1; entry.used = s.reads + s.hits;
      s.last = { ...entry.value, from: 'Cache', at: s.time };
      s.message = `Cache hit for ${product.name}. ${entry.value.version === product.version ? 'The copy agrees with the catalogue.' : 'The copy is stale: the catalogue has a newer version.'}`;
    } else {
      s.reads += 1; s.last = { ...product, from: 'Catalogue', at: s.time };
      let evicted;
      if (s.available) {
        if (s.entries.length >= s.capacity) {
          s.entries.sort((a, b) => a.used - b.used); evicted = s.entries.shift();
        }
        s.entries.push({ id: product.id, value: { ...product }, expires: s.time + s.ttl, used: s.reads + s.hits });
      }
      s.message = `Catalogue read for ${product.name}. ${s.available ? `Saved a copy until time ${s.time + s.ttl}.${evicted ? ` Evicted ${evicted.value.name} to make room.` : ''}` : 'The cache is unavailable, so no copy was saved.'}`;
    }
  }
  if (action.type === 'write') {
    const p = s.source[0]; p.price = p.price === 18 ? 15 : 18; p.stock = Math.max(0, p.stock - 1); p.version += 1;
    if (s.invalidate && s.available) s.entries = s.entries.filter(e => e.id !== p.id);
    s.message = `Catalogue updated: mug price €${p.price}, stock ${p.stock}, version ${p.version}. ${s.invalidate && s.available ? 'The mug copy was invalidated.' : 'The mug copy was not invalidated.'} The last response below has not been read again.`;
  }
  if (action.type === 'tick') s.message = `Time is now ${s.time}. Expired copies have been removed; advancing time does not make a new request.`;
  if (action.type === 'outage') { s.available = !s.available; s.message = s.available ? 'The cache is reachable again. Unexpired copies remain.' : 'The cache is unreachable. Reads will go to the catalogue.'; }
  if (action.type === 'restart') { s.available = true; s.entries = []; s.message = 'The cache restarted empty. The catalogue and last response are unchanged.'; }
  if (action.type === 'ttl') s.message = `New copies will live for ${s.ttl} time steps. Existing expiry times are unchanged.`;
  if (action.type === 'invalidation') s.message = `Future catalogue writes ${s.invalidate ? 'will' : 'will not'} invalidate the mug copy. Existing copies are unchanged.`;
  return s;
}
