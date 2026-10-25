export const copyStages = [
  { title: 'Start from one agreed history', base: 0, later: 'absent', oldPrice: '20.00', newPrice: '—', explanation: 'R1, R2 and R3 vote for P. R4 is a learner: it can receive history but supplies no vote. The base snapshot b contains P7 at 20.00.' },
  { title: 'Copy the base snapshot', base: 2, later: 'absent', oldPrice: '20.00', newPrice: '—', explanation: 'Two of four drawn chunks have arrived at R4. They belong to the same consistent snapshot b. A partly copied base is not a usable replacement.' },
  { title: 'The old group keeps accepting writes', base: 2, later: 'absent', oldPrice: '22.00', newPrice: '—', explanation: 'While the base travels, the old group agrees and applies U: set P7 price to 22.00. This chosen schedule brings all three old voters up to U. Snapshot b still contains 20.00.' },
  { title: 'All base bytes arrive', base: 4, later: 'absent', oldPrice: '22.00', newPrice: '20.00', explanation: 'R4 has installed snapshot b. Its P7 is 20.00. Finishing the base transfer did not include the later command U.' },
  { title: 'Receive the continuation durably', base: 4, later: 'durable', oldPrice: '22.00', newPrice: '20.00', explanation: 'R4 now has U in durable history, but has not applied it. Its stored command and its applied price describe different progress.' },
  { title: 'Apply the continuation', base: 4, later: 'applied', oldPrice: '22.00', newPrice: '22.00', explanation: 'R4 applies the agreed continuation through U. In this quiet endpoint it has caught up. It is still a learner; only the membership protocol can give it a vote.' },
];

export const memberships = [
  { title: 'Old configuration', voters: ['R1','R2','R3'], old: true, next: false, explanation: 'R1, R2 and R3 are the configured voters. Any two form the required majority. R4 has caught up but is not counted.' },
  { title: 'Joint configuration', voters: ['R1','R2','R3','R4'], old: true, next: true, explanation: 'The joint configuration requires two from {R1, R2, R3} AND two from {R1, R2, R4}. R1 and R2 count towards both. A majority of the combined four is not the rule.' },
  { title: 'New configuration', voters: ['R1','R2','R4'], old: false, next: true, explanation: 'After the final new configuration is committed, R1, R2 and R4 govern P. R3 no longer supplies a vote for P and its replica can be retired through the engine’s procedure.' },
];
export const connectivity = [
  { value: 'all', label: 'All four', members: ['R1','R2','R3','R4'] },
  { value: '12', label: 'R1 + R2 only', members: ['R1','R2'] },
  { value: '23', label: 'R2 + R3 only', members: ['R2','R3'] },
  { value: '14', label: 'R1 + R4 only', members: ['R1','R4'] },
];
export function quorum(stage, available) {
  const oldCount = ['R1','R2','R3'].filter(x => available.includes(x)).length;
  const newCount = ['R1','R2','R4'].filter(x => available.includes(x)).length;
  return { oldCount, newCount, passes: (!memberships[stage].old || oldCount >= 2) && (!memberships[stage].next || newCount >= 2) };
}
export function backlog(rate, seconds) { return Math.max(0, 600 + (10 - rate) * seconds); }
