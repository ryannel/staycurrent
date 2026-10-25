import assert from 'node:assert/strict';
import {figures} from '../src/components/relational-rebuild-constraints/model.mjs';
let states=0;
for(let q=0;q<3;q++)for(let rule=0;rule<2;rule++){
 const final=figures.quantity.draw(2,[q,rule]);
 const expected=q===1||(q===2&&rule===1);
 assert.equal(final.explanation.includes('fails'),expected);
 assert.equal(final.html.includes('<td>3</td>'),!expected);
 for(let step=0;step<3;step++){assert.ok(figures.quantity.draw(step,[q,rule]).explanation);states++;}
}
for(let mode=0;mode<2;mode++){
 assert.equal(figures.tenant.draw(2,[mode]).explanation.includes('rejects'),mode===1);
 assert.equal(figures.timing.draw(3,[mode]).html.includes('both rows commit'),mode===1);
 for(let s=0;s<3;s++){assert.ok(figures.tenant.draw(s,[mode]).html);states++;}
 for(let s=0;s<4;s++){assert.ok(figures.timing.draw(s,[mode]).html);states++;}
}
for(let s=0;s<5;s++){assert.ok(figures.payments.draw(s).html);states++;}
assert.match(figures.payments.draw(4).html,/40.00 > 29.00/);
assert.match(figures.payments.draw(3).html,/Committed payments: 0.00/);
console.log(`${states} model states verified; payment concurrency remains conceptual.`);
