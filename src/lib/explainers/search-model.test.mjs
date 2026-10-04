import test from 'node:test';import assert from 'node:assert/strict';
import {createSearchState,searchStep,searchLexical,searchVectors,searchTokens} from './search-model.mjs';
test('analysis normalises punctuation and case, not synonyms; AND intersects and OR unions',()=>{
 assert.deepEqual(searchTokens('BLUE, blue mugs!'),['blue','mugs']);
 assert.deepEqual(searchTokens('BLÅ, blå ΜΠΛΕ 42!'),['blå','μπλε','42']);
 assert.deepEqual(searchTokens('café cafe\u0301'),['café']);
 assert.deepEqual(searchTokens('cafe café'),['cafe','café']);
 const s=createSearchState(); assert.deepEqual(searchLexical(s,'BLUE mug').results.map(d=>d.id),[1]);
 assert.deepEqual(searchLexical(s,'blue mug','any').results.map(d=>d.id),[1,3,4]);
 assert.equal(searchLexical(s,'blue mugs').results.length,0);
 assert.equal(searchLexical(s,'blue mug','all',true).results.length,0);
 assert.equal(searchLexical(s,'').results.length,0);
});
test('update is absent before refresh, old terms disappear after refresh, merge preserves results',()=>{
 let s=searchStep(createSearchState(),'update');assert.equal(s.source[0].stock,4);assert.deepEqual(s.pending,[s.source[0]]);
 assert.deepEqual(searchLexical(s,'blue mug').results.map(d=>d.id),[1]);
 s=searchStep(s,'refresh');assert.equal(searchLexical(s,'blue mug').results.length,0);
 assert.deepEqual(searchLexical(s,'indigo cup').results.map(d=>d.id),[1,2]);
 const answer=searchLexical(s,'ceramic','any');assert.equal(s.segments.length,2);
 s=searchStep(s,'merge');assert.equal(s.segments.length,1);assert.deepEqual(searchLexical(s,'ceramic','any').results,answer.results);assert.equal(s.segments[0].docs.length,5);
});
test('exact vector ordering and late filtering expose candidate truncation without ANN',()=>{
 const late=searchVectors('Blue mug',false);assert.deepEqual(late.candidates.map(d=>d.id),[2,1]);assert.equal(late.results.length,0);
 const early=searchVectors('Blue mug',true);assert.deepEqual(early.results.map(d=>d.id),[3,4]);assert.equal(early.distances,5);
 assert.equal(searchVectors('White mug',true).results[0].id,4);
});
