// One-second fluid accounting. Homogeneous jobs, constant source capacity, FIFO
// aggregate queue. No abandonment, retries or overload-induced slowdown here.
export function failureFlow({time=0, bounded=false, capacity=100, arrival=1000, hit=95, cold=true}={}) {
  let queued=0,totalHits=0,totalDone=0,totalRejected=0;
  const history=[];
  for(let second=0;second<time;second++) {
    const available=second<2||second>=7;
    const percentage=!available?0:second<7||!cold?hit:Math.min(hit,(second-7)*20);
    const hits=Math.round(arrival*percentage/100),demand=arrival-hits;
    // Admission allows only this second's remaining execution budget; no queue.
    const admitted=bounded?Math.min(demand,Math.max(0,capacity-queued)):demand;
    const rejected=demand-admitted;
    const done=Math.min(capacity,queued+admitted);
    queued+=admitted-done;totalHits+=hits;totalDone+=done;totalRejected+=rejected;
    history.push({second,available,percentage,hits,demand,admitted,rejected,done,queued});
  }
  return {history,queued,totalHits,totalDone,totalRejected,totalArrivals:time*arrival};
}

// Sequential request budget; whole duration is accounted for even when a stage
// reaches the request deadline. Source work is skipped unless its model budget fits.
export function failureDeadline({cacheWait=40,retry=false,deadline=200,source=80,response=10,backoff=20}={}) {
  const stages=[];let elapsed=0;
  const add=(name,wanted)=>{const duration=Math.max(0,Math.min(wanted,deadline-elapsed));stages.push({name,start:elapsed,duration,wanted});elapsed+=duration;return duration===wanted;};
  let finished=add('Cache attempt',cacheWait);
  if(retry&&finished) {finished=add('Backoff',backoff);if(finished)finished=add('Cache retry',cacheWait);}
  const sourceAllowed=finished&&deadline-elapsed>=source+response;
  if(sourceAllowed){add('Source',source);add('Response',response);}
  return {stages,elapsed,remaining:deadline-elapsed,sourceAllowed,deadline};
}
export function retryExpansion(outer=1,inner=1) {
  return {outer,inner,leaves:outer*inner,branches:Array.from({length:outer},(_,i)=>Array.from({length:inner},(_,j)=>({outer:i+1,inner:j+1})))};
}

// Five simultaneous requests per burst. Closed attempts all five before any
// results are observed. Half-open allows one unresolved probe across bursts.
export function breakerInitial() {return {now:0,mode:'closed',retryAt:0,probe:false,probeSourceUsed:0,lastProbe:'none',attempts:0,rows:[],message:'Send five requests while Redis fails. All five are already in flight before failures open the circuit.'};}
export function breakerStep(s,action,outcome='failure') {
  const n={...s,rows:s.rows.map(r=>({...r}))};
  if(action==='advance') {n.now+=3;if(n.mode==='open'&&n.now>=n.retryAt)n.mode='half-open';n.message=n.mode==='half-open'?'The cooldown has elapsed. One probe may run; other requests still need a fallback policy.':'Three seconds pass. Circuit state does not reveal whether cached values exist.';return n;}
  const fallback=(rows)=>{let used=rows.filter(r=>r.result==='source').length;for(const r of rows)if(r.result==='fallback'){r.result=used<2?'source':'rejected';if(r.result==='source')used++;}};
  if(action==='burst') {
    const allowed=n.mode==='closed'?5:n.mode==='half-open'&&!n.probe?1:0;
    n.rows=Array.from({length:5},(_,i)=>({id:i+1,route:i<allowed?'Redis':'bypass',result:i<allowed?(n.mode==='half-open'?'probe':outcome==='hit'?'hit':'fallback'):'fallback'}));
    n.attempts+=allowed;
    if(n.mode==='half-open'&&allowed)n.probe=true;
    else if(n.mode==='closed'&&outcome==='failure'){n.mode='open';n.retryAt=n.now+3;}
    fallback(n.rows);
    if(allowed===1&&n.probe)n.probeSourceUsed=n.rows.filter(r=>r.result==='source').length;
    n.message=allowed===5&&outcome==='failure'?'Five concurrent attempts fail. The three-failure threshold opens the circuit after those calls were sent.':allowed===5&&outcome==='miss'?'Redis replies successfully, but every key is absent. The circuit stays closed; only two source loads are admitted.':allowed===5?'Redis supplies five hits. No source work is needed.':allowed===1?'One probe is in flight. Four callers bypass Redis; the source budget still applies.':'No Redis attempt is allowed. Bypass does not grant unlimited source capacity.';
  }
  if(action==='probe'&&n.probe) {
    n.probe=false;
    if(outcome==='failure'){n.mode='open';n.retryAt=n.now+3;} else n.mode='closed';
    const row=n.rows.find(r=>r.result==='probe');
    // A subsequent burst can replace the displayed batch, but the existing probe
    // remains tracked. Its eventual fallback still requires its own admission.
    n.lastProbe=outcome==='hit'?'hit':n.probeSourceUsed<2?'source':'rejected';
    if(row)row.result=n.lastProbe;
    n.message=outcome==='failure'?'The probe failed. The circuit opens for another cooldown.':outcome==='miss'?'A successful miss closes the circuit. Its batch has already spent its two-load source budget, so the probe caller is refused fallback.':'The probe returned a hit. The circuit closes; this one result does not prove the whole cache is warm.';
  }
  return n;
}
