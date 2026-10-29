import { makeScene, svg, text, line, path, travel, app, server, database, ring, ball, phase, ease, note } from '../drawing.mjs';

const colours=['--blue','--gold','--purple','--teal'];
const page=(x,y,label,value='',active=false)=>`<rect x="${x-48}" y="${y-28}" width="96" height="56" rx="8" fill="var(--color-surface)" stroke="var(${active?'--teal':'--color-text-secondary'})" stroke-width="1.6"/>`+text(x,y+7,value,21)+text(x,y+57,label,19);
const mark=(x,y,c='--teal')=>line(`M${x-7} ${y}l5 6 11-15`,c);
const sentence=(w,y,s,small)=>{const words=s.split(' '),lines=[''];for(const word of words){const i=lines.length-1;if(lines[i].length+word.length>(small?40:68))lines.push(word);else lines[i]+=(lines[i]?' ':'')+word;}return lines.map((value,i)=>text(w/2,y+i*27,value,small?20:24)).join('');};

function buffers(t,small){
 const w=small?440:760,c=[w/2,250],r=small?91:112,A=[small?60:85,65],B=[w-A[0],65],D=[w/2,470];
 const points=[[c[0]-r,c[1]-63],[c[0]+r,c[1]-63],[c[0]+r,c[1]+63],[c[0]-r,c[1]+63]];
 let s=path(A,points[0])+path(B,points[0],-40)+path(D,points[0],-80,'--color-rule-strong')+path(D,points[3]);
 s+=server(...A,'Backend A')+server(...B,'Backend B')+database(...D,'Page files');
 s+=text(w/2,38,'Shared buffers',26);
 const loaded=t>=.22,full=t>=.48,replaced=t>=.91;
 points.forEach((p,i)=>{s+=page(...p,`Slot ${i+1}`,i===0?(loaded?'page 12':'empty'):full?['','page 4','page 31',replaced?'page 11':'page 10'][i]:'empty',loaded&&i===0||replaced&&i===3);
   if(full&&i===1)s+=text(p[0],p[1]-44,'Pinned',18);
   if(full&&i===2)s+=text(p[0],p[1]-44,t>=.78?'use: 0':'use: 1',18);
 });
 if(t>=.56){const p=phase(t,.56,.84),angle=(-Math.PI/6)+Math.PI*ease(p),end=[c[0]+Math.cos(angle)*65,c[1]+Math.sin(angle)*65];s+=line(`M${c}L${end}`,'--gold')+ball(...end,'--gold');}
 s+=travel(t,.03,.10,A,points[0],'--coral')+travel(t,.12,.22,D,points[0],'--blue','',-80)+travel(t,.3,.4,B,points[0],'--gold','',-40)+travel(t,.85,.91,D,points[3],'--purple');
 s+=sentence(w,572,t<.22?'A miss brings in a page':t<.48?'A second backend reuses it':t<.7?'Pinned: keep this page':t<.84?'Used recently: give it another chance':'Unpinned, use 0: replace this page',small);
 return svg(s,small,610);
}
function versions(t,small){
 const w=small?440:760,L=w*.27,R=w*.73,y=235,A=[L,80],B=[R,80],old=[L,y],fresh=[R,y];
 let s=path(A,old)+path(B,fresh)+line(`M${L-55} ${y-50}H${R+55}V${y+76}H${L-55}Z`,'--color-rule-strong');
 s+=app(...A,'Report')+app(...B,'Later reader')+text(w/2,y-70,'The same heap page',24);
 s+=ring(...old,'Earlier tuple','£20','--blue',37)+ring(...fresh,'New tuple',t>=.28?'£22':'',t>=.28?'--gold':'--color-rule-strong',37);
 s+=travel(t,.05,.18,A,old,'--blue')+travel(t,.53,.67,old,A,'--blue')+travel(t,.72,.83,B,fresh,'--gold')+travel(t,.84,.96,fresh,B,'--gold');
 if(t>=.67)s+=text(A[0],A[1]-44,'£20',25);if(t>=.96)s+=text(B[0],B[1]-44,'£22',25);
 s+=sentence(w,367,t<.28?'The report keeps its snapshot':t<.46?'The writer creates £22':t<.7?'Writer committed · report still sees £20':'A new snapshot can see £22',small);
 return svg(s,small,410);
}
function lookup(t,small){
 const w=small?440:760,A=[small?70:80,100],I=[small?330:340,100],H=[small?330:650,small?310:100],R=[small?105:340,310];
 let s=path(A,I)+path(I,H,small?0:65)+path(H,R,small?0:45);
 s+=app(...A)+ring(...I,'B-tree leaf','P7','--gold')+page(...H,'Heap (12,3)','£20',t>=.54)+ring(...R,'Snapshot check',t>=.73?'✓':'','--teal');
 s+=travel(t,.03,.24,A,I,'--coral')+travel(t,.27,.52,I,H,'--gold','',small?0:65)+travel(t,.57,.72,H,R,'--blue','',small?0:45)+travel(t,.8,.96,R,A,'--blue');
 if(t>=.96)s+=text(A[0],A[1]-48,'£20',25);
 s+=sentence(w,420,t<.25?'Find the key':t<.54?'The index supplies a heap address':t<.79?'Check the tuple against the snapshot':'Return the visible price',small);
 return svg(s,small,455);
}
function hot(t,small,v='hot'){
 const w=small?440:760,hot=v==='hot',I=[hot?w/2:w*.27,90],J=[w*.73,90],L=[w*.27,270],R=[w*.73,270],changed=t>=.35,clean=t>=.87;
 let s=text(w/2,25,'Primary-key index',24)+path(I,L);
 if(hot)s+=path(L,R,0,'--teal');
 if(changed&&!hot)s+=path(J,R,0,'--gold');
 s+=ring(...I,hot?'Key entry':'Old entry','P7','--gold');
 if(!hot)s+=ring(...J,'New entry',changed?'P7':'',changed?'--gold':'--color-rule-strong');
 s+=page(...L,'Heap (12,3)',clean&&hot?'↪':'£20',false)+page(...R,v==='full'?'Heap (13,1)':'Heap (12,4)',changed?'£22':'space',changed);
 s+=sentence(w,370,hot?'One index entry · follow the tuple link':'New tuple · new index entry',small);
 s+=travel(t,.06,.29,I,L,'--gold')+travel(t,.35,.56,L,R,'--blue')+travel(t,.64,.82,hot?I:J,hot?L:R,'--coral');
 if(hot)s+=travel(t,.82,.94,L,R,'--coral');
 s+=sentence(w,425,clean&&hot?'After retention: old tuple → redirect':v==='full'?'The old page has no room':v==='indexed'?'An index references the changed price':'Same page · no ordinary indexed value changes',small);
 return svg(s,small,485);
}
function write(t,small){
 const w=small?440:760,A=[w*.18,85],M=[w*.72,85],W=[w*.18,305],D=[w*.72,305];
 let s=path(A,M)+path(M,W,50)+path(M,D)+path(W,A);
 s+=app(...A)+page(...M,'Shared page',t>=.9?'£22':t>=.1?'£20 / £22':'£20',true)+database(...W,'Durable WAL',t>=.48?'U + C':'')+database(...D,'Heap file',t>=.76?'£20 / £22':'£20');
 s+=travel(t,.02,.1,A,M,'--coral')+travel(t,.2,.48,M,W,'--gold','',50)+travel(t,.5,.6,W,A,'--teal')+travel(t,.64,.76,M,D,'--blue');
 if(t>=.6)s+=text(A[0],A[1]-48,'Committed',21);

 s+=sentence(w,430,t<.48?'The commit waits for durable WAL':t<.64?'Reply now; the data page can follow later':t<.9?'Write the changed page':'Later cleanup reclaims old tuple space',small);
 return svg(s,small,470);
}
function retention(t,small,v='none'){
 const w=small?440:760,A=[w*.25,85],B=[w*.75,85],L=[w*.25,275],R=[w*.75,275],clean=t>=.79&&v!=='other';
 let s=path(A,L)+path(B,R)+app(...A,t>=.57?'Report finished':'Report')+app(...B,'New reader');
 s+=text(w/2,195,'One heap page',24)+line(`M30 218H${w-30}V345H30Z`,'--color-rule-strong');
 s+=ring(...L,clean?'Reusable space':'Earlier tuple',clean?'':'£20',clean?'--color-rule-strong':'--blue')+ring(...R,'Current tuple',t>=.2?'£22':'','--gold');
 s+=travel(t,.05,.15,L,A,'--blue')+travel(t,.22,.35,R,B,'--gold');
 if(t>=.41&&t<.55){const x=30+(w-60)*phase(t,.41,.55);s+=line(`M${x} 218V345`,'--teal');}
 if(t>=.7&&t<.79){const x=30+(w-60)*phase(t,.7,.79);s+=line(`M${x} 218V345`,'--teal');}
 if(v==='other'&&t>=.57)s+=text(L[0],382,'Still retained',21);
 s+=sentence(w,430,t<.41?'Commit does not remove the old version':t<.57?'Vacuum must keep the report’s answer':t<.79?'The report releases its snapshot':clean?'Reclaim bytes inside the existing file':'Another snapshot still prevents cleanup',small);
 return svg(s,small,475);
}
function age(t,small){
 const w=small?440:760,L=42,R=w-42,frozen=t>=.64,age=t<.5?20+160*phase(t,.1,.5):t<.64?180:t<.77?0:20*phase(t,.77,.94),x=L+(R-L)*age/200;
 let s=ring(w/2,95,frozen?'Frozen live tuple':'Live tuple','£22',frozen?'--teal':'--blue',43)+text(w/2,210,'Transaction age of the frozen boundary',small?19:24);
 s+=line(`M${L} 270H${R}`)+line(`M${R} 250V290`,'--coral')+text(L,314,'0',18)+text(R,314,'200 million',20,'--color-text','end');
 s+=ball(x,270,frozen?'--teal':'--gold')+text(w/2,365,`${Math.round(age)} million transactions`,25);
 s+=sentence(w,435,t<.64?'Other transactions age the boundary':t<.77?'Vacuum freezes the eligible live tuple':'The boundary ages again; the tuple stays frozen',small);
 return svg(s,small,475);
}
function wal(t,small,v='on'){
 const w=small?440:760,L=small?145:210,R=w-55,y=[100,215,330],arrived=[t>=.21,t>=.53,t>=.77],done=v==='off'?t>=.3:t>=.77;
 let s='';['Inserted','Written','Flushed'].forEach((label,i)=>{s+=text(28,y[i]+7,label,small?19:23,'--color-text','start')+line(`M${L} ${y[i]}H${R}`);if(arrived[i])s+=ball(R-42,y[i],'--blue')+ball(R,y[i],'--gold');});
 s+=travel(t,.03,.21,[L,y[0]],[R,y[0]],'--gold')+travel(t,.33,.53,[R,y[0]],[R,y[1]],'--gold')+travel(t,.57,.77,[R,y[1]],[R,y[2]],'--gold');
 s+=text(w/2,405,done?'App: commit acknowledged':'App: waiting',24)+text(w/2,449,'The heap file may still hold £20',small?20:23);
 return svg(s,small,485);
}
function checkpoint(t,small){
 const w=small?440:760,L=40,R=w-40,x=p=>L+(R-L)*p,done=t>=.85;
 let s=text(w/2,45,'WAL keeps growing',25)+line(`M${L} 110H${R}`);
 for(let i=0;i<7;i++)if(t>=i*.1)s+=ball(x(i/7),110,i<2?'--blue':'--gold');
 s+=line(`M${x(.23)} 87V160`,'--teal')+text(x(.23),190,'R · starts',20)+line(`M${x(.83)} 87V160`,'--purple')+text(x(.83),190,'K · finishes',20);
 s+=page(x(.28),290,'Page A',t>=.47?'written':'dirty',t>=.47)+page(x(.72),290,'Page B',t>=.7?'written':'dirty',t>=.7);
 s+=travel(t,.28,.47,[x(.23),110],[x(.28),290],'--blue')+travel(t,.5,.7,[x(.5),110],[x(.72),290],'--gold');
 if(done)s+=line(`M${x(.83)} 390Q${w/2} 430 ${x(.23)} 390`,'--teal')+text(w/2,452,'Restart may now begin from R',small?22:27);
 else s+=text(w/2,452,'The previous redo point remains safe',small?21:25);
 return svg(s,small,490);
}
function gin(t,small,v='contains'){
 const w=small?440:760,x=[w*.2,w*.5,w*.8],y=250,equal=v==='equal';
 let s=ring(w*.3,80,'Search key','gift','--blue')+ring(w*.7,80,'Search key','ceramic','--gold');
 x.forEach((xx,i)=>{s+=path([w*.3,80],[xx,y])+path([w*.7,80],[xx,y])+ring(xx,y,['Original','Reversed','Extra'][i],t>=.78?(equal&&i?'×':'✓'):'','--teal',30);s+=travel(t,.1+i*.05,.4+i*.05,[w*.3,80],[xx,y],'--blue')+travel(t,.35+i*.05,.65+i*.05,[w*.7,80],[xx,y],'--gold');});
 x.forEach((xx,i)=>{const tags=i===0?['--blue','--gold']:i===1?['--gold','--blue']:['--blue','--gold','--purple'];tags.forEach((c,j)=>s+=`<circle cx="${xx+(j-(tags.length-1)/2)*22}" cy="335" r="8" fill="var(${c})"/>`);});
 s+=text(w/2,390,t<.7?'All three rows have both keys':equal?'Equality rechecks order and extra elements':'Containment accepts all three',small?20:25);
 s+=text(w/2,437,t>=.78?(equal?'1 match':'3 matches'):'3 candidate locations',24);
 return svg(s,small,480);
}
function brin(t,small,v='sorted-2'){
 const w=small?440:760,mixed=v.startsWith('mixed'),size=Number(v.slice(-1)),pages=Array.from({length:8},(_,i)=>mixed?[i+1,i+9]:[i*2+1,i*2+2]),kept=[];
 for(let i=0;i<8;i+=size){const values=pages.slice(i,i+size).flat();if(Math.min(...values)<9&&Math.max(...values)>=8)for(let k=0;k<size;k++)kept.push(i+k);}
 let s=text(w/2,35,'Find day 8',26);
 pages.forEach((days,i)=>{const cols=small?4:8,xx=35+(i%cols)*(w-70)/(cols-1),yy=small?125+Math.floor(i/cols)*145:145,active=t>.34&&kept.includes(i);s+=`<rect x="${xx-24}" y="${yy-34}" width="48" height="76" rx="8" fill="var(--color-surface)" stroke="var(${t>.34&&!active?'--color-rule-strong':'--color-text-secondary'})" stroke-width="1.6"/>`;days.forEach((d,j)=>s+=text(xx,yy-5+j*29,String(d),20,t>.75&&d===8?'--color-accent':'--color-text-secondary'));s+=text(xx,yy+73,`${i}`,17);if(active)s+=line(`M${xx-24} ${yy-34}h48v76h-48Z`,'--teal');if(active)s+=travel(t,.44+i*.02,.62+i*.02,[w/2,50],[xx,yy],'--gold');});
 const y=small?405:300;s+=text(w/2,y,t>.75?`${kept.length} pages · ${kept.length*2} tests · 1 match`:'Summaries exclude impossible ranges',small?20:24)+text(w/2,y+47,mixed?'Mixed time leaves every page possible':'Nearby times keep summaries narrow',small?19:23);
 return svg(s,small,y+85);
}
export const scenes={
 buffers:makeScene('One page serves two backends',16000,buffers,'A page read fills shared buffer slot 1. Backend B reuses it. Other pages fill the four slots. The clock skips pinned slot 2, reduces slot 3’s usage count, then replaces unpinned slot 4 at usage zero.','Invented slots and page addresses; a buffer read may be served by the operating-system cache.'),
 versions:makeScene('Two snapshots, one shared page',12000,versions,'The report establishes an earlier snapshot. A writer creates and commits a £22 tuple beside the £20 tuple. The report still reads £20; a later snapshot reads £22.','Ordinary reads in the independent price-update example. The report has already established its Repeatable Read snapshot.'),
 lookup:makeScene('A key leads to a visible tuple',10000,lookup,'The app asks for P7. The B-tree leaf supplies heap address (12,3), not the price. The reader checks that tuple against its snapshot and returns £20.','An illustrative index route, not the plan a tiny products table must use.'),
 hot:makeScene('An update can keep its index entry',12000,hot,'With same-page room and no ordinary index referencing the changed price, the old index entry follows a HOT link to the new £22 tuple. After retention ends, cleanup can leave a redirect. A price index or full page instead requires new ordinary index entries.','Three independent physical layouts for the same price change. Addresses and cleanup timing are illustrative.',{defaultVariant:'hot',actions:[{value:'hot',label:'Room on page'},{value:'indexed',label:'Price indexed'},{value:'full',label:'Page full'}]}),
 write:makeScene('Commit first. Page writing later.',12500,write,'The backend changes a shared page and generates WAL. Durable WAL permits commit acknowledgement. The heap file is written later. Later cleanup reclaims old tuple space and dirties the page again.','Normal local durable commit settings and reliable storage; one possible schedule.'),
 retention:makeScene('Keep the version a reader still needs',12500,retention,'A report retains its £20 snapshot while a new reader sees committed £22. Vacuum keeps the old tuple. After the report ends, a later vacuum reclaims it only if no other retention requirement remains.','A price index makes this a non-HOT update. Cleanup also removes the obsolete index entry; the heap file does not shrink.',{defaultVariant:'none',actions:[{value:'none',label:'Only this report'},{value:'other',label:'Another snapshot remains'}]}),
 age:makeScene('The price stays still. Its boundary ages.',10000,age,'Other transactions age the table’s frozen boundary from 20 to 180 million transactions. Vacuum freezes eligible live tuples and advances the boundary. It later ages by another 20 million, while the frozen tuple remains safe.','Invented transaction counts. The 200-million marker is a maintenance trigger, not the wraparound limit.'),
 wal:makeScene('Inserted, written, then flushed',11000,wal,'Update and commit records enter WAL buffers, are written to the WAL file, then flushed to durable storage. With synchronous_commit on, acknowledgement waits for flush. With off it may leave before the flush, risking loss after a crash.','The blue and gold records stand for update and commit. This illustration has no synchronous standby.',{defaultVariant:'on',actions:[{value:'on',label:'Wait for flush'},{value:'off',label:'Acknowledge early'}]}),
 checkpoint:makeScene('Completion makes an earlier point safe',11000,checkpoint,'A checkpoint begins at redo point R. Writes continue while required dirty pages reach storage. Only completion at K makes the earlier R safe for restart. K is not the new redo point.','Symbolic WAL positions and two illustrative pages; later changes can still require replay.'),
 gin:makeScene('Shared keys do not prove array equality',9500,gin,'Gift and ceramic each lead to all three candidate arrays: original, reversed and extra. Containment accepts all three. Equality rechecks original arrays and accepts only the original order with no extra element.','Diagnostic arrays, not additional catalogue products. Exact bitmap, non-null one-dimensional arrays.',{defaultVariant:'contains',actions:[{value:'contains',label:'Contains both tags'},{value:'equal',label:'Equals the array'}]}),
 brin:makeScene('Exclude pages before testing rows',9500,brin,'Day 8 is one of sixteen timestamps on eight pages. In increasing order, two-page ranges select two pages and four tests; one-page ranges select one page and two tests. Mixed order leaves all eight pages and sixteen tests. Every case finds the same match.','Invented physical layouts. BRIN summaries select ranges; the heap supplies the exact matches.',{defaultVariant:'sorted-2',actions:[{value:'sorted-2',label:'Ordered · 2 pages'},{value:'sorted-1',label:'Ordered · 1 page'},{value:'mixed-2',label:'Mixed · 2 pages'},{value:'mixed-1',label:'Mixed · 1 page'}]})
};
