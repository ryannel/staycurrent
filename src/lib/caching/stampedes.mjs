/** Simultaneous callers and FIFO fixed-duration jobs: illustrative, not a load test. */
export function burstState({callers=12,processes=3,mode='none',duration=500,slots=4,time=0}={}) {
 const jobs=mode==='none'?callers:mode==='local'?Math.min(callers,processes):1;
 const loads=Array.from({length:jobs},(_,id)=>{const start=Math.floor(id/slots)*duration,end=start+duration;return {id,start,end,status:time>=end?'done':time>=start?'active':'queued',progress:Math.max(0,Math.min(1,(time-start)/duration))};});
 const requests=Array.from({length:callers},(_,id)=>{const process=id%processes,job=mode==='none'?id:mode==='local'?process:0;return {id,process,job,done:loads[job].status==='done'};});
 return {loads,requests,jobs,end:Math.ceil(jobs/slots)*duration,completed:requests.filter(r=>r.done).length,active:loads.filter(j=>j.status==='active').length,queued:loads.filter(j=>j.status==='queued').length};
}
export function jitterDeadlines(spread=0,count=60){let seed=58231;return Array.from({length:count},()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return 60-Math.floor(seed/4294967296*(spread+1));});}
export function jitterHistogram(spread=0){const deadlines=jitterDeadlines(spread);return Array.from({length:21},(_,i)=>({time:40+i,count:deadlines.filter(t=>t===40+i).length}));}
export function leaseState(step=0,safe=true){
 const stages=[
  {owner:'None',a:'Not started',b:'Not started',cache:null,message:'A and B both want the same missing answer.'},
  {owner:'A',a:'Loading',b:'Waiting',cache:null,message:'A acquires the lease. B waits rather than duplicating the load.'},
  {owner:'None',a:'Still loading',b:'Waiting',cache:null,message:'A’s lease expires. The source operation has not been cancelled.'},
  {owner:'B',a:'Still loading',b:'Loading',cache:null,message:'B acquires a new lease. Two source operations now overlap.'},
  {owner:safe?'B':'None',a:safe?'Fill rejected':'Saved £12',b:'Loading',cache:safe?null:12,message:safe?'A finishes late. Its token does not match B, so its atomic fill/release is rejected.':'A ignores ownership, saves £12 and deletes B’s lease. The source has already changed.'},
  {owner:'None',a:safe?'Fill rejected':'Saved £12',b:safe?'Saved £15':'Fill rejected',cache:safe?15:12,message:safe?'B still owns the lease. It saves £15 and releases atomically.':'B checks ownership, finds its lease missing and cannot fill. The unsafe old worker left £12.'},
 ];return {...stages[step],step};
}
export function refreshInitial(){return {now:0,source:12,cached:{value:12,observed:0},refresh:null,attempts:0,retryAt:0,waiting:false,reply:'No request yet',message:'The saved price was observed at 0 seconds.'};}
export function refreshPhase(s){const age=s.now-s.cached.observed;return age<10?'fresh':age<20?'stale':'expired';}
export function refreshStep(state,action){const s={...state};
 if(action==='advance'){s.now+=5;if(s.now>=5)s.source=15;s.message=`Time is ${s.now} seconds. The source is £${s.source}.`;}
 else if(action==='read'){
  const phase=refreshPhase(s);
  if(phase==='fresh'){s.waiting=false;s.reply=`£${s.cached.value} at ${s.now} s`;s.message='Return the saved answer within its fresh window.';}
  else {
   s.waiting=phase==='expired';s.reply=s.waiting?`Waiting at ${s.now} s`:`£${s.cached.value} at ${s.now} s`;
   if(!s.refresh&&s.now>=s.retryAt){s.refresh={value:s.source,observed:s.now};s.attempts++;s.message=s.waiting?'The hard age limit has passed. Start one load and wait; do not serve the old copy.':'Return the permitted old answer and start one background refresh.';}
   else s.message=s.waiting?'Do not serve the old copy. Wait within a deadline, or fail if no fresh answer can be obtained.':s.refresh?'Return the permitted old answer; share the refresh already running.':'Return the permitted old answer; retry backoff prevents another refresh yet.';
  }
 }else if(action==='success'){
  if(!s.refresh)return state;
  if(s.now-s.refresh.observed>=20){s.message='The delayed result is already too old. Discard it; do not restart its age at completion.';if(s.waiting)s.reply=`Unavailable at ${s.now} s`;}
  else{s.cached={...s.refresh};s.message=`Save £${s.cached.value}, retaining observation time ${s.cached.observed} s. Loading time is already part of its age.`;if(s.waiting)s.reply=`£${s.cached.value} at ${s.now} s`;}
  s.refresh=null;s.waiting=false;
 }else if(action==='timeout'){
  if(!s.waiting)return state;s.waiting=false;s.reply=`Unavailable at ${s.now} s`;s.message='This waiting request reaches its deadline. The shared source operation, if any, may still be running.';
 }else if(action==='failure'){
  if(!s.refresh)return state;s.refresh=null;s.retryAt=s.now+5;if(s.waiting)s.reply=`Unavailable at ${s.now} s`;s.waiting=false;s.message='Refresh failed. Keep the original age limits; wait five seconds before another attempt. No stale answer is allowed past the hard limit.';
 }else throw new Error('Unknown action');return s;
}
