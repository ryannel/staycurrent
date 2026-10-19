export const ledger = [
 {entity:'A',id:1,day:1,amount:10}, {entity:'A',id:2,day:2,amount:null},
 {entity:'A',id:3,day:2,amount:20}, {entity:'A',id:4,day:4,amount:-5},
 {entity:'A',id:5,day:4,amount:0}, {entity:'B',id:6,day:3,amount:7}
];
export const sellers = [{item:'A',sales:40},{item:'B',sales:40},{item:'C',sales:20},{item:'D',sales:10}];
export const recorded = [{day:1,sales:10},{day:2,sales:20},{day:4,sales:40},{day:5,sales:50}];
const sum = rows => rows.reduce((n,r)=>n+(r.amount??r.sales??0),0);
const val = n => n === null ? 'NULL' : String(n);
const dateLabel = day => new Intl.DateTimeFormat('en-GB', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(2026,0,day)));
export const scenes = {
 partition:{title:'The same calculation, displayed in a different order',options:[['forward','Event ID ascending'],['reverse','Event ID descending']],steps:6},
 rank:{title:'A cutoff counts rows, positions or distinct sales values',options:[['row','Two rows'],['rank','Rank ≤ 2'],['dense','Dense rank ≤ 2'],['row1','One row'],['rank1','Rank = 1'],['dense1','Dense rank = 1']],steps:4},
 filter:{title:'Move the amount condition across the calculation',options:[['after','Latest, then positive'],['before','Latest among positives']],steps:3},
 share:{title:'Follow the denominator beside each item',options:[['whole','Whole shop and day'],['ordered','Ordered by item']],steps:4},
 frame:{title:'Which events contribute to the current total?',options:[['rows','ROWS, time then ID'],['range','Default, time only']],steps:5},
 moving:{title:'Three recorded rows or three calendar dates?',options:[['rows','Last three rows'],['range','Current day and two before']],steps:4},
 lag:{title:'An absent predecessor differs from a missing amount',options:[['null','No default'],['zero','Default absent row to zero']],steps:5}
};
export function state(scene,option,step) {
 const t=Math.max(0,Math.min(step,scenes[scene].steps-1));
 if(scene==='partition') {
  const current=ledger[t]; const rows=(option==='reverse'?[...ledger].reverse():ledger);
  return {columns:['Entity','Event','Amount','Known total'],rows:rows.map(r=>({cells:[r.entity,r.id,val(r.amount),sum(ledger.filter(x=>x.entity===r.entity))],kind:r.id===current.id?'current':r.entity===current.entity?'included':''})),
   rule:'SUM(amount) OVER (PARTITION BY entity)',
   text:`Event ${current.id} belongs to ${current.entity}. Its partition is ${ledger.filter(x=>x.entity===current.entity).map(x=>x.id).join(', ')}. The known total is ${sum(ledger.filter(x=>x.entity===current.entity))}; changing display order changes no value.`,result:`${current.entity}: ${sum(ledger.filter(x=>x.entity===current.entity))} known units. The null amount remains unknown.`};
 }
 if(scene==='rank') {
  const mode=option.replace('1',''),cutoff=option.endsWith('1')?1:2;
  const ranks=[1,1,3,4],dense=[1,1,2,3]; const values=mode==='row'?[1,2,3,4]:mode==='rank'?ranks:dense;
  const selected=sellers.filter((r,i)=>values[i]<=cutoff);
  return {columns:['Item','Sales','Position','Rank','Dense rank'],rows:sellers.map((r,i)=>({cells:[r.item,r.sales,i+1,ranks[i],dense[i]],kind:i===t?'current':values[i]<=cutoff?'included':'excluded'})),rule:mode==='row'?'ROW_NUMBER: ORDER BY sales DESC, item':`${mode==='rank'?'RANK':'DENSE_RANK'}: ORDER BY sales DESC`,text:`Inspect ${sellers[t].item}: ${sellers[t].sales} sales. A and B are peers for sales ranking. ${mode==='dense'?'The next distinct sales value is rank 2.':mode==='rank'?'Two peers occupy positions 1 and 2; the next rank is 3.':'Item breaks the sales tie for repeatable row positions.'}`,result:`Cutoff ${cutoff} keeps ${selected.map(x=>x.item).join(', ')} (${selected.length} ${selected.length===1?'row':'rows'}).`};
 }
 if(scene==='filter') {
  const input=option==='before'?ledger.filter(r=>r.amount>0):ledger;
  const numbered=input.map(r=>({...r,position:1+input.filter(x=>x.entity===r.entity&&(x.day>r.day||(x.day===r.day&&x.id>r.id))).length}));
  const selected=numbered.filter(r=>r.position===1&&r.amount>0);
  return {columns:['Entity','Event','Amount','Position'],rows:ledger.map(r=>{const n=numbered.find(x=>x.id===r.id);return {cells:[r.entity,r.id,val(r.amount),t===0?'not yet calculated':n?n.position:'removed before window'],kind:!n?'excluded':t===2&&!selected.some(x=>x.id===r.id)?'excluded':n.position===1&&t>0?'included':''};}),rule:option==='before'?'WHERE amount > 0 → ROW_NUMBER → position = 1':'ROW_NUMBER → WHERE position = 1 AND amount > 0',text:['First decide which rows enter the numbered stage. A null amount does not pass amount > 0.','Assign positions within each entity, newest time then largest ID. The highest remaining ID at the newest time gets position 1.','Apply the outer condition. A latest zero is rejected after ranking; removing it before ranking instead promotes an older positive row.'][t],result:t===2?`Returned events: ${selected.map(r=>r.id).join(', ')}.`:'Advance to see the outer filter’s result.'};
 }
 if(scene==='share') {
  const den=sellers.map((r,i)=>option==='whole'?110:sum(sellers.slice(0,i+1)));
  return {columns:['Item','Numerator','Denominator','Percent'],rows:sellers.map((r,i)=>({cells:[r.item,r.sales,den[i],`${(100*r.sales/den[i]).toFixed(2)}%`],kind:i===t?'current':option==='whole'||i<=t?'included':''})),rule:option==='whole'?'SUM(sales) OVER (PARTITION BY shop, day)':'SUM(sales) OVER (PARTITION BY shop, day ORDER BY item)',text:`${sellers[t].item}: ${sellers[t].sales} ÷ ${den[t]} × 100 = ${(100*sellers[t].sales/den[t]).toFixed(2)}%. ${option==='whole'?'Every item uses the same complete 110-unit shop-day.':'Ordering introduces a frame: this denominator contains only A through the current item.'}`,result:option==='whole'?'Mathematical shares total 100%. Rounded shares total 99.99% here.':'The percentages are 100%, 50%, 20% and 9.09%; they are not shares of one common total.'};
 }
 if(scene==='frame') {
  const input=ledger.filter(r=>r.entity==='A'), current=input[t];
  const frame=input.filter((r,i)=>option==='rows'?i<=t:r.day<=current.day);
  return {columns:['Event','UTC time','Amount','Known total'],rows:input.map((r,i)=>({cells:[r.id,`Jan ${r.day}, 09:00`,val(r.amount),i<=t?sum(input.filter((x,j)=>option==='rows'?j<=i:x.day<=r.day)):'pending'],kind:r.id===current.id?'current':frame.some(x=>x.id===r.id)?'included':''})),rule:option==='rows'?'ORDER BY happened_at, event_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW':'ORDER BY happened_at — default RANGE through current peers',text:`At event ${current.id}, the frame contains ${frame.map(x=>x.id).join(', ')}. ${option==='range'&&current.day===2?'Events 2 and 3 share a timestamp, so both belong to the frame at either event.':'The highlighted rows contribute their known amounts.'}`,result:`${frame.map(r=>val(r.amount)).join(' + ')} → ${sum(frame)} known units. SUM skips NULL; it does not establish a complete balance.`};
 }
 if(scene==='moving') {
  const current=recorded[t]; const frame=recorded.filter((r,i)=>option==='rows'?i<=t&&i>=t-2:r.day>=current.day-2&&r.day<=current.day);
  return {columns:['January day','Sales','In current frame'],rows:recorded.map(r=>({cells:[r.day,r.sales,frame.some(x=>x.day===r.day)?'yes':'no'],kind:r.day===current.day?'current':frame.some(x=>x.day===r.day)?'included':''})),rule:option==='rows'?'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW':"RANGE BETWEEN INTERVAL '2 days' PRECEDING AND CURRENT ROW",text:`At Jan ${current.day}, ${option==='rows'?'count back at most two recorded rows':`include dates ${dateLabel(current.day-2)} through ${dateLabel(current.day)}, both ends included`}. The contributing recorded days are ${frame.map(r=>r.day).join(', ')}. There is no Jan 3 row.`,result:`${frame.map(r=>r.sales).join(' + ')} = ${sum(frame)}. ${t===0?'The opening frame has only one row.':current.day===4?'Jan 2 lies exactly on the interval boundary.':current.day===5?'Jan 2 stays in the last-three-rows total, but lies outside the three-date interval.':''}`};
 }
 const input=ledger.filter(r=>r.entity==='A'),current=input[t],prev=input[t-1];
 const prior=prev?prev.amount:option==='zero'?0:null;
 return {columns:['Event','Amount','Previous event','Previous amount','Change'],rows:input.map((r,i)=>{const p=input[i-1],v=p?p.amount:option==='zero'?0:null;return {cells:[r.id,val(r.amount),p?p.id:'none',i<=t?val(v):'pending',i<=t?val(r.amount===null||v===null?null:r.amount-v):'pending'],kind:i===t?'current':i===t-1?'included':''};}),rule:`LAG(amount${option==='zero'?', 1, 0::numeric':''}) OVER (PARTITION BY entity ORDER BY happened_at, event_id)`,text:prev?`Event ${current.id} follows event ${prev.id}. ${prev.amount===null?'That row exists, but its amount is NULL; the absent-row default cannot replace it.':'Use that preceding row’s amount in the subtraction.'}`:`Event 1 has no predecessor. ${option==='zero'?'The third LAG argument supplies zero only for this absent row.':'The default result for an absent row is NULL.'}`,result:`Previous ID: ${prev?prev.id:'NULL'}. Previous amount: ${val(prior)}. Change: ${val(current.amount===null||prior===null?null:current.amount-prior)}.`};
}
const escape = x => String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function render(s) {
 return `<p class="wc-rule"><code>${escape(s.rule)}</code></p><div class="wc-table" role="region" tabindex="0" aria-label="Calculation rows"><table><thead><tr>${s.columns.map(c=>`<th scope="col">${escape(c)}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r=>`<tr data-kind="${r.kind}">${r.cells.map(c=>`<td>${escape(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="wc-result">${escape(s.result)}</p>`;
}
export function holdFor(s) {
 const words=[s.rule,s.text,s.result,...s.columns,...s.rows.flatMap(r=>r.cells)].join(' ').split(/\s+/).length;
 return 2000+words*300;
}
