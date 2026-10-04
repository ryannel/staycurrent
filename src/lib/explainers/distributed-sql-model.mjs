export function rangeWrite({ topology = 'regional', failure = 'none', time = 0, client = 'near' } = {}) {
  const delays = topology === 'regional' ? [1,5,7] : [1,71,131];
  const reachable = failure === 'isolate' ? [true,false,false] : failure === 'one' ? [true,true,false] : [true,true,true];
  const eligible = delays.filter((_,i)=>reachable[i]).sort((a,b)=>a-b);
  const quorumAt = eligible.length >= 2 ? eligible[1] : null;
  const clientRoundTrip = client === 'near' ? 2 : 140;
  const acknowledgedAt = quorumAt === null ? null : quorumAt+clientRoundTrip/2;
  const clientElapsed = quorumAt === null ? null : quorumAt+clientRoundTrip;
  return { clientElapsed, replicas: delays.map((at,i)=>({ name:['A','B','C'][i], region:topology==='regional'?['Stockholm zone 1','Stockholm zone 2','Stockholm zone 3'][i]:['Stockholm','Virginia','Oregon'][i], reachable:reachable[i], at, stored:reachable[i] && time>=at })), quorumAt, acknowledgedAt, committed:quorumAt !== null && time>=quorumAt, acknowledged:acknowledgedAt!==null && time>=acknowledgedAt };
}
export function transferView({ mode = 'atomic', stage = 0, failed = false, recovered = false } = {}) {
  const atomic = mode === 'atomic';
  const committed = atomic ? stage>=3 : stage>=2;
  const aborted = atomic && failed && recovered && !committed;
  const pending = atomic && stage>0 && !committed && !aborted;
  const debit = atomic ? (committed ? 90 : 100) : (stage>=1 ? 90 : 100);
  const credit = atomic ? (committed ? 50 : 40) : (stage>=2 ? 50 : 40);
  return { debit, credit, total:debit+credit, committed, aborted, pending, latestWaits:pending, provisionalDebit:pending && stage>=1, provisionalCredit:pending && stage>=2, coordinator:failed?'offline':'online', canAdvance:!failed && stage<(atomic?3:2) };
}
