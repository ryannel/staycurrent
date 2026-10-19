export type Kind = 'reference' | 'current' | 'lead' | 'overlap';
export type Tone = 'waiting' | 'pass' | 'fail' | 'outside';
export interface Card { label: string; value: string; tone: Tone }
export interface Gate { label: string; answer: string; tone: Tone }
export interface Frame { note: string; cards: Card[]; gates: Gate[]; result: string; bad: boolean; bars?: { label: string; start: number; end: number; tone: Tone }[] }
export interface Param { key: string; label: string; options: [string, string][]; initial: string }
export const figures: Record<Kind, { title: string; params: Param[] }> = {
  reference: { title: 'Two existing identifiers can describe the wrong relationship', params: [
    { key: 'resource', label: 'Reservation uses', initial: '29', options: [['29','Resource 29 · tenant 2'],['21','Resource 21 · tenant 1'],['99','Resource 99 · absent']] },
  ] },
  current: { title: 'Only current rows compete for the external reference', params: [
    { key: 'change', label: 'Change', initial: 'duplicate', options: [['duplicate','Add current R17'],['cancelled','Keep cancelled R17'],['replace','Cancel then replace'],['reactivate','Reactivate old R17']] },
  ] },
  lead: { title: 'A deferred reference still needs a valid final state', params: [
    { key: 'path', label: 'Transaction', initial: 'complete', options: [['complete','Deferred · add lead'],['missing','Deferred · omit lead'],['immediate','Immediate · add lead']] },
  ] },
  overlap: { title: 'All three comparisons must conflict to reject a reservation', params: [
    { key: 'start', label: 'Candidate starts', initial: '10.5', options: [['10.5','10:30'],['11','11:00'],['11.5','11:30']] },
    { key: 'resource', label: 'Resource', initial: '21', options: [['21','21 · same room'],['22','22 · another room']] },
    { key: 'state', label: 'Candidate state', initial: 'confirmed', options: [['confirmed','Confirmed'],['draft','Draft']] },
  ] },
};
export const defaults = (kind: Kind) => Object.fromEntries(figures[kind].params.map(p => [p.key, p.initial]));
const clock = (h: number) => `${Math.floor(h).toString().padStart(2,'0')}:${h % 1 ? '30' : '00'}`;
export function frame(kind: Kind, values: Record<string,string>, step: number): Frame {
  const checked = step >= 2;
  const gate = (label: string, answer: string, pass: boolean, outside = false): Gate => ({label, answer: checked ? answer : 'Not checked yet', tone: !checked ? 'waiting' : outside ? 'outside' : pass ? 'pass' : 'fail'});
  if (kind === 'reference') {
    const resource = Number(values.resource), exists = resource !== 99, same = resource === 21;
    return {
      cards: [
        {label:'Proposed reservation', value:`tenant 1 → resource ${resource}`, tone:'waiting'},
        {label:'Stored resources', value:'(1, 21)   ·   (2, 29)', tone:step >= 1 ? 'pass' : 'waiting'},
      ],
      gates: [gate('Does resource number exist?', exists ? 'Yes' : 'No', exists),gate('Does the complete pair exist?',same ? '(1, 21) exists' : `(1, ${resource}) is absent`,same)],
      result:step < 3 ? 'Awaiting the composite reference check' : same ? 'Accepted: the resource belongs to tenant 1' : 'Rejected: no matching tenant–resource pair',bad:step === 3 && !same,
      note:[`The reservation belongs to tenant 1 and names resource ${resource}. Predict whether a foreign key on the resource number alone would be enough.`,
        'The stored resource keys carry their tenants. Resource 29 exists, but its key is (2, 29), not (1, 29).',
        exists && !same ? 'The individual number passes an existence check. The composite pair fails: the reservation’s tenant must match the resource’s tenant too.' : same ? 'Both checks pass. The database can match the whole (tenant, resource) pair to one stored resource.' : 'Even the resource number is absent. Both the simple existence check and the complete reference fail.',
        same ? 'Store the reservation. Later changes to either side must preserve this pair, or follow the chosen reference action.' : 'Refuse this change. Giving the reservation a new identifier cannot repair the missing relationship.'][step],
    };
  }
  if (kind === 'current') {
    const change = values.change, release = change === 'replace', inactive = change === 'cancelled';
    const current = !inactive, clash = current && !release;
    return {
      cards:[
        {label:'Existing R17 · tenant 1',value:release && step >= 1 ? 'cancelled · leaves current set' : 'confirmed · in current set',tone:release && step >= 1 ? 'outside' : 'pass'},
        {label:change === 'reactivate' ? 'Old cancelled row → confirmed' : 'Candidate R17 · tenant 1',value:inactive ? 'cancelled · outside current set' : 'confirmed · enters current set',tone:inactive ? 'outside' : step >= 2 && clash ? 'fail' : 'waiting'},
      ],
      gates:[gate('Candidate in index predicate?',current ? 'Yes: confirmed' : 'No: cancelled',true,!current),gate('Another current (1, R17)?',inactive ? 'Not compared' : release ? 'No: old row released it' : 'Yes: key already present',!clash,inactive)],
      result:step < 3 ? 'Current set is being determined' : clash ? 'Rejected: two current rows share (1, R17)' : 'Accepted: at most one current (1, R17)',bad:step === 3 && clash,
      note:[change === 'reactivate' ? 'An old cancelled R17 tries to become confirmed while another current R17 exists. The update must obey the same rule as an insert.' : 'R17 already has a confirmed reservation in tenant 1. Choose whether the next row is current, cancelled, or a replacement.',
        release ? 'Cancel the existing row first. It leaves the partial index, although the reservation remains stored.' : inactive ? 'The candidate is cancelled, so it contributes no entry to the current-reference index.' : 'The candidate is confirmed. It needs an entry in the same partial index as the existing row.',
        inactive ? 'The index compares only current rows. Repeated references among cancelled rows are permitted by this policy.' : release ? 'The old row has released (1, R17). The replacement can claim that key in the same transaction.' : 'Both rows would contribute the same key (1, R17). A different reservation ID does not make that key distinct.',
        clash ? 'Reject the insert or reactivation. Keep the existing current reservation unchanged.' : 'Accept the change. Cancelled rows remain identifiable by their own reservation IDs.'][step],
    };
  }
  if (kind === 'lead') {
    const immediate = values.path === 'immediate', missing = values.path === 'missing';
    const reservation = step >= 1 && !immediate, participant = step >= 2 && !missing && !immediate;
    const fails = immediate && step >= 1 || missing && step === 3;
    return {
      cards:[
        {label:'Reservation (1, 17)',value:missing && step === 3 ? 'Commit rejected · no stored row' : reservation ? 'lead → participant 7' : immediate && step >= 1 ? 'INSERT rejected' : 'Not inserted',tone:immediate && step >= 1 || missing && step === 3 ? 'fail' : reservation ? 'pass' : 'waiting'},
        {label:'Participant (1, 17, 7)',value:participant ? 'belongs to reservation 17' : missing ? 'Omitted from this transaction' : immediate && step >= 1 ? 'Transaction aborted' : 'Not inserted yet',tone:participant ? 'pass' : missing && step >= 2 ? 'fail' : 'waiting'},
      ],
      gates:[{label:'Participant → reservation',answer:participant ? 'Parent exists' : immediate && step >= 1 ? 'Never reached' : 'No participant inserted',tone:participant ? 'pass' : 'waiting'}, {label:'Reservation → lead',answer:immediate && step >= 1 ? 'Checked now: missing' : step === 3 ? missing ? 'Checked at commit: missing' : 'Checked at commit: exists' : reservation ? 'Check deferred' : 'No reservation inserted',tone:fails ? 'fail' : step === 3 ? 'pass' : 'waiting'}],
      result:step === 0 ? 'BEGIN: no rows yet' : fails ? immediate ? 'Statement fails; roll back the transaction' : 'COMMIT fails; neither row is committed' : step === 3 ? 'COMMIT succeeds with both references valid' : 'Uncommitted rows in this transaction',bad:fails,
      note:[ 'Both tables start empty. The reservation must name one of its own participants, and that participant must belong to the reservation.',
        immediate ? 'An immediate lead reference checks the first INSERT before a participant exists. The statement fails here; the later intended INSERT cannot repair it.' : 'Insert the reservation naming participant 7. The required lead value is present; only its foreign-key existence check is postponed.',
        immediate ? 'The transaction has failed. Roll back before doing more work; the imagined participant INSERT is never reached.' : missing ? 'Omit the participant. A deferred constraint does not create the missing row for us.' : 'Insert participant 7. Its immediate reference finds reservation 17 in this transaction. Both sides now exist.',
        immediate ? 'The immediate path never reached a valid first statement. Use an appropriate order or defer the particular reference that creates the cycle.' : missing ? 'At COMMIT, the lead reference still has no target. PostgreSQL rejects the transaction; deferral did not weaken the final rule.' : 'At COMMIT, the lead reference resolves to a participant of this reservation. The complete change is accepted.'][step],
    };
  }
  const start = Number(values.start), same = values.resource === '21', active = values.state === 'confirmed', overlap = start < 11;
  const clash = same && active && overlap;
  return {
    cards:[{label:'Existing reservation',value:'tenant 1 · room 21 · confirmed',tone:'pass'}, {label:'Candidate',value:`tenant 1 · room ${values.resource} · ${values.state}`,tone:active ? 'waiting' : 'outside'}],
    gates:[gate('Same tenant and room?',same ? 'Yes: (1, 21)' : 'No: room differs',same,!same),gate('Intervals overlap?',overlap ? 'Yes: shared occupied time' : 'No: boundary or gap',overlap,!overlap),gate('Both confirmed?',active ? 'Yes' : 'No: candidate is draft',active,!active)],
    bars:[{label:'Stored [10:00, 11:00)',start:10,end:11,tone:'pass'},{label:`Candidate [${clock(start)}, ${clock(start+1)})`,start,end:start+1,tone:step >= 2 && clash ? 'fail' : !active ? 'outside' : 'waiting'}],
    result:step < 3 ? 'Compare scope, interval and state' : clash ? 'Rejected: all conflict conditions hold' : 'Accepted by this non-overlap rule',bad:step === 3 && clash,
    note:[ 'The existing confirmed reservation occupies room 21 from 10:00 up to, but not including, 11:00. Change the candidate and predict the result.',
      'Each interval has finite, present bounds and a start before its end. These row checks apply even when a reservation is only a draft.',
      !active ? 'The draft remains outside the exclusion constraint. Confirming it later will have to pass the same comparisons.' : !same ? 'The intervals may overlap, but the rooms differ. The exclusion rule forbids a pair only when every listed comparison is true.' : !overlap ? 'The intervals share no occupied instant. At 11:00, the old reservation has ended, so an adjacent reservation can begin.' : 'Tenant and room are equal, the intervals overlap, and both rows are confirmed. This pair is forbidden.',
      clash ? 'Reject this insert, confirmation or resource change. An availability query may explain the problem earlier; the stored rule makes the acceptance decision.' : 'Accept this candidate under the displayed rule. Current-reference uniqueness and all the other constraints must pass as well.'][step],
  };
}
