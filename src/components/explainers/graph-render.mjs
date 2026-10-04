import { graphNodes, graphEdges } from '../../lib/explainers/graph-model.mjs';
export function graphName(id) { return graphNodes.find(n => n.id === id).name; }
export function graphProgress(state) {
  if (state.stopReason === 'frontier-exhausted') return 'Frontier exhausted: no services remain to expand. All callers reachable under this filter have been checked.';
  if (state.stopReason === 'hop-limit') return `Stopped at the ${state.limit}-hop limit. Unexpanded frontier: ${state.frontier.map(graphName).join(', ')}. Callers beyond this bound have not been checked.`;
  return `Next frontier: ${state.frontier.map(graphName).join(', ')}.`;
}
export function graphDiagram(state) {
  const nodes = new Map(graphNodes.map(n => [n.id, n]));
  return `<svg class="graph-picture" viewBox="0 0 580 390" aria-hidden="true"><defs><marker id="graph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><polygon points="0,0 10,5 0,10" fill="var(--color-text-secondary)"/></marker></defs>${graphEdges(state.dense).map(e => {
    const a = nodes.get(e.from), b = nodes.get(e.to);
    const dx = b.x-a.x, dy = b.y-a.y, len = Math.hypot(dx,dy);
    const sx = a.x+dx/len*25, sy = a.y+dy/len*25, ex=b.x-dx/len*28, ey=b.y-dy/len*28;
    const bend = (e.from === 'returns' && e.to === 'warehouse') || (e.from === 'warehouse' && e.to === 'returns') ? 20 : e.from === 'email' && e.to === 'checkout' ? 80 : 0;
    const mx=(sx+ex)/2-dy/len*bend, my=(sy+ey)/2+dx/len*bend;
    const event = state.inspected.find(i => i.id === e.id);
    return `<path d="M${sx},${sy} Q${mx},${my} ${ex},${ey}" class="${!e.required ? 'graph-optional' : ''} ${event ? event.decision === 'optional' ? 'graph-examined' : 'graph-followed' : ''}" marker-end="url(#graph-arrow)"/>`;
  }).join('')}${graphNodes.map(n => `<g class="${state.visited.includes(n.id) ? 'graph-visited' : ''} ${n.id === state.start ? 'graph-start' : ''}"><circle cx="${n.x}" cy="${n.y}" r="23"/><text x="${n.x}" y="${n.y+6}">${n.id === state.start ? '×' : state.visited.includes(n.id) ? '✓' : '·'}</text><text x="${n.x}" y="${n.y+47}">${n.name}</text></g>`).join('')}</svg>`;
}
export function graphResult(state) {
  const found = state.visited.filter(id => id !== state.start);
  return `<div class="lab-stats"><div><strong>${state.inspected.length}</strong><span>Relationships examined</span></div><div><strong>${state.inspected.filter(e => e.decision !== 'optional').length}</strong><span>Relationships followed</span></div><div><strong>${found.length}</strong><span>Matched services</span></div></div><p class="graph-query">${graphName(state.start)} is the failed service. ${state.depth === 0 ? 'The start node is found; no relationships examined yet.' : `Expanded ${state.depth} ${state.depth === 1 ? 'layer' : 'layers'}.`} ${graphProgress(state)}</p>${graphDiagram(state)}<div class="graph-legend"><span><i></i>Unexamined</span><span><i class="graph-followed"></i>Followed</span><span><i class="graph-filtered"></i>Examined, optional: skipped</span><span><i class="graph-optional"></i>Optional call (dashed)</span></div><p>Arrows point from caller to dependency. This query walks against the arrows to find callers. × marks the start; ✓ marks a matched service.</p>${found.length ? `<table class="graph-table"><caption>One shortest witness path per matched service</caption><thead><tr><th>Service</th><th>Hops</th><th>Calls toward the failed service</th></tr></thead><tbody>${found.map(id => `<tr><th>${graphName(id)}</th><td>${state.paths[id].length-1}</td><td>${state.paths[id].map(graphName).join(' → ')}</td></tr>`).join('')}</tbody></table>` : state.done ? '<p>No other service is reachable under this filter.</p>' : '<p>No callers found yet. Advance one layer.</p>'}<details class="model-note"><summary>Examined relationships in text</summary>${state.inspected.length ? `<ul>${state.inspected.map(e => `<li>${graphName(e.from)} → ${graphName(e.to)}: ${e.required ? 'required' : 'optional'}; ${e.decision === 'optional' ? 'skipped by filter' : e.decision === 'seen' ? 'followed; service already visited' : 'followed; new service'}.</li>`).join('')}</ul>` : '<p>No relationships examined yet.</p>'}</details>`;
}
