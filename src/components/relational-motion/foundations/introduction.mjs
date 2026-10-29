import { text,path,travel,svg,app,database,ring,ball,phase,ease,makeScene } from '../drawing.mjs';
import { actions, transactionScenes, colours, labelLines } from './core.mjs';
function tables(t,small){
 const W=small?440:760,C=[W*.22,85],O=[W*.75,85],I=[W*.75,280],P=[W*.22,280];
 let s=path(O,C)+path(O,I)+path(I,P)+ring(...C,'Customer','Mina','--purple')+ring(...O,'Order','103','--coral')+ring(...I,'Order lines','1 · 2','--gold')+ring(...P,'Products','Mug · tea','--blue',51);
 s+=travel(t,.1,.3,O,C,'--purple')+travel(t,.34,.55,O,I,'--gold')+travel(t,.59,.8,I,P,'--blue');
 s+=labelLines(W/2,410,t>.8?['References connect the facts.','Each fact keeps its own home.']:['Follow order 103']);return svg(s,small,485);
}
function join(t,small){
 const W=small?440:760,L=small?65:120,R=W-L,Y=[115,260],done=i=>t>.42+i*.34;let s=text(L,38,'Order lines',23)+text(R,38,'Products',23);
 Y.forEach((y,i)=>{s+=path([L,y],[R,y])+ring(L,y,`Line ${i+1}`,i?'P3':'P7',colours[i],30)+ring(R,y,i?'Green tea':'Blue mug',i?'P3':'P7',colours[i],30);s+=travel(t,.08+i*.34,.42+i*.34,[L,y],[R,y],colours[i]);if(done(i))s+=text(W/2,410+i*40,i?'103 · Green tea × 2 · £4.50':'103 · Blue mug × 1 · £20',small?21:24);});
 return svg(s,small,490);
}
function index(t,small,v){
 const W=small?440:760,A=[W/2,65],xs=[W*.2,W*.5,W*.8],ids=['101','102','103'],hit=[true,false,true];let s=app(...A)+text(W/2,175,v==='index'?'Customer index: Mina → 101, 103':'Check each order',22);
 xs.forEach((x,i)=>{const p=[x,270],start=.2+(v==='index'?(i===2?1:i):i)*.2,visible=v!=='index'||hit[i];s+=ring(x,270,hit[i]?'Mina':'Tariq',ids[i],hit[i]?'--blue':'--color-text-secondary');if(visible){s+=path([W/2,195],p,0,'--color-rule-strong')+travel(t,start,start+.17,[W/2,195],p,hit[i]?'--blue':'--gold');if(t>start+.17)s+=text(x,370,hit[i]?'✓ Match':'Not a match',20);}});
 s+=text(W/2,435,t>.8?'Answer: orders 101 and 103':'Same question, different work',24);return svg(s,small,470);
}
function placement(t,small,v){
 const W=small?440:760,A=[W/2,80],B=[W*.23,285],C=[W*.77,285],rep=v==='replicas';let s=database(...A,'Orders')+path(A,B)+path(A,C)+database(...B,rep?'Copy A':'Portion A')+database(...C,rep?'Copy B':'Portion B');
 [0,1,2].forEach(i=>{const from=[A[0]+(i-1)*18,A[1]+7];s+=ball(...from,colours[i]);const targets=rep?[B,C]:[i===1?C:B];targets.forEach(to=>{s+=travel(t,.12+i*.15,.42+i*.15,from,to,colours[i]);if(t>.42+i*.15)s+=ball(to[0]+(i-1)*18,to[1]+7,colours[i]);});});
 s+=labelLines(W/2,415,rep?['The same rows in both places.']:['Different rows in each place.']);return svg(s,small,470);
}
function recovery(t,small,v){
 const W=small?440:760,A=[65,160],M=[W/2,160],D=[W-75,160],late=v==='late';let s=app(...A)+ring(...M,'Working memory','','--blue')+database(...D,'Durable log',late&&t>.4?'Commit':'')+path(A,M)+path(M,D);
 s+=travel(t,.05,.2,A,M,'--coral');if(late)s+=travel(t,.22,.4,M,D,'--gold');
 if(t>.5)s+=text(M[0],260,'Crash',26)+path([M[0]-22,M[1]-22],[M[0]+22,M[1]+22],0,'--coral')+path([M[0]+22,M[1]-22],[M[0]-22,M[1]+22],0,'--coral');
 if(t>.72)s+=labelLines(W/2,360,late?['Recovery keeps the whole purchase.','The app still received no reply.']:['Recovery keeps no purchase.','The app received no reply.']);
 return svg(s,small,460);
}
export const scenes={
 tables:makeScene('One purchase, four kinds of fact',8500,tables,'Order 103 names customer Mina. Its two lines name the blue mug and green tea. The references connect four kinds of record without copying the customer name into each order.','The order, its lines, its customer and its products remain separate facts.'),
 join:makeScene('Two matches, two result rows',10000,join,'Line one matches product P7, the blue mug; line two matches P3, green tea. Each match adds one named order line to the result. Product names come from products; quantities and agreed prices come from the order lines.','The original rows stay in place. Matching creates result rows.'),
 purchase:transactionScenes.purchase,
 race:transactionScenes.stock,
 index:makeScene('The same answer by two routes',8500,index,'A table scan visits orders 101, 102 and 103, retaining Mina’s 101 and 103. A customer index directs the lookup to those two matches. This illustrates logical row access, not measured page reads.','A real planner may prefer a scan for a table this small.',actions([['scan','Table scan'],['index','Customer index']])),
 recovery:makeScene('Commit and reply are separate',9500,recovery,'A purchase is prepared in memory. A crash before its durable commit leaves no accepted purchase. A crash after the durable commit preserves the whole purchase even when the caller did not receive the reply.','Normal local durability and surviving reliable storage are assumed.',actions([['early','Before durable commit'],['late','After durable commit']])),
 placement:makeScene('Copying data and dividing data',8000,placement,'Replication puts copies of the same records in two places. Sharding places different portions in each place. Each shard can itself be replicated.','These are invented placements, not a replication or placement protocol.',actions([['replicas','Two copies'],['shards','Two portions']]))
};
