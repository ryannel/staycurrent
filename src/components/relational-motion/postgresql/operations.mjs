import { makeScene, svg, text, line, path, travel, app, server, database, ring, ball, phase, note } from '../drawing.mjs';
const cross=(x,y)=>line(`M${x-10} ${y-10}l20 20M${x+10} ${y-10}l-20 20`,'--coral');
const end=(w,y,lines,small)=>note(w/2,y,lines,small);
function locks(t,small,v='timeout'){
 const w=small?440:760,x=[w*.18,w*.5,w*.82],y=135,release=t>=.72;let s=line(`M${x[0]} ${y}H${x[2]}`);
 ['Reader A','Change B','Reader C'].forEach((name,i)=>s+=app(x[i],y,name));
 s+=ring(w/2,330,'Table lock',release&&v==='commit'?'free':'A','--blue');
 s+=path([x[0],y],[w/2,330])+travel(t,.01,.15,[x[0],y],[w/2,330],'--blue');
 if(t>=.25&&(!release||v==='commit'))s+=ball(x[1],y-55,'--gold');
 if(t>=.4&&t<.72)s+=ball(x[2],y-55,'--purple');
 if(release&&v==='timeout')s+=cross(x[1],y-55)+travel(t,.73,.9,[x[2],y],[w/2,330],'--purple');
 if(v==='commit')s+=travel(t,.73,.81,[x[1],y],[w/2,330],'--gold')+travel(t,.84,.95,[x[2],y],[w/2,330],'--purple');
 s+=end(w,445,t<.25?['A keeps its transaction open']:t<.4?['B waits for an exclusive lock']:t<.72?['C queues behind the waiting change']:v==='timeout'?['B times out; C can read alongside A']:['A ends; B changes and commits; C proceeds'],small);
 return svg(s,small,490);
}
function rules(t,small){
 const w=small?440:760,L=w*.25,R=w*.75,y=130,repaired=t>.65,validated=t>.86;let s=ring(L,y,'Current price','£22','--blue',42)+ring(R,y,'Hundredths',repaired?'2200':'2000',repaired?'--teal':'--coral',42)+path([L+42,y],[R-42,y]);
 if(t>.2)s+=text(w/2,260,'New writes must preserve agreement',small?20:25)+line(`M45 290H${w-45}`,'--teal');
 if(t>.4)s+=text(w/2,340,repaired?'Values repaired':'NOT NULL passes · agreement fails',small?20:25);
 s+=travel(t,.49,.65,[L,y],[R,y],'--blue');
 if(validated)s+=text(w/2,400,'Existing rows validated ✓',26);
 s+=end(w,465,t<.2?['Present is not the same as correct']:t<.65?['Enforcement protects new writes', 'The old violation still needs repair']:validated?['Agreement established and enforced']:['Repair does not itself run validation'],small);
 return svg(s,small,540);
}
function index(t,small){
 const w=small?440:760,D=[w*.22,130],I=[w*.78,130],A=[w*.5,360],ready=t>.35,valid=t>.84;let s=path(D,I)+path(A,I)+database(...D,'Table')+ring(...I,'New index',valid?'valid':ready?'ready':'exists',valid?'--teal':'--gold',40)+app(...A,'Query');
 for(let j=0;j<4;j++)s+=travel(t,.05+j*.09,.25+j*.09,D,I,['--blue','--purple','--gold','--teal'][j]);
 if(t>.5&&t<.84)s+=cross((A[0]+I[0])/2,(A[1]+I[1])/2);
 if(valid)s+=travel(t,.86,.97,A,I,'--coral');
 s+=end(w,470,t<.35?['A catalogue entry is only a beginning']:t<.6?['New writes maintain the index', 'Queries still cannot use it']:t<.84?['The scan finished','Old snapshots still delay completion']:['Valid · test with fresh representative sessions'],small);
 return svg(s,small,545);
}
function recovery(t,small,v='rollback'){
 const w=small?440:760,H=[w*.22,100],W=[w*.78,100],D=[w*.5,315],release=t>=.65&&['rollback','terminate'].includes(v),cancelled=t>=.65&&v==='cancel-waiter';
 let s=path(H,D)+path(W,D)+app(...H,'Holder H')+app(...W,'Reader W')+database(...D,'Orders');
 if(!release)s+=ring(D[0],D[1]-70,'', 'H','--gold',25);
 s+=travel(t,.05,.25,W,[W[0]-(W[0]-D[0])*.6,W[1]+(D[1]-W[1])*.6],'--purple');
 if(release)s+=travel(t,.66,.8,W,D,'--purple')+travel(t,.81,.95,D,W,'--purple');
 if(cancelled)s+=cross(...W);if(t>.65&&v==='terminate')s+=cross(...H);
 s+=end(w,460,t<.5?['The lock command finished', 'H’s transaction still holds the lock']:release?[v==='terminate'?'H’s session ended; discard its client':'H rolled back; its lock is released','W can read orders 103 and 101']:cancelled?['W stopped; H still blocks new readers','Roll back W before reusing its client']:['No running query in H to cancel','Its open transaction still blocks W'],small);
 return svg(s,small,535);
}
function definer(t,small,v='safe'){
 const w=small?440:760,A=[w/2,65],L=[w*.23,245],R=[w*.77,245],D=[w/2,440],safe=v==='safe';
 let s=path(A,L)+path(A,R)+path(safe?L:R,D)+app(...A,'Support login')+ring(...L,'Protected map','10','--blue')+ring(...R,'Caller’s map','20','--coral')+database(...D,'Customer 4','tenant 20');
 s+=travel(t,.07,.38,A,safe?L:R,safe?'--blue':'--coral')+travel(t,.45,.7,safe?L:R,D,safe?'--blue':'--coral');
 if(t>.72&&safe)s+=cross(...D);
 s+=end(w,550,t<.38?['The function runs with its owner’s privileges']:safe?['Qualified mapping: tenant 10','Rowan does not belong to this caller']:['Unqualified name finds the caller’s map','Rowan is disclosed'],small);
 return svg(s,small,630);
}
function routing(t,small,v='history'){
 const w=small?440:760,A=[w/2,65],pts=[[w*.18,255],[w*.5,255],[w*.82,255],[w/2,435]];let s='';
 pts.forEach(p=>s+=path(A,p));s+=app(...A,'Router');['Mina','Tariq','Edda','Products owner'].forEach((n,i)=>s+=server(...pts[i],n));
 s+=travel(t,.1,.4,A,pts[0],'--blue');if(v==='purchase')s+=travel(t,.16,.53,A,pts[3],'--gold');
 if(v==='order')s+=text(w/2,155,'Order directory → Mina’s group',small?20:24);
 s+=end(w,550,t<.4?['Route from the keys on the request']:v==='purchase'?['Order work and stock have different owners','They need one atomic outcome']:['The customer’s order work stays together'],small);
 return svg(s,small,620);
}
function move(t,small){
 const w=small?440:760,A=[w*.2,160],B=[w*.8,160],R=[w/2,355],closed=t>.19,copied=t>.48,decision=t>.67,open=t>.81;
 let s=path(A,B)+path(R,A)+path(R,B)+database(...A,'Source','A')+database(...B,'Destination',copied?'A':'')+ring(...R,'Durable route',decision?'D · 2':'S · 1','--gold');
 if(closed)s+=cross(A[0],A[1]-60);if(!open)s+=cross(B[0],B[1]-60);
 for(let i=0;i<3;i++)s+=travel(t,.25+i*.04,.42+i*.04,A,B,['--blue','--purple','--gold'][i]);
 if(open)s+=travel(t,.84,.96,R,B,'--coral');
 s+=end(w,475,t<.19?['The source owns writes']:t<.48?['Close admission, drain, then copy']:t<.67?['Validate the closed copy']:t<.81?['Persist destination ownership before opening it']:['Open D; stale source requests remain blocked'],small);
 return svg(s,small,530);
}
export const scenes={
 locks:makeScene('A waiting change can delay later readers',11000,locks,'Reader A retains ACCESS SHARE. Schema change B waits for ACCESS EXCLUSIVE. Later reader C queues behind B. If B times out, C can read alongside A; roll back B’s failed transaction. If A commits, B changes and commits before C proceeds.','Illustrative lock ordering, without an elapsed-time scale.',{defaultVariant:'timeout',actions:[{value:'timeout',label:'Change times out'},{value:'commit',label:'Earlier reader commits'}]}),
 rules:makeScene('A value can be present and still wrong',12000,rules,'The diagnostic mug has price 22.00 and stale hundredths 2000. NOT VALID rules protect new writes while existing rows remain unchecked. Not-null validation passes, agreement validation fails. Repair to 2200, then validate again.','A separate diagnostic state. Enforced and validated are distinct properties.'),
 index:makeScene('Existing, ready, then valid',11500,index,'A concurrent index build first records an invalid definition. After its first build, new writes maintain it. Validation and older-snapshot waits still separate that readiness from validity. Fresh representative queries can test the completed access path.','Conceptual phases of CREATE INDEX CONCURRENTLY; no duration is implied.'),
 recovery:makeScene('Release the blocker, not just a waiter',11000,recovery,'H is idle in a lock-only transaction. Owner rollback or observed session termination releases its lock so W can read. Cancelling H’s query finds no active query. Cancelling W stops the waiter while H remains the blocker; roll back W before reuse.','H has changed no business rows. Check the clients’ actual outcomes.',{defaultVariant:'rollback',choices:[{label:'Intervention',value:'rollback',options:[{value:'rollback',label:'Owner rolls back H'},{value:'cancel-holder',label:'Cancel H’s query'},{value:'cancel-waiter',label:'Cancel W’s query'},{value:'terminate',label:'Terminate H’s session'}]}]}),
 definer:makeScene('Which mapping does the function trust?',11000,definer,'The original login is shop_support; the function runs as shop_lookup. A qualified protected mapping yields tenant 10, excluding customer 4 in tenant 20. An unsafe unqualified name can resolve the caller’s temporary mapping to tenant 20 and disclose Rowan.','The owner can read customer columns; the function must enforce scope. Raising authority does not establish tenant permission.',{defaultVariant:'safe',actions:[{value:'safe',label:'Protected qualified mapping'},{value:'unsafe',label:'Caller-controlled lookup'}]}),
 routing:makeScene('From request keys to data owners',10000,routing,'Mina’s history routes to her customer owner. An order-only request uses a maintained directory to find that owner. Creating purchase 103 also reaches the products owner for guarded stock decrements, requiring one atomic outcome.','Illustrative application placement, omitting replicas and any additional constraint participants.',{defaultVariant:'history',actions:[{value:'history',label:'Mina’s history'},{value:'order',label:'Order 103'},{value:'purchase',label:'Create purchase'}]}),
 move:makeScene('A copy becomes the owner',13000,move,'Close source admission and drain admitted work. Copy and validate group A, including request outcomes. Persist destination ownership at epoch 2, then open D while S stays closed. A crash after the decision leaves a pause; it must not reopen S by default.','One controller and durable, enforced routing authority. Shared product stock stays outside the moved group.')
};
