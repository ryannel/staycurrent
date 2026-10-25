export const routes = {
  history: {
    label: 'Mina’s order history',
    steps: [
      { route: 'customer_id = 1 → customer shard A', active: [], work: ['Waiting', 'Excluded by customer key', 'Excluded by customer key', 'No catalogue data requested'], result: 'No owner contacted yet', count: '0' },
      { route: '↓ Route to A; use its local order index', active: ['A'], work: ['Find orders 101 and 103', 'No request', 'No request', 'No request'], result: 'A returns Mina’s two orders', count: '1' },
      { route: '↑ Return the two rows', active: ['A'], work: ['101 paid · 103 pending', 'No request', 'No request', 'No request'], result: '101 paid · 103 pending', count: '1' }
    ]
  },
  report: {
    label: 'Shop-wide paid-order line value',
    steps: [
      { route: 'No customer key → ask A, B and C', active: [], work: ['Waiting', 'Waiting', 'Waiting', 'Agreed line prices are in the customer shards'], result: 'No partial results yet', count: '0' },
      { route: '↓ Fan out the same report work', active: ['A','B','C'], work: ['Paid lines: customer 1 → 39.50', 'Paid lines: customer 2 → 40.00', 'No orders → no group', 'No request'], result: 'Three replies are needed, including C’s empty result', count: '3' },
      { route: '↑ Combine the groups; sort by value', active: ['A','B','C'], work: ['39.50', '40.00', 'Empty result', 'No request'], result: 'Customer 2: 40.00 · customer 1: 39.50', count: '3' }
    ]
  },
  purchase: {
    label: 'Create purchase 103',
    steps: [
      { route: 'Replay from before order 103', active: [], work: ['Order 103 absent', 'Tariq’s separate orders', 'Edda has no orders', 'P7 stock 1 · P3 stock 12'], result: 'Mina wants P7 × 1 and P3 × 2', count: '0' },
      { route: '↓ Work for customer 1 and shared products', active: ['A','P'], work: ['Create pending 103 + two lines', 'No request', 'No request', 'Guard and decrement both stock rows'], result: 'Two owners must participate in one atomic purchase', count: '2' },
      { route: '↑ One committed outcome for both owners', active: ['A','P'], work: ['103 pending · lines total 29.00', 'No request', 'No request', 'P7 stock 0 · P3 stock 10'], result: 'No payment was recorded; P9 stays at stock 4', count: '2' }
    ]
  }
};
export const raftSteps = [
  { title: 'One agreed starting history', logs:[false,false,false], prices:['20.00','20.00','20.00'], committed:false, reply:'No request yet', text:'R1 is the established leader. All three voters have applied the earlier history. The next command will set P7’s catalogue price to 22.00.' },
  { title: 'R1 records a proposal', logs:[true,false,false], prices:['20.00','20.00','20.00'], committed:false, reply:'Waiting', text:'R1 durably appends U in its current term, then sends it to R2 and R3. One durable copy is not a majority of three. U is still a proposal.' },
  { title: 'R2 stores U and acknowledges it', logs:[true,true,false], prices:['20.00','20.00','20.00'], committed:false, reply:'Waiting', text:'R2 has durably appended U and its acknowledgement is travelling back to R1. Two durable copies now exist, but R1 has not yet learnt that. R2’s applied price remains 20.00.' },
  { title: 'R1 learns that a majority has U', logs:[true,true,false], prices:['20.00','20.00','20.00'], committed:true, reply:'Waiting', text:'R1 receives R2’s acknowledgement. R1 and R2 form a durable majority, so R1 can commit this current-term entry. The command is agreed; application is a later step.' },
  { title: 'R1 applies U, then replies', logs:[true,true,false], prices:['22.00','20.00','20.00'], committed:true, reply:'Success: price 22.00', text:'R1 applies the agreed command and returns its result. R2 has not applied it and R3 still lacks U. Success did not require every copy to be current.' },
  { title: 'The other copies catch up', logs:[true,true,true], prices:['22.00','22.00','22.00'], committed:true, reply:'Success already received', text:'R2 learns that U is committed and applies it. R3 receives the missing history and applies it too. This chosen schedule exposes the gaps; it has no time scale.' }
];
export const quorums = {
  three: { members:[true,true,true], label:'All three can communicate', result:'Majority: two of the three configured voters', text:'All voters are reachable. Each new current-term entry needs a majority of the configured three voters. The third copy may follow later.' },
  two: { members:[false,true,true], label:'R1 isolated from R2 and R3', result:'R2 + R3 can progress after establishing a suitable leader', text:'R2 and R3 are a majority of the same group. After an eligible leader is established, they can agree new entries. Isolated R1 cannot confirm new writes alone.' },
  one: { members:[true,false,false], label:'Only R1 is reachable', result:'One out of three: no new write can be confirmed', text:'R1 may still be running, but it cannot obtain a majority. Existing data is not erased. A current read needs its own authority check; an allowed older read has a different contract.' }
};
export const reads = {
  separate: { picks:[0,3], result:'No 103 + stock 0: never one committed shop state', text:'The order read completes before the purchase commits. The stock read starts afterwards. Each answer is valid at its own point; the pair is not a snapshot.' },
  before: { picks:[0,1], result:'Before purchase: no 103 + stock 1', text:'A common snapshot before the atomic purchase includes neither side of it. Both owners must be able to serve that compatible history.' },
  after: { picks:[2,3], result:'After purchase: 103 present + stock 0', text:'A common snapshot after the atomic purchase includes both sides. Choosing a timestamp also needs a protocol proving that each owner can safely answer there.' }
};
