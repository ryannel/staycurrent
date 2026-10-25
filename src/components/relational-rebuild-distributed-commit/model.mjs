export const purchase = {
  order: 103, status: 'pending', customer: 1,
  lines: [{number:1, product:'P7', quantity:1, price:'20.00'}, {number:2, product:'P3', quantity:2, price:'4.50'}],
  before: {P7:1, P3:12}, after: {P7:0, P3:10}, total:'29.00', payments:0
};

const state = (a,p,c,explanation,client='No outcome learnt') => ({a,p,c,explanation,client});
export const commitPaths = {
  ready: [
    state('Working','Working','No final decision','A holds provisional order work; P holds provisional guarded stock work. Neither part is committed.'),
    state('Working','Working','No final decision','The coordinator asks both participants to prepare. Sending the requests does not establish readiness.'),
    state('PREPARED','Working','No final decision','A durably retains its order work and protection, then replies Prepared. P has not answered yet.'),
    state('PREPARED','PREPARED','No final decision','P durably retains both guarded decrements and their protection, then replies Prepared. The coordinator now has every required positive vote.'),
    state('PREPARED','PREPARED','COMMIT','The coordinator durably records COMMIT before telling either participant. Both prepared promises must now be honoured.'),
    state('COMMIT','PREPARED','COMMIT','A learns COMMIT and finishes its part. P still retains prepared work; it has not aborted.'),
    state('COMMIT','COMMIT','COMMIT','P learns the same COMMIT and finishes its part. Both owners honour purchase 103.'),
    state('COMMIT','COMMIT','COMMIT','In this model the coordinator replies after both participants finish. Order 103 is pending, stock is P7 = 0 and P3 = 10, and no payment exists.','Purchase committed')
  ],
  refuse: [
    state('Working','Working','No final decision','The same purchase starts with provisional work. This branch will make P refuse preparation; it adds no new shop rows.'),
    state('Working','Working','No final decision','The coordinator asks A and P to prepare, as before.'),
    state('PREPARED','Working','No final decision','A durably prepares and replies. It must retain its promise while the other vote is missing.'),
    state('PREPARED','ABORT','No final decision','P cannot prepare and refuses. It discards its provisional stock work. One refusal rules out commit.'),
    state('PREPARED','ABORT','ABORT','The coordinator durably records ABORT. A’s earlier Prepared reply was a promise, not an independent commit.'),
    state('ABORT','ABORT','ABORT','A learns ABORT and discards its provisional order and lines. Both owners now retain none of the purchase.'),
    state('ABORT','ABORT','ABORT','P already refused; the abort notification changes no stock. This simplified model sends the outcome to both participants.'),
    state('ABORT','ABORT','ABORT','The attempt aborted. Order 103 and its lines are absent, and stock remains P7 = 1 and P3 = 12.','Purchase aborted')
  ]
};

export const recoveryPaths = {
  classic: {
    label:'Classic: outcome inaccessible',
    caption:'One coordinator log is unavailable. A and P can talk, but neither has learnt a final outcome.',
    steps:[
      {process:'Coordinator unavailable',a:'PREPARED',p:'PREPARED',evidence:'Coordinator log inaccessible',voters:[],explanation:'A and P retain prepared work. The coordinator is unreachable, and neither participant has learnt the outcome.'},
      {process:'Coordinator unavailable',a:'PREPARED',p:'PREPARED',evidence:'Both prepared ≠ decision',voters:[],explanation:'A and P exchange their prepared states. That confirms readiness, but not whether the coordinator recorded COMMIT or ABORT.'},
      {process:'Recovery waits',a:'PREPARED',p:'PREPARED',evidence:'No authoritative outcome available',voters:[],explanation:'Silence fits either a chosen COMMIT or a chosen ABORT whose notification was lost. No timer can distinguish them.'},
      {process:'Recovery waits',a:'PREPARED',p:'PREPARED',evidence:'Keep both promises',voters:[],explanation:'The classic blocking case: preserve provisional work and its protection until the outcome can be established. Communication between A and P alone has not resolved it.'}
    ]
  },
  replicated: {
    label:'Replicated: recover COMMIT',
    caption:'A fixed three-voter decision group. COMMIT is already established on D1 and D2 before the coordinating process fails.',
    steps:[
      {process:'Coordinator running',a:'COMMIT',p:'PREPARED',evidence:'COMMIT already established',voters:['COMMIT','COMMIT','Earlier state'],explanation:'The decision group has established COMMIT, durably on D1 and D2. A has learnt it; P has not. The group’s agreement and election rules preserve that decision.'},
      {process:'Coordinator stops · D1 unavailable',a:'COMMIT',p:'PREPARED',evidence:'Decision survives process loss',voters:['Unavailable','COMMIT','Earlier state'],explanation:'The coordinating process and D1 stop. D2 retains COMMIT. D2 and D3 can still form the required quorum, subject to the protocol’s recovery rules.'},
      {process:'Recovery process has authority',a:'COMMIT',p:'PREPARED',evidence:'Authoritative outcome: COMMIT',voters:['Unavailable','COMMIT','COMMIT'],explanation:'The group recovers authority, preserving the established COMMIT and bringing D3 up to date. Recovery learns that outcome through the protocol, not from an arbitrary cached copy.'},
      {process:'Recovery delivers COMMIT → P',a:'COMMIT',p:'COMMIT',evidence:'Complete the existing decision',voters:['Unavailable','COMMIT','COMMIT'],explanation:'P learns COMMIT and finishes its retained stock work. Recovery completes purchase 103; it does not buy again or choose a different outcome.'}
    ]
  },
  unavailable: {
    label:'Replicated: no reachable quorum',
    caption:'An independent failure before either participant learns the established COMMIT. Only the older D3 decision copy remains reachable; no accessible witness can supply the outcome.',
    steps:[
      {process:'Coordinator running',a:'PREPARED',p:'PREPARED',evidence:'COMMIT already established',voters:['COMMIT','COMMIT','Earlier state'],explanation:'COMMIT was established on D1 and D2, but this independent failure will occur before either A or P learns it. Both remain prepared.'},
      {process:'Coordinator stops · D1/D2 unreachable',a:'PREPARED',p:'PREPARED',evidence:'Only one of three voters reachable',voters:['Unavailable','Unavailable','Earlier state'],explanation:'The coordinator and both copies shown with COMMIT are unreachable. D3 has not learnt the decision, and neither participant can supply it.'},
      {process:'Recovery cannot establish authority',a:'PREPARED',p:'PREPARED',evidence:'Old absence is not an abort',voters:['Unavailable','Unavailable','Earlier state'],explanation:'D3’s earlier state does not disprove the established COMMIT. One voter cannot establish current decision authority for this three-voter group.'},
      {process:'Participants wait for authoritative evidence',a:'PREPARED',p:'PREPARED',evidence:'COMMIT remains binding',voters:['Unavailable','Unavailable','Earlier state'],explanation:'A and P retain their promises. When authoritative evidence becomes accessible they must honour COMMIT. An unavailable quorum delays recovery; it does not authorise ABORT.'}
    ]
  }
};
