const cell = (title, value, cls = '') => `<div class="cr-cell ${cls}"><b>${title}</b><span>${value}</span></div>`;
const row = (title, cells, cls = '') => `<div class="cr-band ${cls}"><p class="cr-label">${title}</p><div class="cr-cells">${cells.join('')}</div></div>`;
const arrow = text => `<p class="cr-arrow">↓ ${text}</p>`;
const frame = (html, explanation) => ({ html, explanation });
const voters = (n, price = false) => row('One range · three voting replicas', [1,2,3].map(i => cell(`Node ${i}${i === 2 ? ' · leaseholder / leader' : ' · follower'}`, price ? (n >= 4 && i === 2 ? 'Applied: 22.00' : 'Applied: 20.00') : (i === 2 ? 'Serves the range' : 'Another copy'), i === 2 ? 'cr-focus' : '')));
const route = n => row('SQL connection', [cell('Application', n === 3 ? 'Receives 20.00' : 'SELECT price for P7'),cell('Node 4 · gateway', n === 0 ? 'Plans the lookup' : n === 3 ? 'Builds the SQL result' : 'Routes a KV read', n < 3 ? 'cr-focus' : '')]) + arrow(n === 0 ? 'Primary-index key for P7' : n === 1 ? 'Cached range descriptor → range A' : n === 2 ? 'KV read → node 2' : '20.00 returns through the gateway') + voters(n);
function raft(n) {
  const cells = [1,2,3].map(i => {
    const durable = (i === 2 && n >= 1) || (i === 1 && n >= 2) || n >= 5;
    const applied = (i === 2 && n >= 4) || n >= 5;
    return cell(`Node ${i}${i === 2 ? ' · leader / leaseholder' : ' · follower'}`, `<em class="cr-log ${durable ? 'cr-present' : ''}">U: ${durable ? 'durable' : 'absent'}</em><span>Applied price: ${applied ? '22.00' : '20.00'}</span>`, i === 2 ? 'cr-focus' : '');
  });
  return row('Range A · U means “install the proposed P7 change”',cells) + `<p class="cr-decision">${n < 3 ? 'Agreement not yet established by the leader' : 'Leader has established Raft commitment for U'}</p>` + row('Separate transaction question',[cell('SQL transaction', 'The complete transaction still needs a commit outcome')]);
}
function storage(n) {
  const value = (price, fresh = false) => `<span class="cr-value ${fresh ? 'cr-value-new' : ''}">P7 · ${price}</span>`;
  const old = value('20.00');
  const recent = value('22.00', true);
  const file = (name, contents, extra = '') => `<div class="cr-file ${extra}"><b>${name}</b>${contents}</div>`;
  return `<div class="cr-lsm">
    <p class="cr-lsm-scope">One store · P7’s price versions</p>
    <div class="cr-lsm-memory"><b>Memtable</b>${n === 1 ? recent : '<span class="cr-empty">Empty</span>'}</div>
    <div class="cr-lsm-disk">
      <div class="cr-wal"><b>Pebble WAL</b><span>${n ? '22.00 update recorded' : 'No new update'}</span></div>
      <div class="cr-lsm-files">
        ${n < 3 ? file('Sorted file A', old) : ''}
        ${n === 2 ? '<div class="cr-flushed"><span class="cr-file-arrow">↓ flush from memory</span>' + file('New file B', recent, 'cr-file-new') + '</div>' : ''}
        ${n === 3 ? `<div class="cr-merge-inputs">${file('A', old)}${file('B', recent)}</div><span class="cr-merge-arrow">↓ merge</span>${file('Replacement file C', recent + old, 'cr-file-new')}` : ''}
      </div>
    </div>
    <p class="cr-lsm-action">${['Before the update', 'Write', 'Flush', 'Compaction'][n]}</p>
  </div>`;
}
function split(n, mode) {
  const load = mode === 'one' ? ['quiet','all demand','quiet'] : ['busy','busy','busy'];
  const keys = [cell('P3',load[0]),cell('P7',load[1],'cr-focus'),cell('P9',load[2])];
  const place = n < 2 ? 'Copies: nodes 1, 2, 3' : 'Copies: nodes 2, 3, 4';
  if (n === 0) return row('Range A · one interval · lease node 2',keys) + row('Placement',[cell('Range A', 'Copies: nodes 1, 2, 3')]);
  return `<div class="cr-split"><div>${row('Left range · below P7',[keys[0]])}<p class="cr-location">Copies: nodes 1, 2, 3<br>Lease: node 2</p></div><div>${row('Right range · P7 and above',keys.slice(1))}<p class="cr-location">${place}<br>Lease: node ${n < 3 ? 2 : 4}</p></div></div><p class="cr-decision">${n === 1 ? 'Split: two ownership intervals; the copies are still on the same nodes.' : n === 2 ? 'Replica movement: the right range gains node 4 and leaves node 1.' : mode === 'one' ? 'Lease transfer: P7 moves to node 4; every request still reaches the same key.' : 'Lease transfer: left and right can now serve independent work on different nodes.'}</p>`;
}
export const models = {
  route: {
    frames: [
      frame(route(0),'Node 4 accepts the SQL connection and plans a lookup by product_id. It is the gateway for this request.'),
      frame(route(1),'The KV key identifies P7’s primary-index entry. Cached range metadata says range A covers it; this is not a search of every node.'),
      frame(route(2),'Node 2 holds A’s lease and serves this ordinary current read from its local replica. The gateway need not hold a copy of A.'),
      frame(route(3),'The KV value returns to the gateway, which returns the SQL price 20.00. Connecting to another node would still reach A’s serving authority.')
    ],
    note:'A model of one current primary-key lookup, with usable cached routing and an established lease. Placement is invented; schema lookup, transaction checks and internal messages are omitted. No elapsed time is implied.'
  },
  keys: {
    static: true,
    frames: [
      frame(`<div class="cr-lookup">
        <div class="cr-lookup-head"><b>Customer index</b><b>Primary row</b></div>
        <div class="cr-lookup-row"><div><span class="cr-label">Customer 1</span><strong>1 / 101</strong></div><span class="cr-lookup-link" aria-hidden="true">→</span><div><strong>101</strong><span>paid</span></div></div>
        <div class="cr-lookup-row"><div><span class="cr-label">Customer 1</span><strong>1 / 103</strong></div><span class="cr-lookup-link" aria-hidden="true">→</span><div><strong>103</strong><span>pending</span></div></div>
        <p class="cr-lookup-outside">Customer 2’s entry, 2 / 102, is outside this lookup.</p>
      </div>`, 'The two selected entries carry primary keys 101 and 103. Those primary rows supply the missing status.')
    ],
    note:'A conceptual added customer index after purchase 103. Labels stand for encoded keys, with table/index prefixes, family suffixes and version timestamps omitted. This illustrates an index access path, not a claimed optimiser choice for three rows.'
  },
  raft: {
    frames:[
      frame(raft(0),'All three replicas have applied the earlier history: P7 costs 20.00. Node 2 is the established leader and leaseholder.'),
      frame(raft(1),'Node 2 proposes U in its current Raft term and records it durably. One durable copy is not a majority of three.'),
      frame(raft(2),'Node 1 records U durably and acknowledges it. Two voting replicas now have U; node 3 has not received it.'),
      frame(raft(3),'Node 2 receives the acknowledgement and establishes Raft commitment for U. The agreed command is separate from its application to each replica’s data.'),
      frame(raft(4),'Node 2 applies U. Its local state can contain the new price while node 1 still has only the durable command. This does not yet describe the SQL transaction’s complete commit protocol.'),
      frame(raft(5),'The followers catch up and apply the agreed history. The range did not need to wait for every voter before establishing commitment for U.')
    ],
    note:'A fixed-membership three-voter model, using a new command from the current leader’s current term, non-malicious replicas and storage that honours durable acknowledgements. U compresses the range’s work for the separate 20.00 → 22.00 price transaction. Intents and transaction state are omitted; these are not six native SQL commit events.'
  },
  storage: {
    frames:[
      frame(storage(0),'Raft history and MVCC values both use the local engine. Here we follow just two price versions through memory and sorted files.'),
      frame(storage(1),'Pebble accepts storage writes into memory and records them in its local WAL. A durable acknowledgement cannot rely on memory alone.'),
      frame(storage(2),'Later, a memtable is flushed to a new sorted file. Reads can need memory and files at several levels to find the right version.'),
      frame(storage(3),'Compaction merges sorted contents into replacement files, then retires the old files when safe. That adds reads and writes beyond the application’s one update.')
    ],
    note:'A local storage model, not the full ordering of Raft persistence, state-machine application or transaction commit. The files are illustrative, not one file per range. Both price versions are retained here; removing obsolete history requires a separate safety decision. Value separation, caches and levels are omitted.'
  },
  split: {
    options:[{value:'several',label:'Demand across P3, P7 and P9'},{value:'one',label:'All demand on P7'}],
    make: mode => [
      frame(split(0,mode),'One range covers P3, P7 and P9. Node 4 may be available elsewhere, but this range still has its three copies and its lease on node 2.'),
      frame(split(1,mode),'A boundary before P7 creates two ranges. Each key belongs to one side. The split itself has not moved either side to another machine.'),
      frame(split(2,mode),'The right range is copied to node 4 and caught up before the model removes its node-1 copy. The left range keeps its original placement.'),
      frame(split(3,mode),mode === 'one' ? 'The right lease moves to node 4. P7 is still one key with one serving authority. Emptying the left range of demand did not divide P7’s decisions.' : 'The right lease moves to node 4. P3’s independent work can use node 2 while P7 and P9 use node 4; actual benefit still depends on the workload and resources.')
    ],
    note:'Invented product-key intervals and demand categories, not a native placement schedule or measured load. Split, replica movement and lease transfer are shown separately. Real rebalancing preserves membership safety and can interleave these actions.'
  }
};
export const framesFor = (kind, option) => models[kind].make ? models[kind].make(option || 'several') : models[kind].frames;
