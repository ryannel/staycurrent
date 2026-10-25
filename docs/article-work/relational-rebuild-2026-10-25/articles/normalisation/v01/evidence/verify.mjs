import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { closure, lineRules, lineAttributes, adviceRules, adviceAttributes, offers, advice, memberships, pairwiseJoin } from '../src/components/relational-rebuild-normalisation/model.mjs';
import { figures } from '../src/components/relational-rebuild-normalisation/scenes.mjs';
const subsets = attrs => Array.from({length:2 ** attrs.length},(_,n)=>attrs.filter((_,i)=>(n>>i)&1));
const equal = (a,b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
const isKey = (x,attrs,rules) => attrs.every(a=>closure(x,rules).includes(a));
function candidateKeys(attrs,rules) {
  return subsets(attrs).filter(x=>isKey(x,attrs,rules)&&x.every(a=>!isKey(x.filter(b=>b!==a),attrs,rules)));
}
function projected(attrs,rules) {
  return subsets(attrs).flatMap(x=>closure(x,rules).filter(a=>attrs.includes(a)&&!x.includes(a)).map(a=>[x,[a]]));
}
const preserved = (parts,rules) => {
  const local = parts.flatMap(part=>projected(part,rules));
  return rules.map(([x,y])=>y.every(a=>closure(x,local).includes(a)));
};
const isBCNF = (attrs,rules) => projected(attrs,rules).every(([x])=>isKey(x,attrs,rules));
assert.deepEqual(candidateKeys(lineAttributes,lineRules),[['order_id','line_no']]);
assert.deepEqual(candidateKeys(adviceAttributes,adviceRules),[['customer_id','tea_style'],['customer_id','advisor_id']]);
const lineParts = [['order_id','line_no','product_id','quantity','unit_price'],['order_id','customer_id'],['customer_id','customer_name']];
assert.deepEqual(preserved(lineParts,lineRules),[true,true,true]);
assert(lineParts.every(p=>isBCNF(p,lineRules)));
const adviceParts=[['advisor_id','tea_style'],['customer_id','advisor_id']];
assert.deepEqual(preserved(adviceParts,adviceRules),[true,false]);
assert(adviceParts.every(p=>isBCNF(p,adviceRules)));
assert(!isBCNF(adviceAttributes,adviceRules));
const prime = new Set(candidateKeys(adviceAttributes,adviceRules).flat());
assert(projected(adviceAttributes,adviceRules).every(([x,[a]])=>isKey(x,adviceAttributes,adviceRules)||prime.has(a)));
// Independently compare every starting-set closure before and after cover reduction.
const minimal = lineRules.flatMap(([x,ys])=>ys.map(y=>[x,[y]]));
const original=[...minimal,[['order_id','line_no'],['customer_id']],[['order_id'],['customer_name']]];
for(const x of subsets(lineAttributes)) assert(equal(closure(x,original),closure(x,minimal)));
for(let i=0;i<minimal.length;i++) {
  const [x,[a]]=minimal[i];
  assert(!closure(x,minimal.filter((_,j)=>i!==j)).includes(a));
  for(const b of x) assert(!closure(x.filter(c=>c!==b),minimal).includes(a));
}
// A generic FD chase: symbol substitutions apply to the entire tableau.
function chase(attrs,parts,rules) {
  let rows=parts.map((p,i)=>attrs.map((a,j)=>p.includes(a)?`a${j}`:`b${i}_${j}`));
  const snapshots=[structuredClone(rows)];
  let changed=true;
  while(changed) {
    changed=false;
    for(const [x,y] of rules) for(let i=0;i<rows.length;i++) for(let j=i+1;j<rows.length;j++) {
      if(!x.every(a=>rows[i][attrs.indexOf(a)]===rows[j][attrs.indexOf(a)])) continue;
      for(const a of y) {
        const col=attrs.indexOf(a), v=rows[i][col], w=rows[j][col];
        if(v===w) continue;
        const keep=v.startsWith('a')?v:w.startsWith('a')?w:v;
        const discard=keep===v?w:v;
        rows=rows.map(r=>r.map(s=>s===discard?keep:s)); changed=true;
      }
    }
    if(changed) snapshots.push(structuredClone(rows));
  }
  return {rows,snapshots,lossless:rows.some(row=>row.every((s,j)=>s===`a${j}`))};
}
const chaseResult=chase(['O','L','C','N'],[['O','L'],['O','C'],['C','N']],[[['O'],['C']],[['C'],['N']]]);
assert(chaseResult.lossless);
assert.deepEqual(chaseResult.rows[0],['a0','a1','a2','a3']);
const badChase=chase(['O','C','T'],[['O','C'],['C','T']],[[['O'],['C','T']]]);
assert(!badChase.lossless);
// Check every 2-value ternary relation, retaining precisely those that obey the pairwise JD.
const universe=Array.from({length:8},(_,n)=>[n>>2,(n>>1)&1,n&1]);
const tripleSet=rows=>rows.map(r=>JSON.stringify(r)).sort().join('|');
const fd=(rows,x,y)=>rows.every(a=>rows.every(b=>!x.every(i=>a[i]===b[i])||y.every(i=>a[i]===b[i])));
const mvd=(rows,x,y)=>{
  const z=[0,1,2].filter(i=>!x.includes(i)&&!y.includes(i));
  return rows.every(a=>rows.every(b=>!x.every(i=>a[i]===b[i])||rows.some(c=>x.every(i=>c[i]===a[i])&&y.every(i=>c[i]===a[i])&&z.every(i=>c[i]===b[i]))));
};
const legal=[];
for(let mask=0;mask<256;mask++) {
  const rows=universe.filter((_,i)=>(mask>>i)&1);
  if(tripleSet(pairwiseJoin(rows))===tripleSet(rows)) legal.push(rows);
}
const fdCounterexamples=[],mvdCounterexamples=[];
for(const x of subsets([0,1,2])) for(const a of [0,1,2].filter(i=>!x.includes(i))) {
  assert(legal.some(rows=>!fd(rows,x,[a])));
  fdCounterexamples.push({x,y:[a],rows:legal.find(rows=>!fd(rows,x,[a]))});
}
for(const x of subsets([0,1,2])) for(const y of subsets([0,1,2].filter(i=>!x.includes(i)))) {
  if(!y.length||x.length+y.length===3) continue;
  assert(legal.some(rows=>!mvd(rows,x,y)));
  mvdCounterexamples.push({x,y,rows:legal.find(rows=>!mvd(rows,x,y))});
}
assert.equal(pairwiseJoin(offers).length,4);
assert(!offers.some(r=>equal(r,['S1','P7','South'])));
// Check rendered scene series agree with the expected model outcomes and option count.
assert.equal(Object.keys(figures).length,7);
assert.deepEqual(figures.closure.cases.map(c=>c.stages.length),[5,4,3]);
assert.equal(figures.jd.cases.length,2);

const db=new PGlite();
let sql;
try {
  const version=(await db.query('SELECT version()')).rows[0].version;
  await db.exec(`CREATE TABLE offers(s text NOT NULL,p text NOT NULL,r text NOT NULL,PRIMARY KEY(s,p,r));
    INSERT INTO offers VALUES ('S1','P7','North'),('S1','P3','South'),('S2','P7','South');
    CREATE TABLE advice(c integer NOT NULL,t text NOT NULL,a text NOT NULL);
    INSERT INTO advice VALUES (1,'green','A1'),(2,'green','A2');
    CREATE TABLE memberships(p text NOT NULL,t text NOT NULL,s text NOT NULL);
    INSERT INTO memberships VALUES ('P7','gift','S1'),('P7','gift','S2'),('P7','ceramic','S1'),('P7','ceramic','S2');`);
  const joinSQL=`WITH sp AS (SELECT DISTINCT s,p FROM offers),sr AS (SELECT DISTINCT s,r FROM offers),pr AS (SELECT DISTINCT p,r FROM offers) SELECT sp.s,sp.p,sr.r FROM sp JOIN sr USING(s) JOIN pr ON pr.p=sp.p AND pr.r=sr.r ORDER BY 1,2,3`;
  const joinedOffers=(await db.query(joinSQL)).rows;
  assert.equal(joinedOffers.length,4);
  assert(joinedOffers.some(r=>r.s==='S1'&&r.p==='P7'&&r.r==='South'));
  await db.exec(`CREATE TABLE advisor_styles(a text PRIMARY KEY,t text NOT NULL);
    INSERT INTO advisor_styles SELECT DISTINCT a,t FROM advice;
    CREATE TABLE assignments(c integer NOT NULL,a text NOT NULL REFERENCES advisor_styles,PRIMARY KEY(c,a));
    INSERT INTO assignments SELECT c,a FROM advice;
    INSERT INTO assignments VALUES (1,'A2');`);
  const violatedAdvice=(await db.query(`SELECT c,t,count(*) AS advisers FROM assignments JOIN advisor_styles USING(a) GROUP BY c,t HAVING count(*)>1`)).rows;
  assert.deepEqual(violatedAdvice,[{c:1,t:'green',advisers:2}]);
  const membershipJoin=(await db.query(`WITH pt AS(SELECT DISTINCT p,t FROM memberships), ps AS(SELECT DISTINCT p,s FROM memberships) SELECT p,t,s FROM pt JOIN ps USING(p) ORDER BY 1,2,3`)).rows;
  assert.equal(membershipJoin.length,4);
  const lossy=(await db.query(`WITH original(o,c,t) AS (VALUES(101,1,'12 Oct 09:30'),(103,1,'20 Oct 10:15')),oc AS(SELECT DISTINCT o,c FROM original), ct AS(SELECT DISTINCT c,t FROM original) SELECT o,c,t FROM oc JOIN ct USING(c) ORDER BY o,t`)).rows;
  assert.equal(lossy.length,4);
  sql={runtime:'@electric-sql/pglite 0.5.8, owned in-memory instance',version,joinSQL,joinedOffers,violatedAdvice,membershipJoin,lossy};
} finally {await db.close();}
const result={status:'passed',candidateKeys:{line:candidateKeys(lineAttributes,lineRules),advice:candidateKeys(adviceAttributes,adviceRules)},preservation:{line:preserved(lineParts,lineRules),advice:preserved(adviceParts,adviceRules)},minimalCoverClosuresCompared:128,chase:chaseResult,lossyChase:badChase,ternaryJD:{relationsExamined:256,legalCount:legal.length,fdCounterexamples,mvdCounterexamples},sql};
await writeFile(new URL('./verification-results.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,keys:result.candidateKeys,chaseLossless:result.chase.lossless,jdLegalStates:legal.length,version:sql.version}));
