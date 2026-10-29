import { makeScene, svg, text, line, path, travel, app, server, database, ring, ball, phase, ease, note } from '../drawing.mjs';
const cross=(x,y)=>line(`M${x-8} ${y-8}l16 16M${x+8} ${y-8}l-16 16`,'--coral');
const words=(x,y,s)=>text(x,y,s,23);
function preparation(t,small,v='english'){
 const w=small?440:760,x=[w*.18,w*.5,w*.82],eng=v==='english';let s=text(w/2,40,'The blue mugs',30);
 ['The','blue','mugs'].forEach((word,i)=>{s+=words(x[i],120,word)+text(x[i],154,String(i+1),18,'--color-text-secondary');if(!(eng&&i===0))s+=path([x[i],170],[x[i],290])+travel(t,.1+i*.05,.5+i*.05,[x[i],170],[x[i],290],['--purple','--blue','--gold'][i]);if(t>=.61)s+=words(x[i],315,eng?['omitted','blue','mug'][i]:['the','blue','mugs'][i]);});
 if(t>=.68)s+=text(w/2,405,eng?'Request “mug” matches':'Request “mug” does not match',small?22:27);
 s+=note(w/2,470,[eng?'Position 1 stays a gap':'Simple keeps the word forms'],small);
 return svg(s,small,510);
}
function candidates(t,small,v='and'){
 const w=small?440:760,left=40,right=w-45,phrase=v==='phrase',rows=[['The','blue','mugs'],['Blue','ceramic','mugs'],['Mugs','in','blue']];let s=text(w/2,38,phrase?'“blue mugs” as a phrase':'blue and mugs anywhere',25);
 rows.forEach((row,i)=>{const y=130+i*130;s+=text(24,y-35,String.fromCharCode(65+i),19,'--color-text-secondary','start');row.forEach((word,j)=>{const x=left+35+j*(w-140)/3,c=/blue/i.test(word)?'--blue':/mug/i.test(word)?'--gold':'--color-rule-strong';s+=ball(x,y,c)+text(x,y+43,word,small?19:23);if(t>.15&&t<.55&&c!=='--color-rule-strong')s+=travel(t,.16+i*.04,.48+i*.04,[x,y],[right,y],c);});if(t>.7)s+=text(right,y+7,phrase&&i?'×':'✓',27);});
 s+=text(w/2,555,t>.7?(phrase?'3 candidates · 1 phrase match':'3 candidates · 3 matches'):'GIN keys do not carry word positions',small?21:25);
 return svg(s,small,600);
}
function selection(t,small,v='correct',vector=false){
 const w=small?440:760,early=v==='early'||v==='global',names=vector?['Mug','Teapot','Tea']:['Mug','Tea','Teapot'],values=vector?['0','0.632','1.414']:['1.2','1.1','0.2'],xs=[65,w*.5,w-65],ys=[120,250,380],first=early?'Top 2':'In stock',second=early?'In stock':'Top 2';let s=text(xs[0],43,vector?'Distance':'Score',21)+text(xs[1],43,first,23)+text(xs[2],43,second,23);
 s+=line(`M${xs[1]} 72V430`,'--color-text-secondary')+line(`M${xs[2]} 72V430`,'--color-text-secondary');
 names.forEach((name,i)=>{const c=['--blue','--gold','--purple'][i],passFirst=early?i<2:i!==0,passLast=i!==0&&(!early||i<2);s+=text(xs[0],ys[i]-27,name,22)+text(xs[0],ys[i]+42,values[i],20)+path([xs[0],ys[i]],[xs[2],ys[i]],0,'--color-rule-strong');s+=travel(t,.03+i*.04,.32+i*.04,[xs[0],ys[i]],[xs[1],ys[i]],c);if(passFirst)s+=travel(t,.48+i*.04,.78+i*.04,[xs[1],ys[i]],[xs[2],ys[i]],c);else if(t>=.43)s+=cross(xs[1],ys[i]);if(t>.88){if(passLast)s+=ball(xs[2],ys[i],c);else if(passFirst)s+=cross(xs[2],ys[i]);}});
 s+=text(w/2,500,t>.88?(early?`Only ${names[1].toLowerCase()} remains`:`${names[1]} and ${names[2].toLowerCase()} returned`):'The order of these decisions changes the answer',small?20:24);
 return svg(s,small,545);
}
function configuration(t,small){
 const w=small?440:760,x=[w*.23,w*.77],y=[105,300],newRules=t>=.2,regenerated=t>=.8;let s=text(w/2,35,'Source: Blue mugs',27);
 s+=ring(x[0],y[0],'Fresh preparation',newRules?'mugs':'mug','--gold',42)+ring(x[1],y[0],'Stored vector',regenerated?'mugs':'mug','--blue',42)+ring(x[1],y[1],'GIN key',regenerated?'mugs':'mug','--teal',42);
 s+=path([x[1],y[0]],[x[1],y[1]])+travel(t,.42,.58,[x[1],y[0]],[x[1],y[1]],'--blue')+travel(t,.65,.8,[x[0],y[0]],[x[1],y[0]],'--gold')+travel(t,.81,.92,[x[1],y[0]],[x[1],y[1]],'--gold');
 s+=note(w/2,440,t<.2?['Stored meaning and fresh queries agree']:t<.42?['New preparation differs from stored data']:t<.65?['REINDEX copies the old meaning again']:['Regenerate the vector from its source'],small);
 return svg(s,small,495);
}
function hnsw(t,small,v='narrow'){
 const w=small?440:760,x=i=>38+i*(w-76)/4,top=90,y=290,wide=v==='wide';let s=text(w/2,35,'Upper layer',24)+path([x(0),top],[x(2),top])+path([x(2),top],[x(2),y],0,'--color-rule-strong','stroke-dasharray="4 6"')+text(w/2,205,'Ground layer',24);
 s+=ring(x(0),top,'','A','--blue',23)+ring(x(2),top,'','C','--blue',23);
 for(let i=0;i<5;i++){if(i<4)s+=path([x(i),y],[x(i+1),y]);s+=ring(x(i),y,'','ABCDE'[i],t>=.85&&(wide?i===4:i===2)?'--teal':'--color-text-secondary',24)+text(x(i),y+65,String([9,5,2,3,.5][i]),22);}
 s+=travel(t,.03,.22,[x(0),top],[x(2),top],'--gold')+travel(t,.23,.4,[x(2),top],[x(2),y],'--gold');
 if(wide)s+=travel(t,.5,.67,[x(2),y],[x(3),y],'--gold')+travel(t,.68,.85,[x(3),y],[x(4),y],'--gold');
 else if(t>=.55)s+=cross((x(2)+x(3))/2,y);
 s+=note(w/2,435,t<.4?['Find an entry into the ground layer']:wide?['Explore the worse neighbour D','It leads to the closer E']:['Keep only C; discard the route through D','The closer E stays undiscovered'],small);
 return svg(s,small,515);
}
function ivf(t,small,v='1'){
 const w=small?440:760,L=55,R=w-55,x=n=>L+(R-L)*n/8,query=x(1.9),y=180,two=v==='2';let s=line(`M${L} ${y}H${R}`)+line(`M${x(2)} 95V240`,'--color-text-secondary','stroke-dasharray="4 6"');
 s+=text(w/2,35,'Query 1.9 · boundary at 2',25);
 [0,4,8].forEach((c,i)=>{s+=text(x(c),y+55,String(c),20)+ring(x(c),330,'Centre '+c,'',t>.5&&(i===0||two&&i===1)?'--teal':'--color-rule-strong',27);});
 s+=ball(x(.4),y,'--blue')+text(x(.4),y-25,'A',21)+ball(x(2.1),y,'--gold')+text(x(2.1)+15,y-25,'B',21)+line(`M${query} 75V${y-15}`,'--purple');
 s+=travel(t,.08,.35,[query,75],[x(0),330],'--purple');if(two)s+=travel(t,.39,.62,[query,75],[x(4),330],'--purple');
 s+=note(w/2,430,t>.7?[two?'B · distance 0.2':'A · distance 1.5',two?'Another list finds the closer point':'The closest point is across the boundary']:['Choose lists, then compare their points'],small);
 return svg(s,small,510);
}
function range(t,small,v='7002'){
 const w=small?440:760,L=35,R=w-35,x=h=>L+(R-L)*(h-10)/2,adj=v==='7003',start=adj?11:10.5,stop=adj?12:11.5,p=ease(phase(t,.1,.65));let s='';
 [10,10.5,11,11.5,12].forEach(h=>{s+=line(`M${x(h)} 85V320`,'--color-rule-strong')+text(x(h),55,`${Math.floor(h)}:${h%1?'30':'00'}`,small?17:21);});
 s+=text(w/2,115,'Existing reservation',22)+line(`M${x(10)} 155H${x(11)}`,'--blue','stroke-width="5"')+ball(x(10),155,'--blue')+`<circle cx="${x(11)}" cy="155" r="10" fill="var(--color-surface)" stroke="var(--blue)" stroke-width="2"/>`;
 s+=text(w/2,245,'New attempt',22)+line(`M${x(start)} 285H${x(start+(stop-start)*p)}`,'--gold','stroke-width="5"')+ball(x(start),285,'--gold')+`<circle cx="${x(start+(stop-start)*p)}" cy="285" r="10" fill="var(--color-surface)" stroke="var(--gold)" stroke-width="2"/>`;
 if(t>.7&&!adj)s+=`<rect x="${x(10.5)}" y="135" width="${x(11)-x(10.5)}" height="170" fill="var(--coral)" opacity=".14"/>`;
 s+=note(w/2,395,t<.7?['Compare the same room’s time ranges']:adj?['11:00 belongs only to the new attempt','Adjoining, not overlapping · permitted']:['Shared time: 10:30 up to 11:00','Same room and overlap · refused'],small);
 return svg(s,small,480);
}
function spatial(t,small){
 const w=small?440:760,c=[w/2-25,235],scale=small?24:31,r=5*scale;let s=line(`M${c[0]-r-20} ${c[1]}H${c[0]+r+45}M${c[0]} ${c[1]+r+15}V${c[1]-r-20}`,'--color-rule-strong');
 s+=`<rect x="${c[0]-r}" y="${c[1]-r}" width="${2*r}" height="${2*r}" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.6"/>`;
 if(t>.35)s+=`<circle cx="${c[0]}" cy="${c[1]}" r="${r*ease(phase(t,.35,.65))}" fill="none" stroke="var(--teal)" stroke-width="2"/>`;
 [[3,4,'A','--blue'],[4,4,'B','--gold'],[6,0,'C','--purple']].forEach(([x,y,n,col])=>{const p=[c[0]+x*scale,c[1]-y*scale];s+=ball(...p,col)+text(p[0]+(n==='B'?14:n==='A'?-14:0),p[1]-25,n,22);if(t>.75&&n!=='A')s+=cross(...p);});
 s+=ball(...c,'--teal');if(t>.65)s+=path(c,[c[0]+3*scale,c[1]-4*scale],0,'--teal');
 s+=note(w/2,465,t<.35?['The square excludes C']:t<.75?['Now test the actual distance']:['A is exactly 5 units away','B passed the box, but not the circle'],small);
 return svg(s,small,545);
}
function extension(t,small,v='ready'){
 const w=small?440:760,S=[w*.22,110],F=[w*.78,110],D=[w*.5,350],ready=v==='ready';let s=path(S,D)+path(F,D)+database(...S,'Logical dump')+server(...F,'Server software')+database(...D,'Target',t>.8&&ready?'ready':'');
 s+=travel(t,.08,.45,S,D,'--blue');if(ready)s+=travel(t,.24,.58,F,D,'--gold');else if(t>.4)s+=cross((F[0]+D[0])/2,(F[1]+D[1])/2);
 s+=note(w/2,470,t<.45?['Definitions and software take separate routes']:ready?['Create extension, then restore its dependants','Check the service under the caller’s authority']:['The dump cannot supply missing software','Extension creation stops here'],small);
 return svg(s,small,550);
}
export const scenes={
 preparation:makeScene('Words become searchable lexemes',9500,preparation,'English preparation removes The, keeps blue at position 2 and stems mugs to mug at 3. The singular mug request matches. Simple preparation retains the, blue and mugs; mug does not match.','The English stop word leaves a position gap; this models checked SQL results.',{defaultVariant:'english',actions:[{value:'english',label:'English'},{value:'simple',label:'Simple'}]}),
 candidates:makeScene('The keys agree. The positions differ.',10000,candidates,'All three diagnostic documents have blue and mug. The exact key intersection retains all three. Phrase rechecking keeps only A, with blue at position 2 immediately followed by mug at 3. B has a gap; C has reversed order.','GIN keys contain neither positions nor field weights. These are separate diagnostic snippets.',{defaultVariant:'and',actions:[{value:'and',label:'Words anywhere'},{value:'phrase',label:'Exact phrase'}]}),
 ranking:makeScene('Choose two products which can be bought',11000,(t,s,v)=>selection(t,s,v,false),'The blue mug scores 1.2 but has no stock. Green tea scores 1.1 and the teapot 0.2. Filtering stock before choosing two returns tea and teapot. Limiting first keeps mug and tea, then stock removes mug and loses the eligible teapot.','Checked ts_rank_cd scores. This is logical selection order, not an executor trace.',{defaultVariant:'correct',actions:[{value:'correct',label:'Filter, then limit'},{value:'early',label:'Limit, then filter'}]}),
 configuration:makeScene('REINDEX cannot repair a stale meaning',11000,configuration,'A configuration change makes fresh preparation produce mugs while the stored vector still says mug. REINDEX copies that stored meaning again. Regenerating the vector from source updates the index to mugs and restores agreement.','An isolated checked configuration change, not a live migration procedure.'),
 filter:makeScene('Nearest among eligible products',11000,(t,s,v)=>selection(t,s,v,true),'The mug is nearest at distance zero but has no stock. The teapot at 0.632 and tea at 1.414 are eligible. Filtering first returns both. Choosing the global nearest two first discards tea, then stock removes the mug and only teapot remains.','Exact logical selection with the article’s invented vectors and unchanged post-purchase stock.',{defaultVariant:'eligible',actions:[{value:'eligible',label:'Filter, then choose two'},{value:'global',label:'Choose two, then filter'}]}),
 hnsw:makeScene('A worse neighbour can lead somewhere better',11000,hnsw,'The upper layer reaches C at distance 2. Keeping only C discards D at distance 3 and misses E at 0.5. Keeping two candidates permits exploration through D to discover E.','A deliberately chosen graph, not a pgvector dump or a proof of exact retrieval. Numbers are query distances; positions are not geometric coordinates.',{defaultVariant:'narrow',actions:[{value:'narrow',label:'Keep one candidate'},{value:'wide',label:'Keep two candidates'}]}),
 ivf:makeScene('The nearest point is across the boundary',10000,ivf,'Query 1.9 lies nearer centre 0 than centre 4. Probing only the first list returns A at distance 1.5. B at 2.1 is only 0.2 away but belongs to centre 4’s list. Probing both lists finds B.','A chosen one-dimensional example with centres 0, 4 and 8; not an observed index build.',{defaultVariant:'1',actions:[{value:'1',label:'Probe one list'},{value:'2',label:'Probe two lists'}]}),
 range:makeScene('Touching is not overlapping',9000,range,'The existing room reservation includes 10:00 and excludes 11:00. The 10:30 attempt overlaps and is refused. The 11:00 attempt starts exactly at the excluded end, adjoins without overlap, and is permitted.','Independent attempts for the same room, using half-open ranges on 2 November 2026 UTC.',{defaultVariant:'7002',actions:[{value:'7002',label:'10:30–11:30'},{value:'7003',label:'11:00–12:00'}]}),
 spatial:makeScene('A square candidate is not a distance match',9000,spatial,'The square from −5 to 5 excludes C at (6,0). A at (3,4) and B at (4,4) remain candidates. The distance test keeps A at exactly 5 and rejects B at square root 32, about 5.66.','Mathematical planar coordinates, not a map or a PostGIS execution plan.'),
 extension:makeScene('A dump and software have separate routes',10500,extension,'The logical dump requests extension creation and carries application definitions, data and grants. Compatible control files, scripts and libraries must already be provisioned on the target server. Without them, copying the dump cannot complete extension creation.','Successful reconstruction still needs caller-access, operator and constraint checks.',{defaultVariant:'ready',actions:[{value:'ready',label:'Software provisioned'},{value:'missing',label:'Software missing'}]})
};
