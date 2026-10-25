// Exact selected rows from the approved generated fixture. Page placement below
// is an illustrative layout, not a claim about PostgreSQL's physical pages.
export const rows = [
 {id:100003,c:1001,date:'2026-11-11',status:'pending'},
 {id:103979,c:1002,date:'2026-11-28',status:'pending'},
 {id:147700,c:1003,date:'2026-11-25',status:'pending'},
 {id:100042,c:1001,date:'2026-10-25',status:'pending'},
 {id:114968,c:1002,date:'2026-11-11',status:'pending'},
 {id:117730,c:1003,date:'2026-11-05',status:'pending'},
 {id:100012,c:1001,date:'2026-10-10',status:'paid'},
 {id:162920,c:1002,date:'2026-10-01',status:'paid'},
 {id:128719,c:1003,date:'2026-10-19',status:'paid'},
 {id:100001,c:1001,date:'2026-08-29',status:'pending'},
 {id:132950,c:1002,date:'2026-09-11',status:'pending'},
 {id:109738,c:1003,date:'2026-09-12',status:'pending'},
].map((r,i)=>({...r,page:Math.floor(i/3),slot:i%3+1}));
export const byTime=(a,b)=>b.date.localeCompare(a.date)||b.id-a.id;
export const dateLabel=r=>`${Number(r.date.slice(8))} ${{'08':'Aug','09':'Sep','10':'Oct','11':'Nov'}[r.date.slice(5,7)]}`;
const stat=(n,label)=>`<div><strong>${n}</strong><span>${label}</span></div>`;
const stats=(...items)=>`<div class="ix-stats">${items.map(([n,label])=>stat(n,label)).join('')}</div>`;
const pageGrid=(ordered,active=[],showCustomer=true)=>`<div class="ix-pages">${Array.from({length:4},(_,page)=>{
 const contents=ordered.slice(page*3,page*3+3);
 const read=contents.some(r=>active.includes(r.id));
 return `<div class="ix-page ${read?'is-read':''}"><span class="ix-label">table page ${page} · ${read?'visited':'not visited'}</span>${contents.map(r=>`<div class="ix-row ${active.includes(r.id)?'is-match':''}"><b>${r.id}</b><span>${showCustomer?'customer '+r.c+' · ':''}${dateLabel(r)}</span></div>`).join('')}</div>`;
}).join('')}</div>`;
export function keyTrace(variant){
 const ordered=[...rows].sort(variant==='time'?((a,b)=>b.date.localeCompare(a.date)||a.c-b.c||b.id-a.id):variant==='history'?((a,b)=>a.c-b.c||byTime(a,b)):((a,b)=>a.c-b.c||a.page-b.page||a.slot-b.slot));
 const range=variant==='time'?ordered.filter(r=>r.date>='2026-10-01'):ordered.filter(r=>r.c===1001&&(variant==='customer'||r.date>='2026-10-01'));
 const visited=[];const fetched=[];const eligible=[];
 for(const r of range){visited.push(r);if(variant==='time'&&r.c!==1001)continue;fetched.push(r);if(r.date>='2026-10-01')eligible.push(r);if(variant!=='customer'&&eligible.length===2)break;}
 const result=[...eligible].sort(byTime).slice(0,2);
 return {ordered,range,visited,fetched,result};
}
const treeExplanations=[
 'The index is separate from the table. Its entries hold a customer ID and a row locator. The table rows stay on their pages.',
 'Read the root. Its ranges direct customer 1001 to the first leaf; the other two leaves need not be searched.',
 'Read that leaf. All four entries for customer 1001 sit together. This small tree has read two index pages: root and leaf.',
 'Follow the four locators. In this layout the rows occupy four different table pages. The key found four entries, not four adjacent table rows.',
];
function tree(step){
 const active=step===3?rows.filter(r=>r.c===1001).map(r=>r.id):[];
 return {scene:`${stats([step>=1?1+(step>=2?1:0):0,'index pages visited'],[step>=2?4:0,'matching entries'],[step===3?4:0,'table pages visited'])}<div class="ix-tree"><div class="ix-root ${step>=1?'is-read':''}"><span class="ix-label">root page</span><b>1001 ↓ &nbsp; 1002 ↓ &nbsp; 1003 ↓</b></div><div class="ix-leaves">${[1001,1002,1003].map(c=>`<div class="ix-leaf ${c===1001&&step>=2?'is-read':''}"><span class="ix-label">leaf · customer ${c}</span>${rows.filter(r=>r.c===c).map(r=>`<div class="ix-locator"><b>${c}</b><span>→ (${r.page}, ${r.slot})</span></div>`).join('')}</div>`).join('')}</div><div class="ix-link">row locator = (table page, slot) ↓</div></div>${pageGrid(rows,active)}`,explanation:treeExplanations[step]};
}
function keys(step,options){
 const variant=options.variant||'history';const t=keyTrace(variant);
 const count=step<2?0:step===2?Math.ceil(t.visited.length/2):t.visited.length;
 const visited=t.visited.slice(0,count),ids=visited.map(r=>r.id);
 const fetched=t.fetched.filter(r=>ids.includes(r.id));
 const explanation=step===0?'The same twelve rows are listed in the selected key order. Row labels identify the table row; they are not extra key columns.':step===1?variant==='time'?'The date bound excludes entries before October. Within that range, different customers are interleaved.':variant==='customer'?'Customer equality locates four entries. This key contains no time, so every one still needs its table row.':'Customer equality locates one run; the time bound excludes its August entry. Within the run, newest time and greatest order ID come first.':step===2?`Read ${count} ${count===1?'entry':'entries'} so far. ${variant==='customer'?'Dates still have to be checked on fetched rows.':variant==='time'?'Other customers can be rejected inside this index, before fetching their rows.':'Every visited entry is already an eligible order in the requested order.'}`:variant==='customer'?'Four entries fetched four rows. Three pass the time bound; sort those three and return the first two.':variant==='time'?'Six entries were visited to find two for customer 1001. Only those two need table rows. Their time and ID order allows the scan to stop.':'Two entries supplied the first two eligible orders. Stop here: later entries cannot precede either result.';
 return {scene:`${stats([count,'entries examined'],[fetched.length,'rows fetched'],[step===3?(variant==='customer'?'3 rows':'none'):'—','sort input'])}<div class="ix-key-title">${variant==='customer'?'(customer_id)':variant==='time'?'(placed_at DESC, customer_id, order_id DESC)':'(customer_id, placed_at DESC, order_id DESC)'}</div><ol class="ix-entries">${t.ordered.map(r=>{
 const read=ids.includes(r.id),returned=step===3&&t.result.some(x=>x.id===r.id);
 const bounded=step>=1&&t.range.some(x=>x.id===r.id);
 return `<li class="${bounded?'in-range':''} ${read?'is-read':''} ${returned?'is-returned':''}"><b>${variant==='time'?dateLabel(r):r.c}</b><span>${variant==='customer'?`locator (${r.page}, ${r.slot})`:variant==='time'?`customer ${r.c}`:dateLabel(r)}</span><small>entry ${t.ordered.indexOf(r)+1} · row ${r.id}</small><em>${returned?'return':read?'examined':bounded?'in range':step===0?'not searched':'outside'}</em></li>`;
 }).join('')}</ol><div class="ix-answer">Result: ${step===3?t.result.map(r=>r.id).join(', '):'not complete'}</div>`,explanation};
}
function locality(step,options){
 const maximum=Number(options.maximum||1001);const grouped=options.layout==='grouped';
 const ordered=grouped?[...rows].sort((a,b)=>a.c-b.c||byTime(a,b)):[...rows];
 const matches=ordered.filter(r=>r.c<=maximum),active=step>=2?matches.map(r=>r.id):[];
 const pages=new Set(ordered.map((r,i)=>matches.some(m=>m.id===r.id)?Math.floor(i/3):-1).filter(p=>p>=0)).size;
 return {scene:`<div class="ix-key-title">${matches.length} matching rows out of 12 · ${grouped?'stored together by customer':'customers mixed on each page'}</div>${pageGrid(ordered,active)}<div class="ix-bars">${[[matches.length,'individual row fetches'],[pages,'distinct table pages'],[4,'pages in a full scan']].map(([n,label])=>`<div><span>${label}</span><i style="--fraction:${step>=2?n/12:0}"></i><b>${step>=2?n:'—'}</b></div>`).join('')}</div>`,explanation:[
 'The index key is unchanged. Only the illustrative placement of these twelve table rows changes.',
 `The condition locates ${matches.length} entries. They are the same matching rows in either physical layout.`,
 `${matches.length} row fetches reach ${pages} distinct table pages. Several fetches can revisit one page; a visit is not necessarily a storage read.`,
 `A bitmap route can collect locations and visit the ${pages} matching pages in page order. A full scan reads four pages without first collecting index entries. Index-page work is omitted from these bars.`,
 ][step]};
}
function cover(step,options){
 const variant=options.variant||'include';const visible=options.visibility!=='check';
 const all=rows.filter(r=>r.c===1001&&r.date>='2026-10-01').sort(byTime);
 const run=variant==='partial'?all.filter(r=>r.status==='paid'):all;
 const count=step<2?0:step===2?1:run.length;
 const examined=run.slice(0,count),complete=step===3;
 const visits=variant==='key'||!visible?count:0;
 const explanation=step===0?'This smaller request asks for the newest paid order for customer 1001 since October, LIMIT 1. The time order is unchanged.':step===1?variant==='partial'?'The partial index contains paid rows only. For this customer, only the October 10 entry remains in the range.':variant==='include'?'Status is payload in each leaf entry. It can be returned and tested, but does not direct the search or put paid orders together.':'Status is absent. The scan must fetch each candidate row to discover whether it is paid.':step===2?variant==='partial'?'The first matching entry is paid by membership. Its stored status also covers the selected value.':variant==='key'?'Fetch the November 11 row: pending. One table fetch has produced no result.':'Read the November 11 entry: pending. The payload rejects it without contributing a result.':variant==='partial'?`One entry supplies the result.${visible?' This model confirms visibility without fetching the table row.':' Visibility still requires one table visit.'}`:`Read three entries to reach the October 10 paid order.${variant==='key'?' All three required row fetches.':visible?' All values and the visibility confirmation came without table-row fetches.':' All three still required table visits for visibility.'}`;
 return {scene:`${stats([count,'entries examined'],[visits,'table-row fetches'],[complete?1:0,'rows returned'])}<div class="ix-key-title">ordered key${variant==='include'?' + INCLUDE (status)':variant==='partial'?" + INCLUDE (status) WHERE status = 'paid'":' · status absent'}</div><div class="ix-cover-run">${run.map((r,i)=>`<div class="ix-cover-entry ${i<count?'is-read':''} ${complete&&r.status==='paid'?'is-returned':''}"><b>${dateLabel(r)} · ${r.id}</b><span>${variant==='key'?(i<count?'table says '+r.status:'status: fetch table'):r.status+' · stored payload'}</span><small>${i<count?(r.status==='paid'?'return':'reject'):'not examined'}</small></div>`).join('')}</div><div class="ix-visibility">Visibility: ${visible?'confirmed without a table-row fetch':'table row must be checked'}${variant==='key'?' · missing status still requires the row':''}</div>`,explanation};
}
export function frame(kind,step=0,options={}){return ({tree,keys,locality,cover})[kind](step,options);}
