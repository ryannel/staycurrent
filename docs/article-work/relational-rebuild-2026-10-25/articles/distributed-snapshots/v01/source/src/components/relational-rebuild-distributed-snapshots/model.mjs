export const COMMIT = 40;
export const snapshotCases = {
  mixed: {a:35,p:45,order:'Absent',stock:0,tea:10,text:'A answers at 35; P answers at 45. No order 103, but its stock has gone: the two answers cross commit 40.'},
  before: {a:35,p:35,order:'Absent',stock:1,tea:12,text:'Both owners read at 35. Order 103 is absent; P7 stock is 1 and P3 stock is 12. Neither part of the purchase is included.'},
  after: {a:45,p:45,order:'Pending · 29.00',stock:0,tea:10,text:'Both owners read at 45. Order 103 and its two lines are present; P7 stock is 0 and P3 stock is 10. Both parts are included.'}
};
export const readiness = [
  {closed:35,applied:6,durable:6,answer:false,title:'The chosen time is still open',text:'The read asks for 45. This target knows history is closed only through 35. A transaction provisionally at 38 could still affect the answer. Its outcome or timestamp must be resolved before a complete frontier can pass it.'},
  {closed:45,applied:6,durable:6,answer:false,title:'The promise arrives before its state',text:'The authority closes through 45, tied to required log position n8. The follower has applied only through n6. It cannot yet answer the read, even though it has received the promise.'},
  {closed:45,applied:6,durable:8,answer:false,title:'Durable is still before readable',text:'The required entries through n8 are now durable here. Application remains at n6. A crash could recover the entries, but this read still needs their state applied.'},
  {closed:45,applied:8,durable:8,answer:true,title:'Both proofs now hold',text:'The target has the closure promise through 45 and has applied its required history through n8. Relevant outcomes are resolved in this model. It can now answer at 45, while A must qualify independently.'}
];
export function windowFor(lateRetention=false) {
  const a={low:lateRetention?52:20,high:60},p={low:30,high:50};
  return {a,p,low:Math.max(a.low,p.low),high:Math.min(a.high,p.high)};
}
export function eligibility(t,lateRetention=false) {
  const w=windowFor(lateRetention);
  return { ...w, valid:t>=w.low&&t<=w.high, reason:w.low>w.high?'No common time: retained history on A begins after the safe frontier on P.':t<w.low?'Too old: a required version may have been collected. Waiting for replay cannot restore it.':t>w.high?'Too new for these targets: P is safe only through 50. Wait, choose another qualified copy, or return unavailable.':`Both targets can answer at ${t}. ${t<COMMIT?'Order 103 is absent; P7 stock is 1.':'Order 103 is pending; P7 stock is 0.'}`};
}
