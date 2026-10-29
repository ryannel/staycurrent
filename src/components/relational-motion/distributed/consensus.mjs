import { makeScene,svg,text,line,path,travel,app,server,database,ring,ball,phase,ease,note } from '../drawing.mjs';
import { routes } from '../../relational-rebuild-distribution/model.mjs';
import { connectivity, quorum, backlog } from '../../relational-rebuild-cluster-change/model.mjs';
const W=s=>s?440:760;
const cross=(x,y)=>line(`M${x-17} ${y-17}L${x+17} ${y+17}M${x-17} ${y+17}L${x+17} ${y-17}`,'--coral');
const actions=(values,labels)=>({defaultVariant:values[0],actions:values.map((value,i)=>({value,label:labels[i]}))});
const record=(x,y,filled,label,colour='--blue')=>`<circle cx="${x}" cy="${y}" r="14" fill="${filled?`var(${colour})`:'var(--color-surface)'}" stroke="var(${colour})" stroke-width="1.6" ${filled?'':'stroke-dasharray="3 4"'}/>`+text(x,y+36,label,18);

function routing(t,small,v='history'){
 const w=W(small),A=[w/2,60],G=[w/2,190],positions=[[w*.2,335],[w*.5,335],[w*.8,335],[w*.5,500]],names=['A','B','C','P'],r=routes[v],targets=r.steps[1].active;
 let s=path(A,G)+app(...A)+server(...G,'SQL entry');
 positions.forEach((pos,i)=>{const used=targets.includes(names[i]);s+=path(G,pos,i===3?80:0,used?'--color-text-secondary':'--color-rule-strong')+database(...pos,`Shard ${names[i]}`,'',used?'--teal':'--color-text-secondary');if(used){s+=travel(t,.2,.45,G,pos,i===3?'--gold':'--blue','',i===3?80:0)+travel(t,.57,.78,pos,G,'--teal','',i===3?80:0);}});
 s+=travel(t,.02,.17,A,G,'--coral')+travel(t,.8,.94,G,A,'--teal');
 s+=text(w/2,595,`${targets.length} data ${targets.length===1?'owner':'owners'}`,25);
 if(t>=.94)s+=text(w/2,632,v==='history'?'103 pending · 101 paid':v==='report'?'Tariq £40.00 · Mina £39.50':'One purchase · both owners',small?21:25);
 return svg(s,small,670);
}
export function raft(t,small,v,regional=false){
 const w=W(small),A=[w/2,52],L=[w/2,205],F1=[w*.22,405],F2=[w*.78,405],lost=regional&&v==='down',chosen=lost?F2:F1,applied=t>.68,all=!regional&&t>.94;
 let s=path(A,L)+path(L,F1)+path(L,F2)+app(...A)+server(...L,regional?'West · leader':'R1 · leader')+server(...F1,regional?'North':'R2')+server(...F2,regional?'East':'R3');
 if(lost)s+=cross(...F1);
 s+=travel(t,.02,.12,A,L,'--coral');
 s+=record(L[0]-95,L[1],t>=.15,'Durable');
 s+=text(L[0]+70,L[1]+7,applied?'£22':'£20',23);
 if(!lost)s+=travel(t,.18,.34,L,F1,'--blue');
 s+=travel(t,.18,lost?.48:.9,L,F2,'--blue');
 s+=record(F1[0]-35,F1[1]+82,!lost&&t>.34,'Log');
 s+=record(F2[0]-35,F2[1]+82,t>(lost?.48:.9),'Log');
 s+=text(F1[0]+35,F1[1]+89,all?'£22':lost?'—':'£20',21)+text(F2[0]+35,F2[1]+89,all?'£22':'£20',21);
 s+=travel(t,lost?.5:.37,.61,chosen,L,'--teal');
 s+=travel(t,.72,.83,L,A,'--teal');
 const msg=t<.15?'A new price reaches the leader':t<.61?'Store the command, then acknowledge':t<.68?'Majority known · command committed':t<.84?'Apply the price, then reply':regional?`Remote network contribution ≥ ${lost?90:40} ms`:all?'Followers apply the same history':'Success does not wait for every copy';
 s+=text(w/2,565,msg,small?20:25);
 return svg(s,small,610);
}
function commit(t,small,v){
 const w=W(small),C=[w/2,155],A=[w*.22,380],P=[w*.78,380],refuse=v==='refuse',decision=t>.57,ac=t>.72,pc=t>.85;let s=path(C,A)+path(C,P)+server(...C,'Coordinator')+database(...A,'Orders')+database(...P,'Stock');
 s+=travel(t,.04,.18,C,A,'--blue')+travel(t,.04,.25,C,P,'--gold')+travel(t,.23,.38,A,C,'--teal')+travel(t,.32,.5,P,C,refuse?'--coral':'--teal');
 s+=text(A[0],A[1]-65,ac?(refuse?'Discarded':'Committed'):t>.18?'Prepared':'Provisional',22)+text(P[0],P[1]-65,refuse&&t>.3?'Refused':pc?'Committed':t>.25?'Prepared':'Provisional',22);
 if(decision)s+=ring(C[0],65,'',refuse?'ABORT':'COMMIT',refuse?'--coral':'--teal',46);
 s+=travel(t,.6,.72,C,A,refuse?'--coral':'--teal')+travel(t,.64,.85,C,P,refuse?'--coral':'--teal');
 if(ac&&!refuse)s+=ball(A[0],A[1],'--blue');if(pc&&!refuse)s+=ball(P[0],P[1],'--gold');
 s+=note(w/2,500,t<.57?['Prepared is a promise, not a commit']:refuse?['One refusal → one abort','No order; stock unchanged']:pc?['One purchase committed','Order pending · stock allocated']:['One durable decision','Both owners must honour it'],small);
 return svg(s,small,575);
}
function recovery(t,small,v){
 const w=W(small),rep=v!=='classic',good=v==='replicated',xs=[w*.18,w*.5,w*.82],ys=130,A=[w*.25,370],P=[w*.75,370];let s='';
 if(rep){xs.forEach((x,i)=>{const lost=t>.2&&(i===0||(!good&&i===1));s+=server(x,ys,`D${i+1}`);if(lost)s+=cross(x,ys);s+=text(x,ys+100,i<2||good&&t>.62?'COMMIT':'Earlier',20);});s+=path([xs[1],ys],[xs[2],ys]);if(good)s+=travel(t,.35,.61,[xs[1],ys],[xs[2],ys],'--blue');}
 else{s+=server(xs[1],ys,'Coordinator')+cross(xs[1],ys)+text(xs[1],ys+100,'Log inaccessible',22);}
 s+=database(...A,'Orders',good?'✓':'…')+database(...P,'Stock',good&&t>.86?'✓':'…');
 s+=text(A[0],A[1]-67,good?'Committed':'Prepared',21)+text(P[0],P[1]-67,good&&t>.86?'Committed':'Prepared',21);
 if(good){s+=path([xs[1],ys],P)+travel(t,.68,.86,[xs[1],ys],P,'--teal');}
 else s+=path(A,P,0,'--color-rule-strong');
 s+=note(w/2,510,good?['Recover the established COMMIT','Finish the existing purchase']:['No authoritative outcome','Keep the prepared promises'],small);
 return svg(s,small,585);
}
function purchase(t,small,v){
 const global=v==='global',w=W(small),A=[w/2,65],O=[w*.23,280],S=[w*.77,280],G=[w/2,465];let s=path(A,O)+path(O,S)+app(...A,'App · North')+database(...O,'Orders · North')+database(...S,'Stock · West');
 if(global)s+=path(O,G)+path(S,G)+database(...G,'ID owner · East');
 s+=travel(t,.04,.22,A,O,'--coral')+travel(t,.27,.47,O,S,'--gold');
 if(global)s+=travel(t,.49,.68,O,G,'--purple');
 for(const [i,pos]of [O,S,...(global?[G]:[])].entries()){
  if(t>.25+i*.18){s+=ball(pos[0]-24,pos[1]-70,'--teal')+ball(pos[0],pos[1]-70,'--teal')+`<circle cx="${pos[0]+24}" cy="${pos[1]-70}" r="13" fill="none" stroke="var(--color-text-secondary)"/>`;}
 }
 s+=note(w/2,global?580:430,t>.8?[`${global?'Three':'Two'} owners · separate majorities`,'One recoverable purchase outcome']:['A nearby order still needs remote stock'],small);
 return svg(s,small,global?650:500);
}
function copy(t,small){
 const w=W(small),S=[w*.24,150],D=[w*.76,150],current=t>.32,base=t>.62,applied=t>.88;let s=path(S,D)+database(...S,'Old group',current?'£22':'£20')+database(...D,'Learner',applied?'£22':base?'£20':'—');
 for(let i=0;i<4;i++){const start=.08+i*.1,end=start+.2;s+=travel(t,start,end,S,D,'--blue');if(t>=end)s+=ball(D[0]-45+i*30,285,'--blue');}
 s+=text(w*.76,335,'Base snapshot · £20',21);
 if(current)s+=ball(S[0],285,'--gold')+text(S[0],335,'Later update · £22',21);
 s+=travel(t,.66,.8,[S[0],285],[D[0],390],'--gold');
 if(t>=.8)s+=ball(D[0],390,'--gold')+text(D[0],430,applied?'Applied':'Durable, not applied',20);
 s+=text(w/2,500,t<.62?'Copying the base while writes continue':t<.88?'Base complete ≠ caught up':'Caught up · still no vote',small?21:25);
 return svg(s,small,550);
}
function membership(t,small,v){
 const w=W(small),members=connectivity.find(x=>x.value===v)?.members??connectivity[0].members,stage=Math.min(2,Math.floor(t*3)),q=quorum(stage,members),xs=[w*.18,w*.4,w*.62,w*.84];let s=text(w/2,40,['Old configuration','Joint configuration','New configuration'][stage],26);
 xs.forEach((x,i)=>{s+=server(x,140,`R${i+1}`);if(!members.includes(`R${i+1}`))s+=cross(x,140);});
 [[0,1,2],[0,1,3]].forEach((indices,j)=>{const y=290+j*125,active=j===0?stage<2:stage>0;s+=text(35,y,j?'New group':'Old group',21,'--color-text','start');indices.forEach((i,k)=>s+=record(w*.48+k*45,y-8,members.includes(`R${i+1}`),`R${i+1}`,active?'--teal':'--color-text-secondary'));s+=text(35,y+47,active?`${j?q.newCount:q.oldCount} present · need 2`:'Not required here',20,'--color-text-secondary','start');});
 s+=text(w/2,535,stage===1?'Both majorities are required':q.passes?'Required majority is present':'Required majority is missing',small?22:26);
 return svg(s,small,580);
}
function backlogScene(t,small,v){
 const w=W(small),rate=Number(v)||20,sec=Math.round(t*90),left=backlog(rate,sec),x=35,span=w-70,width=left/840*span;
 let s=text(w/2,50,`${sec} seconds`,25)+text(35,120,'+10 MiB/s arrives',21,'--color-text','start')+text(w-35,120,`${rate} MiB/s replay` ,21,'--color-text','end');
 s+=line(`M35 225H${w-35}`)+`<rect x="35" y="195" width="${width}" height="60" rx="14" fill="var(--blue)" opacity=".5"/>`+text(w/2,325,`${left} MiB still to apply`,29);
 for(let i=0;i<6;i++){const a=i*.13,b=a+.18;s+=travel(t,a,b,[35,150],[35+width,225],'--gold');s+=travel(t,a,b,[35+width,225],[w-35,150],'--teal');}
 s+=note(w/2,420,rate>10?['Only spare replay capacity','reduces the old backlog']:rate===10?['Every replayed byte is replaced','The backlog stays at 600 MiB']:['New work arrives faster','Waiting makes the backlog grow'],small);
 return svg(s,small,490);
}

export const scenes={
 routing:makeScene('The request chooses the owners',10000,routing,'Mina’s history routes to customer shard A. A shop-wide paid-order report routes to A, B and C, including C’s empty result. Purchase 103 involves customer shard A and product shard P in one atomic outcome. Replicas and additional constraint participants are omitted.','Logical owners are not individual machines. Motion shows request dependencies, not native RPC counts.',actions(['history','report','purchase'],['Customer history','Whole-shop report','New purchase'])),
 raft:makeScene('Store. Agree. Apply. Reply.',14000,raft,'A current-term price update reaches the established leader. The leader records it durably, sends it to followers and receives one durable acknowledgement. That majority establishes commitment. The leader applies £22 and replies; followers can still show £20 before catching up.','One illustrative schedule with three fixed voters. Durable log records and applied values are distinct.'),
 regional:makeScene('The remote reply completes the majority',14000,(t,s,v)=>raft(t,s,v,true),'West is leader with one voter per region. It needs a durable acknowledgement from North or East in addition to its own record. North’s assumed round trip is 40 ms; if North is unavailable, East’s is 90 ms. Followers need not have applied the command before acknowledging it.','The stated round trips are network contributions, not predicted SQL latency.',actions(['up','down'],['North available','North unavailable'])),
 commit:makeScene('Two promises, one outcome',16000,commit,'The coordinator asks Orders and Stock to prepare. Prepared work and protection are retained durably. Only after both positive votes can a durable COMMIT be chosen and delivered. A refusal instead requires ABORT and discarding the provisional work. Prepared alone is not committed.','Classic two-phase commit, drawn as an illustrative purchase rather than a measured engine trace.',actions(['ready','refuse'],['Both prepare','Stock refuses'])),
 recovery:makeScene('A lost process does not choose a new outcome',14000,recovery,'Without an accessible coordinator decision, two prepared participants keep their promises. In the replicated case COMMIT was established on D1 and D2: after D1 fails, D2 and D3 recover authority and finish Stock’s prepared work. If only the older D3 remains reachable, absence of COMMIT there does not authorise abort.','The recovery branches are independent failures. Recovery must establish authority, not trust an arbitrary copy.',actions(['classic','replicated','unavailable'],['Inaccessible log','Decision survives','No reachable quorum'])),
 purchase:makeScene('Local orders, remote stock',12000,purchase,'The application in North reaches Orders in North and Stock in West. Each owner has its own three-region group and needs its own majority. Adding a hypothetical globally unique order-ID owner in East adds another required owner. All participants still need one recoverable atomic outcome.','These are dependencies, not a commit-time calculation or a complete message trace.',actions(['ordinary','global'],['Orders and stock','Add global ID owner'])),
 copy:makeScene('The base copy is already behind',14000,copy,'Four chunks of one £20 base snapshot move to a learner while the old group commits £22. The completed base still contains £20. The learner receives the later record durably, then applies it and reaches £22. Catching up alone does not confer a vote.','The learner must keep following agreed history after the base transfer.'),
 membership:makeScene('Replace a voter without splitting authority',11000,membership,'The old configuration is R1 R2 R3; the new is R1 R2 R4. Joint consensus requires a majority of each, not one majority of all four. The controls compare the same communicating voters at three configuration checkpoints. A missing quorum does not authorise advancing the protocol.','Three settled configuration checkpoints; the animation does not enact a blocked reconfiguration.',actions(['all','12','23','14'],['All four','R1 + R2','R2 + R3','R1 + R4'])),
 backlog:makeScene('New work arrives while history drains',10000,backlogScene,'After the base copy, 600 MiB remains and 10 MiB/s continues to arrive. At replay capacity 20 MiB/s the net reduction is 10 and catch-up takes 60 seconds. At 10 the backlog is unchanged; at 8 it grows by 2 MiB/s.','Fixed illustrative rates, not observed copy throughput.',actions(['20','10','8'],['Replay 20 MiB/s','Replay 10 MiB/s','Replay 8 MiB/s']))
};
