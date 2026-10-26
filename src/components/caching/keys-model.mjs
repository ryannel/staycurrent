export const priceRequests = [
 {id:'A',tenant:'north',currency:'EUR',group:'retail',amount:1800},
 {id:'B',tenant:'north',currency:'USD',group:'retail',amount:2000},
 {id:'C',tenant:'north',currency:'EUR',group:'trade',amount:1500},
 {id:'D',tenant:'south',currency:'EUR',group:'retail',amount:2400},
];
export function groupRequests(fields, rounds=2) {
 const cache=new Map();
 const outcomes=[];
 for(let round=0;round<rounds;round++) for(const request of priceRequests){
   const key=['mug',...fields.map(f=>request[f])].join(':');
   const hit=cache.has(key);
   if(!hit)cache.set(key,{...request});
   const value=cache.get(key);
   // Matching numbers are insufficient: ownership and representation matter too.
   const correct=['tenant','currency','group','amount'].every(f=>value[f]===request[f]);
   outcomes.push({...request,round,key,hit,correct,returned:value});
 }
 return {entries:[...cache.entries()],outcomes};
}

export function fieldUpdate(mode,step) {
 const initial={currency:'EUR',amount:1800}, final={currency:'USD',amount:2000};
 const separate=mode==='separate';
 const state=step===0?initial:separate&&step===1?{currency:'USD',amount:1800}:final;
 return {...state,mixed:separate&&step===1,
  command:step===0?'Starting copy':step===1?(separate?'HSET offer currency USD':mode==='hash'?'HSET offer currency USD amount 2000':'SET offer {"currency":"USD","amount":2000}'):(separate?'HSET offer amount 2000':'No further write needed')};
}

export function schemaRead(versioned, reader, writer) {
 const hit=!versioned||reader===writer;
 const stored=writer===1?18:1800;
 return {hit,stored,displayed:hit?(reader===1?stored:stored/100):null,correct:hit&&reader===writer};
}

export function negativeRead(outcome,cached) {
 if(cached&&outcome==='missing')return {originReads:1,response:'Not found',entry:'{"found":false}',hit:true};
 if(outcome==='missing')return {originReads:2,response:'Not found',entry:'absent',hit:false};
 if(outcome==='failed')return {originReads:2,response:'Unavailable',entry:'absent',hit:false};
 return {originReads:1,response:'Blue mug',entry:'{"found":true,"value":"Blue mug"}',hit:true};
}

// The caller provides already-validated, semantically normalised strings.
export function responseKey({tenant,product,currency,priceGroup,locale}) {
 const parts=['product-response',2,tenant,product,currency,priceGroup,locale];
 if(parts.slice(2).some(v=>typeof v!=='string'||v.length===0))throw new TypeError('Key inputs must be non-empty strings');
 return JSON.stringify(parts);
}
