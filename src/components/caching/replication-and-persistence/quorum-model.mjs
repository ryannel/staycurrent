// Figure 10: what Sentinel needs to act. `quorum` Sentinels must agree the
// primary is unreachable before it is marked objectively down (ODOWN); a
// failover then needs a leader elected by a majority of all Sentinels, or by
// `quorum` of them if that is larger. Pure: no DOM.

export const majority = n => Math.floor(n / 2) + 1;

/** n Sentinels configured, `lost` of them down or cut off from the rest. */
export function sentinelPower({ n, quorum, lost }) {
  const alive = Math.max(0, n - lost);
  const needed = Math.max(majority(n), quorum);
  return {
    alive,
    majority: majority(n),
    needed,
    detect: alive >= quorum,
    failover: alive >= quorum && alive >= needed,
    /** Sentinels that can be lost with a failover still possible. */
    tolerates: Math.max(0, n - Math.max(needed, quorum)),
  };
}
