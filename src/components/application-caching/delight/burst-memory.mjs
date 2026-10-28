// Presentation models, not measurements of a cache or source.
const clamp = x => Math.max(0, Math.min(1, x));
const phase = (t, a, b) => clamp((t-a)/(b-a));
const smooth = p => p*p*(3-2*p);
const settle = p => p === 1 ? 1 : 1-Math.exp(-7*p)*Math.cos(9*p);
const text = (x,y,value,cls='',anchor='middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${value}</text>`;
const svg = (body, height=560) => `<svg viewBox="0 0 560 ${height}" aria-hidden="true">${body}</svg>`;
const mug = (x,y,scale=1) => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-15-17H13L12 13Q0 23-13 13Z" fill="url(#bm-ceramic)"/><path d="M13-10C33-12 32 12 13 9" fill="none" stroke="var(--bm-blue-edge)" stroke-width="5"/><path d="M-9-12V9" stroke="var(--bm-glint)" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>`;
const defs = () => `<defs>
 <linearGradient id="bm-ceramic" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--bm-blue-light)"/><stop offset=".5" stop-color="var(--bm-blue)"/><stop offset="1" stop-color="var(--bm-blue-edge)"/></linearGradient>
 <linearGradient id="bm-paper" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--bm-card-light)"/><stop offset="1" stop-color="var(--bm-card)"/></linearGradient>
 <linearGradient id="bm-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--bm-metal-light)"/><stop offset=".5" stop-color="var(--bm-metal)"/><stop offset="1" stop-color="var(--bm-metal-edge)"/></linearGradient>
 <linearGradient id="bm-body" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--bm-press-light)"/><stop offset="1" stop-color="var(--bm-press)"/></linearGradient>
 <linearGradient id="bm-query" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--bm-query-light)"/><stop offset="1" stop-color="var(--bm-query)"/></linearGradient>
 <filter id="bm-shadow" x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="var(--bm-shadow)" flood-opacity=".22"/></filter>
 </defs>`;
const card = (x,y,rotation=0,opacity=1) => `<g transform="translate(${x} ${y}) rotate(${rotation})" opacity="${opacity}"><rect x="-27" y="-34" width="54" height="68" rx="8" fill="url(#bm-paper)" stroke="var(--bm-card-edge)" filter="url(#bm-shadow)"/>${mug(0,-13,.58)}${text(0,23,'£20','bm-price')}</g>`;
const ticket = (x,y,n,opacity=1) => `<g transform="translate(${x} ${y})" opacity="${opacity}"><rect x="-28" y="-17" width="56" height="34" rx="17" fill="var(--bm-ticket)" stroke="var(--bm-ticket-edge)"/>${text(0,7,'P7','bm-ticket-text')}${text(0,-27,String(n),'bm-number')}</g>`;
const pulse = (x,y,r,p) => p>0&&p<1 ? `<circle cx="${x}" cy="${y}" r="${r+18*p}" fill="none" stroke="var(--bm-mint)" stroke-width="${2*(1-p)}" opacity="${1-p}"/>` : '';
const press = (x,y,t,scale=1) => {
 const working=phase(t,.32,.58), done=t>=.58;
 const rotation=working*540;
 let s=`<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cy="44" rx="50" ry="10" fill="var(--bm-shadow)" opacity=".12"/><path d="M-44 22L-34 37H36L47 22Z" fill="var(--bm-metal-edge)"/><rect x="-46" y="-37" width="92" height="64" rx="22" fill="url(#bm-body)" stroke="var(--bm-press-edge)" filter="url(#bm-shadow)"/><path d="M-31-29Q0-40 31-29" stroke="var(--bm-glint)" opacity=".35" fill="none" stroke-width="2"/><circle cy="-5" r="24" fill="var(--bm-press)" stroke="url(#bm-metal)" stroke-width="8"/>`;
 s+=`<g transform="rotate(${rotation} 0 -5)">`;
 for(let i=0;i<4;i++)s+=`<rect x="-2" y="-27" width="4" height="9" rx="2" fill="var(--bm-mint)" opacity="${working>0&&working<1?1:.4}" transform="rotate(${i*90} 0 -5)"/>`;
 s+=`</g><circle cy="-5" r="9" fill="var(--bm-metal)"/><circle cy="-5" r="3" fill="var(--bm-glint)"/><rect x="-24" y="23" width="48" height="5" rx="2.5" fill="var(--bm-slot)"/><circle cx="32" cy="16" r="4" fill="${done?'var(--bm-mint)':'var(--bm-metal)'}"/>${pulse(0,-5,28,phase(t,.57,.68))}</g>`;
 return s;
};

function burst(t) {
 let s=defs();
 s+=`<rect x="13" y="12" width="534" height="536" rx="28" fill="var(--bm-stage)"/><path d="M35 277H525" stroke="var(--bm-divider)"/>`;
 const xs=[83,214,345,476];
 for(const shared of [false,true]) {
  const offset=shared?278:0, callerY=offset+106, workY=offset+(shared?193:208);
  s+=text(34,offset+46,shared?'One shared fill':'Everyone starts a fill','bm-heading','start');
  s+=text(526,offset+46,shared?'1 source read':'4 source reads','bm-total','end');
  const jobs=shared?[280]:xs;
  for(const x of jobs)s+=press(x,workY,t,shared?1:.8);
  for(let i=0;i<4;i++) {
   const x=xs[i], dest=shared?280:x, arrival=phase(t,.08+i*.025,.27+i*.013), returned=phase(t,.63+i*.035,.82+i*.035);
   const answer=t>=.82+i*.035;
   s+=ticket(x,callerY,i+1,answer?0:1);
   if(answer)s+=card(x,callerY);
   // Each caller keeps its own strand; sharing joins work, never the identities.
   s+=`<path d="M${x} ${callerY+26}C${x} ${callerY+67} ${dest} ${workY-72} ${dest} ${workY-39}" fill="none" stroke="var(--bm-thread)" stroke-width="2" stroke-dasharray="2 6"/>`;
   if(arrival>0&&arrival<1) {
    const p=smooth(arrival), px=x+(dest-x)*p,py=callerY+25+(workY-callerY-65)*p;
    s+=`<circle cx="${px}" cy="${py}" r="7" fill="var(--bm-mint)" stroke="var(--bm-stage)" stroke-width="2"/>`;
   }
   if(returned>0&&returned<1) {
    const p=smooth(returned), px=dest+(x-dest)*p,py=workY-30+(callerY-workY+30)*p-Math.sin(p*Math.PI)*28;
    s+=card(px,py,(x-dest)*.05*Math.sin(p*Math.PI));
   }
  }
  if(t>.93)s+=text(280,offset+263,'Four callers · four answers','bm-subtle');
 }
 return svg(s.replaceAll('id="bm-', 'id="burst-').replaceAll('url(#bm-', 'url(#burst-'));
}

const unitCard = (x,y,id,{opacity=1,lift=0,rotation=0,highlight=false}={}) => `<g opacity="${opacity}" transform="translate(${x} ${y-lift}) rotate(${rotation})"><ellipse cy="47" rx="39" ry="6" fill="var(--bm-shadow)" opacity="${Math.max(0,.12-lift*.001)}"/><path d="M-45-27H43L49-21V41H-39L-45 35Z" fill="var(--bm-blue-edge)"/><rect x="-45" y="-34" width="90" height="70" rx="9" fill="url(#bm-paper)" stroke="${highlight?'var(--bm-mint-edge)':'var(--bm-card-edge)'}" stroke-width="${highlight?3:1}" filter="url(#bm-shadow)"/>${mug(-28,-8,.53)}${text(18,0,id,'bm-product')}${text(0,25,'1 KiB','bm-size')}</g>`;
const queryTile = (x,y,size,opacity=1,rotation=0) => {
 const width=100*size-10;
 return `<g transform="translate(${x} ${y}) rotate(${rotation})" opacity="${opacity}"><path d="M${-width/2}-24H${width/2}L${width/2+5}-18V41H${-width/2+5}L${-width/2}35Z" fill="var(--bm-query-edge)"/><rect x="${-width/2}" y="-34" width="${width}" height="70" rx="9" fill="url(#bm-query)" stroke="var(--bm-query-edge)" filter="url(#bm-shadow)"/>${size>1?`<path d="M${-width/2+16}-14H${width/2-16}M${-width/2+16}-5H${width/2-36}" stroke="var(--bm-query-ink)" stroke-width="3" opacity=".35"/>`:''}${text(0,size>1?24:-3,`${size} KiB`,'bm-query-type')}${size===1?text(0,24,'answer','bm-query-small'):''}</g>`;
};

function memory(t,variant='3') {
 const size=Math.min(3,Math.max(1,Number(variant)||3)), start=4-size;
 const arrive=phase(t,.16,.46), landed=t>=.46, checking=phase(t,.65,.86);
 let s=defs()+`<rect x="13" y="12" width="534" height="536" rx="28" fill="var(--bm-stage)"/><path d="M35 278H525" stroke="var(--bm-divider)"/>`;
 for(const keep of [true,false]) {
  const y=keep?0:278,shelfY=y+140;
  s+=text(34,y+46,keep?'Keep the large answer':'Let it pass','bm-heading','start')+text(526,y+46,'4 KiB','bm-total','end');
  // The rigid four-unit shelf never grows or compresses its contents.
  s+=`<path d="M60 ${shelfY-40}H500L511 ${shelfY+50}Q511 ${shelfY+61}500 ${shelfY+61}H60Q49 ${shelfY+61}49 ${shelfY+50}Z" fill="var(--bm-shelf-edge)"/><rect x="60" y="${shelfY-45}" width="440" height="97" rx="15" fill="var(--bm-shelf)" stroke="var(--bm-shelf-line)"/>`;
  for(let i=1;i<4;i++)s+=`<path d="M${80+i*100} ${shelfY-34}V${shelfY+42}" stroke="var(--bm-shelf-line)" stroke-dasharray="3 5"/>`;
  for(let i=0;i<4;i++) {
   const removed=keep&&i>=start, p=removed?arrive:0, x=130+i*100;
   if(p<1)s+=unitCard(x,shelfY,['P7','P3','P9','P40'][i],{opacity:1-p,lift:p*64,rotation:p*(i-1)*9,highlight:checking>0&&!removed&&i>0});
  }
  if(keep&&arrive>0) {
   const p=settle(arrive), centre=130+100*start+(size-1)*50;
   s+=queryTile(centre,shelfY-38*(1-p),size,Math.min(1,arrive*4),(1-p)*-4);
  }
  if(!keep&&t>=.16&&t<.46) {
   const p=smooth(arrive);
   s+=queryTile(150+430*p,shelfY-51-Math.sin(p*Math.PI)*5,size,Math.sin(p*Math.PI)*.7,-4+8*p);
  }
  if(landed)s+=text(280,y+227,keep?`${size} ${size===1?'card displaced':'cards displaced'}`:'All four cards stay','bm-subtle');
  if(checking>0) {
   const misses=keep?size:0,hits=3-misses;
   s+=`<g opacity="${checking}">`+text(280,y+261,`${misses?`${misses} ${misses===1?'miss':'misses'}`:''}${misses&&hits?' · ':''}${hits?`${hits} ${hits===1?'hit':'hits'}`:''} on P3, P9, P40`,'bm-result')+'</g>';
  }
 }
 return svg(s.replaceAll('id="bm-', 'id="memory-').replaceAll('url(#bm-', 'url(#memory-'));
}

export const scenes = {
 burst: {
  title:'One piece of work. Four waiting readers.', duration:14000,
  caption:'Inside App A, the same four P7 requests either start four source reads or wait for one shared fill. Both return four £20 cards. Each press represents reading the source and building the card; its timing is illustrative.',
  alt:'Two miniature print workshops compare the same four callers. Four separate presses read the source four times. One shared press reads it once and fans four £20 product cards back to all four callers.',
  render:burst
 },
 memory: {
  title:'Space spent here cannot be spent there.', duration:14000, defaultVariant:'3',
  caption:'Each shelf holds 4 KiB. Both return the new answer to its caller; only the upper shelf keeps it. With the default 3 KiB answer, P3, P9 and P40 are displaced and the next three requests miss. Sizes and eviction order are invented.',
  alt:'Two four-unit cache shelves. Keeping a 3 KiB answer displaces P3, P9 and P40; their next requests miss. Skipping the saved copy retains all four 1 KiB cards and those requests hit. Both choices return the new answer to its caller.',
  altFor: variant => { const n=Math.min(3,Math.max(1,Number(variant)||3)); return `Both caches have 4 KiB. Keeping a ${n} KiB answer displaces ${n} of the product cards needed next, causing ${n} ${n===1?'miss':'misses'} and ${3-n} ${3-n===1?'hit':'hits'}. Skipping the saved copy retains all four cards and the next three requests hit. Both return the new answer to its caller.`; },
  range:{min:1,max:3,step:1,value:3,label:'Size of the new answer',unit:'KiB'}, render:memory
 }
};
