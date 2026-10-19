const customers = [[1,'Mina'],[2,'Tariq'],[3,'Mina'],[4,'Edda'],[5,'Sol']];
const orders = [[101,1],[102,1],[104,3],[105,5]];
export function matchFrames(mode = 'key') {
 const pairs = customers.flatMap(c=>orders.filter(o=>mode==='all'||o[1]===c[0]).map(o=>[c[0],o[0]]));
 return Array.from({length:pairs.length+1},(_,step)=>({
  kind:'matrix', headers:orders.map(o=>`Order ${o[0]} · customer ${o[1]}`), labels:customers.map(c=>`${c[0]} · ${c[1]}`),
  cells:customers.flatMap(c=>orders.map(o=>{
   const index=pairs.findIndex(p=>p[0]===c[0]&&p[1]===o[0]);
   return {label:index<0?'×':`${c[0]} + ${o[0]}`,state:index<0?'reject':index<step?(index===step-1?'current':'accepted'):'waiting'};
  })),
  stats:[['result rows',step],['customers represented',new Set(pairs.slice(0,step).map(p=>p[0])).size]],
  note:step===0 ? (mode==='key'?'Predict the pairs: each January order matches just one customer ID.':'With no relationship condition, every customer pairs with every January order. Predict the row count.') : step===pairs.length ? (mode==='key'?'Four pairs: customer 1 appears twice. Customers 2 and 4 have no January order, so this inner join omits them.':'Twenty pairs: 5 customers × 4 January orders. Most pairs describe no real relationship.') : `Emit customer ${pairs[step-1][0]} paired with order ${pairs[step-1][1]}. Keep both source identities in view.`
 }));
}
export function outerFrames(mode='on') {
 return Array.from({length:5},(_,step)=>({
  kind:'table',headers:['Customer','Order after matching','Period test','In final result?'],
  rows:[[1,101],[1,102],[2,mode==='on'?null:103],[3,104],[4,null],[5,105]].map(([c,o])=>({
   cells:[`${c} · ${customers[c-1][1]}`,step<1?'—':o===null?(step<2?'no match yet':'NULL (extended)'):String(o),step<3?'—':o===null?'unknown':o===103?'false':'true',step<4?'—':mode==='where'&&(o===null||o===103)?'rejected':'retained'],
   state:step>=3&&mode==='where'&&(o===null||o===103)?'reject':step>=2&&o===null?'current':step>=4?'accepted':''
  })),
  stats:[['customers retained',step<4?'—':mode==='on'?5:3],['result rows',step<4?'—':mode==='on'?6:4]],
  note:[
   mode==='on'?'The date condition is part of ON: only January orders can match.':'ON checks customer identity only. The date condition waits in WHERE.',
   mode==='on'?'Orders 101, 102, 104 and 105 match. Tariq’s December order does not qualify.':'Tariq matches December order 103. Edda has no order to match.',
   mode==='on'?'LEFT JOIN adds one null-extended row for Tariq and one for Edda. Every customer is now represented.':'LEFT JOIN adds a null-extended row for Edda only. Tariq already has a match, so he gets no extra row.',
   mode==='on'?'There is no WHERE date test. NULL here means no qualifying match, and those rows stay.':'WHERE checks the date: false for order 103, unknown for Edda’s NULL. Both rows are rejected.',
   mode==='on'?'Five customers survive, in six rows. Two of those rows represent no January order.':'Only customers 1, 3 and 5 survive. A LEFT JOIN cannot preserve rows a later WHERE rejects.'
  ][step]
 }));
}
export function fanoutFrames(mode='details') {
 const os=[['101',30],['102',20]], ps=[['201',15],['202',15]];
 if(mode==='totals') return [
  {kind:'totals',order:os,payment:ps,orderDone:false,paymentDone:false,result:false,stats:[['order value','—'],['payment value','—']],note:'Start with two independent detail sets for customer 1. Each set must become one row before they meet.'},
  {kind:'totals',order:os,payment:ps,orderDone:true,paymentDone:false,result:false,stats:[['order value',50],['payment value','—']],note:'Group orders by customer_id: 30 + 20 = 50. Customer 1 now has exactly one order-total row.'},
  {kind:'totals',order:os,payment:ps,orderDone:true,paymentDone:true,result:false,stats:[['order value',50],['payment value',30]],note:'Group payments separately: 15 + 15 = 30. Equal amounts remain two legitimate payments.'},
  {kind:'totals',order:os,payment:ps,orderDone:true,paymentDone:true,result:true,stats:[['order value',50],['payment value',30]],note:'Join one customer row to one row from each subtotal. One final row: order value 50, payment value 30.'}
 ];
 const pairs=os.flatMap(o=>ps.map(p=>[o,p]));
 return Array.from({length:5},(_,step)=>({
  kind:'fanout', order:os,payment:ps,current:step?pairs[step-1]:null,
  pairs:pairs.map(([o,p],i)=>({cells:[`order ${o[0]}`,o[1],`payment ${p[0]}`,p[1]],state:i<step?(i===step-1?'current':'accepted'):'waiting'})),
  stats:[['sum of order values',pairs.slice(0,step).reduce((s,[o])=>s+o[1],0)],['sum of payments',pairs.slice(0,step).reduce((s,[,p])=>s+p[1],0)]],
  note:step===0?'Predict the totals before you play. Every order matches both payments through customer 1.':step===4?'Four pairs: each order was counted twice, and each payment twice. The final GROUP BY cannot undo those copies.':`Add pair ${step}: order ${pairs[step-1][0][0]} contributes ${pairs[step-1][0][1]}, payment ${pairs[step-1][1][0]} contributes ${pairs[step-1][1][1]}.`
 }));
}
export function framesFor(scene,mode) {
 return scene==='matches'?matchFrames(mode):scene==='outer'?outerFrames(mode):fanoutFrames(mode);
}
const esc = v => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const cell = v=>`<td>${esc(v)}</td>`;
const table=(headers,rows)=>`<div class="ja-scroll" role="region" tabindex="0" aria-label="Rows at this step"><table><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr class="ja-${r.state}">${r.cells.map(cell).join('')}</tr>`).join('')}</tbody></table></div>`;
export function renderFrame(f) {
 let body='';
 if(f.kind==='matrix') {
  body=`<div class="ja-scroll" role="region" tabindex="0" aria-label="Customer and order pairs"><table class="ja-matrix"><thead><tr><th scope="col">Customer</th>${f.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${f.labels.map((label,i)=>`<tr><th scope="row">${esc(label)}</th>${f.cells.slice(i*4,i*4+4).map(c=>`<td class="ja-${c.state}">${esc(c.label)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 } else if(f.kind==='table') body=table(f.headers,f.rows);
 else {
  body=`<div class="ja-sources">${[['Orders',f.order,'order'],['Payments',f.payment,'payment']].map(([label,rows,key])=>`<div><p class="ja-source-title">${label} · customer 1</p><div class="ja-chips">${rows.map(([id,v])=>`<div class="ja-chip ${f.current&&f.current[key==='order'?0:1][0]===id?'ja-current':''}"><span>${id}</span><strong>${v}</strong></div>`).join('')}</div>${f.kind==='totals'?`<div class="ja-subtotal ${f[key+'Done']?'ja-accepted':'ja-waiting'}">↓ one subtotal row: ${key==='order'?50:30}</div>`:''}</div>`).join('')}</div>`;
  body+=f.kind==='fanout'?table(['Order','Order value','Payment','Payment value'],f.pairs):`<div class="ja-final ${f.result?'ja-accepted':'ja-waiting'}">↓ join on customer_id = 1<br/><strong>1 · Mina · orders 50 · payments 30</strong></div>`;
 }
 return `<dl class="ja-stats">${f.stats.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>${body}`;
}
