const panel=(name,state,detail)=>({name,state,detail});
const frame=(title,a,b,committed,result,note)=>({title,panels:[panel('Session A',...a),panel('Session B',...b),panel('Committed',...committed)],result,note});
export const scenes={
 visibility:{title:'Which commit belongs to the read view?',initial:'rc',options:[['rc','Read Committed'],['rr','Repeatable Read'],['late','Repeatable Read: first read later']],label:'PostgreSQL 18 · illustrative schedule'},
 locking:{title:'An ordinary read is not a reservation',initial:'rc',options:[['rc','PostgreSQL Read Committed: lock'],['rr','PostgreSQL Repeatable Read: lock'],['guard','PostgreSQL Read Committed: guarded update'],['mysql','InnoDB Repeatable Read: mixed reads']],label:'Illustrative schedules · PostgreSQL observed separately; InnoDB documentation only'},
 staffing:{title:'Two stable views, two different rows',initial:'rr',options:[['rr','PostgreSQL Repeatable Read'],['serial','PostgreSQL Serializable']],label:'PostgreSQL 18 · illustrative schedule · one chosen abort victim'},
 predicate:{title:'A read can depend on rows that do not exist yet',initial:'rr',options:[['rr','PostgreSQL Repeatable Read'],['serial','PostgreSQL Serializable']],label:'PostgreSQL 18 · illustrative schedule · counted-ownership variant, no remaining counter'},
 ordering:{title:'Some serial order, or the observed order too?',initial:'serial',options:[['serial','Serial equivalence alone'],['strict','Also respect real-time order']],label:'Hypothetical contract comparison · not a PostgreSQL or InnoDB execution'},
};
export function frames(scene,choice){
 if(scene==='visibility'){
  const rr=choice!=='rc',late=choice==='late';
  return [
   frame('A begins',['BEGIN',late?'No data query yet.':'The first read follows.'],['Idle','No changes.'],['1 place','Class 21 has no reservation.'],'BEGIN is a boundary; the data snapshot comes later.','Choose the later first read to move the snapshot past B’s commit.'),
   frame(late?'A has not read yet':'A reads one',[late?'No snapshot yet':'remaining = 1',rr?'A transaction snapshot will be reused once established.':'This command has its own snapshot.'],['Idle','No changes.'],['1 place','Still available.'],late?'No result has been read.':'Reading one does not reserve it.','An ordinary versioned read does not stop B changing the row.'),
   frame('B takes the place and commits',[late?'Still no data query':'Earlier result: 1','A stays open.'],['COMMIT succeeds','Counter 0 and reservation R1 together.'],['0 places · R1','Capacity still agrees with ownership.'],'B’s committed state has changed.','A’s view is a separate question from what is now committed.'),
   frame('A reads after B’s commit',[rr&&!late?'remaining = 1':'remaining = 0',rr&&!late?'Same transaction snapshot.':'Snapshot includes B’s commit.'],['Finished','R1 is committed.'],['0 places · R1','A has not changed anything.'],rr&&!late?'Stable view; the place is already taken.':'A sees the taken place.',late?'The first data query establishes A’s Repeatable Read snapshot after B commits.':rr?'The repeated value is evidence about the view, not a claim that the place stayed free.':'The new Read Committed statement gets a new view.'),
  ];
 }
 if(scene==='locking'){
  const rr=choice==='rr',my=choice==='mysql',guard=choice==='guard';
  const subject=guard?'UPDATE … WHERE remaining > 0':'SELECT … FOR UPDATE';
  return [
   frame('B reads before the competing change',['Idle','No change yet.'],['Ordinary read: 1','Keep the transaction open.'],['1 place','Class 21 available.'],'B has an observation, not ownership.','The earlier value alone cannot authorise a booking.'),
   frame('A changes the row, without committing',['Pending: 0','A holds the row for its transaction.'],['Earlier read: 1','Ordinary versioned read did not block A.'],['1 place','Uncommitted changes stay out of this count.'],'A’s pending value and the old committed value coexist.','The current writer and ordinary reader are asking different questions.'),
   frame('B tries to acquire the row',['Pending: 0','A still holds the conflicting row lock.'],[subject,'Waiting for A’s outcome.'],['1 place','No new commit yet.'],'B cannot finish this operation while A holds the conflicting lock.','The native PostgreSQL worksheet observes wait_event_type = Lock before allowing A to commit. InnoDB is a documented comparison.'),
   frame('A commits; B is released',['COMMIT succeeds','The place has gone.'],[rr?'40001: abort':guard?'0 returned rows':'Locking read: 0',rr?'B cannot lock the row changed since its snapshot.':guard?'The condition is checked against the updated row.':'B has the current row under this locking operation.'],['0 places','A’s committed change.'],rr?'Rollback and reconsider the whole attempt.':guard?'Do not insert a reservation.':'The earlier ordinary result did not fix the locking result.',rr?'This is PostgreSQL Repeatable Read. A lock request does not refresh that old snapshot.':guard?'A guarded atomic change incorporates the condition instead of writing an earlier calculation.':'This result does not mean every statement in the transaction uses that same view.'),
   frame(my?'B reads ordinarily again':'What the application may conclude',['Finished','Its commit remains.'],[my?'Ordinary read: 1':rr?'New transaction required':guard?'No place taken by B':'Earlier 1, locking result 0',my?'The consistent read keeps its older snapshot.':'Do not use the earlier 1 to accept a booking.'],['0 places','No second reservation accepted.'],my?'InnoDB Repeatable Read can mix old ordinary reads and current locking reads.':'Match the decision to the operation’s contract.',my?'The MySQL 8.4 manual documents this mixed-view behaviour; no MySQL server was run.':'Lock selection and the all-writers protocol are developed in the sibling locking article.'),
  ];
 }
 if(scene==='staffing'){
  const serial=choice==='serial';
  return [
   frame('Two instructors are available',['Not started','Mina may leave only if someone remains.'],['Not started','Tariq has the same rule.'],['Mina ✓ · Tariq ✓','Available count: 2.'],'Invariant: at least one remains available.','Each transaction will read both people and change only itself.'),
   frame('Both read the same two people',['Reads 2','Mina relies on Tariq staying.'],['Reads 2','Tariq relies on Mina staying.'],['Mina ✓ · Tariq ✓','No change committed.'],'Neither read reserves the other person.','A consistent snapshot makes both observations coherent, but does not settle their combined effect.'),
   frame('Each changes a different row',['Mina → unavailable','Pending change; read Tariq’s old true.'],['Tariq → unavailable','Pending change; read Mina’s old true.'],['Mina ✓ · Tariq ✓','Both writes are uncommitted.'],'Read dependencies: A → B and B → A.','A must precede B to read Tariq as available; B must precede A to read Mina as available. No serial order can satisfy both.'),
   frame('A commits first',['COMMIT succeeds','Mina is now unavailable.'],['Tariq change pending','B’s snapshot still includes Mina.'],['Mina × · Tariq ✓','Available count: 1.'],'One departure is compatible with the rule.','The other attempt must not also become an accepted departure under a serialisable contract.'),
   frame('B attempts COMMIT',['Finished','Mina remains unavailable.'],[serial?'40001: abort':'COMMIT succeeds',serial?'The entire Tariq change is discarded.':'Different-row writes did not conflict.'],[serial?'Mina × · Tariq ✓':'Mina × · Tariq ×',serial?'Available count: 1.':'Available count: 0.'],serial?'The invalid combination is rejected.':'Stable snapshots permitted an invalid combination.',serial?'B is the victim in our selected observed run. Other schedules may reject a different attempt or at a different statement.':'Snapshot isolation stops some conflicts, but this dependency cycle is not two writers overwriting one row.'),
   frame(serial?'B starts again, including the read':'Compare with either serial order',['Already left','Mina unavailable.'],[serial?'Reads 1; stays':'Should have seen only 1',serial?'A new decision declines Tariq’s departure.':'The second serial departure must be declined.'],[serial?'Mina × · Tariq ✓':'Mina × · Tariq ×',serial?'Invariant holds.':'Invariant broken.'],serial?'Retry the decision, not merely the rejected write.':'Neither A then B nor B then A permits zero available.',serial?'A successful single attempt may include several statements. Repeat its complete database logic after a known serialisation abort.':'Switch to Serializable to see one permitted way of preventing this combined commit.'),
  ];
 }
 if(scene==='predicate'){
  const serial=choice==='serial';
  return [
   frame('An empty set still informs a decision',['Reads count = 0','WHERE place_id = 21.'],['Reads count = 0','Capacity is one.'],['0 bookings','No remaining counter in this variant.'],'Both decide another booking fits.','There is no existing reservation row for a row-locking read to protect.'),
   frame('Both insert a new matching row',['R1 pending','A changes B’s earlier count result.'],['R2 pending','B changes A’s earlier count result.'],['0 bookings','Neither insertion committed.'],'New rows create the same A → B → A dependency cycle.','A predicate is a condition selecting a set. Its answer can depend on an insertion as well as an update.'),
   frame('Commit the attempts',['R1 committed','A completed first in this schedule.'],[serial?'R2 aborted: 40001':'R2 committed',serial?'B must repeat the capacity decision.':'Both identities and owners were distinct.'],[serial?'1 booking':'2 bookings','Capacity: 1.'],serial?'Serialisable protection covers the read dependency.':'No overwritten row; capacity still exceeded.',serial?'PostgreSQL detects the incompatible dependency rather than reserving empty space with an ordinary row lock.':'The stable ordinary snapshot did not stop either new matching row.'),
  ];
 }
 const strict=choice==='strict';
 return [
  frame('Start from one available place',['Write: remaining = 0','Transaction W takes the place.'],['Read transaction R','R has not started.'],['Initially 1','W is in progress.'],'The next events have an external order.','This figure compares definitions, not the behaviour of a named engine.'),
  frame('W completes before R begins',['W acknowledged','The caller has received success.'],['R begins afterwards','There is no overlap.'],['W completed','The application now asks for the value.'],'Real time requires W before R.','No local timestamp is needed to state this order: one completed before the other began.'),
  frame('Ask which result the contract admits',['W writes 0','W’s effect belongs to the history.'],[strict?'R reads 0':'Suppose R reads 1',strict?'Respects W before R.':'Equivalent serial order: R then W.'],['Serial explanation',strict?'W → R':'R → W'],'The '+(strict?'stronger contract rejects the old result.':'old result has a serial explanation.'),strict?'The extra requirement is that the serial order also respects real-time completion before start.':'Serial equivalence by itself does not rule out that reversed order. This does not claim PostgreSQL permits this history.'),
 ];
}
