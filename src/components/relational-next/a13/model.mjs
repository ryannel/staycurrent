export const show = v => v === null ? 'NULL' : String(v);
export const orders = [
 {id:100, value:10, paid:10, fee:0}, {id:101,value:30,paid:15,fee:1.005},
 {id:102,value:20,paid:null,fee:0}, {id:103,value:40,paid:40,fee:-2},
 {id:106,value:null,paid:null,fee:null}
];
export const positive = v => v === null ? null : v > 0;
export const not = v => v === null ? null : !v;
export const and = (a,b) => a === false || b === false ? false : a === null || b === null ? null : true;
export const or = (a,b) => a === true || b === true ? true : a === null || b === null ? null : false;
export const policies = {
 positive: {label:'Positive fees',sql:'fee > 0',test:v=>positive(v)},
 negated: {label:'Not positive',sql:'NOT (fee > 0)',test:v=>not(positive(v))},
 review: {label:'Positive or undecided',sql:'fee > 0 OR fee IS NULL',test:v=>or(positive(v),v===null)},
 distinct: {label:'Anything except known zero',sql:'fee IS DISTINCT FROM 0',test:v=>v===null || v!==0}
};
const panel = (label,cols,rows) => ({label,cols,rows});
const result = v => v === null ? 'UNKNOWN' : String(v).toUpperCase();
const later = '— next step —';
export const definitions = {
 logic:{title:'A predicate has a value before WHERE makes a decision',label:'Fee policy',options:Object.entries(policies).map(([value,p])=>({value,label:p.label})),initial:'positive',steps:['Read each fee','Evaluate the predicate','Keep only TRUE'],caption:'Logical model of the five fixture rows. UNKNOWN is an SQL null Boolean. Changing the policy keeps the same inputs.'},
 defaults:{title:'The same NULL can need two different policies',label:'Inspect order',options:[{value:'102',label:'102 · known price, no receipts'},{value:'106',label:'106 · unknown price and fee'}],initial:'106',steps:['Read the facts','Apply the defaults','Subtract and add'],caption:'Logical model. The left route supplies zero only for absent receipts. The right route also invents a zero price and fee.'},
 arithmetic:{title:'Change the operation before changing the printed answer',label:'Calculation',options:[{value:'division',label:'Divide 5 between 2'},{value:'rounding',label:'10% of two 0.05 lines'},{value:'overflow',label:'Multiply 50,000 by 50,000'}],initial:'division',steps:['Choose the operands','Perform the operation','Inspect the result'],caption:'Worked PostgreSQL results, replayed as a calculation model. Each lane exposes the intermediate value that causes the final difference.'},
 text:{title:'One search policy changes which labels match',label:'Search policy',options:[{value:'exact',label:'Exact José'},{value:'insensitive',label:'Case and accent insensitive JOSE'},{value:'unsafe',label:'Pattern contains 100%'},{value:'escaped',label:'Literal contains 100%'}],initial:'exact',steps:['Read the search input','Compare every label','Return the matching identities'],caption:'Model of the recorded C and report_search comparisons. The two wildcard cases deliberately use C, keeping pattern escaping separate from collation.'},
 bounds:{title:'A local day ends at the next local midnight',label:'Day in London',options:[{value:'spring',label:'29 March 2026 · clocks forward'},{value:'autumn',label:'25 October 2026 · clocks back'}],initial:'spring',steps:['Start at local midnight','Resolve the upper bound','Compare event instants'],caption:'Model of recorded UTC boundaries. The two routes share their lower bound; adding 24 elapsed hours can include tomorrow or omit the end of today.'},
 calendar:{title:'Tomorrow at noon and 24 hours later are different promises',label:'Start at local noon',options:[{value:'spring',label:'28 March 2026'},{value:'autumn',label:'24 October 2026'}],initial:'spring',steps:['Read the starting instant','Move the calendar or the clock','Compare local times and elapsed hours'],caption:'Model of PostgreSQL timestamptz arithmetic with the session TimeZone set to Europe/London. The starting instants are explicit; the interval determines the promise.'}
};
export function frame(scene,choice,step=2) {
 if(scene==='logic') {
  const p=policies[choice];
  const rows=orders.map(o=>[String(o.id),show(o.fee),step>0?result(p.test(o.fee)):later,step>1?(p.test(o.fee)===true?'KEEP':'DROP'):later]);
  const selected=orders.filter(o=>p.test(o.fee)===true).map(o=>o.id);
  return {panels:[panel(p.sql,['Order','fee','Predicate','WHERE'],rows)],note:step===0?'A zero fee is known; order 106 has no fee decision yet. Predict whether NOT will recover that row.':step===1?'Evaluate the expression for every row. TRUE, FALSE and UNKNOWN are three different values; none has been filtered yet.':`WHERE keeps only TRUE. Returned order IDs: ${selected.join(', ')}.`,selected};
 }
 if(scene==='defaults') {
  const o=orders.find(x=>String(x.id)===choice);
  const due=o.value===null?null:o.value-(o.paid??0);
  const payable=due===null||o.fee===null?null:due+o.fee;
  const invented=(o.value??0)-(o.paid??0)+(o.fee??0);
  return {panels:[panel('Preserve unknown facts',['Stage','Price','Paid','Fee'],[
   ['Input',show(o.value),show(o.paid),show(o.fee)],
   ['After defaults',step>0?show(o.value):later,step>0?show(o.paid??0):later,step>0?show(o.fee):later],
   ['Payable',step>1?show(payable):later,'','']
  ]),panel('Default every NULL to zero',['Stage','Price','Paid','Fee'],[
   ['Input',show(o.value),show(o.paid),show(o.fee)],
   ['After defaults',step>0?show(o.value??0):later,step>0?show(o.paid??0):later,step>0?show(o.fee??0):later],
   ['Payable',step>1?show(invented):later,'','']
  ])],note:step===0?`Order ${o.id}: no receipts establishes zero paid. Missing price or fee establishes no amount.`:step===1?'Both routes may replace paid with zero. Only the right route also replaces unknown price and fee.':o.id===106?'The invented zero now looks settled and would disappear from a positive-or-unknown follow-up list. The left route preserves the work still needing a decision.':'Both routes return 20 here. A fixture containing only known prices would fail to expose the wrong default.',payable,invented};
 }
 if(scene==='arithmetic') {
  const cases={
   division:[['Cast the result','5 and 2 · integer','5 / 2 → 2','2::numeric → 2'],['Cast an operand','5::numeric and 2','5::numeric / 2 → 2.5','round(2.5, 2) → 2.50'],'The integer operation discards the fractional part first. Changing the result type cannot recover it.'],
   rounding:[['Round each line','0.05 + 0.05, rate 0.10','0.005 → 0.01 on each line','0.01 + 0.01 → 0.02'],['Round once per order','0.05 + 0.05, rate 0.10','0.10 × 0.10 → 0.010','round(0.010, 2) → 0.01'],'Both calculations are exact decimal arithmetic. The contractual point of rounding, rather than storage error, changes the answer.'],
   overflow:[['Cast the result','50,000 and 50,000 · integer','50,000 × 50,000 → ERROR','The bigint cast is never reached'],['Cast an operand','50,000::bigint and 50,000','bigint product → 2,500,000,000','2,500,000,000 · bigint'],'The narrow intermediate must exist before an outer cast can run. Widen an operand before multiplying.']
  };
  const [a,b,note]=cases[choice];
  return {panels:[a,b].map(x=>panel(x[0],['Stage','Expression and value'],[['Operands',x[1]],['Operation',step>0?x[2]:later],['Result',step>1?x[3]:later]])),note:step===2?note:step===0?'Read the operand types in both lanes before advancing. The figures use PostgreSQL operators.':'The intermediate operation has already fixed the answer or raised an error. Advance to see what the final cast or rounding can do.'};
 }
 if(scene==='text') {
  const data=[['A','José'],['B','JOSE'],['C','Edda_100%'],['D','Edda_1000']];
  const config={exact:['José','label COLLATE "C" = input',[true,false,false,false]],insensitive:['JOSE','label COLLATE report_search = input',[true,true,false,false]],unsafe:['100%','LIKE \'%100%\' ESCAPE \'!\'',[false,false,true,true]],escaped:['100%','LIKE \'%100!%%\' ESCAPE \'!\'',[false,false,true,false]]}[choice];
  const selected=data.filter((_,i)=>config[2][i]).map(r=>r[0]);
  return {panels:[panel(`Input: ${config[0]}`,['ID','Label','Comparison'],data.map((r,i)=>[...r,step>0?result(config[2][i]):later])),panel('Comparison rule',['Stage','Value'],[['SQL',config[1]],['Returned IDs',step>1?selected.join(', '):later]])],note:step===0?'Predict the matches. A percent sign supplied as search data may become a wildcard if inserted into a LIKE pattern unchanged.':step===1?'Each comparison has an explicit rule. Matching a name still does not prove two customer records are one person.':choice==='unsafe'?'The percent in the search input matches any suffix: 1000 matched too. Escape input wildcards before adding the deliberate outer wildcards.':choice==='escaped'?'The escaped percent is data. Only Edda_100% contains the literal 100% substring.':`Returned IDs: ${selected.join(', ')}. The collation policy changed equality; the labels themselves stayed unchanged.`,selected};
 }
 if(scene==='bounds') {
  const spring=choice==='spring';
  const day=spring?'29 March':'25 October';
  const lo=spring?'29 Mar 00:00':'24 Oct 23:00';
  const hi=spring?'29 Mar 23:00':'26 Oct 00:00';
  const wrong=spring?'30 Mar 00:00':'25 Oct 23:00';
  const events=spring?[['201','28 Mar 23:59:59.999999',false,false],['202',lo,true,true],['203','29 Mar 22:59:59.999999',true,true],['204',hi,false,true],['205','29 Mar 23:30',false,true]]:[['201','24 Oct 22:59:59.999999',false,false],['202',lo,true,true],['203','25 Oct 23:59:59.999999',true,false],['204',hi,false,false],['205','25 Oct 23:30',true,false]];
  return {panels:[panel(`${day} · UTC bounds`,['Rule','Lower, inclusive','Upper, exclusive'],[['Next local midnight',lo,step>0?hi:later],['24 hours after start',lo,step>0?wrong:later]]),panel('Event selection',['Event','UTC instant','Local-day rule','24-hour rule'],events.map(r=>[r[0],r[1],step>1?(r[2]?'KEEP':'DROP'):later,step>1?(r[3]?'KEEP':'DROP'):later]))],note:step===0?'Both routes begin at midnight in London. Resolve that local reading to an instant before comparing events.':step===1?`The next local midnight is ${spring?'23':'25'} elapsed hours away. The fixed-duration route ends ${spring?'too late':'too early'}.`:`The lower-bound event is kept; the upper-bound event belongs to tomorrow. The ${spring?'extra':'missing'} events show why a 24-hour duration cannot define this local day.`,selected:events.filter(r=>r[2]).map(r=>Number(r[0]))};
 }
 const spring=choice==='spring';
 const start=spring?'28 Mar 12:00 +00':'24 Oct 12:00 +01';
 const next=spring?'29 Mar 12:00 +01':'25 Oct 12:00 +00';
 const elapsed=spring?'29 Mar 13:00 +01':'25 Oct 11:00 +00';
 return {panels:[panel('Same local time tomorrow',['Stage','Value'],[['Start',start],['Operation',step>0?"t + interval '1 day'":later],['Local result',step>1?next:later],['Elapsed hours',step>1?(spring?'23':'25'):later]]),panel('Wait 24 elapsed hours',['Stage','Value'],[['Start',start],['Operation',step>0?"t + interval '24 hours'":later],['Local result',step>1?elapsed:later],['Elapsed hours',step>1?'24':later]])],note:step===0?'Start with one resolved instant, displayed in London. The two requirements are still different even though ordinary days make them agree.':step===1?'The day field advances the calendar in the session zone; the hours field advances elapsed time.':`The calendar result is noon after ${spring?'23':'25'} hours. The timeout result is ${spring?'13:00':'11:00'} after exactly 24 hours.`};
}
export const escapeHtml = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderFrame(f) {
 return f.panels.map(p=>`<div class="sv-panel"><p class="sv-label">${escapeHtml(p.label)}</p><div class="sv-scroll" role="region" tabindex="0" aria-label="${escapeHtml(p.label)}"><table><thead><tr>${p.cols.map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${p.rows.map(r=>`<tr>${r.map((c,i)=>`<${i===0?'th scope="row"':'td'} data-value="${c==='KEEP'?'keep':c==='DROP'?'drop':c==='UNKNOWN'||c==='NULL'?'unknown':''}">${escapeHtml(c)}</${i===0?'th':'td'}>`).join('')}</tr>`).join('')}</tbody></table></div></div>`).join('');
}
export function holdFor(f) {
 const visible=[...f.panels.flatMap(p=>[p.label,...p.cols,...p.rows.flat()]),f.note].join(' ');
 return 2200 + visible.trim().split(/\s+/).length * (60000/200);
}
