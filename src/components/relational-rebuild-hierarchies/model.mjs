export const nodes = [
 {id:0,name:'Catalogue'}, {id:10,name:'Teaware'}, {id:11,name:'Mugs'},
 {id:12,name:'Blue mugs'}, {id:20,name:'Gifts'}
];
export const baseEdges = [[0,10],[10,11],[11,12],[0,20]];
export const moveEdges = [[0,10],[20,11],[11,12],[0,20]];
export const sharedEdges = [...baseEdges,[20,11]];
export function routes(edges,start=0,path=[start]) {
 return [path,...edges.filter(([p,c])=>p===start&&!path.includes(c)).flatMap(([,c])=>routes(edges,c,[...path,c]))];
}
export function closure(edges) {
 return nodes.flatMap(n=>routes(edges,n.id).map(p=>[n.id,p.at(-1),p.length-1]));
}
export function bounds(edges) {
 let i=0; const result={};
 function visit(id){ const lo=++i; edges.filter(([p])=>p===id).sort((a,b)=>a[1]-b[1]).forEach(([,c])=>visit(c));result[id]=[lo,++i]; }
 visit(0);return result;
}
const name=id=>nodes.find(n=>n.id===id)?.name;
const table=(headers,rows)=>`<div class="hf-table"><table><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i===0?`<th scope="row">${c}</th>`:`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
export function tree(edges,{focus=[],ghost=[],attempt=false}={}) {
 const moved=edges===moveEdges||edges.some(([p,c])=>p===20&&c===11)&&!edges.some(([p,c])=>p===10&&c===11);
 const shared=edges.some(([p,c])=>p===20&&c===11)&&edges.some(([p,c])=>p===10&&c===11);
 const x=moved?245:shared?165:85;
 const positions={0:[165,30],10:[85,110],20:[245,110],11:[x,200],12:[x,290]};
 const line=([p,c],extra='')=>{const a=positions[p],b=positions[c],tip=[b[0],b[1]-21],dx=tip[0]-a[0],dy=tip[1]-a[1]-21,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;return `<path class="hf-edge ${extra}" d="M${a[0]} ${a[1]+21} L${tip[0]} ${tip[1]}"/><polygon points="${tip[0]},${tip[1]} ${tip[0]-7*ux+3*uy},${tip[1]-7*uy-3*ux} ${tip[0]-7*ux-3*uy},${tip[1]-7*uy+3*ux}" fill="currentColor"/>`;};
 return `<svg class="hf-tree" viewBox="0 0 330 325" role="img" aria-label="${edges.map(([p,c])=>`${name(p)} is parent of ${name(c)}`).join('; ')}${attempt?'; proposed Blue mugs to Teaware edge would close a cycle':''}">${ghost.map(e=>line(e,'hf-ghost')).join('')}${edges.map(e=>line(e)).join('')}${attempt?'<path class="hf-rejected" d="M33 290 C3 290 3 110 32 110"/>':''}${nodes.map(n=>{const [cx,cy]=positions[n.id];return `<g class="${focus.includes(n.id)?'hf-active':''}"><rect x="${cx-59}" y="${cy-21}" width="118" height="42" rx="4"/><text x="${cx}" y="${cy-3}" text-anchor="middle">${n.name}</text><text class="hf-id" x="${cx}" y="${cy+13}" text-anchor="middle">ID ${n.id}</text></g>`;}).join('')}</svg>`;
}
export const definitions={
 relation:{title:'One category, one immediate parent',label:'Figure 1',options:[['base','Starting tree'],['move','Move Mugs'],['shared','Two parents'],['reject','Reject a cycle']],steps:1},
 recursion:{title:'One generation becomes the next',label:'Figure 2',options:[['down','Descendants of Teaware'],['up','Breadcrumb for Blue mugs']],steps:5},
 race:{title:'Two valid checks can leave a cycle',label:'Figure 3',options:[['unsafe','Separate checks'],['safe','Lock before reading']],steps:5},
 path:{title:'The Mugs prefix changes in two paths',label:'Figure 5',options:[['base','Before the move'],['move','After the move']],steps:1},
 closure:{title:'Which ancestry pairs change?',label:'Figure 6',options:[['base','Starting closure'],['insert','Insert Blue mugs'],['move','Move Mugs']],steps:1},
 nested:{title:'Intervals contain the whole subtree',label:'Figure 7',options:[['base','Before the move'],['move','After the move']],steps:1}
};
export function scene(kind,option,step=0) {
 let visual='',data='',explanation='';
 if(kind==='relation'){
  const edges=option==='move'?moveEdges:option==='shared'?sharedEdges:baseEdges;
  visual=tree(edges,{focus:option==='base'?[]:[11,12],attempt:option==='reject',ghost:option==='move'?[[10,11]]:[]});
  data=option==='shared'?table(['Parent → child','Stored edge'],edges.map(([p,c])=>[`${name(p)} → ${name(c)}`,`${p} → ${c}`])):table(['ID · name','parent_id'],nodes.map(n=>[`${n.id} · ${n.name}`,edges.find(([,c])=>c===n.id)?.[0]??'NULL']));
  explanation={base:'Teaware is Mugs’ direct parent. Catalogue is an ancestor of Mugs, reached through Teaware. Blue mugs is a descendant of both.',move:'Only Mugs’ parent changes, from 10 to 20. Blue mugs still names Mugs (11) as its parent. The faint dashed line is the removed relationship.',shared:'Mugs is still one category with ID 11. Two edge rows now attach it to Teaware and Gifts. Blue mugs can be reached along either route.',reject:'The proposed Blue mugs → Teaware edge would make Teaware → Mugs → Blue mugs → Teaware. Reject it; the stored tree stays as drawn.'}[option];
 }
 if(kind==='recursion'){
  const generations=option==='down'?[[10],[11],[12],[],[]]:[[12],[11],[10],[0],[]];
  const current=generations[step], accumulated=generations.slice(0,step+1).flat();
  visual=tree(baseEdges,{focus:current});
  data=`<p class="hf-small">Current working rows: <strong>${current.join(', ')||'none'}</strong></p>`+table(['Accumulated ID','depth'],accumulated.map((id,i)=>[`${id} · ${name(id)}`,i]));
  explanation=option==='down'?[
   'The starting term returns Teaware (10), at depth 0. It is already part of the result, and is the first working row.',
   'Join children to working ID 10. Mugs has parent_id 10, so Mugs (11) becomes the next working row, at depth 1.',
   'Join children to working ID 11. Blue mugs (12) becomes the next working row, at depth 2.',
   'No category has parent_id 12. The next working set is empty, so recursion ends. The result still holds all three rows.',
   'The outer ORDER BY route displays Teaware, Mugs, Blue mugs. The figure models working sets, not a physical execution trace.'
  ][step]:[
   'Start at Blue mugs (12), depth 0. This time the query carries its parent_id, 11, upwards.',
   'Join the parent’s category_id to 11. Mugs joins the result, at depth 1.',
   'Mugs names Teaware (10) as parent. Teaware joins the result, at depth 2.',
   'Teaware names Catalogue (0). Catalogue joins the result at depth 3; its parent_id is NULL.',
   'NULL finds no parent, so recursion ends. ORDER BY depth DESC displays Catalogue → Teaware → Mugs → Blue mugs.'
  ][step];
 }
 if(kind==='race'){
  const safe=option==='safe';
  const unsafe=[['A: Teaware under Gifts','B: Gifts under Teaware'],['Reads descendants of 10: {10,11,12}; 20 absent.','Reads descendants of 20: {20}; 10 absent.'],['Sets parent(10) = 20.','Sets parent(20) = 10.'],['COMMIT','COMMIT'],['Teaware ↔ Gifts is stored.','Neither foreign key nor self-check rejects it.']];
  const protectedRows=[['A: Teaware under Gifts','B: Gifts under Teaware'],['Locks categories; checks 20 is outside subtree 10.','Requests the same lock; waits before reading.'],['Sets parent(10) = 20; COMMIT.','Still waiting until A commits.'],['Lock released.','Acquires lock; reads descendants of 20: {20,10,11,12}.'],['One valid tree remains.','Rejects target 10: it is now inside subtree 20. ROLLBACK.']];
  data=table(['Session A','Session B'],(safe?protectedRows:unsafe).slice(0,step+1));
  let edges=baseEdges;if(step>=2){edges=[[0,20],[20,10],[10,11],[11,12]];}
  visual= step>=2&&!safe?`<div class="hf-cycle"><strong>10 Teaware ⇄ 20 Gifts</strong><span>11 Mugs → 12 Blue mugs<br/>remain below Teaware</span><span>${step>=3?'Stored cycle':'Uncommitted opposing parent changes'}</span></div>`:step>=2?`<div class="hf-chain"><strong>0 Catalogue</strong><span>↓</span><strong>20 Gifts</strong><span>↓</span><strong>10 Teaware</strong><span>↓</span><strong>11 Mugs → 12 Blue mugs</strong></div>`:tree(baseEdges);
  explanation=safe?[
   'Start from the two separate branches. Both requests must take the same table lock before reading any hierarchy rows.',
   'Only A holds the topology lock. B has no hierarchy answer yet, so it cannot validate against an earlier tree.',
   'A moves Teaware under Gifts and commits. The lock covers both the check and every stored representation changed by the move.',
   'At Read Committed, B’s separate query after the lock sees A’s committed tree. Gifts now contains Teaware.',
   'B cannot move Gifts under its own descendant. One request succeeds and one is rejected. This is a conceptual schedule of the stated protocol.'
  ][step]:[
   'A wants to put Teaware under Gifts; B wants the opposite. Both start from the original separate branches.',
   'Both checks are true in that starting tree. Their checks protect no shared update boundary.',
   'The two updates change different category rows. Each new parent exists, and neither row names itself.',
   'Both commits can succeed. Following parent links now loops between Teaware and Gifts; Catalogue cannot reach either branch.',
   'Locking only the row being moved cannot prevent this race. The invariant concerns paths through several rows. This is a conceptual schedule.'
  ][step];
 }
 if(kind==='path'){
  const paths=routes(option==='move'?moveEdges:baseEdges);
  visual=tree(option==='move'?moveEdges:baseEdges,{focus:[11,12]});
  data=table(['Category','Stored ID path'],nodes.map(n=>[n.name,`<span class="${option==='move'&&[11,12].includes(n.id)?'hf-changed':''}">${paths.find(p=>p.at(-1)===n.id).join('.')}</span>`]));
  explanation=option==='move'?'Replace 0.10.11 with 0.20.11 in Mugs and every descendant. Blue mugs keeps its suffix .12. The other three paths stay unchanged.':'Each path is the sequence of IDs from Catalogue to this category, including both ends. The complete segment prefix 0.10.11 selects Mugs and Blue mugs.';
 }
 if(kind==='closure'){
  const edges=option==='move'?moveEdges:baseEdges,pairs=closure(edges);
  visual=tree(edges,{focus:option==='insert'?[12]:[11,12]});
  data='<div class="hf-table"><table class="hf-matrix"><caption>Ancestor ↓ · descendant → · number = depth</caption><thead><tr><th scope="col">ID</th>'+nodes.map(n=>`<th scope="col">${n.id}</th>`).join('')+'</tr></thead><tbody>'+nodes.map(n=>`<tr><th scope="row">${n.id}</th>`+nodes.map(d=>{const pair=pairs.find(p=>p[0]===n.id&&p[1]===d.id);const changed=option==='insert'?d.id===12:option==='move'&&[10,20].includes(n.id)&&[11,12].includes(d.id);return `<td class="${pair?'hf-pair ':''}${changed?'hf-changed':''}">${pair?pair[2]:'—'}</td>`;}).join('')+'</tr>').join('')+'</tbody></table></div>';
  explanation=option==='insert'?'Building the Blue mugs leaf adds (12,12,0), (11,12,1), (10,12,2) and (0,12,3): the four marked cells in column 12. The other eight pairs already existed.':option==='move'?'Remove Teaware’s pairs to 11 and 12; add Gifts’ pairs at depths 1 and 2. Catalogue’s reachability and internal Mugs → Blue mugs ancestry remain. The shown tree has 12 pairs before and after.':'Every category has its self-pair at depth 0. The Mugs row says Mugs reaches itself at 0 and Blue mugs at 1. Catalogue reaches all five categories. A dash means no pair.';
 }
 if(kind==='nested'){
  const edges=option==='move'?moveEdges:baseEdges,b=bounds(edges);
  visual=`<svg viewBox="0 0 350 270" role="img" aria-label="${nodes.map(n=>`${n.name} ${b[n.id][0]} to ${b[n.id][1]}`).join('; ')}">${Array.from({length:10},(_,i)=>`<text class="hf-id" x="${130+i*21}" y="18" text-anchor="middle">${i+1}</text>`).join('')}${nodes.map((n,i)=>`<text x="4" y="${53+i*47}">${n.name}</text><line class="hf-interval" x1="${130+(b[n.id][0]-1)*21}" x2="${130+(b[n.id][1]-1)*21}" y1="${48+i*47}" y2="${48+i*47}"/><circle cx="${130+(b[n.id][0]-1)*21}" cy="${48+i*47}" r="4"/><circle cx="${130+(b[n.id][1]-1)*21}" cy="${48+i*47}" r="4"/>`).join('')}</svg>`;
  data=table(['Category','entry · exit'],nodes.map(n=>[n.name,b[n.id].join(' · ')]));
  explanation=option==='move'?'Visit siblings by ID again: Teaware is now a leaf (2,3); Gifts (4,9) contains Mugs (5,8) and Blue mugs (6,7). Four category rows change bounds; Catalogue keeps (1,10).':'Enter Catalogue at 1 and leave at 10. Teaware’s interval (2,7) contains both Mugs (3,6) and Blue mugs (4,5). Gifts (8,9) lies outside it. These are deterministic illustrative traversal numbers.';
 }
 return {visual,data,explanation};
}
