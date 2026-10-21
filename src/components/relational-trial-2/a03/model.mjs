// Making concurrent changes correct (a03): the rows, statements and outcomes behind
// every figure. Figures render from these steps; verify.mjs runs the same SQL in
// real PostgreSQL 18 sessions and checks each result and the committed rows after
// every step. Rows come from docs/coverage/relational-example.md (class bookings).

export const customers = [
  { customer_id: 1, name: 'Mina Shah' },
  { customer_id: 2, name: 'Tariq Aziz' },
  { customer_id: 3, name: 'Edda Berg' },
];
export const customerName = id => customers.find(c => c.customer_id === id)?.name.split(' ')[0] ?? `customer ${id}`;

export const start = {
  classes: [
    { class_id: 21, title: 'Tea tasting', capacity: 1, remaining: 1 },
    { class_id: 22, title: 'Mug painting', capacity: 3, remaining: 2 },
  ],
  reservations: [{ request_id: 'R7', class_id: 22, owner_id: 2 }],
  instructors: [
    { class_id: 21, person: 'Lena', available: true },
    { class_id: 21, person: 'Ravi', available: true },
  ],
};

export const schemaSql = `CREATE TABLE customers (
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
);`;

const q = s => `'${s}'`;
export const seedSql = [
  `INSERT INTO customers VALUES ${customers.map(c => `(${c.customer_id}, ${q(c.name)})`).join(', ')};`,
  `INSERT INTO classes VALUES ${start.classes.map(c => `(${c.class_id}, ${q(c.title)}, ${c.capacity}, ${c.remaining})`).join(', ')};`,
  `INSERT INTO reservations VALUES ${start.reservations.map(r => `(${q(r.request_id)}, ${r.class_id}, ${r.owner_id})`).join(', ')};`,
  `INSERT INTO instructors VALUES ${start.instructors.map(i => `(${i.class_id}, ${q(i.person)}, ${i.available})`).join(', ')};`,
].join('\n');

// The statements the article shows. Figures and listings use these strings.
export const sql = {
  take: id => `UPDATE classes SET remaining = remaining - 1\nWHERE class_id = ${id} AND remaining > 0\nRETURNING remaining;`,
  readRemaining: id => `SELECT remaining FROM classes WHERE class_id = ${id};`,
  writeRemaining: (id, value) => `UPDATE classes SET remaining = ${value} WHERE class_id = ${id};`,
  subtract: id => `UPDATE classes SET remaining = remaining - 1 WHERE class_id = ${id};`,
  book: (request, id, owner) => `INSERT INTO reservations VALUES ('${request}', ${id}, ${owner});`,
  countAvailable: `SELECT count(*) FROM instructors\nWHERE class_id = 21 AND available;`,
  leave: person => `UPDATE instructors SET available = false\nWHERE class_id = 21 AND person = '${person}';`,
  lockClass: id => `SELECT class_id FROM classes WHERE class_id = ${id} FOR UPDATE;`,
  lookup: request => `SELECT class_id, owner_id FROM reservations\nWHERE request_id = '${request}';`,
  free: id => `UPDATE classes SET remaining = remaining + 1 WHERE class_id = ${id};`,
  move: (request, to) => `UPDATE reservations SET class_id = ${to} WHERE request_id = '${request}';`,
};

// The rules every committed state must keep.
export function rules(db) {
  const booked = id => db.reservations.filter(r => r.class_id === id).length;
  const classRules = db.classes.map(c => ({
    id: `class-${c.class_id}`,
    text: `Class ${c.class_id}: ${c.remaining} remaining + ${booked(c.class_id)} booked = ${c.remaining + booked(c.class_id)}, capacity ${c.capacity}`,
    ok: c.remaining + booked(c.class_id) === c.capacity,
  }));
  const available = db.instructors.filter(i => i.class_id === 21 && i.available).length;
  return {
    classes: classRules,
    instructors: { id: 'instructors', text: `Class 21 has ${available} available instructor${available === 1 ? '' : 's'}; it needs at least 1`, ok: available >= 1 },
  };
}

// ---- Building a figure's steps -------------------------------------------
// A step is one statement (or one event) in one lane. `db` is the committed
// state after the step, which verify.mjs compares with the real database.
//   lane: 'A' | 'B' | null (an event outside both sessions)
//   run: SQL sent by that lane at this step; `resume` marks the step at which an
//        earlier waiting statement in that lane finishes
//   expect: what PostgreSQL returns: { rows } | { count } | { error } | { tag } | { waits: true }
//   show / out: the short statement and result the figure prints
//   pending: that lane's uncommitted change, as the figure states it
//   text: what this step shows

const clone = db => structuredClone(db);
export const apply = {
  remaining: (id, value) => db => { db.classes.find(c => c.class_id === id).remaining = value; },
  book: (request, id, owner) => db => { db.reservations.push({ request_id: request, class_id: id, owner_id: owner }); },
  unavailable: person => db => { db.instructors.find(i => i.person === person).available = false; },
  move: (request, from, to) => db => {
    db.reservations.find(r => r.request_id === request).class_id = to;
    db.classes.find(c => c.class_id === from).remaining += 1;
    db.classes.find(c => c.class_id === to).remaining -= 1;
  },
  capacity: (id, value) => db => { db.classes.find(c => c.class_id === id).capacity = value; },
};

function build(defs, initial = start) {
  let db = clone(initial);
  return defs.map(def => {
    if (def.commit) { db = clone(db); for (const change of def.commit) change(db); }
    return { ...def, db };
  });
}

const RC = 'BEGIN ISOLATION LEVEL READ COMMITTED;';
const RR = 'BEGIN ISOLATION LEVEL REPEATABLE READ;';
const SER = 'BEGIN ISOLATION LEVEL SERIALIZABLE;';

// Figure 1: Mina's double click in class 22, R10 then R11.
const twoClicks = transaction => build([
  { lane: null, text: 'Class 22 has two places left. Tariq holds R7. Mina clicks Book, then clicks again by mistake: requests R10 and R11.' },
  {
    lane: 'A', run: (transaction ? 'BEGIN; ' : '') + sql.take(22), show: 'Take a place in class 22', out: 'remaining is now 1', expect: { rows: [[1]] },
    commit: transaction ? undefined : [apply.remaining(22, 1)], pending: transaction ? 'class 22 remaining 1' : '',
    text: transaction ? 'R10 starts a transaction and takes a place. Nobody else can see the change yet.' : 'R10 takes a place. With no transaction, this statement commits as soon as it finishes.',
  },
  {
    lane: 'A', run: sql.book('R10', 22, 1) + (transaction ? ' COMMIT;' : ''), show: transaction ? 'Insert R10, then COMMIT' : 'Insert R10', out: transaction ? 'committed' : 'inserted, committed', expect: transaction ? { tag: 'COMMIT' } : { count: 1 },
    commit: transaction ? [apply.remaining(22, 1), apply.book('R10', 22, 1)] : [apply.book('R10', 22, 1)], pending: '',
    text: 'R10 records Mina’s booking. Both of its changes are now committed, and the rule holds.',
  },
  {
    lane: 'A', run: (transaction ? 'BEGIN; ' : '') + sql.take(22), show: 'Take a place in class 22 (R11)', out: 'remaining is now 0', expect: { rows: [[0]] },
    commit: transaction ? undefined : [apply.remaining(22, 0)], pending: transaction ? 'class 22 remaining 0' : '',
    text: transaction ? 'The second click, R11, starts its own transaction and takes another place.' : 'The second click, R11, takes another place, and that change commits at once.',
  },
  {
    lane: 'A', run: sql.book('R11', 22, 1), show: 'Insert R11', out: 'refused: Mina already has a place (23505)', expect: { error: '23505' }, status: 'error',
    pending: transaction ? 'class 22 remaining 0 · transaction failed' : '',
    text: 'The insert breaks the rule that a customer books a class once, so the unique constraint refuses it.',
  },
  transaction
    ? { lane: 'A', run: 'COMMIT;', show: 'COMMIT', out: 'reported as ROLLBACK', expect: { tag: 'ROLLBACK' }, pending: '', text: 'The failed transaction cannot commit. PostgreSQL rolls it back, so R11’s place comes back and the rule still holds.' }
    : { lane: null, text: 'Nothing undoes R11’s first statement. Class 22 shows no places left, yet only two people are booked: a place has vanished.' },
]);

// Figure 2: Mina (R8) and Tariq (R9) race for class 21's last place.
const race = {
  'read-write': build([
    { lane: 'A', run: `${RC} ${sql.readRemaining(21)}`, show: 'BEGIN; read remaining', out: '1', expect: { rows: [[1]] }, text: 'Mina’s request reads class 21: one place left.' },
    { lane: 'B', run: `${RC} ${sql.readRemaining(21)}`, show: 'BEGIN; read remaining', out: '1', expect: { rows: [[1]] }, text: 'Tariq’s request reads the same row and also sees one place.' },
    { lane: 'A', run: sql.writeRemaining(21, 0), show: 'write remaining = 0', out: '1 row updated', expect: { count: 1 }, pending: 'class 21 remaining 0', text: 'Mina’s application subtracts one from what it read and writes the answer, 0.' },
    { lane: 'A', run: sql.book('R8', 21, 1), show: 'insert R8', out: 'inserted', expect: { count: 1 }, pending: 'class 21 remaining 0 · R8', text: 'It records her booking, R8. Both changes are still uncommitted.' },
    { lane: 'B', run: sql.writeRemaining(21, 0), show: 'write remaining = 0', out: 'waiting for Mina', expect: { waits: true }, status: 'wait', text: 'Tariq’s application also computed 1 − 1 = 0. Its update waits, because Mina’s transaction has changed that row and hasn’t finished.' },
    { lane: 'A', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.remaining(21, 0), apply.book('R8', 21, 1)], text: 'Mina commits. Her transaction was correct on its own: one place taken, one booking recorded.' },
    { lane: 'B', resume: true, show: 'write remaining = 0', out: '1 row updated', expect: { count: 1 }, pending: 'class 21 remaining 0', text: 'Tariq’s update goes ahead. It writes 0 over Mina’s 0, a value worked out from a read that is now out of date.' },
    { lane: 'B', run: sql.book('R9', 21, 2), show: 'insert R9', out: 'inserted', expect: { count: 1 }, pending: 'class 21 remaining 0 · R9', text: 'It records R9. Nothing it has done breaks a constraint.' },
    { lane: 'B', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.book('R9', 21, 2)], text: 'Tariq commits too. One place now has two bookings.' },
  ]),
  subtract: build([
    { lane: 'A', run: `${RC} ${sql.readRemaining(21)}`, show: 'BEGIN; read remaining', out: '1', expect: { rows: [[1]] }, text: 'Mina’s request reads one place left.' },
    { lane: 'B', run: `${RC} ${sql.readRemaining(21)}`, show: 'BEGIN; read remaining', out: '1', expect: { rows: [[1]] }, text: 'Tariq’s request reads one place too.' },
    { lane: 'A', run: sql.subtract(21), show: 'remaining = remaining − 1', out: '1 row updated', expect: { count: 1 }, pending: 'class 21 remaining 0', text: 'This time the update subtracts one from whatever the row holds when it runs.' },
    { lane: 'A', run: sql.book('R8', 21, 1), show: 'insert R8', out: 'inserted', expect: { count: 1 }, pending: 'class 21 remaining 0 · R8', text: 'Mina’s request records R8.' },
    { lane: 'B', run: sql.subtract(21), show: 'remaining = remaining − 1', out: 'waiting for Mina', expect: { waits: true }, status: 'wait', text: 'Tariq’s update waits for Mina’s transaction to finish.' },
    { lane: 'A', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.remaining(21, 0), apply.book('R8', 21, 1)], text: 'Mina commits.' },
    { lane: 'B', resume: true, show: 'remaining = remaining − 1', out: 'refused: would be −1 (23514)', expect: { error: '23514' }, status: 'error', pending: 'transaction failed', text: 'Tariq’s update now subtracts from Mina’s committed 0. The result, −1, breaks the CHECK on remaining, so the statement fails.' },
    { lane: 'B', run: 'ROLLBACK;', show: 'ROLLBACK', out: 'rolled back', expect: { tag: 'ROLLBACK' }, pending: '', text: 'Tariq’s transaction ends with nothing changed. The rule holds, but his application received an error, not an answer.' },
  ]),
  condition: build([
    { lane: 'A', run: `${RC} ${sql.take(21)}`, show: 'BEGIN; take a place if remaining > 0', out: 'remaining is now 0', expect: { rows: [[0]] }, pending: 'class 21 remaining 0', text: 'Mina’s request asks for the change and its condition in one statement. A row came back, so she has the place.' },
    { lane: 'B', run: `${RC} ${sql.take(21)}`, show: 'BEGIN; take a place if remaining > 0', out: 'waiting for Mina', expect: { waits: true }, status: 'wait', text: 'Tariq’s identical statement waits, because Mina’s transaction has changed the row.' },
    { lane: 'A', run: sql.book('R8', 21, 1), show: 'insert R8', out: 'inserted', expect: { count: 1 }, pending: 'class 21 remaining 0 · R8', text: 'Mina’s request records R8 in the same transaction.' },
    { lane: 'A', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.remaining(21, 0), apply.book('R8', 21, 1)], text: 'Mina commits.' },
    { lane: 'B', resume: true, show: 'BEGIN; take a place if remaining > 0', out: 'no row: class full', expect: { rows: [] }, status: 'refused', text: 'PostgreSQL checks Tariq’s condition again against Mina’s committed row. remaining > 0 is now false, so no row changes and none comes back.' },
    { lane: 'B', run: 'ROLLBACK;', show: 'ROLLBACK', out: 'rolled back', expect: { tag: 'ROLLBACK' }, pending: '', text: 'No row means no place. Tariq’s request ends and tells him the class is full. Only R8 exists.' },
  ]),
  repeatable: build([
    { lane: 'A', run: `${RR} ${sql.readRemaining(21)}`, show: 'BEGIN (Repeatable Read); read remaining', out: '1', expect: { rows: [[1]] }, text: 'The same read-then-write steps, now at Repeatable Read. Mina’s request reads one place.' },
    { lane: 'B', run: `${RR} ${sql.readRemaining(21)}`, show: 'BEGIN (Repeatable Read); read remaining', out: '1', expect: { rows: [[1]] }, text: 'Tariq’s request reads one place. Each transaction now keeps the view it took at its first read.' },
    { lane: 'A', run: sql.writeRemaining(21, 0), show: 'write remaining = 0', out: '1 row updated', expect: { count: 1 }, pending: 'class 21 remaining 0', text: 'Mina’s request writes 0.' },
    { lane: 'A', run: sql.book('R8', 21, 1), show: 'insert R8', out: 'inserted', expect: { count: 1 }, pending: 'class 21 remaining 0 · R8', text: 'It records R8.' },
    { lane: 'B', run: sql.writeRemaining(21, 0), show: 'write remaining = 0', out: 'waiting for Mina', expect: { waits: true }, status: 'wait', text: 'Tariq’s update waits for Mina’s transaction.' },
    { lane: 'A', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.remaining(21, 0), apply.book('R8', 21, 1)], text: 'Mina commits.' },
    { lane: 'B', resume: true, show: 'write remaining = 0', out: 'refused: could not serialize (40001)', expect: { error: '40001' }, status: 'error', pending: 'transaction failed', text: 'The row changed after Tariq’s view was taken, so PostgreSQL refuses to let his transaction overwrite it.' },
    { lane: 'B', run: 'ROLLBACK;', show: 'ROLLBACK', out: 'rolled back', expect: { tag: 'ROLLBACK' }, pending: '', text: 'Tariq’s transaction ends. His application must start again from the read.' },
    { lane: 'B', run: `${RR} ${sql.readRemaining(21)}`, show: 'BEGIN again; read remaining', out: '0', expect: { rows: [[0]] }, text: 'The new attempt reads 0, so the application decides the class is full.' },
    { lane: 'B', run: 'ROLLBACK;', show: 'ROLLBACK', out: 'rolled back', expect: { tag: 'ROLLBACK' }, pending: '', text: 'Tariq is told the class is full. Only R8 exists.' },
  ]),
};

// Figure 3: Lena and Ravi each ask to stop teaching class 21.
const leaveSteps = (person, begin) => [
  { run: `${begin} ${sql.countAvailable}`, show: 'BEGIN; count available', out: '2', expect: { rows: [[2]] } },
  { run: sql.leave(person), show: `set ${person} unavailable`, out: '1 row updated', expect: { count: 1 }, pending: `${person} unavailable` },
];
const instructors = {
  repeatable: build([
    { lane: 'A', ...leaveSteps('Lena', RR)[0], text: 'Lena asks to stop teaching class 21. Her transaction counts the available instructors: two, so one may leave.' },
    { lane: 'B', ...leaveSteps('Ravi', RR)[0], text: 'Ravi asks at the same moment. His transaction also counts two.' },
    { lane: 'A', ...leaveSteps('Lena', RR)[1], text: 'Lena’s transaction marks Lena unavailable.' },
    { lane: 'B', ...leaveSteps('Ravi', RR)[1], text: 'Ravi’s transaction marks Ravi unavailable. It doesn’t wait: it changes a different row.' },
    { lane: 'A', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.unavailable('Lena')], text: 'Lena’s transaction commits. One instructor is left, which is allowed.' },
    { lane: 'B', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.unavailable('Ravi')], text: 'Ravi’s commits too. Each was correct on its own, and together they leave class 21 with nobody.' },
  ]),
  lock: build([
    { lane: 'A', run: `${RC} ${sql.lockClass(21)}`, show: 'BEGIN; lock class 21’s row', out: 'locked', expect: { rows: [[21]] }, text: 'This time every change to class 21’s instructors starts by locking class 21’s own row. Lena’s transaction takes it.' },
    { lane: 'A', run: sql.countAvailable, show: 'count available', out: '2', expect: { rows: [[2]] }, text: 'Lena’s transaction counts two available instructors.' },
    { lane: 'B', run: `${RC} ${sql.lockClass(21)}`, show: 'BEGIN; lock class 21’s row', out: 'waiting for Lena', expect: { waits: true }, status: 'wait', text: 'Ravi’s transaction asks for the same lock and waits, before it has counted anything.' },
    { lane: 'A', run: sql.leave('Lena'), show: 'set Lena unavailable', out: '1 row updated', expect: { count: 1 }, pending: 'Lena unavailable', text: 'Lena’s transaction marks Lena unavailable.' },
    { lane: 'A', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.unavailable('Lena')], text: 'Lena’s transaction commits and releases the lock.' },
    { lane: 'B', resume: true, show: 'BEGIN; lock class 21’s row', out: 'locked', expect: { rows: [[21]] }, text: 'Ravi’s transaction now has the lock.' },
    { lane: 'B', run: sql.countAvailable, show: 'count available', out: '1', expect: { rows: [[1]] }, text: 'Its count is a new statement, so at Read Committed it sees Lena’s commit: one instructor left.' },
    { lane: 'B', run: 'ROLLBACK;', show: 'ROLLBACK', out: 'declined', expect: { tag: 'ROLLBACK' }, pending: '', text: 'One is not more than one, so Ravi’s request is declined. Class 21 keeps Ravi.' },
  ]),
  'serializable-whole': build([
    { lane: 'A', ...leaveSteps('Lena', SER)[0], text: 'Both requests now run at Serializable. Lena’s transaction counts two.' },
    { lane: 'B', ...leaveSteps('Ravi', SER)[0], text: 'Ravi’s counts two.' },
    { lane: 'A', ...leaveSteps('Lena', SER)[1], text: 'Lena’s transaction marks Lena unavailable.' },
    { lane: 'B', ...leaveSteps('Ravi', SER)[1], text: 'Ravi’s marks Ravi unavailable. Nothing has waited or failed yet.' },
    { lane: 'A', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.unavailable('Lena')], text: 'Lena’s transaction commits first.' },
    { lane: 'B', run: 'COMMIT;', show: 'COMMIT', out: 'refused: could not serialize (40001)', expect: { error: '40001' }, status: 'error', pending: '', text: 'PostgreSQL has tracked that each transaction read a row the other changed. No one-at-a-time order explains both results, so Ravi’s commit fails and his transaction is rolled back.' },
    { lane: 'B', run: `${SER} ${sql.countAvailable}`, show: 'BEGIN again; count available', out: '1', expect: { rows: [[1]] }, text: 'Ravi’s application starts the whole transaction again. The new count is one.' },
    { lane: 'B', run: 'ROLLBACK;', show: 'ROLLBACK', out: 'declined', expect: { tag: 'ROLLBACK' }, pending: '', text: 'So it declines. Class 21 keeps Ravi.' },
  ]),
  'serializable-statement': build([
    { lane: 'A', ...leaveSteps('Lena', SER)[0], text: 'The same Serializable run. Lena’s transaction counts two.' },
    { lane: 'B', ...leaveSteps('Ravi', SER)[0], text: 'Ravi’s counts two.' },
    { lane: 'A', ...leaveSteps('Lena', SER)[1], text: 'Lena’s transaction marks Lena unavailable.' },
    { lane: 'B', ...leaveSteps('Ravi', SER)[1], text: 'Ravi’s marks Ravi unavailable.' },
    { lane: 'A', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.unavailable('Lena')], text: 'Lena’s transaction commits.' },
    { lane: 'B', run: 'COMMIT;', show: 'COMMIT', out: 'refused: could not serialize (40001)', expect: { error: '40001' }, status: 'error', pending: '', text: 'Ravi’s commit fails, as before.' },
    { lane: 'B', run: `${SER} ${sql.leave('Ravi')}`, show: 'BEGIN again; set Ravi unavailable', out: '1 row updated', expect: { count: 1 }, pending: 'Ravi unavailable', text: 'This time the application repeats only its write, in a new transaction. It keeps the decision it made from the old count of two and never counts again.' },
    { lane: 'B', run: 'COMMIT;', show: 'COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.unavailable('Ravi')], text: 'Nothing conflicts now, so it commits. The retry carried a stale decision into a new transaction, and class 21 has nobody.' },
  ]),
};

// Figure 4: the swap. R8 already holds class 21's place. Mina moves R8 from class 21
// to 22 while Tariq moves R7 from 22 to 21. Each move locks the classes it touches.
const afterR8 = build([{ commit: [apply.remaining(21, 0), apply.book('R8', 21, 1)] }])[0].db;
const moveRest = (request, from, to) => `${sql.free(from)} ${sql.take(to)} ${sql.move(request, to)} COMMIT;`;
const swap = {
  opposite: build([
    { lane: 'A', run: `${RC} ${sql.lockClass(21)}`, show: 'BEGIN; lock class 21', out: 'locked', expect: { rows: [[21]] }, holds: 'class 21', text: 'Mina’s move starts with the class she is leaving, 21, and locks its row.' },
    { lane: 'B', run: `${RC} ${sql.lockClass(22)}`, show: 'BEGIN; lock class 22', out: 'locked', expect: { rows: [[22]] }, holds: 'class 22', text: 'Tariq’s move starts with the class he is leaving, 22, and locks its row.' },
    { lane: 'B', run: sql.lockClass(21), show: 'lock class 21', out: 'waiting for Mina', expect: { waits: true }, status: 'wait', text: 'Tariq’s move asks for class 21 and waits, because Mina’s transaction holds it.' },
    { lane: 'A', run: sql.lockClass(22), show: 'lock class 22', out: 'waiting for Tariq', expect: { waits: true }, status: 'wait', text: 'Mina’s move asks for class 22 and waits for Tariq. Each now waits for the other, so neither can ever finish.' },
    { lane: 'B', resume: true, show: 'lock class 21', out: 'refused: deadlock (40P01)', expect: { error: '40P01' }, status: 'error', holds: '', text: 'After a second of waiting, PostgreSQL checks for a cycle, finds one and aborts one of the transactions. In this run it aborted Tariq’s, which had started waiting first, and released his lock on class 22.' },
    { lane: 'A', resume: true, show: 'lock class 22', out: 'locked', expect: { rows: [[22]] }, holds: 'class 21, class 22', text: 'Mina’s waiting request now gets class 22.' },
    { lane: 'A', run: moveRest('R8', 21, 22), show: 'free 21, take 22, move R8; COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, holds: '', commit: [apply.move('R8', 21, 22)], text: 'Mina’s move frees her place in 21, takes one in 22, moves R8 and commits.' },
    { lane: 'B', run: 'ROLLBACK;', show: 'ROLLBACK', out: 'rolled back', expect: { tag: 'ROLLBACK' }, text: 'Nothing of Tariq’s move remains. His application has to start the whole move again, and this time class 21 has a free place.' },
  ], afterR8),
  ordered: build([
    { lane: 'A', run: `${RC} ${sql.lockClass(21)}`, show: 'BEGIN; lock class 21', out: 'locked', expect: { rows: [[21]] }, holds: 'class 21', text: 'Now every move locks the lower class_id first. Mina’s move locks class 21.' },
    { lane: 'B', run: `${RC} ${sql.lockClass(21)}`, show: 'BEGIN; lock class 21', out: 'waiting for Mina', expect: { waits: true }, status: 'wait', text: 'Tariq’s move also starts with class 21, so it waits before it holds anything.' },
    { lane: 'A', run: sql.lockClass(22), show: 'lock class 22', out: 'locked', expect: { rows: [[22]] }, holds: 'class 21, class 22', text: 'Nobody holds class 22, so Mina’s move takes it at once.' },
    { lane: 'A', run: moveRest('R8', 21, 22), show: 'free 21, take 22, move R8; COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, holds: '', commit: [apply.move('R8', 21, 22)], text: 'Mina’s move frees her place in 21, takes one in 22, moves R8 and commits, releasing both locks.' },
    { lane: 'B', resume: true, show: 'BEGIN; lock class 21', out: 'locked', expect: { rows: [[21]] }, holds: 'class 21', text: 'Tariq’s move now gets class 21.' },
    { lane: 'B', run: sql.lockClass(22), show: 'lock class 22', out: 'locked', expect: { rows: [[22]] }, holds: 'class 21, class 22', text: 'Then class 22.' },
    { lane: 'B', run: moveRest('R7', 22, 21), show: 'free 22, take 21, move R7; COMMIT', out: 'committed', expect: { tag: 'COMMIT' }, holds: '', commit: [apply.move('R7', 22, 21)], text: 'Tariq’s move takes the place Mina freed in class 21 and commits. Both moves are done, and both classes still add up.' },
  ], afterR8),
};

// Figure 5: Mina's booking R8 when the reply to COMMIT is lost. Lane A is the first
// attempt; lane B is the service's repeat on a new connection. The first two options
// use a booking that takes the place before recording R8; the last two use the
// listing's booking, which records R8 first.
const placeFirst = [
  { lane: 'A', run: `${RC} ${sql.take(21)}`, show: 'BEGIN; take a place in class 21', out: 'remaining is now 0', expect: { rows: [[0]] }, pending: 'class 21 remaining 0', text: 'The booking service starts Mina’s booking, R8, and takes class 21’s last place.' },
  { lane: 'A', run: sql.book('R8', 21, 1), show: 'insert R8', out: 'inserted', expect: { count: 1 }, pending: 'class 21 remaining 0 · R8', text: 'It records R8 in the same transaction.' },
];
const recordFirst = [
  { lane: 'A', run: `${RC} ${sql.book('R8', 21, 1)}`, show: 'BEGIN; insert R8', out: 'inserted', expect: { count: 1 }, pending: 'R8', text: 'This time the booking records R8 before anything else.' },
  { lane: 'A', run: sql.take(21), show: 'take a place in class 21', out: 'remaining is now 0', expect: { rows: [[0]] }, pending: 'R8 · class 21 remaining 0', text: 'Then it takes class 21’s last place.' },
];
const lostCommit = {
  done: { lane: 'A', run: 'COMMIT;', action: 'commit-then-drop', show: 'COMMIT', out: 'no reply: connection lost', status: 'error', pending: '', commit: [apply.remaining(21, 0), apply.book('R8', 21, 1)], text: 'The service sends COMMIT. The database commits R8, then the connection fails before the reply arrives.' },
  held: { lane: 'A', action: 'commit-held', show: 'COMMIT', out: 'no reply: connection lost', status: 'error', text: 'The service sends COMMIT and the connection fails. The COMMIT has not reached the database yet, so the first attempt is still open there.' },
  never: { lane: 'A', run: 'COMMIT;', action: 'drop-before-commit', show: 'COMMIT', out: 'no reply: connection lost', status: 'error', pending: '', text: 'The service sends COMMIT, but the connection fails before the database receives it. The database rolls the first attempt back.' },
};
const blind = { lane: null, text: 'Whatever happened, the service sees the same thing: a broken connection and no answer. Mina is still waiting.' };
const arrives = { lane: 'A', run: 'COMMIT;', show: 'COMMIT reaches the database', out: 'committed', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.remaining(21, 0), apply.book('R8', 21, 1)], text: 'The first attempt’s COMMIT reaches the database late, and R8 commits.' };
const reply = {
  again: build([...placeFirst, lostCommit.done, blind,
    { lane: 'B', run: `${RC} ${sql.take(21)}`, show: 'BEGIN; take a place', out: 'no row: class full', expect: { rows: [] }, status: 'refused', text: 'The service treats the failure as a rollback and books again. No place is left, because R8 took it.' },
    { lane: 'B', run: 'ROLLBACK;', show: 'ROLLBACK', out: 'tells Mina: class full', expect: { tag: 'ROLLBACK' }, status: 'error', text: 'Mina is told the class is full, while the database holds her booking.' },
  ]),
  lookup: build([...placeFirst, lostCommit.held, blind,
    { lane: 'B', run: sql.lookup('R8'), show: 'look up R8', out: 'not found', expect: { rows: [] }, text: 'The service looks R8 up first. It isn’t there. That means only that the first attempt hasn’t committed yet.' },
    { lane: 'B', run: `${RC} ${sql.take(21)}`, show: 'BEGIN; take a place', out: 'waiting for the first attempt', expect: { waits: true }, status: 'wait', text: 'So the service books again. Its update waits, because the first attempt has changed class 21’s row and hasn’t ended.' },
    arrives,
    { lane: 'B', resume: true, show: 'BEGIN; take a place', out: 'no row: class full', expect: { rows: [] }, status: 'refused', text: 'The waiting update checks its condition against the committed row. No place is left.' },
    { lane: 'B', run: 'ROLLBACK;', show: 'ROLLBACK', out: 'tells Mina: class full', expect: { tag: 'ROLLBACK' }, status: 'error', text: 'Mina is told the class is full, while R8 holds her place. The lookup didn’t help.' },
  ]),
  claim: build([...recordFirst, lostCommit.held, blind,
    { lane: 'B', run: `${RC} ${sql.book('R8', 21, 1)}`, show: 'BEGIN; insert R8', out: 'waiting for the first attempt', expect: { waits: true }, status: 'wait', text: 'The service books again with the same request, R8, which the booking records first. The insert waits, because the first attempt has written R8 and hasn’t ended.' },
    arrives,
    { lane: 'B', resume: true, show: 'BEGIN; insert R8', out: 'refused: R8 exists (23505)', expect: { error: '23505' }, status: 'refused', text: 'The waiting insert now fails: R8 exists. That error is the answer the service needed.' },
    { lane: 'B', run: 'ROLLBACK;', show: 'ROLLBACK', out: 'tells Mina: booked', expect: { tag: 'ROLLBACK' }, text: 'The first attempt committed, so Mina is told she is booked. Nothing was booked twice.' },
  ]),
  'claim-lost': build([...recordFirst, lostCommit.never, blind,
    { lane: 'B', run: `${RC} ${sql.book('R8', 21, 1)}`, show: 'BEGIN; insert R8', out: 'inserted', expect: { count: 1 }, pending: 'R8', text: 'The service books again with R8. The first attempt has been rolled back, so the insert goes ahead. Had it still been open, the insert would have waited for it.' },
    { lane: 'B', run: sql.take(21), show: 'take a place in class 21', out: 'remaining is now 0', expect: { rows: [[0]] }, pending: 'R8 · class 21 remaining 0', text: 'It takes the place.' },
    { lane: 'B', run: 'COMMIT;', show: 'COMMIT', out: 'committed: tells Mina booked', expect: { tag: 'COMMIT' }, pending: '', commit: [apply.remaining(21, 0), apply.book('R8', 21, 1)], text: 'R8 commits, once, and Mina is told she is booked.' },
  ]),
};

export const figures = {
  clicks: {
    title: 'Mina’s double click in class 22',
    lanes: { A: 'Mina’s browser, R10 then R11' },
    tables: ['classes', 'reservations'],
    initial: 'separate',
    options: [
      { id: 'separate', label: 'Each statement on its own', steps: twoClicks(false) },
      { id: 'transaction', label: 'One transaction per booking', steps: twoClicks(true) },
    ],
  },
  race: {
    title: 'Mina and Tariq book class 21’s last place',
    lanes: { A: 'Mina, R8', B: 'Tariq, R9' },
    tables: ['classes', 'reservations'],
    initial: 'read-write',
    options: [
      { id: 'read-write', label: 'Read, then write the new value', steps: race['read-write'] },
      { id: 'subtract', label: 'Subtract one, no condition', steps: race.subtract },
      { id: 'condition', label: 'Change only if a place is left', steps: race.condition },
      { id: 'repeatable', label: 'Read, then write, at Repeatable Read', steps: race.repeatable },
    ],
  },
  instructors: {
    title: 'Lena and Ravi both ask to stop teaching class 21',
    lanes: { A: 'Lena’s request', B: 'Ravi’s request' },
    tables: ['instructors'],
    initial: 'repeatable',
    options: [
      { id: 'repeatable', label: 'Repeatable Read', steps: instructors.repeatable },
      { id: 'lock', label: 'Lock class 21 first', steps: instructors.lock },
      { id: 'serializable-whole', label: 'Serializable, repeat the transaction', steps: instructors['serializable-whole'] },
      { id: 'serializable-statement', label: 'Serializable, repeat only the write', steps: instructors['serializable-statement'] },
    ],
  },
  swap: {
    title: 'Mina and Tariq swap classes',
    // R8 has already taken class 21's place; verify.mjs commits this before replaying.
    setupSql: `${sql.take(21)} ${sql.book('R8', 21, 1)}`,
    lanes: { A: 'Mina moves R8 from 21 to 22', B: 'Tariq moves R7 from 22 to 21' },
    tables: ['classes', 'reservations'],
    initial: 'opposite',
    options: [
      { id: 'opposite', label: 'Each locks the class it leaves first', steps: swap.opposite },
      { id: 'ordered', label: 'Both lock the lower class_id first', steps: swap.ordered },
    ],
  },
  reply: {
    title: 'Mina’s booking when the reply to COMMIT is lost',
    lanes: { A: 'First attempt, R8', B: 'The service’s repeat, R8' },
    tables: ['classes', 'reservations'],
    initial: 'again',
    options: [
      { id: 'again', label: 'Book again', steps: reply.again },
      { id: 'lookup', label: 'Look up R8 first', steps: reply.lookup },
      { id: 'claim', label: 'Record R8 first', steps: reply.claim },
      { id: 'claim-lost', label: 'Record R8 first; attempt lost', steps: reply['claim-lost'] },
    ],
  },
};

// Claims made in prose and tables rather than figures. verify.mjs checks each.
export const claims = {
  // "Versions and locks answer different questions": what Tariq's statement does
  // while Mina's conditional take of class 21 is uncommitted, and after she commits.
  visibility: [
    { statement: 'Ordinary SELECT', during: 'Returns 1 at once', readCommitted: 'A new statement returns 0', repeatableRead: 'Still returns 1' },
    { statement: 'SELECT … FOR UPDATE', during: 'Waits for Mina', readCommitted: 'Locks the new row and returns 0', repeatableRead: 'Fails with 40001' },
    { statement: 'UPDATE … WHERE remaining > 0', during: 'Waits for Mina', readCommitted: 'Changes no rows', repeatableRead: 'Fails with 40001' },
  ],
  // Stated variation from the example record: class 22's capacity is 2, so one place
  // is left. Mina (R13) and Edda (R14) each lock and count class 22's reservations.
  countingVariation: { capacity: 2, remaining: 1, bookingsAfter: 3 },
  // Mina's waiting update when her own transaction rolls back instead (the Prediction).
  rollbackPrediction: { tariqGets: [[0]], bookings: ['R7', 'R9'] },
};
