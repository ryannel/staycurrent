import assert from 'node:assert/strict';
import {customers,products,orders,lines,payments,offers,pairEvidence,isOffer,inventedOffer,normalisationStages} from './model.mjs';
const cents = s => Math.round(Number(s) * 100);
const total = order => lines.filter(r => r[0] === order).reduce((a,r) => a + r[3] * cents(r[4]), 0);
assert.deepEqual(orders.map(r => total(r[0])), [3950,4000,2900]);
assert.equal(lines.filter(r => orders.find(o => o[0] === r[0])[1] === 1).length,4);
const ls = lines.filter(r => r[0] === 101), ps = payments.filter(r => r[1] === 101);
const combined = ls.flatMap(l => ps.map(p => [l[3] * cents(l[4]),cents(p[2])]));
assert.equal(combined.length,4);
assert.equal(combined.reduce((a,r) => a+r[0],0),7900);
assert.equal(combined.reduce((a,r) => a+r[1],0),7900);
const reconstructed = lines.map(([order,line,product,quantity,price]) => {
  const [,customer,date] = orders.find(r => r[0] === order);
  return [order,line,date,customer,customers.find(r => r[0] === customer)[1],product,products.find(r => r[0] === product)[1],quantity,price];
});
assert.deepEqual(reconstructed,normalisationStages[0].tables[0].rows);
const rejoined = [];
for (const s of ['S1','S2']) for (const p of ['P3','P7']) for (const l of ['L1','L2']) if (pairEvidence([s,p,l]).every(Boolean)) rejoined.push([s,p,l]);
assert.equal(rejoined.length,4);
assert.deepEqual(rejoined.filter(r => !isOffer(r)),[inventedOffer]);
assert.equal(offers.length,3);
assert.equal(total(103)+200,3100);
console.log(JSON.stringify({
  checkedAt: new Date().toISOString(), verifier:'node:assert/strict', node:process.version,
  kind:'Conceptual model arithmetic and finite set reconstruction; no database execution',
  totals:{101:total(101)/100,102:total(102)/100,103:total(103)/100},
  grain:{rows:4,lineSum:79,paymentSum:79},
  reconstructedLines:reconstructed.length,normalisationStages:normalisationStages.length,
  actualOffers:offers,rejoinedOffers:rejoined,inventedOffers:rejoined.filter(r => !isOffer(r))
},null,2));
