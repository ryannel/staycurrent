import assert from 'node:assert/strict';
import {scenes,frames} from './model.mjs';
let cases=0;
for(const [scene,def] of Object.entries(scenes)) for(const [choice] of def.options){
 const sequence=frames(scene,choice);assert.ok(sequence.length>=4);
 for(const f of sequence){assert.ok(f.title&&f.event&&f.result&&f.note);assert.equal(f.panels.length,3);assert.ok(['waiting','pass','closed'].includes(f.gate));}
 if(scene==='join') assert.equal(sequence.at(-1).gate,choice==='gap'?'closed':'pass');
 if(scene==='reconcile') assert.equal(sequence.at(-1).gate,choice==='clean'?'pass':'closed');
 if(scene==='cutover') assert.equal(sequence.at(-1).gate,choice==='safe'?'pass':'closed');
 if(scene==='return') assert.equal(sequence.at(-1).gate,choice==='before'?'pass':'closed');
 cases++;
}
console.log(`${cases} causal branches checked; failed gates stay closed.`);
