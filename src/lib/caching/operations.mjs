// Invented schedules and budgets for teaching; no production measurements.
export const latencyStages=['Client wait','Send','Redis queue','Execute','Receive','Decode'];
export const latencyCases={
 queue:{name:'Waiting behind another command',times:[2,2,90,1,3,2],evidence:'This GET executes for only 1 ms after waiting 90 ms. Inspect other commands and server latency events around the same time; a short GET execution does not rule out Redis-side waiting.'},
 execute:{name:'Expensive command execution',times:[2,2,1,90,3,2],evidence:'The command itself occupies 90 ms. Its slow-log entry and arguments, command mix and value size are useful leads. Bound the work or response size before assuming the network is responsible.'},
 network:{name:'Delay outside command execution',times:[2,46,0,1,49,2],evidence:'The model puts 95 ms in sending and receiving, while execution takes 1 ms. Compare application traces and connection/network evidence. In a real incident, an empty slow log alone cannot establish this diagnosis.'},
};
export const counterSamples={
 recent:{before:{id:'A',hits:900,misses:100},after:{id:'A',hits:920,misses:180}},
 reset:{before:{id:'A',hits:900,misses:100},after:{id:'A',hits:5,misses:5}},
 idle:{before:{id:'A',hits:900,misses:100},after:{id:'A',hits:900,misses:100}},
 moved:{before:{id:'A',hits:900,misses:100},after:{id:'B',hits:920,misses:180}},
};
export function counterWindow(before,after){
 if(before.id!==after.id)return{valid:false,reason:'Different Redis process: start a new series.'};
 const hits=after.hits-before.hits,misses=after.misses-before.misses;
 if(hits<0||misses<0)return{valid:false,reason:'A counter decreased: discard this interval and establish a new baseline.'};
 return{valid:true,hits,misses,total:hits+misses,rate:hits+misses?hits/(hits+misses):null,reason:hits+misses?'':'No lookups in this interval: hit rate is undefined.'};
}
export const accessCases={
 catalog:{command:'GET',key:'cache:catalog:42'},
 orders:{command:'GET',key:'cache:orders:42'},
 set:{command:'SET',key:'cache:catalog:42'},
 config:{command:'CONFIG GET',key:null},
 flush:{command:'FLUSHALL',key:null},
};
export function accessDecision(request){
 const commandAllowed=['GET','SET','DEL','PING'].includes(request.command);
 const keyAllowed=request.key===null||request.key.startsWith('cache:catalog:');
 return{commandAllowed,keyAllowed,allowed:commandAllowed&&keyAllowed};
}
export function rolloutLoad(percent=20,newHitPercent=0){
 const requests=1000,f=percent/100,newRequests=requests*f,oldRequests=requests-newRequests;
 const oldLoads=oldRequests*.05,newLoads=newRequests*(1-newHitPercent/100),total=oldLoads+newLoads,budget=200;
 return{requests,newRequests,oldRequests,oldLoads,newLoads,total,budget,excess:Math.max(0,total-budget)};
}
