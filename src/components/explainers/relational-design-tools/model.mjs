// Bounded workshop teaching models. No database connection or planner simulation.
export const lines = [{id:1, amount:40},{id:2,amount:5}];
export function booking(step=0,decision='open') {
  const pending={places:step>0?1:2,order:step>1};
  return {pending,published:decision==='commit'?{...pending}:{places:2,order:false},closed:decision!=='open'};
}
export function fanout(count=2, grouped=false) {
  const payments = Array.from({length:count},(_,i)=>({id:`p${i+1}`,amount:i===0?20:25}));
  const pairs = grouped ? [{line:'summary',payment:count?'summary':null,amount:45}] : lines.flatMap(l=>payments.map(p=>({line:l.id,payment:p.id,amount:l.amount})));
  return {payments,pairs,total:pairs.reduce((n,p)=>n+p.amount,0),correct:45};
}
export function outerJoin(cancelled=false, placement='on') {
  const bookings=[{id:'b17',session:'s7',status:'confirmed'},...(cancelled?[{id:'b18',session:'s8',status:'cancelled'}]:[])];
  const intermediate=['s7','s8'].flatMap(session=>{
    const matches=bookings.filter(b=>b.session===session&&(placement!=='on'||b.status==='confirmed'));
    return matches.length?matches.map(b=>({session,booking:b.id,status:b.status})): [{session,booking:null,status:null}];
  });
  return {bookings,intermediate,rows:intermediate.filter(r=>placement==='on'||r.status==='confirmed'||(placement==='or'&&r.booking===null))};
}
export function notIn(ids=['o81',null]) {
  return ['o81','o82'].map(id=>{
    const comparisons=ids.map(v=>v===null?'UNKNOWN':v===id?'FALSE':'TRUE');
    const truth=comparisons.includes('FALSE')?'FALSE':comparisons.includes('UNKNOWN')?'UNKNOWN':'TRUE';
    return {id,comparisons,truth,notIn:truth==='TRUE',notExists:!ids.includes(id)};
  });
}
export const orders=[{id:'o81',customer:42,time:9,day:19,total:40},{id:'o82',customer:42,time:9,day:19,total:20},{id:'o83',customer:43,time:10,day:19,total:30},{id:'o84',customer:43,time:9,day:20,total:10}];
export function windowRows(frame='peers',current=0,tie=true) {
  const input=orders.map((o,i)=>({...o,time:i===1&&!tie?9.5:o.time}));
  const row=input[current];
  const includes=(o,i)=>frame==='customer'?o.customer===row.customer:frame==='rows'?i<=current:frame==='previous'?i>=current-1&&i<=current:o.day<row.day||(o.day===row.day&&o.time<=row.time);
  return {input,contributing:input.filter(includes),total:input.filter(includes).reduce((n,o)=>n+o.total,0)};
}
export function history(effective=9,known=12) {
  const versions=[{from:1,to:10,recorded:1,until:15,price:20},{from:10,to:32,recorded:1,until:15,price:22},{from:1,to:8,recorded:15,until:32,price:20},{from:8,to:32,recorded:15,until:32,price:22}];
  return {versions:versions.map(v=>({...v,selected:v.from<=effective&&effective<v.to&&v.recorded<=known&&known<v.until})),price:versions.find(v=>v.from<=effective&&effective<v.to&&v.recorded<=known&&known<v.until)?.price};
}
const pageBase=[{id:'o85',time:12,total:50},{id:'o84',time:12,total:10},{id:'o83',time:12,total:30},{id:'o82',time:10,total:20},{id:'o81',time:9,total:40}];
export function paginate(change='insert',method='keyset',capture='live') {
  let live=pageBase.map(o=>({...o}));
  if(change==='insert')live.push({id:'o86',time:13,total:60});
  if(change==='delete')live=live.filter(o=>o.id!=='o85');
  if(change==='move')live=live.map(o=>o.id==='o82'?{...o,time:14}:o);
  if(change==='value')live=live.map(o=>o.id==='o83'?{...o,total:99}:o);
  live.sort((a,b)=>b.time-a.time||b.id.localeCompare(a.id));
  const captured=capture==='ids'||capture==='values';
  const saved=pageBase.map((o,i)=>({...o,sequence:i+1}));
  const source=capture==='snapshot'?pageBase:capture==='values'?saved:capture==='ids'?saved.map(o=>({...o,...live.find(v=>v.id===o.id),missing:!live.some(v=>v.id===o.id)})):live;
  const after=captured?source.filter(o=>o.sequence>2):method==='offset'?source.slice(2):source.filter(o=>method==='time'?o.time<12:o.time<12||(o.time===12&&o.id<'o84'));
  return {before:pageBase,live,source,next:after.filter(o=>!o.missing).slice(0,2),captured};
}
export function constraint(tenant='t4',session='s8',seats=1,required=true,composite=true) {
  const targets=[['t4','s7'],['t5','s8']];
  const reference=composite?targets.some(t=>t[0]===tenant&&t[1]===session):targets.some(t=>t[1]===session);
  const check=seats===null?'UNKNOWN':seats>0?'TRUE':'FALSE';
  return {targets,reference,check,accepted:reference&&check!=='FALSE'&&!(required&&seats===null)};
}
export const rawImport=[{row:1,id:'b18',status:'confirmed',version:1},{row:2,id:'b17',status:'confirmed',version:6},{row:3,id:'b17',status:'cancelled',version:9},{row:4,id:'b19',status:'unknown',version:null},{row:5,id:'b17',status:'confirmed',version:9},{row:6,id:'b18',status:'confirmed',version:1}];
export function importBatch(resolve=false,current=8) {
  const rows=rawImport.map(r=>({...r,status:resolve&&r.row===5?'cancelled':r.status}));
  const dispositions=rows.map((r,i)=>{
    if(!['confirmed','cancelled'].includes(r.status)||r.version===null)return {...r,outcome:'malformed'};
    if(rows.some(v=>v.id===r.id&&v.version===r.version&&v.status!==r.status))return {...r,outcome:'contradictory'};
    if(rows.slice(0,i).some(v=>v.id===r.id&&v.version===r.version&&v.status===r.status))return {...r,outcome:'duplicate'};
    if(rows.some(v=>v.id===r.id&&v.version>r.version&&!rows.some(w=>w.id===v.id&&w.version===v.version&&w.status!==v.status)))return {...r,outcome:'superseded'};
    return {...r,outcome:r.id!=='b17'||r.version>current?'applied':r.version<current?'stale':r.status==='cancelled'?'already current':'destination disagreement'};
  });
  const applied=dispositions.filter(r=>r.outcome==='applied');
  return {rows:dispositions,destination:[{id:'b17',status:'cancelled',version:current},...applied.filter(r=>r.id!=='b17')].map(r=>applied.find(a=>a.id===r.id)||r)};
}
export function partition(query='october',december=false,detached=false,day=2,month=12) {
  const parts=[{id:'October',from:10,to:11,rows:['s7 · 19 Oct'],attached:!detached},{id:'November',from:11,to:12,rows:['s8 · 2 Nov'],attached:true},...(december?[{id:'December',from:12,to:13,rows:['s9 · 2 Dec'],attached:true}]:[])];
  const visited=parts.filter(p=>p.attached&&(query==='id'||query==='all'||query==='october'&&p.from===10||query==='boundary'&&p.from===11));
  const target=parts.find(p=>p.attached&&month>=p.from&&month<p.to);
  return {parts,visited,target:target?.id??null,day};
}
export function joinWork(selected=1,estimate=1,memory=40000) {
  const route=estimate<=10?'nested':'hash';
  return {route,probes:route==='nested'?selected:0,deliveryRows:route==='hash'?90000:selected,retained:route==='hash'?selected:0,batches:route==='hash'?Math.max(1,Math.ceil(selected/memory)):0};
}
