import test from 'node:test';
import assert from 'node:assert/strict';
import { historyPlan, writeBuckets } from './partitioned-model.mjs';
test('layout, ordering and extra index preserve query answers', () => {
  for (const query of ['customer','device']) {
    const expected = historyPlan({query}).matches;
    for (const layout of ['customer','device']) for (const order of ['time','temperature']) for (const index of [false,true]) for (const membership of [false,true]) {
      const plan = historyPlan({query,layout,order,index,membership});
      assert.deepEqual(plan.matches,expected);
      assert.ok(plan.examined >= expected.length);
      assert.equal(plan.copies,index?24:12);
      for (const row of expected) assert.ok(plan.groups.some(g=>g.examined.includes(row)));
    }
  }
});
test('routing and time order exclude different work', () => {
  assert.equal(historyPlan({layout:'customer',query:'customer'}).examined,2);
  assert.equal(historyPlan({layout:'device',query:'customer'}).requests,6);
  assert.equal(historyPlan({layout:'device',query:'customer',index:true}).requests,1);
  assert.equal(historyPlan({layout:'customer',query:'customer',order:'temperature'}).examined,4);
});
test('sharding conserves writes and trades maximum load for read fanout', () => {
  for (const hot of [true,false]) for (const shards of [1,2,4]) {
    const r=writeBuckets(shards,hot);
    assert.equal(r.total,100);
    assert.equal(r.buckets.reduce((n,b)=>n+b.writes,0),100);
    assert.equal(r.fanout,shards);
  }
  assert.equal(writeBuckets(1).largest,70);
  assert.equal(writeBuckets(4).largest,18);
});

test('a complete membership list routes a customer query to its two device groups', () => {
  const full=historyPlan({layout:'device',query:'customer'});
  const known=historyPlan({layout:'device',query:'customer',membership:true});
  assert.deepEqual(known.matches,full.matches);
  assert.deepEqual(known.groups.filter(g=>g.accessed).map(g=>g.key),['B1','B2']);
  assert.equal(known.requests,2);
  assert.equal(known.examined,2);
  assert.equal(known.copies,12);
  assert.equal(historyPlan({layout:'device',query:'customer',membership:true,order:'temperature'}).examined,4);
  assert.equal(historyPlan({layout:'device',query:'customer',membership:true,index:true}).requests,1);
  assert.equal(historyPlan({layout:'customer',query:'device',membership:true}).requests,3);
});
