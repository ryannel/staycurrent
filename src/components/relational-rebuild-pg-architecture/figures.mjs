const box = (label, body, active = false, extra = '') => `<div class="pa-box${active ? ' pa-active' : ''} ${extra}"><span class="pa-label">${label}</span>${body}</div>`;
const arrow = text => `<div class="pa-arrow">↓ ${text}</div>`;
const tuple = (label, price, metadata, active = false) => box(label, `<b>P7 · ${price}</b><small>${metadata}</small>`, active, 'pa-tuple');
const row = (a,b) => `<div class="pa-row"><span>${a}</span><b>${b}</b></div>`;
export const models = {
 buffers: {
  title: 'One page can serve two backends',
  caption: 'Four invented buffer slots. Page numbers refer to different heap or index pages; they are not buffer numbers. The clock starts at slot 2 in the replacement example. All chosen counts and visits are illustrative; special scan strategies are omitted.',
  choices: [],
  steps: [
   'Backend A needs products page 12 for P7. The page is absent from shared buffers: a buffer miss.',
   'The whole page enters slot 1. A pins the buffer while using it, then reads item 3: P7 costs 20.00. The read may be served by the operating system cache.',
   'A releases its pin. Backend B asks for P3 on the same page and gets a shared-buffer hit. Both backends use the same cached page.',
   'Other work fills the remaining slots. Slot 2 is pinned by a backend. The usage counts give recently used buffers some protection from replacement.',
   'A request needs page 11. The clock hand considers slot 2 first. Its pin count is 1, so it cannot be repurposed.',
   'Slot 3 is unpinned but its usage count is 1. The sweep reduces that count to 0 and moves on, rather than choosing it immediately.',
   'Slot 4 is unpinned with usage count 0, so its clean page can give way to page 11. Slot 4 now names a different page. Page 10 still exists in its file.'
  ],
  frame(s) {
   const labels = s === 0 ? ['Empty','Empty','Empty','Empty'] : s < 3 ? ['products · 12','Empty','Empty','Empty'] : ['products · 12','index · 4','heap · 31', s===6?'heap · 11':'heap · 10'];
   const pins = s===1?[1,0,0,0]:s>=3?[0,1,0,s===6?1:0]:[0,0,0,0];
   const use = s===0?[0,0,0,0]:s===1?[1,0,0,0]:s===2?[2,0,0,0]:[2,1,s>=5?0:1,s===6?1:0];
   return `<div class="pa-banner">${['A → needs products page 12','A → reads P7: 20.00','B → reads P3: 4.50','Other requests → pool is full','Need page 11 → inspect slot 2','Need page 11 → inspect slot 3','Need page 11 → reuse slot 4'][s]}</div><div class="pa-label">Shared memory · shared buffers</div><div class="pa-slots">${labels.map((p,i)=>box(`Slot ${i+1}`,`<b>${p}</b><small>pins ${pins[i]} · usage ${use[i]}</small>${s===4&&i===1?'<em>Pinned · skip</em>':s===5&&i===2?'<em>Usage 1 → 0</em>':s===6&&i===3?'<em>New page loaded</em>':''}`, (s<3&&s>0&&i===0)||(s>=4&&i===s-3))).join('')}</div>${arrow('a miss obtains a page; a hit reuses it')}<div class="pa-files">${box('Table and index files','Pages 4, 10, 11, 12, 31 … remain stored independently of which slots cache them.')}</div>`;
  }
 },
 versions: {
  title:'Two snapshots read the same page',
  caption:'A model of ordinary reads by other transactions. The report is read-only Repeatable Read and has already run its first SELECT. C and W are symbolic transaction identities, not measured XIDs. The same-page placement is chosen here; HOT is explained below.',
  choices:[],
  steps:[
   'The report runs its first SELECT and establishes its snapshot. The committed creator C is visible to it. P7 reads 20.00.',
   'Writer W creates a new P7 tuple at 22.00 and marks the old tuple as replaced by W. W has not committed. Other ordinary readers still return 20.00.',
   'W commits. Both physical tuples remain on the shared page. Commit changes the transaction outcome; it does not give the report a new snapshot.',
   'The report repeats its SELECT. W is outside the committed history admitted by its established snapshot: the old version remains visible and the new version is excluded. It returns 20.00.',
   'A later query establishes a snapshot after W committed. It admits W: the old version has been replaced and the new version is visible. It returns 22.00.'
  ],
  frame(s) {return `<div class="pa-banner">Writer W: <b>${s===0?'not started':s===1?'in progress':'committed'}</b></div><div class="pa-page"><span class="pa-label">products · heap page 12</span>${tuple('Item 3 · earlier version','20.00',`creator C · replaced by ${s===0?'nobody':'W'}`,s===0||s===3)}${s>=1?tuple('Item 4 · new version','22.00','creator W · no replacement',s===4):'<div class="pa-free">Free space for another version</div>'}</div><div class="pa-two">${box('Report · earlier snapshot',`<b>${s===1?'20.00':s>=3?'20.00':'20.00'}</b><small>W ${s===0?'has not started':'is not admitted'}</small>`,s===3)}${box('Later snapshot',`<b>${s<4?'Not started':'22.00'}</b><small>${s<4?'After W commits':'W is admitted'}</small>`,s===4)}</div>`;}
 },
 lookup: {
  title:'A matching key still needs a visible tuple',
  caption:'An illustrative B-tree index scan before the price update. The root and leaf are invented index pages, and (12,3) is an invented heap TID. Both kinds of page use shared buffers. A tiny real products table can be cheaper to scan.',
  choices:[],
  steps:[
   'The executor asks the B-tree for product_id P7. The root directs the search towards the key’s leaf page.',
   'The leaf has P7 with heap TID (12,3). This locates item 3 of products page 12. The leaf does not hold the requested price.',
   'Obtain heap page 12 through shared buffers. Item 3 is a line pointer to the tuple bytes; the TID does not encode their byte offset.',
   'Check the tuple against the query’s snapshot and transaction outcomes. This version is visible: its creator committed within that snapshot and it has no effective replacement.',
   'Read price 20.00 from the visible tuple and send it through the executor to the client. Finding P7 in the index was only part of finding the answer.'
  ],
  frame(s){return `<div class="pa-path">${box('B-tree · root', '<b>Search P7 → right leaf</b>',s===0)}${arrow('descend')}${box('B-tree · leaf','<div class="pa-key-row"><span>P3 → (12,1)</span><b>P7 → (12,3)</b><span>P9 → (12,2)</span></div>',s===1)}${arrow('TID (page 12, item 3)')}${box('Heap page 12 · item 3','<b>Line pointer → P7 · 20.00</b><small>Creator C · no replacement</small>',s===2||s===3)}${arrow(s<3?'check visibility':'visible to this snapshot')}${box('Returned price',`<b>${s===4?'20.00':'—'}</b>`,s===4)}</div>`;}
 },
 hot: {
  title:'When an update can keep its index entries',
  caption:'Three independent replays of P7’s 20.00 → 22.00 update. Only ordinary B-tree indexes are drawn. Addresses, free space and chain length are illustrative. Cleanup is shown only after no retained snapshot or other retention requirement needs the earlier tuple.',
  choices:[['hot','Key index; room on page'],['indexed','Price also indexed'],['full','Key index; page full']],
  steps:[
   'Start with P7 at (12,3). The primary-key B-tree points to that tuple. Choose which physical conditions the update will meet.',
   'UPDATE creates a new version. Same-page space and which columns the indexes reference determine whether it can join a HOT chain.',
   'After commit, an earlier snapshot can still need 20.00. A later reader finds 22.00 using the appropriate heap version. Unchanged product identity alone does not determine the index work.',
   'Once the earlier tuple is no longer required, cleanup can reclaim its bytes. In the HOT case, item 3 can become a redirect to item 4 while the original index entry remains useful.'
  ],
  frame(s,choice='hot') {
   const hot=choice==='hot', full=choice==='full', changed=s>=1;
   const dest=full?'(13,1)':'(12,4)';
   const indexes=box('Primary-key B-tree', `<b>P7 → (12,3)</b>${changed&&!hot?`<b>P7 → ${dest}</b>`:''}<small>${changed?(hot?'Existing entry retained':'New entry for new tuple'):'One entry for P7'}</small>`,s===1);
   const price=choice==='indexed'?box('Price B-tree',`<b>20.00 → (12,3)</b>${changed?`<b>22.00 → ${dest}</b>`:''}`,s===1):'';
   const old = s===3&&hot?box('Item 3 · redirect','<b>→ item 4</b><small>Old tuple bytes reusable</small>',true):tuple('Item 3 · earlier version','20.00',changed?`replaced by W · link → ${dest}`:'creator C · no replacement',false);
   const newer=changed?tuple(`Item ${full?'1':'4'} · new version`,'22.00',hot?'Heap-only tuple · no own index entry':'Own index entries required',s===1||s===2):`<div class="pa-free">${full?'No room for another version':'Room for the new tuple'}</div>`;
   return `<div class="pa-banner">${!changed?'Before UPDATE':(s===1?'W updating · ':s===2?'W committed · ':'After retention · ')+(hot?'HOT · same page, no indexed value changes':'Not HOT · '+(full?'new version needs another page':'price is referenced by an index'))}</div><div class="pa-indexes">${indexes}${price}</div>${arrow(hot?'follow the existing heap target':'follow matching entries, then test heap visibility')}<div class="pa-page"><span class="pa-label">Heap page 12</span>${old}${full&&changed?'<div class="pa-free">Other tuples occupy the remaining space</div>':newer}</div>${full&&changed?`<div class="pa-page"><span class="pa-label">Heap page 13</span>${newer}</div>`:''}${s===3&&!hot?'<div class="pa-note">Old tuple and index entries need coordinated cleanup. There is no same-page HOT redirect for this pair.</div>':''}`;
  }
 },
 write: {
  title:'Commit, page writing and cleanup do different work',
  caption:'One possible schedule for this logged heap update with normal local durable commit settings and reliable storage. U and C denote change and commit records, not real WAL encodings or LSNs. WAL or the data page may be written earlier than shown, subject to write-ahead ordering.',
  choices:[],
  steps:[
   'The backend makes the price update in the shared heap buffer and generates WAL for the change. The buffer is dirty. No commit has happened yet.',
   'COMMIT adds the commit record. The backend must ensure the transaction’s required WAL is flushed before giving a normal local durable acknowledgement.',
   'WAL through the commit record is durable. The backend can acknowledge COMMIT while the data file still holds the earlier page. A later snapshot may read 22.00.',
   'Later page writing makes the changed heap page reach its data file. The WAL covering that page must already be durable. A clean buffer does not mean old tuple bytes have been reclaimed.',
   'Later still, when retention permits, pruning can reclaim obsolete tuple space. That change dirties the page again and generates its own WAL. Commit, page writing and cleanup are separate work.'
  ],
  frame(s){return `<div class="pa-two">${box('Shared heap buffer',`<b>${s===4?'P7: 22.00 + reusable space':'P7 versions: 20.00 + 22.00'}</b><small>${s<3?'Dirty · changed page not yet written':s===3?'Clean after page write':'Pruning changed the page · dirty again'}</small>`,s===0||s===3||s===4)}${box('WAL buffers',`<b>${s===0?'U':s===4?'U + C + pruning':'U + C'}</b><small>${s<2?'Required flush pending':s===4?'New pruning WAL not yet flushed':'Required commit WAL flushed'}</small>`,s===1||s===4)}</div>${arrow('write-ahead ordering')}<div class="pa-two">${box('Heap data file',`<b>${s<3?'Earlier page':'Changed page'}</b><small>${s<3?'Can lag the durable commit':s===4?'Cleanup changes still need writing':'Still contains old tuple bytes'}</small>`,s===3)}${box('Durable WAL',`<b>${s<2?'Earlier history':'U + C'}</b><small>${s<2?'No durable commit shown':'Can restore missing page changes'}</small>`,s===2)}</div><div class="pa-banner">Application: <b>${s<2?'waiting for COMMIT':'COMMIT acknowledged'}</b></div>`;}
 }
};
