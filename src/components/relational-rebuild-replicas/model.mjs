const progress = [
  { primary: '20.00', received: 0, durable: 0, replayed: 0, price: '20.00', headline: 'The copies begin together', explanation: 'The primary and replica A include the same earlier history. A new snapshot on either copy reads P7 at 20.00.' },
  { primary: '22.00', received: 0, durable: 0, replayed: 0, price: '20.00', headline: 'The primary commits C', explanation: 'U describes the price change; C commits the transaction. Both are durable on the primary. The caller can hear success under a local durability promise while A is still behind.' },
  { primary: '22.00', received: 2, durable: 0, replayed: 0, price: '20.00', headline: 'A receives U and C', explanation: 'The records have arrived at A, but the new records are not yet durably stored there in this schedule. Receipt alone does not promise survival of A’s power loss.' },
  { primary: '22.00', received: 2, durable: 2, replayed: 0, price: '20.00', headline: 'A stores C durably, but still reads 20.00', explanation: 'A has a surviving copy of the committed history. It has not replayed that history into its readable state. A new snapshot still reads 20.00.' },
  { primary: '22.00', received: 2, durable: 2, replayed: 1, price: '20.00', headline: 'A replays U before its commit', explanation: 'The physical change can be present without being visible as committed. Until C is replayed, an ordinary new snapshot must not read the unfinished 22.00 version.' },
  { primary: '22.00', received: 2, durable: 2, replayed: 2, price: '22.00', headline: 'A replays C; a new snapshot sees 22.00', explanation: 'The commit now belongs to A’s readable history. The illustrated new snapshot includes C and reads 22.00. A snapshot retained from before C does not become a new snapshot.' },
];

const routeBase = [
  { a: 'Before C', primary: 'Available · includes C', target: 'No read target yet', action: 'Carry the write’s requirement', result: 'No read yet', explanation: 'The write has committed. The application retains a token identifying history H through commit C. The next read must include that history.' },
  { a: 'Before C · not qualified', primary: 'Available · includes C', target: 'Candidate: replica A', action: 'Check A before taking a snapshot', result: 'No read yet', explanation: 'The router chooses A, checks that it belongs to H, and finds replay before C. It cannot start the promised read there yet.' },
];
const routes = {
  catchup: [
    ...routeBase,
    { a: 'Replayed C · qualified', primary: 'Available · includes C', target: 'Replica A', action: 'A reaches C within the wait budget', result: 'No read yet', explanation: 'The bounded wait succeeds on A. The qualification belongs to this exact target and history. The application keeps the read on A.' },
    { a: 'Replayed C · qualified', primary: 'Available · includes C', target: 'Replica A', action: 'Establish a new snapshot on A', result: 'P7 → 22.00', explanation: 'Only after A qualifies does the application establish the read’s snapshot on A. This history includes the price change, so this example returns 22.00.' },
  ],
  fallback: [
    ...routeBase,
    { a: 'Before C · wait expired', primary: 'Available · includes C', target: 'Candidate: primary', action: 'The wait expires; qualify the fallback', result: 'No read yet', explanation: 'A misses the deadline. The application selects the available primary and establishes that it is the authority for H and includes C. A’s check cannot qualify a different server.' },
    { a: 'Before C · not used', primary: 'Available · includes C', target: 'Primary', action: 'Establish a new snapshot on the primary', result: 'P7 → 22.00', explanation: 'The fallback reads from a new snapshot on the qualified primary. This preserves the promise while putting this read back on the primary.' },
  ],
  unavailable: [
    routeBase[0],
    { ...routeBase[1], primary: 'Unavailable' },
    { a: 'Before C · wait expired', primary: 'Unavailable', target: 'No eligible target', action: 'The wait expires with no qualified fallback', result: 'No read yet', explanation: 'A has not replayed C, and the primary is unreachable. No available target has been shown to include the required history.' },
    { a: 'Before C · not used', primary: 'Unavailable', target: 'No eligible target', action: 'Report that the promise cannot be met', result: 'Unavailable · no price returned', explanation: 'The application returns an explicit unavailable result. Returning 20.00 here would change the promised read contract; a timeout does not authorise that change.' },
  ],
};

const switches = {
  forget: [
    { first: 'Not read yet', second: 'Not read yet', session: 'No retained read requirement', eligibility: 'A and B may answer', explanation: 'A has replayed C; B is still before C. The application allows either copy to answer without retaining what this session has already observed.' },
    { first: 'Read 1 on A → 22.00', second: 'Not read yet', session: 'C is not retained for routing', eligibility: 'B remains a candidate', explanation: 'The first read on A sees the committed price change. This observation is not carried into the next routing decision.' },
    { first: 'Read 1 on A → 22.00', second: 'Read 2 on B → 20.00', session: 'The session goes backwards', eligibility: 'B answers from before C', explanation: 'The next read goes to B and returns 20.00. Neither copy moved backwards; the router moved the reader to an earlier history.' },
  ],
  retain: [
    { first: 'Not read yet', second: 'Not read yet', session: 'No retained read requirement yet', eligibility: 'A and B may answer', explanation: 'The copies are unchanged: A includes C and B does not. This time the session will retain the history observed by its first read.' },
    { first: 'Read 1 on A → 22.00', second: 'Not read yet', session: 'Next read requires at least H:C', eligibility: 'B is not qualified', explanation: 'After reading on A, the session carries a requirement including C. The second read must use a snapshot that includes that history too.' },
    { first: 'Read 1 on A → 22.00', second: 'Read 2 cannot use B yet', session: 'Keep the history requirement', eligibility: 'Wait for B, use A, or decline', explanation: 'B is excluded until it catches up. The router may use A again, wait for B within a limit, or report unavailability. It must not return B’s earlier 20.00 under this promise.' },
  ],
};

export const models = {
  progress: { number: 1, title: 'C is durable before 22.00 is readable', caption: 'Solid cells are included; dashed cells lie ahead. U is the price change and C its commit, at symbolic positions in history H. This selected schedule has no time or byte scale. Order 103 remains at 29.00.', options: [], states: { default: progress } },
  routing: { number: 2, title: 'Qualify the copy that will answer', caption: 'An illustrative required-history protocol, not a portable database API. The wait has a finite budget but no measured duration. Every successful path takes a new snapshot on the qualified target.', options: [['catchup', 'A catches up'], ['fallback', 'A times out; primary available'], ['unavailable', 'A times out; primary unavailable']], label: 'Read path', states: routes },
  switching: { number: 3, title: 'A later read on an earlier copy', caption: 'A and B belong to the same history H. Both read snapshots are new. Their different replay positions, rather than a changed order or price correction, explain the two answers.', options: [['forget', 'No retained history'], ['retain', 'Retain observed history']], label: 'Session routing', states: switches },
};
