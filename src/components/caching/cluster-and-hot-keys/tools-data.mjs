// Figure 6: what three tools reported for the busiest node (7195) of a local Redis 8.10.3
// cluster after 180 s of Zipf (s = 1) reads at 3,000 GET/s over 10,000 keys, with
// maxmemory-policy allkeys-lfu. Measured; evidence section C9 of
// docs/article-work/caching-2026-10-27/evidence/cluster-and-hot-keys.txt.
// requests: counted by the load generator. lfu: OBJECT FREQ / redis-cli --hotkeys.
// cpu: HOTKEYS GET by-cpu-time-us (microseconds). bytes: HOTKEYS GET by-net-bytes.
// product:4976 is included because HOTKEYS ranked it fifth by CPU time; it had 17 requests,
// and was not in the top ten by network bytes or by --hotkeys.
export const TOOL_ROWS = [
  { key: 'product:0', requests: 55126, lfu: 107, cpu: 43083, bytes: 18522336 },
  { key: 'product:1', requests: 27651, lfu: 72, cpu: 23331, bytes: 9290736 },
  { key: 'product:4', requests: 11081, lfu: 45, cpu: 9898, bytes: 3723216 },
  { key: 'product:5', requests: 9227, lfu: 52, cpu: 7800, bytes: 3100272 },
  { key: 'product:8', requests: 6208, lfu: 44, cpu: 5324, bytes: 2085888 },
  { key: 'product:9', requests: 5454, lfu: 38, cpu: 4736, bytes: 1832544 },
  { key: 'product:12', requests: 4158, lfu: 33, cpu: 3906, bytes: 1405404 },
  { key: 'product:16', requests: 3302, lfu: 29, cpu: 3228, bytes: 1116076 },
  { key: 'product:4976', requests: 17, lfu: null, cpu: 7352, bytes: null },
];

export const MEASURES = {
  requests: { label: 'Requests, counted by the clients', unit: 'requests' },
  lfu: { label: 'LFU counter, from redis-cli --hotkeys', unit: '' },
  bytes: { label: 'Network bytes, from HOTKEYS', unit: 'bytes' },
  cpu: { label: 'CPU time, from HOTKEYS', unit: 'µs' },
};
