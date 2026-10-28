import { clamp, phase, ease, paper, colours, text, stroke as baseStroke, qpath, result, ball, moving, pulse } from './scene.mjs';

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

function placement(t,small){
  const W=small?440:760, H=600;
  const ax=small?55:100,bx=small?210:325,dx=small?365:660;
  let s='';
  for(let row=0;row<2;row++){
    const y=row?430:150, shared=row===1;
    s+=text(W/2,y-116,shared?'One shared cache':'A cache in each process',24);
    const A=[ax,y],B=[bx,y],D=[dx,y],C=[small?235:440,y-20];
    if(!shared){
      for(const x of [ax,bx])s+=`<rect x="${x-43}" y="${y-97}" width="86" height="132" rx="30" fill="none" stroke="var(--color-text-secondary)" stroke-dasharray="3 5"/>`;
      s+=stroke(qpath([ax,y-55],[dx,y-110],D))+stroke(qpath([bx,y-55],[dx,y-60],D));
      s+=cache(ax,y-55,t>=4.4,'', '')+cache(bx,y-55,t>=9.4,'','');
      s+=server(...A,'Server A')+server(...B,'Server B');
      s+=database(...D,(t>=2&&t<3.4)||(t>=7&&t<8.4));
      for(const [start,from,c] of [[1,A,'--coral'],[6,B,'--blue']]){
        const p=[from[0],y-55];
        s+=travel(t,start,start+.7,from,p,c)+travel(t,start+.7,start+1.7,p,D,c,false,-60);
        s+=travel(t,start+2.4,start+3.4,D,p,c,true,-60)+travel(t,start+3.4,start+4.1,p,from,c,true);
        s+=pulse(t,start+3.4,...p,c,31);
      }
      s+=text(W/2,y+100,t<6?'A fills its own copy':t<10.2?'B needs its own fill':'Two copies. Two source reads.',20);
    } else {
      // The second process has a separate route to the same retained answer.
      const B2=[small?55:100,y+82];
      s+=stroke(qpath(A,route(A,C,-15),C))+stroke(qpath(B2,route(B2,C,8),C));
      s+=stroke(qpath(A,route(A,D,42),D));
      s+=server(...A,'Server A')+server(...B2,'Server B')+cache(...C,t>=4.4);
      s+=database(...D,t>=2.4&&t<3.3);
      s+=travel(t,1,1.7,A,C,'--coral')+travel(t,1.7,2.4,C,A,'--coral');
      s+=travel(t,2.4,3.1,A,D,'--coral',false,42)+travel(t,3.1,3.8,D,A,'--coral',true,42);
      s+=travel(t,3.8,4.4,A,C,'--coral',true)+travel(t,4.4,5.1,C,A,'--coral',true);
      s+=travel(t,6,7,B2,C,'--blue',false,8)+travel(t,7.4,8.4,C,B2,'--blue',true,8);
      s+=pulse(t,4.4,...C)+pulse(t,7.4,...C,'--blue');
      s+=text(small?270:470,y+119,t<6?'A saves a copy':t<9?'B finds it ready':'One copy. One source read.',20);
    }
  }
  return svg(s,small,H);
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

function burst(t,small){
  const W=small?440:760, sx=small?70:120,cx=small?220:380,dx=small?365:650;
  let s='';
  for(let row=0;row<2;row++){
    const y=row?430:140,S=[sx,y],C=[cx,y-18],D=[dx,y+30],share=row===1;
    const fillAt=8.1;
    s+=text(W/2,y-105,share?'Share one fill':'Each request reads',24);
    s+=stroke(qpath(S,route(S,C,-25),C))+stroke(qpath(S,route(S,D,35),D));
    s+=server(...S)+cache(...C,t>=fillAt)+database(...D,t>=4&&t<6.8);
    for(let i=0;i<4;i++){
      const colour=colours[i],start=1+i*.18;
      s+=travel(t,start,start+.75,[sx-45,y-45+i*19],S,colour);
      s+=travel(t,start+.75,start+1.45,S,C,colour,false,-25)+travel(t,start+1.45,start+2.15,C,S,colour,false,-25);
      if(!share||i===0){
        s+=travel(t,3.7+i*.2,4.7+i*.2,S,D,colour,false,35);
        if(t>=4.7+i*.2&&t<6.1+i*.2)s+=ball(dx-26+i*17,y+15-Math.abs(Math.sin(t*4+i))*7,colour);
        s+=travel(t,6.1+i*.2,7.1+i*.2,D,S,colour,true,35);
      }else if(t>=start+2.15&&t<8.6){
        s+=ball(sx-45+i*27,y-38-Math.abs(Math.sin(t*2+i))*3,colour);
      }
      if(t>=8.6&&t<10.2)s+=travel(t,8.6,10.2,S,[sx-45,y-45+i*19],colour,true);
    }
    // The first completed read saves the copy; waiters get its result.
    s+=travel(t,7.1,8.1,S,C,'--coral',true,-25)+travel(t,8.1,8.6,C,S,'--coral',true,-25);
    s+=pulse(t,8.1,...C);
    s+=text(W/2,y+122,t<3.6?'Four requests. Empty cache.':t<8.6?(share?'One reads. Three wait.':'Four reads in flight.'):(share?'One source read. Four answers.':'Four source reads. Four answers.'),small?20:23);
  }
  return svg(s,small,590);
}

function memory(t,small){
  const W=small?440:760, start=small?105:240, gap=small?64:78, slot=i=>start+i*gap,dx=small?375:675;
  let s='';
  for(let row=0;row<2;row++){
    const y=row?480:145,keep=row===1,replaced=!keep&&t>=3.5;
    s+=text(W/2,y-107,keep?'Skip saving the large result':'Save the large result',24);
    s+=text(W/2,y-73,'Cache · 4 KiB',19);
    s+=`<rect x="${start-32}" y="${y-41}" width="${gap*3+64}" height="84" rx="28" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`;
    for(let i=0;i<4;i++){
      if(!replaced||i===3)s+=answerDot(slot(i),y,`P${7+i}`,'--teal',22);
      if(!keep&&i<3&&t>=2.3&&t<3.5){const p=phase(t,2.3,3.5);s+=`<g opacity="${1-p}" transform="translate(0 ${-ease(p)*47})">${result(slot(i),y,1.3)}</g>`;}
    }
    if(replaced){
      s+=`<rect x="${slot(0)-26}" y="${y-27}" width="${gap*2+52}" height="54" rx="26" fill="${paper}" stroke="var(--purple)" stroke-width="1.8"/>`;
      s+=text(slot(1),y+7,'3 KiB',23)+text(slot(1),y+44,'large result',18);
    }else if(t<3.5||keep){
      const x=small?36:110,yy=y-15;
      s+=`<circle cx="${x}" cy="${yy}" r="29" fill="${paper}" stroke="var(--purple)" stroke-width="1.8"/>`+text(x,yy+5,'3 KiB',16);
      if(keep&&t>=3.5)s+=text(x,yy+56,'not saved',small?15:18);
    }
    // Three later requests ask for P7, P8 and P9. Occupancy remains 4 KiB;
    // this illustration stops at the source reads, before those misses refill.
    for(let i=0;i<3;i++){
      const age=t-(5+i*.9),P=[slot(i),y],from=[slot(i),y+80],colour=colours[i];
      if(t>=5)s+=text(slot(i),y+105,`P${7+i}`,18);
      s+=travel(age,0,.75,from,P,colour);
      if(keep){s+=travel(age,1,1.75,P,from,colour,true);}
      else{s+=travel(age,1,2.2,P,[dx,y+115],colour,false,33);}
    }
    s+=database(dx,y+115,!keep&&t>=6&&t<10);
    s+=text(small?180:320,y+141,t<5?'Each small answer uses 1 KiB':keep?'Three later hits':'Three later misses',small?19:22);
  }
  return svg(s,small,680);
}

export const lessons={
  placement:{title:'Where the copy lives',duration:13000,render:t=>both(placement,clamp(t)*13),alt:'Two comparisons. With a cache in each server process, server A fills its copy and server B must read the database for another. With one shared cache, server A fills it and server B reuses that copy. Two source reads become one.',caption:'Figure 2. A local copy belongs to one server process. A shared copy can answer both. The coloured balls ask for the same product; motion and timing are illustrative.'},
  identity:{title:'Two questions need two keys',duration:9000,render:t=>both(identity,clamp(t)*9),alt:'North’s P7 costs £20; south’s P7 costs £18. With only P7 as the cache key, south receives north’s £20 answer. Including the shop gives each answer its own entry, and south receives £18.',caption:'Figure 3. Both lookups hit. Only the key that includes the shop finds the right answer. Keys are shortened here; language, currency and format stay fixed.'},
  change:{title:'A copy can fall behind',duration:18000,render:t=>both(change,clamp(t)*18),alt:'The database and cache begin at £20. The database commits £22 while the cache still holds £20. The server then deletes the cached copy. A later request misses, reads £22 from the database and saves a new copy. No reads overlap the update in this example.',caption:'Figure 4. Commit £22, delete the old copy, then refill on the next miss. The purple pulse is the deletion; the coral ball is a later read. These are separate operations, with no overlapping read in this example.'},
  burst:{title:'Four requests, one piece of work',duration:13000,render:t=>both(burst,clamp(t)*13),alt:'Four requests miss an empty cache. Without coalescing, all four read the database. With coalescing inside one server process, one reads while three wait. The completed fill supplies all four answers.',caption:'Figure 5. The same four misses in one server process. Sharing the fill avoids three database reads; all four callers still receive an answer. Waiting must be bounded in a real service.'},
  memory:{title:'An answer has to earn its space',duration:11000,render:t=>both(memory,clamp(t)*11),alt:'A four KiB cache holds P7, P8, P9 and P10 at one KiB each. Saving a three KiB result evicts P7, P8 and P9. Their next requests miss and go to the database. Skipping that admission retains all four products, so the same three requests hit.',caption:'Figure 6. Outlined circles hold saved answers; coloured balls are requests. The 3 KiB result displaces three 1 KiB answers if admitted. Both original callers receive the large result; this drawing compares what gets saved. The later misses are shown before refilling. Sizes include keys and bookkeeping; no entries expire.'},
};
