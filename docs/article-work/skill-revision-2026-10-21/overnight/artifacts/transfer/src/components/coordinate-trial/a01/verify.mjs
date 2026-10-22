import assert from 'node:assert/strict';
import { example } from '../example.mjs';
import { point, inverse, compose, viewMatrix, finitePoint } from '../geometry.mjs';
import { initialState, matrices, comparison, anchoredView, cardFor, validState } from './model.mjs';
import { installGestures } from './handlers.mjs';
let checks = 0;
function near(actual, expected, label) {
  assert.ok(finitePoint(actual), label);
  assert.ok(Math.abs(actual.x-expected.x)<1e-8 && Math.abs(actual.y-expected.y)<1e-8, `${label}: ${JSON.stringify(actual)}`); checks++;
}
for (const [preset, expected] of [['baseline',{x:40,y:0}],['resized',{x:50,y:-20}],['turned',{x:-10,y:0}],['resize-between',{x:50,y:-20}]]) {
  const trace = comparison(preset); near(trace.after.card,expected,`${preset} translation`); near(trace.actualC,trace.targetC,`${preset} anchor`);
}
near(comparison('turned','divide').after.card,{x:50,y:30},'wrong turned placement');
near(comparison('turned','divide').actualC,{x:290,y:180},'wrong turned endpoint');
near(comparison('baseline','divide').actualC,{x:420,y:440},'wrong baseline endpoint');
near(comparison('resize-between','stale').after.card,{x:-40,y:80},'stale resize placement');
near(comparison('resize-between','stale').actualC,{x:220,y:170},'stale resize endpoint');
near(comparison('turned','derived','Pan').after.view.pan,{x:740,y:0},'turned pan');
const baseline = initialState(), m = matrices(baseline), anchorW = point(m.W_from_G,point(m.G_from_O,example.p));
const targetV = point(m.V_from_W,anchorW);
near(anchoredView(baseline,targetV,example.gesture.anchorZoom,0).view.pan,{x:-70,y:-100},'baseline zoom pan');
near(anchoredView(baseline,targetV,2,90).view.pan,{x:600,y:60},'chosen pivot turn');
const turned = initialState('turned'), turnedTarget = point(viewMatrix(turned.view),anchorW);
near(anchoredView(turned,turnedTarget,3,90).view.pan,{x:800,y:-170},'turned zoom pan');
let bounded = anchoredView(baseline,targetV,1e3,31);
assert.equal(bounded.view.zoom,4); checks++;
near(point(viewMatrix(bounded.view),anchorW),targetV,'clamped zoom preserves anchor');
const again = anchoredView(bounded,targetV,6,31); near(again.view.pan,bounded.view.pan,'bound has no drift');
assert.equal(anchoredView(baseline,targetV,NaN,0),null); assert.equal(anchoredView(baseline,targetV,2,Infinity),null); checks+=2;
assert.equal(validState({...baseline,card:{x:Infinity,y:0}}),false); checks++;
near(cardFor({x:37,y:23},{x:61,y:45}),{x:24,y:22},'arbitrary grab');

// Deterministic handler checks with a DOM-shaped mapping/capture adapter.
// These are simulated inputs, not browser event-delivery observations.
globalThis.DOMPoint = class { constructor(x,y){this.x=x;this.y=y;} matrixTransform(m){return point([m.a,m.b,m.c,m.d,m.e,m.f],this);} };
function harness(mode='Card') {
  let state=initialState(), commits=0, failed=false, missing=false, singular=false, throwing=false, thrownInverses=0;
  const listeners=new Map(), captures=new Set(), reports=[];
  const domMatrix = values => { const [a,b,c,d,e,f]=values; return {a,b,c,d,e,f,inverse(){if(throwing){thrownInverses++;const error=Error('Matrix is not invertible');error.name='SVGException';throw error;}return domMatrix(inverse(values) ?? Array(6).fill(NaN));}}; };
  const element = key => ({ getScreenCTM(){return missing?null:singular?domMatrix([0,0,0,1,0,0]):domMatrix(matrices(state)[key]);} });
  const surface = Object.assign(element('C_from_V'),{addEventListener(type,fn){listeners.set(type,fn);},removeEventListener(type){listeners.delete(type);},
    setPointerCapture(id){if(failed)throw Error('capture');captures.add(id);},hasPointerCapture(id){return captures.has(id);},releasePointerCapture(id){captures.delete(id);listeners.get('lostpointercapture')?.({pointerId:id});}});
  const api=installGestures({surface,card:element('C_from_O'),parent:element('C_from_G'),world:{getScreenCTM(){ const v=matrices(state); return domMatrix(compose(v.C_from_V,v.V_from_W));}},getState:()=>state,commit(next){state=next;commits++;},getMode:()=>mode,report:message=>reports.push(message)});
  function fire(type,props={}) {listeners.get(type)?.({pointerId:7,button:0,buttons:1,clientX:440,clientY:400,...props});}
  return {api,fire,get state(){return state;},get commits(){return commits;},captures,reports,set failed(v){failed=v;},set missing(v){missing=v;},set singular(v){singular=v;},set throwing(v){throwing=v;},get thrownInverses(){return thrownInverses;},resize(){state={...state,bridge:{...state.bridge,scale:.5}};}};
}
for(const mode of ['Card','Pan']) {
  const h=harness(mode); h.fire('pointermove',{clientX:480}); assert.equal(h.commits,0);
  h.fire('pointerdown'); assert.ok(h.api.active); h.fire('pointermove',{button:2,buttons:3,clientX:460,clientY:410});
  h.fire('pointermove',{button:0,buttons:2,clientX:480,clientY:420}); assert.equal(h.api.active,null);
  const saved=structuredClone(h.state), commits=h.commits; h.fire('pointermove',{button:-1,buttons:2,clientX:500,clientY:430}); h.fire('pointerup',{button:2,buttons:0});
  assert.deepEqual(h.state,saved); assert.equal(h.commits,commits); assert.equal(h.captures.size,0); checks+=5;
}
for(const ending of ['pointercancel','lostpointercapture']) {
  const h=harness();h.fire('pointerdown');h.fire('pointermove',{clientX:480,clientY:420});const saved=structuredClone(h.state);h.fire(ending,{clientX:999,clientY:999});assert.equal(h.api.active,null);assert.deepEqual(h.state,saved);checks+=2;
}
const invalid=harness();invalid.fire('pointerdown');invalid.singular=true;invalid.fire('pointermove',{clientX:480});assert.equal(invalid.commits,0);assert.equal(invalid.api.active,null);invalid.fire('pointerup',{buttons:0});assert.equal(invalid.api.active,null);checks+=3;
const other=harness();other.fire('pointerdown');other.fire('pointermove',{pointerId:8,clientX:480});other.fire('pointerup',{pointerId:8,buttons:0});assert.ok(other.api.active);assert.equal(other.commits,0);checks+=2;
const failed=harness();failed.failed=true;failed.fire('pointerdown');assert.equal(failed.api.active,null);checks++;
const missing=harness();missing.missing=true;missing.fire('pointerdown');assert.equal(missing.api.active,null);checks++;
const resized=harness();resized.fire('pointerdown');resized.resize();resized.fire('pointermove',{clientX:320,clientY:260});near(resized.state.card,{x:50,y:-20},'handler current mapping after resize');
for(const mode of ['Card','Pan']) {
  const one=harness(mode), many=harness(mode);
  one.fire('pointerdown');many.fire('pointerdown');
  one.fire('pointermove',{clientX:480,clientY:420});
  for(let step=1;step<=8;step++)many.fire('pointermove',{clientX:440+step*5,clientY:400+step*2.5});
  assert.deepEqual(many.state,one.state);checks++;
  const final=harness(mode);final.fire('pointerdown');final.fire('pointermove',{clientX:460,clientY:410});const saved=structuredClone(final.state);final.singular=true;final.fire('pointermove',{button:0,buttons:2,clientX:480,clientY:420});assert.equal(final.api.active,null);assert.deepEqual(final.state,saved);final.fire('pointermove',{buttons:2,clientX:500});assert.deepEqual(final.state,saved);checks+=3;
}
// A simulated legacy SVGMatrix provider exercises its documented throwing inverse.
// It does not claim an actual browser singular-state or physical-device reproduction.
for (const mode of ['Card', 'Pan']) {
  const start = harness(mode); start.throwing = true;
  assert.doesNotThrow(() => start.fire('pointerdown'));
  assert.equal(start.thrownInverses, 1); assert.equal(start.api.active, null);
  assert.equal(start.commits, 0); assert.equal(start.captures.size, 0); checks += 5;
  for (const ending of ['pointermove', 'pointerup', 'chord-release']) {
    const h = harness(mode); h.fire('pointerdown');
    h.fire('pointermove', {clientX:460,clientY:410});
    const saved = structuredClone(h.state), commits = h.commits;
    h.throwing = true;
    const type = ending === 'chord-release' ? 'pointermove' : ending;
    const buttons = ending === 'pointermove' ? 1 : ending === 'pointerup' ? 0 : 2;
    assert.doesNotThrow(() => h.fire(type, {buttons,clientX:480,clientY:420}));
    assert.equal(h.thrownInverses, 1); assert.equal(h.api.active, null);
    assert.equal(h.captures.size, 0); assert.deepEqual(h.state, saved);
    assert.equal(h.commits, commits);
    assert.equal(h.reports.filter(message => /^(Completed|Cancelled)/.test(message)).length, 1);
    h.fire('lostpointercapture'); h.fire('pointermove', {buttons:2,clientX:500}); h.fire('pointerup', {buttons:0});
    assert.deepEqual(h.state, saved); assert.equal(h.commits, commits); checks += 9;
  }
}
for (const preset of ['baseline', 'resized', 'turned']) {
  const trace = comparison(preset, 'stale', 'Card');
  near(trace.actualC, trace.targetC, `${preset}: cached inverse remains valid with unchanged mapping`);
}
for (const preset of ['baseline', 'resized', 'turned', 'resize-between']) {
  for (const algorithm of ['derived', 'divide', 'stale']) {
    const trace = comparison(preset, algorithm, 'Pan');
    near(trace.actualC, trace.targetC, `${preset}: Pan ignores Card algorithm ${algorithm}`);
  }
}
console.log(JSON.stringify({status:'pass',checks,scope:'Model arithmetic and simulated handler lifecycle; no browser event-delivery claim.'},null,2));
