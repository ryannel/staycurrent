import { makeScene,svg,text,line,path,travel,app,server,database,ring,ball,phase,ease,note } from '../drawing.mjs';
const W=s=>s?440:760;
const actions=(values,labels)=>({defaultVariant:values[0],actions:values.map((value,i)=>({value,label:labels[i]}))});
const cross=(x,y)=>line(`M${x-15} ${y-15}L${x+15} ${y+15}M${x-15} ${y+15}L${x+15} ${y-15}`,'--coral');
const pill=(x,y,value,c='--blue',width=92)=>`<rect x="${x-width/2}" y="${y-23}" width="${width}" height="46" rx="23" fill="var(--color-surface)" stroke="var(${c})" stroke-width="1.6"/>`+text(x,y+7,value,22);
function route(t,small,v,locality=false){
 const w=W(small),A=[65,220],G=[w*.48,220],D=[w-70,220],local=v==='West';let s=path(A,G)+path(G,D)+app(...A)+server(...G,locality?`${local?'West':'North'} gateway`:'Gateway')+database(...D,locality?'West · home':'Leaseholder','£20');
 if(!locality)s+=text(G[0],G[1]+91,'Node 4',18)+text(D[0],D[1]+98,'Node 2',18);
 s+=travel(t,.04,.2,A,G,'--coral')+travel(t,.27,.5,G,D,'--blue')+travel(t,.6,.76,D,G,'--teal')+travel(t,.79,.94,G,A,'--teal');
 s+=note(w/2,65,locality?['Products lives in West',local?'Gateway and owner share a region':'The current read crosses regions']:['The key identifies its range','Routing goes to the serving owner'],small);
 s+=text(w/2,355,t>.94?'The same £20 answer returns':locality?'A nearby copy is not enough':'The gateway need not hold this range',small?21:25);
 return svg(s,small,405);
}
function raft(t,small){
 const w=W(small),L=[w/2,140],A=[w*.2,370],B=[w*.8,370],commit=t>.58,applied=t>.72,all=t>.95;let s=path(L,A)+path(L,B)+server(...L,'Node 2 · leader')+server(...A,'Node 1')+server(...B,'Node 3');
 const positions=[L,A,B],durable=[t>.12,t>.34,t>.88];positions.forEach((p,i)=>{s+=pill(p[0],p[1]+104,i===0?applied?'£22':'£20':all?'£22':'£20',i===0||all?'--teal':'--color-text-secondary');if(durable[i])s+=ball(p[0]-44,p[1],'--blue');});
 s+=travel(t,.16,.34,L,A,'--blue')+travel(t,.37,.58,A,L,'--teal')+travel(t,.76,.88,L,B,'--blue');
 s+=text(w/2,40,commit?'Command committed':'Awaiting a durable majority',24);
 s+=note(w/2,550,applied?['Applied state follows agreement','Transaction commit has its own protocol']:['A durable command is not yet applied'],small);
 return svg(s,small,625);
}
function storage(t,small){
 const w=W(small),M=[w*.24,115],L=[w*.76,115],A=[w*.24,325],B=[w*.76,325],C=[w*.5,525],written=t>.15,flushed=t>.49,merged=t>.88;
 let s=path(M,L)+path(M,B)+path(A,C)+path(B,C)+ring(...M,'Memtable',written&&!flushed?'22':'','--teal',37)+database(...L,'Local WAL',written?'22':'');
 s+=pill(...A,'20','--blue')+text(A[0],A[1]+55,merged?'Retired file A':'File A',20);
 if(flushed)s+=pill(...B,'22','--gold')+text(B[0],B[1]+55,merged?'Retired file B':'New file B',20);
 s+=travel(t,.02,.15,[M[0],25],M,'--gold')+travel(t,.16,.29,M,L,'--gold')+travel(t,.33,.49,M,B,'--gold');
 if(t>.61)s+=travel(t,.63,.87,A,C,'--blue')+travel(t,.63,.87,B,C,'--gold');
 if(merged)s+=pill(C[0],C[1],'22 · 20','--teal',135)+text(C[0],C[1]+55,'Replacement file C',21);
 s+=text(w/2,655,t<.3?'Write to memory and the local WAL':t<.6?'Flush a new sorted file':'Compaction rewrites sorted contents',small?21:25);
 return svg(s,small,700);
}
function split(t,small,v){
 const w=W(small),xs=[w*.18,w*.5,w*.82],cut=t>.3,moved=t>.6,lease=t>.8,N2=[w*.25,340],N4=[w*.75,340];let s=text(w/2,40,'One key always has one owner',25);
 s+=line(`M${xs[0]-35} 180H${xs[2]+35}`);['P3','P7','P9'].forEach((key,i)=>s+=ring(xs[i],180,'',key,i?'--gold':'--blue',28));
 if(cut)s+=line(`M${(xs[0]+xs[1])/2} 125V235`,'--color-text-secondary','stroke-dasharray="4 5"');
 s+=server(...N2,'Node 2')+server(...N4,'Node 4')+path(N2,[xs[0],180])+path(lease?N4:N2,[xs[1],180])+path(lease?N4:N2,[xs[2],180]);
 if(moved)s+=text(N4[0],435,lease?'Lease moved':'Copy caught up',21);
 for(let i=0;i<6;i++){const a=.05+i*.14,k=v==='one'?1:i%3;s+=travel(t,a,a+.1,[xs[k],75],[xs[k],180],k===1?'--coral':'--blue');}
 s+=note(w/2,510,t<.3?['One range covers three keys']:t<.6?['Split the key interval','The replicas have not moved yet']:t<.8?['Copy and catch up the right range']:v==='one'?['Every request still needs P7','The split cannot divide that key']:['Independent keys can use two owners'],small);
 return svg(s,small,585);
}
function commit(t,small,v){
 const w=W(small),A=[w/2,45],C=[w/2,190],O=[w*.2,390],S=[w*.8,390],implicit=t>.52,reply=t>.67,clean=t>.9,failed=v==='disappears'&&t>.74;let s=path(A,C)+path(C,O)+path(C,S)+app(...A)+server(...C,'Coordinator')+database(...O,'Order + lines')+database(...S,'Stock');
 if(failed)s+=cross(...C);
 const status=clean?'COMMITTED':t>.2?'STAGING':'PENDING';s+=text(w/2,285,status,24);
 s+=travel(t,.02,.12,A,C,'--coral')+travel(t,.16,.37,C,O,'--blue')+travel(t,.18,.47,C,S,'--gold');
 if(t>.37)s+=ring(O[0],O[1],'','',clean?'--teal':'--blue',18)+ball(O[0],O[1],'--blue');if(t>.47)s+=ring(S[0],S[1],'','',clean?'--teal':'--gold',18)+ball(S[0],S[1],'--gold');
 s+=travel(t,.55,.67,C,A,'--teal');
 s+=note(w/2,510,clean?['Intent cleanup finishes','No purchase runs twice']:failed?['Coordinator gone · commitment survives','Recover the record and listed writes']:reply?['Success returned before cleanup']:implicit?['STAGING + all listed writes','Implicitly committed']:['Required writes must still succeed'],small);
 return svg(s,small,590);
}
function refresh(t,small,v){
 const w=W(small),x1=60,x2=w-60,y=190,changed=v==='changed',scan=x1+(x2-x1)*phase(t,.3,.74);let s=line(`M${x1} ${y}H${x2}`)+ring(x1,y,'t₁','1','--blue',29)+ring(x2,y,'t₂',changed&&t>.48?'0':'1','--teal',29);
 s+=text(w/2,65,'Earlier read: one mug in stock',24);
 if(t>.3&&t<.75)s+=ball(scan,y-48,'--purple');
 if(changed&&t>.48)s+=ball(w*.55,y,'--coral')+text(w*.55,y+78,'A write changes stock',20);
 if(t>.76&&changed)s+=cross(x2,y);
 s+=note(w/2,360,t<.3?['The attempt moves to a later timestamp']:t<.76?['Check the earlier read span']:changed?['The old answer cannot be validated','Retry the operation if required']:['Earlier answer remains valid','Continue without re-running the SQL'],small);
 return svg(s,small,450);
}
function retry(t,small){
 const w=W(small),A=[65,245],D=[w-65,245],failed=t>.35,second=t>.54,success=t>.88;let s=path(A,D)+app(...A)+database(...D,'Database',success?'103':'')+text(w/2,45,'Same request · purchase-103',25);
 s+=travel(t,.04,.18,A,D,'--coral')+travel(t,.22,.35,D,A,'--coral');if(failed&&!second)s+=cross(A[0],A[1])+text(w/2,160,'40001 · discard attempt-local results',small?20:24);
 s+=travel(t,.55,.69,A,D,'--coral')+travel(t,.74,.88,D,A,'--teal');
 s+=note(w/2,370,success?['Commit confirmed · return order 103','Stock changed once']:second?['Fresh transaction','Repeat reads, guards and decisions']:failed?['Bounded backoff','The logical request identity stays']:['Attempt 1 · provisional result'],small);
 return svg(s,small,450);
}
function history(t,small,v){
 const w=W(small),committed=v==='committed',left=w*.22,right=w*.78,commit=t>.46;let s=text(w/2,40,committed?'A snapshot for each statement':v==='historical'?'One fixed historical time H':'One Serializable transaction',small?23:27);
 s+=path([left,160],[right,160])+pill(left,160,'£20','--blue')+pill(right,160,commit?'£22':'—','--gold');
 s+=line(`M${w/2} 100V220`,'--color-text-secondary','stroke-dasharray="4 5"')+text(w/2,260,'Price change commits',21);
 const first=[left,380],second=[right,380];s+=text(first[0],440,'First SELECT',21)+text(second[0],440,'Second SELECT',21);
 s+=travel(t,.05,.3,[left,160],first,'--blue')+travel(t,.6,.86,[committed?right:left,160],second,committed?'--gold':'--blue');
 if(t>.3)s+=pill(...first,'£20','--blue');if(t>.86)s+=pill(...second,committed?'£22':'£20',committed?'--gold':'--blue');
 return svg(s,small,490);
}
function follower(t,small,v,detailed=false){
 const w=W(small),L=[w*.22,130],F=[w*.78,130],ready=t>.84,promise=t>.3,durable=t>.58;
 let s=path(L,F)+server(...L,detailed?'Authority':'Leaseholder')+server(...F,'Follower');
 s+=travel(t,.05,.3,L,F,'--purple')+travel(t,.36,.58,[L[0],250],[F[0],250],'--blue');
 s+=text(L[0],250,detailed?'Close 45 · require n8':'Close T · require k',20);
 s+=text(F[0],250,promise?'Promise received':'Promise absent',20);
 s+=line(`M45 330H${w-45}`)+text(45,305,detailed?'Applied n6':'Earlier applied history',20,'--color-text','start')+text(w-45,305,detailed?'n8':'k',20,'--color-text','end');
 const p=phase(t,.65,.84);s+=ball(45+(w-90)*p,330,'--teal');
 s+=text(w/2,405,ready?'Required history applied':durable?'Durable does not yet mean applied':'Still waiting for the required history',small?21:25);
 s+=text(w/2,475,ready?`Can answer at ${detailed?'45':'T'}`:`Cannot answer at ${detailed?'45':'T'} yet`,26);
 return svg(s,small,520);
}
function covering(t,small,v){
 const w=W(small),cover=v==='yes',xs=[w*.2,w*.8],y=[135,250],resultY=485;let s=text(xs[0],45,'Customer index',23)+text(xs[1],45,'Primary rows',23);
 y.forEach((yy,i)=>{const id=i?'101':'103',status=i?'paid':'pending',c=i?'--gold':'--blue';s+=pill(xs[0],yy,id,c)+text(xs[0],yy+45,cover?status:i?'12 Oct':'20 Oct',20);s+=pill(xs[1],yy,id,c)+text(xs[1],yy+45,status,20);if(!cover){s+=path([xs[0]+46,yy],[xs[1]-46,yy])+travel(t,.18+i*.07,.39+i*.07,[xs[0],yy],[xs[1],yy],c);}
 const from=[xs[cover?0:1],yy],to=[w*.35+i*w*.3,resultY];s+=path(from,to,0,'--color-rule-strong')+travel(t,.5+i*.12,.68+i*.12,from,to,c);if(t>.8)s+=pill(...to,id,c)+text(to[0],resultY+50,status,20);
 });
 s+=text(w/2,375,cover?'Status travels with the index entry':'Fetch status by primary key',small?23:27);
 s+=text(w/2,590,'Same result · 103 then 101',24);
 return svg(s,small,630);
}
export const scenes={
 route:makeScene('One lookup, two node roles',10500,route,'The application sends SQL to gateway node 4. Cached range metadata routes the P7 key to the established leaseholder on node 2. Its £20 value returns through the gateway. The gateway need not hold a replica of that range.','One ordinary current-key lookup with usable routing. Internal protocol checks are omitted.'),
 locality:makeScene('The gateway and the table home',10500,(t,s,v)=>route(t,s,v,true),'Products is homed in West. A North gateway routes this ordinary current read to the West leaseholder and receives £20. A West gateway reaches the same owner within West. The database primary region does not override the table home.','Healthy established placement. Same region need not mean the same node.',actions(['North','West'],['North gateway','West gateway'])),
 raft:makeScene('Agreement before every copy applies',13500,raft,'Node 2 is established leader and leaseholder. It durably records a current-term command; node 1 records and acknowledges it. The leader establishes majority commitment, then applies £22 while followers can still show £20. Node 3 later receives the history and both followers apply it.','A range agreement model. These are not the SQL transaction’s complete commit events.'),
 storage:makeScene('A new version travels through storage',15000,storage,'The £22 version enters the memtable and local Pebble WAL. A flush creates new sorted file B; the older £20 remains in file A. Compaction writes replacement file C with both versions, then retires the inputs when safe. Old-version collection is a separate safety decision.','One local storage model. Files are not one per range, and this is not the complete transaction-commit ordering.'),
 split:makeScene('Split the interval, then move its work',14000,split,'One range covers P3 P7 P9. A boundary before P7 creates two ranges without moving them. The right range is copied and caught up on node 4 before safe replacement removes its node 1 copy; its lease then moves. P7 still has one serving authority, even if all demand targets it.','Split, safe replica movement and lease transfer are distinct operations.',actions(['several','one'],['Several hot keys','Only P7 is hot'])),
 commit:makeScene('A committed purchase can still have intents',16000,commit,'Provisional writes share one transaction. STAGING lists the remaining in-flight writes. STAGING plus every required successful write establishes implicit commitment. Success can return before intent cleanup. Even if the coordinator disappears, surviving record and write evidence can establish the same outcome; cleanup never repeats the purchase.','Range replication and transaction commitment solve different parts of this purchase.',actions(['continues','disappears'],['Coordinator continues','Coordinator disappears'])),
 refresh:makeScene('Validate an earlier answer at a later time',11500,refresh,'A Serializable attempt read stock 1 at t1 and must move to t2. If no relevant intervening write invalidates the read span, refreshing validates that answer without re-executing SQL. If stock changed, the old decision cannot continue; 40001 requires a complete retry when automatic retry cannot finish.','Refresh validates earlier reads; a retry actually re-executes work.',actions(['unchanged','changed'],['Read remains valid','Stock changes'])),
 retry:makeScene('A new attempt, the same purchase',13000,retry,'Attempt 1 uses purchase-103 and the fixed basket but receives 40001. Its provisional result is discarded. A bounded retry starts a new transaction with the same request identity, rereads and repeats every guard and decision. In this run enough stock remains; confirmed commit returns order 103.','No payment or email call is repeated inside the retry loop. Another run may instead find insufficient stock.'),
 history:makeScene('Two reads around one price change',11500,history,'The first SELECT sees £20. Another transaction commits £22. A second SELECT in the same Serializable transaction or at fixed historical H still sees £20; Read Committed takes a new statement snapshot and sees £22. Agreed order-line prices are unchanged.','A conceptual schedule; historical H is before the update.',actions(['serializable','committed','historical'],['Serializable','Read Committed','Fixed historical time'])),
 follower:makeScene('The promise and the state must both arrive',13000,follower,'An old version alone cannot establish a complete answer. The follower receives a promise closing T, tied to position k. It still waits until the required replicated history has been applied through k. Only then can this range answer at T; every other range must qualify at that same time.','Symbolic T and k distinguish a timestamp promise from local application progress.'),
 readiness:makeScene('Closed is not yet applied',13000,(t,s,v)=>follower(t,s,v,true),'The read asks for timestamp 45. Closure advances from 35 to 45, tied to n8, while the follower has applied only n6. Even durable n8 is insufficient until it is applied. Both proofs then permit the read, with relevant outcomes resolved in this model.','Timestamps 35 and 45 are distinct from local log positions n6 and n8.'),
 covering:makeScene('Carry the status with the index entry',11500,covering,'The customer-leading index selects orders 103 and 101, newest first. Without stored status it fetches the primary rows by those keys. With STORING(status), the same index entries already carry the answer and no primary fetch is needed. Both return 103 pending then 101 paid.','Logical key movement, not RPC counts. The primary rows remain stored in both cases.',actions(['no','yes'],['Key columns only','Store the status']))
};
