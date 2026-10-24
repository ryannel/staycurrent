import assert from 'node:assert/strict';
import fs from 'node:fs';
import { referenceStep } from './tenant-model.mjs';
const core = JSON.parse(fs.readFileSync(new URL('../../../lib/relational-collection/core.json',import.meta.url)));
const source = core.products.find(p => p.product_id === 'P7');
const facts = { order: { shop_id:10,order_id:103 }, products:[{shop_id:10,...source},{shop_id:20,product_id:'P7',name:'Copper mug',price:'18.00'}] };
for (const shop of [10,20]) {
  for (let step=0;step<4;step++) {
    const state=referenceStep(facts,shop,step);
    assert.ok(state.explanation.length>30);
    assert.ok(!Object.values(state).some(value=>typeof value==='string'&&value.includes('undefined')));
    assert.equal(state.orderMatch,shop===10);
    if (step<1) assert.match(state.orderText,/not yet/);
    if (step<2) assert.match(state.productText,/not yet/);
    if (step>=2) assert.match(state.productText,shop===10?/Blue mug/:/Copper mug/);
    if (step===3) assert.match(state.outcome,shop===10?/satisfied/:/refuses/);
  }
}
console.log('Eight illustrative states checked against the core P7 and declared tenant variant.');
