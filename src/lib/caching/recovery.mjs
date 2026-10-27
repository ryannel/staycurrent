// Discrete teaching models. They execute no Redis commands and measure no latency.
export const replicationInitial=()=>({source:12,primary:12,replica:12,deleted:false,delivered:false,failed:false,promoted:false});
export function replicationStep(s,action){
 if(action==='source'&&!s.deleted&&!s.failed)return{...s,source:15};
 if(action==='delete'&&s.source===15&&!s.failed)return{...s,primary:null,deleted:true};
 if(action==='deliver'&&s.deleted&&!s.failed)return{...s,replica:null,delivered:true};
 if(action==='fail'&&s.deleted)return{...s,failed:true};
 if(action==='promote'&&s.failed)return{...s,promoted:true};
 return s;
}
export const persistenceEvents=['Initial 12 saved','SET 15','DEL key','fsync completes','SET 18','fsync completes'];
export function persistenceState(step=0,policy='everysec'){
 const values=[12,15,null,null,18,18],indices=[0,1,2,2,3,3];
 const written=indices[step];
 const durable=policy==='always'?written:step>=5?3:step>=3?2:0;
 return{step,policy,written,durable:policy==='rdb'?0:durable,memory:values[step],recovered:policy==='rdb'?12:[12,15,null,18][durable]};
}
export function sentinelDecision(total=5,reachable=2,eligible=true){const quorum=2,majority=Math.floor(total/2)+1;return{quorum,majority,detected:reachable>=quorum,authorised:reachable>=Math.max(quorum,majority),canPromote:reachable>=Math.max(quorum,majority)&&eligible};}
export function restoredCache(time=50,enforceAge=false){const expiresAt=90,observedAt=0,maxAge=60;const present=time<expiresAt,accepted=present&&(!enforceAge||time-observedAt<maxAge);return{time,expiresAt,maxAge,age:time-observedAt,ttl:Math.max(0,expiresAt-time),present,accepted,value:accepted?12:null,source:15};}
