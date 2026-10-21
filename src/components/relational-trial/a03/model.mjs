// Teaching model for "Making concurrent changes correct" (relational trial a03).
// Every figure and table in the article reads its rows, schedules and outcomes
// from this file. verify.mjs replays each schedule step by step against a
// disposable PostgreSQL 18 server and checks every output and final state here.

export const customers = [
  { customer_id: 1, name: 'Mina Shah' },
  { customer_id: 2, name: 'Tariq Aziz' },
  { customer_id: 3, name: 'Edda Berg' },
];
// Who owns each request id used in the figures.
export const owners = { R7: 'Tariq', R8: 'Mina', R9: 'Tariq', R10: 'Mina', R11: 'Mina', R12: 'Tariq' };
export const classes = [
  { class_id: 21, title: 'Tea tasting', capacity: 1, remaining: 1 },
  { class_id: 22, title: 'Mug painting', capacity: 3, remaining: 2 },
];
export const reservations = [
  { request_id: 'R7', class_id: 22, owner_id: 2 },
];
export const instructors = [
  { class_id: 21, person: 'Lena', available: true },
  { class_id: 21, person: 'Ravi', available: true },
];

export const fixture = `CREATE TABLE customers (
  customer_id integer PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE classes (
  class_id integer PRIMARY KEY,
  title text NOT NULL,
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
  person text NOT NULL,
  available boolean NOT NULL,
  PRIMARY KEY (class_id, person)
);
INSERT INTO customers VALUES (1, 'Mina Shah'), (2, 'Tariq Aziz'), (3, 'Edda Berg');
INSERT INTO classes VALUES (21, 'Tea tasting', 1, 1), (22, 'Mug painting', 3, 2);
INSERT INTO reservations VALUES ('R7', 22, 2);
INSERT INTO instructors VALUES (21, 'Lena', true), (21, 'Ravi', true);`;

// The complete booking: take a place and record its owner in one statement.
export const book = (request = 'R8', classId = 21, owner = 1) => `WITH taken AS (
  UPDATE classes
  SET remaining = remaining - 1
  WHERE class_id = ${classId}
    AND remaining > 0
  RETURNING class_id
)
INSERT INTO reservations
  (request_id, class_id, owner_id)
SELECT '${request}', class_id, ${owner}
FROM taken
RETURNING request_id;`;
const oneLine = sql => sql.replace(/\s+/g, ' ').trim();

export const twoStep = `BEGIN;
UPDATE classes
SET remaining = remaining - 1
WHERE class_id = 22 AND remaining > 0
RETURNING remaining;
-- 1: a place was taken
INSERT INTO reservations
  (request_id, class_id, owner_id)
VALUES ('R12', 22, 2);
-- Tariq already holds R7 in class 22:
-- ERROR:  duplicate key value violates
--   unique constraint
--   "reservations_class_id_owner_id_key"
--   (SQLSTATE 23505)
SELECT remaining FROM classes
WHERE class_id = 22;
-- ERROR:  current transaction is aborted,
--   commands ignored until end of
--   transaction block (SQLSTATE 25P02)
COMMIT;
-- PostgreSQL replies ROLLBACK`;

export const invariantCheck = `SELECT c.class_id, c.capacity, c.remaining,
       count(r.request_id) AS booked,
       c.remaining + count(r.request_id)
         = c.capacity AS rule_holds
FROM classes AS c
LEFT JOIN reservations AS r USING (class_id)
GROUP BY c.class_id
ORDER BY c.class_id;`;

// The check's result on the starting rows (observed).
export const invariantResult = [
  { class_id: 21, capacity: 1, remaining: 1, booked: 0, rule_holds: true },
  { class_id: 22, capacity: 3, remaining: 2, booked: 1, rule_holds: true },
];

export const leave = person => `UPDATE instructors SET available = false
WHERE class_id = 21 AND person = '${person}';`;

// ---------------------------------------------------------------------------
// Schedules for Figures 2 and 3. Each step is one statement or a short group of
// statements sent by one session. `out` is psql's exact output (unaligned,
// tuples only, VERBOSITY=sqlstate); `waits` means the command is still blocked
// on a lock when the next step starts; `collect` reports a blocked command's
// eventual result. `state` is the committed state after the step.
// ---------------------------------------------------------------------------
const placeRead = 'SELECT remaining FROM classes WHERE class_id = 21;';
const writeZero = (request, owner) => `UPDATE classes SET remaining = 0 WHERE class_id = 21; INSERT INTO reservations VALUES ('${request}', 21, ${owner});`;
const dupCheck = 'SELECT count(*) FROM reservations WHERE class_id = 22 AND owner_id = 1;';
const countAvailable = 'SELECT count(*) FROM instructors WHERE class_id = 21 AND available;';
const lockAvailable = 'SELECT person FROM instructors WHERE class_id = 21 AND available ORDER BY person FOR UPDATE;';
const lockClass = 'SELECT class_id FROM classes WHERE class_id = 21 FOR UPDATE;';
const serial = 'BEGIN ISOLATION LEVEL SERIALIZABLE;';

const s = (who, sql, cell, out, state, note, extra = {}) => ({ who, sql, cell, out, state, note, ...extra });

export const scenarios = {
  place: {
    label: 'Last place in class 21',
    a: 'A · Mina books (R8)',
    b: 'B · Tariq books (R9)',
    stateHeading: 'Class 21, committed',
    rule: 'remaining + bookings = capacity 1',
    initial: { remaining: 1, bookings: [] },
    options: {
      serial: {
        label: 'One after the other', protection: 'Read, then write the computed value',
        steps: [
          s('A', `BEGIN; ${placeRead}`, 'BEGIN · reads remaining: 1', ['BEGIN', '1'], { remaining: 1, bookings: [] }, 'Mina’s transaction reads one place left. Nothing else is running.'),
          s('A', writeZero('R8', 1), 'Writes remaining = 0 · inserts R8', ['UPDATE 1', 'INSERT 0 1'], { remaining: 1, bookings: [] }, 'It computes 1 − 1 = 0 in the application, writes that value and records Mina’s booking. Neither change is committed yet.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 0, bookings: ['R8'] }, 'Both changes become visible together: no places left, one booking.'),
          s('B', `BEGIN; ${placeRead}`, 'BEGIN · reads remaining: 0', ['BEGIN', '0'], { remaining: 0, bookings: ['R8'] }, 'Tariq’s transaction starts after Mina’s has finished, so it reads 0.'),
          s('B', 'ROLLBACK;', 'Full · ROLLBACK', ['ROLLBACK'], { remaining: 0, bookings: ['R8'] }, 'Tariq is told the class is full. Run one at a time, the same code keeps the rule.'),
        ],
      },
      interleaved: {
        label: 'Both read before either writes', protection: 'Read, then write the computed value',
        steps: [
          s('A', `BEGIN; ${placeRead}`, 'BEGIN · reads remaining: 1', ['BEGIN', '1'], { remaining: 1, bookings: [] }, 'Mina’s transaction reads one place left.'),
          s('B', `BEGIN; ${placeRead}`, 'BEGIN · reads remaining: 1', ['BEGIN', '1'], { remaining: 1, bookings: [] }, 'Before Mina’s transaction writes anything, Tariq’s reads the same committed value: one place left.'),
          s('A', writeZero('R8', 1), 'Writes remaining = 0 · inserts R8', ['UPDATE 1', 'INSERT 0 1'], { remaining: 1, bookings: [] }, 'Mina’s transaction writes the value it computed and records her booking.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 0, bookings: ['R8'] }, 'Mina’s booking commits. Tariq’s transaction is still working from the 1 it read.'),
          s('B', writeZero('R9', 2), 'Writes remaining = 0 · inserts R9', ['UPDATE 1', 'INSERT 0 1'], { remaining: 0, bookings: ['R8'] }, 'Tariq’s transaction writes 1 − 1 = 0 over the 0 already there, and records his booking. Nothing in the database objects: the value is in range and R9 is a new row.'),
          s('B', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 0, bookings: ['R8', 'R9'] }, 'Both bookings are committed for one place. Every statement succeeded.'),
        ],
      },
      conditional: {
        label: 'Both start together', protection: 'One conditional statement',
        steps: [
          s('A', `BEGIN; ${oneLine(book('R8', 21, 1))}`, 'BEGIN · conditional booking returns R8', ['BEGIN', 'R8', 'INSERT 0 1'], { remaining: 1, bookings: [] }, 'One statement checks remaining > 0, takes the place and inserts R8. Mina’s transaction now holds a lock on the class 21 row.'),
          s('B', `BEGIN; ${oneLine(book('R9', 21, 2))}`, 'BEGIN · same statement for R9: waits', null, { remaining: 1, bookings: [] }, 'Tariq’s identical statement reaches the class 21 row and waits for Mina’s transaction to finish.', { waits: true }),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 0, bookings: ['R8'] }, 'Mina’s booking commits and her lock is released.'),
          s('B', null, 'Rechecks remaining > 0 against 0: no place, no row inserted', ['BEGIN', 'INSERT 0 0'], { remaining: 0, bookings: ['R8'] }, 'Tariq’s statement resumes. At Read Committed, PostgreSQL rechecks its condition against the committed row, finds 0 and inserts nothing.', { collect: true }),
          s('B', 'ROLLBACK;', 'Empty result · ROLLBACK', ['ROLLBACK'], { remaining: 0, bookings: ['R8'] }, 'An empty result is the business answer “full”. Tariq is told so; nothing was half-done.'),
        ],
      },
      serializable: {
        label: 'Both read before either writes', protection: 'Read, then write, at Serializable',
        steps: [
          s('A', `${serial} ${placeRead}`, 'BEGIN SERIALIZABLE · reads 1', ['BEGIN', '1'], { remaining: 1, bookings: [] }, 'The same read-then-write code, run at PostgreSQL’s Serializable level.'),
          s('B', `${serial} ${placeRead}`, 'BEGIN SERIALIZABLE · reads 1', ['BEGIN', '1'], { remaining: 1, bookings: [] }, 'Both transactions read one place left.'),
          s('A', writeZero('R8', 1), 'Writes remaining = 0 · inserts R8', ['UPDATE 1', 'INSERT 0 1'], { remaining: 1, bookings: [] }, 'Mina’s transaction writes first and holds the row.'),
          s('B', 'UPDATE classes SET remaining = 0 WHERE class_id = 21;', 'Writes remaining = 0: waits', null, { remaining: 1, bookings: [] }, 'Tariq’s update waits for Mina’s transaction.', { waits: true }),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 0, bookings: ['R8'] }, 'Mina’s booking commits.'),
          s('B', null, 'Error 40001: could not serialize access', ['ERROR:  40001'], { remaining: 0, bookings: ['R8'] }, 'The row changed after Tariq’s transaction took its snapshot, so PostgreSQL refuses the update instead of overwriting it.', { collect: true }),
          s('B', `ROLLBACK; ${serial} ${placeRead} ROLLBACK;`, 'ROLLBACK · whole retry reads 0 · full', ['ROLLBACK', 'BEGIN', '0', 'ROLLBACK'], { remaining: 0, bookings: ['R8'] }, 'Tariq’s application rolls back and runs the whole transaction again. The new attempt reads 0 and reports the class full.'),
        ],
      },
    },
  },
  duplicate: {
    label: 'Mina clicks “Book” twice',
    a: 'A · first click (R10)',
    b: 'B · second click (R11)',
    stateHeading: 'Class 22, committed',
    rule: 'one booking per customer per class',
    initial: { remaining: 2, bookings: ['R7'] },
    options: {
      precheck: {
        label: 'Both start together', protection: 'Application check, no unique constraint', withoutUnique: true,
        steps: [
          s('A', `BEGIN; ${dupCheck}`, 'BEGIN · Mina’s bookings in 22: 0', ['BEGIN', '0'], { remaining: 2, bookings: ['R7'] }, 'The first request checks that Mina has no booking in class 22.'),
          s('B', `BEGIN; ${dupCheck}`, 'BEGIN · Mina’s bookings in 22: 0', ['BEGIN', '0'], { remaining: 2, bookings: ['R7'] }, 'The second request makes the same check before the first has committed, and also finds none.'),
          s('A', oneLine(book('R10', 22, 1)), 'Conditional booking returns R10', ['R10', 'INSERT 0 1'], { remaining: 2, bookings: ['R7'] }, 'The first request takes a place and inserts R10.'),
          s('B', oneLine(book('R11', 22, 1)), 'Conditional booking for R11: waits', null, { remaining: 2, bookings: ['R7'] }, 'The second request waits for the class 22 row.', { waits: true }),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 1, bookings: ['R7', 'R10'] }, 'R10 commits.'),
          s('B', null, 'One place left: takes it, returns R11', ['R11', 'INSERT 0 1'], { remaining: 1, bookings: ['R7', 'R10'] }, 'One place is still left, so the second request takes it. Its earlier check said Mina had no booking.', { collect: true }),
          s('B', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 0, bookings: ['R7', 'R10', 'R11'] }, 'Mina now holds two of the three places. The counter still adds up; the ownership rule does not.'),
        ],
      },
      unique: {
        label: 'Both start together', protection: 'UNIQUE (class_id, owner_id)',
        steps: [
          s('A', `BEGIN; ${dupCheck}`, 'BEGIN · Mina’s bookings in 22: 0', ['BEGIN', '0'], { remaining: 2, bookings: ['R7'] }, 'The application can still check first, to give a friendly message.'),
          s('B', `BEGIN; ${dupCheck}`, 'BEGIN · Mina’s bookings in 22: 0', ['BEGIN', '0'], { remaining: 2, bookings: ['R7'] }, 'Both checks find nothing, as before.'),
          s('A', oneLine(book('R10', 22, 1)), 'Conditional booking returns R10', ['R10', 'INSERT 0 1'], { remaining: 2, bookings: ['R7'] }, 'The first request takes a place and inserts R10.'),
          s('B', oneLine(book('R11', 22, 1)), 'Conditional booking for R11: waits', null, { remaining: 2, bookings: ['R7'] }, 'The second request waits for the class 22 row.', { waits: true }),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 1, bookings: ['R7', 'R10'] }, 'R10 commits.'),
          s('B', null, 'Error 23505: Mina already holds a booking', ['ERROR:  23505'], { remaining: 1, bookings: ['R7', 'R10'] }, 'The update takes the last place, then the insert meets the unique constraint on (class_id, owner_id) and fails. The whole statement fails with it.', { collect: true }),
          s('B', 'ROLLBACK;', 'ROLLBACK', ['ROLLBACK'], { remaining: 1, bookings: ['R7', 'R10'] }, 'Rolling back also returns the place the failed statement took. One booking for Mina, one place left.'),
        ],
      },
    },
  },
  staff: {
    label: 'Both instructors take leave',
    a: 'A · Lena asks for leave',
    b: 'B · Ravi asks for leave',
    stateHeading: 'Available for class 21',
    rule: 'at least one instructor available',
    initial: { available: ['Lena', 'Ravi'] },
    options: {
      serial: {
        label: 'One after the other', protection: 'Count, then update your own row',
        steps: [
          s('A', `BEGIN; ${countAvailable}`, 'BEGIN · counts available: 2', ['BEGIN', '2'], { available: ['Lena', 'Ravi'] }, 'Lena’s transaction counts two available instructors, so she may go.'),
          s('A', oneLine(leave('Lena')), 'Marks Lena unavailable', ['UPDATE 1'], { available: ['Lena', 'Ravi'] }, 'It changes only Lena’s row.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: ['Ravi'] }, 'Lena’s leave commits.'),
          s('B', `BEGIN; ${countAvailable}`, 'BEGIN · counts available: 1', ['BEGIN', '1'], { available: ['Ravi'] }, 'Ravi’s transaction starts afterwards and counts one.'),
          s('B', 'ROLLBACK;', 'Declined · ROLLBACK', ['ROLLBACK'], { available: ['Ravi'] }, 'Ravi’s request is declined. Run one at a time, the rule holds.'),
        ],
      },
      interleaved: {
        label: 'Both read before either writes', protection: 'Count, then update your own row',
        steps: [
          s('A', `BEGIN; ${countAvailable}`, 'BEGIN · counts available: 2', ['BEGIN', '2'], { available: ['Lena', 'Ravi'] }, 'Lena’s transaction counts two available instructors.'),
          s('B', `BEGIN; ${countAvailable}`, 'BEGIN · counts available: 2', ['BEGIN', '2'], { available: ['Lena', 'Ravi'] }, 'Ravi’s transaction counts the same two.'),
          s('A', oneLine(leave('Lena')), 'Marks Lena unavailable', ['UPDATE 1'], { available: ['Lena', 'Ravi'] }, 'Lena’s transaction changes Lena’s row.'),
          s('B', oneLine(leave('Ravi')), 'Marks Ravi unavailable', ['UPDATE 1'], { available: ['Lena', 'Ravi'] }, 'Ravi’s transaction changes a different row, so it does not wait.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: ['Ravi'] }, 'Lena’s leave commits.'),
          s('B', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: [] }, 'Ravi’s leave commits too. Nobody is left to teach class 21, and no two writes ever touched the same row.'),
        ],
      },
      lockrows: {
        label: 'Both start together', protection: 'Lock the rows you counted',
        steps: [
          s('A', `BEGIN; ${lockAvailable}`, 'BEGIN · locks available rows: Lena, Ravi', ['BEGIN', 'Lena', 'Ravi'], { available: ['Lena', 'Ravi'] }, 'Lena’s transaction reads the available instructors with FOR UPDATE, locking both rows, and counts two.'),
          s('B', `BEGIN; ${lockAvailable}`, 'BEGIN · same locking read: waits', null, { available: ['Lena', 'Ravi'] }, 'Ravi’s locking read reaches the same rows and waits.', { waits: true }),
          s('A', oneLine(leave('Lena')), 'Marks Lena unavailable', ['UPDATE 1'], { available: ['Lena', 'Ravi'] }, 'Lena’s transaction changes her row.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: ['Ravi'] }, 'Lena’s leave commits and both locks are released.'),
          s('B', null, 'Locks one row: Ravi', ['BEGIN', 'Ravi'], { available: ['Ravi'] }, 'Ravi’s read resumes. Lena’s row no longer matches “available”, so it returns only Ravi: a count of one.', { collect: true }),
          s('B', 'ROLLBACK;', 'Declined · ROLLBACK', ['ROLLBACK'], { available: ['Ravi'] }, 'Ravi’s request is declined. The rule holds, provided every writer takes these locks.'),
        ],
      },
      coordination: {
        label: 'Both start together', protection: 'Lock the class row first',
        steps: [
          s('A', `BEGIN; ${lockClass}`, 'BEGIN · locks class 21', ['BEGIN', '21'], { available: ['Lena', 'Ravi'] }, 'Lena’s transaction first locks the class 21 row, a stable row every change to the rule agrees to take.'),
          s('B', `BEGIN; ${lockClass}`, 'BEGIN · locks class 21: waits', null, { available: ['Lena', 'Ravi'] }, 'Ravi’s transaction asks for the same row and waits before it has counted anything.', { waits: true }),
          s('A', `${countAvailable} ${oneLine(leave('Lena'))}`, 'Counts 2 · marks Lena unavailable', ['2', 'UPDATE 1'], { available: ['Lena', 'Ravi'] }, 'Holding the class row, Lena’s transaction counts two and changes her row.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: ['Ravi'] }, 'Lena’s leave commits and the class row is released.'),
          s('B', null, 'Locks class 21', ['BEGIN', '21'], { available: ['Ravi'] }, 'Ravi’s transaction now holds the class row. It has not counted yet.', { collect: true }),
          s('B', countAvailable, 'Counts available: 1', ['1'], { available: ['Ravi'] }, 'Its count is a new statement, so at Read Committed it sees Lena’s committed leave: one.'),
          s('B', 'ROLLBACK;', 'Declined · ROLLBACK', ['ROLLBACK'], { available: ['Ravi'] }, 'Ravi’s request is declined. The rule holds, provided every writer locks the class row first.'),
        ],
      },
      serializable: {
        label: 'Both read before either writes', protection: 'Count, then update, at Serializable',
        steps: [
          s('A', `${serial} ${countAvailable}`, 'BEGIN SERIALIZABLE · counts 2', ['BEGIN', '2'], { available: ['Lena', 'Ravi'] }, 'The original count-then-update code, run at Serializable.'),
          s('B', `${serial} ${countAvailable}`, 'BEGIN SERIALIZABLE · counts 2', ['BEGIN', '2'], { available: ['Lena', 'Ravi'] }, 'Both transactions count two. Neither waits.'),
          s('A', oneLine(leave('Lena')), 'Marks Lena unavailable', ['UPDATE 1'], { available: ['Lena', 'Ravi'] }, 'Lena’s transaction changes her row.'),
          s('B', oneLine(leave('Ravi')), 'Marks Ravi unavailable', ['UPDATE 1'], { available: ['Lena', 'Ravi'] }, 'Ravi’s transaction changes his row. Both updates succeed.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: ['Ravi'] }, 'Lena’s leave commits.'),
          s('B', 'COMMIT;', 'COMMIT fails: error 40001', ['ERROR:  40001'], { available: ['Ravi'] }, 'PostgreSQL has tracked that each transaction read a row the other changed. No one-at-a-time order explains both decisions, so it refuses Ravi’s commit. His successful UPDATE did not mean his leave was accepted.'),
          s('B', `${serial} ${countAvailable} ROLLBACK;`, 'Whole retry counts 1 · declined', ['BEGIN', '1', 'ROLLBACK'], { available: ['Ravi'] }, 'The application runs Ravi’s whole transaction again. The new count is one, so it declines.'),
        ],
      },
    },
  },
};

// Figure 2 compares schedules with no protection; Figure 3 compares protections.
export const figureOptions = {
  schedule: { place: ['serial', 'interleaved'], staff: ['serial', 'interleaved'] },
  protect: { place: ['interleaved', 'conditional', 'serializable'], duplicate: ['precheck', 'unique'], staff: ['interleaved', 'lockrows', 'coordination', 'serializable'] },
};
// Figure 3's control names, used for the same protections in the article's table.
export const protectLabel = {
  interleaved: 'No protection',
  conditional: 'One conditional statement',
  precheck: 'Application check only',
  unique: 'Unique constraint',
  lockrows: 'Lock the rows you counted',
  coordination: 'Lock the class row first (coordination row)',
  serializable: 'Run at Serializable',
};

const withOwner = id => `${id} ${owners[id]}`;
export function stateCells(scenario, state) {
  if (scenario === 'staff') return [state.available.length ? state.available.join(', ') : 'nobody'];
  if (scenario === 'move') return [String(state.left21), String(state.left22), state.bookings.join(', ')];
  return [String(state.remaining), state.bookings.length ? state.bookings.map(withOwner).join(', ') : 'none'];
}
export function stateHeadings(scenario) {
  if (scenario === 'staff') return ['Available'];
  if (scenario === 'move') return ['21 left', '22 left', 'Bookings'];
  return ['Places left', 'Bookings'];
}
export function verdict(scenarioId, state) {
  if (scenarioId === 'move') {
    const in21 = state.bookings.filter(b => b.endsWith('21')).length, in22 = state.bookings.length - in21;
    const holds = state.left21 + in21 === 1 && state.left22 + in22 === 3;
    return { holds, text: holds ? `Rule holds: class 21 has ${state.left21} left + ${in21} booked = 1; class 22 has ${state.left22} left + ${in22} booked = 3.` : 'Rule broken.' };
  }
  if (scenarioId === 'staff') {
    const n = state.available.length;
    return { holds: n >= 1, text: n >= 1 ? `Rule holds: ${n} instructor available.` : 'Rule broken: no instructor is available for class 21.' };
  }
  const capacity = scenarioId === 'place' ? 1 : 3;
  const sum = state.remaining + state.bookings.length;
  if (scenarioId === 'duplicate') {
    const mine = state.bookings.filter(id => id !== 'R7').length;
    return mine > 1
      ? { holds: false, text: `Rule broken: Mina holds ${mine} bookings in class 22, though ${state.remaining} left + ${state.bookings.length} booked = capacity ${capacity}.` }
      : { holds: true, text: `Rules hold: one booking for Mina, and ${state.remaining} left + ${state.bookings.length} booked = capacity ${capacity}.` };
  }
  return sum === capacity
    ? { holds: true, text: `Rule holds: ${state.remaining} left + ${state.bookings.length} booked = capacity ${capacity}.` }
    : { holds: false, text: `Rule broken: ${state.remaining} left + ${state.bookings.length} booked = ${sum}, but capacity is ${capacity}.` };
}

// ---------------------------------------------------------------------------
// Figure 4: what B's statement sees while A's change is uncommitted.
// ---------------------------------------------------------------------------
export const versionOptions = [
  ['select', 'Ordinary SELECT'],
  ['forupdate', 'SELECT … FOR UPDATE'],
  ['conditional', 'Conditional UPDATE'],
];
export const versionSql = {
  select: `SELECT remaining FROM classes
WHERE class_id = 21;`,
  forupdate: `SELECT remaining FROM classes
WHERE class_id = 21
FOR UPDATE;`,
  conditional: `UPDATE classes
SET remaining = remaining - 1
WHERE class_id = 21 AND remaining > 0
RETURNING remaining;`,
};
// versions: newest last. status: 'committed' | 'pending' | 'old'.
export function versionFrames(choice) {
  const bLabel = { select: 'SELECT remaining', forupdate: 'SELECT … FOR UPDATE', conditional: 'UPDATE … WHERE remaining > 0' }[choice];
  const waits = choice !== 'select';
  return [
    { title: 'Before either transaction', versions: [{ value: 1, status: 'committed', by: 'earlier commit' }], a: 'Not started', b: 'Not started', note: 'Class 21 has one committed version of its row: one place left.' },
    { title: 'A changes the row', versions: [{ value: 1, status: 'committed', by: 'earlier commit' }, { value: 0, status: 'pending', by: 'written by A' }], a: 'UPDATE … SET remaining = 0 · holds the row lock', b: 'Not started', note: 'A’s update writes a new version beside the old one and locks the row. Other sessions still treat the old version as the committed state.' },
    { title: 'B runs its statement', versions: [{ value: 1, status: 'committed', by: 'earlier commit' }, { value: 0, status: 'pending', by: 'written by A' }], a: 'Still open', b: waits ? `${bLabel} · waits for A` : `${bLabel} · returns 1 at once`, wait: waits, note: waits ? 'B’s statement wants to change or lock the row, so it must wait to learn whether A’s version will commit.' : 'An ordinary read takes the newest committed version it may see. It does not wait for A and does not lock anything.' },
    { title: 'A inserts R8 and commits', versions: [{ value: 1, status: 'old', by: 'kept until no reader needs it' }, { value: 0, status: 'committed', by: 'written by A' }], a: 'COMMIT · lock released', b: waits ? 'Released' : 'Its 1 was already returned', note: 'A’s version is now the committed one. The old version stays until no snapshot can need it, then PostgreSQL’s clean-up process, VACUUM, removes it.' },
    { title: 'What B ends with', versions: [{ value: 1, status: 'old', by: 'kept until no reader needs it' }, { value: 0, status: 'committed', by: 'written by A' }], a: 'Finished', b: { select: 'Earlier result: 1 · a new SELECT returns 0', forupdate: 'Returns remaining = 0 and locks the row', conditional: 'Rechecks remaining > 0 against 0 · changes 0 rows' }[choice], done: true, note: { select: 'B’s 1 was true when read and stale soon after. Acting on it later would repeat the race in Figure 2.', forupdate: 'The locking read waited, then returned the newest committed version. B can decide on 0 while holding the row.', conditional: 'The check and the change ran against the same current row, so B takes no place it does not have.' }[choice] },
  ];
}

// ---------------------------------------------------------------------------
// Tables checked by verify.mjs.
// ---------------------------------------------------------------------------
// How Tariq's failed duplicate attempt on class 22 can end (class 22 starts at 2 left, R7).
export const endings = [
  { id: 'rollback', ending: 'The error aborts the transaction. COMMIT is answered with ROLLBACK.', remaining: 2, bookings: ['R7'], holds: true },
  { id: 'savepoint-late', ending: 'A savepoint taken after the update. The application rolls back to it, then commits.', remaining: 1, bookings: ['R7'], holds: false },
  { id: 'savepoint-early', ending: 'A savepoint taken before the update. The application rolls back to it, then commits.', remaining: 2, bookings: ['R7'], holds: true },
];

// What each PostgreSQL level did with the unprotected, interleaved schedules of Figure 2.
export const levels = [
  { level: 'Read Committed (the default)', place: { result: 'Both bookings commit', holds: false }, staff: { result: 'Both leaves commit', holds: false } },
  { level: 'Repeatable Read', place: { result: 'Tariq’s update fails with 40001', holds: true }, staff: { result: 'Both leaves commit', holds: false } },
  { level: 'Serializable', place: { result: 'Tariq’s update fails with 40001', holds: true }, staff: { result: 'Ravi’s COMMIT fails with 40001', holds: true } },
];

// Moving bookings between classes 21 and 22. Each move locks both class rows,
// lowest class first, then moves the booking only if it is still in the source
// class, takes a place in the destination only if one is left, and releases the
// source place. The application rolls back on UPDATE 0 at either guard.
// Mina moves R8 from 21 to 22; Tariq moves R7 from 22 to 21.
const lockRow = id => `SELECT class_id FROM classes WHERE class_id = ${id} FOR UPDATE;`;
const moveChange = (request, from, to) => `UPDATE reservations SET class_id = ${to}
WHERE request_id = '${request}' AND class_id = ${from};
UPDATE classes SET remaining = remaining - 1
WHERE class_id = ${to} AND remaining > 0;
UPDATE classes SET remaining = remaining + 1
WHERE class_id = ${from};`;
export const moveSql = {
  mina: { request: 'R8', from: 21, to: 22, lock: lockRow, change: moveChange('R8', 21, 22) },
  tariq: { request: 'R7', from: 22, to: 21, lock: lockRow, change: moveChange('R7', 22, 21) },
};
export const moveListing = `BEGIN;
SELECT class_id FROM classes
WHERE class_id = 21 FOR UPDATE;
SELECT class_id FROM classes
WHERE class_id = 22 FOR UPDATE;
-- Both class rows are held.
-- Now recheck R8, then change.
UPDATE reservations SET class_id = 22
WHERE request_id = 'R8' AND class_id = 21;
-- UPDATE 0: R8 has already moved.
-- ROLLBACK.
UPDATE classes SET remaining = remaining - 1
WHERE class_id = 22 AND remaining > 0;
-- UPDATE 0: class 22 is full.
-- ROLLBACK.
UPDATE classes SET remaining = remaining + 1
WHERE class_id = 21;
COMMIT;`;
// The first draft's listing, kept so verify.mjs can show what the recheck prevents:
// it released and took places without checking where R8 was.
export const unguardedMove = `UPDATE classes SET remaining = remaining + 1 WHERE class_id = 21;
UPDATE classes SET remaining = remaining - 1 WHERE class_id = 22 AND remaining > 0;
UPDATE reservations SET class_id = 22 WHERE request_id = 'R8';`;

const one = sql => sql.replace(/\s+/g, ' ').trim();
const moveStart = { left21: 0, left22: 2, bookings: ['R7 in 22', 'R8 in 21'] };
scenarios.move = {
  label: 'Mina and Tariq swap classes',
  a: 'A · Mina moves R8 to 22',
  b: 'B · Tariq moves R7 to 21',
  rule: 'class 21: left + booked = 1; class 22: left + booked = 3',
  setup: one(book('R8', 21, 1)),
  startNote: 'Starting rows: Mina’s booking R8 has taken class 21’s only place; class 22 has 2 places left and holds Tariq’s R7. Each move locks both class rows before changing them.',
  initial: moveStart,
  options: {
    opposite: {
      label: 'Opposite lock orders', protection: 'Each move locks its own source class first',
      summary: 'Each move locked its own source class, then waited for the other’s: a deadlock after step 5. PostgreSQL aborted Mina’s move; Tariq’s move found class 21 full and rolled back; Mina’s move, run again, committed.',
      steps: [
        s('A', `BEGIN; ${lockRow(21)}`, 'BEGIN · locks class 21', ['BEGIN', '21'], moveStart, 'Mina’s move locks class 21, where R8 is now.'),
        s('B', `BEGIN; ${lockRow(22)}`, 'BEGIN · locks class 22', ['BEGIN', '22'], moveStart, 'Tariq’s move locks class 22, where R7 is now.'),
        s('A', lockRow(22), 'Locks class 22: waits for B', null, moveStart, 'Mina’s move asks for class 22 and waits for Tariq’s transaction.', { waits: true }),
        s('B', lockRow(21), 'Locks class 21: waits for A', null, moveStart, 'Tariq’s move asks for class 21 and waits for Mina’s. Each now waits for the other: a deadlock.', { waits: true }),
        s('A', null, 'Error 40P01: deadlock detected', ['ERROR:  40P01'], moveStart, 'After about a second PostgreSQL finds the cycle and aborts one transaction. In this run it aborted Mina’s, and her locks were released.', { collect: true }),
        s('B', null, 'Locks class 21', ['21'], moveStart, 'Tariq’s request for class 21 is granted as soon as Mina’s transaction is aborted. His move now holds both class rows.', { collect: true }),
        s('A', one(moveChange('R8', 21, 22)).split('; ')[0] + ';', 'Next statement: error 25P02', ['ERROR:  25P02'], moveStart, 'Mina’s transaction is aborted, so PostgreSQL refuses every further statement in it.'),
        s('A', 'ROLLBACK;', 'ROLLBACK', ['ROLLBACK'], moveStart, 'Her application rolls back. Nothing of the move was kept.'),
        s('B', one(moveChange('R7', 22, 21)).split('; ').slice(0, 2).join('; ') + ';', 'Moves R7 · takes a place in 21: UPDATE 0', ['UPDATE 1', 'UPDATE 0'], moveStart, 'Mina’s transaction was rolled back before it changed anything, so R8 is still in class 21 and class 21 is still full. Tariq’s guard changes no row.'),
        s('B', 'ROLLBACK;', 'Full · ROLLBACK', ['ROLLBACK'], moveStart, 'Tariq’s move is a business rejection: class 21 is full. It rolls back, undoing its change to R7.'),
        s('A', `BEGIN; ${lockRow(21)} ${lockRow(22)} ${one(moveChange('R8', 21, 22))} COMMIT;`, 'Whole move again · COMMIT', ['BEGIN', '21', '22', 'UPDATE 1', 'UPDATE 1', 'UPDATE 1', 'COMMIT'], { left21: 1, left22: 1, bookings: ['R7 in 22', 'R8 in 22'] }, 'Mina’s application runs her whole move again from BEGIN. It commits.'),
      ],
    },
    ordered: {
      label: 'Both lock class 21 first', protection: 'Both moves lock class 21, then class 22',
      summary: 'Tariq’s move waited for class 21 before holding anything; Mina’s move committed, then Tariq’s.',
      steps: [
        s('A', `BEGIN; ${lockRow(21)}`, 'BEGIN · locks class 21', ['BEGIN', '21'], moveStart, 'Mina’s move locks class 21 first.'),
        s('B', `BEGIN; ${lockRow(21)}`, 'BEGIN · locks class 21: waits', null, moveStart, 'Tariq’s move also starts with class 21, so it waits before holding anything.', { waits: true }),
        s('A', lockRow(22), 'Locks class 22', ['22'], moveStart, 'Nobody holds class 22, so Mina’s move gets it at once.'),
        s('A', one(moveChange('R8', 21, 22)), 'Moves R8 · takes in 22 · frees 21', ['UPDATE 1', 'UPDATE 1', 'UPDATE 1'], moveStart, 'Both guards pass: R8 is in class 21 and class 22 has a place.'),
        s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { left21: 1, left22: 1, bookings: ['R7 in 22', 'R8 in 22'] }, 'Mina’s move commits and releases both rows.'),
        s('B', null, 'Locks class 21', ['BEGIN', '21'], { left21: 1, left22: 1, bookings: ['R7 in 22', 'R8 in 22'] }, 'Tariq’s move gets class 21.', { collect: true }),
        s('B', lockRow(22), 'Locks class 22', ['22'], { left21: 1, left22: 1, bookings: ['R7 in 22', 'R8 in 22'] }, 'Then class 22.'),
        s('B', one(moveChange('R7', 22, 21)), 'Moves R7 · takes in 21 · frees 22', ['UPDATE 1', 'UPDATE 1', 'UPDATE 1'], { left21: 1, left22: 1, bookings: ['R7 in 22', 'R8 in 22'] }, 'Its guards are checked against the committed rows: R7 is in 22, and Mina’s move freed a place in 21.'),
        s('B', 'COMMIT;', 'COMMIT', ['COMMIT'], { left21: 0, left22: 2, bookings: ['R7 in 21', 'R8 in 22'] }, 'Both moves commit. The same lock order turned the cycle into a queue.'),
      ],
    },
  },
};
figureOptions.deadlock = { move: ['opposite', 'ordered'] };
