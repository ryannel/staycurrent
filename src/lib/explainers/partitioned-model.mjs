export const readings = ['A1','A2','B1','B2','C1','C2'].flatMap((device, d) => [9, 10].map(hour => ({ id: `${device}-${hour}`, customer: { A: 'Alder', B: 'Birch', C: 'Cedar' }[device[0]], device, hour, temperature: 18 + d + hour - 9 })));
export function historyPlan({ layout = 'customer', query = 'customer', order = 'time', index = false, membership = false } = {}) {
  const target = query === 'customer' ? 'Birch' : 'B1';
  const matches = readings.filter(r => r[query] === target && r.hour >= 10);
  const effective = index ? query : layout;
  const knownDevices = membership && effective === 'device' && query === 'customer' ? ['B1', 'B2'] : null;
  const groups = [...new Set(readings.map(r => r[effective]))].map(key => {
    const rows = readings.filter(r => r[effective] === key).sort((a,b) => order === 'time' ? a.hour-b.hour || a.device.localeCompare(b.device) : b.temperature-a.temperature);
    const routed = effective === query;
    const accessed = routed ? key === target : knownDevices ? knownDevices.includes(key) : true;
    const examined = accessed ? (order === 'time' ? rows.filter(r => r.hour >= 10) : rows) : [];
    return { key, rows, accessed, examined };
  });
  return { groups, matches, examined: groups.reduce((n,g) => n+g.examined.length,0), requests: groups.filter(g=>g.accessed).length, copies: readings.length*(index ? 2 : 1), effective, knownDevices };
}
export function writeBuckets(shards = 1, hot = true) {
  if (![1,2,4].includes(shards)) throw new RangeError('Choose one, two or four buckets');
  const devices = ['A1','A2','B1','B2','C1','C2'];
  const counts = hot ? [6,6,70,6,6,6] : [17,17,17,17,16,16];
  const buckets = devices.flatMap((device,d) => Array.from({length:shards},(_,s) => ({ key: `${device}/${s}`, writes: Math.floor(counts[d]/shards)+(s < counts[d]%shards ? 1 : 0) })));
  return { buckets, total: counts.reduce((a,b)=>a+b,0), largest: Math.max(...buckets.map(b=>b.writes)), fanout: shards };
}
