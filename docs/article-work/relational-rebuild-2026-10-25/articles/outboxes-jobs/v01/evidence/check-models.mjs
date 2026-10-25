import {deliverySteps,leaseSteps} from '../src/components/relational-rebuild-outboxes-jobs/models.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
const result={delivery:[],lease:{steps:leaseSteps.length},fence:{}};
for(const stop of ['before','accepted','finished']) for(const dedup of [false,true]){
 const steps=deliverySteps(stop,dedup);const final=steps.at(-1);assert.equal(final.receiver,stop==='accepted'&&!dedup?2:1);
 assert.match(final.db,/done/);result.delivery.push({stop,dedup,steps:steps.length,accepted:final.receiver});
}
assert.match(leaseSteps[0].db,/generation 7/);assert.match(leaseSteps[3].db,/generation 8/);assert.match(leaseSteps[4].a,/rejected/);assert.match(leaseSteps[5].db,/done/);
let highest=0,operations=0;const fenced=gen=>{if(gen<highest)return false;highest=gen;operations++;return true;};
assert.equal(fenced(8),true);assert.equal(fenced(7),false);assert.equal(fenced(8),true);assert.equal(operations,2);
result.fence={eightAccepted:true,sevenRejected:true,equalEightAcceptedAgain:true,withoutFenceOldSevenCouldExecute:true};
const source=await readFile(new URL('../src/components/relational-rebuild-outboxes-jobs/models.mjs',import.meta.url));result.sourceSHA256=createHash('sha256').update(source).digest('hex');result.limits='Deterministic model checks, not external service execution or a native concurrency observation.';
await writeFile(new URL('model-results.json',import.meta.url),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
