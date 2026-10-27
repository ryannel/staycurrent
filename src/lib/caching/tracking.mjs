// Illustrative schedules, not a Redis protocol implementation.
export const hierarchySteps=[
 {title:'Both local copies are warm',source:12,redis:12,a:12,b:12,pending:[],connected:true,answer:'Two earlier Redis reads populated A and B.',note:'Each process now has its own copy of the shared Redis value.'},
 {title:'A reads locally',source:12,redis:12,a:12,b:12,pending:[],connected:true,answer:'A returns 12 · no Redis request',note:'The local hit avoids the Redis round trip. B’s copy is independent.'},
 {title:'The source changes',source:15,redis:12,a:12,b:12,pending:[],connected:true,answer:'The authoritative source is 15',note:'Redis has not changed. Tracking has no Redis modification to report; every cache still contains 12.'},
 {title:'Delete the shared entry',source:15,redis:null,a:12,b:12,pending:['A','B'],connected:true,answer:'Redis DEL has executed',note:'Invalidations are on their way. Execution of DEL is not simultaneous delivery to every process.'},
 {title:'A receives its invalidation',source:15,redis:null,a:null,b:12,pending:['B'],connected:true,answer:'A discards its local 12',note:'B has not yet processed its notification. Clearing the shared entry did not directly erase B’s memory.'},
 {title:'B reads before delivery',source:15,redis:null,a:null,b:12,pending:['B'],connected:true,answer:'B returns 12 · a stale local hit',note:'A fast local answer can be stale while an invalidation is still in flight.'},
 {title:'B detects a lost connection',source:15,redis:null,a:null,b:null,pending:[],connected:false,answer:'B clears its local cache',note:'The old invalidation stream can no longer be trusted. Keeping the old copy would turn a connection fault into an unbounded stale-hit risk.'},
 {title:'Refill Redis from the source',source:15,redis:15,a:null,b:null,pending:[],connected:false,answer:'A loader stores 15 in Redis',note:'This explicit source load restores the shared entry. It does not populate B’s disconnected local cache.'},
 {title:'B reconnects',source:15,redis:15,a:null,b:null,pending:[],connected:true,answer:'A new tracking connection is ready',note:'The local cache remains empty. Reconnection does not revive entries from the previous connection.'},
 {title:'B reads Redis again',source:15,redis:15,a:null,b:15,pending:[],connected:true,answer:'B reads and locally caches 15',note:'The new read establishes a new tracked dependency. Later local hits can reuse this answer.'},
];
export const pendingInitial=()=>({phase:0,epoch:0,token:null,naive:null,guarded:null,reply:null});
export function pendingStep(s){if(s.phase===0)return{...s,phase:1,token:s.epoch};if(s.phase===1)return{...s,phase:2,epoch:s.epoch+1,naive:null,guarded:null};if(s.phase===2)return{...s,phase:3,naive:12,guarded:s.token===s.epoch?12:null,reply:12};return s;}
export function localDeadline(fill=55,ttl=30,enforce=false,now=75){const original=60,local=fill+ttl,end=enforce?Math.min(original,local):local,accepted=now>=fill&&now<end;return{fill,ttl,original,local,end,now,accepted,tooOld:now>=original};}
export function reuseCycle(processes=4,reads=10){const requests=processes*reads,redisReads=processes,hits=requests-redisReads;return{processes,reads,requests,redisReads,hits,invalidations:processes,localKiB:processes*2,hitRate:hits/requests};}
