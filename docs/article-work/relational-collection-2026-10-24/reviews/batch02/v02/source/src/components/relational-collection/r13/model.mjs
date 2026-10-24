// Illustrative schedules, corroborated separately by the native worksheet.
// These are logical snapshots and decisions, not physical page/lock pictures.
export const models = {
  snapshots: {
    title:'Which snapshot answers the second query?',
    options:[['rc','Read Committed'],['rr','Repeatable Read']],
    steps:4,
    explain:(mode,step)=>[
      'Before the purchase, P7 has stock 1. The report opens a transaction. Neither report query has run.',
      'The report’s first SELECT reads stock 1 from the committed state before checkout. Read 1 marks that view.',
      'Checkout commits its purchase. The current stock is now 0. The report remains open; its first result does not change.',
      mode==='rc'?'Read Committed takes a new snapshot for the second SELECT. It returns 0, including checkout’s commit.':'Repeatable Read uses the snapshot established by the first query. The second SELECT also returns 1, although checkout has committed stock 0.'
    ][step]
  },
  skew: {
    title:'Two decisions from the same starting state',
    options:[['rr','Repeatable Read'],['serial','Serializable']],
    steps:6,
    explain:(mode,step)=>[
      'Session S502 starts with Ada and Tomas both on duty. At least one instructor must remain.',
      'Both transactions read the two on-duty rows before either changes one. Ada sees Tomas on; Tomas sees Ada on. Each decides that leaving would keep one instructor.',
      'Ada sets her own row off duty and commits. The committed state now has only Tomas on duty. Tomas’s earlier read still says Ada was on.',
      mode==='rr'?'Tomas changes a different row. Repeatable Read permits his update and commit in this schedule. No instructor remains on duty.':'With both transactions Serializable, PostgreSQL rejects Tomas’s transaction in this schedule with SQLSTATE 40001. His change does not commit. Tomas remains on duty.',
      mode==='rr'?'Ada relied on Tomas not having left; Tomas relied on Ada not having left. Both decisions cannot belong to any serial order. The rule is broken.':'Tomas retries the whole transaction with a fresh snapshot and reruns the decision. Only Tomas is on duty now, so he must stay.',
      mode==='rr'?'Two complete transactions and two stable snapshots have produced zero cover. A snapshot is not the same promise as a serial outcome.':'The fresh attempt commits without turning Tomas off. Ada is off, Tomas is on: the same result as Ada leaving first, followed by Tomas deciding to stay.'
    ][step]
  }
};
export function snapshotState(mode,step){return {committed:step>=2?0:1,first:step>=1,second:step>=3,secondOld:mode==='rr',after:step>=2};}
export function dutyState(mode,step){return {ada:step<2,tomas:mode==='rr'?step<3:true,read:step>=1,adaCommit:step>=2,tomasAttempt:step>=3,retry:mode==='serial'&&step>=4,final:step>=5};}
