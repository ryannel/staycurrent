// Deterministic design examples. These do not execute SQL or simulate a database.
export const scenarios = {
  ownership: {
    title: 'Where can the service change live?', number: 1,
    choices: [['mixed', 'Service details on each line'], ['split', 'Service catalogue and booked lines']],
    causes: [['rename', 'Correct KIT’s name'], ['insert', 'Advertise MAP before any booking'], ['delete', 'Delete the last TEA line']],
    steps: ['Starting facts', 'Requested change', 'Stored change', 'Read the result'],
  },
  reconstruction: {
    title: 'Which split remembers who booked what?', number: 2,
    choices: [['safe', 'Keep the service key on each line'], ['unsafe', 'Keep only the tenant in common']],
    steps: ['Original lines', 'Project the proposed tables', 'Join the shared columns', 'Compare with the original'],
  },
  advisers: {
    title: 'A lossless split can move a rule out of reach', number: 3,
    choices: [['original', 'Assignment triples'], ['split', 'Adviser catalogue and assignments']],
    steps: ['Two services for B11', 'Try a second adviser for KIT', 'Check each table', 'Read B11’s KIT assignments'],
  },
  sets: {
    title: 'Is a facility–language pair itself a fact?', number: 4,
    choices: [['independent', 'Languages apply to every facility'], ['correlated', 'Languages belong to particular facilities']],
    causes: [['two', 'Two languages'], ['empty', 'No supported languages']],
    steps: ['What the venue promises', 'Project facilities and languages', 'Join the two sets', 'Compare availability'],
  },
  total: {
    title: 'Two additions and one stored subtotal', number: 5,
    choices: [['overwrite', 'Read, calculate, overwrite'], ['atomic', 'Protected atomic changes'], ['lag', 'Refresh later']],
    steps: ['Two active lines', 'A plans +€3', 'B plans +€5', 'A commits', 'B commits', 'Reader asks', 'Reconcile from source', 'Publish rebuilt result'],
  },
};

const box = (title, rows) => ({ title, rows });
const row = (text, state = '') => ({ text, state });
const money = value => `€${value.toFixed(2)}`;

export function frame(kind, choice, cause, step) {
  if (kind === 'ownership') {
    const split = choice === 'split';
    const changed = step >= 2;
    const name = changed && cause === 'rename' ? 'Equipment kit' : 'Kit';
    const lines = [row(`B11 → KIT · quantity 2${split ? '' : ` · ${name}`}`, changed && cause === 'rename' && !split ? 'changed' : ''), row(`B12 → KIT · quantity 1${split ? '' : ' · Kit'}`, changed && cause === 'rename' && !split ? 'problem' : '')];
    if (!(changed && cause === 'delete')) lines.push(row(`B11 → TEA · quantity 1${split ? '' : ' · Tea'}`));
    const catalogue = [row(`KIT · ${name}`, changed && cause === 'rename' ? 'changed' : ''), row('TEA · Tea')];
    if (changed && cause === 'insert') catalogue.push(row('MAP · Printed map', 'changed'));
    const notes = {
      rename: split ? ['KIT’s current name has one catalogue owner. Two lines refer to KIT.', 'Staff correct Kit to Equipment kit. Quantities do not change.', 'The catalogue row changes once. Neither booked line stores a name.', 'Both booking screens join to KIT and read Equipment kit. One stored correction reaches both.'] : ['Two booked lines copy KIT’s current name. They happen to agree.', 'Staff correct Kit to Equipment kit. Both current-name copies must change.', 'This writer corrects B11 only. B12 keeps Kit: the same service now has two current names.', 'Reading B12 still says Kit. A generated line ID would not prevent this disagreement.'],
      insert: split ? ['The catalogue holds services independently of their bookings.', 'Staff advertise MAP. Nobody has booked it yet.', 'Insert MAP in the catalogue. No booked-service row is needed.', 'MAP is discoverable with zero bookings. The empty association is represented by no lines.'] : ['A service exists only as details on a booked line.', 'Staff advertise MAP. Nobody has booked it yet.', 'There is no valid booking key for MAP. Inserting a fake line would invent a booking.', 'MAP is still absent. The table cannot store this legitimate service fact on its own.'],
      delete: split ? ['B11 has the only TEA line. TEA also has its own catalogue row.', 'Staff remove that optional line from B11.', 'Only the B11 → TEA association is deleted. The catalogue is unchanged.', 'TEA remains available for a later booking. Removing one association did not erase the service.'] : ['B11 has the only TEA line. It is also the only stored description of TEA.', 'Staff remove that optional line from B11.', 'Deleting B11 → TEA also removes the only Tea description.', 'The service has disappeared from storage. A line deletion destroyed an unrelated catalogue fact.'],
    };
    return { boxes: split ? [box('services · tenant 1', catalogue), box('booked_services · tenant 1', lines)] : [box('mixed_lines · tenant 1', lines)], note: notes[cause][step], result: step === 3 ? (split ? 'Independent facts survive independently' : 'A legitimate change damages another fact') : 'Compare storage at the same step' };
  }
  if (kind === 'reconstruction') {
    const safe = choice === 'safe';
    const original = [row('B11 · KIT · quantity 2'), row('B12 · TEA · quantity 1')];
    const joined = safe ? original : [row('B11 · KIT · quantity 2'), row('B11 · TEA · quantity 2', 'problem'), row('B12 · KIT · quantity 1', 'problem'), row('B12 · TEA · quantity 1')];
    const boxes = step === 0 ? [box('Original · tenant 1', original)] : [box(safe ? 'Lines retain service identity' : 'Booking quantities · tenant 1', safe ? original : [row('B11 · quantity 2'), row('B12 · quantity 1')]), box('Service catalogue · tenant 1', [row('KIT · Equipment kit'), row('TEA · Tea')])];
    if (step >= 2) boxes.push(box('Reconstructed booking–service facts', joined));
    return { boxes, note: (safe ? ['B11 booked KIT; B12 booked TEA. Keep those two associations in view.', 'Each line retains its service key. The catalogue contains exactly one row for that tenant and service.', 'Join on tenant and service. Each line finds exactly its own service; no other booking–service pair appears.', 'Two input associations, two reconstructed associations. The key rule, rather than this sample alone, prevents extra matches.'] : ['B11 booked KIT; B12 booked TEA. Keep those two associations in view.', 'The proposed split removes service identity from each booking. Tenant is the only shared column.', 'Both catalogue services match both bookings. The join creates B11–TEA and B12–KIT as well.', 'Four output associations from two originals. The missing connection cannot be recovered from tenant identity.'])[step], result: step >= 2 ? `${joined.length} reconstructed associations · ${safe ? 0 : 2} invented` : 'Original: 2 booking–service associations' };
  }
  if (kind === 'advisers') {
    const split = choice === 'split';
    const accepted = step >= 2 && split;
    const assignments = [row('B11 → A5'), row('B11 → A7')];
    if (accepted) assignments.push(row('B11 → A6', 'problem'));
    const triples = [row('B11 · KIT · A5'), row('B11 · TEA · A7')];
    const boxes = split ? [box('adviser_service · tenant 1', [row('A5 → KIT'), row('A6 → KIT'), row('A7 → TEA')]), box('booking_adviser · tenant 1', assignments)] : [box('assignment · tenant 1', triples)];
    if (step >= 1) boxes.push(box('Proposed extra assignment', [row('B11 · KIT · A6', step >= 2 ? (split ? 'problem' : 'changed') : '')]));
    if (step >= 3) boxes.push(box('B11 / KIT result', accepted ? [row('A5'), row('A6', 'problem')] : [row('A5')]));
    return { boxes, note: (split ? ['A5 and A6 each handle KIT. B11 is assigned A5 for KIT and A7 for TEA.', 'Try assigning B11 to A6 too. The required rule is still one adviser per booking and service.', 'A6 exists and B11–A6 is new. Each table’s keys and reference pass, although the combined rule is broken.', 'The join reports two advisers for B11 / KIT. Lossless reconstruction did not preserve local enforcement of that rule.'] : ['B11 has one adviser for KIT and one for TEA. Every adviser handles exactly one service.', 'Try a second assignment B11 / KIT / A6.', 'A unique key on tenant, booking and service rejects the extra triple. The original row remains.', 'B11 / KIT still has only A5. Adviser → service is a separate rule that this key alone does not enforce.'])[step], result: step >= 2 ? (split ? 'Local checks pass · business rule fails' : 'Booking–service uniqueness rejects the change') : 'Required: one adviser per booking and service' };
  }
  if (kind === 'sets') {
    const independent = choice === 'independent';
    const empty = cause === 'empty';
    const permitted = empty ? [] : independent ? ['Studio · English', 'Studio · French', 'Kitchen · English', 'Kitchen · French'] : ['Studio · English', 'Kitchen · French'];
    const joined = empty ? [] : ['Studio · English', 'Studio · French', 'Kitchen · English', 'Kitchen · French'];
    const boxes = step === 0 ? [box('Venue V1 · recorded availability', permitted.length ? permitted.map(x=>row(x)) : [row('Facilities: Studio, Kitchen'), row('Languages: empty set')])] : [box('venue_facility', [row('V1 · Studio'), row('V1 · Kitchen')]), box('venue_language', empty ? [row('No rows for V1')] : [row('V1 · English'), row('V1 · French')])];
    if (step >= 2) boxes.push(box('Join on venue', joined.length ? joined.map(x=>row(x, !permitted.includes(x) ? 'problem' : '')) : [row('No joined rows · V1 still exists')]));
    const notes = empty ? ['V1 exists with two facilities and no supported languages. There is no facility–language availability to list.', 'Two facility rows and zero language rows preserve both sets. Keep the venue row separately.', 'The inner join returns zero pairs. It cannot list V1’s facilities: read the facility relation for that question.', 'No invented null language or dummy row is needed. Separate sets preserve facilities even when languages are empty.'] : independent ? ['Every language applies to every facility. All four pairs are promised by the requirement.', 'Store two facilities and two languages. Neither set needs copies for the other.', 'Joining the sets gives all four promised pairs. Every combination is valid under the independence rule.', 'Four pairs are reconstructible from four set memberships. Adding a third language needs one new membership, not two pair copies.'] : ['English is available only in Studio; French only in Kitchen. Those two pairs are the facts.', 'Projecting separate sets forgets which language belongs to which facility.', 'Joining the projections also advertises Studio–French and Kitchen–English. Both claims are false.', 'Retain venue–facility–language triples. Two independent lists cannot represent these correlated availabilities.'];
    return { boxes, note: notes[step], result: empty ? '2 facilities retained · 0 language memberships' : step >= 2 ? `${joined.length} joined pairs · ${independent ? 0 : 2} false availabilities` : `${permitted.length} permitted pairs` };
  }
  const atomic = choice === 'atomic';
  const lag = choice === 'lag';
  const source = step >= 4 ? 18 : step >= 3 ? 13 : 10;
  const stored = step >= 7 ? 18 : lag ? 10 : step >= 4 ? (atomic ? 18 : 15) : step >= 3 ? 13 : 10;
  const sourceRows = [row('KIT · 2 × €3 = €6'), row('TEA · 1 × €4 = €4')];
  if (step >= 3) sourceRows.push(row('A adds MAP · €3', step === 3 ? 'changed' : ''));
  if (step >= 4) sourceRows.push(row('B adds AUDIO · €5', step === 4 ? 'changed' : ''));
  const notes = lag ? ['Source lines sum to €10; the published copy also says €10.', 'A plans an extra €3 line. No result has changed yet.', 'B plans an extra €5 line. The dashboard explicitly allows lag; checkout reads source.', 'A commits its €3 source line. The published subtotal remains €10.', 'B commits its €5 source line. Source is now €18, while the published generation is still €10.', 'A dashboard reader gets €10 labelled with its earlier generation. A strict reader computes €18 from source.', 'Reconciliation finds a difference of €8. A rebuild computes €18 from a defined source snapshot; the old generation stays published.', 'Only a complete, validated generation is published: €18. An interruption before this step would leave the earlier generation visible.'] : atomic ? ['Source lines and the maintained subtotal both say €10.', 'A plans +€3. Its source insert and subtotal change must commit together.', 'B plans +€5. It must not overwrite a value derived from the earlier €10 read.', 'A commits its line and a protected subtotal delta. Both become €13.', 'B applies its delta against the current €13 under the chosen protection. Its line and subtotal commit together at €18.', 'The reader sees €18. This outcome assumes a correctly implemented protocol followed by every writer.', 'Recomputing from source also gives €18. The comparison finds no drift.', 'The maintained and reconstructed values agree. No rebuild was needed.'] : ['Source lines and stored subtotal both say €10.', 'A reads €10 and calculates its replacement: €13.', 'B also reads €10 and calculates its replacement: €15. It has not seen A’s addition.', 'A commits its source line and the replacement €13 in one transaction.', 'B commits its source line and overwrites the subtotal with €15. Source contains both additions and sums to €18.', 'The reader sees €15 although source says €18. Two individually atomic transactions did not protect this read–calculate–write protocol.', 'Reconciliation recomputes €18 and detects €3 of drift. Publishing that result requires a safe rebuild boundary.', 'A complete rebuild is published at €18 in this bounded model. Production must also account for source changes during rebuilding.'];
  return { boxes: [box('Authoritative active lines · B11', sourceRows), box('Stored optional-service subtotal', [row(money(stored), stored !== source ? 'problem' : 'changed'), row(lag && step < 7 ? 'Generation g0 · before additions' : 'Current model state')]), ...(step >= 1 ? [box('A / B calculations', [row(lag ? 'No writer updates the copy' : atomic ? 'A: +€3 · B: +€5, protected' : 'A: €10 + €3 → €13'), ...(!lag && !atomic && step >= 2 ? [row('B: €10 + €5 → €15')] : [])])] : [])], note: notes[step], result: `Source ${money(source)} · stored ${money(stored)} · difference ${money(source - stored)}` };
}
