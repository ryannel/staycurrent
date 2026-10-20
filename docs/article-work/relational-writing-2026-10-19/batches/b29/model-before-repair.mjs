// Deliberately small explanatory states. These figures do not execute PostgreSQL.
const panel=(name,state,detail,fill=0)=>({name,state,detail,fill});
const frame=(title,event,panels,result,note)=>({title,event,panels,result,note});
export const scenes={
 upkeep:{title:'A running vacuum can still leave the backlog',options:[['held','Report keeps its snapshot'],['released','Report finishes before cleanup']],initial:'held'},
 budget:{title:'The rebuild needs room before it saves room',options:[['enough','26 GB available for the change'],['tight','14 GB available for the change']],initial:'enough'},
 upgrade:{title:'The transfer mode changes the return path',options:[['copy','Copy files'],['link','Share files with hard links']],initial:'copy'},
 accept:{title:'The first new order changes what returning would lose',options:[['reject','Validation fails before traffic'],['accept','Validation passes; then a new order']],initial:'reject'},
};
export function frames(scene,choice){
 if(scene==='upkeep'){
  const held=choice==='held';
  const p=(versions,report,free)=>[panel('Table',versions,'Current orders: 4,000. File allocation is separate from version count.'),panel('Report',report,'A repeatable-read snapshot can still need earlier versions.'),panel('Reusable space',free,'Routine vacuum cannot remove a version that is still needed.')];
  return [
   frame('1. The report reads the pending orders','BEGIN ISOLATION LEVEL REPEATABLE READ; SELECT …',p('4,000 current versions','Snapshot held','None from this change'),'The report has an earlier view.','A snapshot is not just an open connection: this transaction has actually read the table.'),
   frame('2. Fulfilment marks all orders paid',"UPDATE orders SET status = 'paid'; COMMIT",p('4,000 current + 4,000 old',held?'Snapshot still held':'Report has ended','Old versions not yet cleaned'),'New requests see paid; the old report could still see pending.','The figure keeps each version until the explicit vacuum step. Other engine cleanup can occur too.'),
   frame('3. Vacuum visits the table','VACUUM (VERBOSE, TRUNCATE false) orders',p(held?'4,000 current + 4,000 retained':'4,000 current',held?'Snapshot still held':'No old report',held?'None of these old versions':'Space for later versions'),held?'4,000 dead but not yet removable.':'4,000 old versions removed.','Starting more cleanup workers cannot make a still-needed version removable.'),
   frame('4. Remove the impediment, then check again',held?'Report ends; run vacuum again':'Observe the completed cleanup',p('4,000 current','Report ended','Old-version space reusable'),'The same heap file can now hold later work.','In the native run, before and after heap size was 1,990,656 bytes. This figure is a model of that mechanism, not live progress.'),
  ];
 }
 if(scene==='budget'){
  const enough=choice==='enough', available=enough?26:14;
  const p=(used,phase)=>[panel('Change allowance',`${available} GB available`,'Already excludes the service’s emergency reserve.',100),panel('Extra allocation',`${used} GB / ${available} GB`,phase,Math.min(100,used/available*100)),panel('Acceptance gate',used>available?'NO-GO':'Within space allowance','Duration, lock and I/O gates must pass separately.')];
  return [
   frame('1. Establish the outcome','Reclaim a measured sparse 20 GB heap',p(0,'Existing allocation is already in the baseline.'),'Expected surviving heap: 8 GB.','All sizes and durations in this figure are invented planning values. They are not native measurements.'),
   frame('2. Keep old storage while writing the replacement','New heap + rebuilt indexes: 8 + 6 GB',p(14,'Old heap and indexes still exist.'),'14 GB extra before releasing old files.','A proposed 12 GB saving is not 12 GB available to fund the operation.'),
   frame('3. Include the retained log and work area','6 GB additional WAL + 2 GB work area',p(22,'Replacement 14 + history 6 + work 2 = 22 GB.'),enough?'4 GB change headroom remains.':'Short by 8 GB: do not start.','A slow archive or replica may extend log retention. A space forecast needs a contingency and an owner.'),
   frame('4. Decide before taking the long lock',enough?'Schedule the rehearsed maintenance window':'Provision room or revise the operation',p(enough?22:0,enough?'Budget admits the operation; keep observing.':'No allocation made because the gate failed.'),enough?'Proceed only if the interruption and load gates also pass.':'Wait, reduce scope, or choose a supported alternative.','The tight branch stops before execution. Cancelling halfway is not a substitute for fitting the peak allocation first.'),
  ];
 }
 if(scene==='upgrade'){
  const link=choice==='link';
  const p=(old,newer,files)=>[panel('Old 17.6 cluster',old,'Uses its own 17.6 binaries; never point them at 18 files.'),panel('New 18.6 cluster',newer,'Created with compatible settings and required libraries.'),panel('Transfer relationship',files,link?'Hard links name the same underlying files.':'Copied files are independent allocations.')];
  return [
   frame('1. Check before changing the service','Run the target version’s pg_upgrade --check',p('Serving rehearsal data','Empty destination','No transfer yet'),'Unsupported regproc column: stop and investigate.','The native preflight rejected the disposable unsupported column. The production response depends on that object’s purpose.'),
   frame('2. Resolve the incompatibility and repeat','The corrected isolated fixture passes --check',p('Stopped after final writes','Stopped and checked','No transfer yet'),'Passing preflight permits the next gate; it does not test application behaviour.','Capture configuration, extensions, exact binaries and recovery inputs before the real shutdown.'),
   frame('3. Transfer under the selected mode',link?'pg_upgrade --link':'pg_upgrade --copy',p(link?'Control file guarded by upgrade':'Original files retained','Catalogues upgraded; files transferred',link?'User data files shared':'User data files copied'),link?'Return path now needs the link-mode procedure.':'Old files remain independently restartable.','The native run used copy mode. Link mode here is the documented comparison, not an executed rehearsal.'),
   frame('4. Start the new cluster for validation','Start 18.6 with ordinary application traffic excluded',p(link?'UNSAFE to start':'Stopped, intact','18.6 started',link?'New server has written shared files':'Independent files'),link?'Use an independent recovery copy if returning is required.':'A failed pre-traffic validation can return to the intact old cluster.','In link mode the decisive file-safety boundary is starting the new server, even before it accepts application writes.'),
   frame('5. Separate file safety from accepted history','Keep traffic excluded until the application gate passes',p(link?'Requires independent restore':'Usable old snapshot','Validating orders 101 and 102',link?'Shared files changed':'Copies now evolve separately'),'After new writes, even a safe old copy is stale.','An old binary is never a downgrade tool for the new data directory. Restoration and later-write handling need a prepared procedure.'),
  ];
 }
 if(scene==='accept'){
  const accept=choice==='accept';
  const p=(old,newer,authority)=>[panel('Intact old copy','101 · 102',old),panel('New copy',newer,'Validate exact facts, relationships and a representative app workflow.'),panel('Traffic gate',authority,'Workers, pools and scheduled jobs follow the same admission decision.')];
  return [
   frame('1. Engine upgrade completes','18.6 reports ready for connections',p('Preserved; stopped','101 · 102','Closed'),'Command completion is the first check.','The native fixture contains two orders totalling 4,000 minor currency units; totals alone cannot establish every fact.'),
   frame('2. Check the expected application state',accept?'Expected two orders: pass':'Deliberately require three orders: fail',p('Preserved; stopped','101 · 102',accept?'Checks pass':'NO-GO'),accept?'Prepare a controlled return to traffic.':'Keep traffic closed; stop and inspect.','The failing condition is deliberately wrong in the drill. It tests the rejection gate, not discovery of actual upgrade corruption.'),
   frame('3. Act on the gate',accept?'Open the intended new service and record order 103':'Stop new; restart intact old with its own binaries',p(accept?'Still only pre-cutover orders':'Old becomes sole service again',accept?'101 · 102 · 103':'101 · 102',accept?'New accepts work':'Returned before new work'),accept?'New total is 4,500; old remains 4,000.':'Old has all acknowledged fixture work.','Native SQL checks established both branches in sequence. No real customer traffic or client pool was moved.'),
   frame('4. Judge the return path against acknowledged work',accept?'Propose routing back to the old copy':'Keep the failed new copy isolated for diagnosis',p(accept?'Would omit confirmed 103':'Intact old state accepted',accept?'103 exists only here':'No post-cutover orders',accept?'NO-GO for blind reversal':'Old serves the unchanged fixture'),accept?'Do not silently discard order 103.':'Repair the cause and rehearse again before retrying.','Switching back before new writes and restoring after new writes are different procedures. Preserve evidence and reconcile accepted work through the owning live-change method.'),
   frame('5. Establish recovery for the accepted state',accept?'Check new backups, archive chain and dependencies':'Preserve the existing recovery chain',p('Retire only after acceptance',accept?'101 · 102 · 103':'101 · 102',accept?'New state needs recovery coverage':'Change remains unaccepted'),accept?'Keep the old option until new-state recovery is proved.':'A clean failed change is a useful result.','This drill does not rehearse production backup replacement, archiving or replicas. The restoration and topology owners must supply those checks.'),
  ];
 }
 throw new Error(`Unknown maintenance scene: ${scene}`);
}
