export type Frame = { label:string; narration:string; cards:[string,string,string]; result:string };
export type Variant = { label:string; frames:Frame[] };
export type Scene = { title:string; labels:[string,string,string]; caption:string; variants:Variant[] };
const f=(label:string,narration:string,cards:[string,string,string],result='The operation is still in progress.'):Frame=>({label,narration,cards,result});
export const scenes:Record<string,Scene>={
 gap:{title:'Which failure leaves something missing?',labels:['Order database','Fulfilment receiver','Recovery evidence'],caption:'Illustrative failure schedules. “Accepted” means a receiver accepted the request; it does not mean that the parcel shipped.',variants:[
  {label:'Call before commit',frames:[
   f('Start','The API intends to store order 103 and request fulfilment.',['No committed order','No request','Nothing durable']),
   f('Send fulfilment','The API calls the receiver before committing.',['Order not committed','Request in flight','No durable work record']),
   f('Receiver accepts','The receiver accepts fulfilment independently of the database.',['Order not committed','Accepted: R1','API knows external acceptance']),
   f('Database aborts','The database transaction fails and rolls back.',['No order','Accepted: R1','Database abort confirmed']),
   f('API stops','Returning an error cannot recall the accepted request.',['No order','Accepted: R1','External effect needs reconciliation']),
   f('Inspect the gap','Fulfilment was requested for an order that does not exist.',['No order','Accepted: R1','Repair or cancel externally'],'External acceptance survived database rollback.') ]},
  {label:'Call after commit',frames:[
   f('Start','The API intends to store order 103 and request fulfilment.',['No committed order','No request','Nothing durable']),
   f('Write order','The transaction writes the business change alone.',['Uncommitted order','No request','No durable work record']),
   f('Commit','Order 103 commits; the fulfilment call is next.',['Order 103 committed','No request','Commit confirmed']),
   f('Process exits','The process dies before sending the call.',['Order 103 committed','No request','No work record to discover']),
   f('Restart','A new process has no pending instruction to claim.',['Order 103 committed','No request','Needs a separate repair search']),
   f('Inspect the gap','Commit alone did not remember the remaining work.',['Order 103 committed','No request','Fulfilment never requested'],'A committed order has no recoverable fulfilment instruction.') ]},
  {label:'Call inside transaction',frames:[
   f('Start','The API intends to store order 103 and request fulfilment.',['No committed order','No request','Nothing durable']),
   f('Write order','The API leaves the transaction open for the network call.',['Uncommitted order; locks held','No request','Connection still occupied']),
   f('Receiver accepts','The receiver accepts, but its reply is lost.',['Uncommitted order; locks held','Accepted: R1','API has no external outcome']),
   f('Process exits','The database rolls back its disconnected transaction.',['No order','Accepted: R1','API never saw acceptance']),
   f('Restart','The external request remains even though the local transaction ended.',['No order','Accepted: R1','External lookup needed']),
   f('Inspect the gap','Keeping locks did not enlist the HTTP receiver in commit.',['No order','Accepted: R1','No atomic cross-system outcome'],'An open database transaction cannot roll back an HTTP acceptance.') ]},
  {label:'Commit durable intent',frames:[
   f('Start','The API intends to store order 103 and request fulfilment.',['No committed order','No request','Nothing durable']),
   f('Write both','One transaction writes the order and fulfilment instruction.',['Uncommitted order + work','No request','Same transaction']),
   f('Commit','Both become visible together.',['Order 103 + pending work','No request','Commit confirmed']),
   f('Process exits','The request process dies before doing external work.',['Order 103 + pending work','No request','Instruction survives']),
   f('Worker finds work','Another process can claim the committed instruction.',['Order 103 + claimed work','No request yet','Operation fulfil:103:v1']),
   f('Inspect the boundary','The work is discoverable, but fulfilment is still outstanding.',['Order 103 + claimed work','No request yet','Safe to report accepted; pending'],'Atomic intent closes the forgotten-work gap. External delivery still needs recovery.') ]}
 ]},
 claim:{title:'A lease owns a database transition',labels:['Work record','Worker A','Worker B / receiver'],caption:'Illustrative schedules. The claim uses a database clock. A lease expiring changes eligibility; it does not kill A.',variants:[
  {label:'A completes in time',frames:[
   f('Start','The committed work record is available.',['pending; attempt 0','Ready to claim','B ready to claim']),
   f('A locks and claims','A selects the row and updates it in one short transaction.',['Locked; attempt 1','Claim not yet committed','B skips locked row']),
   f('Claim commits','A returns the database connection before making the call.',['claimed by A; attempt 1','No transaction open','B finds no eligible work']),
   f('Call succeeds','A sends the stable operation identity and receives R1.',['claimed by A; attempt 1','Knows receiver accepted','Receiver accepted: R1']),
   f('Conditional completion','The state, owner, attempt and unexpired lease still match.',['completed; outcome R1','UPDATE returned 1 row','No second claim']),
   f('Inspect ownership','The durable outcome records what R1 meant.',['completed: receiver accepted','Attempt 1 finished','Parcel may still be pending'],'The short claim excluded a competitor without holding locks across HTTP.') ]},
  {label:'A dies after claiming',frames:[
   f('Start','The committed work record is available.',['pending; attempt 0','Ready to claim','B ready to claim']),
   f('A locks and claims','A selects the row and updates it in one short transaction.',['Locked; attempt 1','Claim not yet committed','B skips locked row']),
   f('Claim commits','A now owns attempt 1 until the lease ends.',['claimed by A; attempt 1','Connection returned','B finds no eligible work']),
   f('A exits','A stops before sending the external request.',['claimed by A; attempt 1','Process stopped','Receiver has no request']),
   f('Lease expires','B claims the expired record as a new attempt.',['claimed by B; attempt 2','No longer owner','B may send the same operation']),
   f('Inspect ownership','A committed claim did not hide the work forever.',['claimed by B; attempt 2','Process stopped','Delivery still pending'],'Expiry makes abandoned work claimable again, within the attempt cap.') ]},
  {label:'A is slow beyond lease',frames:[
   f('Start','The committed work record is available.',['pending; attempt 0','Ready to claim','B ready to claim']),
   f('A locks and claims','A selects the row and updates it in one short transaction.',['Locked; attempt 1','Claim not yet committed','B skips locked row']),
   f('Claim commits','A begins a call that takes longer than its lease.',['claimed by A; attempt 1','External call still running','B finds no eligible work']),
   f('Lease expires','B takes over, but A has not stopped executing.',['claimed by B; attempt 2','Old call still running','B can also make a call']),
   f('A returns late','A’s completion carries attempt 1; the database now holds 2.',['claimed by B; attempt 2','UPDATE returned 0 rows','Receiver may have accepted A']),
   f('Inspect ownership','The condition rejects A’s database update, not its external effect.',['claimed by B; attempt 2','Cannot overwrite B’s state','Duplicate handling still required'],'Fencing completion protects this row. The receiver needs its own operation contract.') ]}
 ]},
 repeat:{title:'One operation, two delivery attempts',labels:['Work record','Receiver effect count','Worker evidence'],caption:'Illustrative replay. The deduplicating receiver is assumed to retain a matching request and result for the entire retry interval.',variants:[
  {label:'Receiver deduplicates',frames:[
   f('Start','The work already has a stable operation identity.',['fulfil:103:v1; pending','0 acceptances','No attempt yet']),
   f('A sends attempt 1','The delivery carries fulfil:103:v1 and the original payload.',['claimed; attempt 1','0 acceptances','A sent operation fulfil:103:v1']),
   f('Receiver accepts','The receiver records the identity, matching input and R1 together.',['claimed; attempt 1','1 acceptance: R1','A receives R1']),
   f('A exits before completion','The local record still says claimed. R1 did not reach that row.',['claimed; attempt 1','1 acceptance: R1','New worker does not know R1']),
   f('B sends attempt 2','After expiry B reuses the operation identity, not the attempt identity.',['claimed; attempt 2','1 acceptance: retained R1','Matching repeat returns R1']),
   f('B records the receipt','The conditional update saves R1 with its precise meaning.',['completed: accepted R1','1 acceptance','Database and receiver agree'],'Two requests reached the receiver; its retained operation record suppressed the second effect.') ]},
  {label:'Receiver repeats each request',frames:[
   f('Start','The work already has a stable operation identity.',['fulfil:103:v1; pending','0 acceptances','No attempt yet']),
   f('A sends attempt 1','The delivery carries fulfil:103:v1 and the original payload.',['claimed; attempt 1','0 acceptances','A sent operation fulfil:103:v1']),
   f('Receiver accepts','This receiver has no duplicate-suppression contract.',['claimed; attempt 1','1 acceptance: R1','A receives R1']),
   f('A exits before completion','The local record still says claimed. R1 did not reach that row.',['claimed; attempt 1','1 acceptance: R1','New worker does not know R1']),
   f('B blindly repeats','The same header alone cannot stop a receiver executing again.',['claimed; attempt 2','2 acceptances: R1 and R2','B receives R2']),
   f('Inspect the mismatch','A completed row would not reveal the earlier acceptance.',['Can record completed R2','2 acceptances','Lookup or reconciliation required'],'Blind retry is unsafe for this fulfilment contract. Keep unknown outcomes unresolved.') ]}
 ]},
 meaning:{title:'What can a delayed record reconstruct?',labels:['Committed publication record','Current order','Receiver reconstructs'],caption:'Illustrative payload contract, not a claim that all events must carry full state. The address labels stand for synthetic delivery choices.',variants:[
  {label:'Immutable accepted fact',frames:[
   f('Start','Mina has chosen delivery A for order 103.',['No event yet','Delivery A','Nothing received']),
   f('Commit acceptance','The transaction records E103, OrderAccepted v1, including delivery A.',['E103: accepted with A','Delivery A','Publication pending']),
   f('Delivery changes','A later authorised change updates the order to delivery B.',['E103: accepted with A','Delivery B','Publication pending']),
   f('Publish after delay','The publisher sends the immutable E103 payload.',['E103: accepted with A','Delivery B','Acceptance used delivery A']),
   f('Retry publication','Replaying E103 preserves both its identity and its old fact.',['Same E103 and payload','Delivery B','Must suppress repeated E103 effects']),
   f('Inspect meaning','The event can explain acceptance without pretending to be current state.',['Historic accepted fact','Delivery B now','Acceptance A; current B'],'An immutable fact survives delay. Current-state decisions need a separate rule.') ]},
  {label:'Pointer to current order',frames:[
   f('Start','Mina has chosen delivery A for order 103.',['No event yet','Delivery A','Nothing received']),
   f('Commit pointer','The transaction records only E103 and the order identifier.',['E103: order 103 changed','Delivery A','Publication pending']),
   f('Delivery changes','A later authorised change updates the order to delivery B.',['E103: order 103 changed','Delivery B','Publication pending']),
   f('Publish after delay','The receiver follows the pointer and reads current state.',['E103 points to 103','Delivery B','Reads delivery B']),
   f('Retry publication','A later replay can read an even newer state.',['Same pointer E103','Delivery B or later','Historic A cannot be recovered']),
   f('Inspect meaning','The pointer suits a refresh contract, not reconstruction of acceptance.',['Refresh instruction','Current state only','No evidence of delivery A'],'A pointer can request a refresh. It cannot promise the original accepted payload.') ]}
 ]},
 capture:{title:'Move publication, keep its remaining gap',labels:['Committed outbox','Publisher progress','Receiver'],caption:'Illustrative schedules. Capture position names P1 and P2 are placeholders, not measured WAL positions. No capture connector was executed.',variants:[
  {label:'Poll the outbox',frames:[
   f('Start','No accepted order or publication record exists yet.',['Empty','No claim','Nothing accepted']),
   f('Commit E103','The order and agreed event E103 commit together.',['E103 retained','Next poll can see it','Nothing accepted']),
   f('Discover E103','A worker claims E103 through the relational table.',['E103 retained','Claimed; not completed','Nothing accepted']),
   f('Receiver accepts','The external destination accepts E103.',['E103 retained','Completion not yet saved','E103 accepted']),
   f('Publisher restarts','The process stopped before recording that acceptance.',['E103 still unfinished','Reclaim after expiry','May receive E103 again']),
   f('Inspect progress','A work-state transition settles publication only after its stated acknowledgement.',['E103 available for replay','Needs duplicate-safe retry','Acceptance is not downstream completion'],'Polling exposes unfinished intent. Its completion write still races with process death.') ]},
  {label:'Capture the outbox',frames:[
   f('Start','Initial state must join a correctly bounded stream.',['Empty at snapshot boundary','Saved position P1','Nothing accepted']),
   f('Commit E103','The outbox insertion appears in committed source history.',['E103 retained','Change after P1','Nothing accepted']),
   f('Discover E103','The capture path emits E103 after establishing transaction commit.',['E103 retained','P2 observed, not yet saved','Nothing accepted']),
   f('Receiver accepts','The external destination accepts E103.',['E103 retained','P2 not yet durable','E103 accepted']),
   f('Publisher restarts','The path resumes from its last durable position P1.',['E103 / source history needed','E103 can be emitted again','May receive E103 again']),
   f('Inspect progress','A source position proves progress only through the boundary that saved it.',['Retain replay evidence','P2 does not prove fulfilment','Acceptance is not downstream completion'],'Capture changes discovery. It does not make the receiver atomic with the order transaction.') ]}
 ]}
};
