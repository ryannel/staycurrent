export const graphNodes = [
  { id: 'inventory', name: 'Inventory', x: 65, y: 190 },
  { id: 'checkout', name: 'Checkout', x: 215, y: 95 },
  { id: 'warehouse', name: 'Warehouse', x: 215, y: 285 },
  { id: 'storefront', name: 'Storefront', x: 365, y: 50 },
  { id: 'returns', name: 'Returns', x: 365, y: 195 },
  { id: 'reports', name: 'Reports', x: 365, y: 335 },
  { id: 'admin', name: 'Admin', x: 515, y: 100 },
  { id: 'email', name: 'Email', x: 515, y: 290 },
];
const baseEdges = [
  ['checkout', 'inventory', true], ['warehouse', 'inventory', true],
  ['storefront', 'checkout', true], ['returns', 'warehouse', true],
  ['reports', 'warehouse', false], ['email', 'checkout', false],
  ['admin', 'storefront', true], ['warehouse', 'returns', true],
];
const extraEdges = [['storefront', 'warehouse', true], ['reports', 'checkout', true], ['admin', 'returns', true], ['email', 'reports', false]];
export function graphEdges(dense = false) { return [...baseEdges, ...(dense ? extraEdges : [])].map(([from, to, required], i) => ({ id: `e${i}`, from, to, required })); }
export function graphStart({ start = 'inventory', limit = 3, dense = false, requiredOnly = true } = {}) {
  if (!graphNodes.some(n => n.id === start) || !Number.isInteger(limit) || limit < 1 || limit > 4) throw new Error('Invalid query');
  return { start, limit, dense, requiredOnly, depth: 0, frontier: [start], visited: [start], paths: { [start]: [start] }, inspected: [], done: false, stopReason: null };
}
export function graphStep(state) {
  if (state.done) return structuredClone(state);
  const next = structuredClone(state);
  const edges = graphEdges(state.dense);
  const incoming = new Map(graphNodes.map(n => [n.id, edges.filter(e => e.to === n.id)]));
  const visited = new Set(next.visited);
  const frontier = [];
  for (const target of state.frontier) {
    for (const edge of incoming.get(target)) {
      const accepted = !state.requiredOnly || edge.required;
      const seen = visited.has(edge.from);
      next.inspected.push({ ...edge, depth: state.depth + 1, decision: !accepted ? 'optional' : seen ? 'seen' : 'new' });
      if (accepted && !seen) {
        visited.add(edge.from); frontier.push(edge.from);
        next.paths[edge.from] = [edge.from, ...state.paths[target]];
      }
    }
  }
  next.depth++; next.frontier = frontier; next.visited = [...visited];
  next.stopReason = frontier.length === 0 ? 'frontier-exhausted' : next.depth >= next.limit ? 'hop-limit' : null;
  next.done = next.stopReason !== null;
  return next;
}
export function graphRun(options) { let s = graphStart(options); while (!s.done) s = graphStep(s); return s; }
