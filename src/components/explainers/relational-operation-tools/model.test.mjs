import test from 'node:test';
import assert from 'node:assert/strict';
import * as m from './model.mjs';
import {scenes,defaults,render} from './scenes.mjs';
test('overlapping stale calculations conceal an extra booking behind a valid counter',()=>{
  const s=m.bookingHistory();assert.equal(s.counter,2);assert.equal(s.bookings.length,3);assert.equal(s.oversold,true);
  assert.equal(m.bookingHistory({policy:'stale',serial:true}).bookings.length,2);
  assert.equal(m.bookingHistory({policy:'stale',serial:true,capacity:3}).counter,3);
});
test('guarded capacity check waits and rechecks; increasing capacity permits the contender',()=>{
  assert.equal(m.bookingHistory({policy:'guarded',step:3}).bRead,null);
  assert.equal(m.bookingHistory({policy:'guarded'}).bookings.length,2);
  assert.equal(m.bookingHistory({policy:'guarded',capacity:3}).bookings.length,3);
});
test('stable snapshots do not protect predicate decisions; chosen Serializable history rejects B',()=>{
  assert.equal(m.bookingHistory({policy:'snapshot'}).oversold,true);
  const s=m.bookingHistory({policy:'serializable'});assert.equal(s.rejected,true);assert.equal(s.bookings.length,2);
  assert.equal(m.bookingHistory({policy:'serializable',step:5}).bPending,true);
});
test('opposite order forms a cycle, consistent order releases the waiter without cycle',()=>{
  assert.equal(m.lockHistory({step:3}).cycle,false);assert.equal(m.lockHistory({step:4}).cycle,true);
  assert.equal(m.lockHistory({opposite:false,step:3}).holders.s8,'A');
  assert.deepEqual(m.lockHistory({opposite:false,step:6}).holders,{s7:'—',s8:'—'});
});
test('cleanup cannot reclaim the version needed by the report',()=>{
  assert.equal(m.versions({updates:5,reader:true,cleanup:true}).filter(v=>v.reusable).length,0);
  assert.equal(m.versions({updates:5,reader:false,cleanup:true}).filter(v=>v.reusable).length,5);
});
test('uncertain commit requires same identity and intent; new identity can duplicate',()=>{
  assert.equal(m.retry().orders.length,1);assert.equal(m.retry({committed:true,same:false}).orders.length,2);
  assert.equal(m.retry({committed:false,same:true}).orders.length,1);
  const conflict=m.retry({committed:true,same:true,amount:5000});assert.equal(conflict.conflict,true);assert.equal(conflict.orders[0].amount,4000);
});
test('after-accept crash duplicates delivery; recipient suppression is separate',()=>{
  assert.equal(m.outbox({attempts:2,dedup:false}).effects,2);assert.equal(m.outbox({attempts:2,dedup:true}).effects,1);
  assert.equal(m.outbox({attempts:3,dedup:false}).effects,2); // replacement finished normally
  assert.equal(m.outbox({crash:'before-send',attempts:1}).effects,0);
  assert.equal(m.outbox({crash:'after-complete',attempts:3,dedup:false}).effects,1);
});
test('completion-only fence can accept a stale effect',()=>{
  assert.equal(m.lease({boundary:'completion'}).accepted,true);assert.equal(m.lease({boundary:'completion'}).completion,false);
  assert.equal(m.lease({boundary:'effect'}).accepted,false);assert.equal(m.lease({boundary:'effect',token:2}).accepted,true);
});
test('restore target and reconciliation do not silently repair unrelated deleted work',()=>{
  assert.deepEqual(m.recovery({target:1}).orders,['o81']);
  assert.deepEqual(m.recovery({target:1,reconcile:true}).orders,['o81','o82']);
  assert.deepEqual(m.recovery({target:1,reconcile:true}).missing,[]);
  assert.deepEqual(m.recovery({target:3,reconcile:true}).missing,['o81']);
  assert.equal(m.recovery({target:2,chain:false}).reachable,false);
  assert.equal(m.recovery({target:1,reconcile:true,capacity:1}).unresolved,true);
});
test('receipt, flush and apply are bounded prefixes; old snapshot stays old',()=>{
  assert.equal(m.replication({received:3,flushed:3,applied:0}).found,false);
  assert.equal(m.replication({received:0,flushed:3,applied:3}).applied,0);
  assert.equal(m.replication({route:'barrier',applied:0}).barrier,true);
  assert.equal(m.replication({received:3,flushed:3,applied:3,old:true}).found,false);
  assert.equal(m.replication({received:1,flushed:1,applied:1,route:'barrier'}).found,true);
});
test('route change cannot fence cached clients',()=>{
  assert.equal(m.fence().split,true);assert.equal(m.fence({fenced:true}).split,false);
});
test('empty cursor misses a lower late key; a sweep alone leaves writer invariant open',()=>{
  assert.equal(m.backfill().cursorRemaining,0);assert.equal(m.backfill().missing,1);
  assert.equal(m.backfill({sweep:true}).missing,0);assert.equal(m.backfill({sweep:true}).proof,false);
  assert.equal(m.backfill({maintained:true}).proof,true);
});
test('independent slots increase parallelism; one hot lock remains serial',()=>{
  const independent=m.queue({slots:2,deadline:350});assert.deepEqual(independent.map(r=>r.finish),[50,50,100,100,150,150]);
  const hot=m.queue({slots:6,hot:true,deadline:350});assert.deepEqual(hot.map(r=>r.finish),[50,100,150,200,250,300]);
  assert.equal(m.queue({slots:6,hot:true,deadline:100}).filter(r=>r.admitted).length,2);
});
test('cancelling idle owner is not transaction end; row setting is not authenticated identity',()=>{
  assert.equal(m.diagnostic().holder,'A');assert.equal(m.diagnostic({action:'rollback'}).released,true);
  assert.equal(m.access().rows[0][0],'t9');assert.equal(m.access({trusted:true,context:'t9'}).rows[0][0],'t4');
  assert.equal(m.access({trusted:true,owner:true}).rows.length,2);
});
test('routing counts directory maintenance separately and does not split a hot counter',()=>{
  assert.equal(m.routing().owners.length,1);assert.equal(m.routing({split:true,global:true}).owners.length,4);
  assert.equal(m.routing({hot:100,nodes:6}).work[0],100);
  assert.ok(Math.abs(m.routing({hot:70,nodes:6}).work.reduce((a,b)=>a+b,0)-100)<1e-9);
});
test('atomic decision controls logical unit before physical intents finish installation',()=>{
  const blocked=m.atomic({step:2});assert.equal(blocked.blocked,true);assert.equal(blocked.p,1);assert.equal(blocked.q,false);
  const stagger=m.atomic({step:4});assert.equal(stagger.p,2);assert.equal(stagger.q,true);assert.equal(stagger.qInstalled,false);assert.equal(stagger.qIntent,true);
  assert.equal(m.atomic({step:5,decision:'abort'}).p,1);
  assert.equal(m.atomic({step:5,failed:true}).known,false);
});
test('snapshot progress, common cut and retention are separate requirements',()=>{
  assert.equal(m.snapshot({mixed:true}).coherent,false);assert.equal(m.snapshot({cut:25,q:15}).ready,false);
  assert.equal(m.snapshot({cut:15,q:25,retained:false}).ready,false);
  assert.equal(m.snapshot({cut:25,q:25,retained:false}).ready,true);
});
test('regional majority and quota are both required',()=>{
  assert.equal(m.placement({layout:'21',lost:'A'}).available,false);
  for(const lost of ['A','B','C'])assert.equal(m.placement({layout:'111',lost}).available,true);
  assert.equal(m.placement({global:true,quota:false}).available,false);
  assert.equal(m.placement({lost:'C',global:true,quota:true}).available,false);
  assert.equal(m.placement({lost:'B',global:true,quota:true}).available,true);
});
test('tail must include update delete and insert; joint votes must satisfy both groups',()=>{
  assert.equal(m.movement({tail:0}).dest.length,2);assert.equal(m.movement({tail:0}).exact,false);
  assert.equal(m.movement({tail:3}).exact,true);assert.equal(m.movement({tail:3,missDelete:true}).exact,false);
  assert.equal(m.movement({acks:'CD'}).joint,false);assert.equal(m.movement({acks:'AB'}).joint,false);assert.equal(m.movement({acks:'BC'}).joint,true);
  assert.equal(m.movement({generate:30,apply:30}).drain,0);
});
test('storage runway follows the continuing rate; equal rates cannot close an earlier gap',()=>{
  assert.equal(m.retention({generate:20,consume:15,minutes:10}).retained,5000);
  assert.equal(m.retention({generate:20,consume:20,minutes:30}).retained,2000);
  assert.equal(m.retention({generate:20,consume:30,minutes:30}).retained,0);
  assert.equal(m.retention({generate:40,consume:10,minutes:30}).free<0,true);
  const a=m.retention({budget:12000}),b=m.retention({budget:24000});assert.equal(a.rate,b.rate);assert.ok(b.runway>a.runway);
});
test('every control alternative renders finite initial and changed output',()=>{
  for(const [name,scene] of Object.entries(scenes)){
    for(const control of scene.controls){
      for(const value of control.options?.map(x=>x[0])??[control.min,control.max]){
        const output=render(name,{...defaults(name),[control.key]:value});assert.ok(output.html.length>100,name);assert.ok(output.status,name);assert.ok(!output.html.includes('NaN'),name);
      }
    }
  }
});

test('unavailable decision authority cannot paint later recovery or installation as completed',()=>{
  const s=render('Atomic',{...defaults('Atomic'),step:5,failed:'yes'});
  assert.equal((s.html.match(/op-past/g)||[]).length,2);
  assert.match(s.html,/Decision unavailable; keep waiting/);
  assert.doesNotMatch(s.html,/Recover durable COMMIT/);
});
test('admission exposes the forecast behind a rejected hot-lock request',()=>{
  const s=render('Queue',{...defaults('Queue'),slots:6,hot:'yes'});
  assert.match(s.html,/projected finish 200 ms exceeds deadline 150 ms/);
  assert.match(s.html,/Projected finish/);
  assert.match(s.html,/Rejected before borrowing/);
});

test('queue controls admit the service-time and deadline case developed after the figure',()=>{
  const controls=Object.fromEntries(scenes.Queue.controls.map(c=>[c.key,c]));
  assert.ok(controls.hold.max>=150);
  assert.equal((120-controls.deadline.min)%controls.deadline.step,0);
  const rows=m.queue({slots:6,hot:false,deadline:120,hold:150});
  assert.equal(rows.filter(r=>r.admitted).length,0);
  assert.ok(rows.every(r=>r.finish===150));
});
test('every range default is a representable native input value',()=>{
  for(const [name,scene] of Object.entries(scenes)){
    for(const control of scene.controls){
      if(control.options)continue;
      const value=Number(control.value);
      assert.ok(value>=control.min&&value<=control.max,`${name}.${control.key}: default outside range`);
      const steps=(value-control.min)/(control.step??1);
      assert.ok(Math.abs(steps-Math.round(steps))<1e-9,`${name}.${control.key}: default is not aligned to step`);
    }
  }
});
