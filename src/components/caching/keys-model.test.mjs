import {test} from 'node:test';
import assert from 'node:assert/strict';
import {groupRequests,fieldUpdate,schemaRead,negativeRead,responseKey} from './keys-model.mjs';
test('omitting each relevant input creates a demonstrable wrong hit',()=>{
 const full=['tenant','currency','group'];
 for(const missing of full){
  assert.ok(groupRequests(full.filter(f=>f!==missing)).outcomes.some(r=>!r.correct));
 }
 const separated=groupRequests(full);
 assert.equal(separated.entries.length,4);
 assert.equal(separated.outcomes.filter(r=>r.hit).length,4);
 assert.ok(separated.outcomes.every(r=>r.correct));
 const collapsed=groupRequests([]);
 assert.equal(collapsed.outcomes.filter(r=>r.hit).length,7);
 assert.equal(collapsed.outcomes.filter(r=>!r.correct).length,6);
});
test('a field read between two writes can see a mixed pair',()=>{
 assert.deepEqual([fieldUpdate('separate',1).currency,fieldUpdate('separate',1).amount],['USD',1800]);
 for(const mode of ['hash','json'])for(const step of [0,1,2])assert.equal(fieldUpdate(mode,step).mixed,false);
});
test('versioned keys turn incompatible values into misses',()=>{
 assert.equal(schemaRead(false,1,2).displayed,1800);
 assert.equal(schemaRead(false,2,1).displayed,.18);
 assert.equal(schemaRead(true,1,2).hit,false);
 assert.equal(schemaRead(true,2,2).displayed,18);
});
test('negative caching saves a repeated confirmed absence, not a failed lookup',()=>{
 assert.equal(negativeRead('missing',true).originReads,1);
 assert.equal(negativeRead('missing',false).originReads,2);
 assert.equal(negativeRead('failed',true).entry,'absent');
 assert.equal(negativeRead('failed',true).response,'Unavailable');
});
test('structured key encoding separates delimiter-containing identifiers',()=>{
 const common={tenant:'a:b',product:'c',currency:'EUR',priceGroup:'retail',locale:'en-GB'};
 assert.notEqual(responseKey(common),responseKey({...common,tenant:'a',product:'b:c'}));
 assert.equal(responseKey(common),responseKey({...common}));
 assert.throws(()=>responseKey({...common,tenant:''}),TypeError);
 for(const field of ['tenant','product','currency','priceGroup','locale'])assert.notEqual(responseKey(common),responseKey({...common,[field]:'different'}));
});
