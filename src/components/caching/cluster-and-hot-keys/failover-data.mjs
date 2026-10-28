// Figure 4: measured successful reads a second for keys on each shard, through the death of one
// primary (kill -9 at time 0), on a local Redis 8.10.3 cluster with the default cluster-node-timeout of
// 15 s. Six redis-py 8.1.0 cluster clients, two per shard, each reading at 300 GET/s; 0.5 s buckets.
// Commands and raw output: docs/article-work/caching-2026-10-27/evidence/cluster-and-hot-keys.txt, section C8.
// Shard A = slots 0-5460, B = 5461-10922, C = 10923-16383. Scenario 1 killed A (which had a replica);
// scenarios 2 and 3 killed C (no replica), with cluster-require-full-coverage yes and no.
export const START = -6;
export const STEP = 0.5;
export const RUNS = {
  replica: {
    A: [604, 600, 596, 604, 600, 600, 596, 604, 596, 604, 600, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 690, 838, 508, 692, 600, 600, 600, 588, 612, 600, 600, 600, 602, 598, 602, 598, 600, 600],
    B: [604, 600, 596, 604, 600, 580, 616, 604, 596, 604, 600, 600, 600, 600, 592, 532, 676, 442, 758, 600, 428, 772, 600, 600, 600, 600, 600, 600, 600, 600, 564, 532, 704, 600, 600, 552, 648, 600, 600, 600, 506, 694, 592, 566, 642, 600, 596, 380, 824, 600, 598, 594, 44, 0, 554, 782, 528, 670, 600, 602, 598, 588, 612, 600, 600, 596, 606, 598, 602, 598, 600, 600],
    C: [606, 468, 732, 600, 586, 614, 596, 472, 728, 604, 600, 600, 600, 600, 470, 728, 596, 540, 666, 600, 472, 728, 600, 600, 600, 600, 600, 600, 508, 688, 482, 722, 600, 568, 632, 484, 626, 690, 588, 492, 720, 600, 590, 506, 704, 600, 598, 462, 740, 600, 598, 520, 134, 0, 588, 742, 490, 712, 600, 600, 600, 588, 612, 600, 600, 598, 602, 600, 600, 600, 600, 600],
  },
  nocover: {
    A: [612, 602, 598, 600, 578, 622, 600, 600, 600, 600, 600, 600, 600, 600, 602, 598, 602, 600, 600, 600, 534, 664, 598, 586, 620, 600, 600, 596, 604, 596, 600, 602, 602, 600, 600, 600, 456, 686, 654, 600, 600, 602, 598, 604, 596, 602, 598, 600, 604, 564, 630, 392, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    B: [586, 626, 600, 600, 588, 612, 602, 598, 600, 602, 598, 600, 600, 600, 602, 602, 596, 600, 604, 596, 534, 668, 596, 586, 620, 600, 600, 598, 598, 602, 598, 602, 600, 600, 602, 600, 558, 590, 646, 602, 602, 598, 602, 602, 598, 598, 598, 602, 604, 584, 610, 352, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    C: [602, 620, 598, 600, 572, 628, 604, 596, 600, 602, 598, 600, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  partial: {
    A: [604, 600, 600, 596, 600, 562, 638, 600, 604, 598, 594, 606, 596, 604, 598, 600, 602, 578, 624, 596, 600, 568, 632, 600, 600, 604, 596, 604, 596, 600, 604, 596, 604, 596, 600, 600, 600, 600, 602, 598, 604, 596, 604, 596, 602, 600, 602, 598, 602, 600, 600, 598, 602, 596, 600, 604, 600, 598, 600, 600, 600, 588, 610, 600, 502, 698, 602, 602, 596, 604, 598, 598],
    B: [604, 600, 598, 598, 600, 602, 598, 602, 602, 598, 584, 616, 598, 604, 596, 600, 602, 510, 692, 504, 692, 568, 634, 598, 600, 600, 600, 600, 600, 604, 600, 596, 604, 596, 602, 600, 598, 600, 602, 598, 602, 598, 602, 598, 600, 602, 602, 600, 598, 602, 598, 598, 602, 598, 600, 602, 598, 604, 560, 638, 600, 602, 596, 602, 550, 648, 600, 604, 596, 604, 596, 600],
    C: [604, 600, 598, 598, 600, 604, 600, 596, 604, 596, 588, 614, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
};
// Times after the kill, from the server logs: when the other nodes agreed the primary had failed
// ("quorum reached") and, in scenario 1, when its replica won the election.
export const EVENTS = {
  replica: { failed: 'A', detected: 20.0, promoted: 21.1 },
  nocover: { failed: 'C', detected: 19.9 },
  partial: { failed: 'C', detected: 17.0 },
};

/** Seconds after the kill (t >= 0) in which a group served under half its normal 600 reads a second. */
export function downtime(values, threshold = 300) {
  return values.filter((v, i) => START + i * STEP >= 0 && v < threshold).length * STEP;
}

/** The two series a chart shows: the failed shard's group, and the mean of the other two groups. */
export function seriesFor(scenario) {
  const run = RUNS[scenario], failed = EVENTS[scenario].failed;
  const others = Object.keys(run).filter(g => g !== failed);
  const at = i => START + i * STEP;
  return {
    failed: run[failed].map((v, i) => [at(i), v]),
    others: run[others[0]].map((v, i) => [at(i), (v + run[others[1]][i]) / 2]),
    failedDown: downtime(run[failed]),
    othersDown: Math.max(...others.map(g => downtime(run[g]))),
  };
}
