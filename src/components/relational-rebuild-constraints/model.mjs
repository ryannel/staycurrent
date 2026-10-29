const table = (caption, heads, rows) => `<table><caption>${caption}</caption><thead><tr>${heads.map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const box = (title,content,cls='') => `<div class="cf-box ${cls}"><strong>${title}</strong>${content}</div>`;
const line = (text, cls='')=>`<p class="cf-verdict ${cls}">${text}</p>`;
export const figures = {
 quantity: {
  title:'Which quantities reach the table?', number:1,
  caption:'Independent attempts to add a third line to order 103. Its identity and product reference are valid; only the quantity rule differs.',
  options:[], steps:1,
  draw:()=>({html:table('CHECK (quantity > 0) with and without a required value',['Quantity','CHECK result','CHECK alone','NOT NULL + CHECK'],[
   ['2','true','Accepted','Accepted'],
   ['0','false','Rejected','Rejected'],
   ['NULL','unknown','Accepted','Rejected · required']
  ]),explanation:'CHECK rejects false. NOT NULL also rejects a missing value.'})
 },
 tenant:{
  title:'Two existing IDs can make one wrong association',number:3,
  caption:'Tenant 10 owns the tea shop; Rowan belongs to tenant 20. Each rule is tested against the same proposed order.',
  options:[],steps:1,
  draw:()=>({html:
   table('Existing customers · tenants 10 and 20 both exist',['Tenant','Customer','Name'],[['10','1','Mina Shah'],['20','4','Rowan Vale']])+
   box('Proposed order', '<div class="cf-value">tenant 10 · customer 4</div>')+
   '<div class="cf-columns">'+
   box('Separate references', '<p>Tenant 10 exists ✓</p><p>Customer 4 exists ✓</p>'+line('Accepted · membership untested','cf-good'))+
   box('Composite reference', '<p>Customer pair (10, 4) is absent.</p><p>Rowan’s pair is (20, 4).</p>'+line('Rejected · wrong tenant','cf-bad'))+
   '</div>',
   explanation:'The composite reference requires both values in the same customer row.'}),
 },
 timing:{
  title:'The same final rows, checked at different times',number:5,
  caption:'Independent import scenario for a new order 105: a line arrives before its parent order. Other line values and product references are valid. The deferred path deliberately defers a deferrable foreign key.',
  options:[{label:'Foreign key',values:['Immediate','Deferred']}],steps:4,
  draw:(s,o)=>{const deferred=o[0]===1;return {html:`<div class="cf-columns">${box('1 · Insert line for order 105',s===0?'<p>Waiting</p>':line(deferred?'Line inserted; reference pending':'Rejected: order 105 is absent',deferred?'':'cf-bad'))}${box('2 · Insert order 105',s<2?'<p>Waiting</p>':line(deferred?'Parent order inserted':'Transaction must roll back',deferred?'cf-good':'cf-bad'))}</div>`+box('3 · COMMIT',s<3?'<p>Waiting</p>':line(deferred?'Reference now passes · both rows commit':'Nothing from this transaction commits',deferred?'cf-good':'cf-bad')),explanation:s===0?'The intended final state contains an order and its line. The parent does not exist yet.':s===1?(deferred?'The line’s reference check can wait. The transaction has not committed.':'The first INSERT fails. In PostgreSQL this transaction is now in an error state; this simple path needs ROLLBACK.'):s===2?(deferred?'The second statement supplies order 105. The transaction now contains the matching parent.':'The parent-first order would avoid the failure. Changing the intended final state is unnecessary.'):(deferred?'At COMMIT, the referenced order exists, so the foreign key passes. Omitting the parent would make COMMIT fail.':'Immediate checking rejected the first statement before the later statement could supply its parent.')};}
 },
 payments:{
  title:'Two checks against the same unpaid order',number:6,
  caption:'A conceptual concurrent schedule, not a recorded database run. At Read Committed, ordinary reads do not see another transaction’s uncommitted payment. Both inserts use distinct payment IDs and satisfy the row constraints.',options:[],steps:5,
  draw:s=>({html:box('Order 103 · line value 29.00',`<div class="cf-value">Committed payments: ${s===4?'40.00':'0.00'}</div>`)+`<div class="cf-columns">${box('Transaction A',s<1?'<p>Ready</p>':`<p>Read paid total: <b>0.00</b></p><p>0.00 + 20.00 ≤ 29.00 ✓</p>${s>=3?line('Insert payment A: 20.00'):''}${s===4?line('COMMIT','cf-good'):''}`)}${box('Transaction B',s<2?'<p>Ready</p>':`<p>Read paid total: <b>0.00</b></p><p>0.00 + 20.00 ≤ 29.00 ✓</p>${s>=3?line('Insert payment B: 20.00'):''}${s===4?line('COMMIT','cf-good'):''}`)}</div>`+(s===4?line('40.00 > 29.00 · the aggregate rule is broken','cf-bad'):line('No shared lock or serializable protocol in this schedule')),explanation:['Order 103 starts with no payments and lines worth 29.00. The proposed rule forbids recorded payments above 29.00.','A reads no payments and decides its proposed 20.00 fits. It has not committed a payment.','Before A commits, B also reads no payments. Its own 20.00 appears to fit the same remaining allowance.','Both insert after their checks and before either commits. Distinct payment rows do not by themselves make the two decisions wait for one another.','Both commit. Each check passed against 0.00; together the payments total 40.00. Moving those reads into ordinary triggers would not by itself remove this schedule.'][s]})
 }
};
