import { frames } from '../src/components/relational-rebuild-storage-durability/models.mjs';
import {writeFileSync} from 'node:fs';
const results=[];
for(const [cut,price,heard] of [['before','20.00','Waiting'],['durable','22.00','No reply yet'],['reply','22.00','Success received'],['early','20.00','Success received early']]){
 const f=frames('crash',cut); const last=f.at(-1);
 if(!last.action.endsWith(price)||!last.scene.includes(heard))throw Error(`Wrong cut: ${cut}`);
 results.push({cut,recovered:price,application:heard,steps:f.length});
}
const wal=frames('wal');
for(const f of wal){if(f.d!=='20.00'&&!f.dl.includes('U · change P7 to 22.00'))throw Error('Page before WAL');}
if(wal[4].d!=='20.00'||!wal[4].dl.includes('C · transaction committed'))throw Error('Commit/page gap missing');
for(const engine of ['pg','innodb']){
 const f=frames('versions',engine); if(!f[2].scene.includes('20.00')||!f[2].scene.includes('22.00'))throw Error('Version visibility missing');
}
writeFileSync('evidence/model-result.json',JSON.stringify({results,wal:'Page write follows durable U; durable acknowledgement follows C; acknowledgement precedes data-page write in selected schedule.',limits:'Checks authored conceptual states, not engine execution or a simulated real power failure.'},null,2));
