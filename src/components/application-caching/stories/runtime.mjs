// Illustrative control flow and accounting, not observed service timings.
const clamp=x=>Math.max(0,Math.min(1,x));
const part=(t,a,b)=>clamp((t-a)/(b-a));
const ease=x=>x*x*(3-2*x);
const paper='var(--color-surface)';
const text=(x,y,s,size=22,c='--color-text',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" fill="var(${c})" style="font:400 ${size}px var(--font-sans)">${s}</text>`;
const route=(a,b,c='--color-text-secondary',extra='')=>`<path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" fill="none" stroke="var(${c})" stroke-width="1.6" ${extra}/>`;
const ball=(x,y,c='--coral',r=12)=>`<ellipse cx="${x}" cy="${y+r+7}" rx="${r*.75}" ry="2.5" fill="var(--color-text)" opacity=".08"/><circle cx="${x}" cy="${y}" r="${r}" fill="var(${c})"/><ellipse cx="${x-r*.3}" cy="${y-r*.3}" rx="${r*.4}" ry="${r*.23}" fill="${paper}" opacity=".4" transform="rotate(-30 ${x} ${y})"/>`;
const move=(t,a,b,p,q,c)=>{if(t<a||t>b)return '';const f=ease(part(t,a,b));return ball(p[0]+(q[0]-p[0])*f,p[1]+(q[1]-p[1])*f-Math.sin(f*Math.PI)*8,c);};
const pair=(x,y)=>ball(x-6,y,'--blue',8)+ball(x+7,y,'--gold',8);
const svg=(body,w,h,small)=>`<svg class="story-${small?'portrait':'landscape'}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${body}</svg>`;
function app(x,y){return `<rect x="${x-26}" y="${y-22}" width="52" height="44" rx="7" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`+route([x-26,y-10],[x+26,y-10])+text(x,y+57,'App',22);}
function server(x,y){return `<circle cx="${x}" cy="${y}" r="30" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/><rect x="${x-15}" y="${y-14}" width="30" height="11" rx="3" fill="none" stroke="var(--color-text-secondary)"/><rect x="${x-15}" y="${y+3}" width="30" height="11" rx="3" fill="none" stroke="var(--color-text-secondary)"/>`+text(x,y+62,'Server',22);}
function cache(x,y,value='',label='Cache',c='--teal'){return `<circle cx="${x}" cy="${y}" r="39" fill="${paper}" stroke="var(${c})" stroke-width="1.8"/>`+text(x,y-61,label,23)+(value==='pair'?pair(x,y):text(x,y+8,value,23));}
function database(x,y,value='',label='Database'){return `<path d="M${x-32} ${y-22}V${y+22}C${x-32} ${y+40} ${x+32} ${y+40} ${x+32} ${y+22}V${y-22}" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/><ellipse cx="${x}" cy="${y-22}" rx="32" ry="10" fill="${paper}" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`+text(x,y-61,label,23)+(value==='pair'?pair(x,y+8):text(x,y+12,value,23));}
function request(t,small,v){
 const W=small?440:760, A=[small?55:75,270],S=[small?175:285,270],C=[small?350:620,145],D=[small?350:620,390],failed=v==='rejected';
 let s=text(W/2,35,'The answer survives a failed fill',small?24:28);
 s+=route(A,S)+route(S,C)+route(S,D)+app(...A)+server(...S)+cache(...C,t>=.75&&!failed?'pair':'')+database(...D,'pair');
 s+=move(t,.02,.12,A,S,'--coral')+move(t,.14,.24,S,C,'--coral')+move(t,.25,.33,C,S,'--coral')+move(t,.34,.45,S,D,'--coral')+move(t,.47,.60,D,S,'--blue')+move(t,.62,.74,S,C,'--blue')+move(t,.81,.93,S,A,'--coral');
 if(t>=.60)s+=pair(S[0],S[1]-52);
 if(t>=.75&&failed)s+=route([C[0]-12,C[1]-12],[C[0]+12,C[1]+12],'--coral')+route([C[0]+12,C[1]-12],[C[0]-12,C[1]+12],'--coral');
 if(t>=.93)s+=pair(A[0],A[1]);
 const label=t<.14?'A request arrives':t<.34?'No saved answer':t<.60?'Read the source':t<.81?'Try to save a copy':failed?'Answered · cache still empty':'Answered · copy saved';
 s+=text(W/2,490,label,small?23:27);
 return svg(s,W,530,small);
}
export function deadlineState(variant){return variant==='late'?{sourceEnd:197,fill:0,returnAt:198}:{sourceEnd:135,fill:20,returnAt:160};}
function deadline(t,small,v){
 const W=small?440:760,L=35,R=W-35,width=R-L,x=ms=>L+width*ms/200,{sourceEnd,fill,returnAt}=deadlineState(v),now=Math.min(200,t*230),p=clamp(now/200);let s=text(W/2,35,'One request, one deadline',27);
 s+=route([L,105],[R,105])+text(L,83,'0 ms',18,'--color-text-secondary','start')+text(R,83,'200 ms',18,'--color-text-secondary','end');
 s+=`<path d="M${R} 100V435" stroke="var(--coral)" stroke-width="1.5" stroke-dasharray="5 5"/>`;
 const rows=[['Cache lookup',0,25,'--teal'],['Source read',25,sourceEnd,'--blue'],['Optional fill',sourceEnd,sourceEnd+fill,'--gold']];
 rows.forEach(([label,a,b,c],i)=>{const y=155+i*90;s+=text(L,y-14,label,21,'--color-text','start')+route([L,y+12],[R,y+12],'--color-rule-strong');const end=Math.min(b,Math.max(a,now));if(b>a)s+=`<rect x="${x(a)}" y="${y+1}" width="${x(end)-x(a)}" height="22" rx="7" fill="var(${c})"/>`;if(i===2&&fill===0&&now>=sourceEnd)s+=text(L+5,y+39,'Skipped: preserve the answer',small?21:25,'--color-text','start');});
 if(now<returnAt)s+=ball(x(Math.min(now,returnAt)),105,'--coral');
 s+=text(W/2,459,now>=returnAt?`Answer returned at ${returnAt} ms`:'The remaining time keeps shrinking',small?22:26);
 return svg(s,W,495,small);
}
export const latencyRows=[{label:'Slow command',parts:[2,4,22,2]},{label:'Waiting client',parts:[24,3,1,2]}];
function latency(t,small){
 const W=small?440:760,L=28,R=W-28,width=R-L,cs=['--purple','--blue','--coral','--teal'];let s=text(W/2,33,'The same 30 ms wait',28);
 latencyRows.forEach(({label,parts},i)=>{const y=100+i*220,progress=ease(part(t,i*.18,.7+i*.18));s+=text(W/2,y,label,25);let offset=0;parts.forEach((n,j)=>{const x=L+offset*width/30;s+=`<rect x="${x}" y="${y+33}" width="${n*width/30*progress}" height="30" rx="4" fill="var(${cs[j]})"/>`;offset+=n;});
 s+=text(W/2,y+110,`Command execution: ${parts[2]} ms`,small?23:27);
 if(i===0)s+=route([L,y+155],[R,y+155],'--color-rule-strong');});
 ['Client wait','Communication','Execution','Decode'].forEach((label,i)=>{const x=small?(i%2)*210+28:i*180+25,y=small?510+Math.floor(i/2)*40:530;s+=ball(x+7,y-5,cs[i],7)+text(x+23,y,label,small?18:18,'--color-text','start');});
 return svg(s,W,small?585:565,small);
}
function failover(t,small){
 const W=small?440:760,x=[W*.16,W*.5,W*.84],y=170,B=400,updated=t>=.18,deleted=t>=.4,failed=t>=.55,promoted=t>=.7,read=t>=.98;let s=text(W/2,35,'A deleted answer can return',small?25:28);
 s+=route([x[1],B],[x[0],y])+route([x[1],B],[x[1],y])+route([x[1],B],[x[2],y])+route([x[0],B],[x[1],B]);
 s+=route([x[1]+39,y],[x[2]-39,y],'--color-text-secondary','stroke-dasharray="4 5"');
 s+=database(x[0],y,updated?'£22':'£20','Source')+cache(x[1],y,failed?'×':deleted?'—':'£20',failed?'Failed':'Primary',failed?'--coral':'--teal')+cache(x[2],y,'£20',promoted?'Promoted':'Replica');
 s+=app(x[0],B)+server(x[1],B);
 const source=[x[0],y],primary=[x[1],y],replica=[x[2],y],S=[x[1],B],A=[x[0],B];
 s+=move(t,.01,.08,A,S,'--gold')+move(t,.08,.18,S,source,'--gold')+move(t,.2,.28,source,S,'--gold')+move(t,.3,.4,S,primary,'--coral');
 s+=move(t,.72,.77,A,S,'--purple')+move(t,.78,.84,S,replica,'--purple')+move(t,.85,.91,replica,S,'--purple')+move(t,.92,.98,S,A,'--purple');
 if(deleted)s+=text(W/2,75,'Deletion did not reach the replica',small?19:23);
 if(read)s+=text(x[0],B-55,'£20',26);
 const label=t<.18?'Update the source':t<.4?'Committed · delete the cached copy':t<.55?'Primary acknowledges the deletion':t<.7?'Primary fails before replication':t<.98?'The replica takes over':'Source £22 · returned £20';
 s+=text(W/2,520,label,small?21:26);
 return svg(s,W,560,small);
}
export function rolloutState(fraction){return {newMisses:100*fraction,oldMisses:100*(1-fraction)*.1,total:100*fraction+100*(1-fraction)*.1};}
function rollout(t,small){
 const W=small?440:760,L=30,R=W-30,width=R-L,x=n=>L+n/60*width;let s=text(W/2,35,'A cold format adds source work',small?24:28);
 [.1,.5].forEach((fraction,i)=>{const y=105+i*245,{newMisses,oldMisses,total}=rolloutState(fraction),p=ease(part(t,i*.18,.7+i*.18));s+=text(W/2,y,`${fraction*100}% of requests use v2`,25);
 s+=route([L,y+65],[R,y+65],'--color-rule-strong');
 s+=`<rect x="${L}" y="${y+45}" width="${oldMisses/60*width*p}" height="40" rx="6" fill="var(--blue)"/><rect x="${x(oldMisses*p)}" y="${y+45}" width="${newMisses/60*width*p}" height="40" rx="6" fill="var(--coral)"/>`;
 s+=route([x(30),y+24],[x(30),y+100],'--color-text','stroke-dasharray="4 4"')+text(x(30),y+127,'Limit: 30',19,'--color-text-secondary');
 if(p<1)s+=ball(x(total*p),y+65,i?'--coral':'--blue',10);
 s+=text(W/2,y+174,`${total} source reads needed`,small?25:28);
 if(i===0)s+=route([L,y+208],[R,y+208],'--color-rule-strong');});
 s+=ball(W*.25-55,591,'--blue',8)+text(W*.25+10,598,'v1 misses',20)+ball(W*.73-80,591,'--coral',8)+text(W*.73+10,598,'Cold v2 misses',20);
 return svg(s,W,625,small);
}
const scene=(title,duration,render,alt,caption,extra={})=>({title,duration,render:(t,v)=>render(clamp(t),false,v)+render(clamp(t),true,v),alt,caption,...extra});
export const scenes={
 request:scene('An optional cache fill',12500,request,'The app asks the server for a product. The server checks an empty cache, reads the database, tries to save a copy and returns the answer. Rejecting the fill leaves the cache empty but does not discard the source answer.','The server owns the source read and optional fill. The coloured request returns successfully in either case; a rejected fill leaves no reusable copy.',{defaultVariant:'saved',actions:[{value:'saved',label:'Save the copy'},{value:'rejected',label:'Reject the fill'}],altFor:v=>v==='rejected'?'The cache rejects the fill. The server still returns its successful source answer to the app; the cache remains empty.':'After a cache miss, the server reads the source, saves a copy and returns the source answer to the app.'}),
 deadline:scene('Spending the remaining deadline',10000,deadline,'A request has a 200 millisecond deadline. In the ordinary illustration, lookup takes 25 milliseconds, source work finishes at 135, a fill takes 20 and the answer returns at 160. If source work finishes at 197, the fill is skipped and the answer returns at 198.','Invented executions within the adapter’s limits. A fill receives at most 20 ms and must leave 5 ms for the response. The source itself may consume that reserve; cancellation and return timing remain cooperative.',{defaultVariant:'room',actions:[{value:'room',label:'Time for a fill'},{value:'late',label:'Source finishes late'}],altFor:v=>v==='late'?'Source work ends at 197 ms of a 200 ms deadline. With less than the 5 ms response reserve left, the adapter skips the optional fill. This illustrative answer returns at 198 ms.':'Lookup ends at 25 ms, source work at 135, the fill at 155 and the answer returns at 160, within the 200 ms deadline.'}),
 latency:scene('Where a lookup waits',7000,latency,'Two illustrative lookups each take 30 milliseconds. The slow-command case spends 2 waiting in the client, 4 communicating, 22 executing and 2 decoding. The waiting-client case spends 24, 3, 1 and 2 milliseconds respectively.','Each bar accounts for one complete lookup. Communication combines outward and return travel; these bands are not a chronological trace. Redis’s slow log measures command execution, not the whole bar.'),
 failover:scene('Losing an acknowledged deletion',15500,failover,'The source price changes from £20 to £22. The primary cache acknowledges deletion, then fails before that deletion reaches its replica. The promoted replica still holds £20 and returns it on a later request.','An illustrative failure order under asynchronous replication. A request requiring revision 2 must reject the recovered revision 1 value. Promotion does not establish freshness.'),
 rollout:scene('The cost of a cold namespace',7500,rollout,'For 100 requests, moving 10 percent to cold v2 creates 10 new-format misses plus 9 old-format misses: 19 source reads. Moving 50 percent creates 50 plus 5: 55, exceeding a limit of 30 starts.','Two alternative traffic splits over the same 100-request interval. v1 hits 90%; every v2 request here misses. The bars show demand before admission, not permission to exceed the source limit.')
};
