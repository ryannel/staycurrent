import assert from 'node:assert/strict';
import {scenes,frames} from './model.mjs';
let states=0;
for(const [scene,def] of Object.entries(scenes))for(const [choice] of def.options){
 const steps=frames(scene,choice);assert.ok(steps.length>=3);
 for(const frame of steps){assert.equal(frame.panels.length,3);for(const value of [frame.title,frame.result,frame.note,...frame.panels.flatMap(p=>[p.name,p.state,p.detail])])assert.ok(typeof value==='string'&&value.length>0);states++;}
}
assert.match(frames('ownership','shortcut').at(-1).result,/wrong ownership/);
assert.match(frames('cleanup','broken').at(-1).panels[2].state,/Closed/);
assert.match(frames('cleanup','early').at(-1).panels[2].state,/failed/);
assert.match(frames('acquire','forgotten').at(-1).panels[1].state,/Unowned/);
assert.match(frames('state','session').at(-1).panels[2].state,/Previous/);
assert.match(frames('stream','close').at(-1).panels[1].state,/No order_rows/);
assert.match(frames('demand','8').at(-1).result,/20 connections beyond/);
assert.match(frames('demand','4').at(-1).result,/4 connections of headroom/);
console.log(`${states} complete lifecycle model states passed`);
