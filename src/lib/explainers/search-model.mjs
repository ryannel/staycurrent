export const searchProducts = [
 {id:1,title:'Blue ceramic mug',stock:0,version:1,vector:[.95,.95]},
 {id:2,title:'Indigo ceramic cup',stock:0,version:1,vector:[1,1]},
 {id:3,title:'Blue cereal bowl',stock:3,version:1,vector:[.9,.5]},
 {id:4,title:'White ceramic mug',stock:6,version:1,vector:[.1,.95]},
 {id:5,title:'Steel travel flask',stock:4,version:1,vector:[.1,.4]},
];
export function searchTokens(text){return [...new Set(text.normalize('NFC').toLowerCase().normalize('NFC').match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}]*/gu)||[])];}
export function createSearchState(){return {source:structuredClone(searchProducts),segments:[{number:1,docs:structuredClone(searchProducts)}],deleted:[],pending:[],next:2,message:'Five products are searchable. No update is waiting for refresh.'};}
export function searchVisible(state){return state.segments.flatMap(s=>s.docs).filter(p=>!state.deleted.includes(`${p.id}:${p.version}`));}
export function searchStep(previous,type){
 const s=structuredClone(previous);
 if(type==='update' && !s.pending.length){ const p=s.source[0]; p.title=p.title.startsWith('Blue')?'Indigo ceramic cup':'Blue ceramic mug';p.stock=p.stock?0:4;p.version++;s.pending=[{...p}];s.message=`Catalogue accepted mug version ${p.version}: ${p.title}, stock ${p.stock}. Delivery to the search engine succeeded; its indexing buffer accepted this version. Search readers still use the previous version until refresh.`;}
 if(type==='refresh'){
  if(!s.pending.length){s.message='No accepted update is waiting in the indexing buffer. Refresh leaves the results unchanged and does not fetch the catalogue.';return s;}
  for(const p of s.pending)for(const old of searchVisible(s))if(old.id===p.id)s.deleted.push(`${old.id}:${old.version}`);
  s.segments.push({number:s.next++,docs:structuredClone(s.pending)});s.pending=[];s.message='Refresh opened a segment containing the already accepted buffer version and hid the replaced version. Search can now see the update; no catalogue fetch occurred.';
 }
 if(type==='merge'){s.segments=[{number:s.next++,docs:structuredClone(searchVisible(s))}];s.deleted=[];s.message='Merged the live documents into one segment and removed deleted versions. The search answer is unchanged.';}
 return s;
}
export function searchLexical(state,query,mode='all',inStock=false){
 const docs=searchVisible(state),terms=searchTokens(query);
 const postings=terms.map(term=>({term,ids:docs.filter(d=>searchTokens(d.title).includes(term)).map(d=>d.id)}));
 const results=docs.filter(d=>terms.length && (mode==='all'?postings.every(p=>p.ids.includes(d.id)):postings.some(p=>p.ids.includes(d.id))) && (!inStock||d.stock>0)).map(d=>({...d,score:postings.reduce((total,p)=>total+(p.ids.includes(d.id)?1/p.ids.length:0),0)})).sort((a,b)=>b.score-a.score||a.id-b.id);
 return {terms,postings,results,entries:postings.reduce((n,p)=>n+p.ids.length,0),docs};
}
export const searchVectorQueries={'Blue mug':[1,1],'White mug':[.1,1],'Blue bowl':[1,.5]};
export function searchVectors(queryName='Blue mug',filterFirst=true){
 const query=searchVectorQueries[queryName];
 const all=searchProducts.map(d=>({...d,distance:Math.hypot(d.vector[0]-query[0],d.vector[1]-query[1])})).sort((a,b)=>a.distance-b.distance||a.id-b.id);
 const candidates=filterFirst?all.filter(d=>d.stock>0).slice(0,2):all.slice(0,2);
 return {all,candidates,results:candidates.filter(d=>d.stock>0),query,distances:searchProducts.length};
}
