/** Explicit schedules for one key; each model action is indivisible. No Redis failover. */
export function raceInitial(order='after',guarded=false) {
 return {order,guarded,source:12,cache:order==='before'?12:null,held:null,reader:0,writer:0,generation:'g1',captured:null,log:[],message:'Choose which actor takes the next step.'};
}
export function raceStep(state,actor) {
 const s={...state,log:[...state.log]};let action='';
 if(actor==='reader'){
  if(s.reader===3)return state;
  if(s.reader===0){s.captured=s.generation;if(s.cache!==null){s.held=s.cache;s.reader=3;action=`Cache hit: return £${s.cache}.`;}else{s.reader=1;action=`Cache miss${s.guarded?`; capture ${s.captured}`:''}.`;}}
  else if(s.reader===1){s.held=s.source;s.reader=2;action=`Read source: hold £${s.held} in this request.`;}
  else {s.reader=3;if(s.guarded&&s.captured!==s.generation)action=`Reject fill: ${s.captured} no longer matches ${s.generation}. The reader still holds £${s.held}.`;else{s.cache=s.held;action=`Fill cache with held £${s.held}.`;}}
 } else if(actor==='writer'){
  if(s.writer===2)return state;
  const commit=s.order==='after'?s.writer===0:s.writer===1;
  if(commit){s.source=15;action='Commit source price £15.';}else{s.cache=null;if(s.guarded)s.generation='g2';action=s.guarded?'Invalidate: rotate g1 → g2 and delete the saved value.':'Invalidate: delete the saved value.';}
  s.writer++;
 }else throw new Error('Unknown actor');
 s.message=action;s.log.push({actor,action});return s;
}
export function runRace(order,guarded,schedule){return schedule.reduce((s,a)=>raceStep(s,a),raceInitial(order,guarded));}
export const racePresets={serial:{order:'after',schedule:['writer','writer','reader','reader','reader']},refill:{order:'after',schedule:['reader','reader','writer','writer','reader']},early:{order:'before',schedule:['writer','reader','reader','reader','writer']}};
export function outboxInitial(durable=true){return {durable,source:12,cache:12,pending:false,online:true,committed:false,delivered:0,reads:0,message:'Source and cache agree. Commit a price change, then crash before notification.'};}
export function outboxStep(state,action){const s={...state};
 if(action==='commit'){if(s.committed)return state;s.source=15;s.committed=true;s.pending=true;s.message=s.durable?'Commit £15 and an outbox event in one source transaction. Delivery is still pending.':'Commit £15. This process now needs to send an invalidation; nothing durable records that obligation.';}
 else if(action==='crash'){s.online=false;if(!s.durable)s.pending=false;s.message=s.durable?'Writer process stops. The committed outbox event remains.':'Writer process stops. Its unsent notification is lost.';}
 else if(action==='restart'){s.online=true;s.message=s.pending?'Process restarts and can retry the pending invalidation.':'Process restarts with no recorded notification to retry.';}
 else if(action==='deliver'){if(!s.online||!s.pending)return state;s.pending=false;s.cache=null;s.delivered++;s.message='Deliver invalidation and acknowledge the event. The cache entry is deleted.';}
 else if(action==='duplicate'){if(!s.online||!s.delivered)return state;s.cache=null;s.delivered++;s.message='Replay the same deletion. It cannot install an old price, but it can remove a freshly refilled entry.';}
 else if(action==='read'){if(s.cache===null){s.reads++;s.cache=s.source;s.message=`Miss: load £${s.source} from the source and save it.`;}else s.message=`Hit: return £${s.cache}${s.cache!==s.source?' even though the source is now £15':''}.`;}
 else if(action==='expire'){s.cache=null;s.message='The cache lifetime ends. The next read can discover the current price.';}
 else throw new Error('Unknown action');return s;
}
/** Minimal pure form of the native generation protocol, for loss/reinitialisation tests. */
export function guardedFill(state,token,value){return state.guard!==null&&state.guard===token?{...state,value}:{...state};}
export function initialiseGuard(state,newToken){return state.guard===null?{guard:newToken,value:null}:{...state};}
