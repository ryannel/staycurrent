import { clamp, phase, ease, text, ball, moving } from '../bounce/scene.mjs';

// Choreography for illustrative schedules, not measured service timing.
const paper = 'var(--color-surface)';
const pulse = (t,start,x,y,colour='--teal',r=38) => { const p=phase(t,start,start+.12); return p>0&&p<1?`<circle cx="${x}" cy="${y}" r="${r+14*p}" fill="none" stroke="var(${colour})" stroke-width="1.5" opacity="${(1-p)*.65}"/>`:''; };
const line = (d, colour = '--color-text-secondary', extra = '') => `<path d="${d}" fill="none" stroke="var(${colour})" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const wrap = (body, small, height) => `<svg class="story-${small ? 'portrait' : 'landscape'}" viewBox="0 0 ${small ? 440 : 760} ${height}" aria-hidden="true">${body}</svg>`;
const both = (draw, t, variant) => draw(clamp(t), false, variant) + draw(clamp(t), true, variant);
const midpoint = (a, b, bend = 0) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + bend];
const path = (a, b, bend = 0, colour) => line(`M${a}Q${midpoint(a,b,bend)} ${b}`, colour);
const travel = (t, start, end, a, b, colour = '--coral', label = '', bend = 0) => moving(t, start, end, a, midpoint(a,b,bend), b, colour, false, label);
function app(x, y, label = 'App') {
  return `<rect x="${x-25}" y="${y-20}" width="50" height="40" rx="7" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.7"/>` +
    line(`M${x-25} ${y-7}H${x+25}`) + `<circle cx="${x-15}" cy="${y-14}" r="2" fill="var(--color-text-secondary)"/>` + text(x,y+46,label,19);
}
function server(x, y, label = 'Server', labelOffset = 49) {
  let s=`<circle cx="${x}" cy="${y}" r="27" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.7"/>`;
  for(let i=0;i<2;i++)s+=`<rect x="${x-14}" y="${y-13+i*15}" width="28" height="11" rx="3" fill="none" stroke="var(--color-text-secondary)"/><circle cx="${x+8}" cy="${y-7+i*15}" r="1.5" fill="var(--color-text-secondary)"/>`;
  return s+text(x,y+labelOffset,label,19);
}
function cache(x,y,value='',caption='Cache',colour='--teal',r=40) {
  return text(x,y-r-22,caption,22)+`<circle cx="${x}" cy="${y}" r="${r}" fill="${paper}" stroke="var(${colour})" stroke-width="1.8"/>`+
    (value?text(x,y+7,value,22):`<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="var(--color-text-secondary)" stroke-dasharray="2 4"/>`);
}
function database(x,y,value,changed=false) {
  const colour=changed?'--gold':'--color-text-secondary';
  return `<path d="M${x-34} ${y-23}V${y+22}C${x-34} ${y+39} ${x+34} ${y+39} ${x+34} ${y+22}V${y-23}" fill="${paper}" stroke="var(${colour})" stroke-width="1.7"/><ellipse cx="${x}" cy="${y-23}" rx="34" ry="11" fill="${paper}" stroke="var(${colour})" stroke-width="1.7"/>`+text(x,y+13,value,22)+text(x,y+65,'Database',20);
}
function note(x,y,lines,small=false) {
  return lines.map((s,i)=>text(x,y+i*27,s,small?19:22)).join('');
}

function age(t,small,variant='delay') {
  const {delay,lag}=variant==='slow'?{delay:40,lag:0}:variant==='replica'?{delay:20,lag:15}:{delay:20,lag:0};
  const W=small?440:760, left=45, right=W-45, span=delay+30+lag;
  const now=(delay+30)*phase(t,.06,.9), x=s=>left+(s+lag)/span*(right-left), X=x(now);
  const started=now>=delay, ended=now>=delay+30, ageNow=Math.round(now+lag);
  let s=text(W/2,32,'One answer. Two clocks.',25);
  s+=text(left,94,'',20)+text(W/2,96,`Answer age · ${ageNow} s`,23);
  s+=line(`M${left} 140H${right}`)+line(`M${left} 140H${X}`,'--coral');
  s+=ball(X,140,'--coral');
  s+=text(left,188,lag?`−${lag} s`:'0 s',17,'--color-text-secondary')+text(right,188,`${delay+30} s`,17,'--color-text-secondary');
  s+=text(W/2,246,started?`Time in cache · ${Math.round(Math.max(0,now-delay))} s`:'TTL has not started',23);
  s+=line(`M${x(delay)} 290H${right}`);
  if(started)s+=line(`M${x(delay)} 290H${X}`,'--teal')+ball(X,290,'--teal');
  s+=line(`M${x(delay)} 205V315`,'--color-text-secondary','stroke-dasharray="3 6"');
  s+=text(x(delay),349,'Saved',18)+text(x(delay),373,`${delay} s`,17,'--color-text-secondary');
  const limit=30-lag;
  s+=line(`M${x(limit)} 117V162`,'--gold')+text(x(limit),218,'Age limit',small?16:18,'--color-text-secondary');
  if(lag)s+=text(W/2,420,'The source was already 15 s behind.',small?18:21);
  else s+=text(W/2,420,'The age clock never restarts.',small?20:22);
  s+=note(W/2,466,ended?['TTL finished.',`The answer is ${delay+30+lag} seconds old.`]:started?['Saving a copy starts its TTL.', 'It does not make a new observation.']:['The answer is ageing', 'before it reaches the cache.'],small);
  return wrap(s,small,525);
}

// A reader and an edit request meet at the same database and cache.
function race(t,small,mode='plain') {
  const W=small?440:760;
  const A=[small?49:70,145], S=[small?180:280,145], C=[small?350:650,145];
  const M=[A[0],350], B=[S[0],350], D=[C[0],350];
  const token=mode!=='plain', delayed=mode==='unheard', changed=t>=.48, deleted=!delayed&&t>=.65;
  const filled=t>=.88&&(!token||delayed), reservation=token&&t>=.13&&!deleted&&!filled;
  const sourcePath=[S[0]+(small?10:35), D[1]];
  let s=path(A,S)+path(M,B)+path(B,D)+path(S,C);
  s+=line(`M${S}Q${sourcePath} ${D}`);
  s+=path(B,C,small?55:90,delayed?'--color-rule-strong':'--color-text-secondary');
  s+=app(...A)+app(...M,'Merchant')+server(...S,'Reader server',-45)+server(...B,'Writer server');
  s+=cache(...C,filled?'£20':reservation?'A':'');
  if(reservation)s+=text(C[0],C[1]+67,'Reserved',17,'--color-text-secondary');
  else if(deleted||filled)s+=text(C[0],C[1]+67,filled?'Revision 1':'Empty',17,'--color-text-secondary');
  s+=database(...D,changed?'£22':'£20',changed)+text(D[0],D[1]+91,changed?'Revision 2':'Revision 1',17,'--color-text-secondary');
  s+=travel(t,.01,.065,A,S);
  if(token)s+=travel(t,.065,.13,S,C,'--purple','A');
  s+=moving(t,.15,.21,S,sourcePath,D,'--coral');
  s+=moving(t,.21,.28,D,sourcePath,S,'--coral',false,'1');
  const held=[S[0],S[1]-99];
  if(t>=.28&&t<.76)s+=ball(...held,'--coral',false,Math.sin(t*24)*.15,1,'1')+text(held[0],held[1]-26,'£20 held',18);
  s+=travel(t,.32,.4,M,B,'--gold')+travel(t,.4,.48,B,D,'--gold')+travel(t,.48,.55,D,B,'--gold');
  if(!delayed)s+=travel(t,.55,.65,B,C,'--purple','×',small?55:90)+pulse(t,.65,...C,'--purple',40);
  else if(t>=.55)s+=text((B[0]+C[0])/2,small?285:265,'Delete delayed',small?17:19,'--color-text-secondary');
  const stop=token&&!delayed?[C[0]-58,C[1]]:C;
  s+=travel(t,.76,.88,S,stop,'--coral','1');
  if(token&&!delayed&&t>=.88){
    s+=line(`M${C[0]-50} ${C[1]-15}V${C[1]+15}`,'--purple');
    if(t<.96)s+=travel(t,.88,.96,stop,S,'--coral','1');
  }
  let lines;
  if(t<.28)lines=token?['Reserve permission, then read.']:['A request reads the old price.'];
  else if(t<.48)lines=['The read pauses with its answer.'];
  else if(t<.65)lines=['The merchant commits a new price.'];
  else if(t<.76)lines=delayed?['The cache has not heard about it.']:token?['Deletion revokes the reservation.']:['Deletion empties the cache.'];
  else if(t<.88)lines=['The old fill finally arrives.'];
  else lines=delayed?['The token matches.', 'The cached price is still old.']:token?['No matching token.', 'The old fill is refused.']:['The old price is back in the cache.'];
  s+=note(W/2,small?496:494,lines,small);
  return wrap(s,small,560);
}

function dependencies(t,small) {
  const W=small?440:760, D=[W/2,105], changed=t>=.25;
  const x1=small?112:205,x2=small?328:555,y=325,w=small?180:240;
  let s=text(W/2,32,'One price, two cached answers',small?24:26);
  s+=line(`M${D[0]} 185Q${D[0]} 205 ${x1} 246`)+line(`M${D[0]} 185Q${D[0]} 205 ${x2} 246`);
  s+=database(...D,changed?'£22':'£20',changed);
  for(const [x,title] of [[x1,'Product card'],[x2,'Under £21']])s+=`<rect x="${x-w/2}" y="246" width="${w}" height="165" rx="18" fill="${paper}" stroke="var(${changed?'--gold':'--teal'})" stroke-width="1.8"/>`+text(x,278,title,small?21:23);
  s+=text(x1,y,'Blue mug',21)+text(x1,y+41,'£20',29);
  s+=text(x2,y-6,'Spoon',20)+text(x2,y+29,'Blue mug',20)+text(x2,y+64,'Bowl',20);
  if(changed){
    s+=pulse(t,.25,...D,'--gold',43)+pulse(t,.42,x1,y,'--gold',70)+pulse(t,.62,x2,y,'--gold',70);
    s+=text(x1,451,'Old price',20)+text(x2,451,'Old membership',20);
  }
  s+=note(W/2,512,changed?['Both cached answers need attention.']:['The mug qualifies at £20.'],small);
  return wrap(s,small,550);
}

function outbox(t,small) {
  const W=small?440:760, TX=small?220:165, TY=small?120:160;
  const worker=small?[105,345]:[425,180], C=small?[335,345]:[660,180];
  const record=[TX+65,TY+22], item=[TX-65,TY+22], committed=t>=.15, done=t>=.93, cleared=t>=.81;
  let s=text(W/2,30,'The change carries its repair work',small?23:26);
  s+=path(record,worker)+path(worker,C);
  s+=`<rect x="${TX-128}" y="${TY-48}" width="256" height="132" rx="19" fill="${paper}" stroke="var(${committed?'--gold':'--color-text-secondary'})" stroke-width="1.8"/>`;
  s+=text(TX,TY-21,'One database commit',20);
  s+=text(item[0],item[1]-7,'Mug',19)+text(item[0],item[1]+26,committed?'£22':'£20',26);
  s+=`<rect x="${record[0]-36}" y="${record[1]-23}" width="72" height="53" rx="9" fill="${paper}" stroke="var(${done?'--teal':'--gold'})" stroke-width="1.6"/>`;
  s+=text(record[0],record[1]+7,committed?(done?'Done':'Pending'):'—',small?17:19);
  s+=text(record[0],TY+111,'Change record',17,'--color-text-secondary');
  s+=server(...worker,'Worker')+cache(...C,cleared?'':'£20');
  s+=travel(t,.2,.32,record,worker,'--gold')+travel(t,.34,.47,worker,[C[0]-48,C[1]],'--purple','×');
  if(t>=.47&&t<.64)s+=text(C[0]-55,C[1]-25,'×',28,'--coral');
  s+=travel(t,.66,.81,worker,C,'--purple','×')+travel(t,.82,.93,worker,record,'--teal');
  const status=t<.15?'Price edit arrives':t<.47?'The committed record survives':t<.64?'Deletion failed. Work stays pending.':t<.81?'The worker retries':t<.93?'Deletion succeeded':'Only now is the work complete';
  s+=note(W/2,small?476:390,small&&t>=.47&&t<.64?['Deletion failed.', 'Work stays pending.']:[status],small);
  return wrap(s,small,small?550:435);
}

function revisions(t,small) {
  const W=small?440:760,A=small?[48,185]:[65,205],S=small?[165,185]:[260,205],D=small?[335,95]:[620,95];
  const R1=small?[265,345]:[475,340],R2=small?[370,345]:[660,340];
  const selected=t>=.44;
  let s=path(A,S)+path(S,D,-35)+path(S,R1,25)+path(S,R2,40,selected?'--teal':'--color-text-secondary');
  s+=app(...A)+server(...S,'Server',-45)+database(...D,'2');
  s+=text(D[0],D[1]-53,'Current revision',small?18:20);
  s+=cache(...R1,'£20',':r1','--color-text-secondary',small?34:42)+cache(...R2,'£22',':r2','--teal',small?34:42);
  s+=text((R1[0]+R2[0])/2,R1[1]+80,'Cache',22);
  s+=travel(t,.02,.12,A,S)+travel(t,.14,.29,S,D,'--coral','',-35)+travel(t,.29,.44,D,S,'--gold','2',-35);
  s+=travel(t,.48,.64,S,R2,'--coral','2',40)+travel(t,.64,.8,R2,S,'--teal','2',40)+travel(t,.8,.92,S,A,'--teal','2');
  if(selected)s+=pulse(t,.64,...R2,'--teal',small?34:42);
  s+=note(W/2,small?484:480,selected?['The selected revision chooses the key.']:['Ask the source which revision to use.'],small);
  return wrap(s,small,530);
}

function knowledge(t,small) {
  const W=small?440:760,row=small?310:290;
  let s=text(W/2,30,'The source is already at revision 2',small?22:25);
  s+=line(`M25 ${row+58}H${W-25}`,'--color-text-secondary','opacity=".55"');
  for(let i=0;i<2;i++){
    const y=145+i*(row+30),lost=i===1&&t>=.4,arrived=t>=.82;
    const S=[small?80:160,y],C=[small?335:600,y];
    s+=text(W/2,y-65,i?'Revision knowledge lost':'Revision knowledge retained',small?20:23);
    s+=path(S,C)+server(...S)+cache(...C,arrived&&lost?'£20':lost?'?':'≥ 2','',lost?'--coral':'--teal',small?39:45)+text(C[0],C[1]+67,'Cache',20);
    if(t<.6)s+=ball(S[0]+65,S[1]-20,'--coral',false,0,1,'1');
    s+=travel(t,.6,.82,S,lost?C:[C[0]-55,C[1]],'--coral','1');
    if(arrived&&!lost)s+=line(`M${C[0]-48} ${C[1]-16}V${C[1]+16}`,'--purple');
    if(t>=.4&&t<.6&&i)s+=`<g opacity="${1-phase(t,.4,.6)}">${text(C[0],C[1]-70*ease(phase(t,.4,.6)),'2',25)}</g>`;
    const lines=arrived?(lost?['Missing treated as zero:', 'old fill accepted.']:['Older fill refused.']):lost?['Missing means unknown.']:['A delayed revision 1 is waiting.'];
    s+=note(W/2,y+113,lines,small);
  }
  return wrap(s,small,small?720:680);
}

export const scenes={
  age:{title:'Two clocks for one answer',duration:12000,defaultVariant:'delay',actions:[{value:'delay',label:'Slow fill'},{value:'slow',label:'Even slower fill'},{value:'replica',label:'Lagging replica'}],
    alt:'An answer starts ageing when the source is observed. With a twenty-second fill delay, its thirty-second TTL starts at twenty and ends at fifty, when the observation is fifty seconds old. A thirty-second age allowance ends earlier, at thirty.',
    altFor:v=>v==='slow'?'A forty-second fill delay makes the answer too old for a thirty-second observation-age allowance before it enters the cache. Its insertion TTL would still last thirty seconds.':v==='replica'?'The source snapshot is already fifteen seconds old. A twenty-second delay makes it thirty-five seconds old at insertion and sixty-five seconds old when a thirty-second insertion TTL ends.':'A twenty-second delay precedes a thirty-second insertion TTL. The answer is fifty seconds old when the TTL ends; a thirty-second age allowance ended at time thirty.',
    caption:'The upper clock includes time before insertion. The lower clock counts only time in the cache. Timings and the exact replica lag are illustrative.',render:(t,v)=>both(age,t,v)},
  race:{title:'A late fill restores the old price',duration:16000,alt:'A reader asks for the mug. Its server reads revision 1, £20, then pauses. A merchant request commits revision 2, £22, and deletes the cache entry. The reader server resumes and saves its old revision 1. Every operation succeeds, yet the cache is stale.',caption:'The price edit and deletion succeed before the old fill arrives. One mug, one cache key; the requests overlap. Timing is illustrative.',render:t=>both(race,t,'plain')},
  dependencies:{title:'One change affects two answers',duration:8500,alt:'The database changes the mug price from £20 to £22. The cached product card still displays £20, and a separately cached list of products under £21 still includes the mug. Both depend on the changed price.',caption:'Lines show dependencies. The cached list can be wrong even when it stores only product IDs: the mug no longer meets its filter.',render:t=>both(dependencies,t)},
  outbox:{title:'Keep invalidation work until it succeeds',duration:13500,alt:'One database transaction commits the £22 price and a pending change record. A worker reads that record. Its first cache deletion fails, so the record remains pending. A later retry succeeds; only then does the worker mark the work complete.',caption:'The outbox makes the change and its repair record durable together. Retrying delivery does not prevent a separate old fill from arriving later.',render:t=>both(outbox,t)},
  revisions:{title:'Select the revision before the card',duration:12500,alt:'An app request reaches the server. The server reads current revision 2 from the database, then retrieves the revision 2 card from the cache. Revision 1 remains under a different key and is not selected.',caption:'A cache hit still needs an authoritative revision lookup. Only the source-revision suffixes are drawn; the rest of the product key is unchanged.',render:t=>both(revisions,t)},
  knowledge:{title:'Remembering a revision only works while it survives',duration:10500,alt:'The same delayed revision 1 fill reaches two caches after the source has reached revision 2. A cache retaining revision 2 refuses it. A cache that loses the number and incorrectly treats missing as zero accepts it.',caption:'The lower case deliberately uses an unsafe rule. Missing revision knowledge must block or validate the fill, not invent permission.',render:t=>both(knowledge,t)},
  token:{title:'Deletion revokes permission to fill',duration:16000,alt:'The reader server reserves token A before reading the mug at revision 1. A merchant commits revision 2 and deletes the loading record. The delayed fill presents token A, but the record is absent, so publication is rejected.',caption:'The reservation precedes the read. Comparing the token and publishing are one atomic cache operation; deletion can revoke either a loading or a ready record.',render:t=>both(race,t,'token')},
  unheard:{title:'A token cannot reveal an unseen change',duration:16000,alt:'The reader reserves token A and reads revision 1. A merchant commits revision 2, but its invalidation is delayed. The old fill finds token A intact and publishes revision 1. The cache has not yet heard about the new source price.',caption:'A matching token proves that its reservation has not been revoked. It does not prove that the source is unchanged.',render:t=>both(race,t,'unheard')},
};
