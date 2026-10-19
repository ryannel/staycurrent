// Explicit teaching schedules, not engine execution or migration tooling.
export const scenes = {
  evolution: { title: 'One address, seven stages', steps: ['Before', 'Add', 'Bridge', 'Backfill', 'Reconcile', 'Read', 'Retire'], options: [] },
  race: { title: 'An address edit overtakes a backfill', steps: ['Before', 'Read', 'Edit', 'Attempt', 'Resolve'], options: [['guarded', 'Check source version'], ['blind', 'Write without checking']] },
  move: { title: 'Who may accept the next order?', steps: ['Copy', 'Catch up', 'Pause', 'Boundary', 'Switch', 'New order'], options: [['fenced', 'Fence source writers'], ['routing', 'Change routing only']] },
};
const order = (id, value, note = '') => ({ id: String(id), value, note });
const frame = (left, right, action, note, gate, active = 'right') => ({ left, right, action, note, gate, active });

export function evolution(step) {
  const old = [order(101, '8 Ash Road, York, YO1 1AA'), order(102, '4 Elm Road, York, YO1 2BB'), order(103, 'The old cottage, near York')];
  const parts = [order(101, '8 Ash Road · York · YO1 1AA', 'current'), order(102, '4 Elm Road · York · YO1 2BB', 'current'), order(103, '7 Oak Lane · York · YO1 3CC', 'confirmed by customer')];
  const texts = step === 6 ? old.map(r => order(r.id, 'column removed')) : step >= 4 ? [...old.slice(0, 2), order(103, '7 Oak Lane, York, YO1 3CC')] : old;
  const structured = step === 0 ? old.map(r => order(r.id, 'no columns')) : step < 3 ? old.map(r => order(r.id, 'pending')) : step === 3 ? [parts[0], parts[1], order(103, 'needs review', 'ambiguous input')] : parts;
  const actions = ['A reads and writes text', 'Schema gains nullable address parts and processing state', 'Every writer follows B’s compatibility protocol', 'Worker converts two rows; one cannot be inferred', 'Customer resolves order 103; all rows are accounted for', 'C reads parts; B and C still maintain text', 'C stops maintaining text; old column is removed'];
  const notes = ['One string is the only stored delivery address.', 'Adding space for the new values has not converted an address.', 'B still reads text. Address edits write text, parts or an explicit review state, and a new source version in one transaction. A has drained.', 'Reads still use text. Review state prevents an uncertain parse from being treated as a valid address.', 'Three current structured addresses now match the agreed source and meaning. Before switching reads, every writer must accept only confirmed parts and preserve that condition.', 'Read authority changes only after reconciliation. Old text remains current during the rollback window.', 'The rollback window has closed. A and B are no longer permitted to run. C owns the structured address.'];
  const gates = ['Next: rehearse the schema operation', 'Next: account for every old writer', 'Next: enumerate and convert existing rows', 'STOP read switch: order 103 unresolved', 'Read switch permitted: zero unresolved or stale rows', 'Retirement waits for old consumers and the rollback window', 'Complete: structured representation is authoritative'];
  return frame({ label: 'Legacy delivery_text', rows: texts }, { label: 'Structured address', rows: structured }, actions[step], notes[step], gates[step], step === 6 ? 'left' : 'right');
}

export function race(step, mode = 'guarded') {
  const live = step >= 2 ? '12 Birch Road' : '8 Ash Road';
  const stored = step < 2 ? 'pending' : step >= 3 && mode === 'blind' ? '8 Ash Road' : '12 Birch Road';
  const worker = step < 1 ? 'not read' : step === 4 && mode === 'guarded' ? '12 Birch Road' : '8 Ash Road';
  const version = step >= 2 ? 8 : 7;
  const note = [
    'Order 101 has source version 7. The new representation is still pending.',
    'The worker reads version 7 and calculates parts for 8 Ash Road. It has not written yet.',
    'Mina edits the address. The application commits version 8 with both representations set to 12 Birch Road.',
    mode === 'guarded' ? 'The worker requires source_version = 7. The current version is 8, so zero rows change. This attempt is recorded as a conflict.' : 'The worker writes its old calculation into the new fields. Text says 12 Birch Road; parts say 8 Ash Road. A non-null count would miss this error.',
    mode === 'guarded' ? 'The worker re-reads version 8 and accounts for its current parts. The job can finish without replacing Mina’s edit.' : 'The job reports a conversion, but a new reader sends the parcel to the old address. Reconciliation must find and repair it before the read switch.',
  ][step];
  return frame(
    { label: 'Worker’s calculation', rows: [order(101, worker, step < 1 ? 'waiting' : `based on source version ${step === 4 && mode === 'guarded' ? 8 : 7}`)] },
    { label: 'Committed order 101', rows: [order('text', live, `source version ${version}`), order('parts', stored, stored === live ? 'same address' : stored === 'pending' ? 'not converted' : 'STALE address')] },
    ['Before the batch', 'Worker reads source', 'Application commits an edit', mode === 'guarded' ? 'Conditional write: version 7 still current?' : 'Blind write: ignore current version', 'Inspect the outcome'][step], note,
    step >= 3 ? mode === 'guarded' ? 'Newer edit preserved; conflict must be accounted for' : 'STOP read switch: representations disagree' : 'The worker must not assume its read is still current', step === 1 ? 'left' : 'right');
}

export function move(step, mode = 'fenced') {
  const fenced = mode === 'fenced';
  const source = [order(101, 'paid'), ...(step >= 1 ? [order(102, 'paid')] : []), ...(step >= 5 && !fenced ? [order(103, 'paid', 'late source job')] : [])];
  const destination = [order(101, 'paid'), ...(step >= 3 ? [order(102, 'paid')] : []), ...(step >= 5 ? [order(103, fenced ? 'paid' : 'cancelled', 'destination request')] : [])];
  const notes = ['The consistent starting copy contains order 101. Only the source accepts writes.', 'Order 102 commits after the copy. It must arrive through the change stream before cutover.', fenced ? 'Stop new writes, resolve in-flight outcomes and fence every source writer, including old connections and jobs.' : 'Front-end admission pauses, but an old worker still has permission and a connection to write to the source.', fenced ? 'The source is stable at final boundary F, which includes order 102. The destination has applied F and passed final checks.' : 'The destination has caught up with order 102 at this instant. There is no final source boundary: the old worker can still add changes.', fenced ? 'Refresh connections and enable the destination only after the boundary and acceptance checks pass. Source stays fenced.' : 'Routing sends normal requests to the destination. It has not revoked the old worker’s source write authority.', fenced ? 'Order 103 commits only on the destination. Returning now must preserve it; changing connections back would lose it from service.' : 'Both sides create order 103 with different states. Choosing either database now discards an accepted effect. Routing did not establish exclusive authority.'][step];
  return frame({ label: `Source · ${step >= 2 && fenced ? 'writes fenced' : 'can write'}`, rows: source }, { label: `Destination · ${step >= 4 ? 'can write' : 'copy only'}`, rows: destination }, ['Copy existing orders', 'Carry intervening changes', 'Stop and fence writers', 'Verify the final boundary', 'Switch connections', 'Admit a new order'][step], notes, step < 2 ? 'Source owns writes' : !fenced ? 'UNSAFE: source write authority remains' : step < 4 ? 'No writes admitted during final checks' : 'Destination owns writes; source stays fenced', step < 3 ? 'left' : 'right');
}
export function getFrame(scene, mode, step) {
  const bounded = Math.max(0, Math.min(step, scenes[scene].steps.length - 1));
  return scene === 'evolution' ? evolution(bounded) : scene === 'race' ? race(bounded, mode) : move(bounded, mode);
}
