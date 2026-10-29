import { makeScene, svg, text, line, path, travel, app, server, database, ring, ball, phase, note } from '../drawing.mjs';

const ending=(w,y,a,b='',small=false)=>note(w/2,y,b?[a,b]:[a],small);
const cross=(x,y)=>line(`M${x-12} ${y-12}l24 24M${x+12} ${y-12}l-24 24`,'--coral');
function progress(t,small){
 const w=small?440:760,L=small?135:240,R=w-55,ys=[90,190,290,390];let s='';
 ['Received','Written','Durable','Replayed'].forEach((name,i)=>{s+=text(25,ys[i]+6,name,small?19:23,'--color-text','start')+line(`M${L} ${ys[i]}H${R}`);const done=t>=[.2,.38,.56,.9][i];if(done)s+=ball(R-35,ys[i],'--blue')+ball(R,ys[i],'--gold');if(i===3&&t>=.75&&!done)s+=ball(R-35,ys[i],'--blue');});
 for(let i=0;i<2;i++)s+=travel(t,.21+i*.18,.36+i*.18,[R,ys[i]],[R,ys[i+1]],'--gold');
 s+=travel(t,.6,.75,[R-35,ys[2]],[R-35,ys[3]],'--blue')+travel(t,.77,.9,[R,ys[2]],[R,ys[3]],'--gold');
 s+=travel(t,.03,.19,[L,ys[0]],[R,ys[0]],'--gold');
 s+=text(w/2,480,`New read: ${t>=.9?'£22':'£20'}`,27)+ending(w,525,t<.56?'Received is not yet durable':t<.9?'Durable does not mean visible':'Commit replay makes the price visible','',small);
 return svg(s,small,565);
}
function routing(t,small,v='catchup'){
 const w=small?440:760,A=[w*.18,240],R=[w*.73,100],P=[w*.73,375],caught=v==='catchup'&&t>=.49,failed=v==='unavailable',reply=t>=.91&&!failed;
 let s=path(A,R,-30)+path(A,P,30)+app(...A)+database(...R,'Replica A',caught?'£22':'£20')+database(...P,'Primary',failed?'×':'£22');
 s+=text(w/2,32,'This read requires history C',small?22:26)+travel(t,.04,.23,A,R,'--purple');
 if(t>.24&&t<.49)s+=ball(R[0]-60,R[1]-Math.abs(Math.sin(t*80))*6,'--purple');
 if(caught)s+=travel(t,.6,.91,R,A,'--purple');
 if(v==='fallback')s+=travel(t,.52,.7,A,P,'--purple')+travel(t,.72,.91,P,A,'--purple');
 if(reply)s+=text(A[0],A[1]-48,'£22',26);
 if(failed&&t>=.6)s+=cross(A[0],A[1]);
 s+=ending(w,500,t<.49?'Wait for the chosen replica':v==='catchup'?'Qualify A, then take a fresh snapshot':v==='fallback'?'Qualify the primary before reading there':'No qualifying copy · return unavailable','',small);
 return svg(s,small,540);
}
function switching(t,small,v='forget'){
 const w=small?440:760,A=[w*.18,230],R=[w*.75,95],B=[w*.75,360],retained=v==='retain';
 let s=path(A,R)+path(A,B)+app(...A,'Reader')+database(...R,'Replica A','£22')+database(...B,'Replica B','£20');
 s+=travel(t,.03,.2,A,R,'--blue')+travel(t,.22,.4,R,A,'--blue');
 if(t>=.4)s+=text(A[0],A[1]-75,'Read 1: £22',small?18:22);
 if(!retained)s+=travel(t,.5,.69,A,B,'--gold')+travel(t,.71,.9,B,A,'--gold');
 else if(t>=.5)s+=cross((A[0]+B[0])/2,(A[1]+B[1])/2);
 if(t>=.91)s+=text(A[0],A[1]-45,retained?'Keep C':'Read 2: £20',small?18:22);
 s+=ending(w,485,retained?'B cannot answer this next read yet':'The reader went backwards',retained?'Use A, wait for B, or decline':'Neither replica moved backwards',small);
 return svg(s,small,555);
}
function chain(t,small,v='complete'){
 const w=small?440:760,gap=v==='gap'||v==='missing',points=small?[[80,90],[330,90],[330,285],[80,285]]:[[85,170],[285,170],[475,170],[675,170]],labels=['Base + WAL','History A','History B','History C'];
 let s='';points.forEach((p,i)=>{if(i)s+=path(points[i-1],p,0,gap&&i===2?'--color-rule-strong':'--color-text-secondary',gap&&i===2?'stroke-dasharray="4 6"':'');s+=i?ring(...p,labels[i],gap&&i===2?'×':gap&&i===3?'':t>=i*.22?'✓':'',gap&&i===2?'--coral':gap&&i===3?'--color-rule-strong':'--teal',32):database(...p,labels[i],'✓');});
 for(let i=1;i<4;i++)if(!gap||i===1)s+=travel(t,.02+(i-1)*.25,.2+(i-1)*.25,points[i-1],points[i],'--blue');
 s+=ending(w,small?440:340,gap?'Replay stops at the missing interval':'A continuous path reaches the target',gap?'Later files cannot bridge the gap':'The base alone is not the whole path',small);
 return svg(s,small,small?515:420);
}
function pgchain(t,small,v='complete'){
 const w=small?440:760,gap=v==='missing',A=[w*.2,125],B=[w*.8,125],x=[w*.8,w*.5,w*.2],y=365,arrivals=[.42,.61,.8];
 let s=text(w/2,42,'Bundled consistency WAL',small?22:25)+path(A,B)+database(...A,'Base files','')+database(...B,'Consistent base',t>=.22?'✓':'');
 s+=travel(t,.03,.22,A,B,'--gold')+text(w*.35,235,'pg_verifybackup',small?21:23);
 s+=path([B[0],B[1]+100],[x[0],y-32],0,'--color-rule-strong')+travel(t,.27,.42,[B[0],B[1]+100],[x[0],y],'--blue');
 x.forEach((xx,i)=>{if(i)s+=path([x[i-1],y],[xx,y],0,gap&&i===1?'--color-rule-strong':'--color-text-secondary',gap&&i===1?'stroke-dasharray="4 6"':'');const reached=t>=arrivals[i]&&(!gap||i===0);s+=ring(xx,y,['Later WAL','Required WAL','Target'][i],gap&&i===1?'×':reached?'✓':'',gap&&i===1?'--coral':reached?'--teal':'--color-rule-strong',32);if(i&&!gap)s+=travel(t,arrivals[i]-.14,arrivals[i],[x[i-1],y],[xx,y],'--blue');});
 s+=ending(w,510,gap?'The base verifies; later replay stops':'Both checks reach their own boundary',gap?'Later files cannot bridge the missing WAL':'Consistency first, then the later target',small);
 return svg(s,small,595);
}
function target(t,small,v='0'){
 const w=small?440:760,cut=Number(v),x=[w*.18,w*.5,w*.82],labels=['Order','Mistake','Payment'];let s=line(`M${x[0]} 130H${x[2]}`);
 x.forEach((xx,i)=>{s+=ball(xx,130,i===1?'--coral':i===2?'--gold':'--blue')+text(xx,87,labels[i],21);if(i<2&&cut>i)s+=travel(t,.1+i*.25,.31+i*.25,[xx,130],[x[i+1],130],'--teal');});
 s+=line(`M${x[cut]+30} 100V180`,'--teal')+text(w/2,230,'Recovered database',25)+database(w*.25,330,'Catalogue',cut?'£2.20':'£20')+database(w*.75,330,'Payment',cut===2?'£10':'none');
 s+=ending(w,450,cut===0?'The price is right; the payment is absent':cut===1?'The mistake is included':'Reaching the payment includes the mistake','Provider still has the accepted £10 charge',small);
 return svg(s,small,520);
}
function payment(t,small,v='accepted'){
 const w=small?440:760,A=[w*.2,160],P=[w*.78,160],D=[w*.5,380],known=v==='accepted',saved=known&&t>=.8;
 let s=path(A,P)+path(P,D)+path(A,D)+server(...A,'Reconciler')+database(...P,'Provider',v==='unknown'?'?':v==='mismatch'?'≠':'£10')+database(...D,'Restored shop',saved?'£10':'none');
 s+=text(w/2,45,'Look up the original payment identity',small?20:25)+travel(t,.05,.23,A,P,'--purple')+travel(t,.3,.5,P,A,'--purple');
 if(known)s+=travel(t,.6,.8,A,D,'--gold');else if(t>=.6)s+=cross(A[0],A[1]);
 s+=ending(w,485,t<.5?'Establish what happened outside the database':saved?'One payment recorded · £19 still due':known?'Record the existing charge once':'Unresolved · no repair and no new charge','',small);
 return svg(s,small,530);
}
function restore(t,small,v='accepted'){
 const w=small?440:760,A=[w*.2,110],D=[w*.78,110],P=[w*.5,350],saved=t>=.8&&v==='accepted';let s=path(A,D)+path(P,D)+database(...A,'Original','£2.20')+database(...D,'Candidate',t>=.25?'£20':'')+database(...P,'Provider',v==='accepted'?'£10':'?');
 s+=travel(t,.03,.25,A,D,'--blue')+text(D[0],D[1]-60,t<.25?'Isolated':t<.6?'Paused at target':'Recovery complete',small?17:21);
 if(t>=.46)s+=cross(A[0],A[1]-1)+text(A[0],A[1]-60,'Writes closed',small?17:21);
 if(v==='accepted')s+=travel(t,.65,.8,P,D,'--gold');
 s+=ending(w,470,t<.46?'Inspect the paused recovery':t<.6?'Close source writes and resolve in-flight work':t<.65?'Finish recovery under controlled access':saved?'Reconciled once · £19 due':v==='accepted'?'Record the accepted charge once':'Payment unresolved · keep its work restricted',saved?'Verify the service before admitting callers':'',small);
 return svg(s,small,540);
}
function branch(t,small){
 const w=small?440:760,A=[small?60:90,220],U=[w-85,95],D=[w-85,355];let s=path(A,U)+path(A,D)+ring(...A,'Restore cut','£20','--blue')+database(...U,'Original',t>.35?'£2.20':'£20')+database(...D,'Recovered','£20');
 s+=travel(t,.04,.35,A,U,'--coral')+travel(t,.4,.68,A,D,'--blue');
 if(t>=.8)s+=ball(D[0]+15,D[1],'--gold')+text(D[0],D[1]-65,'£10 reconciled',small?18:22);
 s+=ending(w,480,'Finishing recovery creates another history','The provider’s charge is not rewound',small);
 return svg(s,small,550);
}
function stream(t,small,v='running'){
 const w=small?440:760,A=[w*.2,170],B=[w*.8,170],changed=t>=.12,applied=t>=.78&&v!=='paused';let s=path(A,B)+database(...A,'Publisher',changed?'£22':'£20')+database(...B,'Subscriber',applied?'£22':'£20');
 s+=text(w/2,45,'A row change, not a heap address',small?22:27)+travel(t,.23,v==='paused'?.5:.78,A,v==='paused'?[w*.5,170]:B,'--gold');
 if(v==='paused'&&t>=.5)s+=ring(w*.5,170,'Retained WAL','P7','--gold',29);
 s+=ending(w,330,t<.23?'The publisher commits first':applied?'The subscriber commits its own row':v==='paused'?'Apply paused · the old price remains':'Logical decoding sends the selected change','',small);
 return svg(s,small,385);
}
function copy(t,small){
 const w=small?440:760,A=[w*.2,110],B=[w*.8,110],S=[w*.5,330],updated=t>=.37,ready=t>=.87;let s=path(A,S)+path(S,B)+path(A,B,65);
 s+=database(...A,'Publisher',updated?'£22':'£20')+database(...B,'Subscriber',ready?'£22':t>=.57?'£20':'')+ring(...S,'Copy snapshot','£20','--blue');
 s+=travel(t,.05,.23,A,S,'--blue')+travel(t,.35,.57,S,B,'--blue')+travel(t,.65,.87,A,B,'--gold','',65);
 s+=ending(w,445,ready?'Changes after the snapshot catch up':'Copy the snapshot first',ready?'Table ready for normal apply':'Then apply the newer changes',small);
 return svg(s,small,515);
}
function consumer(t,small,v='effect'){
 const w=small?440:760,C=[w/2,75],E=[w*.25,270],P=[w*.75,270],effect=t>.4&&(v==='effect'||v==='together'),progress=t>.4&&(v==='progress'||v==='together');
 let s=path(C,E)+path(C,P)+ring(...C,'Transaction C','£22','--gold')+database(...E,'Projection',effect?'£22':'£20')+database(...P,'Restart record',progress?'C':'—');
 if(v==='together')s+=line(`M35 215H${w-35}V340H35Z`,'--teal')+text(w/2,385,'One destination transaction',23);
 if(v!=='progress')s+=travel(t,.12,.4,C,E,'--blue');if(v!=='effect')s+=travel(t,.12,.4,C,P,'--gold');
 if(t>.55)s+=cross(C[0],C[1]);
 s+=ending(w,450,t<.55?'Persisting the consumer’s work':v==='effect'?'Effect survived · C arrives again':v==='progress'?'Progress survived · the effect is lost':'Both survive, or neither does','',small);
 return svg(s,small,500);
}
function files(t,small,v='copy'){
 const w=small?440:760,L=[w*.25,90],R=[w*.75,90],linked=v==='link'&&t>.38,A=[linked?w/2:L[0],290],B=[R[0],290];
 let s=path(L,A)+path(R,linked?A:B)+server(...L,'Old directory')+server(...R,'New directory')+database(...A,linked?'One user file':'Old user file','£20');
 if(!linked&&t>.38)s+=database(...B,'New user file','£20');
 s+=travel(t,.07,.38,L,v==='link'?A:B,'--blue', '',30);
 if(t>.7){s+=text(R[0],R[1]-48,'Started',23);if(linked)s+=cross(...L);}
 s+=ending(w,430,t<.38?'Both clusters stopped':linked?t>.7?'Old cluster is now unsafe to start':'Two directory names reach the same file':v==='clone'?'Separate file identities; copy-on-write blocks':'Independent files remain independent',linked&&t>.7?'Even before the first shop request':'',small);
 return svg(s,small,505);
}
function handover(t,small,v='fenced'){
 const w=small?440:760,A=[w*.2,150],B=[w*.8,150],C=[w*.5,370],safe=v==='fenced',late=t>=.65;
 let s=path(A,B)+path(C,A)+path(C,B)+database(...A,'Source',!safe&&late?'£22':'£20')+database(...B,'Target',safe&&t>.91?'£22':'£20')+app(...C,safe?'Callers':'Old worker');
 s+=travel(t,.05,.25,A,B,'--blue');
 if(t>.35&&safe)s+=cross(...A)+text(w/2,65,'Source history closed',24);
 if(safe)s+=travel(t,.48,.62,A,B,'--gold')+travel(t,.77,.91,C,B,'--purple');
 else s+=travel(t,.45,.65,C,A,'--coral');
 s+=ending(w,485,t<.35?'Copy while the source owns writes':safe?t<.7?'Catch up to the final source boundary':t<.91?'Accept the service, then move callers':'Target-only change · simple return has ended':late?'The old worker extended source history':'A new address did not exclude old writers',!safe&&late?'Keep the target closed':'',small);
 return svg(s,small,555);
}
function fence(t,small,v='safe'){
 const w=small?440:760,A=[w*.22,100],B=[w*.78,100],O=[w*.22,330],N=[w*.78,330],safe=v==='safe',fenced=safe&&t>.5,promoted=t>.73;
 let s=path(A,O)+path(B,N)+path(O,N,0,'--color-rule-strong',t>.23?'stroke-dasharray="3 7"':'')+app(...A,'Existing pool')+app(...B,'New pool')+server(...O,fenced?'Fenced':'Old primary')+server(...N,promoted?'Promoted':'Replica');
 s+=travel(t,.03,.19,A,O,'--coral');if(t>.23)s+=cross(w/2,330);if(fenced)s+=cross(...O);
 if(!safe)s+=travel(t,.77,.95,A,O,'--coral');if(promoted)s+=travel(t,.77,.95,B,N,'--teal');
 s+=ending(w,460,t<.23?'One writer':t<.5?'The monitor loses contact':t<.73?safe?'Confirmed power fence':'Only the address changed':safe?'One writer · replacement owns new work':'Two writers · the old connection still works','',small);
 return svg(s,small,505);
}
function history(t,small,v='safe'){
 const w=small?440:760,L=small?125:210,R=w-40,ys=[100,230,360];let s='';
 ['Confirmed','A · durable','B · durable'].forEach((label,i)=>{s+=text(20,ys[i]-35,label,small?19:23,'--color-text','start')+line(`M${L} ${ys[i]}H${R}`);for(let j=0;j<(i===2?1:3);j++)s+=ball(L+j*(R-L)/2,ys[i],['--blue','--gold','--purple'][j])+text(L+j*(R-L)/2,ys[i]+40,['Earlier','U','C'][j],18);});
 if(v==='safe')s+=travel(t,.3,.7,[L,ys[1]],[R,ys[1]],'--teal');
 s+=ending(w,475,t<.3?'Exclude the old writer before promotion':t<.75?'Make the selected history usable':v==='safe'?'Promote A · £22 retained':'Promote B · confirmed change omitted','',small);
 return svg(s,small,520);
}
export const scenes={
 progress:makeScene('Durable and visible are different',12500,progress,'The primary’s update U and commit C arrive at the replica, are written and flushed, then replayed. Durable C can survive a crash while reads still return £20. Only replay through C allows a new snapshot to read £22.','Illustrative WAL records, without a time or byte scale. Earlier snapshots can continue to return £20.'),
 routing:makeScene('Qualify the copy before taking a snapshot',11500,routing,'The read requires acknowledged history H:C. Wait for A, qualify a primary fallback if the wait expires, or report unavailable if no qualifying target exists. The fresh read snapshot must be taken on the qualified server.','A timeout does not permit returning an earlier price under the same promise.',{defaultVariant:'catchup',actions:[{value:'catchup',label:'Replica catches up'},{value:'fallback',label:'Primary fallback'},{value:'unavailable',label:'No fallback'}]}),
 switching:makeScene('A reader can move to an earlier history',10500,switching,'First read on replica A returns £22. With no retained requirement, the next read on B returns £20. Retaining H:C excludes B until it catches up; use A, wait within a limit, or decline.','The copies are fixed. The routing decision changes what the reader sees.',{defaultVariant:'forget',actions:[{value:'forget',label:'Forget observed history'},{value:'retain',label:'Retain observed history'}]}),
 chain:makeScene('Later files cannot bridge a gap',9000,chain,'A base backup and its consistency WAL lead through required history A, B and C. Missing B stops this path at A even when C’s files remain. A complete different backup path might reach later.','Symbolic dependencies, not actual filenames or log positions.',{defaultVariant:'complete',actions:[{value:'complete',label:'Complete history'},{value:'missing',label:'Missing interval'}]}),
 pgchain:makeScene('Two stretches of WAL, two different checks',11000,pgchain,'The streamed base backup includes consistency WAL. pg_verifybackup checks the backup and its required consistency WAL. A later target also requires a continuous later archive. A missing required later segment stops replay without invalidating the intact base backup.','Symbolic dependencies, without real filenames or LSNs. Later archive completeness is a separate check.',{defaultVariant:'complete',actions:[{value:'complete',label:'Complete later archive'},{value:'missing',label:'Required WAL missing'}]}),
 target:makeScene('A restore chooses a prefix of history',8000,target,'Order 103 commits, then a catalogue price mistake, then payment 504. Restoring before the mistake also omits the payment. Restoring through the payment retains the mistake. The external provider still has the accepted £10 charge.','Order 103’s agreed £29 total is unchanged by the catalogue price.',{defaultVariant:'0',actions:[{value:'0',label:'Before mistake'},{value:'1',label:'Through mistake'},{value:'2',label:'Through payment'}]}),
 payment:makeScene('Record the charge that already happened',10000,payment,'Look up the retained operation identity at the provider. A known accepted matching £10 result supports one local payment record, leaving £19 due. An unavailable or mismatching result leaves the repair unresolved. No branch issues a new charge.','A controlled reconciliation with hypothetical queryable provider evidence.',{defaultVariant:'accepted',actions:[{value:'accepted',label:'Matching charge'},{value:'unknown',label:'Unavailable outcome'},{value:'mismatch',label:'Different payload'}]}),
 restore:makeScene('Inspect before reopening the service',12500,restore,'The isolated target replays to a verified paused recovery point. Inspect its facts, close original source writes and account for in-flight outcomes. Finish recovery under controlled access. Reconcile known accepted payment evidence once; unresolved evidence keeps affected work restricted.','Verify one write authority, service readiness and external dispatch before admitting callers.',{defaultVariant:'accepted',actions:[{value:'accepted',label:'Matching provider evidence'},{value:'unknown',label:'Unresolved payment'}]}),
 branch:makeScene('Recovery makes another history',9000,branch,'The original history contains the price mistake and later payment. Finishing recovery at the earlier cut creates a new timeline with £20. Reconciling the provider’s accepted £10 charge leaves £19 due on the unchanged £29 order.','The database restore does not rewind the external provider.'),
 stream:makeScene('Commit here. Apply there.',9500,stream,'Publisher commit changes P7 from £20 to £22. Logical decoding sends the selected row change by key. The subscriber applies and commits its own tuple. Paused apply leaves £20 visible and retains required history.','An asynchronous copy after initial synchronisation.',{defaultVariant:'running',actions:[{value:'running',label:'Apply the change'},{value:'paused',label:'Pause apply'}]}),
 copy:makeScene('The snapshot needs the changes behind it',10500,copy,'A table synchronisation worker copies a consistent £20 snapshot while the publisher commits £22. It then applies changes after that snapshot before handing the table to normal apply.','One table’s initial copy, not a simultaneous snapshot of an entire subscription.'),
 consumer:makeScene('Keep the effect with its restart record',10000,consumer,'Effect first can replay C after a crash. Progress first can skip an effect that never survived. One destination transaction commits the projection and restart record together, so both survive or neither does.','An illustrative external consumer; C is symbolic, not a native LSN.',{defaultVariant:'effect',actions:[{value:'effect',label:'Effect first'},{value:'progress',label:'Progress first'},{value:'together',label:'One transaction'}]}),
 files:makeScene('Two names can reach one file',10000,files,'Copy uses independent files. Clone has separate file identities with copy-on-write blocks. Link gives both directories names for the same user files. Starting the linked target makes the old cluster unsafe to start, even before public traffic.','Clone requires supported storage. Independent files alone do not make stale accepted history safe to reopen.',{defaultVariant:'copy',actions:[{value:'copy',label:'Copy'},{value:'clone',label:'Clone'},{value:'link',label:'Link'}]}),
 handover:makeScene('Close one history before opening another',14500,handover,'Copy while the source owns writes. Exclude and drain old writers, cover the final boundary on the exact target, accept the service, then admit target callers. A first target-only change ends simple return. Changing an address alone leaves a stale worker able to extend source history; keep the candidate closed.','Illustrative whole-shop handover. The order’s agreed £29 total does not change.',{defaultVariant:'fenced',actions:[{value:'fenced',label:'Exclude old writers'},{value:'address',label:'Change address only'}]}),
 fence:makeScene('A lost connection does not stop a writer',11000,fence,'The monitor loses contact while an existing pool still reaches the primary. A confirmed independent power fence and restart exclusion stop the old writer. Moving only the address leaves that connection alive; promoting another writer then creates split brain.','Candidate history is assumed ready here; writer exclusion is a separate condition.',{defaultVariant:'safe',actions:[{value:'safe',label:'Confirm the fence'},{value:'unsafe',label:'Move address only'}]}),
 history:makeScene('Which copy retains the confirmed change?',10000,history,'A has a complete durable chain through update U and commit C, but has not replayed it. B has only the earlier history. After fencing the old writer, A can replay and retain £22; promoting B without obtaining C omits the confirmed change.','Symbolic history positions. Promotion does not manufacture missing records.',{defaultVariant:'safe',actions:[{value:'safe',label:'A · commit durable'},{value:'unsafe',label:'B · commit absent'}]})
};
