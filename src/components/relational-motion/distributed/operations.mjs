import { makeScene,svg,text,line,path,travel,app,server,database,ring,ball,phase,ease,divider,note } from '../drawing.mjs';

const colour=['--blue','--gold','--purple','--coral','--teal'];
const W=s=>s?440:760;
const cross=(x,y)=>line(`M${x-15} ${y-15}L${x+15} ${y+15}M${x-15} ${y+15}L${x+15} ${y-15}`,'--coral');
const gate=(x,y,open)=>line(open?`M${x} ${y-25}L${x+28} ${y-45}`:`M${x} ${y-25}V${y+25}`,open?'--teal':'--coral');
const actions=(values,labels)=>({defaultVariant:values[0],actions:values.map((value,i)=>({value,label:labels[i]}))});

function lockChain(t,small){
 const w=W(small),A=[65,250],D=[w-65,250],P=small?205:330,blocked=t<.66;
 let s=app(...A)+database(...D,'Orders')+server(D[0],72,'Holder H');
 s+=path([D[0],102],[D[0],205],0,blocked?'--coral':'--color-rule-strong');
 if(blocked)s+=gate(D[0]-50,250,false);
 else s+=text(D[0],160,'Rolled back',18);
 for(let i=0;i<3;i++){
  const y=180+i*70,at=[P,y];s+=path(A,at)+path(at,D)+ring(...at,'','',t>.12&&t<.85?'--blue':'--color-text-secondary',19);
  s+=travel(t,.05+i*.025,.18+i*.025,A,at,colour[i]);
  if(t>=.25&&t<.66)s+=ball(P,y,colour[i]);
  s+=travel(t,.67+i*.025,.79+i*.025,at,D,colour[i])+travel(t,.82+i*.025,.94+i*.025,D,A,colour[i]);
 }
 s+=text(P,125,'Pool · 3 connections',20);
 if(t>.32&&t<.85){s+=ball(65,365,'--coral');if(t<.5)s+=ball(100,365,'--teal');}
 s+=text(w/2,435,t<.25?'Three readers borrow connections':t<.5?'Database waits fill the pool':t<.66?'One caller leaves. The lock remains.':t<.85?'Release the lock; finish the reads':'Connections return. The queue drains.',small?21:25);
 return svg(s,small,475);
}
function journey(t,small){
 const w=W(small),A=[65,245],C=[w*.49,245],D=[w-65,245];let s=path(A,C)+path(C,D)+app(...A)+ring(...C,'Connection 1','','--teal',28)+database(...D,'Database');
 s+=server(C[0],75,'Connection 2')+text(C[0],163,'Other request continues',19);
 const p=phase(t,.06,.19);if(t<.2)s+=ball(A[0]-7,A[1]-60,'--coral');
 s+=travel(t,.2,.35,A,C,'--coral');if(t>=.35&&t<.7)s+=ball(C[0],C[1],'--coral');
 if(t>.4&&t<.7)s+=gate(D[0]-48,D[1],false)+text(D[0],D[1]-68,'Table lock',19);
 s+=travel(t,.71,.81,C,D,'--coral')+travel(t,.84,.96,D,A,'--teal');
 s+=text(w/2,365,t<.2?'Wait for a free connection':t<.4?'Borrowed, but not yet executing':t<.7?'Waiting for a lock still occupies it':t<.84?'The lock ends; the query runs':'Result consumed · connection released',small?21:25);
 return svg(s,small,410);
}
function overload(t,small,v){
 const bounded=v!=='unbounded',w=W(small),now=Math.min(400,t*450),max=bounded?4:7,done=Math.min(Math.floor(now/100)*2,max),active=Math.min(2,max-done);
 let s=text(w/2,35,'Seven arrivals · two connections',24),left=50,right=w-50;
 s+=line(`M${left} 155H${right}`)+text(left,100,'Waiting',20,'--color-text','start')+text(right,100,'Running',20,'--color-text','end');
 for(let i=1;i<=7;i++){
  const start=Math.floor((i-1)/2)*100,finish=start+100,refused=bounded&&i>4,x=refused?left+(i-5)*40:i<=done?left+(i-1)*40:now>=start?right-35+(i%2)*30:left+(i-done-active-1)*36;
  const y=refused?365:i<=done?265:155;
  s+=ball(x,y,refused?'--coral':i===7&&now>=300?'--coral':colour[(i-1)%3]);
  if(!refused&&now>=start&&now<finish)s+=`<circle cx="${x}" cy="${y}" r="20" fill="none" stroke="var(--teal)" stroke-width="2" stroke-dasharray="${126*phase(now,start,finish)} 126" transform="rotate(-90 ${x} ${y})"/>`;
 }
 s+=text(left,227,'Finished',20,'--color-text','start');
 s+=text(w/2,335,bounded?'3 refused immediately':'No queue limit · no expiry removal',22);
 s+=text(w/2,435,now>=400?(bounded?'4 admitted · all finish by 200 ms':'Last request finishes at 400 ms'):`${Math.floor(now/100)*100} ms · ${done} finished`,24);
 if(!bounded)s+=text(w/2,468,'Last request’s deadline: 300 ms',20);
 return svg(s,small,500);
}
function boundary(t,small,v){
 const w=W(small),policy=v!=='none',rows=['Mina','Tariq','Edda','Rowan'],X=[65,w*.5,w-65];let s=text(X[0],40,'Stored rows',22)+text(X[2],40,'Returned',22);
 rows.forEach((name,i)=>{const y=110+i*88,c=i===3?'--gold':'--blue',allowed=!policy||i<3,start=.08+i*.11,end=start+.28;
 s+=ball(X[0],y,c)+text(X[0],y+35,name,19)+path([X[0]+15,y],[X[2],y]);
 s+=travel(t,start,Math.min(end,.9),[X[0],y],[allowed?X[2]:X[1]-22,y],c);
 if(t>=end){if(allowed)s+=ball(X[2],y,c);else s+=cross(X[1]-20,y);}
 });
 s+=line(`M${X[1]} 65V405`,policy?'--teal':'--color-rule-strong',policy?'':'stroke-dasharray="4 5"')+text(X[1],440,policy?'Tenant 10 policy':'Table grant only',23);
 return svg(s,small,475);
}
function context(t,small,v){
 const retained=v==='session',w=W(small),A=[65,180],P=[w*.5,180],D=[w-65,180],second=t>.46;let s=path(A,P)+path(P,D)+app(...A,second?'Tenant 20':'Tenant 10')+server(...P,'Pooled connection')+database(...D,'Customers');
 const context=t<.33?'10':t<.7?(retained?'10':'—'):'20';s+=text(P[0],95,`Context: ${context}`,23);
 s+=travel(t,.04,.15,A,P,'--blue')+travel(t,.16,.27,P,D,'--blue')+travel(t,.28,.36,D,A,'--blue');
 s+=travel(t,.47,.57,A,P,'--gold')+travel(t,.58,.67,P,D,'--gold');
 if(t>=.67&&t<.8)s+=note(w/2,300,retained?['Wrong tenant’s rows','Mina · Tariq · Edda']:['No context · no rows'],small);
 s+=travel(t,.82,.9,P,D,'--gold')+travel(t,.91,.98,D,A,'--gold');
 if(t>=.8)s+=note(w/2,300,['Set context 20 in the new transaction','Only Rowan returns'],small);
 if(t<.46)s+=text(w/2,300,t<.33?'Read, then return the connection':retained?'Session context survives':'Transaction context clears',small?22:25);
 return svg(s,small,390);
}
function range(t,small,v){
 const w=W(small),xs=[w*.17,w*.5,w*.83],y=140,extra=v==='yes',failed=t>.22,learner=t>.45,complete=t>.82&&!extra;let s='';
 xs.forEach((x,i)=>{const gone=(i===2&&failed)||(i===1&&extra);s+=server(x,y,['A','B',complete?'C · removed':'C'][i],gone?'--color-text-secondary':'--teal');if(gone)s+=cross(x,y);});
 const d=[w*.5,340];s+=server(...d,complete?'D · voter':learner?'D · learner':'D · empty',complete?'--teal':'--color-text-secondary');
 s+=path([xs[0],y],d,0,'--color-rule-strong');if(learner){s+=travel(t,.47,.77,[xs[0],y],d,'--blue');if(t>=.78)s+=ball(d[0],d[1]-55,'--blue');}
 const count=complete?3:failed?(extra?1:2):(extra?2:3);
 s+=text(w/2,440,`${count} of 3 voters reachable`,26)+text(w/2,477,complete?'Protection restored':count<2?'Replacement cannot establish a quorum':failed?'Available · no spare voter':'One further failure can be tolerated',small?20:23);
 return svg(s,small,510);
}
function payment(t,small,v){
 const w=W(small),A=[w*.2,145],P=[w*.8,145],D=[w*.5,350],ok=v==='accepted',saved=ok&&t>.7;
 let s=path(A,P)+path(P,D)+server(...A,'Repair worker')+server(...P,'Provider')+database(...D,'Restored shop',saved?'£19 due':'£29 due');
 s+=travel(t,.05,.24,A,P,'--gold')+travel(t,.26,.45,P,A,ok?'--teal':'--coral');
 s+=text(w/2,65,t<.45?'Look up the original operation':ok?'Same order · £10 accepted':v==='unknown'?'Outcome unavailable':'Payload disagrees',small?21:25);
 if(ok){s+=travel(t,.48,.7,A,D,'--gold');if(saved)s+=ball(D[0]-12,D[1]-60,'--gold')+ball(D[0]+15,D[1]-60,'--blue');s+=travel(t,.81,.91,A,D,'--gold')+travel(t,.92,.99,D,A,'--teal');}
 s+=text(w/2,470,saved?'One payment. Repeats reuse its identity.':ok?'Payment + operation mapping commit together':'Keep unresolved · do not charge again',small?20:24);
 return svg(s,small,510);
}

export const scenes={
 lock:makeScene('A database wait becomes a pool queue',14000,lockChain,'A separate holder H keeps an ACCESS EXCLUSIVE orders lock. Three readers borrow all pool clients and wait for H. Two later callers queue; one leaves without freeing a client or the lock. H rolls back. The readers finish and release their clients, then the remaining caller can proceed.','A lock-only schedule: H changes no rows. Pool waiting and database waiting are different parts of the same chain.'),
 journey:makeScene('Where the request waits',11500,journey,'Mina first waits for a pool connection. Once borrowed, it stays occupied while her SELECT waits for a separate table lock. The holder ends; the query executes, its result is consumed and the connection returns. The other pool connection remains busy throughout.','Borrowing a connection does not mean the statement is executing. Illustrative ordering, not measured latency.'),
 overload:makeScene('A queue can hold a burst',10000,overload,'Seven requests arrive together. Two execute at a time, each taking an assumed 100 ms. With a two-request queue, three are refused and four finish by 200 ms. Without a bound or expiry removal, the last begins at its 300 ms deadline and finishes at 400 ms.','Fixed service times illustrate admission, not database performance.',actions(['bounded','unbounded'],['Bound the queue','Queue every request'])),
 boundary:makeScene('A table grant is not a row boundary',8500,boundary,'Four customer rows remain stored. Under the tenant 10 policy, Mina, Tariq and Edda return; Rowan from tenant 20 does not. A table grant alone allows all four.','The policy filters the result. It does not delete the other tenant’s rows.',actions(['policy','none'],['Tenant policy','Table grant only'])),
 context:makeScene('A reused connection needs fresh context',14000,context,'Tenant 10 uses a pooled connection. Transaction-local context clears at commit; session context remains. The next tenant 20 request deliberately queries before setting context: cleared context returns no rows, retained context leaks tenant 10 rows. Setting authorised context 20 returns Rowan.','The second request deliberately omits its context first. The service must set authorised context for every request.',actions(['transaction','session'],['Transaction context','Session context'])),
 range:makeScene('Available is not fully protected',12000,range,'A, B and C are the three voters. Losing C leaves a majority but no spare. D receives history as a non-voting learner; a completed safe membership replacement makes A, B and D voters. If B is also unavailable, A alone cannot authorise that replacement.','Catch-up does not itself confer a vote. Membership changes use the supported protocol.',actions(['no','yes'],['One voter lost','Two voters lost'])),
 payment:makeScene('Recover the payment, not another charge',13000,payment,'The restored purchase has £29 due and no later payment. Matching provider evidence establishes the original £10 charge. One transaction restores payment 504 and its immutable operation mapping; a repeated repair reuses them, leaving £19 due. Unavailable or conflicting evidence stops the repair.','The provider’s accepted effect survives restoration of the database.',actions(['accepted','unknown','mismatch'],['Matching evidence','Unknown outcome','Different payload']))
};
