import { seededRandom } from '/Users/ryannel/Workspace/staycurrent/src/components/caching/shared/sim.mjs';
import { summarise, expectedSize, paperBound, expectedLead } from '/Users/ryannel/Workspace/staycurrent/src/components/caching/stampedes/xfetch-model.mjs';
console.log('rate(per rebuild) beta arrivals method | mean size | e^(1/b) | paper bound | mean lead | derived lead | P(first starts <1 rebuild before expiry)');
for (const beta of [0.5, 0.75, 1, 1.5, 2]) for (const rate of [10, 100, 1000, 10000]) for (const [method, arrivals, cycles] of [['brute','poisson',2000],['brute','even',2000],['fast','poisson',100000]]) {
  if (method === 'brute' && rate === 10000 && beta < 1) continue;
  const r = summarise(seededRandom(11), { rate, beta, cycles: rate >= 1000 && method==='brute' ? 400 : cycles, method, arrivals });
  console.log(`${rate}\t${beta}\t${arrivals}\t${method}\t| ${r.size.toFixed(3)} | ${expectedSize(beta).toFixed(3)} | ${paperBound(beta).toFixed(3)} | ${r.lead.toFixed(3)} | ${expectedLead(rate,beta).toFixed(3)} | ${(r.lateShare*100).toFixed(2)}%`);
}
