const s=(coordinator,stock,orders,text)=>({coordinator,stock,orders,text});
const opening=[
 s('No decision','Working','Working','The purchase needs stock changes on A and order 103 with its lines on B. Nothing is committed.'),
 s('Waiting for votes','Prepared','Working','A records its prepared promise durably and replies Yes. Its stock change is still provisional.'),
 s('All Yes; no decision yet','Prepared','Prepared','B also records Prepared and replies Yes. Both can commit, but neither may choose its own outcome now.')
];
const decide=s('Durable COMMIT','Prepared','Prepared','The coordinator records COMMIT durably before announcing it. Recovery must preserve this decision.');
const first=s('Durable COMMIT','Committed','Prepared','A learns COMMIT and finishes. B has not received the decision yet. Prepared is unresolved, not aborted.');
const last=s('Durable COMMIT','Committed','Committed','B learns the same COMMIT and finishes. Order 103 and both stock effects have the same final outcome.');
export const schedules={
 normal:[...opening,decide,first,last],
 prepared:[...opening,s('Unavailable','Prepared','Prepared','The coordinator stops before a decision. Silence gives neither participant permission to abort: the same silence could occur after COMMIT was recorded.'),s('Recovered authority; ABORT','Prepared','Prepared','An authorised recovery process fences the old coordinator and checks its authoritative durable state. In this chosen history it proves no COMMIT was recorded, then records ABORT.'),s('Durable ABORT','Aborted','Aborted','Recovery delivers ABORT to both. The original stock and absence of order 103 remain. This is the alternative aborted history.')],
 decided:[...opening,decide,first,s('Unavailable; COMMIT survives','Committed','Prepared','The coordinator stops after A commits. B must not roll back on a timeout: A cannot undo its final commit.'),s('Recovered durable COMMIT','Committed','Prepared','Recovery reads the authoritative COMMIT decision. It repeats delivery to the unresolved participant.'),last]
};
