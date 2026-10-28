// A little paper workshop and two arrangements of process memory.
// Motion is illustrative: the drawing is not a latency or execution trace.
const clamp = x => Math.max(0, Math.min(1, x));
const phase = (t, a, b) => clamp((t-a)/(b-a));
const smooth = x => x*x*(3-2*x);
const mix = (a,b,t) => a+(b-a)*t;
const tx = (x,y,value,cls='',anchor='middle') => `<text x="${x}" y="${y}" class="rp-text ${cls}" text-anchor="${anchor}">${value}</text>`;
const group = (x,y,content,scale=1,angle=0,opacity=1) => `<g opacity="${opacity}" transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">${content}</g>`;
const defs = id => `<defs>
 <linearGradient id="${id}-ceramic" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--rp-blue-light)"/><stop offset=".5" stop-color="var(--rp-blue)"/><stop offset="1" stop-color="var(--rp-blue-deep)"/></linearGradient>
 <linearGradient id="${id}-paper" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="var(--rp-paper)"/><stop offset="1" stop-color="var(--rp-paper-shade)"/></linearGradient>
 <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--rp-glass)" stop-opacity=".9"/><stop offset="1" stop-color="var(--rp-glass)" stop-opacity=".18"/></linearGradient>
 <radialGradient id="${id}-light"><stop stop-color="var(--rp-glow)" stop-opacity=".4"/><stop offset="1" stop-color="var(--rp-glow)" stop-opacity="0"/></radialGradient>
 <filter id="${id}-shadow" x="-50%" y="-50%" width="200%" height="210%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="var(--rp-shadow)" flood-opacity=".2"/></filter>
 </defs>`;
const mug = id => `<path d="M18-17 C47-23 49 15 21 15" fill="none" stroke="var(--rp-blue-deep)" stroke-width="9"/><path d="M-25-27H24L21 25Q-1 42-23 25Z" fill="url(#${id}-ceramic)"/><ellipse cx="-.5" cy="-27" rx="24.5" ry="7" fill="var(--rp-blue-light)"/><ellipse cx="0" cy="-27" rx="18" ry="4" fill="var(--rp-blue-deep)"/><path d="M-17-16L-15 19" stroke="var(--rp-shine)" stroke-width="3" stroke-linecap="round" opacity=".6"/>`;
const card = (id,x,y,scale=1,angle=0,opacity=1) => group(x,y,`<g filter="url(#${id}-shadow)"><rect x="-48" y="-63" width="96" height="126" rx="11" fill="url(#${id}-paper)"/><path d="M-37-53H36" class="rp-edge"/>${group(-2,-19,mug(id),.57)}${tx(0,44,'£20','rp-price')}</g>`,scale,angle,opacity);
const podium = (id,x,y,width=142) => group(x,y,`<ellipse cy="19" rx="${width*.58}" ry="20" fill="var(--rp-shadow)" opacity=".09"/><path d="M${-width/2} 0V18Q0 47 ${width/2} 18V0Z" fill="var(--rp-plinth-side)"/><ellipse rx="${width/2}" ry="20" fill="var(--rp-plinth)"/><ellipse cy="-2" rx="${width/2-7}" ry="15" fill="none" stroke="var(--rp-shine)" opacity=".6"/>`);
const bead = (id,x,y,r=8,colour='var(--rp-mint)') => `<circle cx="${x}" cy="${y}" r="${r+6}" fill="${colour}" opacity=".12"/><circle cx="${x}" cy="${y}" r="${r}" fill="${colour}"/><circle cx="${x-r*.25}" cy="${y-r*.3}" r="${r*.24}" fill="var(--rp-shine)"/>`;
const fly = (id,t,a,b,from,to,type='bead',lift=0) => {
 if(t<a||t>b)return '';
 const p=smooth(phase(t,a,b));
 const x=mix(from[0],to[0],p),y=mix(from[1],to[1],p)-Math.sin(p*Math.PI)*lift;
 return type==='card'?card(id,x,y,.7,-12*Math.sin(p*Math.PI)):type==='facts'?group(x,y,`<rect x="-39" y="-20" width="78" height="40" rx="9" fill="var(--rp-peach)"/>${tx(0,8,'£20','rp-mini rp-fact')}`,1,8*Math.sin(p*Math.PI)):bead(id,x,y);
};
const sourceFlight = (id,t,a,b,reverse=false) => {
 if(t<a||t>b)return '';
 const travel=reverse?1-smooth(phase(t,a,b)):smooth(phase(t,a,b));
 const p=travel<.6?travel/.6:(travel-.6)/.4,q=1-p;
 const points=travel<.6?[[102,258],[28,295],[24,486],[92,493]]:[[92,493],[210,510],[326,505],[381,446]];
 const coordinate = axis => q*q*q*points[0][axis]+3*q*q*p*points[1][axis]+3*q*p*p*points[2][axis]+p*p*p*points[3][axis];
 const x=coordinate(0),y=coordinate(1);
 return reverse?group(x,y,`<rect x="-39" y="-20" width="78" height="40" rx="9" fill="var(--rp-peach)"/>${tx(0,8,'£20','rp-mini rp-fact')}`):bead(id,x,y);
};
const spark = (x,y,p) => {
 if(p<=0||p>=1)return '';
 return `<g opacity="${1-p}">${[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;return `<circle cx="${x+Math.cos(a)*(15+p*24)}" cy="${y+Math.sin(a)*(15+p*24)}" r="${3*(1-p)+1}" fill="var(--rp-mint)"/>`;}).join('')}</g>`;
};
const book = (id,x,y,active) => group(x,y,`<ellipse cy="28" rx="91" ry="22" fill="var(--rp-shadow)" opacity=".10"/><g filter="url(#${id}-shadow)"><path d="M-75-30Q-38-48 0-24Q39-48 76-30V25Q37 12 0 35Q-38 12-75 25Z" fill="var(--rp-book-cover)"/><path d="M-70-38Q-35-52 0-30V26Q-34 8-70 18Z" fill="url(#${id}-paper)"/><path d="M0-30Q36-52 70-38V18Q35 8 0 26Z" fill="var(--rp-paper)"/><path d="M0-30V26" stroke="var(--rp-paper-shade)" stroke-width="3"/>${tx(-36,-4,'P7','rp-mini rp-fact')}${tx(37,-4,'£20','rp-mini rp-fact')}<path d="M-57 5L-16 13M15 13L57 5" class="rp-rule"/></g>${active?`<ellipse rx="94" ry="45" cy="-8" fill="url(#${id}-light)"/>`:''}`);
const stamp = (x,y,label,secondary='') => group(x,y,`<rect x="-89" y="-23" width="178" height="46" rx="23" fill="var(--rp-badge)"/>${tx(0,7,label,'rp-mini')}${secondary?tx(0,40,secondary,'rp-small'):''}`);

function read(t,variant='story') {
 const id='rp-read',hitOnly=variant==='hit';
 const built=hitOnly||t>=.47,filled=hitOnly||t>=.6,sourceRead=hitOnly||t>=.34;
 const hit=hitOnly?t>=.70:t>=.88;
 const assembling=!hitOnly&&t>=.43&&t<.51;
 let s=defs(id)+`<rect width="640" height="540" rx="24" fill="var(--rp-bg)"/><ellipse cx="342" cy="213" rx="290" ry="190" fill="url(#${id}-light)"/>`;
 s+=tx(34,42,hitOnly?'The next reader':'Make it once. Reuse it.','rp-heading','start');
 s+=stamp(515,40,sourceRead?'1 source read':'0 source reads');
 // The route to the source remains visible but idle after the first read.
 s+=`<path d="M102 258C28 295 24 486 92 493C210 510 326 505 381 446" class="rp-long-route"/><path d="M229 206Q321 147 410 206" class="rp-short-route"/>`;
 s+=podium(id,170,269)+podium(id,470,269);
 s+=`<path d="M405 229V112Q470 88 535 112V229" fill="url(#${id}-glass)" stroke="var(--rp-glass-edge)" stroke-width="1.5"/><path d="M413 114Q470 94 528 114" fill="none" stroke="var(--rp-shine)" stroke-width="2" opacity=".8"/>`;
 s+=tx(170,320,'App A','rp-label')+tx(470,320,'Cache','rp-label');
 s+=tx(170,345,assembling?'building the card':hit?'answer returned':built?'one card built':'asks for P7','rp-small');
 s+=tx(470,345,filled?'a saved copy':'empty','rp-small');
 if(filled){
  const landing=hitOnly?1:phase(t,.60,.70),settle=landing===1?1:1-Math.exp(-7*landing)*Math.cos(landing*10);
  s+=card(id,470,194-3*Math.sin(landing*Math.PI),.70+.13*settle,3*Math.sin(landing*Math.PI)*Math.exp(-landing*4));
 }
 else s+=`<rect x="432" y="151" width="76" height="91" rx="9" fill="none" stroke="var(--rp-glass-edge)" stroke-width="2" stroke-dasharray="4 8"/>`;
 if(built)s+=card(id,170,194,.83);
 else if(assembling){
  const p=smooth(phase(t,.43,.47));
  s+=group(170,194,`<rect x="-40" y="${-52-(1-p)*32}" width="80" height="105" rx="10" fill="url(#${id}-paper)" opacity="${p}"/>${group(0,-15-(1-p)*58,mug(id),.5,0,p)}${tx(0,38+(1-p)*32,'£20','rp-price')}`);
 } else s+=group(170,202,`<circle r="35" fill="var(--rp-app)"/>${tx(0,10,'P7?','rp-label')}`);
 s+=book(id,470,429,!hitOnly&&t>=.27&&t<.44);
 s+=tx(470,493,'Source','rp-label')+tx(470,519,'the original facts','rp-small');
 if(!hitOnly){
  s+=fly(id,t,.05,.12,[70,205],[135,205]);
  s+=fly(id,t,.13,.20,[220,205],[418,205],'bead',34);
  if(t>.2&&t<.28)s+=tx(322,132,'miss','rp-small');
  s+=sourceFlight(id,t,.24,.34);
  s+=sourceFlight(id,t,.36,.44,true);
  s+=fly(id,t,.51,.60,[170,194],[470,194],'card',90);
  s+=spark(470,194,phase(t,.59,.66));
  s+=fly(id,t,.68,.73,[70,205],[135,205]);
  s+=fly(id,t,.74,.79,[220,205],[418,205],'bead',34);
  s+=fly(id,t,.80,.88,[470,194],[170,194],'card',78);
 } else {
  s+=fly(id,t,.08,.23,[70,205],[135,205]);
  s+=fly(id,t,.26,.43,[220,205],[418,205],'bead',34);
  s+=fly(id,t,.48,.70,[470,194],[170,194],'card',78);
 }
 if(hit)s+=stamp(174,422,hitOnly?'Another answer':'2 answers', 'still only one source read');
 s+=spark(170,194,phase(t,hitOnly?.70:.88,hitOnly?.82:.98));
 if(filled)s+=tx(322,132,'the shortcut','rp-small');
 return `<svg viewBox="0 0 640 540" aria-hidden="true">${s}</svg>`;
}

function room(id,x,y,name,content,accent=false) {
 return group(x,y,`<ellipse cx="0" cy="77" rx="103" ry="17" fill="var(--rp-shadow)" opacity=".08"/><path d="M-87 45L-66 70H83L93 45Z" fill="var(--rp-plinth-side)"/><path d="M-87-67L-66-83H93V45L83 58H-87Z" fill="url(#${id}-glass)" stroke="${accent?'var(--rp-peach-deep)':'var(--rp-glass-edge)'}" stroke-width="1.6"/><path d="M-87-67H83V58M83-67L93-83M83-67V58" fill="none" stroke="var(--rp-glass-edge)" stroke-width="1"/><path d="M-78-58V42" stroke="var(--rp-shine)" stroke-width="2" opacity=".7"/>${tx(0,-41,name,'rp-label')}${content}`);
}

function placement(t,variant='story') {
 const id='rp-placement',asksA=variant==='app-a',asked=t>.3,answered=t>.7;
 let s=defs(id)+`<rect width="640" height="580" rx="24" fill="var(--rp-bg)"/>`;
 s+=tx(30,40,'Local','rp-heading','start')+tx(609,39,'inside each process','rp-small','end');
 s+=room(id,166,151,'App A',card(id,0,7,.58));
 s+=room(id,474,151,'App B',`<rect x="-28" y="-21" width="56" height="69" rx="7" fill="none" stroke="var(--rp-glass-edge)" stroke-width="2" stroke-dasharray="4 6"/>${asked&&!asksA?tx(0,24,'∅','rp-price'):''}`,asked&&!asksA);
 s+=tx(166,254,asked&&asksA?'hit · its own copy':'its own copy','rp-small')+tx(474,254,asked&&!asksA?'miss · needs its own fill':'its own empty memory','rp-small');
 if(t>.10&&t<.38){const p=smooth(phase(t,.1,.38));s+=bead(id,asksA?166:474,87+p*58,7);}
 s+=`<path d="M30 281H610" class="rp-rule"/>`+tx(30,319,'Shared','rp-heading','start')+tx(609,318,'outside both processes','rp-small','end');
 // Physical separation and visible bridges carry the network boundary.
 s+=`<path d="M180 464Q245 520 320 450Q400 520 460 464" fill="none" stroke="var(--rp-shadow)" stroke-width="14" opacity=".08"/><path d="M180 457Q245 512 320 443Q400 512 460 457" class="rp-network"/>`;
 const endpoint = name => `<circle cx="0" cy="2" r="25" fill="var(--rp-app)"/>${tx(0,11,name,'rp-mini')}`;
 s+=room(id,135,438,'App A',endpoint(answered&&asksA?'£20':'A'))+room(id,505,438,'App B',endpoint(answered&&!asksA?'£20':'B'));
 s+=podium(id,320,435,116)+card(id,320,393,.69);
 s+=tx(320,335,'Cache','rp-label');
 s+=tx(135,547,answered&&asksA?'reply · across the network':'network','rp-small')+tx(505,547,answered&&!asksA?'reply · across the network':'network','rp-small');
 s+=tx(320,577,'one shared copy','rp-small');
 s+=fly(id,t,.1,.36,[asksA?184:456,457],[asksA?288:352,433],'bead',-31);
 s+=fly(id,t,.43,.70,[320,393],[asksA?135:505,427],'card',47);
 if(answered)s+=spark(asksA?135:505,433,phase(t,.69,.81));
 return `<svg viewBox="0 0 640 590" aria-hidden="true">${s}</svg>`;
}

export const scenes = {
 read: {
  title:'A little work, saved for later',
  caption:'App A reads the source and builds north’s English P7 card in GBP. Saving a copy lets the next reader skip that work. The motion is illustrative, not measured time.',
  alt:'App A reads the original £20 facts, builds a blue-mug card and saves a copy. The next reader takes the short route to that saved card. Two answers need only one source read.',
  altFor: variant => variant==='hit'?'Another reader receives the saved £20 card. The source-read count remains one.':'App A reads the original £20 facts, builds a blue-mug card and saves a copy. The next reader takes the short route to that saved card. Two answers need only one source read.',
  duration:14000,durationFor:variant=>variant==='hit'?3500:14000,render:read,actions:[{value:'hit',label:'Another reader'}]
 },
 placement: {
  title:'A room of its own, or a place to share',
  caption:'The glass rooms are application processes. App B cannot use App A’s local copy. Both can reach the shared cache, but each lookup and reply crosses the network.',
  alt:'Two arrangements of the same apps. Local: the £20 card sits inside App A, while App B’s own cache is empty and misses. Shared: one card sits outside both apps, and App B receives £20 across the network.',
  altFor: variant => variant==='app-a'?'App A finds its own £20 local copy without a network trip. In the shared arrangement, App A receives £20 from the separate cache across the network. App B’s own local memory remains empty.':'Local: App B cannot use App A’s £20 copy and its own empty cache misses. Shared: App B receives £20 from the cache outside both processes, across the network.',
  duration:8500,durationFor:variant=>variant==='app-a'?4000:8500,render:placement,actions:[{value:'app-a',label:'Ask from App A'}]
 }
};
