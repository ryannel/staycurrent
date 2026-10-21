// Canonical fixture: docs/coverage/relational-example.md, class-booking extension.
import { customers } from '../example.mjs';
export { customers };
export const classes = [[21, 'Tea tasting', 1, 1], [22, 'Mug painting', 3, 2]];
export const reservations = [['R7', 22, 2]];
export const instructors = [[21, 'Lena', true], [21, 'Ravi', true]];
export const setup = `CREATE TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE classes (
  class_id integer PRIMARY KEY, title text NOT NULL,
  capacity integer NOT NULL CHECK (capacity >= 0),
  remaining integer NOT NULL CHECK (remaining BETWEEN 0 AND capacity)
);
CREATE TABLE reservations (
  request_id text PRIMARY KEY,
  class_id integer NOT NULL REFERENCES classes,
  owner_id integer NOT NULL REFERENCES customers,
  UNIQUE (class_id, owner_id)
);
CREATE TABLE instructors (
  class_id integer NOT NULL REFERENCES classes,
  person text NOT NULL, available boolean NOT NULL,
  PRIMARY KEY (class_id, person)
);`;
const quoted = x => typeof x === 'string' ? `'${x.replaceAll("'", "''")}'` : String(x);
export const seed = [ ['customers', customers], ['classes', classes], ['reservations', reservations], ['instructors', instructors] ]
  .map(([table, rows]) => `INSERT INTO ${table} VALUES ${rows.map(row=>`(${row.map(quoted).join(',')})`).join(',')};`).join('\n');
export const guarded = `WITH taken AS (
  UPDATE classes SET remaining = remaining - 1
  WHERE class_id = 21 AND remaining > 0
  RETURNING class_id
)
INSERT INTO reservations (request_id, class_id, owner_id)
SELECT 'R8', class_id, 1 FROM taken
RETURNING request_id;`;
export const optimistic = `UPDATE classes SET remaining = 0
WHERE class_id = 21 AND remaining = 1
RETURNING class_id;`;
export const depart = `BEGIN ISOLATION LEVEL SERIALIZABLE;
SELECT count(*) FROM instructors
WHERE class_id = 21 AND available;
-- Only if the count is greater than 1:
UPDATE instructors SET available = false
WHERE class_id = 21 AND person = 'Lena';
COMMIT;`;
const frame = (a,b,remaining,bookings,explanation) => ({a,b,remaining,bookings,explanation});
export const scenes = {
  atomicity: {
    title: 'A rejected double click must not consume a second place',
    options: [['separate','Separate commits'],['together','One transaction']],
    text: 'Starting from class 22, Mina books R10, then her second request R11 fails the one-booking-per-customer rule. Separate commits leave remaining = 0 with two reservations for capacity 3. One transaction rolls back the second decrement: remaining = 1 and two reservations.',
    steps(mode) { return [
      frame('Mina: ready to book R10','',2,['R7'], 'Class 22 starts with capacity 3, two places remaining and Tariq’s R7.'),
      frame('R10 committed','',1,['R7','R10'],'Mina’s first request takes one place and records R10. The rule still holds: 1 + 2 = 3.'),
      frame('R10 committed',mode==='separate'?'R11: decrement committed; insert next':'R11: decrement pending; insert next', mode==='separate'?0:1,['R7','R10'],mode==='separate'?'The second request commits its decrement before attempting R11.':'The second request has changed remaining to 0 inside its transaction. Committed classes still shows 1; Committed reservations still shows R7 and R10.'),
      frame('R10 committed',mode==='separate'?'R11 rejected: duplicate; decrement already committed':'R11 rejected: duplicate; ROLLBACK second request',mode==='separate'?0:1,['R7','R10'],mode==='separate'?'Two reservations, no remaining places: 0 + 2 ≠ 3. A place has vanished.':'Rollback discards the pending decrement. Two reservations and one remaining place still add to capacity 3.')
    ]; }
  },
  race: {
    title: 'Two requests, one place: where does the condition run?',
    options: [['stale','Read, then overwrite'],['guarded','Conditional change']],
    text: 'Class 21 has one place. Both requests initially read 1. With a stale overwrite, R8 and R9 both commit and remaining is 0: two bookings for one place. With a conditional change, Tariq waits for Mina, rechecks remaining > 0, changes no row and creates no R9.',
    steps(mode) { return [
      frame('Mina: R8, owner 1','Tariq: R9, owner 2',1,[],'Class 21 starts with one place and no reservations. Each request wants one place.'),
      frame('Reads remaining = 1','Reads remaining = 1',1,[],'Both reads return 1. This is evidence about what they saw, not ownership of the place.'),
      frame('Changes remaining to 0; inserts R8',mode==='stale'?'Keeps earlier decision: write 0':'Conditional UPDATE waits',1,[],'Mina’s changes are pending. Other ordinary readers still see the committed 1.'),
      frame('COMMIT succeeds',mode==='stale'?'Ready to overwrite with 0':'Wait ends; condition rechecked',0,['R8'],'Mina commits R8. The committed remaining value becomes 0.'),
      frame('R8 accepted',mode==='stale'?'Writes 0; inserts R9; COMMIT':'Zero rows changed; no R9',0,mode==='stale'?['R8','R9']:['R8'],mode==='stale'?'The second write did not make remaining negative, so CHECK accepts it. Two reservations still overbook capacity 1.':'At PostgreSQL Read Committed the waiting UPDATE checks remaining > 0 against the changed row. R9 is refused; 0 + 1 = 1.')
    ]; }
  },
  staffing: {
    title: 'Stable reads can still let both instructors leave',
    options: [['repeatable','Repeatable Read'],['serializable','Serializable']],
    text: 'Lena and Ravi both count two available instructors and each makes their own row unavailable. PostgreSQL Repeatable Read can commit both, leaving zero. Serializable rejects one transaction. A whole-transaction restart counts one and declines the other departure.',
    steps(mode) { return [
      {a:'Lena: available', b:'Ravi: available',available:[true,true],explanation:'Class 21 must retain at least one available instructor. Lena and Ravi begin available.'},
      {a:'Counts 2; decides to leave', b:'Counts 2; decides to leave',available:[true,true],explanation:'Both transactions take their read before either change. Each departure would be safe if performed alone.'},
      {a:'Changes Lena’s row', b:'Changes Ravi’s row',available:[true,true],explanation:'Different rows are changed. No same-row write conflict forces these two decisions to take turns.'},
      {a:'COMMIT succeeds', b:mode==='repeatable'?'COMMIT succeeds':'COMMIT rejected: 40001',available:mode==='repeatable'?[false,false]:[false,true],explanation:mode==='repeatable'?'Both committed: zero available. Neither serial order permits this result, because its second decision would see only one.':'This selected schedule commits Lena’s change and rejects Ravi’s. One instructor remains; another schedule may choose another victim.'},
      ...(mode==='repeatable'?[]:[{a:'Lena remains unavailable',b:'Restart: counts 1; stays',available:[false,true],explanation:'Ravi starts a new transaction, repeats the count and declines departure. Retrying only the old UPDATE would lose this new decision.'}])
    ]; }
  }
};
