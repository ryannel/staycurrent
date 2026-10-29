import { products, createWorkload, arrive, advance, finalWorkload } from './workload.mjs';
import { keyCache, clamp, phase, ease, paper, colours, text, stroke as baseStroke, qpath, result, ball, moving, pulse } from './scene.mjs';

const stroke=(d,colour='--color-text-secondary',width=1.6,extra='')=>baseStroke(d,colour,width,extra);

// These clocks choreograph an explanation; none is a service benchmark.
const svg=(body,small,h)=>`<svg class="bounce-${small?'portrait':'landscape'}" viewBox="0 0 ${small?440:760} ${h}" aria-hidden="true">${body}</svg>`;
const both=(draw,t)=>draw(t,false)+draw(t,true);
const route=(a,b,bend=0)=>[(a[0]+b[0])/2,(a[1]+b[1])/2+bend];
const travel=(t,a,b,from,to,c,answer=false,bend=0)=>moving(t,a,b,from,route(from,to,bend),to,c,answer);
function server(x,y,name='Server') {
  let s=`<circle cx="${x}" cy="${y}" r="25" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`;
  for(let i=0;i<2;i++)s+=`<rect x="${x-13}" y="${y-12+i*14}" width="26" height="10" rx="3" fill="none" stroke="var(--color-text-secondary)"/><circle cx="${x+7}" cy="${y-7+i*14}" r="1.4" fill="var(--color-text-secondary)"/>`;
  return s+text(x,y+49,name,20);
}
function cache(x,y,filled=true,label='Cache',value='') {
  return text(x,y-51,label,22)+`<circle cx="${x}" cy="${y}" r="33" fill="${paper}" stroke="var(${filled?'--teal':'--color-text-secondary'})" stroke-width="1.8"/>`+(filled?(value?text(x,y+7,value,22):result(x,y,1.6)):`<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="var(--color-text-secondary)" stroke-dasharray="2 4"/>`);
}
function database(x,y,active=false,value='') {
  return `<path d="M${x-29} ${y-17}V${y+18}C${x-29} ${y+33} ${x+29} ${y+33} ${x+29} ${y+18}V${y-17}" fill="${paper}" stroke="var(${active?'--gold':'--color-text-secondary'})" stroke-width="1.6"/><ellipse cx="${x}" cy="${y-17}" rx="29" ry="10" fill="${paper}" stroke="var(${active?'--gold':'--color-text-secondary'})" stroke-width="1.6"/>`+(value?text(x,y+15,value,20):result(x,y+7,1.2))+text(x,y+58,'Database',20);
}
const answerDot=(x,y,label,colour='--teal',r=23)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${paper}" stroke="var(${colour})" stroke-width="1.8"/>`+result(x,y-3,1)+text(x,y+43,label,18);

function placement(t,small,traffic){
  const state=traffic??finalWorkload();
  const W=small?440:760, rowHeight=small?610:420, gap=small?64:80;
  const dividerY=rowHeight+gap/2;
  let s=stroke(`M24 ${dividerY}H${W-24}`,'--color-text-secondary',1,'opacity=".55"');
  for(let panel=0;panel<2;panel++){
    const shared=panel===1, oy=panel*(rowHeight+gap);
    const pt=(x,y)=>[x,y+oy];
    const client=small?pt(65,90):pt(60,195);
    const L=small?pt(220,90):pt(205,195);
    const A=small?pt(100,215):pt(350,120);
    const B=small?pt(340,215):pt(350,280);
    const CA=small?pt(shared?220:100,340):pt(510,shared?195:120);
    const CB=shared?CA:small?pt(340,340):pt(510,280);
    const D=small?pt(220,465):pt(675,195);
    // Source routes go around the cache, never through it.
    const da=small?pt(-80,445):route(A,D,-175);
    const db=small?pt(520,445):route(B,D,175);
    const stats=state.panels[panel];
    const reading=target=>state.requests.some(r=>r.target===target&&r.outcomes[panel].hit===false&&(state.now-r.at)/1000/r.scale>=1.2&&(state.now-r.at)/1000/r.scale<2.8);
    const readA=reading(0),readB=reading(1);
    s+=text(W/2,oy+30,shared?'Shared cache':'Local caches',24);
    for(const [a,b] of [[client,L],[L,A],[L,B],[A,CA],[B,CB]])
      s+=stroke(qpath(a,route(a,b),b));
    s+=stroke(qpath(A,da,D),readA?'--gold':'--color-rule-strong');
    s+=stroke(qpath(B,db,D),readB?'--gold':'--color-rule-strong');
    s+=app(...client);
    s+=`<circle cx="${L[0]}" cy="${L[1]}" r="25" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`;
    s+=stroke(`M${L[0]-13} ${L[1]}H${L[0]-3}M${L[0]-3} ${L[1]}L${L[0]+11} ${L[1]-10}M${L[0]-3} ${L[1]}L${L[0]+11} ${L[1]+10}`);
    s+=text(L[0],L[1]+49,'Load balancer',18);
    s+=server(...A,'')+server(...B,'');
    s+=text(A[0]-(small?20:0),A[1]-40,'Server A',20)+text(B[0]+(small?20:0),B[1]-40,'Server B',20);
    s+=keyCache(...CA,stats.caches[0])+text(CA[0],CA[1]+56,shared?'Cache':'Local cache',20);
    if(!shared)s+=keyCache(...CB,stats.caches[1])+text(CB[0],CB[1]+(small?56:-48),'Local cache',20);
    s+=database(...D,readA||readB);
    s+=text(D[0],D[1]+82,`${stats.reads} ${stats.reads===1?'read':'reads'}`,17,'--color-text-secondary');
    for(const r of state.requests){
      const age=(state.now-r.at)/1000/r.scale,product=products[r.key],c=product.colour,k=product.key;
      const target=r.target?B:A,cachePosition=r.target?CB:CA,sourceRoute=r.target?db:da;
      const saved=[cachePosition[0]+(r.key-1)*24,cachePosition[1]];
      const outcome=r.outcomes[panel];
      const move=(start,end,from,to,answer=false)=>moving(age,start,end,from,route(from,to),to,c,answer,k);
      s+=move(0,.3,client,L)+move(.3,.6,L,target)+move(.6,.9,target,saved);
      s+=move(.9,1.2,saved,target,outcome.hit===true);
      if(outcome.hit===false){
        s+=moving(age,1.2,1.8,target,sourceRoute,D,c,false,k);
        if(age>=1.8&&age<2.2)s+=ball(D[0],D[1]-34-Math.sin((age-1.8)*Math.PI/ .4)*5,c,true,0,1,k);
        s+=moving(age,2.2,2.8,D,sourceRoute,target,c,true,k);
        s+=move(2.8,3.2,target,saved,true)+pulse(age,3.2,...cachePosition,c,40);
        s+=move(3.2,3.5,saved,target,true)+move(3.5,3.8,target,L,true)+move(3.8,4.1,L,client,true);
      }else if(outcome.hit===true){
        s+=pulse(age,.9,...cachePosition,c,40)+move(1.2,1.5,target,L,true)+move(1.5,1.8,L,client,true);
      }
    }
    const misses=stats.misses[0]+stats.misses[1];
    s+=text(W/2,oy+rowHeight-24,`${misses} cache ${misses===1?'miss':'misses'}`,24);
    if(!shared){
      s+=text(A[0],A[1]+49,`${stats.misses[0]} ${stats.misses[0]===1?'miss':'misses'}`,17,'--color-text-secondary');
      s+=text(B[0],B[1]+49,`${stats.misses[1]} ${stats.misses[1]===1?'miss':'misses'}`,17,'--color-text-secondary');
    }
  }
  return svg(s,small,rowHeight*2+gap);
}

function identity(t,small){
  const W=small?440:760, left=small?70:125,right=small?335:620;
  let s='';
  for(let row=0;row<2;row++){
    const y=row?375:135,good=row===1, north=[left,y-25],south=[left,y+55],C=[right,y];
    s+=text(W/2,y-99,good?'Include the shop':'Only the product ID',24);
    const nc=good?[right,y-20]:[right,y+8],sc=good?[right,y+57]:[right,y+8];
    s+=stroke(qpath(north,route(north,nc,-18),nc))+stroke(qpath(south,route(south,sc,18),sc));
    s+=text(left,y-52,'north',20)+text(left,y+100,'south',20);
    s+=`<circle cx="${north[0]}" cy="${north[1]}" r="21" fill="${paper}" stroke="var(--color-text-secondary)"/><circle cx="${south[0]}" cy="${south[1]}" r="21" fill="${paper}" stroke="var(--color-text-secondary)"/>`;
    s+=text(...[north[0],north[1]+6],'£20',18)+text(south[0],south[1]+6,'£18',18);
    s+=text(right,y-61,'Cache',22);
    if(good){
      for(const [dy,key,value] of [[-20,'north:P7','£20'],[57,'south:P7','£18']]){
        s+=`<rect x="${right-63}" y="${y+dy-27}" width="126" height="64" rx="18" fill="${paper}" stroke="var(--teal)" stroke-width="1.6"/>`;
        s+=text(right,y+dy-6,key,17)+text(right,y+dy+22,value,22);
      }
    }else{
      s+=`<circle cx="${right}" cy="${y+8}" r="45" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`+text(right,y-1,'P7',18)+text(right,y+28,'£20',24);
    }
    const dest=good?[right,y+57]:[right,y+8];
    s+=travel(t,1.5,3,south,dest,'--coral',false,18);
    s+=travel(t,4,5.7,dest,south,good?'--teal':'--coral',true,18);
    if(t>=5.7){
      s+=text(small?210:360,y+70,good?'£18 ✓':'£20 ≠ £18',22);
      s+=pulse(t,5.7,...south,good?'--teal':'--coral',23);
    }
  }
  return svg(s,small,515);
}

function change(t,small){
  const W=small?440:760,H=small?455:420,S=[small?70:140,220],C=[small?300:535,115],D=[small?300:535,330];
  const updated=t>=2.5,deleted=t>=7,refilled=t>=14.2;
  const c=route(S,C,-35),d=route(S,D,35);
  let s=stroke(qpath(S,c,C))+stroke(qpath(S,d,D));
  s+=server(...S)+cache(...C,!deleted||refilled,'Cache',refilled?'£22':'£20')+database(...D,updated,updated?'£22':'£20');
  s+=text(W/2,30,t<2.5?'Both copies agree':t<7?'The database changes first':t<10?'Delete the old copy':t<14.2?'The next request refills it':'Both copies agree again',small?22:25);
  s+=pulse(t,2.5,...D,'--gold',32);
  // Deletion follows the committed change, then a separate ordinary read arrives.
  s+=travel(t,5.3,7,S,C,'--purple',false,-35);
  if(t>=7&&t<8)s+=`<circle cx="${C[0]}" cy="${C[1]}" r="${33+phase(t,7,8)*20}" fill="none" stroke="var(--purple)" opacity="${1-phase(t,7,8)}"/>`;
  s+=travel(t,10,10.9,S,C,'--coral',false,-35)+travel(t,10.9,11.8,C,S,'--coral',false,-35);
  s+=travel(t,11.8,12.6,S,D,'--coral',false,35)+travel(t,12.6,13.4,D,S,'--coral',true,35);
  s+=travel(t,13.4,14.2,S,C,'--coral',true,-35)+travel(t,14.5,15.4,C,S,'--coral',true,-35);
  s+=pulse(t,14.2,...C);
  s+=text(C[0],C[1]+66,refilled?'new copy':deleted?'empty':updated?'stale':'saved copy',19);
  return svg(s,small,H);
}

function app(x,y){
  return `<rect x="${x-29}" y="${y-23}" width="58" height="46" rx="7" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`+
    stroke(`M${x-29} ${y-10}H${x+29}`,'--color-text-secondary',1)+
    `<circle cx="${x-19}" cy="${y-16}" r="1.8" fill="var(--color-text-secondary)"/><circle cx="${x-12}" cy="${y-16}" r="1.8" fill="var(--color-text-secondary)"/>`+
    text(x,y+49,'App',20);
}
function burst(t,small){
  const W=small?440:760, rowHeight=360, gap=small?64:80;
  const dividerY=rowHeight+gap/2;
  let s=stroke(`M24 ${dividerY}H${W-24}`,'--color-text-secondary',1,'opacity=".55"');
  for(let row=0;row<2;row++){
    const offset=row*(rowHeight+gap), y=(small?165:180)+offset;
    const A=[small?50:100,y], S=[small?180:300,y];
    const C=[small?335:580,110+offset];
    const D=[small?335:580,250+offset],share=row===1;
    const fillAt=8.1;
    s+=text(W/2,20+offset,share?'Share one fill':'Each request reads',24);
    s+=stroke(qpath(A,route(A,S,-12),S));
    s+=stroke(qpath(S,route(S,C,-15),C))+stroke(qpath(S,route(S,D,15),D));
    s+=app(...A)+server(...S)+cache(...C,t>=fillAt)+database(...D,t>=4&&t<6.8);
    for(let i=0;i<4;i++){
      const colour=colours[i],start=1+i*.28,reply=8.6+i*.28;
      // Every request leaves the same visible app; every answer returns there.
      s+=travel(t,start,start+.75,A,S,colour,false,-12);
      s+=travel(t,start+.75,start+1.45,S,C,colour,false,-15)+travel(t,start+1.45,start+2.15,C,S,colour,false,-15);
      if(!share||i===0){
        s+=travel(t,3.7+i*.2,4.7+i*.2,S,D,colour,false,15);
        if(t>=4.7+i*.2&&t<6.1+i*.2)s+=ball(D[0]-26+i*17,D[1]-15-Math.abs(Math.sin(t*4+i))*7,colour);
        s+=travel(t,6.1+i*.2,7.1+i*.2,D,S,colour,true,15);
      }else if(t>=start+2.15&&t<reply){
        s+=ball(S[0]+(i-2)*27,y-42-Math.abs(Math.sin(t*2+i))*3,colour,t>=8.6);
      }
      s+=travel(t,reply,reply+1.2,S,A,colour,true,-12);
      s+=pulse(t,reply+1.2,...A,colour,25);
    }
    // The first completed read saves the copy; waiters get its result.
    s+=travel(t,7.1,8.1,S,C,'--coral',true,-15)+travel(t,8.1,8.6,C,S,'--coral',true,-15);
    s+=pulse(t,8.1,...C);
    const note=t<3.6?'Four requests from the app':t<8.6?
      (share?'One fills. Three wait.':'Four separate source reads.'):
      t<10.7?'Four answers return to the app':
      (share?'One source read. Four answers.':'Four source reads. Four answers.');
    s+=text(W/2,rowHeight-25+offset,note,small?20:23);
  }
  return svg(s,small,rowHeight*2+gap);
}

function memory(t,small){
  const W=small?440:760, rowHeight=small?490:455, gap=small?64:80;
  let s=stroke(`M24 ${rowHeight+gap/2}H${W-24}`,'--color-text-secondary',1,'opacity=".55"');
  for(let row=0;row<2;row++){
    const keep=row===1, oy=row*(rowHeight+gap), saved=t>=4;
    const A=[small?50:100,oy+250], S=[small?180:300,oy+250];
    const C=[small?220:540,oy+145], D=[small?335:C[0],oy+345];
    const sizes=[1,2,3,2], unit=small?48:44, left=C[0]-unit*4;
    const slot=i=>left+unit*(sizes.slice(0,i).reduce((sum,size)=>sum+size,0)+sizes[i]/2);
    const sourceActive=!keep&&t>=7.1&&t<9.5;
    s+=text(W/2,oy+28,keep?'Keep P7–P10':'Save P11',small?23:24);
    s+=stroke(qpath(A,route(A,S,-10),S));
    s+=stroke(qpath(S,route(S,C,-18),C));
    s+=stroke(qpath(S,route(S,D,18),D),sourceActive?'--gold':'--color-rule-strong');
    s+=app(...A)+server(...S)+database(...D,sourceActive);
    s+=text(C[0],C[1]-51,'Cache · 8 KiB',22);
    s+=`<rect x="${left-6}" y="${C[1]-32}" width="${unit*8+12}" height="64" rx="18" fill="${paper}" stroke="var(--teal)" stroke-width="1.6"/>`;
    // Width is proportional to memory: 1, 2, 3 and 2 KiB; P11 uses 6 KiB.
    for(let i=0;i<4;i++){
      const leaving=!keep&&i<3&&t>=2.8;
      const opacity=leaving?1-phase(t,2.8,4):1;
      if(opacity>0){
        s+=`<g opacity="${opacity}" transform="translate(0 ${leaving?-phase(t,2.8,4)*18:0})">`;
        s+=`<rect x="${slot(i)-unit*sizes[i]/2+3}" y="${C[1]-25}" width="${unit*sizes[i]-6}" height="50" rx="12" fill="${paper}" stroke="var(--teal)" stroke-width="1.4"/>`;
        s+=text(slot(i),C[1]-2,`P${7+i}`,18)+text(slot(i),C[1]+17,`${sizes[i]} KiB`,13,'--color-text-secondary')+'</g>';
      }
    }
    if(!keep&&t>=4){
      const p=ease(phase(t,4,4.8));
      s+=`<g opacity="${p}" transform="translate(0 ${-12*(1-p)})"><rect x="${left+3}" y="${C[1]-25}" width="${unit*6-6}" height="50" rx="12" fill="${paper}" stroke="var(--purple)" stroke-width="1.8"/>`;
      s+=text(left+unit*3,C[1]-2,'P11',19)+text(left+unit*3,C[1]+18,'6 KiB',15,'--color-text-secondary')+'</g>';
    }
    s+=text(C[0],C[1]-80,t<2.8?'Full · four product cards':keep?'P11 not saved':saved?'P7, P8 and P9 evicted':'Making room for P11',small?16:18,'--color-text-secondary');
    let misses=0,hits=0;
    for(let i=0;i<3;i++){
      const age=t-(5.4+i*.35), key=`P${7+i}`, colour=products[i].colour;
      const lookup=keep?[slot(i),C[1]]:C;
      const move=(a,b,from,to,answer=false,bend=0)=>moving(age,a,b,from,route(from,to,bend),to,colour,answer,key);
      s+=move(0,.6,A,S,false,-10)+move(.6,1.2,S,lookup,false,-18);
      if(age>=1.2){if(keep)hits++;else misses++;}
      s+=move(1.2,1.7,lookup,S,keep,-18);
      if(keep){
        s+=pulse(age,1.2,...lookup,colour,22)+move(1.7,2.4,S,A,true,-10);
      }else{
        s+=move(1.7,2.5,S,D,false,18)+pulse(age,2.5,...D,colour,32);
      }
    }
    const note=t<5.4?'P11’s card needs 6 KiB':keep?`${hits} cache hits · 0 database reads`:`${misses} cache misses · ${Math.max(0,Math.min(3,Math.floor((t-7.9)/.35)+1))} database reads`;
    s+=text(W/2,oy+rowHeight-18,note,small?20:23);
  }
  return svg(s,small,rowHeight*2+gap);
}

export const lessons={
  placement:{title:'Where the copy lives',duration:19000,traffic:{startAt:19000,create:createWorkload,advance,arrive,defaultLevel:2,intervals:[1600,800,320],labels:['Quiet','Steady','Busy']},render:(t,variant,traffic)=>both((time,small)=>placement(time,small,traffic),clamp(t)*19),alt:'The same P7, P8 and P9 requests reach A and B in both arrangements. Each local cache must learn each key separately, producing six cache misses. The shared cache learns each key once: three misses. Labelled colours identify product keys; the counters change when a lookup actually misses. Both eventually contain all three keys and later requests hit.',caption:'Figure 2. The same products now reach two servers. A local copy in A cannot prevent B’s miss. A shared copy can. Each key’s fill finishes before it is requested again here: six misses locally, three shared. Once warm, both arrangements hit. No expiry or eviction; timing is illustrative.'},
  identity:{title:'Two questions need two keys',duration:9000,render:t=>both(identity,clamp(t)*9),alt:'North’s P7 costs £20; south’s P7 costs £18. With only P7 as the cache key, south receives north’s £20 answer. Including the shop gives each answer its own entry, and south receives £18.',caption:'Figure 3. Both lookups hit. Only the key that includes the shop finds the right answer. Keys are shortened here; language, currency and format stay fixed.'},
  change:{title:'A copy can fall behind',duration:18000,render:t=>both(change,clamp(t)*18),alt:'The database and cache begin at £20. The database commits £22 while the cache still holds £20. The server then deletes the cached copy. A later request misses, reads £22 from the database and saves a new copy. No reads overlap the update in this example.',caption:'Figure 4. Commit £22, delete the old copy, then refill on the next miss. The purple pulse is the deletion; the coral ball is a later read. These are separate operations, with no overlapping read in this example.'},
  burst:{title:'Four requests, one piece of work',duration:13000,render:t=>both(burst,clamp(t)*13),alt:'Four coloured requests travel from the app to the server and miss an empty cache. Without coalescing, all four read the database. With coalescing inside one server process, one reads while three wait. Four answers travel back to the app in both cases.',caption:'Figure 5. Four requests leave the app; four answers return. Sharing the fill inside one server process avoids three database reads. Waiting must be bounded in a real service.'},
  memory:{title:'An answer has to earn its space',duration:11000,render:t=>both(memory,clamp(t)*11),alt:'An eight KiB cache holds product cards P7, P8, P9 and P10 using one, two, three and two KiB respectively. Their widths show their different sizes. P11 uses six KiB, as much as P7, P8 and P9 combined. Saving P11 evicts those three cards. Their next requests miss and go to the database. Skipping that admission retains all four products, so the same three requests hit.',caption:'Figure 6. Card widths show memory use: P7 uses 1 KiB, P8 2 KiB, P9 3 KiB and P10 2 KiB. Together they fill the 8 KiB cache. P11 needs 6 KiB, so saving it evicts P7, P8 and P9 here. The same three requests then leave the app: three misses above, three hits below. The comparison stops at the extra database reads, before refilling. The original caller receives P11 in both versions; only saving it differs. Sizes include keys and bookkeeping; no entries expire.'},
};
