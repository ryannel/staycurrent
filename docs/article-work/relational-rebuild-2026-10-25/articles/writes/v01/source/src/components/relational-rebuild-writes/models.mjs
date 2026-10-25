export const sourceRows = [
  {row:1, id:'P7', name:'Blue mug', price:'22.00'},
  {row:2, id:'P11', name:'Tea strainer', price:'8.00'},
  {row:3, id:'P3', name:'Green tea, 50 g', price:'-4.50'},
  {row:4, id:'P9', name:'Teapot', price:'36.00'},
];
export const batchStates = [
  {title:'Four received rows', applied:[], validated:false, note:'B17 has four source rows. Nothing has changed in products. Each row still needs a recorded validation decision.'},
  {title:'Three ready; one rejected', applied:[], validated:true, note:'Row 3 proposes a negative price for P3, so it is rejected. Rows 1, 2 and 4 are pending. The catalogue is still unchanged.'},
  {title:'First chunk committed', applied:[1,2], validated:true, note:'One transaction changes P7, inserts P11 and records rows 1 and 2 as applied. Its commit makes both the catalogue changes and the progress records visible together.'},
  {title:'Work stops before the next chunk', applied:[1,2], validated:true, note:'The worker stops before starting row 4’s chunk. Two rows are applied, one is rejected and one is pending. The earlier commit remains.'},
  {title:'Resume commits row 4', applied:[1,2,4], validated:true, note:'The next chunk selects pending row 4. P9 becomes 36.00 and row 4’s applied record commits with it. P3 stays 4.50; its rejection is retained.'},
  {title:'Replay finds no pending rows', applied:[1,2,4], validated:true, note:'The same sealed B17 has no pending rows left. The importer writes nothing. All four source identities are accounted for: three applied and one rejected.'},
];
export function batchStatus(state,row) {
  return !state.validated ? 'Unvalidated' : row === 3 ? 'Rejected' : state.applied.includes(row) ? 'Applied' : 'Pending';
}
