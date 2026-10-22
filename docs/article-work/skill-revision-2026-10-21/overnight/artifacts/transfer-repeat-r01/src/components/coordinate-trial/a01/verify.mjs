import assert from 'node:assert/strict';
import { example } from '../example.mjs';
import { point, compose, inverse, translation, viewMatrix } from '../geometry.mjs';
import { freshState, presets, presetState, mappings, snapshot, compensatedView, cardPlacement, validState, groupMatrix } from './model.mjs';
import { createGesture } from './gesture.mjs';
let checks = 0;
function equal(actual, expected, name) { assert.deepEqual(actual, expected, name); checks++; }
function near(actual, expected, name) { assert.ok(Math.hypot(actual.x-expected.x, actual.y-expected.y) <= 1e-7, name); checks++; }
const baseline = freshState(), maps = mappings(baseline);
equal(point(maps.CfromO,example.p), {x:440,y:400}, 'canonical baseline');
const expected = [{x:40,y:0},{x:50,y:-20},{x:-10,y:0},{x:50,y:-20}];
for (const [i,preset] of presets.entries()) {
  const s = snapshot(preset); equal(s.next.card,expected[i],preset.id+' placement');
  near(s.landedC,s.targetC,preset.id+' forward invariant');
}
equal(snapshot(presets[2],'Card',true).next.card,{x:50,y:30},'wrong turned placement');
equal(snapshot(presets[2],'Card',true).landedC,{x:290,y:180},'wrong turned miss');
equal(snapshot(presets[0],'Card',true).landedC,{x:420,y:440},'wrong baseline miss');
equal(snapshot(presets[3],'Card',false,true).next.card,{x:-40,y:80},'stale inverse placement');
equal(snapshot(presets[3],'Card',false,true).landedC,{x:220,y:170},'stale inverse miss');
equal(snapshot(presets[2],'Pan').next.view.pan,{x:740,y:0},'turned half pan');
const anchor={x:130,y:140};
for (const [view,target,z,angle,pan] of [
  [baseline.view,{x:320,y:320},3,0,{x:-70,y:-100}],
  [presetState(presets[2]).view,{x:380,y:220},3,90,{x:800,y:-170}],
  [baseline.view,{x:320,y:320},2,90,{x:600,y:60}],
]) {
  const next=compensatedView(view,anchor,target,z,angle);
  equal(next.pan,pan,'anchor pan'); near(point(viewMatrix(next),anchor),target,'anchor forward invariant');
}
for (const angle of [-171,17,123.5]) for(const zoom of [.25,1.33,4]) {
  const target={x:431.125,y:274.75},next=compensatedView(baseline.view,anchor,target,zoom,angle);
  near(point(viewMatrix(next),anchor),target,'arbitrary angle');
}
for(const z of [.25,4]) {
  const v=compensatedView(baseline.view,anchor,{x:320,y:320},z);
  const next=compensatedView(v,anchor,{x:320,y:320},z===4?6:0.1);
  equal(next,v,'bound does not drift');
}
equal(compensatedView(baseline.view,anchor,{x:320,y:320},NaN),null,'invalid zoom');
equal(compensatedView(baseline.view,anchor,{x:Infinity,y:0},2),null,'invalid target');
equal(validState({...baseline,view:{...baseline.view,zoom:0}}),false,'disallowed zoom');
equal(inverse([0,1,0,0,160,100]),null,'singular inverse');
for (const preset of presets.slice(0,3)) {
  const state=presetState(preset), map=mappings(state,preset.half),grab={x:65,y:31};
  const startC=point(map.CfromO,grab),endC={x:startC.x+40,y:startC.y+20};
  const targetG=point(inverse(map.CfromG),endC);
  const one=cardPlacement(targetG,grab);
  let several=state.card;
  for(let i=1;i<=10;i++) several=cardPlacement(point(inverse(map.CfromG),{x:startC.x+i*4,y:startC.y+i*2}),grab);
  near(one,several,'one move equals ten');
  near(point(compose(map.CfromG,translation(one.x,one.y)),grab),endC,'off-origin grab forward');
}
for (const mode of ['Card','Pan']) {
  function harness({invalidFinal=false,captureFails=false}={}) {
    const updates=[],reports=[],releases=[];
    const controller=createGesture({
      read:()=>({x:10,y:10}),update:(active,e)=>{updates.push(e.buttons);return !(invalidFinal && e.buttons===2);},
      capture:()=>{if(captureFails)throw Error('capture unavailable');},release:id=>releases.push(id),report:x=>reports.push(x),
    });
    return {controller,updates,reports,releases};
  }
  const event=(buttons,id=1)=>({button:0,buttons,pointerId:id});
  for(const invalidFinal of [false,true]) {
    const h=harness({invalidFinal});h.controller.down(event(1),mode);
    h.controller.move(event(3));h.controller.move(event(2));
    equal(h.controller.active,null,mode+' finishes at primary release');
    h.controller.move(event(2));h.controller.up(event(0));
    equal(h.updates,[3,2],mode+' no later update');
    equal(h.reports.length,1,mode+' one completion');equal(h.releases,[1],mode+' one release');
    h.controller.lost(event(0));equal(h.reports.length,1,mode+' repeated cleanup safe');
  }
  for(const end of ['cancel','lost']) {
    const h=harness();h.controller.down(event(1),mode);h.controller[end](event(1));
    equal(h.updates,[],mode+' '+end+' no final move');equal(h.controller.active,null,mode+' '+end+' idle');
  }
  const h=harness();h.controller.down(event(1),mode);h.controller.move(event(1,9));equal(h.updates,[],mode+' other pointer ignored');
  h.controller.up(event(0));equal(h.updates,[0],mode+' pointerup final update');
  const failed=harness({captureFails:true});failed.controller.down(event(1),mode);equal(failed.controller.active,null,mode+' failed capture idle');
  const rejected=createGesture({read:()=>({x:10,y:10}),update:()=>false,capture:()=>{},release:()=>{}});
  rejected.down(event(1),mode);rejected.move(event(1));equal(rejected.active,null,mode+' invalid move clears');
}
console.log(JSON.stringify({checks, result:'pass', arithmetic:'Exact quarter-turn expectations; 1e-7 absolute tolerance for arbitrary angles and forward checks', boundary:'Node model and injected lifecycle; no browser/device result claimed'},null,2));
