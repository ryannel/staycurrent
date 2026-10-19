import test from 'node:test';
import assert from 'node:assert/strict';
import {booking,fanout,outerJoin,notIn,windowRows,history,paginate,constraint,importBatch,partition,joinWork} from './model.mjs';
import {definitions,defaults,view} from './views.mjs';
test('commit publishes submitted statements, including a prematurely ended booking protocol',()=>{
 assert.deepEqual(booking(1,'commit').published,{places:1,order:false});
 assert.deepEqual(booking(2,'commit').published,{places:1,order:true});
 for(const step of [0,1,2])for(const decision of ['open','rollback'])assert.deepEqual(booking(step,decision).published,{places:2,order:false});
 assert.match(view('Booking',{step:'1',decision:'commit'}),/Only the decrement committed/);
});
test('independent children multiply, summaries preserve line total including no payment',()=>{
 assert.equal(fanout(1).total,45);assert.equal(fanout(2).total,90);
 assert.equal(fanout(2,true).total,45);assert.equal(fanout(0,true).total,45);assert.equal(fanout(0).pairs.length,0);
});
test('outer filter cannot recover a cancelled match by asking for a null booking',()=>{
 assert.deepEqual(outerJoin(false,'or').rows.map(r=>r.session),['s7','s8']);
 assert.deepEqual(outerJoin(true,'or').rows.map(r=>r.session),['s7']);
 assert.deepEqual(outerJoin(true,'on').rows.map(r=>r.session),['s7','s8']);
 assert.equal(outerJoin(true,'on').rows[1].booking,null);
});
test('unknown membership, matching FALSE and empty input use SQL rules',()=>{
 assert.deepEqual(notIn().map(r=>r.truth),['FALSE','UNKNOWN']);
 assert.deepEqual(notIn().filter(r=>r.notExists).map(r=>r.id),['o82']);
 assert.ok(notIn([]).every(r=>r.notIn));assert.ok(notIn([null]).every(r=>!r.notIn));
});
test('peer frame and deterministic rows diverge at first tied order',()=>{
 assert.equal(windowRows('peers',0).total,60);assert.equal(windowRows('rows',0).total,40);
 assert.equal(windowRows('peers',0,false).total,40);
 assert.equal(windowRows('previous',3).total,40);assert.equal(windowRows('customer',2).total,40);
});
test('bitemporal half-open boundaries select exactly one version',()=>{
 assert.equal(history(9,12).price,20);assert.equal(history(9,16).price,22);
 assert.equal(history(8,15).price,22);assert.equal(history(7,15).price,20);
 for(let e=1;e<=20;e++)for(let k=1;k<=20;k++)assert.equal(history(e,k).versions.filter(v=>v.selected).length,1);
});
test('pagination exposes inserts, deletes, moving rows and value captures separately',()=>{
 assert.deepEqual(paginate('insert','offset').next.map(r=>r.id),['o84','o83']);
 assert.deepEqual(paginate('insert').next.map(r=>r.id),['o83','o82']);
 assert.deepEqual(paginate('insert','time').next.map(r=>r.id),['o82','o81']);
 assert.deepEqual(paginate('move').next.map(r=>r.id),['o83','o81']);
 assert.equal(paginate('value','keyset','ids').next[0].total,99);
 assert.equal(paginate('value','keyset','values').next[0].total,30);
 assert.equal(paginate('value','keyset','snapshot').next[0].total,30);
 assert.deepEqual(paginate('delete','offset').next.map(r=>r.id),['o82','o81']);
});
test('captures continue by saved sequence when current sort values or rows change',()=>{
 for(const capture of ['ids','values'])for(const method of ['keyset','time','offset']){
  assert.deepEqual(paginate('move',method,capture).next.map(r=>r.id),['o83','o82']);
  assert.deepEqual(paginate('delete',method,capture).next.map(r=>r.id),['o83','o82']);
 }
 const ids=paginate('delete','keyset','ids');
 assert.equal(ids.source[0].missing,true);
 assert.equal(ids.source[2].sequence,3);
 assert.equal(paginate('move','keyset','ids').next[1].time,14);
 assert.equal(paginate('move','keyset','values').next[1].time,10);
});
test('empty pair arithmetic and SQL empty aggregation are distinguished',()=>{
 const html=view('JoinPairs',{payments:'0',shape:'raw'});
 assert.match(html,/0 output rows · contribution arithmetic €0/);
 assert.match(html,/SQL SUM over those rows is NULL/);
});
test('tenant membership and CHECK null handling are independent gates',()=>{
 assert.equal(constraint().accepted,false);assert.equal(constraint('t4','s8',1,true,false).accepted,true);
 assert.equal(constraint('t4','s7',null,false).accepted,true);assert.equal(constraint('t4','s7',null,true).accepted,false);
 assert.equal(constraint('t4','s7',0,false).accepted,false);
});
test('six import inputs reconcile and a repaired contradiction changes the winner',()=>{
 const initial=importBatch();assert.deepEqual(initial.rows.map(r=>r.outcome),['applied','stale','contradictory','malformed','contradictory','duplicate']);
 assert.equal(initial.destination.find(r=>r.id==='b17').version,8);
 const repaired=importBatch(true);assert.equal(repaired.destination.find(r=>r.id==='b17').version,9);assert.equal(repaired.rows[1].outcome,'superseded');
 assert.equal(importBatch(true,10).destination.find(r=>r.id==='b17').version,10);
 assert.equal(importBatch(false,6).rows[1].outcome,'destination disagreement');
 assert.equal(importBatch(true,9).rows[2].outcome,'already current');
});
test('partition bounds, missing destination and detached table are distinct',()=>{
 assert.deepEqual(partition().visited.map(r=>r.id),['October']);assert.equal(partition().target,null);
 assert.deepEqual(partition('id').visited.map(r=>r.id),['October','November']);
 assert.equal(partition('boundary',false,false,1,11).target,'November');
 assert.equal(partition('all',true).target,'December');
 const detached=partition('all',false,true);assert.equal(detached.parts[0].rows[0],'s7 · 19 Oct');assert.equal(detached.visited.length,1);
});
test('schematic join work preserves result while the selected algorithm changes',()=>{
 assert.equal(joinWork(40000,1).probes,40000);assert.equal(joinWork(40000,40000).deliveryRows,90000);
 assert.equal(joinWork(40000,40000,10000).batches,4);
});
test('every initial aid renders inspectable state without client JavaScript',()=>{
 for(const kind of Object.keys(definitions)){const html=view(kind,defaults(kind));assert.ok(html.length>200,kind);assert.doesNotMatch(html,/undefined|NaN/,kind);}
});
