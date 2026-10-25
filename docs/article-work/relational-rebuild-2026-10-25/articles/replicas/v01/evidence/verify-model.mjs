import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { models } from '../src/components/relational-rebuild-replicas/model.mjs';

const checks = [];
const progress = models.progress.states.default;
for (const [i,state] of progress.entries()) {
  assert(state.replayed <= state.durable && state.durable <= state.received);
  assert.equal(state.price, state.replayed === 2 ? '22.00' : '20.00');
  if(i) for(const field of ['received','durable','replayed']) assert(state[field] >= progress[i-1][field]);
}
checks.push('All six progress states preserve ordered prefixes; a new snapshot exposes 22.00 only after replay of C.');
const durable = progress.find(state=>state.durable === 2 && state.replayed === 0);
assert(durable && durable.price === '20.00');
checks.push('Counterexample retained: C is durable while a new read still returns20.00.');
const {catchup,fallback,unavailable} = models.routing.states;
assert.equal(catchup.at(-1).target,'Replica A');
assert.equal(catchup.at(-1).a,'Replayed C · qualified');
assert.equal(catchup.at(-1).result,'P7 → 22.00');
assert.equal(fallback.at(-1).target,'Primary');
assert.equal(fallback.at(-1).primary,'Available · includes C');
assert.equal(fallback.at(-1).result,'P7 → 22.00');
assert.equal(unavailable.at(-1).primary,'Unavailable');
assert.equal(unavailable.at(-1).target,'No eligible target');
assert.equal(unavailable.at(-1).result,'Unavailable · no price returned');
checks.push('Both successful routes use a qualified target; the no-target path returns no stale price.');
assert.equal(models.switching.states.forget.at(-1).second,'Read 2 on B → 20.00');
assert.equal(models.switching.states.retain.at(-1).second,'Read 2 cannot use B yet');
checks.push('Counterexample retained: dropping observed history permits22.00→20.00; retaining C excludes B.');
assert.equal(600/(20-10),60);
assert.equal(600/(20-0),30);
assert.equal(20-20,0);
checks.push('Same-unit rate arithmetic:60s with10MiB/s net drain,30s with20MiB/s net drain; zero spare rate cannot drain backlog.');
writeFileSync(new URL('./model-result.json',import.meta.url),JSON.stringify({checks,limits:'Assertions check the authored illustrative model, not an observed replication execution or native API.'},null,2)+'\n');
console.log(checks.join('\n'));
