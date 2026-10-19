/** Bounded workshop teaching models. These functions execute no SQL or network I/O. */
export function bookingHistory({policy='stale', capacity=2, serial=false, step=6}={}) {
  const countOnly=policy==='snapshot'||policy==='serializable';
  const aRead=step>=1?1:null;
  const bRead=step>=2&&!serial&&policy!=='guarded'?1:step>=5?2:null;
  const aPending=step>=3&&step<4;
  const aCommitted=step>=4;
  const bAllowed=bRead!==null&&bRead<capacity;
  const rejected=policy==='serializable'&&!serial&&aCommitted&&step>=6;
  const bCommitted=step>=6&&bAllowed&&!rejected;
  const bookings=['b17',...(aCommitted?['b18']:[]),...(bCommitted?['b19']:[])];
  const counter=countOnly?null:bCommitted?(policy==='guarded'?3:bRead+1):1+Number(aCommitted);
  return {aRead,bRead,aPending,aCommitted,bPending:step===5&&bAllowed,bCommitted,rejected,bookings,counter,oversold:bookings.length>capacity,countOnly};
}
export function lockHistory({opposite=true,step=4}={}) {
  const doneA=step>=4&&!opposite;
  return {holders:{s7:!opposite&&step>=6?'—':doneA?(step>=5?'B':'—'):step>=1?'A':'—',s8:!opposite&&step>=6?'—':opposite?(step>=2?'B':'—'):doneA?'—':step>=3?'A':'—'},
    waits:opposite? [...(step>=3?[['A','B','s8']]:[]),...(step>=4?[['B','A','s7']]:[])]:step>=2&&step<4?[['B','A','s7']]:[],
    cycle:opposite&&step>=4,doneA,doneB:!opposite&&step>=6};
}
export function versions({updates=3,reader=true,cleanup=false}={}) {
  return Array.from({length:updates+1},(_,i)=>({price:20+i*2,version:i+1,current:i===updates,reader:reader&&i===0,reusable:cleanup&&!reader&&i<updates}));
}
export function retry({committed=true,same=true,amount=4000}={}) {
  const conflict=committed&&same&&amount!==4000;
  const newOrder=!conflict&&(!committed||!same);
  return {conflict,newOrder,orders:[...(committed?[{id:'o81',key:'r81',amount:4000}]:[]),...(newOrder?[{id:committed?'o82':'o81',key:same?'r81':'r82',amount}]:[])],answer:conflict?'Conflicting intent: reject replay':committed&&same?'Recover o81; skip business effects':'Claim identity and create purchase'};
}
export function outbox({crash='after-send',dedup=true,attempts=2}={}) {
  const deliveries=crash==='before-send'?Number(attempts>=2):crash==='after-complete'?1:Math.min(2,attempts);
  return {deliveries,effects:dedup?Math.min(1,deliveries):deliveries,complete:crash==='after-complete'||attempts>=2};
}
export function lease({boundary='effect',token=1,current=2}={}) {
  return {accepted:boundary==='effect'?token===current:true,completion:token===current,stale:token!==current};
}
export function recovery({target=1,chain=true,reconcile=false,capacity=2}={}) {
  if(!chain&&target>=2)return {reachable:false,orders:[],missing:['o81','o82'],unresolved:false};
  const orders=[...(target<2?['o81']:[]),...(target>=3?['o82']:[])];
  const unresolved=reconcile&&target<3&&orders.length>=capacity;
  if(reconcile&&target<3&&!unresolved)orders.push('o82');
  return {reachable:true,orders,missing:['o81','o82'].filter(id=>!orders.includes(id)),unresolved};
}
export function replication({received=1,flushed=1,applied=0,route='replica',old=false}={}) {
  flushed=Math.min(flushed,received); applied=Math.min(applied,flushed);
  const barrier=route==='barrier'&&applied<1;
  const visible=route==='primary'?3:old?0:applied;
  return {received,flushed,applied,barrier,visible,found:!barrier&&visible>=1,orders:['o81','o82','o83'].slice(0,visible)};
}
export function fence({fenced=false,promote=true}={}) {
  return {oldWritable:!fenced,newWritable:promote,split:!fenced&&promote};
}
export function backfill({maintained=false,late=true,sweep=false}={}) {
  const rows=[{id:10,old:4000,new:4000},{id:20,old:6000,new:6000}];
  if(late)rows.unshift({id:5,old:7000,new:maintained||sweep?7000:null});
  return {rows,missing:rows.filter(r=>r.new!==r.old).length,cursorRemaining:0,proof:maintained&&rows.every(r=>r.new===r.old)};
}
export function queue({slots=2,hot=false,deadline=120,hold=50}={}) {
  const ends=Array(slots).fill(0); let resource=0;
  return Array.from({length:6},(_,i)=>{const slot=ends.indexOf(Math.min(...ends)); const start=ends[slot]; const lockStart=hot?Math.max(start,resource):start;const finish=lockStart+hold;
    const admitted=finish<=deadline;if(admitted){ends[slot]=finish;if(hot)resource=finish;}
    return {id:i+1,start,lockStart,finish,admitted,slot:slot+1};});
}
export function diagnostic({action='cancel'}={}) {
  const released=action==='rollback'||action==='terminate';
  return {released,holder:released?'—':'A',b:released?'completed':'waiting',a:action==='terminate'?'disconnected':released?'transaction ended':'idle in transaction'};
}
export function access({trusted=false,context='t9',owner=false}={}) {
  const effective=trusted?'t4':context;
  return {effective,rows:owner?[['t4','o81',4000],['t9','o81',9000]]:[[effective,'o81',effective==='t4'?4000:9000]],alter:owner};
}
export function routing({split=false,global=false,hot=70,nodes=3}={}) {
  const records=[['seat s7','A'],['booking b17',split?'B':'A'],['order o81',split?'C':'A'],...(global?[['global request r81','G']]:[])];
  const work=Array(nodes).fill((100-hot)/nodes);work[0]+=hot;
  return {records,owners:[...new Set(records.map(r=>r[1]))],work};
}
export function atomic({step=2,decision='commit',failed=false}={}) {
  const prepared=step>=1;const known=step>=3&&!failed;
  const committed=known&&decision==='commit';
  return {prepared,known,committed,p:committed?2:1,q:committed,pInstalled:committed&&step>=4,qInstalled:committed&&step>=5,pIntent:prepared&&!(known&&(decision==='abort'||step>=4)),qIntent:prepared&&!(known&&(decision==='abort'||step>=5)),blocked:prepared&&!known};
}
export function snapshot({q=15,cut=15,mixed=false,retained=true}={}) {
  const pCut=mixed?25:cut,qCut=mixed?q:cut;
  const ready=qCut<=q&&(retained||Math.min(pCut,qCut)>=20);
  return {pCut,qCut,ready,p:pCut>=20?2:1,order:qCut>=20,coherent:(pCut>=20)===(qCut>=20)};
}
export function placement({layout='111',lost='none',global=false,quota=true}={}) {
  const counts=layout==='21'?[2,1,0]:layout==='221'?[2,2,1]:[1,1,1];
  const majority=Math.floor(counts.reduce((a,b)=>a+b,0)/2)+1;
  const survivors=counts.map((n,i)=>lost==='ABC'[i]?0:n);const live=survivors.reduce((a,b)=>a+b,0);
  const quotaAvailable=quota&&lost!=='C';
  return {counts,survivors,majority,live,quotaAvailable,available:live>=majority&&(!global||quotaAvailable),floor:lost==='A'?null:counts[0]>=majority?1:lost==='B'?90:40};
}
export function movement({tail=0,missDelete=false,acks='BC',generate=20,apply=30}={}) {
  const dest=[['o81',tail>=1?4500:4000,tail>=1?2:1],...((tail<2||missDelete)?[['o82',6000,1]]:[]),...(tail>=3?[['o83',7000,1]]:[])];
  const exact=tail===3&&!missDelete;
  const old=[...acks].filter(x=>'ABC'.includes(x)).length,newVotes=[...acks].filter(x=>'BCD'.includes(x)).length;
  return {dest,exact,old,newVotes,joint:old>=2&&newVotes>=2,drain:apply-generate};
}
export function retention({generate=20,consume=15,minutes=10,budget=12000}={}) {
  const rate=generate-consume;
  const retained=Math.max(0,2000+rate*minutes*60);
  return {rate,retained,free:budget-retained,runway:rate>0?Math.max(0,budget-retained)/rate:null,clearIn:rate<0?retained/-rate:null};
}
