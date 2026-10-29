import { rows, keyTrace, byTime, dateLabel } from '../../relational-rebuild-indexes/model.mjs';
import { makeScene, svg, text, line, path, travel, ball, ring, database, phase } from '../drawing.mjs';
const colour = row => ['--blue','--gold','--purple'][row.c-1001];
const dot = (x,y,c,r=10) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(${c})" stroke="var(${c})" stroke-width="1.7"/>`;
const visitedRing = (x,y) => `<circle cx="${x}" cy="${y}" r="17" fill="none" stroke="var(--color-accent)" stroke-width="1.8"/>`;
const choices = (label,value,items) => ({label,value,options:items.map(([value,label])=>({value,label}))});
function page(x,y,contents,read=false) {
  return `<rect x="${x-37}" y="${y-29}" width="74" height="66" rx="8" fill="var(--color-surface)" stroke="var(${read?'--color-accent':'--color-text-secondary'})" stroke-width="${read?2:1.4}"/>`+contents.map((row,i)=>dot(x+(i-1)*21,y+4,colour(row),7)).join('');
}
function tree(t,small) {
  const W=small?440:760,root=[W/2,70],leafX=[W*.18,W*.5,W*.82],leafY=210,pageX=[W*.13,W*.375,W*.625,W*.87],pageY=435;
  let s=text(W/2,25,'Find customer 1001',23);
  leafX.forEach(x=>s+=path(root,[x,leafY]));
  s+=ring(...root,'Root','', '--color-text-secondary',27);
  leafX.forEach((x,i)=>{
    s+=`<rect x="${x-51}" y="${leafY-30}" width="102" height="60" rx="9" fill="var(--color-surface)" stroke="var(${i===0&&t>.32?'--blue':'--color-text-secondary'})" stroke-width="1.7"/>`;
    rows.filter(r=>r.c===1001+i).forEach((r,j)=>s+=dot(x+(j-1.5)*22,leafY,colour(r),7));
    s+=text(x,leafY-48,String(1001+i),22);
  });
  s+=travel(t,.08,.3,root,[leafX[0],leafY],'--blue');
  pageX.forEach((x,i)=>{
    const reached=t>=.54+i*.105;
    s+=path([leafX[0],leafY+30],[x,pageY-29],45,'--color-rule-strong');
    s+=page(x,pageY,rows.slice(i*3,i*3+3),reached)+text(x,pageY+66,`Page ${i+1}`,small?20:22);
    s+=travel(t,.44+i*.105,.54+i*.105,[leafX[0],leafY+30],[x,pageY-29],'--blue','',45);
    if(reached)s+=visitedRing(x-21,pageY+4);
  });
  const reached=pageX.filter((_,i)=>t>=.54+i*.105).length;
  s+=text(W/2,555,t<.32?'Follow the matching branch':t<.44?'Four adjacent entries':`${reached} table ${reached===1?'page':'pages'} reached`,small?22:25);
  s+=text(W/2,588,t<.44?'The table stays where it is.':`2 index pages · ${reached} table pages`,20,'--color-text-secondary');
  return svg(s,small,615);
}
function keys(t,small,variant='history') {
  const W=small?440:760,trace=keyTrace(variant),L=38,dx=(W-76)/11,Y=130,D=[W/2,300];
  const finished=Math.min(trace.visited.length,Math.floor(phase(t,.12,.8)*trace.visited.length));
  const seen=trace.visited.slice(0,finished),fetched=trace.fetched.filter(row=>seen.some(r=>r.id===row.id));
  let s=text(W/2,33,'Newest two orders · customer 1001',small?22:25)+text(W/2,65,'Since 1 October',20,'--color-text-secondary');
  s+=line(`M${L} ${Y}H${W-L}`,'--color-rule-strong');
  trace.ordered.forEach((r,i)=>{const x=L+i*dx;s+=dot(x,Y,colour(r),small?9:11);if(seen.some(v=>v.id===r.id))s+=visitedRing(x,Y);});
  [1001,1002,1003].forEach((c,i)=>{const x=W*(i+1)/4;s+=dot(x-27,195,['--blue','--gold','--purple'][i],6)+text(x+9,202,String(c),20);});
  trace.visited.forEach((r,i)=>{
    const a=.12+i*.68/trace.visited.length,b=a+.68/trace.visited.length,source=[L+trace.ordered.indexOf(r)*dx,Y];
    if(t>=a&&t<b)s+=`<circle cx="${source[0]}" cy="${Y}" r="21" fill="none" stroke="var(--color-accent)" stroke-width="2"/>`;
    if(trace.fetched.some(f=>f.id===r.id))s+=travel(t,a,b,source,D,colour(r));
  });
  s+=database(...D,'Table rows');
  s+=text(W/2,403,`${finished} ${finished===1?'entry':'entries'} examined · ${fetched.length} ${fetched.length===1?'row':'rows'} fetched`,small?21:25);
  if(t>=.82){s+=text(W/2,449,variant==='customer'?'Sort 3 eligible rows':'Already in the requested order',small?22:25);trace.result.forEach((row,i)=>{const x=W*(i? .72:.28);s+=ball(x,500,'--blue')+text(x,544,String(row.id),21)+text(x,574,dateLabel(row),19,'--color-text-secondary');});}
  return svg(s,small,600);
}
function locality(t,small,v='scattered:1001') {
  const [layout,maximum]=v.split(':'),grouped=layout==='grouped',W=small?440:760;
  const ordered=grouped?[...rows].sort((a,b)=>a.c-b.c||byTime(a,b)):[...rows],matches=ordered.filter(r=>r.c<=Number(maximum));
  const n=Math.min(matches.length,Math.floor(phase(t,.08,.84)*matches.length)),done=matches.slice(0,n),pageFor=r=>Math.floor(ordered.findIndex(x=>x.id===r.id)/3),visited=new Set(done.map(pageFor));
  const positions=Array.from({length:4},(_,i)=>small?[125+i%2*190,210+Math.floor(i/2)*170]:[100+i*185,270]);
  const origin=[W/2,65];let s=ring(...origin,'Index matches',String(matches.length),'--blue');
  positions.forEach((p,i)=>s+=path([origin[0],origin[1]+38],[p[0],p[1]-29],0,'--color-rule-strong'));
  positions.forEach((p,i)=>s+=page(...p,ordered.slice(i*3,i*3+3),visited.has(i))+text(p[0],p[1]+68,`Page ${i+1}`,21));
  matches.forEach((r,i)=>{const a=.08+i*.76/matches.length,b=a+.76/matches.length;s+=travel(t,a,b,origin,positions[pageFor(r)],colour(r));});
  const foot=small?505:430;
  s+=text(W/2,foot,`${n} row ${n===1?'fetch':'fetches'}`,26)+text(W/2,foot+37,`${visited.size} distinct table ${visited.size===1?'page':'pages'}`,24);
  s+=text(W/2,foot+79,'A full scan visits all four pages.',small?21:23,'--color-text-secondary');
  return svg(s,small,foot+110);
}
function cover(t,small,v='include:confirmed') {
  const [variant,visibility]=v.split(':'),W=small?440:760,all=rows.filter(r=>r.c===1001&&r.date>='2026-10-01').sort(byTime),run=variant==='partial'?all.filter(r=>r.status==='paid'):all;
  const n=Math.min(run.length,Math.floor(phase(t,.1,.78)*run.length)),needsTable=variant==='key'||visibility==='check',D=[W/2,310];
  let s=text(W/2,34,'Find the newest paid order',small?23:26);
  run.forEach((r,i)=>{
    const x=run.length===1?W/2:W*(i+1)/4,y=150,done=i<n,a=.1+i*.68/run.length,b=a+.68/run.length;
    s+=text(x,96,dateLabel(r),21)+dot(x,y,r.status==='paid'?'--teal':'--gold',13);
    if(done)s+=visitedRing(x,y);
    s+=text(x,202,variant==='key'?'Fetch status':r.status,small?19:22);
    if(needsTable){s+=path([x,y+26],[D[0],D[1]-33],0,'--color-rule-strong');s+=travel(t,a,b,[x,y+26],D,'--blue');}
    else if(t>=a&&t<b)s+=travel(t,a,b,[x,y-38],[x,y],'--blue');
    if(done&&r.status==='pending')s+=text(x,234,'Rejected',18,'--color-text-secondary');
  });
  s+=database(...D,'Table rows',String(needsTable?n:0));
  const visits=needsTable?n:0;
  s+=text(W/2,425,`${n} ${n===1?'entry':'entries'} · ${visits} table ${visits===1?'fetch':'fetches'}`,small?23:27);
  if(n===run.length)s+=text(W/2,475,'Paid order found · 100012',small?23:27);
  s+=text(W/2,520,visibility==='check'?'Visibility needs a table-row check':'Visibility confirmed without the row',small?20:22,'--color-text-secondary');
  return svg(s,small,555);
}
export const scenes={
  tree:makeScene('Adjacent entries, scattered rows',10000,tree,'Customer 1001 follows the root to one leaf. Its four adjacent entries point to four separate table pages. The search visits two index pages and four table pages; it does not reorder the table.'),
  keys:makeScene('The same request, three index orders',10500,keys,'The same twelve entries are arranged by the selected key. Customer only examines and fetches four rows, sorts three eligible rows, then returns two. Customer then time examines and fetches two. Time first examines six entries and fetches two. Every route returns orders 100003 and 100042.', '', {defaultVariant:'history',choices:[choices('Index key','history',[['customer','Customer only'],['history','Customer, time and ID'],['time','Time, customer and ID']])]}),
  locality:makeScene('Where matching rows live',10000,locality,'With customers mixed, four, eight or twelve matching rows reach all four pages. Grouping the same rows by customer reduces those page counts to two, three or four. Repeated visits to a page are still work; the drawing does not count physical storage reads.','',{defaultVariant:'scattered:1001',choices:[choices('Table layout','scattered',[['scattered','Mixed customers'],['grouped','By customer']]),choices('Match','1001',[['1001','Customer 1001'],['1002','Customers 1001 and 1002'],['1003','All three customers']])]}),
  cover:makeScene('Fewer fetches or fewer entries?',10000,cover,'The query wants the newest paid order for customer 1001. The full range contains two pending entries before one paid entry. Key only must fetch all three rows for status. Including status avoids those fetches only when visibility can also be confirmed without the row. A paid-only partial index contains just the one eligible entry; its visibility check may still require a table fetch.','',{defaultVariant:'include:confirmed',choices:[choices('Index stores','include',[['key','Key only'],['include','Key and status'],['partial','Paid-only key and status']]),choices('Visibility','confirmed',[['confirmed','Confirmed without the row'],['check','Check the table row']])]})
};
