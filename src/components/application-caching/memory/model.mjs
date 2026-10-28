// Invented, sequential requests. Units are charged entry bytes, not Redis allocations.
export const phases = [
  {name:'Warm P7 and P3', ids:['P7','P3','P7','P3','P7','P3']},
  {name:'One-time scan', ids:['Q','P40']},
  {name:'Return to P7 and P3', ids:['P7','P3']},
  {name:'New popular cards', ids:['P8','P9','P8','P9','P8','P9','P8','P9']},
];
export const trace = phases.flatMap(phase=>phase.ids.map(id=>({id,phase:phase.name,size:id==='Q'?3:1,cost:id==='Q'?20:id==='P9'?12:2})));
export const policies = {lru:'Least recently used',lfu:'Least frequently used, no decay',second:'Second request, then LRU'};
export function replay({capacity=3,policy='lru',maxEntry=3}={}) {
  const residents=new Map(); let hits=0,reads=0,saved=0,work=0,evictions=0,skipped=0;
  const snapshot=()=>({residents:[...residents.values()].map(value=>({...value})),hits,reads,saved,work,evictions,skipped,used:[...residents.values()].reduce((n,value)=>n+value.size,0)});
  const result=[{...snapshot(),request:null,text:'The cache is empty. Each miss reads the source; the selected admission rule decides whether to keep the answer.'}];
  trace.forEach((request,index)=>{
    const {id,size,cost}=request;const current=residents.get(id);let text;const removed=[];
    if(current){hits++;saved+=cost;current.count++;current.last=index+1;text=`${id} is a hit. Reusing it avoids ${cost} units of source work.`;}
    else{
      reads++;work+=cost;
      const seen=trace.slice(Math.max(0,index-8),index).some(item=>item.id===id);
      if(size>capacity||size>maxEntry){skipped++;text=`${id} misses. Read the source (${cost} work units), return its answer, and skip the fill: this ${size}-unit entry exceeds the size allowance.`;}
      else if(policy==='second'&&!seen){skipped++;text=`${id} misses. Read the source (${cost} work units), but do not fill: it has not appeared in the preceding eight requests.`;}
      else{
        while([...residents.values()].reduce((n,value)=>n+value.size,0)+size>capacity){
          const victim=[...residents.values()].sort((a,b)=>policy==='lfu'?(a.count-b.count||a.last-b.last):a.last-b.last)[0];
          residents.delete(victim.id);removed.push(victim.id);evictions++;
        }
        residents.set(id,{id,size,count:1,last:index+1});
        text=`${id} misses. Read the source (${cost} work units). ${removed.length?`Evict ${removed.join(', ')} to make room. `:''}Keep ${id}, charging ${size} memory unit${size===1?'':'s'}.`;
      }
    }
    result.push({...snapshot(),request:{...request,number:index+1},hit:!!current,removed,text});
  });
  return result;
}
