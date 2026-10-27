// Exact Redis Cluster key-slot calculation; the surrounding topology/load models are illustrative.
export function hashInput(key){const start=key.indexOf('{');if(start<0)return key;const end=key.indexOf('}',start+1);return end>start+1?key.slice(start+1,end):key;}
export function crc16(text){let crc=0;for(const byte of new TextEncoder().encode(text)){crc^=byte<<8;for(let bit=0;bit<8;bit++)crc=((crc<<1)^((crc&0x8000)?0x1021:0))&0xffff;}return crc;}
export const keySlot=key=>crc16(hashInput(key))%16384;
export const slotOwner=slot=>slot<=5460?'A':slot<=10922?'B':'C';
export const migrationSteps=[
 {title:'Stable ownership',owner:'B',map:'B',a:'B',b:'B',route:'Client → B → 12',note:'Both keys are on B. The client’s cached slot map points to B.'},
 {title:'Prepare migration',owner:'B',map:'B',a:'B',b:'B',route:'Client → B → 12',note:'C is IMPORTING; B is MIGRATING. Existing keys still execute on B.'},
 {title:'Move key a',owner:'B',map:'B',a:'C',b:'B',route:'Client → B → ASK C',note:'B no longer has a. It redirects this request to C. MGET a b on B returns TRYAGAIN while the keys are split.'},
 {title:'Follow ASK',owner:'B',map:'B',a:'C',b:'B',route:'Client → C: ASKING, GET a → 12',note:'The client retries on C, using ASKING on that connection. Its cached slot map still points to B.'},
 {title:'Move key b',owner:'B',map:'B',a:'C',b:'C',route:'Client → B → ASK C',note:'Both keys are now on C. Ownership has not yet been changed; B still redirects requests for these absent keys.'},
 {title:'Assign ownership to C',owner:'C',map:'B',a:'C',b:'C',route:'Client → B → MOVED C',note:'The destination is assigned first, then the source and other primaries. The client’s old map is now stale.'},
 {title:'Follow MOVED',owner:'C',map:'C',a:'C',b:'C',route:'Client → C → 12',note:'The client refreshes its slot map. Subsequent requests can go directly to C.'},
];
export function hotKeyLoad(shards=3,percent=50){const demand=240,budget=100,hot=demand*percent/100,cold=(demand-hot)/shards;const nodes=Array.from({length:shards},(_,i)=>({hot:i===0?hot:0,cold,total:cold+(i===0?hot:0)}));return{demand,budget,hot,cold,nodes,excess:nodes.reduce((n,p)=>n+Math.max(0,p.total-budget),0)};}
export function clusterAvailability(fault='none',promoted=false,fullCoverage=true){const failedPrimary=fault==='ab'?[true,true,false]:fault==='none'?[false,false,false]:[true,false,false];const failedReplica=[fault==='pair',false,false];const mayPromote=fault==='a';const promotion=promoted&&mayPromote;const connected=failedPrimary.filter(v=>!v).length+(promotion?1:0),covered=connected,majority=connected>=2;return{failedPrimary,failedReplica,promotion,mayPromote,connected,covered,majority,serveHealthy:majority&&(!fullCoverage||covered===3)};}
