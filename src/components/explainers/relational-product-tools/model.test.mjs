import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tools, run } from './model.mjs';
import { renderResult } from './view.mjs';

test('every permitted input combination produces inspectable finite state', () => {
 for (const [name,tool] of Object.entries(tools)) {
  const combinations=tool.controls.reduce((states,c)=>states.flatMap(s=>c.choices.map(([value])=>({...s,[c.id]:value}))),[{}]);
  for(const p of combinations) {
   const r=run(name,p);assert.ok(r.summary.length>20,name);
   assert.ok(r.panels.length,name);
   for(const panel of r.panels) for(const row of panel.rows) assert.equal(row.length,panel.headers.length,`${name}: ${panel.title}`);
   const html=renderResult(r);assert.ok(!html.includes('undefined'),name);assert.ok(!html.includes('NaN'),name);
  }
 }
});
test('HOT requires both same-page room and unchanged ordinary indexed fields',()=>{
 assert.equal(run('Versions').values.hot,true);
 assert.equal(run('Versions',{indexed:'yes'}).values.hot,false);
 assert.equal(run('Versions',{room:'no'}).values.hot,false);
 assert.equal(run('Versions',{snapshot:'fresh'}).panels[0].rows[1][1],'yes');
});
test('retained history blocks cleanup and forces refill growth',()=>{
 assert.equal(run('Vacuum',{holder:'reader',refill:'yes'}).values.fileSlots,12);
 assert.equal(run('Vacuum',{holder:'feedback',refill:'yes'}).values.fileSlots,12);
 const clean=run('Vacuum',{holder:'none',refill:'yes'});assert.equal(clean.values.fileSlots,8);assert.equal(clean.values.slots.filter(x=>x==='replacement').length,4);
});
test('GIN changes intersection to a distinct union, including shared postings once',()=>{
 assert.deepEqual(run('Gin').values.matches,[500,1000]);
 const either=run('Gin',{op:'either'}).values.matches;assert.equal(either.length,12);assert.equal(either.filter(x=>x===500).length,1);
});
test('BRIN keeps the result while placement changes candidate work',()=>{
 const ordered=run('Brin'),mixed=run('Brin',{layout:'mixed'});assert.deepEqual(ordered.values.matches,mixed.values.matches);assert.ok(mixed.values.examined>ordered.values.examined);
 assert.ok(run('Brin',{layout:'mixed',group:'2'}).values.examined<=mixed.values.examined);
});
test('better information changes estimates, while correlated scan remains',()=>{
 assert.equal(run('PlanEstimates',{case:'large'}).values.estimate,495);
 assert.equal(run('PlanEstimates',{case:'large',knowledge:'specific'}).values.route,'sequential scan');
 assert.equal(run('PlanEstimates',{case:'correlated',knowledge:'specific'}).values.actual,1000);
 assert.equal(run('Memory',{allowance:'64',sessions:'10'}).values.total,1280);
});
test('strict JSON shape rejects unknown roots while preserving explicit SQL NULL policy',()=>{
 const weak=run('JsonShape').values.accepted,strict=run('JsonShape',{rule:'strict'}).values.accepted;
 assert.ok(weak.includes('["level"]'));assert.ok(!strict.includes('["level"]'));
 assert.deepEqual(strict,['SQL NULL','{"level":"intro"}']);
 assert.equal(run('JsonUpdate').values.tool,'drill');assert.equal(run('JsonUpdate',{write:'path'}).values.tool,'saw');
});
test('PITR is a prefix and later reconciliation does not erase the deletion from a later target',()=>{
 assert.deepEqual(run('PgRecovery',{target:'before',reconcile:'yes'}).values.records.map(r=>r[1]),['r81','r82']);
 assert.deepEqual(run('PgRecovery',{target:'later',reconcile:'yes'}).values.records.map(r=>r[1]),['r82']);
});
test('remote flush can acknowledge while fresh standby queries are still stale',()=>{
 const flushed=run('Replication',{progress:'flush',policy:'flush'}).values;assert.equal(flushed.ack,true);assert.equal(flushed.visible,false);assert.equal(flushed.durable,true);
 assert.equal(run('Replication',{progress:'write',policy:'flush'}).values.ack,false);
 assert.equal(run('Replication',{progress:'apply',policy:'apply'}).values.visible,true);
 assert.equal(run('Replication',{progress:'none',policy:'local'}).values.ack,true);
});
test('schema repair does not advance a subscriber generator',()=>{
 const r=run('LogicalFeed',{schema:'ready'}).values;assert.equal(r.apply,true);assert.equal(r.next,1);
 assert.equal(run('LogicalFeed',{sequence:'fixed'}).values.apply,false);
});
test('late invalid reindex copy still incurs maintenance while original stays usable',()=>{
 const rows=run('IndexBuild',{phase:'timeout'}).values.rows;assert.deepEqual(rows.map(r=>r.slice(1,4)),[['true','true','yes'],['false','true','no']]);
});
test('a completed backfill needs a maintained bridge and a surviving caller contract',()=>{
 assert.equal(run('Backfill').values.mismatch,false);
 assert.equal(run('Backfill',{bridge:'off'}).values.mismatch,true);
 const dropped=run('Backfill',{contract:'drop'}).values;assert.equal(dropped.broken,true);assert.equal(dropped.code,null);assert.equal(dropped.text,'8');assert.equal(dropped.mismatch,null);
 assert.equal(run('Blocker',{action:'cancelB'}).values.stored,'paid');
 assert.equal(run('Blocker',{action:'rollbackA'}).values.stored,'refunded');
});
test('policy follows effective authority and definer resolves first matching relation',()=>{
 assert.deepEqual(run('Policies',{tenant:'t5'}).values.visible,['t5']);
 assert.deepEqual(run('Policies',{role:'tenant4',tenant:'t5'}).values.visible,['t4']);
 assert.deepEqual(run('Policies',{role:'forced'}).values.visible,[]);
 assert.deepEqual(run('Policies',{role:'bypass'}).values.visible,['t4','t5']);
 assert.equal(run('Definer',{path:'safe'}).values.resolved,'trusted');
});
test('target-only acceptance makes both PG and cross-engine source stale',()=>{
 for(const name of ['PgMigration','Cutover']) {assert.equal(run(name,{write:'yes'}).values.missing,true);const r=run(name,{write:'yes',reconcile:'yes'}).values;assert.equal(r.missing,false);assert.deepEqual(r.source,r.target);}
});
test('range boundaries include the start and exclude the end, independent of gateway',()=>{
 assert.equal(run('Ranges',{key:'2499'}).values.idx,0);
 assert.equal(run('Ranges',{key:'2500'}).values.idx,1);
 assert.equal(run('Ranges',{key:'5000'}).values.idx,2);
 assert.equal(run('Ranges',{key:'2500',gateway:'C'}).values.lease,'B');
});
test('retry recomputes admission and cannot roll back external calls',()=>{
 assert.equal(run('Retries').values.orders,1);assert.equal(run('Retries',{retry:'stale'}).values.orders,2);
 assert.equal(run('Retries',{effect:'inline'}).values.attemptCalls,1);
 assert.equal(run('Historical',{time:'0',gc:'1'}).values.valid,false);
 assert.equal(run('Historical',{time:'1',gc:'1'}).values.answer,1);
});
test('covering removes a dependent stage; scattering increases candidates without changing newest result',()=>{
 assert.equal(run('Covering').values.decoded,20);assert.equal(run('Covering',{store:'yes'}).values.decoded,10);
 const one=run('Scatter'),four=run('Scatter',{buckets:'4'});assert.equal(four.values.candidates,12);assert.deepEqual(one.values.answer,four.values.answer);assert.deepEqual(four.values.loads,[3,3,3,3]);
});
test('region placement leaves majority after any one illustrated region loss, not two',()=>{
 for(const loss of ['eu','us','ap'])assert.equal(run('Quorum',{loss}).values.available,true);
 assert.equal(run('Quorum',{loss:'eu-us'}).values.available,false);
 assert.equal(run('Quorum',{goal:'local',loss:'eu'}).values.available,false);
 assert.equal(run('Quorum',{goal:'local',home:'us',loss:'eu'}).values.available,true);
});
test('certificate replacement does not retire the original identity',()=>{
 assert.equal(run('Identity').values.retired,false);assert.equal(run('Identity',{action:'nologin'}).values.retired,true);
});
test('restore couples request identity with capacity and refuses an incomplete chain',()=>{
 assert.equal(run('Restore').values.remaining,2);
 for(const target of ['early','latest'])for(const replays of ['1','2']){const r=run('Restore',{target,replays}).values;assert.equal(r.remaining,1);assert.equal(r.has,true);}
 assert.equal(run('Restore',{chain:'missing',replays:'2'}).values.remaining,null);
});
test('backfill completion, publication and cleanup remain distinct gates',()=>{
 assert.equal(run('SchemaJob',{phase:'running',reader:'new'}).values.compatible,false);
 assert.equal(run('SchemaJob',{phase:'published',reader:'new'}).values.compatible,true);
 assert.equal(run('SchemaJob',{phase:'paused',reader:'old'}).values.compatible,true);
});
test('finalisation cannot begin before all binaries arrive; start already closes return gate',()=>{
 assert.equal(run('Upgrade',{nodes:'1',gate:'done'}).values.started,false);
 assert.equal(run('Upgrade',{nodes:'3',gate:'held'}).values.safe,true);
 assert.equal(run('Upgrade',{nodes:'3',gate:'running'}).values.safe,false);
 assert.equal(run('Upgrade',{nodes:'3',gate:'done'}).values.safe,false);
});
test('a stream position cannot substitute for the initial copy; apply keeps one stable identity',()=>{
 assert.equal(run('FeedBoundary',{copy:'waiting',stream:'2'}).values.ready,false);
 const r=run('FeedBoundary',{copy:'done',stream:'2'}).values;assert.equal(r.ready,true);assert.deepEqual(r.destination,[['t4/o81','confirmed'],['t4/o82','pending']]);
 assert.equal(run('FeedBoundary',{copy:'done',stream:'0'}).values.destination[0][1],'pending');
});

test('information changes preserve the selected fixture; query switch names the different fixture',()=>{
 for(const selected of ['small','large','correlated']) {
  assert.deepEqual(run('PlanEstimates',{case:selected}).panels[0],run('PlanEstimates',{case:selected,knowledge:'specific'}).panels[0]);
 }
 assert.match(run('PlanEstimates',{case:'correlated'}).panels[0].title,/10,000/);
 assert.match(run('PlanEstimates').panels[0].title,/50,000/);
});
test('column removal eliminates the comparison even when no legacy write is sent',()=>{
 for(const old of ['write','none']) {
  const r=run('Backfill',{contract:'drop',old});
  assert.equal(r.values.code,null);assert.equal(r.values.mismatch,null);
  assert.equal(r.panels[0].rows[0][2],'removed / 7');
  assert.match(r.panels[1].rows[1][1],/unavailable/);
  assert.equal(r.panels[1].rows[3][1],'must run before column removal');
 }
});
