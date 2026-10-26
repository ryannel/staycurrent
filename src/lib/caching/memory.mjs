// Measurements from the pinned lab on macOS arm64, libc, Redis 8.2.2.
// These are observations, never sizing constants for another environment.
export const encodingSamples=[{fields:512,encoding:'listpack',bytes:7200},{fields:513,encoding:'hashtable',bytes:37008}];
export function memoryBudget(limit=1024,cow=0){
 const demand=1400,counted=Math.min(demand,limit),buffers=128,residentExtra=128,other=256;
 return {demand,limit,counted,evicted:demand-counted,buffers,residentExtra,other,cow,allocated:counted+buffers,resident:counted+buffers+residentExtra,total:counted+buffers+residentExtra+other+cow,hostLimit:2048};
}
export function cowInitial(){return {active:false,writes:0,dirty:[],started:false};}
export function cowStep(state,action,page=0){
 if(action==='fork'){if(state.active)return state;return {active:true,writes:0,dirty:[],started:true};}
 if(action==='finish'){if(!state.active)return state;return {...state,active:false,dirty:[]};}
 if(action==='write'&&state.active&&Number.isInteger(page)&&page>=0&&page<12)return {...state,writes:state.writes+1,dirty:[...new Set([...state.dirty,page])]};
 return state;
}
export function cowPages(state){return 12+(state.active?state.dirty.length:0);}
// Fixed-cost teaching scheduler. Waiting readers run at each chunk boundary.
// It is not Redis SCAN's cursor algorithm or a guarantee about COUNT/fairness.
export function maintenanceSchedule(chunk=12){
 const reads=[2,6,10].map((arrive,id)=>({id,arrive,start:null,end:null})),events=[];let time=0,done=0;
 const serve=()=>{for(const r of reads){if(r.start===null&&r.arrive<=time){r.start=time;r.end=++time;events.push({type:'read',id:r.id,start:r.start,end:r.end});}}};
 while(done<12){serve();const count=Math.min(chunk,12-done);events.push({type:'maintenance',start:time,end:time+count,count});time+=count;done+=count;}
 for(const r of reads){if(r.start===null){time=Math.max(time,r.arrive);serve();}}
 return {events,reads,end:time,work:12};
}
