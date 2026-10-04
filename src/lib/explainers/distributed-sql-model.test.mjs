import test from 'node:test';
import assert from 'node:assert/strict';
import { rangeWrite, transferView } from './distributed-sql-model.mjs';
test('a majority may commit before all replicas have the entry',()=>{
  const r=rangeWrite({topology:'global',time:71});
  assert.equal(r.committed,true);
  assert.equal(r.replicas.filter(r=>r.stored).length,2);
  assert.equal(r.acknowledged,false);
  assert.equal(rangeWrite({topology:'global',time:72}).acknowledged,true);
});
test('one unreachable follower permits progress but isolation prevents it',()=>{
  assert.equal(rangeWrite({failure:'one',time:300}).acknowledged,true);
  const r=rangeWrite({failure:'isolate',time:300});
  assert.equal(r.quorumAt,null);
  assert.equal(r.committed,false);
  assert.equal(r.acknowledged,false);
});
test('remote client cost is separate from replication quorum',()=>{
  assert.equal(rangeWrite({client:'far'}).quorumAt,5);
  assert.equal(rangeWrite({client:'far'}).acknowledgedAt,75);
  assert.equal(rangeWrite({client:'far'}).clientElapsed,145);
});
test('atomic visibility conserves the balance before, during and after failure',()=>{
  for(let stage=0;stage<=3;stage++) for(const failed of [false,true]) for(const recovered of [false,true]) {
    const r=transferView({stage,failed,recovered});
    assert.equal(r.total,140);
    assert.equal(r.provisionalDebit,r.pending && stage>=1);
    assert.equal(r.provisionalCredit,r.pending && stage>=2);
  }
  assert.equal(transferView({stage:1,failed:true}).latestWaits,true);
  assert.equal(transferView({stage:2,failed:true,recovered:true}).aborted,true);
  assert.equal(transferView({stage:3,failed:true,recovered:true}).committed,true);
});
test('independent writes expose a partial transfer despite durable replication',()=>{
  const r=transferView({mode:'independent',stage:1,failed:true,recovered:true});
  assert.equal(r.total,130);
  assert.equal(r.pending,false);
  assert.equal(transferView({mode:'independent',stage:2}).total,140);
});

test('leader-clock delivery and full client latency differ by the outbound leg',()=>{
  for(const client of ['near','far']) {
    const leg=client==='near'?1:70;
    const result=rangeWrite({topology:'global',client});
    assert.equal(result.acknowledgedAt,result.quorumAt+leg);
    assert.equal(result.clientElapsed,leg+result.quorumAt+leg);
    assert.equal(rangeWrite({topology:'global',client,time:result.acknowledgedAt-1}).acknowledged,false);
    assert.equal(rangeWrite({topology:'global',client,time:result.acknowledgedAt}).acknowledged,true);
  }
});
