// Logical steps, not measured scheduling. Each advance is one indivisible Redis operation.
export function raceInitial(mode='plain') {return {mode,value:10,version:0,workers:[{stage:'read',read:null,watch:null},{stage:'read',read:null,watch:null}],events:[],message:'Both workers intend to add one. Choose which worker acts next.'};}
export function raceStep(state,index){
 const s=structuredClone(state),w=s.workers[index],name=index===0?'A':'B';
 if(w.stage==='done')return state;
 if(s.mode==='incr'){s.value++;s.version++;w.stage='done';s.message=`${name}: INCR reads and increments in one command. Redis now holds ${s.value}.`;}
 else if(w.stage==='read'||w.stage==='retry'){
  // WATCH and GET are shown as one teaching step; neither prevents other clients writing.
  w.read=s.value;w.watch=s.version;w.stage='write';s.message=`${name}: ${s.mode==='watch'?'WATCH then ':''}GET returns ${w.read}; local calculation proposes ${w.read+1}.`;
 }else if(s.mode==='watch'&&w.watch!==s.version){w.stage='retry';s.message=`${name}: EXEC aborts because the watched key changed. No write. Retry must read again.`;}
 else{s.value=w.read+1;s.version++;w.stage='done';s.message=`${name}: ${s.mode==='multi'?'MULTI → SET → EXEC writes':s.mode==='watch'?'EXEC commits':'SET writes'} ${s.value}. ${s.workers.every(x=>x.stage==='done')&&s.value===11?'Two intended increments became only one.':''}`;}
 s.events.push({worker:name,value:s.value,text:s.message});return s;
}
export function errorFrame(mode='transaction',step=0){
 const queueError=mode==='queue',script=mode==='script';
 const labels=queueError?['SET first abc','INCR (missing key)','SET last saved']:['SET first abc','INCR first','SET last saved'];
 const statuses=labels.map(()=> 'waiting');let first='absent',last='absent',message='Three operations are ready. Follow what happens to their writes.';
 if(queueError){for(let i=0;i<Math.min(step,3);i++)statuses[i]=i===1?'queue error':'queued';if(step>=4){statuses[0]='discarded';statuses[2]='discarded';message='EXECABORT: the invalid command prevented execution of the whole queue.';}else if(step>0)message=step===2?'Wrong argument count is detected while queuing. No writes have executed.':'Commands are being queued. Stored values have not changed.';}
 else{
  if(step>=1){statuses[0]='written';first='abc';message='The first SET has written abc.';}
  if(step>=2){statuses[1]='runtime error';message=script?'redis.call raises an error. The script stops, but abc remains.':'INCR cannot increment abc. The transaction continues to its next command.';}
  if(step>=3){statuses[2]=script?'not reached':'written';if(!script)last='saved';message=script?'The last SET is never reached. The earlier write is not rolled back.':'The last SET runs despite the earlier error. Both successful writes remain.';}
 }
 return {labels,statuses,first,last,message,max:queueError?4:3};
}
export function scriptSchedule(cost=20){
 const start=5,end=start+cost;let cursor=end;
 const reads=[8,12,16,20].map(arrive=>{const begin=Math.max(cursor,arrive);cursor=begin+1;return {arrive,start:begin,end:cursor};});
 return {start,end,reads};
}
export function guardFrame(change='before',step=0){
 // Redis command interleaving only. No persistence/failover; database independent.
 const frames=[{source:12,generation:'g1',cache:'empty',script:'not started',message:'Worker fetched £12 while generation was g1.'}];
 if(change==='before')frames.push(
  {source:15,generation:'g2',cache:'empty',script:'not started',message:'Source commit and its invalidation have completed: generation g2, cache empty.'},
  {source:15,generation:'g2',cache:'empty',script:'reject',message:'Script compares expected g1 with current g2. It returns 0 without writing.'},
  {source:15,generation:'g2',cache:'empty',script:'finished',message:'The stale fill was refused. Read the source again or leave a miss.'});
 else frames.push(
  {source:12,generation:'g1',cache:'£12',script:'accepted',message:'The script sees g1 and stores £12 with a TTL in one isolated operation.'},
  {source:15,generation:'g1',cache:'£12',script:'finished',message:'The source database now commits £15. Redis has not received invalidation yet.'},
  {source:15,generation:'g2',cache:'empty',script:'finished',message:'Invalidation advances the generation and deletes the copy. The interval before delivery remained stale.'});
 return frames[Math.min(3,Math.max(0,step))];
}
