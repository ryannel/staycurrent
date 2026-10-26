import test from 'node:test';import assert from 'node:assert/strict';
import {pipelineSchedule,pipelineState,responseQueue,clientInitial,clientStep} from './clients.mjs';
test('pipelining removes serial waits without removing or overlapping server work',()=>{
 for(let count=1;count<=10;count++)for(let batch=1;batch<=count;batch++)for(const rtt of [0,10,50]){
  const s=pipelineSchedule({count,batch,rtt});assert.equal(s.commands.length,count);assert.equal(s.end,Math.ceil(count/batch)*rtt+count*2);assert.equal(s.serverWork,count*2);
  for(let i=1;i<count;i++)assert.ok(s.commands[i].execute>=s.commands[i-1].done);
  for(const c of s.commands){assert.equal(pipelineState(c,c.reply),'complete');assert.equal(c.done-c.execute,2);}
 }
 assert.equal(pipelineSchedule().end,132);assert.equal(pipelineSchedule({batch:6}).end,32);
});
test('separate response streams remove byte-order waiting but not shared execution delay',()=>{
 const shared=responseQueue(),separate=responseQueue({separate:true});assert.ok(shared.small>separate.small);assert.equal(separate.commands[1].wait,0);
 assert.equal(responseQueue({expensive:true}).small,responseQueue({expensive:true,separate:true}).small);
});
test('queue expiry removes an unsent operation; send removes the queue timer',()=>{
 let s=clientStep(clientInitial(),'queue-timeout');assert.equal(s.stage,'removed');assert.equal(s.server,'unchanged');assert.deepEqual(clientStep(s,'send'),s);
 s=clientStep(clientInitial(),'send');assert.equal(s.timer,false);assert.deepEqual(clientStep(s,'queue-timeout'),s);
});
test('application deadline does not stop underlying SET or turn late success into an on-time reply',()=>{
 let s=clientStep(clientInitial(),'deadline');s=clientStep(s,'send');s=clientStep(s,'execute');s=clientStep(s,'reply');assert.equal(s.server,'value written');assert.equal(s.app,'late success');
});
test('the same connection error is compatible with different server outcomes',()=>{
 let a=clientStep(clientInitial(),'send'),b=clientStep(a,'execute');a=clientStep(a,'disconnect');b=clientStep(b,'disconnect');assert.equal(a.app,b.app);assert.equal(a.stage,b.stage);assert.notEqual(a.server,b.server);
});

test('late failures retain the distinction from an on-time request outcome',()=>{
 let s=clientStep(clientInitial(),'deadline');s=clientStep(s,'queue-timeout');assert.equal(s.app,'late queue timeout');
 s=clientStep(clientInitial(),'send');s=clientStep(s,'deadline');s=clientStep(s,'disconnect');assert.equal(s.app,'late connection error');
});
