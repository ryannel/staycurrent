import { renderDiagram } from './diagram.mjs';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function tone(value) {
 const s=String(value);
 return /^(yes|present|permitted|return|accepted|true|keep|can advance|replacement|live|published)/i.test(s)?'accepted':/^(no$|absent|rejected|exclude|false|missing|denied|login denied|pending|retained obsolete|stopped|unavailable)/i.test(s)?'boundary':'';
}
export function renderResult(state) {
 return `${renderDiagram(state.diagram)}<div class="rpt-panels">${state.panels.map(p=>`<div class="rpt-panel"><p class="rpt-panel-title">${escape(p.title)}</p><div class="rpt-table-wrap" tabindex="0" role="region" aria-label="${escape(p.title)}"><table><thead><tr>${p.headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${p.rows.length?p.rows.map(row=>`<tr>${row.map((v,i)=>i===0?`<th scope="row">${escape(v)}</th>`:`<td data-state="${tone(v)}">${escape(v)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${p.headers.length}">No rows in this state.</td></tr>`}</tbody></table></div></div>`).join('')}</div><p class="rpt-outcome" aria-live="polite">${escape(state.summary)}</p>`;
}
