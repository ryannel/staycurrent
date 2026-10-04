export function checkoutStart(policy = 'unsafe') {
  if (!['unsafe', 'guarded'].includes(policy)) throw new Error('Unknown policy');
  return { policy, stock: 1, orders: [], lock: null, buyers: { A: { phase: 'new', read: null, staged: null }, B: { phase: 'new', read: null, staged: null } }, message: 'One blue mug remains. Both buyers have started a transaction.' };
}

export function checkoutStep(state, buyer, action = 'next') {
  if (!['A', 'B'].includes(buyer)) throw new Error('Unknown buyer');
  const next = structuredClone(state);
  const tx = next.buyers[buyer];
  if (['committed', 'rejected', 'aborted'].includes(tx.phase)) return next;
  if (action === 'abort') {
    if (next.lock === buyer) next.lock = null;
    tx.phase = 'aborted'; tx.staged = null;
    next.message = `${buyer} rolls back. Its stock change and order are discarded together.`;
  } else if (tx.phase === 'new') {
    tx.read = next.stock; tx.phase = 'read';
    next.message = `${buyer} reads committed stock ${tx.read}. An ordinary SELECT does not reserve the mug.`;
  } else if (tx.phase === 'read') {
    if (next.lock && next.lock !== buyer) {
      next.message = `${buyer} waits: ${next.lock} holds the stock row's write lock. Commit or roll back ${next.lock}, then advance ${buyer} again.`;
    } else if ((next.policy === 'guarded' ? next.stock : tx.read) <= 0) {
      tx.phase = 'rejected';
      next.message = `${buyer} finds no stock under its policy. It creates no order.`;
    } else {
      next.lock = buyer;
      tx.staged = (next.policy === 'guarded' ? next.stock : tx.read) - 1;
      tx.phase = 'written';
      next.message = `${buyer} stages stock ${tx.staged} and an order. Other readers still see committed stock ${next.stock}.`;
    }
  } else if (tx.phase === 'written') {
    next.stock = tx.staged; next.orders.push(buyer); next.lock = null;
    tx.phase = 'committed'; tx.staged = null;
    next.message = `${buyer} commits: its order and stock change become visible together.${next.orders.length > 1 ? ' Two orders now claim the one mug. Stock never went negative.' : ''}`;
  }
  return next;
}

export const catalogueNames = ['Blue mug', 'Tea bowl', 'Small plate', 'Tall jug', 'Serving dish', 'Sugar pot', 'Milk jug', 'Soup bowl'];
export function catalogueStart(mode = 'embedded', count = 3) {
  if (!['embedded', 'reference'].includes(mode) || !Number.isInteger(count) || count < 2 || count > 8) throw new Error('Invalid catalogue');
  return { mode, source: 'Harbour Clay', products: catalogueNames.slice(0, count).map((name, i) => ({ id: i + 1, name, brand: mode === 'embedded' ? 'Harbour Clay' : null })), writes: 0, renamed: false };
}
export function catalogueRename(state) {
  if (state.renamed) return structuredClone(state);
  const next = structuredClone(state);
  next.source = 'Harbour Studio'; next.renamed = true; next.writes++;
  return next;
}
export function cataloguePropagate(state) {
  const next = structuredClone(state);
  if (next.mode === 'reference') return next;
  const product = next.products.find(p => p.brand !== next.source);
  if (product) { product.brand = next.source; next.writes++; }
  return next;
}
export function catalogueRead(state, id) {
  const product = state.products.find(p => p.id === id);
  if (!product) throw new Error('Unknown product');
  const brand = state.mode === 'embedded' ? product.brand : state.source;
  return { name: product.name, brand, documents: state.mode === 'embedded' ? 1 : 2, stale: brand !== state.source };
}
export function catalogueStale(state) { return state.mode === 'embedded' ? state.products.filter(p => p.brand !== state.source).length : 0; }
