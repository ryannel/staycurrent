// Bounded teaching sequences, not observed cache execution or measured timings.
const clamp=x=>Math.max(0,Math.min(1,x));
const part=(t,a,b)=>clamp((t-a)/(b-a));
const ease=x=>x*x*(3-2*x);
const ink='var(--color-text)', paper='var(--color-surface)';
const line=(x1,y1,x2,y2,c='--color-text-secondary',extra='')=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="var(${c})" stroke-width="1.6" ${extra}/>`;
const text=(x,y,v,size=21,c='--color-text',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" fill="var(${c})" style="font:400 ${size}px var(--font-sans)">${v}</text>`;
const box=(x,y,w,h,c='--color-text-secondary',fill=paper)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="var(${c})" stroke-width="1.6"/>`;
const ball=(x,y,c='--teal',r=12)=>`<g><ellipse cx="${x}" cy="${y+r+7}" rx="${r*.8}" ry="2.5" fill="${ink}" opacity=".08"/><circle cx="${x}" cy="${y}" r="${r}" fill="var(${c})"/><ellipse cx="${x-r*.3}" cy="${y-r*.35}" rx="${r*.4}" ry="${r*.23}" fill="${paper}" opacity=".35" transform="rotate(-30 ${x-r*.3} ${y-r*.35})"/></g>`;
const travel=(t,a,b,from,to,c='--teal')=>{if(t<a||t>b)return '';const p=ease(part(t,a,b));return ball(from[0]+(to[0]-from[0])*p,from[1]+(to[1]-from[1])*p-Math.sin(p*Math.PI)*9,c);};
const svg=(body,W,H,small)=>`<svg class="story-${small?'portrait':'landscape'}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${body}</svg>`;
const both=(fn,t,v)=>fn(clamp(t),false,v)+fn(clamp(t),true,v);
const colours=['--coral','--purple','--teal'];
const names=['Mug','Spoon','Bowl'];
function browser(x,y,label='App'){return box(x-25,y-20,50,40)+line(x-25,y-8,x+25,y-8)+text(x,y+48,label,19);}
function database(x,y,value=''){return `<path d="M${x-30} ${y-20}V${y+22}C${x-30} ${y+40} ${x+30} ${y+40} ${x+30} ${y+22}V${y-20}" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/><ellipse cx="${x}" cy="${y-20}" rx="30" ry="10" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`+text(x,y+13,value,18)+text(x,y+65,'Database',19);}
function work(t,small){
 const W=small?440:760, x=small?[45,155,275,395]:[70,270,465,680];let s='';
 const labels=['No cache','Cache the record','Cache the card'];
 labels.forEach((label,i)=>{const y=90+i*190, start=i*.2, p=part(t,start,start+.45);s+=text(W/2,y-43,label,25);
 s+=line(x[0]+18,y,x[3]-18,y)+browser(x[0],y);
 const source=i===0,assembly=i<2;
 s+=box(x[1]-36,y-27,72,54,source?'--blue':'--teal')+text(x[1],y+7,source?'Read':'Cache',small?18:21);
 s+=box(x[2]-39,y-27,78,54,assembly?'--gold':'--color-rule-strong')+text(x[2],y+7,assembly?'Build':'Ready',small?18:21);
 s+=`<circle cx="${x[3]}" cy="${y}" r="24" fill="${paper}" stroke="var(--teal)" stroke-width="1.6"/>`+text(x[3],y+6,'✓',23);
 if(p>0&&p<1){const path=i===0?[[x[0],y],[x[1],y],[x[2],y],[x[3],y]]:i===1?[[x[0],y],[x[1],y],[x[2],y],[x[3],y]]:[[x[0],y],[x[1],y],[x[3],y]];const q=p*(path.length-1),j=Math.min(path.length-2,Math.floor(q));s+=travel(q-j,0,1,path[j],path[j+1],colours[i]);}
 const saving=i===0?'Read and assemble':i===1?'Reuse the data; assemble again':'Reuse the finished answer';s+=text(W/2,y+83,saving,small?19:22);
 if(i<2)s+=line(22,y+112,W-22,y+112,'--color-rule-strong');});
 return svg(s,W,610,small);
}
const trace=[0,0,1,0,2,0,1,0];
export function reuseState(t){const completed=Math.min(8,Math.floor(clamp(t)*8));const seen=new Set();let hits=0;for(const k of trace.slice(0,completed)){if(seen.has(k))hits++;seen.add(k);}return {completed,hits,misses:completed-hits,seen};}
function reuse(t,small){
 const W=small?440:760,A=small?45:70,S=small?160:270,C=small?325:535,D=small?325:650,y=280,cy=220,dy=385;
 const state=reuseState(t);let s=text(W/2,35,'A new answer costs a source read',small?23:26);
 s+=text(W/2,76,'Requests, in arrival order',18,'--color-text-secondary');
 trace.forEach((k,i)=>{const x=35+i*(W-70)/7,active=i<state.completed;s+=`<circle cx="${x}" cy="110" r="${small?15:19}" fill="${active?'var('+colours[k]+')':paper}" stroke="var(${colours[k]})" stroke-width="1.7"/>`+text(x,116,['M','S','B'][k],16);});
 s+=line(A+25,y,S-28,y)+line(S,y,C,cy)+line(S,y,D,dy)+browser(A,y);
 s+=`<circle cx="${S}" cy="${y}" r="28" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`+text(S,y+6,'↔',24)+text(S,y+53,'Server',20);
 s+=database(D,dy)+`<circle cx="${C}" cy="${cy}" r="43" fill="${paper}" stroke="var(--teal)" stroke-width="1.8"/>`+text(C,cy-60,'Cache',24);
 [...state.seen].forEach((k,j)=>{s+=ball(C+(j-1)*23,cy,colours[k],9);});
 s+=text(C,cy+69,`${state.hits} hits`,18,'--color-text-secondary')+text(D,dy+94,`${state.misses} reads`,18,'--color-text-secondary');
 if(t<1){const n=Math.min(7,Math.floor(t*8)),p=t*8-n,k=trace[n],miss=!trace.slice(0,n).includes(k);
 const path=miss?[[A,y],[S,y],[C,cy],[S,y],[D,dy],[S,y],[C,cy],[S,y],[A,y]]:[[A,y],[S,y],[C,cy],[S,y],[A,y]];
 const q=p*(path.length-1),j=Math.min(path.length-2,Math.floor(q));s+=travel(q-j,0,1,path[j],path[j+1],colours[k]);}
 s+=text(W/2,528,`${state.misses} cache misses · ${state.hits} hits`,26);
 names.forEach((n,i)=>{const x=W/2+(i-1)*(small?118:160);s+=ball(x-36,572,colours[i],8)+text(x+9,579,n,19);});
 return svg(s,W,610,small);
}
export function costState(variant){const hits=variant==='more'?19:16,source=variant==='cheap'?2:20,miss=source+5;return {hits,source,miss,mean:(hits*2+(20-hits)*miss)/20,p95:hits>=19?2:miss};}
function cost(t,small,variant){const W=small?440:760,{hits,source,miss,mean,p95}=costState(variant),left=small?105:150,width=W-left-75,p=ease(part(t,0,.55));let s=text(W/2,32,'What one request waits for',25);
 const rows=[['No cache',source,[['--blue',source]]],['Hit',2,[['--teal',2]]],['Miss',miss,[['--teal',2],['--blue',source],['--gold',3]]]];
 rows.forEach(([label,total,segments],i)=>{const y=88+i*70;s+=text(left-17,y+6,label,small?18:21,'--color-text','end')+line(left,y,left+width,y,'--color-rule-strong');let offset=0;segments.forEach(([c,n])=>{s+=`<rect x="${left+offset*width/25}" y="${y-10}" width="${n*width/25*p}" height="20" rx="6" fill="var(${c})"/>`;offset+=n;});s+=text(left+width+12,y+6,`${total} ms`,small?16:19,'--color-text','start');});
 s+=text(W/2,295,'Twenty requests, fastest first',21);
 for(let i=0;i<20;i++){const x=27+i*(W-54)/19,y=345-Math.sin(part(t,.3+i*.015,.65+i*.015)*Math.PI)*14;s+=`<circle cx="${x}" cy="${y}" r="${small?7:11}" fill="var(${i<hits?'--teal':'--coral'})"/>`;if(i===18)s+=`<circle cx="${x}" cy="345" r="${small?12:17}" fill="none" stroke="${ink}" stroke-width="1.5"/>`;}
 s+=text(W/2,393,`${hits} hits · ${20-hits} misses`,20);
 s+=text(W/2,439,`Mean ${Number(mean.toFixed(2))} ms · p95 ${p95} ms`,26);
 s+=text(W/2,477,'Outlined request: 19th of 20',18,'--color-text-secondary');return svg(s,W,505,small);}
function placement(t,small){const W=small?440:760,now=Math.min(32,Math.floor(t*36)),updated=now>=20,a=now>=31?'£22':now===30?'—':'£20',b=now>=10?'£20':'—',shared=now>=31?'£22':now===30?'—':'£20';let s=text(W/2,35,`Database: ${updated?'£22':'£20'} · ${now} s`,25);
 const node=(x,y,value,expiry,label,c)=>box(x-57,y-34,114,68,c)+text(x,y+7,value,27)+text(x,y+63,label,small?18:21)+text(x,y+91,expiry,small?16:18,'--color-text-secondary');
 s+=text(W/2,105,'Local caches',25)+node(W*.28,170,a,now>=31?'expires at 61 s':'expires at 30 s','Server A','--coral')+node(W*.72,170,b,now>=10?'expires at 40 s':'not filled yet','Server B','--purple');
 s+=text(W/2,304,now>=31?'Different lifetimes, different prices':now>=20?'The source changes; the copies stay':'Each process keeps its own copy',small?20:23);
 s+=line(20,340,W-20,340,'--color-rule-strong')+text(W/2,387,'Shared cache',25);
 s+=node(W/2,455,shared,now>=31?'expires at 61 s':'expires at 30 s','Cache','--teal');
 s+=text(W/2,585,now>=31?'Either server can reuse the new copy':now>=20?'Shared does not mean current':'One fill serves either server',small?20:23);
 return svg(s,W,615,small);}
function anatomy(t,small){const W=small?440:760,items=[['product','Operation','--blue'],['v1','Format','--gold'],['north','Shop','--coral'],['P7','Product','--purple'],['en-GB','Language','--teal'],['GBP','Currency','--blue']],cols=small?3:6,cw=(W-40)/cols;let s=text(W/2,36,'One name for one answer',26);
 items.forEach(([value,label,c],i)=>{const col=i%cols,row=Math.floor(i/cols),x=20+cw*col,y=105+row*125,p=ease(part(t,i*.1,i*.1+.23));s+=`<g opacity="${.25+.75*p}">${box(x+4,y+(1-p)*17,cw-8,53,c)}${text(x+cw/2,y+34+(1-p)*17,value,small?22:21)}${text(x+cw/2,y+83,label,18,'--color-text-secondary')}</g>`;});
 const y=small?370:260;s+=line(35,y-35,W-35,y-35,'--color-rule-strong')+text(W/2,y,'Different browsers can share this card.',small?20:23)+text(W/2,y+37,'A different shop needs a different key.',small?20:23);return svg(s,W,y+65,small);}
function encoding(t,small,v){const W=small?440:760,json=v==='json',p=ease(part(t,.25,.7)),output=json?['["north:outlet", "P7"]','["north", "outlet:P7"]']:['north:outlet:P7','north:outlet:P7'];let s=text(W/2,32,json?'Keep the field boundaries':'A separator can lose the boundary',small?23:26);
 [['north:outlet','P7'],['north','outlet:P7']].forEach((parts,i)=>{const y=105+i*185,c=i?'--purple':'--coral',a=W*.32,b=W*.72;s+=text(a,y-22,'Shop',18,'--color-text-secondary')+text(b,y-22,'Product',18,'--color-text-secondary')+box(a-77,y-6,154,48,c)+box(b-58,y-6,116,48,c)+text(a,y+25,parts[0],small?19:23)+text(b,y+25,parts[1],small?19:23);s+=line(W/2,y+50,W/2,y+83,c)+`<g opacity="${p}">${text(W/2,y+120,output[i],small?20:25)}</g>`;});s+=text(W/2,465,json?'Different keys':'Identical keys',28,json?'--color-text':'--color-text');return svg(s,W,495,small);}
function permission(t,small){const W=small?440:760,A=55,S=W/2,C=W-62,y=175;let s=text(W/2,35,'Permission belongs to this request',small?23:27)+line(A+25,y,S-40,y)+line(S+40,y,C-40,y)+browser(A,y)+box(S-43,y-40,86,80)+text(S,y+8,t>=.8?'Denied':'Check',small?20:23)+text(S,y+72,'Server',20)+`<circle cx="${C}" cy="${y}" r="40" fill="${paper}" stroke="var(--teal)" stroke-width="1.8"/>`+text(C,y-61,'Cache',22)+text(C,y+8,'£20',24);
 s+=travel(t,0,.18,[A,y],[S,y],'--teal')+travel(t,.22,.38,[S,y],[C,y],'--teal')+travel(t,.4,.49,[C,y],[S,y],'--teal')+travel(t,.49,.58,[S,y],[A,y],'--teal');
 s+=travel(t,.62,.79,[A,y],[S,y],'--coral')+travel(t,.82,1,[S,y],[A,y],'--coral');
 s+=text(W/2,315,t<.6?'Allowed: the cached answer can return':'Denied: the answer stays in the cache',small?20:25);return svg(s,W,360,small);}
function versions(t,small){const W=small?440:760,x=W/2,w=small?340:470,updated=t>.35,reformatted=t>.7;let s=text(x,35,'Two kinds of change',28);
 s+=text(x,90,'The product changes',23)+box(x-w/2,113,w,110,'--coral')+text(x,146,'product:v1:north:P7:en-GB:GBP',small?18:24)+text(x,187,updated?'revision 2 · 2200 pence':'revision 1 · 2000 pence',small?23:27)+text(x,258,'Same format, newer source value',small?21:24);
 s+=line(20,293,W-20,293,'--color-rule-strong')+text(x,338,'The representation changes',23)+box(x-w/2,362,w,110,'--purple')+text(x,396,reformatted?'product:v2:north:P7:en-GB:GBP':'product:v1:north:P7:en-GB:GBP',small?18:24)+text(x,438,reformatted?'revision 2 · “£22.00”':'revision 2 · 2200 pence',small?23:27)+text(x,509,'New format, same source revision',small?21:24);return svg(s,W,540,small);}
const scene=(title,duration,render,alt,caption,extra={})=>({title,duration,render:(t,v)=>both(render,t,v),alt,caption,...extra});
export const scenes={
 work:scene('What a hit removes',10500,work,'Three request paths: without a cache, read the source and assemble a card. A cached record skips the source read but still needs assembly. A cached card reuses the finished answer.','Where the copy sits in the work determines what a hit can skip. Warm-cache paths are shown; common response work is omitted.'),
 reuse:scene('Reuse follows the requests',20000,reuse,'Eight requests ask for mug, mug, spoon, mug, bowl, mug, spoon and mug. An initially empty cache has three misses and five hits. No entries expire or leave.','Colours identify products. Each completed fill precedes the next request; this illustrative cache retains every answer.'),
 cost:scene('A faster mean, slower misses',6500,cost,'Twenty requests have sixteen hits and four misses. Hits take 2 ms, source work takes 20 ms and a fill takes 3 ms. The mean is 6.6 ms while the nineteenth request, p95, takes 25 ms.','Invented constant times, with one lookup per request and no queueing. Teal is lookup work, blue source work and gold a fill. The dots show hits in teal and misses in coral.',{defaultVariant:'normal',actions:[{value:'normal',label:'16 hits'},{value:'more',label:'19 hits'},{value:'cheap',label:'Cheaper source'}],altFor:v=>{const c=costState(v);return `${c.hits} hits at 2 ms and ${20-c.hits} ${20-c.hits===1?'miss':'misses'} at ${c.miss} ms. Uncached source work takes ${c.source} ms. Mean ${c.mean} ms; nearest-rank p95 ${c.p95} ms.`;}}),
 placement:scene('Separate copies, separate lifetimes',14000,placement,'Server A fills at time zero and B at ten seconds. Each local copy lasts thirty seconds. The database changes to £22 at twenty seconds. At thirty-one seconds A refills while B still holds £20. In the shared version both servers can use A’s £22 refill.','A close-up of the copies held by the two arrangements. Requests fill A at 0 s and B at 10 s; A requests again at 31 s. Only expiry is used, with a 30-second lifetime from each fill.'),
 anatomy:scene('The parts of a cache key',7000,anatomy,'The key product:v1:north:P7:en-GB:GBP identifies operation, format, shop, product, language and currency. Requests from different browsers can share it; a different shop needs a different key.','Each field preserves a distinction the answer needs. A request identifier would divide otherwise identical answers.'),
 encoding:scene('Preserving field boundaries',6000,encoding,'Shop north:outlet with product P7 and shop north with product outlet:P7 both join to north:outlet:P7. A JSON array preserves the two different field boundaries.','Only the shop and product fields are drawn. The operation, version, language and currency are identical in both requests.',{defaultVariant:'joined',actions:[{value:'joined',label:'Join with colons'},{value:'json',label:'Keep fields separate'}],altFor:v=>v==='json'?'JSON arrays ["north:outlet","P7"] and ["north","outlet:P7"] remain distinct.':'Joining either field pair with colons produces north:outlet:P7, losing the boundary.'}),
 permission:scene('A hit still needs permission',10000,permission,'An allowed request passes the server’s access check and receives a cached answer. A denied request stops at that check and returns without the restricted data.','A restricted-view example. The server checks the current caller before returning data, including on a cache hit.'),
 versions:scene('Format is not freshness',8500,versions,'First the price changes from 2000 to 2200 pence, revision 1 to revision 2, within format v1. Then a display-string format uses v2 while the source remains at revision 2.','The format describes how to read a value. The source revision identifies which product state it describes.'),
};
