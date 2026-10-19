export type Scene = 'topology' | 'locality' | 'outcome' | 'budget';
export type Panel = { label: string; lines: string[] };
export type Frame = { title: string; panels: Panel[]; result: string; note: string };
export const choices: Record<Scene, { value: string; label: string }[]> = {
  topology: [{ value: 'region', label: 'Region survival' }, { value: 'zone', label: 'Zone survival' }],
  locality: [{ value: 'same', label: 'Irish stock' }, { value: 'remote', label: 'German stock' }],
  outcome: [{ value: 'abort', label: 'Known abort' }, { value: 'kept', label: 'Commit, reply lost' }, { value: 'lost', label: 'Abort, reply lost' }],
  budget: [{ value: 'spread', label: 'Dispersed stock' }, { value: 'hot', label: 'One hot stock row' }],
};
export const titles: Record<Scene, string> = {
  topology: 'Copies that can vote after a region fails',
  locality: 'A nearby gateway and a remote stock row',
  outcome: 'The same missing reply can hide different outcomes',
  budget: 'Distance and contention spend the same deadline',
};
export const captions: Record<Scene, string> = {
  topology: 'Illustrative placement for one Irish range, after placement has converged. V means voting replica; N means a non-voting copy. Five voters require three votes. This is not observed cluster output, and it omits other ranges and internal metadata.',
  locality: 'Illustrative dependencies, not a packet trace or a count of consensus rounds. Region survival still needs remote votes when all transaction rows have the same home. Switching the stock home preserves the step.',
  outcome: 'Illustrative transaction outcomes using documented error categories. No disconnect or retry was injected for this article. Request identity includes its fixed home region; changing the gateway must not change that identity.',
  budget: 'Invented, additive request budgets in milliseconds, not engine measurements or percentile predictions. The network allowance represents coordination work on the critical path; real transactions can overlap work or need more exchanges.',
};

export function frames(scene: Scene, variant: string, rtt = 40): Frame[] {
  if (scene === 'topology') {
    const regional = variant === 'region';
    const normal = [
      { label: 'Ireland · home', lines: regional ? ['V1 · leaseholder', 'V2', 'A third node has no copy of this range'] : ['V1 · leaseholder', 'V2', 'V3 · three separate zones'] },
      { label: 'Germany', lines: regional ? ['V3', 'V4', 'A third node has no copy of this range'] : ['N1 · illustrative non-voter', 'No vote towards this range’s quorum'] },
      { label: 'France', lines: regional ? ['V5', 'Other nodes have no copy of this range'] : ['N2 · illustrative non-voter', 'No vote towards this range’s quorum'] },
    ];
    return [
      { title: 'Place one range', panels: normal, result: regional ? '5 voters · quorum 3' : '3 voters · quorum 2', note: 'A range is a replicated part of the stored key space. Nodes can hold replicas of many ranges; nine nodes does not mean nine copies of each row.' },
      { title: 'Accept a write while healthy', panels: normal, result: regional ? 'Ireland’s 2 votes alone cannot reach 3.' : 'Ireland can reach 2 votes inside the home region.', note: regional ? 'A write must involve another region even when the gateway, customer, order and stock all have their home in Ireland.' : 'Non-voting copies elsewhere do not force remote acknowledgement for this illustrative zone-survival placement.' },
      { title: 'Lose every Irish node', panels: normal.map((p, i) => i === 0 ? { label: 'Ireland · unavailable', lines: ['Gateway and home leaseholder lost', 'All local votes unreachable'] } : p), result: regional ? '3 of 5 voters remain · a majority is possible.' : '0 of 3 voters remain · no majority.', note: regional ? 'The surviving side can establish a new leaseholder. Failure detection, routing, client reconnection and spare capacity still determine usable service.' : 'N1 and N2 may hold data, but they cannot replace a missing voting majority. A nearby endpoint cannot repair this failure contract.' },
      { title: 'Check the service, then repair capacity', panels: normal.map((p, i) => i === 0 ? { label: 'Ireland · returning', lines: ['Rejoin under the supported procedure', 'Wait for healthy placement and replication'] } : p), result: regional ? 'Predicted survival is a reason to test, not a measured recovery time.' : 'Reject this placement for whole-region survival.', note: 'Observe acknowledged request identities, new reservations and required reads during the outage and return. Repeat against every region and internal ranges, not just this example.' },
    ];
  }
  if (scene === 'locality') {
    const remote = variant === 'remote';
    const stock = remote ? 'Germany' : 'Ireland';
    return [
      { title: 'Choose an operation, not just an endpoint', panels: [{ label: 'Irish API → Irish SQL gateway', lines: ['Customer home: Ireland', 'Request home: Ireland', `Stock home: ${stock}`] }, { label: 'Rows required', lines: ['Customer identity and request outcome', 'One inventory row', 'Reservation, plus its indexes'] }], result: 'A gateway receives SQL; it need not own all the data.', note: 'The application sends explicit home and stock-home values. A failover route must not silently assign a new request home.' },
      { title: 'Find and protect the stock decision', panels: [{ label: 'Irish work', lines: ['Find customer and stable request identity', remote ? 'Send guarded claim towards German stock' : 'Claim Irish stock: available > 0'] }, { label: `${stock} stock range`, lines: ['Decrease available only if positive', 'Coordinate its replicated write', 'Return whether a unit was claimed'] }], result: remote ? 'The stock dependency crosses regions before the order can finish.' : 'All row homes align; region-survival replication still crosses a region.', note: 'A foreign key to remote stock, a join or an index lookup may add another remote dependency. Count the actual spans in the chosen plan.' },
      { title: 'Keep claim and reservation together', panels: [{ label: 'Reservation in Ireland', lines: ['Insert the fixed request identity', `Reference stock in ${stock}`, 'Maintain customer-history index'] }, { label: 'Transaction result', lines: ['Claim and reservation commit together', 'Or neither remains', 'An INSERT result alone is not a commit confirmation'] }], result: remote ? 'Two homes participate in one logical reservation.' : 'Co-location removes a remote row dependency, not every network hop.', note: 'Dropping the foreign key or splitting the stock claim into a separate commit to make a benchmark faster changes the application’s promise.' },
      { title: 'Inspect where work really went', panels: [{ label: 'Placement evidence', lines: ['SHOW REGIONS; table locality', 'Voting and non-voting replica localities', 'Leaseholder locality; indexes included'] }, { label: 'Execution evidence', lines: ['EXPLAIN ANALYZE on disposable work', 'Participating regions and network work', 'End-to-end duration including retries'] }], result: 'A connection string does not establish locality or residency.', note: 'Keep plan and placement snapshots with the same workload interval. Placement can change after growth, failures and schema jobs.' },
    ];
  }
  if (scene === 'outcome') {
    const known = variant === 'abort';
    const committed = variant === 'kept';
    return [
      { title: 'Send one logical reservation', panels: [{ label: 'Application', lines: ['Identity: (Ireland, R42)', 'Original stock and amount retained', 'One checked-out client owns the transaction'] }, { label: 'Database', lines: ['Stock: 1', 'Reservation R42: absent', 'No external fulfilment call inside the transaction'] }], result: 'One logical request may have several attempts.', note: 'Reuse the identity and original arguments across every attempt. The common application recovery protocol owns concurrency between those attempts.' },
      { title: known ? 'Coordination rejects this attempt' : 'Commit reaches its decision', panels: [{ label: 'Application', lines: [known ? 'Receives SQLSTATE 40001' : 'COMMIT sent', known ? 'Known transaction abort' : 'No commit confirmation received'] }, { label: 'Database truth in this model', lines: [committed ? 'Stock: 0' : 'Stock: 1', committed ? 'Reservation R42: present' : 'Reservation R42: absent'] }], result: known ? 'Retry the complete transaction only within its budget.' : 'Transport evidence is identical in both lost-reply cases.', note: known ? 'Fresh reads and business decisions belong to the next attempt. A database-managed retry does not prove the application handles a surfaced abort.' : 'A 40003 ambiguous-result error or a dropped connection around commit requires outcome resolution. Neither establishes an abort.' },
      { title: 'Recover according to the evidence', panels: [{ label: 'Application action', lines: known ? ['Rollback or discard as required by the driver', 'Back off within the remaining deadline', 'Repeat reads and decisions with (Ireland, R42)'] : ['Discard an unusable connection', 'Resolve (Ireland, R42) through the safe request protocol', 'Do not debit stock under a new identity'] }, { label: 'What can be returned', lines: known ? ['A later known commit, a sold-out result', 'Or an honest bounded failure'] : committed ? ['The saved reservation for R42', 'Only after authoritative resolution'] : ['No saved success yet', 'An overlapping attempt must still be arbitrated'] }], result: known ? 'Retry attempts consume the original request deadline.' : 'An empty preliminary lookup alone is not proof of non-commit.', note: 'The request-recovery article supplies the durable identity and arbitration design. This candidate check must exercise its behaviour through the selected CockroachDB driver path.' },
      { title: 'Check facts independently', panels: [{ label: 'Database check', lines: [committed ? 'Stock + reservations = 0 + 1 = 1' : 'Stock + reservations = 1 + 0 = 1', 'At most one reservation for (Ireland, R42)', 'Original arguments agree with the saved result'] }, { label: 'Client check', lines: ['Log the actual error code and phase', 'Record every application attempt', 'Account for uncertain and timed-out work'] }], result: 'Correct final rows and correct client knowledge are separate checks.', note: 'A model can explain these paths. Only fault injection through the real client can establish which signals, cleanup and recovery the application actually performs.' },
    ];
  }
  const hot = variant === 'hot';
  const wait = hot ? 170 : 10;
  const network = rtt * 2;
  const first = 20 + wait + network + 30;
  const second = first + 20 + network + 30;
  return [
    { title: 'Start the same 300 ms budget', panels: [{ label: 'Traffic shape', lines: [hot ? 'Many claims target P7 in one region' : 'Claims target different stock keys', 'Irish and German clients measured separately', 'Region-survival configuration retained'] }, { label: 'Invented inputs', lines: [`Coordination RTT allowance: ${rtt} ms`, 'Two dependent network allowances per attempt', 'Deadline starts at API entry'] }], result: 'No measured p99 is claimed here.', note: 'The two allowances are a deliberately simple hypothesis. A real plan and traces establish which exchanges overlap and which are sequential.' },
    { title: 'Admit and queue the request', panels: [{ label: 'Time spent', lines: ['Pool/admission: 20 ms', `Contention/queue: ${wait} ms`, `Subtotal: ${20 + wait} ms`] }, { label: 'Interpretation', lines: [hot ? 'The hot key remains one shared decision' : 'Independent keys can spread useful work', 'More gateways do not divide one inventory row', 'Check contention signals before adding nodes'] }], result: `${300 - 20 - wait} ms remain before execution and coordination.`, note: 'A queue is not removed by omitting it from the SQL timer. Refused and timed-out attempts must remain in the application workload accounting.' },
    { title: 'Complete the first attempt', panels: [{ label: 'Added work', lines: [`Network allowances: 2 × ${rtt} = ${network} ms`, 'Other execution and response: 30 ms', `Elapsed: ${first} ms`] }, { label: 'If this attempt is known to commit', lines: [first <= 300 ? 'Inside this illustrative deadline' : 'Outside this illustrative deadline', 'Measure the real latency distribution', 'Verify reservation invariants at the same load'] }], result: first <= 300 ? `${300 - first} ms remain in the model.` : `${first - 300} ms over the model’s deadline.`, note: 'Reducing a remote row dependency can remove work. Weakening freshness, region survival or correctness would create a different candidate.' },
    { title: 'Include one surfaced abort and another attempt', panels: [{ label: 'Additional attempt', lines: ['Backoff: 20 ms', `Network allowances: ${network} ms`, 'Other execution and response: 30 ms'] }, { label: 'Total for the logical request', lines: [`Elapsed: ${second} ms`, second <= 300 ? 'Within 300 ms in this model' : 'Exceeds 300 ms in this model', 'No new 300 ms budget at retry'] }], result: second <= 300 ? `Model fits with ${300 - second} ms spare; production remains unmeasured.` : `Model misses by ${second - 300} ms; investigate or reject at this workload.`, note: 'Compare the same local/cross-region and hot/dispersed cases before and after one justified change. Count useful completed requests, infrastructure failures and business refusals separately.' },
  ];
}
