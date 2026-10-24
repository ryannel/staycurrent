export const regions = [{name:'eu-north',votes:2},{name:'eu-west',votes:2},{name:'us-east',votes:1}];
export function quorum(unavailable = [], connected = true) {
  const remaining = regions.filter(r => !unavailable.includes(r.name));
  const available = remaining.reduce((n,r) => n+r.votes,0);
  const largest = connected ? available : Math.max(0,...remaining.map(r => r.votes));
  return {available,largest,possible:largest >= 3,required:3};
}
