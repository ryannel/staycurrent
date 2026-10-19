// Deterministic teaching states, not a trace of engine execution.
const card = (title, lines) => ({ title, lines });
export const kinds = {
  snapshot: {
    title: 'Which address survives a profile change?',
    label: 'Booking keeps',
    options: [['snapshot', 'Agreed details'], ['live', 'Current reference']],
    steps: ['Before confirmation', 'Confirm B11', 'Change the profile', 'Read B11 again'],
  },
  changes: {
    title: 'A request and a committed change are different facts',
    label: 'Retain',
    options: [['states', 'Committed states'], ['requests', 'Requests only'], ['current', 'Current status']],
    steps: ['Create B11', 'Rejected cancellation', 'Cancel successfully', 'Reactivate B11'],
  },
  periods: {
    title: 'Move the question across the rate boundary',
    label: 'Periods',
    options: [['adjacent', 'Meet at 10 Nov'], ['overlap', 'Overlap'], ['gap', 'Gap']],
    steps: ['9 Nov', '10 Nov', '11 Nov', '12 Nov'],
  },
  correction: {
    title: 'One past date, two accounts of what was known',
    label: 'For 11 Nov, ask',
    options: [['then', 'Known on 11 Nov'], ['now', 'Known after correction']],
    steps: ['1 Nov: record €20', '11 Nov: issue report', '12 Nov: enter late change', 'Query 11 Nov again'],
  },
  removal: {
    title: 'Follow B11 after its customer leaves',
    label: 'Leaving means',
    options: [['flag', 'Mark inactive'], ['tombstone', 'Keep minimal identity'], ['archive', 'Move to archive'], ['delete', 'Delete row']],
    steps: ['Before departure', 'Apply policy', 'Read retained booking', 'Reuse membership code'],
  },
};

export function frame(kind, choice, step) {
  if (!kinds[kind] || !kinds[kind].options.some(([v]) => v === choice) || step < 0 || step > 3) throw new Error('Invalid history model input');
  let cards, result, note;
  if (kind === 'snapshot') {
    const confirmed = step >= 1, moved = step >= 2;
    cards = [card('Current profile C7', [moved ? 'Address: 9 Oak Road' : 'Address: 4 Elm Street', 'Used for future contact']),
      card('Booking B11', confirmed ? ['Agreed fee: €20.00', choice === 'snapshot' ? 'Agreed address: 4 Elm Street' : 'Customer reference: C7'] : ['No agreement captured yet'])];
    result = !confirmed ? 'No confirmed booking' : step < 3 ? 'Agreement confirmed on 1 Nov' : choice === 'snapshot' ? 'Original agreement: €20.00, 4 Elm Street' : 'Joined address: 9 Oak Road; original address unavailable';
    note = ['Mina supplies 4 Elm Street. The address is part of this booking’s agreement.',
      choice === 'snapshot' ? 'Confirmation captures the agreed address with the fee. These facts belong to B11.' : 'Confirmation keeps the fee and C7’s identity, but captures no agreed address.',
      'Mina changes her profile to 9 Oak Road. B11 itself receives no amendment.',
      choice === 'snapshot' ? 'The profile join changes future contact. B11 still states the address agreed at confirmation.' : 'Following C7 now returns 9 Oak Road. A stable customer identity has not preserved the agreement’s address.'][step];
  } else if (kind === 'changes') {
    const statuses = ['booked', 'booked', 'cancelled', 'booked'];
    const stateLines = ['#1 booked · 1 Nov 09:00', ...(step >= 2 ? ['#2 cancelled · 2 Nov 10:00'] : []), ...(step >= 3 ? ['#3 booked · 2 Nov 10:00'] : [])];
    const requestLines = ['Book requested', ...(step >= 1 ? ['Cancel requested · rejected'] : []), ...(step >= 2 ? ['Cancel requested'] : []), ...(step >= 3 ? ['Reactivate requested'] : [])];
    cards = [card('Current B11', [`Status: ${statuses[step]}`]), card('Retained history', choice === 'states' ? stateLines : choice === 'requests' ? requestLines : ['None'])];
    result = choice === 'states' ? `Latest committed state: ${statuses[step]}` : choice === 'requests' ? 'Requests alone do not establish resulting state' : step === 3 ? 'Booked again; earlier cancellation is unavailable' : 'Only the latest stored result is available';
    note = ['The first record establishes a starting state. Later records are complete resulting statuses.',
      'The cancellation request fails validation. No cancellation becomes a committed state.',
      'A later cancellation succeeds. The status change and its history record belong to the same transaction.',
      'Reactivation succeeds within the same displayed second. Per-booking revisions order the committed states; the timestamp alone cannot.'][step];
  } else if (kind === 'periods') {
    const day = 9 + step;
    const end = choice === 'overlap' ? 12 : 10, start = choice === 'gap' ? 12 : 10;
    const matches = [...(day < end ? ['€20.00'] : []), ...(day >= start ? ['€22.00'] : [])];
    cards = [card('Version 1 · €20.00', [`1 Nov ≤ date < ${end} Nov`, day < end ? 'MATCH' : 'Does not match']), card('Version 2 · €22.00', [`${start} Nov ≤ date; no end`, day >= start ? 'MATCH' : 'Does not match'])];
    result = `${day} Nov: ${matches.length} ${matches.length === 1 ? 'version' : 'versions'}${matches.length ? ` — ${matches.join(' and ')}` : ' — no rate defined'}`;
    note = choice === 'adjacent' ? day === 10 ? 'The old version excludes 10 Nov. The new version includes it. Exactly one row answers at the handover.' : 'Inclusive starts and exclusive ends give one matching version throughout this covered period.' : choice === 'overlap' ? day < 12 && day >= 10 ? 'Both versions claim this date. Choosing the newest row would hide a contradictory stored account.' : 'The overlap ends at 12 Nov because version 1 excludes that date.' : day >= 10 && day < 12 ? 'Neither version claims this date. Preventing overlap does not require continuous coverage.' : 'This date is covered. Test the dates between versions as well.';
  } else if (kind === 'correction') {
    const corrected = step >= 2;
    const earlierSelected = step === 3 && choice === 'then';
    const effective = corrected && !earlierSelected ? ['€20: 1 Nov ≤ date < 10 Nov', '€22: 10 Nov onwards'] : ['€20: 1 Nov onwards'];
    const recorded = !corrected ? ['€20 recorded on 1 Nov'] : step === 3
      ? earlierSelected ? ['Cutoff: 11 Nov', 'Selected: old assertion', 'Recorded: 1 Nov until 12 Nov 10:00Z'] : ['Cutoff: after 12 Nov 10:00Z', 'Selected: replacement', 'Recorded: from 12 Nov 10:00Z']
      : ['Old assertion: until 12 Nov 10:00Z', 'Replacement: from 12 Nov 10:00Z'];
    cards = [card(step === 3 ? 'Effective time · selected account' : 'Effective time', effective), card('Recorded account', recorded)];
    result = step < 3 ? step === 1 ? 'Report issued on 11 Nov: €20.00' : corrected ? 'Corrected rate for 11 Nov: €22.00' : 'Current recorded rate: €20.00' : choice === 'then' ? 'For 11 Nov, known on 11 Nov: €20.00' : 'For 11 Nov, known after correction: €22.00';
    note = ['The system records a €20 rate, with no known effective end.',
      'The 11 Nov report uses the information then recorded. No €22 rate is known yet.',
      'On 12 Nov at 10:00 UTC, staff learn that €22 applied from 10 Nov. The old assertion is superseded, not erased.',
      choice === 'then' ? 'Hold effective date at 11 Nov and select the earlier recorded account. The earlier €20 answer remains explainable.' : 'Hold effective date at 11 Nov and select the replacement account. The corrected answer is €22.'][step];
  } else {
    const changed = step >= 1;
    const profiles = { flag: ['C7: inactive', 'Name and code M007 retained'], tombstone: ['C7: departed', 'Name and code removed'], archive: ['Stable C7 identity retained', 'Profile and M007 moved to archive'], delete: ['C7 deletion rejected', 'B11 still references C7'] };
    cards = [card('Customer storage', changed ? profiles[choice] : ['C7: active', 'Mina · code M007']),
      card('Booking storage', ['B11 → C7', 'Agreed fee: €20.00', 'Agreement snapshot: separately retained'])];
    result = !changed ? 'B11 joins C7 once' : step === 1 ? choice === 'delete' ? 'RESTRICT keeps the referenced row' : 'Policy changes where or how C7 is found' : step === 2 ? ({flag:'Unfiltered join still exposes Mina',tombstone:'Join preserves B11 with a departed-customer label',archive:'B11 still finds C7; its old profile needs archive access',delete:'Deletion failed; the original join still returns Mina'})[choice] : ({flag:'Ordinary unique code still blocks a second M007',tombstone:'M007 can be reassigned; C7 itself must never be reused',archive:'Live-only uniqueness cannot see archived M007',delete:'Rejected deletion has released no code'})[choice];
    note = ['The model starts with one customer, a retained booking and an ordinary unique membership code.',
      'The removal decision affects the customer profile. It does not automatically erase copied agreement details.',
      'Choose the report’s join and display deliberately. Inactivity is not a foreign-key deletion.',
      'A reused public code must not redirect an old booking. Keep the enduring identity distinct from that code.'][step];
  }
  return { title: kinds[kind].steps[step], cards, result, note };
}
