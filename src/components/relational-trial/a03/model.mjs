// Teaching model for "Making concurrent changes correct" (relational trial a03).
// Every figure and table in the article reads its rows, schedules and outcomes
// from this file. verify.mjs replays each schedule step by step against a
// disposable PostgreSQL 18 server and checks every output and final state here.

export const customers = [
  { customer_id: 1, name: 'Mina' },
  { customer_id: 2, name: 'Arun' },
];
export const classes = [
  { class_id: 21, title: 'Tea tasting', capacity: 1, remaining: 1 },
  { class_id: 22, title: 'Mug painting', capacity: 3, remaining: 2 },
];
export const reservations = [
  { request_id: 'R7', class_id: 22, owner_id: 2 },
];
export const instructors = [
  { class_id: 21, person: 'Lena', available: true },
  { class_id: 21, person: 'Tariq', available: true },
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
INSERT INTO customers VALUES (1, 'Mina'), (2, 'Arun');
INSERT INTO classes VALUES (21, 'Tea tasting', 1, 1), (22, 'Mug painting', 3, 2);
INSERT INTO reservations VALUES ('R7', 22, 2);
INSERT INTO instructors VALUES (21, 'Lena', true), (21, 'Tariq', true);`;

// The complete booking: take a place and record its owner in one statement.
export const book = (request = 'R8', classId = 21, owner = 1) => `WITH taken AS (
  UPDATE classes
  SET remaining = remaining - 1
  WHERE class_id = ${classId} AND remaining > 0
  RETURNING class_id
)
INSERT INTO reservations (request_id, class_id, owner_id)
SELECT '${request}', class_id, ${owner} FROM taken
RETURNING request_id;`;
const oneLine = sql => sql.replace(/\s+/g, ' ').trim();

export const twoStep = `BEGIN;
UPDATE classes
SET remaining = remaining - 1
WHERE class_id = 22 AND remaining > 0
RETURNING remaining;        -- 1: a place was taken
INSERT INTO reservations (request_id, class_id, owner_id)
VALUES ('R12', 22, 2);      -- Arun already holds R7 in class 22
-- ERROR:  duplicate key value violates unique constraint
--         "reservations_class_id_owner_id_key"   (SQLSTATE 23505)
SELECT remaining FROM classes WHERE class_id = 22;
-- ERROR:  current transaction is aborted, commands ignored
--         until end of transaction block          (SQLSTATE 25P02)
COMMIT;
-- PostgreSQL replies ROLLBACK`;

export const invariantCheck = `SELECT c.class_id, c.capacity, c.remaining,
       count(r.request_id) AS booked,
       c.remaining + count(r.request_id) = c.capacity AS rule_holds
FROM classes AS c
LEFT JOIN reservations AS r USING (class_id)
GROUP BY c.class_id
ORDER BY c.class_id;`;

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
    b: 'B · Arun books (R9)',
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
          s('B', `BEGIN; ${placeRead}`, 'BEGIN · reads remaining: 0', ['BEGIN', '0'], { remaining: 0, bookings: ['R8'] }, 'Arun’s transaction starts after Mina’s has finished, so it reads 0.'),
          s('B', 'ROLLBACK;', 'Full · ROLLBACK', ['ROLLBACK'], { remaining: 0, bookings: ['R8'] }, 'Arun is told the class is full. Run one at a time, the same code keeps the rule.'),
        ],
      },
      interleaved: {
        label: 'Both read before either writes', protection: 'Read, then write the computed value',
        steps: [
          s('A', `BEGIN; ${placeRead}`, 'BEGIN · reads remaining: 1', ['BEGIN', '1'], { remaining: 1, bookings: [] }, 'Mina’s transaction reads one place left.'),
          s('B', `BEGIN; ${placeRead}`, 'BEGIN · reads remaining: 1', ['BEGIN', '1'], { remaining: 1, bookings: [] }, 'Before Mina’s transaction writes anything, Arun’s reads the same committed value: one place left.'),
          s('A', writeZero('R8', 1), 'Writes remaining = 0 · inserts R8', ['UPDATE 1', 'INSERT 0 1'], { remaining: 1, bookings: [] }, 'Mina’s transaction writes the value it computed and records her booking.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 0, bookings: ['R8'] }, 'Mina’s booking commits. Arun’s transaction is still working from the 1 it read.'),
          s('B', writeZero('R9', 2), 'Writes remaining = 0 · inserts R9', ['UPDATE 1', 'INSERT 0 1'], { remaining: 0, bookings: ['R8'] }, 'Arun’s transaction writes 1 − 1 = 0 over the 0 already there, and records his booking. Nothing in the database objects: the value is in range and R9 is a new row.'),
          s('B', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 0, bookings: ['R8', 'R9'] }, 'Both bookings are committed for one place. Every statement succeeded.'),
        ],
      },
      conditional: {
        label: 'Both start together', protection: 'One conditional statement',
        steps: [
          s('A', `BEGIN; ${oneLine(book('R8', 21, 1))}`, 'BEGIN · conditional booking returns R8', ['BEGIN', 'R8', 'INSERT 0 1'], { remaining: 1, bookings: [] }, 'One statement checks remaining > 0, takes the place and inserts R8. Mina’s transaction now holds a lock on the class 21 row.'),
          s('B', `BEGIN; ${oneLine(book('R9', 21, 2))}`, 'BEGIN · same statement for R9: waits', null, { remaining: 1, bookings: [] }, 'Arun’s identical statement reaches the class 21 row and waits for Mina’s transaction to finish.', { waits: true }),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 0, bookings: ['R8'] }, 'Mina’s booking commits and her lock is released.'),
          s('B', null, 'Rechecks remaining > 0 against 0: no place, no row inserted', ['BEGIN', 'INSERT 0 0'], { remaining: 0, bookings: ['R8'] }, 'Arun’s statement resumes. At Read Committed, PostgreSQL rechecks its condition against the committed row, finds 0 and inserts nothing.', { collect: true }),
          s('B', 'ROLLBACK;', 'Empty result · ROLLBACK', ['ROLLBACK'], { remaining: 0, bookings: ['R8'] }, 'An empty result is the business answer “full”. Arun is told so; nothing was half-done.'),
        ],
      },
      serializable: {
        label: 'Both read before either writes', protection: 'Read, then write, at Serializable',
        steps: [
          s('A', `${serial} ${placeRead}`, 'BEGIN SERIALIZABLE · reads 1', ['BEGIN', '1'], { remaining: 1, bookings: [] }, 'The same read-then-write code, run at PostgreSQL’s Serializable level.'),
          s('B', `${serial} ${placeRead}`, 'BEGIN SERIALIZABLE · reads 1', ['BEGIN', '1'], { remaining: 1, bookings: [] }, 'Both transactions read one place left.'),
          s('A', writeZero('R8', 1), 'Writes remaining = 0 · inserts R8', ['UPDATE 1', 'INSERT 0 1'], { remaining: 1, bookings: [] }, 'Mina’s transaction writes first and holds the row.'),
          s('B', 'UPDATE classes SET remaining = 0 WHERE class_id = 21;', 'Writes remaining = 0: waits', null, { remaining: 1, bookings: [] }, 'Arun’s update waits for Mina’s transaction.', { waits: true }),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { remaining: 0, bookings: ['R8'] }, 'Mina’s booking commits.'),
          s('B', null, 'Error 40001: could not serialize access', ['ERROR:  40001'], { remaining: 0, bookings: ['R8'] }, 'The row changed after Arun’s transaction took its snapshot, so PostgreSQL refuses the update instead of overwriting it.', { collect: true }),
          s('B', `ROLLBACK; ${serial} ${placeRead} ROLLBACK;`, 'ROLLBACK · whole retry reads 0 · full', ['ROLLBACK', 'BEGIN', '0', 'ROLLBACK'], { remaining: 0, bookings: ['R8'] }, 'Arun’s application rolls back and runs the whole transaction again. The new attempt reads 0 and reports the class full.'),
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
    b: 'B · Tariq asks for leave',
    stateHeading: 'Available for class 21',
    rule: 'at least one instructor available',
    initial: { available: ['Lena', 'Tariq'] },
    options: {
      serial: {
        label: 'One after the other', protection: 'Count, then update your own row',
        steps: [
          s('A', `BEGIN; ${countAvailable}`, 'BEGIN · counts available: 2', ['BEGIN', '2'], { available: ['Lena', 'Tariq'] }, 'Lena’s transaction counts two available instructors, so she may go.'),
          s('A', oneLine(leave('Lena')), 'Marks Lena unavailable', ['UPDATE 1'], { available: ['Lena', 'Tariq'] }, 'It changes only Lena’s row.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: ['Tariq'] }, 'Lena’s leave commits.'),
          s('B', `BEGIN; ${countAvailable}`, 'BEGIN · counts available: 1', ['BEGIN', '1'], { available: ['Tariq'] }, 'Tariq’s transaction starts afterwards and counts one.'),
          s('B', 'ROLLBACK;', 'Declined · ROLLBACK', ['ROLLBACK'], { available: ['Tariq'] }, 'Tariq’s request is declined. Run one at a time, the rule holds.'),
        ],
      },
      interleaved: {
        label: 'Both read before either writes', protection: 'Count, then update your own row',
        steps: [
          s('A', `BEGIN; ${countAvailable}`, 'BEGIN · counts available: 2', ['BEGIN', '2'], { available: ['Lena', 'Tariq'] }, 'Lena’s transaction counts two available instructors.'),
          s('B', `BEGIN; ${countAvailable}`, 'BEGIN · counts available: 2', ['BEGIN', '2'], { available: ['Lena', 'Tariq'] }, 'Tariq’s transaction counts the same two.'),
          s('A', oneLine(leave('Lena')), 'Marks Lena unavailable', ['UPDATE 1'], { available: ['Lena', 'Tariq'] }, 'Lena’s transaction changes Lena’s row.'),
          s('B', oneLine(leave('Tariq')), 'Marks Tariq unavailable', ['UPDATE 1'], { available: ['Lena', 'Tariq'] }, 'Tariq’s transaction changes a different row, so it does not wait.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: ['Tariq'] }, 'Lena’s leave commits.'),
          s('B', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: [] }, 'Tariq’s leave commits too. Nobody is left to teach class 21, and no two writes ever touched the same row.'),
        ],
      },
      lockrows: {
        label: 'Both start together', protection: 'Lock the rows you counted',
        steps: [
          s('A', `BEGIN; ${lockAvailable}`, 'BEGIN · locks available rows: Lena, Tariq', ['BEGIN', 'Lena', 'Tariq'], { available: ['Lena', 'Tariq'] }, 'Lena’s transaction reads the available instructors with FOR UPDATE, locking both rows, and counts two.'),
          s('B', `BEGIN; ${lockAvailable}`, 'BEGIN · same locking read: waits', null, { available: ['Lena', 'Tariq'] }, 'Tariq’s locking read reaches the same rows and waits.', { waits: true }),
          s('A', oneLine(leave('Lena')), 'Marks Lena unavailable', ['UPDATE 1'], { available: ['Lena', 'Tariq'] }, 'Lena’s transaction changes her row.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: ['Tariq'] }, 'Lena’s leave commits and both locks are released.'),
          s('B', null, 'Locks one row: Tariq', ['BEGIN', 'Tariq'], { available: ['Tariq'] }, 'Tariq’s read resumes. Lena’s row no longer matches “available”, so it returns only Tariq: a count of one.', { collect: true }),
          s('B', 'ROLLBACK;', 'Declined · ROLLBACK', ['ROLLBACK'], { available: ['Tariq'] }, 'Tariq’s request is declined. The rule holds, provided every writer takes these locks.'),
        ],
      },
      coordination: {
        label: 'Both start together', protection: 'Lock the class row first',
        steps: [
          s('A', `BEGIN; ${lockClass}`, 'BEGIN · locks class 21', ['BEGIN', '21'], { available: ['Lena', 'Tariq'] }, 'Lena’s transaction first locks the class 21 row, a stable row every change to the rule agrees to take.'),
          s('B', `BEGIN; ${lockClass}`, 'BEGIN · locks class 21: waits', null, { available: ['Lena', 'Tariq'] }, 'Tariq’s transaction asks for the same row and waits before it has counted anything.', { waits: true }),
          s('A', `${countAvailable} ${oneLine(leave('Lena'))}`, 'Counts 2 · marks Lena unavailable', ['2', 'UPDATE 1'], { available: ['Lena', 'Tariq'] }, 'Holding the class row, Lena’s transaction counts two and changes her row.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: ['Tariq'] }, 'Lena’s leave commits and the class row is released.'),
          s('B', null, 'Locks class 21', ['BEGIN', '21'], { available: ['Tariq'] }, 'Tariq’s transaction now holds the class row. It has not counted yet.', { collect: true }),
          s('B', countAvailable, 'Counts available: 1', ['1'], { available: ['Tariq'] }, 'Its count is a new statement, so at Read Committed it sees Lena’s committed leave: one.'),
          s('B', 'ROLLBACK;', 'Declined · ROLLBACK', ['ROLLBACK'], { available: ['Tariq'] }, 'Tariq’s request is declined. The rule holds, provided every writer locks the class row first.'),
        ],
      },
      serializable: {
        label: 'Both read before either writes', protection: 'Count, then update, at Serializable',
        steps: [
          s('A', `${serial} ${countAvailable}`, 'BEGIN SERIALIZABLE · counts 2', ['BEGIN', '2'], { available: ['Lena', 'Tariq'] }, 'The original count-then-update code, run at Serializable.'),
          s('B', `${serial} ${countAvailable}`, 'BEGIN SERIALIZABLE · counts 2', ['BEGIN', '2'], { available: ['Lena', 'Tariq'] }, 'Both transactions count two. Neither waits.'),
          s('A', oneLine(leave('Lena')), 'Marks Lena unavailable', ['UPDATE 1'], { available: ['Lena', 'Tariq'] }, 'Lena’s transaction changes her row.'),
          s('B', oneLine(leave('Tariq')), 'Marks Tariq unavailable', ['UPDATE 1'], { available: ['Lena', 'Tariq'] }, 'Tariq’s transaction changes his row. Both updates succeed.'),
          s('A', 'COMMIT;', 'COMMIT', ['COMMIT'], { available: ['Tariq'] }, 'Lena’s leave commits.'),
          s('B', 'COMMIT;', 'COMMIT fails: error 40001', ['ERROR:  40001'], { available: ['Tariq'] }, 'PostgreSQL has tracked that each transaction read a row the other changed. No one-at-a-time order explains both decisions, so it refuses Tariq’s commit. His successful UPDATE did not mean his leave was accepted.'),
          s('B', `${serial} ${countAvailable} ROLLBACK;`, 'Whole retry counts 1 · declined', ['BEGIN', '1', 'ROLLBACK'], { available: ['Tariq'] }, 'The application runs Tariq’s whole transaction again. The new count is one, so it declines.'),
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
export const protectLabel = { interleaved: 'No protection' };

export function stateCells(scenario, state) {
  if (scenario === 'staff') return [state.available.length ? state.available.join(', ') : 'nobody'];
  return [String(state.remaining), state.bookings.length ? state.bookings.join(', ') : 'none'];
}
export function stateHeadings(scenario) {
  return scenario === 'staff' ? ['Available'] : ['Places left', 'Bookings'];
}
export function verdict(scenarioId, state) {
  if (scenarioId === 'staff') {
    const n = state.available.length;
    return { holds: n >= 1, text: n >= 1 ? `Rule holds: ${n} instructor available.` : 'Rule broken: no instructor is available for class 21.' };
  }
  const capacity = scenarioId === 'place' ? 1 : 3;
  const sum = state.remaining + state.bookings.length;
  if (scenarioId === 'duplicate') {
    const mine = state.bookings.filter(id => id !== 'R7').length;
    return mine > 1
      ? { holds: false, text: `Rule broken: Mina holds ${mine} bookings in class 22, though ${state.remaining} + ${state.bookings.length} = capacity ${capacity}.` }
      : { holds: true, text: `Rules hold: one booking for Mina, and ${state.remaining} + ${state.bookings.length} = capacity ${capacity}.` };
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
  select: 'SELECT remaining FROM classes WHERE class_id = 21;',
  forupdate: 'SELECT remaining FROM classes WHERE class_id = 21 FOR UPDATE;',
  conditional: 'UPDATE classes SET remaining = remaining - 1 WHERE class_id = 21 AND remaining > 0 RETURNING remaining;',
};
// versions: newest last. status: 'committed' | 'pending' | 'old'.
export function versionFrames(choice) {
  const bLabel = { select: 'SELECT remaining', forupdate: 'SELECT … FOR UPDATE', conditional: 'UPDATE … WHERE remaining > 0' }[choice];
  const waits = choice !== 'select';
  return [
    { title: 'Before either transaction', versions: [{ value: 1, status: 'committed', by: 'earlier commit' }], a: 'Not started', b: 'Not started', note: 'Class 21 has one committed version of its row: one place left.' },
    { title: 'A changes the row', versions: [{ value: 1, status: 'committed', by: 'earlier commit' }, { value: 0, status: 'pending', by: 'written by A' }], a: 'UPDATE … SET remaining = 0 · holds the row lock', b: 'Not started', note: 'A’s update writes a new version beside the old one and locks the row. Other sessions still treat the old version as the committed state.' },
    { title: 'B runs its statement', versions: [{ value: 1, status: 'committed', by: 'earlier commit' }, { value: 0, status: 'pending', by: 'written by A' }], a: 'Still open', b: waits ? `${bLabel} · waits for A` : `${bLabel} · returns 1 at once`, wait: waits, note: waits ? 'B’s statement wants to change or lock the row, so it must wait to learn whether A’s version will commit.' : 'An ordinary read takes the newest committed version it may see. It does not wait for A and does not lock anything.' },
    { title: 'A inserts R8 and commits', versions: [{ value: 1, status: 'old', by: 'kept until no reader needs it' }, { value: 0, status: 'committed', by: 'written by A' }], a: 'COMMIT · lock released', b: waits ? 'Released' : 'Its 1 was already returned', note: 'A’s version is now the committed one. The old version stays until no snapshot can need it, then VACUUM removes it.' },
    { title: 'What B ends with', versions: [{ value: 1, status: 'old', by: 'kept until no reader needs it' }, { value: 0, status: 'committed', by: 'written by A' }], a: 'Finished', b: { select: 'Earlier result: 1 · a new SELECT returns 0', forupdate: 'Returns remaining = 0 and locks the row', conditional: 'Rechecks remaining > 0 against 0 · changes 0 rows' }[choice], done: true, note: { select: 'B’s 1 was true when read and stale soon after. Acting on it later would repeat the race in Figure 2.', forupdate: 'The locking read waited, then returned the newest committed version. B can decide on 0 while holding the row.', conditional: 'The check and the change ran against the same current row, so B takes no place it does not have.' }[choice] },
  ];
}

// ---------------------------------------------------------------------------
// Tables checked by verify.mjs.
// ---------------------------------------------------------------------------
// How Arun's failed duplicate attempt on class 22 can end (class 22 starts at 2 left, R7).
export const endings = [
  { id: 'rollback', ending: 'The error aborts the transaction. COMMIT is answered with ROLLBACK.', remaining: 2, bookings: ['R7'], holds: true },
  { id: 'savepoint-late', ending: 'A savepoint taken after the update. The application rolls back to it, then commits.', remaining: 1, bookings: ['R7'], holds: false },
  { id: 'savepoint-early', ending: 'A savepoint taken before the update. The application rolls back to it, then commits.', remaining: 2, bookings: ['R7'], holds: true },
];

// What each PostgreSQL level did with the unprotected, interleaved schedules of Figure 2.
export const levels = [
  { level: 'Read Committed (the default)', place: { result: 'Both bookings commit', holds: false }, staff: { result: 'Both leaves commit', holds: false } },
  { level: 'Repeatable Read', place: { result: 'Arun’s update fails with 40001', holds: true }, staff: { result: 'Both leaves commit', holds: false } },
  { level: 'Serializable', place: { result: 'Arun’s update fails with 40001', holds: true }, staff: { result: 'Tariq’s COMMIT fails with 40001', holds: true } },
];

// Moving bookings between classes 21 and 22, for the deadlock in the abort section.
// Each move locks both class rows, then changes them. Mina moves R8 from 21 to 22;
// Arun moves R7 from 22 to 21.
const lockRow = id => `SELECT class_id FROM classes WHERE class_id = ${id} FOR UPDATE;`;
export const moveSql = {
  mina: { from: 21, to: 22, request: 'R8' },
  arun: { from: 22, to: 21, request: 'R7' },
};
for (const move of Object.values(moveSql)) {
  move.lock = lockRow;
  move.change = `UPDATE classes SET remaining = remaining + 1 WHERE class_id = ${move.from};
UPDATE classes SET remaining = remaining - 1 WHERE class_id = ${move.to} AND remaining > 0;
UPDATE reservations SET class_id = ${move.to} WHERE request_id = '${move.request}';`;
}
export const moveListing = `BEGIN;
SELECT class_id FROM classes WHERE class_id = 21 FOR UPDATE;
SELECT class_id FROM classes WHERE class_id = 22 FOR UPDATE;
-- Both class rows are held. Now decide and change:
${moveSql.mina.change}
-- If the second UPDATE changed no row, the class is full: ROLLBACK.
COMMIT;`;
