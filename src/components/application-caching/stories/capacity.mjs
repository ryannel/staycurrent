import { clamp, phase, ease, text, stroke, ball, moving, pulse } from '../bounce/scene.mjs';
import { burstTrace } from '../misses/model.mjs';
import { replay, trace } from '../memory/model.mjs';

const paper='var(--color-surface)';
const ink='var(--color-text-secondary)';
const palette=['--coral','--purple','--teal','--gold','--blue','--color-accent'];
export const names={P7:'Mug',P3:'Jug',P8:'Spoon',P9:'Bowl',P40:'Vase',Q:'Catalogue'};
const productColours={P7:'--coral',P3:'--blue',P8:'--purple',P9:'--teal',P40:'--gold',Q:'--color-accent'};
const rect=(x,y,w,h,colour='--color-rule-strong',r=14,fill=paper)=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${h}" rx="${r}" fill="${fill}" stroke="var(${colour})" stroke-width="1.7"/>`;
const svg=(content,small,height)=>`<svg class="story-${small?'portrait':'landscape'}" viewBox="0 0 ${small?440:760} ${height}" aria-hidden="true">${content}</svg>`;
const both=(fn,t,v)=>fn(clamp(t),false,v)+fn(clamp(t),true,v);
function app(x,y,label='App'){
  return rect(x-27,y-21,54,42,'--color-text-secondary',7)+stroke(`M${x-27} ${y-9}H${x+27}`,'--color-text-secondary',1)+`<circle cx="${x-17}" cy="${y-15}" r="2" fill="${ink}"/><circle cx="${x-10}" cy="${y-15}" r="2" fill="${ink}"/>`+text(x,y+49,label,20);
}
function server(x,y,label='Server',labelOffset=-45){
  let s=`<circle cx="${x}" cy="${y}" r="28" fill="${paper}" stroke="${ink}" stroke-width="1.7"/>`;
  for(let i=0;i<2;i++)s+=rect(x-14,y-13+i*15,28,10,'--color-text-secondary',3)+`<circle cx="${x+8}" cy="${y-8+i*15}" r="1.6" fill="${ink}"/>`;
  return s+text(x,y+labelOffset,label,20);
}
function database(x,y,label='Database'){
  return `<path d="M${x-31} ${y-20}V${y+20}C${x-31} ${y+37} ${x+31} ${y+37} ${x+31} ${y+20}V${y-20}" fill="${paper}" stroke="${ink}" stroke-width="1.7"/><ellipse cx="${x}" cy="${y-20}" rx="31" ry="11" fill="${paper}" stroke="${ink}" stroke-width="1.7"/>`+text(x,y+60,label,20);
}
function cache(x,y,filled,label='Cache'){
  return `<circle cx="${x}" cy="${y}" r="37" fill="${paper}" stroke="var(${filled?'--teal':'--color-text-secondary'})" stroke-width="1.8"/>`+text(x,y-53,label,21)+(filled?text(x,y+6,'Mug',18):text(x,y+6,'empty',16,'--color-text-secondary'));
}
const path=(a,b,bend=0)=>stroke(`M${a}Q${(a[0]+b[0])/2} ${(a[1]+b[1])/2+bend} ${b}`,'--color-text-secondary',1.5);
const flight=(t,start,end,a,b,c,index=0,reply=false)=>moving(t,start,end,a,c,b,palette[index%palette.length],reply);
const note=(w,y,value,small)=>text(w/2,y,value,small?20:23);

function burst(t,small,variant='independent'){
  const W=small?440:760,H=small?490:405,shared=variant==='shared',duration=variant==='fast'?40:100;
  const run=burstTrace({shared,duration}),now=Math.max(-15,t*235-15),state=run.filter(s=>s.time<=now).at(-1)??run[0];
  const A=[small?54:74,small?185:190],S=[small?190:260,small?185:190],C=[small?335:470,130],D=[small?335:665,small?325:235];
  let s=text(W/2,30,shared?'Share one fill':duration===40?'A faster source':'Each request starts a read',24);
  s+=path(A,S)+path(S,C,-20)+path(S,D,30);
  s+=app(...A)+server(...S,'Server',-90)+cache(...C,state.cached)+database(...D);
  for(const [i,caller] of state.callers.entries()){
    const age=now-caller.at;
    if(age<0)continue;
    s+=flight(now,caller.at,caller.at+10,A,S,[(A[0]+S[0])/2,A[1]-28],i);
    if(caller.state==='Waiting'&&age>=10)s+=ball(S[0]-30+i*20,S[1]-57-Math.abs(Math.sin(t*25+i))*3,palette[i]);
    const hit=caller.state==='Cache hit';
    const end=hit?caller.at+20:run.at(-1).loaders.find(l=>l.id===caller.loader)?.end;
    if(hit)s+=flight(now,caller.at+10,caller.at+15,S,C,[(S[0]+C[0])/2,C[1]],i)+flight(now,caller.at+15,caller.at+20,C,S,[(S[0]+C[0])/2,C[1]],i,true);
    if(Number.isFinite(end))s+=flight(now,end,end+16,S,A,[(A[0]+S[0])/2,A[1]+28],i,true);
  }
  for(const [i,loader] of state.loaders.entries()){
    const start=loader.start+10,end=loader.end;
    s+=flight(now,start,start+6,S,D,[(S[0]+D[0])/2,D[1]-30],i);
    if(now>=start+6&&now<end-20)s+=ball(D[0]+(i-1.5)*17,D[1]+2-Math.abs(Math.sin(t*22+i))*7,palette[i]);
    // Complete the visible fill at the model event, before same-time hits.
    s+=flight(now,end-20,end-8,D,S,[(S[0]+D[0])/2,D[1]+45],i,true);
    s+=flight(now,end-8,end,S,C,[(S[0]+C[0])/2,C[1]],i,true);
  }
  s+=note(W,H-34,`${state.started} source ${state.started===1?'read':'reads'} · ${state.waiting} waiting`,small);
  return svg(s,small,H);
}

function timelineRow(small,y,label,start,end,now,max,colour,ending){
  const W=small?440:760,left=small?40:60,right=W-left,width=right-left;
  let s=text(left,y-19,label,small?19:21);
  // Labels sit above their tracks, rather than over time or moving dots.
  s=s.replace('text-anchor="middle"','text-anchor="start"');
  s+=stroke(`M${left} ${y+10}H${right}`,'--color-rule-strong',2);
  const a=left+start/max*width,b=left+Math.min(end,Math.max(start,now))/max*width;
  if(now>=start){s+=stroke(`M${a} ${y+10}H${b}`,colour,6);s+=ball(b,y+10,colour,now>=end);}
  if(now>=end)s+=text(right,y+43,ending,small?16:18,'--color-text-secondary').replace('text-anchor="middle"','text-anchor="end"');
  return s;
}
function waiting(t,small){
  const W=small?440:760,now=t*115;
  let s=text(W/2,30,'One caller leaves. The work continues.',small?21:26);
  s+=timelineRow(small,110,'Caller A',0,50,now,110,'--coral','Deadline · no answer');
  s+=timelineRow(small,220,'Caller B',20,100,now,110,'--purple','Answer received');
  s+=timelineRow(small,330,'Shared source read',0,100,now,110,'--teal','Source slot released');
  s+=text(W/2,420,`${Math.min(100,Math.floor(now))} ms`,23,'--color-text-secondary');
  return svg(s,small,450);
}
function lease(t,small){
  const W=small?440:760,now=t*155;
  let s=text(W/2,30,'Permission can end before work does',small?21:26);
  s+=timelineRow(small,100,'Server A · lease',0,80,now,150,'--gold','Lease expired');
  s+=timelineRow(small,210,'Server A · source read',0,120,now,150,'--coral','Old token: fill refused');
  s+=timelineRow(small,320,'Server B · source read',90,140,now,150,'--purple','Current token: fill allowed');
  const count=Number(now<120)+Number(now>=90&&now<140);
  s+=note(W,416,`${count} source ${count===1?'read':'reads'} running`,small);
  s+=text(W/2,454,`${Math.min(140,Math.floor(now))} ms`,19,'--color-text-secondary');
  return svg(s,small,480);
}
function refresh(t,small,variant='failure'){
  const W=small?440:760,H=small?570:520,now=20+t*12,A=[small?58:90,145],S=[small?190:310,145],C=[small?335:590,145],D=[small?335:590,290];
  const valid=now<30||variant==='success',refreshed=variant==='success'&&now>=26;
  let s=text(W/2,30,'Refreshing leaves the old deadline intact',small?20:25);
  s+=path(A,S)+path(S,C)+path(S,D,20)+app(...A)+server(...S)+cache(...C,valid)+database(...D);
  s+=text(C[0],C[1]+65,refreshed?'new copy':now<30?'old copy':'unusable',18,'--color-text-secondary');
  const left=40,right=W-40,y=H-120,x=left+(Math.min(now,30)-20)/10*(right-left);
  s+=stroke(`M${left} ${y}H${right}`,'--color-text-secondary',2);
  for(const n of [20,24,26,30]){const xx=left+(n-20)/10*(right-left);s+=stroke(`M${xx} ${y-8}V${y+8}`,'--color-text-secondary')+text(xx,y+35,`${n}s`,18);}
  s+=ball(x,y,now>=30&&!refreshed?'--coral':'--teal');
  if(now>=24&&now<26){s+=text(W/2,H-25,'One refresh is running',22);s+=flight(now,24,24.5,S,D,[D[0],S[1]+35],2);if(now>=24.5&&(variant!=='success'||now<25.3))s+=ball(D[0],D[1]-Math.abs(Math.sin(t*30))*8,'--teal');}
  else if(now>=26)s+=text(W/2,H-25,refreshed?'A replacement is ready':now<30?'Refresh failed; the deadline stays':'The next request must miss',small?20:23);
  if(variant==='success')s+=flight(now,25.3,25.65,D,S,[S[0],D[1]],2,true)+flight(now,25.65,26,S,C,[(S[0]+C[0])/2,115],2,true);
  for(const [i,start] of [24,25].entries())s+=flight(now,start,start+.25,A,S,[(A[0]+S[0])/2,110],i)+flight(now,start+.25,start+.6,S,A,[(A[0]+S[0])/2,180],i,true);
  return svg(s,small,H);
}
function admission(t,small,variant='fast'){
  const W=small?440:760,H=small?570:480,slow=variant==='slow',end=slow?200:100,now=t*230;
  const A=[small?55:80,135],S=[small?188:280,135],D=[small?345:650,135];
  const slotX=small?275:485,slotY=small?250:245;
  let s=text(W/2,30,'Different answers share one source budget',small?20:25);
  s+=path(A,S)+path(S,D)+app(...A)+server(...S)+database(...D);
  s+=text(slotX,slotY-30,'Source slots',20);
  for(let i=0;i<2;i++){
    const xx=slotX+(i-.5)*48;s+=rect(xx-20,slotY-17,40,40,'--color-text-secondary',12);
    if(now>=15&&now<end)s+=ball(xx,slotY+2-Math.abs(Math.sin(t*24+i))*4,palette[i]);
  }
  const qx=small?97:210,qy=slotY;
  s+=text(qx,qy-30,'Queue',20);
  for(let i=0;i<2;i++){const xx=qx+(i-.5)*48;s+=rect(xx-20,qy-17,40,40,'--color-rule-strong',12);if(now>=15&&now<Math.min(end,150))s+=ball(xx,qy+2,palette[i+2]);}
  for(let i=0;i<6;i++)s+=flight(now,i*2,15+i*2,A,S,[(A[0]+S[0])/2,100-i*5],i);
  if(now>=24){s+=text(W/2,small?350:340,'2 requests turned away',20,'--color-text-secondary');}
  const outcome=now<Math.min(end,150)?'Two reads run. Two callers wait.':slow&&now<end?'Callers timed out; slots stay occupied.':slow?'Work finished too late for its callers.':'Two answers; queued work cannot finish in time.';
  const y=small?405:395;
  if(small){const lines=now<Math.min(end,150)?['Two reads run.','Two callers wait.']:slow&&now<end?['Callers timed out.','Slots stay occupied.']:slow?['Work finished too late','for its callers.']:['Two answers.','Queued work has no time left.'];lines.forEach((line,i)=>s+=note(W,y+i*30,line,true));}else s+=note(W,y,outcome,small);
  s+=text(W/2,H-25,`${now<15?0:2} source reads · ${!slow&&now>=end?2:0} on-time answers`,19,'--color-text-secondary');
  return svg(s,small,H);
}

function workingSet(t,small){
  const W=small?440:760,H=small?430:350,A=[small?58:80,150],S=[small?190:270,150],C=[small?335:490,105],D=[small?335:660,small?280:215];
  const k=Math.min(6,Math.floor(t*7)),local=t*7-k,ids=['P7','P3','P7','P3','P7','P3'];
  const held=k===0?[]:k===1?['P7']:['P7','P3'];
  let s=text(W/2,28,'A small working set',25)+path(A,S)+path(S,C,-15)+path(S,D,20)+app(...A)+server(...S)+database(...D);
  s+=text(C[0],C[1]-52,'Cache',21)+rect(C[0]-53,C[1]-30,106,65,'--teal',22);
  held.forEach((id,i)=>s+=text(C[0],C[1]-7+i*25,names[id],18));
  if(k<6){
    const id=ids[k],c=productColours[id],hit=k>=2;
    const AS=[(A[0]+S[0])/2,A[1]],SC=[(S[0]+C[0])/2,(S[1]+C[1])/2-15],SD=[(S[0]+D[0])/2,(S[1]+D[1])/2+20];
    s+=text(W/2,small?370:300,`${names[id]} · ${hit?'hit':'miss'}`,22);
    s+=moving(local,0,.16,A,AS,S,c)+moving(local,.16,.3,S,SC,C,c);
    if(hit)s+=moving(local,.3,.62,C,SC,S,c,true)+moving(local,.62,.9,S,AS,A,c,true);
    else s+=moving(local,.3,.39,C,SC,S,c)+moving(local,.39,.53,S,SD,D,c)+moving(local,.53,.67,D,SD,S,c,true)+moving(local,.67,.77,S,SC,C,c,true)+moving(local,.77,.85,C,SC,S,c,true)+moving(local,.85,1,S,AS,A,c,true);
  }
  s+=text(W/2,H-14,`${Math.min(k,2)} cache misses · ${Math.max(0,k-2)} hits`,19,'--color-text-secondary');
  return svg(s,small,H);
}
function bytes(t,small){
  const W=small?440:760,left=small?35:75,width=W-2*left;
  const parts=[{name:'Value',size:900,colour:'--teal'},{name:'Key',size:29,colour:'--coral'},{name:'Bookkeeping',size:71,colour:'--purple'},{name:'Allocation gap',size:24,colour:'--gold'}];
  let s=text(W/2,30,'An entry costs more than its value',small?22:27),offset=0;
  parts.forEach((p,i)=>{const progress=ease(phase(t,i*.16,i*.16+.16)),w=p.size/1024*width;s+=rect(left+offset,85,w*progress,64,p.colour,0,`var(${p.colour})`);offset+=w;const yy=195+i*42;s+=`<circle cx="${left+8}" cy="${yy-5}" r="6" fill="var(${p.colour})"/>`+text(left+26,yy,p.name,20).replace('text-anchor="middle"','text-anchor="start"')+text(W-left,yy,`${p.size} B`,20).replace('text-anchor="middle"','text-anchor="end"');});
  s+=text(W/2,405,'1 KiB charged to the entry budget',small?21:24);
  return svg(s,small,440);
}
function expiry(t,small){
  const W=small?440:760,now=t*35,left=small?40:65,right=W-left;
  let s=text(W/2,30,'A lifetime is not a reserved place',small?22:27);
  [['Evicted for space',10,'--coral'],['Expires on time',30,'--teal']].forEach(([label,end,colour],i)=>{
    const y=130+i*190;s+=text(W/2,y-43,label,23)+stroke(`M${left} ${y}H${right}`,'--color-rule-strong',2);
    const x=left+Math.min(now,end)/30*(right-left);s+=stroke(`M${left} ${y}H${x}`,colour,5);
    const deadline=left+end/30*(right-left);s+=stroke(`M${deadline} ${y-17}V${y+18}`,colour,2)+text(deadline,y+48,`${end}s`,20);
    if(now<end)s+=ball(x,y,colour);else s+=text(W/2,y+87,'Next lookup: miss',21);
  });
  return svg(s,small,440);
}

export function renderReplay(t,options={}){
  const config={capacity:3,policy:'lru',maxEntry:3,...options},run=replay(config);
  return both((fraction,small)=>{
    const W=small?440:760,legend=small&&config.capacity>5,H=legend?590:small?480:450,n=Math.min(trace.length,Math.floor(fraction*(trace.length+1))),step=run[n],next=run[Math.min(n+1,trace.length)],p=phase(fraction*(trace.length+1)-n,0,.8);
    const width=W-60,left=30,unit=width/config.capacity,y=legend?280:small?240:210;
    let s=text(W/2,30,n===trace.length?'The request sequence is complete':n<6?'Repeated favourites':n<8?'A brief browse':n<10?'Back to the favourites':'Popularity changes',small?22:27);
    const rowY=80;
    trace.forEach((request,i)=>{const x=30+i*(W-60)/(trace.length-1),current=i===n;s+=`<circle cx="${x}" cy="${rowY}" r="${current?7:4}" fill="${i<n?'var('+productColours[request.id]+')':paper}" stroke="var(${productColours[request.id]})" stroke-width="1.5"/>`;});
    const request=next.request;
    s+=text(W/2,140,n===trace.length?'All 18 requests served':`${names[request.id]} · ${next.hit?'hit':'miss'}`,small?23:26);
    s+=text(W/2,y-55,`Cache contents · ${config.capacity} KiB`,22)+rect(left-5,y-36,width+10,74,'--color-text-secondary',24);
    let offset=0;
    const displayed=p>.8?next:step;
    const removed=new Set(next.removed??[]);
    displayed.residents.forEach((entry,index)=>{
      const x=left+offset+unit*entry.size/2;offset+=unit*entry.size;
      const leaving=n<trace.length&&displayed===step&&removed.has(entry.id)?ease(phase(p,.5,.8)):0;
      const arriving=n<trace.length&&displayed===next&&!step.residents.some(old=>old.id===entry.id)?ease(phase(p,.8,1)):1;
      s+=`<g transform="translate(0 ${leaving*38+(1-arriving)*-20})" opacity="${(1-leaving)*arriving}">`;
      s+=rect(x-unit*entry.size/2+3,y-26,unit*entry.size-6,53,productColours[entry.id],12);
      s+=(legend?text(x,y+7,String(index+1),20):text(x,y-3,names[entry.id],small?18:21)+text(x,y+19,`${entry.size} KiB`,15,'--color-text-secondary'))+'</g>';
      if(legend)s+=text(left+(index%2)*195,y+80+Math.floor(index/2)*34,`${index+1}. ${names[entry.id]} · ${entry.size} KiB`,18).replace('text-anchor="middle"','text-anchor="start"');
    });
    // This is a close-up of retention, not a network route. A hit lights its
    // resident; a completed source answer is admitted by the entry transition
    // above. No cache-to-source request is implied.
    if(n<trace.length&&next.hit){
      let before=0;
      for(const entry of step.residents){
        if(entry.id===request.id){
          const glow=Math.sin(Math.PI*phase(p,.1,.8));
          s+=`<rect x="${left+before+1}" y="${y-28}" width="${unit*entry.size-2}" height="57" rx="14" fill="none" stroke="var(${productColours[entry.id]})" stroke-width="${2+2*glow}" opacity="${glow}"/>`;
        }
        before+=unit*entry.size;
      }
    }
    if(n<trace.length&&next.skipped>step.skipped&&p>.8)s+=text(W/2,legend?y-90:y+82,'Returned without storing',19,'--color-text-secondary');
    s+=text(W/2,H-70,`${displayed.reads} misses · ${displayed.hits} hits`,24);
    s+=text(W/2,H-32,`${displayed.saved} work units saved`,21,'--color-text-secondary');
    return svg(s,small,H);
  },t);
}

export const scenes={
  burst:{title:'Overlapping cache misses',duration:12000,defaultVariant:'independent',actions:[{value:'independent',label:'Independent reads'},{value:'shared',label:'Share one fill'},{value:'fast',label:'Faster source'}],alt:'Four requests for the mug arrive twenty milliseconds apart. With a 100 millisecond source read, four independent reads overlap. Sharing one fill reduces them to one. With a 40 millisecond source read, two independent reads start and the later two requests hit.',caption:'The same four arrivals. A slower fill leaves more time for duplicate work; sharing the fill combines it. Fixed timings are illustrative.',render:(t,v)=>both(burst,t,v)},
  waiting:{title:'A caller deadline does not stop shared work',duration:11000,alt:'Caller A waits from zero to 50 milliseconds, then times out. Caller B joins at 20 milliseconds and receives the answer at 100. The shared source read keeps its slot until it finishes at 100, after A has left.',caption:'Callers have separate waiting budgets. The shared read has its own finite lifetime and keeps its source slot until it settles.',render:t=>both(waiting,t)},
  lease:{title:'The lease ends before the read',duration:13000,alt:'Server A owns a lease until 80 milliseconds but its source read runs until 120. Server B gets a new lease at 90 and reads until 140. Both reads run between 90 and 120. An atomic owner-token check rejects A’s old fill; B may publish while its token is valid.',caption:'A lease limits permission, not the duration of source work. This single-store illustration assumes unique tokens and atomic ownership checks.',render:t=>both(lease,t)},
  refresh:{title:'An early refresh leaves the old deadline unchanged',duration:11000,defaultVariant:'failure',actions:[{value:'failure',label:'Refresh fails'},{value:'success',label:'Refresh succeeds'}],alt:'A request at 24 seconds starts a refresh while receiving the old permitted card. Another request at 25 seconds reuses that card. If the refresh fails at 26 seconds, the old card still becomes unusable at 30. A successful refresh supplies a validated replacement.',caption:'The old answer’s serving boundary is fixed at 30 seconds by this example’s freshness rule. A failed refresh does not move it.',render:(t,v)=>both(refresh,t,v)},
  admission:{title:'Bound source work across keys',duration:13000,defaultVariant:'fast',actions:[{value:'fast',label:'100 ms source'},{value:'slow',label:'200 ms source'}],alt:'Six distinct requests share two source slots and two queue places, with a 150 millisecond caller deadline. Two reads start, two requests queue and two are rejected. At 100 milliseconds two answers arrive, but the queued requests have too little time left. With 200 millisecond reads, callers time out while both source slots remain occupied until completion.',caption:'Two execution slots and two queue places. Every caller has 150 ms; the model knows each read’s fixed duration. Real admission uses measured durations and remaining time.',render:(t,v)=>both(admission,t,v)},
  working:{title:'The working set fits',duration:18000,alt:'Six requests alternate between the mug and jug. The first request for each misses and reads the database. The remaining four hit. Only those two product cards need to be resident for this trace.',caption:'Two initial misses, then reuse. The catalogue can be much larger than the answers requested during this interval.',render:t=>both(workingSet,t)},
  bytes:{title:'What one cache entry costs',duration:5500,alt:'An illustrative one KiB entry contains 900 bytes of encoded value, a 29-byte key, 71 bytes of bookkeeping and 24 unused allocation bytes. The total is 1,024 bytes. The key length is exact; other costs are invented.',caption:'Width shows charged bytes. Only the key’s length is taken from the example; this is not a Redis memory measurement.',render:t=>both(bytes,t)},
  expiry:{title:'Expiry and eviction end reuse differently',duration:10000,alt:'Two cached copies start with a 30-second TTL. The first is evicted for space after ten seconds, before its TTL ends. The second remains until expiry at thirty seconds. A later lookup misses in either case.',caption:'Eviction can remove a still-usable copy. Expiry sets its last usable time, not a minimum stay in memory.',render:t=>both(expiry,t)},
};
