export const specs = {
 stream: {title:'One order, five replication boundaries', label:'Commit waits for', options:[['local','Writer flush'],['remote_write','Standby write'],['on','Standby flush'],['remote_apply','Standby replay']], initial:'on', steps:['Before the order','Writer flush','Send WAL','Receive WAL','Write WAL','Flush WAL','Replay commit']},
 promotion:{title:'Changing the route does not remove the old writer',label:'Former writer',options:[['fenced','Enforced exclusion'],['reachable','Still accepts writes']],initial:'fenced',steps:['Connection breaks','Inspect candidate','Exclude old writer','Promote candidate','Refresh route','Prove the result']},
 partitions:{title:'A date chooses a local table, under one writer',label:'Incoming change',options:[['late','Late September row'],['future','December row'],['correction','Correct October to November']],initial:'future',steps:['Inspect coverage','Attempt change','Prepare boundary','Apply change','Retire October','Check continuing work']},
 owners:{title:'A tenant key chooses a write owner',label:'Work to route',options:[['tenant','Tenant 7 order'],['report','Report without tenant'],['transfer','Move value between tenants']],initial:'tenant',steps:['Request arrives','Find owners','Read related facts','Commit the change','Check recovery scope']}
};
const card=(name,role,rows,log='',active=false)=>({name,role,rows,log,active});
export function frame(scene,choice,step){
 const s=Math.max(0,Math.min(step,specs[scene].steps.length-1));
 if(scene==='stream'){
  const required={local:1,remote_write:4,on:5,remote_apply:6}[choice];
  const ack=s>=required,visible=s>=6;
  const notes=[
   'The writer and standby both show order 101. Order 103 has not committed.',
   'The writer flushes the commit record. Its own new read sees 103. Only the local policy can reply yet.',
   'The writer sends WAL containing 103. A successful send is not a durable second copy.',
   'The standby receives WAL in memory. Its ordinary query still sees only 101.',
   'The standby writes WAL to its operating system. remote_write can reply; a standby operating-system crash can still lose that unflushed copy.',
   'The standby flushes the commit record. The on policy can reply. Replay is still behind, so 103 is durable here but absent from this new query.',
   'Replay applies the commit. A new standby snapshot sees 103; remote_apply can now reply. An older snapshot is a separate restriction.'
  ];
  return {cards:[card('A · writer','Writes permitted',['101 · paid',...(s>=1?['103 · paid']:[])],s>=1?'103 commit · flushed':'No 103 commit',s===1||s===2),card('B · standby','Read-only queries',['101 · paid',...(visible?['103 · paid']:[])],s<3?'No 103 WAL':s===3?'103 WAL · memory':s===4?'103 WAL · OS write':'103 WAL · flushed',s>=3)],route:s>=2?'A → WAL stream → B':'A → B · stream idle',result:ack?'Client received COMMIT success':'Client still waiting for the selected boundary',note:notes[s],marks:specs.stream.steps.map((label,i)=>({label,on:i<=s})),outcome:visible?'Fresh query: 101, 103':'Standby query: 101 only'};
 }
 if(scene==='promotion'){
  const safe=choice==='fenced',excluded=s>=2&&safe,promoted=s>=3;
  return {cards:[card('A · former writer',excluded?'Stopped; restart prevented':'May still accept writes',['101 · paid','103 · paid',...(!safe&&s>=4?['104 · accepted on A']:[])],excluded?'Exclusion confirmed':'Not reachable from operator',!excluded),card('B · candidate',promoted?'Promoted writer':'Standby; last replay checked',['101 · paid','103 · paid',...(s>=5?['105 · accepted on B']:[])],promoted?'New timeline':'103 commit · replayed',promoted)],route:s<4?'Old pool → A; operator cannot reach A':safe?'New connections → B; old sessions closed':'New connections → B; old pool → A',result:s===2&&safe?'Exclusion confirmed; promotion pending':s<3?'Promotion gate: candidate checked; exclusion still required':safe?'One writable authority · B': 'Two possible writable authorities · unsafe',note:[
   'An operator connection to A fails. That observation alone says nothing about application connections from another network.',
   'B has replayed 103. The operator checks eligibility and the allowed loss; a lag number alone does not prove every acknowledged order survived.',
   safe?'The drill stops A and prevents restart. The service needs an equally enforced exclusion covering every writer path.':'The route will change, but A is still writable. The required exclusion gate has not passed.',
   safe?'B is promoted only after exclusion. Its history now advances independently.':'This deliberately unsafe branch promotes anyway. Promotion does not reach back and disable A.',
   safe?'Discovery is refreshed and old connections are discarded. Fresh writes are admitted to B.':'DNS now selects B, but an old connection still sends 104 to A. Both sides can acknowledge different histories.',
   safe?'A new connection stores 105 on B and reads it there. A stays excluded until a supported rejoin or replacement.':'B accepts 105 while A holds 104. Returning routing to A would hide 105; neither copy is an automatic safe merge.'
  ][s],marks:specs.promotion.steps.map((label,i)=>({label,on:i<=s})),outcome:!safe&&s>=5?'A: 104 · B: 105 · histories diverge':!safe&&s===4?'A accepted 104; B is promoted and may accept separate writes':'Validate data, writer identity and real application connections'};
 }
 if(scene==='partitions'){
  const boundary=choice==='late'?'September':choice==='future'?'December':'November';
  const added=choice==='correction'||s>=2,applied=s>=3,retired=s>=4;
  const oct=choice==='correction'&&applied?[]:['7 · 20 Oct'];
  const nov=['7 · 20 Nov',...(choice==='correction'&&applied?['7 · corrected to 21 Nov']:[])];
  const extra=choice!=='correction'&&added?[card(boundary,'New checked boundary',applied?[choice==='late'?'9 · 30 Sep':'9 · 1 Dec']:[])]:[];
  return {cards:[card('October',retired?'Detached; retained separately':'Attached · 1 Oct ≤ day < 1 Nov',oct,'',!retired),card('November','Attached · 1 Nov ≤ day < 1 Dec',nov,'',true),...extra],route:`Application → one PostgreSQL writer → ${boundary}`,result:s===1&&!added?'Rejected: no partition accepts this date':applied?'Accepted by the matching local table':'Coverage must exist before accepting the row',note:[
   'Both tables belong to the same writer. The primary key is (day, id), so ID 7 can occur on different dates.',
   choice==='correction'?'The corrected date selects November. The destination also has to accept its complete key and constraints.':'September and December are missing. PostgreSQL rejects this insert rather than silently creating a partition.',
   choice==='correction'?'November already exists. The correction can proceed after its row and relationship checks.':'A lifecycle owner prepares the needed boundary with matching schema and checked data. In service, accepting an old date also needs retention approval.',
   choice==='correction'?'The update moves the row from October to November. Changing the date changes physical placement and the composite key.':'The same row now routes to its prepared table. A default partition would have required a different drain and validation procedure.',
   'October is detached only after eligibility, references and continuing-write coverage are checked. Detachment keeps its file and data; it is not erasure.',
   choice==='correction'?'Both ID 7 rows now live in November on different dates. The composite key still does not enforce globally unique id.':'November and the admitted date still route correctly. A new October write would need deliberate rejection or another authorised coverage path.'
  ][s],marks:specs.partitions.steps.map((label,i)=>({label,on:i<=s})),outcome:retired?'Continuing service and detached data need separate validation':'Same service, transaction manager and failure domain'};
 }
 const which=choice==='tenant'?['7']:choice==='report'?['7','8']:['7','8'];
 return {cards:[card('Owner A','Tenant 7 authority',['tenant 7 · orders','tenant 7 · items'],'Own replica and recovery history',which.includes('7')&&s>=1),card('Owner B','Tenant 8 authority',['tenant 8 · orders','tenant 8 · items'],'Own replica and recovery history',which.includes('8')&&s>=1)],route:s===0?'Application → router':choice==='tenant'?'tenant_id 7 → A':choice==='report'?'No tenant key → A + B → combine':'tenant 7 at A ↔ tenant 8 at B',result:choice==='tenant'?'One owner can join and commit this tenant’s work':choice==='report'?'Two owners, two result streams; define the report’s view':'A cross-owner atomic promise needs an explicit mechanism',note:[
  'The routing key is part of the application and database contract. A table name alone cannot identify an owner.',
  choice==='tenant'?'The tenant key selects A. Tenant 7 orders and items are colocated there.':'This request needs both owners. A tenant key cannot make its whole operation local.',
  choice==='tenant'?'A joins orders to items locally. Each reference and uniqueness rule must still express its intended tenant scope.':'Independent owner connections do not by themselves supply a single consistent snapshot across both results.',
  choice==='transfer'?'Two application-managed PostgreSQL databases do not become one transaction through routing. Use a supported distributed transaction contract or redesign the business workflow.':choice==='report'?'Define whether independently fresh results are acceptable, or require the chosen service’s documented consistent read.':'The transaction commits at A. A read replica elsewhere would not remove this write ownership.',
  'Each owner still needs replicas, capacity and recovery. Moving tenant 7 later requires one cutover authority and a documented way to recover its new writes.'
 ][s],marks:specs.owners.steps.map((label,i)=>({label,on:i<=s})),outcome:'Illustrative ownership map; no distributed service was executed'};
}
export const holdMilliseconds=text=>Math.max(2200,Math.ceil(text.trim().split(/\s+/).length/3.3*1000)+1600);
