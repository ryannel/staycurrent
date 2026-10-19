export type Frame = { stage: string; left: string[]; right: string[]; note: string };
export type Scene = 'history' | 'retention' | 'budget' | 'repair';
export const scenes = {
 history: { title: 'Full replay and an earlier target', left: 'Replay to the archive end', right: 'Stop before the deletion', options: ['Both archives complete', 'Target archive lacks later WAL'] },
 retention: { title: 'A recovery window needs its starting copy', left: 'What the catalogue lists', right: 'Can day −7 be recovered?', options: ['Keep required base', 'Expire required base'] },
 budget: { title: 'A usable service takes longer than replay', left: 'Completed work', right: '60-minute interruption allowance', options: ['Prepared recovery access', 'Access takes 25 minutes'] },
 repair: { title: 'Recovering old facts without losing new ones', left: 'Isolated earlier state', right: 'Current service and repair decision', options: ['Identifier still absent', 'Identifier reused'] },
} as const;
export function frames(scene: Scene, changed = false): Frame[] {
 if (scene === 'history') return [
  {stage:'Base copy',left:['101 · paid','102 · paid'],right:['101 · paid','102 · paid'],note:'Both restores start from the same base. Order 103 has not been replayed yet.'},
  {stage:'Good order commits',left:['101 · paid','102 · paid','103 · paid'],right:changed?['STOP · required WAL missing']:['101 · paid','102 · paid','103 · paid'],note:changed?'A base that starts successfully cannot cross a missing log segment. The intended target is unproved.':'Replay adds committed order 103 and its item. Both recovered states can now include it.'},
  {stage:'Named restore point',left:['101 · paid','102 · paid','103 · paid'],right:changed?['STOP · target not reached']:['101 · paid','102 · paid','103 · paid','PAUSED · target reached'],note:changed?'The source marker follows order 103’s commit, but this archive cannot reach it. No state at that target has been verified.':'The target was recorded after 103 committed and before the delete. The targeted restore stays here while the other continues.'},
  {stage:'Deletion commits',left:['101 · absent','102 · paid','103 · paid'],right:changed?['STOP · target not reached']:['101 · paid','102 · paid','103 · paid','PAUSED · target reached'],note:changed?'The complete archive replays the deletion. The other restore remains blocked before its target; it supplies no accepted earlier state.':'Continuing replay repeats the committed deletion, including its cascading item deletion. Recovery does not judge whether the command was wanted.'},
  {stage:'Later good order commits',left:['101 · absent','102 · paid','103 · paid','104 · paid'],right:changed?['STOP · target not reached']:['101 · paid','102 · paid','103 · paid','104 · absent'],note:changed?'Full replay includes valid order 104 but still lacks 101. The incomplete archive supplies no accepted target state, so it cannot provide the missing facts for this repair.':'The earlier copy recovers 101 but lacks legitimate later order 104. Neither copy alone is the desired repaired service.'},
 ];
 if (scene === 'retention') return [
  {stage:'Oldest required target: day −7',left:['Base A · day −9','Base B · day −3','WAL · day −9 to today'],right:['Use A, then replay to day −7'],note:'A newer base already contains later changes. The restore needs a base old enough for the chosen target, with its required history.'},
  {stage:'Run retention',left:[changed?'Base A · EXPIRED':'Base A · RETAINED','Base B · day −3','WAL · day −9 to today'],right:[changed?'NO · no suitable base':'YES · A and history retained'],note:changed?'Seven days of target coverage vanished when its starting base expired. Keeping the logs alone did not preserve the promise.':'Retention kept the dependency, even though the base itself is older than the advertised seven-day window.'},
  {stage:'Check recovery access',left:['Copies readable by recovery identity','Keys and catalogue independently usable'],right:[changed?'NO · access cannot replace A':'Eligible for a restore rehearsal'],note:'A complete accessible input set is necessary. Only a rehearsal establishes that these inputs actually restore and fit the service budget.'},
 ];
 if (scene === 'budget') {
  const jobs=[['Retrieve and unlock',changed?25:5],['Provision',8],['Restore files',15],['Replay',6],['Validate',10],['Reconnect and check',5]] as const;
  let total=0;
  return jobs.map(([job,minutes],i)=>{total+=minutes;return {stage:job,left:[`${job} · ${minutes} min`,`${i+1} of 6 stages complete`],right:[`${total} min elapsed`,total>60?`${total-60} min OVER allowance`:`${60-total} min remain`,i===5?'Application checks complete':'Service not yet accepted'],note:i===3?'Replay has finished. Data, permissions, application workflows and connections still need checking.':i===5?'The prepared path totals 49 minutes. Delayed recovery access makes it 69. These are invented planning durations, not results from the tiny native fixture.':'The interruption clock keeps running while this stage completes. Time the whole path in the intended recovery environment.'};});
 }
 return [
  {stage:'Compare both copies',left:['101 · Mina · paid','101 items · lines 1 and 2','104 · absent'],right:[changed?'101 · another customer':'101 · absent','104 · paid · keep'],note:'The earlier state supplies missing evidence. Keep the current state to discover later legitimate work and conflicts.'},
  {stage:'Define repair scope',left:['Order + both dependent lines','Original IDs and business meaning'],right:[changed?'BLOCK · identity conflict':'Candidate · insert missing facts','104 · preserve'],note:changed?'The current identifier belongs to another fact. A primary-key collision is evidence to resolve, not a reason to overwrite.':'A table copy would be too broad. The candidate scope follows the affected order and its relationships.'},
  {stage:'Authorise a guarded correction',left:['Retain source boundary and extracts'],right:[changed?'NO-GO · unresolved identity':'Check current state under coordinated writes','Reconcile fulfilment separately'],note:'This figure stops at the repair decision. The data-change procedure owns guarded execution and reconciliation; restoring SQL rows does not undo external effects.'},
 ];
}
export function readingDelay(frame: Frame, labels = ''): number {
 const visible=[labels,frame.stage,...frame.left,...frame.right,frame.note].join(' ');
 return Math.max(9000, visible.trim().split(/\s+/).length / 3 * 1000 + 3000);
}
