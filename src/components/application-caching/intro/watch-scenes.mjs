// These are explanatory drawings, not a service simulation. Time is presentation time.
const clamp = x => Math.max(0, Math.min(1, x));
const phase = (t, a, b) => clamp((t-a)/(b-a));
const ease = x => x*x*(3-2*x);
const svg = (height, body) => `<svg viewBox="0 0 560 ${height}" aria-hidden="true">${body}</svg>`;
const text = (x,y,s,cls='',anchor='middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${s}</text>`;
const path = (d,cls='route',extra='') => `<path d="${d}" class="${cls}" ${extra}/>`;
const mug = (x,y,scale=1) => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-16-18 L14-18 L12 13 Q-1 25-14 13 Z" fill="var(--blue)" stroke="var(--color-text)" stroke-width="1.4"/><path d="M14-11 C35-13 35 11 13 9" class="sketch"/><path d="M-10-13 L-10 10" stroke="var(--color-surface)" stroke-width="2" opacity=".6"/></g>`;
const card = (x,y,price='20',scale=1,opacity=1,rotation=0) => `<g opacity="${opacity}" transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><rect x="-40" y="-48" width="80" height="96" rx="6" class="paper"/>${mug(0,-14,.8)}<text x="0" y="32" text-anchor="middle" style="font-size:${Math.max(19,22/scale)}px">£${price}</text></g>`;
const app = (x,y,label='App A',value='P7') => `<g transform="translate(${x} ${y})"><rect x="-47" y="-35" width="94" height="70" rx="7" class="paper"/>${path('M-46-18H46','rule')}<circle cx="-33" cy="-26" r="3" class="teal"/><circle cx="-23" cy="-26" r="3" class="teal" opacity=".5"/>${text(0,16,value,'small')}${text(0,65,label,'small')}</g>`;
const database = (x,y,price='20',label='Source') => `<g transform="translate(${x} ${y})"><path d="M-40-26 V29 C-40 48 40 48 40 29 V-26" class="paper"/><ellipse cx="0" cy="-26" rx="40" ry="13" class="paper"/>${path('M-40 1 C-40 20 40 20 40 1','rule')}${text(0,31,`£${price}`,'small')}${text(0,76,label,'small')}</g>`;
const tray = (x,y,content='',label='Cache') => `<g transform="translate(${x} ${y})"><path d="M-53-25 L-61 36 Q-61 46-49 46 H49 Q61 46 61 36 L53-25" fill="none" stroke="var(--color-text-secondary)" stroke-width="2"/>${content}${path('M-61 29 H-23 L-17 40 H17 L23 29 H61','route')}${text(0,76,label,'small')}</g>`;
const dot = (x,y,r=7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--teal)" stroke="var(--color-surface)" stroke-width="2"/>`;
const flight = (t,a,b,x1,y1,x2,y2,isCard=false,price='20',arc=0) => {
  if(t<a||t>b)return '';
  const p=ease(phase(t,a,b)), x=x1+(x2-x1)*p, y=y1+(y2-y1)*p-Math.sin(p*Math.PI)*arc;
  return isCard?card(x,y,price,.6):dot(x,y);
};

export const stories = {
 read:{title:'The second request takes the short route',duration:13500,caption:'First request: one source read. Next request: reuse the saved card. P7 is north’s English product card in GBP; the animation’s timing is illustrative.',alt:'Two request paths. The first misses the empty cache, reads the source through App A and saves a £20 card. The next reuses that card without another source read.'},
 placement:{title:'Inside each app, or shared between them',duration:0,caption:'A local copy belongs to one process. A shared copy is reachable by both apps, across the network.',alt:'Local placement: App A holds a saved product card inside its own memory; App B’s memory is empty. Shared placement: the card sits outside both apps and both can reach it.'},
 identity:{title:'Same product ID. Different shops.',duration:0,caption:'South’s P7 costs £18. Reusing north’s £20 card is a wrong answer, even though the cache lookup succeeds. Include the shop in the key.',alt:'Two comparisons. A key of P7 merges north and south into one cached £20 answer. Separate north:P7 and south:P7 keys keep their £20 and £18 cards apart. Language, currency and format are omitted from these short labels.'},
 change:{title:'Changing the source leaves a copy behind',duration:12000,caption:'Commit £22 at the source, then delete the old £20 copy. The next request must fetch a replacement. This sequence has no overlapping read.',alt:'The source changes from £20 to £22 while the cached card still says £20. App A then invalidates the old card, leaving an empty cache and a £22 source.'},
 burst:{title:'Four requests. One piece of work.',duration:10500,caption:'The same four overlapping requests inside App A. Sharing the fill saves three source reads; all four callers still wait for their answers.',alt:'Two simultaneous comparisons: four callers independently create four source reads, or gather behind one shared source read. Both return four £20 cards.'},
 memory:{title:'A big answer can push useful little ones out',duration:11000,caption:'Both rows have a 4 KiB budget. The 3 KiB answer is returned to its caller in both cases. Keeping it displaces three 1 KiB cards that the next requests need. Invented sizes and eviction order.',alt:'Store the large result: P7 remains, P3, P9 and P40 are evicted, and the next three requests miss. Skip storing it: all four cards remain and the next three requests hit.'}
};

function read(t) {
 const filled=t>=.50, returned=t>=.42, hit=t>=.87;
 let s=text(25,32,'First request','serif','start');
 s+=path('M130 105H225','route', 'stroke-dasharray="4 6"')+path('M130 130 Q285 222 430 130','route');
 s+=app(80,106,'',returned?'£20':'P7?');
 s+=tray(280,106,filled?card(0,-4,'20',.65):text(0,12,'empty','tiny muted'),'');
 s+=database(475,106,'20','')+text(80,59,'App A','small')+text(280,59,'Cache','small')+text(475,59,'Source','small');
 s+=text(475,32,t>=.28?'1 source read':'Source owns P7','small');
 if(t>=.13&&t<.29)s+=text(280,213,'miss','small coral');
 s+=flight(t,.04,.13,130,105,225,105);
 s+=flight(t,.21,.28,130,130,430,130,false,'20',-55);
 s+=flight(t,.30,.42,430,130,130,130,true,'20',-55);
 s+=flight(t,.43,.50,130,100,280,100,true);
 s+=path('M22 235H538','rule')+text(25,273,'Next request','serif','start');
 s+=path('M130 346H225','route active');
 s+=app(80,347,'',hit?'£20':'P7?')+tray(280,347,card(0,-4,'20',.65),'');
 s+=database(475,347,'20','')+text(80,300,'App A','small')+text(280,300,'Cache','small')+text(475,300,'Source','small')+text(475,273,'0 source reads','small');
 s+=flight(t,.63,.72,130,346,225,346)+flight(t,.77,.87,240,335,130,335,true,'20',25);
 if(hit)s+=text(280,425,'hit','small teal');
 return svg(435,s);
}

function placement() {
 let s=text(25,35,'Local','serif','start');
 for(const [x,label,filled] of [[145,'App A',true],[415,'App B',false]]){
  s+=`<rect x="${x-105}" y="65" width="210" height="160" rx="12" class="paper"/>`+text(x,96,label);
  s+=filled?card(x,160,'20',.85):`<rect x="${x-35}" y="122" width="70" height="79" rx="5" fill="none" stroke="var(--color-text-secondary)" stroke-dasharray="4 5"/>`;
 }
 s+=text(145,256,'Own saved copy','small')+text(415,256,'Still empty','small');
 s+=path('M22 284H538','rule')+text(25,324,'Shared','serif','start');
 s+=app(145,390,'App A','P7?')+app(415,390,'App B','P7?');
 s+=path('M145 459 Q145 510 232 525','route active')+path('M415 459 Q415 510 328 525','route active');
 s+=tray(280,525,card(0,-4,'20',.75),'One shared copy');
 s+=text(105,520,'network','tiny muted')+text(455,520,'network','tiny muted');
 return svg(620,s);
}

function identity() {
 let s=text(25,34,'One key merges two questions','serif','start');
 s+=text(95,91,'north','small')+text(95,155,'south','small');
 s+=path('M155 85 Q210 85 250 117 M155 150 Q210 150 250 117','route');
 s+=`<rect x="245" y="91" width="85" height="52" rx="25" class="paper"/>`+text(287,125,'P7');
 s+=path('M330 117H400','route')+card(453,112,'20',.9);
 s+=text(282,204,'South gets north’s £20 card','small coral');
 s+=path('M22 232H538','rule')+text(25,274,'Separate keys keep answers apart','serif','start');
 for(const [y,key,price] of [[340,'north:P7','20'],[463,'south:P7','18']]){
  s+=`<rect x="55" y="${y-26}" width="190" height="52" rx="25" class="paper"/>`+text(150,y+8,key);
  s+=path(`M245 ${y}H405`,'route active')+card(453,y,price,.9);
 }
 return svg(535,s);
}

function change(t) {
 const changed=t>=.24, deleting=phase(t,.60,.69), deleted=t>=.69;
 let s=text(135,40,'Source','serif')+text(425,40,'Cached copy','serif');
 s+=`<ellipse cx="135" cy="233" rx="77" ry="10" class="halo"/><ellipse cx="425" cy="233" rx="77" ry="10" class="${changed&&!deleted?'mistake':'halo'}"/>`;
 s+=card(135,138,changed?'22':'20',1.5);
 if(!deleted)s+=card(425,138+deleting*65,'20',1.5*(1-deleting*.15),1-deleting,deleting*14);
 else s+=`<rect x="365" y="66" width="120" height="144" rx="9" fill="none" stroke="var(--color-text-secondary)" stroke-dasharray="5 7"/>`+text(425,145,'empty','small muted');
 if(changed)s+=text(135,278,'New price committed','small teal');
 if(changed&&!deleted)s+=text(425,278,'Still the old price','small coral');
 if(deleted)s+=text(425,278,'£20 copy removed','small');
 s+=app(280,360,'App A',changed?(deleted?'done':'DEL'):'update');
 s+=path('M233 344 Q135 330 135 300','route')+path('M327 344 Q425 330 425 300','route');
 s+=flight(t,.09,.24,233,344,135,300)+flight(t,.51,.60,327,344,425,300);
 return svg(450,s);
}

function burst(t) {
 let s='';
 const done=t>=.64;
 for(const [row,shared] of [[0,false],[1,true]]){
  const y=row*255;
  s+=text(25,y+32,shared?'Share one fill':'Everyone loads','serif','start');
  s+=text(515,y+32,shared?'1 read':'4 reads','small','end');
  for(let i=0;i<4;i++){
   const sy=y+78+i*40,dy=shared?y+138:sy;
   s+=`<circle cx="56" cy="${sy}" r="15" class="paper"/>`+text(56,sy+7,String(i+1),'tiny');
   s+=path(`M78 ${sy} C200 ${sy} 260 ${dy} 375 ${dy}`,'route active');
   const p=phase(t,.12+i*.035,.34+i*.035);
   if(p>0&&p<1)s+=dot(78+(375-78)*ease(p),sy+(dy-sy)*ease(p));
   const q=phase(t,.65+i*.025,.81+i*.025);
   if(q>0&&q<1)s+=flight(q,0,1,375,dy,80,sy,true,'20',10);
   if(t>=.81+i*.025)s+=`<rect x="78" y="${sy-14}" width="57" height="29" rx="4" fill="var(--color-surface-alt)"/>`+text(106,sy+7,'£20','tiny teal');
   if(!shared||i===0){
    const jy=shared?y+138:sy;
    s+=`<rect x="382" y="${jy-15}" width="126" height="30" rx="5" class="paper"/>`;
    const work=phase(t,.40,.64);
    s+=`<rect x="385" y="${jy-12}" width="${120*work}" height="24" rx="3" class="halo"/>`+text(445,jy+6,done?'finished':'read P7','tiny');
   }
  }
  if(row===0)s+=path('M22 246H538','rule');
 }
 return svg(505,s);
}

function memory(t) {
 let s=''; const moved=phase(t,.22,.43), checking=phase(t,.65,.85);
 for(const [row,admit] of [[0,true],[1,false]]){
  const y=row*250;
  s+=text(25,y+32,admit?'Keep the big result':'Keep the useful cards','serif','start');
  s+=`<rect x="39" y="${y+63}" width="482" height="99" rx="7" fill="none" stroke="var(--color-text-secondary)" stroke-width="2"/>`;
  for(let i=0;i<4;i++){
   const departing=admit&&i>0;
   const opacity=departing?1-moved:1, shift=departing?moved*85:0;
   s+=`<g opacity="${opacity}" transform="translate(0 ${shift})"><rect x="${46+i*119}" y="${y+70}" width="110" height="85" rx="4" class="paper"/>${mug(101+i*119,y+97,.55)}${text(101+i*119,y+141,['P7','P3','P9','P40'][i],'small')}</g>`;
  }
  if(admit&&moved>0){
   const drop=(1-moved)*-40;
   s+=`<g opacity="${moved}" transform="translate(0 ${drop})"><rect x="165" y="${y+70}" width="348" height="85" rx="4" class="paper"/><path d="M185 ${y+91}H493 M185 ${y+106}H493 M185 ${y+121}H360" class="rule"/>${text(339,y+143,'One large answer · 3 KiB','small')}</g>`;
  }
  s+=text(280,y+191,'4 KiB of cache space','tiny muted');
  if(checking>0){s+=`<g opacity="${checking}">`+text(280,y+226,admit?'P3, P9, P40 → 3 misses':'P3, P9, P40 → 3 hits',`small ${admit?'coral':'teal'}`)+'</g>';}
  if(!row)s+=path('M22 245H538','rule');
 }
 return svg(500,s);
}

export function scene(kind,t=1) {
 return ({read,placement,identity,change,burst,memory})[kind](clamp(t));
}
