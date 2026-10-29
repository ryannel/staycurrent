import { text,line,path,travel,svg,app,server,database,ring,ball,phase,ease,makeScene } from '../drawing.mjs';
import { actions,colours,labelLines } from './core.mjs';
function loading(t,small,v){
 const W=small?440:760,A=[75,165],D=[W-75,165],count=v==='join'?1:v==='batch'?2:3,done=Math.min(count,Math.floor(t*count/.86));let s=app(...A)+database(...D)+path(A,D);
 for(let i=0;i<count;i++){const start=.04+i*.82/count,end=start+.7/count;s+=travel(t,start,(start+end)/2,A,D,colours[i])+travel(t,(start+end)/2,end,D,A,colours[i]);}
 const lines=v==='join'?(done?4:0):v==='batch'?(done===2?4:0):Math.max(0,done-1)*2;
 [0,1].forEach(i=>{const x=W*(i?.73:.27);s+=ring(x,350,`Order ${i?101:103}`,'','--teal',43);if(lines>i*2){s+=ball(x-14,350,'--blue')+ball(x+14,350,'--gold');}else s+=text(x,350,done?'Lines missing':'Not loaded',18);});
 s+=text(W/2,460,`${done} ${done===1?'query':'queries'} · ${lines} lines loaded`,25);return svg(s,small,510);
}
function lifecycle(t,small,v){
 const W=small?440:760,P=[W*.22,95],A=[W*.78,95],D=[W*.78,300],end=t>.86,bad=['broken','unknown'].includes(v),fail=['guard','error'].includes(v);
 let s=ring(...P,'Pool','','--teal',38)+app(...A,'Request')+database(...D)+path(P,A)+path(A,D);
 s+=travel(t,.04,.17,P,A,'--teal')+travel(t,.22,.4,A,D,'--coral');
 if(t>.17&&t<.75)s+=ball(A[0],A[1],'--teal');
 if(!bad)s+=travel(t,.47,.63,D,A,fail?'--coral':'--gold')+travel(t,.73,.86,A,P,'--teal');
 else if(t>.52)s+=path([A[0]-20,A[1]-20],[A[0]+20,A[1]+20],0,'--coral')+path([A[0]+20,A[1]-20],[A[0]-20,A[1]+20],0,'--coral');
 if(end&&!bad)s+=ball(...P,'--teal');
 const result={success:['Commit acknowledged','Clean connection returned'],guard:['No stock matched · rollback','Clean connection returned'],error:['Statement rejected · rollback','Clean connection returned'],broken:['Link failed before COMMIT','Connection discarded'],unknown:['COMMIT sent, reply lost','Discard · recover request identity']}[v]||[];
 s+=labelLines(W/2,440,end?result:t<.2?['Borrow one connection']:t<.45?['Keep the transaction on this connection']:[bad?'Broken connections cannot be reused':fail?'Roll back before reuse':'End the transaction before reuse']);
 return svg(s,small,520);
}
function competition(t,small,v){
 const W=small?440:760,A=[65,120],B=[65,340],K=[W-80,220],commit=v==='commit';let s=app(...A,'Attempt A')+app(...B,'Attempt B')+ring(...K,'Unique request','purchase','--teal',48)+path(A,K)+path(B,K);
 s+=travel(t,.04,.2,A,K,'--blue')+travel(t,.24,.4,B,[K[0]-65,K[1]+65],'--gold');
 if(t>.2&&t<.6)s+=ball(...K,'--blue');
 if(t>.4&&t<.65)s+=ball(K[0]-65,K[1]+65-Math.abs(Math.sin(t*50))*8,'--gold')+text(W/2,365,'Waits for the same key',20);
 s+=travel(t,.65,.82,commit?K:[K[0]-65,K[1]+65],commit?B:K,'--gold');
 s+=labelLines(W/2,470,t>.84?(commit?['A committed.','B returns the saved order; no new purchase.']:['A aborted.','B owns the key and makes the purchase.']):['Claim the request before changing stock.']);return svg(s,small,550);
}
function atomicity(t,small,v){
 const W=small?440:760,x=[W*.25,W*.75],y=180,one=v==='together';let s=ring(x[0],y,'Purchase','','--blue',45)+ring(x[1],y,'Saved result','','--gold',45)+text(W/2,55,one?'One transaction':'Two transactions',25);
 const saved=[t>.52&&v!=='receipt',t>(one?.52:.78)&&v!=='purchase'];
 if(v==='receipt')saved[1]=t>.52;
 x.forEach((xx,i)=>{s+=path([xx,90],[xx,y]);s+=travel(t,.12,.52,[xx,90],[xx,y],colours[i]);if(saved[i])s+=ball(xx,y,colours[i]);});
 if(one)s+=line(`M${x[0]-45} 300H${x[1]+45}`,'--teal')+text(W/2,340,'Commit both',24);
 else if(t>.6)s+=text(W/2,320,'Crash between commits',24);
 s+=labelLines(W/2,430,t>.82?(one?['The retained answer matches the purchase.']:v==='purchase'?['Purchase exists.','Its recovery answer is missing.']:['Success was saved.','The purchase never happened.']):['Keep the outcome and its work together.']);return svg(s,small,520);
}
function uncertainty(t,small,v){
 const W=small?440:760,A=[65,160],D=[W-75,160],commit=v==='commit';let s=path(A,D)+app(...A)+database(...D,'Database',t>.4&&commit?'103':'');
 s+=travel(t,.06,.3,A,D,'--blue');if(t>.42)s+=text(W/2,260,'× no reply',24);
 s+=labelLines(W/2,365,t>.7?(commit?['Order 103 exists.','The application is still uncertain.']:['No committed purchase.','The application is still uncertain.']):['COMMIT is on its way.']);return svg(s,small,450);
}
function delivery(t,small,v){
 const [stop='accepted',dedup='no']=v.split(':'),W=small?440:760,D=[65,170],R=[W/2,170],E=[W-65,170],first=stop!=='before',repeat=stop!=='finished',count=t<.36?0:t<.8?(first?1:0):repeat?(first&&dedup==='no'?2:1):1;
 let s=database(...D,'Outbox',t>=(repeat?.94:.46)?'Done':'Ready')+server(...R,'Relay')+ring(...E,'Receiver',String(count),'--teal',37)+path(D,R)+path(R,E);
 s+=travel(t,.04,.18,D,R,'--blue');if(first)s+=travel(t,.2,.36,R,E,'--blue');
 if(t>(repeat?.4:.48)&&t<.6)s+=text(R[0],280,'Relay stops',23);
 if(repeat)s+=travel(t,.62,.8,R,E,'--blue');
 if(stop==='finished')s+=travel(t,.37,.4,E,R,'--teal')+travel(t,.4,.46,R,D,'--teal');else s+=travel(t,.81,.865,E,R,'--teal')+travel(t,.87,.94,R,D,'--teal');
 s+=labelLines(W/2,385,t>.8?[`${count} accepted ${count===1?'effect':'effects'}`,!repeat?'Completion already recorded.':dedup==='yes'?'Same ID + payload recognised.':'A repeated call can repeat the effect.']:['The call can finish','before completion is recorded.']);
 return svg(s,small,480);
}
function lease(t,small){
 const W=small?440:760,A=[60,100],B=[60,330],D=[W-80,215],expired=t>.38,newClaim=t>.55;
 let s=app(...A,'Worker A')+app(...B,'Worker B')+ring(...D,'Job claim',newClaim?'8':'7','--teal',43)+path(A,D)+path(B,D);
 s+=travel(t,.06,.22,D,A,'--blue')+travel(t,.4,.55,B,D,'--gold');
 if(t>.26)s+=text(A[0]+35,180,'Claim 7',22);if(newClaim)s+=text(B[0]+35,410,'Claim 8',22);
 s+=travel(t,.62,.77,A,D,'--blue')+travel(t,.8,.93,B,D,'--gold');
 s+=labelLines(W/2,480,t>.77?['Old claim 7 cannot finish claim 8.','External effects still need protection.']:expired?['Lease expired; another worker claims.']:['Only the current unexpired claim may finish.']);return svg(s,small,550);
}
export const scenes={
 loading:makeScene('The same orders, fewer trips',11000,loading,'Load Mina’s orders 103 and 101 and their four lines. One query per order needs three queries and returns six rows. A batched line query needs two and returns six rows. One joined query returns four rows, repeating each order’s columns.','The completed application result has two orders with two lines each.',actions([['loop','One query per order'],['batch','Batch the lines'],['join','One join']])),
 lifecycle:makeScene('Borrow, finish, return',10500,lifecycle,'A request borrows one connection and keeps its transaction on that connection. After acknowledged commit or rollback it returns the clean connection. Broken connections are discarded. A lost commit reply leaves the purchase outcome unknown and must be recovered by request identity.','Never return an unfinished transaction or an in-flight query to another request.',actions([['success','Commit acknowledged'],['guard','Stock does not match'],['error','Statement rejected'],['broken','Link breaks before commit'],['unknown','Commit reply lost']])),
 uncertainty:makeScene('One missing reply, two possible histories',8500,uncertainty,'The caller sends COMMIT and hears no reply. The database might have aborted the attempt or committed the whole purchase. Neither is established by the missing reply.','Two alternative histories, not two purchases in one run.',actions([['abort','Attempt aborts'],['commit','Purchase commits']])),
 atomicity:makeScene('The work and its saved answer',9000,atomicity,'An atomic commit records the request identity, its purchase and its accepted answer together. Splitting those commits creates a crash gap: either a purchase without its answer or an answer without its purchase.','A saved success is trustworthy only when it commits with the work.',actions([['together','One transaction'],['purchase','Purchase first'],['receipt','Answer first']])),
 competition:makeScene('One request key, one purchase',11000,competition,'Attempt A inserts the unique request key before changing stock. B’s same-key insert waits. If A commits, B reads and compares the retained result in a fresh statement without purchasing again. If A aborts, B can acquire the key and perform the purchase.','A selected Read Committed schedule; errors can require a whole retry.',actions([['commit','A commits'],['abort','A aborts']])),
 delivery:makeScene('A call can succeed before the shop knows',12000,delivery,'The relay reads ready work, calls a receiver and records completion separately. Stopping after acceptance can repeat the effect on retry. A receiver that recognises the same ID and canonical payload can return its retained result instead. Stopping before the call produces one first effect; stopping after recorded completion needs no retry.','The job identity remains the same across attempts.',{defaultVariant:'accepted:no',choices:[{label:'Relay stops',value:'accepted',options:[{value:'before',label:'Before call'},{value:'accepted',label:'After acceptance'},{value:'finished',label:'After completion record'}]},{label:'Receiver',value:'no',options:[{value:'no',label:'No deduplication'},{value:'yes',label:'Deduplicates ID and payload'}]}]}),
 lease:makeScene('One job, two worker claims',11500,lease,'Worker A has claim 7. Its lease expires and worker B claims the same job with claim 8. A’s stale completion cannot update B’s claim. B can finish its current unexpired claim. This database guard does not retract any external effect A already produced.','A lease limits ownership of the record; it cannot stop a paused process from resuming.')
};
